# An arithmetic-correct accelerant and the sign of each prime arrival

Research note, 8 November 2026. This follows the xi endpoint audit in PR
#46. It identifies an existing exact arithmetic representation of the
target response, and derives the local operator effect when a prime power
first enters a support window. It supplies no new global positivity
theorem and makes no novelty claim.

## 1. Keep the exact arithmetic response

Write `F(w)=xi(1/2+w)` and `M_xi(z)=i F'(-iz)/F(-iz)`. Suzuki's explicit
function is, for `t>=0`,

\[
\begin{aligned}
\Psi(t)={}&4(e^{t/2}+e^{-t/2}-2)
-\sum_{n\le e^t}\frac{\Lambda(n)}{\sqrt n}(t-\log n)\\
&+\frac t2\bigl(\psi(1/4)-\log\pi\bigr)
+\frac14\left[\zeta(2,1/4)
-e^{-t/2}\Phi(e^{-2t},2,1/4)\right].
\end{aligned}
\tag{1}
\]

Extend it evenly and put `g=-Psi`. Here `psi` is the digamma function,
`Phi` the Hurwitz--Lerch function, and `Lambda` the von Mangoldt function.
Its exact transform is

\[
\int_0^\infty g(t)e^{izt}\,dt
=-\frac{i}{z^2}M_\xi(z),\qquad\Im z>1/2.
\tag{2}
\]

Thus (1) already reproduces the complete xi response in the known
convergence half-plane. An auxiliary Hamiltonian need not be guessed from
the leading logarithm before the arithmetic is incorporated.

The associated continuous kernel is

\[
G_g(t,u)=g(t-u)-g(t)-g(-u)+g(0).
\tag{3}
\]

Suzuki proves that its positive definiteness on every finite interval is
equivalent to RH, and that the finite-interval operator is trace class
unconditionally. The exact transform solves the identification issue for
this representation; positive definiteness remains the full difficulty.
It is not obtained from the continuity of the kernel.

Source for (1)--(3) and these statements: Masatoshi Suzuki, *Aspects of the
screw function corresponding to the Riemann zeta-function*, JLMS 108
(2023), 1448--1487, Theorems 1.1--1.5:
https://arxiv.org/pdf/2206.03682 and
https://doi.org/10.1112/jlms.12785 .

The original theta cutoff kernel and (3) are two exact formulations
connected to the same xi positivity target. No quantitative congruence
between their finite derivative blocks is asserted here. Such a
congruence would need its own proof and normalization audit.

## 2. The exact finite-place cutoff

For `L=log n` and `c=Lambda(n)/sqrt(n)>0`, the contribution of this prime
power to `g` is

\[
c h_L(t),\qquad h_L(t)=(|t|-L)_+.
\]

Its contribution to (3) is therefore exactly

\[
\boxed{
K_{L,c}(t,u)=c\left[(|t-u|-L)_+
-(|t|-L)_+-(|u|-L)_+\right].
}
\tag{4}
\]

On `(-a,a)^2`, it vanishes whenever `2a<=L`. Consequently only the
finite set of prime powers `n<exp(2a)` contributes to that kernel. A prime
power at the equality boundary contributes zero. In particular no prime
contribution is present for `a<=log(2)/2`.

This exact support cutoff is useful for a cancellation-preserving
implementation. It does not mean the complete kernel is automatically
positive on the entire prime-free interval; that is a separate analytic
claim. Published positivity for a sufficiently small interval must not be
silently enlarged to this full support threshold.

## 3. A prime arrival is an indefinite update

### Proposition 1

For `L/2<a<L`, the operator with kernel (4) is indefinite on
`L2(-a,a)`.

**Proof.** In this range `h_L(t)=h_L(u)=0` throughout the interval, so
`K=c(|t-u|-L)_+`. Choose `b` with `L/2<b<a`. The two point evaluations at
`b,-b` give the matrix

\[
\begin{pmatrix}
0&c(2b-L)\\c(2b-L)&0
\end{pmatrix},
\]

which has eigenvalues `+c(2b-L)` and `-c(2b-L)`. For the integral operator,
replace the two point masses by identical nonnegative smooth bumps near
`b` and `-b`, with disjoint supports sufficiently small that all
same-side distances are below `L` and all cross distances exceed `L`.
Their sum has strictly positive quadratic form; their difference has
strictly negative quadratic form. This proves indefiniteness on the
ordinary Hilbert space. The difference is also mean zero. \(\square\)

Thus the arithmetic construction cannot be justified by saying that each
new prime power adds a positive kernel. The combined archimedean, pole, and previously included arithmetic
contributions must compensate for both signs of (4).

The negative test above is odd as a screw-kernel test. Differentiating or
integrating a test function reverses parity, so it must not be identified
without proof with the odd block of the original theta derivative ladder.

## 4. The integrated update is small, but compactness removes an L2 gap

Set `delta=2a-L` and suppose `0<delta<L`, so again `a<L`. The only
nonzero parts of (4) lie in two opposite boundary strips, each of width
`delta`. Write

\[
t=a-x,\qquad u=-a+y,\qquad 0<x,y<\delta.
\]

