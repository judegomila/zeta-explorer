/**
 * @module imp-35348-reentry-band-cohort-provenance-rollup
 * @fileoverview imp-35348 -- provenance roll-up cataloguing the five named ids requested as "the
 * imp-35243 reentry-band cohort" (imp-34997, imp-35109, imp-35111, imp-35174, imp-35243), one row per
 * module recording its verdict and the shared single-rate log-law + machine-epsilon-floor surrogate
 * provenance, mirroring the imp-35322/imp-33759 roll-up pattern.
 *
 * UNLIKE imp-35322 (which found only 3 of 5 named ids resolved), all FIVE ids named in this ticket are
 * status: 'completed' in src/data/improvement-queue.js with dedicated modules: imp-34997 (locates the
 * finite ~15-decade off-by-one phase gap and its ~10^27.08 reentry), imp-35109 (certifies the ceil-phase
 * drift and reentry point in cancellation-free double-double arithmetic), imp-35111 (measures the
 * reappearing band width and its ~10^37.17 exit on the double surrogate), imp-35174 (certifies the band
 * width/exit edges in dd arithmetic, discharging the ARITHMETIC half of imp-35111a), and imp-35243
 * (assesses the SURROGATE-FIDELITY half, finding it unreachable and re-pointing the sub-gap as
 * imp-35243a, which stays OPEN).
 *
 * METHOD (read-only, performed at author time). Each of the five ids was checked against
 * src/data/improvement-queue.js for status; each dedicated module (imp-34997-iters-to-floor-tail-grid-
 * refinement.js, imp-35109-ceil-phase-drift-precision-certification.js, imp-35111-off-by-one-reentry-
 * band-width.js, imp-35174-reentry-band-precision-certification.js, imp-35243-reentry-band-surrogate-
 * fidelity-assessment.js) was read for its verdict field; each id was grepped against glossary.js and
 * visualizations-index.js for existing coverage.
 *
 * RESULT (audited 2026-07-09). All five modules carry isRigorous:false and the shared honest banner (no
 * QED, imp-3066 K_a >= 0 untouched, no refereed bound is changed) and share the identical inherited
 * imp-3220/imp-3406 single-rate log-law surrogate, with the reentry band itself pinned by two
 * machine-precision constants (EPS_FP, PENULT) that have no continuum counterpart. All five have existing
 * glossary.js coverage (17/7/21/13/41 hits respectively); three of five (imp-34997, imp-35111, imp-35243)
 * have existing routed viz-page coverage while imp-35109 and imp-35174 -- pure dd-arithmetic
 * certification modules with no dedicated viz page -- do not. The cohort's open sub-gap, imp-35243a
 * (surrogate-fidelity certificate, R1/R4 unreachable), is NOT discharged by this roll-up.
 *
 * @see imp-35322-rho-eps-expansion-cohort-provenance-rollup (the roll-up pattern this module mirrors)
 * @see imp-34997-iters-to-floor-tail-grid-refinement (locates the finite phase gap and 10^27.08 reentry)
 * @see imp-35109-ceil-phase-drift-precision-certification (dd certification of the reentry point)
 * @see imp-35111-off-by-one-reentry-band-width (measures the band width and 10^37.17 exit)
 * @see imp-35174-reentry-band-precision-certification (dd certification of the band edges)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (assesses fidelity, re-points imp-35243a)
 */

