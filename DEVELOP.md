# 求职城市网 — 开发文档

> **版本**: v1.1
> **创建日期**: 2026-07-06
> **最后更新**: 2026-07-06
> **技术栈**: Next.js 15+ + TypeScript + Tailwind CSS + AntV G6

---

## 一、项目概述

### 1.1 产品定位

一个以**清华大学学科体系**为分类框架的职业百科网站，帮助用户（尤其是高中生、大学生、转行者）探索不同职业的样貌、工作内容和适配人群。

### 1.2 核心功能

| 编号 | 功能 | 描述 |
|------|------|------|
| F1 | 首页随机职业卡片 | 每次访问/刷新随机展示职业角色卡（类似淘宝商品卡），含概念图 + 工作概述；支持按学科门类筛选；浏览历史加权推荐 |
| F2 | 清华学科分类导航 | 按清华大学 12 大学科门类 → 33 个学院 → 93 个本科专业 → 400+ 职业 四级分类 |
| F3 | 思维导图导航 | 点击分类后展示交互式思维导图，节点可展开/收起；移动端使用渐进展开层级列表 |
| F4 | 职业详情页 | 职业角色概念图 + 快速决策卡（薪资/学历/前景）+ 工作内容概述 + 选择建议 + 相似职业对比 |
| F5 | 站内搜索 | 搜索已有职业，即时匹配；Phase 2 升级为全文本搜索引擎 |
| F6 | 动态 AI 补全 | 搜索未命中的职业，自动上网查询 → AI 整合 → 内容审核 → 生成概念图 → 站内展示 → 持久化 |

### 1.3 用户画像

- **主要用户**: 高中生（选专业/选职业）、大学生（职业规划）、转行人群
- **次要用户**: 家长、职业规划师

---

## 二、技术架构

### 2.1 总体架构

```
┌─────────────────────────────────────────────────────────┐
│                      部署层                              │
│              Vercel (免费层，自带 CI/CD)                  │
├─────────────────────────────────────────────────────────┤
│                      前端层                              │
│  Next.js 15+ (App Router) + TypeScript                  │
│  ├── 静态生成 (SSG): 首页 / 分类页 / 详情页              │
│  ├── 服务端渲染 (SSR): 搜索页 (SEO 友好)                 │
│  └── 客户端渲染 (CSR): 思维导图交互 / 动态搜索            │
├─────────────────────────────────────────────────────────┤
│                     API 层 (Serverless)                   │
│  /api/search        → 站内搜索                           │
│  /api/ai-generate   → 动态 AI 职业生成 (SSE 流式)        │
│  /api/feedback      → 用户反馈                           │
│  中间件: 速率限制 (Upstash Ratelimit) + CSP 安全策略      │
├─────────────────────────────────────────────────────────┤
│                      数据层                              │
│  ├── 职业数据: Markdown 文件 (Git 管理，Velite 编译)     │
│  ├── 分类数据: YAML 文件 (清华学科体系)                   │
│  ├── 用户新增: Vercel KV / Upstash Redis                 │
│  └── 图片资源: Cloudinary CDN (AI 生成图 + 概念图)       │
├─────────────────────────────────────────────────────────┤
│                     AI 服务层                             │
│  ├── Web Search: Tavily Search API                      │
│  ├── 文本生成: Claude API (Opus 4 / Sonnet)              │
│  ├── 图片生成: DALL·E 3 (主) / Replicate Flux (备)       │
│  └── 内容审核: Claude 二次校验 (质量 + 安全)              │
└─────────────────────────────────────────────────────────┘
```

### 2.2 技术选型理由

| 技术 | 理由 |
|------|------|
| **Next.js 15+ App Router** | SSR + SSG 混合，SEO 友好，Serverless API 内建，Vercel 一键部署；Turbopack 显著提升开发体验 |
| **TypeScript** | 类型安全，数据模型复杂时尤其重要 |
| **Tailwind CSS** | 快速构建响应式 UI，淘宝卡片风易于实现；内建 `dark:` 变体支持暗色模式 |
| **AntV G6** | 国内最成熟的图可视化库，思维导图 TreeGraph 开箱即用 |
| **Velite** (替代 Contentlayer) | Contentlayer 已停止维护（2023年），Velite 是活跃的替代品，同样支持类型安全的 Markdown 编译 |
| **Cloudinary** | 图片 CDN + AI 裁剪 + WebP 自动转换，免费层 25GB |
| **Vercel KV** | Serverless Redis，存储动态新增职业，免费层够用 |
| **Claude API** | 文本质量最高，结构化输出稳定 |
| **DALL·E 3** (主) / **Replicate Flux** (备) | DALL·E 3 概念图一致性最好；Flux 作为降级备选，成本更低 ($0.01/张 vs $0.04/张) |
| **Fuse.js** (Phase 1) / **Meilisearch** (Phase 2) | 初期轻量模糊搜索；职业数量增长后升级为全文本搜索引擎 |

### 2.3 目录结构

```
D:\求职城市网\
├── README.md
├── DEVELOP.md                        # 本文件
├── CLAUDE.md                         # Claude Code 搭子配置
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── velite.config.ts                  # Velite 配置 (替代 contentlayer.config.ts)
│
├── content/                          # 职业数据 (Markdown，Git 管理)
│   ├── categories/                   # 清华学科分类定义
│   │   └── tsinghua-categories.yaml
│   └── careers/                      # 每个职业一个 .md 文件 (平铺，不按学科分目录)
│       ├── software-engineer.md
│       ├── data-scientist.md
│       ├── ...                       # 代码读取依赖 frontmatter categoryPath，不依赖目录结构
│
├── scripts/                          # 工具脚本
│   ├── validate-content.ts           # 校验所有 Markdown 文件格式
│   └── generate-images.ts            # 批量生成职业概念图
│
├── tests/
│   ├── unit/                         # 组件单元测试 (Vitest + Testing Library)
│   └── e2e/                          # E2E 冒烟测试 (Playwright)
│
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI: lint + typecheck + test
│
├── public/
│   └── images/
│       └── careers/                  # 静态概念图 (初始职业)
│
├── src/
│   ├── app/                          # Next.js App Router 页面
│   │   ├── layout.tsx                # 全局布局 (导航栏 + 页脚 + 暗色模式切换)
│   │   ├── page.tsx                  # 首页 (随机职业卡片)
│   │   ├── categories/
│   │   │   ├── page.tsx              # 分类总览页
│   │   │   └── [category]/           # 动态路由
│   │   │       └── page.tsx          # 思维导图导航页
│   │   ├── career/
│   │   │   └── [slug]/               # 动态路由
│   │   │       └── page.tsx          # 职业详情页
│   │   ├── search/
│   │   │   └── page.tsx              # 搜索结果页 (含 AI 生成入口)
│   │   └── api/
│   │       ├── search/
│   │       │   └── route.ts          # GET /api/search?q=xxx
│   │       ├── ai-generate/
│   │       │   └── route.ts          # POST /api/ai-generate
│   │       └── feedback/
│   │           └── route.ts          # POST /api/feedback
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # 顶部导航 (Logo + 搜索框 + 分类入口 + 暗色模式开关)
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   ├── CareerCardGrid.tsx    # 卡片网格容器
│   │   │   ├── CareerCard.tsx        # 单个职业角色卡
│   │   │   ├── HeroBanner.tsx        # 首页横幅
│   │   │   └── CategoryFilter.tsx    # 学科门类筛选下拉
│   │   ├── category/
│   │   │   ├── MindMap.tsx           # 桌面端思维导图组件 (G6)
│   │   │   ├── CategoryTree.tsx      # 移动端渐进展开层级列表
│   │   │   └── CategoryBreadcrumb.tsx
│   │   ├── career/
│   │   │   ├── CareerHero.tsx        # 概念图 + 名称区
│   │   │   ├── CareerDecisionCard.tsx # 快速决策卡 (薪资/学历/前景)
│   │   │   ├── CareerOverview.tsx    # 工作内容概述
│   │   │   ├── CareerSuggestion.tsx  # 选择建议
│   │   │   ├── CareerCompare.tsx     # 相似职业对比
│   │   │   └── CareerBreadcrumb.tsx
│   │   ├── search/
│   │   │   ├── SearchBox.tsx
│   │   │   ├── SearchResultCard.tsx
│   │   │   ├── AIGeneratePanel.tsx   # AI 生成中/完成状态面板
│   │   │   └── AIDisclaimer.tsx      # AI 内容免责声明标记
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       └── ThemeToggle.tsx       # 暗色模式切换按钮
│   │
│   ├── lib/
│   │   ├── careers.ts               # 职业数据读取 (Velite 编译后)
│   │   ├── categories.ts            # 分类数据读取
│   │   ├── search.ts                # 站内搜索逻辑 (本地 Fuse.js + KV)
│   │   ├── ai-generate.ts           # AI 职业生成核心逻辑 (含审核步骤)
│   │   ├── cloudinary.ts            # Cloudinary 图片上传
│   │   └── security.ts              # 安全: rate limit / content filter / audit log
│   │
│   ├── types/
│   │   ├── career.ts                # 职业数据类型定义
│   │   └── category.ts              # 分类类型定义
│   │
│   └── styles/
│       └── globals.css              # 全局样式 + Tailwind + 暗色模式变量
│
└── public/
    └── assets/
        └── brand/                   # Logo / favicon 等
```

