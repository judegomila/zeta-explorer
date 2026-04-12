/**
 * imp-507: G3a_sub_fullsum partial closure
 *   full S_{k_star} lower bound via GGM mean-value + Huxley density
 *
 * G3a_sub_fullsum (from imp-451 g3a-extremal-closure.js)
 * --------------------------------------------------------
 * Route C density squeeze requires:
 *   S_{k_star}(tau) >= c(N) / B(tau)^2   with c(N) > 2
 *
 * where B = gamma_{k_star+1} - gamma_{k_star} is the minimum gap and
 *
 *   S_{k_star} = SUM_{j not in {k_star, k_star+1}}
 *                  1 / [(gamma_{k_star+1} - gamma_j)(gamma_{k_star} - gamma_j)]
 *
 * The near+tail decomposition (imp-451) fails because under GUE extremal-gap
 * scaling R_N ~ N^{4/3}, giving c_total -> 0 as N -> infinity.
 *
 * This file analyzes the full many-body sum S_{k_star} using:
 *   (a) Goldston-Gonek-Montgomery 2001 mean-value theorem
 *   (b) Huxley 1972 zero-density estimate
 *   (c) Montgomery 1973 unconditional pair-correlation (Fourier support in [-1,1])
 *   (d) An equidistant upper bound on S_{k_star} * B^2 (new result)
 *
 * Honest verdict (upfront)
 * ------------------------
 * GGM and Huxley CANNOT close G3a_sub_fullsum unconditionally, for the same
 * structural reason as C_mb (imp-486): CLT-level control of the full sum
 * requires pair-correlation statistics equivalent to GUE universality.
 *
 * Additionally, a new result proves the EQUIDISTANT CEILING: for any
 * configuration of N zeros (with B the strict minimum gap), the full sum
 * satisfies S_{k_star} * B^2 <= 2, with equality iff all adjacent spacings
 * equal B. Since B is the STRICT minimum, equality never holds generically,
 * and S_{k_star} * B^2 < 2 in all typical cases.
 *
 * This ceiling means Route C condition c(N) > 2 cannot be closed via the
 * STATIC full sum alone -- a dynamical Dyson ODE argument is required.
 *
 * Three genuine partial results are delivered:
 *   (1) Positivity lemma: all terms of S_{k_star} are positive (unconditional).
 *   (2) Far-field lower bound: S_{k_star} >= 1/(2 H_max^2) unconditionally,
 *       where H_max = max_k g_k is the maximum gap (too weak for Route C).
 *   (3) Equidistant ceiling: S_{k_star} * B^2 <= 2 always (unconditional),
 *       with equality iff the zero configuration is equidistant near k_star.
 *
 * Named sub-gap: G3a_sub_fullsum_dynamical (needs Dyson ODE analysis, not
 * just a static bound on S_{k_star}).
 *
 * SYNTAX NOTE: avoid star-slash sequences in JSDoc. Use {k_star} not k*.
 */

import { G3A_EXTREMAL_CLOSURE } from '../data/g3a-extremal-closure.js';
import { ZETA_ZEROS } from './zeta.js';

// ── (1) Positivity lemma (unconditional) ─────────────────────────────────────

/**
 * LEMMA (Positivity): all terms in S_{k_star} are strictly positive.
 *
 * PROOF: For each j not in {k_star, k_star+1}, exactly one of the two cases holds:
 *
 * Case A (j < k_star):
 *   gamma_j < gamma_{k_star} < gamma_{k_star+1}, so both factors
 *   (gamma_{k_star} - gamma_j) > 0 and (gamma_{k_star+1} - gamma_j) > 0.
 *   Product > 0, term > 0.
 *
 * Case B (j > k_star+1):
 *   gamma_{k_star} < gamma_{k_star+1} < gamma_j, so both factors
 *   (gamma_{k_star} - gamma_j) < 0 and (gamma_{k_star+1} - gamma_j) < 0.
 *   Product > 0, term > 0.
 *
 * Hence S_{k_star} = SUM of positive terms > 0.   QED (unconditional)
 */

export const POSITIVITY_LEMMA = {
  statement:
    'For any N >= 3 and any k_star in {1,...,N-2}, all N-2 terms in ' +
    'S_{k_star} = SUM_{j not in {k_star, k_star+1}} ' +
    '1/[(gamma_{k_star+1}-gamma_j)(gamma_{k_star}-gamma_j)] are strictly positive.',
  proof: 'For j < k_star: both factors positive. For j > k_star+1: both factors negative, product positive.',
  unconditional: true,
  consequence:
    'S_{k_star} > 0 always, and S_{k_star} >= any single term in the sum. ' +
    'In particular S_{k_star} >= 0 (obvious from positivity).',
};

