# Rayleigh self-regularization of the bounded-frequency observable

## 0. Scope and exact outcome

This note sharpens the bounded-real-frequency ground-transfer gate in
`POLYLOG_SHIFTED_SOLVE_OBSERVABLE_REDUCTION.md`.  Use the projected,
source-normalized prolate anchor itself as the Rayleigh trial vector, so the
upper shift is

\[
 U=q=\langle\kappa,Q\kappa\rangle.
\]

If the even complement and odd sector are strictly above `q`, put

\[
 B=A-qI>0,\qquad r=\|b\|.
\]

The exact ground displacement `h=q-mu` supplies its own positive resolvent
ridge.  More precisely, for every certified scalar `sigma>0` satisfying

\[
 \langle b,(B+\sigma I)^{-1}b\rangle\leq\sigma,       \tag{0.1}
\]

one has, for every bounded-frequency evaluation direction `g_t`,

\[
 \boxed{
 |\langle g_t,(A-\mu I)^{-1}b\rangle|^2
 \leq
 \sigma\langle g_t,(B+\sigma I)^{-1}g_t\rangle.}     \tag{0.2}
\]

The completely explicit choice

\[
 \boxed{\sigma=r}                                      \tag{0.3}
\]

always satisfies (0.1).  Thus the earlier sufficient product
`E_q*L_T(q)`, which contains the singular unshifted inverse twice, has the
gap-robust residual-ridged alternative

\[
 \boxed{
 a^2r\sup_{|t|\leq T}
 \langle g_t,(B+rI)^{-1}g_t\rangle\longrightarrow0.}   \tag{0.4}
\]

Here `a=||P_N k_lambda^+||` is the locked source normalization.  It is not a
unit normalization of `h_lambda`.

The strongest generic choice certified below is
`sigma=min(r,E_q)`: its bound is never worse than the old product.  The
residual-only choice (0.3) removes the unshifted inverse altogether, but it
need not dominate the old estimate in a well-conditioned complement.

Equations (0.1)--(0.4) are finite exact theorems.  They do **not** prove
(0.4) for the arithmetic source matrices, nor either required shifted
sector sign on an unbounded schedule.  A source-Cauchy countermodel below
shows that `r -> 0`, the Cauchy displacement identity, and both finite signs
do not by themselves make (0.4) tend to zero.  No zero table, global Weil
positivity, or real-axis eigenvalue extrapolation is used.  The formal
project state remains `P0_INVALIDATED`.

## 1. Locked finite setup

Put

\[
 L=2\log\lambda,\qquad I_\lambda=[-L/2,L/2],
\]

use Lebesgue measure and zero extension, and retain the source Fourier sign

\[
 \widehat v(t)=\int_{I_\lambda}v(x)e^{-itx}\,dx.       \tag{1.1}
\]

Inversion is `Jv(x)=v(-x)`.  First evenize the arithmetic state and then
project it:

\[
 p=P_Nk_\lambda^+=a\kappa,
 \qquad \|\kappa\|=1,
 \qquad a=\|P_Nk_\lambda^+\|.                         \tag{1.2}
\]

On the inversion-even sector, decompose the complete source matrix as

\[
 Q_+=
 \begin{pmatrix}q&b^*\\ b&A\end{pmatrix}
 \quad\hbox{on}\quad
 \mathbb C\kappa\oplus\mathcal K,
 \qquad \mathcal K=\kappa^\perp\cap H_+.             \tag{1.3}
\]

Every entry of (1.3) is assembled after combining the pole,
archimedean, and **minus-prime** blocks.  Every prime power at the inclusive
endpoint `n<=lambda^2` remains present.

Take the Rayleigh upper shift

\[
 U=q.                                                   \tag{1.4}
\]

Assume the two exact finite signs

\[
 B:=A-qI>0,
 \qquad Q_--qI>0.                                      \tag{1.5}
\]

They make the actual global ground value `mu` simple and inversion even.
Write

\[
 h=q-\mu\geq0,
 \qquad z=(A-\mu I)^{-1}b=(B+hI)^{-1}b.              \tag{1.6}
\]

