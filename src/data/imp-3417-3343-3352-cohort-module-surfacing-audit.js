/**
 * @module imp-3417-3343-3352-cohort-module-surfacing-audit
 * @fileoverview imp-3417 -- Audit whether the imp-334x/335x research modules
 * (the nine data files that actually exist in that id range: imp-3343 through
 * imp-3352) are imported by any page/component consumer or are orphaned data
 * files, and note which orphans deserve surfacing.
 *
 * METHOD (read-only, performed at author time). Same transitive-import-graph
 * method as the imp-3459/3480/3498/3517/3539/3568/3593/3615/3636/3659/3683/
 * 3705/3717 orphan-audit series: a module counts as SURFACED iff its file is
 * reachable via real `from '...'` import edges from some node under src/pages
 * or src/components (including transitively through other reachable data
 * modules). String / comment mentions (JSDoc @see lines, glossary prose
 * citations, object-literal string fields naming a ticket id) do NOT count as
 * an import edge.
 *
 * RESULT (audited 2026-07-03). Seven of the nine are SURFACED, all via one
 * direct import site, src/pages/ClosureRoutesPage.jsx:
 *   - imp-3343-shear-gram-opnorm-equals-volterra-hs-identity.js : SURFACED (ClosureRoutesPage.jsx)
 *   - imp-3344-shear-gram-verdict-scale-factor.js                : SURFACED (ClosureRoutesPage.jsx)
 *   - imp-3345-vhs-richardson-limit.js                            : SURFACED (ClosureRoutesPage.jsx)
 *   - imp-3346-capture-ratio-C-constant-derivation.js             : SURFACED (ClosureRoutesPage.jsx)
 *   - imp-3347-phi-leftmost-zero-vs-nphi.js                       : SURFACED (ClosureRoutesPage.jsx)
 *   - imp-3350-capture-ratio-linear-shear-limit.js                : SURFACED (ClosureRoutesPage.jsx)
 *   - imp-3351-shear-gram-symmetric-spectrum-aU-grid.js           : SURFACED (ClosureRoutesPage.jsx)
 *
 * Two are ORPHAN (no page/component import edge, direct or transitive):
 *   - imp-3349-bridge-ratio-numerical-certification.js : ORPHAN. Independently
 *     certifies the imp-3255 closed-form degree-0 bridge-margin ratio
 *     B/D(s) = (sinh s - s)/(cosh s - s + arcsinh(1) - sqrt2) by DIRECT Simpson
 *     quadrature of the raw integrands (no antiderivative), confirming the
 *     ratio depends only on s = a*U. It is named only in a string field and an
 *     @see comment inside imp-3405-bridge-mass-lambda-scaling-law.js (which is
 *     itself page-reachable) -- that is a citation, not an import, so it does
 *     not transfer reachability. It DOES already have an indirect glossary
 *     mention, cited by name inside the imp-3405 "General lambda-scaling law"
 *     glossary term, but no dedicated glossary term or viz page of its own.
 *     RECOMMEND: queue a viz ticket (k=2 base-cell identity table) -- it is a
 *     completed numerical certification, matching the imp-3665/imp-3670
 *     precedent of "measurement complete, needs its own display".
 *   - imp-3352-phi-quantitative-floor.js : ORPHAN, no consumers at all. Derives
 *     a strictly-positive quantitative pointwise floor f(u) = T_1(u) > 0 for
 *     the truncated de Bruijn-Newman kernel Phi_NPHI(u) on [0, U] (sharpening
 *     imp-3257's >= 0 result), and explicitly assesses -- concluding NO -- that
 *     this floor feeds the still-open imp-3197 operator-norm magnitude bridge
 *     obstruction (the floor decays super-exponentially past u ~ 0.25 while the
 *     obstruction needs a uniform bound). No glossary term, no viz page.
 *     RECOMMEND: queue a glossary entry -- the "floor exists but doesn't help"
 *     negative result is exactly the kind of honest-scope finding this repo's
 *     glossary records (imp-3603/imp-3624/imp-3648 sensitivity-utility
 *     precedent does not apply here since this is a narrative derivation, not
 *     a robustness check).
 *
 * RECOMMENDATION. imp-3349 and imp-3352 should each get one new queued ticket
 * (a viz ticket for imp-3349, a glossary ticket for imp-3352) per the notes
 * above; this module fabricates no pages itself, it only records the audit.
 * No new bound, no QED; Platt-Trudgian Lambda <= 0.2 stays SOTA.
 *
 * @see imp-3459, imp-3480, imp-3498, imp-3517, imp-3539, imp-3568, imp-3593, imp-3615, imp-3636, imp-3659, imp-3683, imp-3705, imp-3717 (the prior audits in this series)
 */

