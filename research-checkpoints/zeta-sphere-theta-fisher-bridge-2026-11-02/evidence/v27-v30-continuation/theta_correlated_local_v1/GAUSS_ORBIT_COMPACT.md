# Prefix Gauss cancellation and a monotone complete-theta source bound

Independently reviewed analytic PASS. This is a degree-adaptive source estimate; it does not assert that its signed lower bound succeeds uniformly.

## 1. Exact finite cosine subtraction determined by the actual prefix

Assume the two known prefix Grams G=(mu_(i+j)) and Gx=(mu_(i+j+1)), 0<=i,j<N, are positive definite. Their positive generalized eigenvalues x_l and positive Gauss weights w_l give exact quadrature for polynomials through degree2N-1. The actual monic P_N vanishes at these nodes. This construction uses no mu_2N or next-pivot sign.

With rho_N(s) the actual inverse cost from RATIONAL_SOS.md,
 rho_N(s)=sum_l w_l/(s+x_l).
For example this follows from b=G e_0 and C_old=sG+Gx; whitening G gives the finite Jacobi resolvent. Define
 q_N(r)=(1/(4pi))sum_l w_l cos(2sqrt(x_l)r),
 E_N(r)=C(r)-q_N(r).
Then exactly
 Delta_N(s)=(8pi/sqrt(s)) integral_0^infinity E_N(r)e^(-2sqrt(s)r)dr. (1)
The even contacts of E_N through order4N-2 vanish. Its first remaining contact is
 E_N^(4N)(0)=4^(2N) h_N/(4pi),                       (2)
where h_N=mu[P_N²] is the unknown original pivot. Thus a proposed nonnegative osculating comparison C>=q_N on an entire neighborhood of zero would already imply the next-pivot sign; it is not supplied by the known prefix. Equation (1) is a correlated base-kernel evaluation retaining the exact actual inverse, not a positive-parent replacement.

## 2. Modular reflection makes the undifferentiated orbit approximation monotone

For all real u set z_n(u)=pi n² exp(2|u|), and define
 psi_M(u)=4 sum_(n=1)^M exp(|u|/2)(2z_n²-3z_n)e^(-z_n).
Every term is positive because z_n>=pi. By actual modular evenness, psi_M increases to the complete psi pointwise. Therefore
 C_M(r)=integral v²psi_M(r+v)psi_M(r-v)dv
 increases to C(r), with no assertion about derivatives of C_M. The reflected finite sum need not be smooth at zero; that causes no problem here because it is never differentiated. This is distinct from the invalid fixed-orbit approximation of growing-order jets.

Let delta_j=integral |u|^j(psi-psi_M)(u)du, j=0,2, and m=M+1, a=pi m². A fully explicit bound is
 0<=delta_0,delta_2<=D_M:=48a e^-a.                  (3)
Proof: discard the negative term in each positive tail summand and use u²<=e^u for u>=0. For either j,
 delta_j<=8 sum_(n>=m)(pi n²)^(-3/4) Gamma(11/4,pi n²).
For a_n=pi n², the incomplete-gamma integral is <=3 a_n^(7/4)e^-a_n since 1-7/(4a_n)>1/3. Thus delta_j<=24 sum a_n e^-a_n. Consecutive ratios are <=4e^(-3pi)<1/2, so the sum is <=2a e^-a. The same bound with M=0 gives the complete moments M_0,M_2<8.

The positive double-integral formula for J gives a monotone approximation J_M built from psi_M, and
 0<=J(s)-J_M(s)
 <=(pi/sqrt(s))(delta_0 M_2+M_0 delta_2)
 <=16pi D_M/sqrt(s).                               (4)
All orbit terms have been paid, with no high derivative and no unknown pivot.

For a compact kernel estimate, the already audited sup bound psi<=192 gives
 0<=C(r)-C_M(r)<=384D_M(1+r²).                       (5)
Indeed expand psi psi-psi_M psi_M into two positive tail products, bound the other factor by192, translate v to u, and use evenness of the tail profile to remove the odd moment.

## 3. A precise degree-adaptive accuracy rule

The actual scaled residual is A_N(s)=sP_N(-s)²Delta_N(s). Let
 A_(N,M)(s)=sP_N(-s)²[J_M(s)-rho_N(s)].
Then, with the true prefix inverse unchanged,
 A_(N,M)(s)<=A_N(s)<=A_(N,M)(s)+16pi sqrt(s)P_N(-s)²D_M. (6)
Since a>=pi implies a e^-a<=e^(-a/2), it suffices for error<=epsilon to take
 pi(M+1)²>=max{pi, 2log(768pi sqrt(s)P_N(-s)²/epsilon)}. (7)
This is a rigorous source-accuracy rule valid at each degree. For fixed actual coefficients and large s, its leading size is M=O(sqrt(N log s+log(1/epsilon))); actual P_N(-s) remains in (7), so no uniform conditioning is hidden.

Combined with ADAPTIVE_RESOLVENT.md, the genuine sufficient next-pivot test is
 A_(N,M)(s)>B_N/s.                                  (8)
If (8) holds, the original h_N is positive. Neither (6) nor (7) proves that (8) can be achieved without additional signed information. They do show that the complete-theta source can be approximated monotonically at the required degree-dependent accuracy without truncating high jets.

## 4. Compact evaluation and an explicit shortcut counterexample

At any R, the known cosine tail has exact elementary integral
 integral_R^infinity e^(-kappa r)cos(omega r)dr
 =e^(-kappa R)[kappa cos(omega R)-omega sin(omega R)]/(kappa²+omega²).
Consequently replacing C by C_M on[0,R], omitting only the positive C tail, and retaining this entire signed cosine tail gives a rigorous lower bound in (1). The error on[0,R] is bounded by (5). This supplies a compact evaluation with explicit signed terms, not an unearned sign. The independently proved positive C_N tail remains available in the derivative representation; its flux must still be retained if the two representations are combined.

Positivity, evenness, rapid decay, positive prefix, and positive eventual differentiated tail alone do not justify C>=q_N near zero. As a precise synthetic-kernel test take C(r)=exp(-r²-r^4). It is positive and even, with mu_0=4pi, mu_1=2pi>0, mu_2=-3pi, hence h_1=-4pi. The known N1 prefix is positive in both parity blocks; q_1(r)=cos(sqrt(2)r), and C-q_1=-(2/3)r^4+O(r^6)<0 near zero. Its degree4 differentiated leading tail is positive. This example is NOT asserted to be a theta midpoint correlation or a counterexample to the actual theta target; it rejects only a shortcut using these generic properties instead of a theta-specific signed comparison.

Remaining exact requirement: a lower estimate for the actual theta E_N weighted integral, with its prefix quadrature subtraction retained, strong enough to pass (8). No such uniform inequality is proved here.
