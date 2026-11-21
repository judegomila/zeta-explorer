/**
 * @module imp-96405-knee-crossover-forced-vs-coincidental
 *
 * imp-96405 (numerical, frontier-direction): DECIDE whether the imp-96388 exponent-ramp
 * KNEE is FORCED to coincide with the E_coll = E_trunc crossover (sigma = 1/2), or whether
 * the observed ~0.013 log10 near-coincidence is a numerical accident.
 *
 * imp-96388 F3 found the second-difference zero of the OLS local-exponent ramp (the knee,
 * log10 N* ~ 9.529) sits only ~0.013 in log10 ABOVE the imp-33723 closed-form
 * E_coll = E_trunc crossover (log10 N_cross ~ 9.516). This module settles whether that
 * coincidence is structural (FORCED) or incidental (COINCIDENTAL).
 *
 * THE ANALYTIC ANSWER (leading order): FORCED
 * -------------------------------------------
 * At the knee scale (N ~ 3e9) the flow term is negligible (E_flow/E_N ~ 9e-4), so
 *     sigma(N) ~ E_coll / (E_trunc + E_coll),   E_coll = C_C * sqrt(L / N),  L = log(T0(N)).
 * If E_coll were a pure power law in N (L held constant), then with t := log(E_coll/E_trunc)
 * a LINEAR function of log N (slope -1/2),
 *     sigma = E_coll / (E_trunc + E_coll) = 1 / (1 + e^{-t}),
 * which is the LOGISTIC sigmoid in log N. A logistic has its curvature inflection
 * (d2_sigma/dt2 = 0) intrinsically pinned to t = 0, i.e. E_coll = E_trunc, i.e. sigma = 1/2 --
 * which is EXACTLY the crossover. The OLS local exponent p ~ (1/2)(1 - sigma)(1 - 1/L) tracks
 * sigma, so the exponent-ramp knee (its D2 zero) inherits the same inflection. So the knee is
 * NOT free to sit anywhere: it is pinned to the sigma = 1/2 crossover by the shape of the
 * share functional itself.
 *
 * THE MEASUREMENTS (all re-run here; same imp-3406/imp-33582 sub-terms as imp-96388)
 * ---------------------------------------------------------------------------------
 *   (M1) FROZEN-L LOGISTIC (exact test of the forcing). Freeze L at its crossover value so
 *        sigma is an exact logistic in log N; its curvature inflection lands on the crossover
 *        to ~3.4e-7 in log10 and sigma there is 0.500000 -- the forcing is exact when the
 *        power law is exact.
 *   (M2) FULL MODEL. With L(N) varying, the sigma-curvature inflection is at log10 ~ 9.533,
 *        only +0.0168 above the crossover (sigma there ~ 0.4949), and it coincides with the
 *        imp-96388 OLS-exponent knee (9.529) to within 0.0037 -- the two estimators name the
 *        SAME landmark.
 *   (M3) OFFSET DECOMPOSITION. Turning off E_flow drops the offset from +0.0168 to +0.0077,
 *        so nonzero E_flow supplies ~54% of the residual and the slowly-varying
 *        L(N) = log(effectiveHeight) (which breaks the exact-logistic form) supplies the rest.
 *        The residual is a COMPUTABLE sub-leading correction, not an accident.
 *   (M4) PERTURBATION TRACKING (the decisive coincidence test). Scaling C_C and E_trunc moves
 *        the crossover across 1.32 decades (log10 8.88 -> 10.21); in every case the inflection
 *        FOLLOWS the crossover with a near-constant offset in [+0.0068, +0.0088] and sigma at
 *        the inflection in [0.4976, 0.4981]. A coincidence would not track the crossover as it
 *        is dragged over a decade -- the rigid tracking confirms FORCED.
 *
 * VERDICT: FORCED (to leading order), with a small computable sub-leading offset. NOT a
 * numerical coincidence.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share landmark diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (knee ~0.013 log10 above the crossover)
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability (knee at log10 N* ~ 9.529)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross ~ 3.28e9)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-96388 exactly

// EXACT imp-3406/imp-33582 sub-terms; a switch to toggle the flow term and rescale C_C, E_trunc.
function sigmaGen({ C_C = C_C_PINNED, E_trunc = E_TRUNC_PT, withFlow = true } = {}) {
  return (N) => {
    const T0 = effectiveHeightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = withFlow ? C_F * (L / T0) * GRONWALL : 0;
    const E_coll = C_C * Math.sqrt(L / N);
    return E_coll / (E_trunc + E_flow + E_coll);
  };
}

// Curvature (second difference) inflection of sigma vs log10 N, step 0.02 (float-stable;
// finer steps lose the ~1e-5 curvature to cancellation).
function sigmaInflectionLog10(sigmaFn, lo, hi, step) {
  const arr = [];
  for (let d = lo; d <= hi + 1e-9; d += step) {
    const sm = sigmaFn(Math.pow(10, d - step));
    const s0 = sigmaFn(Math.pow(10, d));
    const sp = sigmaFn(Math.pow(10, d + step));
    arr.push({ d, v: sp - 2 * s0 + sm });
  }
  for (let i = 1; i < arr.length; i++) {
    if (Math.sign(arr[i].v) !== Math.sign(arr[i - 1].v)) {
      const c0 = arr[i - 1].d;
      const c1 = arr[i].d;
      const y0 = arr[i - 1].v;
      const y1 = arr[i].v;
      return c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
    }
  }
  return null;
}

// CROSSOVER: imp-33723 closed-form fixed point where E_coll = E_trunc (sigma = 1/2).
function crossoverLog10(C_C, E_trunc) {
  const K = (C_C / E_trunc) ** 2;
  let N = 1e9;
  for (let i = 0; i < 80; i++) N = K * Math.log(effectiveHeightForN(N));
  return Math.log10(N);
}

// imp-96388 OLS local-exponent D2-zero knee (to confirm the sigma-inflection is that landmark).
function olsExponentLog10(sigmaFn, loD, hiD, ptsPerDecade) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigmaFn(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -(sxy / sxx);
}
function olsKneeLog10(sigmaFn, loD, hiD, W, ptsPerDecade) {
  const edges = [];
  for (let d = loD; d <= hiD + 1e-9; d += W) edges.push(+d.toFixed(6));
  const br = [];
  for (let i = 0; i < edges.length - 1; i++) {
    br.push({ cen: (edges[i] + edges[i + 1]) / 2, p: olsExponentLog10(sigmaFn, edges[i], edges[i + 1], ptsPerDecade) });
  }
  const D1 = [];
  for (let i = 1; i < br.length; i++) D1.push({ cen: (br[i].cen + br[i - 1].cen) / 2, d1: br[i].p - br[i - 1].p });
  const D2 = [];
  for (let i = 1; i < D1.length; i++) D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2)) {
      const c0 = D2[i - 1].cen;
      const c1 = D2[i].cen;
      const y0 = D2[i - 1].d2;
      const y1 = D2[i].d2;
      return c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
    }
  }
  return null;
}

const sigmaFull = sigmaGen({});
const sigmaNoFlow = sigmaGen({ withFlow: false });

const CROSSOVER = crossoverLog10(C_C_PINNED, E_TRUNC_PT);

// (M2) full-model sigma-curvature inflection and the imp-96388 OLS-exponent knee.
const INFL_FULL = sigmaInflectionLog10(sigmaFull, 8, 12, 0.02);
const OLS_KNEE = olsKneeLog10(sigmaFull, 9.0, 12.0, 0.1, 100);
const INFL_FULL_OFFSET = INFL_FULL - CROSSOVER;
const SIGMA_AT_INFL_FULL = sigmaFull(Math.pow(10, INFL_FULL));
const INFL_VS_OLS_KNEE = Math.abs(INFL_FULL - OLS_KNEE);

// (M3) offset decomposition: how much of the residual is E_flow vs the slowly-varying L(N).
const INFL_NOFLOW = sigmaInflectionLog10(sigmaNoFlow, 8, 12, 0.02);
const INFL_NOFLOW_OFFSET = INFL_NOFLOW - CROSSOVER;
const EFLOW_SHARE_OF_OFFSET = (INFL_FULL - INFL_NOFLOW) / INFL_FULL_OFFSET;

// (M1) frozen-L logistic: exact-power-law test. Inflection lands on crossover to machine tol.
const FROZEN = (() => {
  const crossN = Math.pow(10, CROSSOVER);
  const Lfix = Math.log(effectiveHeightForN(crossN));
  const fnFix = (N) => {
    const E_coll = C_C_PINNED * Math.sqrt(Lfix / N);
    return E_coll / (E_TRUNC_PT + E_coll);
  };
  const crossFix = Math.log10((C_C_PINNED / E_TRUNC_PT) ** 2 * Lfix);
  const inflFix = sigmaInflectionLog10(fnFix, 8, 12, 0.02);
  return {
    crossoverLog10: +crossFix.toFixed(6),
    inflectionLog10: +inflFix.toFixed(6),
    offsetAbs: Math.abs(inflFix - crossFix),
    sigmaAtInflection: +fnFix(Math.pow(10, inflFix)).toFixed(6), // 0.500000 for a logistic
  };
})();

// (M4) perturbation tracking: drag the crossover over a decade, see if the inflection follows.
const PERTURBS = [
  { C_C: C_C_PINNED, E_trunc: E_TRUNC_PT * 0.5 },
  { C_C: C_C_PINNED, E_trunc: E_TRUNC_PT * 2 },
  { C_C: C_C_PINNED * 0.5, E_trunc: E_TRUNC_PT },
  { C_C: C_C_PINNED * 2, E_trunc: E_TRUNC_PT },
  { C_C: C_C_PINNED * 1.5, E_trunc: E_TRUNC_PT * 0.7 },
].map((p) => {
  const cross = crossoverLog10(p.C_C, p.E_trunc);
  const fn = sigmaGen({ ...p, withFlow: false });
  const lo = Math.max(4, cross - 2);
  const hi = cross + 2;
  const infl = sigmaInflectionLog10(fn, lo, hi, 0.02);
  return {
    cCScale: +(p.C_C / C_C_PINNED).toFixed(2),
    eTruncScale: +(p.E_trunc / E_TRUNC_PT).toFixed(2),
    crossoverLog10: +cross.toFixed(4),
    inflectionLog10: +infl.toFixed(4),
    offsetLog10: +(infl - cross).toFixed(5),
    sigmaAtInflection: +fn(Math.pow(10, infl)).toFixed(5),
  };
});
const PERTURB_OFFSETS = PERTURBS.map((r) => r.offsetLog10);
const PERTURB_OFFSET_MIN = Math.min(...PERTURB_OFFSETS);
const PERTURB_OFFSET_MAX = Math.max(...PERTURB_OFFSETS);
const PERTURB_CROSS_SPAN = Math.max(...PERTURBS.map((r) => r.crossoverLog10)) - Math.min(...PERTURBS.map((r) => r.crossoverLog10));

export const IMP96405_KNEE_CROSSOVER_FORCED_VS_COINCIDENTAL = Object.freeze({
  id: 'imp-96405',
  proofSection: 'S-frontier',
  question:
    'Is the imp-96388 exponent-ramp knee FORCED to coincide with the E_coll = E_trunc crossover ' +
    '(sigma = 1/2), or is the ~0.013 log10 near-coincidence a numerical accident? Derive the shape ' +
    'argument and measure the offset across component-model perturbations. Measurement/derivation ' +
    'only; NOT an RH bound; NO QED.',
  verdictShort: 'FORCED (to leading order) with a small computable sub-leading offset -- NOT coincidental.',
  crossoverLog10: +CROSSOVER.toFixed(5), // ~9.51591
  fullModel: {
    sigmaInflectionLog10: +INFL_FULL.toFixed(5), // ~9.53267
    olsExponentKneeLog10: +OLS_KNEE.toFixed(5), // ~9.529 (imp-96388 estimator)
    offsetAboveCrossoverLog10: +INFL_FULL_OFFSET.toFixed(5), // ~+0.01676
    sigmaAtInflection: +SIGMA_AT_INFL_FULL.toFixed(5), // ~0.49494
    inflectionVsOlsKnee: +INFL_VS_OLS_KNEE.toFixed(5), // ~0.0037 (same landmark)
  },
  offsetDecomposition: {
    withFlowOffsetLog10: +INFL_FULL_OFFSET.toFixed(5), // ~+0.01676
    noFlowOffsetLog10: +INFL_NOFLOW_OFFSET.toFixed(5), // ~+0.00773
    eflowShareOfOffset: +EFLOW_SHARE_OF_OFFSET.toFixed(3), // ~0.539 (E_flow ~54%, L(N) the rest)
  },
  frozenLLogistic: FROZEN, // exact-power-law: inflection on crossover to ~3e-7, sigma = 0.5
  perturbationTracking: {
    crossoverSpanDecades: +PERTURB_CROSS_SPAN.toFixed(3), // ~1.324 (crossover dragged over a decade)
    offsetMinLog10: +PERTURB_OFFSET_MIN.toFixed(5), // ~0.00675
    offsetMaxLog10: +PERTURB_OFFSET_MAX.toFixed(5), // ~0.00881
    rows: PERTURBS,
  },
  finding: {
    M1_frozen_L_exact:
      'Freezing L makes sigma an exact logistic in log N; its curvature inflection lands on the ' +
      'crossover to ~3.4e-7 in log10 and sigma there is 0.500000. The forcing is exact when the ' +
      'E_coll power law is exact -- the knee is pinned to sigma = 1/2 by the share functional shape.',
    M2_full_model_same_landmark:
      'With L(N) varying the sigma-curvature inflection is at log10 ~ 9.533 (sigma ~ 0.4949), only ' +
      '+0.0168 above the crossover, and it matches the imp-96388 OLS-exponent knee (9.529) to 0.0037 ' +
      '-- one landmark under two estimators.',
    M3_offset_is_computable:
      'Turning off E_flow drops the offset from +0.0168 to +0.0077, so nonzero E_flow supplies ~54% ' +
      'of the residual and the slowly-varying L(N) = log(effectiveHeight) supplies the rest. The ' +
      'offset is a sub-leading correction, not an accident.',
    M4_tracks_the_crossover:
      'Scaling C_C and E_trunc drags the crossover across 1.32 decades (log10 8.88 -> 10.21); the ' +
      'inflection follows with a near-constant offset in [+0.0068, +0.0088] and sigma at inflection ' +
      'in [0.4976, 0.4981]. A coincidence would not track -- the rigid tracking confirms FORCED.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). The imp-96388 exponent-ramp knee ' +
    'is FORCED to coincide with the E_coll = E_trunc crossover, NOT a numerical coincidence: at the ' +
    'knee scale E_flow is negligible so sigma = E_coll/(E_trunc + E_coll) with E_coll a power law in ' +
    'N is a LOGISTIC in log N, whose curvature inflection is intrinsically pinned to sigma = 1/2 = ' +
    'the crossover, and the OLS local exponent p ~ (1/2)(1 - sigma)(1 - 1/L) inherits that ' +
    'inflection. The frozen-L exact-power-law test lands the inflection on the crossover to ~3e-7 ' +
    '(sigma = 0.500000); the full-model sigma-inflection (9.533) matches the imp-96388 OLS knee ' +
    '(9.529) to 0.0037; the residual +0.0168 log10 offset is a computable sub-leading correction ' +
    '(~54% nonzero E_flow, the rest the slowly-varying L(N)); and dragging the crossover across 1.32 ' +
    'decades keeps the offset in [+0.0068, +0.0088] with sigma ~ 0.498 -- rigid tracking a ' +
    'coincidence could not produce. Component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96388 (knee ~0.013 log10 above the crossover); imp-96351 (knee at log10 N* ~ 9.529); ' +
    'imp-33723 (closed-form crossover N_cross ~ 3.28e9); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping.',
});

export default IMP96405_KNEE_CROSSOVER_FORCED_VS_COINCIDENTAL;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96405_ASSERTIONS = [
  {
    id: 'imp96405-frozen-L-forcing-is-exact',
    description: 'frozen-L logistic: inflection lands on the crossover to machine tol and sigma there is 1/2',
    holds: () => FROZEN.offsetAbs < 1e-4 && Math.abs(FROZEN.sigmaAtInflection - 0.5) < 1e-4,
  },
  {
    id: 'imp96405-full-inflection-is-the-imp96388-knee',
    description: 'the full-model sigma-curvature inflection coincides with the imp-96388 OLS-exponent knee',
    holds: () => INFL_VS_OLS_KNEE < 0.01 && Math.abs(OLS_KNEE - 9.529) < 0.01,
  },
  {
    id: 'imp96405-offset-small-and-at-half',
    description: 'the full-model knee sits only ~0.017 log10 above the crossover with sigma ~ 1/2 there',
    holds: () =>
      INFL_FULL_OFFSET > 0 && INFL_FULL_OFFSET < 0.03 && Math.abs(SIGMA_AT_INFL_FULL - 0.5) < 0.02,
  },
  {
    id: 'imp96405-offset-decomposes',
    description: 'E_flow supplies a bounded fraction of the residual offset (rest is the slowly-varying L)',
    holds: () => EFLOW_SHARE_OF_OFFSET > 0.3 && EFLOW_SHARE_OF_OFFSET < 0.8 && INFL_NOFLOW_OFFSET > 0,
  },
  {
    id: 'imp96405-inflection-tracks-the-crossover',
    description: 'dragging the crossover >1 decade, the inflection follows with a near-constant small offset',
    holds: () =>
      PERTURB_CROSS_SPAN > 1.0 &&
      PERTURB_OFFSET_MIN > 0 &&
      PERTURB_OFFSET_MAX < 0.02 &&
      PERTURBS.every((r) => Math.abs(r.sigmaAtInflection - 0.5) < 0.02),
  },
  {
    id: 'imp96405-honesty-gate-no-qed',
    description: 'Measurement/derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96405_KNEE_CROSSOVER_FORCED_VS_COINCIDENTAL.isRigorous === false &&
      /NO QED/.test(IMP96405_KNEE_CROSSOVER_FORCED_VS_COINCIDENTAL.verdict) &&
      /refereed bound is changed/i.test(IMP96405_KNEE_CROSSOVER_FORCED_VS_COINCIDENTAL.verdict),
  },
];

for (const a of IMP96405_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96405-knee-crossover-forced-vs-coincidental assertion failed: ${a.id}`);
  }
}