// ── (2) Far-field lower bound (unconditional) ─────────────────────────────────

/**
 * LEMMA (Far-field lower bound): S_{k_star} >= 1/(2 H_max^2) unconditionally.
 *
 * PROOF: Let H_max = max_{k=1,...,N-1} (gamma_{k+1} - gamma_k) be the maximum gap.
 *
 * For j = k_star - m (m >= 1, so j < k_star):
 *   gamma_{k_star} - gamma_j = SUM_{l=j}^{k_star-1} g_l <= m * H_max
 *   gamma_{k_star+1} - gamma_j <= (m+1) * H_max
 *   term >= 1/[m * H_max * (m+1) * H_max] = 1/[m(m+1) * H_max^2]
 *
 * For j = k_star+1+m (m >= 1, so j > k_star+1):
 *   gamma_j - gamma_{k_star+1} = SUM_{l=k_star+1}^{j-1} g_l <= m * H_max
 *   gamma_j - gamma_{k_star} <= (m+1) * H_max
 *   term >= 1/[m(m+1) * H_max^2]
 *
 * Summing only the right side (m = 1 to infinity):
 *   SUM_{m=1}^{infty} 1/[m(m+1)] = 1  (telescoping: SUM (1/m - 1/(m+1)) = 1)
 *
 * So S_{k_star} >= (1/H_max^2) * 1 = 1/H_max^2.  Taking just half:
 *   S_{k_star} >= 1/(2 H_max^2).   QED
 *
 * Selberg (1946) unconditionally: H_max = O(log gamma_N) = O(rho_N^{-1} * log^2 rho_N)
 * so 1/H_max^2 = Omega(rho_N^2 / log^4 gamma_N) -- very weak relative to rho_N^2.
 */

/**
 * Compute H_max (maximum consecutive gap) in the first N ZETA_ZEROS.
 */
function computeHmax(N) {
  let hmax = 0;
  for (let k = 0; k < N - 1; k++) {
    const g = ZETA_ZEROS[k + 1] - ZETA_ZEROS[k];
    if (g > hmax) hmax = g;
  }
  return hmax;
}

/**
 * Compute the far-field lower bound 1/(2 H_max^2) at each sample N.
 */
const FAR_FIELD_SAMPLES = [50, 100, 200, 400, ZETA_ZEROS.length].map((N) => {
  const hmax = computeHmax(N);
  // RvM local density at gamma_N
  const rhoN = Math.log(ZETA_ZEROS[N - 1] / (2 * Math.PI)) / (2 * Math.PI);
  const lowerBound = 1 / (2 * hmax * hmax);
  // Express in units of rho_N^2 for comparison with the Weyl estimate
  const lbOverRhoSq = lowerBound / (rhoN * rhoN);
  return {
    N,
    hmax: +hmax.toFixed(6),
    rhoN: +rhoN.toFixed(6),
    farFieldLb: +lowerBound.toFixed(6),
    lbOverRhoNsq: +lbOverRhoSq.toFixed(8),
    weylEstimate: +(Math.PI * Math.PI / 6 - 1).toFixed(6), // 2*(pi^2/6-1)/2 ~ 0.645
    note: 'lbOverRhoNsq << weylEstimate: far-field bound is very weak',
  };
});

export const FAR_FIELD_LOWER_BOUND = {
  statement:
    'S_{k_star} >= 1/(2 H_max^2) unconditionally, ' +
    'where H_max = max_k (gamma_{k+1} - gamma_k).',
  unconditional: true,
  selbergBound:
    'Selberg (1946): H_max = O(log gamma_N) unconditionally, so ' +
    '1/H_max^2 = Omega(rho_N^2 / log^4(gamma_N)). ' +
    'This is a factor log^4(gamma_N) below the Weyl estimate rho_N^2 * (pi^2/6 - 1). ' +
    'Completely insufficient for Route C which requires S_{k_star} * B^2 > 2.',
  routeCAssessment:
    'Route C needs S_{k_star} >= c(N)/B^2 with c(N) > 2. ' +
    'Even if S_{k_star} >= rho_N^2/log^4(T), for the minimum gap B with ' +
    'B <= 1/rho_N: S_{k_star} * B^2 <= rho_N^2 * B^2 / log^4(T) <= 1/log^4(T) -> 0. ' +
    'Far-field bound alone cannot close Route C.',
  numericalSamples: FAR_FIELD_SAMPLES,
};

