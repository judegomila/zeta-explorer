# Fixed-even endpoint-null Bernoulli prime-quadrature bound

## 0. Exact outcome and claim boundary

Put

\[
 B_2(x)=\{x\}^2-\{x\}+{1\over6},\qquad
 g_A(t)=e^{-t}B_2(Ae^t){\bf1}_{t\geq0},
\]

\[
 C_A(y)=(g_A*g_A)(y),\qquad
 h_A(y)=C_A'(y)-C_A(y),
\]

and

\[
 \delta_*(x)=1-e^{-x}\psi_C(e^x)
 -{1\over2}e^{-x}\log(1-e^{-2x}).
\]

This note closes the quantitative scalar barrier left in
`FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md`.  For every
`A>1`, define

\[
 \mathcal M_{11,A}
 =\int_0^\infty\delta_*(\log A+y)h_A(y)\,dy.       \tag{0.1}
\]

There are explicit absolute constants `K_+` and `K_-` such that

\[
 \boxed{
 |C_A(y)|\leq K_+A^{-1/2}e^{-5y/4}
                  +K_-A^{-1}e^{-3y/2}\quad(y\geq0),}    \tag{0.2}
\]

where

\[
 K_+={3\zeta(9/4)^2\over\pi^{9/2}},\qquad
 K_-={\zeta(5/2)^2\over\pi^5}.                          \tag{0.3}
\]

The scalar has the exact prime-quadrature form

\[
\boxed{
\begin{split}
 \mathcal M_{11,A}
 ={}&-\int_0^\infty C_A(y)\,dy
 +\sum_{n>A}{\Lambda(n)\over n}
       C_A\!\left(\log{n\over A}\right)+R_{\rm ar}(A),\\
 R_{\rm ar}(A)
 ={}&A^{-3}\int_0^\infty
 {e^{-3y}C_A(y)\over1-A^{-2}e^{-2y}}\,dy.
\end{split}}                                             \tag{0.4}
\]

If the admitted all-range Chebyshev bound is written

\[
 \psi_C(x)\leq C_\psi x,                                \tag{0.5}
\]

then (0.2)--(0.5) give the fully explicit estimate

\[
\boxed{
\begin{split}
 |\mathcal M_{11,A}|
 \leq{}&{9C_\psi\over5}K_+A^{-1/2}
       +{5C_\psi\over3}K_-A^{-1}\\
 &+{\zeta(3)^2\over\pi^6}A^{-2}
       +{A^{-3}\over576(1-A^{-2})}.
\end{split}}                                             \tag{0.6}
\]

On the locked schedule

\[
 A=\lambda^2={p^2\over4}\in\mathbb Z+{1\over4},
 \qquad p\geq5\text{ odd},                              \tag{0.7}
\]

this proves

\[
 \boxed{\mathcal M_{11,A}=O(\lambda^{-1}).}             \tag{0.8}
\]

Thus the isolated reflected `B_2--B_2` term, whose coefficient is
`8*pi^3*lambda+o(lambda)`, is bounded at the own-defect normalization.
No PNT cancellation is needed for that boundedness statement.

Equation (0.8) does **not** give a limit or a sign.  The exact reduction
(0.4) is a signed prime quadrature error, and (0.6) takes absolute values.
After Fourier expansion, its same-sign stationary phases contain weighted
von Mangoldt sums with phase

\[
 e\!\left(\mathord\pm p\sqrt{|k\ell|n}\right),
 \qquad e(x)=e^{2\pi ix}.                                \tag{0.9}
\]

