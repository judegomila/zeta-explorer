# Natural adjugate Plucker and inverse-Christoffel covariance reduction/barrier

## 0. Exact outcome and claim boundary

This note continues the natural odd-halfgrid, simple outer-border branch
after checkpoint 1.58.  It proves four finite-dimensional reductions and
one structural barrier.

1. The characteristic derivative and the determinant scale cancel exactly.
   Boundary and anchor projections are scale-free projections of the same
   null vector.
2. The remaining numerator is a positive second-Plucker norm, while the
   automatic simple-branch anchor denominator is one bordered determinant.
3. After the fixed parity congruence, source-Cauchy displacement reduces the
   outer inverse response to two inverse generators and contributes the
   exact factor `(2N-1)^(-1)`.
4. The source-cone/Hankel representation makes those generators
   inverse-Christoffel or Riesz-representer quantities.  Positivity gives no
   uniform bound for them.  The exact checkpoint-1.58 synthetic family
   realizes the obstruction.

The note also audits exterior-power prime expansions, all-pole contour
summation, and adjacent odd cutoffs.  The prime audit is deliberately
formal: its degree statements hold with the spectral parameter and weights
frozen.  The actual bottom root, gate, and anchor cofactor weight depend on the
same complete source, so the actual target is not asserted to be a literal
fixed-order prime correlation.

The exact new arithmetic input is a gate-restricted, anchor-weighted,
normalized Plucker, equivalently inverse-Christoffel frame, large-sieve
estimate.  It is stated in Section 9 and is **not proved**.  On the strict
simple branch the anchor weight is automatically positive, so boundary
visibility is not an additional hypothesis.  Boundary visibility remains
relevant to the canonical multiple branch, which is outside the reduction
below.  No actual finite-good index, determinant limit, zero theorem,
Riemann hypothesis, converse, or de Bruijn--Newman bound is proved.  The
standard eight are unchanged and the formal state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly three repository theorem/test pairs are frozen.

| Dependency | SHA-256 |
|---|---|
| `notes/NATURAL_CROSSROOT_WEIGHTED_PROJECTOR_AVERAGE_TARGET.md` | `d477178ac4daed6315bdce4bc27b94b073bf0611c87a1f3192b4b5b7147334cf` |
| `tests/test_natural_crossroot_weighted_projector_average_target.py` | `36a70f9de303fe49ac60dfd1285542486615f696dfd66566fe73158eeba9a390` |
| `notes/NATURAL_OUTER_SHELL_LARGE_SIEVE_INVERSE_SPREAD_BARRIER.md` | `79be0448f5e144819ee9eb2e249021c3c5ffe44949a58b75002e2a117c1b85da` |
| `tests/test_natural_outer_shell_large_sieve_inverse_spread_barrier.py` | `e65c890a6f97def68b48825ccb8c3148926c744cd77f27754fb7790534dbabf8` |
| `notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md` | `e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26` |
| `tests/test_source_cauchy_selector_cone_projective_tradeoff.py` | `f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee` |

The first pair fixes the denominator-safe dyadic target and its
multiplicity-safe form.  The second supplies the actual outer column, the
simple one-shell identities, and the exact positive synthetic no-go family.
The third supplies the positive source-Cauchy cone and its Hankel moment
congruence.  No external theorem, zero list, numerical artifact, or
standard-eight byte is introduced.

## 2. One-shell null vector and scale cancellation

Fix one odd index and suppress `p`.  On the active simple border branch,
write

\[
 A=\begin{pmatrix}C&h\\h^*&\alpha\end{pmatrix},\qquad
 \mu=\lambda_{\min}(A)<\lambda_{\min}(C),\qquad
 D=C-\mu I>0.                                      \tag{2.1}
\]

Put

\[
 \delta=\det D>0,\qquad r=D^{-1}h,\qquad
 Y=\operatorname {adj}(D)h=\delta r.               \tag{2.2}
\]

The Schur equation at the bottom root is

\[
 \alpha-\mu=h^*D^{-1}h,                            \tag{2.3}
\]

so

\[
 v=(r,-1),\qquad z=\delta v=(Y,-\delta),\qquad
 (A-\mu I)z=0.                                     \tag{2.4}
\]

Let

\[
 \Phi(w)=\det(A-wI).
                                                               \tag{2.5}
\]

Schur factorization near `mu` gives

