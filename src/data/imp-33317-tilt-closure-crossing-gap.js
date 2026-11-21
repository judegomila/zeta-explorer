/**
 * @module imp-33317-tilt-closure-crossing-gap
 * @fileoverview imp-33317 -- CLOSURE EXTRAPOLATION of the imp-3871/imp-3893
 *   model-fidelity L_n = 1 crossing gap by the moment-ratio tilt
 *   T_n = Q_n^true / Q_n^model.
 *
 *   imp-33221 baked the imp-3893 finding that the EXACT resummation of the
 *   imp-3665 super-exponential surrogate crosses L_n = 1 at n ~ 18.38 while the
 *   real Phi-autocorrelation A(tau) measurement crosses at n ~ 48.58 -- a
 *   ~30.2-unit MODEL-FIDELITY gap -- and recorded the imp-3893 moment tilt
 *   T_n whose offsetFractionOfGap = delta_n / (L_n^true - L_n^model) climbed
 *   0.938 -> 1.0002 over n = 10..80 (delta_n = (T_n-1) n(1+4 tau*) the additive
 *   drift offset from the tilt). This module MEASURES, on a finer/deeper grid
 *   (n = 10..120, step 5), whether that tilt accounts for the FULL crossing gap
 *   (offsetFractionOfGap -> 1) and extrapolates whether the model-vs-measurement
 *   discrepancy closes to the arithmetic floor or leaves a residual.
 *
 *   THE MEASUREMENT (offline reuse of the imp-3893 machinery, baked here)
 *   --------------------------------------------------------------------
 *   Reusing the imp-3893/imp-3735 machinery VERBATIM (TRUE moments on
 *   T_A = 8, NM = 3200, inner A resolution 4800; surrogate Q_n^model by
 *   saddle-centred Simpson, quadN = 150000, 16-sigma window), extended to
 *   MMAX = 122 so the deeper rungs n up to 120 are reachable, we recompute the
 *   moment tilt T_n, the drift offset delta_n, the offsetFractionOfGap, and the
 *   RECONSTRUCTED crossing built from surrogate + delta_n alone (dropping the
 *   second-order eps_n^model (T_n-1) piece). Script:
 *   scripts/imp-33317-tilt-closure-offline.mjs. All fields below are baked
 *   reference literals -- this module runs NO quadrature at import.
 *
 *   THREE readings
 *   --------------
 *     (1) offsetFractionOfGap does NOT asymptote to exactly 1 -- it CROSSES 1
 *         at n ~ 74.1 and mildly OVERSHOOTS (1.00023 at n=80, 1.00086 at n=120).
 *         The second-order residual (L_n^true - L_n^model) - delta_n FLIPS SIGN
 *         near n ~ 74 (positive below, negative above): the tilt offset first
 *         under-accounts, then slightly over-accounts, for the L_n gap.
 *     (2) YET THE TILT CLOSES THE CROSSING GAP TO A ~0.086-UNIT ARITHMETIC-FLOOR
 *         RESIDUAL. Locating the L_n = 1 crossing of the RECONSTRUCTED drift
 *         L_n^model + delta_n gives n ~ 48.499, versus the true n ~ 48.584 --
 *         the tilt offset ALONE reproduces 99.716% of the 30.204-unit crossing
 *         shift, leaving only a 0.0857-unit residual carried by the discarded
 *         second-order eps_n^model (T_n-1) leverage term.
 *     (3) SO THE MODEL-vs-MEASUREMENT DISCREPANCY CLOSES ALMOST ENTIRELY VIA THE
 *         SUB-3% TILT, DOWN TO A SMALL SIGNED SECOND-ORDER RESIDUAL -- not to a
 *         clean zero. The residual is the eps_n^model (T_n-1) n(1+4 tau*) piece,
 *         which shrinks from +4.29e-2 (n=10) through zero (n~74) to -4.92e-4
 *         (n=120): the tilt is the whole story to leading order, with an O(1e-2)
 *         -> O(1e-4) second-order tail that keeps offsetFractionOfGap from
 *         settling exactly on 1.
 *
 *   BOTTOM LINE. The imp-3893 moment tilt T_n accounts for essentially the
 *   ENTIRE ~30-unit crossing gap: reconstructing the L_n = 1 crossing from the
 *   surrogate plus the tilt offset delta_n alone lands at n ~ 48.499 vs the true
 *   n ~ 48.584 (99.72% of the shift, 0.086-unit residual). But the closure is
 *   NOT exact -- offsetFractionOfGap crosses 1 at n ~ 74 and overshoots because
 *   the second-order eps_n^model (T_n-1) term flips sign there. The discrepancy
 *   closes to a small SIGNED second-order residual, not to the arithmetic floor.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / FIT ONLY, at the RH-equivalent scale class. This is a closure
 *   extrapolation of a fixed-weight moment-ratio drift decomposition; it
 *   establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity (imp-3066) is
 *   UNTOUCHED. NPHI = 10 kernel truncation inherited; grid-CONVERGENCE stability
 *   only. No refereed bound is changed. No QED.
 *
 *   @see imp-33221-model-fidelity-crossing-gap-viz-data.js (n=10..80 tilt/crossing literals extended here)
 *   @see imp-3893-model-fidelity-moment-discrepancy.js (source machinery: T_n, delta_n, offsetFractionOfGap)
 *   @see imp-3871-saddle-correction-fifth-sixth-derivative.js (localized the model-fidelity crossing gap)
 *
 *   Ticket: imp-33317 (numerical, low).
 */