---

## 三、数据模型设计

### 3.1 分类体系 (categories)

```typescript
// src/types/category.ts

/** 学科门类 */
interface DisciplineCategory {
  id: string;                // "engineering"
  name: string;              // "工学"
  description: string;       // 门类简介
  icon: string;              // 图标 (Lucide icon name)
  color: string;             // 主题色 "#2563EB"
  schools: School[];
}

/** 学院/系 */
interface School {
  id: string;                // "computer-science"
  name: string;              // "计算机科学与技术系"
  disciplineId: string;      // "engineering"
  majors: Major[];
}

/** 本科专业 */
interface Major {
  id: string;                // "software-engineering"
  name: string;              // "软件工程"
  schoolId: string;          // "computer-science"
  description: string;       // 专业简介
  careerSlugs: string[];     // 关联的职业 slug 列表
}
```

**分类数据文件** (`content/categories/tsinghua-categories.yaml`):

```yaml
# 清华大学 12 大学科门类 → 33 个学院 → 93 个本科专业 → 400+ 职业
# 完整分类数据（含全部 12 门类）

disciplines:
  # ===== 1. 理学 =====
  - id: science
    name: 理学
    description: 研究自然现象基本规律的基础学科
    icon: flask-conical
    color: "#2563EB"
    schools:
      - id: math
        name: 数学科学系
        disciplineId: science
        majors:
          - id: math-applied
            name: 数学与应用数学
            schoolId: math
            description: 培养具有扎实数学基础和解决实际问题能力的专业人才
            careerSlugs:
              - data-scientist
              - quantitative-analyst
              - statistician
              - math-teacher
              - actuarial-analyst
      - id: physics
        name: 物理系
        disciplineId: science
        majors:
          - id: physics-pure
            name: 物理学
            schoolId: physics
            description: 研究物质运动最一般规律和物质基本结构
            careerSlugs:
              - physicist
              - optics-engineer
              - semiconductor-engineer
              - physics-teacher
      - id: chemistry
        name: 化学系
        disciplineId: science
        majors:
          - id: chemistry-pure
            name: 化学
            schoolId: chemistry
            description: 研究物质组成、结构、性质与变化规律
            careerSlugs:
              - chemist
              - chemical-analyst
              - materials-scientist
              - chemistry-teacher
      - id: life-science
        name: 生命科学学院
        disciplineId: science
        majors:
          - id: biology
            name: 生物科学
            schoolId: life-science
            description: 研究生命现象和生命活动规律
            careerSlugs:
              - biologist
              - biotechnologist
              - geneticist
              - biology-teacher

  # ===== 2. 工学 =====
  - id: engineering
    name: 工学
    description: 应用自然科学原理解决实际问题的工程学科
    icon: wrench
    color: "#DC2626"
    schools:
      - id: computer-science
        name: 计算机科学与技术系
        disciplineId: engineering
        majors:
          - id: cs-core
            name: 计算机科学与技术
            schoolId: computer-science
            careerSlugs:
              - software-engineer
              - fullstack-developer
              - devops-engineer
              - database-administrator
              - systems-architect
          - id: software-engineering
            name: 软件工程
            schoolId: computer-science
            careerSlugs:
              - software-engineer
              - mobile-developer
              - qa-engineer
              - scrum-master
              - frontend-engineer
          - id: ai
            name: 人工智能
            schoolId: computer-science
            careerSlugs:
              - ai-engineer
              - machine-learning-engineer
              - nlp-scientist
              - computer-vision-engineer
              - prompt-engineer
      - id: electronic-engineering
        name: 电子工程系
        disciplineId: engineering
        majors:
          - id: ee-core
            name: 电子信息工程
            schoolId: electronic-engineering
            careerSlugs:
              - electronics-engineer
              - embedded-systems-engineer
              - iot-engineer
              - telecommunications-engineer
      - id: mechanical-engineering
        name: 机械工程系
        disciplineId: engineering
        majors:
          - id: me-core
            name: 机械工程
            schoolId: mechanical-engineering
            careerSlugs:
              - mechanical-engineer
              - automotive-engineer
              - robotics-engineer
              - manufacturing-engineer
      - id: civil-engineering
        name: 土木工程系
        disciplineId: engineering
        majors:
          - id: civil-core
            name: 土木工程
            schoolId: civil-engineering
            careerSlugs:
              - civil-engineer
              - structural-engineer
              - construction-manager
              - surveyor

  # ===== 3. 医学 =====
  - id: medicine
    name: 医学
    description: 研究人体健康与疾病的防治
    icon: stethoscope
    color: "#059669"
    schools:
      - id: clinical-medicine
        name: 医学院
        disciplineId: medicine
        majors:
          - id: clinical
            name: 临床医学
            schoolId: clinical-medicine
            careerSlugs:
              - doctor
              - surgeon
              - pediatrician
              - psychiatrist
              - anesthesiologist
      - id: pharmacy
        name: 药学院
        disciplineId: medicine
        majors:
          - id: pharmaceutical
            name: 药学
            schoolId: pharmacy
            careerSlugs:
              - pharmacist
              - pharmaceutical-researcher
              - clinical-pharmacist
              - drug-safety-specialist
      - id: nursing
        name: 护理学院
        disciplineId: medicine
        majors:
          - id: nursing-major
            name: 护理学
            schoolId: nursing
            careerSlugs:
              - registered-nurse
              - nurse-practitioner
              - community-health-nurse

  # ===== 4. 管理学 =====
  - id: management
    name: 管理学
    description: 研究组织管理与资源优化配置
    icon: briefcase
    color: "#7C3AED"
    schools:
      - id: econ-management
        name: 经济管理学院
        disciplineId: management
        majors:
          - id: accounting
            name: 会计学
            schoolId: econ-management
            careerSlugs:
              - accountant
              - auditor
              - tax-consultant
              - financial-analyst
          - id: business-admin
            name: 工商管理
            schoolId: econ-management
            careerSlugs:
              - management-consultant
              - product-manager
              - business-analyst
              - entrepreneur
              - operations-manager
          - id: finance
            name: 金融学
            schoolId: econ-management
            careerSlugs:
              - investment-banker
              - securities-analyst
              - risk-manager
              - fund-manager
              - financial-advisor
      - id: public-management
        name: 公共管理学院
        disciplineId: management
        majors:
          - id: public-admin
            name: 公共管理
            schoolId: public-management
            careerSlugs:
              - civil-servant
              - public-policy-analyst
              - ngo-manager
              - urban-planner

  # ===== 5. 人文学科 =====
  - id: humanities
    name: 人文学科
    description: 研究人类文化与精神世界
    icon: book-open
    color: "#D97706"
    schools:
      - id: chinese-lit
        name: 人文学院
        disciplineId: humanities
        majors:
          - id: chinese-language
            name: 汉语言文学
            schoolId: chinese-lit
            careerSlugs:
              - editor
              - journalist
              - copywriter
              - chinese-teacher
              - content-strategist
          - id: history
            name: 历史学
            schoolId: chinese-lit
            careerSlugs:
              - historian
              - museum-curator
              - archaeologist
              - history-teacher
              - cultural-heritage-specialist
          - id: philosophy
            name: 哲学
            schoolId: chinese-lit
            careerSlugs:
              - philosophy-researcher
              - ethics-consultant
              - philosophy-teacher
              - policy-analyst
      - id: foreign-languages
        name: 外国语言文学系
        disciplineId: humanities
        majors:
          - id: english
            name: 英语
            schoolId: foreign-languages
            careerSlugs:
              - translator
              - interpreter
              - english-teacher
              - international-business-specialist

  # ===== 6. 社会科学 =====
  - id: social-sciences
    name: 社会科学
    description: 研究社会现象与人类行为
    icon: users
    color: "#0891B2"
    schools:
      - id: sociology
        name: 社会科学学院
        disciplineId: social-sciences
        majors:
          - id: sociology-major
            name: 社会学
            schoolId: sociology
            careerSlugs:
              - sociologist
              - social-worker
              - market-researcher
              - hr-specialist
          - id: psychology
            name: 心理学
            schoolId: sociology
            careerSlugs:
              - psychologist
              - counselor
              - ux-researcher
              - career-coach
          - id: international-politics
            name: 国际政治
            schoolId: sociology
            careerSlugs:
              - diplomat
              - foreign-affairs-analyst
              - international-relations-scholar
      - id: journalism
        name: 新闻与传播学院
        disciplineId: social-sciences
        majors:
          - id: journalism-major
            name: 新闻学
            schoolId: journalism
            careerSlugs:
              - journalist
              - news-editor
              - media-producer
              - public-relations-specialist

  # ===== 7. 法学 =====
  - id: law
    name: 法学
    description: 研究法律理论与法律实践
    icon: scale
    color: "#B45309"
    schools:
      - id: law-school
        name: 法学院
        disciplineId: law
        majors:
          - id: law-major
            name: 法学
            schoolId: law-school
            careerSlugs:
              - lawyer
              - judge
              - prosecutor
              - legal-consultant
              - compliance-officer

  # ===== 8. 艺术学 =====
  - id: arts
    name: 艺术学
    description: 研究艺术创作与设计表达
    icon: palette
    color: "#DB2777"
    schools:
      - id: academy-of-arts
        name: 美术学院
        disciplineId: arts
        majors:
          - id: visual-communication
            name: 视觉传达设计
            schoolId: academy-of-arts
            careerSlugs:
              - graphic-designer
              - ui-designer
              - brand-designer
              - illustrator
          - id: animation
            name: 动画
            schoolId: academy-of-arts
            careerSlugs:
              - animator
              - 3d-modeler
              - game-artist
              - motion-designer
          - id: industrial-design
            name: 工业设计
            schoolId: academy-of-arts
            careerSlugs:
              - industrial-designer
              - product-designer
              - cmf-designer
          - id: digital-media
            name: 数字媒体艺术
            schoolId: academy-of-arts
            careerSlugs:
              - digital-media-artist
              - vfx-artist
              - interactive-installation-artist

  # ===== 9. 经济学 =====
  - id: economics
    name: 经济学
    description: 研究资源配置与社会经济活动规律
    icon: trending-up
    color: "#CA8A04"
    schools:
      - id: econ-school
        name: 经济系
        disciplineId: economics
        majors:
          - id: economics-major
            name: 经济学
            schoolId: econ-school
            careerSlugs:
              - economist
              - economic-analyst
              - policy-researcher
              - data-analyst
              - market-researcher

  # ===== 10. 教育学 =====
  - id: education
    name: 教育学
    description: 研究教育理论与教育实践的科学
    icon: graduation-cap
    color: "#4F46E5"
    schools:
      - id: education-school
        name: 教育研究院
        disciplineId: education
        majors:
          - id: education-major
            name: 教育学
            schoolId: education-school
            careerSlugs:
              - teacher
              - education-researcher
              - curriculum-designer
              - education-administrator
              - instructional-designer

  # ===== 11. 农学 =====
  - id: agriculture
    name: 农学
    description: 研究农业生产与农村发展
    icon: sprout
    color: "#65A30D"
    schools:
      - id: agriculture-school
        name: 农业学院
        disciplineId: agriculture
        majors:
          - id: agronomy
            name: 农学
            schoolId: agriculture-school
            careerSlugs:
              - agronomist
              - agricultural-scientist
              - crop-specialist
              - soil-scientist
      - id: plant-protection
        name: 植物保护
        schoolId: agriculture-school
        disciplineId: agriculture
        majors:
          - id: plant-protection-major
            name: 植物保护
            schoolId: plant-protection
            careerSlugs:
              - plant-protection-specialist
              - pesticide-researcher
              - agricultural-consultant

  # ===== 12. 交叉学科 =====
  - id: cross-disciplinary
    name: 交叉学科
    description: 多学科交叉融合的新兴学科领域
    icon: git-branch
    color: "#9333EA"
    schools:
      - id: cross-school
        name: 交叉信息研究院
        disciplineId: cross-disciplinary
        majors:
          - id: data-science
            name: 数据科学与大数据技术
            schoolId: cross-school
            careerSlugs:
              - data-scientist
              - data-engineer
              - business-intelligence-analyst
              - big-data-architect
          - id: cyber-security
            name: 网络空间安全
            schoolId: cross-school
            careerSlugs:
              - cybersecurity-analyst
              - security-engineer
              - penetration-tester
              - security-consultant
          - id: bioinformatics
            name: 生物信息学
            schoolId: cross-school
            careerSlugs:
              - bioinformatician
              - computational-biologist
              - genomics-analyst
```

