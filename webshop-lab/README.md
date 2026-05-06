# WebShop Pro Local Docker Lab

Ez a mappa a kurzusok közös, lokálisan futtatható tanulóplatformja. A cél nem egy production-grade webshop, hanem egy olyan projektalap, ahol ugyanazt az adatutat látod végig:

```text
dummy webshop -> PostgreSQL/Kafka -> bronze/silver/gold -> dbt/Spark/Airflow -> AI/RAG/MLOps -> monitoring
```

## Előfeltételek

- Docker Desktop (Windows/Mac) vagy Docker Engine + Docker Compose v2 (Linux)
- Minimum 8 GB RAM (a teljes stack kb. 6 GB-ot foglal)
- 20 GB szabad lemezterület

## Indítás

```shell
# Repo gyökérből
docker compose up -d --build
```

Ez elindítja az összes service-t. Az első indulás 5-10 percet vehet igénybe az image-ek letöltése miatt.

```shell
# Állapot ellenőrzése
docker compose ps

# Logok követése
docker compose logs -f api kafka airflow dbt
```

A `kafka-init` és `minio-init` service-ek sikeres lefutás után kilépnek. Ez normális, mert előkészítő konténerek: topicokat, bucketeket és induló fájlokat hoznak létre.

## Fontos URL-ek

| Eszköz | URL | Login | Leírás |
| --- | --- | --- | --- |
| Kurzussite | http://localhost:8020/ | - | Összes kurzus statikus oldala |
| WebShop Pro | http://localhost:8010/ | - | Interaktív dummy webshop (Bolt, Admin, Dashboard) |
| FastAPI docs | http://localhost:8000/docs | - | REST API dokumentáció |
| Airflow | http://localhost:8088/ | admin / admin | DAG orchestrator, Spark ETL submit |
| Spark master | http://localhost:8090/ | - | Spark UI és REST submit endpoint |
| dbt docs | http://localhost:8092/ | - | Analytics modellek és lineage |
| MinIO | http://localhost:9001/ | minioadmin / minioadmin | S3-kompatibilis tároló |
| MLflow | http://localhost:5000/ | - | Kísérletkövetés |
| Streamlit | http://localhost:8501/ | - | AI support UI |
| ChromaDB | http://localhost:8001/api/v1/heartbeat | - | Vektor adatbázis |
| Prometheus | http://localhost:9090/ | - | Metrikák |
| Grafana | http://localhost:3000/ | admin / admin | Dashboardok |
| Unity Catalog | http://localhost:8089/ | - | OSS governance |
| JupyterLab | http://localhost:8888/ | token nélküli | Databricks lokális analóg |

## WebShop Pro felület

A http://localhost:8010/ címen elérhető dummy webshop három nézetet tartalmaz:

### Bolt nézet
- Termékkatalógus kártyákkal
- Kosárba tevés és vásárlás (POST /api/simulate-order)
- Valós idejű rendelésgenerálás (automatikus, 8-15 másodpercenként)

### Admin nézet
- Rendelések táblázat
- Készletkezelés
- Bevétel és rendelésszám statisztikák

### Dashboard nézet
- KPI metrikák (bevétel, konverzió, AOV, support ticketek)
- Termék teljesítmény tábla
- Élő clickstream esemény feed
- Pipeline blueprint

## Gyakorló parancsok

### Bootstrap riport (Python / Delta / Parquet / data quality)

```shell
docker compose exec lab-runner python /lab/runner/scripts/bootstrap_lab.py
```

Ez a parancs:
- Beolvassa a fixture JSON fájlokat
- Bronze/Silver/Gold Parquet fájlokat generál az /output kötetbe
- Delta Lake táblát próbál létrehozni
- Ellenőrzi a PostgreSQL kapcsolatot
- Teszteli a FastAPI health endpointot

### Spark ETL indítása kézzel

```shell
docker compose exec spark-master /opt/spark/bin/spark-submit --master spark://spark-master:7077 /opt/webshop-lab/spark/jobs/webshop_spark_etl.py
```

Az Airflow `webshop_daily_etl` DAG ugyanezt a Spark jobot automatikusan is meghívja a Spark master REST API-ján keresztül. A kézi parancs akkor hasznos, ha külön csak a Spark kurzusrészt akarod próbálgatni.

