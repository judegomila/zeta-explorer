# Quotient exterior preconditioner and sampling-action theorem

## 1. Claim boundary

This note removes a conditioning hypothesis from the positive-sampling side
of the prolate--Weil program. A positive source defect form can be pushed to
the **actual physical range** by minimizing over all source representatives.
The resulting quotient preconditioner depends on the largest singular value
of the defect-normalized physical synthesis, but not on its smallest
singular value. Thus no endpoint-jet determinant is required for this part
of the argument.

The theorem is finite-dimensional linear algebra. It does not prove the
defect-relative exterior sampling estimate, either shifted signed-sector
comparison, equation (5.2) of DIRECT_RH_ATTACK.md, locally uniform
determinant convergence, or RH. The repository state remains
P0_INVALIDATED.

## 2. Minimum-energy descent to the physical range

Let \(X\) and \(H\) be finite-dimensional Hilbert spaces, let \(D>0\) on
\(X\), and let

\[
 W:X\longrightarrow H,\qquad K=\operatorname {ran}W.       \tag{2.1}
\]

No injectivity of \(W\) is assumed. Put

\[
 A=WD^{-1/2},\qquad
 \Delta_K=(AA^*)^\dagger\big|_K
 =(WD^{-1}W^*)^\dagger\big|_K,                              \tag{2.2}
\]

where the dagger is the Moore--Penrose inverse. Since \(AA^*\) is positive
and has range \(K\), \(\Delta_K\) is strictly positive on \(K\).

**Theorem 1 (quotient identity).** For every \(v\in K\),

\[
\boxed{
 \inf_{Wx=v}\langle x,Dx\rangle
 =\langle v,\Delta_Kv\rangle.}                              \tag{2.3}
\]

Moreover,

\[
\boxed{
 \lambda_{\min}(\Delta_K)
 ={1\over\|WD^{-1/2}\|^2}.}                                 \tag{2.4}
\]

**Proof.** Write \(y=D^{1/2}x\). The constraint is \(Ay=v\) and the cost is
\(\|y\|^2\). Its minimum-norm solution is

\[
 y_0=A^*(AA^*)^\dagger v.                                   \tag{2.5}
\]

Equivalently, the unique minimum-energy source lift is

\[
 x_v=D^{-1/2}A^\dagger v=D^{-1}W^*\Delta_Kv.                \tag{2.5a}
\]

Every other solution is \(y_0+k\) with \(k\in\ker A\), and \(y_0\) is
orthogonal to \(\ker A\). Because \(v\in\operatorname {ran}A\),

\[
 \|y_0\|^2
 =\langle v,(AA^*)^\dagger AA^*(AA^*)^\dagger v\rangle
 =\langle v,(AA^*)^\dagger v\rangle.                        \tag{2.6}
\]

This proves (2.3). The nonzero eigenvalues of \(AA^*\) are the squared
nonzero singular values of \(A\); inversion on \(K\) proves (2.4). Notice
that a source kernel contributes only zero singular values, which are
discarded by the quotient rather than inverted. \(\square\)

## 3. Positive sampling descends without a Gram determinant

Let \(S:K\to Z\) be any sampling analysis map and put

\[
 G_K=S^*S\succeq0.                                           \tag{3.1}
\]

Suppose that the source-coordinate sampling estimate

\[
\boxed{W^*G_KW\preceq C D}                                  \tag{3.2}
\]

holds for some explicit \(C\geq0\). For \(v=Wx\), equation (3.2) gives
\(\|Sv\|^2\leq C\langle x,Dx\rangle\) for every preimage of \(v\). Taking
the infimum and using (2.3) proves

\[
\boxed{G_K\preceq C\Delta_K.}                               \tag{3.3}
\]

Consequently the exact alignment constant from equation (4.13) of
notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md obeys

\[
\begin{aligned}
 \Gamma_K(\Delta_K)
 &:=
 \|\Delta_K^{-1}G_K\Delta_K^{-1}\|\\
 &\leq C\|\Delta_K^{-1}\|
 =C\|WD^{-1/2}\|^2.                                         \tag{3.4}
\end{aligned}
\]

The least possible constant in (3.2) is exactly

\[
 C_{\min}=\|SWD^{-1/2}\|^2.                                 \tag{3.5}
\]

In fact the three Loewner statements are equivalent on \(K\):

\[
 W^*G_KW\preceq CD
 \Longleftrightarrow
 A^*G_KA\preceq CI
 \Longleftrightarrow
 G_K\preceq C\Delta_K.                                      \tag{3.6}
\]

Also
\[
 \Gamma_K(\Delta_K)=\|S\Delta_K^{-1}\|^2.                   \tag{3.7}
\]

