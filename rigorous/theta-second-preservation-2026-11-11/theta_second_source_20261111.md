# First reduced theta source tests: exact formulas and boundary results

**Role in the completed checkpoint.** This is a proof component. The [global theorem](theta_second_preservation_global_20261111.md) combines the source crossing, compensation, first-source origin, and second-origin results to prove second preservation and five-node positivity. Statements below limiting an individual component retain that local scope.


Research continuation, 11 November 2026. The two source Wronskians needed
for a second use of the PR #52 convexity transfer have simple exact
forms. Direct high-precision probes of these first reduced source tests
are positive at the sampled points. A stronger, anchor-independent
fifth-order source criterion fails near zero for the actual theta kernel.
The separate origin certificate in this checkpoint makes that failure
rigorous. This note proves that both fifth-order sources are positive
for every t>=4, and that the actual reduced source tests are positive
for large anchors on each fixed compact spatial interval.

These are different statements. A sufficient criterion can fail even
when the quantities it was intended to control are positive. No global
second-reduction preservation, five-node Pick theorem, or RH claim is
made here.

## 1. Definitions

Use the same normalization as PR #52:

$$
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}\,dt,
\qquad C(t)=\frac14\int_t^\infty s\kappa(s)\,ds.
$$

For a>0, write p=L(a)=F'(a)/F(a). The first canceled pair satisfies

$$
n+ab=C,\qquad an+4b''=p\kappa,
\qquad 4n''=a^2n+4C''-ap\kappa.
\tag{1}
$$

Put

$$
H=C/\kappa,\quad B=4C''/\kappa=tV'-1,\quad
J=4\kappa''/\kappa,\quad P=16C^{(4)}/\kappa,
\quad Q=16\kappa^{(4)}/\kappa,
\quad V=-\log\kappa.
$$

For the first canonical reduced pair (b,n), define
H_1=b/n, B_1=4b''/n, J_1=4n''/n and P_1=16b^{(4)}/n.
Let W_m denote the ordinary Wronskian with derivative rows 0,...,m-1.
The new source tests are

