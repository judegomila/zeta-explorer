# Sharp finite-tilt transport of the actual cubic reserve

## Result and scope

For the complete theta profile, the full normalized endpoint cubic reserve
transports unchanged along the actual exponential-tilt path:

\[
 \boxed{s_3'(a)\geq\sigma _3,
 \qquad {s_3(a)\over a}\geq\sigma _3>{14487\over25}=579.48,
 \qquad 0<a\leq {1\over4}.}                              \tag{1}
\]

Here `sigma_3=s_3'(0)` is the directed lower bound independently certified in
`MODULAR_N2_ENDPOINT_PAYMENT_INDEPENDENT_AUDIT_20261103.md`.  This replaces
the coarse transported floor `s_3/a>14739/200` by the actual endpoint Schur
reserve.  It does **not** yet prove the finite-tilt modular payment: the sole
remaining scalar is

\[
 {\kappa _2(a)\over a}Q_2^-(a)<{14487\over25}.           \tag{2}
\]

Nothing here proves a higher-degree statement, an all-degree theorem, or RH.

## 1. Coefficient-free cubic derivative

Put `g_a(u)=exp(au)psi(u)` and let the actual degree-three real spectral
polynomial be

\[
 p_3(t;a)=t^3-\alpha(a)t,
 \qquad \alpha(a)=b_1(a)+b_2(a).                         \tag{3}
\]

The already audited positive prefix through degree two makes `alpha(a)`
well-defined throughout `0<a<=1/4`.  The general pivot-transport identity
kills every derivative of the inverse-selected coefficient and gives

\[
 s_3'(a)={h_{g_a}[p_3]\over2\pi}.                        \tag{4}
\]

Write

\[
 X=-\ell'',\quad B=\ell^{(4)}+6X^2,\quad
 D=-\ell^{(6)}+30X\ell^{(4)}+60X^3,\quad P=XD-B^2,
 \qquad \ell=\log\psi .                                 \tag{5}
\]

The complete-theta `H3` theorem proves `X>17` and `P>8X^4`.  The exact local
completion from the integrated-square audit is

\[
 L_\alpha(h):={D\over32}-{\alpha B\over4}
                    +{\alpha^2X\over2}
 ={P\over32X}+{X\over2}
       \left({B\over4X}-\alpha\right)^2>0.               \tag{6}
\]

All functions in (5)--(6) are even.  The normalization in the frozen square
identity is `h[p]/(4pi)=integral u^2 g^2 L_alpha du`; combining it with (4)
and pairing the two physical halflines gives the exact factor-safe formula

\[
 \boxed{
 s_3'(a)=4\int_0^\infty h^2\cosh(2ah)\psi(h)^2
                         L_{\alpha(a)}(h)\,dh.}           \tag{7}
\]

No coefficient derivative, next-pivot denominator, or frozen-polynomial
surrogate occurs in (7).

## 2. Monotone minimum argument

For a real trial coefficient `alpha`, define

\[
 J_a(\alpha)=4\int_0^\infty h^2\cosh(2ah)\psi^2
                                      L_\alpha\,dh.       \tag{8}
\]

Since `L_alpha>0` pointwise and `cosh(2ah)>=1`,

\[
 J_a(\alpha)\geq J_0(\alpha)\qquad\hbox{for every real }\alpha. \tag{9}
\]

Let

\[
 M_j=\int_{\mathbb R}u^2\psi(u)^2g_j(u)\,du,
 \quad g_1={X\over2},\quad g_2={B\over8},\quad g_3={D\over32}.
                                                                    \tag{10}
\]

Then

\[
 J_0(\alpha)=2\{M_3-2\alpha M_2+\alpha^2M_1\}.          \tag{11}
\]

The positive endpoint old pivot has `M_1>0`, so exact completion gives

\[
 \min_{\alpha\in\mathbb R}J_0(\alpha)
 =2\left(M_3-{M_2^2\over M_1}\right)=\sigma _3,         \tag{12}
\]

with minimizer `alpha_0=M_2/M_1`.  This is also the actual endpoint Schur
stationarity relation, because the endpoint pivot formulas give

\[
 \bar b_1+\bar b_2={M_1\over M_0}
 +{M_2-M_1^2/M_0\over M_1}={M_2\over M_1}.              \tag{13}
\]

Applying (9)--(13) to the actual, otherwise arbitrary
`alpha(a)` in (7) proves

\[
 s_3'(a)=J_a(\alpha(a))
 \geq J_0(\alpha(a))
 \geq\min_\alpha J_0(\alpha)=\sigma _3.                 \tag{14}
\]

The raw odd bridge pivot satisfies `s_3(0)=0`.  Integrating (14) from zero
proves the first two inequalities in (1); the final rational inequality is
the frozen directed endpoint certificate.

## 3. Exact remaining finite-tilt target

The exact modular coefficient and negative-side energy remain

\[
 {\kappa _2(a)\over a}
 =8+{36a^2\over b_2}
 +{(4a^2-2b_1+b_2)^2\over b_1b_2},
\]

\[
 Q_2^-(a)=\int_0^\infty h e^{-2ah}\psi^2
 \bigl((a+v)^2-v'+b_1\bigr)^2dh.                        \tag{15}
\]

Consequently (2), using only the current positive prefix, is now sufficient
for `s_3>=kappa_2 Q_2^-` on the full campaign interval.  The transport result
does not assert (2), monotonicity of `Q_2^-`, or monotonicity of the product.

## Reproduction

The companion standard-library replay checks the two cleared polynomial
completions, the factors in (7), the endpoint rational lower bound, and hashes
of every frozen analytic input used above:

```text
python3 workstreams/all-degree-analytic-search-next-v1/src/verify_modular_n2_sharp_cubic_transport_20261103.py \
  --root . \
  --output workstreams/all-degree-analytic-search-next-v1/results/modular_n2_sharp_cubic_transport_20261103.json
```

The replay checks exact algebra and source binding.  It performs no
quadrature or parameter sweep and is not a formal proof-assistant
development.
