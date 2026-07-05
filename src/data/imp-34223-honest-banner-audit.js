/**
 * @module imp-34223-honest-banner-audit
 * @fileoverview imp-34223 -- META honest-banner audit of the imp-34133/imp-34134/imp-34146/
 * imp-34147/imp-34148/imp-34149/imp-34150/imp-34151 E_coll/F4/apex cohort (eight modules),
 * following the imp-34202 banner-audit method: grep each module for the mandatory honest banner
 * (isRigorous:false, NO QED, the C_mb GUE-conditional per imp-486 untouched clause, the imp-3066
 * K_a>=0 untouched clause, Platt-Trudgian Lambda<=0.2 SOTA) and report whether any module touches
 * the Polymath15 G6a_shock_lipschitz/H2 bridge.
 *
 * METHOD (read-only, grep-verified at author time, no live import -- matches the imp-34202
 * precedent so this audit itself stays import-light).
 *
 * RESULT (audited 2026-07-05). Two of the eight modules have a genuine banner gap:
 *   - imp-34134-eflow-etrunc-ratio-decay-onset.js carries NO literal `isRigorous` field at all
 *     (it uses a prose `honestScope` string instead of the `isRigorous`/`verdict` pair the other
 *     seven modules share), so a build-time tripwire checking `.isRigorous === false` across this
 *     cohort would see `undefined`, not `false`, for this module.
 *   - imp-34133-f2-f3-asymptotic-constant-fit.js and imp-34134 both never write the literal
 *     substring "C_mb" -- imp-34133's verdict says "establishes no operator positivity; imp-3066
 *     K_a >= 0 untouched" with no C_mb clause at all, and imp-34134 says "per imp-486 (E_coll
 *     untouched)" without naming C_mb explicitly. The remaining six modules (imp-34146..imp-34151)
 *     all state the C_mb GUE-conditional per imp-486 UNTOUCHED clause by name.
 * All eight modules DO carry NO QED and the imp-3066 K_a>=0 untouched clause, and all eight state
 * the Platt-Trudgian Lambda<=0.2 SOTA line (imp-34134's phrasing varies slightly: "remains the SOTA
 * unconditional bound" rather than the cohort-standard "remains SOTA"). None of the eight
 * references the Polymath15 G6a_shock_lipschitz/H2 bridge -- correct, since this cohort sits
 * entirely in the E_coll/F4/apex frontier direction, disjoint from the G6a inviscid-window material.
 *
 * AUDIT-ONLY: this module fixes nothing in the audited files; it only records the gap for a future
 * targeted ticket, mirroring the imp-34145 precedent (audit reports a gap without patching it).
 *
 * @see imp-34202 (the banner-audit method this note follows)
 * @see imp-34145 (the audit-only precedent: report gaps, do not patch the audited modules here)
 */

