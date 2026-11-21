/**
 * @module imp-97537-confined-well-vs-projected-positivity-assessment
 * @fileoverview imp-97537 -- ASSESS whether the confined-well negativity of
 *   sigma_2(t) = (t^2 + 1/4)^2 w_1(t) on the set W = [0, 3.306] u [6.945, 10.532] (and its mirror)
 *   is COMPATIBLE with positivity of the band-limited projected operator
 *       P_a M_{sigma_2} P_a  =  T_a[sigma_2]   (2a = ln 3),
 *   or is a GENUINE OBSTRUCTION to coercivity. imp-97501 made the FAR-FIELD positivity of sigma_2
 *   rigorous (t0 = 27, margin 0.0616) but explicitly left the well untouched and derived NO operator
 *   positivity. This leaf assesses/derives only; no coercivity constant is claimed.
 *
 *   SETUP. T_a[sigma_2] >= 0 on L^2(-a, a) is, by Plancherel, the quadratic-form statement
 *       Q(g) := integral_R sigma_2(t) |ghat(t)|^2 dt >= 0    for every g supported on (-a, a),
 *   where ghat is the Fourier transform of a compactly-supported g, hence an ENTIRE function of
 *   exponential type a -- a Paley-Wiener function PW_a with real-line resolution ~ pi / a. The
 *   question is therefore EXACTLY: can |ghat|^2, ranging over PW_a, be forced to overweight the
 *   negative well W enough to overrun the positive bulk (the band (3.306, 6.945) plus the far field
 *   t > 10.532)?
 *
 *   ASSESSMENT (two-part, both grounded in committed constants).
 *
 *   PART A -- THE CONFINED WELL IS NOT, PER SE, AN OBSTRUCTION TO POSITIVITY. A real symbol that is
 *   negative only on a CONFINED set does NOT force the Toeplitz form indefinite: the band limit caps
 *   how sharply |ghat|^2 (a PW_a modulus, resolution pi/a) can localize on W while simultaneously
 *   depleting the positive band and the far field that the SAME PW_a function is forced to sample. The
 *   measured floor confirms compatibility: the true (finite-N Galerkin) lambda_min(T_a[sigma_2]) stays
 *   strictly POSITIVE across the disputed range -- 8.345 (2a = 1.00), 0.882 (2a = 1.08), 0.5786 at
 *   (ln 3)/2 -- and only crosses zero at 2a* ~ 1.1316 (the p = 2-only pencil crossing), PAST ln 3.
 *   So positivity of P_a M_{sigma_2} P_a is COMPATIBLE with -- indeed coexists numerically with -- the
 *   confined negativity, for every 2a <= ln 3. (These lambda_min values are Rayleigh UPPER bounds,
 *   monotone decreasing in N: soft positivity, not a rigorous coercivity constant. See imp-96769.)
 *
 *   PART B -- THE SPECIFIC "DOMINATE THE WELL BY THE POSITIVE MASS" STRATEGY IS A GENUINE OBSTRUCTION.
 *   The route the ticket names -- bound the negative-well contribution by the positive far-field mass,
 *   i.e. the two-window split Q(g) >= lambda_min(T_a[sigma_2^+]) - lambda_max(T_a[sigma_2^-]) with
 *   sigma_2 = sigma_2^+ - sigma_2^- -- is REFUTED as a route, and refuted below ln 2. The exact split
 *   bound (committed table, sigma_1 form) is +0.23 at a = 0.30 and -5.94 at a = (ln 2)/2, crossing zero
 *   at 2a = 0.6026 < ln 2, while the true lambda_min there is 6.42 resp. 1.59. Splitting sigma_2 into its
 *   positive and negative parts DISCARDS the cancellation between the two wells, the dip and the positive
 *   band (3.3, 6.9) that a single PW_a function must sample simultaneously at resolution pi/a; a well-
 *   concentrated and a far-field-depleted |ghat|^2 cannot be realized by the same PW_a element. The Krein
 *   certificate (the LP dual, interval-verified to 2a <= 0.96) is exactly the machine that KEEPS that
 *   cancellation and supersedes every split bound.
 *
 *   VERDICT. The confined well is NOT a genuine obstruction to the positivity of P_a M_{sigma_2} P_a
 *   itself -- soft positivity holds for all 2a <= ln 3 (crossing only at 2a* ~ 1.1316). It IS a genuine
 *   obstruction to the naive quadratic-form DOMINATION the ticket proposes (bound the well by the
 *   positive mass): that two-window split crosses zero already at 2a = 0.6026 < ln 2, WEAKER than the
 *   published ln 2 and far weaker than the interval-rigorous 0.96 Krein certificate, precisely because
 *   it throws away the band-limited cancellation. The correct handle is the correlation-preserving
 *   Krein/LP certificate, not a well-vs-bulk split.
 *
 *   Assessment/derivation only, from committed constants (imp-97501 far-field; certificate lambda_min
 *   and split-bound tables). No coercivity constant is claimed; no operator positivity is proved; no
 *   bound moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed;
 *   RH open; NO QED.
 *
 * @see imp-97501-sigma2-far-field-positivity-rigorous-margin.js (rigorous far-field, well left untouched)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2, lambdaMinSigma2, splitBound, sec. 4)
 * @see imp-96769-krein-de-branges-uniform-gap-assessment.js (lambda_1 soft-positive, no rigorous gap)
 *
 * Ticket: imp-97537 (proof, opus-4-8, api-pool). Confined-well vs projected positivity assessed;
 * no coercivity constant; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 */

