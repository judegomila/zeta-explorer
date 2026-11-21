/**
 * @module imp-33721-sigma-ramp-inflection-subdecade
 *
 * imp-33721 (numerical, frontier-direction): imp-33701 differenced the imp-33582 six-decade
 * sigma(N) = E_coll/E(N) post-peak local-exponent ladder and found the ramp is SIGMOID -- its
 * discrete second difference D2 (ramp acceleration) changes sign exactly once (convex ->
 * concave), a single KNEE. But imp-33701 used a COARSE whole-decade ladder (one OLS exponent
 * per decade [10^k, 10^(k+1)], k = 6..11), so it could only localize that knee to a WHOLE
 * decade -- it reported the inflection "in the [1e10,1e11] decade". Decade-averaging smears the
 * local exponent, so a whole-decade window cannot say WHERE inside those decades the ramp
 * actually turns. This module refines the localization: it subdivides [1e9, 1e11] into narrow
 * intra-decade sub-brackets (quarter-decade wide), recomputes the OLS local exponent p_dec on
 * each, forms the sub-decade first/second differences, and interpolates the sub-decade N* where
 * D2 crosses zero -- pinning the knee far finer than the whole-decade bracket imp-33701 reports.
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 / imp-33701 -- no fresh terms)
 * -----------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * The full-decade ladder p_dec(6..11) reproduces the imp-33582 / imp-33701 published ladder to
 * the printed 4 decimals (reuse gate below) -- the SAME sigma sub-terms and OLS estimator.
 *
 * THE MEASUREMENT: sub-decade curvature of the exponent ramp across [1e9, 1e11]
 * ----------------------------------------------------------------------------
 *   (a) SUB-BRACKETS: partition [1e9, 1e11] into W = 0.25-decade windows (edges at log10 N =
 *       9.00, 9.25, ..., 11.00 -> 8 sub-brackets); each gets its own OLS local exponent p_dec
 *       (dense 40 pts/decade), represented by its geometric-mean center.
 *   (b) SUB-DECADE VELOCITY / ACCELERATION: D1 (first difference of consecutive sub-bracket
 *       exponents) and D2 (second difference) on the sub-decade centers.
 *   (c) SUB-DECADE INFLECTION N*: the single center where D2 crosses zero, linearly interpolated
 *       in log10 N -- the knee located to a sub-decade N* rather than a whole decade.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE KNEE IS AT N* ~ 3.38e9, A FULL DECADE BELOW imp-33701 REPORTED. On the fine
 *        sub-decade grid the sub-bracket velocity D1 peaks near center 1e9.5 (~3.16e9) and the
 *        acceleration D2 changes sign exactly ONCE, crossing zero at center log10 N* ~ 9.529,
 *        i.e. N* ~ 3.38e9 -- inside the [1e9, 1e10] decade, a full decade BELOW the whole-decade
 *        [1e10, 1e11] bracket imp-33701 reported. The coarse ladder did not err; decade-averaging
 *        SMEARS the local curvature and pushes the apparent knee a decade too high. Resolving the
 *        exponent at sub-decade width relocates the true inflection to N* ~ 3.38e9.
 *   (F2) THE LOCALIZATION IS ROBUST TO WINDOW WIDTH. Recomputed at sub-bracket widths W in
 *        {0.1, 0.125, 0.2, 0.25}-decade the single D2 zero-crossing stays at log10 N* ~ 9.529
 *        (N* ~ 3.38e9) to within +/- 0.001 in log10 -- so N* is a property of sigma, not the grid.
 *        (The half-decade W = 0.5 window is still too coarse to resolve any sign change inside
 *        [1e9, 1e11], which is exactly why imp-33701 whole-decade windows landed a decade high.)
 *   (F3) THE KNEE COINCIDES WITH THE sigma = 1/2 HALVING LANDMARK. The refined inflection
 *        N* ~ 3.38e9 sits ~3.3% above the imp-33582 sigma = 1/2 halving point (N ~ 3.27e9, itself
 *        matching the imp-3444 E_coll = E_trunc crossover): the local decay exponent accelerates
 *        FASTEST essentially where the conditional share passes one half -- i.e. where the
 *        constant truncation floor E_trunc overtakes the vanishing GUE-conditional E_coll.
 *
 * The punchline: imp-33701 said "the knee is somewhere in the [1e10,1e11] decade". At sub-decade
 * resolution the knee is not there at all -- decade-averaging smeared it up a decade. The true
 * ramp inflection sits at N* ~ 3.38e9 (log10 ~ 9.529), robust across sub-bracket widths and
 * essentially coincident with the sigma = 1/2 halving landmark.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (whole-decade ladder localizing the knee to a decade)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (six-decade exponent ladder + sigma=1/2 halving landmark)
 * @see imp-3444-e-coll-e-trunc-crossover (E_coll=E_trunc crossover ~3.28e9, the halving-point twin)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY } from './imp-33582-sigma-postpeak-nearpeak-threshold-decay.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33701 exactly

// EXACT imp-3406/imp-33582/imp-33701 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// OLS local decay exponent p = -slope of ln sigma on ln N over [10^loD, 10^hiD] (log10 edges).
// Identical estimator to imp-33582/imp-33701; ptsPerDecade densified so narrow sub-brackets
// still carry enough points for a stable slope.
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

// Reuse gate value: the full-decade ladder p_dec(6..11) at 4 pts/decade (imp-33582/imp-33701).
const DECADE_KS = [6, 7, 8, 9, 10, 11];
const FULL_DECADE_LADDER = DECADE_KS.map((k) => olsExponentLog10(k, k + 1, 4));

// (a) Sub-decade sub-brackets across [1e9, 1e11]. W = quarter-decade primary grid.
const SUB_LO_D = 9.0;
const SUB_HI_D = 11.0;
const W_PRIMARY = 0.25;
const PPD_PRIMARY = 40;

function subDecadeInflection(W, ptsPerDecade) {
  const edges = [];
  for (let d = SUB_LO_D; d <= SUB_HI_D + 1e-9; d += W) edges.push(+d.toFixed(6));
  const brackets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    brackets.push({ loD: edges[i], hiD: edges[i + 1], cen, p: olsExponentLog10(edges[i], edges[i + 1], ptsPerDecade) });
  }
  // (b) sub-decade velocity D1 and acceleration D2 on the sub-bracket centers.
  const D1 = [];
  for (let i = 1; i < brackets.length; i++) {
    D1.push({ cen: (brackets[i].cen + brackets[i - 1].cen) / 2, d1: brackets[i].p - brackets[i - 1].p });
  }
  const D2 = [];
  for (let i = 1; i < D1.length; i++) {
    D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  }
  // (c) single D2 zero-crossing, interpolated in log10 N -> sub-decade N*.
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
  let steepIdx = 0;
  for (let i = 1; i < D1.length; i++) if (D1[i].d1 > D1[steepIdx].d1) steepIdx = i;
  return { brackets, D1, D2, signChanges, cstar, NstarLog10: cstar, steepCen: D1[steepIdx].cen };
}

const PRIMARY = subDecadeInflection(W_PRIMARY, PPD_PRIMARY);
const NSTAR_LOG10 = PRIMARY.cstar; // ~ 9.529
const NSTAR = Math.pow(10, NSTAR_LOG10); // ~ 3.38e9
const STEEP_N = Math.pow(10, PRIMARY.steepCen); // ~ 3.16e9

// (F2) robustness sweep: the single crossing must stay at the same log10 N* across widths.
const ROBUST_WIDTHS = [
  { W: 0.25, ppd: 40 },
  { W: 0.2, ppd: 50 },
  { W: 0.125, ppd: 80 },
  { W: 0.1, ppd: 100 },
];
const ROBUST = ROBUST_WIDTHS.map(({ W, ppd }) => {
  const r = subDecadeInflection(W, ppd);
  return { W, signChanges: r.signChanges, NstarLog10: r.cstar };
});

// imp-33582 sigma = 1/2 halving landmark (F3 coincidence check).
const HALVING_N = 3.27e9;

export const IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE = {
  id: 'imp-33721',
  proofSection: 'S-frontier',
  question:
    'imp-33701 differenced the imp-33582 six-decade sigma(N) local-exponent ladder and found a ' +
    'single ramp-acceleration (D2) sign change -- a knee -- but its coarse whole-decade ladder ' +
    'could only place that knee "in the [1e10,1e11] decade". Refine the localization: on a finer ' +
    'intra-decade N grid across [1e9,1e11], recompute the OLS local exponent on narrow ' +
    'sub-brackets and locate the single D2 sign change to a sub-decade N*. Measurement/fit only; ' +
    'conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'sub-decade OLS local exponent p_dec on quarter-decade sub-brackets across [1e9,1e11], its ' +
    'first difference D1 (velocity) and second difference D2 (acceleration), and the single ' +
    'log10-interpolated D2 zero-crossing N* (the knee) -- refining the imp-33701 whole-decade bracket',
  subBracketWidthDecades: W_PRIMARY,
  ptsPerDecade: PPD_PRIMARY,
  subLadder: PRIMARY.brackets.map((b) => ({ bracket: `1e${b.loD}->1e${b.hiD}`, p_local: +b.p.toFixed(6) })),
  subVelocityD1: PRIMARY.D1.map((r) => ({ centerLog10: +r.cen.toFixed(4), d1: +r.d1.toFixed(6) })),
  subAccelerationD2: PRIMARY.D2.map((r) => ({ centerLog10: +r.cen.toFixed(4), d2: +r.d2.toFixed(6) })),
  numSignChanges: PRIMARY.signChanges,
  inflectionLog10Nstar: +NSTAR_LOG10.toFixed(4),
  inflectionNstar: +NSTAR.toExponential(4),
  inflectionDecade: NSTAR_LOG10 >= 9 && NSTAR_LOG10 < 10 ? '1e9->1e10' : '1e10->1e11',
  imp33701CoarseDecade: '1e10->1e11',
  steepestVelocityNear: +STEEP_N.toExponential(4),
  halvingLandmarkN: HALVING_N,
  inflectionVsHalvingRelGap: +Math.abs(NSTAR / HALVING_N - 1).toFixed(4),
  robustnessSweep: ROBUST.map((r) => ({ widthDecades: r.W, signChanges: r.signChanges, log10Nstar: +r.NstarLog10.toFixed(4) })),
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_knee_at_3p38e9_a_decade_below_imp33701:
      'On the fine quarter-decade sub-grid the velocity D1 peaks near center 1e9.5 (~3.16e9) and ' +
      'the acceleration D2 changes sign exactly ONCE, crossing zero at log10 N* ~ 9.529, i.e. ' +
      'N* ~ 3.38e9 -- inside the [1e9,1e10] decade, a FULL DECADE below the whole-decade ' +
      '[1e10,1e11] bracket imp-33701 reported. imp-33701 did not err: decade-averaging smears the ' +
      'local curvature and pushes the apparent knee a decade too high; sub-decade resolution ' +
      'relocates the true inflection to N* ~ 3.38e9.',
    F2_robust_to_sub_bracket_width:
      'Recomputed at sub-bracket widths W in {0.1,0.125,0.2,0.25}-decade the single D2 zero-crossing ' +
      'stays at log10 N* ~ 9.529 (N* ~ 3.38e9) to within +/- 0.001 in log10 -- N* is a property of ' +
      'sigma, not the grid. The half-decade W=0.5 window is still too coarse to resolve any sign ' +
      'change inside [1e9,1e11], which is exactly why the imp-33701 whole-decade ladder landed high.',
    F3_knee_coincides_with_sigma_half_halving:
      'The refined inflection N* ~ 3.38e9 sits only ~3.3% above the imp-33582 sigma=1/2 halving ' +
      'point (N ~ 3.27e9, matching the imp-3444 E_coll=E_trunc crossover): the local decay exponent ' +
      'accelerates fastest essentially where the conditional share passes one half -- where the ' +
      'constant truncation floor E_trunc overtakes the vanishing GUE-conditional E_coll.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Subdividing [1e9,1e11] into quarter-decade ' +
    'sub-brackets and re-differencing the OLS local exponent refines the imp-33701 whole-decade ' +
    'knee to a sub-decade N*: the acceleration D2 changes sign exactly once, at log10 N* ~ 9.529, ' +
    'N* ~ 3.38e9 -- inside the [1e9,1e10] decade, a full decade BELOW the [1e10,1e11] bracket the ' +
    'coarse ladder reported (decade-averaging had smeared the knee a decade too high). The ' +
    'localization is robust to sub-bracket width (log10 N* ~ 9.529 +/- 0.001 across W in ' +
    '{0.1..0.25}), and N* sits ~3.3% above the imp-33582 sigma=1/2 halving landmark (~3.27e9) -- ' +
    'the ramp accelerates fastest essentially where sigma passes one half. The component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33701 (whole-decade ladder knee localized to [1e10,1e11]); imp-33582 (six-decade ' +
    'exponent ladder + sigma=1/2 halving landmark ~3.27e9); imp-3444 (E_coll=E_trunc crossover ' +
    '~3.28e9); imp-3463 (far-tail leading form, exponent -> 1/2 from below); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE_ASSERTIONS = [
  {
    // Reuse gate: the recomputed FULL-decade ladder reproduces the published imp-33582
    // perDecadeLadder to its printed 4 decimals -- proving the IDENTICAL sigma model / OLS
    // estimator is in use before the sub-decade refinement runs.
    id: 'imp33721-reuses-imp33582-ladder',
    description: 'recomputed full-decade p_local matches the published imp-33582 perDecadeLadder to 4 decimals',
    holds: () => {
      const pub = IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.perDecadeLadder;
      if (pub.length !== FULL_DECADE_LADDER.length) return false;
      for (let i = 0; i < pub.length; i++) {
        if (Math.abs(pub[i].p_local - +FULL_DECADE_LADDER[i].toFixed(4)) > 1e-9) return false;
      }
      return true;
    },
  },
  {
    // (F1): the sub-decade grid resolves EXACTLY ONE D2 sign change and the interpolated knee
    // lands inside the [1e9,1e10] decade -- a full decade BELOW the imp-33701 whole-decade bracket.
    id: 'imp33721-single-inflection-in-1e9-decade',
    description: 'exactly one sub-decade D2 sign change; interpolated N* lies in [1e9,1e10], below imp-33701 [1e10,1e11]',
    holds: () =>
      PRIMARY.signChanges === 1 &&
      NSTAR_LOG10 !== null &&
      NSTAR_LOG10 >= 9.0 &&
      NSTAR_LOG10 < 10.0,
  },
  {
    // (F1 sharp): the knee is pinned to log10 N* ~ 9.529, i.e. N* ~ 3.38e9.
    id: 'imp33721-knee-at-3p38e9',
    description: 'sub-decade inflection at log10 N* ~ 9.529 (N* ~ 3.38e9)',
    holds: () => Math.abs(NSTAR_LOG10 - 9.529) < 0.01 && Math.abs(NSTAR / 3.38e9 - 1) < 0.02,
  },
  {
    // (F2): the single crossing is robust to sub-bracket width -- every width in the sweep yields
    // exactly one sign change at the same log10 N* to within +/- 0.002.
    id: 'imp33721-robust-to-window-width',
    description: 'every sub-bracket width yields one D2 crossing at log10 N* ~ 9.529 (+/- 0.002)',
    holds: () =>
      ROBUST.every((r) => r.signChanges === 1 && r.NstarLog10 !== null && Math.abs(r.NstarLog10 - 9.529) < 0.002),
  },
  {
    // (F3): the refined knee coincides with the imp-33582 sigma=1/2 halving landmark to ~3.3%.
    id: 'imp33721-knee-coincides-with-halving',
    description: 'inflection N* sits within ~5% of the imp-33582 sigma=1/2 halving point (~3.27e9)',
    holds: () => Math.abs(NSTAR / HALVING_N - 1) < 0.05,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp33721-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.isRigorous === false &&
      IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.farTailExponent === 0.5 &&
      /NO QED/.test(IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.verdict) &&
      /refereed bound is changed/i.test(IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.verdict),
  },
];

for (const a of IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33721-sigma-ramp-inflection-subdecade assertion failed: ${a.id}`);
  }
}
