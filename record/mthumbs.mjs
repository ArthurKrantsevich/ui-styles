// Чистые кадры экрана телефона в каждом стиле — для обложек шортсов: node record/thumbs.mjs <lang>
import { chromium } from "/home/john-smith/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs";
const lang = process.argv[2] ?? "ru";
const out = new URL("../../../studio/public/long/uistyles/", import.meta.url).pathname;
const b = await chromium.launch({ executablePath: process.env.CHROME });
for (const id of ["skeuo", "material", "neu", "brutal", "clay", "bento", "glass"]) {
  const p = await b.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
  await p.goto(`http://localhost:5195/?rec=m&lang=${lang}#/style/${id}`);
  await p.waitForLoadState("networkidle"); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  await p.locator(".stage").screenshot({ path: `${out}mthumb_${id}.png` });
  await p.close();
}
await b.close();
