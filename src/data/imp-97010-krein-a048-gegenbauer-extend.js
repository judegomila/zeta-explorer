/**
 * @fileoverview imp-97010 -- MEASUREMENT: push the imp-96998 a=0.48 (2a=0.96) positive-tail-dropped
 * Rayleigh floor ladder past the N=76 double-precision conditioning wall using the imp-96768
 * ORTHOGONAL Gegenbauer basis (L^2 Gram = a^{4m+1} * I exactly, cond(B)=1 for all N), and diagnose
 * what actually binds once the Gram conditioning is removed.
 *
 * CONTEXT. rh-route-i-toeplitz-krein-certificate-2026-09-24 proves pole-free Weil positivity is
 * EXACTLY T_a[sigma_2] >= 0, sigma_2 = (t^2+1/4)^2 w_1, w_1 = 2theta' - sqrt2 ln2 cos(t ln2). imp-96998
 * extended the a=0.48 (2a=0.96, certified endpoint) LEGENDRE-basis Rayleigh floor ladder to
 * N in [20..76] (positive-tail-dropped, T=300, panel 1.5, 24-node GL) but its Finding 3 hit the Gram
 * cond(B)~4.035e14 wall at N=76 (~1.5 decades from the IEEE-double limit), so the geometric decrement
 * tail that would settle the N->infinity limit was UNREACHED and IMP96977_TRUE_LIMIT_UNSETTLED stayed
 * open, explicitly requesting an extended-precision / orthogonal-basis recompute. This leaf delivers
 * the orthogonal-basis recompute.
 *
 * METHOD (measurement only). The trial SUBSPACE span{ (a^2-x^2)^m poly_n(x/a) : deg=n<N }, m=3, is
 * basis-independent, so the Rayleigh floor is basis-independent -- only the eigenproblem conditioning
 * changes. Replace poly_n = P_n (Legendre) with the normalised Gegenbauer C_n^{13/2} (orthogonal in
 * the exact Gram weight (1-y^2)^{2m}), giving B = a^{4m+1} I => cond(B)=1 for every N. Everything else
 * matches imp-96998 VERBATIM: a=0.48, T=300, panel 1.5, 24-node composite Gauss-Legendre in t,
 * positive tail t>300 dropped. Driver: tmp/imp-97010-a048-gegenbauer-extend.py (/tmp/rhvenv, scipy).
 * Every literal below is a verbatim copy from that run (out: /tmp/imp-97010-out.json).
 *
 * KEY RESULTS.
 *   F1. The Gegenbauer cond(B)=1 basis REPRODUCES the imp-96998 Legendre floors to < 1.5e-6 through
 *       N=60 (max |diff| 1.43e-6 at N=60), confirming both computations agree while the Legendre Gram
 *       is still trustworthy, and removing the conditioning wall entirely (cond(B)=1 for all N).
 *   F2. The imp-96998 Legendre anchors at N=68 and N=76 were ALREADY conditioning-corrupted (biased
 *       HIGH): Legendre 11.798015 / 10.153235 vs the well-conditioned Gegenbauer 11.795596 / 9.874699
 *       (|diff| 2.42e-3 at N=68, 2.79e-1 at N=76) -- exactly where cond(B) crossed ~1e14.
 *   F3. Marched PAST N=76 in the well-conditioned basis, the FIXED-T=300 tail-dropped floor does NOT
 *       reach a positive geometric tail -- it COLLAPSES: 9.8747 (76) -> 7.9972 (84) -> 3.4667 (92) ->
 *       0.002708 (100) -> 0.000003 (108) -> marginally negative (-6e-6) by N=124. The decrement ratios
 *       spike (2.41 at the 76->84 step) then crash; no steady ratio < 1.
 *   F4. THIS COLLAPSE IS A t-TRUNCATION ARTIFACT, NOT A SPECTRAL GAP CLOSING. Re-measuring the same
 *       high-N rungs at growing T recovers the floor: the N=100 floor is 0.00271 (T=300) but
 *       17.56749 (T=800), 19.65178 (T=1600), 20.07830 (T=3200) -- converging UP toward the imp-96835
 *       Gegenbauer 2a=0.96 N=100 T=4800 value 20.132660. Identical recovery at N=92 and N=108. So once
 *       cond(B) is removed, the binding artifact past N~76 SHIFTS from Gram conditioning to the T=300
 *       t-truncation: higher-degree trial functions place spectral mass in the dropped t>300 region,
 *       driving the tail-dropped LOWER bound to ~0.
 *
 * VERDICT. The requested orthogonal-basis recompute BREAKS the imp-96998 double-precision conditioning
 * wall (cond(B)=1) and, in doing so, shows the FIXED-T=300 tail-dropped ladder is the wrong object for
 * the N->infinity limit past N~76: it does not converge to a positive geometric tail because
 * t-truncation binds first. The TRUE 2a=0.96 floor is well-conditioned and comfortably positive
 * (~20.1 in the T-converged regime, consistent with imp-96835). IMP96977_TRUE_LIMIT_UNSETTLED at
 * FIXED T therefore stays OPEN -- settling it needs a JOINT (N,T) refinement (imp-96826 tconv route),
 * not fixed-T=300 N-marching. Measurement/extrapolation only; the floor is a Rayleigh UPPER bound; no
 * operator positivity; reach stays 2a<=0.96; NO QED.
 */