### 3.2 职业数据 (Career)

```typescript
// src/types/career.ts

interface Career {
  /** URL slug，如 "software-engineer" */
  slug: string;

  /** 职业名称 */
  name: string;

  /** 职业英文名 */
  nameEn?: string;

  /** 一句话描述 (用于卡片) */
  tagline: string;

  /** 所属分类路径 */
  categoryPath: {
    discipline: { id: string; name: string };     // "工学"
    school: { id: string; name: string };         // "计算机科学与技术系"
    major: { id: string; name: string };          // "软件工程"
  };

  /** 概念图 */
  conceptImage: {
    url: string;              // Cloudinary URL
    alt: string;
    source: 'manual' | 'ai-generated';  // 数据来源
    generatedAt?: string;     // AI 生成时间
  };

  /** 工作概述 (3-5段落) */
  overview: string;

  /** 主要职责 (列表) */
  responsibilities: string[];

  /** 典型的一天 (可选，增加可读性) */
  typicalDay?: string;

  /** 选择建议 */
  suggestion: {
    /** 适合的性格特质 */
    personalityFit: string[];
    /** 需要的能力/技能 */
    skillsRequired: string[];
    /** 适合人群描述 (1-2段文字) */
    summary: string;
    /** 不适合人群 (可选) */
    notForYou?: string;
  };

  // ===== v1.1 新增字段 =====

  /** 薪资范围 (可选，但建议提供) */
  salaryRange?: {
    junior: string;       // 如 "15-25万/年"
    senior: string;       // 如 "40-80万/年"
    source: string;       // 数据来源说明
  };

  /** 典型学历要求 */
  educationRequired?: '高中' | '大专' | '本科' | '硕士' | '博士';

  /** 行业发展前景 */
  industryOutlook?: 'growth' | 'stable' | 'declining' | 'emerging';

  /** 相关证书/资质 */
  certifications?: string[];

  /** 可迁移/相似职业 (slug 列表，用于详情页"相似职业"区域) */
  relatedCareers?: string[];

  // ===== 原有字段 =====

  /** 关联标签 */
  tags: string[];

  /** 数据来源 */
  source: 'curated' | 'ai-generated';
  generatedAt?: string;
  verifiedAt?: string;      // AI 生成内容经人工/自动审核通过的时间

  /** 元数据 */
  metadata: {
    createdAt: string;
    updatedAt: string;
    viewCount?: number;
    feedbackScore?: number;
  };
}
```

**Markdown 文件组织方式**：

> ⚠️ **重要设计决策**: `content/careers/` 中的 `.md` 文件建议**平铺存放**（不分学科子目录），
> 职业与分类的关联完全通过 frontmatter 中的 `categoryPath` 字段来维护。
> 这样处理跨学科职业（如"数据科学家"同时归属于理学/工学/交叉学科）时不会产生目录归属歧义。
> 如需按学科分区 human-readable 组织，可放在独立的 `content/collections/` 下以符号链接或 JSON 索引的方式引用。

**职业 Markdown 文件示例** (`content/careers/software-engineer.md`):

