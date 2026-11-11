# First theta reduction preserves the full comparison class

Research continuation, 10 November 2026. This checkpoint proves the
three preservation signs left open in PR #51 for the actual first
reduced theta pair, at every positive anchor and every positive spatial
argument. The proof combines an analytic second-order comparison,
rigorous one-variable theta certificates, and an all-anchor origin
inequality. It supplies an intrinsic theta proof of the four-node real
Pick theorem, with no finite-height zero verification.

A separate certified counterexample proves that the proposed comparison
class is not preserved for general positive kernel pairs. Thus the
actual-theta theorem below is one reduction, not an all-depth induction
or an RH proof. No literature-novelty claim is made.

## 1. Normalization and theorem

Use the actual even theta kernel

$$
\kappa(t)=e^{t/4}\sum_{n\ge1}
\left[2(\pi n^2e^t)^2-3\pi n^2e^t\right]e^{-\pi n^2e^t},
\qquad t\ge0,
$$

$$
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}dt,
\quad L=F'/F,
\quad C(t)=\frac14\int_t^\infty s\kappa(s)ds.
$$

The classical theta input and the PR #51 ratio theorem are fixed proof
dependencies. In particular, kappa is positive, even, decreasing on the
positive half-line, and Q=-kappa'/(t*kappa)>0 has Q'>0. For a>0,
put p=L(a)>0. The positive canceled pair satisfies

$$
n_a+a b_a=C,\qquad an_a+4b_a''=p\kappa,
$$

$$
(n_a/b_a)'>0,\qquad(n_a/\kappa)'<0\quad(t>0).
\tag{1}
$$

For any positive even pair (u,v), define

$$
H=u/v,\qquad B=4u''/v,\qquad J=4v''/v.
$$

Call its comparison conditions the signs H'<0, B'>0, J'>0 and
strict convexity of H and J as functions of the increasing coordinate B.

**Theorem.** For every a>0, the first canonical reduced pair
(u_1,v_1)=(b_a,n_a) satisfies all of these comparison conditions on
the entire positive spatial axis. Explicitly, with

$$
H_1=b_a/n_a,\quad B_1=4b_a''/n_a,\quad J_1=4n_a''/n_a,
$$

$$
\boxed{H_1'<0,\quad B_1'>0,\quad J_1'>0,\quad
\frac{d^2H_1}{dB_1^2}>0,\quad
\frac{d^2J_1}{dB_1^2}>0\qquad(a,t>0).}
\tag{2}
$$

All first spatial derivatives vanish at zero by evenness. The strict
derivative signs in (2) concern t>0; a strictly positive second
derivative at zero is used separately below.

## 2. Source determinants remove the anchor again

For the original theta pair u=C,v=kappa, put

$$
V=-\log\kappa,\quad H=C/\kappa,\quad
B=tV'-1,\quad J=4\kappa''/\kappa,
$$

$$
P=16C^{(4)}/\kappa=-4t\kappa'''/\kappa-3J.
$$

For three functions define their Wronskian by

$$
\mathcal W(g_1,g_2,g_3)=
\det\begin{pmatrix}
g_1&g_2&g_3\\g_1'&g_2'&g_3'\\g_1''&g_2''&g_3''
\end{pmatrix}.
$$

The new anchor-free theta tests are

$$
\boxed{W_H=\mathcal W(B',J',-H')>0,\qquad
W_P=\mathcal W(B',J',P')>0.}
\tag{3}
$$

The [second-order comparison proof](theta_preservation_comparison_20261110.md)
shows that (3), together with the original comparison conditions proved
in PR #51, makes both H_1 and J_1 strictly convex as functions of B_1
for every a>0. The proof expresses a canceled Green inverse as a call
covariance, then as a positive integral transform of source derivatives.
Its three-column derivative determinant has an explicit positive formula.
A continuous Cauchy--Binet identity transfers source convexity to
convexity of the quotient of the transformed functions.

In particular, no anchor grid is used. The additional source information
is convexity of -H'/B' and P'/B' as functions of J'/B'. That information
is stronger than the two original convexities in PR #51.

For verification, the tests have polynomial cleared numerators:

$$
W_H=4\mathcal W_4(\kappa,t\kappa',\kappa'',C)/\kappa^4,
$$

$$
W_P=16\mathcal W_4(\kappa,t\kappa',\kappa'',t\kappa''')/\kappa^4,
\tag{4}
$$

where W_4 uses derivative rows of orders zero through three. Only
theta derivatives through order six and the integrated value C occur.
The exact identities are checked symbolically by the executable.

## 3. Exhaustive proof of the actual-theta source signs

The following regions cover every t>0, sharing their endpoints.

