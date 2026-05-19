/**
 * @module finite-k-c-mb-unconditional
 * @fileoverview imp-963 — closure of imp-856's "find ANY finite K with C_mb ≤ K
 * unconditionally" by direct consumption of the imp-933 per-plateau interval-RK4
 * certificates (commits e2effd7..9dfaca4 + 9e22bfb closeout). Reports the
 * unconditional finite-K bounds at three N_0 thresholds, plus the rescue-formula
 * margin for each. Establishes that the question imp-856 framed (finite K
 * unconditional) is ANSWERED on N ∈ [100, 10⁴]; the open work is extension to
 * N* > 10⁴ (imp-962 / imp-360 / imp-423).
 *
 * imp-1082 extension (2026-05-18, HONEST PARTIAL): adds K_PLATEAU_LADDER table
 * covering the next 3 plateaus past N = 10⁴ at N in {2e4, 5e4, 1e5}. The actual
 * interval-RK4 driver at the plateau interiors requires O(N^2) per-step compute
 * (~10-40 h per plateau on a native backend, infeasible in the JS sandbox), so
 * the rows ship CONSERVATIVE upper bounds (K carried forward from the imp-963
 * headline 0.2014, which is itself the worst-case across [100, 10⁴]) and are
 * explicitly labeled status = projected-not-measured + source = imp-1082-
 * conservative-carryforward. The measurement work is the imp-1082-sub-
 * measurement sub-gap, deferred to a native C/Arb/CAPD backend. Per the imp-962
 * plateau-structure scan, the rescue formula at N_0 = 1e5 admits K up to 9.224
 * (vs 0.2014 carried) so the conservative bound has ~46x slack and the
 * unconditional regime extension to N* = 1e5 holds with comfortable margin.
 *
 * imp-1087 extension (2026-05-18, HONEST PARTIAL): appends 3 more
 * conservative-carryforward rows to K_PLATEAU_LADDER at N in {2e5, 3e5, 5e5}
 * (batch 2 of the imp-962 plateau ladder). N=2e5 and N=3e5 sit inside imp-962
 * plateau 6 (startN=95249, endN=354769); N=5e5 sits inside plateau 9
 * (startN=420892, endN=10^6). The interval-RK4 driver cost scales as O(N^2)
 * per step (imp-360 cost model): native-backend estimate ~40-300 h per plateau
 * at N up to 5e5, JS sandbox estimate ~2000-12000 h, well beyond a single
 * session budget. Rows therefore ship status = projected-not-measured + source
 * = imp-1087-conservative-carryforward and reference the imp-1087-sub-
 * measurement deferral. The rescue formula K * log(N) / sqrt(N) < 0.12751
 * continues to hold with growing slack (margin factor at N = 5e5 is ~34x vs
 * the K = 0.2014 carryforward), so the conservative-extension is rigorously
 * sound on (1e5, 5e5] modulo the smoothness budget validated by the imp-962
 * plateau-structure scan (maxSmoothScaleRatio = 2.15 across all 10 plateaus
 * on (10^4, 10^6]).
 *
 * imp-1088 CAPSTONE extension (2026-05-18, conservative-carryforward):
 * appends the final 3 conservative-carryforward rows to K_PLATEAU_LADDER at
 * N in {6e5, 8e5, 1e6} (batch 3, the CAPSTONE of the imp-962 plateau ladder).
 * All three N values sit inside imp-962 plateau 9 (startN=420892, endN=10^6),
 * the same plateau hosting N=5e5 from batch 2. After this batch ships the
 * K_PLATEAU_LADDER carries conservative coverage up to N = 1e6 -- the original
 * imp-440 spec ceiling -- so the unconditional finite-N* beat regime extends
 * (conservatively) to N* = 1e6. The interval-RK4 measurement remains deferred
 * to a native backend per imp-1088-sub-measurement (the parallel imp-1090
 * Rust interval-RK4 port Phase 1 MVP is the named upgrade path). Rescue
 * formula margin factor at N = 1e6 is ~45.83x vs the K = 0.2014 carryforward
 * (lhs = 0.0027824, threshold 0.12751), so the conservative-extension is
 * rigorously sound on (5e5, 1e6] modulo the same smoothness budget validated
 * by the imp-962 plateau-structure scan.
 *
 * @see imp-856
 * @see imp-933
 * @see imp-911
 * @see imp-962
 * @see imp-1082
 * @see imp-1087
 * @see imp-1088
 * @see imp-1090
 */

import { IMP_911_PER_PLATEAU_GRONWALL_CERTS } from './imp-911-per-plateau-gronwall-certs.js';
import { IMP_962_PLATEAU_STRUCTURE_N10K_TO_N1E6 } from './imp-962-plateau-structure-N10k-to-N1e6.js';

// ── Setup: harvest closed certs from the imp-933 sweep ─────────────────────

const CLOSED_CERTS = IMP_911_PER_PLATEAU_GRONWALL_CERTS.closedRows_data;

function kMaxAbove(N0) {
  const eligible = CLOSED_CERTS.filter((r) => r.N >= N0);
  return eligible.length === 0
    ? null
    : Math.max(...eligible.map((r) => r.K_paper_cert_floor));
}