```markdown
---
slug: software-engineer
name: 软件工程师
nameEn: Software Engineer
tagline: 用代码构建数字化世界的建筑师
categoryPath:
  discipline:
    id: engineering
    name: 工学
  school:
    id: computer-science
    name: 计算机科学与技术系
  major:
    id: software-engineering
    name: 软件工程
conceptImage:
  url: /images/careers/software-engineer.webp
  alt: 一位坐在电脑前编写代码的软件工程师
  source: manual
salaryRange:
  junior: "15-25万/年"
  senior: "40-80万/年"
  source: "2025 年互联网行业薪酬报告"
educationRequired: 本科
industryOutlook: growth
certifications:
  - 计算机技术与软件专业技术资格（软考）
  - AWS/GCP 认证
relatedCareers:
  - frontend-engineer
  - algorithm-engineer
  - devops-engineer
tags: ["编程", "技术", "互联网", "高薪", "远程办公"]
source: curated
metadata:
  createdAt: "2026-07-06"
  updatedAt: "2026-07-06"
---

## 工作概述

软件工程师是数字时代的核心建设者。他们负责设计、开发、测试和维护各类软件系统，
从手机上的 App 到支撑亿级用户的云服务平台，都离不开软件工程师的工作。

软件工程师的工作不仅仅是"写代码"。他们需要理解用户需求，设计系统架构，
选择合适的技木方案，编写高质量的代码，并通过持续的测试和迭代不断优化产品。
在团队中，软件工程师还需要与产品经理、设计师、测试工程师紧密协作。

## 主要职责

- **需求分析**: 与产品和业务团队沟通，将业务需求转化为技术方案
- **系统设计**: 设计软件的架构、模块划分、接口定义
- **编码实现**: 使用编程语言（如 Java、Python、TypeScript 等）实现功能
- **代码审查**: 审查同事的代码，确保代码质量和一致性
- **测试与调试**: 编写单元测试、集成测试，定位和修复 bug
- **文档编写**: 编写技术文档和 API 文档
- **性能优化**: 分析和优化系统性能瓶颈

## 典型的一天

上午参加站会同步进度 → 编写和提交代码 → 午饭和同事讨论技术话题 →
下午参加设计评审 → 继续编码 → 修复测试发现的问题 → Code Review 同事的 PR → 下班

## 选择建议

### 适合的性格特质

- 逻辑思维强，善于分析和拆解复杂问题
- 有耐心和毅力，"debug 两小时"是常态
- 喜欢持续学习，技术更新很快
- 能够在细节和全局之间切换

### 需要的能力/技能

- 至少掌握一门编程语言
- 数据结构和算法基础
- 英语阅读能力（技术文档大多是英文）
- 团队协作和沟通能力

### 什么样的人适合选择这个职业

如果你是一个喜欢"创造"东西的人，享受用逻辑解决复杂问题的过程，
能从屏幕上的代码变成可以使用的产品中获得成就感，那么软件工程师可能非常适合你。

这个职业不要求你从小就会编程，也不要求你一定是数学天才。
但它需要你保持好奇心和学习热情——技术在不断演进，
昨天的"最佳实践"今天可能已经被新的范式取代。
如果你享受这种不断进化的节奏，你会在这个职业中找到极大的满足感。

### 可能不适合的情况

如果你更喜欢与人面对面交流而非与机器对话，或者你希望工作节奏稳定、
变化不多，那么可能需要考虑这个职业是否真的匹配你的偏好。
```

---

## 四、页面设计

### 4.1 全局布局

```
┌──────────────────────────────────────────────────────────┐
│  求职城市网  [🔍 搜索职业...              ] [分类▼] [🌙] [关于] │  ← Header
├──────────────────────────────────────────────────────────┤
│                                                          │
│                    页面内容区                              │
│                                                          │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  © 2026 求职城市网 | 数据来源说明 | 联系我们               │  ← Footer
└──────────────────────────────────────────────────────────┘
```
> Header 右侧新增 🌙 暗色模式切换按钮，支持 `prefers-color-scheme` 自动检测 + 手动切换。

### 4.2 首页 (`/`)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│          🏙️  探索你的职业城市                              │
│          基于清华大学学科体系，发现 400+ 职业的精彩          │
│          [🔍 搜索你感兴趣的职业...          ]              │
│                                                          │
├──────────────────────────────────────────────────────────┤
│   [全部] [理学] [工学] [医学] [管理] [人文] [社科] ...  ← 学科筛选│
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────┐│
│  │         │ │         │ │         │ │         │ │     ││
│  │ [概念图] │ │ [概念图] │ │ [概念图] │ │ [概念图] │ │ ... ││
│  │         │ │         │ │         │ │         │ │     ││
│  │ 软件工程师│ │  建筑师  │ │  医生   │ │ 数据科学│ │     ││
│  │ 用代码构 │ │ 设计城   │ │ 守护生   │ │ 从数据中│ │     ││
│  │ 建数字世 │ │ 市天际   │ │ 命健康   │ │ 挖掘洞见│ │     ││
│  │ 界的建筑 │ │ 线的艺   │ │ 的守护   │ │ 的侦探  │ │     ││
│  │ 师       │ │ 术家     │ │ 者       │ │         │ │     ││
│  │ #工学    │ │ #建筑学  │ │ #医学    │ │ #理学   │ │     ││
│  │ 💰15-25万│ │ 💰12-20万│ │ 💰10-30万│ │ 💰20-40万│ │    ││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────┘│
│                                                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────┐│
│  │   ...   │ │   ...   │ │   ...   │ │   ...   │ │ ... ││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────┘│
│                                                          │
│              [🔄 换一批职业卡片]                           │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│          📚 按学科门类浏览                                  │
│                                                          │
│  ┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐───── │
│  │ 🧪理学 ││ ⚙️工学 ││ 🏥医学 ││ 💼管理 ││ 📖人文 ││ ...  │
│  │ 35职业 ││ 180职业││ 40职业 ││ 50职业 ││ 30职业 ││      │
│  └────────┘└────────┘└────────┘└────────┘└────────┘───── │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**卡片交互细节**：
- 鼠标悬停卡片微微上浮 + 阴影加深（`hover:scale-105 hover:shadow-xl transition`）
- 概念图使用 `aspect-[4/3]` 保持比例，`object-cover` 填充
- 标签显示分类颜色（从分类数据读取）
- 卡片底部显示薪资范围简写（如有）
- 点击卡片进入职业详情页

**随机逻辑 (v1.1 改进)**：
- **客户端 CSR 随机**: 首页壳子 SSG，卡片数据通过客户端请求随机获取，体验更即時
- **加权随机**: 用户浏览过的学科门类，对应卡片出现概率提升 2x
- **学科筛选**: 页面顶部快速筛选栏，用户可选择只看某个学科门类的卡片
- "换一批"按钮重新随机 + 排除当前已显示职业
- 每批展示 10-15 个职业

### 4.3 分类总览页 (`/categories`)

```
┌──────────────────────────────────────────────────────────┐
│  首页 > 学科分类                                           │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  🧪 理学                                   35 个职业   │ │
│  │  数学 · 物理 · 化学 · 生物 · 天文 · 统计 · 地球科学     │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ⚙️ 工学                                   180 个职业  │ │
│  │  计算机 · 电子 · 机械 · 土木 · 材料 · 化工 · 航天 ...  │ │
│  └──────────────────────────────────────────────────────┘ │
│  ... (其余 10 个门类)                                      │
└──────────────────────────────────────────────────────────┘
```

### 4.4 思维导图导航页 (`/categories/[discipline]`)

**桌面端**:

```
┌──────────────────────────────────────────────────────────┐
│  首页 > 学科分类 > 工学                                    │
│                                                          │
│  ┌──────────────── 思维导图区 ──────────────────────────┐  │
│  │                                                      │  │
│  │                  ┌── 软件工程师                       │  │
│  │       ┌── 软件工程┼── 前端工程师                      │  │
│  │       │          └── 移动端开发                       │  │
│  │  计算机├── 计算机科学┼── 系统架构师                    │  │
│  │  系   │          └── ...                             │  │
│  │       │          ┌── AI 工程师                        │  │
│  │       └── 人工智能┼── 机器学习工程师                    │  │
│  │                  └── ...                             │  │
│  │  ...                                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                          │
│  💡 点击节点展开/收起 | 滚轮缩放 | 拖拽平移 | 点击职业名查看详情│
└──────────────────────────────────────────────────────────┘
```

**移动端 (v1.1 升级为渐进展开层级列表)**:

