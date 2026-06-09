/**
 * imp-2487 / Route C escape hatch imp-861, PER-TERM weight case.
 *
 * PURPOSE
 * -------
 * imp-834 (route-c-dynamical-analysis.js) refuted the direct Route C
 * dynamical quantity S_{kStar} * B^2 numerically at every sampled N up to
 * 10^5. imp-861 (route-c-weighted-s-analysis.js) then ruled out all
 * non-negative PER-SITE static weights (which linear combination of per-site
 * products S_k * B_k^2 to take) at N up to 5000.
 *
 * One weight freedom remained untouched: PER-TERM weights INSIDE the Cauchy
 * sum itself. The imp-507 equidistant ceiling (g3a-fullsum-closure.js) is a
 * statement about the per-term telescoping caps — the j-th term of
 * S_{kStar} * B^2 is capped by 1/(m(m+1)) at distance m, and the caps sum to
 * exactly 2 in the equidistant limit. So the obstruction lives term-by-term,
 * and the natural escape attempt is to reweight the TERMS:
 *
 *   S_w = SUM_{j not in {k, k+1}}  w_j / (d_j * e_j),     w_j >= 0,
 *
 * with d_j = gamma_{k+1} - gamma_j and e_j = gamma_k - gamma_j, asking
 * whether some weight choice makes the weighted amplification ratio exceed 1
 * (leading-order growth under the backward Calogero-Moser flow).
 *
 * DERIVATION (weights pass through linearly)
 * ------------------------------------------
 * The imp-834 singular-regular decomposition acts on each term of S
 * separately, so for per-term weights the leading form is unchanged except
 * that every per-term factor carries its weight:
 *
 *   d(S_w * B^2)/dtau |_{leading} = 4 * T_w * B^2 - 8 * S_w
 *                                 = 8 * S_w * (rho_w - 1),
 *
 *   T_w   = SUM_j w_j * a_j * (1/d_j^2 + 1/e_j^2),    a_j = 1/(d_j * e_j),
 *   rho_w = T_w * B^2 / (2 * S_w).
 *
 * WEIGHTED-MEAN LEMMA
 * -------------------
 * Define the per-term ratio  r_j = (B^2 / 2) * (1/d_j^2 + 1/e_j^2).  Then
 *
 *   rho_w = SUM_j (w_j * a_j) * r_j / SUM_j (w_j * a_j),
 *
 * a weighted MEAN of the r_j under the measure w_j * a_j. By the imp-507
 * positivity lemma every a_j > 0 (d_j and e_j share a sign for j outside
 * {k, k+1}), so for non-negative weights the measure is non-negative and
 *
 *   sup over w >= 0 (not all zero) of rho_w  =  max_j r_j,
 *
 * attained in the limit of all weight concentrated on the argmax term.
 * The per-term weighted variant escapes at leading order iff max_j r_j > 1.
 *
 * ANALYTIC CEILING AT THE ARGMIN SITE (main new result)
 * -----------------------------------------------------
 * THEOREM. At k = kStar (argmin gap, B = global minimum gap), every per-term
 * ratio satisfies  r_j <= 5/8,  for EVERY N. Proof: for j < kStar,
 * e_j = gamma_kStar - gamma_j >= g_{kStar-1} >= B because B is the global
 * minimum gap, and d_j = e_j + B >= 2B; hence
 * r_j <= (B^2/2) * (1/B^2 + 1/(4B^2)) = 5/8. For j > kStar+1 symmetrically
 * |d_j| >= g_{kStar+1} >= B and |e_j| = |d_j| + B >= 2B, same bound. QED.
 *
 * COROLLARY. sup_w rho_w <= 5/8 < 1 at the argmin site, for all N
 * simultaneously. NO choice of non-negative per-term weights can produce
 * leading-order growth of the weighted Route C quantity at kStar. This is
 * an ANALYTIC refutation (imp-834 and imp-861 were numerical-only) and it
 * uses nothing about the zeros beyond the global minimality of B.
 *
 * ADJACENCY LEMMA (makes the global sweep O(N))
 * ---------------------------------------------
 * At any interior site k, max_j r_j is attained at j = k-1 or j = k+2:
 * moving j away from the site strictly increases both |e_j| and |d_j|, so
 * r_j is strictly decreasing in the distance on each side. Hence
 * max_j r_j = (B_k^2/2) * max( 1/g_L^2 + 1/(g_L+B_k)^2,
 *                              1/g_R^2 + 1/(g_R+B_k)^2 )
 * with g_L, g_R the two gaps adjacent to the site gap B_k.
 *
 * NUMERICAL SWEEP (full imp-834 N grid, including 10^4..10^5)
 * -----------------------------------------------------------
 * At every N in {50, 100, 200, 500, 1000, 2000, 5000, 10000, 50000, 100000}:
 *   (a) max_j r_j at kStar is computed by FULL O(N) scan: it is orders below
 *       the 5/8 ceiling (0.093 at N=50 down to 0.00027 at N=10^5) and the
 *       argmax term is always adjacent to the site, confirming the lemma.
 *   (b) the GLOBAL max over all sites k of max_j r_j EXCEEDS 1 at every N
 *       (10.8 at N=50, growing to 3227.7 at N=10^5). The argmax is always a
 *       gap-contrast site: a wide gap B_k flanked by a much smaller gap g,
 *       giving r ~ B_k^2 / (2 g^2).
 *
 * VERDICT (two-tier, honest)
 * --------------------------
 * TIER 1 — EXTENDS the refutation where it matters: at the argmin site the
 * per-term weighted variant is refuted ANALYTICALLY with ceiling 5/8, for
 * every N, closing the per-term branch of escape hatch imp-861 at kStar.
 *
 * TIER 2 — ratio > 1 DOES occur off-site, so by the literal "ratio > 1
 * anywhere" criterion the doubly-weighted (site + term) variant escapes
 * FORMALLY. But the escape is degenerate: the maximizing weight concentrates
 * on a single gap-contrast term, reducing W to ~ (B_k/g)^2 — a two-gap ratio,
 * not a Cauchy sum. The imp-507 ceiling 2 is a statement about the UNWEIGHTED
 * normalization; after reweighting, the threshold that W must exceed to force
 * the Route C condition c(N) > 2 is unknown, and no bridging inequality from
 * off-site W growth back to S_{kStar} * B^2 exists. The formal escape is NOT
 * a closure path until that bridge is built — named as a sub-gap below.
 *
 * SYNTAX NOTE: no star-slash sequences inside this comment block; derivative
 * notation kept as dX/dtau with X spelled out so no comment-close sequence
 * can form.
 */

