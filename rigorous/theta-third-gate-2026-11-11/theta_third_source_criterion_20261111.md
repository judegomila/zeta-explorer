# The next source gate is a one-anchor mixed-derivative inequality

Research continuation, 11 November 2026. This note gives an exact reduction
of the source gate for third full theta preservation. It does not assert
the remaining mixed-derivative inequalities without their own proof.

The fixed input is PR #53, commit
`5d64d45acf37f4957a8f65c036b502e1b49292d0`: the first and second canonical
theta pairs satisfy the full comparison class for every positive anchor.
In particular, the first pair has both strict comparison convexities.

## 1. Definitions and the source identities

Let the original pair be `(C,kappa)`, and write

\[
H=C/\kappa,\quad B=4C''/\kappa=-1-t\kappa'/\kappa,
\quad N(a,t)=n_a(t)/\kappa(t),\quad p=L(a).
\]

For two anchors `a,c`, set

\[
q=L(c),\quad D=cq-ap,\quad
r=\frac{cp-aq}{cq-ap},\qquad
n_2=\frac{p(n_a-n_c)}{D}.
\tag{1}
\]

All formulas at `a=c` use their analytic canceled limits. The preceding
positive-kernel construction gives `r>0,n_2>0`. Also `D>0` when `c>a`,
because `(aL(a))'>0` by the positive theta variance identity.

The two source signs required for the third pair are

