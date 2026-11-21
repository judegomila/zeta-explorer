/**
 * @fileoverview imp-97027 -- CONTENT: a single WHAT-REMAINS honest-status note stating plainly that
 * the true infinite-dim lambda_min(T_a[sigma_2]) at the Route I Toeplitz/Krein certified endpoint
 * a=0.48 (2a=0.96) STAYS UNSETTLED, and tracing exactly why across the three-module thread that
 * chased it: imp-96977 (pinned the endpoint at finite N), imp-96994 (found the finite-N points
 * pre-asymptotic), imp-96998 (extended the N-ladder to 76 and hit a double-precision Gram
 * conditioning wall), and imp-97010 (removed that wall with an orthogonal basis, only to find a
 * SECOND wall -- fixed-T truncation -- binds next). No computation performed here; every number is
 * a verbatim citation from those four modules. Content/organization only; no bound moves; NO QED.
 *
 * WHY THIS NOTE EXISTS. Each of the four modules reports its own local finding and its own follow-up
 * request, but a reader landing on any single one could reasonably conclude the ladder is "almost
 * done" (imp-96998's N=76 floor is still order-10 positive; imp-97010's Gegenbauer basis looks like a
 * clean fix). Read in isolation neither module states that the true N -> infinity limit is unsettled
 * for a DIFFERENT reason after each fix. This note is the single place that says so.
 *
 * THE CHAIN, VERBATIM:
 *   imp-96977: pinned the a=0.48 (2a=0.96) certified-endpoint Rayleigh floor at N=36 to 18.636,
 *     replacing the imp-96958 flanking bracket (7.743, 56.05); explicitly flagged the sub-gap
 *     IMP96977_TRUE_LIMIT_UNSETTLED (uniform-in-N spectral gap lambda_min >= c > 0 still open).
 *   imp-96994: attempted to extrapolate the N -> infinity limit from the imp-96977 N=[20,28,36]
 *     triple; found both Aitken and 3-point power-law extrapolants UNPHYSICAL (pre-asymptotic data),
 *     leaving the sub-gap open and requesting a wider N-ladder.
 *   imp-96998: extended the ladder to N=[44,52,60,68,76] in the SAME Legendre basis. The floor stayed
 *     order-10 positive (10.153235 at N=76) and monotone decreasing, but the per-N decrement was still
 *     ACCELERATING through N~52 (no steady contraction ratio < 1) and the Gram condition number
 *     cond(B) grew ~14x per rung to 4.035e14 at N=76 -- within ~1.5 decades of the IEEE-double
 *     singular limit (~1e16). Sub-gap stayed open: no stable geometric tail reached, and precision was
 *     running out before one could be.
 *   imp-97010: replaced the Legendre trial basis with the orthogonal Gegenbauer C_n^{13/2} basis
 *     (exact Gram B = a^{4m+1} I, so cond(B)=1 for every N) -- the SAME trial subspace, so the same
 *     Rayleigh floor, but with the Gram conditioning wall removed entirely. This showed the imp-96998
 *     N=68/76 Legendre floors were ALREADY conditioning-corrupted (biased high by 2.4e-3 / 2.8e-1).
 *     Marching the well-conditioned basis past N=76 at the SAME fixed T=300 did not reach a positive
 *     geometric tail either -- it COLLAPSED toward zero (9.87 at N=76 -> 0.0027 at N=100 -> marginally
 *     negative by N=124). A T-sweep at fixed N proved this collapse is a t-TRUNCATION artifact, not a
 *     spectral gap closing: at N=100 the floor climbs 0.00271 (T=300) -> 17.56749 (T=800) ->
 *     19.65178 (T=1600) -> 20.07830 (T=3200), converging toward the imp-96835 T=4800 reference value
 *     20.132660.
 *
 * THE HONEST STATUS, IN ONE SENTENCE. Two successive walls have now been diagnosed at the a=0.48
 * (2a=0.96) certified endpoint -- first a Gram double-precision conditioning wall (fixed by
 * orthogonal basis), then a fixed-T truncation wall revealed once the first was removed -- and both
 * times the removal shows the TRUE floor is comfortably positive (~20.1, T-converged) rather than
 * collapsing; but neither wall's removal constitutes settling IMP96977_TRUE_LIMIT_UNSETTLED, because
 * no single computation has yet marched BOTH N and T jointly to a demonstrated fixed limit. What
 * remains is exactly that joint (N,T) refinement (the imp-96826 tconv route), not another one-sided
 * N-only or T-only ladder.
 *
 * SCOPE. Pure content synthesis; every cited number is reproduced verbatim from its source module; no
 * new computation, no bound moved. The interval-rigorous certificate reach stays exactly 2a <= 0.96;
 * operator positivity for 0.96 < 2a < ln3 stays OPEN; no refereed bound is changed; RH
 * open; NO QED.
 *
 * @see imp-96977-krein-intermediate-rungs.js (pins the a=0.48 endpoint at N=36; raises IMP96977_TRUE_LIMIT_UNSETTLED)
 * @see imp-96994-krein-floor-limit-extrapolation.js (finds the N=[20,28,36] triple pre-asymptotic)
 * @see imp-96998-krein-a048-Nladder-extended.js (N=[44..76] Legendre ladder; cond(B)~4e14 wall at N=76)
 * @see imp-97010-krein-a048-gegenbauer-extend.js (orthogonal-basis fix removes cond(B) wall; reveals fixed-T truncation wall)
 */

