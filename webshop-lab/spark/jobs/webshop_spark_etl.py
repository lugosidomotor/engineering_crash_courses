from pathlib import Path

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, countDistinct, sum as spark_sum


FIXTURES = Path("/opt/webshop-fixtures")
OUTPUT = "/opt/webshop-output/spark"


spark = (
    SparkSession.builder
    .appName("webshop-pro-spark-etl")
    .config("spark.default.parallelism", "1")
    .config("spark.executor.memory", "512m")
    .config("spark.sql.shuffle.partitions", "1")
    .getOrCreate()
)

json_reader = spark.read.option("multiLine", "true")

catalog = json_reader.json(str(FIXTURES / "catalog.json"))
orders = json_reader.json(str(FIXTURES / "orders.json"))
events = json_reader.json(str(FIXTURES / "events.json"))

paid_orders = orders.filter(col("status") == "paid")

product_views = (
    events
    .filter(col("event_type") == "product_view")
    .groupBy("sku")
    .agg(countDistinct("session_id").alias("product_view_sessions"))
)

product_performance = (
    catalog
    .join(paid_orders.groupBy("sku").agg(
        spark_sum("gross_amount").alias("paid_revenue"),
        spark_sum("qty").alias("paid_units"),
    ), on="sku", how="left")
    .join(product_views, on="sku", how="left")
    .fillna({"paid_revenue": 0, "paid_units": 0, "product_view_sessions": 0})
)

paid_orders.coalesce(1).write.mode("overwrite").parquet(f"{OUTPUT}/silver/paid_orders")
product_performance.coalesce(1).write.mode("overwrite").parquet(f"{OUTPUT}/gold/product_performance")

spark.stop()
