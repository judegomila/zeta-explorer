#!/usr/bin/env node
// scripts/auto-generate-tripwires.mjs
// imp-1168: Auto-generate build-time tripwire skeleton for new src/data/*.js modules.
//
// Cuts the boilerplate of writing 5-9 tripwires per new ticket from
// ~5-10 min of hand-coding to ~30s of acceptance + light refinement.
//
// Uses STATIC PARSE (not module loading) for speed — runs in <1s. The
// trade-off is that we identify export NAMES but cannot inspect VALUES;
// the resulting tripwire skeleton therefore checks structural invariants
// (export exists, is non-null, expected type) rather than value invariants
// (specific keys, specific ranges). The engine refines those later.
//
// Static parse handles:
//   export const NAME = { ... }    // record-shaped exports
//   export const NAME = [ ... ]    // array-shaped exports
//   export const NAME = <literal>  // primitive exports (numeric / string)
//
// Generates a sibling file `src/data/imp-NNN-auto-tripwires.js` that
// re-imports the target module and exports IMP_<NNN>_AUTO_ASSERTIONS in
// the {id, why, holds()} shape consumed by scripts/run-assertions.mjs.
// Engines accept-as-is, refine, or inline into the original module.
//
// Usage:
//   node scripts/auto-generate-tripwires.mjs <module-path>           # print to stdout
//   node scripts/auto-generate-tripwires.mjs <module-path> --write   # write the skeleton
//   node scripts/auto-generate-tripwires.mjs <module-path> --write --wire   # wire into run-assertions.mjs
//
// Example:
//   node scripts/auto-generate-tripwires.mjs src/data/imp-1164-bui-sound-rigorous-port.js --write --wire
//
// Idempotent: re-running --wire on an already-wired module is a no-op.
//
// Exit codes:
//   0 -- skeleton generated (and written if --write)
//   2 -- usage error (no module path, bad flags, target missing)
//   3 -- the target module exports nothing matching record / array / primitive patterns

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

// ── arg parsing ─────────────────────────────────────────────────────────────

function usage(code = 2) {
  console.error('Usage: node scripts/auto-generate-tripwires.mjs <module-path> [--write] [--wire]');
  console.error('  <module-path>   relative-to-repo or absolute (e.g. src/data/imp-1164-foo.js)');
  console.error('  --write         write the skeleton to src/data/imp-NNN-auto-tripwires.js');
  console.error('  --wire          also append the new file to scripts/run-assertions.mjs DATA_MODULES');
  process.exit(code);
}

const argv = process.argv.slice(2);
if (argv.length === 0) usage();
const flags = new Set(argv.filter((a) => a.startsWith('--')));
const positional = argv.filter((a) => !a.startsWith('--'));
if (positional.length !== 1) usage();
const WRITE = flags.has('--write');
const WIRE  = flags.has('--wire');

let inputPath = positional[0];
if (path.isAbsolute(inputPath)) {
  inputPath = path.relative(ROOT, inputPath);
}
const absPath = path.resolve(ROOT, inputPath);
if (!fs.existsSync(absPath)) {
  console.error('FATAL: target does not exist: ' + absPath);
  process.exit(2);
}

const baseName = path.basename(inputPath, '.js');
// Try filename first, then scan file content for an imp-NNNN reference in
// header comments / docstrings so a non-imp-prefixed filename can still
// be routed to its ticket-numbered tripwire sibling.
let impMatch = baseName.match(/^imp-(\d+)/);
if (!impMatch) {
  const head = fs.readFileSync(absPath, 'utf8').slice(0, 4000);
  const m2 = head.match(/imp-(\d+)/);
  if (m2) impMatch = m2;
}
const ticketNum = impMatch ? impMatch[1] : 'unknown';
const skeletonBaseName = impMatch
  ? `imp-${ticketNum}-auto-tripwires.js`
  : baseName + '-auto-tripwires.js';
const skeletonAbsPath = path.resolve(ROOT, 'src/data', skeletonBaseName);
const skeletonRelPath = path.relative(ROOT, skeletonAbsPath);

// ── static parse ────────────────────────────────────────────────────────────

