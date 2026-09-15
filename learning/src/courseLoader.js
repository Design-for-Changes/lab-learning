// Reuse a course import across its chapters; a failed request can be retried.
export function createModuleLoader(importers) {
  const pending = new Map();
  return function loadModule(path) {
    if (!pending.has(path)) {
      const request = Promise.resolve().then(() => {
        if (!importers[path]) throw new Error(`Unregistered course module: ${path}`);
        return importers[path]();
      }).then(module => module.default).catch(error => {
        pending.delete(path);
        throw error;
      });
      pending.set(path, request);
    }
    return pending.get(path);
  };
}
