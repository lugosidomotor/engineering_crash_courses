# Engineering Crash Courses – fejlesztési tasklista és Codex prompt

## Cél

A `engineering_crash_courses` statikus GitHub Pages oldal átalakítása professzionálisabb, egységesebb és használhatóbb Data & AI Engineering kurzusplatformmá.

A munka két nagy részből áll:

1. A meglévő oldal javítása tartalmi, formai, UX és technikai szempontból.
2. Új kurzusok hozzáadása, köztük Databricks Lakehouse kurzussal.

---

# Codexnek bemásolható végrehajtási prompt

```text
A feladatod a engineering_crash_courses statikus GitHub Pages projekt fejlesztése az alábbi tasklista alapján.

Dolgozz logikai sorrendben, a task ID-k szerint.

Fontos szabályok:
- Ne töröld a meglévő kurzusokat.
- Ne vezesd be backend dependency-t.
- Maradjon statikus GitHub Pages kompatibilis.
- A meglévő linkek ne törjenek el.
- Ha lehet, központi course metadata fájlt használj, például courses.js vagy courses.json.
- Kerüld a duplikált kurzus-metaadatokat.
- Minden HTML fájlban legyen UTF-8 meta tag.
- A magyar szövegek legyenek ékezetesek, természetesek és szakmaiak.
- A kódban lévő kommentek angol nyelvűek legyenek.
- A design legyen modern, reszponzív, dark-theme kompatibilis, kártyás elrendezéssel.
- Marketing és SEO szempontból is tedd rendbe az oldalt.
- Legyen minden fontos oldalon megfelelő title, meta description, canonical URL, Open Graph és Twitter/X Card metadata.
- Legyen megosztási kép/social preview image az oldalhoz.
- Adj schema.org strukturált adatokat JSON-LD formában.
- Gondoskodj sitemap.xml és robots.txt fájlokról, ha még nincsenek.
- A végén nézd át a teljes magyar szöveget helyesírási, nyelvhelyességi és stilisztikai szempontból.
- Minden task elvégzése után jelöld a taskot késznek ebben a fájlban úgy, hogy a [ ] jelölést [x]-re cseréled.
- Ha egy taskot csak részben tudsz megcsinálni, hagyd [ ] állapotban, és írj alá egy rövid “Részleges / Megjegyzés” sort.
- A munka végén frissítsd az “Összesített státusz” szekciót.

Kiemelten ellenőrizd:
- minden kurzuskártya kattintható
- minden kurzusoldal elérhető
- nincs broken link
- nincs hibás encoding
- nincs 0 / 0 progress bug
- a főoldali section számok egyeznek a kurzusoldalakkal
- a kereső működik
- a szűrők működnek
- a progress localStorage-ben megmarad
- mobilnézetben is használható az oldal
- marketing szempontból egyértelmű az értékajánlat
- SEO szempontból rendben vannak a meta tagek, social preview elemek és strukturált adatok
- sitemap.xml és robots.txt rendben van
- a végső magyar szöveg helyesírása és nyelvhelyessége ellenőrizve van

Hajtsd végre az alábbi taskokat sorrendben.
```

---

# Összesített státusz

- Teljes taskok száma: 64
- Kész taskok száma: 0
- Részben kész taskok száma: 0
- Hátralévő taskok száma: 64

---

# 0. Előkészítés és állapotfelmérés

## TASK-0001 – Projektstruktúra feltérképezése

- [x] Nézd át a meglévő fájlstruktúrát.
- [x] Azonosítsd a főoldalt.
- [x] Azonosítsd a meglévő kurzusoldalakat.
- [x] Azonosítsa a közös CSS és JS fájlokat, ha vannak.

Elfogadási feltétel:
- Világos, mely fájlokat kell módosítani.
- Nem történik felesleges fájltörlés.

---

## TASK-0002 – Meglévő kurzusok listázása

- [x] Rögzítsd a meglévő kurzusokat:
  - Delta Table Crash Course
  - Apache Spark Crash Course
  - AI Data Engineer
  - AI Engineering
  - AIOps & MLOps
- [x] Ellenőrizd a hozzájuk tartozó slugokat és URL-eket.
- [x] Ellenőrizd, hány section van ténylegesen az egyes kurzusoldalakon.

Elfogadási feltétel:
- A későbbi metadata a valós kurzusstruktúrát tükrözi.

---

## TASK-0003 – Biztonságos módosítási alap létrehozása

- [x] Ne töröld a meglévő kurzusoldalakat.
- [x] Ne nevezd át a meglévő slugokat, ha az törné a linkeket.
- [x] Ha nagyobb refaktor történik, tartsd meg a backward compatible URL-eket.

Elfogadási feltétel:
- A meglévő kurzuslinkek továbbra is működnek.

---

# 1. Központi kurzus-metaadat rendszer

## TASK-0101 – Központi course metadata fájl létrehozása

- [x] Hozz létre központi `courses.js` vagy `courses.json` fájlt.
- [x] Ebben legyen minden kurzus fő adata.

Javasolt mezők:

```js
{
  slug: "delta-table-crash-course",
  title: "Delta Table Crash Course",
  description: "...",
  path: ["Data Engineering"],
  difficulty: "Kezdő",
  estimatedTime: "4–6 óra",
  sectionCount: 28,
  stack: ["Python", "Delta Lake", "Parquet"],
  status: "Kész",
  url: "./delta-table-crash-course/"
}
```

Elfogadási feltétel:
- A főoldali kurzuskártyák lehetőleg ebből az adatforrásból generálhatók.

---

## TASK-0102 – Meglévő kurzusok metadata kitöltése

- [x] Add hozzá a meglévő 5 kurzust a központi metadata fájlhoz.
- [x] A section számokat igazítsd a tényleges kurzusoldalakhoz.
- [x] A stack tageket egységesítsd.

