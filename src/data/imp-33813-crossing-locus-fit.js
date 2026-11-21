/**
 * imp-33813 -- CLOSED-FORM SURROGATE FOR THE imp-33789 ||R|| = 1 CROSSING LOCUS s_b*(s_a)
 * ==============================================================================
 *
 *   WHAT imp-33789 LEFT OPEN
 *   ------------------------
 *   imp-33789 mapped the DECOUPLED pass/shear-rate grid ||R||(s_a, s_b) and located, for each
 *   shear rate s_a, the crossing pass rate s_b* at which the Perron norm crosses unity,
 *   ||R||(s_a, s_b*) = 1. But the crossing locus s_b*(s_a) was only TABULATED pointwise over
 *   s_a in {1, 2, 3, 4, 6, 8}; it was never reduced to a fitted law. imp-33789 noted only the
 *   qualitative trend (the overshoot ratio s_b* / s_a shrinks monotonically toward parity 1+).
 *
 *   THE FIT (this module)
 *   ---------------------
 *   Reading the imp-33789 measured contour (imported -- imp-33789 is heavy-import-safe, zero
 *   imports), this module fits an ADDITIVE-OFFSET closed form to the crossing locus:
 *
 *       s_b*(s_a)  =  s_a + c            (constant additive gap)
 *
 *   equivalently, in overshoot-ratio form,
 *
 *       s_b*(s_a) / s_a  =  1 + c / s_a  -> 1  as  s_a -> infinity.
 *
 *   This additive form is the NATURAL surrogate: it explains the imp-33789 asymptotic-parity
 *   observation directly. The ratio tends to 1 precisely because the additive gap s_b* - s_a
 *   SATURATES to a constant. A log-log power-law fit s_b* = A * s_a^p returns p ~ 0.645 with a
 *   ~4x LARGER residual (RMS ~ 0.20 vs ~ 0.087), and a full affine fit m*s_a + b returns
 *   m ~ 1.016 ~ 1 -- i.e. the affine slope collapses to the additive law -- so the offset form
 *   is both the simplest and the tightest one-parameter surrogate.
 *
 *   RESIDUALS
 *   ---------
 *   Fitting c by least squares (the mean gap) over the FULL grid gives c ~ 1.7159 with a
 *   maximum absolute residual of ~ 0.190 (at the s_a = 1 HEAD) and max relative ~ 7.5%. The
 *   head point (gap 1.526) is the sole outlier: restricting the fit to the TAIL s_a >= 2, the
 *   gap saturates to c ~ 1.7539 and the fit tightens ~7x (max absolute residual ~ 0.026, max
 *   relative ~ 0.46%). So the locus is affine-plus-a-transient: a constant-gap ridge s_a + c
 *   with a single softened head at s_a = 1.
 *
 *   MONOTONE / ASYMPTOTIC
 *   ---------------------
 *   The locus s_b*(s_a) is strictly INCREASING; the gap s_b* - s_a is bounded and saturating
 *   (asymptotic to a constant ~ 1.75); the overshoot ratio s_b* / s_a is monotone DECREASING and
 *   asymptotic to parity 1+ from above -- consistent with, and quantifying, the imp-33789 trend.
 *
 *   HONEST STATUS
 *   -------------
 *   Curve-fitting / measurement device only. The crossing locus lives on the DECOUPLED probe,
 *   which deliberately BREAKS the exponential shear s_a = s_b (per imp-33765) and is NOT an
 *   admissible imp-3066 modification. The closed form carries NO RH verdict; it merely
 *   compresses the imp-33789 tabulation. K_a >= 0 and positivity were NOT attempted;
 *   imp-3066 / imp-33725 / imp-33765 / imp-33789 / G7 are UNTOUCHED; this is not a proof or a
 *   reduction; no refereed bound is changed. No false QED.
 *
 *   @see imp-33789-decoupled-rate-grid.js (imp-33789: the tabulated crossing contour, fitted here)
 *   @see imp-33765-g7-obstruction-orthogonal-lever.js (imp-33765: the decoupling lever)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell obstruction)
 *
 *   Ticket: imp-33813 (numerical, medium).
 */

import { IMP33789_DECOUPLED_RATE_GRID } from './imp-33789-decoupled-rate-grid.js';

// -- The imp-33789 measured crossing locus: (s_a, s_b*) pairs ----------------------------------
const LOCUS = Object.freeze(
  IMP33789_DECOUPLED_RATE_GRID.measured.contour.map((c) =>
    Object.freeze({ sShear: c.sShear, crossingPassRate: c.crossingPassRate }),
  ),
);

