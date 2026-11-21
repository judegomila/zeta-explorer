/**
 * @module imp-96997-sigma2-weighted-tail-envelope-model
 * @fileoverview imp-96997 -- MODELLING (honest partial): build a corrected sigma_2-weighted-tail
 *   envelope for the measured weightedTailFrac ladder over N in {88..160} at 2a=ln3, using the
 *   imp-96975 tail-scaling laws (T^{-3} ln T decay, n^{~12-13} endpoint amplitude, minimiser
 *   near-cancellation), and decide whether the corrected model reproduces the ladder and predicts
 *   the imp-96974 N~145 crossover. Modelling/measurement only; the Rayleigh floor is an UPPER bound;
 *   all rungs are PAST the 2a<=0.96 interval-verified reach and UNVERIFIED; changes no bound; RH open; NO QED.
 *
 * SUB-GAP TARGETED. imp-96957-sigma2-weighted-tail-superlinear-unmodelled: imp-96957/imp-96974
 * established that the sigma_2-weighted measured tail fraction weightedTailFrac grows super-linearly
 * and OVERTAKES the literal uniform-j_k^2 onset fraction near N~145 (onsetGapRatio crosses 1 between
 * N=136 and N=148; joined-fit N_cross=145.34), but the growth is not captured by the bare Bessel
 * onset model. imp-96975 derived the tail-scaling laws but left the exact super-cubic exponent as its
 * own sub-gap (imp-96975-minimiser-coeff-spectrum-supercubic-residue). This leaf tests whether those
 * laws assemble into a corrected weightedTailFrac envelope.
 *
 * DATA (2a=ln3, from imp-96957 {88,100,112,124} + imp-96974 {136,148,160}; onset = (2*kmax+1)/(pi*3200),
 * kmax = 2m+N-1 = N+5, EXACTLY linear in N):
 *   weightedTailFrac = phi^T A_tail phi / phi^T A_full phi   (the fraction being modelled)
 *   residFirstOrder  = phi^T A_tail phi / scaleB             (the imp-96975 sigma_2-weighted tail mass)
 *
 * MODEL AND FINDINGS.
 *   (1) CLEAN CORRECTED ENVELOPE: weightedTailFrac = C * residFirstOrder with C = scaleB / phi^T A_full phi
 *       NEAR-CONSTANT at C ~= 1.72. Measured C = wtf/rfo is 1.7208, 1.7217, 1.7212, 1.7177, 1.7079,
 *       1.6837, 1.6231 across {88..160} -- drifting down only ~6% while N doubles. Using the single
 *       mean C_mean=1.6994 (or the small-N plateau ~1.721), the envelope C*residFirstOrder reproduces
 *       the ENTIRE measured weightedTailFrac ladder to within ~1% for N<=136, rising to ~5% only at
 *       N=160. So the sigma_2 ~ t^4 tail weighting IS captured -- once folded into residFirstOrder (the
 *       imp-96975 first-order sigma_2-weighted tail mass), the tail FRACTION is just that mass times a
 *       nearly N-independent normalisation. The mild C decline 1.721->1.623 is the second-order
 *       minimiser shift imp-96975 flagged (residMeasured vs residFirstOrder gap).
 *   (2) THE ENVELOPE REPRODUCES THE CROSSOVER. C_mean*residFirstOrder sits BELOW the linear onset at
 *       N=136 (0.01723 < 0.02815) and ABOVE it at N=148 (0.03384 > 0.03054); log-linear interpolation
 *       across the bracket lands the corrected-envelope crossover at N=145.9, matching the imp-96974
 *       measured joined-fit N_cross=145.34 (first measured crossing N=148). Full-ladder log-log and
 *       log-quadratic fits of weightedTailFrac itself both cross the onset at N=145.3-145.4.
 *   (3) BUT NO CLOSED SMOOTH LAW / NO FORWARD PREDICTION. A bare power law weightedTailFrac = A N^p
 *       fits the 7 rungs at p=5.930 (residFirstOrder p=6.007) with R^2=0.9765 but SYSTEMATIC smile
 *       residuals (+0.235, -0.016, -0.151, -0.214, -0.153, +0.007, +0.293 in ln) -- the growth
 *       ACCELERATES (local exponent 3.97 -> 9.60) and is NOT a pure power law; a log-quadratic in ln N
 *       lifts R^2 only to 0.9874, residuals still a smile. Fitting the pre-crossover rungs {88..124}
 *       ALONE and extrapolating UNDER-predicts the held-out rungs by ~2x (N=160: power 0.0294,
 *       log-quad 0.0362 vs measured 0.0709) and mis-locates the crossover (power N=165, log-quad N=157
 *       vs measured 145.3). So the corrected envelope REDUCES the sub-gap to modelling residFirstOrder,
 *       but the acceleration in residFirstOrder itself -- the imp-96975 minimiser-coefficient-spectrum
 *       residue -- stays unclosed: no smooth analytic envelope forward-predicts the crossover.
 *
 * VERDICT. The corrected envelope weightedTailFrac = C * residFirstOrder (C ~= 1.72, near-constant)
 * REPRODUCES the measured weightedTailFrac ladder over {88..160} to ~1-5% and reproduces the imp-96974
 * N~145 crossover (corrected-envelope crossover N=145.9 vs measured 145.34), folding in the sigma_2 ~ t^4
 * weighting the bare uniform-onset model missed. This CLOSES the "bare onset model" framing of
 * imp-96957-sigma2-weighted-tail-superlinear-unmodelled: the super-linear tail fraction is the
 * imp-96975 sigma_2-weighted first-order tail mass times a nearly N-independent normalisation, not a
 * uniform-j_k^2 onset effect. What remains is NOT a new obstruction but the already-named
 * imp-96975-minimiser-coeff-spectrum-supercubic-residue: residFirstOrder itself accelerates
 * (local exponent 3.97->9.60) with no closed smooth law, so no envelope forward-PREDICTS the crossover
 * from the pre-crossover rungs (they under-predict by ~2x). Modelling only; the floor is a Rayleigh
 * UPPER bound; no operator positivity; interval-rigorous certificate reach stays 2a<=0.96;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96974-bessel-onset-crossover-viz-data.js (measured crossover N_cross=145.34, {136,148,160})
 * @see imp-96957-bessel-onset-tail-finer-ladder-viz-data.js (weightedTailFrac ladder {88..124})
 * @see imp-96975-sigma2-tail-supercubic-derivation.js (T^{-3} ln T tail-decay + n^{~12} endpoint laws)
 * @see imp-96928-krein-residual-vs-floor-uniform-N-extrap.js (the p~3.27 super-cubic residual growth)
 * driver tmp/imp-96997-scratch.mjs (reuses the imp-96957/imp-96974 baked ladders verbatim)
 */