Elfogadási feltétel:
- A főoldal és a kurzusoldalak section számai nem mondanak ellent egymásnak.

---

## TASK-0103 – Új kurzusok metadata kitöltése

- [x] Add hozzá az új kurzusokat is a metadata fájlhoz:
  - SQL & Data Modeling Crash Course
  - Python for Data Engineering
  - Docker & Local Data Platform Crash Course
  - Airflow & Orchestration Crash Course
  - dbt Analytics Engineering Crash Course
  - Databricks Lakehouse Crash Course
  - LLMOps / GenAI Production Crash Course

Elfogadási feltétel:
- Az új kurzusok megjeleníthetők kurzuskártyaként a főoldalon.

---

# 2. Encoding, nyelv és alap HTML javítások

## TASK-0201 – UTF-8 meta tag ellenőrzése

- [x] Minden HTML fájlban legyen:

```html
<meta charset="UTF-8">
```

- [x] Lehetőleg minden HTML fájlban legyen:

```html
<html lang="hu">
```

Elfogadási feltétel:
- Nem marad karakterkódolási hiba a magyar szövegekben.

---

## TASK-0202 – Hibás ékezetek javítása

- [ ] Javítsd az ismert hibákat:
  - `lépésról` → `lépésről`
  - `můködő` → `működő`
  - `sůrített` → `sűrített`
  - `tanulastol` → `tanulástól`
  - `predikcio` → `predikció`
  - `vegig` → `végig`
  - `elettartam-cikluson` → `élettartam-cikluson`
- [ ] Keress további hasonló hibákat is.

Elfogadási feltétel:
- A magyar szöveg ékezetes, természetes és szakmai.

---

## TASK-0203 – Kommentnyelv egységesítése

- [ ] A kódban lévő kommentek legyenek angol nyelvűek.
- [ ] A felhasználónak szóló UI szövegek maradjanak magyarul.

Elfogadási feltétel:
- A kód kommentjei angolok, a kurzustartalom magyar.

---

# 3. Progress és section count hibák javítása

## TASK-0301 – 0 / 0 progress bug javítása

- [ ] Javítsd azokat az oldalakat, ahol `0 / 0 section completed` jelenik meg, de valójában vannak sectionök.
- [ ] A progress számítás mindig a tényleges sectionökből dolgozzon.

Elfogadási feltétel:
- Egyetlen kurzusoldalon sem jelenik meg hibás `0 / 0` progress, ha vannak sectionök.

---

## TASK-0302 – Section count egységesítése

- [ ] A főoldali section szám egyezzen a kurzusoldali section számmal.
- [ ] Lehetőleg a központi metadata legyen az igazság forrása.

Elfogadási feltétel:
- Nincs eltérés a kártyákon és kurzusoldalakon látható section számok között.

---

## TASK-0303 – localStorage alapú progress mentés

- [ ] Minden kurzus sectionje kapjon stabil ID-t.
- [ ] A completed section ID-k kerüljenek localStorage-be.
- [ ] Oldalfrissítés után a progress maradjon meg.

Javasolt kulcsforma:

```js
course:{slug}:completed
```

Elfogadási feltétel:
- A tanuló progress állapota újratöltés után is megmarad.

---

## TASK-0304 – Progress UI javítása

- [ ] A kurzusoldalon látszódjon:
  - completed section count
  - total section count
  - százalékos progress
- [ ] A completed sectionök vizuálisan is különüljenek el.

Elfogadási feltétel:
- A progress állapot érthető és vizuálisan követhető.

---

# 4. Főoldal újrastrukturálása

## TASK-0401 – Hero szekció átalakítása

- [ ] A főoldali hero üzenet legyen konkrétabb és erősebb.

Javasolt cím:

```text
Projektalapú Data & AI Engineering crash course-ok
```

Javasolt alcím:

```text
Építs végig egy modern adat- és AI-platformot lokálisan: Delta Lake, Spark, feature store, RAG chatbot, MLflow, Docker, Kubernetes és monitoring — egy közös webshop esettanulmányon keresztül.
```

- [ ] Legyen két CTA gomb:
  - Data Engineering útvonal indítása
  - AI Engineering útvonal indítása

Elfogadási feltétel:
- A főoldal első képernyője egyértelműen kommunikálja az oldal értékajánlatát.

---

## TASK-0402 – Főoldali információs hierarchia kialakítása

- [ ] A főoldal javasolt sorrendje:
  1. Hero szekció
  2. Kinek szól
  3. Tanulási útvonalak
  4. Kurzuskártyák
  5. Mit építesz végig?
  6. Technológiai stack
  7. Előfeltételek
  8. Roadmap / következő lépések

Elfogadási feltétel:
- A főoldal landing page-ként is jól működik.

---

## TASK-0403 – Kinek szól szekció hozzáadása

- [ ] Adj hozzá rövid szekciót arról, kiknek való az oldal:
  - junior / medior data engineer
  - analytics engineer
  - backend fejlesztő data irányba
  - AI engineer
  - MLOps iránt érdeklődő fejlesztő

Elfogadási feltétel:
- A látogató gyorsan eldöntheti, releváns-e számára az oldal.

---

# 5. Tanulási útvonalak kialakítása

## TASK-0501 – Foundation Path létrehozása

- [ ] Jelenítsd meg a Foundation útvonalat a főoldalon.

Sorrend:
1. SQL & Data Modeling
2. Python for Data Engineering
3. Docker & Local Data Platform

Elfogadási feltétel:
- A kezdőknek egyértelmű belépési pontjuk van.

---

## TASK-0502 – Data Engineering Path frissítése

- [ ] Jelenítsd meg a Data Engineering útvonalat.

