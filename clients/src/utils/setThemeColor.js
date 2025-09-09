// Utility to set the theme color everywhere using CSS variable
// Usage: setThemeColor('#FE9F43') or setThemeColor('#123456')
export function setThemeColor(hex) {
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  const rgb = hexToRgb(hex);
  document.documentElement.style.setProperty('--primary-rgb', rgb.join(', '));
  // Optionally persist to localStorage for reload
  localStorage.setItem('primaryRGB', rgb.join(', '));
}

// On app load, restore theme color if set
export function restoreThemeColor() {
  const rgb = localStorage.getItem('primaryRGB');
  if (rgb) {
    document.documentElement.style.setProperty('--primary-rgb', rgb);
  }
}