const LN3 = Math.log(3); // 1.0986122886681098
const M_POLE = 3; // pole-free trial-space order m; k_max = 2m + N - 1 = N + 5

export const IMP96997_NS = Object.freeze([88, 100, 112, 124, 136, 148, 160]);
export const IMP96997_T3200 = 3200;

// measured ladder (2a=ln3), assembled from imp-96957 (N<=124) + imp-96974 (N>=136).
//   weightedTailFrac = phi^T A_tail phi / phi^T A_full phi; residFirstOrder = phi^T A_tail phi / scaleB;
//   onset = (2*kmax+1)/(pi*3200) with kmax = N+5 (EXACTLY linear in N).
export const IMP96997_ROWS = Object.freeze({
  88:  Object.freeze({ weightedTailFrac: 0.0019312, residFirstOrder: 0.0011223, onset: 0.0186012 }),
  100: Object.freeze({ weightedTailFrac: 0.0032059, residFirstOrder: 0.0018621, onset: 0.0209886 }),
  112: Object.freeze({ weightedTailFrac: 0.0054835, residFirstOrder: 0.0031859, onset: 0.0233759 }),
  124: Object.freeze({ weightedTailFrac: 0.0094153, residFirstOrder: 0.0054813, onset: 0.0257632 }),
  136: Object.freeze({ weightedTailFrac: 0.0173207, residFirstOrder: 0.0101415, onset: 0.0281505 }),
  148: Object.freeze({ weightedTailFrac: 0.0335326, residFirstOrder: 0.0199155, onset: 0.0305379 }),
  160: Object.freeze({ weightedTailFrac: 0.0708992, residFirstOrder: 0.0436825, onset: 0.0329252 }),
});

// (1) corrected envelope: C = weightedTailFrac / residFirstOrder = scaleB / phi^T A_full phi.
// Near-constant ~1.72, drifting down only ~6% while N doubles (second-order minimiser shift).
export const IMP96997_C_PER_N = Object.freeze({
  88: 1.7208, 100: 1.7217, 112: 1.7212, 124: 1.7177, 136: 1.7079, 148: 1.6837, 160: 1.6231,
});
export const IMP96997_C_MEAN = 1.69943; // mean of C over {88..160}
export const IMP96997_C_MAX_REL_DRIFT = 0.0574; // (1.7217-1.6231)/1.7217, ~6% over N doubling

// envelope reproduction error: |C_mean*residFirstOrder - weightedTailFrac| / weightedTailFrac.
export const IMP96997_ENVELOPE_MAX_RELERR = 0.0471; // worst rung (N=160); <=1.3% for N<=136