### Kafka topicok listázása

```shell
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
```

### Kafka események olvasása

```shell
docker compose exec kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic webshop.events --from-beginning --max-messages 10
```

### dbt újrafuttatás

```shell
docker compose exec dbt dbt run --profiles-dir /usr/app/profiles
docker compose exec dbt dbt test --profiles-dir /usr/app/profiles
```

### Churn prediction próba

```shell
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d "{\"customer_id\":\"C-1842\"}"
```

### Új rendelés szimulálása

```shell
curl -X POST http://localhost:8000/api/simulate-order
```

## Leállítás

```shell
# Normál leállítás (adatok megmaradnak)
docker compose down

# Teljes törlés volume-okkal
docker compose down --volumes --remove-orphans
```

## Kurzusokhoz kötés

| Kurzus | Compose service-ek | Mit látsz benne? |
| --- | --- | --- |
| SQL | postgres | raw és analytics sémák, JOIN-olható webshop táblák |
| Python | lab-runner | fixture ingest, Parquet írás, validációs riport |
| Docker | teljes compose | egy parancsból reprodukálható lokális platform |
| Delta Lake | lab-runner, spark-master, minio | bronze/silver/gold Delta táblák |
| Open Table Formats | lab-runner, minio, unity-catalog | Delta/Iceberg/Hudi összehasonlítás |
| Spark | spark-master, spark-worker | DataFrame ETL, product performance Parquet kimenet |
| Airflow | airflow, spark-master, spark-worker | webshop_daily_etl DAG, amely Spark ETL-t is submitol |
| dbt | dbt, postgres | staging és mart modellek, dbt docs |
| Streaming | kafka, event-producer | clickstream topicok, valós idejű események |
| AI Data Engineer | lab-runner, feast, kafka | feature engineering, data quality |
| AI Engineering | chroma, streamlit, api | RAG support asszisztens |
| RAG Evaluation | lab-runner, chroma | RAGAS metrikák, golden dataset |
| MLOps/LLMOps | mlflow, api, prometheus, grafana | model serving, tracking, monitoring |
| Databricks | databricks-local, unity-catalog, mlflow | managed lakehouse workflow |
| Kubernetes | kubernetes/ manifest | deployment mental modell |

## Architektúra

```text
┌─────────────────────────────────────────────────────────────────┐
│ WebShop Pro Frontend (nginx :8010)                              │
│  Bolt │ Admin │ Dashboard                                       │
└────────────┬────────────────────────────────────────────────────┘
             │ REST API
┌────────────▼────────────────────────────────────────────────────┐
│ FastAPI (python :8000)                                          │
│  /api/catalog  /api/orders  /api/events  /api/metrics           │
│  /api/simulate-order  /predict  /metrics (prometheus)           │
└────────────┬────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────────┐
│ PostgreSQL (:5432)                                              │
│  raw.catalog │ raw.orders │ raw.events │ ml.predictions         │
│  analytics.* (views) │ ml.customer_features (view)              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Kafka (:9092)                                                   │
│  webshop.events │ webshop.orders │ webshop.support              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ MinIO (:9000/:9001)                                             │
│  webshop-bronze │ webshop-silver │ webshop-gold │ webshop-artifacts│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ MLflow (:5000) │ Grafana (:3000) │ Prometheus (:9090)           │
│ Airflow (:8088) │ dbt (:8092) │ Spark (:8090)                   │
│ ChromaDB (:8001) │ Streamlit (:8501) │ Jupyter (:8888)          │
└─────────────────────────────────────────────────────────────────┘
```

## Megjegyzések

- A WebShop Pro automatikusan generál rendeléseket 8-15 másodpercenként, így a Dashboard valós idejűnek hat
- A Databricks kurzushoz JupyterLab + Spark + MLflow + Unity Catalog OSS kombináció szolgál
- Kuberneteshez deployment manifest található a `webshop-lab/kubernetes/` mappában
- OpenAI kulcs nélkül offline demo válasz fut; kulccsal a kurzusokban lehet valódi API hívást bekötni
- A ChromaDB előre feltöltődik a webshop szabályzataival (szállítás, garancia, visszaküldés)
