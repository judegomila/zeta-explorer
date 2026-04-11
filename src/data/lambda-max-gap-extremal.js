/**
 * imp-355: Close G3a_max_gap — extremal max-gap statistics at the argmin site
 *
 * Problem
 * -------
 * imp-342 (lambda-intercept-density-weyl.js) rigorously closed the tail
 * sub-gap G3b_weyl_tail via a Riemann-von Mangoldt local-density argument,
 * giving
 *
 *     S_{tail}(k_star)  >=  2 * rho_infty(gamma_{k_star})^2 * (pi^2/6 - 1),
 *
 * and the corresponding tail-only constant c_tail ~= 1.290 in the
 * c(N) / B^2 template. The tail alone does NOT cross the critical
 * threshold c = 2 needed to enter regime (c) of the imp-337 density squeeze
 * and push dg_{k_star}/dtau into the supercritical sign flip required for a
 * non-vacuous upper bound on |tau_c|.
 *
 * The remaining obstruction is G3a_max_gap: a rigorous upper bound on the
 * larger adjacent gap Delta_max(k_star) := max(g_{k_star-1}, g_{k_star+1})
 * at the argmin-of-minimum-gap site k_star. Without control of Delta_max
 * the near-neighbour contribution S_{near} cannot be pinned from below, the
 * near + tail sum stays at ~1.29 < 2, and the density squeeze does not
 * deliver a finite upper bound on |tau_c|.
 *
 * Approach chosen: (a) NUMERICAL ENVELOPE
 * ----------------------------------------
 * The ticket offers three angles and asks for the cheapest with a concrete
 * number. This file picks angle (a): scan the ZETA_ZEROS table and compute,
 * for every plausible argmin candidate k (the indices attaining the K
 * smallest gaps), the ratio
 *
 *     R(k)  :=  Delta_max(k) / Delta_min(k),
 *
 * where Delta_min(k) = g_k is the nominating gap and Delta_max(k) is the
 * larger of the two immediate neighbour gaps g_{k-1}, g_{k+1}. A sliding
 * window extension reports the same ratio over a two-sided window of
 * width W on each side, so the "max gap in a Weyl-sized window around the
 * argmin" is captured rather than just the immediate neighbours.
 *
 * If R(k) stays bounded by a universal constant across the entire zero
 * list, that constant is the numerical witness the ticket asks for. The
 * max-over-k of R(k) lands at the worst-case site; the 99th and 100th
 * percentiles describe how thin the tail is. The result is a
 * NUMERICAL OBSERVATION valid on the first ~870 zeros of zeta — not a
 * theorem, but a concrete envelope value that future rigorous work
 * (Soundararajan-Bui, Ben Arous-Bourgade) must reproduce.
 *
 * Honest scope
 * ------------
 * DELIVERED:
 *   - A concrete numerical envelope R_max on the ZETA_ZEROS list.
 *   - Top-K-smallest-gap site ratios, so the worst argmin candidates are
 *     visible row-by-row.
 *   - A sliding-window max/min ratio at windows of width W in {1, 2, 4, 8}
 *     to show whether the bound is sensitive to the window radius.
 *   - A PARTIAL closure marker G3a_numerical with an honest sub-sub-gap
 *     G3a_sub_sound pointing at the rigorous Soundararajan-Bui port.
 *
 * NOT DELIVERED:
 *   - A RIGOROUS upper bound on Delta_max(k_star) for all N. The numerical
 *     envelope is a hypothesis supported by the first ~870 zeros; pointwise
 *     at the argmin site, at arbitrary N, it remains open in the sense of
 *     imp-342 openGaps.G3a_max_gap.
 *   - Any promotion of imp-337 or imp-328 to unconditional status. The
 *     density-squeeze regime-(c) bound remains CONDITIONAL on G3a.
 *
 * The numerical envelope is nevertheless the cheapest concrete number
 * that (i) tests the sharpness of the max-gap ansatz used by imp-337 and
 * (ii) gives a target constant for a rigorous Soundararajan-Bui style
 * second-moment-of-gaps proof to reproduce.
 *
 * Derivative remark (Montgomery-Dyson heuristic, angle (c))
 * ---------------------------------------------------------
 * Under Montgomery pair correlation with GUE spacing statistics, the
 * maximum adjacent gap in a window of size Theta(1 / rho_infty) is
 * conjecturally O(log N / rho_infty) uniformly. This is stronger than
 * what we need (ratio bounded by a universal constant) and is a separate
 * conditional closure path. We log it here as a secondary witness but do
 * NOT claim it — it is listed under open-work for a future rigorous port.
 */

