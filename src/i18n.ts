import { useEffect, useState } from "react";

/** Два языка: по умолчанию — язык браузера, выбор запоминается. */
export type Lang = "ru" | "en";
export type T = Record<Lang, string>;

const KEY = "ui-styles-lang";

const initial = (): Lang => {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "ru" || q === "en") return q;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "ru" || saved === "en") return saved;
  } catch {
    /* хранилище недоступно — берём язык браузера */
  }
  return navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
};

export function useLang() {
  const [lang, setLang] = useState<Lang>(initial);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = UI.title[lang];
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* не запомнили — не страшно */
    }
  }, [lang]);
  return [lang, setLang] as const;
}

/** Подписи интерфейса и демо-экрана. */
export const UI = {
  title: { ru: "7 стилей интерфейса", en: "7 UI styles" },
  logo: { ru: "7 стилей", en: "7 styles" },
  viewStyles: { ru: "Стили", en: "Styles" },
  viewAll: { ru: "Все сразу", en: "All at once" },
  viewChoose: { ru: "Как выбрать", en: "How to choose" },
  where: { ru: "Где живёт", en: "Where it lives" },
  pros: { ru: "Плюсы", en: "Pros" },
  cons: { ru: "Минусы", en: "Cons" },
  fixTitle: { ru: "Главный минус", en: "Main flaw" },
  fixOn: { ru: "Исправить", en: "Fix it" },
  fixOff: { ru: "Как было", en: "Show original" },
  code: { ru: "Как строится", en: "How it’s built" },
  copy: { ru: "Скопировать CSS", en: "Copy CSS" },
  copied: { ru: "Скопировано ✓", en: "Copied ✓" },
  morph: { ru: "Прокрутить все", en: "Play all" },
  liquid: { ru: "Жидкое стекло", en: "Liquid glass" },
  frosted: { ru: "Матовое 2020", en: "Frosted 2020" },
  look: { ru: "Выразительность", en: "Character" },
  read: { ru: "Читаемость", en: "Readability" },
  speed: { ru: "Скорость", en: "Performance" },
  a11y: { ru: "Доступность", en: "Accessibility" },
  scale: { ru: "Для больших продуктов", en: "Scales to big products" },
  when: { ru: "Когда брать", en: "When to use" },
  chooseTitle: { ru: "Какой стиль взять", en: "Which style to pick" },
  chooseSub: { ru: "Оценки от 1 до 5. Нажмите на строку — откроется стиль.", en: "Scores from 1 to 5. Click a row to open the style." },
  // демо-экран
  hello: { ru: "Доброе утро, Аня", en: "Good morning, Anna" },
  date: { ru: "Понедельник, 27 октября", en: "Monday, October 27" },
  search: { ru: "Поиск", en: "Search" },
  nowPlaying: { ru: "Сейчас играет", en: "Now playing" },
  track: { ru: "Северное сияние", en: "Northern Lights" },
  artist: { ru: "Тихий океан", en: "Pacific Calm" },
  weather: { ru: "Солнечно", en: "Sunny" },
  focus: { ru: "Режим фокуса", en: "Focus mode" },
  focusSub: { ru: "Без уведомлений до 12:00", en: "No notifications until noon" },
  steps: { ru: "Шаги", en: "Steps" },
  goal: { ru: "из 10 000", en: "of 10,000" },
  chips: [
    { ru: "Работа", en: "Work" },
    { ru: "Спорт", en: "Sport" },
    { ru: "Чтение", en: "Reading" },
  ],
  start: { ru: "Начать день", en: "Start the day" },
  prev: { ru: "Предыдущий", en: "Previous" },
  play: { ru: "Пауза", en: "Pause" },
  next: { ru: "Следующий", en: "Next" },
  position: { ru: "Позиция в треке", en: "Track position" },
  upNext: { ru: "Далее", en: "Up next" },
  untilBreak: { ru: "до перерыва", en: "until break" },
};

export const UI_EXTRA = {
  days: { ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"], en: ["M", "T", "W", "T", "F", "S", "S"] },
};
