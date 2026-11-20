# Removing the anchor from the next theta-ratio problem

Research continuation, 10 November 2026. This note proves a general
comparison lemma for the canceled Green operator. It reduces the two
pointwise theta-ratio targets of PR #50, for every positive anchor, to
two convexity tests involving only the original kernel. The general
comparison theorem is proved here. The companion
[global theta proof](theta_ratio_global_20261110.md) verifies the
displayed tests on the entire positive axis, using rigorous interval
certificates on a bounded interval and an analytic tail proof. Together
the notes establish both requested ratio signs for every positive
anchor. Preservation under further reductions remains open.

## 1. The original targets and a common coordinate

Use the established normalization

$$
F(z)=\int_{\mathbb R}\kappa(t)e^{zt/2}dt,
\quad L=F'/F,
\quad C(t)=\frac14\int_t^\infty s\kappa(s)ds\quad(t\ge0).
$$

For a fixed anchor $a>0$, let $p=L(a)$, and retain the positive first
pair $n_a,b_a$ of PR #50. It satisfies

$$
n_a+a b_a=C,\qquad
(4\partial_t^2-a^2)n_a=-(t\kappa)' -ap\kappa.
\tag{1}
$$

The next sufficient conditions were

$$
(n_a/b_a)'>0,\qquad(n_a/\kappa)'<0\quad(t>0).
\tag{2}
$$

Because $n_a,b_a,C>0$ and $n_a+a b_a=C$, the first condition is
equivalent to $(n_a/C)'>0$. Thus the desired simultaneous result is
the logarithmic-derivative sandwich

