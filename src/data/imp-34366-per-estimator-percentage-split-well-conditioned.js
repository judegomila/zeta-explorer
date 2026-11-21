/**
 * @module imp-34366-per-estimator-percentage-split-well-conditioned
 *
 * imp-34366 (numerical, frontier-direction): imp-34285 decomposed the imp-34211 ~0.278 kEnd gap between the
 * imp-34127 closed-form M2-residual sign-change ceiling (kEnd_cf ~ 21.003) and the imp-34150 direct-bisection
 * root (kEnd* ~ 21.28094742) into the two additive estimator biases
 *     resid(k) = dA(k) - dB(k),
 *     dA(k) = [pEcoll_2pt_secant - pEcoll_cont] * (1 - sigma)   (2-point secant bias on -log E_coll),
 *     dB(k) = [pSigma_5pt_OLS   - pSigma_cont]                 (5-point OLS bias on -log sigma),
 * and found both biases are LARGE and NEARLY EQUAL at the crossing (dA ~ dB ~ -2.286e-4, cancelling to a ratio
 * ~1e-7). imp-34285 left SUB-GAP-imp-34285-per-estimator-percentage-split OPEN because the naive per-estimator
 * share dA/(dA - dB) divides by the vanishing sum and blows up (|dA/(dA-dB)| ~ 1e7), so it is ill-conditioned.
 *
 * THE WELL-CONDITIONED CONSTRUCTION (this module) -- never divide by the vanishing dA - dB
 * -------------------------------------------------------------------------------------------
 *   The ticket asks for a numerically stable per-estimator attribution, e.g. a higher-order window-width
 *   expansion of each estimator. We measure each estimator's OWN window-width bias curve SEPARATELY, so the
 *   catastrophic dA - dB cancellation never enters any denominator. Hold the base point fixed at the crossing
 *   hi* = 10^(kEnd*+1) and sweep the estimator window width w (span = [hi* * e^-w, hi*], w in units of a
 *   decade D = ln 10). Each bias is a smooth power series in w:
 *       dA(w) = A2 w^2 + A3 w^3 + A4 w^4 + ...,   dB(w) = B2 w^2 + B3 w^3 + B4 w^4 + ...
 *   Fitting each curve INDEPENDENTLY (many small-w samples, ordinary least squares on w^2,w^3,w^4) is
 *   well-conditioned -- one estimator's clean bias curve at a time, no subtraction of near-equal quantities.
 *
 * WHAT THE INDEPENDENT FITS REVEAL
 * --------------------------------
 *   (1) The two estimators have NEARLY IDENTICAL window-width bias expansions: every coefficient ratio
 *       A_n / B_n ~ 0.999 (A2/B2 ~ 0.99937, A3/B3 ~ 0.99921, A4/B4 ~ 0.99920). So the ~1e-7 cancellation at
 *       the crossing is NOT a fragile crossing coincidence -- it holds across ALL window widths because the
 *       2-point-secant bias of -log E_coll (times 1 - sigma) and the 5-point-OLS bias of -log sigma track the
 *       same window-width law to ~4 figures. The gap-generating higher-order content is split almost exactly
 *       evenly between the two estimators.
 *   (2) A WELL-CONDITIONED per-estimator percentage then follows from the SEPARATELY-fit coefficient
 *       magnitudes (higher-order, n >= 3, content at the full decade w = D):
 *           share_pEcoll = HO_A / (HO_A + HO_B),   share_pSigma = HO_B / (HO_A + HO_B),
 *           HO_A = |A3| D^3 + |A4| D^4,   HO_B = |B3| D^3 + |B4| D^4.
 *       This never divides by dA - dB. Result: share_pEcoll ~ 49.98%, share_pSigma ~ 50.02% -- a symmetric
 *       ~50/50 split, pSigma marginally larger.
 *   (3) INDEPENDENT CROSS-CHECK via the implicit-function-theorem root sensitivity. The crossing kEnd* solves
 *       dA(k) = dB(k); its location is pinned by the two curve slopes dA'(k*), dB'(k*) (each individually
 *       O(2e-5), well-conditioned), NOT by the vanishing level difference. The slope share
 *           |dA'| / (|dA'| + |dB'|) ~ 49.69%,   |dB'| / (|dA'| + |dB'|) ~ 50.31%,
 *       concurs with the coefficient share at ~50/50 (pSigma marginally larger) -- two disjoint
 *       well-conditioned routes agree to within ~0.3 percentage points.
 *
 * VERDICT ON THE SUB-GAP: SUB-GAP-imp-34285-per-estimator-percentage-split is RESOLVED (well-conditioned):
 *   the per-estimator split is ~50/50 (pSigma marginally larger), computed from each estimator's SEPARATE
 *   window-width bias expansion and cross-checked by IFT root-slope sensitivity, never dividing by the
 *   near-vanishing dA - dB. The near-total cancellation is a genuine structural near-equality of the two
 *   estimators' window-width laws (A_n/B_n ~ 0.999 at every order), not a numerical accident of the crossing.
 *
 * NUMERICAL / DECOMPOSITION ONLY. A well-conditioned per-estimator attribution of an inherited-surrogate
 * estimator gap, NOT an RH bound. Reuses the imp-3406/imp-33810 sub-terms verbatim (the exact imp-34285
 * machinery); the inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the crossing is
 * descriptive within that model only; changes no bound; establishes no operator positivity; C_mb
 * GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34285-closedform-gap-term-decomposition (named SUB-GAP-imp-34285-per-estimator-percentage-split resolved here)
 * @see imp-34211-closedform-vs-bisection-kend-gap (the ~0.278 gap)
 * @see imp-34189-m2-ceiling-next-order-window-width-correction (window-width expansion parameter eD ~ 1.13 is O(1))
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (the leading-D^2 balance and continuous-residual identity)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34127/imp-34150/imp-34211/imp-34285 exactly
const D = Math.LN10; // decade window width in x = ln N
const KSTAR = 21.28094742; // imp-34150 direct-bisection crossing (canonical, imp-34278)
const HI_STAR = Math.pow(10, KSTAR + 1); // crossing base point

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34285.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// ---- The two finite estimators (verbatim structure from imp-34285/imp-34150). ----
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
// 5-point OLS slope of -log sigma over a span, evenly spaced in x = ln N (matches imp-34285 at the full decade).
function olsSigmaExponentSpan(loN, hiN, nPts = 5) {
  const xlo = Math.log(loN);
  const xhi = Math.log(hiN);
  const xs = [];
  const ys = [];
  for (let i = 0; i < nPts; i++) {
    const x = xlo + ((xhi - xlo) * i) / (nPts - 1);
    xs.push(x);
    ys.push(Math.log(sigma(Math.exp(x))));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
function pSigmaCont(N) {
  const h = 1e-4;
  return -(Math.log(sigma(N * Math.exp(h))) - Math.log(sigma(N / Math.exp(h)))) / (2 * h);
}
function pEcollCont(N) {
  const h = 1e-4;
  return -(Math.log(parts(N * Math.exp(h)).E_coll) - Math.log(parts(N / Math.exp(h)).E_coll)) / (2 * h);
}

// ---- Each estimator's finite-vs-continuum bias, as a function of window width w (base point fixed at hi*). ----
function biasA_w(w) {
  const hi = HI_STAR;
  const lo = hi * Math.exp(-w);
  const s = parts(hi).sigma;
  return (ecollExponentMag(lo, hi) - pEcollCont(hi)) * (1 - s);
}
function biasB_w(w) {
  const hi = HI_STAR;
  const lo = hi * Math.exp(-w);
  return olsSigmaExponentSpan(lo, hi, 5) - pSigmaCont(hi);
}

// ---- Independent polynomial fit of each bias curve: dX(w) = X2 w^2 + X3 w^3 + X4 w^4 (OLS, well-conditioned). ----
function fitPoly234(fn) {
  const wsamp = [];
  for (let f = 0.1; f <= 1.0001; f += 0.05) wsamp.push(f * D); // 19 samples, all small enough for a clean fit
  const rows = wsamp.map((w) => [w * w, w * w * w, w * w * w * w]);
  const rhs = wsamp.map(fn);
  const n = 3;
  const AtA = Array.from({ length: n }, () => Array(n).fill(0));
  const Atb = Array(n).fill(0);
  for (let r = 0; r < rows.length; r++) {
    for (let i = 0; i < n; i++) {
      Atb[i] += rows[r][i] * rhs[r];
      for (let j = 0; j < n; j++) AtA[i][j] += rows[r][i] * rows[r][j];
    }
  }
  const M = AtA.map((row, i) => [...row, Atb[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((row, i) => row[n] / row[i]); // [X2, X3, X4]
}

const [A2, A3, A4] = fitPoly234(biasA_w);
const [B2, B3, B4] = fitPoly234(biasB_w);

// Coefficient ratios (the structural near-equality of the two estimators' window-width laws).
const RATIO_A2_B2 = A2 / B2;
const RATIO_A3_B3 = A3 / B3;
const RATIO_A4_B4 = A4 / B4;

// Well-conditioned per-estimator share from the higher-order (n >= 3) content at the full decade w = D.
const HO_A = Math.abs(A3) * D ** 3 + Math.abs(A4) * D ** 4;
const HO_B = Math.abs(B3) * D ** 3 + Math.abs(B4) * D ** 4;
const SHARE_PECOLL_PCT = (HO_A / (HO_A + HO_B)) * 100; // ~49.98
const SHARE_PSIGMA_PCT = (HO_B / (HO_A + HO_B)) * 100; // ~50.02

// Independent cross-check: IFT root-slope sensitivity (full-decade window, slopes at the crossing).
function biasA_k(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const s = parts(hi).sigma;
  return (ecollExponentMag(lo, hi) - pEcollCont(hi)) * (1 - s);
}
function biasB_k(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  return olsSigmaExponentSpan(lo, hi, 5) - pSigmaCont(hi);
}
const DK = 1e-4;
const SLOPE_A = (biasA_k(KSTAR + DK) - biasA_k(KSTAR - DK)) / (2 * DK);
const SLOPE_B = (biasB_k(KSTAR + DK) - biasB_k(KSTAR - DK)) / (2 * DK);
const SLOPE_SHARE_PECOLL_PCT = (Math.abs(SLOPE_A) / (Math.abs(SLOPE_A) + Math.abs(SLOPE_B))) * 100; // ~49.69
const SLOPE_SHARE_PSIGMA_PCT = (Math.abs(SLOPE_B) / (Math.abs(SLOPE_A) + Math.abs(SLOPE_B))) * 100; // ~50.31

// The near-total cancellation at the crossing (reproduces imp-34285) and the ILL-CONDITIONED naive share.
const DA_CROSSING = biasA_k(KSTAR);
const DB_CROSSING = biasB_k(KSTAR);
const NAIVE_SHARE_MAG = Math.abs(DA_CROSSING / (DA_CROSSING - DB_CROSSING)); // ~1e7 -- ill-conditioned, why the naive split fails
const CANCELLATION_RATIO = Math.abs(DA_CROSSING - DB_CROSSING) / Math.abs(DA_CROSSING); // ~1e-7

const COEFF_TABLE = [
  { order: 'w^2', coeffPEcoll: +A2.toExponential(5), coeffPSigma: +B2.toExponential(5), ratio: +RATIO_A2_B2.toFixed(6) },
  { order: 'w^3', coeffPEcoll: +A3.toExponential(5), coeffPSigma: +B3.toExponential(5), ratio: +RATIO_A3_B3.toFixed(6) },
  { order: 'w^4', coeffPEcoll: +A4.toExponential(5), coeffPSigma: +B4.toExponential(5), ratio: +RATIO_A4_B4.toFixed(6) },
];

export const IMP34366_PER_ESTIMATOR_PERCENTAGE_SPLIT = {
  id: 'imp-34366',
  proofSection: 'S-frontier',
  question:
    'imp-34285 left SUB-GAP-imp-34285-per-estimator-percentage-split OPEN: a clean per-estimator (pEcoll ' +
    '2-point secant vs pSigma 5-point OLS) percentage split of the imp-34211 ~0.278 kEnd gap is ' +
    'ill-conditioned because the two estimator biases dA, dB nearly cancel (ratio ~1e-7), so dA/(dA-dB) ' +
    'blows up. Devise a numerically STABLE attribution that assigns a meaningful percentage without ' +
    'dividing by the vanishing sum. Decomposition/measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'Each estimator OWN window-width bias curve dA(w), dB(w) at the fixed crossing base point, fit ' +
    'independently to a w^2,w^3,w^4 polynomial; the per-order coefficient ratios A_n/B_n; a well-conditioned ' +
    'higher-order-content percentage share; and an independent IFT root-slope-sensitivity share.',
  crossing: { kStar: KSTAR, hiStar: +HI_STAR.toExponential(6) },
  coefficientExpansion: {
    note:
      'Each estimator bias fit INDEPENDENTLY as dX(w) = X2 w^2 + X3 w^3 + X4 w^4 over 19 small-w samples ' +
      '(OLS). No subtraction of near-equal quantities enters any fit, so each coefficient is ' +
      'well-conditioned. The two estimators track nearly the SAME window-width law: A_n/B_n ~ 0.999 at ' +
      'every order, so the ~1e-7 crossing cancellation is a structural near-equality, not a fragile ' +
      'coincidence of the crossing point.',
    table: COEFF_TABLE,
    ratioA2overB2: +RATIO_A2_B2.toFixed(6), // ~0.999369
    ratioA3overB3: +RATIO_A3_B3.toFixed(6), // ~0.999206
    ratioA4overB4: +RATIO_A4_B4.toFixed(6), // ~0.99920
  },
  wellConditionedShare: {
    method:
      'Higher-order (n >= 3) content at the full decade w = D: HO_X = |X3| D^3 + |X4| D^4; share_X = ' +
      'HO_X / (HO_A + HO_B). Denominator is a SUM of absolute magnitudes -- never the vanishing dA - dB.',
    sharePEcollPct: +SHARE_PECOLL_PCT.toFixed(3), // ~49.980
    sharePSigmaPct: +SHARE_PSIGMA_PCT.toFixed(3), // ~50.020
    hoContentPEcoll: +HO_A.toExponential(4),
    hoContentPSigma: +HO_B.toExponential(4),
  },
  iftSlopeCrossCheck: {
    method:
      'The crossing solves dA(k) = dB(k); its location is pinned by the two curve slopes at k*, each O(2e-5) ' +
      'and individually well-conditioned. Slope share = |dX(k*)| / (|dA(k*)| + |dB(k*)|).',
    slopePEcoll: +SLOPE_A.toExponential(4), // ~2.05e-5
    slopePSigma: +SLOPE_B.toExponential(4), // ~2.07e-5
    sharePEcollPct: +SLOPE_SHARE_PECOLL_PCT.toFixed(3), // ~49.689
    sharePSigmaPct: +SLOPE_SHARE_PSIGMA_PCT.toFixed(3), // ~50.311
  },
  whyNaiveShareFails: {
    dA_crossing: +DA_CROSSING.toExponential(5), // ~ -2.286e-4
    dB_crossing: +DB_CROSSING.toExponential(5), // ~ -2.286e-4
    cancellationRatio: +CANCELLATION_RATIO.toExponential(4), // ~1e-7
    naiveShareMagnitude: +NAIVE_SHARE_MAG.toExponential(4), // ~1e7 -- the ill-conditioned quantity imp-34285 flagged
    note:
      'The naive per-estimator share dA/(dA-dB) has magnitude ~1e7 because the denominator is the ~1e-7 ' +
      'cancellation; that is exactly the ill-conditioning imp-34285 named. The well-conditioned routes above ' +
      'avoid it entirely by measuring each estimator separately.',
  },
  finding:
    'SUB-GAP-imp-34285-per-estimator-percentage-split is RESOLVED (well-conditioned). Two disjoint routes ' +
    'that never divide by the vanishing dA - dB -- (1) independent higher-order window-width coefficient ' +
    'content (share pEcoll ~49.98%, pSigma ~50.02%) and (2) IFT root-slope sensitivity (share pEcoll ' +
    '~49.69%, pSigma ~50.31%) -- agree the split is ~50/50, pSigma marginally larger. The two estimators ' +
    'have near-identical window-width bias laws (A_n/B_n ~ 0.999 at every order), so each contributes ~half ' +
    'of the gap-generating higher-order content; the ~1e-7 cancellation is a genuine structural near-equality, ' +
    'not a numerical accident of the crossing.',
  subGapResolved: 'SUB-GAP-imp-34285-per-estimator-percentage-split',
  isRigorous: false,
  verdict:
    'NUMERICAL / DECOMPOSITION (frontier-direction, NOT rigorous). Resolving ' +
    'SUB-GAP-imp-34285-per-estimator-percentage-split: the naive per-estimator share dA/(dA-dB) is ' +
    'ill-conditioned (magnitude ~1e7) because dA, dB ~ -2.286e-4 cancel to ratio ~1e-7 at the crossing. A ' +
    'well-conditioned attribution measures each estimator OWN window-width bias curve separately: fitting ' +
    'dA(w) and dB(w) independently to w^2,w^3,w^4 gives near-identical coefficients (A_n/B_n ~ 0.999 at ' +
    'every order), so the higher-order (n>=3) content splits ~49.98% pEcoll / ~50.02% pSigma -- computed ' +
    'from a SUM of absolute magnitudes, never the vanishing dA - dB. An independent IFT root-slope ' +
    'sensitivity check (slopes O(2e-5), individually well-conditioned) concurs at ~49.69% / ~50.31%. The ' +
    'per-estimator split is therefore ~50/50 (pSigma marginally larger), and the near-total cancellation is ' +
    'a structural near-equality of the two estimators window-width laws, not a crossing coincidence. The ' +
    'inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the crossing is descriptive ' +
    'within that model only; changes no bound; establishes no operator positivity; C_mb GUE-conditional per ' +
    'imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34285 (SUB-GAP-imp-34285-per-estimator-percentage-split, resolved here); imp-34211 (the ~0.278 ' +
    'gap); imp-34189 (window-width expansion parameter eD ~ 1.13 is O(1)); imp-34127 (leading-D^2 balance ' +
    'and continuous-residual identity); imp-34150 (direct-bisection root); lambda-rh-height-mapping (RvM ' +
    'height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34366_PER_ESTIMATOR_PERCENTAGE_SPLIT_ASSERTIONS = [
  {
    // (A) Reproduces the imp-34285 near-total cancellation at the crossing (dA, dB ~ -2.29e-4, ratio ~1e-7).
    id: 'imp34366-reproduces-imp34285-cancellation',
    description: 'dA, dB ~ -2.29e-4 at the crossing; cancellation ratio < 1e-5 (matches imp-34285)',
    holds: () =>
      DA_CROSSING < -1e-4 &&
      DB_CROSSING < -1e-4 &&
      CANCELLATION_RATIO < 1e-5 &&
      NAIVE_SHARE_MAG > 1e5, // the naive share genuinely blows up -> ill-conditioned
  },
  {
    // (B) The two estimators have near-identical window-width laws: every coefficient ratio A_n/B_n ~ 1.
    id: 'imp34366-coefficient-ratios-near-unity',
    description: 'A_n/B_n within [0.99, 1.01] at orders w^2, w^3, w^4 (structural near-equality)',
    holds: () =>
      Math.abs(RATIO_A2_B2 - 1) < 0.01 &&
      Math.abs(RATIO_A3_B3 - 1) < 0.01 &&
      Math.abs(RATIO_A4_B4 - 1) < 0.01,
  },
  {
    // (C) The well-conditioned higher-order-content share is a clean ~50/50 split summing to 100%.
    id: 'imp34366-wellconditioned-share-near-fifty',
    description: 'higher-order-content share ~50/50 (each in [45,55]) and sums to 100%',
    holds: () =>
      SHARE_PECOLL_PCT > 45 &&
      SHARE_PECOLL_PCT < 55 &&
      SHARE_PSIGMA_PCT > 45 &&
      SHARE_PSIGMA_PCT < 55 &&
      Math.abs(SHARE_PECOLL_PCT + SHARE_PSIGMA_PCT - 100) < 1e-9,
  },
  {
    // (D) The independent IFT root-slope cross-check concurs at ~50/50 (slopes individually well-conditioned).
    id: 'imp34366-ift-slope-crosscheck-concurs',
    description: 'IFT slope share ~50/50 (each in [45,55]); slopes individually O(2e-5), not vanishing',
    holds: () =>
      SLOPE_SHARE_PECOLL_PCT > 45 &&
      SLOPE_SHARE_PECOLL_PCT < 55 &&
      SLOPE_SHARE_PSIGMA_PCT > 45 &&
      SLOPE_SHARE_PSIGMA_PCT < 55 &&
      Math.abs(SLOPE_A) > 1e-6 &&
      Math.abs(SLOPE_B) > 1e-6,
  },
  {
    // (E) The two disjoint well-conditioned routes agree to within ~1 percentage point.
    id: 'imp34366-two-routes-agree',
    description: 'coefficient-content share and IFT-slope share agree within 1 percentage point',
    holds: () => Math.abs(SHARE_PECOLL_PCT - SLOPE_SHARE_PECOLL_PCT) < 1,
  },
  {
    // Honesty gate: decomposition only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34366-honesty-gate-no-qed',
    description: 'Decomposition only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34366_PER_ESTIMATOR_PERCENTAGE_SPLIT.isRigorous === false &&
      /NO QED/.test(IMP34366_PER_ESTIMATOR_PERCENTAGE_SPLIT.verdict) &&
      /refereed bound is changed/i.test(IMP34366_PER_ESTIMATOR_PERCENTAGE_SPLIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34366_PER_ESTIMATOR_PERCENTAGE_SPLIT.verdict),
  },
];

for (const a of IMP34366_PER_ESTIMATOR_PERCENTAGE_SPLIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34366-per-estimator-percentage-split-well-conditioned assertion failed: ${a.id}`);
  }
}
