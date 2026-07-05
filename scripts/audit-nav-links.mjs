#!/usr/bin/env node
// scripts/audit-nav-links.mjs
// imp-2800: Static broken-link / route-existence audit.
//
// Parses src/App.jsx to extract:
//   1. All <Route path="..."> definitions (the canonical route set).
//   2. All NAV_GROUPS to: '...' entries (nav link targets).
//
// Then walks every .jsx file under src/pages/ and src/components/ to
// collect to="..." and href="#/..." internal links.
//
// Reports any link that has no matching route definition and exits
// non-zero if any broken links are found.
//
// Usage:
//   node scripts/audit-nav-links.mjs
//
// Exit codes:
//   0 -- all links resolve
//   1 -- one or more broken links detected

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function readFile(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

// ── 1. Extract all defined routes from App.jsx ───────────────────────────────

function extractRoutes(src) {
  const routes = new Set(['/']);
  const re = /<Route\s+path="([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const p = m[1];
    if (p !== '*' && !p.includes(':')) routes.add(p);
  }
  return routes;
}

// ── 2. Extract NAV_GROUPS to: '...' entries from nav-groups.js + App.jsx ──────

function extractNavLinks(src) {
  const links = [];
  // match both single and double quoted to: '...' / to: "..."
  const re = /to:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m[1].startsWith('/')) links.push(m[1]);
  }
  return links;
}

// ── 3. Scan .jsx files for internal link targets ─────────────────────────────

function* walkJsx(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkJsx(full);
    else if (entry.name.endsWith('.jsx')) yield full;
  }
}

function extractPageLinks(src, filePath) {
  const links = [];
  const rel = path.relative(ROOT, filePath);
  // to="..." (double-quoted React Router Link / NavLink)
  const toDouble = /to="([^"]+)"/g;
  let m;
  while ((m = toDouble.exec(src)) !== null) {
    const link = m[1];
    if (link.startsWith('/') && !link.includes('#')) {
      links.push({ link, file: rel });
    }
  }
  // to={'...'} or to={"..."} (JSX expression, single or double quoted)
  const toJsx = /to=\{['"]([^'"]+)['"]\}/g;
  while ((m = toJsx.exec(src)) !== null) {
    const link = m[1];
    if (link.startsWith('/') && !link.includes('#')) {
      links.push({ link, file: rel });
    }
  }
  // href="#/..." (HashRouter-style internal anchors)
  const hrefRe = /href="#(\/[^"]+)"/g;
  while ((m = hrefRe.exec(src)) !== null) {
    links.push({ link: m[1], file: rel });
  }
  return links;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const appSrc = readFile('src/App.jsx');
const navGroupsSrc = readFile('src/data/nav-groups.js');
const routes = extractRoutes(appSrc);
// Extract nav links from both nav-groups.js (primary) and App.jsx (footer/sidebar inline links)
const navLinks = [...extractNavLinks(navGroupsSrc), ...extractNavLinks(appSrc)];

const broken = [];
const warnings = [];

// Check NAV_GROUPS links
for (const link of navLinks) {
  // Strip hash fragment for route matching
  const bare = link.split('#')[0];
  if (!routes.has(bare)) {
    broken.push({ source: 'NAV_GROUPS (App.jsx)', link });
  }
}

// Check duplicate NAV_GROUPS entries
const seen = new Map();
for (const link of navLinks) {
  seen.set(link, (seen.get(link) || 0) + 1);
}
for (const [link, count] of seen) {
  if (count > 1) {
    warnings.push(`NAV_GROUPS duplicate: "${link}" appears ${count} times`);
  }
}

// Check page and component internal links
for (const dir of ['src/pages', 'src/components']) {
  for (const filePath of walkJsx(path.join(ROOT, dir))) {
    const src = fs.readFileSync(filePath, 'utf8');
    for (const { link, file } of extractPageLinks(src, filePath)) {
      if (!routes.has(link)) {
        broken.push({ source: file, link });
      }
    }
  }
}

// ── 4. imp-2675: viz-route <-> /visualizations index coverage cross-check ─────
//
// The /visualizations "All Visualizations" page is driven by the registry in
// src/data/visualizations-index.js. New viz pages must be hand-added there or
// they silently drop off the index (as happened with vortex-field /
// prime-rigidity). This cross-check makes the coverage self-enforcing:
//   - every registry card route must resolve to a real App.jsx route (else the
//     card 404s)                                   -> hard fail (build breaks)
//   - every live visualization route in App.jsx must have a registry entry,
//     so brand-new viz pages cannot land unregistered -> hard fail, EXCEPT
//     routes on the documented EXEMPT_FROM_INDEX backlog, which warn instead.

