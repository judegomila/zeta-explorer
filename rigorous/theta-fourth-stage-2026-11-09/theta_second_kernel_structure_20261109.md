# Second canceled kernels: exact ratios, flux bounds, and a closure obstruction

Research continuation, 9 November 2026. This note studies the second
canceled pair of the exact xi Schur construction. It proves a positive
Stein-kernel representation of the first numerator, isolates two
sufficient pointwise ratio conditions for positivity of the second pair,
and proves that the natural second denominator cannot restart the
original logarithmic-derivative construction by a constant or rational
normalization. The two ratio conditions have not been proved for the
actual theta kernel. The separate
[actual-xi proof](theta_fourth_stage_proof_20261109.md) establishes the
fourth Pick stage by spectral and large-axis estimates. It does not
settle these stronger pointwise kernel conditions or their preservation
at arbitrary order.

## 1. Normalization and established first pair

Use

$$
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}\,dt,
\qquad L=F'/F,
\qquad \mathcal L f(z)=\int_{\mathbb R}f(t)e^{zt/2}\,dt.
$$

Fix $a>0$, put $p=L(a)>0$, and write

$$
A(z)=\frac{zF'(z)-apF(z)}{z^2-a^2}=\mathcal L n(z),
\qquad
B(z)=\frac{pzF(z)-aF'(z)}{z(z^2-a^2)}=\mathcal L b(z).
\tag{1}
$$

The preceding checkpoint proves $n,b>0$, both even, and

$$
n+ab=C,\qquad an+4b''=p\kappa,\qquad
C(t)=\frac14\int_{|t|}^{\infty}v\kappa(v)\,dv.
\tag{2}
$$

Also $b'<0$ on $t>0$. Define

$$
Q(t)=-\frac{\kappa'(t)}{t\kappa(t)}>0,
\qquad d(t)=-2b'(t)>0\quad(t>0).
\tag{3}
$$

The established theta inequality $Q'>0$ gives

$$
4C(t)<\frac{\kappa(t)}{Q(t)}\quad(t>0),\qquad
n'(t)=\frac a2d(t)-\frac14t\kappa(t).
\tag{4}
$$

All these kernels and required derivatives have sufficiently rapid decay
for the transforms and integrations below. Their proofs are in the
positive-kernel note of PR #48.

## 2. A positive Stein representation of the first numerator

There is an additional proof of $n>0$ that does not require $Q'>0$.
It applies to any strictly positive even smooth density kernel with the
rapid decay and exponential moments required by the formulas.

Define the tilted probability density

$$
\rho_a(t)=\frac{\kappa(t)e^{at/2}}{F(a)},\qquad
\int t\rho_a(t)\,dt=2p.
\tag{5}
$$

Its one-dimensional Stein kernel is the explicit function

$$
\tau_a(t)=\frac{e^{-at/2}}{\kappa(t)}
\int_t^\infty(v-2p)\kappa(v)e^{av/2}\,dv.
\tag{6}
$$

The numerator in (6) is strictly positive. For $t\ge2p$ this follows
directly from the integral; for $t<2p$, use the zero total centered
moment to write it as the negative integral from $-\infty$ to t.
Thus $\tau_a(t)>0$ for every t. Its designation as a Stein kernel is
verified directly by

$$
(\tau_a\rho_a)'=-(t-2p)\rho_a,
\qquad
\int(t-2p)f(t)\rho_a(t)dt
=\int\tau_a(t)f'(t)\rho_a(t)dt
\tag{7}
$$

for compactly supported smooth f. Evenness gives
$\tau_{-a}(t)=\tau_a(-t)$.

Integration by parts in the first Green formula gives, with $\lambda=a/2$,

$$
n(t)=\frac14\int_t^\infty v\kappa(v)\cosh[\lambda(v-t)]dv
-\frac p2\int_t^\infty\kappa(v)\sinh[\lambda(v-t)]dv.
\tag{8}
$$

Expanding the hyperbolic functions and comparing with (6) yields

$$
\boxed{\frac{n(t)}{\kappa(t)}
=\frac{\tau_a(t)+\tau_a(-t)}8.}
\tag{9}
$$

Consequently the numerator positivity $n>0$ follows from centered
tail positivity alone. The theta squared-variable concavity is still
used for the denominator b and for (4); it has not become unnecessary
for the full first pair.

Formula (9) also identifies one next-step target precisely: decrease of
$n/\kappa$ is decrease of the symmetrized tilted Stein kernel.
Positivity of a Stein kernel does not by itself prove that decrease.

The zero-tilt Stein kernel is $\tau_0=4C/\kappa$. Hence the exact
first-pair identity also gives

$$
\boxed{b(t)=\frac{\kappa(t)}{8a}
\left[2\tau_0(t)-\tau_a(t)-\tau_a(-t)\right].}
\tag{9a}
$$

The already proved $b>0$ therefore says that the symmetrized tilted
Stein kernel is pointwise smaller than the zero-tilt kernel. This is
a proved comparison under the original theta concavity hypotheses;
it does not imply the needed spatial monotonicity of the difference.

## 3. The second pair and its two sources

Fix a second anchor $c>0$, and put

$$
q=R_a(c)=\frac{A(c)}{cB(c)}>0.
$$

The exact second reduction is

$$
R_{a,c}(z)=z\frac{U(z)}{V(z)},
\quad
U(z)=\frac{A(z)-cqB(z)}{z^2-c^2},
\quad
V(z)=\frac{qz^2B(z)-cA(z)}{z^2-c^2}.
\tag{10}
$$

Both displayed singularities are removable. Their time-domain sources
before Green inversion are

$$
S_U=n-cq b,
\qquad
S_V=4q b''-cn=qp\kappa-(aq+c)n.
\tag{11}
$$

The second expression in (11) uses the exact first-pair equation (2).
Both sources are even and their transforms vanish at $\pm c$.

Let

$$
G_c(t)=-\frac{e^{-c|t|/2}}{4c},\qquad
u=G_c*S_U,\qquad v=G_c*S_V.
\tag{12}
$$

The cancellations remove both exponential tails, so u and v are smooth
even rapidly decaying kernels, with $U=\mathcal Lu$, $V=\mathcal Lv$.
Their signs are not asserted merely from (12).

The pair satisfies the exact identities

$$
\boxed{v+cu=qb,\qquad 4u''+cv=n.}
\tag{13}
$$

These follow from $V+cU=qB$ and $z^2U+cV=A$, using
$\mathcal L(u'')=z^2\mathcal Lu/4$.

## 4. A sufficient pointwise criterion for two positive second kernels

### Proposition

For the fixed first anchor a, suppose

$$
\boxed{(n/b)'(t)>0,\qquad(n/\kappa)'(t)<0\quad(t>0).}
\tag{14}
$$

Then, for every second anchor $c>0$, the kernels u and v in (12)
are strictly positive. In particular,
$0<u<qb/c$ and $0<v<qb$.

### Proof

The first threshold is a positive weighted average:

$$
cq=\frac{A(c)}{B(c)}
=\frac{\int_0^\infty(n/b)(t)b(t)\cosh(ct/2)dt}
{\int_0^\infty b(t)\cosh(ct/2)dt}.
\tag{15}
$$

Therefore the first source $b(n/b-cq)$ has precisely one strict
negative-to-positive crossing on the positive half-line.

Using $pF(c)=aA(c)+c^2B(c)$ and $A(c)=cqB(c)$, the second
threshold is

$$
\frac{pq}{aq+c}=\frac{A(c)}{F(c)}
=\frac{\int_0^\infty(n/\kappa)(t)\kappa(t)\cosh(ct/2)dt}
{\int_0^\infty\kappa(t)\cosh(ct/2)dt}.
\tag{16}
$$

Since $n/\kappa$ decreases, the source
$(aq+c)\kappa[pq/(aq+c)-n/\kappa]$ also has one strict
negative-to-positive crossing. Each source has zero cosh-weighted mass.

For either source S, the canceled Green formula is

$$
(G_c*S)(t)=\frac1{2c}\int_t^\infty
\sinh[\tfrac c2(w-t)]S(w)dw.
\tag{17}
$$

Divide the hyperbolic sine by $\cosh(cw/2)$, extend the weight by
zero on $w\le t$, and subtract its value at the crossing point.
The weight increases, so the integrand after subtraction is nonnegative
and strictly positive on part of the positive tail. Hence (17) is
strictly positive. The upper bounds follow from (13).

The proposition is a sufficient criterion. It is not claimed necessary
for second-kernel positivity, and (14) has not been established for the
actual theta kernel. The existing three-node theorem proves positive
real-axis values of the second response by a different argument; that
does not identify the signs of its inverse transforms pointwise.

## 5. The two ratio conditions are one exact flux band

The two tests in (14) can be put in a common normalization. Using
$n+ab=C$, $C'=-t\kappa/4$, and $b'=-d/2$,

$$
n'b-nb'=C'b-Cb'=-\frac14t\kappa b+\frac12Cd.
\tag{18}
$$

Also,

$$
n'\kappa-n\kappa'
=\frac a2d\kappa-\frac14t\kappa^2+tQn\kappa.
\tag{19}
$$

Thus (14) is exactly equivalent, for $t>0$, to

$$
\boxed{
\frac{b(t)}{2C(t)}
<\frac{d(t)}{t\kappa(t)}
<\frac{1-4Q(t)n(t)/\kappa(t)}{2a}.
}
\tag{20}
$$

The interval is nonempty: its width is

$$
\boxed{
\frac{n(t)}{2a}\left[\frac1{C(t)}-\frac{4Q(t)}{\kappa(t)}\right]>0,
}
\tag{21}
$$

by (4). Both endpoints are positive, since $0<n<C<\kappa/(4Q)$.
This is a concrete pointwise target for the exact first pair. The
positive width of the interval does not put the actual flux inside it;
that is the missing estimate in this sufficient-kernel route.

## 6. The natural second denominator does not restart the original class

Even if both second kernels were proved positive, one cannot simply
replace $\kappa$ by v and repeat the original logarithmic-derivative
covariance argument. There is an unconditional analytic obstruction.

### Proposition

For fixed $a,c>0$, with the actual xi p and q above, there is no
constant $\alpha$ for which

$$
R_{a,c}(z)=\alpha\frac{V'(z)}{V(z)}.
\tag{22}
$$

The conclusion still holds if V is multiplied by any nonzero rational
function. It also holds with U in place of V.

### Proof

Substitution of (1) into (10) gives exactly

$$
V(z)=F(z)\frac{pqz^2-(aq+c)zL(z)+acp}
{(z^2-a^2)(z^2-c^2)},
\tag{23}
$$

$$
R_{a,c}(z)=
\frac{(z^2+acq)L(z)-p(a+cq)z}
{pqz^2-(aq+c)zL(z)+acp}.
\tag{24}
$$

The exact gamma/Euler-product expression used in the preceding checkpoint
gives, along the positive real axis,

$$
L(x)=\tfrac12\log x+O(1),\qquad L'(x)=O(1/x).
\tag{25}
$$

For example, use $\psi(y)=\log y+O(1/y)$,
$\psi'(y)=O(1/y)$, $y=x/2+5/4$, and the exponentially small prime
series. These estimates require no zero-location assumption.

Expanding (23) and (24) yields

$$
\frac{V'(x)}{V(x)}=L(x)-\frac2x+O\left(\frac{L(x)}{x^2}\right),
\tag{26}
$$

$$
R_{a,c}(x)=\frac{L(x)}{pq}
+\frac{aq+c}{p^2q^2}\frac{L(x)^2}{x}
-\frac{a+cq}{qx}
+O\left(\frac{L(x)^3}{x^2}\right).
\tag{27}
$$

Leading terms in (22) would force $\alpha=1/(pq)$. But then

$$
\boxed{
\lim_{x\to\infty}\frac{x}{L(x)^2}
\left[R_{a,c}(x)-\frac1{pq}\frac{V'(x)}{V(x)}\right]
=\frac{aq+c}{p^2q^2}>0.
}
\tag{28}
$$

This rules out equality. A nonzero rational multiplier r has
$r'/r=O(1/x)$, whose contribution disappears in (28), so it cannot
repair the obstruction.

Likewise,

$$
U(x)=\frac{F(x)L(x)}{x^3}
\left[1+O\left(\frac1{xL(x)}\right)\right],
$$

up to terms of order $x^{-2}$ in the bracket, and
$U'/U=L+L'/L-3/x+O(1/(x^2L)+x^{-3})$.
The leading matching constant remains $1/(pq)$, and the same positive
limit in (28) results. This proves the U version as well.

The statement concerns the natural entire numerator or denominator and
constant/rational normalizations. It does not rule out representing the
response by some different function or a genuinely two-component system.
Such a representation would need its own positivity and global domain
proof.

## 7. An exact alternating recurrence for every later pair

The second step belongs to an exact two-component recurrence that can
be written at arbitrary order. Suppose U and V are transforms of even
smooth rapidly decaying kernels u and v. Assume u and v are positive
at the current stage, so both transforms are positive on the positive
real axis. Fix an anchor $a>0$, and let $r=R(a)>0$.

### Type I: a response of the form $R=zU/V$

The next reduced response is of Type II:

$$
R_{\mathrm{next}}(z)=\frac{U_{\mathrm{next}}(z)}{zV_{\mathrm{next}}(z)},
$$

$$
\boxed{
U_{\mathrm{next}}=\frac{z^2U-arV}{z^2-a^2},\qquad
V_{\mathrm{next}}=\frac{rV-aU}{z^2-a^2}.
}
\tag{29}
$$

The two time-domain sources are

$$
S_1=4u''-arv,\qquad S_2=rv-au.
\tag{30}
$$

The exact relations between consecutive pairs are

$$
u=u_{\mathrm{next}}+a v_{\mathrm{next}},\qquad
rv=a u_{\mathrm{next}}+4v_{\mathrm{next}}''.
\tag{30a}
$$

They have zero cosh-weighted mass at the anchor because
$r=aU(a)/V(a)$. A sufficient condition for both next kernels to be
strictly positive is

$$
\boxed{(u/v)'<0,\qquad(u''/v)'>0\quad(t>0).}
\tag{31}
$$

Indeed, $r/a=U(a)/V(a)$ is the v-cosh-weighted average of $u/v$,
and $ar/4$ is the same weighted average of $u''/v$. Thus S_2
and S_1 respectively have one strict negative-to-positive crossing.
The Green lemma applies to both.

### Type II: a response of the form $R=U/(zV)$

The next reduced response is of Type I:

$$
R_{\mathrm{next}}(z)=z\frac{U_{\mathrm{next}}(z)}{V_{\mathrm{next}}(z)},
$$

$$
\boxed{
U_{\mathrm{next}}=\frac{U-arV}{z^2-a^2},\qquad
V_{\mathrm{next}}=\frac{rz^2V-aU}{z^2-a^2}.
}
\tag{32}
$$

The sources are

$$
S_1=u-arv,\qquad S_2=4rv''-au.
\tag{33}
$$

Here the consecutive-pair relations are

$$
rv=v_{\mathrm{next}}+a u_{\mathrm{next}},\qquad
u=4u_{\mathrm{next}}''+a v_{\mathrm{next}}.
\tag{33a}
$$

Here $ar=U(a)/V(a)$, so both source transforms vanish at the anchor.
The sufficient conditions are now

$$
\boxed{(u/v)'>0,\qquad(v''/u)'>0\quad(t>0).}
\tag{34}
$$

The respective weighted averages are $ar$ for $u/v$ under the
v-cosh weight, and $a/(4r)$ for $v''/u$ under the u-cosh weight.
Both sources therefore again have one strict negative-to-positive
crossing, giving two positive next kernels by Green inversion.

In either case the source zeros at $+a$ and $-a$ follow from
evenness. They make the displayed quotients entire and preserve rapid
decay of the inverse transforms after cancellation. Positivity of the
new kernels follows only under the indicated ratio conditions.

### The initial theta pair belongs to Type I

For the original response take $u=C$, $v=\kappa$, so that
$L=z\mathcal LC/\mathcal L\kappa$. Its two Type I conditions follow
directly from the established theta property $Q'>0$:

$$
(C/\kappa)'<0,\qquad
\frac{C''}{\kappa}=\frac{t^2Q(t)-1}{4},\qquad
\left(\frac{C''}{\kappa}\right)'>0\quad(t>0).
\tag{35}
$$

Thus (29) recovers the proved first pair $(n,b)$.
For that next Type II pair, the second condition in (34) is

$$
\left(\frac{b''}{n}\right)'
=\frac p4\left(\frac{\kappa}{n}\right)'>0,
$$

which is exactly $(n/\kappa)'<0$. Accordingly the general Type II
test reduces to the two concrete ratios in (14).

### The missing invariant is explicit

Equations (29)--(34) give a sufficient alternating induction if each
positive pair also satisfies the ratio conditions appropriate to its
type. No preservation theorem for those conditions has been proved.
In particular, positivity of the output kernels does not supply their
new derivative-ratio signs.

The auxiliary kernel $e^{-t^2}(2+\cosh t)$ in PR #48 satisfies the
initial Type I conditions but has an analytically certified negative
three-node Pick determinant. Therefore those initial conditions cannot
force all subsequent Type II conditions: otherwise the two positive
second kernels would give positive third pivots at every real node,
contradicting that determinant. This is an exact failure of automatic
closure for the general initial class, not a failure of the actual
theta response.

## 8. What this establishes and what it does not

The numerator has an exact positive symmetrized Stein representation,
valid under weaker hypotheses than the earlier single-crossing proof.
The next Green sources have been reduced to two explicit ratios, or
equivalently one pointwise flux band. If those inequalities are proved
for actual theta, both second inverse-transform kernels are positive.
Even then, their positivity alone is not the fourth Pick inequality or
an all-order invariant.

The last proposition closes a specific shortcut: after two cancellations,
the natural denominator is not a replacement density whose logarithmic
derivative is the reduced response, even after a constant rescaling and
rational multiplier. A successful continuation must retain the pair or
derive a different structure with the required exact response.

The alternating recurrence identifies what such a two-component
structure must preserve: the sign of u/v alternates, while the relevant
second-derivative ratio must increase at every stage. Establishing this
for actual theta, or finding another sufficient invariant, remains open.

## References and validation scope

- PR #48, fixed commit 499528b487e3249c5a35602f83343aaa53cec848,
  `rigorous/theta-schur-kernels-2026-11-09/`:
  `theta_schur_positive_kernels_20261109.md` supplies (1)--(4), the
  Green normalization, and the source-cancellation lemma;
  `theta_third_pick_large_x_20261109.md` supplies the exact gamma and
  Euler-product expression underlying (25).
- The Stein designation in this note is verified by the displayed
  integration-by-parts identity (7); no external monotonicity theorem
  for Stein kernels is invoked.
- The new source simplification, transform identities, flux expressions,
  and rational expansion in (27) were checked algebraically. Positivity
  of the two ratios in (14) is explicitly left unproved. Exploratory
  point evaluations are not used as proof or as part of the claims.
