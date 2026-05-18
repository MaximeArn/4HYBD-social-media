export function isDarkMode(): boolean {
  return localStorage.getItem('theme') === 'dark';
}

export function setDarkMode(dark: boolean): void {
  document.documentElement.classList.toggle('ion-palette-dark', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

export function initTheme(): void {
  setDarkMode(isDarkMode());
}
