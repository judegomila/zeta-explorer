# Elementary same-parity prolate differential-eigenvalue gap

## 1. Scope

This note proves an explicit lower bound for gaps between same-parity
eigenvalues of the prolate differential operator.  Its qualitative input is
the standard one-dimensional Sturm package (simplicity, oscillation,
continuity under the bounded potential `c^2*x^2`, and the variational
principle); the quantitative constants are derived below from the
differential equation, a half-line Volterra estimate, and the lifted phase.
No numerical Sturm solver and no external quantitative eigenvalue-gap
estimate is used.

The bound is deliberately conservative.  It is useful as a rigorous
non-collision lemma, but it is exponentially small in the prolate bandwidth.
It proves no growing-window conditioning estimate, signed Weil-sector floor,
equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant limit, or RH statement.
The project status remains `P0_INVALIDATED`.

## 2. Operator and conventions

For `c>=0`, let

\[
 L_c y=-\frac{d}{dx}\left((1-x^2)y'(x)\right)+c^2x^2y(x),
 \qquad -1<x<1,                                      \tag{2.1}
\]

with the regular prolate endpoint condition.  Its simple eigenvalues are
written

\[
 0\leq \mu_0(c)<\mu_1(c)<\cdots,                     \tag{2.2}
\]

and the eigenfunction with index `m` has parity `(-1)^m`.  The symbol
`mu_m` is used for the differential eigenvalue; it is not the concentration
amplitude `chi_m` used elsewhere in this repository.

Put

\[
 x=\tanh t,\qquad p(t)=\mathop{\rm sech}^2t,
 \qquad u(t,\nu)=y(\tanh t,\nu),\quad 0\leq t<\infty. \tag{2.3}
\]

The regular solution is normalized at the right endpoint by

\[
 u(\infty,\nu)=1,qquad u'(\infty,\nu)=0.             \tag{2.4}
\]

This is only an endpoint normalization for the phase argument; the final
gap is invariant under nonzero scalar rescaling.  Equation (2.1) becomes

\[
 u''(t)=p(t)\bigl(c^2\tanh^2t-\nu\bigr)u(t).          \tag{2.5}
\]

Let `phi(nu)` be the continuous lift of

\[
 \arg\bigl(u(0,\nu)+i u'(0,\nu)\bigr)                \tag{2.6}
\]

anchored by `phi(mu_0)=0`.  Even eigenvalues are zeros of `u'(0,nu)`, odd
eigenvalues are zeros of `u(0,nu)`, and the two half-interval spectra
alternate.  Here is the phase-count normalization, including the qualitative
Sturm input that is not computationally replayed.  At `c=0`, the
endpoint-normalized solutions at the eigenvalues are the Legendre
polynomials.  Their center Cauchy vectors run successively through the
positive real, positive imaginary, negative real, and negative imaginary
axes, so the continuous lift has value `m*pi/2`.  As `c` varies, the bounded
even potential gives a continuous family of simple eigenvalues and nonzero
center Cauchy vectors; reflection preserves their alternating parity.  At an
eigenvalue the vector remains on the corresponding real or imaginary axis.
Its lifted axis number is therefore integer-valued and continuous in `c`,
hence cannot change from the Legendre value.  Thus

\[
 \phi(\mu_m(c))=\frac{m\pi}{2}.                       \tag{2.7}
\]

The factor `1/2` in (2.7) is mandatory.

## 3. Phase derivative

Differentiate (2.5) with respect to `nu`.  The endpoint normalization makes
the differentiated solution and its derivative vanish at infinity.  Thus
the Wronskian identity is

\[
 \left(u\,\partial_\nu u'-u'\,\partial_\nu u\right)'
       =-p u^2,
\]

and integration from zero to infinity gives

\[
 \phi'(\nu)=
 \frac{\displaystyle\int_0^\infty p(t)u(t,\nu)^2\,dt}
      {u(0,\nu)^2+u'(0,\nu)^2}>0.                    \tag{3.1}
\]

The numerator is a half-line integral.  Replacing it by the full-line norm
would insert a false factor two.

## 4. Uniform energy estimate

Fix integers `n>=0`, `r>=1`, and put

\[
 j=n+2r,
 \qquad K^2=\max\{1,\,2c^2+j(j+1)\}.                 \tag{4.1}
\]

The Legendre min--max trial space gives

\[
 \mu_j(c)\leq c^2+j(j+1).                            \tag{4.2}
\]

Consequently, for `nu` between `mu_n(c)` and `mu_j(c)`,

\[
 \left|p(t)(c^2\tanh^2t-\nu)\right|
 \leq K^2p(t).                                       \tag{4.3}
\]

Set

\[
 T=\log(2K),\qquad a(t)=K\mathop{\rm sech}t,
 \qquad E(t)=a(t)u(t)^2+\frac{u'(t)^2}{a(t)}.         \tag{4.4}
\]

The endpoint-normalized solution satisfies the Volterra equation

\[
 u(t)=1+\int_t^\infty(s-t)p(s)
        (c^2\tanh^2s-\nu)u(s)\,ds.                  \tag{4.5}
\]

At `T`, the absolute kernel norm is at most

\[
 K^2\int_T^\infty(s-T)\mathop{\rm sech}^2s\,ds
 =K^2\log(1+e^{-2T})
 =K^2\log\left(1+\frac1{4K^2}\right)\leq\frac14.  \tag{4.6}
\]

The Neumann bound and one differentiation of (4.5) therefore give

\[
 \frac23\leq u(T)\leq\frac43,
 \qquad |u'(T)|\leq\frac23.                          \tag{4.7}
\]

Since

\[
 a(T)=\frac{4K^2}{4K^2+1}\in[4/5,1),
\]

(4.7) implies

\[
 \frac{16}{45}\leq E(T)\leq\frac73.                 \tag{4.8}
\]

From (4.3), direct differentiation of (4.4), and
`2|u u'|<=E`, one obtains

\[
 |E'(t)|\leq
 \left(\tanh t+2K\mathop{\rm sech}t\right)E(t).     \tag{4.9}
\]

Because `int_0^infinity sech(t) dt=pi/2`, (4.8)--(4.9), together with
`cosh(T)<=5K/4`, yield the center lower bound

\[
 u(0)^2+u'(0)^2
 \geq \frac{64}{225K^2}e^{-\pi K}.                  \tag{4.10}
\]

For the numerator in (3.1), note that

\[
 p u^2\leq \frac{\mathop{\rm sech}t}{K}E(t).
\]

Integrating (4.9) backward from `T`, and then using (4.7) on the tail,
gives

\[
 \begin{aligned}
 \int_0^Tpu^2dt
 &\leq \frac54E(T)e^{\pi K}\leq\frac{35}{12}e^{\pi K},\\
 \int_T^\infty pu^2dt
 &\leq\frac{16}{9}(1-\tanh T)\leq\frac{32}{45}.
 \end{aligned}                                       \tag{4.11}
\]

Hence the deliberately rounded safe estimate is

\[
 \int_0^\infty pu^2dt\leq4e^{\pi K}.                 \tag{4.12}
\]

Combining (3.1), (4.10), and (4.12) proves

\[
 \phi'(\nu)\leq\frac{225}{16}K^2e^{2\pi K}          \tag{4.13}
\]

throughout the entire interval from `mu_n(c)` to `mu_j(c)`.

## 5. Same-parity gap theorem

By (2.7),

\[
 \phi(\mu_j)-\phi(\mu_n)=r\pi.
\]

Integrating (4.13) across the eigenvalue interval gives the explicit bound

\[
 \boxed{
 \mu_{n+2r}(c)-\mu_n(c)
 \geq \frac{16r\pi}{225K^2}e^{-2\pi K},
 \qquad
 K^2=\max\{1,2c^2+(n+2r)(n+2r+1)\}.}                \tag{5.1}
\]

In particular, the step-four bound is

\[
 \mu_{n+4}(c)-\mu_n(c)
 \geq\frac{32\pi}{225K^2}e^{-2\pi K}.               \tag{5.1a}
\]

The `2c^2` in `K^2`, the exponent `2*pi*K`, and the factor `r` are all part
of the proved safe formula.

## 6. Exact `c=0` oracle

At `c=0`, `mu_m(0)=m(m+1)` and the endpoint-normalized solution is
`P_m(tanh t)`.  Since

\[
 \int_0^\infty p(t)P_m(\tanh t)^2dt
 =\int_0^1P_m(x)^2dx=\frac1{2m+1},                   \tag{6.1}
\]

(3.1) gives the following exact phase derivatives:

| `m` | `mu_m(0)` | `P_m(0)` | `P_m'(0)` | `phi'(mu_m(0))` |
|---:|---:|---:|---:|---:|
| 0 | 0 | 1 | 0 | 1 |
| 1 | 2 | 0 | 1 | 1/3 |
| 2 | 6 | -1/2 | 0 | 4/5 |
| 3 | 12 | 0 | -3/2 | 4/63 |
| 4 | 20 | 3/8 | 0 | 64/81 |

These exact rational values test the half-line normalization, the center
derivative, and the lifted-phase convention without a numerical eigensolver.

## 7. What this does not provide

On the project convention `c=2*pi*lambda^2`, and for indices `j=O(c)`,
(5.1) is only `exp(-O(c))` up to a polynomial factor.  Multiplying
`O(c^2)` such worst-case factors in a determinant or Vandermonde route can
therefore lose `exp(-O(c^3))`.  The canonical `lambda=2`, `n=0`, `r=2`
artifact illustrates this severe slack; it does not solve a conditioning
problem.

The package records only the theorem formula and exact `c=0` oracles.  The
replay checks the locked phase formula and the Legendre axis/sign oracle; it
does not computationally verify the all-`c` Sturm homotopy above.  It does not
compute or cache prolate eigenvalues, and it makes no inference from real-axis
eigenvalue agreement to locally uniform determinant convergence.
