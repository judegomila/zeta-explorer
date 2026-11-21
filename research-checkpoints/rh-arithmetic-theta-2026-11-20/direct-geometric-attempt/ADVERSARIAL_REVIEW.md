# Internal adversarial review of the direct theta-kernel attempt

Date: 21 November 2026.

**Verdict:** the exact kernel identity, density argument, local-channel obstruction, and the analytic tails used by the interval certificate are valid under the displayed hypotheses. This is an internal mathematical review, not an external referee report, a Lean replay, or a proof of RH. The positivity of the complete two-variable Riemann kernel remains open in this attempt.

## 1. Exact negative control for generic geometry

Let `phi` denote the normal density of variance 8, and set

\[
 k_*(t)=3\phi(t)+\tfrac12\phi(t-2)+\tfrac12\phi(t+2).
\]

This function is analytic, strictly positive, even, and Gaussian-decaying. With the same transform convention as the manuscript,

\[
 F_*(z)=\int_{\mathbb R}k_*(t)e^{zt/2}\,dt
       =e^{z^2}(3+\cosh z),\qquad
 L_*(z)=2z+\frac{\sinh z}{3+\cosh z}.
\]

It is strongly log-concave. Writing the Gaussian mixture as an exponential tilt of a random mean `A` supported on `{-2,0,2}` gives

\[
 (\log k_*)''(t)=-\tfrac18+\tfrac1{64}\operatorname{Var}_t(A)
               \le-\tfrac1{16}.
\]

The variance bound follows from `E(A^2) <= 4`; subtracting the squared mean only decreases the variance.

Nevertheless, set `a = log 2`, take rates `x=a`, `y=2a`, and coefficients `b=(1,-1)`. Both rates exceed `1/2`. The linear term `2z` contributes the constant matrix `2 * 1 * 1^*` and cancels on this vector. The two remaining values are exactly

\[
 \frac{\sinh a}{3+\cosh a}=\frac3{17},\qquad
 \frac{\sinh(2a)}{3+\cosh(2a)}=\frac{15}{41}.
\]

Therefore

\[
 b^*P_*b
 =\frac{3/17}{a}+\frac{15/41}{2a}
   -\frac{2(3/17+15/41)}{3a}
 =-\frac3{1394\log2}<0.
\]

The off-axis zeros are `+/- arcosh(3) + (2k+1)i*pi`. Thus positivity, evenness, smoothness, Gaussian decay, strong log-concavity, and positivity of the real-axis logarithmic derivative do not establish the desired Pick positivity. This example has entire order two and does not share the full arithmetic structure or double-exponential theta decay of the Riemann kernel. It does not refute a proof using those additional facts.

## 2. Exact transform and density review

For the actual even Riemann kernel `kappa`, put

\[
 v=(t+u)/2,\quad w=(t-u)/2,\quad
 H(t,u)=\tfrac12\int_{|v|}^{\infty}
 r\kappa(r+w)\kappa(r-w)\,dr.
\]

The product in the integrand is even in `r`, so the full integrand is odd. Hence replacing the lower endpoint `|v|` by `v` leaves the integral unchanged, including `v<0`. This justifies

\[
 (\partial_t+\partial_u)H(t,u)
 =-\frac{t+u}{4}\kappa(t)\kappa(u).
\]

Integration by parts with `exp(xt/2+yu/2)` therefore gives exactly

\[
 \iint H(t,u)e^{xt/2+yu/2}\,dt\,du
 =\frac{F'(x)F(y)+F(x)F'(y)}{x+y}.
\]

There is no missing factor of two. In the Gaussian case `kappa(t)=A exp(-alpha t^2)`, direct integration gives `H(t,u)=kappa(t)kappa(u)/(8 alpha)`, confirming the normalization independently.

For `M=max(|t|,|u|)=|v|+|w|`, at least one of `|r+w|,|r-w|` equals `r+|w|` for `r>=0`. The stated double-exponential decay and boundedness of the other factor give a bound of the form