Sorrend:
1. SQL & Data Modeling
2. Python for Data Engineering
3. Delta Table Crash Course
4. Apache Spark Crash Course
5. Airflow & Orchestration
6. dbt Analytics Engineering
7. Databricks Lakehouse
8. AI Data Engineer

Elfogadási feltétel:
- A Data Engineering útvonal logikus alapoktól production-közeli témákig vezet.

---

## TASK-0503 – AI Engineering Path frissítése

- [ ] Jelenítsd meg az AI Engineering útvonalat.

Sorrend:
1. Python for Data Engineering
2. Docker & Local Data Platform
3. AI Engineering
4. LLMOps / GenAI Production
5. Databricks Lakehouse
6. AIOps & MLOps

Elfogadási feltétel:
- Az AI Engineering útvonal világosan épül az appfejlesztéstől az üzemeltetésig.

---

## TASK-0504 – Útvonalmagyarázatok hozzáadása

- [ ] Minden útvonalnál legyen:
  - kinek ajánlott
  - előfeltételek
  - végeredmény
  - releváns szerepkörök

Elfogadási feltétel:
- A tanuló érti, melyik útvonalat érdemes választania.

---

# 6. Kurzuskártyák egységesítése

## TASK-0601 – Egységes course card komponens / sablon

- [ ] Minden kurzuskártya ugyanazt a struktúrát kövesse:
  - course number vagy útvonalbeli sorszám
  - kurzuscím
  - rövid leírás
  - mit építesz
  - kimenet / output
  - stack tagek
  - szint
  - becsült idő
  - section szám
  - útvonal
  - Kurzus megnyitása gomb

Elfogadási feltétel:
- A főoldal kurzuskártyái konzisztensnek és professzionálisnak hatnak.

---

## TASK-0602 – Stack tag chipek kialakítása

- [ ] A technológiák jelenjenek meg chipként.
- [ ] Példák:
  - Python
  - pandas
  - Delta Lake
  - Spark
  - MLflow
  - Databricks
  - Airflow
  - dbt
  - Docker
  - Kubernetes
  - RAG

Elfogadási feltétel:
- A látogató gyorsan átlátja, melyik kurzus milyen stackkel dolgozik.

---

## TASK-0603 – Difficulty és path badge-ek

- [ ] Minden kártyán legyen difficulty badge:
  - Kezdő
  - Kezdő–Középhaladó
  - Középhaladó
  - Középhaladó–Haladó
  - Haladó
- [ ] Minden kártyán legyen path badge:
  - Foundation
  - Data Engineering
  - AI Engineering
  - Analytics Engineering
  - AI Data Engineering

Elfogadási feltétel:
- A kurzusok könnyen összehasonlíthatók.

---

# 7. Kereső és szűrők

## TASK-0701 – Kurzuskártya kereső hozzáadása

- [ ] Adj keresőt a főoldali kurzuslistához.
- [ ] Kereshető mezők:
  - cím
  - leírás
  - stack tagek
  - útvonal

Elfogadási feltétel:
- A kereső valós időben vagy gombnyomásra szűri a kurzuskártyákat.

---

## TASK-0702 – Szűrők hozzáadása

- [ ] Adj hozzá szűrőket:
  - Foundation
  - Data Engineering
  - AI Engineering
  - Kezdő
  - Középhaladó
  - Haladó
  - Kész
  - Tervezett

Elfogadási feltétel:
- A felhasználó gyorsan tud kurzust választani érdeklődés és szint szerint.

---

## TASK-0703 – Empty state kezelése

- [ ] Ha nincs találat, jelenjen meg barátságos üzenet.
- [ ] Legyen “Szűrők törlése” lehetőség.

Elfogadási feltétel:
- A keresés/szűrés nem hagyja bizonytalan állapotban a felhasználót.

---

# 8. Közös WebShop Pro esettanulmány

## TASK-0801 – WebShop Pro Platform szekció létrehozása

- [ ] A főoldalon legyen külön szekció a közös esettanulmányról.

Javasolt név:

```text
WebShop Pro Platform
```

Elfogadási feltétel:
- Egyértelmű, hogy a kurzusok nem elszigetelt tutorialok, hanem egy közös projekt köré épülnek.

---

## TASK-0802 – Kurzusok kapcsolódása az esettanulmányhoz

- [ ] Mutasd be, melyik kurzus mit épít a WebShop Pro Platformon belül.

Kapcsolódások:
- Delta Table: Bronze/Silver/Gold lakehouse rétegek
- Apache Spark: nagyobb volumenű ETL, joinok, aggregációk, streaming
- AI Data Engineer: feature store, data quality, lineage, online/offline feature-ek
- AI Engineering: RAG ügyfélszolgálati chatbot
- AIOps & MLOps: churn modell deployment, monitoring, drift detection, rollback
- Databricks Lakehouse: managed lakehouse workflow Databricks környezetben
- Airflow: ütemezett pipeline-ok
- dbt: analytics layer és marts
- Docker Local Platform: lokális fejlesztői stack
- SQL/Python: alap adatmodell és ETL logika

Elfogadási feltétel:
- A látogató érti a teljes tanulási narratívát.

---

# 9. Új kurzusoldalak létrehozása

## TASK-0901 – SQL & Data Modeling kurzusoldal

- [ ] Hozz létre új kurzusoldalt.

Slug:

```text
sql-data-modeling
```

Szint:
- Kezdő

Útvonal:
- Foundation
- Data Engineering

Rövid leírás:
- SQL és analitikai adatmodellezési alapok data engineering és analytics engineering munkához.

Mit épít a tanuló:
- Webshop analitikai adatmodell customers, orders, products, subscriptions, payments és events táblákkal.

