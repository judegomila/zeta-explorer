# Complete-leakage higher-Ritz formula and relative-scale no-go

## 0. Scope and exact outcome

This note specializes the higher even Krylov--Ritz construction to the
source-normalized projected prolate state.  It gives two equivalent exact
descriptions of the fixed-dimensional Ritz value:

1. an **unnormalized Hankel pencil** whose entries are reconstructed from
   the complete radical-tail Riesz vector; and
2. a **centered Feshbach pencil** whose entries are moments of the complete
   centered leakage.

For the three-vector value `U_3`, the latter is one explicit cubic in four
unnormalized leakage moments.  No normalized residual direction, stored
matrix, eigenvector, eigenvalue, or zero table is needed.

The formulas also settle what the existing prolate estimates can imply.
They give upper bounds for the unnormalized leakage and show that every
fixed algebraic coefficient is radical.  They do not give a lower bound for
the leakage or control its normalized complement spectral measure.  Hence
they imply no relative lower bound for

\[
 t_m=q-U_m
\]

against the odd transverse near-null tower.  A theorem below constructs two
flat finite-dimensional families satisfying the same kinds of admitted
absolute bounds, with `t_m` respectively negligible and dominant relative
to the odd near-null scale.  This is a precise non-implication result.  It
does not rule out a new source-specific, carrier-sensitive theorem.

All arithmetic quantities below are assembled from

\[
 Q=Q_{\rm pole}-Q_{\rm arch}-Q_{\rm prime}             \tag{0.1}
\]

before a power, inner product, inverse, or norm is taken.  Thus the minus
signs on the archimedean and prime blocks, every mixed word, and the
pole--archimedean--prime cancellation are retained.  The source coefficient
fixing `h_lambda -> h` is unchanged; no unit normalization of `h_lambda`
is introduced.

This note proves no shifted sector sign, weighted solve, determinant limit,
or Riemann-hypothesis conclusion.  The formal project state remains
`P0_INVALIDATED`.

## 1. The unnormalized source state and its complete leakage

Use the invisible codimension-two correction from
`notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`, and write

\[
 K=S\mathcal E(\widetilde h_\lambda),\qquad
 p=P_NC_\lambda K,\qquad
 a^2=\langle p,p\rangle>0,\qquad
 \kappa={p\over a}.                                    \tag{1.1}
\]

The correction does not change `p`; in particular (1.1) is the same
source-normalized finite state used by the producer.  Put

\[
 R=K-p.                                                 \tag{1.2}
\]

Let `Q=Q_(lambda,N,+)` be the complete even finite Weil matrix, and let
`ell_R` be the Riesz vector on the even finite space for the complete
radical-tail functional

\[
 v\longmapsto \mathcal W_Z(v,R).                       \tag{1.3}
\]

The exact two-sided radical identity gives, before any absolute value is
taken,

\[
 \boxed{Qp=-\ell_R,\qquad
 Q(p,p)=\mathcal W_Z(R,R).}                            \tag{1.4}
\]

Indeed, at every zero evaluation `K` vanishes and hence `R=-p`.
Polarization gives `W_Z(v,R)=-Q(v,p)` for every finite vector `v`; the
quadratic identity follows by using both evaluations.  These pairings are
the absolutely convergent compact-factor pairings established in the exact
leakage note, not a numerically supplied zero sum.

Consequently

\[
 q={\langle p,Qp\rangle\over a^2}
   ={\mathcal W_Z(R,R)\over a^2},                      \tag{1.5}
\]

and the centered complete leakage is

\[
 \boxed{
 g=(Q-qI)p=-\ell_R-qp
   =-P_{p^\perp}\ell_R.}                              \tag{1.6}
\]

Thus the normalized residual is merely `b=g/a`, but no division by its
possibly beyond-all-orders norm is needed below.

If

\[
 \ell_R=\ell_{\rm pole}-\ell_{\rm arch}
             -\ell_{\rm prime},                       \tag{1.7}
\]

equations (1.4)--(1.6) mean the vector on the right is combined first.
Replacing `||ell_R||` by the three separate block norms, or replacing a
power of (0.1) by separate block powers, is not an identity.