Equations (3.3)--(3.7) use only a largest singular value. By contrast,
orthonormalizing the physical columns first introduces a smallest singular
value of \(W\); that loss belongs to the chosen coordinate route, not to the
positive sampling problem itself.

## 4. Exact forcing and shifted action

Let \(c\in K\) satisfy the positive rank-one forcing inequality

\[
 cc^*\preceq\epsilon G_K,\qquad \epsilon\geq0.               \tag{4.1}
\]

This is the form supplied by the complete radical-remainder estimate, with
\(c=ab\) in the notation of the weak-residual note.

**Theorem 2 (left-close action).** If an operator \(B\) on \(K\) satisfies

\[
 \rho=\|\Delta_K^{-1}(B-\Delta_K)\|<1,                       \tag{4.2}
\]

then

\[
\boxed{
 \|B^{-1}c\|
 \leq {\sqrt{\epsilon C}\,\|WD^{-1/2}\|\over1-\rho}.}        \tag{4.3}
\]

Indeed,

\[
 B=\Delta_K\left[I+\Delta_K^{-1}(B-\Delta_K)\right],         \tag{4.4}
\]

so the bracket has inverse norm at most \((1-\rho)^{-1}\). Equations
(4.1) and (3.4) give

\[
 \|\Delta_K^{-1}c\|^2
 \leq\epsilon\Gamma_K(\Delta_K)
 \leq\epsilon C\|WD^{-1/2}\|^2.                             \tag{4.5}
\]

No self-adjointness of \(B\) is needed for this left-close statement.

There is also a one-sided version that is often easier to use with a Schur
comparison.

**Theorem 3 (dominating action).** If \(B=B^*\) and

\[
 B\succeq\mu\Delta_K>0,\qquad \mu>0,                         \tag{4.6}
\]

then

\[
\boxed{
 \|B^{-1}c\|
 \leq {\sqrt{\epsilon C}\,\|WD^{-1/2}\|\over\mu}.}           \tag{4.7}
\]

To see this, set \(H=\Delta_K^{-1/2}B\Delta_K^{-1/2}\). Then
\(H\succeq\mu I\), while (4.1) and (3.3) give
\(\|\Delta_K^{-1/2}c\|\leq\sqrt{\epsilon C}\). The factorization
\(B^{-1}=\Delta_K^{-1/2}H^{-1}\Delta_K^{-1/2}\), followed by
\(\|\Delta_K^{-1/2}\|=\|WD^{-1/2}\|\), proves (4.7).

The tempting vector-norm shortcut
\(\|B^{-1}c\|\leq\mu^{-1}\|\Delta_K^{-1}c\|\) is false for
noncommuting \(B\) and \(\Delta_K\); only the symmetrically scaled proof above
is valid.

The constants in (3.4), (4.3), and (4.7) are already sharp in dimension
one.

## 5. Orthogonal low/high extension

Let the physical complement split orthogonally as

\[
 K=K_L\oplus K_H.                                            \tag{5.1}
\]

On \(K_L\), use the quotient construction with \(D_L\), \(W_L\), and a
source-coordinate sampling constant \(C_L\). On \(K_H\), use \(gI\) with
\(g>0\) and suppose

\[
 \|S|_{K_H}\|^2\leq B_H.                                    \tag{5.2}
\]

Put

\[
 \Delta=\Delta_L\oplus gI.                                  \tag{5.3}
\]

The row-operator identity, with all low/high sampling cross terms retained,
gives

\[
\begin{aligned}
 \|S\Delta^{-1/2}\|^2
 &\leq C_L+{B_H\over g},                                    \tag{5.4}\\
 \|\Delta^{-1}\|
 &=\max\left\{\|W_LD_L^{-1/2}\|^2,{1\over g}\right\}.        \tag{5.5}
\end{aligned}
\]

Therefore

\[
\boxed{
 \Gamma_K(\Delta)
 \leq\left(C_L+{B_H\over g}\right)
 \max\left\{\|W_LD_L^{-1/2}\|^2,{1\over g}\right\}.}         \tag{5.6}
\]

If the cross-aware norm \(C_{\rm global}=\|S\Delta^{-1/2}\|^2\) is
available, it replaces the sum in (5.4)--(5.6). Replacing the sum by the
maximum of the two diagonal constants is invalid in general because the
same sampling row can see both blocks.

For the action estimate there is a sharper blockwise bound. Since
\(\Gamma_K(\Delta)=\|S\Delta^{-1}\|^2\), the same row-operator argument
applied after the full inverse gives

\[
\boxed{
 \Gamma_K(\Delta)
 \leq C_L\|W_LD_L^{-1/2}\|^2+{B_H\over g^2}.}                \tag{5.7}
\]

