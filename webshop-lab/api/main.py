import os
import random
import time
from datetime import datetime, timezone
from functools import wraps

import psycopg
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from psycopg.rows import dict_row
from starlette.responses import Response


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://webshop:webshop@localhost:5432/webshop")

REQUESTS = Counter("webshop_api_requests_total", "HTTP requests served by the webshop API", ["endpoint"])
LATENCY = Histogram("webshop_api_latency_seconds", "Request latency for webshop API endpoints", ["endpoint"])
PREDICTIONS = Counter("webshop_churn_predictions_total", "Churn predictions generated")

app = FastAPI(
    title="WebShop Pro API",
    description="Dummy webshop serving layer for the project-based crash courses.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def query(sql, params=None, fetch="all"):
    with psycopg.connect(DATABASE_URL, row_factory=dict_row) as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params or {})
            if fetch == "one":
                return cur.fetchone()
            if fetch == "none":
                return None
            return cur.fetchall()


def timed(endpoint):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            try:
                REQUESTS.labels(endpoint=endpoint).inc()
                return fn(*args, **kwargs)
            finally:
                LATENCY.labels(endpoint=endpoint).observe(time.perf_counter() - start)
        return wrapper
    return decorator


@app.get("/health")
@timed("health")
def health():
    try:
      row = query("SELECT 1 AS ok", fetch="one")
    except Exception as exc:
      raise HTTPException(status_code=503, detail=str(exc)) from exc
    return {"status": "ok", "database": row["ok"] == 1}


@app.get("/api/catalog")
@timed("catalog")
def catalog():
    return query(
        """
        SELECT sku, name, category, brand, price, stock, rating::float AS rating, margin::float AS margin
        FROM raw.catalog
        ORDER BY sku
        """
    )


@app.get("/api/orders")
@timed("orders")
def orders():
    return query(
        """
        SELECT order_id, customer_id, sku, qty, gross_amount, city, channel, status, ordered_at
        FROM raw.orders
        ORDER BY ordered_at
        """
    )


@app.get("/api/events")
@timed("events")
def events():
    return query(
        """
        SELECT event_id, session_id, customer_id, event_type, sku, ts
        FROM raw.events
        ORDER BY ts
        """
    )


@app.get("/api/course-materials")
@timed("course_materials")
def course_materials():
    return query(
        """
        SELECT course_slug, course_title, primary_services, artifact, how_to_use
        FROM course.materials
        ORDER BY course_slug
        """
    )


@app.get("/api/metrics")
@timed("business_metrics")
def business_metrics():
    row = query(
        """
        WITH paid AS (
          SELECT * FROM raw.orders WHERE status = 'paid'
        ),
        sessions AS (
          SELECT COUNT(DISTINCT session_id) AS session_count FROM raw.events
        ),
        checkout AS (
          SELECT COUNT(*) AS checkout_count FROM raw.events WHERE event_type = 'checkout_started'
        )
        SELECT
          COALESCE(SUM(paid.gross_amount), 0)::int AS revenue,
          COUNT(paid.*)::int AS paid_orders,
          COALESCE(ROUND(AVG(paid.gross_amount)), 0)::int AS avg_order_value,
          (SELECT session_count FROM sessions)::int AS sessions,
          (SELECT checkout_count FROM checkout)::int AS checkout_events,
          (SELECT COUNT(*) FROM raw.events WHERE event_type = 'support_question')::int AS support_tickets
        FROM paid
        """,
        fetch="one",
    )
    sessions = max(row["sessions"] or 1, 1)
    return {
        **row,
        "conversion": round((row["checkout_events"] or 0) / sessions, 4),
    }


@app.post("/api/simulate-order")
@timed("simulate_order")
def simulate_order():
    products = query("SELECT sku, price FROM raw.catalog WHERE stock > 0 ORDER BY random() LIMIT 1")
    if not products:
        raise HTTPException(status_code=409, detail="No product with stock available")

    product = products[0]
    now = datetime.now(timezone.utc)
    suffix = int(now.timestamp() * 1000)
    order_id = f"O-{suffix}"
    event_id = f"E-{suffix}"
    session_id = f"S-{random.randint(500, 999)}"
    customer_id = f"C-{random.randint(2200, 2600)}"

    with psycopg.connect(DATABASE_URL, row_factory=dict_row) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO raw.orders (order_id, customer_id, sku, qty, gross_amount, city, channel, status, ordered_at)
                VALUES (%s, %s, %s, 1, %s, 'Budapest', 'demo_api', 'paid', %s)
                RETURNING order_id, customer_id, sku, qty, gross_amount, city, channel, status, ordered_at
                """,
                (order_id, customer_id, product["sku"], product["price"], now),
            )
            order = cur.fetchone()
            cur.execute(
                """
                INSERT INTO raw.events (event_id, session_id, customer_id, event_type, sku, ts)
                VALUES (%s, %s, %s, 'checkout_started', %s, %s)
                """,
                (event_id, session_id, customer_id, product["sku"], now),
            )
            cur.execute("UPDATE raw.catalog SET stock = GREATEST(stock - 1, 0) WHERE sku = %s", (product["sku"],))
            conn.commit()

    return order


@app.post("/predict")
@timed("predict")
def predict(payload: dict):
    customer_id = str(payload.get("customer_id") or "C-1842")
    feature = query(
        """
        SELECT customer_id, paid_order_count, lifetime_value, support_questions, checkout_started
        FROM ml.customer_features
        WHERE customer_id = %(customer_id)s
        """,
        {"customer_id": customer_id},
        fetch="one",
    )
    if not feature:
        feature = {
            "customer_id": customer_id,
            "paid_order_count": 0,
            "lifetime_value": 0,
            "support_questions": 0,
            "checkout_started": 0,
        }

    score = 0.18
    score += min(feature["support_questions"] * 0.18, 0.36)
    score -= min(feature["paid_order_count"] * 0.05, 0.18)
    score -= min((feature["lifetime_value"] or 0) / 1_500_000, 0.16)
    score += 0.08 if feature["checkout_started"] == 0 else 0
    probability = round(min(max(score, 0.03), 0.91), 4)
    reason = "support-heavy customer" if feature["support_questions"] else "low activity demo baseline"

    query(
        """
        INSERT INTO ml.predictions (customer_id, churn_probability, reason)
        VALUES (%(customer_id)s, %(probability)s, %(reason)s)
        """,
        {"customer_id": customer_id, "probability": probability, "reason": reason},
        fetch="none",
    )
    PREDICTIONS.inc()
    return {"customer_id": customer_id, "churn_probability": probability, "reason": reason, "features": feature}


@app.get("/metrics")
def prometheus_metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
