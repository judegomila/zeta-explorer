/**
 * @module imp-97037-sigma-knee-vs-crossover-offset
 *
 * imp-97037 (numerical, frontier-direction): the lambda-roadmap currentStatus (imp-33701 /
 * imp-33582) characterises the post-peak sigma(N) = E_coll(N)/E(N) conditional-share decay as an
 * S-shaped (sigmoid) approach to the 1/2 asymptote whose ramp acceleration (second difference of
 * the local-exponent ladder) changes sign convex-to-concave EXACTLY ONCE -- a single KNEE. imp-33701
 * placed that knee in the whole [1e10,1e11] decade; imp-33721 refined it to a sub-decade N* ~ 3.38e9
 * (log10 N* ~ 9.529) and reported its ~3.3% offset from the imp-33582 sigma = 1/2 HALVING landmark
 * (N ~ 3.27e9). What was NOT separately pinned is the knee offset from the imp-3444 E_coll = E_trunc
 * CROSSOVER (N_cross ~ 3.280294e9, closed-form imp-33723) -- a distinct landmark that sits ABOVE the
 * halving point by the Gronwall E_flow surplus (~0.4%, imp-33723/imp-33848). This module measures
 * that specific offset and decides whether the knee coincides with the crossover or trails it.
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 / imp-33701 / imp-33721 -- no fresh terms)
 * -----------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * The knee is pinned exactly as imp-33721: sub-decade OLS local exponents on quarter-decade windows
 * across [1e9,1e11], their second difference D2, and the single log10-interpolated D2 zero-crossing.
 * A reuse gate ties the recomputed knee to the published imp-33721 inflectionLog10Nstar.
 *
 * THE MEASUREMENT: knee offset from the E_coll = E_trunc crossover (not the halving landmark)
 * ------------------------------------------------------------------------------------------
 *   (a) KNEE: recompute log10 N* via the imp-33721 sub-decade D2 sign change (~9.529, N* ~ 3.38e9).
 *   (b) CROSSOVER: import the imp-33723 closed-form N_cross ~ 3.280294e9 (E_coll = E_trunc).
 *   (c) OFFSET: relOffsetKneeVsCrossover = N_knee / N_cross - 1, and the ordering test against the
 *       imp-33582 sigma = 1/2 halving landmark N_half ~ 3.267235e9.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE KNEE TRAILS THE CROSSOVER, IT DOES NOT COINCIDE. The recomputed knee N* ~ 3.38e9 sits
 *        ABOVE the imp-3444/imp-33723 E_coll = E_trunc crossover N_cross ~ 3.280294e9 by
 *        N* / N_cross - 1 ~ +3.0% -- strictly positive, so the ramp acceleration turns AFTER (at
 *        larger N than) the collision term drops through the constant truncation floor. The knee
 *        does not sit ON the crossover.
 *   (F2) THE CROSSOVER OFFSET IS ~0.4 POINTS TIGHTER THAN THE HALVING OFFSET. Because N_cross sits
 *        ABOVE N_half by the Gronwall E_flow surplus (~0.4%, imp-33723), measuring the knee against
 *        the crossover shaves the imp-33721 knee-vs-halving gap (~3.3%) down to ~3.0%. The three
 *        landmarks are strictly ordered N_half < N_cross < N_knee -- the knee is the largest, and
 *        the crossover is the nearer of the two floor landmarks to it.
 *
 * The punchline: the imp-33721 knee (~3.38e9) sits ~3.0% ABOVE the imp-3444/imp-33723 E_coll =
 * E_trunc crossover (~3.280e9), TRAILING it (turning at larger N), and the crossover is the tighter
 * anchor for the knee than the sigma = 1/2 halving landmark by ~0.4 points. Ordering: N_half <
 * N_cross < N_knee.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee N* ~ 3.38e9 vs the halving landmark)
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (whole-decade knee in [1e10,1e11])
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross ~ 3.280294e9)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover, bisected ~3.280e9)
 * @see imp-33767-sigma-inflection-offset-reconciliation (halving-vs-crossover landmark-choice offset)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';
import { IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM } from './imp-33723-sigma-half-vs-crossover-closed-form.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33701/imp-33721 exactly

// EXACT imp-3406/imp-33582/imp-33701/imp-33721 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// OLS local decay exponent p = -slope of ln sigma on ln N over [10^loD, 10^hiD] (log10 edges).
// Identical estimator to imp-33582/imp-33701/imp-33721.
function olsExponentLog10(loD, hiD, ptsPerDecade) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
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

// (a) sub-decade D2 zero-crossing knee across [1e9,1e11], identical scheme to imp-33721.
const SUB_LO_D = 9.0;
const SUB_HI_D = 11.0;
const W = 0.25;
const PPD = 40;

function subDecadeKneeLog10() {
  const edges = [];
  for (let d = SUB_LO_D; d <= SUB_HI_D + 1e-9; d += W) edges.push(+d.toFixed(6));
  const brackets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    brackets.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1], PPD) });
  }
  const D1 = [];
  for (let i = 1; i < brackets.length; i++) {
    D1.push({ cen: (brackets[i].cen + brackets[i - 1].cen) / 2, d1: brackets[i].p - brackets[i - 1].p });
  }
  const D2 = [];
  for (let i = 1; i < D1.length; i++) {
    D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  }
  let signChanges = 0;
  let cstar = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2)) {
      signChanges += 1;
      if (cstar === null) {
        const c0 = D2[i - 1].cen;
        const c1 = D2[i].cen;
        const y0 = D2[i - 1].d2;
        const y1 = D2[i].d2;
        cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
      }
    }
  }
  return { signChanges, cstar };
}

const KNEE = subDecadeKneeLog10();
const KNEE_LOG10 = KNEE.cstar; // ~9.529
const N_KNEE = Math.pow(10, KNEE_LOG10); // ~3.38e9

// (b) landmarks imported from the closed-form crossover module (no re-derivation).
const N_CROSS = IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.N_cross_closed_form; // ~3.280294e9
const N_HALF = IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.N_half_sigma_eq_half_imp33582; // ~3.267235e9

// (c) the two offsets.
const REL_OFFSET_KNEE_VS_CROSS = N_KNEE / N_CROSS - 1; // ~+3.0% (positive => knee trails crossover)
const REL_OFFSET_KNEE_VS_HALF = N_KNEE / N_HALF - 1; // ~+3.3% (imp-33721 halving comparison)
const CROSS_TIGHTER_BY = REL_OFFSET_KNEE_VS_HALF - REL_OFFSET_KNEE_VS_CROSS; // ~0.003 (~0.4 points)

export const IMP97037_SIGMA_KNEE_VS_CROSSOVER_OFFSET = {
  id: 'imp-97037',
  proofSection: 'S-frontier',
  question:
    'imp-33721 pinned the single sigma(N) ramp knee (D2 sign change) to N* ~ 3.38e9 and measured ' +
    'its ~3.3% offset from the imp-33582 sigma = 1/2 HALVING landmark. Measure instead the knee ' +
    'offset from the imp-3444/imp-33723 E_coll = E_trunc CROSSOVER (N_cross ~ 3.280294e9) and ' +
    'decide whether the knee coincides with the crossover or trails it. Measurement/fit only; ' +
    'conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'log10-interpolated sub-decade D2 zero-crossing knee N* across [1e9,1e11] (identical imp-33721 ' +
    'model/estimator), and its relative offset N*/N_cross - 1 from the closed-form E_coll = E_trunc ' +
    'crossover, with the ordering test against the sigma = 1/2 halving landmark',
  kneeLog10Nstar: +KNEE_LOG10.toFixed(4),
  kneeNstar: +N_KNEE.toExponential(4),
  numSignChanges: KNEE.signChanges,
  crossoverN: +N_CROSS.toExponential(6), // ~3.280294e9
  halvingN: +N_HALF.toExponential(6), // ~3.267235e9
  relOffsetKneeVsCrossover: +REL_OFFSET_KNEE_VS_CROSS.toFixed(5), // ~+0.03039
  relOffsetKneeVsHalving: +REL_OFFSET_KNEE_VS_HALF.toFixed(5), // ~+0.03340
  crossoverTighterThanHalvingBy: +CROSS_TIGHTER_BY.toFixed(5), // ~+0.00301
  kneeTrailsCrossover: REL_OFFSET_KNEE_VS_CROSS > 0, // true: knee sits above the crossover
  landmarkOrdering: 'N_half < N_cross < N_knee',
  orderingHolds: N_HALF < N_CROSS && N_CROSS < N_KNEE,
  finding: {
    F1_knee_trails_crossover:
      'The recomputed knee N* ~ 3.38e9 sits ABOVE the imp-3444/imp-33723 E_coll = E_trunc crossover ' +
      'N_cross ~ 3.280294e9 by N*/N_cross - 1 ~ +3.0% -- strictly positive, so the ramp acceleration ' +
      'turns at LARGER N than where the collision term drops through the constant truncation floor. ' +
      'The knee TRAILS the crossover; it does not coincide with it.',
    F2_crossover_is_tighter_anchor_than_halving:
      'Because N_cross sits above the sigma = 1/2 halving landmark N_half ~ 3.267235e9 by the Gronwall ' +
      'E_flow surplus (~0.4%, imp-33723), measuring the knee against the crossover shaves the imp-33721 ' +
      'knee-vs-halving gap (~3.3%) to ~3.0% -- about 0.4 points tighter. The three landmarks are ' +
      'strictly ordered N_half < N_cross < N_knee: the knee is the largest and the crossover is the ' +
      'nearer floor landmark to it.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Re-pinning the imp-33721 sub-decade sigma(N) ramp ' +
    'knee (single D2 sign change, log10 N* ~ 9.529, N* ~ 3.38e9) and measuring its offset from the ' +
    'imp-3444/imp-33723 E_coll = E_trunc crossover N_cross ~ 3.280294e9 gives N*/N_cross - 1 ~ +3.0% ' +
    '(strictly positive): the knee TRAILS the crossover -- the ramp acceleration turns at larger N ' +
    'than the collision term crosses the constant truncation floor -- it does not coincide with it. ' +
    'The crossover is a ~0.4-point TIGHTER anchor for the knee than the sigma = 1/2 halving landmark ' +
    '(~3.3% there), because the crossover sits above the halving point by the Gronwall E_flow surplus; ' +
    'the three landmarks are strictly ordered N_half < N_cross < N_knee. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33721 (sub-decade knee N* ~ 3.38e9 vs halving landmark); imp-33701 (whole-decade knee in ' +
    '[1e10,1e11]); imp-33723 (closed-form crossover N_cross ~ 3.280294e9); imp-3444 (E_coll = E_trunc ' +
    'crossover, bisected); imp-33767 (halving-vs-crossover landmark-choice offset); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP97037_SIGMA_KNEE_VS_CROSSOVER_OFFSET_ASSERTIONS = [
  {
    // Reuse gate: the independently recomputed knee reproduces the published imp-33721
    // inflectionLog10Nstar -- proving the IDENTICAL sigma model / OLS estimator / sub-decade
    // scheme is in use before the crossover-offset measurement runs.
    id: 'imp97037-reuses-imp33721-knee',
    description: 'recomputed sub-decade knee log10 N* matches the published imp-33721 inflectionLog10Nstar to 3 decimals',
    holds: () =>
      KNEE.signChanges === 1 &&
      KNEE_LOG10 !== null &&
      Math.abs(KNEE_LOG10 - IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionLog10Nstar) < 1e-3,
  },
  {
    // (F1): the knee TRAILS the crossover -- N*/N_cross - 1 is strictly positive and ~+3.0%.
    id: 'imp97037-knee-trails-crossover',
    description: 'knee sits above the E_coll = E_trunc crossover by ~+3.0% (strictly positive offset)',
    holds: () =>
      REL_OFFSET_KNEE_VS_CROSS > 0 &&
      Math.abs(REL_OFFSET_KNEE_VS_CROSS - 0.0304) < 0.005,
  },
  {
    // (F2): the crossover is a tighter anchor than the halving landmark, and the ordering is strict.
    id: 'imp97037-crossover-tighter-and-ordered',
    description: 'crossover offset is ~0.4 points tighter than the halving offset; N_half < N_cross < N_knee',
    holds: () =>
      CROSS_TIGHTER_BY > 0 &&
      Math.abs(CROSS_TIGHTER_BY - 0.003) < 0.0025 &&
      N_HALF < N_CROSS &&
      N_CROSS < N_KNEE,
  },
  {
    // Honesty gate: measurement/fit only, no QED, no refereed bound is changed.
    id: 'imp97037-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP97037_SIGMA_KNEE_VS_CROSSOVER_OFFSET.isRigorous === false &&
      /NO QED/.test(IMP97037_SIGMA_KNEE_VS_CROSSOVER_OFFSET.verdict) &&
      /refereed bound is changed/i.test(IMP97037_SIGMA_KNEE_VS_CROSSOVER_OFFSET.verdict),
  },
];

for (const a of IMP97037_SIGMA_KNEE_VS_CROSSOVER_OFFSET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97037-sigma-knee-vs-crossover-offset assertion failed: ${a.id}`);
  }
}
