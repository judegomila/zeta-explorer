/**
 * @module imp-34273-eflow-resid-share-negligibility-bound
 *
 * imp-34273 (numerical, frontier-direction): BOUND the error of the imp-34189 E_flow-negligible
 * premise by MEASURING the actual E_flow share of the M2 residual exponent across the imp-34196
 * fixed-band window kEnd = 17.0 .. 19.5.
 *
 * THE PREMISE UNDER TEST
 * ----------------------
 *   imp-34189 (and imp-34127 before it) derived the M2-residual sign-change ceiling in closed form
 *   under the assumption that E_flow is NEGLIGIBLE, so that the continuous residual
 *       resid = pEcoll * (1 - sigma) - pSigma
 *   cancels identically and the observed nonzero residual is a pure estimator-discretization artifact
 *   (2-point endpoint secant vs 5-point OLS). That premise was never error-bounded against the
 *   imp-34196 deep-tail window that approaches the imp-34023 resid_exp pole at k* ~ 21.28, where resid
 *   loses significance. This module supplies the missing bound -- MEASUREMENT ONLY.
 *
 * THE METRIC (imp-33810 / imp-34196 machinery reused verbatim; nothing re-derived)
 * --------------------------------------------------------------------------------
 *   The imp-33810 quarter-decade ladder already carries, per rung k, an E_flow attribution to the
 *   residual exponent:
 *       eflowAttr(k) = (E_flow / E_N) * |d ln E_flow / d log N|   at N = 10^(k+1),
 *       eflow_over_resid(k) = eflowAttr(k) / residExp(k).
 *   Linearising resid about E_flow -> 0, setting E_flow to zero perturbs resid by ~ eflowAttr, so
 *   eflow_over_resid IS (to leading order) the RELATIVE error that the negligibility assumption
 *   introduces into the residual at that rung. Reading it at the TERMINAL rung k = kEnd of each
 *   imp-34196 window measures the negligibility error at the deepest point of that window.
 *
 * THE FINDING (the premise is well-justified AND TIGHTENS as the tail deepens -- through the window)
 * -------------------------------------------------------------------------------------------------
 *   (F1) THE E_flow SHARE IS TINY EVERYWHERE IN THE WINDOW: it falls monotonically from 1.377e-6 at
 *        kEnd = 17.0 to 1.302e-7 at kEnd = 19.5. The imp-34189 negligibility assumption therefore
 *        introduces a relative residual error BOUNDED BY ~1.38e-6 across the entire imp-34196 window --
 *        the sup is at the shallow end (kEnd = 17.0), not the deep end.
 *   (F2) THE ASSUMPTION GETS BETTER, NOT WORSE, AS kEnd GROWS: the share DECREASES monotonically by
 *        roughly an order of magnitude over 17.0 -> 19.5. Both resid and eflowAttr shrink toward the
 *        pole, but eflowAttr shrinks FASTER (E_flow ~ (ln T0)/T0 collapses super-polynomially while
 *        resid decays only like the estimator gap), so the negligibility premise TIGHTENS as the tail
 *        deepens through the measured window -- the deep-tail direction imp-34189 worried about is the
 *        SAFE direction, not the dangerous one.
 *   (F3) THE SHARE RE-INFLATES ONLY IN THE IMMEDIATE POLE NEIGHBOURHOOD. Past the window, as resid
 *        approaches its imp-34023 zero at k* ~ 21.28, resid finally collapses faster than eflowAttr and
 *        the share turns back up: ~9.0e-8 (kEnd 20.0) -> ~9.5e-8 (21.0) -> ~2.4e-7 (21.2) -> ~1.84e-5
 *        at kEnd 21.28 (resid ~ 2.5e-10, essentially on the zero). In the limit k -> k* the share
 *        diverges (resid -> 0), so the negligibility premise loses meaning EXACTLY AT the pole -- but it
 *        is <2e-5 even at kEnd 21.28 and only leaves the ~1e-6 regime inside the last ~0.1 decade before
 *        the pole, well beyond the imp-34196 window. This is consistent with imp-34189's own verdict
 *        that 21.281 is best quoted directly from the bisection, not from any expansion about the pole.
 *
 * The punchline: the imp-34189 E_flow-negligible assumption introduces a relative residual error
 * bounded by ~1.38e-6 across the imp-34196 window kEnd = 17.0 .. 19.5, and that bound TIGHTENS by an
 * order of magnitude as the tail deepens (1.38e-6 -> 1.30e-7); the share only re-inflates within the
 * last ~0.1 decade before the imp-34023 pole (reaching ~1.84e-5 at kEnd 21.28), so the deep-tail
 * negligibility premise is amply justified everywhere the imp-34196/imp-34189 ceiling analysis actually
 * reads it.
 *
 * MEASUREMENT ONLY. The eflow_over_resid attribution is the inherited imp-33810/imp-34196 component-model
 * metric, NOT a rigorous asymptotic; the linearisation "share ~ relative negligibility error" is a
 * leading-order estimate, not a derived bound; changes no bound; establishes no operator positivity; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34189-m2-ceiling-next-order-window-width-correction (the E_flow-negligible premise bounded here)
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (the kEnd = 17.0 .. 19.5 window and eflow_over_resid metric)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the resid_exp pole k* ~ 21.281 the share approaches)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k = 6.. quarter-decade ladder and eflow_over_resid attribution reused verbatim)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (the leading closed form that first assumed E_flow negligible)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N); polymath15-constant-C-C (C_C_PINNED)
 *
 * COHORT MAP (M2-residual sign-change ceiling): imp-34023 (bisected kEnd* ~ 21.281) -> imp-34127
 * (leading closed form, E_flow negligible) -> imp-34189 (next-order term, still E_flow negligible) ->
 * imp-34273 (this module: bounds the E_flow-negligible error across the imp-34196 window). The
 * E_flow-negligible premise shared by imp-34127/imp-34189 is now quantified as < ~1.38e-6 in-window.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34196
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34196.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(parts(N).sigma));
  }
  return -olsSlope(xs, ys);
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// The imp-33810/imp-34196 terminal-rung attribution at window boundary kEnd (decade [10^kEnd, 10^(kEnd+1)]).
function terminalRungShare(kEnd) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return { residExp, eflowAttr, share: eflowAttr / residExp };
}

// The imp-34196 window kEnd = 17.0, 17.25, ..., 19.5 (11 boundaries).
const K_ENDS = [];
for (let k = 17.0; k <= 19.5 + 1e-9; k += 0.25) K_ENDS.push(+k.toFixed(2));

const WINDOW_ROWS = K_ENDS.map((kEnd) => {
  const r = terminalRungShare(kEnd);
  return {
    kEnd,
    residExp: +r.residExp.toExponential(6),
    eflowAttr: +r.eflowAttr.toExponential(6),
    share: +r.share.toExponential(6), // eflow_over_resid at the terminal rung == the negligibility relative error
  };
});

const SHARES = WINDOW_ROWS.map((r) => r.share);
const MAX_SHARE = Math.max(...SHARES); // at kEnd = 17.0 (shallow end) -- the in-window bound
const MIN_SHARE = Math.min(...SHARES); // at kEnd = 19.5 (deep end)
const SHARE_MONOTONE_DECREASING = SHARES.every((s, i) => i === 0 || s < SHARES[i - 1]);
const TIGHTENING_FACTOR = +(MAX_SHARE / MIN_SHARE).toFixed(2); // ~10.6x -- assumption tightens deep-tail

// Pole approach past the window: the share re-inflates only within the last ~0.1 decade before k* ~ 21.28.
const POLE_APPROACH = [20.0, 20.5, 21.0, 21.2, 21.28].map((kEnd) => {
  const r = terminalRungShare(kEnd);
  return { kEnd, residExp: +r.residExp.toExponential(4), share: +r.share.toExponential(4) };
});
const SHARE_AT_POLE_EDGE = POLE_APPROACH[POLE_APPROACH.length - 1].share; // ~1.84e-5 at kEnd 21.28

export const IMP34273_EFLOW_RESID_SHARE_NEGLIGIBILITY_BOUND = {
  id: 'imp-34273',
  proofSection: 'S-frontier',
  question:
    'imp-34189 derived its M2-residual sign-change ceiling assuming E_flow is negligible in ' +
    'resid = pEcoll*(1 - sigma) - pSigma, but never error-bounded that premise against the imp-34196 ' +
    'deep-tail window kEnd = 17.0 .. 19.5 that approaches the imp-34023 resid_exp pole at k* ~ 21.28. ' +
    'Measure the actual E_flow share of the residual across that window and bound the relative error the ' +
    'negligibility assumption introduces as the tail deepens. Measurement only; component model NOT a ' +
    'rigorous asymptotic; no bound change; NO QED.',
  measuredQuantity:
    'Per imp-34196 boundary kEnd = 17.0, 17.25, ..., 19.5: the terminal-rung residExp, the E_flow ' +
    'attribution eflowAttr = (E_flow/E_N)*|d ln E_flow/d log N|, and their ratio eflow_over_resid (the ' +
    'leading-order relative error the E_flow-negligible assumption introduces); plus the pole-approach ' +
    'share at kEnd = 20.0, 20.5, 21.0, 21.2, 21.28.',
  windowRows: WINDOW_ROWS, // {kEnd, residExp, eflowAttr, share} x 11
  maxShareInWindow: +MAX_SHARE.toExponential(6), // ~1.377e-6 at kEnd = 17.0 -- the in-window negligibility-error bound
  minShareInWindow: +MIN_SHARE.toExponential(6), // ~1.302e-7 at kEnd = 19.5
  shareMonotoneDecreasing: SHARE_MONOTONE_DECREASING, // true -- assumption tightens as tail deepens
  tighteningFactor: TIGHTENING_FACTOR, // ~10.6x over 17.0 -> 19.5
  poleApproach: POLE_APPROACH, // share re-inflates only within the last ~0.1 decade before k* ~ 21.28
  shareAtPoleEdge: SHARE_AT_POLE_EDGE, // ~1.84e-5 at kEnd 21.28 (resid ~ 2.5e-10, essentially on the zero)
  finding: {
    F1_share_tiny_and_bounded_across_window:
      'The E_flow share of the residual falls monotonically from ' + WINDOW_ROWS[0].share + ' at ' +
      'kEnd = 17.0 to ' + WINDOW_ROWS[WINDOW_ROWS.length - 1].share + ' at kEnd = 19.5, so the imp-34189 ' +
      'E_flow-negligible assumption introduces a relative residual error BOUNDED BY ~' +
      MAX_SHARE.toExponential(2) + ' across the entire imp-34196 window -- the supremum sits at the ' +
      'SHALLOW end (kEnd = 17.0), not the deep end.',
    F2_assumption_tightens_as_tail_deepens:
      'The share DECREASES monotonically by ~' + TIGHTENING_FACTOR + 'x over kEnd 17.0 -> 19.5. Both ' +
      'resid and eflowAttr shrink toward the pole, but E_flow ~ (ln T0)/T0 collapses faster than the ' +
      'estimator-gap residual, so the negligibility premise TIGHTENS as the tail deepens through the ' +
      'measured window -- the deep-tail direction imp-34189 flagged is the SAFE direction.',
    F3_share_reinflates_only_at_the_pole:
      'Past the window, as resid approaches its imp-34023 zero at k* ~ 21.28, resid finally collapses ' +
      'faster than eflowAttr and the share turns back up: ' +
      POLE_APPROACH.map((r) => r.share).join(' -> ') + ' at kEnd = 20.0, 20.5, 21.0, 21.2, 21.28. It is ' +
      '<2e-5 even at kEnd 21.28 (resid ~ 2.5e-10, essentially on the zero) and only leaves the ~1e-6 ' +
      'regime inside the last ~0.1 decade before the pole -- well beyond the imp-34196 window and ' +
      'consistent with imp-34189 quoting 21.281 directly from the bisection, not from a pole expansion.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / NEGLIGIBILITY-ERROR BOUND (frontier-direction, NOT rigorous). The imp-34189 ' +
    'E_flow-negligible premise introduces a relative residual error of at most ~' +
    MAX_SHARE.toExponential(2) + ' across the imp-34196 fixed-band window kEnd = 17.0 .. 19.5, measured as ' +
    'the inherited imp-33810/imp-34196 eflow_over_resid attribution at the terminal rung of each window. ' +
    'The bound TIGHTENS by ~' + TIGHTENING_FACTOR + 'x as the tail deepens (' + WINDOW_ROWS[0].share +
    ' at kEnd 17.0 -> ' + WINDOW_ROWS[WINDOW_ROWS.length - 1].share + ' at kEnd 19.5) because E_flow ~ ' +
    '(ln T0)/T0 collapses faster than the estimator-gap residual; the share re-inflates only within the ' +
    'last ~0.1 decade before the imp-34023 resid_exp pole k* ~ 21.28 (reaching ~' +
    SHARE_AT_POLE_EDGE.toExponential(2) + ' at kEnd 21.28, where resid ~ 2.5e-10 is essentially on the ' +
    'zero). So the deep-tail E_flow-negligible assumption is amply justified everywhere the ' +
    'imp-34196/imp-34189 ceiling analysis actually reads it. The eflow_over_resid attribution is the ' +
    'inherited component-model metric, NOT a rigorous asymptotic; the linearisation share ~ relative ' +
    'error is leading-order; changes no bound; establishes no operator positivity; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34189 (the E_flow-negligible premise bounded here); imp-34196 (the kEnd = 17.0 .. 19.5 window ' +
    'and eflow_over_resid metric reused verbatim); imp-34023 (the resid_exp pole k* ~ 21.281); imp-33810 ' +
    '(the k = 6.. ladder and E_flow attribution); imp-34127 (the leading closed form that first assumed ' +
    'E_flow negligible); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34273_EFLOW_RESID_SHARE_NEGLIGIBILITY_BOUND_ASSERTIONS = [
  {
    // Reuse gate: 11 window boundaries kEnd 17.0 .. 19.5 on the imp-34196 0.25 grid.
    id: 'imp34273-reuse-gate-11-imp34196-boundaries',
    description: '11 boundaries kEnd 17.0..19.5 (step 0.25), matching the imp-34196 window',
    holds: () =>
      WINDOW_ROWS.length === 11 &&
      WINDOW_ROWS[0].kEnd === 17.0 &&
      WINDOW_ROWS[WINDOW_ROWS.length - 1].kEnd === 19.5,
  },
  {
    // (F1) The E_flow share is tiny everywhere; the in-window bound (sup) is ~1.38e-6 at the SHALLOW end.
    id: 'imp34273-share-tiny-bound-1e-6',
    description: 'max in-window share ~1.377e-6 at kEnd 17.0; every share < 2e-6',
    holds: () =>
      Math.abs(MAX_SHARE - 1.377255e-6) < 5e-9 &&
      MAX_SHARE === SHARES[0] &&
      SHARES.every((s) => s < 2e-6),
  },
  {
    // (F2) The share DECREASES monotonically across the window (assumption tightens as the tail deepens).
    id: 'imp34273-share-monotone-decreasing-in-window',
    description: 'share falls monotonically 17.0 -> 19.5 (tightening ~10x), min ~1.302e-7 at kEnd 19.5',
    holds: () =>
      SHARE_MONOTONE_DECREASING === true &&
      Math.abs(MIN_SHARE - 1.302145e-7) < 5e-10 &&
      MIN_SHARE === SHARES[SHARES.length - 1] &&
      TIGHTENING_FACTOR > 8 && TIGHTENING_FACTOR < 13,
  },
  {
    // (F3) The share re-inflates only at the immediate pole edge, staying <2e-5 even at kEnd 21.28.
    id: 'imp34273-share-reinflates-only-at-pole',
    description: 'pole-edge share (kEnd 21.28) > deep-window share yet still < 2e-5',
    holds: () =>
      SHARE_AT_POLE_EDGE > MIN_SHARE &&
      SHARE_AT_POLE_EDGE < 2e-5 &&
      POLE_APPROACH[POLE_APPROACH.length - 1].residExp < 1e-8, // essentially on the imp-34023 zero
  },
  {
    // Honesty gate: measurement/bound only, isRigorous false, no QED, no refereed bound is changed, C_mb / imp-3066 untouched.
    id: 'imp34273-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, C_mb GUE-conditional / imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34273_EFLOW_RESID_SHARE_NEGLIGIBILITY_BOUND.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34273_EFLOW_RESID_SHARE_NEGLIGIBILITY_BOUND.verdict) &&
      /NO QED/.test(IMP34273_EFLOW_RESID_SHARE_NEGLIGIBILITY_BOUND.verdict) &&
      /refereed bound is changed/i.test(IMP34273_EFLOW_RESID_SHARE_NEGLIGIBILITY_BOUND.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34273_EFLOW_RESID_SHARE_NEGLIGIBILITY_BOUND.verdict) &&
      /C_mb GUE-conditional[\s\S]*UNTOUCHED/i.test(IMP34273_EFLOW_RESID_SHARE_NEGLIGIBILITY_BOUND.verdict),
  },
];

for (const a of IMP34273_EFLOW_RESID_SHARE_NEGLIGIBILITY_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34273-eflow-resid-share-negligibility-bound assertion failed: ${a.id}`);
  }
}
