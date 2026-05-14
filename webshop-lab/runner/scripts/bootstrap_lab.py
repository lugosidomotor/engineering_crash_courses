import json
import os
from pathlib import Path

import pandas as pd
import requests
from psycopg import connect
from psycopg.rows import dict_row


FIXTURES = Path("/fixtures")
OUTPUT = Path("/output")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://webshop:webshop@postgres:5432/webshop")
API_URL = os.getenv("API_URL", "http://api:8000").rstrip("/")
CHROMA_URL = os.getenv("CHROMA_URL", "http://chroma:8000").rstrip("/")
MLFLOW_TRACKING_URI = os.getenv("MLFLOW_TRACKING_URI", "http://mlflow:5000").rstrip("/")
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "http://minio:9000").rstrip("/")

COURSE_MATERIALS = [
    {
        "id": "sql-data-modeling",
        "title": "SQL & Data Modeling",
        "service": "postgres",
        "summary": "A raw.catalog, raw.orders es raw.events tablakon gyakorolhatoak a JOIN-ok, aggregaciok es star schema alapok.",
    },
    {
        "id": "python-data-engineering",
        "title": "Python for Data Engineering",
        "service": "lab-runner",
        "summary": "A fixture JSON adatokbol Bronze/Silver/Gold Parquet kimenetek keszulnek a /output kotetbe.",
    },
    {
        "id": "docker-local-data-platform",
        "title": "Docker & Local Data Platform",
        "service": "course-site, webshop, postgres, minio, prometheus, grafana",
        "summary": "A teljes WebShop Pro lab egy compose stackben indul, service cimkekkel es reprodukalhato lokalis runtime-mal.",
    },
    {
        "id": "delta-table-crash-course",
        "title": "Delta Table Crash Course",
        "service": "lab-runner, spark-master, minio",
        "summary": "A webshop rendeleseibol Bronze/Silver/Gold Delta es Parquet retegek keszulnek verziozhato lakehouse mintakent.",
    },
    {
        "id": "open-table-formats",
        "title": "Open Table Formats",
        "service": "lab-runner, minio, unity-catalog",
        "summary": "A Delta, Iceberg es Hudi dontesi szempontjai ugyanazon webshop adatuton hasonlithatoak ossze.",
    },
    {
        "id": "spark-crash-course",
        "title": "Apache Spark Crash Course",
        "service": "spark-master",
        "summary": "A spark/jobs/webshop_spark_etl.py nagyobb adatpipeline-kent dolgozza fel ugyanazt a webshop adatutat.",
    },
    {
        "id": "airflow-orchestration",
        "title": "Airflow & Orchestration",
        "service": "airflow",
        "summary": "A webshop_daily_etl DAG mutatja, hogyan lesz a kezi scriptbol utemezett, kovetheto workflow.",
    },
    {
        "id": "dbt-analytics-engineering",
        "title": "dbt Analytics Engineering",
        "service": "dbt",
        "summary": "A staging es mart modellek a webshop riportreteget dokumentalt, tesztelt SQL projektta alakitjak.",
    },
    {
        "id": "databricks-lakehouse",
        "title": "Databricks Lakehouse",
        "service": "databricks-local, unity-catalog, spark-master, mlflow",
        "summary": "A lokalis JupyterLab, Spark, MLflow es Unity Catalog OSS kombinacio managed lakehouse mental modellt ad.",
    },
    {
        "id": "data-governance",
        "title": "Data Governance",
        "service": "postgres, unity-catalog, lab-runner, minio, prometheus, grafana",
        "summary": "PII felismeres, hozzaferesi policy, lineage es audit gondolkodas kapcsolodik a WebShop Pro adatokhoz.",
    },
    {
        "id": "data-mesh",
        "title": "Data Mesh",
        "service": "dbt, unity-catalog, postgres, lab-runner, minio",
        "summary": "A webshop domenjei data productokra, contractokra, SLA-kra es catalog discovery mintakra bonthatoak.",
    },
    {
        "id": "streaming-engineering",
        "title": "Streaming Engineering",
        "service": "kafka, event-producer, spark-master",
        "summary": "A clickstream es checkout esemenyek Kafka topicokbol dolgozhatoak fel kozel valos idoben.",
    },
    {
        "id": "ai-data-engineer",
        "title": "AI Data Engineer",
        "service": "lab-runner, dbt, kafka, postgres",
        "summary": "A webshop customer es product feature retegei AI-ready formaba kerulnek data quality ellenorzessel.",
    },
    {
        "id": "ai-engineering",
        "title": "AI Engineering",
        "service": "chroma, streamlit, api",
        "summary": "A webshop support szabalyzatok ChromaDB-be kerulnek, a Streamlit UI pedig bemutatja a RAG felhasznaloi utat.",
    },
    {
        "id": "rag-evaluation-ai-safety",
        "title": "RAG Evaluation & AI Safety",
        "service": "lab-runner, chroma, api",
        "summary": "Golden dataset, retrieval metrikak es hallucination regression suite helye a support bot minosegmeresehez.",
    },
    {
        "id": "llmops-genai-production",
        "title": "LLMOps / GenAI Production",
        "service": "mlflow, api, prometheus, grafana",
        "summary": "Prompt verziozas, koltseg/latency kovetes es production fallback gondolkodas kapcsolodik az LLM apphoz.",
    },
    {
        "id": "agentic-ai",
        "title": "Agentic AI",
        "service": "api, streamlit, chroma, lab-runner, prometheus, grafana",
        "summary": "Tool-calling ugyfel-agent, LangGraph/CrewAI mental modell, runtime endpointok es monitoring hely.",
    },
    {
        "id": "aiops-mlops",
        "title": "AIOps & MLOps",
        "service": "mlflow, api, prometheus, grafana",
        "summary": "A /predict endpoint, MLflow demo run es Grafana dashboard megmutatja a modell serving es monitoring kapcsolatot.",
    },
]