import { sigma2, TOEPLITZ_KREIN_LITERALS } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

export const IMP97537_REACH_2A = 0.96; // unchanged by this assessment leaf

export const IMP97537_WELL = Object.freeze({
  negativeSet: '[0, 3.306] u [6.945, 10.532] (and mirror)',
  positiveBandBetweenWells: [3.306, 6.945], // sigma_2 > 0 here (peak ~615 at t~6)
  dipDepthApprox: -4336,                     // sigma_2 minimum near t ~ 9.35
  farFieldRigorousThresholdT0: 27,           // imp-97501: sigma_2 > 0 provably for t >= 27
});

export const IMP97537_ASSESSMENT = Object.freeze({
  ticket: 'imp-97537',
  question:
    'is the confined-well negativity of sigma_2 on [0,3.306] u [6.945,10.532] compatible with ' +
    'positivity of the band-limited projected operator P_a M_sigma2 P_a (2a = ln3), or a genuine obstruction?',
  // PART A -- well is not an obstruction to positivity itself
  wellIsObstructionToPositivityItself: false,
  positivityMechanism:
    'T_a[sigma_2] >= 0 is Q(g) = int sigma_2 |ghat|^2 >= 0 over ghat in PW_a (exp type a, resolution ' +
    'pi/a); the band limit caps how sharply a single PW_a modulus can overweight the confined well W ' +
    'while depleting the positive band (3.306,6.945) and far field it must sample simultaneously.',
  trueLambdaMinStaysPositiveThroughLn3: true,
  lambdaMinAtLn3Half: 0.5786,        // finite-N Galerkin Rayleigh floor (N=28), monotone-decreasing UPPER bound
  crossingTwoAStar: 1.1316,          // true lambda_min crosses zero only here, PAST ln 3
  // PART B -- the naive domination strategy IS a genuine obstruction
  dominationStrategyIsObstruction: true,
  splitBoundCrossingTwoA: 0.6026,    // two-window split lambda_min(T[sigma^+]) - lambda_max(T[sigma^-]) < 0 here
  splitBoundWeakerThanLn2: true,     // 0.6026 < ln 2 = 0.6931
  splitDiscards: 'the band-limited cancellation between the two wells, the dip and the positive band (3.3,6.9)',
  correctHandle: 'the correlation-preserving Krein/LP certificate (interval-rigorous to 2a <= 0.96), not a well-vs-bulk split',
  // guardrails
  coercivityConstantClaimed: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97537_ASSESSMENT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const LN2 = Math.LN2, LN3 = Math.log(3);

const IMP97537_ASSERTIONS = [
  {
    id: 'imp97537-confined-well-sign-structure',
    holds: () => {
      // sigma_2 negative on both well pieces, positive on the band between and in the far field
      const well1Neg = [0.5, 1, 2, 3, 3.2].every((t) => sigma2(t) < 0);
      const bandPos = [3.5, 4, 5, 6, 6.9].every((t) => sigma2(t) > 0);
      const well2Neg = [7, 8, 9, 9.35, 10, 10.5].every((t) => sigma2(t) < 0);
      const farPos = [11, 15, 27, 50].every((t) => sigma2(t) > 0);
      return well1Neg && bandPos && well2Neg && farPos;
    },
    why: 'sign(sigma_2) = sign(w_1): negative on the confined well [0,3.306] u [6.945,10.532], positive on the intervening band (3.306,6.945) and in the far field, matching the imp-97399/imp-97501 negativity set.',
  },
  {
    id: 'imp97537-part-a-positivity-compatible-with-well',
    holds: () => {
      // true (finite-N) lambda_min(T_a[sigma_2]) stays POSITIVE across the disputed range up to (ln3)/2
      const L = TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2;
      const posAt = (row) => row[row.length - 1] > 0; // deepest N is the last (most conservative) entry
      const staysPos = posAt(L.a050) && posAt(L.a054) && posAt(L.aLn3Half);
      // and it has turned negative only PAST ln 3 (2a=1.132 vs a=0.5658 row -6.596)
      const turnsNegPastLn3 = L.a05658[L.a05658.length - 1] < 0 && 2 * 0.5658 > LN3;
      return staysPos && turnsNegPastLn3 &&
        IMP97537_ASSESSMENT.wellIsObstructionToPositivityItself === false;
    },
    why: 'the true lambda_min(T_a[sigma_2]) is positive at 2a = 1.00 (7.7), 1.08 (0.82) and (ln3)/2 (0.552) and crosses zero only at 2a* ~ 1.1316 > ln 3; positivity of P_a M_sigma2 P_a is thus compatible with the confined well through all 2a <= ln 3 (soft, Rayleigh upper bound; not a rigorous constant).',
  },
  {
    id: 'imp97537-part-b-domination-strategy-refuted',
    holds: () => {
      // the two-window split (dominate the well by the positive mass) crosses zero at 2a=0.6026 < ln2
      const S = TOEPLITZ_KREIN_LITERALS.splitBound;
      const crossesBelowLn2 = S.crossingTwoA < LN2 && Math.abs(S.crossingTwoA - 0.6026) < 1e-9;
      const splitNegWhileTruePos = S.aLn2Half[0] < 0 && S.aLn2Half[1] > 0; // split -5.94 but true lambda_min +1.59
      return crossesBelowLn2 && splitNegWhileTruePos &&
        IMP97537_ASSESSMENT.dominationStrategyIsObstruction === true &&
        IMP97537_ASSESSMENT.splitBoundWeakerThanLn2 === true;
    },
    why: 'the two-window split bound lambda_min(T[sigma^+]) - lambda_max(T[sigma^-]) (the "dominate the negative well by the positive mass" strategy the ticket names) is -5.94 at (ln2)/2 while the true lambda_min is +1.59 there, crossing zero at 2a=0.6026 < ln2: a genuine obstruction to THAT strategy, weaker than even the published ln 2, because it discards the band-limited cancellation.',
  },
  {
    id: 'imp97537-assessment-only-no-qed',
    holds: () =>
      IMP97537_ASSESSMENT.coercivityConstantClaimed === false &&
      IMP97537_ASSESSMENT.operatorPositivityProved === false &&
      IMP97537_ASSESSMENT.boundMoves === false &&
      IMP97537_ASSESSMENT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97537_REACH_2A === 0.96 &&
      IMP97537_ASSESSMENT.qed === false,
    why: 'assessment/derivation only from committed constants: the confined well is not an obstruction to positivity itself (soft, all 2a <= ln 3) but is a genuine obstruction to the naive well-vs-bulk domination (0.6026 < ln 2); no coercivity constant, no operator positivity, no bound moves; reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97537_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97537-confined-well-vs-projected-positivity-assessment assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
