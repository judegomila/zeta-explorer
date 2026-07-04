/**
 * @module imp-33552-recovery-rate-fit-banner-surfacing-audit
 * @fileoverview imp-33552 -- Audit whether the imp-33243 recovery-rate-fit
 * viz (page + glossary entry) surfaces its own HONEST CAVEAT that the
 * imp-33211 P_r < 1 reading on n in [624,1424] was later found by imp-33230
 * (extending the identical ladder past n=1424) to be a finite-window
 * artifact, not a genuine asymptote.
 *
 * METHOD (read-only, performed at author time). Grep-verified both
 * consumer-facing surfaces named in the ticket:
 *   - src/pages/Imp33243RecoveryRateFitViz.jsx: a dedicated
 *     "Superseded by imp-33230" callout box (distinct from the main
 *     "Reading the chart" box) states P_r crosses 1 at n~1457 and that the
 *     below-1 reading was a finite-window artifact, not an asymptote.
 *   - src/data/glossary.js (the "imp-33211 deep-tail recovery-rate fit"
 *     term, linked from the same page via `link: "/viz-imp33243-recovery-rate-fit"`):
 *     the HONEST SCOPE paragraph states the caveat "proved essential" and
 *     names the same n~1457 crossing, and relatedTerms carries a dedicated
 *     imp-33230 cross-reference line.
 *
 * RESULT (audited 2026-07-04). The supersession banner is NOT missing on
 * either surface -- both already carry it, with matching wording (n~1457
 * crossing, "finite-window artifact"). No banner needed to be added; this
 * module records the audit finding per the imp-33247/imp-3886 audit-series
 * convention rather than leaving the check undocumented.
 *
 * @see imp-33243-recovery-rate-fit-viz-data.js (the HONEST CAVEAT source comment)
 * @see imp-33247-3932-3919-cohort-module-surfacing-audit.js (closest prior audit in this series)
 */

export const IMP_33552_RECOVERY_RATE_FIT_BANNER_SURFACING_AUDIT = {
  id: 'imp-33552',
  auditedAt: '2026-07-04',
  target: 'imp-33243 recovery-rate-fit viz (page + glossary)',
  surfaces: [
    {
      surface: 'page',
      file: 'src/pages/Imp33243RecoveryRateFitViz.jsx',
      bannerPresent: true,
      note: 'dedicated "Superseded by imp-33230" callout box names the n~1457 crossing and "finite-window artifact"',
    },
    {
      surface: 'glossary',
      file: 'src/data/glossary.js',
      bannerPresent: true,
      note: 'HONEST SCOPE paragraph names the n~1457 crossing; relatedTerms carries a dedicated imp-33230 cross-reference line',
    },
  ],
  bannerMissingCount: 0,
  actionTaken: 'none -- both surfaces already carried the supersession banner; audit result recorded only',
  honestNote:
    'Read-only audit; no page or glossary content altered. No new bound, no QED. imp-3066 untouched; ' +
    'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

const IMP_33552_ASSERTIONS = [
  {
    id: 'imp33552-two-surfaces-audited',
    holds: () => IMP_33552_RECOVERY_RATE_FIT_BANNER_SURFACING_AUDIT.surfaces.length === 2,
    why: 'The ticket names exactly two consumer-facing surfaces to check: the viz page and the glossary entry.',
  },
  {
    id: 'imp33552-zero-banners-missing',
    holds: () => {
      const s = IMP_33552_RECOVERY_RATE_FIT_BANNER_SURFACING_AUDIT.surfaces;
      const missing = s.filter((x) => !x.bannerPresent).length;
      return missing === 0 && missing === IMP_33552_RECOVERY_RATE_FIT_BANNER_SURFACING_AUDIT.bannerMissingCount;
    },
    why: 'Grep-verified: both the page callout box and the glossary HONEST SCOPE paragraph already state the imp-33230 supersession.',
  },
  {
    id: 'imp33552-honest-scope-locked',
    holds: () => /SOTA/.test(IMP_33552_RECOVERY_RATE_FIT_BANNER_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_33552_RECOVERY_RATE_FIT_BANNER_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_33552_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33552 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33552_ASSERTIONS };
