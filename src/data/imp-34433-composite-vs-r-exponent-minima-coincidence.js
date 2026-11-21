/**
 * @module imp-34433-composite-vs-r-exponent-minima-coincidence
 *
 * imp-34433 (numerical, opus-4-8): Locate the exact thr* at which the imp-34329
 * local COMPOSITE exponent (d log surplus / d log thr, shallow minimum ~2.871)
 * bottoms and the exact thr* at which the imp-34349 isolated R exponent
 * (d log r / d log thr, shallow minimum ~1.875) bottoms, then TEST the predicted
 * coincidence: since surplus = P(thr) . r(thr) gives composite = prefactor-share
 * + r-exponent, and the prefactor share -> 1, the two minima were expected to
 * fall at the same thr. Do they?
 *
 * THE PREDICTION AND WHY IT COULD FAIL
 * ------------------------------------
 * imp-34329 F2 placed the composite minimum ~2.8711 in the 0.05->0.01 secant
 * window; imp-34349 M2 placed the isolated r minimum ~1.875 near thr ~ 0.005-0.01.
 * Because surplus = P . r exactly,
 *
 *     d log surplus / d log thr = d log P / d log thr + d log r / d log thr,
 *
 * i.e. composite(thr) = Pshare(thr) + rexp(thr). If Pshare were a CONSTANT (the
 * naive "composite = 1 + r-exponent" reading, valid only in the P -> 1 limit),
 * the composite turning point d composite / d log thr = 0 would coincide exactly
 * with the r turning point d rexp / d log thr = 0. But Pshare = d log P / d log thr
 * is itself thr-dependent; its non-zero slope displaces the composite minimum
 * away from the r minimum. This module measures that displacement.
 *
 * THE MEASUREMENT (INSTANTANEOUS, NOT SECANT)
 * -------------------------------------------
 * Reusing the IDENTICAL imp-34329/imp-34349/imp-34248/imp-34174/imp-33743
 * sub-terms verbatim (crossoverN fixed point, eFlow, E_TRUNC_PT, prefactor P),
 * this import-light self-asserting module computes the INSTANTANEOUS log-log
 * exponents by central difference in u = log thr (step H = 1e-4), scans a fine
 * log grid, and parabola-refines each interior minimum -- giving a sharper thr*
 * than the adjacent-rung secants of imp-34329/imp-34349.
 *
 * (F1) The two minima do NOT coincide. The composite exponent bottoms at
 *      thr* ~ 1.1962e-2 (value ~2.86682); the isolated r exponent bottoms at
 *      thr* ~ 4.845e-3 (value ~1.87430). The composite minimum sits at a thr
 *      that is ~2.469x LARGER than the r minimum -- an offset of ~0.3925 decades.
 *
 * (F2) The cause is the thr-dependence of the prefactor share. The instantaneous
 *      Pshare = d log P / d log thr is NOT the constant 1 the naive coincidence
 *      would need: it measures ~0.98789 at the composite minimum and ~0.99513 at
 *      the r minimum (rising toward 1 as thr shrinks). Its non-zero slope-in-thr
 *      is exactly what shifts the composite turning point to larger thr.
 *
 * (F3) The exact decomposition holds pointwise. At the composite minimum the
 *      r-exponent has ALREADY turned and climbed to ~1.87893 (above its own
 *      ~1.87430 floor) while Pshare ~0.98789, summing to the composite minimum
 *      ~2.86682 to full precision. The naive 1 + r_min = 2.87430 OVERSHOOTS the
 *      true composite minimum 2.86682 by ~0.0075, because it wrongly pins Pshare
 *      at 1 and evaluates r at the WRONG thr. So "composite = 1 + r-exponent"
 *      is a leading-order (P -> 1) reading only; the minima are genuinely
 *      distinct at finite thr.
 *
 * HONEST SCOPE -- location/measurement ONLY, NO QED. This locates the minima of
 * two diagnostic exponents within the inherited imp-34174/imp-33743 extrapolation
 * component model; it changes no bound and introduces no new mathematical claim.
 * The component model is NOT a rigorous asymptotic. E_flow is the benign
 * mesoscopic-Gronwall term (imp-2845); its vanishing here does NOT touch the
 * divergent C_Lip collision-Gronwall. The C_mb GUE-conditional per imp-486 is
 * UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity;
 * no refereed bound is changed.
 *
 * @see imp-34329-crossover-surplus-fartail-composite-limit (composite exponent, shallow minimum ~2.871)
 * @see imp-34349-eflow-ratio-r-exponent-limit (isolated r exponent, shallow minimum ~1.875)
 * @see imp-34248-crossover-surplus-small-thr-asymptotic (the factorisation surplus = P . r)
 * @see imp-34174-crossover-surplus-threshold-family-decay (the closed form surplus(thr))
 * @see imp-33743-sigma-fartail-crossover-closed-form (generalised crossover N_cross(thr), identical sub-terms)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34329/imp-34349 exactly (~1.000237)

// EXACT imp-34329/imp-34349 sub-terms (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)
function crossoverN(thr) {
  const K_thr = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = 1e9;
  for (let i = 0; i < 120; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}
// surplus(thr) = P(thr) . r(thr), P(thr) = thr(1-thr)/(1 + (1-thr)r) (imp-34174).
function factors(thr) {
  const N = crossoverN(thr);
  const r = eFlow(N) / E_TRUNC_PT;
  const P = (thr * (1 - thr)) / (1 + (1 - thr) * r);
  return { r, surplus: P * r };
}

// ── Instantaneous log-log exponent via central difference in u = log thr ──────
// Sharper than the adjacent-rung secants of imp-34329/imp-34349: it locates the
// turning point of d log(field) / d log thr rather than averaging over a decade.
const H = 1e-4;
function instExponent(field, thr) {
  const fP = factors(Math.exp(Math.log(thr) + H))[field];
  const fM = factors(Math.exp(Math.log(thr) - H))[field];
  return (Math.log(fP) - Math.log(fM)) / (2 * H);
}

// ── Locate an interior minimum: coarse log-grid scan then parabola refinement ──
function locateMinimum(field) {
  const grid = [];
  for (let lg = -1.0; lg >= -4.0; lg -= 0.01) {
    const thr = 10 ** lg;
    grid.push({ lg, v: instExponent(field, thr) });
  }
  let mv = Infinity;
  let idx = 0;
  grid.forEach((p, i) => {
    if (p.v < mv) {
      mv = p.v;
      idx = i;
    }
  });
  const a = grid[idx - 1];
  const b = grid[idx];
  const c = grid[idx + 1];
  const x0 = a.lg;
  const x1 = b.lg;
  const x2 = c.lg;
  const y0 = a.v;
  const y1 = b.v;
  const y2 = c.v;
  const den = (x0 - x1) * (x0 - x2) * (x1 - x2);
  const A = (x2 * (y1 - y0) + x1 * (y0 - y2) + x0 * (y2 - y1)) / den;
  const B = (x2 * x2 * (y0 - y1) + x1 * x1 * (y2 - y0) + x0 * x0 * (y1 - y2)) / den;
  const lgVertex = -B / (2 * A);
  const valVertex = A * lgVertex * lgVertex + B * lgVertex + (y0 - A * x0 * x0 - B * x0);
  return { logThr: +lgVertex.toFixed(4), thr: +(10 ** lgVertex).toExponential(4), value: +valVertex.toFixed(5) };
}

const COMPOSITE_MIN = locateMinimum('surplus'); // d log surplus / d log thr
const R_MIN = locateMinimum('r'); // d log r / d log thr

// ── Coincidence test and prefactor-share diagnostics at each located minimum ──
const OFFSET_DECADES = +(COMPOSITE_MIN.logThr - R_MIN.logThr).toFixed(4);
const THR_RATIO = +(COMPOSITE_MIN.thr / R_MIN.thr).toFixed(4);
const PSHARE_AT_COMPOSITE_MIN = +(instExponent('surplus', COMPOSITE_MIN.thr) - instExponent('r', COMPOSITE_MIN.thr)).toFixed(5);
const PSHARE_AT_R_MIN = +(instExponent('surplus', R_MIN.thr) - instExponent('r', R_MIN.thr)).toFixed(5);
const R_EXP_AT_COMPOSITE_MIN = +instExponent('r', COMPOSITE_MIN.thr).toFixed(5);
const COMPOSITE_AT_R_MIN = +instExponent('surplus', R_MIN.thr).toFixed(5);
const NAIVE_ONE_PLUS_R_MIN = +(1 + R_MIN.value).toFixed(5); // the "composite = 1 + r-exponent" reading

export const IMP34433_COMPOSITE_VS_R_EXPONENT_MINIMA_COINCIDENCE = {
  id: 'imp-34433',
  proofSection: 'S-frontier',
  question:
    'Locate the exact thr* at which the imp-34329 composite exponent (d log surplus / d log thr, ' +
    'shallow minimum ~2.871) bottoms and the exact thr* at which the imp-34349 isolated r exponent ' +
    '(d log r / d log thr, shallow minimum ~1.875) bottoms, and test the predicted coincidence: since ' +
    'surplus = P(thr) . r(thr) gives composite = prefactor-share + r-exponent and the prefactor share ' +
    '-> 1, do the two minima fall at the same thr, or does the prefactor share P(thr) shift them apart? ' +
    'Location/measurement only within the inherited component model; changes no bound; NO QED.',
  answer:
    'The two minima do NOT coincide. The composite exponent bottoms at thr* ~ 1.1962e-2 (value ~2.86682); ' +
    'the isolated r exponent bottoms at thr* ~ 4.845e-3 (value ~1.87430) -- the composite minimum sits at ' +
    'a thr ~2.469x LARGER than the r minimum, an offset of ~0.3925 decades. The cause is the thr-dependence ' +
    'of the prefactor share d log P / d log thr, which is NOT the constant 1 the naive coincidence needs ' +
    '(~0.98789 at the composite minimum, ~0.99513 at the r minimum, rising toward 1 as thr shrinks); its ' +
    'non-zero slope displaces the composite turning point to larger thr. The exact decomposition still ' +
    'holds pointwise -- at the composite minimum the r-exponent has already climbed to ~1.87893 and ' +
    'Pshare ~0.98789 sum to ~2.86682 -- so "composite = 1 + r-exponent" is a leading-order (P -> 1) ' +
    'reading only: the naive 1 + r_min = 2.87430 overshoots the true composite minimum 2.86682 by ~0.0075.',
  compositeMinimum: COMPOSITE_MIN,
  rMinimum: R_MIN,
  coincidenceTest: {
    minima_coincide: false,
    offset_in_decades: OFFSET_DECADES,
    thr_ratio_composite_over_r: THR_RATIO,
    prefactor_share_at_composite_min: PSHARE_AT_COMPOSITE_MIN,
    prefactor_share_at_r_min: PSHARE_AT_R_MIN,
    r_exponent_at_composite_min: R_EXP_AT_COMPOSITE_MIN,
    composite_at_r_min: COMPOSITE_AT_R_MIN,
    naive_one_plus_r_min: NAIVE_ONE_PLUS_R_MIN,
    naive_overshoot: +(NAIVE_ONE_PLUS_R_MIN - COMPOSITE_MIN.value).toFixed(5),
  },
  finding: {
    F1_minima_do_not_coincide:
      'The composite exponent d log surplus / d log thr bottoms at thr* ~ 1.1962e-2 (value ~2.86682) and ' +
      'the isolated r exponent d log r / d log thr bottoms at thr* ~ 4.845e-3 (value ~1.87430); the ' +
      'composite minimum is at a thr ~2.469x LARGER than the r minimum, an offset of ~0.3925 decades. ' +
      'The predicted coincidence FAILS.',
    F2_prefactor_share_shifts_it:
      'The displacement is caused by the thr-dependence of the prefactor share d log P / d log thr, which ' +
      'is NOT the constant 1 the naive coincidence requires: it measures ~0.98789 at the composite minimum ' +
      'and ~0.99513 at the r minimum (rising toward 1 as thr shrinks). Its non-zero slope in thr moves the ' +
      'composite turning point away from the r turning point toward larger thr.',
    F3_decomposition_pointwise_naive_overshoots:
      'The exact identity composite = Pshare + r-exponent holds pointwise: at the composite minimum the ' +
      'r-exponent has already turned and climbed to ~1.87893 (above its ~1.87430 floor) while Pshare ' +
      '~0.98789, summing to ~2.86682 to full precision. The naive 1 + r_min = 2.87430 overshoots the true ' +
      'composite minimum by ~0.0075, pinning Pshare at 1 and evaluating r at the wrong thr; so ' +
      '"composite = 1 + r-exponent" is a leading-order (P -> 1) reading, not an exact coincidence.',
  },
  isRigorous: false,
  honestScope:
    'Location/measurement only within the inherited imp-34329/imp-34349/imp-34248/imp-34174/imp-33743 ' +
    'extrapolation component model; NO QED. The component model is NOT a rigorous asymptotic and the ' +
    'located minima are diagnostic exponent turning points, not proved limits. E_flow is the benign ' +
    'mesoscopic-Gronwall term (imp-2845) and its vanishing here does NOT touch the divergent C_Lip ' +
    'collision-Gronwall; the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C ' +
    '1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator ' +
    'positivity; changes no bound; no refereed bound is changed.',
  citation:
    'imp-34329-crossover-surplus-fartail-composite-limit.js (composite exponent, shallow minimum ~2.871); ' +
    'imp-34349-eflow-ratio-r-exponent-limit.js (isolated r exponent, shallow minimum ~1.875); ' +
    'imp-34248-crossover-surplus-small-thr-asymptotic.js (the factorisation surplus = P . r); ' +
    'imp-34174-crossover-surplus-threshold-family-decay.js (closed form surplus(thr)); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34433_COMPOSITE_VS_R_EXPONENT_MINIMA_COINCIDENCE_ASSERTIONS = [
  {
    // F1: both minima are located, finite, interior, and land at the expected thr and values.
    id: 'imp34433-minima-located',
    description: 'the composite minimum lands at thr* ~1.196e-2 (value ~2.867) and the r minimum at thr* ~4.85e-3 (value ~1.874), both finite and interior to the scanned window',
    holds: () => {
      const okThr = (t) => Number.isFinite(t) && t > 1e-4 && t < 1e-1;
      return (
        okThr(COMPOSITE_MIN.thr) && okThr(R_MIN.thr) &&
        Math.abs(COMPOSITE_MIN.thr / 1.1962e-2 - 1) < 1e-2 &&
        Math.abs(COMPOSITE_MIN.value - 2.86682) < 1e-3 &&
        Math.abs(R_MIN.thr / 4.845e-3 - 1) < 1e-2 &&
        Math.abs(R_MIN.value - 1.87430) < 1e-3
      );
    },
  },
  {
    // F1: the minima do NOT coincide -- composite minimum at a strictly LARGER thr, offset ~0.39 decades.
    id: 'imp34433-minima-do-not-coincide',
    description: 'the composite minimum sits at a strictly larger thr than the r minimum (ratio ~2.469, offset ~0.3925 decades); the predicted coincidence fails',
    holds: () =>
      COMPOSITE_MIN.thr > R_MIN.thr &&
      Math.abs(OFFSET_DECADES - 0.3925) < 1e-2 &&
      Math.abs(THR_RATIO - 2.469) < 1e-2,
  },
  {
    // F2: the prefactor share is NOT the constant 1 the naive coincidence needs -- it is thr-dependent.
    id: 'imp34433-prefactor-share-thr-dependent',
    description: 'the instantaneous prefactor share d log P / d log thr differs at the two minima (~0.98789 vs ~0.99513), both below 1 and rising toward 1 as thr shrinks',
    holds: () =>
      PSHARE_AT_COMPOSITE_MIN < 1 && PSHARE_AT_R_MIN < 1 &&
      PSHARE_AT_R_MIN > PSHARE_AT_COMPOSITE_MIN &&
      Math.abs(PSHARE_AT_COMPOSITE_MIN - 0.98789) < 2e-3 &&
      Math.abs(PSHARE_AT_R_MIN - 0.99513) < 2e-3,
  },
  {
    // F3: the exact decomposition composite = Pshare + r-exponent holds pointwise at the composite minimum.
    id: 'imp34433-decomposition-holds-pointwise',
    description: 'at the composite minimum, prefactor-share + r-exponent reproduces the composite minimum value to full precision, and the r-exponent there (~1.879) exceeds its own floor (~1.874)',
    holds: () =>
      Math.abs(PSHARE_AT_COMPOSITE_MIN + R_EXP_AT_COMPOSITE_MIN - COMPOSITE_MIN.value) < 1e-3 &&
      R_EXP_AT_COMPOSITE_MIN > R_MIN.value,
  },
  {
    // F3: the naive "composite = 1 + r-exponent" reading OVERSHOOTS the true composite minimum.
    id: 'imp34433-naive-one-plus-r-overshoots',
    description: 'the naive 1 + r_min (~2.87430) exceeds the true composite minimum (~2.86682) by ~0.0075, confirming the coincidence is only a leading-order (P -> 1) reading',
    holds: () =>
      NAIVE_ONE_PLUS_R_MIN > COMPOSITE_MIN.value &&
      Math.abs(NAIVE_ONE_PLUS_R_MIN - COMPOSITE_MIN.value - 0.00748) < 3e-3,
  },
  {
    // Honesty gate: location/measurement only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34433-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34433_COMPOSITE_VS_R_EXPONENT_MINIMA_COINCIDENCE.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34433_COMPOSITE_VS_R_EXPONENT_MINIMA_COINCIDENCE.honestScope) &&
      /NO QED/.test(IMP34433_COMPOSITE_VS_R_EXPONENT_MINIMA_COINCIDENCE.honestScope) &&
      /refereed bound is changed/i.test(IMP34433_COMPOSITE_VS_R_EXPONENT_MINIMA_COINCIDENCE.honestScope),
  },
];

for (const a of IMP34433_COMPOSITE_VS_R_EXPONENT_MINIMA_COINCIDENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34433-composite-vs-r-exponent-minima-coincidence assertion failed: ${a.id}`);
  }
}
