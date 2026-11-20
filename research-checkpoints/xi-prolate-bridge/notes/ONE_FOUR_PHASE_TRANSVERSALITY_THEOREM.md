# Exact universal phase transversality on the primitive `1:4` hull

## 0. Outcome and fail-closed boundary

This note closes the first primitive non-antipodal two-frequency phase
problem beyond the short-gap range.  Fix `B, omega, r_1, r_4 > 0`, put

\[
 b_n=(B+in\omega)^{-2},\qquad n\in\{1,4\},             \tag{0.1}
\]

and, on `z=e^(it)`, define

\[
 \begin{aligned}
 P(t)&=2\Re\{r_1b_1z+r_4b_4z^4\},\\
 V(t)&=2\Re\{r_1b_1^2z+r_4b_4^2z^4\},\\
 W(t)&=2\Re\{r_1b_1^3z+r_4b_4^3z^4\},\\
 {\cal C}(t)&=P(t)W(t)-V(t)^2.
 \end{aligned}                                      \tag{0.2}
\]

The exact theorem is

\[
 \boxed{\text{some phase has }P>0\text{ and }{\cal C}<0.} \tag{0.3}
\]

It holds for every positive parameter choice on the abstract primitive
`1:4` hull, even though the relation `(4,-1)` has odd coordinate sum and
the hull has no global sign-flipping antipode.

The theorem is only an abstract finite-edge phase statement.  It does
**not** assert that an actual attained zeta edge is finite, has exactly two
positive ordinates, or has ordinate ratio `1:4`.  No such actual-zeta
geometry is proved here.  The result proves neither RH nor its negation, no
Lambda bound, no routing contraction, no positive full Laplacian, and not
equation (5.2) of `DIRECT_RH_ATTACK.md`.  The formal state remains
`P0_INVALIDATED`.  Primitive `1:q` problems for even `q >= 6`, three or
more locked frequencies, and the arbitrary finite phase-locked problem
remain open.

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

Positive scaling reduces to

\[
 B=r_1=1,\qquad x={\omega\over B}>0,\qquad
 R={r_4\over r_1}>0,\qquad s=x^2,\quad u=R^2,          \tag{1.1}
\]

with

\[
 a=(1+ix)^{-2},\qquad c=(1+4ix)^{-2},\qquad
 A=\overline a,\quad C=\overline c.                  \tag{1.2}
\]

Multiplication of the Laurent polynomials for `P` and `V` by `z^4`
gives the self-inversive octics

\[
 \begin{aligned}
 F(z)&=Rc z^8+a z^5+A z^3+RC,\\
 G(z)&=Rc^2 z^8+a^2 z^5+A^2 z^3+RC^2.
 \end{aligned}                                      \tag{1.3}
\]

Their unit-circle roots are exactly the zeros of `P` and `V`.

At a sign-changing zero of `P`,

\[
 {\cal C}=-V^2.                                      \tag{1.4}
\]

Thus failure of (0.3) would force every sign-changing zero of `P` to be a
zero of `V`.  Since `P` is nonzero, continuous, periodic, and has mean
zero, it has at least two distinct sign-changing zeros.  The rest of the
proof shows that every parameter choice capable of supplying two common
zeros actually makes `P` change sign at least four times.

## 2. Every common root lies over a quadratic in `y=z^3`

Put

\[
 L=cF-G                                                   \tag{2.1}
\]

and form the exact sparse combination

\[
 H=(Rc z^3+a)L-a(c-a)F.                                  \tag{2.2}
\]

Direct expansion gives

\[
 H(z)=h_2z^6+h_1z^3+h_0,                                \tag{2.3}
\]

where

\[
 \begin{aligned}
 h_2&=RAc(c-A),\\
 h_1&=aA(a-A)+R^2cC(c-C),\\
 h_0&=RaC(a-C).
 \end{aligned}                                          \tag{2.4}
\]

