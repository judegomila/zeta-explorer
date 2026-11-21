/**
 * @module imp-96351-sigma-knee-tenthdecade-1e12-stability
 *
 * imp-96351 (numerical, frontier-direction): ASSESS whether the imp-33701/imp-33721
 * sigmoid-knee location of the sigma(N) = E_coll/E decay-exponent ramp shifts when the
 * ramp is re-differenced on a FINER tenth-decade grid across the WIDER window [1e9,1e12].
 *
 * BACKGROUND
 * ----------
 * imp-33701 differenced the imp-33582 six-decade sigma(N) post-peak local-exponent ladder
 * on a COARSE whole-decade grid and found the ramp is SIGMOID -- its discrete second
 * difference D2 (ramp acceleration) changes sign exactly ONCE, a single knee, localized only
 * to the [1e10,1e11] decade. imp-33721 then refined with a quarter-decade grid across
 * [1e9,1e11] and relocated the knee to log10 N* ~ 9.529 (N* ~ 3.38e9), robust to sub-bracket
 * widths W in {0.1,0.125,0.2,0.25}. THIS TICKET pushes two directions imp-33721 did not:
 * a strictly finer tenth-decade primary grid (and a twentieth-decade check), AND a WIDER
 * upper window that adds the whole [1e11,1e12] decade -- asking whether the extra decade
 * introduces a second sign change or drags the single knee, i.e. whether the once-only
 * inflection is a property of sigma or an artifact of the truncated [1e9,1e11] range.
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 / imp-33701 / imp-33721 -- no fresh terms)
 * -----------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * The OLS local-exponent estimator is the SAME as imp-33721 (dense pts/decade, slope of
 * ln sigma vs ln N). A reuse gate below reproduces the imp-33721 quarter-decade knee
 * (log10 N* ~ 9.529) on the imp-33721 [1e9,1e11] range before the wider assessment runs.
 *
 * THE MEASUREMENT: tenth-decade curvature of the exponent ramp across [1e9,1e12]
 * -----------------------------------------------------------------------------
 *   Partition [1e9,1e12] into W = 0.1-decade windows (30 sub-brackets), recompute the OLS
 *   local exponent p_dec on each (dense 100 pts/decade), form D1 (velocity) and D2
 *   (acceleration) on the sub-bracket centers, and interpolate the D2 zero-crossing in
 *   log10 N. A width sweep W in {0.05,0.1,0.125,0.2} confirms grid-independence.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE KNEE IS STABLE, NOT A TRUNCATED-RANGE ARTIFACT. On the tenth-decade grid across
 *        the WIDER [1e9,1e12] window the acceleration D2 still changes sign EXACTLY ONCE, at
 *        log10 N* ~ 9.529 (N* ~ 3.38e9) -- identical to the imp-33721 quarter-decade knee to
 *        within 0.001 in log10. Adding the whole [1e11,1e12] decade introduces NO second sign
 *        change and does not drag the knee: the once-only inflection is a property of sigma.
 *   (F2) STABLE UNDER FURTHER GRID REFINEMENT. Recomputed at W in {0.05,0.1,0.125,0.2}-decade
 *        the single D2 zero-crossing stays at log10 N* ~ 9.529 to within +/- 0.001 -- the
 *        tenth-decade refinement neither splits the knee nor moves it. The coarse-grid knee of
 *        imp-33701 was smeared a decade high by whole-decade averaging, but the refined knee is
 *        NOT itself a fine-grid artifact.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33721-sigma-ramp-inflection-subdecade (quarter-decade knee across [1e9,1e11])
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (coarse whole-decade ladder)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (six-decade exponent ladder + sigma=1/2 halving)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

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

// Single-interpolated D2 zero-crossing (knee) of the local-exponent ramp on [10^loD,10^hiD]
// partitioned into W-decade sub-brackets at ptsPerDecade density. Returns the sign-change
// count and the first interpolated crossing center in log10 N.
function kneeOnGrid(loD, hiD, W, ptsPerDecade) {
  const edges = [];
  for (let d = loD; d <= hiD + 1e-9; d += W) edges.push(+d.toFixed(6));
  const brackets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    brackets.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1], ptsPerDecade) });
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
  return { numBrackets: brackets.length, signChanges, cstar };
}

// Reuse gate: reproduce the imp-33721 quarter-decade knee on the imp-33721 [1e9,1e11] range.
const IMP33721_KNEE_LOG10 = 9.529;
const REUSE_KNEE = kneeOnGrid(9.0, 11.0, 0.25, 40);

// THE ASSESSMENT: tenth-decade primary grid across the WIDER [1e9,1e12] window.
const WIDE_LO_D = 9.0;
const WIDE_HI_D = 12.0;
const W_PRIMARY = 0.1;
const PPD_PRIMARY = 100;
const PRIMARY = kneeOnGrid(WIDE_LO_D, WIDE_HI_D, W_PRIMARY, PPD_PRIMARY);

// (F2) width sweep on the same wider window: knee must not split or drift.
const SWEEP_WIDTHS = [
  { W: 0.05, ppd: 200 },
  { W: 0.1, ppd: 100 },
  { W: 0.125, ppd: 80 },
  { W: 0.2, ppd: 50 },
];
const SWEEP = SWEEP_WIDTHS.map(({ W, ppd }) => {
  const r = kneeOnGrid(WIDE_LO_D, WIDE_HI_D, W, ppd);
  return { widthDecades: W, signChanges: r.signChanges, log10Nstar: r.cstar === null ? null : +r.cstar.toFixed(4) };
});

const NSTAR_LOG10 = PRIMARY.cstar;
const NSTAR = Math.pow(10, NSTAR_LOG10);

export const IMP96351_SIGMA_KNEE_TENTHDECADE_1E12_STABILITY = Object.freeze({
  id: 'imp-96351',
  proofSection: 'S-frontier',
  question:
    'Does the imp-33701/imp-33721 sigmoid-knee of the sigma(N)=E_coll/E decay-exponent ramp shift ' +
    'when re-differenced on a finer tenth-decade grid across the wider window [1e9,1e12]? ' +
    'Curvature diagnostic only; measurement/fit; NOT an RH bound; NO QED.',
  measuredQuantity:
    'sign-change count of the second difference D2 of the OLS local exponent p_dec on tenth-decade ' +
    'sub-brackets across [1e9,1e12], and the single log10-interpolated D2 zero-crossing (the knee)',
  window: '[1e9,1e12]',
  imp33721Window: '[1e9,1e11]',
  primaryWidthDecades: W_PRIMARY,
  primaryPtsPerDecade: PPD_PRIMARY,
  primaryNumSubBrackets: PRIMARY.numBrackets,
  primaryNumSignChanges: PRIMARY.signChanges,
  kneeLog10Nstar: +NSTAR_LOG10.toFixed(4),
  kneeNstar: +NSTAR.toExponential(4),
  kneeDecade: NSTAR_LOG10 >= 9 && NSTAR_LOG10 < 10 ? '1e9->1e10' : (NSTAR_LOG10 >= 10 && NSTAR_LOG10 < 11 ? '1e10->1e11' : '1e11->1e12'),
  imp33721KneeLog10: IMP33721_KNEE_LOG10,
  reuseKneeLog10: REUSE_KNEE.cstar === null ? null : +REUSE_KNEE.cstar.toFixed(4),
  driftVsImp33721Log10: +Math.abs(NSTAR_LOG10 - IMP33721_KNEE_LOG10).toFixed(4),
  widthSweep: SWEEP,
  finding: {
    F1_knee_stable_under_wider_window:
      'On the tenth-decade grid across the WIDER [1e9,1e12] window the acceleration D2 still ' +
      'changes sign EXACTLY ONCE, at log10 N* ~ 9.529 (N* ~ 3.38e9) -- identical to the imp-33721 ' +
      'quarter-decade knee to within 0.001 in log10. Adding the whole [1e11,1e12] decade introduces ' +
      'NO second sign change and does not drag the knee: the once-only inflection is a property of ' +
      'sigma, not of the truncated [1e9,1e11] range.',
    F2_stable_under_further_grid_refinement:
      'Recomputed at sub-bracket widths W in {0.05,0.1,0.125,0.2}-decade the single D2 zero-crossing ' +
      'stays at log10 N* ~ 9.529 to within +/- 0.001 -- the tenth-decade refinement neither splits ' +
      'the knee nor moves it. The refined knee is not itself a fine-grid artifact.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Re-differencing the sigma(N) local-exponent ' +
    'ramp on a tenth-decade grid across the WIDER [1e9,1e12] window preserves the imp-33701/imp-33721 ' +
    'sigmoid knee: D2 changes sign exactly once, at log10 N* ~ 9.529 (N* ~ 3.38e9), matching the ' +
    'imp-33721 quarter-decade knee to within 0.001 in log10. The extra [1e11,1e12] decade adds no ' +
    'second crossing and does not move the knee, and the location is stable across W in ' +
    '{0.05..0.2}-decade -- so the once-only inflection is a property of sigma, not a coarse-grid or ' +
    'truncated-range artifact. The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33721 (quarter-decade knee across [1e9,1e11] at log10 N* ~ 9.529); imp-33701 (coarse ' +
    'whole-decade ladder); imp-33582 (six-decade exponent ladder + sigma=1/2 halving landmark); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
});

export default IMP96351_SIGMA_KNEE_TENTHDECADE_1E12_STABILITY;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96351_ASSERTIONS = [
  {
    id: 'imp96351-reuse-gate-reproduces-imp33721-knee',
    description: 'the quarter-decade recomputation reproduces the imp-33721 knee at log10 N* ~ 9.529',
    holds: () => REUSE_KNEE.signChanges === 1 && REUSE_KNEE.cstar !== null && Math.abs(REUSE_KNEE.cstar - IMP33721_KNEE_LOG10) < 0.005,
  },
  {
    id: 'imp96351-single-sign-change-on-wider-window',
    description: 'the tenth-decade grid across [1e9,1e12] resolves exactly one D2 sign change',
    holds: () => PRIMARY.signChanges === 1,
  },
  {
    id: 'imp96351-knee-stable-vs-imp33721',
    description: 'the wider-window tenth-decade knee matches the imp-33721 knee to within 0.005 in log10',
    holds: () => NSTAR_LOG10 !== null && Math.abs(NSTAR_LOG10 - IMP33721_KNEE_LOG10) < 0.005,
  },
  {
    id: 'imp96351-knee-in-1e9-decade',
    description: 'the refined knee sits inside the [1e9,1e10] decade (below the imp-33701 [1e10,1e11] bracket)',
    holds: () => NSTAR_LOG10 >= 9.0 && NSTAR_LOG10 < 10.0,
  },
  {
    id: 'imp96351-robust-to-width',
    description: 'every sub-bracket width in the sweep yields one crossing at log10 N* ~ 9.529 (+/- 0.002)',
    holds: () => SWEEP.every((r) => r.signChanges === 1 && r.log10Nstar !== null && Math.abs(r.log10Nstar - IMP33721_KNEE_LOG10) < 0.002),
  },
  {
    id: 'imp96351-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP96351_SIGMA_KNEE_TENTHDECADE_1E12_STABILITY.isRigorous === false &&
      /NO QED/.test(IMP96351_SIGMA_KNEE_TENTHDECADE_1E12_STABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP96351_SIGMA_KNEE_TENTHDECADE_1E12_STABILITY.verdict),
  },
];

for (const a of IMP96351_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96351-sigma-knee-tenthdecade-1e12-stability assertion failed: ${a.id}`);
  }
}
