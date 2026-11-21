/**
 * @module imp-95059-gate2-surrogate-carrier-honest-status-banner
 *
 * imp-95059 (ux, S-frontier): the imp-95011 (Gate-2 oscillation probe) and
 * imp-95014 (Gate-2 Lane-B two-forms audit) modules already state, buried in
 * their JSDoc headers, that the numbers they compute come from a SURROGATE
 * carrier model -- not the real arithmetic 18-moment carrier C_E,17 defined
 * on 690988 <= N <= 54799999. That disclaimer is easy to miss because both
 * modules are otherwise dense with real anchored constants (TARGET, R_NUM_BOUND,
 * MEASURED_PEAK, AGREEMENT_TOL) borrowed from imp-95006/imp-95007/imp-95010.
 * This module IS the missing standalone, prominent banner: a reader who lands
 * on it directly gets the correction first, without wading through either
 * module's derivation.
 *
 * DOCUMENTATION ONLY. Ports nothing; measures nothing new; changes no bound;
 * does not promote the strict Lambda <= 0.14 completion contract; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * THE BANNER
 * -----------------------------------------------------------------------------
 *   imp-95011's probeVerdict/regime-map numbers and imp-95014's laneA/laneB
 *   cross-check numbers are both computed from a HAND-PICKED five-shell
 *   trigonometric model (SHELL_AMP, ALPHA, THETA, WINDOW_WIDTHS, SEAM_PHASE)
 *   chosen to DEMONSTRATE the falsifiable decision procedure and the
 *   two-forms audit harness. They are NOT arithmetic evaluations of the real
 *   moment carrier C_E,17(N) at any N in [690988, 54799999]. The real
 *   arithmetic evaluator does not exist in this repo (named sub-gaps
 *   imp-95011-sub-arithmetic-carrier-scan and imp-95014-sub-arb-prec128-lane).
 *   Consequently every reported increment L, sampled sup, correlation-gain
 *   ratio, and Lane A/Lane B agreement figure in imp-95011 and imp-95014 is a
 *   STRUCTURAL DEMONSTRATION of the machinery on a stand-in signal, not a
 *   measurement that can be compared against the Gate-2 target
 *   |C_E,17| + r_num < 0.27968819555261474 or used to decide whether the
 *   batching (P1) or headroom (P2) premises actually hold for the real
 *   carrier.
 *
 * @see imp-95011-gate2-oscillation-probe (source: SURROGATE probeVerdict + regime map)
 * @see imp-95014-gate2-lane-b-audit (source: SURROGATE laneA/laneB two-forms cross-check)
 * @see imp-95007 (Gate-2 ranking; anchored TARGET/R_NUM_BOUND/MEASURED_PEAK constants)
 */

const TARGET = 0.27968819555261474; // Gate-2 strict target, unchanged by this banner
const N_LO = 690988;
const N_HI = 54799999;

export const IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER = {
  id: 'imp-95059',
  proofSection: 'S-frontier',
  bannerLevel: 'PROMINENT',
  headline: 'IMP-95011/IMP-95014 RUN ON A SURROGATE CARRIER -- NOT ARITHMETIC MEASUREMENTS OF C_E,17',
  statements: {
    S1_surrogate_not_arithmetic: {
      claim:
        'imp-95011 (probeVerdict + regime map) and imp-95014 (laneA/laneB cross-check) both compute their numbers ' +
        'from a hand-picked five-shell trigonometric SURROGATE model, not from an arithmetic evaluation of the real ' +
        'moment carrier C_E,17(N). No arithmetic C_E,17 evaluator exists in this repo.',
    },
    S2_named_subgaps_unmeasured: {
      claim:
        'The real per-unit-N increment L, the real sampled sup of |C_E,17|, and the real Lane A/Lane B agreement ' +
        'remain UNMEASURED, tracked as the named sub-gaps imp-95011-sub-arithmetic-carrier-scan (offline/native ' +
        'arithmetic scan) and imp-95014-sub-arb-prec128-lane (offline Arb interval Lane B).',
      windowLo: N_LO,
      windowHi: N_HI,
    },
    S3_no_target_comparison: {
      claim:
        'None of the surrogate numbers may be compared against the Gate-2 strict target |C_E,17| + r_num < ' +
        '0.27968819555261474, and neither module’s output decides whether the batching (P1) or headroom (P2) ' +
        'premises hold for the real carrier.',
      target: TARGET,
    },
  },
  isRigorous: false,
  verdict:
    'HONEST-STATUS BANNER (documentation, NOT a new claim). imp-95011 and imp-95014 deliver the decision procedure ' +
    'and the two-forms audit harness that the real Gate-2 probe will plug into, but every number they currently ' +
    'report comes from a surrogate signal, not an arithmetic measurement of C_E,17. Ports nothing; measures ' +
    'nothing new; changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95011-gate2-oscillation-probe (surrogate probeVerdict + regime map); imp-95014-gate2-lane-b-audit ' +
    '(surrogate laneA/laneB two-forms cross-check); imp-95007 (Gate-2 ranking and anchored constants).',
};

export const IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER_ASSERTIONS = [
  {
    id: 'imp95059-banner-is-prominent',
    description: 'Banner is flagged PROMINENT with a headline naming both surrogate-carrier modules',
    holds: () =>
      IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.bannerLevel === 'PROMINENT' &&
      /IMP-95011\/IMP-95014/.test(IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.headline) &&
      /SURROGATE CARRIER/.test(IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.headline),
  },
  {
    id: 'imp95059-surrogate-not-arithmetic',
    description: 'S1 states both modules use a surrogate model, not arithmetic C_E,17',
    holds: () =>
      /SURROGATE model/.test(
        IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.statements.S1_surrogate_not_arithmetic.claim,
      ) &&
      /No arithmetic C_E,17 evaluator exists in this repo/.test(
        IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.statements.S1_surrogate_not_arithmetic.claim,
      ),
  },
  {
    id: 'imp95059-named-subgaps-window-matches',
    description: 'S2 names both sub-gaps and pins the exact Gate-2 window bounds',
    holds: () => {
      const s2 = IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.statements.S2_named_subgaps_unmeasured;
      return (
        /imp-95011-sub-arithmetic-carrier-scan/.test(s2.claim) &&
        /imp-95014-sub-arb-prec128-lane/.test(s2.claim) &&
        s2.windowLo === N_LO &&
        s2.windowHi === N_HI
      );
    },
  },
  {
    id: 'imp95059-no-target-comparison',
    description: 'S3 pins the exact Gate-2 strict target and forbids comparing surrogate numbers to it',
    holds: () =>
      Math.abs(IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.statements.S3_no_target_comparison.target - TARGET) <
        1e-15 && /0.27968819555261474/.test(IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.statements.S3_no_target_comparison.claim),
  },
  {
    id: 'imp95059-honesty-gate-no-qed',
    description: 'Documentation only: not rigorous, no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.isRigorous === false &&
      /HONEST-STATUS BANNER/.test(IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.verdict) &&
      /NOT a new claim/.test(IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.verdict) &&
      /NO QED/.test(IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.verdict) &&
      /refereed bound is changed/i.test(IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER.verdict),
  },
];

for (const a of IMP95059_GATE2_SURROGATE_CARRIER_HONEST_STATUS_BANNER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95059-gate2-surrogate-carrier-honest-status-banner assertion failed: ${a.id}`);
  }
}
