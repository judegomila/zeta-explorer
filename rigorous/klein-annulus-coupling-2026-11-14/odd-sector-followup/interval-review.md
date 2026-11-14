# Independent audit of the first theta odd-jet enclosure

Reviewed and independently replayed on 14 November 2026. Source under review: `numeric/theta-odd-jet-interval.py`, using mpmath 1.3.0 interval arithmetic at 40 decimal digits. The replay was performed on a private copy, without changing the numerical agent's files.

## Verdict

The enclosure logic is sound under the stated trust in mpmath's outward-rounded elementary interval arithmetic. No floating-point quadrature or uncertified infinite-tail substitution is used. The replay reproduced

\[
\det J\in[7.773061491088037\times10^{-5},
           9.653359868893574\times10^{-5}].
\]

The matrix is strictly positive definite. This is an enclosure for the first two odd Taylor features, not full odd-sector positivity or a formal proof-assistant verification.

## 1. Arithmetic and derivative recurrence

The theta series is represented as

\[
\kappa(u)=e^{u/4}\sum_{n\ge1}e^{-v_n}P_0(v_n),
\qquad v_n=\pi n^2e^u,\quad P_0(v)=2v^2-3v.
\]

Differentiation gives exactly

\[
P_{j+1}(v)=(1/4-v)P_j(v)+vP_j'(v).
\]

The recurrence coefficients are stored as exact `Fraction` values before conversion to intervals. All critical arithmetic uses interval numbers, exact integers or exact fractions. Python binary floats appear only in the final displayed endpoint conversion, where each converted endpoint is widened by one IEEE ulp. The determinant assertions are made on the original interval object before that conversion.

## 2. Uniform omitted-series estimate

For `v>=1`, the coefficient sum gives

\[
|P_j(v)|\le C_jv^{j+2}.
\]

Hence the `n`-th absolute derivative envelope is

\[
C_j\pi^{j+2}n^{2j+4}
e^{(j+9/4)u-\pi n^2e^u}.
\]

For omitted `n>=5` and `0<=j<=5`, this decreases for every `u>=0`, since `pi*25>j+9/4`. The ratio of successive envelopes at `u=0` is bounded by its value at `n=5`; both the power ratio and exponential factor decrease with `n`. Thus the geometric bound used by the code covers every omitted term and all `u>=0`. Adding a symmetric interval of that magnitude to each truncated derivative is valid.

## 3. Midpoint remainder

For `g=kappa^(j)` and `f(u)=u*g(u)^2`,

\[
f''(u)=4g(u)g'(u)+2u\bigl(g'(u)^2+g(u)g''(u)\bigr).
\]

The code evaluates this expression over each whole subinterval with omitted-series bounds already included. Multiplication by `h³/24` therefore supplies a valid composite-midpoint error allowance. Interval dependency enlarges the enclosure; it does not invalidate it. The midpoint value also includes the derivative-series remainder.

## 4. Infinite moment tails

For `u>=R=3`, the `n`-term envelope ratio is bounded by

\[
q_j=2^{2j+4}e^{-3\pi e^R}<1/2.
\]

Therefore the complete derivative satisfies

\[
|\kappa^{(j)}(u)|
\le2C_j\pi^{j+2}e^{(j+9/4)u-\pi e^u}.
\]

Writing `u=R+v` and using `e^v>=1+v` gives the stated positive rate

\[
\lambda_j=2\pi e^R-(2j+9/2)>0.
\]

Integrating the resulting bound for `u|kappa^(j)(u)|²` produces exactly

\[
(2C_j\pi^{j+2})^2
e^{(2j+9/2)R-2\pi e^R}
\left(\frac R{\lambda_j}+\frac1{\lambda_j^2}\right).
\]

This covers the whole positive tail, not a finite tail probe. Its nonnegative contribution is added as an interval from zero to the upper bound.

## 5. Independent check of the jet coefficients

Let `I_j=integral_0^infinity u[kappa^(j)(u)]²du`, `k0=kappa(0)` and `k2=kappa''(0)`. Differentiating the original cutoff kernel and integrating by parts gives

\[
J=\begin{pmatrix}
4I_1-2k_0^2&-(2I_2+k_0k_2)/3\\
-(2I_2+k_0k_2)/3&I_3/9-k_2^2/6
\end{pmatrix}.
\]

For example, the coefficient of `xy³` is

\[
\frac23\int_0^\infty u\kappa'\kappa'''du
+\frac13\int_0^\infty\kappa\kappa'''du
+\int_0^\infty\kappa'\kappa''du
=-\frac{2I_2+k_0k_2}{3}.
\]

Evenness gives `kappa'(0)=0`, and rapid decay removes the infinite boundary terms. This independently checks the sign and factorial normalization.

The same formulas were checked by exact rational Gaussian moments against the control kernel
`(1+u²/10+u⁴/300)e^-u²`. They give

\[
J_{\mathrm{control}}=
\begin{pmatrix}121/30000&-37/10000\\-37/10000&61/18000\end{pmatrix},
\quad
\det J_{\mathrm{control}}=-29/1350000000,
\]

matching the independently derived exact odd-kernel determinant after the triangular Taylor-feature change.

## 6. Correct local two-node consequence

The corollary requires **strict positive definiteness**, not merely semidefiniteness. That strict hypothesis is certified here.

By symmetry and local analyticity, write

\[
H_-(x,y)=xy\,G(x^2,y^2),
\]

with real symmetric analytic `G`. Its first coefficient block is `J`:

\[
G(X,Y)=a+b(X+Y)+cXY+d(X^2+Y^2)+\cdots,
\quad J=\begin{pmatrix}a&b\\b&c\end{pmatrix}.
\]

Define

\[
D(X,Y)=G(X,X)G(Y,Y)-G(X,Y)^2.
\]

It vanishes to second order along `X=Y`: the value is zero, and symmetry makes the first transverse derivative zero. Hence

\[
D(X,Y)=(X-Y)^2S(X,Y),
\qquad S(0,0)=ac-b^2=\det J>0.
\]

The quotient `S` extends continuously (indeed analytically) to the diagonal. Since `a>0`, continuity gives a neighborhood in which `G(X,X)>0` and `S(X,Y)>0`. Therefore, for every pair of distinct positive nodes `x,y` in a sufficiently small neighborhood of zero,

\[
\det\begin{pmatrix}H_-(x,x)&H_-(x,y)\\H_-(y,x)&H_-(y,y)\end{pmatrix}
=x^2y^2(x^2-y^2)^2S(x^2,y^2)>0.
\]

Together with the positive diagonal this proves positive definiteness of each such two-node odd Gram. It does not provide an explicit neighborhood radius, positivity for zero nodes, all-node positivity, or positivity for arbitrary numbers of nodes. Those stronger claims would require additional estimates.