If `b=0`, then `h=0`, `z=0`, and every assertion below is immediate.  The
nontrivial case is `b!=0`, when `h>0`.

For real `t`, let `ell_t(v)=widehat(v)(t)` on the even sector and put

\[
 g_t=P_\mathcal K\ell_t^*.
                                                               \tag{1.7}
\]

Since `z in mathcal K`, its observed correction is
`widehat(z)(t)=<g_t,z>`.

## 2. The ground equation is a self-consistent ridge

### Lemma 2.1 (Rayleigh Feshbach fixed point)

Under (1.5),

\[
 \boxed{
 h=\langle b,(B+hI)^{-1}b\rangle.}                   \tag{2.1}
\]

Moreover the right side of (2.1) is strictly decreasing in `h>=0`, so
(2.1) has exactly one nonnegative solution.

**Proof.**  The first row of
`(Q_+-mu I)(kappa-z)=0` gives

\[
 q-\mu-\langle b,(A-\mu I)^{-1}b\rangle=0,
\]

which is (2.1).  Spectral calculus for `B>0` gives strict decrease when
`b!=0`.  At zero the right side is positive, while it tends to zero as
`h` tends to infinity.  This proves existence and uniqueness. \(\square\)

Define

\[
 e(\sigma)=\langle b,(B+\sigma I)^{-1}b\rangle,
 \qquad \sigma\geq0.                                  \tag{2.2}
\]

Since `e(sigma)-sigma` is strictly decreasing and vanishes at `h`,

\[
 \boxed{
 e(\sigma)\leq\sigma
 \quad\Longleftrightarrow\quad
 \sigma\geq h.}                                      \tag{2.3}
\]

This also has an exact Schur interpretation:

\[
 e(\sigma)\leq\sigma
 \quad\Longleftrightarrow\quad
 \begin{pmatrix}
 \sigma&b^*\\ b&B+\sigma I
 \end{pmatrix}\succeq0
 \quad\Longleftrightarrow\quad
 Q_+-(q-\sigma)I\succeq0.                             \tag{2.4}
\]

Thus (0.1) is a scalar, source-reconstructible lower enclosure for the
ground value; it does not read a cached eigenvector.

### Lemma 2.2 (automatic residual ridge)

Let `r=||b||`.  Then

\[
 \boxed{h\leq r.}                                     \tag{2.5}
\]

Consequently `sigma=r` satisfies (0.1).

**Proof.**  Because `B+hI>=hI`, (2.1) gives

\[
 h\leq{\|b\|^2\over h}.
\]

Hence `h<=r`.  Equivalently,

\[
 e(r)\leq{\|b\|^2\over r}=r.
\]

\(\square\)

The old forcing energy

\[
 E_q=\langle b,B^{-1}b\rangle                         \tag{2.6}
\]

also satisfies `h<=E_q`.  One may therefore take
`sigma=min(r,E_q)` when both quantities are useful.  More generally, any
analytic upper certificate satisfying (0.1) is admissible; it need not be
one of these two generic choices.

## 3. Residual-ridged observable theorem

For `sigma>0`, define the ridged bounded-frequency leverage

\[
 \mathcal R_T(\sigma)=
 \sup_{|t|\leq T}
 \langle g_t,(B+\sigma I)^{-1}g_t\rangle.             \tag{3.1}
\]

### Theorem 3.1 (self-regularized graph bound)

If `sigma` satisfies (0.1), then

\[
 \boxed{
 \sup_{|t|\leq T}|\widehat z(t)|^2
 \leq\sigma\mathcal R_T(\sigma).}                    \tag{3.2}
\]

In particular,

\[
 \boxed{
 \sup_{|t|\leq T}|\widehat z(t)|^2
 \leq r\mathcal R_T(r).}                              \tag{3.3}
\]

**Proof.**  Cauchy--Schwarz in the positive metric `B+hI` and (2.1) give

\[
 |\langle g_t,(B+hI)^{-1}b\rangle|^2
 \leq
 h\langle g_t,(B+hI)^{-1}g_t\rangle.                 \tag{3.4}
\]