The admitted Chebyshev and PNT envelopes do not provide a signed
asymptotic for those sums.  Therefore this note proves no signed floor, no
positive or negative limiting constant, and no statement about the
complete post-sum physical outer state.  Other endpoint orders, complete
Volterra cancellation, the growing rest, the physical high complement,
the low/high reduction, equation (5.2) of `DIRECT_RH_ATTACK.md`, and RH all
remain open.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies and conventions

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md` | `c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b` |
| `notes/OUTER_OUTER_SPECTRAL_SAMPLING_REDUCTION.md` | `49568daabe36c6507f7b366c53f784f29f9b7807284c738b80f5b016600f354b` |
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |

Here

\[
 \psi_C(x)=\sum_{2\leq n\leq x}\Lambda(n)
\]

is right-continuous.  The admitted FKS envelope implies (0.5) for every
`x>=1`, with

\[
 C_\psi=1+9.22022
 \left({3\over0.8476836}\right)^3e^{-3}.                 \tag{1.1}
\]

Only the linear consequence (0.5) is used below.  In particular, the
subexponential PNT error is not used.

The periodic Bernoulli function `B_2` is continuous at the integers and is
globally Lipschitz.  Hence `g_A` is locally absolutely continuous and
`C_A` is locally absolutely continuous.  Also

\[
 |g_A(t)|\leq{e^{-t}\over6},\qquad
 |C_A(y)|\leq{ye^{-y}\over36}.                           \tag{1.2}
\]

These facts justify all finite-interval differentiations.  Infinite limits
will be justified by the stronger estimate (0.2).

## 2. Two elementary oscillatory-integral lemmas

Two explicit versions of the van der Corput argument will be used.

If a real `C^2` phase `phi` has monotone derivative on an interval and
`|phi'|>=rho>0`, integration by parts gives

\[
 \left|\int e^{i\phi(t)}\,dt\right|\leq{4\over\rho}.     \tag{2.1}
\]

Indeed the two endpoint terms cost at most `2/rho`, and the total variation
of `1/phi'` costs at most another `2/rho`.  The constant is deliberately
slack.

If instead `|phi''|>=rho>0`, then `phi''` has one sign and `phi'` is
monotone.  The set where `|phi'|<=sqrt(rho)` is an interval of length at
most `2/sqrt(rho)`.  Its complement has at most two intervals, to each of
which (2.1) applies.  Therefore

\[
 \left|\int e^{i\phi(t)}\,dt\right|
 \leq{12\over\sqrt\rho}.                                \tag{2.2}
\]

Both bounds remain true for a zero-length interval.  Thus they are uniform
as `y` tends to zero in the applications below.

## 3. Fourier proof of the correlation bound

The absolutely and uniformly convergent Fourier series is

\[
 B_2(x)={1\over2\pi^2}
 \sum_{k\in\mathbb Z\setminus\{0\}}{e(kx)\over k^2}.
                                                               \tag{3.1}
\]

Since

\[
 C_A(y)=e^{-y}\int_0^y
 B_2(Ae^t)B_2(Ae^{y-t})\,dt,                             \tag{3.2}
\]

absolute convergence permits termwise integration.  For nonzero integers
`k,l`, put

\[
 I_{k\ell}(A,y)=\int_0^y
 e\!\left(A(ke^t+\ell e^{y-t})\right)\,dt.              \tag{3.3}
\]

### 3.1 Same-sign frequencies

If `k*l>0`, the phase

\[
 \phi(t)=2\pi A(ke^t+\ell e^{y-t})
\]

has a second derivative of constant sign and

\[
 |\phi''(t)|
 \geq4\pi A|k\ell|^{1/2}e^{y/2}.                        \tag{3.4}
\]

Equation (2.2) gives

\[
 |I_{k\ell}(A,y)|
 \leq {6\over\sqrt\pi}
 A^{-1/2}|k\ell|^{-1/4}e^{-y/4}.                        \tag{3.5}
\]

This covers an interior stationary point as well as the cases where that
point lies outside `[0,y]`.

### 3.2 Opposite-sign frequencies

If `k*l<0`, then

\[
 |\phi'(t)|
 \geq4\pi A|k\ell|^{1/2}e^{y/2}.                        \tag{3.6}
\]

The derivative is monotone on each side of at most one point, because
`phi''` has at most one zero.  Split there and apply (2.1) twice.  This
gives