const vizIndexSrc = readFile('src/data/visualizations-index.js');
const registryRoutes = new Set();
{
  const re = /route:\s*['"]([^'"]+)['"]/g;
  let rm;
  while ((rm = re.exec(vizIndexSrc)) !== null) registryRoutes.add(rm[1]);
}

// Non-"/viz-" routes that ARE visualization pages and belong in the registry.
const EXPLICIT_VIZ_ROUTES = new Set([
  '/vortex-field',
  '/prime-rigidity',
  '/visual-geometries',
  '/cayley-schur-trajectory',
]);

// Known viz routes not yet carried in the index (drift backlog). These WARN
// rather than fail the build; delete a route from this set once it gets a
// visualizations-index.js entry so the hard check covers it again.
const EXEMPT_FROM_INDEX = new Set([
  '/viz-imp3256-vhs-crossval',
  '/viz-imp3252-scaled-mu',
  '/viz-imp3467-closed-form-c',
  '/viz-imp3540-power-iteration-budget',
  '/viz-imp3541-cosh-cancellation-margin',
  '/viz-imp3542-degree-d-miss-factor',
  '/viz-imp3543-xistar-robustness',
  '/viz-imp3563-quadrature-straddle',
  '/viz-imp3564-power-iteration-closed-form',
  '/viz-imp3565-sigma-postpeak-decay-exponent',
  '/viz-imp3566-cosh-sinh-margin-contrast',
  '/viz-imp3567-closed-error-certificate',
  '/viz-imp3586-sigma-crossing-logistic-drop',
  '/viz-imp3589-cosh-overestimation-factor',
  '/viz-imp3611-skew-toeplitz-krylov-gap-ladder',
  '/viz-imp3612-fit-bias-depth-sweep',
  '/viz-imp3613-replica-fold-in-geometry',
  '/viz-imp3614-sigma-crossover-floor-invariance',
  '/viz-imp3627-flow-gap-nextorder',
  '/viz-imp3655-flow-gap-residual-ladder',
  '/viz-imp3656-triple-skew-toeplitz-gap-ladder',
  '/viz-imp3657-sigma-crossover-tc-closedform-pin',
  '/viz-imp3658-planted-replica-argmax-drift',
  '/viz-imp3677-skew-toeplitz-krylov-depth-vs-N-law',
  '/viz-imp3695-feature-foldin-floor-ladder',
  '/viz-imp3696-matched-pair-krylov-depth-sweep',
  '/viz-imp3697-a-weight-decay-crosscheck',
  '/viz-imp3698-fifth-pair-adjacent-pairing',
  '/viz-imp3699-fit-bias-decay',
  '/viz-imp3700-mesoscopic-shock-scale-separation',
  '/viz-imp3374-overflow-degree',
  '/viz-imp3375-interloper-margin',
  '/viz-imp3376-kshell-onset-ladder',
  '/viz-imp3377-rescue-budget-height-map',
  '/viz-imp3380-path1-record-step-margin',
  '/viz-imp3629-remainder-tail-coeff-ladder',
  '/viz-imp3631-mfold-aliasing-threshold-ladder',
  '/viz-imp3633-twin-skew-toeplitz-gap-ladder',
  '/viz-imp3635-flow-factor-band',
  '/viz-imp3672-direct-dyson-flow-crosscheck',
  '/viz-imp3675-dense-lanczos-pair-spread-crossover',
  '/viz-imp3678-moment-ratio-asymptotics',
  '/viz-imp3681-sub-floor-replica-foldin-crossover',
  '/viz-imp3738-fmb-plateau-enclosure',
  '/viz-imp3860-a-weight-correction-limit',
  '/viz-imp3861-moment-ratio-decay-ladder',
  '/viz-imp3862-saddle-ratio-crossing',
  '/viz-imp3863-gap-structure-function-s2',
  '/viz-imp3864-fmb-small-n-enclosure',
  '/viz-imp3880-saddle-ratio-inner-converged',
  '/viz-imp3881-eps-sign-change',
  '/viz-imp3882-saddle-correction-ladder',
  '/viz-imp3883-a-weight-simpson-climb',
  '/viz-imp3884-thetabar-elasticity',
  '/viz-imp3900-h2-flux-convexity',
  '/viz-imp3903-smin-dmin-slack',
  '/viz-imp3904-two-solver-crossing',
  '/viz-imp3906-dpsi-sensitivity',
  '/viz-imp3927-three-solver-crossing',
  '/viz-imp3928-inviscid-window-edge-blocksize',
  '/viz-imp3929-horizon-elasticity-sharpening',
  '/viz-imp33214-saddle-ratio-deep-tail-recovery',
  '/viz-imp33217-fifth-pair-spread-ulp-floor-ladder',
  '/viz-imp33219-a-weight-two-route-reproduction',
  '/viz-imp33221-model-fidelity-crossing-gap',
  '/viz-imp33237-eps-field-robust-transfer-modulus',
  '/viz-imp33241-watson-majorant-rho-ratio-ladder',
  '/viz-imp33243-recovery-rate-fit',
  '/viz-imp33246-eps-crossval',
  '/viz-imp33257-node-budget-full-window-ulp',
  '/viz-imp33261-saddle-window-direct-vs-log-a',
  '/viz-imp33264-fifth-pair-spread-ladder-n2800-extended',
  '/viz-imp33266-g6a-k4-toolkit-status-map',
  '/viz-imp33267-a-weight-dual-path-tau25-30',
  '/viz-imp33284-r40-inner-quadrature-ladder',
  '/viz-imp33285-watson-bracket-direct-vs-reform-dd-ladder',
  '/viz-imp33286-realised-vs-certified-tail-weight-ratio',
  '/viz-imp33298-fifth-pair-precision-collapse',
  '/viz-imp33300-majorant-overcharge-plateau-split',
  '/viz-imp33302-sliding-start-exponent-ladder',
  '/viz-imp33304-r40-two-axis-separation',
  '/viz-imp33323-min-node-lattice-jitter-band',
  '/viz-imp33324-graded-vs-uniform-node-budget',
  '/viz-imp33325-far-term-tighter-majorant',
  '/viz-imp33326-genuine-eigenvector-fifth-pair-realized-c-ladder',
  '/viz-imp33607-sigma-postpeak-decay',
  '/viz-imp33609-graded-mapped-cc-abscissa-artifact',
  '/viz-imp33611-band-crossing-floor-bisection',
  '/viz-imp33613-band-crossing-cross-solver-node-budget',
  '/viz-imp33628-etrunc-ecoll-crossover',
  '/viz-imp33629-wide-range-band-crossing-envelope',
  '/viz-imp33656-merged-band-clearing-overview',
  '/viz-imp33676-full-range-band-clearing-overview',
  '/viz-imp33630-grade-vs-node-budget',
  '/viz-imp33547-tilt-closure-offset-fraction',
  '/viz-imp33548-graded-plateau-deep-tail-node-budget',
  '/viz-imp33549-sigma-fartail-vs-interior-max',
  '/viz-imp33550-max-bj-realised-elasticity',
  '/viz-imp33570-sigma-fartail-slope-sqrt-fraction',
  '/viz-imp33571-deep-tail-jitter-envelope',
  '/viz-imp33572-tau-uniform-envelope',
  '/viz-imp33573-r40-cross-solver-node-budget',
  '/viz-imp33587-band-crossing-floor-climb',
  '/viz-imp33589-height-collapsing-envelope-ceiling',
  '/viz-imp33595-deep-tail-cohort-index',
  '/viz-imp33694-inter-cluster-trough-floor',
  '/viz-imp33715-gap-vs-height-independence',
  '/viz-imp33716-peak-minus-trough-amplitude',
  '/viz-imp33717-envelope-height-extension',
  '/viz-imp33718-interpeak-gap-sequence',
  '/viz-imp33742-interpeak-gap-sequence-extension',
  '/viz-imp33675-dense-node-budget-jitter',
  '/viz-imp33591-deep-tail-cross-solver-node-budget',
  '/viz-imp33594-envelope-under-reference-libm',
  '/viz-imp33617-deep-tail-cross-solver-cohort-index',
  '/viz-imp33830-sigma-decay-landmark-ladder',
  '/viz-imp33831-eflow-resid-ratio-ladder',
  '/viz-imp33832-saturation-curvature-hump-vs-k',
  '/viz-imp33833-decoupled-rate-heatmap',
  '/viz-imp33677-cluster-peak-gap-sequence',
  '/viz-imp33731-sigma-ramp-curvature',
  '/viz-imp33864-cren-gap-onset-ladder',
  '/viz-imp33894-residual-shape',
  '/viz-imp33895-log-saturation-reconciliation',
  '/viz-imp33738-gap-vs-trough-depth-coupling',
]);

