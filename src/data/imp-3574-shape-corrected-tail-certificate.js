/**
 * @module imp-3574-shape-corrected-tail-certificate
 * @fileoverview imp-3574 -- DERIVE and MEASURE a residual-SHAPE-corrected tail
 *   certificate that REPLACES the imp-3552 loose cosh(a T_A) inflation constant with an
 *   S_n(a)-aware factor, and quantifies how much it SHRINKS the ~10x over-estimation the
 *   imp-3552 cosh bound carries at a = 0.5.
 *
 *   WHERE IMP-3552 STOPPED
 *   ----------------------
 *   imp-3532 promoted the imp-3501 moment-tail residual to the closed SHARP certificate
 *       |E_n(a)|  <=  L_n(a) cosh(a T_A),      L_n(a) := (a^(n+2)/(n+2)!) M_(n+2),
 *   the exact residual being the even-moment series
 *       E_n(a) = sum_{k>=1} a^(n+2k)/(n+2k)! M_(n+2k)
 *   of the FIXED genuine-Phi autocorrelation A(tau) (NPHI = 10, support cap T_A = 6).
 *   imp-3552 then measured the OVER-ESTIMATION factor F_n(a) = bound_sharp/|E_n(a)| =
 *   cosh(a T_A)/S_n(a) and found it reaches ~10.06x at a = 0.5 -- because cosh 3 ~ 10
 *   DOMINATES while the residual shape S_n(a) = |E_n(a)|/L_n(a) departs from 1 only at
 *   O(a^2). It stopped at the loose cosh(a T_A) ceiling, leaving the sharper
 *   shape-corrected certificate underived.
 *
 *   THE SHAPE-CORRECTED CERTIFICATE (this module)
 *   ---------------------------------------------
 *   The cosh bound is the term-by-term domination L_(n,k)(a) <= L_n(a) (a T_A)^(2k-2)/(2k-2)!
 *   (from the imp-3546-certified moment decay M_(n+2k) <= T_A^(2k-2) M_(n+2)) summed over
 *   ALL k >= 1, so it inflates the WHOLE tail by cosh. Instead RETAIN the first K
 *   even-moment terms EXACTLY and bound ONLY the k >= K+1 remainder by the cosh tail:
 *       bound_K(a,n) = sum_{k=1..K} a^(n+2k)/(n+2k)! M_(n+2k)
 *                    + L_n(a) [ cosh(a T_A) - sum_{j=0..K-1} (a T_A)^(2j)/(2j)! ].
 *   K = 1 reproduces the imp-3532 sharp cosh bound exactly (the whole tail bounded); each
 *   extra retained term (K = 2 keeps 1 extra, K = 3 keeps 2 extra) replaces a loose cosh
 *   monomial by the exact moment term, shrinking the certificate toward E_n(a). The new
 *   over-estimation factor is F_n^(K)(a) = bound_K(a,n)/|E_n(a)| >= 1, still a valid upper
 *   certificate because the retained terms are exact and the remainder domination holds.
 *
 *   MEASURED RESULT (self-computing; reuses the imp-3546 recomputed ladder M_0..M_10)
 *   --------------------------------------------------------------------------------
 *   Over the imp-3532 ladder a in {0.5, 0.25, 0.125, 0.0625}, rungs n = 0..4:
 *   (S1) TOP-OF-LADDER SHRINK. At a = 0.5 the over-estimation drops from ~10.06x (K = 1,
 *        the imp-3552 cosh ceiling) to ~5.57x with ONE extra retained term (K = 2) and to
 *        ~2.19x with TWO extra terms (K = 3) -- a ~1.81x tightening from one term and a
 *        ~4.59x tightening from two, cutting the cosh over-estimation by more than half then
 *        by nearly five-fold.
 *   (S2) LADDER-WIDE SHRINK. The reduction holds across the whole a-ladder: a = 0.25 falls
 *        2.352x -> 1.227x -> 1.017x, a = 0.125 falls 1.295x -> 1.013x -> 1.0002x -- every
 *        retained term brings the certificate materially closer to the exact residual.
 *   (S3) STILL A VALID BOUND. F_n^(K)(a) >= 1 on every rung/a/K: the shape-corrected
 *        certificate never under-estimates the true residual -- it stays an upper bound.
 *   (S4) MONOTONE IN K. For fixed (a,n) the factor decreases monotonically in K
 *        (F^(1) > F^(2) > F^(3)): retaining more exact terms only ever tightens the bound.
 *   (S5) K = 1 REPRODUCES THE COSH CEILING. bound_1(a,n) = L_n(a) cosh(a T_A) reproduces
 *        the imp-3552 sharp certificate to <1e-12, so the family is a strict refinement of
 *        the imp-3532 bound with the cosh certificate as its K = 1 member.
 *
 *   VERDICT: retaining the first one or two exact even-moment terms and bounding only the
 *   remainder by the cosh tail (the shape-corrected certificate bound_K) shrinks the
 *   imp-3552 a = 0.5 over-estimation from ~10.06x to ~5.57x (one extra term) or ~2.19x
 *   (two extra terms), while remaining a valid upper bound that tightens monotonically in K.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DERIVATION ONLY, at the RH-equivalent scale class. This derives a tighter
 *   explicit constant for the small-a moment-tail error of the degree-2 (absolute-measure)
 *   masses; it establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT and the degree-2 face carries no feasibility comparison at all (imp-3469:
 *   D_2 = 0). The operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel
 *   step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the rigorous SOTA.
 *
 *   @see imp-3552-cosh-certificate-overestimation-factor.js (the loose cosh over-estimation this sharpens)
 *   @see imp-3532-moment-tail-closed-error-bound.js (the K=1 sharp cosh certificate)
 *   @see imp-3546-moment-tail-bound-tightness.js (the recomputed M_0..M_10 ladder + decay domination)
 *
 *   Ticket: imp-3574 (numerical, medium).
 */

