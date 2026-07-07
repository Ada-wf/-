const fs = require("fs");
const path = require("path");
const dir = "D:\\求职城市网\\content\\careers\\";

function buildCareer(c) {
  const certLines = c.certifications.map(cert => "  - " + cert).join("\n");
  const relatedLines = (c.relatedCareers || []).map(s => "  - " + s).join("\n");
  const tagLines = c.tags.map(t => "  - " + t).join("\n");
  const respLines = c.responsibilities.map(r => "  - " + r).join("\n");
  const fitLines = c.personalityFit.map(p => "    - " + p).join("\n");
  const skillLines = c.skillsRequired.map(s => "    - " + s).join("\n");

  return `---
slug: ${c.slug}
name: ${c.name}
nameEn: ${c.nameEn}
tagline: ${c.tagline}
categoryPath:
  discipline:
    id: ${c.discipline.id}
    name: ${c.discipline.name}
  school:
    id: ${c.school.id}
    name: ${c.school.name}
  major:
    id: ${c.major.id}
    name: ${c.major.name}
conceptImage:
  url: ""
  alt: ""
  source: manual
salaryRange:
  junior: ${c.salaryJunior}
  senior: ${c.salarySenior}
  source: ${c.salarySource}
educationRequired: ${c.educationRequired}
industryOutlook: ${c.industryOutlook}
certifications:
${certLines}
relatedCareers:
${relatedLines}
tags:
${tagLines}
source: curated
metadata:
  createdAt: "2026-07-07"
  updatedAt: "2026-07-07"
overview: |-
${"  " + c.overview}
responsibilities:
${respLines}
typicalDay: |-
  ${c.typicalDay}
suggestion:
  personalityFit:
${fitLines}
  skillsRequired:
${skillLines}
  summary: >-
    ${c.summary}
  notForYou: ${c.notForYou}
---

## 工作概述

${c.overview}

## 主要职责

${c.responsibilities.join("\n").replace(/\*\*/g, "**")}

## 典型的一天
${c.typicalDay}

## 选择建议

### 适合的性格特质

${c.personalityFit.map(p => "- " + p).join("\n")}

### 需要的能力/技能
${c.skillsRequired.map(s => "- " + s).join("\n")}

### 什么样的人适合选择这个职业

${c.summary}

### 可能不适合的情况
${c.notForYou}
`;
}

