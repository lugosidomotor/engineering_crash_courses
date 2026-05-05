// Extended course metadata: prerequisites, outcomes, external resources, videos, related courses.
// Keyed by course slug. Used by landing page modal and detail previews.
window.COURSE_DETAILS = {

  "sql-data-modeling": {
    tagline: "Az adatmodellezés és SQL a data engineering szíve — ez a kurzus megadja a stabil alapot.",
    diagram: {
      title: "Star schema — fact és dimension táblák",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" role="img" aria-label="Star schema vizualizáció: fact_orders központi tábla körül dim_customer, dim_product, dim_date és dim_store">
        <defs>
          <style>
            .box{fill:rgba(88,166,255,.08);stroke:#58a6ff;stroke-width:1.5}
            .fact{fill:rgba(255,215,0,.08);stroke:#ffd700;stroke-width:2}
            .line{stroke:#6e7681;stroke-width:1.5;stroke-dasharray:4,3}
            .h{fill:#e6edf3;font-family:Inter,Arial,sans-serif;font-weight:700;font-size:13px}
            .k{fill:#58a6ff;font-family:'JetBrains Mono',monospace;font-size:11px}
            .fk{fill:#ffd700}
          </style>
        </defs>
        <line class="line" x1="350" y1="180" x2="120" y2="70"/>
        <line class="line" x1="350" y1="180" x2="580" y2="70"/>
        <line class="line" x1="350" y1="180" x2="120" y2="290"/>
        <line class="line" x1="350" y1="180" x2="580" y2="290"/>
        <rect class="fact" x="280" y="140" width="140" height="80" rx="8"/>
        <text class="h fk" x="350" y="160" text-anchor="middle">fact_orders</text>
        <text class="k" x="350" y="180" text-anchor="middle">order_id (PK)</text>
        <text class="k" x="350" y="195" text-anchor="middle">customer_id</text>
        <text class="k" x="350" y="210" text-anchor="middle">amount · date</text>
        <rect class="box" x="30" y="30" width="180" height="80" rx="8"/>
        <text class="h" x="120" y="50" text-anchor="middle">dim_customer</text>
        <text class="k" x="120" y="70" text-anchor="middle">customer_id (PK)</text>
        <text class="k" x="120" y="85" text-anchor="middle">name · city · segment</text>
        <rect class="box" x="490" y="30" width="180" height="80" rx="8"/>
        <text class="h" x="580" y="50" text-anchor="middle">dim_product</text>
        <text class="k" x="580" y="70" text-anchor="middle">product_id (PK)</text>
        <text class="k" x="580" y="85" text-anchor="middle">name · category · brand</text>
        <rect class="box" x="30" y="250" width="180" height="80" rx="8"/>
        <text class="h" x="120" y="270" text-anchor="middle">dim_date</text>
        <text class="k" x="120" y="290" text-anchor="middle">date_key (PK)</text>
        <text class="k" x="120" y="305" text-anchor="middle">year · month · weekday</text>
        <rect class="box" x="490" y="250" width="180" height="80" rx="8"/>
        <text class="h" x="580" y="270" text-anchor="middle">dim_store</text>
        <text class="k" x="580" y="290" text-anchor="middle">store_id (PK)</text>
        <text class="k" x="580" y="305" text-anchor="middle">region · size · type</text>
      </svg>`
    },
    prerequisites: [
      "Alapvető számítógépes ismeretek",
      "Bármilyen programozási nyelv ismerete előny, de nem kötelező"
    ],
    outcomes: [
      "SELECT, JOIN, GROUP BY, window függvények magabiztos használata",
      "Star schema és snowflake schema tervezése",
      "Normalizálás (1NF–3NF) és denormalizálás megfelelő helyeken",
      "SCD (Slowly Changing Dimensions) típusok implementálása",
      "Analitikai lekérdezések és CTE strukturálása"
    ],
    keyTopics: [
      { title: "Relációs alapok", desc: "Tábla, sor, oszlop, kulcsok, kapcsolatok" },
      { title: "SQL szintaxis", desc: "SELECT, WHERE, JOIN típusok, GROUP BY, HAVING" },
      { title: "CTE és subquery", desc: "Olvasható, rétegzett lekérdezések" },
      { title: "Window funkciók", desc: "ROW_NUMBER, RANK, LAG, LEAD, aggregált OVER" },
      { title: "Dimenzionális modellezés", desc: "Fact és dimension táblák, Kimball-módszer" },
      { title: "Teljesítmény", desc: "Index, statisztika, execution plan olvasása" }
    ],
    resources: [
      { type: "book", title: "Kimball: The Data Warehouse Toolkit", url: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-dw-toolkit/" },
      { type: "doc", title: "PostgreSQL hivatalos dokumentáció", url: "https://www.postgresql.org/docs/" },
      { type: "tutorial", title: "Mode Analytics SQL tutorial", url: "https://mode.com/sql-tutorial/" },
      { type: "tool", title: "DB Fiddle — online SQL playground", url: "https://www.db-fiddle.com/" }
    ],
    videos: [
      { title: "SQL for Data Analysis", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
      { title: "Window Functions Explained", channel: "Alex The Analyst", url: "https://www.youtube.com/results?search_query=sql+window+functions" }
    ],
    related: ["python-data-engineering", "dbt-analytics-engineering", "delta-table-crash-course"]
  },

  "python-data-engineering": {
    tagline: "A Python a data engineering univerzális ragasztója — ez a kurzus felépíti a szakmai toolkit-et.",
    prerequisites: [
      "Python alapok: változók, függvények, ciklusok",
      "Parancssor használata (cd, ls, python futtatása)"
    ],
    outcomes: [
      "Virtualenv és pip dependency kezelés",
      "pandas DataFrame magabiztos használata ETL-re",
      "Parquet olvasás/írás és Parquet vs CSV tradeoff",
      "pathlib, logging, pydantic validáció használata",
      "CLI eszköz készítése argparse-szal",
      "Unit test írása pytest-tel"
    ],
    keyTopics: [
      { title: "Python idiómák", desc: "List comprehension, generator, context manager" },
      { title: "pandas", desc: "DataFrame műveletek, merge, groupby, pivot" },
      { title: "Fájlformátumok", desc: "CSV, JSON, Parquet, Avro — mikor melyik" },
      { title: "Validáció", desc: "pydantic sémák, runtime típusellenőrzés" },
      { title: "Logging", desc: "Structured logging, log levelek, JSON log" },
      { title: "Tesztelés", desc: "pytest, fixture, parametrize, coverage" }
    ],
    resources: [
      { type: "doc", title: "pandas dokumentáció", url: "https://pandas.pydata.org/docs/" },
      { type: "doc", title: "Python Packaging User Guide", url: "https://packaging.python.org/" },
      { type: "book", title: "Python for Data Analysis (Wes McKinney)", url: "https://wesmckinney.com/book/" },
      { type: "tool", title: "uv — gyors Python package manager", url: "https://github.com/astral-sh/uv" }
    ],
    videos: [
      { title: "Python for Data Engineering", channel: "DataTalksClub", url: "https://www.youtube.com/@DataTalksClub" },
      { title: "pandas Tutorial", channel: "Corey Schafer", url: "https://www.youtube.com/results?search_query=pandas+corey+schafer" }
    ],
    related: ["sql-data-modeling", "docker-local-data-platform", "airflow-orchestration"]
  },

  "docker-local-data-platform": {
    tagline: "Építs teljes adatplatformot a laptopodon — mint az enterprise, csak Docker Compose-szal.",
    prerequisites: [
      "Python alapok",
      "Parancssor használata",
      "Ismerős fogalmak: szerver, port, adatbázis"
    ],
    outcomes: [
      "Docker image és container különbségek megértése",
      "docker-compose multi-service stack futtatása",
      "Postgres, MinIO (S3), Spark, Airflow, MLflow együttes indítása",
      "Prometheus + Grafana monitoring stack",
      "Volume és network management",
      "Troubleshooting: log olvasás, exec container-be"
    ],
    keyTopics: [
      { title: "Image vs Container", desc: "Layer, cache, Dockerfile best practice" },
      { title: "Compose", desc: "Service, network, volume, depends_on, healthcheck" },
      { title: "MinIO", desc: "S3-kompatibilis objektumtár lokálisan" },
      { title: "Monitoring", desc: "Prometheus scrape, Grafana dashboard" },
      { title: "Security", desc: "Secrets, env file, non-root user" },
      { title: "Performance", desc: "Resource limit, BuildKit, multi-stage build" }
    ],
    resources: [
      { type: "doc", title: "Docker Docs", url: "https://docs.docker.com/" },
      { type: "doc", title: "Docker Compose Spec", url: "https://compose-spec.io/" },
      { type: "tool", title: "Play with Docker", url: "https://labs.play-with-docker.com/" },
      { type: "article", title: "Docker Best Practices", url: "https://docs.docker.com/develop/dev-best-practices/" }
    ],
    videos: [
      { title: "Docker Tutorial for Beginners", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=3c-iBn73dDE" },
      { title: "Docker Compose Tutorial", channel: "Fireship", url: "https://www.youtube.com/watch?v=HG6yIjZapSA" }
    ],
    related: ["python-data-engineering", "airflow-orchestration", "aiops-mlops"]
  },

  "delta-table-crash-course": {
    tagline: "Delta Lake anatómiája a nulláról — parquet + tranzakciós napló, Databricks nélkül.",
    diagram: {
      title: "Medallion architektúra — Bronze, Silver, Gold rétegek",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" role="img" aria-label="Medallion architektúra: forrásadatok Bronze rétegen nyersen, Silver rétegen tisztítva, Gold rétegen aggregálva">
        <defs>
          <style>
            .bronze{fill:rgba(205,127,50,.15);stroke:#cd7f32;stroke-width:2}
            .silver{fill:rgba(192,192,192,.15);stroke:#c0c0c0;stroke-width:2}
            .gold{fill:rgba(255,215,0,.15);stroke:#ffd700;stroke-width:2}
            .src{fill:rgba(139,148,158,.12);stroke:#8b949e;stroke-width:1.5;stroke-dasharray:4,3}
            .cons{fill:rgba(179,102,255,.12);stroke:#bc8cff;stroke-width:1.5;stroke-dasharray:4,3}
            .h{fill:#e6edf3;font-family:Inter,Arial,sans-serif;font-weight:700;font-size:15px}
            .s{fill:#8b949e;font-family:Inter,Arial,sans-serif;font-size:10px}
            .arr{fill:none;stroke:#6e7681;stroke-width:2;marker-end:url(#a)}
          </style>
          <marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#6e7681"/>
          </marker>
        </defs>
        <rect class="src"    x="20"  y="80"  width="120" height="80" rx="8"/>
        <text class="h"      x="80"  y="110" text-anchor="middle">Források</text>
        <text class="s"      x="80"  y="130" text-anchor="middle">CSV, API,</text>
        <text class="s"      x="80"  y="144" text-anchor="middle">Kafka, DB</text>
        <rect class="bronze" x="180" y="80"  width="140" height="80" rx="8"/>
        <text class="h"      x="250" y="110" text-anchor="middle">🥉 Bronze</text>
        <text class="s"      x="250" y="130" text-anchor="middle">Nyers ingest</text>
        <text class="s"      x="250" y="144" text-anchor="middle">append-only</text>
        <rect class="silver" x="360" y="80"  width="140" height="80" rx="8"/>
        <text class="h"      x="430" y="110" text-anchor="middle">🥈 Silver</text>
        <text class="s"      x="430" y="130" text-anchor="middle">Tisztított, DQ</text>
        <text class="s"      x="430" y="144" text-anchor="middle">dedup, join</text>
        <rect class="gold"   x="540" y="80"  width="140" height="80" rx="8"/>
        <text class="h"      x="610" y="110" text-anchor="middle">🥇 Gold</text>
        <text class="s"      x="610" y="130" text-anchor="middle">Aggregált</text>
        <text class="s"      x="610" y="144" text-anchor="middle">fact · dim · KPI</text>
        <rect class="cons"   x="700" y="80"  width="80"  height="80" rx="8"/>
        <text class="h"      x="740" y="115" text-anchor="middle">BI</text>
        <text class="h"      x="740" y="135" text-anchor="middle">ML</text>
        <path class="arr" d="M142,120 L178,120"/>
        <path class="arr" d="M322,120 L358,120"/>
        <path class="arr" d="M502,120 L538,120"/>
        <path class="arr" d="M682,120 L698,120"/>
        <text class="s" x="400" y="200" text-anchor="middle">Minden réteg Delta table: Parquet adatfájlok + _delta_log tranzakciós napló</text>
      </svg>`
    },
    prerequisites: [
      "Python alapok",
      "SQL SELECT és JOIN ismerete",
      "pandas DataFrame alapok hasznosak"
    ],
    outcomes: [
      "Delta table belső felépítése: Parquet + _delta_log",
      "ACID tranzakciók lokális környezetben",
      "Time travel: korábbi verziók lekérdezése",
      "Schema evolution és enforcement",
      "Bronze/Silver/Gold architektúra felépítése",
      "MERGE (upsert), DELETE, UPDATE Delta-n",
      "OPTIMIZE és Z-ORDER használata"
    ],
    keyTopics: [
      { title: "Parquet", desc: "Columnar format, compression, predicate pushdown" },
      { title: "_delta_log", desc: "JSON commit file-ok, checkpoint-ok" },
      { title: "ACID", desc: "Concurrent write, optimistic concurrency" },
      { title: "Time Travel", desc: "VERSION AS OF, TIMESTAMP AS OF" },
      { title: "Schema Evolution", desc: "Column add, type widening, enforcement" },
      { title: "Medallion", desc: "Bronze raw, Silver cleaned, Gold aggregated" }
    ],
    resources: [
      { type: "doc", title: "Delta Lake hivatalos dokumentáció", url: "https://docs.delta.io/latest/index.html" },
      { type: "doc", title: "delta-rs (Python/Rust)", url: "https://delta-io.github.io/delta-rs/" },
      { type: "article", title: "The Delta Lake Series (Databricks eBook)", url: "https://www.databricks.com/resources/ebook/the-delta-lake-series-complete-collection" },
      { type: "article", title: "Medallion Architecture", url: "https://www.databricks.com/glossary/medallion-architecture" }
    ],
    videos: [
      { title: "Delta Lake 2.0: Everything You Need to Know", channel: "Databricks", url: "https://www.youtube.com/results?search_query=delta+lake+2.0" },
      { title: "Medallion Architecture Explained", channel: "Advancing Analytics", url: "https://www.youtube.com/results?search_query=medallion+architecture" }
    ],
    related: ["spark-crash-course", "open-table-formats", "databricks-lakehouse"]
  },

  "open-table-formats": {
    tagline: "Delta vs Iceberg vs Hudi — melyik, miért és mikor? Gyakorlati döntési útmutató.",
    prerequisites: [
      "Delta Lake alapok (Delta Table Crash Course ajánlott)",
      "Parquet és Spark alapok",
      "SQL ismeret"
    ],
    outcomes: [
      "Delta Lake, Apache Iceberg, Apache Hudi összehasonlítása",
      "Table format vs file format különbség",
      "Catalog szerepe (Unity, Glue, Nessie, Polaris, Gravitino)",
      "Schema evolution és partition evolution megértése",
      "Vendor lock-in elkerülése",
      "Döntési fa: mikor melyik formátumot válaszd"
    ],
    keyTopics: [
      { title: "Delta Lake", desc: "Databricks natív, erős MERGE, liquid clustering" },
      { title: "Iceberg", desc: "Netflix eredet, hidden partitioning, time travel" },
      { title: "Hudi", desc: "Uber eredet, upsert-re optimalizált, MoR/CoW" },
      { title: "Catalog layer", desc: "Unity Catalog, AWS Glue, Nessie, Polaris" },
      { title: "Interop", desc: "Delta UniForm, XTable, Apache Parity" },
      { title: "Performance", desc: "Partition evolution, compaction, Z-order" }
    ],
    resources: [
      { type: "doc", title: "Apache Iceberg Docs", url: "https://iceberg.apache.org/docs/latest/" },
      { type: "doc", title: "Apache Hudi Docs", url: "https://hudi.apache.org/docs/overview" },
      { type: "article", title: "Comparing Lakehouse Table Formats", url: "https://www.onehouse.ai/blog/apache-hudi-vs-delta-lake-vs-apache-iceberg-lakehouse-feature-comparison" },
      { type: "article", title: "Delta UniForm", url: "https://docs.delta.io/latest/delta-uniform.html" }
    ],
    videos: [
      { title: "Data Lakehouse Table Formats Comparison", channel: "Dipankar Mazumdar", url: "https://www.youtube.com/results?search_query=delta+iceberg+hudi+comparison" }
    ],
    related: ["delta-table-crash-course", "databricks-lakehouse", "spark-crash-course"]
  },

  "spark-crash-course": {
    tagline: "A nagy volumenű adatfeldolgozás standardja — Spark DataFrame API a nulláról.",
    prerequisites: [
      "Python és pandas alapok",
      "SQL JOIN és GROUP BY ismeret",
      "Parquet alapismeret előny"
    ],
    outcomes: [
      "Spark DataFrame API használata ETL-re",
      "Lazy evaluation és action vs transformation",
      "Catalyst optimalizáló működésének megértése",
      "Partitioning és shuffle optimalizálás",
      "Spark SQL ad-hoc elemzéshez",
      "Delta Lake integráció Sparkkal",
      "Spark UI olvasása és teljesítmény hibakeresés"
    ],
    keyTopics: [
      { title: "DataFrame API", desc: "select, filter, groupBy, join, window" },
      { title: "Lazy evaluation", desc: "DAG, action vs transformation" },
      { title: "Catalyst", desc: "Logical plan, physical plan, optimalizációk" },
      { title: "Partitioning", desc: "repartition, coalesce, bucketing" },
      { title: "Shuffle", desc: "Mikor történik, hogyan minimalizáld" },
      { title: "Spark SQL", desc: "Temp view, SQL → DataFrame API" }
    ],
    resources: [
      { type: "doc", title: "Apache Spark dokumentáció", url: "https://spark.apache.org/docs/latest/" },
      { type: "doc", title: "PySpark API Reference", url: "https://spark.apache.org/docs/latest/api/python/" },
      { type: "book", title: "Learning Spark 2.0 (O'Reilly, ingyenes)", url: "https://www.databricks.com/resources/ebook/learning-spark-2nd-edition" },
      { type: "book", title: "Spark: The Definitive Guide", url: "https://www.oreilly.com/library/view/spark-the-definitive/9781491912201/" }
    ],
    videos: [
      { title: "PySpark Tutorial", channel: "Krish Naik", url: "https://www.youtube.com/results?search_query=pyspark+krish+naik" },
      { title: "Spark Architecture Deep Dive", channel: "Databricks", url: "https://www.youtube.com/results?search_query=spark+architecture+databricks" }
    ],
    related: ["delta-table-crash-course", "databricks-lakehouse", "streaming-engineering"]
  },

  "airflow-orchestration": {
    tagline: "A data pipeline dirigense — ütemezés, dependency és hibakezelés professzionálisan.",
    diagram: {
      title: "Airflow DAG — napi webshop ETL task gráf",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" role="img" aria-label="Airflow DAG: fájl sensor, bronze ingest, DQ check, silver clean, gold aggregate, notify">
        <defs>
          <style>
            .sensor{fill:rgba(255,215,0,.1);stroke:#ffd700;stroke-width:2}
            .op{fill:rgba(88,166,255,.1);stroke:#58a6ff;stroke-width:2}
            .check{fill:rgba(255,68,102,.1);stroke:#ff4466;stroke-width:2}
            .success{fill:rgba(0,255,136,.1);stroke:#3fb950;stroke-width:2}
            .h{fill:#e6edf3;font-family:Inter,Arial,sans-serif;font-weight:700;font-size:12px}
            .s{fill:#8b949e;font-family:'JetBrains Mono',monospace;font-size:10px}
            .arr{fill:none;stroke:#6e7681;stroke-width:2;marker-end:url(#af)}
            .branch{stroke-dasharray:4,3}
          </style>
          <marker id="af" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6e7681"/></marker>
        </defs>

        <rect class="sensor" x="20" y="130" width="130" height="60" rx="8"/>
        <text class="h" x="85" y="155" text-anchor="middle">⏰ FileSensor</text>
        <text class="s" x="85" y="172" text-anchor="middle">wait_for_csv</text>

        <rect class="op" x="180" y="130" width="120" height="60" rx="8"/>
        <text class="h" x="240" y="155" text-anchor="middle">🥉 bronze</text>
        <text class="s" x="240" y="172" text-anchor="middle">ingest_raw</text>

        <rect class="check" x="330" y="130" width="120" height="60" rx="8"/>
        <text class="h" x="390" y="155" text-anchor="middle">✓ dq_check</text>
        <text class="s" x="390" y="172" text-anchor="middle">schema · nulls</text>

        <rect class="op" x="480" y="60" width="120" height="60" rx="8"/>
        <text class="h" x="540" y="85" text-anchor="middle">🥈 silver</text>
        <text class="s" x="540" y="102" text-anchor="middle">dedup · clean</text>

        <rect class="check" x="480" y="200" width="120" height="60" rx="8"/>
        <text class="h" x="540" y="225" text-anchor="middle">📧 alert_dq</text>
        <text class="s" x="540" y="242" text-anchor="middle">on_failure</text>

        <rect class="op" x="630" y="60" width="120" height="60" rx="8"/>
        <text class="h" x="690" y="85" text-anchor="middle">🥇 gold</text>
        <text class="s" x="690" y="102" text-anchor="middle">aggregate_kpi</text>

        <rect class="success" x="630" y="130" width="120" height="60" rx="8"/>
        <text class="h" x="690" y="155" text-anchor="middle">📤 publish</text>
        <text class="s" x="690" y="172" text-anchor="middle">notify_teams</text>

        <path class="arr" d="M152,160 L178,160"/>
        <path class="arr" d="M302,160 L328,160"/>
        <path class="arr" d="M450,145 L478,110"/>
        <path class="arr branch" d="M450,175 L478,215"/>
        <path class="arr" d="M602,90 L628,90"/>
        <path class="arr" d="M690,122 L690,128"/>

        <text class="s" x="400" y="295" text-anchor="middle">schedule_interval=\"0 2 * * *\" · retries=2 · retry_delay=5min · catchup=False</text>
      </svg>`
    },
    prerequisites: [
      "Python alapok",
      "Docker alapok ajánlott",
      "ETL fogalmak ismerete"
    ],
    outcomes: [
      "DAG tervezés és ütemezés",
      "Task dependencies láncolása",
      "Sensor-ok fájl/tábla érkezésének detektálására",
      "XCom használata task-ok közötti adatátadásra",
      "Retry, backfill, catchup beállítása",
      "Connections és variables biztonságos kezelése",
      "Delta Lake integráció Airflow task-okban"
    ],
    keyTopics: [
      { title: "DAG", desc: "Directed Acyclic Graph, schedule_interval" },
      { title: "Operator", desc: "PythonOperator, BashOperator, custom operator" },
      { title: "Sensor", desc: "FileSensor, ExternalTaskSensor, poke_interval" },
      { title: "XCom", desc: "Task-ok közötti adatátadás, backend" },
      { title: "Executor", desc: "Sequential, Local, Celery, Kubernetes" },
      { title: "Deferrable", desc: "Async operator, trigger worker" }
    ],
    resources: [
      { type: "doc", title: "Apache Airflow dokumentáció", url: "https://airflow.apache.org/docs/" },
      { type: "doc", title: "Airflow Best Practices", url: "https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html" },
      { type: "tool", title: "Astronomer Registry (provider katalógus)", url: "https://registry.astronomer.io/" },
      { type: "article", title: "Modern Data Orchestration (Prefect vs Airflow vs Dagster)", url: "https://www.getdbt.com/blog/orchestration-tools-comparison" }
    ],
    videos: [
      { title: "Apache Airflow Tutorial", channel: "Marc Lamberti", url: "https://www.youtube.com/@MarcLamberti" },
      { title: "Data Orchestration Explained", channel: "DataTalksClub", url: "https://www.youtube.com/@DataTalksClub" }
    ],
    related: ["python-data-engineering", "dbt-analytics-engineering", "delta-table-crash-course"]
  },

  "dbt-analytics-engineering": {
    tagline: "Az analytics engineering modern módszere — SQL + szoftverfejlesztői best practice-ek.",
    prerequisites: [
      "SQL magabiztos használata",
      "Git alapok",
      "CLI használata"
    ],
    outcomes: [
      "dbt projekt struktúra (models, macros, tests)",
      "Staging → Intermediate → Mart modellezés",
      "Incremental modellek és materialization",
      "Schema test-ek és custom data test-ek",
      "Jinja templating és macro-k",
      "dbt docs és lineage graph generálása",
      "CI/CD integráció GitHub Actions-szel"
    ],
    keyTopics: [
      { title: "Project struktúra", desc: "models/, seeds/, tests/, macros/" },
      { title: "Materialization", desc: "view, table, incremental, ephemeral" },
      { title: "Tests", desc: "unique, not_null, relationships, custom SQL" },
      { title: "Macros", desc: "Jinja, ref(), source(), config()" },
      { title: "Seeds", desc: "CSV → tábla, reference data" },
      { title: "Snapshots", desc: "SCD Type 2 automatikus" }
    ],
    resources: [
      { type: "doc", title: "dbt Docs", url: "https://docs.getdbt.com/" },
      { type: "article", title: "The Analytics Engineer Manifesto", url: "https://www.getdbt.com/what-is-analytics-engineering" },
      { type: "article", title: "dbt Style Guide", url: "https://github.com/dbt-labs/corp/blob/main/dbt_style_guide.md" },
      { type: "tool", title: "dbt Package Hub", url: "https://hub.getdbt.com/" }
    ],
    videos: [
      { title: "dbt Fundamentals (ingyenes hivatalos)", channel: "dbt Labs", url: "https://courses.getdbt.com/courses/fundamentals" },
      { title: "Analytics Engineering with dbt", channel: "Claire Carroll", url: "https://www.youtube.com/results?search_query=analytics+engineering+dbt" }
    ],
    related: ["sql-data-modeling", "airflow-orchestration", "databricks-lakehouse"]
  },

  "databricks-lakehouse": {
    tagline: "Az enterprise lakehouse platform A-tól Z-ig — Unity Catalog, DLT, MLflow workflow-kkal.",
    prerequisites: [
      "Apache Spark alapok (Spark Crash Course ajánlott)",
      "Delta Lake alapismeret",
      "SQL és Python ismeret"
    ],
    outcomes: [
      "Databricks workspace használata",
      "Unity Catalog adat governance (catalog → schema → table)",
      "Delta Live Tables (DLT) deklaratív pipeline",
      "Notebooks, Jobs, és Workflows",
      "MLflow experiment tracking a platformon belül",
      "Cluster konfigurációk és költségoptimalizálás",
      "Permissions és row-level security"
    ],
    keyTopics: [
      { title: "Unity Catalog", desc: "3-level namespace, lineage, fine-grained access" },
      { title: "Delta Live Tables", desc: "Deklaratív pipeline, expectations" },
      { title: "Jobs & Workflows", desc: "Multi-task job, trigger, notifications" },
      { title: "Cluster", desc: "All-purpose vs Job, autoscale, spot instance" },
      { title: "SQL Warehouse", desc: "Serverless, Photon engine" },
      { title: "Asset Bundles", desc: "CI/CD, YAML-alapú deployment" }
    ],
    resources: [
      { type: "doc", title: "Databricks Docs", url: "https://docs.databricks.com/" },
      { type: "doc", title: "Unity Catalog Docs", url: "https://docs.databricks.com/data-governance/unity-catalog/index.html" },
      { type: "tool", title: "Databricks Community Edition (ingyenes)", url: "https://community.cloud.databricks.com/" },
      { type: "article", title: "Databricks Academy (ingyenes kurzusok)", url: "https://www.databricks.com/learn/training/home" }
    ],
    videos: [
      { title: "Databricks Lakehouse Platform Tour", channel: "Databricks", url: "https://www.youtube.com/@Databricks" },
      { title: "Unity Catalog Deep Dive", channel: "Advancing Analytics", url: "https://www.youtube.com/@AdvancingAnalytics" }
    ],
    related: ["spark-crash-course", "delta-table-crash-course", "dbt-analytics-engineering"]
  },

  "streaming-engineering": {
    tagline: "A real-time adat korszaka — Kafka + Spark Structured Streaming produkciós szinten.",
    diagram: {
      title: "Kafka topic · partition · consumer group",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" role="img" aria-label="Kafka topic particionálva, több consumer egy consumer group-on belül párhuzamosan olvas">
        <defs>
          <style>
            .producer{fill:rgba(255,215,0,.1);stroke:#ffd700;stroke-width:2}
            .partition{fill:rgba(88,166,255,.08);stroke:#58a6ff;stroke-width:1.5}
            .msg{fill:rgba(88,166,255,.2);stroke:#58a6ff;stroke-width:1}
            .cg{fill:rgba(179,102,255,.08);stroke:#bc8cff;stroke-width:2;stroke-dasharray:5,3}
            .consumer{fill:rgba(0,255,136,.1);stroke:#3fb950;stroke-width:2}
            .h{fill:#e6edf3;font-family:Inter,Arial,sans-serif;font-weight:700;font-size:12px}
            .s{fill:#8b949e;font-family:'JetBrains Mono',monospace;font-size:10px}
            .lbl{fill:#58a6ff;font-family:Inter,Arial,sans-serif;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px}
            .arr{fill:none;stroke:#6e7681;stroke-width:2;marker-end:url(#ak)}
          </style>
          <marker id="ak" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6e7681"/></marker>
        </defs>

        <!-- Producers -->
        <rect class="producer" x="20" y="40" width="120" height="40" rx="6"/>
        <text class="h" x="80" y="65" text-anchor="middle">🖥️ Producer A</text>
        <rect class="producer" x="20" y="100" width="120" height="40" rx="6"/>
        <text class="h" x="80" y="125" text-anchor="middle">🖥️ Producer B</text>

        <!-- Topic (3 partitions) -->
        <text class="lbl" x="300" y="30">Topic: webshop.clicks</text>
        <g>
          <rect class="partition" x="200" y="40"  width="280" height="50" rx="4"/>
          <text class="s" x="210" y="60">P0</text>
          <rect class="msg" x="235" y="48" width="22" height="34"/>
          <rect class="msg" x="262" y="48" width="22" height="34"/>
          <rect class="msg" x="289" y="48" width="22" height="34"/>
          <rect class="msg" x="316" y="48" width="22" height="34"/>
          <rect class="msg" x="343" y="48" width="22" height="34"/>
          <rect class="msg" x="370" y="48" width="22" height="34"/>
          <rect class="msg" x="397" y="48" width="22" height="34"/>
        </g>
        <g>
          <rect class="partition" x="200" y="100" width="280" height="50" rx="4"/>
          <text class="s" x="210" y="120">P1</text>
          <rect class="msg" x="235" y="108" width="22" height="34"/>
          <rect class="msg" x="262" y="108" width="22" height="34"/>
          <rect class="msg" x="289" y="108" width="22" height="34"/>
          <rect class="msg" x="316" y="108" width="22" height="34"/>
          <rect class="msg" x="343" y="108" width="22" height="34"/>
        </g>
        <g>
          <rect class="partition" x="200" y="160" width="280" height="50" rx="4"/>
          <text class="s" x="210" y="180">P2</text>
          <rect class="msg" x="235" y="168" width="22" height="34"/>
          <rect class="msg" x="262" y="168" width="22" height="34"/>
          <rect class="msg" x="289" y="168" width="22" height="34"/>
          <rect class="msg" x="316" y="168" width="22" height="34"/>
          <rect class="msg" x="343" y="168" width="22" height="34"/>
          <rect class="msg" x="370" y="168" width="22" height="34"/>
        </g>

        <!-- Consumer group -->
        <rect class="cg" x="540" y="30" width="240" height="200" rx="8"/>
        <text class="lbl" x="660" y="50" text-anchor="middle">Consumer Group: analytics</text>
        <rect class="consumer" x="560" y="60" width="200" height="40" rx="6"/>
        <text class="h" x="660" y="85" text-anchor="middle">📈 Consumer 1 (P0)</text>
        <rect class="consumer" x="560" y="115" width="200" height="40" rx="6"/>
        <text class="h" x="660" y="140" text-anchor="middle">📈 Consumer 2 (P1)</text>
        <rect class="consumer" x="560" y="170" width="200" height="40" rx="6"/>
        <text class="h" x="660" y="195" text-anchor="middle">📈 Consumer 3 (P2)</text>

        <!-- Arrows -->
        <path class="arr" d="M142,60  L198,65"/>
        <path class="arr" d="M142,120 L198,125"/>
        <path class="arr" d="M480,65  L558,80"/>
        <path class="arr" d="M480,125 L558,135"/>
        <path class="arr" d="M480,185 L558,190"/>

        <text class="s" x="400" y="260" text-anchor="middle">Partíciókon belül ordered · partíciók között párhuzamos</text>
        <text class="s" x="400" y="278" text-anchor="middle">Consumer group-ban minden partíciót pontosan egy consumer olvas</text>
      </svg>`
    },
    prerequisites: [
      "Apache Spark alapok",
      "Python és Docker",
      "Delta Lake alapismeret"
    ],
    outcomes: [
      "Kafka topic, partition, consumer group megértése",
      "Producer és consumer implementálása Pythonban",
      "Spark Structured Streaming pipeline",
      "Watermarking és late data kezelés",
      "Exactly-once semantics biztosítása",
      "Dead Letter Queue (DLQ) pattern",
      "Stream-to-Delta Lake pipeline"
    ],
    keyTopics: [
      { title: "Kafka alapok", desc: "Broker, topic, partition, replication" },
      { title: "Schema Registry", desc: "Avro, Protobuf, schema evolution" },
      { title: "Structured Streaming", desc: "Micro-batch, trigger, checkpoint" },
      { title: "Watermark", desc: "Event time, late data, window" },
      { title: "Exactly-once", desc: "Idempotent sink, transactional producer" },
      { title: "DLQ", desc: "Poison message, retry pattern" }
    ],
    resources: [
      { type: "doc", title: "Apache Kafka Docs", url: "https://kafka.apache.org/documentation/" },
      { type: "doc", title: "Spark Structured Streaming Guide", url: "https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html" },
      { type: "book", title: "Designing Data-Intensive Applications", url: "https://dataintensive.net/" },
      { type: "article", title: "Confluent Developer", url: "https://developer.confluent.io/" }
    ],
    videos: [
      { title: "Apache Kafka Crash Course", channel: "Conduktor", url: "https://www.youtube.com/@conduktor" },
      { title: "Stream Processing Patterns", channel: "Confluent", url: "https://www.youtube.com/@confluent" }
    ],
    related: ["spark-crash-course", "delta-table-crash-course", "ai-data-engineer"]
  },

  "ai-data-engineer": {
    tagline: "Az AI adatszomjas — ez a kurzus megmutatja, hogyan építesz feature store-t és data quality pipeline-t.",
    prerequisites: [
      "Delta Lake alapok",
      "Apache Spark vagy Python adatfeldolgozás",
      "SQL és dbt előny"
    ],
    outcomes: [
      "Feature store koncepció: online vs offline",
      "Feast feature store használata",
      "Data quality keretrendszer (Great Expectations)",
      "Data lineage követése",
      "Kafka streaming feature-ökhöz",
      "dbt analytics layer ML-re",
      "AI-ready adatinfrastruktúra tervezése"
    ],
    keyTopics: [
      { title: "Feature Store", desc: "Miért kell, mit old meg a tanítás/szolgálás szétválásában" },
      { title: "Feast", desc: "Entity, feature view, offline/online store" },
      { title: "Great Expectations", desc: "Expectation suite, validation, data docs" },
      { title: "Lineage", desc: "OpenLineage, column-level lineage" },
      { title: "Streaming features", desc: "Real-time feature enginering Kafkával" },
      { title: "Data contracts", desc: "Producer/consumer szerződések" }
    ],
    resources: [
      { type: "doc", title: "Feast Docs", url: "https://docs.feast.dev/" },
      { type: "doc", title: "Great Expectations", url: "https://docs.greatexpectations.io/docs/" },
      { type: "doc", title: "OpenLineage", url: "https://openlineage.io/docs/" },
      { type: "article", title: "Feature Store Comparison (Tecton)", url: "https://www.tecton.ai/blog/what-is-a-feature-store/" }
    ],
    videos: [
      { title: "Feature Stores Explained", channel: "Chip Huyen", url: "https://www.youtube.com/results?search_query=feature+store+chip+huyen" },
      { title: "Data Quality at Scale", channel: "Monte Carlo Data", url: "https://www.youtube.com/@MonteCarloData" }
    ],
    related: ["delta-table-crash-course", "streaming-engineering", "aiops-mlops"]
  },

  "ai-engineering": {
    tagline: "A nulláról a production RAG chatbotig — OpenAI, ChromaDB, Streamlit.",
    diagram: {
      title: "RAG pipeline — Retrieval Augmented Generation",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" role="img" aria-label="RAG pipeline áttekintés: felhasználói kérdés embedding-elve, vektor keresés ChromaDB-ben, kontextussal augmentált prompt az LLM-hez">
        <defs>
          <style>
            .stage{fill:rgba(88,166,255,.1);stroke:#58a6ff;stroke-width:2}
            .store{fill:rgba(179,102,255,.1);stroke:#bc8cff;stroke-width:2}
            .llm{fill:rgba(0,255,136,.1);stroke:#3fb950;stroke-width:2}
            .user{fill:rgba(255,215,0,.1);stroke:#ffd700;stroke-width:2}
            .h{fill:#e6edf3;font-family:Inter,Arial,sans-serif;font-weight:700;font-size:14px}
            .s{fill:#8b949e;font-family:Inter,Arial,sans-serif;font-size:10px}
            .lbl{fill:#58a6ff;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600}
            .arr{fill:none;stroke:#6e7681;stroke-width:2;marker-end:url(#a2)}
            .arr-user{fill:none;stroke:#ffd700;stroke-width:2;marker-end:url(#ay)}
          </style>
          <marker id="a2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6e7681"/></marker>
          <marker id="ay" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ffd700"/></marker>
        </defs>

        <!-- Indexing phase (top) -->
        <text class="lbl" x="20" y="30">1. INDEXELÉS (offline, egyszer)</text>
        <rect class="stage" x="20"  y="50" width="140" height="60" rx="8"/>
        <text class="h" x="90" y="75" text-anchor="middle">📄 Dokumentumok</text>
        <text class="s" x="90" y="92" text-anchor="middle">PDF, MD, DOCX</text>
        <rect class="stage" x="200" y="50" width="140" height="60" rx="8"/>
        <text class="h" x="270" y="75" text-anchor="middle">✂️ Chunking</text>
        <text class="s" x="270" y="92" text-anchor="middle">500-1000 token</text>
        <rect class="stage" x="380" y="50" width="140" height="60" rx="8"/>
        <text class="h" x="450" y="75" text-anchor="middle">🧮 Embedding</text>
        <text class="s" x="450" y="92" text-anchor="middle">OpenAI vector</text>
        <rect class="store" x="560" y="50" width="220" height="60" rx="8"/>
        <text class="h" x="670" y="75" text-anchor="middle">🗄️ ChromaDB</text>
        <text class="s" x="670" y="92" text-anchor="middle">Vektoros adatbázis</text>
        <path class="arr" d="M162,80 L198,80"/>
        <path class="arr" d="M342,80 L378,80"/>
        <path class="arr" d="M522,80 L558,80"/>

        <!-- Query phase (bottom) -->
        <text class="lbl" x="20" y="180">2. LEKÉRDEZÉS (runtime, minden kérdésnél)</text>
        <rect class="user" x="20" y="200" width="120" height="60" rx="8"/>
        <text class="h" x="80" y="225" text-anchor="middle">👤 Kérdés</text>
        <text class="s" x="80" y="242" text-anchor="middle">"Visszáru idő?"</text>
        <rect class="stage" x="180" y="200" width="140" height="60" rx="8"/>
        <text class="h" x="250" y="225" text-anchor="middle">🧮 Embed query</text>
        <text class="s" x="250" y="242" text-anchor="middle">vektor</text>
        <path class="arr" d="M320,230 L378,230"/>
        <rect class="store" x="380" y="200" width="140" height="60" rx="8"/>
        <text class="h" x="450" y="225" text-anchor="middle">🔍 Top-K keresés</text>
        <text class="s" x="450" y="242" text-anchor="middle">similarity match</text>
        <path class="arr" d="M450,195 L450,115"/>
        <path class="arr" d="M520,230 L558,230"/>
        <rect class="llm" x="560" y="200" width="220" height="60" rx="8"/>
        <text class="h" x="670" y="225" text-anchor="middle">🤖 LLM generáció</text>
        <text class="s" x="670" y="242" text-anchor="middle">GPT-4o + kontextus → válasz</text>
        <path class="arr-user" d="M140,230 L178,230"/>

        <!-- Response -->
        <path class="arr" d="M670,265 L670,310 L80,310 L80,270" stroke-dasharray="5,3"/>
        <text class="s" x="400" y="305" text-anchor="middle" fill="#3fb950">Forrásra hivatkozó, megalapozott válasz</text>
      </svg>`
    },
    prerequisites: [
      "Python alapok",
      "Docker ajánlott",
      "Alapvető NLP fogalmak előny"
    ],
    outcomes: [
      "OpenAI API (chat completions, embeddings) használata",
      "Embedding-alapú szemantikus keresés",
      "ChromaDB vektoros adatbázis kezelése",
      "RAG (Retrieval-Augmented Generation) pipeline",
      "Chunking stratégiák PDF és Markdown doksikra",
      "Prompt engineering és structured outputs",
      "Streamlit UI a chatbotnak"
    ],
    keyTopics: [
      { title: "LLM alapok", desc: "Token, context window, temperature, top_p" },
      { title: "Embedding-ek", desc: "text-embedding-3, cosine similarity" },
      { title: "Vektoros DB", desc: "Chroma, Qdrant, pgvector, Pinecone" },
      { title: "Chunking", desc: "Fixed, recursive, semantic, parent-child" },
      { title: "Prompt design", desc: "System message, few-shot, XML tagek" },
      { title: "Structured output", desc: "JSON mode, function calling, tool use" }
    ],
    resources: [
      { type: "doc", title: "OpenAI API Docs", url: "https://platform.openai.com/docs" },
      { type: "doc", title: "ChromaDB Docs", url: "https://docs.trychroma.com/" },
      { type: "book", title: "Chip Huyen: AI Engineering (O'Reilly)", url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/" },
      { type: "article", title: "Anthropic Prompt Engineering Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" }
    ],
    videos: [
      { title: "RAG from Scratch", channel: "LangChain", url: "https://www.youtube.com/playlist?list=PLfaIDFEXuae2LXbO1_PKyVJiQ23ZztA0x" },
      { title: "Building RAG Applications", channel: "DeepLearning.AI", url: "https://www.deeplearning.ai/short-courses/" }
    ],
    related: ["python-data-engineering", "rag-evaluation-ai-safety", "llmops-genai-production"]
  },

  "rag-evaluation-ai-safety": {
    tagline: "Honnan tudod, hogy az AI jól válaszol? Szisztematikus evaluáció és biztonsági mérnökség.",
    prerequisites: [
      "AI Engineering kurzus vagy hasonló RAG tudás",
      "Python és OpenAI API tapasztalat"
    ],
    outcomes: [
      "Golden dataset készítése és karbantartása",
      "Retrieval metrikák: precision@k, recall@k, MRR, NDCG",
      "Generation metrikák: faithfulness, answer relevance",
      "Hallucination detekció",
      "Prompt regression tesztelés",
      "Guardrails és content filtering",
      "Red teaming alapok"
    ],
    keyTopics: [
      { title: "Golden dataset", desc: "Szakértők által annotált kérdés-válasz párok" },
      { title: "Retrieval eval", desc: "Precision, recall, MRR@k, hit rate" },
      { title: "Generation eval", desc: "Faithfulness, relevance, LLM-as-judge" },
      { title: "Hallucination", desc: "Detekció, csökkentés, citation" },
      { title: "Guardrails", desc: "Input/output filtering, PII, jailbreak" },
      { title: "Red teaming", desc: "Adversarial tesztelés, prompt injection" }
    ],
    resources: [
      { type: "doc", title: "RAGAS (RAG evaluáció)", url: "https://docs.ragas.io/" },
      { type: "tool", title: "Promptfoo (prompt regression)", url: "https://www.promptfoo.dev/" },
      { type: "doc", title: "NVIDIA NeMo Guardrails", url: "https://docs.nvidia.com/nemo/guardrails/" },
      { type: "article", title: "Anthropic: Building Safer LLM Apps", url: "https://www.anthropic.com/news" }
    ],
    videos: [
      { title: "Evaluating RAG Applications", channel: "Jason Liu", url: "https://www.youtube.com/results?search_query=rag+evaluation+jason+liu" },
      { title: "LLM Red Teaming", channel: "DeepLearning.AI", url: "https://www.deeplearning.ai/short-courses/" }
    ],
    related: ["ai-engineering", "llmops-genai-production", "aiops-mlops"]
  },

  "llmops-genai-production": {
    tagline: "A production LLM alkalmazás stabil, mérhető és költséghatékony — ez a kurzus megmutatja, hogyan.",
    prerequisites: [
      "AI Engineering vagy hasonló RAG tudás",
      "Docker, Python alapok",
      "Alapvető MLOps előny"
    ],
    outcomes: [
      "Prompt versioning és kezelés",
      "Eval dataset automatizált futtatása",
      "MLflow LLM tracking",
      "Latency és költség monitoring",
      "Guardrails és fallback model",
      "A/B tesztelés prompt változatokra",
      "Production deployment stratégiák"
    ],
    keyTopics: [
      { title: "Prompt versioning", desc: "Git, MLflow, LangSmith" },
      { title: "Eval pipeline", desc: "CI/CD-ben futó prompt tesztek" },
      { title: "Observability", desc: "Tracing, structured logging, Langfuse" },
      { title: "Cost tracking", desc: "Token count, cache hit rate" },
      { title: "Fallback", desc: "Model tiering, timeout, retry" },
      { title: "A/B tests", desc: "Multi-armed bandit, statistical significance" }
    ],
    resources: [
      { type: "doc", title: "MLflow LLM Tracking", url: "https://mlflow.org/docs/latest/llms/index.html" },
      { type: "tool", title: "Langfuse (open-source observability)", url: "https://langfuse.com/" },
      { type: "tool", title: "LangSmith (LangChain)", url: "https://www.langchain.com/langsmith" },
      { type: "article", title: "Patterns for Building LLM-based Systems", url: "https://eugeneyan.com/writing/llm-patterns/" }
    ],
    videos: [
      { title: "LLMOps: Production ML for LLMs", channel: "DeepLearning.AI", url: "https://www.deeplearning.ai/short-courses/" },
      { title: "Monitoring LLM Applications", channel: "Arize AI", url: "https://www.youtube.com/@arizeai" }
    ],
    related: ["ai-engineering", "rag-evaluation-ai-safety", "aiops-mlops"]
  },

  "aiops-mlops": {
    tagline: "ML modelled élesítése, monitorozása és folyamatos újratanítása — production-grade MLOps.",
    diagram: {
      title: "MLOps életciklus — tréning, deploy, monitoring, retrain",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340" role="img" aria-label="MLOps életciklus: adatok, feature engineering, tréning MLflow-val, model registry, FastAPI deployment, Prometheus monitoring, drift detektálás, retrain loop">
        <defs>
          <style>
            .data{fill:rgba(88,166,255,.1);stroke:#58a6ff;stroke-width:2}
            .train{fill:rgba(255,215,0,.1);stroke:#ffd700;stroke-width:2}
            .serve{fill:rgba(0,255,136,.1);stroke:#3fb950;stroke-width:2}
            .monitor{fill:rgba(179,102,255,.1);stroke:#bc8cff;stroke-width:2}
            .h{fill:#e6edf3;font-family:Inter,Arial,sans-serif;font-weight:700;font-size:12px}
            .s{fill:#8b949e;font-family:Inter,Arial,sans-serif;font-size:10px}
            .arr{fill:none;stroke:#6e7681;stroke-width:2;marker-end:url(#am)}
            .arr-r{fill:none;stroke:#ff4466;stroke-width:2;stroke-dasharray:5,3;marker-end:url(#ar)}
          </style>
          <marker id="am" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6e7681"/></marker>
          <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ff4466"/></marker>
        </defs>

        <rect class="data" x="20" y="40" width="130" height="60" rx="8"/>
        <text class="h" x="85" y="65" text-anchor="middle">📊 Feature Store</text>
        <text class="s" x="85" y="82" text-anchor="middle">online + offline</text>

        <rect class="train" x="180" y="40" width="130" height="60" rx="8"/>
        <text class="h" x="245" y="65" text-anchor="middle">🏋️ Train</text>
        <text class="s" x="245" y="82" text-anchor="middle">scikit-learn · xgb</text>

        <rect class="train" x="340" y="40" width="130" height="60" rx="8"/>
        <text class="h" x="405" y="65" text-anchor="middle">📋 MLflow</text>
        <text class="s" x="405" y="82" text-anchor="middle">experiment tracking</text>

        <rect class="train" x="500" y="40" width="130" height="60" rx="8"/>
        <text class="h" x="565" y="65" text-anchor="middle">📦 Registry</text>
        <text class="s" x="565" y="82" text-anchor="middle">staging → prod</text>

        <rect class="serve" x="660" y="40" width="120" height="60" rx="8"/>
        <text class="h" x="720" y="65" text-anchor="middle">🐳 Docker</text>
        <text class="s" x="720" y="82" text-anchor="middle">build · push</text>

        <rect class="serve" x="500" y="160" width="130" height="60" rx="8"/>
        <text class="h" x="565" y="185" text-anchor="middle">⚡ FastAPI</text>
        <text class="s" x="565" y="202" text-anchor="middle">/predict serving</text>

        <rect class="serve" x="660" y="160" width="120" height="60" rx="8"/>
        <text class="h" x="720" y="185" text-anchor="middle">👤 Clients</text>
        <text class="s" x="720" y="202" text-anchor="middle">ms latency</text>

        <rect class="monitor" x="340" y="260" width="150" height="60" rx="8"/>
        <text class="h" x="415" y="285" text-anchor="middle">📈 Prometheus</text>
        <text class="s" x="415" y="302" text-anchor="middle">+ Grafana dashboard</text>

        <rect class="monitor" x="520" y="260" width="150" height="60" rx="8"/>
        <text class="h" x="595" y="285" text-anchor="middle">🔬 Drift detection</text>
        <text class="s" x="595" y="302" text-anchor="middle">KS test · PSI</text>

        <path class="arr" d="M152,70 L178,70"/>
        <path class="arr" d="M312,70 L338,70"/>
        <path class="arr" d="M472,70 L498,70"/>
        <path class="arr" d="M632,70 L658,70"/>
        <path class="arr" d="M720,102 L720,160 L632,190"/>
        <path class="arr" d="M632,190 L658,190"/>
        <path class="arr" d="M565,222 L565,258"/>
        <path class="arr" d="M490,290 L518,290"/>
        <path class="arr-r" d="M520,290 L85,290 L85,102"/>
        <text class="s" fill="#ff4466" x="300" y="280" text-anchor="middle">retrain trigger ha drift</text>
      </svg>`
    },
    prerequisites: [
      "Python és scikit-learn ismeret",
      "Docker alapok",
      "API alapok (REST)"
    ],
    outcomes: [
      "MLflow experiment tracking",
      "Model Registry és staging/production promotion",
      "FastAPI model serving",
      "Docker konténerizáció ML modellhez",
      "CI/CD pipeline GitHub Actions-szel",
      "Grafana monitoring dashboard",
      "Data drift és model drift detektálás"
    ],
    keyTopics: [
      { title: "MLflow", desc: "Tracking, Projects, Models, Registry" },
      { title: "Model Serving", desc: "FastAPI, BentoML, KServe, Seldon" },
      { title: "CI/CD", desc: "GitHub Actions, automated training, deploy" },
      { title: "Monitoring", desc: "Prometheus scrape, Grafana dashboard" },
      { title: "Drift", desc: "Data drift, concept drift, KS test" },
      { title: "Feature Store", desc: "Consistency tanítás és szolgálás között" }
    ],
    resources: [
      { type: "doc", title: "MLflow Docs", url: "https://mlflow.org/docs/latest/index.html" },
      { type: "doc", title: "FastAPI Docs", url: "https://fastapi.tiangolo.com/" },
      { type: "book", title: "Chip Huyen: Designing Machine Learning Systems", url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/" },
      { type: "tool", title: "Evidently AI (drift detection)", url: "https://www.evidentlyai.com/" }
    ],
    videos: [
      { title: "MLOps Zoomcamp (ingyenes)", channel: "DataTalksClub", url: "https://github.com/DataTalksClub/mlops-zoomcamp" },
      { title: "ML in Production", channel: "Made With ML", url: "https://madewithml.com/" }
    ],
    related: ["ai-data-engineer", "llmops-genai-production", "docker-local-data-platform"]
  }
};
