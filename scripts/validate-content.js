const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const yaml = require("js-yaml");

const ROOT = process.cwd();
const CAREERS_DIR = path.join(ROOT, "content/careers");
const CATEGORIES_FILE = path.join(ROOT, "content/categories/tsinghua-categories.yaml");

const errors = [];
const warnings = [];

// Load category YAML
let validDisciplines = new Set();
let validSchools = new Set();
let validMajors = new Set();
let allCareerSlugsFromYaml = new Set();

try {
  const rawYaml = fs.readFileSync(CATEGORIES_FILE, "utf-8");
  const data = yaml.load(rawYaml);
  for (const d of data.disciplines) {
    validDisciplines.add(d.id);
    for (const s of d.schools || []) {
      validSchools.add(s.id);
      for (const m of s.majors || []) {
        validMajors.add(m.id);
        for (const slug of m.careerSlugs || []) {
          allCareerSlugsFromYaml.add(slug);
        }
      }
    }
  }
  console.log(`[OK] 分类数据加载: ${validDisciplines.size} 门类, ${validSchools.size} 学院, ${validMajors.size} 专业`);
} catch (e) {
  errors.push({ file: "tsinghua-categories.yaml", field: "yaml", message: `加载失败: ${e.message}` });
}

// Read all career files
const files = fs.readdirSync(CAREERS_DIR).filter(f => f.endsWith(".md"));
console.log(`[INFO] 共发现 ${files.length} 个职业文件\n`);

const yamlSlugs = new Set();
const disciplineCounts = {};

for (const file of files) {
  const filePath = path.join(CAREERS_DIR, file);
  const content = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(content);
  const data = parsed.data;
  const slug = data.slug || path.basename(file, ".md");
  const slugFromFile = path.basename(file, ".md");

  // Track discipline counts
  const disc = data.categoryPath?.discipline?.name || "unknown";
  disciplineCounts[disc] = (disciplineCounts[disc] || 0) + 1;

  // Check slug match
  if (slug !== slugFromFile) {
    errors.push({ file, field: "slug", message: `frontmatter slug "${slug}" 与文件名 "${slugFromFile}" 不匹配` });
  }

  // Required top-level fields
  const requiredFields = ["slug", "name", "tagline", "categoryPath", "overview", "responsibilities", "suggestion", "tags", "source", "metadata"];
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push({ file, field, message: `缺少必需字段` });
    }
  }

  // categoryPath validation
  if (data.categoryPath) {
    const cp = data.categoryPath;
    if (!validDisciplines.has(cp.discipline?.id)) {
      errors.push({ file, field: "categoryPath.discipline.id", message: `无效的门类ID: ${cp.discipline?.id}` });
    }
    if (!validSchools.has(cp.school?.id)) {
      errors.push({ file, field: "categoryPath.school.id", message: `无效的学院ID: ${cp.school?.id}` });
    }
    if (!validMajors.has(cp.major?.id)) {
      errors.push({ file, field: "categoryPath.major.id", message: `无效的专业ID: ${cp.major?.id}` });
    }
  }

  // source validation
  if (data.source && !["curated", "ai-generated"].includes(data.source)) {
    errors.push({ file, field: "source", message: `无效的source值: ${data.source}` });
  }

  // education validation
  const validEducation = ["高中", "大专", "本科", "硕士", "博士"];
  if (data.educationRequired && !validEducation.includes(data.educationRequired)) {
    errors.push({ file, field: "educationRequired", message: `无效值: ${data.educationRequired}` });
  }

  // outlook validation
  const validOutlook = ["growth", "stable", "declining", "emerging"];
  if (data.industryOutlook && !validOutlook.includes(data.industryOutlook)) {
    errors.push({ file, field: "industryOutlook", message: `无效值: ${data.industryOutlook}` });
  }

  // relatedCareers validation
  if (data.relatedCareers) {
    for (const rc of data.relatedCareers) {
      const exists = files.some(f => path.basename(f, ".md") === rc);
      if (!exists) {
        warnings.push(`${file}: relatedCareers 引用了不存在的职业 "${rc}"`);
      }
    }
  }

  // Check concept image
  if (!data.conceptImage?.url) {
    warnings.push(`${file}: 缺少概念图 (conceptImage.url 为空)`);
  }

  // Check YAML registration
  if (allCareerSlugsFromYaml.has(slug)) {
    yamlSlugs.add(slug);
  } else {
    warnings.push(`${file}: 职业 "${slug}" 未在分类 YAML 中注册`);
  }
}

// Print summary
console.log("=== 内容校验结果 ===\n");
console.log("学科分布:");
for (const [name, count] of Object.entries(disciplineCounts).sort(([, a], [, b]) => b - a)) {
  const bar = "\u2588".repeat(Math.round(count / 2));
  console.log(`  ${name.padEnd(8)} ${String(count).padStart(2)} ${bar}`);
}
console.log();

if (errors.length > 0) {
  console.log(`\u274c 错误 (${errors.length}):`);
  for (const e of errors) {
    console.log(`  [${e.file}] ${e.field}: ${e.message}`);
  }
  console.log();
}

if (warnings.length > 0) {
  console.log(`\u26a0\ufe0f  警告 (${warnings.length}):`);
  for (const w of warnings) {
    console.log(`  \u26a0\ufe0f  ${w}`);
  }
  console.log();
}

console.log(`\ud83d\udcca 总计: ${files.length} 个文件, ${errors.length} 个错误, ${warnings.length} 个警告`);
console.log(`    YAML 注册: ${yamlSlugs.size}/${files.length}`);

if (errors.length === 0) {
  console.log("\n\u2705 全部校验通过!");
} else {
  console.log("\n\u274c 存在校验错误，请修复后重试。");
  process.exit(1);
}
