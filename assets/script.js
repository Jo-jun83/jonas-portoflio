// assets/script.js

// Gestion du thème (light/dark) avec préférence enregistrée
const root = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const lightIcon = document.getElementById('theme-toggle-light');
const darkIcon = document.getElementById('theme-toggle-dark');

function setTheme(theme) {
  if (theme === 'dark') {
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    if (lightIcon && darkIcon) {
      lightIcon.classList.remove('hidden');
      darkIcon.classList.add('hidden');
    }
  } else {
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    if (lightIcon && darkIcon) {
      lightIcon.classList.add('hidden');
      darkIcon.classList.remove('hidden');
    }
  }
}

// Initialisation du thème
(function initTheme() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    setTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
})();

// Toggle au clic
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isDark = root.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  });
}

// Année dans le footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
