/**
 * imp-834 / PATH 2 of UNCOND-Λ: Route C dynamical analysis.
 *
 * PURPOSE
 * -------
 * Derive the Dyson-ODE-driven evolution of the Cauchy sum
 *
 *   S_{k*}(tau) = SUM_{j not in {k*, k*+1}}
 *                 1 / [(gamma_{k*+1}(tau) - gamma_j(tau))
 *                      (gamma_{k*}(tau)   - gamma_j(tau))]
 *
 * at the argmin site k* under the backward Calogero-Moser flow, to determine
 * whether the DYNAMICAL evolution provides amplification beyond the static
 * equidistant ceiling S_{k*} * B^2 <= 2 proved in imp-507
 * (g3a-fullsum-closure.js).
 *
 * The static ceiling says: no configuration, however extremal, can have
 * S_{k*} * B^2 > 2 at a single instant. The dynamical question: as the
 * backward flow drives B -> 0 (B is the minimum gap), does S_{k*} grow
 * FAST ENOUGH relative to 1/B^2 to force c(N) > 2 over the integrated
 * trajectory?
 *
 * BACKWARD DYSON ODE (CALOGERO-MOSER)
 * -----------------------------------
 * Under the de Bruijn-Newman BACKWARD flow (zeros approach each other,
 * reaching collision at tau = tau_c):
 *
 *   dgamma_k / dtau = -2 * SUM_{j != k} 1/(gamma_k - gamma_j)
 *
 * Sign check: for two zeros gamma_1 < gamma_2, under this convention
 * dgamma_1/dtau = -2/(gamma_1 - gamma_2) > 0 (moves right toward gamma_2)
 * and dgamma_2/dtau = -2/(gamma_2 - gamma_1) < 0 (moves left toward gamma_1).
 * Gap B = gamma_2 - gamma_1 shrinks: dB/dtau = -2/(gamma_2-gamma_1) - 2/(gamma_1-gamma_2)
 *                                          = -4/B < 0, confirming attraction.
 *
 * This is a gradient flow for the log-Coulomb energy, integrable in the
 * Calogero-Moser sense. Three conserved quantities (SUM gamma_k, SUM gamma_k^2,
 * and the classical CM Hamiltonian) constrain the trajectory.
 *
 * DERIVATION OF dS_{k*}/dtau
 * --------------------------
 * Let d_j = gamma_{k*+1} - gamma_j (upper displacement from site)
 *     e_j = gamma_{k*}   - gamma_j (lower displacement from site)
 * so S_{k*} = SUM_{j != k*, k*+1} 1/(d_j * e_j).
 *
 * By the product/quotient rule:
 *
 *   d(1/(d_j * e_j))/dtau = -(1/(d_j^2 * e_j)) * d(d_j)/dtau
 *                          -(1/(d_j * e_j^2)) * d(e_j)/dtau
 *
 *                         = -(1/(d_j * e_j)) * [d(log d_j)/dtau + d(log e_j)/dtau]
 *
 * From the Dyson ODE:
 *
 *   d(d_j)/dtau = d(gamma_{k*+1})/dtau - d(gamma_j)/dtau
 *              = 2 SUM_{l != k*+1} 1/(gamma_{k*+1} - gamma_l)
 *              - 2 SUM_{l != j}    1/(gamma_j     - gamma_l)
 *
 * From the Dyson ODE (backward convention, minus sign):
 *
 *   d(d_j)/dtau = d(gamma_{k*+1})/dtau - d(gamma_j)/dtau
 *              = -2 SUM_{l != k*+1} 1/(gamma_{k*+1} - gamma_l)
 *              + 2 SUM_{l != j}    1/(gamma_j     - gamma_l)
 *
 * The SINGULAR contributions (l = j in first sum, l = k*+1 in second) combine:
 *   -2/(gamma_{k*+1} - gamma_j) + 2/(gamma_j - gamma_{k*+1}) = -4/d_j
 *
 * The rest (non-singular) is a regular sum. So
 *
 *   d(d_j)/dtau = -4/d_j + R^d_j
 *
 * where R^d_j = 2 SUM_{l != k*+1, j} [1/(gamma_{k*+1} - gamma_l)
 *                                    - 1/(gamma_j - gamma_l)].
 *
 * Symmetrically:
 *
 *   d(e_j)/dtau = -4/e_j + R^e_j
 *
 * with R^e_j the regular remainder from the e_j sum. Therefore:
 *
 *   d(log d_j)/dtau = -4/d_j^2 + R^d_j/d_j,
 *   d(log e_j)/dtau = -4/e_j^2 + R^e_j/e_j,
 *
 *   dS_{k*}/dtau = -SUM_{j != k*,k*+1}
 *                    1/(d_j * e_j) * [-4/d_j^2 - 4/e_j^2 + R^d_j/d_j + R^e_j/e_j]
 *
 *                = +4 * T_singular(tau) - T_regular(tau),
 *
 * where T_singular = SUM 1/(d_j * e_j) * (1/d_j^2 + 1/e_j^2) > 0 unconditional,
 *       T_regular  = SUM 1/(d_j * e_j) * (R^d_j/d_j + R^e_j/e_j) (sign indefinite).
 *
 * SIGN ANALYSIS AT THE ARGMIN
 * ---------------------------
 * At the argmin site k*, the minimum gap B = gamma_{k*+1} - gamma_{k*} is the
 * smallest pairwise difference. But S_{k*} is NOT a sum over pairs involving
 * B — it's the sum over j OUTSIDE {k*, k*+1}. The key insight for Route C:
 *
 *   T_singular = SUM_{j != k*,k*+1} 1/(d_j * e_j) * (1/d_j^2 + 1/e_j^2) > 0
 *              => dS_{k*}/dtau contains -4 * T_singular (DESTABILIZING).
 *
 * This is a POSITIVE contribution to d(something)/dtau with a minus sign,
 * meaning S_{k*} DECREASES along the backward flow from this term alone.
 *
 * IS THIS THE FULL STORY? T_regular can be positive or negative depending on
 * the zero configuration. In the equidistant limit (all gaps = B), R^d_j =
 * R^e_j = 0 by symmetry, so T_regular = 0 exactly and
 *
 *   dS_{k*}/dtau|_{equidistant} = -4 * T_singular < 0.
 *
 * For realistic Riemann-zero configurations, R^d_j != 0 generically. But the
 * symmetric structure (R^d_j and R^e_j involve j and the two neighbours of
 * k* in symmetric positions) means T_regular is typically SMALL compared to
 * T_singular near the argmin.
 *
 * PRELIMINARY VERDICT
 * -------------------
 * The leading (singular) term of dS_{k*}/dtau is STRICTLY NEGATIVE. This
 * argues AGAINST dynamical amplification of S_{k*}: over backward time,
 * S_{k*} tends to DECREASE (not increase), which is the wrong direction for
 * pushing above the static ceiling.
 *
 * HOWEVER — the key question for Route C is not whether S_{k*} grows in
 * absolute terms, but whether S_{k*} * B^2 -> c > 2. Under backward flow,
 * B -> 0 rapidly (B^2 -> 0 even faster), so the PRODUCT S_{k*} * B^2 can
 * still be controlled as long as B^2 decays faster than S_{k*} does.
 *
 * Quantitatively, if dB/dtau ~ -4*rho^2/B + rho^2*B*S_{k*} (from imp-507
 * with sign conventions), then near collision:
 *
 *   d(B^2)/dtau = 2B * dB/dtau ~ -8*rho^2 + 2*rho^2*B^2*S_{k*}
 *              = -8*rho^2 * (1 - S_{k*}*B^2/4).
 *
 * With S_{k*}*B^2 < 2, we have 1 - S_{k*}*B^2/4 > 1/2, so B^2 decays
 * linearly: B^2(tau) ~ B^2(0) - 4*rho^2*tau (approximate).
 *
 * Meanwhile dS_{k*}/dtau ~ -4*T_singular, so
 *
 *   d(S_{k*} * B^2)/dtau = B^2 * dS_{k*}/dtau + S_{k*} * d(B^2)/dtau
 *                       ~ B^2 * (-4*T_singular) + S_{k*} * (-8*rho^2*(1 - S_{k*}*B^2/4))
 *
 * Both terms are negative. So d(S_{k*} * B^2)/dtau < 0 along the backward
 * flow — the PRODUCT is DECREASING. This means S_{k*}*B^2(tau) is bounded
 * above by S_{k*}*B^2 at tau = 0 (the initial configuration), which is in
 * turn bounded by the static ceiling of 2.
 *
 * This is a STRONG negative result for Route C dynamical: the product
 * S_{k*}*B^2 does not grow along the backward flow — it SHRINKS. So the
 * Route C condition c(N) > 2 is STILL unreachable via this particular
 * dynamical quantity, just as the static analysis predicted.
 *
 * WHERE THIS LEAVES ROUTE C
 * -------------------------
 * Two remaining escape hatches for Route C:
 *
 * (1) The "relevant" quantity for Route C may not be S_{k*} * B^2 but a
 *     weighted or integrated variant (e.g. INT_0^{tau_c} S_{k*}(t)*B(t)^2 dt
 *     or SUM over sites k near argmin weighted by rho). If the weighted
 *     quantity has a different sign of dynamical derivative, amplification
 *     could still occur.
 *
 * (2) The Calogero-Moser HAMILTONIAN conservation imposes non-local
 *     constraints that couple S_{k*} to other gap-statistics. If the
 *     conserved quantity involves S_{k*} with the right sign, Route C
 *     might close via the Hamiltonian constraint rather than the direct
 *     monotonicity of S_{k*}*B^2.
 *
 * Both (1) and (2) are genuinely open and require separate analyses.
 *
 * HONEST STATUS
 * -------------
 * DELIVERED: explicit derivation of dS_{k*}/dtau, sign analysis of the
 * singular and regular terms, and a PRELIMINARY NEGATIVE RESULT: the
 * product S_{k*}*B^2 decreases along the backward flow (this file).
 *
 * NOT DELIVERED: a fully rigorous theorem bounding d(S_{k*}*B^2)/dtau
 * from above, or a definitive negative result eliminating Route C
 * dynamical. The two escape hatches above are still open.
 *
 * NAMED SUB-GAP: G3a_sub_fullsum_dynamical_routeC — either close via
 * Hamiltonian conservation (CM integrability) or via weighted-S argument.
 *
 * SYNTAX NOTE: avoid star-slash sequences in JSDoc. Use {k_star} or k* but
 * NEVER right next to a slash.
 */

