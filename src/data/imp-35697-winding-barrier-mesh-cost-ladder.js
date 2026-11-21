/**
 * @module imp-35697-winding-barrier-mesh-cost-ladder
 *
 * imp-35697 (numerical, measurement): imp-35653 Part C states the FINITE B1
 * winding barrier -- interval-verify the argument-principle count on the boundary
 * of the transition rectangle R = [T_PT, T_PT + Delta] x [-h, h] -- must resolve
 * EVERY enclosed zero with a few boundary samples each (else a half-turn of
 * arg H_t is missed), at local zero density (1 / 2 pi) log(T_PT / 2 pi) ~ 4.28
 * zeros per unit height at T_PT = 3e12. Part C names the density and the scaling
 * "cost ~ O(Delta log T_PT)" but never TABULATES the concrete count. This module
 * does exactly that: total interval-arithmetic H_t = A + B - C evaluations for the
 * finite B1 piece across a transition-width ladder Delta in {1, 1e2, 1e4, 1e6} and
 * a samples-per-zero ladder k in {4, 8, 16}.
 *
 * THE MODEL. The winding certificate walks the boundary dR and caps the argument
 * increment per segment; to catch every half-turn it needs k samples per enclosed
 * zero. A window of height Delta encloses N_enc(Delta) = rho * Delta zeros, where
 * rho = (1 / 2 pi) log(T_PT / 2 pi) is the local density. The total finite-piece
 * evaluation count is therefore
 *   cost(Delta, k) = k * N_enc(Delta) = k * rho * Delta,
 * LINEAR in both Delta and k. The density rho is set by the LOG of the height, so
 * doubling T_PT barely moves it -- the finite cost grows with the transition WIDTH
 * Delta, not with the height. Over every window on the ladder the density is
 * effectively constant: even the widest rung Delta = 1e6 spans a relative density
 * variation (rho(T_PT + Delta) - rho(T_PT)) / rho ~ 1.2e-8, so N_enc = rho * Delta
 * is exact to ~1e-8 and no integration of rho over the window is needed.
 *
 * THE TABLE (baked below). Enclosed-zero counts N_enc = rho * Delta:
 *   Delta = 1    -> ~4.28 zeros
 *   Delta = 1e2  -> ~428 zeros
 *   Delta = 1e4  -> ~4.28e4 zeros
 *   Delta = 1e6  -> ~4.28e6 zeros
 * Total H_t = A + B - C interval evaluations cost = k * N_enc:
 *   k = 4  : ~17.1 / ~1.71e3 / ~1.71e5 / ~1.71e7
 *   k = 8  : ~34.2 / ~3.42e3 / ~3.42e5 / ~3.42e7
 *   k = 16 : ~68.5 / ~6.85e3 / ~6.85e5 / ~6.85e7
 * So at the largest rung (Delta = 1e6, k = 16) the finite winding certificate above
 * T_PT costs ~6.85e7 interval-arithmetic H_t = A + B - C evaluations -- large but
 * FINITE and mechanically enumerable.
 *
 * WHAT THIS SETTLES. The finite B1 piece is concretely bounded: its cost is
 * k * rho * Delta, linear in width and samples-per-zero, and cheap in the sense
 * that it grows with log T_PT (through rho) rather than with the height itself.
 * This quantifies the "cost O(Delta log T_PT)" that imp-35653 Part C only named.
 * It does NOT make S_barrier finite: the expensive obstruction stays the B2 / W3
 * ANALYTIC tail lemma |A + B| > |C| for ALL x >= T_PT + Delta (semi-infinite,
 * non-finite, breakthrough-tier), which no mesh count can discharge. Larger Delta
 * raises the finite B1 cost linearly but shrinks the tail B2 has to cover -- the
 * tabulation here only sizes the finite half of that trade-off.
 *
 * Measurement only; ports nothing; proves no winding certificate and no tail lemma;
 * derives no remainder; changes no bound; establishes no operator positivity;
 * C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and
 * C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35653 stays breakthrough-tier
 * OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35653-sbarrier-finite-check-porting-scope (Part C names the 4.28 zeros/unit density and O(Delta log T_PT) scaling but never tabulates the count)
 * @see imp-35698 (measures the complementary B2 tail-lemma margin |A+B|-|C| and the handoff Delta)
 * Literature: Titchmarsh (zero-counting N(T) ~ (T/2pi) log(T/2pi)); Polymath15
 * (2019, mollified triangle inequality / winding barrier); Platt-Trudgian 2021
 * (RH verified to T_PT = 3e12, Lambda <= 0.2).
 */

import { IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE } from './imp-35653-sbarrier-finite-check-porting-scope.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)
const TWO_PI = 2 * Math.PI;
const T_PT = 3e12; // Platt-Trudgian 2021 verified height

// Local zero density at height T_PT: (1 / 2 pi) log(T_PT / 2 pi) zeros per unit height.
const RHO = Math.log(T_PT / TWO_PI) / TWO_PI; // ~4.27996 zeros/unit

// Enclosed zeros in a transition window of height Delta (density constant over the
// window to ~1e-8, so no integration of rho is needed).
const enclosedZeros = (Delta) => RHO * Delta;
// Finite B1 cost: k samples per enclosed zero, one interval-arithmetic H_t=A+B-C
// evaluation per sample.
const meshCost = (Delta, k) => k * enclosedZeros(Delta);

const DELTA_LADDER = [1, 1e2, 1e4, 1e6];
const K_LADDER = [4, 8, 16];

// Full tabulation: one row per Delta, columns for each samples-per-zero k.
const TABLE = DELTA_LADDER.map((Delta) => ({
  Delta,
  enclosedZeros: +enclosedZeros(Delta).toPrecision(6),
  costK4: +meshCost(Delta, 4).toPrecision(6),
  costK8: +meshCost(Delta, 8).toPrecision(6),
  costK16: +meshCost(Delta, 16).toPrecision(6),
}));

// Density variation across the WIDEST window (Delta = 1e6): confirms rho is
// effectively constant so N_enc = rho * Delta is exact to ~1e-8.
const RHO_TOP = Math.log((T_PT + 1e6) / TWO_PI) / TWO_PI;
const DENSITY_REL_VARIATION = Math.abs(RHO_TOP - RHO) / RHO; // ~1.24e-8

// Largest rung: the concrete finite work at Delta = 1e6, k = 16.
const MAX_COST = meshCost(1e6, 16); // ~6.848e7

