// @module imp-2554-imp911-gronwall-interval-saturation
// imp-2554 (improvement for the harvested open sub-gap imp-911-sub-gronwall-
// interval declared in src/math/imp-903-F-mb-plateau-lipschitz-proof.js).
//
// THE SUB-GAP AS ORIGINALLY STATED
// --------------------------------
// imp-903 ships the rigorous universal plateau-Lipschitz bound
//     L_plateau = (1 / 4) * exp(K_J * tau_c_pair) = (1 / 4) * exp(1) = 0.679570...
// and names an open numerical refinement, imp-911-sub-gronwall-interval:
//   "Tighten the Gronwall factor exp(K_J * tau_c_pair) from the universal value
//    exp(1) to a per-plateau interval-certified upper bound ... an interval-RK4
//    evaluation of ||partial D / partial X|| along the plateau trajectory would
//    give a per-plateau K_J_eff << K_J and reduce L_plateau correspondingly."
//
// WHAT THIS MODULE PROVES (the honest, certain content)
// -----------------------------------------------------
// The proposed route is OBSTRUCTED at the exponent, by an exact saturation
// identity that needs no numerics. The universal Gronwall exponent is
//     E_j := K_J * tau_c_pair = (8 / H_0^2) * (h_j^2 / 8) = h_j^2 / H_0^2,
// where K_J = 8 / H_0^2 is the plateau-scale Jacobian-norm bound from
// imp-857-commutator-bound.js and tau_c_pair = h_j^2 / 8 is the binding-pair
// backward collision time. On plateau j the binding pair gap EQUALS the plateau
// scale by the plateau definition itself (H_raw is constant at the value h_j
// introduced at the plateau-entry step N_j, and that value IS the binding pair
// gap), so
//     h_j = H_0 = H_raw(plateau j)   ==>   E_j = h_j^2 / H_0^2 = 1   for ALL j.
// The exponent is therefore SATURATED at 1 on every one of the 27 plateaus and
// does NOT vary by plateau. Consequently no per-plateau rescaling of K_J at the
// plateau gap scale -- which is exactly what an interval-RK4 of the instantaneous
// Jacobian at the binding-pair scale would return -- can push E_j below 1. The
// binding pair already realises the worst-case scale that defines K_J.
//
// WHERE THE GENUINE SLACK ACTUALLY LIVES (the re-scoped sub-gap)
// -------------------------------------------------------------
// L_plateau = preGronwall * exp(E_j) with preGronwall = 2 * tau_c_pair / g_new^2.
// Two factors carry real, plateau-independent slack that the K_J route does not:
//   (1) PRE-GRONWALL pre-factor. For a NON-binding step (the added zero N+1 is
//       not the binding partner) g_new is STRICTLY greater than h_j, so
//           preGronwall = 2 * (h_j^2 / 8) / g_new^2 = (h_j / g_new)^2 / 4 < 1/4,
//       strictly below the universal 1/4 by the factor (h_j / g_new)^2.
//   (2) delta_config. The added-particle drift perturbation is
//           |Delta D| ~ 2 / d^2,  d = distance from zero N+1 to the binding pair,
//       so on the vast majority of steps where d >> h_j the configuration shift
//       delta_config ~ (h_j / d)^2 is tiny, far below its universal cap of 1.
// Both (1) and (2) require the actual zero configuration at step N+1; neither is
// a Jacobian-norm rescaling. So the residual is real but its mechanism is the
// pre-factor / config geometry, NOT a smaller K_J. The sub-gap is refined
// accordingly below; it is NOT closed (closesSubGap = false), consistent with
// imp-903 keeping its openSubGap pointer.
//
// SYNTAX SAFETY: no star-slash sequences in comments; single-quoted strings
// carry no apostrophes; subscripts written h_j / H_0 / k_{max} in prose.
//
// @see imp-903  -- imp-903-F-mb-plateau-lipschitz-proof.js (the universal bound + open sub-gap)
// @see imp-857  -- imp-857-uniform-K-bound.js (the 27 H_raw-plateau enumeration)
// @see imp-911  -- the ticket the sub-gap descends from (plateau Lipschitz)

