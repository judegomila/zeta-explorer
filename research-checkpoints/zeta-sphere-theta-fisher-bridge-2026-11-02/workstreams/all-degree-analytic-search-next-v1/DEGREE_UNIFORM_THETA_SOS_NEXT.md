# Degree-uniform Schur transfer for the theta Sobolev auxiliary

## Scope and outcome

This note asks whether the proved low-rung complete-theta Sobolev
inequalities can propagate under multiplication of a residual by
`t^2-c`.  It keeps the two-generator correlations intact and does not infer
an induction from the known base cases.

There are five conclusions.

1.  The two-generator margin is the difference of two norms of a compressed
    weighted derivative adjoint.  This gives a division-free operator form
    of the exact correlated inequality.
2.  Under `q -> (t^2-c)q`, the three relevant vectors obey an exact
    multiplication-transfer law.  The new five scalars are explicit
    quadratics in `c`, but the transfer introduces the next multiplication
    layer.  Its leading term is the old margin, exactly as observed in the
    first two odd rungs.
3.  For a monic degree-`kappa` residual, the denominator-free numerator is
    affine in the single newest positive moment
    `mu_(kappa+1)=integral t^(2kappa+2)W^2`.  Its coefficient is adverse in
    the unresolved branch `A^2>B^2` (and favorable when `A^2<B^2`).  In the
    unresolved branch, the auxiliary condition is an exact **upper Schur
    cap** on that newest moment.
4.  Ordinary positive-moment/Hankel/J-fraction geometry supplies the
    opposite lower Schur bound and no upper bound.  A source-free SOS
    propagation is also impossible: the exact positive-Gaussian
    countermodel in `NEXT_ODD_PARITY_INDUCTION_NEXT.md` has a positive old
    margin and a negative next margin at its actual residual coefficient.
5.  Thus a viable degree-uniform theta theorem has one precise form: prove
    the reverse Schur cap from complete Jacobi-orbit arithmetic at every
    actual residual, or control the equivalent infinite multiplication
    tower before projecting.  No fixed finite Gram state or generic
    continued fraction closes the hierarchy.

These are an exact reduction and route obstruction, not a proof of the
all-degree cap, a first Xi--Laguerre inequality, or RH.

## 1. The compressed weighted-adjoint form

Put

\[
 w(t)=W(t)^2,
 \qquad \langle f,g\rangle=\int_{\mathbb R}f(t)g(t)\,dt.
\]

Assume that `W` is real, nonzero, sufficiently smooth, and Schwartz, as for
the complete theta profile, and let `q` be a nonconstant real polynomial.
Work division-free with the three ordinary `L^2(dt)` functions

\[
 a_q=q'W,\qquad b_q=tqW,\qquad
 s_q=-q'W-2qW'.                                      \tag{1}
\]

The last function is `(D_w^*q)W`, where formally

