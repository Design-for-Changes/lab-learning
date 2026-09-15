// Follow static dependencies only; other courses are dynamic imports.
export function pageAssets(manifest, entries) {
  const visited = new Set();
  const scripts = new Set();
  const styles = new Set();
  function visit(key) {
    if (visited.has(key)) return;
    const chunk = manifest[key];
    if (!chunk) throw new Error(`Missing built entry: ${key}`);
    visited.add(key);
    for (const dependency of chunk.imports || []) visit(dependency);
    if (chunk.file.endsWith('.js')) scripts.add(chunk.file);
    for (const stylesheet of chunk.css || []) styles.add(stylesheet);
  }
  entries.filter(Boolean).forEach(visit);
  return { scripts: [...scripts], styles: [...styles] };
}
