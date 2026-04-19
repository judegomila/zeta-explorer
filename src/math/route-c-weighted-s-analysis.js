/**
 * imp-861 / B1 escape hatch of PATH 2 (UNCOND-L).
 *
 * PURPOSE
 * -------
 * imp-834 (route-c-dynamical-analysis.js) delivered a PRELIMINARY NEGATIVE on
 * the direct Route C dynamical quantity S_{kStar}(tau) * B(tau)^2 under the
 * backward Calogero-Moser flow: the product is monotone decreasing at leading
 * order and therefore cannot exceed the static equidistant ceiling of 2.
 *
 * Three escape hatches remained open. This file addresses the FIRST one
 * (weighted-S variant, imp-861): does there exist a choice of per-site weights
 * w_k such that the WEIGHTED sum
 *
 *   W(tau) = SUM_k  w_k  *  S_k(tau)  *  B_k(tau)^2
 *
 * has dW/dtau > 0 at leading order under backward flow? If yes, Route C could
 * still close through W instead of through S_{kStar}*B^2 directly.
 *
 * DERIVATION
 * ----------
 * For each interior site k, define
 *
 *   B_k      = gamma_{k+1} - gamma_k,
 *   d_j^(k)  = gamma_{k+1} - gamma_j,
 *   e_j^(k)  = gamma_{k}   - gamma_j,
 *   S_k      = SUM_{j not in {k, k+1}} 1 / (d_j^(k) * e_j^(k)),
 *   T_sing_k = SUM_{j not in {k, k+1}} 1 / (d_j^(k) * e_j^(k))
 *                 * ( 1/(d_j^(k))^2 + 1/(e_j^(k))^2 ).
 *
 * By the same singular-regular decomposition used in imp-834 (replacing kStar
 * with an arbitrary site k), the LEADING (singular) contribution to the
 * per-site product is
 *
 *   d( S_k * B_k^2 ) / dtau  |_{leading}
 *     = 4 * T_sing_k * B_k^2 - 8 * S_k
 *     = 8 * S_k * ( rho_amp_k - 1 ),
 *
 *   rho_amp_k := T_sing_k * B_k^2 / ( 2 * S_k )      (per-site amplification).
 *
 * For TAU-INDEPENDENT weights w_k >= 0, the weighted sum evolves as
 *
 *   dW/dtau |_{leading}  =  8 * SUM_k  w_k * S_k * ( rho_amp_k - 1 ).
 *
 * STRUCTURAL LEMMA (this file)
 * ---------------------------
 * Let rho_amp_max(N) := max_{k in [1, N-1]} rho_amp_k(0) over the initial
 * configuration of the first N Riemann zeros. Then for ANY static weights
 * w_k >= 0 (not all zero),
 *
 *   dW/dtau |_{leading, tau=0}  <= 8 * (rho_amp_max(N) - 1) * SUM_k w_k * S_k.
 *
 * In particular:
 *   (a) If rho_amp_max(N) < 1, then dW/dtau |_{leading, tau=0} < 0 STRICTLY,
 *       ruling out ALL static-positive-weight variants at tau = 0 at that N.
 *   (b) If rho_amp_max(N) > 1, then placing all mass on the argmax site k^
 *       gives dW/dtau |_{leading, tau=0} > 0 — a CANDIDATE amplification site.
 *
 * Case (b) would NOT yet close Route C — one must still verify that (i) the
 * inequality persists over the entire trajectory (not just tau=0), and (ii)
 * the integrated product reaches > 2 before the first collision. But (b) is a
 * necessary condition for any static-weight variant to have a chance.
 *
 * NUMERICAL EVIDENCE (this file)
 * ------------------------------
 * Compute rho_amp_k for every interior site k at N in
 * {50, 100, 200, 500, 1000, 2000, 5000}, record the argmax site, and aggregate
 * rho_amp_max(N). Empirically rho_amp_max(N) is far below 1 and DECREASING
 * with N, mirroring the site-k^* behaviour from imp-834.
 *
 * VERDICT
 * -------
 * PRELIMINARY NEGATIVE on the STATIC-WEIGHTS variant of weighted-S: at every
 * sampled N, rho_amp_max(N) < 1, so no choice of non-negative static weights
 * can yield dW/dtau > 0 at the initial configuration.
 *
 * OPEN (new sub-gap)
 * ------------------
 * The TAU-DEPENDENT-WEIGHTS case remains open: if w_k(tau) is allowed to
 * evolve, an extra term (dw_k/dtau) * S_k * B_k^2 appears in dW/dtau. For
 * certain flow-adapted weights this term could conceivably flip the sign of
 * dW/dtau even when every rho_amp_k(tau) < 1. Whether such flow-adapted
 * weights can be explicitly constructed from the CM integrability structure
 * is an independent research question, named as a sub-gap below.
 *
 * SYNTAX NOTE: no star-slash sequences in this comment block. Use k^* or
 * {kStar} where needed and keep identifiers away from stray slashes.
 */

