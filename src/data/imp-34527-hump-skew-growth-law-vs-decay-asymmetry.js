/**
 * @module imp-34527-hump-skew-growth-law-vs-decay-asymmetry
 *
 * imp-34527 (numerical, frontier-direction): imp-33851 measured that the M3 saturation-curvature
 * hump envelope is head-heavy about the k = 9 crossover, with the head-over-tail skew ratio
 * skew(j) = hump(9-j)/hump(9+j) = {1.2176, 1.5758, 3.0426} for j = 1,2,3 and the signed asymmetry
 * index rising 0.0981 -> 0.5053, attributing the lighter, faster-decaying tail to the imp-3463
 * far-tail sigma ~ N^(-1/2) form. But imp-33851 never FIT skew(j) to a functional form nor connected
 * the fitted growth rate to the difference between the E_coll-dominated head-side decay and the
 * E_trunc-dominated tail-side decay. This module reuses the imp-33851 skew ladder and the head/tail
 * fractions VERBATIM and (a) fits skew(j) to a geometric/exponential-in-j law, (b) extrapolates the
 * implied skew at j = 4, and (c) shows the fitted growth rate IS the head/tail decay-exponent gap.
 *
 * THE INHERITED SKEW LADDER (imp-33851 reused verbatim -- no fresh model)
 * ----------------------------------------------------------------------
 *   skew(j) = hump(9-j)/hump(9+j) = {1.2176, 1.5758, 3.0426} for j = 1,2,3.
 *   headFrac(j) = hump(9-j)/hump(9) = {0.8472, 0.5082, 0.3689}  (E_coll-dominated head side).
 *   tailFrac(j) = hump(9+j)/hump(9) = {0.6958, 0.3225, 0.1212}  (E_trunc-dominated tail side).
 *
 * THE FIT (measurement only -- fits the imp-33851 skew ladder to a growth law)
 * ---------------------------------------------------------------------------
 *   (G1) THE GEOMETRIC (EXPONENTIAL-IN-j) NULL IS REJECTED AS THE EXACT FORM, BUT CAPTURES ~94%.
 *        A constant-ratio (geometric) law skew(j+1)/skew(j) = const is refuted directly: the
 *        successive skew ratios are 1.5758/1.2176 = 1.2942 and 3.0426/1.5758 = 1.9308 -- themselves
 *        growing, so the skew ACCELERATES. The least-squares log-linear fit ln skew = alpha + beta*j
 *        gives beta ~ 0.4579 (per-offset log-growth), alpha ~ -0.3277, R^2 ~ 0.940, with a
 *        systematically CONVEX log residual (+, -, +) -- the exponential under-predicts the tail.
 *   (G2) EXTRAPOLATED SKEW AT j = 4 IS MODEL-DEPENDENT: ~4.50 (geometric) TO ~8.76 (accelerating).
 *        Under the log-linear (geometric) fit skew(4) = exp(alpha + 4 beta) ~ 4.500; under an
 *        acceleration-aware exact log-quadratic ln skew = a + b j + c j^2 through the three points
 *        (c ~ 0.2000 > 0, confirming upward curvature) skew(4) ~ 8.765. The ~2x spread is the honest
 *        3-point extrapolation uncertainty; the true j = 4 skew is bracketed [4.50, 8.76], and the
 *        convex residual of G1 says the geometric 4.50 is a LOWER estimate.
 *   (G3) THE FITTED SKEW-GROWTH RATE IS EXACTLY THE HEAD/TAIL DECAY-EXPONENT GAP. Because
 *        ln skew(j) = ln headFrac(j) - ln tailFrac(j), the least-squares log-slope of skew equals the
 *        tail-side minus head-side log-decay slope. Measured per-offset log-decay rates are
 *        aHead ~ 0.4158 (head, E_coll side) and aTail ~ 0.8738 (tail, E_trunc side), so the tail
 *        decays ~2.10x faster per offset; the gap aTail - aHead ~ 0.4581 reproduces the skew-growth
 *        rate beta ~ 0.4579 to ~3e-4. The head-heavy skew growth IS the excess decay speed of the
 *        E_trunc tail over the E_coll head -- the asymmetry imp-33851 invoked, now quantified.
 *
 * The punchline: the imp-33851 head-heavy skew ladder is NOT geometric (the ratio grows 1.29 -> 1.93);
 * a log-linear fit gives growth rate beta ~ 0.458 at R^2 ~ 0.94 with convex residual, extrapolating
 * skew(4) ~ 4.50 (geometric lower estimate) up to ~8.76 (accelerating). Crucially beta equals the
 * tail-minus-head log-decay gap aTail - aHead ~ 0.458 (aTail ~ 0.874 ~ 2.10x aHead ~ 0.416), so the
 * head-heavy skew is precisely the E_trunc tail decaying ~twice as fast per offset as the E_coll head,
 * consistent with the imp-3463 far-tail sigma ~ N^(-1/2) form the tail side tracks.
 *
 * MEASUREMENT / FIT ONLY. Reuses the imp-33851 (hence imp-33809) amplitudes and fractions verbatim;
 * the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the 3-point fit is descriptive, not predictive; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-33851-hump-envelope-symmetry-vs-k (skew ladder + head/tail fractions, reused here)
 * @see imp-33809-saturation-curvature-hump-vs-k (per-k hump amplitudes)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3463-sigma-fartail-decay (far-tail sqrt(1/N) form the tail side tracks)
 */

