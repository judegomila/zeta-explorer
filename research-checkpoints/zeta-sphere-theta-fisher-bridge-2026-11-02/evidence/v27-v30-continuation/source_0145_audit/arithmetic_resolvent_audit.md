# Independent analytic audit: arithmetic translation resolvent

Date: 2026-11-03 (UTC).

## Result

**Pass, with the scope stated in the manuscript.** The arithmetic grouping, graph-norm convergence, Fourier normalization, inverse, both truncation bounds, operator identity, endpoint obstruction, and large-base cancellation in Section 22 are correct. I found no sign, factor, domain, or endpoint error in these claims. They supply an exact convergent decomposition, not a new proof of bridge positivity or RH.

An independent useful simplification is that the residual profile is a unitary Fourier-phase transform of the original polynomial profile. If `G = widehat(g)`, then

\[
 \widehat z(t)=w_b(t)G(t),\qquad
 w_b(t)=\frac{1-ce^{itL}}{|1-ce^{itL}|},\qquad |w_b(t)|=1.
\]

Consequently the entire decomposition can be written

\[
 S_{a,b}[p]=2Q_a[p]-\frac1{2\pi}\int_{\mathbb R}v_b(t)|G(t)|^2\,dt.
 \tag{A}
\]

This exposes the exact compensation of the positive phase contribution. An original strengthening of the stated obstruction follows: the coarse residual bound fails at `a=0` for **every nonzero fixed polynomial** `p`, not only `p=1`, and therefore fails for sufficiently small positive `a` for each fixed pair `(p,b)`. The size of that neighborhood is not asserted uniform in `p` or `b`.

## Scope and method

Primary source: `private/source/relative_modular_bridge_all_order.tex`, lines 447–654, corresponding to Section 22 of `private/paper.txt`. I also read the paper's definitions (1.1)–(1.9), the position identity (16.2), and its normalization warning. This is an original analytic audit. **No acquired program was executed**, no supplied numerical certificate was replayed, and no external publication or write was made. The only new file is this audit report.

The hypotheses throughout the resolvent argument are a fixed integer `b >= 2`, `L=log b`, `0 <= a < 1/2`, `sigma=a+1/2`, and `c=b^(1/2-a)>1`. All `L2` norms in this section are with Lebesgue measure on the full real line, not the weighted contraction space used elsewhere.

## 1. Arithmetic filter and normalization

The summand in the paper's theta series is

\[
 \psi_n(u)=\left(8\pi^2 n^4e^{9u/2}-12\pi n^2e^{5u/2}\right)
             e^{-\pi n^2e^{2u}}.
\]

Direct substitution proves `psi_n(u)=n^(-1/2) psi_1(u+log n)`. With `phi_a=e^(au) psi_1`, this gives

\[
 e^{au}\psi_n(u)=n^{-\sigma}S_{\log n}\varphi_a(u).
\]

Applying `c S_L` changes the coefficient of an index divisible by `b` from `n^(-sigma)` to `b n^(-sigma)`, because `c b^sigma=b`. Thus the arithmetic coefficient is exactly `alpha_b(n)=1-b 1_(b|n)`, not `1-c 1_(b|n)` or `1-sqrt(b) 1_(b|n)`. Also `c e^(aL)=sqrt(b)`, so (22.1)'s profile in brackets really is independent of `a`.

For the convention `widehat(f)(t)=int f(u)e^(-itu)du`, translations have multiplier `e^(it lambda)`, and `X` becomes `i d/dt`. These signs are consistent everywhere in the section.

For the Mellin computation put `x=pi e^(2u)` and `s=sigma-it`. Since

\[
 \psi_1(u)=e^{u/2}(8x^2-12x)e^{-x},\qquad du=\frac{dx}{2x},
\]

one obtains

\[
 \widehat\varphi_a(t)=\pi^{-s/2}
  \{4\Gamma(s/2+2)-6\Gamma(s/2+1)\}
  =s(s-1)\pi^{-s/2}\Gamma(s/2).
\]

The grouped Dirichlet sum is `(1-b^(1-s)) zeta(s)`. The resulting transform is therefore exactly `2(1-b^(1-s)) xi(s)`. There is no missing `2`, `sqrt(b)`, or Fourier normalization. Separately,

\[
 \widehat f_a(t)=2\Xi(t+ia)=2\xi(1/2-a+it)=2\xi(s)
\]

by `xi(1-s)=xi(s)`. In particular, the sign of `it` in the definition of `s` is correct.

## 2. Grouped derivative and position convergence

As `u -> -infinity`, `phi_a` and each fixed derivative decay like a polynomial in `e^(2u)` times `e^((a+5/2)u)`; as `u -> +infinity` they decay faster than every exponential. Multiplying by any fixed power of `u` preserves integrability. This verifies the input regularity without assuming the ungrouped theta sum converges absolutely in `L2`.

