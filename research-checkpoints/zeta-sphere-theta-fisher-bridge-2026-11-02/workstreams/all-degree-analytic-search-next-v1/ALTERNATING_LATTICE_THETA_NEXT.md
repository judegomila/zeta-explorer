# Complete-theta alternating lattice: an Ewald form and a large-spacing theorem

## Scope and outcome

This note studies the actual Csordas kernel

\[
 K(r)=K_1(r)=\int_{\mathbb R}u^2\Phi(u+r)\Phi(u-r)\,du
\]

and its antiperiodization

\[
 D_\delta(r)=\sum_{n\in\mathbb Z}(-1)^nK(r+n\delta),
 \qquad 0\leq r\leq \frac\delta2.                 \tag{1}
\]

The main exact progress is:

1. an independent, modularly complete multiplicative-Ewald representation of
   (1), with no raw-theta cusp seam;
2. an exact adjacent-pair representation and a rigorous theorem that
   `D_delta(r) >= 0` on the whole half-cell for every sufficiently large
   spacing `delta`;
3. exact centre/boundary and boundary-slope formulae;
4. a correction of an apparent numerical counterexample: the negative value
   was a premature Fourier truncation in a beyond-all-orders cancellation.

No counterexample to `D_delta >= 0` for the actual `K_1` was found.  The global
sign remains unproved.  It is a pointwise sufficient statement stronger than
the single weighted-average condition in the still-open first Laguerre sign,
so the positive diagnostics below are not an RH claim and are not evidence of
a proof.

## 1. Normalizations and why this is only a sufficient condition

Use Csordas' normalization

\[
 H(x)=\int_0^\infty\Phi(t)\cos(xt)\,dt,
 \qquad
 \Xi(\nu)=8H(2\nu),
\]

and put

\[
 F(\nu)=\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu).
\]

If

\[
 \widehat K(q)=\int_{\mathbb R}K(r)e^{-iqr}\,dr,
\]

then Proposition 3.10 and the scaling above give

\[
 \boxed{\widehat K(q)=\frac1{256}F(q/4).}          \tag{2}
\]

Indeed, with `C(q)=integral_0^infinity K(r) cos(qr) dr`,

