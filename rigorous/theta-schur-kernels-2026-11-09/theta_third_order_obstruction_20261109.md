# Scalar kernel concavity does not force the third Pick stage

Research note, 9 November 2026. This is an exact analytic counterexample
for an auxiliary kernel. It is not a counterexample for the Riemann theta
kernel and does not contradict RH. It identifies what the positive-kernel
construction by itself cannot prove.

## 1. A strictly concave auxiliary kernel

Set

\[
k(u)=e^{-u^2}(2+\cosh u),\qquad
q(u)=-\frac{k'(u)}{u k(u)}.
\]

Write \(f(u)=\log(2+\cosh u)\). Then

\[
f'(u)=\frac{\sinh u}{2+\cosh u},\quad
f''(u)=\frac{2\cosh u+1}{(2+\cosh u)^2},\quad
q(u)=2-f'(u)/u.
\]

As a function of \(y=\cosh u\ge1\), the derivative of
\((2y+1)/(2+y)^2\) is \((2-2y)/(2+y)^3\le0\). Hence
\(0<f''(u)\le1/3\), giving

\[
(\log k)''\le-5/3<0,\qquad q(u)\ge5/3>0.
\tag{1}
\]

The numerator of \(f'(u)-u f''(u)\), after multiplication by the
positive denominator \((2+\cosh u)^2\), is

\[
J(u)=(2+\cosh u)\sinh u-u(2\cosh u+1).
\]

It satisfies \(J(0)=0\) and

\[
J'(u)=2\sinh u(\sinh u-u)>0\quad(u>0).
\]

Consequently \(q'(u)>0\). In particular

\[
\frac{d^2}{dx^2}\log k(\sqrt x)
=-\frac{q'(\sqrt x)}{4\sqrt x}<0\quad(x>0).
\tag{2}
\]

This auxiliary kernel has the same ordinary and squared-variable strict
log-concavity inputs used in the initial two-node theta proof. The
single-crossing Green construction also applies to it, so its canceled
first-step numerator and denominator have positive even kernels.

## 2. Exact transform and Taylor signs

With the transform convention used in the theta notes,

\[
F_k(w)=\int_{\mathbb R} k(u)e^{wu/2}\,du
=\sqrt\pi e^{w^2/16}[2+r\cosh(w/4)],\qquad r=e^{1/4}.
\]

Its logarithmic derivative is

\[
L_k(w)=\frac w8+
\frac{r\sinh(w/4)}{4[2+r\cosh(w/4)]}
=\ell_1w+\ell_3w^3+\ell_5w^5+O(w^7),
\]

where direct differentiation gives

\[
\ell_1=\frac{4+3r}{16(2+r)}>0,\qquad
\ell_3=\frac{r(1-r)}{768(2+r)^2}<0,
\tag{3}
\]

\[
\ell_5=\frac{r(4-26r+16r^2)}{491520(2+r)^3}<0.
\tag{4}
\]

The final sign is elementary and requires no decimal approximation:

\[
5/4<e^{1/4}<\sum_{n\ge0}(1/4)^n=4/3.
\]

The convex quadratic \(P(r)=4-26r+16r^2\) is negative at both endpoints:
\(P(5/4)=-7/2\), \(P(4/3)=-20/9\). It is therefore negative throughout
that interval.

For \(h_k(u)=L_k(\sqrt u)/\sqrt u\), the curvature needed for the third
Pick stage consequently has the strict wrong sign at zero:

\[
\left[h_k h_k''-2(h_k')^2\right]_{u=0}
=2(\ell_1\ell_5-\ell_3^2)<0.
\tag{5}
\]

By continuity it also has the wrong sign on a positive open interval.

## 3. A three-node failure, with no numerical determinant test

The analytic continuation of the real Pick kernel near the origin is

\[
\Pi_k(x,y)=\frac{L_k(x)+L_k(y)}{x+y}.
\]

Its coefficient matrix on \(1,x,x^2\) and \(1,y,y^2\) is

\[
C_3=
\begin{pmatrix}
\ell_1&0&\ell_3\\
0&-\ell_3&0\\
\ell_3&0&\ell_5
\end{pmatrix},\qquad
\det C_3=(-\ell_3)(\ell_1\ell_5-\ell_3^2)<0.
\tag{6}
\]

Analyticity and the Vandermonde determinant give, at the three distinct
positive nodes \(\varepsilon,2\varepsilon,3\varepsilon\),

\[
\det[\Pi_k(i\varepsilon,j\varepsilon)]_{i,j=1}^3
=4\det C_3\,\varepsilon^6+o(\varepsilon^6)<0
\tag{7}
\]

for every sufficiently small positive \(\varepsilon\). One way to check
the leading term is to subtract successive rows and columns and divide
by their node differences. The resulting confluent matrix tends to
\(C_3\); the squared Vandermonde contributes \(4\varepsilon^6\).

Thus all two-node matrices are positive, but some three-node matrices are
indefinite. Positive canceled Green kernels do not automatically close
the next stage.

## 4. The obstruction persists with stronger decay

If decay faster than a Gaussian is desired, set

\[
k_\eta(u)=e^{-\eta u^4}k(u),\qquad \eta>0.
\]

Then \((\log k_\eta)''=(\log k)''-12\eta u^2<0\) and
\(q_\eta'=q'+8\eta u>0\). All derivatives have decay faster than a
Gaussian. Its moments through order six, including the zeroth, and hence \(\ell_1,\ell_3,\ell_5\),
depend continuously on \(\eta\downarrow0\) by dominated convergence.
The strict signs in (3)--(6) therefore persist for all sufficiently small
positive \(\eta\). The obstruction is not an artifact of allowing only
Gaussian decay.

## 5. Scope

This exact example strengthens the preceding four-node certificate:
the generic scalar concavity assumptions can fail already at the third
stage. Any successful theta induction must use additional structure of
the actual xi response. A proof of a fixed third-order theta inequality,
even on the entire positive real axis, would still need a separate
all-orders preservation argument to complete the RH program.

All calculations above are supplied here. The companion symbolic audit
checks the Taylor coefficients and confluent determinant; the signs follow
from the displayed rational inequalities. No external theorem about RH
is invoked in this counterexample.
