# All-order positivity of the theta compensation operator

Research continuation, 11 November 2026. This note strengthens the
three-prefix Peano kernel of PR #53 from TP2 to **total nonnegativity
of every finite order**. Its integral operator is therefore variation
diminishing, and this property survives arbitrary finite compositions
of such operators. The statement is analytic and does not require a
new finite interval computation.

This is an all-order statement about an auxiliary integral kernel. It
is **not** all-order Pick positivity, third canonical preservation, or
RH. Sections 6–8 identify the additional statement required to apply
the result repeatedly to the actual canonical theta pairs.

## 1. Fixed input and hypotheses

Retain the centered-call derivative operator from PR #53:

\[
Af(y)=\int_0^1K(y,z)f(z)\,dz,\qquad
K(y,z)=\int_y^1F(\min(r,z))[1-F(\max(r,z))]\,dr.
\]

The probability density is positive and smooth. Assume a smooth
source prefix satisfies

\[
f_1>0,\qquad W_2(f_1,f_2)>0,\qquad W_3(f_1,f_2,f_3)>0.
\]

Set

\[
x=f_2/f_1,\quad Y(x)=f_3/f_1,\quad w=Y''>0,
\quad g_i=Af_i,\quad G=W_3(g_1,g_2,g_3)>0.
\]

