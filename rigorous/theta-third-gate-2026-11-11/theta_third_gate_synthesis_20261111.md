# Third theta origin positivity and a repeatable compensation operator

Research continuation, 11 November 2026. This checkpoint closes the
third canonical theta origin-curvature condition for every positive
triple of anchors and both next-source origin limits for every positive
anchor pair. It also proves that the compensation kernel from
PR #53 has nonnegative ordered minors of every finite size, so its
control of sign changes survives arbitrary finite compositions.

These are two different statements. The auxiliary kernel theorem does
not establish that successive canonical theta reductions supply the
source inequalities needed to use it. The remaining next-step source
problem is reduced exactly to two mixed-derivative inequalities in one
anchor and one spatial variable.

The established real Pick order remains five. Third full preservation,
six-node positivity, and the all-order premise for RH remain open in
this checkpoint.

## 1. The actual theta system and the next requirements

Use

\[
\kappa(t)=e^{t/4}\sum_{n\ge1}
\{2(\pi n^2e^t)^2-3\pi n^2e^t\}e^{-\pi n^2e^t}
\quad(t\ge0),
\]

extended evenly, and

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}\,dt,
\quad L=F'/F,\quad C(t)=\frac14\int_t^\infty s\kappa(s)\,ds.
\]

At anchor `a>0`, the canonical reduction of `(u,v)` is `(b,n)`:

\[
n+ab=u,\qquad an+4b''=R(a)v,
\qquad R(z)=z\mathcal Lu(z)/\mathcal Lv(z).
\tag{1}
\]

For each pair write

\[
H=u/v,\quad B=4u''/v,\quad J=4v''/v,\quad P=16u^{(4)}/v.
\]

The full class comprises

\[
H'<0,\quad B'>0,\quad J'>0,\quad
\frac{d^2H}{dB^2}>0,\quad\frac{d^2J}{dB^2}>0.
\tag{2}
\]

PR #53 proves (2) through the second pair for every anchor choice. The
first comparison implication already makes the third pair positive
with `H_3'<0,B_3'>0`. Completing its full class requires the two
second-pair source signs