// Anchored crossings (imp-3871/imp-3893, reproduced by the extended MMAX=122 machinery).
export const IMP33317_CROSS_MODEL = 18.380055989121608;   // surrogate L_n=1 crossing
export const IMP33317_CROSS_TRUE = 48.5843411675591;      // real A(tau) L_n=1 crossing
export const IMP33317_CROSS_GAP = 30.204285178437495;     // CROSS_TRUE - CROSS_MODEL

// Reconstructed crossing from surrogate + delta_n (tilt offset) alone -- second order dropped.
export const IMP33317_CROSS_RECON = 48.49860367377105;
export const IMP33317_RESIDUAL_CROSSING_GAP = 0.08573749378805218; // CROSS_TRUE - CROSS_RECON
export const IMP33317_RECON_CLOSES_FRACTION = 0.9971614129160302;  // (RECON-MODEL)/(TRUE-MODEL)

// offsetFractionOfGap crosses 1 (not asymptote): the tilt offset overshoots the L_n gap past n~74.
export const IMP33317_OFFSET_FRAC_CROSSES_ONE_AT_N = 74.11847037475727;
export const IMP33317_OFFSET_FRAC_AT_120 = 1.0008554223744646;

// Deeper/finer rung table n = 10..120 (step 5): tilt, offsetFractionOfGap, driftTrue L_n^true,
// and the second-order residual (L_n^true - L_n^model) - delta_n that flips sign near n~74.
export const IMP33317_RUNGS = Object.freeze([
  { n: 10, tilt: 1.03127368, offsetFractionOfGap: 0.93819459, driftTrue: 2.064047, secondOrderResidual: 4.2862e-2 },
  { n: 15, tilt: 1.02022716, offsetFractionOfGap: 0.96830831, driftTrue: 1.850259, secondOrderResidual: 2.2845e-2 },
  { n: 20, tilt: 1.01445885, offsetFractionOfGap: 0.98122230, driftTrue: 1.671589, secondOrderResidual: 1.3655e-2 },
  { n: 25, tilt: 1.01099991, offsetFractionOfGap: 0.98794367, driftTrue: 1.518432, secondOrderResidual: 8.7340e-3 },
  { n: 30, tilt: 1.00873316, offsetFractionOfGap: 0.99187861, driftTrue: 1.384705, secondOrderResidual: 5.8270e-3 },
  { n: 35, tilt: 1.00715246, offsetFractionOfGap: 0.99437169, driftTrue: 1.266217, secondOrderResidual: 3.9883e-3 },
  { n: 40, tilt: 1.00599824, offsetFractionOfGap: 0.99604327, driftTrue: 1.159965, secondOrderResidual: 2.7654e-3 },
  { n: 45, tilt: 1.00512497, offsetFractionOfGap: 0.99721264, driftTrue: 1.063733, secondOrderResidual: 1.9205e-3 },
  { n: 50, tilt: 1.00444534, offsetFractionOfGap: 0.99805800, driftTrue: 0.975847, secondOrderResidual: 1.3189e-3 },
  { n: 55, tilt: 1.00390408, offsetFractionOfGap: 0.99868525, driftTrue: 0.895011, secondOrderResidual: 8.8027e-4 },
  { n: 60, tilt: 1.00346470, offsetFractionOfGap: 0.99916054, driftTrue: 0.820205, secondOrderResidual: 5.5424e-4 },
  { n: 65, tilt: 1.00310222, offsetFractionOfGap: 0.99952692, driftTrue: 0.750614, secondOrderResidual: 3.0812e-4 },
  { n: 70, tilt: 1.00279901, offsetFractionOfGap: 0.99981336, driftTrue: 0.685574, secondOrderResidual: 1.1996e-4 },
  { n: 75, tilt: 1.00254234, offsetFractionOfGap: 1.00003995, driftTrue: 0.624539, secondOrderResidual: -2.5348e-5 },
  { n: 80, tilt: 1.00232277, offsetFractionOfGap: 1.00022092, driftTrue: 0.567054, secondOrderResidual: -1.3844e-4 },
  { n: 85, tilt: 1.00213321, offsetFractionOfGap: 1.00036661, driftTrue: 0.512740, secondOrderResidual: -2.2699e-4 },
  { n: 90, tilt: 1.00196821, offsetFractionOfGap: 1.00048466, driftTrue: 0.461271, secondOrderResidual: -2.9659e-4 },
  { n: 95, tilt: 1.00182353, offsetFractionOfGap: 1.00058078, driftTrue: 0.412372, secondOrderResidual: -3.5142e-4 },
  { n: 100, tilt: 1.00169584, offsetFractionOfGap: 1.00065935, driftTrue: 0.365802, secondOrderResidual: -3.9463e-4 },
  { n: 105, tilt: 1.00158246, offsetFractionOfGap: 1.00072374, driftTrue: 0.321356, secondOrderResidual: -4.2860e-4 },
  { n: 110, tilt: 1.00148125, offsetFractionOfGap: 1.00077656, driftTrue: 0.278853, secondOrderResidual: -4.5518e-4 },
  { n: 115, tilt: 1.00139046, offsetFractionOfGap: 1.00081991, driftTrue: 0.238134, secondOrderResidual: -4.7583e-4 },
  { n: 120, tilt: 1.00130864, offsetFractionOfGap: 1.00085542, driftTrue: 0.199060, secondOrderResidual: -4.9167e-4 },
]);