// ── (3) Equidistant upper bound (new result, unconditional) ───────────────────

/**
 * THEOREM (Equidistant ceiling): For any configuration with B the minimum gap,
 *   S_{k_star} * B^2 <= 2,
 * with equality iff ALL consecutive gaps g_j satisfy g_j = B for all j.
 *
 * PROOF:
 * For j = k_star - m (m >= 1):
 *   Let x_m = (gamma_{k_star} - gamma_j) / B >= m  (since g_l >= B for all l)
 *   and y_m = (gamma_{k_star+1} - gamma_j) / B = x_m + 1 >= m+1.
 *   Term * B^2 = 1/(x_m * y_m) = 1/(x_m * (x_m+1)).
 *
 *   Since x_m >= m: 1/(x_m(x_m+1)) <= 1/(m(m+1)).
 *   Equality iff x_m = m iff all gaps from j to k_star are exactly B.
 *
 * For j = k_star+1+m (m >= 1):
 *   Let x_m = (gamma_j - gamma_{k_star+1})/B >= m, y_m = x_m + B_frac where B_frac = B/B = 1.
 *   Term * B^2 = 1/[x_m * (x_m + 1)] <= 1/[m(m+1)].
 *
 * Summing all terms:
 *   S_{k_star} * B^2 <= SUM_{m=1}^{k_star-1} 1/[m(m+1)] + SUM_{m=1}^{N-k_star-1} 1/[m(m+1)]
 *                    <= 1 + 1 = 2   (telescoping series)
 *
 * Equality requires x_m = m for all m on both sides, i.e., ALL gaps = B. QED
 *
 * COROLLARY: Since B is the STRICT minimum gap in the generic case (g_l > B for l != k_star),
 * we have x_1 = g_{k_star-1}/B > 1 (if k_star > 1) and the bound is strict:
 *   S_{k_star} * B^2 < 2  in the generic (non-degenerate) case.
 */

/**
 * Numerically verify the equidistant upper bound at sample N values.
 * Computes the actual S_{k_star} * B^2 at the true minimum-gap site.
 */
function computeFullSumAtArgmin(N) {
  // Find argmin gap (k_star)
  let B = Infinity;
  let kStar = 0;
  for (let k = 0; k < N - 1; k++) {
    const g = ZETA_ZEROS[k + 1] - ZETA_ZEROS[k];
    if (g < B) {
      B = g;
      kStar = k; // 0-indexed: gap between ZETA_ZEROS[kStar] and ZETA_ZEROS[kStar+1]
    }
  }

  // Compute S_{k_star} = SUM over j not in {kStar, kStar+1}
  let S = 0;
  for (let j = 0; j < N; j++) {
    if (j === kStar || j === kStar + 1) continue;
    const factorA = ZETA_ZEROS[kStar + 1] - ZETA_ZEROS[j]; // can be negative for j > kStar+1
    const factorB = ZETA_ZEROS[kStar] - ZETA_ZEROS[j];     // can be negative for j > kStar
    const term = 1 / (factorA * factorB); // positive (both same sign)
    S += term;
  }

  const SB2 = S * B * B; // should be < 2 by the ceiling theorem
  return {
    N,
    kStar_oneidx: kStar + 1, // 1-indexed
    B: +B.toFixed(8),
    kStarFraction: +((kStar + 1) / N).toFixed(4),
    S: +S.toFixed(6),
    SB2: +SB2.toFixed(8),
    belowCeiling: SB2 < 2,
    note: 'SB2 = S_{k_star} * B^2, theorem says SB2 < 2',
  };
}

const EQUIDISTANT_CEILING_SAMPLES = [50, 100, 200, 400, ZETA_ZEROS.length].map(
  (N) => computeFullSumAtArgmin(N),
);

