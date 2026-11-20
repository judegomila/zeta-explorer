# A weighted N=1 modular covariance test

Status: the N=1 exact identity, Brascamp–Lieb inequality, and small-shift reduction were independently reviewed analytically; the actual-theta numerical value below is an unvalidated diagnostic, not an interval certificate. No all-degree or bridge-positivity claim is made.

Let ψ be the actual positive even complete-theta profile, v=−ψ'/ψ, and a>0. Its audited curvature estimate gives v'>17 on (0,∞). Assume the known actual old pivots s₀,s₁>0. Define
 I_±=∫₀∞h e^(±2ah)ψ²dh, P_±=∫₀∞e^(±2ah)ψ²dh, K_±=∫₀∞h e^(±2ah)ψ'²dh.
The audited exact integrated modular commutator is
 J₁=4a [I_-K_+−I_+K_-−a I_-(P_++P_-)]/(s₀s₁).   (1)

Set dν_b=h e^(2bh)ψ²dh/I_b and W_b=h^(−2)+2v'. The ν_b potential is −log h−2bh−2logψ, with second derivative W_b>34. Put
 A_b=E_b[W_b⁻¹],  B_b=E_b[4v²(v')²W_b⁻¹].
Brascamp–Lieb for the variances of h and v² and Cauchy give |Cov_b(h,v²)|≤√(A_bB_b). Differentiating the tilt gives ∂_b E_b[v²]=2Cov_b(h,v²), so (1) yields the non-circular sufficient test

 2I_+∫_{−a}^a √(A_bB_b) db < a(P_++P_-).                  (2)

If (2) holds, J₁<0. The half-line result is justified by truncation and cutoff limits: the density vanishes linearly at zero, v=O(h) there, and theta superexponential decay controls the derivative moments at infinity. No unknown next signed pivot is assumed. Passing to a=0 by continuity yields the sufficient scalar test

 2 I₀ √(A₀B₀) < P₀.                                         (3)

If (3) holds, J₁<0 for all sufficiently small positive shifts with s₀,s₁>0. The inequality has not been proved for actual theta here.

The test is nonvacuous. For ψ=e^(−c h²/2), c>0, the ν₀ law has Y=ch²~Exp(1). Jensen gives A₀≤1/(3c), and y²/(1+2y)≤y/2 gives B₀≤2c². Thus 2I₀√(A₀B₀)≤√(2/3)/√c <√π/(2√c)=P₀, so (3) holds for this Gaussian benchmark.

A fresh owned high-precision *non-rigorous* actual-theta probe theta_bl_probe.py reports 2I₀√(A₀B₀)/P₀≈0.80136. Its eight-orbit truncation, quadrature and tails have not been interval-certified. It suggests a margin but is not a proof.

## Obstruction to a naive higher-mode extension

For any a>0, the actual first physical feature is F₁(h)=e^(ah)ψ(h)(a−v(h)). Evenness gives v(0)=0, and v'>17 forces v to cross a exactly once with nonzero derivative. Hence hF₁(h)² vanishes at one interior point while being positive on both sides. Such a density is not log-concave on its convex support. Thus Brascamp–Lieb cannot simply be applied separately to each higher feature density; a valid all-degree argument would need a different matrix/mixture structure. This observation does not preclude one.