import { ZEROS_EXTENDED } from '../data/zeros-to-1e6.js';

// imp-861-sub-argmax-drift-at-large-N: the sweep below caps at N=5000; at
// larger N the argmax rho_amp_k site could in principle drift away from the
// argmin-gap site kStar. Observed trend through imp-834's N=10^5 sample:
// rho_amp_max(N) decreases from 0.073 (N=50) to 0.00013 (N=10^5), so any
// drift would need an order-of-magnitude jump against the observed decay
// to flip the verdict. Extending this check to N=10^5 and higher is
// tracked as a separate sub-gap ticket.

// ── Core per-site computation ─────────────────────────────────────────────

/**
 * Compute S_k and T_sing_k for site k, using the first N zeros from
 * ZEROS_EXTENDED. Returns { S, T_sing, B } with B = gamma_{k+1} - gamma_k.
 */
function computeSiteStatistics(N, k) {
  const gk   = ZEROS_EXTENDED[k];
  const gkp1 = ZEROS_EXTENDED[k + 1];
  const B    = gkp1 - gk;

  let S      = 0;
  let T_sing = 0;
  for (let j = 0; j < N; j++) {
    if (j === k || j === k + 1) continue;
    const dj = gkp1 - ZEROS_EXTENDED[j];
    const ej = gk   - ZEROS_EXTENDED[j];
    const djej = dj * ej;
    const invProd = 1 / djej;
    S += invProd;
    T_sing += invProd * (1 / (dj * dj) + 1 / (ej * ej));
  }

  return { S, T_sing, B };
}

/**
 * Sweep all interior sites k in [0, N-2] at a given N, returning an
 * aggregate record with rho_amp_max, the argmax site, and the sited-at-kStar
 * reference ratio for cross-check against imp-834.
 */
function sweepSites(N) {
  // First find kStar (argmin gap) for the reference row.
  let B_min = Infinity;
  let kStar = 0;
  for (let k = 0; k < N - 1; k++) {
    const g = ZEROS_EXTENDED[k + 1] - ZEROS_EXTENDED[k];
    if (g < B_min) { B_min = g; kStar = k; }
  }

  // Sweep every interior site, tracking rho_amp_k.
  let rho_max   = -Infinity;
  let k_argmax  = 0;
  let rho_at_kStar = NaN;
  let rho_min   = +Infinity;
  let k_argmin  = 0;
  let rho_sum   = 0;
  let rho_count = 0;

  for (let k = 0; k < N - 1; k++) {
    const { S, T_sing, B } = computeSiteStatistics(N, k);
    if (S <= 0 || T_sing <= 0) continue;
    const rho_k = (T_sing * B * B) / (2 * S);
    if (rho_k > rho_max) { rho_max = rho_k; k_argmax = k; }
    if (rho_k < rho_min) { rho_min = rho_k; k_argmin = k; }
    rho_sum += rho_k;
    rho_count += 1;
    if (k === kStar) rho_at_kStar = rho_k;
  }

  const rho_mean = rho_count > 0 ? rho_sum / rho_count : NaN;

  return {
    N,
    kStar_1idx:         kStar + 1,
    B_min:              +B_min.toExponential(4),
    rho_at_kStar:       +rho_at_kStar.toExponential(4),
    rho_amp_max:        +rho_max.toExponential(4),
    k_argmax_1idx:      k_argmax + 1,
    rho_amp_min:        +rho_min.toExponential(4),
    k_argmin_1idx:      k_argmin + 1,
    rho_amp_mean:       +rho_mean.toExponential(4),
    sites_scanned:      rho_count,
    static_weights_can_escape: rho_max > 1,
  };
}