SUPPORT_DOCS = [
    {
        "id": "shipping-policy",
        "title": "Szallitasi szabalyzat",
        "text": "Fizetett rendelestol szamitva a WebShop Pro standard szallitasi ideje 2 munkanap Budapesten es 3 munkanap videki cimre.",
    },
    {
        "id": "return-policy",
        "title": "Visszakuldes",
        "text": "A vasarlo 14 napon belul jelezheti az elallast. A termeknek serulesmentes allapotban kell visszaerkeznie.",
    },
    {
        "id": "warranty-policy",
        "title": "Garancia",
        "text": "Minden elektronikai termekhez legalabb 12 honap jotallas tartozik. Premium termekeknel ez 24 honap.",
    },
]


def read_fixture(name):
    with (FIXTURES / name).open("r", encoding="utf-8") as fh:
        return json.load(fh)


def write_layer(name, frame):
    target = OUTPUT / name
    target.mkdir(parents=True, exist_ok=True)
    frame.to_parquet(target / "part-000.parquet", index=False)
    return str(target)


def write_delta_if_available(frame):
    target = OUTPUT / "delta" / "orders_delta"
    try:
        from deltalake.writer import write_deltalake

        write_deltalake(str(target), frame, mode="overwrite")
        return {"format": "delta", "path": str(target), "status": "created"}
    except Exception as exc:
        fallback = write_layer("delta/orders_delta_fallback_parquet", frame)
        return {"format": "delta", "path": fallback, "status": f"fallback parquet: {exc}"}


def validate_orders(orders):
    problems = []
    if orders["order_id"].duplicated().any():
        problems.append("duplicate order_id")
    if (orders["gross_amount"] <= 0).any():
        problems.append("non-positive gross_amount")
    if not set(orders["status"]).issubset({"paid", "refunded", "cancelled"}):
        problems.append("unexpected order status")
    return problems


