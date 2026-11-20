# Paying the adverse theta oscillator defect at n=1

Status: independent analytic audit PASS. Finite endpoint result using existing complete-theta interval and curvature certificates; no higher-degree bound or RH claim.

For the actual even theta profile choose c=v'(0), η=(D+ch)ψ, selected p₁(x)=x, and X=X₀+E as in THETA_SIGNED_DEFECT_N1. Define

 A₀=||X₀p₁||²,  G₀=A₀−||Yp₁||²,
 R₁=2⟨X₀p₁,Ep₁⟩+||Ep₁||².

All norms are L²((0,∞),dh). The selected n=1 old parity space is empty, and the exact paired identity reads

 2S₁=G₀+R₁.                                                        (1)

The 50,000-cell MPFI certificate and its independent replay give A₀>1.4229, using its [0,2] lower bound and positivity of the omitted A₀ tail. The same certificate and full theta tail bounds give R₁>−0.065706. The archived complete-theta inequalities v'(h)>17 and ψ(0)²<16/5 imply

 ||Yp₁||²=∫₀∞ψ² dh ≤ ψ(0)²√π/(2√17)<4/5.

Consequently

 G₀>0.6229,     R₁>−0.11 G₀,
 2S₁>1.4229−0.8−0.065706>0.55.                                    (2)

Thus the explicitly adverse oscillator-defect correction is paid by the actual positive reference surplus, without assuming the next pivot or discarding the signed cross term. This is not the sharp n=1 bound, nor the first proof of its positivity; it is a certified finite example of the requested correlation.

For higher n, replacing p₁ by the actual old-inverse-selected p_n preserves (1), but bounding G₀ and R_n separately at the needed scale is open. Assuming G₀+R_n≥0 would simply assume the desired selected sign; no such all-degree inference is made here.
