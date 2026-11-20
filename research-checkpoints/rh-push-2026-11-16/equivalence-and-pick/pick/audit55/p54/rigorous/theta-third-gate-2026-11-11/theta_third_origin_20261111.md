# Third theta reduction: the origin gate at every triple of anchors

Research continuation, 11 November 2026. This note proves the strict origin
curvature inequality

\[
\boxed{\left(4n_{a,c,d}''/n_{a,c,d}\right)''(0)>0
\qquad\text{for every }a,c,d>0.}
\tag{1}
\]

All repeated-anchor cases are included. The proof uses an exact
three-anchor divided-difference formula, a one-variable matrix criterion,
a fresh rigorous theta-moment certificate, and explicit estimates on the
entire infinite anchor tail.

The divided-difference and matrix criterion apply to any later starting
pair satisfying the stated positivity hypotheses. Their theta verification
here concerns the third canonical numerator only. This origin theorem does
not by itself prove third full preservation, six-node Pick positivity,
arbitrary-depth preservation, or RH.

## 1. Fixed inputs and notation

Use the actual theta normalization of PR #53:

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}\,dt,
\qquad p(a)=F'(a)/F(a),
\qquad C(t)=\frac14\int_t^\infty s\kappa(s)\,ds.
\]

The first canonical pair satisfies

\[
n_a+a b_a=C,\qquad a n_a+4b_a''=p(a)\kappa.
\tag{2}
\]

Starting from any pair \((u,v)\), write
\(R(z)=z\mathcal Lu(z)/\mathcal Lv(z)\). The reduction at \(a>0\)
with \(r=R(a)\) is

\[
n+ab=u,\qquad an+4b''=rv,
\]

with next pair \((b,n)\). In particular, the third numerator is obtained
after three such reductions, in the order \(a,c,d\).

PR #53 at immutable commit
`5d64d45acf37f4957a8f65c036b502e1b49292d0` proves full comparison
for the second theta pair. Its general comparison implications consequently
supply positivity of the first three canonical pairs, including coincident
anchors. These facts are fixed inputs here.

Set

\[
\gamma=-\kappa''(0)/\kappa(0),\qquad
\beta=\kappa^{(4)}(0)/\kappa(0).
\]

We use the proved bounds

\[
0<\gamma<4.7,\qquad 56.8<\beta<57,\qquad
\sup_{t\in\mathbb R}\frac{|\kappa^{(12)}(t)|}{\kappa(0)}<150000000.
\tag{3}
\]

