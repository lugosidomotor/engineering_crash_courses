# WebShop Pro kurzusanyag térkép

Ez a dokumentum kerül be a lab több rétegébe:

- PostgreSQL: `course.materials` tábla
- MinIO: `webshop-artifacts/course-materials/`
- ChromaDB: `webshop_course_materials` collection
- MLflow: `webshop-pro-course-lab` experiment artefaktum

## Kurzusok

| Kurzus | Service-ek | Artefaktum |
| --- | --- | --- |
| SQL & Data Modeling | postgres | `raw.*`, `analytics.*`, `course.materials` |
| Python for Data Engineering | lab-runner, lab-bootstrap | Bronze/Silver/Gold Parquet |
| Docker & Local Data Platform | teljes compose | lokális fejlesztői stack |
| Delta Table Crash Course | lab-runner, minio, spark-master | Delta/Parquet kimenetek |
| Open Table Formats | lab-runner, minio, unity-catalog | Delta/Iceberg/Hudi döntési minta |
| Apache Spark Crash Course | spark-master, spark-worker | `webshop_spark_etl.py`, silver/gold Parquet kimenetek |
| Airflow & Orchestration | airflow, spark-master, spark-worker | `webshop_daily_etl` DAG, amely Spark ETL-t submitol |
| dbt Analytics Engineering | dbt, postgres | staging és mart modellek |
| Streaming Engineering | kafka, event-producer | clickstream topicok |
| AI Data Engineer | lab-runner, dbt, kafka | feature store és data quality minta |
| AI Engineering | chroma, streamlit, api | support RAG dokumentumok |
| RAG Evaluation & AI Safety | lab-runner, chroma, api | golden dataset és evaluációs hely |
| LLMOps / GenAI Production | mlflow, prometheus, grafana, api | prompt/model monitoring hely |
| AIOps & MLOps | mlflow, api, prometheus, grafana | `/predict`, MLflow run, Grafana dashboard |
| Databricks Lakehouse | databricks-local, unity-catalog, spark-master | notebook workspace és governance minta |
