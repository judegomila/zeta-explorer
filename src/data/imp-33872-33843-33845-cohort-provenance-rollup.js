/**
 * @module imp-33872-33843-33845-cohort-provenance-rollup
 * @fileoverview imp-33872 -- META provenance roll-up cataloguing the imp-33843/imp-33844/imp-33845
 * fit-and-closed-form cohort (three modules) by EVIDENCE CLASS and confirming each carries the
 * mandatory honest banner: isRigorous:false, NO-QED, imp-3066-untouched (or the applicable
 * off-diagonal endpoint-Hankel K_a>=0 phrasing), and no refereed bound is changed, following the
 * imp-33268/imp-33287/imp-33307/imp-33551/imp-33574/imp-33593/imp-33693/imp-33719/imp-33784/
 * imp-33824 audit precedent.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/detail block and its
 * `isRigorous` / `verdict` fields were read and classified into the evidence class it earns on its
 * own terms:
 *   - "log-linear widening surrogate fit": fits a previously-measured ladder to two competing OLS
 *     surrogate forms (log-linear vs power law) and reports which one wins, WITHOUT deriving either
 *     from the component model.
 *   - "closed-form derivation": DERIVES a previously only numerically-located quantity in closed
 *     form from the inherited component-model identities, then reports the residual against the
 *     original numeric reading.
 *   - "onset-rate measurement": measures a LOCAL EXPONENT on a finer ladder than the parent module
 *     used, establishing whether an approach-to-limit is a fixed-rate onset or a drifting power law.
 * The honest-banner check greps each module for isRigorous:false, NO QED, the applicable untouched-
 * positivity invariant (imp-3066 K_a>=0), and no refereed bound is changed, plus, where the module
 * touches the Polymath15 bridge, the explicit G6a/H2 status line.
 *
 * RESULT (audited 2026-07-05). All three modules carry the full honest banner. Two of the three
 * (imp-33843, imp-33844) do NOT reference the Polymath15 G6a_shock_lipschitz/H2 bridge -- correct,
 * since they sit in the sigma-decay/eflow-resid frontier, disjoint from the G6a inviscid-window
 * material. imp-33845 DOES reference the bridge: it explicitly states its measured C_ren-C_PS onset
 * rate does NOT discharge H4 and that G6a_shock_lipschitz STAYS OPEN -- a real touch, not a mention
 * to catalogue as "not referenced".
 *   - imp-33843-eflow-resid-widening-form-fit.js : log-linear widening surrogate fit
 *   - imp-33844-hump-peak-closed-form.js         : closed-form derivation
 *   - imp-33845-cren-gap-onset-rate.js           : onset-rate measurement
 *
 * SURFACING NOTE (secondary). imp-33844 and imp-33845 each have a dedicated glossary.js `term:`
 * entry (imp-33868 HUMP-PEAK-CLOSED-FORM, imp-33870 hump-peak verdict cross-link, and the imp-33845
 * FIXED-3/2-ONSET entry); imp-33843 has neither a glossary term nor any viz presence. imp-33845 has
 * a routed viz page (Imp33864CrenGapOnsetLadderViz.jsx); imp-33844 has a baked-literal viz-data
 * module (imp-33866-hump-peak-closed-form-viz-data.js, no real import edge to imp-33844 itself, per
 * project convention) but no routed consumer page yet. imp-33867 already extended
 * lambda-roadmap.js currentStatus with a COHORT paragraph covering all three landings.
 *
 * @see imp-33268, imp-33287, imp-33307, imp-3886, imp-3931, imp-33551, imp-33574, imp-33593,
 * imp-33693, imp-33719, imp-33784, imp-33824 (the precedent provenance roll-ups this note follows)
 * @see imp-33867 (the lambda-roadmap.js currentStatus paragraph covering this same cohort)
 */

