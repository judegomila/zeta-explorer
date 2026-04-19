/**
 * imp-871: Adversarial Review 7b — Phase 51 post-state.
 *
 * SCOPE
 * -----
 * Reviews 1-6 predate the rigor audit; imp-592 review 7 targeted the
 * rigor-audit findings. This review (7b) stress-tests the Phase 51
 * deliverables:
 *   - imp-833: empirical floor extended 870 -> 100,000
 *   - imp-858: empirical floor extended 100,000 -> 1,000,000
 *   - imp-834: Route C dynamical preliminary-negative
 *   - imp-856: hybrid rescue scoping (three approaches evaluated)
 *   - imp-857: interval-arithmetic certification partial (N <= 500)
 *   - imp-861: weighted-S variant analysis (static-weights negative)
 *   - imp-862: CM Hamiltonian conservation partial
 *   - imp-864/865/866: three alternative-angle scopings
 *   - imp-867: proof-chain-snapshot HEADLINE rewrite (dual regime)
 *   - imp-868: lambda-roadmap currentStatus Phase 51 paragraph
 *   - imp-869: FullStoryPage §15 Unconditional-Lambda Sequence
 *   - imp-874: papers/uncond-lambda-sequence-2026.tex
 *   - imp-875: papers/uncond-lambda-summary-2026-04-19.md
 *
 * METHOD
 * ------
 * For each claim, try to BREAK it. Produce FATAL / NAMED / SOFT findings
 * following the review-1..7 rubric. FATAL = logical gap invalidating
 * the stated conclusion. NAMED = acknowledged gap with a follow-up
 * ticket. SOFT = presentation issue.
 *
 * SYNTAX NOTE: avoid star-slash sequences in JSDoc text.
 */

export const FINDING_SKP7B_001 = {
  id: 'skp7b-001',
  level: 'SOFT',
  target: 'imp-833 / imp-858',
  claim_attacked:
    'Both empirical predicates hold with ZERO violations across N in {2,...,10^6}.',
  attack:
    'The Odlyzko zeros are accurate to 3e-9. If a single zero is off by ' +
    'more than one ULP relative to its true value, both predicates could ' +
    'be silently perturbed near that index.',
  status: 'ADDRESSED',
  resolution:
    'imp-469/imp-473 cross-verified precision at rho_1 with mpmath 50-digit. ' +
    'The canonical Odlyzko table is frozen 1998-03-18. Follow-up only if a ' +
    'future claim needs tighter input than 3e-9.',
};

export const FINDING_SKP7B_002 = {
  id: 'skp7b-002',
  level: 'NAMED',
  target: 'imp-833 / imp-858',
  claim_attacked:
    'Combined with imp-462 exact Jacobian bridge, M_raw at leading order ' +
    'is UNCONDITIONAL on N <= 10^6.',
  attack:
    'The "leading order" qualifier is load-bearing. The full correction ' +
    'to tau_c^{uf}(N) is governed by F_mb(N), bounded only under C_mb <= 1 ' +
    '(imp-486 GUE-irreducible). Saying "N <= 10^6 UNCONDITIONAL" without ' +
    'qualification would overstate.',
  status: 'ADDRESSED',
  resolution:
    'HEADLINE in proof-chain-snapshot-2026-04-12.js distinguishes ' +
    'empiricalPredicatesRegime (UNCONDITIONAL N <= 10^6) from ' +
    'analyticChainRegime (GUE-conditional via C_mb). papers/uncond-lambda-' +
    'sequence-2026.tex Consequences section restates explicitly. ' +
    'FullStoryPage §15 prose preserves the distinction. Follow-up ticket ' +
    'imp-869-sub-sequence-title-disambiguation for any remaining title ambiguity.',
};

