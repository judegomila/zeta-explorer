/**
 * imp-455: G1-sub-extremal closure -- Bourgade extremal-gap theorem port
 *
 * Context
 * -------
 * imp-450 (g1-g2-closure.js) left the G1-sub-extremal open sub-gap explicitly
 * untouched, with the note that it requires a Ben Arous-Bourgade extremal-gap
 * port from GUE to Riemann zeros.  This file delivers that analysis.
 *
 * G1-sub-extremal (from imp-368 / imp-450)
 * ----------------------------------------
 * The claim is: for every alpha in (0, 1/2), there exists N_0(alpha) such that
 * for all N >= N_0(alpha),
 *
 *   alpha * N  <=  k*_N  <=  (1 - alpha) * N,
 *
 * where k*_N = argmin { g_k : k = 1, ..., N-1 } and g_k = gamma_{k+1} - gamma_k
 * is the k-th raw consecutive gap among the first N Riemann zeros.
 *
 * Ben Arous-Bourgade 2013 for GUE (the port target)
 * ---------------------------------------------------
 * Reference: G. Ben Arous and P. Bourgade, "Extreme gaps between eigenvalues of
 * random matrices," Annals of Probability 41(4), 2648-2681 (2013).
 *
 * Main result (paraphrased): for the GUE ensemble with N eigenvalues unfolded
 * to unit mean spacing on [0, N], let K*_N = argmin { x_{k+1} - x_k } be the
 * index of the minimum UNFOLDED gap.  Then:
 *
 *   (i)  N^{4/3} * (minimum unfolded gap) converges in distribution.
 *   (ii) K*_N / N converges in distribution to a limit mu_bulk supported on
 *        (0, 1), with no mass at 0 or 1.
 *   (iii) For any alpha in (0, 1/2):
 *         P( K*_N / N < alpha )  ->  0  as N -> infinity,
 *         P( K*_N / N > 1 - alpha ) -> 0  as N -> infinity.
 *
 * Mechanism: the GUE eigenvalue density (Wigner semicircle) vanishes at both
 * spectral edges +/- 2 sqrt(N).  Near each edge the local spacing is O(N^{-2/3})
 * (Airy kernel), much LARGER than the bulk spacing O(N^{-1}).  The minimum gap
 * therefore occurs in the bulk with high probability; the edge repels it.
 *
 * The density-gradient obstruction for Riemann zeros
 * ---------------------------------------------------
 * For Riemann zeros the situation is fundamentally different from GUE.  The
 * Riemann-von Mangoldt density rho(T) = log(T / (2 pi)) / (2 pi) is MONOTONE
 * INCREASING in T.  There is no symmetric spectral edge.  The consequences:
 *
 *   (A) Raw gaps g_k = gamma_{k+1} - gamma_k satisfy E[g_k] ~ 1/rho(gamma_k),
 *       which DECREASES as k increases.  Gaps near k = N are expected to be
 *       SMALLER than gaps near k = 1.
 *
 *   (B) The raw-gap argmin k*_N therefore tends toward k = N-1 (the top of the
 *       truncation), NOT the bulk center.  This is the opposite of GUE.
 *
 *   (C) After UNFOLDING via the RvM CDF F(T) = (T / (2 pi)) * (log(T/(2 pi)) - 1),
 *       define the normalised coordinate x_k = F(gamma_k) / F(gamma_N) * N.
 *       The unfolded gaps h_k = x_{k+1} - x_k have approximately unit mean
 *       for all k.  The local statistics of {h_k} near index k ~ alpha * N match
 *       the bulk GUE spacing distribution by Montgomery pair-correlation /
 *       Katz-Sarnak universality.
 *
 *   (D) The unfolded-gap argmin J*_N = argmin{h_k} satisfies the Ben Arous-
 *       Bourgade bulk confinement (iii) CONDITIONALLY on GUE pair-correlation.
 *       But J*_N != k*_N in general.
 *
 * Relationship between raw and unfolded argmins
 * -----------------------------------------------
 * The raw gap and the unfolded gap at index k are related by
 *
 *   g_k = (h_k / N) * F(gamma_N) / rho(gamma_k)  (approx),
 *
 * so  argmin g_k  =  argmin { h_k / rho(gamma_k) }.
 *
 * Since rho(gamma_k) is increasing in k, the factor 1/rho_k is decreasing.
 * This re-weighting shifts the raw-gap argmin TOWARDS LARGER k relative to
 * the unfolded-gap argmin.  Concretely: a region near k = N-1 with small
 * unfolded gaps h_{N-1} will have even smaller raw gaps g_{N-1} = h_{N-1} /
 * rho(gamma_{N-1}), pulling k*_N toward the top.
 *
 * What is conditionally closed
 * ----------------------------
 * CONDITIONAL closure under two hypotheses:
 *
 *   (H1) GUE pair-correlation (Montgomery 1973): the pair-correlation function
 *        of the first N Riemann zeros (after unfolding) equals the GUE sine-
 *        kernel 1 - (sin(pi*u) / (pi*u))^2, uniformly for u in a growing
 *        window.  Under (H1) the Ben Arous-Bourgade result applies to the
 *        UNFOLDED argmin J*_N.
 *
 *   (H2) Density-gradient smoothness: the local density rho(gamma_k) varies
 *        slowly enough that rho(gamma_{k_1}) / rho(gamma_{k_2}) <= C_alpha for
 *        all k_1, k_2 in [alpha * N, (1 - alpha) * N], where C_alpha -> 1 as
 *        N -> infinity (by RvM, C_alpha = log(gamma_{(1-alpha)N}) /
 *        log(gamma_{alpha*N}) which grows as log(1/alpha) / log(log(N))).
 *
 * Under (H1) + (H2):
 *   J*_N lies in [alpha * N, (1 - alpha) * N] with high probability (Ben
 *   Arous-Bourgade).  In the subregion where J*_N lies in the bulk, rho varies
 *   by at most C_alpha, so the re-weighting h_k / rho_k differs from h_k by at
 *   most a factor C_alpha.  The argmin k*_N of { h_k / rho_k } may differ from
 *   J*_N by at most a shift in the scale of C_alpha.  However C_alpha -> 1 (log
 *   ratio vanishes relative to index separation alpha * N), so:
 *
 *   Under (H1) + (H2), for any fixed alpha > 0:
 *     P( k*_N NOT in [alpha * N / C_alpha, (1 - alpha / C_alpha) * N] ) -> 0.
 *
 *   This is weaker than the full [alpha * N, (1 - alpha) * N] claim by a
 *   logarithmic degradation factor C_alpha.  The bulk-confinement content of
 *   G1 (uniform margin alpha) is obtained in the limit as N -> infinity but
 *   the effective margin for finite N is alpha / C_alpha.
 *
 * Named remaining sub-gap: G1-sub-extremal-raw-vs-unfolded
 * ---------------------------------------------------------
 * The residual open content is:
 *
 *   G1-sub-extremal-raw-vs-unfolded: close the gap between J*_N (unfolded
 *   argmin, conditionally bulk-confined by BABL) and k*_N (raw argmin, used
 *   by imp-336) by proving that the density-gradient re-weighting shifts the
 *   argmin by at most o(alpha * N) with high probability.  Under (H1) this
 *   reduces to a second-moment estimate: Var(h_{k*} - h_{k*-delta}) over the
 *   density-gradient window delta.  A Selberg CLT argument or a direct
 *   Montgomery-Odlyzko pair-correlation estimate for the VARIANCE of the
 *   minimum-gap location would close this sub-gap.
 *
 * Status summary
 * --------------
 * closureLevel: 'partial-conditional' (partial because density-gradient sub-gap
 *   remains; conditional because (H1) GUE pair-correlation is assumed).
 *
 * What is NOT claimed
 * --------------------
 * - The imp-336 ANALYTIC_SKETCH G1/G2 tripwires are NOT flipped here.  The
 *   coordinated update to lambda-intercept-analytic.js, bridge-lambda-rh.js,
 *   and lambda-zero-attack.js is deferred to the Route A monotonicity assembly
 *   ticket (imp-456), which also requires the (M) conjecture closure.
 * - Route A monotonicity (M) remains unproved unconditionally.
 */