\[
 |I_{k\ell}(A,y)|
 \leq {2\over\pi}A^{-1}|k\ell|^{-1/2}e^{-y/2}.          \tag{3.7}
\]

### 3.3 Summing all quadrants

The same-sign and opposite-sign coefficient sums are

\[
 \sum_{k\ell>0}|k\ell|^{-9/4}=2\zeta(9/4)^2,
 \qquad
 \sum_{k\ell<0}|k\ell|^{-5/2}=2\zeta(5/2)^2.           \tag{3.8}
\]

Insert (3.5)--(3.8) into (3.1)--(3.3), including the Fourier prefactor
`1/(4*pi^4)` and the exterior factor `e^(-y)`.  The result is exactly
(0.2)--(0.3).  In particular,

\[
 C_A(y)\longrightarrow0,qquad
 \int_0^\infty|C_A(y)|\,dy
 \leq {4K_+\over5}A^{-1/2}+{2K_-\over3}A^{-1}.          \tag{3.9}
\]

No fractional-part property of `A` entered this estimate.

There is a sharper estimate for the continuous term in (0.4).  Fubini's
theorem and the convolution identity give

\[
 \boxed{
 \int_0^\infty C_A(y)\,dy
 =\left(\int_0^\infty g_A(t)\,dt\right)^2.}              \tag{3.10}
\]

The periodic mean of `B_2` is zero.  More quantitatively, changing variables
`x=Ae^t` in the inner integral and using (3.1) gives

\[
 \int_0^\infty g_A(t)\,dt
 ={A\over2\pi^2}\sum_{k\ne0}{1\over k^2}
       \int_A^\infty {e(kx)\over x^2}\,dx.              \tag{3.11}
\]

One integration by parts in each Fourier mode proves

\[
 \left|\int_A^\infty {e(kx)\over x^2}\,dx\right|
 \leq {1\over\pi|k|A^2}.                                \tag{3.12}
\]

Consequently

\[
 \left|\int_0^\infty g_A(t)\,dt\right|
 \leq{\zeta(3)\over\pi^3A},\qquad
 0\leq\int_0^\infty C_A(y)\,dy
 \leq{\zeta(3)^2\over\pi^6A^2}.                        \tag{3.13}
\]

Thus the Lebesgue part of the quadrature discrepancy is `O(A^(-2))`; the
target-scale `A^(-1/2)` term in (0.6) comes only from the prime measure
after absolute values are taken.

## 4. Exact prime-quadrature identity

Write

\[
 F_A(y)=e^{-y}C_A(y).
\]

At almost every `y`,

\[
 F_A'(y)=e^{-y}h_A(y).                                   \tag{4.1}
\]

First, since `C_A(0)=0`, (3.9) gives

\[
 \int_0^\infty h_A(y)\,dy
 =-\int_0^\infty C_A(y)\,dy.                            \tag{4.2}
\]

For the prime term, truncate at a `Y` for which `X=Ae^Y` is not a prime
power.  Lebesgue--Stieltjes integration by parts, using the
right-continuous convention for `psi_C`, gives

\[
\begin{split}
 -{1\over A}\int_0^Y\psi_C(Ae^y)F_A'(y)\,dy
 ={}&-{\psi_C(X)\over A}F_A(Y)\\
 &+{1\over A}\sum_{A<n<X}\Lambda(n)
 F_A\!\left(\log{n\over A}\right).
\end{split}                                              \tag{4.3}
\]

There is no lower Chebyshev atom on the locked schedule because
`A` lies in `Z+1/4`.  More generally, even if `A` is an integer prime
power, its possible endpoint contribution is multiplied by
`F_A(0)=C_A(0)=0` and therefore vanishes.  The boundary atom `B_2(A)delta_0`
which appears when the zero-extended `g_A` is differentiated is already
contained in `h_A`; it creates no additional term here because the
self-convolution still has `C_A(0)=0`.  Since

\[
 {\psi_C(X)\over A}F_A(Y)
 ={\psi_C(X)\over X}C_A(Y),                              \tag{4.4}
\]