Témák:
- SELECT, WHERE, JOIN, GROUP BY
- CTE-k
- window functions
- fact és dimension táblák
- star schema
- slowly changing dimensions
- analitikai query optimalizálás
- adatminőségi ellenőrzések SQL-ben

Elfogadási feltétel:
- Az oldal elérhető, linkelhető, és szerepel a főoldalon.

---

## TASK-0902 – Python for Data Engineering kurzusoldal

- [ ] Hozz létre új kurzusoldalt.

Slug:

```text
python-data-engineering
```

Szint:
- Kezdő

Útvonal:
- Foundation
- Data Engineering
- AI Engineering

Rövid leírás:
- Gyakorlati Python alapok adatfeldolgozási, ETL és pipeline-fejlesztési feladatokhoz.

Mit épít a tanuló:
- Lokális Python ETL mini-framework konfigurációval, logginggal, validációval és tesztekkel.

Témák:
- virtual environment, pip/uv
- pathlib, json, csv, parquet
- pandas alapok
- logging
- typing
- pydantic validáció
- config kezelés
- CLI script írás
- unit test alapok

Elfogadási feltétel:
- Az oldal elérhető, linkelhető, és szerepel a főoldalon.

---

## TASK-0903 – Docker & Local Data Platform kurzusoldal

- [ ] Hozz létre új kurzusoldalt.

Slug:

```text
docker-local-data-platform
```

Szint:
- Kezdő–Középhaladó

Útvonal:
- Foundation
- Data Engineering
- AI Engineering

Rövid leírás:
- Lokális data platform építése Docker Compose segítségével.

Mit épít a tanuló:
- Lokális data stack Postgres, MinIO, Spark, Airflow, MLflow, Prometheus és Grafana komponensekkel.

Témák:
- Docker alapok
- Dockerfile
- docker-compose
- volume-ok és networkök
- environment variable kezelés
- Postgres konténer
- MinIO objektumtár
- Spark lokális környezet
- Airflow lokális indítása
- MLflow tracking server
- Prometheus és Grafana alap monitoring

Elfogadási feltétel:
- Az oldal elérhető, linkelhető, és szerepel a főoldalon.

---

## TASK-0904 – Airflow & Orchestration kurzusoldal

- [ ] Hozz létre új kurzusoldalt.

Slug:

```text
airflow-orchestration
```

Szint:
- Középhaladó

Útvonal:
- Data Engineering

Rövid leírás:
- Adatpipeline-ok ütemezése, monitorozása és hibakezelése Apache Airflow-val.

Mit épít a tanuló:
- Napi webshop ETL DAG, amely bronze, silver és gold rétegeket frissít.

Témák:
- DAG
- task
- operator
- sensor
- schedule
- retry
- backfill
- XCom
- variables
- connections
- data-aware scheduling
- notification hiba esetén

Elfogadási feltétel:
- Az oldal elérhető, linkelhető, és szerepel a főoldalon.

---

## TASK-0905 – dbt Analytics Engineering kurzusoldal

- [ ] Hozz létre új kurzusoldalt.

Slug:

```text
dbt-analytics-engineering
```

Szint:
- Középhaladó

Útvonal:
- Data Engineering
- Analytics Engineering

Rövid leírás:
- Analitikai modellezés, tesztelés, dokumentáció és lineage dbt-vel.

Mit épít a tanuló:
- Webshop analytics layer staging, intermediate és mart modellekkel.

Témák:
- dbt project structure
- sources
- staging models
- intermediate models
- marts
- fact_orders
- dim_customer
- dim_product
- schema tests
- custom tests
- documentation
- lineage graph
- incremental models

Elfogadási feltétel:
- Az oldal elérhető, linkelhető, és szerepel a főoldalon.

---

## TASK-0906 – Databricks Lakehouse kurzusoldal

- [ ] Hozz létre új kurzusoldalt.

Slug:

```text
databricks-lakehouse
```

Szint:
- Középhaladó

Útvonal:
- Data Engineering
- AI Data Engineering
- AI Engineering

Rövid leírás:
- Modern lakehouse fejlesztés Databricks környezetben Delta Lake, notebooks, jobs, Unity Catalog és workflow-k használatával.

Mit épít a tanuló:
- Databricks-alapú lakehouse pipeline webshop adatokra, bronze/silver/gold rétegekkel, ütemezett jobbal és alap monitoringgal.

Témák:
- Databricks workspace áttekintés
- cluster és compute alapok
- notebook workflow
- DBFS és cloud storage koncepció
- Delta Lake Databricksben
- bronze/silver/gold architektúra
- Auto Loader alapok
- Databricks Jobs
- Workflows
- Unity Catalog alapok
- secrets kezelése
- SQL Warehouse alapok
- Delta Live Tables bevezető
- MLflow Databricksben
- költség- és clusterhasználati alapelvek

Fontos:
- Ez ne általános marketing szöveg legyen.
- Illeszkedjen a Delta Lake, Spark, AI Data Engineer és MLOps kurzusok közé.
- Mutassa meg a kapcsolatot:
  - Delta Lake
  - Spark
  - Databricks Jobs
  - Unity Catalog
  - MLflow
  - Workflows
  - Lakehouse architektúra
  - AI/Data Engineering production workflow

Elfogadási feltétel:
- A Databricks kurzus valódi technikai hidat képez a meglévő kurzusok között.

---

## TASK-0907 – LLMOps / GenAI Production kurzusoldal

- [ ] Hozz létre új kurzusoldalt.

Slug:

```text
llmops-genai-production
```

Szint:
- Középhaladó–Haladó

Útvonal:
- AI Engineering

Rövid leírás:
- Production GenAI és RAG alkalmazások üzemeltetése, tesztelése és monitorozása.

Mit épít a tanuló:
- Production-ready RAG/LLM alkalmazás monitoringgal, eval datasetekkel, prompt verziózással és fallback logikával.