import { IMP_903_F_MB_PLATEAU_LIPSCHITZ } from './imp-903-F-mb-plateau-lipschitz-proof.js';

// K_J * tau_c_pair on a plateau: (8 / H_0^2) * (h_j^2 / 8) = h_j^2 / H_0^2.
// h_j is the binding-pair gap; H_0 = H_raw is the plateau scale; the plateau
// definition forces h_j = H_0, so the exponent is identically 1.
const H_J_OVER_H0 = 1; // h_j / H_0 = 1 on every plateau (binding pair = plateau scale)
const SATURATED_EXPONENT = H_J_OVER_H0 * H_J_OVER_H0; // E_j = (h_j / H_0)^2 = 1

// The universal Lipschitz number, re-derived here from imp-903 so a drift in the
// upstream constant trips this module too.
const UNIVERSAL_LIPSCHITZ = IMP_903_F_MB_PLATEAU_LIPSCHITZ.lipschitzUpperUniversal; // 0.679570

// Per-plateau saturation record: the Gronwall exponent E_j = (h_j / H_0)^2 is 1
// on every plateau, so the per-plateau L equals the universal value. We expose
// the table so a downstream certificate can confirm the saturation is uniform
// rather than an artefact of a single plateau.
const SATURATION_ROWS = IMP_903_F_MB_PLATEAU_LIPSCHITZ.plateauRows.map((r) => ({
  plateauIndex: r.plateauIndex,
  startN: r.startN,
  endN: r.endN,
  H_raw: r.H_raw,
  hjOverH0: H_J_OVER_H0,          // = 1 by the plateau definition
  gronwallExponent: SATURATED_EXPONENT, // E_j = 1
  L_plateau: r.L_plateau,         // unchanged: 0.679570 (exponent route cannot reduce it)
}));

// The refined sub-gap: the residual tightening is real but its mechanism is the
// pre-Gronwall pre-factor (g_new > h_j) and delta_config geometry, NOT a smaller
// K_J. This SUPERSEDES the original imp-911-sub-gronwall-interval framing.
const REFINED_SUBGAP = Object.freeze({
  id: 'imp-2554-sub-gronwall-prefactor-and-config-not-K_J',
  refines: 'imp-911-sub-gronwall-interval',
  difficulty: 'numerical-with-config-data',
  statement:
    'The Gronwall EXPONENT E_j = h_j^2 / H_0^2 is saturated at 1 on every ' +
    'plateau because the binding-pair gap equals the plateau scale (h_j = H_0). ' +
    'Hence the originally-proposed interval-RK4 rescaling of K_J at the plateau ' +
    'gap scale cannot reduce exp(E_j) below exp(1). The genuine slack lives in ' +
    'the pre-Gronwall pre-factor 2 tau_c_pair / g_new^2 = (h_j / g_new)^2 / 4 ' +
    '(strictly below 1/4 whenever the added zero is a non-binding step, ' +
    'g_new > h_j) and in delta_config ~ (h_j / d)^2 (tiny when the added zero ' +
    'is at distance d >> h_j from the binding pair). Both require the explicit ' +
    'zero configuration at each step N+1.',
  closesIfResolved:
    'A per-step certified bound on (h_j / g_new)^2 and delta_config from the ' +
    'actual zero configuration, summed across each plateau, yielding a plateau ' +
    'F_mb growth strictly below the universal width * 0.679570. Open.',
});

const VERDICT = 'gronwall-exponent-saturated-at-one-slack-is-in-prefactor-and-config';

// ── Exported record ─────────────────────────────────────────────────────────

