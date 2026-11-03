# Relative actual-metric conditioning, instead of a monomial lambda penalty

The previous lambda^-4 error estimate is safe but coordinate-dependent. This note gives an invariant alternative and a conditional relative-conditioning partition, tested using actual theta old/cross data in both finite parity families. It does not prove a degree-uniform source sign or a degree-uniform conditioning budget.

## 1. Exact invariant third-derivative bound

Retain the reviewed notation A,L,z,v,r,t,W and
 S'''=sigma2-6 t^TA^-1r+6r^TA^-1LA^-1r,
 sigma2=v^TW''v.
Define Er=r^TA^-1r, Et=t^TA^-1t, C=A^-1/2 L A^-1/2. Then
 |S'''|<=|sigma2|+6sqrt(Er Et)+6||C|| Er.                (1)
This is Cauchy--Schwarz in the actual old metric, with no unknown target norm. It remains valid when L is indefinite if ||C|| is the spectral operator norm. If L>=0, then C>=0 and ||C||<=tr(C)=tr(A^-1L).

All quantities in(1) are invariant under a constant invertible change of old basis, with the monic target unchanged. By contrast, scaling the old basis by delta>0 sends A to delta²A and its Euclidean minimum eigenvalue to delta²lambda while preserving the exact Schur source and(1). Thus an arbitrarily small monomial lambda is not itself an intrinsic obstruction. This does not prove the invariant energies are bounded with degree.

The owned four-cutoff check verifies local L>0 before using the trace bound. Representative relative trace enclosures:
- odd7 at1/8: between105.8725 and105.9644; at1/2: between3.7908 and3.7937;
- even6 at1/8: between70.0963 and70.0981; at1/2: between2.3493 and2.3497.
The computed invariant error upper bounds are finite without a raw lambda^-4 substitution. The output also compares with the earlier generic formula using a deliberately conservative determinant/trace eigenvalue bound. Its enormous ratios compare two conservative estimates, not actual numerical condition numbers or a claimed complexity improvement by that ratio.

## 2. Fixed-per-cell whitening and residualization

Choose an actual reference old matrix A0>0 and its actual optimizer z0. On a cell use the constant coefficient transformation
 T=[[A0^-1/2,z0],[0,1]].
The transformed old matrix is Atilde=A0^-1/2 A A0^-1/2 and transformed cross column is btilde=A0^-1/2(Az0+b). At the reference cutoff Atilde=I and btilde=0. The transformed target value at that cutoff is the signed starting Schur remainder; it is never square-rooted or normalized as positive.

If ||Atilde-I||<=rho<1 and ||btilde||<=eta, the earlier derivative-error estimate applies with
 lambda=1-rho, B=eta, V²=1+eta²/(1-rho)²,
 and J_j=||T^T W^(j) T||.
This eliminates artificial old-basis scaling from the inverse budget. The transformed source norms and residual cross variation still have to be controlled. Whitening is frozen on the cell; differentiating a moving whitening without its connection terms would not be justified.

## 3. A log-determinant partition when actual local old density is positive

Suppose A(H)>0 and L(H)=A'(H)>=0 throughout[a,b]. Let
 tau(H)=tr(A^-1L)>=0,
 Bdet=integral_a^b tau=log(det A(b)/det A(a)).            (2)
Since L<=tau A, matrix Gronwall implies, on any subinterval[a_i,H],
 A(a_i)<=A(H)<=exp(integral_(a_i)^H tau) A(a_i).
Consequently, a cell whose determinant-log increment is at most log(3/2) has
 I<=A(a_i)^-1/2 A(H)A(a_i)^-1/2<=1.5 I.                (3)
Partitioning the continuous nondecreasing determinant-log coordinate gives at most max(1,ceil(Bdet/log(3/2))) cells satisfying(3). These are conditioning cells, not claims of adequate quadrature resolution or positive target increments.

This is an actual-prefix quantity: it uses only known old determinants. It is independent of arbitrary constant old-basis scaling and requires no target pivot. It does not bound btilde, J_j, or the signed source on those cells.

## 4. Complete-theta finite applications and exact scope

For even6 the local old matrix is the even3x3 block on1,t²,t⁴. Its positivity throughout the interval follows from the independently audited `h4_attack_v1/H4_PROOF.md` and `post_v7_audit/H4_AUDIT.md`. For odd7 the old block is on t,t³,t⁵ and the audited `h5_tail_v1/POINTWISE_TAIL_PROOF.md` proves positivity for u>=1/8. Their moment convention mu_j=4^j g_j is a positive diagonal congruence: mu_(i+j+epsilon)=4^epsilon 4^i g_(i+j+epsilon)4^j. Multiplication by the positive density2u²psi² preserves positivity. Thus these established finite-order results supply the premise for(2)-(3), separately from the midpoint source proof.

Using independently certified actual endpoint old moments, the owned checker gives:
- odd7: Bdet<10.826757, and Bdet/log(3/2)<26.702067, hence at most27 conditioning cells;
- even6: Bdet<8.448619, and Bdet/log(3/2)<20.836857, hence at most21 conditioning cells.

These counts are existence/conditioning bounds; no specific27/21-cell source quadrature is asserted. The earlier16000-cell midpoint calculation had a different accuracy objective. No degree extension or positive target reserve is inferred from these counts.

## 5. Obstruction to extending the budget without the sign premise

The trace budget cannot replace the operator norm for indefinite L. For example A(H)=diag(exp(H),exp(-H)) is positive, its determinant-log increment is zero, but its relative metric variation is unbounded on long intervals; L is indefinite. This is a generic matrix counterexample, not a theta surrogate proof. Actual theta local old positivity is already known to fail at some higher/other regions, so its finite-order premise cannot be silently extended.

There is a signed replacement if A remains positive: set tau_abs=||A^-1/2 L A^-1/2||. Since -tau_abs A<=L<=tau_abs A, a cell with integral tau_abs<=log(3/2) has (2/3)I<=A0^-1/2 A(H)A0^-1/2<=1.5I, hence ||Atilde-I||<=1/2. At most max(1,ceil((integral tau_abs)/log(3/2))) conditioning cells suffice. This does not identify integral tau_abs with a log determinant; that unsigned relative-variation budget still needs a theta-specific bound.

The remaining degree-uniform tasks are to control the intrinsic relative metric and residual source norms where local positivity is available, or a signed operator-variation budget where it is not, and then prove a positive correlated source lower bound. The note replaces an artificial coordinate penalty with the actual quantities that must be bounded; it does not establish their uniform bounds.
