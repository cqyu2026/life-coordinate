'use strict';

/* ============================================
   data.js — 人生坐标系 · 数据层
   V2.0 · 步骤2：职业数据 + 测试题目
   ============================================ */

/* ============================================
   一、职业数据：CAREERS 数组（15 个职业）
   ============================================
   字段说明：
   - id              职业唯一标识（英文，用于 URL 参数）
   - name            职业中文名
   - emoji           职业 Emoji
   - motto           灵魂文案
   - doorColor       门的颜色 CSS 类名后缀（如 "c2"，对应 .door-c2）
   - doorNum         门牌号（如 "02"）
   - doorSub         门副标题短文案
   - scenes          3 张场景 Emoji 数组
   - bubbles         3 条气泡文案数组（对应 3 张场景）
   - talentWords     3 个天赋词条数组（每项含 text 和 tagClass）
   - matchRate       匹配度数字（0-100）
   - matchStars      星级数字（1-5）
   - dimensions      6 维度得分对象 { logic, expression, aesthetic, empathy, handsOn, physical }，每项 0-100
   - equipment       装备推荐对象 { mainWeapon, subWeapon, armor, mainReason, subReason, armorReason, armorTrend }
   - majors          推荐专业数组
   - scores          学科分数对象 { keyUniversity: {...}, normalUniversity: {...} }
                     其中 keyUniversity/normalUniversity 的键为：装备科目 + 语文/数学/英语 + 总分
   - hasArtPath      是否有艺考隐藏路线（布尔值）
   - artPaths        艺考路线数据（仅 hasArtPath: true 时需要）
                     结构：{ routes: [{ name, 联考专业分, 校考专业分, 文化课最低分 }] }
   ============================================ */

