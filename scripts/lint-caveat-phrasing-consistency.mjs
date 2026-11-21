// imp-35084 prototype lint: flags research (non-viz) data modules in the
// imp-34947..34957 cohort whose honest-status caveat is missing a canonical
// clause. Distinct from imp-35049 (viz-page banner-PRESENCE audit): this
// checks caveat-text PHRASING inside the research modules themselves.
//
// A naive `grep` over the raw file lines under-reports: the verdict text is
// written as a run of single-quoted string-literal fragments joined by `+`,
// one clause per line, so a marker phrase that happens to be split across a
// line break (e.g. "...establishes no operator " / "positivity;...") is
// invisible to a per-line substring search even though the assembled text
// contains it. This lint reconstructs the joined string before matching.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());

const COHORT = [
  'imp-34947-conjugate-pair-argument-theta-cross-check',
  'imp-34948-inflection-offset-far-tail-ladder-extension',
  'imp-34949-krawczyk-margin-infimum-band-endpoint',
  'imp-34950-eflow-crossing-strength-cmb-exponent-structural',
  'imp-34951-plus-one-impossibility-margin-band',
  'imp-34952-double-double-log-ulp-band-wide',
  'imp-34953-r-margin-dyadic-wall-across-N',
  'imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck',
  'imp-34955-sigma-knee-crossing-cmb-sensitivity',
  'imp-34956-pinned-product-window-sensitivity',
  'imp-34957-crossover-deriv-p11-p12-extension',
];

const CANONICAL_CLAUSES = [
  'NO QED',
  'GUE-conditional per imp-486',
  'efereed bound is changed',
  'changes no bound',
  'operator positivity',
  'C_C 1/8 ansatz',
  'K_a >= 0',
];

// Reconstruct the assembled `verdict:` string value from its
// `'fragment ' +\n    'fragment ' +\n    'fragment',` source form.
function extractVerdictText(src) {
  const start = src.indexOf('verdict:');
  if (start === -1) return null;
  const lines = src.slice(start).split('\n').slice(1);
  const fragments = [];
  for (const line of lines) {
    const m = line.match(/^\s*'((?:[^'\\]|\\.)*)'\s*(\+)?\s*,?\s*$/);
    if (!m) break;
    fragments.push(m[1]);
    if (!m[2]) break; // last fragment has no trailing "+"
  }
  return fragments.join('');
}

let anyGap = false;
console.log('imp-35084 caveat-phrasing-consistency lint -- imp-34947..34957 cohort\n');

for (const mod of COHORT) {
  const filePath = path.join(ROOT, 'src/data', `${mod}.js`);
  const src = fs.readFileSync(filePath, 'utf8');
  const verdictText = extractVerdictText(src);
  if (verdictText === null) {
    console.log(`${mod}: NO verdict FIELD FOUND -- cannot lint`);
    anyGap = true;
    continue;
  }
  const missing = CANONICAL_CLAUSES.filter((c) => !verdictText.includes(c));
  if (missing.length === 0) {
    console.log(`${mod}: OK (all ${CANONICAL_CLAUSES.length} canonical clauses present)`);
  } else {
    anyGap = true;
    console.log(`${mod}: MISSING -- ${missing.join(' | ')}`);
  }
}

console.log('');
console.log(anyGap
  ? 'RESULT: phrasing drift found -- see MISSING lines above.'
  : 'RESULT: no drift -- every module carries all canonical clauses.');
