# Regularized moment Schur floor: determinant pencil and spectral-angle profile

## 0. Scope and outcome

This note attacks the remaining low term in
`FIXED_WINDOW_EVEN_MOMENT_SOFT_TRACE_REDUCTION.md`.  It gives an exact
finite reduction, but it does not prove the required actual-source
asymptotic floor.

On the inversion-even anchor complement, put

\[
 B=A-qI>0,\qquad r=\|b\|>0,\qquad
 S_r=r(B+rI)^{-1}.                                      \tag{0.1}
\]

Let \(V_m\) be the range of the first \(m\) projected even physical
moments, let \(P_m\) be its orthogonal projection, and let \(C_{r,m}\) be
the complete Schur complement of \(B+rI\) to \(V_m\).  If \(U_m\) is any
injective synthesis onto \(V_m\), define

\[
 G_m=U_m^*U_m,\qquad
 R_{r,m}=U_m^*(B+rI)^{-1}U_m.                           \tag{0.2}
\]

Then the exact floor is

\[
 \boxed{
 c_{r,m}:=\lambda_{\min}(C_{r,m})
 ={1\over
 \|G_m^{-1/2}R_{r,m}G_m^{-1/2}\|}.}                   \tag{0.3}
\]

Moreover,

\[
 \boxed{
 \det(C_{r,m}-zI)
 ={\det(G_m-zR_{r,m})\over\det R_{r,m}}.}              \tag{0.4}
\]

Thus the regularized moment floor is the least generalized root of one
source-reconstructible determinant pencil.  It is also exactly a
low-spectral-layer angle.  With

\[
 E_u={\bf1}_{(0,u]}(B),\qquad
 \eta_m(u)=\|E_uP_m\|^2,                                \tag{0.5}
\]

one has, for every \(u>0\),

\[
 \boxed{
 {r\over u+r}\eta_m(u)
 \leq {r\over c_{r,m}}
 \leq {r\over u+r}+{u\over u+r}\eta_m(u).}            \tag{0.6}
\]

Consequently, on the admitted choice \(m=\lceil LT\rceil\), a sufficient
actual-source estimate is

\[
 \eta_m(u_L)+{r\over u_L}=o(L^{-5/2})                  \tag{0.7}
\]

for one declared positive threshold \(u_L\).  Conversely, decay of
\(r/c_{r,m}\) forces the moment range to become orthogonal to every
spectral layer at height comparable to \(r\).  None of the existing
full-source coframe, matched-source coframe, complete high-moment, or
rank-two commutator estimates controls (0.5).

An exact source-Cauchy structural family below has a simple even ground,
inversion symmetry, the source displacement form, arbitrarily small
residual, and a nonzero moment range, while \(r/c_{r,m}\) tends to one.
This proves that the generic lower bound \(C_{r,m}\succeq rI\) is sharp
under those structural inputs.  The family is not the arithmetic Weil
matrix and supplies no counterexample to an arithmetic floor.  The actual
angle profile (0.5) remains unresolved, and the formal state remains
`P0_INVALIDATED`.

Every actual-source formula below keeps Lebesgue measure on the logarithmic
interval, zero extension, reflection, the Fourier sign \(e^{-itx}\), the
source-normalized anchor, every prime power \(n\leq\lambda^2\), and the
minus sign on the prime block.  No separate absolute pole,
archimedean, or prime operator is substituted for the combined operator.

## 1. Locked finite setting and the rank quotient

Put

\[
 L=2\log\lambda,\qquad I_\lambda=[-L/2,L/2],\qquad
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx.       \tag{1.1}
\]

The exact combined complement operator may be written, for every declared
\(g>0\), as

\[
 B=gI_{\mathcal K}+P_{\mathcal K}T_aP_{\mathcal K}
 +2|P_{\mathcal K}p_+\rangle\langle P_{\mathcal K}p_+|
 -P_{\mathcal K}T_vP_{\mathcal K},                    \tag{1.2}
\]

where the positive parts are taken only after forming

\[
 m_\lambda(t)-q
 =2\theta'(t)-q
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                 \tag{1.3}
\]

For \(0\leq j<m\), let

\[
 u_j=P_{\mathcal K}(x^{2j}),\qquad
 V_m=\operatorname {span}\{u_0,\ldots,u_{m-1}\}.       \tag{1.4}
\]

Some displayed moments may be dependent after anchor deflation.  Put
\(d_m=\dim V_m\).  If \(d_m=0\), the low trace is zero and there is no
floor to estimate.  Otherwise choose any basis of \(V_m\) from the moment
columns and let

\[
 U:\mathbb C^{d_m}\longrightarrow\mathcal K           \tag{1.5}
\]