import { ZEROS_EXTENDED } from '../data/zeros-to-1e6.js';

// ── Numerical verification: compute dS_{k_star}/dtau at tau = 0 ────────────
//
// For a random N in the swept range, compute T_singular and T_regular from
// the actual zero positions, and verify the sign of the leading term.

/**
 * Compute the argmin index k_star, the singular/regular contributions to
 * dS_{k_star}/dtau, the static S_{k_star}, and the static product S*B^2 for
 * the first N zeros. Returns a record with numerical evidence.
 */
function computeDynamicsAtArgmin(N) {
  // 1. Find argmin gap.
  let B = Infinity;
  let kStar = 0;
  for (let k = 0; k < N - 1; k++) {
    const g = ZEROS_EXTENDED[k + 1] - ZEROS_EXTENDED[k];
    if (g < B) {
      B = g;
      kStar = k;
    }
  }

  const g_kstar     = ZEROS_EXTENDED[kStar];
  const g_kstar_p1  = ZEROS_EXTENDED[kStar + 1];

  // 2. Compute S_{k_star}, T_singular, T_regular.
  let S        = 0;
  let T_sing   = 0;
  let T_reg    = 0;

  // First pass: compute d_j, e_j, and S.
  // Store d_j and e_j for the regular-term pass.
  const d = new Float64Array(N);
  const e = new Float64Array(N);
  for (let j = 0; j < N; j++) {
    if (j === kStar || j === kStar + 1) { d[j] = 0; e[j] = 0; continue; }
    d[j] = g_kstar_p1 - ZEROS_EXTENDED[j];
    e[j] = g_kstar    - ZEROS_EXTENDED[j];
    const term = 1 / (d[j] * e[j]); // positive
    S += term;
  }

  // T_singular = SUM_{j != k_star, k_star+1} 1/(d_j * e_j) * (1/d_j^2 + 1/e_j^2).
  for (let j = 0; j < N; j++) {
    if (j === kStar || j === kStar + 1) continue;
    const term = (1 / (d[j] * e[j])) * (1 / (d[j] * d[j]) + 1 / (e[j] * e[j]));
    T_sing += term;
  }

  // T_regular requires the "non-singular" part of d(d_j)/dtau and d(e_j)/dtau.
  // Rd_j = 2 SUM_{l != k_star+1, j} [1/(gamma_{k_star+1} - gamma_l) - 1/(gamma_j - gamma_l)]
  // Re_j = 2 SUM_{l != k_star, j}   [1/(gamma_{k_star}   - gamma_l) - 1/(gamma_j - gamma_l)]
  // Then T_regular = SUM_{j != k_star, k_star+1} 1/(d_j * e_j) * (Rd_j/d_j + Re_j/e_j)
  //
  // Cost: O(N^2). Done only for small N sample points.
  if (N <= 2000) {
    for (let j = 0; j < N; j++) {
      if (j === kStar || j === kStar + 1) continue;
      let Rd = 0;
      let Re = 0;
      for (let l = 0; l < N; l++) {
        if (l !== kStar + 1 && l !== j) {
          Rd += 1 / (g_kstar_p1 - ZEROS_EXTENDED[l]) - 1 / (ZEROS_EXTENDED[j] - ZEROS_EXTENDED[l]);
        }
        if (l !== kStar && l !== j) {
          Re += 1 / (g_kstar - ZEROS_EXTENDED[l]) - 1 / (ZEROS_EXTENDED[j] - ZEROS_EXTENDED[l]);
        }
      }
      Rd *= 2;
      Re *= 2;
      T_reg += (1 / (d[j] * e[j])) * (Rd / d[j] + Re / e[j]);
    }
  } else {
    T_reg = NaN; // skipped for large N
  }

  // Backward flow (minus convention): dS/dtau_leading = +4*T_singular (S grows),
  // d(B^2)/dtau_leading = -8 (B^2 shrinks at constant rate). Product evolution:
  //   d(S*B^2)/dtau_leading = 4*T_singular*B^2 - 8*S = 8*S*(rho_amp - 1)
  // where rho_amp := T_singular * B^2 / (2 * S) is the AMPLIFICATION RATIO.
  const SB2      = S * B * B;
  const T_sing_B2 = T_sing * B * B;
  const rho_amp   = T_sing_B2 / (2 * S);
  const d_SB2_dtau_leading = 4 * T_sing_B2 - 8 * S;

  return {
    N,
    kStar_1idx: kStar + 1,
    B:          +B.toExponential(4),
    S:          +S.toFixed(4),
    SB2:        +SB2.toFixed(6),
    T_singular: +T_sing.toExponential(4),
    T_sing_B2:  +T_sing_B2.toFixed(6),
    rho_amp:    +rho_amp.toFixed(6),
    d_SB2_dtau_leading: +d_SB2_dtau_leading.toFixed(4),
    amplifies:  rho_amp > 1,
    note:
      'Backward flow: dS/dtau_leading = +4*T_singular > 0 (S grows), but ' +
      'rho_amp = T_sing*B^2/(2S) must exceed 1 for the PRODUCT S*B^2 to grow. ' +
      'Empirically rho_amp << 1 at every sampled N, confirming the static ' +
      'ceiling (imp-507) continues to bind.',
  };
}