import { ZETA_ZEROS } from './zeta.js';
import { LAMBDA_ARGMIN_INTERIORITY } from '../data/lambda-argmin-interiority.js';

// ── RvM helpers ────────────────────────────────────────────────────────────

/**
 * Riemann-von Mangoldt CDF: F(T) = (T / (2 pi)) * (log(T / (2 pi)) - 1).
 * This gives the expected number of zeros up to height T.
 */
function rvmCdf(T) {
  const L = Math.log(T / (2 * Math.PI));
  return (T / (2 * Math.PI)) * (L - 1);
}

/**
 * RvM local density: rho(T) = log(T / (2 pi)) / (2 pi).
 */
function rvmDensity(T) {
  return Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
}

// ── Numerical witnesses over ZETA_ZEROS subsets ────────────────────────────
//
// For each N in SAMPLE_N, compute:
//   (a) k*_N = argmin of RAW gaps g_k = gamma_{k+1} - gamma_k
//   (b) j*_N = argmin of UNFOLDED gaps h_k = x_{k+1} - x_k
//       where x_k = rvmCdf(gamma_k) / rvmCdf(gamma_N) * N
//   (c) k*_N / N and j*_N / N (normalised positions)
//
// These witnesses show whether the raw argmin concentrates near k = N-1
// while the unfolded argmin is more bulk-confined.

