const fs = require("fs");
const dir = "D:\\求职城市网\\content\\careers\\";
const files = [
  "physicist.md","biologist.md","statistician.md","materials-scientist.md",
  "surgeon.md","pharmacist.md","judge.md","legal-consultant.md",
  "agricultural-scientist.md","bioinformatician.md",
  "hr-specialist.md","social-worker.md","editor.md","game-artist.md",
  "economic-analyst.md","financial-analyst.md"
];
for (const f of files) {
  let content = fs.readFileSync(dir + f, "utf-8");
  content = content.replace(/^(  - \*\*.*)$/gm, "  - '" + "$&" + "'");
  fs.writeFileSync(dir + f, content, "utf-8");
  console.log("Fixed " + f);
}
console.log("Done");
