"""REST API。"""
from fastapi import APIRouter, HTTPException, Query

from ..services import careers as careers_svc
from ..services import reverse as reverse_svc

router = APIRouter(prefix="/api")
SUBJECTS = {"物理", "化学", "生物", "政治", "历史", "地理", "技术"}


@router.get("/careers")
def list_careers(category: str | None = None, q: str | None = None):
    items = careers_svc.list_careers(category=category, q=q)
    return [
        {
            "id": c.id,
            "name": c.name,
            "category": c.category,
            "aliases": c.aliases,
            "tagline": c.tagline,
        }
        for c in items
    ]


@router.get("/careers/{career_id}")
def get_career(career_id: str):
    c = careers_svc.get_career(career_id)
    if not c:
        raise HTTPException(404, "career not found")
    return {
        "id": c.id,
        "name": c.name,
        "category": c.category,
        "aliases": c.aliases,
        "tagline": c.tagline,
        "workday": {
            "tasks": c.workday.tasks,
            "scenes": c.workday.scenes,
            "rhythm": c.workday.rhythm,
            "source": c.workday.source,
        },
    }


@router.get("/careers/{career_id}/subject")
def get_career_subject(career_id: str):
    if not careers_svc.get_career(career_id):
        raise HTTPException(404, "career not found")
    majors = careers_svc.get_majors_for_career(career_id)
    return {
        "careerId": career_id,
        "majors": [
            {
                "id": m.id,
                "name": m.name,
                "code": m.code,
                "category": m.category,
                "subject_required": {
                    "must": m.subject_required.must,
                    "limit": m.subject_required.limit,
                    "any": m.subject_required.any,
                } if m.subject_required else None,
                "note": m.note,
                "source": m.source,
                "source_url": m.source_url,
                "published": m.published,
            }
            for m in majors
        ],
    }


@router.get("/majors")
def search_majors(subjects: str = Query("", description="逗号分隔，如 物理,化学")):
    if not subjects:
        return []
    selected = [s.strip() for s in subjects.split(",")]
    if not selected or len(selected) > 3 or len(selected) != len(set(selected)) or any(s not in SUBJECTS for s in selected):
        raise HTTPException(422, "请选择 1 至 3 门不同的有效科目")
    results = reverse_svc.search(selected)
    return [
        {
            "major": {
                "id": m["major"].id,
                "name": m["major"].name,
                "code": m["major"].code,
                "note": m["major"].note,
                "published": m["major"].published,
                "category": m["major"].category,
                "source": m["major"].source,
                "source_url": m["major"].source_url,
                "subject_required": {
                    "must": m["major"].subject_required.must,
                    "limit": m["major"].subject_required.limit,
                    "any": m["major"].subject_required.any,
                } if m["major"].subject_required else None,
            },
            "careers": [{"id": c.id, "name": c.name, "category": c.category} for c in m["careers"]],
        }
        for m in results
    ]