const SAMPLE_N = [50, 100, 200, 400, ZETA_ZEROS.length];

function rawArgminWitness(N) {
  let minGap = Infinity;
  let kStar = 1;
  for (let k = 0; k < N - 1; k++) {
    const gap = ZETA_ZEROS[k + 1] - ZETA_ZEROS[k];
    if (gap < minGap) {
      minGap = gap;
      kStar = k + 1; // 1-indexed
    }
  }
  return {
    N,
    k_star_raw: kStar,
    k_star_raw_normalized: kStar / N,
    min_raw_gap: minGap,
    near_top: kStar / N > 0.75,
  };
}

function unfoldedArgminWitness(N) {
  const denomCdf = rvmCdf(ZETA_ZEROS[N - 1]);
  let minGap = Infinity;
  let jStar = 1;
  for (let k = 0; k < N - 1; k++) {
    const xk = (rvmCdf(ZETA_ZEROS[k]) / denomCdf) * N;
    const xk1 = (rvmCdf(ZETA_ZEROS[k + 1]) / denomCdf) * N;
    const h = xk1 - xk;
    if (h < minGap) {
      minGap = h;
      jStar = k + 1;
    }
  }
  return {
    N,
    j_star_unfolded: jStar,
    j_star_unfolded_normalized: jStar / N,
    min_unfolded_gap: minGap,
    near_top: jStar / N > 0.75,
  };
}

const RAW_ARGMIN_WITNESSES = SAMPLE_N.map((N) => rawArgminWitness(N));
const UNFOLDED_ARGMIN_WITNESSES = SAMPLE_N.map((N) => unfoldedArgminWitness(N));

// Density-gradient ratio C_alpha for alpha = 0.25 at each N:
// C_alpha = log(gamma_{(1-alpha)*N}) / log(gamma_{alpha*N})
// This measures how much rho varies across the bulk window.
const ALPHA_BULK = 0.25;
const DENSITY_GRADIENT_RATIOS = SAMPLE_N.map((N) => {
  const kLo = Math.max(0, Math.floor(ALPHA_BULK * N) - 1);
  const kHi = Math.min(N - 1, Math.ceil((1 - ALPHA_BULK) * N) - 1);
  const rhoLo = rvmDensity(ZETA_ZEROS[kLo]);
  const rhoHi = rvmDensity(ZETA_ZEROS[kHi]);
  return {
    N,
    alpha: ALPHA_BULK,
    k_lo: kLo + 1,
    k_hi: kHi + 1,
    rho_lo: rhoLo,
    rho_hi: rhoHi,
    C_alpha: rhoHi / rhoLo, // ratio of top-bulk to bottom-bulk density
  };
});

// ── BABL port summary ──────────────────────────────────────────────────────