## 2. Unnormalized Hankel formula for every fixed Ritz value

Define the complete unnormalized moments

\[
 M_j=\langle p,Q^jp\rangle\qquad(j\geq0).              \tag{2.1}
\]

Equation (1.4) reconstructs every entry from the radical leakage:

\[
 \boxed{
 M_0=a^2,\qquad
 M_1=\mathcal W_Z(R,R),\qquad
 M_j=\langle\ell_R,Q^{j-2}\ell_R\rangle
       \quad(j\geq2).}                                \tag{2.2}
\]

The signs in the last identity cancel because `Qp=-ell_R`; the internal
archimedean and prime signs in both `ell_R` and `Q` do not cancel and remain
the ones in (0.1).

For `m>=1`, form

\[
 G_m=(M_{i+j})_{0\leq i,j<m},\qquad
 H_m=(M_{i+j+1})_{0\leq i,j<m}.                       \tag{2.3}
\]

Before Krylov breakdown, `G_m` is positive definite and the lowest Ritz
value on

\[
 \mathcal K_m=\operatorname {span}
       \{p,Qp,\ldots,Q^{m-1}p\}                       \tag{2.4}
\]

is exactly

\[
 \boxed{
 U_m=\min_{0\ne c\in\mathbb C^m}{c^*H_mc\over c^*G_mc}.}
                                                               \tag{2.5}
\]

In particular, `U_3` is the least generalized root of

\[
 \boxed{
 \det\!\begin{pmatrix}
 M_1-zM_0&M_2-zM_1&M_3-zM_2\\
 M_2-zM_1&M_3-zM_2&M_4-zM_3\\
 M_3-zM_2&M_4-zM_3&M_5-zM_4
 \end{pmatrix}=0.}                                    \tag{2.6}
\]

Only `M_0,...,M_5` are used, and (2.2) reconstructs all of them through the
complete source-signed action.  Formula (2.6) is unnormalized: rescaling
`p` multiplies both pencils by the same positive scalar and leaves `U_3`
unchanged.

## 3. Centered raw Feshbach formula

Let

\[
 P=I-{|p\rangle\langle p|\over a^2},\qquad
 C=P(Q-qI)P\big|_{p^\perp},                            \tag{3.1}
\]

and define the raw centered moments

\[
 \sigma_j=\langle g,C^jg\rangle\qquad(j\geq0).        \tag{3.2}
\]

For `m>=2`, put `d=m-1` and

\[
 \Sigma_0=(\sigma_{i+j})_{0\leq i,j<d},\qquad
 \Sigma_1=(\sigma_{i+j+1})_{0\leq i,j<d},\qquad
 v=(\sigma_0,\ldots,\sigma_{d-1})^T.                 \tag{3.3}
\]

The block recurrence for `Q` proves the exact decomposition

\[
 \mathcal K_m=\mathbb Cp\ \mathbin\oplus\
   \operatorname {span}\{g,Cg,\ldots,C^{m-2}g\}.      \tag{3.4}
\]

At a shifted value `z=q-t`, the unnormalized form of `Q-zI` in the basis
on the right of (3.4) is

\[
 \boxed{
 \mathcal T_m(t)=
 \begin{pmatrix}
   a^2t&v^*\\
   v&\Sigma_1+t\Sigma_0
 \end{pmatrix}.}                                      \tag{3.5}
\]

Assume no breakdown.  The Ritz lowering `t_m=q-U_m` is the unique root for
which the lower block is positive definite and

\[
 \boxed{
 a^2t_m
 =v^*(\Sigma_1+t_m\Sigma_0)^{-1}v.}                \tag{3.6}
\]

This is the raw complete-leakage Feshbach equation.  Dividing
`sigma_j` by `a^2` recovers the normalized complement formula, but never
requires constructing `g/||g||`.

Equation (3.6) also identifies the missing asymptotic datum.  It is not
just `||g||`: it is the Stieltjes transform of the spectral measure of `C`
seen from `g`, restricted to the declared complement Krylov space.

## 4. The explicit three-vector cubic

For `m=3`, assume

\[
 \Delta=\sigma_0\sigma_2-\sigma_1^2>0,                \tag{4.1}
\]