Here `h_2 != 0`: otherwise `c=A`, which would imply
`1+4ix=+/- (1-ix)`, impossible for `x>0`.  Consequently every common root
of `F,G` lies over one of the at most two roots of

\[
 h_2y^2+h_1y+h_0=0,\qquad y=z^3.                         \tag{2.5}
\]

For a fixed `y`, write

\[
 F=z^2U(y)+T(y),\qquad
 U(y)=Rcy^2+ay,\qquad T(y)=Ay+RC.                        \tag{2.6}
\]

If `(U,T)!=(0,0)`, equations `z^3=y` and `F=0` determine at
most one `z`: `z^2=-T/U`, and then `z=y/z^2`.  In the exceptional case
`U=T=0`, `F` vanishes on all three cube-root lifts.  But if `G` vanished
at two distinct lifts, writing `G=z^2U_2(y)+T_2(y)` and subtracting would
force `U_2=T_2=0`.  At the exceptional root

\[
 y=-{RC\over A},\qquad R={|a|\over|c|},                 \tag{2.7}
\]

one has

\[
 T_2=RC(C-A)\neq0.                                      \tag{2.8}
\]

Indeed `C=A` is equivalent to `c=a`; that would give
`1+ix=+/- (1+4ix)`, also impossible for `x>0`.

Thus a fixed `y` supports at most one common root of `F,G`, including the
exceptional case.  We have the global exact bound

\[
 \boxed{F\text{ and }G\text{ have at most two distinct common roots}.} \tag{2.9}
\]

In particular, a putative failure must use both distinct roots of (2.5).

## 3. Exact lift compatibility and quadratic divisibility

For fixed `y`, the three values `z^2` with `z^3=y` are the roots of
`w^3-y^2`.  Hence

\[
 \prod_{z^3=y}F(z)=T(y)^3+y^2U(y)^3=:K(y).              \tag{3.1}
\]

If failure supplied two distinct common roots, their `y` values would be
the two distinct roots of (2.5), and both would be roots of `K`.  Therefore

\[
 \boxed{h_2y^2+h_1y+h_0\mid K(y)}.                     \tag{3.2}
\]

This is a necessary condition only; the multiplier in (2.2) can vanish at
(2.7), so the exceptional lift must later be substituted back into `G`.

To perform (3.2) over integers, multiply `a,c` by the common positive
denominator

\[
 (1+s)^2(1+16s)^2.                                     \tag{3.3}
\]

Equivalently use

\[
 \widehat a=(1-s-2ix)(1+16s)^2,\qquad
 \widehat c=(1-16s-8ix)(1+s)^2.                        \tag{3.4}
\]

This changes neither `F=G=0` nor (3.2).  Fraction-free pseudo-division
gives

\[
 h_2^7K\equiv L_1y+L_0\pmod {h_2y^2+h_1y+h_0}.         \tag{3.5}
\]

After removing factors nonzero for `x,R>0`, its four real equations are
integer bivariate polynomials

\[
 f_0(s,u)=f_1(s,u)=f_2(s,u)=f_3(s,u)=0,                \tag{3.6}
\]

with `(deg_s,deg_u)` respectively

\[
 (32,6),\quad(32,6),\quad(40,7),\quad(40,7).           \tag{3.7}
\]

More precisely, the removed factors are

\[
 \begin{array}{c|c}
 \Re L_0&x^8R^4(s+1)^{18}(s+1/16)^{18}\\
 \Im L_0&x^7R^4(s+1)^{18}(s+1/16)^{18}\\
 \Re L_1&x^8R^3(s+1)^{14}(s+1/16)^{14}\\
 \Im L_1&x^7R^3(s+1)^{14}(s+1/16)^{14}.
 \end{array}                                          \tag{3.8}
\]

The regression constructs the four `f_j` directly from (3.4)--(3.5); no
floating coefficient is stored or used.

## 4. Deterministic exact projection certificate

