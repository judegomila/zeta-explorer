/**
 * imp-35497 (numerical, api-pool): HEIGHT-MAP sensitivity of the imp-35413 E_flow
 * far-tail remnant sub-1e-3 crossing (N ~ 4.17e25, log10 N ~ 25.6205).
 *
 * imp-35413 located the crossing holding the height map FIXED at the closed surrogate
 * T0 = 2 pi N / log N (which makes the module pure Math, no heavy import). imp-35458
 * applied a height-map sensitivity method to the E_coll=E_trunc crossover. This script
 * applies the SAME method to the far-tail crossing: recompute the crossing under the
 * EXACT Riemann-von Mangoldt inverse effectiveHeightForN(N) (Newton solve of
 * (T/2pi)(log(T/2pi)-1) = N) instead of the closed surrogate, and report the shift.
 *
 * Isolated to a script per the imp-35413 "no heavy import in the module" convention.
 * Measurement only; changes no bound; C_mb GUE-conditional per imp-486 UNTOUCHED; NO QED.
 */

const TWO_PI = 2 * Math.PI;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// --- the two height maps -----------------------------------------------------
// Closed surrogate T0 = 2 pi N / log N (the map imp-35413 uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// Exact RvM inverse: Newton solve of (T/2pi)(log(T/2pi)-1) = N (matches
// src/data/lambda-rh-height-mapping.js effectiveHeightForN).
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}

// --- the imp-35413 remnant, parameterised by the height map ------------------
function makeRemnant(heightForN) {
  function eFlowWith(N) {
    const T0 = heightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    return C_F * (L / T0) * GRONWALL;
  }
  function localExponent(N) {
    const h = 1.0002;
    const lo = Math.log(eFlowWith(N / h));
    const hi = Math.log(eFlowWith(N * h));
    return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
  }
  const analyticSurrogateExponent = (x) => -1 + 3 / x;
  return function remnantAtLog10(e) {
    const N = Math.pow(10, e);
    const x = Math.log(N);
    return Math.abs(analyticSurrogateExponent(x) - localExponent(N));
  };
}

function locateCrossing(remnant, lo, hi) {
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (remnant(mid) > 1e-3) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const remnantSurrogate = makeRemnant(surrogateHeightForN);
const remnantRvM = makeRemnant(effectiveHeightForN);

// Height-map divergence: how far the exact inverse sits from the surrogate.
console.log('=== height-map divergence at the crossing scale ===');
for (const e of [24, 25, 26, 28]) {
  const N = Math.pow(10, e);
  const Ts = surrogateHeightForN(N);
  const Tr = effectiveHeightForN(N);
  console.log(
    `  N=1e${e}: T0_surrogate=${Ts.toExponential(6)}  T0_RvM=${Tr.toExponential(6)}  rel=${((Tr - Ts) / Ts).toExponential(4)}`,
  );
}

console.log('\n=== remnant ladder (surrogate vs RvM height map) ===');
for (const e of [24, 25, 26, 28]) {
  console.log(
    `  N=1e${e}: remnant_surrogate=${remnantSurrogate(e).toFixed(6)}  remnant_RvM=${remnantRvM(e).toFixed(6)}`,
  );
}

const crossSurrogate = locateCrossing(remnantSurrogate, 24, 28);
// The RvM remnant sits ~2x higher, so its crossing lies far past 1e28 -- widen the bracket.
console.log('\n=== RvM remnant deep ladder (finding the crossing) ===');
for (const e of [30, 40, 60, 80, 120, 200, 300]) {
  console.log(`  N=1e${e}: remnant_RvM=${remnantRvM(e).toExponential(4)}`);
}
const crossRvM = locateCrossing(remnantRvM, 24, 300);
const nSurrogate = Math.pow(10, crossSurrogate);
const nRvM = Math.pow(10, crossRvM);

console.log('\n=== sub-1e-3 crossing under each height map ===');
console.log(`  surrogate: log10 N = ${crossSurrogate.toFixed(4)}  N = ${nSurrogate.toExponential(4)}`);
console.log(`  RvM inv  : log10 N = ${crossRvM.toFixed(4)}  N = ${nRvM.toExponential(4)}`);
console.log(`  shift    : d(log10 N) = ${(crossRvM - crossSurrogate).toFixed(4)}  N ratio = ${(nRvM / nSurrogate).toFixed(4)}`);
console.log(
  `  robust?  : the sub-1e-3 landmark stays in the same decade (${crossRvM > 25 && crossRvM < 26 ? 'YES, still 10^25.x' : 'NO'})`,
);