export const IMP35697_WINDING_BARRIER_MESH_COST_LADDER = {
  id: 'imp-35697',
  proofSection: 'S-frontier',
  question:
    'What is the concrete total interval-arithmetic H_t = A + B - C evaluation count for the FINITE imp-35653 ' +
    'Part C (B1) winding barrier at T_PT = 3e12, across a transition-width ladder Delta in {1, 1e2, 1e4, 1e6} and a ' +
    'samples-per-enclosed-zero ladder k in {4, 8, 16}?',
  method:
    'The winding certificate walks the boundary of R = [T_PT, T_PT + Delta] x [-h, h] and caps the argument increment ' +
    'per segment; to catch every half-turn of arg H_t it needs k boundary samples per enclosed zero. A window of ' +
    'height Delta encloses N_enc = rho * Delta zeros at local density rho = (1 / 2 pi) log(T_PT / 2 pi), so the finite ' +
    'B1 cost is k * rho * Delta interval-arithmetic H_t = A + B - C evaluations. The density is constant over each ' +
    'window to ~1e-8, so the count is exact without integrating rho.',
  measurement: {
    T_PT, // 3e12 (Platt-Trudgian verified height)
    localDensityAtTPT: +RHO.toPrecision(8), // 4.2799559 zeros/unit height
    densityRelVariationAcross1e6: +DENSITY_REL_VARIATION.toExponential(3), // ~1.24e-8 (rho constant over window)
    deltaLadder: DELTA_LADDER,
    kLadder: K_LADDER,
    table: TABLE,
    maxCostDelta1e6K16: +MAX_COST.toPrecision(8), // 68479295 (~6.848e7)
    scalingLaw: 'cost(Delta, k) = k * rho * Delta -- linear in Delta and in k; rho = (1/2pi) log(T_PT/2pi) ~ 4.28',
  },
  findings:
    'The finite B1 winding-barrier cost is k * rho * Delta, LINEAR in both the transition width Delta and the ' +
    'samples-per-zero k, with rho ~ 4.28 zeros per unit height at T_PT = 3e12. Enclosed-zero counts run ~4.28 ' +
    '(Delta = 1) to ~4.28e6 (Delta = 1e6); the total interval-arithmetic H_t = A + B - C evaluation count runs from ' +
    '~17 (Delta = 1, k = 4) to ~6.85e7 (Delta = 1e6, k = 16). The density is set by the LOG of the height, so the ' +
    'finite cost grows with the transition WIDTH, not with T_PT, and is constant over each window to ~1e-8. This ' +
    'sizes the finite half of the port: the cost is large but mechanically enumerable. It does NOT make S_barrier ' +
    'finite -- the B2 / W3 analytic tail lemma |A + B| > |C| for all x >= T_PT + Delta stays the non-finite, ' +
    'breakthrough-tier obstruction; larger Delta only trades finite B1 work for a smaller semi-infinite tail.',
  costIsLinearInDeltaAndK: true,
  costGrowsWithLogHeightNotHeight: true,
  finitePieceIsMechanicallyEnumerable: true,
  doesNotMakeSbarrierFinite: true,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). The finite imp-35653 Part C (B1) winding barrier at T_PT = 3e12 costs ' +
    'cost(Delta, k) = k * rho * Delta interval-arithmetic H_t = A + B - C evaluations, with rho = (1/2pi) ' +
    'log(T_PT/2pi) ~ 4.28 zeros/unit height, linear in both the transition width Delta and the samples-per-zero k. ' +
    'Across Delta in {1, 1e2, 1e4, 1e6} and k in {4, 8, 16} the total runs from ~17 to ~6.85e7 evaluations; the ' +
    'largest rung (Delta = 1e6, k = 16) is ~6.848e7. The density is constant over each window to ~1e-8, so the count ' +
    'is exact without integrating rho. This quantifies the "cost O(Delta log T_PT)" imp-35653 Part C only named and ' +
    'confirms the finite piece is mechanically enumerable. It ports nothing, proves no winding certificate and no ' +
    'tail lemma, and does NOT make S_barrier a finite check: the B2 / W3 analytic tail lemma |A + B| > |C| for all ' +
    'x >= T_PT + Delta remains the semi-infinite, non-finite, breakthrough-tier obstruction. Changes no bound; ' +
    'establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) ' +
    'and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35653 stays breakthrough-tier OPEN; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35653 (Part C names the 4.28 zeros/unit density and O(Delta log T_PT) scaling but never tabulates the ' +
    'evaluation count done here); imp-35698 (complementary B2 tail-lemma margin and handoff Delta); ' +
    'imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). ' +
    'Literature: Titchmarsh (N(T) ~ (T/2pi) log(T/2pi)); Polymath15 (2019, winding barrier / mollified triangle ' +
    'inequality); Platt-Trudgian 2021 (RH verified to T_PT = 3e12, Lambda <= 0.2).',
};

