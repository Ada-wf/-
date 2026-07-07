const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const careersDir = path.join(process.cwd(), "content", "careers");

function extractItems(text) {
  return text.split("\n").filter(l => l.trim().startsWith("-")).map(l => l.trim().replace(/^- /, "").trim()).filter(Boolean);
}

function extractSection(content, heading) {
  const esc = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp("## " + esc + "\n\n([\\s\\S]*?)(?=\n## |\n---|$)", "");
  const m = content.match(re);
  return m ? m[1].trim() : "";
}

const files = fs.readdirSync(careersDir).filter(f => f.endsWith(".md"));

for (const file of files) {
  const fp = path.join(careersDir, file);
  const raw = fs.readFileSync(fp, "utf-8");
  const parsed = matter(raw);
  const data = parsed.data;
  const content = parsed.content;

  if (!data.overview) data.overview = extractSection(content, "\u5de5\u4f5c\u6982\u8ff0");
  if (!data.responsibilities) {
    data.responsibilities = extractItems(extractSection(content, "\u4e3b\u8981\u804c\u8d23"));
  }
  if (!data.typicalDay) {
    const td = extractSection(content, "\u5178\u578b\u7684\u4e00\u5929");
    if (td) data.typicalDay = td;
  }
  if (!data.suggestion) {
    data.suggestion = { personalityFit: [], skillsRequired: [], summary: "" };
    const sec = extractSection(content, "\u9009\u62e9\u5efa\u8bae");
    const h3 = String.fromCharCode(0x23, 0x23, 0x23);
    const fitM = sec.match(new RegExp(h3 + " " + String.fromCharCode(0x9002, 0x5408, 0x7684, 0x6027, 0x683c, 0x7279, 0x8d28) + "\n\n([\\s\\S]*?)(?=\n" + h3 + " )"));
    if (fitM) data.suggestion.personalityFit = extractItems(fitM[1]);
    const skillM = sec.match(new RegExp(h3 + " " + String.fromCharCode(0x9700, 0x8981, 0x7684, 0x80fd, 0x529b, 0x2f, 0x6280, 0x80fd) + "\n\n([\\s\\S]*?)(?=\n" + h3 + " )"));
    if (skillM) data.suggestion.skillsRequired = extractItems(skillM[1]);
    const sumM = sec.match(new RegExp(h3 + " " + String.fromCharCode(0x4ec0, 0x4e48, 0x6837, 0x7684, 0x4eba, 0x9002, 0x5408, 0x9009, 0x62e9, 0x8fd9, 0x4e2a, 0x804c, 0x4e1a) + "\n\n([\\s\\S]*?)(?=\n" + h3 + " |$)"));
    if (sumM) data.suggestion.summary = sumM[1].trim();
    const notM = sec.match(new RegExp(h3 + " " + String.fromCharCode(0x53ef, 0x80fd, 0x4e0d, 0x9002, 0x5408, 0x7684, 0x60c5, 0x51b5) + "\n\n([\\s\\S]*?)$"));
    if (notM) data.suggestion.notForYou = notM[1].trim();
  }

  const newContent = matter.stringify(content, data);
  fs.writeFileSync(fp, newContent, "utf-8");
  console.log(file + " updated: responsibilities=" + (data.responsibilities?.length || 0));
}
