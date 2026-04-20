// ===============================
// Configuration
// ===============================
const root = document.documentElement;
const themeToggleBtn = document.getElementById("theme-toggle");
const lightIcon = document.getElementById("theme-toggle-light");
const darkIcon = document.getElementById("theme-toggle-dark");

const LANGUAGE_STORAGE_KEY = "language";
const THEME_STORAGE_KEY = "theme";
const DEFAULT_LANGUAGE = "fr";
const SUPPORTED_LANGUAGES = ["fr", "es"];

const translations = window.translations || {};

// ===============================
// Utilities
// ===============================
function normalizeLanguage(lang) {
  if (!lang) return DEFAULT_LANGUAGE;
  return SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
}

function getNestedValue(source, key) {
  return key.split(".").reduce((acc, part) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
      return acc[part];
    }
    return undefined;
  }, source);
}

function getNestedTranslation(lang, key) {
  const safeLang = normalizeLanguage(lang);

  const requestedValue = getNestedValue(translations[safeLang], key);
  if (typeof requestedValue === "string") return requestedValue;

  const fallbackValue = getNestedValue(translations[DEFAULT_LANGUAGE], key);
  if (typeof fallbackValue === "string") return fallbackValue;

  return null;
}

// ===============================
// i18n
// ===============================
function applyTextTranslations(lang) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (!key) return;

    const translatedText = getNestedTranslation(lang, key);
    if (translatedText !== null) {
      element.textContent = translatedText;
    }
  });
}

function applyAttributeTranslations(lang) {
  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    const mapping = element.getAttribute("data-i18n-attr");
    if (!mapping) return;

    mapping.split(";").forEach((entry) => {
      const trimmedEntry = entry.trim();
      if (!trimmedEntry) return;

      const separatorIndex = trimmedEntry.indexOf(":");
      if (separatorIndex === -1) return;

      const attrName = trimmedEntry.slice(0, separatorIndex).trim();
      const key = trimmedEntry.slice(separatorIndex + 1).trim();

      if (!attrName || !key) return;

      const translatedValue = getNestedTranslation(lang, key);
      if (translatedValue !== null) {
        element.setAttribute(attrName, translatedValue);
      }
    });
  });
}

function updateLanguageButtons(lang) {
  document.querySelectorAll(".lang-btn[data-lang]").forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function applyTranslations(lang) {
  const safeLang = normalizeLanguage(lang);

  applyTextTranslations(safeLang);
  applyAttributeTranslations(safeLang);
  updateLanguageButtons(safeLang);

  document.documentElement.lang = safeLang;
}

function setLanguage(lang) {
  const safeLang = normalizeLanguage(lang);
  localStorage.setItem(LANGUAGE_STORAGE_KEY, safeLang);
  applyTranslations(safeLang);
}

function getInitialLanguage() {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  const browserLanguage = navigator.language
    ? navigator.language.slice(0, 2).toLowerCase()
    : null;

  return normalizeLanguage(storedLanguage || browserLanguage || DEFAULT_LANGUAGE);
}

function initLanguageToggle() {
  const languageButtons = document.querySelectorAll(".lang-btn[data-lang]");

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const requestedLanguage = button.dataset.lang;
      setLanguage(requestedLanguage);
    });
  });

  setLanguage(getInitialLanguage());
}

// ===============================
// Theme
// ===============================
function updateThemeLogos(theme) {
  const logos = document.querySelectorAll("[data-logo-light][data-logo-dark]");

  logos.forEach((logo) => {
    const lightSrc = logo.getAttribute("data-logo-light");
    const darkSrc = logo.getAttribute("data-logo-dark");

    if (!lightSrc || !darkSrc) {
      return;
    }

    logo.setAttribute("src", theme === "dark" ? darkSrc : lightSrc);
  });
}

function setTheme(theme) {
  if (theme === "dark") {
    root.classList.add("dark");
    localStorage.setItem(THEME_STORAGE_KEY, "dark");

    if (lightIcon && darkIcon) {
      lightIcon.classList.remove("hidden");
      darkIcon.classList.add("hidden");
    }
  } else {
    root.classList.remove("dark");
    localStorage.setItem(THEME_STORAGE_KEY, "light");

    if (lightIcon && darkIcon) {
      lightIcon.classList.add("hidden");
      darkIcon.classList.remove("hidden");
    }
  }

  updateThemeLogos(theme);
}

(function initTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "dark" || storedTheme === "light") {
    setTheme(storedTheme);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
})();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const isDark = root.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });
}

// ===============================
// Footer year
// ===============================
function initYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// ===============================
// Scroll animations
// ===============================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-up");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll("section, .project-card, article");

  elementsToAnimate.forEach((el) => {
    el.style.opacity = "0";
    observer.observe(el);
  });
}

// ===============================
// Init
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  initLanguageToggle();
  initYear();
  initScrollAnimations();
});