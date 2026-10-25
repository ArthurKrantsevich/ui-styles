// Запись сценариев «7 стилей»: настоящий Chromium, кадры через CDP screencast → mp4 30 к/с.
//   node record/record.mjs [имя_клипа …]   (по умолчанию — все)
import { chromium } from "/home/john-smith/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { CLIPS, setSlow } from "./clips.mjs";

const OUT = new URL("../../../studio/public/long/uistyles/", import.meta.url).pathname;
const W0 = 1280, H0 = 960;

// курсор-актёр поверх страницы: следует за mousemove, сжимается на mousedown
const CURSOR = `
  addEventListener('DOMContentLoaded', () => {
    const c = document.createElement('div');
    c.innerHTML = '<svg width="34" height="40" viewBox="0 0 27 32"><path d="M3 2 L3 26 L9.5 20 L14 30 L18 28 L13.5 18.5 L22 18.5 Z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';
    Object.assign(c.style, {position:'fixed',left:'0',top:'0',zIndex:99999,pointerEvents:'none',transition:'transform .08s',filter:'drop-shadow(0 4px 6px rgba(0,0,0,.3))',transformOrigin:'4px 3px'});
    document.body.appendChild(c);
    let x = -100, y = -100, s = 1;
    const put = () => c.style.transform = 'translate(' + (x-4) + 'px,' + (y-3) + 'px) scale(' + s + ')';
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; put(); }, true);
    addEventListener('mousedown', () => { s = .82; put(); }, true);
    addEventListener('mouseup', () => { s = 1; put(); }, true);
    put();
  });`;

// касание пальцем для записей «телефона»: круг, который сжимается при нажатии
const TOUCH = CURSOR.replace(
  `'<svg width="34" height="40" viewBox="0 0 27 32"><path d="M3 2 L3 26 L9.5 20 L14 30 L18 28 L13.5 18.5 L22 18.5 Z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>'`,
  `'<div style="width:44px;height:44px;border-radius:50%;background:rgba(20,20,20,.28);border:3px solid rgba(255,255,255,.9);box-shadow:0 2px 10px rgba(0,0,0,.3)"></div>'`,
).replace("transformOrigin:'4px 3px'", "transformOrigin:'22px 22px',marginLeft:'-18px',marginTop:'-19px'");

const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(CLIPS);
const browser = await chromium.launch({ executablePath: process.env.CHROME });
for (const name of names) {
  const [W, H] = CLIPS[name].vp ?? [W0, H0];
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: CLIPS[name].dpr ?? 1 });
  await ctx.addInitScript(CLIPS[name].touch ? TOUCH : CURSOR);
  const page = await ctx.newPage();
  await page.goto(`http://localhost:5195/${CLIPS[name].q ?? "?rec&lang=ru"}#/${CLIPS[name].view ?? ""}`);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  const dir = `${OUT}${name}_frames/`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    const f = `${dir}${String(frames.length).padStart(5, "0")}.jpg`;
    writeFileSync(f, Buffer.from(data, "base64"));
    frames.push({ f, t: metadata.timestamp });
    await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  const dpr = CLIPS[name].dpr ?? 1;
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 95, maxWidth: W * dpr, maxHeight: H * dpr, everyNthFrame: 1 });
  await page.waitForTimeout(600);
  // тяжёлые сцены (стекло, морфинг) пишем в замедленном времени и потом ускоряем — так кадры идут ровно
  const slow = CLIPS[name].slow ?? 1;
  setSlow(slow);
  if (slow > 1) await cdp.send("Animation.setPlaybackRate", { playbackRate: 1 / slow });
  const t0 = Date.now();
  await CLIPS[name].run(page);
  await page.waitForTimeout(800);
  await cdp.send("Page.stopScreencast");
  // кадры приходят только при изменениях → собираем по меткам времени в ровные 30 к/с
  const list = frames.map((fr, i) => `file '${fr.f}'\nduration ${((frames[i + 1]?.t ?? fr.t + 0.5) - fr.t).toFixed(4)}`).join("\n") + `\nfile '${frames.at(-1).f}'\n`;
  writeFileSync(`${dir}list.txt`, list);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", `${dir}list.txt`, "-vf", `setpts=PTS/${slow},fps=30,format=yuv420p`, "-c:v", "libx264", "-crf", "14", "-preset", "slow", `${OUT}${name}.mp4`]);
  rmSync(dir, { recursive: true, force: true });
  console.log(`${name}: ${frames.length} кадров, ${((Date.now() - t0) / 1000).toFixed(1)} с`);
  await ctx.close();
}
await browser.close();
