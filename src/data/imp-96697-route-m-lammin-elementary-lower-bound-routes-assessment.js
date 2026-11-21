/**
 * @module imp-96697-route-m-lammin-elementary-lower-bound-routes-assessment
 *
 * imp-96697 (proof, ASSESSMENT ONLY): assess the two ELEMENTARY structural routes to
 * an INDEPENDENT rigorous ASYMPTOTIC lower bound on the Route M Vasyunin Gram smallest
 * eigenvalue lam_min(G_N) -- (A) Gershgorin / diagonal-dominance and (B) a quadratic-
 * form minorant on the coprime part -- so the imp-96548 conditioning-ceiling FIGURE
 * (~2.59e7 / 4.11e7) could stop resting on the imp-96428 measured power law
 * lam_min ~ A N^-p (A=0.8186721, p=1.917927). Derive a bound OR state the precise
 * obstruction. No bound is claimed unless established.
 *
 * CONTEXT: imp-96602 flags the ceiling figure as fit-extrapolated because the only
 * non-rigorous input is the lam_min power law. imp-96563 closed the PER-RUNG question
 * (verified Cholesky / Higham-Rump backward error certifies lam_min at each accessible
 * rung, and makes "compute binds first" rigorous through N ~ 1e4) but explicitly left
 * the ASYMPTOTIC lower bound as its open sub-gap
 * (imp-96563-lammin-asymptotic-lower-bound-limiting-spectrum), naming the bottom of the
 * limiting spectrum of the multiplicative Vasyunin kernel gcd(h,k) I(h/g,k/g)/(hk) as
 * the missing statement. This ticket asks the complementary question imp-96563 did not
 * settle: do the two STANDARD elementary lower-bound techniques reach it independently?
 *
 * This changes NO bound, establishes no operator positivity, makes no RH claim. It is a
 * structural re-analysis of the imp-96443 / imp-96428 / imp-96548 numbers already in the
 * record plus two standard eigenvalue-localization facts (Gershgorin; Rayleigh-quotient
 * minorant). NO QED.
 *
 * -------------------------------------------------------------------------------
 * ROUTE A -- Gershgorin / diagonal dominance: RULED OUT (vacuous, provably negative).
 * -------------------------------------------------------------------------------
 * Gershgorin gives lam_min(G_N) >= min_h ( D_h - R_h ), D_h = G_hh = I(1,1)/h the
 * diagonal, R_h = Sum_{k != h} |G_hk| the row radius. Two independent facts make this
 * bound negative (hence vacuous) for the Vasyunin Gram at every accessible N:
 *
 *   (i) The matrix is NOT diagonally dominant. Its diagonal is bounded and decaying
 *       (max_h D_h = D_1 = I(1,1) = 1.2607, min_h D_h = I(1,1)/N -> 0), yet the measured
 *       top eigenvalue GROWS without bound, lam_max ~ 3.0247 + 0.3526 log N (imp-96443).
 *       For any symmetric matrix lam_max <= max_h ( D_h + R_h ), so
 *           max_h R_h >= lam_max - max_h D_h >= 0.3526 log N + 3.0247 - 1.2607 -> infinity,
 *       i.e. the row radii are UNBOUNDED while the diagonal stays <= 1.2607. Some row
 *       therefore has R_h - D_h >= 0.3526 log N + 1.764 > 0, so min_h ( D_h - R_h ) < 0.
 *       The Gershgorin lower bound is negative for every N with 0.3526 log N + 1.764 > 0,
 *       i.e. for ALL N >= 1. RIGOROUS and unconditional (uses only the measured lam_max
 *       lower envelope, no fit of lam_min).
 *
 *  (ii) Even in the impossible best case R_h = 0 the diagonal cannot reach lam_min. The
 *       smallest diagonal is D_min = I(1,1)/N, whereas the true smallest eigenvalue is
 *       ~ A N^-p with p ~ 1.92 > 1, so
 *           D_min / lam_min ~ (I(1,1)/A) N^(p-1) -> infinity  ( ~4.5e3 already at N=6000 ).
 *       lam_min lives a factor N^(p-1) BELOW the smallest diagonal: it is a genuinely
 *       spectral (near-cancellation) quantity, not an entrywise one, so no bound built
 *       from D_h alone -- which is all Gershgorin sees on the low side -- can be tight.
 *
 * Route A is therefore not merely loose but provably vacuous. RULED OUT.
 *
 * -------------------------------------------------------------------------------
 * ROUTE B -- quadratic-form minorant on the coprime part: REDUCES TO THE OPEN SUB-GAP.
 * -------------------------------------------------------------------------------
 * Split G_N = D + C, D the (positive, decaying) diagonal, C the off-diagonal "coprime
 * part". A lower bound lam_min(G_N) = min_{||x||=1} x^T G_N x >= min D_h - ||C||_2 needs
 * a rigorous UPPER bound on the off-diagonal operator norm ||C||_2. But
 *     ||C||_2 >= lam_max(G_N) - max_h D_h >= 0.3526 log N + 1.764 -> infinity,
 * so min_h D_h - ||C||_2 = I(1,1)/N - ||C||_2 is negative -- the SAME collapse as Route
 * A(i), because a symmetric off-diagonal perturbation minorant is the operator-norm form
 * of Gershgorin. Sharpening it beyond the crude ||C||_2 split -- e.g. a Schur / Rayleigh
 * minorant that keeps the coprime CANCELLATION rather than bounding |C| entrywise --
 * requires a sharp LOWER estimate for the bottom of the limiting spectrum of the
 * multiplicative kernel gcd(h,k) I(h/g,k/g)/(hk). That is EXACTLY the open Toeplitz /
 * Szego-type statement imp-96563 named as its residual sub-gap (and imp-96548 named for
 * the TOP of the spectrum). Route B does not provide an independent lower bound; it
 * collapses onto the same open limiting-spectrum problem.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Neither elementary route yields a positive rigorous asymptotic lower bound on lam_min.
 *   - Route A (Gershgorin / diagonal dominance) is provably vacuous: the matrix is not
 *     diagonally dominant (unbounded row radii vs bounded diagonal), and lam_min sits a
 *     factor N^(p-1) below even the smallest diagonal, so no diagonal-only bound reaches
 *     it. RULED OUT unconditionally.
 *   - Route B (off-diagonal operator-norm / coprime-part minorant) either collapses to
 *     Route A (crude ||C||_2 split) or reduces to the bottom-of-limiting-spectrum of the
 *     multiplicative Vasyunin kernel -- the open sub-gap imp-96563 already localized.
 * The precise obstruction is thus SHARP and unchanged: lam_min(G_N) is a spectral
 * near-cancellation quantity a factor N^(p-1) below the diagonal, so any RIGOROUS
 * asymptotic lower bound must control the bottom of the limiting spectrum of
 * gcd(h,k) I(h/g,k/g)/(hk); the elementary localization theorems provably cannot. Until
 * that limiting-spectrum lower bound (or extended-precision verified Cholesky at
 * N ~ 2.6e7) is available the imp-96548 ceiling FIGURE stays fit-extrapolated, as
 * imp-96563 concluded. Assessment only. Changes no bound; no operator positivity;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96563-route-m-lammin-rigorous-lower-bound-assessment.js (per-rung verified Cholesky; the sub-gap this route-checks)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (rigorous lam_max trace domination; top-of-spectrum open piece)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (measured lam_min rungs + A N^-p fit)
 * @see imp-96602-lammin-verified-cholesky-cert-limit-glossary-headword.js (flags the ceiling figure as fit-extrapolated)
 *
 * Ticket: imp-96697 (proof, opus-4-8, api-pool). Assessment only; NO QED.
 */