const isVizRoute = (p) => p.startsWith('/viz-') || EXPLICIT_VIZ_ROUTES.has(p);

// Direction A: every registry card must point at a defined route.
for (const r of registryRoutes) {
  if (!routes.has(r)) {
    broken.push({ source: 'visualizations-index.js registry card', link: r });
  }
}

// Direction B: every live viz route must be registered in the index.
let vizRouteCount = 0;
for (const r of routes) {
  if (!isVizRoute(r)) continue;
  vizRouteCount += 1;
  if (registryRoutes.has(r)) continue;
  if (EXEMPT_FROM_INDEX.has(r)) {
    warnings.push(
      `viz route "${r}" is not in visualizations-index.js ` +
        '(known drift backlog; add a registry entry and drop it from EXEMPT_FROM_INDEX)',
    );
  } else {
    broken.push({
      source: 'visualizations-index.js missing registry entry',
      link: r,
    });
  }
}

// ── 5. imp-3014: finding-module coverage check ───────────────────────────────
//
// Key honest-status finding modules must be surfaced (imported) on at least
// one page, otherwise they are "dark data" — research done but never shown.
//
// Two tiers:
//   REQUIRED — currently surfaced; hard-fail if they become un-imported
//              (regression guard prevents silently dropping live findings).
//   BACKLOG  — not yet surfaced; warn only (open content tickets exist).
//
// To promote a backlog module: move it to REQUIRED once a page imports it.
// To add a new finding module: decide its tier and add it to the right set.

