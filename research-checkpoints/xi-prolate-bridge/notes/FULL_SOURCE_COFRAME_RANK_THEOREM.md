# Full-source coframe floor and finite-inventory rank obstruction

## 1. Claim boundary

This note separates three statements that must not be conflated.

1. The untruncated arithmetic/parity map from the full even, zero-integral
   source space onto a fixed finite physical parity space has an explicit
   row-frame floor.
2. At every fixed `lambda>1` and fixed finite target space, some finite mixed
   all-even prolate prefix inherits a quantitative floor.  The terminal label
   is non-effective and the prefix mixes the two residue classes modulo four.
3. The prescribed transition-buffered source inventory has only about
   `lambda^2` columns.  At larger Fourier cutoffs, including
   `N=3*ceil(lambda^2)` and the locked exponential schedule, this inventory is
   exactly row-rank deficient.

The first two facts do not prove the prescribed parity-separated buffered
coframes.  The third does not obstruct a different source inventory, a larger
mixed prefix, or a quotient argument that retains a nonzero high complement.
No signed sector floor, residual estimate, determinant limit, or Riemann-
hypothesis conclusion is proved.  The repository state remains
`P0_INVALIDATED`.

The source inventory and formula strings are pinned in
`FULL_SOURCE_COFRAME_RANK_SOURCE_LOCK.json`.

## 2. Full even zero-integral source map

Fix `lambda>1` and let

\[
 \mathcal H_0^{\rm ev}
 =\left\{f\in L^2[-\lambda,\lambda]:
 f(-x)=f(x),\ \int_{-\lambda}^{\lambda}f(x)\,dx=0\right\},
 \tag{2.1}
\]

with Lebesgue measure and zero extension.  On

\[
 I_\lambda=[\lambda^{-1},\lambda],\qquad
 \mathcal G=L^2(I_\lambda,du/u),                              \tag{2.2}
\]

use

\[
 (A_\lambda f)(u)=\sqrt u\sum_{m\leq\lambda/u}f(mu),
 \quad (Jg)(u)=g(u^{-1}),
 \quad S_\sigma={I+\sigma J\over2}.                          \tag{2.3}
\]

Fix a finite-dimensional subspace `X` of the `sigma` inversion-parity
subspace of `G`, and let `P_X` be its orthogonal projection.  The operator of
interest in this note is

\[
 T=P_XS_\sigma A_\lambda:\mathcal H_0^{\rm ev}\longrightarrow X. \tag{2.4}
\]

This is the full-source operator.  It is not a Fourier-truncated prolate
synthesis and it contains no claim about a prescribed finite source family.

To avoid collision with the prime cosine polynomial denoted elsewhere by
`S_lambda(t)`, put

\[
 M_\mu(\lambda)=
 \sum_{n\leq\lfloor\lambda^2\rfloor}{|\mu(n)|\over\sqrt n}
 \leq2\lambda.                                               \tag{2.5}
\]

Section 6 of `notes/LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR.md` constructs, for
each `g in G`, an even zero-integral source `f_g` satisfying

\[
 A_\lambda f_g=g,
 \qquad
 \|f_g\|_2\leq\sqrt2\,\lambda M_\mu(\lambda)\|g\|_\mathcal G. \tag{2.6}
\]

The source first comes from finite Mobius inversion on the visible positive
interval.  It is evenized, and its integral is removed by a constant on the
central hole `|x|<lambda^(-1)`.  That correction is invisible to
`A_lambda`.  Therefore, for `x in X`, applying this construction to `g=x`
gives a right inverse

\[
 B_X:X\longrightarrow\mathcal H_0^{\rm ev},qquad
 TB_X=I_X,qquad
 \|B_X\|\leq\sqrt2\,\lambda M_\mu(\lambda).                 \tag{2.7}
\]

### Theorem 2.1 (explicit full-source row floor)

The full-source map (2.4) obeys

\[
 \boxed{
 {1\over2\lambda^2M_\mu(\lambda)^2}I_X
 \preceq TT^*
 \preceq {\lambda^2\over2}I_X.}                            \tag{2.8}
\]

In particular,

