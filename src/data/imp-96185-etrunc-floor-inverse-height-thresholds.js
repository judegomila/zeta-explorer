// @module data/imp-96185-etrunc-floor-inverse-height-thresholds
//
// imp-96185 (numerical, frontier-direction): imp-96166 measured that the
// assembled E(N) floors at the N-independent truncation term E_trunc ~ 3.06e-5
// (crossover N_x ~ 3.28e9), so the G5-step4-bridge requirement lim_N E(N) = 0
// fails by a definite positive frozen floor. Crossing it needs E_trunc -> 0,
// i.e. pushing the Platt-Trudgian verification height T_PT beyond 3e12 -- NOT a
// faster N-decay. This module INVERTS the imp-2322 E_trunc(T_PT) power law to
// answer the direct question: how far must T_PT be pushed to drop the frozen
// floor below representative thresholds (1e-5, 1e-6, 1e-8), and with what
// sensitivity exponent.
//
// THE FUNCTIONAL DEPENDENCE (imp-2322, carried by import)
// -------------------------------------------------------
// The fixed-strip truncation term is an EXACT constant-elasticity power law:
//   E_trunc(T_PT) = (2 e_I / kappa) T_PT^{-kappa},
// with e_I = e_I(sigma_opt) the Ingham 1940 zero-density exponent and
// kappa = 1 - e_I. At sigma_opt = 0.75: e_I = 0.6, kappa = 0.4, prefactor 3.0,
// and E_trunc(3e12) = 3.06e-5. The FORWARD sensitivity (imp-2322) is the
// constant elasticity d log E_trunc / d log T_PT = -kappa = -0.4.
//
// THE INVERSION (this module)
// ---------------------------
// Solving the power law for T_PT at a target floor E gives
//   T_required(E) = (prefactor / E)^{1/kappa} = (3.0 / E)^{2.5}.
// The INVERSE sensitivity exponent -- the crisp answer the ticket asks for -- is
//   d log T_PT / d log E = -1 / kappa = -2.5,
// i.e. dropping the frozen floor by one decade costs 1/kappa = 2.5 decades of
// verified strip height. Equivalently the per-decade floor-drop cost is
// 10^{1/kappa} = 10^{2.5} ~ 316x in T_PT.
//
// THE MEASURED HEIGHTS (measurement only)
// ---------------------------------------
//   floor 1e-5 -> T_PT ~ 4.93e13 (~1.22 decades / ~16x above 3e12): near-term
//                 plausible (the floor is already just above 1e-5 at 3e12).
//   floor 1e-6 -> T_PT ~ 1.56e16 (~3.72 decades / ~5200x above 3e12): far beyond
//                 any published strip verification.
//   floor 1e-8 -> T_PT ~ 1.56e21 (~8.72 decades / ~5.2e8x above 3e12):
//                 astronomically out of reach.
// The 1/kappa = 2.5 leverage makes even a two-decade floor improvement demand a
// five-decade height push, quantifying why the imp-96166 frozen floor cannot be
// driven toward zero within any foreseeable verification reach: it is NOT a
// range artifact but a structural power-law cost.
//
// SCOPE: MEASUREMENT / DERIVATION ONLY, inverting the imp-2322 audit power law.
// No zero is verified, no new T_PT is claimed, the rigorous bound stays
// E_trunc = 3.06e-5, and C_mb stays GUE-conditional per imp-486. Changes no
// bound. No positivity, no bridge closure, no RH claim, NO QED. No refereed bound is changed
// ; RH remains OPEN.
//
// SYNTAX SAFETY: line comments only; single-quoted strings; no apostrophes
// inside single-quoted strings; no star-slash in any comment.
//
// @see imp-2322-etrunc-pt-T_PT-sensitivity (forward E_trunc(T_PT) power law, elasticity -0.4)
// @see imp-96166-en-decay-exponent-vs-step4-bridge-threshold (the frozen E_trunc floor / shortfall)
// @see imp-486 (C_mb GUE-conditional); lambda-roadmap Step 4 / conditionalBookkeeping B1-B3

import { IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY } from './imp-2322-etrunc-pt-T_PT-sensitivity.js';

// Anchor constants inherited from the imp-2322 forward power law.
const PREFACTOR = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY.prefactor;         // 3.0
const KAPPA = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY.kappa;                 // 0.4
const T_PT_BASELINE = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY.T_PT_baseline; // 3e12
const E_TRUNC_BASELINE = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY.etruncPtBaseline; // ~3.06e-5

// Forward: E_trunc(T) = prefactor * T^{-kappa}.
function etruncOf(T) {
  return PREFACTOR * Math.pow(T, -KAPPA);
}

// Inverse: the verified strip height T_PT required to reach a target floor E.
function heightForFloor(E) {
  return Math.pow(PREFACTOR / E, 1 / KAPPA);
}

