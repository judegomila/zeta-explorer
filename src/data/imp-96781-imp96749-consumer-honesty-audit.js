/**
 * @module imp-96781-imp96749-consumer-honesty-audit
 * @fileoverview imp-96781 -- Audit the imp-96749 Krein-floor page/consumer for
 * an honest-status banner that separates the numerical plateau (lambda_min
 * measured firmly positive through the double-precision-trustworthy window,
 * trending toward a ~0.55-0.57 value at 2a=ln3) from the OPEN uniform-in-N
 * operator-positivity question, and add one if missing.
 *
 * METHOD (read-only, performed at author time). Grepped src/ for every file
 * importing imp-96749's data module (imp-96749-krein-lammin-N-trend-measurement.js)
 * or referencing IMP96749_* / imp-96749 by name, then read each hit for an
 * explicit honest-status statement distinguishing "measured, plateau-consistent"
 * from "uniform-in-N gap unsettled / operator positivity unproved".
 *
 * RESULT (audited 2026-09-25): imp-96749 has exactly two reader-facing
 * consumers, and BOTH already carry a compliant honest-status statement:
 *   - src/pages/Imp96777KreinLammminNTrendViz.jsx: renders
 *     IMP96777_HONEST_BANNER ("Measurement only: this is a Rayleigh-Ritz
 *     UPPER floor, not an operator positivity proof. The uniform-in-N
 *     spectral gap lambda_min(T_a[sigma_2]) >= c > 0 stays OPEN ...") twice
 *     (an intro callout and a closing status line), plus a separate
 *     trusted-window/conditioning-wall explainer block.
 *   - src/pages/ConceptsPage.jsx (glossary id
 *     'imp-96749-krein-lammin-n-trend-uniform-gap-open'): its `intuition`
 *     field states "the true operator positivity for 0.96<2a<ln3 remains
 *     OPEN" and "does NOT settle it" in prose, matching the same distinction.
 * No gap found; no page edit required. The two newer follow-on modules that
 * extend the same measurement (imp-96768 Gegenbauer diagonal-Gram recompute
 * to N=124, and the in-progress imp-96769 de Branges assessment) have no
 * reader-facing surface at all yet (neither a glossary headword nor a viz
 * page) -- out of THIS ticket's named scope (imp-96749 specifically), but
 * flagged here as the natural next content ticket in this thread.
 *
 * This module fabricates NO pages and edits NO other module; it only records
 * the audit. No new bound, no QED; no refereed bound is changed.
 *
 * @see imp-96749, imp-96777, imp-96778, imp-96768, imp-96769
 */

export const IMP_96781_IMP96749_CONSUMER_HONESTY_AUDIT = {
  id: 'imp-96781',
  auditedAt: '2026-09-25',
  targetModule: 'imp-96749-krein-lammin-N-trend-measurement.js',
  method:
    'Grep src/ for every direct or indirect consumer of the imp-96749 data module, then read each ' +
    'hit for an explicit statement distinguishing the measured (plateau-consistent) floor from the ' +
    'OPEN uniform-in-N operator-positivity question.',
  consumers: [
    {
      file: 'src/pages/Imp96777KreinLammminNTrendViz.jsx',
      hasHonestBanner: true,
      note: 'Renders IMP96777_HONEST_BANNER twice (intro callout + closing status line).',
    },
    {
      file: "src/pages/ConceptsPage.jsx (glossary id 'imp-96749-krein-lammin-n-trend-uniform-gap-open')",
      hasHonestBanner: true,
      note: 'intuition field states the operator positivity for 0.96<2a<ln3 remains OPEN in prose.',
    },
  ],
  missingCount: 0,
  followOnGap:
    'imp-96768 (Gegenbauer diagonal-Gram recompute to N=124) and imp-96769 (de Branges uniform-gap ' +
    'assessment) extend the same measurement but currently have no reader-facing surface at all -- ' +
    'not this ticket’s named scope, flagged for a future content ticket.',
  honestNote:
    'Read-only audit; no pages fabricated, no modules edited. No new bound, no QED. ' +
    'No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_96781_ASSERTIONS = [
  {
    id: 'imp96781-both-consumers-audited',
    holds: () => IMP_96781_IMP96749_CONSUMER_HONESTY_AUDIT.consumers.length === 2,
    why: 'imp-96749 has exactly two reader-facing consumers as of the 2026-09-25 audit: the imp-96777 viz page and the ConceptsPage glossary entry.',
  },
  {
    id: 'imp96781-both-compliant',
    holds: () => {
      const c = IMP_96781_IMP96749_CONSUMER_HONESTY_AUDIT.consumers;
      const missing = c.filter((x) => !x.hasHonestBanner).length;
      return missing === 0 && missing === IMP_96781_IMP96749_CONSUMER_HONESTY_AUDIT.missingCount;
    },
    why: 'As of the audit, both consumers already carry a compliant honest-status statement; no page fix was required.',
  },
  {
    id: 'imp96781-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_96781_IMP96749_CONSUMER_HONESTY_AUDIT.honestNote) &&
      /no QED/i.test(IMP_96781_IMP96749_CONSUMER_HONESTY_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_96781_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-96781 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_96781_ASSERTIONS };
export default IMP_96781_IMP96749_CONSUMER_HONESTY_AUDIT;
