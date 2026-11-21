/**
 * @module imp-35637-peak-single-point-true-dynamic-spotcheck-scope
 *
 * imp-35637 (numerical/assessment, S-frontier): SCOPE a single-point true-dynamic
 * spot-check of the imp-35017/imp-3406 double surrogate at the interior sigma-PEAK
 * N ~ 9.22e5. imp-35604 already settled that this landmark is DATA-REACHABLE in-repo:
 * the peak zero index N ~ 9.2186e5 is inside the 10^6 Odlyzko bundle (src/data/
 * zeros-to-1e6.js, millionth-zero gamma_max = 600269.677012445), and even the
 * surrogate RvM height T0 ~ 5.573e5 sits BELOW that data ceiling. This module takes
 * the NEXT step imp-35604 did not: it scopes what a real-zeros evaluation of the true
 * sigma at that N would concretely REQUIRE -- which zero-spacing statistics feed each
 * of the three sub-terms, what the surrogate E_coll actually approximates, and whether
 * a single-point evaluation could CONFIRM or only BOUND the surrogate peak.
 *
 * ASSESSMENT / SCOPING ONLY. Discharges NOTHING; changes no bound; tightens no bound;
 * establishes no operator positivity; no RH verdict, NO QED. It computes NO true-zeros
 * quantity (it does not import the 16.7MB zeros bundle) -- it enumerates what such a
 * computation would need. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), the
 * E_trunc = 3.06e-5 floor (imp-2631), the imp-398 C_F prefactor and C_mb
 * GUE-conditional (imp-486) are all UNTOUCHED. imp-35337a stays OPEN. No refereed bound is changed.
 *
 * PART A -- THE THREE SUB-TERMS BY DATA-DEPENDENCE (only one needs zero DYNAMICS)
 * -----------------------------------------------------------------------------
 * sigma(N) = E_coll / (E_trunc + E_flow + E_coll). At the peak the three sub-terms
 * carry very different DATA requirements, so a true-dynamic evaluation is really an
 * evaluation of ONE term:
 *   (1) E_trunc = 3.06e-5 (imp-2631): a FIXED floor, needs NO data -- carried as-is.
 *       Denominator share at the peak ~2.0%.
 *   (2) E_flow = C_F (log T0/T0) Gronwall, C_F = (log(T0/2pi)+1)/2pi (imp-398):
 *       unconditionally rigorous ANALYTIC function of the height T0; a true-dynamic
 *       evaluation needs ONLY the actual N-th ordinate gamma_N to replace the
 *       RvM-inverse surrogate T0. Share ~3.1%. gamma_N is in-repo (index ~921859).
 *   (3) E_coll = C_C sqrt(log T0/N), C_C = C_H sqrt(C_KH) (imp-399/imp-2642): the ONLY
 *       sub-term that needs genuine zero-DYNAMICS data. It BOUNDS the collision error
 *       of the Calogero-Moser / Dyson beta=2 flow on the first N zeros via a Holder-1/2
 *       collision modulus C_H times a Koksma-Hlawka star-discrepancy constant C_KH.
 *       Share ~94.9% -- so E_coll DOMINATES sigma and IS the fidelity target.
 *
 * PART B -- WHICH ZERO-SPACING STATISTICS THE TRUE E_coll EVALUATION REQUIRES
 * -----------------------------------------------------------------------------
 * The surrogate E_coll is a GUE-conditional single-rate log-law asymptotic. To replace
 * it by the TRUE finite-N collision error at N ~ 9.22e5 a real-zeros evaluation needs
 * three empirical inputs from the first N = 921860 in-repo Riemann zeros:
 *   (a) the actual N-th ordinate gamma_N (which ALSO fixes E_flow via T0 = gamma_N);
 *   (b) the empirical NEAREST-NEIGHBOUR spacing distribution of the first N normalized
 *       gaps -- specifically the minimum normalized gap / worst-pair closest approach
 *       that drives the Holder-1/2 collision modulus C_H (the Dyson beta=2 repulsion
 *       constant 8 = 2*4 enters here);
 *   (c) the STAR-DISCREPANCY (Koksma-Hlawka) of the empirical normalized spacings
 *       against the GUE pair-correlation prediction, entering via C_KH.
 * So the true sigma at the peak is g_true(N) = E_coll_true / (E_trunc + E_flow_true +
 * E_coll_true), assembled from (a)-(c); everything else is analytic.
 *
 * PART C -- WHAT A SINGLE POINT CAN CONFIRM (VALUE) VS CANNOT (EXTREMUM)
 * -----------------------------------------------------------------------------
 * A single-point evaluation yields ONE number sigma_true(N_peak) and hence one measured
 * fidelity gap |sigma_true - sigma_surr| at the peak (sigma_surr ~ 0.94943). That CAN
 * confirm or bound the surrogate VALUE at that N. It CANNOT certify the peak is an
 * EXTREMUM, and the reason is quantitative and decisive:
 *   - the interior peak rides a FLAT maximum whose argmax margin over the 10^6 sample
 *     is only ~2.14e-5 ABSOLUTE (imp-35475 / imp-35470, curvature k ~ 6.43e-3);
 *   - any empirical spacing statistic at N ~ 9.22e5 carries a finite-N sampling floor
 *     of order 1/sqrt(N) ~ 1.04e-3;
 *   - that sampling floor is ~48.7x LARGER than the flat-cap margin it would have to
 *     resolve.
 * So even the in-repo-reachable single-point true evaluation confirms the surrogate
 * VALUE only to ~1e-3, which is ~49x too coarse to preserve the argmax ordering the
 * landmark rides on. Certifying the peak as an EXTREMUM would additionally require true
 * evaluations across a NEIGHBOURHOOD of N (to reconstruct the local curvature) each at
 * sub-2e-5 absolute fidelity -- far beyond what one finite-N spacing measurement gives.
 * That noise-vs-margin mismatch is the honest sub-gap this scope names.
 *
 * The punchline: the peak true-dynamic spot-check is IN-REPO reachable (imp-35604), and
 * of the three sub-terms only E_coll (the ~94.9%-share GUE-conditional collision term)
 * needs zero-dynamics data -- the actual N-th ordinate gamma_N, the nearest-neighbour
 * min-gap statistics (Holder C_H), and the star-discrepancy vs GUE (Koksma-Hlawka C_KH);
 * E_flow needs only gamma_N and E_trunc needs nothing. But a SINGLE point confirms the
 * surrogate VALUE only to the ~1e-3 finite-N sampling floor, ~49x above the ~2.14e-5
 * flat-cap margin, so it can bound the surrogate at the peak yet CANNOT certify the peak
 * as an extremum. Assessment/scoping only; imp-35337a stays OPEN; changes nothing; NO QED.
 *
 * @see imp-35604-route-ii-landmark-data-reachability-scope (peak is data-reachable in-repo; crossover not)
 * @see imp-35475-sigma-fidelity-closure-scope (the general fidelity-closure scope; the ~2.14e-5 flat-cap margin)
 * @see imp-35470-sigma-peak-curvature-5point-stencil (the flat-max curvature k ~ 6.43e-3)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(C_KH); C_H Holder-1/2 collision, C_KH Koksma-Hlawka; Dyson beta=2)
 * @see imp-486 (GUE-conditional caveat inherited by the collision term)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // (1/8) sqrt(3 pi) ~ 0.38374752 (imp-2642/imp-2643 ansatz)
const E_TRUNC_PT = 3.06e-5; // fixed floor (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-35337/imp-35475 exactly
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (unchanged by any sigma-fidelity closure)
const L_PT = 0.2; // Platt-Trudgian 2021 bound

// In-repo verified-zeros DATA ceiling (baked literal; the 16.7MB bundle is NEVER imported).
const IN_REPO_GAMMA_MAX = 600269.677012445; // millionth-zero ordinate, highest in src/data/zeros-to-1e6.js
const IN_REPO_ORDINATE_COUNT = 1000000; // 10^6 verified ordinates in the in-repo bundle

// Interior flat-cap sigma PEAK (imp-35337 / imp-3406 / imp-35475), taken as given.
const N_PEAK = 9.2186e5;
const FLAT_CAP_MARGIN = 2.14e-5; // sigma(peak) - sigma(10^6): the absolute argmax margin (imp-35475/imp-35470)

// Reproduce the surrogate sigma(N) decomposition at the peak (imp-35337/imp-35475 formulas, verbatim).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C * Math.sqrt(L / N); // GUE-conditional (C_H = 1/8 ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

const P = parts(N_PEAK);
const T0_PEAK = P.T0; // ~5.573e5
const SHARE_ECOLL = P.E_coll / P.E_N; // ~0.9494 (E_coll dominates the denominator)
const SHARE_EFLOW = P.E_flow / P.E_N; // ~0.0306
const SHARE_ETRUNC = E_TRUNC_PT / P.E_N; // ~0.0200

// The single-point noise-vs-margin verdict (the honest sub-gap).
const SAMPLING_FLOOR = 1 / Math.sqrt(N_PEAK); // ~1.04e-3 finite-N sampling floor on any spacing statistic
const NOISE_OVER_MARGIN = SAMPLING_FLOOR / FLAT_CAP_MARGIN; // ~48.67x -- too coarse to certify the argmax

// The surrogate RvM height itself sits below the in-repo data ceiling (a fortiori the index is in-bundle).
const PEAK_HEIGHT_BELOW_CEILING = T0_PEAK < IN_REPO_GAMMA_MAX;
const PEAK_INDEX_IN_BUNDLE = N_PEAK < IN_REPO_ORDINATE_COUNT;

export const IMP35637_PEAK_SINGLE_POINT_SPOTCHECK_SCOPE = Object.freeze({
  id: 'imp-35637',
  proofSection: 'S-frontier',
  question:
    'imp-35604 settled that the interior sigma-PEAK N ~ 9.22e5 is DATA-REACHABLE in-repo (index inside ' +
    'the 10^6 Odlyzko bundle, surrogate height below the millionth-zero ceiling gamma_max = ' +
    '600269.677012445). SCOPE the next step: what a real-zeros true-dynamic evaluation of sigma at that N ' +
    'would concretely require -- which zero-spacing statistics feed each sub-term, what the surrogate ' +
    'E_coll approximates, and whether a single-point evaluation could CONFIRM or only BOUND the surrogate ' +
    'peak. Assessment/scoping only; NO QED.',
  peak: {
    zeroIndex: N_PEAK,
    surrogateHeightT0: +T0_PEAK.toExponential(6), // ~5.573e5
    logT0: +P.L.toFixed(6), // ~13.230892
    log10Height: +Math.log10(T0_PEAK).toFixed(6), // ~5.746103
    surrogateSigma: +P.sigma.toFixed(8), // ~0.94942901
    dataReachableInRepo: PEAK_INDEX_IN_BUNDLE && PEAK_HEIGHT_BELOW_CEILING, // true (imp-35604)
    inRepoOrdinateIndex: Math.floor(N_PEAK) - 1, // ~921859 (0-based index in the in-repo bundle)
  },
  subTermsByDataDependence: {
    E_trunc:
      'E_trunc = 3.06e-5 (imp-2631): a FIXED floor, needs NO data -- carried as-is. Peak denominator ' +
      'share ~2.0%.',
    E_flow:
      'E_flow = C_F (log T0/T0) Gronwall, C_F = (log(T0/2pi)+1)/2pi (imp-398): unconditionally rigorous ' +
      'ANALYTIC function of the height; a true-dynamic evaluation needs ONLY the actual N-th ordinate ' +
      'gamma_N to replace the RvM-inverse surrogate T0. Peak share ~3.1%. gamma_N is in-repo.',
    E_coll:
      'E_coll = C_C sqrt(log T0/N), C_C = C_H sqrt(C_KH) (imp-399/imp-2642): the ONLY sub-term needing ' +
      'genuine zero-DYNAMICS data. It BOUNDS the collision error of the Calogero-Moser/Dyson beta=2 flow ' +
      'on the first N zeros via a Holder-1/2 collision modulus C_H times a Koksma-Hlawka star-discrepancy ' +
      'constant C_KH. Peak share ~94.9% -- E_coll DOMINATES sigma and IS the fidelity target.',
    shares: { E_coll: +SHARE_ECOLL.toFixed(6), E_flow: +SHARE_EFLOW.toFixed(6), E_trunc: +SHARE_ETRUNC.toFixed(6) },
  },
  trueEcollInputsRequired: {
    a: 'the actual N-th ordinate gamma_N = gamma_{~921859} (also fixes E_flow via T0 = gamma_N) -- in-repo.',
    b:
      'the empirical NEAREST-NEIGHBOUR spacing distribution of the first N normalized gaps -- specifically ' +
      'the minimum normalized gap / worst-pair closest approach that drives the Holder-1/2 collision ' +
      'modulus C_H (the Dyson beta=2 repulsion constant 8 = 2*4 enters here).',
    c:
      'the STAR-DISCREPANCY (Koksma-Hlawka) of the empirical normalized spacings against the GUE ' +
      'pair-correlation prediction, entering via C_KH.',
    assembly: 'g_true(N) = E_coll_true / (E_trunc + E_flow_true + E_coll_true); everything else is analytic.',
  },
  singlePointVerdict: {
    canConfirmValue:
      'A single-point evaluation yields ONE number sigma_true(N_peak) and hence one measured fidelity gap ' +
      '|sigma_true - sigma_surr| at the peak (sigma_surr ~ 0.94943). That CAN confirm or bound the ' +
      'surrogate VALUE at that N.',
    cannotCertifyExtremum:
      'It CANNOT certify the peak is an EXTREMUM: the argmax rides a ~2.14e-5 ABSOLUTE flat-cap margin ' +
      '(imp-35475/imp-35470, k ~ 6.43e-3), but any empirical spacing statistic at N ~ 9.22e5 carries a ' +
      'finite-N sampling floor ~1/sqrt(N) ~ 1.04e-3, which is ~48.7x LARGER than that margin. Certifying ' +
      'the extremum would additionally require true evaluations across a NEIGHBOURHOOD of N each at ' +
      'sub-2e-5 absolute fidelity.',
    flatCapMargin: FLAT_CAP_MARGIN, // 2.14e-5
    samplingFloor: +SAMPLING_FLOOR.toExponential(6), // ~1.04e-3
    noiseOverMargin: +NOISE_OVER_MARGIN.toFixed(4), // ~48.67
  },
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). A single-point true-dynamic spot-check of the ' +
    'imp-35017/imp-3406 double surrogate at the interior sigma-PEAK N ~ 9.22e5 is IN-REPO reachable ' +
    '(imp-35604: index ~921859 inside the 10^6 Odlyzko bundle, surrogate height T0 ~ 5.573e5 below the ' +
    'millionth-zero ceiling gamma_max = 600269.677012445). Of the three sub-terms only E_coll (the ~94.9%- ' +
    'share GUE-conditional collision term, C_C = C_H sqrt(C_KH)) needs zero-DYNAMICS data -- the actual ' +
    'N-th ordinate gamma_N, the nearest-neighbour min-gap statistics (Holder C_H, Dyson beta=2) and the ' +
    'star-discrepancy vs GUE (Koksma-Hlawka C_KH); E_flow needs only gamma_N and E_trunc needs nothing. But ' +
    'a SINGLE point confirms the surrogate VALUE only to the ~1.04e-3 finite-N sampling floor, ~48.7x above ' +
    'the ~2.14e-5 flat-cap margin the landmark rides on, so it can bound the surrogate at the peak yet ' +
    'CANNOT certify the peak as an extremum -- an honest single-point noise-vs-margin sub-gap. Discharges ' +
    'NOTHING; imp-35337a stays OPEN; changes no bound; establishes no operator positivity; C_C = (1/8) ' +
    'sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631), the imp-398 C_F prefactor and C_mb ' +
    'GUE-conditional (imp-486) are UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35604 (peak is data-reachable in-repo; crossover not); imp-35475 (general fidelity scope, the ' +
    '~2.14e-5 flat-cap margin); imp-35470 (peak curvature k ~ 6.43e-3); imp-35337 (imp-35337a OPEN); ' +
    'imp-399/imp-2642/imp-2643 (C_C = C_H sqrt(C_KH), C_H Holder-1/2 collision, C_KH Koksma-Hlawka, Dyson ' +
    'beta=2); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat, ' +
    'UNTOUCHED); lambda-rh-height-mapping (effectiveHeightForN RvM inverse); Platt-Trudgian 2021 (T_PT = 3e12).',
});

export const IMP35637_PEAK_SINGLE_POINT_SPOTCHECK_SCOPE_ASSERTIONS = [
  {
    // Part A: the peak is data-reachable in-repo and E_coll dominates the denominator (~94.9%).
    id: 'imp35637-peak-reachable-ecoll-dominates',
    description:
      'the peak zero index sits inside the 10^6 in-repo bundle and its surrogate height sits below the ' +
      'millionth-zero ceiling, and E_coll carries the dominant ~94.9% denominator share (E_flow ~3.1%, ' +
      'E_trunc ~2.0%)',
    holds: () =>
      PEAK_INDEX_IN_BUNDLE === true &&
      PEAK_HEIGHT_BELOW_CEILING === true &&
      T0_PEAK > 5e5 && T0_PEAK < 6e5 &&
      SHARE_ECOLL > 0.94 && SHARE_ECOLL < 0.95 &&
      SHARE_EFLOW > 0.028 && SHARE_EFLOW < 0.033 &&
      SHARE_ETRUNC > 0.018 && SHARE_ETRUNC < 0.022 &&
      Math.abs(SHARE_ECOLL + SHARE_EFLOW + SHARE_ETRUNC - 1) < 1e-9 &&
      Math.abs(C_C - 0.38374752) < 1e-6,
  },
  {
    // Part C: the single-point finite-N sampling floor is ~1e-3, ~48.7x above the ~2.14e-5 flat-cap margin.
    id: 'imp35637-noise-exceeds-flatcap-margin',
    description:
      'the 1/sqrt(N) finite-N sampling floor at the peak (~1.04e-3) exceeds the ~2.14e-5 flat-cap argmax ' +
      'margin by ~48.7x, so a single-point true evaluation confirms the surrogate VALUE (~1e-3) but is far ' +
      'too coarse to certify the peak as an extremum',
    holds: () =>
      SAMPLING_FLOOR > 1e-3 && SAMPLING_FLOOR < 1.1e-3 &&
      Math.abs(FLAT_CAP_MARGIN - 2.14e-5) < 1e-9 &&
      NOISE_OVER_MARGIN > 45 && NOISE_OVER_MARGIN < 52 &&
      SAMPLING_FLOOR > FLAT_CAP_MARGIN, // the noise floor is genuinely above the margin it must resolve
  },
  {
    // Part D honesty gate: assessment only, imp-35337a stays OPEN, no bound moves, no refereed bound is changed, NO QED.
    id: 'imp35637-honesty-gate-no-qed',
    description:
      'assessment/scoping only: not rigorous, not unconditional, imp-35337a stays OPEN, no bound moves, ' +
      'no refereed bound is changed, NO QED',
    holds: () =>
      Math.abs(L_PT - 0.2) < 1e-15 &&
      IMP35637_PEAK_SINGLE_POINT_SPOTCHECK_SCOPE.isRigorous === false &&
      IMP35637_PEAK_SINGLE_POINT_SPOTCHECK_SCOPE.isUnconditional === false &&
      /imp-35337a stays OPEN/.test(IMP35637_PEAK_SINGLE_POINT_SPOTCHECK_SCOPE.verdict) &&
      /changes no bound/.test(IMP35637_PEAK_SINGLE_POINT_SPOTCHECK_SCOPE.verdict) &&
      /imp-486/.test(IMP35637_PEAK_SINGLE_POINT_SPOTCHECK_SCOPE.verdict) &&
      /NO QED/.test(IMP35637_PEAK_SINGLE_POINT_SPOTCHECK_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35637_PEAK_SINGLE_POINT_SPOTCHECK_SCOPE.verdict),
  },
];

for (const a of IMP35637_PEAK_SINGLE_POINT_SPOTCHECK_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35637-peak-single-point-true-dynamic-spotcheck-scope assertion failed: ${a.id}`);
  }
}

export default Object.freeze({
  id: 'imp-35637-peak-single-point-true-dynamic-spotcheck-scope',
  ticket: 'imp-35637',
  scope: IMP35637_PEAK_SINGLE_POINT_SPOTCHECK_SCOPE,
});