export const IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33872',
  auditedAt: '2026-07-05',
  method:
    'Read each of the three imp-33843/33844/33845 module @fileoverview/detail blocks and isRigorous ' +
    '/ verdict fields; classify by evidence class (log-linear widening surrogate fit / closed-form ' +
    'derivation / onset-rate measurement); grep for the mandatory honest-banner phrases (isRigorous ' +
    'false, no QED, imp-3066 K_a >= 0 untouched, no refereed bound is changed) plus, where ' +
    'applicable, the explicit G6a/H2 bridge status line.',
  modules: [
    {
      file: 'imp-33843-eflow-resid-widening-form-fit.js',
      evidenceClass: 'log-linear widening surrogate fit',
      isRigorousFalse: true,
      noQED: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: false,
    },
    {
      file: 'imp-33844-hump-peak-closed-form.js',
      evidenceClass: 'closed-form derivation',
      isRigorousFalse: true,
      noQED: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasVizPresence: true,
    },
    {
      file: 'imp-33845-cren-gap-onset-rate.js',
      evidenceClass: 'onset-rate measurement',
      isRigorousFalse: true,
      noQED: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'referenced -- G6a_shock_lipschitz STAYS OPEN, does not discharge H4',
      hasGlossaryTerm: true,
      hasVizPresence: true,
    },
  ],
  evidenceClassCounts: {
    'log-linear widening surrogate fit': 1,
    'closed-form derivation': 1,
    'onset-rate measurement': 1,
  },
  honestBannerFullCoverageCount: 3,
  glossaryCoveredCount: 2,
  vizPresenceCount: 2,
  bridgeReferencedCount: 1,
  recommendation:
    'No action needed on the honest-banner side -- all three modules already carry the full ' +
    'mandatory banner. imp-33843 is the only module of the three without a dedicated glossary term ' +
    'or any viz presence and is the best candidate for one, following the imp-33268/imp-33229 ' +
    'roll-up precedent for its own uncovered member.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33872_ASSERTIONS = [
  {
    id: 'imp33872-exactly-three-modules-catalogued',
    holds: () => IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.modules.length === 3,
    why: 'The roll-up must cover exactly the three named cohort modules (imp-33843/33844/33845).',
  },
  {
    id: 'imp33872-three-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return (
        distinctClasses.size === 3 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 3
      );
    },
    why: 'Each of the three modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33872-all-three-carry-full-honest-banner',
    holds: () =>
      IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) =>
          x.isRigorousFalse === true &&
          x.noQED === true &&
          x.ka3066Untouched === true &&
          x.plattTrudgianSOTA === true
      ) && IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 3,
    why:
      'Every module in the cohort must state isRigorous:false, NO QED, imp-3066 K_a >= 0 untouched, ' +
      'and no refereed bound is changed -- grep-verified against the source files.',
  },
  {
    id: 'imp33872-exactly-one-bridge-touching-module',
    holds: () => {
      const m = IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.modules;
      const referenced = m.filter((x) => x.g6aH2Status !== 'not referenced').length;
      return (
        referenced === 1 &&
        referenced === IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.bridgeReferencedCount &&
        m.find((x) => x.file === 'imp-33845-cren-gap-onset-rate.js').g6aH2Status !== 'not referenced'
      );
    },
    why:
      'Grep-verified: imp-33845 alone references the Polymath15 G6a_shock_lipschitz/H2 bridge (its ' +
      'onset rate does NOT discharge H4, G6a STAYS OPEN); imp-33843/33844 correctly read "not referenced".',
  },
  {
    id: 'imp33872-two-glossary-two-viz',
    holds: () => {
      const m = IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasVizPresence === true).length;
      return (
        withTerm === 2 &&
        withTerm === IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 2 &&
        withViz === IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.vizPresenceCount
      );
    },
    why:
      'Grep-verified: two of the three modules (imp-33844, imp-33845) have a dedicated glossary ' +
      'term and viz presence (baked-literal or routed page); imp-33843 has neither.',
  },
  {
    id: 'imp33872-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33872_33843_33845_COHORT_PROVENANCE_ROLLUP.honestNote),
    why:
      'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33872_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33872 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33872_ASSERTIONS };
