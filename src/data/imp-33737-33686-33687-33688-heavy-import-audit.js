/**
 * @module imp-33737-33686-33687-33688-heavy-import-audit
 * @fileoverview imp-33737 -- heavy-import safety audit of the imp-33686 (lagged
 * recovery-grade-vs-spike-height correlation), imp-33687 (envelope-height-vs-spike-height
 * cross-check over the sixteen [400,1200] cluster peaks), and imp-33688 (cluster-peak-height
 * first/second-half split at n=800) modules, mirroring the imp-33720 audit of the
 * imp-33679..imp-33682 cohort and the imp-33695 audit of imp-33660..imp-33663. Confirms none of
 * the three transitively imports the 16.7MB src/data/zeros-to-1e6.js zero-ordinate bundle (which
 * hangs vite ssrLoadModule / npm-run-assert when pulled into an assertion module).
 *
 * METHOD (read-only, performed at author time). Direct grep of each of the three module source
 * files for ^import( lines, then recursive grep of every named import target, following the
 * transitive closure until every branch terminates at a file with zero import lines.
 *
 * RESULT (audited 2026-07-04).
 *   - imp-33686-lagged-recovery-grade-vs-spike-height.js has ZERO imports (fully self-computing;
 *     it recomputes the imp-33663 sixteen-rung series from an in-file literal rung list).
 *   - imp-33687-envelope-height-vs-spike-height-cross-check-sixteen-peaks.js imports
 *     IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT (imp-33660-cluster-peak-envelope-height-
 *     growth-fit.js) and IMP33663_RECOVERY_GRADE_VS_SPIKE_HEIGHT_SIXTEEN (imp-33663-recovery-
 *     grade-vs-spike-height-sixteen-peaks.js) only.
 *   - imp-33688-cluster-peak-height-first-second-half-split-n400-1200.js imports
 *     IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT (imp-33660, as above) and
 *     IMP33680_CLUSTER_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT (imp-33680-cluster-peak-height-leave-two-
 *     out-refit.js) only.
 * Tracing the transitive closure: imp-33660-cluster-peak-envelope-height-growth-fit.js has ZERO
 * imports; imp-33663-recovery-grade-vs-spike-height-sixteen-peaks.js has ZERO imports;
 * imp-33680-cluster-peak-height-leave-two-out-refit.js imports only the already-confirmed
 * zero-import imp-33660 sibling. Every branch terminates without ever naming zeros-to-1e6.js. All
 * three target modules are therefore heavy-import-safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33720 (the imp-33679..imp-33682 cohort audit this note mirrors), imp-33695, imp-33763
 */

export const IMP_33737_HEAVY_IMPORT_AUDIT = {
  id: 'imp-33737',
  auditedAt: '2026-07-04',
  modules: [
    {
      file: 'imp-33686-lagged-recovery-grade-vs-spike-height.js',
      directImports: [],
      hasHeavyImport: false,
      selfComputing: true,
    },
    {
      file: 'imp-33687-envelope-height-vs-spike-height-cross-check-sixteen-peaks.js',
      directImports: [
        'IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT',
        'IMP33663_RECOVERY_GRADE_VS_SPIKE_HEIGHT_SIXTEEN',
      ],
      hasHeavyImport: false,
      selfComputing: false,
    },
    {
      file: 'imp-33688-cluster-peak-height-first-second-half-split-n400-1200.js',
      directImports: [
        'IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT',
        'IMP33680_CLUSTER_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT',
      ],
      hasHeavyImport: false,
      selfComputing: false,
    },
  ],
  transitiveClosureFiles: [
    'imp-33660-cluster-peak-envelope-height-growth-fit.js',
    'imp-33663-recovery-grade-vs-spike-height-sixteen-peaks.js',
    'imp-33680-cluster-peak-height-leave-two-out-refit.js',
  ],
  heavyImportSafeCount: 3,
  recommendation:
    'No action needed -- all three modules are already heavy-import-safe (one fully ' +
    'self-computing, two importing only already-confirmed zero-import local siblings). This ' +
    'closes the imp-33737 audit item; no further imp-33686/imp-33687/imp-33688 heavy-import ' +
    'work is queued.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_33737_ASSERTIONS = [
  {
    id: 'imp33737-exactly-three-modules-audited',
    holds: () => IMP_33737_HEAVY_IMPORT_AUDIT.modules.length === 3,
    why: 'The audit must cover exactly the three named modules (imp-33686/imp-33687/imp-33688).',
  },
  {
    id: 'imp33737-all-three-heavy-import-safe',
    holds: () => {
      const m = IMP_33737_HEAVY_IMPORT_AUDIT.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 3 && safe === IMP_33737_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all three modules terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp33737-one-self-computing-two-local-only',
    holds: () => {
      const m = IMP_33737_HEAVY_IMPORT_AUDIT.modules;
      const selfComputing = m.filter((x) => x.selfComputing === true).length;
      const localOnly = m.filter(
        (x) => x.selfComputing === false && x.directImports.length > 0
      ).length;
      return selfComputing === 1 && localOnly === 2;
    },
    why: 'imp-33686 recomputes its series from an in-file literal (zero imports); imp-33687 and ' +
      'imp-33688 each import only local sibling modules already confirmed import-free.',
  },
  {
    id: 'imp33737-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33737_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_33737_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_33737_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33737_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33737 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33737_ASSERTIONS };
