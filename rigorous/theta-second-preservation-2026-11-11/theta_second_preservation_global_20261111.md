# Second theta preservation and five-node real Pick positivity

Research continuation, 11 November 2026. This checkpoint proves that the
second canonical reduced theta pair satisfies the full comparison class
for every ordered pair of positive anchors. It consequently establishes
strict five-node real Pick positivity and the corresponding five-rate
energy inequality through the actual theta kernels. The proof uses
analytic comparison and rigorous interval certificates, with no
finite-height verification of zeta zeros.

The decisive change is a comparison theorem that permits one source
sign change. The stronger requirement of pointwise positivity of the
next source determinants is false for actual theta. An exact positive
integral kernel with an order-two determinant property allows the
negative source region to be controlled by positive initial data.

This is a finite-order result. Sixth-order positivity, arbitrary-depth
preservation, all-order energy positivity, and RH are not proved here.
No literature-novelty, formal proof-assistant, or external peer-review
claim is made.

## 1. The statement and its fixed inputs

Use

$$
\kappa(t)=e^{t/4}\sum_{n\ge1}
\bigl[2(\pi n^2e^t)^2-3\pi n^2e^t\bigr]e^{-\pi n^2e^t}
\quad(t\ge0),
$$

extended evenly, and

$$
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}\,dt,
\qquad L=F'/F,\qquad C(t)=\frac14\int_t^\infty s\kappa(s)\,ds.
$$

The canonical reduction of a positive even pair $(u,v)$ at anchor
$a>0$, with $r=R(a)>0$ and $R(z)=z\mathcal Lu(z)/\mathcal Lv(z)$,
is the pair $(b,n)$ determined by

$$
n+ab=u,\qquad an+4b''=rv.
\tag{1}
$$

For each pair define

$$
H=u/v,\qquad B=4u''/v,\qquad J=4v''/v.
$$

The **full comparison class** consists of the five strict spatial signs

$$
H'<0,\qquad B'>0,\qquad J'>0,\qquad
\frac{d^2H}{dB^2}>0,\qquad \frac{d^2J}{dB^2}>0
\quad(t>0).
\tag{2}
$$

PR #51 proves these conditions for $(C,\kappa)$ and the general
first comparison implication. PR #52 proves them for the first
canonical pair $(b_a,n_a)$ for every $a>0$. Those are fixed inputs,
with the immutable commits listed in `SOURCES.md`.

**Second preservation theorem.** Apply (1) first at any $a>0$ and
then to $(b_a,n_a)$ at any $c>0$. The second canonical pair
$(b_{a,c},n_{a,c})$ satisfies every condition in (2) for every $t>0$.
Coincident anchors are included by the analytic canceled formulas.

## 2. The two first-reduced source tests

For any input also write

$$
P=16u^{(4)}/v,\qquad Q=16v^{(4)}/v.
$$

Subscript 1 denotes quantities for the first pair $(b_a,n_a)$.
The second-order comparison of PR #52 shows that the two source signs

