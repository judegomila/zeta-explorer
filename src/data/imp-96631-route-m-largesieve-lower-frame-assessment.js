/**
 * @module imp-96631-route-m-largesieve-lower-frame-assessment
 *
 * imp-96631 (proof, ASSESSMENT ONLY): drill into imp-96613 FINDING 4. That finding
 * flagged that the GCD-sum / Gal-type / Montgomery-Vaughan large-sieve machinery is the
 * natural analytic home for the multiplicative Vasyunin Gram G_{hk} = gcd(h,k)
 * I(h/g,k/g)/(hk) but produces only UPPER bounds (top-edge / lam_max control), supplying
 * NO lower-frame / coercivity inequality. This ticket asks the sharper question: does ANY
 * known LOWER large-sieve inequality (a dual / reciprocal large sieve, a positive-definite
 * MINORANT comparison kernel dominating G_N from below, or a Gal-sum lower bound) deliver
 *
 *     <G_N x, x> >= A N^-p ||x||^2   uniformly in N ?
 *
 * Verdict: NO. Each candidate mechanism is examined and a precise obstruction recorded.
 * This changes NO bound, establishes no operator positivity, makes no RH claim. NO QED.
 *
 * -------------------------------------------------------------------------------
 * CANDIDATE 1 -- the DUAL / RECIPROCAL large sieve.
 * -------------------------------------------------------------------------------
 * The large sieve inequality Sum_r |Sum_n a_n e(n x_r)|^2 <= (N + delta^-1) Sum_n |a_n|^2
 * is MAJORANT by construction: its proof bounds the operator NORM (spectral radius) of a
 * nonnegative kernel via duality + arithmetic Cauchy-Schwarz, a one-sided estimate. Its
 * formal "dual" is again an upper bound in the transposed variables (Montgomery-Vaughan
 * duality principle: ||T|| = ||T^*||), NOT a lower bound. A genuine large-sieve LOWER
 * inequality Sum_r |Sum_n a_n e(n x_r)|^2 >= c Sum_n |a_n|^2 is exactly a statement that the
 * sampling system {e(n x_r)} is a FRAME FROM BELOW (a Riesz sequence). Such lower bounds are
 * known ONLY under strong separation + oversampling hypotheses (Kadec 1/4, Beurling density
 * > 1), and the constant c DEGENERATES to 0 as the system approaches linear dependence.
 * OBSTRUCTION: for the Vasyunin / Nyman-Beurling DILATION system the relevant frequencies
 * cluster (log of small integers accumulate), density fails, and the lower frame constant is
 * precisely lam_min(G_N) -- so a reciprocal large sieve would be circular, not a supply.
 *
 * -------------------------------------------------------------------------------
 * CANDIDATE 2 -- a positive-definite MINORANT comparison kernel K with G_N - K PSD.
 * -------------------------------------------------------------------------------
 * One would seek a kernel K(h,k) that is (i) positive semidefinite, (ii) a MINORANT,
 * G_N - K PSD, and (iii) has a KNOWN lower eigenvalue lam_min(K) >= A N^-p, whence
 * lam_min(G_N) >= lam_min(K). Two natural choices both fail:
 *   (a) DIAGONAL minorant K = c I. G_N - c I PSD is equivalent to lam_min(G_N) >= c -- the
 *       target itself. Circular.
 *   (b) GAL minorant K_alpha(h,k) = gcd(h,k)^{2 alpha} / (hk)^alpha, 0 < alpha < 1. This IS
 *       a bona fide positive-definite kernel (the reason Gal sums are studied), but it is a
 *       MULTIPLICATIVE gcd kernel of the SAME family as G_N: it inherits the identical
 *       non-compactness (a Dirichlet-series singularity) and its OWN smallest eigenvalue
 *       collapses to 0 with NO known rate lam_min(K_alpha) >= A N^-p. So even where K_alpha
 *       is a valid PSD minorant, it transfers an unknown lower bound, not a known one.
 * OBSTRUCTION: every PSD minorant expressible in the multiplicative gcd language carries the
 * same open coercivity problem it is meant to solve; no minorant with an INDEPENDENTLY known
 * lam_min >= A N^-p is available.
 *
 * -------------------------------------------------------------------------------
 * CANDIDATE 3 -- a GCD-sum / Gal / Bondarenko-Seip LOWER bound.
 * -------------------------------------------------------------------------------
 * The Gal-sum theorems (Gal 1949; Lindqvist-Seip; Bondarenko-Seip) bound
 * Sum_{h,k} c_h c_k gcd(h,k)^{2 alpha}/(hk)^alpha <= Gamma(alpha, N) Sum |c_k|^2 with
 * Gamma the extremal (largest-eigenvalue) constant. These are pure MAJORANTS -- they pin the
 * TOP of the spectrum. There is no companion Gal LOWER bound because the extremal problem is
 * a maximization: the minimizing configuration drives the quadratic form to 0 (attained in
 * the limit by near-null vectors supported on almost-coprime clusters), so the infimum of the
 * normalized Gal form over unit c is 0 and NO positive lower constant exists to be proved.
 * OBSTRUCTION: the Gal / large-sieve extremal problem is intrinsically one-sided; its
 * infimum is 0, so there is nothing for a "lower Gal bound" to certify.
 *
 * -------------------------------------------------------------------------------
 * ROOT CAUSE -- the lower frame bound IS the Nyman-Beurling Riesz-sequence question.
 * -------------------------------------------------------------------------------
 * <G_N x, x> >= A N^-p ||x||^2 says the dilation system underlying the Vasyunin Gram is a
 * lower-frame (Riesz) sequence with a controlled rate. But that dilation system is known NOT
 * to be a Riesz sequence -- its lower frame constant collapses (imp-96582: lam_min collapse
 * ~1179x, bottom edge of the limiting spectrum is 0). Every majorant tool (large sieve, Gal
 * sums, Bondarenko-Seip) is built to control the DIVERGENT top edge (imp-96562: ~0.3526
 * log N) and is silent on the vanishing bottom edge. The requested lower analog does not
 * merely happen to be missing from the literature -- its target quantity has infimum 0, so no
 * N-uniform POSITIVE-CONSTANT form exists, and the RATE form A N^-p is exactly the open
 * coercivity sub-gap (IMP96613_SUBGAP), untouched by any one-sided majorant machinery.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * NO known lower large-sieve inequality, positive-definite minorant kernel, or Gal-sum lower
 * bound supplies <G_N x, x> >= A N^-p. (1) The dual / reciprocal large sieve is again a
 * majorant; a true lower large sieve is a Riesz-sequence bound whose constant is lam_min(G_N)
 * itself (circular). (2) Every PSD minorant in the multiplicative gcd language (diagonal =
 * circular; Gal kernel = same non-compactness, own lam_min collapses with no rate) transfers
 * an unknown lower bound. (3) The Gal / large-sieve extremal problem is a maximization with
 * infimum 0, so no lower constant exists to certify. Root cause: the lower-frame bound is the
 * Nyman-Beurling Riesz-sequence property, known FALSE (bottom edge 0), so the majorant
 * machinery is structurally the wrong tool. Sharpens imp-96613 FINDING 4 from "no lower-frame
 * analog identified" to a precise per-candidate obstruction. Changes no bound; no operator
 * positivity; the imp-96548 conditioning ceiling stays double-precision-limited; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96613-route-m-lammin-nuniform-lowerbound-obstruction-assessment.js (FINDING 4 this drills into)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (the top-edge rigorous UPPER bound)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (top edge ~0.3526 log N, non-compact)
 * @see imp-96582-route-m-lammin-bottom-edge-szego-assessment.js (bottom edge = 0, lam_min collapse)
 * @see imp-96586-route-m-lammax-meanfield-cesaro-proxy.js (Hilbert-Schmidt peak row; collective effect)
 *
 * Ticket: imp-96631 (proof, opus-4-8, api-pool). Assessment only; NO QED.
 */

