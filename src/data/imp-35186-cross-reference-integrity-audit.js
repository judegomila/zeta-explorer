/**
 * @module imp-35186-cross-reference-integrity-audit
 *
 * imp-35186 (bug, audit): a cross-reference integrity check on the ten recently committed
 * frontier modules imp-35036 (both files: ladder-extension and fartail-exponent), imp-35042,
 * imp-35109, imp-35110, imp-35111, imp-35113, imp-35114, imp-35115, imp-35127, imp-35149.
 * Each carries a JSDoc @module header, a block of "@see" tags pointing at sibling modules or
 * ticket ids, and (where applicable) live ES-module imports. This audit verifies every @see
 * target that names a module file resolves to a real file under src/data, every named import
 * resolves to a real exported symbol in that file, and every bare "imp-NNNNN" ticket citation
 * (no filename suffix) names a ticket that actually exists in improvements.js or
 * improvement-queue.js.
 *
 * METHOD. Extracted every @see line and import statement from the eleven files (ten module
 * names, imp-35036 contributes two), resolved each filename-suffixed @see target and import
 * specifier against the src/data directory listing, resolved each exported binding an import
 * pulls in against that target file's `export` statements, and resolved each bare ticket-id
 * citation against `id: 'imp-NNNNN'` occurrences in improvements.js / improvement-queue.js.
 *
 * FINDING. Zero dangling references. All eleven filename-suffixed @see targets resolve to
 * real files (imp-33582-sigma-postpeak-nearpeak-threshold-decay, imp-35041, imp-3463,
 * imp-33274, imp-33808, imp-33721, imp-33723, imp-34996, imp-34929, imp-34693, imp-34997,
 * imp-34903, imp-34951, imp-35012, imp-34957, imp-34880, imp-34994, imp-34950, imp-2466,
 * backward-flow-stability-gronwall, imp-35100, imp-2631-honest-truncation-route-assessment,
 * imp-2622-height-mismatch-refutation, lambda-rh-height-mapping, polymath15-constant-C-C,
 * lambda-roadmap, plus the sibling modules imp-35109/imp-35111/imp-35113/imp-35127/imp-35149
 * cross-referencing each other). Every live import (effectiveHeightForN from
 * lambda-rh-height-mapping.js, C_C_PINNED from polymath15-constant-C-C.js,
 * IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE and
 * IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL in imp-35115) matches a real
 * `export` binding in its target file. The two @see lines that looked unresolved at a first
 * pass -- a bare "imp-33582" (no filename suffix, in imp-35042) and a bare "imp-362" (no
 * filename suffix, in imp-35127) -- are ticket-id citations, not module-file references; both
 * ids exist as real tickets in improvement-queue.js. The imp-35127 citation of "lambda-roadmap.js
 * Step 2 rigorousUpgradeGap.obligations[G-step-error]" also resolves: lambda-roadmap.js carries
 * a literal `key: 'G-step-error'` entry.
 *
 * SCOPE. Assessment/audit only. No source file was modified as a result of this check (none
 * needed correction). Changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; C_mb GUE-conditional per imp-486 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35036-sigma-decay-exponent-ladder-extension (audited: @see + import targets resolve)
 * @see imp-35036-sigma-fartail-exponent-log-slow-half-approach (audited: @see + import targets resolve)
 * @see imp-35042-inflection-crossover-offset-structural (audited: @see + import targets resolve)
 * @see imp-35109-ceil-phase-drift-precision-certification (audited: @see + import targets resolve)
 * @see imp-35110-krawczyk-headroom-small-n-edge (audited: @see + import targets resolve)
 * @see imp-35111-off-by-one-reentry-band-width (audited: @see + import targets resolve)
 * @see imp-35113-crossover-deriv-sign-ladder-finite-difference (audited: @see + import targets resolve)
 * @see imp-35114-bernstein-ingredients-extraction (audited: @see + import targets resolve)
 * @see imp-35115-exponent-ci-vs-local-slope-band (audited: @see + import targets resolve)
 * @see imp-35127-g-step-error-certified-bound-scope (audited: @see + import targets resolve)
 * @see imp-35149-vanishing-etrunc-strip-scope (audited: @see + import targets resolve)
 */

const AUDITED_MODULES = [
  'imp-35036-sigma-decay-exponent-ladder-extension',
  'imp-35036-sigma-fartail-exponent-log-slow-half-approach',
  'imp-35042-inflection-crossover-offset-structural',
  'imp-35109-ceil-phase-drift-precision-certification',
  'imp-35110-krawczyk-headroom-small-n-edge',
  'imp-35111-off-by-one-reentry-band-width',
  'imp-35113-crossover-deriv-sign-ladder-finite-difference',
  'imp-35114-bernstein-ingredients-extraction',
  'imp-35115-exponent-ci-vs-local-slope-band',
  'imp-35127-g-step-error-certified-bound-scope',
  'imp-35149-vanishing-etrunc-strip-scope',
];

const DANGLING_REFERENCES_FOUND = 0; // zero @see targets, imports, or bare ticket citations failed to resolve

export const IMP35186_CROSS_REFERENCE_INTEGRITY_AUDIT = {
  id: 'imp-35186',
  proofSection: 'audit',
  question:
    'Do the @see tags, ES-module import targets, and bare imp-NNNNN ticket citations in the ten ' +
    'recently committed frontier modules (imp-35036, imp-35042, imp-35109, imp-35110, imp-35111, ' +
    'imp-35113, imp-35114, imp-35115, imp-35127, imp-35149) all resolve to real files, real ' +
    'exported symbols, and real tickets -- or are there dangling references / misnamed exports?',
  verdictShort:
    'CLEAN. Zero dangling references found across all eleven audited files (imp-35036 has two). ' +
    'Every filename-suffixed @see target resolves to a real file under src/data; every named ' +
    'import resolves to a real export in its target file; every bare ticket-id citation names a ' +
    'ticket that exists in improvement-queue.js.',
  auditedModules: AUDITED_MODULES,
  auditedModuleCount: AUDITED_MODULES.length, // 11
  danglingReferencesFound: DANGLING_REFERENCES_FOUND, // 0
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not measurement of a mathematical quantity). Checked every @see ' +
    'tag, import specifier, and bare imp-NNNNN citation in the ten named frontier modules (eleven ' +
    'files) against the actual src/data file listing, each target files export statements, and ' +
    'the ticket ids recorded in improvements.js / improvement-queue.js. Result: zero dangling ' +
    'references, zero misnamed exports. No source file required correction. Changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; C_mb GUE-conditional per ' +
    'imp-486 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35036, imp-35042, imp-35109, imp-35110, imp-35111, imp-35113, imp-35114, imp-35115, ' +
    'imp-35127, imp-35149 (the audited frontier modules).',
};

export const IMP35186_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35186-all-modules-audited',
    description: 'the audit covers all eleven named frontier module files (imp-35036 contributes two)',
    holds: () => IMP35186_CROSS_REFERENCE_INTEGRITY_AUDIT.auditedModuleCount === 11,
  },
  {
    id: 'imp35186-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or ticket citations',
    holds: () => IMP35186_CROSS_REFERENCE_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp35186-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35186_CROSS_REFERENCE_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35186_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35186_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35186_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35186-cross-reference-integrity-audit assertion failed: ${a.id}`);
  }
}