| Region | Proof | Conservative strict margins |
| --- | --- | --- |
| 0<t<=1/8 | Even degree-24 Taylor models, Cauchy remainders, 128 interval cells | W_H/(64t^6)>4.39; W_P/(64t^6)>850000 |
| 1/8<=t<=4 | Order-14 interval Taylor models, 1,984 cells | W_H>0.00104; W_P>201.99 |
| t>=4 | Rational first-theta-term comparison with explicit full-series errors | W_H>1/2; W_P>1/2 |

Every displayed decimal margin is an exact rational lower bound. All
interval gates test full outward-rounded balls; no point-sampling
inference is used.

### Origin: even coordinate and correlated polynomial evaluation

Put u=t^2 and K(u)=kappa(t). Evenness gives

$$
W_t(B',J',Q')=64t^6 W_u(B_u,J_u,Q_u),\qquad Q=-H\text{ or }P.
\tag{5}
$$

The complex-disk bound from PR #51 is |kappa(t)|<40000 for |t|<=1/2.
Thus, if K(u)=sum b_k u^k, Cauchy's inequality gives
|b_k|<=40000*4^k. Sixteen theta terms determine coefficient balls
through degree 24; the omitted complex-disk theta sum has the bound
480*17^4*exp(-3*17^2/2), multiplied by 4^k for coefficient k.

For derivative order j<=6, the omitted Taylor series is bounded by
a geometric majorant starting at k=25, whose successive ratio is at
most 4u*(k+1)/(k+1-j)<1 on 0<=u<=1/64. The relation

$$
C(\sqrt u)=C(0)-\frac18\int_0^uK(v)dv
$$

provides an integrated model with its own explicit remainder. C(0)
is recomputed rigorously using the copied PR #51 endpoint module.

Each derivative model is a polynomial plus a uniform interval remainder.
The determinant is formed as a polynomial before evaluating u on a
cell. All polynomial products are retained, preserving algebraic
cancellations in the shared coordinate. The independent error
coefficients are pointwise enclosures of the corresponding actual
remainders; the implementation does not differentiate those artificial
error coefficients. This proves the normalized signs in (5), including
their positive limiting values at zero.

### Core: full Taylor models and backward C integration

On each dyadic cell centered at m with half-width d, theta derivative j
has the enclosure

$$
\kappa^{(j)}(m+\delta)\in
\sum_{q=0}^{13}\frac{\kappa^{(j+q)}(m)}{q!}\delta^q
+\frac{\kappa^{(j+14)}([m-d,m+d])}{14!}\delta^{14},
\quad |\delta|\le d,
$$

for j=0,...,6. The theta-derivative polynomial recurrence and explicit
geometric tails enclose every jet through order 20. Cell widths are at
most 1/64 and are halved until width*pi*exp(right)<=1/8.

Starting from rigorous C(4), the code integrates the kappa model
backwards. It uses an absolute error bound for each half-cell and
twice that error for the full cell; it never cancels an unknown odd
remainder. Both determinants in (4) retain every polynomial product.
Since kappa decreases, its enclosed left-endpoint value bounds the
positive denominator kappa^4 above. The direct and propagated C(1/8)
enclosures overlap as an additional consistency check.

The entire compact proof is implemented in
`theta_preservation_wronskian_certificate_20261110.py`. It uses the
three copied PR #51 helper modules listed in SOURCES.md. Their theta,
Cauchy, and integration errors are explicit; no old floating-point
diagnostic values are substituted.

### Infinite tail

Section 6 of the comparison note proves both signs for t>=4. With
p=pi*exp(t)>128, the first-term integrated ratio h_0 is bounded above
by a rational expression H_3+R/r_0. The W_H expression is affine in
h_0 with negative coefficient, so that upper bound gives a lower
bound for W_H. Shifted polynomial coefficient checks give both
first-term margins greater than one. All omitted theta terms and
derivatives through order six give a common Wronskian error less than
2^(-116). This proves the half-unit tail margins in the table.

Together, the three regions prove (3) on the entire positive axis.
The comparison theorem therefore establishes both new convexities
in (2), for all anchors.

## 4. The remaining slope is positive at every anchor

Strict convexity alone does not force J_1 to increase. The separate
[origin proof](theta_preservation_origin_20261110.md) establishes

$$
\boxed{J_1''(0)>0\qquad\text{for every }a>0.}
\tag{6}
$$

The exact condition, with c=-kappa''(0)/kappa(0), d=1+ap, and
N_0=n_a(0)/kappa(0), is

$$
J_1''(0)=\frac{[d(a^2+4c)+8c]N_0-d^2}{4N_0^2}>0.
\tag{7}
$$

For 0<a<=20, the PR #51 ratio sandwich bounds the origin curvature
of n_a by that of C. The rigorous constants c>4.68,
kappa(0)/(4C(0))<5.19, and p(20)<0.7 give a positive rational
margin. For a>=20, a global sixth-degree Taylor lower bound for the
normalized theta kernel is integrated against the positive origin
Green weight. After clearing the target denominator, a polynomial in
d-9/5 and (a/2)^2-100 has strictly positive coefficients.

The required global bound |kappa^(6)|/kappa(0)<1500 is certified on
[0,4] by 4,096 interval cells and beyond 4 by an explicit analytic
series bound. The finite constant and anchor integrals include both
theta-series and spatial-tail errors. Thus (6) holds for every anchor,
without sampling the anchor axis.

## 5. Complete the preservation proof

Let z=kappa/n_a. Equation (1) gives z'>0. The exact new ratios are

$$
H_1=(Hz-1)/a,\qquad B_1=pz-a,\qquad
J_1=a^2+(B-ap)z.
$$

The basic signs H_1'<0 and B_1'>0 follow from PR #51. Section 3 gives
strict convexity of both H_1 and J_1 in B_1. Equation (6) implies
J_1'(t)>0 for all sufficiently small positive t. On t>0,

$$
\frac{dJ_1}{dB_1}=J_1'/B_1'
$$

is strictly increasing by the proved convexity. Its initial positive
sign therefore persists for every t>0. This proves J_1'>0 globally
and completes all five assertions in (2).

No assumption about a nonzero B_1''(0) is needed: the argument starts
at an arbitrarily small strictly positive t, where B_1'>0 is known.

## 6. Intrinsic four-node Pick and energy consequences

The transform of C is F'/z, so the starting response is L=zU/V.
For a response R with anchor value r=R(a), define the real Schur
reduction

$$
T_aR(x)=\frac{xR(x)-ar}{xr-aR(x)}.
$$

Reciprocity commutes with reduction, using the reciprocal anchor
value:

$$
T_a(1/R)=1/(T_aR).
\tag{8}
$$

It also preserves real Pick positivity by diagonal congruence. Thus
the canonical swaps used for kernel pairs preserve the relevant
Schur chain.

The starting pair is strong in the sense of Section 1. The new
theorem makes its first canonical reduced pair strong for every
anchor. The general comparison theorem from PR #51 then gives the
basic signs H'<0 and B'>0 for the second canonical pair. The basic
crossing lemma makes the third canonical pair positive. Three strict
Schur pivots consequently give

$$
\boxed{
\left[\frac{L(x_i)+L(x_j)}{x_i+x_j}\right]_{i,j=1}^4\succ0
\quad\text{for every four distinct positive real nodes }x_i.
}
\tag{9}
$$

At distinct nodes the diagonal congruence factors are nonzero: each
canceled factor is a multiple of x^2-a^2 times a positive transform,
divided by positive transforms. Removable anchor values are defined
by the entire canceled transforms. The endpoint positive pair gives
a positive last pivot. These are the same strictness mechanisms used
in the fixed preceding Schur proofs.

For a nonzero test v(t)=sum b_i exp(-x_i t), with at most four distinct
rates x_i>1/2, (9) implies strict positivity of the exact quadratic
energy sum over conjugate(b_i)*b_j*(L(x_i)+L(x_j))/(x_i+x_j).
The arithmetic energy identity and its convergence are the fixed
PR #48 result. The present proof of its four-rate positivity uses no
finite-height zero theorem.

PR #50 already established (9) by a different argument. This is an
independent theta-kernel proof of that finite-order result; it does
not raise the proved matrix order to five.

## 7. Why the general induction still fails

The [counterexample proof](theta_preservation_counterexample_20261110.md)
uses the positive even pair

$$
v(t)=e^{-t^2},\qquad u(t)=e^{-t^2}/\sqrt{t^2+5}.
$$

All starting comparison conditions hold strictly and globally, by
exact polynomial identities. At anchor a=10, a rigorous integral
certificate proves that the new H is strictly concave as a function
of the new B near zero. Thus the comparison class alone is not an
invariant class.

The new source criterion detects the missing information: for this
example,

$$
\mathcal W(B',J',-H')
=\frac{1536t^6(2t^6+30t^4+15t^2-950)}{(t^2+5)^8}<0
\quad(0<t\le1).
$$

For actual theta the same source determinant is positive everywhere,
as proved above. The counterexample does not satisfy u=C_v and is
not a counterexample to the actual theta theorem or RH.

To continue, corresponding higher source conditions and a sufficient
origin-slope condition must be proved for later actual reduced pairs,
or replaced by another invariant structure. Neither their automatic
preservation nor arbitrary-order Pick positivity is asserted here.

## Reproduction and review

Run `python run_checks.py` after installing the pinned requirements.
It recomputes the source certificates, the all-anchor origin constants,
the counterexample, and the exact comparison and asymptotic audits.
The replay, AUDIT.md, and SOURCES.md distinguish analytic proof,
rigorous interval gates, reused fixed inputs, and open claims.
