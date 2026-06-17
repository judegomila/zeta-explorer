/**
 * @module maxfanout-honest-status-2026-06-17
 *
 * Consolidated honest status from the 2026-06-17 max-fan-out (Opus 4.8):
 * two adversarial workflows (en-constants-maxfanout, direct-rh-volterra) plus
 * the api-pool. Records FOUR findings, two of them new overclaim catches, all
 * independently re-verified. Bottom line up front:
 *
 *   PLATT-TRUDGIAN Lambda <= 0.2 REMAINS THE RIGOROUS SOTA.
 *   Neither the finite-N*=1e4 route nor the Volterra route delivers a rigorous
 *   improvement right now. No false QED.
 *
 * ── FINDING 1: the finite-N*=1e4 beat is NOT a rigorous Lambda < 0.2 ─────────
 * After the linchpin resolution (bridge consumes t_c^part; Lambda <= E(N)), the
 * whole question reduced to whether E(N) = E_trunc + E_flow + E_coll has all
 * RIGOROUS constants. The 5-constant adversarial sweep found:
 *   - C_Selberg = 3.0: RIGOROUS (proven, loose) upper bound -- Trudgian 2014
 *     (0.112 log g + 0.278 log log g + 2.510 + 1.0) <= 3.0 log g at every height.
 *     Conservative OVER-estimate (honest-tight ~0.561 would LOWER E_coll ~2.3x).
 *     This constant is fine; it inflates in the SAFE direction.
 *   - C_H = 1/8 (the dominant E_coll constant): NOT a proven N-uniform upper
 *     bound. The repo's OWN imp-2640 (polymath15-lemma52-shock-holder.js l.404-
 *     456) records VERDICT NEGATIVE with a live tripwire
 *     (imp2640-CH-discharge-negative-no-false-beat): C_H = C_shock*C_Lip/4 cannot
 *     be discharged because the gap-Lipschitz C_Lip is only Gronwall-bounded and
 *     int_0^{t_c} 2/g(t)^2 dt = (1/4) log(g0^2/(g0^2 - 8 t_c)) DIVERGES
 *     logarithmically as g -> 0 at the microscopic collision scale.
 *   - C_F (E_flow): rigorous closed form 1.330578 ONLY modulo a certified bound
 *     on the argmin position alpha = gamma_{k*}/T0 (bulk regime); uncarried.
 * INTERNAL CONTRADICTION caught: imp-2633-l-cond-constant-discharge.js still
 * declares "(3) E_coll collision constant C_C -- RIGOROUSLY PINNED ... No
 * placeholder", which DIRECTLY contradicts imp-2640's NEGATIVE verdict in the
 * file it depends on. imp-2633's "rigorously pinned" is an overclaim.
 * HONEST: E(N) ~ 0.013-0.028 is a NUMERICAL ESTIMATE < 0.2 contingent on the
 * unproven C_H placeholder; it is NOT a rigorous unconditional bound.
 *
 * ── FINDING 2 (NEW OVERCLAIM): imp-1287 Wiener-Hopf bound is FALSE ───────────
 * imp-1287-volterra-wiener-hopf.js asserts ||K_a|| <= sup_t |a/(t^2+a^2)| = 1/a
 * and hence "Wiener-Hopf CLOSES Conj 27.2 for every a >= 0.1996". REFUTED and
 * independently re-verified this session: a causal Volterra convolution by
 * sinh(a t) is NOT a Toeplitz/Wiener-Hopf operator -- its Laplace transform
 * a/(z^2 - a^2) has a pole at z = a INSIDE Re(z) > 0, so the imaginary-axis
 * symbol is the wrong object. Measured ||K_a|| on L^2([0,T]) at a=0.5:
 * 3.00, 9.53, 26.97, 74.02 at T = 4,6,8,10 -- e^{aT} growth (slope 0.505 ~ a),
 * 37x over the claimed bound 2 at T=10. The submultiplicative step
 * ||V|| <= ||M_Phi||^2 ||K_a|| is VACUOUS (||K_a|| = infinity). V is bounded
 * ONLY by Phi's super-exponential decay, which the symbol does not see.
 * imp-1287's isProof / all-a-coverage flags must be retracted.
 *
 * ── FINDING 3: the all-a Conjecture 27.2 (||V||<=1 for every a>0) is FALSE ───
 * The TRUE operator norm ||V_{a,Phi}||_op crosses 1 at a ~ 37.66 and grows
 * without bound (op_norm(40) ~ 1.97, op_norm(50) ~ 52). So the literal
 * "for every a > 0" form cannot be proven -- it is false. The exact-HS
 * majorant crosses 1 at essentially the same a (~37.66, asymptotically tight),
 * so no sharpening of HS reaches a = infinity. Conj 27.2 must be RESTRICTED to
 * the physical RH band (a small, Lambda <= 0.2).
 *
 * ── FINDING 4: HS IS the sharp rigorous Volterra route, on the physical band ─
 * On a in (0, ~35] the Hilbert-Schmidt bound ||V|| <= sqrt(I_0 * J_a) is a
 * valid, closed-form rigorous bound (I_0 = int Phi^2 = 1.0472e-2). On the
 * physical band a <= 0.5 it gives ||V|| <= 2.94e-4 -- a ~3400x margin below 1,
 * one interval-arithmetic certification away from fully rigorous. BUT even a
 * perfect physical-band ||V|| <= 1 does NOT yield unconditional RH: the
 * collapse (imp-1258) remains conditional on Montgomery PCC (imp-1184), and the
 * block-positivity <=> K_a >= 0 identity (sec 27) is a paper-construct taken on
 * faith. The Volterra route is LIVE but its terminal obstruction is PCC.
 *
 * @see imp-2640 (C_H NEGATIVE verdict, the binding finding)
 * @see imp-2633-l-cond-constant-discharge (the contradicting "rigorously pinned" claim)
 * @see imp-1287-volterra-wiener-hopf (the retracted WH bound)
 * @see imp-1267-volterra-hs-bound (the sharp rigorous Volterra route)
 * @see tc-part-vs-mf-linchpin-finding (the upstream linchpin resolution)
 */

