const root = document.body.dataset.researchRoot;
const mobile = window.matchMedia('(max-width: 700px)');
for (const menu of document.querySelectorAll('.guide-menu')) menu.open = !mobile.matches;
mobile.addEventListener('change', event => {
  for (const menu of document.querySelectorAll('.guide-menu')) menu.open = !event.matches;
});

async function revealHash() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) {
    try {
      const response = await fetch(root + 'anchor-map.json');
      if (!response.ok) return;
      const map = await response.json();
      if (map[id]) location.replace(root + map[id]);
    } catch { /* The current page remains readable when offline. */ }
    return;
  }
  let parent = target;
  while (parent) {
    if (parent.tagName === 'DETAILS') parent.open = true;
    parent = parent.parentElement;
  }
  for (const link of document.querySelectorAll('.toc a')) {
    if (link.hash === location.hash) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  target.scrollIntoView();
}
window.addEventListener('hashchange', revealHash);
revealHash();

let printState = [];
window.addEventListener('beforeprint', () => {
  printState = [...document.querySelectorAll('details')].map(element => [element, element.open]);
  for (const [element] of printState) element.open = true;
});
window.addEventListener('afterprint', () => {
  for (const [element, open] of printState) element.open = open;
});

for (const block of document.querySelectorAll('.ai-request')) {
  const button = block.querySelector('.copy-code');
  const code = block.querySelector('pre > code');
  const status = block.querySelector('.copy-status');
  if (!button || !code || !status) continue;
  button.hidden = false;
  let reset;
  button.addEventListener('click', async () => {
    clearTimeout(reset);
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'コピーしました';
      status.textContent = 'プロンプトをコピーしました。';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = '選択した文章をコピー';
      status.textContent = 'プロンプトを選択しました。コピーのショートカットを使ってください。';
    }
    reset = setTimeout(() => { button.textContent = 'コピー'; status.textContent = ''; }, 3000);
  });
}

const documentButton = document.querySelector('.copy-document');
if (documentButton) {
  const source = document.getElementById('document-markdown');
  const fallback = document.querySelector('.document-copy-fallback');
  const status = document.querySelector('.document-copy-status');
  documentButton.hidden = false;
  documentButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(source.value);
      status.textContent = '全文をコピーしました。AIのチャットに貼り付けてください。';
      fallback.hidden = true;
    } catch {
      fallback.hidden = false;
      source.focus();
      source.select();
      status.textContent = '全文を選択しました。コピーのショートカットを使ってください。';
    }
  });
}
