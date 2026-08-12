# Natural direct-bottom-projector adjugate alignment theorem/barrier

## 0. Exact outcome and claim boundary

This note removes the failed centered and lower-Ritz gates from the finite
even-ground alignment problem.  It proves the following exact statements.

1. On a simple bottom branch, the anchor projection alone gives the eta-free
   estimate

\[
 \boxed{\mathcal A\leq\rho^{-1}-1.}              \tag{0.1}
\]

   Thus `rho=1-O(lambda^(-1))` is a sufficient direct certificate.  No
   complement positivity or boundary visibility is required.
2. The observable has a globally denominator-safe adjugate formula using
   `J*kappa`.  It does not require a particular outer cofactor column to be
   nonzero.
3. At a multiple bottom eigenvalue, legal coordinate-shell selection gives a
   qualitative visible axis-rooted line whenever `P*kappa!=0`.  The exact
   quantitative obligation is a minimum of coordinate cofactor ratios.
4. Piecewise analyticity, prime-threshold rank-one jumps, Perron arguments,
   and trace averaging do not prove that quantitative obligation.
5. An exact diagonal source-Cauchy family, using the actual projected-prolate
   anchor, has a simple visible axis-rooted ground while its projective error
   grows like `L`.

The only remaining actual simple-branch target is the relative cofactor
orientation in Section 8.  It is **not proved**.  This note proves no actual
finite-good index, cofinal simple subsequence, determinant limit, zero
theorem, Riemann hypothesis, converse, or de Bruijn--Newman bound.  The
standard eight are unchanged and the formal state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly four repository theorem/test pairs are frozen.

| Dependency | SHA-256 |
|---|---|
| `notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md` | `e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26` |
| `tests/test_source_cauchy_selector_cone_projective_tradeoff.py` | `f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee` |
| `notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md` | `ce6863d26788de9fc0fd9e998094fcb7982845ca298ccf8048d0913f62470450` |
| `tests/test_natural_cutoff_signed_ground_alignment.py` | `3ae99e6bbbc0004aa2560a577eca16d6ef0221d28fb2aefc3aef1d9558fae0bb` |
| `notes/CENTRAL_PROLATE_NORMALIZATION_FEEDBACK_BARRIER.md` | `00efc515b17157da25e980962aee7fafdd4ea522e92b5db0caca290fead0490d` |
| `tests/test_central_prolate_normalization_feedback_barrier.py` | `128026af692bf3f03663510b4dadbab3518509e107ab488c1c00a4e9f3a84e66` |
| `notes/NATURAL_CENTERED_GATE_ANCHOR_COFACTOR_NONEMPTYNESS_REDUCTION_BARRIER.md` | `88f6ffa991547f5ca88aacce893a585f3047d7675200288cd18a57cbbcfb7699` |
| `tests/test_natural_centered_gate_anchor_cofactor_nonemptiness_reduction_barrier.py` | `b57ad035543d21e4d6746bb58c19764171706ecc613932f850ea71e6857186bb` |

The first pair supplies the source-Cauchy selector cone and its closure under
coordinate-shell lowering.  The second supplies the natural retained
projector and the Gevrey anchor tail.  The third supplies the actual central
anchor asymptotic.  The fourth supplies the complete-source dependence on
`L` and the prime-threshold derivative jump.  No external theorem, zero
list, or numerical artifact is imported.

## 2. Adjacent-cutoff geometry

Work in an even space of dimension `N+1`, with normalized shell basis
`e_0,...,e_N`.  Let `e=e_N` be the one omitted outer shell and put

\[
 \Pi=I-|e\rangle\langle e|,\qquad
 p=\Pi\kappa,\qquad
 k=\|p\|^2=1-|\langle e,\kappa\rangle|^2>0.       \tag{2.1}
\]

The retained anchor-perpendicular space is

\[
 \mathcal L=\operatorname {Ran}\Pi\cap p^\perp
            =\operatorname {span}\{e,\kappa\}^\perp.       \tag{2.2}
\]

Let `A=A^*` be the even source-Cauchy compression, let

\[
 \mu=\lambda_{\min}(A),\qquad
 E=\ker(A-\mu I),\qquad P=P_E,\qquad
 \rho=\langle\kappa,P\kappa\rangle=\|P\kappa\|^2. \tag{2.3}
\]

Assume first that `E` is one-dimensional and `rho>0`.  The eta-free
coefficient normalization is

