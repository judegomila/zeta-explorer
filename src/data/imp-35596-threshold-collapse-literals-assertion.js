/**
 * @module imp-35596-threshold-collapse-literals-assertion
 * @fileoverview imp-35596 -- ASSERTION-ONLY tripwire pinning the imp-35571 route-(i)
 *   subleading-rate THRESHOLD-COLLAPSE arithmetic against a silent budget or height-map drift.
 *
 *   imp-35571 tabulates how a proved SUBLEADING GUE local-law rate would collapse the
 *   imp-35538 REQ-4 log T0 >= 200 height threshold (the leading O(1/log T0) rate needs
 *   1/log T0 <= B = 0.005, i.e. log T0 >= 1/B = 200). It bakes, but never pins with a
 *   recompute assertion, the six candidate thresholds and the crossover-height rate:
 *     BASELINE (leading)  log T0 >= 1/B = 200
 *     poly-log O(1/(log T0)^a):  a = 1.5 -> 34.20,  a = 2 -> 14.14,  a = 3 -> 5.85
 *         (each recomputed as (1/B)^(1/a) = 200^(1/a))
 *     power-law O(T0^{-delta}):  delta = 0.25 -> 21.19,  delta = 0.5 -> 10.60,  delta = 1 -> 5.30
 *         (each recomputed as ln(1/B)/delta = 5.2983/delta)
 *     delta ~ 0.254  lands the power-law threshold exactly at the crossover log-height ~20.86
 *   plus the landmark / anchor log-heights that frame the collapse:
 *     LOG_T0_PEAK  ~ 13.23   (interior flat-cap sigma peak, effectiveHeightForN(N_PEAK))
 *     LOG_T0_CROSS ~ 20.86   (E_coll = E_trunc crossover, effectiveHeightForN(N_CROSS))
 *     LOG_T_PT     ~ 28.73   (Platt-Trudgian verified height, log 3e12)
 *   The source module carries only loose range assertions (a=2 in (14,15), etc.), so a silent
 *   change in the 0.5% crossover budget B or in effectiveHeightForN (the RvM inverse height map)
 *   could drift the baked thresholdCollapse record at storage precision without tripping the build.
 *
 *   This module INDEPENDENTLY recomputes all of the above from B = 0.005 and the same inlined
 *   effectiveHeightForN (verbatim from lambda-rh-height-mapping.js, no heavy import), then asserts:
 *     (a) the full-precision recompute matches hard-coded 7-sig-fig reference literals within
 *         1e-6 relative -- the storage-precision tolerance per [[storage_precision_assertion_tolerance]];
 *     (b) each baked imp-35571 CANDIDATES field (logT0Needed, reductionVsLeading, below-flags)
 *         reproduces EXACTLY when the source display rounding (toFixed) is re-applied to this
 *         independent recompute -- so any drift in the source recompute also trips;
 *     (c) the qualitative direction: every subleading candidate lowers the threshold below 200,
 *         the a=2 headline lands just above the peak and below the crossover / PT anchor, and the
 *         delta that hits the crossover height is ~0.254.
 *
 *   Import-light: inlines the pure-Math effectiveHeightForN and imports only the (import-light)
 *   imp-35571 record for the exact-reproduction cross-check; never the 16.7MB zeros bundle, per
 *   [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]].
 *
 *   @see imp-35571-route-i-subleading-rate-scope.js (source of every baked threshold literal)
 *   @see imp-35538-route-i-remainder-derivation-requirements (REQ-4 log T0 >= 200 threshold)
 *   @see imp-35578-req4-shortfall-literals-assertion.js (sibling pinning the REQ-4 shortfall figures)
 *   @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse, inlined here)
 *
 *   Ticket: imp-35596 (accuracy, medium). Verification-tooling only; recomputes the same
 *   already-established scoping figures; adds no new Lambda bound; discharges nothing; e^200 STANDS
 *   on the natural leading rate; imp-35337a stays OPEN; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643)
 *   and C_mb GUE-conditional (imp-486) UNTOUCHED. No refereed bound is changed. NO QED.
 */

import { IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE } from './imp-35571-route-i-subleading-rate-scope.js';

// The RvM inverse N -> T0 height map, inlined verbatim from lambda-rh-height-mapping.js.
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  const twoPi = 2 * Math.PI;
  let T = Math.max(twoPi * Math.E, (twoPi * N) / Math.max(1, Math.log(N + twoPi)));
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / twoPi);
    const f = (T / twoPi) * (u - 1) - N;
    const fp = u / twoPi;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > twoPi)) T = twoPi * 1.0001;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return T;
}

