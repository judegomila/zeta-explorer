/**
 * imp-95129-ythaw-o2-assessment — y-thaw 0.17759432 package, obligation O2
 * (barrier/winding slab certificate at the thawed bottom edge y = 0.1808).
 *
 * GRADE: ASSESSMENT / TRACTABILITY TRIAGE only. NO certificate is produced,
 * NO margins are certified, the bound is unchanged. O2 is carried OPEN. The
 * package value 0.17759432 stays a package value, not a bound. NO QED.
 * No refereed bound is changed.
 *
 * WHAT O2 IS. The sealed v3 package (review-01787854-v3, commit 2e9976c4)
 * certified H_{129/800}(x+iy) != 0 on the barrier crossing by a three-piece
 * decomposition; piece 1 is the COMPACT-SLAB Arb barrier:
 *   883-prism barrier on [X, X+1] x [0.1809, 1] x [0, 129/800],
 *   fail-closed strict comparisons, whole-prism time control, t=0 endpoint
 *   argument, min strict margin 0.5198 (imp-95201 reference-closure record).
 * The slab operates on the raw effective approximation H_t = A + B - C over
 * the narrow x-box [X, X+1] via the argument-principle / winding count
 * (winding allowance 0.00125 pointwise along the contour). O2 asks for the
 * SAME slab with the bottom edge lowered from the sealed 0.1809 to the
 * thawed 0.1808 -- a downward extension of dy = 1e-4.
 *
 * TRACTABILITY ASSESSMENT (why O2 is the CHEAPEST of the four open
 * obligations O1/O2/O4/O6). Four structural facts, all shadowed from frozen
 * slab constants by exact arithmetic below:
 *  (a) PURE-Y DISPLACEMENT. The move is dt = 0; the window landmark
 *      N(x, t) = round(4 pi N^2 - pi t / 4) has NO y-dependence and equals
 *      690988 at all four slab corners, so the barrier chart-motion charge is
 *      exactly zero (imp-95202): no boundary chart moves.
 *  (b) ERROR BUDGET STAYS DEEP INSIDE THE ALLOWANCE. The slab error chain
 *      e_AB + e_C0 is 3.5652e-4 at y = 0.1809 (the sealed PASS) and
 *      3.5676e-4 at y = 0.1808 (growth factor exp((dy/4) log0) = 1.000673,
 *      log0 = ln(N0^2 - t/16) ~ 26.9); both sit a factor ~3.50 below the
 *      winding allowance 0.00125 (imp-95202 double-precision Arb shadow).
 *  (c) MARGIN CANNOT BE EXHAUSTED. The sealed slab min strict margin is
 *      0.5198; a dy = 1e-4 extension at 0.0673 percent budget growth is
 *      5198 margin-units of headroom away from exhaustion.
 *  (d) WEIGHT-INDEPENDENT. The barrier evaluates the raw H_t = A + B - C
 *      directly (883-prism Arb), NOT the row-level mollified triangle/sharp
 *      summand; so the O1 obstruction (the TRIANGLE floor COLLAPSES / reverses
 *      sign at 0.1808, imp-95207) does NOT touch the barrier slab. O2 and O1
 *      fail or pass by independent mechanisms.
 *
 * THE SUB-GAP (named, NOT closed): imp-95129-subgap-slab-arb-rerun. O2 needs
 * ONE cheap Arb re-run of the slab producer (verify_uniform_error_01787854.c /
 * the 883-prism barrier) over the extended y-range [0.1808, 1], confirming
 *  (i)   every prism strict-positive (the adaptive engine may add a few bottom
 *        prisms over the sliver [0.1808, 0.1809]);
 *  (ii)  M0 != 0 on the extended box (the barrier-denominator lower bound
 *        ||M0|| >= delta > 0 that makes B_t != 0, so the winding count of
 *        g_t = H_t / B_t counts H_t zeros);
 *  (iii) the t=0 endpoint argument over the added sliver.
 * Until that run is logged with its margins, the assessment stands as
 * tractability triage, not a certificate. imp-95202 records the same one
 * line: the displaced abscissa 0.1808 lies OUTSIDE the delivered box
 * [0.1809, 1], so even the error side needs one cheap Arb re-run.
 *
 * SCOPE HONESTY. This module carries frozen literals only (exact arithmetic /
 * double-precision shadows of the sealed slab chain); it runs no Arb, imports
 * no heavy bundle, and asserts nothing about the certificate itself. Sources:
 * imp-95201-01399-certification-campaign (slab geometry + 0.5198 margin),
 * imp-95202-prop43-effective-collar-feasibility (error chain + growth +
 * chart-motion), imp-95207-split-collar-analysis (triangle collapse), and
 * imp-95208-ythaw-package-stage12 / imp-95212-ythaw-o5-o3 (the ledger).
 */