\[
 X={P\kappa\over\rho},\qquad
 \langle\kappa,X\rangle=1,\qquad
 \|X\|^2={1\over\rho}.                           \tag{2.4}
\]

Define the direct projective observable

\[
 \mathcal A
 ={\|P_{\mathcal L}P\kappa\|^2\over\rho^2}
 =\|P_{\mathcal L}X\|^2.                         \tag{2.5}
\]

Because `P_(mathcal L)*kappa=0`, orthogonal contraction and (2.4) give

\[
 \boxed{
 \mathcal A
 =\|P_{\mathcal L}(X-\kappa)\|^2
 \leq\|X-\kappa\|^2
 ={1\over\rho}-1.}                              \tag{2.6}
\]

Consequently, for any fixed `C>0`, the purely spectral condition

\[
 \boxed{
 \rho\geq{\lambda\over\lambda+C}
 \quad\Longrightarrow\quad
 \mathcal A\leq{C\over\lambda}.}                \tag{2.7}
\]

If `xi` is a unit bottom vector and
`gamma=<kappa,xi>`, then `rho=|gamma|^2`.  Equations (2.6)--(2.7) require
neither the centered compression at the anchor Rayleigh value nor the
lower two-vector Ritz value.  They are therefore strictly weaker finite
certificates than either failed gate.  They do not prove the required
actual overlap rate.

## 3. Globally safe adjugate formula

Let

\[
 \chi(z)=\det(zI-A),\qquad
 J=\operatorname {adj}(\mu I-A).                 \tag{3.1}
\]

For a simple eigenvalue, the spectral adjugate identity is

