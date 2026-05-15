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
    "Egy dummy e-commerce rendszer termékkatalógussal, rendelésekkel és clickstream eseményekkel.",
    "Ugyanaz az adat megy végig a source -> bronze -> silver -> gold -> governance -> data product -> AI -> ops rétegeken.",
    "Minden kurzus egy konkrét platformréteget épít hozzá, nem elszigetelt tutorialt."
  ],
  artifacts: [
    { label: "Demo app", value: "webshop-pro/index.html" },
    { label: "Local Docker Lab", value: "docker-compose.yml + webshop-lab/*" },
    { label: "Forrásadatok", value: "webshop-pro/fixtures/*.json" },
    { label: "Platform térkép", value: "webshop-pro/project-map.json" },
    { label: "Screenshotok", value: "assets/images/webshop-pro-*.png" }
  ],
  tools: [
    "SQL", "Python", "Docker", "PostgreSQL", "MinIO", "Delta Lake", "Parquet",
    "Apache Spark", "Apache Kafka", "Airflow", "dbt", "Databricks", "Unity Catalog",
    "Apache Iceberg", "Apache Hudi", "Feast", "Great Expectations", "MLflow",
    "FastAPI", "Grafana", "Prometheus", "OpenAI", "ChromaDB", "Streamlit",
    "Ollama", "GGUF", "Local LLM", "Kubernetes", "DataHub", "OpenLineage", "OPA", "Presidio", "LangGraph",
    "CrewAI", "Anthropic"
  ],
  courses: {
    "sql-data-modeling": {
      role: "A webshop relációs magját tervezed meg: customer, product, order, order_item és event táblákat.",
      artifact: "Star schema: fact_orders, dim_customer, dim_product, dim_date.",
      tools: ["SQL", "PostgreSQL", "Parquet"],
      labServices: ["postgres"],
      dailyUse: "Megérted, miből készül egy dashboard vagy egy üzleti riport, és hogyan kapcsolod össze a szétszórt adatokat."
    },
    "python-data-engineering": {
      role: "A JSON webshop forrásokat betöltöd, validálod és előkészíted feldolgozásra.",
      artifact: "Ingest pipeline: catalog.json, orders.json, events.json -> tisztított dataset.",
      tools: ["Python", "pandas", "Parquet"],
      labServices: ["lab-runner", "postgres"],
      dailyUse: "Automatizálod az ismétlődő adatmozgatást, és hamarabb elkapod a hibás inputokat."
    },
    "docker-local-data-platform": {
      role: "A WebShop Pro lokális fejlesztői platformját rakod össze konténerekből.",
      artifact: "Local stack blueprint: app, storage, monitoring, orchestration.",
      tools: ["Docker", "PostgreSQL", "MinIO", "Prometheus", "Grafana"],
      labServices: ["course-site", "webshop", "postgres", "minio", "prometheus", "grafana"],
      dailyUse: "Egy parancsból indítható, reprodukálható fejlesztői környezetet kapsz."
    },
    "delta-table-crash-course": {
      role: "A nyers webshop adatból Bronze/Silver/Gold Delta Lake táblák készülnek.",
      artifact: "orders_bronze, orders_silver, daily_revenue_gold.",
      tools: ["Delta Lake", "Parquet", "Python"],
      labServices: ["lab-runner", "spark-master", "minio"],
      dailyUse: "Verziózható, visszakereshető és javítható adattáblákat építesz."
    },
    "open-table-formats": {
      role: "A webshop lakehouse tábláit Delta, Iceberg és Hudi szempontból hasonlítod össze.",
      artifact: "Döntési mátrix: melyik table format milyen webshop workloadhoz passzol.",
      tools: ["Delta Lake", "Apache Iceberg", "Apache Hudi", "Parquet"],
      labServices: ["lab-runner", "minio", "unity-catalog"],
      dailyUse: "Nem tool-név alapján döntesz, hanem workload, governance és interoperabilitás alapján."
    },
    "spark-crash-course": {
      role: "A rendeléseket, clickstreamet és katalógust Spark DataFrame API-val dolgozod fel.",
      artifact: "Nagy volumenű ETL: joinok, aggregációk, customer feature tábla.",
      tools: ["Apache Spark", "Spark SQL", "Delta Lake"],
      labServices: ["spark-master", "spark-worker", "databricks-local"],
      dailyUse: "Nagy adatnál is átlátható, optimalizálható feldolgozást tudsz írni."
    },
    "airflow-orchestration": {
      role: "A napi WebShop Pro adatfrissítést Airflow DAG-ba rendezed.",
      artifact: "webshop_daily_etl: ingest -> quality -> silver -> gold -> notify.",
      tools: ["Airflow", "Python", "Delta Lake"],
      labServices: ["airflow"],
      dailyUse: "Látható és újrafuttatható lesz, hol tart a pipeline, hol hibázott, mit kell javítani."
    },
    "dbt-analytics-engineering": {
      role: "A webshop analitikai réteget dbt modellekkel, tesztekkel és dokumentációval építed.",
      artifact: "stg_orders, int_customer_orders, mart_daily_revenue.",
      tools: ["dbt", "SQL", "Delta Lake"],
      labServices: ["dbt", "postgres"],
      dailyUse: "A riportok logikája verziózott, tesztelt és mások számára is érthető lesz."
    },
    "databricks-lakehouse": {
      role: "A WebShop Pro lakehouse-t managed platform gondolkodással viszed tovább.",
      artifact: "Workspace workflow, Unity Catalog jogosultságok, MLflow integráció.",
      tools: ["Databricks", "Unity Catalog", "Delta Lake", "MLflow"],
      labServices: ["databricks-local", "unity-catalog", "spark-master", "mlflow"],
      dailyUse: "Megérted, hogyan néz ki ugyanez céges, enterprise környezetben."
    },
    "data-governance": {
      role: "A WebShop Pro adatait osztályozod, PII-t redaktálsz, hozzáférést szabályozol és auditálhatóvá teszed.",
      artifact: "Governance blueprint: PII detection, RLS policy, lineage eventek, audit log és retention policy.",
      tools: ["Presidio", "Unity Catalog", "OpenLineage", "SQL"],
      labServices: ["postgres", "unity-catalog", "lab-runner", "minio", "prometheus", "grafana"],
      dailyUse: "A platform nem csak működik, hanem bizonyíthatóan biztonságos, visszakövethető és compliance-kész."
    },
    "data-mesh": {
      role: "A WebShop Pro doménjeit data productokra bontod marketing, sales, support és fulfillment felelősséggel.",
      artifact: "Domain-owned data product térkép: output portok, SLA-k, data contractok és catalog discovery.",
      tools: ["dbt", "Unity Catalog", "DataHub", "OPA"],
      labServices: ["dbt", "unity-catalog", "postgres", "lab-runner", "minio"],
      dailyUse: "A központi bottleneck helyett skálázható, domain-tulajdonú adatplatformban gondolkodsz."
    },
    "streaming-engineering": {
      role: "A clickstream és checkout eseményeket Kafka topicokból dolgozod fel.",
      artifact: "events topic -> streaming silver table -> realtime KPI.",
      tools: ["Apache Kafka", "Spark Structured Streaming", "Delta Lake"],
      labServices: ["kafka", "event-producer", "spark-master"],
      dailyUse: "Nem csak napi batch riportot tudsz, hanem közel valós idejű jelzéseket is."
    },
    "ai-data-engineer": {
      role: "A webshop ügyfél- és termékfeature-jeit AI-ready formátumba szervezed.",
      artifact: "customer_features, product_features, Feast feature view, data quality check.",
      tools: ["Feast", "Great Expectations", "Spark", "dbt"],
      labServices: ["lab-runner", "dbt", "kafka", "postgres"],
      dailyUse: "A modellek ugyanazokat a feature-öket kapják training és serving közben."
    },
    "ai-engineering": {
      role: "A webshop szabályzataiból és rendelésadataiból RAG ügyfélszolgálati asszisztenst építesz.",
      artifact: "Support chatbot: shipping, return, warranty kérdések forrásra hivatkozva.",
      tools: ["OpenAI", "ChromaDB", "Streamlit", "Python"],
      labServices: ["chroma", "streamlit", "api"],
      dailyUse: "Az AI válaszai nem hasból jönnek, hanem visszakeresett, ellenőrizhető kontextusból."
    },
    "local-llm-engineering": {
      role: "A WebShop Pro support bothoz privacy-first lokális LLM gatewayt tervezel.",
      artifact: "Local AI gateway: Ollama-kompatibilis kliens, WebShop Pro RAG, benchmark és hybrid routing.",
      tools: ["Ollama", "GGUF", "ChromaDB", "FastAPI", "Docker"],
      labServices: ["api", "chroma", "streamlit", "mlflow", "prometheus", "grafana", "lab-runner"],
      labCommand: "docker compose --profile local-llm up -d",
      dailyUse: "Eldöntöd, mely kérdések futhatnak lokálisan, mikor kell cloud fallback, és hogyan bizonyítod méréssel a döntést."
    },
    "rag-evaluation-ai-safety": {
      role: "A WebShop Pro AI support bot válaszait méred és hibákra teszteled.",
      artifact: "Golden dataset, retrieval metrics, hallucination regression suite.",
      tools: ["RAGAS", "Promptfoo", "OpenAI"],
      labServices: ["lab-runner", "chroma", "api"],
      dailyUse: "Látod, mikor romlik a bot, és nem érzés alapján döntesz az AI minőségéről."
    },
    "llmops-genai-production": {
      role: "A support botot production gondolkodással verziózod, méred és monitorozod.",
      artifact: "Prompt registry, cost tracking, latency dashboard, fallback flow.",
      tools: ["MLflow", "Grafana", "OpenAI", "Docker"],
      labServices: ["mlflow", "prometheus", "grafana", "api"],
      dailyUse: "Az LLM app nem demo marad, hanem követhető költségű és stabil szolgáltatás lesz."
    },
    "agentic-ai": {
      role: "A support botot tool-hívó, memóriával és döntési gráffal rendelkező ügyfél-agentté bővíted.",
      artifact: "Customer Order Agent: ReAct loop, LangGraph state machine, multi-agent handoff és streaming API.",
      tools: ["OpenAI", "LangGraph", "CrewAI", "Anthropic"],
      labServices: ["api", "streamlit", "chroma", "postgres", "lab-runner", "prometheus", "grafana"],
      dailyUse: "Megtanulod, mikor indokolt agentet építeni, hogyan kontrolláld a tool-hívásokat és hogyan mérd a futásokat."
    },
    "aiops-mlops": {
      role: "A webshop churn modellt kiszolgálod API-n és monitorozod.",
      artifact: "FastAPI /predict, MLflow model registry, Grafana model health panel.",
      tools: ["MLflow", "FastAPI", "Docker", "Grafana"],
      labServices: ["mlflow", "api", "prometheus", "grafana"],
      dailyUse: "A modell nem notebookban ragad, hanem szolgáltatásként fut és figyelhető."
    }
  }
};