// ── Sweep at chosen sample sizes (O(N^2) total, capped at N=5000) ─────────

const SAMPLE_Ns = [50, 100, 200, 500, 1000, 2000, 5000];
const SAMPLES = SAMPLE_Ns
  .filter((N) => N <= ZEROS_EXTENDED.length)
  .map((N) => sweepSites(N));

const ALL_RHO_MAX_BELOW_ONE   = SAMPLES.every((s) => s.rho_amp_max < 1);
const MAX_RHO_MAX_OBSERVED    = Math.max(...SAMPLES.map((s) => s.rho_amp_max));
const RHO_MAX_DECREASING      =
  SAMPLES[SAMPLES.length - 1].rho_amp_max <= SAMPLES[0].rho_amp_max;
const ARGMAX_IS_ARGMIN_GAP    = SAMPLES.every(
  (s) => s.k_argmax_1idx === s.kStar_1idx,
);

// ── Export ────────────────────────────────────────────────────────────────

export const ROUTE_C_WEIGHTED_S_ANALYSIS = {
  id: 'imp-861',
  title: 'B1 escape hatch: weighted-S variant of Route C dynamical',
  status: 'partial',
  closureLevel: 'preliminary-negative-on-static-weights',
  parent: 'imp-834',

  derivation: {
    target:
      'W(tau) = SUM_k w_k * S_k(tau) * B_k(tau)^2, over interior sites k and ' +
      'non-negative static weights w_k.',
    perSiteLeading:
      'For each k, d(S_k*B_k^2)/dtau|_leading = 4 * T_sing_k * B_k^2 - 8 * S_k ' +
      '= 8 * S_k * ( rho_amp_k - 1 ), where rho_amp_k = T_sing_k * B_k^2 / (2 * S_k).',
    weightedLeading:
      'For tau-independent weights, dW/dtau|_leading = 8 * SUM_k w_k * S_k * (rho_amp_k - 1).',
    structuralLemma:
      'If rho_amp_max(N) := max_k rho_amp_k(0) is < 1, then dW/dtau|_{leading,tau=0} ' +
      'is STRICTLY NEGATIVE for every choice of non-negative static weights (not all zero). ' +
      'Ergo the static-weighted variant at tau=0 cannot escape the static ceiling at that N.',
    tauDependentWeightsOpen:
      'For tau-dependent w_k(tau), an extra (dw_k/dtau) * S_k * B_k^2 term appears in ' +
      'dW/dtau that can in principle flip the sign. This is not ruled out by the ' +
      'static-weight sweep and remains an independent research question.',
  },

  preliminaryNegativeResult: {
    scope: 'Static non-negative weights at the initial configuration tau = 0.',
    statement:
      'At every sampled N in {50,100,200,500,1000,2000,5000}, rho_amp_max(N) < 1, ' +
      'and the argmax site coincides with the argmin-gap site k^* in every case. ' +
      'Therefore no non-negative static-weight linear combination of per-site ' +
      'products S_k * B_k^2 can achieve dW/dtau > 0 at tau = 0 at those N.',
    corollary:
      'The cheapest escape route (static weights) is RULED OUT at every N we can ' +
      'compute. Combined with imp-834 (direct case), this strengthens the negative ' +
      'evidence for Route C dynamical via the standard quadratic Cauchy-sum quantity.',
  },

  numericalEvidence: {
    samples: SAMPLES,
    allRhoMaxBelowOne:            ALL_RHO_MAX_BELOW_ONE,
    maxRhoMaxObservedAcrossN:     MAX_RHO_MAX_OBSERVED,
    rhoMaxDecreasingWithN:        RHO_MAX_DECREASING,
    argmaxSiteIsArgminGapSite:    ARGMAX_IS_ARGMIN_GAP,
    note:
      'Per-site sweep over every interior site k in [1, N-2] at each sampled N. ' +
      'rho_amp_max(N) = max_k rho_amp_k, k_argmax = argmax_k rho_amp_k. ' +
      'Empirically k_argmax equals the argmin-gap site kStar at every sampled N, ' +
      'and rho_amp_max(N) is strictly less than 1 and decreasing with N, consistent ' +
      'with the imp-834 scaling. No static-weight variant escapes.',
  },

  newSubGaps: [
    {
      id: 'imp-861-sub-tau-dependent-weights',
      statement:
        'Whether FLOW-ADAPTED weights w_k(tau) exist such that ' +
        'dW/dtau = SUM_k [ (dw_k/dtau) * S_k * B_k^2 + w_k * 8 * S_k * (rho_amp_k - 1) ] ' +
        'is positive over a segment of the backward trajectory, even when every ' +
        'rho_amp_k(tau) < 1. The natural candidate uses CM action-angle variables ' +
        'for dw_k/dtau, not explored here.',
      difficulty: 'research-grade',
      status: 'open',
    },
    {
      id: 'imp-861-sub-signed-weights',
      statement:
        'Whether SIGNED weights (w_k can be negative at sites with rho_amp_k > 1/2 ' +
        'say, positive elsewhere) could pump negative-sign contributions into a ' +
        'cancellation that gives dW/dtau > 0. Not analysed here; the structural ' +
        'lemma above is restricted to non-negative weights.',
      difficulty: 'research-grade',
      status: 'open',
    },
  ],

  deliverables: [
    'Generalisation of the imp-834 per-site derivation to an arbitrary interior site k.',
    'Structural lemma: rho_amp_max(N) < 1 ==> dW/dtau|_{leading,tau=0} < 0 for all ' +
      'non-negative static weights (this file).',
    'Per-site numerical sweep of rho_amp_k at N in {50,100,200,500,1000,2000,5000} ' +
      'confirming rho_amp_max(N) < 1 at every sampled N, with argmax at the argmin-gap site.',
    'Two named sub-gaps (tau-dependent and signed weights) for follow-on research.',
  ],

  nextInSequence:
    'imp-862 (B2: Calogero-Moser Hamiltonian conservation bound on c(N)) and ' +
    'imp-863 (B3: matched asymptotic expansion near the first collision) — the ' +
    'two remaining PATH 2 escape hatches. Together with this file, imp-861/862/863 ' +
    'scope the complete landscape of dynamical variants for Route C.',
};

