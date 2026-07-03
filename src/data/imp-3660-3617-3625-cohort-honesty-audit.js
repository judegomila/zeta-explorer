/**
 * @module imp-3660-3617-3625-cohort-honesty-audit
 * @fileoverview imp-3660 -- Audit whether the imp-3617 (self-consistent O(eps^3)
 * flow-gap expansion), imp-3618 (remainder-tail exponent ladder n=7,8), imp-3619
 * (third skew-Toeplitz gap exponent), imp-3620 (sigma-crossover flow-factor
 * closed-form pin), imp-3621 (outer-Simpson truncation cross-check, M_5..M_10),
 * imp-3622 (planted-replica argmax-drift discriminator), imp-3623 (dense-solver
 * second-gap cross-validation), imp-3624 (fit-bias a-window sensitivity), and
 * imp-3625 (skew-Toeplitz pair56 Krylov-depth diagnostic) research modules --
 * and their page consumers -- carry inadvertent false-QED or RH-overclaim
 * framing, per the imp-3637/imp-3616/imp-3594 honesty-audit pattern (which
 * stopped at the imp-3599..3604 cohort).
 *
 * METHOD (read-only, performed at author time). Grep each of the nine module
 * files for an explicit "no QED" / "NO RH verdict" statement, the RH-equivalent
 * necessary-but-not-sufficient caveat, the imp-3066 off-diagonal endpoint-Hankel
 * K_a &gt;= 0 positivity UNTOUCHED note, and the Platt-Trudgian Lambda &lt;= 0.2
 * rigorous-SOTA citation. Also consult the imp-3659 cohort-module-surfacing-
 * audit (2026-07-03), which established that four of the nine already have a
 * routed viz page (imp-3617/3619/3620/3622) -- those four page files were
 * additionally grepped for the same honesty markers, since a page is the
 * artifact an actual reader sees.
 *
 * RESULT (audited 2026-07-03): NO DRIFT. All nine modules already carry the
 * full banner (verdict / scope / honestCaveat fields plus a build-time
 * "*-honesty-gate-no-qed" or "*-honest-diagnostic-not-a-verdict" assertion
 * that locks the wording against silent regression), and all four routed viz
 * pages repeat the same no-QED / imp-3066-untouched / Platt-Trudgian-SOTA
 * language in their on-page copy.
 *   - imp-3617-flow-gap-thirdorder-expansion.js            : CLEAN (verdict + imp3617-honesty-gate-no-qed assertion); page Imp3655FlowGapResidualLadderViz.jsx also CLEAN
 *   - imp-3618-remainder-tail-exponent-ladder-n78.js        : CLEAN (verdict + imp3618-honest-diagnostic-not-a-verdict assertion); no page consumer (imp-3659)
 *   - imp-3619-skew-toeplitz-third-gap-exponent.js          : CLEAN (verdict, no dedicated assertion block but RH-EQUIVALENT/NO QED/SOTA all present); page Imp3656TripleSkewToeplitzGapLadderViz.jsx also CLEAN
 *   - imp-3620-sigma-crossover-tc-closedform-pin.js         : CLEAN (verdict + imp3620-honesty-gate-no-qed assertion); page Imp3657SigmaCrossoverTcClosedformPinViz.jsx also CLEAN
 *   - imp-3621-outer-simpson-truncation-moments-m5-m10.js   : CLEAN (verdict + imp3621-honest-diagnostic-not-a-verdict assertion); no page consumer (imp-3659)
 *   - imp-3622-planted-replica-argmax-drift.js              : CLEAN (verdict present, RH-EQUIVALENT/NO QED/SOTA all present); page Imp3658PlantedReplicaArgmaxDriftViz.jsx also CLEAN
 *   - imp-3623-skew-toeplitz-second-gap-dense-crossval.js   : CLEAN (verdict present, RH-EQUIVALENT/NO QED/SOTA all present); no page consumer (imp-3659)
 *   - imp-3624-fit-bias-a-window-sensitivity.js             : CLEAN (verdict + imp3624-honest-diagnostic-not-a-verdict assertion); no page consumer (imp-3659)
 *   - imp-3625-skew-toeplitz-pair56-krylov-depth.js         : CLEAN (verdict present, RH-EQUIVALENT/NO QED/SOTA all present); no page consumer (imp-3659)
 *
 * No inadvertent QED framing, no unconditional-Lambda claim, and no tripped
 * imp-2519 currentStatus predicate were found in this cohort or its four page
 * consumers.
 *
 * RECOMMENDATION. No repair needed for this cohort. This module fabricates
 * no pages and asserts no new bound; it only records the audit outcome. No
 * QED. Platt-Trudgian Lambda &lt;= 0.2 stays the rigorous SOTA.
 *
 * @see imp-3637, imp-3616, imp-3594, imp-3499 (the prior honesty audits in this series)
 * @see imp-3659 (the surfacing audit that identified the four routed viz-page consumers)
 */

