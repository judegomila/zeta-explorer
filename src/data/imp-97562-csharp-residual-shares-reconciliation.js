/**
 * @module imp-97562-csharp-residual-shares-reconciliation
 * @fileoverview imp-97562 -- CROSS-CHECK that the imp-97492 cohort's two residual shares to the
 *   Krein c_sharp ~ 0.582 at 2a = ln 3 reconcile arithmetically against the -3065.435 bathtub
 *   envelope, the imp-97457 realizable floor -1343.796, and the measured floor.
 *
 *   BACKGROUND. The imp-97492 cohort index reports that the gap from the -3065.435 bathtub
 *   (density-only, no-realizability) envelope up to the measured Krein c_sharp ~ 0.582 splits into
 *   two named shares:
 *       realizability recovery   : +1721.639  (reported 56.2%)
 *       discarded far field      : +1344.378  (reported 43.8%)
 *   with the intermediate imp-97457 realizable floor pinned at -1343.796 (the finite-section
 *   lambda_max(P_a M_{sigma_2}^- P_a) operator-level obstruction, imp-97558).
 *
 *   CROSS-CHECK (all exact in IEEE double, tmp/imp-97562 node check):
 *     (1) envelope + realizability = -3065.435 + 1721.639 = -1343.796  == imp-97457 realizable floor
 *         (diff 0.000e+0).
 *     (2) realizable floor + far field = -1343.796 + 1344.378 = 0.582  == measured c_sharp ~ 0.582
 *         (diff -1.2e-13, pure float rounding).
 *     (3) share sum = 1721.639 + 1344.378 = 3066.017  == total gap (c_sharp - envelope)
 *         = 0.582 - (-3065.435) = 3066.017 (diff 0.000e+0).
 *     (4) percentages: 1721.639 / 3066.017 = 56.1523%  (reported 56.2%);
 *                      1344.378 / 3066.017 = 43.8477%  (reported 43.8%); sum 100.0000%.
 *
 *   VERDICT. The two-share decomposition is fully self-consistent: the realizability share carries
 *   the envelope exactly onto the imp-97457 realizable floor, and adding the discarded far-field
 *   share lands exactly on the measured c_sharp ~ 0.582. The reported round percentages 56.2% / 43.8%
 *   are the correct one-decimal roundings of 56.1523% / 43.8477% and sum to 100%. No mismatch found.
 *
 *   Accuracy cross-check only. No new bound; the envelope, realizable floor, and c_sharp values are
 *   carried verbatim from imp-97457/97458/97492/97558; interval-rigorous reach stays 2a <= 0.96;
 *   Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97558 (interval-certified realizable floor -1343.796 at the operator level)
 * @see imp-97457 (best band-limited realizable attainment 43.84% of the bathtub envelope)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (Krein c_sharp cohort)
 *
 * Ticket: imp-97562 (accuracy, opus-4-8, api-pool). Two residual shares reconcile exactly against the
 * -3065.435 envelope, the -1343.796 realizable floor, and the measured c_sharp ~ 0.582; percentages
 * self-consistent to 100%; no mismatch; no bound moves; reach stays 2a <= 0.96; RH open; NO QED.
 */

export const IMP97562_ENVELOPE = -3065.435;        // bathtub (density-only) envelope
export const IMP97562_REALIZ_SHARE = 1721.639;     // realizability recovery share (reported 56.2%)
export const IMP97562_FARFIELD_SHARE = 1344.378;   // discarded far-field share (reported 43.8%)
export const IMP97562_REALIZ_FLOOR = -1343.796;    // imp-97457 realizable floor
export const IMP97562_CSHARP = 0.582;              // measured Krein c_sharp at 2a = ln 3
export const IMP97562_REACH_2A = 0.96;             // unchanged by this cross-check leaf

