/**
 * @module imp-34022-argmin-argmax-migration-symmetry
 *
 * imp-34022 (accuracy, frontier-direction): imp-33877 showed the imp-33858 far-tail excursion at
 * k=11 (max e ~ +0.2479) of the imp-33843 log-linear widening fit is a finite-ladder ENDPOINT
 * artifact: extending the imp-33810 ladder from k=6..11 (BASE, 21 rungs) to k=6..11.5 (EXT115, 23
 * rungs) and k=6..12 (EXT12, 25 rungs) migrates the largest POSITIVE residual to the receding
 * endpoint and GROWS it (+0.2479 -> +0.3218 -> +0.3830), while the negative trough migrates outward
 * "in lock-step" (argmin k=9.00 -> 9.25 -> 9.50). imp-33877 recorded the argmin LOCATION sequence but
 * never (i) contrasted the trough migration against the endpoint-peak migration in magnitude and rate,
 * nor (ii) tested whether the INTERIOR residual shape is boundary-invariant once BOTH edge excursions
 * are stripped. This module answers both, reusing the imp-33877 fit output verbatim (no fresh model).
 *
 * THE MEASUREMENT (imp-33877 base/ext115/ext12 fits reused verbatim; no re-derivation)
 * ------------------------------------------------------------------------------------
 *   Source   IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST.{base,ext115,ext12}, each carrying the
 *            per-rung signed residual series and the argmax/argmin of the imp-33843 OLS re-fit on the
 *            three windows. NO ladder is rebuilt and NO OLS is re-run here -- this is a pure contrast
 *            of the already-tabulated argmin sequence against the argmax sequence, plus an interior
 *            deviation readout, so it inherits the imp-33877 reuse gate (machine-precision match to the
 *            imp-33810 k<=11 ladder) automatically.
 *   Contrast For each window w in {BASE, EXT115, EXT12}: argmax (k, e) = positive endpoint peak,
 *            argmin (k, e) = negative trough. Migration is measured per window-step (BASE->EXT115->
 *            EXT12) in LOCATION (dk) and in signed VALUE (de), separately for peak and trough.
 *   Interior Strip the two edge excursions (the argmax rung AND the argmin rung) from each window;
 *            report the interior RMSE and the deepest-interior residual (k=6) across the three windows,
 *            plus the max residual deviation vs BASE over the common deep-interior k <= 8.75.
 *
 * THE FINDING (measurement only -- co-directional amplification, but ASYMMETRIC, and interior NOT invariant)
 * --------------------------------------------------------------------------------------------------------
 *   (R1) BOTH EXCURSIONS MIGRATE OUTWARD AND AMPLIFY, BUT AT DIFFERENT LOCATION RATES. The peak sits
 *        exactly on the receding endpoint and so moves +0.50 per window-step (k=11 -> 11.5 -> 12); the
 *        trough trails INSIDE and moves only +0.25 per step (k=9.00 -> 9.25 -> 9.50). The peak location
 *        migrates 2.0x faster than the trough -- the "lock-step" of imp-33877 R2 is co-directional
 *        (both outward) but NOT equal-rate: the peak is endpoint-locked, the trough is not.
 *   (R2) THE MIGRATION IS ASYMMETRIC IN ABSOLUTE MAGNITUDE BUT NEAR-SYMMETRIC IN RELATIVE AMPLIFICATION.
 *        The peak grows +0.2479 -> +0.3218 -> +0.3830 (per-step de = +0.0740, +0.0612); the trough
 *        deepens -0.1525 -> -0.2025 -> -0.2487 (per-step d|e| = +0.0501, +0.0461). The peak is ~1.5x
 *        larger and grows ~1.3-1.5x faster IN ABSOLUTE TERMS -- so the two are NOT magnitude-symmetric.
 *        Yet the ratio |trough|/|peak| stays ~0.615 -> 0.629 -> 0.649 (near-constant, drifting up only
 *        ~5.5%), so both edges amplify in nearly fixed PROPORTION as the boundary recedes.
 *   (R3) THE INTERIOR IS NOT BOUNDARY-INVARIANT ONCE BOTH EDGE EXCURSIONS ARE STRIPPED. Removing the
 *        argmax and argmin rungs does NOT stabilize the remainder: the interior RMSE still climbs
 *        0.1021 -> 0.1311 -> 0.1640, and the deepest-interior residual at k=6 -- three-plus decades
 *        below either migrating edge -- SHIFTS AND FLIPS SIGN: -0.1142 -> -0.0577 -> +0.0050 (max
 *        deviation vs BASE on k <= 8.75 is 0.1192, AT k=6). Extending the high-k boundary tilts the
 *        WHOLE OLS line (intercept a 7.959 -> 7.440, slope b -1.434 -> -1.367), rebalancing residuals
 *        at every rung down to the low-k edge. The RMSE growth is a GLOBAL fit rebalancing, not a pair
 *        of localized boundary excursions -- so the interior shape is boundary-DEPENDENT.
 *
 * The punchline: the imp-33877 trough migration is co-directional with the endpoint-peak migration
 * (both march outward and amplify), and the two edges amplify in near-fixed proportion (|trough|/|peak|
 * ~0.63), but the migration is NOT symmetric -- the positive peak is endpoint-locked (2x the trough
 * location rate) and ~1.5x larger in absolute magnitude. Stripping both edge excursions does NOT expose
 * a boundary-invariant interior: the interior RMSE keeps rising and the k=6 residual flips sign, because
 * lengthening the ladder tilts the entire fit line, not just its endpoints.
 *
 * MEASUREMENT / MIGRATION-CONTRAST ONLY. A pure readout that contrasts inherited imp-33877 residual
 * sequences, NOT an RH bound and distinct from any log-linear-vs-power-law form selection (the imp-33843
 * log-linear verdict is untouched). The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the OLS surrogate is descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33877-widening-fit-tail-endpoint-artifact-test (base/ext115/ext12 fits reused verbatim here)
 * @see imp-33858-widening-fit-residual-localization (the k=11 far-tail excursion imp-33877 tested)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose residuals are contrasted)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6..11 ladder extended by imp-33877)
 */

import { IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST } from './imp-33877-widening-fit-tail-endpoint-artifact-test.js';

const SRC = IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST;
const WINDOWS = [
  { name: 'BASE', kEnd: 11, w: SRC.base },
  { name: 'EXT115', kEnd: 11.5, w: SRC.ext115 },
  { name: 'EXT12', kEnd: 12, w: SRC.ext12 },
];

// The two edge excursions per window, straight from the inherited imp-33877 fits.
const argmaxSeq = WINDOWS.map((W) => ({ window: W.name, k: W.w.argmax.k, resid: W.w.argmax.resid }));
const argminSeq = WINDOWS.map((W) => ({ window: W.name, k: W.w.argmin.k, resid: W.w.argmin.resid }));

// Per window-step migration (BASE->EXT115->EXT12), separately for peak location/value and trough.
function steps(seq, pick) {
  const out = [];
  for (let i = 1; i < seq.length; i++) out.push(+(pick(seq[i]) - pick(seq[i - 1])).toFixed(6));
  return out;
}
const peakLocSteps = steps(argmaxSeq, (s) => s.k); // [0.5, 0.5] -- endpoint-locked
const troughLocSteps = steps(argminSeq, (s) => s.k); // [0.25, 0.25]
const peakValSteps = steps(argmaxSeq, (s) => s.resid); // [+0.0740, +0.0612]
const troughAbsSteps = steps(argminSeq, (s) => Math.abs(s.resid)); // [+0.0501, +0.0461]

// Location-rate ratio (peak vs trough) per step, and the magnitude-growth ratio per step.
const locationRateRatio = peakLocSteps.map((d, i) => +(d / troughLocSteps[i]).toFixed(4)); // [2, 2]
const magnitudeGrowthRatio = peakValSteps.map((d, i) => +(d / troughAbsSteps[i]).toFixed(4)); // [~1.48, ~1.33]

// |trough|/|peak| magnitude ratio per window -- near-constant relative amplification.
const troughOverPeakRatio = WINDOWS.map((W) => ({
  window: W.name,
  ratio: +(Math.abs(W.w.argmin.resid) / Math.abs(W.w.argmax.resid)).toFixed(4),
}));

