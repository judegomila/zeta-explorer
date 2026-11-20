# Second theta reduction: a positive origin slope at every pair of anchors

**Role in the completed checkpoint.** This is a proof component. The [global theorem](theta_second_preservation_global_20261111.md) combines the source crossing, compensation, first-source origin, and second-origin results to prove second preservation and five-node positivity. Statements below limiting an individual component retain that local scope.


Research continuation, 11 November 2026. This note proves

\[
\boxed{\left(4n_{a,c}''/n_{a,c}\right)''(0)>0
\qquad\text{for all }a,c>0,}
\tag{1}
\]

including coincident anchors, for the second canonical canceled theta numerator.
The proof reduces the two-anchor problem to positivity of a one-variable
matrix derivative. A rigorous even-moment certificate covers the compact
anchor interval, and an explicit Taylor estimate covers the infinite tail.
This is an origin statement. Positivity of the corresponding spatial
convexity conditions after the second reduction remains a separate question.
No five-node, arbitrary-depth, or RH conclusion is asserted here.

## 1. Definitions and dependencies

Use the actual theta normalization of PR #52:

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}\,dt,
\quad p(a)=F'(a)/F(a),\quad
C(t)=\frac14\int_t^\infty s\kappa(s)\,ds.
\]

The first canceled pair satisfies

\[
n_a+a b_a=C,\qquad a n_a+4b_a''=p(a)\kappa.
\tag{2}
\]

Its canonical order is \((u_1,v_1)=(b_a,n_a)\). At a second anchor \(c>0\),
write \(r=R_1(c)\), where \(R_1(z)=z\mathcal L b_a(z)/\mathcal L n_a(z)\).
The second canceled numerator is specified by

\[
n_{a,c}+c b_{a,c}=b_a,\qquad
c n_{a,c}+4b_{a,c}''=r n_a.
\tag{3}
\]

The global positivity and decay of these canonical kernels follow from the
first preservation theorem and crossing lemma already recorded in PRs #51–52.
The numerical bounds used here for the actual theta kernel are

\[
0<\gamma:=-\kappa''(0)/\kappa(0)<4.7,
\quad56.8<\beta:=\kappa^{(4)}(0)/\kappa(0)<57,
\quad\sup_{t\in\mathbb R}|\kappa^{(6)}(t)|/\kappa(0)<1500.
\tag{4}
\]