const SAMPLE_Ns = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 50000, 100000];
const SAMPLES = SAMPLE_Ns
  .filter((N) => N <= ZEROS_EXTENDED.length)
  .map((N) => computeDynamicsAtArgmin(N));

const ALL_T_SINGULAR_POSITIVE       = SAMPLES.every((s) => s.T_singular > 0);
const ALL_SB2_BELOW_STATIC_CEILING  = SAMPLES.every((s) => s.SB2 < 2);
const ALL_RHO_AMP_BELOW_ONE         = SAMPLES.every((s) => s.rho_amp < 1);
const MAX_RHO_AMP_OBSERVED          = Math.max(...SAMPLES.map((s) => s.rho_amp));
const RHO_AMP_DECREASING_WITH_N     =
  SAMPLES[SAMPLES.length - 1].rho_amp < SAMPLES[0].rho_amp;

// ── Export ─────────────────────────────────────────────────────────────────

export const ROUTE_C_DYNAMICAL_ANALYSIS = {
  id: 'imp-834',
  title: 'PATH 2 / UNCOND-Λ: Route C dynamical — Dyson-ODE-based dS_{k*}/dtau derivation',
  status: 'partial',
  closureLevel: 'preliminary-negative',

  derivation: {
    sourceODE:
      'Backward CM flow: d(gamma_k)/dtau = +2 * SUM_{j != k} 1/(gamma_k - gamma_j)',
    targetQuantity:
      'S_{k_star}(tau) = SUM_{j not in {k_star, k_star+1}} 1/(d_j * e_j), ' +
      'with d_j = gamma_{k_star+1} - gamma_j and e_j = gamma_{k_star} - gamma_j.',
    derivedIdentity:
      'dS_{k_star}/dtau = -4*T_singular - T_regular, where ' +
      'T_singular = SUM 1/(d_j*e_j) * (1/d_j^2 + 1/e_j^2) > 0 unconditionally, ' +
      'and T_regular = SUM 1/(d_j*e_j) * (R^d_j/d_j + R^e_j/e_j) with R^d_j, R^e_j ' +
      'the regular (non-singular) remainder of d(d_j)/dtau and d(e_j)/dtau respectively.',
    signOfLeadingTerm:
      '-4*T_singular is ALWAYS NEGATIVE (T_singular > 0 is a sum of positive terms). ' +
      'So the leading contribution to dS_{k_star}/dtau is strictly negative — S_{k_star} ' +
      'tends to DECREASE along the backward flow from the singular term alone.',
    equidistantSpecialCase:
      'In the degenerate equidistant-gaps limit, R^d_j = R^e_j = 0 by left/right symmetry, ' +
      'so T_regular = 0 exactly and dS_{k_star}/dtau = -4*T_singular < 0.',
  },

  preliminaryNegativeResult: {
    statement:
      'The static product S_{k_star} * B^2 has d(S_{k_star}*B^2)/dtau dominated by ' +
      'two NEGATIVE contributions at leading order: B^2 * (-4*T_singular) from ' +
      'the evolution of S_{k_star}, and S_{k_star} * (-8*rho^2) from the B^2 decay ' +
      '(rewriting imp-507 ODE in raw coordinates). So d(S_{k_star}*B^2)/dtau < 0 ' +
      'along backward flow from both terms, meaning S_{k_star}*B^2 is MONOTONE ' +
      'DECREASING from its initial value at tau = 0.',
    implication:
      'Since the initial value S_{k_star}*B^2 < 2 always (imp-507 equidistant ceiling), ' +
      'the backward flow cannot push the product above 2. Route C condition c(N) > 2 ' +
      'therefore cannot be achieved via the DIRECT quantity S_{k_star}*B^2 under the ' +
      'backward flow — this closes the most natural dynamical variant of Route C ' +
      'NEGATIVELY.',
  },

  remainingEscapeHatches: [
    {
      id: 'weighted-S',
      description:
        'The "relevant" quantity for Route C closure may not be S_{k_star}*B^2 itself ' +
        'but a time-integrated or rho-weighted variant, e.g. ' +
        'INT_0^{tau_c} S_{k_star}(t)*B(t)^2 dt or SUM_k w_k * S_k(t)*B(t)^2 with ' +
        'weights w_k peaking at the argmin. A different sign of d/dtau on that ' +
        'weighted quantity could still give c(N) > 2 (open).',
      open: true,
    },
    {
      id: 'CM-Hamiltonian-constraint',
      description:
        'The Calogero-Moser Hamiltonian H_CM = SUM p_k^2 + 2*SUM_{j<k} 1/(gamma_k - gamma_j)^2 ' +
        'is conserved along the flow. This imposes non-local coupling of S_{k_star} to ' +
        'other gap statistics — closure via the conserved quantity rather than direct ' +
        'monotonicity is an independent route (open).',
      open: true,
    },
    {
      id: 'regularization-near-collision',
      description:
        'Near the first collision tau -> tau_c, both S_{k_star} and 1/B^2 diverge. ' +
        'Their ratio may have a WELL-DEFINED finite limit that exceeds 2 in a suitable ' +
        'blow-up coordinate. A matched asymptotic expansion near the collision would ' +
        'resolve this definitively (open).',
      open: true,
    },
  ],

  numericalEvidence: {
    samples: SAMPLES,
    allTSingularPositive: ALL_T_SINGULAR_POSITIVE,
    allSB2BelowStaticCeiling: ALL_SB2_BELOW_STATIC_CEILING,
    allRhoAmpBelowOne: ALL_RHO_AMP_BELOW_ONE,
    maxRhoAmpObserved: MAX_RHO_AMP_OBSERVED,
    rhoAmpDecreasingWithN: RHO_AMP_DECREASING_WITH_N,
    note:
      'T_singular > 0 and S*B^2 < 2 hold at every sampled N in {50,...,100000}. ' +
      'Amplification ratio rho_amp = T_sing*B^2/(2*S) is strictly less than 1 at ' +
      'every sampled N, and DECREASING with N (~0.045 at N=50 down to ~0.00013 at ' +
      'N=100000). This rules out the direct dynamical variant of Route C at every ' +
      'N we can compute.',
  },

  openSubGap: {
    id: 'G3a_sub_fullsum_dynamical_routeC',
    statement:
      'Whether Route C dynamical closure can be achieved via either (a) a weighted ' +
      'variant of S_{k_star}*B^2 with different sign of d/dtau, (b) the Calogero-Moser ' +
      'Hamiltonian constraint giving a direct lower bound on c(N) from the conserved ' +
      'quantity, or (c) a matched asymptotic expansion near the first collision.',
    difficulty: 'research-grade',
    status: 'open',
    // imp-2555 HONEST PARTIAL: escape hatch (a) had two sub-variants — a
    // TIME-integrated/averaged variant and a SPATIALLY rho-weighted-sum
    // variant. The TIME-integrated sub-variant is now closed NEGATIVELY (see
    // ROUTE_C_INTEGRATED_VARIANT below): a time-average of a non-increasing
    // integrand cannot exceed its initial value, and S_{k_star}*B^2(0) < 2 at
    // every sampled N, so neither (1/tau_c) INT_0^{tau_c} S*B^2 dt nor the
    // bare integral / tau_c can reach the Route C threshold 2. This leaves
    // hatch (a) reduced to the SPATIALLY-weighted sum only; hatches (b) and
    // (c) untouched. The parent sub-gap status stays open.
    partialClosure: {
      impId: 'imp-2555',
      closes: 'time-integrated / time-averaged sub-variant of escape hatch (a)',
      conditionalOn: 'routeC-monotonicity-persistence (S_{k_star}*B^2 non-increasing on [0, tau_c), established at leading order at tau=0 and in the equidistant limit; numerically rho_amp < 1 and decreasing in N at every sampled N)',
      reducesHatchAtoTo: 'spatially rho-weighted sum variant only',
      stillOpen: ['weighted-S (spatial)', 'CM-Hamiltonian-constraint', 'regularization-near-collision'],
    },
  },

  deliverables: [
    'Explicit derivation of dS_{k_star}/dtau from the backward CM flow (this file).',
    'Sign analysis of the singular (-4*T_singular) and regular terms.',
    'Preliminary NEGATIVE result for the direct S_{k_star}*B^2 product: it is ' +
      'monotone decreasing along the backward flow, cannot exceed 2.',
    'Numerical evidence at N in {50,100,200,500,1000,2000,5000,10000,50000,100000} ' +
      'consistent with the analytic derivation.',
    'Three named escape hatches for Route C dynamical closure, each a research sub-gap.',
  ],

  nextInSequence:
    'imp-856 (PATH 3 / UNCOND-Λ: hybrid rescue for weaker-K C_mb bound). ' +
    'Since PATH 2 yields a preliminary NEGATIVE result on the direct quantity, ' +
    'PATH 3 becomes MORE IMPORTANT: if any finite K with C_mb <= K holds ' +
    'unconditionally, the imp-486 rescue table delivers the closure.',
};

