from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from urllib.request import urlopen

from airflow import DAG
from airflow.operators.python import PythonOperator


FIXTURES = Path("/opt/webshop-fixtures")
OUTPUT = Path("/opt/webshop-output/airflow")


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
    tags=["webshop-pro", "course-lab", "airflow-orchestration"],
) as dag:
    ingest = PythonOperator(task_id="ingest_sources_to_bronze", python_callable=ingest_sources)
    check = PythonOperator(task_id="run_data_quality_checks", python_callable=quality_check)
    gold = PythonOperator(task_id="build_gold_product_metrics", python_callable=build_gold_metrics)
    serving = PythonOperator(task_id="check_fastapi_serving_layer", python_callable=ping_serving_api)

    ingest >> check >> gold >> serving
