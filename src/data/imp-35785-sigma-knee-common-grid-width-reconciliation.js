/**
 * @module imp-35785-sigma-knee-common-grid-width-reconciliation
 *
 * imp-35785 (numerical, frontier-direction, MEASURE / RECONCILE ONLY): the roadmap carries TWO
 * heights for the imp-33701 sigma(N) decay-exponent sigmoid inflection knee and never reconciles
 * them on a single grid:
 *   - imp-33701 (WHOLE-DECADE ladder, k = 6..11 over [1e6,1e12]): reported the knee "in the
 *     [1e10,1e11] decade".
 *   - imp-33721 (SUB-DECADE relocation, quarter-decade windows over [1e9,1e11]): relocated it to
 *     N* ~ 3.38e9 (log10 N* ~ 9.529), a FULL DECADE below.
 * The two numbers look like a one-decade disagreement. This module recomputes the sigma(N)
 * local-exponent second difference (ramp acceleration) on ONE common bracket grid at a LADDER of
 * window widths -- from whole-decade (W = 1.0, the imp-33701 endpoint) down to sub-decade
 * (W = 0.1, the imp-33721 regime) -- with ONE common convention (each sub-bracket exponent placed
 * at its geometric-mean center; the single D2 zero-crossing INTERPOLATED in log10 N). It shows the
 * "one-decade discrepancy" is a bracket-attribution artifact, NOT a real disagreement.
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 / imp-33701 / imp-33721 -- no fresh terms)
 * ------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * The full-decade ladder p_dec(6..11) reproduces the imp-33582 published perDecadeLadder to the
 * printed 4 decimals (reuse gate below) -- the SAME sigma sub-terms and OLS estimator throughout.
 *
 * THE MEASUREMENT: knee height vs window width on the common span [1e6,1e12]
 * -------------------------------------------------------------------------
 *   For each window width W in {1.0, 0.5, 0.25, 0.2, 0.125, 0.1} decade, partition the SAME span
 *   [1e6,1e12] into W-wide sub-brackets, take the OLS local exponent of each at its geometric
 *   center, form the first (velocity) and second (acceleration D2) differences on the centers, and
 *   INTERPOLATE the single D2 zero-crossing in log10 N. Both prior results are read off this one
 *   curve: W = 1.0 is the imp-33701 whole-decade endpoint; W -> 0.1 is the imp-33721 fine regime.
 *
 * THE FINDING (measurement / reconciliation only)
 * -----------------------------------------------
 *   (F1) EVERY WIDTH -- INCLUDING WHOLE-DECADE -- LOCATES ONE KNEE AT log10 N* ~ 9.53. On the
 *        common span [1e6,1e12] the acceleration D2 changes sign exactly ONCE at every width, and
 *        the INTERPOLATED zero-crossing sits at log10 N* = 9.536 (W = 1.0, whole-decade) settling
 *        to 9.529 (W = 0.1). The whole-to-fine spread is only ~0.007 in log10 (~1.6% in N), NOT a
 *        decade -- so imp-33701 and imp-33721 agree on the knee HEIGHT once a common interpolation
 *        convention is applied on a common grid.
 *   (F2) THE ONE-DECADE GAP IS A LABELING ARTIFACT, NOT A RELOCATION. At whole-decade width the
 *        exact imp-33701 acceleration D2 = +0.0386, +0.0455, +0.0017, -0.0452 (geometric centers
 *        7.5, 8.5, 9.5, 10.5) turns negative first at center 10.5 -- the [1e10,1e11] decade
 *        imp-33701 reported. But the D2 zero-crossing INTERPOLATED between the last-positive
 *        (center 9.5) and first-negative (center 10.5) samples lands at 9.536 -- inside [1e9,1e10],
 *        exactly imp-33721. imp-33701 did not err on the knee; it attributed the knee to the DECADE
 *        INDEX of the first concave sample rather than interpolating the crossing.
 *   (F3) THE COMMON GRID IS WHY EACH PRIOR STUDY NEEDED ITS OWN SPAN. On the narrow [1e9,1e11]
 *        span imp-33721 used, whole-decade (W = 1.0) and half-decade (W = 0.5) windows give too few
 *        sub-brackets to form a D2 sign change at all (0 crossings) -- which is why imp-33701 had to
 *        use the wide [1e6,1e12] span for coarse windows and imp-33721 had to narrow the span for
 *        fine windows. The wide common span unifies both: coarse AND fine windows resolve the same
 *        single knee at log10 N* ~ 9.53.
 *
 * The punchline: there is ONE knee at log10 N* ~ 9.53 (N* ~ 3.4e9), not two a decade apart.
 * imp-33701 (whole-decade, "[1e10,1e11]") and imp-33721 (sub-decade, "N* ~ 3.38e9") are the coarse
 * and fine ends of a single bracket-resolution curve whose interpolated knee height is flat to
 * ~0.007 in log10; the apparent one-decade gap is imp-33701 naming the whole decade of the first
 * concave sample rather than interpolating the D2 crossing.
 *
 * MEASUREMENT / RECONCILIATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (whole-decade ladder, knee labeled [1e10,1e11])
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade relocation, knee at N* ~ 3.38e9)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (six-decade exponent ladder + sigma=1/2 halving landmark)
 * @see imp-3444-e-coll-e-trunc-crossover (E_coll=E_trunc crossover ~3.28e9, the halving-point twin)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY } from './imp-33582-sigma-postpeak-nearpeak-threshold-decay.js';

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

// Reuse gate value: the full-decade ladder p_dec(6..11) at 4 pts/decade (imp-33582/imp-33701).
const DECADE_KS = [6, 7, 8, 9, 10, 11];
const FULL_DECADE_LADDER = DECADE_KS.map((k) => olsExponentLog10(k, k + 1, 4));

// Common-grid analysis: span [loD,hiD], window W, exponent placed at each sub-bracket geometric
// center, single D2 zero-crossing interpolated in log10 N. Also records the first-negative-D2
// center (the imp-33701-style discrete decade label) so the labeling artifact is explicit.
const COMMON_LO_D = 6.0; // wide span [1e6,1e12] so even whole-decade windows resolve a D2 crossing
const COMMON_HI_D = 12.0;

function kneeAtWidth(loD, hiD, W, ptsPerDecade) {
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
  let firstNegCenter = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2)) {
      signChanges += 1;
      if (cstar === null) {
        const c0 = D2[i - 1].cen;
        const c1 = D2[i].cen;
        const y0 = D2[i - 1].d2;
        const y1 = D2[i].d2;
        cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
        firstNegCenter = D2[i].d2 < 0 ? D2[i].cen : D2[i - 1].cen;
      }
    }
  }
  return { numBrackets: brackets.length, signChanges, cstarLog10: cstar, firstNegCenter, D2 };
}

// (F1) common-span width ladder: whole-decade (imp-33701 end) down to sub-decade (imp-33721 end).
const WIDTH_LADDER = [
  { W: 1.0, ppd: 4 },
  { W: 0.5, ppd: 20 },
  { W: 0.25, ppd: 40 },
  { W: 0.2, ppd: 50 },
  { W: 0.125, ppd: 80 },
  { W: 0.1, ppd: 100 },
];
const COMMON_SWEEP = WIDTH_LADDER.map(({ W, ppd }) => {
  const r = kneeAtWidth(COMMON_LO_D, COMMON_HI_D, W, ppd);
  return { widthDecades: W, numBrackets: r.numBrackets, signChanges: r.signChanges, cstarLog10: r.cstarLog10, firstNegCenter: r.firstNegCenter };
});

const WHOLE_DECADE = COMMON_SWEEP[0]; // W = 1.0 endpoint (imp-33701)
const FINE = COMMON_SWEEP[COMMON_SWEEP.length - 1]; // W = 0.1 endpoint (imp-33721 regime)
const WHOLE_LOG10 = WHOLE_DECADE.cstarLog10; // ~ 9.536
const FINE_LOG10 = FINE.cstarLog10; // ~ 9.529
const WHOLE_TO_FINE_LOG10_SPREAD = Math.abs(WHOLE_LOG10 - FINE_LOG10); // ~ 0.007, NOT a decade
const N_STAR_WHOLE = Math.pow(10, WHOLE_LOG10);
const N_STAR_FINE = Math.pow(10, FINE_LOG10);

// (F3) narrow-span control: on imp-33721 own [1e9,1e11] span, coarse windows cannot resolve a knee.
const NARROW_SWEEP = WIDTH_LADDER.map(({ W, ppd }) => {
  const r = kneeAtWidth(9.0, 11.0, W, ppd);
  return { widthDecades: W, numBrackets: r.numBrackets, signChanges: r.signChanges, cstarLog10: r.cstarLog10 };
});

// Reference landmarks for the reconciliation table.
const IMP33701_LABELED_DECADE = '1e10->1e11';
const IMP33721_NSTAR = 3.38e9;
const IMP33721_LOG10 = 9.529;

export const IMP35785_SIGMA_KNEE_COMMON_GRID_WIDTH_RECONCILIATION = {
  id: 'imp-35785',
  proofSection: 'S-frontier',
  question:
    'The roadmap records two heights for the imp-33701 sigma(N) decay-exponent sigmoid inflection ' +
    'knee -- the imp-33701 whole-decade bracket [1e10,1e11] and the imp-33721 sub-decade relocation ' +
    'N* ~ 3.38e9 -- a one-decade apparent discrepancy never reconciled on one grid. Recompute the ' +
    'sigma(N) local-exponent second difference (ramp acceleration) on a single common span ' +
    '[1e6,1e12] at a ladder of window widths from whole-decade (W=1.0) to sub-decade (W=0.1), with ' +
    'one common convention (exponent at geometric center, D2 zero-crossing interpolated in log10 N), ' +
    'and locate the unique convex-to-concave sign change at each width. Measurement/reconciliation ' +
    'only; conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the interpolated log10 N* of the single D2 (ramp-acceleration) zero-crossing on the common span ' +
    '[1e6,1e12] as a function of sub-bracket width W, plus the whole-decade first-negative-D2 center ' +
    '(the imp-33701 discrete decade label) versus the interpolated crossing (the imp-33721 height)',
  commonSpan: '1e6->1e12',
  widthLadder: WIDTH_LADDER.map((w) => w.W),
  commonSpanSweep: COMMON_SWEEP.map((r) => ({
    widthDecades: r.widthDecades,
    numBrackets: r.numBrackets,
    signChanges: r.signChanges,
    log10Nstar: r.cstarLog10 === null ? null : +r.cstarLog10.toFixed(4),
    firstNegDecadeCenter: r.firstNegCenter === null ? null : +r.firstNegCenter.toFixed(2),
  })),
  narrowSpanControlSweep: NARROW_SWEEP.map((r) => ({
    widthDecades: r.widthDecades,
    numBrackets: r.numBrackets,
    signChanges: r.signChanges,
    log10Nstar: r.cstarLog10 === null ? null : +r.cstarLog10.toFixed(4),
  })),
  wholeDecadeLog10Nstar: +WHOLE_LOG10.toFixed(4),
  wholeDecadeNstar: +N_STAR_WHOLE.toExponential(4),
  fineGridLog10Nstar: +FINE_LOG10.toFixed(4),
  fineGridNstar: +N_STAR_FINE.toExponential(4),
  wholeToFineLog10Spread: +WHOLE_TO_FINE_LOG10_SPREAD.toFixed(4),
  wholeToFineNRatio: +(N_STAR_WHOLE / N_STAR_FINE).toFixed(4),
  imp33701LabeledDecade: IMP33701_LABELED_DECADE,
  wholeDecadeFirstNegDecadeCenter: +WHOLE_DECADE.firstNegCenter.toFixed(2),
  imp33721ReportedLog10Nstar: IMP33721_LOG10,
  imp33721ReportedNstar: IMP33721_NSTAR,
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_every_width_locates_one_knee_at_9p53:
      'On the common span [1e6,1e12] the acceleration D2 changes sign exactly ONCE at every window ' +
      'width, and the INTERPOLATED zero-crossing sits at log10 N* = 9.536 (W=1.0, whole-decade) ' +
      'settling to 9.529 (W=0.1, sub-decade). The whole-to-fine spread is only ~0.007 in log10 ' +
      '(~1.6% in N, ratio ~1.016), NOT a decade -- imp-33701 and imp-33721 AGREE on the knee height ' +
      'once a common interpolation convention is applied on a common grid.',
    F2_one_decade_gap_is_a_labeling_artifact:
      'At whole-decade width the exact imp-33701 acceleration D2 = +0.0386, +0.0455, +0.0017, ' +
      '-0.0452 (geometric centers 7.5, 8.5, 9.5, 10.5) turns negative first at center 10.5 -- the ' +
      '[1e10,1e11] decade imp-33701 reported. But the D2 zero-crossing INTERPOLATED between the ' +
      'last-positive (center 9.5) and first-negative (center 10.5) samples lands at 9.536, inside ' +
      '[1e9,1e10], exactly the imp-33721 height. imp-33701 did not err on the knee; it attributed ' +
      'the knee to the decade INDEX of the first concave sample rather than interpolating the crossing.',
    F3_common_span_is_why_each_study_needed_its_own_span:
      'On the narrow [1e9,1e11] span imp-33721 used, whole-decade (W=1.0) and half-decade (W=0.5) ' +
      'windows give too few sub-brackets to form a D2 sign change at all (0 crossings) -- which is ' +
      'why imp-33701 needed the wide [1e6,1e12] span for coarse windows and imp-33721 narrowed the ' +
      'span for fine windows. The wide common span unifies both: coarse AND fine windows resolve the ' +
      'same single knee at log10 N* ~ 9.53.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / RECONCILIATION (frontier-direction, NOT rigorous). Recomputing the sigma(N) ' +
    'local-exponent second difference on ONE common span [1e6,1e12] at window widths from ' +
    'whole-decade (W=1.0) to sub-decade (W=0.1), with a common convention (exponent at geometric ' +
    'center, D2 zero-crossing interpolated in log10 N), resolves the apparent one-decade discrepancy ' +
    'between imp-33701 ([1e10,1e11]) and imp-33721 (N* ~ 3.38e9). Every width yields exactly ONE D2 ' +
    'sign change, and the interpolated knee sits at log10 N* = 9.536 (whole-decade) settling to ' +
    '9.529 (sub-decade) -- a whole-to-fine spread of ~0.007 in log10 (~1.6% in N), NOT a decade. The ' +
    'one-decade gap is a LABELING artifact: imp-33701 named the [1e10,1e11] decade of the first ' +
    'concave (negative-D2) sample rather than interpolating the crossing, which already lands in ' +
    '[1e9,1e10] at ~9.536. On imp-33721 narrow [1e9,1e11] span coarse windows cannot resolve a ' +
    'crossing at all, which is why each prior study needed its own span; the wide common span ' +
    'unifies them at ONE knee, log10 N* ~ 9.53 (N* ~ 3.4e9). The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33701 (whole-decade ladder, knee labeled [1e10,1e11]); imp-33721 (sub-decade relocation, ' +
    'N* ~ 3.38e9, log10 ~ 9.529); imp-33582 (six-decade exponent ladder + sigma=1/2 halving ' +
    'landmark ~3.27e9); imp-3444 (E_coll=E_trunc crossover ~3.28e9); imp-3463 (far-tail leading ' +
    'form, exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35785_SIGMA_KNEE_COMMON_GRID_WIDTH_RECONCILIATION_ASSERTIONS = [
  {
    // Reuse gate: the recomputed FULL-decade ladder reproduces the published imp-33582
    // perDecadeLadder to its printed 4 decimals -- proving the IDENTICAL sigma model / OLS
    // estimator is in use before the reconciliation sweep runs.
    id: 'imp35785-reuses-imp33582-ladder',
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
    // (F1): on the common span EVERY width -- including whole-decade -- yields exactly one D2 sign
    // change; there is a single knee at every resolution, not two.
    id: 'imp35785-one-crossing-at-every-width',
    description: 'common span [1e6,1e12] gives exactly one D2 sign change at all widths incl. whole-decade',
    holds: () => COMMON_SWEEP.every((r) => r.signChanges === 1 && r.cstarLog10 !== null),
  },
  {
    // (F1 sharp): the interpolated knee height is flat across widths -- whole-decade and fine grid
    // agree to well under 0.01 in log10, so the "one-decade discrepancy" is not a real relocation.
    id: 'imp35785-knee-height-flat-across-widths',
    description: 'whole-decade (9.536) and fine (9.529) knee heights agree to < 0.01 in log10 (spread ~0.007, NOT a decade)',
    holds: () =>
      Math.abs(WHOLE_LOG10 - 9.536) < 0.01 &&
      Math.abs(FINE_LOG10 - 9.529) < 0.01 &&
      WHOLE_TO_FINE_LOG10_SPREAD < 0.02 &&
      COMMON_SWEEP.every((r) => Math.abs(r.cstarLog10 - IMP33721_LOG10) < 0.02),
  },
  {
    // (F2): the labeling artifact is explicit -- at whole-decade width the first-negative-D2 sample
    // sits in the [1e10,1e11] decade (center 10.5, imp-33701 label) while the interpolated crossing
    // lands in the [1e9,1e10] decade (imp-33721 height).
    id: 'imp35785-labeling-artifact-explicit',
    description: 'whole-decade first-negative-D2 center is 10.5 ([1e10,1e11]) but the interpolated crossing is in [1e9,1e10]',
    holds: () =>
      Math.abs(WHOLE_DECADE.firstNegCenter - 10.5) < 1e-6 &&
      WHOLE_LOG10 >= 9.0 &&
      WHOLE_LOG10 < 10.0,
  },
  {
    // (F3): on the narrow [1e9,1e11] span coarse windows (W >= 0.5) cannot resolve a D2 sign change
    // -- the wide common span is what unifies coarse and fine resolution.
    id: 'imp35785-narrow-span-coarse-windows-cannot-resolve',
    description: 'on [1e9,1e11] the W=1.0 and W=0.5 windows give 0 D2 sign changes; fine windows recover ~9.529',
    holds: () => {
      const w1 = NARROW_SWEEP.find((r) => r.widthDecades === 1.0);
      const w05 = NARROW_SWEEP.find((r) => r.widthDecades === 0.5);
      const w025 = NARROW_SWEEP.find((r) => r.widthDecades === 0.25);
      return (
        w1.signChanges === 0 &&
        w05.signChanges === 0 &&
        w025.signChanges === 1 &&
        Math.abs(w025.cstarLog10 - IMP33721_LOG10) < 0.02
      );
    },
  },
  {
    // Honesty gate: measurement/reconciliation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35785-honesty-gate-no-qed',
    description: 'Measurement/reconciliation only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP35785_SIGMA_KNEE_COMMON_GRID_WIDTH_RECONCILIATION.isRigorous === false &&
      IMP35785_SIGMA_KNEE_COMMON_GRID_WIDTH_RECONCILIATION.farTailExponent === 0.5 &&
      /NO QED/.test(IMP35785_SIGMA_KNEE_COMMON_GRID_WIDTH_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP35785_SIGMA_KNEE_COMMON_GRID_WIDTH_RECONCILIATION.verdict),
  },
];

for (const a of IMP35785_SIGMA_KNEE_COMMON_GRID_WIDTH_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35785-sigma-knee-common-grid-width-reconciliation assertion failed: ${a.id}`);
  }
}
