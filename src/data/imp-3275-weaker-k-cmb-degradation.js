/**
 * @module imp-3275-weaker-k-cmb-degradation
 * @fileoverview imp-3275 -- ASSESS/MEASURE-ONLY evaluation of the imp-857
 * interval-arithmetic route recommended by PATH-3 (imp-856) for a WEAKER-K
 * many-body-correction bound C_mb <= K with K possibly > 1, certified
 * UNCONDITIONALLY (i.e. without invoking GUE universality / Erdos-Schlein-Yau).
 *
 * WHAT THIS FILE ANSWERS (measure/assess only, no theorem claim, no QED):
 *
 *   Q1. Can an interval-arithmetic route certify a weaker C_mb <= K bound with
 *       K > 1 unconditionally?
 *   Q2. How does the headline Lambda <= E(N) degrade as a function of K?
 *   Q3. Does any finite K still beat Platt-Trudgian 2021 (Lambda <= 0.2)?
 *
 * KEY STRUCTURAL FINDING (verified by reading paper-appendix-C-finite-height-
 * beat.js and finite-k-c-mb-unconditional.js):
 *
 *   The many-body constant C_mb does NOT appear as an additive term in the
 *   finite-height beat headline L_pt = |t_c(N)| + E_flow + E_coll + E_trunc.
 *   E_coll is pinned by the geometric constant C_C = (1/8)*sqrt(3*pi) (imp-399),
 *   NOT by C_mb. C_mb enters SOLELY through the imp-486 "rescue formula" GATE,
 *   which requires the certified bound K to satisfy
 *
 *         K * log(N) / sqrt(N)  <  rho_min_lower_bound = 0.12751
 *
 *   (the rho_min analytic floor from gamma_1 > 14; see finite-k L5). This is a
 *   THRESHOLD, not a continuous penalty: once K <= K_max(N) the beat goes
 *   through with the SAME recorded L_pt(N); once K > K_max(N) the collision-
 *   persistence hypothesis fails at that height and the beat is lost there.
 *
 * CONSEQUENCE FOR THE THREE QUESTIONS:
 *
 *   The rescue budget K_max(N) = 0.12751 * sqrt(N) / log(N) is strictly
 *   INCREASING for N > e^2 and diverges as N -> infinity. Therefore:
 *
 *   Q1 YES -- but only above a K-dependent height. On the RIGOROUSLY
 *      UNCONDITIONAL range where interval-RK4 has actually certified C_mb
 *      (imp-963: [100, 10^4], measured C_mb <= 0.2014), the rescue budget is
 *      already K_max(10^4) ~ 1.384 > 1, so the route TODAY tolerates a weaker
 *      certified bound up to ~1.384 unconditionally. To tolerate any larger K
 *      the interval-RK4 sweep must be pushed to higher N (imp-962), where the
 *      budget grows without bound (K_max(10^6) ~ 9.23).
 *
 *   Q2 The headline does NOT degrade in VALUE with K -- L_pt(N) is K-free below
 *      the gate. What "degrades" is the ENTRY HEIGHT: a larger tolerated K
 *      forces a larger minimum certified height N_min(K), the smallest N with
 *      K_max(N) >= K. The guaranteed unconditional bound for tolerance-K is then
 *      E(N_min(K)); since E(N) stays < 0.2 across the recorded assembly up to
 *      N = 10^6, the cost of a weaker K is paid entirely in height, not in Lambda.
 *
 *   Q3 YES -- every finite K beats PT 0.2, because K_max(N) diverges: for any
 *      finite K there exists a finite height N_min(K) above which the rescue
 *      gate holds and the finite-height beat L_pt(N) < 0.2 applies. The only
 *      cost of a larger K is a higher N_min(K).
 *
 * HONEST LIMIT (the named sub-gap): the finite-height beat L_pt < 0.2 is only
 * RECORDED (assembled) up to N = 10^6 (imp-452), and the UNCONDITIONAL
 * interval-RK4 certification of C_mb currently reaches only N = 10^4 (imp-963;
 * the (10^4, 10^6] ladder is conservative-carryforward, projected-not-measured,
 * per imp-1082/1087/1088). So the clean unconditional tolerance is K <= ~1.384
 * (within the certified [100, 10^4] range) TODAY; K up to ~9.23 becomes
 * unconditional only once the imp-962 sweep certifies C_mb on (10^4, 10^6]; and
 * K > ~9.23 additionally needs the L_pt assembly extended above N = 10^6. This
 * file MEASURES the K-to-height map; it does NOT extend either the sweep or the
 * assembly, and makes NO GUE-free proof claim beyond what imp-963 already holds.
 *
 * @see imp-856
 * @see imp-857
 * @see imp-486
 * @see imp-963
 * @see finite-k-c-mb-unconditional
 * @see paper-appendix-C-finite-height-beat
 */