\[
 \boxed{TT^*\succeq {1\over8\lambda^4}I_X.}                \tag{2.9}
\]

**Proof.**  For `x in X`, (2.7) gives

\[
 \|x\|^2
 =\langle TB_Xx,x\rangle
 =\langle B_Xx,T^*x\rangle
 \leq\|B_X\|\,\|x\|\,\|T^*x\|.                           \tag{2.10}
\]

Thus `||T^*x||>=||x||/||B_X||`, which proves the lower bound in
(2.8).  Equation (6.5a) of the pinned leverage note gives
`||A_lambda||^2<=lambda^2/2`; both parity projection and `P_X` are
contractions, proving the upper bound.  Finally (2.5) gives (2.9).  `square`

This is a row/coframe bound.  It is not a source-side lower bound for `T^*T`:
the latter vanishes on `ker T`.

## 3. Coordinate-invariant finite restriction

Let `C:C^r -> H_0^ev` synthesize any finite source family and write

\[
 D=C^*C,\qquad F=\operatorname {ran}C,\qquad W=TC.            \tag{3.1}
\]

The orthogonal projection onto `F` is

\[
 P_F=CD^\dagger C^*,                                        \tag{3.2}
\]

including redundant columns.  Hence the coordinate-invariant restricted
row frame is

\[
 \boxed{TP_FT^*=WD^\dagger W^*.}                            \tag{3.3}
\]

Replacing `D` by the identity is valid only for an orthonormal source
coordinate system.  Rescaling columns can arbitrarily change `WW^*`, but it
does not change (3.3).

Set

\[
 R=TT^*>0,\qquad Z=R^{-1/2}T,\qquad ZZ^*=I_X,                \tag{3.4}
\]

and

\[
 L_F=Z(I-P_F)Z^*.                                            \tag{3.5}
\]

Then `0<=L_F<=I` and direct multiplication gives

\[
 \boxed{
 TP_FT^*=R^{1/2}(I-L_F)R^{1/2}.}                            \tag{3.6}
\]

Consequently,

\[
 \operatorname {ran}W=X
 \quad\Longleftrightarrow\quad
 \|L_F\|<1,                                                 \tag{3.7}
\]

and, for `0<gamma<=1`,

\[
 \boxed{
 TP_FT^*\succeq\gamma R
 \quad\Longleftrightarrow\quad
 \|L_F\|\leq1-\gamma.}                                    \tag{3.8}
\]

The non-strict semidefinite boundary in (3.8) is valid when `gamma>0`.
Setting `gamma=0` proves no row floor and is rejected.  A numerical interval
that merely straddles zero is unresolved; exact equality needs an exact or
otherwise rigorous positive-semidefinite certificate.

## 4. Quantitative mixed all-even prefix

Use the unit-orthonormal even prolate modes in the convention pinned by
`PROLATE_DEFECT_SOURCE_LOCK.json`.  Put

\[
 I_j=\int_{-\lambda}^{\lambda}h_j(x)\,dx,
 \qquad
 c_{2j}=h_{2j}-{I_{2j}\over I_0}h_0,\qquad j\geq1.           \tag{4.1}
\]

The even ground mode can be chosen positive, so `I_0>0`.  The sources
`c_(2j)` have zero Lebesgue integral and their span is dense in
`H_0^ev`.  Let

\[
 C_M=(c_2,c_4,\ldots,c_{2M}),\quad
 F_M=\operatorname {ran}C_M,\quad
 W_M=TC_M.                                                   \tag{4.2}
\]

Orthonormality of the `h_j` gives the exact source Gram

\[
 D_M=C_M^*C_M=I+vv^*,qquad v_j={I_{2j}\over I_0}.            \tag{4.3}
\]

The nested projections `P_(F_M)` converge strongly to the identity.  Since
`X` is finite-dimensional,

\[
 \|L_M\|
 =\|Z(I-P_{F_M})Z^*\|
 =\|(I-P_{F_M})Z^*\|^2\longrightarrow0.                    \tag{4.4}
\]

### Theorem 4.1 (non-effective finite-prefix floor)

For every fixed `lambda>1`, finite target space `X`, and inversion parity,
there is a finite, non-effective `M` for which

