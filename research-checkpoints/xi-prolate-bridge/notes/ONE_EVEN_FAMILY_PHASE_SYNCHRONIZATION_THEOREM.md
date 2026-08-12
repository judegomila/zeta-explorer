# Universal phase synchronization for the primitive `1:q` even family

## 0. Exact outcome and fail-closed boundary

Fix an even integer `q>=4` and positive `B, omega, r_1, r_q`.  Put

\[
 b_n=(B+in\omega)^{-2},\qquad n\in\{1,q\},             \tag{0.1}
\]

and, on `z=e^(it)`, define

\[
 \begin{aligned}
 P(t)&=2\Re\{r_1b_1z+r_qb_qz^q\},\\
 V(t)&=2\Re\{r_1b_1^2z+r_qb_q^2z^q\},\\
 W(t)&=2\Re\{r_1b_1^3z+r_qb_q^3z^q\},\\
 {\cal C}(t)&=P(t)W(t)-V(t)^2.
 \end{aligned}                                      \tag{0.2}
\]

The exact theorem is

\[
 \boxed{\text{some phase has }P>0\text{ and }{\cal C}<0.} \tag{0.3}
\]

The proof is parameter-uniform and uses no elimination of candidate
ratios.  A putative failure would have exactly two shared sign boundaries.
Centering those boundaries gives a real-linear two-by-two pencil with a
reciprocal parameter `h`.  The branch `0<h<1` contradicts the signs at the
two boundary midpoints.  On the branch `h>1`, the periodic resolvent
`(I+xD)^(-2)` first forces the filtered signal to have the opposite nodal
orientation.  That is impossible for `x<=1`; for `x>1` the same pencil
forces strict high-harmonic dominance, which gives at least `2q` sign
boundaries.

Together with the frozen `1:2`, common-root, antipodal, and primitive-
reduction theorems, (0.3) closes every abstract two-orbit phase hull.  For
an irrational frequency ratio the hull already contains the global
antipode.  For a rational ratio, primitive reduction gives integers
`1<=p<q`: the frozen theorem covers every primitive `p>=2`, odd `1:q` is
antipodal, `1:2` is frozen, and this note covers even `1:q` with `q>=4`.

This is an abstract phase theorem.  Its actual-zeta use is conditional on
the right edge being attained and consisting of exactly two conjugate
orbits.  No such edge geometry is proved here.  Edges with at least three
orbits, countably infinite edges, nonattained edges, full Laplacian
positivity, routing contraction, a Lambda bound, equation (5.2) of
`DIRECT_RH_ATTACK.md`, and the Riemann hypothesis all remain outside the
claim.  The formal state remains `P0_INVALIDATED`.  No status, replay,
source lock, integration manifest, or checkpoint artifact is changed.

## 1. Frozen dependencies and normalization

