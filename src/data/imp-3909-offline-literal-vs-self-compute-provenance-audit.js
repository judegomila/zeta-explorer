/**
 * @module imp-3909-offline-literal-vs-self-compute-provenance-audit
 * @fileoverview imp-3909 -- Provenance-tracking meta note cataloguing which
 * recent A(tau)/plateau modules bake OFFLINE-VERIFIED LITERALS (recorded
 * constants from an offline run, not recomputed at import) versus which
 * quantities self-compute live at import, and the CURRENT reproduction
 * status of each offline literal.
 *
 * SCOPE (read-only audit; no new computation). Three named modules:
 *   - imp-3850-a-weight-dual-path-tau25-30-reconciliation.js
 *   - imp-3874-dpsi-sensitivity-verification.js
 *   - imp-3725-fmb-plateau-domination-lemma.js
 *
 * FINDINGS (audited 2026-07-04, grep/read-verified against each module)
 * -----------------------------------------------------------------------
 * (1) imp-3850: the SIMPSON_HIN_OFFLINE literals (n=2.56e7 at tau=2.5,
 *     n=2.048e8 at tau=3.0) are baked because the uniform-Simpson mesh must
 *     resolve a ~5e-6 / ~6e-7-wide near-s=0 peak, too expensive to
 *     self-compute at import. Reproduction status: FULLY REPRODUCED --
 *     imp-3873-a-weight-offline-literal-independent-reproduction.js supplies
 *     a THIRD, structurally-independent, self-computing peak-scaled
 *     substitution-Simpson quadrature (n<=8000) that agrees with the
 *     graded-GL limit to <1e-9 and with the offline literal to <5e-6 abs
 *     (<1e-8 rel), so the offline run no longer rests unreproduced.
 * (2) imp-3874: the Psi/dPsi/smin/bound scalars (plateaus 0, 4, 9 across 5
 *     thetaBar points) are baked from scripts/imp-3874-dpsi-sensitivity-
 *     verify.mjs, an offline esbuild-bundle scan over zeros-to-1e6.js.
 *     Reproduction status: PARTIAL -- the module's OWN direct Psi_N(T) at
 *     thetaBar=0.99, N=endN cross-checks LIVE against the imp-3725 baked
 *     psiEnd (rel ~1e-6) on the SAME 3 plateaus, but no separate module
 *     independently recomputes the Psi/dPsi/smin scalars themselves.
 * (3) imp-3725: psiEnd (and the full row set H/a/gammaLeft/gammaRight/
 *     theta/...) for all 10 plateaus is baked from an offline scan over
 *     src/data/zeros-to-1e6.js. Reproduction status: PARTIAL -- imp-3874's
 *     direct Psi_N(T) recomputation reproduces the baked psiEnd to relative
 *     ~1e-6, but ONLY on 3 of the 10 plateaus (0, 4, 9); plateaus
 *     1, 2, 3, 5, 6, 7, 8 have NO independent reproduction recorded.
 *
 * So of the three audited modules: 1 FULLY reproduced (imp-3850), 2
 * PARTIALLY reproduced (imp-3874, imp-3725 -- both bottlenecked on the same
 * imp-3725 3-of-10-plateau coverage), 0 wholly unreproduced.
 *
 * RECOMMENDATION. Extend the imp-3874-style direct-Psi_N(T) cross-check to
 * the remaining 7 imp-3725 plateaus (1, 2, 3, 5, 6, 7, 8) -- this closes
 * both the imp-3874 open sub-gap (imp-3874-sub-all-plateaus) and the
 * imp-3725 partial-reproduction gap in one pass, since they share the same
 * bottleneck.
 *
 * HONEST SCOPE. Read-only provenance audit; no new bound, no QED. imp-3066
 * K_a >= 0 positivity untouched. No refereed bound is changed.
 *
 * @see imp-3850-a-weight-dual-path-tau25-30-reconciliation.js
 * @see imp-3873-a-weight-offline-literal-independent-reproduction.js (closes the imp-3850 gap)
 * @see imp-3874-dpsi-sensitivity-verification.js
 * @see imp-3725-fmb-plateau-domination-lemma.js
 * @see imp-3886-3844-3854-cohort-module-surfacing-audit.js (closest prior provenance-audit precedent)
 */

