/**
 * @module imp-35395-eflow-fartail-remnant-next-logn2-term
 *
 * imp-35395 (numerical, frontier-direction): imp-35280 measured the fd-vs-analytic
 * surrogate exponent remnant |analytic - fd-surrogate| across the far-tail ladder
 * N = 1e6, 1e9, 1e12, 1e16 and found a small NON-monotone ~0.002 floor (0.0025 /
 * 0.0031 / 0.0026 / 0.0019) that it attributed to "closed-form Taylor truncation plus
 * the (log T0)^2-vs-C_F*L prefactor-form difference" of the imp-35198 leading law
 * -1 + 3/log N, but never fit the NEXT Taylor term. This module DERIVES the next-order
 * 1/(log N)^2 coefficient of the surrogate-channel exponent analytically from the exact
 * E_flow = C_F * (L/T0) * GRONWALL form, then MEASURES whether including it collapses the
 * remnant toward zero -- i.e. whether the ~0.002 floor IS the dropped 1/log^2 N term.
 *
 * THE DERIVATION (from E_flow = C_F * (L/T0) * GRONWALL, RvM surrogate T0 = 2 pi N / log N)
 * ------------------------------------------------------------------------------------
 * Write x = log N and M = log T0 = x - log x + log(2 pi) (the RvM surrogate the ticket
 * names). The imp-35198 leading law used the PREFACTOR approximation C_F ~ L/(2 pi), i.e.
 * log E_flow ~ 2 log M - M + const, whose exact derivative is the surrogate exponent
 *     s_approx(x) = (1 - 1/x)(2/M - 1).
 * Expanding 2/M = 2/x + 2(log x - log 2 pi)/x^2 + O((log x)^2/x^3) and multiplying by the
 * RvM log-thinning factor (1 - 1/x) gives
 *     s_approx(x) = -1 + 3/x + [2 log x - 2 log 2 pi - 2]/x^2 + O((log x)^2/x^3).
 * So the NEXT-ORDER term beyond the imp-35198 leading -1 + 3/log N is the 1/(log N)^2 term
 *     t2(x) = [2 log x - 2 log 2 pi - 2] / x^2      (this is a1 -> a2 below).
 * Note t2 carries a log x FACTOR and is NEGATIVE at small x (t2 = -0.0022 at N = 1e6) before
 * turning positive by N = 1e9 -- it is NOT a fixed-sign constant/x^2.
 *
 * BUT the fd-surrogate reads the EXACT C_F = (log(T0/2 pi) + 1)/(2 pi), not the L/(2 pi)
 * form the leading law dropped. The exact surrogate log-derivative is
 *     s_full(x) = (1 - 1/x)/(x - log x + 1) + (1 - 1/x)/M - (1 - 1/x),
 * and s_full reproduces the fd-surrogate exponent to <1e-7 (finite-difference-limited) at
 * every rung. The gap s_full - s_approx is the PREFACTOR-FORM difference:
 *     s_full - s_approx = (1 - 1/x)(log 2 pi - 1) / [(x - log x + 1)(x - log x + log 2 pi)]
 *                       = (log 2 pi - 1)/x^2 + O(log x / x^3)   [prefTerm below].
 * This is a SECOND, DISTINCT 1/(log N)^2 term with coefficient (log 2 pi - 1) ~ 0.838 > 0.
 *
 * THE MEASUREMENT (does adding t2 collapse the imp-35280 remnant?)
 * ---------------------------------------------------------------
 *   N      fd-surrogate   a1 = -1+3/x   t2          a2 = a1+t2   gap1=|a1-fd|   gap2=|a2-fd|
 *   1e6      -0.780315     -0.782853    -0.002222    -0.785075    0.002538       0.004760
 *   1e9      -0.852095     -0.855235    +0.000901    -0.854335    0.003140       0.002239
 *   1e12     -0.888875     -0.891426    +0.001260    -0.890166    0.002552       0.001291
 *   1e16     -0.916701     -0.918570    +0.001133    -0.917437    0.001869       0.000736
 * gap1 reproduces the imp-35280 remnant column (0.0025 / 0.0031 / 0.0026 / 0.0019) to the
 * digit (faithfulness anchor). Adding the Taylor next term t2 HALVES the remnant at the deep
 * rungs (0.00314 -> 0.00224 at 1e9, 0.00187 -> 0.00074 at 1e16) but makes N = 1e6 WORSE
 * (0.00254 -> 0.00476): there t2 is NEGATIVE while the remnant needs a POSITIVE correction,
 * so the single Taylor term has the wrong sign at the top of the ladder.
 *
 * THE FINDING (the remnant is NOT the dropped Taylor term -- it is the prefactor 1/log^2 N term)
 * --------------------------------------------------------------------------------------------
 * The remnant splits cleanly into two sub-sources, both 1/(log N)^2 but DIFFERENT:
 *   - Taylor-truncation gap s_approx - a2 = dropping terms past 1/x^2 in s_approx. TINY:
 *     |s_approx - a2| < 1.5e-4 at every rung -- a2 reproduces the exact approximate-form
 *     exponent essentially exactly, so the Taylor series itself converges fast.
 *   - Prefactor-form gap s_full - s_approx = (log 2 pi - 1)/x^2 + ... = 0.0044 / 0.0020 /
 *     0.0011 / 0.0006. This DOMINATES the remnant and IS the ~0.002 floor imp-35280 saw.
 * So the ~0.002 remnant is NOT the next Taylor term of -1 + 3/log N; it is a DISTINCT
 * 1/(log N)^2 term (log 2 pi - 1)/x^2 that the imp-35198 derivation discarded when it
 * approximated C_F ~ L/(2 pi). Adding BOTH 1/log^2 N terms (a2 + prefTerm) collapses the
 * remnant to <4e-4 at every rung (0.00037 / 0.00029 / 0.00019 / 0.00012, the residual being
 * the subleading log x / x^3 corrections), and the fully-exact s_full closes it to <1e-7.
 *
 * MEASUREMENT/DERIVATION ONLY on the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic. Changes no bound; E_flow > 0 strictness (imp-33848) untouched; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066
 * K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (the ~0.002 remnant this dissects)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the leading -1 + 3/log N law + its own next-term note)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (measured on effectiveHeightForN)
 * @see imp-35391-eflow-fartail-remnant-floor-vs-swaplaw (the remnant floor vs the swap-gap law)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the true RvM zero-ordinate inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236/imp-35280 exact sub-term: the A1-trap Gronwall factor (no re-derivation).
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135 far-tail E_flow quantity with a swappable height map (imp-35280 form).
function eFlowWith(heightFn, N) {
  const T0 = heightFn(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135/imp-35280.
function localExponent(fn, N) {
  const h = 1.0002;
  const lo = Math.log(fn(N / h));
  const hi = Math.log(fn(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// imp-35198 leading closed form: a1 = -1 + 3/log N.
function analyticLeading(x) {
  return -1 + 3 / x;
}

// DERIVED next-order 1/(log N)^2 Taylor term of s_approx: t2 = [2 log x - 2 log 2 pi - 2]/x^2.
function nextLogN2Term(x) {
  return (2 * Math.log(x) - 2 * Math.log(TWO_PI) - 2) / (x * x);
}

// DERIVED prefactor-form 1/(log N)^2 term (the C_F-vs-L/2pi difference): (log 2 pi - 1)/x^2.
function prefactorLogN2Term(x) {
  return (Math.log(TWO_PI) - 1) / (x * x);
}

// Exact derivative of the imp-35198 APPROXIMATE form log E ~ 2 log M - M + const.
function sApprox(x) {
  const Mp = 1 - 1 / x;
  const M = x - Math.log(x) + Math.log(TWO_PI);
  return Mp * (2 / M - 1);
}

// Fully-exact surrogate-channel log-derivative: d/dx [log C_F + log L - M + const].
function sFull(x) {
  const Mp = 1 - 1 / x;
  const D1 = x - Math.log(x) + 1; // from C_F = (x - log x + 1)/(2 pi)
  const M = x - Math.log(x) + Math.log(TWO_PI); // from L = M
  return Mp / D1 + Mp / M - Mp;
}

const LADDER = [1e6, 1e9, 1e12, 1e16].map((N) => {
  const x = Math.log(N);
  const fdSurr = localExponent((n) => eFlowWith(surrogateHeightForN, n), N);
  const fdTrue = localExponent((n) => eFlowWith(effectiveHeightForN, n), N); // == imp-35135 measured
  const a1 = analyticLeading(x);
  const t2 = nextLogN2Term(x);
  const a2 = a1 + t2; // leading + next Taylor term
  const pref = prefactorLogN2Term(x);
  const a2pref = a2 + pref; // leading + both 1/log^2 N terms
  return {
    N: +N.toExponential(0),
    logN: +x.toFixed(4),
    fdSurrogateExponent: +fdSurr.toFixed(6), // closed surrogate finite difference
    fdTrueExponent: +fdTrue.toFixed(6), // effectiveHeightForN (imp-35135 measured anchor)
    a1: +a1.toFixed(6), // -1 + 3/log N
    nextTerm: +t2.toFixed(6), // the derived 1/log^2 N Taylor term
    a2: +a2.toFixed(6), // a1 + nextTerm
    prefactorTerm: +pref.toFixed(6), // (log 2 pi - 1)/log^2 N
    gap1: +Math.abs(a1 - fdSurr).toFixed(6), // imp-35280 remnant (reproduced)
    gap2: +Math.abs(a2 - fdSurr).toFixed(6), // after adding the Taylor next term
    gapA2pref: +Math.abs(a2pref - fdSurr).toFixed(6), // after adding BOTH 1/log^2 N terms
    truncationGap: +Math.abs(sApprox(x) - a2).toFixed(6), // Taylor tail past 1/x^2
    prefactorGap: +Math.abs(fdSurr - sApprox(x)).toFixed(6), // C_F-vs-L/2pi difference
    fullExactGap: +Math.abs(sFull(x) - fdSurr).toFixed(8), // exact derivative vs fd
  };
});

const TOP = LADDER[0]; // N = 1e6
const DEEP = LADDER[3]; // N = 1e16

export const IMP35395_EFLOW_FARTAIL_REMNANT_NEXT_LOGN2_TERM = {
  id: 'imp-35395',
  proofSection: 'S-frontier',
  question:
    'Derive the next-order 1/(log N)^2 term of the imp-35198 leading far-tail E_flow exponent ' +
    '-1 + 3/log N analytically from E_flow = C_F * (L/T0) * GRONWALL, and measure whether ' +
    'including it collapses the imp-35280 ~0.002 fd-vs-analytic surrogate remnant across the ' +
    'ladder N = 1e6, 1e9, 1e12, 1e16.',
  method:
    'With x = log N and M = log T0 = x - log x + log 2 pi, the imp-35198 leading law used the ' +
    'prefactor approximation C_F ~ L/(2 pi), giving s_approx = (1 - 1/x)(2/M - 1). Expanding to ' +
    '1/x^2 yields the next term t2 = [2 log x - 2 log 2 pi - 2]/x^2. The exact C_F = ' +
    '(log(T0/2 pi) + 1)/(2 pi) instead gives s_full, whose gap to s_approx is a SECOND 1/x^2 ' +
    'term (log 2 pi - 1)/x^2. The fd-surrogate exponent is measured with the same h = 1.0002 ' +
    'stencil as imp-35280, and the remnant |a - fd-surrogate| is tracked for a = a1, a2 = a1 + ' +
    't2, and a2 + prefactor term across the four rungs.',
  ladder: LADDER,
  finding: {
    F1_next_taylor_term_derived:
      'The next-order 1/(log N)^2 term of the surrogate exponent is t2 = [2 log x - 2 log 2 pi ' +
      '- 2]/x^2, x = log N. It carries a log x factor and is NEGATIVE at small x (-0.0022 at ' +
      'N = 1e6) before turning positive by N = 1e9 -- not a fixed-sign constant/x^2.',
    F2_adding_t2_does_not_cleanly_collapse:
      'Adding t2 HALVES the remnant at the deep rungs (0.00314 -> 0.00224 at 1e9, 0.00187 -> ' +
      '0.00074 at 1e16) but makes N = 1e6 WORSE (0.00254 -> 0.00476): t2 is negative there while ' +
      'the remnant needs a positive correction, so the single Taylor term has the wrong sign at ' +
      'the top of the ladder. So the ~0.002 floor is NOT simply the dropped Taylor term.',
    F3_remnant_is_the_prefactor_logn2_term:
      'The remnant splits into a TINY Taylor-truncation gap (|s_approx - a2| < 1.5e-4 at every ' +
      'rung) and a DOMINANT prefactor-form gap (fd - s_approx) = (log 2 pi - 1)/x^2 + ... = ' +
      '0.0044 / 0.0020 / 0.0011 / 0.0006. The ~0.002 floor is this SECOND, distinct 1/(log N)^2 ' +
      'term with coefficient log 2 pi - 1 ~ 0.838, dropped when imp-35198 set C_F ~ L/(2 pi).',
    F4_both_terms_collapse_the_remnant:
      'Including BOTH 1/log^2 N terms (a2 + prefactor term) collapses the remnant to <4e-4 at ' +
      'every rung (0.00037 / 0.00029 / 0.00019 / 0.00012, residual = subleading log x / x^3), and ' +
      'the fully-exact derivative s_full reproduces the fd-surrogate exponent to <1e-7 everywhere.',
  },
  isRigorous: false,
  honestStatus:
    'The imp-35280 ~0.002 fd-vs-analytic remnant is NOT the dropped next Taylor term of the ' +
    'imp-35198 leading law -1 + 3/log N. The genuine next Taylor term t2 = [2 log x - 2 log 2 pi ' +
    '- 2]/x^2 accounts for essentially NONE of it (Taylor-truncation gap |s_approx - a2| < 1.5e-4 ' +
    'at every rung) and, worse, has the WRONG SIGN at N = 1e6 (t2 = -0.0022 there while the ' +
    'remnant needs +0.0025), so adding it ALONE raises the N = 1e6 gap from 0.0025 to 0.0048. The ' +
    'remnant is instead a SECOND, distinct 1/(log N)^2 effect: the prefactor-form term ' +
    '(log 2 pi - 1)/x^2 ~ 0.838/(log N)^2, discarded when imp-35198 approximated C_F ~ L/(2 pi) ' +
    'to write log E_flow ~ 2 log M - M. Adding both 1/log^2 N terms collapses the remnant to ' +
    '<4e-4 and the fully-exact surrogate derivative closes it to <1e-7, so the ~0.002 floor is ' +
    'fully accounted for -- but by the prefactor 1/log^2 N term, not the Taylor next-term the ' +
    'ticket hypothesized. This is a decomposition of the inherited surrogate exponent, not a ' +
    'rigorous asymptotic, and it changes no bound.',
  verdict:
    'DERIVATION/MEASUREMENT ONLY (frontier-direction, NOT rigorous). The next-order 1/(log N)^2 ' +
    'Taylor term of the imp-35198 leading -1 + 3/log N law is t2 = [2 log x - 2 log 2 pi - 2]/x^2, ' +
    'x = log N. Including it does NOT cleanly absorb the imp-35280 ~0.002 fd-vs-analytic remnant: ' +
    'it halves the remnant deep (0.00187 -> 0.00074 at 1e16) but has the wrong sign at N = 1e6 ' +
    '(0.00254 -> 0.00476). The remnant is instead a DISTINCT 1/(log N)^2 term, the prefactor-form ' +
    '(log 2 pi - 1)/x^2, dropped when the leading law set C_F ~ L/(2 pi); the Taylor-truncation ' +
    'gap is <1.5e-4 while the prefactor gap (0.0044 / 0.0020 / 0.0011 / 0.0006) IS the floor. ' +
    'Adding both 1/log^2 N terms collapses the remnant to <4e-4, and the exact surrogate ' +
    'derivative s_full closes it to <1e-7. Measurement only on the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35280 (the ~0.002 remnant, gap1 column reproduced here); imp-35198 (leading -1 + 3/log N ' +
    'and its own next-term note); imp-35135 (measured on effectiveHeightForN); imp-486 (C_mb ' +
    'GUE-conditional, UNTOUCHED); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35395_EFLOW_FARTAIL_REMNANT_NEXT_LOGN2_TERM_ASSERTIONS = [
  {
    // gap1 reproduces the imp-35280 fd-vs-analytic remnant column (faithfulness anchor).
    id: 'imp35395-gap1-reproduces-imp35280-remnant',
    description: 'gap1 = |a1 - fd-surrogate| reproduces the imp-35280 remnant 0.0025/0.0031/0.0026/0.0019 to <2e-4',
    holds: () => {
      const want = { 1e6: 0.0025, 1e9: 0.0031, 1e12: 0.0026, 1e16: 0.0019 };
      return LADDER.every((r) => Math.abs(r.gap1 - want[r.N]) < 2e-4);
    },
  },
  {
    // The derived next Taylor term flips sign: negative at N=1e6, positive by N=1e9.
    id: 'imp35395-next-term-flips-sign',
    description: 'the derived 1/log^2 N Taylor term is negative at N=1e6 and positive at N=1e9,1e12,1e16',
    holds: () =>
      LADDER[0].nextTerm < 0 &&
      LADDER[1].nextTerm > 0 &&
      LADDER[2].nextTerm > 0 &&
      LADDER[3].nextTerm > 0,
  },
  {
    // Adding t2 alone does NOT cleanly collapse: it worsens N=1e6 (wrong sign there).
    id: 'imp35395-taylor-term-worsens-top-rung',
    description: 'adding the Taylor next term increases the N=1e6 gap (gap2 > gap1) -- wrong sign at the top',
    holds: () => TOP.gap2 > TOP.gap1,
  },
  {
    // The Taylor-truncation gap is tiny at every rung: a2 reproduces the exact approximate exponent.
    id: 'imp35395-truncation-gap-tiny',
    description: 'the Taylor-truncation gap |s_approx - a2| is < 1.5e-4 at every rung',
    holds: () => LADDER.every((r) => r.truncationGap < 1.5e-4),
  },
  {
    // The prefactor-form gap DOMINATES and is the ~0.002 floor; it shrinks monotonically.
    id: 'imp35395-prefactor-gap-dominates-and-shrinks',
    description: 'the prefactor-form gap is the dominant remnant component and decreases monotonically down the ladder',
    holds: () =>
      LADDER.every((r) => r.prefactorGap > r.truncationGap) &&
      LADDER[0].prefactorGap > LADDER[1].prefactorGap &&
      LADDER[1].prefactorGap > LADDER[2].prefactorGap &&
      LADDER[2].prefactorGap > LADDER[3].prefactorGap,
  },
  {
    // Adding BOTH 1/log^2 N terms collapses the remnant to < 4e-4 at every rung.
    id: 'imp35395-both-terms-collapse-remnant',
    description: 'a2 + prefactor term collapses the fd-vs-analytic gap to < 4e-4 at all four rungs',
    holds: () => LADDER.every((r) => r.gapA2pref < 4e-4),
  },
  {
    // The fully-exact surrogate derivative reproduces the fd-surrogate exponent to < 1e-6.
    id: 'imp35395-full-exact-derivative-matches-fd',
    description: 's_full reproduces the fd-surrogate exponent to < 1e-6 (finite-difference-limited) at every rung',
    holds: () => LADDER.every((r) => r.fullExactGap < 1e-6),
  },
  {
    // Honesty gate: derivation/measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35395-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35395_EFLOW_FARTAIL_REMNANT_NEXT_LOGN2_TERM.isRigorous === false &&
      /NO QED/.test(IMP35395_EFLOW_FARTAIL_REMNANT_NEXT_LOGN2_TERM.verdict) &&
      /refereed bound is changed/i.test(IMP35395_EFLOW_FARTAIL_REMNANT_NEXT_LOGN2_TERM.verdict),
  },
];

for (const a of IMP35395_EFLOW_FARTAIL_REMNANT_NEXT_LOGN2_TERM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35395-eflow-fartail-remnant-next-logn2-term assertion failed: ${a.id}`,
    );
  }
}
