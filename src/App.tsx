import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { UI, useLang, type Lang } from "./i18n";
import { Screen } from "./Screen";
import { SCORE_KEYS, STYLES, type StyleId } from "./styles";

const VIEWS = [
  { id: "", label: UI.viewStyles },
  { id: "all", label: UI.viewAll },
  { id: "choose", label: UI.viewChoose },
];

// #/view/style — экран и выбранный стиль; ?rec — режим записи: без меню и боковой панели
const readHash = () => {
  const [view = "", style = ""] = location.hash.replace(/^#\/?/, "").split("/");
  return { view: view === "style" ? "" : view, style: (STYLES.find((s) => s.id === style)?.id ?? "skeuo") as StyleId };
};
const useHash = () => {
  const [h, setH] = useState(readHash);
  useEffect(() => {
    const on = () => setH(readHash());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return h;
};
const REC = new URLSearchParams(location.search).has("rec");
/** 1,5:1 → 1.5:1 в английском */
const num = (v: string, lang: Lang) => (lang === "en" ? v.replace(",", ".") : v);

/** Смена состояния с морфингом: виджеты плавно перетекают в новый стиль (View Transitions API). */
const morph = (fn: () => void) => {
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (d.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) d.startViewTransition(() => flushSync(fn));
  else fn();
};

export function App() {
  const [lang, setLang] = useLang();
  const { view, style: hashStyle } = useHash();
  return (
    <div className="app" data-rec={REC ? "" : undefined}>
      {!REC && (
        <nav className="nav" aria-label="Menu">
          <span className="logo">
            <i>7</i>
            {UI.logo[lang]}
          </span>
          {VIEWS.map((v) => (
            <a key={v.id} href={`#/${v.id}`} aria-current={view === v.id ? "page" : undefined}>
              {v.label[lang]}
            </a>
          ))}
          <span className="nav-gap" />
          <div className="seg" role="radiogroup" aria-label="Language">
            {(["ru", "en"] as const).map((l) => (
              <button key={l} id={`lang-${l}`} role="radio" aria-checked={lang === l} onClick={() => setLang(l)}>
                {l === "ru" ? "RU" : "EN"}
              </button>
            ))}
          </div>
        </nav>
      )}
      {view === "" && <Styles lang={lang} initial={hashStyle} />}
      {view === "all" && <All lang={lang} />}
      {view === "choose" && <Choose lang={lang} />}
    </div>
  );
}

function Styles({ lang, initial }: { lang: Lang; initial: StyleId }) {
  const [id, setId] = useState<StyleId>(initial);
  const [fix, setFix] = useState(false);
  const [liquid, setLiquid] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const s = STYLES.find((x) => x.id === id)!;
  const timer = useRef<number>(undefined);

  useEffect(() => { setId(initial); setFix(false); }, [initial]);
  const pick = (next: StyleId) => morph(() => {
    setId(next);
    setFix(false);
    history.replaceState(null, "", `${location.search}#/style/${next}`);
  });
  // «Прокрутить все»: стили по очереди, по 1,6 с
  useEffect(() => {
    if (!playing) return;
    let i = STYLES.findIndex((x) => x.id === id);
    timer.current = window.setInterval(() => {
      i = (i + 1) % STYLES.length;
      morph(() => { setId(STYLES[i].id); setFix(false); });
      if (i === STYLES.length - 1) { window.clearInterval(timer.current); setPlaying(false); }
    }, 1600);
    return () => window.clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const css = s.css.join("\n");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* буфер обмена недоступен — CSS виден на панели */
    }
  };

  return (
    <main className="styles">
      <div className="picker" role="radiogroup" aria-label={UI.viewStyles[lang]}>
        {STYLES.map((x) => (
          <button key={x.id} id={`s-${x.id}`} role="radio" aria-checked={x.id === id} onClick={() => pick(x.id)}>
            <small>{x.year}</small>
            {x.name[lang]}
          </button>
        ))}
        <span className="nav-gap" />
        {REC && id === "glass" && (
          <button id="liquid" className="pill" onClick={() => morph(() => setLiquid((v) => !v))}>
            {liquid ? UI.frosted[lang] : UI.liquid[lang]}
          </button>
        )}
        {REC && (
          <button id="fix" className={`pill ${fix ? "" : "accent"}`} onClick={() => morph(() => setFix((v) => !v))}>
            {fix ? UI.fixOff[lang] : `✓ ${UI.fixOn[lang]}`}
          </button>
        )}
        <button id="play-all" className="pill" onClick={() => { setId("skeuo"); setPlaying(true); }} disabled={playing}>
          ▶{REC ? "" : ` ${UI.morph[lang]}`}
        </button>
      </div>
      <div className="stage">
        <Screen style={id} fix={fix} liquid={liquid} lang={lang} />
      </div>
      {!REC && (
        <aside className="info">
          <div className="info-head">
            <span className="year">{s.year}</span>
            <h1>{s.name[lang]}</h1>
            <p>{s.tagline[lang]}</p>
          </div>
          <div className="where"><b>{UI.where[lang]}</b> {s.where[lang]}</div>
          <div className="pc">
            <div><h2>{UI.pros[lang]}</h2>{s.pros.map((p) => <p key={p.en} className="pro">{p[lang]}</p>)}</div>
            <div><h2>{UI.cons[lang]}</h2>{s.cons.map((p) => <p key={p.en} className="con">{p[lang]}</p>)}</div>
          </div>
          <div className="fixbox">
            <h2>{UI.fixTitle[lang]}</h2>
            <p>{s.fix.problem[lang]}</p>
            <div className="metric">
              <span className={fix ? "old" : "bad"}>{num(s.fix.before, lang)}</span>
              <span aria-hidden="true">→</span>
              <span className={fix ? "good" : "old"}>{num(s.fix.after, lang)}</span>
              <small>{s.fix.metric[lang]}</small>
            </div>
            <p className="how">{s.fix.how[lang]}</p>
            <div className="btn-row">
              <button className={`btn ${fix ? "" : "primary"}`} onClick={() => morph(() => setFix((v) => !v))}>
                {fix ? UI.fixOff[lang] : UI.fixOn[lang]}
              </button>
              {id === "glass" && (
                <button className="btn" onClick={() => morph(() => setLiquid((v) => !v))}>
                  {liquid ? UI.frosted[lang] : UI.liquid[lang]}
                </button>
              )}
            </div>
          </div>
          <Scores s={s.score} lang={lang} />
          <div className="codebox">
            <h2>{UI.code[lang]}</h2>
            <pre className="code">{css}</pre>
            <button className="btn wide" onClick={copy}>{copied ? UI.copied[lang] : UI.copy[lang]}</button>
          </div>
        </aside>
      )}
    </main>
  );
}

function Scores({ s, lang }: { s: (typeof STYLES)[number]["score"]; lang: Lang }) {
  return (
    <div className="scores">
      {SCORE_KEYS.map((k) => (
        <div key={k} className="score">
          <span>{UI[k][lang]}</span>
          <div className="dots5" aria-label={`${s[k]} / 5`}>
            {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= s[k] ? "on" : ""} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function All({ lang }: { lang: Lang }) {
  return (
    <main className="all">
      {STYLES.map((s) => (
        <a key={s.id} className="mini" href={`#/style/${s.id}`} id={`m-${s.id}`}>
          <div className="mini-frame"><div className="mini-inner"><Screen style={s.id} fix={false} liquid={false} lang={lang} mini /></div></div>
          <span><small>{s.year}</small> {s.name[lang]}</span>
        </a>
      ))}
      <div className="mini mini-note">
        <b>{UI.title[lang]}</b>
        <span>{lang === "ru" ? "Один экран, семь стилей. Откройте любой — внутри плюсы, минусы и CSS." : "One screen, seven styles. Open any — pros, cons and CSS inside."}</span>
      </div>
    </main>
  );
}

function Choose({ lang }: { lang: Lang }) {
  return (
    <main className="choose">
      <h1>{UI.chooseTitle[lang]}</h1>
      <p className="sub">{UI.chooseSub[lang]}</p>
      <table>
        <thead>
          <tr>
            <th />
            {SCORE_KEYS.map((k) => <th key={k}>{UI[k][lang]}</th>)}
            <th>{UI.when[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {STYLES.map((s) => (
            <tr key={s.id} onClick={() => (location.hash = `#/style/${s.id}`)}>
              <th><small>{s.year}</small> {s.name[lang]}</th>
              {SCORE_KEYS.map((k) => (
                <td key={k}><span className={`sc sc${s.score[k]}`}>{s.score[k]}</span></td>
              ))}
              <td className="when">{s.when[lang]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