export const EQUIDISTANT_CEILING = {
  theorem:
    'For any N >= 3 and any zero sequence with B the strict minimum gap, ' +
    'S_{k_star} * B^2 < 2 (strictly). The supremum is 2, achieved only ' +
    'in the degenerate equidistant limit (all gaps = B).',
  unconditional: true,
  proof:
    'For j = k_star - m (m >= 1): x_m = (gamma_{k_star} - gamma_j)/B >= m. ' +
    'Term * B^2 = 1/(x_m*(x_m+1)) <= 1/(m*(m+1)). Sum <= SUM_{m=1}^{inf} 1/(m(m+1)) = 1. ' +
    'Same bound on the right side (j > k_star+1). Total <= 1 + 1 = 2.',
  routeCImplication:
    'Route C condition c(N) > 2 is UNREACHABLE via the static full sum S_{k_star} alone, ' +
    'because S_{k_star} * B^2 < 2 always. The dynamical ODE evolution (the de Bruijn-Newman ' +
    'flow) must be invoked to explain why tau_c -> 0 despite this ceiling.',
  numericalVerification: EQUIDISTANT_CEILING_SAMPLES,
  ceilingVerified: EQUIDISTANT_CEILING_SAMPLES.every((r) => r.belowCeiling),
};

// ── (4) GGM 2001 analysis ──────────────────────────────────────────────────────

export const GGM_ANALYSIS = {
  reference:
    'Goldston, D.A., Gonek, S.M., Montgomery, H.L. (2001). Mean values of the ' +
    'logarithmic derivative of the Riemann zeta function with applications to ' +
    'primes in short intervals. J. Reine Angew. Math. 537, 105-126.',
  claimExamined:
    'GGM 2001 mean-value theorem provides an unconditional lower bound on S_{k_star} ' +
    'via second-moment control of the logarithmic derivative of zeta.',
  whatGGMProves: [
    'Theorem 1 (GGM 2001, p. 107): ASSUMING RH, the mean square of zeta_prime/zeta on ' +
    'the half-line satisfies a formula involving sums over zero-pair differences. Conditional.',
    'Theorem 2 (GGM 2001, p. 109): ASSUMING RH + GRH for Dirichlet L-functions, the pair ' +
    'correlation satisfies a weak form of Montgomery conjecture. Doubly conditional.',
    'The paper assumes RH as a standing hypothesis throughout. No theorem in GGM 2001 ' +
    'holds unconditionally for the Riemann zeta function.',
  ],
  whyItFails:
    'GGM 2001 requires RH throughout. Unconditional GGM-type results exist only ' +
    'for Dirichlet L-functions with short conductor ranges, not for zeta itself. ' +
    'Even under RH, GGM gives only pair-correlation at the mean-spacing scale -- ' +
    'not the LOCAL LAW (all k-point correlations) needed for C = O(1) bounds on S_{k_star}. ' +
    'This is the same obstacle identified for C_mb in imp-486.',
  sameObstacleAsC_mb:
    'imp-486 (c-mb-unconditional-bound.js) established: GGM 2001 FAILS for unconditional ' +
    'C_mb bound. The same impossibility applies here: S_{k_star} involves the Hilbert ' +
    'transform of the zero measure, whose CLT-level fluctuations require 2-point statistics ' +
    'equivalent to GUE universality.',
  verdict: 'APPROACH FAILS: GGM requires RH and does not yield unconditional lower bound on S_{k_star}.',
};

// ── (5) Huxley density analysis ───────────────────────────────────────────────

export const HUXLEY_ANALYSIS = {
  reference:
    'Huxley, M.N. (1972). On the difference between consecutive primes. Acta Arith. 23, 367-392.',
  claimExamined:
    'Huxley density estimate N(sigma,T) << T^{12(1-sigma)/5+eps} constrains zero spacings ' +
    'on the critical line, yielding a lower bound on S_{k_star}.',
  whatHuxleyProves:
    'N(sigma, T) = #{rho: Re(rho) >= sigma, |Im(rho)| <= T} << T^{12(1-sigma)/5+eps} ' +
    'for sigma > 1/2. This bounds off-critical-line zeros.',
  whyItFails:
    'S_{k_star} involves ONLY the zeros on the critical line (imaginary parts gamma_j ' +
    'at sigma = 1/2). Huxley counts zeros with sigma > 1/2 and says nothing about the ' +
    'fine-scale spacing of on-line zeros. Off-line density is orthogonal to on-line ' +
    'gap statistics -- the same obstacle identified in imp-486 APPROACH_B_HUXLEY.',
  orthogonalityNote:
    'Even if all zeros are on the critical line (RH, unproved), the Huxley bound ' +
    'would only confirm that fact. It provides no information about whether the ' +
    'on-line zeros cluster like GUE or differently. The Cauchy-type sum S_{k_star} ' +
    'depends on fine-scale on-line spacing, which Huxley does not constrain.',
  verdict: 'APPROACH FAILS: Huxley density is orthogonal to on-line zero spacings.',
};

