"""测试数据加载 + 查询函数（Pydantic 启动期校验）。"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app import data_loader
from app.services import careers as c_svc
from app.services import reverse as r_svc
from app.routers.api import search_majors
from fastapi import HTTPException
from scripts.build_site_data import OUTPUT, build


def setup_module():
    data_loader.init()


def test_data_loaded():
    setup_module()
    assert len(data_loader.CAREERS) >= 5, f"expected ≥5 careers, got {len(data_loader.CAREERS)}"
    assert len(data_loader.MAJORS) >= 5
    assert len(data_loader.MAPPINGS) >= 5


def test_career_detail():
    setup_module()
    c = c_svc.get_career("doctor")
    assert c.name == "临床医生"
    assert c.workday.tasks


def test_career_to_majors():
    setup_module()
    majors = c_svc.get_majors_for_career("doctor")
    names = {m.name for m in majors}
    assert "临床医学" in names
    assert "医学影像学" in names


def test_animator_has_dual_path():
    setup_module()
    majors = c_svc.get_majors_for_career("animator")
    cats = {m.category for m in majors}
    assert "美术" in cats, "动画设计师应有艺考路径"
    assert "普通" in cats, "动画设计师应有普通路径"


def test_reverse_phys_chem():
    setup_module()
    results = r_svc.search(["物理", "化学"])
    names = {r["major"].name for r in results}
    assert "医学影像学" in names  # 物化够
    assert "临床医学" in names  # 苏州大学公布的要求是物理和化学
    assert "软件工程" in names
    assert "计算机科学与技术" in names
    assert "数字媒体技术" in names


def test_reverse_phys_chem_bio():
    setup_module()
    results = r_svc.search(["物理", "化学", "生物"])
    names = {r["major"].name for r in results}
    assert "临床医学" in names
    assert "医学影像学" in names


def test_reference_subjects_are_institution_specific():
    setup_module()
    majors = data_loader.MAJORS
    expected = {
        "clinical-medicine": ({"物理", "化学"}, "10285"),
        "medical-imaging": ({"物理", "化学"}, "10285"),
        "software-engineering": ({"物理", "化学"}, "10285"),
        "computer-science": ({"物理", "化学"}, "10285"),
        "law": (set(), "10285"),
        "animation-art": (set(), "13435"),
        "digital-media-tech": ({"物理", "化学"}, "10895"),
        "primary-education": (set(), "10895"),
    }
    for major_id, (must, institution_code) in expected.items():
        major = majors[major_id]
        assert set(major.subject_required.must) == must
        assert major.subject_required.limit == []
        assert institution_code in major.source_url
        assert major.published == "2024"


def test_reverse_no_match():
    setup_module()
    results = r_svc.search(["地理", "历史"])
    # 现有数据无地理/历史依赖的本科专业
    assert isinstance(results, list)


def test_reverse_empty():
    setup_module()
    # 服务层：0 科返回所有"不限"专业（any 无要求）
    results = r_svc.search([])
    assert all(r["major"].subject_required is not None and r["major"].subject_required.must == [] and r["major"].subject_required.limit == [] for r in results)
    # API 层短路为空（页面已用）
    # curl 验证：GET /api/majors?subjects=  应返回 []


def test_site_data_matches_backend():
    setup_module()
    assert OUTPUT.read_text(encoding="utf-8") == build()
    assert len(data_loader.CAREERS) == 31
    root = Path(__file__).parent.parent
    assert all((root / "career-gif" / f"{c.icon}.gif").is_file() or (root / "static/assets/career-png" / f"{c.icon}.png").is_file() for c in data_loader.CAREERS.values())
    assert all(m["careerId"] in data_loader.CAREERS and m["majorId"] in data_loader.MAJORS for m in data_loader.MAPPINGS)
    assert {m["careerId"] for m in data_loader.MAPPINGS} == set(data_loader.CAREERS)


def test_unverified_requirements_not_marked_eligible():
    setup_module()
    from app.services.reverse import _major_fits
    nursing = data_loader.MAJORS["nursing"]
    assert nursing.subject_required is None
    assert not _major_fits(nursing, {"物理", "化学", "生物"})


def test_api_rejects_invalid_subjects():
    for value in ("garbage", "物理,物理", "物理,化学,生物,历史", ",", "物理,"):
        try:
            search_majors(value)
        except HTTPException as exc:
            assert exc.status_code == 422
        else:
            raise AssertionError(f"accepted invalid subjects: {value}")


if __name__ == "__main__":
    for fn in [v for k, v in globals().items() if k.startswith("test_")]:
        try:
            fn()
            print(f"  ok  {fn.__name__}")
        except AssertionError as e:
            print(f"  FAIL {fn.__name__}: {e}")
            sys.exit(1)
    print("all passed")