\[
W_{H,2}=W_3(B_2',J_2',-H_2'),\qquad
W_{P,2}=W_3(B_2',J_2',P_2').
\]

Canonical column elimination gives

\[
\boxed{W_{H,2}=-\frac{rp^2}{acD n_2^4}
 W_4(n_a,n_c,\kappa,C),}
\tag{2}
\]

\[
\boxed{W_{P,2}=-\frac{r^2p^2}{D n_2^4}
 W_4(n_a,n_c,\kappa,t\kappa').}
\tag{3}
\]

Here every Wronskian uses ordinary spatial derivatives in increasing
row order, starting at zero. These identities are proved and checked in
the companion source-algebra component. They display the two-anchor
dependence without a second Green integration.

## 2. A two-column elimination identity

For fixed functions `f,g` with `G=W_2(f,g)` nonzero, define the monic
second-order differential operator

\[
\mathscr L_{f,g}h=\frac{W_3(f,g,h)}{G}.
\]

Elementary row elimination, using the rows `1,D,\mathscr L,D\mathscr L`,
proves the Sylvester identity

\[
\boxed{W_4(f,g,h,k)=G\,
 W_2(\mathscr Lh,\mathscr Lk).}
\tag{4}
\]

The coefficient of the highest derivative is one, so this row
transformation has determinant one. The first two columns vanish in
the last two rows; expansion gives exactly (4), without an additional
power of `G`.

Use the two operators

\[
A_H(a,t)=-\mathscr L_{\kappa,C}n_a(t),\qquad
A_P(a,t)=\mathscr L_{\kappa,t\kappa'}n_a(t).
\tag{5}
\]

They are strictly positive for `a,t>0`. To see the signs directly, the
first canonical pair satisfies

\[
B_1=p/N-a,\qquad
H_1=(H/N-1)/a,\qquad
J_1=a^2+(B-ap)/N.
\]

Consequently

\[
W_2(B_1',H_1')=\frac{p}{aN^3}W_2(H',N')>0,
\]

\[
W_2(B_1',J_1')=\frac{p}{N^3}W_2(B',N')>0.
\tag{6}
\]

These are exactly the two already proved first-pair convexities.
Meanwhile

\[
G_H=W_2(\kappa,C)=\kappa^2H'<0,
\quad
G_P=W_2(\kappa,t\kappa')=-\kappa^2B'<0.
\tag{7}
\]

Dividing the third columns by `kappa` gives the explicit positive
functions

\[
\boxed{\frac{A_H}{\kappa}=
 \frac{H''}{H'}N_t-N_{tt}=:f_H>0,}
\]

\[
\boxed{\frac{A_P}{\kappa}=
 N_{tt}-\frac{B''}{B'}N_t=:f_P>0.}
\tag{8}
\]

The first inequality in (6) gives the sign of `f_H` because `H'<0`;
the second gives the sign of `f_P` because `B'>0`.

## 3. The exact one-anchor criterion, including coincident anchors

Put

\[
\beta_j(a,t)=\partial_t\log A_j(a,t),\quad j\in\{H,P\}.
\]

For `c>a`, identity (4) becomes

\[
W_4(n_a,n_c,\kappa,C)
=G_H A_H(a,t)A_H(c,t)[\beta_H(c,t)-\beta_H(a,t)],
\]

\[
W_4(n_a,n_c,\kappa,t\kappa')
=G_P A_P(a,t)A_P(c,t)[\beta_P(c,t)-\beta_P(a,t)].
\tag{9}
\]

Moving the first two columns to the last two positions makes four
swaps and has positive sign. The two minus signs in the definition of
`A_H` cancel in its two-column Wronskian.

All factors in (2), (3), and (9) have now been assigned a sign. Thus,
for each fixed positive `t`, the source signs at every pair of distinct
anchors are equivalent to strict increase of `beta_H,beta_P` with the
anchor. A strictly increasing differentiable function can have a zero
derivative at an isolated point, so distinct-anchor positivity alone
must not be called equivalent to a strictly positive derivative.

Including the coincident-anchor source signs removes that distinction.
Let `d'(a)=(aL(a))'>0` and let `r_*,n_{2,*}` be the canceled limits.
Then

\[
W_{H,2}(a,a,t)=
\frac{r_*p^2(-G_H) A_H(a,t)^2}{a^2d'(a)n_{2,*}^4}
\,\partial_a\beta_H(a,t),
\]

\[
W_{P,2}(a,a,t)=
\frac{r_*^2p^2(-G_P) A_P(a,t)^2}{d'(a)n_{2,*}^4}
\,\partial_a\beta_P(a,t).
\tag{10}
\]

The prefactors are strictly positive. Integrating a positive derivative
between any distinct pair supplies (9). Therefore the following is an
exact equivalence, rather than only a sufficient comparison test:

> Both second-pair source signs are strictly positive at all positive
> anchor pairs, including coincident anchors, and all positive spatial
> points if and only if
>
> \[
> \boxed{\partial_a\partial_t\log A_H(a,t)>0,\qquad
> \partial_a\partial_t\log A_P(a,t)>0\quad(a,t>0).}
> \tag{11}

Since `kappa` does not depend on `a`, the same criterion uses `f_H,f_P`.
For a function `f>0`, its cleared test is

\[
\boxed{f f_{at}-f_a f_t>0.}
\tag{12}
\]

Equivalently, the kernels `A_H,A_P`, with rows ordered by the anchor and
columns by the spatial point, have positive ordered two-by-two minors,
with the additional strict local limits in (11). This formulation is
often called strict log-supermodularity; (11) defines precisely the
property needed here.

## 4. Removing the spatial even zero

For computation near the origin set `u=t^2` and take derivatives in `u`.
From (8),

\[
f_H=4u\left(\frac{H_{uu}}{H_u}N_u-N_{uu}\right)=u\phi_H,
\]

\[
f_P=4u\left(N_{uu}-\frac{B_{uu}}{B_u}N_u\right)=u\phi_P.
\tag{13}
\]

Where the original even jets have `H_u\ne0,B_u\ne0`, these give
analytic origin extensions of `phi_H,phi_P`. A positive origin limit
must still be proved when used in a certificate; positivity for `t>0`
does not by itself assert strict positivity of that limit.

An exact chain-rule computation gives

\[
f f_{at}-f_a f_t
=2t^5(\phi\phi_{au}-\phi_a\phi_u).
\tag{14}
\]

If additionally `v=a^2`, the right side is

\[
4at^5(\phi\phi_{vu}-\phi_v\phi_u).
\tag{15}
\]

These deflations expose the finite analytic determinant at both even
endpoints without substituting a tiny floating-point anchor or spatial
point for a limiting proof.

## 5. What this changes in the third-preservation problem

The source problem initially involves three positive variables
`(a,c,t)`. The exact criterion (11) reduces it to `(a,t)`, with no loss
at coincident anchors. The companion third-origin note reduces its
three-anchor condition to a one-variable matrix-curvature condition.

If both source inequalities (11) and that origin condition hold, the
existing comparison theorem proves that the third canonical theta
pair is full. The established reduction count would then give strict
six-node real Pick positivity. This implication is conditional until
every gate has been proved on its entire unbounded domain.

In particular, a proof that a fixed Peano kernel preserves all orders
of total nonnegativity does not alone prove (11). Its measure and
transformed source functions vary with the anchor. The mixed derivative
is exactly the missing comparison between those different anchor
problems.