Take the following three fixed pairs of integer linear combinations of
`(f_0,f_1,f_2,f_3)`:

\[
 \begin{array}{c|c}
 (1,2,3,5)&(7,11,13,17)\\
 (19,23,29,31)&(37,41,43,47)\\
 (53,59,61,67)&(71,73,79,83).
 \end{array}                                          \tag{4.1}
\]

Let `R_1,R_2,R_3 in Z[s]` be their three resultants in `u`.  Each has
degree `542`.  The exact common divisor is

\[
 \boxed{
 D(s)=s^4(s+1)^{150}(16s+1)^{76}A_{22}(s)^2B_{19}(s)^3.} \tag{4.2}
\]

This is not inferred from numerical stabilization.  The regression gives
the following deterministic certificate.

1. The largest absolute coefficient among the six fixed combination
   polynomials has bit length `206`.  Every coefficient of a `14 x 14`
   Sylvester determinant is bounded by

   \[
    14!\,41^{14}C^{14}<2^{2983}.                       \tag{4.3}
   \]

2. Modular interpolation at `150` consecutive primes beginning with
   `1000003` gives a CRT modulus of bit length `2990`, larger than twice
   the bound in (4.3).  Centered reconstruction is therefore the unique
   exact integer reconstruction, not a heuristic rational recovery.  The
   three reconstructed resultants have maximum coefficient bit lengths
   `2410,2418,2438`.
3. Exact division in `Q[s]` gives zero remainder for `D|R_j`, with all
   three quotients of degree `211`.
4. At the stated good prime `p=1000003`, all relevant leading
   coefficients remain nonzero, the three quotient degrees remain `211`,
   and their gcd has degree zero.  Equivalently the full modular gcd is
   exactly the monic reduction of `D`, of degree `331`.

The degree-preserving good-prime calculation is an upper bound on the
characteristic-zero gcd, while exact division is the matching lower bound.
Thus (4.2) is an exact equality.  Since `s>0`, every solution of (3.6)
projects to a root of `A_22B_19`.

The primitive polynomials, in ascending coefficient order, are

\[
\begin{aligned}
A_{22}={}&[1360,115736,4254025,82881760,779447045,-353413835,\\
&-87068768619,-787343072055,-1153130554575,20541499047585,\\
&89926191488475,-173299299276987,-1153131765850865,\\
&1568325646562255,5164077479972215,-13700312433186645,\\
&12941135831418555,-6093019025096445,1520789944741520,\\
&-197655894310745,12341642524400,-309507026688,1998950400],
                                                               \tag{4.4}\\
B_{19}={}&[-2160,-45480,258805,21691870,362475465,2583842440,\\
&-7503727430,-366026551980,-3879605283270,-20620549071840,\\
&-40962341556975,117551322457150,623910742489261,\\
&-143409733259376,-2502674934555392,3097986513571840,\\
&-1331208639283200,213968193847296,-10347532517376,\\
&65229815808].                                           \tag{4.5}
\end{aligned}
\]

Squarefree Sturm sequences give exactly `12` positive roots for `A_22`
and `9` for `B_19`.  Also `gcd(A_22,B_19)=1`.  The regression isolates
every root with exact rational endpoints.

## 5. The `A_22` component: exactly eighteen positive branches

Reduction of (3.6) over `Q[s]/(A_22)` has a monic gcd

\[
 Q_A(s,u)=u^2+q_1(s)u+q_0(s).                         \tag{5.1}
\]

This triangular statement is exact.  The regression reconstructs the
degree-`<22` rational coefficients of `q_0,q_1`, verifies exact division
of all four `f_j` modulo `A_22`, and then proves that no further common
factor remains: the first two degree-four cofactors have exact
quotient-field Euclidean degree trace

\[
 4\longrightarrow3\longrightarrow2\longrightarrow1
 \longrightarrow0,                                   \tag{5.2}
\]

