# Quickstart

5 perc alatt elindul az egész stack a saját géppen.

## Mire van szükséged

- **Git** — repo klónozására
- **Python 3.11** — ⚠️ **kifejezetten 3.11**, nem 3.12+ (lásd lent). Virtuális környezet és kódfuttatás.
- **Docker Desktop** (Windows/Mac) vagy **Docker Engine + docker compose v2** (Linux) — a teljes lab indításához
- ~10 GB szabad hely + 8 GB RAM (a `--profile all` indításhoz)

> ⚠️  **Python verzió-figyelmeztetés**: a kurzusokat Python **3.11**-en teszteltük (LTS-ig). Az `apache-airflow==2.10.3` és a `feast==0.41.3` Python 3.12+-on build-problémát okoz, Python 3.13+-on pedig nem fog menni az Airflow. Ha 3.13 az alapértelmezett a gépeden:
> - **macOS**: `brew install python@3.11` → `python3.11 -m venv .venv`
> - **Linux**: `sudo apt install python3.11` → `python3.11 -m venv .venv`
> - **Windows**: töltsd le a 3.11-et a [python.org](https://www.python.org/downloads/release/python-3119/)-ról, és hivatkozz rá teljes path-szel a bootstrap scriptben (`PYTHON_BIN="C:\Python311\python.exe"`).

## 1. Repo klónozása

```bash
git clone https://github.com/lugosidomotor/engineering_crash_courses.git
cd engineering_crash_courses
```

## 2. Python környezet (kódminták futtatásához)

### Linux / macOS

```bash
bash bootstrap.sh
source .venv/bin/activate
python smoke_test.py
```

### Windows (PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -File bootstrap.ps1
.\.venv\Scripts\Activate.ps1
python smoke_test.py
```

A `smoke_test.py` kiírja, mely csomagok importálhatók — a "Missing" listát `pip install -r requirements.txt` végzi.

## 3. Docker lab (teljes platform)

A Docker Compose **profilrendszer** segítségével csak azt indíthatod, ami az adott kurzushoz kell. Listázás:

```bash
docker compose config --profiles
```

### Tipikus profilok

| Profil | Mit indít? | Memória |
|--------|-----------|---------|
| _(none)_ | Postgres + Adminer + webshop + course-site | ~512 MB |
| `--profile docker` | Core + MinIO + Spark + Airflow + monitoring | ~3 GB |
| `--profile delta` | Core + MinIO + Spark + lab-runner | ~2 GB |
| `--profile spark` | Core + Spark + Databricks notebook + MLflow + Unity Catalog | ~4 GB |
| `--profile streaming` | Core + Kafka + Spark + Kafka UI | ~2 GB |
| `--profile dbt` | Core + dbt | ~1 GB |
| `--profile ai-eng` | Core + ChromaDB + Streamlit + FastAPI + MLflow | ~2 GB |
| `--profile aiops` | Core + MLflow + FastAPI + Prometheus + Grafana | ~2 GB |
| `--profile all` | **MINDEN** szolgáltatás | ~7 GB |

### Indítás

```bash
# Csak a webshop demo + Postgres + Adminer
docker compose up -d

# Delta kurzushoz a teljes data lake stack
docker compose --profile delta up -d

# Minden indítása (lassú, sok RAM)
docker compose --profile all up -d
```

### Elérhető URL-ek

| Szolgáltatás | URL | Bejelentkezés |
|--------------|-----|---------------|
| Course site (statikus oldal) | http://localhost:8020 | — |
| WebShop demo + lab | http://localhost:8010 | — |
| Postgres (Adminer UI) | http://localhost:8082 | server=`postgres`, user=`webshop`, password=`webshop`, db=`webshop` |
| MinIO console | http://localhost:9001 | `minioadmin` / `minioadmin` |
| Kafka UI | http://localhost:8083 | — |
| Spark Master UI | http://localhost:8090 | — |
| Spark Worker UI | http://localhost:8091 | — |
| Airflow | http://localhost:8088 | `admin` / `admin` |
| MLflow | http://localhost:5000 | — |
| dbt docs | http://localhost:8092 | — |
| FastAPI | http://localhost:8000/docs | — |
| Streamlit (RAG demo) | http://localhost:8501 | — |
| Prometheus | http://localhost:9090 | — |
| Grafana | http://localhost:3000 | `admin` / `admin` |
| Jupyter (Databricks-like) | http://localhost:8888 | — |
| Unity Catalog | http://localhost:8089 | — |

### Leállítás

```bash
# Megőrzi az adatokat (volumes)
docker compose down

# Volumes is törlődnek
docker compose down -v
```

## 4. Kurzusok navigálása

Lokálisan: nyisd meg a `http://localhost:8020/` címet (course-site container), vagy közvetlenül egy adott kurzust:

- http://localhost:8020/sql-data-modeling/
- http://localhost:8020/python-data-engineering/
- … (lásd `index.html` főoldal)

Online: https://dataengineer.hu

## 5. Hibaelhárítás

| Probléma | Megoldás |
|---------|----------|
| `port already allocated` | Másik szolgáltatás foglalja a portot. Állítsd át a `docker-compose.yml`-ben, vagy állítsd le a másikat. |
| `permission denied` Linux MinIO/Postgres volumes | `sudo chown -R $USER:$USER ./webshop-lab/postgres/init` |
| Spark lassú a Macen | Apple Silicon emulál x86 image-et — használj `apache/spark:3.5.3-...-java17-python3-ubuntu` (ez már arm64-natív) |
| `OOM` Docker | Növeld a Docker Desktop memóriáját (Settings → Resources → 8 GB+) |
| `pyspark` import hiba | Java 17 kell, nem 21. `JAVA_HOME` mutasson Java 17-re. |
| `feast` import hiba | Jelenleg Python 3.11 ajánlott; 3.12-vel build problémák lehetnek. |
| `chromadb` indul de "tenant not found" | `chroma 0.5+` óta kell a `tenant=`/`database=` argumentum, vagy `Settings(allow_reset=True)`. |

## 6. Verzió-mátrix

A repo-ban használt csomag- és image-verziók részletes listája: [`VERSIONS.md`](VERSIONS.md).

A kurzusok HTML-ének tetején lévő banner mutatja a legutóbbi szakmai felülvizsgálat dátumát.

## 7. Hozzájárulás / hibajelentés

GitHub issue: https://github.com/lugosidomotor/engineering_crash_courses/issues