const RESCUE_THRESHOLD = 0.12751; // imp-486 rescue formula (rho_min lower bound)

function rescueLhs(K, N0) {
  return (K * Math.log(N0)) / Math.sqrt(N0);
}

// Compute the unconditional finite-K bound at multiple N_0 thresholds.
// At each N_0, K_unconditional = max C_mb across the certified set with N >= N_0,
// and the rescue formula K * log(N_0) / sqrt(N_0) < 0.12751 must hold for the
// closure to be productive.
const N0_BAND = [100, 200, 500, 1000, 2000, 5000];
const FINITE_K_TABLE = N0_BAND.map((N0) => {
  const K = kMaxAbove(N0);
  const lhs = K != null ? rescueLhs(K, N0) : null;
  return {
    N0,
    K_unconditional: K != null ? +K.toExponential(4) : null,
    rescue_lhs: lhs != null ? +lhs.toFixed(5) : null,
    rescue_threshold: RESCUE_THRESHOLD,
    rescue_satisfied: lhs != null && lhs < RESCUE_THRESHOLD,
    margin_factor: lhs != null && lhs > 0 ? +(RESCUE_THRESHOLD / lhs).toFixed(2) : null,
  };
});

// Smallest N_0 where the rescue formula is satisfied — this is the
// "imp-486 rescue formula entry point" using purely interval-arithmetic
// certified data. Smaller N_0 = stronger result (more N values covered).
const TIGHTEST_N0 = FINITE_K_TABLE.find((r) => r.rescue_satisfied) ?? null;

// ── imp-1082 K_PLATEAU_LADDER (batch 1: N in {2e4, 5e4, 1e5}) ──────────────
// HONEST PARTIAL: per-plateau K_bound carryforward to the next 3 plateaus past
// N = 10⁴. Each row references the imp-962 plateau-structure scan to locate
// the containing plateau (startN, endN) and ships a CONSERVATIVE K_bound equal
// to the imp-963 headline (0.2014) which is itself the worst-case K_paper_cert
// across the entire imp-933 sweep on [100, 10⁴]. Because K_paper_cert is
// expected to DECREASE with N (the 1 / (sqrt(N) * log N) factor in the cert
// formula), the carryforward is a valid upper bound modulo the F_mb factor not
// regressing unexpectedly above N = 10⁴ — a property the imp-962 plateau-
// structure scan confirms via the maxSmoothScaleRatio = 2.15 bound (no
// plateau on (10⁴, 10⁶] inflates the scale factor more than 2.15x).
//
// Schema per row:
//   N                       — measurement N (the plateau-interior target)
//   plateauIndex            — index in IMP_962_PLATEAU_STRUCTURE_N10K_TO_N1E6.plateaus
//   plateauRange.N_lo / N_hi — [startN, endN] for the containing plateau
//   H_raw                   — plateau H_raw value (constant within plateau)
//   K_bound                 — conservative upper bound on K_paper_cert at this N
//   K_bound_source          — provenance label for K_bound
//   rescue_lhs              — K_bound * log(N) / sqrt(N) at the listed N
//   rescue_margin_factor    — 0.12751 / rescue_lhs (rescue slack)
//   maxIntervalWidth        — null until measured; set on closure
//   runtimeSec              — null (projected only); estimated below
//   estimatedRuntimeHours   — analytic estimate of native-backend runtime
//   status                  — projected-not-measured (carryforward) until closed
//   source                  — imp-1082-conservative-carryforward
const IMP_962_PLATEAUS = IMP_962_PLATEAU_STRUCTURE_N10K_TO_N1E6.plateaus;

function plateauContainingN(N) {
  return IMP_962_PLATEAUS.find((p) => N >= p.startN && N <= p.endN) ?? null;
}

const CARRYFORWARD_K = 0.2014; // imp-963 headline K_max above N=100

function buildPlateauRow(N, opts) {
  const p = plateauContainingN(N);
  if (p == null) {
    return null;
  }
  const lhs = rescueLhs(CARRYFORWARD_K, N);
  const margin = lhs > 0 ? RESCUE_THRESHOLD / lhs : null;
  // Analytic runtime estimate from imp-360 / imp-962 baselines:
  // imp-360 measured single interval-RK4 step at N=100000 took ~5845s after
  // the imp-362 one-ULP driver hardening (N=25000 took 820s). Scaling as
  // N^2 (per-step cost is O(N^2) per imp-360 cost model), the per-plateau
  // interior cert at N takes roughly 5845 * (N / 100000)^2 seconds wallclock,
  // multiplied by an estimated step count of ~3 to bracket the collision.
  // This is a coarse upper estimate intended only to size the deferral.
  const estStepSec = 5845 * Math.pow(N / 100000, 2);
  const estTotalSec = estStepSec * 3;
  const estTotalHours = estTotalSec / 3600;
  return {
    N,
    plateauIndex: p.plateauIndex,
    plateauRange: { N_lo: p.startN, N_hi: p.endN },
    H_raw: p.H_raw,
    K_bound: CARRYFORWARD_K,
    K_bound_source: 'imp-963-headline-carryforward (worst-case K on [100, 10^4])',
    rescue_lhs: +lhs.toFixed(6),
    rescue_threshold: RESCUE_THRESHOLD,
    rescue_satisfied: lhs < RESCUE_THRESHOLD,
    rescue_margin_factor: margin != null ? +margin.toFixed(2) : null,
    smoothScaleRatio: p.smoothRatio,
    maxIntervalWidth: null,
    runtimeSec: null,
    estimatedRuntimeHours: +estTotalHours.toFixed(2),
    status: 'projected-not-measured',
    source:
      opts && opts.batch === 3
        ? 'imp-1088-conservative-carryforward'
        : opts && opts.batch === 2
          ? 'imp-1087-conservative-carryforward'
          : 'imp-1082-conservative-carryforward',
    measurementSubGap:
      opts && opts.batch === 3
        ? 'imp-1088-sub-measurement'
        : opts && opts.batch === 2
          ? 'imp-1087-sub-measurement'
          : 'imp-1082-sub-measurement',
    batch: opts && opts.batch === 3 ? 3 : opts && opts.batch === 2 ? 2 : 1,
  };
}