\[
 \boxed{
 W_MD_M^{-1}W_M^*
 \succeq {1\over16\lambda^4}I_X.}                           \tag{4.5}
\]

**Proof.**  Choose `M` in (4.4) so that `||L_M||<=1/2`.  Equations
(2.9), (3.6), and (3.8) give (4.5).  `square`

In the pinned coordinates, (4.3) also gives `D_M>=I`, hence
`D_M^(-1)<=I`, so the special raw frame obeys

\[
 W_MW_M^*\succeq W_MD_M^{-1}W_M^*
 \succeq {1\over16\lambda^4}I_X.                            \tag{4.6}
\]

The first inequality in (4.6) is not coordinate invariant and must not be
reused after arbitrary rescaling.  Equation (4.5), with the source Gram, is
the invariant statement.

The theorem gives no effective `M`, mixes `0 mod 4` and `2 mod 4` labels,
and is for fixed `lambda` and `X`.  It does not prove either prescribed
buffered coframe on a growing schedule.

## 5. Exact finite-inventory rank obstruction

Now take the locked half-integer schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 m=\lceil\lambda^2\rceil={p^2+3\over4}.                     \tag{5.1}
\]

The pinned transition ceiling and strict endpoint are

\[
 q=\left\lceil {2\over\pi^2}
       \log(50p^2+25)\log20\right\rceil,
 \qquad n_*=p^2+6+q.                                        \tag{5.2}
\]

The exact source-column counts are

\[
 \boxed{
 r_+=m+\left\lfloor{q+2\over4}\right\rfloor-1,qquad
 r_-=m+\left\lfloor{q\over4}\right\rfloor.}              \tag{5.3}
\]

Assume explicitly that the projected plus anchor is nonzero.  After anchor
deflation, the plus target space has dimension `N`; the odd target space also
has dimension `N`.  Rank-nullity alone therefore proves

\[
 \boxed{
 \dim\ker(W_+W_+^*)\geq[N-r_+]_+,qquad
 \dim\ker(W_-W_-^*)\geq[N-r_-]_+.}                         \tag{5.4}
\]

If the plus anchor vanishes, its normalized deflation is not defined and no
plus certificate may be emitted.  Before deflation, the augmented plus map
has `r_++1` columns into a space of dimension `N+1`, leading to the same
count difference when that anchor is genuinely present.

### Matched bandwidth

At `N=m`, the elementary lower bound `q>=5` gives

\[
 r_+\geq m,\qquad r_-\geq m+1.                              \tag{5.5}
\]

Thus there is no count obstruction to row spanning for the buffered matched
family.  There is also no proof of row spanning or of a positive floor.
For the unbuffered inventory, both counts equal `m-2`, so each matched sector
has row nullity at least two.

### Fixed larger multiple

At `N=Cm`, for an integer `C>=1`, (5.4) becomes

\[
 \nu_+\geq
 \left[(C-1)m-\left\lfloor{q+2\over4}\right\rfloor+1\right]_+,
 \qquad
 \nu_-\geq
 \left[(C-1)m-\left\lfloor{q\over4}\right\rfloor\right]_+. \tag{5.6}
\]

In particular, for the diagnostic schedule `N=3m`,

\[
 \boxed{
 \nu_+\geq2m-\left\lfloor{q+2\over4}\right\rfloor+1,
 \qquad
 \nu_-\geq2m-\left\lfloor{q\over4}\right\rfloor.}         \tag{5.7}
\]

These displayed quantities are positive for every odd `p>=5`.  Indeed,
`log(20)<3`, `pi^2>9`, and `50p^2+25<=51p^2` give

\[
 {2\log20\over\pi^2}\log(50p^2+25)
 <{2\over3}\log(51p^2)<p^2-1,                              \tag{5.7a}
\]

where the last difference is already positive at `p=5` and has positive
derivative thereafter.  Thus `q<=p^2-1`, which proves positivity in (5.7).

