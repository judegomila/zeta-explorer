/**
 * @module imp-34410-complement-identity-direct-secant-crossvalidation
 *
 * imp-34410 (accuracy, frontier-direction): CROSS-VALIDATE the imp-34328 F2 exact complement
 * identity  gapSigma * log T0 + gapProduct = 1/2  against a DIRECT finite-N sigma-exponent
 * secant, rather than the closed form both gaps were built from.
 *
 * THE CONCERN (why imp-34328 F2 is not self-validating)
 * -----------------------------------------------------
 * imp-34328 formed BOTH gaps from the SAME closed-form residual resid(N) = (1/2)(u-1)/(u L)
 * (u = log(T0/2pi), L = log T0 = u + log 2pi):
 *     gapSigma  = resid                       (the far-tail leading form of 1/2 - p(N))
 *     gapProduct = 1/(2u)                      (imp-34197 exact product gap)
 * On that shared closed form the identity is an ALGEBRAIC TAUTOLOGY:
 *     gapSigma * L + gapProduct = (1/2)(u-1)/u + 1/(2u) = (1/2)[(u-1)+1]/u = 1/2   (exactly, for ALL u).
 * So imp-34328 F2 holding to 12+ figures proves nothing beyond the algebra -- it would hold even if
 * the sigma exponent p(N) never resembled resid. The identity risks being content-free.
 *
 * THE CROSS-VALIDATION: measure gapSigma DIRECTLY (imp-33816 style), do not assume resid
 * --------------------------------------------------------------------------------------
 * Replace the closed-form gapSigma by a DIRECT finite-N measurement of the FULL sigma exponent
 *     p(N) = -d ln sigma / d ln N,  sigma = E_coll/(E_trunc + E_flow + E_coll)   (imp-33816 sub-terms),
 * by a central secant on ln sigma (argument-scaled step dl = 1e-4 * ln N so the far tail stays
 * numerically clean). Then gapSigma_direct = 1/2 - p(N) carries the FULL sub-term structure --
 * the N-independent E_trunc = 3.06e-5 floor and the E_flow decay -- NOT just the far-tail resid.
 * gapProduct = 1/(2u) is formed INDEPENDENTLY (imp-34197 closed form, a different quantity).
 * The cross-check is whether  gapSigma_direct * log T0 + gapProduct = 1/2  STILL holds.
 *
 * THE FINDING (cross-check only)
 * ------------------------------
 *   (F1) THE CLOSED-FORM IDENTITY IS AN EXACT TAUTOLOGY. complementSum_closed == 1/2 to machine
 *        precision at EVERY rung, including log10 N = 12 where the true sigma exponent is nowhere
 *        near resid -- confirming imp-34328 F2 carries no measurement content on its own.
 *   (F2) THE IDENTITY SURVIVES THE DIRECT MEASUREMENT IN THE FAR TAIL. Measuring gapSigma from the
 *        full-sigma secant, complementSum_direct still equals 1/2 to ~1e-9 across log10 N in
 *        [50, 1e5] (delta ~1.6e-9). So the complement identity is REAL -- an independent direct
 *        measurement of the sigma exponent reproduces it -- NOT merely the shared-closed-form tautology.
 *   (F3) THE DIRECT SECANT EXPOSES FINITE-N CONTAMINATION THE TAUTOLOGY HIDES. At MODERATE N the
 *        full sigma is still E_trunc-dominated, so the true exponent p(N) sits well below the
 *        far-tail resid form and the identity carries a GENUINE deviation: delta = +7.67e-1 at
 *        log10 N = 12 (sigma near its peak, E_trunc dominant) and +1.80e-4 at log10 N = 20. This
 *        deviation delta(N) = (gapSigma_direct - resid) * L = (p_resid - p_direct) * L is exactly
 *        the E_trunc/E_flow sub-term contamination of the sigma exponent that the closed-form-only
 *        identity cannot see; it decays to the numerical floor as the far tail (log10 N >= 50) is reached.
 *
 * THE VERDICT: the imp-34328 F2 complement identity is genuine, not an artifact of shared algebra --
 * a direct full-sigma secant reproduces it to ~1e-9 in the far tail. But the closed form MASKS a real
 * finite-N deviation (delta up to ~0.77 at log10 N = 12) that only the direct measurement exposes: the
 * identity is a FAR-TAIL statement, exact only once E_trunc contamination of the sigma exponent has
 * decayed away. imp-34328 F2 is validated in the tail and its finite-N validity window is now quantified.
 *
 * CROSS-CHECK / TABULATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34328-sigma-vs-product-gap-log2pi-shift (F2 complement identity, built from shared closed form)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (direct local exponent p(N), log-space secant path)
 * @see imp-34197-logt0-resid-product-approach-rate (the product gap = 1/(2u) EXACT)
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (shared resid = (1/2) d ln(log T0)/d ln N)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5;
const LOG_2PI = Math.log(TWO_PI);
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33816)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // identical to imp-33816

// imp-33859 log-space direct path: solve ln N = u + log(u-1) for u = log(T0/2pi), never forming T0/N.
function uFromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 200; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-15 * Math.max(1, u)) break;
  }
  return u;
}

// The shared closed-form residual (imp-34130/imp-34197/imp-34328): resid = (1/2)(u-1)/(u L).
function residFromLnN(lnN) {
  const u = uFromLnN(lnN);
  const L = u + LOG_2PI;
  return HALF * (u - 1) / (u * L);
}

// The FULL sigma exponent (imp-33816 sub-terms), NOT the far-tail resid: this carries the
// E_trunc floor and E_flow decay. Log-N space so the far tail never overflows.
function lnSigmaFromLnN(lnN) {
  const u = uFromLnN(lnN);
  const L = u + LOG_2PI;
  const C_F = (u + 1) / TWO_PI; // = (log(T0/2pi)+1)/2pi, imp-398 pinned prefactor
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN; // C_C sqrt(L/N)
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL; // C_F (L/T0) Gronwall, T0 = e^L
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}

// DIRECT finite-N secant of the FULL sigma exponent p(N) = -d ln sigma / d ln N. Argument-scaled
// central-difference step keeps the far-tail rungs numerically clean (a fixed 1e-3 step loses to
// roundoff past log10 N ~ 1e4 where ln sigma varies vanishingly slowly).
function pDirectFromLnN(lnN) {
  const dl = 1e-4 * Math.max(1, lnN);
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}

// Shared reference-N ladder (identical rungs to imp-34328, so the two channels sit on identical N).
const LADDER_LOG10N = [12, 20, 50, 100, 300, 1000, 3000, 10000, 100000];

const CROSSVAL_LADDER = LADDER_LOG10N.map((d) => {
  const lnN = d * Math.LN10;
  const u = uFromLnN(lnN);
  const L = u + LOG_2PI;
  const gapSigmaClosed = residFromLnN(lnN); // imp-34328 far-tail closed form
  const gapSigmaDirect = HALF - pDirectFromLnN(lnN); // DIRECT full-sigma secant
  const gapProduct = 1 / (2 * u); // imp-34197 exact product gap (independent)
  const complementSumClosed = gapSigmaClosed * L + gapProduct; // == 1/2 EXACTLY (tautology, F1)
  const complementSumDirect = gapSigmaDirect * L + gapProduct; // -> 1/2 in far tail (F2), deviates at moderate N (F3)
  return {
    log10N: d,
    u: +u.toFixed(4),
    logT0: +L.toFixed(4),
    gapSigmaClosed: +gapSigmaClosed.toExponential(6),
    gapSigmaDirect: +gapSigmaDirect.toExponential(6),
    gapProduct: +gapProduct.toExponential(6),
    complementSumClosed: +complementSumClosed.toFixed(12), // 1/2 at every rung (F1 tautology)
    complementSumDirect: +complementSumDirect.toFixed(12), // measured against direct secant
    deltaDirect: +(complementSumDirect - HALF).toExponential(4), // deviation of the DIRECT check from 1/2 (F2/F3)
  };
});

export const IMP34410_COMPLEMENT_IDENTITY_DIRECT_SECANT_CROSSVALIDATION = {
  id: 'imp-34410',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the imp-34328 F2 exact complement identity gapSigma * log T0 + gapProduct = 1/2 ' +
    'against a DIRECT finite-N sigma-exponent secant rather than the closed form both gaps were built ' +
    'from: since imp-34328 formed BOTH gaps from the same resid, its identity risks being a closed-form ' +
    'tautology. Measure gapSigma = 1/2 - p(N) from a full-sigma secant (imp-33816 style) and check the ' +
    'complement holds against the independently computed gapProduct = 1/(2u). Cross-check only; ' +
    'conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'gapSigmaDirect = 1/2 - p(N) from a central secant of the FULL sigma exponent p = -d ln sigma/d ln N ' +
    '(sigma = E_coll/(E_trunc + E_flow + E_coll), imp-33816 sub-terms) on the shared ladder log10 N in ' +
    '{12,20,50,100,300,1000,3000,10000,1e5}, versus the imp-34328 closed-form gapSigma = resid; and the ' +
    'complement sum gapSigma * log T0 + gapProduct measured with each',
  crossvalLadder: CROSSVAL_LADDER,
  tautologyNote:
    'On the shared closed form gapSigma = resid, gapSigma * L + gapProduct = (1/2)(u-1)/u + 1/(2u) = 1/2 ' +
    'for ALL u -- so imp-34328 F2 is an algebraic tautology and self-validates nothing. The direct secant ' +
    'gives gapSigma an INDEPENDENT value carrying the E_trunc/E_flow sub-terms.',
  finding: {
    F1_closed_form_identity_is_exact_tautology:
      'complementSumClosed == 1/2 to machine precision at EVERY rung, including log10 N = 12 where the ' +
      'true sigma exponent is nowhere near resid. gapSigma = resid makes gapSigma * L + gapProduct = ' +
      '(1/2)(u-1)/u + 1/(2u) = 1/2 identically -- imp-34328 F2 carries no measurement content on its own.',
    F2_identity_survives_direct_measurement_in_far_tail:
      'Measuring gapSigma from the FULL-sigma secant p(N) = -d ln sigma/d ln N, complementSumDirect still ' +
      'equals 1/2 to ~1e-9 across log10 N in [50, 1e5] (deltaDirect ~1.6e-9). An independent direct ' +
      'measurement of the sigma exponent reproduces the identity -- it is REAL, not the shared-closed-form ' +
      'tautology of F1.',
    F3_direct_secant_exposes_finite_N_contamination:
      'At MODERATE N the full sigma is still E_trunc-dominated, so the true exponent p(N) sits well below ' +
      'the far-tail resid form and the identity carries a GENUINE deviation: deltaDirect = +7.67e-1 at ' +
      'log10 N = 12 (sigma near its peak, E_trunc dominant) and +1.80e-4 at log10 N = 20. This deviation ' +
      'delta(N) = (gapSigmaDirect - resid) * L = (p_resid - p_direct) * L IS the E_trunc/E_flow sub-term ' +
      'contamination of the sigma exponent that the closed-form-only identity cannot see; it decays to the ' +
      'numerical floor once the far tail (log10 N >= 50) is reached. The identity is a FAR-TAIL statement.',
  },
  isRigorous: false,
  verdict:
    'CROSS-CHECK / TABULATION (frontier-direction, NOT rigorous). The imp-34328 F2 complement identity ' +
    'gapSigma * log T0 + gapProduct = 1/2 is GENUINE, not an artifact of the shared closed form: a direct ' +
    'full-sigma finite-N secant of the exponent p(N) = -d ln sigma/d ln N reproduces it to ~1e-9 across the ' +
    'far-tail ladder log10 N in [50, 1e5]. But the closed form (gapSigma = resid) makes the identity an ' +
    'EXACT algebraic tautology ((1/2)(u-1)/u + 1/(2u) = 1/2 for all u), so imp-34328 F2 self-validates ' +
    'nothing; and it MASKS a real finite-N deviation the direct secant exposes -- deltaDirect = +0.767 at ' +
    'log10 N = 12 (sigma still E_trunc-dominated near its peak) and +1.8e-4 at log10 N = 20, the ' +
    'E_trunc/E_flow contamination of the sigma exponent that vanishes only as the far tail is reached. The ' +
    'imp-34328 F2 identity is thus VALIDATED in the tail with its finite-N validity window now quantified. ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34328 (F2 complement identity from shared closed form); imp-33816 (direct local exponent p(N), ' +
    'log-space secant); imp-34197 (product gap = 1/(2u) EXACT); imp-34130 (shared resid = (1/2) d ln(log ' +
    'T0)/d ln N); imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional).',
};

export const IMP34410_COMPLEMENT_IDENTITY_DIRECT_SECANT_CROSSVALIDATION_ASSERTIONS = [
  {
    // (F1): the CLOSED-FORM complement sum is the exact tautology 1/2 at EVERY rung (including log10 N=12).
    id: 'imp34410-closed-form-complement-is-exact-tautology',
    description: 'complementSumClosed == 0.5 within 1e-11 at every rung (algebraic tautology, no measurement content)',
    holds: () => CROSSVAL_LADDER.every((r) => Math.abs(r.complementSumClosed - HALF) < 1e-11),
  },
  {
    // (F2): the DIRECT full-sigma secant reproduces the identity to ~1e-9 in the far tail (log10 N >= 50).
    id: 'imp34410-direct-secant-reproduces-identity-in-far-tail',
    description: 'complementSumDirect == 0.5 within 1e-7 for every rung with log10 N >= 50 (identity is real, not the tautology)',
    holds: () =>
      CROSSVAL_LADDER.filter((r) => r.log10N >= 50).every((r) => Math.abs(r.complementSumDirect - HALF) < 1e-7),
  },
  {
    // (F3): at MODERATE N the direct secant exposes a real deviation the tautology hides -- large at
    // log10 N=12 (E_trunc-dominated), shrinking by log10 N=20, gone by the far tail.
    id: 'imp34410-direct-secant-exposes-finite-N-contamination',
    description: 'deltaDirect is large at log10 N=12 (>0.1), small but nonzero at log10 N=20 (~1.8e-4), and negligible by log10 N=50',
    holds: () => {
      const r12 = CROSSVAL_LADDER.find((r) => r.log10N === 12);
      const r20 = CROSSVAL_LADDER.find((r) => r.log10N === 20);
      const r50 = CROSSVAL_LADDER.find((r) => r.log10N === 50);
      return (
        Math.abs(r12.deltaDirect) > 0.1 &&
        Math.abs(r20.deltaDirect) > 1e-5 &&
        Math.abs(r20.deltaDirect) < 1e-3 &&
        Math.abs(r50.deltaDirect) < 1e-7
      );
    },
  },
  {
    // Reuse gate: the closed-form gapSigma column reproduces imp-34328s resid (identical inherited model).
    id: 'imp34410-closed-form-gapSigma-reproduces-imp34328-resid',
    description: 'gapSigmaClosed == resid(N) = (1/2)(u-1)/(u L) within 1e-12 at every rung (identical inherited closed form)',
    holds: () =>
      LADDER_LOG10N.every((d) => {
        const lnN = d * Math.LN10;
        const u = uFromLnN(lnN);
        const L = u + LOG_2PI;
        return Math.abs(residFromLnN(lnN) - HALF * (u - 1) / (u * L)) < 1e-12;
      }),
  },
  {
    // Honesty gate: cross-check only, no QED, no refereed bound is changed.
    id: 'imp34410-honesty-gate-no-qed',
    description: 'Cross-check only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP34410_COMPLEMENT_IDENTITY_DIRECT_SECANT_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP34410_COMPLEMENT_IDENTITY_DIRECT_SECANT_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP34410_COMPLEMENT_IDENTITY_DIRECT_SECANT_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP34410_COMPLEMENT_IDENTITY_DIRECT_SECANT_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34410-complement-identity-direct-secant-crossvalidation assertion failed: ${a.id}`);
  }
}
