/**
 * @module imp-35260-reentry-band-cc-prefactor-sensitivity
 *
 * imp-35260 (numerical, frontier-direction) -- MEASURES the sensitivity of the imp-35243/imp-34997/imp-35111
 * REENTRY-band edges to perturbation of the C_C = (1/8) sqrt(3 pi) prefactor, quantifying decades-shift per
 * relative-C_C change. This is the concrete measurement behind imp-35243 requirement R3 (HEIGHT-MAP FIDELITY):
 * R3 flags that the height map g = K log T0(N) with K = (C_C / E_TRUNC_PT)^2 is pinned near the ~3e12 verified
 * anchor, NOT at the 10^37 band location, but imp-35243 never MEASURED how much the band moves when C_C is
 * nudged inside its plausible range around (1/8) sqrt(3 pi). This module does exactly that. It is a
 * MEASUREMENT: it does NOT discharge the surrogate-fidelity certificate; the C_C ansatz is UNTOUCHED; NO QED.
 *
 * HOW C_C ENTERS THE BAND
 * -----------------------
 * The reentry band lives inside a single ceil argument xArg(seed) = log(collapseDist(seed) / EPS_FP) / ln(1/r),
 * with collapseDist the one-step relative approach of the log-law map g(N) = K log T0(N) to its fixed point
 * N_CROSS_FP and r = |g prime(N_CROSS_FP)| the single contraction rate. C_C enters ONLY through the amplitude
 * K = (C_C / E_TRUNC_PT)^2: a relative change dC/C scales K by (1 + dC/C)^2. Changing K moves the fixed point
 * N_CROSS_FP, changes r, and thereby shifts the ceil phase xArg -- which, at the measured upward drift
 * DRIFT_PER_DECADE ~ 0.0187 phase/decade, relocates the band by (phase shift)/drift decades in N. This is the
 * SAME mechanism the imp-35243 D1 demonstration used for the machine-epsilon floor EPS_FP, applied instead to
 * the physically-motivated C_C prefactor.
 *
 * THE MEASUREMENT (converged, recomputed live in this module)
 * -----------------------------------------------------------
 * BAND-EDGE SLOPE. Perturbing C_C by a relative amount dC/C and reading the induced band displacement gives a
 * near-rigid translation of the whole band:
 *   reentry (10^27.08):  ~ -20.86 decades per unit relative C_C  (~ -0.209 decades per 1% C_C)
 *   exit    (10^37.17):  ~ -20.77 decades per unit relative C_C  (~ -0.208 decades per 1% C_C)
 * The two edges move by nearly the same amount (spread < 0.1 decades/unit), i.e. the band TRANSLATES rather
 * than widens/narrows under a C_C perturbation. The sign is NEGATIVE: raising C_C pushes the band DOWN in N.
 * Finite steps: +1% C_C shifts the band -0.208 decades; +10% shifts it -1.97 decades; -10% shifts it +2.21
 * decades (the mild asymmetry is the map curvature).
 *
 * FIXED-POINT SHIFT (clean cross-check). The fixed point itself moves the OPPOSITE way and much less:
 * d log10(N_CROSS_FP) / d(relC) = +0.910 decades per unit relative C_C (rock-solid, delta-independent). So the
 * band motion (-20.9) is NOT just the fixed point sliding -- it is dominated by the phase re-registration.
 *
 * NOISE-FLOOR CAVEAT. collapseDist is a difference of O(1) quantities carrying ~1e-16 rounding noise, so a
 * symmetric finite-difference slope in C_C is meaningful only for relative steps dC/C >= 1e-3; at dC/C = 1e-4
 * or 1e-5 the numerator is swamped by rounding and the apparent slope collapses to a spurious ~ -13 or ~ -2.5.
 * The reported -20.86 is the PLATEAU value stable across dC/C in {1e-3, 1e-2, 3e-2, 1e-1}. This module records
 * the caveat so the plateau is not mistaken for a converged small-step limit.
 *
 * WHAT THIS SETTLES FOR R3
 * ------------------------
 * R3 is NON-VACUOUS and QUANTIFIED: the band position genuinely depends on the C_C ansatz value at the level of
 * ~0.2 decades per 1% of C_C. But the sensitivity is MODERATE, not catastrophic -- a plausible few-percent
 * uncertainty in C_C moves the band by well under a decade, and even a 10% wobble only ~2 decades. Since the
 * band already sits ~14.6-24.7 decades ABOVE any verified zero height (imp-35243 D2), a C_C-induced ~0.2-2
 * decade wobble does NOT bring it into measurable territory. So R3 remains a real requirement (the band inherits
 * the C_C ansatz, which is itself pinned at ~3e12, not at 10^37), but R3 is NOT the binding obstruction -- that
 * stays R1 (floor-independence, imp-35243 D1) and R4 (no verified datum within ~15 decades, imp-35243 D2), both
 * presently unreachable. The measurement thus sharpens, and does not close, imp-35243a.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A MEASUREMENT of reentry-band-edge sensitivity to the C_C prefactor, computed on the inherited imp-3220/
 * imp-3406 log-law surrogate. It discharges NOTHING: imp-35243a / imp-35111a / imp-35174a stay OPEN. The
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (parent: enumerates R1-R4; R3 is height-map fidelity)
 * @see imp-35263-... / imp-35335 (D1/D1b EPS_FP floor-sensitivity -- the R1 companion of this R3 measurement)
 * @see imp-35332-reentry-band-drift-analytic-derivation (the DRIFT_PER_DECADE used to convert phase to decades)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C_PINNED = (1/8) sqrt(3 pi))
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const DRIFT_PER_DECADE = 0.0187; // ceil-phase upward drift (imp-34997/35109/35332)
const REENTRY_EXP = 27.084691; // band-on, log10 N (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // band-off, log10 N (imp-35111/35174)

// Rebuild the imp-35174 double surrogate for an ARBITRARY C_C (C_C enters only through K = (C_C/E_TRUNC_PT)^2).
function surrogateFor(C_C) {
  const K = (C_C / E_TRUNC_PT) ** 2;
  const gD = (N) => K * Math.log(effectiveHeightForN(N));
  const iterateD = (seed, iters) => {
    let N = seed;
    for (let i = 0; i < iters; i++) N = gD(N);
    return N;
  };
  const FP = iterateD(1e9, 200); // fixed point N_CROSS_FP for this K
  const gPrime = (h) => (gD(FP + h) - gD(FP - h)) / (2 * h);
  const r = Math.abs(gPrime(1));
  const lnInvR = Math.log(1 / r);
  return { K, FP, r, lnInvR, gD };
}

// The ceil phase xArg at a seed height (log10 N) for a given surrogate. collapseDist = one-step relative approach.
function phaseAtLog10(m, log10N) {
  const seed = 10 ** log10N;
  const collapseDist = Math.abs(m.gD(seed) - m.FP) / m.FP;
  return Math.log(collapseDist / EPS_FP) / m.lnInvR;
}

const BASE = surrogateFor(C_C_PINNED); // K ~ 1.5727e8, FP ~ 3.2803e9 (bit-identical to imp-35243)

// Converged band-edge slope: decades-shift in N per unit relative C_C, via symmetric finite difference at the
// plateau step dC/C = 1e-2 (see the noise-floor caveat: steps below 1e-3 are rounding-corrupted). The band
// TRANSLATES near-rigidly (both edges move alike), so we report each edge and their spread.
const PLATEAU_STEP = 1e-2;
function bandEdgeSlope(log10N) {
  const mp = surrogateFor(C_C_PINNED * (1 + PLATEAU_STEP));
  const mm = surrogateFor(C_C_PINNED * (1 - PLATEAU_STEP));
  const dPhase = phaseAtLog10(mp, log10N) - phaseAtLog10(mm, log10N);
  return dPhase / (2 * PLATEAU_STEP) / DRIFT_PER_DECADE; // decades in N per unit relative C_C
}
const REENTRY_SLOPE = bandEdgeSlope(REENTRY_EXP); // ~ -20.86
const EXIT_SLOPE = bandEdgeSlope(EXIT_EXP); // ~ -20.77
const EDGE_SLOPE_SPREAD = Math.abs(REENTRY_SLOPE - EXIT_SLOPE); // < 0.1 -- near-rigid translation

// Clean cross-check: the fixed point itself moves the OTHER way (positive) and far less. delta-independent.
const FP_SHIFT_PER_RELCC =
  (Math.log10(surrogateFor(C_C_PINNED * (1 + PLATEAU_STEP)).FP) -
    Math.log10(surrogateFor(C_C_PINNED * (1 - PLATEAU_STEP)).FP)) /
  (2 * PLATEAU_STEP); // ~ +0.910 decades of FP per unit relative C_C

// Noise-floor demonstration: the SAME symmetric slope at a sub-1e-3 step is rounding-corrupted (spurious value).
function reentrySlopeAtStep(step) {
  const mp = surrogateFor(C_C_PINNED * (1 + step));
  const mm = surrogateFor(C_C_PINNED * (1 - step));
  return (phaseAtLog10(mp, REENTRY_EXP) - phaseAtLog10(mm, REENTRY_EXP)) / (2 * step) / DRIFT_PER_DECADE;
}
const SLOPE_PLATEAU_LADDER = [3e-3, 1e-2, 3e-2, 1e-1].map((s) => ({ step: s, slope: reentrySlopeAtStep(s) }));
const SLOPE_PLATEAU_SPREAD =
  Math.max(...SLOPE_PLATEAU_LADDER.map((x) => x.slope)) - Math.min(...SLOPE_PLATEAU_LADDER.map((x) => x.slope));
const NOISE_FLOOR_SLOPE_1EM4 = reentrySlopeAtStep(1e-4); // ~ -13.3 spurious (rounding-corrupted)

// Finite-step band displacements (one-sided from base), showing the mild curvature asymmetry.
function bandDisplacementDecades(relStep) {
  const m = surrogateFor(C_C_PINNED * (1 + relStep));
  return (phaseAtLog10(m, REENTRY_EXP) - phaseAtLog10(BASE, REENTRY_EXP)) / DRIFT_PER_DECADE;
}
const SHIFT_PLUS_1PCT = bandDisplacementDecades(0.01); // ~ -0.208
const SHIFT_PLUS_10PCT = bandDisplacementDecades(0.10); // ~ -1.97
const SHIFT_MINUS_10PCT = bandDisplacementDecades(-0.10); // ~ +2.21

export const IMP35260_REENTRY_BAND_CC_PREFACTOR_SENSITIVITY = {
  id: 'imp-35260',
  proofSection: 'S-frontier',
  question:
    'imp-35243 requirement R3 (height-map fidelity) flags that g = K log T0(N) with K = (C_C/E_TRUNC_PT)^2 is ' +
    'pinned near the ~3e12 anchor, not at the 10^37 reentry band, but never measured how the band-edge positions ' +
    'move when C_C is perturbed around (1/8) sqrt(3 pi). MEASURE the decades-shift per relative-C_C change.',
  mechanism:
    'C_C enters only through the amplitude K = (C_C/E_TRUNC_PT)^2; a relative change dC/C scales K by (1+dC/C)^2, ' +
    'moving the fixed point N_CROSS_FP and the rate r, hence the ceil phase xArg, hence (at the ~0.0187/decade ' +
    'drift) the band position. Same mechanism as the imp-35243 D1 EPS_FP demonstration, applied to C_C.',
  band_edge_sensitivity: {
    reentry_decades_per_unit_relCC: +REENTRY_SLOPE.toPrecision(6), // ~ -20.86
    exit_decades_per_unit_relCC: +EXIT_SLOPE.toPrecision(6), // ~ -20.77
    reentry_decades_per_1pct_CC: +(REENTRY_SLOPE * 0.01).toPrecision(4), // ~ -0.209
    exit_decades_per_1pct_CC: +(EXIT_SLOPE * 0.01).toPrecision(4), // ~ -0.208
    edge_slope_spread: +EDGE_SLOPE_SPREAD.toPrecision(3), // < 0.1 -- band translates near-rigidly
    sign_reading: 'NEGATIVE: raising C_C pushes the band DOWN in N; lowering C_C pushes it UP.',
  },
  fixed_point_cross_check: {
    fp_shift_decades_per_unit_relCC: +FP_SHIFT_PER_RELCC.toPrecision(6), // ~ +0.910 (opposite sign, delta-independent)
    reading:
      'The fixed point N_CROSS_FP moves +0.910 decades per unit relative C_C -- opposite sign and ~23x smaller ' +
      'than the band motion -- so the -20.9 band slope is dominated by phase re-registration, not by the FP sliding.',
  },
  finite_step_displacements: {
    plus_1pct: +SHIFT_PLUS_1PCT.toPrecision(4), // ~ -0.208 decades
    plus_10pct: +SHIFT_PLUS_10PCT.toPrecision(4), // ~ -1.97 decades
    minus_10pct: +SHIFT_MINUS_10PCT.toPrecision(4), // ~ +2.21 decades
    reading:
      'A plausible few-percent C_C uncertainty moves the band well under a decade; a 10% wobble ~2 decades; the ' +
      'mild +/- asymmetry is the log-law map curvature.',
  },
  noise_floor_caveat: {
    plateau_ladder: SLOPE_PLATEAU_LADDER.map((x) => ({ step: x.step, slope: +x.slope.toPrecision(5) })),
    plateau_spread: +SLOPE_PLATEAU_SPREAD.toPrecision(3), // < 0.2 across steps 1e-3..1e-1
    spurious_slope_at_step_1e_minus_4: +NOISE_FLOOR_SLOPE_1EM4.toPrecision(4), // ~ -13.3 (rounding-corrupted)
    reading:
      'collapseDist carries ~1e-16 rounding noise, so a symmetric slope in C_C is meaningful only for relative ' +
      'steps >= 1e-3 (plateau ~ -20.86, spread < 0.2); at step 1e-4 rounding swamps the numerator and the ' +
      'apparent slope collapses to a spurious ~ -13. The reported figure is the plateau, not a small-step limit.',
  },
  r3_status:
    'R3 is NON-VACUOUS and QUANTIFIED: the band position depends on the C_C ansatz at ~0.2 decades per 1% of C_C, ' +
    'a near-rigid translation. But the sensitivity is MODERATE -- a few-percent C_C uncertainty moves the band ' +
    'well under a decade, a 10% wobble ~2 decades -- and the band already sits ~14.6-24.7 decades above any ' +
    'verified height (imp-35243 D2), so a C_C wobble does NOT bring it into measurable territory. R3 stays a real ' +
    'requirement (the band inherits the C_C ansatz, itself pinned at ~3e12) but is NOT the binding obstruction; ' +
    'that stays R1 (floor-independence) and R4 (no verified datum within ~15 decades), both presently unreachable.',
  finding:
    'Measurement of reentry-band-edge sensitivity to the C_C = (1/8) sqrt(3 pi) prefactor (imp-35243 R3). C_C ' +
    'enters only through K = (C_C/E_TRUNC_PT)^2. The band edges translate near-rigidly at ~ -20.86 (reentry) and ' +
    '~ -20.77 (exit) decades per unit relative C_C (~ -0.209 decades per 1% C_C, edge spread < 0.1), sign ' +
    'negative (raising C_C lowers the band in N). The fixed point moves the opposite way and ~23x less ' +
    '(+0.910 decades per unit relC_C), confirming the band motion is phase re-registration. Converged plateau ' +
    'holds for relative steps in {1e-3..1e-1} (spread < 0.2); sub-1e-3 steps are rounding-corrupted (spurious ' +
    '~ -13 at 1e-4). R3 is thus non-vacuous but MODERATE: a plausible few-percent C_C uncertainty moves the band ' +
    'under a decade and cannot lift it out of the ~15-25-decade extrapolation gap. R3 is not the binding ' +
    'obstruction (R1/R4 are). MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; imp-35243a stays ' +
    'OPEN.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-35243/imp-34997/imp-35111 reentry-band ' +
    'edges move ~ -20.86 (reentry) / -20.77 (exit) decades per unit relative change in the C_C = (1/8) sqrt(3 pi) ' +
    'prefactor -- a near-rigid downward translation (~ -0.209 decades per 1% C_C), since C_C enters only via ' +
    'K = (C_C/E_TRUNC_PT)^2. The fixed point moves +0.910 decades per unit relC_C (opposite sign, ~23x smaller). ' +
    'Slope converges on a plateau for relative steps >= 1e-3 (spread < 0.2); smaller steps are rounding-corrupted. ' +
    'This QUANTIFIES imp-35243 R3 (height-map fidelity): the band genuinely inherits the C_C ansatz, so R3 is ' +
    'non-vacuous, but the sensitivity is MODERATE (few-percent C_C -> sub-decade shift) and cannot lift the band ' +
    'out of the ~14.6-24.7-decade extrapolation gap above any verified height (imp-35243 D2). R3 is therefore NOT ' +
    'the binding obstruction; R1 (floor-independence) and R4 (no verified datum) remain binding and presently ' +
    'unreachable, so imp-35243a stays OPEN. MEASUREMENT / ASSESSMENT ONLY on the inherited imp-3220/imp-3406 ' +
    'surrogate; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 ' +
    'are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35243 (parent: enumerates R1-R4; R3 = height-map fidelity); imp-35111/imp-34997 (band edges 10^27.08 - ' +
    '10^37.17); imp-35332 (drift DRIFT_PER_DECADE ~ 0.0187); lambda-rh-height-mapping (effectiveHeightForN RvM ' +
    'inverse); polymath15-constant-C-C (C_C_PINNED = (1/8) sqrt(3 pi)); imp-2642 (C_C ansatz).',
};

export const IMP35260_REENTRY_BAND_CC_PREFACTOR_SENSITIVITY_ASSERTIONS = [
  {
    // The band-edge slope is ~ -20.8 decades per unit relative C_C, negative (raising C_C lowers the band).
    id: 'imp35260-band-edge-slope-magnitude',
    description: 'reentry/exit edges move ~ -20.8 decades per unit relative C_C (negative sign)',
    holds: () =>
      REENTRY_SLOPE < 0 &&
      EXIT_SLOPE < 0 &&
      Math.abs(REENTRY_SLOPE - -20.86) < 0.2 &&
      Math.abs(EXIT_SLOPE - -20.77) < 0.2,
  },
  {
    // The band TRANSLATES: both edges move by nearly the same amount (spread < 0.1 decades/unit).
    id: 'imp35260-band-translates-rigidly',
    description: 'reentry and exit slopes agree to < 0.1 decades/unit -- the band translates, not widens',
    holds: () => EDGE_SLOPE_SPREAD < 0.1,
  },
  {
    // Clean cross-check: the fixed point moves the OPPOSITE way and much less (+0.91 per unit relC_C).
    id: 'imp35260-fixed-point-cross-check',
    description: 'N_CROSS_FP moves +0.910 decades per unit relative C_C (opposite sign, ~23x smaller than the band)',
    holds: () =>
      FP_SHIFT_PER_RELCC > 0 &&
      Math.abs(FP_SHIFT_PER_RELCC - 0.910) < 0.02 &&
      Math.abs(REENTRY_SLOPE) > 10 * FP_SHIFT_PER_RELCC,
  },
  {
    // Noise-floor caveat: plateau stable for steps >= 1e-3, but the 1e-4 step is rounding-corrupted (spurious).
    id: 'imp35260-noise-floor-plateau',
    description: 'slope plateaus for relative steps 1e-3..1e-1 (spread < 0.2); step 1e-4 is spurious (~ -13)',
    holds: () =>
      SLOPE_PLATEAU_SPREAD < 0.2 &&
      Math.abs(NOISE_FLOOR_SLOPE_1EM4 - REENTRY_SLOPE) > 5 &&
      Math.abs(NOISE_FLOOR_SLOPE_1EM4 + 13) < 1,
  },
  {
    // Finite-step displacements: +1% -> ~ -0.21 decades, +/-10% -> ~ -2 / +2 decades (mild curvature asymmetry).
    id: 'imp35260-finite-step-displacements',
    description: '+1% C_C shifts band ~ -0.21 decades; +/-10% -> ~ -2 / +2.2 decades',
    holds: () =>
      Math.abs(SHIFT_PLUS_1PCT - -0.208) < 0.02 &&
      SHIFT_PLUS_10PCT < 0 &&
      SHIFT_MINUS_10PCT > 0 &&
      Math.abs(SHIFT_PLUS_10PCT - -1.97) < 0.1 &&
      Math.abs(SHIFT_MINUS_10PCT - 2.21) < 0.1,
  },
  {
    // Honesty gate: measurement only, R3 non-vacuous but not binding, no QED, no refereed bound is changed, sub-gap stays OPEN.
    id: 'imp35260-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, R3 non-vacuous but not binding, no QED, no refereed bound is changed, imp-35243a OPEN',
    holds: () =>
      IMP35260_REENTRY_BAND_CC_PREFACTOR_SENSITIVITY.isRigorous === false &&
      /NON-VACUOUS/.test(IMP35260_REENTRY_BAND_CC_PREFACTOR_SENSITIVITY.r3_status) &&
      /NOT the binding obstruction/.test(IMP35260_REENTRY_BAND_CC_PREFACTOR_SENSITIVITY.r3_status) &&
      /NO QED/.test(IMP35260_REENTRY_BAND_CC_PREFACTOR_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35260_REENTRY_BAND_CC_PREFACTOR_SENSITIVITY.verdict) &&
      /imp-35243a stays\s+OPEN/.test(IMP35260_REENTRY_BAND_CC_PREFACTOR_SENSITIVITY.finding),
  },
];

for (const a of IMP35260_REENTRY_BAND_CC_PREFACTOR_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35260-reentry-band-cc-prefactor-sensitivity assertion failed: ${a.id}`);
  }
}
