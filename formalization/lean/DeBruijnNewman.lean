/-
  DeBruijnNewman — root module.

  Lean 4 formalization PILOT for the de Bruijn–Newman lower-bound chain.

  This is an HONESTLY-SCOPED SCAFFOLD, not a proof of anything new.  It fixes the
  statements (definitions + theorem signatures) of the de Bruijn–Newman story and
  proves the handful of facts that follow *formally* from the defining property of
  the constant, plus one genuine real-analysis fact (heat-kernel positivity).  The
  deep analytic inputs (de Bruijn monotonicity, Rodgers–Tao Λ ≥ 0) are left as
  explicit `sorry`s, each annotated with the mathematical ingredient it needs.

  `DeBruijnNewman.RealRooted` adds a fully-proved (no-`sorry`) finite-dimensional
  Laguerre–Pólya analog — real-rooted factored polynomials over `ℤ` and their
  closure under products — which is the algebraic shadow backing the two analytic
  `sorry`s that `deBruijn_monotone` is now reduced to.
-/
import DeBruijnNewman.Basic
import DeBruijnNewman.RealRooted