var CAREERS = [

  /* ---- 01 医生 ---- */
  {
    id: 'doctor',
    name: '医生',
    emoji: '🩺',
    motto: '用仁心守护生命',
    doorColor: 'c1',
    doorNum: '01',
    doorSub: '🩺 救死扶伤',
    scenes: ['🩺', '💊', '🏨'],
    bubbles: [
      '"7:30 查房，问候每一位病人 🌅"',
      '"14:00 手术室，三小时手术开始 🔬"',
      '"21:00 写病历，回顾今天的诊疗 📝"'
    ],
    talentWords: [
      { text: '逻辑+3', tagClass: 'tag-coral' },
      { text: '共情+5', tagClass: 'tag-gold' },
      { text: '动手+4', tagClass: 'tag-green' }
    ],
    matchRate: 85,
    matchStars: 4,
    dimensions: { logic: 85, expression: 60, aesthetic: 40, empathy: 80, handsOn: 75, physical: 50 },
    equipment: {
      mainWeapon: '化学',
      subWeapon: '生物',
      armor: '物理',
      mainReason: '医学类专业要求必选化学，是所有医学方向的基础',
      subReason: '生物与人体构造、疾病机理直接相关',
      armorReason: '物理锻炼逻辑思维，且影像医学等方向需要物理基础',
      armorTrend: '近3年选科趋势 📈 持续上升'
    },
    majors: ['临床医学（五年制 / 5+3一体化）', '基础医学', '药学'],
    scores: {
      keyUniversity:  { '化学': 92, '生物': 88, '物理': 90, '语文': 120, '数学': 125, '英语': 122, '总分': 637 },
      normalUniversity: { '化学': 75, '生物': 72, '物理': 78, '语文': 100, '数学': 105, '英语': 102, '总分': 532 }
    },
    hasArtPath: false,
    artPaths: null
  },

  /* ---- 02 律师 ---- */
  {
    id: 'lawyer',
    name: '律师',
    emoji: '⚖️',
    motto: '用逻辑为正义辩护',
    doorColor: 'c2',
    doorNum: '02',
    doorSub: '⚖️ 维护正义',
    scenes: ['📚', '⚖️', '💡'],
    bubbles: [
      '"8:00 到律所，一杯咖啡开始阅卷 📚"',
      '"14:00 法庭辩论，据理力争 ⚖️"',
      '"22:00 复盘案件策略，准备明日庭审 💡"'
    ],
    talentWords: [
      { text: '逻辑+3', tagClass: 'tag-coral' },
      { text: '表达+5', tagClass: 'tag-gold' },
      { text: '正义感+4', tagClass: 'tag-green' }
    ],
    matchRate: 87,
    matchStars: 5,
    dimensions: { logic: 90, expression: 88, aesthetic: 35, empathy: 55, handsOn: 30, physical: 25 },
    equipment: {
      mainWeapon: '历史',
      subWeapon: '政治',
      armor: '地理',
      mainReason: '法学专业要求必选历史，理解法律演变至关重要',
      subReason: '政治与法学高度相关，提升思辨能力',
      armorReason: '地理拓展人文视野，法律人需要广阔的知识面',
      armorTrend: '近3年选科趋势 📈 稳中有升'
    },
    majors: ['法学（民商法 / 刑法 / 国际法）', '知识产权', '政治学与行政学'],
    scores: {
      keyUniversity:  { '历史': 92, '政治': 88, '地理': 82, '语文': 125, '数学': 118, '英语': 122, '总分': 627 },
      normalUniversity: { '历史': 78, '政治': 72, '地理': 65, '语文': 105, '数学': 95, '英语': 100, '总分': 515 }
    },
    hasArtPath: false,
    artPaths: null
  },

  /* ---- 03 教师 ---- */
  {
    id: 'teacher',
    name: '教师',
    emoji: '📚',
    motto: '点亮他人的人生',
    doorColor: 'c3',
    doorNum: '03',
    doorSub: '📚 传道授业',
    scenes: ['📖', '✏️', '🌟'],
    bubbles: [
      '"7:00 晨读时间，朗朗书声 📖"',
      '"14:00 批改作业，每本都认真写评语 ✏️"',
      '"18:00 备课到天黑，为学生准备最有趣的课堂 🌟"'
    ],
    talentWords: [
      { text: '表达+5', tagClass: 'tag-coral' },
      { text: '共情+4', tagClass: 'tag-gold' },
      { text: '逻辑+3', tagClass: 'tag-green' }
    ],
    matchRate: 78,
    matchStars: 4,
    dimensions: { logic: 65, expression: 85, aesthetic: 45, empathy: 90, handsOn: 40, physical: 35 },
    equipment: {
      mainWeapon: '政治',
      subWeapon: '历史',
      armor: '地理',
      mainReason: '师范类教育专业重视思想政治素养',
      subReason: '历史培养人文底蕴，是教学的根基',
      armorReason: '地理学科教师需求量稳定增长',
      armorTrend: '近3年选科趋势 📊 平稳'
    },
    majors: ['教育学', '汉语言文学（师范）', '思想政治教育（师范）'],
    scores: {
      keyUniversity:  { '政治': 85, '历史': 82, '地理': 78, '语文': 122, '数学': 110, '英语': 115, '总分': 592 },
      normalUniversity: { '政治': 70, '历史': 68, '地理': 62, '语文': 100, '数学': 88, '英语': 95, '总分': 483 }
    },
    hasArtPath: false,
    artPaths: null
  },

  /* ---- 04 工程师 ---- */
  {
    id: 'engineer',
    name: '工程师',
    emoji: '⚙️',
    motto: '用技术改变世界',
    doorColor: 'c4',
    doorNum: '04',
    doorSub: '⚙️ 精益求精',
    scenes: ['📐', '🔧', '🏭'],
    bubbles: [
      '"9:00 团队会议，讨论设计方案 📐"',
      '"14:00 工地现场，检查施工质量 🔧"',
      '"20:00 完善图纸，优化每一个细节 🏭"'
    ],
    talentWords: [
      { text: '逻辑+5', tagClass: 'tag-coral' },
      { text: '动手+4', tagClass: 'tag-gold' },
      { text: '表达+3', tagClass: 'tag-green' }
    ],
    matchRate: 82,
    matchStars: 4,
    dimensions: { logic: 88, expression: 50, aesthetic: 35, empathy: 30, handsOn: 90, physical: 55 },
    equipment: {
      mainWeapon: '物理',
      subWeapon: '化学',
      armor: '技术',
      mainReason: '物理是工程学的基石，力学/电磁学贯穿所有工程领域',
      subReason: '化学与材料科学紧密相关，新材料是工程创新的关键',
      armorReason: '技术科目培养动手实践能力，与工程思维高度互补',
      armorTrend: '近3年选科趋势 📈 持续热门'
    },
    majors: ['机械工程', '土木工程', '电气工程及其自动化'],
    scores: {
      keyUniversity:  { '物理': 95, '化学': 88, '技术': 85, '语文': 115, '数学': 130, '英语': 118, '总分': 631 },
      normalUniversity: { '物理': 80, '化学': 72, '技术': 70, '语文': 95, '数学': 108, '英语': 98, '总分': 523 }
    },
    hasArtPath: false,
    artPaths: null
  },

  /* ---- 05 设计师 ---- */
  {
    id: 'designer',
    name: '设计师',
    emoji: '🎨',
    motto: '让世界变得更美',
    doorColor: 'c5',
    doorNum: '05',
    doorSub: '🎨 美感创造',
    scenes: ['🖌️', '💻', '✨'],
    bubbles: [
      '"9:30 收集灵感，翻阅设计杂志 🖌️"',
      '"15:00 客户提案，展示三套方案 💻"',
      '"23:00 深夜创作，灵感大爆发 ✨"'
    ],
    talentWords: [
      { text: '审美+5', tagClass: 'tag-coral' },
      { text: '动手+4', tagClass: 'tag-gold' },
      { text: '表达+3', tagClass: 'tag-green' }
    ],
    matchRate: 80,
    matchStars: 4,
    dimensions: { logic: 55, expression: 60, aesthetic: 95, empathy: 50, handsOn: 70, physical: 30 },
    equipment: {
      mainWeapon: '技术',
      subWeapon: '历史',
      armor: '物理',
      mainReason: '技术科目培养数字工具操作能力，设计与软件密不可分',
      subReason: '历史积累文化与审美素养，设计需要深厚的文化底蕴',
      armorReason: '物理中的光学/力学知识对工业设计方向有帮助',
      armorTrend: '近3年选科趋势 📈 新兴热门'
    },
    majors: ['视觉传达设计', '环境设计', '数字媒体艺术'],
    scores: {
      keyUniversity:  { '技术': 82, '历史': 80, '物理': 75, '语文': 118, '数学': 105, '英语': 110, '总分': 570 },
      normalUniversity: { '技术': 68, '历史': 65, '物理': 58, '语文': 98, '数学': 85, '英语': 90, '总分': 464 }
    },
    hasArtPath: true,
    artPaths: {
      description: '设计类专业有普通高考和艺考两条路线，艺考路线对文化课分数要求更低，但需要通过专业考试。',
      routes: [
        {
          name: '视觉传达设计',
          联考专业分: '≥ 82/100',
          校考专业分: '≥ 250/300',
          文化课最低分: '≥ 400/750'
        },
        {
          name: '环境设计',
          联考专业分: '≥ 80/100',
          校考专业分: '≥ 240/300',
          文化课最低分: '≥ 380/750'
        }
      ]
    }
  },

  /* ---- 06 程序员 ---- */
  {
    id: 'programmer',
    name: '程序员',
    emoji: '💻',
    motto: '用代码构建未来',
    doorColor: 'c6',
    doorNum: '06',
    doorSub: '💻 数字世界',
    scenes: ['⌨️', '🐛', '🚀'],
    bubbles: [
      '"10:00 站会，同步项目进度 ⌨️"',
      '"15:00 Debug，和Bug斗智斗勇 🐛"',
      '"02:00 凌晨上线，代码部署成功 🚀"'
    ],
    talentWords: [
      { text: '逻辑+5', tagClass: 'tag-coral' },
      { text: '动手+3', tagClass: 'tag-gold' },
      { text: '表达+2', tagClass: 'tag-green' }
    ],
    matchRate: 85,
    matchStars: 4,
    dimensions: { logic: 95, expression: 40, aesthetic: 30, empathy: 25, handsOn: 60, physical: 20 },
    equipment: {
      mainWeapon: '技术',
      subWeapon: '物理',
      armor: '化学',
      mainReason: '技术科目直接对应计算机编程基础，是程序员的起跑线',
      subReason: '物理锻炼抽象建模能力，与算法设计思维相通',
      armorReason: '化学中的逻辑推理训练对编程思维有潜移默化的帮助',
      armorTrend: '近3年选科趋势 📈 爆发式增长'
    },
    majors: ['计算机科学与技术', '软件工程', '人工智能'],
    scores: {
      keyUniversity:  { '技术': 95, '物理': 90, '化学': 82, '语文': 112, '数学': 135, '英语': 120, '总分': 634 },
      normalUniversity: { '技术': 80, '物理': 75, '化学': 68, '语文': 92, '数学': 112, '英语': 100, '总分': 527 }
    },
    hasArtPath: false,
    artPaths: null
  },

  /* ---- 07 会计 ---- */
  {
    id: 'accountant',
    name: '会计',
    emoji: '🧮',
    motto: '每一分钱都清清楚楚',
    doorColor: 'c7',
    doorNum: '07',
    doorSub: '🧮 严谨细致',
    scenes: ['📊', '💼', '📋'],
    bubbles: [
      '"9:00 核对账目，一分不差 📊"',
      '"14:00 税务申报，精确到每一笔 💼"',
      '"19:00 月末结账，所有报表对平 📋"'
    ],
    talentWords: [
      { text: '逻辑+5', tagClass: 'tag-coral' },
      { text: '细心+3', tagClass: 'tag-gold' },
      { text: '表达+2', tagClass: 'tag-green' }
    ],
    matchRate: 72,
    matchStars: 3,
    dimensions: { logic: 85, expression: 35, aesthetic: 20, empathy: 25, handsOn: 30, physical: 15 },
    equipment: {
      mainWeapon: '政治',
      subWeapon: '历史',
      armor: '技术',
      mainReason: '政治中的经济模块是会计学科的基础入门',
      subReason: '历史培养对经济制度演变的宏观理解',
      armorReason: '技术科目中的数据处理思维与会计信息化趋势一致',
      armorTrend: '近3年选科趋势 📊 稳定'
    },
    majors: ['会计学', '财务管理', '审计学'],
    scores: {
      keyUniversity:  { '政治': 85, '历史': 78, '技术': 80, '语文': 110, '数学': 120, '英语': 115, '总分': 588 },
      normalUniversity: { '政治': 70, '历史': 62, '技术': 65, '语文': 90, '数学': 98, '英语': 95, '总分': 480 }
    },
    hasArtPath: false,
    artPaths: null
  },

  /* ---- 08 建筑师 ---- */
  {
    id: 'architect',
    name: '建筑师',
    emoji: '🏗️',
    motto: '让想象矗立在大地上',
    doorColor: 'c8',
    doorNum: '08',
    doorSub: '🏗️ 创意建造',
    scenes: ['✏️', '🏗️', '🏆'],
    bubbles: [
      '"9:00 草图构思，灵感跃然纸上 ✏️"',
      '"15:00 项目汇报，展示设计理念 🏗️"',
      '"21:00 模型打磨，追求完美比例 🏆"'
    ],
    talentWords: [
      { text: '审美+5', tagClass: 'tag-coral' },
      { text: '逻辑+4', tagClass: 'tag-gold' },
      { text: '动手+3', tagClass: 'tag-green' }
    ],
    matchRate: 80,
    matchStars: 4,
    dimensions: { logic: 80, expression: 60, aesthetic: 85, empathy: 35, handsOn: 75, physical: 40 },
    equipment: {
      mainWeapon: '物理',
      subWeapon: '技术',
      armor: '地理',
      mainReason: '物理中的力学和结构知识是建筑设计的核心基础',
      subReason: '技术科目培养空间建模和数字绘图能力',
      armorReason: '地理涉及人文环境和城市规划，拓展建筑师的宏观视野',
      armorTrend: '近3年选科趋势 📈 稳步增长'
    },
    majors: ['建筑学（五年制）', '城乡规划', '风景园林'],
    scores: {
      keyUniversity:  { '物理': 90, '技术': 85, '地理': 80, '语文': 115, '数学': 125, '英语': 115, '总分': 610 },
      normalUniversity: { '物理': 75, '技术': 70, '地理': 65, '语文': 95, '数学': 102, '英语': 95, '总分': 502 }
    },
    hasArtPath: false,
    artPaths: null
  },

  /* ---- 09 公务员 ---- */
  {
    id: 'civilServant',
    name: '公务员',
    emoji: '🏛️',
    motto: '服务社会大众',
    doorColor: 'c9',
    doorNum: '09',
    doorSub: '🏛️ 公共服务',
    scenes: ['📝', '🤝', '📋'],
    bubbles: [
      '"8:30 整理文件，准备会议材料 📝"',
      '"14:00 接待来访群众，耐心解答 🤝"',
      '"18:00 汇总报告，撰写工作日报 📋"'
    ],
    talentWords: [
      { text: '表达+5', tagClass: 'tag-coral' },
      { text: '共情+4', tagClass: 'tag-gold' },
      { text: '逻辑+3', tagClass: 'tag-green' }
    ],
    matchRate: 75,
    matchStars: 3,
    dimensions: { logic: 60, expression: 75, aesthetic: 25, empathy: 70, handsOn: 20, physical: 30 },
    equipment: {
      mainWeapon: '政治',
      subWeapon: '历史',
      armor: '地理',
      mainReason: '政治是公务员考试和公共管理专业的核心学科',
      subReason: '历史培养宏观政策分析能力，理解制度变迁',
      armorReason: '地理涉及区域发展和资源管理，公共服务需要全局视野',
      armorTrend: '近3年选科趋势 📊 稳定'
    },
    majors: ['行政管理', '公共事业管理', '社会学'],
    scores: {
      keyUniversity:  { '政治': 88, '历史': 82, '地理': 78, '语文': 120, '数学': 108, '英语': 112, '总分': 588 },
      normalUniversity: { '政治': 72, '历史': 68, '地理': 62, '语文': 100, '数学': 88, '英语': 92, '总分': 482 }
    },
    hasArtPath: false,
    artPaths: null
  },

  /* ---- 10 销售经理 ---- */
  {
    id: 'salesManager',
    name: '销售经理',
    emoji: '💼',
    motto: '沟通创造价值',
    doorColor: 'c10',
    doorNum: '10',
    doorSub: '💼 沟通达人',
    scenes: ['📞', '🤝', '📈'],
    bubbles: [
      '"9:00 晨会，制定今日目标 📞"',
      '"14:00 拜访客户，演示产品方案 🤝"',
      '"20:00 复盘业绩，规划明日策略 📈"'
    ],
    talentWords: [
      { text: '表达+5', tagClass: 'tag-coral' },
      { text: '共情+4', tagClass: 'tag-gold' },
      { text: '逻辑+3', tagClass: 'tag-green' }
    ],
    matchRate: 78,
    matchStars: 4,
    dimensions: { logic: 55, expression: 92, aesthetic: 40, empathy: 65, handsOn: 30, physical: 35 },
    equipment: {
      mainWeapon: '政治',
      subWeapon: '历史',
      armor: '地理',
      mainReason: '政治中的经济模块帮助你理解市场和商业逻辑',
      subReason: '历史中的商业案例分析培养商业嗅觉',
      armorReason: '地理中的区域经济知识对市场拓展有实际帮助',
      armorTrend: '近3年选科趋势 📊 平稳'
    },
    majors: ['市场营销', '工商管理', '国际经济与贸易'],
    scores: {
      keyUniversity:  { '政治': 82, '历史': 78, '地理': 75, '语文': 118, '数学': 115, '英语': 120, '总分': 588 },
      normalUniversity: { '政治': 68, '历史': 62, '地理': 60, '语文': 98, '数学': 95, '英语': 100, '总分': 483 }
    },
    hasArtPath: false,
    artPaths: null
  },

  /* ---- 11 心理咨询师 ---- */
  {
    id: 'psychologist',
    name: '心理咨询师',
    emoji: '🧠',
    motto: '帮人们找回内心的光',
    doorColor: 'c11',
    doorNum: '11',
    doorSub: '🧠 治愈心灵',
    scenes: ['🛋️', '💭', '🌱'],
    bubbles: [
      '"10:00 第一位来访者，倾听ta的故事 🛋️"',
      '"15:00 团体辅导，引导大家分享 💭"',
      '"19:00 整理个案笔记，见证每一点成长 🌱"'
    ],
    talentWords: [
      { text: '共情+5', tagClass: 'tag-coral' },
      { text: '表达+4', tagClass: 'tag-gold' },
      { text: '逻辑+3', tagClass: 'tag-green' }
    ],
    matchRate: 82,
    matchStars: 4,
    dimensions: { logic: 60, expression: 80, aesthetic: 35, empathy: 95, handsOn: 25, physical: 20 },
    equipment: {
      mainWeapon: '生物',
      subWeapon: '政治',
      armor: '历史',
      mainReason: '生物中的神经系统知识是心理学的重要基础',
      subReason: '政治中的哲学模块培养思辨能力',
      armorReason: '历史中的人类行为案例为心理学提供丰富素材',
      armorTrend: '近3年选科趋势 📈 新兴增长'
    },
    majors: ['心理学', '应用心理学', '社会工作'],
    scores: {
      keyUniversity:  { '生物': 85, '政治': 80, '历史': 78, '语文': 120, '数学': 108, '英语': 118, '总分': 589 },
      normalUniversity: { '生物': 70, '政治': 65, '历史': 62, '语文': 100, '数学': 88, '英语': 98, '总分': 483 }
    },
    hasArtPath: false,
    artPaths: null
  },

  /* ---- 12 记者 ---- */
  {
    id: 'journalist',
    name: '记者',
    emoji: '🎤',
    motto: '记录时代真相',
    doorColor: 'c12',
    doorNum: '12',
    doorSub: '🎤 探索真相',
    scenes: ['📝', '🎥', '📰'],
    bubbles: [
      '"8:00 选题会，确定今日报道方向 📝"',
      '"14:00 现场采访，记录真实的声音 🎥"',
      '"22:00 赶稿截稿，把真相传递给公众 📰"'
    ],
    talentWords: [
      { text: '表达+5', tagClass: 'tag-coral' },
      { text: '逻辑+4', tagClass: 'tag-gold' },
      { text: '共情+3', tagClass: 'tag-green' }
    ],
    matchRate: 80,
    matchStars: 4,
    dimensions: { logic: 65, expression: 90, aesthetic: 40, empathy: 60, handsOn: 30, physical: 45 },
    equipment: {
      mainWeapon: '历史',
      subWeapon: '政治',
      armor: '地理',
      mainReason: '历史培养事实核查和溯源能力，是新闻人的基本功',
      subReason: '政治涉及社会运行逻辑，帮助理解新闻背后的深层原因',
      armorReason: '地理拓展全球视野，对国际新闻报道有帮助',
      armorTrend: '近3年选科趋势 📊 稳定'
    },
    majors: ['新闻学', '传播学', '广播电视学'],
    scores: {
      keyUniversity:  { '历史': 85, '政治': 82, '地理': 78, '语文': 128, '数学': 105, '英语': 118, '总分': 596 },
      normalUniversity: { '历史': 70, '政治': 68, '地理': 62, '语文': 108, '数学': 85, '英语': 98, '总分': 491 }
    },
    hasArtPath: false,
    artPaths: null
  },

  /* ---- 13 厨师 ---- */
  {
    id: 'chef',
    name: '厨师',
    emoji: '🍳',
    motto: '用美食温暖人心',
    doorColor: 'c13',
    doorNum: '13',
    doorSub: '🍳 味蕾艺术',
    scenes: ['🥬', '🔥', '🍽️'],
    bubbles: [
      '"6:00 采购食材，精选最新鲜的 🥬"',
      '"12:00 午市高峰，后厨火力全开 🔥"',
      '"21:00 研发新菜，舌尖上的创造 🍽️"'
    ],
    talentWords: [
      { text: '动手+5', tagClass: 'tag-coral' },
      { text: '审美+4', tagClass: 'tag-gold' },
      { text: '体力+3', tagClass: 'tag-green' }
    ],
    matchRate: 75,
    matchStars: 3,
    dimensions: { logic: 35, expression: 30, aesthetic: 70, empathy: 45, handsOn: 85, physical: 65 },
    equipment: {
      mainWeapon: '化学',
      subWeapon: '生物',
      armor: '物理',
      mainReason: '化学中的分子反应知识是理解烹饪变化的科学基础',
      subReason: '生物中的营养学知识帮助设计健康食谱',
      armorReason: '物理中的热力学知识解释烹饪过程中的能量变化',
      armorTrend: '近3年选科趋势 📊 平稳'
    },
    majors: ['食品科学与工程', '烹饪与营养教育', '酒店管理'],
    scores: {
      keyUniversity:  { '化学': 78, '生物': 75, '物理': 72, '语文': 105, '数学': 100, '英语': 95, '总分': 525 },
      normalUniversity: { '化学': 62, '生物': 60, '物理': 55, '语文': 88, '数学': 82, '英语': 78, '总分': 425 }
    },
    hasArtPath: false,
    artPaths: null
  },

  /* ---- 14 艺术家 ---- */
  {
    id: 'artist',
    name: '艺术家',
    emoji: '🎭',
    motto: '让灵魂自由表达',
    doorColor: 'c14',
    doorNum: '14',
    doorSub: '🎭 自由创作',
    scenes: ['🎨', '🖼️', '🌟'],
    bubbles: [
      '"10:00 工作室独处，颜料与灵感 🎨"',
      '"16:00 画廊布展，每一笔都是表达 🖼️"',
      '"01:00 深夜创作，灵魂最自由的时候 🌟"'
    ],
    talentWords: [
      { text: '审美+5', tagClass: 'tag-coral' },
      { text: '表达+4', tagClass: 'tag-gold' },
      { text: '动手+3', tagClass: 'tag-green' }
    ],
    matchRate: 85,
    matchStars: 4,
    dimensions: { logic: 40, expression: 70, aesthetic: 95, empathy: 60, handsOn: 80, physical: 25 },
    equipment: {
      mainWeapon: '历史',
      subWeapon: '地理',
      armor: '政治',
      mainReason: '历史中的艺术史脉络是理解艺术发展的必修课',
      subReason: '地理中的文化地理学拓展艺术创作的地域视野',
      armorReason: '政治中的哲学模块深化艺术表达的思考层次',
      armorTrend: '近3年选科趋势 📈 艺术类升温'
    },
    majors: ['美术学', '艺术史论', '中国画'],
    scores: {
      keyUniversity:  { '历史': 82, '地理': 78, '政治': 75, '语文': 122, '数学': 95, '英语': 105, '总分': 557 },
      normalUniversity: { '历史': 68, '地理': 62, '政治': 60, '语文': 100, '数学': 78, '英语': 85, '总分': 453 }
    },
    hasArtPath: true,
    artPaths: {
      description: '艺术类专业有普通高考和艺考两条路线。艺考路线对文化课要求较低，但需要参加省联考和（或）目标院校的校考，专业训练需要较长时间投入。',
      routes: [
        {
          name: '美术学',
          联考专业分: '≥ 85/100',
          校考专业分: '≥ 260/300',
          文化课最低分: '≥ 380/750'
        },
        {
          name: '设计学',
          联考专业分: '≥ 80/100',
          校考专业分: '≥ 240/300',
          文化课最低分: '≥ 420/750'
        }
      ]
    }
  },

  /* ---- 15 警察 ---- */
  {
    id: 'police',
    name: '警察',
    emoji: '👮',
    motto: '守护一方平安',
    doorColor: 'c15',
    doorNum: '15',
    doorSub: '👮 守护安宁',
    scenes: ['🚔', '🔍', '🛡️'],
    bubbles: [
      '"7:00 早班交接，了解辖区情况 🚔"',
      '"15:00 案件调查，不放过任何线索 🔍"',
      '"03:00 夜间巡逻，守护这座城市的安宁 🛡️"'
    ],
    talentWords: [
      { text: '体力+5', tagClass: 'tag-coral' },
      { text: '逻辑+4', tagClass: 'tag-gold' },
      { text: '共情+3', tagClass: 'tag-green' }
    ],
    matchRate: 78,
    matchStars: 4,
    dimensions: { logic: 65, expression: 55, aesthetic: 25, empathy: 60, handsOn: 50, physical: 85 },
    equipment: {
      mainWeapon: '政治',
      subWeapon: '物理',
      armor: '历史',
      mainReason: '政治中的法律基础模块是公安工作的理论根基',
      subReason: '物理中的力学/运动学知识对刑侦技术方向有帮助',
      armorReason: '历史中的社会变迁知识帮助理解犯罪预防的宏观背景',
      armorTrend: '近3年选科趋势 📊 稳定'
    },
    majors: ['公安学', '刑事科学技术', '治安学'],
    scores: {
      keyUniversity:  { '政治': 85, '物理': 80, '历史': 78, '语文': 112, '数学': 110, '英语': 108, '总分': 573 },
      normalUniversity: { '政治': 70, '物理': 65, '历史': 62, '语文': 92, '数学': 90, '英语': 88, '总分': 467 }
    },
    hasArtPath: false,
    artPaths: null
  }

];


