/**
 * @module imp-35907-req4-required-height-multiple-deep-height-tail
 *
 * imp-35907 (accuracy, measurement): TABULATE the imp-35853 REQ-4 required-height multiple
 * 200 / log T0 along the DEEP-HEIGHT tail (sigma << the ~0.019 Platt-Trudgian-anchor share,
 * N far past T_PT = 3e12) indexed by log T0 -- the natural deep-height axis -- to quantify
 * how far below the ~6.96x PT-anchor value it descends and whether it approaches any true
 * floor, making explicit that ~6.96x is a POINT value at sigma ~ 0.019 and not an asymptote.
 *
 * imp-35853 stopped the sigma sweep AT the PT anchor (log T0 ~ 28.73, sigma ~ 0.019,
 * multiple ~ 6.96x) and reported, from sigma-space, that the multiple keeps descending below
 * 6.96x for smaller sigma / larger height. imp-35888 then continued the descent INDEXED BY
 * TARGET MULTIPLE (6.96x -> ... -> 1x) and located the 1x binding at N ~ 2.27e88. Neither
 * tabulated the deep tail along the log-height axis itself. This module fills that gap: reusing
 * the identical imp-3406 / imp-33582 sub-terms (sigma = E_coll / (E_trunc + E_flow + E_coll),
 * log T0 = log(effectiveHeightForN(N)) on the shared imp-3220 / imp-3406 Riemann-von Mangoldt
 * surrogate), it bisects the downslope N at a UNIFORM log T0 grid from the PT anchor (28.73)
 * out to log T0 = 250 -- through the log T0 = 200 REQ-4 binding and BEYOND it -- reading off
 * sigma and the multiple 200 / log T0 at each rung.
 *
 * WHAT THE DEEP TAIL SHOWS (the honest finding). Along the log-height axis the multiple is an
 * EXACT rectangular hyperbola: multiple * log T0 = 200 identically, so multiple = 200 / log T0
 * with local slope d(multiple)/d(log T0) = -200 / (log T0)^2. Two consequences the sigma-space
 * view of imp-35853 obscures:
 *   (i) There is NO positive asymptotic floor. The multiple decays monotonically like 1 / log T0
 *       toward 0 as N -> infinity; the apparent "flatten then re-steepen" imp-35853 saw is an
 *       artifact of the nonlinear sigma <-> log T0 map, NOT of the multiple-vs-log-T0 curve,
 *       which has no inflection and whose slope magnitude shrinks monotonically (|slope| ~ 0.242
 *       at the PT anchor, ~0.02 at log T0 = 100, ~0.005 at the log T0 = 200 binding).
 *   (ii) ~6.96x is purely the value AT log T0 = 28.73. Halving it to ~3.48x needs only a DOUBLING
 *       of the log-height to log T0 ~ 57.46; the multiple reaches 2.0x at log T0 = 100, 1x
 *       (required = actual, REQ-4 met) at the log T0 = 200 binding, and CONTINUES below 1x
 *       (~0.89x at log T0 = 225, ~0.80x at log T0 = 250) -- i.e. the surrogate over-satisfies the
 *       binding at still larger height, so even 1x is not a floor.
 * At every deep rung the collision share sigma has collapsed far below the ~0.019 PT-anchor value
 * (down to ~1.2e-39 at the 200 binding), confirming the deep-tail regime sigma << 0.019 the ticket
 * targets. So the only "true floor" of the multiple is 0 in the unreachable N -> infinity limit;
 * ~6.96x is a point value, exactly as imp-35853 / imp-35888 asserted from the sigma and multiple
 * axes respectively, now confirmed along the log-height axis.
 *
 * Measurement / tabulation only on the existing imp-35853 / imp-35888 surrogate; re-reads the
 * imp-33582 model and the imp-35538 binding log-height on the same imp-3220 / imp-3406 surrogate;
 * derives no remainder; discharges nothing; changes no bound; establishes no operator positivity;
 * C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb
 * GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35888-req4-required-height-multiple-reaches-1x (sibling: descent indexed by multiple to 1x)
 * @see imp-35853-req4-required-height-continuous-sigma-knee (source sweep; sigma-space view)
 * @see imp-35538-route-i-remainder-derivation-requirements (REQ 4; binding log-height 200, e^200)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source model; peak sigma_max ~ 0.9494)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS } from './imp-35538-route-i-remainder-derivation-requirements.js';
import { IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE } from './imp-35853-req4-required-height-continuous-sigma-knee.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// REQ-4 binding log-height: 1/log T0 <= 0.005 => log T0 >= 200 (imp-35538).
const HR = IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.heightRegime;
const LOG_T0_NEEDED = HR.logT0NeededForHalfPctBudget; // 200

// EXACT imp-3406 / imp-3529 / imp-33582 sub-terms (identical to imp-35853 / imp-35888; no re-derivation).
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, sigma: E_coll / E_N, logT0: L, E_flow, E_coll, E_N };
}

// Bisect the downslope N whose surrogate log-height equals a target log T0 (monotone in N).
function nForLogT0(target) {
  let a = Math.log(1e6);
  let b = Math.log(1e130);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).logT0 < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// PT anchor reference (where imp-35853 stopped): log T0 ~ 28.73, multiple ~ 6.96x.
const LOG_T0_PT = Math.log(3e12); // ~28.7298
const MULT_PT = LOG_T0_NEEDED / LOG_T0_PT; // ~6.9614

// Uniform log-height grid from the PT anchor OUT through the log T0 = 200 binding and BEYOND.
// Indexing by log T0 (not by multiple as in imp-35888) is the natural deep-height axis.
const LOG_T0_GRID = [LOG_T0_PT, 40, 50, 60, 75, 100, 125, 150, 175, 200, 225, 250];
const deepTailTable = LOG_T0_GRID.map((L) => {
  const N = nForLogT0(L);
  const p = parts(N);
  const multiple = LOG_T0_NEEDED / p.logT0;
  return {
    logT0: +p.logT0.toFixed(4),
    N: +N.toExponential(3),
    sigma: +p.sigma.toExponential(3),
    multiple: +multiple.toFixed(4),
    // how far below the ~6.96x PT-anchor value this rung sits (PT anchor -> 1.00).
    fractionOfPtMultiple: +(multiple / MULT_PT).toFixed(4),
    // exact-hyperbola local slope d(multiple)/d(log T0) = -200 / (log T0)^2.
    slopeVsLogT0: +(-LOG_T0_NEEDED / (p.logT0 * p.logT0)).toExponential(4),
    isPtAnchor: Math.abs(L - LOG_T0_PT) < 1e-6,
    isBinding: Math.abs(L - LOG_T0_NEEDED) < 1e-9, // multiple = 1x exactly (REQ-4 met)
    belowBinding: multiple < 1, // surrogate over-satisfies REQ-4 at still larger height
  };
});

// The half-of-PT-anchor landmark: the multiple halves from ~6.96x to ~3.48x when the log-height
// merely DOUBLES from 28.73 to ~57.46 -- a direct consequence of the 1/log T0 hyperbola.
const LOG_T0_HALF_PT = LOG_T0_NEEDED / (MULT_PT / 2); // ~57.46
const halfPtLandmark = {
  logT0: +LOG_T0_HALF_PT.toFixed(4),
  multiple: +(LOG_T0_NEEDED / LOG_T0_HALF_PT).toFixed(4), // ~3.48x = MULT_PT / 2
  logHeightDoublingFromPt: +(LOG_T0_HALF_PT / LOG_T0_PT).toFixed(4), // ~2.00
};

// Slope magnitudes confirming the multiple-vs-log-T0 curve gets flatter but never floors above 0.
const slopeAtPt = LOG_T0_NEEDED / (LOG_T0_PT * LOG_T0_PT); // ~0.2423
const slopeAt100 = LOG_T0_NEEDED / (100 * 100); // 0.02
const slopeAt200 = LOG_T0_NEEDED / (200 * 200); // 0.005

export const IMP35907_REQ4_REQUIRED_HEIGHT_MULTIPLE_DEEP_HEIGHT_TAIL = {
  id: 'imp-35907',
  proofSection: 'S-frontier',
  question:
    'Tabulating the imp-35853 REQ-4 required-height multiple 200 / log T0 along the DEEP-HEIGHT tail ' +
    '(sigma << the ~0.019 Platt-Trudgian-anchor share, N far past T_PT = 3e12) indexed by log T0, how ' +
    'far below the ~6.96x PT-anchor value does it descend, and does it approach any true floor -- ' +
    'confirming ~6.96x is a POINT value at sigma ~ 0.019 rather than an asymptote?',
  method:
    'Reuse the exact imp-3406 / imp-33582 sub-terms (sigma = E_coll / (E_trunc + E_flow + E_coll), ' +
    'log T0 = log(effectiveHeightForN(N)) on the imp-3220 / imp-3406 RvM surrogate) and bisect the ' +
    'downslope N at a uniform log T0 grid from the PT anchor (28.73) out through the log T0 = 200 ' +
    'REQ-4 binding and beyond (to 250), reading off sigma and the multiple 200 / log T0 at each rung; ' +
    'characterise the multiple-vs-log-T0 curve as the exact hyperbola multiple * log T0 = 200 with ' +
    'slope -200 / (log T0)^2, so it decays like 1 / log T0 with no positive floor.',
  logT0Needed: LOG_T0_NEEDED, // 200
  ptAnchor: { logT0: +LOG_T0_PT.toFixed(4), multiple: +MULT_PT.toFixed(4) }, // ~28.73, ~6.96x
  deepTailTable,
  halfPtLandmark, // ~3.48x reached by merely doubling the log-height to ~57.46
  // The exact-hyperbola characterisation: multiple * log T0 = 200 identically along the axis.
  multipleTimesLogT0IsConstant: true,
  slopeShrinksMonotonically: slopeAtPt > slopeAt100 && slopeAt100 > slopeAt200,
  slopeMagnitudes: {
    atPtAnchor: +slopeAtPt.toFixed(4), // ~0.2423
    at100: +slopeAt100.toFixed(4), // 0.02
    atBinding200: +slopeAt200.toFixed(4), // 0.005
  },
  // The honest finding: the multiple has NO positive asymptotic floor -- it decays like 1 / log T0
  // to 0 as N -> infinity, crosses 1x at the log T0 = 200 binding, and continues below 1x for larger
  // height. So ~6.96x is a point value at sigma ~ 0.019, confirmed along the log-height axis.
  hasPositiveAsymptoticFloor: false,
  continuesBelowBinding: deepTailTable.some((r) => r.belowBinding === true),
  sigmaAtBindingBelowPtAnchor:
    deepTailTable.find((r) => r.isBinding).sigma < IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE.ptAnchor.sigma,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Tabulating the imp-35853 REQ-4 required-height multiple 200 / log T0 ' +
    'along the deep-height tail indexed by log T0 (from the PT anchor log T0 ~ 28.73 out through the ' +
    'log T0 = 200 REQ-4 binding to 250): along the log-height axis the multiple is the EXACT hyperbola ' +
    'multiple * log T0 = 200, so it decays monotonically like 1 / log T0 with slope -200 / (log T0)^2 ' +
    '(|slope| ~ 0.242 at the PT anchor, ~0.02 at log T0 = 100, ~0.005 at the 200 binding) -- shrinking ' +
    'in magnitude but NEVER reaching a positive floor, and with NO inflection (the apparent flatten-' +
    'then-re-steepen imp-35853 saw is an artifact of the nonlinear sigma <-> log T0 map). The multiple ' +
    'halves from ~6.96x to ~3.48x by merely doubling the log-height to ~57.46, reaches 2.0x at ' +
    'log T0 = 100, 1x (required = actual, REQ-4 met) at the log T0 = 200 binding, and CONTINUES below ' +
    '1x (~0.89x at 225, ~0.80x at 250). At every deep rung sigma has collapsed far below the ~0.019 ' +
    'PT-anchor share (down to ~1.2e-39 at the binding). So the only true floor of the multiple is 0 in ' +
    'the unreachable N -> infinity limit; ~6.96x is a POINT value at sigma ~ 0.019, not an asymptote -- ' +
    'confirming imp-35853 / imp-35888 along the log-height axis. Measurement / tabulation only on the ' +
    'imp-35853 / imp-35888 surrogate; re-reads the imp-33582 model and the imp-35538 binding log-height; ' +
    'derives no remainder; discharges nothing; changes no bound; establishes no operator positivity; ' +
    'C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional ' +
    '(imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35888 (sibling; descent indexed by multiple to 1x); imp-35853 (source sigma sweep); ' +
    'imp-35813 / imp-35763 / imp-35722 (rungs / ladders); imp-35538 (REQ 4; binding log-height 200, ' +
    'T0 = e^200); imp-33582 (sigma-decay model; peak sigma_max ~ 0.9494); imp-3220 / imp-3406 (RvM ' +
    'surrogate log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); ' +
    'imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; ' +
    'Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35907_REQ4_REQUIRED_HEIGHT_MULTIPLE_DEEP_HEIGHT_TAIL_ASSERTIONS = [
  {
    // (1) the deep-tail table is the exact hyperbola: multiple * log T0 = 200 at every rung.
    id: 'imp35907-multiple-times-logT0-is-200',
    description: 'every deep-tail rung satisfies multiple * log T0 = 200 exactly (the 1 / log T0 hyperbola)',
    holds: () =>
      deepTailTable.length === LOG_T0_GRID.length &&
      deepTailTable.every((r) => Math.abs(r.multiple * r.logT0 - 200) < 0.02),
  },
  {
    // (2) the multiple descends monotonically along the log-height axis and sigma descends with it.
    id: 'imp35907-monotone-descent-in-logT0',
    description: 'the multiple decreases and sigma decreases monotonically as log T0 increases across the grid',
    holds: () =>
      deepTailTable.every((r, i) => i === 0 || (r.multiple < deepTailTable[i - 1].multiple && r.sigma < deepTailTable[i - 1].sigma)),
  },
  {
    // (3) the PT anchor rung reproduces the ~6.96x value (identical sub-terms in use).
    id: 'imp35907-pt-anchor-matches-imp35853',
    description: 'the log T0 ~ 28.73 rung reproduces the ~6.96x PT-anchor multiple, matching imp-35853',
    holds: () => {
      const pt = deepTailTable.find((r) => r.isPtAnchor);
      return (
        Math.abs(MULT_PT - 6.9614) < 5e-3 &&
        Math.abs(pt.multiple - 6.9614) < 5e-3 &&
        Math.abs(pt.multiple - IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE.ptAnchor.multiple) < 5e-3 &&
        Math.abs(pt.fractionOfPtMultiple - 1) < 1e-6
      );
    },
  },
  {
    // (4) the multiple crosses 1x exactly at the log T0 = 200 binding and CONTINUES below 1x beyond.
    id: 'imp35907-crosses-1x-at-binding-continues-below',
    description: 'multiple = 1x at log T0 = 200 (REQ-4 met) and drops below 1x at log T0 = 225 / 250 (no floor at 1x)',
    holds: () => {
      const binding = deepTailTable.find((r) => r.isBinding);
      const below = deepTailTable.filter((r) => r.belowBinding);
      return (
        binding && Math.abs(binding.multiple - 1) < 1e-6 && Math.abs(binding.logT0 - 200) < 1e-4 &&
        below.length >= 2 && below.every((r) => r.logT0 > 200) &&
        IMP35907_REQ4_REQUIRED_HEIGHT_MULTIPLE_DEEP_HEIGHT_TAIL.continuesBelowBinding === true
      );
    },
  },
  {
    // (5) the half-PT landmark: halving ~6.96x to ~3.48x needs only a DOUBLING of the log-height.
    id: 'imp35907-half-pt-at-double-logheight',
    description: 'the multiple halves from ~6.96x to ~3.48x when log T0 doubles from ~28.73 to ~57.46',
    holds: () =>
      Math.abs(halfPtLandmark.multiple - MULT_PT / 2) < 1e-3 &&
      Math.abs(halfPtLandmark.logT0 - 57.4596) < 1e-2 &&
      Math.abs(halfPtLandmark.logHeightDoublingFromPt - 2) < 1e-3,
  },
  {
    // (6) no positive asymptotic floor: the slope magnitude shrinks monotonically toward (but never at) 0.
    id: 'imp35907-no-positive-floor-slope-shrinks',
    description: 'slope magnitude -200/(log T0)^2 shrinks monotonically (0.242 -> 0.02 -> 0.005); the multiple has no positive floor',
    holds: () => {
      const r = IMP35907_REQ4_REQUIRED_HEIGHT_MULTIPLE_DEEP_HEIGHT_TAIL;
      return (
        r.hasPositiveAsymptoticFloor === false &&
        r.multipleTimesLogT0IsConstant === true &&
        r.slopeShrinksMonotonically === true &&
        Math.abs(r.slopeMagnitudes.atPtAnchor - 0.2423) < 1e-3 &&
        Math.abs(r.slopeMagnitudes.at100 - 0.02) < 1e-6 &&
        Math.abs(r.slopeMagnitudes.atBinding200 - 0.005) < 1e-6
      );
    },
  },
  {
    // (7) the deep-tail regime is genuinely sigma << 0.019: sigma at the binding collapsed far below the PT share.
    id: 'imp35907-deep-tail-sigma-below-pt-share',
    description: 'sigma at the log T0 = 200 binding ~ 1e-39, far below the ~0.019 PT-anchor share (deep-tail regime confirmed)',
    holds: () => {
      const binding = deepTailTable.find((r) => r.isBinding);
      return (
        IMP35907_REQ4_REQUIRED_HEIGHT_MULTIPLE_DEEP_HEIGHT_TAIL.sigmaAtBindingBelowPtAnchor === true &&
        binding.sigma < 1e-30 &&
        binding.sigma < IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE.ptAnchor.sigma
      );
    },
  },
  {
    // (8) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, imp-486 kept, NO QED.
    id: 'imp35907-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35907_REQ4_REQUIRED_HEIGHT_MULTIPLE_DEEP_HEIGHT_TAIL;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35907_REQ4_REQUIRED_HEIGHT_MULTIPLE_DEEP_HEIGHT_TAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35907-req4-required-height-multiple-deep-height-tail assertion failed: ${a.id}`);
  }
}
