# Theta ratio barriers: a large-anchor theorem and a cumulative alternative

Research continuation, 11 November 2026. The proposed normalized ratio inequality survives the recorded high-precision probes. More importantly, an exact resolvent identity proves both required signs for every sufficiently large reduction anchor, uniformly on each fixed compact interval of positive kernel coordinates. This is an analytic theorem with explicit remainder estimates, not an extrapolation from the probes. The threshold is not numerically evaluated here and can depend on the compact interval.

A second result replaces the pointwise ratio assumptions by a sufficient comparison of three normalized cumulative tails. That comparison is a new target, not an established inequality for actual theta. The all-anchor, all-coordinate, all-reduction theorem remains open. The arithmetic correlation inequality in PR #39 is not closed by these results.

## Definitions and established inputs

Use the conventions of [the positive first-pair proof in PR #48](https://github.com/[user]/mathexplorer/blob/499528b487e3249c5a35602f83343aaa53cec848/rigorous/theta-schur-kernels-2026-11-09/theta_schur_positive_kernels_20261109.md) and [the coupled-kernel note in PR #50](https://github.com/[user]/mathexplorer/blob/146ce77aa8407e912ed54c73e30664d86936c253/rigorous/theta-fourth-stage-2026-11-09/theta_second_kernel_structure_20261109.md):

$$
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}\,dt,
\qquad p=p(a)=F'(a)/F(a),\quad a>0.
$$

Here $a$ is a positive real Schur-reduction parameter and $t$ is the real coordinate of the theta kernel. Neither is the imaginary height of a zeta zero. Write