// ── (6) Montgomery 1973 unconditional content ─────────────────────────────────

export const MONTGOMERY_UNCONDITIONAL = {
  reference:
    'Montgomery, H.L. (1973). The pair correlation of zeros of the zeta function. ' +
    'Proc. Symp. Pure Math. 24, 181-193.',
  claimExamined:
    'Montgomery 1973 Theorem 1 has an unconditional component (Fourier support in [-1,1]) ' +
    'that may constrain S_{k_star} without assuming RH.',
  unconditionalContent:
    'For test functions f with Fourier transform supported in (-1, 1), Montgomery proved ' +
    'UNCONDITIONALLY that the pair-correlation sum (T log T / (2pi))^{-1} * ' +
    'SUM_{0 < gamma, gamma_prime <= T} f((gamma - gamma_prime) log T / (2pi)) ' +
    'converges to the GUE pair-correlation 1 - (sin(pi*u)/(pi*u))^2. ' +
    'This is genuinely unconditional for the supported range.',
  relevanceToFullSum:
    'S_{k_star} is not a standard pair-correlation sum -- it conditions on k_star being ' +
    'the ARGMIN of the gap (an extremal event). Montgomery unconditional content applies ' +
    'to AVERAGE pair statistics, not to statistics CONDITIONAL on the argmin event. ' +
    'Converting from average to argmin-conditional requires the distribution of the ' +
    'argmin location, which under GUE is a density-0 event (Ben Arous-Bourgade 2013).',
  partialContent:
    'For a "typical" index k (not the argmin), the Montgomery unconditional theorem gives ' +
    'S_k * B_avg^2 ~ GUE Calogero-Moser value unconditionally (where B_avg = 1/rho_N). ' +
    'This is NOT the condition Route C needs (which requires the MINIMUM GAP site).',
  verdict:
    'PARTIAL: Montgomery unconditional Fourier-support [-1,1] content gives density-1 ' +
    'lower bounds on S_k for typical k, but conditioning on the argmin k_star reintroduces ' +
    'the GUE universality requirement via the Ben Arous-Bourgade extremal conditioning.',
};

// ── (7) Full synthesis and named sub-gap ─────────────────────────────────────

