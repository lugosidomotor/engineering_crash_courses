# Engineering Crash Courses

Magyar nyelvű Data Engineering és AI kurzusok — interaktív webes tananyag, közös esettanulmánnyal.

**Élő oldal:** [dataengineer.hu](https://dataengineer.hu)

## Kurzusok

| # | Kurzus | Téma |
|---|--------|------|
| 1 | [SQL & Data Modeling](https://dataengineer.hu/sql-data-modeling/) | SQL alapok, relációs adatbázis, adatmodellezés |
| 2 | [Python for Data Engineering](https://dataengineer.hu/python-data-engineering/) | Python toolkit adatmérnököknek |
| 3 | [Docker & Local Data Platform](https://dataengineer.hu/docker-local-data-platform/) | Docker Compose adatplatform helyi futtatáshoz |
| 4 | [Delta Table Crash Course](https://dataengineer.hu/delta-table-crash-course/) | Delta Lake a nulláról, ACID tranzakciók |
| 5 | [Open Table Formats](https://dataengineer.hu/open-table-formats/) | Delta vs Iceberg vs Hudi összehasonlítás |
| 6 | [Apache Spark Crash Course](https://dataengineer.hu/spark-crash-course/) | Spark DataFrame API és ETL |
| 7 | [Airflow & Orchestration](https://dataengineer.hu/airflow-orchestration/) | Pipeline ütemezés Airflow-val |
| 8 | [dbt Analytics Engineering](https://dataengineer.hu/dbt-analytics-engineering/) | Analytics engineering dbt-vel |
| 9 | [Databricks Lakehouse](https://dataengineer.hu/databricks-lakehouse/) | Enterprise lakehouse platform |
| 10 | [Streaming Engineering](https://dataengineer.hu/streaming-engineering/) | Kafka és Spark Structured Streaming |
| 11 | [AI Data Engineer](https://dataengineer.hu/ai-data-engineer/) | Feature store és data quality |
| 12 | [AI Engineering](https://dataengineer.hu/ai-engineering/) | RAG chatbot építése production-ig |
| 13 | [RAG Evaluation & AI Safety](https://dataengineer.hu/rag-evaluation-ai-safety/) | AI evaluáció és biztonság |
| 14 | [LLMOps / GenAI Production](https://dataengineer.hu/llmops-genai-production/) | Production LLM alkalmazások |
| 15 | [AIOps & MLOps](https://dataengineer.hu/aiops-mlops/) | ML modell üzemeltetés |

## WebShop Pro — Közös esettanulmány

Minden kurzus ugyanazt a fiktív **WebShop Pro** webshopot használja példa-adatforrásként. A projekt egy interaktív statikus webshop demót és egy Docker Compose lab környezetet tartalmaz.

- **WebShop Pro demo:** [dataengineer.hu/webshop-pro/](https://dataengineer.hu/webshop-pro/) — Bolt, Admin és Dashboard nézetek, kosárkezelés, valós idejű metrikák
- **Docker Lab guide:** [dataengineer.hu/webshop-lab/](https://dataengineer.hu/webshop-lab/) — Lokális adatplatform telepítési útmutató

### Adatrétegek

```
Source (orders.json, events.json, catalog.json)
  → Bronze (nyers adatok)
    → Silver (tisztított, validált)
      → Gold (KPI-k, feature táblák)
        → AI (RAG, churn score, prompt eval)
          → Ops (Airflow DAG, MLflow, Grafana)
```

## Projekt felépítése

```
.
├── index.html                    # Főoldal — kurzus lista
├── sql-data-modeling/            # Kurzus aloldalak (15 db)
├── python-data-engineering/
├── docker-local-data-platform/
├── ...
├── webshop-pro/                  # Interaktív webshop demo
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── fixtures/                 # Termék és rendelés adatok
├── webshop-lab/                  # Docker Lab telepítési útmutató
├── shared/
│   ├── course.css                # Közös kurzus oldal stílusok
│   └── course.js                 # Kurzus oldal generátor (WebShop Pro szekció)
├── assets/
│   └── images/                   # OG képek, WebShop Pro screenshotok
├── sitemap.xml
└── robots.txt
```

## Technikai részletek

- **Típus:** Statikus oldal (GitHub Pages)
- **Domain:** [dataengineer.hu](https://dataengineer.hu) (custom domain)
- **Nyelv:** Magyar
- **SEO:** Structured data (JSON-LD Course listings), Open Graph, sitemap, robots.txt
- **Responsive:** Desktop + tablet (900px) + mobil (560px) nézet, Safari/iPhone optimalizálás
- **Közös renderelés:** `shared/course.js` generálja a kurzus aloldalak WebShop Pro projektkapcsolat szekcióját
- **Cache busting:** `?v=2025may2` paraméter CSS/JS hivatkozásokon

## Docker Lab

A teljes kurzus-sorozat egy Docker Compose környezettel használható, amely az összes szolgáltatást lokálisan elindítja:

- PostgreSQL (webshop adatbázis)
- MinIO (S3-kompatibilis object storage)
- Apache Kafka (streaming)
- Spark (elosztott feldolgozás)
- Airflow (orchestration)
- dbt (transformation)
- MLflow (ML tracking)
- ChromaDB (vektor adatbázis)
- Prometheus + Grafana (monitoring)
- Unity Catalog (data governance)

Részletes útmutató és szolgáltatás lista: [`webshop-pro/project-map.json`](webshop-pro/project-map.json)

## Licenc

© Dr. Sándor Attila Pabar — [dataengineer.hu](https://dataengineer.hu)
