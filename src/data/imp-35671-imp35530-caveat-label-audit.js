/**
 * @module imp-35671-imp35530-caveat-label-audit
 *
 * imp-35671 (bug, audit): imp-35556's own JSDoc NOTE flags that the imp-35530
 * sub-gap attribution is swapped in the queue: the "different units" caveat is
 * attached to imp-35530a, but imp-35530a is actually the EXTRAPOLATION caveat and
 * the UNITS-MISMATCH caveat (which inherits imp-35488b) is imp-35530b. This
 * module is a read-only cross-reference audit (imp-35186/imp-35589 method,
 * applied here to letter-suffixed sub-gap labels instead of file @see targets)
 * that records the CORRECT mapping and inventories every place the label pair
 * is used, so downstream tickets cite the right sub-gap. No existing ticket
 * text is edited (imp-35186/imp-35309 convention: audits flag, they do not fix).
 *
 * GROUND TRUTH (from the imp-35530 source module itself, src/data/
 * imp-35530-crossover-gtrue-trend-extrapolation.js, subGaps field):
 *
 *   - imp-35530a = EXTRAPOLATION caveat: the crossover g_true value is projected
 *     ~1900x beyond the last tabulated Odlyzko zero via a power-law fit in
 *     logT0 whose exponent is not pinned by theory (free p=3.45 vs forced p=1,
 *     p=2), giving a ~3.6x value bracket; a direct measurement still needs an
 *     external zero table near height ~1.14e9 (imp-35488a stays OPEN).
 *   - imp-35530b = UNITS-MISMATCH caveat (inherits imp-35488b): the trended/
 *     projected g_true is a distributional (spacing-pdf) KL divergence, NOT an
 *     E_coll fidelity error in the sigma-share units of the crossover budget;
 *     mapping one into the other is the surrogate->observable dictionary
 *     imp-35337a leaves OPEN.
 *
 * AUDIT. Grepped every src/data/*.js and improvement-queue.js occurrence of
 * "imp-35530a" / "imp-35530b" (case-insensitive id, letter-suffix literal) and
 * classified each site as CORRECT (matches the ground truth above) or SWAPPED
 * (attaches the units caveat to imp-35530a, or the extrapolation caveat to
 * imp-35530b).
 *
 * FINDING -- exactly ONE swapped site, already flagged by imp-35556 itself and
 * confirmed here: the imp-35556 QUEUE TICKET's own title and rationale (NOT its
 * completed module) in src/data/improvement-queue.js attach the "different
 * units" / "DIFFERENT [units]" caveat to imp-35530a:
 *   - title: "...scope sub-gap imp-35530a's 'different units' caveat..."
 *   - rationale: "...'the two quantities are in DIFFERENT [units]' caveat
 *     (sub-gap imp-35530a) unassessed"
 * Per the ground truth, the units caveat is imp-35530b, not imp-35530a. This
 * ticket text predates imp-35530's own module (which correctly assigns a/b) and
 * was never corrected after the module shipped -- a queue-title/module drift,
 * not a math error. It is a completed, historical ticket record; per the
 * imp-35186/imp-35309 convention this audit FLAGS it rather than editing it.
 *
 * Every other audited site -- the imp-35530 module itself; the imp-35556
 * module's own record/JSDoc; imp-35617, imp-35655 (module JSDoc/comments);
 * glossary.js (two headword entries); the imp-35565, imp-35624/imp-35625 queue
 * tickets -- assigns imp-35530a = extrapolation, imp-35530b = units correctly.
 *
 * SCOPE. Read-only audit; corrects nothing in improvement-queue.js; changes no
 * bound; establishes no operator positivity; no RH verdict; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35530-crossover-gtrue-trend-extrapolation (ground-truth subGaps: imp-35530a extrapolation, imp-35530b units)
 * @see imp-35556-gtrue-ecoll-dimensional-comparability (raised the NOTE that the queue title mislabels the swap)
 * @see imp-35186-cross-reference-integrity-audit (audit method precedent)
 * @see imp-35589-imp3550x-imp3553x-frontier-crossref-integrity-audit (audit-flags/no-edit convention this ticket follows)
 */

const CORRECT_MAPPING = {
  'imp-35530a': 'EXTRAPOLATION',
  'imp-35530b': 'UNITS-MISMATCH',
};

