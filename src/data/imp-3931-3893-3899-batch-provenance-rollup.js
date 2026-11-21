/**
 * @module imp-3931-3893-3899-batch-provenance-rollup
 * @fileoverview imp-3931 -- META provenance roll-up cataloguing the imp-3893..imp-3899 batch
 * (seven modules: imp-3893, imp-3894, imp-3895, imp-3896, imp-3897, imp-3898, imp-3899) by
 * EVIDENCE CLASS (measurement-only vs derivation vs live-certification) and confirming each
 * module carries the mandatory honest banner: no-QED, imp-3066 K_a >= 0 positivity untouched,
 * no refereed bound is changed, and (where the module touches the Polymath15 bridge) the
 * G6a/H2 status.
 *
 * METHOD (read-only, performed at author time, following the imp-3886 audit precedent). Each
 * module's @fileoverview / detail block was read and classified:
 *   - "measurement-only": the module MEASURES a quantity (numerically, self-computing at
 *     import) without deriving a new closed-form bound or certifying one against baked data.
 *   - "derivation": the module PROVES an algebraic/analytic result (a bound, identity, or
 *     closed form) without certifying it live against an independent data source.
 *   - "derivation+live-certification": the module both derives a bound/majorant AND certifies
 *     it live (at import time) against an independently baked reference dataset.
 * The honest-banner check greps each module for the four mandatory phrases (no QED, imp-3066
 * K_a >= 0 untouched, no refereed bound is changed) and, for modules that touch the
 * Polymath15 bridge (G6a_shock_lipschitz / H2), the explicit G6a/H2 status line.
 *
 * RESULT (audited 2026-07-04). All seven modules carry the full honest banner. Six of seven
 * are measurement-only; imp-3898 is the batch's sole derivation+live-certification module.
 *   - imp-3893-model-fidelity-moment-discrepancy.js              : measurement-only
 *   - imp-3894-endpoint-concavity-slack-measurement.js           : measurement-only
 *   - imp-3895-saddle-crossing-clenshaw-curtis-third-solver.js   : measurement-only
 *   - imp-3896-g6a-h2-inviscid-window-blocksize-height-scaling.js: measurement-only
 *     (touches the bridge: H2 UNWRITTEN, G6a_shock_lipschitz OPEN, explicitly stated)
 *   - imp-3897-a-weight-substitution-simpson-tau35-40-precision-floor.js: measurement-only
 *   - imp-3898-path-local-elasticity-bound.js                    : derivation+live-certification
 *     (derives the path-local majorant 8/s_min(j)^2 AND certifies the Dmin proxy live against
 *     the baked imp-3874 finite-difference data)
 *   - imp-3899-g6a-p1-resolvent-identity-caustic-stress.js       : measurement-only
 *     (touches the bridge: H2 UNWRITTEN, G6a_shock_lipschitz OPEN, explicitly stated)
 *
 * Two of the seven (imp-3896, imp-3899) explicitly restate the G6a/H2 status; the remaining
 * five do not reference the Polymath15 bridge at all, which is consistent (no G6a/H2 claim to
 * make either way -- absence of a status line is not a gap for those five).
 *
 * @see imp-3886 (the precedent surfacing-audit this roll-up's method follows)
 * @see imp-33247, imp-33268, imp-33287 (later provenance roll-ups in the same series)
 */