// -- INDEPENDENT recompute from the 0.5% crossover budget and the landmark N values --
const B = 0.005; // the imp-35475 Part-C 0.5% relative crossover budget (CROSS_ECOLL_REL_BUDGET)
const LOG_T0_NEEDED_LEADING = 1 / B; // 200 -- the natural leading O(1/log T0) rate baseline
const LN_INV_BUDGET = Math.log(1 / B); // ln(200) ~ 5.29832

const N_PEAK = 9.2186e5; // interior flat-cap sigma peak (imp-35337 / imp-35475)
const N_CROSS = 3.280294352e9; // E_coll = E_trunc crossover
const T_PT = 3e12; // Platt-Trudgian verified height

const LOG_T0_PEAK = Math.log(effectiveHeightForN(N_PEAK)); // ~13.2309
const LOG_T0_CROSS = Math.log(effectiveHeightForN(N_CROSS)); // ~20.8576
const LOG_T_PT = Math.log(T_PT); // ~28.7296

// poly-log rate O(1/(log T0)^a) needs log T0 >= (1/B)^(1/a) = 200^(1/a).
const logT0NeededPolylog = (a) => Math.pow(1 / B, 1 / a);
// power-law rate O(T0^{-delta}) needs log T0 >= ln(1/B)/delta.
const logT0NeededPower = (delta) => LN_INV_BUDGET / delta;

const PL_1_5 = logT0NeededPolylog(1.5); // ~34.1995
const PL_2 = logT0NeededPolylog(2); // ~14.1421 (headline)
const PL_3 = logT0NeededPolylog(3); // ~5.84804
const PW_025 = logT0NeededPower(0.25); // ~21.1933
const PW_05 = logT0NeededPower(0.5); // ~10.5966
const PW_1 = logT0NeededPower(1); // ~5.29832

// The power-law rate whose threshold lands exactly at the crossover log-height.
const DELTA_AT_CROSS = LN_INV_BUDGET / LOG_T0_CROSS; // ~0.254

// -- 7-sig-fig reference literals (storage-precision tolerance ~1e-6 relative) --
const REF = Object.freeze({
  leading: 200, // 1/B
  lnInvBudget: 5.298317367, // ln(1/B)
  polylog_1_5: 34.19951893, // 200^(1/1.5)
  polylog_2: 14.14213562, // 200^(1/2)
  polylog_3: 5.848035476, // 200^(1/3)
  power_025: 21.19326947, // ln(200)/0.25
  power_05: 10.59663473, // ln(200)/0.5
  power_1: 5.298317367, // ln(200)/1
  deltaAtCross: 0.2540232412, // ln(200) / logT0Cross
  logT0Peak: 13.23089179, // effectiveHeightForN(N_PEAK) log-height
  logT0Cross: 20.85760870, // effectiveHeightForN(N_CROSS) log-height
  logT_PT: 28.72963340, // log 3e12
});

const STORAGE_REL_TOL = 1e-6; // 7-sig-fig storage tolerance
const relClose = (a, b) => Math.abs(a - b) <= STORAGE_REL_TOL * Math.abs(b);

export const IMP35596_THRESHOLD_COLLAPSE_RECOMPUTE = Object.freeze({
  id: 'imp-35596',
  leading: LOG_T0_NEEDED_LEADING,
  lnInvBudget: LN_INV_BUDGET,
  polylog: { a1p5: PL_1_5, a2: PL_2, a3: PL_3 },
  power: { d0p25: PW_025, d0p5: PW_05, d1: PW_1 },
  deltaAtCross: DELTA_AT_CROSS,
  logT0Peak: LOG_T0_PEAK,
  logT0Cross: LOG_T0_CROSS,
  logT_PT: LOG_T_PT,
});