export const IMP33317_TILT_CLOSURE_CROSSING_GAP = Object.freeze({
  id: 'imp-33317-tilt-closure-crossing-gap',
  ticket: 'imp-33317',
  extendsModule: 'imp-33221-model-fidelity-crossing-gap-viz-data.js',
  sourceMachinery: 'imp-3893-model-fidelity-moment-discrepancy.js',
  offlineScript: 'scripts/imp-33317-tilt-closure-offline.mjs',

  summary:
    'CLOSURE EXTRAPOLATION of the imp-3871/imp-3893 model-fidelity L_n=1 crossing gap by the moment tilt ' +
    'T_n = Q_n^true/Q_n^model, on a finer/deeper grid n=10..120 (step 5). Reconstructing the L_n=1 crossing from the ' +
    'surrogate plus the tilt offset delta_n = (T_n-1) n(1+4 tau*) ALONE (dropping the second-order eps_n^model (T_n-1) ' +
    'piece) lands at n~48.499 vs the true n~48.584 -- the tilt accounts for 99.716% of the 30.204-unit crossing shift, ' +
    'leaving a 0.0857-unit arithmetic-floor residual. offsetFractionOfGap = delta_n/(L_n^true - L_n^model) does NOT ' +
    'asymptote to 1: it CROSSES 1 at n~74.1 and mildly OVERSHOOTS (1.00086 at n=120), because the second-order residual ' +
    '(L_n^true - L_n^model) - delta_n flips sign near n~74 (from +4.29e-2 at n=10 through 0 to -4.92e-4 at n=120). So ' +
    'the model-vs-measurement discrepancy closes almost entirely through the sub-3% tilt, down to a small SIGNED ' +
    'second-order residual, NOT to a clean zero. MEASUREMENT/FIT, RH-EQUIVALENT, necessary-but-not-sufficient; operator ' +
    'positivity (imp-3066) untouched; NPHI=10 inherited; no QED; no refereed bound is changed.',

  measured: Object.freeze({
    grid: 'n = 10..120, step 5',
    tAxisEndpoint: 8,
    momentPanels: 3200,
    innerFine: 4800,
    mMax: 122,
    quadN: 150000,
    quadWidthSigma: 16,
    crossModel: IMP33317_CROSS_MODEL,
    crossTrue: IMP33317_CROSS_TRUE,
    crossGap: IMP33317_CROSS_GAP,
    crossRecon: IMP33317_CROSS_RECON,
    residualCrossingGap: IMP33317_RESIDUAL_CROSSING_GAP,
    reconClosesFraction: IMP33317_RECON_CLOSES_FRACTION,
    offsetFracCrossesOneAtN: IMP33317_OFFSET_FRAC_CROSSES_ONE_AT_N,
    offsetFracAt120: IMP33317_OFFSET_FRAC_AT_120,
    rungs: IMP33317_RUNGS,
    closesToArithmeticFloor: false,           // leaves a signed second-order residual, not zero
    tiltAccountsForFullCrossingGap: true,     // 99.716% of the shift, 0.086-unit residual
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    didNotAttemptPositivity: true,
    nphiTruncationInherited: true,
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (imp-3066) remains ' +
      'the lone obstruction, UNTOUCHED. Grid-convergence stability only; no certified error bound; no RH verdict.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions (cheap: check baked-literal internal consistency only) ------
export const IMP33317_TILT_CLOSURE_CROSSING_GAP_ASSERTIONS = [
  {
    id: 'imp33317-tilt-closes-crossing-gap-to-arithmetic-floor-residual',
    why: 'The tilt offset delta_n alone must reconstruct the L_n=1 crossing to a ~0.086-unit residual, closing >99% of ' +
         'the 30.2-unit gap: residual < 0.1, reconClosesFraction > 0.99.',
    holds: () =>
      IMP33317_RESIDUAL_CROSSING_GAP < 0.1 &&
      IMP33317_RECON_CLOSES_FRACTION > 0.99 &&
      Math.abs(IMP33317_CROSS_TRUE - IMP33317_CROSS_RECON - IMP33317_RESIDUAL_CROSSING_GAP) < 1e-9,
  },
  {
    id: 'imp33317-offsetfrac-crosses-one-and-overshoots',
    why: 'offsetFractionOfGap must CROSS 1 in the deep tail (n~74) and overshoot, not asymptote from below: crossing-n ' +
         'in (70,80) and the n=120 value > 1.',
    holds: () =>
      IMP33317_OFFSET_FRAC_CROSSES_ONE_AT_N > 70 &&
      IMP33317_OFFSET_FRAC_CROSSES_ONE_AT_N < 80 &&
      IMP33317_OFFSET_FRAC_AT_120 > 1,
  },
  {
    id: 'imp33317-second-order-residual-flips-sign',
    why: 'The second-order residual (L_n^true - L_n^model) - delta_n must flip sign near n~74: positive at n=10, ' +
         'negative at n=120.',
    holds: () =>
      IMP33317_RUNGS[0].secondOrderResidual > 0 &&
      IMP33317_RUNGS[IMP33317_RUNGS.length - 1].secondOrderResidual < 0,
  },
  {
    id: 'imp33317-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/fit only, does NOT close to the arithmetic floor (signed residual remains), ' +
         'operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const m = IMP33317_TILT_CLOSURE_CROSSING_GAP.measured;
      const c = IMP33317_TILT_CLOSURE_CROSSING_GAP.honestCaveat;
      return (
        m.closesToArithmeticFloor === false &&
        m.tiltAccountsForFullCrossingGap === true &&
        c.isProof === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33317_TILT_CLOSURE_CROSSING_GAP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33317-tilt-closure-crossing-gap assertion failed: ${assertion.id}`);
  }
}

export default IMP33317_TILT_CLOSURE_CROSSING_GAP;