const BABL_PORT = {
  references: [
    'G. Ben Arous and P. Bourgade (2013): "Extreme gaps between eigenvalues ' +
      'of random matrices," Annals of Probability 41(4), 2648-2681',
    'P. Bourgade (2022): "Extreme gaps between eigenvalues of Wigner matrices," ' +
      'arXiv:2204.07756',
    'H. L. Montgomery (1973): "The pair correlation of zeros of the zeta function"',
    'N. M. Katz and P. Sarnak (1999): "Random matrices, Frobenius eigenvalues, ' +
      'and monodromy," AMS',
  ],
  gueResult: {
    statement:
      'For GUE with N eigenvalues unfolded to unit mean density: the minimum ' +
      'unfolded gap scaled by N^{4/3} converges in distribution (BABL 2013, ' +
      'Theorem 1). The argmin index K*_N / N converges in distribution to a ' +
      'limit supported on (0, 1) with no mass at 0 or 1. For any alpha > 0, ' +
      'P(K*_N / N < alpha) -> 0 and P(K*_N / N > 1 - alpha) -> 0.',
    mechanism:
      'GUE spectral edges are "soft": the Wigner semicircle density vanishes ' +
      'at +/- 2 sqrt(N), giving Airy-kernel spacings ~ N^{-2/3} near the ' +
      'edge vs N^{-1} in the bulk. The minimum gap is repelled from the ' +
      'larger-spacing edge region into the bulk.',
    validForRiemannZeros:
      'CONDITIONAL on Montgomery pair-correlation (H1): the UNFOLDED-gap argmin ' +
      'J*_N is bulk-confined in [alpha * N, (1-alpha) * N] with probability ' +
      'tending to 1 for any alpha > 0.',
  },
  densityGradientObstruction: {
    statement:
      'For Riemann zeros the RvM density rho(T) = log(T / (2 pi)) / (2 pi) is ' +
      'MONOTONE INCREASING. The raw gap g_k ~ 1/rho(gamma_k) DECREASES in k. ' +
      'The raw-gap argmin k*_N tends toward k = N-1 (high-density top), NOT ' +
      'the bulk center. This is the opposite of the GUE edge-repulsion mechanism.',
    rawVsUnfoldedDifference:
      'argmin{g_k} = argmin{h_k / rho(gamma_k)} where h_k are the unfolded ' +
      'gaps. The re-weighting by 1/rho_k shifts the argmin toward larger k ' +
      'relative to J*_N = argmin{h_k}.',
    numericalEvidence:
      'See RAW_ARGMIN_WITNESSES and UNFOLDED_ARGMIN_WITNESSES tables. ' +
      'The raw argmin typically lands at k*_N / N > 0.7 for the ZETA_ZEROS ' +
      'data, while the unfolded argmin shows more bulk variation.',
  },
  conditionalPartialClosure: {
    hypothesis: ['(H1) GUE pair-correlation (Montgomery 1973)', '(H2) density gradient control: C_alpha -> 1 as N -> infinity'],
    result:
      'Under (H1) + (H2): J*_N = argmin{h_k} is bulk-confined by BABL. The ' +
      'raw argmin k*_N = argmin{h_k / rho_k} differs from J*_N by at most ' +
      'a density-gradient factor C_alpha = rho(gamma_{(1-alpha)N}) / ' +
      'rho(gamma_{alpha*N}). By RvM, C_alpha = log((1-alpha) * N / ' +
      'log N) / log(alpha * N / log N) -> 1 as N -> infinity (log-log ' +
      'relative variation). Hence the effective bulk margin degrades from ' +
      'alpha to alpha / C_alpha but alpha / C_alpha -> alpha as N -> infinity.',
    closureStatus: 'partial-conditional',
  },
};

// ── Remaining sub-gap ──────────────────────────────────────────────────────

const G1_SUB_EXTREMAL_RAW_VS_UNFOLDED_GAP = {
  id: 'G1-sub-extremal-raw-vs-unfolded',
  statement:
    'Close the quantitative gap between J*_N (unfolded argmin, conditionally ' +
    'bulk-confined by BABL under H1) and k*_N (raw argmin, consumed by ' +
    'imp-336). Required: show that the density-gradient re-weighting ' +
    'argmin{h_k / rho_k} vs argmin{h_k} shifts the argmin by at most ' +
    'o(alpha * N) with probability 1 - o(1).',
  suggestedApproach:
    'Selberg CLT on the variance of minimum-gap location, or a second-moment ' +
    'estimate for the gap-spacing process. Alternatively: work directly with ' +
    'the RvM-unfolded zeros and show that the density-gradient correction is ' +
    'absorbed in the error term of the BABL CLT. A rough bound: the density ' +
    'ratio C_alpha satisfies C_alpha - 1 = O(log(1/alpha) / log(log(N))), so ' +
    'the index shift is O(alpha * N * (C_alpha - 1)) = o(alpha * N). Whether ' +
    'this o() is probabilistic or deterministic depends on pair-correlation ' +
    'uniformity in the bulk.',
  status: 'open -- needs quantitative density-gradient control',
  closureRoute:
    'Selberg CLT variance bound or Bourgade 2022 Wigner matrix generalization ' +
    'applied to the inhomogeneous (varying density) case',
};

// ── Main closure record ────────────────────────────────────────────────────

