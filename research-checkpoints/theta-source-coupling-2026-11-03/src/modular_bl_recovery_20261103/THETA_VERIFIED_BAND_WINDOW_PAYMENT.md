# A theta-specific verified-band payment for a selected Gaussian window

Status: independently derived from the cited external zero verification and exact theta/heat identities; independent cross-check of the band argument and constants PASS. This is a per-degree sufficient test, not an all-degree theorem.

Use Λ(t)=F'(t)²−F(t)F''(t)=4 R̂(t), with F the complete theta Fourier transform and R>0 its modular conditional-variance kernel. Assume the published Platt–Trudgian verification of the Riemann hypothesis through zero height 3×10¹², and the standard genus-one Hadamard product of ξ. Pairing real zeros and possible off-line conjugate zeros gives Λ(t)≥0 throughout |t|≤H:=2.9×10¹²: every verified real zero contributes a nonnegative reciprocal square, and every unverified conjugate pair is at least 10¹¹ away in ordinate while its imaginary offset is below 1/2, so its paired contribution is nonnegative. Continuity covers real zeros. This band deduction uses the published external theorem, not an inference from finite-polynomial positivity.

Fix even n≥2 with the full signed two-parity prefix through n−1 positive. Let q_n be the actual monic selected polynomial, with old-Jacobi roots ±r_j, d=min r_j>0, R_n=max r_j, q₀=|q_n(0)|>0. Set

 s≥n²/[2d² log(3/2)].                                               (1)

The inverse Gaussian polynomial estimate in SELECTED_EVEN_GAUSSIAN_WINDOW then gives f_s(u)≥(q₀/2)G_s(u), where f_s is the nonnegative inverse transform of ±q_n(t)e^(−st²/2) and G_s is the positive normalized Gaussian. Consequently

 H_n(s):=∫_R Λ(t)q_n(t)²e^(−st²)dt ≥(q₀²/4)H₀(s),
 H₀(s):=∫_R Λ(t)e^(−st²)dt>0.                                       (2)

Define the explicit lower source constant

 b=4π(2π−3)e^(−πe³)>0.

For |u|≤1, the theta first orbit and the interval h∈[1/2,1] give ψ(h±u/2)≥b and hence R(u)≥7b²/24. Gaussian Fourier integration yields

 H₀(s)≥(7/3)b²√(π/s)e^(−1/(4s)).                                   (3)

For a convergent source-only tail envelope choose v=π/16 and

 A_j=∫_R |u+iv|^j |ψ(u+iv)|du  (j=0,1,2),   Kθ=A₁²+A₀A₂.

The complete-theta analytic strip and its modular evenness give |F^(j)(t)|≤A_j e^(−v|t|), so

 |Λ(t)|≤Kθ e^(−2v|t|).                                              (4)

By the band sign, subtracting the window can lose only the unverified tail. Since |q_n(t)|≤(|t|+R_n)^n, (2)–(4) give the explicit sufficient condition

 (7/12)q₀²b²√(π/s)e^(−1/(4s))
 > 2Kθ Σ_(k=0)^(2n) binom(2n,k) R_n^(2n−k) Γ(k+1,2vH)/(2v)^(k+1). (5)

If (5) holds, the *unwindowed* actual selected pivot ∫Λ q_n² is positive. Every quantity in the test is determined by the complete theta source and the actual positive old prefix; no next pivot or target sign is assumed. The tail bound deliberately loses signed cancellation and may be very crude. In particular neither (5) nor any bound on its left/right ratio is proved for all n; small d, large R_n and factorial tail growth are unresolved. The published zero theorem and the ξ-product argument are explicit dependencies, and no higher zero-verification claim is made.