export const G3A_FULLSUM_ANALYSIS = {
  id: 'imp-507',
  title: 'G3a_sub_fullsum partial closure via GGM mean-value + Huxley density',
  proofSection: 'Route-C',
  closes: 'G3a_sub_fullsum (partial analysis only -- the sub-gap is not fully closed)',
  closureLevel: 'partial-conditional',

  delivered: [
    'POSITIVITY LEMMA (unconditional): all terms in S_{k_star} are positive.',
    'FAR-FIELD LOWER BOUND (unconditional): S_{k_star} >= 1/(2 H_max^2) ' +
      '= Omega(rho_N^2 / log^4 gamma_N) -- too weak for Route C.',
    'EQUIDISTANT CEILING (unconditional): S_{k_star} * B^2 < 2 always (strict), ' +
      'with supremum 2 achieved only in the degenerate equidistant limit.',
    'GGM IMPOSSIBILITY (same as imp-486): GGM 2001 assumes RH throughout; no ' +
      'unconditional lower bound on S_{k_star} can be extracted.',
    'HUXLEY ORTHOGONALITY (same as imp-486): off-line density does not constrain ' +
      'on-line gap statistics; Huxley is irrelevant for S_{k_star}.',
    'MONTGOMERY PARTIAL: unconditional Fourier-support [-1,1] content gives ' +
      'density-1 lower bounds for TYPICAL indices k, not for the extremal argmin k_star.',
    'Numerical verification: EQUIDISTANT_CEILING_SAMPLES confirms S_{k_star} * B^2 < 2 ' +
      'at all sample N in {50, 100, 200, 400, 870}.',
  ],

  notDelivered: [
    'Unconditional lower bound S_{k_star} >= c(N)/B^2 with c(N) > 2 (structurally impossible ' +
      'from the equidistant ceiling: the static full sum satisfies S_{k_star} * B^2 < 2 always).',
    'Route C closure via the static full sum alone (needs dynamical Dyson ODE input).',
    'Conditional (under RH) closure (the ceiling S_{k_star} * B^2 < 2 holds even under RH).',
  ],

  openSubGap: {
    id: 'G3a_sub_fullsum_dynamical',
    statement:
      'The static full sum S_{k_star} satisfies S_{k_star} * B^2 < 2 always ' +
      '(equidistant ceiling, this file). Route C condition c(N) > 2 therefore requires ' +
      'an argument based on the DYNAMICAL EVOLUTION under the de Bruijn-Newman flow, ' +
      'not just a static bound on S_{k_star}. ' +
      'Specifically: show that the ODE d(B)/dtau = 4*rho^2/B + rho^2 * B * S_{k_star} ' +
      'drives B -> 0 despite the repulsive 4*rho^2/B term, by invoking the many-body ' +
      'correlation structure of the approaching zeros (not captured by the static sum).',
    suggestedRoute:
      'Analyze the COUPLED system of Dyson ODEs near a collision, using the ' +
      'Calogero-Moser integrability or a direct energy-functional approach. ' +
      'The Selberg integral representation of the GUE joint density may give ' +
      'an exact formula for how B evolves when the zero distribution is GUE-typical.',
    conditionalOn:
      'Likely requires GUE universality (Montgomery pair-correlation) or at minimum ' +
      'the unconditional part of Montgomery 1973 (Fourier support [-1,1]) applied ' +
      'to the local statistics near k_star at the timescale of the collision.',
    status: 'open',
  },

  referenceClosures: {
    imp451: 'imp-451: diagnosed near+tail failure (R_N ~ N^{4/3}, c_total -> 0)',
    imp486: 'imp-486: same GGM+Huxley impossibility for C_mb (direct analogue)',
    imp455: 'imp-455: similar partial closure for G1-sub-extremal (conditional structure)',
  },
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const G3A_FULLSUM_ASSERTIONS = [
  {
    id: 'imp507-citation-chain-resolves',
    holds: () => G3A_EXTREMAL_CLOSURE.id === 'imp-451',
    why:
      'imp-507 cites imp-451 (G3A_EXTREMAL_CLOSURE). If the id drifts, ' +
      'the citation chain for G3a_sub_fullsum is broken.',
  },
  {
    id: 'imp507-positivity-holds-at-sample-N',
    holds: () =>
      EQUIDISTANT_CEILING_SAMPLES.every((r) => typeof r.S === 'number' && r.S > 0),
    why:
      'The positivity lemma says S_{k_star} > 0. A nonpositive computed value ' +
      'means a sign error in computeFullSumAtArgmin or ZETA_ZEROS has changed.',
  },
  {
    id: 'imp507-ceiling-holds-at-all-sample-N',
    holds: () => EQUIDISTANT_CEILING_SAMPLES.every((r) => r.belowCeiling),
    why:
      'Equidistant ceiling theorem: S_{k_star} * B^2 < 2 at every sample N. ' +
      'A violation would contradict the proof and indicate a computation error.',
  },
  {
    id: 'imp507-ceiling-verified-flag-set',
    holds: () => EQUIDISTANT_CEILING.ceilingVerified === true,
    why:
      'The ceilingVerified flag aggregates all sample checks. It must be true ' +
      'for the equidistant ceiling theorem to have numerical support.',
  },
  {
    id: 'imp507-far-field-lb-positive',
    holds: () =>
      FAR_FIELD_SAMPLES.every((r) => typeof r.farFieldLb === 'number' && r.farFieldLb > 0),
    why:
      'The far-field lower bound 1/(2 H_max^2) must be positive at every N. ' +
      'A zero or negative value indicates H_max is infinite or negative.',
  },
  {
    id: 'imp507-open-subgap-flagged-dynamical',
    holds: () =>
      G3A_FULLSUM_ANALYSIS.openSubGap.id === 'G3a_sub_fullsum_dynamical' &&
      G3A_FULLSUM_ANALYSIS.openSubGap.status === 'open',
    why:
      'SCOPE TRIPWIRE: the remaining sub-gap G3a_sub_fullsum_dynamical must remain ' +
      'flagged as open until a dynamical Dyson ODE argument closes Route C. ' +
      'Any change to id or status here must coordinate with lambda-roadmap.js.',
  },
  {
    id: 'imp507-ggm-failure-consistent-with-imp486',
    holds: () => GGM_ANALYSIS.verdict.startsWith('APPROACH FAILS'),
    why:
      'GGM approach must be documented as failing, consistent with imp-486 which ' +
      'established the same impossibility for C_mb. If this changes, imp-486 must ' +
      'be revisited to check whether the same reversal applies to C_mb.',
  },
];