By (2.3), `sigma>=h`.  For every scalar `x>0`, the function

\[
 s\longmapsto{s\over x+s}
\]

is increasing.  Functional calculus therefore gives

\[
 h(B+hI)^{-1}\preceq
 \sigma(B+\sigma I)^{-1}.                             \tag{3.5}
\]

Equations (3.4)--(3.5) prove (3.2), and Lemma 2.2 gives (3.3). \(\square\)

The earlier unshifted graph estimate was

\[
 |\widehat z(t)|^2\leq
 E_q\langle g_t,B^{-1}g_t\rangle.                     \tag{3.6}
\]

If `sigma<=E_q`, then positivity and resolvent monotonicity show

\[
 \sigma\langle g_t,(B+\sigma I)^{-1}g_t\rangle
 \leq
 E_q\langle g_t,B^{-1}g_t\rangle.                    \tag{3.7}
\]

Thus the choice `sigma=min(r,E_q)` is never worse than (3.6), and can be
much better when `B` has a collapsing eigenvalue.  The new bound contains
no inverse of `B` if the automatic choice `sigma=r` is used.

### Corollary 3.2 (one-window determinant gate)

Consider an unbounded exact-source schedule with

\[
 \lambda_j\to\infty,
 \qquad {N_j\over L_j^2}\to\infty,                    \tag{3.8}
\]

and assume (1.5) at every sufficiently large stage.  Choose one fixed
`T>0` on which `Xi(t)>0` for `|t|<=T`.  If certified ridges `sigma_j`
satisfy (0.1) and

\[
 \boxed{
 a_j^2\sigma_j\mathcal R_{T,j}(\sigma_j)\to0,}        \tag{3.9}
\]

then the coefficient-normalized source ground transforms differ from the
projected anchor transforms uniformly on `[-T,T]`.  Hence the exact
zero-free-real-interval argument in
`POLYLOG_GROUND_TRANSFER_SOURCE_AUDIT.md` supplies the complete
inverse-square trace and locally uniform normalized determinant convergence.

The fully explicit sufficient version of (3.9) is (0.4).  This corollary is
conditional on the two signs and (3.9); neither is proved here for an
unbounded source schedule.

## 4. Exact cancellation-preserving source form

The weighted-PNT normal form is

\[
 Q_\lambda=c_*I+H_\lambda,
 \qquad
 H_\lambda=A_{\rm tail}-T_D,                           \tag{4.1}
\]

where

\[
 (T_Df)(x)=\int_{[0,L]}
 \{\widetilde f(x+s)+\widetilde f(x-s)\}\,dD_\lambda(s),
                                                               \tag{4.2}
\]

\[
 dD_\lambda(s)=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
       \delta_{\log n}(ds)-e^{s/2}\,ds.               \tag{4.3}
\]

The minus sign in `H_lambda=A_tail-T_D` is the locked minus-prime sign.
The endpoint in (4.3) is inclusive.

Put

\[
 \eta=\langle\kappa,H_\lambda\kappa\rangle.
\]

The scalar `c_*` cancels exactly from the residual and the Rayleigh-shifted
complement:

\[
 \boxed{
 b=(H_\lambda-\eta I)\kappa,\qquad
 B=P_\mathcal K(H_\lambda-\eta I)|_\mathcal K.}       \tag{4.4}
\]

In particular, `r=||b||` is the norm of the **combined residual before any
blockwise absolute values**.  The leverage in (3.1) has the exact dual form

\[
 \boxed{
 \mathcal R_T(\sigma)=
 \sup_{|t|\leq T}\ \sup_{0\ne v\in\mathcal K}
 { |\widehat v(t)|^2
  \over
    \langle v,(H_\lambda-\eta I)v\rangle
       +\sigma\|v\|^2}.}                              \tag{4.5}
\]

Thus the remaining source-specific estimate can be stated without a
separate pole, archimedean, or prime norm:

