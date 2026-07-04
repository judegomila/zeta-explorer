/**
 * imp-33789 -- OFFLINE probe. Map the imp-33765 DECOUPLED pass/shear-rate grid
 * ||R||(s_a, s_b) and, for each shear rate s_a, locate the s_b/s_a ratio at which
 * the Perron norm ||R|| crosses 1.
 *
 * SETUP (decoupled probe, per imp-33765 -- deliberately breaks the common
 * exponential shear of imp-3066/imp-3107). On the same degree-DEG monomial
 * truncation phi_j(tau) = (tau/U)^j, with tau = U*x (x in [0,1]):
 *     D_jj = int_0^1 cosh(s_b * x) x^{2j} dx      (PASS form,  rate b, s_b = b*U)
 *     H_jk = int_0^1 sinh(s_a * x) x^{j+k} dx     (SHEAR form, rate a, s_a = a*U)
 *     R_jk = H_jk / sqrt(D_jj D_kk)
 *     ||R|| = largest eigenvalue (R positive => Perron-Frobenius dominant).
 * The shared U prefactor cancels, so R depends only on (s_a, s_b); we set U=1.
 * Coupled anchor is s_a = s_b (= the imp-3066 single-scale s).
 *
 * NOT admissible: the exponential shear forces s_a = s_b. This decoupling is a
 * diagnostic lever only. imp-3066 UNTOUCHED; K_a>=0 NOT attempted; NO QED;
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

const DEG = 4;          // same representative (DEG+1)x(DEG+1) truncation as imp-3066/3107
const NQ = 8000;        // midpoint quadrature panels

function moment(weightFn, s, p) {
  // int_0^1 weightFn(s*x) x^p dx by midpoint rule.
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
  for (let it = 0; it < 2000; it++) {
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
    if (dlam < 1e-13 * norm) break;
  }
  return lam;
}

function perron(s_a, s_b) {
  const D = Array.from({ length: DEG + 1 }, (_u, j) => moment(Math.cosh, s_b, 2 * j));
  const H = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => moment(Math.sinh, s_a, j + k)),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => H[j][k] / Math.sqrt(D[j] * D[k])),
  );
  return perronNorm(R);
}

// Sanity: reproduce the imp-33765 anchor and its two decoupled neighbours at s_a = 3.
console.log('ANCHOR CHECK (s_a = 3):');
for (const s_b of [1, 3, 6]) {
  console.log(`  s_b=${s_b}: ||R|| = ${perron(3, s_b).toFixed(6)}`);
}

// For a fixed s_a, ||R|| is monotone DECREASING in s_b (stiffer pass form damps
// the de-homogenized shear). Bisect for the s_b where ||R|| = 1.
function crossingSb(s_a) {
  let lo = 1e-6;       // ||R|| large here
  let hi = 50 * s_a;   // ||R|| small here
  const flo = perron(s_a, lo) - 1;
  const fhi = perron(s_a, hi) - 1;
  if (flo < 0 || fhi > 0) return null; // no bracketed crossing
  for (let it = 0; it < 80; it++) {
    const mid = 0.5 * (lo + hi);
    const fm = perron(s_a, mid) - 1;
    if (fm > 0) lo = mid; else hi = mid;
  }
  return 0.5 * (lo + hi);
}

console.log('\n||R|| = 1 CONTOUR (decoupled, per shear rate s_a):');
console.log('  s_a    s_b*      ratio s_b*/s_a   ||R||@anchor(s_b=s_a)');
const S_A_GRID = [1, 2, 3, 4, 5, 6, 8];
const rows = [];
for (const s_a of S_A_GRID) {
  const s_b = crossingSb(s_a);
  const anchor = perron(s_a, s_a);
  const ratio = s_b / s_a;
  rows.push({ s_a, s_bStar: s_b, ratio, anchor });
  console.log(
    `  ${String(s_a).padStart(3)}   ${s_b.toFixed(5).padStart(9)}   ${ratio.toFixed(5).padStart(9)}      ${anchor.toFixed(5)}`,
  );
}

// Full grid dump for the record.
console.log('\n||R||(s_a, s_b) GRID:');
const S_B_MULT = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];
process.stdout.write('  s_a\\(s_b/s_a) ');
for (const m of S_B_MULT) process.stdout.write(m.toFixed(2).padStart(9));
process.stdout.write('\n');
for (const s_a of S_A_GRID) {
  process.stdout.write(`  s_a=${String(s_a).padStart(2)}       `);
  for (const m of S_B_MULT) {
    process.stdout.write(perron(s_a, m * s_a).toFixed(4).padStart(9));
  }
  process.stdout.write('\n');
}

// Ratio trend summary.
const ratios = rows.map((r) => r.ratio);
console.log(
  `\nCROSSING RATIO s_b*/s_a: min ${Math.min(...ratios).toFixed(5)} max ${Math.max(...ratios).toFixed(5)} spread ${(Math.max(...ratios) - Math.min(...ratios)).toFixed(5)}`,
);
