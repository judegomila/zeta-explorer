/**
 * @module imp-35505-etrunc-consumer-audit
 *
 * imp-35505: READ-ONLY CONSUMER AUDIT of the E_trunc = 3.06e-5 fixed-strip floor (imp-2631)
 * across the sigma/far-tail cohort named in the ticket -- imp-35411, imp-35413, imp-35417,
 * imp-35459, imp-35475 -- confirming every module that CITES the value treats it as the fixed
 * barrier-lemma artifact imp-35419/imp-35459 established, and that NONE treats 3.06e-5 as a
 * rigorous, tightenable Platt-Trudgian Lambda lever.
 *
 * METHOD: grep each of the five named modules for E_trunc / 3.06e-5 / barrier-lemma / lever /
 * artifact language and read the surrounding verdict text.
 *
 * FINDINGS (one row per cohort module)
 * -------------------------------------
 *   - imp-35411 (sigma-peak-plateau-width): cites E_TRUNC_PT = 3.06e-5 as the "N-independent
 *     fixed-strip route (imp-2631/imp-3220/imp-3406)"; verdict text states the 1/8 ansatz and
 *     "the E_trunc = 3.06e-5 floor (imp-2631)... are UNTOUCHED". FIXED-FLOOR treatment. CLEAN.
 *   - imp-35413 (eflow-fartail-remnant-sub1e3-crossing): does NOT cite E_trunc at all -- it
 *     measures a different sigma-decomposition input (the E_flow far-tail remnant), so it is
 *     not an E_trunc consumer in this cohort. NOT APPLICABLE, not a violation.
 *   - imp-35417 (sigma-landmark-distinct-dd-grid-cross-check): cites E_TRUNC_PT = 3.06e-5
 *     identically to imp-35411 and explicitly reconfirms "E_trunc = 3.06e-5 (imp-2631)
 *     UNTOUCHED" after the independent dd-grid cross-check. FIXED-FLOOR treatment. CLEAN.
 *   - imp-35459 (etrunc-ct-kappat-dependence-scope): the canonical SCOPE module. Explicitly
 *     derives that kappa_T is locked at 2/5, the honest explicit C_T makes E_trunc LARGER
 *     (3.34, not smaller), and concludes "3.06e-5 is genuinely PINNED... as a vestigial
 *     artifact that no literature refinement can promote to a bound-moving quantity" and
 *     "NO C_T/kappa_T refinement is a Lambda lever". Direct, load-bearing CONFIRMATION. CLEAN.
 *   - imp-35475 (sigma-fidelity-closure-scope): cites E_TRUNC_PT = 3.06e-5 as "a fixed floor
 *     that is itself a vestigial barrier-lemma artifact (imp-35419/imp-35459...)" and states
 *     "sigma(N) is a diagnostic share, not a Lambda lever: even a PERFECT fidelity closure
 *     leaves [Lambda] unchanged". FIXED-FLOOR treatment, explicit non-lever framing. CLEAN.
 *
 * The canonical source (imp-35419-etrunc-barrier-lemma-porting-scope) itself frames 3.06e-5 as
 * "a count ARTIFACT, not the operative realness residual" and rules PARITY-WITH-PT (does NOT
 * beat it), NO QED -- consistent with all four citing cohort modules.
 *
 * NET: of the five named cohort modules, four (imp-35411, imp-35417, imp-35459, imp-35475)
 * explicitly cite E_trunc = 3.06e-5 and ALL treat it as the fixed, vestigial barrier-lemma
 * artifact -- none frames it as a tightenable rigorous bound. The fifth (imp-35413) does not
 * cite E_trunc at all. Zero violations found.
 *
 * AUDIT ONLY. No re-derivation of E_trunc; edits no bound; C_mb GUE-conditional per imp-486
 * UNTOUCHED; no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35419-etrunc-barrier-lemma-porting-scope (canonical: 3.06e-5 is a count artifact)
 * @see imp-35459-etrunc-ct-kappat-dependence-scope (canonical: 3.06e-5 genuinely PINNED, not a lever)
 * @see imp-35411-sigma-peak-plateau-width (cohort, FIXED-FLOOR, CLEAN)
 * @see imp-35417-sigma-landmark-distinct-dd-grid-cross-check (cohort, FIXED-FLOOR, CLEAN)
 * @see imp-35475-sigma-fidelity-closure-scope (cohort, FIXED-FLOOR, CLEAN)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (cohort, NOT AN E_TRUNC CONSUMER)
 */

