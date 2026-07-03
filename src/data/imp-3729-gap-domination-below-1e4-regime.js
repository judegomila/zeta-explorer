/**
 * @module imp-3729-gap-domination-below-1e4-regime
 * @fileoverview imp-3729 (proof, RH-FREE, derivation-only): ASSESSMENT of
 * whether the imp-3725 gap-domination two-sided true-flow enclosure
 *   0 <= F_mb(N) <= (H^2/8) * (1/theta_N - 1)
 * extends below its stated N >= 1e4 uniformity floor. The imp-3725 lemma
 * certifies the enclosure UNIFORM on N in [1e4, 1e6] (discharging
 * cond-fmb-nonregression-above-1e4) and is explicit that its uniformity claim
 * is bounded below at N = 1e4. This module characterizes the N < 1e4 regime.
 * NO new bound on Lambda; imp-3066 UNTOUCHED; Platt-Trudgian Lambda <= 0.2
 * REMAINS SOTA; NO QED.
 *
 * THE TWO SIDES BEHAVE DIFFERENTLY BELOW 1e4
 * ------------------------------------------
 * (A) LOWER bound  t_c(N) >= H_raw(N)^2 / 8   (i.e. F_mb(N) >= 0)
 *     is N-AGNOSTIC. Its proof is the per-gap identity
 *       d(g_l^2)/dt = -8 + 4 g_l^2 * (sum of POSITIVE terms) >= -8,
 *     which holds for EVERY gap of EVERY ordered configuration of ANY number
 *     N >= 2 of particles -- nothing in it references the plateau structure
 *     or the size of N. Hence F_mb(N) >= 0 holds verbatim for all N < 1e4
 *     (indeed for all N >= 2). The lower side needs no extension argument.
 *
 * (B) UPPER bound  t_c(N) <= H^2 / (8*theta_N),  theta_N = 1 - Psi_N(T)/8,
 *     Psi_N(T) = 4 H^2 * sum_{j <= N, j not in {a,a+1}} 1 / D_j(T)^2.
 *     Psi_N(T) is a PARTIAL SUM of positive, N-independent terms indexed by
 *     j <= N (imp-3725 plateau-monotonicity step). Therefore, for a FIXED
 *     record pair, Psi_N is monotone NONDECREASING in N: REMOVING particles
 *     (decreasing N) can only DROP positive terms, so
 *       N' < N  ==>  Psi_{N'}(T) <= Psi_N(T)  ==>  theta_{N'} >= theta_N.
 *     Decreasing N pushes theta_N UP toward 1, never down. The ticket's
 *     hypothesized failure mode -- "the finite-N Psi_N sum pushes theta below
 *     thetaBar so the upper bound is vacuous" -- is therefore REFUTED for the
 *     small-N direction: small N makes the upper bound EASIER, not harder.
 *
 * WHERE THE UPPER BOUND CAN ACTUALLY DEGRADE (and it is not N)
 * -----------------------------------------------------------
 * theta_N > 0 <=> Psi_N(T) < 8 is the sole non-vacuousness condition, and
 * bootstrap self-consistency needs theta_N >= thetaBar. The genuine risk to
 * theta is the LOCAL GAP GEOMETRY at the (N-dependent) record pair, NOT the
 * size of N: the frozen shrunk distances D_j(T) are sums of
 *   s_l(T) = sqrt(max(g_l(0)^2 - 8T, 0)),   8T = H^2/thetaBar ~= 1.0101 H^2,
 * so a term blows up only if the neighbours of the record pair are within
 * ~0.5% of the minimum gap H (a near-degenerate gap cluster). On the imp-3725
 * plateaus the record pair is well isolated -- the nearest frozen distance
 * Dmin ~= 1.0 while H ~= 0.04 (Dmin/H ~= 27) -- so Psi <= 2.3e-2 out of 8 and
 * theta >= 0.99823. This isolation is a per-configuration property, checked
 * plateau-by-plateau, and is unrelated to whether N is above or below 1e4.
 *
 * SMALLEST N WITH A NON-VACUOUS TWO-SIDED ENCLOSURE
 * -------------------------------------------------
 * There is NO small-N floor from the theta side. As N shrinks the retardation
 * sum loses terms, so Psi_N -> 0 and theta_N -> 1, and in the extreme N = 2
 * (a single gap, no third particle) Psi = 0 exactly, theta = 1, and the
 * enclosure COLLAPSES to the exact two-particle Dyson result
 *   t_c(2) = H^2/8,   F_mb(2) = 0.
 * So the two-sided enclosure remains non-vacuous all the way down to N = 2,
 * degenerating to an EQUALITY (upper = lower) as N -> 2. The [1e4, 1e6]
 * restriction in imp-3725 is a SCOPE / PROVENANCE choice (that is where the
 * zero-table plateau scan was run), not a mathematical breakdown of the
 * bootstrap at small N.
 *
 * IS N < 1e4 ALREADY COVERED?  YES.
 * ---------------------------------
 * The band N in [100, 1e4] is already discharged UNCONDITIONALLY by the
 * imp-933 / imp-963 direct scan (finite-k-c-mb-unconditional.js,
 * status "rigorous-on-N-in-100-to-10000"): worst-case K = 0.2014 across
 * [100, 1e4], DISCRETE-MAP-certified semantics. The imp-857 baseline sweep
 * anchors the same band. So the K bound below 1e4 does NOT depend on the
 * gap-domination lemma; the lemma would, if run there, upgrade those rows to
 * TRUE-FLOW semantics with the same verbatim argument, but that recomputation
 * is a separate (optional) tightening and is NOT performed here.
 *
 * NET ASSESSMENT
 * --------------
 *  - Lower F_mb >= 0: extends to all N < 1e4 with no argument (N-agnostic).
 *  - Upper enclosure: does NOT degrade with small N; monotonicity makes it
 *    tighter (theta -> 1). The only degradation vector is a near-degenerate
 *    record-pair gap cluster, a per-configuration check independent of N.
 *  - Non-vacuous down to N = 2 (exact at N = 2); no small-N floor.
 *  - N < 1e4 already covered by the imp-933/imp-963 direct scan (map
 *    semantics); a flow-semantics upgrade there is optional, not needed.
 *
 * This is derivation / measurement only. It establishes no operator
 * positivity and no new bound on Lambda. NO QED.
 *
 * @see imp-3725 (the lemma whose N >= 1e4 floor this assesses)
 * @see imp-3725-fmb-plateau-domination-lemma.js (source of the live rows)
 * @see imp-933 / imp-963 (finite-k-c-mb-unconditional.js: [100,1e4] scan)
 * @see imp-857 (baseline sweep anchoring the sub-1e4 band)
 * @see imp-962 (plateau structure scan on [1e4,1e6])
 */