import { IMP33851_HUMP_ENVELOPE_SYMMETRY_VS_K } from './imp-33851-hump-envelope-symmetry-vs-k.js';

// Reuse the imp-33851 skew ladder and head/tail fractions verbatim (no fresh model).
const LADDER = IMP33851_HUMP_ENVELOPE_SYMMETRY_VS_K.symmetryLadder; // j = 1,2,3
const OFFS = LADDER.map((r) => r.offset); // {1, 2, 3}
const SKEW = LADDER.map((r) => r.skew); // {1.2176, 1.5758, 3.0426}
const HEAD_FRAC = LADDER.map((r) => r.headFrac); // {0.8472, 0.5082, 0.3689}
const TAIL_FRAC = LADDER.map((r) => r.tailFrac); // {0.6958, 0.3225, 0.1212}

const rnd = (x, d = 4) => +x.toFixed(d);

// Ordinary least-squares slope/intercept/R^2 of y (here ln of a fraction) against x (offset j).
function olsLog(xs, ys) {
  const n = xs.length;
  const xbar = xs.reduce((s, x) => s + x, 0) / n;
  const ybar = ys.reduce((s, y) => s + y, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - xbar) * (ys[i] - ybar);
    sxx += (xs[i] - xbar) ** 2;
    syy += (ys[i] - ybar) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = ybar - slope * xbar;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) ** 2;
  }
  const r2 = syy === 0 ? 1 : 1 - ssRes / syy;
  return { slope, intercept, r2 };
}

// (G1) Geometric/exponential-in-j fit of the skew ladder: ln skew = alpha + beta*j.
const LN_SKEW = SKEW.map((s) => Math.log(s));
const SKEW_FIT = olsLog(OFFS, LN_SKEW);
const BETA = SKEW_FIT.slope; // per-offset log-growth rate ~ 0.4579
const ALPHA = SKEW_FIT.intercept; // ~ -0.3277
const SKEW_FIT_R2 = SKEW_FIT.r2; // ~ 0.940
// Successive geometric ratios (a constant would mean a pure geometric law -- these GROW).
const GEO_RATIOS = SKEW.slice(1).map((s, i) => rnd(s / SKEW[i])); // {1.2942, 1.9308}

// (G2) Extrapolate skew at j = 4 under the geometric fit and under an exact log-quadratic.
const SKEW4_GEO = Math.exp(ALPHA + BETA * 4); // ~ 4.500
// Exact log-quadratic ln skew = a + b j + c j^2 through the three (j, ln skew) points (j = 1,2,3).
const d1 = LN_SKEW[1] - LN_SKEW[0]; // first difference j:1->2
const d2 = LN_SKEW[2] - LN_SKEW[1]; // first difference j:2->3
const QUAD_C = (d2 - d1) / 2; // second difference / 2 ~ 0.2000 (> 0 => convex/accelerating)
const QUAD_B = d1 - 3 * QUAD_C; // ~ -0.3422
const QUAD_A = LN_SKEW[0] - QUAD_B - QUAD_C; // ~ 0.3391
const SKEW4_QUAD = Math.exp(QUAD_A + QUAD_B * 4 + QUAD_C * 16); // ~ 8.765

// (G3) Head- and tail-side per-offset log-decay slopes; skew-growth rate = tail - head gap.
const HEAD_FIT = olsLog(OFFS, HEAD_FRAC.map((f) => Math.log(f)));
const TAIL_FIT = olsLog(OFFS, TAIL_FRAC.map((f) => Math.log(f)));
const A_HEAD = -HEAD_FIT.slope; // decay magnitude, E_coll head side ~ 0.4158
const A_TAIL = -TAIL_FIT.slope; // decay magnitude, E_trunc tail side ~ 0.8738
const DECAY_GAP = A_TAIL - A_HEAD; // ~ 0.4581 == BETA (identity up to rounding)
const DECAY_RATIO = A_TAIL / A_HEAD; // ~ 2.10 (tail decays ~twice as fast per offset)

