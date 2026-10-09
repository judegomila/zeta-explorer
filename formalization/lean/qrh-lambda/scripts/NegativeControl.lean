import QrhLambda.F2Chunks
import QrhLambda.R78Chunks

/-! Negative controls: perturbed certificates are rejected by the same kernel evaluation
(`decide +kernel` proves that the checks return `false`). Run: `lake env lean scripts/NegativeControl.lean`. -/

namespace QrhLambda.NegativeControl
open QrhLambda

/-- claimed value lowered by 10⁻¹⁵ -/
theorem F2_U_minus : ({ F2.cert with U := mkQ 116091488672438 1000000000000000 }).frame11 = false := by
  decide +kernel

/-- Raymond chain with the alternate-log value 0.118505710922702 claimed (≠ computed U) -/
theorem R78_U_alt : ({ R78.cert with U := mkQ 118505710922702 1000000000000000 }).frame11 = false := by
  decide +kernel

/-- Raymond chain does not pass the consumer's alternate-log test (review B §6: alt-log U = ...702) -/
theorem R78_frame_altlog : R78.cert.frame = false := by decide +kernel

/-- floor of cell 0 (first substep) raised by 10⁻¹² -/
theorem F2_floor0_up : ({ F2.cert with flrs := (F2.cert.flrs.set 0
    ⟨0, mkQ 3 5, mkQ 47 25, mkQ 6001203725731 1000000000000 + mkQ 1 1000000000000, 11⟩) }).frame11 = false := by
  decide +kernel

/-- chunk 10 (substeps 20001–22000) with floor entry 164 (cell 164, QB_m0.91, used at substep 21000)
lowered by 10⁻¹²: the replayed trajectory no longer ends at the stored boundary state -/
theorem F2_chunk10_floor_down : ({ F2.cert with flrs := (F2.cert.flrs.set 164
    ⟨164, mkQ 3 5, mkQ 3 2, mkQ 2960412077829 500000000000 - mkQ 1 1000000000000, 10⟩) }).chunkOK 10 = false := by
  decide +kernel

/-- chunk 10 with kernel row 18 made inadmissible (ρ = 1/5, so v > ρ²) -/
theorem F2_chunk10_kernel_rho : ({ F2.cert with kers := (F2.cert.kers.set 18
    ⟨mkQ 3 5, mkQ 497 250, mkQ 1 5, mkQ 25 17⟩) }).chunkOK 10 = false := by
  decide +kernel

end QrhLambda.NegativeControl
