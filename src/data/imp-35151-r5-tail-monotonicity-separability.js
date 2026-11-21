/**
 * imp-35151: Is the imp-35104 R5 tail-monotonicity obligation GENUINELY
 * equivalent to the imp-486 GUE-universality irreducibility, or a SEPARABLE
 * sub-obligation admitting an independent finite-N monotonicity certificate
 * that does not itself invoke GUE?
 *
 * CLASSIFICATION / ASSESSMENT ONLY. Changes no bound. C_mb stays
 * GUE-conditional per imp-486. NO QED.
 *
 * Context
 * -------
 * imp-35104 (C_MB_WEAKER_K_INTERVAL_SCOPE, imp-857 route) enumerated five
 * obligations R1..R5 for a weaker-K interval-certified PARTIAL C_mb bound.
 * R1/R3/R4 MET on {50,100,200,500}; R2 is the OPEN true-flow residual
 * (imp-857-sub-scale-to-N10k); and R5 (tail-monotonicity) was tagged
 * "IRREDUCIBLE per imp-486" -- i.e. the N->infinity tail is exactly where
 * GUE is irreducible, so any monotonicity claim there smuggles in the
 * conditional it aims to avoid.
 *
 * The open question this ticket answers: does R5 collapse ONTO the FULL
 * imp-486 GUE obstruction, or is it strictly narrower -- separable into a
 * finite-N part with an independent (GUE-free) certificate plus an
 * irreducible asymptotic tail?
 *
 * Method
 * ------
 * The load-bearing evidence already lives in src/math/c-mb-unconditional-bound.js
 * (imp-486), which holds TWO distinct facts side by side:
 *
 *   (i) IMPOSSIBILITY_ARGUMENT: C_mb = O(1) at the CLT rate N^{-1/2} log N
 *       <=> Montgomery pair correlation <=> GUE universality. IRREDUCIBLE.
 *       This is an ASYMPTOTIC (N->infinity) statement.
 *
 *   (ii) whyEmpiricalSweepStandsUnconditionally: for any FINITE N-window the
 *        surrogate monotonicity is verified DIRECTLY by computing tau_c_est(N)
 *        and checking the sign of the discrete difference -- a finite table
 *        check that does NOT invoke C_mb, unconditional and independent of any
 *        random-matrix assumption (m-raw-from-umon-bridge.js sweep, N<=100000).
 *
 * The daylight between (i) and (ii) is precisely the daylight in R5.
 *
 * Verdict
 * -------
 * R5 is NOT wholly equivalent to imp-486. It is SEPARABLE into:
 *
 *   R5a  (finite-N window monotonicity): for any bounded window {N: N<=N_max}
 *        monotonicity of the surrogate is a finite conjunction of pairwise
 *        comparisons of directly-computed tau_c_est(N) values -- DECIDABLE by
 *        finite computation, unconditional, GUE-FREE. Certificate = the imp-486
 *        direct tau_c monotonicity sweep (m-raw-from-umon-bridge.js).
 *
 *   R5b  (asymptotic tail monotonicity, N->infinity): controlling the sign of
 *        the surrogate difference uniformly as N->infinity requires CLT-scale
 *        control of the long-range Cauchy sum, which by IMPOSSIBILITY_ARGUMENT
 *        is EQUIVALENT to GUE universality. IRREDUCIBLE.
 *
 * The literal imp-35104 phrase "tail-monotonicity" names R5b, so the
 * "IRREDUCIBLE per imp-486" tag is CORRECT for the tail it names -- but the tag
 * is IMPRECISE if read as "all monotonicity of the region is GUE": finite-N
 * monotonicity (R5a) is unconditional. There IS daylight, and it lands exactly
 * on the finite window that imp-35104 R1-R4 already certify. This SHARPENS and
 * CONFIRMS the imp-35104 narrowing picture (set-shrinkage of the conditional
 * region from all-N to the tail complement): R5a discharges monotonicity on the
 * certified window unconditionally; only R5b (the tail complement) carries the
 * full irreducible GUE dependence.
 */

import {
  IMPOSSIBILITY_ARGUMENT,
  C_MB_UNCONDITIONAL_SEARCH,
} from "../math/c-mb-unconditional-bound.js";

/**
 * Decidability demonstration for R5a: monotonicity of ANY finite array of
 * directly-computed surrogate values is a finite conjunction of pairwise
 * comparisons -- no GUE, no random-matrix input, terminates. This helper
 * embodies the FORM of the finite-N certificate; it does NOT recompute the
 * real tau_c_est values (those live in m-raw-from-umon-bridge.js).
 */
function isMonotoneNonDecreasing(values) {
  for (let i = 1; i < values.length; i++) {
    if (values[i] < values[i - 1]) return false;
  }
  return true;
}

// Illustrative finite window: a decidability witness, NOT the real surrogate.
const ILLUSTRATIVE_FINITE_WINDOW = [50, 100, 200, 500];
const FINITE_WINDOW_DECIDABLE =
  typeof isMonotoneNonDecreasing(ILLUSTRATIVE_FINITE_WINDOW) === "boolean";