```
┌──────────────────────────────┐
│  首页 > 学科分类 > 工学       │
│                              │
│  ⚙️ 工学 (180职业)           │
│  ├─ 📁 计算机科学与技术系  ▸  │
│  ├─ 📁 电子工程系        ▸  │
│  ├─ 📁 机械工程系        ▸  │
│  ├─ 📁 土木工程系        ▸  │
│  └─ ...                     │
│                              │
│  [点击 📁 展开子级]           │
│                              │
│  ⚙️ 工学                      │
│  ├─ 📂 计算机科学与技术系     │
│  │   ├─ 🎓 软件工程      ▸  │
│  │   ├─ 🎓 计算机科学    ▸  │
│  │   └─ 🎓 人工智能      ▸  │
│  ├─ 📁 电子工程系        ▸  │
│  └─ ...                     │
│                              │
│  [继续点击 🎓 展开职业列表]    │
└──────────────────────────────┘
```

### 4.5 职业详情页 (`/career/[slug]`)

```
┌──────────────────────────────────────────────────────────┐
│  首页 > 工学 > 计算机系 > 软件工程 > 软件工程师             │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              [大型职业角色概念图]                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────── 快速决策卡 ────────────────────────────┐  │
│  │ 💰 薪资: 15-25万(初) → 40-80万(资深) │ 🎓 学历: 本科   │ │
│  │ 📈 前景: 🟢 增长型                   │ 📜 证书: 软考   │ │
│  └──────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  #工学  #编程  #高薪  #远程                            │ │
│  │                                                      │ │
│  │  软件工程师                                           │ │
│  │  Software Engineer                                   │ │
│  │  用代码构建数字化世界的建筑师                            │ │
│  │                                                      │ │
│  │  📖 工作概述  ...                                     │ │
│  │  📋 主要职责  ...                                     │ │
│  │  ⏰ 典型的一天 ...                                     │ │
│  │                                                      │ │
│  │  🎯 选择建议                                          │ │
│  │  ┌─────────────────┐ ┌─────────────────┐              │ │
│  │  │ 适合的性格特质    │ │ 需要的能力        │              │ │
│  │  │ • 逻辑思维强     │ │ • 编程语言       │              │ │
│  │  │ • 有耐心和毅力   │ │ • 数据结构算法    │              │ │
│  │  │ • 喜欢持续学习   │ │ • 英语阅读能力    │              │ │
│  │  │ • 注重细节       │ │ • 团队协作        │              │ │
│  │  └─────────────────┘ └─────────────────┘              │ │
│  │                                                      │ │
│  │  💡 什么样的人适合？                                    │ │
│  │  ...                                                 │ │
│  │                                                      │ │
│  │  ⚠️ 可能不适合                                         │ │
│  │  ...                                                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────── 相似职业对比 ───────────────────────┐  │
│  │  职业           │ 薪资(初)  │ 薪资(资深) │ 学历    │ 前景 │ │
│  │  软件工程师      │ 15-25万   │ 40-80万    │ 本科    │ 🟢  │ │
│  │  前端工程师      │ 12-20万   │ 35-60万    │ 本科    │ 🟢  │ │
│  │  算法工程师      │ 20-35万   │ 50-100万   │ 硕士    │ 🟢  │ │
│  │  DevOps工程师   │ 15-25万   │ 40-70万    │ 本科    │ 🟢  │ │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

> **v1.1 新增**: 快速决策卡 (CareerDecisionCard) + 相似职业对比表 (CareerCompare)。
> `notForYou` 信息在"选择建议"区域底部显著展示，帮助用户做出更理性的职业判断。

### 4.6 搜索 & AI 补全流程

```
┌────────────────── 搜索流程 ──────────────────────────────┐
│                                                          │
│  用户输入 "碳中和管理师" → 点击搜索                         │
│         │                                                │
│         ▼                                                │
│  ┌─────────────┐                                         │
│  │ 站内搜索匹配  │                                         │
│  └──┬──────┬───┘                                         │
│     │命中  │未命中                                        │
│     ▼      ▼                                             │
│  ┌────┐ ┌─────────────────────────────┐                  │
│  │跳转│ │ 暂无此职业                    │                  │
│  │详情│ │                              │                  │
│  │页  │ │ 🔍 正在为你搜索网络信息...     │                  │
│  └────┘ │ ████████░░░░ 60%            │                  │
│         │                              │                  │
│         │ 🤖 AI 正在整理职业描述...     │                  │
│         │ ██████████████ 100%          │                  │
│         │                              │                  │
│         │ 🔎 正在审核内容质量...        │  ← v1.1 新增     │
│         │ ██████████████ 100%          │                  │
│         │                              │                  │
│         │ 🎨 正在生成职业角色概念图...    │                  │
│         │ ██████████████ 100%          │                  │
│         │                              │                  │
│         │ ┌────────────────────────┐   │                  │
│         │ │     ✨ 碳中和管理师      │   │                  │
│         │ │  [AI生成的概念图]       │   │                  │
│         │ │  负责组织碳排放监测...   │   │                  │
│         │ │  ⚠️ 此内容由AI生成      │   │                  │
│         │ │  [👍有用] [👎不准确]   │   │                  │
│         │ └────────────────────────┘   │                  │
│         │                              │                  │
│         │  此职业已加入站内数据库，下次搜索可直接找到       │
│         │  ⚠️ AI 生成内容仅供参考，建议核实关键信息        │
│         └─────────────────────────────┘                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 五、API 设计

### 5.1 站内搜索 API

```
GET /api/search?q=软件工程师&limit=10

Response 200 (命中):
{
  "query": "软件工程师",
  "found": true,
  "results": [
    {
      "slug": "software-engineer",
      "name": "软件工程师",
      "tagline": "用代码构建数字化世界的建筑师",
      "conceptImage": { "url": "...", "alt": "..." },
      "categoryPath": { ... },
      "tags": ["编程", "技术"],
      "salaryRange": { "junior": "15-25万/年", "senior": "40-80万/年" },
      "source": "curated",
      "score": 0.95
    },
    { ... }
  ],
  "totalResults": 5,
  "suggestions": ["前端工程师", "后端工程师", "全栈工程师"]
}

Response 200 (未命中):
{
  "query": "碳中和管理师",
  "found": false,
  "results": [],
  "totalResults": 0,
  "suggestions": ["环境工程师", "能源管理师", "ESG分析师"],
  "aiGenerateAvailable": true
}

Response 429 (速率限制):
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "请求过于频繁，请稍后再试",
    "retryAfter": 30
  }
}
```

### 5.2 AI 职业生成 API

```
POST /api/ai-generate
Content-Type: application/json

{
  "query": "碳中和管理师"
}

-- 返回 SSE 流式响应 (Server-Sent Events):

event: searching
data: { "status": "searching", "message": "正在搜索相关信息..." }

event: found_web_data
data: { "status": "found_web_data", "sources": ["url1", "url2", "url3"] }

event: generating_text
data: { "status": "generating_text", "message": "AI 正在整理职业描述..." }

event: reviewing_content          ← v1.1 新增: 内容审核状态
data: { "status": "reviewing_content", "message": "正在审核内容质量..." }

event: text_complete
data: {
  "status": "text_complete",
  "reviewed": true,              ← v1.1 新增
  "career": {
    "name": "碳中和管理师",
    "tagline": "带领组织实现碳中和目标的绿色职业",
    "overview": "...",
    "responsibilities": [...],
    "suggestion": { ... },
    "tags": ["碳中和", "ESG", "绿色能源", "新兴职业"]
  }
}

event: generating_image
data: { "status": "generating_image", "message": "正在生成职业角色概念图..." }

event: image_complete
data: {
  "status": "image_complete",
  "imageUrl": "https://res.cloudinary.com/.../carbon-neutrality-manager.webp"
}

event: done
data: {
  "status": "done",
  "slug": "carbon-neutrality-manager",
  "pageUrl": "/career/carbon-neutrality-manager",
  "persisted": true,
  "message": "此职业已加入站内数据库，下次搜索可直接找到",
  "disclaimer": "此内容由 AI 生成，仅供参考。建议核实关键信息。"
}

-- 错误响应:
event: error
data: {
  "status": "error",
  "error": {
    "code": "CONTENT_REVIEW_FAILED",
    "message": "无法为此查询生成可靠的职业描述，请尝试更具体的搜索词"
  }
}

event: error
data: {
  "status": "error",
  "error": {
    "code": "RATE_LIMITED",
    "message": "今日 AI 生成次数已用完（3次/天），请明天再试",
    "resetAt": "2026-07-07T00:00:00Z"
  }
}
```