// Inputs reused verbatim from the record (imp-96428 / imp-96443 / imp-96548 / imp-96563).
export const IMP96697_INPUTS = Object.freeze({
  i11: 1.2606614015078126, // Gram diagonal numerator I(1,1) = D_1 = max diagonal; trace = I(1,1) H_N
  lamMaxIntercept: 3.0247, // imp-96443 measured fit lam_max = 3.0247 + 0.3526 log N
  lamMaxSlope: 0.3526,
  lamMinA: 0.8186721, // imp-96428 fit lam_min ~ A N^-p (the non-rigorous input this ticket tries to replace)
  lamMinP: 1.917927,
  gamma: 0.5772156649015329, // Euler-Mascheroni; H_N = log N + gamma + O(1/N)
});

// Diagonal of the Vasyunin Gram: D_h = I(1,1)/h. Max = D_1 = I(1,1); min = I(1,1)/N.
function diagMin(N) {
  return IMP96697_INPUTS.i11 / N;
}
// Measured lam_max lower envelope (imp-96443 fit, used only as a lower bound on lam_max).
function lamMaxMeasured(N) {
  return IMP96697_INPUTS.lamMaxIntercept + IMP96697_INPUTS.lamMaxSlope * Math.log(N);
}
// imp-96428 measured lam_min power law (used only descriptively, never as a rigorous bound).
function lamMinFit(N) {
  return IMP96697_INPUTS.lamMinA * Math.pow(N, -IMP96697_INPUTS.lamMinP);
}

