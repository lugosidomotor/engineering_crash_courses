from datetime import timedelta

from feast import Entity, FeatureView, Field, FileSource
from feast.types import Float32, Int64, String, UnixTimestamp


customer = Entity(name="customer", join_keys=["customer_id"])

customer_source = FileSource(
    name="customer_features_source",
    path="/output/gold/customer_features/part-000.parquet",
    timestamp_field="last_order_at",
)

customer_features = FeatureView(
    name="customer_features",
    entities=[customer],
    ttl=timedelta(days=30),
    schema=[
        Field(name="customer_id", dtype=String),
        Field(name="paid_order_count", dtype=Int64),
        Field(name="lifetime_value", dtype=Float32),
        Field(name="last_order_at", dtype=UnixTimestamp),
    ],
    source=customer_source,
)