\[
 D_w^*=-{d\over dt}-2{W'\over W},
\]

but no quotient by `W` is used in (1).  Retain the five positive-weight
scalars

\[
\begin{aligned}
 A&=\int q'^2w,&B&=\int qq''w,\\
 C&=\int q^2w,&D&=\int t^2q^2w,&E&=\int tqq'w.
\end{aligned}                                             \tag{2}
\]

Integration by parts gives

\[
 \langle s_q,a_q\rangle=B,
 \qquad \langle s_q,b_q\rangle=C+E.             \tag{3}
\]

Let `U_q=span{a_q,b_q}`.  Its Gram matrix is

\[
 K_q=\begin{pmatrix}A&E\\E&D\end{pmatrix},
 \qquad \Delta_q=AD-E^2>0.                       \tag{4}
\]

Strictness follows because `q'` and `tq` cannot be proportional as
polynomials and `W^2` is positive on a set of positive measure.

The exact two-generator remainder and the exact target pivot are

\[
\boxed{
 4\mathcal H[q]
 =\|P_{U_q}s_q\|_2^2-\|a_q\|_2^2,}              \tag{5}
\]

and

\[
\boxed{
 8\pi\mathcal S[q]
 =\|s_q\|_2^2-\|a_q\|_2^2.}                    \tag{6}
\]

Indeed (3)--(4) make the first norm in (5)
`(B,C+E)K_q^(-1)(B,C+E)^T`, while expanding (6) gives the
Sobolev identity.  Consequently

\[
 2\pi\mathcal S[q]-\mathcal H[q]
 ={1\over4}\|(I-P_{U_q})s_q\|_2^2\ge0.          \tag{7}
\]

This is the weighted creation/annihilation interpretation of the correlated
criterion: the compression of the derivative adjoint onto the two tangent
directions must be expansive relative to the ordinary derivative.

## 2. Exact trial transfer under one quadratic factor

Let

\[
 f_c(t)=t^2-c,\qquad q_c=f_cq,
 \qquad M:g(t)\mapsto t^2g(t).                  \tag{8}
\]

This is an exact **trial-family** transfer.  It is the actual passage from
`q=t` to the next odd residual `t(t^2-c)` in the first low-rung case.  At a
general rung, actual signed orthogonal residuals are not nested by a single
factor: when the requisite prefixes are positive they obey a three-term
recurrence

\[
 q_{N+1}=(t^2-\alpha_N)q_N-\beta_Nq_{N-1},       \tag{8a}
\]

with the appropriate parity normalization.  Thus (9)--(14) diagnose the
multiplicative component of a possible induction; they are not asserted to
be the actual all-degree residual recurrence.

The three division-free vectors in (1) obey

\[
\boxed{
\begin{aligned}
 a_{q_c}&=(M-c)a_q+2b_q,\\
 b_{q_c}&=(M-c)b_q,\\
 s_{q_c}&=(M-c)s_q-2b_q.
\end{aligned}}                                  \tag{9}
\]

Thus the exact new condition is

\[
\boxed{
\begin{aligned}
4\mathcal H[q_c]
={}&\left\|P_{\operatorname {span}{(M-c)a_q+2b_q,
                                     (M-c)b_q\}}
          \{(M-c)s_q-2b_q\}\right\|_2^2\\
&-\|(M-c)a_q+2b_q\|_2^2.
\end{aligned}}                                  \tag{10}
\]

Formula (10) retains the whole deformed angle.  Projecting or estimating
its three components separately destroys the transfer correlation.

For a scalar replay, define

\[
\begin{aligned}
 A_j&=\int t^{2j}q'^2w,&
 B_j&=\int t^{2j}qq''w,\\
 C_j&=\int t^{2j}q^2w,&
 E_j&=\int t^{2j+1}qq'w.
\end{aligned}                                             \tag{11}
\]

The old five scalars are `(A_0,B_0,C_0,C_1,E_0)`.  Direct expansion of
(9) gives the new ones without any omitted cross term:

\[
\boxed{
\begin{aligned}
 A[c]={}&A_2-2cA_1+c^2A_0+4E_1-4cE_0+4C_1,\\
 B[c]={}&B_2-2cB_1+c^2B_0+4E_1-4cE_0+2C_1-2cC_0,\\
 C[c]={}&C_2-2cC_1+c^2C_0,\\
 D[c]={}&C_3-2cC_2+c^2C_1,\\
 E[c]={}&E_2-2cE_1+c^2E_0+2C_2-2cC_1.
\end{aligned}}                                             \tag{12}
\]

If

\[
 \mathcal F[q]
 =\{AC+E(A-B)\}^2-(AD-E^2)(A^2-B^2),            \tag{13}
\]

then (12) immediately yields

\[
 \boxed{
 \mathcal F[q_c]=c^8\mathcal F[q]+O(c^7),
 \qquad
 \mathcal H[q_c]=c^2\mathcal H[q]+O(c).}        \tag{14}
\]

The inherited old margin is therefore only the escape form at
`|c|=infinity`.  The finite-`c` interior uses `A_1,A_2,B_1,B_2,C_2,C_3,
E_1,E_2`, none of which is determined by the old five-scalar margin.

## 3. The newest positive moment is an affine adverse direction

Let `q` be monic of degree `kappa` and set

\[
 \mu_j=\int_{\mathbb R}t^{2j}W(t)^2dt.           \tag{15}
\]

The quantities `A,B,C,E` depend only on
`mu_0,...,mu_kappa`.  The remaining scalar has the form

\[
 D=\mu_{\kappa+1}+\overline D,                  \tag{16}
\]

where `overline D` uses only the lower moments and the nonleading
coefficients of `q`.

Put

\[
 G=A^2-B^2,qquad
 R=AC+E(A-B),qquad
 \overline\Delta=A\overline D-E^2.              \tag{17}
\]

Then the denominator-free numerator is exactly affine in the newest
positive moment:

\[
\boxed{
 \mathcal F[q]
 =R^2-\overline\Delta G-A G\mu_{\kappa+1}.}     \tag{18}
\]

There are two branches.

- If `G<=0`, then `mathcal F[q]=R^2-Delta_q G>=0` automatically.
- If `G>0`, the exact two-generator obligation is the upper cap

  \[
  \boxed{
  \mu_{\kappa+1}
  \le {R^2-\overline\Delta G\over A G}.}         \tag{19}
  \]

Equivalently, without separating the leading monomial from `D`,

\[
\boxed{
 {E^2\over A}<D
 \le {E^2\over A}+{R^2\over A(A^2-B^2)}.}       \tag{20}
\]

The strict lower inequality in (20) is ordinary Gram positivity
`Delta_q>0`.  The upper inequality is precisely the new theta information.

The same formula follows by orthogonalizing `b_q` against `a_q`.  Put

\[
 b_q^\perp=b_q-{E\over A}a_q,
 \quad V=\|b_q^\perp\|^2=D-{E^2\over A},
 \quad R_0=C+E-{EB\over A}={R\over A}.          \tag{21}
\]

Then

\[
\boxed{
 4\mathcal H[q]
 ={B^2-A^2\over A}+{R_0^2\over V}.}             \tag{22}
\]

In the unresolved branch `|B|<A`, condition (22) is the reverse-correlation
bound

\[
 \boxed{
 V\le {A R_0^2\over A^2-B^2}.}                 \tag{23}
\]

Equations (19), (20), and (23) are the same degree-uniform target.  They
keep `R_0` correlated; bounding `C`, `E`, and `B` separately is not a proof
of the cap unless the interval directions are retained jointly.

In the branch `G>0`, this reverse-Schur cap is **exactly equivalent** to
`mathcal H[q]>=0`.  It is noncircular because it uses the old residual and
positive `W^2` moments, but it is a reformulation of the sufficient
two-generator auxiliary, not a weaker theorem.

As checks, for `q=t`, (19) is exactly

\[
 \mu_0\mu_2\le5\mu_1^2,                        \tag{24}
\]

the proved first-odd condition.  For `q=t(t^2-c)`, (18) is the degree-eight
polynomial certified in `NEXT_ODD_PARITY_INDUCTION_NEXT.md`; its coefficient
of `c^8` is the old gap in (24).

## 4. Why positive Hankel and continued-fraction geometry point the wrong way

The positive `W^2` moment problem gives only

\[
 D-{E^2\over A}=V>0.                              \tag{25}
\]

This is the lower Schur complement in (20).  A Stieltjes/Hamburger
continued fraction built from positive moment matrices likewise encodes
positive Schur complements and supplies no upper bound on `V`.  The required
inequality (23) is a reverse Schur estimate tied to the particular theta
source and actual residual.

This is not merely a limitation of one derivation.  The exact model

\[
 W_G(t)=e^{-t^2/2}+e^{-49t^2/2}
\]

in `NEXT_ODD_PARITY_INDUCTION_NEXT.md` has a positive physical inverse
Fourier profile, a strictly positive first-odd margin, and a positive old odd
target block, while the next two-generator margin at the actual residual
coefficient is strictly negative.  Therefore there cannot be a source-free
identity of the form

\[
 \mathcal F[(t^2-c)q]
 =c^8\mathcal F[q]+\sum_j \mathcal R_j^2          \tag{26}
\]

with nonnegative theta-independent weights on the stated positive-Fourier
class.  A theta-specific SOS using exact orbit coefficients is not ruled
out.

There is also no fixed finite multiplication state behind (9).  If a finite
dimensional subspace containing a nonzero one of `a_q,b_q,s_q` were invariant
under `M`, then some nonzero polynomial `p` would satisfy

\[
 p(t^2)g(t)=0\quad\text{a.e.}                    \tag{27}
\]

for that vector `g`.  Complete-theta profiles and polynomial multiples are
nonzero on a set of positive measure, so (27) forces `p=0`, a contradiction.
Thus every exact multiplication transfer introduces a new `M`-layer.  An
orthogonal-polynomial three-term recurrence can repackage those layers, but
its new coefficient is itself new moment data; positivity of the associated
J-fraction still gives only (25).

## 5. The surviving degree-uniform theta theorem

For each actual parity residual

\[
 q_{N,r}(t)=t^rP_N(t^2),
\]

the old signed block determines `q_(N,r)` without the newest target pivot.
All quantities in (20) also use only that residual and positive `W^2`
moments.  A noncircular uniform theorem is therefore:

\[
\boxed{
 \text{for every actual }q_{N,r},\quad
 |B|\ge A
 \quad\text{or}\quad
 D-{E^2\over A}
 \le {A\{C+E-EB/A\}^2\over A^2-B^2}.}          \tag{28}
\]

Equation (28) proves every two-generator auxiliary and hence every next
pivot.  It is one formula uniform in degree, but it is not established here.
The low-rung orbit certificates prove individual instances of its adverse
newest-moment upper cap.  The trial transfer (9)--(12), together with the
actual three-term recurrence (8a), shows what an all-degree Jacobi-orbit
proof must control: the complete correlated multiplication tower and its
`q_(N-1)` cross terms before projection, not merely the inherited leading
margin.

Two viable source-specific continuations remain.

1. Derive (23) directly from the complete positive Jacobi orbit law, keeping
   all orbit covariances and the actual residual inside `R_0`.
2. Prove a degree-uniform upper recurrence for the complete derivative norm
   `mu_(kappa+1)=2pi||psi^(kappa+1)||_2^2` whose right side is the correlated
   threshold (19), rather than a coefficientwise moment-ratio bound.

Generic Gram positivity, a positive J-fraction, or a source-free SOS cannot
supply either statement.

## Self-audit and nonclaims

- Equations (5)--(7) are obtained with the ordinary functions in (1); no
  value of `W'/W` at a zero of `W` is required.
- The five transfer formulas (12) follow by expanding
  `q_c'=(t^2-c)q'+2tq` and
  `q_c''=(t^2-c)q''+4tq'+2q`.
- The coefficient of `mu_(kappa+1)` in (18) is exactly
  `-A(A^2-B^2)` because only `D` contains that newest moment and `q` is
  monic.  It is adverse only when `A^2>B^2`.
- The automatic branch `G<=0` and the cap branch `G>0` exhaust all cases;
  `A>0` and `Delta_q>0` hold for every nonconstant polynomial residual.
- The Gaussian example refutes only a source-free SOS induction.  It is not
  a counterexample to the complete theta source.
- Equation (28) is the existing sufficient auxiliary in reverse-Schur form,
  exactly equivalent to `mathcal H>=0` in its nonautomatic branch.  It is
  not a proof of its all-degree sign, a weaker induction theorem, or an
  equivalence with RH.
