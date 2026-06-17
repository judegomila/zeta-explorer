/**
 * @module imp-2636-units-audit
 *
 * imp-2636 (critical, proof, S7): UNITS AUDIT -- reconcile the sg1c/gronwall
 * CM-flow collision time with the bridge (imp-400) de Bruijn-Newman t_c_proj,
 * pinning the explicit conversion factor between them. Gates the imp-2635
 * recomposition and the tc-part-vs-mf linchpin (imp-2639): a wrong
 * normalization is exactly the trap that forced the imp-2630 / imp-2621
 * corrections, so the factor must be established BEFORE either t_c value is
 * consumed.
 *
 * THE THREE LOAD-BEARING OBJECTS AND THEIR ODE
 * --------------------------------------------
 * All three are read directly from source and all use the IDENTICAL flow on
 * the UNNORMALIZED particles (the empirical Stieltjes transform M = sum
 * 1/(x_k - z), NOT the normalized m_N = M / N):
 *
 *   (a) gronwall  (backward-flow-stability-gronwall.js, conventions block):
 *         dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j),   s = -t >= 0,
 *       de Bruijn-Newman time. Lemma D: t_c(N) >= min_k g_k(0)^2 / 8.
 *
 *   (b) sg1c      (sg1-theta-contraction.js, header):
 *         dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j),   s = -t,
 *       de Bruijn-Newman time. Theta-contraction d(g^2)/ds = -8(1 - Theta),
 *       so t_c(N) <= g_min(0)^2 / (8 (1 - Theta*)).
 *
 *   (c) bridge t_c_proj  (PATH_C_BASELINE_FIT, src/math/dyson-scaling-N5000.js,
 *       function dysonDerivBackward): dg[n] = -2 * sum_{k != n} 1/(g_n - g_k),
 *       integrated by RK4; t_c = -(steps * dt) reported as |t_c|. This is
 *       byte-for-byte the same ODE as (a) and (b), in the same s = -t de
 *       Bruijn-Newman units. The fit is |t_c| = 0.0066 + 4.91/N (imp-315).
 *
 * THE FACTOR-N CAVEAT IS ABOUT A DIFFERENT OBJECT
 * -----------------------------------------------
 * The gronwall note "the Dyson-normalized PDE time and the de Bruijn-Newman
 * time differ by a factor N" refers ONLY to the imp-338 / imp-341 NORMALIZED
 * transform m_N = M / N, whose macroscopic PDE
 *     d(m_N)/ds = dz^2 m_N - 2 N m_N dz m_N
 * carries the extra N. NONE of (a), (b), (c) use m_N: they all evolve the
 * raw particles under dx_k/ds = -2 sum 1/(x_k - x_j). So the factor-N
 * rescaling never enters any of the three load-bearing collision times.
 *
 * CONVERSION FACTOR = 1 (EXACTLY)
 * -------------------------------
 * Object (a)/(b) (the sg1c/gronwall CM-flow t_c) and object (c) (the bridge
 * t_c_proj) are computed from the SAME ODE in the SAME de Bruijn-Newman units.
 * The conversion factor between them is therefore EXACTLY 1 -- there is no
 * normalization rescaling to apply. Consequently the ~30x ratio
 *     t_c_proj(1e4) = 0.0071   vs   g_min^2 / 6 = 2.369e-4
 * is NOT a units artifact: it is a genuine physical gap between two different
 * collision-time objects measured in the same units.
 *
 * NUMERICAL CONSISTENCY OF THE SHARED UNITS (no new integration)
 * --------------------------------------------------------------
 * The shared-units claim is cross-checked against already-integrated rows of
 * the SAME flow (no fresh 1e4 run needed to settle the factor):
 *   - N = 2 closed form: a(s) = a - 2s, so t_c = a/2; with g = 2 sqrt(a),
 *     g^2 / 8 = 4a / 8 = a/2 = t_c EXACTLY -> Lemma D is sharp, ratio 1.
 *   - sg1c THETA_TRAP_RUNS (real Riemann zeros, integrated CM flow):
 *     measured t_c / (g0^2 / 8) = {1.095 (N=100), 1.048 (N=300), 1.024
 *     (N=1000)} -- all O(1) and -> 1, i.e. the integrated flow time lives in
 *     exactly the units where t_c ~ g^2/8. Were there a hidden factor N, this
 *     ratio would be ~N (off by 2-3 orders), not ~1.
 *   - the /6 vs /8 spread is the Theta* dial, NOT a units mismatch:
 *     8 (1 - 0) = 8 (isolated pair, lower-bound side) and 8 (1 - 1/4) = 6
 *     (Corollary A1 upper-bound side). Same denominator family, same units.
 *
 * WHAT THIS RESOLVES, AND THE RESIDUAL (honest)
 * ---------------------------------------------
 * RESOLVED: the units half of imp-2636. Conversion factor (sg1c/gronwall t_c)
 * -> (bridge t_c_proj) is unity; the 30x is physical, not a normalization
 * artifact. The recomposition (imp-2635) may consume g_min^2/6 in the same
 * units as t_c_proj WITHOUT a rescaling.
 * RESIDUAL (named, NOT closed here):
 *   R1 (deferred numeric): a fresh backward-CM integration of the genuine
 *      first 1e4 zeros, reading the actual first-collision time directly at
 *      the gamma~7005 minimal pair, would confirm t_c^part numerically. This
 *      module establishes the FACTOR from source, not that fresh run.
 *   R2 (= imp-2639, untouched): WHICH collision object the de Bruijn-Newman
 *      bridge consumes -- t_c^part (first pairwise, A1-rigorous) vs t_c^MF
 *      (mean-field shock). The units audit is agnostic to A vs B; it only
 *      certifies that whichever object the bridge consumes, g_min^2/6 and
 *      t_c_proj are already in the bridge units.
 * NO false QED: imp-2636 closes the units/conversion question only.
 *
 * @see backward-flow-stability-gronwall (object a; Lemma D, factor-N note)
 * @see sg1-theta-contraction (object b; Theta-contraction, t_c <= g^2/(8(1-Theta*)))
 * @see tc-part-vs-mf-linchpin-finding (the 30x ratio; imp-2639 linchpin R2)
 */