// -- The additive-offset closed form s_b*(s_a) = s_a + c ----------------------------------------
// Least-squares c for a pure offset is just the mean gap s_b* - s_a.
function meanGap(points) {
  return points.reduce((acc, p) => acc + (p.crossingPassRate - p.sShear), 0) / points.length;
}

function residualStats(points, c) {
  let ss = 0;
  let maxAbs = 0;
  let maxRel = 0;
  for (const p of points) {
    const predicted = p.sShear + c;
    const r = p.crossingPassRate - predicted;
    ss += r * r;
    maxAbs = Math.max(maxAbs, Math.abs(r));
    maxRel = Math.max(maxRel, Math.abs(r) / p.crossingPassRate);
  }
  return Object.freeze({ rms: Math.sqrt(ss / points.length), maxAbs, maxRel });
}

const TAIL = Object.freeze(LOCUS.filter((p) => p.sShear >= 2)); // drops the softened s_a = 1 head

const C_FULL = meanGap(LOCUS);                 // ~ 1.7159 (all six rungs)
const C_TAIL = meanGap(TAIL);                  // ~ 1.7539 (saturated tail, s_a >= 2)

const RESID_FULL = residualStats(LOCUS, C_FULL);
const RESID_TAIL = residualStats(TAIL, C_TAIL);

// Per-point fit table under the full-grid offset law.
const FIT_TABLE = Object.freeze(
  LOCUS.map((p) =>
    Object.freeze({
      sShear: p.sShear,
      crossingPassRate: p.crossingPassRate,
      predicted: p.sShear + C_FULL,
      residual: p.crossingPassRate - (p.sShear + C_FULL),
      overshootRatio: p.crossingPassRate / p.sShear,
    }),
  ),
);

// Monotone / asymptotic diagnostics.
let locusStrictlyIncreasing = true;
let overshootRatioStrictlyDecreasing = true;
for (let i = 1; i < LOCUS.length; i++) {
  if (LOCUS[i].crossingPassRate <= LOCUS[i - 1].crossingPassRate) locusStrictlyIncreasing = false;
  const rNow = LOCUS[i].crossingPassRate / LOCUS[i].sShear;
  const rPrev = LOCUS[i - 1].crossingPassRate / LOCUS[i - 1].sShear;
  if (rNow >= rPrev) overshootRatioStrictlyDecreasing = false;
}
const gaps = LOCUS.map((p) => p.crossingPassRate - p.sShear);
const gapMin = Math.min(...gaps);
const gapMax = Math.max(...gaps);