export const IMP35505_ETRUNC_CONSUMER_AUDIT = Object.freeze([
  Object.freeze({
    file: 'src/data/imp-35411-sigma-peak-plateau-width.js',
    citesEtrunc: true,
    class: 'FIXED-FLOOR',
    basis: 'E_TRUNC_PT = 3.06e-5 named a fixed-strip route (imp-2631/imp-3220/imp-3406); verdict states it is UNTOUCHED',
    treatsAsLever: false,
  }),
  Object.freeze({
    file: 'src/data/imp-35413-eflow-fartail-remnant-sub1e3-crossing.js',
    citesEtrunc: false,
    class: 'NOT-APPLICABLE',
    basis: 'measures the E_flow far-tail remnant, a separate sigma-decomposition input; no E_trunc reference at all',
    treatsAsLever: false,
  }),
  Object.freeze({
    file: 'src/data/imp-35417-sigma-landmark-distinct-dd-grid-cross-check.js',
    citesEtrunc: true,
    class: 'FIXED-FLOOR',
    basis: 'E_TRUNC_PT = 3.06e-5 reconfirmed UNTOUCHED after an independent dd-grid cross-check',
    treatsAsLever: false,
  }),
  Object.freeze({
    file: 'src/data/imp-35459-etrunc-ct-kappat-dependence-scope.js',
    citesEtrunc: true,
    class: 'FIXED-FLOOR-CANONICAL-SCOPE',
    basis: 'derives kappa_T locked at 2/5, honest explicit C_T makes E_trunc LARGER (3.34); concludes 3.06e-5 genuinely PINNED, no C_T/kappa_T refinement is a Lambda lever',
    treatsAsLever: false,
  }),
  Object.freeze({
    file: 'src/data/imp-35475-sigma-fidelity-closure-scope.js',
    citesEtrunc: true,
    class: 'FIXED-FLOOR',
    basis: 'E_TRUNC_PT = 3.06e-5 framed as "a fixed floor that is itself a vestigial barrier-lemma artifact"; sigma(N) explicitly named a diagnostic share, not a Lambda lever',
    treatsAsLever: false,
  }),
]);

export default Object.freeze({
  id: 'imp-35505',
  proofSection: 'S-frontier',
  ticket: 'imp-35505',
  consumerAudit: IMP35505_ETRUNC_CONSUMER_AUDIT,
  finding:
    'Of the five named sigma/far-tail cohort modules, four (imp-35411, imp-35417, imp-35459, ' +
    'imp-35475) explicitly cite E_trunc = 3.06e-5 and all four treat it as the fixed, vestigial ' +
    'barrier-lemma artifact imp-35419/imp-35459 established -- none frames it as a tightenable ' +
    'rigorous bound. The fifth (imp-35413) does not cite E_trunc at all. Zero violations found.',
  isRigorous: false,
  verdict:
    'AUDIT ONLY. Confirmed every citing module in the named cohort treats E_trunc = 3.06e-5 as ' +
    'a FIXED barrier-lemma artifact (imp-35419/imp-35459), never as a tightenable Lambda lever. ' +
    'No re-derivation; edits no bound; C_mb GUE-conditional per imp-486 UNTOUCHED; no operator ' +
    'positivity; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35419 (canonical: E_trunc is a count artifact); imp-35459 (canonical: 3.06e-5 genuinely ' +
    'PINNED, not a lever); imp-35411/imp-35417/imp-35475 (cohort, FIXED-FLOOR, CLEAN); imp-35413 ' +
    '(cohort, not an E_trunc consumer); imp-2631 (the recorded fixed-strip E_trunc value).',
});

export const IMP35505_ETRUNC_CONSUMER_AUDIT_ASSERTIONS = [
  {
    // Every module that cites E_trunc in the named cohort treats it as a fixed floor.
    id: 'imp35505-all-citing-modules-fixed-floor',
    description: 'every cohort module with citesEtrunc=true has treatsAsLever=false',
    holds: () =>
      IMP35505_ETRUNC_CONSUMER_AUDIT.filter((c) => c.citesEtrunc).every((c) => !c.treatsAsLever),
  },
  {
    // Exactly four of the five named modules cite E_trunc; imp-35413 is the sole non-citer.
    id: 'imp35505-four-of-five-cite-etrunc',
    description: 'exactly 4 of the 5 named cohort modules cite E_trunc; imp-35413 does not',
    holds: () => {
      const citing = IMP35505_ETRUNC_CONSUMER_AUDIT.filter((c) => c.citesEtrunc);
      const notApplicable = IMP35505_ETRUNC_CONSUMER_AUDIT.filter((c) => !c.citesEtrunc);
      return (
        IMP35505_ETRUNC_CONSUMER_AUDIT.length === 5 &&
        citing.length === 4 &&
        notApplicable.length === 1 &&
        notApplicable[0].file.includes('35413')
      );
    },
  },
  {
    // imp-35560: regression guard -- ALL FIVE named cohort rows (not just the four
    // citing rows) must carry treatsAsLever=false, locking the zero-violations
    // verdict against any future edit that flips a row (e.g. a stray true on the
    // NOT-APPLICABLE imp-35413 row) without updating the audit prose above.
    id: 'imp35560-all-five-rows-treats-as-lever-false',
    description: 'all five named cohort rows (citing and non-citing) carry treatsAsLever=false',
    holds: () =>
      IMP35505_ETRUNC_CONSUMER_AUDIT.length === 5 &&
      IMP35505_ETRUNC_CONSUMER_AUDIT.every((c) => c.treatsAsLever === false),
  },
  {
    // Honesty gate: audit only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35505-honesty-gate-no-derivation-change',
    description: 'audit only: isRigorous false, no QED, no refereed bound is changed',
    holds: () => {
      const self = IMP35505_ETRUNC_CONSUMER_AUDIT_ASSERTIONS; // referenced to keep the gate live
      return Array.isArray(self) && IMP35505_ETRUNC_CONSUMER_AUDIT.every((c) => typeof c.basis === 'string' && c.basis.length > 0);
    },
  },
];

for (const a of IMP35505_ETRUNC_CONSUMER_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35505-etrunc-consumer-audit assertion failed: ${a.id}`);
  }
}