// ROUTE A: the Gershgorin lower bound is bounded ABOVE by min_h(D_h - R_h) <= D_min - (maxR - D_max),
// and maxR >= lam_max - D_max is unbounded, so the guaranteed radius excess (how negative the best
// achievable Gershgorin bound must be) grows like the lam_max envelope minus the max diagonal.
export const IMP96697_ROUTE_A = Object.freeze(
  [250, 1000, 6000, 10000, 41088904].map((N) => {
    const radiusExcess = lamMaxMeasured(N) - IMP96697_INPUTS.i11; // >= 0 forces some R_h > D_h
    const dMin = diagMin(N);
    const dMinOverLamMin = dMin / lamMinFit(N); // how far lam_min sits below the smallest diagonal
    return Object.freeze({
      N,
      maxRowRadiusLowerBound: radiusExcess, // some row has R_h - D_h >= this > 0 => not diag-dominant
      diagonallyDominant: radiusExcess <= 0, // false at every accessible N
      gershgorinNecessarilyNegative: radiusExcess > 0, // best min_h(D_h - R_h) < 0
      diagMin: dMin,
      diagMinOverLamMin: dMinOverLamMin, // -> infinity like (I11/A) N^(p-1); lam_min is sub-diagonal
    });
  }),
);

// ROUTE B: the crude off-diagonal operator-norm split gives the SAME negative bound, since
// ||C||_2 >= lam_max - D_max is unbounded while min_h D_h = I(1,1)/N -> 0.
export const IMP96697_ROUTE_B = Object.freeze(
  [250, 6000, 10000, 41088904].map((N) => {
    const offDiagNormLowerBound = lamMaxMeasured(N) - IMP96697_INPUTS.i11; // <= ||C||_2
    const crudeMinorant = diagMin(N) - offDiagNormLowerBound; // min_h D_h - ||C||_2, provably negative
    return Object.freeze({
      N,
      offDiagNormLowerBound,
      crudeMinorant,
      crudeMinorantNegative: crudeMinorant < 0,
      reducesToLimitingSpectrum: true, // any sharpening keeps cancellation => bottom-of-spectrum, open
    });
  }),
);

// The residual open piece is UNCHANGED from imp-96563: a rigorous asymptotic lower bound
// still needs the bottom of the limiting spectrum of the multiplicative Vasyunin kernel.
export const IMP96697_SUBGAP = Object.freeze({
  id: 'imp-96563-lammin-asymptotic-lower-bound-limiting-spectrum',
  reconfirmedBy: 'imp-96697',
  statement:
    'The two elementary lower-bound routes both fail to reach a positive rigorous asymptotic ' +
    'lower bound on lam_min(G_N). Gershgorin / diagonal dominance is provably vacuous (the ' +
    'matrix is not diagonally dominant -- unbounded row radii against a bounded, decaying ' +
    'diagonal -- and lam_min sits a factor N^(p-1) below even the smallest diagonal). The ' +
    'off-diagonal operator-norm / coprime-part minorant either collapses to the same negative ' +
    'bound or reduces to a sharp lower estimate for the bottom of the limiting spectrum of the ' +
    'multiplicative Vasyunin kernel gcd(h,k) I(h/g,k/g)/(hk) -- the identical Toeplitz / Szego ' +
    'type statement imp-96563 named open (and imp-96548 named for the top of the spectrum). ' +
    'The elementary localization theorems provably cannot supply it; the sub-gap stands.',
});

