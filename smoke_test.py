#!/usr/bin/env python3
"""smoke_test.py — Engineering Crash Courses

Egy gyors ellenőrzés, hogy minden függőség importálható-e.
Nem futtat valódi kódot, csak importál és kiírja a verziókat.

Futtatás: python smoke_test.py
Lehetséges: python smoke_test.py --strict   # hiányzó csomag hibát ad
"""
from __future__ import annotations

import importlib
import sys
from typing import Any


# Csoport → (csomagnév, modulnév, opcionális hova)
GROUPS: dict[str, list[tuple[str, str, str | None]]] = {
    "Core data": [
        ("pandas", "pandas", "Python DE, AI Data Engineer"),
        ("pyarrow", "pyarrow", "Delta, OTF"),
        ("numpy", "numpy", "Spark, Python DE"),
        ("duckdb", "duckdb", "SQL Modeling"),
        ("pydantic", "pydantic", "Python DE, AIOps"),
    ],
    "IO / DB / API": [
        ("psycopg[binary]", "psycopg", "Postgres kapcsolat"),
        ("sqlalchemy", "sqlalchemy", "Python DE"),
        ("requests", "requests", "Python DE"),
        ("pytest", "pytest", "Python DE, dbt"),
    ],
    "Lakehouse": [
        ("deltalake", "deltalake", "Delta kurzus (Spark nélkül)"),
        ("pyiceberg", "pyiceberg", "Open Table Formats"),
    ],
    "Spark": [
        ("pyspark", "pyspark", "Spark, Streaming, Databricks"),
    ],
    "Streaming": [
        ("kafka-python", "kafka", "Streaming kurzus"),
    ],
    "Cloud": [
        ("boto3", "boto3", "MinIO/S3"),
    ],
    "Orchestration / Transform": [
        ("apache-airflow", "airflow", "Airflow kurzus"),
        ("dbt-postgres", "dbt", "dbt kurzus"),
    ],
    "Quality": [
        ("great-expectations", "great_expectations", "AI Data Engineer"),
    ],
    "ML / LLM ops": [
        ("mlflow", "mlflow", "AIOps, LLMOps, Databricks"),
        ("scikit-learn", "sklearn", "AIOps"),
        ("fastapi", "fastapi", "AIOps, LLMOps"),
        ("prometheus-client", "prometheus_client", "AIOps, LLMOps"),
    ],
    "Feature store": [
        ("feast", "feast", "AI Data Engineer"),
    ],
    "RAG / Vector / LLM providers": [
        ("chromadb", "chromadb", "AI Engineering, RAG Eval"),
        ("sentence-transformers", "sentence_transformers", "RAG Eval"),
        ("openai", "openai", "AI Engineering, LLMOps"),
        ("anthropic", "anthropic", "LLMOps prompt caching"),
        ("ragas", "ragas", "RAG Eval"),
    ],
}


def get_version(mod: Any) -> str:
    for attr in ("__version__", "VERSION", "version"):
        v = getattr(mod, attr, None)
        if v is not None:
            return str(v) if not isinstance(v, tuple) else ".".join(str(x) for x in v)
    return "?"


def main(strict: bool = False) -> int:
    print(f"Python: {sys.version.split()[0]}  ({sys.executable})\n")
    total = 0
    ok = 0
    missing: list[tuple[str, str, str | None]] = []

    for group, packages in GROUPS.items():
        print(f"{group}")
        print("-" * len(group))
        for pkg_name, mod_name, used_in in packages:
            total += 1
            try:
                mod = importlib.import_module(mod_name)
                ver = get_version(mod)
                used = f"  [{used_in}]" if used_in else ""
                print(f"  OK  {pkg_name:<30} {ver}{used}")
                ok += 1
            except ImportError:
                used = f"  [{used_in}]" if used_in else ""
                print(f"  --  {pkg_name:<30} not installed{used}")
                missing.append((pkg_name, mod_name, used_in))
        print()

    print(f"Summary: {ok}/{total} packages importable.")
    if missing:
        print(f"Missing: {', '.join(p[0] for p in missing)}")
        print("Install with: pip install -r requirements.txt")
        if strict:
            return 1
    return 0


if __name__ == "__main__":
    strict = "--strict" in sys.argv
    sys.exit(main(strict=strict))