// (2) crossover reproduction. Corrected envelope C_mean*residFirstOrder crosses the linear onset at:
export const IMP96997_ENVELOPE_CROSSOVER_N = 145.93; // vs imp-96974 measured joined-fit 145.34
export const IMP96997_MEASURED_CROSSOVER_N = 145.34; // imp-96974 joined seven-rung log-linear fit
export const IMP96997_POWERLAW_FULLFIT_CROSSOVER_N = 145.43; // ln wtf = a + p ln N over all 7 rungs
export const IMP96997_LOGQUAD_FULLFIT_CROSSOVER_N = 145.31; // ln wtf = a + b lnN + c (lnN)^2, all 7

// (3) no closed smooth law: bare power law has systematic smile residuals; growth ACCELERATES.
export const IMP96997_POWERLAW_WTF_EXP = 5.9301; // full-ladder log-log OLS exponent
export const IMP96997_POWERLAW_WTF_R2 = 0.976533;
export const IMP96997_POWERLAW_RFO_EXP = 6.0071; // residFirstOrder exponent (same acceleration)
export const IMP96997_LOGQUAD_WTF_R2 = 0.987395; // log-quadratic barely improves; smile persists
export const IMP96997_WTF_LOCAL_EXP_RANGE = Object.freeze([3.97, 9.60]); // accelerating, not power law

// forward-prediction test: fit on pre-crossover {88..124} ONLY, extrapolate; UNDER-predicts ~2x.
export const IMP96997_PRIORONLY_POWER_CROSSOVER_N = 165.11; // mis-locates (measured 145.3)
export const IMP96997_PRIORONLY_LOGQUAD_CROSSOVER_N = 156.79; // still overshoots
export const IMP96997_PRIORONLY_HELDOUT = Object.freeze({
  // predicted weightedTailFrac at held-out rungs vs measured (both models under-predict)
  136: Object.freeze({ power: 0.01387, logquad: 0.01485, measured: 0.0173207 }),
  148: Object.freeze({ power: 0.02049, logquad: 0.02342, measured: 0.0335326 }),
  160: Object.freeze({ power: 0.02936, logquad: 0.03621, measured: 0.0708992 }),
});