export const IMP97010_A = 0.48;
export const IMP97010_TWO_A = 0.96;
export const IMP97010_BASIS = 'gegenbauer_C_13over2_condB1'; // cond(B)=1 for all N (orthogonal Gram)

// Extended N-ladder: imp-96998 rungs [20..76] + requested extension {84,92,100,108,116,124}.
export const IMP97010_N_LADDER = Object.freeze([20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124]);

// Gegenbauer cond(B)=1 floors (positive-tail-dropped, T=300 panel 1.5), one per N above. Verbatim run.
export const IMP97010_FLOORS = Object.freeze([
  20.836409, 19.936098, 18.636145, 17.200516, 15.545522, 13.664072, 11.795596, 9.874699,
  7.997177, 3.466673, 0.002708, 0.000003, -0.000005, -0.000006,
]);

// imp-96998 Legendre floors at the shared rungs [20..76], for the cross-basis agreement / bias check.
export const IMP97010_LEGENDRE_ANCHORS = Object.freeze([
  20.836409, 19.936098, 18.636145, 17.200516, 15.545522, 13.664073, 11.798015, 10.153235,
]);
// |Gegenbauer - Legendre| at the shared rungs: < 1.5e-6 through N=60, then diverges where cond(B)>~1e14.
export const IMP97010_ANCHOR_DIFFS = Object.freeze(
  IMP97010_LEGENDRE_ANCHORS.map((v, i) => Math.abs(v - IMP97010_FLOORS[i])),
);
export const IMP97010_MAX_ANCHOR_DIFF_THRU_N60 = 1.43e-6; // max |diff| over N in [20..60]

// T-scaling cross-check at the collapsed high-N rungs: floor recovers as T grows => truncation artifact.
export const IMP97010_T_SWEEP = Object.freeze([300, 800, 1600, 3200]);
export const IMP97010_T_SCAN_BY_N = Object.freeze({
  92: Object.freeze([3.46667, 18.04322, 19.78008, 20.11230]),
  100: Object.freeze([0.00271, 17.56749, 19.65178, 20.07830]),
  108: Object.freeze([0.0, 17.04837, 19.52288, 20.04914]),
});
// imp-96835 Gegenbauer 2a=0.96 floor at N=100, T=4800 -- the T-converged reference the T-sweep climbs to.
export const IMP97010_IMP96835_TCONVERGED_N100 = 20.132660;