function findBalancedExtent(text, openIdx, openChar, closeChar) {
  let depth = 1;
  let i = openIdx + 1;
  let inString = null;
  let inComment = null;
  while (i < text.length) {
    const c = text[i];
    const c2 = text.substr(i, 2);
    if (inComment === '//') {
      if (c === '\n') inComment = null;
    } else if (inComment === '/*') {
      if (c2 === '*/') { inComment = null; i++; }
    } else if (inString) {
      if (c === '\\') { i += 2; continue; }
      if (c === inString) inString = null;
    } else {
      if (c2 === '//') inComment = '//';
      else if (c2 === '/*') inComment = '/*';
      else if (c === '"' || c === "'" || c === '`') inString = c;
      else if (c === openChar) depth++;
      else if (c === closeChar) {
        depth--;
        if (depth === 0) return i;
      }
    }
    i++;
  }
  return -1;
}

function parseExports(text) {
  // Skip exports that are functions or pure assertion arrays.
  const records = [];   // [{name, keysCount, keysSample}]
  const arrays = [];    // [{name, length, sample, isAssertions}]
  const primitives = [];// [{name, value}]

  // Accept UPPER_CASE_CONST, PascalCase, and camelCase exports.
  const exportRegex = /^export\s+const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*/gm;
  let m;
  while ((m = exportRegex.exec(text)) !== null) {
    const name = m[1];
    const after = m.index + m[0].length;
    const firstNonWs = text.slice(after).match(/\S/);
    if (!firstNonWs) continue;
    const startIdx = after + firstNonWs.index;
    const startCh = text[startIdx];

    if (startCh === '{') {
      const closeIdx = findBalancedExtent(text, startIdx, '{', '}');
      if (closeIdx === -1) continue;
      const body = text.slice(startIdx + 1, closeIdx);
      const keyMatches = body.match(/^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*:/gm) || [];
      const keysSample = keyMatches.slice(0, 25).map((k) => k.replace(/[\s:]/g, ''));
      records.push({ name, keysCount: keyMatches.length, keysSample });
    } else if (startCh === '[') {
      const closeIdx = findBalancedExtent(text, startIdx, '[', ']');
      if (closeIdx === -1) continue;
      const body = text.slice(startIdx + 1, closeIdx);
      // Count top-level array elements by walking braces / brackets / strings.
      let elementCount = 0;
      let depth = 0;
      let inStr = null;
      let sawNonWs = false;
      for (let i = 0; i < body.length; i++) {
        const c = body[i];
        if (inStr) {
          if (c === '\\') { i++; continue; }
          if (c === inStr) inStr = null;
        } else if (c === '"' || c === "'" || c === '`') {
          inStr = c;
          if (depth === 0) sawNonWs = true;
        } else if (c === '{' || c === '[' || c === '(') {
          if (depth === 0) sawNonWs = true;
          depth++;
        } else if (c === '}' || c === ']' || c === ')') {
          depth--;
        } else if (c === ',' && depth === 0) {
          if (sawNonWs) elementCount++;
          sawNonWs = false;
        } else if (depth === 0 && !/\s/.test(c)) {
          sawNonWs = true;
        }
      }
      if (sawNonWs) elementCount++;
      const isAssertions = /_ASSERTIONS$/.test(name);
      arrays.push({ name, length: elementCount, isAssertions });
    } else {
      // Primitive literal (number / string / boolean).
      const endIdx = text.indexOf(';', startIdx);
      const body = endIdx === -1 ? text.slice(startIdx, startIdx + 80) : text.slice(startIdx, endIdx);
      primitives.push({ name, value: body.trim().slice(0, 80) });
    }
  }

  return { records, arrays, primitives };
}

// ── skeleton emission ───────────────────────────────────────────────────────