\[
 |H(t,u)|\le C(1+M)\exp(-c e^M).
\]

This suffices for every integration by parts and for the weighted Hilbert--Schmidt argument. In `L^2(e^{-t^2}dt)`, the kernel `H/(omega(t)omega(u))` is Hilbert--Schmidt because its squared norm is the integral of `|H|^2 exp(t^2+u^2)`.

Orthogonality to every `exp(x_j t/2)` on the sparse accumulating sequence makes an entire Gaussian-weighted Laplace transform vanish on an interior accumulation set. Identity-theorem and Fourier uniqueness then imply density. Positivity on the sparse exponentials extends by boundedness to all weighted `L^2` tests; compact approximate delta masses recover pointwise kernel positive definiteness. The converse follows by compact Riemann sums and bounded extension. No spectral gap or dimension-uniform estimate is used.

## 3. Local differential-channel review

For a nonzero constant-coefficient polynomial `p`, set `g=p(d/dt)kappa`. Repeated integration by parts gives

\[
 \int g(t)e^{xt/2}\,dt=p(-x/2)F(x).
\]

If `H-c g(t) conjugate(g(u))` were positive definite for any fixed `c>0`, compact cutoffs of the exponential test would imply

\[
 \frac{L(x)}x\ge c|p(-x/2)|^2\qquad(x>0).
\]

But the completed zeta logarithmic derivative satisfies `L(x)/x -> 0` on the positive real ray, while a nonzero polynomial's squared modulus is eventually bounded below by a positive constant. This is a contradiction. The same density argument transfers this obstruction to some finite sparse prefix. With the manuscript's `b^*Pb` convention the subtracted matrix is `c u u^*`, where `u_j=p(-x_j/2)`.

This theorem excludes the stated fixed local channels. It does not exclude the full kernel's positivity, arbitrary nonlocal Gram features, variable-coefficient constructions, or finite-test approximations with changing spaces and errors.

## 4. Review of the ball-arithmetic certificate

The following analytic inputs in `check_gaussian_obstruction_interval.py` were checked independently:

1. For omitted terms `m>=9`, the positive theta term is at most `2*pi^2*m^4*exp(-pi*m^2)` uniformly on `r>=0`: the derivative of the retained exponential exponent is `9/4-pi*m^2*exp(r)<0`.
2. Consecutive majorants have ratio less than `1/2`. Summing gives `delta0=4*pi^2*9^4*exp(-81*pi)`.
3. Direct symbolic differentiation verifies the second-derivative polynomial `2A^4-14A^3+(165/8)A^2-(75/16)A`, multiplied by `exp(-A)`, with `A=pi*m^2`.
4. For `A>=81*pi>243`, the absolute polynomial is at most the sum of absolute monomials, strictly less than `3A^4`. The degree-eight majorant also has geometric ratio below `1/2`, giving the stated `delta2`.
5. On `r>=4`, summing the first-term majorant gives `kappa(r)<=4*pi^2*exp(9r/4-pi*exp(r))`. The inequalities `9r/2<=pi*exp(r)` and `r<=exp(r)` then bound the omitted integral by `8*pi^3*exp(-pi*exp(4))`.
6. Each interval sum term encloses the integrand over the entire closed subinterval. The symmetric tail balls include the positive omitted tails. Multiplying these enclosures by interval widths and summing is a valid integral enclosure; no unproved quadrature-rate assumption is needed.

The recorded remainder interval has upper endpoint approximately `-0.00048844924669`, which is strictly below `-1/2500`. The exploratory decimal approximations are not used to certify the sign.

The default reviewer Python did not contain `python-flint`, so this review checks the script, analytic tail arguments, and retained interval record; it does not claim an independent second execution of the Arb runtime. The companion `obstruction_check.py` independently executes the exact symbolic and rational checks using SymPy.