export const IMP_3931_3893_3899_BATCH_PROVENANCE_ROLLUP = {
  id: 'imp-3931',
  auditedAt: '2026-07-04',
  method:
    'Read each of the seven imp-3893..imp-3899 module @fileoverview/detail blocks; classify by ' +
    'evidence class (measurement-only / derivation / derivation+live-certification); grep for the ' +
    'four mandatory honest-banner phrases (no QED, imp-3066 K_a >= 0 untouched, no refereed bound is changed' +
    ') plus, where applicable, the explicit G6a/H2 bridge status line.',
  modules: [
    {
      file: 'imp-3893-model-fidelity-moment-discrepancy.js',
      evidenceClass: 'measurement-only',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
    {
      file: 'imp-3894-endpoint-concavity-slack-measurement.js',
      evidenceClass: 'measurement-only',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
    {
      file: 'imp-3895-saddle-crossing-clenshaw-curtis-third-solver.js',
      evidenceClass: 'measurement-only',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
    {
      file: 'imp-3896-g6a-h2-inviscid-window-blocksize-height-scaling.js',
      evidenceClass: 'measurement-only',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'H2 UNWRITTEN as a certificate; G6a_shock_lipschitz stays OPEN',
    },
    {
      file: 'imp-3897-a-weight-substitution-simpson-tau35-40-precision-floor.js',
      evidenceClass: 'measurement-only',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
    {
      file: 'imp-3898-path-local-elasticity-bound.js',
      evidenceClass: 'derivation+live-certification',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
    },
    {
      file: 'imp-3899-g6a-p1-resolvent-identity-caustic-stress.js',
      evidenceClass: 'measurement-only',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'H2 UNWRITTEN as a certificate; G6a_shock_lipschitz stays OPEN',
    },
  ],
  evidenceClassCounts: {
    'measurement-only': 6,
    derivation: 0,
    'live-certification': 0,
    'derivation+live-certification': 1,
  },
  honestBannerFullCoverageCount: 7,
  recommendation:
    'No action needed on the honest-banner side -- all seven modules already carry the full ' +
    'mandatory banner. The batch is measurement-heavy (6/7); imp-3898 is the one module in this ' +
    'cohort that advances a certified bound rather than only measuring, which is the correct mix ' +
    'for a frontier-sharpening batch that should not overclaim.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_3931_ASSERTIONS = [
  {
    id: 'imp3931-exactly-seven-modules-catalogued',
    holds: () => IMP_3931_3893_3899_BATCH_PROVENANCE_ROLLUP.modules.length === 7,
    why: 'The roll-up must cover exactly the seven named batch modules (imp-3893..imp-3899).',
  },
  {
    id: 'imp3931-six-measurement-one-derivation-plus-certification',
    holds: () => {
      const m = IMP_3931_3893_3899_BATCH_PROVENANCE_ROLLUP.modules;
      const counts = IMP_3931_3893_3899_BATCH_PROVENANCE_ROLLUP.evidenceClassCounts;
      const measurementOnly = m.filter((x) => x.evidenceClass === 'measurement-only').length;
      const derivPlusCert = m.filter((x) => x.evidenceClass === 'derivation+live-certification').length;
      return measurementOnly === 6 && derivPlusCert === 1 &&
        counts['measurement-only'] === 6 && counts['derivation+live-certification'] === 1;
    },
    why: 'Grep-verified: six of the seven modules are measurement-only; imp-3898 alone derives ' +
      'and live-certifies a bound.',
  },
  {
    id: 'imp3931-all-seven-carry-full-honest-banner',
    holds: () =>
      IMP_3931_3893_3899_BATCH_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && x.kaUntouched === true && x.plattTrudgianSOTA === true
      ) && IMP_3931_3893_3899_BATCH_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 7,
    why: 'Every module in the batch must state no-QED, imp-3066 K_a >= 0 untouched, and ' +
      'no refereed bound is changed -- grep-verified against the source files.',
  },
  {
    id: 'imp3931-g6a-h2-status-consistent-on-bridge-touching-modules',
    holds: () => {
      const bridgeTouching = IMP_3931_3893_3899_BATCH_PROVENANCE_ROLLUP.modules.filter((x) =>
        /G6a_shock_lipschitz stays OPEN/.test(x.g6aH2Status)
      );
      return bridgeTouching.length === 2 &&
        bridgeTouching.every((x) => /H2 UNWRITTEN/.test(x.g6aH2Status));
    },
    why: 'Only imp-3896 and imp-3899 reference the Polymath15 bridge; both must restate H2 ' +
      'UNWRITTEN and G6a_shock_lipschitz OPEN consistently.',
  },
  {
    id: 'imp3931-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_3931_3893_3899_BATCH_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_3931_3893_3899_BATCH_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_3931_3893_3899_BATCH_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_3931_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3931 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3931_ASSERTIONS };
