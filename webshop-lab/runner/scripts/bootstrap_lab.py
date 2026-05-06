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


def main():
    catalog = pd.DataFrame(read_fixture("catalog.json"))
    orders = pd.DataFrame(read_fixture("orders.json"))
    events = pd.DataFrame(read_fixture("events.json"))
    orders["ordered_at"] = pd.to_datetime(orders["ordered_at"], utc=True)
    events["ts"] = pd.to_datetime(events["ts"], utc=True)

    report = {
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

    output_file = OUTPUT / "webshop_lab_report.json"
    output_file.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