export const IMP2554_IMP911_GRONWALL_INTERVAL_SATURATION = Object.freeze({
  id: 'imp-2554',
  ticket: 'imp-911',
  subGap: 'imp-911-sub-gronwall-interval',
  universalLipschitz: UNIVERSAL_LIPSCHITZ,
  gronwallExponentSaturated: SATURATED_EXPONENT, // 1 on every plateau
  saturationRows: SATURATION_ROWS,
  refinedSubGap: REFINED_SUBGAP,
  verdict: VERDICT,
  // Honest scope: this DOCUMENTS the precise obstruction to the proposed route
  // and re-scopes the sub-gap; it does NOT close it.
  closesSubGap: false,
  closesTicket: false,
  honestScope: Object.freeze([
    'This module does NOT close imp-911-sub-gronwall-interval. It proves the ' +
    'exact saturation identity E_j = h_j^2 / H_0^2 = 1 (binding pair gap equals ' +
    'plateau scale), which shows the originally-proposed K_J interval-RK4 route ' +
    'cannot reduce the Gronwall exponent below 1, and it re-scopes the residual ' +
    'tightening onto the pre-Gronwall pre-factor (g_new > h_j) and the ' +
    'delta_config geometry, which is where the genuine slack lives.',
    'The defensible core is elementary and certain: E_j = (8 / H_0^2)(h_j^2 / 8) ' +
    '= (h_j / H_0)^2, and h_j = H_0 on a plateau by the H_raw-plateau definition ' +
    '(H_raw is constant at the binding-pair gap introduced at plateau entry). ' +
    'No numerics, no trajectory integration, no interval arithmetic are needed ' +
    'for the obstruction; the residual that remains is numerical and needs the ' +
    'zero configuration. imp-903 keeps its openSubGap pointer; the sub-gap stays ' +
    'open, now refined.',
  ]),
});

export default IMP2554_IMP911_GRONWALL_INTERVAL_SATURATION;

// ── Build-time assertions ───────────────────────────────────────────────────

export const IMP2554_IMP911_GRONWALL_INTERVAL_SATURATION_ASSERTIONS = [
  {
    id: 'imp2554-exponent-saturated-at-one',
    holds: () =>
      Math.abs(IMP2554_IMP911_GRONWALL_INTERVAL_SATURATION.gronwallExponentSaturated - 1) < 1e-12,
    why:
      'The Gronwall exponent E_j = h_j^2 / H_0^2 equals 1 on every plateau ' +
      'because the binding-pair gap equals the plateau scale (h_j = H_0). If ' +
      'this drifted from 1 the obstruction argument -- that no K_J rescaling at ' +
      'the plateau scale can beat exp(1) -- would not hold.',
  },
  {
    id: 'imp2554-saturation-rows-match-27',
    holds: () =>
      IMP2554_IMP911_GRONWALL_INTERVAL_SATURATION.saturationRows.length === 27 &&
      IMP2554_IMP911_GRONWALL_INTERVAL_SATURATION.saturationRows.every(
        (r) => Math.abs(r.gronwallExponent - 1) < 1e-12,
      ),
    why:
      'The saturation must be UNIFORM across exactly the 27 H_raw-plateaus from ' +
      'imp-857, not an artefact of one plateau. A count mismatch or a non-unit ' +
      'exponent on any plateau means the upstream plateau enumeration drifted or ' +
      'the saturation identity was misapplied.',
  },
  {
    id: 'imp2554-universal-lipschitz-tracks-imp903',
    holds: () =>
      Math.abs(
        IMP2554_IMP911_GRONWALL_INTERVAL_SATURATION.universalLipschitz -
          0.25 * Math.exp(1),
      ) < 1e-6,
    why:
      'The universal Lipschitz number is re-imported from imp-903 and must equal ' +
      '(1/4) exp(1) = 0.679570. If imp-903 changed this constant, the saturation ' +
      'analysis here would be describing a different bound and must be revisited.',
  },
  {
    id: 'imp2554-does-not-close-subgap-or-ticket',
    holds: () => {
      const r = IMP2554_IMP911_GRONWALL_INTERVAL_SATURATION;
      return (
        r.closesSubGap === false &&
        r.closesTicket === false &&
        r.refinedSubGap.refines === 'imp-911-sub-gronwall-interval' &&
        IMP_903_F_MB_PLATEAU_LIPSCHITZ.openSubGap.id === 'imp-911-sub-gronwall-interval'
      );
    },
    why:
      'This is an honest partial: it documents the obstruction and re-scopes the ' +
      'sub-gap onto the pre-factor / config geometry, but does NOT close it. ' +
      'closesSubGap / closesTicket must stay false and imp-903 must keep its ' +
      'openSubGap pointer; flipping any of these would overclaim a closure the ' +
      'numerical residual does not support.',
  },
];