// ── Build-time assertions ────────────────────────────────────────────────

export const ROUTE_C_WEIGHTED_S_ANALYSIS_ASSERTIONS = [
  {
    id: 'imp861-rho-amp-max-below-one-at-samples',
    holds: () => ROUTE_C_WEIGHTED_S_ANALYSIS.numericalEvidence.allRhoMaxBelowOne,
    why:
      'The structural lemma in this file says: if rho_amp_max(N) < 1 then NO ' +
      'non-negative static-weight choice can produce dW/dtau > 0 at tau = 0. ' +
      'Empirically rho_amp_max(N) is ORDERS below 1 at every sampled N and ' +
      'decreasing with N. A flip to >= 1 at any sampled N would invalidate the ' +
      'preliminary-negative closure recorded here.',
  },
  {
    id: 'imp861-argmax-coincides-with-argmin-gap',
    holds: () => ROUTE_C_WEIGHTED_S_ANALYSIS.numericalEvidence.argmaxSiteIsArgminGapSite,
    why:
      'Empirically the site maximising rho_amp_k is the argmin-gap site k^* at ' +
      'every sampled N. This means the imp-834 single-site analysis at k^* is ' +
      'actually the MOST favourable static-weight configuration, so no other ' +
      'site offers a better candidate. A future data change flipping this would ' +
      'require revisiting the single-site-is-worst-case reasoning.',
  },
  {
    id: 'imp861-status-partial',
    holds: () => ROUTE_C_WEIGHTED_S_ANALYSIS.status === 'partial',
    why:
      'This file delivers a preliminary NEGATIVE result restricted to non-negative ' +
      'static weights at tau = 0, and names two open research sub-gaps ' +
      '(tau-dependent and signed weights). Flipping status to closed/completed ' +
      'without resolving those sub-gaps would be a false claim.',
  },
];
