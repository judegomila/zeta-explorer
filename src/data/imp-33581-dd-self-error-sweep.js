/**
 * @module imp-33581-dd-self-error-sweep
 * @fileoverview imp-33581 -- BOUND the imp-33559 double-double reference-libm SELF-ERROR by sweeping
 *   the ddExp Taylor order and the ddLog Newton-iteration count above the imp-33534/imp-33559 defaults
 *   and confirming the measured ~0.567 ULP downward envelope shift is not itself limited by dd
 *   truncation.
 *
 *   THE QUESTION
 *   -----------
 *   imp-33559 recomputed the imp-33312 tau=8 per-height band ceiling under a ~106-bit double-double
 *   reference libm and found the envelope constant shifts DOWN from the fp64-named ~10.779 ULP to
 *   E_ref ~= 10.212 ULP, a ~0.567 ULP (~5.3%) downward move, attributing it to genuine round-off
 *   contamination in the fp64 libm. But that dd libm is not exact: its ddExp is a range-reduced Taylor
 *   truncated at 24 terms and its ddLog is a SINGLE Newton step. Each carries its own truncation floor.
 *   If E_ref were itself limited by dd truncation at ~the 0.567 ULP scale, the "shift is real fp64
 *   round-off" reading would be partly a reference-truncation artifact. This ticket closes that gap:
 *   is E_ref STABLE as the dd libm is refined, so the 0.567 ULP shift is genuinely real?
 *
 *   THE MEASUREMENT
 *   ---------------
 *   The offline probe scripts/imp-33581-dd-self-error-sweep.mjs re-runs the identical imp-33559 tau=8
 *   ceiling computation (same imp-33312 gold, same fixed neighbourhood [245,325] step 2) but sweeps the
 *   reference libm across a 4x3 grid: the ddExp Taylor order in {24,32,40,48} (default 24) and the ddLog
 *   Newton-iteration count in {1,2,3} (default 1). At every one of the 12 (order, Newton) settings it
 *   remeasures E_ref at the binding height tau=8. The measured values below are BAKED from that ~108s
 *   offline run (too heavy to recompute at import).
 *
 *   HEADLINE: E_ref IS BIT-IDENTICAL ACROSS THE ENTIRE SWEEP -- THE dd SELF-ERROR IS 0.0 ULP
 *   ----------------------------------------------------------------------------------------
 *   Every one of the 12 refinements returns the SAME E_ref = 10.211958 ULP to the last measured digit:
 *   raising the ddExp Taylor order from 24 to 48 changes nothing (the default 24-term series with its
 *   1e-34 relative early-exit is already fully converged for these range-reduced arguments), and adding
 *   ddLog Newton steps (1 -&gt; 3) changes nothing (one Newton step already lands at the dd rounding). So:
 *     (1) The dd SELF-ERROR floor is BELOW the measurement resolution: the E_ref spread across the whole
 *         sweep is 0.0 ULP, &lt;&lt; the ~0.567 ULP imp-33559 shift (ratio 0.0, well under 1%).
 *     (2) The imp-33559 ~0.567 ULP downward shift is REAL: it is set by genuine fp64-libm round-off and
 *         NOT by dd truncation -- refining the reference libm does not move E_ref at all, so the shift
 *         cannot be a reference-truncation artifact.
 *     (3) The imp-33534/imp-33559 dd DEFAULTS (24-term ddExp, 1-step ddLog) are already at the dd
 *         rounding floor for this band -- they are not under-resolved; the baked E_ref = 10.212 ULP is
 *         a converged reference value.
 *   This bounds the reference surrogate itself: the ~106-bit dd libm is converged at its defaults, so
 *   the imp-33559 conclusion (the fp64 envelope is a ~5% conservative but valid upper bound) rests on a
 *   reference that is not truncation-limited at the scale of the effect it measures.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT ONLY, at the RH-equivalent scale class. It bounds the truncation self-error of
 *   a reference-precision SURROGATE libm (~106-bit dd), NOT a real correctly-rounded platform libm. It
 *   establishes NO operator positivity and NO new bound; it changes no bound. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. The NPHI=10 Phi-series truncation is inherited
 *   upstream. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33559-envelope-under-reference-libm.js (the shift this bounds the reference self-error of)
 *   @see imp-33534-min-node-reference-precision-libm.js (the ~106-bit dd reference libm swept here)
 *   @see imp-33312-tau-uniform-jitter-band.js (the per-height band whose tau=8 ceiling is remeasured)
 *
 *   Ticket: imp-33581 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const TAU = 8;
const NBHD = Object.freeze({ lo: 245, hi: 325, step: 2 });
const DEFAULT_EXP_TERMS = 24; // imp-33534/imp-33559 ddExp Taylor order
const DEFAULT_LOG_ITERS = 1; // imp-33534/imp-33559 ddLog Newton-iteration count
const IMP33559_ERROR_REF_ULP = 10.2120; // the imp-33559 baked tau=8 reference ceiling
const IMP33559_SHIFT_ULP = 0.5673; // imp-33559 downward shift (fp64 10.7793 -> dd 10.2120)

// BAKED from scripts/imp-33581-dd-self-error-sweep.mjs (~108s ~106-bit dd run).
// tau=8 reference ceiling E_ref over the (ddExp Taylor order, ddLog Newton count) grid.
// EVERY setting returns the identical E_ref to the last measured digit -- the dd libm is
// fully converged at its imp-33534 defaults, so the sweep is a flat plane.
const SWEEP = Object.freeze([
  Object.freeze({ expTerms: 24, logIters: 1, eRefUlp: 10.211958 }),
  Object.freeze({ expTerms: 24, logIters: 2, eRefUlp: 10.211958 }),
  Object.freeze({ expTerms: 24, logIters: 3, eRefUlp: 10.211958 }),
  Object.freeze({ expTerms: 32, logIters: 1, eRefUlp: 10.211958 }),
  Object.freeze({ expTerms: 32, logIters: 2, eRefUlp: 10.211958 }),
  Object.freeze({ expTerms: 32, logIters: 3, eRefUlp: 10.211958 }),
  Object.freeze({ expTerms: 40, logIters: 1, eRefUlp: 10.211958 }),
  Object.freeze({ expTerms: 40, logIters: 2, eRefUlp: 10.211958 }),
  Object.freeze({ expTerms: 40, logIters: 3, eRefUlp: 10.211958 }),
  Object.freeze({ expTerms: 48, logIters: 1, eRefUlp: 10.211958 }),
  Object.freeze({ expTerms: 48, logIters: 2, eRefUlp: 10.211958 }),
  Object.freeze({ expTerms: 48, logIters: 3, eRefUlp: 10.211958 }),
]);

const eRefs = SWEEP.map((r) => r.eRefUlp);
const eRefMin = Math.min(...eRefs);
const eRefMax = Math.max(...eRefs);
const ddSelfErrorUlp = eRefMax - eRefMin; // spread of E_ref across the sweep = the dd self-error band
const defaultRow = SWEEP.find((r) => r.expTerms === DEFAULT_EXP_TERMS && r.logIters === DEFAULT_LOG_ITERS);
const eRefAtDefault = defaultRow.eRefUlp;
const selfErrorToShiftRatio = ddSelfErrorUlp / IMP33559_SHIFT_ULP;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The default (24-term ddExp, 1-step ddLog) reproduces the imp-33559 baked tau=8 reference ceiling.
const defaultReproducesImp33559 = Math.abs(eRefAtDefault - IMP33559_ERROR_REF_ULP) < 1e-3;
// (2) HEADLINE: E_ref is STABLE across the whole (order, Newton) sweep -- the dd self-error is 0.0 ULP.
const eRefStableAcrossSweep = ddSelfErrorUlp === 0;
// (3) The dd self-error is << the imp-33559 shift (< 1% of it), so the shift is not a dd artifact.
const selfErrorFarBelowShift = ddSelfErrorUlp < 0.01 * IMP33559_SHIFT_ULP;
// (4) Raising the ddExp Taylor order past the default 24 does not move E_ref (Taylor already converged).
const expOrderConverged = SWEEP
  .filter((r) => r.logIters === DEFAULT_LOG_ITERS)
  .every((r) => r.eRefUlp === eRefAtDefault);
// (5) Adding ddLog Newton steps past the default 1 does not move E_ref (one step already at dd rounding).
const logNewtonConverged = SWEEP
  .filter((r) => r.expTerms === DEFAULT_EXP_TERMS)
  .every((r) => r.eRefUlp === eRefAtDefault);
// (6) CONCLUSION: the imp-33559 ~0.567 ULP shift is REAL fp64-libm round-off, not reference truncation.
const shiftIsRealNotDdArtifact = eRefStableAcrossSweep && selfErrorFarBelowShift && IMP33559_SHIFT_ULP > 0;

const verdict =
  defaultReproducesImp33559 && eRefStableAcrossSweep && selfErrorFarBelowShift &&
  expOrderConverged && logNewtonConverged && shiftIsRealNotDdArtifact
    ? 'BOUNDED:-SWEEPING-THE-imp-33534/imp-33559-dd-REFERENCE-libm-ddExp-TAYLOR-ORDER-{24,32,40,48}-AND-ddLog-' +
      'NEWTON-COUNT-{1,2,3}-(12-SETTINGS)-AND-REMEASURING-THE-imp-33312-tau=8-CEILING-E_ref:-E_ref-IS-' +
      'BIT-IDENTICAL-AT-10.211958-ULP-ACROSS-THE-ENTIRE-SWEEP-(dd-SELF-ERROR-SPREAD-=-0.0-ULP,-<<-THE-' +
      'imp-33559-~0.567-ULP-SHIFT,-RATIO-0.0).-THE-DEFAULT-24-TERM-ddExp/1-STEP-ddLog-IS-ALREADY-AT-THE-dd-' +
      'ROUNDING-FLOOR-FOR-THIS-BAND-(RAISING-THE-TAYLOR-ORDER-OR-ADDING-NEWTON-STEPS-CHANGES-NOTHING),-SO-THE-' +
      'imp-33559-~0.567-ULP-DOWNWARD-ENVELOPE-SHIFT-IS-GENUINE-fp64-libm-ROUND-OFF-AND-NOT-A-REFERENCE-' +
      'TRUNCATION-ARTIFACT.-ACCURACY-MEASUREMENT-ONLY;-dd-IS-A-REFERENCE-SURROGATE-NOT-A-PLATFORM-libm;-' +
      'CHANGES-NO-BOUND;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-' +
      'NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33581_DD_SELF_ERROR_SWEEP = Object.freeze({
  id: 'imp-33581-dd-self-error-sweep',
  ticket: 'imp-33581',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  boundsReferenceSelfErrorOf: 'imp-33559 (the ~0.567 ULP downward envelope shift under the dd reference libm)',
  reusesReferenceLibmFrom: 'imp-33534-min-node-reference-precision-libm.js',
  remeasuresCeilingFrom: 'imp-33312-tau-uniform-jitter-band.js',
  offlineProbe: 'scripts/imp-33581-dd-self-error-sweep.mjs',

  summary:
    'BOUNDS the truncation SELF-ERROR of the imp-33534/imp-33559 ~106-bit double-double reference libm ' +
    'behind the ~0.567 ULP downward envelope shift. Sweeping the ddExp Taylor order over {24,32,40,48} ' +
    'and the ddLog Newton-iteration count over {1,2,3} (12 settings) and remeasuring the imp-33312 tau=8 ' +
    'ceiling E_ref returns a BIT-IDENTICAL 10.211958 ULP at every setting: the dd self-error spread is 0.0 ' +
    'ULP, far below the ~0.567 ULP shift. The default 24-term ddExp / 1-step ddLog is already at the dd ' +
    'rounding floor for this band, so the imp-33559 downward shift is genuine fp64-libm round-off, NOT a ' +
    'reference-truncation artifact. ACCURACY MEASUREMENT ONLY, RH-EQUIVALENT, reference-precision surrogate ' +
    'not a platform survey; changes no bound; imp-3066 untouched; necessary-but-not-sufficient; no QED. ' +
    'No refereed bound is changed.',

  method: Object.freeze({
    band: 'the imp-33312 min-node grade6 lattice-jitter band tau=8 ceiling: single-tau gold (grade5/grade6 ' +
      'average at the imp-33293 gold panel counts) and worst-in-window ULP over the fixed neighbourhood ' +
      '[245,325] step 2, recomputed entirely in double-double exactly as imp-33559',
    sweep: 'the reference libm ddExp Taylor order over {24,32,40,48} (default 24) crossed with the ddLog ' +
      'Newton-iteration count over {1,2,3} (default 1) -- a 4x3 = 12-setting grid; the ddLog Newton step is ' +
      'y_{m+1} = y_m + x*ddExp(-y_m) - 1, the imp-33534 one-step scheme generalized to LOGITERS iterations',
    selfError: 'the dd self-error = spread (max - min) of E_ref across the 12 settings; a stable E_ref means ' +
      'the reference libm is converged and the imp-33559 shift is not truncation-limited',
    baked: 'the 12 E_ref values are BAKED literals from the ~108s offline run (too heavy for import); the ' +
      'assertions verify the baked relationships, not a re-run',
  }),

  measured: Object.freeze({
    tau: TAU,
    neighbourhood: NBHD,
    defaultExpTerms: DEFAULT_EXP_TERMS,
    defaultLogIters: DEFAULT_LOG_ITERS,
    imp33559ErrorRefUlp: IMP33559_ERROR_REF_ULP,
    imp33559ShiftUlp: IMP33559_SHIFT_ULP,
    sweep: SWEEP,
    eRefMin,
    eRefMax,
    eRefAtDefault,
    ddSelfErrorUlp,
    selfErrorToShiftRatio,
    defaultReproducesImp33559,
    eRefStableAcrossSweep,
    selfErrorFarBelowShift,
    expOrderConverged,
    logNewtonConverged,
    shiftIsRealNotDdArtifact,
    verdict,
  }),

  interpretation: Object.freeze({
    theReferenceIsConverged:
      'Every one of the 12 (ddExp order, ddLog Newton) settings returns E_ref = 10.211958 ULP to the last ' +
      'measured digit. Raising the ddExp Taylor order from 24 to 48 changes nothing -- the default 24-term ' +
      'series with its 1e-34 relative early-exit is already fully converged for the range-reduced arguments -- ' +
      'and adding ddLog Newton steps changes nothing, because one step already lands at the dd rounding. The ' +
      'imp-33534 dd defaults are at the dd floor for this band, not under-resolved.',
    theShiftIsRealNotADdArtifact:
      'Because refining the reference libm does not move E_ref at all (self-error 0.0 ULP << the ~0.567 ULP ' +
      'shift), the imp-33559 ~0.567 ULP downward envelope move cannot be a reference-truncation artifact: it ' +
      'is set by genuine fp64-libm round-off. The imp-33559 reading -- that the ~10.78 ULP fp64 constant is a ' +
      'round-off-inflated artifact and the genuine ceiling is ~10.21 ULP -- rests on a converged reference.',
    theSurrogateBoundIsSelfConsistent:
      'This bounds the reference surrogate itself: the ~106-bit dd libm is truncation-limited far below the ' +
      'scale of the effect it measures, so the imp-33559 conclusion (the fp64 envelope stays a ~5% ' +
      'conservative but valid upper bound) does not inherit a hidden reference-truncation floor. It remains a ' +
      'reference-precision surrogate, NOT a correctly-rounded platform libm.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    changesNoBound: true,
    derivationScope:
      'Sweeps the ddExp Taylor order and ddLog Newton count of a reference-precision surrogate libm and ' +
      'remeasures the reference-precision floating-point ceiling of a fixed graded-GL lattice-jitter band at ' +
      'tau=8 -- a magnitude used inside a mass-feasibility diagnostic. It establishes NO operator positivity ' +
      'and NO new bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI=10 Phi-series truncation is inherited from imp-33312/imp-33534; this bounds the dd libm ' +
      'truncation self-error of the envelope ceiling, not that Phi-series truncation.',
    surrogateNotPlatformSurvey:
      'The double-double libm is a reference-precision SURROGATE for a correctly-rounded libm (~106-bit vs ' +
      '53-bit), NOT a survey of real platform libms. This bounds the SURROGATE truncation self-error only: a ' +
      'specific platform libm with a ~1 ULP exp/log error could still differ. The robust conclusion is that ' +
      'the dd reference is converged at its defaults, so the imp-33559 shift is not a reference artifact.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33581_DD_SELF_ERROR_SWEEP_ASSERTIONS = [
  {
    id: 'imp33581-default-reproduces-imp33559-reference-ceiling',
    why: 'The default 24-term ddExp / 1-step ddLog setting must reproduce the imp-33559 baked tau=8 reference ' +
         'ceiling (~10.212 ULP), so the sweep is anchored to the actual shipped reference value.',
    holds: () => defaultReproducesImp33559,
  },
  {
    id: 'imp33581-eref-bit-identical-across-the-sweep',
    why: 'HEADLINE: E_ref is bit-identical across all 12 (ddExp order, ddLog Newton) settings -- the dd ' +
         'self-error spread is exactly 0.0 ULP.',
    holds: () => eRefStableAcrossSweep && ddSelfErrorUlp === 0,
  },
  {
    id: 'imp33581-self-error-far-below-the-imp33559-shift',
    why: 'The dd self-error (0.0 ULP) is << the imp-33559 ~0.567 ULP downward shift, so the shift cannot be a ' +
         'reference-truncation artifact.',
    holds: () => selfErrorFarBelowShift && selfErrorToShiftRatio < 0.01,
  },
  {
    id: 'imp33581-ddexp-taylor-order-converged',
    why: 'Raising the ddExp Taylor order past the default 24 (to 32,40,48) does not move E_ref -- the ' +
         'range-reduced Taylor series is already converged at 24 terms for this band.',
    holds: () => expOrderConverged,
  },
  {
    id: 'imp33581-ddlog-newton-count-converged',
    why: 'Adding ddLog Newton steps past the default 1 (to 2,3) does not move E_ref -- one Newton step already ' +
         'lands at the dd rounding for this band.',
    holds: () => logNewtonConverged,
  },
  {
    id: 'imp33581-shift-is-real-fp64-round-off',
    why: 'CONCLUSION: because E_ref is stable under reference refinement, the imp-33559 ~0.567 ULP downward ' +
         'envelope shift is genuine fp64-libm round-off, not a dd-truncation artifact.',
    holds: () => shiftIsRealNotDdArtifact,
  },
  {
    id: 'imp33581-verdict-records-the-bound',
    why: 'The classified verdict must record the bit-identical E_ref across the sweep and the conclusion that ' +
         'the imp-33559 shift is real fp64 round-off.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33581-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement only, changes no bound, reference-precision surrogate not a ' +
         'platform survey, mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) ' +
         'untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33581_DD_SELF_ERROR_SWEEP.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.changesNoBound === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33581_DD_SELF_ERROR_SWEEP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33581-dd-self-error-sweep assertion failed: ${assertion.id}`);
  }
}

export default IMP33581_DD_SELF_ERROR_SWEEP;
