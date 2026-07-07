const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const dest = path.join('D:', '\u6C42\u804C\u57CE\u5E02\u7F51', 'public', 'images', 'careers');
fs.mkdirSync(dest, { recursive: true });

const images = {
  'ai-engineer': 'https://s.coze.cn/image/0tyF3AyaMYg/',
  'data-scientist': 'https://s.coze.cn/image/2n1iEO0yEgg/',
  'doctor': 'https://s.coze.cn/image/kQHMkmhtR8A/',
  'lawyer': 'https://s.coze.cn/image/2G-_xlR1FUc/',
  'product-manager': 'https://s.coze.cn/image/49FjpJ3UFF0/',
  'software-engineer': 'https://s.coze.cn/image/_KQKIinL0AE/',
  'teacher': 'https://s.coze.cn/image/Qd66tQPeK5g/'
};

function download(url, filePath) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, filePath).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        fs.writeFileSync(filePath, Buffer.concat(chunks));
        const kb = (Buffer.concat(chunks).length / 1024).toFixed(1);
        console.log(`  OK: ${path.basename(filePath)} (${kb} KB)`);
        resolve();
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  for (const [name, url] of Object.entries(images)) {
    const outPath = path.join(dest, name + '.webp');
    console.log(`Downloading ${name}...`);
    try {
      await download(url, outPath);
    } catch (e) {
      console.log(`  ERROR: ${e.message}`);
    }
  }
  console.log('All done!');
})();