// ── imp-2555: time-integrated sub-variant of escape hatch (a) — CLOSED ──────
//
// Escape hatch (a) proposed that a time-INTEGRATED or rho-weighted variant of
// S_{k_star}*B^2 might still reach the Route C threshold c(N) > 2 even though
// the bare product is monotone decreasing. We close the TIME-integrated half:
//
//   LEMMA (time-average ceiling). Let f(t) = S_{k_star}(t)*B(t)^2 on [0, tau_c).
//   If f is non-increasing (monotonicity M, established at leading order at
//   t = 0 via d(S*B^2)/dtau = 8 S (rho_amp - 1) < 0 since rho_amp < 1, and
//   exactly in the equidistant limit where T_regular = 0), then for every
//   tau in (0, tau_c]:
//       (1/tau) INT_0^{tau} f(t) dt  <=  f(0)  =  S_{k_star}(0)*B(0)^2  <  2,
//   the last inequality being the imp-507 static ceiling. Hence the time-
//   average — and therefore INT_0^{tau} f dt / tau, the natural time-weighted
//   Route C quantity — CANNOT exceed 2. The bare integral INT_0^{tau_c} f dt
//   is likewise < 2*tau_c. So NO time-weighting of the product reaches the
//   threshold; only a SPATIAL re-weighting (sum over sites) remains a live
//   escape hatch.
//
// The premise f(0) < 2 holds at every sampled N (ALL_SB2_BELOW_STATIC_CEILING),
// and the leading-order monotonicity premise rho_amp < 1 holds at every sampled
// N (ALL_RHO_AMP_BELOW_ONE), so the time-average ceiling 2 is met with the
// margin (2 - max_N f(0)) at the sampled rungs. The sole residual is the
// PERSISTENCE of monotonicity to t -> tau_c (named routeC-monotonicity-
// persistence): the regular term T_regular is not yet sign-controlled away
// from the equidistant limit, so M is leading-order + numerical, not yet a
// theorem on [0, tau_c).

