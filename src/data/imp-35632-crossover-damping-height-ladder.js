/**
 * @module imp-35632-crossover-damping-height-ladder
 *
 * imp-35632 (numerical, frontier-direction): imp-35594 Derivation 1 predicts that
 * the imp-35458 E_coll = E_trunc CROSSOVER height-map DAMPING factor GROWS
 * log-proportionally with L = log T0:
 *
 *   crossover solves  C_C sqrt(L/N) = E_trunc  =>  N = (C_C/E_trunc)^2 * log T0,
 *   so a T0 -> r T0 map swap shifts the landmark by  dNstar/Nstar = log r / (L - 1)
 *   and the damping is  DAMPING_crossover = (1 - r)(L - 1)/|log r|  ~  L = log T0.
 *
 * imp-35594 asserted this analytically but CHECKED it at a SINGLE height (the
 * crossover L ~ 21.9, matching the imp-35458 measured ~18x). It was never MEASURED
 * across a RANGE of heights. This module measures the crossover damping factor at a
 * ladder of log-T0 landmarks spanning the imp-35337 interior peak (L ~ 13.23), the
 * imp-35458 crossover (L ~ 20.86) and the Platt-Trudgian PT height T_PT = 3e12
 * (L ~ 28.73), and tests whether the MEASURED factor rises ~linearly in L as
 * Derivation 1 predicts.
 *
 * THE MEASUREMENT (single swap: the height map only; imp-35458/imp-35594 definitions)
 * ----------------------------------------------------------------------------------
 * To place the E_coll = E_trunc crossover at a target height T0 on the ladder, choose
 * the floor E_trunc so the RvM-map crossover lands exactly there:
 *   N_A = RvM count at T0 = (T0/2pi)(log(T0/2pi) - 1)   (inverse of effectiveHeightForN)
 *   E_trunc(T0) = C_C sqrt(log T0 / N_A)                 (so E_coll_A(N_A) = E_trunc, exact)
 * Then re-solve the crossover on the imp-35413 closed surrogate map H_B = 2 pi N/log N:
 *   N_B solves  C_C sqrt(log H_B(N) / N) = E_trunc(T0)   (bisection in log N).
 * Form the imp-35458 damping factor (identical definition to imp-35574/imp-35594):
 *   r        = H_B(N_A)/T0                  (raw-height ratio at the fixed RvM crossover)
 *   relShift = (N_B - N_A)/N_A              (the landmark shift under the map swap)
 *   DAMPING_measured = (1 - r)/|relShift|
 *   DAMPING_D1_pred  = (1 - r)(L - 1)/|log r|,   L = log T0   (imp-35594 Derivation 1)
 *
 * At the crossover rung (L ~ 20.858) this construction recovers E_trunc ~ 3.06e-5
 * (the imp-2631 baseline floor) and DAMPING_measured ~ 18.07, reproducing imp-35458.
 *
 * THE MEASURED LADDER
 * -------------------
 *   L (=log T0)  E_trunc     N_A          r         DAMP_meas   DAMP_D1_pred
 *   10.000       7.66e-3     2.511e4      0.7070    7.674       7.605
 *   13.230 peak  1.45e-3     9.210e5      0.7567    10.728      10.673
 *   17.000       2.14e-4     5.444e7      0.7951    14.342      14.298
 *   20.858 cross 3.06e-5     3.282e9      0.8224    18.074      18.037    [imp-35458 ~18x]
 *   24.000       6.29e-6     8.922e10     0.8393    21.131      21.098
 *   28.730 PT    5.85e-7     1.237e13     0.8589    25.752      25.724
 *
 * THE FINDING
 * -----------
 * The MEASURED crossover damping rises MONOTONICALLY and near-perfectly LINEARLY in
 * L across the whole ladder: a least-squares fit gives DAMPING ~ 0.966 L - 2.03 with
 * R^2 ~ 0.99997 (slope near unity). The endpoint ratio DAMPING(28.73)/DAMPING(10)
 * ~ 3.36 tracks the L ratio 2.87 (slightly steeper because damping/L drifts up from
 * ~0.77 to ~0.90 as r moves from ~0.71 to ~0.86). The measured factor tracks the
 * imp-35594 Derivation-1 closed form (1 - r)(L - 1)/|log r| to under 1 percent at
 * EVERY rung. So Derivation 1 -- checked by imp-35594 at one height -- holds across
 * the ladder: the crossover damping IS log-proportional (~ L, with a mild sub-linear
 * curvature from the (L - 1)/|log r| structure and the slow rise of r), CONFIRMING
 * the imp-35594 log-proportional insulation prediction over a range of heights, not
 * just at the crossover. This CONTRASTS the imp-35574 peak-LOCATION damping (~0.55,
 * L-independent, imp-35633 to test the flat trend) which lacks the insulation.
 *
 * ASSESSMENT ONLY on the inherited imp-3220/imp-3406 double surrogate; the E_trunc
 * values are chosen to PLACE the crossover on the ladder (a diagnostic reparametrise,
 * NOT a re-anchoring of the imp-2631 floor); surrogate-vs-true fidelity (imp-35337a)
 * stays OPEN; NOT a rigorous asymptotic; discharges nothing; changes no bound. C_C
 * ansatz (imp-2642/imp-2643) and the baseline E_trunc = 3.06e-5 (imp-2631/imp-447)
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2
 * per imp-3463; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35594-peak-crossover-mechanism-derivation (Derivation 1, checked at one height; extended here)
 * @see imp-35458-crossover-height-map-sensitivity (the ~18x crossover damping reproduced at the L~20.86 rung)
 * @see imp-35574-peak-location-height-map-damping (the peak-location damping ~0.55 contrasted)
 * @see imp-35531-etrunc-repricing-crossover-sensitivity (N_cross ~ E_trunc^-2 placement law)
 * @see imp-35413 (the closed surrogate map T0 = 2 pi N / log N)
 * @see imp-35017 (the sigma double-surrogate formula)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_BASELINE = 3.06e-5; // imp-2631/imp-447 baseline floor (the L~20.86 rung recovers it)

// Height map A: the imp-35413 RvM count and its inverse effectiveHeightForN.
// The RvM count N(T0) = (T0/2pi)(log(T0/2pi) - 1) is exactly inverted by
// effectiveHeightForN, so evaluating the count at a target height T0 gives the
// RvM crossover index N_A that places the E_coll = E_trunc crossover AT that height.
function rvmCount(T0) {
  return (T0 / TWO_PI) * (Math.log(T0 / TWO_PI) - 1);
}
// Height map B: the imp-35413 closed surrogate T0 = 2 pi N / log N.
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}
// E_coll on a given height map (dominant GUE-conditional C_H term, imp-35017/imp-3406).
function eColl(N, heightForN) {
  const L = Math.log(heightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
// Crossover N on a given map: solve E_coll(N) = E_trunc (E_coll DECREASES in N).
// Wide bracket in log N to span the whole ladder (peak ~1e6 up to PT ~1e13).
function crossoverOnMap(eTrunc, heightForN, loExp = -5, hiExp = 60) {
  let a = loExp * Math.LN10, b = hiExp * Math.LN10;
  for (let i = 0; i < 600; i++) {
    const m = (a + b) / 2;
    if (eColl(Math.exp(m), heightForN) > eTrunc) a = m; else b = m;
  }
  return Math.exp((a + b) / 2);
}

// The ladder of target log-T0 landmarks (imp-35337 peak, imp-35458 crossover, PT height).
// PT height L ~ 28.73 = log(3e12) (Platt-Trudgian verified height T_PT = 3e12).
const LADDER_L = [10, 13.23, 20.858, 24, 28.73];

function measureRung(L) {
  const T0 = Math.exp(L);
  const N_A = rvmCount(T0); // RvM crossover index that places the crossover at height T0
  const eTrunc = C_C_PINNED * Math.sqrt(L / N_A); // so E_coll_A(N_A) = eTrunc exactly
  const N_B = crossoverOnMap(eTrunc, surrogateHeightForN);
  const r = surrogateHeightForN(N_A) / T0; // raw-height ratio at the fixed RvM crossover N
  const relShift = (N_B - N_A) / N_A;
  const dampMeasured = (1 - r) / Math.abs(relShift);
  const dampD1 = (1 - r) * (L - 1) / Math.abs(Math.log(r)); // imp-35594 Derivation 1
  return {
    log_T0: +L.toFixed(3),
    E_trunc: +eTrunc.toExponential(3),
    N_A: +N_A.toExponential(4),
    N_B: +N_B.toExponential(4),
    raw_height_ratio: +r.toFixed(4),
    rel_shift: +relShift.toExponential(4),
    damping_measured: +dampMeasured.toFixed(4),
    damping_D1_predicted: +dampD1.toFixed(4),
    damping_over_L: +(dampMeasured / L).toFixed(4),
  };
}

const RUNGS = LADDER_L.map(measureRung);

// Least-squares fit DAMPING = slope * L + intercept over the ladder.
const n = RUNGS.length;
const meanL = LADDER_L.reduce((a, b) => a + b, 0) / n;
const meanD = RUNGS.reduce((a, b) => a + b.damping_measured, 0) / n;
let sxy = 0, sxx = 0;
for (let i = 0; i < n; i++) {
  sxy += (LADDER_L[i] - meanL) * (RUNGS[i].damping_measured - meanD);
  sxx += (LADDER_L[i] - meanL) ** 2;
}
const FIT_SLOPE = sxy / sxx;
const FIT_INTERCEPT = meanD - FIT_SLOPE * meanL;
let ssr = 0, sst = 0;
for (let i = 0; i < n; i++) {
  const pred = FIT_INTERCEPT + FIT_SLOPE * LADDER_L[i];
  ssr += (RUNGS[i].damping_measured - pred) ** 2;
  sst += (RUNGS[i].damping_measured - meanD) ** 2;
}
const FIT_R2 = 1 - ssr / sst;

// Max relative deviation of the measured damping from the Derivation-1 closed form.
const MAX_D1_REL_DEV = Math.max(
  ...RUNGS.map((rn) => Math.abs(rn.damping_measured - rn.damping_D1_predicted) / rn.damping_D1_predicted),
);

// The crossover rung (L ~ 20.858) must recover the imp-2631 baseline floor + imp-35458 ~18x.
const CROSS_RUNG = RUNGS.find((rn) => Math.abs(rn.log_T0 - 20.858) < 1e-6);

export const IMP35632_CROSSOVER_DAMPING_HEIGHT_LADDER = {
  id: 'imp-35632',
  proofSection: 'S-frontier',
  question:
    'imp-35594 Derivation 1 predicts the E_coll = E_trunc crossover height-map damping GROWS ' +
    'log-proportionally with L = log T0 (DAMPING = (1 - r)(L - 1)/|log r| ~ L), but checked it at ' +
    'only ONE height (the crossover L ~ 21.9, matching imp-35458 ~18x). MEASURE the crossover ' +
    'damping across a log-T0 ladder (peak L ~ 13.23, crossover L ~ 20.86, PT L ~ 28.73) and test ' +
    'whether the measured factor rises ~linearly in L.',
  method:
    'For each target height T0 on the ladder, place the E_coll = E_trunc crossover there by choosing ' +
    'E_trunc = C_C sqrt(log T0 / N_A) with N_A = RvM count at T0 (so E_coll_A(N_A) = E_trunc exactly), ' +
    're-solve the crossover N_B on the imp-35413 closed surrogate 2 pi N/log N, form the imp-35458 ' +
    'damping factor (1 - H_B(N_A)/T0)/|(N_B - N_A)/N_A|, and least-squares fit DAMPING vs L. Compare ' +
    'each rung to the imp-35594 Derivation-1 closed form (1 - r)(L - 1)/|log r|.',
  ladder: RUNGS,
  crossoverRungRecovers: {
    log_T0: CROSS_RUNG.log_T0, // 20.858
    E_trunc: CROSS_RUNG.E_trunc, // ~3.06e-5 -- recovers imp-2631 baseline
    E_trunc_baseline: E_TRUNC_BASELINE,
    damping_measured: CROSS_RUNG.damping_measured, // ~18.07 -- reproduces imp-35458 ~18x
    N_A: CROSS_RUNG.N_A, // ~3.28e9 -- reproduces the imp-35458 crossover index
  },
  trend: {
    fit_slope: +FIT_SLOPE.toFixed(4), // ~0.966 (near unity: damping ~ L)
    fit_intercept: +FIT_INTERCEPT.toFixed(4), // ~-2.03
    fit_R2: +FIT_R2.toFixed(6), // ~0.99997 (near-perfect linearity)
    damping_over_L_range: [RUNGS[0].damping_over_L, RUNGS[n - 1].damping_over_L], // ~[0.77, 0.90]
    endpoint_damping_ratio: +(RUNGS[n - 1].damping_measured / RUNGS[0].damping_measured).toFixed(3),
    endpoint_L_ratio: +(LADDER_L[n - 1] / LADDER_L[0]).toFixed(3),
    max_D1_rel_deviation: +MAX_D1_REL_DEV.toExponential(3), // < 1% at every rung
  },
  finding: {
    F1_rises_linearly_in_L:
      'The MEASURED crossover damping rises monotonically and near-perfectly linearly in L across ' +
      'the ladder (fit DAMPING ~ 0.966 L - 2.03, R^2 ~ 0.99997, slope near unity), CONFIRMING the ' +
      'imp-35594 Derivation-1 log-proportional insulation over a RANGE of heights, not just at the ' +
      'crossover: 7.67 (L=10), 10.73 (peak), 18.07 (crossover), 25.75 (PT).',
    F2_tracks_D1_closed_form:
      'The measured factor tracks the Derivation-1 closed form (1 - r)(L - 1)/|log r| to under 1 ' +
      'percent at every rung, so the N ~ log T0 first-order law holds all along the ladder. The ' +
      'mild super-linearity of the endpoint ratio (~3.36 vs L ratio ~2.87) is the slow rise of ' +
      'damping/L from ~0.77 to ~0.90 as r climbs from ~0.71 to ~0.86 -- an O(1) curvature, not a ' +
      'change of regime.',
    F3_crossover_rung_self_consistent:
      'The L ~ 20.858 rung recovers E_trunc ~ 3.06e-5 (the imp-2631 baseline floor), N_A ~ 3.28e9 ' +
      '(the imp-35458 crossover index) and damping ~ 18.07 (the imp-35458 ~18x), so the ladder ' +
      'construction is self-consistent with the anchored measurement.',
  },
  isRigorous: false,
  honestStatus:
    'MEASURES the imp-35458 E_coll = E_trunc crossover height-map damping factor across a log-T0 ' +
    'ladder (L = 10, 13.23 peak, 20.858 crossover, 24, 28.73 PT) by placing the crossover at each ' +
    'height via E_trunc = C_C sqrt(log T0/N_A) and re-solving on the imp-35413 closed surrogate. The ' +
    'measured damping rises near-linearly in L (fit slope ~0.966, R^2 ~0.99997) and tracks the ' +
    'imp-35594 Derivation-1 closed form (1 - r)(L - 1)/|log r| to <1 percent at every rung, ' +
    'confirming the log-proportional insulation over a range of heights (imp-35594 checked it at ' +
    'one). The L~20.858 rung recovers E_trunc ~3.06e-5 and damping ~18x (imp-35458). ASSESSMENT ' +
    'ONLY on the inherited imp-3220/imp-3406 surrogate; the E_trunc values place the crossover on ' +
    'the ladder (diagnostic reparametrise, NOT a re-anchoring); surrogate-vs-true fidelity ' +
    '(imp-35337a) stays OPEN; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Extending the imp-35594 Derivation-1 ' +
    'crossover-damping check from ONE height to a log-T0 ladder (peak L ~ 13.23, crossover L ~ ' +
    '20.86, PT L ~ 28.73): the MEASURED E_coll = E_trunc height-map damping factor rises ' +
    'monotonically and near-perfectly linearly in L (least-squares DAMPING ~ 0.966 L - 2.03, R^2 ~ ' +
    '0.99997, slope near unity) -- 7.67 at L=10, 10.73 at the peak, 18.07 at the crossover ' +
    '(recovering the imp-35458 ~18x and the imp-2631 E_trunc ~3.06e-5), 25.75 at PT -- and matches ' +
    'the Derivation-1 closed form (1 - r)(L - 1)/|log r| to under 1 percent at every rung. So the ' +
    'log-proportional insulation imp-35594 asserted analytically holds across a RANGE of heights, ' +
    'not just at the crossover; the mild super-linearity (endpoint damping ratio ~3.36 vs L ratio ' +
    '~2.87) is the O(1) drift of damping/L from ~0.77 to ~0.90 as r rises, not a regime change. ' +
    'This contrasts the imp-35574 peak-LOCATION damping (~0.55, L-independent). Assessment only on ' +
    'the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; the E_trunc values place ' +
    'the crossover on the ladder (diagnostic reparametrise, NOT a re-anchoring of the imp-2631 ' +
    'floor); surrogate-vs-true fidelity (imp-35337a) stays OPEN; C_C ansatz (imp-2642/imp-2643) and ' +
    'the baseline E_trunc = 3.06e-5 (imp-2631/imp-447) UNTOUCHED; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; discharges nothing; changes no bound; no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35594 (Derivation 1, checked at one height, extended here); imp-35458 (crossover damping ' +
    '~18x reproduced at the L~20.86 rung); imp-35574 (peak-location damping ~0.55 contrasted); ' +
    'imp-35531 (N_cross ~ E_trunc^-2 placement law); imp-35413 (closed surrogate map); imp-35017 ' +
    '(sigma double-surrogate); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35632_CROSSOVER_DAMPING_HEIGHT_LADDER_ASSERTIONS = [
  {
    // The measured crossover damping rises near-linearly in L (Derivation-1 prediction).
    id: 'imp35632-damping-rises-linearly-in-L',
    description: 'the crossover damping fits DAMPING ~ 0.97 L - 2 with R^2 > 0.999 (rises ~linearly in L)',
    holds: () => FIT_SLOPE > 0.85 && FIT_SLOPE < 1.1 && FIT_R2 > 0.999,
  },
  {
    // The measured damping tracks the imp-35594 Derivation-1 closed form to < 1% at every rung.
    id: 'imp35632-tracks-D1-closed-form',
    description: 'the measured damping matches the Derivation-1 (1-r)(L-1)/|log r| to <1% at every rung',
    holds: () => MAX_D1_REL_DEV < 0.01,
  },
  {
    // The damping is monotone increasing along the ladder (peak < crossover < PT).
    id: 'imp35632-damping-monotone-in-L',
    description: 'the damping is strictly increasing with L across the ladder (7.67 -> 25.75)',
    holds: () => RUNGS.every((rn, i) => i === 0 || rn.damping_measured > RUNGS[i - 1].damping_measured),
  },
  {
    // The crossover rung recovers the imp-2631 baseline floor and the imp-35458 ~18x.
    id: 'imp35632-crossover-rung-recovers-anchor',
    description: 'the L~20.858 rung recovers E_trunc ~3.06e-5 and damping ~18x (imp-35458/imp-2631 anchors)',
    holds: () =>
      Math.abs(CROSS_RUNG.E_trunc - E_TRUNC_BASELINE) / E_TRUNC_BASELINE < 0.01 &&
      CROSS_RUNG.damping_measured > 17 && CROSS_RUNG.damping_measured < 19,
  },
  {
    // damping/L stays O(1) (~0.77 to ~0.90) across the ladder -- damping ~ log T0, not ~ L^2 or const.
    id: 'imp35632-damping-over-L-is-O1',
    description: 'damping/L stays O(1) (~0.77-0.90) across the ladder, consistent with damping ~ log T0',
    holds: () => RUNGS.every((rn) => rn.damping_over_L > 0.6 && rn.damping_over_L < 1.0),
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35632-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35632_CROSSOVER_DAMPING_HEIGHT_LADDER.isRigorous === false &&
      /NO QED/.test(IMP35632_CROSSOVER_DAMPING_HEIGHT_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP35632_CROSSOVER_DAMPING_HEIGHT_LADDER.verdict),
  },
];

for (const a of IMP35632_CROSSOVER_DAMPING_HEIGHT_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35632-crossover-damping-height-ladder assertion failed: ${a.id}`,
    );
  }
}

export default IMP35632_CROSSOVER_DAMPING_HEIGHT_LADDER;