export const IMP97010_VERDICT = Object.freeze({
  ticket: 'imp-97010',
  question: 'push the imp-96998 a=0.48 (2a=0.96) tail-dropped Rayleigh floor ladder past the N=76 double-precision cond(B)~4e14 wall (extended-precision / orthogonal-basis recompute) and reach the geometric tail settling IMP96977_TRUE_LIMIT_UNSETTLED',
  method: 'imp-96768 orthogonal Gegenbauer C_n^{13/2} basis (B = a^{4m+1} I, cond(B)=1 for all N); otherwise the imp-96998 construction verbatim (a=0.48, T=300, panel 1.5, 24-node GL, positive tail t>300 dropped); N extended to {84,92,100,108,116,124} with a T-scaling cross-check at the collapsed rungs',
  nLadder: IMP97010_N_LADDER,
  floors: IMP97010_FLOORS,
  conditioningWallRemoved: true,                 // F1: cond(B)=1 for all N (orthogonal Gram)
  reproducesImp96998ThroughN60: true,            // F1: max |diff| 1.43e-6 over N in [20..60]
  legendreAnchorsCorruptedFromN68: true,         // F2: Legendre biased HIGH at N=68 (2.4e-3), N=76 (2.8e-1)
  fixedT300FloorCollapsesPastN76: true,          // F3: 9.87 -> 8.00 -> 3.47 -> ~0 -> marginally negative
  geometricTailReachedAtFixedT: false,           // F3: no steady ratio < 1; collapse, not a settled tail
  collapseIsTruncationArtifactNotGapClosing: true, // F4: floor recovers to ~20 as T grows at fixed N
  trueFloorWellConditionedAndPositive: true,     // F4: N=100 -> 20.078 at T=3200 (~imp-96835 20.1327)
  subGapClosed: false,
  subGap: 'IMP96977_TRUE_LIMIT_UNSETTLED STAYS OPEN at FIXED T -- the orthogonal-basis recompute removes the cond(B) wall but reveals the fixed-T=300 tail-dropped ladder cannot reach a positive geometric tail past N~76 because the t-truncation binds first (the floor collapses to ~0 at T=300 yet recovers to ~20 as T grows); settling the N->infinity limit needs a JOINT (N,T) refinement (imp-96826 tconv route), not fixed-T=300 N-marching',
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97010_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97010_ASSERTIONS = [
  {
    id: 'imp97010-gegenbauer-reproduces-legendre-thru-N60',
    holds: () => IMP97010_ANCHOR_DIFFS.slice(0, 6).every((d) => d < 5e-6),
    why: 'the cond(B)=1 Gegenbauer basis reproduces the imp-96998 Legendre floors to < 1.5e-6 through N=60 (both bases span the same subspace while the Legendre Gram is still trustworthy).',
  },
  {
    id: 'imp97010-legendre-anchors-biased-high-from-N68',
    holds: () =>
      IMP97010_ANCHOR_DIFFS[6] > 1e-3 &&
      IMP97010_ANCHOR_DIFFS[7] > 1e-1 &&
      IMP97010_LEGENDRE_ANCHORS[6] > IMP97010_FLOORS[6] &&
      IMP97010_LEGENDRE_ANCHORS[7] > IMP97010_FLOORS[7],
    why: 'where cond(B) crosses ~1e14 (N=68,76) the imp-96998 Legendre floors diverge from the well-conditioned Gegenbauer floors and are biased HIGH -- the imp-96998 N=68,76 rungs were already conditioning-corrupted.',
  },
  {
    id: 'imp97010-fixed-T300-floor-collapses-not-geometric-tail',
    holds: () => {
      // floors stay monotone decreasing and collapse toward zero past N=76 (never a settled positive tail)
      const mono = IMP97010_FLOORS.every((x, i) => i === 0 || IMP97010_FLOORS[i - 1] >= x);
      const collapsed = IMP97010_FLOORS[10] < 0.01 && IMP97010_FLOORS[8] > 5; // N=100 near 0, N=84 still order-8
      return mono && collapsed && IMP97010_VERDICT.geometricTailReachedAtFixedT === false;
    },
    why: 'the fixed-T=300 tail-dropped floor is monotone decreasing and collapses from order-8 (N=84) to ~0 (N=100) rather than settling to a positive geometric tail.',
  },
  {
    id: 'imp97010-collapse-is-truncation-artifact',
    holds: () =>
      // at every collapsed rung the floor recovers to > 20 as T grows -> truncation, not a gap closing
      Object.values(IMP97010_T_SCAN_BY_N).every(
        (row) => row[0] < 4 && row[3] > 20 && row[3] > row[0] && row[1] > row[0] && row[2] > row[1],
      ) &&
      Math.abs(IMP97010_T_SCAN_BY_N[100][3] - IMP97010_IMP96835_TCONVERGED_N100) < 0.1,
    why: 'the T=300 collapse is a t-truncation artifact: at fixed N the floor climbs monotonically with T from ~0 (T=300) to ~20 (T=3200), converging to the imp-96835 T=4800 value 20.132660 -- the true 2a=0.96 floor is well-conditioned and comfortably positive.',
  },
  {
    id: 'imp97010-subgap-open-no-qed',
    holds: () =>
      IMP97010_VERDICT.conditioningWallRemoved === true &&
      IMP97010_VERDICT.subGapClosed === false &&
      IMP97010_VERDICT.geometricTailReachedAtFixedT === false &&
      IMP97010_VERDICT.operatorPositivityProved === false &&
      IMP97010_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97010_VERDICT.qed === false,
    why: 'the orthogonal-basis recompute removes the cond(B) wall but does NOT close IMP96977_TRUE_LIMIT_UNSETTLED at fixed T (t-truncation binds first); no operator positivity is added, the interval-rigorous reach stays 2a<=0.96, and NO QED.',
  },
];

for (const a of IMP97010_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97010 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
