#!/usr/bin/env node
// imp-3256: Cross-validate ||V||_HS between the section26-mupass verdict
// genuine-Phi construction (NPHI=10, a=0.5, U=6) and the imp-1267 construction
// (NPHI=10, a=0.5, U=5) at MATCHED tau-grid N.
//
// Both are the SAME lower-triangular Volterra Hilbert-Schmidt norm of the
// shear-Gram kernel
//     k(x, y) = Phi(x) Phi(y) sinh(a(x - y)) * 1_{0 <= y <= x},
//     ||V||_HS = ( int_0^U int_0^x |k|^2 dy dx )^{1/2}.
// imp-1267 reports 1.8985e-4 (U=5); the verdict reports 1.90e-4 (U=6).
// This script tabulates ||V||_HS(a=0.5, U, N) at matched N to decide whether the
// two converge to the SAME value (0.08% = pure 3-sig-fig rounding of 1.8985e-4
// to 1.90e-4) or carry a fixed grid/normalization offset.

const N_PHI = 10;
function Phi(u) {
  let sum = 0;
  const e2u = Math.exp(2 * u);
  const e4u = Math.exp(4 * u);
  for (let n = 1; n <= N_PHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    sum +=
      (2 * Math.PI * Math.PI * n4 * e4u - 3 * Math.PI * n2 * e2u) *
      Math.exp(-Math.PI * n2 * e4u);
  }
  return sum;
}

// Lower-triangle Volterra HS norm on [0,U] with N midpoint nodes.
function hsWindow(a, U, N) {
  const h = U / N;
  const tt = new Float64Array(N);
  const pp = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    tt[i] = (i + 0.5) * h;
    const p = Phi(tt[i]);
    pp[i] = p * p;
  }
  let s = 0;
  for (let i = 0; i < N; i++) {
    const ti = tt[i];
    let inner = 0;
    for (let j = 0; j <= i; j++) {
      const sh = Math.sinh(a * (ti - tt[j]));
      inner += pp[j] * sh * sh;
    }
    s += pp[i] * inner;
  }
  return Math.sqrt(s * h * h);
}

const A = 0.5;
// Matched tau-grid resolution h: use the SAME step h across U by scaling N with U.
// We report both matched-N (same node count) and matched-h (same spacing) views.
const N_GRID = [500, 1000, 2000, 4000, 8000];

console.log('# imp-3256 ||V||_HS cross-validation (a=0.5)');
console.log('# matched-N: identical node count N on [0,U5] and [0,U6]');
const rows = [];
for (const N of N_GRID) {
  const u5 = hsWindow(A, 5, N);
  const u6 = hsWindow(A, 6, N);
  // matched spacing h: U6 uses N6 = round(N*6/5) so h6 == h5 == 5/N
  const N6h = Math.round((N * 6) / 5);
  const u6h = hsWindow(A, 6, N6h);
  const relGap = Math.abs(u6 - u5) / u5;
  rows.push({
    N,
    h5: 5 / N,
    hs_U5: u5,
    hs_U6_matchedN: u6,
    hs_U6_matchedH: u6h,
    N6_matchedH: N6h,
    relGap_U6_vs_U5_matchedN: relGap,
  });
  console.log(
    `  N=${String(N).padStart(5)}  h=${(5 / N).toExponential(2)}  ` +
      `HS(U=5)=${u5.toExponential(8)}  HS(U=6,N)=${u6.toExponential(8)}  ` +
      `HS(U=6,h)=${u6h.toExponential(8)}  |U6-U5|/U5=${relGap.toExponential(2)}`,
  );
}

const finest = rows[rows.length - 1];
console.log('');
console.log('# imp-1267 frozen hs_exact_window(a=0.5,U=5,N=1000) = 1.8984785338e-4');
console.log('# verdict hsReference (a=0.5,U=6)                    = 1.90e-4');
console.log(`# round(HS(U=5) finest, 3 sig figs) = ${finest.hs_U5.toPrecision(3)}`);
console.log(`# round(HS(U=6) finest, 3 sig figs) = ${finest.hs_U6_matchedN.toPrecision(3)}`);

console.log(JSON.stringify({ a: A, rows, finest }, null, 2));