export const IMP_3417_3343_3352_COHORT_MODULE_SURFACING_AUDIT = {
  id: 'imp-3417',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages and src/components node over relative ' +
    '`from` imports (including a trailing .js extension); SURFACED iff the module file is ' +
    'reachable, ORPHAN otherwise. String/comment/object-literal-string mentions of a ticket id ' +
    'do not count as an import edge.',
  modules: [
    { file: 'imp-3343-shear-gram-opnorm-equals-volterra-hs-identity.js', surfaced: true, importer: 'src/pages/ClosureRoutesPage.jsx' },
    { file: 'imp-3344-shear-gram-verdict-scale-factor.js', surfaced: true, importer: 'src/pages/ClosureRoutesPage.jsx' },
    { file: 'imp-3345-vhs-richardson-limit.js', surfaced: true, importer: 'src/pages/ClosureRoutesPage.jsx' },
    { file: 'imp-3346-capture-ratio-C-constant-derivation.js', surfaced: true, importer: 'src/pages/ClosureRoutesPage.jsx' },
    { file: 'imp-3347-phi-leftmost-zero-vs-nphi.js', surfaced: true, importer: 'src/pages/ClosureRoutesPage.jsx' },
    { file: 'imp-3349-bridge-ratio-numerical-certification.js', surfaced: false, hasGlossaryTerm: 'indirect (cited inside imp-3405 term)', hasVizPage: false, recommendation: 'queue viz ticket' },
    { file: 'imp-3350-capture-ratio-linear-shear-limit.js', surfaced: true, importer: 'src/pages/ClosureRoutesPage.jsx' },
    { file: 'imp-3351-shear-gram-symmetric-spectrum-aU-grid.js', surfaced: true, importer: 'src/pages/ClosureRoutesPage.jsx' },
    { file: 'imp-3352-phi-quantitative-floor.js', surfaced: false, hasGlossaryTerm: false, hasVizPage: false, recommendation: 'queue glossary ticket' },
  ],
  surfacedCount: 7,
  orphanCount: 2,
  recommendation:
    'imp-3349 (glossary-cited only, no dedicated term or viz) should get a queued viz ticket; ' +
    'imp-3352 (no consumer at all) should get a queued glossary ticket for its negative "floor ' +
    'exists but does not feed the imp-3197 magnitude obstruction" finding.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3417_ASSERTIONS = [
  {
    id: 'imp3417-exactly-nine-modules-audited',
    holds: () => IMP_3417_3343_3352_COHORT_MODULE_SURFACING_AUDIT.modules.length === 9,
    why: 'The audit must cover exactly the nine imp-334x/335x data modules that actually exist (imp-3343..imp-3352, skipping the unused ids in that range).',
  },
  {
    id: 'imp3417-seven-surfaced-two-orphan',
    holds: () => {
      const m = IMP_3417_3343_3352_COHORT_MODULE_SURFACING_AUDIT.modules;
      const surfaced = m.filter((x) => x.surfaced).length;
      const orphan = m.filter((x) => !x.surfaced).length;
      return surfaced === 7 && orphan === 2 &&
        surfaced === IMP_3417_3343_3352_COHORT_MODULE_SURFACING_AUDIT.surfacedCount &&
        orphan === IMP_3417_3343_3352_COHORT_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'Seven of the nine imp-3343..imp-3352 modules are imported by ClosureRoutesPage.jsx; imp-3349 and imp-3352 have zero page/component import edges as of the 2026-07-03 audit.',
  },
  {
    id: 'imp3417-orphans-are-3349-and-3352',
    holds: () => {
      const m = IMP_3417_3343_3352_COHORT_MODULE_SURFACING_AUDIT.modules;
      const orphans = m.filter((x) => !x.surfaced).map((x) => x.file);
      return orphans.length === 2 &&
        orphans.some((f) => f.startsWith('imp-3349')) &&
        orphans.some((f) => f.startsWith('imp-3352'));
    },
    why: 'The two orphaned modules must be exactly imp-3349-bridge-ratio-numerical-certification.js and imp-3352-phi-quantitative-floor.js.',
  },
  {
    id: 'imp3417-honest-scope-locked',
    holds: () => /SOTA/.test(IMP_3417_3343_3352_COHORT_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3417_3343_3352_COHORT_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_3417_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3417 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3417_ASSERTIONS };