Témák:
- prompt versioning
- eval dataset
- RAG evaluation
- hallucination tesztek
- latency monitoring
- cost tracking
- tokenhasználat mérés
- guardrails
- fallback model
- human feedback
- regression testing
- red teaming alapok

Elfogadási feltétel:
- Az oldal elérhető, linkelhető, és szerepel a főoldalon.

---

# 10. Kurzusoldal-sablon egységesítése

## TASK-1001 – Egységes kurzusoldal header

- [ ] Minden kurzusoldalon legyen:
  - kurzuscím
  - rövid leírás
  - szint
  - becsült idő
  - section szám
  - stack
  - tanulási útvonal
  - progress kijelzés

Elfogadási feltétel:
- Minden kurzusoldal azonos logikával indul.

---

## TASK-1002 – Kurzusoldal bevezető blokkok

- [ ] Minden kurzusoldalon legyen:
  - kinek szól
  - előfeltételek
  - mit építesz a végére
  - használt stack
  - tanulási célok

Elfogadási feltétel:
- A tanuló az oldal elején megérti, mire számíthat.

---

## TASK-1003 – Section szerkezet egységesítése

- [ ] Minden új kurzus legalább 10–15 sectiont tartalmazzon.
- [ ] Minden sectionben legyen:
  - cél
  - rövid elméleti magyarázat
  - gyakorlati feladatötlet
  - production note

Javasolt bővebb section-struktúra:

```text
Section XX — Cím

Miért fontos?
Mentális modell
Kód / példa
Expected output
Próbáld ki
Gyakori hiba
Production note
```

Elfogadási feltétel:
- Az új kurzusoldalak nem üres placeholder oldalak, hanem használható tartalomvázak.

---

## TASK-1004 – Sticky table of contents

- [ ] A kurzusoldalakon legyen sticky table of contents.
- [ ] Mutassa:
  - section címeket
  - completed állapotot
  - aktuális sectiont
  - progress százalékot

Elfogadási feltétel:
- Hosszú kurzusoldalakon könnyű navigálni.

---

# 11. Meglévő kurzusok konkrét javításai

## TASK-1101 – Delta Table Crash Course javítása

- [ ] Javítsd a section count eltérést.
- [ ] Ellenőrizd a bootstrap cellák változóit.
- [ ] Erősítsd a Bronze/Silver/Gold narratívát.
- [ ] Adj mini challenge-et minden nagyobb témablokk végére.
- [ ] Adj capstone checklistet a végére.

Elfogadási feltétel:
- A Delta kurzus továbbra is a legerősebb alapkurzus, de konzisztens progresszel és section counttal.

---

## TASK-1102 – AI Engineering kurzus javítása

- [ ] Javítsd a `0 / 0 section completed` bugot.
- [ ] Javítsd az encoding hibákat.
- [ ] Adj külön “Biztonságos OpenAI API konfiguráció” blokkot.
- [ ] Adj RAG eval tesztkérdés-készletet.
- [ ] Emeld ki külön:
  - hallucination
  - citation
  - fallback
  - guardrail

Elfogadási feltétel:
- Az AI Engineering kurzus production-közelibb és megbízhatóbb.

---

## TASK-1103 – AIOps & MLOps kurzus javítása

- [ ] Javítsd az ékezetes magyar szöveget.
- [ ] Javítsd a `0 / 0 section completed` bugot.
- [ ] Adj GitHub Actions CI/CD pipeline példát.
- [ ] Legyen model registry flow:

```text
dev → staging → production
```

- [ ] Adj rollback és canary deployment magyarázó ábrahelyet.

Elfogadási feltétel:
- Az MLOps kurzus jobban mutatja a production lifecycle-t.

---

## TASK-1104 – AI Data Engineer kurzus javítása

- [ ] Javítsd a hibás Python példákat.
- [ ] Feast példák legyenek teljesebbek.
- [ ] Legyen online/offline feature store ábrahely.
- [ ] Data quality validáció legyen konkrétabb.
- [ ] Lineage/catalog részhez adj dbt docs vagy OpenLineage jellegű példát.

Konkrét hibás példa:

```python
df = pd.DataFrame({"age":[25,35,45],"income":[50k,75k,90k],"purchases":[5,12,3]})
df["is_active"] = (df.last_days < 30).astype(int)
```

Javított verzió:

```python
df = pd.DataFrame({
    "age": [25, 35, 45],
    "income": [50_000, 75_000, 90_000],
    "purchases": [5, 12, 3],
    "last_days": [12, 24, 87],
})

df["income_per_purchase"] = df["income"] / df["purchases"]
df["is_active"] = (df["last_days"] < 30).astype(int)
```

Elfogadási feltétel:
- Az AI Data Engineer példák szintaktikailag helyesek és oktatási szempontból hasznosak.

---

## TASK-1105 – Apache Spark kurzus javítása

- [ ] Javítsd a hibásan renderelt kódcellákat.
- [ ] Ne renderelődjön tuple/string formában a kód.
- [ ] Legyen jó indentáció.
- [ ] A kódblokkok nyelve legyen helyesen megadva.
- [ ] RDD rész legyen rövidebb.
- [ ] DataFrame és Spark SQL fókusz legyen erősebb.
- [ ] Adj performance tuning modult:
  - partitioning
  - shuffle
  - cache
  - broadcast join
- [ ] Adj Spark UI magyarázatot vagy ábrahelyet.
- [ ] Opcionális haladó feladatként legyen docker-compose alapú lokális Spark cluster.

Elfogadási feltétel:
- A Spark kurzus kódjai és szerkezete megbízhatóbbak.

---

# 12. Kódcellák és output blokkok javítása

## TASK-1201 – Code block fejléc és copy button

