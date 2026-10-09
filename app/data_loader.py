"""启动期加载并校验 JSON 数据，发布到内存 dict。"""
import json
from pathlib import Path

from .models import Career, Major

DATA_DIR = Path(__file__).parent.parent / "data"


def load_careers() -> dict[str, Career]:
    raw = json.loads((DATA_DIR / "careers.json").read_text(encoding="utf-8"))
    items = {c["id"]: Career(**c) for c in raw["careers"]}
    if len(items) != len(raw["careers"]):
        raise ValueError("duplicate career id")
    return items


def load_majors() -> dict[str, Major]:
    raw = json.loads((DATA_DIR / "majors.json").read_text(encoding="utf-8"))
    items = {m["id"]: Major(**m) for m in raw["majors"]}
    if len(items) != len(raw["majors"]):
        raise ValueError("duplicate major id")
    return items


def load_mappings() -> list[dict[str, str]]:
    raw = json.loads((DATA_DIR / "mappings.json").read_text(encoding="utf-8"))
    return raw["mappings"]


# 模块级单例 — 启动时填充一次
CAREERS: dict[str, Career] = {}
MAJORS: dict[str, Major] = {}
MAPPINGS: list[dict[str, str]] = []


def init() -> None:
    """main.py 在启动时调用一次。"""
    global CAREERS, MAJORS, MAPPINGS
    careers = load_careers()
    majors = load_majors()
    mappings = load_mappings()
    if any(m["careerId"] not in careers or m["majorId"] not in majors for m in mappings):
        raise ValueError("career-major mapping references missing data")
    CAREERS, MAJORS, MAPPINGS = careers, majors, mappings