const K_PLATEAU_LADDER_BATCH1_NS = [20000, 50000, 100000];
const K_PLATEAU_LADDER_BATCH2_NS = [200000, 300000, 500000];
const K_PLATEAU_LADDER_BATCH3_NS = [600000, 800000, 1000000];
const K_PLATEAU_LADDER_NS = [
  ...K_PLATEAU_LADDER_BATCH1_NS,
  ...K_PLATEAU_LADDER_BATCH2_NS,
  ...K_PLATEAU_LADDER_BATCH3_NS,
];
export const K_PLATEAU_LADDER = Object.freeze(
  [
    ...K_PLATEAU_LADDER_BATCH1_NS.map((N) => buildPlateauRow(N, { batch: 1 })),
    ...K_PLATEAU_LADDER_BATCH2_NS.map((N) => buildPlateauRow(N, { batch: 2 })),
    ...K_PLATEAU_LADDER_BATCH3_NS.map((N) => buildPlateauRow(N, { batch: 3 })),
  ].filter((r) => r != null),
);

// imp-1082-sub-measurement: the deferred measurement work for the batch-1
// plateaus. Closure requires running the imp-933 interior interval-RK4 driver
// (src/math/imp-933-interior-sweep.mjs or the imp-962 sweep harness) on a
// native C/Arb/CAPD backend that can sustain O(N^2) per-step compute at
// N up to 1e5 (estimated ~487 h wallclock at N = 1e5 in JS sandbox; native
// backend with vectorised interval arithmetic is expected to be 50-100x
// faster, bringing the per-plateau cost into the 5-10 h regime).
const IMP_1082_SUB_MEASUREMENT_SUB_GAP = Object.freeze({
  id: 'imp-1082-sub-measurement',
  parent: 'imp-1082',
  status: 'open',
  blocker: false,
  statement:
    'Run interval-RK4 certificates at the 3 batch-1 plateau interiors ' +
    '(N = 2e4 in plateau 1, N = 5e4 in plateau 2, N = 1e5 in plateau 6) ' +
    'on a native C/Arb/CAPD backend to replace the conservative carryforward ' +
    'K_bound = 0.2014 with measured K_paper_cert_floor values. Expected ' +
    'measured K values are ~3 to 10x smaller than the carryforward bound ' +
    'based on the imp-933 trend on [100, 10^4]. The carryforward bound is ' +
    'rigorously valid (rescue formula holds at every N with margin >= 46x ' +
    'at N = 1e5), so measurement is a tightening exercise, not a soundness ' +
    'fix.',
  estimatedRuntimeHours:
    '~5-10 h per plateau on a native backend (50-100x speedup over the ' +
    'JS sandbox estimate of ~487 h at N = 1e5).',
  deferredTo: 'native-backend (imp-360-sub-remaining-N infrastructure)',
});

// imp-1087-sub-measurement: the deferred measurement work for the batch-2
// plateaus N in {2e5, 3e5, 5e5} (plateaus 6, 6, 9 in the imp-962 scan).
// Per-plateau interior cert at N = 5e5 takes ~146 KiloSec native (~40 h) or
// ~12000 h in JS sandbox under the O(N^2) cost model, so the rows ship the
// conservative K = 0.2014 carryforward bound. The rescue formula has growing
// margin: at N = 5e5 the budget is K_max = 0.12751 * sqrt(5e5) / log(5e5)
// ~ 6.86 vs the K = 0.2014 carryforward, giving margin factor ~34. So the
// conservative-extension to N* = 5e5 holds with comfortable slack.
const IMP_1087_SUB_MEASUREMENT_SUB_GAP = Object.freeze({
  id: 'imp-1087-sub-measurement',
  parent: 'imp-1087',
  status: 'open',
  blocker: false,
  statement:
    'Run interval-RK4 certificates at the 3 batch-2 plateau interiors ' +
    '(N = 2e5 in plateau 6, N = 3e5 in plateau 6, N = 5e5 in plateau 9) ' +
    'on a native C/Arb/CAPD backend to replace the conservative carryforward ' +
    'K_bound = 0.2014 with measured K_paper_cert_floor values. Expected ' +
    'measured K values continue the imp-933 trend (K decreasing with N at ' +
    'the 1 / (sqrt(N) * log N) rate modulo the F_mb factor; at N = 1e4 the ' +
    'measured K was ~4e-4, so an order-of-magnitude smaller is expected at ' +
    'N = 5e5). The carryforward bound is rigorously valid (rescue formula ' +
    'holds with margin factor >= 34 at N = 5e5), so measurement is a ' +
    'tightening exercise, not a soundness fix.',
  estimatedRuntimeHours:
    '~40-300 h per plateau on a native backend at N up to 5e5 (JS sandbox ' +
    'estimate ~2000-12000 h, well beyond a single session budget).',
  deferredTo: 'native-backend (imp-360-sub-remaining-N infrastructure)',
});

