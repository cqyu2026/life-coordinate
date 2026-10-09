"""反向查询：subjects → 可报 majors → 关联 careers。"""
from .. import data_loader
from ..models import Career, Major


def _major_fits(major: Major, selected: set[str]) -> bool:
    """一个专业是否对当前选科组合开放。"""
    req = major.subject_required
    if req is None:
        return False  # 未核实院校选科要求，不参与可报匹配
    # must 全部选中
    for s in req.must:
        if s not in selected:
            return False
    # 不要求 any 也不要求 must → 任何选科都可
    if not req.limit:
        return True
    # 限选：any=true 取其一，any=false 则全部选
    if req.any:
        return any(s in selected for s in req.limit)
    return all(s in selected for s in req.limit)


def search(subjects: list[str]) -> list[dict]:
    selected = set(subjects)
    out = []
    for major in data_loader.MAJORS.values():
        if not _major_fits(major, selected):
            continue
        careers = [
            data_loader.CAREERS[m["careerId"]]
            for m in data_loader.MAPPINGS
            if m["majorId"] == major.id and m["careerId"] in data_loader.CAREERS
        ]
        out.append({"major": major, "careers": careers})
    return out
