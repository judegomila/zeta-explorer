# The next even Sobolev rung and its exact generic obstruction

## Scope and outcome

This note attacks the next even residual, `(N,epsilon)=(2,0)`, in the
two-generator criterion of `THETA_SOBOLEV_AUXILIARY_NEXT.md`.  It keeps

\[
 W(t)=\widehat\psi(t)=2\Xi(t)                                  \tag{1}
\]

and the exact `2 pi` normalization used throughout that branch.

There are four conclusions.

1. For

   \[
   q(t)=t^4+at^2+b,                                           \tag{2}
   \]

   the five scalars, the actual signed-residual coefficients, and the
   denominator-free numerator are obtained exactly.  A fixed `3 by 3`
   positive moment Gram gives a compact geometric form of the whole
   criterion.
2. The first-even discriminant mechanism does leave real structure at this
   rung: it controls the ordinary degree-six escape of the new numerator,
   and the weighted leading term is one square times the same positive
   first-even coefficient.  It does not control the full bivariate
   polynomial.
3. This failure is genuine, not just an algebraic inconvenience.  The
   positive Fourier source

   \[
   W_G(t)=e^{-t^2}+16e^{-4t^2}                                \tag{3}
   \]

   has an invertible old signed block, but its **actual** monic residual (2)
   has a strictly negative two-generator margin.  The counterexample is
   proved by exact radical formulas and rational enclosures, not floating
   quadrature.
4. A necessary complete-theta anchor at `a=b=0` does hold analytically.  It
   follows from exact first-two-orbit incomplete-gamma bounds plus one
   geometric bound containing every orbit `n>=3`.  Thus the Gaussian
   obstruction does not falsify the theta rung; it proves that additional
   complete-theta correlation is indispensable.

The actual complete-theta `(2,0)` five-scalar condition remains open.  No
target equivalence, higher-rung sign, or RH conclusion is claimed.

## 1. The actual old-data residual

Write the signed target moments as `mathsf M_j`.  The stipulated old block
at `(N,epsilon)=(2,0)` is

\[
 \mathsf B=
 \begin{pmatrix}
  \mathsf M_0&\mathsf M_1\\
  \mathsf M_1&\mathsf M_2
 \end{pmatrix}.                                                \tag{4}
\]

Assume exactly the usual domain condition

\[
 \mathfrak d:=\det\mathsf B
 =\mathsf M_0\mathsf M_2-\mathsf M_1^2\ne0.                  \tag{5}
\]

Signed Galerkin orthogonality of (2) against `1` and `t^2` is

\[
 \mathsf B\binom ba=-\binom{\mathsf M_2}{\mathsf M_3}.        \tag{6}
\]

Consequently the actual coefficients are

\[
 \boxed{
 a={\mathsf M_1\mathsf M_2-\mathsf M_0\mathsf M_3
       \over\mathfrak d},\qquad
 b={\mathsf M_1\mathsf M_3-\mathsf M_2^2
       \over\mathfrak d}.}                                   \tag{7}
\]

No sign of `mathsf B` is used in (5)--(7).  In particular, estimating `a`
and `b` from a positive surrogate moment problem would change the residual
and would not prove the desired rung.

## 2. Exact five-scalar numerator

Put

\[
 m_j=\int_{\mathbb R}t^{2j}W(t)^2dt
 =2\pi\|\psi^{(j)}\|_2^2\qquad(0\leq j\leq5).                \tag{8}
\]

Direct expansion of the five positive-weight scalars gives

\[
 \begin{aligned}
 A={}&4a^2m_1+16am_2+16m_3,\\
 B={}&2abm_0+14am_2+(2a^2+12b)m_1+12m_3,\\
 C={}&b^2m_0+2abm_1+(a^2+2b)m_2+2am_3+m_4,\\
 D={}&b^2m_1+2abm_2+(a^2+2b)m_3+2am_4+m_5,\\
 E={}&2abm_1+(2a^2+4b)m_2+6am_3+4m_4.
 \end{aligned}                                                \tag{9}
\]

As before, set

\[
 \Delta=AD-E^2>0,\qquad
 u=-{A+B\over2},\qquad v=-{C+2E\over2}.                       \tag{10}
\]

Here

\[
 \begin{aligned}
 u={}&-abm_0-(3a^2+6b)m_1-15am_2-14m_3,\\
 v={}&-{1\over2}\{b^2m_0+6abm_1+(5a^2+10b)m_2
                  +14am_3+9m_4\}.
 \end{aligned}                                                \tag{11}
\]

Define the polynomial

