/**
 * imp-33791 -- OFFLINE probe. Tabulate the imp-33765 truncation-size DEG saturation
 * of the COUPLED Perron norm ||R||(s) toward the all-ones ceiling DEG+1, and locate
 * s_90(DEG): the s-scale at which ||R|| first reaches 90% of the ceiling DEG+1.
 *
 * SETUP (admissible COUPLED slice s_a = s_b = s, the imp-3066 single exponential).
 * On the degree-DEG monomial truncation phi_j(tau) = (tau/U)^j, tau = U*x, x in [0,1]:
 *     D_jj = int_0^1 cosh(s * x) x^{2j} dx      (PASS / even part)
 *     H_jk = int_0^1 sinh(s * x) x^{j+k} dx     (SHEAR / odd part)
 *     R_jk = H_jk / sqrt(D_jj D_kk)
 *     ||R|| = largest |eigenvalue| (R positive => Perron dominant).
 * As s -> infinity both cosh and sinh concentrate at x=1 where every monomial x^p -> 1,
 * so R -> the all-ones matrix, whose Perron eigenvalue is exactly DEG+1. The curve
 * ||R||(s) rises monotonically from ~0 (s->0, odd part vanishes) to the ceiling DEG+1.
 *
 * imp-33765 (2)(iii) asserts DEG "sets the ceiling DEG+1 that the monotone-in-s curve
 * saturates to" but never tabulates HOW the saturation SCALE depends on DEG. We measure
 * s_90(DEG). Diagnostic; imp-3066 UNTOUCHED; K_a>=0 NOT attempted; NO QED;
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

const NQ = 8000;         // midpoint quadrature panels
const cosh = Math.cosh;
const sinh = Math.sinh;

function moment(weightFn, s, p) {
  const h = 1 / NQ;
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const x = (k + 0.5) * h;
    acc += weightFn(s * x) * Math.pow(x, p) * h;
  }
  return acc;
}

/** Largest eigenvalue of a symmetric positive matrix by power iteration. */
function perronNorm(M) {
  const n = M.length;
  let v = new Array(n).fill(1 / Math.sqrt(n));
  let lam = 0;
  for (let it = 0; it < 4000; it++) {
    const w = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += M[i][j] * v[j];
      w[i] = s;
    }
    let norm = 0;
    for (let i = 0; i < n; i++) norm += w[i] * w[i];
    norm = Math.sqrt(norm);
    const nv = w.map((x) => x / norm);
    const dlam = Math.abs(norm - lam);
    lam = norm;
    v = nv;
    if (dlam < 1e-14 * norm) break;
  }
  return lam;
}

function normAt(DEG, s) {
  const D = Array.from({ length: DEG + 1 }, (_u, j) => moment(cosh, s, 2 * j));
  const H = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => moment(sinh, s, j + k)),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => H[j][k] / Math.sqrt(D[j] * D[k])),
  );
  return perronNorm(R);
}

/** Bisect for s_90: the s where ||R||(s) first reaches 0.9*(DEG+1). Monotone increasing. */
function s90(DEG) {
  const ceil = DEG + 1;
  const target = 0.9 * ceil;
  let lo = 1e-6;
  let hi = 4;
  // grow hi until norm exceeds target
  while (normAt(DEG, hi) < target && hi < 1e6) hi *= 2;
  if (normAt(DEG, hi) < target) return null;
  for (let it = 0; it < 100; it++) {
    const mid = 0.5 * (lo + hi);
    if (normAt(DEG, mid) < target) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// Ceiling check + monotonicity spot-check + s_90 tabulation.
console.log('DEG   ceiling   ||R||@s=100   s_90     ||R||@s_90');
const DEG_RANGE = [2, 3, 4, 5, 6, 7, 8];
const rows = [];
for (const DEG of DEG_RANGE) {
  const ceil = DEG + 1;
  const nearCeil = normAt(DEG, 100);
  const s = s90(DEG);
  const nAt = normAt(DEG, s);
  rows.push({ DEG, ceil, nearCeil, s90: s, normAtS90: nAt });
  console.log(
    `${String(DEG).padStart(2)}    ${String(ceil).padStart(5)}    ${nearCeil.toFixed(6).padStart(10)}   ${s.toFixed(6).padStart(9)}   ${nAt.toFixed(6)}`,
  );
}

console.log('\n||R||(s) SATURATION CURVE (rows = DEG, cols = s):');
const S_GRID = [0.5, 1, 2, 3, 5, 8, 12, 20, 40];
process.stdout.write('  DEG\\s  ');
for (const s of S_GRID) process.stdout.write(String(s).padStart(9));
process.stdout.write('\n');
for (const DEG of DEG_RANGE) {
  process.stdout.write(`  DEG=${DEG}  `);
  for (const s of S_GRID) process.stdout.write(normAt(DEG, s).toFixed(4).padStart(9));
  process.stdout.write('\n');
}

const s90s = rows.map((r) => r.s90);
let growsMonotone = true;
for (let i = 1; i < s90s.length; i++) if (s90s[i] <= s90s[i - 1]) growsMonotone = false;
console.log(
  `\ns_90 trend in DEG: min ${Math.min(...s90s).toFixed(5)} (DEG=2) max ${Math.max(...s90s).toFixed(5)} (DEG=8) growsMonotonically=${growsMonotone}`,
);
console.log(
  `s_90 successive ratios: ${s90s.slice(1).map((v, i) => (v / s90s[i]).toFixed(4)).join(', ')}`,
);
