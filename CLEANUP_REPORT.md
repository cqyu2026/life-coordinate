# 文件清理记录

日期：2026-10-10

所有路径相对于 /Users/yu/Documents/life-coordinate。
恢复包：cleanup-backups/2026-10-10-duplicates.zip。备份仅用于恢复，不作为运行入口。

## 删除清单（执行前核验）

|删除路径|保留路径 / 原因|
|---|---|
|career-icons/accountant.svg|static/assets/accountant.svg；逐字节一致，可从保留文件恢复|
|career-icons/animator.svg|static/assets/animator.svg；逐字节一致，可从保留文件恢复|
|career-icons/architectural-engineer.svg|static/assets/architectural-engineer.svg；逐字节一致，可从保留文件恢复|
|career-icons/biologist.svg|static/assets/biologist.svg；逐字节一致，可从保留文件恢复|
|career-icons/career-icons.svg|static/assets/career-icons.svg；逐字节一致，可从保留文件恢复|
|career-icons/chemist.svg|static/assets/chemist.svg；逐字节一致，可从保留文件恢复|
|career-icons/clinical-doctor.svg|static/assets/clinical-doctor.svg；逐字节一致，可从保留文件恢复|
|career-icons/data-analyst.svg|static/assets/data-analyst.svg；逐字节一致，可从保留文件恢复|
|career-icons/dentist.svg|static/assets/dentist.svg；逐字节一致，可从保留文件恢复|
|career-icons/editor.svg|static/assets/editor.svg；逐字节一致，可从保留文件恢复|
|career-icons/education-researcher.svg|static/assets/education-researcher.svg；逐字节一致，可从保留文件恢复|
|career-icons/electrical-engineer.svg|static/assets/electrical-engineer.svg；逐字节一致，可从保留文件恢复|
|career-icons/environment-scientist.svg|static/assets/environment-scientist.svg；逐字节一致，可从保留文件恢复|
|career-icons/graphic-designer.svg|static/assets/graphic-designer.svg；逐字节一致，可从保留文件恢复|
|career-icons/hr.svg|static/assets/hr.svg；逐字节一致，可从保留文件恢复|
|career-icons/journalist.svg|static/assets/journalist.svg；逐字节一致，可从保留文件恢复|
|career-icons/kindergarten-teacher.svg|static/assets/kindergarten-teacher.svg；逐字节一致，可从保留文件恢复|
|career-icons/lawyer.svg|static/assets/lawyer.svg；逐字节一致，可从保留文件恢复|
|career-icons/legal-counsel.svg|static/assets/legal-counsel.svg；逐字节一致，可从保留文件恢复|
|career-icons/liquid-glass.css|static/assets/liquid-glass.css；逐字节一致，可从保留文件恢复|
|career-icons/marketing.svg|static/assets/marketing.svg；逐字节一致，可从保留文件恢复|
|career-icons/mechanical-engineer.svg|static/assets/mechanical-engineer.svg；逐字节一致，可从保留文件恢复|
|career-icons/music-producer.svg|static/assets/music-producer.svg；逐字节一致，可从保留文件恢复|
|career-icons/nurse.svg|static/assets/nurse.svg；逐字节一致，可从保留文件恢复|
|career-icons/pharmacist.svg|static/assets/pharmacist.svg；逐字节一致，可从保留文件恢复|
|career-icons/photographer.svg|static/assets/photographer.svg；逐字节一致，可从保留文件恢复|
|career-icons/product-manager.svg|static/assets/product-manager.svg；逐字节一致，可从保留文件恢复|
|career-icons/secondary-teacher.svg|static/assets/secondary-teacher.svg；逐字节一致，可从保留文件恢复|
|career-icons/social-worker.svg|static/assets/social-worker.svg；逐字节一致，可从保留文件恢复|
|career-icons/software-engineer.svg|static/assets/software-engineer.svg；逐字节一致，可从保留文件恢复|
|career-icons/trainer.svg|static/assets/trainer.svg；逐字节一致，可从保留文件恢复|
|career-icons/translator.svg|static/assets/translator.svg；逐字节一致，可从保留文件恢复|
|static/assets/career-png/animator.png|career-png/animator.png；逐字节一致，可从保留文件恢复|
|static/assets/career-png/lawyer.png|career-png/lawyer.png；逐字节一致，可从保留文件恢复|
|static/assets/career-png/software-engineer.png|career-png/software-engineer.png；逐字节一致，可从保留文件恢复|
|career-png/career-catalog.js|static/assets/career-catalog.js；30 个职业数据语义一致，保留文件另含 window 导出|
|static/js/page-list.js|未被任何页面引用的旧列表实现；可从恢复包恢复|
|static/css/page-list.css|未被任何页面引用的旧列表样式；可从恢复包恢复|

运行影响：上述路径无现有页面/代码引用；运行使用的 static/assets 保留。完整 PNG 素材集保留在 career-png。

## 保留

- V1.0：独立历史产品版本，非重复文件。
- static/subject.html、static/career-subject.html 及其 JS/CSS：后端路由仍在使用。
- data/、app/、tests/、.venv/：运行与验证依赖。
- 独有 PNG、GIF 和设计规范：不按名称或格式判断重复。

## 后续清理（2026-10-10）

已将以下文件逐字节存入 `cleanup-backups/2026-10-10-obsolete-data.zip`，核对归档内容后删除原件：

|删除路径|原因及运行影响|
|---|---|
|`clinical-doctor.gif`|与 `career-gif/clinical-doctor.gif` 逐字节一致；现有页面引用后者，删除无运行影响。|
|`static/assets/career-catalog.js`|原 30 职业列表已合并至 `data/careers.json` 并由脚本生成 `static/assets/site-data.js`；现有页面不再引用旧脚本。|

可从上述恢复包还原原文件。当前页面与后端已共用 `data/` 业务数据；更新数据后须运行 `.venv/bin/python scripts/build_site_data.py`，测试会检查生成文件是否同步。