\[
 \boxed{
 \mathcal N(a,b)=Du^2-2Euv+Av^2+u\Delta.}                    \tag{12}
\]

Since the inverse of the `2 by 2` Gram matrix is explicit,

\[
 \boxed{
 \mathcal H_{2,0}={\mathcal N(a,b)\over\Delta}.}              \tag{13}
\]

Equivalently, the denominator-free five-scalar polynomial factors as

\[
 \boxed{
 \{AC+E(A-B)\}^2-\Delta(A^2-B^2)=4A\mathcal N(a,b).}         \tag{14}
\]

Thus the exact next-even obligation is `mathcal N(a,b)>=0` at the signed
coefficients (7).  Equation (12), not separate estimates of the five
scalars, is the correlated object that must be controlled.

## 3. A fixed `3 by 3` projection geometry

Use the fixed odd monomial basis `(tW,t^3W,t^5W)` and define

\[
 G=\begin{pmatrix}
 m_1&m_2&m_3\\
 m_2&m_3&m_4\\
 m_3&m_4&m_5
 \end{pmatrix},\qquad
 d=\begin{pmatrix}2a\\4\\0\end{pmatrix},\qquad
 e=\begin{pmatrix}b\\a\\1\end{pmatrix}.                    \tag{15}
\]

The positive moment matrix `G` is strictly positive definite.  Moreover,

\[
 A=d^TGd,\qquad E=d^TGe,\qquad D=e^TGe.                      \tag{16}
\]

Since

\[
 d\mathbin\times e
 =2k,\qquad
 k=\begin{pmatrix}2\\-a\\a^2-2b\end{pmatrix},              \tag{17}
\]

the Gram determinant is

\[
 \boxed{\Delta=4k^T\operatorname {adj}(G)k.}                 \tag{18}
\]

Let `Y=qW'` and put

\[
 y=-{1\over2}
 \begin{pmatrix}
 5m_2+3am_1+bm_0\\
 7m_3+5am_2+3bm_1\\
 9m_4+7am_3+5bm_2
 \end{pmatrix}.                                               \tag{19}
\]

Integration by parts says that `y` is precisely the vector of inner
products of `Y` with the fixed basis.  In particular,

\[
 u=d^Ty,\qquad v=e^Ty.                                      \tag{20}
\]

The `G`-orthogonal complement of `span{d,e}` is generated by `G^(-1)k`.
Therefore

\[
 \boxed{
 \mathcal H_{2,0}
 =y^TG^{-1}y
 -{(y^TG^{-1}k)^2\over k^TG^{-1}k}
 +d^Ty.}                                                      \tag{21}
\]

The first two terms in (21) are exactly the squared norm of the projection
of `Y` onto `span{q'W,tqW}`.  Positive Gram geometry controls that projection
from above and proves its nonnegativity, but it does not pay the signed last
term `d^Ty=u`.  This is the precise higher-even obstruction to a bare Gram
argument.

## 4. What survives from the first-even discriminant

Although `mathcal N` is bivariate, its extreme pieces retain the earlier
quadratic.  Define

\[
 \begin{aligned}
 L&=m_0^2m_3-6m_0m_1m_2+9m_1^3,\\
 R&=-2m_0m_1m_3+6m_0m_2^2-12m_1^2m_2,\\
 T&=m_1(7m_2^2-3m_1m_3),\\
 Q_1(c)&=Lc^2+Rc+T.
 \end{aligned}                                                \tag{22}
\]

This is exactly the first-even numerator of
`NEXT_LOW_THETA_SOBOLEV_NEXT.md`.  The new numerator is quartic in `b`, and

\[
 [b^4]\mathcal N=4L.                                          \tag{23}
\]

Its ordinary total-degree-six part is

\[
 \boxed{
 [\deg6]\mathcal N
 =a^4\{Lb^2-Rab+Ta^2\}
 =a^6Q_1(-b/a).}                                              \tag{24}
\]

Thus the proved complete-theta first-even theorem controls the `b=O(a)`
escape of the next numerator.  Under the natural weights
`deg(a)=1`, `deg(b)=2`, the leading part is instead

\[
 \boxed{[\operatorname {wt}8]\mathcal N
 =L b^2(a^2-2b)^2.}                                          \tag{25}
\]

This controls every weighted escape except the two characteristic branches
`b=0` and `b=a^2/2`; lower weighted pieces decide those branches.  Hence the
first-even discriminant supplies coercive information but is not, by
itself, an induction.

There is also a simple fixed coefficient anchor.  At `a=b=0`,

