# Positive kernels after the first exact Schur cancellation

Research note, 9 November 2026. This proves a cancellation-preserving
positive-kernel representation for the first Schur reduction of the exact
xi logarithmic derivative. It resolves the signed-kernel obstruction at
this first step. It does **not** prove that the reduced response is
positive-real on a complex half-plane, nor that later Schur reductions
preserve the required properties. No RH or novelty claim is made.

## 1. Input and result

Use the normalization

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du,
\qquad L(z)=F'(z)/F(z).
\tag{1.1}
\]

The actual theta kernel is even, positive, smooth, and superexponentially
decaying, as are the derivative combinations used below. Its known
squared-variable logarithmic concavity gives

\[
q(u)=-\frac{\kappa'(u)}{u\kappa(u)}>0,
\qquad q'(u)>0\quad(u>0).
\tag{1.2}
\]

The input is Csordas, *Fourier transforms of positive definite kernels and
the Riemann xi-Function*, arXiv:1309.0055v2, Theorem 4.2(b), with
`kappa(u)=Phi(u/4)`; see <https://arxiv.org/html/1309.0055v2>.
The earlier [interpolation note](https://github.com/judegomila/mathexplorer/blob/7e6d01d9dae527a5785ed31d770cd4b8acd38e17/rigorous/theta-interpolation-2026-11-08/theta_positive_interpolation_20261108.md) derives

\[
L(x)>0,\qquad 0<xL'(x)<L(x)\quad(x>0),
\qquad (L(x)/x)'<0.
\tag{1.3}
\]

Fix \(a>0\), and write \(p=L(a)>0\). Define the entire even functions

\[
A_a(z)=\frac{zF'(z)-apF(z)}{z^2-a^2},
\qquad
B_a(z)=\frac{pzF(z)-aF'(z)}{z(z^2-a^2)}.
\tag{1.4}
\]

All singularities displayed in (1.4) are removable. The main result is:

> There are strictly positive, even, smooth, superexponentially decaying
> kernels \(n_a,b_a\) such that
> \[
> A_a=\mathcal L n_a,\qquad B_a=\mathcal L b_a,
> \qquad \mathcal Lg(z)=\int_{\mathbb R}g(u)e^{zu/2}\,du.
> \]
> Moreover \(b_a'(u)<0\) for \(u>0\), and
> \[
> \boxed{n_a(u)+a b_a(u)=C(u)},\qquad
> C(u)=\frac14\int_{|u|}^{\infty}v\kappa(v)\,dv.
> \tag{1.5}
> \]

Thus the exact first reduced response has the representation

\[
\boxed{
R_a(z)=\frac{zL(z)-ap}{zp-aL(z)}
=\frac{A_a(z)}{zB_a(z)}.
}
\tag{1.6}
\]

The factor \(z^2-a^2\) has been canceled before positivity is assessed;
the remaining pole at the boundary point \(z=0\) is explicit.

## 2. A Green-kernel cancellation lemma

For the transform convention in (1.1), integration by parts gives

\[
\mathcal L(g')=-\frac z2\mathcal Lg,
\qquad
\mathcal L(g'')=\frac{z^2}{4}\mathcal Lg.
\tag{2.1}
\]

The fundamental solution of \(4\partial_u^2-a^2\) is

\[
G_a(u)=-\frac{e^{-a|u|/2}}{4a},
\qquad
(4\partial_u^2-a^2)G_a=\delta_0.
\tag{2.2}
\]

Its bilateral Laplace transform is \(1/(z^2-a^2)\) in
\(|\Re z|<a\). Let \(S\) be a superexponentially decaying source with
\(\mathcal LS(a)=\mathcal LS(-a)=0\), and put \(g=G_a*S\). The source
zeros cancel both exponential tails of the convolution. In particular,
with \(\lambda=a/2\),

\[
\boxed{
g(u)=\frac1{2a}\int_u^\infty
\sinh[\lambda(v-u)]S(v)\,dv.
}
\tag{2.3}
\]

For example, substitute
\(\int_{-\infty}^u e^{\lambda v}S(v)dv
=-\int_u^\infty e^{\lambda v}S(v)dv\)
into the two pieces of the convolution. The difference of exponentials
is \(2\sinh[\lambda(v-u)]\), giving the factor \(1/(2a)\).
The analogous formula from the left endpoint follows from the other
source zero. These formulas prove superexponential decay at both ends;
they also justify entire continuation of

\[
\mathcal Lg(z)=\frac{\mathcal LS(z)}{z^2-a^2}.
\tag{2.4}
\]

### Even single-crossing sources

Suppose \(S\) is even and has one strict sign change at \(r>0\):
negative on \((0,r)\) and positive on \((r,\infty)\). Its source zero is

\[
\int_0^\infty\cosh(\lambda v)S(v)\,dv=0.
\tag{2.5}
\]

For each fixed \(u\ge0\), set

\[
H_u(v)=
\begin{cases}
0,&0\le v\le u,\\
\sinh[\lambda(v-u)]/\cosh(\lambda v),&v>u.
\end{cases}
\tag{2.6}
\]

This function is nondecreasing. For \(v>u\) it is
\(\cosh(\lambda u)\tanh(\lambda v)-\sinh(\lambda u)\), with strictly
positive derivative. Subtracting \(H_u(r)\) using (2.5) yields

\[
g(u)=\frac1{2a}\int_0^\infty
\cosh(\lambda v)S(v)[H_u(v)-H_u(r)]\,dv>0.
\tag{2.7}
\]

The integrand is pointwise nonnegative; it is positive on a subset of
the positive tail of nonzero measure. This proves strict positivity,
including \(u=0\), without treating a signed integrand as positive.

### Odd single-crossing sources

Suppose instead that \(S\) is odd and changes sign once from negative
to positive on the positive half-line. Then
\(\int_0^\infty\sinh(\lambda v)S(v)dv=0\). For \(u>0\), use

\[
J_u(v)=
\begin{cases}
0,&0\le v\le u,\\
\sinh[\lambda(v-u)]/\sinh(\lambda v),&v>u.
\end{cases}
\tag{2.8}
\]

For \(v>u\), this equals
\(\cosh(\lambda u)-\sinh(\lambda u)\coth(\lambda v)\), and is strictly
increasing. The same crossing-point subtraction proves \(g(u)>0\) for
\(u>0\); \(g\) is odd and \(g(0)=0\).

## 3. The positive numerator kernel

The numerator in \(A_a\) is the transform of

\[
N_a(u)=-u\kappa'(u)-(1+ap)\kappa(u)
=\kappa(u)[u^2q(u)-(1+ap)].
\tag{3.1}
\]

Indeed, \(zF'\) is the transform of \(-(u\kappa)'\). The quantity
\(u^2q(u)\) strictly increases from zero to infinity, so \(N_a\) has
exactly one negative-to-positive sign change on the positive half-line.
Because \(F'(a)=pF(a)\), its transform vanishes at \(a\), and by parity
also at \(-a\).

Apply the even-source lemma:

\[
\boxed{
n_a(u)=\frac1{2a}\int_u^\infty
\sinh[\lambda(v-u)]N_a(v)\,dv>0\quad(u\ge0),
}
\tag{3.2}
\]

extended evenly. Its transform is precisely \(A_a\).

## 4. A direct positive even denominator kernel

The positive integrated kernel \(C\) in (1.5) satisfies

\[
C'(u)=-\frac14u\kappa(u),\qquad
\mathcal LC(z)=F'(z)/z.
\tag{4.1}
\]

The formula for the derivative holds on the full line; the transform
identity follows by integration by parts, with the removable value at
zero understood. Write \(h(u)=C(u)/\kappa(u)\) for \(u\ge0\). Since
\(q\) is strictly increasing,

\[
4C(u)=\int_u^\infty\frac{-\kappa'(v)}{q(v)}\,dv
<\frac{\kappa(u)}{q(u)}\quad(u>0).
\tag{4.2}
\]

Consequently

\[
\boxed{
h'(u)=u[q(u)h(u)-1/4]<0\quad(u>0).
}
\tag{4.3}
\]

Furthermore,

\[
\frac pa=\frac{\mathcal LC(a)}{F(a)}
=\frac{\int_0^\infty h(v)\kappa(v)\cosh(\lambda v)\,dv}
{\int_0^\infty\kappa(v)\cosh(\lambda v)\,dv}.
\tag{4.4}
\]

This strictly positive weighted average lies strictly between the endpoint
values of the continuous, strictly decreasing function \(h\). Therefore
the even source

\[
S_a(u)=p\kappa(u)-aC(u)
=a\kappa(u)[p/a-h(u)]
\tag{4.5}
\]

has exactly one negative-to-positive sign change. Its transform vanishes
at \(\pm a\). The even-source lemma now gives

\[
\boxed{
b_a(u)=\frac1{2a}\int_u^\infty
\sinh[\lambda(v-u)][p\kappa(v)-aC(v)]\,dv>0
\quad(u\ge0),
}
\tag{4.6}
\]

extended evenly. From (2.4),

\[
\mathcal Lb_a(z)
=\frac{pF(z)-aF'(z)/z}{z^2-a^2}=B_a(z).
\tag{4.7}
\]

This proof handles the denominator directly as an even positive kernel.
It uses the cancellation at \(z=0\) before applying the Green operator.

## 5. The odd denominator and strict decrease of b

For comparison, before division by \(z\), the denominator source is

\[
D_a(u)=-2p\kappa'(u)-\frac a2u\kappa(u)
=2p\,u\kappa(u)\left[q(u)-\frac a{4p}\right].
\tag{5.1}
\]

The covariance calculation in the earlier note gives

\[
\frac a{4p}=\mathbb E_{\nu_{a/2}}q,
\qquad
d\nu_{a/2}(u)\ \propto\ u\kappa(u)\sinh(au/2)\,du.
\tag{5.2}
\]

Thus \(D_a\) has exactly one negative-to-positive sign change on
\((0,\infty)\). Its transform, \(pzF-aF'\), vanishes at \(\pm a\).
The odd-source lemma proves

\[
d_a(u)=\frac1{2a}\int_u^\infty
\sinh[\lambda(v-u)]D_a(v)\,dv>0\quad(u>0),
\tag{5.3}
\]

with odd extension and \(d_a(0)=0\). Since
\(\mathcal Ld_a=zB_a\), transform uniqueness gives

\[
\boxed{
d_a=-2b_a',\qquad
b_a(u)=\frac12\int_{|u|}^{\infty}d_a(v)\,dv.
}
\tag{5.4}
\]

In particular, \(b_a\) is strictly decreasing on the positive half-line.

## 6. The exact relation between the two new kernels

The definitions (1.4) give the two algebraic identities

\[
\boxed{F'(z)=z[A_a(z)+aB_a(z)]},
\qquad
\boxed{pF(z)=aA_a(z)+z^2B_a(z)}.
\tag{6.1}
\]

Transform uniqueness and (4.1) imply

\[
\boxed{n_a+a b_a=C},
\qquad
\boxed{a n_a+4b_a''=p\kappa}.
\tag{6.2}
\]

Hence

\[
0<n_a(u)<C(u),\qquad 0<b_a(u)<C(u)/a,
\tag{6.3}
\]

and

\[
\boxed{
n_a'(u)=\frac a2d_a(u)-\frac14u\kappa(u).
}
\tag{6.4}
\]

The last formula does not establish a sign for \(n_a'\): it is a
difference of two positive quantities for \(u>0\). In particular, no
decrease or squared-variable logarithmic concavity of \(n_a\) is asserted.

Equivalently, the denominator satisfies the exact forced equation

\[
\boxed{(4\partial_u^2-a^2)b_a=p\kappa-aC}.
\tag{6.5}
\]

This positive decomposition of the fixed integrated kernel \(C\) is
additional structure available for any attempt at a two-kernel induction.

## 7. Removable values and the boundary pole

Direct differentiation, or the positive integral representations, gives

\[
A_a(a)=\frac{F(a)[p+aL'(a)]}{2a}>0,
\qquad
B_a(a)=\frac{F(a)[p-aL'(a)]}{2a^2}>0.
\tag{7.1}
\]

At zero,

\[
A_a(0)=\frac{pF(0)}a>0,
\qquad
B_a(0)=\frac{F(0)[aL'(0)-p]}{a^2}>0.
\tag{7.2}
\]

The strict inequality in the second formula follows because \(L(x)/x\)
strictly decreases and has limiting value \(L'(0)\) as \(x\downarrow0\).
Therefore

\[
R_a(a)=\frac{p+aL'(a)}{p-aL'(a)}>0,
\qquad
\operatorname*{Res}_{z=0}R_a(z)
=\frac{ap}{aL'(0)-p}>0.
\tag{7.3}
\]

The real-axis positivity of every first-step pivot therefore survives the
common-factor cancellation exactly.

## 8. What remains to prove

Positive even kernels alone do not imply positive-realness of their
transform ratio on \(\Re z>0\), and they do not exclude complex zeros of
\(B_a\). Also, \(R_a=A_a/(zB_a)\) is not expressed as a logarithmic
derivative of a single kernel. The original covariance argument for
\(F'/F\) therefore cannot simply be repeated with \(b_a\).

An induction would need a property of the pair \((n_a,b_a)\) strong
enough both to prove the next relevant Pick/Schur positivity and to survive
the next cancellation. Possible candidates include a proved monotone
ratio or a stronger total-positivity property; neither is established in
this note. Even squared-variable logarithmic concavity of \(b_a\) would
need its own proof and would not by itself identify the reduced ratio as
another logarithmic derivative.

The completed result is consequently precise: the first signed numerator
and denominator admit an exact positive-kernel desingularization, with a
positive decomposition \(n_a+a b_a=C\) and a strictly decreasing positive
denominator kernel. The all-orders closure needed for RH remains open.

The [companion curvature proof](theta_three_node_curvature_20261109.md)
now establishes all three-node real Pick matrices by a separate argument.
It does not establish an invariant class of these two kernels.