This improves (5.6) whenever the largest inverse scale and the largest
sampling constant occur in different blocks. It still retains all sampling
cross terms: the sum bounds the norm of the complete row operator, whereas
the invalid shortcut would replace that sum by a maximum.

The action conclusions (4.3) and (4.7) apply verbatim to (5.3). All signed
low/high couplings must still be included in the full left-close hypothesis
or in the full Loewner domination; neither (5.6) nor (5.7) is a
signed-sector theorem. In particular, a comparison for the compression
\(P_{K_L}BP_{K_L}\) does not control \(P_{K_L}B^{-1}c\) unless \(K_L\)
reduces \(B\); otherwise the complete low/high coupling must be certified.

Likewise, modewise diagonal sample bounds do not imply (3.2). For
\(W=D=I_r\) and \(S=[1,\ldots,1]\), every individual source column has
sample norm one, but \(W^*S^*SW\) has top eigenvalue \(r\). The full source
Gram, including its cross terms, is mandatory.

## 6. Application to the prolate radical family

Let \(C_+\) be the exact plus source-column matrix after anchor deflation. In
the raw orthonormal prolate basis the uncorrected exterior concentration form
is

\[
 D_+^{\rm ext}
 =C_+^*\operatorname {diag}(d_n)C_+
 =D_T+d_4\alpha\alpha^*+d_0bb^*.                            \tag{6.1}
\]

Let \(W_+\) synthesize the projected physical columns. Apply the locked
state-invisible origin correction before forming the global radical
synthesis \(L_+\), and put

\[
 Y_+=(I-P_NC_\lambda)L_+.                                   \tag{6.2}
\]

If \(Z\) is the two-evaluation zero-sampling analysis map, exact two-sided
radicality gives

\[
 ZL_+=0,\qquad ZW_+=-ZY_+.                                  \tag{6.3}
\]

Thus the physical positive sampling Gram has the exact source-coordinate
representation

\[
 W_+^*G_+W_+=Y_+^*Z^*ZY_+.                                 \tag{6.4}
\]

The positive-sampling/action side is therefore reduced to the two estimates

\[
\boxed{
 Y_+^*Z^*ZY_+\preceq C_{\rm ext}D_+^{\rm ext},}              \tag{6.5}
\]

and

\[
\boxed{
 C_{\rm ext}\,
 \|W_+(D_+^{\rm ext})^{-1/2}\|^2
 =O(d_8^{-1})}                                               \tag{6.6}
\]

on the chosen schedule. Equations (3.3)--(3.4) then give the exact global
alignment target without any lower physical Gram determinant.

The compact-BV theorem does not prove (6.5)--(6.6) at the required scale.
Its strongest unconditional full-cross-term insertion is now quantified in
`notes/FULL_EXTERIOR_SAMPLING_FALLBACK.md`; it gives only

\[
 C_{\rm ext}\leq B_{\rm abs}
 \|W_+(D_+^{\rm ext})^{-1/2}\|^2,                            \tag{6.7}
\]

which squares the inverse-defect factor in (3.4) and reproduces the loss
already isolated in the weak-residual note.  With the pinned all-index floor,
this becomes

\[
 C_{\rm ext}\|W_+(D_+^{\rm ext})^{-1/2}\|^2
 \le {B_{\rm abs}\lambda^4\over4d_{\rm LS}^2},             \tag{6.8}
\]

which is exponentially too large for (6.6). The corrected invisible bump
also changes the global exterior synthesis and must remain inside \(Y_+\);
the uncorrected additive Gram in (6.1) cannot simply be declared equal to a
corrected remainder norm.

Finally, (6.5)--(6.6) address only the forcing orientation. The shifted even
comparison with the quotient preconditioner, the full odd-sector comparison
including its negative rank-one pole, and the high-complement sampling bound
in (5.2) remain independent obligations.

## 7. Exact regression model

The producer and independent verifier use the rank-deficient exact model

\[
 D=\operatorname {diag}(1,4,9),\qquad
 W=\begin{bmatrix}1&0&1\\0&1&0\end{bmatrix},\qquad
 S=\begin{bmatrix}1&1\end{bmatrix}.                          \tag{7.1}
\]

Here \(\ker W=\operatorname {span}\{(-1,0,1)\}\) but

\[
 \Delta=\operatorname {diag}(9/10,4),\qquad
 C_{\min}=49/36,\qquad
 \lambda_{\min}(\Delta)=9/10.                               \tag{7.2}
\]

This regression rejects any implementation that demands source
injectivity, uses an ordinary inverse on the source kernel, trusts a cached
quotient matrix, drops low/high sampling cross terms, or promotes the
terminal state.