import { ZETA_ZEROS } from '../math/zeta.js';
import { LAMBDA_INTERCEPT_DENSITY_WEYL } from './lambda-intercept-density-weyl.js';
import { DYSON_MONOTONICITY_THEOREM } from './dyson-monotonicity-proof.js';
import { FINITE_HEIGHT_RH_STATEMENT } from './lambda-rh-height-mapping.js';

// ── Gap list construction ───────────────────────────────────────────────────

function buildGapList(zeros) {
  const out = new Array(zeros.length - 1);
  for (let k = 0; k < zeros.length - 1; k++) {
    out[k] = zeros[k + 1] - zeros[k];
  }
  return out;
}

const GAPS = buildGapList(ZETA_ZEROS);
const NUM_GAPS = GAPS.length;
const NUM_ZEROS = ZETA_ZEROS.length;

// ── Immediate-neighbour max/min ratio at every interior gap index k ────────
//
// At index k (1 <= k <= NUM_GAPS-2) the argmin candidate is the gap g_k
// itself, and the immediate neighbours on each side are g_{k-1} and
// g_{k+1}. R_immediate(k) := max(g_{k-1}, g_{k+1}) / g_k.
function immediateRatio(k) {
  if (k < 1 || k > NUM_GAPS - 2) return null;
  const gk = GAPS[k];
  const gl = GAPS[k - 1];
  const gr = GAPS[k + 1];
  const dMax = gl > gr ? gl : gr;
  return dMax / gk;
}

// ── Sliding-window max/min ratio with window radius W in gap-index units ───
// R_window(k, W) = max_{|j-k|<=W} g_j / g_k, using j != k for the numerator
// so the ratio is NOT trivially 1 at W = 0.
function windowRatio(k, W) {
  if (k < 0 || k > NUM_GAPS - 1) return null;
  const gk = GAPS[k];
  let dMax = 0;
  for (let j = k - W; j <= k + W; j++) {
    if (j < 0 || j > NUM_GAPS - 1) continue;
    if (j === k) continue;
    if (GAPS[j] > dMax) dMax = GAPS[j];
  }
  if (dMax === 0) return null;
  return dMax / gk;
}

// ── Global immediate-ratio envelope ─────────────────────────────────────────

const immediateRatiosAll = [];
for (let k = 1; k <= NUM_GAPS - 2; k++) {
  const r = immediateRatio(k);
  if (r !== null && Number.isFinite(r)) immediateRatiosAll.push({ k, r });
}

const IMMEDIATE_MAX = immediateRatiosAll.reduce(
  (m, row) => (row.r > m.r ? row : m),
  { k: -1, r: 0 },
);

