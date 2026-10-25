// Сценарии записи «7 стилей». view — экран (#/view), vp — размер окна, q — параметры адреса, run — действия.
let mx = 640, my = 900;
// замедление записи: все паузы и движения длиннее в SLOW раз, анимации страницы — медленнее (см. record.mjs)
let SLOW = 1;
export const setSlow = (k) => { SLOW = k; };
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const moveTo = async (p, tx, ty, ms = 600) => {
  const n = Math.max(1, Math.round((ms * SLOW) / 16)); const sx = mx, sy = my;
  for (let i = 1; i <= n; i++) { const e = ease(i / n); await p.mouse.move(sx + (tx - sx) * e, sy + (ty - sy) * e); await p.waitForTimeout(16); }
  mx = tx; my = ty;
};
const box = async (p, sel) => p.locator(sel).first().boundingBox();
const go = async (p, sel, ms) => { const b = await box(p, sel); await moveTo(p, b.x + b.width / 2, b.y + b.height / 2, ms); };
const click = async (p, sel, hold = 80) => { await go(p, sel); await p.waitForTimeout(120 * SLOW); await p.mouse.down(); await p.waitForTimeout(hold * SLOW); await p.mouse.up(); };
const wait = (p, ms) => p.waitForTimeout(ms * SLOW);
const start = async (p) => { const v = p.viewportSize(); mx = v.width / 2; my = v.height - 40; await p.mouse.move(mx, my); await p.evaluate(() => document.fonts.ready); };
const away = (p) => moveTo(p, p.viewportSize().width - 60, p.viewportSize().height - 40, 700);

// живой экран: плеер, переключатель, чипы, главная кнопка
const play = async (p) => {
  await start(p); await wait(p, 900);
  await click(p, "#play", 450); await wait(p, 700);
  await click(p, "#focus"); await wait(p, 900);
  await click(p, "#focus"); await wait(p, 700);
  await click(p, ".chip:nth-child(2)"); await wait(p, 700);
  await click(p, ".chip:nth-child(3)"); await wait(p, 700);
  await click(p, "#cta", 500); await wait(p, 900);
  await away(p); await wait(p, 1500);
};
// главный минус → исправление → назад → снова исправление
const fix = async (p) => {
  await start(p); await wait(p, 1500);
  await click(p, "#fix"); await away(p); await wait(p, 2600);
  await click(p, "#fix"); await away(p); await wait(p, 1600);
  await click(p, "#fix"); await away(p); await wait(p, 2600);
};

const IDS = ["skeuo", "material", "neu", "brutal", "clay", "bento", "glass"];
// вертикальные записи для шортсов: экран телефона, касания вместо курсора
const jsClick = (p, sel) => p.evaluate((q) => document.querySelector(q).click(), sel);
const M = { vp: [430, 932], dpr: 2, touch: true, q: "?rec=m&lang=ru" };
const mPlay = (id, prev) => async (p) => {
  await start(p); await jsClick(p, `#s-${prev}`); await wait(p, 1300);
  await jsClick(p, `#s-${id}`); await wait(p, 1800);
  await click(p, "#play", 450); await wait(p, 600);
  await click(p, "#focus"); await wait(p, 800);
  await click(p, "#focus"); await wait(p, 600);
  await click(p, ".chip:nth-child(2)"); await wait(p, 600);
  await click(p, "#cta", 500); await wait(p, 900);
  await away(p); await wait(p, 1200);
};
const mFix = async (p) => {
  await start(p); await wait(p, 1800);
  await jsClick(p, "#fix"); await wait(p, 3200);
  await click(p, "#cta", 450); await away(p); await wait(p, 1500);
};
const MSHORT = Object.fromEntries(IDS.flatMap((id, i) => [
  [`m_${id}`, { ...M, view: `style/${id}`, slow: id === "glass" ? 4 : 1, run: mPlay(id, IDS[(i + 6) % 7]) }],
  [`m_${id}_fix`, { ...M, view: `style/${id}`, slow: id === "glass" ? 4 : 1, run: mFix }],
]));

export const CLIPS = {
  ...MSHORT,
  m_material_shape: { ...M, view: "style/material", run: async (p) => {
    await start(p); await jsClick(p, "#fix"); await wait(p, 1400);
    for (let i = 0; i < 3; i++) { await click(p, "#play", 700); await wait(p, 900); }
    await click(p, "#cta", 700); await wait(p, 900); await away(p); await wait(p, 600);
  } },
  m_glass_frost: { ...M, view: "style/glass", slow: 4, run: async (p) => {
    await start(p); await wait(p, 1200);
    await jsClick(p, "#liquid"); await wait(p, 2800);
    await jsClick(p, "#liquid"); await wait(p, 3200);
  } },
  intro: { view: "style/skeuo", vp: [1600, 900], slow: 4, run: async (p) => {
    await start(p); await wait(p, 900);
    for (const id of IDS.slice(1)) { await click(p, `#s-${id}`); await wait(p, 1250); }
    await away(p); await wait(p, 1500);
  } },
  all: { view: "all", vp: [1600, 900], q: "?lang=ru", run: async (p) => {
    await start(p); await wait(p, 800);
    for (const id of IDS) { await go(p, `#m-${id}`, 520); await wait(p, 420); }
    await away(p); await wait(p, 1200);
  } },
  ...Object.fromEntries(IDS.flatMap((id) => [
    [id, { view: `style/${id}`, run: play, slow: id === "glass" ? 4 : 1 }],
    [`${id}_fix`, { view: `style/${id}`, run: fix, slow: id === "glass" ? 4 : 1 }],
  ])),
  // Material Expressive: в исправленном виде кнопка меняет форму при нажатии
  material_shape: { view: "style/material", run: async (p) => {
    await start(p); await click(p, "#fix"); await wait(p, 1400);
    for (let i = 0; i < 3; i++) { await click(p, "#play", 700); await wait(p, 900); }
    await click(p, "#cta", 700); await wait(p, 900); await away(p); await wait(p, 800);
  } },
  // стекло: жидкое → матовое 2020 → снова жидкое
  glass_frost: { view: "style/glass", slow: 4, run: async (p) => {
    await start(p); await wait(p, 1200);
    await click(p, "#liquid"); await away(p); await wait(p, 2800);
    await click(p, "#liquid"); await away(p); await wait(p, 3200);
  } },
};