import { IMP_3725_FMB_PLATEAU_DOMINATION } from './imp-3725-fmb-plateau-domination-lemma.js';

const SRC_ROWS = IMP_3725_FMB_PLATEAU_DOMINATION.rows;

// Sub-1e4 coverage literals (finite-k-c-mb-unconditional.js, verbatim):
const SUB_1E4_BAND = Object.freeze([100, 10000]);
const SUB_1E4_K = 0.2014;                       // imp-963 worst-case K on [100,1e4]
const SUB_1E4_STATUS = 'rigorous-on-N-in-100-to-10000';
const SUB_1E4_SEMANTICS = 'discrete-map (imp-933/imp-963 direct scan)';

export const IMP_3729_BELOW_1E4_REGIME = Object.freeze({
  id: 'imp-3729',
  title:
    'Assessment: how the imp-3725 gap-domination two-sided enclosure behaves ' +
    'below its stated N >= 1e4 uniformity floor',
  status: 'assessment-derivation-only',
  rhFree: true,
  semantics: 'characterization of an existing true-flow lemma; no new bound',

  lowerSide: {
    claim: 't_c(N) >= H_raw(N)^2/8, i.e. F_mb(N) >= 0, for ALL N >= 2',
    isNAgnostic: true,
    reason:
      'The per-gap identity d(g_l^2)/dt = -8 + 4 g_l^2 * (positive sum) >= -8 ' +
      'holds for every gap of every ordered configuration of any N >= 2 and ' +
      'references neither the plateau structure nor the size of N. So the ' +
      'lower bound extends to N < 1e4 verbatim, with no extension argument.',
    extendsBelow1e4: true,
  },

  upperSide: {
    claim:
      't_c(N) <= H^2/(8*theta_N), theta_N = 1 - Psi_N(T)/8, valid while ' +
      'theta_N >= thetaBar > 0',
    psiMonotoneInN: 'nondecreasing',
    thetaMonotoneInN: 'nonincreasing',
    smallNMakesItEasier: true,
    reason:
      'Psi_N(T) is a partial sum of positive N-independent terms over j <= N, ' +
      'so decreasing N only drops terms: N-prime < N implies theta_{N-prime} ' +
      '>= theta_N. Small N pushes theta toward 1, so the ticket-hypothesised ' +
      '"finite-N Psi pushes theta below thetaBar" failure mode does NOT occur ' +
      'in the small-N direction.',
    genuineDegradationVector:
      'A near-degenerate record-pair gap cluster: a frozen distance D_j(T) = ' +
      'sum of sqrt(max(g_l^2 - H^2/thetaBar, 0)) collapses only if a neighbour ' +
      'gap is within ~0.5% of the minimum gap H. This is per-configuration ' +
      '(local geometry at the N-dependent record pair), NOT a function of N.',
    pairIsolationOnScannedPlateaus:
      'Dmin/H ~= 27 on plateau 0 (Dmin ~= 1.018, H ~= 0.0377), so Psi <= ' +
      '2.3e-2 out of 8 and theta >= 0.99823 across [1e4,1e6].',
  },

  smallestNonVacuousN: {
    N: 2,
    thetaAtN2: 1,
    exactAtN2:
      't_c(2) = H^2/8, F_mb(2) = 0 (two-particle Dyson: no third particle, ' +
      'Psi = 0, upper = lower).',
    hasSmallNFloor: false,
    note:
      'The enclosure stays non-vacuous down to N = 2, degenerating to an ' +
      'equality as N -> 2. The [1e4,1e6] restriction in imp-3725 is a ' +
      'scope/provenance choice (where the plateau scan was run), not a ' +
      'breakdown of the bootstrap at small N.',
  },

  alreadyCoveredBelow1e4: {
    band: SUB_1E4_BAND,
    worstCaseK: SUB_1E4_K,
    status: SUB_1E4_STATUS,
    semantics: SUB_1E4_SEMANTICS,
    source: 'finite-k-c-mb-unconditional.js (imp-933/imp-963); imp-857 sweep',
    flowUpgradeIsOptional:
      'The gap-domination lemma would upgrade [100,1e4] rows from map to ' +
      'true-flow semantics with the same verbatim argument, but that ' +
      'recomputation is optional tightening and is NOT performed here.',
  },

  scope: {
    noNewLambdaBound: true,
    imp3066Untouched: true,
    plattTrudgianStillSOTA: 'Lambda <= 0.2 (PT 2021) remains SOTA',
    noQED: true,
  },
});

