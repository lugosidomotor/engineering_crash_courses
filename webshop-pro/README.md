# WebShop Pro demo projekt

Ez a mappa a kurzusok közös dummy webshop esettanulmánya. Nem production alkalmazás, hanem oktatási demo: ugyanazt a mini webshopot használjuk SQL-hez, Pythonhoz, Delta Lake-hez, Sparkhoz, streaminghez, dbt-hez, RAG-hez és MLOps-hoz.

## Futtatás a teljes Local Docker Lab környezettel

Repo gyökeréből:

```shell
docker compose up -d --build
```

Majd nyisd meg:

```text
http://localhost:8010/
```

Ilyenkor a demo már a FastAPI + PostgreSQL rétegre csatlakozik. Az "Új rendelés" gomb API-n keresztül ír új rendelést a `raw.orders` táblába, a Prometheus pedig méri az endpoint forgalmat.

## Futtatás csak statikus fallbackkel

Repo gyökeréből:

```shell
python -m http.server 8010 --bind 127.0.0.1
```

Majd nyisd meg:

```text
http://127.0.0.1:8010/webshop-pro/
```

## Mit szimulál?

- webshop katalógus és rendeléstábla
- clickstream és checkout események
- FastAPI serving API és PostgreSQL source DB, ha a compose stack fut
- Bronze/Silver/Gold adatfolyam
- tool status panel az összes kurzusban szereplő technológiával
- AI support/RAG, churn scoring és observability helye a rendszerben

## Oktatási szerep

Minden kurzus ugyanahhoz a projekthez ad hozzá egy réteget:

- SQL: relációs modell, JOIN, aggregáció
- Python: ingest és validáció
- Docker: lokális stack indítás
- Delta Lake: tranzakciós lakehouse táblázatok
- Spark: nagy volumen ETL
- Airflow: napi DAG
- dbt: analytics martok
- Streaming: Kafka clickstream
- AI Engineering: RAG ügyfélszolgálat
- MLOps: churn modell serving és monitoring