// ── Re-verified Volterra ||K_a|| growth (refutes imp-1287 ||K_a||<=1/a) ──────
export const KA_GROWTH_REFUTATION = {
  a: 0.5,
  claimedBound: 2.0, // = 1/a
  measured: [
    { T: 4, normKa: 3.0 },
    { T: 6, normKa: 9.53 },
    { T: 8, normKa: 26.97 },
    { T: 10, normKa: 74.02 },
  ],
  slope_dlnK_dT: 0.505, // ~ a = 0.5  => ||K_a|| ~ e^{aT}, unbounded
  verdict: 'imp-1287 ||K_a|| <= 1/a is FALSE; causal sinh-convolution is non-Toeplitz, ||K_a|| ~ e^{aT}',
};

export const MAXFANOUT_STATUS = {
  date: '2026-06-17',
  rigorousSOTA: 'Platt-Trudgian Lambda <= 0.2 (unchanged)',
  finiteNbeat: 'NUMERICAL ESTIMATE E(N) ~ 0.013-0.028 < 0.2, contingent on the undischargeable C_H=1/8 placeholder; NOT rigorous',
  cHblocker: 'C_H = C_shock*C_Lip/4 undischargeable via Gronwall (int 2/g^2 diverges at collision); imp-2640 NEGATIVE',
  imp2633Contradiction: 'imp-2633 still claims E_coll RIGOROUSLY PINNED, contradicting imp-2640 NEGATIVE in its own dependency',
  volterraAllA: 'Conj 27.2 (||V||<=1 for all a>0) is FALSE: ||V||_op > 1 for a > ~37.66, grows unbounded',
  volterraPhysicalBand: 'HS gives rigorous ||V|| <= 2.94e-4 (~3400x margin) on a <= 0.5, one interval-arith cert away',
  volterraTerminalObstruction: 'Montgomery PCC (imp-1184) — even physical-band ||V||<=1 does not give unconditional RH without it',
  overclaIMSCaughtThisSession: 4, // 1e13 height-mismatch, kappa_T, sup-Im-m, now imp-1287 WH
};

export const MAXFANOUT_STATUS_ASSERTIONS = [
  {
    id: 'maxfanout-ka-grows-exponentially-refutes-wh',
    description: 'Measured ||K_a|| at a=0.5 exceeds the claimed 1/a=2 bound and grows ~e^{aT} (slope ~ a)',
    holds: () => {
      const m = KA_GROWTH_REFUTATION.measured;
      return m[m.length - 1].normKa > 2.0 * 10 && Math.abs(KA_GROWTH_REFUTATION.slope_dlnK_dT - 0.5) < 0.05;
    },
  },
  {
    id: 'maxfanout-pt-remains-sota-no-rigorous-beat',
    description: 'Honest bottom line recorded: PT 0.2 remains rigorous SOTA; finite-N beat is a numerical estimate, not rigorous',
    holds: () => /Platt-Trudgian/.test(MAXFANOUT_STATUS.rigorousSOTA) && /NOT rigorous/.test(MAXFANOUT_STATUS.finiteNbeat),
  },
  {
    id: 'maxfanout-volterra-all-a-false-physical-band-live',
    description: 'Conj 27.2 all-a form recorded FALSE; physical-band HS route recorded live with PCC terminal obstruction',
    holds: () => /FALSE/.test(MAXFANOUT_STATUS.volterraAllA) && /Montgomery PCC/.test(MAXFANOUT_STATUS.volterraTerminalObstruction),
  },
];

for (const a of MAXFANOUT_STATUS_ASSERTIONS) {
  if (!a.holds()) throw new Error(`maxfanout-honest-status assertion failed: ${a.id}`);
}
