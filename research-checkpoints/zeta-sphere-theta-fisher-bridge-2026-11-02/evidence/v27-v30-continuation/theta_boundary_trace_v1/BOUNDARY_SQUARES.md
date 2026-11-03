# Signed boundary-square control of the current theta trace residue

New analytical argument, not yet audited. All formulas concern the actual complete even theta profile phi=psi_lambda and current positive normalized spectral prefix. No next pivot is assumed.

## 1. Current polynomial roots make the diagonal residue explicit

The true positive prefix gives a real symmetric Jacobi matrix with positive subdiagonals. Thus the current spectral monic p_j has simple real roots in symmetric pairs, with one zero for odd j. The physical polynomial is
 T_j(x)=x^epsilon product_(l=1)^m(x²+a_l²), a_l>0.
These are actual current spectral roots, not roots of phi or of the zeta function.

Put F=T_j(D)phi, K=T_j'(D)phi, f_l=[T_j(D)/(D²+a_l²)]phi. For odd j also put v=[T_j(D)/D]phi. Polynomial differentiation gives
 K=sum_l 2D f_l +epsilon v,
 where each corresponding product with F uses F=f_l''+a_l²f_l, and for the odd term F=v'.
Consequently integration by parts on the half-line yields the EXACT identity
 integral_0^infinity K F
  =-sum_l [f_l'(0)²+a_l²f_l(0)²]-(epsilon/2)v(0)².       (1)
The superexponential theta tails make all infinity boundary terms zero. Each term has a fixed negative sign. Evenness further makes f_l'(0)=0 for even j and f_l(0)=0 for odd j.

For Y_j=F/sqrt(sigma_j), define the nonnegative boundary cost
 B_j={sum_l[f_l'(0)²+a_l²f_l(0)²]+epsilon v(0)²/2}/sigma_j.
Then the diagonal residue from the canonical-source packet is
 R_jj=2 integral_0^infinity hY_j²-2B_j,
 trace R=2 trace M_1-2 sum_(j=0)^N B_j.                 (2)
In particular trace R<=2 trace M_1. This proves a sign for the boundary correction, not for the difference trace R. All boundary values are finite combinations of actual even theta jets at0, calculated from the convergent all-orbit theta derivative recurrence. No discarded-orbit approximation is used in (1)-(2).

## 2. The highest positive regression coefficient has a fixed sign

Let U=(Y_0,...,Y_N), B=M_1, and M_0=integral U U^T. Let G denote the positive h-weighted orthogonal compression of physical differentiation D to span(U). Its matrix satisfies the exact Green relation
 B G+G^T B=-M_0,
 up to transpose convention, so
 trace G=-(1/2)trace(B^-1 M_0)<0.                       (3)
All these matrices are finite and B,M_0 are positive definite for the actual theta derivative design.

For the canonical monic next polynomial q=T_(N+1)(D)phi, write its positive projection as gamma^TU. It has no degree-N differential coefficient because T_(N+1) has the opposite parity. The residual q-gamma^TU is the unique monic degree-(N+1) differential polynomial whose application to phi is h-orthogonal to the prefix. Its polynomial is the characteristic polynomial of the compressed derivative G: the derivative Krylov basis is independent and the usual finite companion relation follows directly from projecting D^(N+1)phi. Hence its coefficient of x^N is -trace G. But that coefficient in q-gamma^TU is -gamma_N/sqrt(sigma_N). Therefore
 gamma_N= sqrt(sigma_N) trace G
         =-(sqrt(sigma_N)/2)trace(B^-1M_0)<0.           (4)
This is an exact sign and trace formula, not a uniform bound on the positive design inverse.

## 3. Consequence for the correlated canonical payment

The accepted canonical source identity gives c_N'=-(sqrt(sigma_N)/2)trace R. Therefore the highest-component contribution to the full source term is exactly
 4 gamma_N c_N'=sigma_N trace(B^-1M_0) trace R.         (5)
Equations (2) and (5) show explicitly the competition: positive half-line mass versus a sum of nonnegative modular boundary squares, multiplied by a known positive regression trace. All lower source components and the signed quadratic -2gamma^THgamma remain in the original criterion. Neither their cancellation nor the comparison with kappa_0 M_N is settled by this diagonal formula.

This provides two analytical signs (boundary correction nonpositive; top regression coefficient negative). It does not establish trace R>=0, the full canonical payment, or a growing-degree rate. In particular it does not replace B conditioning by actual signed conditioning.