// Interior shape: strip BOTH edge excursions (argmax and argmin rungs) from each window and read out.
function interiorStats(W) {
  const kMax = W.w.argmax.k;
  const kMin = W.w.argmin.k;
  const interior = W.w.series.filter((r) => r.k !== kMax && r.k !== kMin);
  const ss = interior.reduce((s, r) => s + r.resid * r.resid, 0);
  const maxAbs = interior.reduce((m, r) => Math.max(m, Math.abs(r.resid)), 0);
  return {
    window: W.name,
    nInterior: interior.length,
    rmse: +Math.sqrt(ss / interior.length).toExponential(4),
    maxAbs: +maxAbs.toExponential(4),
  };
}
const interior = WINDOWS.map(interiorStats);

// Deepest-interior probe: residual at k=6 (>= 3 decades below either migrating edge) across windows.
const residAtK6 = WINDOWS.map((W) => ({
  window: W.name,
  resid: W.w.series.find((r) => r.k === 6).resid,
}));

// Max residual deviation vs BASE over the common deep-interior k <= 8.75 (below both troughs).
const baseByK = new Map(SRC.base.series.map((r) => [r.k, r.resid]));
let maxInteriorDeviationVsBase = 0;
let maxDeviationAtK = null;
for (const W of WINDOWS.slice(1)) {
  for (const r of W.w.series) {
    if (r.k > 8.75) continue;
    const rb = baseByK.get(r.k);
    if (rb === undefined) continue;
    const d = Math.abs(r.resid - rb);
    if (d > maxInteriorDeviationVsBase) {
      maxInteriorDeviationVsBase = d;
      maxDeviationAtK = r.k;
    }
  }
}
maxInteriorDeviationVsBase = +maxInteriorDeviationVsBase.toExponential(4);

// The whole-line tilt that drives the interior shift: OLS intercept/slope from BASE to EXT12.
const fitTilt = {
  base: SRC.base.fit,
  ext12: SRC.ext12.fit,
  dIntercept: +(SRC.ext12.fit.a - SRC.base.fit.a).toFixed(6),
  dSlope: +(SRC.ext12.fit.b - SRC.base.fit.b).toFixed(6),
};

