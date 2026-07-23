export function button({ label, onClick, variant = 'primary', disabled = false }) {
  const el = document.createElement('button');
  el.type = 'button';
  el.textContent = label;
  el.className = `btn btn-${variant}`;
  el.disabled = disabled;
  if (onClick) el.addEventListener('click', onClick);
  return el;
}

export function toast(message, { type = 'info', duration = 3000 } = {}) {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), duration);
}
