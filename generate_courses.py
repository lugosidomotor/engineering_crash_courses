#!/usr/bin/env python3
"""Validate course metadata.

Historically this file generated a small set of course pages from an inline
template. The site now keeps course pages as authored HTML files and uses
courses.json as the homepage metadata source of truth.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
REQUIRED_FIELDS = {
    "slug",
    "title",
    "description",
    "url",
    "image",
    "difficulty",
    "estimatedTime",
    "sectionCount",
    "codeCellCount",
    "stack",
    "whatYouBuild",
    "status",
}


def count_sections(html: str) -> int:
    return sum(1 for attr in re.findall(r'class="([^"]*)"', html) if "section" in attr.split())


def count_code_cells(html: str) -> int:
    return sum(1 for attr in re.findall(r'class="([^"]*)"', html) if "code-cell" in attr.split())


def main() -> int:
    courses_path = ROOT / "courses.json"
    courses = json.loads(courses_path.read_text(encoding="utf-8"))
    failures: list[str] = []

    for course in courses:
        slug = course.get("slug", "<missing-slug>")
        missing = sorted(REQUIRED_FIELDS - set(course))
        if missing:
            failures.append(f"{slug}: missing fields: {', '.join(missing)}")

        page = ROOT / slug / "index.html"
        if not page.exists():
            failures.append(f"{slug}: missing page {page.relative_to(ROOT)}")
            continue

        html = page.read_text(encoding="utf-8")
        actual_sections = count_sections(html)
        actual_cells = count_code_cells(html)

        if course.get("sectionCount") != actual_sections:
            failures.append(
                f"{slug}: sectionCount={course.get('sectionCount')} "
                f"but page has {actual_sections}"
            )
        if course.get("codeCellCount") != actual_cells:
            failures.append(
                f"{slug}: codeCellCount={course.get('codeCellCount')} "
                f"but page has {actual_cells}"
            )

        url = course.get("url")
        if url and not (ROOT / url).exists():
            failures.append(f"{slug}: url points to missing file: {url}")

        image = course.get("image")
        if image and not (ROOT / image).exists():
            failures.append(f"{slug}: image points to missing file: {image}")

    if failures:
        print("FAIL:")
        for failure in failures:
            print(f"  - {failure}")
        return 1

    print(f"OK: {len(courses)} courses validated from courses.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
