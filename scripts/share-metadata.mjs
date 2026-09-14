export const SITE_URL = 'https://design-for-changes.github.io/lab-learning/';
export const SITE_NAME = '動態デザイン研究室';

export function escapeHtml(value = '') {
 return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function plainText(html = '') {
 return html.replace(/<[^>]*>/g, ' ').replace(/&#(?:x([\da-f]+)|(\d+));/gi, (_, hex, decimal) => String.fromCodePoint(parseInt(hex || decimal, hex ? 16 : 10)))
  .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, name) => ({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '})[name]).replace(/\s+/g, ' ').trim();
}

export function shareMetadata({ title, description, url }) {
 const fields = [
  ['name', 'description', description],
  ['property', 'og:title', title],
  ['property', 'og:description', description],
  ['property', 'og:type', 'website'],
  ['property', 'og:url', url],
  ['property', 'og:site_name', SITE_NAME],
  ['property', 'og:locale', 'ja_JP'],
  ['name', 'twitter:card', 'summary'],
  ['name', 'twitter:title', title],
  ['name', 'twitter:description', description],
 ];
 return `<title>${escapeHtml(title)}</title>\n<link rel="canonical" href="${escapeHtml(url)}">\n` + fields.map(([attribute, key, value]) => `<meta ${attribute}="${key}" content="${escapeHtml(value)}">`).join('\n');
}
