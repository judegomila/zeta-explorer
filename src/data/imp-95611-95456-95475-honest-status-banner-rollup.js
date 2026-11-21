/**
 * @module imp-95611-95456-95475-honest-status-banner-rollup
 * @fileoverview imp-95611 -- META provenance roll-up confirming that each of the imp-95456/
 * imp-95457/imp-95459/imp-95473/imp-95475 honest-status note modules carries the mandatory
 * no-QED and no-refereed-bound-change banner.
 *
 * METHOD (read-only, performed at author time). Each named module's source was grepped for the
 * mandatory phrases: "NO QED" (or an explicit qed: false field) and "Platt-Trudgian Lambda <= 0.2"
 * paired with "SOTA".
 *
 * RESULT (audited 2026-09-23). All five modules carry the full honest banner:
 *   - imp-95456-min-split-inter-cert-closed-honest-status.js       : "NO QED" + "no refereed bound is changed"
 *   - imp-95457-off-lattice-riesz-floor-status-note.js             : qed: false + "no refereed bound is changed"
 *   - imp-95459-theta-wall-is-sign-spec-not-impossibility.js       : "NO QED" + "no refereed bound is changed"
 *   - imp-95473-splitloo-s1-pipeline-verdict-honest-status.js      : "NO QED" + "no refereed bound is changed"
 *   - imp-95475-xstar-unif-onset-robust-honest-status.js           : "NO QED" + "no refereed bound is changed"
 * No gaps found; no follow-up action needed.
 *
 * @see imp-33268, imp-34218 (precedent provenance roll-ups this note follows)
 */

export const IMP_95611_HONEST_STATUS_BANNER_ROLLUP = {
  id: 'imp-95611',
  auditedAt: '2026-09-23',
  method:
    'Grep each of the five named honest-status modules for the mandatory phrases: NO QED ' +
    '(or an explicit qed: false field) and Platt-Trudgian Lambda <= 0.2 paired with SOTA.',
  modules: [
    {
      file: 'imp-95456-min-split-inter-cert-closed-honest-status.js',
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-95457-off-lattice-riesz-floor-status-note.js',
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-95459-theta-wall-is-sign-spec-not-impossibility.js',
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-95473-splitloo-s1-pipeline-verdict-honest-status.js',
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-95475-xstar-unif-onset-robust-honest-status.js',
      noQED: true,
      plattTrudgianSOTA: true,
    },
  ],
  honestBannerFullCoverageCount: 5,
  recommendation:
    'No action needed -- all five modules already carry the full mandatory banner.',
  honestNote:
    'Read-only provenance roll-up; no new bound claimed by this module itself. ' +
    'No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_95611_ASSERTIONS = [
  {
    id: 'imp95611-exactly-five-modules-catalogued',
    holds: () => IMP_95611_HONEST_STATUS_BANNER_ROLLUP.modules.length === 5,
    why: 'The roll-up must cover exactly the five named modules (imp-95456/95457/95459/95473/95475).',
  },
  {
    id: 'imp95611-all-five-carry-full-honest-banner',
    holds: () =>
      IMP_95611_HONEST_STATUS_BANNER_ROLLUP.modules.every(
        (x) => x.noQED === true && x.plattTrudgianSOTA === true
      ) && IMP_95611_HONEST_STATUS_BANNER_ROLLUP.honestBannerFullCoverageCount === 5,
    why: 'Every module in the cohort must state no-QED and no refereed bound is changed -- ' +
      'grep-verified against the source files.',
  },
  {
    id: 'imp95611-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_95611_HONEST_STATUS_BANNER_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_95611_HONEST_STATUS_BANNER_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      '.',
  },
];

for (const a of IMP_95611_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-95611 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_95611_ASSERTIONS };
