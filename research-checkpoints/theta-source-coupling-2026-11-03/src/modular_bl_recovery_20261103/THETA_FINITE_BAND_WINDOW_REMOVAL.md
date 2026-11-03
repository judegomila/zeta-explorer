# A selected even-window removal test from the verified theta zero band

Status: new sufficient criterion, independent review requested. It is finite-degree and conditional on the known positive full two-parity old prefix. It does not prove a uniform all-degree estimate or RH.

Use F(t)=∫ψ(u)e^(−itu)du=2ξ(1/2+it), Λ=F′²−FF″, and the positive complete-theta kernel

 R(u)=(1/16)∫v² ψ((u+v)/2)ψ((u−v)/2)dv,   Λ=4 R̂.

Fix even n≥2. If the complete signed prefix through degree n−1 is positive, the actual monic selected q_n=det(tI−J_n) has simple real nonzero zeros ±r_j. J_n is its old-prefix Jacobi matrix, computable without the next pivot. Let d=min r_j>0, R_n=||J_n|| and q₀=|q_n(0)|>0. Choose

 s≥n²/[2d² log(3/2)].

The Gaussian inverse of (−1)^(n/2)q_n(t)e^(−s t²/2) is f_s(u)=K_s(u)P_s(u), with K_s=(2πs)^(-1/2)e^(−u²/(2s)). The previously derived heat-polynomial bound gives P_s(u)≥q₀/2 for all u. Hence f_s*f_s≥(q₀²/4)K_{2s}, and because R>0,

 H_n(s):=∫Λ q_n²e^(−st²) ≥(q₀²/4)H₀(s),
 H₀(s):=∫Λe^(−st²)=4√(π/s)∫R(u)e^(−u²/(4s))du>0.             (1)

A concrete positive lower bound uses only the first positive theta orbit. Put b=4π(2π−3)e^(−πe³). For |u|≤1 and h∈[1/2,1], both h±u/2 lie in [0,3/2] and ψ(h±u/2)≥b. Thus R(u)=∫₀∞h²ψ(h−u/2)ψ(h+u/2)dh≥7b²/24, and

 H₀(s)≥(7/3)b²√(π/s)e^(−1/(4s)).                             (2)

## Verified band and tail

Platt–Trudgian (https://arxiv.org/abs/2004.09765) rigorously verified that every nontrivial zero of ζ with 0<|Im ρ|≤3×10¹² lies on the critical line. This published computational theorem is an external input; it is not recomputed here. Put H=2.9×10¹². The Hadamard product of ξ gives, away from zeros, Λ/F²=Σ Re[(t−z)⁻²], with z the corresponding zeros in the t-plane. A critical-line zero contributes a nonnegative real inverse square; an off-line pair z=γ±iδ contributes

 2[(t−γ)²−δ²]/[(t−γ)²+δ²]².

Each |δ|<1/2, and every unverified ordinate lies farther than 1/2 from |t|≤H. There are no real-axis ζ zeros of ordinate zero in the critical strip, since ξ(1/2+x)>0 for real x by its positive theta integral. Thus Λ≥0 on [−H,H], with continuity at zeros of F. This is a direct pointwise consequence of the verified height and zero-pair identity, not an inference from finite-polynomial positivity.

An independently specifiable theta tail constant avoids relying on a missing numerical envelope. Let v=π/16 and, for j=0,1,2,

 A_j=∫_R |u+iv|^j |ψ(u+iv)|du,   Kθ=A₁²+A₀A₂.

Complete theta decay on the shifted lines makes these finite. Reality/evenness handles both contour directions, so |F^(j)(t)|≤A_j e^(−v|t|) and |Λ(t)|≤Kθ e^(−2v|t|). These source constants may be replaced by independently certified finite upper bounds.

Since Λ≥0 in the band and |q_n(t)|≤(|t|+R_n)^n,

 H_n(0)≥H_n(s)−2Kθ∫_H∞(t+R_n)^(2n)e^(−2vt)dt.                 (3)

Therefore the following purely sufficient, non-circular scalar test proves the unwindowed selected pivot is positive:

 (7/12)q₀² b²√(π/s)e^(−1/(4s))
   > 2Kθ Σ_(k=0)^(2n) binom(2n,k) R_n^(2n−k)
            Γ(k+1,2vH)/(2v)^(k+1).                              (4)

The finite sum evaluates the tail integral exactly. Every q parameter comes from the old positive prefix; b and Kθ concern the known complete theta source. The test uses neither the next pivot nor a sign assumption on it. It is stronger than the desired pivot inequality, not an equivalent restatement.

The two-Gaussian selected-q₄ continuation countermodel does not satisfy this theorem's theta-specific verified positive band. Nonetheless no estimate is given here showing (4) for arbitrary n. In particular the explicit lower bound is deliberately tiny, while root radii and the tail can grow with degree. This construction supplies a falsifiable finite test, not a global continuation or an all-degree claim.
