# Actual residual dyadic recurrence and a superexponentially paid cost tail

Independently reviewed analytic PASS. This uses the exact reindexing in DYADIC_RESIDUAL_PAYMENT.md and retains the actual residual polynomial throughout.

Let a_j=T_p A_f((log j)/2), L=log2, q=2^-1/2. For v>=0 define
 X_v=sum_(u odd>=1)(2^v u)^(-1/2)d(u)a_(2^v u),
 b_m=q^m C_m,
where C_m is the actual residual translation correlation. Absolute convergence follows from the reviewed complete single-orbit bounds.

## 1. Exact discrete recurrence

The divisor identity gives
 b_m=sum_(v>=m)(v-m+1)X_v,
 b_m-2b_(m+1)+b_(m+2)=X_m.                        (1)
This is a discrete second-difference identity, not a closed positive recurrence: low-index X_m may have either sign. It contains the actual prefix inverse through a_j and does not normalize by an unknown signed norm.

Write
 Y_v=sum_(u odd>=1)(2^v u)^(-1/2)
          [d(u)c_(2^v u)+ell_2(u)a_(2^v u)/4].
The exact prime-variance split also yields
 h[p]/(4pi)=sum_(v>=0)(v+1)Y_v+(L²/2)sum_(m>=1)m b_m. (2)
Indeed sum_(m=1)^v m(v-m+1)=v(v+1)(v+2)/6. The eta payment is
 E[p]/(2pi L²)=3b_0+5sum_(m>=1)b_m.                (3)
These identities display the correlated target and payment using the same b_m rather than treating their energies independently. The Y_v terms remain signed and cannot be discarded.

## 2. Parity fixes the eventual sign of the ACTUAL correlations

Let k_K be the proven degree-only arithmetic sign cutoff for T_p (or its positive opposite in odd parity), and set m_0=ceil(log_2 k_K). If m>=m_0, every arithmetic index in C_m is divisible by2^m and hence at least k_K. Therefore
 C_m>0 for even residuals,
 C_m<0 for odd residuals.                          (4)
Moreover b_m-b_(m+1)=sum_(v>=m)X_v. Thus beyond m_0 the EVEN b_m are positive, decreasing and discretely convex, while the ODD b_m are negative, increasing toward zero and discretely concave. This statement is for b_m=q^m C_m; no monotonicity of the unweighted C_m is inferred.

This is a genuine actual-theta finite-degree sign result, not inherited log-concavity of the derivative residual. It holds irrespective of the unknown next signed pivot.

For a cost truncation E_M after m=M, if M+1>=m_0 then
 even: E[p]>=E_M[p];
 odd:  E[p]<=E_M[p].
These signs refer to the COST series only. They do not cancel the original target's negative odd arithmetic tail or determine the signed Y_v in(2).

## 3. Explicit much sharper tail than the generic geometric norm bound

For an operator of highest even order K>=2, use its nonnegative coefficient polynomial W(S) from the degree-only proof (the positive opposite for odd parity), and B_K=6400(K+2)²(K+3)³, H_K=(2K+7)(3K+7).

The omitted cost correlations collapse exactly to
 E[p]-E_M[p]
 =5pi L² sum_(j: v2(j)>=M+1) j^-1/2 d(oddpart j)
              (v2(j)-M)(v2(j)-M+1)a_j.             (5)
For M>=0, the coefficient is at most d(j)(v2(j)+1). Use d(j)<=j and v2(j)+1<=1+log_2 j, plus the reviewed whole single-orbit bound
 |a_j|<=2B_K pi^-1 j^-1/4 W(2pi j)e^(-pi j/2).
Writing J=2^(M+1), if
 J>=max{e²,H_K/(4pi),4(K+3)/pi},
then the same geometric-ratio argument as ARITHMETIC_REMAINDER_BOUND.md gives
 |E[p]-E_M[p]|
 <=20L² B_K J^(1/4)(1+log_2 J)W(2pi J)e^(-pi J/2). (6)
For the prefactor's logarithmic derivative, W contributes at most K/j, j^(1/4) contributes1/(4j), and1+log_2 j contributes at most2/j; thus K+3 is sufficient. The ratio after the exponential is at most e^-pi/4<1/2, producing the factor2 in(6).

This is superexponential in M for each fixed actual residual: J=2^(M+1). Its degree and actual coefficient dependence remain in W and the displayed threshold. Unlike the generic geometric relative-error bound, it uses complete-theta arithmetic localization. It does not give degree-independent accuracy for a potentially tiny signed pivot.

## 4. Remaining comparison

Equations(1)-(6) rigorously control actual inverse-selected residual correlations and their eventual signs, in both parities. Uniform domination of the filtered surplus still requires control of the low m correlations jointly with the signed Y_v contribution in(2). The eventual sign and paid tail do not supply such a bound. No new finite pivot run or all-degree inference is made here.
