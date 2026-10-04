#!/usr/bin/env node
// Compares every hex value in src/styles/tokens.css with src/styles/tokens.js.
// Exits 1 on any mismatch or missing token. Plain node, no dependencies.
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cssPath = path.join(root, 'src/styles/tokens.css');
const css = readFileSync(cssPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const T = await import(pathToFileURL(path.join(root, 'src/styles/tokens.js')).href);

function block(selector) {
  const re = new RegExp(`(^|\\n)\\s*${selector.replace('.', '\\.')}\\s*\\{([\\s\\S]*?)\\n\\}`);
  const m = css.match(re);
  if (!m) throw new Error(`block ${selector} not found in tokens.css`);
  const out = {};
  for (const d of m[2].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) out[d[1]] = d[2].trim();
  return out;
}
const camel = (k) => k.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const HEX = /^#[0-9a-f]{3,8}$/i;
const errors = [];
let checked = 0;

function cmp(where, cssName, cssVal, jsVal) {
  if (!HEX.test(cssVal)) return; // var()/color-mix/aliases are not mirrored
  checked++;
  if (jsVal === undefined) errors.push(`${where}: --${cssName}=${cssVal} has no tokens.js entry`);
  else if (String(jsVal).toLowerCase() !== cssVal.toLowerCase()) errors.push(`${where}: --${cssName} css=${cssVal} js=${jsVal}`);
}

const JS_KEYS = new Set(Object.keys(T.CLASSIC));
for (const [sel, theme, statusField] of [[':root', T.CLASSIC, 'classic'], ['.ed-root', T.ED, 'fg']]) {
  const decl = block(sel);
  for (const [name, val] of Object.entries(decl)) {
    const st = name.match(/^status-([a-z]+)(-tint)?$/);
    const tint = name.match(/^tint-([a-z]+)$/);
    if (st) {
      const s = T.STATUS[st[1]];
      if (!s) { errors.push(`${sel}: --${name} has no STATUS.${st[1]}`); continue; }
      cmp(sel, name, val, st[2] ? s.tint : s[statusField]);
    } else if (tint) {
      if (sel === '.ed-root') cmp(sel, name, val, T.TINT[tint[1]]);
    } else if (JS_KEYS.has(camel(name))) {
      cmp(sel, name, val, theme[camel(name)]);
    }
  }
  // every JS core key must exist as a hex in this block
  for (const k of JS_KEYS) {
    const name = k.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase();
    if (!(name in decl)) errors.push(`${sel}: tokens.js key ${k} has no --${name}`);
  }
  for (const k of Object.keys(T.STATUS)) {
    if (!(`status-${k}` in decl)) errors.push(`${sel}: STATUS.${k} has no --status-${k}`);
  }
}
for (let i = 0; i < 8; i++) {
  if (T.SERIES[i] !== T.ED[`series${i + 1}`]) errors.push(`SERIES[${i}] != ED.series${i + 1}`);
}

if (errors.length) {
  console.error(`tokens out of sync (${errors.length}):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`tokens in sync: ${checked} hex values checked`);