be its injective synthesis.  The matrices

\[
 G=U^*U>0,\qquad R=U^*(B+rI)^{-1}U>0                   \tag{1.6}
\]

are the Gram and resolvent-moment matrices.  Replacing the selected basis
by \(US\), with \(S\) invertible, sends both matrices to \(S^*GS\) and
\(S^*RS\).  Every criterion below is therefore a statement about the
moment range, not about the conditioning or scaling of raw monomials.

## 2. Exact resolvent and determinant-pencil theorem

Let

\[
 W=UG^{-1/2}.                                           \tag{2.1}
\]

Then \(W^*W=I\), \(WW^*=P_m\), and block inversion for \(B+rI\)
gives

\[
 C_{r,m}^{-1}=P_m(B+rI)^{-1}P_m\big|_{V_m}.             \tag{2.2}
\]

### Theorem 2.1 (Gram-whitened moment resolvent)

With

\[
 \mathcal R=G^{-1/2}RG^{-1/2}>0,                       \tag{2.3}
\]

one has

\[
 \boxed{
 C_{r,m}^{-1}=W\mathcal RW^*,\qquad
 C_{r,m}=W\mathcal R^{-1}W^*.}                         \tag{2.4}
\]

Consequently,

\[
 \boxed{U^*C_{r,m}U=GR^{-1}G,}                         \tag{2.5}
\]

\[
 \boxed{
 c_{r,m}=\|\mathcal R\|^{-1},\qquad
 C_{r,m}\succeq\gamma I_{V_m}
 \Longleftrightarrow G-\gamma R\succeq0}              \tag{2.6}
\]

for every \(\gamma>0\), and

\[
 \boxed{
 \det(C_{r,m}-zI_{V_m})
 ={\det(G-zR)\over\det R},\qquad
 \det C_{r,m}={\det G\over\det R}.}                  \tag{2.7}
\]

**Proof.**  Inserting \(P_m=WW^*\) into (2.2) gives

\[
 P_m(B+rI)^{-1}P_m
 =W\{W^*(B+rI)^{-1}W\}W^*
 =W\mathcal RW^*.
\]

Inversion on \(V_m\) proves (2.4), and congruence by
\(U=WG^{1/2}\) proves (2.5).  The norm and order statements in (2.6)
follow from (2.4).  Finally,

\[
 \det(\mathcal R^{-1}-zI)
 ={\det G\over\det R}
   \det(I-zG^{-1/2}RG^{-1/2})
 ={\det(G-zR)\over\det R},
\]

which proves (2.7).  \(\square\)

The best floor is therefore the least positive generalized eigenvalue of
the Hermitian pencil \(G-zR\).  A strict proposed floor can be checked by
Sylvester's criterion after choosing an ordered independent moment basis;
a non-strict floor requires all principal minors or an equivalent rigorous
positive-semidefinite certificate.  A raw monomial determinant without
the Gram matrix is not invariant and is not a floor certificate.

There is also an exact determinant lower bound.  Since a Schur complement
is no larger than its raw diagonal block,

\[
 C_{r,m}\preceq P_m(B+rI)P_m
 \preceq(\|B\|+r)I_{V_m}.                              \tag{2.8}
\]

Thus

\[
 \boxed{
 c_{r,m}\geq
 {\det G\over
  \det R\,(\|B\|+r)^{d_m-1}}.}                        \tag{2.9}
\]

On the Gevrey schedule, (2.9) turns the desired subexponential floor into
an explicit determinant-ratio target.  No current theorem bounds that
ratio at the required scale.

For independent reconstruction, if \(M=B+rI\), then

\[
 \boxed{
 R={1\over\det M}\,U^*\operatorname {adj}(M)U.}        \tag{2.10}
\]

Thus (2.6)--(2.10) require no stored eigenvalue or eigenvector.  The entries
of \(M\) are reconstructed from the complete source formula (1.2)--(1.3),
and the moment columns are reconstructed from the interval and anchor.

For nested independent moment lists, (2.7) also gives

\[
 {\det C_{r,j}\over\det C_{r,j-1}}
 ={\det G_j\,\det R_{j-1}
   \over\det G_{j-1}\,\det R_j}.                       \tag{2.11}
\]

This is the exact determinant-pivot recursion.  It is not a scalar Jacobi
continued fraction: the physical moments are not a Krylov chain for \(B\),
and the source rank-two commutator does not supply a three-term closure for
them.  Declaring such a closure would add an unproved hypothesis.

## 3. Exact low-spectral angle profile

Multiplying (2.2) by \(r\) proves the especially simple identity