\[
 \boxed{J=\chi'(\mu)P.}                          \tag{3.2}
\]

It follows that

\[
 \langle\kappa,J\kappa\rangle=\chi'(\mu)\rho,
 \qquad
 X={J\kappa\over\langle\kappa,J\kappa\rangle}. \tag{3.3}
\]

Thus `rho>0` is exactly the nonvanishing of the displayed adjugate
denominator, and the complete characteristic scale cancels:

\[
 \boxed{
 \mathcal A
 ={\|P_{\mathcal L}J\kappa\|^2
    \over|\langle\kappa,J\kappa\rangle|^2}.}     \tag{3.4}
\]

The Gram form is equally intrinsic.  Since
`det Gram(e,kappa)=k`, the projection-volume identity gives

\[
 \boxed{
 \mathcal A
 ={\det\operatorname {Gram}(e,\kappa,J\kappa)
    \over k|\langle\kappa,J\kappa\rangle|^2}.}  \tag{3.5}
\]

This formulation is safer than selecting the outer adjugate column
`J*e`.  That column can vanish even when the bottom eigenvalue is simple
and `<kappa,J*kappa>!=0`: a simple ground supported entirely in the
retained space is the elementary example.  If a nonzero outer column is
available, (3.4) reduces to the prior bordered formula

\[
 \mathcal A={\|q\wedge Y\|^2\over k|S|^2}.       \tag{3.6}
\]

Equation (3.6) is a valid chart, not a globally valid choice of chart.
Equation (3.4) is the denominator-safe statement used below.

## 4. Multiple bottoms and legal coordinate selection

Let the bottom multiplicity be `m>=1`.  Define

\[
 J_m=\left.\partial_z^{m-1}
       \operatorname {adj}(zI-A)\right|_{z=\mu}. \tag{4.1}
\]

Writing `chi(z)=(z-mu)^m*g(z)` in the spectral resolution gives

\[
 \boxed{J_m={\chi^{(m)}(\mu)\over m}P.}          \tag{4.2}
\]

For every coordinate put `w_j=P*e_j`.  Lowering the corresponding raw
central diagonal, or the paired raw diagonals for a positive shell,
preserves the exact inversion-symmetric source-Cauchy form.  The even
perturbation is

\[
 A_{\varepsilon,j}
 =A-\varepsilon|e_j\rangle\langle e_j|.          \tag{4.3}
\]

If `w_j!=0`, rank-one interlacing gives one simple level below `mu`, and
its line tends to `C*w_j` as `epsilon` decreases to zero.  The frozen
selector-cone closure therefore proves that every nonzero `w_j` is
axis-rooted.

Coordinate resolution also gives

\[
 \sum_{j=0}^N|\langle\kappa,w_j\rangle|^2
 =\|P\kappa\|^2=\rho.                            \tag{4.4}
\]

Hence `P*kappa!=0` guarantees at least one qualitative coordinate-selected
axis-rooted bottom line with nonzero anchor normalization.  For each such
coordinate define

\[
 \mathcal R_j
 ={\|P_{\mathcal L}J_m e_j\|^2
    \over|\langle\kappa,J_m e_j\rangle|^2}
 ={\|P_{\mathcal L}w_j\|^2
    \over|\langle\kappa,w_j\rangle|^2}.          \tag{4.5}
\]

The exact multiplicity-safe quantitative target is

\[
 \boxed{
 \min_{\langle\kappa,J_m e_j\rangle\ne0}
       \mathcal R_j=O(\lambda^{-1}).}             \tag{4.6}
\]

This minimum, not the unweighted dimension of `E`, is the weakest
coordinate-shell statement relevant to direct projective alignment.
One still needs the admitted tail and normalization margin when passing
from a selected finite line to a locally uniform transform limit.

## 5. Why trace averaging is stronger

The exact shell sums are

\[
 \sum_{j=0}^N\|P_{\mathcal L}w_j\|^2
 =\operatorname {tr}(P_{\mathcal L}P),\qquad
 \sum_{j=0}^N|\langle\kappa,w_j\rangle|^2=\rho.  \tag{5.1}
\]

Therefore

\[
 \min_{\langle\kappa,w_j\rangle\ne0}\mathcal R_j
 \leq{\operatorname {tr}(P_{\mathcal L}P)\over\rho}.       \tag{5.2}
\]

At the adjacent cutoff, `rank(I-P_(mathcal L))=2`.  If `rank(P)=m`, then

\[
 \boxed{
 \operatorname {tr}(P_{\mathcal L}P)
 \geq\max\{0,m-2\}.}                             \tag{5.3}
\]

Thus a trace-rate proof can handle at most a double bottom space
eventually.  This does not obstruct the minimum in (4.6): a single good
coordinate can have zero numerator while the other bottom directions make
the trace large.

## 6. Analyticity and sign limitations

For fixed `N`, the complete actual matrix is continuous in `L` and real
analytic between prime-power thresholds.  On such a cell its
characteristic discriminant is real analytic.  If that discriminant is
not identically zero, all spectral collisions on the cell are discrete.
The premise is essential: source-Cauchy matrices include arbitrary
diagonal data and exact high-multiplicity examples.

At a prime-power threshold `L_0=log r`, the exact derivative jump is

\[
 \Delta\partial_LA(L_0)
 =-c_r|\eta\rangle\langle\eta|,
 \qquad
 c_r={2\Lambda(r)\over L_0\sqrt r}>0.            \tag{6.1}
\]

This jump changes at most one first-order direction in a collision space
and is blind on `E intersect eta^perp`.  It is not a simplicity theorem.
Moreover, the natural odd halfgrid changes `N` at every sample.  Discrete
collisions for each fixed analytic family do not prevent every one-point
sample of a dimension-changing family from being a collision.  Rounding a
nearby simple `L` back to the halfgrid would require a quantitative gap and
stability radius.

There is likewise no abstract Perron repair.  The source-Cauchy class
contains all diagonal Hermitian matrices, so it has neither irreducibility
nor positivity improvement.  For the actual complete source, no diagonal
sign gauge making every off-diagonal entry nonpositive and no
operator-monotone Loewner generator has been proved.  The signed prime,
archimedean, and pole pieces cannot be replaced by a total-positive model.
These observations do not prove that eventual actual simplicity is false;
they identify the missing theorem.

## 7. Actual-anchor diagonal source-Cauchy countermodel

The following countermodel keeps the actual projected-prolate anchor.
In raw centered modes `-N,...,N`, choose

\[
 b_n=0,\qquad a_0=0,\qquad a_{\pm n}=G>0
 \quad(1\leq n\leq N).                            \tag{7.1}
\]

All off-diagonal source-Cauchy entries vanish, and the even block is

\[
 A_+=\operatorname {diag}(0,G,\ldots,G).          \tag{7.2}
\]

Its bottom line is the simple axis-rooted line `C*e_0`.  Let `kappa` now
be the actual unit projected-prolate anchor, put

\[
 \kappa_0=\langle e_0,\kappa\rangle,
 \qquad k=\|\Pi\kappa\|^2.                       \tag{7.3}
\]

Then `P=|e_0><e_0|`, `rho=|kappa_0|^2`, and direct projection gives

\[
 \|P_{\mathcal L}e_0\|^2
 =1-{|\kappa_0|^2\over k}.                       \tag{7.4}
\]

Consequently the exact direct observable is

\[
 \boxed{
 \mathcal A={1\over|\kappa_0|^2}-{1\over k}.}    \tag{7.5}
\]

On every admitted natural projected-prolate schedule, the frozen anchor
theorems give

\[
 \sqrt L\,\kappa_0\longrightarrow K_\infty>0,
 \qquad
 1-k=\|(I-\Pi)\kappa\|^2=O(e^{-cL^2}).           \tag{7.6}
\]

Equations (7.5)--(7.6) imply

\[
 \boxed{
 \mathcal A={L\over K_\infty^2}+o(L)
 \longrightarrow\infty.}                        \tag{7.7}
\]

Thus the actual anchor, exact source-Cauchy displacement, a simple bottom,
nonzero anchor overlap, and axis-rootedness do not imply quantitative
alignment.  This family is synthetic and is not the actual prime source.
It proves that an actual arithmetic orientation estimate cannot be
replaced by a structural source-Cauchy theorem.

## 8. The one actual arithmetic stopping line

Restore the actual natural odd-halfgrid data and attach the index `p` to
every quantity.  On a simple visible bottom branch, define

\[
 \boxed{
 \mathfrak R_p
 ={\|P_{\mathcal L_p}J_p\kappa_p\|^2
    \over|\langle\kappa_p,J_p\kappa_p\rangle|^2}
 ={\det\operatorname {Gram}
       (e_{N_p},\kappa_p,J_p\kappa_p)
    \over k_p|\langle\kappa_p,J_p\kappa_p\rangle|^2}.}       \tag{8.1}
\]

Here

\[
 J_p=\operatorname {adj}(\mu_pI-A_p),\qquad
 \mu_p=\lambda_{\min}(A_p).                     \tag{8.2}
\]

The exact direct route asks for

\[
 \boxed{
 \langle\kappa_p,J_p\kappa_p\rangle\ne0,
 \qquad
 \mathfrak R_p=O(\lambda_p^{-1})}                \tag{8.3}
\]

at one cofinal actual subsequence.  The weaker
`lambda_p^(-1+o(1))` rate is enough for the fixed-substrip transform bridge.
Alternatively, (2.7) reduces (8.3) to the sufficient overlap statement

\[
 \rho_p=1-O(\lambda_p^{-1}).                     \tag{8.4}
\]

The entries of `A_p` are affine in every complete prime-power atom below
height comparable with `lambda_p^2`, but `J_p` has growing cofactor order
and `mu_p` is an adaptive algebraic root of the same source.  A bound for
`||J_p||`, a characteristic derivative, finitely many Krylov moments, or
an ordinary fixed quadratic large sieve does not control the ratio (8.1).
The common cofactor scale cancels.  What is missing is an actual relative
orientation theorem.

For a multiple bottom, replace (8.3) by the coordinate minimum (4.6) and
also prove at least one nonzero denominator.  Qualitative coordinate
selection alone supplies neither the rate nor the normalization reserve.

## 9. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. infers `rho=1-O(lambda^(-1))` from pointwise nonzero or fixed positive
   overlap;
2. replaces `J*kappa` by a possibly zero outer adjugate column;
3. divides by `<kappa,J*kappa>` or a coordinate denominator without proving
   it is nonzero;
4. treats analytic genericity at fixed `N` as a natural-halfgrid
   noncollision theorem;
5. treats a rank-one prime-threshold jump as splitting an arbitrary
   multiple bottom space;
6. uses the trace bound as though it were equivalent to the coordinate
   minimum;
7. imports Perron or total positivity without an actual sign-regularity
   theorem;
8. identifies the diagonal countermodel with the actual arithmetic source;
9. claims that a fixed finite pilot proves (8.3); or
10. claims a determinant limit, a zeta-zero theorem, RH, a converse, or a
    de Bruijn--Newman bound.

The proved content is the eta-free projector estimate, the globally safe
adjugate ratio, the multiplicity-safe qualitative selector, the trace and
analytic barriers, and the actual-anchor structural countermodel.  The
actual relative cofactor inequality (8.3) remains open.
