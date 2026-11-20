# Actual theta: preservation for large anchors on every bounded spatial interval

Research continuation, 10 November 2026. This note proves a boundary-region
preservation theorem for the first reduced actual-theta pair. The
companion [global proof](theta_preservation_global_20261110.md) proves
the three signs for all anchors and spatial points by a separate
argument. The boundary theorem here is analytic and uses the
original-kernel inequalities already established in PR #51. It supplies
useful asymptotic structure, not preservation at arbitrary depth.

## 1. Definitions and result

Let kappa be the actual even theta kernel, and use

$$
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}dt,
\quad p=p(a)=F'(a)/F(a),\quad a>0.
$$

Put

$$
V=-\log\kappa,\qquad B=tV'-1,\qquad
W=4\kappa''/\kappa,\qquad
h=C/\kappa,\qquad C(t)=\frac14\int_t^\infty s\kappa(s)ds.
$$

Extend these functions evenly. In particular C has a smooth even extension
because C'=-t*kappa/4. Write n=n_a for the positive first canceled numerator,
and set N=n/kappa. Its source equation is

$$
(4\partial_t^2-a^2)n=(B-ap)\kappa.
\tag{1}
$$

The three remaining preservation tests from PR #51 are

$$
J_a'=\left(4n''/n\right)'>0,
\qquad
\mathcal D_h=h'N''-h''N'>0,
\qquad
\mathcal D_B=B'N''-B''N'>0.
\tag{2}
$$

**Theorem.** For every T>0 there exists A_T>0 such that all three signs
in (2) hold for every a>=A_T and every 0<t<=T. Together with the globally
proved basic signs in PR #51, the first canonical reduced pair (b_a,n_a)
therefore satisfies the proposed stronger class on that spatial interval.

The threshold A_T is an existence bound in this note, not a computed
numerical value. Its possible growth with T is not controlled. Thus this
theorem does not cover the joint regime a,t tending to infinity together.

## 2. An exact smoothing representation

Define the normalized Laplace density

$$
P_a(s)=\frac a4e^{-a|s|/2},\qquad \int_{\mathbb R}P_a(s)ds=1.
$$

The decaying Green function of 4D^2-a^2 is -P_a/a^2. Therefore (1) gives
the exact identity

$$
\boxed{
n=\frac pa(P_a*\kappa)-\frac1{a^2}(P_a*g),
\qquad g=B\kappa=-(t\kappa)'.
}
\tag{3}
$$

This identity is compatible with the canceled transforms. Its kernel
form uses the ordinary real convolution and holds before taking any
asymptotic limit. The prior cancellation theorem ensures that this
decaying Green solution is precisely the first canceled numerator.

The approximate-identity expansion has a particularly simple exact
remainder. For every smooth function q with the derivatives below bounded,

$$
P_a*q=q+\frac4{a^2}P_a*q'',
$$

and hence

$$
\boxed{
P_a*q=q+\frac4{a^2}q''+\frac{16}{a^4}P_a*q^{(4)}.
}
\tag{4}
$$

This follows from (1-4D^2/a^2)P_a=delta, or by integration by parts.
Convolution by P_a has sup norm at most one. Thus, after j derivatives,
the last term in (4) has absolute value at most
16 a^(-4) ||q^(j+4)||_infinity. All needed derivatives of kappa and g
are bounded because of the actual theta kernel's rapid decay.

Substituting (4) into (3), and dividing by kappa on [-T,T], gives

$$
\boxed{
N=\frac pa-\frac B{a^2}+\frac{pW}{a^3}-\frac S{a^4}+E_a,
\qquad S=\frac{4g''}{\kappa}.
}
\tag{5}
$$

For any fixed integer j>=0,

$$
\|E_a\|_{C^j([-T,T])}
\le K_{T,j}\left(\frac p{a^5}+\frac1{a^6}\right).
\tag{6}
$$

Here the constant depends only on bounds for derivatives of kappa, g,
and 1/kappa on the indicated sets. In particular this is a C^4
expansion, not merely a pointwise estimate. Its error E_a is even.

## 3. The only anchor growth facts needed

No gamma asymptotic or zero information is needed. Positivity and evenness
of kappa imply p(a)>0 for a>0. Also

$$
p'(a)=\operatorname{Var}_a(t/2)>0,
$$

under the probability density proportional to kappa(t)e^(at/2). Thus
p(a)>=p(1)>0 for a>=1, and ap(a) tends to infinity.

The super-Gaussian decay gives, for every epsilon>0, a constant C_epsilon
with kappa(t)<=C_epsilon exp(-t^2/epsilon). Completing the square yields

$$
F(a)\le C_\epsilon\sqrt{\pi\epsilon}
\exp(\epsilon a^2/16).
$$

Convexity of log F and F(a)>=F(0)>0 imply

$$
0\le\frac{p(a)}a
\le\frac{\log F(2a)-\log F(a)}{a^2}
\le\frac\epsilon4+O_\epsilon(a^{-2}).
$$

Since epsilon is arbitrary,

$$
\boxed{p(a)/a\longrightarrow0,\qquad ap(a)\longrightarrow\infty.}
\tag{7}
$$

These two elementary limits suffice for all signs below.

## 4. Leading preservation determinants

For any even smooth q define the linear differential expression

$$
\mathcal C_q[e]=q'e''-q''e'.
$$

The already proved original-kernel quantities are

$$
D_h=h''B'-h'B''>0,\qquad D_W=W''B'-W'B''>0.
$$