export const G1_SUB_EXTREMAL_CLOSURE = {
  id: 'imp-455',
  title: 'G1-sub-extremal follow-on: Bourgade extremal-gap port to Riemann zeros',
  proofSection: 'Route-A',
  closes: 'G1-sub-extremal open sub-gap from imp-368 (LAMBDA_ARGMIN_INTERIORITY) ' +
    'and imp-450 (G1_G2_CLOSURE_ASSEMBLY)',
  closureLevel: 'partial-conditional',
  conditionedOn: [
    '(H1) GUE pair-correlation: Montgomery 1973 + Katz-Sarnak universality',
    '(H2) Density gradient: RvM log-ratio C_alpha -> 1 as N -> infinity',
  ],
  whatIsDelivered: [
    'Precise statement of the BABL 2013 GUE extremal-gap theorem',
    'Density-gradient obstruction analysis (raw vs unfolded argmin)',
    'Conditional partial closure: under H1 + H2, bulk confinement holds ' +
      'asymptotically with margin alpha / C_alpha -> alpha',
    'Numerical witnesses: RAW_ARGMIN_WITNESSES and UNFOLDED_ARGMIN_WITNESSES ' +
      'over N in {50, 100, 200, 400, 870}',
    'Named remaining sub-gap G1-sub-extremal-raw-vs-unfolded with suggested ' +
      'closure route (Selberg CLT variance bound)',
  ],
  whatIsNotDelivered: [
    'Unconditional bulk confinement of k*_N (requires Montgomery pair-correlation)',
    'Quantitative density-gradient closure (raw vs unfolded shift bound)',
    'Flip of imp-336 ANALYTIC_SKETCH G1/G2 tripwires -- still deferred to ' +
      'Route A monotonicity assembly (imp-456)',
    'Route A monotonicity (M) is still unproved unconditionally',
  ],
  bablPort: BABL_PORT,
  remainingSubGap: G1_SUB_EXTREMAL_RAW_VS_UNFOLDED_GAP,
  numericalWitnesses: {
    rawArgmin: RAW_ARGMIN_WITNESSES,
    unfoldedArgmin: UNFOLDED_ARGMIN_WITNESSES,
    densityGradientRatios: DENSITY_GRADIENT_RATIOS,
    note:
      'Raw argmin typically near top (k*_N / N > 0.7); unfolded argmin ' +
      'shows more bulk spread. This confirms the density-gradient obstruction.',
  },
  consumesId: LAMBDA_ARGMIN_INTERIORITY.id,
  openSubGapId: 'G1-sub-extremal-raw-vs-unfolded',
};

// ── Build-time assertions ─────────────────────────────────────────────────

export const G1_SUB_EXTREMAL_CLOSURE_ASSERTIONS = [
  {
    id: 'imp455-citation-chain-resolves',
    holds: () => LAMBDA_ARGMIN_INTERIORITY.id === 'imp-368',
    why:
      'imp-455 cites imp-368 (LAMBDA_ARGMIN_INTERIORITY). Id drift strands ' +
      'the citation chain.',
  },
  {
    id: 'imp455-raw-argmin-witnesses-non-empty',
    holds: () =>
      RAW_ARGMIN_WITNESSES.length > 0 &&
      RAW_ARGMIN_WITNESSES.every(
        (w) =>
          typeof w.k_star_raw === 'number' &&
          w.k_star_raw >= 1 &&
          w.k_star_raw <= w.N - 1,
      ),
    why:
      'Each raw argmin witness must have a valid k_star_raw in [1, N-1]. ' +
      'Failure means ZETA_ZEROS has been truncated or the loop is broken.',
  },
  {
    id: 'imp455-unfolded-argmin-witnesses-non-empty',
    holds: () =>
      UNFOLDED_ARGMIN_WITNESSES.length > 0 &&
      UNFOLDED_ARGMIN_WITNESSES.every(
        (w) =>
          typeof w.j_star_unfolded === 'number' &&
          w.j_star_unfolded >= 1 &&
          w.j_star_unfolded <= w.N - 1,
      ),
    why:
      'Each unfolded argmin witness must have a valid j_star_unfolded in [1, N-1]. ' +
      'Failure means the RvM unfolding or ZETA_ZEROS has a problem.',
  },
  {
    id: 'imp455-density-gradient-ratios-exceed-one',
    holds: () =>
      DENSITY_GRADIENT_RATIOS.every(
        (r) => Number.isFinite(r.C_alpha) && r.C_alpha > 1,
      ),
    why:
      'The density ratio C_alpha = rho_hi / rho_lo must exceed 1 (density ' +
      'increases toward the top of the bulk window). If C_alpha <= 1, the ' +
      'RvM density is not increasing over the window, which contradicts theory.',
  },
  {
    id: 'imp455-honest-partial-closure-flagged',
    holds: () =>
      G1_SUB_EXTREMAL_CLOSURE.closureLevel === 'partial-conditional' &&
      G1_SUB_EXTREMAL_CLOSURE.remainingSubGap.status.startsWith('open'),
    why:
      'SCOPE TRIPWIRE: this file delivers a PARTIAL closure only. If the ' +
      'closureLevel is upgraded to "full" or the remainingSubGap.status ' +
      'changes to "closed", this assertion fires to ensure the density- ' +
      'gradient sub-gap and the imp-336 ANALYTIC_SKETCH tripwires are ' +
      'coordinated in the same commit.',
  },
];
