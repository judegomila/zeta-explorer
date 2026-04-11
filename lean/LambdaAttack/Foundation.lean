-- lean/LambdaAttack/Foundation.lean
-- imp-448: Canonical shared axioms for the ZPO / RH-attack Lean proof.
-- Resolves skp-imp441-axiom-dup: both BridgeTheorem.lean and Capstone.lean
-- previously redeclared deBruijnNewmann and dysonCollTime as independent axioms,
-- causing a duplicate-declaration elaboration error in any simultaneous Lake import.
-- Fix: canonical declarations live here; BridgeTheorem + Capstone import this module.
--
-- Exports (axioms):
--   deBruijnNewmann        : ℝ           (de Bruijn-Newman constant Lambda)
--   gammaOrdinate          : ℕ → ℝ       (N-th Riemann zero ordinate)
--   gammaOrdinate_pos      : 0 < gammaOrdinate N
--   gammaOrdinate_ge_exp2  : exp(2) ≤ gammaOrdinate N  (for N ≥ 1)
--   dysonCollTime          : ℕ → ℝ       (N-particle Dyson collision time t_c(N))
--   dysonCollTime_nonpos   : dysonCollTime N ≤ 0
--   BRIDGE_kappa_T         : ℝ           (Guth-Maynard/Ingham zero-density exponent)
--   BRIDGE_kappa_T_pos     : 0 < BRIDGE_kappa_T
--   BRIDGE_C_G             : ℝ           (Gronwall rate constant)
--   BRIDGE_C_G_pos         : 0 < BRIDGE_C_G
--
-- Module graph (Lake project):
--   Foundation  <-- BridgeTheorem  <-- CompositionCheck
--                   Constants      <-/
--   Foundation  <-- Capstone       <-- CompositionCheck
--
-- Requires: Mathlib 4.9+

import Mathlib.Analysis.SpecialFunctions.Exp.Basic
import Mathlib.Tactic

open Real

noncomputable section

/-! ## De Bruijn-Newman constant (canonical declaration) -/

/-- The de Bruijn-Newman constant Lambda in [0, 0.2].
    Rodgers-Tao 2020: 0 <= Lambda.  Platt-Trudgian 2021: Lambda <= 0.2.
    Equivalent to RH: Lambda = 0 iff all non-trivial zeros of the Riemann
    zeta function lie on the critical line Re(s) = 1/2.
    Defined as inf { t in R : all zeros of H_t lie on the real axis }.
    Canonical declaration: import this module rather than redeclaring. -/
axiom deBruijnNewmann : ℝ

/-! ## Riemann zero ordinates (canonical declaration) -/

/-- The N-th Riemann zero ordinate gamma_N > 0.
    Ordered: 0 < gamma_1 < gamma_2 < ... (verified unconditionally up to
    height T_0 = 3 x 10^12 by Platt-Trudgian 2021).
    Riemann-von Mangoldt asymptotics: gamma_N ~ 2*pi*N / log N.
    Canonical declaration: import this module rather than redeclaring. -/
axiom gammaOrdinate (N : ℕ) : ℝ
axiom gammaOrdinate_pos (N : ℕ) : (0 : ℝ) < gammaOrdinate N

/-- gamma_N >= exp(2) for all N >= 1. Ensures C_T(gamma_N) > 0. -/
axiom gammaOrdinate_ge_exp2 (N : ℕ) (hN : 1 ≤ N) : Real.exp 2 ≤ gammaOrdinate N

/-! ## N-particle Dyson collision time (canonical declaration) -/

/-- The N-particle Dyson backward collision time t_c(N) <= 0.
    First negative time at which the Calogero-Moser flow on {gamma_1,...,gamma_N}
    has a collision (min gap g_min -> 0). Equals Lambda(H_t^{(N)}).
    Key result from imp-341: limsup_{N to inf} |t_c(N)| = 0 unconditionally.
    Canonical declaration: import this module rather than redeclaring. -/
axiom dysonCollTime (N : ℕ) : ℝ
axiom dysonCollTime_nonpos (N : ℕ) : dysonCollTime N ≤ 0

/-! ## Bridge exponent and Gronwall constant (canonical declaration) -/

/-- kappa_T > 0: hybrid Guth-Maynard/Ingham decay exponent for E_trunc (imp-317).
    Equals 1 minus the binding zero-density exponent at the thin strip
    sigma = 1/2 + 1/log T0. At the Polymath15 baseline the Ingham exponent
    is approximately 0.818, giving kappa_T ~= 0.182 > 0.
    Canonical declaration: import this module rather than redeclaring. -/
axiom BRIDGE_kappa_T : ℝ
axiom BRIDGE_kappa_T_pos : (0 : ℝ) < BRIDGE_kappa_T

/-- C_G > 0: Gronwall rate constant for the Calogero-Moser drift tail bound.
    Controls the amplification factor exp(C_G * |t_c(N)|) in E_flow (imp-345).
    Canonical declaration: import this module rather than redeclaring. -/
axiom BRIDGE_C_G : ℝ
axiom BRIDGE_C_G_pos : (0 : ℝ) < BRIDGE_C_G

end