import { ZEROS_EXTENDED } from '../data/zeros-to-1e6.js';

// ── Sweep on the full imp-834 N grid ──────────────────────────────────────

const SAMPLE_Ns = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 50000, 100000];

/**
 * Per-term ratio r_j = (B^2 / 2) * (1/d_j^2 + 1/e_j^2) scanned two ways:
 * full O(N) scan at the argmin site kStar, and adjacency-lemma O(1) per site
 * for the global maximum over all interior sites.
 */
function sweepPerTermRatios(N) {
  // argmin-gap site
  let B_min = Infinity;
  let kStar = 0;
  for (let k = 0; k < N - 1; k++) {
    const g = ZEROS_EXTENDED[k + 1] - ZEROS_EXTENDED[k];
    if (g < B_min) { B_min = g; kStar = k; }
  }

  // (a) full per-term scan at kStar
  const gk   = ZEROS_EXTENDED[kStar];
  const gkp1 = ZEROS_EXTENDED[kStar + 1];
  const B    = gkp1 - gk;
  let r_max_at_kStar = -Infinity;
  let j_argmax = -1;
  for (let j = 0; j < N; j++) {
    if (j === kStar || j === kStar + 1) continue;
    const dj = gkp1 - ZEROS_EXTENDED[j];
    const ej = gk - ZEROS_EXTENDED[j];
    const r = (B * B / 2) * (1 / (dj * dj) + 1 / (ej * ej));
    if (r > r_max_at_kStar) { r_max_at_kStar = r; j_argmax = j; }
  }

  // (b) global maximum over interior sites via the adjacency lemma
  let r_global_max = -Infinity;
  let k_argmax = -1;
  for (let k = 1; k < N - 2; k++) {
    const Bk = ZEROS_EXTENDED[k + 1] - ZEROS_EXTENDED[k];
    const gL = ZEROS_EXTENDED[k] - ZEROS_EXTENDED[k - 1];
    const gR = ZEROS_EXTENDED[k + 2] - ZEROS_EXTENDED[k + 1];
    const rL = (Bk * Bk / 2) * (1 / (gL * gL) + 1 / ((gL + Bk) * (gL + Bk)));
    const rR = (Bk * Bk / 2) * (1 / (gR * gR) + 1 / ((gR + Bk) * (gR + Bk)));
    const rk = Math.max(rL, rR);
    if (rk > r_global_max) { r_global_max = rk; k_argmax = k; }
  }

  return {
    N,
    kStar_1idx:            kStar + 1,
    B_min:                 +B_min.toExponential(4),
    r_max_at_kStar:        +r_max_at_kStar.toExponential(4),
    j_argmax_1idx:         j_argmax + 1,
    argmax_term_adjacent:  j_argmax === kStar - 1 || j_argmax === kStar + 2,
    r_global_max:          +r_global_max.toExponential(4),
    k_argmax_1idx:         k_argmax + 1,
    offsite_formal_escape: r_global_max > 1,
  };
}