export const IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY = {
  id: 'imp-34022',
  proofSection: 'S-frontier',
  question:
    'imp-33877 recorded the negative-trough migration (argmin k=9.00 -> 9.25 -> 9.50) as moving ' +
    '"in lock-step" with the endpoint-peak migration (argmax +0.2479 -> +0.3218 -> +0.3830) but never ' +
    'contrasted them in magnitude and rate, nor tested whether the INTERIOR residual shape is ' +
    'boundary-invariant once BOTH edge excursions are stripped. Are the two migrations symmetric, and ' +
    'is the interior boundary-invariant? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'The imp-33877 base/ext115/ext12 log-linear OLS residual fits, contrasting the argmin (negative ' +
    'trough) location/value migration against the argmax (positive endpoint-peak) migration per ' +
    'window-step, and the interior residual RMSE / deepest-interior (k=6) residual / max deviation vs ' +
    'BASE after excising both edge-excursion rungs',
  reusesImp33877Verbatim: true,
  argmaxSequence: argmaxSeq, // endpoint peak: k=11 (+0.2479), 11.5 (+0.3218), 12 (+0.3830)
  argminSequence: argminSeq, // trough: k=9 (-0.1525), 9.25 (-0.2025), 9.5 (-0.2487)
  locationMigration: {
    peakStepsDk: peakLocSteps, // [0.5, 0.5] -- endpoint-locked
    troughStepsDk: troughLocSteps, // [0.25, 0.25]
    peakVsTroughRateRatio: locationRateRatio, // [2, 2] -- peak migrates twice as fast
  },
  magnitudeMigration: {
    peakStepsDe: peakValSteps, // [+0.0740, +0.0612]
    troughStepsDAbs: troughAbsSteps, // [+0.0501, +0.0461]
    peakVsTroughGrowthRatio: magnitudeGrowthRatio, // [~1.48, ~1.33] -- peak grows faster
    troughOverPeakRatio, // ~0.615 -> 0.629 -> 0.649 -- near-constant relative amplification
  },
  interiorAfterStrippingBothEdges: {
    perWindow: interior, // interior RMSE 0.1021 -> 0.1311 -> 0.1640 -- still rising
    residAtK6, // -0.1142 -> -0.0577 -> +0.0050 -- deep-interior residual flips sign
    maxDeviationVsBaseOnKle875: maxInteriorDeviationVsBase, // ~0.1192
    maxDeviationAtK, // k=6
    fitTilt, // intercept 7.959 -> 7.440, slope -1.434 -> -1.367 -- whole line tilts
    boundaryInvariant: false,
  },
  migrationIsSymmetric: false,
  finding: {
    R1_outward_migration_but_asymmetric_location_rate:
      'Both excursions migrate OUTWARD and amplify, but at different location rates: the peak sits on ' +
      'the receding endpoint and moves +0.50 per window-step (k=11 -> 11.5 -> 12), the trough trails ' +
      'inside and moves only +0.25 per step (k=9.00 -> 9.25 -> 9.50). The peak location migrates 2.0x ' +
      'faster; the imp-33877 "lock-step" is co-directional, NOT equal-rate.',
    R2_asymmetric_absolute_magnitude_near_symmetric_relative_amplification:
      'The peak grows +0.2479 -> +0.3218 -> +0.3830 (de = +0.0740, +0.0612); the trough deepens ' +
      '-0.1525 -> -0.2025 -> -0.2487 (d|e| = +0.0501, +0.0461). The peak is ~1.5x larger and grows ' +
      '~1.3-1.5x faster in ABSOLUTE terms (NOT magnitude-symmetric), yet |trough|/|peak| holds ' +
      '~0.615 -> 0.629 -> 0.649 (drifts up only ~5.5%), so the two edges amplify in near-fixed ' +
      'PROPORTION.',
    R3_interior_not_boundary_invariant:
      'Stripping BOTH edge excursions (argmax and argmin rungs) does NOT expose a boundary-invariant ' +
      'interior: interior RMSE still climbs 0.1021 -> 0.1311 -> 0.1640 and the deepest-interior ' +
      'residual at k=6 shifts and FLIPS SIGN -0.1142 -> -0.0577 -> +0.0050 (max deviation vs BASE on ' +
      'k <= 8.75 is 0.1192, at k=6). Extending the high-k boundary tilts the WHOLE OLS line (intercept ' +
      '7.959 -> 7.440, slope -1.434 -> -1.367), so the residual growth is a global fit rebalancing, ' +
      'not two localized boundary excursions -- the interior shape is boundary-DEPENDENT.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / MIGRATION-CONTRAST (frontier-direction, NOT rigorous). Reusing the imp-33877 ' +
    'base/ext115/ext12 fits verbatim, the negative-trough migration is co-directional with the ' +
    'endpoint-peak migration (both march outward and amplify) and the two edges amplify in near-fixed ' +
    'proportion (|trough|/|peak| ~0.63), but the migration is NOT symmetric: the positive peak is ' +
    'endpoint-locked, moving +0.50 per window-step vs the trough +0.25 (a 2.0x location-rate gap), and ' +
    'is ~1.5x larger and grows ~1.3-1.5x faster in absolute magnitude. Stripping BOTH edge excursions ' +
    'does NOT expose a boundary-invariant interior -- the interior RMSE keeps rising (0.102 -> 0.164) ' +
    'and the deepest-interior k=6 residual flips sign (-0.114 -> +0.005), because lengthening the ' +
    'ladder tilts the entire OLS line (intercept 7.959 -> 7.440, slope -1.434 -> -1.367) rather than ' +
    'only its endpoints. Distinct from any form selection; the imp-33843 log-linear verdict is ' +
    'untouched. The OLS surrogate is descriptive, not derived; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33877 (base/ext115/ext12 fits reused verbatim); imp-33858 (the k=11 far-tail excursion); ' +
    'imp-33843 (the log-linear OLS whose residuals are contrasted); imp-33810 (the k=6..11 ladder); ' +
    'imp-33773 (M2 refutation the ladder locks); imp-486 (C_mb GUE-conditional).',
};

export const IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY_ASSERTIONS = [
  {
    // Inherited-sequence gate: the reused imp-33877 argmax/argmin sequences are the known peak/trough.
    id: 'imp34022-inherits-imp33877-peak-and-trough-sequences',
    description: 'argmax at k=11,11.5,12 (+0.2479->+0.3218->+0.3830); argmin at k=9,9.25,9.5 (-0.1525->-0.2025->-0.2487)',
    holds: () =>
      argmaxSeq.map((s) => s.k).join(',') === '11,11.5,12' &&
      argminSeq.map((s) => s.k).join(',') === '9,9.25,9.5' &&
      Math.abs(argmaxSeq[0].resid - 0.2479) < 0.01 &&
      Math.abs(argmaxSeq[2].resid - 0.3830) < 0.01 &&
      Math.abs(argminSeq[0].resid + 0.1525) < 0.01 &&
      Math.abs(argminSeq[2].resid + 0.2487) < 0.01,
  },
  {
    // (R1) Location migration is co-directional (both outward) but asymmetric: peak +0.5/step, trough
    // +0.25/step, a 2.0x rate gap. The peak is endpoint-locked.
    id: 'imp34022-location-migration-2x-asymmetric',
    description: 'peak moves +0.5/step (endpoint-locked), trough +0.25/step; location-rate ratio = 2 at each step',
    holds: () =>
      peakLocSteps.every((d) => Math.abs(d - 0.5) < 1e-9) &&
      troughLocSteps.every((d) => Math.abs(d - 0.25) < 1e-9) &&
      locationRateRatio.every((r) => Math.abs(r - 2) < 1e-6),
  },
  {
    // (R2) Absolute magnitude is asymmetric (peak grows ~1.3-1.5x faster) but relative amplification is
    // near-constant: |trough|/|peak| stays ~0.615..0.649, and BOTH edges amplify monotonically.
    id: 'imp34022-magnitude-asymmetric-but-relative-ratio-near-constant',
    description: 'peak grows faster (ratio>1.3), yet |trough|/|peak| holds ~0.615->0.649 (drift < 6%)',
    holds: () =>
      peakValSteps.every((d) => d > 0) &&
      troughAbsSteps.every((d) => d > 0) &&
      magnitudeGrowthRatio.every((r) => r > 1.3) &&
      Math.abs(troughOverPeakRatio[0].ratio - 0.615) < 0.01 &&
      Math.abs(troughOverPeakRatio[2].ratio - 0.649) < 0.01 &&
      troughOverPeakRatio[2].ratio - troughOverPeakRatio[0].ratio < 0.06,
  },
  {
    // (R3) Interior is NOT boundary-invariant: interior RMSE rises and the k=6 residual flips sign as
    // the whole OLS line tilts.
    id: 'imp34022-interior-not-boundary-invariant',
    description: 'interior RMSE rises 0.102->0.164, k=6 residual flips sign (-0.114->+0.005), max dev vs BASE ~0.119 at k=6',
    holds: () =>
      interior[0].rmse < interior[1].rmse &&
      interior[1].rmse < interior[2].rmse &&
      Math.abs(interior[0].rmse - 0.1021) < 0.01 &&
      Math.abs(interior[2].rmse - 0.1640) < 0.01 &&
      residAtK6[0].resid < 0 &&
      residAtK6[2].resid > 0 &&
      maxDeviationAtK === 6 &&
      Math.abs(maxInteriorDeviationVsBase - 0.1192) < 0.01 &&
      IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY.interiorAfterStrippingBothEdges.boundaryInvariant === false,
  },
  {
    // Honesty gate: asymmetric-migration + boundary-dependent-interior verdict, isRigorous false, no QED, PT SOTA.
    id: 'imp34022-honesty-gate-no-qed',
    description: 'Measurement only: migrationIsSymmetric false, isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY.migrationIsSymmetric === false &&
      IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY.isRigorous === false &&
      /NO QED/.test(IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY.verdict) &&
      /remains SOTA/.test(IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY.verdict),
  },
];

for (const a of IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34022-argmin-argmax-migration-symmetry assertion failed: ${a.id}`);
  }
}