def write_course_materials():
    target = OUTPUT / "course-materials"
    target.mkdir(parents=True, exist_ok=True)
    for material in COURSE_MATERIALS:
        body = "\n".join([
            f"# {material['title']}",
            "",
            f"Service: `{material['service']}`",
            "",
            material["summary"],
            "",
        ])
        (target / f"{material['id']}.md").write_text(body, encoding="utf-8")
    (target / "support-policies.json").write_text(
        json.dumps(SUPPORT_DOCS, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    return str(target)


def preload_chroma():
    try:
        import chromadb

        host = CHROMA_URL.replace("http://", "").replace("https://", "").split(":")[0]
        port = int(CHROMA_URL.rsplit(":", 1)[1]) if ":" in CHROMA_URL.replace("http://", "") else 8000
        client = chromadb.HttpClient(host=host, port=port)
        collection = client.get_or_create_collection("webshop_course_materials")
        docs = SUPPORT_DOCS + [
            {
                "id": material["id"],
                "title": material["title"],
                "text": material["summary"],
            }
            for material in COURSE_MATERIALS
        ]
        collection.upsert(
            ids=[doc["id"] for doc in docs],
            documents=[doc["text"] for doc in docs],
            metadatas=[{"title": doc["title"], "source": "webshop-pro-lab"} for doc in docs],
            embeddings=[[float(index), 1.0, 0.5, 0.25] for index, _ in enumerate(docs, start=1)],
        )
        return {"collection": "webshop_course_materials", "documents": len(docs)}
    except Exception as exc:
        return {"status": "skipped", "error": str(exc)}


def preload_mlflow(report):
    try:
        import mlflow

        mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
        mlflow.set_experiment("webshop-pro-course-lab")
        with mlflow.start_run(run_name="bootstrap-course-materials"):
            mlflow.log_param("project", "WebShop Pro")
            mlflow.log_param("course_count", len(COURSE_MATERIALS))
            mlflow.log_metric("catalog_rows", report["source_rows"]["catalog"])
            mlflow.log_metric("order_rows", report["source_rows"]["orders"])
            mlflow.log_metric("event_rows", report["source_rows"]["events"])
            mlflow.log_artifact(str(OUTPUT / "webshop_lab_report.json"))
        return {"experiment": "webshop-pro-course-lab", "status": "created"}
    except Exception as exc:
        return {"status": "skipped", "error": str(exc)}


def preload_minio_artifacts():
    try:
        import boto3

        client = boto3.client(
            "s3",
            endpoint_url=MINIO_ENDPOINT,
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID", "minioadmin"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY", "minioadmin"),
        )
        for bucket in ["webshop-bronze", "webshop-silver", "webshop-gold", "webshop-artifacts"]:
            try:
                client.create_bucket(Bucket=bucket)
            except Exception:
                pass
        for file in (OUTPUT / "course-materials").glob("*"):
            client.upload_file(str(file), "webshop-artifacts", f"course-materials/{file.name}")
        client.upload_file(str(OUTPUT / "webshop_lab_report.json"), "webshop-artifacts", "reports/webshop_lab_report.json")
        return {"bucket": "webshop-artifacts", "status": "uploaded"}
    except Exception as exc:
        return {"status": "skipped", "error": str(exc)}


def main():
    catalog = pd.DataFrame(read_fixture("catalog.json"))
    orders = pd.DataFrame(read_fixture("orders.json"))
    events = pd.DataFrame(read_fixture("events.json"))
    orders["ordered_at"] = pd.to_datetime(orders["ordered_at"], utc=True)
    events["ts"] = pd.to_datetime(events["ts"], utc=True)

    report = {
        "source_rows": {
            "catalog": int(len(catalog)),
            "orders": int(len(orders)),
            "events": int(len(events)),
        },
        "bronze": {
            "catalog": write_layer("bronze/catalog", catalog),
            "orders": write_layer("bronze/orders", orders),
            "events": write_layer("bronze/events", events),
        }
    }

    paid_orders = orders[orders["status"] == "paid"].copy()
    product_performance = (
        paid_orders.groupby("sku", as_index=False)
        .agg(paid_revenue=("gross_amount", "sum"), paid_units=("qty", "sum"))
        .merge(catalog, on="sku", how="right")
        .fillna({"paid_revenue": 0, "paid_units": 0})
    )
    customer_features = (
        paid_orders.groupby("customer_id", as_index=False)
        .agg(
            paid_order_count=("order_id", "count"),
            lifetime_value=("gross_amount", "sum"),
            last_order_at=("ordered_at", "max"),
        )
    )

    report["silver"] = {
        "paid_orders": write_layer("silver/paid_orders", paid_orders),
        "quality_problems": validate_orders(orders),
    }
    report["gold"] = {
        "product_performance": write_layer("gold/product_performance", product_performance),
        "customer_features": write_layer("gold/customer_features", customer_features),
    }
    report["table_formats"] = {
        "delta": write_delta_if_available(paid_orders),
        "iceberg": "pyiceberg installed in lab-runner; use with Unity Catalog/Iceberg REST catalog exercises",
        "hudi": "Hudi is documented as an open table format comparison target; Spark bundle required for full writes",
    }

    with connect(DATABASE_URL, row_factory=dict_row) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) AS orders FROM raw.orders")
            report["postgres"] = dict(cur.fetchone())

    try:
        report["api_health"] = requests.get(f"{API_URL}/health", timeout=5).json()
    except Exception as exc:
        report["api_health"] = {"status": "unreachable", "error": str(exc)}

    report["course_materials"] = write_course_materials()

    output_file = OUTPUT / "webshop_lab_report.json"
    output_file.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    report["chroma"] = preload_chroma()
    output_file.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    report["mlflow"] = preload_mlflow(report)
    output_file.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    report["minio_artifacts"] = preload_minio_artifacts()
    output_file.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
