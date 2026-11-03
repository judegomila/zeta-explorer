# Canonical next source cancels the actual inverse-feedback term exactly

New analytic derivation, awaiting independent audit. Use conventions and positive current-prefix hypothesis from COMMON_METRIC.md; no next signed norm is assumed or used as denominator.

Replace the source DF_N by the ACTUAL MONIC next source
 q=T_(N+1)(D)g_a=DF_N+beta_N F_(N-1), beta_N=s_N/s_(N-1).
The next monic coefficients are determined by current-prefix orthogonality (equivalently the true three-term recurrence). They require no positivity of s_(N+1). Coefficients and beta_N are even in a at normalized0, so their first derivatives vanish. Adding this old next-parity feature does not change delta, E, L or f_actual at0; it changes the positive regression alpha by a constant-in-first-order old coefficient only.

## 1. Exact feedback cancellation in the actual target metric

For this canonical source, c_V'=0. Indeed original signed orthogonality <V,q>_signed=0 differentiates at0; equal-parity reflection makes this derivative exactly2c_V'. This uses construction of the monic next polynomial from the old prefix, not a next positive pivot.

With A'=I/2, alpha=A^-1c_V,
 alpha'=-A^-1 alpha/2,
 f_actual=(Aalpha')^T A'^-1(Aalpha')=||alpha||²/2.
Since L=c^TB^-1c-c_V^TA^-1c_V, differentiation cancels this term EXACTLY:
 L'-f_actual=2 y^T c_W'-gamma^T H gamma,                 (1)
 gamma=(x,y)=B^-1c, H=B'=[[I/2,J],[J^T,I/2]].
This is a single prefix regression functional. There is no independent unknown feedback inverse left after the cancellation; the actual old metric was used to derive it, not replaced. The positive full-prefix regression gamma still must be controlled in the signed metric H.

The original sufficient scalar payment becomes
 4 y^T c_W'-2 gamma^T H gamma >= kappa_0 M_N.            (2)
Neither the sign of H nor this inequality is assumed.

## 2. The residue matrix has zero cross-parity blocks

For opposite i,j the audited physical cross-parity identity is
 integral_R hY_iY_j=-(1/2)integral_R(K_iY_j+Y_iK_j).
Each integrand is even, so halving to the positive half-line gives
 R_ij=2M_1,ij+(Cconn M_0+M_0 Cconn^T)_ij=0.
Thus the residue matrix R in the exact mixed-metric recurrence is BLOCK DIAGONAL in parity. This removes independent mixed-residue unknowns, while the mixed metric J remains genuinely nonzero.

## 3. All canonical source derivatives from the current prefix

Let b=b_(N-1)=sqrt(sigma_N/sigma_(N-1)); put b=0 for N=0. Let X be the skew tridiagonal current derivative recurrence matrix, X_j,j+1=b_j and X_j,j-1=-b_(j-1). The source identity q=sqrt(sigma_N)[DY_N+bY_(N-1)] gives, for j<N,
 c_j'/sqrt(sigma_N)=-(XH)_jN-R_jN+b H_j,N-1.            (3)
For j=N,
 c_N'/sqrt(sigma_N)=-R_NN/2+b H_N,N-1
                   =-(1/2)trace(R_0:N,0:N).            (4)
The last equality is the exact adjacent telescoping identity of COMMON_METRIC.md. Terms containing index -1 are zero.

For old-next-parity j, R_jN=0, H restricted to each parity is I/2, and (3) cancels to0, recovering c_V'=0 without invoking the next pivot. For current parity j, (3)-(4) are explicit current-prefix formulas. Together with the anti-diagonal recurrence for J they determine the entire left side of (2) from true prefix b_i, M_0,M_1, the symbol connection, and the positive regression B^-1c. The undifferentiated c is also prefix-only by integration by parts as previously audited.

## 4. What is still missing

This is a real cancellation of the actual feedback, not a bound obtained by estimating L' and f separately. It does not by itself prove a degree-dependent sign. The outstanding question is the correlated inequality (2), with J near a potentially degenerating mixed-metric boundary and with kappa_0 M_N fully retained. The no-uniform-gap companion rules out solving it by assuming a fixed coercivity constant for H, but does not rule out exploiting the exact residue/source correlations above.
