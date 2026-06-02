#!/usr/bin/env node
// imp-2346: Build a compute-script to data-file lineage manifest.
//
// Scans every scripts/compute-*.mjs and statically extracts:
//   - associated ticket ID (from filename)
//   - direct file writes to src/data/ (writeFileSync / OUT_PATH patterns)
//   - stdout embed targets (from "// Output: ... src/data/..." comments)
//   - whether the script writes to stdout (JSON via console.log / process.stdout.write)
//
// Writes scripts/lineage-manifest.json.
//
// Usage:  node scripts/build-lineage-manifest.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SCRIPTS_DIR = path.join(ROOT, 'scripts');
const OUT_FILE = path.join(SCRIPTS_DIR, 'lineage-manifest.json');

// ── regex patterns ────────────────────────────────────────────────────────────

// Extract ticket id from filename: compute-imp1240-... or compute-imp-2323-...
const RE_TICKET_FILENAME = /compute-imp-?(\d+)/i;

// Any string literal containing src/data/  (covers path.join(ROOT, 'src/data/...'))
const RE_SRC_DATA_LITERAL = /['"`](src\/data\/[^'"`\s]+)['"`]/g;

// writeFileSync call (capture variable name or literal path argument)
const RE_WRITE_FILE_SYNC = /writeFileSync\s*\(\s*([^,)]+)/g;

// Comment-embedded destination spanning up to two lines (handles wrapped comments).
// Matches: "embedding into\n// src/data/foo.js" or "embedding into src/data/foo.js"
const RE_EMBED_TARGET = /(?:embedding into|written? to|output file is?|OUTPUT:?)\s+(?:\/\/\s*)?(src\/data\/[^\s,;)\n]+)/gi;

// Stdout JSON output
const RE_STDOUT_JSON =
  /(?:console\.log|process\.stdout\.write)\s*\(\s*JSON\.stringify/g;

// ── scan a single script ──────────────────────────────────────────────────────

function analyzeScript(absPath) {
  const rel = path.relative(ROOT, absPath);
  const base = path.basename(absPath);

  // Ticket id
  const ticketMatch = RE_TICKET_FILENAME.exec(base);
  const ticketId = ticketMatch ? `imp-${ticketMatch[1]}` : null;

  const src = fs.readFileSync(absPath, 'utf8');

  // Build a map of variable name -> src/data path for all literal assignments.
  // Covers: const OUT_PATH = param('--out', path.join(ROOT, 'src/data/foo.json'))
  const varToDataPath = new Map();
  let m;
  RE_SRC_DATA_LITERAL.lastIndex = 0;
  while ((m = RE_SRC_DATA_LITERAL.exec(src)) !== null) {
    const dataPath = m[1];
    // Look back up to 120 chars before this match for a variable assignment
    const before = src.slice(Math.max(0, m.index - 120), m.index);
    const varMatch = /(?:const|let|var)\s+(\w+)\s*=/.exec(before.split('\n').pop() ?? '');
    if (varMatch) varToDataPath.set(varMatch[1], dataPath);
  }

  // Direct file writes
  const outputFiles = new Set();

  // writeFileSync: first arg is either a variable or a literal
  RE_WRITE_FILE_SYNC.lastIndex = 0;
  while ((m = RE_WRITE_FILE_SYNC.exec(src)) !== null) {
    const arg = m[1].trim();
    if (arg.startsWith("'") || arg.startsWith('"') || arg.startsWith('`')) {
      // Literal — extract inner path
      const inner = arg.slice(1, -1);
      if (inner.startsWith('src/data/')) outputFiles.add(inner);
    } else {
      // Variable reference — look up resolved value
      const resolved = varToDataPath.get(arg);
      if (resolved) outputFiles.add(resolved);
    }
  }

  // Comment-embedded targets (strip trailing dots / parens that regex might grab).
  // Handle wrapped comments: "embedding into\n// src/data/foo.js"
  const srcNormalized = src.replace(/\n\s*\/\/\s*/g, '\n');
  const embedTargets = new Set();
  RE_EMBED_TARGET.lastIndex = 0;
  while ((m = RE_EMBED_TARGET.exec(srcNormalized)) !== null) {
    const target = m[1].replace(/[.,;)]+$/, '');
    if (target.startsWith('src/data/')) embedTargets.add(target);
  }

  // Check for stdout JSON output
  RE_STDOUT_JSON.lastIndex = 0;
  const writesStdout = RE_STDOUT_JSON.test(src);

  // Output mode
  let outputMode;
  if (outputFiles.size > 0) {
    outputMode = writesStdout ? 'file+stdout' : 'file';
  } else if (writesStdout) {
    outputMode = 'stdout';
  } else {
    outputMode = 'unknown';
  }

  const entry = {
    script: rel,
    ticketId,
    outputMode,
    outputFiles: [...outputFiles].sort(),
    stdoutEmbedTargets: [...embedTargets].sort(),
  };

  // Convenience: full invocation hint
  if (outputMode === 'file' || outputMode === 'file+stdout') {
    entry.invocation = `node ${rel}`;
  } else if (outputMode === 'stdout') {
    const hint =
      entry.stdoutEmbedTargets.length > 0
        ? entry.stdoutEmbedTargets[0]
        : '<target-file>';
    entry.invocation = `node ${rel} > ${hint}`;
  } else {
    entry.invocation = `node ${rel}`;
  }

  return entry;
}

// ── main ──────────────────────────────────────────────────────────────────────

const computeScripts = fs
  .readdirSync(SCRIPTS_DIR)
  .filter((f) => /^compute-.*\.mjs$/.test(f))
  .sort();

const entries = computeScripts.map((f) =>
  analyzeScript(path.join(SCRIPTS_DIR, f)),
);

const manifest = {
  generatedAt: new Date().toISOString(),
  scriptCount: entries.length,
  note: 'Auto-generated by scripts/build-lineage-manifest.mjs — re-run after adding or renaming compute scripts.',
  entries,
};

fs.writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2) + '\n');

// Summary to stdout
const byMode = {};
for (const e of entries) {
  byMode[e.outputMode] = (byMode[e.outputMode] ?? 0) + 1;
}
console.log(`Wrote ${OUT_FILE} (${entries.length} scripts)`);
console.log('Output modes:', byMode);
