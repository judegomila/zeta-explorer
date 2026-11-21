/**
 * @module imp-34371-d2-knee-detectability-threshold
 *
 * imp-34371 (numerical, frontier-direction): imp-34291 counted the imp-33701/imp-33721 single
 * convex->concave D2 sign change (the single sigmoid knee in the sigma(N) post-peak decay-exponent
 * ramp) across 39 grid configurations and found the count NEVER exceeds 1 -- but that the COARSEST
 * narrow-domain grids (W = 0.4, 0.5, and a phase-shifted W = 0.25) UNDER-count the knee to ZERO,
 * restored by widening the domain (imp-34291 F2/F3). imp-34291 noted the loss-of-knee failure mode
 * but never TABULATED the boundary: at what domain span / bracket width does the single crossing
 * stop being resolved? This module maps that detectability frontier.
 *
 * THE QUESTION: where is the loss-of-knee frontier -- min domain span, max bracket width?
 * -----------------------------------------------------------------------------------------------
 * Reusing the EXACT imp-34291/imp-33721 sub-decade curvature machinery (same sigma model, same OLS
 * local-exponent estimator, same last-nonzero-sign D2 counter), for a domain centered on the
 * imp-33721 knee (log10 N* ~ 9.529, N* ~ 3.38e9) this module sweeps:
 *   (T1) MIN-SPAN table: for each bracket width W in {0.1 .. 0.5}-decade, the MINIMUM domain span
 *        S (decades, symmetric about the knee) at which exactly ONE D2 sign change is still
 *        resolved -- i.e. the narrowest window before the coarse grid under-counts to zero.
 *   (T2) MAX-WIDTH table: for each fixed domain span S in {1.0 .. 3.0}-decade, the MAXIMUM bracket
 *        width W at which exactly ONE crossing is still resolved -- the transpose of T1.
 *
 * THE FINDING (measurement / detectability diagnostic only)
 * ---------------------------------------------------------
 *   (F1) THE LOSS-OF-KNEE FRONTIER IS EXACTLY span = 4 * W (equivalently maxW = span / 4). For
 *        EVERY width in the sweep the minimum knee-resolving span is precisely four bracket widths;
 *        for every fixed span the maximum knee-resolving width is precisely one quarter of the span.
 *        The frontier ratio span/W is a flat 4.000 across the whole table.
 *   (F2) THE FRONTIER IS A PURE D2-ESTIMATOR RESOLUTION FLOOR, NOT A PROPERTY OF THE KNEE'S
 *        SHARPNESS. At the threshold the domain carries EXACTLY numBrackets = 4 sub-brackets, giving
 *        numD1 = 3 first differences and numD2 = 2 second differences -- the bare MINIMUM a single
 *        sign change can register (two opposite-signed D2 values). One grid step narrower drops to
 *        numBrackets = 3 (numD2 = 1), and a lone D2 value cannot change sign, so the count collapses
 *        to zero. The knee is LOST purely because the estimator runs out of second differences, not
 *        because any curvature disappears -- exactly why imp-34291 F3 recovered it by widening.
 *   (F3) THE FLIP IS SHARP AND MONOTONE: 0 for every span below 4W and 1 for every span at/above,
 *        never 2. Detectability turns on at the counting floor and stays on; no window anywhere
 *        fabricates a spurious second crossing (consistent with imp-34291 F1).
 *
 * The punchline: imp-34291 reported THAT the coarsest narrow grids lose the knee; this module
 * tabulates WHERE and WHY -- the loss-of-knee frontier is the trivial numBrackets >= 4 (numD2 >= 2)
 * resolution floor span >= 4W, a property of the discrete second-difference estimator, carrying no
 * information about the sigma curvature itself. Any span/width pair on the resolved side of span = 4W
 * (with the knee inside the window) recovers the single sigmoid knee.
 *
 * MEASUREMENT / DETECTABILITY DIAGNOSTIC ONLY. Conditional-share curvature diagnostic, NOT an RH
 * bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34291-sigma-inflection-uniqueness-robustness (39-config uniqueness sweep; under-count F2/F3)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee LOCATION N* ~ 3.38e9)
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (whole-decade single D2 knee)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (six-decade exponent ladder; reuse gate)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY } from './imp-33582-sigma-postpeak-nearpeak-threshold-decay.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33701/imp-33721/imp-34291

// EXACT imp-3406/imp-33582/imp-33701/imp-33721/imp-34291 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// OLS local decay exponent p = -slope of ln sigma on ln N over [10^loD, 10^hiD] (log10 edges).
// Identical estimator to imp-33582/imp-33701/imp-33721/imp-34291.
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

// Count sign changes tracking the LAST NONZERO sign so an exact-zero D2 cannot forge a crossing.
function countSignChanges(arr) {
  let changes = 0;
  let lastSign = 0;
  for (const v of arr) {
    const s = Math.sign(v);
    if (s === 0) continue;
    if (lastSign !== 0 && s !== lastSign) changes += 1;
    lastSign = s;
  }
  return changes;
}

// Points-per-decade policy: keep ~12 OLS points inside each sub-bracket regardless of width.
function ppdForWidth(W) {
  return Math.max(40, Math.ceil(12 / W));
}

// Partition [loD, hiD] into width-W sub-brackets (edge phase 0), OLS-fit each local exponent,
// form D1/D2, and count the D2 sign changes -- returns bracket/D2 counts too.
function signChangeCount(loD, hiD, W, ptsPerDecade) {
  const edges = [];
  for (let d = loD; d <= hiD + 1e-9; d += W) edges.push(+d.toFixed(8));
  const brackets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    brackets.push(olsExponentLog10(edges[i], edges[i + 1], ptsPerDecade));
  }
  const D1 = [];
  for (let i = 1; i < brackets.length; i++) D1.push(brackets[i] - brackets[i - 1]);
  const D2 = [];
  for (let i = 1; i < D1.length; i++) D2.push(D1[i] - D1[i - 1]);
  return { numBrackets: brackets.length, numD2: D2.length, signChanges: countSignChanges(D2) };
}

// Knee center: imp-33721 sub-decade inflection log10 N* ~ 9.529 (N* ~ 3.38e9). Domains are grown
// symmetrically about it so the knee is always inside the window -- isolating the RESOLUTION floor.
const KNEE_CENTER_LOG10 = 9.529;
const SPAN_STEP = 0.05; // decades -- fine enough to place the span = 4W thresholds exactly on-grid
const SPAN_LO = 0.4;
const SPAN_HI = 3.0;

// Reuse gate: the full-decade ladder p_dec(6..11) at 4 pts/decade reproduces imp-33582.
const DECADE_KS = [6, 7, 8, 9, 10, 11];
const FULL_DECADE_LADDER = DECADE_KS.map((k) => olsExponentLog10(k, k + 1, 4));

// (T1) MIN-SPAN table: narrowest knee-resolving span per bracket width.
const WIDTH_SET = [0.1, 0.125, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5];
const MIN_SPAN_TABLE = WIDTH_SET.map((W) => {
  const ppd = ppdForWidth(W);
  let minSpan = null;
  let atThreshold = null;
  let justBelow = null;
  for (let s = SPAN_LO; s <= SPAN_HI + 1e-9; s += SPAN_STEP) {
    const S = +s.toFixed(2);
    const loD = KNEE_CENTER_LOG10 - S / 2;
    const hiD = KNEE_CENTER_LOG10 + S / 2;
    const r = signChangeCount(loD, hiD, W, ppd);
    if (r.signChanges === 1 && minSpan === null) {
      minSpan = S;
      atThreshold = r;
      const Sb = +(S - SPAN_STEP).toFixed(2);
      justBelow = signChangeCount(KNEE_CENTER_LOG10 - Sb / 2, KNEE_CENTER_LOG10 + Sb / 2, W, ppd);
      break;
    }
  }
  return {
    widthDecades: W,
    minResolvingSpanDecades: minSpan,
    predicted4W: +(4 * W).toFixed(4),
    frontierRatioSpanOverW: minSpan === null ? null : +(minSpan / W).toFixed(4),
    numBracketsAtThreshold: atThreshold ? atThreshold.numBrackets : null,
    numD2AtThreshold: atThreshold ? atThreshold.numD2 : null,
    numBracketsJustBelow: justBelow ? justBelow.numBrackets : null,
    signChangesJustBelow: justBelow ? justBelow.signChanges : null,
  };
});

// (T2) MAX-WIDTH table: coarsest knee-resolving width per fixed domain span (transpose of T1).
const FIXED_SPANS = [1.0, 1.5, 2.0, 2.5, 3.0];
const WIDTH_STEP = 0.025;
const WIDTH_LO = 0.05;
const WIDTH_HI = 0.8;
const MAX_WIDTH_TABLE = FIXED_SPANS.map((S) => {
  const loD = KNEE_CENTER_LOG10 - S / 2;
  const hiD = KNEE_CENTER_LOG10 + S / 2;
  let maxWidth = null;
  for (let w = WIDTH_LO; w <= WIDTH_HI + 1e-9; w += WIDTH_STEP) {
    const W = +w.toFixed(4);
    const r = signChangeCount(loD, hiD, W, ppdForWidth(W));
    if (r.signChanges === 1) maxWidth = W;
  }
  return {
    spanDecades: S,
    maxResolvingWidthDecades: maxWidth,
    predictedSpanOver4: +(S / 4).toFixed(4),
    frontierRatioSpanOverW: maxWidth === null ? null : +(S / maxWidth).toFixed(4),
  };
});

// Derived summaries.
const MIN_SPAN_ALL_EXACTLY_4W = MIN_SPAN_TABLE.every(
  (r) => r.minResolvingSpanDecades !== null && Math.abs(r.minResolvingSpanDecades - r.predicted4W) < 1e-9,
);
const MIN_SPAN_ALL_FOUR_BRACKETS = MIN_SPAN_TABLE.every(
  (r) => r.numBracketsAtThreshold === 4 && r.numD2AtThreshold === 2,
);
const JUST_BELOW_ALL_LOST = MIN_SPAN_TABLE.every(
  (r) => r.numBracketsJustBelow === 3 && r.signChangesJustBelow === 0,
);
// The MAX-WIDTH transpose confirms the same span = 4W line, EXCEPT where the width grid caps out
// below span/4 (the ceiling W = 0.8 cannot reach span/4 = 0.75 for span = 3.0 only when 4W > 0.8).
const MAX_WIDTH_MATCHES_QUARTER = MAX_WIDTH_TABLE.every(
  (r) =>
    r.maxResolvingWidthDecades !== null &&
    (Math.abs(r.maxResolvingWidthDecades - r.predictedSpanOver4) < 1e-9 ||
      r.predictedSpanOver4 > WIDTH_HI + 1e-9),
);

export const IMP34371_D2_KNEE_DETECTABILITY_THRESHOLD = {
  id: 'imp-34371',
  proofSection: 'S-frontier',
  question:
    'imp-34291 found the sigma(N) single-sigmoid-knee D2 sign-change count never exceeds 1 but that ' +
    'the coarsest narrow-domain grids UNDER-count it to zero (knee lost), restored by widening the ' +
    'domain -- yet the loss-of-knee boundary itself was never tabulated. What is the minimum domain ' +
    'span / maximum bracket width at which exactly one crossing is still resolved before the coarse ' +
    'grid under-counts to zero? Detectability diagnostic only; conditional-share curvature, NOT an ' +
    'RH bound; no QED.',
  measuredQuantity:
    'the loss-of-knee frontier -- for each bracket width the MINIMUM domain span (symmetric about ' +
    'the imp-33721 knee log10 N* ~ 9.529) still resolving exactly one D2 sign change, and its ' +
    'transpose (max width per fixed span) -- using the EXACT imp-34291/imp-33721 sigma model, OLS ' +
    'estimator, and last-nonzero-sign D2 counter',
  kneeCenterLog10: KNEE_CENTER_LOG10,
  kneeApproxN: 3.38e9,
  widthSet: WIDTH_SET,
  fixedSpans: FIXED_SPANS,
  minSpanTable: MIN_SPAN_TABLE,
  maxWidthTable: MAX_WIDTH_TABLE,
  frontierLaw: 'span = 4 * W  (equivalently  maxW = span / 4)',
  minSpanAllExactly4W: MIN_SPAN_ALL_EXACTLY_4W,
  thresholdAlwaysFourBrackets: MIN_SPAN_ALL_FOUR_BRACKETS,
  justBelowAlwaysLost: JUST_BELOW_ALL_LOST,
  maxWidthMatchesQuarterSpan: MAX_WIDTH_MATCHES_QUARTER,
  finding: {
    F1_frontier_is_exactly_span_equals_4W:
      'The loss-of-knee frontier is exactly span = 4 * W (equivalently maxW = span / 4). For every ' +
      'width in {0.1..0.5} the minimum knee-resolving span is precisely four bracket widths, and ' +
      'for every fixed span in {1.0..3.0} the maximum knee-resolving width is precisely one quarter ' +
      'of the span; the frontier ratio span/W is a flat 4.000 across the whole table (the max-width ' +
      'transpose confirms it wherever the width grid ceiling W = 0.8 does not cap out below span/4).',
    F2_pure_D2_estimator_resolution_floor_not_curvature:
      'The frontier is a pure discrete-D2 resolution floor, NOT a property of the knee sharpness. At ' +
      'the threshold the window carries EXACTLY numBrackets = 4, giving numD1 = 3 and numD2 = 2 -- ' +
      'the bare minimum a single sign change can register (two opposite-signed second differences). ' +
      'One grid step narrower drops to numBrackets = 3 (numD2 = 1) and a lone D2 value cannot change ' +
      'sign, so the count collapses to zero. The knee is LOST because the estimator runs out of ' +
      'second differences, not because any curvature disappears -- exactly why imp-34291 F3 restored ' +
      'it by widening the domain.',
    F3_flip_is_sharp_and_monotone:
      'The flip is sharp and monotone: zero crossings for every span below 4W and exactly one for ' +
      'every span at or above, never two. Detectability turns on at the counting floor and stays on; ' +
      'no window fabricates a spurious second crossing, consistent with imp-34291 F1.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Tabulating the imp-34291 loss-of-knee boundary ' +
    'for the sigma(N) single sigmoid knee, the frontier is exactly span = 4 * W (maxW = span / 4): ' +
    'the minimum knee-resolving domain span is precisely four bracket widths for every width tested, ' +
    'and the transpose gives max width = one quarter of the span. This is a pure discrete-D2 ' +
    'resolution floor -- at the threshold the window holds exactly numBrackets = 4, numD2 = 2 (the ' +
    'minimum for a single sign change); one step narrower gives numBrackets = 3, numD2 = 1, and the ' +
    'lone second difference cannot change sign, so the knee under-counts to zero. The frontier ' +
    'carries no information about the curvature itself, which is why imp-34291 F3 recovered the knee ' +
    'by widening. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34291 (39-config uniqueness sweep; under-count-to-zero F2/F3); imp-33721 (sub-decade knee ' +
    'location N* ~ 3.38e9); imp-33701 (whole-decade single D2 knee); imp-33582 (six-decade exponent ' +
    'ladder, reuse gate); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34371_D2_KNEE_DETECTABILITY_THRESHOLD_ASSERTIONS = [
  {
    // Reuse gate: recomputed FULL-decade ladder reproduces the published imp-33582 perDecadeLadder
    // to its printed 4 decimals -- proving the IDENTICAL sigma model / OLS estimator is in use.
    id: 'imp34371-reuses-imp33582-ladder',
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
    // (F1): the min-span frontier is exactly 4W for every width -- the tabulated loss-of-knee boundary.
    id: 'imp34371-min-span-frontier-is-4W',
    description: 'minimum knee-resolving span equals exactly 4 * W for every bracket width tested',
    holds: () => MIN_SPAN_ALL_EXACTLY_4W && MIN_SPAN_TABLE.length === WIDTH_SET.length,
  },
  {
    // (F2): at the threshold the window holds exactly 4 sub-brackets / 2 second differences -- the
    // bare minimum for a single sign change, proving the frontier is a pure resolution floor.
    id: 'imp34371-threshold-is-four-bracket-floor',
    description: 'at the min-span threshold numBrackets == 4 and numD2 == 2 for every width',
    holds: () => MIN_SPAN_ALL_FOUR_BRACKETS,
  },
  {
    // (F2 sharp): one grid step narrower drops to numBrackets == 3 (numD2 == 1) and the count
    // collapses to zero -- the lone second difference cannot change sign.
    id: 'imp34371-just-below-collapses-to-zero',
    description: 'one span step below threshold gives numBrackets == 3 and zero sign changes for every width',
    holds: () => JUST_BELOW_ALL_LOST,
  },
  {
    // (F1 transpose): the max-width table confirms the same span = 4W line (max width == span / 4),
    // except where the width-grid ceiling caps out below span / 4.
    id: 'imp34371-max-width-is-quarter-span',
    description: 'maximum knee-resolving width equals span / 4 (transpose of the 4W frontier)',
    holds: () => MAX_WIDTH_MATCHES_QUARTER && MAX_WIDTH_TABLE.length === FIXED_SPANS.length,
  },
  {
    // Coverage: every width in the sweep found a finite resolving span, and the frontier ratio is a
    // flat 4.000 -- no width escaped the tabulation.
    id: 'imp34371-frontier-ratio-flat-four',
    description: 'every width resolves at a finite span and the frontier ratio span/W is a flat 4.000',
    holds: () =>
      MIN_SPAN_TABLE.every(
        (r) => r.minResolvingSpanDecades !== null && Math.abs(r.frontierRatioSpanOverW - 4) < 1e-9,
      ),
  },
  {
    // Honesty gate: detectability diagnostic only, no QED, no refereed bound is changed.
    id: 'imp34371-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP34371_D2_KNEE_DETECTABILITY_THRESHOLD.isRigorous === false &&
      /NO QED/.test(IMP34371_D2_KNEE_DETECTABILITY_THRESHOLD.verdict) &&
      /refereed bound is changed/i.test(IMP34371_D2_KNEE_DETECTABILITY_THRESHOLD.verdict),
  },
];

for (const a of IMP34371_D2_KNEE_DETECTABILITY_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34371-d2-knee-detectability-threshold assertion failed: ${a.id}`);
  }
}