export const IMP_35348_REENTRY_BAND_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-35348',
  auditedAt: '2026-07-09',
  requestedIds: ['imp-34997', 'imp-35109', 'imp-35111', 'imp-35174', 'imp-35243'],
  resolvedCohortIds: ['imp-34997', 'imp-35109', 'imp-35111', 'imp-35174', 'imp-35243'],
  pendingIds: [],
  openSubGap: 'imp-35243a',
  sharedComponentModel:
    'inherited imp-3220/imp-3406 single-rate log-law surrogate for the iters-to-floor ceil-phase, with the ' +
    'reentry band pinned by the machine-epsilon-floor ratio EPS_FP/PENULT (no continuum counterpart)',
  method:
    'Check each of the five named ids against src/data/improvement-queue.js status; read the verdict field ' +
    'of each of the five completed dedicated modules; cross-check glossary.js and visualizations-index.js ' +
    'for existing coverage.',
  modules: [
    {
      file: 'imp-34997-iters-to-floor-tail-grid-refinement.js',
      status: 'resolved',
      verdict:
        'MEASUREMENT: a 50x seed-grid refinement over (1e12,1e15] finds 0 off-by-one at every resolution -- ' +
        'the imp-34903 tail-0 reading is a genuine FINITE ~15-decade ceil-phase gap (drift ~0.0187/decade, ' +
        'floor(xArg) pinned at 11), NOT asymptotic extinction, with reentry at N ~ 10^27.08.',
      noBoundChangeCaveat: 'accuracy/frontier-direction only, NOT an RH bound; opens sub-gap imp-34997a',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
    {
      file: 'imp-35109-ceil-phase-drift-precision-certification.js',
      status: 'resolved',
      verdict:
        'CERTIFICATION: the imp-34997 drift slope and 10^27.08 reentry are recomputed in cancellation-free ' +
        'double-double arithmetic and agree with the double surrogate to <1e-6 per decade in slope and ' +
        '<1e-6 in the log10-N reentry exponent -- the ARITHMETIC half of imp-34997a is discharged; the ' +
        'deeper surrogate-fidelity half is re-pointed as imp-35109a.',
      noBoundChangeCaveat: 'accuracy/frontier-direction only, NOT an RH bound; certifies arithmetic, not surrogate fidelity',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-35111-off-by-one-reentry-band-width.js',
      status: 'resolved',
      verdict:
        'MEASUREMENT: the reappearing off-by-one population above the 10^27.08 reentry is a BOUNDED phase- ' +
        'window band on the double surrogate, exiting at N ~ 10^37.17 (frac-window band ~10.08 decades; ' +
        'wider census-based band ~17.42 decades). Opens sub-gap imp-35111a (certify against higher precision).',
      noBoundChangeCaveat: 'numerical/frontier-direction only, NOT an RH bound; double-precision surrogate only',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
    {
      file: 'imp-35174-reentry-band-precision-certification.js',
      status: 'resolved',
      verdict:
        'CERTIFICATION: the imp-35111 band width and 10^37.17 exit are recomputed in dd arithmetic, agreeing ' +
        'with the double surrogate to ~1e-13-1e-15 across the band -- the ARITHMETIC half of imp-35111a is ' +
        'discharged for the band edges; the direct-census onset at 10^19.75 has no dd analogue.',
      noBoundChangeCaveat: 'accuracy/frontier-direction only, NOT an RH bound; certifies arithmetic, not surrogate fidelity',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-35243-reentry-band-surrogate-fidelity-assessment.js',
      status: 'resolved',
      verdict:
        'ASSESSMENT: the SURROGATE-FIDELITY half of imp-35111a/imp-35174a is NOT established -- (D1) the band ' +
        'location depends on the machine-epsilon floor (no continuum counterpart) and (D2) the band sits ' +
        '14.6-24.7 decades above any verified zero height. R1 (floor-independence) and R4 (independent-model ' +
        'agreement) are binding and presently unreachable, so the sub-gap is re-pointed as imp-35243a (OPEN).',
      noBoundChangeCaveat: 'accuracy/frontier-direction only, NOT an RH bound; leaves imp-35243a OPEN',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
  ],
  requestedIdCount: 5,
  resolvedCohortCount: 5,
  pendingCount: 0,
  glossaryCoveredCount: 5,
  routedVizPageCount: 3,
  recommendation:
    'The reentry-band cohort is fully resolved end to end (locate -> certify arithmetic -> measure width -> ' +
    'certify width arithmetic -> assess surrogate fidelity), but the chain terminates in an OPEN sub-gap ' +
    '(imp-35243a): the band is a genuine feature of the analytic surrogate, not of double-rounding, but ' +
    'whether it is a genuine feature of the TRUE collapse dynamic remains uncertified. Future work should ' +
    'target R1 (floor-independence) or R4 (independent-model agreement) rather than re-measuring the band ' +
    'on the existing surrogate.',
  honestNote:
    'Read-only provenance roll-up; discharges nothing itself and imp-35243a stays OPEN. imp-3066 K_a >= 0 ' +
    'positivity untouched across all catalogued modules. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_35348_ASSERTIONS = [
  {
    id: 'imp35348-five-requested-ids-catalogued',
    holds: () => IMP_35348_REENTRY_BAND_COHORT_PROVENANCE_ROLLUP.requestedIds.length === 5,
    why: 'The roll-up must cover exactly the five ids named in the imp-35348 ticket title.',
  },
  {
    id: 'imp35348-all-five-resolved',
    holds: () => {
      const r = IMP_35348_REENTRY_BAND_COHORT_PROVENANCE_ROLLUP;
      return (
        r.modules.length === 5 &&
        r.modules.length === r.resolvedCohortCount &&
        r.resolvedCohortIds.length === 5 &&
        r.pendingIds.length === 0 &&
        r.pendingCount === 0
      );
    },
    why: 'Queue-verified: all five named ids are status:completed with a dedicated module, unlike the ' +
      'imp-35322 cohort which had 2 pending ids.',
  },
  {
    id: 'imp35348-open-subgap-recorded',
    holds: () => {
      const r = IMP_35348_REENTRY_BAND_COHORT_PROVENANCE_ROLLUP;
      return r.openSubGap === 'imp-35243a' && /imp-35243a stays OPEN/.test(r.honestNote);
    },
    why: 'The cohort chain terminates in an unresolved surrogate-fidelity sub-gap; the roll-up must not ' +
      'imply the chain is fully discharged.',
  },
  {
    id: 'imp35348-all-resolved-carry-honest-banner',
    holds: () => {
      const r = IMP_35348_REENTRY_BAND_COHORT_PROVENANCE_ROLLUP;
      return (
        r.modules.every((m) => m.isRigorous === false) &&
        /no QED/i.test(r.honestNote) &&
        /imp-3066/.test(r.honestNote) &&
        /refereed bound is changed/i.test(r.honestNote)
      );
    },
    why: 'Every catalogued resolved module must be isRigorous:false, and the roll-up itself must state ' +
      'no-QED, imp-3066 untouched, and no refereed bound is changed.',
  },
  {
    id: 'imp35348-glossary-and-viz-coverage-counts-match',
    holds: () => {
      const r = IMP_35348_REENTRY_BAND_COHORT_PROVENANCE_ROLLUP;
      const glossaryCovered = r.modules.filter((m) => m.hasGlossaryTerm === true).length;
      const vizCovered = r.modules.filter((m) => m.hasRoutedVizPage === true).length;
      return (
        glossaryCovered === 5 &&
        glossaryCovered === r.glossaryCoveredCount &&
        vizCovered === 3 &&
        vizCovered === r.routedVizPageCount
      );
    },
    why: 'Grep-verified: all five resolved modules have glossary.js hits; only three ' +
      '(imp-34997, imp-35111, imp-35243) have routed viz-page coverage -- the two pure dd-arithmetic ' +
      'certification modules (imp-35109, imp-35174) do not.',
  },
];

for (const a of IMP_35348_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-35348 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_35348_ASSERTIONS };