\[
 a^2r
 \sup_{|t|\leq T}\ \sup_{0\ne v\in\mathcal K}
 { |\widehat v(t)|^2
  \over
    \langle v,(A_{\rm tail}-T_D-\eta I)v\rangle
       +r\|v\|^2}
 \longrightarrow0.                                    \tag{4.6}
\]

Equation (4.6), together with the two strict signs, is an unproved
source arithmetic target.  Inserting absolute PNT envelopes into its denominator
destroys the signed cancellation and does not prove it.

### 4.1 A positive soft-trace sufficient condition

The supremum in (4.6) can be reduced to one positive trace, at the cost of
an explicit `L^(3/2)` sampling factor.  Put

\[
 S_\sigma=\sigma(B+\sigma I)^{-1},
 \qquad 0<S_\sigma<I,                                  \tag{4.7}
\]

and

\[
 F_\sigma(t)=\langle g_t,S_\sigma g_t\rangle,
 \qquad
 \mathcal I_T(\sigma)=
 \int_{-T}^T F_\sigma(t){dt\over2\pi}.                \tag{4.8}
\]

If `K_T` is the exact finite time--band operator on `mathcal K`, defined by

\[
 \langle v,K_Tv\rangle
 =\int_{-T}^T|\widehat v(t)|^2{dt\over2\pi},
 \qquad v\in\mathcal K,                                \tag{4.9}
\]

then finite-dimensional trace duality gives

\[
 \boxed{
 \mathcal I_T(\sigma)=\operatorname {tr}(S_\sigma K_T).}
                                                               \tag{4.10}
\]

This is a positive overlap of the residual-scale soft spectral projector
with the bounded-frequency concentration operator.  No separate source
block norm occurs.

There is also a deterministic trace-to-supremum estimate.  Since the Riesz
evaluation vector is the finite projection of `x -> exp(i*t*x)`,

\[
 \left\|{d\over dt}g_t\right\|
 \leq\left(\int_{-L/2}^{L/2}x^2\,dx\right)^{1/2}
 ={L^{3/2}\over\sqrt {12}}=:C_L.                      \tag{4.11}
\]

Thus `y(t)=||S_sigma^(1/2)g_t||=sqrt(F_sigma(t))` is
`C_L`-Lipschitz.  If `M=sup_[-T,T]F_sigma`, start at a maximizer and move
along the side of `[-T,T]` having length at least `T`.  Until distance
`min(T,sqrt(M)/(2C_L))`, one has `y>=sqrt(M)/2`.  Integrating this lower
tent proves

\[
 \boxed{
 \sup_{|t|\leq T}F_\sigma(t)
 \leq
 \{16\pi C_L\mathcal I_T(\sigma)\}^{2/3}
 +{8\pi\over T}\mathcal I_T(\sigma).}                \tag{4.12}
\]

Consequently, because the locked anchor norm `a` stays bounded, the
positive soft-trace estimate

\[
 \boxed{
 L^{3/2}\operatorname {tr}(S_\sigma K_T)\longrightarrow0}       \tag{4.13}
\]

implies the uniform observable gate (3.9).  With `sigma=r`, (4.13) is a
source-specific alternative target:

\[
 L^{3/2}\operatorname {tr}
 \{r(B+rI)^{-1}K_T\}\longrightarrow0.                 \tag{4.14}
\]

Equations (4.10)--(4.14) are exact finite reductions.  No present estimate
proves (4.14) for the arithmetic source matrices.

## 5. Why the residual ridge is a genuine improvement

Suppose a complement eigenvalue `x` tends to zero.  Its contribution to the
old leverage is proportional to `1/x`, whereas its contribution to the new
product is

\[
 {\sigma\over x+\sigma}\leq1.                         \tag{5.1}
\]

Thus a vanishing complementary floor no longer creates an artificial pole
in the observable estimate.  The price is exact: to make (3.9) tend to
zero, the bounded-frequency evaluation family must asymptotically miss the
soft spectral band `x \lesssim \sigma`, or a still smaller certified ridge
must be proved from (0.1).

The ridge condition is monotone and optimizable.  Define

\[
 \Phi_T(\sigma)=
 \sigma\mathcal R_T(\sigma).
\]

