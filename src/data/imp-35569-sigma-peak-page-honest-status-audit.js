/**
 * @module imp-35569-sigma-peak-page-honest-status-audit
 *
 * imp-35569 (meta, audit): does the sigma-peak analysis PAGE surface both the imp-35536
 * peak height-map-ROBUSTNESS verdict and the imp-35451 arm-asymmetry cubic-skew, or does
 * quoting one without the other leave the peak looking more precise (more symmetric) than
 * it is?
 *
 * SCOPE. The only rendered page tied to the imp-35337 interior sigma peak's height-map
 * behaviour is Imp35561PeakHeightMapSensitivityViz.jsx (route
 * /viz-imp35561-peak-height-map-sensitivity, data module
 * imp-35561-peak-height-map-sensitivity-viz-data.js). No page exists for imp-35451
 * (arm-asymmetry), imp-35492 (plateau arm sqrt-law), or imp-35557 (cubic-skew cross-check
 * under the same height-map perturbation) -- all three are data-module-only.
 *
 * FINDING 1 (surfaced). The page DOES faithfully surface the imp-35536 robustness verdict:
 * the six-row sigma_max/N_max table, the sigma_max spread ([0.9417, 0.9507], under 1
 * percent), the N_max drift (up to +0.16 decades), and the "peak LOCATION should be quoted
 * to about one significant figure" guidance are all present in the page body.
 *
 * FINDING 2 (gap). The page does NOT mention that the peak is asymmetric. imp-35451 found
 * a NEGATIVE cubic-skew coefficient c3 ~ -2.623677e-4 (rising arm wider than falling arm,
 * arm-imbalance slope A_skew ~ 11.01 decades/tol), and imp-35557 confirmed that skew
 * INHERITS the same height-map robustness the page reports for sigma_max/N_max (full-pair
 * spread ~1.85 percent of |c3| under RvM x {1.02, 0.98}, ~17x more relatively sensitive
 * than sigma_max but still well-damped in absolute terms). A reader who sees only the
 * page's robust-sigma_max / one-sig-fig-N_max framing, with no asymmetry mentioned, could
 * reasonably infer the peak is a clean symmetric extremum measured to that same precision
 * in both directions -- it is not: the rising and falling arms have measurably different
 * widths, and that asymmetry is itself a robust (not fragile) feature.
 *
 * DISPOSITION. Read-only audit per the imp-35569 ticket description ("Audit only; edits no
 * page in this ticket"). This module records the gap so a future content/ux ticket can add
 * a short asymmetry note to Imp35561PeakHeightMapSensitivityViz.jsx (or build a dedicated
 * imp-35451/imp-35557 page) rather than the gap going unrecorded. Changes no bound;
 * establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35561-peak-height-map-sensitivity-viz-data.js (the audited page's data module)
 * @see src/pages/Imp35561PeakHeightMapSensitivityViz.jsx (the audited page)
 * @see imp-35536-peak-height-map-sensitivity.js (the robustness verdict the page surfaces)
 * @see imp-35451-sigma-peak-arm-asymmetry.js (the cubic-skew finding the page omits)
 * @see imp-35557-cubic-skew-height-map-sensitivity.js (confirms the skew inherits the same robustness)
 */