export const IMP34527_HUMP_SKEW_GROWTH_LAW_VS_DECAY_ASYMMETRY = {
  id: 'imp-34527',
  proofSection: 'S-frontier',
  question:
    'imp-33851 reported the head-over-tail skew ladder skew(j) = hump(9-j)/hump(9+j) = ' +
    '{1.2176, 1.5758, 3.0426} for j = 1,2,3 but never fit it to a functional form nor connected the ' +
    'fitted growth rate to the head/tail decay-exponent asymmetry (E_coll-dominated head vs ' +
    'E_trunc ~ N^(-1/2) tail). Fit skew(j) to a growth law, extrapolate skew at j = 4, and relate the ' +
    'fitted rate to the head/tail decay asymmetry. Measurement/fit only; reuses imp-33809 amplitudes; ' +
    'inherited model NOT rigorous; no bound; no QED.',
  measuredQuantity:
    'log-linear (geometric) fit ln skew = alpha + beta j of the imp-33851 skew ladder (beta, R^2); ' +
    'extrapolated skew(4) under geometric and log-quadratic fits; head- and tail-side per-offset ' +
    'log-decay rates and the identity beta = aTail - aHead',
  inheritedSkewLadder: SKEW.map(rnd), // {1.2176, 1.5758, 3.0426}
  successiveGeometricRatios: GEO_RATIOS, // {1.2942, 1.9308}: growing => NOT geometric
  geometricFit: {
    beta: rnd(BETA, 4), // ~ 0.4579 per-offset log-growth
    alpha: rnd(ALPHA, 4), // ~ -0.3277
    r2: rnd(SKEW_FIT_R2, 4), // ~ 0.9402
  },
  logQuadraticFit: {
    a: rnd(QUAD_A, 4), // ~ 0.3391
    b: rnd(QUAD_B, 4), // ~ -0.3422
    c: rnd(QUAD_C, 4), // ~ 0.2000 (> 0 => convex/accelerating)
  },
  skewAtOffset4: {
    geometric: rnd(SKEW4_GEO, 4), // ~ 4.4997 (lower estimate; convex residual)
    logQuadratic: rnd(SKEW4_QUAD, 4), // ~ 8.7649 (accelerating estimate)
  },
  decayAsymmetry: {
    aHeadEcoll: rnd(A_HEAD, 4), // ~ 0.4158
    aTailEtrunc: rnd(A_TAIL, 4), // ~ 0.8738
    decayGapTailMinusHead: rnd(DECAY_GAP, 4), // ~ 0.4581 == beta
    decayRatioTailOverHead: rnd(DECAY_RATIO, 4), // ~ 2.1017
  },
  finding: {
    G1_geometric_rejected_but_94pct:
      'The successive skew ratios 1.5758/1.2176 = 1.2942 and 3.0426/1.5758 = 1.9308 are themselves ' +
      'growing, so a constant-ratio (geometric) law is refuted -- the skew ACCELERATES. The log-linear ' +
      'fit ln skew = alpha + beta j gives beta ~ 0.4579, R^2 ~ 0.940, with a convex (+,-,+) log residual ' +
      'that under-predicts the tail.',
    G2_extrapolated_skew_j4:
      'skew(4) is model-dependent: the geometric fit gives skew(4) = exp(alpha + 4 beta) ~ 4.50 (a lower ' +
      'estimate, given the convex residual) and an exact log-quadratic (c ~ 0.20 > 0) gives ~8.76. The j = 4 ' +
      'skew is bracketed ~[4.50, 8.76], a ~2x 3-point extrapolation uncertainty.',
    G3_growth_rate_is_decay_gap:
      'Since ln skew(j) = ln headFrac(j) - ln tailFrac(j), the skew-growth rate equals the tail-minus-head ' +
      'log-decay gap. Measured aHead ~ 0.4158 (E_coll head) and aTail ~ 0.8738 (E_trunc tail) give ' +
      'aTail - aHead ~ 0.4581 = beta ~ 0.4579, with the tail decaying ~2.10x faster per offset. The ' +
      'head-heavy skew IS the excess decay speed of the E_trunc tail, consistent with the imp-3463 ' +
      'far-tail sigma ~ N^(-1/2) form.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / FIT (frontier-direction, NOT rigorous). The imp-33851 head-heavy skew ladder ' +
    'skew(j) = {1.2176, 1.5758, 3.0426} is NOT geometric: the successive ratios grow 1.2942 -> 1.9308, ' +
    'so the skew accelerates. A log-linear (geometric) fit ln skew = alpha + beta j gives growth rate ' +
    'beta ~ 0.4579 at R^2 ~ 0.940 with a convex log residual, extrapolating skew(4) ~ 4.50 as a lower ' +
    'estimate; an exact log-quadratic (curvature c ~ 0.20 > 0) gives skew(4) ~ 8.76, bracketing the ' +
    'j = 4 skew at ~[4.50, 8.76]. Crucially, because ln skew = ln headFrac - ln tailFrac, the fitted ' +
    'growth rate beta equals the head/tail decay-exponent gap aTail - aHead ~ 0.4581 exactly (aHead ~ ' +
    '0.4158 on the E_coll head, aTail ~ 0.8738 on the E_trunc tail, ratio ~ 2.10), so the head-heavy skew ' +
    'growth is precisely the E_trunc tail decaying ~twice as fast per offset as the E_coll head -- ' +
    'consistent with the imp-3463 far-tail sigma ~ N^(-1/2) form the tail tracks. Reuses the imp-33851 ' +
    '(hence imp-33809) amplitudes verbatim; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the 3-point fit is descriptive; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33851 (skew ladder + head/tail fractions, reused here); imp-33809 (per-k hump amplitudes); ' +
    'imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); imp-3463 (far-tail sqrt(1/N) form the tail ' +
    'tracks); imp-486 (C_mb GUE-conditional untouched); imp-3066 (K_a >= 0 untouched).',
};

export const IMP34527_HUMP_SKEW_GROWTH_LAW_VS_DECAY_ASYMMETRY_ASSERTIONS = [
  {
    // (Reuse gate) The skew ladder reused from imp-33851 is {1.2176, 1.5758, 3.0426}.
    id: 'imp34527-reuses-imp33851-skew-ladder',
    description: 'skew ladder reused verbatim from imp-33851 = {1.2176, 1.5758, 3.0426}',
    holds: () =>
      [1.2176, 1.5758, 3.0426].every((v, i) => Math.abs(SKEW[i] - v) < 5e-4),
  },
  {
    // (G1) The geometric null is rejected: successive skew ratios GROW (not constant).
    id: 'imp34527-geometric-null-rejected',
    description: 'successive skew ratios grow 1.2942 -> 1.9308 (not constant) => not geometric',
    holds: () =>
      GEO_RATIOS[1] > GEO_RATIOS[0] &&
      Math.abs(GEO_RATIOS[0] - 1.2942) < 5e-4 &&
      Math.abs(GEO_RATIOS[1] - 1.9308) < 5e-4,
  },
  {
    // (G1) The log-linear fit gives beta ~ 0.4579 at R^2 ~ 0.940 (< 1, imperfect exponential).
    id: 'imp34527-loglinear-fit-beta-r2',
    description: 'ln skew = alpha + beta j fit: beta ~ 0.4579, R^2 ~ 0.940 (imperfect, convex residual)',
    holds: () =>
      Math.abs(BETA - 0.4579) < 5e-4 &&
      Math.abs(SKEW_FIT_R2 - 0.9402) < 2e-3 &&
      SKEW_FIT_R2 < 1,
  },
  {
    // (G2) Extrapolated skew(4) is bracketed ~[4.50, 8.76] (geometric lower, log-quadratic upper),
    // with the log-quadratic curvature c > 0 confirming acceleration.
    id: 'imp34527-skew4-bracket-accelerating',
    description: 'skew(4) ~ 4.50 (geometric) to ~8.76 (log-quadratic), curvature c ~ 0.20 > 0',
    holds: () =>
      QUAD_C > 0 &&
      Math.abs(SKEW4_GEO - 4.4997) < 5e-3 &&
      Math.abs(SKEW4_QUAD - 8.7649) < 5e-3 &&
      SKEW4_QUAD > SKEW4_GEO,
  },
  {
    // (G3) The fitted skew-growth rate beta equals the tail-minus-head log-decay gap (identity from
    // ln skew = ln headFrac - ln tailFrac); the tail decays ~2.10x faster per offset than the head.
    id: 'imp34527-growth-rate-is-decay-gap',
    description: 'beta ~ 0.458 == aTail - aHead (0.8738 - 0.4158); tail/head decay ratio ~ 2.10',
    holds: () =>
      Math.abs(DECAY_GAP - BETA) < 5e-3 &&
      Math.abs(A_HEAD - 0.4158) < 5e-4 &&
      Math.abs(A_TAIL - 0.8738) < 5e-4 &&
      Math.abs(DECAY_RATIO - 2.1017) < 5e-3,
  },
  {
    // Honesty gate: measurement/fit only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp34527-honesty-gate-no-qed',
    description: 'Measurement/fit only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34527_HUMP_SKEW_GROWTH_LAW_VS_DECAY_ASYMMETRY.isRigorous === false &&
      /NO QED/.test(IMP34527_HUMP_SKEW_GROWTH_LAW_VS_DECAY_ASYMMETRY.verdict) &&
      /refereed bound is changed/i.test(IMP34527_HUMP_SKEW_GROWTH_LAW_VS_DECAY_ASYMMETRY.verdict),
  },
];

for (const a of IMP34527_HUMP_SKEW_GROWTH_LAW_VS_DECAY_ASYMMETRY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34527-hump-skew-growth-law-vs-decay-asymmetry assertion failed: ${a.id}`);
  }
}
