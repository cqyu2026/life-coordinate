"""Pydantic 模型 — 启动期校验数据用。"""
from typing import Literal
from pydantic import BaseModel, Field

Subject = Literal["物理", "化学", "生物", "政治", "历史", "地理", "技术"]
Category = Literal["医", "工", "理", "文", "艺", "商", "教", "法"]


class Workday(BaseModel):
    tasks: list[str]
    scenes: list[str]
    rhythm: str
    source: str


class Career(BaseModel):
    id: str
    icon: str
    name: str
    category: Category
    aliases: list[str] = []
    tagline: str
    workday: Workday


class SubjectRequirement(BaseModel):
    must: list[Subject] = []
    limit: list[Subject] = []
    any: bool = False  # true = limit 列表中任选其一即可


class Major(BaseModel):
    id: str
    name: str
    code: str
    category: Literal["普通", "美术", "音乐", "体育", "舞蹈", "表演", "播音"]
    subject_required: SubjectRequirement | None = None
    note: str = ""
    source: str
    source_url: str = ""
    published: str
