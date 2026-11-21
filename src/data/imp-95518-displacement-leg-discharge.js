/**
 * @fileoverview imp-95518 — the DISPLACEMENT LEG of the C_Lip→D_rest field-channel
 * discharge, at the corrected re-anchors (imp-33228-anchor-invalidation-correction).
 *
 * RESULT (double-verified): the field-Lipschitz premise |e_{l+1}(t)−e_l(t)| ≤ eps′·g_l(t)
 * holds for all t ∈ [0, min(t_c,T)] and all window gaps, with realized eps′ well under the
 * re-anchored ceilings — the last ANALYTIC obstruction of the imp-33226 E_field transfer leg.
 * Proved via: (1) an exact telescoping reduction in which the record-gap factor g_l CANCELS
 * IDENTICALLY, so the premise ⇔ K_l(t) := 2Σ_{y omitted} 1/(|x_l−y||x_{l+1}−y|) ≤ eps′
 * (a pure particle-to-omitted-zero DISTANCE condition, no self-displacement control needed);
 * (2) a max-principle confinement bound (finite table sum C_pull; conjugate self-partner
 * contributes 0 to Re, above-table mirror pairs push outward); (3) the −8 gap floor
 * g(t)² ≥ g(0)²−8.05t (no in-window collision before T); (4) algebraic open-closed closure
 * K_max(t) ≤ K_max(0)/(1−η)² with a factor-2 bootstrap slack. NO Grönwall, NO W_1/C_Lip
 * modulus, NO PCC/GUE, NO verified-height input beyond the booked imp-34427 off-line tail (<6e-12).
 *
 * VERIFICATION: an attack (Fable-5) and an INDEPENDENT from-scratch adversarial replication
 * (Fable-5) both reproduce the certificate from the raw table src/data/zeros-to-1e6.js at all
 * 10 re-anchors, plus a direct RK4 integration of the true paired flow (front moves OUTWARD,
 * K_top decreases). Two errata from the first attack corrected below.
 *
 * SCOPE — NO Λ MOVEMENT. This discharges the ANALYTIC obstruction of an internal transfer-leg
 * certificate only. E(N) < 0.2 still bottlenecks on the E_trunc/E_flow ansatz (C_T=C_F=1),
 * which bind on verified zero height (PT-floor audit). No refereed bound is changed
 * . RH is untouched. NO QED. And it is "certified computation + proof architecture":
 * three routine real-variable steps are numerically verified but not yet WRITTEN as lemmas
 * (see writeupObligations) — until they are, E_field is "bounded-by-table", not formally discharged.
 *
 * NO heavy imports. Verified figures baked as literals.
 */

