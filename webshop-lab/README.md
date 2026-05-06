# WebShop Pro Docker Compose lab

Ez a mappa a kurzusok közös, lokálisan futtatható tanulóplatformja. A cél nem egy production-grade webshop, hanem egy olyan projektalap, ahol ugyanazt az adatutat látod végig:

```text
dummy webshop -> PostgreSQL/Kafka -> bronze/silver/gold -> dbt/Spark/Airflow -> AI/RAG/MLOps -> monitoring
```

## Indítás

Repo gyökérből:

```powershell
docker compose up -d --build
```

Állapot:

```powershell
docker compose ps
```

Leállítás:

```powershell
docker compose down
```

Teljes törlés volume-okkal:

```powershell
docker compose down --volumes --remove-orphans
```

## Fontos URL-ek

| Eszköz | URL | Login |
| --- | --- | --- |
| Kurzussite | http://localhost:8020/ | - |
| Dummy webshop | http://localhost:8010/ | - |
| FastAPI docs | http://localhost:8000/docs | - |
| Airflow | http://localhost:8088/ | admin / admin |
| Spark master | http://localhost:8090/ | - |
| dbt docs | http://localhost:8092/ | - |
| MinIO console | http://localhost:9001/ | minioadmin / minioadmin |
| MLflow | http://localhost:5000/ | - |
| Streamlit AI support | http://localhost:8501/ | - |
| ChromaDB | http://localhost:8001/api/v1/heartbeat | - |
| Prometheus | http://localhost:9090/ | - |
| Grafana | http://localhost:3000/ | admin / admin |
| Unity Catalog OSS | http://localhost:8089/ | - |
| Databricks local notebook analogue | http://localhost:8888/ | token nélküli lab |

## Gyakorló parancsok

Bootstrap riport készítése a Python / Delta / Parquet / data quality kurzusokhoz:

```powershell
docker compose exec lab-runner python /lab/runner/scripts/bootstrap_lab.py
```

Spark ETL indítása:

```powershell
docker compose exec spark-master spark-submit --master spark://spark-master:7077 /opt/webshop-lab/spark/jobs/webshop_spark_etl.py
```

Kafka topicok listázása:

```powershell
docker compose exec kafka kafka-topics.sh --bootstrap-server kafka:9092 --list
```

dbt újrafuttatás:

```powershell
docker compose exec dbt dbt run --profiles-dir /usr/app/profiles
```

FastAPI churn prediction próba:

```powershell
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d "{\"customer_id\":\"C-1842\"}"
```

## Kurzusokhoz kötés

- SQL: `postgres`, `raw.*`, `analytics.*`
- Python: `lab-runner`, fixtures -> parquet
- Docker: teljes `docker-compose.yml`
- Delta/Open table formats: `lab-runner`, `spark-master`, `minio`, `unity-catalog`
- Spark: `spark-master`, `spark-worker`, `spark/jobs/webshop_spark_etl.py`
- Airflow: `airflow`, `webshop_daily_etl` DAG
- dbt: `dbt`, `models/staging`, `models/marts`
- Streaming: `kafka`, `event-producer`
- AI Data Engineer: `feast`, `great-expectations`, `customer_features`
- AI Engineering: `chroma`, `streamlit`, `api`
- MLOps/LLMOps: `mlflow`, `api`, `prometheus`, `grafana`
- Databricks/Unity Catalog: `databricks-local`, `unity-catalog`

Megjegyzés: Databricks és Kubernetes nem klasszikus single-container toolok. A lab ezért Databrickshez JupyterLab + Spark + MLflow + Unity Catalog OSS kombinációt ad, Kuberneteshez pedig deployment manifestet a `webshop-lab/kubernetes` mappában.