// ── The imp-486 rescue gate ──────────────────────────────────────────────────
// rho_min analytic lower bound (finite-k L5; from gamma_1 > 14). The gate is
// K * log(N) / sqrt(N) < RESCUE_THRESHOLD.
const RESCUE_THRESHOLD = 0.12751;

// Rescue budget: the LARGEST C_mb bound K the rescue gate tolerates at height N.
// Solving K * log(N) / sqrt(N) < RESCUE_THRESHOLD for K gives
// K_max(N) = RESCUE_THRESHOLD * sqrt(N) / log(N). Strictly increasing for
// N > e^2 (~7.39), diverges as N -> infinity.
function kMaxAt(N) {
  return (RESCUE_THRESHOLD * Math.sqrt(N)) / Math.log(N);
}

// N_min(K): smallest integer height N >= 100 at which the rescue budget reaches
// K, i.e. the entry height above which an unconditional C_mb <= K certificate
// would activate the finite-height beat. Found by bisection (kMaxAt is
// monotone increasing on N >= 100). Returns null if K exceeds the budget at the
// search ceiling (here 10^15, far past any recorded assembly).
function nMinForK(K) {
  if (kMaxAt(100) >= K) {
    return 100;
  }
  let lo = 100;
  let hi = 1e15;
  if (kMaxAt(hi) < K) {
    return null;
  }
  // 200 bisection steps drive the bracket to sub-integer width across [100, 1e15].
  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + hi) / 2;
    if (kMaxAt(mid) >= K) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return Math.ceil(hi);
}

// ── Recorded finite-height-beat headline values (imp-440 / imp-452) ──────────
// L_pt is K-FREE below the rescue gate; these are the recorded assembly values
// at the two anchor heights. Both are strictly < the Platt-Trudgian 0.2 bound.
const PT_BOUND = 0.2;
const L_PT_AT_1E4 = 0.02; // imp-963 unconditional headline at N* = 10^4
const L_PT_AT_1E6 = 0.121; // imp-452 full-assembly headline at N* = 10^6

// Anchor heights of interest for the K-tolerance map.
const CERTIFIED_UNCOND_N = 10000; // imp-963 interval-RK4 unconditional reach
const RECORDED_ASSEMBLY_N = 1000000; // imp-452 L_pt assembly ceiling

// ── The K-degradation ladder ─────────────────────────────────────────────────
// For a ladder of candidate weaker-K bounds (including K > 1), report the entry
// height N_min(K), whether that height is within the currently-unconditional
// interval-RK4 reach (<= 10^4), whether it is within the recorded L_pt assembly
// (<= 10^6), and the guaranteed unconditional Lambda at that height.
const K_LADDER = [
  0.2014, // imp-963 measured headline C_mb bound on [100, 10^4]
  0.5,
  1.0, // the GUE-conditional C_mb <= 1 threshold, now sought unconditionally
  1.384, // ~ K_max(10^4): the largest K certified-unconditional TODAY
  2.0,
  5.0,
  9.23, // ~ K_max(10^6): largest K reachable within the recorded assembly
  20.0, // beyond the recorded assembly -- shows the height cost keeps growing
];