export const IMP_3660_3617_3625_COHORT_HONESTY_AUDIT = {
  id: 'imp-3660',
  auditedAt: '2026-07-03',
  method:
    'Grep each cohort module (and its routed viz page, if any, per the imp-3659 surfacing audit) for ' +
    'an explicit no-QED / no-RH-verdict statement, the RH-equivalent necessary-but-not-sufficient ' +
    'caveat, the imp-3066 UNTOUCHED note, and the Platt-Trudgian Lambda <= 0.2 SOTA citation.',
  modulesAudited: [
    { file: 'imp-3617-flow-gap-thirdorder-expansion.js', drift: false, page: 'Imp3655FlowGapResidualLadderViz.jsx' },
    { file: 'imp-3618-remainder-tail-exponent-ladder-n78.js', drift: false, page: null },
    { file: 'imp-3619-skew-toeplitz-third-gap-exponent.js', drift: false, page: 'Imp3656TripleSkewToeplitzGapLadderViz.jsx' },
    { file: 'imp-3620-sigma-crossover-tc-closedform-pin.js', drift: false, page: 'Imp3657SigmaCrossoverTcClosedformPinViz.jsx' },
    { file: 'imp-3621-outer-simpson-truncation-moments-m5-m10.js', drift: false, page: null },
    { file: 'imp-3622-planted-replica-argmax-drift.js', drift: false, page: 'Imp3658PlantedReplicaArgmaxDriftViz.jsx' },
    { file: 'imp-3623-skew-toeplitz-second-gap-dense-crossval.js', drift: false, page: null },
    { file: 'imp-3624-fit-bias-a-window-sensitivity.js', drift: false, page: null },
    { file: 'imp-3625-skew-toeplitz-pair56-krylov-depth.js', drift: false, page: null },
  ],
  pagesAudited: [
    'Imp3655FlowGapResidualLadderViz.jsx',
    'Imp3656TripleSkewToeplitzGapLadderViz.jsx',
    'Imp3657SigmaCrossoverTcClosedformPinViz.jsx',
    'Imp3658PlantedReplicaArgmaxDriftViz.jsx',
  ],
  driftCount: 0,
  recommendation:
    'No repair needed. Every module in the imp-3617..imp-3625 cohort, and every one of its four ' +
    'routed viz-page consumers, already states measurement/derivation-only, RH-equivalent, ' +
    'necessary-but-not-sufficient, the imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED note, ' +
    'and Platt-Trudgian Lambda <= 0.2 as the rigorous SOTA, with no QED.',
  honestNote:
    'Read-only audit; no pages or bounds fabricated. No QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3660_ASSERTIONS = [
  {
    id: 'imp3660-exactly-nine-modules-and-four-pages-audited',
    holds: () =>
      IMP_3660_3617_3625_COHORT_HONESTY_AUDIT.modulesAudited.length === 9 &&
      IMP_3660_3617_3625_COHORT_HONESTY_AUDIT.pagesAudited.length === 4,
    why: 'The audit must cover exactly the nine named cohort modules; imp-3659 established four routed viz-page consumers.',
  },
  {
    id: 'imp3660-no-drift-found',
    holds: () => {
      const driftFlagged = IMP_3660_3617_3625_COHORT_HONESTY_AUDIT.modulesAudited.filter(
        (x) => x.drift
      ).length;
      return driftFlagged === 0 && driftFlagged === IMP_3660_3617_3625_COHORT_HONESTY_AUDIT.driftCount;
    },
    why: 'No overclaim drift was found in the 2026-07-03 audit of this cohort.',
  },
  {
    id: 'imp3660-four-modules-have-pages',
    holds: () => {
      const withPage = IMP_3660_3617_3625_COHORT_HONESTY_AUDIT.modulesAudited.filter((x) => x.page !== null).length;
      return withPage === 4;
    },
    why: 'Cross-check against imp-3659: exactly four of the nine cohort modules (3617, 3619, 3620, 3622) have a routed viz page.',
  },
  {
    id: 'imp3660-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_3660_3617_3625_COHORT_HONESTY_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3660_3617_3625_COHORT_HONESTY_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_3660_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3660 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3660_ASSERTIONS };
