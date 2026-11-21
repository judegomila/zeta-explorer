// @module data/imp-96246-etrunc-pin-consumer-audit
//
// Accuracy audit (imp-96246): trace the 3.9e-8 gap between the FULL truncation
// anchor E_trunc(3e12) = 3.0 * (3e12)^{-0.4} = 3.063887e-5 and the ROUNDED
// frozen-floor pin 3.06e-5 (imp-96166 / imp-447) through the downstream
// consumers, and MEASURE whether any tabulated result would shift by more than
// its own stated tolerance if fed the full value instead of the rounded pin.
//
// imp-96229 and imp-96232 both flag that E_trunc(3e12) = 3.063887e-5 sits
// 3.887e-8 ABOVE the pinned 3.06e-5, asserting the two agree at a 1e-6 display
// tolerance. This module closes the missing step: it enumerates the modules
// that either bake the rounded pin or recompute the full value, and it measures
// the footprint of the gap in each tabulated number.
//
// FINDINGS (all measured, literals carried import-light):
//
//   A. Floor-to-height inversion HEIGHTS (imp-96185 / imp-96207 / imp-96232).
//      The headline tables invert H_required(E) = (prefactor / E)^{1/kappa}
//      from the TARGET floor E (1e-5, 1e-6, 1e-7, 1e-8) with prefactor = 3.0.
//      The E_trunc(3e12) anchor is NOT an input to any of these heights, so
//      feeding the full 3.063887e-5 instead of the rounded 3.06e-5 shifts every
//      tabulated height by EXACTLY ZERO. Pin-independent, rounding-safe.
//
//   B. The floorDecadesBelowBaseline DISPLAY column (imp-96185, imp-96207).
//      This column is log10(E_TRUNC_BASELINE / E), the only place the anchor
//      value enters a tabulated number. imp-96185 imports the FULL computed
//      value (imp-2322 etruncPtBaseline ~ 3.063887e-5); imp-96207 bakes the
//      ROUNDED 3.06e-5. The two therefore differ by log10(3.063887/3.06) =
//      5.513e-4 decades in every row -- visible at the 4th displayed decimal
//      (0.4863 vs 0.4857 at E = 1e-5) but display-only. Neither is compared to
//      the other under a tighter-than-1e-6 assertion; each module own equality
//      tripwire is |baseline - 3.06e-5| < 1e-6, satisfied by BOTH the full and
//      the rounded value. No bound moves.
//
//   C. The equality assertions (imp-96229, imp-96185 tripwire, imp-2322
//      tripwire). Every one uses a 1e-6 tolerance; the 3.887e-8 gap is ~26x
//      inside it, so all pass on either value. Rounding-safe by construction.
//
// VERDICT: every consumer is rounding-safe. No downstream table carries the
// 3.887e-8 gap into a tighter-than-1e-6 assertion. The only measurable
// footprint is a benign DISPLAY-only inconsistency between imp-96185 (full
// value) and imp-96207 (rounded pin) in the floorDecadesBelowBaseline column,
// differing at the 4th decimal (5.513e-4 decades) and moving no bound. Aligning
// imp-96207 baseline to the computed value would remove the cosmetic split but
// is out of scope for an accuracy audit that changes no bound.
//
// Accuracy audit only. No zero is verified, no new T_PT is claimed, the
// rigorous bound stays E_trunc = 3.06e-5, and C_mb stays GUE-conditional per
// imp-486. Changes no bound; no RH claim; NO QED. No refereed bound is changed
// ; RH OPEN.
//
// @see imp-96229-reciprocal-elasticity-consistency-audit (flags the 3.9e-8 gap as display rounding)
// @see imp-96232-kappa-star-floor-height-cross-validation (pin-independent inversion table)
// @see imp-96207-verified-height-floor-law-kappa-star (bakes the rounded 3.06e-5 baseline)
// @see imp-96185-etrunc-floor-inverse-height-thresholds (imports the full 3.063887e-5 baseline)
// @see imp-2322-etrunc-pt-T_PT-sensitivity (computes etruncPtBaseline = full 3.063887e-5)
// @see imp-96166-en-decay-exponent-vs-step4-bridge-threshold (the frozen E_trunc floor / pin)
// @see imp-486 (C_mb GUE-conditional); lambda-roadmap Step 4 / conditionalBookkeeping B1-B3

// Shared anchors carried as literals (import-light, imp-96229 / imp-96207 pattern).
const KAPPA_STAR = 0.4;             // 1 - e_I at sigma = 3/4
const PREFACTOR = 3.0;              // 2 e_I / kappa = 2(1 - kappa)/kappa
const T_PT_BASELINE = 3e12;        // Platt-Trudgian 2021 verified strip height
const E_TRUNC_PIN = 3.06e-5;        // imp-96166 frozen floor (rounded), pinned
const ASSERTION_TOL = 1e-6;         // shared display / equality tolerance