\[
 C(q)=\frac12\{H'(q/2)^2-H(q/2)H''(q/2)\}=\frac1{512}F(q/4),
\]

and `hat K=2C`.

For `x=pi/delta`, partitioning the real line into cells centred at `n delta`
gives the exact identity

\[
 C(x)=\int_0^{\delta/2}\cos(xr)D_\delta(r)\,dr.    \tag{3}
\]

Thus pointwise nonnegativity of `D_delta` is sufficient for the desired
Laguerre sign at `x=pi/delta`.  It is not equivalent to it: (3) only tests one
positive cosine-weighted average of `D_delta`.

## 2. Additive Poisson representation

Poisson summation with the character `(-1)^n` gives

\[
 \boxed{
 D_\delta(r)=\frac2\delta\sum_{m\geq0}
 \widehat K\!\left(\frac{(2m+1)\pi}{\delta}\right)
 \cos\!\left(\frac{(2m+1)\pi r}{\delta}\right).
 }                                                        \tag{4}
\]

Using (2), this is

\[
 \boxed{
 D_\delta(r)=\frac1{128\delta}\sum_{m\geq0}
 F\!\left(\frac{(2m+1)\pi}{4\delta}\right)
 \cos\!\left(\frac{(2m+1)\pi r}{\delta}\right).
 }                                                        \tag{5}
\]

Formula (5) is useful, but it hides severe cancellation when the real-space
lattice is sparse.  It must not be truncated merely when the first several
terms appear small.

Because `K` and `hat K` are Schwartz, (4) also proves, uniformly on a half
cell after writing `r=theta delta`,

\[
 D_\delta(\theta\delta)=O_N(\delta^N)
 \quad(\delta\downarrow0),\qquad 0\leq\theta\leq\tfrac12,  \tag{6}
\]

for every `N`.  Every finite local-jet expansion cancels.  This is the exact
beyond-all-orders obstruction to a finite Taylor argument.

## 3. A complete-theta multiplicative Ewald representation

Define the complete one-cusp theta kernel

\[
 \mathcal P(z)=\sum_{a\geq1}\pi a^2(2\pi a^2z-3)
 z^{5/4}e^{-\pi a^2z},\qquad z>0.                 \tag{7}
\]

The standard Riemann kernel is

\[
 \Phi(t)=\mathcal P(e^{4t}).                       \tag{8}
\]

The Jacobi modular identity, equivalently the evenness of `Phi`, is

\[
 \boxed{\mathcal P(z)=\mathcal P(1/z).}            \tag{9}
\]

Consequently (7) should always be evaluated at

\[
 z^\sharp=\max(z,z^{-1}).
\]

Since `z^sharp >= 1`, every term of (7) is then positive and the series is
rapidly convergent.  This folding is important: expanding (7) at `z << 1`
and integrating individual theta orbits would destroy the modular
cancellation at that cusp.

Put

\[
 q=e^{4\delta},\qquad z_+(u,r)=e^{4(u+r)},\qquad
 z_-(u,r)=e^{4(u-r)}.
\]

Substitution of (8) in (1), followed only by the absolutely convergent lattice
interchange, yields

\[
 \boxed{
 D_\delta(r)=\int_{\mathbb R}u^2\,
 \mathcal E_{\delta,r}(u)\,du,
 }                                                        \tag{10}
\]

where

\[
 \boxed{
 \mathcal E_{\delta,r}(u)=
 \sum_{n\in\mathbb Z}(-1)^n
 \mathcal P(z_+(u,r)q^n)\,
 \mathcal P(z_-(u,r)q^{-n}).
 }                                                        \tag{11}
\]

This is a multiplicative Ewald form.  The orbit preserves

\[
 (z_+q^n)(z_-q^{-n})=e^{8u}.                      \tag{12}
\]

After applying the fold (9) to each factor, the terms in (11) decay doubly
exponentially in both lattice directions.  Moreover,

\[
 \sum_n\int_{\mathbb R}u^2
 \Phi(u+r+n\delta)\Phi(u-r-n\delta)\,du
 =\sum_nK(r+n\delta)<\infty,
\]

so (10) does not rely on a formal Fubini step.  Equations (10)-(11) are a
stable direct-space representation independent of the additive Poisson form
(4).

One may expand the two factors in (11) into theta orbits only after folding
each argument with (9).  The unfurled formal product has the useful orbit
shape

\[
 (2Aq^n-3)(2Bq^{-n}-3)e^{-Aq^n-Bq^{-n}},           \tag{13}
\]

but integrating its individual `a,b` components across the wrong cusp is not
legitimate.  The complete `mathcal P` in (11) is the seam-free object.

## 4. Exact real-space pairing

For `0 <= r <= delta/2`, define

\[
 b_j(r)=K(j\delta+r)-K((j+1)\delta-r),\qquad j\geq0.
\]

Since `K` is decreasing on the positive half-line, `b_j(r) >= 0`.  Reordering
the absolutely convergent lattice gives

\[
 \boxed{D_\delta(r)=\sum_{j\geq0}(-1)^j b_j(r).}   \tag{14}
\]

Equivalently, writing `r=delta/2-y`,

\[
 \boxed{
 D_\delta(\delta/2-y)=\sum_{j\geq0}(-1)^j
 \left[
 K((j+\tfrac12)\delta-y)-K((j+\tfrac12)\delta+y)
 \right].
 }                                                        \tag{15}
\]

These identities isolate the missing fact.  Ordinary monotonicity of `K`
makes every bracket positive, but positivity of the alternating total needs
control of the bracket sizes.  Global convexity would supply that control;
the actual `K` is concave at the origin, since

\[
 K''(0)=2\int_{\mathbb R}u^2\Phi(u)^2(\log\Phi)''(u)\,du<0.
\]

Thus a global convex-kernel theorem cannot simply be imported.

## 5. A rigorous nontrivial regime: all sufficiently large spacings

The complete-theta kernel nevertheless becomes convex in its far tail.  The
first theta orbit and differentiable Laplace asymptotics give, as
`r -> infinity`,

\[
 \boxed{
 K(r)=\frac{\pi^3}{32}
 e^{12r-2\pi e^{4r}}\left(1+O(e^{-4r})\right).
 }                                                        \tag{16}
\]

For completeness, the saddle lies at `u=0`.  The leading integrand is

\[
 4\pi^4u^2e^{18r}
 \exp\{-2\pi e^{4r}\cosh(4u)\},
\]

and

\[
 \int_{\mathbb R}u^2e^{-16\pi e^{4r}u^2}\,du
 =\frac{1}{128\pi e^{6r}},
\]

which yields (16).  The remaining theta orbits are exponentially smaller.
In particular, there is a finite `T` such that

\[
 K'(r)<0,\qquad K''(r)\geq0\qquad(r\geq T).        \tag{17}
\]

Here is an explicit sufficient large-spacing criterion:

\[
 \boxed{
 \delta\geq2T,\qquad
 2\sum_{n\geq1}K(n\delta-T)\leq K(T).
 }                                                        \tag{18}
\]

Under (18),

\[
 \boxed{D_\delta(r)\geq0\quad(0\leq r\leq\delta/2).}    \tag{19}
\]

Proof.  If `0 <= r <= T`, then

\[
 D_\delta(r)\geq K(r)-2\sum_{n\geq1}K(n\delta-T)
 \geq K(T)-2\sum_{n\geq1}K(n\delta-T)\geq0.      \tag{20}
\]

If `T <= r <= delta/2`, put `g=-K'`.  By (17), `g` is nonnegative and
nonincreasing on `[T,infinity)`, while

\[
 b_j(r)=\int_{j\delta+r}^{(j+1)\delta-r}g(v)\,dv. \tag{21}
\]

The intervals in (21) have equal length and move to the right with `j`, so
`b_{j+1}(r) <= b_j(r)`.  The alternating-series test applied to (14) gives
(19).  Finally, (16) implies that (18) holds for every sufficiently large
`delta`.  This proves the claimed all-point scale regime without a finite
degree or finite-frequency certificate.

The theorem is existential rather than numerically optimized: no claim is
made here that a particular displayed spacing lies beyond the smallest valid
threshold.

## 6. Exact boundary data

Evenness and antiperiodicity give

\[
 D_\delta(-r)=D_\delta(r),\qquad
 D_\delta(r+\delta)=-D_\delta(r),
\]

and hence the exact half-cell boundary value

\[
 \boxed{D_\delta(\delta/2)=0.}                    \tag{22}
\]

The one-sided compatibility condition at that boundary is

\[
 \boxed{
 D_\delta'(\delta/2)
 =2\sum_{j\geq0}(-1)^jK'((j+\tfrac12)\delta)
 =-\frac{2\pi}{\delta^2}\sum_{m\geq0}(2m+1)(-1)^m
 \widehat K\!\left(\frac{(2m+1)\pi}{\delta}\right).
 }                                                        \tag{23}
\]

Pointwise positivity just inside the half-cell requires the quantity in (23)
to be nonpositive.  Formula (23) is a useful exact falsifier, but its sign is
not presently controlled at every spacing.

At the cell centre, monotonicity and the elementary alternating-series bound
give the non-global sufficient condition

\[
 D_\delta(0)\geq K(0)-2K(\delta).                 \tag{24}
\]

Thus `K(delta) <= K(0)/2` certifies the centre, not the whole cell.

## 7. A harmonic dominance criterion

For `0 <= t <= pi/2`,

\[
 |\cos((2m+1)t)|\leq(2m+1)\cos t.                 \tag{25}
\]

Applying (25) to (4) gives another exact sufficient condition:

\[
 \widehat K(\pi/\delta)\geq
 \sum_{m\geq1}(2m+1)
 \left|\widehat K((2m+1)\pi/\delta)\right|       \tag{26}
\]

implies `D_delta(r) >= 0` on the half-cell.  In Xi variables, (26) is

\[
 F(a)\geq\sum_{m\geq1}(2m+1)|F((2m+1)a)|,
 \qquad a=\frac\pi{4\delta}.                     \tag{27}
\]

This is a genuine all-harmonic estimate, not a finite check.  It may be useful
for a future small-spacing proof, but it cannot be invoked circularly: even
the leading sign `F(a) >= 0` is part of the open target.

## 8. Correcting a false numerical obstruction

A first 20-harmonic evaluation of (5) at

\[
 \delta=2,\qquad r=\tfrac12
\]

appeared negative.  Re-evaluation using 100-decimal Arb ball arithmetic for
the completed-zeta value and its first two Taylor coefficients shows that the
sign was a Fourier truncation artifact.  Define the unscaled partial sum

\[
 S_M=\sum_{m=0}^{M-1}
 F((2m+1)\pi/8)\cos((2m+1)\pi/4).
\]

The finite partial sums are:

\[
\begin{array}{c|r}
M&S_M\\ \hline
15&-1.5165646163945808663\,10^{-5}\\
20&-7.1626858991004986767\,10^{-8}\\
25&+1.1768646676757389783\,10^{-9}\\
30&+2.0690914247070715060\,10^{-12}\\
40&+5.7203793417340693479\,10^{-16}\\
60&+5.9097006879428181855\,10^{-16}\\
80&+5.9097006880208118969\,10^{-16}.
\end{array}                                             \tag{28}
\]

The Arb enclosures of the displayed *finite sums* had radii below `7e-97`.
The prefactor in (5) would turn the last line into approximately
`2.30847683125813e-18`.

This calculation is deliberately not promoted to an all-tail proof: an
explicit analytic bound for the omitted completed-zeta tail was not supplied.
Its rigorous use here is narrower.  It proves that the earlier negative
20-term partial sum was not stable under extension, and it demonstrates how
the beyond-all-orders cancellation in (6) defeats naive truncation.  A modest
high-precision diagnostic at several spacings likewise found no stable
negative value; values near the boundary rapidly fell to the numerical
cancellation floor.

## 9. Status and next exact target

The actual complete-theta antiperiodization now has two complementary exact
forms:

- the additive odd-frequency form (4)-(5), and
- the modularly folded multiplicative-Ewald form (10)-(11).

The sign is proved at the half-cell boundary and throughout every
sufficiently large-spacing half-cell.  No exact theta-specific obstruction was
found, and the apparent numerical obstruction was false.  Hence global
`D_delta >= 0` remains analytically plausible, but unproved.

The sharp remaining lemma is not ordinary monotonicity or log-concavity.  In
the direct form it is control of the alternating adjacent differences in
(14)-(15); in the frequency form it is an all-odd-harmonic domination such as
(26), without assuming the desired first Laguerre sign.  Either route must use
complete-theta modular arithmetic.  Generic positive, even, analytic,
log-concave kernels do not have this property, so a generic shape argument
cannot close the gap.

No statement in this note proves the global first Laguerre inequality, RH, or
any all-degree extension.