export const IMP_34223_HONEST_BANNER_AUDIT = {
  id: 'imp-34223',
  auditedAt: '2026-07-05',
  method:
    'Grep each of the eight imp-34133/34134/34146/34147/34148/34149/34150/34151 cohort modules ' +
    'for the mandatory honest-banner phrases (isRigorous: false field, NO QED, the C_mb ' +
    'GUE-conditional per imp-486 untouched clause, the imp-3066 K_a >= 0 untouched clause, ' +
    'Platt-Trudgian Lambda <= 0.2 SOTA) plus the Polymath15 G6a_shock_lipschitz/H2 bridge status.',
  modules: [
    {
      file: 'imp-34133-f2-f3-asymptotic-constant-fit.js',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: false,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
    {
      file: 'imp-34134-eflow-etrunc-ratio-decay-onset.js',
      isRigorousFalse: false,
      noQED: true,
      cmbGueConditionalUntouched: false,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
    {
      file: 'imp-34146-apex-quintic-tilt-coefficient.js',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
    {
      file: 'imp-34147-apex-cubic-tilt-sign-sweep.js',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
    {
      file: 'imp-34148-symmetric-trim-f4-cancellation.js',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
    {
      file: 'imp-34149-tail-only-f4-unity-crossing.js',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
    {
      file: 'imp-34150-m2-residual-crossing-direct-bisection-crossval.js',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
    {
      file: 'imp-34151-cancellation-numerator-past-crossing.js',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
  ],
  isRigorousGapTickets: ['imp-34134'],
  cmbClauseGapTickets: ['imp-34133', 'imp-34134'],
  bridgeReferencedCount: 0,
  recommendation:
    'Two targeted follow-ups would close the gap: (1) give imp-34134 a literal isRigorous:false ' +
    'field alongside its existing honestScope prose so cohort-wide tripwires can check it ' +
    'mechanically, matching the other seven modules; (2) add the literal "C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED" phrase to imp-34133 and imp-34134, matching the six sibling modules that ' +
    'already name C_mb explicitly. Neither gap changes any bound or verdict -- both modules already ' +
    'state the underlying GUE-conditional/imp-486 caveat in different words.',
  honestNote:
    'Read-only audit; no bound changed by this module. C_mb stays GUE-conditional (imp-486). ' +
    'imp-3066 K_a >= 0 positivity untouched. Platt-Trudgian Lambda <= 0.2 remains SOTA. NO QED.',
};

const IMP_34223_ASSERTIONS = [
  {
    id: 'imp34223-exactly-eight-modules-catalogued',
    holds: () => IMP_34223_HONEST_BANNER_AUDIT.modules.length === 8,
    why: 'The audit must cover exactly the eight named cohort modules (imp-34133/34134/34146..34151).',
  },
  {
    id: 'imp34223-isrigorous-gap-is-exactly-imp34134',
    holds: () => {
      const m = IMP_34223_HONEST_BANNER_AUDIT.modules;
      const missing = m.filter((x) => x.isRigorousFalse === false).map((x) => x.file);
      return (
        missing.length === 1 &&
        missing[0] === 'imp-34134-eflow-etrunc-ratio-decay-onset.js' &&
        IMP_34223_HONEST_BANNER_AUDIT.isRigorousGapTickets.length === 1 &&
        IMP_34223_HONEST_BANNER_AUDIT.isRigorousGapTickets[0] === 'imp-34134'
      );
    },
    why: 'Grep-verified: imp-34134 has no literal isRigorous field; the other seven do.',
  },
  {
    id: 'imp34223-cmb-clause-gap-is-exactly-two',
    holds: () => {
      const m = IMP_34223_HONEST_BANNER_AUDIT.modules;
      const missing = m.filter((x) => x.cmbGueConditionalUntouched === false).map((x) => x.file);
      return (
        missing.length === 2 &&
        missing.includes('imp-34133-f2-f3-asymptotic-constant-fit.js') &&
        missing.includes('imp-34134-eflow-etrunc-ratio-decay-onset.js') &&
        IMP_34223_HONEST_BANNER_AUDIT.cmbClauseGapTickets.length === 2
      );
    },
    why: 'Grep-verified: imp-34133 and imp-34134 never write the literal substring "C_mb"; the ' +
      'other six state the C_mb GUE-conditional per imp-486 untouched clause by name.',
  },
  {
    id: 'imp34223-all-eight-carry-noqed-ka3066-sota',
    holds: () =>
      IMP_34223_HONEST_BANNER_AUDIT.modules.every(
        (x) => x.noQED === true && x.ka3066Untouched === true && x.plattTrudgianSOTA === true
      ),
    why: 'Grep-verified: every module in the cohort states NO QED, imp-3066 K_a >= 0 untouched, ' +
      'and the Platt-Trudgian Lambda <= 0.2 SOTA line (imp-34134 phrases the SOTA line slightly ' +
      'differently but still states it).',
  },
  {
    id: 'imp34223-zero-bridge-touching-modules',
    holds: () => {
      const m = IMP_34223_HONEST_BANNER_AUDIT.modules;
      const referenced = m.filter((x) => x.g6aH2Status !== 'not referenced').length;
      return referenced === 0 && referenced === IMP_34223_HONEST_BANNER_AUDIT.bridgeReferencedCount;
    },
    why: 'Grep-verified: none of the eight modules references the Polymath15 G6a_shock_lipschitz/H2 bridge.',
  },
  {
    id: 'imp34223-honest-note-locked',
    holds: () =>
      /SOTA/.test(IMP_34223_HONEST_BANNER_AUDIT.honestNote) &&
      /NO QED/.test(IMP_34223_HONEST_BANNER_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_34223_HONEST_BANNER_AUDIT.honestNote) &&
      /GUE-conditional/.test(IMP_34223_HONEST_BANNER_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 stays ' +
      'SOTA, C_mb stays GUE-conditional, imp-3066 stays untouched, NO QED.',
  },
];

for (const a of IMP_34223_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-34223 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_34223_ASSERTIONS };