const FINDING_MODULES_REQUIRED = new Set([
  'src/data/ch-wall-frontier-verdict-2026-06-26.js',
  'src/data/maxfanout-honest-status-2026-06-17.js',
  'src/data/full-route-map-2026-06-19.js',
  'src/data/proof-chain-snapshot-2026-06-23.js',
  'src/data/section26-verdict-volterra-not-a-reduction-2026-06-18.js',
]);

const FINDING_MODULES_BACKLOG = new Set([
  'src/data/sg1c-theta-trap-theorems.js',
  'src/data/ch-lip-basin-conditional-2026-06-30.js',
]);

// Collect every data-module path imported by any page.
const pageDataImports = new Set();
for (const filePath of walkJsx(path.join(ROOT, 'src/pages'))) {
  const src = fs.readFileSync(filePath, 'utf8');
  const re = /from\s+['"](\.[^'"]*\/data\/[^'"]+)['"]/g;
  let m2;
  while ((m2 = re.exec(src)) !== null) {
    const pageDir = path.dirname(filePath);
    let resolved = path.resolve(pageDir, m2[1]);
    if (!path.extname(resolved)) resolved += '.js';
    pageDataImports.add(path.relative(ROOT, resolved));
  }
}

let findingModulesChecked = 0;
for (const mod of FINDING_MODULES_REQUIRED) {
  findingModulesChecked += 1;
  if (!pageDataImports.has(mod)) {
    broken.push({ source: 'finding-module not surfaced on any page (REQUIRED)', link: mod });
  }
}
for (const mod of FINDING_MODULES_BACKLOG) {
  findingModulesChecked += 1;
  if (!pageDataImports.has(mod)) {
    warnings.push(
      `finding module not yet surfaced on any page (backlog): "${mod}" — open content ticket to surface it`,
    );
  }
}

// ── Report ────────────────────────────────────────────────────────────────────

const timestamp = new Date().toISOString();
console.log(`\nNav link audit  ${timestamp}`);
console.log(`Routes defined in App.jsx: ${routes.size}`);
console.log(`NAV_GROUPS entries checked: ${navLinks.length}`);
console.log(`Viz routes checked vs index: ${vizRouteCount} (registry entries: ${registryRoutes.size})`);
console.log(`Finding modules checked: ${findingModulesChecked} (required: ${FINDING_MODULES_REQUIRED.size}, backlog: ${FINDING_MODULES_BACKLOG.size})`);

if (warnings.length > 0) {
  console.log('\nWarnings:');
  for (const w of warnings) console.log(`  WARN  ${w}`);
}

if (broken.length === 0) {
  console.log('\nAll links resolve to known routes. No broken links found.\n');
  process.exit(0);
} else {
  console.log(`\nBroken links (${broken.length}):`);
  for (const { source, link } of broken) {
    console.log(`  BROKEN  ${link}  (in ${source})`);
  }
  console.log('');
  process.exit(1);
}