export const IMP35569_SIGMA_PEAK_PAGE_HONEST_STATUS_AUDIT = {
  id: 'imp-35569',
  proofSection: 'S-frontier',
  question:
    'Does the sigma-peak analysis page surface both the imp-35536 height-map-robustness verdict ' +
    'and the imp-35451 arm-asymmetry cubic-skew, or does omitting the skew leave the peak looking ' +
    'more symmetric/precise than it is?',
  auditedPage: {
    file: 'src/pages/Imp35561PeakHeightMapSensitivityViz.jsx',
    route: '/viz-imp35561-peak-height-map-sensitivity',
    dataModule: 'src/data/imp-35561-peak-height-map-sensitivity-viz-data.js',
  },
  findings: {
    F1_robustness_surfaced:
      'The page faithfully surfaces the imp-35536 verdict: the six-row sigma_max/N_max table, ' +
      'the sigma_max spread band [0.9417, 0.9507] (under 1 percent), the N_max drift (up to ' +
      '+0.16 decades), and the one-significant-figure location-quoting guidance are all present.',
    F2_skew_not_surfaced:
      'The page does NOT mention the imp-35451 cubic-skew arm-asymmetry (c3 ~ -2.623677e-4, ' +
      'A_skew ~ 11.01) or the imp-35557 finding that the skew inherits the same height-map ' +
      'robustness. No page exists at all for imp-35451/imp-35492/imp-35557.',
    F3_honest_status_gap:
      'Quoting only the robust sigma_max / one-sig-fig N_max framing, with no asymmetry ' +
      'mentioned, risks the reader inferring a clean symmetric extremum. The peak is measurably ' +
      'asymmetric (rising arm wider), and that asymmetry is itself robust, not fragile -- both ' +
      'facts are currently invisible on the only sigma-peak page that exists.',
  },
  recommendation:
    'A follow-up content/ux ticket should add a short asymmetry note (citing imp-35451/imp-35557) ' +
    'to Imp35561PeakHeightMapSensitivityViz.jsx, or ship a dedicated page for the skew finding, so ' +
    'the robust-height and asymmetric-shape facts are read together.',
  isRigorous: false,
  verdict:
    'AUDIT ONLY (meta, read-only per ticket scope). The imp-35561 page surfaces the imp-35536 ' +
    'height-map-robustness verdict correctly but omits the imp-35451/imp-35557 cubic-skew ' +
    'arm-asymmetry entirely -- a real honest-status gap, now recorded for a follow-up fix. No page ' +
    'edited in this ticket; changes no bound; establishes no operator positivity; no RH verdict; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35536 (height-map robustness verdict, surfaced); imp-35451 (cubic-skew arm-asymmetry, not ' +
    'surfaced); imp-35557 (skew inherits robustness, not surfaced); imp-35561 (the audited page and ' +
    'its data module).',
};

export const IMP35569_SIGMA_PEAK_PAGE_HONEST_STATUS_AUDIT_ASSERTIONS = [
  {
    id: 'imp35569-audited-page-identified',
    description: 'The audited page and its data module are named explicitly',
    holds: () =>
      IMP35569_SIGMA_PEAK_PAGE_HONEST_STATUS_AUDIT.auditedPage.file ===
        'src/pages/Imp35561PeakHeightMapSensitivityViz.jsx' &&
      IMP35569_SIGMA_PEAK_PAGE_HONEST_STATUS_AUDIT.auditedPage.dataModule ===
        'src/data/imp-35561-peak-height-map-sensitivity-viz-data.js',
  },
  {
    id: 'imp35569-gap-recorded',
    description: 'The skew-not-surfaced gap is recorded in findings',
    holds: () => /cubic-skew/.test(IMP35569_SIGMA_PEAK_PAGE_HONEST_STATUS_AUDIT.findings.F2_skew_not_surfaced),
  },
  {
    id: 'imp35569-honesty-gate-no-qed',
    description: 'Audit only, no QED, no refereed bound is changed, no page edited claim present',
    holds: () =>
      IMP35569_SIGMA_PEAK_PAGE_HONEST_STATUS_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35569_SIGMA_PEAK_PAGE_HONEST_STATUS_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35569_SIGMA_PEAK_PAGE_HONEST_STATUS_AUDIT.verdict) &&
      /No page edited/.test(IMP35569_SIGMA_PEAK_PAGE_HONEST_STATUS_AUDIT.verdict),
  },
];

for (const a of IMP35569_SIGMA_PEAK_PAGE_HONEST_STATUS_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35569-sigma-peak-page-honest-status-audit assertion failed: ${a.id}`);
  }
}

export default IMP35569_SIGMA_PEAK_PAGE_HONEST_STATUS_AUDIT;