\[
 \boxed{
 {r\over c_{r,m}}
 =\|W^*S_rW\|
 =\|P_mS_rP_m\|.}                                     \tag{3.1}
\]

Thus the scalar floor is not controlled merely by the eigenvalues of
\(B\), the dimension of \(V_m\), or an unrelated source coframe.  It is
the worst residual-ridged spectral mass seen by the declared moment range.

Let \(E_u={\bf1}_{(0,u]}(B)\).  Spectral calculus gives the operator-valued
profile

\[
 \boxed{
 W^*S_rW
 =\int_0^\infty {r\over(u+r)^2}\,W^*E_uW\,du.}         \tag{3.2}
\]

Because \(W\) is an isometry,

\[
 \eta_m(u):=\|W^*E_uW\|
 =\|E_uW\|^2=\|E_uP_m\|^2.                             \tag{3.3}
\]

### Theorem 3.1 (sharp two-layer angle bounds)

For every \(u>0\),

\[
 \boxed{
 {r\over u+r}\eta_m(u)
 \leq {r\over c_{r,m}}
 \leq {r\over u+r}+{u\over u+r}\eta_m(u).}            \tag{3.4}
\]

**Proof.**  For every \(\beta>0\), with \(t=r/(u+r)\),

\[
 t\,{\bf1}_{(0,u]}(\beta)
 \leq {r\over\beta+r}
 \leq t+(1-t){\bf1}_{(0,u]}(\beta).                   \tag{3.5}
\]

Apply finite spectral calculus, compress by \(W\), and take operator norms.
All matrices are positive, so order is preserved.  Equations (3.1) and
(3.3) give (3.4).  \(\square\)

The constants in (3.4) are optimal for information consisting only of one
threshold angle: scalar spectral measures concentrated immediately below
or immediately above \(u\) approach the two endpoints.

For \(m=\lceil LT\rceil\), equation (3.4) proves the sufficient condition

\[
 \boxed{
 \eta_m(u_L)+{r\over u_L}=o(L^{-5/2})}                 \tag{3.6}
\]

for the scalar-floor target in the fixed-window note.  In the other
direction,

\[
 \boxed{
 \eta_m(u)\leq {u+r\over r}\,{r\over c_{r,m}}.}        \tag{3.7}
\]

Hence the desired decay forces
\(\eta_m(\alpha r)=o(L^{-5/2})\) for every fixed
\(\alpha>0\).  The missing theorem is therefore a uniform principal-angle
estimate between the growing even-moment space and the low spectral layers
of the complete signed \(B\).

## 4. What regularization gives without arithmetic input

Write the unregularized block decomposition of \(B\) relative to
\(V_m\oplus V_m^\perp\).  Since \(B>0\), its unregularized Schur complement
\(C_{0,m}\) exists.  Direct subtraction gives

\[
\begin{aligned}
 C_{r,m}={}&C_{0,m}+rI_{V_m}\\
 &+B_{PH}\{B_{HH}^{-1}-(B_{HH}+rI)^{-1}\}B_{HP}.
                                                               \tag{4.1}
\end{aligned}
\]

Therefore

\[
 \boxed{C_{r,m}\succeq C_{0,m}+rI_{V_m}\succeq rI_{V_m}.}
                                                               \tag{4.2}
\]

Differentiation gives the exact monotonicity formula

\[
 {d\over dr}C_{r,m}
 =I_{V_m}+B_{PH}(B_{HH}+rI)^{-2}B_{HP}\succeq I_{V_m}. \tag{4.3}
\]

These facts explain the generic bound \(r/c_{r,m}\leq1\), but they do not
give decay.  The next family shows that no stronger conclusion follows
from the displayed structural data alone.

## 5. Sharp source-Cauchy structural family

Fix \(N\geq2\), positive integers \(a>b\), and \(\varepsilon>0\).  In the
source modes \(V_n\), \(-N\leq n\leq N\), define one complete matrix by

\[
 QV_0=0,\qquad
 QV_{\pm1}=(a^2+b^2)\varepsilon V_{\pm1},\qquad
 QV_{\pm n}=a^2\varepsilon V_{\pm n}\quad(2\leq n\leq N).
                                                               \tag{5.1}
\]

This is exact source-Cauchy algebra: take every displacement coefficient
\(b_n=0\), take the diagonal coefficients from (5.1), and then

\[
 Q_{nm}={b_n-b_m\over n-m}=0\quad(n\ne m),qquad
 a_{-n}=a_n,\quad b_{-n}=-b_n.                         \tag{5.2}
\]

