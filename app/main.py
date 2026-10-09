"""life-coordinate 入口 — 启动期加载数据 + 挂载路由。"""
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from . import data_loader
from .routers import api, pages

STATIC_DIR = Path(__file__).parent.parent / "static"
CAREER_GIF_DIR = Path(__file__).parent.parent / "career-gif"

app = FastAPI(title="life-coordinate", version="0.1")


@app.on_event("startup")
def _startup():
    data_loader.init()


app.include_router(pages.router)
app.include_router(api.router)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")
app.mount("/career-gif", StaticFiles(directory=CAREER_GIF_DIR), name="career-gif")