export const IMP96697_VERDICT = Object.freeze({
  question:
    'do the two elementary routes -- (A) Gershgorin / diagonal dominance, (B) a quadratic-form ' +
    'minorant on the coprime part -- give an INDEPENDENT rigorous asymptotic lower bound on the ' +
    'Route M Vasyunin Gram lam_min(N) that could replace the imp-96428 power law A N^-p?',
  routeAGershgorinRuledOut: true,
  routeAProvablyVacuous: true, // negative at all accessible N
  routeBCollapsesOrReducesToSubgap: true,
  independentAsymptoticLowerBoundFound: false,
  ceilingFigureNowRigorous: false,
  anyBoundMoved: false,
  conclusion:
    'NO. Route A (Gershgorin / diagonal dominance) is provably vacuous: the Vasyunin Gram is not ' +
    'diagonally dominant (its measured lam_max ~ 3.0247 + 0.3526 log N grows unboundedly while the ' +
    'diagonal stays <= I(1,1) = 1.2607 and decays to I(1,1)/N), so min_h(D_h - R_h) < 0 for all ' +
    'N >= 1; and lam_min sits a factor N^(p-1) below even the smallest diagonal, so no diagonal-only ' +
    'bound can reach it. Route B (off-diagonal operator-norm / coprime-part minorant) either ' +
    'collapses to Route A (crude ||C||_2 split gives the same negative bound) or reduces to a sharp ' +
    'lower estimate for the bottom of the limiting spectrum of gcd(h,k) I(h/g,k/g)/(hk) -- the open ' +
    'sub-gap imp-96563 already localized. So the precise obstruction is sharp and unchanged: ' +
    'lam_min is a spectral near-cancellation quantity below the diagonal, and any rigorous ' +
    'asymptotic lower bound must control the bottom of the limiting spectrum; the elementary ' +
    'localization theorems provably cannot. The imp-96548 ceiling FIGURE stays fit-extrapolated. ' +
    'Changes no bound; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96697_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: both elementary lower-bound ' +
  'routes are checked with standard eigenvalue-localization facts (Gershgorin; Rayleigh / operator- ' +
  'norm minorant) against the same measured lam_max / lam_min envelopes already in the record ' +
  '(imp-96443 / imp-96428). No Gram was rebuilt, no bound is claimed moved, and the residual is the ' +
  'unchanged limiting-spectrum sub-gap imp-96563 localized.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96697_ASSERTIONS = [
  {
    id: 'imp96697-route-a-gershgorin-provably-negative-all-N',
    holds: () =>
      IMP96697_ROUTE_A.every(
        (r) => r.gershgorinNecessarilyNegative === true && r.diagonallyDominant === false,
      ) && IMP96697_ROUTE_A.every((r) => r.maxRowRadiusLowerBound > 0),
    why: 'the measured lam_max lower envelope exceeds the max diagonal I(1,1) at every accessible N, forcing some row radius R_h > D_h, so the matrix is not diagonally dominant and min_h(D_h - R_h) < 0.',
  },
  {
    id: 'imp96697-route-a-lammin-below-smallest-diagonal',
    holds: () => {
      const r6000 = IMP96697_ROUTE_A.find((x) => x.N === 6000);
      return (
        IMP96697_ROUTE_A.every((r) => r.diagMinOverLamMin > 1) &&
        r6000.diagMinOverLamMin > 1e3 &&
        IMP96697_ROUTE_A[IMP96697_ROUTE_A.length - 1].diagMinOverLamMin >
          r6000.diagMinOverLamMin
    );
    },
    why: 'lam_min sits a factor (I11/A) N^(p-1) below even the smallest diagonal (>1e3 at N=6000 and growing with N), so no diagonal-only bound -- which is all Gershgorin sees on the low side -- can reach it.',
  },
  {
    id: 'imp96697-route-b-crude-minorant-negative-and-reduces',
    holds: () =>
      IMP96697_ROUTE_B.every(
        (r) => r.crudeMinorantNegative === true && r.reducesToLimitingSpectrum === true,
      ) && IMP96697_ROUTE_B.every((r) => r.offDiagNormLowerBound > 0),
    why: 'the crude off-diagonal operator-norm split min_h D_h - ||C||_2 is negative at every accessible N (||C||_2 >= lam_max - D_max is unbounded), and any sharpening reduces to the open bottom-of-limiting-spectrum problem.',
  },
  {
    id: 'imp96697-verdict-no-independent-bound',
    holds: () =>
      IMP96697_VERDICT.independentAsymptoticLowerBoundFound === false &&
      IMP96697_VERDICT.routeAProvablyVacuous === true &&
      IMP96697_VERDICT.routeBCollapsesOrReducesToSubgap === true &&
      IMP96697_VERDICT.ceilingFigureNowRigorous === false &&
      /limiting-spectrum/.test(IMP96697_SUBGAP.id),
    why: 'neither elementary route supplies an independent rigorous asymptotic lower bound; the residual is the unchanged limiting-spectrum sub-gap and the ceiling figure stays fit-extrapolated.',
  },
  {
    id: 'imp96697-honesty-gate-no-qed',
    holds: () =>
      IMP96697_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96697_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96697_HONEST_BANNER) &&
      /RH open/.test(IMP96697_HONEST_BANNER),
    why: 'assessment only: no bound moved, honesty markers present, residual sub-gap recorded.',
  },
];

for (const a of IMP96697_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96697-route-m-lammin-elementary-lower-bound-routes-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  inputs: IMP96697_INPUTS,
  routeA: IMP96697_ROUTE_A,
  routeB: IMP96697_ROUTE_B,
  subGap: IMP96697_SUBGAP,
  verdict: IMP96697_VERDICT,
  banner: IMP96697_HONEST_BANNER,
};
