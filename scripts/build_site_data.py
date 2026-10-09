"""把后端 JSON 数据生成供 file:// 页面使用的只读脚本。"""
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
OUTPUT = ROOT / "static" / "assets" / "site-data.js"


def build() -> str:
    site = {
        "careers": json.loads((DATA / "careers.json").read_text(encoding="utf-8"))["careers"],
        "majors": json.loads((DATA / "majors.json").read_text(encoding="utf-8"))["majors"],
        "mappings": json.loads((DATA / "mappings.json").read_text(encoding="utf-8"))["mappings"],
    }
    return "window.siteData = " + json.dumps(site, ensure_ascii=False, separators=(",", ":")) + ";\n"


if __name__ == "__main__":
    OUTPUT.write_text(build(), encoding="utf-8")
