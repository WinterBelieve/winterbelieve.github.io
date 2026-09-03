(function initializeTheme() {
  const themeKey = "daniel_site_theme";
  let savedTheme = null;

  try {
    savedTheme = window.localStorage.getItem(themeKey);
  } catch {
    // Use the system preference when storage is unavailable.
  }

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const theme = savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : systemTheme;

  document.documentElement.dataset.theme = theme;
})();