The cross block is the self-adjoint integral operator with kernel

\[
C_\delta(x,y)=c(\delta-x-y)_+.
\tag{5}
\]

All other blocks vanish, apart from its transpose. Under the unitary
rescaling `x=delta r`, (5) becomes `c delta^2` times the fixed kernel
`(1-r-s)_+` on `(0,1)^2`. Since

\[
\int_0^1\int_0^1(1-r-s)_+^2\,dr\,ds=\frac1{12},
\]

we obtain the quantitative estimate

\[
\boxed{\|K_{L,c}\|\le\frac{c\delta^2}{\sqrt{12}}.}
\tag{6}
\]

The full block matrix has norm `||C_delta||`, so no extra factor of two is
present in (6). For example, a constant unit vector in each boundary
strip gives cross quadratic form `c delta^2/6`, producing explicit
positive and negative Rayleigh quotients of that magnitude for the full
operator.

The estimate is genuinely useful local information. It does not make
positivity automatic: an injective positive compact operator on an
infinite-dimensional Hilbert space has eigenvalues approaching zero and
therefore has no strictly positive lower bound in the ordinary L2 norm.
An arbitrarily small perturbation in that norm can create a negative
direction. The required estimate must be relative to the actual positive
form, with its domain, rather than merely (6).

## 5. Differentiation exposes the unsmoothed delay operator

Let `v` be smooth and compactly supported in `(-a,a)` and put `phi=v'`.
Then `integral phi=0`, so the one-variable terms in (3) drop out of its
quadratic form. Twice integrating by parts gives

\[
\iint G_g(t,u)\phi(u)\overline{\phi(t)}\,du\,dt
=\iint[-g''(t-u)]v(u)\overline{v(t)}\,du\,dt,
\tag{7}
\]

where the derivative on the right is distributional. For the single
prime term,

\[
h_L''=\delta_L+\delta_{-L},
\]

so (7) contributes

\[
\boxed{
-2c\operatorname{Re}\int v(x+L)\overline{v(x)}\,dx.
}
\tag{8}
\]

This is a signed delay coupling, not a local positive potential.

### Proposition 2

When `L<2a<2L`, the bounded self-adjoint operator represented by (8) has
operator norm exactly `c`, however small `2a-L` is. It is zero when
`2a<=L`.

**Proof.** The compressed shift by `L` maps the left boundary strip of
length `delta=2a-L` isometrically onto the right boundary strip. Those
strips are disjoint. The operator `-c(T_L+T_L*)` therefore has the block
form `-c[[0,U*],[U,0]]` with `U` unitary between the two strips, and zero
on the unused middle interval. Its spectrum on the two strips contains
`+c` and `-c`, with eigenvectors formed by paired equal or opposite
functions. Its norm is `c`. \(\square\)

The smooth representation (6) and the unsmoothed representation (8) are
consistent: two integrations account for the factor `delta^2`. They
also explain why ordinary operator-norm continuity at a new delay is
unavailable after differentiation. Any continuation theorem needs a
weighted form or resolvent estimate in which concentrating on the narrow
boundary strips carries its archimedean high-frequency cost.

## 6. What the latest spectral convergence theorem does and does not add

The current primary source is Suzuki, *Spectral convergence associated
with Weil's quadratic form*, arXiv:2610.32704v1, October
2026: https://arxiv.org/pdf/2610.32704 . Its Theorems 1.1 and 1.2 explicitly
assume RH. They establish monotone eigenvalue convergence and locally
uniform convergence to the product over distinct zero ordinates. The
latter equals normalized xi only if all zeros are simple. Its inverse
compression identity uses a positive global Weil Hilbert space. Thus it
does not remove the missing unconditional positivity assumption here.

The preceding paper, *Weil's quadratic form via the screw function*,
arXiv:2606.09096v3, https://arxiv.org/pdf/2606.09096 , constructs localized
self-adjoint operators unconditionally. A sufficiently negative scalar
shift makes their forms positive, but removing that shift uniformly is
part of the RH-strength task. Its introduction also cautions that
continuity of the lower spectral bound requires care.

Suzuki's older shifted canonical construction is unconditional for the
parameter range `omega>1`; extension to every positive omega is not an
established result: https://arxiv.org/pdf/1204.1827 .

## 7. A concrete useful target

The representation (1)--(3) preserves the complete arithmetic and fixes
the spectral response. The next constructive task is a relative bound
for the **combined** archimedean and delay form, uniform as the support
expands, or an exact factorization that proves its positivity.

At a new prime-power delay, (5) gives the exact spatial profile that must
be controlled. Proposition 1 rules out monotone positive-prime induction;
Proposition 2 rules out replacing that control by a vanishing L2 norm of
the unsmoothed delay. A valid method must exploit cancellations among the
archimedean terms, the two pole terms, and the prime translations.

This is more specific than selecting a Hamiltonian with the right leading
endpoint, but it remains a proof program rather than a completed RH
argument. It supplies neither a uniform relative bound nor a previously
unproved identification of the theta-jet form with a finite arithmetic
matrix.
