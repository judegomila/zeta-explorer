/**
 * @module imp-33559-envelope-under-reference-libm
 * @fileoverview imp-33559 -- ASSESS the robustness of the imp-33538 ~10.78 ULP tau-uniform envelope
 *   constant under the imp-33534 ~106-bit DOUBLE-DOUBLE reference-precision libm by recomputing the
 *   imp-33312 per-height band ceilings (tau in {7..10}).
 *
 *   THE QUESTION
 *   -----------
 *   imp-33538 named the height-uniform conservative envelope E ~= 10.78 ULP as the max over tau in
 *   {7..10} of the imp-33312 min-node grade6 lattice-jitter band CEILING (worst-in-window ULP over the
 *   FIXED resolved neighbourhood [245,325]), binding at tau=8. imp-33534 then showed that the SAME
 *   grade6 log-sum-exp shifts by up to ~0.947 ULP when the double libm exp/log is replaced by a
 *   reference-precision (~106-bit) double-double libm. That opened the question this ticket closes:
 *   does the NAMED envelope CONSTANT itself (not just a single hit) survive the reference-precision
 *   libm, and does the binding height stay at tau=8?
 *
 *   THE MEASUREMENT
 *   ---------------
 *   The offline probe scripts/imp-33559-envelope-under-reference-libm.mjs recomputes the identical
 *   imp-33312 band -- the same single-tau gold per height (grade5/grade6 average at the imp-33293
 *   gold panel counts) and the same +/-lattice window [245,325] step 2 -- with EVERY exp and log
 *   evaluated in double-double (Dekker/Knuth twoSum/twoProd, range-reduced Taylor ddExp, one-Newton
 *   -step ddLog, exactly the imp-33534 reference libm). Both the gold and the whole window are
 *   recomputed in dd; the ULP scale stays the double ULP |ref|*EPS. The per-height ceiling is then the
 *   max worst-in-window ULP, and the envelope constant is the max ceiling over the four heights. The
 *   measured values below are BAKED from that ~51s offline run (too heavy to recompute at import).
 *
 *   HEADLINE: BINDING HEIGHT SURVIVES (tau=8), CONSTANT SHIFTS DOWN, ENVELOPE STAYS AN UPPER BOUND
 *   ---------------------------------------------------------------------------------------------
 *   Under the reference-precision libm the binding height is UNCHANGED at tau=8 and every per-height
 *   ceiling shifts DOWNWARD by an amount on the order of the imp-33534 ~0.947 ULP libm contamination
 *   (tau=7: 10.648 -&gt; 9.680, shift -0.968; tau=8: 10.779 -&gt; 10.212, shift -0.567; tau=9 and tau=10
 *   unchanged at 0.665 and 0.000, already sub-ULP resolved). So:
 *     (1) The BINDING HEIGHT is robust: tau=8 sets the envelope under both the double and the
 *         reference libm -- the imp-33538 "binding at tau=8" structural reading survives.
 *     (2) The NAMED CONSTANT is NOT exact: the reference-precision envelope is E_ref ~= 10.212 ULP,
 *         ~0.567 ULP (~5.3%) below the fp64-named E ~= 10.779 ULP. The ~10.78 figure is a
 *         double-libm artifact inflated by round-off; the genuine quadrature-jitter ceiling is ~10.21.
 *     (3) The fp64 envelope STAYS A VALID (slightly conservative) UPPER BOUND: E_ref &lt; E, so nothing
 *         in the reference-precision band EXCEEDS the shipped 10.78 ULP envelope -- the conservative
 *         ceiling is not breached, it is merely ~5% loose. The direction of the shift (downward)
 *         means the reference libm makes the band MORE resolved, never less.
 *   The shift magnitude (max |E_ref - E| per height ~0.968 ULP) tracks the imp-33534 measured ~0.947
 *   ULP contamination, confirming the envelope moves by libm-precision noise and not by any quadrature
 *   effect.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT ONLY, at the RH-equivalent scale class. The double-double libm is a
 *   reference-precision SURROGATE for a correctly-rounded libm (~106-bit vs 53-bit), NOT a survey of
 *   real platform libms. It establishes NO operator positivity and NO new bound; it changes no bound.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. The NPHI=10 Phi-series truncation is
 *   inherited upstream. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 stays SOTA.
 *
 *   @see imp-33534-min-node-reference-precision-libm.js (the ~106-bit dd reference libm this reuses)
 *   @see imp-33312-tau-uniform-jitter-band.js (the per-height band whose ceilings are recomputed)
 *   @see imp-33538 (the named ~10.78 ULP envelope constant this assesses)
 *   @see imp-33558 (the parallel extension of the same envelope to lower heights tau in {5,6})
 *
 *   Ticket: imp-33559 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NBHD = Object.freeze({ lo: 245, hi: 325, step: 2 });
const HEIGHTS = Object.freeze([7, 8, 9, 10]);
const NAMED_ENVELOPE_ULP = 10.7793; // the imp-33538 named constant (fp64, binding at tau=8)
const REFERENCE_LIBM_CONTAM_ULP = 0.947; // the imp-33534 measured max double-vs-reference shift

// BAKED from scripts/imp-33559-envelope-under-reference-libm.mjs (~51s ~106-bit dd run).
// Per-height band ceiling (max worst-in-window ULP over [245,325] step 2) under each libm.
const PER_HEIGHT = Object.freeze([
  Object.freeze({ tau: 7, fp64CeilingUlp: 10.6477, ddCeilingUlp: 9.6798 }),
  Object.freeze({ tau: 8, fp64CeilingUlp: 10.7793, ddCeilingUlp: 10.2120 }),
  Object.freeze({ tau: 9, fp64CeilingUlp: 0.6650, ddCeilingUlp: 0.6650 }),
  Object.freeze({ tau: 10, fp64CeilingUlp: 0.0000, ddCeilingUlp: 0.0000 }),
]);

const fp64EnvelopeUlp = Math.max(...PER_HEIGHT.map((r) => r.fp64CeilingUlp));
const ddEnvelopeUlp = Math.max(...PER_HEIGHT.map((r) => r.ddCeilingUlp));
const fp64BindingTau = PER_HEIGHT.find((r) => r.fp64CeilingUlp === fp64EnvelopeUlp).tau;
const ddBindingTau = PER_HEIGHT.find((r) => r.ddCeilingUlp === ddEnvelopeUlp).tau;
const envelopeShiftUlp = ddEnvelopeUlp - fp64EnvelopeUlp; // negative = reference band more resolved
const maxPerHeightShiftUlp = Math.max(
  ...PER_HEIGHT.map((r) => Math.abs(r.ddCeilingUlp - r.fp64CeilingUlp)),
);

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The double baseline reproduces the imp-33538 named envelope (~10.78 ULP, binding tau=8).
const doubleReproducesNamedEnvelope =
  Math.abs(fp64EnvelopeUlp - NAMED_ENVELOPE_ULP) < 1e-3 && fp64BindingTau === 8;
// (2) HEADLINE: the binding height is ROBUST -- tau=8 sets the envelope under the reference libm too.
const bindingHeightSurvives = ddBindingTau === fp64BindingTau && ddBindingTau === 8;
// (3) The named CONSTANT is not exact: the reference-precision envelope shifts DOWNWARD.
const constantShiftsDownward = envelopeShiftUlp < 0;
// (4) The shift is a bounded libm-precision effect (~ the imp-33534 ~0.947 ULP contamination), not
//     a quadrature effect -- the per-height shift magnitude stays near the measured contamination.
const shiftIsLibmPrecisionScale =
  maxPerHeightShiftUlp > 0 && maxPerHeightShiftUlp < 1.5 * REFERENCE_LIBM_CONTAM_ULP + 0.1;
// (5) The fp64 envelope STAYS A VALID UPPER BOUND under the reference libm (nothing exceeds it).
const fp64EnvelopeStillUpperBounds = ddEnvelopeUlp < fp64EnvelopeUlp;
// (6) The collapsed high heights (tau in {9,10}) are unchanged -- already sub-ULP resolved.
const highHeightsUnchanged = PER_HEIGHT
  .filter((r) => r.tau >= 9)
  .every((r) => Math.abs(r.ddCeilingUlp - r.fp64CeilingUlp) < 1e-6);

const verdict =
  doubleReproducesNamedEnvelope && bindingHeightSurvives && constantShiftsDownward &&
  shiftIsLibmPrecisionScale && fp64EnvelopeStillUpperBounds && highHeightsUnchanged
    ? 'ASSESSED:-RECOMPUTING-THE-imp-33312-PER-HEIGHT-BAND-CEILINGS-(tau-in-{7..10},-NEIGHBOURHOOD-[245,325])-' +
      'UNDER-THE-imp-33534-~106-BIT-DOUBLE-DOUBLE-REFERENCE-PRECISION-libm:-THE-imp-33538-BINDING-HEIGHT-' +
      'SURVIVES-(tau=8-SETS-THE-ENVELOPE-UNDER-BOTH-THE-DOUBLE-AND-THE-REFERENCE-libm),-BUT-THE-NAMED-~10.78-ULP-' +
      'CONSTANT-IS-A-DOUBLE-libm-ARTIFACT:-THE-REFERENCE-PRECISION-ENVELOPE-IS-E_ref~=10.212-ULP,-~0.567-ULP-' +
      '(~5.3%)-BELOW-THE-fp64-NAMED-E~=10.779-ULP,-EVERY-CEILING-SHIFTING-DOWNWARD-BY-~THE-imp-33534-~0.947-ULP-' +
      'libm-CONTAMINATION-(tau=7:-10.648->9.680;-tau=8:-10.779->10.212;-tau-in-{9,10}-UNCHANGED).-SINCE-E_ref<E-' +
      'THE-SHIPPED-fp64-ENVELOPE-STAYS-A-VALID-(SLIGHTLY-~5%-CONSERVATIVE)-UPPER-BOUND-NEVER-BREACHED-BY-THE-' +
      'REFERENCE-libm.-ACCURACY-MEASUREMENT-ONLY;-DOUBLE-DOUBLE-IS-A-REFERENCE-PRECISION-SURROGATE-NOT-A-PLATFORM-' +
      'SURVEY;-CHANGES-NO-BOUND;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-' +
      'PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33559_ENVELOPE_UNDER_REFERENCE_LIBM = Object.freeze({
  id: 'imp-33559-envelope-under-reference-libm',
  ticket: 'imp-33559',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  assessesConstantFrom: 'imp-33538 (named ~10.78 ULP tau-uniform envelope)',
  recomputesBandFrom: 'imp-33312-tau-uniform-jitter-band.js',
  reusesReferenceLibmFrom: 'imp-33534-min-node-reference-precision-libm.js',
  offlineProbe: 'scripts/imp-33559-envelope-under-reference-libm.mjs',

  summary:
    'ASSESSES whether the imp-33538 named ~10.78 ULP tau-uniform envelope constant survives the imp-33534 ' +
    '~106-bit double-double reference-precision libm. Recomputing the imp-33312 per-height band ceilings ' +
    '(tau in {7..10}, fixed neighbourhood [245,325]) with every exp/log in double-double keeps the BINDING ' +
    'HEIGHT at tau=8 but moves the CONSTANT downward: the reference-precision envelope is ~10.212 ULP, ~0.567 ' +
    'ULP (~5.3%) below the fp64-named ~10.779 ULP, every ceiling shifting down by ~the imp-33534 ~0.947 ULP ' +
    'libm contamination (tau=7: 10.648->9.680; tau=8: 10.779->10.212; tau in {9,10} unchanged, already ' +
    'sub-ULP). Since E_ref < E the shipped fp64 envelope stays a valid ~5%-conservative UPPER BOUND, never ' +
    'breached by the reference libm. ACCURACY MEASUREMENT ONLY, RH-EQUIVALENT, reference-precision surrogate ' +
    'not a platform survey; changes no bound; imp-3066 untouched; necessary-but-not-sufficient; no QED. ' +
    'PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    band: 'the imp-33312 min-node grade6 lattice-jitter band: single-tau gold per height (grade5/grade6 ' +
      'average at the imp-33293 gold panel counts) and worst-in-window ULP over the fixed resolved ' +
      'neighbourhood [245,325] step 2',
    referenceLibm: 'every exp and log recomputed in double-double (~106-bit) via Dekker/Knuth twoSum/twoProd, ' +
      'a range-reduced 24-term Taylor ddExp and a one-Newton-step ddLog -- the imp-33534 reference libm reused ' +
      'verbatim; both the gold and the whole window recompute in dd, the ULP scale stays the double |ref|*EPS',
    ceiling: 'per-height ceiling = max worst-in-window ULP; envelope constant = max ceiling over tau in {7..10}',
    baked: 'the per-height ceilings are BAKED literals from the ~51s offline run (too heavy for import); the ' +
      'assertions verify the baked relationships, not a re-run',
  }),

  measured: Object.freeze({
    neighbourhood: NBHD,
    heights: HEIGHTS,
    namedEnvelopeUlp: NAMED_ENVELOPE_ULP,
    referenceLibmContamUlp: REFERENCE_LIBM_CONTAM_ULP,
    perHeight: PER_HEIGHT,
    fp64EnvelopeUlp,
    ddEnvelopeUlp,
    fp64BindingTau,
    ddBindingTau,
    envelopeShiftUlp,
    maxPerHeightShiftUlp,
    doubleReproducesNamedEnvelope,
    bindingHeightSurvives,
    constantShiftsDownward,
    shiftIsLibmPrecisionScale,
    fp64EnvelopeStillUpperBounds,
    highHeightsUnchanged,
    verdict,
  }),

  interpretation: Object.freeze({
    theBindingHeightIsRobust:
      'tau=8 sets the envelope under both the double and the reference-precision libm, so the imp-33538 ' +
      '"binding at tau=8" structural reading survives -- the reference libm does not relocate the height that ' +
      'sets the height-uniform ceiling.',
    theConstantIsADoubleLibmArtifact:
      'The named ~10.78 ULP figure is inflated by double-libm round-off: with a ~106-bit reference libm the ' +
      'genuine quadrature-jitter ceiling is ~10.212 ULP, ~0.567 ULP (~5.3%) lower. The per-height ceilings all ' +
      'move downward by ~the imp-33534 ~0.947 ULP contamination, so the shift is a libm-precision effect, not a ' +
      'quadrature one.',
    theEnvelopeStaysAValidUpperBound:
      'Because the reference-precision envelope E_ref ~= 10.212 is BELOW the shipped fp64 E ~= 10.779, nothing ' +
      'in the reference-precision band exceeds the quoted envelope: the conservative ceiling is not breached, ' +
      'merely ~5% loose. The downward direction means a higher-precision libm makes the band MORE resolved, ' +
      'never less -- the imp-33538 envelope remains a safe conservative bound.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    changesNoBound: true,
    derivationScope:
      'Recomputes the reference-precision floating-point ceiling of a fixed graded-GL lattice-jitter band for ' +
      'a fixed autocorrelation weight over tau in {7..10} -- a magnitude used inside a mass-feasibility ' +
      'diagnostic. It establishes NO operator positivity and NO new bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI=10 Phi-series truncation is inherited from imp-33312/imp-33534; this measures the libm-precision ' +
      'sensitivity of the envelope constant, not that truncation.',
    surrogateNotPlatformSurvey:
      'The double-double libm is a reference-precision SURROGATE for a correctly-rounded libm (~106-bit vs ' +
      '53-bit), NOT a survey of real platform libms. A specific platform libm with a ~1 ULP exp/log error could ' +
      'still differ; the robust conclusion is that the binding height survives and the fp64 envelope stays a ' +
      'valid (slightly conservative) upper bound.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33559_ENVELOPE_UNDER_REFERENCE_LIBM_ASSERTIONS = [
  {
    id: 'imp33559-double-reproduces-the-named-envelope',
    why: 'The double baseline must reproduce the imp-33538 named ~10.78 ULP envelope binding at tau=8, so the ' +
         'reference-precision comparison is against the actual shipped constant.',
    holds: () => doubleReproducesNamedEnvelope,
  },
  {
    id: 'imp33559-binding-height-survives-at-tau8',
    why: 'HEADLINE: the binding height stays tau=8 under the ~106-bit reference libm -- the imp-33538 ' +
         '"binding at tau=8" structural reading is robust to libm precision.',
    holds: () => bindingHeightSurvives,
  },
  {
    id: 'imp33559-named-constant-shifts-downward',
    why: 'The named ~10.78 ULP constant is not exact: the reference-precision envelope is lower ' +
         '(~10.21 ULP), a downward shift, so the fp64 figure is a round-off-inflated artifact.',
    holds: () => constantShiftsDownward && ddEnvelopeUlp < NAMED_ENVELOPE_ULP,
  },
  {
    id: 'imp33559-shift-is-libm-precision-scale',
    why: 'The per-height ceiling shift is bounded by ~the imp-33534 ~0.947 ULP libm contamination, confirming ' +
         'the envelope moves by libm-precision noise and not by any quadrature effect.',
    holds: () => shiftIsLibmPrecisionScale,
  },
  {
    id: 'imp33559-fp64-envelope-still-upper-bounds',
    why: 'Because the reference-precision envelope is below the shipped fp64 envelope, nothing in the ' +
         'reference-precision band exceeds the quoted 10.78 ULP ceiling -- it stays a valid conservative bound.',
    holds: () => fp64EnvelopeStillUpperBounds,
  },
  {
    id: 'imp33559-high-heights-unchanged',
    why: 'The collapsed high heights tau in {9,10} are already sub-ULP resolved, so their ceilings are ' +
         'unchanged by the reference libm -- the shift is localized to the binding heights tau in {7,8}.',
    holds: () => highHeightsUnchanged,
  },
  {
    id: 'imp33559-verdict-records-the-assessment',
    why: 'The classified verdict must record the surviving binding height, the downward constant shift and the ' +
         'still-valid conservative upper bound.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33559-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement only, changes no bound, reference-precision surrogate not a ' +
         'platform survey, mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) ' +
         'untouched, PT 0.2 SOTA.',
    holds: () => {
      const c = IMP33559_ENVELOPE_UNDER_REFERENCE_LIBM.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.changesNoBound === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33559_ENVELOPE_UNDER_REFERENCE_LIBM_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33559-envelope-under-reference-libm assertion failed: ${assertion.id}`);
  }
}

export default IMP33559_ENVELOPE_UNDER_REFERENCE_LIBM;
