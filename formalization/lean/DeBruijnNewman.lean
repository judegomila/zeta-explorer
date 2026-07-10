/-
  DeBruijnNewman — root module.

  Lean 4 formalization PILOT for the de Bruijn–Newman lower-bound chain.

  This is an HONESTLY-SCOPED SCAFFOLD, not a proof of anything new.  It fixes the
  statements (definitions + theorem signatures) of the de Bruijn–Newman story and
  proves the handful of facts that follow *formally* from the defining property of
  the constant, plus one genuine real-analysis fact (heat-kernel positivity).  The
  deep analytic inputs (de Bruijn monotonicity, Rodgers–Tao Λ ≥ 0) are left as
  explicit `sorry`s, each annotated with the mathematical ingredient it needs.
-/
import DeBruijnNewman.Basic
