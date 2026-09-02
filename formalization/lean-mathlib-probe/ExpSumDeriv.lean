import Mathlib
open Real

/-- Autoformalized by Aristotle (Harmonic), verified in our mathlib v4.22.0.
    Discharges the `hA : ∀ t, HasDerivAt A (A' t) t` hypothesis of
    `DiniGate.summand_antitone` for the concrete exponential-sum mollifier. -/
theorem expSum_hasDerivAt {ι : Type*} (S : Finset ι) (c u : ι → ℝ) (t : ℝ) :
    HasDerivAt (fun s => ∑ d ∈ S, c d * Real.exp (u d * s))
      (∑ d ∈ S, c d * u d * Real.exp (u d * t)) t := by
  refine HasDerivAt.fun_sum (fun d _ => ?_)
  have hlin : HasDerivAt (fun s : ℝ => u d * s) (u d) t := by
    have h0 : HasDerivAt (fun s : ℝ => s) 1 t := hasDerivAt_id t
    simpa using h0.const_mul (u d)
  have hexp : HasDerivAt (fun s : ℝ => Real.exp (u d * s))
      (Real.exp (u d * t) * u d) t := hlin.exp
  have := hexp.const_mul (c d)
  convert this using 1
  ring
