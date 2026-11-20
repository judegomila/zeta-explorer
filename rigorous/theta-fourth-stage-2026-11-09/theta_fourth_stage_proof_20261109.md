# Uniform fourth-stage inequalities for the actual xi response

Research note, 9 November 2026. This proves two strict Schwarzian
inequalities on the entire positive real axis. Together with the exact
fourth-stage criterion in the companion note, they prove that every
four-node real Pick matrix of the actual xi logarithmic derivative is
positive definite. The bounded-interval proof imports published finite
zero verification. No all-orders result or RH proof is claimed.

## 1. The inequalities to prove

Use

$$
F(x)=\xi(1/2+x),\qquad L(x)=F'(x)/F(x),\qquad
h(u)=\frac{L(\sqrt u)}{\sqrt u},\qquad j(u)=u h(u).
$$

The earlier checkpoint proves the strict three-node inequalities and,
in particular, $h'<0$ and $j'>0$. The new targets are

$$
\boxed{2h'h'''-3h''{}^2>0,\qquad
       2j'j'''-3j''{}^2>0\qquad(u>0).}
\tag{1}
$$

For a function f with nonzero derivative, its Schwarzian is
$Sf=f'''/f'-(3/2)(f''/f')^2$. Thus (1) says $Sh,Sj>0$.
The companion reduction proves that, under the strict three-node base,
these signs imply strict positivity of every four-node Pick matrix.

The proof splits at $u=10^4$, or $x=\sqrt u=100$.

## 2. Exact spectral sums and imported inputs

For every centered upper-half-plane zero $\rho=\beta+i\gamma$,
$\gamma>0$, with multiplicity, set

$$
\lambda=-\rho^2=\gamma^2-\beta^2-2i\beta\gamma.
$$

The multiset of these parameters is invariant under conjugation.
The genus-zero product for $F(\sqrt u)$ gives

$$
h(u)=2\sum_\lambda\frac1{u+\lambda}.
\tag{2}
$$

The series and the derivative series used below converge absolutely and
locally uniformly on $u\ge0$. As in the preceding proof, no positivity
of a measure supported on real spectral parameters is assumed.

Let

$$
S_k(u)=\sum_\lambda(u+\lambda)^{-k},\qquad
T_k(u)=\sum_\lambda\lambda(u+\lambda)^{-k}.
$$

Differentiating (2) gives the exact identities

$$
\boxed{2h'h'''-3h''{}^2=48(S_2S_4-S_3^2),}
\tag{3}
$$

$$
\boxed{2j'j'''-3j''{}^2=48(T_2T_4-T_3^2).}
\tag{4}
$$

These sums are real by conjugation. Individual complex terms are not
treated as positive squares.

We use precisely the following previously established inputs:

- The classical strip gives $|\beta|<1/2$.
- Published finite-height verification makes $\beta=0$ when
  $0<\gamma\le H=3\cdot10^{12}$.
- The first two ordinates obey $14<\gamma_1<15$ and
  $21<\gamma_2<22$; in particular, every ordinate is greater than two.
- The preceding proof derives, directly from the xi definition at s=1,
  $$
  \sum_{\gamma>0}\gamma^{-2}
  \le h(1/4)=2+\gamma_E-\log(4\pi)<1.
  \tag{5}
  $$