### 5.3 用户反馈 API

```
POST /api/feedback
Content-Type: application/json

{
  "careerSlug": "carbon-neutrality-manager",
  "type": "helpful" | "inaccurate",
  "comment": "建议补充碳交易相关的职责描述"  // 可选
}

Response 200:
{ "ok": true }

Response 409 (重复投票):
{
  "error": {
    "code": "ALREADY_VOTED",
    "message": "您已经对此职业提交过反馈"
  }
}

Response 429 (速率限制):
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "反馈提交过于频繁，请稍后再试"
  }
}
```

---

## 六、AI 动态生成核心逻辑

### 6.1 流程图 (v1.1 增加审核步骤 + 备选图片方案)

```
用户搜索 → 未命中
    │
    ▼
┌─────────────────────┐
│ Step 1: Web Search  │  调用 Tavily Search API
│ 搜索: "{query} 职业    │  获取 3-5 个相关网页摘要
│  工作内容 职责 要求"   │
└────────┬────────────┘
         │ sourceUrls[], snippets[]
         ▼
┌─────────────────────┐
│ Step 2: LLM 整合     │  调用 Claude API
│ 将搜索结果整合为      │  Prompt 含完整分类树 + Few-shot 示例
│ 结构化职业信息        │  输出 JSON Schema 约束
└────────┬────────────┘
         │ Career JSON (除图片外)
         ▼
┌─────────────────────┐
│ Step 2.5: 内容审核   │  调用 Claude API (独立校验)
│ 检查: 信息完整性      │  输出: { passed: boolean, issues: string[] }
│ 与搜索源一致性        │  不通过 → 返回错误，不持久化
│ 安全/合规性          │
└────────┬────────────┘
         │ 审核通过
         ▼
┌─────────────────────┐
│ Step 3: 图片生成     │  主: DALL·E 3 → 备: Replicate Flux
│ 生成职业角色概念图    │  先翻译职业名+场景为英文 prompt
│ 风格统一 + 自动重试   │
└────────┬────────────┘
         │ imageUrl
         ▼
┌─────────────────────┐
│ Step 4: 上传图片     │  DALL·E/Replicate URL → Cloudinary
│ 持久化到 CDN         │  统一尺寸 + WebP 转换
└────────┬────────────┘
         │ cloudinaryUrl
         ▼
┌─────────────────────┐
│ Step 5: 持久化存储    │  Career JSON → Vercel KV
│ 写入 KV Store        │  key: `career:{slug}`
│ + 写入审核队列        │  list push: `pending-review`
│ + 写入审计日志        │  key: `audit:ai-gen:{timestamp}`
└────────┬────────────┘
         │
         ▼
    返回完整结果给用户
```

### 6.2 Claude Prompt 模板 (v1.1 大幅改进)

```typescript
const CLASSIFICATION_TREE = `
## 清华大学学科分类体系（供 categoryPath 参考）

你必须从以下分类中选择最匹配的 discipline / school / major。
如果职业与多个分类相关，选择最核心的。

${JSON.stringify(classificationTree, null, 2)}
`;

const SYSTEM_PROMPT = `你是一个职业信息整理专家。用户搜索了一个职业，你需要根据提供的网络搜索结果，整合出该职业的完整描述。

## 核心要求
1. 信息必须基于搜索结果，不要编造。如搜索结果信息不足，在相应字段标注"信息有限"
2. 所有描述使用中文，语言通俗易懂，面向高中生和大学生
3. 适合人群建议要具体、接地气，避免空泛的套话
4. categoryPath 必须从提供的分类树中选择，不可随意编造
5. 输出必须是合法的 JSON，严格遵循给定的 JSON Schema

## 安全规则（必须遵守）
- 如果搜索结果含有色情、暴力、违法或其他不安全内容，忽略这些内容
- 不要生成任何政治敏感的职业描述或评价
- 如果某个职业的合法性和正当性存疑，标注"无法生成"并说明原因
- 薪资数据必须来自搜索结果，没有可靠来源则标注"暂无公开数据"

## 输出格式
严格按照提供的 JSON Schema 输出，不要额外添加解释文字。`;

const FEW_SHOT_EXAMPLE = `
## 示例输出

以下是一个标准的输出示例（以"碳中和管理师"为例）：

{
  "name": "碳中和管理师",
  "nameEn": "Carbon Neutrality Manager",
  "tagline": "带领组织实现碳中和目标的绿色职业",
  "overview": "碳中和管理师是随着全球碳中和目标推进而兴起的新兴职业...",
  "responsibilities": [
    "制定企业碳中和战略和实施路线图",
    "..."
  ],
  "typicalDay": "上午分析碳排放数据 → ... → 下午撰写ESG报告",
  "suggestion": {
    "personalityFit": ["数据敏感度强", "关注环保和可持续发展", "跨部门沟通能力强"],
    "skillsRequired": ["碳排放核算方法", "ESG报告编写", "环境科学基础"],
    "summary": "如果你关注气候变化，喜欢用数据驱动决策，并且愿意在快速发展的新兴领域中成为先行者，碳中和管理师值得考虑。",
    "notForYou": "如果你对数据分析感到头疼，或者不想频繁跟进更新的政策法规，这个职业可能会让你感到吃力。"
  },
  "tags": ["碳中和", "ESG", "绿色能源", "新兴职业"],
  "salaryRange": { "junior": "12-20万/年", "senior": "30-60万/年", "source": "行业招聘数据" },
  "educationRequired": "本科",
  "industryOutlook": "growth",
  "certifications": ["碳排放管理员", "CFA ESG 投资证书"],
  "categoryPath": {
    "discipline": { "id": "cross-disciplinary", "name": "交叉学科" },
    "school": { "id": "cross-school", "name": "交叉信息研究院" },
    "major": { "id": "data-science", "name": "数据科学与大数据技术" }
  }
}
`;

const USER_PROMPT = (query: string, searchResults: string) => `
请根据以下网络搜索结果，为"${query}"整理职业信息。

${CLASSIFICATION_TREE}

## 网络搜索结果
${searchResults}

## 参考示例
${FEW_SHOT_EXAMPLE}

请严格按照 JSON Schema 输出。如果搜索结果不足以支撑完整描述，在相应字段中诚实标注。`;
```

### 6.3 内容审核 Prompt (v1.1 新增)

```typescript
const REVIEW_SYSTEM_PROMPT = `你是一个内容质量审核员。你需要审核 AI 生成的职业描述是否存在以下问题：

1. **信息准确性**: 描述是否与搜索源一致？是否有明显编造？
2. **完整性**: 各必要字段是否已填充？是否有重要信息缺失？
3. **安全性**: 是否包含任何不安全、不适当或政治敏感的内容？
4. **可用性**: 描述是否通俗易懂？对高中生而言是否足够清晰？

请输出审核结果 JSON：{
  "passed": true/false,
  "issues": ["问题描述1", ...],
  "severity": "low" | "medium" | "high"
}`;

// 审核不通过时的处理:
// - severity "high" → 不持久化，返回错误给用户
// - severity "medium" → 标记 `verifiedAt: null`，存入 pending-review 队列
// - severity "low" → 正常持久化，记录 issue 到日志
```

### 6.4 DALL·E 图片生成 Prompt 模板 (v1.1 改进)

```typescript
/**
 * 生成 DALL·E 概念图 prompt
 * v1.1 改进: 先将中文职业名翻译为英文，再加入场景关键词
 */
function buildImagePrompt(careerName: string, nameEn: string, overview: string): string {
  // 从 overview 中提取 2-3 个场景关键词
  const sceneKeywords = extractSceneKeywords(overview);

  // 使用英文职业名（DALL·E 对英文理解更好）
  const englishName = nameEn || translateCareerName(careerName);

  return [
    `A professional career concept illustration of a ${englishName} in a modern Chinese city setting.`,
    `The character is shown ${sceneKeywords.join(', ')}.`,
    `Style: Semi-realistic digital illustration, clean composition, warm and professional atmosphere.`,
    `Color palette: Warm and professional tones, soft lighting, modern aesthetic.`,
    `Aspect ratio: 4:3, suitable for a career website card.`,
    `Do NOT include any text, letters, or numbers in the image.`,
  ].join(' ');
}

/**
 * 备选方案: Replicate Flux prompt
 * 当 DALL·E 不可用时自动切换
 */
function buildReplicatePrompt(careerName: string, nameEn: string, overview: string): string {
  const englishName = nameEn || translateCareerName(careerName);
  const sceneKeywords = extractSceneKeywords(overview);

  return [
    `Professional career concept art: ${englishName} working in a modern Chinese workplace.`,
    `Scene: ${sceneKeywords.join(', ')}.`,
    `Style: semi-realistic, warm professional atmosphere, soft lighting, clean composition.`,
    `No text or letters. 4:3 aspect ratio.`,
  ].join(' ');
}
```

