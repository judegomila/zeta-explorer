# Exact contour-convolution identity and one bounded cumulative-tail target

2026-11-02. Analytic identities independently reviewed. The separate Arb core and full error certificate are now independently replayed; see ../lehmer_tail_certificate_v1/.

## Scope and normalization

Define
F_H(v)=∫_H^∞2h²ψ(h−v)ψ(h+v)dh,
C_H(v)=∫_0^H2h²ψ(h−v)ψ(h+v)dh,
so F_H=F_0−C_H. Here F_0 is the a=0 normalized bridge, not the unnormalized zero function C_(a=0).

With ξ(z)=(1/2)z(z−1)π^(−z/2)Γ(z/2)ζ(z) and Ξ(t)=ξ(1/2+it), the profile normalization is
∫_R ψ(u)e^(itu)du=2Ξ(t).
This follows already by Mellin-transforming the first summand: its transform is 2Q(1/2+it), and the full profile supplies ζ. Consequently, with Fourier convention exp(−ikv),

F_0_hat(2t)=Ξ′(t)²−Ξ(t)Ξ″(t).                         (1)

The exact rational test height is t*=7005081715/1000000. It was selected near the classical Lehmer pair 7005.062866… and 7005.100564… listed in Terence Tao's research exposition https://terrytao.wordpress.com/2018/01/20/lehmer-pairs-and-gue/ . That exposition's broader RH/GUE discussion is not assumed here. The proposed sign test is at one specified rational height and does not depend on certifying those roots or their exact midpoint.

## Contour identity

Fix 0<y<π/4, write δ=π/4−y, and set
g(u)=ψ(u+iy)e^(itu),
c(q)=∫_R g(u) conjugate(g(q−u))du.
This is ordinary convolution with the pointwise conjugate, NOT the positive autocorrelation whose Fourier transform is |g_hat|². Although c(q) is real by exchanging the integration variables, it may have either sign.

Shift v to x−iy in C_H_hat(2t). Evenness in h permits replacing ∫_0^H2h² by ∫_(−H)^H h². Put u=h−x and w=h+x. The Jacobian is du dw=2 dh dx, h=(u+w)/2, and the phase is e^(itu−itw). Hence exactly

C_H_hat(2t)=e^(−2ty)/8 ∫_(−2H)^(2H)q²c(q)dq,
e^(πt/2)C_H_hat(2t)=e^(2δt)/8 ∫_(−2H)^(2H)q²c(q)dq. (2)

The contour shift is legitimate because the full ψ is analytic in |Im u|<π/4 and decays superexponentially as |Re u|→∞ on every closed smaller strip. Evenness is used to evaluate the full theta profile on the stable Re u≥0 side. No unbounded negative-half-line theta-sum interchange is made.

For a basic absolute check, Cauchy–Schwarz gives |c(q)|≤||ψ(.+iy)||₂². Thus, for B=2H,
|e^(πt/2)C_H_hat(2t)|≤e^(2δt) B³||ψ(.+iy)||₂²/12.

## Implemented exploratory FFT

Sample u_j=−L+jΔ, j=0,…,N−1, Δ=2L/N, and zero-pad to 2N. If D_j=DFT(g)_j DFT(conjugate g)_j, then the trigonometric interpolant to the discrete convolution yields

∫_(−B)^B q² c_discrete(q)dq
 =Δ/(2N) Σ_j D_j(−1)^j W(ω_j),
ω_j=2π fftfreq(2N,Δ),
W(ω)=2[B²sin(ωB)/ω+2Bcos(ωB)/ω²−2sin(ωB)/ω³],
W(0)=2B³/3.                                            (3)

The (−1)^j is the coordinate shift from convolution origin −2L. The near-zero W expression is evaluated by its Taylor series. A Gaussian test with an exact transform validates the algebraic scaling to approximately 2.5e−15 in doubles. This is a normalization check, not an error certificate for ψ.

The candidate uses H=1, L=6, δ=2/t*. Exploratory powers 18 and 19 and the alternative δ=1/t* agree closely on a scaled core around 5.69627778219e13. The full side is separately interval-certified by certify_full.py:

3.1958789116333987e12 < e^(πt*/2)F_0_hat(2t*)
                         <3.1958860546508378e12.        (4)

The separate Arb verifier and analytic error proof now certify all sampling, arithmetic, interpolation, truncation and periodization costs; agreement across exploratory grids was not used as a certificate. The safe scaled core lower bound is 56962777800000. Combining it with the integer full-side upper3195886054651 proves exp(πt*/2)F_1_hat(2t*)<−53766891745349. This disproves the all-H/all-order cumulative-tail premise, not positivity of F_0, not RH, and not the separate fixed cutoff H=1/16 premise.

## Why a close pair was a useful target, not a sign assumption

If two actual simple critical-line zeros are γ0±d and locally Ξ(γ0+u)=(u²−d²)A(u), then at their exact midpoint
F_0_hat(2γ0)=2d²A(0)²+d⁴[A′(0)²−A(0)A″(0)].
If |(log|A|)″|≤K there, a sufficient tail-failure criterion is
C_H_hat(2γ0)/A(0)²>2d²+d⁴K.
Small d reduces the full density, but does not determine the core's sign or magnitude. No negative-tail conclusion follows from the zero gap alone.