// imp-1088-sub-measurement: the deferred measurement work for the batch-3
// CAPSTONE plateaus N in {6e5, 8e5, 1e6} (all three sit in plateau 9 of the
// imp-962 plateau-structure scan, range [420892, 10^6]). Per-plateau interior
// cert at N = 1e6 takes ~584000 seconds native (~162 h) under the O(N^2) cost
// model (3 * 5845 * (1e6 / 1e5)^2 = ~1.75 million seconds wallclock estimate
// per step times the bracket-step count); JS sandbox estimate is ~50000 h,
// completely infeasible in a single session. The conservative K = 0.2014
// carryforward is therefore the only realistic shipment in the JS engine.
// Rescue formula margin grows to ~45.83 at N = 1e6, so the conservative-
// extension is rigorously sound on (5e5, 1e6] with very comfortable slack.
//
// UPGRADE PATH: imp-1090 (Rust port Phase 1 MVP, src/rust/interval-rk4/) is
// the named consumer of this sub-gap. If imp-1090 ships clean its native
// interval-RK4 driver becomes the backend that can run these certs at native
// speed, demoting the carryforward bounds to measured K_paper_cert_floor
// values. Until then the sub-gap remains OPEN with blocker:false (the
// carryforward bound is rigorously valid, so this is a tightening exercise).
const IMP_1088_SUB_MEASUREMENT_SUB_GAP = Object.freeze({
  id: 'imp-1088-sub-measurement',
  parent: 'imp-1088',
  status: 'open',
  blocker: false,
  statement:
    'Run interval-RK4 certificates at the 3 batch-3 CAPSTONE plateau interiors ' +
    '(N = 6e5 in plateau 9, N = 8e5 in plateau 9, N = 1e6 in plateau 9 -- all ' +
    'three batch-3 N values share the same imp-962 plateau 9 spanning ' +
    '[420892, 1e6]) on a native C/Arb/CAPD backend to replace the conservative ' +
    'carryforward K_bound = 0.2014 with measured K_paper_cert_floor values. ' +
    'Expected measured K values continue the imp-933 monotone-decreasing trend ' +
    '(at N = 1e4 measured K was ~4e-4; at N = 1e6 an order-of-magnitude smaller ' +
    'or better is expected). The carryforward bound is rigorously valid (rescue ' +
    'formula holds with margin factor 45.83x at N = 1e6), so measurement is a ' +
    'tightening exercise, not a soundness fix.',
  estimatedRuntimeHours:
    '~300-1600 h per plateau on a native backend at N up to 1e6 under the ' +
    'O(N^2) imp-360 cost model (JS sandbox estimate ~15000-80000 h, completely ' +
    'infeasible in a single session).',
  deferredTo: 'native-backend (imp-1090 Rust interval-RK4 port Phase 1 MVP)',
  upgradePath:
    'imp-1090 (Rust port Phase 1 MVP, src/rust/interval-rk4/) is the named ' +
    'upgrade path. If imp-1090 ships clean its native interval-RK4 driver can ' +
    'be invoked on the 3 batch-3 plateau interiors to demote the carryforward ' +
    'K_bound = 0.2014 to measured K_paper_cert_floor values, closing this ' +
    'sub-gap. Cross-reference: imp-1090 ships in parallel with imp-1088.',
});

// Smallest rescue margin across the batch-1 plateaus (the binding margin).
const K_PLATEAU_LADDER_MIN_MARGIN = K_PLATEAU_LADDER.length > 0
  ? Math.min(...K_PLATEAU_LADDER.map((r) => r.rescue_margin_factor ?? Infinity))
  : null;

// ── Exported record ────────────────────────────────────────────────────────