ending in a nonzero constant.  As defense in depth, the regression also
checks that `A_22` remains irreducible and that the original four-polynomial
gcd has degree two at the good prime `1153`.  Thus (5.1) is the exact
characteristic-zero gcd, without relying on specialization alone.

Exact interval evaluation on the twelve positive Sturm isolators gives

\[
 q_1<0,\qquad q_1^2-4q_0>0,                           \tag{5.3}
\]

and the signs of `q_0` alternate `+,-,+,-,...,+,-`.  Hence the numbers of
positive `u` lifts are

\[
 2,1,2,1,2,1,2,1,2,1,2,1,                            \tag{5.4}
\]

for a total of exactly eighteen.  Rounded values are listed below only to
identify the exact isolating boxes; none is a proof premise.

| `x=sqrt(s)` | positive `R=sqrt(u)` branches |
|---:|---:|
| `0.334917904820511` | `2.155621585747878`, `6.897443565148542` |
| `0.489288546076059` | `14.303027206125329` |
| `0.640274717453572` | `14.817703292074988`, `41.657706348407521` |
| `0.803244819941030` | `59.935872992965462` |
| `0.989566585366302` | `52.895430932736247`, `138.553395875256849` |
| `1.213167858817338` | `172.390574561062568` |
| `1.495344585229307` | `141.589530658761624`, `355.905390945195887` |
| `1.873267349338548` | `413.770621964473688` |
| `2.420442372193128` | `334.078841692960134`, `819.910477940793134` |
| `3.307676544800258` | `964.839190167948943` |
| `5.046654434438854` | `864.117467136868527`, `2094.33506271358264` |
| `10.194691202347945` | `3402.99687908526751` |

Repeated `A_22` roots and repeated `u` lifts are absent: `A_22` is
squarefree and (5.3) is strict on every isolator.

## 6. The `B_19` component is multiplier-degenerate

The second projection component factors as

\[
 B_{19}(s)=(16s^2-17s-3)B_{17}(s),                    \tag{6.1}
\]

where

\[
\begin{aligned}
B_{17}={}&[720,11080,-145215,-6348645,-85623980,-409937700,\\
&4367561550,95073000810,777748418100,2973331325700,\\
&953227903225,-28727631866925,-40096451433312,\\
&121802432584960,-69836547440640,12691238092800,\\
&-642389114880,4076863488].                            \tag{6.2}
\end{aligned}
\]

The quadratic is irreducible over `Q` because its discriminant is `481`,
and `B_17` is irreducible modulo `1069`.  Exact quotient-field reduction
on both factors gives the single lift

\[
 u=\left({1+16s\over1+s}\right)^2.                    \tag{6.3}
\]

This lift is complete in characteristic zero.  After its exact division,
the first two degree-five cofactors have quotient-field Euclidean degree
traces

\[
 5\longrightarrow2\longrightarrow1\longrightarrow0
 \quad\hbox{and}\quad
 5\longrightarrow4\longrightarrow3\longrightarrow2
 \longrightarrow1\longrightarrow0
\]

on the quadratic and `B_17` factors respectively, each ending in a
nonzero constant.  Independent good-prime checks at `1009` and `1069`
preserve the field factors and give gcd degree one.

This is precisely the exceptional amplitude equality `R=|a|/|c|` from
(2.7).  One root of (2.5) is then the multiplier-degenerate root
`y=-RC/A`.

That root supplies an actual common lift only if substitution back into
`G` gives

\[
 A^4c(C-A)^3-a^4C(a-c)^3=0.                           \tag{6.4}
\]

With the cleared coefficients (3.4), direct expansion of the left side of
(6.4) is

\[
 -54s^2(s+1)(16s+1)^9E_{12}(s).
\]

After dividing the obvious `x^4=s^2`, the nonzero scalar, and the factors
`(s+1)(16s+1)^9` (nonzero for `s>0`), the primitive compatibility
polynomial is