The deductions and exact regression are bound to these bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md` | `ae87b9100f8eea9ec9feddeec7f8343197ba5c14b25b2245afb96a2deec45fb1` |
| `notes/FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md` | `a8a51e9b7d115eed1e48a358fba0dab0556782a09e851d149c952fdd091bc5fc` |
| `notes/FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md` | `00db33f1263cbb7eeb1fed4d500d683920cd2444ccef58112b46ee67414904ff` |
| `notes/TWO_FREQUENCY_PHASE_TRANSVERSALITY_THEOREM.md` | `6a704c20640a9c113836904e91c7fafbe12bee0a03d31f623faad988bd306959` |
| `notes/SHORT_GAP_TWO_FREQUENCY_PHASE_THEOREM.md` | `60e1f3fed5218b37a03532cf48db3c26049269a7559bcbede2bf6690e43c3fc7` |
| `notes/COMMON_ROOT_LIFT_BOUND_TWO_FREQUENCY_THEOREM.md` | `ff13a51757d527bdb851c9b6d331518de8b62538cb1e2c4c3a862bb6f9b1e8f8` |
| `notes/ONE_FOUR_PHASE_TRANSVERSALITY_THEOREM.md` | `5c8596f3f674c066b72d09e747e3470435f455d721cc2b0e22b90ca102e4d0ef` |

Positive scaling reduces the new argument to

\[
 B=r_1=1,\qquad x={\omega\over B}>0,\qquad
 R={r_q\over r_1}>0,                               \tag{1.1}
\]

with

\[
 a=(1+ix)^{-2},\qquad c=(1+iqx)^{-2},\qquad
 A_0=\overline a,\quad C_0=\overline c.             \tag{1.2}
\]

Thus

\[
 \begin{aligned}
 P(t)&=2\Re\{ae^{it}+Rce^{iqt}\},\\
 V(t)&=2\Re\{a^2e^{it}+Rc^2e^{iqt}\}.
 \end{aligned}                                      \tag{1.3}
\]

The positive normalization changes none of the signs in (0.3).

## 2. Failure has exactly two shared sign boundaries

At a sign-changing zero `t_0` of `P`,

\[
 {\cal C}(t_0)=-V(t_0)^2.                            \tag{2.1}
\]

If `V(t_0)!=0`, strict negativity persists in a neighborhood and the
positive side of the `P` sign change gives (0.3).  Therefore failure of
(0.3) forces `V=0` at every sign-changing zero of `P`.

The first harmonic of `P` is nonzero, so the frozen distinct-sign
Sturm--Hurwitz lemma gives at least two distinct sign boundaries.  For the
primitive mixed-parity pair `(1,q)`, the frozen lift theorem gives at most
two distinct common phase roots of `P,V`.  Under failure, therefore, `P`
has exactly two sign-changing zeros and both are roots of `V`.

Write the two phases as

\[
 t=s-\theta,\qquad t=s+\theta,\qquad 0<\theta\leq{\pi\over2}, \tag{2.2}
\]

using the shorter circular separation.  The antipodal case
`theta=pi/2` is impossible.  Indeed, because `q` is even, evaluation at
two phases separated by `pi` makes the low harmonic change sign and the
high harmonic stay fixed.  The two `P` equations then separately force
the low and high parts to vanish; the two `V` equations do the same.  In
particular, for one unit phase `z`,

\[
 \Re(az)=\Re(a^2z)=0.                                \tag{2.3}
\]

The first equality writes `az=ir` with nonzero real `r`, while the second
has value

\[
 \Re(ira)=-r\Im a\neq0,                              \tag{2.4}
\]

a contradiction.  Hence

\[
 0<\theta<{\pi\over2}.                               \tag{2.5}
\]

## 3. Centered root equations and all denominator degeneracies

Put

\[
 A=ae^{is}=L+iM,\qquad B=Rce^{iqs}=H+iN.             \tag{3.1}
\]

Adding and subtracting `P(s+theta)=P(s-theta)=0` gives

\[
 L\cos\theta+H\cos(q\theta)=0,\qquad
 M\sin\theta+N\sin(q\theta)=0.                      \tag{3.2}
\]

The low centered coordinate `L` cannot vanish under failure.  Define

\[
 Q_0(t)=\cos(t-s)-\cos\theta.                        \tag{3.3}
\]

The functions `P` and `Q_0` have the same two sign boundaries.  Their
product has one fixed weak sign and is nonzero on an open set; tangent
zeros cause no problem.  Fourier orthogonality gives

\[
 \int_0^{2\pi}P(t)Q_0(t)\,dt=2\pi L,                \tag{3.4}
\]

so `L!=0`.

Neither denominator in the following ratios can vanish.  If
`cos(q theta)=0`, the first equation in (3.2) forces `L=0`.  If
`sin(q theta)=0`, the second forces `M=0`; subtracting the two centered
`V` equations then gives

\[
 \Im(aA)\sin\theta=(\Im a)L\sin\theta\neq0,          \tag{3.5}
\]

again impossible.  We may therefore put

\[
 r_c={\cos\theta\over\cos(q\theta)},\qquad
 r_s={\sin\theta\over\sin(q\theta)},\qquad
 D=\begin{pmatrix}r_c&0\\0&r_s\end{pmatrix}.        \tag{3.6}
\]

Equations (3.2) are exactly the real-vector identity

\[
 B=-DA.                                               \tag{3.7}
\]

The two centered `V` equations give, in the same notation,

\[
 cB=-D(aA).
\]

Combining this with (3.7) yields the central common-root pencil

\[
 \boxed{cDA=D(aA).}                                   \tag{3.8}
\]

## 4. The reciprocal `h` pencil

Write

\[
 a=a_r+ia_i,\qquad c=c_r+ic_i,\qquad
 \Delta=c_r-a_r,\qquad h={r_s\over r_c}
       ={\tan\theta\over\tan(q\theta)}.             \tag{4.1}
\]

The real matrix of (3.8) is

\[
 \begin{pmatrix}
 r_c\Delta&-c_i r_s+r_c a_i\\
 c_i r_c-r_s a_i&r_s\Delta
 \end{pmatrix}.                                      \tag{4.2}
\]

Its determinant vanishes.  Division by the nonzero `r_c r_s` gives

\[
 \Delta^2+a_i^2+c_i^2-a_ic_i(h+h^{-1})=0.            \tag{4.3}
\]

Since `a_i,c_i<0`,

\[
 \boxed{
 h+h^{-1}
 =2+{|c-a|^2\over a_ic_i}>2.}                        \tag{4.4}
\]

Thus `h` is positive and belongs to one of two reciprocal branches:
`0<h<1` or `h>1`.  In fact, if

\[
 r={|c-a|\over|c-\overline a|}\in(0,1),              \tag{4.5}
\]

the two roots are `(1-r)/(1+r)` and `(1+r)/(1-r)`.

The two scalar kernel rows, after division by `r_c`, are

\[
 \begin{aligned}
 \Delta L+(a_i-c_i h)M&=0,\\
 (c_i-ha_i)L+h\Delta M&=0.
 \end{aligned}                                      \tag{4.6}
\]

When `Delta!=0`, put `tau=M/L`.  Then

\[
 \boxed{
 \tau={\Delta\over c_i h-a_i}
      ={ha_i-c_i\over h\Delta}.}                    \tag{4.7}
\]

The case `Delta=0` will be excluded explicitly before (4.7) is used in a
division estimate.

## 5. The branch `0<h<1` has extra sign boundaries

Equation (4.4) makes `h` positive, so `tan(q theta)>0`.  Let
`phi in (0,pi/2)` be the principal angle satisfying

\[
 \tan\phi=\tan(q\theta).                             \tag{5.1}
\]

If `h<1`, then

\[
 \tan\theta=h\tan\phi<\tan\phi,\qquad
 \theta<\phi.                                       \tag{5.2}
\]

Consequently

\[
 |\cos(q\theta)|=\cos\phi<\cos\theta,\qquad
 r_c^2>1.                                            \tag{5.3}
\]

The first equation of (3.2) says `H=-r_cL`.  Since `q` is even, the high
harmonic has the same value at `s` and `s+pi`, while the low harmonic
changes sign.  Therefore

\[
 P(s)P(s+\pi)=4(H^2-L^2)=4L^2(r_c^2-1)>0.            \tag{5.4}
\]

But `s` and `s+pi` lie in opposite components of the circle cut by the
two boundaries `s+/-theta`.  A function with exactly those two sign
boundaries must have opposite signs there.  This contradiction eliminates
the entire branch `0<h<1`, with no parameter search.

## 6. Cyclic variation diminution of the periodic resolvent

Let `D_t=d/dt` and

\[
 S_x=(I+xD_t)^{-1}                                   \tag{6.1}
\]

on periodic trigonometric polynomials.  Its multiplier at frequency `n`
is `(1+inx)^(-1)`.  Hence the definitions (1.2)--(1.3) give the exact
filter identity

\[
 \boxed{V=S_x^2P.}                                   \tag{6.2}
\]

The first-order inverse is cyclic variation diminishing.  Indeed, let
`u=S_xf`, lift consecutive cyclic sign-changing zeros of `u` to

\[
 t_1<\cdots<t_N<t_1+2\pi,                            \tag{6.3}
\]

and put `y=e^(t/x)u`.  Then

\[
 f=(I+xD_t)u=xe^{-t/x}y'.                            \tag{6.4}
\]

On every interval between consecutive sign boundaries, `y` has one fixed
weak sign and vanishes at both endpoints.  If it is positive, the mean
value theorem gives a point with `y'>0` after the left endpoint and a
later point with `y'<0` before the right endpoint; a negative interval
gives the reverse order.  These derivative sign changes alternate and
occur in disjoint intervals.  Therefore

