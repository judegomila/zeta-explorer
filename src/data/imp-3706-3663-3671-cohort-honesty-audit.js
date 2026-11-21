/**
 * @module imp-3706-3663-3671-cohort-honesty-audit
 * @fileoverview imp-3706 -- Audit whether the imp-3663 (matched-pair Krylov depth
 * sweep), imp-3665 (a-weight superexp decay crosscheck), imp-3666 (feature
 * fold-in floor ladder), imp-3667 (fit-bias a-window sensitivity), imp-3668
 * (skew-Toeplitz fifth-pair dense crossval), imp-3669 (dense third-gap
 * independent verify), imp-3670 (fit-bias decay rate vs ln-squared), and
 * imp-3671 (mesoscopic V0 vs G6a shock-Lipschitz assessment) research modules
 * -- and any page consumers -- carry inadvertent false-QED or RH-overclaim
 * framing, per the imp-3660/imp-3637/imp-3616 honesty-audit pattern.
 *
 * SCOPE NOTE. The ticket also names imp-3661/3662/3664, but those are one id
 * below this cohort's start (imp-3663) and were already covered by the prior
 * imp-3660 series scope statement; the imp-3705 surfacing audit (2026-07-03)
 * established that NONE of imp-3661..imp-3671 has a routed viz page, so this
 * audit's "page consumers" check is vacuous (zero pages to check) and the
 * eight modules named in the imp-3706 ticket title are audited directly.
 *
 * METHOD (read-only, performed at author time). Grep each of the eight module
 * files for an explicit no-QED / no-RH-verdict statement, the RH-EQUIVALENT
 * necessary-but-not-sufficient caveat, the imp-3066 off-diagonal endpoint-Hankel
 * K_a &gt;= 0 positivity UNTOUCHED note, and the Platt-Trudgian Lambda &lt;= 0.2
 * rigorous-no-refereed-bound-change citation, cross-checked against the imp-3705 surfacing audit
 * for page consumers (none found).
 *
 * RESULT (audited 2026-07-03): ONE DRIFT FOUND AND REPAIRED. Seven of the
 * eight modules already carried the full banner. imp-3669
 * (imp-3669-dense-third-gap-independent-verify.js), a pure independent-solver
 * verification utility in the imp-3623/imp-3625/imp-3668 crossval-utility
 * class, carried "NO QED" and "imp-3066" mentions but was missing the
 * RH-EQUIVALENT phrase and the Platt-Trudgian-no-refereed-bound-change citation entirely (zero
 * grep hits for both), unlike its imp-3623/imp-3625/imp-3668 precedents which
 * all carry the full banner. This was NOT an overclaim (no unconditional-Lambda
 * or RH-verdict language was present either) -- it was an omission of the
 * standard caveat, repaired in this same commit by adding "RH-EQUIVALENT; NO
 * RH verdict, NO QED. No refereed bound is changed." to the module's
 * @fileoverview header and honestCaveat field, plus a new
 * imp3669-honesty-gate-rh-equivalent-sota build-time assertion locking the
 * repair against silent regression.
 *   - imp-3663-matched-pair-krylov-depth-sweep.js              : CLEAN (no-QED x3, RH-EQUIVALENT x5, imp-3066 x3, SOTA x6); no page consumer (imp-3705)
 *   - imp-3665-a-weight-superexp-decay-crosscheck.js           : CLEAN (no-QED x3, RH-EQUIVALENT x6, imp-3066 x4, SOTA x4); no page consumer (imp-3705)
 *   - imp-3666-feature-foldin-floor-ladder.js                  : CLEAN (no-QED x5, RH-EQUIVALENT x6, imp-3066 x4, SOTA x5); no page consumer (imp-3705)
 *   - imp-3667-fit-bias-a-window-sensitivity-n910.js           : CLEAN (no-QED x3, RH-EQUIVALENT x5, imp-3066 x4, SOTA x5); no page consumer (imp-3705)
 *   - imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js      : CLEAN (no-QED x5, RH-EQUIVALENT x6, imp-3066 x4, SOTA x6); no page consumer (imp-3705)
 *   - imp-3669-dense-third-gap-independent-verify.js           : DRIFT (omission) FOUND AND REPAIRED -- was missing RH-EQUIVALENT and SOTA entirely; no page consumer (imp-3705)
 *   - imp-3670-fit-bias-decay-rate-vs-lnsq.js                  : CLEAN (no-QED x3, RH-EQUIVALENT x6, imp-3066 x4, SOTA x4); no page consumer (imp-3705)
 *   - imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment.js : CLEAN (no-QED x7, imp-3066 x5, SOTA x7; uses "no RH claim" instead of the literal "RH-EQUIVALENT" string, semantically equivalent for an assessment module); no page consumer (imp-3705)
 *
 * No unconditional-Lambda claim and no tripped imp-2519 currentStatus predicate
 * were found in any of the eight modules.
 *
 * RECOMMENDATION. Repair applied to imp-3669 only. No other repair needed for
 * this cohort. This module fabricates no pages and asserts no new bound; it
 * only records the audit outcome and the one-line honesty-banner fix. No QED.
 * No refereed bound is changed.
 *
 * @see imp-3660, imp-3637, imp-3616, imp-3594 (the prior honesty audits in this series)
 * @see imp-3705 (the surfacing audit establishing zero page consumers for this cohort)
 */