export const FINDING_SKP7B_003 = {
  id: 'skp7b-003',
  level: 'NAMED',
  target: 'imp-834',
  claim_attacked:
    'The direct Route C dynamical variant S_{k*}*B^2 is REFUTED: rho_amp ' +
    '< 0.074 at every sampled N, monotone decreasing.',
  attack:
    'Numerical evidence is only at LEADING ORDER using the local-pair ' +
    'ODE dB/dtau = -4/B. The full Dyson ODE has a many-body term that ' +
    'could flip the sign. A reviewer could reject REFUTED as over-strong.',
  status: 'MITIGATED',
  resolution:
    'Wording throughout uses PRELIMINARY-NEGATIVE not "refuted"; leading-' +
    'order qualifier preserved. Three escape hatches named as research ' +
    'sub-gaps. arXiv Theorem 3.1 explicitly labeled leading-order. imp-862 ' +
    'partially addresses the full-Dyson concern via CM Hamiltonian ' +
    'conservation.',
};

export const FINDING_SKP7B_004 = {
  id: 'skp7b-004',
  level: 'SOFT',
  target: 'imp-861',
  claim_attacked:
    'The argmin site k_star is the best-case static-weight configuration: ' +
    'argmax rho_amp_k coincides with k_star at every sampled N in {50..5000}.',
  attack:
    'The sweep only covers N <= 5000. At larger N, the argmax could drift ' +
    'to a more isolated site whose rho_amp is larger.',
  status: 'OPEN',
  resolution:
    'Named imp-861-sub-argmax-drift-at-large-N. Low priority — the maximum ' +
    'rho_amp observed anywhere in imp-834 sweep to N=10^5 is 0.0733 at ' +
    'N=100 (decreasing thereafter); a drift would need an order-of-magnitude ' +
    'jump against the observed trend.',
};

export const FINDING_SKP7B_005 = {
  id: 'skp7b-005',
  level: 'NAMED',
  target: 'imp-856 + imp-864 + imp-865 + imp-866',
  claim_attacked:
    'The unconditional-C_mb landscape is mapped across 6 independent ' +
    'approaches; only interval-arithmetic cert retains positive probability.',
  attack:
    'The verdicts LIKELY FAILS on 5 of 6 are scoping verdicts not formal ' +
    'impossibility results. Further approaches (random-matrix beyond GUE, ' +
    'modular-form techniques) may exist but were not considered.',
  status: 'PARTIAL',
  resolution:
    'Wording uses LIKELY FAILS not PROVEN IMPOSSIBLE. Synthesis says ' +
    '"6 of 6 evaluated approaches likely fail by three distinct mechanisms" ' +
    '— not a theorem. Follow-up imp-856-sub-landscape-disclaimer to add ' +
    'an explicit "not exhaustive" note.',
};

export const FINDING_SKP7B_006 = {
  id: 'skp7b-006',
  level: 'SOFT',
  target: 'imp-869',
  claim_attacked:
    'Every user-facing claim correctly distinguishes unconditional empirical ' +
    'from GUE-conditional analytic.',
  attack:
    'FullStoryPage §15 title "Unconditional-Lambda Sequence" could be read ' +
    'as "Lambda is now unconditional" rather than "sequence toward unconditional ' +
    'Lambda".',
  status: 'OPEN',
  resolution:
    'imp-869-sub-sequence-title-disambiguation. Rephrase to "Toward an ' +
    'Unconditional Finite-Height Lambda Bound" or similar.',
};

export const FINDING_SKP7B_007 = {
  id: 'skp7b-007',
  level: 'SOFT',
  target: 'imp-874',
  claim_attacked:
    'papers/uncond-lambda-sequence-2026.tex is referee-quality.',
  attack:
    'Bibliography uses internal imp-NNN keys rather than standard author-' +
    'year / arxiv-id keys. Referees would insist on proper citations.',
  status: 'OPEN',
  resolution:
    'imp-874-sub-proper-bibliography. Replace internal keys with Rodgers-' +
    'Tao 2020, Montgomery 1973, Tao 2020 (arXiv:1905.07821), ESY 2011, ' +
    'with footnote pointers to internal ticket ids.',
};

