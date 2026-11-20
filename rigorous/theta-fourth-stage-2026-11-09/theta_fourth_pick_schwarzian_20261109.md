# The fourth real Pick stage is an exact Schwarzian test

Research continuation, 9 November 2026. This note derives an exact
fourth-order criterion for the centered xi response. Its scalar
Schwarzian inequalities are expressed in the original squared
coordinate, eliminating the extra anchor parameter from the condition.
The criterion and its transfer proof are established here. The companion
[uniform actual-xi proof](theta_fourth_stage_proof_20261109.md) establishes
its two strict signs on the whole positive axis; together the notes prove
positive definiteness for every four distinct positive real nodes. No RH,
all-orders, or novelty claim is made.

## 1. Setup and the correct reduction hypotheses

Write

$$
F(x)=\xi(1/2+x),\qquad L(x)=F'(x)/F(x),\qquad
h(u)=L(\sqrt u)/\sqrt u,\qquad j(u)=u h(u),\qquad g(u)=1/h(u).
\tag{1}
$$

The preceding checkpoint proves, strictly on the positive axis,

$$
h>0,\quad h'<0,\quad j'>0,\quad
hh''-2h'^2>0,\quad j''<0.
\tag{2}
$$

Thus both g and j are strictly increasing and strictly concave. It also
proves positive definiteness of every three-node real Pick matrix for L,
where

$$
K_L(x,y)=\frac{L(x)+L(y)}{x+y}.
\tag{3}
$$

For an anchor a>0, p=L(a), the first reduction is

$$
R_a(x)=\frac{xL(x)-ap}{xp-aL(x)}.
\tag{4}
$$

Its value at x=a is removable. The correct real-axis input for applying
the earlier three-node calculation to this reduced function is

$$
R_a(x)>0,\qquad -R_a(x)<xR_a'(x)<R_a(x).
\tag{5}
$$

One must not assume R_a' is positive: the reduced response generally has
a positive residue at zero and therefore decreases near that endpoint.

The earlier three-node proof uses only the increase of xR and decrease
of R/x, rather than the stronger condition R'>0. The exact generalization
is as follows.

**Generalized three-node lemma.** Let R be smooth and positive, and let
$-R<xR'<R$ throughout the positive axis. Put
$H(u)=R(\sqrt u)/\sqrt u$, $G=1/H$, and $J=uH$. Then all
three-node matrices of $K_R(x,y)=(R(x)+R(y))/(x+y)$ are PSD if and
only if $G''\le0$ and $J''\le0$. Strict signs give positive
definiteness for distinct nodes.

To check every hypothesis, the differential assumptions give H>0,
H'<0, and J'>0, hence G'>0. The reduction at any anchor b is positive:
its numerator has the sign of x-b by the increase of xR, and its
denominator has that same sign by the decrease of R/x. Its removable
value is $(R(b)+bR'(b))/(R(b)-bR'(b))>0$. The Schur identity (8),
with L replaced by R, then reduces three-node positivity to two-node
positivity of this reduced response Q. For any positive Q,

$$
\det K_Q(x,y)=
\frac{(xQ(x)-yQ(y))(xQ(y)-yQ(x))}{xy(x+y)^2},
$$

so all its two-node matrices are PSD exactly when xQ increases weakly
and Q/x decreases weakly. With v=b^2 and
$\mathcal T=(J(u)-J(v))/(H(v)-H(u))>0$, these conditions are
$\mathcal T_u\ge0$ and $(u/\mathcal T)_u\ge0$. The identities

$$
\mathcal T=\frac{G(v)}{G[u,v]}-v,
\qquad \frac u{\mathcal T}=\frac{H(v)}{J[u,v]}-1
$$