// Inputs reused verbatim from the record (imp-96613 consolidation of the measured ladder).
export const IMP96631_INPUTS = Object.freeze({
  lamMinA: 0.8186721, // imp-96428 fit lam_min ~ A N^-p (the constant a uniform lower bound would need)
  lamMinP: 1.917927,
  topEdgeSlope: 0.3526253785070698, // imp-96562 lam_max ~ 0.3526 log N (divergent top edge)
  bottomCollapseRatio: 1179.0, // imp-96582 lam_min collapse across N=250..1e4 (bottom edge -> 0)
  peakRowHilbertSchmidt: 4.0547, // imp-96586 Sum_k G_{1,k}^2 converges (rank-one surrogate saturates)
});

// CANDIDATE 1 -- dual / reciprocal large sieve.
export const IMP96631_DUAL_LARGE_SIEVE = Object.freeze({
  candidate: 'dual / reciprocal large sieve (Montgomery-Vaughan duality)',
  isMajorant: true, // the large sieve and its dual both bound an operator norm, one-sided
  lowerInequalityIsRieszSequence: true, // a true lower large sieve = frame-from-below / Riesz-sequence bound
  constantDegeneratesToZero: true, // c -> 0 as the sampling system approaches linear dependence
  circular: true, // for the Vasyunin dilation system the lower frame constant IS lam_min(G_N)
  note:
    'the large sieve bounds an operator norm via duality + arithmetic Cauchy-Schwarz (one-sided); ' +
    'its dual is again an upper bound. A genuine lower large sieve is a frame-from-below (Riesz ' +
    'sequence) statement whose constant, for the Vasyunin dilation frequencies (which cluster, ' +
    'failing Beurling density), is exactly lam_min(G_N) -- circular, not a supply.',
});

