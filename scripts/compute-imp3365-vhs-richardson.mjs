#!/usr/bin/env node
// imp-3365: Richardson/Aitken-extrapolate the shear-Gram Volterra
// Hilbert-Schmidt norm ||V||_HS(a=0.5, U=6) to the h->0 continuum limit from
// the imp-3256 matched-h ladder (N=500..8000, extended here to 16000).
//
// The kernel is the lower-triangular shear-Gram Volterra operator
//     k(x, y) = Phi(x) Phi(y) sinh(a(x - y)) * 1_{0 <= y <= x},
//     ||V||_HS = ( int_0^U int_0^x |k|^2 dy dx )^{1/2},
// discretized on N midpoint nodes with spacing h = U/N (matched-h view).
//
// imp-3256 tabulated ||V||_HS at N in {500..8000} (matched-h HS
// 1.88972e-4 -> 1.90028e-4) but never took the h->0 continuum limit. Here we:
//   (1) recompute the matched-h ladder,
//   (2) measure the observed convergence ORDER p from successive differences,
//   (3) Richardson-extrapolate to h->0 and report the converged norm,
//   (4) cross-check with Aitken delta-squared,
//   (5) report the uncertainty of the extrapolated continuum norm.
// Measure-only, no positivity, no RH claim; PT Lambda<=0.2 stays SOTA.

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

// Lower-triangle Volterra HS norm on [0,U] with N midpoint nodes (spacing h=U/N).
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
const U = 6;
// Matched-h ladder: h halves at each step (N doubles). Extend imp-3256 to 16000.
const N_GRID = [500, 1000, 2000, 4000, 8000, 16000];

const S = N_GRID.map((N) => ({ N, h: U / N, hs: hsWindow(A, U, N) }));

console.log('# imp-3365 Richardson/Aitken continuum extrapolation of ||V||_HS(a=0.5, U=6)');
console.log('# matched-h ladder (h = U/N halves each row):');
for (const r of S) {
  console.log(
    `  N=${String(r.N).padStart(5)}  h=${r.h.toExponential(3)}  HS=${r.hs.toExponential(10)}`,
  );
}

// (2) Observed convergence order p from successive differences d_k = S_k - S_{k-1}.
// If error ~ C h^p and h halves each step, then d_k / d_{k+1} -> 2^p, so
//     p = log2( (S_k - S_{k-1}) / (S_{k+1} - S_k) ).
console.log('');
console.log('# observed convergence order p = log2( d_k / d_{k+1} ):');
const diffs = [];
for (let k = 1; k < S.length; k++) diffs.push(S[k].hs - S[k - 1].hs);
const orders = [];
for (let k = 0; k < diffs.length - 1; k++) {
  const ratio = diffs[k] / diffs[k + 1];
  const p = Math.log2(ratio);
  orders.push(p);
  console.log(
    `  h=${S[k].h.toExponential(2)}->${S[k + 2].h.toExponential(2)}  ` +
      `d_k/d_{k+1}=${ratio.toFixed(6)}  p=${p.toFixed(6)}`,
  );
}
const pMean = orders.reduce((x, y) => x + y, 0) / orders.length;
console.log(`  mean observed order p ~ ${pMean.toFixed(6)}  (midpoint rule => p=2 expected)`);

// (3) Richardson extrapolation assuming error ~ C h^2 (p=2 confirmed above):
//     R_k = ( 4 S(h/2) - S(h) ) / 3  eliminates the leading h^2 term.
console.log('');
console.log('# Richardson extrapolants R_k = (4 S(h/2) - S(h)) / 3  (assumes p=2):');
const rich = [];
for (let k = 1; k < S.length; k++) {
  const r = (4 * S[k].hs - S[k - 1].hs) / 3;
  rich.push(r);
  console.log(`  from N=${S[k - 1].N},${S[k].N}:  R=${r.toExponential(12)}`);
}

// (4) Aitken delta-squared cross-check on the raw ladder.
console.log('');
console.log('# Aitken delta-squared A_k = S_k - (S_{k+1}-S_k)^2 / (S_{k+2}-2 S_{k+1}+S_k):');
const aitken = [];
for (let k = 0; k < S.length - 2; k++) {
  const s0 = S[k].hs;
  const s1 = S[k + 1].hs;
  const s2 = S[k + 2].hs;
  const denom = s2 - 2 * s1 + s0;
  const a = s0 - ((s1 - s0) * (s1 - s0)) / denom;
  aitken.push(a);
  console.log(`  from N=${S[k].N},${S[k + 1].N},${S[k + 2].N}:  A=${a.toExponential(12)}`);
}

// (5) Converged continuum norm + uncertainty (spread of the finest extrapolants).
const richFinal = rich[rich.length - 1];
const richPrev = rich[rich.length - 2];
const aitkenFinal = aitken[aitken.length - 1];
const uncert = Math.max(
  Math.abs(richFinal - richPrev),
  Math.abs(richFinal - aitkenFinal),
);
console.log('');
console.log('# ---- converged continuum limit ----');
console.log(`# finest Richardson  R* = ${richFinal.toExponential(12)}`);
console.log(`# prev   Richardson       ${richPrev.toExponential(12)}`);
console.log(`# finest Aitken      A* = ${aitkenFinal.toExponential(12)}`);
console.log(`# ||V||_HS(a=0.5,U=6,h->0) = ${richFinal.toExponential(9)}  +/- ${uncert.toExponential(2)}`);
console.log(`# raw finest (N=16000)     = ${S[S.length - 1].hs.toExponential(9)}  (h-truncation error ~ ${Math.abs(richFinal - S[S.length - 1].hs).toExponential(2)})`);

console.log('');
console.log(
  JSON.stringify(
    {
      a: A,
      U,
      ladder: S,
      observedOrder: { orders, mean: pMean },
      richardson: rich,
      aitken,
      continuumNorm: richFinal,
      uncertainty: uncert,
    },
    null,
    2,
  ),
);