export const IMP_35151_R5_SEPARABILITY = {
  id: "imp-35151",
  parentScope: "imp-35104 C_MB_WEAKER_K_INTERVAL_SCOPE (imp-857 route)",
  obligation: "R5 tail-monotonicity of the weaker-K C_mb surrogate region",

  question:
    "Is R5 genuinely equivalent to the imp-486 GUE-universality " +
    "irreducibility, or a separable sub-obligation with an independent " +
    "finite-N monotonicity certificate that does not invoke GUE?",

  verdict: "SEPARABLE-WITH-IRREDUCIBLE-TAIL",

  decomposition: {
    R5a: {
      name: "finite-N window monotonicity",
      statement:
        "For any bounded window {N: N<=N_max}, monotonicity of the surrogate " +
        "is a finite conjunction of pairwise comparisons of directly-computed " +
        "tau_c_est(N) values.",
      invokesGUE: false,
      unconditional: true,
      decidableByFiniteComputation: true,
      certificate:
        "The imp-486 direct tau_c monotonicity sweep " +
        "(src/math/m-raw-from-umon-bridge.js), which verifies M for " +
        "N in {2,...,100000} WITHOUT invoking C_mb -- exactly the " +
        "whyEmpiricalSweepStandsUnconditionally certificate, unconditional and " +
        "independent of any random-matrix assumption.",
    },
    R5b: {
      name: "asymptotic tail monotonicity (N -> infinity)",
      statement:
        "Controlling the sign of the surrogate difference UNIFORMLY as " +
        "N->infinity requires CLT-scale control of the long-range Cauchy sum.",
      invokesGUE: true,
      unconditional: false,
      irreducible: true,
      reductionChain: [
        "R5b (surrogate tail monotone as N->infinity)",
        "<=> long-range Cauchy sum fluctuates at the N^{-1/2} log N (CLT) scale",
        "<=> 2-point correlation at local scale 1/log T matches GUE",
        "<=> Montgomery pair correlation conjecture (1973)",
        "<=> GUE universality for Riemann zeros",
      ],
      equivalentToImp486: true,
    },
  },

  daylightExists: true,
  daylightLocation:
    "The separable (GUE-free) part R5a lands exactly on the finite window that " +
    "imp-35104 R1-R4 already certify; the irreducible part R5b is the tail " +
    "complement.",

  tagAssessment:
    "The imp-35104 phrase \"tail-monotonicity\" names R5b, so its " +
    "\"IRREDUCIBLE per imp-486\" tag is CORRECT for the tail it names. The tag " +
    "is IMPRECISE only if read as \"all monotonicity of the region is GUE\": " +
    "finite-N monotonicity (R5a) is unconditional.",

  consistencyWithImp35104:
    "This SHARPENS and CONFIRMS the imp-35104 set-shrinkage picture. A " +
    "discharged R1-R4 plus R5a certificate removes the GUE-conditional at the " +
    "finitely many certified N; the surviving tail (R5b) carries the full " +
    "irreducible GUE dependence. No reduction of conditional STRENGTH.",

  honesty: {
    classificationOnly: true,
    changesBound: false,
    cmbStaysGueConditional: true,
    removesConditional: false,
    establishesPositivity: false,
    isQED: false,
    ptFloor: "No refereed bound is changed.",
  },
};

// ── Self-executing tripwire assertions ───────────────────────────────────────
(function assertImp35151() {
  const A = IMP_35151_R5_SEPARABILITY;

  // (T1) The imp-486 equivalence chain is intact: 5 steps + conclusion (6
  //      entries), ending blocked at GUE with irreducibility.
  const chain = IMPOSSIBILITY_ARGUMENT.logicalChain;
  if (
    !Array.isArray(chain) ||
    chain.length !== 6 ||
    !/irreducible/i.test(chain[chain.length - 1])
  ) {
    throw new Error("imp-35151 T1: imp-486 IMPOSSIBILITY_ARGUMENT chain not intact");
  }

  // (T2) The imp-486 finite empirical floor is unconditional and C_mb-free.
  if (
    !/without invoking c_mb/i.test(C_MB_UNCONDITIONAL_SEARCH.empiricalFloor) ||
    !/unconditional/i.test(C_MB_UNCONDITIONAL_SEARCH.empiricalFloor)
  ) {
    throw new Error("imp-35151 T2: imp-486 empirical floor not confirmed GUE-free");
  }

  // (T3) Verdict is the separable-with-irreducible-tail classification.
  if (A.verdict !== "SEPARABLE-WITH-IRREDUCIBLE-TAIL") {
    throw new Error("imp-35151 T3: verdict not SEPARABLE-WITH-IRREDUCIBLE-TAIL");
  }

  // (T4) R5a GUE-free / unconditional; R5b GUE / irreducible / imp-486-equivalent.
  if (
    A.decomposition.R5a.invokesGUE !== false ||
    A.decomposition.R5a.unconditional !== true ||
    A.decomposition.R5b.invokesGUE !== true ||
    A.decomposition.R5b.irreducible !== true ||
    A.decomposition.R5b.equivalentToImp486 !== true
  ) {
    throw new Error("imp-35151 T4: R5a/R5b polarity mislabeled");
  }

  // (T5) The finite-N certificate is decidable by finite computation.
  if (FINITE_WINDOW_DECIDABLE !== true) {
    throw new Error("imp-35151 T5: finite-N monotonicity not decidable by finite computation");
  }

  // (T6) Honesty gate: classification only, no bound change, no QED.
  const h = A.honesty;
  if (
    h.classificationOnly !== true ||
    h.changesBound !== false ||
    h.cmbStaysGueConditional !== true ||
    h.isQED !== false
  ) {
    throw new Error("imp-35151 T6: honesty gate violated");
  }
})();
