# Exact boundary energy for the theta convolution

## Status

This note derives a bounded-operator energy identity for the actual theta convolution and applies it to a regularization of the actual box-pulse solution. It proves a theta-specific two-feature energy inequality. It does **not** establish the full positive-semidefinite kernel inequality, one-sided propagation for the box pulse, or RH.

The new exact remainder is a concrete integral kernel. No inverse of the convolution by `kappa`, no unproved weighted core assertion, and no assumed analytic continuation of the boundary solution is used.

## 1. Definitions and conventions

Let

\[
\theta(t)=\sum_{n\in\mathbb Z}e^{-\pi n^2t},\qquad
H(u)=e^{u/4}\theta(e^u),\qquad
\kappa(u)=(\partial_u^2-1/16)H(u).
\]

The modular identity makes `H` and `kappa` even. The kernel `kappa` is positive, smooth, and decays faster than every exponential. With

\[
F(z)=\xi(1/2+z),
\]

the normalization used here is

\[
F(z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du.
\]

Use the Fourier convention

\[
\widehat f(t)=\int_{\mathbb R}f(u)e^{itu/2}\,du.
\]

Fix `alpha > 0` (the active construction uses `alpha = 1`) and define

\[
h_\pm(u)=(1\pm\alpha u/2)\kappa(u),\quad
A f=h_+*f,\quad A^*f=h_-*f.
\]

The adjoint identity follows from the evenness of `kappa`. Both operators are bounded on ordinary `L^2(R)`. Their Fourier symbols are

\[
D(z)=F(z)+\alpha F'(z),\qquad
N(z)=F(z)-\alpha F'(z).
\]

On the boundary, `N(it) = conjugate(D(it))`, so

\[
\widehat{C_0f}(t)=\frac{N(it)}{D(it)}\widehat f(t)
\]

defines a unitary operator; isolated zeros of `D(it)` do not affect the almost-everywhere multiplier. Also `A C_0 = A^*`.

Throughout,

\[
Q_c f=\mathbf1_{(c,\infty)}f
\]

is the **right-tail** projection. This orientation matters.

## 2. Exact cutoff-energy identity

Let `a` be any element of `L^2(R)`, and put

\[
f=Aa,\qquad g=A^*a=C_0f.
\]

Then

\[
\boxed{\quad
\|Q_cg\|_2^2-\|Q_cf\|_2^2
=-\langle a,\mathcal H_c a\rangle.
\quad}
\tag{2.1}
\]

Here `mathcal H_c` is the bounded self-adjoint operator

\[
\mathcal H_c=A^*Q_cA-AQ_cA^*
\tag{2.2}
\]

with real symmetric integral kernel

\[
\boxed{\quad
H_c(u,v)=\alpha\int_c^\infty
(2r-u-v)\kappa(r-u)\kappa(r-v)\,dr.
\quad}
\tag{2.3}
\]

To check the factor and sign directly, expand the two squared outputs. The difference of the kernel factors is

\[
\begin{aligned}
&h_-(r-u)h_-(r-v)-h_+(r-u)h_+(r-v)\\
&\hspace{2cm}=-\alpha(2r-u-v)\kappa(r-u)\kappa(r-v).
\end{aligned}
\]

This proves (2.1) first for compactly supported test functions and then for all `a` by bounded-operator continuity. In particular, no application of an unbounded inverse is hidden in (2.1).

Set

\[
m=(u+v)/2,\qquad d=(u-v)/2.
\]

Because `kappa` is even, `kappa(t-d) kappa(t+d)` is even in `t`. The negative part of the integral in (2.3) cancels its reflected positive part exactly. Thus

\[
\boxed{\quad
H_c(u,v)=2\alpha\int_{|c-m|}^\infty
t\kappa(t-d)\kappa(t+d)\,dt>0.
\quad}
\tag{2.4}
\]

This is precisely what reflection/modularity accomplishes in the cutoff calculation: it produces a strictly positive **entrywise** interface kernel. It does not, by itself, make the integral operator positive semidefinite.

Two immediate unconditional consequences are:

1. Global norm conservation, since the same expansion integrated over the whole real line has an odd integrand and vanishes.
2. Right-tail energy contraction whenever the preimage `a` is a constant complex phase times a nonnegative real function. In that case the double-integral quadratic form in (2.1) is nonnegative.

For reference, the Gaussian model `kappa(u) = exp(-lambda u^2)`, `lambda > 0`, gives the exact Gram factorization

\[
H_c(u,v)=\frac{\alpha}{2\lambda}
e^{-\lambda(u-c)^2}e^{-\lambda(v-c)^2}.
\tag{2.5}
\]

Its positivity is rank one. A comparable factorization has not been obtained for the theta kernel.

## 3. A theta-specific theorem: every two-feature cutoff form is positive

The known stronger concavity property of the theta kernel is

\[
t\longmapsto \log\kappa(\sqrt t)
\quad\text{is strictly concave for }t>0.
\tag{3.1}
\]

For the normalization in Csordas, `kappa(u) = Phi(u/4)`, so Theorem 4.2(b) of the source below gives (3.1) directly.

**Claim.** For every real `c,u,v`,

\[
H_c(u,v)^2\le H_c(u,u)H_c(v,v),
\tag{3.2}
\]

with strict inequality if `u != v`. Hence every matrix of values at one or two distinct points is positive definite.

**Proof.** Translation reduces the claim to `c = 0`. In (2.4), substitute `s = t^2-m^2` to get

\[
H_0(u,v)=\alpha\int_0^\infty
\kappa(\sqrt{s+m^2}-d)\kappa(\sqrt{s+m^2}+d)\,ds.
\tag{3.3}
\]

Write `V(t) = -log kappa(sqrt(t))`, a strictly convex function. The two nonnegative numbers

\[
(\sqrt{s+m^2}-d)^2,\qquad(\sqrt{s+m^2}+d)^2
\]

have the same sum as `s+u^2, s+v^2`, and have at least as large an absolute difference. Convexity therefore gives

\[
H_0(u,v)\le G(u,v):=
\alpha\int_0^\infty
\kappa(\sqrt{s+u^2})\kappa(\sqrt{s+v^2})\,ds.
\tag{3.4}
\]

The comparison is strict off the diagonal. On the diagonal `G(u,u) = H_0(u,u)`. Applying Cauchy-Schwarz to the explicit Gram kernel `G` proves (3.2).

Consequently, for any two centers `u_1,u_2` and any complex coefficients `b_1,b_2`, the actual feature pair

\[
f=\sum_{j=1}^2 b_jh_+(\,\cdot-u_j),\qquad
g=\sum_{j=1}^2 b_jh_-(\,\cdot-u_j)=C_0f
\]

satisfies

\[
\|Q_cg\|_2\le\|Q_cf\|_2
\qquad\text{for every real }c.
\tag{3.5}
\]

This is a proved theta-specific local-energy result, with no zero assumption.

**Why this does not extend automatically to all features.** Equation (3.4) is entrywise comparison. `G-H_0` has zero diagonal and strictly positive off-diagonal entries. Every two-point restriction of this difference has eigenvalues of opposite sign. Thus `G-H_0` is not a positive operator, and the Gram factorization of `G` cannot be transferred to `H_0` by an operator-order argument. Positivity for arbitrary matrices of three or more points remains unresolved here.

There is nevertheless an exact positive term plus a fully explicit remainder. Define

\[
(B_ca)(s)=\sqrt\alpha\int_{\mathbb R}
\kappa(\sqrt{s+(u-c)^2})a(u)\,du,
\qquad s>0,
\]

and let `Delta_c` have kernel

\[
\Delta_c(u,v)=\alpha\int_0^\infty
\kappa(\sqrt{s+(u-c)^2})\kappa(\sqrt{s+(v-c)^2})\,ds-H_c(u,v).
\]

Then `B_c` is Hilbert-Schmidt, since its squared kernel integral is

\[
4\alpha\int_0^\infty t^2\kappa(t)^2\,dt<\infty,
\]

and the actual energy law becomes

\[
\boxed{\quad
\|Q_cg\|_2^2-\|Q_cf\|_2^2
=-\|B_ca\|_{L^2(0,\infty)}^2
+\langle a,\Delta_ca\rangle.
\quad}
\tag{3.6}
\]

The remainder kernel vanishes on the diagonal and is strictly positive off the diagonal, but its quadratic form is indefinite. Thus (3.6) is a rigorous energy identity with a positive Gram term and an explicit, uncontrolled interference term. The missing estimate is `Delta_c <= B_c^* B_c` as a quadratic-form inequality, or a suitable restricted version on the pulse preimages below. No sign is discarded.

## 4. The actual box pulse, with a controlled regularization

Let

\[
f_0=\mathbf1_{[0,1]},\qquad g_0=C_0f_0.
\]

The literal equation is

\[
A g_0=A^*f_0,
\quad\text{or}\quad
h_+*g_0=h_-*\mathbf1_{[0,1]}.
\tag{4.1}
\]

Let `T=A^*A=AA^*`. For `epsilon > 0`, define

\[
\boxed{\quad
a_\epsilon=(T+\epsilon I)^{-1}A^*f_0,
\quad f_\epsilon=Aa_\epsilon,
\quad g_\epsilon=A^*a_\epsilon.
\quad}
\tag{4.2}
\]

The first expression is the unique minimizer of

\[
\|Aa-f_0\|_2^2+\epsilon\|a\|_2^2.
\]

Everything in (4.2) is a bounded operation for fixed `epsilon`. Fourier transformation gives

\[
\widehat f_\epsilon(t)
=\frac{|D(it)|^2}{|D(it)|^2+\epsilon}\widehat f_0(t),
\]

\[
\widehat g_\epsilon(t)
=\frac{\overline{D(it)}^2}{|D(it)|^2+\epsilon}\widehat f_0(t)
=S(it)\widehat f_\epsilon(t).
\tag{4.3}
\]

Since the isolated real zeros of `D(it)` form a null set, dominated convergence proves

\[
f_\epsilon\to f_0,\qquad g_\epsilon\to g_0
\quad\text{in ordinary }L^2.
\tag{4.4}
\]

Also `||f_epsilon||_2, ||g_epsilon||_2 <= ||f_0||_2 = 1`. These statements do not claim convergence in an exponentially weighted space.

Apply (2.1) at `c=1`. Since `Q_1 f_0 = 0`, ordinary `L^2` convergence yields the exact identity

\[
\boxed{\quad
\|\mathbf1_{(1,\infty)}g_0\|_2^2
=-\lim_{\epsilon\downarrow0}
\langle a_\epsilon,\mathcal H_1a_\epsilon\rangle.
\quad}
\tag{4.5}
\]

The limit in (4.5) exists. It is the explicit remaining sign problem for the actual pulse. It has not been shown that the quadratic forms on the right have nonnegative limit. The preimages `a_epsilon` need not be nonnegative or confined to the span of two features, and their norms need not remain bounded as `epsilon` tends to zero.

If the operator `mathcal H_1` were positive semidefinite, (4.5) would force the right-hand side to be both nonnegative and nonpositive, hence zero. This would prove the desired one-sided propagation. A weaker sufficient target is the nonnegative-limit inequality only for the explicit family `a_epsilon` in (4.2).

Equivalently, the positive-term decomposition yields

\[
\|Q_1g_0\|_2^2
=\lim_{\epsilon\downarrow0}
\left[\langle a_\epsilon,\Delta_1a_\epsilon\rangle
-\|B_1a_\epsilon\|_2^2\right].
\tag{4.6}
\]

The difference has a finite limit. The two terms are not asserted to have
separate finite limits. The concrete sufficient inequality is that the limsup
of the bracket in (4.6) be at most zero. It is still unproved.

### Why full kernel positivity would give the global propagation theorem

The range of `A` is dense in ordinary `L^2`, since its Fourier symbol `D(it)`
is nonzero almost everywhere. If `mathcal H_0` is positive semidefinite,
translation gives that property for every cutoff. Equation (2.1), continuity
of `C_0` and `Q_c`, and density then give

\[
\|Q_cC_0f\|_2\le\|Q_cf\|_2
\qquad(f\in L^2,\ c\in\mathbb R).
\tag{4.7}
\]

In particular, inputs supported in `(-infinity,c]` have outputs with the same
support bound. Integrating (4.7) against `x exp(xc) dc`, using Tonelli, gives
the weighted contraction for every `x>0` and every input with finite weighted
energy. For the box pulse this reads

\[
\int e^{xu}|g_0(u)|^2\,du\le\frac{e^x-1}{x}.
\tag{4.8}
\]

This is a valid implication without a weighted-core assumption. Conversely,
under RH the inner multiplier has this propagation property, which gives
`mathcal H_0 >= 0` by (2.1). Together with the audited single-pulse criterion,
full positivity of this particular kernel is equivalent to RH. The equivalence
does not prove its missing sign.

### Compactness is consistent with noncompact propagation

The cutoff kernel is smooth and rapidly decreasing in its two arguments.
For example, all derivatives in the midpoint and separation variables follow
from (2.4); products of Schwartz functions and the condition `t >= |c-m|`
give decay in both variables. Consequently its integral operator is trace
class, with

\[
\operatorname{tr}\mathcal H_c
=\int H_c(u,u)\,du
=4\alpha\int_0^\infty t^2\kappa(t)^2\,dt>0.
\tag{4.9}
\]

One standard justification of trace class is to compose a Schwartz-kernel
operator with sufficiently high powers of the harmonic oscillator and factor
off its trace-class inverse power. This compact **energy defect** is not being
substituted for the noncompact propagation multiplier `C_0`. Its positive trace
does not determine the signs of all its eigenvalues.

## 5. Exact relation to the earlier weighted Gram kernel

Recall

\[
M_x(b)=\int_{\mathbb R}a e^{xa}\kappa(a+b)\kappa(a-b)\,da
=2\int_0^\infty a\sinh(xa)\kappa(a+b)\kappa(a-b)\,da,
\qquad x>0.
\]

Integrating the explicit cutoff kernel in the cutoff location gives

\[
\boxed{\quad
x\int_{\mathbb R}e^{xc}H_c(u,v)\,dc
=2\alpha e^{x(u+v)/2}M_x((u-v)/2).
\quad}
\tag{5.1}
\]

Indeed, for fixed integration variable `t` in (2.4), the allowed cutoffs are `m-t <= c <= m+t`, and

\[
x\int_{m-t}^{m+t}e^{xc}\,dc=2e^{xm}\sinh(xt).
\]

For test preimages for which the exponentially weighted integrals are finite, (2.1) therefore integrates to

\[
\begin{aligned}
\|e^{xu/2}g\|_2^2-\|e^{xu/2}f\|_2^2
=-2\alpha\iint
\overline{a(u)}a(v)e^{x(u+v)/2}
M_x((u-v)/2)\,du\,dv.
\end{aligned}
\tag{5.2}
\]

Thus the cutoff flux and the Mellin-tilted Gram condition are exactly related, including all scaling factors. Equation (5.2) must not be applied to the limiting pulse preimage without proving the required weighted integrability or a valid limiting argument.

## 6. What reflection and modularity alone cannot prove

There is a direct obstruction to a proof using only positivity, evenness, rapid decay, and the modular reflection law. For any `c > 0`, form

\[
\widetilde\kappa(u)=2\kappa(u)+\tfrac12\kappa(u-2c)+\tfrac12\kappa(u+2c).
\]

This kernel is still positive, even, and faster than exponentially decaying. Define `tilde H` by the same linear combination of shifts of `H`; then

\[
(\partial_u^2-1/16)\widetilde H=\widetilde\kappa,
\qquad \widetilde H(-u)=\widetilde H(u).
\]

Consequently `tilde theta(t) = t^(-1/4) tilde H(log t)` obeys the same modular transformation `tilde theta(t) = t^(-1/2) tilde theta(1/t)`. But the Laplace transform is

\[
\widetilde F(z)=(2+\cosh(cz))F(z),
\]

and therefore has explicit off-axis zeros

\[
z=\frac{\pm\operatorname{arcosh}2+(2k+1)\pi i}{c}.
\]

This does not preserve the specific integer-square coefficients of the original Jacobi theta series, nor is the stronger concavity (3.1) asserted for this perturbation. Its purpose is limited and precise: generic modular reflection and pointwise positivity cannot alone give the missing global operator sign.

## Source for the nontrivial theta input

George Csordas, *Fourier Transforms of Positive Definite Kernels and the Riemann xi-Function*, arXiv:1309.0055, Theorem 4.2(b):

https://arxiv.org/pdf/1309.0055

The cutoff identity, regularization, integrated-kernel identity, and the two-point deduction from that concavity theorem are derived in this note. The two-point deduction was independently checked during the session; its complete proof and a further finite-configuration tail theorem are recorded in `theta_boundary_two_point.md`.