The executable recomputes the local constants. By default it also replays
PR #53's 4,096-cell proof of the last global bound and its analytic spatial
tail. The prior analytic anchor theorem supplies
\(0<a p'(a)<1/2\) for \(a\ge100\). A fresh compact integral calculation
below supplies \(p(100)>1.4\).

## 2. Exact three-anchor numerator and its symmetry

For the general-pair statements, assume even smooth starting kernels with
all exponential moments, smooth canceled dependence on positive anchors,
and strictly positive first three canonical pairs. These hypotheses
justify the transforms, origin derivatives, and coincident-anchor limits
below. They hold for the theta pairs used here by the fixed prior results.

Use squared spectral and anchor variables

\[
\lambda=z^2,\quad A=a^2,\quad C_*=c^2,\quad D=d^2,
\qquad h(\lambda)=zR(z),\quad s(\lambda)=R(z)/z.
\]

Thus \(h(\lambda)=\lambda s(\lambda)\). Brackets denote ordinary divided
differences in the displayed squared variable, with derivatives divided
by factorials at repeated arguments. Write \(V=\mathcal Lv\).
Directly transforming the canonical equations gives

\[
\mathcal L n_a=Vh[A,\lambda],\qquad
\mathcal L b_a=-aV s[A,\lambda].
\tag{4}
\]

A second reduction gives

\[
\mathcal L n_{a,c}=-\frac{a s(A)}{h[A,C_*]}Vh[A,C_*,\lambda],
\]

\[
\mathcal L b_{a,c}=
\frac{ac}{h[A,C_*]}V
\{h[A,C_*]s[A,C_*,\lambda]-s[A,C_*]h[A,C_*,\lambda]\}.
\tag{5}
\]

Substituting (5) into the third reduction and using \(h=\lambda s\)
produces

\[
\boxed{
\mathcal L n_{a,c,d}=
\frac{ac\,s[A,C_*]}{h[A,C_*]h[A,C_*,D]}
V\{h[A,C_*]h[A,C_*,D,\lambda]
-h[A,C_*,D]h[A,C_*,\lambda]\}.
}
\tag{6}
\]

This is an identity of the canceled analytic transforms, so it includes
spectral coincidences by continuation. All coefficients are independent
of the spatial variable.

For a fixed spatial point, let \(m(A)=n_{\sqrt A}(t)\). The expression
inside braces in the inverse transform is

\[
h[A,C_*]m[A,C_*,D]-h[A,C_*,D]m[A,C_*]
=
\frac{
\det\begin{pmatrix}
1&h(A)&m(A)\\
1&h(C_*)&m(C_*)\\
1&h(D)&m(D)
\end{pmatrix}}
{(C_*-A)(D-C_*)(D-A)}.
\tag{7}
\]

The last expression is symmetric in all three anchors. The factor in
(6) is positive: positivity of the first transformed pairs gives
\(h[A,C_*]>0\) and \(s[A,C_*]<0\), and positivity of the second
numerator in (5) gives \(h[A,C_*,D]<0\). Each divided difference has
its continuous interpretation on anchor diagonals.

Let

\[
x=h(A)=aR(a).
\]

It is strictly increasing; this follows from positivity of
\(\mathcal L n_a(c)/V(c)=h[A,C_*]\), including the diagonal limit.
Changing the anchor coordinate in (7) gives

\[
\boxed{n_{a,c,d}(t)=\nu(a,c,d)
\,[x_a,x_c,x_d]\bigl(\widetilde m(\cdot,t)\bigr),\qquad \nu(a,c,d)>0,}
\tag{8}
\]

where \(\widetilde m(x,t)=n_{a(x)}(t)\). For distinct anchors the factor
is precisely the factor in (6) times

\[
\frac{(x_c-x_a)(x_d-x_c)(x_d-x_a)}
{(c^2-a^2)(d^2-c^2)(d^2-a^2)}>0.
\]

The continuous factors are positive at all coincidences because the
corresponding lower-order transformed kernels are strictly positive.
Thus the third numerator, up to a positive spatially constant factor,
is a **second divided difference in the coordinate \(aR(a)\)**.

## 3. A reusable one-variable matrix criterion

This subsection applies to a general starting pair \((u,v)\), with the
anchor coordinate restricted to its range \(I=h((0,\infty))\). For the
actual theta pair this range is \((0,\infty)\). Set

\[
N(x)=n_{a(x)}(0)/v(0),\qquad \lambda(x)=a(x)^2,
\]

and use the fixed starting origin constants

\[
B_0=4u''(0)/v(0),\quad
P_0=16u^{(4)}(0)/v(0),\quad
J_0=4v''(0)/v(0).
\]

The first numerator ODE gives

\[
Y(x)=4n_{a(x)}''(0)/v(0)=\lambda N+B_0-x,
\]

\[
Z(x)=16n_{a(x)}^{(4)}(0)/v(0)=\lambda Y+P_0-xJ_0.
\tag{9}
\]

Define the symmetric matrix curve

\[
M(x)=\begin{pmatrix}N(x)&Y(x)\\Y(x)&Z(x)\end{pmatrix}.
\]

Let \(\Delta_2\) mean the second divided difference at any three anchor
coordinates. Evenness and (8) give

\[
\boxed{
\left(4n_{a,c,d}''/n_{a,c,d}\right)''(0)
=
\frac{\Delta_2N\,\Delta_2Z-(\Delta_2Y)^2}
{4(\Delta_2N)^2}.}
\tag{10}
\]

The Genocchi--Hermite formula expresses

\[
\Delta_2M=
\int_{\substack{r,s\ge0\\r+s\le1}}
M_{xx}((1-r-s)x_a+r x_c+s x_d)\,dr\,ds.
\tag{11}
\]

The simplex has area \(1/2\); this factor is included in (11). A positive
definite matrix remains positive definite after integration against this
positive nonzero measure. Therefore

\[
\boxed{M_{xx}(x)\succ0\text{ for every }x\in I
\quad\Longrightarrow\quad\text{the third-origin inequality for every triple}.}
\tag{12}
\]

Conversely, at three equal anchors \(\Delta_2M=M_{xx}/2\). If positivity
of the third numerator is already known, (8) gives \(N_{xx}>0\), and
strict positivity of the coalescent origin curvature is exactly
\(\det M_{xx}>0\). Hence (12) is an equivalence when all coalescences and
the stated positive-kernel hypotheses are included.

A direct expansion of (9) gives the simpler scalar gate

\[
\boxed{
\det M_{xx}=
N_{xx}\{2\lambda_x^2N-(x-B_0)\lambda_{xx}-2\lambda_x\}
-(2\lambda_xN_x+\lambda_{xx}N)^2.
}
\tag{13}
\]

The constants \(P_0,J_0\) disappear because their contribution in (9)
is affine in \(x\). Equations (8)--(13) are independent of the depth at
which the starting pair was obtained. Their positivity hypothesis must
still be verified for that pair; this does not furnish an unproved
induction through arbitrary depth.

For theta, \(B_0=-1\), \(P_0=12\gamma\), \(J_0=-4\gamma\), so

\[
Y=a^2N-1-x,\qquad Z=a^2Y+4\gamma(x+3).
\tag{14}
\]

## 4. Compact anchors: the actual theta-moment certificate

The first canceled numerator has the exact origin formula

\[
N(a)=\frac14\int_0^\infty(s+2p(a))
\frac{\kappa(s)}{\kappa(0)}e^{-as/2}\,ds
=\frac{O'(a)-p(a)O(a)}{2\kappa(0)},
\tag{15}
\]

where \(E(a)=\int_0^\infty\kappa(s)\cosh(as/2)ds\),
\(O(a)=\int_0^\infty\kappa(s)\sinh(as/2)ds\), and \(p=E'/E\).
To avoid conflicting coordinates, use

\[
q=(a/200)^2,\quad E(a)=e(q),\quad O(a)=(a/200)o(q),
\quad K=400\kappa(0),\quad L=200^2.
\]

Thus \(0\le q\le1/4\) covers \(0\le a\le100\). The 602 positive
coefficients through degree 300 are freshly enclosed exactly as in
PR #53, using sixteen theta terms, rigorous integrals on \([0,8]\),
and explicit omitted-theta and spatial tails. No diagnostic cache is
accepted. The positive sum bound is

\[
E(200)<4.268926856424464\cdot10^{110}.
\]

Each derivative order \(j=0,1,2,3\) has its own remainder

\[
\epsilon_j\le
E(200)\frac{(301)_j(1/4)^{301-j}}
{1-\frac14\frac{302}{302-j}},
\tag{16}
\]

where \((301)_j\) is falling factorial. These are respectively less
than \(3.44\cdot10^{-71},4.14\cdot10^{-68},4.97\cdot10^{-65},
5.95\cdot10^{-62}\), for both \(e\) and \(o\).

All primes in the following formulas denote \(q\)-derivatives:

\[
P=eo+2q(eo'-e'o),\qquad N=P/(Ke),\qquad x=2qe'/e,
\]

\[
P'=-e'o+3eo'+2q(eo''-e''o),
\]

\[
P''=-3e''o+2e'o'+5eo''+
2q(e'o''+eo'''-e'''o-e''o'),
\]

\[
Q=P'e-Pe',\quad Q'=P''e-Pe'',\quad Q_h=Q'e-2Qe',
\]

\[
S=2ee'+2q(ee''-e'^2),\quad
S'=4ee''+2q(ee'''-e'e''),\quad S_h=S'e-2Se',
\]

\[
T=e+2qe',\quad \mathcal E=SQ_h-S_hQ,\quad
\mathcal C=2SQ-S_hP,
\]

\[
\boxed{\mathcal G=
\mathcal E(2LSPe-2KS^2+KS_hT)-L\mathcal C^2e.}
\tag{17}
\]

Exact cancellation gives

\[
N_{xx}=\frac{\mathcal E e}{KS^3},\qquad
\det M_{xx}=\frac{L\mathcal G e^3}{K^2S^6}.
\tag{18}
\]

These equalities are checked symbolically. The implementation uses
separately enclosed actual derivatives from (16). It forms full
polynomial products before interval evaluation and never differentiates
an artificial interval error coefficient.

At 384-bit precision, 4,096 closed intervals covering \([0,1/4]\)
certify \(e,S,\mathcal E,\mathcal G>0\), with conservative bounds

\[
\boxed{N_{xx}>4.19\cdot10^{-7},\qquad
\det M_{xx}>1.09\cdot10^{-10}\quad(0\le a\le100).}
\tag{19}
\]

The actual returned lower bounds exceed \(4.1971550\cdot10^{-7}\)
and \(1.0968459\cdot10^{-10}\). The cleared polynomial degrees are
1,797 and 3,296. These are entire-interval inequalities, not sampled
observations. The same fresh integral model proves
\(p(100)>1.40114920559094>1.4\).

## 5. All anchors beyond 100

### 5.1 Bounds on the logarithmic derivative

Let \(s=a+1/2\) and put

\[
p=p(a),\quad v=ap'(a),\quad w=a^2p''(a),\quad
k=p+v,\quad \ell=2v+w.
\]

For \(a\ge100\), the fixed monotonicity and anchor estimates give

\[
p\ge p(100)>1.4,\qquad 0<v<1/2.
\tag{20}
\]

We also have \(|w|<0.51\). Here is an elementary derivation of the
new second-derivative bound. For \(y>0\), integral comparison of the
positive decreasing series gives

\[
-1/y^2-2/y^3\le\psi^{(2)}(y)\le-1/y^2.
\]

For \(m=1,2,3\), \(s\ge100\), and \(A_m=\sum_{n\ge2}(\log n)^m n^{-s}\),
use \(\log n\le n\) and a decreasing-series integral bound to obtain

\[
A_m\le2^{m-s}\left(1+\frac2{s-m-1}\right)<2^{4-s}.
\]

Since \(\zeta(s)>1\), differentiating its logarithm yields

\[
| (\log\zeta)'''(s)|
\le A_3+3A_2A_1+2A_1^3<2^{5-s}.
\]

Moreover \(a^2 2^{5-s}<1/100\) for \(a\ge100\): the stronger bound
with \(s\) replaced by \(a\) holds at 100 and decreases thereafter.
Now

\[
p''(a)=\frac2{s^3}+\frac2{(s-1)^3}
+\frac18\psi^{(2)}(s/2)+(\log\zeta)'''(s).
\]

The lower polygamma bound cancels the \(2/s^3\) term and gives
\(a^2p''>-.51\). The upper estimate, even after discarding the
negative polygamma term, gives

\[
a^2p''<2/a+2a^2/(a-1/2)^3+.01<.51.
\tag{21}
\]

All final numerical comparisons are exact rational checks in the script.

### 5.2 The cleared determinant and Taylor approximation

Chain differentiation of (13) gives

\[
\boxed{k^6\det M_{xx}=\mathcal T\mathcal B-\mathcal C_1^2,}
\tag{22}
\]

where now derivatives are with respect to \(a\), and

\[
\mathcal T=kN''-\ell N'/a,
\]

\[
\mathcal B=8a^2kN-2(1+ap)(k-\ell)-4ak^2,
\]

\[
\mathcal C_1=4akN'+2(k-\ell)N.
\tag{23}
\]

Also \(N_{xx}=\mathcal T/k^3\). Approximate the spatial theta kernel
by its degree-ten Taylor polynomial in (15). Writing
\(\kappa_{2j}=\kappa^{(2j)}(0)/\kappa(0)\), this yields

\[
N_0=\sum_{j=0}^5 4^j\kappa_{2j}
\left\{\frac p{a^{2j+1}}+\frac{2j+1}{a^{2j+2}}\right\}.
\tag{24}
\]

The exact Laplace coefficients are independently checked. Differentiating
(15) gives separate actual error bounds, with \(M=150000000\):

\[
|N-N_0|\le\frac{4096M}{a^{13}}\left(p+\frac{13}a\right)
<\frac{4500Mp}{a^{13}},
\]

\[
|N'-N_0'|\le\frac{4096M}{a^{14}}
\left(v+13p+\frac{182}a\right)
<\frac{61000Mp}{a^{14}},
\]

\[
|N''-N_0''|\le\frac{4096M}{a^{15}}
\left(|w|+26v+182p+\frac{2730}a\right)
<\frac{865000Mp}{a^{15}}.
\tag{25}
\]

These estimates follow directly by integrating the global Taylor remainder
\(Mt^{12}/12!\) and its additional moment weights. No derivative is
inferred from a bound on \(N-N_0\).

### 5.3 An explicit positive margin

Define \(G=p^2+pv+pw-2v^2\). Since \(p>1.4>2v\), (20)--(21) imply

\[
\frac{89}{140}p^2<G<\frac{241}{140}p^2.
\tag{26}
\]

Substituting (24) into (22) gives a finite polynomial in \(1/a\).
The terms below power six vanish exactly. The next two coefficients are

\[
\frac{64(\beta-\gamma^2)G^2}{a^6}
+\frac{384(\beta-\gamma^2)(3p+5v+w)G}{a^7}.
\tag{27}
\]

Both are positive. The first is greater than

\[
\frac{27493791}{30625}\frac{p^4}{a^6}
>897.7564\frac{p^4}{a^6}.
\]

Every remaining coefficient is bounded by its absolute monomial sum,
using

\[
\frac vp\le\frac5{14},\qquad
\frac{|w|}p\le\frac{51}{140},\qquad \frac1p\le\frac57,
\]

and freshly enclosed local constants

\[
\gamma<4.7,\quad\beta<57,\quad
|\kappa_6|<888,\quad|\kappa_8|<7973,\quad|\kappa_{10}|<716959.
\]

For a monomial \(c\,p^i v^j w^k\) of degree at most four, its absolute
value divided by \(p^4\) is at most

\[
|c|(5/14)^j(51/140)^k(5/7)^{4-i-j-k}.
\]

After including the displayed theta-constant bounds, every term is an
exact rational number. Summing all powers 8 through 24 at \(a=100\)
gives the bound

\[
602.119\,p^4/a^6.
\tag{28}
\]

Each corresponding normalized term decreases as \(a\) increases.
The replay lists all seventeen coefficient contributions. This proves
that the polynomial determinant has margin greater than
\(295.6376\,p^4/a^6\) before the Taylor remainder.

The same coefficient audit gives

\[
|\mathcal T_0|<4p^2/a^3,\quad
|\mathcal B_0|<4ap^2,\quad
|\mathcal C_{1,0}|<4p^2/a,
\quad \mathcal T_0>p^2/a^3.
\]

Equations (25) imply errors at most

\[
|\delta\mathcal T|<1250000Mp^2/a^{15},\quad
|\delta\mathcal B|<50000Mp^2/a^{11},\quad
|\delta\mathcal C_1|<350000Mp^2/a^{13}.
\]

Expanding the determinant difference therefore costs at most

\[
\left(\frac{8000000M}{a^8}
+\frac{185000000000M^2}{a^{20}}\right)\frac{p^4}{a^6}
<0.120000000001\frac{p^4}{a^6}.
\tag{29}
\]

The exact remaining coefficient exceeds \(295.5176\). Thus

\[
\boxed{
\det M_{xx}>
\frac{295p(a)^4}{a^6[p(a)+ap'(a)]^6}>0
\qquad(a\ge100).}
\tag{30}
\]

The positive \(\mathcal T_0\) bound and its much smaller error also
prove \(N_{xx}>0\) there. Together, (19) and (30) prove
\(M_{xx}\succ0\) for every positive anchor. Applying (11)--(12) proves
(1), including triples whose anchors lie on opposite sides of 100.

## 6. Replay, dependency boundary, and scope

Run without optimized Python:

```sh
python theta_third_origin_20261111.py
```

The standalone entry point recomputes all 602 moments, certifies 4,096
new compact cells, replays the prior 2,048-cell second-origin gate used by
the moment helper, and replays the global twelfth-derivative certificate.
An integrated runner may pass the freshly returned in-process
`second_compact(return_models=True)` pair into
`certify_compact(prior_models=...)` to share the same new moment enclosures
with another certificate. No persisted moment file is a proof input.

The new theorem is an all-anchor origin result for the actual theta
kernels. A separate spatial source argument is required for global
third full preservation. The reusable algebraic criterion makes that
origin problem one dimensional at any later base pair; it does not
establish positivity for all such later pairs.

For the classical divided-difference identity used in (11), see Carl de
Boor, *Divided Differences*, Surveys in Approximation Theory 1 (2005),
46--69, equation (52):
<https://pages.cs.wisc.edu/~deboor/sat/papers/2/2.pdf>.
For the polygamma series and zeta Dirichlet series used in (21), see
<https://dlmf.nist.gov/5.15> and <https://dlmf.nist.gov/25.2>.
All theta-specific inequalities in this note are either newly certified
here or explicitly identified fixed PR #53 inputs.