\[
 \Phi(w)=\det(C-wI)
 \{\alpha-w-h^*(C-wI)^{-1}h\},                    \tag{2.6}
\]

and therefore

\[
 \boxed{\Phi'(\mu)=-\delta(1+\|r\|^2),\qquad
        |\Phi'(\mu)|={\|z\|^2\over\delta}.}       \tag{2.7}
\]

Use the boundary and anchor decomposition

\[
 \eta=(\bar\eta,\sqrt2),\qquad
 \kappa=(q,c),\qquad k=\|q\|^2=1-|c|^2.           \tag{2.8}
\]

With the convention that the first inner-product slot is conjugate linear,
put

\[
 t=\langle v,\eta\rangle
   =\langle r,\bar\eta\rangle-\sqrt2,\qquad
 s=\langle\kappa,v\rangle
   =\langle q,r\rangle-\overline c.               \tag{2.9}
\]

Then

\[
 \langle z,\eta\rangle=\delta t,\qquad
 S:=\langle q,Y\rangle-\overline c\,\delta
   =\langle\kappa,z\rangle=\delta s.              \tag{2.10}
\]

The checkpoint-1.58 weight can now be written without a characteristic
derivative:

\[
 \boxed{
 \omega={|t|^2\over|\Phi'(\mu)|^2}
 ={|\langle z,\eta\rangle|^2\over\|z\|^4}.}       \tag{2.11}
\]

If `P` is the bottom-line projector, then

\[
 \boxed{
 P\eta={z\langle z,\eta\rangle\over\|z\|^2},
 \qquad
 (P\eta)(P\eta)^*=\omega zz^*.}                  \tag{2.12}
\]

Thus a small determinant or a clustered characteristic derivative is not
an additional loss in the boundary-normalized statistic.  They are the
same common scale and cancel exactly.  Equations (2.11)--(2.12) remain the
checkpoint-1.58 boundary formulas, but the strict simple gate supplies a
stronger eta-free normalization from the anchor itself.

## 3. Positive second-Plucker target

Because `N=M+1`, the transverse space is

\[
 {\cal L}=\operatorname {span}\{e_N,\kappa\}^{\perp}
 =\{(y,0):\langle q,y\rangle=0\}.                 \tag{3.1}
\]

For `k>0`, let

\[
 \overline P=I-{|q\rangle\langle q|\over k}.       \tag{3.2}
\]

Then

\[
 P_{\cal L}z=(\overline P Y,0),                    \tag{3.3}
\]

and the exterior-product identity gives

\[
 \boxed{
 k\|\overline P Y\|^2
 =k\|Y\|^2-|\langle q,Y\rangle|^2
 =\|q\wedge Y\|^2
 =\sum_{i<j}|q_iY_j-q_jY_i|^2.}                  \tag{3.4}
\]

The low-row matrix

\[
 B=[D\ \ h]                                       \tag{3.5}
\]

annihilates `z`.  Its signed maximal minors are the coordinates of `z`,
and

\[
 \det\begin{pmatrix}D&h\\q^*&\overline c\end{pmatrix}
 =-S.                                              \tag{3.6}
\]

The strict simple gate says that the bottom line is not orthogonal to the
anchor.  Hence

\[
 \rho:=\langle\kappa,P\kappa\rangle
 ={ |S|^2\over\|z\|^2}>0,
 \qquad
 X:={P\kappa\over\rho}={z\over S},
 \qquad \langle\kappa,X\rangle=1.                 \tag{3.7}
\]

Define the anchor cofactor weight and the anchor Gram determinant by

\[
 \omega^\kappa={|S|^2\over\|z\|^4},
 \qquad
 \Delta^\kappa=\det\operatorname {Gram}
             (e_N,\kappa,P\kappa).                \tag{3.8}
\]

Since `k=det Gram(e_N,kappa)`, orthogonal projection and (3.3)--(3.4)
give the exact identities

\[
 \boxed{
 {\Delta^\kappa\over k}
 =\|P_{\cal L}P\kappa\|^2
 =\omega^\kappa\|\overline P Y\|^2
 ={\omega^\kappa\over k}\|q\wedge Y\|^2,
 \qquad
 \rho^2=\omega^\kappa|S|^2.}                    \tag{3.9}
\]

In particular, the coefficient-normalized projective observable is

\[
 \boxed{
 {\Delta^\kappa\over k\rho^2}
 =\|P_{\cal L}X\|^2
 ={\|q\wedge Y\|^2\over k|S|^2}.}               \tag{3.10}
\]

For comparison, (2.11)--(2.12) still give the boundary-weighted identities

\[
 {\Delta^\eta\over k}={\omega\over k}\|q\wedge Y\|^2,
 \qquad
 |\langle\kappa,P\eta\rangle|^2=\omega|S|^2,    \tag{3.11}
\]

where `Delta^eta=det Gram(e_N,kappa,P eta)`.  They are exact, but they are
not the minimal strict-simple-branch formulation: `P eta` may vanish,
whereas `rho>0` is automatic.  The boundary formulation remains needed on
the canonical multiple branch.

For a nonempty finite simple-good set `G_P`, the remaining dyadic statement
is therefore the eta-free anchor target

\[
 \boxed{
 \sum_{p\in{\cal G}_P}{\omega_p^\kappa\over k_p}
       \|q_p\wedge Y_p\|^2
 \ll { (\log P)^B\over P}
 \sum_{p\in{\cal G}_P}\omega_p^\kappa|S_p|^2.}  \tag{3.12}
\]

This is a normalized orientation estimate, not a raw determinant estimate.
Bounding `Y`, `delta`, and `Phi'` separately discards the scale cancellation,
while retaining the eta weight imposes an unnecessary simple-branch
visibility condition.

## 4. Exact two-generator source-displacement reduction

Return to normalized even coordinates.  Apply to the low block and the
outer coordinate the fixed congruence

\[
 T=\operatorname {diag}(1,2^{-1/2},\ldots,2^{-1/2}),
 \qquad
 \widetilde D=TDT,
 \qquad
 \widetilde h=T h/\sqrt2.                         \tag{4.1}
\]

Put

\[
 x_i=i^2,\qquad X=\operatorname {diag}(x_0,\ldots,x_{N-1}),
 \qquad \gamma_i=i\beta_i.                       \tag{4.2}
\]

The normalized even source-Cauchy formulas become

\[
 \widetilde D_{ij}={\gamma_i-\gamma_j\over x_i-x_j}
 \quad(i\ne j),\qquad
 \widetilde h_i={\gamma_i-\gamma_N\over x_i-x_N}.
                                                               \tag{4.3}
\]

The diagonal shift commutes with `X`, so

\[
 \boxed{
 [X,\widetilde D]=\gamma1^T-1\gamma^T,
 \qquad
 (X-x_NI)\widetilde h=\gamma-\gamma_N1.}          \tag{4.4}
\]

Let

\[
 \widetilde r=\widetilde D^{-1}\widetilde h,
 \qquad \sigma=1^T\widetilde r,
 \qquad \tau=\gamma^T\widetilde r.               \tag{4.5}
\]

Using `widetilde D*X=X*widetilde D-[X,widetilde D]` in the equation
`widetilde D*widetilde r=widetilde h` gives

\[
 \boxed{
 (X-x_NI)\widetilde r
 =(1-\sigma)\widetilde D^{-1}\gamma
 +(\tau-\gamma_N)\widetilde D^{-1}1.}            \tag{4.6}
\]

The boundary normalization is not lost under the congruence:

\[
 \boxed{t=\sqrt2(\sigma-1).}                      \tag{4.7}
\]

Define

\[
 W=(X-x_NI)^{-1},\quad
 U=\widetilde D^{-1}\gamma,\quad
 V=\widetilde D^{-1}1,\quad
 \theta=1-\sigma=-{t\over\sqrt2},\quad
 \zeta=\tau-\gamma_N.                            \tag{4.8}
\]

Then the whole outer response is

\[
 \boxed{\widetilde r=W(\theta U+\zeta V).}         \tag{4.9}
\]

Since the last low node is `(N-1)^2`,

\[
 \boxed{
 \|W\|={1\over x_N-x_{N-1}}={1\over2N-1}.}       \tag{4.10}
\]

There is also an exact scalar closure.  Put

\[
 f=WU,\qquad g=WV,qquad
 A_0=1^Tf,\quad B_0=1^Tg,\quad
 C_0=\gamma^Tf,\quad D_0=\gamma^Tg.              \tag{4.11}
\]

The definitions of `theta,zeta,sigma,tau` give

\[
 \boxed{
 \begin{pmatrix}1+A_0&B_0\\-C_0&1-D_0\end{pmatrix}
 \begin{pmatrix}\theta\\\zeta\end{pmatrix}
 =\begin{pmatrix}1\\-\gamma_N\end{pmatrix}.}    \tag{4.12}
\]

Thus displacement rank two really does reduce the outer continuation to
two inverse generators.  It does not bound either generator or their
orientation.

The congruence has condition number at most `sqrt(2)`.  Hence the stronger
scalar estimate

\[
 \sum_{p\in{\cal G}_P}\chi_p^\kappa
 \{ |\theta_p|\|U_p\|+|\zeta_p|\|V_p\|\}^2
 \ll P(\log P)^B
 \sum_{p\in{\cal G}_P}\chi_p^\kappa|s_p|^2       \tag{4.13}
\]

would imply (3.12) after (4.9)--(4.10).  Formula (4.13) is only a
cancellation-losing sufficient condition.  It is not proved and is not
substituted for the normalized Plucker theorem.

Here

\[
 \chi_p^\kappa={|s_p|^2\over(1+\|r_p\|^2)^2},     \tag{4.14}
\]

so (3.9) is equivalently
`Delta_p^kappa/k_p=chi_p^kappa*||Pbar_p*r_p||^2` and
`rho_p^2=chi_p^kappa*|s_p|^2`.

## 5. Hankel and inverse-Christoffel stopping line

On the simple branch, `A-mu*I` is a positive-semidefinite source-Cauchy
block of size `d+1` and rank `d`, where

\[
 d=N={p+3\over2}.                                  \tag{5.1}
\]

The frozen source-cone theorem maps it by an invertible real congruence to
a positive-semidefinite Hankel moment matrix.  Its one-dimensional kernel
becomes a homogeneous polynomial `pi_p` of degree at most `d`.  Any positive
moment representation is supported on the real projective zeros of that
polynomial.  Rank `d` requires at least `d` distinct evaluation vectors,
while a nonzero degree-`d` polynomial has at most `d` projective zeros.
Therefore `pi_p` has degree exactly `d`, and the representation is the
unique `d`-atomic representation supported on those roots.

This recovers real-rootedness and the same cofactor direction.  It does not
locate the roots or compare its coefficient vector with the prolate anchor.
Under the congruence, `U` and `V` in (4.8) are Riesz representers, or
inverse-Christoffel-type vectors, for two source functionals.  Positivity
only says that their quadratic norms are nonnegative.  It gives no upper
bound: a positive moment atom may have arbitrarily small weight, making the
corresponding inverse-Christoffel quantity arbitrarily large.

The checkpoint-1.58 synthetic family makes the failure exact.  There

\[
 \beta_i=0\ (0\leq i<N),\qquad \beta_N=1,
 \qquad \gamma=0,qquad \gamma_N=N,               \tag{5.2}
\]

and

\[
 \widetilde D=\operatorname {diag}
 \left(1,{1\over2N^2},{1\over2},\ldots,{1\over2}\right).
                                                               \tag{5.3}
\]

Consequently

\[
 U=0,qquad
 V=\widetilde D^{-1}1=(1,2N^2,2,\ldots,2)^T.      \tag{5.4}
\]

Equations (4.8)--(4.9) give `zeta=-N`; the coefficient `theta` is
irrelevant because `U=0`.  In particular,

\[
 \boxed{
 \widetilde r_1={2N^3\over N^2-1}=2N+O(N^{-1}).} \tag{5.5}
\]

Thus the exact `(2N-1)^(-1)` separation is overwhelmed by an inverse
generator of order `N^2`.  The same frozen family has a simple visible even
ground, strict even complement, bounded Ritz ratio, uniform positive
even-sector gap above the ground, and projective alignment tending to one
rather than zero.
It is a synthetic positive source-Cauchy completion with a synthetic anchor,
not the actual arithmetic source or the natural prolate anchor.  It proves
only that Hankel positivity, Christoffel positivity, and the checkpoint-1.58
raw prefix mean do not imply (3.12) or (4.13).

## 6. Exterior-power and prime-correlation degree audit

For fixed `p`, a fixed independent spectral parameter `w`, and formal
variables `xi_m`, the complete shifted source has the form

\[
 Z_p(w;\xi)=Z_p^{(0)}(w)
 -\sum_{1<m\leq p^2/4}\xi_m K_{p,m,+},            \tag{6.1}
\]

where actual specialization would use

\[
 \xi_m={\Lambda(m)\over\sqrt m}.                  \tag{6.2}
\]

Let `B_p(w;xi)` be the first `d` rows of `Z_p(w;xi)`.  Its signed maximal
minor vector is

\[
 z_p(w;\xi)=\star\bigwedge_{i=1}^d
       \operatorname {row}_i B_p(w;\xi).          \tag{6.3}
\]

With `w` frozen independently of `xi`, this is a polynomial of degree at
most `d` in the formal source variables.  Write its homogeneous expansion

\[
 z_p(w;\xi)=\sum_{j=0}^d z_p^{[j]}(w;\xi).         \tag{6.4}
\]

The self-square of `z_p^[1]` is the first possible formal
two-prime-power correlation, with

\[
 m,n\leq {p^2\over4}.                              \tag{6.5}
\]

If the spectral parameter, gate, and weight were independently frozen, the
first possible new positive block beyond such a quadratic mean would be the
four-variable self-square of `z_p^[2]`:

\[
 m_1,m_2,n_1,n_2\leq {p^2\over4}.                 \tag{6.6}
\]

The formal cofactor-square degree satisfies

\[
 \boxed{\deg_\xi(\hbox{cofactor square})\leq2d=p+3.}
                                                               \tag{6.7}
\]

On `P<p<=2P`, every formal prime-power variable is at most `P^2`, and the
formal upper order lies between roughly `P` and `2P`.

These are degree bookkeeping statements, not a literal expansion of the
actual weighted target.  At actual specialization,

\[
 w=\mu_p(\xi),\qquad
 \omega_p^\kappa={|S_p(\xi)|^2\over\|z_p(\xi)\|^4},
 \qquad 1_{{\cal G}_P}(p)=1_{{\cal G}_P}(p;\xi),  \tag{6.8}
\]

and all three depend on the same complete source.  Substitution of the
adaptive algebraic root destroys the fixed-coefficient polynomial model.
Even the formal two-variable block then carries an adaptive spectral kernel
and is not an application of the ordinary Montgomery--Vaughan mean value.

Source-Cauchy displacement rank two does not reduce the formal determinant
degree.  The source-Cauchy class contains arbitrary diagonal data, and no
rank-one factorization of the paired zero-extension translation matrices is
proved or imported here.
Andreief or Cauchy--Binet can reorganize the degree-`d` minors.  On the
positive shifted block it produces the `d`-root polynomial of Section 5;
it does not turn its adaptive roots or weights into the explicit
prime-power measure.

## 7. Contours and the all-pole trace bound

Let `(P_j)` be the complete spectral projectors of one finite `A`, with
multiplicities grouped.  The all-pole pinching of the anchor rank-one
matrix is

\[
 {\cal E}_A(\kappa\kappa^*)
 =\sum_jP_j\kappa\kappa^*P_j.                     \tag{7.1}
\]

It is positive and contains the bottom term in Loewner order:

\[
 P\kappa\kappa^*P\preceq {\cal E}_A(\kappa\kappa^*).
                                                               \tag{7.2}
\]

Completeness gives the exact trace

\[
 \boxed{
 \operatorname {tr}{\cal E}_A(\kappa\kappa^*)
 =\sum_j\|P_j\kappa\|^2=\|\kappa\|^2=1.}       \tag{7.3}
\]

Hence, without using a gap,

\[
 {\Delta^\kappa\over k}=\|P_{\cal L}P\kappa\|^2\leq1,
                                                               \tag{7.4}
\]

which sums to only `O(P)` on a dyadic block.  This is a valid unconditional
positive upper bound, but it misses the required `P^(-1)` gain relative to
the total anchor weight `sum rho_p^2`.

A fixed Riesz contour isolating the bottom projector needs a quantitative
distance to the rest of the spectrum.  A shrinking contour recreates the
same spectral-separation denominator in resolvent form.  Summing all poles
avoids the gap but loses bottom-line selection and gives only (7.1)--(7.4).
Thus the contour route does not prove (3.12).

## 8. Adjacent odd cutoffs

The low block `C_p` has the same dimension as the preceding natural full
block `A_(p-2)`, but its interval length and complete source have changed.
The newly admitted prime-power inventory lies in

\[
 I_p=\left({(p-2)^2\over4},{p^2\over4}\right],
 \qquad |I_p|=p-1.                                \tag{8.1}
\]

For `p=2k+1`,

\[
 I_p=\left(k^2-k+{1\over4},k^2+k+{1\over4}\right],
                                                               \tag{8.2}
\]

and

\[
 \sup I_p=\inf I_{p+2}.                           \tag{8.3}
\]

Thus these half-open blocks are exactly contiguous along the odd schedule.
Their weighted prime discrepancy is a concrete scalar or matrix-valued
short-interval statistic at height comparable with `p^2` and length
comparable with `p`.

This does not give spectral flow.  Changing `p` also changes

\[
 L_p-L_{p-2}=2\log{p\over p-2}={4\over p}+O(p^{-2}),
                                                               \tag{8.4}
\]

so every old translation kernel is rescaled, not only the new block.
Transporting the bottom projector additionally requires quantitative
conditioning and control of the accumulated orientation relative to the
moving prolate anchor.  The finite gate is strict but supplies neither.
Even a sharp average for the contiguous blocks therefore remains a
pre-projector estimate.

## 9. Minimal new theorem

For the actual strict-simple finite-good set, define the anchor cofactor
weight

\[
 \varpi_p^\kappa
 ={|\langle\kappa_p,z_p\rangle|^2\over\|z_p\|^4}
 =\omega_p^\kappa.                                \tag{9.1}
\]

The minimal simple-branch arithmetic input is the following statement for
some fixed constants `B,C` on cofinally many dyadic blocks:

\[
 \boxed{
 {\cal G}_P\ne\varnothing,
 \qquad
 \sum_{p\in{\cal G}_P}{\varpi_p^\kappa\over k_p}
       \|q_p\wedge Y_p\|^2
 \leq {C(\log P)^B\over P}
 \sum_{p\in{\cal G}_P}\varpi_p^\kappa
       |\langle\kappa_p,z_p\rangle|^2.}           \tag{9.2}
\]

For every index in this strict-simple set,

\[
 \langle\kappa_p,z_p\rangle\ne0,
 \qquad
 \varpi_p^\kappa|\langle\kappa_p,z_p\rangle|^2
 =\rho_p^2>0.                                     \tag{9.3}
\]

Thus nonemptiness already makes the total weight in (9.2) positive; no
separate eta-visibility hypothesis is needed.  Equation (9.2) is exactly
(3.12), hence exactly the coefficient-normalized weighted projector average
on the simple branch.  Through Section 4 it is
equivalently a normalized frame estimate for the two inverse-Christoffel
generators `Dtilde^(-1)*gamma` and `Dtilde^(-1)*1`, with the complete
source-dependent coefficients retained.  It is not an entrywise prime
large sieve, a raw prefix bound, an unweighted Christoffel inequality, or a
fixed-order prime correlation.

No estimate in this note proves (9.2), including its good-set nonemptiness.
The canonical multiple branch still uses the mixed boundary visibility and
is not replaced by (9.1)--(9.3).

## 10. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. states (3.12), (4.13), or (9.2) as proved;
2. treats the formal degree audit in Section 6 as a literal fixed-order
   expansion after substituting `mu_p`, `omega_p^kappa`, or the gate;
3. bounds `Y_p`, `delta_p`, and `Phi_p'(mu_p)` separately and discards the
   scale cancellations (2.11) and (3.9);
4. infers an inverse-Christoffel bound from Hankel positivity or
   real-rootedness;
5. drops either generator in (4.6), the coefficient `tau-gamma_N`, or the
   factor `(2N-1)^(-1)`;
6. identifies the synthetic family with the actual arithmetic source or
   its synthetic anchor with the natural prolate state;
7. replaces the strict-simple anchor weight by the eta weight, requires a
   separate eta-visibility hypothesis there, or uses an unrestricted or
   unweighted average;
8. infers a bottom-projector estimate from the all-pole trace bound;
9. treats the contiguous new prime blocks as the complete adjacent-cutoff
   matrix deformation; or
10. claims finite-good-set nonemptiness, automatic mixed visibility on the
    canonical multiple branch, determinant convergence, an unconditional
    zero theorem, RH, a converse, or a de Bruijn--Newman bound.

The proved content is the scale-free anchor Plucker identity with automatic
simple-branch weight positivity, the exact two-generator displacement
formula, the inverse-Christoffel no-go, and the three stopping audits.  The
actual normalized covariance and good-set nonemptiness remain open, and the
formal state remains `P0_INVALIDATED`.