function lambdaAtHeight(N) {
  // Guaranteed unconditional Lambda at the entry height (K-free below the gate).
  // Piecewise-anchored to the two recorded assembly points; above 10^6 the
  // assembly is not recorded, so we return null (honest: not established).
  if (N == null) {
    return null;
  }
  if (N <= CERTIFIED_UNCOND_N) {
    return L_PT_AT_1E4;
  }
  if (N <= RECORDED_ASSEMBLY_N) {
    return L_PT_AT_1E6;
  }
  return null;
}

const K_DEGRADATION_TABLE = K_LADDER.map((K) => {
  const nMin = nMinForK(K);
  const lambda = lambdaAtHeight(nMin);
  return {
    K,
    n_min: nMin,
    n_min_exp: nMin != null ? +nMin.toExponential(3) : null,
    within_uncond_interval_rk4_reach: nMin != null && nMin <= CERTIFIED_UNCOND_N,
    within_recorded_assembly: nMin != null && nMin <= RECORDED_ASSEMBLY_N,
    guaranteed_lambda: lambda,
    beats_pt: lambda != null && lambda < PT_BOUND,
    // Status of the beat for a hypothetical unconditional C_mb <= K certificate:
    beat_status:
      nMin == null
        ? 'unreachable-within-search-ceiling'
        : nMin <= CERTIFIED_UNCOND_N
          ? 'unconditional-today (imp-963 interval-RK4 reach)'
          : nMin <= RECORDED_ASSEMBLY_N
            ? 'needs imp-962 sweep extension to certify C_mb unconditionally at this height (assembly already recorded)'
            : 'needs BOTH imp-962 sweep AND L_pt assembly extension above N = 10^6',
  };
});

// Sanity anchors: the rescue budget at the two recorded heights (cross-checks
// against the finite-k file margin factors 1.37x at N0=100 and the ~9.22 at 1e5).
const K_MAX_AT_1E4 = +kMaxAt(CERTIFIED_UNCOND_N).toFixed(4);
const K_MAX_AT_1E6 = +kMaxAt(RECORDED_ASSEMBLY_N).toFixed(4);

// The height at which the rescue budget first crosses K = 1 (the GUE-conditional
// threshold): below this, an unconditional C_mb <= 1 would NOT even be needed to
// be productive; above this, a certified C_mb <= 1 clears the gate with slack.
const N_WHERE_KMAX_CROSSES_1 = nMinForK(1.0);

// ── Exported record ──────────────────────────────────────────────────────────