import { IMP3546_MOMENT_TAIL_BOUND_TIGHTNESS } from './imp-3546-moment-tail-bound-tightness.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- Reuse the imp-3546 recomputed ladder M_0..M_10 & compact support cap ---------
const MOM = IMP3546_MOMENT_TAIL_BOUND_TIGHTNESS.measured.moments; // { M0..M10 } recomputed moments
const M = [MOM.M0, MOM.M1, MOM.M2, MOM.M3, MOM.M4, MOM.M5, MOM.M6, MOM.M7, MOM.M8, MOM.M9, MOM.M10];
const MMAX = 10;                                  // highest available moment index (imp-3546 extension)
const T_A = IMP3546_MOMENT_TAIL_BOUND_TIGHTNESS.method.supportCap; // compact support cap = 6

/** n! for small integer n. */
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i += 1) f *= i;
  return f;
}

// -- The imp-3532 pieces: leading term L_n(a) and exact tail E_n(a) ---------------
// Leading (k=1) term the cosh bound multiplies: L_n(a) = (a^(n+2)/(n+2)!) M_(n+2).
function leadingTerm(a, n) {
  return (Math.pow(a, n + 2) / factorial(n + 2)) * M[n + 2];
}
// Exact residual tail E_n(a) = sum_{k>=1} a^(n+2k)/(n+2k)! M_(n+2k), truncated at MMAX.
function exactResidualTail(a, n) {
  let tail = 0;
  for (let m = n + 2; m <= MMAX; m += 2) tail += (Math.pow(a, m) / factorial(m)) * M[m];
  return tail;
}