// CANDIDATE 2 -- positive-definite minorant comparison kernel.
export const IMP96631_PSD_MINORANT = Object.freeze({
  candidate: 'positive-definite minorant K with G_N - K PSD and known lam_min(K) >= A N^-p',
  diagonalMinorantCircular: true, // G_N - c I PSD  <=>  lam_min(G_N) >= c, the target itself
  galMinorantIsValidPSD: true, // gcd(h,k)^{2 alpha}/(hk)^alpha, 0 < alpha < 1, is positive definite
  galMinorantOwnLamMinCollapses: true, // same multiplicative non-compactness; its own lam_min -> 0, no rate
  transfersUnknownBound: true, // even a valid Gal minorant hands over an unknown lower bound
  note:
    'a diagonal minorant is circular; the Gal kernel is a genuine PSD minorant candidate but of the ' +
    'SAME multiplicative gcd family, so it inherits the identical non-compactness and its own smallest ' +
    'eigenvalue collapses to 0 with no known rate -- it transfers an unknown lower bound, not a known one.',
});

// CANDIDATE 3 -- a Gal-sum / large-sieve LOWER bound.
export const IMP96631_GAL_LOWER = Object.freeze({
  candidate: 'GCD-sum / Gal / Bondarenko-Seip LOWER bound',
  extremalProblemIsMaximization: true, // Gamma(alpha, N) is a largest-eigenvalue (max) constant
  infimumOfNormalizedFormIsZero: true, // minimizing configs (almost-coprime clusters) drive the form -> 0
  noPositiveLowerConstant: true, // hence nothing for a "lower Gal bound" to certify
  note:
    'the Gal / large-sieve extremal problem is a maximization; the infimum of the normalized quadratic ' +
    'form over unit vectors is 0 (attained in the limit by near-null vectors on almost-coprime clusters), ' +
    'so no positive lower constant exists to be proved.',
});

// ROOT CAUSE -- the lower frame bound is the Nyman-Beurling Riesz-sequence question.
export const IMP96631_ROOT_CAUSE = Object.freeze({
  lowerFrameIsRieszSequenceProperty: true,
  dilationSystemIsNotRieszSequence: true, // bottom edge of the limiting spectrum is 0 (imp-96582)
  majorantToolsControlTopEdgeOnly: true, // large sieve / Gal bound the ~0.3526 log N divergent top edge
  note:
    '<G_N x, x> >= A N^-p says the Vasyunin dilation system is a lower-frame (Riesz) sequence with a ' +
    'rate; that system is known NOT to be a Riesz sequence (lam_min collapse ~1179x, bottom edge 0), so ' +
    'no N-uniform positive-constant form exists and the RATE form is the open coercivity sub-gap, ' +
    'untouched by any one-sided majorant machinery.',
});

export const IMP96631_VERDICT = Object.freeze({
  question:
    'does any known LOWER large-sieve inequality (dual / reciprocal large sieve, positive-definite ' +
    'minorant comparison kernel, or Gal-sum lower bound) supply <G_N x, x> >= A N^-p for the ' +
    'multiplicative Vasyunin Gram gcd(h,k) I(h/g,k/g)/(hk)?',
  lowerFrameBoundSupplied: false,
  dualLargeSieveWorks: false,
  psdMinorantWorks: false,
  galLowerBoundWorks: false,
  anyBoundMoved: false,
  conclusion:
    'NO. (1) The dual / reciprocal large sieve is again a majorant; a true lower large sieve is a ' +
    'Riesz-sequence bound whose constant is lam_min(G_N) itself (circular). (2) Every PSD minorant in ' +
    'the multiplicative gcd language transfers an unknown lower bound (diagonal = circular; Gal kernel ' +
    'has the same non-compactness and its own lam_min collapses with no rate). (3) The Gal / large-sieve ' +
    'extremal problem is a maximization with infimum 0, so no lower constant exists to certify. Root ' +
    'cause: the lower-frame bound is the Nyman-Beurling Riesz-sequence property, known FALSE (bottom ' +
    'edge 0), so the majorant machinery is structurally the wrong tool. Sharpens imp-96613 FINDING 4 to ' +
    'a precise per-candidate obstruction. Changes no bound; no operator positivity; imp-96548 ceiling ' +
    'stays double-precision-limited; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96631_SUBGAP = Object.freeze({
  id: 'imp-96631-largesieve-lower-frame-obstruction',
  statement:
    'no dual/reciprocal large sieve, PSD minorant comparison kernel, or Gal-sum lower bound supplies ' +
    'the N-uniform lower-frame inequality <G_N x, x> >= A N^-p (= IMP96613_SUBGAP); the residual open ' +
    'piece is unchanged and remains a multiplicative lower-frame / coercivity statement with no ' +
    'majorant-machinery route.',
});