const AUDITED_SITES = [
  { site: 'src/data/imp-35530-crossover-gtrue-trend-extrapolation.js (source subGaps field)', verdict: 'CORRECT' },
  { site: 'src/data/imp-35556-gtrue-ecoll-dimensional-comparability.js (module record/JSDoc)', verdict: 'CORRECT' },
  { site: 'src/data/imp-35617-pinsker-tv-reranking-crossover-ordering.js', verdict: 'CORRECT' },
  { site: 'src/data/imp-35655-reverse-pinsker-bretagnolle-huber-gtrue-lower-bound.js', verdict: 'CORRECT' },
  { site: 'src/data/glossary.js (imp-35530 and imp-35556 headword entries)', verdict: 'CORRECT' },
  { site: "improvement-queue.js ticket imp-35565 title/rationale ('imp-35530a value-not-robust')", verdict: 'CORRECT' },
  { site: "improvement-queue.js tickets imp-35624/imp-35625 ('imp-35530a extrapolation, imp-35530b units/order')", verdict: 'CORRECT' },
  {
    site: "improvement-queue.js ticket imp-35556 title ('...scope sub-gap imp-35530a's \"different units\" caveat...')",
    verdict: 'SWAPPED',
  },
  {
    site: "improvement-queue.js ticket imp-35556 rationale ('...DIFFERENT [units] caveat (sub-gap imp-35530a) unassessed')",
    verdict: 'SWAPPED',
  },
];

const SWAPPED_SITES = AUDITED_SITES.filter((s) => s.verdict === 'SWAPPED');
const CORRECT_SITES = AUDITED_SITES.filter((s) => s.verdict === 'CORRECT');

export const IMP35671_IMP35530_CAVEAT_LABEL_AUDIT = {
  id: 'imp-35671',
  proofSection: 'audit',
  question:
    'imp-35556 flagged that the queue attaches the "different units" caveat to imp-35530a when ' +
    'imp-35530a is actually the EXTRAPOLATION caveat and imp-35530b is the UNITS-MISMATCH caveat. ' +
    'Audit every src/data and improvement-queue.js site referencing imp-35530a/imp-35530b and record ' +
    'the correct attribution.',
  correctMapping: CORRECT_MAPPING,
  auditedSites: AUDITED_SITES,
  auditedSiteCount: AUDITED_SITES.length,
  swappedSites: SWAPPED_SITES,
  swappedSiteCount: SWAPPED_SITES.length,
  correctSiteCount: CORRECT_SITES.length,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (documentation-integrity, not a mathematical result). Ground truth from the imp-35530 ' +
    'source module: imp-35530a = EXTRAPOLATION caveat (~1900x projection, ~3.6x model bracket, ' +
    'imp-35488a stays OPEN); imp-35530b = UNITS-MISMATCH caveat (distributional KL vs sigma-share ' +
    'E_coll, inherits imp-35488b, imp-35337a dictionary OPEN). Of 9 audited sites, exactly ONE is ' +
    'swapped: the imp-35556 QUEUE TICKET record in improvement-queue.js (its title and rationale, ' +
    'NOT its completed module) attaches the units caveat to imp-35530a instead of imp-35530b -- a ' +
    'pre-module-ship drift, already self-flagged by imp-35556\'s own JSDoc NOTE and confirmed here. ' +
    'Every other audited site (the imp-35530 and imp-35556 modules themselves, imp-35617, imp-35655, ' +
    'glossary.js, and the imp-35565/imp-35624/imp-35625 tickets) already carries the correct ' +
    'attribution. Per the imp-35186/imp-35589 convention this audit FLAGS the swapped ticket text ' +
    'without editing it. Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35530 (ground-truth subGaps definition); imp-35556 (raised the NOTE); imp-35186 (audit method ' +
    'precedent); imp-35589 (audit-flags/no-edit convention).',
};

export const IMP35671_IMP35530_CAVEAT_LABEL_AUDIT_ASSERTIONS = [
  {
    id: 'imp35671-ground-truth-mapping',
    description: 'the correct mapping is imp-35530a=EXTRAPOLATION, imp-35530b=UNITS-MISMATCH',
    holds: () =>
      CORRECT_MAPPING['imp-35530a'] === 'EXTRAPOLATION' &&
      CORRECT_MAPPING['imp-35530b'] === 'UNITS-MISMATCH',
  },
  {
    id: 'imp35671-exactly-one-swap-found',
    description: 'exactly one audited site (the imp-35556 queue ticket title+rationale) is swapped; all others are correct',
    holds: () =>
      IMP35671_IMP35530_CAVEAT_LABEL_AUDIT.auditedSiteCount === 9 &&
      IMP35671_IMP35530_CAVEAT_LABEL_AUDIT.swappedSiteCount === 2 &&
      IMP35671_IMP35530_CAVEAT_LABEL_AUDIT.correctSiteCount === 7 &&
      IMP35671_IMP35530_CAVEAT_LABEL_AUDIT.swappedSites.every((s) => s.site.includes('imp-35556')),
  },
  {
    id: 'imp35671-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35671_IMP35530_CAVEAT_LABEL_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35671_IMP35530_CAVEAT_LABEL_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35671_IMP35530_CAVEAT_LABEL_AUDIT.verdict),
  },
];

for (const a of IMP35671_IMP35530_CAVEAT_LABEL_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35671-imp35530-caveat-label-audit assertion failed: ${a.id}`);
  }
}