// == THE SHAPE-CORRECTED CERTIFICATE bound_K =====================================
// Retain the first K even-moment terms EXACTLY, bound only the k>=K+1 remainder by
// the cosh tail: bound_K = sum_{k=1..K} L_(n,k)(a)
//   + L_n(a) [ cosh(a T_A) - sum_{j=0..K-1} (a T_A)^(2j)/(2j)! ].
// K=1 collapses to the imp-3532 sharp bound L_n(a) cosh(a T_A).
function shapeCorrectedBound(a, n, K) {
  let exactPart = 0;
  for (let k = 1; k <= K; k += 1) {
    exactPart += (Math.pow(a, n + 2 * k) / factorial(n + 2 * k)) * M[n + 2 * k];
  }
  let coshRemainder = Math.cosh(a * T_A);
  for (let j = 0; j <= K - 1; j += 1) {
    coshRemainder -= Math.pow(a * T_A, 2 * j) / factorial(2 * j);
  }
  return exactPart + leadingTerm(a, n) * coshRemainder;
}

const A_LADDER = Object.freeze([0.5, 0.25, 0.125, 0.0625]);   // the imp-3532 ladder
const RUNGS = [0, 1, 2, 3, 4];                    // the imp-3532 instantiated rungs
const K_LEVELS = [1, 2, 3];                       // K=1 baseline (cosh) + 1 or 2 extra retained terms

// Per-rung over-estimation profile across the a-ladder, for each retention level K.
const profile = RUNGS.map((n) => {
  const rows = A_LADDER.map((a) => {
    const tail = exactResidualTail(a, n);
    const factorsByK = K_LEVELS.map((K) => shapeCorrectedBound(a, n, K) / tail);
    // Reduction of the top-line cosh (K=1) over-estimation achieved by retaining terms.
    const baselineCoshFactor = factorsByK[0];
    return Object.freeze({
      a,
      exactResidualTail: tail,
      factorsByK,                                  // [F^(1), F^(2), F^(3)] over-estimation per K
      baselineCoshFactor,                          // F^(1) = the imp-3552 cosh over-estimation
      oneExtraTermFactor: factorsByK[1],           // F^(2): one extra retained even-moment term
      twoExtraTermsFactor: factorsByK[2],          // F^(3): two extra retained even-moment terms
      shrinkOneTerm: baselineCoshFactor / factorsByK[1],   // how many times tighter with 1 extra term
      shrinkTwoTerms: baselineCoshFactor / factorsByK[2],  // how many times tighter with 2 extra terms
      allAboveOne: factorsByK.every((f) => f >= 1 - 1e-12), // (S3) still a valid upper bound
      monotoneInK: factorsByK.every((f, i) => i === 0 || f <= factorsByK[i - 1] + 1e-12), // (S4)
    });
  });
  return Object.freeze({
    n,
    rows,
    topOfLadderCoshFactor: rows[0].baselineCoshFactor,      // a=0.5, K=1 (~10.06)
    topOfLadderOneExtra: rows[0].oneExtraTermFactor,        // a=0.5, K=2 (~5.57)
    topOfLadderTwoExtra: rows[0].twoExtraTermsFactor,       // a=0.5, K=3 (~2.19)
  });
});

// -- Aggregate classifiers -------------------------------------------------------
const allAboveOne = profile.every((p) => p.rows.every((r) => r.allAboveOne));
const allMonotoneInK = profile.every((p) => p.rows.every((r) => r.monotoneInK));

// (S5) K=1 must reproduce the imp-3532 sharp cosh certificate L_n(a) cosh(a T_A).
let worstK1CoshResidual = 0;
for (const n of RUNGS) {
  for (const a of A_LADDER) {
    const coshBound = leadingTerm(a, n) * Math.cosh(a * T_A);
    const rel = Math.abs(shapeCorrectedBound(a, n, 1) - coshBound) / coshBound;
    if (rel > worstK1CoshResidual) worstK1CoshResidual = rel;
  }
}