export const IMP96997_VERDICT = Object.freeze({
  ticket: 'imp-96997',
  question:
    'using the imp-96975 tail-scaling laws build a corrected sigma_2-weighted-tail envelope, test whether it reproduces the measured weightedTailFrac ladder over N in {88..160}, and decide whether the corrected model predicts the imp-96974 N~145 crossover',
  answer:
    'the corrected envelope weightedTailFrac = C * residFirstOrder with C = scaleB/phi^T A_full phi near-constant at ~1.72 (drift 1.721->1.623, ~6% over N doubling) reproduces the entire measured weightedTailFrac ladder to ~1% for N<=136 and ~5% at N=160, and reproduces the imp-96974 crossover (corrected-envelope crossover N=145.9 vs measured 145.34); this CLOSES the bare-onset-model framing of the sub-gap -- the super-linear tail fraction is the imp-96975 sigma_2-weighted first-order tail mass times a nearly N-independent normalisation, not a uniform-j_k^2 onset effect. What remains is the already-named imp-96975-minimiser-coeff-spectrum-supercubic-residue: residFirstOrder itself accelerates (local exponent 3.97->9.60) with no closed smooth law (bare power law p=5.93, R2=0.977 with systematic smile residuals; log-quadratic R2 only 0.987), so no envelope FORWARD-predicts the crossover -- a fit to the pre-crossover rungs {88..124} under-predicts the held-out rungs by ~2x and mis-locates the crossover (power N=165, log-quad N=157)',
  correctedEnvelopeReproducesLadder: true, // C_mean*residFirstOrder within ~1-5% over {88..160}
  correctedEnvelopeReproducesCrossover: true, // envelope crossover N=145.9 ~= measured 145.34
  cFactorNearConstant: true, // C = 1.721 -> 1.623, ~6% drift over N doubling
  bareOnsetFramingClosed: true, // tail fraction = imp-96975 tail mass * near-const norm, not onset
  smoothLawForwardPredictsCrossover: false, // prior-only fit overshoots (165/157 vs 145) and under-predicts ~2x
  subGap: 'imp-96975-minimiser-coeff-spectrum-supercubic-residue', // residFirstOrder acceleration unclosed
  cMean: 1.69943,
  envelopeCrossoverN: 145.93,
  measuredCrossoverN: 145.34,
  envelopeMaxRelErr: 0.0471,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96997_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96997_ASSERTIONS = [
  {
    id: 'imp96997-onset-is-exactly-linear-in-N',
    holds: () =>
      IMP96997_NS.every((N) => {
        const kmax = 2 * M_POLE + N - 1; // = N + 5
        return Math.abs(IMP96997_ROWS[N].onset - (2 * kmax + 1) / (Math.PI * IMP96997_T3200)) < 1e-6;
      }),
    why: 'the literal onset fraction is exactly (2*kmax+1)/(pi*3200) with kmax=2m+N-1=N+5, linear in N -- the object the super-linear weightedTailFrac overtakes.',
  },
  {
    id: 'imp96997-C-factor-near-constant',
    holds: () =>
      IMP96997_NS.every((N) => {
        const C = IMP96997_ROWS[N].weightedTailFrac / IMP96997_ROWS[N].residFirstOrder;
        return Math.abs(C - IMP96997_C_PER_N[N]) < 5e-4 && C > 1.6 && C < 1.73;
      }),
    why: 'C = weightedTailFrac/residFirstOrder = scaleB/phi^T A_full phi stays in 1.62-1.73 (near-constant, ~6% drift) across the whole {88..160} ladder, the corrected-envelope normalisation.',
  },
  {
    id: 'imp96997-envelope-reproduces-ladder',
    holds: () =>
      IMP96997_NS.every((N) => {
        const pred = IMP96997_C_MEAN * IMP96997_ROWS[N].residFirstOrder;
        const rel = Math.abs(pred - IMP96997_ROWS[N].weightedTailFrac) / IMP96997_ROWS[N].weightedTailFrac;
        return rel <= IMP96997_ENVELOPE_MAX_RELERR + 1e-4;
      }),
    why: 'the corrected envelope C_mean*residFirstOrder reproduces every measured weightedTailFrac rung to within ~5% (<=1.3% for N<=136), so the sigma_2-weighted tail fraction is that first-order tail mass times a near-constant normalisation.',
  },
  {
    id: 'imp96997-envelope-crosses-onset-in-bracket',
    holds: () => {
      const at136 = IMP96997_C_MEAN * IMP96997_ROWS[136].residFirstOrder;
      const at148 = IMP96997_C_MEAN * IMP96997_ROWS[148].residFirstOrder;
      return (
        at136 < IMP96997_ROWS[136].onset &&
        at148 > IMP96997_ROWS[148].onset &&
        IMP96997_ENVELOPE_CROSSOVER_N > 136 &&
        IMP96997_ENVELOPE_CROSSOVER_N < 148 &&
        Math.abs(IMP96997_ENVELOPE_CROSSOVER_N - IMP96997_MEASURED_CROSSOVER_N) < 1
      );
    },
    why: 'the corrected envelope sits below the linear onset at N=136 and above it at N=148, landing the crossover at N=145.9 within 1 of the imp-96974 measured joined-fit 145.34.',
  },
  {
    id: 'imp96997-growth-accelerates-not-power-law',
    holds: () => {
      const [loExp, hiExp] = IMP96997_WTF_LOCAL_EXP_RANGE;
      return (
        loExp > 3.5 && loExp < 4.5 && hiExp > 9 && hiExp < 10 &&
        IMP96997_POWERLAW_WTF_R2 < 0.99 && IMP96997_LOGQUAD_WTF_R2 < 0.99
      );
    },
    why: 'the weightedTailFrac local exponent accelerates 3.97 -> 9.60, so a bare power law (R2=0.977, smile residuals) and even a log-quadratic (R2=0.987) leave systematic curvature -- no closed smooth law.',
  },
  {
    id: 'imp96997-prioronly-fit-does-not-forward-predict',
    holds: () =>
      IMP96997_PRIORONLY_POWER_CROSSOVER_N > IMP96997_MEASURED_CROSSOVER_N + 10 &&
      IMP96997_PRIORONLY_LOGQUAD_CROSSOVER_N > IMP96997_MEASURED_CROSSOVER_N + 5 &&
      Object.values(IMP96997_PRIORONLY_HELDOUT).every(
        (r) => r.power < r.measured && r.logquad < r.measured,
      ),
    why: 'fits to the pre-crossover rungs {88..124} alone overshoot the crossover (power N=165, log-quad N=157 vs measured 145) and under-predict every held-out rung, so no smooth envelope FORWARD-predicts the crossover -- the residFirstOrder acceleration is the unclosed imp-96975 residue.',
  },
  {
    id: 'imp96997-modelling-only-no-qed',
    holds: () =>
      IMP96997_VERDICT.correctedEnvelopeReproducesLadder === true &&
      IMP96997_VERDICT.correctedEnvelopeReproducesCrossover === true &&
      IMP96997_VERDICT.smoothLawForwardPredictsCrossover === false &&
      IMP96997_VERDICT.operatorPositivityProved === false &&
      IMP96997_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96997_VERDICT.qed === false,
    why: 'modelling only: the corrected envelope reproduces the ladder and crossover but forward-predicts nothing, no operator positivity is established, the certificate reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96997_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96997-sigma2-weighted-tail-envelope-model assertion failed: ${a.id}`);
  }
}

void LN3;