export const IMP35697_WINDING_BARRIER_MESH_COST_LADDER_ASSERTIONS = [
  {
    // (1) local density anchor reproduces (1/2pi) log(T_PT/2pi) ~ 4.28 and matches imp-35653.
    id: 'imp35697-density-anchor-matches-imp35653',
    description: 'the local zero density at T_PT reproduces (1/2pi) log(T_PT/2pi) ~ 4.28 zeros/unit and matches the imp-35653 baked value',
    holds: () => {
      const d653 = IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE.finiteMeshCost.localDensityAtTPT;
      return (
        Math.abs(RHO - Math.log(3e12 / (2 * Math.PI)) / (2 * Math.PI)) < 1e-12 &&
        RHO > 4.27 && RHO < 4.29 &&
        Math.abs(RHO - d653) < 1e-3 // imp-35653 baked toFixed(4)
      );
    },
  },
  {
    // (2) the tabulated cost equals k * rho * Delta on every rung.
    id: 'imp35697-cost-equals-k-rho-delta',
    description: 'every tabulated evaluation count equals k * rho * Delta (the k samples-per-enclosed-zero model)',
    holds: () =>
      TABLE.every((row) => {
        const N = RHO * row.Delta;
        return (
          Math.abs(row.enclosedZeros - +N.toPrecision(6)) < Math.abs(N) * 1e-5 + 1e-9 &&
          Math.abs(row.costK4 - +(4 * N).toPrecision(6)) < Math.abs(4 * N) * 1e-5 + 1e-9 &&
          Math.abs(row.costK8 - +(8 * N).toPrecision(6)) < Math.abs(8 * N) * 1e-5 + 1e-9 &&
          Math.abs(row.costK16 - +(16 * N).toPrecision(6)) < Math.abs(16 * N) * 1e-5 + 1e-9
        );
      }),
  },
  {
    // (3) linearity: doubling k doubles cost; scaling Delta by 100 scales cost by 100.
    id: 'imp35697-cost-linear-in-delta-and-k',
    description: 'the finite B1 cost is linear in both k (doubling k doubles cost) and Delta (100x Delta -> 100x cost)',
    holds: () => {
      const doublingK = Math.abs(meshCost(1e4, 8) / meshCost(1e4, 4) - 2) < 1e-12;
      const scaleDelta = Math.abs(meshCost(1e6, 8) / meshCost(1e4, 8) - 100) < 1e-9;
      return doublingK && scaleDelta && IMP35697_WINDING_BARRIER_MESH_COST_LADDER.costIsLinearInDeltaAndK === true;
    },
  },
  {
    // (4) density is effectively constant over the widest window, so N_enc = rho*Delta is exact.
    id: 'imp35697-density-constant-over-window',
    description: 'the local density varies by ~1e-8 across the widest window Delta = 1e6, so N_enc = rho * Delta needs no integration of rho',
    holds: () => DENSITY_REL_VARIATION < 1e-6 && DENSITY_REL_VARIATION > 0,
  },
  {
    // (5) largest rung is finite and matches the ~6.85e7 headline.
    id: 'imp35697-max-rung-finite',
    description: 'the largest rung (Delta = 1e6, k = 16) is a finite ~6.85e7 interval H_t=A+B-C evaluations',
    holds: () =>
      Number.isFinite(MAX_COST) &&
      MAX_COST > 6.8e7 && MAX_COST < 6.9e7 &&
      Math.abs(MAX_COST - 16 * RHO * 1e6) < 1,
  },
  {
    // (6) honesty gate: measurement only, does NOT make S_barrier finite, no bound moves, no refereed bound is changed, NO QED.
    id: 'imp35697-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, does not make S_barrier finite (B2 tail lemma stays the obstruction), changes no bound, imp-35653 OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35697_WINDING_BARRIER_MESH_COST_LADDER;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.doesNotMakeSbarrierFinite === true &&
        /B2 . W3 analytic tail lemma/.test(r.verdict) &&
        /imp-35653 stays breakthrough-tier OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35697_WINDING_BARRIER_MESH_COST_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35697-winding-barrier-mesh-cost-ladder assertion failed: ${a.id}`);
  }
}