which is exactly independence of `g,Cg`.  Set

\[
 D_0=\sigma_1\sigma_3-\sigma_2^2,\qquad
 D_1=\sigma_0\sigma_3-\sigma_1\sigma_2,              \tag{4.2}
\]

\[
 \Gamma=\sigma_0^2\sigma_3
       -2\sigma_0\sigma_1\sigma_2+\sigma_1^3.         \tag{4.3}
\]

Taking the determinant in (3.5) gives

\[
 \boxed{
 a^2\Delta t^3+a^2D_1t^2
 +(a^2D_0-\sigma_0\Delta)t-\Gamma=0.}                \tag{4.4}
\]

The desired `t_3` is the unique root of (4.4) for which

\[
 \begin{pmatrix}
 \sigma_1+t\sigma_0&\sigma_2+t\sigma_1\\
 \sigma_2+t\sigma_1&\sigma_3+t\sigma_2
 \end{pmatrix}>0;                                    \tag{4.5}
\]

an arbitrary algebraic root of the cubic is not automatically the lowest
Ritz branch.

For a direct check against ordinary centered moments, put

\[
 \widetilde M_j=\langle p,(Q-qI)^jp\rangle.
\]

Then

\[
 \boxed{
 \sigma_0=\widetilde M_2,\qquad
 \sigma_1=\widetilde M_3,\qquad
 \sigma_2=\widetilde M_4-{\widetilde M_2^2\over a^2},
 }                                                     \tag{4.6}
\]

\[
 \boxed{
 \sigma_3=\widetilde M_5
       -{2\widetilde M_2\widetilde M_3\over a^2}.}   \tag{4.7}
\]

The subtractions in (4.6)--(4.7) are the exact return through the comparison
state removed by the complement projection.  Omitting them gives the wrong
three-vector pencil.

## 5. What the admitted prolate estimates do and do not control

On the Gevrey diagonal

\[
 L=2\log\lambda,\qquad N=\lceil\lambda L^3\rceil,
\]

the admitted estimate in
`notes/PROLATE_ENDPOINT_SCHUR_SINGULAR_ASYMPTOTICS.md` is

\[
 |q|+r=O\!\left(e^{-c\lambda L^2}\right),
 \qquad r={\|g\|\over a}.                             \tag{5.1}
\]

The fixed-order expansion says more in one sense and less in the needed
sense: every formal source correction is a global radical state, and the
resulting finite leakage is flat to all algebraic orders.  Neither statement
supplies a nonzero lower bound for `||g||`.

The odd derivative corrections produce, for every fixed `M`, an
`M`-dimensional transverse space with

\[
 \sup_{\substack{z\in\mathcal R_{M,\lambda}\\\|z\|=1}}
 \|(Q_--qI)z\|=O_A(\lambda^{-A})
 \quad\hbox{for every fixed }A.                       \tag{5.2}
\]

Equation (5.2) is also an upper bound and carries no sign.

Even if one adds a polynomial upper bound for `||C||`, equations
(3.2)--(3.6) only upper-bound the unnormalized moments.  After factoring
out `sigma_0=||g||^2`, the Feshbach equation still depends on the normalized
spectral measure of `C` seen from `g`.  The fixed prolate series does not
determine that measure because normalizing `g` divides by a flat quantity.

There is one useful conditional estimate.  If the compressed complement in
(3.6), in normalized coordinates, satisfies

\[
 0<cI\leq C_{m-1}\leq CI,                             \tag{5.3}
\]

then ordinary resolvent order gives

\[
 {r^2\over C+t_m}\leq t_m\leq{r^2\over c+t_m}.       \tag{5.4}
\]

Thus a uniformly positive complement makes every fixed-dimensional
lowering quadratic in the leakage norm.  It does not turn the upper bound
(5.1) into a lower bound.

## 6. Precise flat-scale non-implication theorem

### Theorem 6.1

Fix a Krylov dimension `m>=2` and a transverse dimension `M>=1`.  The
absolute inputs (5.1)--(5.2), together with vanishing of every algebraic
prolate coefficient, do not imply any asymptotic lower comparison between
`t_m` and the odd transverse near-null scale.

