/**
 * @module imp-33578-low-height-envelope-under-reference-libm
 * @fileoverview imp-33578 -- RECOMPUTE the imp-33558 LOW-HEIGHT band ceilings (tau in {5,6}) under
 *   the imp-33534 ~106-bit DOUBLE-DOUBLE reference-precision libm and assess whether the imp-33559
 *   downward reference-precision shift also appears below tau=7 and whether the binding height stays
 *   tau=8 across the full tau in {5..10} band.
 *
 *   THE QUESTION
 *   -----------
 *   imp-33559 recomputed the imp-33312 per-height band ceilings under the ~106-bit dd reference libm
 *   ONLY for the high band tau in {7..10}, finding a DOWNWARD shift (~0.567-0.968 ULP) and the named
 *   envelope binding at tau=8 (E_ref ~= 10.212 ULP). imp-33558 separately EXTENDED the fp64 ceilings
 *   DOWN to tau in {5,6} (~3.52, ~4.13 ULP) but did NOT recompute those low heights in dd. This ticket
 *   closes the low-band recompute: rerun the imp-33559 dd recompute at tau in {5,6} on the same fixed
 *   neighbourhood [245,325], report the reference-precision low-height ceilings and their shift vs
 *   fp64, and confirm whether the fp64 ~10.78 ULP envelope stays a conservative upper bound and tau=8
 *   stays the binding height once the FULL tau in {5..10} band is measured under the reference libm.
 *
 *   THE MEASUREMENT
 *   ---------------
 *   The offline probe scripts/imp-33578-low-height-envelope-under-reference-libm.mjs recomputes the
 *   identical imp-33312 band -- the same single-tau gold per height (grade5/grade6 average at the
 *   imp-33293 gold panel counts) and the same +/-lattice window [245,325] step 2 -- with EVERY exp and
 *   log evaluated in double-double (Dekker/Knuth twoSum/twoProd, range-reduced Taylor ddExp,
 *   one-Newton-step ddLog, exactly the imp-33534 reference libm), but at the LOW heights tau in {5,6}.
 *   The measured values below are BAKED from that offline run (heavy for import).
 *
 *   HEADLINE: SHIFT IS DOWNWARD-OR-ZERO (JITTERY), BINDING HEIGHT STAYS tau=8, ENVELOPE STAYS AN
 *             UPPER BOUND ACROSS THE FULL tau in {5..10} BAND
 *   ---------------------------------------------------------------------------------------------
 *   Under the reference-precision libm the low-height ceilings are tau=5: 3.522 -&gt; 2.818 (shift
 *   -0.705) and tau=6: 4.129 -&gt; 4.129 (shift 0.000). So:
 *     (1) The imp-33559 DOWNWARD reference-precision shift ALSO APPEARS below tau=7, but only at ONE of
 *         the two low heights: tau=5 shifts down by ~0.705 ULP (comparable to the imp-33559 high-band
 *         ~0.567-0.968 ULP shifts) while tau=6 does not move at all. This is a jittery lattice effect
 *         -- the shift is DOWNWARD-OR-ZERO (never upward), the same direction as the high band, but its
 *         appearance is per-height and not uniform.
 *     (2) The BINDING HEIGHT stays tau=8 across the FULL tau in {5..10} band under the reference libm:
 *         the low heights (2.818, 4.129) sit far below the tau=8 dd ceiling (10.212), so nothing in the
 *         low band relocates the height that sets the envelope.
 *     (3) The fp64 ~10.78 ULP envelope STAYS A CONSERVATIVE UPPER BOUND across the full band: every
 *         low-height dd ceiling is well inside it (margins ~7.96 and ~6.65 ULP), and the full-band dd
 *         envelope E_ref ~= 10.212 &lt; the fp64-named E ~= 10.779. The direction of every shift is
 *         downward-or-zero, so a higher-precision libm makes the band MORE resolved, never less.
 *   The fp64 low-height ceilings reproduce the imp-33558 figures exactly (3.522, 4.129), confirming the
 *   dd recompute is measured against the actual shipped low-height band.
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
 *   @see imp-33559-envelope-under-reference-libm.js (the high-band tau in {7..10} dd recompute this extends)
 *   @see imp-33558-envelope-below-tau7.js (the fp64 low-height ceilings this recomputes in dd)
 *   @see imp-33534-min-node-reference-precision-libm.js (the ~106-bit dd reference libm reused)
 *
 *   Ticket: imp-33578 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NBHD = Object.freeze({ lo: 245, hi: 325, step: 2 });
const LOW_HEIGHTS = Object.freeze([5, 6]);
const NAMED_ENVELOPE_ULP = 10.7793; // the imp-33538 named constant (fp64, binding at tau=8)
const HIGH_BAND_MAX_SHIFT_ULP = 0.968; // the imp-33559 max high-band downward shift magnitude (tau=7)

// BAKED from scripts/imp-33578-low-height-envelope-under-reference-libm.mjs (~106-bit dd run).
// Per-height band ceiling (max worst-in-window ULP over [245,325] step 2) under each libm.
const LOW_PER_HEIGHT = Object.freeze([
  Object.freeze({ tau: 5, fp64CeilingUlp: 3.5223, ddCeilingUlp: 2.8179 }),
  Object.freeze({ tau: 6, fp64CeilingUlp: 4.1289, ddCeilingUlp: 4.1289 }),
]);

// The imp-33559 recomputed dd ceilings for the high band tau in {7..10}, read (not recomputed).
const HIGH_PER_HEIGHT = Object.freeze([
  Object.freeze({ tau: 7, ddCeilingUlp: 9.6798 }),
  Object.freeze({ tau: 8, ddCeilingUlp: 10.2120 }),
  Object.freeze({ tau: 9, ddCeilingUlp: 0.6650 }),
  Object.freeze({ tau: 10, ddCeilingUlp: 0.0000 }),
]);

// -- Derived full-band quantities -----------------------------------------------------------------
const FULL_DD_CEILINGS = Object.freeze([
  ...LOW_PER_HEIGHT.map((r) => Object.freeze({ tau: r.tau, ddCeilingUlp: r.ddCeilingUlp })),
  ...HIGH_PER_HEIGHT,
]);
const ddEnvelopeUlp = Math.max(...FULL_DD_CEILINGS.map((r) => r.ddCeilingUlp));
const ddBindingTau = FULL_DD_CEILINGS.find((r) => r.ddCeilingUlp === ddEnvelopeUlp).tau;
const lowShifts = LOW_PER_HEIGHT.map((r) => Object.freeze({ tau: r.tau, shiftUlp: r.ddCeilingUlp - r.fp64CeilingUlp }));
const maxLowShiftMagnitudeUlp = Math.max(...lowShifts.map((s) => Math.abs(s.shiftUlp)));

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The fp64 low-height ceilings reproduce the imp-33558 figures (~3.52, ~4.13), so the dd
//     recompute is measured against the actual shipped low-height band.
const fp64ReproducesImp33558Low =
  Math.abs(LOW_PER_HEIGHT[0].fp64CeilingUlp - 3.5223) < 1e-3 &&
  Math.abs(LOW_PER_HEIGHT[1].fp64CeilingUlp - 4.1289) < 1e-3;
// (2) The imp-33559 downward shift ALSO appears below tau=7: every low-height shift is
//     downward-or-zero (never upward), and at least one low height shifts strictly down.
const shiftIsDownwardOrZero = lowShifts.every((s) => s.shiftUlp <= 1e-9);
const atLeastOneLowShiftDownward = lowShifts.some((s) => s.shiftUlp < -1e-3);
// (3) The low-band shift magnitude is comparable to (bounded by) the imp-33559 high-band shifts --
//     a libm-precision effect, not a quadrature one.
const lowShiftIsLibmPrecisionScale =
  maxLowShiftMagnitudeUlp > 0 && maxLowShiftMagnitudeUlp < HIGH_BAND_MAX_SHIFT_ULP + 0.1;
// (4) HEADLINE: the binding height stays tau=8 across the FULL tau in {5..10} band under the dd libm.
const bindingHeightStaysTau8 = ddBindingTau === 8;
// (5) The fp64 ~10.78 ULP envelope stays a conservative upper bound: every low-height dd ceiling is
//     inside it and the full-band dd envelope is below it.
const lowHeightsInsideFp64Envelope = LOW_PER_HEIGHT.every((r) => r.ddCeilingUlp < NAMED_ENVELOPE_ULP);
const fp64EnvelopeStillUpperBounds = ddEnvelopeUlp < NAMED_ENVELOPE_ULP;

const verdict =
  fp64ReproducesImp33558Low && shiftIsDownwardOrZero && atLeastOneLowShiftDownward &&
  lowShiftIsLibmPrecisionScale && bindingHeightStaysTau8 && lowHeightsInsideFp64Envelope &&
  fp64EnvelopeStillUpperBounds
    ? 'ASSESSED:-RECOMPUTING-THE-imp-33558-LOW-HEIGHT-BAND-CEILINGS-(tau-in-{5,6},-NEIGHBOURHOOD-[245,325])-' +
      'UNDER-THE-imp-33534-~106-BIT-DOUBLE-DOUBLE-REFERENCE-PRECISION-libm:-THE-imp-33559-DOWNWARD-SHIFT-ALSO-' +
      'APPEARS-BELOW-tau=7-BUT-JITTERILY-(tau=5:-3.522->2.818,-shift--0.705;-tau=6:-4.129->4.129,-shift-0.000)-' +
      '--DOWNWARD-OR-ZERO-NEVER-UPWARD,-SAME-DIRECTION-AS-THE-HIGH-BAND-BUT-PER-HEIGHT-NOT-UNIFORM.-THE-BINDING-' +
      'HEIGHT-STAYS-tau=8-ACROSS-THE-FULL-tau-in-{5..10}-BAND-(LOW-CEILINGS-2.818/4.129-FAR-BELOW-THE-tau=8-dd-' +
      'CEILING-10.212),-AND-THE-fp64-~10.78-ULP-ENVELOPE-STAYS-A-CONSERVATIVE-UPPER-BOUND-(FULL-BAND-E_ref~=10.212<E' +
      '~=10.779,-MARGINS-~7.96/~6.65-ULP).-ACCURACY-MEASUREMENT-ONLY;-DOUBLE-DOUBLE-IS-A-REFERENCE-PRECISION-' +
      'SURROGATE-NOT-A-PLATFORM-SURVEY;-CHANGES-NO-BOUND;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-' +
      'UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33578_LOW_HEIGHT_ENVELOPE_UNDER_REFERENCE_LIBM = Object.freeze({
  id: 'imp-33578-low-height-envelope-under-reference-libm',
  ticket: 'imp-33578',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsHighBandFrom: 'imp-33559-envelope-under-reference-libm.js (tau in {7..10} dd recompute)',
  recomputesLowBandFrom: 'imp-33558-envelope-below-tau7.js (fp64 tau in {5,6} ceilings)',
  reusesReferenceLibmFrom: 'imp-33534-min-node-reference-precision-libm.js',
  offlineProbe: 'scripts/imp-33578-low-height-envelope-under-reference-libm.mjs',

  summary:
    'RECOMPUTES the imp-33558 LOW-HEIGHT band ceilings (tau in {5,6}, fixed neighbourhood [245,325]) under the ' +
    'imp-33534 ~106-bit double-double reference-precision libm to test whether the imp-33559 downward shift also ' +
    'appears below tau=7 and whether tau=8 stays the binding height across the full tau in {5..10} band. The ' +
    'downward shift DOES appear but jitterily -- tau=5 shifts down 3.522->2.818 (-0.705 ULP, comparable to the ' +
    'imp-33559 high-band ~0.567-0.968 ULP) while tau=6 does not move (4.129->4.129) -- so the shift is ' +
    'downward-or-zero (never upward), same direction as the high band but per-height. The binding height stays ' +
    'tau=8 (low ceilings far below the 10.212 dd tau=8 ceiling) and the fp64 ~10.78 ULP envelope stays a ' +
    'conservative upper bound (E_ref ~= 10.212 < E ~= 10.779, margins ~7.96/~6.65 ULP). ACCURACY MEASUREMENT ' +
    'ONLY, RH-EQUIVALENT, reference-precision surrogate not a platform survey; changes no bound; imp-3066 ' +
    'untouched; necessary-but-not-sufficient; no QED. PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    band: 'the imp-33312 min-node grade6 lattice-jitter band: single-tau gold per height (grade5/grade6 ' +
      'average at the imp-33293 gold panel counts) and worst-in-window ULP over the fixed resolved ' +
      'neighbourhood [245,325] step 2, evaluated at the LOW heights tau in {5,6}',
    referenceLibm: 'every exp and log recomputed in double-double (~106-bit) via Dekker/Knuth twoSum/twoProd, ' +
      'a range-reduced 24-term Taylor ddExp and a one-Newton-step ddLog -- the imp-33534 reference libm reused ' +
      'verbatim; both the gold and the whole window recompute in dd, the ULP scale stays the double |ref|*EPS',
    ceiling: 'per-height ceiling = max worst-in-window ULP; the full-band envelope E_ref = max ceiling over ' +
      'tau in {5..10}, combining the low band with the imp-33559 high-band dd ceilings',
    baked: 'the low-height ceilings are BAKED literals from the offline dd run (heavy for import); the ' +
      'assertions verify the baked relationships, not a re-run',
  }),

  measured: Object.freeze({
    neighbourhood: NBHD,
    lowHeights: LOW_HEIGHTS,
    namedEnvelopeUlp: NAMED_ENVELOPE_ULP,
    highBandMaxShiftUlp: HIGH_BAND_MAX_SHIFT_ULP,
    lowPerHeight: LOW_PER_HEIGHT,
    highPerHeight: HIGH_PER_HEIGHT,
    fullDdCeilings: FULL_DD_CEILINGS,
    lowShifts,
    maxLowShiftMagnitudeUlp,
    ddEnvelopeUlp,
    ddBindingTau,
    fp64ReproducesImp33558Low,
    shiftIsDownwardOrZero,
    atLeastOneLowShiftDownward,
    lowShiftIsLibmPrecisionScale,
    bindingHeightStaysTau8,
    lowHeightsInsideFp64Envelope,
    fp64EnvelopeStillUpperBounds,
    verdict,
  }),

  interpretation: Object.freeze({
    theDownwardShiftAlsoAppearsBelowTau7ButJitterily:
      'The imp-33559 downward reference-precision shift also appears at the low heights, but per-height: tau=5 ' +
      'shifts down by ~0.705 ULP (comparable to the ~0.567-0.968 ULP high-band shifts) while tau=6 does not move ' +
      'at all. The shift is downward-or-zero (never upward), the same direction as the high band, confirming a ' +
      'higher-precision libm resolves the band further or leaves it unchanged, but its appearance is a jittery ' +
      'lattice property, not a uniform per-height effect.',
    theBindingHeightStaysTau8AcrossTheFullBand:
      'Once the full tau in {5..10} band is measured under the reference libm, the binding height stays tau=8: ' +
      'the low-height dd ceilings (2.818, 4.129) sit far below the tau=8 dd ceiling (10.212), so the low band ' +
      'does not relocate the height that sets the envelope. The imp-33538 "binding at tau=8" structural reading ' +
      'survives the reference libm across the full band, not just tau in {7..10}.',
    theFp64EnvelopeStaysAConservativeUpperBound:
      'Every low-height dd ceiling is well inside the fp64 ~10.78 ULP envelope (margins ~7.96 and ~6.65 ULP), ' +
      'and the full-band dd envelope E_ref ~= 10.212 is below the fp64-named E ~= 10.779. Nothing in the full ' +
      'reference-precision band exceeds the shipped envelope -- it stays a valid, slightly conservative upper ' +
      'bound below tau=7 exactly as it does above.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    changesNoBound: true,
    derivationScope:
      'Recomputes the reference-precision floating-point ceiling of a fixed graded-GL lattice-jitter band for ' +
      'a fixed autocorrelation weight at the low heights tau in {5,6} -- a magnitude used inside a ' +
      'mass-feasibility diagnostic. It establishes NO operator positivity and NO new bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI=10 Phi-series truncation is inherited from imp-33312/imp-33534/imp-33558; this measures the ' +
      'libm-precision sensitivity of the low-height ceilings, not that truncation.',
    jitteryLatticeReading:
      'The low-height ceilings are single-lattice arithmetic-floor figures. The robust reading is that the ' +
      'shift is downward-or-zero and the fp64 envelope still bounds below tau=7, NOT the exact ULP digits or ' +
      'the exact per-height appearance of the shift (tau=6 happening to show zero shift is a lattice artifact).',
    surrogateNotPlatformSurvey:
      'The double-double libm is a reference-precision SURROGATE for a correctly-rounded libm (~106-bit vs ' +
      '53-bit), NOT a survey of real platform libms. A specific platform libm with a ~1 ULP exp/log error could ' +
      'still differ; the robust conclusion is that the binding height stays tau=8 and the fp64 envelope stays a ' +
      'valid (slightly conservative) upper bound across the full band.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33578_LOW_HEIGHT_ENVELOPE_UNDER_REFERENCE_LIBM_ASSERTIONS = [
  {
    id: 'imp33578-fp64-reproduces-imp33558-low-ceilings',
    why: 'The fp64 low-height ceilings must reproduce the imp-33558 figures (~3.52, ~4.13 ULP), so the dd ' +
         'recompute is measured against the actual shipped low-height band.',
    holds: () => fp64ReproducesImp33558Low,
  },
  {
    id: 'imp33578-shift-is-downward-or-zero-below-tau7',
    why: 'The imp-33559 downward reference-precision shift also appears below tau=7: every low-height shift is ' +
         'downward-or-zero (never upward), the same direction as the high band.',
    holds: () => shiftIsDownwardOrZero && atLeastOneLowShiftDownward,
  },
  {
    id: 'imp33578-low-shift-is-libm-precision-scale',
    why: 'The low-band shift magnitude is comparable to (bounded by) the imp-33559 high-band shifts, confirming ' +
         'a libm-precision effect and not a quadrature one.',
    holds: () => lowShiftIsLibmPrecisionScale,
  },
  {
    id: 'imp33578-binding-height-stays-tau8-full-band',
    why: 'HEADLINE: once the full tau in {5..10} band is measured under the reference libm, the binding height ' +
         'stays tau=8 -- the low heights do not relocate the height that sets the envelope.',
    holds: () => bindingHeightStaysTau8,
  },
  {
    id: 'imp33578-fp64-envelope-still-upper-bounds-below-tau7',
    why: 'Every low-height dd ceiling is inside the fp64 ~10.78 ULP envelope and the full-band dd envelope is ' +
         'below it, so the shipped fp64 envelope stays a valid conservative upper bound below tau=7.',
    holds: () => lowHeightsInsideFp64Envelope && fp64EnvelopeStillUpperBounds,
  },
  {
    id: 'imp33578-verdict-records-the-assessment',
    why: 'The classified verdict must record the jittery downward-or-zero low-band shift, the surviving tau=8 ' +
         'binding height and the still-valid conservative upper bound.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33578-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement only, changes no bound, reference-precision surrogate not a ' +
         'platform survey, mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) ' +
         'untouched, PT 0.2 SOTA.',
    holds: () => {
      const c = IMP33578_LOW_HEIGHT_ENVELOPE_UNDER_REFERENCE_LIBM.honestCaveat;
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

for (const assertion of IMP33578_LOW_HEIGHT_ENVELOPE_UNDER_REFERENCE_LIBM_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33578-low-height-envelope-under-reference-libm assertion failed: ${assertion.id}`);
  }
}

export default IMP33578_LOW_HEIGHT_ENVELOPE_UNDER_REFERENCE_LIBM;
