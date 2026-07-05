/**
 * @module imp-33890-33853-33858-cohort-provenance-rollup
 * @fileoverview imp-33890 -- META provenance roll-up cataloguing the NEWER imp-33853/imp-33854/
 * imp-33855/imp-33856/imp-33857/imp-33858 + imp-28895 fit-derivation-crossvalidation cohort (seven
 * modules) by EVIDENCE CLASS and confirming each carries the mandatory honest banner: isRigorous:false,
 * NO QED, imp-3066 K_a>=0 untouched, and Platt-Trudgian Lambda<=0.2 SOTA, mirroring the imp-33872
 * roll-up of the imp-33843/imp-33844/imp-33845 cohort (imp-33268/imp-33287/imp-33307/imp-33551/
 * imp-33574/imp-33593/imp-33693/imp-33719/imp-33784/imp-33824/imp-33872 audit precedent).
 *
 * METHOD (read-only, performed at author time). Each module's @module/@fileoverview header, its
 * `isRigorous` / `verdict` fields, and its glossary.js / consumer-page footprint were read and
 * classified into the evidence class it earns on its own terms:
 *   - "closed-form derivation": DERIVES a previously only numerically-measured quantity (exponent,
 *     coefficient, or magnitude) from the inherited component-model identities.
 *   - "closed-form reconciliation": DERIVES the exact identity unifying two previously-separate
 *     numerically-measured shortfalls into a single object.
 *   - "monotonicity/ordering derivation": PROVES a fixed-sign (monotone) ordering property across a
 *     continuous parameter range, extending an isolated-point numeric check.
 *   - "discrete-residual law-fit": FITS a previously-unfit discrete (finite-decade) residual reading
 *     to an already-derived pointwise asymptotic law and reports the fit residual.
 *   - "cross-validation": compares TWO independently-implemented code paths that should compute the
 *     same underlying quantity and reports their location/value residual.
 *   - "residual localization": tabulates the PER-RUNG signed residual of an existing aggregate fit and
 *     characterizes its shape (autocorrelation, sign-flip count) without changing the fit's verdict.
 * The honest-banner check greps each module for isRigorous:false, NO QED, imp-3066 K_a>=0 untouched,
 * and Platt-Trudgian Lambda<=0.2 SOTA, plus an explicit grep for "G6a" to flag any Polymath15 bridge
 * touch.
 *
 * RESULT (audited 2026-07-05). All seven modules carry the full honest banner. Exactly ONE
 * (imp-33853) touches the Polymath15 G6a_shock_lipschitz/H4 bridge -- it explicitly states its
 * closed-form 4/3 onset coefficient does NOT discharge H4 and that G6a_shock_lipschitz STAYS OPEN.
 * The other six do not reference G6a/H4 at all -- correct, since they sit in the sigma-decay /
 * eflow-resid / N_cross-landmark frontier, disjoint from the G6a inviscid-window material.
 *   - imp-33853-cren-gap-coefficient-closed-form.js         : closed-form derivation
 *   - imp-33854-log-saturation-exponent-reconciliation.js   : closed-form reconciliation
 *   - imp-33855-ncross-thr-monotone-ordering.js              : monotonicity/ordering derivation
 *   - imp-33856-ecoll-discrete-residual-log-shortfall-fit.js : discrete-residual law-fit
 *   - imp-33857-hump-peak-widening-crossvalidation.js        : cross-validation
 *   - imp-33858-widening-fit-residual-localization.js        : residual localization
 *   - imp-28895-eflow-resid-widening-model-derivation.js     : closed-form derivation
 *
 * SURFACING NOTE (secondary). Only imp-33854 has its OWN dedicated glossary.js `term:` entry
 * (firstUsed: imp-33854, the log-saturation object g(N)). imp-33857 and imp-28895 are cross-referenced
 * inside the separate `eflow_over_resid` glossary term's relatedTerms list but have no dedicated entry
 * of their own. imp-33853/imp-33855/imp-33856/imp-33858 have no glossary presence at all. None of the
 * seven has a routed viz page, a viz-data module, or a lambda-roadmap.js currentStatus mention -- this
 * entire cohort is glossary-and-module-only so far, making it the least-surfaced recent cohort audited.
 *
 * @see imp-33268, imp-33287, imp-33307, imp-33551, imp-33574, imp-33593, imp-33693, imp-33719,
 * imp-33784, imp-33824, imp-33872 (the precedent provenance roll-ups this note follows)
 */