// ── the sealed compact-slab barrier (piece 1 of the v3 decomposition) ────────
export const O2_SEALED_SLAB = {
  obligation: 'O2',
  piece: 'compact-slab Arb barrier (piece 1 of the v3 three-piece closure)',
  X: 6000000185827,
  xBox: ['X', 'X + 1'], // narrow abscissa box at the barrier crossing
  ySealed: [0.1809, 1], // sealed slab y-range (bottom edge 0.1809)
  tBox: [0, 129 / 800], // heat time from 0 to the final time 129/800
  prisms: 883,
  minStrictMargin: 0.5198,
  windingAllowance: 0.00125, // normalized main term >= this pointwise on the contour
  cornerLandmarkN: 690988, // N(x,t) at all four slab corners (y-independent)
};

// ── the thawed target and the dy = 1e-4 downward extension ───────────────────
export const O2_EXTENSION = {
  yThawBottom: 0.1808, // 113/625 exactly
  ySealedBottom: 0.1809,
  deltaY: 1e-4, // downward extension of the slab bottom edge
  // slab error chain e_AB + e_C0 (imp-95202 double-precision Arb shadow):
  errorAt01809: 3.5652e-4, // the sealed PASS value at the sealed bottom edge
  errorAt01808: 3.5676e-4, // = errorAt01809 * growthFactor
  growthFactor: 1.000673, // exp((deltaY/4) * log0), log0 = ln(N0^2 - t/16) ~ 26.9
  log0: 26.891755472925958, // ln(690988^2), the leading term of log0
  allowance: 0.00125,
  headroomFactor: 3.5037566357581063, // allowance / errorAt01808
  marginPerDeltaY: 5198, // minStrictMargin / deltaY
};

// ── tractability triage (the four structural facts, listed) ──────────────────
export const O2_TRACTABILITY = {
  rank: 'cheapest of the four open obligations O1/O2/O4/O6',
  facts: [
    'pure-y displacement (dt = 0): window landmark N has no y-dependence, N = 690988 at all four slab corners, chart-motion charge exactly zero',
    'error budget 3.5676e-4 at 0.1808 sits ~3.50x below the winding allowance 0.00125 (growth 1.000673 over the dy = 1e-4 step)',
    'sealed slab min strict margin 0.5198 cannot be exhausted by a 1e-4 extension at 0.0673 percent budget growth (5198 margin-units of headroom)',
    'weight-independent: the 883-prism barrier evaluates raw H_t = A + B - C, not the row-level triangle/sharp summand, so the O1 triangle-collapse at 0.1808 does NOT touch O2',
  ],
  subGap: 'imp-95129-subgap-slab-arb-rerun',
  subGapNeeds: [
    'one Arb re-run of the 883-prism slab producer over y in [0.1808, 1], every prism strict-positive (adaptive engine may add a few bottom prisms)',
    'M0 != 0 on the extended box (barrier-denominator lower bound ||M0|| >= delta > 0)',
    't=0 endpoint argument over the added sliver [0.1808, 0.1809]',
  ],
  computeClass: 'cheap Arb re-run (single narrow x-box slab; ~883 prisms + a sliver), NOT a full-lane sweep',
};

export const IMP_95129_O2_VERDICT = {
  o2: 'OPEN (tractability triage only) -- the barrier/winding slab extends from bottom edge 0.1809 to 0.1808 by dy = 1e-4; the error side stays ~3.50x below the 0.00125 winding allowance and the 0.5198 slab margin cannot be exhausted, but the certificate is NOT produced (sub-gap imp-95129-subgap-slab-arb-rerun: one cheap Arb re-run of the slab producer)',
  cheapestOpenObligation: true,
  weightIndependentOfO1: true,
  changesBound: false,
  certificateProduced: false,
  qed: false,
};

export const IMP_95129_YTHAW_O2 = {
  id: 'imp-95129-ythaw-o2-assessment',
  title:
    'y-thaw 0.17759432 package obligation O2 (barrier/winding slab at bottom edge 0.1808): tractability triage -- cheapest open obligation, dy = 1e-4 slab extension deep inside the 0.00125 allowance / 0.5198 margin, weight-independent of O1; certificate OPEN (sub-gap imp-95129-subgap-slab-arb-rerun)',
  sealedSlab: O2_SEALED_SLAB,
  extension: O2_EXTENSION,
  tractability: O2_TRACTABILITY,
  verdict: IMP_95129_O2_VERDICT,
};