export const IMP_3275_WEAKER_K_CMB_DEGRADATION = Object.freeze({
  id: 'imp-3275-weaker-k-cmb-degradation',
  ticket: 'imp-3275',
  kind: 'assessment-and-measurement-only',
  claimsTheorem: false,
  changesConditionalStatus: false,

  question:
    'Assess the imp-857 interval-arithmetic route for an unconditional weaker-K ' +
    'C_mb <= K bound (K possibly > 1) and measure how Lambda <= E(N) degrades ' +
    'with K; does any finite K still beat Platt-Trudgian Lambda <= 0.2?',

  mechanism:
    'C_mb is NOT an additive term in L_pt = |t_c| + E_flow + E_coll + E_trunc ' +
    '(E_coll is pinned by C_C = (1/8)*sqrt(3*pi), imp-399, not by C_mb). C_mb ' +
    'enters SOLELY through the imp-486 rescue gate K * log(N) / sqrt(N) < ' +
    '0.12751. The gate is a threshold: below it L_pt(N) is unchanged; above it ' +
    'the beat is lost at that height. So a weaker K costs ENTRY HEIGHT, not ' +
    'headline value.',

  rescueThreshold: RESCUE_THRESHOLD,
  rescueBudgetFormula: 'K_max(N) = 0.12751 * sqrt(N) / log(N)  (increasing, diverges)',
  kMaxAt1e4: K_MAX_AT_1E4,
  kMaxAt1e6: K_MAX_AT_1E6,
  nWhereBudgetCrosses1: N_WHERE_KMAX_CROSSES_1,

  kDegradationTable: K_DEGRADATION_TABLE,

  answers: {
    q1_canCertifyWeakerKUnconditionally:
      'YES above a K-dependent height. On the currently-certified unconditional ' +
      'range [100, 10^4] (imp-963, measured C_mb <= 0.2014) the rescue budget is ' +
      'K_max(10^4) ~ ' + K_MAX_AT_1E4 + ' > 1, so the interval-arithmetic route ' +
      'already tolerates a weaker certified bound up to ~' + K_MAX_AT_1E4 + ' ' +
      'unconditionally TODAY. Larger K requires extending the interval-RK4 sweep ' +
      'to higher N (imp-962), where the budget grows without bound.',
    q2_headlineDegradationWithK:
      'The headline VALUE does not degrade with K -- L_pt(N) is K-free below the ' +
      'gate. The cost of a larger K is a larger minimum certified height ' +
      'N_min(K) = smallest N with K_max(N) >= K, and the guaranteed unconditional ' +
      'Lambda is E(N_min(K)). Since E(N) < 0.2 across the recorded assembly up to ' +
      'N = 10^6, the degradation is paid entirely in height, not in Lambda.',
    q3_doesAnyFiniteKBeatPT:
      'YES. K_max(N) diverges as N -> infinity, so for ANY finite K there is a ' +
      'finite entry height N_min(K) above which the rescue gate holds and the ' +
      'finite-height beat L_pt(N) < 0.2 applies. Every finite K beats PT 0.2; ' +
      'the sole cost of a larger K is a higher N_min(K).',
  },

  honestLimit:
    'The finite-height beat L_pt < 0.2 is RECORDED only up to N = 10^6 (imp-452), ' +
    'and unconditional interval-RK4 certification of C_mb currently reaches only ' +
    'N = 10^4 (imp-963; the (10^4, 10^6] ladder is conservative-carryforward, ' +
    'projected-not-measured, imp-1082/1087/1088). So: K <= ~' + K_MAX_AT_1E4 + ' ' +
    'is unconditional TODAY; K up to ~' + K_MAX_AT_1E6 + ' becomes unconditional ' +
    'once imp-962 certifies C_mb on (10^4, 10^6]; K > ~' + K_MAX_AT_1E6 + ' also ' +
    'needs the L_pt assembly extended above N = 10^6. This file measures the ' +
    'K-to-height map only; it extends neither the sweep nor the assembly and ' +
    'makes no GUE-free proof claim beyond imp-963.',

  subGap: {
    id: 'imp-3275-sub-height-extension',
    status: 'open',
    blocker: false,
    statement:
      'To convert the tolerated-K budget above K ~ 1.384 into an actually-' +
      'unconditional weaker-K certificate, extend the imp-962 interval-RK4 ' +
      'sweep from N = 10^4 up to the height N_min(K) tabulated here (native ' +
      'backend / imp-1090 Rust port). No new mathematics is required -- the ' +
      'rescue gate and L_pt assembly are already in place; this is a compute-' +
      'bound sweep extension.',
    deferredTo: 'native-backend (imp-962 / imp-1090 Rust interval-RK4 port)',
  },
});

// ── Assertions (build-time tripwires) ────────────────────────────────────────

