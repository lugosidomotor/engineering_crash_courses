// WebShop Pro shared case study metadata.
// Used by the landing page and every course page to keep the project story consistent.
window.WEBSHOP_CASE_STUDY = {
  title: "WebShop Pro",
  demoUrl: "../webshop-pro/",
  rootDemoUrl: "./webshop-pro/",
  screenshots: {
    dashboard: "../assets/images/webshop-pro-dashboard.png",
    platform: "../assets/images/webshop-pro-platform.png"
  },
  lab: {
    composeFile: "docker-compose.yml",
    guideUrl: "../webshop-lab/",
    rootGuideUrl: "./webshop-lab/",
    command: "docker compose up -d --build",
    urls: [
      { label: "Kurzussite", value: "http://localhost:8020/" },
      { label: "Dummy webshop", value: "http://localhost:8010/" },
      { label: "FastAPI docs", value: "http://localhost:8000/docs" },
      { label: "Airflow", value: "http://localhost:8088/" },
      { label: "Spark UI", value: "http://localhost:8090/" },
      { label: "dbt docs", value: "http://localhost:8092/" },
      { label: "MinIO", value: "http://localhost:9001/" },
      { label: "MLflow", value: "http://localhost:5000/" },
      { label: "Streamlit", value: "http://localhost:8501/" },
      { label: "Grafana", value: "http://localhost:3000/" }
    ]
  },
  overview: [
    "Egy dummy e-commerce rendszer termekkatalogussal, rendelesekkel es clickstream esemenyekkel.",
    "Ugyanaz az adat megy vegig source -> bronze -> silver -> gold -> AI -> ops retegeken.",
    "Minden kurzus egy konkret platformreteget epit hozza, nem elszigetelt tutorialt."
  ],
  artifacts: [
    { label: "Demo app", value: "webshop-pro/index.html" },
    { label: "Docker lab", value: "docker-compose.yml + webshop-lab/*" },
    { label: "Forrasadatok", value: "webshop-pro/fixtures/*.json" },
    { label: "Platform terkep", value: "webshop-pro/project-map.json" },
    { label: "Screenshotok", value: "assets/images/webshop-pro-*.png" }
  ],
  tools: [
    "SQL", "Python", "Docker", "PostgreSQL", "MinIO", "Delta Lake", "Parquet",
    "Apache Spark", "Apache Kafka", "Airflow", "dbt", "Databricks", "Unity Catalog",
    "Apache Iceberg", "Apache Hudi", "Feast", "Great Expectations", "MLflow",
    "FastAPI", "Grafana", "Prometheus", "OpenAI", "ChromaDB", "Streamlit",
    "Kubernetes"
  ],
  courses: {
    "sql-data-modeling": {
      role: "A webshop relacios magjat tervezed meg: customer, product, order, order_item es event tablakat.",
      artifact: "Star schema: fact_orders, dim_customer, dim_product, dim_date.",
      tools: ["SQL", "PostgreSQL", "Parquet"],
      labServices: ["postgres"],
      dailyUse: "Megerted, mibol keszul egy dashboard vagy egy uzleti riport, es hogyan kapcsolod ossze a szetszort adatokat."
    },
    "python-data-engineering": {
      role: "A JSON/CSV webshop forrasokat betoltod, validalod es elokeszited feldolgozasra.",
      artifact: "Ingest pipeline: catalog.json, orders.json, events.json -> tisztitott dataset.",
      tools: ["Python", "pandas", "Parquet"],
      labServices: ["lab-runner", "postgres"],
      dailyUse: "Automatizalod az ismetlodo adatmozgatast, es hamarabb elkapod a hibas inputokat."
    },
    "docker-local-data-platform": {
      role: "A WebShop Pro lokalis fejlesztoi platformjat rakod ossze kontenerekbol.",
      artifact: "Local stack blueprint: app, storage, monitoring, orchestration.",
      tools: ["Docker", "PostgreSQL", "MinIO", "Prometheus", "Grafana"],
      labServices: ["course-site", "webshop", "postgres", "minio", "prometheus", "grafana"],
      dailyUse: "Egy parancsbol indithato, reprodukalhato fejlesztoi kornyezetet kapsz."
    },
    "delta-table-crash-course": {
      role: "A nyers webshop adatbol Bronze/Silver/Gold Delta Lake tablak keszulnek.",
      artifact: "orders_bronze, orders_silver, daily_revenue_gold.",
      tools: ["Delta Lake", "Parquet", "Python"],
      labServices: ["lab-runner", "spark-master", "minio"],
      dailyUse: "Verziozhato, visszakeresheto es javithato adattablakat epitesz."
    },
    "open-table-formats": {
      role: "A webshop lakehouse tablait Delta, Iceberg es Hudi szempontbol hasonlitod ossze.",
      artifact: "Dontesi matrix: melyik table format milyen webshop workloadhoz passzol.",
      tools: ["Delta Lake", "Apache Iceberg", "Apache Hudi", "Parquet"],
      labServices: ["lab-runner", "minio", "unity-catalog"],
      dailyUse: "Nem tool-nev alapjan dontesz, hanem workload, governance es interoperabilitas alapjan."
    },
    "spark-crash-course": {
      role: "A rendeleseket, clickstreamet es katalogust Spark DataFrame API-val dolgozod fel.",
      artifact: "Nagy volumen ETL: joinok, aggregaciok, customer feature tabla.",
      tools: ["Apache Spark", "Spark SQL", "Delta Lake"],
      labServices: ["spark-master", "spark-worker", "databricks-local"],
      dailyUse: "Nagy adatnal is atlathato, optimalizalhato feldolgozast tudsz irni."
    },
    "airflow-orchestration": {
      role: "A napi WebShop Pro adatfrissitest Airflow DAG-ba rendezed.",
      artifact: "webshop_daily_etl: ingest -> quality -> silver -> gold -> notify.",
      tools: ["Airflow", "Python", "Delta Lake"],
      labServices: ["airflow"],
      dailyUse: "Lathato es ujrafuttathato lesz, hol tart a pipeline, hol hibazott, mit kell javitani."
    },
    "dbt-analytics-engineering": {
      role: "A webshop analitikai reteget dbt modellekkel, tesztekkel es dokumentacioval epited.",
      artifact: "stg_orders, int_customer_orders, mart_daily_revenue.",
      tools: ["dbt", "SQL", "Delta Lake"],
      labServices: ["dbt", "postgres"],
      dailyUse: "A riportok logikaja verziozott, tesztelt es masok szamara is ertheto lesz."
    },
    "databricks-lakehouse": {
      role: "A WebShop Pro lakehouse-t managed platform gondolkodassal viszed tovabb.",
      artifact: "Workspace workflow, Unity Catalog jogosultsagok, MLflow integracio.",
      tools: ["Databricks", "Unity Catalog", "Delta Lake", "MLflow"],
      labServices: ["databricks-local", "unity-catalog", "spark-master", "mlflow"],
      dailyUse: "Megerted, hogyan nez ki ugyanez ceges, enterprise kornyezetben."
    },
    "streaming-engineering": {
      role: "A clickstream es checkout esemenyeket Kafka topicokbol dolgozod fel.",
      artifact: "events topic -> streaming silver table -> realtime KPI.",
      tools: ["Apache Kafka", "Spark Structured Streaming", "Delta Lake"],
      labServices: ["kafka", "event-producer", "spark-master"],
      dailyUse: "Nem csak napi batch riportot tudsz, hanem kozel valos ideju jelzeseket is."
    },
    "ai-data-engineer": {
      role: "A webshop ugyfel es termek feature-jeit AI-ready formatumba szervezed.",
      artifact: "customer_features, product_features, Feast feature view, data quality check.",
      tools: ["Feast", "Great Expectations", "Spark", "dbt"],
      labServices: ["lab-runner", "dbt", "kafka", "postgres"],
      dailyUse: "A modellek ugyanazokat a feature-oket kapjak training es serving kozben."
    },
    "ai-engineering": {
      role: "A webshop szabalyzataibol es rendelesadataibol RAG ugyfelszolgalati asszisztenst epitesz.",
      artifact: "Support chatbot: shipping, return, warranty kerdesek forrasra hivatkozva.",
      tools: ["OpenAI", "ChromaDB", "Streamlit", "Python"],
      labServices: ["chroma", "streamlit", "api"],
      dailyUse: "Az AI valaszai nem hasbol jonnek, hanem visszakeresett, ellenorizheto kontextusbol."
    },
    "rag-evaluation-ai-safety": {
      role: "A WebShop Pro AI support bot valaszait mered es hibakra teszteled.",
      artifact: "Golden dataset, retrieval metrics, hallucination regression suite.",
      tools: ["RAGAS", "Promptfoo", "OpenAI"],
      labServices: ["lab-runner", "chroma", "api"],
      dailyUse: "Latod, mikor romlik a bot, es nem erzes alapjan dontesz az AI minosegerol."
    },
    "llmops-genai-production": {
      role: "A support botot production gondolkodassal verziozod, mered es monitorozod.",
      artifact: "Prompt registry, cost tracking, latency dashboard, fallback flow.",
      tools: ["MLflow", "Grafana", "OpenAI", "Docker"],
      labServices: ["mlflow", "prometheus", "grafana", "api"],
      dailyUse: "Az LLM app nem demo marad, hanem kovetheto koltsegu es stabil szolgaltatas lesz."
    },
    "aiops-mlops": {
      role: "A webshop churn modellt kiszolgalod API-n es monitorozod.",
      artifact: "FastAPI /predict, MLflow model registry, Grafana model health panel.",
      tools: ["MLflow", "FastAPI", "Docker", "Grafana"],
      labServices: ["mlflow", "api", "prometheus", "grafana"],
      dailyUse: "A modell nem notebookban ragad, hanem szolgaltataskent fut es figyelheto."
    }
  }
};