export const IMP97027_TICKET = 'imp-97027';
export const IMP97027_A = 0.48;
export const IMP97027_TWO_A = 0.96;

export const IMP97027_CHAIN = Object.freeze([
  {
    id: 'imp-96977',
    finding: 'Pins the a=0.48 (2a=0.96) certified-endpoint Rayleigh floor at N=36 to 18.636, replacing the imp-96958 flanking bracket (7.743, 56.05).',
    subGapRaised: 'IMP96977_TRUE_LIMIT_UNSETTLED',
  },
  {
    id: 'imp-96994',
    finding: 'Aitken and 3-point power-law extrapolation on the N=[20,28,36] triple are both unphysical -- the data is pre-asymptotic; requests a wider N-ladder.',
  },
  {
    id: 'imp-96998',
    finding: 'Extends the ladder to N=[44,52,60,68,76] (Legendre basis): floor stays order-10 positive (10.153235 at N=76) but decrements still accelerate through N~52, and cond(B) reaches 4.035e14 at N=76, ~1.5 decades from the IEEE-double edge.',
    wall: 'Gram double-precision conditioning wall (cond(B)~4e14 at N=76)',
  },
  {
    id: 'imp-97010',
    finding: 'Orthogonal Gegenbauer basis gives cond(B)=1 for all N, exposing the imp-96998 N=68/76 Legendre floors as already conditioning-corrupted; marching further at the SAME fixed T=300 collapses toward zero, but a T-sweep proves the collapse is a t-truncation artifact -- the floor recovers to ~20.1 (T-converged) at every collapsed rung.',
    wall: 'Fixed-T=300 truncation wall (revealed once the conditioning wall was removed)',
  },
]);

export const IMP97027_VERDICT = Object.freeze({
  ticket: 'imp-97027',
  question: 'is the true infinite-dim lambda_min(T_a[sigma_2]) at the a=0.48 (2a=0.96) certified endpoint settled after imp-96998 (extended N-ladder) and imp-97010 (orthogonal-basis fix)?',
  chain: IMP97027_CHAIN,
  conditioningWallRemoved: true,      // imp-97010 F1: cond(B)=1 for all N
  fixedTTruncationWallRevealed: true, // imp-97010 F3/F4: collapse past N~76 is a T=300 artifact
  trueFloorTConvergedEstimate: 20.13266, // imp-96835 reference the T-sweep climbs toward
  trueLimitSettled: false,
  subGap: 'IMP96977_TRUE_LIMIT_UNSETTLED STAYS OPEN -- two successive walls (Gram conditioning, then fixed-T truncation) have each been diagnosed and each removal shows the true floor is comfortably positive rather than collapsing, but no computation has yet marched N and T JOINTLY to a demonstrated fixed limit; the residual is exactly that joint (N,T) refinement (imp-96826 tconv route)',
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97027_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97027_ASSERTIONS = [
  {
    id: 'imp97027-chain-covers-all-four-modules-in-order',
    holds: () =>
      IMP97027_CHAIN.length === 4 &&
      IMP97027_CHAIN.map((c) => c.id).join(',') === 'imp-96977,imp-96994,imp-96998,imp-97010',
    why: 'the WHAT-REMAINS note must tabulate the full four-module thread in the order the true-limit question was raised (96977), found pre-asymptotic (96994), hit the conditioning wall (96998), and had that wall removed only to reveal a new one (97010).',
  },
  {
    id: 'imp97027-two-walls-named',
    holds: () =>
      /conditioning wall/.test(IMP97027_CHAIN[2].wall) &&
      /truncation wall/.test(IMP97027_CHAIN[3].wall),
    why: 'the honest status hinges on there being TWO distinct walls in sequence (Gram conditioning, then fixed-T truncation), not one wall that was simply fixed.',
  },
  {
    id: 'imp97027-true-limit-not-settled',
    holds: () =>
      IMP97027_VERDICT.trueLimitSettled === false &&
      IMP97027_VERDICT.conditioningWallRemoved === true &&
      IMP97027_VERDICT.fixedTTruncationWallRevealed === true &&
      IMP97027_VERDICT.trueFloorTConvergedEstimate > 20 &&
      /IMP96977_TRUE_LIMIT_UNSETTLED STAYS OPEN/.test(IMP97027_VERDICT.subGap),
    why: 'VERDICT LOCK: removing the conditioning wall (imp-97010) does not settle the true N -> infinity limit -- it only exposes the fixed-T truncation wall behind it; the sub-gap explicitly stays open pending a joint (N,T) refinement.',
  },
  {
    id: 'imp97027-honest-scope-locked',
    holds: () =>
      IMP97027_VERDICT.operatorPositivityProved === false &&
      IMP97027_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97027_VERDICT.qed === false,
    why: 'content synthesis only: no operator positivity is established, the interval-rigorous certificate reach stays exactly 2a<=0.96, and NO QED.',
  },
];

for (const a of IMP97027_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97027 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