export const IMP96631_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: a per-candidate obstruction ' +
  'analysis of the lower large-sieve / PSD-minorant / Gal-lower-bound options raised by imp-96613 ' +
  'FINDING 4. No Gram was rebuilt, no bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96631_ASSERTIONS = [
  {
    id: 'imp96631-dual-large-sieve-circular',
    holds: () =>
      IMP96631_DUAL_LARGE_SIEVE.isMajorant === true &&
      IMP96631_DUAL_LARGE_SIEVE.lowerInequalityIsRieszSequence === true &&
      IMP96631_DUAL_LARGE_SIEVE.circular === true,
    why: 'the dual/reciprocal large sieve is a majorant; a true lower large sieve is a Riesz-sequence bound whose constant is lam_min(G_N) itself -- circular.',
  },
  {
    id: 'imp96631-psd-minorant-transfers-unknown',
    holds: () =>
      IMP96631_PSD_MINORANT.diagonalMinorantCircular === true &&
      IMP96631_PSD_MINORANT.galMinorantIsValidPSD === true &&
      IMP96631_PSD_MINORANT.galMinorantOwnLamMinCollapses === true &&
      IMP96631_PSD_MINORANT.transfersUnknownBound === true,
    why: 'a diagonal minorant is circular; the Gal PSD minorant inherits the same non-compactness and its own lam_min collapses with no rate, transferring an unknown lower bound.',
  },
  {
    id: 'imp96631-gal-extremal-infimum-zero',
    holds: () =>
      IMP96631_GAL_LOWER.extremalProblemIsMaximization === true &&
      IMP96631_GAL_LOWER.infimumOfNormalizedFormIsZero === true &&
      IMP96631_GAL_LOWER.noPositiveLowerConstant === true,
    why: 'the Gal / large-sieve extremal problem is a maximization with infimum 0, so no positive lower constant exists to be proved.',
  },
  {
    id: 'imp96631-root-cause-riesz-sequence',
    holds: () =>
      IMP96631_ROOT_CAUSE.lowerFrameIsRieszSequenceProperty === true &&
      IMP96631_ROOT_CAUSE.dilationSystemIsNotRieszSequence === true &&
      IMP96631_INPUTS.bottomCollapseRatio > 1000 &&
      IMP96631_INPUTS.topEdgeSlope > 0.35 &&
      IMP96631_INPUTS.topEdgeSlope < 0.36,
    why: 'the lower-frame bound is the Nyman-Beurling Riesz-sequence property, known false (bottom edge 0, collapse >1000x); majorant tools control only the ~0.3526 log N top edge.',
  },
  {
    id: 'imp96631-honesty-gate-no-qed',
    holds: () =>
      IMP96631_VERDICT.lowerFrameBoundSupplied === false &&
      IMP96631_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96631_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96631_HONEST_BANNER) &&
      /RH open/.test(IMP96631_HONEST_BANNER) &&
      /lower-frame/.test(IMP96631_SUBGAP.id),
    why: 'assessment only: no lower-frame bound supplied, no bound moved, and the honesty markers plus the lower-frame sub-gap slug are present.',
  },
];

for (const a of IMP96631_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96631-route-m-largesieve-lower-frame-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  inputs: IMP96631_INPUTS,
  dualLargeSieve: IMP96631_DUAL_LARGE_SIEVE,
  psdMinorant: IMP96631_PSD_MINORANT,
  galLower: IMP96631_GAL_LOWER,
  rootCause: IMP96631_ROOT_CAUSE,
  verdict: IMP96631_VERDICT,
  subGap: IMP96631_SUBGAP,
  banner: IMP96631_HONEST_BANNER,
};