Functional calculus shows that `Phi_T` is nondecreasing.  By (2.3), the
smallest admissible ridge is the actual displacement `h`.  When `b!=0`
(and hence `h>0`), this gives

\[
 \inf_{\sigma>0:\ e(\sigma)\leq\sigma}\Phi_T(\sigma)
 =h\mathcal R_T(h).                                    \tag{5.2}
\]

Equation (5.2) is an exact reduction, not an asymptotic estimate.  The
choice `sigma=r` is useful because it is certified without knowing `mu`.

## 6. Exact Cauchy-structure obstruction to a residual-only shortcut

Small `r` alone does not imply (0.4).  The following family has the exact
source Cauchy displacement algebra, although it is a structural model and
not the arithmetic Weil matrix.

Use raw indices `-1,0,1` and choose

\[
 b_0=0,\qquad b_1=-\varepsilon,
 \qquad b_{-1}=\varepsilon,
\]

\[
 a_0=0,
 \qquad a_1=a_{-1}=2\varepsilon^2+\varepsilon.        \tag{6.1}
\]

Set

\[
 Q_{nn}=a_n,
 \qquad Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m).       \tag{6.2}
\]

Then `JQ=QJ` and the rank-two source commutator holds exactly.  Relative to
the normalized even basis

\[
 \kappa=V_0,
 \qquad e_1^+=(V_1+V_{-1})/\sqrt2,
\]

the even and odd blocks are

\[
 Q_+=
 \begin{pmatrix}
 0&-\sqrt2\varepsilon\\
 -\sqrt2\varepsilon&2\varepsilon^2
 \end{pmatrix},
 \qquad
 Q_-=2\varepsilon^2+2\varepsilon.                    \tag{6.3}
\]

At the Rayleigh shift `q=0`, both required signs hold:

\[
 B=2\varepsilon^2>0,
 \qquad Q_->0.                                         \tag{6.4}
\]

The combined residual tends to zero,

\[
 r=\sqrt2\varepsilon\to0.                              \tag{6.5}
\]

But the ground displacement solves

\[
 h={2\varepsilon^2\over2\varepsilon^2+h},             \tag{6.6}
\]

and the correction in the `e_1^+` direction has squared norm

\[
 {2\varepsilon^2\over(2\varepsilon^2+h)^2}
 ={h\over2\varepsilon^2+h}\longrightarrow1.          \tag{6.7}
\]

The residual-ridged leverage detects the obstruction rather than hiding it:

\[
 r\langle e_1^+,(B+rI)^{-1}e_1^+\rangle
 ={r\over2\varepsilon^2+r}\longrightarrow1.          \tag{6.8}
\]

This direction is an actual bounded-frequency evaluation direction, not an
arbitrary probe.  For this structural model set the source-normalization
factor `a=1`, fix `L=2*pi`, and use the locked centered modes.  At
`t=1=2*pi/L`,

\[
 \widehat\kappa(1)=0,
 \qquad
 g_1=-\sqrt\pi\,e_1^+.                                \tag{6.9}
\]

Consequently the left side of the source-style gate at `t=1` is `pi` times
(6.8), and does not tend to zero.

Therefore Cauchy displacement, inversion symmetry, the two finite signs,
and `r -> 0` do not prove the observable gate.  A proof of (4.6) must use
the actual weighted-PNT orientation of the bounded-frequency evaluation
vectors.

## 7. Remaining theorem

The new narrow source route is:

1. prove `A-qI>0` and `Q_--qI>0` on one unbounded schedule with
   `N/L^2 -> infinity`;
2. prove the cancellation-preserving ridged leverage estimate (4.6), or a
   sharper certified-ridge version of (3.9); and
3. invoke the already-audited real-zero source theorem and zero-free real
   interval normality argument.

This note proves only the finite reduction in steps 1--2.  It supplies no
unbounded source sign and no arithmetic estimate for (4.6), so it proves no
unconditional determinant limit and does not establish equation (5.2) of
`DIRECT_RH_ATTACK.md`.
