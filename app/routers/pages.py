"""页面路由 — 静态 HTML。"""
from pathlib import Path

from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()
STATIC = Path(__file__).parent.parent.parent / "static"


@router.get("/")
def index():
    return FileResponse(STATIC / "index.html")


@router.get("/career-subject")
def career_subject():
    return FileResponse(STATIC / "career-subject.html")


@router.get("/subject")
def subject():
    return FileResponse(STATIC / "subject.html")