// The inverse sensitivity exponent d log T_PT / d log E = -1/kappa (exact, all E).
const INVERSE_SENSITIVITY_EXPONENT = -1 / KAPPA;             // -2.5
// Decades of verified height per decade of floor drop = 1/kappa.
const HEIGHT_DECADES_PER_FLOOR_DECADE = 1 / KAPPA;          // 2.5
// Multiplicative height cost per decade of floor drop = 10^{1/kappa}.
const PER_FLOOR_DECADE_HEIGHT_FACTOR = Math.pow(10, 1 / KAPPA); // ~316.23

const THRESHOLDS = Object.freeze([1e-5, 1e-6, 1e-8]);

const TABLE = THRESHOLDS.map((E) => {
  const T = heightForFloor(E);
  const decadesAboveBaseline = Math.log10(T / T_PT_BASELINE);
  const heightFactorVsBaseline = T / T_PT_BASELINE;
  const floorDecadesBelowBaseline = Math.log10(E_TRUNC_BASELINE / E);
  return {
    targetFloor: +E.toExponential(1),
    requiredT_PT: +T.toExponential(4),
    heightFactorVsBaseline: +heightFactorVsBaseline.toExponential(4),
    decadesAboveBaseline: +decadesAboveBaseline.toFixed(4),
    floorDecadesBelowBaseline: +floorDecadesBelowBaseline.toFixed(4),
    // Round-trip check: the recomputed forward floor at requiredT_PT.
    forwardFloorAtRequiredT: +etruncOf(T).toExponential(4),
    _T_full: T,
    _forward_full: etruncOf(T),
  };
});

export const IMP96185_ETRUNC_FLOOR_INVERSE_HEIGHT_THRESHOLDS = {
  id: 'imp-96185',
  proofSection: 'S-frontier',
  question:
    'Invert the imp-2322 E_trunc(T_PT) power law: how far must the Platt-Trudgian ' +
    'verification height T_PT be pushed to bring the frozen imp-96166 E(N) floor ' +
    '(= E_trunc ~ 3.06e-5 at T_PT = 3e12) below representative thresholds ' +
    '(1e-5, 1e-6, 1e-8), and what is the inverse sensitivity exponent? ' +
    'Measurement / derivation only, changes no bound, no QED.',
  functionalForm:
    'E_trunc(T_PT) = (2 e_I / kappa) T_PT^{-kappa} = prefactor * T_PT^{-kappa} ' +
    '(imp-2322): prefactor = 3.0, kappa = 0.4 at sigma_opt = 0.75, ' +
    'E_trunc(3e12) = 3.06e-5. Inverse: T_required(E) = (prefactor / E)^{1/kappa} ' +
    '= (3.0 / E)^{2.5}.',
  anchors: {
    prefactor: PREFACTOR,
    kappa: KAPPA,
    T_PT_baseline: T_PT_BASELINE,
    etruncBaseline: +E_TRUNC_BASELINE.toExponential(6),
  },
  sensitivity: {
    forwardElasticity: -KAPPA,                              // -0.4 (imp-2322)
    inverseSensitivityExponent: INVERSE_SENSITIVITY_EXPONENT, // -2.5
    heightDecadesPerFloorDecade: HEIGHT_DECADES_PER_FLOOR_DECADE, // 2.5
    perFloorDecadeHeightFactor: +PER_FLOOR_DECADE_HEIGHT_FACTOR.toFixed(3), // ~316.23
    note:
      'The inverse sensitivity exponent d log T_PT / d log E = -1/kappa = -2.5 is ' +
      'exact and floor-independent: dropping the frozen floor by one decade costs ' +
      '2.5 decades (10^{2.5} ~ 316x) of verified strip height. This 1/kappa ' +
      'leverage is why even a modest floor improvement demands an enormous height ' +
      'push, so the imp-96166 floor is a structural power-law cost, not a range ' +
      'artifact.',
  },
  table: TABLE.map(({ _T_full, _forward_full, ...pub }) => pub),
  reachability:
    'Floor 1e-5 needs T_PT ~ 4.93e13 (~1.22 decades, ~16x): near-term plausible, ' +
    'since 3.06e-5 already sits just above 1e-5. Floor 1e-6 needs ~1.56e16 ' +
    '(~3.72 decades, ~5200x): far beyond any published strip verification. Floor ' +
    '1e-8 needs ~1.56e21 (~8.72 decades, ~5.2e8x): astronomically out of reach. ' +
    'The one part of E(N) that decays (E_coll) is the sole GUE conditional ' +
    '(imp-486), so the surrogate still cannot supply an unconditional E(N) -> 0.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Inverting the imp-2322 ' +
    'power law E_trunc = 3.0 T_PT^{-0.4} gives T_required(E) = (3.0/E)^{2.5}: ' +
    'the frozen imp-96166 floor drops below 1e-5 at T_PT ~ 4.93e13, below 1e-6 ' +
    'at ~1.56e16, and below 1e-8 at ~1.56e21. The inverse sensitivity exponent ' +
    'is exactly -1/kappa = -2.5 (2.5 decades of verified height per decade of ' +
    'floor drop, ~316x per decade), floor-independent. No zero is verified, no ' +
    'new T_PT is claimed, the rigorous bound stays E_trunc = 3.06e-5, and C_mb ' +
    'stays GUE-conditional per imp-486. Changes no bound; no bridge closure, no ' +
    'RH claim, NO QED. No refereed bound is changed; RH OPEN.',
  citation:
    'imp-2322 (forward E_trunc(T_PT) power law, elasticity -0.4, load-bearing ' +
    'height 3e12); imp-96166 (frozen E_trunc floor / Step-4 shortfall); imp-486 ' +
    '(C_mb GUE-conditional); lambda-roadmap Step 4 / conditionalBookkeeping B1-B3.',
};