---

## 七、实施计划 (v1.1 修订)

### Phase 1: MVP（第 1-2 周，~15 天）

| 任务 | 优先级 | 预估工时 | 产出 |
|------|--------|---------|------|
| 项目脚手架搭建 | P0 | 0.5天 | Next.js 15 + Tailwind + TypeScript + Velite 初始化 |
| 数据模型实现 | P0 | 1天 | TypeScript 类型 + Velite 配置 |
| 分类数据整理 | P0 | 1.5天 | `tsinghua-categories.yaml` 完整 12 门类数据 |
| 热门职业数据 | P0 | 3天 | 50 个核心职业的 Markdown 文件 (含薪资/学历/前景) |
| 概念图生成 | P1 | 1.5天 | 50 张职业概念图 (DALL·E 批量生成 + 风格校验) |
| 首页 (随机卡片) | P0 | 1.5天 | 响应式卡片网格 + CSR 随机 + 学科筛选栏 |
| 分类总览页 | P0 | 0.5天 | 12 门类卡片列表 |
| 思维导图导航 | P1 | 3天 | G6 TreeGraph + 移动端渐进展开层级列表 |
| 职业详情页 | P0 | 2天 | 概念图 + 快速决策卡 + 概述 + 建议 + 相似职业 + 面包屑 |
| 站内搜索 | P1 | 1天 | 搜索框 + 搜索页 + Fuse.js API |
| 内容校验脚本 | P1 | 0.5天 | `scripts/validate-content.ts` |
| 部署上线 | P0 | 0.5天 | Vercel 部署 + 域名 + CI/CD (GitHub Actions) |
| **小计** | | **~15 天** | |

> v1.1 调整说明: 职业数据编写从 2 天 → 3 天 (含新字段)；思维导图从 2 天 → 3 天 (含移动端组件)；概念图从 1 天 → 1.5 天 (含质量校验)；新增内容校验脚本 0.5 天。

### Phase 2: AI 动态补全（第 3 周，~6.5 天）

| 任务 | 优先级 | 预估工时 | 产出 |
|------|--------|---------|------|
| Tavily Search API 集成 | P1 | 0.5天 | 搜索封装 + 错误处理 + 降级 |
| Claude API 集成 + 改进版 Prompt | P1 | 1.5天 | 含分类树嵌入 + Few-shot + 安全护栏 |
| 内容审核 (Step 2.5) | P1 | 0.5天 | Claude 二次校验管线 |
| DALL·E 3 集成 + Replicate 备选 | P1 | 1天 | 主备切换 + 翻译 + 场景提取 |
| Cloudinary 上传管线 | P1 | 0.5天 | 图片持久化 + CDN 分发 |
| Vercel KV 存储 + 审核队列 + 审计日志 | P1 | 0.5天 | 数据持久化 + 安全审计 |
| SSE 流式响应实现 | P1 | 1天 | 含审核状态事件 + 错误事件 |
| 前端 AI 生成状态面板 | P1 | 1天 | 审核进度展示 + 免责声明 + 错误状态 |
| **小计** | | **~6.5 天** | |

> v1.1 调整说明: Claude 集成从 1 天 → 1.5 天 (Prompt 大幅改进)；新增内容审核 0.5 天；图片生成从 0.5 天 → 1 天 (增加备选方案 + 翻译逻辑)；新增审计日志。

### Phase 2.5: 运营基础（第 3 周后半，~2 天）(v1.1 新增)

| 任务 | 优先级 | 预估工时 | 产出 |
|------|--------|---------|------|
| API 速率限制 | P1 | 0.5天 | Upstash Ratelimit (AI 生成 ≤3次/天/人，反馈 ≤10次/天) |
| 数据埋点 | P1 | 0.5天 | Vercel Analytics + 搜索/生成/反馈自定义事件 |
| 内容审核后台 (MVP) | P2 | 1天 | 密码保护的 Vercel KV 管理页，展示 pending-review 队列 |
| **小计** | | **~2 天** | |

### Phase 3: 完善（第 4 周及以后）

| 任务 | 描述 | 预估工时 |
|------|------|---------|
| 职业数据补全 | 200+ 职业，覆盖全部 93 个专业 | 持续进行 |
| 搜索升级 | Fuse.js → Meilisearch 全文本搜索引擎 | 2 天 |
| 暗色模式 | `prefers-color-scheme` + 手动切换 + CSS 变量 | 1 天 |
| SEO 优化 | Open Graph、结构化数据 (Schema.org JobPosting) | 1 天 |
| 移动端体验深化 | 思维导图触摸交互、手势操作、性能优化 | 2 天 |
| 国际化 | 英文版（可选） | 3 天 |
| 组件 + E2E 测试 | Vitest + Testing Library + Playwright | 2 天 |
| 数据分析报表 | 搜索热门职业、用户行为可视化 | 1 天 |
| 内容审核流程完善 | 多人审核、审核记录、自动上架 | 2 天 |

### 测试策略

| 层级 | 工具 | 范围 | 执行频率 |
|------|------|------|---------|
| 类型检查 | TypeScript (`tsc --noEmit`) | 全量 | 每次 commit (CI) |
| 内容校验 | 自定义脚本 (`scripts/validate-content.ts`) | 所有 .md 文件 | 每次 commit + 新增文件时 |
| 单元测试 | Vitest + Testing Library | 卡片组件、搜索组件、分类读取、AI 管线 | 每次 push (CI) |
| E2E 测试 | Playwright | 首页加载 → 卡片点击 → 详情 → 搜索 → AI 生成 | 每次 deploy 前 |
| 人工测试 | - | 移动端兼容性、AI 生成质量抽查 | 每周 |

---

## 八、设计规范

### 8.1 色彩系统

```css
:root {
  /* 品牌色 */
  --color-primary: #2563EB;      /* 蓝色 - 信任、专业 */
  --color-primary-light: #3B82F6;
  --color-primary-dark: #1D4ED8;

  /* 学科门类主题色 (用于标签、卡片边框) */
  --color-science: #2563EB;      /* 理学 - 蓝 */
  --color-engineering: #DC2626;  /* 工学 - 红 */
  --color-medicine: #059669;     /* 医学 - 绿 */
  --color-management: #7C3AED;   /* 管理 - 紫 */
  --color-humanities: #D97706;   /* 人文 - 橙 */
  --color-social-science: #0891B2; /* 社科 - 青 */
  --color-law: #B45309;          /* 法学 - 棕 */
  --color-arts: #DB2777;         /* 艺术 - 粉 */
  --color-economics: #CA8A04;    /* 经济 - 金 */
  --color-education: #4F46E5;    /* 教育 - 靛 */
  --color-agriculture: #65A30D;  /* 农学 - 绿 */
  --color-cross: #9333EA;        /* 交叉学科 - 紫红 */

  /* 中性色 (亮色模式) */
  --color-bg: #F9FAFB;
  --color-surface: #FFFFFF;
  --color-text: #111827;
  --color-text-secondary: #6B7280;
  --color-border: #E5E7EB;

  /* 卡片 */
  --card-radius: 12px;
  --card-shadow: 0 1px 3px rgba(0,0,0,0.1);
  --card-shadow-hover: 0 10px 25px rgba(0,0,0,0.12);

  /* 状态色 */
  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #DC2626;
  --color-info: #2563EB;
}

/* 暗色模式 (v1.1 新增) */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0F172A;
    --color-surface: #1E293B;
    --color-text: #F1F5F9;
    --color-text-secondary: #94A3B8;
    --color-border: #334155;

    --card-shadow: 0 1px 3px rgba(0,0,0,0.3);
    --card-shadow-hover: 0 10px 25px rgba(0,0,0,0.5);
  }
}

/* 手动暗色模式覆盖 (当用户主动切换时生效) */
html.dark {
  --color-bg: #0F172A;
  --color-surface: #1E293B;
  --color-text: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-border: #334155;

  --card-shadow: 0 1px 3px rgba(0,0,0,0.3);
  --card-shadow-hover: 0 10px 25px rgba(0,0,0,0.5);
}
```