// ── assertions (import-light; exact arithmetic / literal-consistency only) ───
export const IMP_95129_O2_ASSERTIONS = [
  {
    id: 'imp-95129-o2-downward-extension',
    holds: () =>
      O2_EXTENSION.yThawBottom < O2_EXTENSION.ySealedBottom &&
      Math.abs(O2_EXTENSION.ySealedBottom - O2_EXTENSION.yThawBottom - O2_EXTENSION.deltaY) < 1e-12 &&
      Math.abs(113 / 625 - O2_EXTENSION.yThawBottom) < 1e-15,
    why: 'O2 lowers the slab bottom edge from the sealed 0.1809 to the thawed 0.1808 = 113/625 exactly -- a downward extension of dy = 1e-4, not a fresh construction; the sealed slab already reaches to within 1e-4 of the target.',
  },
  {
    id: 'imp-95129-o2-error-growth-inside-allowance',
    holds: () => {
      const growth = Math.exp((O2_EXTENSION.deltaY / 4) * O2_EXTENSION.log0);
      return (
        Math.abs(growth - O2_EXTENSION.growthFactor) < 5e-5 &&
        Math.abs(O2_EXTENSION.errorAt01809 * O2_EXTENSION.growthFactor - O2_EXTENSION.errorAt01808) < 1e-7 &&
        O2_EXTENSION.errorAt01808 < O2_EXTENSION.allowance &&
        Math.abs(O2_EXTENSION.allowance / O2_EXTENSION.errorAt01808 - O2_EXTENSION.headroomFactor) < 1e-6
      );
    },
    why: 'The slab error chain grows by exp((dy/4) log0) = 1.000673 over the 1e-4 step (3.5652e-4 -> 3.5676e-4), staying a factor ~3.50 below the 0.00125 winding allowance -- the error side of the barrier extends with wide headroom.',
  },
  {
    id: 'imp-95129-o2-margin-not-exhausted',
    holds: () =>
      O2_SEALED_SLAB.minStrictMargin > 0.5 &&
      Math.abs(O2_SEALED_SLAB.minStrictMargin / O2_EXTENSION.deltaY - O2_EXTENSION.marginPerDeltaY) < 1 &&
      O2_EXTENSION.marginPerDeltaY > 5000 &&
      O2_EXTENSION.growthFactor - 1 < 1e-3,
    why: 'The sealed slab min strict margin 0.5198 is 5198 margin-units per 1e-4 of y; a downward extension at 0.0673 percent budget growth cannot exhaust it -- the barrier margin, not the error budget, is the binding channel and it stays wide.',
  },
  {
    id: 'imp-95129-o2-log0-leading-term',
    holds: () =>
      Math.abs(Math.log(690988 ** 2) - O2_EXTENSION.log0) < 1e-9 &&
      Math.abs((O2_EXTENSION.deltaY / 4) * O2_EXTENSION.log0 - 2.5e-5 * O2_EXTENSION.log0 / 1) < 1e-12,
    why: 'The growth exponent is (dy/4) log0 with log0 = ln(N0^2 - t/16) ~ ln(690988^2) = 26.8918, i.e. exp(2.5e-5 * log0) at dy = 1e-4 -- the same y-dependence factor exp(-(1+y)/4 log0) that drives the O3 E_max budget, evaluated on the slab error chain.',
  },
  {
    id: 'imp-95129-o2-weight-independent-of-o1',
    holds: () =>
      O2_SEALED_SLAB.prisms === 883 &&
      IMP_95129_O2_VERDICT.weightIndependentOfO1 === true &&
      O2_SEALED_SLAB.cornerLandmarkN === 690988,
    why: 'The 883-prism barrier evaluates the raw effective approximation H_t = A + B - C over the compact x-box (winding count), not the row-level mollified summand; so the O1 triangle collapse at 0.1808 (imp-95207: the triangle floor reverses sign) does NOT propagate to O2 -- the two obligations fail or pass by independent mechanisms.',
  },
  {
    id: 'imp-95129-o2-open-not-closed',
    holds: () =>
      IMP_95129_O2_VERDICT.certificateProduced === false &&
      IMP_95129_O2_VERDICT.changesBound === false &&
      IMP_95129_O2_VERDICT.qed === false &&
      IMP_95129_O2_VERDICT.cheapestOpenObligation === true &&
      O2_TRACTABILITY.subGap === 'imp-95129-subgap-slab-arb-rerun' &&
      O2_TRACTABILITY.subGapNeeds.length === 3,
    why: 'Scope discipline: O2 is triaged as the cheapest open obligation but CARRIED OPEN -- no certificate, no margins, no bound change, NO QED; the residual is the named sub-gap imp-95129-subgap-slab-arb-rerun (one cheap Arb re-run of the slab producer over [0.1808, 1] with M0 != 0 and the t=0 endpoint on the sliver).',
  },
];

for (const a of IMP_95129_O2_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95129-ythaw-o2-assessment assertion failed: ${a.id}`);
  }
}