function emitSkeleton(parse) {
  const { records, arrays, primitives } = parse;
  // Pick the largest record + the largest non-assertions array as anchors.
  const mainRecord = records.length
    ? records.reduce((a, b) => (b.keysCount > a.keysCount ? b : a))
    : null;
  const dataArrays = arrays.filter((a) => !a.isAssertions);
  const mainArray = dataArrays.length
    ? dataArrays.reduce((a, b) => (b.length > a.length ? b : a))
    : null;
  const mainPrimitive = primitives.length ? primitives[0] : null;

  if (!mainRecord && !mainArray && !mainPrimitive) {
    console.error('NOTE: target module has no top-level UPPER_CASE_CONST exports — no skeleton emitted.');
    process.exit(3);
  }

  const importNames = [];
  if (mainRecord)    importNames.push(mainRecord.name);
  if (mainArray)     importNames.push(mainArray.name);
  if (mainPrimitive) importNames.push(mainPrimitive.name);
  const dedupNames = [...new Set(importNames)];

  const lines = [];
  lines.push(`// Auto-generated tripwire skeleton for ${path.basename(inputPath)} (imp-${ticketNum}).`);
  lines.push(`// Generated by scripts/auto-generate-tripwires.mjs on ${new Date().toISOString()}.`);
  lines.push(`//`);
  lines.push(`// Coverage (5 standard structural tripwires, refine for semantic ranges):`);
  lines.push(`//   1. module-loads              : import succeeds`);
  if (mainRecord) {
    lines.push(`//   2. record-non-null           : ${mainRecord.name} is a non-null object`);
    lines.push(`//   3. record-key-count          : ${mainRecord.name} has >= ${Math.max(1, mainRecord.keysCount - 1)} declared top-level keys`);
    lines.push(`//   4. record-no-nan-leaves      : every numeric leaf in ${mainRecord.name} is Number.isFinite`);
  }
  if (mainArray) {
    lines.push(`//   5. array-non-empty           : ${mainArray.name} has length > 0 (declared length: ${mainArray.length})`);
  }
  lines.push(`//`);
  lines.push(`// REFINE these defaults for actual semantic ranges of this ticket's claims.`);
  lines.push(`// Generic structural checks catch broken serialization but miss "should be < 1e-3 not 1e+3".`);
  lines.push(``);
  lines.push(`import { ${dedupNames.join(', ')} } from './${path.basename(inputPath)}';`);
  lines.push(``);
  lines.push(`function _walkNumeric(obj, fn, prefix = '', depth = 0) {`);
  lines.push(`  if (depth > 8 || obj == null) return true;`);
  lines.push(`  if (typeof obj === 'number') return fn(obj, prefix);`);
  lines.push(`  if (Array.isArray(obj)) {`);
  lines.push(`    for (let i = 0; i < obj.length; i++) {`);
  lines.push(`      if (!_walkNumeric(obj[i], fn, prefix + '[' + i + ']', depth + 1)) return false;`);
  lines.push(`    }`);
  lines.push(`    return true;`);
  lines.push(`  }`);
  lines.push(`  if (typeof obj === 'object') {`);
  lines.push(`    for (const k of Object.keys(obj)) {`);
  lines.push(`      if (!_walkNumeric(obj[k], fn, prefix ? prefix + '.' + k : k, depth + 1)) return false;`);
  lines.push(`    }`);
  lines.push(`  }`);
  lines.push(`  return true;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const IMP_${ticketNum}_AUTO_ASSERTIONS = [`);

  // 1. module-loads
  lines.push(`  {`);
  lines.push(`    id: 'imp-${ticketNum}-auto-module-loads',`);
  lines.push(`    why: 'Target data module ${path.basename(inputPath)} must import without error.',`);
  lines.push(`    holds: () => true,  // The fact that this skeleton imported it proves load`);
  lines.push(`  },`);

  if (mainRecord) {
    // 2. record-non-null
    lines.push(`  {`);
    lines.push(`    id: 'imp-${ticketNum}-auto-record-non-null-${mainRecord.name.toLowerCase().replace(/_/g, '-')}',`);
    lines.push(`    why: '${mainRecord.name} must be a non-null object.',`);
    lines.push(`    holds: () => ${mainRecord.name} != null && typeof ${mainRecord.name} === 'object' && !Array.isArray(${mainRecord.name}),`);
    lines.push(`  },`);

    // 3. record-key-count
    const minKeys = Math.max(1, mainRecord.keysCount - 1);
    lines.push(`  {`);
    lines.push(`    id: 'imp-${ticketNum}-auto-record-key-count-${mainRecord.name.toLowerCase().replace(/_/g, '-')}',`);
    lines.push(`    why: '${mainRecord.name} must have at least ${minKeys} declared top-level keys.',`);
    lines.push(`    holds: () => Object.keys(${mainRecord.name} || {}).length >= ${minKeys},`);
    lines.push(`  },`);

    // 4. record-no-nan-leaves
    lines.push(`  {`);
    lines.push(`    id: 'imp-${ticketNum}-auto-record-no-nan-leaves',`);
    lines.push(`    why: 'Every numeric leaf in ${mainRecord.name} must be Number.isFinite (catches NaN/Infinity from broken composition).',`);
    lines.push(`    holds: () => _walkNumeric(${mainRecord.name}, (n) => Number.isFinite(n)),`);
    lines.push(`  },`);
  }

  if (mainArray) {
    // 5. array-non-empty
    lines.push(`  {`);
    lines.push(`    id: 'imp-${ticketNum}-auto-array-non-empty-${mainArray.name.toLowerCase().replace(/_/g, '-')}',`);
    lines.push(`    why: '${mainArray.name} must have length > 0 (declared length: ${mainArray.length}).',`);
    lines.push(`    holds: () => Array.isArray(${mainArray.name}) && ${mainArray.name}.length > 0,`);
    lines.push(`  },`);
  } else if (mainRecord) {
    // 5. value-in-sane-range as fallback
    lines.push(`  {`);
    lines.push(`    id: 'imp-${ticketNum}-auto-value-in-sane-range',`);
    lines.push(`    why: 'Every numeric leaf must lie in (-1e30, 1e30) -- catches accidental exponent blow-up.',`);
    lines.push(`    holds: () => _walkNumeric(${mainRecord.name}, (n) => Math.abs(n) < 1e30),`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);
  return lines.join('\n');
}

// ── wiring into run-assertions.mjs ─────────────────────────────────────────

function wireIntoAssertions() {
  const runAssertionsPath = path.resolve(ROOT, 'scripts/run-assertions.mjs');
  const text = fs.readFileSync(runAssertionsPath, 'utf8');
  const wireLine = `  '/src/data/${skeletonBaseName}',`;
  if (text.includes(wireLine)) {
    console.error('  [wire] already present, no-op');
    return false;
  }
  const dataModulesIdx = text.indexOf('const DATA_MODULES = [');
  if (dataModulesIdx === -1) {
    console.error('  [wire] could not find DATA_MODULES array — refusing to wire');
    return false;
  }
  const closeIdx = text.indexOf('];', dataModulesIdx);
  if (closeIdx === -1) {
    console.error('  [wire] could not find DATA_MODULES close bracket — refusing to wire');
    return false;
  }
  const before = text.slice(0, closeIdx);
  const after  = text.slice(closeIdx);
  const inserted = `  // imp-${ticketNum} auto-tripwire skeleton (generated by scripts/auto-generate-tripwires.mjs).\n${wireLine}\n`;
  const updated = before + inserted + after;
  fs.writeFileSync(runAssertionsPath, updated);
  console.error(`  [wire] appended ${skeletonBaseName} to scripts/run-assertions.mjs DATA_MODULES`);
  return true;
}

// ── main ────────────────────────────────────────────────────────────────────

(function main() {
  console.error(`[auto-tripwires] target: ${inputPath}`);
  console.error(`[auto-tripwires] ticket: imp-${ticketNum}`);
  console.error(`[auto-tripwires] skeleton: ${skeletonRelPath}`);

  const text = fs.readFileSync(absPath, 'utf8');
  const parse = parseExports(text);
  console.error(`[auto-tripwires] parse: ${parse.records.length} records, ${parse.arrays.length} arrays (${parse.arrays.filter(a=>a.isAssertions).length} assertion arrays), ${parse.primitives.length} primitives`);

  const skeleton = emitSkeleton(parse);

  if (WRITE) {
    if (fs.existsSync(skeletonAbsPath)) {
      console.error(`[auto-tripwires] NOTE: ${skeletonRelPath} already exists -- overwriting`);
    }
    fs.writeFileSync(skeletonAbsPath, skeleton);
    console.error(`[auto-tripwires] wrote ${skeletonRelPath} (${skeleton.length} bytes)`);
    if (WIRE) wireIntoAssertions();
  } else {
    process.stdout.write(skeleton);
    if (WIRE) console.error('[auto-tripwires] NOTE: --wire requires --write; use both to register the file');
  }

  console.error(`[auto-tripwires] done`);
})();
