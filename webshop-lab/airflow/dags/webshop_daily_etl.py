from __future__ import annotations

import json
import time
from datetime import datetime
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request
from urllib.request import urlopen

from airflow import DAG
from airflow.operators.python import PythonOperator


FIXTURES = Path("/opt/webshop-fixtures")
OUTPUT = Path("/opt/webshop-output/airflow")
SPARK_REST_URL = "http://spark-master:6066/v1/submissions"
SPARK_APP_RESOURCE = "file:///opt/webshop-lab/spark/jobs/webshop_spark_etl.py"
SPARK_VERSION = "3.5.3"
SPARK_POLL_ATTEMPTS = 120
SPARK_POLL_SECONDS = 2
SPARK_JAVA_OPTS = " ".join(
    [
        "--add-opens=java.base/java.lang=ALL-UNNAMED",
        "--add-opens=java.base/java.lang.invoke=ALL-UNNAMED",
        "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED",
        "--add-opens=java.base/java.io=ALL-UNNAMED",
        "--add-opens=java.base/java.net=ALL-UNNAMED",
        "--add-opens=java.base/java.nio=ALL-UNNAMED",
        "--add-opens=java.base/java.util=ALL-UNNAMED",
        "--add-opens=java.base/java.util.concurrent=ALL-UNNAMED",
        "--add-opens=java.base/java.util.concurrent.atomic=ALL-UNNAMED",
        "--add-opens=java.base/jdk.internal.ref=ALL-UNNAMED",
        "--add-opens=java.base/sun.nio.ch=ALL-UNNAMED",
        "--add-opens=java.base/sun.nio.cs=ALL-UNNAMED",
        "--add-opens=java.base/sun.security.action=ALL-UNNAMED",
        "--add-opens=java.base/sun.util.calendar=ALL-UNNAMED",
        "--add-opens=java.security.jgss/sun.security.krb5=ALL-UNNAMED",
        "-Djdk.reflect.useDirectMethodHandle=false",
    ]
)


def read_json(name: str):
    with (FIXTURES / name).open("r", encoding="utf-8") as fh:
        return json.load(fh)


def ingest_sources():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    manifest = {
        "catalog_rows": len(read_json("catalog.json")),
        "order_rows": len(read_json("orders.json")),
        "event_rows": len(read_json("events.json")),
        "layer": "bronze",
    }
    (OUTPUT / "bronze_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


def quality_check():
    orders = read_json("orders.json")
    seen = set()
    problems = []
    for order in orders:
        if order["order_id"] in seen:
            problems.append(f"duplicate order_id: {order['order_id']}")
        seen.add(order["order_id"])
        if order["gross_amount"] <= 0:
            problems.append(f"invalid gross_amount: {order['order_id']}")
    result = {"status": "passed" if not problems else "failed", "problems": problems}
    (OUTPUT / "quality_report.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    if problems:
        raise ValueError(result)
    return result


def spark_request(path: str, payload: dict | None = None):
    data = None
    headers = {}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json;charset=UTF-8"

    request = Request(f"{SPARK_REST_URL}{path}", data=data, headers=headers)
    try:
        with urlopen(request, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))
    except URLError as exc:
        raise RuntimeError(f"Spark REST API is not reachable at {SPARK_REST_URL}: {exc}") from exc


def run_spark_product_etl():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    payload = {
        "action": "CreateSubmissionRequest",
        "appResource": SPARK_APP_RESOURCE,
        "clientSparkVersion": SPARK_VERSION,
        "environmentVariables": {
            "SPARK_ENV_LOADED": "1",
            "PYSPARK_DRIVER_PYTHON": "python3",
            "PYSPARK_PYTHON": "python3",
        },
        "mainClass": "org.apache.spark.deploy.PythonRunner",
        "sparkProperties": {
            "spark.app.name": "webshop-pro-spark-etl-airflow",
            "spark.master": "spark://spark-master:7077",
            "spark.submit.deployMode": "cluster",
            "spark.driver.supervise": "false",
            "spark.cores.max": "1",
            "spark.driver.memory": "512m",
            "spark.driver.extraJavaOptions": SPARK_JAVA_OPTS,
            "spark.executor.memory": "512m",
            "spark.executor.extraJavaOptions": SPARK_JAVA_OPTS,
            "spark.pyspark.driver.python": "python3",
            "spark.pyspark.python": "python3",
            "spark.sql.shuffle.partitions": "1",
        },
        "appArgs": [SPARK_APP_RESOURCE, ""],
    }

    submission = spark_request("/create", payload)
    (OUTPUT / "spark_submission.json").write_text(json.dumps(submission, indent=2), encoding="utf-8")
    if not submission.get("success"):
        raise RuntimeError(f"Spark submission failed: {submission}")

    submission_id = submission["submissionId"]
    terminal_states = {"FINISHED", "ERROR", "FAILED", "KILLED", "UNKNOWN"}
    last_status = {}
    for _ in range(SPARK_POLL_ATTEMPTS):
        time.sleep(SPARK_POLL_SECONDS)
        last_status = spark_request(f"/status/{submission_id}")
        state = last_status.get("driverState")
        if state in terminal_states:
            break

    (OUTPUT / "spark_status.json").write_text(json.dumps(last_status, indent=2), encoding="utf-8")
    if last_status.get("driverState") != "FINISHED":
        raise RuntimeError(f"Spark job did not finish successfully: {last_status}")

    return {
        "submission_id": submission_id,
        "driver_state": last_status.get("driverState"),
        "spark_output": "/opt/webshop-output/spark",
    }


def build_gold_metrics():
    catalog = {item["sku"]: item for item in read_json("catalog.json")}
    orders = [order for order in read_json("orders.json") if order["status"] == "paid"]
    metrics = {}
    for order in orders:
        product = catalog[order["sku"]]
        row = metrics.setdefault(
            order["sku"],
            {
                "sku": order["sku"],
                "name": product["name"],
                "category": product["category"],
                "paid_revenue": 0,
                "paid_units": 0,
            },
        )
        row["paid_revenue"] += order["gross_amount"]
        row["paid_units"] += order["qty"]
    payload = list(metrics.values())
    (OUTPUT / "gold_product_performance.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return {"gold_rows": len(payload)}


def ping_serving_api():
    with urlopen("http://api:8000/health", timeout=5) as response:
        payload = json.loads(response.read().decode("utf-8"))
    (OUTPUT / "serving_health.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return payload


with DAG(
    dag_id="webshop_daily_etl",
    description="WebShop Pro source -> bronze -> quality -> gold -> serving health DAG",
    schedule="@daily",
    start_date=datetime(2026, 5, 6),
    catchup=False,
    max_active_runs=1,
    tags=["webshop-pro", "course-lab", "airflow-orchestration"],
) as dag:
    ingest = PythonOperator(task_id="ingest_sources_to_bronze", python_callable=ingest_sources)
    check = PythonOperator(task_id="run_data_quality_checks", python_callable=quality_check)
    spark_etl = PythonOperator(task_id="run_spark_product_etl", python_callable=run_spark_product_etl)
    gold = PythonOperator(task_id="build_gold_product_metrics", python_callable=build_gold_metrics)
    serving = PythonOperator(task_id="check_fastapi_serving_layer", python_callable=ping_serving_api)

    ingest >> check >> spark_etl >> gold >> serving