show that they are exactly concavity of G and J: for either increasing
function f,
$\partial_u f[u,v]=\{(u-v)f'(u)-f(u)+f(v)\}/(u-v)^2$, whose
nonpositivity for all u,v is the tangent criterion for concavity.
The denominators are positive; continuity gives the same conclusion at
the anchor. Strict second derivatives make the tangent inequalities
strict. This proves the generalized lemma without using R'>0.

The strict inequalities in (2) imply (5) for R_a, including at the
removable anchor, as verified below.

## 2. Reducing four nodes to two anchored concavities

Put u=x^2 and v=a^2. Define

$$
T(u,v)=\frac{j(u)-j(v)}{h(v)-h(u)}\qquad(u\ne v).
\tag{6}
$$

It has a smooth positive removable extension at u=v. Directly,

$$
R_a(\sqrt u)=\frac{T(u,v)}{a\sqrt u},\qquad
h_a(u):=\frac{R_a(\sqrt u)}{\sqrt u}=\frac{T(u,v)}{a u}.
\tag{7}
$$

The anchor Schur complement is the exact diagonal congruence

$$
K_L(x,y)-\frac a p K_L(x,a)K_L(a,y)
=\frac{(xp-aL(x))(yp-aL(y))}{p(x+a)(y+a)}K_{R_a}(x,y).
\tag{8}
$$

For x,y different from a, the diagonal factors are nonzero. Their signs
do not affect positivity under congruence. Consequently every four-node
matrix for L is PSD if and only if every three-node matrix of every R_a
is PSD. Nodes equal to the anchor in the reduced problem are handled by
continuity; necessity starts with nodes distinct from a.

For a positive response R satisfying (5), the three-node criterion is
concavity of 1/h_R and of u h_R, where h_R(u)=R(sqrt(u))/sqrt(u).
The latter is equivalent to the previously used concavity of h_R(1/u):
the second derivatives have the same sign after the reciprocal-variable
change. Applying this to (7) gives

$$
\boxed{\text{all four-node }K_L\succeq0
\quad\Longleftrightarrow\quad
\partial_u^2 T(u,v)\le0,\quad
\partial_u^2\{u/T(u,v)\}\le0
\quad\text{for every }u,v>0.}
\tag{9}
$$

For the actual response, (2) supplies the strict lower-order hypotheses.

## 3. Reciprocal divided differences remove the anchor parameter

For a differentiable f, write

$$
f[u,v]=\frac{f(u)-f(v)}{u-v},\qquad f[v,v]=f'(v).
$$

Two elementary identities are decisive:

$$
\boxed{T(u,v)=\frac{g(v)}{g[u,v]}-v,\qquad
\frac u{T(u,v)}=\frac{h(v)}{j[u,v]}-1.}
\tag{10}
$$

All their denominators are positive because g and j strictly increase.
Thus (9) is exactly the requirement that

$$
u\longmapsto\frac1{g[u,v]}
\quad\text{and}\quad
u\longmapsto\frac1{j[u,v]}
\tag{11}
$$

be concave for every fixed positive v.

The earlier strict concavity of g and j proves (5) transparently: the
first expression in (10) strictly increases with u, while the second
strictly increases with u. Hence T increases and T/u decreases. At u=v,
the derivative of the first expression is

$$
-\frac{g(v)g''(v)}{2g'(v)^2}>0,
$$

and that of the second is

$$
-\frac{h(v)j''(v)}{2j'(v)^2}>0.
$$

These give the strict derivatives at the removable anchor as well. Smoothness and
comparisons across the removable point therefore cause no gap.

## 4. A direct reciprocal-divided-difference lemma

### Lemma

Let f be C^3 on an open interval I, with f'>0. The following are
equivalent:

1. For every v in I, the function u -> 1/f[u,v] is concave on I.
2. The Schwarzian derivative
   $$
   \mathcal S f=\frac{f'''}{f'}-\frac32\left(\frac{f''}{f'}\right)^2
   \tag{12}
   $$
   is nonnegative everywhere on I.
3. The positive function r=(f')^{-1/2} is concave on I.

If the Schwarzian is strictly positive everywhere, the reciprocal
divided differences have strictly negative second derivative everywhere.

### Proof, including the tangent denominator

The identity

$$
r''=-\frac12 r\,\mathcal S f
\tag{13}
$$

proves the equivalence of statements 2 and 3. Fix v and put
t=u-v, d=f[u,v]. For u != v, differentiation gives

$$
d'=(f'(u)-d)/t,
\qquad
d d''-2d'^2
=\frac{d\{t f''(u)+2f'(u)\}-2f'(u)^2}{t^2}.
\tag{14}
$$

Concavity of r gives its tangent-line bound on the segment from u to v:

$$
0<r(s)\le r(u)+r'(u)(s-u).
\tag{15}
$$

In particular r(u)-t r'(u)>=r(v)>0. The tangent line is therefore
positive throughout the segment, so taking inverse squares and
integrating is legitimate. In either orientation of the segment,

$$
\begin{aligned}
d&=\frac1t\int_v^u \frac{ds}{r(s)^2}\\
&\ge\frac1t\int_v^u
\frac{ds}{[r(u)+r'(u)(s-u)]^2}\\
&=\frac1{r(u)[r(u)-t r'(u)]}.
\end{aligned}
\tag{16}
$$

The final identity also holds when r'(u)=0, by its direct constant
integral or by continuity. Because f'=r^{-2} and f''=-2r'/r^3, the
numerator in (14) equals

$$
\frac2{r(u)^4}
\{d\,r(u)[r(u)-t r'(u)]-1\}\ge0.
\tag{17}
$$

Therefore

$$
\left(\frac1d\right)''
=-\frac{d d''-2d'^2}{d^3}\le0.
\tag{18}
$$

If r''<0, the tangent inequality is strict inside every nontrivial
segment, proving strictness in (16)--(18).

Conversely, at u=v the integral representation of the divided difference
gives d=f', d'=f''/2, and d''=f'''/3. Hence

$$
\left.\partial_u^2\frac1{f[u,v]}\right|_{u=v}
=\frac{3f''(v)^2-2f'(v)f'''(v)}{6f'(v)^3}
=-\frac{\mathcal S f(v)}{3f'(v)}.
\tag{19}
$$

Its nonpositivity proves statement 2, completing the lemma.

## 5. The fourth-stage theorem in the original coordinate

The Schwarzian is unchanged by post-composition with a nonconstant
fractional linear map. Direct differentiation gives, in particular,
$\mathcal S(1/h)=\mathcal S h$ wherever h and h' are nonzero.
Applying the lemma to (10) proves:

> Under the strict lower-order hypotheses (2), all four-node real Pick
> matrices of L are PSD if and only if
> $$
> \boxed{2h'h'''-3h''^2\ge0,\qquad
> 2j'j'''-3j''^2\ge0\quad(u>0),\qquad j=uh.}
> \tag{20}
> $$
> Strict inequalities everywhere give positive definiteness for every
> four distinct positive nodes.

This is a one-variable criterion: no anchor parameter remains. Its
sufficiency is global on the interval because of the tangent-integral
argument, rather than only a coalescing-node necessary condition.

In the original x coordinate, put A=xL', B=x^2L'', C=x^3L'''. Then

$$
\begin{aligned}
16x^{10}(2h'h'''-3h''^2)
={}&3L^2-2L(C+3B+3A)\\
&+2AC-3B^2+6AB+3A^2,
\end{aligned}
\tag{21}
$$

$$
\begin{aligned}
16x^6(2j'j'''-3j''^2)
={}&3L^2+2L(C+3B+3A)\\
&+2AC-3B^2-6AB-9A^2,
\end{aligned}
\tag{22}
$$

where the derivatives on the left are in u=x^2. These identities are
useful for direct gamma and prime-series estimates on the unbounded
real axis.

## 6. Exact spectral moment forms

For each centered upper-half-plane zero $\rho=\beta+i\gamma$ of F,
with $\gamma>0$ and with multiplicity, set
$\lambda=-\rho^2=\gamma^2-\beta^2-2i\beta\gamma$.
The genus-zero product for $F(\sqrt u)$ gives
$h(u)=2\sum_\lambda(u+\lambda)^{-1}$. Let

$$
S_k(u)=\sum_\lambda(u+\lambda)^{-k},\qquad
W_k(u)=\sum_\lambda\lambda(u+\lambda)^{-k}.
\tag{23}
$$

The multisets include conjugation and multiplicity. These sums are real
on u>0, but individual parameters need not be real. Differentiation gives

$$
\boxed{2h'h'''-3h''^2=48(S_2S_4-S_3^2),}
\tag{24}
$$

$$
\boxed{2j'j'''-3j''^2=48(W_2W_4-W_3^2).}
\tag{25}
$$

For a head of verified real zeros, with lambda_i=gamma_i^2 and
r_i=(u+lambda_i)^{-1}, the corresponding positive margins are

$$
S_2S_4-S_3^2
=\sum_{i<j}\frac{(\lambda_i-\lambda_j)^2}
{(u+\lambda_i)^4(u+\lambda_j)^4},
\tag{26}
$$

$$
W_2W_4-W_3^2
=\sum_{i<j}\frac{\lambda_i\lambda_j(\lambda_i-\lambda_j)^2}
{(u+\lambda_i)^4(u+\lambda_j)^4}.
\tag{27}
$$

Equations (26)--(27) are asserted here only for the real positive head.
For the full possibly complex spectral parameters, treating these as
positive Cauchy--Schwarz expressions would assume an unproved property.
A justified tail estimate or a direct theta argument is required for
the actual sign. The companion
[uniform actual-xi proof](theta_fourth_stage_proof_20261109.md) supplies
that estimate on $0\le u\le10^4$, using the published finite zero
verification and two explicit positive head margins. It proves the
remaining half-line directly from the gamma and prime-series formulas
using (21)--(22). Thus both inequalities in (20) hold strictly for the
actual xi response on every u>0; there is no need to differentiate
every anchored rational response separately.

## 7. Connection with two-by-two Loewner positivity

For f'>0, the lemma's Schwarzian condition is also equivalent to

$$
\begin{pmatrix}f'(u)&f[u,v]\\f[u,v]&f'(v)\end{pmatrix}\succeq0
\quad(u,v\in I).
\tag{28}
$$

To see sufficiency, concavity of r=(f')^{-1/2} places r above its chord
on [u,v]. Integrating the reciprocal square of that chord gives

$$
f[u,v]\le\frac1{r(u)r(v)}=\sqrt{f'(u)f'(v)},
$$

which is (28). Conversely the coalescing determinant in (28) has leading
coefficient $(2f'f'''-3f''^2)/12$, forcing the Schwarzian sign.
This is the familiar scalar form of matrix monotonicity of order two.

Therefore the fourth-stage condition can be stated as two-by-two Loewner
positivity for g=1/h and j=uh. Equivalently it can use -h and j, because

$$
g[u,v]=\frac{-h[u,v]}{h(u)h(v)}
$$

is a positive diagonal congruence. Another exact identity is

$$
\boxed{K_L(x,y)=j[x^2,y^2]-xy\,h[x^2,y^2].}
\tag{29}
$$

This connects the ladder kernel to a pair of ordinary Loewner kernels.
It does not by itself prove that fourth-order positivity is preserved
under the next reduction or establish a finite-order correspondence of
arbitrary order. The all-order case still needs positivity at every
matrix size.

The relation between positive higher Schwarzian derivatives, Padé
approximants, and finite-order matrix monotonicity is established prior
work. Kozlovski--Sands, Lemma 10, gives the general finite-order
connection; its introduction records fractional-linear invariance and
the distinction between finite order and a full Pick-class extension.
Our use here is the explicit transfer to the current fourth ladder stage,
with an elementary proof of the needed order-two lemma.

## 8. A theta-moment form of the first new sign

The preceding theta notation has

$$
u=4\theta^2,\qquad g(u)=4m(\theta),\qquad
m(\theta)=E_{\nu_\theta}q,
$$

where dnu_theta is proportional to v kappa(v) sinh(theta v) dv and
q=-kappa'/(v kappa). Since m'>0, the Schwarzian chain rule gives

$$
\mathcal S h(u)=\mathcal S g(u)
=\frac{\mathcal S m(\theta)}{64\theta^2}
+\frac3{128\theta^4}.
$$

Thus the first inequality in (20) is exactly

$$
\boxed{
2\theta^2m'm'''-3\theta^2(m'')^2+3(m')^2\ge0.
}
\tag{30}
$$

The second sign uses j(u)=theta^2/m(theta) and has the same
square-root-coordinate Schwarzian correction. Formula (30) is an exact
condition on the actual theta moment function, rather than an assertion
that monotonicity of q automatically controls its third derivative.
The companion spectral/large-axis proof establishes the fourth-stage
inequalities, so (30) is **strictly positive for every theta>0** for the
actual theta moment. This is a proved finite-order theta inequality,
obtained through the verified spectral head and the direct large-axis
estimates. It does not yet supply an invariant under arbitrary further
reductions.

## Sources and review

- Previous repository checkpoint: PR #48, commit
  499528b487e3249c5a35602f83343aaa53cec848,
  `rigorous/theta-schur-kernels-2026-11-09/`, especially the three-node
  curvature note. The present note makes explicit that the reduced
  response needs |xR'|<R rather than R'>0.
- O. Kozlovski and D. Sands, *Higher order Schwarzian derivatives in
  interval dynamics*, Fundamenta Mathematicae 206 (2009), 217--239,
  DOI 10.4064/fm206-1-12. Introduction and Lemma 10.
  <https://impan.pl/shop/publication/transaction/download/product/88562>
  <https://arxiv.org/abs/0812.2646>

The reciprocal-divided-difference proof was checked in both orientations
u<v and u>v, including positivity of the tangent denominator. Symbolic
differentiation checked the coordinate formulas (21)--(22). No numerical
grid or assumed global positive spectral measure enters this criterion.
