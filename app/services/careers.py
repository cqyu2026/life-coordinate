"""正向查询：career → 关联 majors。"""
from .. import data_loader
from ..models import Career, Major


def list_careers(category: str | None = None, q: str | None = None) -> list[Career]:
    items = list(data_loader.CAREERS.values())
    if category:
        items = [c for c in items if c.category == category]
    if q:
        ql = q.lower()
        items = [
            c for c in items
            if ql in c.name.lower()
            or ql in c.tagline.lower()
            or any(ql in a.lower() for a in c.aliases)
        ]
    return items


def get_career(career_id: str) -> Career | None:
    return data_loader.CAREERS.get(career_id)


def get_majors_for_career(career_id: str) -> list[Major]:
    pairs = [m for m in data_loader.MAPPINGS if m["careerId"] == career_id]
    return [data_loader.MAJORS[mid] for mid in (p["majorId"] for p in pairs) if mid in data_loader.MAJORS]