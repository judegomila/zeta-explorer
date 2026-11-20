# Matrix-valued feature anchors and a signed graph criterion

Status: exact derivation, actual-theta interval check, independent replay, and analytic review passed. No growing-degree theta inequality is asserted.

## 1. Exact structured Gram construction
For an arbitrary real signed partition M=sum_i[A_i b_i;b_i^T d_i], assume only the complete lower block A=sum A_i>0. Set B=sum b_i and r=A^(-1)B. Define

G_ij=b_i^T A^(-1)b_j, alpha_i=sum_j G_ij=b_i^T r,
D=diag(alpha_i), L=D−G, rho_i=d_i−alpha_i.

Suppose alpha_i>0, the feature graph Laplacian L is PSD, and every rho_i>=0. Define

R_i^0=b_i b_i^T/alpha_i,
Q=A−sum_i R_i^0,
R_i=R_i^0+lambda_i Q, lambda_i>=0, sum lambda_i=1.

Then Q>=0, sum R_i=A, and R_i r=b_i. Therefore

[A_i b_i;b_i^T d_i]
=[R_i b_i;b_i^T d_i]+[A_i−R_i 0;0 0],

while the first term has the explicit PSD factorization

[R_i b_i;b_i^T d_i]=[I;r^T]R_i[I,r]+diag(0,rho_i).

The correction blocks sum to zero. Thus the **complete** matrix has an explicit Gram factorization even though the actual local A_i may be indefinite. Strict positivity follows if sum rho_i>0.

To verify Q>=0, whiten A and let U have columns u_i=A^(-1/2)b_i. Then G=U^TU. The condition D−G>=0 is equivalent to UD^(-1)U^T<=I, by the nonzero singular-value correspondence. This proves Q>=0. Also Qr=0 because sum R_i^0 r=sum b_i=B=Ar.

Zero columns can be omitted and their diagonal contributions handled separately. No inverse of a local indefinite A_i is taken.

## 2. Both positive and negative feature edges are permitted
For real data,

L=sum_(i<j) G_ij(e_i−e_j)(e_i−e_j)^T.

Nonnegative pairwise feature products are sufficient, but not necessary. Write L=L_plus−E W E^T, where L_plus uses positive edges and E,W encode negative edges with positive magnitudes. Provided every negative edge joins vertices in the same connected component of the positive graph, the exact condition is

||W^(1/2) E^T L_plus^(dagger) E W^(1/2)||<=1.

This is the usual Loewner/Schur test on the range of L_plus; component compatibility removes its nullspace obstruction. It supplies a quantitative negative-edge budget rather than requiring all feature correlations have the same sign.

The other condition rho_i>=0 is an actual regional projected-diagonal budget and must still be proved. Negative physical pieces may have to be grouped with positive pieces; no anchor can turn a genuinely negative d_i into a PSD block while keeping that diagonal unchanged. The grouping may vary with degree or frequency. Taking a single region merely recovers the original Schur inequality, so that trivial grouping is not an all-order advance; a useful proof needs a theta-specific nontrivial grouping rule and bounds.

## 3. Why matrix anchors improve on scalar weights
For two whitened cross-columns u,v, the infimum of

u^T R^(-1)u+v^T(I−R)^(-1)v, 0<R<I,

is ||u||²+||v||²+2|u^Tv|. The scalar-weight optimum is instead(||u||+||v||)². A lower bound follows by matrix Cauchy applied to u+v and u−v; an attaining semidefinite limit is constructed by first choosing the sign of v so its inner product with u is nonnegative and taking rank-one anchors mapping u±v to u and ±v. Positive regularization gives the infimum if necessary.

When u^Tv>0, the feature graph is PSD and the matrix anchors may have a common regression r, so the scalar-anchor angular cost is absorbed by the anchor geometry rather than requiring a finely canceled covariance estimate. This does not change the exact complete Schur reserve; it changes which auxiliary terms need to be bounded.

## 4. Actual theta example with an indefinite local core
For the reviewed normalized a=0 odd-degree19 block, split at H=1/16 and use the complete first nine channels as A. The interval checker gives

G_core,tail in(.9992631453,.9992657227)>0,

rho_core in(.0003303367,.0003329141)>0,
rho_tail in(.5305495657,.5305554250)>0.

The two-vertex feature graph Laplacian has nonzero eigenvalue2G_core,tail>1.99852629. Thus the matrix-anchor construction yields two PSD modified regional blocks whose zero-sum lower-block corrections recover the actual complete matrix.

The actual core lower block remains indefinite (its first3-by-3 principal determinant is below−.01100735). Hence this is not a disguised assumption of local core positivity. The same validated residual-quadratic method used in the reviewed common-anchor packet supplies G and rho; no new quadrature or higher degree is introduced.

## Remaining theta-specific task
For growing degree, establish a nontrivial adaptive grouping with controlled projected residuals rho_i and a feature-Laplacian negative-edge budget. Exact modular identities or derivative transport may constrain these features, but no such uniform estimate has yet been proved. The finite construction is a working mechanism and reduced lemma, not an RH proof.
