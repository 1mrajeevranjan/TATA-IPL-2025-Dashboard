/* ============================================
   THEME MANAGER
   ============================================ */

const THEME_KEY = 'ipl-dashboard-theme';
const root = document.documentElement;

// Force dark theme as default for IPL Dashboard
function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  // Fallback to dark if no stored preference
  return 'dark'; 
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  const isDark = theme === 'dark';
  
  themeToggleBtns.forEach(btn => {
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    // Toggle icon visibility based on theme
    const sun = btn.querySelector('.icon-sun');
    const moon = btn.querySelector('.icon-moon');
    if (sun && moon) {
      if (isDark) {
        sun.style.display = 'block';
        moon.style.display = 'none';
      } else {
        sun.style.display = 'none';
        moon.style.display = 'block';
      }
    }
  });

  // Re-render charts with new theme colors
  if (typeof window.renderCharts === 'function') {
    // Small delay to allow CSS vars to update
    setTimeout(window.renderCharts, 100); 
  }
}

function toggleTheme() {
  const current = root.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getPreferredTheme());
  
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
});