// Top-of-ladder (a=0.5) over-estimation across rungs at each K.
const topCoshMax = Math.max(...profile.map((p) => p.topOfLadderCoshFactor));
const topOneExtraMax = Math.max(...profile.map((p) => p.topOfLadderOneExtra));
const topTwoExtraMax = Math.max(...profile.map((p) => p.topOfLadderTwoExtra));
const shrinkOneTermTop = Math.min(...profile.map((p) => p.rows[0].shrinkOneTerm));
const shrinkTwoTermsTop = Math.min(...profile.map((p) => p.rows[0].shrinkTwoTerms));

// Bands: cosh baseline ~10, one extra term ~5.6, two extra ~2.2 at a=0.5.
const COSH_HALF = Math.cosh(0.5 * T_A);           // cosh 3 ~ 10.0677 -- the K=1 ceiling
const ONE_EXTRA_CEILING = 6.0;                    // one extra term drops below ~6
const TWO_EXTRA_CEILING = 2.5;                    // two extra terms drop below ~2.5

const coshBaselineMatches = topCoshMax <= COSH_HALF + 1e-9 && topCoshMax > 0.999 * COSH_HALF;
const oneExtraShrinks = topOneExtraMax < ONE_EXTRA_CEILING && shrinkOneTermTop > 1.5;
const twoExtraShrinks = topTwoExtraMax < TWO_EXTRA_CEILING && shrinkTwoTermsTop > 3.0;

const verdict =
  allAboveOne && allMonotoneInK && worstK1CoshResidual < 1e-12 &&
  coshBaselineMatches && oneExtraShrinks && twoExtraShrinks
    ? 'imp-3574-SHAPE-CORRECTED-TAIL-CERTIFICATE-bound_K-SHRINKS-imp-3552-a=0.5-OVER-ESTIMATION-FROM-~10.06x-COSH-TO-~5.57x-ONE-EXTRA-TERM-AND-~2.19x-TWO-EXTRA-TERMS-STILL-A-VALID-BOUND-MONOTONE-IN-K'
    : 'INDETERMINATE';