Thus the coordinate \(x\) increases. Its range is \(I=(\ell,r)\).
For the theorem below assume \(\ell\) is finite, \(Y,Y',Y''\)
extend continuously to \(\ell\), and all source functions are smooth
inside their intervals. The upper endpoint \(r\) may be infinite.
Assume absolute convergence of the transforms and of the derivatives
needed below, including the transforms of
\(f_1[1+|x|+|Y(x)|]\) and their primitives in the integrated-call
formula. These are a convenient sufficient endpoint condition, not
an assertion that arbitrary improper integrals converge.

For \(s\in I\), define

\[
R_s(x)=1_{x>s}\{Y(x)-Y(s)-Y'(s)(x-s)\},
\quad H_s=A[f_1R_s],
\quad \Pi(y,s)=W_4(g_1,g_2,g_3,H_s)(y).
\]

PR #53 proves \(\Pi>0\), its TP2 property, and the exact identity

\[
W_4(g_1,g_2,g_3,A[f_1h])
=\int_I\Pi(y,s)\rho(s)\,ds,
\qquad \rho=(h''/w)'.                         \tag{1}
\]

The finite initial jets in the assumptions supply the three discarded
prefix terms in the Peano reconstruction. They are annihilated by the
Wronskian. Absolute convergence is also required for (1).

## 2. The all-order theorem

**Theorem.** Under these hypotheses, for every positive integer \(m\),
every \(y_1<\cdots<y_m\) in \((0,1)\), and every
\(s_1<\cdots<s_m\) in \(I\),

\[
\boxed{\det[\Pi(y_i,s_j)]_{i,j=1}^m\ge0.}       \tag{2}
\]

The inequality in (2) need not be strict. For instance, the explicit
uniform-density kernel in PR #53 has rank one when every output point
lies above every source knot. Calling that kernel strictly totally
positive would be incorrect.

### 2.1 Smooth the knot, retaining a positive extended system

Put

\[
\phi_\varepsilon(v,s)=\frac{1}{\sqrt{\pi\varepsilon}}
\exp[-(v-s)^2/\varepsilon],
\qquad
R_{s,\varepsilon}(x)=\int_\ell^xR_v(x)
\phi_\varepsilon(v,s)\,dv.
\]

The monic third-order operator annihilating \(1,x,Y\) is

\[
\mathcal L_x=D_x^3-\frac{w'}wD_x^2.
\]

Direct differentiation gives

\[
R_{s,\varepsilon}''(x)
=w(x)\int_\ell^x\phi_\varepsilon(v,s)\,dv,
\qquad
\boxed{\mathcal L_xR_{s,\varepsilon}=w\phi_\varepsilon(x,s).}
                                                        \tag{3}
\]

This is the reason for smoothing the knot. The unsmoothed remainder
is only \(C^1\) at the knot, so a proof by arbitrarily many ordinary
derivatives of that remainder would be invalid.

For any ordered knots \(s_1<\cdots<s_m\), a common-factor
Wronskian calculation gives

\[
W_m(\phi_\varepsilon(\cdot,s_1),\ldots,
\phi_\varepsilon(\cdot,s_m))
=\left(\frac2\varepsilon\right)^{m(m-1)/2}
\left(\prod_{j=1}^m\phi_\varepsilon(x,s_j)\right)
\prod_{i<j}(s_j-s_i)>0.                         \tag{4}
\]

Use the row operators \(1,D,D^2,\mathcal L_x,D\mathcal L_x,\ldots\).
Their leading coefficients are one, so they are unit triangular
changes of the ordinary Wronskian rows. Since the last rows annihilate
the first three columns, (3) yields

\[
\boxed{
W_{m+3}(1,x,Y,R_{s_1,\varepsilon},\ldots,R_{s_m,\varepsilon})
=w^{m+1}W_m(\phi_{\varepsilon,s_1},\ldots,
\phi_{\varepsilon,s_m})>0.}                    \tag{5}
\]

Together with \(W_1(1)=W_2(1,x)=1\) and \(W_3(1,x,Y)=w>0\),
this proves every initial Wronskian of the displayed source family
is positive. Multiplying all functions by \(f_1>0\) and changing
back to the increasing original coordinate preserve those signs.

### 2.2 Apply the exact call-transform theorem

PR #53's higher comparison theorem now applies to this smooth
extended source family. With

\[
H_{s,\varepsilon}=A[f_1R_{s,\varepsilon}],
\quad \Pi_\varepsilon(y,s)=W_4(g_1,g_2,g_3,H_{s,\varepsilon}),
\]

every initial Wronskian of
\((g_1,g_2,g_3,H_{s_1,\varepsilon},\ldots,H_{s_m,\varepsilon})\)
is strictly positive.

Let \(\mathcal L_g h=W_4(g_1,g_2,g_3,h)/G\), the monic third-order
operator annihilating the output prefix. The same row-operation
argument proves the exact general Sylvester identity

\[
W_{m+3}(g_1,g_2,g_3,h_1,\ldots,h_m)
=G W_m(\mathcal L_g h_1,\ldots,\mathcal L_g h_m).
\]

Consequently,

\[
\boxed{
W_m(\Pi_\varepsilon(\cdot,s_1),\ldots,
\Pi_\varepsilon(\cdot,s_m))
=G^{m-1}W_{m+3}(g_1,g_2,g_3,
H_{s_1,\varepsilon},\ldots,H_{s_m,\varepsilon})>0.}       \tag{6}
\]

The assertion holds for every initial subfamily of the ordered knots.
The elementary extended-Chebyshev/Rolle argument used in PR #53
therefore makes every ordered evaluation determinant of
\(\Pi_\varepsilon\) strictly positive. Positivity of a single
highest Wronskian alone would not suffice; all initial Wronskians
are supplied by (6).

### 2.3 Remove the smoothing, including the infinite endpoint

Convexity gives \(R_v(x)\ge0\) and
\(\partial_vR_v(x)=-w(v)(x-v)<0\) when \(v<x\). Hence

\[
0\le R_{s,\varepsilon}(x)\le R_\ell(x)
=Y(x)-Y(\ell)-Y'(\ell)(x-\ell).                \tag{7}
\]

The integral of the Gaussian over the truncated interval is at most
one; no normalization at the interval boundary has been suppressed.
For every interior \(x,s\), the approximate identity gives
\(R_{s,\varepsilon}(x)\to R_s(x)\), also at \(x=s\).
The bound (7) is a fixed linear combination of the initial three
source ratios. The endpoint hypotheses thus dominate the transform
and the integral terms in its first three derivatives. The remaining
third-derivative term is a local value of \(f_1R_{s,\varepsilon}\),
which also converges. Therefore

\[
\Pi_\varepsilon(y,s)\longrightarrow\Pi(y,s)
\]

at every interior pair. Passing to the limit of each finite evaluation
determinant proves (2). This argument uses only three output
derivatives in the limit; it does not differentiate the nonsmooth
kernel to arbitrarily high order.

For the theta prefix used in PR #53, \(\ell\) is finite and the
initial jets are analytic in \(t^2\). At infinity, its source ratios
and derivatives grow at most polynomially in \(t,e^t\), whereas the
fixed-anchor measure decays as a polynomial times
\(\exp[-\pi e^t+a t/2]\). These already proved bounds justify (7)
and the required transformed integrals for every fixed positive
anchor. This verifies the all-order theorem for the actual first
theta compensation kernel, without a new uniform-in-anchor limit.

## 3. Variation diminution and composition

Let \(S^-(h)\) be the number of strict sign changes, with zero values
discarded. The finite-matrix variation-diminishing theorem for totally
nonnegative matrices, followed by positive quadrature approximation,
gives

\[
\boxed{S^-\!\left(\int_I\Pi(\cdot,s)\rho(s)\,ds\right)
\le S^-(\rho).}                                      \tag{8}
\]

Here the input has finitely many sign intervals and the integral is
absolutely convergent. A direct passage to the integral is sufficient:
truncate to a compact interval, approximate each fixed finite list of
output values by ordered positive quadratures whose coefficient
signs follow those of \(\rho\), apply the matrix theorem, and take a
limit. Strict alternating output signs would persist for sufficiently
accurate quadratures and thus cannot be created by the limit.

The matrix theorem is classical; a primary statement appears in the
opening paragraph of I. J. Schoenberg, *On Pólya frequency functions.
II: Variation-diminishing integral operators of the convolution type*,
Acta Sci. Math. (Szeged) **12** (1950), 97–106:
https://acta.bibl.u-szeged.hu/13626/1/math_012_pars_b_097-106.pdf.
The present note proves total nonnegativity of this particular Peano
kernel; it makes no novelty claim about the general matrix theorem.

If \(\Pi_1,\ldots,\Pi_d\) are kernels satisfying (2), and their
compositions are absolutely convergent, then

\[
\Pi^{[d]}(y,s)=\int\Pi_d(y,z_{d-1})\cdots\Pi_1(z_1,s)
\,dz_1\cdots dz_{d-1}
\]

also satisfies (2). For two factors this is continuous
Cauchy–Binet: each ordered minor of the composite is the integral,
over ordered intermediate points, of the product of the corresponding
two ordered minors. Induction proves the assertion for every finite
depth. Positive input/output factors and increasing coordinate
changes preserve it.

Thus the *operator mechanism* can be repeated at every finite depth
when the required generalized source derivatives are actually linked
by these operators. That last condition is not part of (2).

## 4. More than one signed source: the exact determinant formula

Suppose \(I_j(y)=\int\Pi(y,s)\rho_j(s)\,ds\). Continuous
Cauchy–Binet gives the ordinary evaluation identity

\[
\det[I_j(y_i)]_{i,j=1}^m
=\int_{s_1<\cdots<s_m}
\det[\Pi(y_i,s_k)]\det[\rho_j(s_k)]\,ds_1\cdots ds_m.   \tag{9}
\]

For \(m=2\), where the first output derivative exists, confluence
gives

\[
\boxed{
W_2(I_1,I_2)(y)=\int_{s_1<s_2}
W_2(\Pi(\cdot,s_1),\Pi(\cdot,s_2))(y)
\det\begin{bmatrix}\rho_1(s_1)&\rho_2(s_1)\\
\rho_1(s_2)&\rho_2(s_2)\end{bmatrix}\,ds_1ds_2.}         \tag{10}
\]

The first factor is nonnegative. Individual densities need not be
positive for this formula to preserve a favorable determinant sign.
Conversely, knowing the number of sign changes of each density
separately does not determine the sign of the density determinant.

As a simple exact example, the two densities \(s-a\) and \(s-b\)
each have one negative-to-positive crossing for \(a,b\in I\), but
their two-node determinant is
\((b-a)(s_2-s_1)\), whose sign depends on their ordering.

## 5. Exact relation to the next canonical source family

For a canonical input pair retain the notation of PR #53:

\[
H=u/v,\ B=4u''/v,\ J=4v''/v,\ P=16u^{(4)}/v,
\ Q=16v^{(4)}/v,
\quad U=64u^{(6)}/v.
\]

Fix an anchor \(a>0\) and \(r=R(a)>0\). All expressions in this
section use the same hyperbolic coordinate. The call-transform
identities imply

\[
H_1=-aTH/TB,\quad B_1=rTJ/TB-a,\quad
J_1=(TP-arTJ)/TB,\quad P_1=(rTQ-aTP)/TB,
\]

\[
Q_1=(TU-arTQ)/TB.                                  \tag{11}
\]

The final identity follows by applying the centered Green equation
to \(16n^{(4)}\); its source is \(U-arQ\), whose tilted mean is
zero. Put

\[
(g_1,g_2,g_3)=(TB,TJ,TP),\quad
I_H=W_4(g_1,g_2,g_3,TH),\quad
I_Q=W_4(g_1,g_2,g_3,TQ),\quad
I_U=W_4(g_1,g_2,g_3,TU).
\]

Column elimination, followed by the Sylvester identity, gives

\[
\boxed{
W_4(B_1',J_1',P_1',H_1')
=-\frac{ar^2}{(TB)^5G}\,W_2(I_Q,I_H),}
                                                        \tag{12}
\]

\[
\boxed{
W_4(B_1',J_1',P_1',Q_1')
=\frac{r^2}{(TB)^5G}\,W_2(I_Q,I_U).}             \tag{13}
\]

For the original derivative prefix \((B',J',P')\), let
\(\rho_H,\rho_Q,\rho_U\) be its generalized source derivatives
as in (1). Then \(I_j=\Pi\rho_j\). Formula (10) now identifies
the exact two-density comparison needed at the next level.
It is more information than the two individual single-crossing
theorems for \(\rho_H,\rho_Q\) established in PR #53.

In particular, the next canonical derivative prefix is
\((B_1',J_1',P_1')\), which already involves \(TQ\). It is not
simply the transported three-function prefix \((TB,TJ,TP)\).
The unconditional operator-composition statement in section 3 must
therefore not be substituted for a proof of canonical inheritance.

## 6. Why positivity for each anchor does not prove joint anchor positivity

An alternative route proposed in the companion source note asks for
positivity of an anchor/spatial kernel, or a mixed derivative such as
\(\partial_a\partial_t\log A(a,t)\). Our theorem holds for each
fixed anchor; it does not control differentiation in that parameter.

There is a sharp logical obstruction to inferring the latter from
the former. Given any positive TN kernel \(\Pi_0(y,s)\), set

\[
\widehat\Pi_a(y,s)=e^{-ay}\Pi_0(y,s).
\]

For every fixed \(a\), every ordered minor is multiplied by the
positive row factor \(e^{-a\sum_i y_i}\); thus the kernel remains
TN of all orders. For any fixed positive input with output \(I_0>0\),
however,

\[
\widehat I(a,y)=e^{-ay}I_0(y),\qquad
\partial_a\partial_y\log\widehat I=-1<0.           \tag{14}
\]

This is a counterexample to a proposed inference between two generic
kernel properties, not a counterexample for actual theta. It also
shows why anchor-dependent positive factors, harmless in a fixed
spatial sign argument, must be retained in a joint-anchor argument.
The actual theta measure and its coordinate change both depend on
the anchor and require a separate joint analysis.

## 7. Precisely what this advances

The PR #53 kernel is now known to control every finite number of
source sign changes, and any finite composition retains that control.
The proof is uniform in the *order* of the determinant and uses no
finite-order extrapolation. Equations (12)–(13) reduce the next source
inheritance question to a determinant comparison of signed source
densities under this operator.

What remains unproved here is a favorable, all-anchor comparison for
those actual theta density determinants, or an equivalent joint
anchor/spatial positivity statement. The next origin-curvature
condition is also independent. Therefore neither sixth-order Pick
positivity nor a repeatable RH induction is asserted.

## 8. Verification and audit scope

`theta_iterated_compensation_20261111.py` checks the Gaussian
Wronskian formula, the source and output Sylvester factors with
nonconstant prefixes, exact uniform-kernel minors, signed-density
determinants, the next canonical column factors, and the joint-anchor
counterexample. The all-order proof is in sections 2–3; these finite
checks validate its identities rather than replacing that proof.

The earlier PR #53 argument uses only the first confluence of the
remainder in its five-column transfer, consistent with its \(C^1\)
regularity. The extension above introduces smoothing before higher
confluence and removes it only in ordinary evaluation determinants.
This is the necessary regularity distinction for the present result.