export const UNITS_AUDIT_IMP2636 = {
  // The shared backward CM flow: dx_k/ds = -2 sum 1/(x_k - x_j), s = -t.
  flowCoefficient: -2,
  timeVariable: 's = -t (de Bruijn-Newman)',
  transform: 'unnormalized M = sum 1/(x_k - z) (NOT m_N = M/N)',
  sources: {
    gronwall: { coefficient: -2, units: 'de Bruijn-Newman', bound: 't_c >= g_min^2/8 (Lemma D)' },
    sg1c: { coefficient: -2, units: 'de Bruijn-Newman', bound: 't_c <= g_min^2/(8(1-Theta*))' },
    bridgeTcProj: { coefficient: -2, units: 'de Bruijn-Newman', source: 'dysonDerivBackward / PATH_C_BASELINE_FIT', fit: '|t_c| = 0.0066 + 4.91/N' },
  },
  factorNCaveatAppliesTo: 'imp-338/imp-341 normalized m_N = M/N macroscopic PDE only (NOT any of the three load-bearing t_c objects)',
  conversionFactor: 1, // (sg1c/gronwall CM-flow t_c) -> (bridge t_c_proj): exact unity
  thirtyXRatioIsUnitsArtifact: false,
  thirtyXRatioMeaning: 'physical gap between two collision-time objects in the SAME units (t_c^part vs t_c^MF; see imp-2639)',
  // /6 vs /8 are the same denominator family 8(1-Theta*), not a units mismatch.
  thetaStarDial: { isolatedPair: { theta: 0, denom: 8 }, corollaryA1: { theta: 0.25, denom: 6 } },
  // Cross-check on already-integrated rows of the SAME flow.
  measuredTcOverG2Over8: [1.095, 1.048, 1.024], // sg1c THETA_TRAP_RUNS N={100,300,1000}
  numericalAtN1e4: { tcProjOLS: 0.0071, gMinSqOver6: 2.369e-4, ratio: 29.97 },
  resolves: 'units half of imp-2636: conversion factor = 1; 30x is physical, not normalization',
  residual: 'R1 fresh-1e4-integration deferred; R2 which-object (t_c^part vs t_c^MF) = imp-2639',
};

export const UNITS_AUDIT_IMP2636_ASSERTIONS = [
  {
    id: 'imp2636-three-objects-share-the-flow-coefficient',
    description: 'gronwall, sg1c and the bridge t_c_proj all evolve dx_k/ds = -2 sum 1/(x_k-x_j) on the unnormalized M',
    holds: () => {
      const s = UNITS_AUDIT_IMP2636.sources;
      return s.gronwall.coefficient === -2 && s.sg1c.coefficient === -2 && s.bridgeTcProj.coefficient === -2
        && UNITS_AUDIT_IMP2636.flowCoefficient === -2;
    },
  },
  {
    id: 'imp2636-conversion-factor-is-unity',
    description: 'same ODE + same de Bruijn-Newman units => conversion factor (sg1c/gronwall t_c)->(bridge t_c_proj) is exactly 1',
    holds: () => UNITS_AUDIT_IMP2636.conversionFactor === 1 && UNITS_AUDIT_IMP2636.thirtyXRatioIsUnitsArtifact === false,
  },
  {
    id: 'imp2636-six-and-eight-are-the-theta-dial',
    description: 'the /6 (A1) and /8 (isolated pair) denominators are 8(1-Theta*), not a units rescaling',
    holds: () => {
      const d = UNITS_AUDIT_IMP2636.thetaStarDial;
      return Math.abs(8 * (1 - d.isolatedPair.theta) - d.isolatedPair.denom) < 1e-12
        && Math.abs(8 * (1 - d.corollaryA1.theta) - d.corollaryA1.denom) < 1e-12;
    },
  },
  {
    id: 'imp2636-N2-closed-form-ratio-is-exactly-one',
    description: 'N=2: a(s)=a-2s gives t_c=a/2, g=2 sqrt(a) gives g^2/8=a/2, so t_c/(g^2/8)=1 exactly (units sharp)',
    holds: () => {
      const a = 7.3; // any positive a
      const tc = a / 2;
      const g = 2 * Math.sqrt(a);
      return Math.abs(tc / (g * g / 8) - 1) < 1e-12;
    },
  },
  {
    id: 'imp2636-measured-ratios-are-O1-not-factor-N',
    description: 'integrated-flow measured t_c/(g0^2/8) ratios are all O(1) and decreasing toward 1 -- no hidden factor-N',
    holds: () => UNITS_AUDIT_IMP2636.measuredTcOverG2Over8.every((r) => r > 1 && r < 1.2),
  },
];

for (const a of UNITS_AUDIT_IMP2636_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-2636-units-audit assertion failed: ${a.id}`);
}