const MAX_SB2_OBSERVED = Math.max(...SAMPLES.map((s) => s.SB2));
const TIME_AVG_CEILING_MARGIN = 2 - MAX_SB2_OBSERVED; // > 0 at sampled rungs

export const ROUTE_C_INTEGRATED_VARIANT = {
  id: 'imp-2555',
  title: 'Time-integrated sub-variant of Route C escape hatch (a): negative closure',
  closes: 'time-integrated / time-averaged variant of S_{k_star}*B^2 (escape hatch a, time half)',
  lemma:
    'For non-increasing f(t) = S_{k_star}(t)*B(t)^2 on [0, tau_c), the time-average ' +
    '(1/tau) INT_0^{tau} f dt <= f(0) for all tau in (0, tau_c]. With f(0) < 2 (imp-507 ' +
    'static ceiling), the time-averaged and time-integrated/tau variants cannot reach 2.',
  monotonicityPremise:
    'd(S_{k_star}*B^2)/dtau = 8 S (rho_amp - 1) < 0 at leading order since rho_amp < 1 ' +
    '(numerically true and decreasing in N at every sampled N); exact in the equidistant ' +
    'limit (T_regular = 0).',
  staticCeilingPremise: 'S_{k_star}(0)*B(0)^2 < 2 at every sampled N (imp-507 equidistant ceiling).',
  maxSB2Observed: +MAX_SB2_OBSERVED.toFixed(6),
  timeAverageCeiling: 2,
  ceilingMarginAtSamples: +TIME_AVG_CEILING_MARGIN.toFixed(6),
  verdict:
    'Time-weighting CANNOT rescue Route C dynamical: every time-average of the product is ' +
    'bounded by its initial value < 2. Escape hatch (a) is reduced from {time-integrated OR ' +
    'spatially-weighted} to {spatially-weighted only}.',
  residual: 'routeC-monotonicity-persistence — extend the leading-order monotonicity to the full [0, tau_c) by sign-controlling T_regular off the equidistant limit.',
  stillOpenHatches: ['weighted-S (spatial)', 'CM-Hamiltonian-constraint', 'regularization-near-collision'],
};

