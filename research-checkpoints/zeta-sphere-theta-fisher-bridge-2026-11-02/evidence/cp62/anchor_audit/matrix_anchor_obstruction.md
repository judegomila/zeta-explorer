# CP62: matrix anchors do not force positive local residuals

This is an exact finite-dimensional obstruction and a covariance identity. The example is synthetic, with no claim that its blocks are realized by the actual theta kernel, a critical chart or the physical Weil/Schur form. It does not refute a signed integrated-anchor cancellation. No imported mathematical producer is used.

## M1. Complex topology and the common integrated block

Let \(P_i\) be Hermitian positive-definite \(n\times n\) matrices, \(B_i\) complex \(n\times m\) matrices, and \(C_i\) Hermitian \(m\times m\) matrices, for a finite index set. All inequalities use Hermitian Loewner order, and the star means conjugate transpose. Define
\[
 A=\sum_iP_i>0,\qquad B=\sum_iB_i,\qquad C=\sum_iC_i,
 \qquad R=A^{-1}B,
 \qquad E_i=B_i-P_iR. \tag{M1}
\]
The anchors partition the **same** complete lower block \(A\); they are not arbitrary pointwise replacements for a different source metric. In particular \(\sum_iE_i=0\). Write the signed local residuals as
\[
 L_i=C_i-B_i^*P_i^{-1}B_i,
 \qquad \mathcal V=\sum_iE_i^*P_i^{-1}E_i\succeq0.
\]
Expanding every term, without commuting any matrices, gives
\[
 \mathcal V=\sum_i B_i^*P_i^{-1}B_i-B^*A^{-1}B,
 \qquad
 \boxed{C-B^*A^{-1}B=\sum_iL_i+\mathcal V.} \tag{M2}
\]
Indeed the two cross sums are \(-B^*R-R^*B\), and the final sum is \(R^*AR=B^*A^{-1}B\). Thus positive total Schur complement permits negative local residuals paid by the full covariance. Dropping that covariance strengthens the desired statement and can make it false.

The identity also holds for measurable matrix families on a positive measure space, with \(P(x)>0\) almost everywhere, \(A=\int P>0\), \(B=\int B(x)\), \(C=\int C(x)\), and these finite matrix integrals absolutely defined entrywise, provided
\[
 \int\operatorname{tr}\bigl(B(x)^*P(x)^{-1}B(x)\bigr)<\infty.
\]
With constant \(R=A^{-1}B\), expansion is justified entrywise and
\[
 C-B^*A^{-1}B
 =\int\bigl(C(x)-B(x)^*P(x)^{-1}B(x)\bigr)
  +\int (B(x)-P(x)R)^*P(x)^{-1}(B(x)-P(x)R). \tag{M3}
\]
This is a finite matrix statement; it supplies no infinite-dimensional operator-domain or physical inverse theorem.

## M2. An exact two-piece counterexample to universal local positivity

Take \(n=m=2\), with
\[
 J=\begin{pmatrix}0&1\\-1&0\end{pmatrix},\qquad
 B_1=\tfrac12I+J,\qquad B_2=\tfrac12I-J,\qquad
 C_1=C_2=I. \tag{M4}
\]
Here \(J^*=-J\), \(J^2=-I\), and
\[
 B_1+B_2=I,\qquad C_1+C_2=2I,\qquad
 B_iB_i^*=B_i^*B_i=\tfrac54I.
\]
For the prescribed complete lower block \(A=I\), the total Schur complement is exactly
\[
 S=2I-I^*I^{-1}I=I>0. \tag{M5}
\]
Nevertheless, for **every** pair of complex Hermitian positive-definite anchors \(P_1+P_2=I\), the two \(L_i=I-B_i^*P_i^{-1}B_i\) cannot both be positive semidefinite. More strongly, their sum is not positive semidefinite.