- [ ] A kódrészletek kapjanak fejlécet:
  - language label
  - copy button

Példa:

```text
Python cell
[Copy]
```

Elfogadási feltétel:
- A kódrészletek könnyen másolhatók.

---

## TASK-1202 – Output blokkok elkülönítése

- [ ] Az output külön blokkban jelenjen meg.

Példa:

```text
Output
✓ Delta table létrehozva
```

Elfogadási feltétel:
- A tanuló érti, mi a kód és mi az elvárt kimenet.

---

## TASK-1203 – Mobilbarát kódmegjelenítés

- [ ] A kódcellák ne törjenek el mobilnézetben.
- [ ] Hosszú soroknál legyen horizontal scroll.

Elfogadási feltétel:
- Mobilon sem esik szét a kurzusoldal.

---

# 13. Vizuális design javítása

## TASK-1301 – Modern dark theme kompatibilis design

- [ ] A design legyen modern, technológiai kurzusplatformhoz illő.
- [ ] Javasolt irány:
  - sötét navy / graphite háttér
  - kártyás elrendezés
  - enyhén áttetsző dark cardok
  - cyan / violet / emerald accent színek
  - Inter vagy Manrope betűtípus
  - JetBrains Mono kódhoz
  - 16–24px padding
  - 16px border radius
  - finom shadow

Elfogadási feltétel:
- Az oldal vizuálisan modernebb és professzionálisabb.

---

## TASK-1302 – Reszponzív layout

- [ ] A főoldali course grid működjön:
  - desktopon több oszlopban
  - tableten 2 oszlopban
  - mobilon 1 oszlopban
- [ ] A kurzusoldali TOC mobilon ne takarja ki a tartalmat.

Elfogadási feltétel:
- Az oldal mobilon, tableten és desktopon is használható.

---

## TASK-1303 – Vizuális hierarchia finomítása

- [ ] Erősítsd:
  - headline méreteket
  - alcímeket
  - szekcióközöket
  - kártyán belüli spacinget
  - CTA gombok kontrasztját

Elfogadási feltétel:
- Az oldal könnyebben szkennelhető.

---

# 14. Hiányzó platformelemek hozzáadása

## TASK-1401 – Becsült idő kurzusonként

- [ ] Minden kurzus kapjon becsült időt.
- [ ] Ez jelenjen meg a kártyán és a kurzusoldalon.

Elfogadási feltétel:
- A tanuló tudja, mekkora befektetés egy kurzus.

---

## TASK-1402 – Mit fogsz tudni a végén blokk

- [ ] Minden kurzusoldalon legyen “Mit fogsz tudni a végén?” lista.

Elfogadási feltétel:
- A tanulási eredmények egyértelműek.

---

## TASK-1403 – Dataset / GitHub / Colab / Codespaces placeholder

- [ ] Adj előkészített helyet ezeknek:
  - letölthető dataset link
  - GitHub repo link
  - Open in Colab gomb
  - Open in Codespaces gomb

Elfogadási feltétel:
- Később könnyen hozzáadhatók a valódi linkek.

---

## TASK-1404 – Troubleshooting szekció

- [ ] Adj legalább egy közös vagy kurzusonkénti troubleshooting szekciót.
- [ ] Példák:
  - Python verzió gond
  - dependency telepítési hiba
  - Docker nem indul
  - Spark memory error
  - API key nincs beállítva

Elfogadási feltétel:
- A kezdők kevesebbszer akadnak el véglegesen.

---

## TASK-1405 – Glossary szekció vagy oldal

- [ ] Adj magyar–angol data/AI engineering fogalomtárat vagy placeholdert.

Példák:
- lakehouse
- feature store
- lineage
- orchestration
- embedding
- vector search
- model registry
- drift detection

Elfogadási feltétel:
- A szakmai fogalmak könnyebben tanulhatók.

---

## TASK-1406 – Version matrix

- [ ] Adj verziómátrixot vagy placeholdert:
  - Python
  - Spark
  - MLflow
  - dbt
  - Feast
  - Delta Lake
  - Databricks Runtime

Elfogadási feltétel:
- A tanuló tudja, milyen verziókkal érdemes dolgozni.

---

## TASK-1407 – Quiz / checkpoint blokkok

- [ ] Minden nagyobb modul végére adj quiz vagy checkpoint blokkot.
- [ ] Legalább placeholder szinten jelenjen meg.

Elfogadási feltétel:
- A kurzusok interaktívabbá válnak.

---

# 14B. Marketing, SEO és megoszthatóság

## TASK-1451 – Marketing pozicionálás és értékajánlat finomítása

- [ ] Nézd át a főoldali szövegeket marketing szempontból.
- [ ] Legyen egyértelmű, hogy az oldal kinek szól.
- [ ] Legyen egyértelmű, milyen problémát old meg.
- [ ] Legyen egyértelmű, mit kap a tanuló a kurzusok végére.
- [ ] A hero, CTA-k és kurzusleírások legyenek konkrétak, nem általánosak.

Javasolt fő üzenet:
- Projektalapú Data & AI Engineering kurzusok magyarul.
- Lokálisan futtatható, gyakorlatias, end-to-end tanulási útvonal.
- Delta Lake, Spark, Databricks, Airflow, dbt, RAG, MLflow és MLOps egy közös webshop esettanulmányon keresztül.

Elfogadási feltétel:
- A látogató 5–10 másodperc alatt megérti, miért hasznos az oldal.

---

## TASK-1452 – SEO title és meta description minden fontos oldalra