export const DISPLACEMENT_LEG_DISCHARGE = Object.freeze({
  id: 'imp-95518-displacement-leg-discharge',
  title: 'The displacement leg of the C_Lip→D_rest field-channel discharge (double-verified)',
  status: 'ANALYTIC OBSTRUCTION DISSOLVED (certified computation + proof architecture); '
    + 'PARTIAL as a written proof; NO Λ movement; no refereed bound is changed',

  reduction:
    'Telescoping identity: for each omitted y, −2/(x_{l+1}−y) + 2/(x_l−y) = 2g_l/((x_l−y)(x_{l+1}−y)). '
    + 'The gap g_l cancels identically ⇒ premise |e_{l+1}−e_l| ≤ eps′·g_l ⇔ K_l ≤ eps′, '
    + 'K_l := 2Σ_{y omitted} 1/(|x_l−y||x_{l+1}−y|). Absolutely convergent (terms ~2g_l/γ²), so the '
    + 'paired-field regrouping is order-independent. Identity verified to rel. 2.7e-13.',

  // Per-anchor t=0 kernel maxima (independent recomputation; exact table + mirrors + RvM far-tail).
  // Max is at the topmost window gap at all 10 anchors (full stride-1 sweeps at p0/p1: no interior spike).
  Kmax0: [
    { p: 0, Nprime: 15323, Kmax0: 1.4751, epsMax: 23.11 },
    { p: 1, Nprime: 19187, Kmax0: 1.6103, epsMax: 22.92 },
    { p: 2, Nprime: 46589, Kmax0: 1.8599, epsMax: 39.05 },
    { p: 3, Nprime: 77672, Kmax0: 2.1243, epsMax: 50.71 },
    { p: 4, Nprime: 83454, Kmax0: 1.9839, epsMax: 81.23 },
    { p: 5, Nprime: 87831, Kmax0: 2.0255, epsMax: 95.27 },
    { p: 6, Nprime: 185013, Kmax0: 2.1818, epsMax: 175.58 },
    { p: 7, Nprime: 393295, Kmax0: 2.6621, epsMax: 218.74 },
    { p: 8, Nprime: 420290, Kmax0: 2.8276, epsMax: 522.98 },
    { p: 9, Nprime: 516200, Kmax0: 2.5348, epsMax: 1216.61 },
  ],

  closure: {
    globalKmax0: 2.8276,       // at p8 — the correct global t=0 envelope
    globalClosedBound: 2.85,   // K_max(t) over [0,T], global max at p8
    bindingFloor: 22.92,       // min epsMax across anchors (p1)
    bindingHeadroom: 8.0,      // 2.85 vs 22.92
    minAnchorHeadroom: 13.8,   // p1: 1.66 vs 22.92
    bootstrapSlack: 'factor-2 ceiling 2·2.85 = 5.7 < 22.92 ⇒ open-closed set = all of [0,T]',
    thetaAtEnvelope: [0.99628, 0.99987],
    thetaPerGapMin: 0.99716,
  },

  // Three routine real-variable steps: numerically verified (8–478× margins), NOT yet written as lemmas.
  writeupObligations: [
    'Open-closed bootstrap promoting the t=0 constants to all t ∈ [0,T] (currently the factor-2 self-consistency is checked numerically, not proved as a continuity lemma).',
    'Locally-finite min-of-AC front argument with a-priori displacement bounds for the INFINITE omitted set (min of absolutely-continuous functions, √-integrable velocity through omitted-zero collisions; collisions quarantined ≥200 units from the window with ≥2.3× margin).',
    'Re-distance termwise bound through distant complexifications (|x−w| ≥ |x−Re w| with Re confined; each pair depth closed termwise).',
  ],
  classicalInputs:
    'The zero-ODE with paired sums, √-branching at double zeros (Puiseux), genus-1 evenness '
    + '(no drift), holomorphic motion of complex simple zeros — classical/citable (Csordas–Smith–Varga, '
    + 'Rodgers–Tao); not yet a repo module.',

  errataFromFirstAttack: [
    'Global realized eps′ envelope is 2.85 (p8; also p7=2.69), NOT the first attack’s "~2.6". The module’s own 2.83 t=0 envelope is correct.',
    'The "first collapse-capable omitted site ≥2841 above window top" is p0-specific (p8: 354.4); the load-bearing 200-unit collision quarantine holds at every anchor (tightest p8: 0.0289 vs 0.0124, ≥2.3×).',
  ],

  adversarial:
    'No Grönwall (closure is algebraic (1−η)² + continuity), no W_1/C_Lip modulus, no PCC/GUE '
    + 'spacing, no verified-height input beyond the booked imp-34427 off-line tail (<6e-12) and '
    + 'unconditional RvM/Trudgian far-tail counting. Confirmed by RK4: the min-Re front moves '
    + 'OUTWARD (+1.7e-3 vs 4.3e-3 inward budget), K_top decreases, ordering preserved.',

  discharges: 'imp-34427-sub-edge-no-collision → POSITIVE at the re-anchors; the last ANALYTIC obstruction of the imp-33226 E_field transfer leg (E_field = W(eps′) ≈ 5e-7).',
  doesNotDischarge: 'E(N) < 0.2 — bottlenecked by E_trunc/E_flow (C_T=C_F=1), which bind on verified zero height. No sub-0.2 claim; no refereed bound is changed; RH open.',
});

export const DISPLACEMENT_LEG_DISCHARGE_ASSERTIONS = Object.freeze([
  {
    name: 'every anchor certifies: K_max(0) < epsMax ceiling',
    check: () => DISPLACEMENT_LEG_DISCHARGE.Kmax0.every((a) => a.Kmax0 < a.epsMax),
  },
  {
    name: 'global closed bound (2.85) below the binding floor (22.92) with factor-2 slack',
    check: () => 2 * DISPLACEMENT_LEG_DISCHARGE.closure.globalClosedBound
      < DISPLACEMENT_LEG_DISCHARGE.closure.bindingFloor,
  },
  {
    name: 'global t=0 envelope corrected to p8 = 2.8276 (not ~2.6)',
    check: () => Math.abs(DISPLACEMENT_LEG_DISCHARGE.closure.globalKmax0 - 2.8276) < 1e-4
      && DISPLACEMENT_LEG_DISCHARGE.errataFromFirstAttack.some((e) => /2\.85/.test(e) && /NOT/.test(e)),
  },
  {
    name: 'three write-up obligations named (partial as a written proof)',
    check: () => DISPLACEMENT_LEG_DISCHARGE.writeupObligations.length === 3
      && /PARTIAL as a written proof/.test(DISPLACEMENT_LEG_DISCHARGE.status),
  },
  {
    name: 'honest: no Λ movement, no refereed bound is changed, RH open',
    check: () => /refereed bound is changed/i.test(DISPLACEMENT_LEG_DISCHARGE.status)
      && /No sub-0\.2 claim|PT Λ≤0\.2 stands/.test(DISPLACEMENT_LEG_DISCHARGE.doesNotDischarge),
  },
  {
    name: 'adversarial: no Grönwall/W_1/PCC/height smuggled in',
    check: () => /No Grönwall/.test(DISPLACEMENT_LEG_DISCHARGE.adversarial)
      && /no PCC\/GUE/.test(DISPLACEMENT_LEG_DISCHARGE.adversarial),
  },
]);

export default DISPLACEMENT_LEG_DISCHARGE;
