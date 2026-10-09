import QrhLambda.Checker

/-!
# Terminal substep with the degree-11 log bound (core Lean only)

`QrhLambda.terminalU` (in `Checker.lean`) also checks the consumer's alternate-log terminal test (not to be confused with E6, the
non-terminal no-early-crossing test of `Checker.lean`)
`t_K + lag_B + q_e/2 ≤ U` with `lag_B = (z − z²/(2(1+z)))/c`. F2 passes it; Raymond's chain alone does
not (its alternate-log value is `0.118505710922702`, one unit of `10⁻¹⁵` above `U`, as recorded in
review B §6). The soundness theorem only needs the primary bound `log(1+z) ≤ log11(z)` (degree-11
alternating sum, valid for all `z ≥ 0`), so it uses `terminalU11` / `Cert.frame11`, which are
`terminalU` / `Cert.frame` without the alternate-log tests.
-/

namespace QrhLambda

/-- Terminal substep `n` with option `(k, f)` from `P/Q`, primary log bound only. -/
def terminalU11 (k : Ker) (f : Flr) (n P Q : Nat) : Option Rat :=
  if decide (f.cell = n / 128) && decide (0 < Q) && rateOK k f (mkQ P Q) &&
      decide (qE < mkQ P Q) &&
      decide (0 < zOf (rate k f (mkQ P Q)) (mkQ P Q)) && decide (zOf (rate k f (mkQ P Q)) (mkQ P Q) < 1) &&
      decide (log11 (zOf (rate k f (mkQ P Q)) (mkQ P Q)) / rate k f (mkQ P Q) ≤ mkQ 1 512000) &&
      decide (0 ≤ mkQ n 512000 + log11 (zOf (rate k f (mkQ P Q)) (mkQ P Q)) / rate k f (mkQ P Q) + qE / 2) &&
      decide (Uval (rate k f (mkQ P Q)) (mkQ P Q) n < mkQ 41 250) &&
      termCond P Q (rate k f (mkQ P Q)).num.toNat (rate k f (mkQ P Q)).den then
    some (Uval (rate k f (mkQ P Q)) (mkQ P Q) n)
  else none

namespace Cert

/-- `Cert.frame` with `terminalU11` in place of `terminalU`. -/
def frame11 (C : Cert) : Bool :=
  match C.kers[C.first.2]?, C.flrs[C.first.1]?, C.kers[C.term.2]?, C.flrs[C.term.1]?,
      C.chunks.head?, C.chunks.getLast? with
  | some k0, some f0, some kK, some fK, some c0, some cL =>
    decide (C.q0.n = 0) && decide (0 < C.q0.Q) && decide (0 ≤ C.qb) &&
    decide (C.qb < mkQ C.q0.P C.q0.Q) &&
    decide (C.qb < mkQ C.q0.P C.q0.Q - (2 + rate k0 f0 (mkQ C.q0.P C.q0.Q) * mkQ C.q0.P C.q0.Q) * qE) &&
    (stepOne k0 f0 0 C.q0.P C.q0.Q == some c0.start.P) && decide (c0.start.n = 1) &&
    decide (c0.start.Q = two96) && linked C.chunks &&
    (terminalU11 kK fK cL.stop.n cL.stop.P cL.stop.Q == some C.U)
  | _, _, _, _, _, _ => false

end Cert

end QrhLambda
