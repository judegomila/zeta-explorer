/**
 * @module imp-35578-req4-shortfall-literals-assertion
 * @fileoverview imp-35578 -- ASSERTION-ONLY tripwire pinning the imp-35538 REQ-4 baked
 *   shortfall literals against a silent effectiveHeightForN or budget drift.
 *
 *   imp-35538 REQ-4 bakes four route-(i) height-regime figures --
 *     LOG_T0_NEEDED   = 1 / 0.005                 = 200
 *     T0_NEEDED       = exp(200)                  ~ 7.23e86
 *     SHORTFALL_VS_CROSS = 200 / log T0(N_cross)  ~ 9.59x
 *     SHORTFALL_VS_T_PT  = 200 / log T_PT         ~ 6.96x
 *   -- but the source module carries no assertion recomputing them from their inputs, so a
 *   silent change in `effectiveHeightForN` (the RvM inverse height map) or in the 0.5%
 *   crossover budget would drift the baked heightRegime record without tripping any build.
 *
 *   This module INDEPENDENTLY recomputes all four from C_C, the 0.5% budget and
 *   effectiveHeightForN(N_cross) / T_PT, then asserts:
 *     (a) the full-precision recompute matches hard-coded 7-sig-fig reference literals within
 *         1e-6 relative -- the storage-precision tolerance per [[storage_precision_assertion_tolerance]];
 *     (b) each baked imp-35538 heightRegime field reproduces EXACTLY when the source module's
 *         own display rounding (toFixed / toExponential) is re-applied to this independent
 *         recompute -- so any drift in the source recompute also trips.
 *
 *   Import-light: imports only the lightweight `effectiveHeightForN` helper and the (also
 *   import-light) imp-35538 requirements record, never the 16.7MB zeros bundle, per
 *   [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35538-route-i-remainder-derivation-requirements.js (REQ 4, source of every baked literal)
 *   @see imp-35580-req4-height-gap-viz-data.js (viz consumer of the same heightRegime record)
 *   @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 *
 *   Ticket: imp-35578 (accuracy, medium). Verification-tooling only; recomputes the same
 *   already-established figures; adds no new Lambda bound; derives no remainder. C_C = (1/8)
 *   sqrt(3 pi) (imp-2642/imp-2643) and C_mb GUE-conditional (imp-486) UNTOUCHED.
 *   No refereed bound is changed. NO QED.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS } from './imp-35538-route-i-remainder-derivation-requirements.js';

// -- inputs, mirrored verbatim from imp-35538 (the values under audit) --
const T_PT = 3e12; // Platt-Trudgian verified height
const N_CROSS = 3.280294352e9; // E_coll = E_trunc CROSSOVER landmark N
const CROSS_ECOLL_REL_BUDGET = 0.005; // imp-35475 Part-C 0.5% relative E_coll fidelity budget

// -- INDEPENDENT recompute of the four REQ-4 figures from first inputs --
const LOG_T0_CROSS = Math.log(effectiveHeightForN(N_CROSS)); // ~20.8576
const LOG_T_PT = Math.log(T_PT); // ~28.7296
const LOG_T0_NEEDED = 1 / CROSS_ECOLL_REL_BUDGET; // 200
const T0_NEEDED = Math.exp(LOG_T0_NEEDED); // ~7.226e86
const SHORTFALL_VS_CROSS = LOG_T0_NEEDED / LOG_T0_CROSS; // ~9.5888
const SHORTFALL_VS_T_PT = LOG_T0_NEEDED / LOG_T_PT; // ~6.9615

// -- 7-sig-fig reference literals (storage-precision tolerance ~1e-6 relative) --
const REF = Object.freeze({
  logT0Needed: 200, // exact
  T0Needed: 7.2259738e86, // exp(200)
  logT0Cross: 20.8576087, // log(effectiveHeightForN(N_cross))
  logT_PT: 28.7296334, // log(3e12)
  shortfallVsCross: 9.5888269, // 200 / logT0Cross
  shortfallVsTPT: 6.9614533, // 200 / logT_PT
});

const STORAGE_REL_TOL = 1e-6; // 7-sig-fig storage tolerance
const relClose = (a, b) => Math.abs(a - b) <= STORAGE_REL_TOL * Math.abs(b);

export const IMP35578_REQ4_SHORTFALL_RECOMPUTE = Object.freeze({
  id: 'imp-35578',
  logT0Needed: LOG_T0_NEEDED,
  T0Needed: T0_NEEDED,
  logT0Cross: LOG_T0_CROSS,
  logT_PT: LOG_T_PT,
  shortfallVsCross: SHORTFALL_VS_CROSS,
  shortfallVsTPT: SHORTFALL_VS_T_PT,
});

export const IMP35578_REQ4_SHORTFALL_LITERALS_ASSERTIONS = [
  {
    // (1) full-precision recompute matches the 7-sig-fig references within 1e-6 relative --
    //     guards effectiveHeightForN / budget drift at storage precision.
    id: 'imp35578-recompute-matches-reference-at-storage-tol',
    description:
      'independently recomputing LOG_T0_NEEDED, T0_NEEDED, log-heights and both shortfalls from ' +
      'C_C-free inputs (the 0.5% budget, effectiveHeightForN(N_cross), T_PT) matches the 7-sig-fig ' +
      'reference literals within 1e-6 relative',
    holds: () =>
      LOG_T0_NEEDED === REF.logT0Needed &&
      relClose(T0_NEEDED, REF.T0Needed) &&
      relClose(LOG_T0_CROSS, REF.logT0Cross) &&
      relClose(LOG_T_PT, REF.logT_PT) &&
      relClose(SHORTFALL_VS_CROSS, REF.shortfallVsCross) &&
      relClose(SHORTFALL_VS_T_PT, REF.shortfallVsTPT),
  },
  {
    // (2) each baked imp-35538 heightRegime field reproduces EXACTLY when the source module's own
    //     display rounding is re-applied to this INDEPENDENT recompute -- catches source drift.
    id: 'imp35578-baked-heightregime-fields-reproduce-exactly',
    description:
      'each imp-35538 heightRegime literal (logT0NeededForHalfPctBudget=200, T0Needed=7.226e86, ' +
      'logT0Cross=20.8576, logT_PT=28.7296, shortfallVsCross=9.59, shortfallVsTPT=6.96) equals the ' +
      'source display-rounding re-applied to this independent recompute',
    holds: () => {
      const hr = IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.heightRegime;
      return (
        hr.logT0NeededForHalfPctBudget === LOG_T0_NEEDED &&
        hr.T0Needed === +T0_NEEDED.toExponential(3) &&
        hr.logT0Cross === +LOG_T0_CROSS.toFixed(4) &&
        hr.logT_PT === +LOG_T_PT.toFixed(4) &&
        hr.shortfallVsCross === +SHORTFALL_VS_CROSS.toFixed(2) &&
        hr.shortfallVsTPT === +SHORTFALL_VS_T_PT.toFixed(2)
      );
    },
  },
  {
    // (3) honesty gate: the source record stays non-rigorous / conditional and the shortfalls keep
    //     the needed height astronomically beyond every reachable landmark (this is tooling, not a bound).
    id: 'imp35578-out-of-reach-and-no-bound-move',
    description:
      'the needed log-height (200) exceeds both the crossover and PT anchor log-heights and both ' +
      'shortfalls stay >1, and the source record remains non-rigorous and non-unconditional -- no bound moves; NO QED',
    holds: () =>
      LOG_T0_NEEDED > LOG_T0_CROSS &&
      LOG_T0_NEEDED > LOG_T_PT &&
      SHORTFALL_VS_CROSS > 1 &&
      SHORTFALL_VS_T_PT > 1 &&
      IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.isRigorous === false &&
      IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.isUnconditional === false,
  },
];

for (const a of IMP35578_REQ4_SHORTFALL_LITERALS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35578-req4-shortfall-literals-assertion failed: ${a.id}`);
  }
}

export default Object.freeze({
  id: 'imp-35578-req4-shortfall-literals-assertion',
  ticket: 'imp-35578',
  recompute: IMP35578_REQ4_SHORTFALL_RECOMPUTE,
  reference: REF,
  storageRelTol: STORAGE_REL_TOL,
});
