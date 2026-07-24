/**
 * @module papers
 * @fileoverview Paper data layer for the ZPO Explorer / RH-attack project.
 *
 * This module manages the collection of mathematical papers that underpin
 * the Riemann Hypothesis attack via Zero-Point Oscillator (ZPO) methods.
 * It merges a set of committed built-in papers with any user-added papers
 * persisted in localStorage, deduplicating by paper id.
 *
 * **Proof chain role:** Supporting documentation layer — papers referenced
 * here provide theoretical grounding for the ZPO spectral framework, the
 * de Branges approach, and the analytic bounds used in the RH attack.
 *
 * **Schema:** Each paper object has the shape:
 *   `{ id, title, authors, date, abstract, rawLatex, nodes, source, createdAt }`
 *   where `nodes` is derived from `rawLatex` at runtime and is stripped on export.
 *
 * **Key exports:**
 *   - `getAllPapers()` — merged list (builtins + user storage), deduplicated
 *   - `getPaperById(id)` — single-paper lookup
 *   - `savePaper(paper)` — upsert to localStorage
 *   - `deletePaper(id)` — remove from localStorage (builtins are unaffected)
 *   - `exportPaperAsModule(paper)` — serialise paper to a JS module string
 *   - `generateId()` — create a unique paper id
 *
 * **Tickets:** imp-732 added this @module documentation.
 */

import {
  PAPER_TITLE,
  PAPER_AUTHORS,
  PAPER_BUILT_AT,
} from './paper-publication-meta.js';

const STORAGE_KEY = 'zpo-papers';

// Built-in papers (committed into the repo)
const builtinPapers = [
  {
    id: 'gomila-finite-height-beat-2026-05',
    title: PAPER_TITLE,
    authors: Array.from(PAPER_AUTHORS),
    date: PAPER_BUILT_AT.slice(0, 10),
    abstract:
      'WITHDRAWN / SUPERSEDED. This historical manuscript labeled a finite-N value as a rigorous ' +
      'unconditional Lambda bound, but the load-bearing many-body constant C_H was never discharged. ' +
      'Its Lambda <= 0.018 headline is therefore an estimate inside the model, not a theorem and not an ' +
      'improvement on the peer-reviewed Platt-Trudgian Lambda <= 0.2 benchmark. The current app keeps ' +
      'the record for provenance while disabling release promotion.',
    source: 'builtin',
    createdAt: PAPER_BUILT_AT,
  },
];

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