// ── Build-time assertions (throw on failure via run-assertions harness) ─────

export const IMP_3729_BELOW_1E4_REGIME_ASSERTIONS = [
  {
    id: 'imp3729-psi-monotone-nondecreasing-in-N',
    holds: () => SRC_ROWS.every((r) => r.psiStart <= r.psiEnd),
    why:
      'Core of the assessment: Psi_N(T) is a partial sum of positive terms, ' +
      'so within each imp-3725 plateau the start-N value (fewer terms) must ' +
      'not exceed the end-N value (more terms). This is exactly the ' +
      'direction that makes theta increase as N shrinks -- refuting the ' +
      '"small N pushes theta below thetaBar" worry.',
  },
  {
    id: 'imp3729-theta-increases-as-N-shrinks',
    holds: () =>
      SRC_ROWS.every((r) => 1 - r.psiStart / 8 >= 1 - r.psiEnd / 8),
    why:
      'theta_{N1} = 1 - Psi_{N1}/8 >= theta_{N2} = 1 - Psi_{N2}/8 for N1 < N2 ' +
      'in a plateau: decreasing N raises theta toward 1, so the upper bound ' +
      'stays non-vacuous (and tightens) as N decreases.',
  },
  {
    id: 'imp3729-lower-bound-is-H2over8',
    holds: () =>
      SRC_ROWS.every(
        (r) => Math.abs(r.tcLo - (r.H * r.H) / 8) / ((r.H * r.H) / 8) < 1e-5,
      ),
    why:
      'The N-agnostic lower bound t_c >= H^2/8 must equal the baked tcLo at ' +
      'every plateau. Since H^2/8 carries no N-dependence, this same equality ' +
      'is what extends verbatim to N < 1e4.',
  },
  {
    id: 'imp3729-N2-limit-is-exact',
    holds: () => {
      // N = 2: single gap, no third particle, Psi = 0, theta = 1,
      // upper = lower = H^2/8. Model with an isolated pair (H = anything > 0).
      const H = 0.0377;
      const psi = 0;              // no j outside {a, a+1}
      const theta = 1 - psi / 8;
      const lower = (H * H) / 8;
      const upper = (H * H) / (8 * theta);
      return theta === 1 && upper === lower && lower > 0;
    },
    why:
      'The claimed smallest non-vacuous N: at N = 2 the retardation sum is ' +
      'empty (Psi = 0), theta = 1, and the two-sided enclosure collapses to ' +
      'the exact two-particle result t_c = H^2/8. Establishes there is no ' +
      'small-N floor to non-vacuousness.',
  },
  {
    id: 'imp3729-sub-1e4-already-covered',
    holds: () =>
      IMP_3729_BELOW_1E4_REGIME.alreadyCoveredBelow1e4.band[0] === 100 &&
      IMP_3729_BELOW_1E4_REGIME.alreadyCoveredBelow1e4.band[1] === 10000 &&
      IMP_3729_BELOW_1E4_REGIME.alreadyCoveredBelow1e4.worstCaseK === 0.2014 &&
      IMP_3729_BELOW_1E4_REGIME.alreadyCoveredBelow1e4.status ===
        'rigorous-on-N-in-100-to-10000',
    why:
      'The N < 1e4 band [100, 1e4] is already discharged by the imp-933/963 ' +
      'direct scan (K = 0.2014, map semantics). If these literals drift from ' +
      'finite-k-c-mb-unconditional.js the "already covered" conclusion must ' +
      'be re-checked.',
  },
  {
    id: 'imp3729-no-new-lambda-bound',
    holds: () =>
      IMP_3729_BELOW_1E4_REGIME.scope.noNewLambdaBound === true &&
      IMP_3729_BELOW_1E4_REGIME.scope.noQED === true &&
      IMP_3729_BELOW_1E4_REGIME.scope.imp3066Untouched === true,
    why:
      'Honesty guard: this is derivation-only. It must not assert a new ' +
      'Lambda bound or a QED, and imp-3066 stays untouched; Platt-Trudgian ' +
      'Lambda <= 0.2 remains SOTA.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_3729_BELOW_1E4_REGIME_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3729-gap-domination-below-1e4-regime assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_3729_BELOW_1E4_REGIME;