\[
 \operatorname{sc}(S_xf)\leq\operatorname{sc}(f),    \tag{6.5}
\]

where `sc` counts distinct cyclic sign-changing zeros.  Applying (6.5)
twice to (6.2), failure gives

\[
 \operatorname{sc}(V)\leq2.                         \tag{6.6}
\]

The two shared roots are themselves sign boundaries of `V`.  To see this,
let a shared root be a zero of `V` of order `k`.  If `k=1`, it changes
sign.  If `k=2`, then

\[
 P(t_0)=x^2V''(t_0)\neq0,                            \tag{6.7}
\]

contrary to sharing.  If `k>=3` and
`V(t)=d(t-t_0)^k+...`, then

\[
 P=(I+xD_t)^2V
   =x^2k(k-1)d(t-t_0)^{k-2}+\cdots.                 \tag{6.8}
\]

The two orders have the same parity.  Since `P` changes sign, `k` is odd,
so `V` changes sign as well.  Thus `V` has exactly the same two sign
boundaries as `P`.

## 7. Failure forces the opposite nodal orientation

The two functions cannot have the same orientation.  Put

\[
 y=e^{t/x}V.
\]

Twice applying the first-order gauge gives

\[
 \boxed{P=(I+xD_t)^2V=x^2e^{-t/x}y''.}               \tag{7.1}
\]