The finite-height theorem is Platt--Trudgian,
[arXiv:2004.09765](https://arxiv.org/abs/2004.09765). The first-zero
enclosures are documented in
[FLINT's rigorous isolation examples](https://flintlib.org/doc/acb_dirichlet/zeta-zeros.html)
and corroborated by
[Odlyzko's primary tables](https://www-users.cse.umn.edu/~odlyzko/zeta_tables/).
Their computations are imported, not rerun here. The derivation of (5)
is in the fixed
[PR #48 curvature note](https://github.com/judegomila/mathexplorer/blob/499528b487e3249c5a35602f83343aaa53cec848/rigorous/theta-schur-kernels-2026-11-09/theta_three_node_curvature_20261109.md).

## 3. Bounded-interval proof: positive head and a controlled signed tail

Split each sum into the real head $0<\gamma\le H$ and the remaining
tail. Use superscripts 0 and e, for example $S_k=S_k^0+S_k^e$.

### 3.1 The tail terms that may safely be dropped

For $\gamma>H$,

$$
\frac{|\Im\lambda|}{\Re\lambda}
<\frac{\gamma}{\gamma^2-1/4}<\frac2\gamma<\tan(\pi/8).
$$

Thus $|\arg\lambda|<\pi/8$, and the same or a smaller angle holds
for $u+\lambda$, $u\ge0$. Consequently

$$
S_2^e>0,\quad S_4^e>0,\quad T_2^e>0,\quad T_4^e>0.
\tag{6}
$$

For the weighted sums, the argument of
$\lambda/(u+\lambda)^k$ lies between $-(k-1)\arg\lambda$ and
$\arg\lambda$, with the orientation reversed for negative angles.
For $k=2,4$ this stays strictly inside $(-\pi/2,\pi/2)$.
Equation (6) follows by conjugate summation. It does not assert that the
tail is a positive Pick kernel.

Also, for every $\gamma\ge2$,

$$
|u+\lambda|\ge\Re\lambda>\frac{15}{16}\gamma^2,
\qquad |\lambda|=\gamma^2+\beta^2<\frac{17}{16}\gamma^2.
\tag{7}
$$

Using (5) and (7),

$$
S_3^0<\frac1{16},\qquad
|S_3^e|\le\left(\frac{16}{15}\right)^3
\sum_{\gamma>H}\gamma^{-6}<\frac2{H^4},
\tag{8}
$$

$$
T_3^0<\frac14,\qquad
|T_3^e|\le\frac{17}{16}\left(\frac{16}{15}\right)^3
\sum_{\gamma>H}\gamma^{-4}<\frac2{H^2}.
\tag{9}
$$

The constants in the two tail estimates are respectively
$4096/3375<2$ and $4352/3375<2$.

Expanding the two determinants and dropping only the positive cross
terms justified in (6) gives

$$
S_2S_4-S_3^2
\ge S_2^0S_4^0-(S_3^0)^2
-\frac1{4H^4}-\frac4{H^8},
\tag{10}
$$

$$
T_2T_4-T_3^2
\ge T_2^0T_4^0-(T_3^0)^2
-\frac1{H^2}-\frac4{H^4}.
\tag{11}
$$

### 3.2 Two real zeros supply explicit margins

Write $r_i=(u+\gamma_i^2)^{-1}$ in the real head. Pairwise
symmetrization yields

$$
S_2^0S_4^0-(S_3^0)^2
=\sum_{i<j}
\frac{(\gamma_i^2-\gamma_j^2)^2}
{(u+\gamma_i^2)^4(u+\gamma_j^2)^4},
\tag{12}
$$

$$
T_2^0T_4^0-(T_3^0)^2
=\sum_{i<j}
\frac{\gamma_i^2\gamma_j^2(\gamma_i^2-\gamma_j^2)^2}
{(u+\gamma_i^2)^4(u+\gamma_j^2)^4}.
\tag{13}
$$

Every summand is nonnegative. For $0\le u\le10^4$, retain just the
first pair. Its squared-frequency separation exceeds $441-225=216$,
and both denominator factors are at most 10484. Hence

$$
S_2^0S_4^0-(S_3^0)^2
\ge\frac{216^2}{10484^8}>\frac3{10^{28}},
\tag{14}
$$

$$
T_2^0T_4^0-(T_3^0)^2
\ge\frac{196\cdot441\cdot216^2}{10484^8}>\frac2{10^{23}}.
\tag{15}
$$

At $H=3\cdot10^{12}$, the errors satisfy

$$
\frac1{4H^4}+\frac4{H^8}<\frac4{10^{51}},\qquad
\frac1{H^2}+\frac4{H^4}<\frac2{10^{25}}.
\tag{16}
$$

All four comparisons are exact rational inequalities. Equations
(10)--(16) prove both strict signs (1) on $0\le u\le10^4$.

## 4. Large-argument proof from gamma and primes

Put $x=\sqrt u$, $y=x/2+5/4$, and

$$
D_k(x)=\sum_{n\ge2}\Lambda(n)(\log n)^k n^{-x-1/2},
\qquad k=0,1,2,3.
$$

The exact xi definition, gamma recurrence, and Euler product give

$$
\begin{aligned}
L&=\frac1{x-1/2}+\frac12[\psi(y)-\log\pi]-D_0,\\
L'&=-\frac1{(x-1/2)^2}+\frac14\psi'(y)+D_1,\\
L''&=\frac2{(x-1/2)^3}+\frac18\psi''(y)-D_2,\\
L'''&=-\frac6{(x-1/2)^4}+\frac1{16}\psi'''(y)+D_3.
\end{aligned}
\tag{17}
$$

These series and their displayed derivatives converge absolutely for
$x>1/2$. Only $x\ge100$ is needed below.

### 4.1 Uniform elementary bounds

Since $\Lambda(n)\le\log n\le\sqrt n$, for $0\le k\le3$,

$$
\begin{aligned}
0\le x^kD_k(x)
&\le x^3\sum_{n\ge2}n^{2-x}\\
&\le x^3 2^{2-x}\left(1+\frac2{x-3}\right)<10^{-3}
\qquad(x\ge100).
\end{aligned}
\tag{18}
$$

Both factors in the last bound decrease with x; its value at 100 is
$(99\cdot10^6)/(97\cdot2^{98})<10^{-3}$.

Series-integral comparison for the gamma derivatives gives

$$
\begin{aligned}
\psi(y)&\ge\log y-y^{-1},\\
y^{-1}&\le\psi'(y)\le y^{-1}+y^{-2},\\
-y^{-2}-2y^{-3}&\le\psi''(y)\le-y^{-2},\\
2y^{-3}&\le\psi'''(y)\le2y^{-3}+6y^{-4}.
\end{aligned}
\tag{19}
$$

The starting series are
$\psi'(y)=\sum_{n\ge0}(y+n)^{-2}$,
$\psi''(y)=-2\sum_{n\ge0}(y+n)^{-3}$, and
$\psi'''(y)=6\sum_{n\ge0}(y+n)^{-4}$, as in
[DLMF 5.15](https://dlmf.nist.gov/5.15). The digamma bound follows from
its partial-fraction expansion by the same comparison.

Define

$$
A=xL',\qquad B=x^2L'',\qquad C=x^3L'''.
$$

We now prove the useful box bounds

$$
\boxed{L>\frac43,\quad \frac9{20}<A<\frac{11}{20},\quad
-\frac{11}{20}<B<-\frac9{20},\quad
\frac{17}{20}<C<\frac{11}{10}\qquad(x\ge100).}
\tag{20}
$$

For L, $y/\pi>16$ follows from $y\ge205/4$ and $\pi<22/7$.
The positive arctanh series gives $\log4>112/81$. Dropping the
positive pole term in (17),

$$
L>\frac{112}{81}-\frac{11}{1000}>\frac43.
\tag{21}
$$

For A, the upper bound is

$$
A<\frac12+\frac1x+10^{-3}\le\frac{511}{1000}<\frac{11}{20}.
$$

For its lower bound, use
$(1+5/(2x))^{-1}\ge1-5/(2x)$ and
$(1-1/(2x))^{-2}<2$:

$$
A\ge\frac1{2(1+5/(2x))}
-\frac1{x(1-1/(2x))^2}
>\frac12-\frac{13}{4x}\ge\frac{187}{400}>\frac9{20}.
\tag{22}
$$

For B, (19) gives

$$
B>-\frac12-\frac2x-10^{-3}
\ge-\frac{521}{1000}>-\frac{11}{20}.
$$

For its upper bound, use
$(1+5/(2x))^{-2}\ge1-5/x$ and
$(1-1/(2x))^{-3}<5/4$:

$$
B\le\frac2{x(1-1/(2x))^3}
-\frac1{2(1+5/(2x))^2}
<-\frac12+\frac5x\le-\frac9{20}.
\tag{23}
$$

For C, $(1-1/(2x))^{-4}\le(200/199)^4<5/4$ and the convex tangent
bound $(1+t)^{-3}\ge1-3t$ give

$$
C\ge\frac1{(1+5/(2x))^3}
-\frac6{x(1-1/(2x))^4}
>1-\frac{15}{x}\ge\frac{17}{20}.
\tag{24}
$$

Dropping the negative pole term and using the upper bound in (19),

$$
C<1+\frac6x+10^{-3}\le\frac{1061}{1000}<\frac{11}{10}.
\tag{25}
$$

This completes (20), with all derivative factors and prime errors
controlled uniformly on the half-line.

### 4.2 The two Schwarzian numerators

Direct differentiation using $d/du=(2x)^{-1}d/dx$ gives

$$
\begin{aligned}
E_h&:=16x^{10}(2h'h'''-3h''{}^2)\\
&=3L^2-2L(C+3B+3A)+2AC-3B^2+6AB+3A^2,
\end{aligned}
\tag{26}
$$

$$
\begin{aligned}
E_j&:=16x^6(2j'j'''-3j''{}^2)\\
&=3L^2+2L(C+3B+3A)+2AC-3B^2-6AB-9A^2.
\end{aligned}
\tag{27}
$$

The box (20) implies
$11/20<C+3B+3A<7/5$. In (26), bound each term in the needed
direction to obtain

$$
E_h>3L^2-\frac{14}{5}L-\frac{27}{20}
>\frac14.
\tag{28}
$$

The final polynomial is increasing for $L\ge4/3$, and its value at
$4/3$ is $1/4$. In (27), both the linear-in-L term and
$-6AB$ are positive. Dropping them gives

$$
E_j>3L^2-\frac{573}{200}
>\frac{1481}{600}>0.
\tag{29}
$$

Equations (26)--(29) prove both signs (1) on $u\ge10^4$.
Together with Section 3, they prove them on the entire positive axis.

## 5. Consequence and boundary of the result

The exact fourth-stage criterion and the strict three-node base now give

$$
\boxed{
\left[\frac{L(x_i)+L(x_j)}{x_i+x_j}\right]_{i,j=1}^{4}\succ0
\quad\text{for every four distinct positive real nodes.}
}
\tag{30}
$$

Thus the first four exact ladder pivots are positive, and the earlier
gamma-square/arithmetic energy inequality holds strictly for every
nonzero finite exponential test with at most four distinct rates greater
than one half.

The proof does not establish the fifth stage or an invariant through all
stages. Its finite verified head cannot by itself supply uniform
coercivity at arbitrary order: the separate rational-feature note proves
that a head with m distinct real modes has rank at most 2m, with explicit
null tests after that dimension. An all-orders argument must control the
remaining form on those null directions and its coupling to the head.

All constants above are reproduced by the accompanying symbolic and
exact-rational audit. No numerical grid is used as a continuum proof.
The published finite-zero computations remain explicit external inputs.