\[
 \boxed{
 \mathcal N(0,0)=4m_3(11m_4^2-7m_3m_5).}                    \tag{26}
\]

Any all-coefficient theta proof must therefore include

\[
 7\|\psi^{(3)}\|_2^2\|\psi^{(5)}\|_2^2
 <11\|\psi^{(4)}\|_2^4.                                     \tag{27}
\]

The next section proves this necessary theta inequality exactly.  It still
does not control all `(a,b)`.

## 5. The complete-theta anchor includes every orbit

Retain the complete derivative orbits

\[
 \phi_n^{(j)}(h)=4e^{h/2}P_j(\pi n^2e^{2h})
 e^{-\pi n^2e^{2h}},\qquad
 \psi^{(j)}=\sum_{n\geq1}\phi_n^{(j)}.                       \tag{28}
\]

The recurrence

\[
 P_{j+1}={P_j\over2}+2z(P_j'-P_j)                             \tag{29}
\]

gives, beyond the polynomials already listed in the first-even note,

\[
 \begin{aligned}
 P_4(z)={}&32z^6-528z^5+2588z^4-4256z^3
            +{15465\over8}z^2-{1875\over16}z,\\
 P_5(z)={}&-64z^7+1456z^6-10720z^5+30510z^4
            -{126121\over4}z^3+{142935\over16}z^2
            -{9375\over32}z.
 \end{aligned}                                                \tag{30}
\]

Let

\[
 U_j=\|\phi_1^{(j)}+\phi_2^{(j)}\|_{L^2(0,\infty)}^2.        \tag{31}
\]

Exactly as before, each `U_j` is the sum of the `(1,1)`, twice the `(1,2)`,
and the `(2,2)` pairings

\[
 8\int_1^\infty x^{-1/2}P_j(\pi m^2x)P_j(\pi n^2x)
 e^{-\pi(m^2+n^2)x}dx.                                       \tag{32}
\]

Put

\[
 J_d(\lambda)=\int_1^\infty x^{d-1/2}e^{-\lambda x}dx.
\]

The exact recurrence and signed-remainder enclosure are

\[
 J_d={e^{-\lambda}\over\lambda}
 +{d-1/2\over\lambda}J_{d-1},                                \tag{33}
\]

and

\[
 \begin{aligned}
 e^{-\lambda}\sum_{r=0}^4
 {(-1)^r(2r-1)!!\over2^r\lambda^{r+1}}
 -{945e^{-\lambda}\over32\lambda^6}
 <J_0
 <e^{-\lambda}\sum_{r=0}^4
 {(-1)^r(2r-1)!!\over2^r\lambda^{r+1}}.
 \end{aligned}                                                \tag{34}
\]

Rational outward evaluation of (32)--(34) at
`lambda=2pi,5pi,8pi`, using the Machin-series enclosure for `pi` and the
positive Taylor series through order 120 with its geometric remainder,
uses

\[
 3.141592653589793<\pi<3.141592653589794
\]

and gives

\[
 \boxed{
 558300<U_4<568700,\qquad
 42100000<U_5<45800000.}                                     \tag{35}
\]

For `z>=9pi`, direct coefficient grouping in (30) gives

\[
 |P_4(z)|<32z^6,\qquad |P_5(z)|<64z^7.                      \tag{36}
\]

For example, `P_4` is positive there and `32z^6-P_4` is a sum of
positive grouped pairs; `P_5` is negative there and `P_5+64z^7` is a sum
of positive grouped pairs.  The uniform orbit estimate is consequently

\[
 \|\phi_n^{(j)}\|_{2,+}
 \leq
 {\sqrt8\,2^{j+1}\pi^{j+3/2}n^{2j+3}e^{-\pi n^2}
  \over\sqrt{2-(2j+7/2)/(\pi n^2)}}
 \qquad(j=4,5).                                                \tag{37}
\]

For `n>=3`, consecutive right sides have ratio at most

\[
 \left({4\over3}\right)^{13}e^{-7\pi}<{1\over2}.            \tag{38}
\]

The `n=3` terms in (37), bounded by the same rational exponential series,
give the complete tails

\[
 \left\|\sum_{n\geq3}\phi_n^{(4)}\right\|_{2,+}<{1\over125},
 \qquad
 \left\|\sum_{n\geq3}\phi_n^{(5)}\right\|_{2,+}<{21\over50}.
                                                                    \tag{39}
\]

Thus no theta index is discarded.  Combining (35), (39), and the reverse
triangle inequality gives, with
`n_j=||psi^(j)||_(2,+)^2`,

\[
 \boxed{558000<n_4<569000,\qquad
        42000000<n_5<46000000.}                               \tag{40}
\]

The preceding first-even proof already established the all-orbit bound

\[
 8900<n_3<9050.                                                \tag{41}
\]

Whole-line factors cancel, and the remaining comparison is rational:

\[
 \begin{aligned}
 11n_4^2-7n_3n_5
 &>11(558000)^2-7(9050)(46000000)\\
 &=510904000000>0.                                            \tag{42}
 \end{aligned}
\]

This proves (27), and hence `mathcal N(0,0)>0`, directly from the complete
theta sum.  It is an analytic anchor, not a finite-orbit sign experiment.

## 6. An actual-residual positive-source counterexample

Consider (3).  Its inverse Fourier transform in convention (1) is

\[
 \psi_G(h)={e^{-h^2/4}\over2\sqrt\pi}
 +{4e^{-h^2/16}\over\sqrt\pi}>0.                             \tag{43}
\]

Thus the obstruction remains inside the class of positive, even, analytic
Schwartz Fourier sources.

After removing a common positive factor, the first four signed target
moments are

\[
 \begin{aligned}
 S_0&={256\sqrt5\over25}+{513\sqrt2\over2},\\
 S_1&=-{16\sqrt5\over125}+{129\sqrt2\over8},\\
 S_2&=-{48\sqrt5\over125}+{99\sqrt2\over32},\\
 S_3&=-{228\sqrt5\over625}+{135\sqrt2\over128}.
 \end{aligned}                                                \tag{44}
\]

The old block is invertible, indeed positive definite, because

\[
 \boxed{
 S_0S_2-S_1^2
 ={52365989\over50000}-{7836\sqrt {10}\over125}>0.}          \tag{45}
\]

Using `S_j` in the actual residual formula (7) gives

\[
 -0.213700<a<-0.213694,\qquad
 0.0033590<b<0.0033594.                                      \tag{46}
\]

For completeness, after removing the common positive factor `sqrt(pi)`,
the positive moments (8) are

\[
 \begin{aligned}
 m_0&={64\sqrt5+645\sqrt2\over10},&
 m_1&={128\sqrt5+825\sqrt2\over200},\\
 m_2&={768\sqrt5+3375\sqrt2\over4000},&
 m_3&={1536\sqrt5+5625\sqrt2\over16000},\\
 m_4&={43008\sqrt5+196875\sqrt2\over640000},&
 m_5&={3096576\sqrt5+26578125\sqrt2\over51200000}.
 \end{aligned}                                                \tag{47}
\]

Removing either common positive factor does not change the residual
coefficients or any sign in (13).

All quantities now lie in the explicit radical field
`Q(sqrt(2),sqrt(5))`.  Substitute (44) and (47) into (7), (9)--(12), collect
the radical coefficients exactly, and use

\[
 1.4142<\sqrt2<1.4143,\qquad
 2.2360<\sqrt5<2.2361,\qquad
 3.1622<\sqrt {10}<3.1623.                                   \tag{48}
\]

Rational outward evaluation gives

\[
 \boxed{
 2.167<\Delta<2.170,\qquad
 -0.773<\mathcal N(a,b)<-0.714.}                              \tag{49}
\]

In particular, the denominator is strictly positive while the exact
numerator is strictly negative.  Therefore the actual old-data residual for
this positive Gaussian source obeys

\[
 \boxed{\mathcal H_{2,0}<0.}                                  \tag{50}
\]

This is a counterexample to the proposed **generic proof route**, not to the
complete-theta rung or its target pivot.

## 7. Exact boundary left for the complete theta source

Equations (12), (21), and (50) rule out deriving the next-even condition
from evenness, Schwartz decay, positivity of the inverse Fourier source,
old-block invertibility, and positive moment/Gram geometry alone.  Those
inputs all hold in the counterexample.

A complete-theta proof must add arithmetic not shared by (43).  Two exact
noncircular targets remain:

1. prove the bivariate source polynomial `mathcal N(a,b)` positive for all
   real `(a,b)`, using (24)--(25) for escape control and joint complete-orbit
   bounds for its lower pieces; or
2. retain the signed theta formulas (7), enclose their **correlated**
   coefficient pair, and prove `mathcal N(a,b)>0` without separating the
   cancellations in (12).

The anchor (42) shows that one required high-derivative theta inequality is
already available.  The missing step is the joint lower-piece compensation
away from `a=b=0`.  Replacing that step by a finite sampled check would not
prove the rung.
