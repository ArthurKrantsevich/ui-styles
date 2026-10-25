import type { T } from "./i18n";

/** Семь стилей: откуда взялся, где живёт, плюсы, минусы, главный минус и как его исправить, ключевой CSS. */
export type StyleId = "skeuo" | "material" | "neu" | "brutal" | "clay" | "bento" | "glass";

export type Score = { look: number; read: number; speed: number; a11y: number; scale: number };

export type Style = {
  id: StyleId;
  year: string;
  name: T;
  tagline: T;
  where: T;
  /** когда брать */
  when: T;
  pros: T[];
  cons: T[];
  /** главный минус → что меняем; before/after — измеренная цифра до и после */
  fix: { problem: T; how: T; before: string; after: string; metric: T };
  score: Score;
  css: string[];
};

export const STYLES: Style[] = [
  {
    id: "skeuo",
    year: "2007",
    name: { ru: "Скевоморфизм", en: "Skeuomorphism" },
    tagline: { ru: "Интерфейс притворяется вещью", en: "The interface pretends to be a thing" },
    where: { ru: "iOS 1–6, старый macOS; сегодня — тактильные детали в музыкальных и фото-приложениях", en: "iOS 1–6, early macOS; today — tactile details in music and photo apps" },
    when: { ru: "Музыкальные и фото-приложения, где важна «вещь»: ручки, плёнка, пульт", en: "Music and photo apps where the “object” matters: knobs, film, remotes" },
    pros: [
      { ru: "Понятно без обучения: кнопка похожа на кнопку", en: "No learning curve: a button looks like a button" },
      { ru: "Тактильно и запоминается", en: "Tactile and memorable" },
    ],
    cons: [
      { ru: "Шум: текстуры спорят с содержимым", en: "Noise: textures fight the content" },
      { ru: "Тяжело масштабировать и перекрашивать", en: "Hard to scale and re-theme" },
    ],
    fix: {
      problem: { ru: "Текстура везде — глазу не за что зацепиться", en: "Texture everywhere — nothing to focus on" },
      how: { ru: "Фон и карточки гладкие, объём — только у того, что нажимается", en: "Flat background and cards; depth only on what you can press" },
      before: "7",
      after: "2",
      metric: { ru: "текстур и градиентов на экране", en: "textures and gradients on screen" },
    },
    score: { look: 4, read: 3, speed: 3, a11y: 3, scale: 2 },
    css: [
      ".btn {",
      "  background: linear-gradient(#fdfdfd, #d8dadf);",
      "  border: 1px solid #8a8f99;",
      "  box-shadow: inset 0 1px 0 #fff,",
      "              0 1px 2px rgb(0 0 0 / .35);",
      "  text-shadow: 0 1px 0 #fff;",
      "}",
      ".btn:active {",
      "  background: linear-gradient(#cfd2d8, #e9ebee);",
      "  box-shadow: inset 0 2px 4px rgb(0 0 0 / .3);",
      "}",
    ],
  },
  {
    id: "material",
    year: "2014",
    name: { ru: "Material 3", en: "Material 3" },
    tagline: { ru: "Система: цвет из одного семени, формы и пружинная анимация", en: "A system: color from one seed, shapes and spring motion" },
    where: { ru: "Android, Gmail, Google Диск; Material 3 Expressive — с 2025 года", en: "Android, Gmail, Google Drive; Material 3 Expressive since 2025" },
    when: { ru: "Рабочие продукты и Android: формы, таблицы, много экранов", en: "Work products and Android: forms, tables, many screens" },
    pros: [
      { ru: "Готовая система с документацией и компонентами", en: "A full system with docs and components" },
      { ru: "Контраст и состояния продуманы заранее", en: "Contrast and states are designed upfront" },
    ],
    cons: [
      { ru: "Всё похоже на очередное приложение Google", en: "Everything looks like another Google app" },
      { ru: "Много правил — легко сделать «почти Material»", en: "Many rules — easy to end up “almost Material”" },
    ],
    fix: {
      problem: { ru: "Без своего характера приложение теряется среди других", en: "Without character the app gets lost among others" },
      how: { ru: "Своё цвет-семя и выразительные формы: кнопка меняет форму при нажатии", en: "Your own seed color and expressive shapes: the button morphs when pressed" },
      before: "1",
      after: "2",
      metric: { ru: "формы у кнопки: покой и нажатие", en: "button shapes: rest and press" },
    },
    score: { look: 3, read: 5, speed: 5, a11y: 5, scale: 5 },
    css: [
      ":root {",
      "  --seed: oklch(55% .17 290);",
      "  --surface: oklch(97% .015 290);",
      "  --container: oklch(92% .04 290);",
      "}",
      ".btn {",
      "  border-radius: 999px;",
      "  transition: border-radius .35s",
      "    cubic-bezier(.3, 1.6, .5, 1); /* пружина */",
      "}",
      ".btn:active { border-radius: 14px; }",
    ],
  },
  {
    id: "neu",
    year: "2019",
    name: { ru: "Неоморфизм", en: "Neumorphism" },
    tagline: { ru: "Элементы выдавлены из того же материала, что и фон", en: "Elements are pressed out of the background itself" },
    where: { ru: "Концепты на Dribbble, умный дом, калькуляторы и плееры", en: "Dribbble concepts, smart home panels, calculators and players" },
    when: { ru: "Только акценты: одна панель умного дома, плеер, калькулятор", en: "Accents only: a smart home panel, a player, a calculator" },
    pros: [
      { ru: "Мягко и спокойно, один цвет на всё", en: "Soft and calm, one color for everything" },
      { ru: "Нажатие видно без анимации: элемент вдавливается", en: "Press is visible without animation: the element sinks" },
    ],
    cons: [
      { ru: "Низкий контраст: края кнопок почти не видны", en: "Low contrast: button edges are barely visible" },
      { ru: "Непонятно, что нажимается, а что нет", en: "Hard to tell what is clickable" },
    ],
    fix: {
      problem: { ru: "Край кнопки — это тень с контрастом 1,5:1, а нужно хотя бы 3:1", en: "The button edge is a shadow at 1.5:1 — WCAG asks for 3:1" },
      how: { ru: "Рамка 1 px с контрастом 3:1, акцент у главного действия, текст темнее", en: "1px border at 3:1, accent on the main action, darker text" },
      before: "1,5:1",
      after: "3,6:1",
      metric: { ru: "контраст края кнопки", en: "button edge contrast" },
    },
    score: { look: 4, read: 2, speed: 4, a11y: 1, scale: 2 },
    css: [
      ".card {",
      "  background: #e3e7ee; /* как у фона */",
      "  box-shadow: -8px -8px 18px #ffffff,",
      "               8px  8px 18px #b8bfcc;",
      "}",
      ".btn:active {",
      "  box-shadow: inset -4px -4px 8px #ffffff,",
      "              inset  4px  4px 8px #b8bfcc;",
      "}",
      "/* исправление */",
      ".btn { border: 1px solid #6f788a; } /* 3,6:1 */",
    ],
  },
  {
    id: "brutal",
    year: "2021",
    name: { ru: "Необрутализм", en: "Neo-brutalism" },
    tagline: { ru: "Толстые рамки, жёсткие тени, смелые цвета", en: "Thick borders, hard shadows, bold colors" },
    where: { ru: "Gumroad, маркетинг Figma, лендинги стартапов и портфолио", en: "Gumroad, Figma marketing, startup landing pages and portfolios" },
    when: { ru: "Лендинг, портфолио, маркетинг — где надо запомниться", en: "Landing pages, portfolios, marketing — where you must stand out" },
    pros: [
      { ru: "Высокий контраст, запоминается с первого взгляда", en: "High contrast, memorable at first glance" },
      { ru: "Дёшево рисуется: ни размытия, ни градиентов", en: "Cheap to render: no blur, no gradients" },
    ],
    cons: [
      { ru: "Громко: на долгой работе утомляет", en: "Loud: tiring for long sessions" },
      { ru: "Когда кричит всё, главного не видно", en: "When everything shouts, nothing stands out" },
    ],
    fix: {
      problem: { ru: "Пять ярких цветов на экране — глаз не знает, куда смотреть", en: "Five bright colors on screen — the eye has nowhere to go" },
      how: { ru: "Спокойный фон, один яркий цвет — только у главного действия", en: "Calm background, one bright color — only on the main action" },
      before: "5",
      after: "1",
      metric: { ru: "ярких цветов на экране", en: "bright colors on screen" },
    },
    score: { look: 5, read: 4, speed: 5, a11y: 4, scale: 3 },
    css: [
      ".card {",
      "  background: #ffd84d;",
      "  border: 3px solid #111;",
      "  border-radius: 10px;",
      "  box-shadow: 6px 6px 0 #111; /* без размытия */",
      "}",
      ".btn:active {",
      "  translate: 6px 6px;",
      "  box-shadow: 0 0 0 #111; /* «вдавили» в тень */",
      "}",
    ],
  },
  {
    id: "clay",
    year: "2022",
    name: { ru: "Клейморфизм", en: "Claymorphism" },
    tagline: { ru: "Пухлые элементы из пластилина: три тени и пастель", en: "Puffy clay elements: three shadows and pastel" },
    where: { ru: "Детские и обучающие приложения, онбординг, 3D-иконки", en: "Kids and learning apps, onboarding, 3D icons" },
    when: { ru: "Детские, обучающие, онбординг и иллюстрации", en: "Kids, learning, onboarding and illustrations" },
    pros: [
      { ru: "Дружелюбно и мягко, хочется нажать", en: "Friendly and soft, begs to be pressed" },
      { ru: "Объём без 3D-моделей — только CSS", en: "Volume without 3D models — just CSS" },
    ],
    cons: [
      { ru: "Выглядит по-детски в серьёзных продуктах", en: "Looks childish in serious products" },
      { ru: "Белый текст на пастели плохо читается", en: "White text on pastel is hard to read" },
    ],
    fix: {
      problem: { ru: "Белый текст на пастельной кнопке — контраст 1,7:1", en: "White text on a pastel button — 1.7:1 contrast" },
      how: { ru: "Тёмный текст того же оттенка, пастель остаётся фоном", en: "Dark text of the same hue; pastel stays the background" },
      before: "1,7:1",
      after: "7,1:1",
      metric: { ru: "контраст текста на кнопке", en: "button text contrast" },
    },
    score: { look: 4, read: 3, speed: 3, a11y: 3, scale: 2 },
    css: [
      ".card {",
      "  background: #c7b8ff;",
      "  border-radius: 32px;",
      "  box-shadow:",
      "    0 18px 30px rgb(80 60 160 / .25),        /* снаружи */",
      "    inset -8px -8px 16px rgb(80 60 160 / .3), /* тень */",
      "    inset  8px  8px 16px rgb(255 255 255 / .6); /* блик */",
      "}",
    ],
  },
  {
    id: "bento",
    year: "2023",
    name: { ru: "Бенто", en: "Bento grid" },
    tagline: { ru: "Сетка плиток разного размера: одна плитка — одна мысль", en: "A grid of tiles of different sizes: one tile, one idea" },
    where: { ru: "Страницы Apple, Linear, Vercel, портфолио и дашборды", en: "Apple product pages, Linear, Vercel, portfolios and dashboards" },
    when: { ru: "Страница продукта, дашборд, портфолио: много коротких фактов", en: "Product pages, dashboards, portfolios: many short facts" },
    pros: [
      { ru: "Сканируется за секунды: плитка — отдельная история", en: "Scannable in seconds: each tile is its own story" },
      { ru: "На телефоне плитки складываются в столбик", en: "On phones the tiles stack into a column" },
    ],
    cons: [
      { ru: "Плитки равного веса — непонятно, что главное", en: "Equal tiles — no clear priority" },
      { ru: "Легко превратить в коллаж", en: "Easily turns into a collage" },
    ],
    fix: {
      problem: { ru: "Все плитки одного размера — взгляд прыгает", en: "All tiles the same size — the eye jumps around" },
      how: { ru: "Одна главная плитка в 4 раза больше остальных", en: "One hero tile 4× larger than the rest" },
      before: "1×",
      after: "4×",
      metric: { ru: "размер главной плитки", en: "hero tile size" },
    },
    score: { look: 4, read: 5, speed: 5, a11y: 4, scale: 4 },
    css: [
      ".grid {",
      "  display: grid; gap: 14px;",
      "  grid-template-columns: repeat(4, 1fr);",
      "  grid-template-areas:",
      "    \"hero hero steps weather\"",
      "    \"hero hero steps focus\";",
      "}",
      ".tile { border-radius: 24px; padding: 22px; }",
      "@media (width < 700px) {",
      "  .grid { grid-template-columns: 1fr; }",
      "}",
    ],
  },
  {
    id: "glass",
    year: "2025",
    name: { ru: "Liquid Glass", en: "Liquid Glass" },
    tagline: { ru: "Матовое стекло 2020 года стало жидким: преломляет то, что под ним", en: "2020’s frosted glass turned liquid: it refracts what’s underneath" },
    where: { ru: "Glassmorphism — macOS Big Sur и Windows 11; Liquid Glass — iOS 26 и macOS Tahoe", en: "Glassmorphism — macOS Big Sur and Windows 11; Liquid Glass — iOS 26 and macOS Tahoe" },
    when: { ru: "Поверх фото, видео и карт: плееры, панели, меню", en: "On top of photos, video and maps: players, panels, menus" },
    pros: [
      { ru: "Контент виден сквозь интерфейс — ощущение слоёв", en: "Content shows through the UI — a sense of layers" },
      { ru: "Самый «живой» стиль: реагирует на фон", en: "The most alive style: it reacts to the background" },
    ],
    cons: [
      { ru: "Текст на пёстром фоне плохо читается", en: "Text on a busy background is hard to read" },
      { ru: "Размытие нагружает слабые телефоны", en: "Blur is heavy on low-end phones" },
    ],
    fix: {
      problem: { ru: "Над жёлтым пятном фона контраст белого текста — 1,3:1", en: "Over the yellow spot white text drops to 1.3:1" },
      how: { ru: "Подложка плотнее, текст темнее и настройка «Уменьшить прозрачность»", en: "Denser tint, darker text and “Reduce transparency”" },
      before: "1,3:1",
      after: "16:1",
      metric: { ru: "контраст текста в худшем месте", en: "worst-case text contrast" },
    },
    score: { look: 5, read: 2, speed: 2, a11y: 2, scale: 3 },
    css: [
      ".glass {",
      "  background: rgb(255 255 255 / .14);",
      "  backdrop-filter: blur(3px) url(#refract);",
      "  border-radius: 28px;",
      "  box-shadow: inset 0 1px 1px rgb(255 255 255 / .7),",
      "              inset 0 -1px 1px rgb(255 255 255 / .3),",
      "              0 10px 30px rgb(0 0 0 / .18);",
      "}",
      "@media (prefers-reduced-transparency: reduce) {",
      "  .glass { background: rgb(255 255 255 / .9); }",
      "}",
    ],
  },
];

export const SCORE_KEYS: (keyof Score)[] = ["look", "read", "speed", "a11y", "scale"];