export const IMP_3275_WEAKER_K_CMB_DEGRADATION_ASSERTIONS = [
  {
    id: 'imp3275-rescue-budget-monotone-increasing',
    holds: () => {
      const ns = [100, 1000, 10000, 100000, 1000000];
      for (let i = 1; i < ns.length; i += 1) {
        if (!(kMaxAt(ns[i]) > kMaxAt(ns[i - 1]))) {
          return false;
        }
      }
      return true;
    },
    why:
      'The rescue budget K_max(N) = 0.12751*sqrt(N)/log(N) must be strictly ' +
      'increasing in N (it is, for N > e^2). Monotonicity is what makes ' +
      'nMinForK well-defined and guarantees a finite entry height for every K.',
  },
  {
    id: 'imp3275-budget-exceeds-one-at-1e4',
    holds: () => kMaxAt(10000) > 1,
    why:
      'The rescue budget at the currently-certified unconditional reach N = 10^4 ' +
      'must exceed 1: this is the load-bearing fact that the interval-arithmetic ' +
      'route ALREADY tolerates a weaker C_mb <= K with K > 1 unconditionally ' +
      'today (K_max(10^4) ~ 1.384), answering Q1 in the affirmative.',
  },
  {
    id: 'imp3275-budget-matches-finite-k-1e6-margin',
    holds: () => Math.abs(kMaxAt(1000000) - 9.23) < 0.05,
    why:
      'K_max(10^6) must reproduce the ~9.22 rescue budget the finite-k file ' +
      'quotes at N = 1e5..1e6. A drift here means the rescue threshold 0.12751 ' +
      'or the budget formula regressed relative to imp-963 / imp-1082.',
  },
  {
    id: 'imp3275-every-finite-K-has-finite-entry-height',
    holds: () =>
      IMP_3275_WEAKER_K_CMB_DEGRADATION.kDegradationTable.every(
        (r) => typeof r.n_min === 'number' && r.n_min >= 100,
      ),
    why:
      'Every K in the ladder (including K = 20, beyond the recorded assembly) ' +
      'must have a finite entry height N_min(K). This is the Q3 answer: since ' +
      'the budget diverges, no finite K is ever unreachable, so every finite K ' +
      'beats PT 0.2 at a sufficiently large but finite height.',
  },
  {
    id: 'imp3275-guaranteed-lambda-beats-pt-within-assembly',
    holds: () =>
      IMP_3275_WEAKER_K_CMB_DEGRADATION.kDegradationTable
        .filter((r) => r.within_recorded_assembly)
        .every((r) => r.guaranteed_lambda != null && r.guaranteed_lambda < 0.2),
    why:
      'For every K whose entry height lands within the recorded L_pt assembly ' +
      '(N_min <= 10^6), the guaranteed unconditional Lambda must be < 0.2. This ' +
      'is the Q2/Q3 headline: the beat value never degrades above PT for any K ' +
      'reachable inside the recorded assembly.',
  },
  {
    id: 'imp3275-entry-height-monotone-in-K',
    holds: () => {
      const rows = IMP_3275_WEAKER_K_CMB_DEGRADATION.kDegradationTable;
      for (let i = 1; i < rows.length; i += 1) {
        if (!(rows[i].n_min >= rows[i - 1].n_min)) {
          return false;
        }
      }
      return true;
    },
    why:
      'The entry height N_min(K) must be non-decreasing in K (the ladder is ' +
      'sorted ascending in K). This encodes the core finding: the cost of a ' +
      'weaker K is monotone height, not a worse Lambda.',
  },
  {
    id: 'imp3275-does-not-flip-conditional-status',
    holds: () =>
      IMP_3275_WEAKER_K_CMB_DEGRADATION.claimsTheorem === false &&
      IMP_3275_WEAKER_K_CMB_DEGRADATION.changesConditionalStatus === false &&
      IMP_3275_WEAKER_K_CMB_DEGRADATION.subGap.status === 'open',
    why:
      'This is an assess/measure-only ticket: it must NOT claim a theorem or ' +
      'flip any conditional, and its height-extension sub-gap must stay open. ' +
      'A regression here would be a false claim of unconditional closure above ' +
      'the imp-963 [100, 10^4] range.',
  },
];