\[
W_{H,2}=W_3(B_2',J_2',-H_2')>0,
\quad W_{P,2}=W_3(B_2',J_2',P_2')>0,
\tag{3}
\]

and a positive third-origin slope `J_3''(0)>0`. The source signs imply
both comparison convexities; the positive origin slope then starts
`J_3'>0`, which convexity propagates along the spatial axis.

### Finite-step regularity and decay

The required comparison integrals remain well-defined at this step.
Here is the explicit carryover argument, with each anchor fixed. Put
`eta=pi exp(t)`. The initial pair satisfies
`C/kappa ~ t/(4 eta)`. Inductively suppose a positive pair has

\[
v(t)\sim c_v\kappa(t)t^m\eta^{-j},\qquad
u(t)/v(t)\sim c\,t^\varepsilon/\eta,
\quad c_v,c>0,\quad\varepsilon\in\{-1,1\}.
\]

The canceled, decaying solution of (1) is

\[
b(t)=\frac1{2a}\int_t^\infty
\sinh\!\left(\frac{a(s-t)}2\right)
\{rv(s)-au(s)\}\,ds,\qquad r=R(a)>0.
\]

Rescale by `delta=eta(s-t)`. The theta ratio tends to `exp(-delta)`,
and `sinh(a delta/(2 eta)) ~ a delta/(2 eta)`. The positive leading
form of `v`, not just an upper bound for its derivatives, gives

\[
b\sim\frac{rv}{4\eta^2},\qquad n=u-ab\sim u,
\qquad \frac bn\sim\frac{r}{4c\,t^\varepsilon\eta}.
\]

Thus the leading power of `t` in the ratio alternates, and the next
denominator again has a positive leading form of the displayed kind.
Dominated convergence follows from
`kappa(s)/kappa(t) <= C exp(C(s-t)-eta(exp(s-t)-1))`; the rescaled
integrands are bounded by an integrable constant times
`(1+delta)^M exp(-delta/2)` for large `t`.

Also,

\[
b'=-\frac14\int_t^\infty
\cosh\!\left(\frac{a(s-t)}2\right)(rv-au)\,ds,
\qquad 4b''=a^2b+rv-au.
\]

These identities carry finite-jet bounds of the form `kappa` times
finite powers of `t,eta` to the next pair. Dividing by its positive
leading denominator gives finite-power bounds for the required ratio
jets. The superexponential theta decay consequently controls every
fixed-anchor tilted integral used by the ordinary source-comparison
theorem. Applying this to the already established positive pairs
closes that regularity prerequisite at the third step. It does not
assert any unproved source sign at later canonical depths.

## 2. The third-origin condition is proved at all anchors

The new theorem is

\[
\boxed{J_3''(0)=
\left(4n_{a,c,d}''/n_{a,c,d}\right)''(0)>0
\quad\text{for every }a,c,d>0.}
\tag{4}
\]

Every coincidence of anchors is included. The proof does not cover a
three-dimensional box by sampling. It identifies a single matrix curve
whose second derivative controls all anchor triples.

Let `p(a)=L(a)`, choose the increasing coordinate `x=a p(a)`, and set

\[
N(x)=n_{a(x)}(0)/\kappa(0),\quad \lambda(x)=a(x)^2,
\quad \gamma=-\kappa''(0)/\kappa(0).
\]

The first-numerator ODE gives

\[
Y=\lambda N-1-x,\qquad Z=\lambda Y+4\gamma(x+3),
\qquad M(x)=\begin{pmatrix}N&Y\\Y&Z\end{pmatrix}.
\tag{5}
\]

The exact canonical algebra proves that the third numerator is, up to
a positive spatially constant factor, the second divided difference of
`n_a(t)` in `x=aL(a)`. Consequently

\[
J_3''(0)=\frac{\det(\Delta_2M)}{4(\Delta_2N)^2},
\quad
\Delta_2M=\int_{r,s\ge0,\,r+s\le1}
M_{xx}((1-r-s)x_a+r x_c+s x_d)\,dr\,ds.
\tag{6}
\]

The simplex has area `1/2`. Its positive measure preserves positive
definiteness, including the limit of three equal anchors. The entire
origin problem is therefore equivalent, with the already known
positive numerator, to

\[
M_{xx}(x)\succ0.
\tag{7}
\]

The certificate establishes (7) for every positive anchor:

| Region | Strict bound | Method |
| --- | --- | --- |
| `0<a<=100` | `N_xx>4.19e-7`, `det M_xx>1.09e-10` | 602 fresh positive theta moments, 384-bit balls, 4,096 closed interval cells |
| `a>=100` | `det M_xx > 295 p(a)^4 / {a^6[p(a)+ap'(a)]^6}` | Degree-ten spatial Taylor expansion, global twelfth-derivative remainder, exact rational coefficient bounds |

The tail proof also establishes `N_xx>0`. Its determinant margin is
positive on the full unbounded interval, not only at the endpoint.
Integrating (7) handles anchor triples straddling `100` automatically.

The algebra is reusable at later starting pairs. For a general pair,
replace the original constant `-1` by `B_0=4u''(0)/v(0)` and set
`x=aR(a)`. The corresponding scalar determinant is

\[
\det M_{xx}=
N_{xx}\{2\lambda_x^2N-(x-B_0)\lambda_{xx}-2\lambda_x\}
-(2\lambda_xN_x+\lambda_{xx}N)^2.
\tag{8}
\]

Thus a later three-anchor origin problem again becomes a one-variable
matrix-curvature test, provided the required lower positive kernels
exist. Positivity of (8) at every later base pair has not been proved.

The complete derivation and all tails are in
`theta_third_origin_20261111.md`.

## 3. The compensation kernel controls every finite number of sign changes

PR #53 uses a centered call transform to construct a positive Peano
kernel `Pi(y,s)` with nonnegative two-by-two ordered minors. The new
analytic theorem strengthens this to

\[
\boxed{\det[\Pi(y_i,s_j)]_{i,j=1}^m\ge0
\quad\text{for every finite }m,
\ y_1<\cdots<y_m,\ s_1<\cdots<s_m.}
\tag{9}
\]

Some minors can vanish; the theorem is total nonnegativity. Its proof
does not extrapolate a list of checked finite orders.

For the positive three-function source prefix, use the increasing
coordinate `x=f_2/f_1` and write `Y=f_3/f_1`, `w=Y''>0`. The truncated
remainder is

\[
R_s(x)=1_{x>s}\{Y(x)-Y(s)-Y'(s)(x-s)\}.
\]

It is only continuously differentiable across the knot. The proof
therefore smooths the knot with a Gaussian before taking higher
Wronskians. The exact annihilator identity is

\[
\left(D_x^3-\frac{w'}wD_x^2\right)R_{s,\varepsilon}(x)
=w(x)\phi_\varepsilon(x,s).
\tag{10}
\]

Ordered Gaussian columns have positive Wronskians of every order.
The proved call-transform theorem transfers the resulting positive
initial Wronskians, and the exact Sylvester identity has factor

\[
W_m(\Pi_{\varepsilon,s_1},\ldots,\Pi_{\varepsilon,s_m})
=G^{m-1}W_{m+3}(g_1,g_2,g_3,
H_{\varepsilon,s_1},\ldots,H_{\varepsilon,s_m}),
\tag{11}
\]

where `G=W_3(g_1,g_2,g_3)>0`. Removing the smoothing requires only three
output derivatives. The uniform bound by the original convex remainder
justifies the infinite endpoint for the actual theta measure.

If `S^-` counts strict sign changes, (9) implies

\[
S^-\left(\int\Pi(\cdot,s)\rho(s)\,ds\right)
\le S^-(\rho),
\tag{12}
\]

under the stated absolute-integrability assumptions. Continuous
Cauchy–Binet proves that every finite composition of these operators
retains (9) and (12).

This establishes a propagation tool that is uniform in determinant
order. The complete proof, regularity conditions, and exact identities
are in `theta_iterated_compensation_20261111.md`.

## 4. The missing source comparison has an exact two-variable form

The source equations can be simplified without another Green integral.
Keep the original `H=C/kappa`, `B=4C''/kappa`, and
`N(a,t)=n_a(t)/kappa(t)`. Define

\[
\boxed{f_H(a,t)=\frac{H''}{H'}N_t-N_{tt}>0,\qquad
f_P(a,t)=N_{tt}-\frac{B''}{B'}N_t>0.}
\tag{13}
\]

Their positivity is already supplied by the first-pair convexities.
For every positive pair of anchors, including coincident anchors, both
source signs (3) hold if and only if

\[
\boxed{f_H(f_H)_{at}-(f_H)_a(f_H)_t>0,\qquad
f_P(f_P)_{at}-(f_P)_a(f_P)_t>0
\quad(a,t>0).}
\tag{14}
\]

The proof uses monic second-order operators annihilating respectively
`(kappa,C)` and `(kappa,t kappa')`. Their Wronskians reduce to the
difference of `partial_t log(kappa f_j)` at two anchors. A positive
mixed derivative integrates to the desired distinct-anchor sign, and
the canceled coincident-anchor limit gives the converse.

This is an exact reduction from three variables `(a,c,t)` to two
variables `(a,t)`. It is not yet a proof of the signs in (14) throughout
the positive quadrant. The even variables `u=t^2,v=a^2` remove the
endpoint zeros without replacing a limit by a tiny numerical sample.
The full formulas and normalization are in
`theta_third_source_criterion_20261111.md`.

### Both source origin signs are now proved for all anchor pairs

The new compact and infinite-tail certificates establish

\[
\boxed{\lim_{t\downarrow0}\frac{W_{H,2}(a,c,t)}{t^6}>0,
\qquad \lim_{t\downarrow0}\frac{W_{P,2}(a,c,t)}{t^6}>0
\quad(a,c>0).}
\tag{14a}
\]

This includes coincident anchors and pairs on opposite sides of the
compact/tail split. In the even coordinates `u=t^2,v=a^2`, write
`f_j=u Phi_j(a,u)` and set

\[
F_j(v)=\Phi_j(a,0),\quad G_j(v)=\partial_u\Phi_j(a,0),
\quad \Omega_j=F_jG_j'-F_j'G_j.
\]

The proof certifies `F_H,F_P,Omega_H,Omega_P>0` on the connected
positive anchor axis. Therefore `(G_j/F_j)'=Omega_j/F_j^2>0`.
Integrating this derivative proves all distinct-anchor source limits;
the exact derivative limit proves coincident-anchor positivity.

For `a<=100`, 4,096 new interval cells use the same 602 freshly enclosed
moments as the third-origin certificate. An exact common `a^2` factor
is removed from both H-source functions before interval evaluation.
For `a>=100`, a degree-twelve Laplace expansion uses the newly proved
global bound

\[
\sup_{\mathbb R}|\kappa^{(14)}|/\kappa(0)<14,000,000,000.
\]

The bound includes 2,048 spatial interval cells and an analytic spatial
tail. The anchor determinant and its remainder are mapped to the compact
variables `T=100/a`, `0<=q<=1`, with
`p=1.4+(.01402a-1.4)q`. Positivity of three Bernstein coefficients on
64 closed `T`-intervals, at the two endpoints for `ap'`, supplies 768
interval coefficient checks covering the entire infinite anchor range.

The notes `theta_third_source_origin_20261111.md` and
`theta_third_source_origin_tail_20261111.md` give the exact coefficients,
normalizations, tails, and quantitative margins. This proves positive
starting signs for each fixed anchor pair. Their persistence at every
positive spatial point remains the condition (14).

## 5. Why the stronger source shortcut still fails

Let

\[
S_H=W_4(B',J',P',H'),\qquad S_Q=W_4(B',J',P',Q'),
\quad Q=16\kappa^{(4)}/\kappa.
\]

PR #53 certifies both normalized functions to be strictly negative
for `0<t<=1/16`. The new resolvent argument proves, uniformly on any
fixed spatial compact interval including its even origin limit,

\[
\frac{p(a)^3S_{H,1}(a,t)}{t^{10}}\longrightarrow
\frac{S_H(t)}{t^{10}},\qquad
\frac{p(a)^2S_{Q,1}(a,t)}{t^{10}}\longrightarrow
\frac{S_Q(t)}{t^{10}}.
\tag{15}
\]

Hence both higher first-pair sources are negative throughout
`0<t<=1/16` for every sufficiently large anchor. The threshold is
existential; no numerical threshold is certified. These are stronger
sufficient source hypotheses, not the desired sources in (3).

This proves that another reduction cannot simply restart a hierarchy
of pointwise-positive source determinants. Compensation, or a direct
proof of (14), remains necessary. See `theta_third_source_20261111.md`.

## 6. Why the all-order operator theorem does not finish RH

The next canonical source prefix introduces an extra transformed
column. It is not the same three-function prefix carried through the
preceding compensation operator. Its higher signs involve the ordered
two-density determinants of `(rho_Q,rho_H)` and `(rho_Q,rho_U)`.
Separate bounds on the sign changes of individual densities do not
fix the sign of those determinants.

A further rigorous obstruction rules out obtaining a positive input
by a constant linear combination of the original two signed densities.
At `t=1/16,1/8,1`, the two-source value vectors have a strictly positive
weighted sum equal to zero, and two of them are independent. Thus every
nonzero constant combination of `rho_H,rho_Q` takes both signs among
those three points. This is proved with full theta and integral error
bounds in `theta_signed_source_span_20261111.md`. It rules out a constant
change of basis within that two-dimensional source span; it does not
rule out signed compensation, additional columns, or the mixed-anchor
comparison (14).

Also, total nonnegativity for each fixed anchor does not compare two
different anchors. Multiplying a TN kernel by `exp(-ay)` preserves all
its minors for each fixed `a`, while the transformed positive output
has mixed logarithmic derivative `partial_a partial_y log=-1`.
This is a counterexample to that general inference, not a counterexample
for theta. Anchor-dependent factors must be retained in a proof of (14).

The current proof status is therefore:

| Statement | Status |
| --- | --- |
| Full comparison through the second theta pair | Fixed proved input, PR #53 |
| Strict five-node real Pick positivity | Fixed proved input, PR #53 |
| Third-origin curvature for all positive triples | Proved in this checkpoint |
| Both next-source origin limits for all positive pairs | Proved in this checkpoint |
| All finite ordered minors of the auxiliary Peano kernel | Proved in this checkpoint |
| Finite composition and sign-change control of that operator | Proved under the explicit integrability assumptions |
| Exact one-anchor criterion for the next source gate | Proved equivalence, including repeated anchors |
| Positive constant basis vector in the original two signed sources | Ruled out by three rigorous point witnesses |
| Two actual mixed source signs on the whole positive quadrant | Open |
| Third full preservation and strict six-node positivity | Open pending the source gate |
| Canonical preservation at arbitrary depth and RH | Open |

Once (14) is proved, the new origin theorem supplies the remaining
ingredient for third full preservation. The reduction count would
then be `R0 full -> R1 full -> R2 full -> R3 full -> R4 basic ->
R5 positive`, giving six nodes. This is a conditional consequence,
not a conclusion of the present checkpoint.

The route to RH still requires the corresponding inequalities, or an
adequate replacement, at every finite depth. The preceding closure
theorem then supplies positive-real continuation of `L` to the right
half-plane and excludes off-critical zeros. This checkpoint advances
the operator mechanism and closes the required actual-theta origin conditions without
assuming that all-order premise.