It commutes with inversion, and its source commutator is exactly
\([M,Q]=0\), the rank-two formula with \(\beta=0\).  Its unique global
ground vector is the inversion-even \(V_0\), whose endpoint pairing is
nonzero.

In the normalized even basis put

\[
 e_1^+={V_1+V_{-1}\over\sqrt2},\qquad
 \kappa={aV_0+be_1^+\over\sqrt{a^2+b^2}},\qquad
 w={-bV_0+ae_1^+\over\sqrt{a^2+b^2}}.                  \tag{5.3}
\]

Let \(\mathcal H_+\) be the inversion-even sector and set

\[
 \mathcal K_+=\mathcal H_+\cap\kappa^\perp.            \tag{5.3a}
\]

The Rayleigh scalar, residual, and complement are exactly

\[
 q=b^2\varepsilon,\qquad
 \|(Q-qI)\kappa\|=r=ab\varepsilon,                    \tag{5.4}
\]

\[
 P_{\mathcal K_+}(Q-qI)P_{\mathcal K_+}
 =(a^2-b^2)\varepsilon I_{\mathcal K_+}.              \tag{5.5}
\]

Writing
\(\mathbf b_{\rm res}=P_{\mathcal K_+}(Q-qI)\kappa\),
the fixed-point identity is also exact: the true ground displacement is
\(h=q\), and

\[
 \langle\mathbf b_{\rm res},(B+hI)^{-1}
              \mathbf b_{\rm res}\rangle
 ={a^2b^2\varepsilon^2\over a^2\varepsilon}
 =b^2\varepsilon=h.                                    \tag{5.6}
\]

The zeroth physical moment is nonzero after anchor deflation because

\[
 P_{\mathcal K_+}V_0=-{b\over\sqrt{a^2+b^2}}w\ne0.    \tag{5.7}
\]

Hence every moment range with \(m\geq1\) is nonzero.  Since (5.5) is
scalar on \(\mathcal K_+\), all subsequent moment spaces and Schur
complements in this model are understood inside that even-sector anchor
complement.  All their low--high cross terms vanish, and

\[
 \boxed{
 C_{r,m}=(a^2-b^2+ab)\varepsilon I_{V_m},\qquad
 {r\over c_{r,m}}
 ={ab\over a^2-b^2+ab}.}                               \tag{5.8}
\]

Taking \(a=k+1\), \(b=k\) gives

\[
 {r\over c_{r,m}}
 ={k(k+1)\over k^2+3k+1}\longrightarrow1.             \tag{5.9}
\]

The scale \(\varepsilon\) may tend to zero at any prescribed rate, so an
exponentially small residual does not change (5.8).  This family retains
the complete matrix before any absolute-value split and works for every
\(N\) and every nonzero projected moment range.  It is deliberately a
structural source-Cauchy model, not the matrix obtained from the pinned
pole, gamma, and prime-power formula.  Its only conclusion is the sharp
non-implication: source Cauchy form, inversion, a simple even ground,
boundary nonvanishing, positivity of \(B\), and residual decay do not prove
a useful regularized moment floor.

## 6. Audit of the cited mechanisms and exact remaining datum

The preceding identities locate why the current tools stop.

1. `PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md` gives an exact factorization of
   \(C_{r,m}\), but a quantitative residual-negative-feature contraction
   margin in that factorization is equivalent to a lower bound for the same
   pencil \(G-zR\).
2. `LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR.md` and
   `MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md` control high compressions,
   signed trace moments, or source-coordinate frames.  They do not bound
   the inverse moment matrix \(R\) in (1.6).
3. `FULL_SOURCE_COFRAME_RANK_THEOREM.md` controls the row frame of the
   arithmetic source map.  The angle in (3.3) is instead between a physical
   polynomial range and a low spectral subspace of \(B\); neither frame
   contains the other.
4. The source commutator controls derivative/Krylov directions and endpoint
   jets.  The family in Section 5 satisfies that algebra exactly while its
   moment floor remains at the residual scale.  No moment-space closure
   follows from the commutator.

On the admitted Gevrey schedule

\[
 N=\lceil\lambda L^3\rceil,\qquad m=\lceil LT\rceil,   \tag{6.1}
\]

the exact remaining actual-source quantity can be stated in either of two
equivalent ways:

\[
 \left\|G_m^{-1/2}U^*(B+rI)^{-1}UG_m^{-1/2}\right\|
 =o(r^{-1}L^{-5/2}),                                    \tag{6.2}
\]

or a threshold profile satisfying (3.6).  A determinant route may instead
prove a sufficiently strong lower bound in (2.9).  Each route must use the
combined source matrix with the pole, archimedean term, and inclusive
minus-prime block still coupled.  No such source estimate is currently
proved.