### 8.2 响应式断点

| 断点 | 宽度 | 卡片列数 | 思维导图 |
|------|------|---------|---------|
| Mobile | < 640px | 1 列 | 渐进展开层级列表 (CategoryTree) |
| Tablet | 640-1024px | 2-3 列 | 简化导图 / 层级列表 |
| Desktop | > 1024px | 4-5 列 | 完整 MindMap (G6 TreeGraph) |

### 8.3 卡片设计 (类淘宝风格)

```css
.career-card {
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-surface);
  box-shadow: var(--card-shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.career-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow-hover);
}

.career-card__image {
  aspect-ratio: 4 / 3;
  object-fit: cover;
  width: 100%;
}

.career-card__body {
  padding: 16px;
}

.career-card__title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 4px;
  color: var(--color-text);
}

.career-card__tagline {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  /* 最多两行，超出省略 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.career-card__salary {
  font-size: 13px;
  color: var(--color-success);
  font-weight: 500;
  margin-top: 8px;
}

.career-card__tags {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.career-card__tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #F3F4F6;
  color: var(--color-text-secondary);
}
```

---

## 九、安全与合规 (v1.1 新增)

### 9.1 速率限制

| 端点 | 限制策略 | 实现方式 |
|------|---------|---------|
| `/api/ai-generate` | 每人每天 3 次；每分钟 1 次 | Upstash Ratelimit (`@upstash/ratelimit`) |
| `/api/feedback` | 每人每小时 10 次 | Upstash Ratelimit |
| `/api/search` | 每秒 20 次 | Upstash Ratelimit |

### 9.2 Content-Security-Policy

```typescript
// next.config.ts
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' res.cloudinary.com blob: data:;
  font-src 'self';
  connect-src 'self' api.anthropic.com api.openai.com api.tavily.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s{2,}/g, ' ').trim();
```

### 9.3 AI 内容安全措施

1. **生成前**: 搜索词过滤（拒绝明显恶意/违规查询）
2. **生成中**: System Prompt 中的安全规则（见 6.2 节）
3. **生成后**: Claude 内容审核（见 6.3 节）
4. **展示时**: 所有 AI 内容标注 `⚠️ 此内容由 AI 生成，仅供参考`
5. **持久化时**: 写入 `pending-review` 审核队列

### 9.4 审计日志

在 Vercel KV 中记录每次 AI 生成请求的关键字段：

```
key: audit:ai-gen:{timestamp}_{sessionId}
value: {
  query: string,
  slug: string | null,
  status: 'success' | 'review_failed' | 'error',
  sourceUrls: string[],
  createdAt: string,
  sessionId: string (hash)
}
TTL: 30 天
```

### 9.5 反馈防刷

- 同一 session 同一职业 slug 只能提交一次反馈
- 使用 Vercel KV `setnx` 实现去重：
  ```
  key: feedback:{sessionHash}:{careerSlug}
  value: { type, comment, timestamp }
  TTL: 永久
  ```

---

## 十、API 成本预估

### 初始建设成本 (一次性)

| 项目 | 数量 | 单价 | 小计 |
|------|------|------|------|
| 概念图生成 (DALL·E 3) | 50 张 | $0.04 | $2.00 |
| 概念图生成 (备选 Replicate Flux) | - | $0.01 | (备用) |
| 职业数据 AI 辅助生成 | 50 个 | $0.03 | $1.50 |
| 内容审核 (Claude 校验) | 50 次 | $0.01 | $0.50 |
| **合计** | | | **$4.00** |

### 运营成本 (月度)

假设：1000 DAU，每天 5% 用户使用 AI 生成 (50 次/天)

| 项目 | 月量 | 单价 | 月费 |
|------|------|------|------|
| Web Search (Tavily) | 1,500 次 | $0.005 | $7.50 |
| Claude API (文本生成) | 1,500 次 | $0.03 | $45.00 |
| Claude API (内容审核) | 1,500 次 | $0.01 | $15.00 |
| DALL·E 3 (图片) | 1,500 张 | $0.04 | $60.00 |
| 图片备选 (Replicate Flux) | - | $0.01 | (仅降级使用) |
| Vercel 部署 | - | 免费层 | $0 |
| Cloudinary | - | 免费层 25GB | $0 |
| Vercel KV | - | 免费层 | $0 |
| Upstash Redis (Ratelimit) | - | 免费层 10K/天 | $0 |
| **合计** | | | **$127.50/月** |

> v1.1 调整说明: 新增内容审核 Claude 调用 $15/月；新增 Upstash 免费层即可满足；AI 生成成本整体有所上升，但质量大幅提升。
> 通过限制每人每天 3 次 AI 生成和图片缓存可控制成本。

---

## 十一、风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| AI 生成内容不准确 | 中 | 高 | 所有 AI 内容标注来源；Claude 内容审核步骤；用户反馈机制；人工抽检 |
| AI 生成内容不安全 | 低 | 高 | 搜索词过滤 + Prompt 安全护栏 + 生成后审核 + 审核队列 |
| API 滥用导致费用失控 | 中 | 高 | 速率限制 (3次/天/人)；API 预算告警；用量监控面板 |
| 图片版权/质量 | 低 | 中 | DALL·E/Replicate 生成图版权清晰；固定 prompt 保证风格一致 |
| API 服务不可用 (OpenAI) | 低 | 中 | Replicate Flux 备选图片方案；AI 不可用时降级提示 |
| 思维导图大数据量卡顿 | 中 | 中 | G6 虚拟化渲染；移动端降级为层级列表；限制同屏节点数 |
| SEO 不理想 | 中 | 中 | Next.js SSG 预渲染所有职业页；结构化数据标记 |
| 用户量激增成本失控 | 低 | 高 | 速率限制；AI 生成次数硬限制；CDN 缓存；免费层过渡 |
| Contentlayer 停止维护 | 高 | 中 | 已计划替换为 Velite（活跃维护） |
| 用户生成不安全内容 | 低 | 中 | 搜索词过滤；CSP 安全策略；审计日志追溯 |

---

## 十二、成功指标 (MVP)

| 指标 | 目标值 | 测量方式 |
|------|--------|---------|
| 页面加载速度 | Lighthouse > 90 | Vercel Analytics |
| 站内职业数量 | 50+ (Phase 1) | 数据文件计数 |
| 分类覆盖率 | 12 大门类全覆盖 | 分类数据完整性 |
| 移动端可用 | 所有页面响应式；移动端思维导图可用 | 手动/Playwright 测试 |
| AI 生成成功率 | > 80% | API 日志 |
| AI 内容审核通过率 | > 90% (审核通过/总生成) | 审核日志 |
| 用户反馈准确率 | > 70% 点赞 | 反馈数据统计 |
| 暗色模式支持 | 实现 | 手动测试 |

---

## 附录 A: 变更日志

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v1.0 | 2026-07-06 | 初版：完整技术架构、数据模型、页面设计、API 设计、AI 流程、实施计划 |
| v1.1 | 2026-07-06 | **架构**: Next.js 15+；Contentlayer→Velite；Replicate 备选图片；搜索升级路径 |
| | | **数据模型**: 新增 salaryRange / educationRequired / industryOutlook / certifications / relatedCareers |
| | | **页面**: 暗色模式支持；首页 CSR 随机 + 学科筛选；移动端渐进展开层级列表；快速决策卡 + 相似职业对比 |
| | | **AI 流程**: Prompt 大幅改进 (分类树嵌入 + Few-shot + 安全护栏)；新增内容审核 Step 2.5；图片生成翻译优化 |
| | | **安全**: 速率限制 (Upstash Ratelimit)；CSP 策略；AI 安全措施；审计日志；反馈防刷 |
| | | **实施**: Phase 1 调整为 15 天；新增 Phase 2.5 (运营基础)；测试策略补充 |
| | | **分类数据**: 补全全部 12 个学科门类 |
| | | **API**: 增加 error response 格式 (RATE_LIMITED, CONTENT_REVIEW_FAILED, ALREADY_VOTED) |

---

> **文档维护**: 本文档随项目迭代持续更新。每次阶段性开发完成后，更新对应章节的完成状态。
> 如需回溯历史版本，请查看版本控制 (Git) 中的该文件历史，或查阅 [附录 A: 变更日志](#附录-a-变更日志)。
