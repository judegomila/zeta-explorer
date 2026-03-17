/**
 * Paper data layer — merges built-in papers with localStorage.
 *
 * Schema: { id, title, authors, date, abstract, rawLatex, nodes, source, createdAt }
 */

const STORAGE_KEY = 'zpo-papers';

// Built-in papers (committed into the repo)
const builtinPapers = [];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage(papers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAllPapers() {
  const stored = loadFromStorage();
  // Merge: builtins first, then user papers; deduplicate by id
  const ids = new Set(builtinPapers.map(p => p.id));
  const merged = [...builtinPapers];
  for (const p of stored) {
    if (!ids.has(p.id)) {
      merged.push(p);
      ids.add(p.id);
    }
  }
  return merged;
}

export function getPaperById(id) {
  return getAllPapers().find(p => p.id === id) || null;
}

export function savePaper(paper) {
  const stored = loadFromStorage();
  const idx = stored.findIndex(p => p.id === paper.id);
  if (idx !== -1) {
    stored[idx] = paper;
  } else {
    stored.push(paper);
  }
  saveToStorage(stored);
  return paper;
}

export function deletePaper(id) {
  const stored = loadFromStorage().filter(p => p.id !== id);
  saveToStorage(stored);
}

export function exportPaperAsModule(paper) {
  const safe = { ...paper };
  // Remove nodes (regenerated from rawLatex) to keep export small
  delete safe.nodes;
  return `// Auto-generated paper export\nexport default ${JSON.stringify(safe, null, 2)};\n`;
}

export function generateId() {
  return 'paper-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}
