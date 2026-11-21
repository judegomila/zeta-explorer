/**
 * @module imp-97366-krein-routeb-remainder-done-obstructionb-open-cohort-index
 * @fileoverview imp-97366 -- META cross-reference index note grouping the Krein Route B
 *   remainder-envelope cohort (imp-97294, imp-97312, imp-97331, imp-97337, imp-97338) as a single
 *   REMAINDER-DONE-OBSTRUCTION-B-OPEN family: four tickets progressively tighten and then
 *   interval-CERTIFY the z^-4 combined-remainder majorant for the imp-97134 annihilating trial,
 *   while the fifth shows the separate inversion step (Obstruction B, imp-97164) is EXACTLY
 *   unreachable for that same trial on the committed matrix -- so the remainder-bound half of
 *   Route B is finished, but Route B itself still does not close. Index/meta only; establishes
 *   nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (chronological). All five sit on the imp-97100 Route B combined phase-preserving
 *   panel program for the Route I Krein t-truncation residual <v0|R_T|v0>, g(t) = v0 . Phi(t).
 *     imp-97294 -- TIGHTENS the imp-97263 z^-4 remainder majorant by regrouping each spherical-
 *       Bessel order j into ONE harmonic P_j cos z + Q_j sin z with P_j, Q_j exact integers
 *       (coherent cross-cancellation the incoherent triangle-inequality bound discarded); uniform
 *       constant C_coh ~= 5.409e4 vs the prior incoherent C ~= 2.080e5 (3.84x tighter), leaving
 *       ~1.19x slack from the one remaining across-order triangle step.
 *     imp-97312 -- INTEGRATES the imp-97294 fully-coherent pointwise bound into a single IEEE-
 *       double tail constant C_ptwise = sup_{z>=Z0} F(z) ~= 4.5504e4, eliminating that across-order
 *       triangle step; slack against the measured true peak collapses from ~1.19x to ~1.00044x, but
 *       the supremum is measured on a coarse scan, not certified.
 *     imp-97331 -- PORTS the imp-97312 constant to interval arithmetic: C_certified ~= 45504.154,
 *       a RIGOROUS enclosure of sup_{z>=Z0} F(z) in [45504.1205, 45504.154] (relative width ~7e-7),
 *       certifying both the single constant and that the supremum sits at the tail edge z = Z0.
 *     imp-97337 -- EXECUTES the named sub-gap IMP97184_INTERVAL_BESSEL_ENCLOSURE: a certified,
 *       interval-library-free per-panel |g| enclosure (replacing the imp-97184 24-point sampled
 *       subgrid) that brackets the exact g on every one of 572 panels with worst true-sup/enclosure
 *       = 0.9871, plus a closed-form Route C far-tail majorant C_far = 48524.3 for z >= Zfar.
 *     imp-97338 -- ASSESSES Route B Obstruction B (imp-97164: invert the imp-97134 8-sparse degree
 *       trial d = C^T v0 back onto a committed v0) on the imp-97293 EXACT rational overlap matrix;
 *       the band-triangular structure forces v0_2..v0_99 = 0 and the surviving four even / four odd
 *       targets each demand a DIFFERENT value of v0_0 / v0_1 -- an exact, structural contradiction.
 *       CLOSES that specific inversion branch as unreachable; does NOT close Route B, since the
 *       correct relaxation (imp-97113's 94-dim v0 family satisfying only the 6 carrier functionals)
 *       stays live and still needs its own tail control (IMP97015_ARB_INTERVAL_BESSEL).
 *
 *   WHY GROUP THESE (not re-derive). Read individually the five tickets look like an unrelated mix
 *   of a majorant tightening, a constant-integration step, an interval-certification step, a panel-
 *   enclosure execution, and an inversion-obstruction assessment. Read together they are one story
 *   in two halves: (A) imp-97294/97312/97331/97337 form a single tightening-then-certification
 *   chain that FINISHES the z^-4 combined-remainder envelope for the imp-97134 trial -- from a loose
 *   incoherent triangle bound, through coherent regrouping and pointwise integration, to a rigorous
 *   interval certificate and a certified per-panel |g| enclosure with a Route C far-tail majorant;
 *   (B) imp-97338 shows the OTHER half of Route B -- inverting a target degree trial onto a
 *   committed v0 -- is exactly blocked for that trial on the real committed matrix. So "the
 *   remainder bound is done" and "Route B is open" are simultaneously true and this index bakes
 *   that reading so a future scout does not mistake the imp-97331/97337 certification wins for a
 *   closed Route B, and does not re-attempt inverting the same 8-sparse trial expecting a different
 *   committed v0 to appear.
 *
 *   MEASURED/DERIVED (remainder envelope: finished and certified; inversion: exactly obstructed).
 *   - coherent per-order regrouping tightens the z^-4 majorant 3.84x (uniform constant) / 4.27x
 *     (leading j=3 floor) over the incoherent triangle bound (imp-97294).
 *   - the pointwise single constant C_ptwise ~= 45504.12 leaves only ~0.044% slack against the
 *     measured true peak ~45484, down from ~18.9% (imp-97312).
 *   - interval arithmetic certifies C_certified ~= 45504.154, enclosing the true supremum to
 *     relative width ~7e-7 and pinning it to the tail edge z = Z0 (imp-97331).
 *   - a certified, interval-library-free per-panel |g| enclosure brackets the exact g to worst
 *     ratio 0.9871 over 572 panels, plus a closed-form far-tail constant C_far = 48524.3
 *     (imp-97337).
 *   - the specific imp-97134 8-sparse degree trial is EXACTLY unreachable from any committed v0:
 *     the four even-degree targets demand four different values of v0_0 and the four odd-degree
 *     targets demand four different values of v0_1, on the exact rational committed matrix
 *     (imp-97338).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - Route B does NOT close: the correct relaxation (imp-97113's 94-dim v0 family satisfying only
 *     the 6 carrier functionals, not the full 8-sparse degree trial) remains live but untried
 *     against a tail-control obstruction of its own (IMP97015_ARB_INTERVAL_BESSEL, imp-97164
 *     Obstruction 2).
 *   - no interval majorant for the FULL committed trial has been produced by this cohort; the
 *     certified constants (imp-97331, imp-97337) apply to the fixed imp-97134 annihilating
 *     rational trial, whose onward inversion (imp-97338) fails.
 *   - no operator positivity is established; Rayleigh floors stay upper bounds; interval-rigorous
 *     certified reach stays 2a<=0.96, unchanged by this whole cohort.
 *
 *   STATUS: a grouping/index note over five already-completed tickets, not a new derivation. No
 *   bound changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-97294-krein-bessel-z4-coherent-jfreq-majorant.js (coherent per-order regrouping; 3.84x tighter uniform constant)
 * @see imp-97312-krein-bessel-z4-pointwise-single-constant.js (pointwise single constant; slack collapses to ~1.00044x)
 * @see imp-97331-krein-bessel-z4-interval-certified-tail-constant.js (interval-certified C_certified ~= 45504.154)
 * @see imp-97337-krein-routeb-certified-bessel-enclosure.js (certified per-panel |g| enclosure + Route C far-tail majorant)
 * @see imp-97338-krein-cjk-exact-band-inversion-obstruction.js (exact band-inversion contradiction; Obstruction B stays open)
 * @see imp-97164-krein-v0-overlap-inversion-interval-obstruction.js (Obstruction B origin: the degree-to-v0 overlap inversion)
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (Route B combined phase-preserving panel program this cohort serves)
 *
 * Ticket: imp-97366 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- interval-rigorous certified reach stays 2a<=0.96 > ln3

const KREIN_ROUTEB_REMAINDER_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97294',
    role: 'tightens the incoherent z^-4 remainder majorant via coherent per-order regrouping',
    result:
      'each spherical-Bessel order j collapses to one harmonic P_j cos z + Q_j sin z with exact-integer ' +
      'P_j, Q_j; uniform constant C_coh ~= 5.409e4 vs the prior incoherent ~= 2.080e5 (3.84x tighter), ' +
      '~1.19x slack remaining from the across-order triangle step.',
  }),
  Object.freeze({
    id: 'imp-97312',
    role: 'integrates the coherent pointwise bound into a single IEEE-double tail constant',
    result:
      'C_ptwise = sup_{z>=Z0} F(z) ~= 4.5504e4, eliminating the across-order triangle step; slack ' +
      'against the measured true peak collapses from ~1.19x to ~1.00044x, but the supremum is a ' +
      'coarse-scan measurement, not certified.',
  }),
  Object.freeze({
    id: 'imp-97331',
    role: 'ports the pointwise constant to interval arithmetic for a rigorous certificate',
    result:
      'C_certified ~= 45504.154, enclosing sup_{z>=Z0} F(z) in [45504.1205, 45504.154] (relative ' +
      'width ~7e-7); certifies both the single constant and that the supremum sits at the tail edge z = Z0.',
  }),
  Object.freeze({
    id: 'imp-97337',
    role: 'executes a certified interval-library-free per-panel |g| enclosure plus a far-tail majorant',
    result:
      'brackets the exact g on every one of 572 panels with worst true-sup/enclosure = 0.9871; closed-' +
      'form Route C far-tail constant C_far = 48524.3 for z >= Zfar.',
  }),
  Object.freeze({
    id: 'imp-97338',
    role: 'assesses Obstruction B (degree-to-v0 inversion) on the exact committed overlap matrix',
    result:
      'band-triangular structure forces v0_2..v0_99 = 0; the four even and four odd targets each ' +
      'demand a DIFFERENT value of v0_0 / v0_1 -- an exact structural contradiction; that inversion ' +
      'branch is unreachable, Route B stays open via the untried 94-dim relaxation.',
  }),
]);

export const IMP97366_KREIN_ROUTEB_REMAINDER_DONE_OBSTRUCTIONB_OPEN_COHORT_INDEX = Object.freeze({
  id: 'imp-97366',
  proofSection: 'S-frontier',
  cohort: KREIN_ROUTEB_REMAINDER_COHORT,
  measuredSignal:
    'four tickets (imp-97294, imp-97312, imp-97331, imp-97337) form a single tightening-then-' +
    'certification chain that finishes the z^-4 combined-remainder envelope for the imp-97134 ' +
    'annihilating trial, while the fifth (imp-97338) shows the separate degree-to-v0 inversion step ' +
    '(Obstruction B) is exactly unreachable for that same trial on the committed matrix.',
  namedResiduals: [
    'IMP97294_COHERENT_MAJORANT_STILL_HAS_ACROSS_ORDER_TRIANGLE_SLACK',
    'IMP97312_POINTWISE_CONSTANT_MEASURED_NOT_CERTIFIED',
    'IMP97331_INTERVAL_CERTIFICATE_APPLIES_TO_FIXED_TRIAL_ONLY',
    'IMP97337_PANEL_ENCLOSURE_AND_FAR_TAIL_APPLY_TO_FIXED_TRIAL_ONLY',
    'IMP97338_OBSTRUCTIONB_BLOCKS_8SPARSE_TRIAL_RELAXATION_UNTRIED',
  ],
  certifiedReach: 0.96,
  routeBClosed: false,
  remainderEnvelopeCertified: true,
  question:
    'The Krein Route B remainder-envelope cohort (imp-97294/97312/97331/97337/97338) reads as five ' +
    'separate tickets spanning a majorant tightening, a constant integration, an interval ' +
    'certification, a panel-enclosure execution, and an inversion-obstruction assessment. Grouped, ' +
    'does the remainder-bound half of Route B finish, and does Route B itself close?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The z^-4 combined-remainder envelope for the ' +
    'imp-97134 annihilating trial is FINISHED and CERTIFIED: coherent per-order regrouping ' +
    '(imp-97294) plus pointwise integration (imp-97312) plus interval certification (imp-97331) plus ' +
    'a certified per-panel |g| enclosure and far-tail majorant (imp-97337) together deliver a ' +
    'rigorous single tail constant with negligible residual slack. But Route B itself does NOT ' +
    'close: imp-97338 shows the degree-to-v0 inversion (Obstruction B) is exactly unreachable for ' +
    'that same trial on the committed matrix, and the correct relaxation (the 94-dim v0 family ' +
    'satisfying only the 6 carrier functionals) remains live but untried against its own tail-control ' +
    'obstruction. So the cohort as a whole is a REMAINDER-DONE-OBSTRUCTION-B-OPEN family: the ' +
    'remainder bound is finished, the inversion is not, and Route B stays open. No operator ' +
    'positivity is established; interval-rigorous certified reach stays EXACTLY 2a<=0.96, unchanged ' +
    'by this whole cohort. Future work on this thread should treat the remainder-envelope work as ' +
    'closed and should not re-attempt inverting the same 8-sparse trial expecting a different ' +
    'committed v0; the live residual is the untried 94-dim relaxation against its own tail-control ' +
    'gap. Establishes nothing new; moves no bound; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97294 (coherent per-order regrouping); imp-97312 (pointwise single constant); imp-97331 ' +
    '(interval-certified tail constant); imp-97337 (certified panel enclosure + far-tail majorant); ' +
    'imp-97338 (exact band-inversion contradiction, Obstruction B stays open).',
  ln3: LN3,
});

export default IMP97366_KREIN_ROUTEB_REMAINDER_DONE_OBSTRUCTIONB_OPEN_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97366_KREIN_ROUTEB_REMAINDER_DONE_OBSTRUCTIONB_OPEN_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97366-cohort-has-all-five-members',
    why: 'The whole point of the index is grouping exactly these five tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97366_KREIN_ROUTEB_REMAINDER_DONE_OBSTRUCTIONB_OPEN_COHORT_INDEX.cohort.map((c) => c.id);
      return [
        'imp-97294',
        'imp-97312',
        'imp-97331',
        'imp-97337',
        'imp-97338',
      ].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97366-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them without ' +
      're-reading all five tickets.',
    holds: () => {
      const idx = IMP97366_KREIN_ROUTEB_REMAINDER_DONE_OBSTRUCTIONB_OPEN_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 5 &&
        idx.routeBClosed === false &&
        idx.remainderEnvelopeCertified === true &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3
      );
    },
  },
  {
    id: 'imp97366-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97366_KREIN_ROUTEB_REMAINDER_DONE_OBSTRUCTIONB_OPEN_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97366_KREIN_ROUTEB_REMAINDER_DONE_OBSTRUCTIONB_OPEN_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97366_KREIN_ROUTEB_REMAINDER_DONE_OBSTRUCTIONB_OPEN_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97366_KREIN_ROUTEB_REMAINDER_DONE_OBSTRUCTIONB_OPEN_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97366_KREIN_ROUTEB_REMAINDER_DONE_OBSTRUCTIONB_OPEN_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97366-krein-routeb-remainder-done-obstructionb-open-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