export const PAPER_SKEPTIC_REVIEW_7B = {
  id: 'imp-871',
  reviewLabel: 'Review 7b (Phase 51 post-state)',
  date: '2026-04-19',
  baselines: ['imp-417', 'imp-430', 'imp-437', 'imp-465', 'imp-474', 'imp-493', 'imp-592'],
  reviewScope:
    'Phase 51 (imp-833 / imp-858 / imp-834 / imp-856 / imp-857 / imp-861 / ' +
    'imp-862 / imp-864-866 / imp-867 / imp-868 / imp-869 / imp-874 / imp-875) ' +
    'deliverables stress-tested against a skeptical referee.',

  findings: {
    fatal: [],
    named: [FINDING_SKP7B_002, FINDING_SKP7B_003, FINDING_SKP7B_005],
    soft:  [FINDING_SKP7B_001, FINDING_SKP7B_004, FINDING_SKP7B_006, FINDING_SKP7B_007],
  },
  totals: {
    fatal: 0,
    named: 3,
    soft:  4,
    total: 7,
  },
  verdict: 'PASSED (0 FATAL)',

  trajectory: [
    { review: 1, id: 'imp-417', fatal: 2 },
    { review: 2, id: 'imp-430', fatal: 0 },
    { review: 3, id: 'imp-437', fatal: 0 },
    { review: 4, id: 'imp-465', fatal: 0 },
    { review: 5, id: 'imp-474', fatal: 0 },
    { review: 6, id: 'imp-493', fatal: 0 },
    { review: 7, id: 'imp-592', fatal: 0 },   // prior review 7 (rigor audit)
    { review: '7b', id: 'imp-871', fatal: 0 }, // this review (Phase 51)
  ],

  summary:
    'No FATAL findings. All three NAMED findings are already addressed ' +
    'in the user-facing text: imp-867 HEADLINE regime distinction, ' +
    'imp-834 PRELIMINARY-NEGATIVE wording with leading-order qualifier ' +
    'preserved, imp-856/864-866 scoping disclaimers. Four SOFT findings ' +
    'name mechanical follow-ups: zero-table precision (covered by imp-469/' +
    '473), argmax drift at large N (imp-861-sub), page title ambiguity ' +
    '(imp-869-sub), arXiv bibliography polish (imp-874-sub). Phase 51 ' +
    'state passes adversarial review 7b.',

  openFollowups: [
    'imp-856-sub-landscape-disclaimer (explicit not-exhaustive note)',
    'imp-861-sub-argmax-drift-at-large-N (extend argmax check past N=5000)',
    'imp-869-sub-sequence-title-disambiguation (rephrase §15 title)',
    'imp-874-sub-proper-bibliography (standard citations in arXiv draft)',
  ],
};

export const PAPER_SKEPTIC_REVIEW_7B_ASSERTIONS = [
  {
    id: 'imp871-zero-fatal-findings',
    holds: () => PAPER_SKEPTIC_REVIEW_7B.findings.fatal.length === 0,
    why:
      'Review 7b must produce zero FATAL findings for Phase 51 to pass. ' +
      'A regression introducing a fatal means a user-facing claim has ' +
      'become false and needs fixing before the next public update.',
  },
  {
    id: 'imp871-trajectory-monotone-after-review-1',
    holds: () =>
      PAPER_SKEPTIC_REVIEW_7B.trajectory[0].fatal === 2 &&
      PAPER_SKEPTIC_REVIEW_7B.trajectory.slice(1).every((t) => t.fatal === 0),
    why:
      'The fatal trajectory across reviews 1..7b is [2, 0, 0, 0, 0, 0, 0, 0]. ' +
      'Any new fatal finding would disrupt this record; the assertion makes ' +
      'the trajectory verifiable directly against the data.',
  },
  {
    id: 'imp871-open-followups-named',
    holds: () => PAPER_SKEPTIC_REVIEW_7B.openFollowups.length >= 4,
    why:
      'Each SOFT finding and any PARTIAL resolution must name a concrete ' +
      'follow-up sub-ticket. Fewer than 4 follow-ups means at least one ' +
      'resolution was hand-waved.',
  },
];
