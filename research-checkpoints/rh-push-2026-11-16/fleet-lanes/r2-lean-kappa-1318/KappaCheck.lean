import OAI.NumberTheory.DirichletL.Nonvanishing
import OAI.NumberTheory.DirichletL.Energy.CertifiedExistence

namespace OAI
noncomputable section
open scoped Classical BigOperators SchwartzMap ContDiff
namespace SevenEighths.KappaThirteenEighteenths
open HeckeFamily CenteredMomentEnergyCappedWidthInduction CenteredMomentEnergyCertifiedExistence
open CenteredMomentEnergyWidthSchedule
local notation "O"=>HeckeFamily.O
variable {α:Type*}[Fintype α][DecidableEq α]
variable (M:Ideal O)[NeZero M]
local instance : Finite (O⧸M):=Ring.HasFiniteQuotients.finiteQuotient (NeZero.ne M)
variable (H:Subgroup (O⧸M)ˣ)(hH:RayOrthogonality.globalUnits M≤H)

/-- Xu-Sang stage 1 instance: plain-moment terminal certificate at κ = 29991/40000,
given the stage-0 output β ≤ 69991/80000. -/
theorem terminal_certificate_stage_one (W:ℝ→ℂ)(aslot bslot a b radial Bmask L lo hi Mcap ε:ℝ)
    (haslot:0<aslot)(hWs:Function.support W⊆Set.Icc aslot bslot)(hW:ContDiff ℝ ∞ W)
    (hbslot:0≤bslot)(ha:0<a)(haUpper:a≤1/4)(hb:1≤b)(hrad:0<radial)
    (hmask:0≤Bmask)(hMcap:0<Mcap)(hε:0<ε)
    (hbeta:(51/100:ℝ)≤HeckeZeroSupremum.beta)
    (hstage0:HeckeZeroSupremum.beta≤69991/80000):
    CertifiedBand (α:=α) M H hH W bslot a b radial Bmask L lo hi Mcap (29991/40000) ε
      (count Mcap ε):=
  terminal_certificate (α:=α) M H hH W aslot bslot a b radial Bmask L lo hi Mcap (29991/40000) ε
    haslot hWs hW hbslot ha haUpper hb hrad hmask hMcap (by norm_num) hε hbeta (by linarith)

/-- Whole admissible range: any κ with 13/18 ≤ κ and (1+κ)/2 ≥ β. -/
theorem terminal_certificate_of_half_add (W:ℝ→ℂ)(aslot bslot a b radial Bmask L lo hi Mcap κ ε:ℝ)
    (haslot:0<aslot)(hWs:Function.support W⊆Set.Icc aslot bslot)(hW:ContDiff ℝ ∞ W)
    (hbslot:0≤bslot)(ha:0<a)(haUpper:a≤1/4)(hb:1≤b)(hrad:0<radial)
    (hmask:0≤Bmask)(hMcap:0<Mcap)(hκ0:(13/18:ℝ)≤κ)(hε:0<ε)
    (hbeta:(51/100:ℝ)≤HeckeZeroSupremum.beta)
    (hκ:HeckeZeroSupremum.beta≤(1+κ)/2):
    CertifiedBand (α:=α) M H hH W bslot a b radial Bmask L lo hi Mcap κ ε (count Mcap ε):=
  terminal_certificate (α:=α) M H hH W aslot bslot a b radial Bmask L lo hi Mcap κ ε
    haslot hWs hW hbslot ha haUpper hb hrad hmask hMcap (by linarith) hε hbeta (by linarith)

/-- Same with the lower bound `2/3 ≤ κ` (the range built in this copy). -/
theorem terminal_certificate_two_thirds (W:ℝ→ℂ)(aslot bslot a b radial Bmask L lo hi Mcap κ ε:ℝ)
    (haslot:0<aslot)(hWs:Function.support W⊆Set.Icc aslot bslot)(hW:ContDiff ℝ ∞ W)
    (hbslot:0≤bslot)(ha:0<a)(haUpper:a≤1/4)(hb:1≤b)(hrad:0<radial)
    (hmask:0≤Bmask)(hMcap:0<Mcap)(hκ0:(2/3:ℝ)≤κ)(hε:0<ε)
    (hbeta:(51/100:ℝ)≤HeckeZeroSupremum.beta)
    (hκ:HeckeZeroSupremum.beta≤(1+κ)/2):
    CertifiedBand (α:=α) M H hH W bslot a b radial Bmask L lo hi Mcap κ ε (count Mcap ε):=
  terminal_certificate (α:=α) M H hH W aslot bslot a b radial Bmask L lo hi Mcap κ ε
    haslot hWs hW hbslot ha haUpper hb hrad hmask hMcap hκ0 hε hbeta (by linarith)

end SevenEighths.KappaThirteenEighteenths
end
end OAI

open OAI.SevenEighths in
#check @CenteredMomentEnergyCertifiedExistence.terminal_certificate
#print axioms OAI.SevenEighths.CenteredMomentEnergyCertifiedExistence.terminal_certificate
#print axioms OAI.SevenEighths.CenteredMomentEnergyCertifiedExistence.certified_bands
#print axioms OAI.SevenEighths.KappaThirteenEighteenths.terminal_certificate_stage_one
#print axioms OAI.SevenEighths.KappaThirteenEighteenths.terminal_certificate_of_half_add
#print axioms OAI.SevenEighths.KappaThirteenEighteenths.terminal_certificate_two_thirds
#check @OAI.SevenEighths.KappaThirteenEighteenths.terminal_certificate_stage_one
#check @OAI.SevenEighths.KappaThirteenEighteenths.terminal_certificate_of_half_add
#check @OAI.SevenEighths.CenteredMomentReflectionRetainedLength.positive_slot_width_drop
#check @OAI.SevenEighths.CenteredMomentEnergyLiveClippingDefect.robust_slot_budgets
#print axioms OAI.SevenEighths.CenteredMomentReflectionRetainedLength.positive_slot_width_drop
#print axioms OAI.SevenEighths.CenteredMomentEnergyReferenceState.balanced_reference_geometry
#print axioms OAI.SevenEighths.CenteredMomentEnergyReferenceLowBranchGeometry.slot_budgets
#print axioms OAI.SevenEighths.CenteredMomentEnergyReferenceLowBranchGeometry.reflected_low
#print axioms OAI.SevenEighths.CenteredMomentEnergyLiveClippingDefect.robust_slot_budgets
#print axioms OAI.SevenEighths.CenteredMomentEnergyLiveClippingDefect.live_profiles_reference_window
#print axioms OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re
#print axioms OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re