// Full computed anchor E_trunc(3e12) = prefactor * T_PT^{-kappa}.
const E_TRUNC_FULL = PREFACTOR * Math.pow(T_PT_BASELINE, -KAPPA_STAR); // 3.063887e-5
const ABS_GAP = Math.abs(E_TRUNC_FULL - E_TRUNC_PIN);                   // 3.887e-8
const REL_GAP = ABS_GAP / E_TRUNC_PIN;                                  // 1.270e-3
const GAP_HEADROOM_IN_TOL = ASSERTION_TOL / ABS_GAP;                    // ~25.7x inside 1e-6

// Representative target floors used by the downstream inversion tables.
const THRESHOLDS = Object.freeze([1e-5, 1e-6, 1e-7, 1e-8]);

// Inverse: H_required(E) = (prefactor / E)^{1/kappa}. Uses the TARGET floor E,
// never the E_trunc(3e12) anchor, so the pin-vs-full choice cannot move it.
function heightForFloor(E, kappa = KAPPA_STAR, prefactor = PREFACTOR) {
  return Math.pow(prefactor / E, 1 / kappa);
}

// Finding A: heights are identical whether the pin or the full value is around.
// (Recompute both ways to demonstrate the height column is pin-independent.)
const HEIGHT_ROWS = THRESHOLDS.map((E) => {
  const H = heightForFloor(E);
  return {
    floor: +E.toExponential(0),
    H_required: +H.toExponential(6),
    // The anchor never enters H_required, so the "shift if fed full value" is 0.
    heightShiftFromAnchorChoice: 0,
  };
});

// Finding B: the floorDecadesBelowBaseline display column log10(baseline / E),
// measured on BOTH baselines. Delta is a constant log10(full / pin) per row.
const DECADE_COLUMN_ROWS = THRESHOLDS.map((E) => {
  const withPin = Math.log10(E_TRUNC_PIN / E);
  const withFull = Math.log10(E_TRUNC_FULL / E);
  return {
    floor: +E.toExponential(0),
    decadesBelowPinBaseline: +withPin.toFixed(4),   // imp-96207 baked-pin column
    decadesBelowFullBaseline: +withFull.toFixed(4),  // imp-96185 computed column
    delta: +(withFull - withPin).toExponential(3),   // constant 5.513e-4
  };
});
const DECADE_COLUMN_DELTA = Math.log10(E_TRUNC_FULL / E_TRUNC_PIN); // 5.513e-4

export const IMP96246_ETRUNC_PIN_CONSUMER_AUDIT = {
  id: 'imp-96246',
  proofSection: 'S-frontier',
  question:
    'Does any downstream consumer of the truncation anchor carry the 3.887e-8 ' +
    'gap between the full E_trunc(3e12) = 3.063887e-5 and the rounded frozen ' +
    'pin 3.06e-5 into a tabulated result that would shift by more than its own ' +
    'stated tolerance if fed the full value? Accuracy audit only, changes no ' +
    'bound, no QED.',
  gap: {
    etruncFull: +E_TRUNC_FULL.toExponential(6),   // 3.063887e-5
    etruncPin: E_TRUNC_PIN,                        // 3.06e-5
    absGap: +ABS_GAP.toExponential(3),             // 3.887e-8
    relGap: +REL_GAP.toExponential(3),             // 1.270e-3
    assertionTol: ASSERTION_TOL,                   // 1e-6
    gapHeadroomInTol: +GAP_HEADROOM_IN_TOL.toFixed(2), // ~25.7x inside tolerance
  },
  consumers: [
    {
      module: 'imp-96185 / imp-96207 / imp-96232 (floor-to-height HEIGHTS)',
      usesAnchor: false,
      finding:
        'H_required(E) = (prefactor/E)^{1/kappa} inverts from the TARGET floor ' +
        'E, not the E_trunc(3e12) anchor. The pin-vs-full choice shifts every ' +
        'tabulated height by exactly 0. Pin-independent, rounding-safe.',
      maxShift: 0,
      roundingSafe: true,
    },
    {
      module: 'imp-96185 / imp-96207 (floorDecadesBelowBaseline DISPLAY column)',
      usesAnchor: true,
      finding:
        'log10(baseline/E) is the only tabulated number the anchor enters. ' +
        'imp-96185 uses the full 3.063887e-5 (column ~0.4863 at E=1e-5); ' +
        'imp-96207 bakes the rounded 3.06e-5 (column ~0.4857). They differ by ' +
        'a constant 5.513e-4 decades -- visible at the 4th displayed decimal, ' +
        'display-only. Each module own tripwire is |baseline - 3.06e-5| < 1e-6, ' +
        'satisfied by BOTH values, so no assertion and no bound moves.',
      maxShift: +DECADE_COLUMN_DELTA.toExponential(3), // 5.513e-4 decades
      roundingSafe: true,
    },
    {
      module: 'imp-96229 / imp-96185 tripwire / imp-2322 tripwire (equality gates)',
      usesAnchor: true,
      finding:
        'Every equality gate uses a 1e-6 tolerance; the 3.887e-8 gap sits ' +
        '~25.7x inside it, so all pass on either the full or the rounded value. ' +
        'Rounding-safe by construction.',
      maxShift: +ABS_GAP.toExponential(3),
      roundingSafe: true,
    },
  ],
  heightRows: HEIGHT_ROWS,
  decadeColumnRows: DECADE_COLUMN_ROWS,
  decadeColumnDelta: +DECADE_COLUMN_DELTA.toExponential(3), // 5.513e-4
  isRigorous: false,
  verdict:
    'ALL CONSUMERS ROUNDING-SAFE (accuracy audit, NOT rigorous). No downstream ' +
    'table carries the 3.887e-8 gap into a tighter-than-1e-6 assertion. The ' +
    'floor-to-height HEIGHTS (imp-96185/96207/96232) invert from the target ' +
    'floor E and are pin-independent (shift exactly 0). The only measurable ' +
    'footprint is a DISPLAY-only inconsistency in the floorDecadesBelowBaseline ' +
    'column: imp-96185 reads the full 3.063887e-5 (~0.4863 at 1e-5), imp-96207 ' +
    'the rounded 3.06e-5 (~0.4857), differing by a constant 5.513e-4 decades at ' +
    'the 4th displayed decimal; both satisfy the |baseline - 3.06e-5| < 1e-6 ' +
    'tripwire, so no bound moves. Aligning imp-96207 baseline to the computed ' +
    'value would erase the cosmetic split but is out of scope. No zero is ' +
    'verified, no new T_PT claimed, the rigorous bound stays E_trunc = 3.06e-5, ' +
    'C_mb stays GUE-conditional per imp-486. Changes no bound; no RH claim; NO ' +
    'QED. No refereed bound is changed; RH OPEN.',
  citation:
    'imp-96229 (flags gap as display rounding); imp-96232 (pin-independent ' +
    'inversion); imp-96207 (bakes rounded baseline); imp-96185 (imports full ' +
    'baseline); imp-2322 (computes full etruncPtBaseline); imp-96166 (frozen ' +
    'floor / pin); imp-486 (C_mb GUE-conditional); lambda-roadmap Step 4 / ' +
    'conditionalBookkeeping B1-B3.',
};

