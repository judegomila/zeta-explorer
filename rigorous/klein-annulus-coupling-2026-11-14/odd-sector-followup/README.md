# Oscillatory odd inputs: a certified local result and exact limits

Research continuation, 14 November 2026, using the same actual theta normalization and cutoff operator as the [parent comparison](../README.md). The cutoff is translated to zero and the scale is `alpha=1`; every positive `alpha` rescales the operator without changing positivity.

**Later extension:** the [quantitative continuation](../odd-sector-extension/README.md) supplies the previously missing explicit radius: `1/200` for two odd nodes. It additionally certifies the third and fourth Taylor blocks, an explicit `1/100000` radius for every configuration of up to four odd nodes, and the exact all-order continuation criterion. The existential statements and scope below describe this earlier checkpoint.

## Main result

An outward-rounded interval calculation proves that the first two odd Taylor features of the actual theta cutoff kernel have a strictly positive coefficient matrix. Analyticity then proves that **every two-node odd Gram matrix at distinct positive nodes sufficiently close to the cutoff is positive definite**, including arbitrary complex or sign-changing coefficients.

This moves beyond the earlier constant-phase positive cone. It gives an existence neighborhood, without an explicit numerical radius. It does not establish positivity for arbitrary node counts, all oscillatory inputs, the regularized box pulse, the uniform bridge residual, or RH.

Two structural results define the remaining difficulty. Strong convexity of the theta-type envelope alone is insufficient, as an exact comparison kernel shows. For the actual infinite-dimensional Mellin cutoff operator, positivity of either complete parity sector is itself equivalent to RH. The latter statement concerns the entire operator and must not be confused with any previously certified finite even block.

## 1. The actual theta certificate

Let

\[
I_j=\int_0^\infty r[\kappa^{(j)}(r)]^2\,dr,
\qquad k_0=\kappa(0),\quad k_2=\kappa''(0).
\]

For the odd half-line kernel `H_-(x,y)=H_0(x,y)-H_0(x,-y)`, the coefficient matrix on the first odd monomials `(x,x^3)` is exactly

\[
J=\begin{pmatrix}
4I_1-2k_0^2&-(2I_2+k_0k_2)/3\\
-(2I_2+k_0k_2)/3&I_3/9-k_2^2/6
\end{pmatrix}.
\]

The calculation encloses

\[
J_{11}\in[0.0217486262211940,\;0.0217805822064087]
\]

and, with endpoints widened outward,

\[
\boxed{\det J\in[0.00007773061491088037,\;
0.00009653359868893574]>0.}
\]

Thus `J` is strictly positive definite. The implementation uses 40-digit interval arithmetic, four theta terms, 512 midpoint subintervals on `[0,3]`, exact rational derivative polynomials, explicit bounds for all omitted theta terms, and a bound for the entire infinite moment tail. Adaptive quadrature estimates are not used in this certificate. Its trust basis is the stated mpmath 1.3.0 interval implementation and the elementary analytic bounds, rather than formal proof-assistant verification.

To obtain a neighborhood theorem, write the symmetric analytic odd kernel as

\[
H_-(x,y)=xy\,G(x^2,y^2),
\qquad
G(X,Y)=a+b(X+Y)+cXY+d(X^2+Y^2)+\cdots.
\]

The first coefficient block is `J=[[a,b],[b,c]]`. Symmetry and diagonal vanishing give the analytic factorization

\[
G(X,X)G(Y,Y)-G(X,Y)^2=(X-Y)^2S(X,Y),
\qquad S(0,0)=\det J>0.
\]

Continuity, together with `a>0`, supplies a `delta>0` such that every pair of distinct `0<x,y<delta` has a positive-definite odd Gram. Factoring out `(X-Y)^2` also handles pairs that are arbitrarily close to each other. This is a two-node theorem in the odd sector, equivalently four full-kernel centers `-y,-x,x,y` with antisymmetric coefficients. It is not unrestricted four-center positivity or positivity for all functions supported near zero.

Derivation and complete bounds: [numerical and analytic audit](numeric/ODD-OSCILLATION-AUDIT.md), sections 3–4. Independent replay and mathematical review: [interval-review.md](interval-review.md). Machine-readable certificate: [theta-odd-jet-interval.json](numeric/theta-odd-jet-interval.json).

## 2. Why stronger convexity alone does not finish the proof

The exact comparison kernel

\[
k(u)=(1+u^2/10+u^4/300)e^{-u^2}
\]

is positive and even, and satisfies strict convexity of `-log k(sqrt(t))`. Its odd half-line kernel has strictly positive entries. Nevertheless, the smooth sign-changing input

