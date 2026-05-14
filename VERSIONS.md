# Verzió-mátrix — 2026 május

Ez a fájl rögzíti, melyik kurzus milyen verziókkal lett tesztelve. A kódminták ezekkel a verziókkal futnak — frissebb verziókkal előfordulhat eltérés, főleg az LLM provider API-knál.

## Python ökoszisztéma

| Csomag | Verzió | Kurzus(ok) |
|--------|--------|------------|
| `pandas` | 2.2.3 | Python DE, AI Data Engineer |
| `pyarrow` | 18.1.0 | Python DE, Delta, OTF |
| `numpy` | 2.1.3 | Python DE, Spark |
| `duckdb` | 1.1.3 | SQL Modeling |
| `pydantic` | 2.x | Python DE, AIOps |
| `pytest` | 8.3.x | Python DE, dbt unit tests |

## Lakehouse / formátumok

| Csomag | Verzió | Megjegyzés |
|--------|--------|------------|
| `deltalake` (Python) | 0.22.3 | Spark nélküli Delta író/olvasó |
| `delta-spark` | 3.2.x | Spark + Delta integráció (Maven) |
| `pyiceberg` | 0.8.1 | Apache Iceberg natív Python kliens |
| Apache Spark | 3.5.3 | Docker image: `apache/spark:3.5.3-scala2.12-java17-python3-ubuntu` |
| Apache Hudi | 0.15.x | Spark plugin (Maven) |

## Streaming

| Csomag | Verzió | Megjegyzés |
|--------|--------|------------|
| Apache Kafka | 3.9.1 | KRaft mode (Docker: `apache/kafka:3.9.1`) |
| `kafka-python` | 2.0.2 | Python kliens |
| `confluent-kafka` | 2.6.1 | C-alapú alternatíva (gyorsabb) |

## Orchestration / transformation

| Csomag | Verzió | Megjegyzés |
|--------|--------|------------|
| Apache Airflow | 2.10.3 | Python 3.11. `schedule=` paraméter (nem `schedule_interval`) |
| `dbt-core` | 1.9.x | Modern Jinja, unit tests támogatva |
| `dbt-postgres` | 1.9.0 | Adapter |

## ML / GenAI

| Csomag | Verzió | Megjegyzés |
|--------|--------|------------|
| `mlflow` | 2.20.3 | **Stages deprecated → aliases használata** |
| `scikit-learn` | 1.6.0 | |
| `fastapi` | 0.115.6 | Pydantic V2 |
| `feast` | 0.41.3 | Modern API: `Field`, `FeatureView`, `FileSource` (NEM `Feature(...)`) |

## RAG / vektor DB

| Csomag | Verzió | Megjegyzés |
|--------|--------|------------|
| `chromadb` | 0.5.23 | Alapból squared L2 distance — cosine-hoz `metadata={'hnsw:space':'cosine'}` |
| `sentence-transformers` | 3.3.1 | Open-source embeddings |
| `openai` | 1.59.7 | **Chat Completions API** (`client.chat.completions.create()`) — a régi `Responses API` minta nem létezik |
| `anthropic` | 0.42.0 | Claude API, prompt caching támogatott |
| `ragas` | 0.2.10 | RAG evaluation; **v0.0.x deprecated** |

## Cloud-szolgáltatások (referenciaként)

| Szolgáltatás | Verzió/SKU | Megjegyzés |
|--------------|-----------|------------|
| Databricks Runtime | DBR 15.x LTS | DLT csak Premium SKU-ban; UC OSS is létezik |
| Snowflake | Standard | dbt-snowflake adapterrel |
| AWS S3 / Azure ADLS Gen2 / GCS | — | Object storage |

## Verziófrissítés szabályai

- **OpenAI/Anthropic API**: ezek nagyon gyakran változnak; ha a kódminta nem fut, először nézd meg a hivatalos dokumentációt.
- **Spark**: 3.5.x → 4.0 váltáskor a `pyspark` API-k továbbra is kompatibilisek, de a Java 17 → Java 21 váltás előfordulhat.
- **Airflow 2.x → 3.0**: `catchup` default `False` lesz, `schedule_interval` eltávolítva, XCom serialization változik.
- **Delta Lake**: 3.0+ óta sok korábbi Databricks-only feature OSS-ben is elérhető (Liquid Clustering, deletion vectors).