$$
\boxed{\frac{C'}C<\frac{n_a'}{n_a}<\frac{\kappa'}\kappa.}
\tag{3}
$$

The ordering of the endpoints is consistent: $(C/\kappa)'<0$ has
already been proved for actual theta. In particular, (3) would also
prove $n_a'<0$.

Introduce three functions of the original kernel only:

$$
V=-\log\kappa,\qquad
f(t)=tV'(t),\qquad
W(t)=4\frac{\kappa''(t)}{\kappa(t)}
       =4\bigl(V'(t)^2-V''(t)\bigr),\qquad
h(t)=\frac{C(t)}{\kappa(t)}.
\tag{4}
$$

For actual theta, $f'>0$ and $h'<0$ on $t>0$ follow from the
previously established $Q=V'/t>0$, $Q'>0$, and $4QC<\kappa$.
The new sufficient tests are

$$
\boxed{
W'>0,\qquad
D_W:=W''f'-W'f''>0,\qquad
D_h:=h''f'-h'f''>0\quad(t>0).
}
\tag{5}
$$

Equivalently, W is strictly increasing and strictly convex as a
function of f, while h is strictly decreasing and strictly convex as
a function of f. These conditions do not contain the anchor a.

**Theorem.** Suppose an even, positive, smooth kernel has the required
rapid decay and transform moments, and satisfies $f'>0$, $h'<0$, and
(5) on the positive half-line. Then the two inequalities (2) hold for
every $a,t>0$. Consequently the two second canceled kernels of PR #50
are positive for every first and second positive anchor.

The proof follows from the comparison lemma below. The theorem is
sufficient; necessity is not asserted.

## 2. A covariance comparison lemma

Let $\mu$ be a probability measure with strictly positive density on
an interval $(\alpha,\beta)$, with the moments used below finite. For
an increasing function g, define

$$
H_g(y)=\operatorname{Cov}_\mu\bigl(g(Y),(Y-y)_+\bigr),
\qquad \alpha<y<\beta.
\tag{6}
$$

For increasing f and g, both covariances are positive. If f as a
function of g is concave, then $H_f/H_g$ is nonincreasing in y. If
that dependence is strictly concave, the ratio strictly decreases.
Convexity reverses the conclusions.

### Proof

Write $F(y)=\mu((\alpha,y])$ and

$$
\begin{aligned}
A_f(y)&=\int_y^\beta[f(s)-f(y)]\,d\mu(s),\\
B_f(y)&=\int_\alpha^y[f(y)-f(s)]\,d\mu(s),\\
M_f(y)&=\operatorname{Cov}_\mu(f(Y),1_{Y>y}).
\end{aligned}
$$

Then

$$
M_f=F A_f+(1-F)B_f>0,\qquad
M_f'=\mu'(y)(A_f-B_f).
\tag{7}
$$

The first identity follows by splitting the mean of f at y. The
second also follows directly from
$M_f=\int_y^\beta(f-Ef)d\mu$.
An exact cancellation now gives

$$
\boxed{
\left(\frac{M_f}{M_g}\right)'
=\frac{\mu'(y)}{M_g(y)^2}
\bigl[A_f(y)B_g(y)-B_f(y)A_g(y)\bigr].
}
\tag{8}
$$

If f as a function of g is concave, every right secant slope at y
is at most every left secant slope at y. The positive weighted
averages of these slopes therefore satisfy

$$
\frac{A_f}{A_g}\le\frac{B_f}{B_g}.
\tag{9}
$$

For strictly concave dependence and positive density, the inequality
is strict. Thus $M_f/M_g$ decreases, strictly in that case.

Since $(Y-y)_+=\int_y^\beta 1_{Y>s}ds$, Fubini gives

$$
H_f(y)=\int_y^\beta M_f(s)ds,
\qquad
\frac{H_f(y)}{H_g(y)}
=\frac{\int_y^\beta[M_f(s)/M_g(s)]M_g(s)ds}
{\int_y^\beta M_g(s)ds}.
\tag{10}
$$

This is a positive tail-weighted average of the decreasing ratio.
Differentiating gives

$$
\left(\frac{H_f}{H_g}\right)'
=\frac{M_g(y)}{H_g(y)}
\left[\frac{H_f(y)}{H_g(y)}-\frac{M_f(y)}{M_g(y)}\right]\le0,
\tag{11}
$$

strictly for strict concavity. All inequalities reverse for convex
dependence. This proves the lemma. The argument applies by truncation
and dominated convergence whenever the displayed moments are finite.

## 3. The canceled Green operator is exactly this covariance

Fix $a>0$, let $\lambda=a/2$, and set

$$
Z_a=\int_0^\infty\kappa(s)\cosh(\lambda s)ds=F(a)/2,
\qquad
d\mu_a(s)=\frac{\kappa(s)\cosh(\lambda s)}{Z_a}ds.
$$

For a function q with finite required moments, write $\bar q=E_{\mu_a}q$
and let $\mathcal G_a[q]$ denote the canceled inverse transform
of the even source $\kappa(q-\bar q)$. The prior Green lemma gives

$$
\mathcal G_a[q](t)
=\frac1{2a}\int_t^\infty
\sinh[\lambda(s-t)]\kappa(s)(q(s)-\bar q)ds.
\tag{12}
$$

Put $y=\tanh(\lambda t)$ and $Y=\tanh(\lambda s)$. The identity

$$
\frac{\sinh[\lambda(s-t)]}{\cosh(\lambda s)}1_{s>t}
=\cosh(\lambda t)(Y-y)_+
$$

proves the exact representation

$$
\boxed{
\mathcal G_a[q](t)
=\frac{Z_a\cosh(\lambda t)}{2a}
\operatorname{Cov}_{\mu_a}\bigl(q(s),(Y-y)_+\bigr).
}
\tag{13}
$$

The pushforward of $\mu_a$ under s to Y has a strictly positive
density on $(0,1)$. Since this change of variables is increasing,
it does not change whether one source function is convex or concave
as a function of another. The common prefactor in (13) cancels in
ratios, and $dy/dt>0$. The covariance comparison lemma therefore
applies directly to ratios of canceled Green inverses.

In particular, if f and g increase and f as a function of g is
strictly concave, then $\mathcal G_a[f]/\mathcal G_a[g]$ strictly
decreases for every a. For strict convexity it strictly increases.

## 4. Apply the lemma to the exact theta pair

Integration by parts and the defining equations give

$$
E_{\mu_a}f=1+ap,\qquad
E_{\mu_a}W=a^2,\qquad
E_{\mu_a}h=p/a.
\tag{14}
$$

Consequently

$$
\boxed{
n_a=\mathcal G_a[f],\qquad
\kappa=\mathcal G_a[W],\qquad
C=\mathcal G_a[f-a^2h].
}
\tag{15}
$$

For example, $4C''=\kappa(f-1)$, so
$(4\partial_t^2-a^2)C=\kappa(f-a^2h-1)$, and
$E_{\mu_a}(f-a^2h)=1$. This verifies the third identity with its
normalization. The second follows from the source
$4\kappa''-a^2\kappa$; the first is equation (1).

### The upper logarithmic-derivative bound

If W increases and is strictly convex as a function of f, then f
is a strictly concave function of W. Applying the comparison lemma
to the first two identities in (15) gives

$$
\boxed{(n_a/\kappa)'<0\quad\text{for every }a,t>0.}
\tag{16}
$$

### The lower logarithmic-derivative bound

If h decreases and is strictly convex as a function of f, then
$g_a=f-a^2h$, as a function of f, is strictly increasing and
strictly concave. Its inverse f as a function of $g_a$ is therefore
strictly convex. The comparison lemma and (15) give

$$
\boxed{(n_a/C)'>0\quad\text{for every }a,t>0.}
\tag{17}
$$

The already established $b_a>0$ and $n_a+a b_a=C$ turn (17) into
$(n_a/b_a)'>0$. Together (16) and (17) prove the theorem.

This application is intrinsic to the original kernel. It uses no
verified zero head, no assumed positive spectral measure, and no
matrix-size extrapolation. The companion global proof supplies the
actual-theta verification of (5).

## 5. Explicit one-variable differential tests

Write $v_k=V^{(k)}(t)$. Then

$$
f'=v_1+t v_2,\qquad f''=2v_2+t v_3,
$$

$$
W'=4(2v_1v_2-v_3),\qquad
W''=4(2v_2^2+2v_1v_3-v_4).
$$

Thus the first convexity numerator is

$$
\boxed{
\frac{D_W}{4}
=-2v_1v_2^2+2v_1^2v_3-v_1v_4+2v_2v_3
+t(2v_2^3-v_2v_4+v_3^2).
}
\tag{18}
$$

The tail ratio obeys exact first-order identities

$$
h'=v_1h-t/4,\qquad
h''=(v_2+v_1^2)h-(1+t v_1)/4.
$$

Therefore

$$
\boxed{
\begin{aligned}
D_h={}&h\bigl[v_1^3-v_1v_2
+t(v_2^2+v_1^2v_2-v_1v_3)\bigr]\\
&+\frac14\bigl[t v_2+t^2v_3-v_1-t v_1^2-t^2v_1v_2\bigr].
\end{aligned}
}
\tag{19}
$$

In particular, this second numerator is affine in the single tail
quantity $h=C/\kappa$. A rigorous enclosure of C and the first four
logarithmic derivatives is sufficient for interval verification away
from the symmetry point. The test is one-dimensional; there is no
anchor parameter left to sample or bound.

### The symmetry point

Because the functions are even, the first derivatives vanish at zero
and the two determinants start at order $t^3$. Put

$$
c=V''(0),\qquad d=V^{(4)}(0),\qquad e=V^{(6)}(0),
\qquad H=h(0).
$$

Taylor expansion gives

$$
\boxed{D_W(t)
=\frac83(4c^2d-ce+2d^2)t^3+O(t^5),}
\tag{20}
$$

$$
\boxed{D_h(t)
=\left(2c^3H-\frac23cdH-\frac12c^2+\frac13d\right)t^3
+O(t^5).}
\tag{21}
$$

Also $W'(t)=4(2c^2-d)t+O(t^3)$. These formulas identify what a
rigorous small-t certificate must control. Positivity at one small
sample point does not replace a remainder bound on an interval.

## 6. Scope and next continuation

The proved result is an anchor-free sufficient comparison theorem and
its exact application to the current theta sources. The two required
convexities are stronger than the old $Q'>0$ hypothesis. In particular,
the generic counterexample from PR #48 does not invalidate the lemma;
it shows why additional hypotheses are needed.

The companion proof establishes (5) for actual theta, so the two next
ratio signs and the positive second kernel pair follow for all positive
anchors. This does not establish an invariant under every later reduction.
At later stages one needs corresponding convex-comparison information
for the new pair's sources. A one-step sign theorem is not an all-order
preservation theorem.

## 7. The precise preservation question for the stronger class

The comparison theorem has a general two-kernel form. Let u,v be a
positive even pair with transforms U,V and current response $R=zU/V$.
Define

$$
H=u/v,\qquad B=4u''/v,\qquad J=4v''/v.
\tag{22}
$$

Suppose $H'<0$, $B'>0$, $J'>0$, and both H and J are strictly
convex as functions of B. At the anchor a, put $r=R(a)>0$.
The next kernels n,b satisfy

$$
n=\mathcal G_{a,v}[B],\qquad
b=\mathcal G_{a,v}[-aH],\qquad
n+ab=u,\qquad an+4b''=rv,
\tag{23}
$$

where $\mathcal G_{a,v}$ is (12) with base density v.
The same comparison proof gives

$$
(n/b)'>0,\qquad(n/v)'<0.
\tag{24}
$$

Hence the swapped positive pair $(b,n)$ has the basic shape conditions

$$
(b/n)'<0,\qquad(4b''/n)'>0.
\tag{25}
$$

This pair corresponds to the reciprocal of the reduced response.
Reciprocation preserves real Pick positivity by the exact diagonal
congruence

$$
K_{1/R}(x,y)=\frac{K_R(x,y)}{R(x)R(y)}.
$$

It is therefore legitimate to use the swapped pair as the canonical
Type I pair at the next stage. This makes the preservation question
uniform across the alternating parity types.

Set $z(t)=v(t)/n(t)$. Equation (24) gives $z'>0$. The three ratios of
the new canonical pair are exactly

$$
\boxed{
H_{\rm new}=\frac{b}{n}=\frac{H z-1}{a},\qquad
B_{\rm new}=\frac{4b''}{n}=r z-a,\qquad
J_{\rm new}=\frac{4n''}{n}=a^2+(B-ar)z.
}
\tag{26}
$$

The first two basic signs in (25) are proved. For the *stronger* class
to survive, the remaining conditions are precisely

$$
\boxed{
\frac{d}{dz}\bigl[(B-ar)z\bigr]>0,\qquad
\frac{d^2}{dz^2}(Hz)>0,\qquad
\frac{d^2}{dz^2}(Bz)>0.
}
\tag{27}
$$

Here H and B are viewed as functions of the increasing coordinate
z(t). The last two are the desired convexities as functions of
$B_{\rm new}=rz-a$, which is affine in z with positive slope.
The linear term $-ar z$ does not affect the last second derivative.

No assertion is made that (27) follows from the input convexities.
The proved implication is stronger class to basic class after one
reduction. A preservation theorem would have to prove stronger class
to stronger class, which is exactly the additional content of (27).
For the original theta pair, $u=C$, $v=\kappa$, the variable B equals
$f-1$, so the original criterion (5) is exactly this stronger class,
up to a harmless translation of its coordinate.

## References and verification

All local formulas in this note are derived explicitly. The only
preceding dependencies are the exact transforms, canceled Green
normalization, and positive first pair recorded at
[PR #50](https://github.com/judegomila/mathexplorer/pull/50), commit
`146ce77aa8407e912ed54c73e30664d86936c253`, and its fixed PR #48
references. No external general covariance-comparison theorem is
required for the proof above, and no literature-novelty claim is made.
