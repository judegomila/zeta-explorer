/**
 * @module imp-97818-fold-degeneration-saddle-node-pin
 *
 * imp-97818 (numerical, frontier-direction): PIN the E_trunc floor factor where the imp-97779
 * fold amplitude K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx)) degenerates, and CHARACTERIZE the
 * K-divergence approaching it. imp-97779 bracketed a degeneration near ~50x-75x and inferred
 * that the fold curvature phi_xx "crosses zero" there, but never pinned the factor or the
 * blow-up law.
 *
 * The fold (imp-97725/imp-97743/imp-97764/imp-97779) is
 *
 *     K = sqrt( sigma_max(1 - sigma_max) / (2 phi_xx) ),
 *     phi_xx = (ln R)_xx - (1/2)(ln L)_xx,   R = E_trunc + E_flow,   L = ln T0(N),
 *
 * read at the interior sigma-peak in x = ln N. Everything below rescales ONLY the E_trunc floor
 * (E_trunc = 3.06e-5 * factor); every other sub-term is the exact imp-97725 sub-term.
 *
 * WHAT WAS MEASURED (root-find of the degeneration + divergence-law fit)
 * ---------------------------------------------------------------------
 *   (Y0) BASELINE PIN STILL REPRODUCES. factor 1.0 gives sigma_max = 0.94942901,
 *        phi_xx = 1.339604e-1, K = 0.423330 (the imp-97725 pin), identical formulas.
 *   (Y1) THE DEGENERATION IS A SADDLE-NODE, NOT A phi_xx SIGN-CHANGE. Over the imp-97779
 *        bracket sigma(x) is NOT unimodal: it carries a boundary-dominated global max PLUS an
 *        interior LOCAL-MAX / LOCAL-MIN pair. As the floor rises, that local max (which is the
 *        fold) and the neighbouring local min MOVE TOGETHER and ANNIHILATE (the interior
 *        critical-point count drops 2 -> 0). Root-finding that 2->0 transition pins the
 *        degeneration at factor* = 56.9184, where the pair merges at N* ~ 456.
 *   (Y2) phi_xx OF THE FOLD VANISHES AS A SQUARE ROOT (the saddle-node signature). Approaching
 *        factor* from below, phi_xx of the genuine LOCAL MAX stays POSITIVE and collapses like
 *        phi_xx ~ C_phi (factor* - factor)^(1/2), with the ratio phi_xx / sqrt(gap) converging
 *        to C_phi ~ 1.003e-2 (measured log-log exponent 0.504 -> 1/2). It does NOT go negative:
 *        the negative phi_xx imp-97779 reported past ~56x were a ternary-search BOUNDARY
 *        ARTIFACT (the peak-finder basin-flipped to the bracket floor N=100 near ~55.8x, giving
 *        a spurious edge curvature), not a real sign change of the fold curvature.
 *   (Y3) K DIVERGES AS (factor* - factor)^(-1/4), NOT (-1/2). Because phi_xx ~ gap^(1/2) and the
 *        numerator S = sigma_max(1-sigma_max) ~ 0.1445 stays roughly constant near the merge,
 *        K = sqrt(S/(2 phi_xx)) ~ A_K (factor* - factor)^(-1/4), with K * gap^(1/4) converging
 *        to A_K ~ 2.683 (measured log-log exponent -0.252 -> -1/4). So the ticket-hypothesised
 *        K ~ (factor* - factor)^(-1/2) is HALF too steep: the true blow-up is the quarter-power
 *        forced by the square-root vanishing of the curvature at a saddle-node.
 *   (Y4) K STAYS FINITE RIGHT UP TO THE MERGE, THEN THE FOLD SIMPLY CEASES TO EXIST. K climbs
 *        1.59 (50x) -> 2.72 (56x) -> 5.24 (56.85x) -> 7.28 (56.90x) and only formally diverges
 *        AT factor*; past factor* there is no interior local max at all (no fold), so K is not
 *        merely non-real -- the quadratic-peak object is gone.
 *
 * VERDICT: THE imp-97779 FOLD DEGENERATION IS A SADDLE-NODE AT factor* = 56.9184 (N* ~ 456),
 * NOT A phi_xx ZERO-CROSSING. The interior local sigma-max (the fold) and its neighbouring
 * local sigma-min collide and annihilate there; the fold curvature phi_xx vanishes as a SQUARE
 * ROOT of the distance to factor* (C_phi ~ 1.00e-2) and the amplitude diverges as the QUARTER
 * power K ~ 2.68 (factor* - factor)^(-1/4) -- correcting the ticket-hypothesised (-1/2) law and
 * imp-97779's inferred phi_xx sign-change (which was a peak-finder boundary artifact, the
 * unimodality assumption failing on a bimodal sigma profile). Measurement / sensitivity only on
 * the inherited imp-3220/imp-3406 extrapolation surrogate (NOT a rigorous asymptotic). C_mb
 * GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; E_trunc
 * base pin 3.06e-5 unchanged (only rescaled); no bound moves; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97779-fold-amplitude-saturation-extreme-window (bracketed the degeneration near ~50x-75x, corrected here)
 * @see imp-97764-fold-amplitude-wide-window-power-law (the ~0.249-by-10x local drift)
 * @see imp-97725-fold-amplitude-analytic-pin (the K pin reproduced at factor 1.0)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor, the perturbed model)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97725 pin)
const GRONWALL = Math.exp(1.0 * 2.37e-4); // matches imp-3406/imp-97725/imp-97779 exactly

// EXACT imp-97725/imp-97779 sub-terms; ONLY the E_trunc floor is a parameter here.
function parts(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const R = E_trunc + E_flow;
  return { T0, L, R, sigma: E_coll / (R + E_coll) };
}

// Second log-derivative of a SMOOTH component in x = ln N (5-point stencil, h = 1e-4).
const H = 1e-4;
function d2LnDx2(fn, x) {
  const f = (k) => Math.log(fn(Math.exp(x + k * H)));
  return (-f(2) + 16 * f(1) - 30 * f(0) + 16 * f(-1) - f(-2)) / (12 * H * H);
}

// dsigma/dx (central) for critical-point location; sigma is BIMODAL over the wide bracket, so a
// unimodal ternary (imp-97779) is unsafe near the merge -- locate ALL interior critical points.
function dSigma(x, E_trunc) {
  const h = 1e-5;
  return (parts(Math.exp(x + h), E_trunc).sigma - parts(Math.exp(x - h), E_trunc).sigma) / (2 * h);
}

// Interior critical points of sigma in N in [150, 2000] (the local max/min pair lives here).
const X_LO = Math.log(150);
const X_HI = Math.log(2000);
function critNs(factor, nGrid = 2400) {
  const E = factor * E_TRUNC_BASE;
  const dx = (X_HI - X_LO) / nGrid;
  let prev = dSigma(X_LO, E);
  let px = X_LO;
  const xs = [];
  for (let i = 1; i <= nGrid; i++) {
    const x = X_LO + i * dx;
    const d = dSigma(x, E);
    if (prev * d < 0) {
      let a = px;
      let b = x;
      for (let k = 0; k < 60; k++) {
        const m = (a + b) / 2;
        if (dSigma(a, E) * dSigma(m, E) <= 0) b = m;
        else a = m;
      }
      xs.push((a + b) / 2);
    }
    prev = d;
    px = x;
  }
  return xs.map((x) => Math.exp(x));
}

// Fold read at the interior LOCAL MAX (larger-sigma critical point); null once the pair is gone.
function foldAt(factor) {
  const E = factor * E_TRUNC_BASE;
  const cs = critNs(factor);
  if (cs.length < 2) return null;
  let xmax = Math.log(cs[0]);
  let sMax = parts(cs[0], E).sigma;
  for (const N of cs) {
    const s = parts(N, E).sigma;
    if (s > sMax) {
      sMax = s;
      xmax = Math.log(N);
    }
  }
  const phixx =
    d2LnDx2((n) => parts(n, E).R, xmax) - 0.5 * d2LnDx2((n) => parts(n, E).L, xmax);
  const S = sMax * (1 - sMax);
  const K = phixx > 0 ? Math.sqrt(S / (2 * phixx)) : NaN;
  return { N_max: Math.exp(xmax), sigma_max: sMax, S, phixx, K };
}

// (Y0) baseline pin: at factor 1.0 the interior peak is the single unimodal fold; recompute it
// directly with a ternary (imp-97779 baseline behaviour) to reproduce the imp-97725 pin exactly.
function baselineFold() {
  let a = Math.log(1e2);
  let b = Math.log(1e12);
  const E = E_TRUNC_BASE;
  for (let i = 0; i < 400; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1), E).sigma < parts(Math.exp(m2), E).sigma) a = m1;
    else b = m2;
  }
  const x = (a + b) / 2;
  const p = parts(Math.exp(x), E);
  const phixx = d2LnDx2((n) => parts(n, E).R, x) - 0.5 * d2LnDx2((n) => parts(n, E).L, x);
  const S = p.sigma * (1 - p.sigma);
  return { N_max: Math.exp(x), sigma_max: p.sigma, phi_xx: phixx, K: Math.sqrt(S / (2 * phixx)) };
}
const BASE = baselineFold();

// (Y1) root-find factor* = the saddle-node where the interior critical-point count drops 2 -> 0.
function saddleNodeFactor() {
  let lo = 56;
  let hi = 58;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (critNs(m).length >= 2) lo = m;
    else hi = m;
  }
  return { factorStar: (lo + hi) / 2, lastPair: critNs(lo) };
}
const { factorStar: FACTOR_STAR, lastPair: LAST_PAIR } = saddleNodeFactor();
const N_STAR = LAST_PAIR.reduce((s, n) => s + n, 0) / LAST_PAIR.length; // merge location

// (Y2)/(Y3) divergence-law fit: phi_xx ~ C_phi gap^(1/2), K ~ A_K gap^(-1/4), gap = factor* - f.
const APPROACH_FACTORS = [50, 54, 56, 56.5, 56.7, 56.8, 56.85, 56.88, 56.9];
const APPROACH = APPROACH_FACTORS.map((f) => {
  const r = foldAt(f);
  const gap = FACTOR_STAR - f;
  return {
    factor: f,
    gap: +gap.toExponential(5),
    phi_xx: +r.phixx.toExponential(6),
    K: +r.K.toFixed(6),
    phixx_over_sqrt_gap: +(r.phixx / Math.sqrt(gap)).toExponential(5),
    K_times_gap_quarter: +(r.K * Math.pow(gap, 0.25)).toFixed(5),
  };
});

function loglogSlope(rows, xf, yf) {
  const xs = rows.map((r) => Math.log(xf(r)));
  const ys = rows.map((r) => Math.log(yf(r)));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  return num / den;
}
const NEAR = APPROACH.filter((r) => r.gap < 1);
const PHIXX_EXPONENT = +loglogSlope(NEAR, (r) => r.gap, (r) => r.phi_xx).toFixed(4); // ~ +0.50
const K_EXPONENT = +loglogSlope(NEAR, (r) => r.gap, (r) => r.K).toFixed(4); // ~ -0.25
const C_PHI = +NEAR[NEAR.length - 1].phixx_over_sqrt_gap; // ~ 1.003e-2 (saddle-node prefactor)
const A_K = +NEAR[NEAR.length - 1].K_times_gap_quarter; // ~ 2.683 (amplitude prefactor)

export const IMP97818_FOLD_DEGENERATION_SADDLE_NODE_PIN = {
  id: 'imp-97818',
  proofSection: 'S-frontier',
  question:
    'Pin the E_trunc floor factor where the imp-97779 fold amplitude K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx)) ' +
    'degenerates (imp-97779 bracketed but did not pin it), and characterize the K-divergence approaching it. ' +
    'Same imp-97725 fold recompute; measurement only; no bound moves; NO QED.',
  measuredQuantity:
    'The saddle-node factor* where the interior sigma critical-point count drops 2 -> 0 (root-found by bisection on ' +
    'the count over N in [150, 2000]); the merge location N*; and the divergence law of the fold curvature phi_xx and ' +
    'amplitude K of the genuine interior LOCAL MAX approaching factor* from below (gap = factor* - factor), fit as ' +
    'phi_xx ~ C_phi gap^(1/2) and K ~ A_K gap^(-1/4).',
  baseline: {
    factor: 1.0,
    N_peak: +BASE.N_max.toExponential(4), // ~9.2186e5
    sigma_max: +BASE.sigma_max.toFixed(8), // ~0.94942901
    phi_xx: +BASE.phi_xx.toExponential(6), // ~1.339604e-1
    K: +BASE.K.toFixed(6), // ~0.423330 (imp-97725 pin)
  },
  saddleNode: {
    factor_star: +FACTOR_STAR.toFixed(4), // ~56.9184
    N_star_merge: +N_STAR.toFixed(1), // ~456 (local max & min annihilate)
    mechanism:
      'interior local sigma-max (the fold) and neighbouring local sigma-min collide and annihilate (2 -> 0 critical ' +
      'points); NOT a phi_xx sign-change -- the negative phi_xx imp-97779 saw past ~56x was a ternary boundary artifact',
  },
  divergenceLaw: {
    phixx_exponent_measured: PHIXX_EXPONENT, // ~0.50 (phi_xx ~ gap^(1/2), square-root vanishing)
    phixx_prefactor_C_phi: C_PHI, // ~1.003e-2
    K_exponent_measured: K_EXPONENT, // ~-0.25 (K ~ gap^(-1/4))
    K_prefactor_A_K: A_K, // ~2.683
    ticket_hypothesis_corrected:
      'the ticket-hypothesised K ~ (factor* - factor)^(-1/2) is HALF too steep; the true law is the QUARTER power ' +
      'K ~ A_K (factor* - factor)^(-1/4), forced by phi_xx vanishing as a SQUARE ROOT at the saddle-node',
  },
  approach: APPROACH,
  finding:
    'The imp-97779 fold degeneration is a SADDLE-NODE bifurcation at factor* = 56.9184 (merge at N* ~ 456), not a ' +
    'phi_xx zero-crossing. Over the wide bracket sigma(x) is bimodal (a boundary-dominated global max plus an interior ' +
    'local-max/local-min pair); as the floor rises the local max (the fold) and the local min move together and ' +
    'annihilate. Approaching factor* the fold curvature phi_xx of the genuine local max stays POSITIVE and vanishes as ' +
    'a SQUARE ROOT, phi_xx ~ 1.00e-2 (factor* - factor)^(1/2) (measured exponent 0.50), so the amplitude diverges as ' +
    'the QUARTER power K ~ 2.68 (factor* - factor)^(-1/4) (measured exponent -0.25) -- correcting the ' +
    'ticket-hypothesised (-1/2). The negative phi_xx imp-97779 reported past ~56x were a ternary peak-finder boundary ' +
    'artifact (the unimodal search basin-flipped to the bracket floor N=100 near ~55.8x), not a real sign change. ' +
    'factor 1.0 still reproduces the imp-97725 pin (sigma_max 0.94942901, phi_xx 1.339604e-1, K 0.423330).',
  isRigorous: false,
  verdict:
    'THE imp-97779 FOLD DEGENERATION IS A SADDLE-NODE AT factor* = 56.9184 (N* ~ 456), NOT A phi_xx ZERO-CROSSING. ' +
    'The interior local sigma-max (the fold) and its neighbouring local sigma-min collide and annihilate there; the ' +
    'fold curvature phi_xx vanishes as a SQUARE ROOT of the distance to factor* (C_phi ~ 1.00e-2) and the amplitude ' +
    'diverges as the QUARTER power K ~ 2.68 (factor* - factor)^(-1/4), correcting both the ticket-hypothesised (-1/2) ' +
    'blow-up and imp-97779 inferred phi_xx sign-change (a unimodal peak-finder boundary artifact on a bimodal sigma ' +
    'profile). factor 1.0 reproduces the imp-97725 pin exactly. Measurement / sensitivity only on the inherited ' +
    'imp-3220/imp-3406 extrapolation surrogate, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 and the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; E_trunc base pin 3.06e-5 unchanged (only rescaled); changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97779 (bracketed the degeneration near ~50x-75x, corrected here); imp-97764 (the ~0.249-by-10x drift); ' +
    'imp-97725 (the K pin reproduced at factor 1.0); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi) ansatz); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); imp-398 (E_flow C_F prefactor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97818_FOLD_DEGENERATION_SADDLE_NODE_PIN_ASSERTIONS = [
  {
    // Y0: factor 1.0 still reproduces the imp-97725/imp-97779 pin (identical formulas).
    id: 'imp97818-reproduces-imp97725-pin',
    description: 'factor 1.0 reproduces imp-97725 sigma_max ~0.94942901, phi_xx ~1.339604e-1, K ~0.423330',
    holds: () =>
      Math.abs(BASE.sigma_max - 0.94942901) < 5e-7 &&
      Math.abs(BASE.phi_xx - 1.339604e-1) < 5e-6 &&
      Math.abs(BASE.K - 0.42333) < 5e-4,
  },
  {
    // Y1: the degeneration is pinned as a saddle-node near factor* ~ 56.92 with the pair merging near N* ~ 456.
    id: 'imp97818-saddle-node-factor-pinned',
    description: 'factor* ~ 56.92 (2 -> 0 interior critical points), pair merges near N* ~ 456 (in the imp-97779 ~50x-75x window)',
    holds: () =>
      Math.abs(FACTOR_STAR - 56.9184) < 0.05 &&
      FACTOR_STAR > 50 &&
      FACTOR_STAR < 75 &&
      N_STAR > 350 &&
      N_STAR < 600,
  },
  {
    // Y2: phi_xx vanishes as a SQUARE ROOT of the distance to factor* (saddle-node signature).
    id: 'imp97818-phixx-vanishes-as-sqrt',
    description: 'phi_xx ~ C_phi (factor* - factor)^(1/2): measured log-log exponent ~0.50, ratio phi_xx/sqrt(gap) stable ~1.0e-2',
    holds: () => Math.abs(PHIXX_EXPONENT - 0.5) < 0.05 && C_PHI > 5e-3 && C_PHI < 2e-2,
  },
  {
    // Y3: K diverges as the QUARTER power, correcting the ticket-hypothesised (-1/2).
    id: 'imp97818-K-diverges-as-quarter-power',
    description: 'K ~ A_K (factor* - factor)^(-1/4): measured log-log exponent ~-0.25 (NOT -0.5), amplitude A_K ~2.68 stable',
    holds: () =>
      Math.abs(K_EXPONENT - -0.25) < 0.05 && Math.abs(K_EXPONENT) < 0.4 && A_K > 2.3 && A_K < 3.0,
  },
  {
    // Honesty gate: measurement only, saddle-node / quarter-power verdict, no QED, no refereed bound is changed.
    id: 'imp97818-honesty-gate-no-qed',
    description: 'Measurement only: saddle-node / quarter-power-divergence verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP97818_FOLD_DEGENERATION_SADDLE_NODE_PIN.isRigorous === false &&
      /SADDLE-NODE AT factor\* = 56\.9184/.test(IMP97818_FOLD_DEGENERATION_SADDLE_NODE_PIN.verdict) &&
      /QUARTER power/.test(IMP97818_FOLD_DEGENERATION_SADDLE_NODE_PIN.verdict) &&
      /NO QED/.test(IMP97818_FOLD_DEGENERATION_SADDLE_NODE_PIN.verdict) &&
      /refereed bound is changed/i.test(IMP97818_FOLD_DEGENERATION_SADDLE_NODE_PIN.verdict),
  },
];

for (const a of IMP97818_FOLD_DEGENERATION_SADDLE_NODE_PIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97818-fold-degeneration-saddle-node-pin assertion failed: ${a.id}`);
  }
}