function percentile(arr, p) {
  if (arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor(p * (sorted.length - 1));
  return sorted[idx];
}

const immediateValues = immediateRatiosAll.map((row) => row.r);
const IMMEDIATE_P50 = percentile(immediateValues, 0.5);
const IMMEDIATE_P90 = percentile(immediateValues, 0.9);
const IMMEDIATE_P99 = percentile(immediateValues, 0.99);
const IMMEDIATE_MEAN =
  immediateValues.reduce((s, x) => s + x, 0) / Math.max(1, immediateValues.length);

// ── Top-K smallest-gap argmin candidate sites ──────────────────────────────
// These are the sites a density-squeeze argument would pick as k_star, so
// their ratios are the load-bearing rows.
const TOP_K = 20;
const sortedByGap = [...GAPS.map((g, k) => ({ k, g }))].sort((a, b) => a.g - b.g);
const TOP_SMALLEST_GAPS = sortedByGap.slice(0, TOP_K).map(({ k, g }) => {
  const rImm = immediateRatio(k);
  const rW1 = windowRatio(k, 1);
  const rW2 = windowRatio(k, 2);
  const rW4 = windowRatio(k, 4);
  const rW8 = windowRatio(k, 8);
  return {
    k,
    gap: g,
    ratio_immediate: rImm,
    ratio_window_1: rW1,
    ratio_window_2: rW2,
    ratio_window_4: rW4,
    ratio_window_8: rW8,
  };
});

// Max immediate ratio restricted to the top-K smallest-gap sites.
const TOP_K_IMMEDIATE_MAX = TOP_SMALLEST_GAPS.reduce(
  (m, row) =>
    row.ratio_immediate !== null && row.ratio_immediate > m ? row.ratio_immediate : m,
  0,
);

// ── Window-wide envelopes at fixed radius W ────────────────────────────────
function windowEnvelope(W) {
  let dMax = 0;
  let kMax = -1;
  for (let k = 0; k < NUM_GAPS; k++) {
    const r = windowRatio(k, W);
    if (r !== null && r > dMax) {
      dMax = r;
      kMax = k;
    }
  }
  return { W, kMax, ratioMax: dMax };
}

const WINDOW_ENVELOPES = [1, 2, 4, 8, 16].map(windowEnvelope);

// ── Derived: rigorous bound c_near implied by the envelope ─────────────────
//
// If Delta_max(k_star) <= R * Delta_min(k_star) = R * B with R a universal
// constant, then at the argmin site the two near contributions satisfy
//   1 / [(gamma_{k_star+1} - gamma_{k_star-1}) * (gamma_{k_star} - gamma_{k_star-1})]
//       >= 1 / [(B + Delta_max) * Delta_max]
//       >= 1 / [(R + 1) * R * B^2]
// per side, for a combined S_near lower bound of
//
//     S_near  >=  2 / [R * (R + 1) * B^2].
//
// In the c(N) / B^2 template this contributes
//
//     c_near(R)  =  2 / (R * (R + 1)).
//
// Combined with the rigorous tail from imp-342, c_tail = 2 * (pi^2/6 - 1),
// we get
//
//     c_total(R)  =  c_near(R) + c_tail  =  2 / (R*(R+1)) + 2*(pi^2/6 - 1).
//
// The critical threshold is c = 2. The envelope R we produce determines
// whether c_total(R) crosses 2. The number-crunching below reports it.
const PI2_6_MINUS_1 = (Math.PI * Math.PI) / 6 - 1; // 0.6449...
const C_TAIL = 2 * PI2_6_MINUS_1;                  // 1.289868... from imp-342

function cNearFromR(R) {
  if (!(R > 0)) return null;
  return 2 / (R * (R + 1));
}

function cTotalFromR(R) {
  const cNear = cNearFromR(R);
  if (cNear === null) return null;
  return cNear + C_TAIL;
}

// The envelope we use for the number: the MAXIMUM immediate ratio across
// the top-K smallest-gap sites (the ones that actually act as argmin in a
// density-squeeze argument). This is tighter than the global immediate
// max because most gaps are not minimum candidates.
const R_ENVELOPE_TOPK = TOP_K_IMMEDIATE_MAX;
const C_TOTAL_TOPK = cTotalFromR(R_ENVELOPE_TOPK);
const C_CRITICAL = 2;
const CROSSES_CRITICAL_TOPK = C_TOTAL_TOPK !== null && C_TOTAL_TOPK > C_CRITICAL;

// Also the global envelope version, to expose how much worse the
// unconstrained max is.
const R_ENVELOPE_GLOBAL = IMMEDIATE_MAX.r;
const C_TOTAL_GLOBAL = cTotalFromR(R_ENVELOPE_GLOBAL);
const CROSSES_CRITICAL_GLOBAL = C_TOTAL_GLOBAL !== null && C_TOTAL_GLOBAL > C_CRITICAL;

// ── Witness record ──────────────────────────────────────────────────────────

export const LAMBDA_MAX_GAP_EXTREMAL = {
  id: 'imp-355',
  closes: 'G3a_max_gap (PARTIAL, numerical envelope only)',
  consumes: [
    'imp-342 LAMBDA_INTERCEPT_DENSITY_WEYL.openGaps.G3a_max_gap',
    'imp-322 DYSON_MONOTONICITY_THEOREM boundary identity at k_star',
    'imp-327 FINITE_HEIGHT_RH_STATEMENT for height-to-N context',
    'ZETA_ZEROS table (first ~870 non-trivial zeros at ~9 decimal digits)',
  ],
  approach:
    'Approach (a): NUMERICAL ENVELOPE. Scan ZETA_ZEROS and compute the ' +
    'ratio Delta_max(k) / Delta_min(k) at every interior gap index k and ' +
    'at the top-K smallest-gap sites. Report the envelope as a concrete ' +
    'number. Cross-check with sliding-window radii W in {1,2,4,8,16}.',
  witness: {
    numZeros: NUM_ZEROS,
    numGaps: NUM_GAPS,
    topK: TOP_K,
    immediateRatio: {
      max: IMMEDIATE_MAX.r,
      max_at_k: IMMEDIATE_MAX.k,
      p50: IMMEDIATE_P50,
      p90: IMMEDIATE_P90,
      p99: IMMEDIATE_P99,
      mean: IMMEDIATE_MEAN,
    },
    topSmallestGaps: TOP_SMALLEST_GAPS,
    topKImmediateMax: TOP_K_IMMEDIATE_MAX,
    windowEnvelopes: WINDOW_ENVELOPES,
    derivedCBound: {
      formula: 'c_total(R) = 2 / (R * (R + 1)) + 2 * (pi^2/6 - 1)',
      piConstant: PI2_6_MINUS_1,
      cTailFromImp342: C_TAIL,
      cCritical: C_CRITICAL,
      topK: {
        R_envelope: R_ENVELOPE_TOPK,
        c_near: cNearFromR(R_ENVELOPE_TOPK),
        c_total: C_TOTAL_TOPK,
        crossesCritical: CROSSES_CRITICAL_TOPK,
      },
      global: {
        R_envelope: R_ENVELOPE_GLOBAL,
        c_near: cNearFromR(R_ENVELOPE_GLOBAL),
        c_total: C_TOTAL_GLOBAL,
        crossesCritical: CROSSES_CRITICAL_GLOBAL,
      },
    },
  },
  verdict: {
    rigor: 'numerical observation on first ~870 Riemann zeros',
    crossesCriticalTopK: CROSSES_CRITICAL_TOPK,
    crossesCriticalGlobal: CROSSES_CRITICAL_GLOBAL,
    summary:
      'The numerical envelope on the first ~870 Riemann zeros gives an ' +
      'immediate-neighbour max/min ratio R_top-K at the top-20 smallest-gap ' +
      'sites and R_global over all interior sites. Combined with the ' +
      'rigorous imp-342 Weyl tail c_tail = 2*(pi^2/6 - 1), the derived ' +
      'total density-squeeze constant c_total(R) is reported. The boolean ' +
      'crossesCritical* flags whether c_total exceeds the critical 2 ' +
      'threshold required by imp-337 regime (c). Even when it does, this ' +
      'is a NUMERICAL OBSERVATION and not a theorem: the bound depends on ' +
      'the 870-zero truncation, and extrapolation to arbitrary N is the ' +
      'open sub-sub-gap G3a_sub_sound.',
    conditionalUpgrade:
      'Promoting this to a theorem requires a rigorous Soundararajan-Bui ' +
      'style bound on consecutive gap ratios at min-gap sites, OR a ' +
      'Ben Arous-Bourgade extremal statistics port. Neither is shipped ' +
      'here; both are flagged under openWork.',
  },
  openWork: [
    'Close G3a_sub_sound: port Soundararajan-Bui or a Cauchy-Schwarz second ' +
      'moment bound on consecutive gaps at min-gap sites to produce a ' +
      'rigorous universal R_universal with R_universal <= R_envelope_topK ' +
      'and thus c_total(R_universal) >= c_total(R_envelope_topK).',
    'Close G3a_sub_gue: prove the Montgomery-Dyson heuristic bound ' +
      'Delta_max = O(log N / rho_infty) unconditionally at min-gap sites; ' +
      'this is stronger than a bounded ratio and would shrink the ' +
      'envelope to Theta(log N) uniformly.',
    'Load the Odlyzko table of N = 10^6 zeros (imp-359) and re-run the ' +
      'envelope scan to confirm R_envelope_topK does not drift with N.',
    'Coordinated tripwire flip for imp-337 openGaps.G3_density and ' +
      'imp-342 openGaps.G3a_max_gap belongs to a successor assembly ticket ' +
      'AFTER G3a_sub_sound is rigorously closed — partial numerical ' +
      'closure here is intentionally not wired into those tripwires.',
  ],
  consumesImp342Id: LAMBDA_INTERCEPT_DENSITY_WEYL.id,
  consumesImp322Id: DYSON_MONOTONICITY_THEOREM.id,
  consumesImp327Id: FINITE_HEIGHT_RH_STATEMENT.id,
};

// ── Build-time assertions ───────────────────────────────────────────────────

export const LAMBDA_MAX_GAP_EXTREMAL_ASSERTIONS = [
  {
    id: 'imp355-envelope-finite-and-positive',
    holds: () =>
      NUM_GAPS > 10 &&
      immediateRatiosAll.length > 0 &&
      Number.isFinite(IMMEDIATE_MAX.r) &&
      IMMEDIATE_MAX.r > 0 &&
      Number.isFinite(TOP_K_IMMEDIATE_MAX) &&
      TOP_K_IMMEDIATE_MAX > 0,
    why:
      'The envelope scan must produce a finite positive immediate-ratio ' +
      'maximum both globally and at the top-K smallest-gap sites. Zero, ' +
      'negative, or non-finite values mean the gap list is corrupted or ' +
      'the scan window is empty.',
  },
  {
    id: 'imp355-topK-envelope-is-order-unity',
    holds: () =>
      TOP_K_IMMEDIATE_MAX > 1 && TOP_K_IMMEDIATE_MAX < 10,
    why:
      'Under Montgomery pair correlation the top-K smallest-gap sites should ' +
      'have immediate-ratio O(log N) per GUE extremal statistics. On the ' +
      'first ~870 zeros log N is small, so the observed top-K envelope ' +
      'should land in (1, 10). If it drifts outside this range the gap ' +
      'table has changed materially or the top-K window is mis-sized.',
  },
  {
    id: 'imp355-c-total-formula-sane',
    holds: () => {
      if (C_TOTAL_TOPK === null) return false;
      const cNear = cNearFromR(R_ENVELOPE_TOPK);
      const cTotal = cNear + C_TAIL;
      return (
        Math.abs(cTotal - C_TOTAL_TOPK) < 1e-12 &&
        C_TAIL > 1.28 &&
        C_TAIL < 1.3 &&
        cNear >= 0 &&
        cNear <= 2
      );
    },
    why:
      'The derived c_total(R) = 2/(R*(R+1)) + 2*(pi^2/6 - 1) formula must ' +
      'be consistent with the per-component computation and c_tail must ' +
      'match the imp-342 value 2*(pi^2/6 - 1) ~= 1.2898. A drift indicates ' +
      'the Weyl tail constant was silently swapped for a different one.',
  },
  {
    id: 'imp355-verdict-is-numerical-not-theorem',
    holds: () =>
      LAMBDA_MAX_GAP_EXTREMAL.verdict.rigor.includes('numerical observation') &&
      LAMBDA_MAX_GAP_EXTREMAL.openWork.some((w) => w.includes('G3a_sub_sound')),
    why:
      'SCOPE TRIPWIRE: imp-355 ships a numerical envelope, not a theorem. ' +
      'The verdict must stay marked as a numerical observation and the ' +
      'open-work must keep listing G3a_sub_sound (the rigorous ' +
      'Soundararajan-Bui port). Silent upgrade to "theorem" without the ' +
      'rigorous closure trips this assertion.',
  },
  {
    id: 'imp355-cites-imp342-imp322-imp327',
    holds: () =>
      LAMBDA_INTERCEPT_DENSITY_WEYL.id === 'imp-342' &&
      DYSON_MONOTONICITY_THEOREM.id === 'imp-322' &&
      FINITE_HEIGHT_RH_STATEMENT.id === 'imp-327' &&
      LAMBDA_MAX_GAP_EXTREMAL.consumesImp342Id === 'imp-342' &&
      LAMBDA_MAX_GAP_EXTREMAL.consumesImp322Id === 'imp-322' &&
      LAMBDA_MAX_GAP_EXTREMAL.consumesImp327Id === 'imp-327',
    why:
      'Citation tripwire. imp-355 cites the imp-342 parent that surfaced ' +
      'G3a_max_gap, the imp-322 boundary identity the whole density squeeze ' +
      'is built on, and the imp-327 height-to-N mapping that contextualises ' +
      'the truncation. Any id drifting out from under this file strands ' +
      'the citation chain.',
  },
];