const SAMPLES = SAMPLE_Ns
  .filter((N) => N <= ZEROS_EXTENDED.length)
  .map((N) => sweepPerTermRatios(N));

const ANALYTIC_CEILING            = 5 / 8;
const ALL_KSTAR_BELOW_CEILING     = SAMPLES.every((s) => s.r_max_at_kStar <= ANALYTIC_CEILING);
const ALL_KSTAR_ARGMAX_ADJACENT   = SAMPLES.every((s) => s.argmax_term_adjacent);
const ALL_OFFSITE_ESCAPE          = SAMPLES.every((s) => s.offsite_formal_escape);
const KSTAR_RATIO_DECREASING      =
  SAMPLES[SAMPLES.length - 1].r_max_at_kStar < SAMPLES[0].r_max_at_kStar;

// ── Export ────────────────────────────────────────────────────────────────

export const ROUTE_C_WEIGHTED_S_PERTERM = {
  id: 'imp-2487',
  title: 'Route C escape hatch imp-861, per-term weight case: analytic 5/8 ceiling at kStar, formal off-site escape named',
  status: 'partial',
  closureLevel: 'analytic-negative-at-kStar-formal-offsite-escape-unbridged',
  parent: 'imp-861',
  grandparent: 'imp-834',

  derivation: {
    target:
      'S_w = SUM_j w_j / (d_j * e_j) over terms j at a fixed site, non-negative per-term weights w_j; ' +
      'weighted ratio rho_w = T_w * B^2 / (2 * S_w).',
    weightedMeanLemma:
      'rho_w is a weighted mean of the per-term ratios r_j = (B^2/2)(1/d_j^2 + 1/e_j^2) ' +
      'under the positive measure w_j * a_j (a_j = 1/(d_j e_j) > 0 by the imp-507 positivity lemma). ' +
      'Hence sup over non-negative weights of rho_w equals max_j r_j.',
    analyticCeilingTheorem:
      'At the argmin-gap site, |e_j| >= B and |d_j| >= 2B on one side (symmetrically on the other), ' +
      'using only that B is the global minimum gap. Therefore r_j <= (1/2)(1 + 1/4) = 5/8 for every ' +
      'term j and every N. No non-negative per-term weighting at kStar reaches rho_w >= 1: the ' +
      'per-term branch of escape hatch imp-861 is refuted ANALYTICALLY at the Route C site.',
    adjacencyLemma:
      'max_j r_j at any site is attained at an adjacent term (j = k-1 or j = k+2), since r_j is ' +
      'strictly decreasing in the distance from the site on each side. This makes the global sweep O(N).',
  },

  verdict: {
    tier1ExtendsRefutation:
      'At the argmin site the weighted variant does NOT escape: analytic ceiling 5/8 < 1 valid at all N, ' +
      'with numerical max ratio 0.093 (N=50) falling to 0.00027 (N=100000), argmax term always adjacent. ' +
      'Combined with imp-861 (per-site weights) and imp-834 (unweighted), all static non-negative weight ' +
      'freedoms at the Route C site are now exhausted with negative outcome.',
    tier2FormalOffsiteEscape:
      'Ratio > 1 occurs at gap-contrast sites at every sampled N (10.77 at N=50 growing to 3227.7 at ' +
      'N=100000), so the doubly-weighted site-plus-term variant escapes FORMALLY by the ticket criterion. ' +
      'The escape is degenerate: the optimal weight concentrates on one term, W collapses to a two-gap ' +
      'contrast ratio, the imp-507 ceiling 2 no longer normalizes the comparison, and no bridging ' +
      'inequality from off-site W growth back to c(N) = S_kStar * B^2 > 2 exists. Not a closure path yet.',
  },

  numericalEvidence: {
    samples: SAMPLES,
    analyticCeiling:                 ANALYTIC_CEILING,
    allKStarRatiosBelowCeiling:      ALL_KSTAR_BELOW_CEILING,
    allKStarArgmaxTermsAdjacent:     ALL_KSTAR_ARGMAX_ADJACENT,
    kStarRatioDecreasingWithN:       KSTAR_RATIO_DECREASING,
    offsiteFormalEscapeAtEveryN:     ALL_OFFSITE_ESCAPE,
    note:
      'Full imp-834 N grid {50,...,100000} — twenty times deeper than the imp-861 per-site sweep, ' +
      'made affordable by the adjacency lemma (O(N) per N instead of O(N^2)).',
  },

  newSubGaps: [
    {
      id: 'imp-2487-sub-offsite-bridge',
      statement:
        'Whether the formal off-site escape (per-term ratio > 1 at gap-contrast sites, growing with N) ' +
        'can be bridged back to the Route C target: exhibit a normalization or comparison inequality ' +
        'under which leading-order growth of a weighted quantity anchored at a NON-minimal site forces ' +
        'c(N) = S_kStar * B^2 > 2 somewhere along the backward trajectory. Without the bridge the ' +
        'off-site growth is a statement about gap-contrast dynamics, not about the Route C ceiling.',
      difficulty: 'research-grade',
      status: 'open',
    },
  ],

  inheritedOpenSubGaps: [
    'imp-861-sub-tau-dependent-weights (flow-adapted weights, still open)',
    'imp-861-sub-signed-weights (signed weights, still open; note the weighted-mean lemma here is ' +
      'also restricted to non-negative weights)',
  ],

  deliverables: [
    'Weighted-mean lemma: sup over non-negative per-term weights of rho_w equals max_j r_j.',
    'Analytic theorem: r_j <= 5/8 at the argmin site for every N, using only global minimality of B — ' +
      'first ANALYTIC (not numerical) refutation in the imp-834 escape-hatch family.',
    'Adjacency lemma reducing the global per-term sweep to O(N).',
    'Sweep on the FULL imp-834 N grid up to 100000 (imp-861 had stopped at 5000).',
    'Honest two-tier verdict: refutation extended at kStar; formal off-site escape named with its ' +
      'missing bridge as sub-gap imp-2487-sub-offsite-bridge.',
  ],
};