$$
\boxed{
W_{H,1}=W_3(B_1',J_1',-H_1')>0,\qquad
W_{P,1}=W_3(B_1',J_1',P_1')>0
}
\tag{3}
$$

give both new convexities at every second anchor. The Wronskian
$W_k$ has ordinary derivative rows $0,\ldots,k-1$.

Put $p=L(a)$ and $N=n_a/\kappa$. Exact column elimination gives

$$
W_{H,1}=\frac{p}{aN^4}W_3(N',B',H'),\qquad
W_{P,1}=-\frac{p^2}{N^4}W_3(N',B',J').
\tag{4}
$$

These formulas lower the derivative order needed for direct evaluation.
More significantly, the centered Green representation from PR #52,
followed by its hyperbolic coordinate change, gives a centered call
transform

$$
Tq(y)=\operatorname{Cov}_{\mu_a}(q(Y),(Y-y)_+).
$$

For fixed $a$, the underlying density is positive and smooth. With all
derivatives taken in that coordinate, the exact transformed identities are

$$
W_{H,1}=\frac{ap}{(TB)^4}W_4(TB,TJ,TP,TH),
$$

$$
W_{P,1}=\frac{p^2}{(TB)^4}W_4(TB,TJ,TP,TQ).
\tag{5}
$$

Changing back to the spatial coordinate multiplies each derivative-source
Wronskian by a positive coordinate factor. Thus (5) is used for signs
without suppressing a factor in an equality across different coordinates.

## 3. The stronger pointwise criterion fails, with one controlled crossing

The direct higher comparison would require

$$
S_H=W_4(B',J',P',H')>0,\qquad
S_Q=W_4(B',J',P',Q')>0.
$$

For the original theta pair these are exactly

$$
S_H=16\frac{W_5(\kappa,t\kappa',\kappa'',t\kappa''',C)}{\kappa^5},
$$

$$
S_Q=256\frac{W_5(\kappa,t\kappa',\kappa'',t\kappa''',\kappa^{(4)})}{\kappa^5}.
\tag{6}
$$

The obstruction certificate proves

$$
S_H/t^{10}<-100000,\qquad S_Q/t^{10}<-10^{12}
\quad(0<t\le1/16).
\tag{7}
$$

This is a failure of sufficient hypotheses for a comparison theorem,
not a counterexample to the reduced signs in (3). The distinction is
essential to the rest of the argument.

The single-crossing certificate proves substantially more: each of
$S_H,S_Q$ has exactly one simple zero on the positive spatial axis,
located in $(0,3/16)$ and oriented from negative to positive. The two
zeros need not be at the same location.

| Spatial region | Verified conclusion | Method |
| --- | --- | --- |
| $0\le t\le3/16$ | Each $S/t^{10}$ increases strictly from a negative to a positive value | Even degree-56 models and 256 interval cells |
| $3/16\le t\le4$ | Both sources are strictly positive | Order-16 Taylor models and 1,980 interval cells |
| $t\ge4$ | Both sources exceed $1/2$ | First-mode polynomial signs and full theta error $<2^{-100}$ |

All discarded series and integral tails are enclosed. The compact tests
are inequalities on entire intervals, not observations at sample points.

## 4. Why a single negative region can be controlled

The comparison theorem is proved in
`theta_transfer_compensation_20261111.md`. Here is the mechanism with
the signs and extra premise explicit.

Let $(f_1,f_2,f_3,f_4)$ be $(B',J',P',H')$ or
$(B',J',P',Q')$ in the hyperbolic source coordinate. The positive prefix

$$
f_1>0,\qquad W_2(f_1,f_2)>0,\qquad W_3(f_1,f_2,f_3)>0
$$

is already proved in PR #52. Set

$$
x=f_2/f_1,\qquad Y(x)=f_3/f_1,\qquad h(x)=f_4/f_1,
\qquad \rho=(h''/Y'')'.
$$

Then $x$ increases, $Y''>0$, and

$$
W_4(f_1,f_2,f_3,f_4)
=f_1^4(x')^6(Y'')^2\rho.
\tag{8}
$$

The transformed fourth Wronskian has an exact representation

$$
I(y)=\int \Pi(y,s)\rho(s)\,ds,
\tag{9}
$$

where $\Pi(y,s)>0$. It also has the order-two determinant property

$$
\Pi(y_1,s_1)\Pi(y_2,s_2)
-\Pi(y_1,s_2)\Pi(y_2,s_1)\ge0
\quad(y_1<y_2,\ s_1<s_2).
\tag{10}
$$

Both assertions are proved directly. The truncated convex remainder
$1_{x>s}[Y(x)-Y(s)-Y'(s)(x-s)]$ is a composition of positive step
kernels. Its ordered determinants, the exact four- and five-column
call-transform identities, and a Wronskian condensation identity give
(10). The proof includes the point-mass terms that would be lost by
naively differentiating the piecewise call kernel repeatedly.

Let $s_*$ be the single negative-to-positive crossing of $\rho$.
For $y\ge y_0$, (10) makes $\Pi(y,s)/\Pi(y_0,s)$ nondecreasing in $s$.
It follows that

$$
\boxed{
I(y)\ge\frac{\Pi(y,s_*)}{\Pi(y_0,s_*)}I(y_0).
}
\tag{11}
$$

Thus a positive initial transformed sign stays positive for every later
spatial point. Positivity of the initial sign remains a separate premise.
The theta endpoint and growth estimates justify every improper integral
and differentiation in this application.

## 5. Both initial transformed signs hold at every first anchor

The compact and tail source-origin certificates prove

$$
\boxed{
\lim_{t\downarrow0}\frac{W_{H,1}(a,t)}{t^6}>0,
\qquad
\lim_{t\downarrow0}\frac{W_{P,1}(a,t)}{t^6}>0
\quad(a>0).
}
\tag{12}
$$

The proof uses only the normalized origin value $N(a)=n_a(0)/\kappa(0)$,
$d=1+aL(a)$, and finitely many original theta jets. The canceled ODE
expresses the needed origin derivatives of $n_a$ through these data.
Two four-column origin determinants $D_H,D_P$ satisfy

$$
\lim_{t\downarrow0}\frac{W_{H,1}}{t^6}
=\frac{p}{aN^4}D_H,
\qquad
\lim_{t\downarrow0}\frac{W_{P,1}}{t^6}
=\frac{p^2}{N^4}D_P.
$$

For $0<a\le100$, fresh positive theta moments give correlated
degree-300 models in $(a/200)^2$. Exact deflation at $a=0$ retains
the identity $N(0)=C(0)/\kappa(0)$. The 4,096 interval cells prove

$$
D_H/a^2>3\cdot10^{-8},\qquad D_P>0.36.
$$

For $a\ge100$, an integrated Taylor model through the tenth theta
derivative, with a globally certified twelfth-derivative remainder,
encloses $N(a)$. The determinants are affine in $N,d$. Exact
coefficient signs after shifting $a^2=10000+X$ establish the required
positive bounds over the entire remaining anchor interval.

For each fixed anchor, (12) gives positivity on an initial spatial
interval. Applying (11), then (5), proves both signs in (3) for every
$a,t>0$. There is no sampled anchor inference in this step.

## 6. The second curvature has a positive origin slope at every anchor pair

The independent origin theorem proves

$$
\boxed{J_2''(0)>0\qquad(a,c>0).}
\tag{13}
$$

Its two-anchor reduction is particularly useful. With $p=L(a)$,
$q=L(c)$, the second canceled numerator is exactly

$$
n_{a,c}=p\frac{n_a-n_c}{cq-ap},
$$

with its continuous derivative interpretation at $c=a$. Put

$$
\gamma=-\kappa''(0)/\kappa(0),\quad N(a)=n_a(0)/\kappa(0),
\quad d=1+aL(a),
$$

$$
Y=a^2N-d,\qquad Z=a^2Y+4\gamma(d+2).
$$

Then

$$
J_2''(0)=\frac{\Delta N\Delta Z-(\Delta Y)^2}{4(\Delta N)^2}.
$$

The certificate proves that

$$
-\begin{pmatrix}N'&Y'\\Y'&Z'\end{pmatrix}\succ0
\qquad(a>0).
$$

Integrating this positive definite matrix between the two anchors
proves (13), including anchor pairs crossing the compact/tail boundary.
The coalescent formula follows from the same matrix at one anchor.

A 2,048-cell certificate covers $a\le100$. Above 100, elementary
trigamma and zeta Dirichlet-series estimates, together with a global
sixth-derivative Taylor remainder, give an explicit strict margin.

## 7. Complete second preservation

The comparison theorem's decay and integrability hypotheses carry over
to the first canceled pair. For each fixed anchor, its canceled tail
Green formulas and their differentiated equations retain all exponential
moments. More explicitly, with $z=\pi e^t$ and $p=L(a)$ fixed,
rescaling the tail distance by $1/z$ in those formulas gives

$$
n_a(t)\sim\frac{t\kappa(t)}{4z},\qquad
b_a(t)\sim\frac{p\kappa(t)}{4z^2}\qquad(t\to\infty).
$$

The first-mode estimate $-\kappa'/\kappa\sim z$ and its increasing
lower bound supply an integrable exponential majorant for that
rescaling. Differentiated kernels are bounded by $\kappa$ times
polynomials in $t,e^t$; the displayed positive leading terms give the
corresponding ratio bounds. Thus the new source ratios and their
needed derivatives grow at most polynomially in $t,e^t$, and their
products with the tilted $n_a$ density are integrable. This is the
same canceled-tail mechanism used in the fixed preceding kernel
proofs; the second application does not assume compact support.

Because the first pair is in the full class, the existing first
comparison theorem makes $H_2'<0$ and $B_2'>0$. The now proved
source signs (3), used in the second-order comparison theorem, make
$H_2,J_2$ strictly convex as functions of $B_2$ at every second anchor.

Equation (13) implies $J_2'(t)>0$ for all sufficiently small positive
$t$. Strict convexity makes $J_2'/B_2'$ increase thereafter, so this
positive sign cannot reverse. Hence $J_2'>0$ for all $t>0$.
All five conditions in (2) hold for the second canonical pair.

## 8. Five-node Pick and energy consequences

The reduction count is

$$
R_0\text{ full}\longrightarrow R_1\text{ full}
\longrightarrow R_2\text{ full}
\longrightarrow R_3\text{ basic}
\longrightarrow R_4\text{ positive}.
$$

Here basic means a positive pair with $H'<0$ and $B'>0$; the crossing
lemma then gives a positive next pair. Thus four successive strict
Schur pivots and a positive final response imply

$$
\boxed{
\left[\frac{L(x_i)+L(x_j)}{x_i+x_j}\right]_{i,j=1}^{5}\succ0
\quad\text{for every five distinct positive real nodes }x_i.
}
\tag{14}
$$

The canonical reciprocal swaps are valid because
$T_a(1/R)=1/T_aR$ for the real Schur reduction and
$K_{1/R}(x,y)=K_R(x,y)/[R(x)R(y)]$. The latter is a diagonal
congruence. At distinct nodes the canceled transform factors make
the Schur congruence factors nonzero. Removable anchor values are
defined by the entire canceled kernels. These are the strictness
conditions in the fixed preceding Schur proofs.

For any nonzero test with at most five distinct exponential rates
$x_i>1/2$, the exact arithmetic/theta energy identity from PR #48
therefore gives

$$
\sum_{i,j}\overline{c_i}c_j
\frac{L(x_i)+L(x_j)}{x_i+x_j}>0.
\tag{15}
$$

This raises the proved finite matrix order from four to five.
No assertion is made for arbitrary numbers of rates or for general
test functions.

## 9. The remaining route to RH

The existing closure theorem would turn positivity at every finite
order into a positive-real continuation of $L$ to the right half-plane,
excluding poles there and hence off-critical zeros of the completed
xi function. Its all-order premise remains unproved.

This checkpoint supplies a concrete propagation mechanism at the next
finite step: one source crossing, positive transformed origin data,
and a separate new-curvature origin gate. A further induction needs
these ingredients, or an adequate replacement, for subsequent actual
reduced pairs. The present single-crossing result concerns the original
theta sources used to control the first reduced pair; it is not proved
to reproduce automatically after another reduction.

The complete deliverable includes the analytic components, exact
symbolic audits, interval certificates, explicit remainders, replay
results, fixed-source provenance, and a status table distinguishing
proved and open statements.