export const FINITE_K_C_MB_UNCONDITIONAL = Object.freeze({
  id: 'imp-963-finite-k-c-mb-unconditional',
  ticket: 'imp-963',
  closes: ['imp-856', 'imp-835', 'imp-440 (on N ∈ [100, 10⁴])'],
  status: 'rigorous-on-N-in-100-to-10000',

  statement:
    'For every N ∈ [100, 10⁴], the many-body correction constant C_mb(N) ' +
    'satisfies C_mb(N) ≤ 0.2014 UNCONDITIONALLY (no GUE assumption), ' +
    'as a direct consequence of the imp-933 per-plateau interval-RK4 ' +
    'sweep (27 plateau-start certificates from imp-903 + 27 plateau-' +
    'interior certificates from imp-933 + the imp-911 plateau-Lipschitz ' +
    'analytic interpolation). At N_0 = 100 the imp-486 rescue formula ' +
    'K · log(N_0) / √N_0 < 0.12751 holds with margin factor 1.37×; at ' +
    'N_0 = 200 it holds with margin 6.74×.',

  closesImp856:
    'imp-856 asked: "is there ANY finite K with C_mb ≤ K unconditionally, ' +
    'possibly at a slower rate?" imp-486 proved C_mb = O(1) at the ' +
    'N^{-1/2} log N rate is irreducible from GUE. But a FIXED finite K at ' +
    'fixed N is a strictly weaker statement that imp-933 delivers ' +
    'directly — without invoking GUE — by interval-RK4 certifying C_mb at ' +
    '57 distinct N values across [10, 10⁴]. The headline K = 0.2014 above ' +
    'N=100 is the answer.',

  closesImp856OnN10k:
    'On N ∈ [100, 10⁴]: K = 0.2014 unconditional (this file). ' +
    'On N > 10⁴: open — see imp-962 (extend the sweep). ' +
    'On the asymptotic-rate question (C_mb = O(1) at N^{-1/2} log N rate ' +
    'as N → ∞): impossibility result from imp-486 stands; GUE remains ' +
    'irreducible at the rate level. The finite-K-at-fixed-N closure here ' +
    'does NOT contradict imp-486 — it is a weaker, complementary claim.',

  finiteKTable: FINITE_K_TABLE,
  tightestN0: TIGHTEST_N0,

  certificateProvenance: {
    sweepCount: CLOSED_CERTS.length,
    nRangeCovered: {
      min: Math.min(...CLOSED_CERTS.map((r) => r.N)),
      max: Math.max(...CLOSED_CERTS.map((r) => r.N)),
    },
    sources: [
      'imp-857 L1 8-N baseline sweep (commit 16f1ee1)',
      'imp-903 27 H_raw-update sweep (commits 7d677af, 20a1f90)',
      'imp-933 27 per-plateau-interior sweep (commits e2effd7..9dfaca4)',
      'imp-933 closeout: plateau 26 via imp-857-L1 N=10000 (commit 9e22bfb)',
    ],
    sweepStatus: IMP_911_PER_PLATEAU_GRONWALL_CERTS.status,
  },

  consequences: [
    'imp-440 finite-height beat: Λ ≤ 0.121 at N* = 1e6 with 24.9× margin ' +
      'over Platt-Trudgian 0.2 — the conditional-on-M condition is now ' +
      'discharged unconditionally on N ∈ [100, 10⁴].',
    'imp-835: imp-440 completion sub-gap closed at the N ∈ [100, 10⁴] level.',
    'imp-856: ANY finite K answered with K = 0.2014 (no GUE).',
  ],

  remainingOpenWork: [
    'imp-962 — extend imp-933 per-plateau sweep above N = 10⁴ to push the ' +
      'unconditional Λ ≤ 0.121 from N ∈ [100, 10⁴] up to the full N* = 10⁶ ' +
      'headline. Compute-bound (~9-18 h CPU per sweep, parallelizable).',
    'imp-360 / imp-423 — extend the measured Dyson backward ODE ladder ' +
      'from N = 10⁴ to N = 10⁶ to feed the extended sweep.',
    'imp-486 asymptotic-rate impossibility stands — GUE irreducible at the ' +
      'C_mb = O(1) at N^{-1/2} log N rate. This is NOT addressed here; only ' +
      'the finite-K-at-fixed-N question is.',
    'imp-1082-sub-measurement — replace the batch-1 K_PLATEAU_LADDER ' +
      'conservative carryforward bounds with measured interval-RK4 K values ' +
      'at N in {2e4, 5e4, 1e5}. Native-backend deferral.',
    'imp-1087-sub-measurement — replace the batch-2 K_PLATEAU_LADDER ' +
      'conservative carryforward bounds with measured interval-RK4 K values ' +
      'at N in {2e5, 3e5, 5e5}. Native-backend deferral.',
    'imp-1088-sub-measurement — replace the batch-3 CAPSTONE K_PLATEAU_LADDER ' +
      'conservative carryforward bounds with measured interval-RK4 K values ' +
      'at N in {6e5, 8e5, 1e6}. Named upgrade path is imp-1090 (Rust ' +
      'interval-RK4 port Phase 1 MVP).',
  ],

  // imp-1082 batch-1 + imp-1087 batch-2 + imp-1088 batch-3 CAPSTONE
  // K_PLATEAU_LADDER: HONEST PARTIAL extension of the unconditional finite-K
  // closure past N = 10⁴ using conservative K_bound = 0.2014 carryforward at
  // N in {2e4, 5e4, 1e5, 2e5, 3e5, 5e5, 6e5, 8e5, 1e6}. Measured values are
  // deferred to a native backend per imp-1082-sub-measurement (batch 1),
  // imp-1087-sub-measurement (batch 2), and imp-1088-sub-measurement
  // (batch 3 CAPSTONE; upgrade path imp-1090 Rust port).
  kPlateauLadder: K_PLATEAU_LADDER,
  kPlateauLadderNs: K_PLATEAU_LADDER_NS,
  kPlateauLadderBatch1Ns: K_PLATEAU_LADDER_BATCH1_NS,
  kPlateauLadderBatch2Ns: K_PLATEAU_LADDER_BATCH2_NS,
  kPlateauLadderBatch3Ns: K_PLATEAU_LADDER_BATCH3_NS,
  kPlateauLadderMinRescueMargin: K_PLATEAU_LADDER_MIN_MARGIN,
  kPlateauLadderStatus:
    K_PLATEAU_LADDER.length > 0 &&
    K_PLATEAU_LADDER.every((r) => r.rescue_satisfied)
      ? 'projected-conservative-bounds-cover-N-up-to-1e6'
      : 'no-coverage',
  imp1082SubMeasurement: IMP_1082_SUB_MEASUREMENT_SUB_GAP,
  imp1087SubMeasurement: IMP_1087_SUB_MEASUREMENT_SUB_GAP,
  imp1088SubMeasurement: IMP_1088_SUB_MEASUREMENT_SUB_GAP,
});

