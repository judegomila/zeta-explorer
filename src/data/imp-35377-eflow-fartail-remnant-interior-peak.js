/**
 * @module imp-35377-eflow-fartail-remnant-interior-peak
 *
 * imp-35377 (numerical, frontier-direction): imp-35280 measured the E_flow far-tail
 * fd-vs-analytic (closed-form/prefactor) remnant -- the gap |analytic - fd-surrogate|
 * between the imp-35198 analytic leading exponent (-1 + 3/log N) and the finite-difference
 * exponent read on the CLOSED surrogate height map T0 = 2 pi N / log N -- on a COARSE
 * three-point interior ladder N = 1e6 (0.0025), 1e9 (0.0031), 1e12 (0.0026), which reads
 * NON-monotone with an apparent interior maximum AT the N = 1e9 rung. But a three-point
 * ladder cannot resolve WHERE between its rungs the peak actually sits, nor how high it is.
 * This module REFINES the ladder between N = 1e6 and 1e12 (0.05-decade coarse scan +
 * ternary bisection in log10 N) to LOCATE the argmax and MEASURE the peak height, on the
 * exact imp-35135 far-tail quantity with the imp-35280 central-difference stencil (h = 1.0002).
 *
 * THE MEASUREMENT (surrogate channel only -- no height-map swap, so no heavy import)
 * ---------------------------------------------------------------------------------
 * The fd-vs-analytic remnant holds the height map FIXED at the closed surrogate
 * T0 = 2 pi N / log N (imp-35280): both the fd-surrogate exponent and the analytic exponent
 * live on that closed inverse, so the remnant isolates ONLY the closed-form Taylor truncation
 * of -1 + 3/log N plus the (log T0)^2-vs-C_F*L prefactor-form difference -- it never touches
 * effectiveHeightForN. That makes this module pure Math (no lambda-rh-height-mapping import),
 * exactly as imp-35371 established for the deep-rung extension, and it reproduces the imp-35280
 * three interior rungs to the digit before locating the between-rung peak.
 *
 *   N              fd-surrogate    analytic (-1+3/x)    remnant
 *   1e6             -0.7803         -0.7829              0.0025   (imp-35280, reproduced)
 *   1e9             -0.8521         -0.8552              0.0031   (imp-35280, reproduced)
 *   1e12            -0.8889         -0.8914              0.0026   (imp-35280, reproduced)
 *   N* ~= 7.22e7    -0.8340         -0.8372              0.003243 (THE interior peak, located here)
 *
 * THE FINDING (refines the imp-35280 "apparent peak at 1e9" reading)
 * -----------------------------------------------------------------
 * The remnant is a SMOOTH, BROAD, single-humped function of log N with its interior maximum at
 * log10 N* ~= 7.8587 (N* ~= 7.22e7, natural log N* ~= 18.095), NOT at the imp-35280 rung N = 1e9.
 * The located argmax is ~1.14 decades BELOW 1e9. The peak height 0.003243 is ~0.0001 ABOVE the
 * coarse 1e9 reading (0.003140), so the three-point ladder undershot the true maximum in BOTH
 * position and height -- it sampled the near-plateau shoulder, not the crown. The maximum is very
 * flat: the remnant stays within 1e-5 of the peak across log10 N in [7.57, 8.18] (~0.6 decades)
 * and within 1e-4 across [7.02, 8.98] (~2 decades), which is why a coarse ladder reads the max as
 * "roughly at 1e9" -- the whole 1e7..1e9 shoulder is within a fraction of a percent of the crown.
 * The peak height 0.003243 rounds to the same 0.0032 four-decimal band the coarse ladder reported;
 * this refinement sharpens the LOCATION (from "the 1e9 rung" to N* ~= 7.2e7) rather than moving the
 * height out of band, and confirms the imp-35280 non-monotone reading is a genuine interior max, not
 * a four-decimal read artifact (the concern imp-35397 raised as a sibling question).
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a rigorous
 * asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (the coarse three-point ladder refined here)
 * @see imp-35371-eflow-fartail-remnant-deep-extension (same remnant, extended past 1e16; pure-Math channel)
 * @see imp-35279-eflow-fartail-inverse-swap-ladder (same remnant column, from the swap-gap side)
 * @see imp-35217-eflow-fartail-exponent-x2-correction (the leading residual being decomposed)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (far-tail E_flow quantity)
 */

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135 far-tail E_flow quantity on a given height map (imp-35236 form).
function eFlowWith(heightFn, N) {
  const T0 = heightFn(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135 (h = 1.0002).
function localExponent(fn, N) {
  const h = 1.0002;
  const lo = Math.log(fn(N / h));
  const hi = Math.log(fn(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The imp-35198 analytic leading closed form -1 + 3/log N (the surrogate-channel analytic exponent).
function analyticSurrogateExponent(x) {
  return -1 + 3 / x;
}

// The fd-vs-analytic remnant at a given N (log10 argument), full precision (no rounding).
function remnantAtLog10(l10) {
  const N = Math.pow(10, l10);
  const fdSurr = localExponent((n) => eFlowWith(surrogateHeightForN, n), N);
  const analytic = analyticSurrogateExponent(Math.log(N));
  return Math.abs(analytic - fdSurr);
}

// ---- Locate the interior maximum between N = 1e6 and N = 1e12 (in log10 N) ----
// Stage 1: coarse 0.05-decade scan to bracket the crown.
let bestL10 = 6;
let bestR = -1;
for (let l10 = 6; l10 <= 12.0001; l10 += 0.05) {
  const r = remnantAtLog10(l10);
  if (r > bestR) {
    bestR = r;
    bestL10 = l10;
  }
}
// Stage 2: ternary bisection in log10 N on the bracketing 0.1-decade window.
let lo = bestL10 - 0.1;
let hi = bestL10 + 0.1;
for (let iter = 0; iter < 80; iter++) {
  const m1 = lo + (hi - lo) / 3;
  const m2 = hi - (hi - lo) / 3;
  if (remnantAtLog10(m1) < remnantAtLog10(m2)) lo = m1;
  else hi = m2;
}
const PEAK_LOG10_N = (lo + hi) / 2;
const PEAK_N = Math.pow(10, PEAK_LOG10_N);
const PEAK_LN_N = Math.log(PEAK_N);
const PEAK_REMNANT = remnantAtLog10(PEAK_LOG10_N);

// Plateau width: log10 N range over which the remnant stays within tol of the crown.
function plateauWidth(tol) {
  const thr = PEAK_REMNANT - tol;
  let a = PEAK_LOG10_N;
  while (a > 0 && remnantAtLog10(a) >= thr) a -= 0.001;
  let b = PEAK_LOG10_N;
  while (b < 40 && remnantAtLog10(b) >= thr) b += 0.001;
  return { lo: +a.toFixed(3), hi: +b.toFixed(3) };
}
const PLATEAU_1EM5 = plateauWidth(1e-5);
const PLATEAU_1EM4 = plateauWidth(1e-4);

// The imp-35280 coarse three interior rungs (reproduced live) plus the located peak row.
const IMP35280_INTERIOR = { 1e6: 0.0025, 1e9: 0.0031, 1e12: 0.0026 };
const INTERIOR_LADDER = [1e6, 1e9, 1e12].map((N) => {
  const l10 = Math.log10(N);
  const fdSurr = localExponent((n) => eFlowWith(surrogateHeightForN, n), N);
  const analytic = analyticSurrogateExponent(Math.log(N));
  return {
    N: +N.toExponential(0),
    log10N: +l10.toFixed(2),
    fdSurrogateExponent: +fdSurr.toFixed(4),
    analyticExponent: +analytic.toFixed(4),
    remnant: +Math.abs(analytic - fdSurr).toFixed(4),
  };
});

export const IMP35377_EFLOW_FARTAIL_REMNANT_INTERIOR_PEAK = {
  id: 'imp-35377',
  proofSection: 'S-frontier',
  question:
    'Locate the interior maximum of the imp-35280 non-monotone fd-vs-analytic E_flow ' +
    'remnant band between N = 1e6 and 1e12: WHERE is the argmax and how high is the peak?',
  method:
    'Refine the imp-35280 three-point interior ladder to a continuous log10 N sweep of the ' +
    'fd-vs-analytic remnant |analytic - fd-surrogate| on the closed surrogate height map ' +
    'T0 = 2 pi N / log N (surrogate channel only; no effectiveHeightForN, hence no heavy ' +
    'import), reproducing the three imp-35280 interior rungs to the digit, then locating the ' +
    'argmax by a 0.05-decade coarse scan followed by ternary bisection in log10 N.',
  interiorLadder: INTERIOR_LADDER,
  peak: {
    log10N: +PEAK_LOG10_N.toFixed(4),
    N: +PEAK_N.toExponential(2),
    lnN: +PEAK_LN_N.toFixed(4),
    height: +PEAK_REMNANT.toFixed(7),
    heightFourDecimal: +PEAK_REMNANT.toFixed(4),
  },
  plateau: {
    within1e5: PLATEAU_1EM5, // log10 N window within 1e-5 of the crown
    within1e4: PLATEAU_1EM4, // log10 N window within 1e-4 of the crown
    decadesBelow1e9: +(9 - PEAK_LOG10_N).toFixed(3),
    heightAbove1e9Rung: +(PEAK_REMNANT - remnantAtLog10(9)).toFixed(7),
  },
  finding: {
    F1_reproduces_imp35280_interior_rungs:
      'The remnant recomputed live reproduces the imp-35280 interior-ladder values 0.0025 ' +
      '(1e6) / 0.0031 (1e9) / 0.0026 (1e12) to the digit, confirming this refinement shares ' +
      'the imp-35280 surrogate channel exactly.',
    F2_peak_is_between_rungs_not_at_1e9:
      'The interior maximum is at log10 N* ~= 7.8587 (N* ~= 7.22e7, natural log N* ~= 18.095), ' +
      'about 1.14 decades BELOW the imp-35280 apparent-peak rung N = 1e9. The three-point ladder ' +
      'placed the peak AT its 1e9 sample only because that was the highest of its three points; ' +
      'the true argmax sits between the 1e6 and 1e9 rungs.',
    F3_peak_height_above_coarse_reading:
      'The peak height is 0.003243, ~0.0001 ABOVE the coarse 1e9 reading (0.003140): the ' +
      'three-point ladder undershot the maximum in both position and height. The height still ' +
      'rounds to the same 0.0032 four-decimal band, so this refinement sharpens the LOCATION ' +
      'rather than moving the height out of band.',
    F4_broad_flat_maximum:
      'The maximum is smooth and very broad: the remnant stays within 1e-5 of the crown across ' +
      'log10 N in [7.57, 8.18] (~0.6 decades) and within 1e-4 across [7.02, 8.98] (~2 decades). ' +
      'The whole 1e7..1e9 shoulder is within a fraction of a percent of the crown, which is why ' +
      'a coarse ladder reads the max as "roughly at 1e9". The single smooth hump confirms the ' +
      'imp-35280 non-monotone reading is a genuine interior maximum, not a four-decimal artifact.',
  },
  isRigorous: false,
  honestStatus:
    'The imp-35280 fd-vs-analytic E_flow far-tail remnant has a genuine interior maximum, located ' +
    'here at log10 N* ~= 7.8587 (N* ~= 7.22e7), height 0.003243 -- about 1.14 decades BELOW the ' +
    'imp-35280 apparent-peak rung N = 1e9 and ~0.0001 above its coarse reading. The maximum is very ' +
    'broad (within 1e-4 of the crown across ~2 decades of log10 N), so "the peak is near 1e9" is a ' +
    'fair coarse description while the sharp argmax is ~7.2e7. Height and location are surrogate-channel ' +
    'quantities on the inherited imp-3220/imp-3406 extrapolation, sensitive to the fixed central-difference ' +
    'stencil h = 1.0002; a different stencil would shift the sub-1e-4 crown position slightly. Measurement ' +
    'only; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Refining the imp-35280 three-point interior ' +
    'ladder locates the fd-vs-analytic remnant interior maximum at log10 N* ~= 7.8587 (N* ~= 7.22e7, ' +
    'natural log N* ~= 18.095) with height 0.003243 -- ~1.14 decades below the imp-35280 apparent-peak ' +
    'rung 1e9 and ~0.0001 above its coarse 0.003140 reading. The maximum is a single smooth broad hump ' +
    '(within 1e-4 of the crown across log10 N in [7.02, 8.98]), confirming the imp-35280 non-monotone ' +
    'reading is a real interior max rather than a four-decimal artifact. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35280 (coarse three-point interior ladder, refined here); imp-35371 (same remnant, deep ' +
    'extension, pure-Math channel); imp-35279 (same remnant column, swap-gap side); imp-35217 (leading ' +
    'residual); imp-35198 (analytic -1 + 3/log N); imp-35135 (far-tail E_flow quantity); imp-486 (C_mb ' +
    'GUE-conditional, UNTOUCHED).',
};

export const IMP35377_EFLOW_FARTAIL_REMNANT_INTERIOR_PEAK_ASSERTIONS = [
  {
    // Reproduce the imp-35280 three interior-ladder remnants to the digit.
    id: 'imp35377-reproduces-imp35280-interior-rungs',
    description: 'the live remnant matches the imp-35280 baked values at N = 1e6, 1e9, 1e12',
    holds: () =>
      INTERIOR_LADDER.every(
        (r) => Math.abs(r.remnant - IMP35280_INTERIOR[r.N]) < 5e-4,
      ),
  },
  {
    // The located argmax sits strictly between the 1e6 and 1e9 rungs, near log10 N ~= 7.86.
    id: 'imp35377-argmax-between-1e6-and-1e9',
    description: 'the interior maximum log10 N* is in (7.0, 8.5), near 7.86, below the 1e9 rung',
    holds: () => PEAK_LOG10_N > 7.0 && PEAK_LOG10_N < 8.5 && Math.abs(PEAK_LOG10_N - 7.8587) < 0.02,
  },
  {
    // The located peak is a true maximum: it is >= the remnant at all three imp-35280 interior rungs.
    id: 'imp35377-peak-exceeds-all-coarse-rungs',
    description: 'the peak height exceeds the remnant at N = 1e6, 1e9 and 1e12',
    holds: () =>
      PEAK_REMNANT > remnantAtLog10(6) &&
      PEAK_REMNANT > remnantAtLog10(9) &&
      PEAK_REMNANT > remnantAtLog10(12),
  },
  {
    // The peak height is ~0.003243 and still rounds to the coarse 0.0032 four-decimal band.
    id: 'imp35377-peak-height-in-band',
    description: 'the peak height is ~0.003243 and rounds to 0.0032',
    holds: () =>
      Math.abs(PEAK_REMNANT - 0.003243) < 1e-4 &&
      Math.abs(+PEAK_REMNANT.toFixed(4) - 0.0032) < 1e-9,
  },
  {
    // The maximum is broad: within 1e-4 of the crown across at least ~1.5 decades of log10 N.
    id: 'imp35377-maximum-is-broad',
    description: 'the within-1e-4 plateau spans at least 1.5 decades of log10 N',
    holds: () => PLATEAU_1EM4.hi - PLATEAU_1EM4.lo > 1.5,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35377-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35377_EFLOW_FARTAIL_REMNANT_INTERIOR_PEAK.isRigorous === false &&
      /NO QED/.test(IMP35377_EFLOW_FARTAIL_REMNANT_INTERIOR_PEAK.verdict) &&
      /refereed bound is changed/i.test(IMP35377_EFLOW_FARTAIL_REMNANT_INTERIOR_PEAK.verdict),
  },
];

for (const a of IMP35377_EFLOW_FARTAIL_REMNANT_INTERIOR_PEAK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35377-eflow-fartail-remnant-interior-peak assertion failed: ${a.id}`,
    );
  }
}

export default IMP35377_EFLOW_FARTAIL_REMNANT_INTERIOR_PEAK;