\[
p(x)=xe^{-x^2}(65-84x^2),\qquad x>0,
\]

has the exact negative energy

\[
\langle p,H_-p\rangle=-\frac{29\pi}{960000}<0.
\]

The obstruction survives the explicit perturbation `k(u) exp(-10^-9 cosh(u))`. That perturbed kernel retains the strict convexity, has double-exponential decay, and has a Laplace transform of exactly order one; its witness energy is still strictly below `-97/1600000`. Thus these broad envelope properties cannot replace the missing theta-specific estimate. These are comparison kernels, not counterexamples to the xi function or RH.

The [exact derivation](factorization.md) and [symbolic replay](factorization_audit.py) include the closed finite feature matrix, a two-node witness, a smooth witness, and the perturbation bounds.

There is also a useful positive comparison family. For `k(u)=exp(-a u^4-b u^2)`, `a>0`, the actual odd kernel has a positive integral expansion in odd-power features, so all oscillatory odd tests have nonnegative energy. The exact expansion appears in the [audit](numeric/ODD-OSCILLATION-AUDIT.md). Transferring that factorization to actual theta still requires a controlled remainder.

## 3. The complete odd-sector target is already RH-equivalent

Set

\[
F(z)=\xi(1/2+z),\qquad f(t)=F(it)=G(t^2),
\qquad \varphi(z)=-G'(z)/G(z),\quad\psi(z)=z\varphi(z).
\]

Here `G` denotes the entire function of the squared spectral variable, independently of the local two-variable function in section 1. Under the specified unitary Fourier transform the exact parity kernels are

\[
C_-(t,s)=\frac{4\alpha}{\pi}\,tsf(t)f(s)
\frac{\varphi(t^2)-\varphi(s^2)}{t^2-s^2},
\]

\[
C_+(t,s)=\frac{4\alpha}{\pi}\,f(t)f(s)
\frac{\psi(t^2)-\psi(s^2)}{t^2-s^2}.
\]

The apparent diagonal singularities are removable. Local invertible diagonal congruence reduces either full-sector positivity question to all-order positivity of a Löwner divided-difference kernel. The classical one-variable Löwner theorem gives a Pick-function extension. Uniqueness of analytic continuation excludes nonreal zeros of `G`; positivity of the theta kernel excludes its nonpositive real zeros. Conversely, RH gives exact positive Gram expansions through the genus-zero product of `G`.

The result is

\[
\boxed{\mathrm{RH}\ \Longleftrightarrow\ H\text{ is positive on all odd inputs}
\ \Longleftrightarrow\ H\text{ is positive on all even inputs}.}
\]

The [operator derivation](operator-duality.md) supplies the Fourier normalization, half-line factors, squared-variable Jacobian, finite-matrix passage, analytic continuation argument, converse factorization, and controls. The external theorem used is Theorem 1.5 in Agler, McCarthy and Young, [*Operator monotone functions and Löwner functions of several variables*](https://annals.math.princeton.edu/wp-content/uploads/annals-v176-n3-p07-p.pdf), *Annals of Mathematics* 176 (2012), p. 1785. No novelty claim is made for this research reduction.

## 4. Seven-node numerical evidence

For `x_j=0.15j`, `j=1,...,7`, the normalized odd Gram has the high-precision smallest eigenvalue

\[
\lambda_{\min}\approx4.65841625815219469581900622128845\times10^{-14}.
\]

This resolves the earlier double-precision ambiguity numerically. Runs at 45 and 70 digits agree in that eigenvalue within `4.41e-47`. Explicit theta-series and infinite-tail bounds are much smaller than the displayed eigenvalue, but the integration uses non-interval quadrature. This remains finite numerical evidence, distinct from the interval certificate in section 1.

## Reproduction and review record

From this directory, with [requirements.txt](requirements.txt) installed:

```sh
python3 factorization_audit.py
python3 numeric/theta-odd-jet-interval.py
python3 numeric/theta-odd-high-precision.py
python3 numeric/theta-odd-confluent.py
```

The first two commands reproduce the exact comparison identities and the certified theta jet. They were replayed successfully by the integrating reviewer; the interval script was also independently replayed and its remainder bounds checked. The latter two commands reproduce the finite high-precision diagnostics. Their saved outputs are included with their distinct error-scope labels. Scripts write JSON beside themselves.

The next quantitative step would be to bound the analytic determinant remainder and obtain an explicit local radius. Arbitrary-order positivity still requires additional theta-specific structure; the exact counterexample rules out convexity alone as that structure.
