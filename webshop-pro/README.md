# WebShop Pro demo projekt

Ez a mappa a kurzusok kozos dummy webshop esettanulmanya. Nem production alkalmazas, hanem oktatasi demo: ugyanazt a mini webshopot hasznaljuk SQL-hez, Pythonhoz, Delta Lake-hez, Sparkhoz, streaminghez, dbt-hez, RAG-hez es MLOps-hoz.

## Futtatas teljes Docker labbal

Repo gyokerbol:

```powershell
docker compose up -d --build
```

Majd nyisd meg:

```text
http://localhost:8010/
```

Ilyenkor a demo mar a FastAPI + PostgreSQL retegre csatlakozik. Az "Uj rendeles" gomb API-n keresztul ir uj rendelest a `raw.orders` tablaba, a Prometheus pedig meri az endpoint forgalmat.

## Futtatas csak statikus fallbackkel

Repo gyokerbol:

```powershell
python -m http.server 8010 --bind 127.0.0.1
```

Majd nyisd meg:

```text
http://127.0.0.1:8010/webshop-pro/
```

## Mit szimulal?

- webshop katalogus es rendelestabla
- clickstream es checkout esemenyek
- FastAPI serving API es PostgreSQL source DB, ha a compose stack fut
- Bronze/Silver/Gold adatfolyam
- tool status panel az osszes kurzusban szereplo technologiaval
- AI support/RAG, churn scoring es observability helye a rendszerben

## Oktatasi szerep

Minden kurzus ugyanahhoz a projekthez ad hozza egy reteget:

- SQL: relacios modell, JOIN, aggregacio
- Python: ingest es validacio
- Docker: lokalis stack inditas
- Delta Lake: tranzakcios lakehouse tablazatok
- Spark: nagy volumen ETL
- Airflow: napi DAG
- dbt: analytics martok
- Streaming: Kafka clickstream
- AI Engineering: RAG ugyfelszolgalat
- MLOps: churn modell serving es monitoring
