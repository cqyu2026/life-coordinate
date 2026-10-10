# life-coordinate

- 定位：职业日常、专业关联和选科参考探索工具；当前入口为 `static/index.html`，FastAPI 入口为 `app/main.py`。
- 运行：使用项目已有 `.venv`；运行 `uvicorn app.main:app --reload` 后访问 `/`。直接打开 `static/index.html` 可查看本地首页。
- 技术栈：FastAPI + Pydantic 后端，原生 HTML/CSS/JavaScript 前端，业务数据位于 `data/`。
- 约定：修改 `data/` 后运行 `python scripts/build_site_data.py`；页面资源引用需同时检查本地文件入口和 FastAPI 入口；运行 `.venv/bin/python tests/test_smoke.py`、`.venv/bin/python tests/test_regressions.py` 和 `node --test tests/test_frontend.cjs`。
- 当前边界：`V1.0/` 是历史版本，`.career-animation-work/` 是动画审查工作资料，`cleanup-backups/` 是恢复包；清理前先核对用途并取得明确确认。招生数据是有限样本参考，不代表完整可报范围。