To prove this, put \(P=P_1\). Both eigenvalues \(\lambda_1,\lambda_2\) of \(P\) lie in \((0,1)\). The spectral theorem, including complex Hermitian \(P\), gives
\[
 \operatorname{tr}\bigl(P^{-1}+(I-P)^{-1}\bigr)
 =\sum_{j=1}^2\frac1{\lambda_j(1-\lambda_j)}\ge8,
 \tag{M6}
\]
because
\[
 \frac1{\lambda(1-\lambda)}-4
 =\frac{(2\lambda-1)^2}{\lambda(1-\lambda)}\ge0.
\]
Equality in M6 holds precisely when \(P=I/2\). Cyclicity of the finite trace now yields
\[
 \sum_i\operatorname{tr}(B_i^*P_i^{-1}B_i)
 =\tfrac54\operatorname{tr}\bigl(P^{-1}+(I-P)^{-1}\bigr)\ge10.
 \tag{M7}
\]
Consequently
\[
 \operatorname{tr}(L_1+L_2)\le4-10=-6. \tag{M8}
\]
If both residuals were positive semidefinite their traces would be nonnegative, contradicting M8. The trace bound also implies that at least one residual has an eigenvalue at most \(-3/2\): there are four eigenvalues in the two residual matrices and their sum is at most \(-6\).

## M3. Sharpness and the covariance that must not be discarded

At the admissible anchors \(P_1=P_2=I/2\), one has \(R=I\), \(E_1=J\), \(E_2=-J\), and exactly
\[
 L_1=L_2=-\tfrac32I,\qquad
 L_1+L_2=-3I,\qquad
 \mathcal V=4I,\qquad S=-3I+4I=I. \tag{M9}
\]
Thus the lower trace cost \(10\), upper local trace sum \(-6\), and the largest universally achievable minimum eigenvalue \(-3/2\) are all sharp. Equivalently,
\[
 \sup_{\substack{P_i>0\\P_1+P_2=I}}
       \min_{i=1,2}\lambda_{\min}(L_i)=-\tfrac32.
\]
For every admissible pair, M2 also gives \(\operatorname{tr}\mathcal V\ge8\), with equality exactly at the equal anchors. A large positive covariance is not an error term: here it is the exact mechanism preserving the positive complete Schur complement.

## M4. Singular anchors and changing the integrated metric

Allowing positive-semidefinite anchors does not rescue a positive **local block**
\[
 \begin{pmatrix}P_i&B_i\\B_i^*&C_i\end{pmatrix}.
\]
Such block positivity requires \(\operatorname{ran}B_i\subseteq\operatorname{ran}P_i\): for \(v\in\ker P_i\), positivity of the quadratic form on \((v,\varepsilon w)\) for both signs/phases of \(\varepsilon\) forces \(v^*B_i=0\). Each \(B_i\) in M4 is invertible, so that range condition forces \(P_i\) to be positive definite. Substituting a Moore--Penrose inverse while dropping the range condition is not a valid Schur-positivity test.

Likewise a different integrated anchor \(\widetilde A=\sum_iP_i\ne A\) changes the target. With \(\widetilde R=\widetilde A^{-1}B\) and its corresponding covariance \(\widetilde{\mathcal V}\), the exact identity is
\[
 C-B^*A^{-1}B
 =\sum_iL_i+\widetilde{\mathcal V}
       +B^*(\widetilde A^{-1}-A^{-1})B. \tag{M10}
\]
The last Hermitian term has no general sign. Changing the metric or independently rescaling pieces cannot make it disappear without an additional proved comparison.

## M5. Scope for the campaign

M4--M9 refute the universal assertion that a matrix-valued anchor can always make every local residual positive semidefinite whenever the complete Schur complement is positive. They do not refute any source-specific anchor choice whose **signed integrated** residual and full covariance jointly satisfy M2 or M3. They are not an actual-theta, critical-zero or Weil counterexample.

For a prescribed complete finite block and reserve \(\sigma>0\), the exact target remains
\[
 \sum_iL_i+\mathcal V\succeq\sigma I,
\]
with the same \(A,B,C\), all cross terms and inverse gates. This re-expression is not an independently proved arithmetic estimate. Actual source realization, normalization, signed core/tail feedback, endpoints, spatial/time switches, arbitrary multiplicity limits, uniform support/degree control and the physical Schur inverse remain separate obligations. No degree19 or all-order sphere theorem is imported or duplicated here.