For a fixed derivative cutoff `j`, use the complete graph norm

\[
 N_j(q)=\sum_{r=0}^j\bigl(\|D^rq\|_2+\|XD^rq\|_2\bigr).
\]

Let `F(x)=x^(-sigma) S_(log x) phi_a`. Differentiation in this norm gives

\[
 F'(x)=x^{-\sigma-1}S_{\log x}(D-\sigma)\varphi_a.
\]

The position estimate uses the exact relation

\[
 XS_\lambda q=S_\lambda Xq-\lambda S_\lambda q.
\]

If

\[
 C_j=\sum_{r=0}^j\|(D-\sigma)D^r\varphi_a\|_2,
 \qquad E_j=\sum_{r=0}^j\|X(D-\sigma)D^r\varphi_a\|_2,
\]

then for `x>=1`,

\[
 N_j(F'(x))\le x^{-\sigma-1}\{(1+\log x)C_j+E_j\}.
\]

The block indexed by `m>=0` is exactly

\[
 \sum_{k=1}^{b-1}\{F(bm+k)-F(bm+b)\}.
\]

For `m>=1`, its norm is at most `b(b-1)/2` times the supremum of `N_j(F'(x))` over `[bm+1,bm+b]`. This is `O_(a,b,j)(m^(-sigma-1)(1+log m))`. Since `sigma>0`, the sum of block norms converges. An explicit form of the remaining asymptotic tail, after blocks through `m=N>=1`, is bounded by a fixed constant times

\[
 N^{-\sigma}\left\{\frac{1+\log N}{\sigma}+\frac1{\sigma^2}\right\}.
\]

The limit is the stated filtered theta profile: finite block partial sums converge pointwise to that expression, while graph convergence implies `L2` convergence and an almost-everywhere convergent subsequence. Equality almost everywhere is already sufficient; the smooth profile supplies the natural representative. No unjustified interchange of the ungrouped `L2` series is needed.

Finally,

\[
 \|q\|_1\le\sqrt{\pi}\bigl(\|q\|_2^2+\|Xq\|_2^2\bigr)^{1/2}.
\]

Thus grouped convergence also holds in `L1`, permitting the grouped Fourier calculation. The scalar Dirichlet grouping is locally uniformly convergent on `Re(s)>0` by the same cancellation estimate, so its analytic continuation from `Re(s)>1` is justified.

## 3. Resolvent and truncation bounds

For `c>1`, the series

\[
 R=-\sum_{m=1}^\infty c^{-m}S_{-mL}
\]

converges in operator norm on ordinary `L2`. Multiplication by `I-cS_L` telescopes to the identity. The orientation is correct: `S_(-mL) H(u)=H(u-mL)` shifts a profile toward larger `u`.

The two required scalar sums are

\[
 \sum_{m>M}c^{-m}=\frac{c^{-M}}{c-1},
\]

\[
 \sum_{m>M}m c^{-m}
 =\frac{c^{-M}}{c-1}\left(M+1+\frac1{c-1}\right).
\]

Together with `XS_(-mL)H=S_(-mL)XH+mL S_(-mL)H`, these prove both displayed tail bounds, including the precise `M+1+1/(c-1)` coefficient. Derivatives commute with all shifts, so the same estimates apply to `D^j H` whenever its position graph norm is finite.

The position-form error bound follows by writing the difference as

\[
 \langle (R-R_M)H,XRH\rangle
 +\langle R_MH,X(R-R_M)H\rangle
\]

and applying Cauchy–Schwarz. It does not presume that the position form has either sign.

Uniformity on any fixed closed interval `0<=a<=a_*<1/2` is valid because `c>=b^(1/2-a_*)>1`. It is not uniform up to `a=1/2`, nor uniform over all polynomial degrees. At `a=1/2`, the multiplier denominator `1-e^(itL)` vanishes at a lattice and there is no bounded inverse on all of `L2`; the manuscript correctly does not claim one. The special input may have matching zeros, but that does not restore an all-input bounded inverse.

## 4. Operator identity and domains

Let `r=(1-ce^(itL))^(-1)`, `Delta=|1-ce^(itL)|^2`, and `rho=|r|=Delta^(-1/2)`. Since `Delta >= (c-1)^2>0`, these multipliers and their first derivatives are bounded. They preserve the Fourier `H1` domain corresponding to `D(X)={q in L2: Xq in L2}`. Their inverses are bounded with bounded first derivatives too, so the operator products in the assertion have exactly this common domain.

For any Fourier-side `H1` function `h`,

\[
 \overline r\,i(rh)'-\rho\,i(\rho h)'
   =i(\overline r r'-\rho\rho')h
   =-\rho^2\theta' h,
\]

where `r=rho e^(i theta)`. Direct differentiation gives

\[
 -\theta'=v_b
  =L\frac{c^2-c\cos(tL)}\Delta
  =\frac L2+\frac{L(c^2-1)}{2\Delta}.
\]

Thus, as an operator equality on `D(X)`,

\[
 R^*XR=B^{1/2}XB^{1/2}+\frac L2 B+\frac L2(c^2-1)B^2.
\]

All signs agree with a large-`c` check: `R` is approximately `-c^(-1)S_(-L)`, whose position contribution is positive `L c^(-2)`.

The sharp phase bounds are verified explicitly by

\[
 \frac{v_b}L-\frac c{c+1}
 =\frac{c(c-1)(1+\cos(tL))}{(c+1)\Delta},
\]

\[
 \frac c{c-1}-\frac{v_b}L
 =\frac{c(c+1)(1-\cos(tL))}{(c-1)\Delta}.
\]

For `H=p(A_a)h`, the theta decay puts `H`, `g=RH`, and their relevant derivatives in the domain. Commutation with constant-coefficient polynomial differential operators is legitimate. Moreover `BH=R* g`, `||B^(1/2)H||=||g||`, and the established raw bridge identity is `2Q_a[p]=<g,Xg>`. Taking the quadratic form gives exactly (22.10), with the displayed two coefficients `L/2`. No extra Parseval factor belongs in these physical-space squared norms.

## 5. Endpoint obstruction, including a stronger version

Since `H=(I-cS_L)g`, the unit-modulus formula for `widehat z` at the start of this report follows directly. Its phase derivative is `v_b`, giving (A). In particular the sum of the two positive terms is

\[
 \frac1{2\pi}\int v_b(t)|\widehat g(t)|^2\,dt.
\]

At `a=0`, `g_0=p(-D^2)psi` is even, including for complex coefficients, so `<g_0,Xg_0>=0`. For `p=1`, (A) is exactly (22.13). Because `v_b-v_min` is positive except at a discrete lattice and `widehat psi(0)>0`, the integral is strictly positive before the minus sign.

More generally `widehat(g_0)(t)=p(t^2) widehat(psi)(t)`. For every nonzero polynomial this is a nonzero `L2` function, while `v_b-v_min>0` almost everywhere. Therefore

\[
 S_{0,b}[p]+v_{\min}\|g_0\|_2^2<0
 \quad\text{for every nonzero polynomial }p.
\]

For each fixed `p,b`, the functions and multipliers depend continuously on `a` in the position graph norm near zero, giving strict failure on some interval `0<a<epsilon_(p,b)`. This is a genuine disproof of the proposed stronger estimate, not a disproof of the exact residual target or bridge positivity.

The normalization warning is essential and correct. Here `Q_0` denotes the raw continuous endpoint, which is zero. It is not the bridge normalized by dividing by `a`. For example `lim_(a->0) Q_a[1]/a=||X psi||_2^2>0`. The negative residual and the two positive terms separately have nonzero order-one limits, so after division by `a` their divergent pieces must be combined before taking the normalized limit.

## 6. Large-base cancellation

Away from zeros the factorization `widehat f=r widehat h` gives `V_H=V_F-v_b`, with the stated sign. At `t=0`, `widehat f_a(0)=int e^(au)psi(u)du>0`; its logarithmic derivative is finite. Meanwhile `v_b(0)=L c/(c-1)` diverges when `b->infinity` at fixed `a<1/2`.

The pointwise phase bounds yield

\[
 \sup_t|v_b(t)-L|\le\frac L{c-1}.
\]

Applying this to (A), followed by Parseval, gives precisely (22.14), uniformly over all the permitted polynomial inputs relative to `||g||^2`. At fixed `a<1/2`, `(log b)/(b^(1/2-a)-1)->0`. The statement does not extend uniformly to a simultaneous approach to `a=1/2`.

A supplementary geometric interpretation follows from

\[
 w_b(t)=-e^{itL}\frac{1-c^{-1}e^{-itL}}{|1-c^{-1}e^{-itL}|}.
\]

It gives the safe bound

\[
 \|z+S_Lg\|_2\le\frac2{c-1}\|g\|_2.
\]

Thus at large base the residual is approximately the original profile shifted **left** by `L` (up to an irrelevant minus sign). The energy estimate proves the corresponding position cancellation without relying on `L2` convergence alone to pass an unbounded position form.

## Consequence for the research program

The section validly turns the arithmetic scale idea into convergent analysis and rules out its simplest proposed positive reserve. The remaining estimate (22.11) is exactly the original sign question in transformed coordinates. Two nonnegative terms do not make the decomposition positivity preserving, and increasing the base makes the signed residual more negative by precisely the compensating amount. The manuscript's own limitation statement is accurate.