/* ============================================
   二、测试题目：QUESTIONS 数组（6 题）
   ============================================
   字段说明：
   - id       题目唯一标识
   - qNum     题号（1-6）
   - text     题目文字
   - options  两个选项数组，每项含：
              { emoji, label, sub, dimension, score }
              dimension: 对应的维度（logic/expression/aesthetic/empathy/handsOn/physical）
              score:     该选项得分数值
   ============================================ */

var QUESTIONS = [

  {
    id: 'q1',
    qNum: 1,
    text: '周末你有一整天的自由时间，<br>最想做什么？',
    options: [
      {
        emoji: '🔧',
        label: '拆解/组装东西',
        sub: '研究旧闹钟或拼模型',
        dimension: 'handsOn',
        score: 10
      },
      {
        emoji: '💬',
        label: '和朋友深度聊天',
        sub: '分享最近的思考和感悟',
        dimension: 'expression',
        score: 10
      }
    ]
  },

  {
    id: 'q2',
    qNum: 2,
    text: '看一部电影时，<br>你更容易被什么打动？',
    options: [
      {
        emoji: '🧩',
        label: '精妙的剧情结构',
        sub: '逻辑反转让我拍案叫绝',
        dimension: 'logic',
        score: 10
      },
      {
        emoji: '💧',
        label: '角色的情感变化',
        sub: '人物的内心世界让我共鸣',
        dimension: 'empathy',
        score: 10
      }
    ]
  },

  {
    id: 'q3',
    qNum: 3,
    text: '以下两种活动，<br>哪个更让你感到快乐？',
    options: [
      {
        emoji: '🎨',
        label: '画画或设计海报',
        sub: '沉浸在色彩和构图中',
        dimension: 'aesthetic',
        score: 10
      },
      {
        emoji: '⚽',
        label: '打一场酣畅淋漓的球',
        sub: '享受身体运动的快感',
        dimension: 'physical',
        score: 10
      }
    ]
  },

  {
    id: 'q4',
    qNum: 4,
    text: '面对一道很难的数学题，<br>你倾向于怎么解决？',
    options: [
      {
        emoji: '📝',
        label: '列出所有可能的解法',
        sub: '逐一分析，找到最优解',
        dimension: 'logic',
        score: 10
      },
      {
        emoji: '✂️',
        label: '先动手试试看',
        sub: '在实践中摸索答案',
        dimension: 'handsOn',
        score: 10
      }
    ]
  },

  {
    id: 'q5',
    qNum: 5,
    text: '在小组合作中，<br>你通常扮演什么角色？',
    options: [
      {
        emoji: '📢',
        label: '主动发言，引导讨论',
        sub: '喜欢表达观点推动进度',
        dimension: 'expression',
        score: 10
      },
      {
        emoji: '👂',
        label: '倾听每个人的想法',
        sub: '感受团队氛围再行动',
        dimension: 'empathy',
        score: 10
      }
    ]
  },

  {
    id: 'q6',
    qNum: 6,
    text: '你理想中的假期是<br>什么样的？',
    options: [
      {
        emoji: '🏛️',
        label: '逛美术馆和设计展',
        sub: '沉浸在美感的世界里',
        dimension: 'aesthetic',
        score: 10
      },
      {
        emoji: '⛰️',
        label: '爬山或长途骑行',
        sub: '用身体丈量世界',
        dimension: 'physical',
        score: 10
      }
    ]
  }

];