Applying the linear expressions to (5) gives the exact expansions

$$
\boxed{
\mathcal D_h=
\frac{D_h}{a^2}
+\frac p{a^3}\mathcal C_h[W]
-\frac1{a^4}\mathcal C_h[S]
+\mathcal C_h[E_a],
}
\tag{8}
$$

$$
\boxed{
\mathcal D_B=
\frac p{a^3}D_W
-\frac1{a^4}\mathcal C_B[S]
+\mathcal C_B[E_a].
}
\tag{9}
$$

The leading terms have exactly the signs proved for the original theta
kernel. The cancellation of the -B/a^2 term in (9) is essential: the
first nonzero term is p D_W/a^3.

Equations (6)--(7) already prove both determinant signs for large a on
each compact subinterval of (0,infinity). The following elementary
parity estimate also makes the conclusion uniform down to t=0.

## 5. Uniform treatment of the symmetry point

For even C^4 functions q,e on [-T,T],

$$
\boxed{
|q'e''-q''e'|(t)
\le\frac{t^3}{3}
\left(\|q''\|_\infty\|e^{(4)}\|_\infty
+\|q^{(4)}\|_\infty\|e''\|_\infty\right),
\quad 0\le t\le T.
}
\tag{10}
$$

Indeed the derivative of the expression is q'e'''-q'''e'. Evenness
gives |q'|<=t||q''|| and |q'''|<=t||q^(4)||, with the same estimates
for e. Integrate the resulting t^2 bound from zero to t.

The normalized original functions

$$
\frac{D_h(t)}{t^3},\qquad\frac{D_W(t)}{t^3},\qquad\frac{W'(t)}t
$$

extend continuously to zero. PR #51 supplies strictly positive
origin limits, as well as positivity for all t>0. Its origin certificate
gives conservative bounds

$$
D_h/t^3>8(0.05959),\quad
D_W/t^3>8(337.61),\quad W'/t>2(69.60)
\quad(0<t\le1/8).
$$

Consequently each normalized original function has a positive minimum
on [0,T]. Applying (10) to (8)--(9) yields the uniform limits

$$
\boxed{
\frac{a^2\mathcal D_h(t)}{t^3}
\longrightarrow\frac{D_h(t)}{t^3},
\qquad
\frac{a^3\mathcal D_B(t)}{p(a)t^3}
\longrightarrow\frac{D_W(t)}{t^3}
}
\tag{11}
$$

on [0,T], interpreting quotients at zero by their continuous values.
The errors in the first limit are O_T(p/a+a^(-2)); those in the
second are O_T(1/(ap)+a^(-2)). These errors vanish by (7).
Strict positivity of both reduced determinants follows uniformly for
0<t<=T once a is sufficiently large.

## 6. The remaining derivative sign

Normalize the numerator by its scalar leading factor:

$$
\widetilde n_a=\frac a{p(a)}n_a.
$$

From (3)--(6), on every fixed [-T,T],

$$
\|\widetilde n_a-\kappa\|_{C^4}
=O_T\left(\frac1{ap(a)}+\frac1{a^2}\right).
\tag{12}
$$

The map q to 4q''/q is continuous from C^4 to C^2 on functions
bounded away from zero. Since kappa has a positive minimum on [-T,T],
(12) implies

$$
\|4n_a''/n_a-W\|_{C^2}
=O_T\left(\frac1{ap(a)}+\frac1{a^2}\right).
$$

The difference is even, so its first derivative vanishes at zero.
The mean value theorem therefore gives the uniform convergence

$$
\boxed{
\frac{J_a'(t)}t\longrightarrow\frac{W'(t)}t
\quad\text{on }[0,T].
}
\tag{13}
$$

The positive minimum of W'/t proves J_a'>0 for all 0<t<=T and
large enough a. This completes the theorem.

## 7. Relation to the canonical class and exact scope

The globally proved N'<0 makes z=1/N increasing. For the canonical
pair (b_a,n_a),

$$
H_{\rm new}=(hz-1)/a,\qquad
B_{\rm new}=pz-a,\qquad
J_{\rm new}=a^2+(B-ap)z=4n_a''/n_a.
$$

The basic signs H_new'<0 and B_new'>0 hold globally by PR #51. For
any smooth q,

$$
\frac{d^2(qz)}{dz^2}
=\frac{N^3}{(-N')^3}\mathcal C_q[N].
$$

The multiplier is positive. Also B_new is affine in z with positive
slope p. Thus (2) gives precisely the three extra signs of the stronger
class on the stated region.

The positive limits in (11)--(13) provide boundary control. By themselves
they do not cover finite anchors or the simultaneous large-a/large-t
regime, and do not supply a single threshold A for the entire spatial
axis. The companion global proof covers those regions for the first
reduction. Preservation after arbitrary numbers of reductions remains
open.

## Dependencies and exact checks

The original global theta signs and their origin margins are from
[PR #51](https://github.com/judegomila/mathexplorer/pull/51), fixed commit
`afdac28948ab084e80214c31ef72c9520d943760`, under
`rigorous/theta-ratio-convexity-2026-11-10/`. The actual theta decay,
first canceled Green normalization, and original positive-pair facts
are the fixed earlier inputs recorded there.

`theta_preservation_actual_20261110.py` checks the exact normalization,
determinant expansions, symmetry-point coefficients, and coordinate
conversions. The existence estimates and compactness arguments above
are analytic parts of the proof and are not replaced by symbolic checks.