On an interval where `P,V` were both positive, `y` would be nonnegative
and convex, with value zero at both endpoints.  Convexity would force
`y<=0`, hence `y=0`, a contradiction.  The negative case is identical
after multiplying by `-1`.  Therefore `P,V` have opposite nodal
orientations.

As in (3.4), the product `VQ_0` has one fixed weak sign, is nonzero on an
open set, and

\[
 \int_0^{2\pi}V(t)Q_0(t)\,dt=2\pi L_2,\qquad
 L_2=\Re(a^2e^{is})=\Re(aA).                        \tag{7.2}
\]

Opposite orientations give `LL_2<0`.  Since `L!=0`, putting `tau=M/L`
in (7.2) yields the necessary failure inequality

\[
 \boxed{
 \mu:=a_r-a_i\tau<0.}                               \tag{7.3}
\]

## 8. On `h>1`, inequality (7.3) forces `x>1`

Direct calculation gives

\[
 {|c-a|^2\over a_ic_i}
 ={(q-1)^2\{4+(q+1)^2x^2\}\over4q}.                \tag{8.1}
\]

Thus the large reciprocal root satisfies

\[
 \boxed{
 h+h^{-1}=q+q^{-1}+A_qx^2,\qquad
 A_q={(q^2-1)^2\over4q}.}                           \tag{8.2}
\]

The function `u+u^(-1)` is strictly increasing for `u>1`, and its value at
`u=q` is `q+q^(-1)`.  Hence

\[
 h>q.                                                \tag{8.3}
\]

Write

\[
 \alpha=-a_i={2x\over(1+x^2)^2},\qquad
 \gamma=-c_i={2qx\over(1+q^2x^2)^2}.               \tag{8.4}
\]

Then `gamma<q alpha`, and (8.3) gives `h alpha>gamma`.  Also

\[
 \Delta
 =-{(q^2-1)x^2\{3+(q^2+1)x^2-q^2x^4\}
       \over(1+x^2)^2(1+q^2x^2)^2}.                 \tag{8.5}
\]

For `0<x<=1`, the bracket is at least `3+x^2>0`, so `Delta<0`.  The second
form in (4.7) has numerator

\[
 ha_i-c_i=-h\alpha+\gamma<0,                        \tag{8.6}
\]

and therefore `tau>0`.  Since `a_r>=0` on this range,

\[
 \mu=a_r+\alpha\tau>0,                              \tag{8.7}
\]

contradicting (7.3).  Any failure on `h>1` must consequently have

\[
 x>1.                                                \tag{8.8}
\]

## 9. For `x>1`, the high harmonic strictly dominates

Continue on `h>1`, and let `phi` be as in (5.1).  Since `h>1`,
`theta>phi`.  Write `q=2m`.  There is an integer `j` with

\[
 q\theta=j\pi+\phi.
\]