- [ ] Adj egyedi `<title>` értéket a főoldalhoz.
- [ ] Adj egyedi `<title>` értéket minden kurzusoldalhoz.
- [ ] Adj egyedi meta descriptiont a főoldalhoz.
- [ ] Adj egyedi meta descriptiont minden kurzusoldalhoz.
- [ ] A title legyen kb. 50–60 karakter körüli, ahol lehetséges.
- [ ] A meta description legyen kb. 140–160 karakter körüli, ahol lehetséges.

Javasolt főoldali title:
```text
Data & AI Engineering Crash Course-ok magyarul
```

Javasolt főoldali meta description:
```text
Projektalapú Data & AI Engineering kurzusok magyarul: Delta Lake, Spark, Databricks, Airflow, dbt, RAG, MLflow és MLOps gyakorlati példákkal.
```

Elfogadási feltétel:
- Minden fontos oldalnak van egyedi, keresőbarát title és description metaadata.

---

## TASK-1453 – Open Graph és Twitter/X Card metadata

- [ ] Adj Open Graph meta tageket a főoldalhoz.
- [ ] Adj Open Graph meta tageket minden kurzusoldalhoz.
- [ ] Adj Twitter/X Card meta tageket a főoldalhoz.
- [ ] Adj Twitter/X Card meta tageket minden kurzusoldalhoz.

Javasolt tagek:
```html
<meta property="og:type" content="website">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="...">
<meta property="og:image" content="...">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

Elfogadási feltétel:
- Ha az oldalt megosztják LinkedInen, Facebookon, Slackben vagy X-en, korrekt cím, leírás és kép jelenik meg.

---

## TASK-1454 – Megosztási kép / social preview image létrehozása

- [ ] Hozz létre legalább egy social sharing képet.
- [ ] Javasolt méret: 1200×630 px.
- [ ] Legyen rajta:
  - oldal neve
  - rövid értékajánlat
  - Data & AI Engineering vizuális hangulat
  - fő technológiák, például Delta Lake, Spark, Databricks, MLflow, RAG
- [ ] Helyezd el például:
  - `assets/social-preview.png`
  - vagy `assets/og-image.png`
- [ ] Kösd be az Open Graph és Twitter/X Card meta tagekbe.

Elfogadási feltétel:
- A főoldalnak és lehetőség szerint a kurzusoldalaknak van működő social preview képe.

---

## TASK-1455 – schema.org strukturált adatok JSON-LD formában

- [ ] Adj JSON-LD strukturált adatot a főoldalhoz.
- [ ] Adj JSON-LD strukturált adatot a kurzusoldalakhoz.
- [ ] Használj releváns schema.org típusokat.

Javasolt típusok:
- `WebSite`
- `Organization` vagy `Person`, ha releváns
- `ItemList` a kurzuslistához
- `Course` az egyes kurzusoldalakhoz
- `BreadcrumbList` a kurzusoldalakhoz

Példa Course schema irány:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Databricks Lakehouse Crash Course",
  "description": "Modern lakehouse fejlesztés Databricks környezetben Delta Lake, Jobs, Unity Catalog és MLflow használatával.",
  "inLanguage": "hu",
  "provider": {
    "@type": "Organization",
    "name": "Engineering Crash Courses"
  }
}
</script>
```

Elfogadási feltétel:
- A strukturált adatok valid JSON-LD formátumúak, és nem törik el az oldalt.

---

## TASK-1456 – Canonical URL-ek, sitemap.xml és robots.txt

- [ ] Adj canonical URL-t a főoldalhoz.
- [ ] Adj canonical URL-t minden kurzusoldalhoz.
- [ ] Hozz létre vagy frissíts `sitemap.xml` fájlt.
- [ ] Hozz létre vagy frissíts `robots.txt` fájlt.
- [ ] A sitemap tartalmazza:
  - főoldal
  - minden meglévő kurzusoldal
  - minden új kurzusoldal
  - opcionális glossary / troubleshooting / roadmap oldalak, ha létrejönnek

Elfogadási feltétel:
- A keresőmotorok könnyen feltérképezhetik az oldalt.

---

## TASK-1457 – Tartalmi SEO és heading struktúra

- [ ] Ellenőrizd, hogy minden oldalon pontosan egy fő H1 legyen.
- [ ] A H2/H3 headingek logikus hierarchiát kövessenek.
- [ ] A kurzusoldalak címei és alcímei tartalmazzanak releváns kulcsszavakat természetes formában.
- [ ] Kerüld a kulcsszóhalmozást.
- [ ] Adj belső linkeket a kapcsolódó kurzusok között.
- [ ] A tanulási útvonalak linkeljenek a megfelelő kurzusokra.

Javasolt természetes kulcsszavak:
- data engineering kurzus
- AI engineering kurzus
- Databricks kurzus
- Delta Lake kurzus
- Apache Spark kurzus
- MLOps kurzus
- RAG alkalmazásfejlesztés
- magyar data engineering tananyag

Elfogadási feltétel:
- Az oldalak SEO-barátak, de nem hatnak kulcsszóval túltömöttnek.

---

## TASK-1458 – Technikai SEO és teljesítmény alapellenőrzés

- [ ] Ellenőrizd az alapvető HTML validitást.
- [ ] Legyen reszponzív viewport meta tag.
- [ ] Optimalizáld a social preview képet ésszerű fájlméretre.
- [ ] Adj `alt` szöveget a fontos képekhez.
- [ ] Kerüld a feleslegesen nagy CSS/JS fájlokat.
- [ ] Ne legyenek console errorok normál oldalbetöltéskor.
- [ ] A kártyák és CTA-k legyenek billentyűzettel is használhatók.

Elfogadási feltétel:
- Az oldal technikailag tisztább, gyorsabb és akadálymentesebb.

---

## TASK-1459 – Analytics és privacy-barát mérés előkészítése