More precisely, there are two Hermitian finite-dimensional families with
the following common properties:

- `q=0`;
- `r=O(e^{-X})` for
  `X=c_0*lambda*(2*log(lambda))^2` and some fixed `c_0>0`;
- all even leakage and odd near-null entries are flat to every algebraic
  order in `lambda^(-1)`;
- the even complement is uniformly positive and the Krylov chain has no
  breakdown through dimension `m`; and
- an `M`-dimensional odd transverse space has action norm
  `delta=e^{-3X}`.

In the first family `t_m/delta -> 0`; in the second
`t_m/delta -> infinity`.  If the transverse block is chosen with sign
`-delta`, the shifted transverse block remains negative in the first
family and becomes positive in the second.

### Proof

Choose an integer `D>=m-1`, let

\[
 A=\operatorname {diag}(1,2,\ldots,D),\qquad
 v=(1,\ldots,1)^T,                                    \tag{6.1}
\]

and define, with `kappa=e_0`,

\[
 Q_+(\varepsilon)=
 \begin{pmatrix}0&\varepsilon v^*\\
                 \varepsilon v&A\end{pmatrix}.       \tag{6.2}
\]

Then `q=0`, `b=epsilon*v`, and `r^2=D*epsilon^2`.  The vectors
`v,Av,...,A^(m-2)v` are independent by the Vandermonde determinant, so
there is no breakdown.  Every compression of `A` has spectrum in `[1,D]`.
The Feshbach equation therefore gives

\[
 {r^2\over D+t_m}\leq t_m\leq{r^2\over1+t_m}\leq r^2.
\]

Using the last upper bound in the first denominator yields the completely
explicit bracket

\[
 \boxed{{r^2\over D+r^2}\leq t_m\leq r^2.}           \tag{6.3}
\]

On an odd space `\mathbb C y\oplus\mathcal R_M`, take

\[
 Q_-y=0,qquad Q_-|_{\mathcal R_M}=-\delta I.         \tag{6.4}
\]

Thus the odd endpoint action on `y` is zero and the transverse action norm
is exactly `delta`, irrespective of its unfavorable sign.

Put `x=e^(-X)`.  In the first family choose

\[
 \varepsilon=x^2,qquad\delta=x^3.
\]

Then (6.3) gives `t_m/delta<=D*x -> 0`, so
`-delta+t_m<0` eventually.  In the second choose

\[
 \varepsilon=x,qquad\delta=x^3.
\]

Now (6.3) gives

\[
 {t_m\over\delta}\geq
 {D x^2\over(D+D x^2)x^3}
 ={1\over x(1+x^2)}\longrightarrow\infty,            \tag{6.5}
\]

so `-delta+t_m>0` eventually.  Both residual scales are `O(x)`, both odd
scales are the same, and every displayed quantity is smaller than every
fixed inverse power of `lambda`.  Their formal algebraic expansions are
identically zero.  This proves the non-implication.  \(\square\)

The models in Theorem 6.1 are logical countermodels to an inference from
the admitted **scale estimates**.  They are not claimed to be arithmetic
Weil matrices.  Accordingly, the theorem does not preclude a new estimate
using the complete source formulas (0.1), (1.4), and the actual cumulative
prime discrepancy.  It proves that such new information is necessary.

## 7. Exact frontier

The higher-Ritz route is now reduced without normalized residuals.  For a
fixed `m`, a source proof would have to control the complete quantities in
(2.2) or (3.2) strongly enough to establish all of the following on one
unbounded schedule:

1. a nontrivial lower scale for the centered leakage `g`, or directly for
   the Feshbach functional (3.6);
2. the normalized complement spectral measure seen from `g`, including any
   near-resonant lower even direction;
3. a signed lower bound for the odd transverse block at the same scale; and
4. the inverse-weighted cross load after the exact shift `t_m`.

Separate pole, archimedean, and prime norm bounds do not provide these
data.  The live candidate is a relative, carrier-sensitive estimate for
the single combined radical leakage and the complete cumulative
discrepancy.  Until such an estimate is proved, increasing a fixed Krylov
dimension supplies a valid finite variational improvement but no
asymptotic escape from the odd near-null tower.