export const IMP97562_RECONCILIATION = Object.freeze({
  ticket: 'imp-97562',
  question:
    'do the imp-97492 cohort two residual shares (realizability +1721.639 = 56.2%, discarded far ' +
    'field +1344.378 = 43.8%) reconcile against the -3065.435 envelope, the -1343.796 realizable ' +
    'floor, and the measured c_sharp ~ 0.582?',
  // step (1): envelope + realizability recovery == imp-97457 realizable floor
  envelopePlusRealiz: IMP97562_ENVELOPE + IMP97562_REALIZ_SHARE, // -1343.796
  matchesRealizFloor: true,
  // step (2): realizable floor + far field == measured c_sharp
  floorPlusFarField: IMP97562_REALIZ_FLOOR + IMP97562_FARFIELD_SHARE, // 0.582
  matchesCSharp: true,
  // step (3): share sum == total gap (c_sharp - envelope)
  shareSum: IMP97562_REALIZ_SHARE + IMP97562_FARFIELD_SHARE, // 3066.017
  totalGap: IMP97562_CSHARP - IMP97562_ENVELOPE,             // 3066.017
  shareSumMatchesTotalGap: true,
  // step (4): percentages of the total gap
  pctRealiz: (IMP97562_REALIZ_SHARE / (IMP97562_REALIZ_SHARE + IMP97562_FARFIELD_SHARE)) * 100, // 56.1523
  pctFarField: (IMP97562_FARFIELD_SHARE / (IMP97562_REALIZ_SHARE + IMP97562_FARFIELD_SHARE)) * 100, // 43.8477
  reportedPctRealiz: 56.2,
  reportedPctFarField: 43.8,
  pctSelfConsistent: true, // 56.1523 -> 56.2, 43.8477 -> 43.8, sum 100.0000
  mismatchFound: false,
  // guardrails
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97562_RECONCILIATION;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97562_ASSERTIONS = [
  {
    id: 'imp97562-envelope-plus-realiz-equals-floor',
    holds: () =>
      Math.abs((IMP97562_ENVELOPE + IMP97562_REALIZ_SHARE) - IMP97562_REALIZ_FLOOR) < 1e-9 &&
      IMP97562_RECONCILIATION.matchesRealizFloor === true,
    why: 'envelope -3065.435 + realizability +1721.639 = -1343.796 == imp-97457 realizable floor (exact in double).',
  },
  {
    id: 'imp97562-floor-plus-farfield-equals-csharp',
    holds: () =>
      Math.abs((IMP97562_REALIZ_FLOOR + IMP97562_FARFIELD_SHARE) - IMP97562_CSHARP) < 1e-9 &&
      IMP97562_RECONCILIATION.matchesCSharp === true,
    why: 'realizable floor -1343.796 + far field +1344.378 = 0.582 == measured c_sharp ~ 0.582 (diff ~1e-13, float rounding).',
  },
  {
    id: 'imp97562-share-sum-equals-total-gap',
    holds: () => {
      const shareSum = IMP97562_REALIZ_SHARE + IMP97562_FARFIELD_SHARE;
      const totalGap = IMP97562_CSHARP - IMP97562_ENVELOPE;
      return Math.abs(shareSum - totalGap) < 1e-9 &&
        Math.abs(shareSum - 3066.017) < 1e-9 &&
        IMP97562_RECONCILIATION.shareSumMatchesTotalGap === true;
    },
    why: 'the two shares sum to 3066.017, exactly the total gap c_sharp - envelope = 0.582 - (-3065.435): the split is complete with no residual.',
  },
  {
    id: 'imp97562-percentages-self-consistent',
    holds: () => {
      const total = IMP97562_REALIZ_SHARE + IMP97562_FARFIELD_SHARE;
      const pR = (IMP97562_REALIZ_SHARE / total) * 100;
      const pF = (IMP97562_FARFIELD_SHARE / total) * 100;
      // exact percentages round to the reported one-decimal figures and sum to 100
      return Math.abs(Math.round(pR * 10) / 10 - 56.2) < 1e-9 &&
        Math.abs(Math.round(pF * 10) / 10 - 43.8) < 1e-9 &&
        Math.abs((pR + pF) - 100) < 1e-9 &&
        IMP97562_RECONCILIATION.mismatchFound === false;
    },
    why: 'exact shares 56.1523% / 43.8477% round to the reported 56.2% / 43.8% and sum to 100.0000%: the percentages are self-consistent, no mismatch.',
  },
  {
    id: 'imp97562-crosscheck-only-no-qed',
    holds: () =>
      IMP97562_RECONCILIATION.boundMoves === false &&
      IMP97562_RECONCILIATION.intervalRigorousReachUnchanged === 0.96 &&
      IMP97562_REACH_2A === 0.96 &&
      IMP97562_RECONCILIATION.qed === false,
    why: 'accuracy cross-check only: the two shares reconcile exactly against envelope, realizable floor, and c_sharp; no bound moves; reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97562_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97562-csharp-residual-shares-reconciliation assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