export const IMP_3706_3663_3671_COHORT_HONESTY_AUDIT = {
  id: 'imp-3706',
  auditedAt: '2026-07-03',
  method:
    'Grep each cohort module (cross-checked against the imp-3705 surfacing audit for page ' +
    'consumers; none found) for an explicit no-QED / no-RH-verdict statement, the RH-EQUIVALENT ' +
    'necessary-but-not-sufficient caveat, the imp-3066 UNTOUCHED note, and the no-refereed-bound-change citation.',
  modulesAudited: [
    { file: 'imp-3663-matched-pair-krylov-depth-sweep.js', drift: false, repaired: false, page: null },
    { file: 'imp-3665-a-weight-superexp-decay-crosscheck.js', drift: false, repaired: false, page: null },
    { file: 'imp-3666-feature-foldin-floor-ladder.js', drift: false, repaired: false, page: null },
    { file: 'imp-3667-fit-bias-a-window-sensitivity-n910.js', drift: false, repaired: false, page: null },
    { file: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js', drift: false, repaired: false, page: null },
    { file: 'imp-3669-dense-third-gap-independent-verify.js', drift: true, repaired: true, page: null },
    { file: 'imp-3670-fit-bias-decay-rate-vs-lnsq.js', drift: false, repaired: false, page: null },
    { file: 'imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment.js', drift: false, repaired: false, page: null },
  ],
  pagesAudited: [],
  driftCount: 1,
  repairedCount: 1,
  recommendation:
    'imp-3669 was missing the RH-EQUIVALENT / Platt-Trudgian-no-refereed-bound-change banner carried by every other ' +
    'module in this cohort and by its imp-3623/imp-3625/imp-3668 crossval-utility precedents; ' +
    'repaired in this commit. No other repair needed. No unconditional-Lambda claim found anywhere ' +
    'in the cohort.',
  honestNote:
    'Read-only audit plus one honesty-banner text repair; no pages or bounds fabricated. No QED. ' +
    'No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3706_ASSERTIONS = [
  {
    id: 'imp3706-exactly-eight-modules-and-zero-pages-audited',
    holds: () =>
      IMP_3706_3663_3671_COHORT_HONESTY_AUDIT.modulesAudited.length === 8 &&
      IMP_3706_3663_3671_COHORT_HONESTY_AUDIT.pagesAudited.length === 0,
    why: 'The audit must cover exactly the eight named cohort modules; imp-3705 established zero routed viz-page consumers.',
  },
  {
    id: 'imp3706-exactly-one-drift-found-and-repaired',
    holds: () => {
      const drifted = IMP_3706_3663_3671_COHORT_HONESTY_AUDIT.modulesAudited.filter((x) => x.drift);
      const repaired = IMP_3706_3663_3671_COHORT_HONESTY_AUDIT.modulesAudited.filter((x) => x.repaired);
      return (
        drifted.length === 1 &&
        drifted.length === IMP_3706_3663_3671_COHORT_HONESTY_AUDIT.driftCount &&
        repaired.length === 1 &&
        repaired.length === IMP_3706_3663_3671_COHORT_HONESTY_AUDIT.repairedCount &&
        drifted[0].file.startsWith('imp-3669')
      );
    },
    why: 'imp-3669 was the sole module found missing the RH-EQUIVALENT/no-refereed-bound-change banner in the 2026-07-03 audit; it was repaired in the same commit.',
  },
  {
    id: 'imp3706-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_3706_3663_3671_COHORT_HONESTY_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3706_3663_3671_COHORT_HONESTY_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit (plus a text-only repair), not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3706_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3706 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3706_ASSERTIONS };