const careers = [
  {
    slug: "physicist", name: "物理学家", nameEn: "Physicist",
    tagline: "探索宇宙最基本的运行规律",
    discipline: { id: "science", name: "理学" },
    school: { id: "physics", name: "物理系" },
    major: { id: "physics-pure", name: "物理学" },
    overview: "物理学家研究物质、能量、空间和时间的本质规律。从亚原子粒子的行为到宇宙的演化，物理学家通过理论推导和实验验证不断拓展人类对自然界的认知边界。他们可能在高能物理实验室中寻找新粒子，在凝聚态物理中探索超导材料，或在天体物理中研究黑洞和星系演化。",
    responsibilities: [
      "**理论建模**: 构建物理模型和数学框架解释自然现象",
      "**实验设计**: 设计精密实验方案验证理论预测",
      "**数据分析**: 处理和分析实验或观测数据，提取物理信息",
      "**数值模拟**: 使用计算机模拟复杂物理系统",
      "**学术发表**: 将研究成果撰写为学术论文并在期刊发表",
      "**仪器研发**: 开发和维护高精度科学仪器设备",
    ],
    typicalDay: "上午阅读最新文献和设计实验方案，调试实验设备；下午进行数据采集，分析实验结果，与团队讨论理论解释，撰写科学论文或项目报告",
    tags: ["物理", "研究", "理论", "实验", "科学"],
    certifications: ["无强制要求（博士学位和科研发表更关键）"],
    salaryJunior: "15-25万/年", salarySenior: "40-80万/年",
    salarySource: "2025 年科研院所薪资报告", educationRequired: "博士",
    industryOutlook: "stable",
    personalityFit: ["抽象思维能力极强，能从复杂现象中提炼本质规律", "有数学天赋，享受公式推导和理论分析", "对未知有强烈好奇心，能接受长期探索不见成果", "耐心和毅力强，一个实验可能持续数月甚至数年"],
    skillsRequired: ["扎实的数学基础（微积分、线性代数、群论等）", "物理直觉和理论推演能力", "编程能力（Python/Matlab/C++）", "英文文献阅读和学术写作能力"],
    summary: "如果你仰望星空时会思考宇宙为什么是这样，对自然界的运行法则充满好奇，愿意花费数月甚至数年来解答一个基础科学问题，那么物理学可能是你注定的道路。",
    notForYou: "如果你更倾向于能看到即时成果的工作，或对抽象理论推导感到枯燥乏味，可能需要谨慎考虑这条学术道路。",
    relatedCareers: ["chemist", "materials-scientist"],
  },
  {
    slug: "biologist", name: "生物学家", nameEn: "Biologist",
    tagline: "在生命的世界里解码自然的智慧",
    discipline: { id: "science", name: "理学" },
    school: { id: "life-science", name: "生命科学学院" },
    major: { id: "biology", name: "生物学" },
    overview: "生物学家研究生命的起源、演化、结构和功能。他们可能用显微镜观察细胞的精细结构，用基因编辑技术修改植物基因组，或追踪野外珍稀动物的迁徙路径。现代生物学已从传统的描述性学科转变为以分子和基因为核心的定量科学。",
    responsibilities: [
      "**实验研究**: 设计并执行分子生物学或细胞生物学实验",
      "**野外考察**: 在自然环境中观察和采集生物样本",
      "**基因分析**: 使用测序技术分析DNA和RNA数据",
      "**数据建模**: 用生物信息学工具分析大规模组学数据",
      "**论文发表**: 整理实验数据和研究成果撰写学术论文",
      "**基金申请**: 撰写科研基金申请书获得研究经费支持",
    ],
    typicalDay: "早上检查细胞培养和实验样本，上午进行PCR/测序等分子实验，数据分析，下午阅读文献，指导研究生或助手实验，参加学术讨论会，整理实验记录",
    tags: ["生物学", "研究", "实验", "基因", "生态"],
    certifications: ["无强制要求（直接相关研究经历和发表更重要）"],
    salaryJunior: "12-20万/年", salarySenior: "35-70万/年",
    salarySource: "2025 年生物医药行业薪资报告", educationRequired: "博士",
    industryOutlook: "growth",
    personalityFit: ["对生命现象有发自内心的热爱和好奇心", "实验操作耐心细致，能重复枯燥步骤", "有系统的记录习惯，实验笔记清晰完整", "具备跨学科思维"],
    skillsRequired: ["分子生物学实验技术", "数据分析能力（R/Python）", "英文文献阅读写作能力", "批判性思维和独立研究能力"],
    summary: "如果你对生命是什么这个问题着迷，既愿意在实验室里耐心做实验，又乐于学习编程和数据分析来解读生命密码，现代生物学为你提供了前所未有的广阔舞台。",
    notForYou: "如果你排斥动物实验或无法适应长期处于生物安全环境，可能需要在临床或生态方向中重新定位。",
    relatedCareers: ["chemist", "agricultural-scientist", "bioinformatician"],
  },
  {
    slug: "statistician", name: "统计学家", nameEn: "Statistician",
    tagline: "用数据揭示世界的真实面貌",
    discipline: { id: "science", name: "理学" },
    school: { id: "math", name: "数学科学系" },
    major: { id: "math-applied", name: "数学与应用数学" },
    overview: "统计学家是数据时代的核心角色之一。他们开发和应用统计方法收集、分析和解释数据，帮助各行业从不确定中提取可靠结论。从A/B测试的效果评估到临床试验的数据判定，从经济预测到质量控制，统计学家的身影无处不在。",
    responsibilities: [
      "**实验设计**: 设计调查方案、随机对照试验或抽样策略",
      "**统计分析**: 对各类数据进行描述统计和推断统计分析",
      "**模型构建**: 建立回归模型、贝叶斯模型、时间序列模型等",
      "**数据解读**: 将统计结果转化为可操作的业务洞察和建议",
      "**报告撰写**: 撰写分析报告和数据可视化展示",
      "**方法研发**: 针对新型数据问题开发新的统计方法论",
    ],
    typicalDay: "与业务团队讨论分析需求，数据清洗和预处理，选择合适统计方法建模，编写分析代码，制作图表和报告，向团队汇报分析发现，审查同事的分析方案",
    tags: ["统计", "数据", "分析", "建模", "数学"],
    certifications: ["无强制要求（相关学位和项目经验更重要）"],
    salaryJunior: "15-25万/年", salarySenior: "40-80万/年",
    salarySource: "2025 年数据行业薪资报告", educationRequired: "硕士",
    industryOutlook: "growth",
    personalityFit: ["喜欢数与逻辑，能从中找到乐趣", "审慎严谨，不轻易下结论", "擅长多角度思考，能看到数据背后的种种可能", "有耐心和好奇心深入探索问题的本质"],
    skillsRequired: ["概率论与数理统计理论基础", "编程能力（R/Python/SAS）", "数据可视化能力", "沟通能力：向非技术人员解释复杂统计概念"],
    summary: "如果你享受从看似嘈杂的数据中找到规律的过程，既有数学家的严谨又有侦探般的好奇心，统计学可以让你在几乎所有行业中找到自己的位置。",
    notForYou: "如果你只喜欢确定性的答案，无法接受概率和置信区间这类不确定性表达，统计学会让你感到困扰。",
    relatedCareers: ["data-scientist", "actuarial-analyst"],
  },
  {
    slug: "materials-scientist", name: "材料科学家", nameEn: "Materials Scientist",
    tagline: "设计决定未来的新型材料",
    discipline: { id: "science", name: "理学" },
    school: { id: "chemistry", name: "化学系" },
    major: { id: "chemistry-pure", name: "化学" },
    overview: "材料科学家研究和开发具有特定性能的新型材料，从导电性更强的半导体到更轻更强的航天合金，从可降解的生物材料到自愈合的智能材料。他们是连接基础科学和工程应用的桥梁，推动着从电子设备到航空航天所有技术领域的进步。",
    responsibilities: [
      "**材料设计**: 通过理论计算和实验筛选新型材料配方",
      "**合成制备**: 在实验室合成新材料样品",
      "**性能测试**: 测试材料的力学、热学、电学、光学等性能",
      "**微观表征**: 使用电子显微镜、X射线衍射等分析材料微观结构",
      "**工艺优化**: 优化材料制备工艺，实现从实验室到工业化的转化",
      "**成果转化**: 与工程团队合作将新材料应用于实际产品",
    ],
    typicalDay: "查阅最新材料科学文献，设计材料配方和合成方案，在实验室制备样本，进行性能测试和结构表征，分析测试数据，调整配方参数，参加跨学科项目会议",
    tags: ["材料", "研发", "实验", "纳米", "化学"],
    certifications: ["无强制要求"],
    salaryJunior: "14-22万/年", salarySenior: "35-75万/年",
    salarySource: "2025 年材料行业薪资报告", educationRequired: "博士",
    industryOutlook: "growth",
    personalityFit: ["既喜欢动手实验又享受理论分析", "有跨学科思维", "对材料性能数据敏感", "有耐心进行反复的实验迭代"],
    skillsRequired: ["材料科学基础理论", "材料表征仪器操作", "计算材料学方法", "实验设计和数据分析能力"],
    summary: "如果你既享受在化学实验室合成新材料的动手过程，又对材料的微观结构和宏观性能之间的关系着迷，材料科学是一个连接基础科学与实际应用的前沿领域。",
    notForYou: "如果你对慢速的实验迭代感到不耐烦，或更偏好纯理论研究而非实验操作，材料科学可能会让你感到两边都不满足。",
    relatedCareers: ["chemist", "mechanical-engineer", "semiconductor-engineer"],
  },
  {
    slug: "surgeon", name: "外科医生", nameEn: "Surgeon",
    tagline: "用双手在生命最脆弱的时刻创造奇迹",
    discipline: { id: "medicine", name: "医学" },
    school: { id: "clinical-medicine", name: "医学院" },
    major: { id: "clinical", name: "临床医学" },
    overview: "外科医生通过手术操作治疗疾病和损伤。他们是医疗体系中最高压也是最受尊敬的职业之一。从紧急的创伤处理到精细的微创手术，从心脏搭桥到器官移植，外科医生的双手直接关乎患者的生命和健康。",
    responsibilities: [
      "**术前评估**: 评估患者病情，制定手术方案",
      "**手术操作**: 在主刀或第一助手角色下完成手术",
      "**术后管理**: 管理术后并发症，制定康复方案",
      "**门诊接诊**: 接诊新患者，确定手术必要性",
      "**团队指导**: 指导住院医师和医学生的临床培训",
      "**学术研究**: 开展临床或转化医学研究",
    ],
    typicalDay: "早查房了解术后患者恢复情况，上午进行择期手术，下午门诊接诊新患者，处理住院患者问题，教学查房或学术讨论，晚查房",
    tags: ["医学", "外科", "手术", "临床", "医疗"],
    certifications: ["执业医师资格证", "外科住院医师规范化培训合格证", "外科专科医师资格证"],
    salaryJunior: "15-25万/年", salarySenior: "50-150万/年",
    salarySource: "2025 年医疗行业薪资报告（三甲医院）", educationRequired: "博士",
    industryOutlook: "stable",
    personalityFit: ["手眼协调能力极佳，能完成精细操作", "抗压能力强，在紧急情况下能冷静判断", "有强烈的责任感和抗疲劳能力", "能承受长期不规律作息和高度集中的工作节奏"],
    skillsRequired: ["系统的人体解剖学知识", "扎实的外科基本理论和操作技能", "快速决策和临场应变能力", "良好的团队协作和沟通能力"],
    summary: "如果你有稳定的双手、冷静的头脑和救死扶伤的使命感，能够承受漫长且高压的训练周期，外科医生是一条充满挑战但极有回报的职业道路。",
    notForYou: "如果你无法接受长时间站立手术、无法面对手术失败带来的心理压力，或不适应不规律的作息时间，外科可能不是你的最佳选择。",
    relatedCareers: ["doctor", "anesthesiologist"],
  },
  {
    slug: "pharmacist", name: "药剂师", nameEn: "Pharmacist",
    tagline: "守护用药安全的最后一道关",
    discipline: { id: "medicine", name: "医学" },
    school: { id: "pharmacy", name: "药学院" },
    major: { id: "pharmaceutical", name: "药学" },
    overview: "药剂师是药物管理专家，负责审核处方的合理性和安全性，调配和发放药品，并为患者提供用药指导。他们不仅是发药的人，更是医疗团队中确保用药安全的关键角色，防止药物相互作用和剂量错误。",
    responsibilities: [
      "**处方审核**: 检查处方的合理性、禁忌症和药物相互作用",
      "**药品调配**: 按照处方准确调配药品",
      "**用药指导**: 向患者解释用法用量和注意事项",
      "**药物监测**: 监测患者的药物治疗效果和不良反应",
      "**库存管理**: 管理药房的药品库存和有效期",
      "**临床会诊**: 参与临床科室的用药方案讨论",
    ],
    typicalDay: "核对夜间用药记录和补充药品，审核门诊处方，调配和发放药品，回答患者的用药咨询，与医生讨论用药方案，检查药品库存和质量，参与临床查房",
    tags: ["药学", "医药", "药剂", "临床", "健康"],
    certifications: ["执业药师资格证", "药师专业技术资格证"],
    salaryJunior: "10-18万/年", salarySenior: "25-45万/年",
    salarySource: "2025 年医药行业薪资报告", educationRequired: "本科",
    industryOutlook: "stable",
    personalityFit: ["细致耐心，不放过任何一个小细节", "有强烈的安全意识", "沟通能力好，能有耐心地向患者讲解", "责任心强，能承受工作压力"],
    skillsRequired: ["药理学和临床药学知识", "处方审核和药事管理能力", "药品信息技术和自动化系统操作", "医患沟通技巧"],
    summary: "如果你细心、有责任感，对药物如何影响人体充满兴趣，药剂师是一个稳定且有社会价值的职业。",
    notForYou: "如果你更喜欢快节奏和高压力的工作环境，或者对重复性工作感到枯燥，药剂师的工作节奏可能让你觉得单调。",
    relatedCareers: ["drug-safety-specialist", "chemist"],
  },
  {
    slug: "judge", name: "法官", nameEn: "Judge",
    tagline: "在法律的天平上守护公平正义",
    discipline: { id: "law", name: "法学" },
    school: { id: "law-school", name: "法学院" },
    major: { id: "law-major", name: "法学" },
    overview: "法官是国家司法机关中依法行使审判权的人员。他们通过审理案件，正确适用法律，维护社会公平正义。法官需要深厚的法律功底、卓越的逻辑推理能力和高度的职业操守，在错综复杂的事实和法条之间寻找最优的正义裁决。",
    responsibilities: [
      "**案件审理**: 主持庭审，引导诉讼程序规范进行",
      "**事实认定**: 审查证据材料，准确认定案件事实",
      "**法律适用**: 正确理解和适用相关法律法规",
      "**裁判文书**: 撰写判决书、裁定书等法律文书",
      "**案件调解**: 组织当事人达成调解协议",
      "**业务学习**: 持续学习新法律法规和司法解释",
    ],
    typicalDay: "上午开庭审理案件，休庭后阅卷分析证据，撰写判决书，下午准备次日的庭审提纲，参加审判委员会讨论复杂案件",
    tags: ["法律", "司法", "审判", "公正", "法务"],
    certifications: ["法律职业资格证（A证）", "法官职务任命"],
    salaryJunior: "12-20万/年", salarySenior: "30-50万/年",
    salarySource: "2025 年司法机关薪资标准", educationRequired: "硕士",
    industryOutlook: "stable",
    personalityFit: ["逻辑思维严密，能从纷繁复杂的事实中理清脉络", "公正客观，能排除个人偏见", "心理素质好，能承受案件压力和舆论关注", "有极强的文字表达和说理能力"],
    skillsRequired: ["系统的法学理论知识", "法律条文理解和适用能力", "庭审驾驭和法庭控制能力", "法律文书写作能力"],
    summary: "如果你有正义感、冷静理性，对法律有深厚的兴趣和尊重，愿意在专业和公众监督下工作，法官是一份极具尊严和社会价值的职业。",
    notForYou: "如果你无法承受案件压力，或者希望在职业中有更大的灵活性和自主空间，律师或法务可能更适合你。",
    relatedCareers: ["lawyer", "prosecutor", "legal-consultant"],
  },
  {
    slug: "legal-consultant", name: "法务顾问", nameEn: "Legal Consultant",
    tagline: "为企业经营保驾护航的法律守门人",
    discipline: { id: "law", name: "法学" },
    school: { id: "law-school", name: "法学院" },
    major: { id: "law-major", name: "法学" },
    overview: "法务顾问是公司内部的律师，负责处理企业的所有法律事务。从合同审核到知识产权保护，从劳动纠纷到投资并购，法务顾问在商业决策的每个环节提供法律意见，帮助企业规避风险、合规经营。",
    responsibilities: [
      "**合同管理**: 起草、审核和修改各类商业合同",
      "**合规审查**: 确保公司业务符合法律法规和行业规范",
      "**纠纷处理**: 代表公司处理诉讼、仲裁和调解",
      "**知识产权**: 管理公司商标、专利、著作权等知识产权资产",
      "**法律研究**: 研究相关法律法规变化对公司业务的影响",
      "**员工培训**: 为公司员工提供法律合规培训",
    ],
    typicalDay: "审核销售部门的合作协议草稿，为新产品上市提供合规意见，与外部律师沟通正在处理的诉讼案件进展，参加业务部门会议了解新项目法律需求",
    tags: ["法律", "法务", "企业", "合规", "合同"],
    certifications: ["法律职业资格证（A证）"],
    salaryJunior: "15-25万/年", salarySenior: "40-80万/年",
    salarySource: "2025 年企业法务薪资报告", educationRequired: "本科",
    industryOutlook: "growth",
    personalityFit: ["分析能力强，能快速识别法律风险", "沟通协调能力好，能在法律和商业之间找到平衡", "细心谨慎，注重细节和文本", "有商业意识，理解业务需求"],
    skillsRequired: ["合同法、公司法、劳动法等核心法律知识", "法律研究和文书写作能力", "商业谈判和沟通技能", "风险识别和管理能力"],
    summary: "如果你既懂法律又懂商业，希望在一个更接近业务一线的环境中工作，企业法务是一个兼顾法律专业性和商业参与感的优质选择。",
    notForYou: "如果你对商业运作没有兴趣，或者只希望专注于纯粹的诉讼辩论，律所可能比企业法务更适合你。",
    relatedCareers: ["lawyer", "judge", "compliance-officer"],
  },
  {
    slug: "agricultural-scientist", name: "农业科学家", nameEn: "Agricultural Scientist",
    tagline: "用科技守护十四亿人的粮食安全",
    discipline: { id: "agriculture", name: "农学" },
    school: { id: "agriculture-school", name: "农学院" },
    major: { id: "agronomy", name: "农学" },
    overview: "农业科学家致力于通过科学技术提高农业生产效率和质量。他们培育高产抗病的新品种，研发绿色高效的耕作技术，探索可持续的农业发展模式。在人口增长和气候变化的大背景下，农业科学家的作用日益重要。",
    responsibilities: [
      "**育种研究**: 利用传统育种和分子育种技术培育新品种",
      "**田间试验**: 设计和管理田间试验，收集生长数据",
      "**土壤研究**: 分析土壤成分，研究土壤改良方案",
      "**病虫害防治**: 研究和推广病虫害绿色防控技术",
      "**技术推广**: 将研究成果转化为农民可用的技术方案",
      "**政策建议**: 为农业政策制定提供科学依据",
    ],
    typicalDay: "早晨出发去试验田观察作物生长情况，采集样本，回到实验室分析数据，记录田间管理日志，下午处理实验室样本，阅读最新农业科学文献，准备农业技术培训材料",
    tags: ["农业", "育种", "土壤", "植物", "粮食"],
    certifications: ["无强制要求"],
    salaryJunior: "10-16万/年", salarySenior: "25-50万/年",
    salarySource: "2025 年农业科研单位薪资报告", educationRequired: "硕士",
    industryOutlook: "growth",
    personalityFit: ["热爱自然和户外工作", "有耐心观察和记录植物生长细节", "能将理论知识与田间实践结合", "关心粮食安全和农业可持续发展"],
    skillsRequired: ["作物学和遗传育种知识", "田间试验设计和管理能力", "生物统计和数据分析技能", "农业技术推广和科普能力"],
    summary: "如果你热爱大自然，希望能把实验室的成果真正种在地里、端上餐桌，农业科学家可以让你在科研和田间之间找到独特的职业满足感。",
    notForYou: "如果你不喜欢户外工作，或者无法接受农忙季节需要早出晚归的节奏，农业科学研究可能不适合你。",
    relatedCareers: ["biologist", "agronomist", "crop-specialist"],
  },
  {
    slug: "bioinformatician", name: "生物信息学家", nameEn: "Bioinformatician",
    tagline: "用计算解码生命的天书",
    discipline: { id: "cross-disciplinary", name: "交叉学科" },
    school: { id: "cross-school", name: "交叉信息研究院" },
    major: { id: "bioinformatics", name: "生物信息学" },
    overview: "生物信息学家站在生物学和计算机科学的交叉路口，开发和应用计算方法来分析生物数据。从人类基因组序列的解读到蛋白质结构的预测，从药物分子的虚拟筛选到群体遗传学的研究，生物信息学是现代生命科学不可或缺的计算引擎。",
    responsibilities: [
      "**序列分析**: 分析DNA、RNA和蛋白质序列数据",
      "**基因组组装**: 将测序片段组装为完整的基因组序列",
      "**结构预测**: 使用计算方法预测蛋白质的三维结构",
      "**数据库开发**: 构建和维护生物信息数据库",
      "**算法设计**: 开发新的生物信息学算法和分析工具",
      "**合作研究**: 与实验生物学家合作分析实验数据",
    ],
    typicalDay: "登录服务器检查分析流程运行状态，处理新一批测序数据，编写数据处理脚本，将分析结果可视化，与生物学家讨论数据解读，优化分析算法和流程",
    tags: ["生物信息", "基因组", "计算生物", "数据", "算法"],
    certifications: ["无强制要求"],
    salaryJunior: "18-30万/年", salarySenior: "45-90万/年",
    salarySource: "2025 年生物科技行业薪资报告", educationRequired: "硕士",
    industryOutlook: "growth",
    personalityFit: ["既懂生物学又热爱编程", "擅长定量分析和统计思维", "能理解实验生物学家的语言和需求", "有解决复杂跨学科问题的兴趣"],
    skillsRequired: ["生物学基础知识", "编程能力（Python/R/Perl）", "统计和机器学习方法", "Linux系统和生物信息工具使用"],
    summary: "如果你既被生命科学的奥秘吸引又不愿意放弃编程的快感，生物信息学是完美的交叉赛道，用代码解读生命、用数据推进医学。",
    notForYou: "如果你对生物学原理缺乏兴趣，或者只想做纯计算机工作而不想理解背后的生物学问题，这个职业可能让你找不到动力。",
    relatedCareers: ["data-scientist", "computational-biologist"],
  },
  {
    slug: "hr-specialist", name: "人力资源专家", nameEn: "HR Specialist",
    tagline: "为企业找到最对的人，帮人才找到最好的舞台",
    discipline: { id: "social-sciences", name: "社会科学" },
    school: { id: "sociology", name: "社会科学学院" },
    major: { id: "sociology-major", name: "社会学" },
    overview: "人力资源专家负责管理组织的人才生命周期，从招聘选拔到培训发展，从绩效管理到薪酬福利。他们是员工和公司之间的桥梁，既要理解业务战略对人才的需求，又要关注员工的职业发展和满意度。",
    responsibilities: [
      "**招聘管理**: 制定招聘计划，发布职位，筛选简历，组织面试",
      "**员工关系**: 处理员工入职、转正、调岗、离职等流程",
      "**培训发展**: 设计和组织员工培训项目，搭建人才梯队",
      "**绩效管理**: 推动绩效考核流程，提供绩效反馈建议",
      "**薪酬福利**: 参与薪酬调研和福利方案设计",
      "**文化建设**: 推动企业文化和团队建设活动",
    ],
    typicalDay: "处理各部门的招聘需求，筛选简历并安排面试，参加业务部门人力规划会议，跟进新员工入职流程，处理员工咨询和问题，更新人事制度和流程文档",
    tags: ["人力资源", "招聘", "培训", "员工关系", "管理"],
    certifications: ["企业人力资源管理师（中级/高级）"],
    salaryJunior: "10-18万/年", salarySenior: "30-60万/年",
    salarySource: "2025 年人力资源行业薪资报告", educationRequired: "本科",
    industryOutlook: "stable",
    personalityFit: ["善于与人沟通和建立信任关系", "有同理心，能理解不同人的需求和顾虑", "逻辑清晰，能处理复杂的人事程序", "有保密意识，能处理敏感信息"],
    skillsRequired: ["劳动法和人事政策知识", "招聘面试和人才评估技巧", "数据分析能力", "沟通和冲突处理能力"],
    summary: "如果你喜欢与人打交道，希望在组织中扮演连接人才和业务的关键角色，既能做伯乐又能做桥梁，HR是一个专业性强且富有成就感的选择。",
    notForYou: "如果你不喜欢处理繁琐的行政程序和大量文案工作，或在面对冲突和裁员等棘手场景时会感到极度不适，可能需要重新考虑。",
    relatedCareers: ["career-coach", "operations-manager", "public-relations-specialist"],
  },
  {
    slug: "social-worker", name: "社会工作者", nameEn: "Social Worker",
    tagline: "用专业和爱心温暖社会的每一个角落",
    discipline: { id: "social-sciences", name: "社会科学" },
    school: { id: "sociology", name: "社会科学学院" },
    major: { id: "sociology-major", name: "社会学" },
    overview: "社会工作者是专业的助人者，运用社会工作专业知识和技能，为有需要的个人、家庭、群体和社区提供支持和服务。从儿童保护到老年关怀，从心理疏导到社区发展，社会工作在构建和谐社会过程中发挥着不可替代的作用。",
    responsibilities: [
      "**个案工作**: 为有需要的个人和家庭提供一对一服务",
      "**小组活动**: 组织和支持互助小组、兴趣小组等活动",
      "**社区服务**: 开展社区需求评估和社区发展项目",
      "**资源链接**: 对接政府、慈善机构和社会资源",
      "**危机干预**: 在突发事件中提供心理援助和干预服务",
      "**政策倡导**: 为弱势群体发声，推动相关政策改善",
    ],
    typicalDay: "早上了解服务对象的最新情况，入户探访有困难的家庭或个人，整理面谈记录和评估报告，下午组织社区活动或小组活动，电话跟进正在服务的个案，参加机构案例督导会",
    tags: ["社工", "公益", "社区", "服务", "心理"],
    certifications: ["全国社会工作者职业水平考试"],
    salaryJunior: "8-14万/年", salarySenior: "18-35万/年",
    salarySource: "2025 年社会工作行业薪资报告", educationRequired: "本科",
    industryOutlook: "growth",
    personalityFit: ["有强烈的社会责任感和利他精神", "情绪稳定，能承受与他人痛苦共情的心理负担", "沟通和倾听能力突出", "有耐心，服务对象的改变往往需要很长时间"],
    skillsRequired: ["社会工作理论和方法", "心理疏导和危机干预技巧", "项目策划和管理能力", "资源整合和协调沟通能力"],
    summary: "如果你希望自己的工作能直接帮助到有困难的人，不追求高薪而追求社会价值，社会工作是能给你带来深度职业满足感的职业。",
    notForYou: "如果你无法承受面对苦难和社会不公带来的心理压力，或者期望较高的经济回报，社会工作可能需要极大的心理准备和使命感。",
    relatedCareers: ["psychologist", "counselor", "ngo-manager"],
  },
  {
    slug: "editor", name: "编辑", nameEn: "Editor",
    tagline: "用文字的力量塑造思想和文化",
    discipline: { id: "humanities", name: "人文学科" },
    school: { id: "chinese-lit", name: "人文学院" },
    major: { id: "chinese-language", name: "汉语言文学" },
    overview: "编辑是内容创作的把关人和优化者。他们审读稿件，修正错误，优化结构，提升文本质量和可读性。无论是图书出版、新闻媒体还是数字内容平台，编辑都承载着传播优质内容、引导公共议题的责任。",
    responsibilities: [
      "**稿件审读**: 评估稿件的质量、价值和出版可行性",
      "**文本编辑**: 修改语法错误、润色文字、优化结构",
      "**内容策划**: 策划选题方向，约稿和组稿",
      "**作者沟通**: 与作者讨论修改方向和稿件进度",
      "**校对审核**: 确保最终内容的准确性和规范性",
      "**读者反馈**: 分析阅读数据和读者反馈优化内容策略",
    ],
    typicalDay: "审读新收到的稿件并写修改意见，与作者电话沟通编辑建议，修改和润色待发稿，参加选题策划会讨论下期内容，校对排版清样，整理读者反馈数据",
    tags: ["编辑", "出版", "写作", "内容", "文化"],
    certifications: ["出版专业技术人员职业资格"],
    salaryJunior: "10-16万/年", salarySenior: "25-45万/年",
    salarySource: "2025 年出版传媒行业薪资报告", educationRequired: "本科",
    industryOutlook: "stable",
    personalityFit: ["文字敏感度高，有良好的语感和审美", "知识面广，对多领域有好奇心", "有耐心，能反复推敲文字细节", "逻辑清晰，能发现文本中的论证漏洞"],
    skillsRequired: ["优秀的文字功底和语言表达能力", "较强的学科知识和常识储备", "选题策划和市场判断力", "良好的沟通和时间管理能力"],
    summary: "如果你热爱文字、享受打磨作品的成就感，希望在文化传播领域发挥自己的影响力，编辑是一个让你与优秀思想和内容深度接触的职业。",
    notForYou: "如果你对长期伏案阅读和修改文字感到枯燥，或更追求高薪和快节奏的行业氛围，传统编辑工作可能让你感到节奏偏慢。",
    relatedCareers: ["journalist", "content-strategist", "copywriter"],
  },
  {
    slug: "game-artist", name: "游戏美术设计师", nameEn: "Game Artist",
    tagline: "用画笔和想象力创造虚拟世界的灵魂",
    discipline: { id: "arts", name: "艺术学" },
    school: { id: "academy-of-arts", name: "美术学院" },
    major: { id: "animation", name: "动画" },
    overview: "游戏美术设计师是游戏世界的外观塑造者。从角色造型到场景氛围，从UI界面到特效表现，他们用视觉语言为玩家带来沉浸式的体验。游戏美术融合了传统绘画功底、3D建模技术和电影级光影设计，是艺术与技术的完美结合。",
    responsibilities: [
      "**概念设计**: 绘制角色、场景、道具的概念草图",
      "**3D建模**: 使用Maya/Blender等软件创建3D模型",
      "**贴图绘制**: 制作角色和场景的材质贴图",
      "**场景搭建**: 在游戏引擎中布局场景环境和灯光",
      "**特效制作**: 设计技能特效、粒子效果等视觉表现",
      "**资源优化**: 优化美术资源性能，确保流畅运行",
    ],
    typicalDay: "与策划和程序员沟通美术需求，绘制角色概念草图，在建模软件中制作3D模型，烘焙贴图，在游戏引擎中调整材质和灯光，导入测试，根据反馈修改迭代",
    tags: ["游戏", "美术", "设计", "3D", "动画"],
    certifications: ["无强制要求（作品集才是最好的通行证）"],
    salaryJunior: "12-22万/年", salarySenior: "35-70万/年",
    salarySource: "2025 年游戏行业薪资报告", educationRequired: "大专",
    industryOutlook: "stable",
    personalityFit: ["绘画和造型基础扎实", "对游戏有极大的热情，了解各类游戏的视觉风格", "能够接受反复修改的创作过程", "有持续的自我学习和提升动力"],
    skillsRequired: ["扎实的绘画和造型功底", "3D建模和贴图制作技能", "游戏引擎使用经验（Unity/Unreal）", "色彩和光影设计能力"],
    summary: "如果你热爱游戏又痴迷于视觉创作，希望自己画的角色能在几百万玩家面前动起来，游戏美术是艺术与流行文化交汇处最令人兴奋的职业之一。",
    notForYou: "如果你不喜欢根据他人反馈反复修改自己的作品，或更偏向自由创作而非为量产游戏服务，独立游戏开发或纯艺术道路可能更适合你。",
    relatedCareers: ["animator", "graphic-designer", "ui-designer"],
  },
  {
    slug: "economic-analyst", name: "经济分析师", nameEn: "Economic Analyst",
    tagline: "从宏观数据中预判经济的潮汐方向",
    discipline: { id: "economics", name: "经济学" },
    school: { id: "econ-school", name: "经济系" },
    major: { id: "economics-major", name: "经济学" },
    overview: "经济分析师跟踪和分析宏观经济运行态势，为政府决策和企业战略提供经济预测和政策建议。他们解读GDP、CPI、PMI等关键经济指标，分析财政政策和货币政策的影响，帮助决策者理解经济运行的深层逻辑。",
    responsibilities: [
      "**数据追踪**: 持续跟踪国内外宏观经济数据和市场动态",
      "**趋势分析**: 分析经济周期和行业发展趋势",
      "**报告撰写**: 撰写经济分析报告和专题研究文章",
      "**预测建模**: 建立经济计量模型预测经济走向",
      "**政策评估**: 评估财政政策、货币政策的效果和影响",
      "**内部咨询**: 为投资部门或业务部门提供经济环境分析支持",
    ],
    typicalDay: "早间阅读全球市场动态和经济数据发布，更新经济预测模型，撰写当天的重要经济事件快评，参加团队讨论会，深入分析一个专题，准备给投资委员会的季度经济展望报告",
    tags: ["经济", "分析", "宏观", "金融市场", "政策"],
    certifications: ["经济专业技术资格", "CFA（注册金融分析师，可选加分）"],
    salaryJunior: "15-25万/年", salarySenior: "40-100万/年",
    salarySource: "2025 年金融行业薪资报告", educationRequired: "硕士",
    industryOutlook: "stable",
    personalityFit: ["对经济新闻和数据有天然的好奇心", "能从大量数据中提炼出关键趋势", "有较强的逻辑推理和批判性思维", "文字表达清晰，能向非专业人士解释复杂经济问题"],
    skillsRequired: ["宏观经济理论和经济学基础", "经济计量学和统计方法", "数据分析工具（Python/R/Stata/EViews）", "报告撰写和公开演讲能力"],
    summary: "如果你关注新闻时总是忍不住想分析背后的经济逻辑，希望用专业的经济学知识解读和预测这个世界的变化，经济分析师给你一个在数据和决策之间的有利位置。",
    notForYou: "如果你对数字和统计不敏感，或者更偏好微观层面的具体工作而非宏观趋势分析，投行或企业财务可能更适合你。",
    relatedCareers: ["economist", "financial-analyst", "policy-analyst"],
  },
  {
    slug: "financial-analyst", name: "财务分析师", nameEn: "Financial Analyst",
    tagline: "穿透数字看清企业的真实价值",
    discipline: { id: "management", name: "管理学" },
    school: { id: "econ-management", name: "经济管理学院" },
    major: { id: "accounting", name: "会计学" },
    overview: "财务分析师通过分析公司财务报表、行业数据和市场趋势，评估企业的财务健康状况和投资价值。他们是连接公司业绩和资本市场的桥梁，为投资决策提供关键的数据支持和分析观点。",
    responsibilities: [
      "**财报分析**: 分析公司财务报表，评估盈利能力、偿债能力和成长性",
      "**估值建模**: 建立财务模型，进行公司估值和投资分析",
      "**行业研究**: 跟踪行业动态，分析行业竞争格局和趋势",
      "**投资建议**: 基于分析结果提出投资建议",
      "**尽职调查**: 参与并购重组项目的财务尽职调查",
      "**客户沟通**: 向投资经理或客户汇报分析结论",
    ],
    typicalDay: "开盘前阅读公司公告和行业新闻，更新财务预测模型，撰写公司分析报告，参加晨会分享观点，与管理层进行电话会议，下午深入挖掘一个细分行业的最新数据变动",
    tags: ["财务", "分析", "投资", "金融", "估值"],
    certifications: ["CPA（注册会计师）", "CFA（注册金融分析师）"],
    salaryJunior: "15-28万/年", salarySenior: "45-120万/年",
    salarySource: "2025 年金融行业薪资报告", educationRequired: "本科",
    industryOutlook: "stable",
    personalityFit: ["对数字敏感，能从财务报表中读出故事", "有好奇心，喜欢深入挖掘企业运营的细节", "逻辑严密，能构建自洽的分析框架", "抗压能力强，能在截止日期压力下交付高质量成果"],
    skillsRequired: ["会计学和财务管理知识", "财务建模和估值方法", "Excel高级技能和数据分析工具", "行业研究和信息收集能力"],
    summary: "如果你能从分析一个公司的财务数据中找到侦探破案般的乐趣，享受用数字讲商业故事的快感，财务分析是进入金融世界的经典入口。",
    notForYou: "如果你对财务报表和数字驱动的分析方式感到枯燥，或无法适应高强度的工作节奏和频繁的deadline，需要重新考虑是否适合这个行业。",
    relatedCareers: ["accountant", "investment-banker", "auditor"],
  },
];

for (const c of careers) {
  fs.writeFileSync(path.join(dir, c.slug + ".md"), buildCareer(c), "utf-8");
  console.log("Created: " + c.slug + ".md");
}
console.log("Done! " + careers.length + " files created.");
