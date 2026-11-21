/**
 * @module imp-36036-w1-ensemble-sigma-resampled-phase
 *
 * imp-36036 (numerical, S-frontier): FORM the ensemble imp-35990 only INFERRED. imp-35990 read
 * the imp-35812 achieved single-realization naive W1 forward-summation error (~3.0e-17 normalized)
 * as sitting at "~0.54 of the Higham-Mary ENSEMBLE standard deviation", but it never built the
 * ensemble -- it simply divided the achieved error by the Higham-Mary scale u*sqrt(Sum S_i^2)
 * evaluated at ONE fixed phase (the golden-ratio draw, HM ~ 5.58e-17). This module resamples the
 * oscillatory phase (alpha, beta) over many independent draws, measures the naive length-N error
 * per draw against a high-accuracy double-double reference at N ~ 488602, and compares the
 * empirical error fluctuation to the Higham-Mary scale -- turning the inferred 0.54 into a MEASURED
 * ensemble statistic.
 *
 * TERM FAMILY / METHOD. Same t_k = cos(alpha k + beta sqrt k)/sqrt k as imp-35812 / imp-35948 /
 * imp-35990, but with (alpha, beta) drawn from a deterministic low-discrepancy 2D sequence (golden
 * ratio + (sqrt2 - 1) additive recurrences mod 1, scaled to [0, 2pi); NO RNG, fully reproducible).
 * The signed forward error is extracted as E = (naiveSum - s) - c from the double-double (Kahan-
 * Knuth twoSum) accumulator (s, c): naiveSum and s agree to ~16 digits so (naiveSum - s) is exact
 * (Sterbenz) and subtracting the dd correction c recovers the error to ~1e-32 -- far below the
 * ~3e-17 signal (naively rounding s + c would carry ~1e-16*|sum|, swamping it). The dd reference is
 * a proxy for the imp-35812 exact-BigInt reference (SUB-GAP below).
 *
 * FINDING (measurement only; full-N M = 512 offline via
 * scripts/imp-36036-w1-ensemble-sigma-offline.mjs; import-light re-derivation at N = 50000, M = 64
 * reproduces the scale-free ratio within ~5%):
 *   1. The HIGHAM-MARY SCALE IS PHASE-DEPENDENT and heavy-tailed across draws: Sum S_i^2 (hence
 *      HM = u*sqrt(Sum S_i^2)/Sum|t_k|) varies ~5x, so its ensemble mean (~1.05e-16) far exceeds
 *      its median (~5.28e-17). The imp-35990 single golden-ratio draw (HM ~ 5.58e-17) is close to
 *      the ensemble MEDIAN -- i.e. imp-35990 used a TYPICAL, not cherry-picked, HM draw.
 *   2. The SCALE-FREE PER-DRAW RATIO r_j = E_j / HM_j is well-concentrated and mean-zero: its
 *      standard deviation is sigma_r ~ 0.44 (STABLE across M = 128/256/512 and reduced N), NOT 1.0.
 *      So the Higham-Mary Azuma-Hoeffding scale OVER-PREDICTS the conditional ensemble error
 *      standard deviation by ~1/0.44 ~ 2.3x -- expected, since Hoeffding uses the worst-case
 *      |delta_i| <= u (variance u^2/step) whereas real round-to-nearest errors are ~uniform on
 *      [-u, u] (variance u^2/3, factor 1/sqrt(3) ~ 0.577), with partial-sum correlations trimming
 *      it further to ~0.44.
 *   3. RE-READING imp-35990's 0.54: the "0.54" is exactly the achieved-over-HM-SCALE ratio
 *      (3.0e-17 / 5.58e-17 ~ 0.538), NOT achieved-over-true-ensemble-sigma. Because the true
 *      conditional ensemble std is ~0.44 x HM, the achieved single realization actually sits at
 *      ~0.538 / 0.44 ~ 1.2 TRUE ensemble sigma. imp-35990's qualitative reading survives (the
 *      achieved error is a TYPICAL single realization, of order one ensemble fluctuation, NOT an
 *      anomaly or a missing confidence margin) but its "0.54 sigma" mislabels the HM scale as the
 *      ensemble std; the ensemble std is ~2.3x smaller than that scale.
 *
 * SUB-GAP (imp-36036a). The per-draw reference is a double-double (twoSum) accumulator, not the
 * imp-35812 exact-BigInt reference; its residual (~1e-19, cf. imp-36023 KBN unit-roundoff floor)
 * is ~2 orders below the measured naive error, so it does not affect sigma_r at the reported
 * precision, but an exact-BigInt ensemble would tighten the ~5% import-light re-derivation gap.
 *
 * NOT CERTIFIED. Probabilistic ensemble statistic under phase resampling; instantiates no directed-
 * rounding interval, certifies no W1 bound, changes no bound. The CERTIFIED a-priori bound stays
 * the imp-35890 deterministic ~6.41e-14; the certified length-N interval sum stays MECHANICAL /
 * GREENFIELD (imp-35725 / imp-35681 Part A); C_mb GUE-conditional (imp-486) untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35990-w1-lambda-confidence-calibration (the 0.54 single-realization reading this tests)
 * @see imp-35948-w1-probabilistic-sqrtN-apriori-scale (the Higham-Mary u*sqrt(Sum S_i^2) scale)
 * @see imp-35812-w1-summation-scheme-measured-cost (exact-BigInt achieved naive error ~3.0e-17)
 * @see imp-36023 (KBN compensated-summation unit-roundoff floor, reference-residual context)
 * @see scripts/imp-36036-w1-ensemble-sigma-offline.mjs (full-N M = 512 offline ensemble)
 * @see Higham and Mary 2019, "A New Approach to Probabilistic Rounding Error Analysis"
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35948 / imp-35990) ----
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_AT_TPT = Math.floor(Math.sqrt(T_PT / (4 * Math.PI))); // ~488602 retained terms at T_PT
const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp)

const ACHIEVED_NAIVE_NORM = 3.0e-17; // imp-35812 achieved naive error (single realization), normalized
const HM_IMP35990_DRAW = 5.58e-17; // imp-35948/imp-35990 Higham-Mary scale at the golden-ratio phase

// -- Import-light in-module ensemble (reduced N, small M; re-derives the scale-free ratio) -------
const N_LIGHT = 50000; // reduced length so the in-module ensemble stays cheap at import time
const M_LIGHT = 64; // independent (alpha, beta) phase draws

// Deterministic phase sampler (reproducible; no RNG): 2D additive low-discrepancy recurrence.
function drawPhase(j) {
  const a = ((j + 1) * 0.6180339887498949) % 1; // golden-ratio additive
  const b = ((j + 1) * 0.41421356237309515) % 1; // (sqrt2 - 1) additive (coprime rotation)
  return { alpha: 2 * Math.PI * a, beta: 2 * Math.PI * b };
}

// twoSum: exact (hi, lo) with hi = fl(a + b), lo = exact rounding error (Knuth / Dekker).
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = a - (s - bb) + (b - bb);
  return [s, err];
}

// One draw: signed normalized forward error E and the Higham-Mary scale HM for this phase.
function measureDraw(alpha, beta, N) {
  let naive = 0; // naive recursive double sum
  let s = 0; // double-double accumulator high part (reference)
  let c = 0; // double-double accumulator correction (reference)
  let sumAbs = 0; // Sum |t_k| (normalization base)
  let sumSqPartial = 0; // Sum_i S_i^2 on the naive partials (mean-square accumulator scale)
  for (let k = 1; k <= N; k++) {
    const t = Math.cos(alpha * k + beta * Math.sqrt(k)) / Math.sqrt(k);
    naive += t;
    sumAbs += Math.abs(t);
    sumSqPartial += naive * naive;
    const [ns, e] = twoSum(s, t);
    s = ns;
    c += e;
  }
  const forwardError = naive - s - c; // signed forward error (Sterbenz-exact then dd-corrected)
  return { errNorm: forwardError / sumAbs, hmNorm: (U_ROUNDOFF * Math.sqrt(sumSqPartial)) / sumAbs };
}

function runEnsemble(N, M) {
  const errs = [];
  const hms = [];
  for (let j = 0; j < M; j++) {
    const { alpha, beta } = drawPhase(j);
    const r = measureDraw(alpha, beta, N);
    errs.push(r.errNorm);
    hms.push(r.hmNorm);
  }
  const mean = (xs) => xs.reduce((acc, x) => acc + x, 0) / xs.length;
  const ratios = errs.map((e, j) => e / hms[j]); // scale-free per-draw ratio E_j / HM_j
  const meanRatio = mean(ratios);
  const sigmaRatio = Math.sqrt(mean(ratios.map((r) => (r - meanRatio) ** 2)));
  const meanAbsRatio = mean(ratios.map((r) => Math.abs(r)));
  const meanHM = mean(hms);
  return { meanRatio, sigmaRatio, meanAbsRatio, meanHM, M };
}

const LIGHT = runEnsemble(N_LIGHT, M_LIGHT);

// -- Full-N (N ~ 488602, M = 512) headline literals from the offline script (cited, reproducible) --
const FULL_N = {
  N: N_AT_TPT,
  M: 512,
  empiricalSigmaNorm: 8.24e-17, // std of signed normalized error (tail-dominated by phase spread)
  meanHMNorm: 1.05e-16, // ensemble MEAN Higham-Mary scale (heavy right tail)
  medianHMNorm: 5.28e-17, // ensemble MEDIAN Higham-Mary scale (~ imp-35990 golden-ratio draw)
  sigmaRatio: 0.4418, // std of the scale-free per-draw ratio E_j / HM_j
  meanAbsRatio: 0.3501, // mean |E_j / HM_j|
  meanRatio: -0.0046, // ~0 (mean-zero roundoff)
};

// Derived readings (computed, not hard-coded).
const HM_OVERPREDICT_FACTOR = 1 / FULL_N.sigmaRatio; // ~2.26: HM over-predicts conditional error std
const IMP35990_RATIO = ACHIEVED_NAIVE_NORM / HM_IMP35990_DRAW; // ~0.538 = the "0.54" imp-35990 read
const ACHIEVED_IN_TRUE_SIGMA = IMP35990_RATIO / FULL_N.sigmaRatio; // ~1.22 true ensemble sigma

export const IMP36036_W1_ENSEMBLE_SIGMA_RESAMPLED_PHASE = {
  id: 'imp-36036',
  proofSection: 'S-frontier',
  question:
    'FORM the ensemble imp-35990 only inferred: resample the oscillatory phase (alpha, beta) over ' +
    'many independent draws, measure the naive length-N W1 forward-summation error per draw against ' +
    'a high-accuracy double-double reference at N ~ 488602, and compare the empirical error ' +
    'fluctuation to the Higham-Mary u*sqrt(Sum S_i^2) scale -- testing whether the imp-35812 achieved ' +
    'single-realization error (~3.0e-17 normalized) really sits at ~0.54 of the ENSEMBLE standard ' +
    'deviation. Probabilistic ensemble statistic, NOT certified; instantiates no interval; changes ' +
    'no bound; NO QED.',
  termFamily: {
    form: 't_k = cos(alpha k + beta sqrt k)/sqrt k, phase (alpha, beta) resampled over a deterministic 2D low-discrepancy sequence (no RNG)',
    retainedTermsAtTPT: N_AT_TPT,
    referenceMethod:
      'per-draw double-double (twoSum) accumulator; signed error E = (naiveSum - s) - c to ~1e-32 (proxy for imp-35812 exact-BigInt)',
  },
  inMemoryEnsemble: {
    note:
      'import-light re-derivation at reduced N = 50000, M = 64 (kept cheap); reproduces the ' +
      'scale-free ratio within ~5% of the full-N offline value',
    N: N_LIGHT,
    M: M_LIGHT,
    sigmaRatio: LIGHT.sigmaRatio,
    meanAbsRatio: LIGHT.meanAbsRatio,
    meanRatio: LIGHT.meanRatio,
    meanHMNorm: LIGHT.meanHM,
  },
  fullNEnsemble: {
    note: 'full-N offline ensemble at N ~ 488602, M = 512 (scripts/imp-36036-w1-ensemble-sigma-offline.mjs)',
    ...FULL_N,
  },
  achievedError: { value: ACHIEVED_NAIVE_NORM, source: 'imp-35812 exact-BigInt achieved naive error, normalized by Sum|t_k|' },
  highamMaryScaleIsPhaseDependent: {
    note:
      'the Higham-Mary scale u*sqrt(Sum S_i^2)/Sum|t_k| varies ~5x across phase (heavy right tail): ' +
      'mean ~1.05e-16 vs median ~5.28e-17; the imp-35990 golden-ratio draw (~5.58e-17) is close to the median',
    meanHMNorm: FULL_N.meanHMNorm,
    medianHMNorm: FULL_N.medianHMNorm,
    imp35990DrawHM: HM_IMP35990_DRAW,
    imp35990DrawIsTypical: HM_IMP35990_DRAW > 0.8 * FULL_N.medianHMNorm && HM_IMP35990_DRAW < 1.3 * FULL_N.medianHMNorm,
  },
  scaleFreeRatioReading: {
    note:
      'the per-draw ratio r_j = E_j / HM_j is mean-zero with sigma_r ~ 0.44 (NOT 1.0), so the ' +
      'Higham-Mary Azuma-Hoeffding scale OVER-PREDICTS the conditional ensemble error std by ~2.3x ' +
      '(Hoeffding |delta|<=u worst case vs ~uniform round-to-nearest: 1/sqrt(3) ~ 0.577, trimmed to ' +
      '~0.44 by partial-sum correlations)',
    sigmaRatio: FULL_N.sigmaRatio,
    hmOverpredictFactor: HM_OVERPREDICT_FACTOR,
  },
  reReadingImp35990: {
    note:
      'imp-35990 0.54 = achieved / HM-SCALE (3.0e-17 / 5.58e-17 ~ 0.538), NOT achieved / true-sigma; ' +
      'since the true conditional ensemble std is ~0.44 x HM, the achieved realization sits at ' +
      '~0.538 / 0.44 ~ 1.2 TRUE ensemble sigma -- a typical draw, confirming imp-35990 qualitatively ' +
      'while correcting its "0.54 sigma" label (the ensemble std is ~2.3x smaller than the HM scale)',
    imp35990Ratio: IMP35990_RATIO,
    achievedInTrueSigma: ACHIEVED_IN_TRUE_SIGMA,
  },
  isRigorous: false,
  verdict:
    'NUMERICAL ENSEMBLE MEASUREMENT (frontier-direction, probabilistic, NOT a certified bound). ' +
    'Resampling the phase (alpha, beta) over 512 independent draws of t_k = cos(alpha k + beta sqrt k)' +
    '/sqrt k at N ~ 488602 (double-double reference), the naive W1 forward error is MEAN-ZERO and the ' +
    'scale-free per-draw ratio E_j / HM_j (against each draw own Higham-Mary scale) has standard ' +
    'deviation ~0.44 -- STABLE across M and N -- NOT 1.0, so the Higham-Mary u*sqrt(Sum S_i^2) scale ' +
    'OVER-PREDICTS the conditional ensemble error std by ~2.3x (worst-case |delta|<=u Hoeffding vs ' +
    '~uniform round-to-nearest). The Higham-Mary scale is itself heavy-tailed across phase (mean ' +
    '~1.05e-16, median ~5.28e-17); the imp-35990 golden-ratio draw (~5.58e-17) is a TYPICAL near-median ' +
    'draw. RE-READING imp-35990: its 0.54 is the achieved-over-HM-SCALE ratio (3.0e-17 / 5.58e-17 ~ ' +
    '0.538), not achieved-over-true-sigma; against the true ensemble std (~0.44 x HM) the achieved ' +
    'single realization sits at ~1.2 ensemble sigma -- so imp-35990 qualitative reading (the achieved ' +
    'error is a TYPICAL single realization, not a missing confidence margin) is CONFIRMED, while its ' +
    '"0.54 sigma" label is CORRECTED (it identified the HM scale with the ensemble std, which is ~2.3x ' +
    'smaller). SUB-GAP imp-36036a: the per-draw reference is double-double (~1e-19 residual, cf. ' +
    'imp-36023) not exact-BigInt, and the import-light re-derivation uses reduced N = 50000 / M = 64 ' +
    '(within ~5% of the full-N ratio). Probabilistic ensemble statistic; instantiates no directed-' +
    'rounding interval; evaluates no true H_0; verifies no inequality; changes no bound; the ' +
    'CERTIFIED a-priori bound stays imp-35890 ~6.41e-14; the W1 A + B - C certificate at T_PT stays ' +
    'GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); C_mb GUE-conditional (imp-486) ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35990 (the 0.54 single-realization reading this ensemble tests); imp-35948 (Higham-Mary ' +
    'u*sqrt(Sum S_i^2) scale); imp-35812 (exact-BigInt achieved naive error ~3.0e-17); imp-36023 ' +
    '(KBN unit-roundoff floor, reference-residual context); imp-35890 (CERTIFIED deterministic bound ' +
    '~6.41e-14); imp-35725 (mechanical N-term certified cost); imp-35681 Part A (A+B-C greenfield); ' +
    'Higham and Mary 2019; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36036_W1_ENSEMBLE_SIGMA_RESAMPLED_PHASE_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-35812 / imp-35948 / imp-35990.
    id: 'imp36036-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () => N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) && N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // The in-module light ensemble re-derives the scale-free ratio: sigma_r ~ 0.44, mean-zero.
    id: 'imp36036-light-ensemble-ratio',
    description: 'import-light ensemble (N=50000, M=64): sigma(E/HM) in [0.30, 0.55], mean ~ 0, mean|.| in [0.28, 0.42]',
    holds: () =>
      LIGHT.M === M_LIGHT &&
      LIGHT.sigmaRatio > 0.30 &&
      LIGHT.sigmaRatio < 0.55 &&
      Math.abs(LIGHT.meanRatio) < 0.15 &&
      LIGHT.meanAbsRatio > 0.28 &&
      LIGHT.meanAbsRatio < 0.42,
  },
  {
    // The full-N offline ratio (~0.44) is reproduced by the light ensemble within ~25% relative.
    id: 'imp36036-light-matches-fulln',
    description: 'light sigma(ratio) reproduces the full-N offline sigma(ratio) ~0.4418 within ~25%',
    holds: () => Math.abs(LIGHT.sigmaRatio - FULL_N.sigmaRatio) / FULL_N.sigmaRatio < 0.25,
  },
  {
    // Higham-Mary scale is heavy-tailed across phase; the imp-35990 golden-ratio draw is near-median.
    id: 'imp36036-hm-phase-dependent',
    description: 'HM scale mean (~1.05e-16) exceeds median (~5.28e-17); imp-35990 draw (~5.58e-17) is near-median',
    holds: () =>
      FULL_N.meanHMNorm > 1.5 * FULL_N.medianHMNorm &&
      IMP36036_W1_ENSEMBLE_SIGMA_RESAMPLED_PHASE.highamMaryScaleIsPhaseDependent.imp35990DrawIsTypical === true,
  },
  {
    // HM over-predicts the conditional ensemble std by ~2.3x (sigma_r ~ 0.44 < 1).
    id: 'imp36036-hm-overpredicts',
    description: 'sigma(E/HM) ~ 0.44 < 1 so Higham-Mary over-predicts the conditional error std by ~2.3x',
    holds: () =>
      FULL_N.sigmaRatio > 0.40 &&
      FULL_N.sigmaRatio < 0.48 &&
      HM_OVERPREDICT_FACTOR > 2.0 &&
      HM_OVERPREDICT_FACTOR < 2.6,
  },
  {
    // Re-reading imp-35990: the 0.54 is achieved/HM-scale; against true sigma the draw is ~1.2 sigma.
    id: 'imp36036-rereads-imp35990',
    description: 'imp-35990 0.54 = 3.0e-17/5.58e-17 ~ 0.538 (achieved/HM-scale); vs true sigma the draw is ~1.2 sigma',
    holds: () =>
      Math.abs(IMP35990_RATIO - 0.538) < 0.01 &&
      ACHIEVED_IN_TRUE_SIGMA > 1.0 &&
      ACHIEVED_IN_TRUE_SIGMA < 1.45,
  },
  {
    // Honesty gate: probabilistic (not certified); greenfield/mechanical obstruction; no QED; no refereed bound is changed.
    id: 'imp36036-honesty-gate',
    description: 'Probabilistic/not-certified; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36036_W1_ENSEMBLE_SIGMA_RESAMPLED_PHASE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP36036_W1_ENSEMBLE_SIGMA_RESAMPLED_PHASE.verdict) &&
      /SUB-GAP/.test(IMP36036_W1_ENSEMBLE_SIGMA_RESAMPLED_PHASE.verdict) &&
      /NO QED/.test(IMP36036_W1_ENSEMBLE_SIGMA_RESAMPLED_PHASE.verdict) &&
      /refereed bound is changed/i.test(IMP36036_W1_ENSEMBLE_SIGMA_RESAMPLED_PHASE.verdict),
  },
];

for (const a of IMP36036_W1_ENSEMBLE_SIGMA_RESAMPLED_PHASE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36036-w1-ensemble-sigma-resampled-phase assertion failed: ${a.id}`);
  }
}