Because `q` grows only logarithmically while `m` grows quadratically, every
fixed `C>1` is eventually row-rank obstructed for this prescribed inventory.
The statement in `notes/GROWING_WINDOW_THEOREM.md` that the counts fit inside
the `N=3m` spaces concerns the possibility of column injectivity.  It must
not be read as absence of a row-coframe obstruction.

### Locked exponential Fourier schedule

At

\[
 N=2^{2400p^2},                                              \tag{5.8}
\]

the exact missing-row bounds are

\[
 \boxed{
 \nu_+\geq2^{2400p^2}-m-\left\lfloor{q+2\over4}\right\rfloor+1,
 \quad
 \nu_-\geq2^{2400p^2}-m-\left\lfloor{q\over4}\right\rfloor.} \tag{5.9}
\]

Thus the transition-buffered family cannot form a row coframe on the locked
exponential Fourier schedule.  Any mixed all-even prefix that spans that
target must contain at least `N` independent source columns.  This does not
invalidate the projection and sampling bounds proved on that schedule; it
rules out only a row-spanning claim for the displayed finite source
inventory.

## 6. Exact finite regression models

The producer and clean-room replay use exact reduced rational arithmetic for
the following separation models.

### 6.1 Sharp positive relative floor

Represent a finite source Hilbert space in coordinates with Gram matrix
`D=diag(2,3,5)`, and let the coordinate matrix of the full map be `A`.  In
standard orthonormal coordinates, define

\[
 \widetilde T=AD^{-1/2}.
\]

For a coordinate synthesis `C`, put
`widetilde C=D^(1/2)C`.  Then the image matrix is `W=AC`, while the
source Gram is `G=C^*DC`; this is exactly the standard-coordinate formula
`W=widetilde T @ widetilde C`, `G=widetilde C^* @ widetilde C` from (3.3).
Take

\[
 D=\operatorname {diag}(2,3,5),\qquad
 A=\begin{pmatrix}1&0&1\\0&1&1\end{pmatrix}.               \tag{6.1}
\]

Then

\[
 R=AD^{-1}A^*
 =\begin{pmatrix}7/10&1/5\\1/5&8/15\end{pmatrix}.           \tag{6.2}
\]

For `C=(e_1,e_2)`,

\[
 W(C^*DC)^{-1}W^*=\operatorname {diag}(1/2,1/3),            \tag{6.3}
\]

and subtracting `(1/2)R` leaves a positive-semidefinite matrix of determinant
zero.  This is a valid sharp `gamma=1/2` certificate.  Any larger tested
`gamma` fails, while `gamma=0` is rejected as vacuous.

### 6.2 Count is not rank

With the same `D,A`, use

\[
 C=(e_1,(0,-1,1)^T),\qquad
 AC=\begin{pmatrix}1&1\\0&0\end{pmatrix}.                  \tag{6.4}
\]

There are as many columns as rows, but `e_2` is an exact left-null witness.

### 6.3 Coordinate scaling and small full rank

An invertible rational coordinate change of (6.3) leaves the Gram-corrected
frame unchanged while changing the raw determinant.  Separately,
`diag(1,epsilon)` has full row rank for every positive rational `epsilon`,
but its frame floor is `epsilon^2`.  Full rank alone therefore gives no
uniform quantitative reserve.

The replay rebuilds all matrices from primitive `D,A,C` data, checks exact
principal-minor signs and null witnesses, reconstructs the transition ceiling
from `p` at independent precision, and binds its report to the exact producer
byte stream.  Both paths use Python arbitrary-precision integers and rational
arithmetic, and both use `mpmath` for the isolated transition interval; that
shared-library limitation is serialized.  No cached physical matrix,
eigenvector, zeta zero, API key, or environment secret is read.

## 7. Remaining analytic target

The matched inventory `N=m` is the only displayed bandwidth without an
immediate buffered row-count obstruction.  The next physical task is not
another large point sweep.  It is a rigorous, source-normalized ball
certificate for one of the following:

1. a positive relative floor for each prescribed matched residue-class
   synthesis; or
2. a quotient/high-complement estimate that does not require row spanning.

Either route must still be combined with the actual signed high ratio,
residual negative feature, source metric, and both parity sectors.  Equation
(5.2) of `DIRECT_RH_ATTACK.md` remains open.
