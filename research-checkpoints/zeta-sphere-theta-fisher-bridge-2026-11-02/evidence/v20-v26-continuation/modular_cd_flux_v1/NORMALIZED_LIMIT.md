# Conditional normalized-a=0 limit of the one-direction modular defect

Status: new exact limit under an explicit positive normalized PREFIX hypothesis; no claim about the next pivot.

For the actual even theta profile, the bridge moments are odd analytic functions of a. If their normalized prefix is positive at a=0, the actual pivots satisfy
 s_j(a)=a sigma_j(a²), sigma_j(0)>0 for j<=N,
and monic residual coefficients are even analytic functions of a. This follows from finite Gram inversion with the common factor a removed. The next polynomial p_(N+1) exists from the positive prefix; its norm need not be positive.

The raw pivot-normalized feature functions themselves diverge as a^(-1/2); only the finite polynomial-coordinate matrices and their defect limit are considered here. Ratios sqrt(s_j/s_k)=sqrt(sigma_j/sigma_k) extend analytically. Let d be the coefficient vector defined at a=0 by
 T_(N+1)'(x)/sqrt(sigma_N(0))
  =sum_(j=0)^N d_j T_j(x)/sqrt(sigma_j(0)).
Then d_N=N+1, and d_j=0 for parity opposite N. Expansion of T_(N+1)(2a-x), using the even-a coefficient dependence, gives
 r(a)=2a(-1)^N d+O(a²),
 R(a)^T r(a)=2a d+O(a²).
Consequently
 kappa_N(a)/a ->4N+||d_perp||²,
 (R^T C R)/a ->4I-2e_Nd^T-2de_N^T.
The limiting quadratic form is
 4||z_perp-(z_N/2)d_perp||²-[4N+||d_perp||²]z_N².
It retains exactly one negative direction for N>=1. This is a finite actual-metric defect at normalized a=0, not a divergent raw-parent estimate.

Because T_(N+1)' lies in the known parity-N prefix, its TRUE normalized signed energy is positive and equals sigma_N times sum_j d_j². Thus d is measured using already-established actual pivots, not a substitute Fisher covariance. The remaining comparison is whether the next joint signed boundary feedback pays the explicit scalar4N+||d_perp||². No such domination is asserted here.