$$
W_{H,1}=W_3(B_1',J_1',-H_1'),\qquad
W_{P,1}=W_3(B_1',J_1',P_1').
$$

## 2. Exact determinant elimination

Let N=n/kappa. The quotient Wronskian identity and (1) give

$$
\boxed{
W_{H,1}=\frac{p}{a}\frac{W_4(n,\kappa,t\kappa',C)}{n^4}
=\frac{p}{aN^4}W_3(N',B',H'),
}
\tag{2}
$$

$$
\boxed{
W_{P,1}=-4p^2\frac{W_4(n,\kappa,t\kappa',\kappa'')}{n^4}
=-\frac{p^2}{N^4}W_3(N',B',J').
}
\tag{3}
$$

For (2), start with W_4(n,4b'',4n'',-b)/n^4.
Replace 4b'' by p*kappa-a*n, b by (C-n)/a, and
4n'' by a^2*n-(1+ap)*kappa-t*kappa'. Column subtraction
leaves the displayed determinant. For (3), use
16b^{(4)}=4p*kappa''-4a*n''; the same subtractions give
-4p^2 times the displayed W_4. Dividing all columns by kappa
and expanding the constant column gives the ratio formulas.

Consequently no derivatives of n above order three are needed. If
q_j=kappa^{(j)}/kappa, then the normalized n column is

$$
\left(N,\ N'+q_1N,\
\frac{a^2N-tq_1-1-ap}{4},\
\frac{a^2(N'+q_1N)-tq_2-(2+ap)q_1}{4}\right).
\tag{4}
$$

This formula is used by the diagnostic executable, whose n and n'
values come from positive centered-tail integrals.

## 3. The stronger fifth-order source criterion

The four-column transfer criterion uses

$$
S_H=W_4(B',J',P',H'),\qquad
S_Q=W_4(B',J',P',Q').
$$

Their exact kernel forms are

$$
\boxed{S_H=16\frac{W_5(\kappa,t\kappa',\kappa'',t\kappa''',C)}{\kappa^5},}
\tag{5}
$$

$$
\boxed{S_Q=256\frac{W_5(\kappa,t\kappa',\kappa'',t\kappa''',\kappa^{(4)})}{\kappa^5}.}
\tag{6}
$$

Indeed W_4(B',J',P',H')=W_5(1,B,J,P,H). Multiplication
of every column by kappa multiplies a fifth-order Wronskian by
kappa^5. The identities
kappa*B=-kappa-t*kappa', kappa*J=4*kappa'', and
kappa*P=-12*kappa''-4t*kappa''' give the factor 16;
replacing C by 16*kappa^{(4)} gives the factor 256.
There is no orientation ambiguity or numerical sign convention in
these factors.

For even functions and u=t^2, the derivative chain matrix has diagonal
2t, 4t^2, 8t^3, 16t^4. Therefore

$$
S_H=1024t^{10}W_{4,u}(B_u,J_u,P_u,H_u),
\qquad
S_Q=1024t^{10}W_{4,u}(B_u,J_u,P_u,Q_u).
\tag{7}
$$

The source factors are t^10, not t^6.

High-precision evaluation at the exact rational point t=1/16 gives

| Quantity | Diagnostic value, matching at 100 and 140 decimal digits |
| --- | --- |
| S_H | -6.6841425702917279550176903861265607e-7 |
| S_Q | -4.2062933309568153739762114632449079 |

These diagnostic numbers prompted the separate rigorous origin proof;
they are not used as a certificate. Both sources are negative near
zero. At t=1/8, the diagnostic S_H is positive while S_Q is still
negative; by t=1/2 both are positive. The tail proof below makes no
claim about a unique sign change.

## 4. Both fifth-order sources are positive on the infinite tail

**Theorem.** For the full theta kernel,

$$
\boxed{S_H(t)>1/2,\qquad S_Q(t)>1/2\quad\text{for every }t\ge4.}
\tag{8}
$$

Let x=pi*exp(t), so x>128 and t<x on this domain. To avoid confusing
this variable with the anchor value p=L(a), this proof calls it x.
The executable calls it p internally. Write kappa_0 for the first
theta term and

$$
r_0=-\kappa_0'/\kappa_0=x-\frac94-\frac3{2x-3},
\qquad D=\partial_t+x\partial_x.
$$

The first-term integrated ratio h_0 solves
D h_0-r_0h_0=-t/4. Set

$$
H_4=\frac{64x^3t+80x^2t+64x^2+116xt+96x+177t+140}{256x^4}.
$$

Its exact residual is

$$
R_4=DH_4-r_0H_4+t/4
=\frac{2082xt+1760x+5841t+2496}{1024x^4(2x-3)}>0.
\tag{9}
$$

Because kappa_0 H_4 tends to zero at infinity, integration of the
first-order equation gives

$$
h_0-H_4=\kappa_0(t)^{-1}\int_t^\infty\kappa_0(s)R_4(s)\,ds>0.
\tag{10}
$$

The first-term S_H is affine in h_0, say A*h_0+C_*. The exact audit
constructs it from derivative polynomials of kappa_0. Substituting
x=128+X and t=4+Y in the numerator and denominator of each rational
expression proves, by nonnegative coefficients and a positive constant,

$$
A>0,\qquad AH_4+C_*>1,\qquad S_{Q,0}>1.
\tag{11}
$$

The positive sign of A matters: the lower bound (10) is the one needed.
No sampled first-mode values enter (11).

### Full theta remainder through order eight

Write kappa=kappa_0(1+E), where

$$
E=\sum_{n\ge2}\left[n^4+\frac{3(n^4-n^2)}{2x-3}\right]e^{-(n^2-1)x}.
$$

For q=3/(2x-3), its geometric series has ratio 3/(2x)<1/64.
For 0<=j<=8,

$$
|D^jq|\le\sum_{m\ge1}m^8(1/64)^m
\le8!\frac{1/64}{(1-1/64)^9}<1024.
$$

For j<=7 the corresponding bound is less than 128. Derivatives
through order eight of each n-th prefactor are thus bounded by
2^11*n^4. Derivatives of exp[-(n^2-1)x] are bounded by
2^13*n^16*x^8 times that exponential, because the coefficient
norm of the eighth Touchard polynomial is Bell(8)=4140<2^13.
Leibniz's rule costs at most 2^8. Finally,

$$
\sum_{n\ge2}n^{20}e^{-(n^2-1)x}<2\cdot2^{20}e^{-3x},
$$

since its successive ratio is at most (3/2)^20*exp(-5x)<1/2.
Consequently

$$
|E^{(j)}|<2^{54}x^8e^{-3x}=:\delta\quad(0\le j\le8).
\tag{12}
$$

The finite logarithmic derivative formula bounds derivatives of
log(1+E) through order eight by 2^8*8!*7!*delta <2^38*delta.
Indeed there are fewer than 2^8 integer partitions of each order,
each coefficient is at most 8!*7!, all derivative products are
bounded by delta because delta<1, and (1+E)^(-k)<=1. Therefore
for r=-log(kappa)',

$$
|r^{(j)}-r_0^{(j)}|<2^{92}x^8e^{-3x}=:\epsilon
\quad(0\le j\le7).
\tag{13}
$$

Every term in E decreases. As in PR #52,
0<=h_0-H<=E(t)h_0. The inequalities
r_0>x/2, r_0<x, Dr_0>x imply that r_0/t increases for t>=4,
so the Gaussian tail estimate gives h_0<t/(4r_0)<1/2.
Thus |H-h_0|<delta/2<epsilon.

### Propagation to the source determinants

Use

$$
B=tr-1,\quad J=4(r^2-r'),\quad
P=4t(r^3-3rr'+r'')-3J,
$$

$$
Q=16(r^4-6r^2r'+3(r')^2+4rr''-r''').
$$

Substitute H'=rH-t/4 when differentiating. The exact expansions of
S_H and S_Q are differential polynomials in t,H,r,...,r^(7), of total
degrees 13 and 12 and coefficient norms 302068 and 60260864.
Both norms are less than 2^26. The seventh-order bound on q proves
|r_0^(j)|<2x for j<=7, and (13) gives |r^(j)|<3x. Every variable
on the segment between the full and first-mode evaluations is bounded
by 3x. The elementary polynomial difference estimate therefore gives

$$
|S_H-S_{H,0}|,\ |S_Q-S_{Q,0}|
\le13\cdot2^{26}(3x)^{12}\epsilon
<2^{144}x^{20}e^{-3x}<2^{-100}.
\tag{14}
$$

The last majorant decreases for x>=128, and its value at 128 is
bounded using e>2. Equations (10)--(14) prove (8).

## 5. Actual reduced sources for large anchors on bounded spatial intervals

**Theorem.** For each T>0, there is an A_T such that

$$
W_{H,1}(a,t)>0,\qquad W_{P,1}(a,t)>0
\quad\text{for }a\ge A_T,\quad0<t\le T.
\tag{15}
$$

This conclusion does not use global positivity of S_H or S_Q.
The threshold is an existence bound, not a computed number; its
growth with T is uncontrolled.

PR #52 proves, for every fixed derivative order j,

$$
N=\frac pa-\frac B{a^2}+\frac{pJ}{a^3}-\frac P{a^4}+E_a,
\qquad
\|E_a\|_{C^j([-T,T])}\le K_{T,j}\left(\frac p{a^5}+\frac1{a^6}\right).
\tag{16}
$$

The needed C^6 assertion can also be read directly from the exact
Laplace-convolution identity. With
A_a(s)=(a/4)exp(-a|s|/2), g=B*kappa and ordinary convolution *,

$$
n=\frac pa(A_a*\kappa)-\frac1{a^2}(A_a*g),
\qquad
A_a*q=q+\frac4{a^2}q''+\frac{16}{a^4}(A_a*q^{(4)}).
$$

Consequently the exact remainder in (16) is

$$
E_a=\frac{16p}{a^5}\frac{A_a*\kappa^{(4)}}{\kappa}
-\frac{16}{a^6}\frac{A_a*g^{(4)}}{\kappa}.
$$

All derivatives of kappa and g are bounded, convolution by the
probability density A_a has sup norm at most one, and all derivatives
of 1/kappa are bounded on [-T,T]. Differentiating this identity up to
six times proves (16) with j=6, independently of any previously fixed
derivative order. The remainder is even.

PR #52 also proves p/a->0 and ap->infinity. Let
M_a=aN/p. Then M_a->1 in C^6([-T,T]). Define the positive original
source determinants from PR #52 by

$$
W_{H,0}=W_3(B',J',-H'),\qquad
W_{P,0}=W_3(B',J',P').
$$

Linearity of the first column in (2)--(3) gives the exact expansions

$$
p^2W_{H,1}=M_a^{-4}\left[
W_{H,0}-\frac1{ap}W_3(P',B',H')
+\frac{a^3}{p}W_3(E_a',B',H')\right],
\tag{17}
$$

$$
p^2W_{P,1}=M_a^{-4}\left[
W_{P,0}-a^4W_3(E_a',B',J')\right].
\tag{18}
$$

The estimates remain uniform at t=0 despite the t^6 factor. For an
even C^6 function f, write f(t)=F(t^2). Repeated integration of the
odd derivatives gives

$$
\|F^{(j)}\|_\infty\le\frac{j!}{(2j)!}\|f^{(2j)}\|_\infty,
\qquad j=1,2,3.
$$

Together with W_t(f',g',h')=64t^6 W_u(F_u,G_u,H_u), this implies

$$
\sup_{0<t\le T}\frac{|W_3(f',g',h')|}{t^6}
\le\frac2{15}\|f\|_{C^6}\|g\|_{C^6}\|h\|_{C^6}.
\tag{19}
$$

For completeness, the derivative estimate follows from

$$
F^{(j)}(t^2)=\frac{1}{2^{2j-1}(j-1)!}
\int_0^1(1-s^2)^{j-1}f^{(2j)}(ts)\,ds.
$$

Its constant integrates to j!/(2j)!. Applying (19) to (17)--(18)
and then (16) gives uniform limits on [0,T], with the quotients
interpreted continuously at zero:

$$
\boxed{
\frac{p(a)^2W_{H,1}(a,t)}{t^6}\longrightarrow
\frac{W_{H,0}(t)}{t^6},\qquad
\frac{p(a)^2W_{P,1}(a,t)}{t^6}\longrightarrow
\frac{W_{P,0}(t)}{t^6}.}
\tag{20}
$$

PR #52 proves that both right-hand sides have positive minima on
each compact interval [0,T], including positive origin limits.
Therefore (20) proves (15).

## 6. Diagnostics and exact audits

`theta_second_source_20261111.py` evaluates (2)--(4) using high-precision
quadrature. `theta_second_source_fifth_probe_20261111.py` evaluates
(5)--(6). Their sampled signs are diagnostics only: no quadrature tail
or rounding certificate is claimed. The source-tail executable is
separate and uses exact symbolic identities and rational polynomial
coefficient tests; it implements all finite checks behind (8)--(14).

The actual reduced source probes remain positive in all 32 recorded
cases, including small and large anchors. Eight additional records
evaluate the fifth sources, and the rational negative witness is
replayed at 100 and 140 decimal digits with matching displayed values.
`theta_second_source_diagnostic_replay_20261111.json` records these
diagnostics. The exact tail audit passes 42 checks;
`theta_second_source_algebra_20261111.py` passes 16 checks of the
reduced determinant factors, expansions (17)--(18), and even-coordinate
constants. Both verification entry points reject Python optimization.

The sampled signs do not establish the reduced inequalities
for every anchor and spatial value. The rigorous near-origin failure
of (5)--(6) blocks the specific anchor-removal criterion, not the
actual reduced inequalities (2)--(3), and does not contradict RH.