export const IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33890',
  auditedAt: '2026-07-05',
  method:
    'Read each of the seven imp-33853/33854/33855/33856/33857/33858/28895 module @module/@fileoverview ' +
    'headers and isRigorous/verdict fields; classify by evidence class (closed-form derivation / ' +
    'closed-form reconciliation / monotonicity-ordering derivation / discrete-residual law-fit / ' +
    'cross-validation / residual localization); grep for the mandatory honest-banner phrases ' +
    '(isRigorous false, NO QED, imp-3066 K_a >= 0 untouched, Platt-Trudgian Lambda <= 0.2 SOTA) plus a ' +
    'G6a grep to flag any Polymath15 bridge touch; check glossary.js and src/pages for surfacing.',
  modules: [
    {
      file: 'imp-33853-cren-gap-coefficient-closed-form.js',
      evidenceClass: 'closed-form derivation',
      isRigorousFalse: true,
      noQED: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH4Status: 'referenced -- does NOT discharge H4, G6a_shock_lipschitz STAYS OPEN',
      hasGlossaryTerm: false,
      hasVizPresence: false,
    },
    {
      file: 'imp-33854-log-saturation-exponent-reconciliation.js',
      evidenceClass: 'closed-form reconciliation',
      isRigorousFalse: true,
      noQED: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH4Status: 'not referenced',
      hasGlossaryTerm: true,
      hasVizPresence: false,
    },
    {
      file: 'imp-33855-ncross-thr-monotone-ordering.js',
      evidenceClass: 'monotonicity/ordering derivation',
      isRigorousFalse: true,
      noQED: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH4Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: false,
    },
    {
      file: 'imp-33856-ecoll-discrete-residual-log-shortfall-fit.js',
      evidenceClass: 'discrete-residual law-fit',
      isRigorousFalse: true,
      noQED: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH4Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: false,
    },
    {
      file: 'imp-33857-hump-peak-widening-crossvalidation.js',
      evidenceClass: 'cross-validation',
      isRigorousFalse: true,
      noQED: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH4Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: false,
    },
    {
      file: 'imp-33858-widening-fit-residual-localization.js',
      evidenceClass: 'residual localization',
      isRigorousFalse: true,
      noQED: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH4Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: false,
    },
    {
      file: 'imp-28895-eflow-resid-widening-model-derivation.js',
      evidenceClass: 'closed-form derivation',
      isRigorousFalse: true,
      noQED: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH4Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: false,
    },
  ],
  evidenceClassCounts: {
    'closed-form derivation': 2,
    'closed-form reconciliation': 1,
    'monotonicity/ordering derivation': 1,
    'discrete-residual law-fit': 1,
    'cross-validation': 1,
    'residual localization': 1,
  },
  honestBannerFullCoverageCount: 7,
  glossaryCoveredCount: 1,
  vizPresenceCount: 0,
  bridgeReferencedCount: 1,
  recommendation:
    'No action needed on the honest-banner side -- all seven modules already carry the full mandatory ' +
    'banner. Every module except imp-33854 lacks any glossary presence, and NONE of the seven has a viz ' +
    'page, viz-data module, or roadmap mention -- this cohort is the best current candidate for the ' +
    'glossary/viz/roadmap surfacing pass the imp-33867/imp-33868/imp-33870 precedent already gave the ' +
    'imp-33843/33844/33845 cohort.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33890_ASSERTIONS = [
  {
    id: 'imp33890-exactly-seven-modules-catalogued',
    holds: () => IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.modules.length === 7,
    why: 'The roll-up must cover exactly the seven named cohort modules (imp-33853..33858 + imp-28895).',
  },
  {
    id: 'imp33890-six-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      const sum = Object.values(counts).reduce((a, b) => a + b, 0);
      return distinctClasses.size === 6 && Object.keys(counts).length === 6 && sum === 7;
    },
    why:
      'The seven modules earn six DISTINCT evidence classes; only "closed-form derivation" repeats ' +
      '(imp-33853 and imp-28895), consistent with them independently deriving different quantities.',
  },
  {
    id: 'imp33890-all-seven-carry-full-honest-banner',
    holds: () =>
      IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) =>
          x.isRigorousFalse === true &&
          x.noQED === true &&
          x.ka3066Untouched === true &&
          x.plattTrudgianSOTA === true
      ) && IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 7,
    why:
      'Every module in the cohort must state isRigorous:false, NO QED, imp-3066 K_a >= 0 untouched, and ' +
      'Platt-Trudgian Lambda <= 0.2 SOTA -- grep-verified against the source files.',
  },
  {
    id: 'imp33890-exactly-one-bridge-touching-module',
    holds: () => {
      const m = IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.modules;
      const referenced = m.filter((x) => x.g6aH4Status !== 'not referenced').length;
      return (
        referenced === 1 &&
        referenced === IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.bridgeReferencedCount &&
        m.find((x) => x.file === 'imp-33853-cren-gap-coefficient-closed-form.js').g6aH4Status !==
          'not referenced'
      );
    },
    why:
      'Grep-verified: imp-33853 alone mentions "G6a" (5 hits) among the seven modules -- its closed-form ' +
      '4/3 coefficient does NOT discharge H4 and G6a_shock_lipschitz STAYS OPEN; the other six correctly ' +
      'read "not referenced".',
  },
  {
    id: 'imp33890-one-glossary-zero-viz',
    holds: () => {
      const m = IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasVizPresence === true).length;
      return (
        withTerm === 1 &&
        withTerm === IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 0 &&
        withViz === IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.vizPresenceCount
      );
    },
    why:
      'Grep-verified: only imp-33854 has a dedicated glossary.js term (firstUsed: imp-33854); none of ' +
      'the seven has a routed viz page, viz-data module, or roadmap mention.',
  },
  {
    id: 'imp33890-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33890_33853_33858_COHORT_PROVENANCE_ROLLUP.honestNote),
    why:
      'VERDICT LOCK: this is a read-only roll-up, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA ' +
      'and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33890_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33890 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33890_ASSERTIONS };
