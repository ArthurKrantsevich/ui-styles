// Скриншоты всех стилей (до и после исправления) для проверки: node record/shots.mjs <папка>
import { chromium } from "/home/john-smith/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs";
const out = process.argv[2];
const ids = ["skeuo", "material", "neu", "brutal", "clay", "bento", "glass"];
const b = await chromium.launch({ executablePath: process.env.CHROME });
const p = await b.newPage({ viewport: { width: 1280, height: 960 } });
for (const id of ids) {
  await p.goto(`http://localhost:5195/?rec&lang=ru#/style/${id}`);
  await p.waitForLoadState("networkidle"); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/${id}.png` });
  await p.click("#fix"); await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}/${id}-fix.png` });
}
for (const v of ["", "all", "choose"]) {
  await p.goto(`http://localhost:5195/?lang=en#/${v}`); await p.waitForLoadState("networkidle"); await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/view-${v || "styles"}.png` });
}
await b.close();