export const IMP_3909_OFFLINE_LITERAL_VS_SELF_COMPUTE_PROVENANCE_AUDIT = {
  id: 'imp-3909',
  auditedAt: '2026-07-04',
  method:
    'Grep/read audit of each named module for baked offline literals (recorded numeric constants ' +
    'not recomputed at import) vs self-computing quantities, cross-referenced against any module ' +
    'that independently reproduces the same literal by a structurally distinct route.',
  modules: [
    {
      file: 'imp-3850-a-weight-dual-path-tau25-30-reconciliation.js',
      ticket: 'imp-3850',
      bakedLiterals: [
        'SIMPSON_HIN_OFFLINE[2.5]: n=2.56e7, -lnA=69198.54066317427',
        'SIMPSON_HIN_OFFLINE[3]: n=2.048e8, -lnA=511309.61253717536',
      ],
      whyBaked: 'uniform-Simpson mesh must resolve a ~5e-6/~6e-7-wide near-s=0 peak; too expensive to self-compute at import',
      reproductionStatus: 'full',
      reproducedBy: 'imp-3873-a-weight-offline-literal-independent-reproduction.js',
      reproductionMethod: 'third structurally-independent SELF-COMPUTING peak-scaled substitution-Simpson (n<=8000) agrees with the graded-GL limit to <1e-9 and with the offline literal to <5e-6 abs / <1e-8 rel',
    },
    {
      file: 'imp-3874-dpsi-sensitivity-verification.js',
      ticket: 'imp-3874',
      bakedLiterals: [
        'Psi/dPsi/smin/bound scalars for plateaus 0, 4, 9 across 5 thetaBar points (scripts/imp-3874-dpsi-sensitivity-verify.mjs)',
      ],
      whyBaked: 'offline esbuild-bundle scan over zeros-to-1e6.js, too heavy to self-compute at import',
      reproductionStatus: 'partial',
      reproducedBy: null,
      reproductionMethod: 'cross-checked LIVE only against the imp-3725 baked psiEnd (rel ~1e-6) on the SAME 3 plateaus; no separate module independently recomputes the Psi/dPsi/smin scalars themselves',
      crossChecksModule: 'imp-3725-fmb-plateau-domination-lemma.js',
    },
    {
      file: 'imp-3725-fmb-plateau-domination-lemma.js',
      ticket: 'imp-3725',
      bakedLiterals: [
        'psiEnd (and full row set H/a/gammaLeft/gammaRight/theta/...) for all 10 plateaus, from an offline scan over src/data/zeros-to-1e6.js',
      ],
      whyBaked: 'derived from an offline Odlyzko-zero scan, not recomputed at import',
      reproductionStatus: 'partial',
      reproducedBy: 'imp-3874-dpsi-sensitivity-verification.js',
      reproductionMethod: 'direct Psi_N(T) at thetaBar=0.99, N=endN reproduces baked psiEnd to rel ~1e-6, but ONLY on 3 of 10 plateaus (0, 4, 9); plateaus 1, 2, 3, 5, 6, 7, 8 have NO independent reproduction recorded',
    },
  ],
  fullyReproducedCount: 1,
  partiallyReproducedCount: 2,
  unreproducedCount: 0,
  recommendation:
    'Extend the imp-3874-style direct-Psi_N(T) cross-check to the remaining 7 imp-3725 plateaus ' +
    '(1, 2, 3, 5, 6, 7, 8): this closes both the imp-3874 open sub-gap (imp-3874-sub-all-plateaus) ' +
    'and the imp-3725 partial-reproduction gap in one pass, since both are bottlenecked on the same ' +
    '3-of-10-plateau coverage.',
  honestNote:
    'Read-only provenance audit; no new computation, no new bound, no QED. imp-3066 K_a >= 0 ' +
    'positivity untouched. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3909_ASSERTIONS = [
  {
    id: 'imp3909-exactly-three-modules-audited',
    holds: () => IMP_3909_OFFLINE_LITERAL_VS_SELF_COMPUTE_PROVENANCE_AUDIT.modules.length === 3,
    why: 'The audit must cover exactly the three named modules (imp-3850, imp-3874, imp-3725).',
  },
  {
    id: 'imp3909-imp3850-fully-reproduced-by-imp3873',
    holds: () => {
      const m = IMP_3909_OFFLINE_LITERAL_VS_SELF_COMPUTE_PROVENANCE_AUDIT.modules.find((x) => x.ticket === 'imp-3850');
      return m && m.reproductionStatus === 'full' &&
        m.reproducedBy === 'imp-3873-a-weight-offline-literal-independent-reproduction.js';
    },
    why: 'imp-3850s offline Simpson literals must be recorded as fully reproduced by imp-3873s independent self-computing quadrature.',
  },
  {
    id: 'imp3909-imp3874-and-imp3725-partial-same-bottleneck',
    holds: () => {
      const m3874 = IMP_3909_OFFLINE_LITERAL_VS_SELF_COMPUTE_PROVENANCE_AUDIT.modules.find((x) => x.ticket === 'imp-3874');
      const m3725 = IMP_3909_OFFLINE_LITERAL_VS_SELF_COMPUTE_PROVENANCE_AUDIT.modules.find((x) => x.ticket === 'imp-3725');
      return m3874 && m3725 && m3874.reproductionStatus === 'partial' && m3725.reproductionStatus === 'partial';
    },
    why: 'Both imp-3874 and imp-3725 must be recorded as PARTIALLY reproduced, since both are bottlenecked on the same 3-of-10-plateau coverage.',
  },
  {
    id: 'imp3909-counts-consistent',
    holds: () => {
      const a = IMP_3909_OFFLINE_LITERAL_VS_SELF_COMPUTE_PROVENANCE_AUDIT;
      const full = a.modules.filter((x) => x.reproductionStatus === 'full').length;
      const partial = a.modules.filter((x) => x.reproductionStatus === 'partial').length;
      const none = a.modules.filter((x) => x.reproductionStatus === 'none').length;
      return full === a.fullyReproducedCount && partial === a.partiallyReproducedCount && none === a.unreproducedCount;
    },
    why: 'The summary counts must match the per-module reproductionStatus tally.',
  },
  {
    id: 'imp3909-honest-scope-locked',
    holds: () => /refereed bound is changed/i.test(IMP_3909_OFFLINE_LITERAL_VS_SELF_COMPUTE_PROVENANCE_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3909_OFFLINE_LITERAL_VS_SELF_COMPUTE_PROVENANCE_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only provenance audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3909_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3909 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3909_ASSERTIONS };