equations (0.2) and (0.5) show that the boundary term tends to zero.
Moreover,

\[
 {1\over A}F_A\!\left(\log{n\over A}\right)
 ={1\over n}C_A\!\left(\log{n\over A}\right).         \tag{4.5}
\]

The resulting infinite prime series is absolutely convergent by Section
5.  Thus the first two terms in (0.4) follow from (4.2)--(4.5).

For the remaining logarithm, let

\[
 q_A(y)=\log(1-A^{-2}e^{-2y}),
 \qquad
 q_A'(y)={2A^{-2}e^{-2y}\over1-A^{-2}e^{-2y}}.           \tag{4.6}
\]

Both boundary terms in integration by parts against `F_A'` vanish.
Therefore

\[
 -{1\over2A}\int_0^\infty q_A(y)F_A'(y)\,dy
 =A^{-3}\int_0^\infty
 {e^{-3y}C_A(y)\over1-A^{-2}e^{-2y}}\,dy,               \tag{4.7}
\]

which is the asserted `R_ar(A)`.  The crude bound (1.2) gives

\[
 |R_{\rm ar}(A)|
 \leq {A^{-3}\over36(1-A^{-2})}
       \int_0^\infty ye^{-4y}\,dy
 ={A^{-3}\over576(1-A^{-2})}.                           \tag{4.8}
\]

This completes the exact derivation of (0.4), including every boundary and
prime-jump term.

## 5. Chebyshev summation closes the required scale

For every `beta>0`, Stieltjes partial summation and (0.5) give

\[
\begin{split}
 T_\beta(A)
 &:=\sum_{n>A}{\Lambda(n)\over n}
       \left({n\over A}\right)^{-\beta}\\
 &=A^\beta\int_{(A,\infty)}x^{-1-\beta}\,d\psi_C(x)\\
 &\leq C_\psi{1+\beta\over\beta}.
\end{split}                                              \tag{5.1}
\]

The omitted lower-boundary contribution is nonpositive.  In particular,

\[
 T_{5/4}(A)\leq{9C_\psi\over5},
 \qquad
 T_{3/2}(A)\leq{5C_\psi\over3}.                         \tag{5.2}
\]

Use (0.2) in the prime series of (0.4), (3.13) in its continuous term, and
(4.8) in its archimedean term.  Equations (5.1)--(5.2) then give (0.6).
Since `A^(-1/2)=lambda^(-1)` on (0.7), equation (0.8) follows.

This argument is cancellation-preserving only up to the exact quadrature
identity (0.4); the final estimate is an absolute one.  Its gain comes from
oscillation inside the Bernoulli self-convolution, not from cancellation
between primes and the continuous main term.

## 6. The remaining sign obstruction

Substitution of (3.3) into the prime term of (0.4) gives the exact series

\[
 {1\over4\pi^4}
 \sum_{k,\ell\ne0}{1\over k^2\ell^2}
 \sum_{n>A}{\Lambda(n)\over n}{A\over n}
 I_{k\ell}\!\left(A,\log{n\over A}\right).             \tag{6.1}
\]

For `k*l>0`, an interior critical point has phase value

\[
 2\,\operatorname {sgn}(k)\sqrt{|k\ell|An}.             \tag{6.2}
\]

On the locked schedule (0.7), this becomes

\[
 \operatorname {sgn}(k)p\sqrt{|k\ell|n},                \tag{6.3}
\]

which is the phase displayed in (0.9).  A signed limit at the scale
`A^(-1/2)` would require a uniform asymptotic, or enough cancellation to
make every such contribution smaller, in the von Mangoldt sums generated
by (6.1).  The scalar upper bound `psi_C(x)<=C_psi*x` has no phase
information.  The admitted pointwise PNT discrepancy also does not supply
this nonlinear exponential-sum theorem.

Consequently the strongest unconditional conclusion established here is
boundedness of the isolated normalized term.  Its sign, convergence, and
interaction with the other complete arithmetic channels remain open.