export const IMP96185_ETRUNC_FLOOR_INVERSE_HEIGHT_THRESHOLDS_ASSERTIONS = [
  {
    // The inherited anchors match the imp-2322 forward power law.
    id: 'imp96185-anchors-match-imp2322',
    description: 'Inherited prefactor 3.0, kappa 0.4, baseline 3e12 / 3.06e-5 (imp-2322)',
    holds: () =>
      Math.abs(PREFACTOR - 3.0) < 1e-12 &&
      Math.abs(KAPPA - 0.4) < 1e-12 &&
      T_PT_BASELINE === 3e12 &&
      Math.abs(E_TRUNC_BASELINE - 3.06e-5) < 1e-6,
  },
  {
    // The inverse sensitivity exponent is exactly -1/kappa = -2.5.
    id: 'imp96185-inverse-exponent-is-minus-2p5',
    description: 'Inverse sensitivity exponent d log T_PT/d log E = -1/kappa = -2.5',
    holds: () =>
      Math.abs(INVERSE_SENSITIVITY_EXPONENT - -2.5) < 1e-12 &&
      Math.abs(HEIGHT_DECADES_PER_FLOOR_DECADE - 2.5) < 1e-12,
  },
  {
    // Per-decade height cost is 10^{1/kappa} ~ 316.23.
    id: 'imp96185-per-floor-decade-factor',
    description: 'Height cost per decade of floor drop is 10^{2.5} ~ 316.23x',
    holds: () => Math.abs(PER_FLOOR_DECADE_HEIGHT_FACTOR - 316.2277) < 1e-3,
  },
  {
    // Every table row round-trips: the forward floor at requiredT_PT equals the target.
    id: 'imp96185-inversion-round-trips',
    description: 'Forward E_trunc at requiredT_PT reproduces each target floor',
    holds: () =>
      TABLE.every((r) => Math.abs(r._forward_full - r.targetFloor) <= 1e-9 * r.targetFloor),
  },
  {
    // The 1e-6 threshold needs T_PT ~ 1.56e16 (~3.72 decades above baseline).
    id: 'imp96185-1e-6-needs-1p56e16',
    description: 'Floor 1e-6 requires T_PT ~ 1.56e16 (~3.72 decades above 3e12)',
    holds: () => {
      const r = TABLE.find((x) => x.targetFloor === 1e-6);
      return r && Math.abs(Math.log10(r._T_full) - Math.log10(1.559e16)) < 0.01 &&
        Math.abs(r.decadesAboveBaseline - 3.716) < 0.02;
    },
  },
  {
    // The height cost grows exactly linearly in the floor decades: successive
    // thresholds differ by 2.5 decades of height per decade of floor.
    id: 'imp96185-linear-decade-leverage',
    description: 'Consecutive thresholds cost 2.5 height-decades per floor-decade (1/kappa)',
    holds: () => {
      const a = TABLE.find((x) => x.targetFloor === 1e-6);
      const b = TABLE.find((x) => x.targetFloor === 1e-8);
      const heightDecades = Math.log10(b._T_full) - Math.log10(a._T_full);
      const floorDecades = Math.log10(a.targetFloor) - Math.log10(b.targetFloor); // 2
      return Math.abs(heightDecades / floorDecades - 2.5) < 1e-6;
    },
  },
  {
    // Honesty gate: measurement only, names the E_trunc floor, no QED, no refereed bound is changed.
    id: 'imp96185-honesty-gate-no-qed',
    description: 'Measurement only: inverts E_trunc floor, no QED, no refereed bound is changed',
    holds: () =>
      IMP96185_ETRUNC_FLOOR_INVERSE_HEIGHT_THRESHOLDS.isRigorous === false &&
      /E_trunc/.test(IMP96185_ETRUNC_FLOOR_INVERSE_HEIGHT_THRESHOLDS.functionalForm) &&
      /NO QED/.test(IMP96185_ETRUNC_FLOOR_INVERSE_HEIGHT_THRESHOLDS.verdict) &&
      /refereed bound is changed/i.test(IMP96185_ETRUNC_FLOOR_INVERSE_HEIGHT_THRESHOLDS.verdict),
  },
];

for (const a of IMP96185_ETRUNC_FLOOR_INVERSE_HEIGHT_THRESHOLDS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96185-etrunc-floor-inverse-height-thresholds assertion failed: ${a.id}`,
    );
  }
}