The inequality `theta>phi` excludes `j=0`, while `theta<pi/2` gives
`j<=m-1`.  Hence

\[
 \theta<{\pi\over2}-{\pi\over2q},\qquad
 v:=\tan\phi={\tan\theta\over h}
 <{1\over h}\cot{\pi\over2q}.                      \tag{9.1}
\]

The high-to-low amplitude ratio is

\[
 \rho={R|c|\over|a|}={|B|\over|A|}.                 \tag{9.2}
\]

Using `B=-r_c(L+i hM)`, `tau=M/L`, and

\[
 r_c^2={1+v^2\over1+h^2v^2},                        \tag{9.3}
\]

gives the exact identity

\[
 \boxed{
 \rho^2={1+v^2\over1+h^2v^2}
         {1+h^2\tau^2\over1+\tau^2}.}              \tag{9.4}
\]

Subtracting one shows

\[
 \operatorname{sign}(\rho^2-1)
 =\operatorname{sign}\{(h^2-1)(\tau^2-v^2)\}.      \tag{9.5}
\]

Thus it is enough to prove `h|tau|>cot(pi/(2q))`.

First exclude the deferred case `Delta=0`.  The second row of (4.6) would
give `(c_i-ha_i)L=0`.  Since `L!=0`, this says `h alpha=gamma`, impossible
because `h>q` and `gamma<q alpha`.  We may divide by `|Delta|` and use
(4.7):

\[
 h|\tau|={h\alpha-\gamma\over|\Delta|}.              \tag{9.6}
\]

The elementary bounds

\[
 \gamma\leq q\alpha,
 \qquad
 |\Delta|\leq|a_r|+|c_r|
            \leq|a|+|c|\leq{2\over1+x^2}           \tag{9.7}
\]

give

\[
 h|\tau|\geq{x(h-q)\over1+x^2}.                    \tag{9.8}
\]

Equation (8.2) has the sharper exact rearrangement

\[
 h-q=A_qx^2+{1\over q}-{1\over h}>A_qx^2,           \tag{9.9}
\]

because `h>q`.  For `x>1`, (9.8)--(9.9) imply

\[
 h|\tau|>A_q{x^3\over1+x^2}>{A_q\over2}.            \tag{9.10}
\]

For every `q>=4`,

\[
 {A_q\over2}={(q^2-1)^2\over8q}>q
 >\cot{\pi\over2q}.                                \tag{9.11}
\]

The first strict inequality is `(q^2-1)^2>8q^2`, true at `q=4` and
increasing thereafter.  The second follows from `tan u>u` on
`(0,pi/2)`.  Equations (9.1) and (9.10)--(9.11) now give

\[
 |\tau|>|v|,\qquad \rho>1.                          \tag{9.12}
\]

At the `2q` cyclically ordered phases where the high cosine in `P` equals
alternately `+1` and `-1`, the normalized low cosine has absolute value at
most one.  Strict `rho>1` therefore makes the values of `P` alternate in
sign.  The function has at least `2q` distinct sign boundaries, contrary
to the exact-two consequence of failure.

This eliminates `h>1`.  Together with Section 5 it proves (0.3).

## 10. Complete two-frequency corollary and exact scope

The new theorem closes the only family left by the frozen common-root
classification:

\[
 \boxed{
 p=1,\quad q\geq4\text{ even}
 \quad\Longrightarrow\quad
 \exists t:\ P(t)>0,\ PW(t)-V(t)^2<0.}              \tag{10.1}
\]

For rationally related positive frequencies, divide by their gcd and use
the same primitive phase circle.  The frozen results cover primitive
`p>=2`, primitive odd `1:q` by the antipode, and `1:2`; (10.1) covers the
rest.  For irrationally related frequencies, the two-dimensional hull
contains the global antipode.  Therefore every abstract two-orbit hull has
a favorable phase.

If an actual zeta right edge were separately proved to consist of exactly
two conjugate orbits, the frozen recurrence, strict-grid transfer, and
residual estimates could use this phase theorem conditionally.  Nothing in
this note proves that premise.  In particular, the theorem does not extend
to three or more locked orbits, a countable edge, or a nonattained edge and
does not change `P0_INVALIDATED`.