The last bound is the global theorem certified in PR #52. The new executable
recomputes \(\kappa(0),\gamma,\beta\) and the finite-anchor integral data.
It explicitly declares the global sixth-derivative bound as that fixed
prior dependency. The classical theta comparison \(Q' >0\), for
\(Q=-\kappa'/(t\kappa)\), supplies the exponential spatial-tail majorant
used by the new integral certificate.

## 2. A symmetric divided difference of first numerators

Put \(p=p(a)\), \(q=p(c)\). Transforming (2) gives

\[
\mathcal L n_a(z)=\frac{zF'(z)-apF(z)}{z^2-a^2},\qquad
\mathcal L b_a(z)=\frac{pF(z)-aF'(z)/z}{z^2-a^2}.
\]

Consequently

\[
r=\frac{cp-aq}{cq-ap},
\qquad
\boxed{n_{a,c}(t)=p\,\frac{n_a(t)-n_c(t)}{cq-ap}.}
\tag{5}
\]

These formulas have their continuous interpretation when \(c=a\). They
follow by substituting the first transformed pair into (3) and canceling
\(z^2-c^2\); no zero information is used. Since \(p>0\) and
\(p'>0\) by the variance formula for the positive theta measure,
\(a\mapsto ap(a)\) is strictly increasing. For coincident anchors,

\[
\boxed{n_{a,a}(t)=
-\frac{p(a)}{p(a)+ap'(a)}\,\partial_a n_a(t).}
\tag{6}
\]

The factor in (5) is positive when \(c>a\). Interchanging the anchors
changes only a positive scalar, so all spatial logarithmic-curvature
properties of the second numerator are symmetric in the two anchors.

## 3. The exact one-variable matrix criterion

Normalize the first numerator's origin value by

\[
N(a)=\frac{n_a(0)}{\kappa(0)},\qquad d(a)=1+ap(a).
\]

The differential equation
\((4D_t^2-a^2)n_a=4C''-ap\kappa\) gives

\[
Y(a):=\frac{4n_a''(0)}{\kappa(0)}=a^2N(a)-d(a),
\]

\[
Z(a):=\frac{16n_a^{(4)}(0)}{\kappa(0)}
=a^2Y(a)+4\gamma[d(a)+2].
\tag{7}
\]

For \(c>a\), let \(\Delta N=N(a)-N(c)\), and similarly for \(Y,Z\).
Evenness and (5) yield the exact identity

\[
\boxed{
\left(4n_{a,c}''/n_{a,c}\right)''(0)
=\frac{\Delta N\,\Delta Z-(\Delta Y)^2}{4(\Delta N)^2}.}
\tag{8}
\]

Define

\[
\mathcal D(a)=N'(a)Z'(a)-Y'(a)^2.
\]

Direct algebra simplifies this apparently higher-jet quantity to

\[
\boxed{\mathcal D(a)
=N'(a)\{(a^2+4\gamma)d'(a)-2ad(a)\}
-[2aN(a)-d'(a)]^2.}
\tag{9}
\]

**Matrix criterion.** If \(N'<0\) and \(\mathcal D>0\) for every \(a>0\),
then (1) holds for every pair of positive anchors.

Indeed the symmetric matrix

\[
-\begin{pmatrix}N'(a)&Y'(a)\\Y'(a)&Z'(a)\end{pmatrix}
\]

is positive definite: its leading entry is positive and its determinant
is \(\mathcal D>0\). Integrating this matrix between two distinct anchors
preserves positive definiteness. The result is
\(\begin{pmatrix}\Delta N&\Delta Y\\\Delta Y&\Delta Z\end{pmatrix}\),
whose determinant is therefore strictly positive. Equation (8) proves
the assertion. For equal anchors, (6) and the same derivative matrix give

\[
\boxed{
\left(4n_{a,a}''/n_{a,a}\right)''(0)
=\frac{\mathcal D(a)}{4N'(a)^2}>0.}
\tag{10}
\]

Conversely, the coincident-anchor origin gate is precisely
\(\mathcal D(a)>0\) once \(N'<0\) is known. Thus the one-variable condition
is exact for the two-anchor assertion including coalescence.

It is useful to remove the even zero at \(a=0\). In the coordinate
\(u=a^2\), a subscript denotes differentiation with respect to \(u\),

\[
\mathcal D(a)=4a^2\mathcal D_u(u),\qquad
\boxed{\mathcal D_u=N_u[(u+4\gamma)d_u-d]-(N-d_u)^2.}
\tag{11}
\]

## 4. Compact anchors: a rigorous positive-moment certificate

The canceled origin formula from PR #52 is

\[
N(a)=\frac14\int_0^\infty(s+2p(a))
\frac{\kappa(s)}{\kappa(0)}e^{-as/2}\,ds.
\tag{12}
\]

To evaluate it uniformly near zero without canceling separate odd terms,
set

\[
E(a)=\int_0^\infty\kappa(s)\cosh(as/2)\,ds,
\qquad O(a)=\int_0^\infty\kappa(s)\sinh(as/2)\,ds.
\]

Then \(p=E'/E\) and the exact identity

\[
\boxed{N(a)=\frac{O'(a)-p(a)O(a)}{2\kappa(0)}}
\tag{13}
\]

follows by expanding the hyperbolic functions in (12).

Choose \(A=200\), \(x=(a/A)^2\), and write

\[
E(a)=e(x),\qquad O(a)=\frac aA o(x).
\]

The coefficients of both series are positive:

\[
e_k=\int_0^\infty\kappa(s)\frac{(As/2)^{2k}}{(2k)!}\,ds,
\quad
o_k=\int_0^\infty\kappa(s)\frac{(As/2)^{2k+1}}{(2k+1)!}\,ds.
\tag{14}
\]

The executable encloses all 602 coefficients through \(k=300\).
Sixteen theta terms are integrated on \([0,8]\) using rigorous complex
ball integration; omitted theta terms and the entire spatial tail
have explicit positive bounds. At \(T=8\), monotonicity of
\(V'=-\kappa'/\kappa\) gives
\(\kappa(T+s)\le\kappa(T)e^{-V'(T)s}\). Hence every omitted moment is
bounded by the elementary finite sum obtained by expanding \((T+s)^m\)
and integrating \(s^j e^{-V'(T)s}\). No cutoff is treated as zero.

Since every coefficient is positive and
\(\sum e_k=E(A)\), \(\sum o_k=O(A)<E(A)\), the derivatives of the
omitted series have explicit geometric bounds on \(0\le x\le1/4\).
For derivative order \(j=0,1,2\), the degree-300 remainder is at most

\[
E(A)\frac{(301)_j(1/4)^{301-j}}
{1-\frac14\frac{302}{302-j}},
\tag{15}
\]

where \((301)_j\) is a falling factorial. The computed bounds are less
than \(3.44\cdot10^{-71}\), \(4.14\cdot10^{-68}\), and
\(4.97\cdot10^{-65}\), respectively.

The cleared polynomial computation is as follows. Put

\[
K=2\kappa(0)A,\quad
P=eo+2x(eo'-e'o),\quad
Q=P'e-Pe',\quad T=e+2xe',\quad S=T'e-Te'.
\]

Then

\[
N=\frac P{Ke},\quad N_x=\frac Q{Ke^2},\quad
d=\frac Te,\quad d_x=\frac S{e^2},
\]

and

\[
\boxed{G=KQ\{(A^2x+4\gamma)S-A^2Te\}
-(A^2Pe-KS)^2,\qquad
\mathcal D_u=\frac G{K^2e^4 A^4}.}
\tag{16}
\]

Each needed derivative has its own explicitly bounded remainder. The
implementation forms \(P',Q,S,G\) from those separately enclosed actual
values; it does not differentiate an artificial interval error. Full
polynomial products are retained before evaluating a spatial cell,
which preserves cancellations in the shared variable.

At 384-bit precision, 2,048 closed intervals covering \([0,1/4]\)
certify \(Q<0\) and \(G>0\). The conservative consequences are

\[
\boxed{N_u<-4.34\cdot10^{-7},\qquad
\mathcal D_u>1.12\cdot10^{-10}
\quad(0\le a\le100).}
\tag{17}
\]

These are interval statements over the complete compact region. They
are not point samples. The same models give \(p(100)>1\), the starting
value for the next section.

## 5. All large anchors: an explicit analytic estimate

### Bounds on p and its derivative

The positive theta measure gives \(p'>0\), hence \(p(a)\ge p(100)>1\)
for \(a\ge100\). Write \(s=a+1/2\). Logarithmic differentiation of
\(\xi(s)\) gives

\[
p'(a)=-s^{-2}-(s-1)^{-2}+\tfrac14\psi_1(s/2)
+(\log\zeta)''(s).
\]

The classical trigamma series
\(\psi_1(y)=\sum_{n\ge0}(n+y)^{-2}\), compared with its integral,
gives \(\psi_1(y)\le y^{-2}+y^{-1}\). The positive Dirichlet series
for \(\zeta\) gives

\[
(\log\zeta)''(s)\le\zeta''(s)
\le2^{-s}\left[1+\frac2{s-1}+
\frac4{(s-1)^2}+\frac4{(s-1)^3}\right]
<\frac1{(s-1)^2}\quad(s\ge100).
\]

For the last inequality, the bracket is less than \(3/2\), and
\((3/2)(s-1)^2 2^{-s}\) decreases from a value less than one at
\(s=100\). Thus

\[
\boxed{0<ap'(a)<1/2\quad(a\ge100).}
\tag{18}
\]

Only these elementary real-axis estimates are needed; no information
about complex zeros enters them.

Put \(v=ap'(a)\), \(h=p(a)-v\). Equations (18) and \(p>1\) imply

\[
h>1/2,\qquad p<2h,\qquad v<h.
\tag{19}
\]

### Taylor model and errors

The global sixth-derivative bound in (4) gives

\[
\frac{\kappa(s)}{\kappa(0)}
=1-\gamma s^2/2+\beta s^4/24+R(s),
\quad |R(s)|\le M s^6/720,\quad M=1500.
\]

Integrating against (12), define

\[
N_0=\frac d{a^2}-\frac{4\gamma(d+2)}{a^4}
+\frac{16\beta(d+4)}{a^6},\qquad N=N_0+\varepsilon.
\]

Differentiating (12) under the absolutely integrable positive-tail
majorant bounds the derivative error as well:

\[
|\varepsilon|\le\frac{64M(ap+7)}{a^8},\qquad
|\varepsilon'|\le\frac{64M}{a^8}
\left(v+7p+\frac{56}a\right).
\]

Using (19), for all \(a\ge100\),

\[
\boxed{|\varepsilon|<140Mh/a^7,
\qquad |\varepsilon'|<1040Mh/a^8.}
\tag{20}
\]

Let \(\mathcal D_0\) denote (9) with \(N_0,N_0'\). Exact expansion
in \(h,v\) gives

\[
\begin{aligned}
\mathcal D_0={}&\frac{16(\beta-\gamma^2)h^2}{a^4}
+\frac{192(\beta-\gamma^2)h}{a^5}\\
&+\frac{64\gamma\beta h(3h+2v)+320\beta-576\gamma^2}{a^6}
+\frac{256\gamma\beta(17h/2+v)}{a^7}\\
&+\frac{7680\gamma\beta-1024\beta^2p^2}{a^8}
-\frac{10240\beta^2p}{a^9}-\frac{25600\beta^2}{a^{10}}.
\end{aligned}
\tag{21}
\]

All omitted positive terms in the following bound have their indicated
sign by (4) and (19). Since \(p^2<4h^2\), \(p<4h^2\), \(1<4h^2\),

\[
\mathcal D_0\ge\frac{h^2}{a^4}
\left[16(56.8-4.7^2)-
\frac{4096\cdot57^2}{a^4}-\frac{40960\cdot57^2}{a^5}
-\frac{102400\cdot57^2}{a^6}\right].
\tag{22}
\]

The two coefficients in the perturbation satisfy

\[
|(a^2+4\gamma)d'-2ad|<2a^2h,
\qquad |2aN_0-d'|<2h.
\]

For example, division by \(a^2h\) bounds the first expression by
\(1+4/a+12\gamma/a^2<2\); division by \(h\) bounds the second by
\(1+4/a+16\gamma/a^2+48\gamma/a^3+64\beta/a^4+320\beta/a^5<2\).
Equations (9) and (20) therefore give

\[
|\mathcal D-\mathcal D_0|
\le\frac{h^2}{a^4}
\left[\frac{3200M}{a^2}+\frac{78400M^2}{a^8}\right].
\tag{23}
\]

The bracket in (22) minus that in (23) is greater than 75 at
\(a=100\), using exact rational arithmetic. Every negative term
subsequently decreases in magnitude. Hence

\[
\boxed{\mathcal D(a)>75h^2/a^4>0\quad(a\ge100).}
\tag{24}
\]

The same expansion proves the needed derivative sign directly:

\[
N'(a)\le\frac h{a^2}
\left[-1+\frac{24\gamma}{a^2}+\frac{96\gamma}{a^3}
+\frac{16\beta}{a^4}+\frac{1040M}{a^6}\right]
<-\frac{0.98h}{a^2}<0.
\tag{25}
\]

The last rational inequality holds at 100 and only strengthens above
it. Thus (17) and (24)–(25) cover every positive anchor. The matrix
criterion proves (1), including pairs lying on opposite sides of the
compact/tail boundary.

## 6. Generic endpoint formula for future reductions

For any positive smooth even input pair \((u,v)\), set
\(B=4u''/v\), \(J=4v''/v\). At an anchor \(c\), write
\(r=R(c)\), \(d=cr-B(0)\), and \(M_0=n(0)/v(0)\). The same
canceled equation gives

\[
\boxed{
J_{\rm new}''(0)=
\frac{[4B''(0)+d(c^2-J(0))]M_0-d^2}{4M_0^2}.}
\tag{26}
\]

When \(d>0\), an equivalent curvature condition is

\[
-\frac{n''(0)}{n(0)}
< -\frac{v''(0)}{v(0)}+\frac{B''(0)}d.
\]

The generic identity is not itself a preservation theorem. The
actual-theta divided difference and global one-variable estimate above
supply the additional information needed at the second step.

## 7. Sources and reproducibility

- Fixed theta normalization, first canonical preservation, positive
  canceled kernels, \(Q'>0\), and global sixth-derivative bound:
  [Math Explorer PR #52](https://github.com/judegomila/mathexplorer/pull/52),
  commit `a24e261deae84bf2a06b6c33a7fbdfe95db2b803`; its stated PR #51
  dependencies retain their original scope.
- Trigamma series: [NIST DLMF 5.15.1](https://dlmf.nist.gov/5.15.E1).
- Positive zeta Dirichlet series:
  [NIST DLMF 25.2.1](https://dlmf.nist.gov/25.2.E1).
- The companion executable uses python-flint ball arithmetic. Every
  finite integral, theta truncation, spatial tail, series remainder,
  and interval cell is enclosed explicitly. The reported finite-cell
  signs concern complete intervals. They do not certify arbitrary
  reduction depth or any complex-plane zero exclusion.
