export function renderOgImage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  const escape = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0d1117"/>
  <rect x="48" y="48" width="1104" height="534" rx="28" fill="#161b22" stroke="#30363d"/>
  <circle cx="980" cy="120" r="220" fill="#3fb950" fill-opacity="0.12"/>
  <circle cx="1080" cy="40" r="120" fill="#3fb950" fill-opacity="0.12"/>
  <circle cx="170" cy="560" r="200" fill="#e6edf3" fill-opacity="0.04"/>
  <rect x="88" y="88" width="140" height="34" rx="17" fill="#3fb950" fill-opacity="0.14"/>
  <text x="108" y="111" fill="#3fb950" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">${escape(eyebrow)}</text>
  <text x="88" y="196" fill="#e6edf3" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700">${escape(title)}</text>
  <text x="88" y="262" fill="#8b949e" font-family="Arial, Helvetica, sans-serif" font-size="28">${escape(description)}</text>
  <text x="88" y="544" fill="#e6edf3" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">OpenSOAR</text>
  <text x="240" y="544" fill="#6e7681" font-family="Arial, Helvetica, sans-serif" font-size="24">opensoar.app</text>
</svg>`;
}