export const IMP3574_SHAPE_CORRECTED_TAIL_CERTIFICATE = Object.freeze({
  id: 'imp-3574-shape-corrected-tail-certificate',
  ticket: 'imp-3574',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedOverEstimation: 'imp-3552-cosh-certificate-overestimation-factor.js',
  relatedSharpBound: 'imp-3532-moment-tail-closed-error-bound.js',
  relatedMomentLadder: 'imp-3546-moment-tail-bound-tightness.js',

  summary:
    'Derives a residual-SHAPE-corrected tail certificate bound_K that replaces the imp-3552 loose ' +
    'cosh(a T_A) inflation constant with an S_n(a)-aware factor and measures how much it shrinks the ' +
    '~10x over-estimation the cosh bound carries at a=0.5. Instead of bounding the WHOLE even-moment ' +
    'tail E_n(a)=sum_{k>=1} a^(n+2k)/(n+2k)! M_(n+2k) by cosh, bound_K RETAINS the first K terms exactly ' +
    'and bounds only the k>=K+1 remainder by the cosh tail: bound_K=sum_{k=1..K} L_(n,k)+L_n(a)[cosh(a ' +
    'T_A)-sum_{j=0..K-1}(a T_A)^(2j)/(2j)!], with L_n(a)=(a^(n+2)/(n+2)!)M_(n+2). K=1 reproduces the ' +
    'imp-3532 sharp cosh certificate. MEASURED across a in {0.5,0.25,0.125,0.0625}, rungs n=0..4: at ' +
    'a=0.5 the over-estimation drops from ~10.06x (K=1) to ~5.57x with ONE extra retained term (~1.81x ' +
    'tighter) and to ~2.19x with TWO extra terms (~4.59x tighter); the reduction holds ladder-wide ' +
    '(a=0.25: 2.352->1.227->1.017; a=0.125: 1.295->1.013->1.0002). The certificate stays a VALID upper ' +
    'bound (F_n^(K)>=1) and tightens monotonically in K. Reuses the imp-3546 recomputed ladder M_0..M_10, ' +
    'T_A=6. MEASUREMENT/DERIVATION, RH-EQUIVALENT, necessary-but-not-sufficient; degree-2 face carries no ' +
    'feasibility ratio (D_2=0); operator positivity (imp-3066) untouched; no QED.',

  method: Object.freeze({
    shapeCorrectedBound:
      'bound_K(a,n) = sum_{k=1..K} a^(n+2k)/(n+2k)! M_(n+2k) + L_n(a)[cosh(a T_A) - sum_{j=0..K-1} (a T_A)^(2j)/(2j)!]',
    leadingTerm: 'L_n(a) = (a^(n+2)/(n+2)!) M_(n+2) (the term the K=1 cosh bound multiplies)',
    exactResidual: 'E_n(a) = sum_{k>=1} a^(n+2k)/(n+2k)! M_(n+2k) (imp-3532 E1), truncated at MMAX=10',
    overEstimationFactor: 'F_n^(K)(a) := bound_K(a,n)/|E_n(a)| >= 1 (how far the shape-corrected cert sits above the residual)',
    validityBasis:
      'valid upper bound: the retained k<=K terms are EXACT and the k>=K+1 remainder is dominated term-by-term ' +
      'by L_n(a)(a T_A)^(2k-2)/(2k-2)! via the imp-3546-certified moment decay M_(n+2k) <= T_A^(2k-2) M_(n+2)',
    k1Collapse: 'K=1 gives bound_1 = L_n(a) cosh(a T_A), the imp-3532 sharp certificate (imp-3552 baseline)',
    aLadder: A_LADDER,
    rungs: RUNGS,
    kLevels: K_LEVELS,
    supportCap: T_A,
    momentMax: MMAX,
    momentsUsed: Object.freeze({
      M0: M[0], M1: M[1], M2: M[2], M3: M[3], M4: M[4], M5: M[5],
      M6: M[6], M7: M[7], M8: M[8], M9: M[9], M10: M[10],
    }),
    coshHalfLadder: COSH_HALF,
    selfComputing: true,
  }),

  measured: Object.freeze({
    profile,                                       // per-rung factorsByK rows across the ladder
    allAboveOne,                                   // (S3) F_n^(K) >= 1: still a valid upper bound
    allMonotoneInK,                                // (S4) factor decreases as K grows
    worstK1CoshResidual,                           // (S5) K=1 reproduces the cosh certificate (<1e-12)
    topCoshMax,                                    // (S1) a=0.5 K=1 over-estimation ~ cosh 3 ~ 10.07
    topOneExtraMax,                                // (S1) a=0.5 K=2 over-estimation ~ 5.57
    topTwoExtraMax,                                // (S1) a=0.5 K=3 over-estimation ~ 2.19
    shrinkOneTermTop,                              // ~1.81x tighter with one extra term at a=0.5
    shrinkTwoTermsTop,                             // ~4.59x tighter with two extra terms at a=0.5
    coshHalfLadder: COSH_HALF,
    verdict,
  }),

  interpretation: Object.freeze({
    whatItAdds:
      'imp-3552 quantified that the imp-3532 cosh(a T_A) certificate over-estimates the exact residual by ' +
      '~10x at a=0.5 but stopped at that loose cosh ceiling. This module derives a family of TIGHTER ' +
      'certificates bound_K that retain the first K even-moment terms exactly and bound only the tail, ' +
      'directly cutting the a=0.5 over-estimation to ~5.57x (one extra term) or ~2.19x (two extra terms).',
    whyItWorks:
      'The cosh bound inflates EVERY tail term by the loose (a T_A)^(2k-2)/(2k-2)! monomial. Replacing the ' +
      'first one or two of those loose monomials by the EXACT moment terms removes the bulk of the ' +
      'inflation, since the leading tail terms carry almost all of the over-estimation at a=0.5.',
    stillABound:
      'bound_K remains a rigorous upper certificate: the retained terms are exact and the remainder is still ' +
      'dominated by the cosh tail via the imp-3546 moment-decay inequality, so F_n^(K)(a) >= 1 throughout.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isCertificationAndMeasurement: true,
    numericalCharacterizationOnly:
      'This module derives and measures a tighter explicit constant (the shape-corrected certificate bound_K) ' +
      'for the small-a moment-tail error of the A-weighted degree-2 masses. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility ' +
      'comparison at all (imp-3469: D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------
export const IMP3574_SHAPE_CORRECTED_TAIL_CERTIFICATE_ASSERTIONS = [
  {
    id: 'imp3574-shape-corrected-bound-still-holds',
    why: 'S3: the shape-corrected over-estimation factor F_n^(K)(a)=bound_K/|E_n(a)| must be >= 1 on every ' +
         'rung/a/K -- retaining exact terms and bounding only the remainder must keep bound_K a valid upper bound.',
    holds: () => allAboveOne,
  },
  {
    id: 'imp3574-factor-monotone-in-K',
    why: 'S4: for fixed (a,n) the over-estimation factor must decrease monotonically as K grows ' +
         '(F^(1) >= F^(2) >= F^(3)) -- each extra retained exact term only ever tightens the certificate.',
    holds: () => allMonotoneInK,
  },
  {
    id: 'imp3574-K1-reproduces-cosh-certificate',
    why: 'S5: at K=1 the shape-corrected bound must reproduce the imp-3532 sharp cosh certificate ' +
         'L_n(a) cosh(a T_A) to <1e-12 -- the family is a strict refinement with the cosh bound as its K=1 member.',
    holds: () => worstK1CoshResidual < 1e-12,
  },
  {
    id: 'imp3574-top-of-ladder-cosh-baseline-matches',
    why: 'S1: at a=0.5 the K=1 over-estimation must match cosh 3 ~ 10.07 (the imp-3552 baseline) to within ' +
         'the shape correction -- the shrink is measured against that known ~10x over-estimation.',
    holds: () => coshBaselineMatches,
  },
  {
    id: 'imp3574-one-extra-term-shrinks-below-6x',
    why: 'S1: retaining ONE extra even-moment term (K=2) must drop the a=0.5 over-estimation below ~6x ' +
         '(measured ~5.57x), a >1.5x tightening of the ~10x cosh ceiling.',
    holds: () => oneExtraShrinks,
  },
  {
    id: 'imp3574-two-extra-terms-shrink-below-2p5x',
    why: 'S1: retaining TWO extra even-moment terms (K=3) must drop the a=0.5 over-estimation below ~2.5x ' +
         '(measured ~2.19x), a >3x tightening of the ~10x cosh ceiling.',
    holds: () => twoExtraShrinks,
  },
  {
    id: 'imp3574-verdict-classifies-the-shrink',
    why: 'The verdict must certify the shape-corrected certificate shrinks the imp-3552 a=0.5 over-estimation ' +
         'from ~10.06x to ~5.57x (one extra term) or ~2.19x (two extra terms), still valid and monotone in K.',
    holds: () => verdict.startsWith('imp-3574-SHAPE-CORRECTED-TAIL-CERTIFICATE'),
  },
  {
    id: 'imp3574-honest-measurement-not-a-verdict',
    why: 'Mandatory honesty: measurement/derivation only, mass-feasibility necessary-but-not-sufficient ' +
         '(no degree-2 ratio, D_2=0), operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3574_SHAPE_CORRECTED_TAIL_CERTIFICATE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isCertificationAndMeasurement === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3574_SHAPE_CORRECTED_TAIL_CERTIFICATE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3574-shape-corrected-tail-certificate assertion failed: ${assertion.id}`);
  }
}

export default IMP3574_SHAPE_CORRECTED_TAIL_CERTIFICATE;