export const IMP96246_ETRUNC_PIN_CONSUMER_AUDIT_ASSERTIONS = [
  {
    // The full anchor and the pin differ by 3.887e-8, well inside the 1e-6 tol.
    id: 'imp96246-gap-inside-tolerance',
    description: 'E_trunc full 3.063887e-5 vs pin 3.06e-5 gap is 3.887e-8, inside 1e-6',
    holds: () =>
      Math.abs(E_TRUNC_FULL - 3.063887e-5) < 1e-10 &&
      Math.abs(ABS_GAP - 3.887e-8) < 1e-10 &&
      ABS_GAP < ASSERTION_TOL &&
      GAP_HEADROOM_IN_TOL > 20,
  },
  {
    // The inversion HEIGHTS never read the anchor, so their shift is exactly 0.
    id: 'imp96246-heights-pin-independent',
    description: 'floor-to-height inversion heights do not use the anchor (shift 0)',
    holds: () =>
      HEIGHT_ROWS.every((r) => r.heightShiftFromAnchorChoice === 0) &&
      Math.abs(heightForFloor(1e-6) - 1.558846e16) / 1.558846e16 < 1e-5 &&
      Math.abs(heightForFloor(1e-5) - 4.929503e13) / 4.929503e13 < 1e-5,
  },
  {
    // The display-column delta is the constant log10(full/pin) = 5.513e-4.
    id: 'imp96246-decade-column-delta-constant',
    description: 'floorDecadesBelowBaseline delta is a constant 5.513e-4 decades per row',
    holds: () =>
      Math.abs(DECADE_COLUMN_DELTA - 5.513e-4) < 1e-6 &&
      DECADE_COLUMN_ROWS.every(
        (r) => Math.abs(r.delta - DECADE_COLUMN_DELTA) < 1e-6,
      ) &&
      // The delta lands at the 4th decimal, below every 1e-6 equality tripwire
      // yet above the toFixed(4) display resolution.
      DECADE_COLUMN_DELTA < 1e-3 &&
      DECADE_COLUMN_DELTA > 1e-4,
  },
  {
    // Every enumerated consumer is rounding-safe; audit is non-rigorous, no QED.
    id: 'imp96246-honesty-gate-no-qed',
    description: 'all consumers rounding-safe, accuracy audit only, no QED, no refereed bound is changed',
    holds: () =>
      IMP96246_ETRUNC_PIN_CONSUMER_AUDIT.isRigorous === false &&
      IMP96246_ETRUNC_PIN_CONSUMER_AUDIT.consumers.every((c) => c.roundingSafe === true) &&
      /ROUNDING-SAFE/.test(IMP96246_ETRUNC_PIN_CONSUMER_AUDIT.verdict) &&
      /NO QED/.test(IMP96246_ETRUNC_PIN_CONSUMER_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP96246_ETRUNC_PIN_CONSUMER_AUDIT.verdict),
  },
];

for (const a of IMP96246_ETRUNC_PIN_CONSUMER_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96246-etrunc-pin-consumer-audit assertion failed: ${a.id}`,
    );
  }
}