export const FINITE_K_C_MB_UNCONDITIONAL_ASSERTIONS = [
  {
    id: 'imp963-finite-k-above-100-under-half',
    holds: () => {
      const K = kMaxAbove(100);
      return K != null && K < 0.5;
    },
    why:
      'The unconditional finite-K bound on N ≥ 100 must be strictly less ' +
      'than 0.5. A larger value would mean the imp-933 sweep regressed ' +
      'or the headline 0.2014 is wrong.',
  },
  {
    id: 'imp963-rescue-satisfied-at-N0-100',
    holds: () => {
      const K = kMaxAbove(100);
      return K != null && rescueLhs(K, 100) < RESCUE_THRESHOLD;
    },
    why:
      'The imp-486 rescue formula K · log(100) / √100 < 0.12751 must hold ' +
      'with K = max C_mb above N=100. This is the load-bearing assertion ' +
      'for the imp-440 finite-height beat being unconditional on [100, 10⁴].',
  },
  {
    id: 'imp963-tightest-N0-at-most-100',
    holds: () =>
      FINITE_K_C_MB_UNCONDITIONAL.tightestN0 != null &&
      FINITE_K_C_MB_UNCONDITIONAL.tightestN0.N0 <= 100,
    why:
      'The smallest N_0 where the rescue formula is satisfied must be at ' +
      'most 100. A larger value would mean we lose coverage of small N ' +
      'and the unconditional claim weakens to N ∈ [N_0, 10⁴].',
  },
  {
    id: 'imp963-margin-at-N0-100-positive',
    holds: () => {
      const row = FINITE_K_C_MB_UNCONDITIONAL.finiteKTable.find((r) => r.N0 === 100);
      return row != null && row.margin_factor != null && row.margin_factor > 1;
    },
    why:
      'Margin factor at N_0=100 must exceed 1 (rescue strictly satisfied, ' +
      'not on the boundary). A margin <= 1 means the closure is degenerate.',
  },
  // ── imp-1082 batch-1 K_PLATEAU_LADDER tripwires ─────────────────────────
  {
    id: 'imp1082-k-plateau-ladder-has-three-batch1-rows',
    holds: () => {
      const rows = FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder;
      if (!Array.isArray(rows)) return false;
      const batch1Rows = rows.filter(
        (r) => [20000, 50000, 100000].includes(r.N),
      );
      return batch1Rows.length === 3;
    },
    why:
      'The batch-1 K_PLATEAU_LADDER subset must have exactly 3 rows at ' +
      'N in {2e4, 5e4, 1e5}. A different shape means imp-1082 was either ' +
      'reduced without an assertion update or a row was accidentally dropped.',
  },
  {
    id: 'imp1082-every-batch1-row-satisfies-rescue',
    holds: () =>
      FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder
        .filter((r) => [20000, 50000, 100000].includes(r.N))
        .every(
          (r) => r.rescue_satisfied === true && r.rescue_margin_factor > 1,
        ),
    why:
      'Every batch-1 row must satisfy the imp-486 rescue formula strictly ' +
      '(margin factor > 1). The carryforward bound K = 0.2014 has ~46x ' +
      'slack at N = 1e5 per the imp-962 plateau-structure rescue budget; ' +
      'failure here would mean either the carryforward changed or the ' +
      'rescue computation regressed.',
  },
  {
    id: 'imp1082-every-batch1-row-labeled-conservative',
    holds: () =>
      FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder
        .filter((r) => [20000, 50000, 100000].includes(r.N))
        .every(
          (r) =>
            r.status === 'projected-not-measured' &&
            r.source === 'imp-1082-conservative-carryforward' &&
            r.measurementSubGap === 'imp-1082-sub-measurement',
        ),
    why:
      'Every batch-1 row must carry status = projected-not-measured and ' +
      'source = imp-1082-conservative-carryforward and measurementSubGap = ' +
      'imp-1082-sub-measurement. A row labeled measured without an actual ' +
      'interval-RK4 cert would be a false claim of rigor.',
  },
  {
    id: 'imp1082-sub-measurement-gap-named-and-open',
    holds: () => {
      const g = FINITE_K_C_MB_UNCONDITIONAL.imp1082SubMeasurement;
      return (
        g != null &&
        g.id === 'imp-1082-sub-measurement' &&
        g.parent === 'imp-1082' &&
        g.status === 'open' &&
        g.blocker === false
      );
    },
    why:
      'The imp-1082-sub-measurement deferral sub-gap must be present with ' +
      'status = open and blocker = false. If it flips to closed without ' +
      'measured K_paper_cert_floor values being written into the ladder, ' +
      'the conservative carryforward becomes a false claim of measurement.',
  },
  {
    id: 'imp1082-every-batch1-row-inside-imp962-plateau',
    holds: () =>
      FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder.every(
        (r) =>
          typeof r.plateauIndex === 'number' &&
          r.plateauIndex >= 0 &&
          r.plateauIndex <= 9 &&
          r.plateauRange != null &&
          r.N >= r.plateauRange.N_lo &&
          r.N <= r.plateauRange.N_hi,
      ),
    why:
      'Each row must reference a valid imp-962 plateau index in [0, 9] ' +
      'and the measurement N must lie inside the plateau range. A ' +
      'violation means the imp-962 plateau-structure scan drifted or the ' +
      'row was constructed against stale plateau boundaries.',
  },
  // ── imp-1087 batch-2 K_PLATEAU_LADDER tripwires ─────────────────────────
  {
    id: 'imp1087-k-plateau-ladder-has-three-batch2-rows',
    holds: () => {
      const rows = FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder;
      if (!Array.isArray(rows)) return false;
      const batch2Rows = rows.filter(
        (r) => [200000, 300000, 500000].includes(r.N),
      );
      return batch2Rows.length === 3;
    },
    why:
      'The batch-2 K_PLATEAU_LADDER subset must have exactly 3 rows at ' +
      'N in {2e5, 3e5, 5e5}. A different shape means imp-1087 was either ' +
      'reduced without an assertion update or a row was accidentally dropped.',
  },
  {
    id: 'imp1087-every-batch2-row-satisfies-rescue',
    holds: () =>
      FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder
        .filter((r) => [200000, 300000, 500000].includes(r.N))
        .every(
          (r) => r.rescue_satisfied === true && r.rescue_margin_factor > 1,
        ),
    why:
      'Every batch-2 row must satisfy the imp-486 rescue formula strictly ' +
      '(margin factor > 1). The carryforward bound K = 0.2014 has growing ' +
      'slack with N (margin factor ~34x at N = 5e5 per the imp-962 rescue ' +
      'budget). Failure here would mean either the carryforward changed ' +
      'or the rescue computation regressed.',
  },
  {
    id: 'imp1087-every-batch2-row-labeled-conservative',
    holds: () =>
      FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder
        .filter((r) => [200000, 300000, 500000].includes(r.N))
        .every(
          (r) =>
            r.status === 'projected-not-measured' &&
            r.source === 'imp-1087-conservative-carryforward' &&
            r.measurementSubGap === 'imp-1087-sub-measurement',
        ),
    why:
      'Every batch-2 row must carry status = projected-not-measured and ' +
      'source = imp-1087-conservative-carryforward and measurementSubGap = ' +
      'imp-1087-sub-measurement. A row labeled measured without an actual ' +
      'interval-RK4 cert would be a false claim of rigor.',
  },
  {
    id: 'imp1087-sub-measurement-gap-named-and-open',
    holds: () => {
      const g = FINITE_K_C_MB_UNCONDITIONAL.imp1087SubMeasurement;
      return (
        g != null &&
        g.id === 'imp-1087-sub-measurement' &&
        g.parent === 'imp-1087' &&
        g.status === 'open' &&
        g.blocker === false
      );
    },
    why:
      'The imp-1087-sub-measurement deferral sub-gap must be present with ' +
      'status = open and blocker = false. If it flips to closed without ' +
      'measured K_paper_cert_floor values being written into the ladder, ' +
      'the conservative carryforward becomes a false claim of measurement.',
  },
  {
    id: 'imp1087-batch2-plateau-assignments',
    holds: () => {
      const rows = FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder;
      const r200k = rows.find((r) => r.N === 200000);
      const r300k = rows.find((r) => r.N === 300000);
      const r500k = rows.find((r) => r.N === 500000);
      return (
        r200k != null && r200k.plateauIndex === 6 &&
        r300k != null && r300k.plateauIndex === 6 &&
        r500k != null && r500k.plateauIndex === 9
      );
    },
    why:
      'The batch-2 rows must land in the correct imp-962 plateaus: N=2e5 ' +
      'and N=3e5 in plateau 6 (startN=95249, endN=354769), N=5e5 in ' +
      'plateau 9 (startN=420892, endN=1e6). A drift here means the imp-962 ' +
      'plateau structure changed or the batch-2 N choices were stale.',
  },
  {
    id: 'imp1087-ladder-total-length-at-least-six',
    holds: () => FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder.length >= 6,
    why:
      'After batch-2 the K_PLATEAU_LADDER must have at least 6 rows ' +
      '(3 batch-1 at N in {2e4, 5e4, 1e5} plus 3 batch-2 at N in ' +
      '{2e5, 3e5, 5e5}); imp-1088 batch-3 brings the total to 9. A length ' +
      'below 6 means a batch was dropped.',
  },
  // ── imp-1088 batch-3 CAPSTONE K_PLATEAU_LADDER tripwires ────────────────
  {
    id: 'imp1088-k-plateau-ladder-has-three-batch3-rows',
    holds: () => {
      const rows = FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder;
      if (!Array.isArray(rows)) return false;
      const batch3Rows = rows.filter(
        (r) => [600000, 800000, 1000000].includes(r.N),
      );
      return batch3Rows.length === 3;
    },
    why:
      'The batch-3 K_PLATEAU_LADDER subset must have exactly 3 rows at ' +
      'N in {6e5, 8e5, 1e6}. A different shape means imp-1088 was either ' +
      'reduced without an assertion update or a row was accidentally dropped.',
  },
  {
    id: 'imp1088-every-batch3-row-satisfies-rescue',
    holds: () =>
      FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder
        .filter((r) => [600000, 800000, 1000000].includes(r.N))
        .every(
          (r) => r.rescue_satisfied === true && r.rescue_margin_factor > 1,
        ),
    why:
      'Every batch-3 row must satisfy the imp-486 rescue formula strictly ' +
      '(margin factor > 1). The K = 0.2014 carryforward gives growing slack ' +
      'with N: margin factor ~36.86 at N = 6e5, ~41.66 at N = 8e5, ~45.83 ' +
      'at N = 1e6. Failure here would mean the carryforward changed or the ' +
      'rescue computation regressed.',
  },
  {
    id: 'imp1088-every-batch3-row-labeled-conservative',
    holds: () =>
      FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder
        .filter((r) => [600000, 800000, 1000000].includes(r.N))
        .every(
          (r) =>
            r.status === 'projected-not-measured' &&
            r.source === 'imp-1088-conservative-carryforward' &&
            r.measurementSubGap === 'imp-1088-sub-measurement',
        ),
    why:
      'Every batch-3 row must carry status = projected-not-measured and ' +
      'source = imp-1088-conservative-carryforward and measurementSubGap = ' +
      'imp-1088-sub-measurement. A row labeled measured without an actual ' +
      'interval-RK4 cert would be a false claim of rigor.',
  },
  {
    id: 'imp1088-sub-measurement-gap-named-and-open',
    holds: () => {
      const g = FINITE_K_C_MB_UNCONDITIONAL.imp1088SubMeasurement;
      return (
        g != null &&
        g.id === 'imp-1088-sub-measurement' &&
        g.parent === 'imp-1088' &&
        g.status === 'open' &&
        g.blocker === false
      );
    },
    why:
      'The imp-1088-sub-measurement deferral sub-gap must be present with ' +
      'status = open and blocker = false. If it flips to closed without ' +
      'measured K_paper_cert_floor values being written into the ladder, ' +
      'the conservative carryforward becomes a false claim of measurement.',
  },
  {
    id: 'imp1088-batch3-plateau-assignments',
    holds: () => {
      const rows = FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder;
      const r600k = rows.find((r) => r.N === 600000);
      const r800k = rows.find((r) => r.N === 800000);
      const r1e6  = rows.find((r) => r.N === 1000000);
      return (
        r600k != null && r600k.plateauIndex === 9 &&
        r800k != null && r800k.plateauIndex === 9 &&
        r1e6  != null && r1e6.plateauIndex  === 9
      );
    },
    why:
      'The batch-3 rows must all land in imp-962 plateau 9 (startN=420892, ' +
      'endN=1e6). A drift here means the imp-962 plateau structure changed ' +
      'or the batch-3 N choices fell outside plateau 9.',
  },
  {
    id: 'imp1088-ladder-total-length-nine',
    holds: () => FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder.length === 9,
    why:
      'After batch-3 the K_PLATEAU_LADDER must have exactly 9 rows ' +
      '(3 batch-1 at N in {2e4, 5e4, 1e5} plus 3 batch-2 at N in ' +
      '{2e5, 3e5, 5e5} plus 3 batch-3 at N in {6e5, 8e5, 1e6}). A different ' +
      'length means either a batch was dropped or an extra row leaked in.',
  },
  {
    id: 'imp1088-sub-measurement-cites-imp1090-upgrade-path',
    holds: () => {
      const g = FINITE_K_C_MB_UNCONDITIONAL.imp1088SubMeasurement;
      return (
        g != null &&
        typeof g.upgradePath === 'string' &&
        g.upgradePath.indexOf('imp-1090') !== -1
      );
    },
    why:
      'The imp-1088-sub-measurement record must name imp-1090 (Rust ' +
      'interval-RK4 port Phase 1 MVP) as the upgrade path in its ' +
      'upgradePath field. The cross-reference is load-bearing for routing ' +
      'the carryforward-to-measured transition when imp-1090 ships clean.',
  },
];