export const IMP35596_THRESHOLD_COLLAPSE_LITERALS_ASSERTIONS = [
  {
    // (1) full-precision recompute matches the 7-sig-fig references within 1e-6 relative --
    //     guards the 0.5% budget B and effectiveHeightForN drift at storage precision.
    id: 'imp35596-recompute-matches-reference-at-storage-tol',
    description:
      'independently recomputing the leading baseline 200, the six subleading thresholds ' +
      '(poly-log a=1.5/2/3 -> 34.20/14.14/5.85, power-law delta=0.25/0.5/1 -> 21.19/10.60/5.30), ' +
      'the crossover-height delta ~0.254 and the three landmark log-heights (peak 13.23, crossover ' +
      '20.86, PT 28.73) matches the 7-sig-fig reference literals within 1e-6 relative',
    holds: () =>
      LOG_T0_NEEDED_LEADING === REF.leading &&
      relClose(LN_INV_BUDGET, REF.lnInvBudget) &&
      relClose(PL_1_5, REF.polylog_1_5) &&
      relClose(PL_2, REF.polylog_2) &&
      relClose(PL_3, REF.polylog_3) &&
      relClose(PW_025, REF.power_025) &&
      relClose(PW_05, REF.power_05) &&
      relClose(PW_1, REF.power_1) &&
      relClose(DELTA_AT_CROSS, REF.deltaAtCross) &&
      relClose(LOG_T0_PEAK, REF.logT0Peak) &&
      relClose(LOG_T0_CROSS, REF.logT0Cross) &&
      relClose(LOG_T_PT, REF.logT_PT),
  },
  {
    // (2) each baked imp-35571 CANDIDATES field reproduces EXACTLY when the source display
    //     rounding (toFixed) is re-applied to this INDEPENDENT recompute -- catches source drift.
    id: 'imp35596-baked-imp35571-candidates-reproduce-exactly',
    description:
      'each imp-35571 CANDIDATES field (logT0Needed via toFixed(4), reductionVsLeading via ' +
      'toFixed(2), belowCrossoverHeight, belowPTAnchor) and the framing log-heights ' +
      '(logT0NeededLeading, logT0Peak, logT0Cross, logT_PT) equals the source display rounding ' +
      're-applied to this independent recompute',
    holds: () => {
      const tc = IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.thresholdCollapse;
      const find = (param, value) => tc.candidates.find((c) => c.param === param && c.value === value);
      const check = (param, value, recomputed) => {
        const c = find(param, value);
        return (
          c.logT0Needed === +recomputed.toFixed(4) &&
          c.reductionVsLeading === +(LOG_T0_NEEDED_LEADING / recomputed).toFixed(2) &&
          c.belowCrossoverHeight === recomputed < LOG_T0_CROSS &&
          c.belowPTAnchor === recomputed < LOG_T_PT
        );
      };
      return (
        check('a', 1.5, PL_1_5) &&
        check('a', 2, PL_2) &&
        check('a', 3, PL_3) &&
        check('delta', 0.25, PW_025) &&
        check('delta', 0.5, PW_05) &&
        check('delta', 1, PW_1) &&
        tc.logT0NeededLeading === LOG_T0_NEEDED_LEADING &&
        tc.logT0Peak === +LOG_T0_PEAK.toFixed(4) &&
        tc.logT0Cross === +LOG_T0_CROSS.toFixed(4) &&
        tc.logT_PT === +LOG_T_PT.toFixed(4) &&
        tc.crossEcollRelBudget === B
      );
    },
  },
  {
    // (3) qualitative direction: every subleading candidate collapses the 200 threshold, the a=2
    //     headline lands just above the peak and below the crossover / PT anchor, and the crossover-
    //     height power-law rate is ~0.254 -- the imp-35571 finding, pinned.
    id: 'imp35596-every-subleading-collapses-a2-into-landmark-regime',
    description:
      'every subleading candidate lowers the threshold below the leading baseline 200, the a=2 ' +
      'poly-log headline ~14.14 lands just above the peak log-height ~13.23 and below the crossover ' +
      '~20.86 and PT anchor ~28.73, and the delta hitting the crossover height is ~0.254',
    holds: () =>
      [PL_1_5, PL_2, PL_3, PW_025, PW_05, PW_1].every((t) => t < LOG_T0_NEEDED_LEADING) &&
      PL_2 > LOG_T0_PEAK &&
      PL_2 < LOG_T0_CROSS &&
      PL_2 < LOG_T_PT &&
      DELTA_AT_CROSS > 0.25 &&
      DELTA_AT_CROSS < 0.26 &&
      relClose(logT0NeededPower(DELTA_AT_CROSS), LOG_T0_CROSS),
  },
  {
    // (4) honesty gate: scoping only, e^200 stands on the leading rate, imp-486 conditional, NO QED.
    id: 'imp35596-honesty-gate-no-qed',
    description:
      'Scoping only: source isRigorous/isUnconditional false, no subleading rate proved for zeta, ' +
      'imp-486 conditional, NO QED, no refereed bound is changed',
    holds: () =>
      IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.isRigorous === false &&
      IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.isUnconditional === false &&
      IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.provedStatus.anySubleadingRateProvedForZeta === false &&
      /imp-486/.test(IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.citation) &&
      /NO QED/.test(IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.verdict),
  },
];

for (const a of IMP35596_THRESHOLD_COLLAPSE_LITERALS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35596-threshold-collapse-literals-assertion failed: ${a.id}`);
  }
}

export default Object.freeze({
  id: 'imp-35596-threshold-collapse-literals-assertion',
  ticket: 'imp-35596',
  recompute: IMP35596_THRESHOLD_COLLAPSE_RECOMPUTE,
  reference: REF,
  storageRelTol: STORAGE_REL_TOL,
});
