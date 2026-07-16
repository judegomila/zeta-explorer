/**
 * imp-36036 (numerical, S-frontier) OFFLINE measurement.
 *
 * imp-35990 inferred the imp-35812 achieved single-realization naive W1 error (~3.0e-17
 * normalized) sits at ~0.54 of the Higham-Mary ENSEMBLE standard deviation, WITHOUT ever
 * forming the ensemble. This script forms it: resample the oscillatory phase (alpha, beta)
 * over M independent draws, and for each draw measure the naive length-N forward summation
 * error against a high-accuracy double-double (Kahan-Knuth twoSum) reference at N ~ 488602,
 * then compare the empirical error standard deviation to the Higham-Mary u*sqrt(Sum S_i^2)
 * scale.
 *
 * The forward error is extracted as E = (naiveSum - s) - c where (s, c) is the double-double
 * accumulator: naiveSum and s agree to ~16 digits so (naiveSum - s) is exact (Sterbenz), and
 * subtracting the dd correction c yields the signed forward error to ~1e-32 -- far below the
 * ~3e-17 signal (the naive rounding of s + c would carry ~1e-16*|sum|, swamping it, so it is
 * NOT used). This dd reference is a proxy for the imp-35812 exact-BigInt reference; its residual
 * (~1e-19, cf. imp-36023 KBN floor) is ~2 orders below the measured naive error -- SUB-GAP noted.
 *
 * Measurement only. Certifies no W1 bound; changes no bound; NO QED; Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 */

const T_PT = 3e12;
const N_AT_TPT = Math.floor(Math.sqrt(T_PT / (4 * Math.PI))); // ~488602
const U_ROUNDOFF = 2 ** -53;
const M_DRAWS = 512; // independent (alpha, beta) phase draws

// Deterministic phase sampler (reproducible; no Math.random). A 2D low-discrepancy-ish
// sequence: golden-ratio and sqrt(2) additive recurrences mod 1, scaled to [0, 2pi).
function drawPhase(j) {
  const a = ((j + 1) * 0.6180339887498949) % 1; // golden-ratio additive
  const b = ((j + 1) * 0.41421356237309515) % 1; // sqrt(2)-1 additive (coprime rotation)
  return { alpha: 2 * Math.PI * a, beta: 2 * Math.PI * b };
}

// twoSum: exact (hi, lo) with hi = fl(a+b), lo = exact rounding error.
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb);
  return [s, err];
}

// One draw: naive sum, dd reference, forward error, Sum|t_k|, Sum S_i^2 (all normalized bases).
function measureDraw(alpha, beta, N) {
  let naive = 0; // naive recursive double sum
  let s = 0, c = 0; // double-double accumulator (reference)
  let sumAbs = 0; // Sum |t_k|
  let sumSqPartial = 0; // Sum_i S_i^2 (mean-square accumulator scale, on the naive partials)
  for (let k = 1; k <= N; k++) {
    const t = Math.cos(alpha * k + beta * Math.sqrt(k)) / Math.sqrt(k);
    naive += t;
    sumAbs += Math.abs(t);
    sumSqPartial += naive * naive;
    // double-double running sum: add t into (s, c)
    const [ns, e] = twoSum(s, t);
    s = ns;
    c += e;
  }
  // Signed forward error, extracted without the swamping final rounding of (s + c).
  const forwardError = (naive - s) - c;
  const errNorm = forwardError / sumAbs; // normalized (signed) forward error
  const highamMaryNorm = (U_ROUNDOFF * Math.sqrt(sumSqPartial)) / sumAbs; // HM scale, this draw
  return { errNorm, highamMaryNorm, absErrNorm: Math.abs(errNorm) };
}

console.log(`imp-36036 ensemble sigma: N=${N_AT_TPT}, M=${M_DRAWS} phase draws`);
const errs = [];
const hms = [];
for (let j = 0; j < M_DRAWS; j++) {
  const { alpha, beta } = drawPhase(j);
  const r = measureDraw(alpha, beta, N_AT_TPT);
  errs.push(r.errNorm);
  hms.push(r.highamMaryNorm);
  if (j < 5 || j === M_DRAWS - 1) {
    console.log(`  draw ${j}: errNorm=${r.errNorm.toExponential(4)}  HM=${r.highamMaryNorm.toExponential(4)}`);
  }
}

const mean = (xs) => xs.reduce((a, x) => a + x, 0) / xs.length;
const meanErr = mean(errs);
// Empirical ensemble std (population) of the signed normalized error.
const variance = mean(errs.map((e) => (e - meanErr) ** 2));
const empiricalSigma = Math.sqrt(variance);
// RMS of the normalized error (the quantity Higham-Mary directly estimates).
const empiricalRms = Math.sqrt(mean(errs.map((e) => e * e)));
const meanHM = mean(hms);
const meanAbsErr = mean(errs.map((e) => Math.abs(e)));
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const medianHM = median(hms);
// Scale-free per-draw ratio: each roundoff realization against its OWN Higham-Mary scale.
// This removes the heavy phase-dependence of the HM scale (Sum S_i^2 varies ~5x across draws)
// and is the quantity imp-35990 implicitly used ("achieved / its scale = 0.538").
const ratios = errs.map((e, j) => e / hms[j]);
const meanRatio = mean(ratios);
const sigmaRatio = Math.sqrt(mean(ratios.map((r) => (r - meanRatio) ** 2)));
const rmsRatio = Math.sqrt(mean(ratios.map((r) => r * r)));
const meanAbsRatio = mean(ratios.map((r) => Math.abs(r)));

const ACHIEVED = 3.0e-17;
console.log('\n--- RESULTS (normalized by Sum|t_k|) ---');
console.log(`mean signed err      : ${meanErr.toExponential(4)}  (~0 expected)`);
console.log(`empirical sigma      : ${empiricalSigma.toExponential(4)}`);
console.log(`empirical RMS        : ${empiricalRms.toExponential(4)}`);
console.log(`mean |err|           : ${meanAbsErr.toExponential(4)}`);
console.log(`mean Higham-Mary     : ${meanHM.toExponential(4)}`);
console.log(`median Higham-Mary   : ${medianHM.toExponential(4)}`);
console.log(`sigma / mean HM      : ${(empiricalSigma / meanHM).toFixed(4)}`);
console.log(`sigma / median HM    : ${(empiricalSigma / medianHM).toFixed(4)}`);
console.log(`RMS   / mean HM      : ${(empiricalRms / meanHM).toFixed(4)}`);
console.log(`achieved(3.0e-17)/sigma : ${(ACHIEVED / empiricalSigma).toFixed(4)}  (imp-35990 read ~0.54)`);
console.log(`achieved(3.0e-17)/HM    : ${(ACHIEVED / meanHM).toFixed(4)}`);
console.log('\n--- scale-free per-draw ratio  r_j = E_j / HM_j ---');
console.log(`mean ratio           : ${meanRatio.toFixed(4)}  (~0 expected)`);
console.log(`sigma(ratio)         : ${sigmaRatio.toFixed(4)}  (=1.0 iff HM is the exact ensemble std)`);
console.log(`RMS(ratio)           : ${rmsRatio.toFixed(4)}`);
console.log(`mean |ratio|         : ${meanAbsRatio.toFixed(4)}  (cf. imp-35990 single-draw 0.538)`);