\[
\begin{aligned}
E_{12}={}&[-180,4015,181094,635494,-12914410,-77354780,\\
&83877890,783185514,-499088826,-677834595,411630320,\\
&-44437760,512000].                                    \tag{6.5}
\end{aligned}
\]

Exact Euclidean division gives

\[
 \gcd(B_{19},E_{12})=1.                               \tag{6.6}
\]

Thus the degenerate `y` supplies no common `F,G` lift on the `B_19`
component.  The other root of (2.5) supplies at most one, by Section 2.

The repeated-root case is also explicit.  On (6.3), the discriminant of
(2.5) has gcd with `B_19` equal to

\[
 s^2-{17\over16}s-{3\over16}.                         \tag{6.7}
\]

Its unique positive root is

\[
 s={17+\sqrt{481}\over32}.                            \tag{6.8}
\]

There `H` has only one distinct `y`, so (2.9) gives at most one common
root even before (6.6).  Hence no positive `B_19` branch can support the
two distinct common sign boundaries required by failure.

## 7. The eighteen `A_22` branches all have extra sign changes

The ratio of the high-frequency amplitude to the low-frequency amplitude
is

\[
 \rho={R|c|\over|a|}=R{1+s\over1+16s}.                \tag{7.1}
\]

Exact rational interval evaluation shows `rho>1` on seventeen of the
eighteen positive `A_22` branches.  At the eight phases satisfying

\[
 4t+\arg c=k\pi,\qquad 0\leq k<8,                     \tag{7.2}
\]

the high mode has alternating values `+/- R|c|`, while the low mode has
absolute value at most `|a|`.  Strict dominance therefore gives eight
cyclic sign changes of `P`.  Since `P` has trigonometric degree four, these
are exactly eight distinct simple sign-changing zeros.

The sole branch with `rho<1` lies in the coarse rational box

\[
 {3349\over10000}\leq x\leq {67\over200},\qquad
 {431\over200}\leq R\leq {539\over250}.               \tag{7.3}
\]

It is the lower lift in the first row of the table in Section 5.  Exact
outward rational interval evaluation at the four cyclic phases

\[
 z=1,\qquad {7+24i\over25},\qquad i,\qquad -1          \tag{7.4}
\]

gives the signs

\[
 +,-,+,-,                                               \tag{7.5}
\]

with the strict bounds

\[
 {P(1)\over2}>{49\over100},\quad
 {P((7+24i)/25)\over2}<-{1\over25},\quad
 {P(i)\over2}>{8\over25},\quad
 {P(-1)\over2}<-{93\over100}.                         \tag{7.6}
\]

Thus this branch has at least four distinct sign-changing zeros.  The
argument is insensitive to any repeated non-sign-changing roots.

Every positive `A_22` branch therefore has more than two distinct
sign-changing zeros of `P`, while (2.9) permits at most two common zeros
with `V`.  At least one sign-changing zero has `V!=0`.

## 8. Conclusion and scope

At the unshared sign-changing zero, (1.4) gives `C<0`.  Continuity on the
`P>0` side yields a nearby phase with `P>0,C<0`.  This proves (0.3) for
every positive parameter choice on the primitive `1:4` hull.

All root counts, coefficient identities, resultants, CRT bounds, exact
divisions, good-prime degree bounds, Sturm isolators, quotient-field gcds,
degeneracy exclusions, and phase signs are checked with exact integer or
rational arithmetic.  Decimal values in the branch table are labels for
exact rational isolators only.  Floating discovery searches are not proof
and are not used by the certificate.

This package changes no checkpoint status, integration artifact, replay,
source lock, or protected file.  It settles only the abstract two-frequency
`1:4` phase problem.  In particular, it makes no claim that actual zeta
zeros realize this geometry, and it leaves primitive `1:q` with even
`q>=6` and the general finite phase-locked edge open.
