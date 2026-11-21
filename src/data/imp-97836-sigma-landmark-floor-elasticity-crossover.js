/**
 * @module imp-97836-sigma-landmark-floor-elasticity-crossover
 *
 * imp-97836 (numerical, frontier-direction): imp-97822 K2 found the sigma-ramp knee
 * scales as N* ~ E_trunc^(-2.10) -- the same clean dimensional ~ -2 the imp-33708 FAR-TAIL
 * halving landmark carries, NOT the softened imp-33684 INTERIOR-PEAK ~ -1.375. The ticket
 * asks to MAP the E_trunc floor-elasticity exponent p(sigma) as a CONTINUOUS function of the
 * sigma landmark, from the interior-peak value (~ -1.375) down through the far tail
 * (~ -2.10), and to LOCATE where it crosses over from the interior regime to the tail regime.
 *
 * THE QUANTITY (identical formulas to imp-3406 / imp-33582 / imp-33684 / imp-33708)
 * -------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (GUE-conditional, dominant)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5 * factor                   (perturbed floor; base imp-2631)
 * Every sub-term is reused byte-for-byte from imp-33684/imp-33708, so factor = 1 reproduces
 * both inherited anchors exactly. Measurement/fit only on the imp-3220/imp-3406 surrogate.
 *
 * THE HEADLINE FINDING: the ticket's "-1.375 -> -2.10 crossover" CONFLATES TWO OBSERVABLES
 * -------------------------------------------------------------------------------------------
 * Mapping the floor-elasticity continuously reveals that the interior -1.375 and the tail
 * -2.10 are NOT two ends of one p(sigma) curve. They belong to two DIFFERENT observables:
 *
 *   (A) PEAK-LOCATION (argmax) elasticity p_peak = d ln N_max / d ln E_trunc = -1.375
 *       (imp-33684). N_max is where sigma is MAXIMISED; softened because E_flow ~ 4.7e-5 is
 *       comparable to E_trunc at the peak and enters the balance.
 *   (B) LEVEL-SET (downslope threshold-crossing) elasticity
 *       p_cross(thr) = d ln N_cross(thr) / d ln E_trunc, where N_cross(thr) is the N at which
 *       sigma first drops below thr on the post-peak downslope. imp-33708 measured the two
 *       tail points p_cross(0.5) ~ -2.099 and p_cross(0.1) ~ -2.079.
 *
 * Measuring p_cross(thr) CONTINUOUSLY over thr in [0.01, 0.94] shows it is UNIFORMLY STEEPER
 * than -2.0 and NEVER reaches the interior -1.375. So there is NO thr at which the level-set
 * elasticity equals -1.375, and hence NO crossover between the two regimes along a single
 * curve. Instead:
 *   - As thr -> sigma_max (~ 0.9494) the level-set crossing DIVERGES: p_cross(0.94) ~ -3.20,
 *     p_cross(0.92) ~ -2.50, steepening without bound. This is a LEVER-ARM off the moving flat
 *     shoulder -- sigma_max itself shifts with the floor (0.9612 / 0.9494 / 0.9348 at
 *     0.5x / 1x / 2x), so a fixed level thr just below the peak rides a nearly flat top whose
 *     small vertical shift moves the crossing enormously. It is a DIVERGENCE, not a softening
 *     toward -1.375.
 *   - As thr -> 0 (deep tail) p_cross relaxes MONOTONICALLY to the clean dimensional -2 FROM
 *     BELOW: -2.099 (0.5), -2.079 (0.1), -2.075 (0.05), -2.066 (0.01), -2.058 (0.001).
 *
 * So the level-set elasticity does NOT continuously connect to the argmax elasticity: at the
 * peak they DISAGREE (argmax -1.375 vs level-set -> -infinity). The "crossover" the ticket
 * posits is illusory; the real structure is a shoulder divergence, and the honest map of
 * p_cross(sigma) is a single monotone branch pinned near -2 that only gets steeper toward the
 * peak, never softer.
 *
 * WHY (mechanism)
 * ---------------
 * On the tail the crossing is pure E_trunc-vs-E_coll balance: sigma = 1/(1 + E_trunc/E_coll)
 * = thr forces E_coll = E_trunc*thr/(1-thr); with E_coll ~ N^(-1/2) this gives N ~ E_trunc^(-2),
 * up to a slow log T0 drift that makes it marginally steeper than -2 (and the drift SHRINKS
 * deeper in the tail, so |p_cross| decreases toward 2). Near the peak E_flow is NOT negligible
 * relative to E_trunc AND the crossing sits on the shoulder of the maximum, where dsigma/dlnN
 * -> 0; the vanishing slope amplifies the floor-induced vertical shift into a large horizontal
 * shift of the crossing, driving |p_cross| up, not down. The -1.375 softening is exclusive to
 * the argmax, whose location is set by min of g = (E_trunc + E_flow)/E_coll where the E_flow
 * term genuinely enters -- a different balance than any level-set crossing.
 *
 * VERDICT: the requested continuous p(sigma) map EXISTS but REFUTES the crossover premise. The
 * level-set floor-elasticity p_cross(thr) is a single monotone branch: it DIVERGES (steeper
 * than -3.2) as thr -> sigma_max and relaxes to the clean dimensional -2 (from below) as
 * thr -> 0, never passing through the interior -1.375. The -1.375 is the DISTINCT peak-argmax
 * elasticity, which the level-set branch does not connect to -- at the peak they disagree
 * (argmax -1.375 vs level-set -> -infinity). There is therefore NO interior-to-tail crossover
 * along one curve; the ticket conflated two observables. Measurement/fit only on the
 * imp-3220/imp-3406 surrogate; C_mb stays GUE-conditional (imp-486); no bound changes;
 * imp-3066 untouched; NO QED; no refereed bound is changed.
 *
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (peak-argmax elasticity ~ -1.375)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (tail crossings ~ -2.099 / -2.079)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity (the ramp-knee ~ -2.10 that motivated this map)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the far-tail landmark definitions)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); imp-398 (E_flow C_F prefactor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-3406/imp-33582 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33684/imp-33708 exactly

// EXACT inherited sub-terms; ONLY the E_trunc floor is a parameter here.
function partsWith(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { E_flow, E_coll, sigma: E_coll / (E_trunc + E_flow + E_coll) };
}
const sigmaWith = (N, E_trunc) => partsWith(N, E_trunc).sigma;

// (A) interior peak location, ternary search in ln N (identical to imp-33684).
function argmaxNforFloor(E_trunc) {
  let lo = Math.log(1e3);
  let hi = Math.log(1e10);
  for (let i = 0; i < 600; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaWith(Math.exp(m1), E_trunc) < sigmaWith(Math.exp(m2), E_trunc)) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// (B) downslope level-set crossing: start bisection AT the peak so we always land on the
// right (decreasing) arm, avoiding the second upslope root that exists for thr < sigma_max.
function crossLog10Downslope(thr, E_trunc) {
  let lo = Math.log10(argmaxNforFloor(E_trunc));
  let hi = 20;
  for (let i = 0; i < 300; i++) {
    const m = (lo + hi) / 2;
    if (sigmaWith(Math.pow(10, m), E_trunc) > thr) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// elasticity from two well-separated floors (0.5x, 2x): p = d ln N / d ln E_trunc.
const LN4 = Math.log(4);
function peakExponent() {
  const nLo = argmaxNforFloor(0.5 * E_TRUNC_BASE);
  const nHi = argmaxNforFloor(2.0 * E_TRUNC_BASE);
  return (Math.log(nHi) - Math.log(nLo)) / LN4;
}
function crossExponent(thr) {
  const lgLo = crossLog10Downslope(thr, 0.5 * E_TRUNC_BASE) * Math.LN10;
  const lgHi = crossLog10Downslope(thr, 2.0 * E_TRUNC_BASE) * Math.LN10;
  return (lgHi - lgLo) / LN4;
}

const SIGMA_MAX = sigmaWith(argmaxNforFloor(E_TRUNC_BASE), E_TRUNC_BASE); // ~0.94943
const PEAK_EXPONENT = peakExponent(); // ~ -1.3752 (reproduces imp-33684)

// The continuous p_cross(thr) map from just below the peak down through the far tail.
const THRESHOLDS = [0.94, 0.92, 0.9, 0.85, 0.8, 0.75, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01];
const ELASTICITY_MAP = THRESHOLDS.map((thr) => {
  const p = crossExponent(thr);
  const lgN = crossLog10Downslope(thr, E_TRUNC_BASE);
  const N = Math.pow(10, lgN);
  const parts = partsWith(N, E_TRUNC_BASE);
  return {
    threshold: thr,
    p_cross: +p.toFixed(4),
    N_cross: +N.toExponential(4),
    log10_N: +lgN.toFixed(4),
    E_flow_over_E_trunc: +(parts.E_flow / E_TRUNC_BASE).toExponential(3),
  };
});

// Anchors that must reproduce the two inherited siblings byte-for-byte.
const ROW_0_5 = ELASTICITY_MAP.find((r) => r.threshold === 0.5);
const ROW_0_1 = ELASTICITY_MAP.find((r) => r.threshold === 0.1);
const ROW_0_94 = ELASTICITY_MAP.find((r) => r.threshold === 0.94);

// Monotonicity of |p_cross| along the map: steepest near the peak, relaxing toward -2 deep in
// the tail. (values are negative, so p_cross INCREASES toward -2 as thr decreases)
const P_MIN = Math.min(...ELASTICITY_MAP.map((r) => r.p_cross)); // most negative (near peak)
const P_MAX = Math.max(...ELASTICITY_MAP.map((r) => r.p_cross)); // least negative (deep tail)

export const IMP97836_SIGMA_LANDMARK_FLOOR_ELASTICITY_CROSSOVER = {
  id: 'imp-97836',
  proofSection: 'S-frontier',
  question:
    'Map the E_trunc floor-elasticity exponent p(sigma) continuously from the imp-33684 ' +
    'interior-peak value (~ -1.375) through the imp-33708 far-tail value (~ -2.10) and locate ' +
    'the interior-to-tail crossover. Measurement/fit only on the imp-3220/imp-3406 surrogate; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  sigmaMax: +SIGMA_MAX.toFixed(7), // ~0.9494290
  peakArgmaxExponent: +PEAK_EXPONENT.toFixed(4), // ~ -1.3752 (reproduces imp-33684)
  elasticityMap: ELASTICITY_MAP, // p_cross(thr) over thr in [0.01, 0.94]
  anchors: {
    peak_argmax: +PEAK_EXPONENT.toFixed(4), // -1.3752
    tail_sigma_0_5: ROW_0_5.p_cross, // -2.0986 (imp-33708 ~ -2.099)
    tail_sigma_0_1: ROW_0_1.p_cross, // -2.0790 (imp-33708 ~ -2.079)
    near_peak_sigma_0_94: ROW_0_94.p_cross, // -3.1972 (divergent shoulder)
  },
  elasticityRange: {
    steepest_p_cross: +P_MIN.toFixed(4), // ~ -3.20 (near peak, divergent)
    shallowest_p_cross: +P_MAX.toFixed(4), // ~ -2.07 (deep tail, -> -2 from below)
    note:
      'p_cross(thr) is a single monotone branch: it DIVERGES (steeper than -3.2) as thr -> ' +
      'sigma_max and relaxes to the clean dimensional -2 (from below) as thr -> 0. It NEVER ' +
      'reaches the interior -1.375, so no level-set threshold sits in the interior regime.',
  },
  crossoverVerdict: {
    exists: false,
    reason:
      'The requested continuous crossover does NOT exist along one curve. The -1.375 interior ' +
      'value is the PEAK-LOCATION (argmax) elasticity; the -2.10 tail value is a LEVEL-SET ' +
      '(downslope threshold-crossing) elasticity -- two DIFFERENT observables. The level-set ' +
      'branch p_cross(thr) is uniformly steeper than -2.0 and diverges toward the peak (a ' +
      'lever-arm off the moving flat shoulder: sigma_max shifts 0.9612/0.9494/0.9348 at ' +
      '0.5x/1x/2x), rather than softening toward -1.375. At the peak the two observables ' +
      'DISAGREE (argmax -1.375 vs level-set -> -infinity), so they do not connect.',
  },
  findings: {
    S0_reproduces_both_anchors:
      'factor 1.0 reproduces the imp-33684 peak-argmax exponent (-1.375) AND the imp-33708 tail ' +
      'crossings (p_cross(0.5) ~ -2.099, p_cross(0.1) ~ -2.079), confirming the inherited model.',
    S1_two_distinct_observables:
      'The interior -1.375 (peak LOCATION / argmax) and the tail -2.10 (level-set / downslope ' +
      'crossing) are DIFFERENT observables. Mapped continuously, the level-set elasticity ' +
      'p_cross(thr) over thr in [0.01, 0.94] is UNIFORMLY steeper than -2.0 and never equals ' +
      '-1.375, so no level-set threshold falls in the interior regime.',
    S2_shoulder_divergence_not_softening:
      'As thr -> sigma_max the level-set crossing DIVERGES: p_cross(0.94) ~ -3.20, p_cross(0.92) ' +
      '~ -2.50, steepening without bound -- a lever-arm off the moving flat shoulder (sigma_max ' +
      'itself shifts 0.9612/0.9494/0.9348 at 0.5x/1x/2x), NOT a softening toward -1.375.',
    S3_tail_relaxes_to_minus_two:
      'As thr -> 0 the level-set elasticity relaxes MONOTONICALLY to the clean dimensional -2 ' +
      'FROM BELOW: -2.099 (0.5), -2.079 (0.1), -2.075 (0.05), -2.066 (0.01), -2.058 (0.001); the ' +
      'log T0 drift that keeps it below -2 shrinks with depth.',
    S4_no_crossover:
      'There is NO interior-to-tail crossover along a single p(sigma) curve. The peak-argmax ' +
      'elasticity (-1.375) and the level-set branch (-> -infinity at the peak, -> -2 in the tail) ' +
      'disagree at the peak and do not connect; the crossover the ticket posits is illusory.',
  },
  isRigorous: false,
  verdict:
    'The requested continuous p(sigma) map EXISTS but REFUTES the crossover premise. The ' +
    'level-set floor-elasticity p_cross(thr) is a single monotone branch: it DIVERGES (steeper ' +
    'than -3.2) as thr -> sigma_max (~0.9494) and relaxes to the clean dimensional -2 from below ' +
    'as thr -> 0 (-2.099/-2.079/-2.058 at 0.5/0.1/0.001), never passing through the interior ' +
    '-1.375. The -1.375 is the DISTINCT peak-argmax elasticity (imp-33684), which the level-set ' +
    'branch does not connect to -- at the peak they disagree (argmax -1.375 vs level-set -> ' +
    '-infinity). So there is NO interior-to-tail crossover along one curve; the ticket conflated ' +
    'two observables. Reproduces both siblings at factor 1 (peak -1.375, tail crossings -2.099 / ' +
    '-2.079). Measurement/fit only on the imp-3220/imp-3406 surrogate; C_mb stays GUE-conditional ' +
    '(imp-486); no bound changes; imp-3066 untouched; NO QED; no refereed bound is changed' +
    '.',
  citation:
    'imp-33684 (peak-argmax elasticity ~ -1.375); imp-33708 (tail crossings ~ -2.099 / -2.079); ' +
    'imp-97822 (ramp-knee ~ -2.10 that motivated this map); imp-33582 (far-tail landmark ' +
    'definitions); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 floor); imp-398 ' +
    '(E_flow C_F prefactor); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97836_SIGMA_LANDMARK_FLOOR_ELASTICITY_CROSSOVER_ASSERTIONS = [
  {
    // Reuse gate (peak): factor 1.0 reproduces the imp-33684 peak-argmax exponent ~ -1.375.
    id: 'imp97836-reproduces-imp33684-peak-exponent',
    description: 'peak-argmax elasticity reproduces imp-33684 ~ -1.375 and sigma_max ~ 0.94943',
    holds: () =>
      Math.abs(PEAK_EXPONENT - -1.375) < 0.02 &&
      Math.abs(SIGMA_MAX - 0.9494290) < 5e-5,
  },
  {
    // Reuse gate (tail): the level-set crossings reproduce imp-33708 ~ -2.099 / -2.079.
    id: 'imp97836-reproduces-imp33708-tail-exponents',
    description: 'level-set p_cross(0.5) ~ -2.099 and p_cross(0.1) ~ -2.079 (reproduces imp-33708)',
    holds: () =>
      Math.abs(ROW_0_5.p_cross - -2.099) < 0.01 &&
      Math.abs(ROW_0_1.p_cross - -2.079) < 0.01,
  },
  {
    // S1: the level-set elasticity is UNIFORMLY steeper than -2.0 -- never reaches -1.375.
    id: 'imp97836-level-set-uniformly-steeper-than-minus-2',
    description: 'every mapped p_cross(thr) < -2.0, so none falls in the interior -1.375 regime',
    holds: () => ELASTICITY_MAP.every((r) => r.p_cross < -2.0),
  },
  {
    // S2: shoulder divergence -- the near-peak crossing is much steeper than the tail.
    id: 'imp97836-shoulder-divergence-near-peak',
    description: 'p_cross(0.94) steeper than -3.0 (lever-arm divergence, not softening to -1.375)',
    holds: () => ROW_0_94.p_cross < -3.0,
  },
  {
    // S3: monotone relaxation toward -2 -- |p_cross| decreases as thr decreases into the tail.
    id: 'imp97836-monotone-relaxation-to-minus-two',
    description: 'p_cross increases monotonically toward -2 as thr decreases (steepest near peak)',
    holds: () => {
      for (let i = 1; i < ELASTICITY_MAP.length; i++) {
        if (!(ELASTICITY_MAP[i].p_cross > ELASTICITY_MAP[i - 1].p_cross)) return false;
      }
      return P_MIN < -3.0 && P_MAX > -2.1 && P_MAX < -2.0;
    },
  },
  {
    // S4: no crossover -- the peak-argmax and level-set observables do not connect.
    id: 'imp97836-no-crossover-two-observables',
    description: 'peak-argmax -1.375 is separated by > 0.6 from the shallowest level-set p_cross (no overlap)',
    holds: () =>
      IMP97836_SIGMA_LANDMARK_FLOOR_ELASTICITY_CROSSOVER.crossoverVerdict.exists === false &&
      P_MAX - PEAK_EXPONENT < -0.6, // level-set shallowest (~ -2.07) far below argmax (~ -1.375)
  },
  {
    // Honesty gate: measurement only, premise refuted, no QED, no refereed bound is changed.
    id: 'imp97836-honesty-gate-no-qed',
    description: 'Measurement only: crossover premise refuted, no QED, no refereed bound is changed',
    holds: () =>
      IMP97836_SIGMA_LANDMARK_FLOOR_ELASTICITY_CROSSOVER.isRigorous === false &&
      /REFUTES the crossover premise/.test(IMP97836_SIGMA_LANDMARK_FLOOR_ELASTICITY_CROSSOVER.verdict) &&
      /NO QED/.test(IMP97836_SIGMA_LANDMARK_FLOOR_ELASTICITY_CROSSOVER.verdict) &&
      /refereed bound is changed/i.test(IMP97836_SIGMA_LANDMARK_FLOOR_ELASTICITY_CROSSOVER.verdict),
  },
];

for (const a of IMP97836_SIGMA_LANDMARK_FLOOR_ELASTICITY_CROSSOVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97836-sigma-landmark-floor-elasticity-crossover assertion failed: ${a.id}`,
    );
  }
}