- [ ] Készíts elő helyet privacy-barát analytics integrációhoz, ha később szükséges.
- [ ] Ne adj hozzá agresszív trackinget.
- [ ] Ha bekerül analytics placeholder, legyen egyértelműen elkülönítve és könnyen eltávolítható.
- [ ] Dokumentáld röviden, hova lehet később Plausible, Umami vagy más privacy-barát mérést bekötni.

Elfogadási feltétel:
- A projekt később mérhetővé tehető anélkül, hogy most felesleges tracking kerülne bele.

---

## TASK-1460 – Végső helyesírási, nyelvhelyességi és stilisztikai ellenőrzés

- [ ] A teljes főoldali magyar szöveget nézd át helyesírási szempontból.
- [ ] Minden kurzusoldal magyar szövegét nézd át helyesírási szempontból.
- [ ] Javítsd az elütéseket.
- [ ] Javítsd a rossz ékezeteket.
- [ ] Javítsd a természetellenes vagy gépies megfogalmazásokat.
- [ ] Egységesítsd a terminológiát.

Terminológiai irány:
- “kurzus” legyen következetes, ne váltakozzon indokolatlanul “course” és “kurzus” között.
- “section” maradhat technikai kurzuselemként, de lehetőleg legyen következetes.
- “tanulási útvonal” legyen egységes.
- “Data Engineering”, “AI Engineering”, “MLOps”, “Databricks”, “Delta Lake” maradhat angol szakmai kifejezésként.

Elfogadási feltétel:
- A végső oldal magyarul természetes, helyes és professzionális hatású.


---

# 15. Minőségellenőrzés

## TASK-1501 – Linkellenőrzés

- [ ] Ellenőrizd, hogy minden kurzuskártya kattintható.
- [ ] Ellenőrizd, hogy minden kurzusoldal elérhető.
- [ ] Ellenőrizd, hogy nincs broken internal link.
- [ ] Ellenőrizd, hogy a sitemap.xml-ben szereplő URL-ek tényleg léteznek.

Elfogadási feltétel:
- Nincs hibás belső navigáció.

---

## TASK-1502 – Progress és localStorage teszt

- [ ] Jelölj completednek több sectiont.
- [ ] Töltsd újra az oldalt.
- [ ] Ellenőrizd, hogy a progress megmarad.

Elfogadási feltétel:
- A progress persistence működik.

---

## TASK-1503 – Search és filter teszt

- [ ] Teszteld a keresőt címre.
- [ ] Teszteld a keresőt stack tagre.
- [ ] Teszteld a szűrőket útvonalra.
- [ ] Teszteld a szűrőket difficulty alapján.
- [ ] Teszteld az empty state-et.

Elfogadási feltétel:
- A kurzuskeresés megbízhatóan működik.

---

## TASK-1504 – Mobilnézet teszt

- [ ] Ellenőrizd a főoldalt mobilnézetben.
- [ ] Ellenőrizd a kurzusoldalakat mobilnézetben.
- [ ] Ellenőrizd a kódblokkok horizontal scrollját.
- [ ] Ellenőrizd, hogy a sticky TOC nem rontja a használhatóságot.

Elfogadási feltétel:
- Az oldal mobilon is használható marad.

---

## TASK-1505 – Encoding, SEO metadata és nyelvi végellenőrzés

- [ ] Ellenőrizd, hogy minden HTML UTF-8.
- [ ] Ellenőrizd az ékezeteket.
- [ ] Ellenőrizd, hogy a magyar szöveg természetes.
- [ ] Ellenőrizd, hogy a kódbeli kommentek angolul vannak.
- [ ] Ellenőrizd, hogy minden fontos oldalnak van title és meta description értéke.
- [ ] Ellenőrizd, hogy az Open Graph és Twitter/X Card tagek nem üresek.
- [ ] Ellenőrizd, hogy a JSON-LD strukturált adatok valid JSON szintaxisúak.
- [ ] Ellenőrizd, hogy a social preview image hivatkozása működik.

Elfogadási feltétel:
- Nem marad feltűnő karakterhiba, kevert kommentnyelv vagy hiányos SEO metadata.

---

# 16. Záró dokumentáció

## TASK-1601 – Változások összefoglalása

- [ ] A munka végén készíts rövid összefoglalót:
  - mit módosítottál
  - milyen új kurzusok kerültek be
  - milyen bugok javultak
  - milyen marketing/SEO elemek kerültek be
  - milyen schema.org, sitemap, robots.txt és social preview elemek készültek
  - milyen helyesírási/nyelvi javítások történtek
  - milyen ismert hiányosságok maradtak

Elfogadási feltétel:
- A projekt állapota követhető.

---

## TASK-1602 – Összesített státusz frissítése

- [ ] Frissítsd az “Összesített státusz” szekciót.
- [ ] Add meg:
  - kész taskok száma
  - részben kész taskok száma
  - hátralévő taskok száma
  - rövid megjegyzés a maradék munkáról

Elfogadási feltétel:
- A tasklista önmagában is mutatja, hol tart a fejlesztés.

---

# Rövid prioritási sorrend

Ha nem fér bele minden egyszerre, ebben a sorrendben dolgozz:

1. Központi metadata létrehozása
2. Encoding és ékezet hibák javítása
3. Progress és section count bugok javítása
4. Főoldali kurzuskártyák egységesítése
5. Tanulási útvonalak frissítése
6. Új kurzusok hozzáadása
7. Databricks kurzus technikai kidolgozása
8. Marketing és SEO rendbetétele
9. Social preview image, Open Graph, Twitter/X Card és schema.org beállítások
10. Sticky TOC és localStorage progress
11. Kereső és szűrők
12. Vizuális design finomítása
13. Kódcellák és output blokkok javítása
14. Mobilnézet, technikai SEO és végellenőrzés
15. Végső helyesírási és nyelvhelyességi átnézés