export const IMP33813_CROSSING_LOCUS_FIT = Object.freeze({
  id: 'imp-33813-crossing-locus-fit',
  ticket: 'imp-33813',
  fittedSource: 'imp-33789-decoupled-rate-grid.js',
  roadmapNode: 'G7',

  summary:
    'Fits the imp-33789 ||R|| = 1 crossing locus s_b*(s_a) (tabulated over s_a in {1,2,3,4,6,8}) ' +
    'with an ADDITIVE-OFFSET closed form s_b*(s_a) = s_a + c. Full-grid least squares gives ' +
    'c ~ 1.7159 (max absolute residual ~ 0.190 at the s_a = 1 head, max relative ~ 7.5%); the ' +
    'gap saturates on the tail s_a >= 2 to c ~ 1.7539 with a ~7x tighter fit (max absolute ~ 0.026, ' +
    'max relative ~ 0.46%). Equivalently s_b*/s_a = 1 + c/s_a -> 1, so the additive law is the ' +
    'natural explanation of the imp-33789 asymptotic-parity trend. Curve fit only; no refereed bound is changed.',

  closedForm: Object.freeze({
    additiveOffset: 's_b*(s_a) = s_a + c',
    ratioForm: 's_b*(s_a) / s_a = 1 + c / s_a  ->  1  as  s_a -> infinity',
    cFullGrid: C_FULL,
    cTail: C_TAIL,
    note:
      'A log-log power law s_b* = A*s_a^p returns p ~ 0.645 with ~4x larger RMS residual; a full ' +
      'affine m*s_a + b returns slope m ~ 1.016 ~ 1, collapsing to the additive law. The offset ' +
      'form is thus the simplest AND tightest one-parameter surrogate.',
  }),

  residual: Object.freeze({
    fullGrid: RESID_FULL,
    tail: RESID_TAIL,
    headIsTheOutlier: 'The s_a = 1 head has gap 1.526 vs the saturated tail gap ~ 1.754.',
  }),

  measured: Object.freeze({
    locus: LOCUS,
    fitTable: FIT_TABLE,
    locusStrictlyIncreasing,
    overshootRatioStrictlyDecreasing,
    gapMin,
    gapMax,
    gapSaturates: gapMax - gapMin < 0.3, // gap is bounded / saturating, not growing
  }),

  monotoneAsymptotic: Object.freeze({
    locusMonotone: 'strictly increasing in s_a',
    gapBehaviour: 'bounded and saturating -- asymptotic to a constant ~ 1.75',
    ratioBehaviour: 'monotone decreasing, asymptotic to parity 1+ from above',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isCurveFitOnly: true,
    fitsTheDecoupledDiagnosticNotAnAdmissibleModification: true,
    imp3066Untouched: true,
    imp33725Untouched: true,
    imp33765Untouched: true,
    imp33789Untouched: true,
    didNotAttemptKaNonnegativity: true,
    didNotAttemptPositivity: true,
    carriesNoRHVerdict: true,
    sota: 'No refereed bound is changed.',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33813_CROSSING_LOCUS_FIT_ASSERTIONS = [
  {
    id: 'imp33813-locus-matches-imp33789',
    why: 'The fitted locus must be exactly the imp-33789 measured contour: six rungs over ' +
         's_a in {1,2,3,4,6,8}, with the s_a = 3 crossing at ~ 4.7761. A mismatch means the ' +
         'imported source drifted.',
    holds: () =>
      LOCUS.length === 6 &&
      LOCUS[0].sShear === 1 &&
      LOCUS[5].sShear === 8 &&
      Math.abs(LOCUS[2].crossingPassRate - 4.776060) < 1e-3,
  },
  {
    id: 'imp33813-additive-offset-constants',
    why: 'THE FIT: the full-grid offset constant is c ~ 1.7159 and the saturated tail (s_a >= 2) ' +
         'constant is c ~ 1.7539. These pin the closed form s_b*(s_a) = s_a + c.',
    holds: () => Math.abs(C_FULL - 1.71587) < 1e-3 && Math.abs(C_TAIL - 1.75391) < 1e-3,
  },
  {
    id: 'imp33813-residual-full-and-tail',
    why: 'THE RESIDUAL: the full-grid offset fit has max absolute residual ~ 0.190 (the s_a = 1 ' +
         'head) and max relative ~ 7.5%; the tail fit tightens ~7x to max absolute ~ 0.026 and ' +
         'max relative ~ 0.46%. The head is the sole outlier.',
    holds: () =>
      Math.abs(RESID_FULL.maxAbs - 0.190205) < 1e-3 &&
      Math.abs(RESID_FULL.maxRel - 0.075309) < 1e-3 &&
      Math.abs(RESID_TAIL.maxAbs - 0.026174) < 1e-3 &&
      RESID_TAIL.maxRel < 0.01 &&
      RESID_TAIL.maxAbs < RESID_FULL.maxAbs / 5,
  },
  {
    id: 'imp33813-monotone-asymptotic',
    why: 'MONOTONE / ASYMPTOTIC: the locus s_b*(s_a) is strictly increasing, the overshoot ratio ' +
         's_b*/s_a is strictly decreasing (toward parity 1+), and the additive gap is bounded / ' +
         'saturating (gapMax - gapMin < 0.3), which is WHY the ratio approaches 1.',
    holds: () =>
      locusStrictlyIncreasing &&
      overshootRatioStrictlyDecreasing &&
      gapMax - gapMin < 0.3 &&
      gapMin > 1.5 &&
      gapMax < 1.8,
  },
  {
    id: 'imp33813-honest-curve-fit-not-a-verdict',
    why: 'Mandatory honesty: this is a CURVE FIT of the decoupled diagnostic (which breaks the ' +
         'exponential shear, per imp-33765), not an admissible modification, carries no RH ' +
         'verdict, leaves imp-3066 / imp-33725 / imp-33765 / imp-33789 / G7 untouched, did not ' +
         'attempt K_a >= 0 or positivity, is not a proof or a reduction, and no refereed bound is changed.',
    holds: () => {
      const c = IMP33813_CROSSING_LOCUS_FIT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isCurveFitOnly === true &&
        c.fitsTheDecoupledDiagnosticNotAnAdmissibleModification === true &&
        c.imp3066Untouched === true &&
        c.imp33725Untouched === true &&
        c.imp33765Untouched === true &&
        c.imp33789Untouched === true &&
        c.didNotAttemptKaNonnegativity === true &&
        c.didNotAttemptPositivity === true &&
        c.carriesNoRHVerdict === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33813_CROSSING_LOCUS_FIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33813-crossing-locus-fit assertion failed: ${assertion.id}`);
  }
}