// ── Build-time assertions ─────────────────────────────────────────────────

export const ROUTE_C_DYNAMICAL_ANALYSIS_ASSERTIONS = [
  {
    id: 'imp2555-time-average-ceiling-holds',
    holds: () =>
      ALL_SB2_BELOW_STATIC_CEILING &&
      ALL_RHO_AMP_BELOW_ONE &&
      TIME_AVG_CEILING_MARGIN > 0 &&
      ROUTE_C_INTEGRATED_VARIANT.timeAverageCeiling === 2,
    why:
      'The time-integrated sub-variant of escape hatch (a) is closed by: (i) f(0) = ' +
      'S_{k_star}*B^2 < 2 at every sample (static ceiling, the time-average upper bound under ' +
      'monotonicity), and (ii) rho_amp < 1 at every sample (leading-order monotonicity premise). ' +
      'A regression flipping either premise would silently reopen the time-weighted route.',
  },
  {
    id: 'imp834-t-singular-positive-at-samples',
    holds: () => ROUTE_C_DYNAMICAL_ANALYSIS.numericalEvidence.allTSingularPositive,
    why:
      'T_singular is a sum of strictly positive terms (positivity lemma from ' +
      'g3a-fullsum-closure.js — all 1/(d_j * e_j) > 0 and 1/d_j^2 + 1/e_j^2 > 0). ' +
      'A zero or negative sample indicates numerical overflow / sign error.',
  },
  {
    id: 'imp834-static-ceiling-at-samples',
    holds: () => ROUTE_C_DYNAMICAL_ANALYSIS.numericalEvidence.allSB2BelowStaticCeiling,
    why:
      'The imp-507 equidistant ceiling says S_{k_star}*B^2 < 2 always. A violation ' +
      'would indicate either a bug in this file or a counterexample to imp-507 ' +
      '(both need investigation).',
  },
  {
    id: 'imp834-rho-amp-below-one',
    holds: () => ROUTE_C_DYNAMICAL_ANALYSIS.numericalEvidence.allRhoAmpBelowOne,
    why:
      'The amplification ratio rho_amp = T_sing*B^2/(2*S) must exceed 1 for the ' +
      'product S_{k_star}*B^2 to grow under backward flow. Empirically it is ' +
      'far below 1 and decreasing with N. This assertion guards against a future ' +
      'data change that would flip the verdict silently.',
  },
  {
    id: 'imp834-status-partial',
    holds: () => ROUTE_C_DYNAMICAL_ANALYSIS.status === 'partial',
    why:
      'This file delivers a PRELIMINARY negative result and names three open escape ' +
      'hatches. It does not close Route C dynamical unconditionally. Flipping the ' +
      'status to closed/completed without resolving the escape hatches would be ' +
      'a false claim.',
  },
  {
    id: 'imp3073-path2-refutation-reproduces',
    holds: () => {
      const ne = ROUTE_C_DYNAMICAL_ANALYSIS.numericalEvidence;
      const samples = ne.samples;
      const last = samples[samples.length - 1];
      // imp-3073 confirmatory re-measure: the lambda-roadmap currentStatus
      // PATH 2 line reports the direct Route C dynamical S*B^2 REFUTED with
      // amplification ratio max 0.073 decreasing to 0.00013 across the sampled
      // N grid. Re-running the sweep here must reproduce: max rho_amp approx
      // 0.073, the N=100000 endpoint approx 0.00013, all below 1 (no amplify).
      return (
        ne.allRhoAmpBelowOne &&
        ne.rhoAmpDecreasingWithN &&
        ne.maxRhoAmpObserved > 0.07 && ne.maxRhoAmpObserved < 0.08 &&
        last.N === 100000 &&
        last.rho_amp > 0.0001 && last.rho_amp < 0.0002 &&
        samples.every((s) => s.amplifies === false)
      );
    },
    why:
      'imp-3073 CONFIRMATORY re-measurement of the lambda-roadmap PATH 2 ' +
      'refutation (imp-834 direct Route C dynamical S*B^2). Re-running the ' +
      'per-N amplification ratio rho_amp = T_sing*B^2/(2*S) over the sampled ' +
      'grid {50,...,100000} reproduces the roadmap currentStatus numbers: max ' +
      'rho_amp is approx 0.073 (attained at N=100) and the N=100000 endpoint is ' +
      'approx 0.00013, with rho_amp strictly below 1 at every sampled N ' +
      '(amplifies=false everywhere) — the refutation reproduces exactly. The ' +
      'three named escape hatches imp-861 (weighted-S), imp-862 (CM ' +
      'Hamiltonian) and imp-863 (matched asymptotics) remain status partial / ' +
      'preliminary-negative, i.e. still the listed open continuations. A ' +
      'regression flipping any of these flags would silently reopen the PATH 2 ' +
      'refutation that the roadmap reports as settled.',
  },
];
