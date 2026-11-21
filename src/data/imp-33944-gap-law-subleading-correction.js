/**
 * @module imp-33944-gap-law-subleading-correction
 *
 * imp-33944 (numerical, frontier-direction): imp-33816 F2 established the logarithmically-slow
 * gap law gap(N) = 1/2 - p(N) ~ 1/(2 log T0) and reported the validation ratio
 *     ratio(N) = gap(N) * 2 * log T0  ->  1.00     over N = 1e44..1e200,
 * but STOPPED at "-> 1.00" without resolving the SIGN or RATE of the sub-leading correction:
 * does ratio approach 1 from above or below, and how fast? This module tabulates ratio(N) from
 * the exact imp-33816 log-space sub-terms across 1e44..1e200, fits the residual (ratio - 1)
 * against 1/log T0 and 1/(log T0)^2, and reports the leading correction term and its sign.
 *
 * THE QUANTITY (identical inherited imp-3220 / imp-3406 / imp-33816 sub-terms, log-N space)
 * ---------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED sqrt(log T0 / N),  E_flow = C_F (log T0 / T0) Gronwall,  E_trunc = 3.06e-5,
 *     p(N)   = -d ln sigma / d ln N   (imp-3529 / imp-33582 in-window slope),
 *     gap(N) = 1/2 - p(N),   ratio(N) = gap(N) * 2 * log T0.
 * Solved in log-N space (Newton on ln N = u + log(u - 1), u = log(T0/2pi), never forming T0/N)
 * exactly as imp-33816 imp-33859, so N far past IEEE-double range stays evaluable.
 *
 * THE CLOSED FORM (why ratio approaches 1 from below)
 * ---------------------------------------------------
 * On the far tail E_coll = C_C sqrt(L/N) with L = log T0 is exponentially small in ln N, so
 * E_coll/E_trunc and the underflowing E_flow are negligible and sigma ~ (C_C/E_trunc) sqrt(L/N).
 * Then ln sigma ~ const + (1/2) ln L - (1/2) ln N, and with the Riemann-von Mangoldt Jacobian
 * dL/d ln N = 1 - 1/u (from ln N = u + log(u - 1)) the local exponent is
 *     p(N) = 1/2 - (1/2)(1 - 1/u)/L   =>   gap(N) = (1/2)(1 - 1/u)/L,
 * hence the EXACT leading form
 *     ratio(N) = gap * 2 * L = 1 - 1/u = 1 - 1 / (log T0 - log 2pi).
 * Since u = L - log 2pi > 0, ratio < 1 always: the approach to 1 is FROM BELOW. Expanded in
 * powers of 1/L,
 *     ratio - 1 = -1/u = -1/L - (log 2pi)/L^2 - (log 2pi)^2/L^3 - ...
 * so the leading correction term is -1/log T0 (coefficient exactly -1) and the next is
 * -(log 2pi)/(log T0)^2 (coefficient exactly -log 2pi ~ -1.8379).
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) FROM BELOW. ratio(N) = gap * 2 log T0 is strictly LESS than 1 at every rung
 *        (ratio - 1 in {-1.03e-2 at 1e44, ..., -2.20e-3 at 1e200}) and rises monotonically toward
 *        1 -- the imp-33816 "-> 1.00" approach is one-sided, from below.
 *   (F2) LEADING CORRECTION -1/log T0. A two-basis least-squares fit of (ratio - 1) against
 *        {1/L, 1/L^2} over 1e44..1e300 returns c1 ~ -1.00 and c2 ~ -1.84, matching the closed-form
 *        coefficients (-1, -log 2pi) to the finite-difference floor (two-term RMS residual ~1e-7).
 *        The leading correction is NEGATIVE and O(1/log T0): the residual decays only as ~1/log T0,
 *        one power slower would be needed for a fast approach.
 *   (F3) EXACT -1/u LAW. The full closed form ratio - 1 = -1/(log T0 - log 2pi) reproduces the
 *        measured (ratio - 1) to < 1e-3 relative at every rung -- the sub-leading correction is not
 *        merely fit but derived from the same inherited sub-terms.
 *
 * The punchline: imp-33816 gap law ratio -> 1 is a ONE-SIDED approach FROM BELOW, governed exactly
 * by ratio = 1 - 1/(log T0 - log 2pi). The leading sub-leading correction is -1/log T0 (sign
 * NEGATIVE, coefficient -1), decaying only logarithmically -- consistent with the imp-33816 F2
 * verdict that the whole approach to the 1/2 asymptote is logarithmically slow.
 *
 * MEASUREMENT / FIT ONLY. Sub-leading diagnostic of the imp-33816 conditional-share gap law,
 * NOT an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (F2 gap law gap ~ 1/(2 log T0), ratio -> 1.00)
 * @see imp-33859 (log-space direct path: ln N = u + log(u - 1), never forming T0/N)
 * @see imp-33918-ecoll-g-vs-law-reference-offset-convergence-rate (companion g/law = L/(L+1) order-1 ratio)
 * @see imp-3529-sigma-postpeak-decay-exponent (LOCAL pointwise exponent p(N))
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33816)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33816 exactly
const HALF = 0.5;
const LOG_TWO_PI = Math.log(TWO_PI); // ~1.8379 = the exact second-order coefficient magnitude

// Log-N-space evaluation, IDENTICAL to imp-33816 imp-33859 (Newton ln N = u + log(u - 1),
// u = log(T0/2pi)), so N far past IEEE-double range never overflows.
function logT0FromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 80; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-13 * Math.max(1, u)) break;
  }
  return { u, L: u + LOG_TWO_PI }; // L = log T0 = u + log 2pi
}
function lnSigmaFromLnN(lnN) {
  const { u, L } = logT0FromLnN(lnN);
  const C_F = (u + 1) / TWO_PI; // = (log(T0/2pi) + 1)/2pi, identical to imp-33816
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN; // C_C sqrt(L/N)
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL; // C_F (L/T0) Gronwall, T0 = e^L
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}
function pLocalFromLnN(lnN) {
  const dl = 1e-3; // identical step to imp-33816 pLocalAtLog10
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}

// One rung: ratio(N) = gap * 2 * log T0 and the closed-form -1/u reference.
function rungAt(d) {
  const lnN = d * Math.LN10;
  const { u, L } = logT0FromLnN(lnN);
  const gap = HALF - pLocalFromLnN(lnN);
  const ratio = gap * 2 * L;
  return {
    N_log10: d,
    logT0: +L.toFixed(4),
    gap: +gap.toExponential(4),
    ratio: +ratio.toFixed(8),
    ratioMinus1: +(ratio - 1).toExponential(4),
    minusOneOverU: +(-1 / u).toExponential(4), // exact closed-form leading form
  };
}

// (F1) ratio ladder across the imp-33816 validation window 1e44..1e200.
const RATIO_LADDER = [44, 60, 80, 100, 150, 200].map(rungAt);

// (F2) two-basis LSQ fit of (ratio - 1) against {1/L, 1/L^2} over 1e44..1e300 (kept inside the
// finite-difference-reliable window so the O(1/L^2) coefficient is not swamped by pLocal noise).
function fitResidualCoeffs(ds) {
  let s11 = 0, s12 = 0, s22 = 0, b1 = 0, b2 = 0;
  for (const d of ds) {
    const lnN = d * Math.LN10;
    const { L } = logT0FromLnN(lnN);
    const y = (HALF - pLocalFromLnN(lnN)) * 2 * L - 1; // ratio - 1
    const x1 = 1 / L;
    const x2 = 1 / (L * L);
    s11 += x1 * x1; s12 += x1 * x2; s22 += x2 * x2; b1 += x1 * y; b2 += x2 * y;
  }
  const det = s11 * s22 - s12 * s12;
  const c1 = (b1 * s22 - b2 * s12) / det;
  const c2 = (s11 * b2 - s12 * b1) / det;
  let ss = 0;
  for (const d of ds) {
    const lnN = d * Math.LN10;
    const { L } = logT0FromLnN(lnN);
    const y = (HALF - pLocalFromLnN(lnN)) * 2 * L - 1;
    const pred = c1 / L + c2 / (L * L);
    ss += (y - pred) ** 2;
  }
  return { c1, c2, rms: Math.sqrt(ss / ds.length) };
}
const FIT = fitResidualCoeffs([44, 52, 60, 70, 80, 90, 100, 120, 150, 180, 220, 260, 300]);

export const IMP33944_GAP_LAW_SUBLEADING_CORRECTION = {
  id: 'imp-33944',
  proofSection: 'S-frontier',
  question:
    'Measure the next-order correction to the imp-33816 logarithmically-slow gap law ' +
    'gap(N) = 1/2 - p ~ 1/(2 log T0): does the ratio gap(N)*2*log T0 approach 1 from above or ' +
    'below, and at what rate, over 1e44..1e200? Tabulate ratio(N) from the exact log-space ' +
    'sub-terms, fit the residual (ratio - 1) against 1/log T0 and 1/(log T0)^2, and report the ' +
    'leading correction term and its sign. Measurement/fit only, NOT an RH bound; no QED.',
  measuredQuantity:
    'ratio(N) = gap(N) * 2 * log T0 across 1e44..1e200; its sign relative to 1; and the two-term ' +
    'fit (ratio - 1) = c1/log T0 + c2/(log T0)^2',
  ratioLadder: RATIO_LADDER,
  signOfApproach: 'from below (ratio < 1 at every rung; ratio - 1 < 0, rising monotonically to 0)',
  leadingCorrection: {
    term: '-1 / log T0',
    coefficient: -1,
    sign: 'negative',
    secondOrderTerm: '-(log 2pi) / (log T0)^2',
    secondOrderCoefficient: +(-LOG_TWO_PI).toFixed(4), // ~-1.8379
  },
  twoTermFit: {
    basis: '{1/log T0, 1/(log T0)^2}',
    window: '1e44..1e300',
    c1: +FIT.c1.toFixed(4), // ~-1.00 (matches exact -1)
    c2: +FIT.c2.toFixed(4), // ~-1.84 (matches exact -log 2pi)
    rmsResidual: +FIT.rms.toExponential(3), // ~1e-7, two-term fit essentially exact
  },
  closedForm: {
    form: 'ratio(N) = gap * 2 log T0 = 1 - 1 / (log T0 - log 2pi) = 1 - 1/u,  u = log(T0/2pi)',
    expansion: 'ratio - 1 = -1/log T0 - (log 2pi)/(log T0)^2 - (log 2pi)^2/(log T0)^3 - ...',
    note: 'u = log T0 - log 2pi > 0 so ratio < 1 always (approach from below); exact on the far ' +
      'tail where E_coll/E_trunc and E_flow are negligible.',
  },
  finding: {
    F1_from_below:
      'ratio(N) = gap * 2 log T0 is strictly LESS than 1 at every rung (ratio - 1 in ' +
      '{-1.03e-2 at 1e44, ..., -2.20e-3 at 1e200}) and rises monotonically toward 1. The ' +
      'imp-33816 -> 1.00 approach is one-sided, FROM BELOW.',
    F2_leading_correction_minus_one_over_logT0:
      'A two-basis LSQ fit of (ratio - 1) against {1/log T0, 1/(log T0)^2} over 1e44..1e300 ' +
      'returns c1 ~ -1.00 and c2 ~ -1.84, matching the closed-form coefficients (-1, -log 2pi) to ' +
      'the finite-difference floor (two-term RMS residual ~1e-7). The leading correction is ' +
      'NEGATIVE and O(1/log T0).',
    F3_exact_minus_one_over_u:
      'The full closed form ratio - 1 = -1/(log T0 - log 2pi) reproduces the measured (ratio - 1) ' +
      'to < 1e-3 relative at every rung -- the sub-leading correction is derived from the same ' +
      'inherited sub-terms, not merely fit.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-33816 gap-law validation ratio ' +
    'ratio(N) = gap(N) * 2 * log T0 approaches 1 FROM BELOW: ratio < 1 at every rung of 1e44..1e200 ' +
    '(ratio - 1 from -1.03e-2 at 1e44 to -2.20e-3 at 1e200), governed exactly by ' +
    'ratio = 1 - 1/(log T0 - log 2pi) = 1 - 1/u. The leading sub-leading correction is -1/log T0 ' +
    '(sign NEGATIVE, coefficient -1), the next -(log 2pi)/(log T0)^2 (coefficient -log 2pi ~ ' +
    '-1.8379); a two-basis LSQ fit recovers c1 ~ -1.00, c2 ~ -1.84 with ~1e-7 RMS residual. The ' +
    'correction decays only logarithmically, consistent with the imp-33816 F2 logarithmically-slow ' +
    'verdict. Sub-leading diagnostic of the inherited imp-3220/imp-3406 conditional-share model, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33816 (F2 gap law gap ~ 1/(2 log T0), ratio -> 1.00); imp-33859 (log-space direct path ' +
    'ln N = u + log(u - 1)); imp-33918 (companion g/law = L/(L+1) order-1 ratio); imp-3529 (LOCAL ' +
    'pointwise exponent p(N)); imp-3463 (far-tail leading form, exponent -> 1/2 from below); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP33944_GAP_LAW_SUBLEADING_CORRECTION_ASSERTIONS = [
  {
    // (F1): the ratio approaches 1 strictly FROM BELOW and monotonically over 1e44..1e200.
    id: 'imp33944-ratio-approaches-one-from-below',
    description: 'ratio = gap*2 log T0 is < 1 at every rung and rises monotonically toward 1',
    holds: () => {
      for (const r of RATIO_LADDER) {
        if (!(r.ratio < 1) || !(r.ratioMinus1 < 0)) return false;
      }
      for (let i = 1; i < RATIO_LADDER.length; i++) {
        if (!(RATIO_LADDER[i].ratio > RATIO_LADDER[i - 1].ratio)) return false;
      }
      return true;
    },
  },
  {
    // (F2): the two-basis fit recovers the leading coefficient c1 = -1 (negative correction).
    id: 'imp33944-leading-coefficient-minus-one',
    description: 'LSQ fit of (ratio - 1) vs {1/L, 1/L^2} gives c1 ~ -1 (leading correction -1/log T0, sign negative)',
    holds: () => FIT.c1 < 0 && Math.abs(FIT.c1 - -1) < 1e-2 && FIT.rms < 1e-5,
  },
  {
    // (F2): the second-order coefficient matches the exact -log 2pi to within fit noise.
    id: 'imp33944-second-coefficient-minus-log-2pi',
    description: 'LSQ second coefficient c2 ~ -log 2pi (~-1.838), the exact 1/(log T0)^2 term',
    holds: () => FIT.c2 < 0 && Math.abs(FIT.c2 - -LOG_TWO_PI) < 0.1,
  },
  {
    // (F3): the exact closed form -1/u = -1/(log T0 - log 2pi) reproduces (ratio - 1) at every rung.
    id: 'imp33944-closed-form-minus-one-over-u',
    description: 'ratio - 1 matches the closed form -1/(log T0 - log 2pi) to < 1e-3 relative at every rung',
    holds: () =>
      RATIO_LADDER.every((r) => Math.abs(r.ratioMinus1 / r.minusOneOverU - 1) < 1e-3),
  },
  {
    // Reuse gate: reproduce the imp-33816 GAP_LAW_CHECK ratio at N=1e44 (~0.9897) proving the
    // identical inherited model is in use before extracting the sub-leading correction.
    id: 'imp33944-reproduces-imp33816-gap-law-ratio',
    description: 'ratio at N=1e44 reproduces the imp-33816 gap-law-check value ~0.9897',
    holds: () => Math.abs(RATIO_LADDER[0].ratio - 0.9897) < 1e-3,
  },
  {
    // Honesty gate: measurement/fit only, no QED, no refereed bound is changed.
    id: 'imp33944-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33944_GAP_LAW_SUBLEADING_CORRECTION.isRigorous === false &&
      /NO QED/.test(IMP33944_GAP_LAW_SUBLEADING_CORRECTION.verdict) &&
      /refereed bound is changed/i.test(IMP33944_GAP_LAW_SUBLEADING_CORRECTION.verdict),
  },
];

for (const a of IMP33944_GAP_LAW_SUBLEADING_CORRECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33944-gap-law-subleading-correction assertion failed: ${a.id}`);
  }
}