// ── Build-time assertions ────────────────────────────────────────────────

export const ROUTE_C_WEIGHTED_S_PERTERM_ASSERTIONS = [
  {
    id: 'imp2487-kstar-perterm-ratio-below-analytic-ceiling',
    holds: () => ROUTE_C_WEIGHTED_S_PERTERM.numericalEvidence.allKStarRatiosBelowCeiling,
    why:
      'The analytic theorem bounds every per-term ratio at the argmin site by 5/8 using only the ' +
      'global minimality of B. A numerical sample exceeding 5/8 would mean the theorem or the ' +
      'implementation is wrong, invalidating the tier-1 closure.',
  },
  {
    id: 'imp2487-kstar-argmax-term-adjacent',
    holds: () => ROUTE_C_WEIGHTED_S_PERTERM.numericalEvidence.allKStarArgmaxTermsAdjacent,
    why:
      'The adjacency lemma claims max_j r_j is attained at j = kStar-1 or j = kStar+2. The full O(N) ' +
      'scan at kStar independently cross-checks this at every sampled N; a violation would invalidate ' +
      'the O(N) global sweep that relies on the lemma.',
  },
  {
    id: 'imp2487-offsite-formal-escape-present',
    holds: () => ROUTE_C_WEIGHTED_S_PERTERM.numericalEvidence.offsiteFormalEscapeAtEveryN,
    why:
      'The tier-2 verdict records that ratio > 1 occurs at gap-contrast sites at every sampled N. ' +
      'If a data change removed the off-site escape, the sub-gap imp-2487-sub-offsite-bridge would ' +
      'become moot and the verdict text would need rewriting.',
  },
  {
    id: 'imp2487-status-partial',
    holds: () => ROUTE_C_WEIGHTED_S_PERTERM.status === 'partial',
    why:
      'Tier 1 is an analytic negative at kStar, but the off-site bridge sub-gap and the two inherited ' +
      'imp-861 sub-gaps (tau-dependent, signed weights) remain open. Flipping status to closed without ' +
      'resolving them would be a false claim.',
  },
];