$$
J(t)=\frac14\int_{|t|}^{\infty}v\kappa(v)\,dv,
\qquad Q(t)=-\frac{\kappa'(t)}{t\kappa(t)}\quad(t>0).
$$

The first reduced kernels satisfy

$$
n_a+a b_a=J,\qquad a n_a+4b_a''=p\kappa,
\qquad n_a,b_a>0.
\tag{1}
$$

The actual theta input is $Q>0$, $Q'>0$ for $t>0$. In this normalization $\kappa(t)=\Phi(t/4)$; see [Csordas, Theorem 4.2(b)](https://arxiv.org/html/1309.0055v2). The kernel and all derivatives needed below are bounded and rapidly decaying. The same holds for the derivatives of $J$ used below. Integration by parts gives

$$
4J(t)<\frac{\kappa(t)}{Q(t)},\qquad
H(t):=-\left(\log\frac{J}{\kappa}\right)'
=\frac{t\kappa}{4J}-tQ>0.
\tag{2}
$$

Set $r_a=n_a/J\in(0,1)$. Since $n_a/b_a=a r_a/(1-r_a)$, the two proposed ratio signs are exactly

$$
(n_a/b_a)'>0,\quad (n_a/\kappa)'<0
\quad\Longleftrightarrow\quad
\boxed{0<\alpha_a(t):=(\log r_a)'<H(t).}
\tag{3}
$$

Define the upper slack $\beta_a=H-\alpha_a=-(\log(n_a/\kappa))'$. The fact that $H>0$ does not by itself locate $\alpha_a$ in this interval.

## An exact probability-kernel resolvent

Define an averaging operator on bounded functions by

$$
T_a f(t)=\frac a4\int_{\mathbb R}e^{-a|u|/2}f(t+u)\,du.
\tag{4}
$$

Its kernel has mass one, so $\|T_a f\|_\infty\le\|f\|_\infty$. It commutes with differentiation when the indicated derivatives are bounded. Twice integrating by parts, or using its elementary Green equation, gives

$$
T_a f=f+\frac4{a^2}T_a f''.
\tag{5}
$$

The Green operator for $4\partial_t^2-a^2$ is $-T_a/a^2$. Apply this to $(4\partial_t^2-a^2)b_a=p\kappa-aJ$, the exact equation in (1):

$$
b_a=\frac1aT_aJ-\frac p{a^2}T_a\kappa,
\qquad
\boxed{n_a=\frac paT_a\kappa-\frac4{a^2}T_aJ''.}
\tag{6}
$$

There is no unknown homogeneous term: the original Green representation has the required decay at both ends. No zero-free assertion in the critical strip is used.

Apply (5) again to get the exact expansion

$$
n_a=\frac pa\kappa-\frac4{a^2}J''+R_a,
\qquad
R_a=\frac{4p}{a^3}T_a\kappa''-\frac{16}{a^4}T_aJ^{(4)}.
\tag{7}
$$

For $j=0,1$ this supplies the explicit remainder estimate

$$
\boxed{\quad
\|R_a^{(j)}\|_\infty
\le M_j(a):=\frac{4p}{a^3}\|\kappa^{(j+2)}\|_\infty
+\frac{16}{a^4}\|J^{(j+4)}\|_\infty.
\quad}
\tag{8}
$$

These bounds involve global derivative norms of known kernels. No numerical values for those norms or for a final transition anchor are claimed here.

## Both ratio signs eventually hold on every fixed compact interval

**Theorem.** For each compact interval $K=[\varepsilon,T]\subset(0,\infty)$, there is $A_K<\infty$ such that, for every $a\ge A_K$ and every $t\in K$, both inequalities in (3) hold strictly.

**Proof.** On the positive real axis, the completed-zeta formula gives

$$
p(a)=\frac1{a+1/2}+\frac1{a-1/2}-\frac12\log\pi
+\frac12\psi(a/2+1/4)+\frac{\zeta'}{\zeta}(a+1/2)
=\frac12\log\frac{a}{2\pi}+O(a^{-1}).
\tag{9}
$$

This expression is used only as $a\to\infty$, where the Euler product is absolutely convergent. The digamma expansion is [DLMF 5.11.2](https://dlmf.nist.gov/5.11#E2). In particular $p\to\infty$ and $p/a\to0$.

Since $\kappa$ and $J$ have positive minima on $K$, (7)–(8) can be divided and differentiated there, uniformly. First,

$$
\left(\frac{n_a}{J}\right)'
=\frac pa\left(\frac\kappa J\right)'
-\frac4{a^2}\left(\frac{J''}J\right)'
+O_K(p/a^3+a^{-4}).
\tag{10}
$$

The leading derivative is strictly positive by (2). Its positive minimum on $K$ and $ap\to\infty$ prove $(n_a/J)'>0$ eventually, hence $(n_a/b_a)'>0$.

For the other ratio, the leading constant $p/a$ cancels after differentiation:

$$
\left(\frac{n_a}{\kappa}\right)'
=-\frac4{a^2}\left(\frac{J''}{\kappa}\right)'
+O_K(p/a^3+a^{-4}).
\tag{11}
$$

But $J'=-t\kappa/4$ gives $4J''/\kappa=t^2Q-1$. Therefore

$$
\left(\frac{n_a}{\kappa}\right)'
=-\frac{2tQ+t^2Q'}{a^2}+O_K(p/a^3+a^{-4}).
\tag{12}
$$

Its leading coefficient is strictly negative uniformly on $K$, and $p/a\to0$ makes the remainder lower order. This proves the other sign. All ingredients are unconditional. $\square$

The same proof identifies the shrinking upper slack:

$$
\boxed{\alpha_a(t)\longrightarrow H(t),\qquad
 a p(a)\,\beta_a(t)\longrightarrow 2tQ(t)+t^2Q'(t)>0,}
\tag{13}
$$

uniformly on $K$. Thus a uniform positive lower bound on the **unscaled** upper slack over all anchors would be false. This matters when searching for a preserved inequality numerically.

For a direct sufficient finite-anchor test, (8) gives

$$
\kappa^2(t^2Q)' >a^2[\kappa M_1+|\kappa'|M_0]
\tag{14}
$$

for the upper ratio sign. A sufficient test for the lower ratio sign is

$$
\frac pa(\kappa'J-\kappa J')>
\frac4{a^2}|J'''J-J''J'|+J M_1+|J'|M_0.
\tag{15}
$$

These follow by forming the two Wronskian numerators in (7). Their right-hand sides are error bounds, not asserted inequalities at every finite anchor. Enclosing the kernel derivative norms would make (14)–(15) executable bounds on a prescribed compact interval.

The theorem does not cover $t\downarrow0$, $t\to\infty$, or simultaneous $a,t\to\infty$ uniformly. It proves a property of the first reduced pair, not preservation by the next reduction. The generic Gaussian-tail counterexample in PR #48 has a different growth regime for $p(a)$; this proof specifically uses the sublinear real-axis response of actual xi.

## The small-anchor limit isolates another scalar inequality

Let $\ell=L'(0)=F''(0)/F(0)>0$, so $p(a)=\ell a+O(a^3)$. Taylor expansion of the exact canceled-tail formula gives, uniformly with one $t$ derivative on each fixed compact interval,

$$
n_a(t)=J(t)-a^2B_0(t)+O_K(a^4),
\tag{16}
$$

where

$$
B_0(t)=\frac\ell4\int_t^\infty(v-t)\kappa(v)\,dv
-\frac1{32}\int_t^\infty v(v-t)^2\kappa(v)\,dv.
\tag{17}
$$

Superexponential decay justifies differentiation and the Taylor remainder under these integrals. Consequently

$$
\boxed{\frac{\alpha_a(t)}{a^2}\longrightarrow
-\left(\frac{B_0(t)}{J(t)}\right)',\qquad
\beta_a(t)\longrightarrow H(t)>0.}
\tag{18}
$$

The subsequent [small-anchor proof](THETA_SMALL_ANCHOR.md) establishes $-(B_0/J)'>0$ for every $t>0$, using rigorous whole-interval enclosures and an analytic tail argument for the complete theta kernel. Thus both ratio signs hold for sufficiently small positive anchors on each fixed compact coordinate interval. The later [finite-anchor tail theorem](THETA_FINITE_ANCHOR_TAIL.md) further proves the existence of one small-anchor range valid on the entire positive coordinate domain; its endpoint is not numerically evaluated. A positive unscaled lower slack uniform as $a\downarrow0$ is impossible as well.

## An alternative using cumulative tails

There is a sufficient criterion that can be attacked through integrated inequalities without taking the two pointwise ratio signs as premises.

Fix the first anchor $a$ and a second anchor $c>0$. For $f\in\{b_a,n_a,\kappa\}$, define the normalized tilted upper tail

$$
P_f(x;c)=\frac{\int_x^\infty f(v)\cosh(cv/2)\,dv}
{\int_0^\infty f(v)\cosh(cv/2)\,dv},\qquad x\ge0.
\tag{19}
$$

**Proposition.** If

$$
\boxed{P_{b_a}(x;c)\le P_{n_a}(x;c)\le P_\kappa(x;c)
\qquad\text{for every }x\ge0,}
\tag{20}
$$

then both second canceled kernels at anchors $(a,c)$ are nonnegative. They are strictly positive at each $t\ge0$ if the corresponding tail difference is positive on a set of positive measure above that $t$.

**Proof.** Let $q=A_a(c)/(cB_a(c))>0$ in PR #50's transform notation. The two canceled sources are

$$
S_U=n_a-cq b_a,\qquad
S_V=qp\kappa-(aq+c)n_a.
$$

Both have zero cosh-weighted mass. For any such source write
$T_S(x)=\int_x^\infty\cosh(cv/2)S(v)dv$. The canceled Green formula and integration by parts give the exact identity

$$
\boxed{(G_c*S)(t)=\frac{\cosh(ct/2)}4
\int_t^\infty\frac{T_S(x)}{\cosh^2(cx/2)}\,dx.}
\tag{21}
$$

To verify the normalization, differentiate
$\sinh(c(x-t)/2)/\cosh(cx/2)$: the derivative is
$(c/2)\cosh(ct/2)/\cosh^2(cx/2)$. The boundary terms vanish by the zero total mass and rapid decay.

Set $I_f=\int_0^\infty f(v)\cosh(cv/2)dv$. The exact anchor identities imply $cq=I_n/I_b$ and $pq/(aq+c)=I_n/I_\kappa$. Hence

$$
T_{S_U}=I_n(P_n-P_b),\qquad
T_{S_V}=(aq+c)I_n(P_\kappa-P_n).
\tag{22}
$$

The proposed ordering makes both tails nonnegative, and (21) proves the assertion. $\square$

The original monotone-ratio conditions imply these tilted tail comparisons by weighted single crossing. Equation (20) is an alternative sufficient condition; it is not claimed necessary for positivity, and its validity for actual theta at every $a,c,x$ is not proved. No strict weakening after quantifying over all tilts is claimed. Even establishing (20) for the first pair would not supply a preserved all-order class.

## Numerical diagnostics and their limits

The accompanying `check_theta_ratio.py` checks the normalization identities symbolically and evaluates eight selected $(a,t)$ pairs at 40 and 70 decimal digits. It uses eight theta summands and quadrature cut off at 7. These computations are explicitly **not interval certificates**: precision agreement and small omitted terms are not substitutes for certified error bounds. All 16 evaluations have positive lower and upper slacks. The two precision runs agree at the 28 significant digits recorded for the margins; this is a reproducibility check, not a certified accuracy claim.

The numerical source is the actual theta-series formula

$$
\kappa(t)=\sum_{m\ge1}x_m(2x_m-3)e^{t/4-x_m},\qquad
x_m=\pi m^2e^t,\quad t\ge0,
$$

extended evenly. The logarithmic derivative $p$ is evaluated independently through completed zeta on the real axis. The evaluation uses the full-line Green convolution when $t<2p$, and the canceled-tail formula and its differentiated form when $t\ge2p$. The latter regime has a nonnegative canceled-tail numerator integrand. Both formulas are compared independently in the moderate-anchor cases.

All integrals used for the local ratios are normalized by $\kappa(t)$. An initial unnormalized quadrature produced false negative signs in the far tail because absolute quadrature tolerances exceeded the tiny kernel values. Normalization removed those sign reversals, but the full-line formula still failed the 40-versus-70-digit agreement check in the far tail because it subtracts much larger positive and negative source contributions. These unstable outputs are not counterexamples. The recorded calculation uses normalized integrals and the representation selected above, and requires agreement between precisions. The diagnostic output records the margins, scaled slack, and dual-formula comparisons. Its sample signs do not prove a continuum statement.

Run from this checkpoint's cluster directory:

```sh
OPENBLAS_NUM_THREADS=1 python3 check_theta_ratio.py
```

Dependencies: mpmath and SymPy. The analytic results (6)–(18) and the conditional implication (20)–(22) stand on their displayed proofs, not the numerical samples. No literature-novelty, RH, or all-height arithmetic-gain claim is made.

## Next precise targets

1. Compute an explicit endpoint for the global small-anchor range now obtained from [uniform finite-anchor tail bands](THETA_FINITE_ANCHOR_TAIL.md), then address the remaining parameter domain.
2. Obtain certified derivative-norm bounds for (14)–(15) on selected compact intervals; then study the joint escape regime rather than treating compact-interval thresholds as uniform.
3. Test the cumulative ordering (20) and derive it from actual theta identities if possible. This may offer an integrated approach when pointwise derivative bounds are too restrictive.
4. Only after these first-pair questions are resolved, identify a property preserved by every alternating reduction. A direct transfer to PR #39's correlation gain would require an additional proved argument.
