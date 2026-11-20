# A second-order covariance comparison for the theta ladder

Research continuation, 10 November 2026. This note proves a comparison
theorem that removes the anchor from both new convexity requirements.
The companion [global proof](theta_preservation_global_20261110.md)
combines this theorem with a separate origin inequality to establish
the remaining new-J monotonicity for actual theta. Preservation through
arbitrary depth remains open. No RH or novelty claim is made.

## 1. The additional source criteria

Let u,v be positive smooth even kernels with the required rapid decay,
transform moments, and absolute integrability needed for the covariance
identities and differentiated integral formulas below. Retain

$$
H=u/v,\qquad B=4u''/v,\qquad J=4v''/v,
\qquad P=16u^{(4)}/v=4(vB)''/v.
$$

Assume the starting comparison class: H'<0, B'>0, J'>0, and H,J
strictly convex as functions of B. In particular
$J''B'-J'B''>0$.
For three functions define the Wronskian

$$
\mathcal W(g_1,g_2,g_3)
=\det\begin{pmatrix}g_1&g_2&g_3\\
g_1'&g_2'&g_3'\\g_1''&g_2''&g_3''\end{pmatrix}.
$$

**Second-order comparison theorem.** The two additional source signs

$$
\boxed{\mathcal W(B',J',-H')>0,\qquad
\mathcal W(B',J',P')>0\quad(t>0)}
\tag{1}
$$

imply that H_new and J_new are strictly convex as functions of B_new
after every positive-anchor reduction and canonical swap. The two
signs are independent of the anchor. They are sufficient conditions,
not asserted to be necessary.

In source coordinates, (1) says that both

$$
-H'/B'\quad\hbox{and}\quad P'/B'
$$

are strictly convex as functions of the increasing coordinate J'/B'.
Thus second-order comparison requires additional information about
source derivatives beyond the first-order class of PR #51.

## 2. A positive derivative kernel for the call covariance

Let mu have continuous strictly positive density m on (0,1), and let
F be its distribution function. Put

$$
G(r,s)=F(\min(r,s))[1-F(\max(r,s))],
\qquad
K(y,s)=\int_y^1G(r,s)dr.
$$

For a smooth q with the necessary absolute integrability,

$$
Tq(y):=\operatorname{Cov}_{\mu}(q(Y),(Y-y)_+)
=\int_0^1K(y,s)q'(s)ds.
\tag{2}
$$

To see this, write q as an integral of its derivative times
$1_{Y>s}$, and $(Y-y)_+=\int_y^1 1_{Y>r}dr$. The covariance
of the two indicators is exactly G(r,s). Truncation and dominated
convergence extend the identity to the unbounded endpoint behavior
that arises from the theta change of variables.

Define the positive tail A(s)=integral_s^1[1-F(r)]dr. For s<y,

$$
K=F(s)A(y),\quad K_y=-F(s)[1-F(y)],\quad K_{yy}=m(y)F(s).
$$

For s>y,

$$
K=[1-F(s)]\int_y^s F(r)dr+F(s)A(s),
$$

$$
K_y=-F(y)[1-F(s)],\qquad K_{yy}=-m(y)[1-F(s)].
$$

For s>y put Q_y(s)=K(y,s)/[1-F(s)]. Direct differentiation gives

$$
Q_y'(s)=\frac{m(s)A(s)}{[1-F(s)]^2}>0.
\tag{3}
$$

For ordered s1<s2<s3, the derivative-column determinant is zero
unless s1<y<s2<s3; on that region it is exactly

$$
\boxed{
\det[\partial_y^{i-1}K(y,s_j)]_{i,j=1}^3
=m(y)F(s_1)[1-F(s_2)][1-F(s_3)]
[Q_y(s_3)-Q_y(s_2)]>0.
}
\tag{4}
$$

If at least two s_j are below y, their columns are proportional. If
all are above y, the last two rows are proportional. The remaining
case gives (4) by subtracting the normalized second column from the
third. This is an elementary positivity calculation specific to the
call-covariance kernel; no general total-positivity assertion is
assumed without checking its applicability.

## 3. Projective convexity is preserved

Suppose q1'>0 and

$$
X=q2'/q1'\quad\hbox{is strictly increasing},\qquad
Y=q3'/q1'\quad\hbox{is strictly convex as a function of X}.
$$

For ordered s1<s2<s3,

$$
\det[q_j'(s_i)]_{i,j=1}^3
=\prod_i q1'(s_i)
\det\begin{pmatrix}1&X(s_1)&Y(s_1)\\
1&X(s_2)&Y(s_2)\\1&X(s_3)&Y(s_3)\end{pmatrix}>0.
\tag{5}
$$

The final determinant is positive by strict increase of X and strict
convexity of Y(X). Multilinearity, Fubini, and antisymmetrization give
the continuous Cauchy--Binet identity

$$
\mathcal W(Tq1,Tq2,Tq3)(y)
=\int_{0<s_1<s_2<s_3<1}
\det[\partial_y^{i-1}K(y,s_j)]
\det[q_j'(s_i)]\,ds_1ds_2ds_3>0.
\tag{6}
$$

Strictness follows from the positive-measure region s1<y<s2<s3.
The corresponding two-column identity gives x' > 0 for x=Tq2/Tq1.
For s1<s2 both above y, its kernel factor is

$$
\det\begin{pmatrix}K(y,s_1)&K(y,s_2)\\K_y(y,s_1)&K_y(y,s_2)\end{pmatrix}
=F(y)[1-F(s_1)][1-F(s_2)][Q_y(s_2)-Q_y(s_1)]>0.
$$

For s1<y<s2 it equals

$$
F(s_1)[1-F(s_2)]
\{[1-F(y)]Q_y(s_2)-F(y)A(y)\}>0,
$$

because Q_y(y)=F(y)A(y)/[1-F(y)] and (3) is strict. With
both s_j below y the factor vanishes. The source factor is
q1'(s1)q1'(s2)[X(s2)-X(s1)]>0. Integrating therefore gives a
strictly positive two-column Wronskian. Here Tq1>0 by (2).
Writing w=Tq3/Tq1, direct differentiation yields

$$
\boxed{\frac{d^2w}{dx^2}
=\frac{\mathcal W(Tq1,Tq2,Tq3)}{(Tq1)^3(x')^3}>0.}
\tag{7}
$$

This proves the second-order comparison. An equivalent differential
source hypothesis is

$$
\mathcal W(q1',q2',q3')>0,
\qquad q2''q1'-q2'q1''>0,
\qquad q1'>0.
$$

The source quotients are unchanged by any increasing reparametrization.
The sign of their Wronskian is also unchanged: passing from t to y
multiplies the derivative-source Wronskian by (dt/dy)^6.

## 4. Application to the canceled pair

At anchor a, write r=R(a), R=zU/V. The positive first reduced pair
satisfies n+ab=u and an+4b''=rv. With the centered Green operator
$\mathcal G_{a,v}$, whose common positive prefactor times T was
proved in PR #51,

$$
n=\mathcal G_{a,v}[B],\qquad
v=\mathcal G_{a,v}[J],\qquad
b=a\mathcal G_{a,v}[-H].
$$

The first two centered means are E B=ar and E J=a^2.
Integration by parts also gives E P=a^3r. Differentiating the n
source twice, with rapid decay and the canceled boundary conditions,
therefore gives the exact identity

$$
\boxed{4n''=\mathcal G_{a,v}[P-arJ].}
\tag{8}
$$

Consequently, for z=v/n,

$$
H_{\rm new}=a\frac{\mathcal G[-H]}{\mathcal G[B]},\qquad
B_{\rm new}=rz-a,
$$

$$
J_{\rm new}=
\frac{\mathcal G[P]}{\mathcal G[B]}-ar z.
\tag{9}
$$

Apply (7) with (q1,q2,q3)=(B,J,-H) and then (B,J,P).
The common Green prefactor cancels. Multiplying by a>0, changing from
z to rz-a, and subtracting the linear term ar z preserve strict
convexity. Equations (1) therefore prove both promised new convexities
for every a>0.

For actual theta, the source ratios and their derivatives grow at most
polynomially in t and exp(t), while the tilted theta density decays
double-exponentially. The hyperbolic coordinate change contributes
only fixed exponential factors at a fixed anchor. These estimates
justify the required absolute integrability, differentiation, and
Fubini steps in the application.

This theorem does not imply J_new'>0. Strict convexity as a function
of an increasing coordinate permits a negative initial slope. The
origin slope, or another argument excluding that possibility, is an
additional requirement.

## 5. Actual-theta form and auxiliary tail theorem

For u=C,v=kappa and V=-log kappa,

$$
B=tV'-1,\quad J=4\kappa''/\kappa,\quad H=C/\kappa,
\quad P=-4t\kappa'''/\kappa-3J.
\tag{10}
$$

The two new source Wronskians can also be written as fourth-order
Wronskians of the original kernels:

$$
\mathcal W(B',J',-H')
=4\mathcal W_4(\kappa,t\kappa',\kappa'',C)/\kappa^4,
$$

$$
\mathcal W(B',J',P')
=16\mathcal W_4(\kappa,t\kappa',\kappa'',t\kappa''')/\kappa^4.
\tag{11}
$$

In the even variable u=t^2, each source Wronskian has an exact t^6
factor: W_t(B',J',Q')=64t^6 W_u(B_u,J_u,Q_u).
These identities are useful for rigorous bounded-interval proofs.

The companion executable and tail derivation below establish that
both source Wronskians exceed one half for every t>=4. The remaining
bounded interval is certified separately in the companion global proof
and its interval executable; those additional inputs complete the
global signs.

## 6. Explicit tail proof for both new Wronskians

Set p=pi exp(t); then t>=4 implies p>128 and t<p. The first theta
term is

$$
\kappa_0=2\pi^2 e^{9t/4-p}(1-3/(2p)),\quad
r_0=-\kappa_0'/\kappa_0=p-9/4-3/(2p-3).
$$

Use D=partial_t+p partial_p for rational functions of (t,p).
Define B0=t r0-1, J0=4(r0^2-D r0), and

$$
P_0=4t(r_0^3-3r_0Dr_0+D^2r_0)-3J_0.
$$

Let h0 be the first-term integrated ratio. It solves
Dh0-r0h0=-t/4. Put

$$
H_3=\frac{16p^2t+20pt+16p+29t+24}{64p^3},
$$

$$
R=DH_3-r_0H_3+t/4
=\frac{354pt+280p+609t+156}{256p^3(2p-3)}.
\tag{12}
$$

On p>=128,t>=4, R>0 and DR<0, while r0>0 and Dr0>0.
The integrating-factor formula and the exponential tail bound give

$$
0<h_0-H_3
=\kappa_0(t)^{-1}\int_t^\infty\kappa_0(s)R(s)ds
<R(t)/r_0(t).
\tag{13}
$$

The first-term Wronskian W_H0 is affine in h0, say A h0+C.
Exact rational coefficient checks after p=128+X,t=4+Y show

$$
A<0,\qquad A(H_3+R/r_0)+C>1,\qquad W_{P0}>1.
\tag{14}
$$

The executable recomputes the expressions from B0,J0,P0 and the h0
ODE, then checks that the shifted numerator and denominator
polynomials have nonnegative coefficients and positive constants.
Thus (13)--(14) prove both first-term margins, without point sampling.

### All omitted theta terms and derivatives

Write kappa=kappa0(1+E), where

$$
E=\sum_{n\ge2}\left[n^4+
\frac{3(n^4-n^2)}{2p-3}\right]e^{-(n^2-1)p}.
$$

For q=3/(2p-3), the geometric series
$q=\sum_{m\ge1}(3/(2p))^m$ shows
$|D^j q|<16$ for 0<=j<=6: use 3/(2p)<1/64 and

$$
\sum_{m\ge1}m^6x^m
\le720x/(1-x)^7<16\quad(0<x\le1/64).
$$

Hence every derivative through order six of the n-th prefactor is
bounded by 32n^4. Derivatives of exp(-beta p) are Touchard
polynomials times that exponential; for j<=6 their coefficient norm
is at most Bell(6)=203<256. Since beta p>=1, their absolute values
are at most 256 n^12 p^6 exp(-beta p).
Leibniz's rule and the Gaussian geometric ratio then give

$$
|E^{(j)}|\le2^{40}p^6e^{-3p}=:\delta,
\quad0\le j\le6.
\tag{15}
$$

Indeed, the product-rule factor is at most 2^6, and
$\sum_{n\ge2}n^{16}e^{-(n^2-1)p}
<2\cdot2^{16}e^{-3p}$: its first successive ratio is bounded by
$(3/2)^{16}e^{-5p}<1/2$ and the ratios decrease thereafter.

For r=-log(kappa)', the derivatives through order five differ from
those of r0 by derivatives of log(1+E) through order six. The finite
Faà di Bruno formula, E>=0, and delta<1 imply

$$
|r^{(j)}-r_0^{(j)}|<2^{64}p^6e^{-3p}=:\varepsilon,
\quad0\le j\le5.
\tag{16}
$$

A deliberately loose coefficient bound suffices: at most 2^6
partitions contribute, each coefficient is at most 6!5!, and
every derivative product is bounded by delta.

Each summand of E decreases, so 0<=h0-h<=E(t)h0. Also
r0<p, Dr0>p, r0>p/2 imply (r0/t)'>0 on t>=4. The usual
Gaussian tail comparison gives h0<t/(4r0)<1/2. Therefore
|h-h0|<delta/2<epsilon.

### Propagating the error to the Wronskians

Express both Wronskians as polynomials in t,h,r,r',...,r^(5),
using h'=rh-t/4. The exact symbolic expansion finds total degree
eight, with coefficient norms 419 and 11344, both below 2^20.
For 0<=j<=5, |r0^(j)|<2p, from the same q-series bounds;
(16) then gives |r^(j)|<3p. All variables, including t and h,
are bounded by 3p along the segment joining the two evaluations.
The polynomial difference bound consequently gives

$$
|W_H-W_{H0}|,\ |W_P-W_{P0}|
\le8\cdot2^{20}(3p)^7\varepsilon
<2^{128}p^{20}e^{-3p}.
$$

The last majorant decreases for p>=128. Using e>2 at p=128
gives a bound below 2^(-116), hence below one half. Combined with
(14), this proves

$$
\boxed{W_H>1/2,\qquad W_P>1/2\quad(t\ge4).}
$$

## 7. The resulting four-node corollary, with its precise inputs

Suppose the actual-theta signs (1) are established on all t>0, and
the first canonical reduction satisfies J_new,a''(0)>0 for every
a>0. The new convexity theorem then proves J_new,a'>0 everywhere:
the positive second derivative gives a positive first derivative for
small positive t, and strict convexity in the increasing B_new
coordinate makes dJ_new/dB_new increase thereafter. Thus the first
canonical reduced pair belongs to the full stronger class.

The induction count at this finite stage is

$$
R_0\text{ strong}\ \longrightarrow\
R_1\text{ strong}\ \longrightarrow\
R_2\text{ basic}\ \longrightarrow\ R_3\text{ positive}.
$$

Here basic means a positive pair with H'<0 and B'>0; that suffices
to make both next canceled kernels positive. The second arrow uses
the PR #51 comparison theorem, and the third uses the original
single-crossing Green lemma. Every anchor is arbitrary and positive.

The reciprocal swaps are legitimate at every step because, for

$$
T_aR(x)=\frac{xR(x)-aR(a)}{xR(a)-aR(x)},
$$

one has the exact identity T_a(1/R)=1/T_a(R), with the reciprocal
anchor value. Reciprocal response kernels are related by the positive
diagonal Pick congruence. At distinct nodes the Schur diagonal factors
are nonzero because the canceled numerator and denominator transforms
are positive and their uncanceled factors are x^2-a^2.
Three successive positive Schur pivots consequently give

$$
\left[\frac{L(x_i)+L(x_j)}{x_i+x_j}\right]_{i,j=1}^4\succ0
\quad\text{for four distinct }x_i>0.
$$

This is a conditional corollary here until the two stated global
theta inputs are supplied. It does not give a fifth-node result:
the second canonical pair has only the basic shape conclusion in
this argument. In particular it does not prove all-depth preservation.

## 8. The new criterion excludes the general-class counterexample

For the separately verified counterexample
v=exp(-t^2), u=v/sqrt(t^2+5), the source Wronskian is exactly

$$
\mathcal W(B',J',-H')
=\frac{1536t^6(2t^6+30t^4+15t^2-950)}{(t^2+5)^8}.
$$

It is strictly negative on 0<t<=1. The extra hypothesis (1)
therefore excludes this input even though it satisfies the original
PR #51 comparison class. The strengthened source criterion adds
information relevant to the demonstrated failure of preservation.

## References and scope

The prior normalization and first-order comparison are in PR #51,
commit afdac28948ab084e80214c31ef72c9520d943760. The call-kernel
determinant and the transfer theorem are proved directly above.
For related covariance determinant and Chebyshev-system methods see
M. Bonnefont, E. Hillion and A. Saumard, *Covariance inequalities for
convex and log-concave functions*, ALEA 21 (2024), 627--660,
DOI 10.30757/ALEA.v21-25, especially Section 4:
https://alea.impa.br/articles/v21/21-25.pdf . This contextual reference
does not replace checking the signs for our particular call kernel.

The symbolic checks audit the displayed algebra and rational margins.
The integration, strictness, remainder, and convergence arguments remain
part of the mathematical proof. No formal proof-assistant or external
peer-review claim is made.
