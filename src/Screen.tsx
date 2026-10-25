import { useEffect, useRef, useState } from "react";
import { UI, UI_EXTRA, type Lang } from "./i18n";
import type { StyleId } from "./styles";

/** Один и тот же экран «Утро» — меняется только data-style. Разметка общая для всех семи стилей. */
export function Screen({ style, fix, liquid, lang, mini }: { style: StyleId; fix: boolean; liquid: boolean; lang: Lang; mini?: boolean }) {
  const [focus, setFocus] = useState(true);
  const [chip, setChip] = useState(0);
  const [pos, setPos] = useState(38);
  const t = (k: Exclude<keyof typeof UI, "chips">) => UI[k][lang];
  const glass = style === "glass" && liquid && !mini;
  return (
    <div className="scr" data-style={style} data-fix={fix ? "" : undefined} data-liquid={glass ? "" : undefined} data-mini={mini ? "" : undefined}>
      <div className="scr-bg" aria-hidden="true" />
      <header className="w w-head">
        <span className="avatar" aria-hidden="true">А</span>
        <div className="head-text">
          <b>{t("hello")}</b>
          <span>{t("date")}</span>
        </div>
        <label className="search">
          <span className="sr">{t("search")}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input placeholder={t("search")} tabIndex={mini ? -1 : 0} />
        </label>
      </header>

      <section className="w w-player" aria-label={t("nowPlaying")}>
        <div className="p-top">
          <div className="cover" aria-hidden="true"><i /></div>
          <div className="meta">
            <span className="eyebrow">{t("nowPlaying")}</span>
            <b>{t("track")}</b>
            <span>{t("artist")}</span>
          </div>
        </div>
        <input className="progress" type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} aria-label={t("position")} style={{ "--p": `${pos}%` } as React.CSSProperties} tabIndex={mini ? -1 : 0} />
        <div className="times"><span>1:24</span><span>3:41</span></div>
        <div className="controls">
          <button className="ctl" aria-label={t("prev")} tabIndex={mini ? -1 : 0}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14M19 5 9 12l10 7z" /></svg>
          </button>
          <button id="play" className="ctl play" aria-label={t("play")} tabIndex={mini ? -1 : 0}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
          </button>
          <button className="ctl" aria-label={t("next")} tabIndex={mini ? -1 : 0}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5v14M5 5l10 7-10 7z" /></svg>
          </button>
        </div>
      </section>

      <section className="w w-weather">
        <span className="sun" aria-hidden="true" />
        <b className="big">+18°</b>
        <span>{t("weather")}</span>
        <div className="hours">
          {[["09", "+14°"], ["12", "+18°"], ["15", "+19°"], ["18", "+16°"]].map(([h, d]) => (
            <div key={h}><span>{h}:00</span><b>{d}</b></div>
          ))}
        </div>
      </section>

      <section className="w w-focus">
        <div className="f-top">
          <div>
            <b>{t("focus")}</b>
            <span>{t("focusSub")}</span>
          </div>
          <button id="focus" className="switch" role="switch" aria-checked={focus} aria-label={t("focus")} onClick={() => setFocus((v) => !v)} tabIndex={mini ? -1 : 0}>
            <i />
          </button>
        </div>
        <div className="timer">
          <b>25:00</b>
          <span>{t("untilBreak")}</span>
        </div>
      </section>

      <section className="w w-steps">
        <span className="label">{t("steps")}</span>
        <b className="big">8 421</b>
        <span>{t("goal")}</span>
        <div className="meter" aria-hidden="true"><i /></div>
        <div className="bars" aria-hidden="true">
          {[62, 80, 45, 92, 70, 100, 84].map((h, i) => (
            <div key={i}><i style={{ height: `${h}%` }} className={i === 6 ? "today" : ""} /><span>{UI_EXTRA.days[lang][i]}</span></div>
          ))}
        </div>
      </section>

      <section className="w w-chips" role="radiogroup" aria-label={t("steps")}>
        {UI.chips.map((c, i) => (
          <button key={i} className="chip" role="radio" aria-checked={chip === i} onClick={() => setChip(i)} tabIndex={mini ? -1 : 0}>
            {c[lang]}
          </button>
        ))}
      </section>

      <button id="cta" className="w w-cta" tabIndex={mini ? -1 : 0}>{t("start")} →</button>
      {glass && <Refraction />}
    </div>
  );
}

/** Карта смещения для «жидкого стекла»: у краёв картинка под стеклом втягивается внутрь, как в линзе.
 *  Красный канал — сдвиг по X, зелёный — по Y; 128 — без сдвига. Для каждого виджета своя карта по его размеру. */
function lensMap(w: number, h: number, r: number, edge: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // расстояние от края скруглённого прямоугольника внутрь (SDF) и направление к центру
      const px = x + 0.5 - w / 2, py = y + 0.5 - h / 2;
      const ax = Math.abs(px) - (w / 2 - r), ay = Math.abs(py) - (h / 2 - r);
      const d = r - Math.hypot(Math.max(ax, 0), Math.max(ay, 0)) - Math.min(Math.max(ax, ay), 0);
      let dx = 0, dy = 0;
      if (d < edge) {
        const k = Math.pow(1 - Math.max(d, 0) / edge, 2);
        const ex = Math.max(Math.abs(px) - (w / 2 - edge), 0), ey = Math.max(Math.abs(py) - (h / 2 - edge), 0);
        const n = Math.hypot(ex, ey) || 1;
        dx = (-Math.sign(px) * ex / n) * k;
        dy = (-Math.sign(py) * ey / n) * k;
      }
      const i = (y * w + x) * 4;
      img.data[i] = 128 + dx * 127;
      img.data[i + 1] = 128 + dy * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function Refraction() {
  const ref = useRef<SVGSVGElement>(null);
  const [maps, setMaps] = useState<{ id: string; w: number; h: number; url: string }[]>([]);
  useEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) return;
    const build = () => {
      const out: typeof maps = [];
      root.querySelectorAll<HTMLElement>(".w").forEach((el, i) => {
        const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
        if (!w || !h) return;
        const r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 24;
        const id = `refract-${i}`;
        el.style.setProperty("--refract", `url(#${id})`);
        out.push({ id, w, h, url: lensMap(w, h, Math.min(r, w / 2, h / 2), Math.min(30, h / 3)) });
      });
      setMaps(out);
    };
    build();
    const ro = new ResizeObserver(() => build());
    root.querySelectorAll(".w").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);
  return (
    <svg ref={ref} width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      {maps.map((m) => (
        <filter key={m.id} id={m.id} x="0" y="0" width={m.w} height={m.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feImage href={m.url} x="0" y="0" width={m.w} height={m.h} result="map" preserveAspectRatio="none" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="46" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      ))}
    </svg>
  );
}
