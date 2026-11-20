# Fixed-endpoint Bernoulli matrix quadrature and jet-growth theorem

## 0. Exact outcome and claim boundary

For an integer `q>=1`, let

\[
 \widetilde B_q(x)=B_q(\{x\}),                           \tag{0.1}
\]

where `\widetilde B_1(n)=0` at the integers.  Thus the physical
sawtooth is

\[
 P(x)={1\over2}-\{x\}=-\widetilde B_1(x)                 \tag{0.2}
\]

away from the integers.  For `A>1`, define

\[
 g_{q,A}(t)=e^{-(q-1)t}\widetilde B_q(Ae^t){\bf1}_{t\geq0},
 \qquad
 C_{q,r;A}=g_{q,A}*g_{r,A}.                              \tag{0.3}
\]

Put

\[
 d=\min(q,r),\qquad
 \alpha_d=d-{3\over4},\qquad
 \beta_d=d-{1\over2},                                   \tag{0.4}
\]

and

\[
\begin{aligned}
 K^+_{q,r}
 &= {12q!r!\over(2\pi)^{q+r}\sqrt\pi}
    \zeta\!\left(q+{1\over4}\right)
    \zeta\!\left(r+{1\over4}\right),\\
 K^-_{q,r}
 &= {4q!r!\over\pi(2\pi)^{q+r}}
    \zeta\!\left(q+{1\over2}\right)
    \zeta\!\left(r+{1\over2}\right).
                                                               \tag{0.5}
\end{aligned}
\]

The first theorem of this note is the uniform-in-`y` fixed-order bound

\[
\boxed{
 |C_{q,r;A}(y)|
 \leq K^+_{q,r}A^{-1/2}e^{-\alpha_dy}
      +K^-_{q,r}A^{-1}e^{-\beta_dy}
 \qquad(y\geq0).}                                      \tag{0.6}
\]

This includes `q=r=1`.  The conditional Fourier series of the sawtooth
causes no loss: after van der Corput the same-sign coefficient sum is a
`zeta(5/4)^2` sum and the opposite-sign sum is a `zeta(3/2)^2` sum.

Retain the combined arithmetic kernel

\[
 \delta_*(x)=1-e^{-x}\psi_C(e^x)
 -{1\over2}e^{-x}\log(1-e^{-2x})                         \tag{0.7}
\]

and define the improper scalar

\[
 \mathcal Q_{q,r;A}
 =\lim_{Y\to\infty}\int_0^Y\delta_*(\log A+y)
 \{C_{q,r;A}'(y)-C_{q,r;A}(y)\}\,dy.                   \tag{0.8}
\]

The limit exists and has the exact prime-quadrature form

\[
\boxed{
\begin{aligned}
 \mathcal Q_{q,r;A}
 ={}&-\int_0^\infty C_{q,r;A}(y)\,dy
 +\sum_{n>A}{\Lambda(n)\over n}
 C_{q,r;A}\!\left(\log{n\over A}\right)\\
 &+A^{-3}\int_0^\infty
 {e^{-3y}C_{q,r;A}(y)\over1-A^{-2}e^{-2y}}\,dy.
                                                               \tag{0.9}
\end{aligned}}
\]

Let

\[
 J_q={2q!\zeta(q+1)\over\pi(2\pi)^q}.                  \tag{0.10}
\]

If `psi_C(x)<=C_psi*x` for `x>=1`, then

\[
\boxed{
\begin{aligned}
 |\mathcal Q_{q,r;A}|
 \leq{}&C_\psi{1+\alpha_d\over\alpha_d}
 K^+_{q,r}A^{-1/2}
 +C_\psi{1+\beta_d\over\beta_d}
 K^-_{q,r}A^{-1}\\
 &+J_qJ_rA^{-2}\\
 &+{A^{-3}\over1-A^{-2}}
 \left\{
 {K^+_{q,r}A^{-1/2}\over\alpha_d+3}
 +{K^-_{q,r}A^{-1}\over\beta_d+3}
 \right\}.
                                                               \tag{0.11}
\end{aligned}}
\]

Consequently

\[
 \boxed{\mathcal Q_{q,r;A}=O_{q,r}(A^{-1/2})}            \tag{0.12}
\]

for every fixed pair `q,r>=1`.  On `A=lambda^2`, every fixed Bernoulli
correlation matrix

\[
 2\lambda(\mathcal Q_{q,r;A})_{1\leq q,r\leq R}          \tag{0.13}
\]

has bounded operator norm for fixed `R`.

The notation is deliberately different from the previous endpoint-index
notation.  Bernoulli order `q` corresponds to endpoint index `j=q-1`:

\[
 \mathcal M_{jk,A}=\mathcal Q_{j+1,k+1;A}.               \tag{0.14}
\]

Thus the leading `P--P` scalar is `mathcal M_(00,A)` (the two minus signs
in (0.2) cancel), whereas the already frozen `B_2--B_2` scalar
`mathcal M_(11,A)` is `mathcal Q_(2,2;A)`.

For the leading sawtooth pair, (0.5) becomes

\[
 K^+_{1,1}={3\zeta(5/4)^2\over\pi^{5/2}},\qquad
 K^-_{1,1}={\zeta(3/2)^2\over\pi^3}.                    \tag{0.15}
\]

Since `alpha_1=1/4`, `beta_1=1/2`, and `J_1=1/6`, equation
(0.11) proves

\[
\begin{aligned}
 |\mathcal M_{00,A}|
 \leq{}&{15C_\psi\zeta(5/4)^2\over\pi^{5/2}}A^{-1/2}
 +{3C_\psi\zeta(3/2)^2\over\pi^3}A^{-1}
 +{A^{-2}\over36}\\
 &+{A^{-3}\over1-A^{-2}}
 \left\{{4K^+_{1,1}\over13}A^{-1/2}
             +{2K^-_{1,1}\over7}A^{-1}\right\}.
                                                               \tag{0.16}
\end{aligned}
\]

This closes the own-defect **upper bound** for the isolated leading
endpoint matrix on every fixed prefix.  It supersedes the earlier
nonintegrable bound obtained by taking absolute values of the PNT error and
the divisor estimate for `C_(1,1;A)'` separately.  It does not contradict
that no-go: the present proof first controls the undifferentiated
correlation by Fourier oscillation and only then integrates against the
prime measure.

The second theorem identifies exactly what (0.12) does and does not imply
after the Bernoulli matrix is pulled back through the physical endpoint
jets.  For the fixed labels `8` and `12`, a raw normalized endpoint
coefficient of Bernoulli order `q` has size

\[
 \widehat\gamma_{q,t}\asymp_q\lambda^{2q-2}.             \tag{0.17}
\]

In the exact endpoint-null direction `v_lambda` of the frozen endpoint
barrier,

\[
\boxed{
 \widehat\gamma_{q,v}
 \sim(-1)^{q-1}{2^q\pi^{2q-5/2}\over(q-2)!q!}
       \lambda^{2q-4}\qquad(q\geq2).}                   \tag{0.18}
\]

At `q=2`, this is the already frozen constant
`-2*pi^(3/2)`.  Therefore (0.12) proves an `O(1)` reflected contribution
for the leading `P--P` matrix and an `O(1)` contribution for the
`B_2--B_2` compression to the endpoint-null line.  For a pair `q,r>=2`,
the same termwise argument on that line gives only

\[
 O_{q,r}(\lambda^{2(q+r-4)}).                            \tag{0.19}
\]

A truncation through Bernoulli order `R>=3` therefore receives only the
upper bound `O_R(lambda^(4R-8))` from this transfer.  This is **not** a
claim that the actual truncated matrix grows: the signed scalars can
cancel between different endpoint orders.  It says only that the
fixed-order quadrature bounds, used term by term, do not certify an
own-defect `O(1)` physical matrix beyond the two cases just stated.

Nothing here controls the complete Volterra remainder, sums the endpoint
series, or is uniform in a growing endpoint order, prolate label, or prefix
depth.  The theorem proves no sign or limiting constant for any
`mathcal Q_(q,r;A)`, no positive or negative signed floor, no absolute-tail
floor or failure, no growing-rest floor, no physical high-complement
comparison, no low/high reduction, no equation (5.2) of
`DIRECT_RH_ATTACK.md`, and no RH conclusion.  The formal state remains
`P0_INVALIDATED`.

## 1. Frozen dependencies and conventions

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_EVEN_ENDPOINT_NULL_BERNOULLI_PRIME_QUADRATURE_BOUND.md` | `ba3aa9777c61883424eed8404f814abf6a9974f2846424e26529661c89ab3a0b` |
| `tests/test_fixed_even_endpoint_null_bernoulli_prime_quadrature_bound.py` | `2ba9ec7f21c9f4e837cc4ec55ebf1f11d38a6fb1d036e90094a10b7f66ad8e42` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md` | `c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b` |
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/OUTER_OUTER_SPECTRAL_SAMPLING_REDUCTION.md` | `49568daabe36c6507f7b366c53f784f29f9b7807284c738b80f5b016600f354b` |
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |

The periodic Bernoulli convention is

\[
 \widetilde B_q(x)
 =-{q!\over(2\pi i)^q}
 \sum_{k\in\mathbb Z\setminus\{0\}}{e(kx)\over k^q},
 \qquad e(x)=e^{2\pi ix}.                               \tag{1.1}
\]

For `q>=2` this series is absolutely and uniformly convergent.  For
`q=1` it is understood in the symmetric or Fejer sense and converges to
the midpoint value at an integer.

The all-range Chebyshev consequence used below is

\[
 \psi_C(x)\leq C_\psi x\qquad(x\geq1),                  \tag{1.2}
\]

where the admitted FKS constants permit the same explicit `C_psi` as in
the frozen `B_2--B_2` theorem.  No subexponential PNT remainder is used.

## 2. Weighted oscillatory integrals

For nonzero integers `k,l`, put

\[
 \phi_{k\ell}(t)=2\pi A(ke^t+\ell e^{y-t}).              \tag{2.1}
\]

If `k*l>0`, then

\[
 |\phi_{k\ell}''(t)|
 \geq4\pi A|k\ell|^{1/2}e^{y/2}.                        \tag{2.2}
\]

The explicit second-derivative van der Corput estimate from the frozen
`B_2--B_2` theorem, valid on every subinterval of `[0,y]`, gives

\[
 \left|\int_Ie^{i\phi_{k\ell}(t)}\,dt\right|
 \leq {6\over\sqrt\pi}A^{-1/2}|k\ell|^{-1/4}e^{-y/4}.
                                                               \tag{2.3}
\]

If `k*l<0`, then

\[
 |\phi_{k\ell}'(t)|
 \geq4\pi A|k\ell|^{1/2}e^{y/2}.                        \tag{2.4}
\]

Splitting at the at most one zero of `phi''` and using the
first-derivative estimate gives, again on every subinterval,

\[
 \left|\int_Ie^{i\phi_{k\ell}(t)}\,dt\right|
 \leq {2\over\pi}A^{-1}|k\ell|^{-1/2}e^{-y/2}.          \tag{2.5}
\]

For mixed Bernoulli orders the amplitude is

\[
 w_{q,r;y}(t)
 =e^{-(q-1)t-(r-1)(y-t)}.                                \tag{2.6}
\]

It is positive and monotone, and

\[
 \max_{0\leq t\leq y}w_{q,r;y}(t)
 =e^{-(d-1)y}.                                           \tag{2.7}
\]

There is no factor-two variation loss.  If `w` decreases, let `F(u)` be
the integral of `exp(i*phi(t))` over `[a,u]`.  Stieltjes integration by
parts gives

\[
 \left|\int_a^bw(t)e^{i\phi(t)}\,dt\right|
 \leq\sup_{a\leq u\leq b}|F(u)|
 \{w(b)+w(a)-w(b)\}.
                                                               \tag{2.8}
\]

This is `sup(w)` times the subinterval oscillatory bound.  Integrating
from the right proves the same statement when `w` increases.  Combining
(2.3)--(2.8) therefore gives

\[
\begin{aligned}
 \left|\int_0^yw_{q,r;y}(t)e^{i\phi_{k\ell}(t)}\,dt\right|
 &\leq {6\over\sqrt\pi}A^{-1/2}|k\ell|^{-1/4}
 e^{-\alpha_dy},&& k\ell>0,\\
 \left|\int_0^yw_{q,r;y}(t)e^{i\phi_{k\ell}(t)}\,dt\right|
 &\leq {2\over\pi}A^{-1}|k\ell|^{-1/2}
 e^{-\beta_dy},&& k\ell<0.
                                                               \tag{2.9}
\end{aligned}
\]

## 3. Fejer justification of the sawtooth case

The only conditional Fourier endpoint is `q=1`.  Let `sigma_N` be the
Fejer mean of (1.1).  For every fixed `y`, periodic `L2` convergence and
the change of variables `x=Ae^t` give

\[
\begin{aligned}
 &\int_0^y|\sigma_N\widetilde B_1(Ae^t)
             -\widetilde B_1(Ae^t)|^2\,dt\\
 &\qquad
 =\int_A^{Ae^y}|\sigma_N\widetilde B_1(x)
             -\widetilde B_1(x)|^2{dx\over x}
 \longrightarrow0.                                     \tag{3.1}
\end{aligned}
\]

The same holds with `Ae^(y-t)` and with either bounded exponential weight
from (0.3).  Cauchy--Schwarz shows that products of the two Fejer
approximants converge in `L1(0,y)` to the integrand defining
`C_(q,r;A)`.

For finite Fejer sums, termwise integration is immediate.  Equations
(2.9) supply the summable majorants

\[
 \sum_{k\ell>0}|k|^{-q-1/4}|\ell|^{-r-1/4}
 =2\zeta(q+1/4)\zeta(r+1/4),                             \tag{3.2}
\]

\[
 \sum_{k\ell<0}|k|^{-q-1/2}|\ell|^{-r-1/2}
 =2\zeta(q+1/2)\zeta(r+1/2).                            \tag{3.3}
\]

They converge even at `q=r=1`.  Dominated convergence in the resulting
double series identifies its limit with the physical convolution.  The
Fourier coefficient magnitude `q!/(2*pi)^q`, equations (2.9), and
(3.2)--(3.3) now give exactly (0.5)--(0.6).

The midpoint convention at an integer changes only a measure-zero set in
(3.1).  It creates no hidden boundary term in the convolution.

## 4. Local absolute continuity and every boundary term

On every finite interval, each `g_(q,A)` is bounded and of bounded
variation.  For `q=1` there are finitely many sawtooth jumps; for `q>=2`
the periodic Bernoulli function is continuous and has a locally-BV
derivative.  After compact truncation, the distributional derivative of
one factor is a finite measure and the other factor is `L1`.  Hence their
convolution has an `L1` distributional derivative.  Therefore

\[
 C_{q,r;A}\in AC_{\rm loc}([0,\infty)),\qquad
 C_{q,r;A}(0)=0.                                        \tag{4.1}
\]

In particular, internal `B_1` jumps are smoothed by convolution; they do
not survive as atoms of `C'`.  Equation (0.6) also gives

\[
 C_{q,r;A}(y)\longrightarrow0,
 \qquad C_{q,r;A}\in L^1(0,\infty).                     \tag{4.2}
\]

Set

\[
 F_{q,r;A}(y)=e^{-y}C_{q,r;A}(y).                        \tag{4.3}
\]

Then almost everywhere

\[
 F_{q,r;A}'(y)=e^{-y}\{C_{q,r;A}'(y)-C_{q,r;A}(y)\}.
                                                               \tag{4.4}
\]

The constant part of (0.7) contributes

\[
 \int_0^\infty(C_{q,r;A}'-C_{q,r;A})\,dy
 =-\int_0^\infty C_{q,r;A}(y)\,dy.                     \tag{4.5}
\]

For the prime term, choose finite `Y` with `X=Ae^Y` not a prime power.
Right-continuous Lebesgue--Stieltjes integration by parts gives

\[
\begin{aligned}
 -{1\over A}\int_0^Y\psi_C(Ae^y)F_{q,r;A}'(y)\,dy
 ={}&-{\psi_C(X)\over A}F_{q,r;A}(Y)\\
 &+{1\over A}\sum_{A<n<X}\Lambda(n)
 F_{q,r;A}\!\left(\log{n\over A}\right).
                                                               \tag{4.6}
\end{aligned}
\]

The lower boundary is zero by `F(0)=C(0)=0`.  Thus even when `A` is an
integer prime power, its possible endpoint atom contributes zero.  The
upper boundary is

\[
 {\psi_C(X)\over X}C_{q,r;A}(Y)\longrightarrow0          \tag{4.7}
\]

by (0.6) and (1.2).  The jump term in (4.6) becomes

\[
 {1\over A}F_{q,r;A}\!\left(\log{n\over A}\right)
 ={1\over n}C_{q,r;A}\!\left(\log{n\over A}\right).
                                                               \tag{4.8}
\]

Finally, with

\[
 q_A(y)=\log(1-A^{-2}e^{-2y}),\qquad
 q_A'(y)={2A^{-2}e^{-2y}\over1-A^{-2}e^{-2y}},           \tag{4.9}
\]

both boundary terms in integration by parts against `F'` vanish and

\[
 -{1\over2A}\int_0^\infty q_A(y)F_{q,r;A}'(y)\,dy
 =A^{-3}\int_0^\infty
 {e^{-3y}C_{q,r;A}(y)\over1-A^{-2}e^{-2y}}\,dy.          \tag{4.10}
\]

Equations (4.5)--(4.10) prove the exact identity (0.9), including the
sawtooth jumps and all lower, upper, prime, and archimedean boundaries.

## 5. The explicit all-order bound

The one-dimensional improper integral exists for every `q>=1`:

\[
 I_{q,A}:=\int_0^\infty g_{q,A}(t)\,dt
 =A^{q-1}\int_A^\infty x^{-q}\widetilde B_q(x)\,dx.      \tag{5.1}
\]

Use the bounded periodic primitive
`widetilde B_(q+1)/(q+1)`.  Its Fourier series gives

\[
 \left\|{\widetilde B_{q+1}\over q+1}\right\|_\infty
 \leq {2q!\zeta(q+1)\over(2\pi)^{q+1}}.                 \tag{5.2}
\]

One integration by parts in (5.1), including its endpoint term and the
variation of `x^(-q)`, proves

\[
 \boxed{|I_{q,A}|\leq J_qA^{-1}.}                        \tag{5.3}
\]

This also proves ordinary convergence at `q=1`; explicitly, `J_1=1/6`.
For `epsilon>0`, the Laplace convolution identity is absolutely justified:

\[
 \int_0^\infty e^{-\epsilon y}C_{q,r;A}(y)\,dy
 =\left(\int_0^\infty e^{-\epsilon t}g_{q,A}(t)\,dt\right)
  \left(\int_0^\infty e^{-\epsilon t}g_{r,A}(t)\,dt\right).
                                                               \tag{5.4}
\]

Letting `epsilon` decrease to zero, Abel convergence on the right and
dominated convergence using (0.6) on the left yield

\[
 \boxed{
 \int_0^\infty C_{q,r;A}(y)\,dy=I_{q,A}I_{r,A},\qquad
 \left|\int_0^\infty C_{q,r;A}\right|
 \leq J_qJ_rA^{-2}.}                                    \tag{5.5}
\]

For every `eta>0`, Chebyshev partial summation gives

\[
 \sum_{n>A}{\Lambda(n)\over n}\left({n\over A}\right)^{-\eta}
 \leq C_\psi{1+\eta\over\eta}.                         \tag{5.6}
\]

Apply (5.6) with `eta=alpha_d,beta_d` to (0.6).  The archimedean term
obeys

\[
\begin{aligned}
 |R_{\rm ar}^{q,r}(A)|
 \leq {A^{-3}\over1-A^{-2}}
 \left\{
 {K^+_{q,r}A^{-1/2}\over\alpha_d+3}
 +{K^-_{q,r}A^{-1}\over\beta_d+3}
 \right\}.                                              \tag{5.7}
\end{aligned}
\]

Equations (5.5)--(5.7) inserted into (0.9) prove (0.11).

At `q=r=2`, (0.5), (0.10), and (0.4) reduce to

\[
 K^+_{2,2}={3\zeta(9/4)^2\over\pi^{9/2}},\qquad
 K^-_{2,2}={\zeta(5/2)^2\over\pi^5},\qquad
 J_2={\zeta(3)\over\pi^3},                              \tag{5.8}
\]

with `alpha_2=5/4` and `beta_2=3/2`.  Thus the general theorem reproduces
the frozen `B_2--B_2` prime and continuous constants; (5.7) is merely a
sharper archimedean estimate than the earlier crude bound.

## 6. Exact endpoint expansion and sign convention

For a smooth even source `f`, repeated integration by parts in its
additive Fourier transform, followed by the exact harmonic Bernoulli
series, gives the `q`-th right-tail endpoint term

\[
 \mathcal E_{q,f}(s)
 ={(-1)^qf^{(q-1)}(\lambda)\over
   2q!(\lambda e^s)^{q-1/2}}
 \widetilde B_q(Ae^s),
 \qquad A=\lambda^2.                                    \tag{6.1}
\]

For `q=1`, equation (6.1) is

\[
 -{f(\lambda)\over2\sqrt{\lambda e^s}}\widetilde B_1(Ae^s)
 ={f(\lambda)\over2\sqrt{\lambda e^s}}P(Ae^s).        \tag{6.2}
\]

For `q=2`, it is exactly

\[
 {f'(\lambda)\over4(\lambda e^s)^{3/2}}
 \widetilde B_2(Ae^s).                                  \tag{6.3}
\]

For a defect scale `D`, define the raw jet coefficient and the physical
standard-Bernoulli coefficient by

\[
 \widehat\gamma_{q,f}
 ={f^{(q-1)}(\lambda)\over2q!\lambda^{q-1/2}\sqrt D},
 \qquad
 \gamma_{q,f}=(-1)^q\widehat\gamma_{q,f}.               \tag{6.4}
\]

This distinction prevents a hidden sign mutation: the raw `q=2`
coefficient is the `kappa_lambda` of the frozen endpoint-null theorem,
while the leading physical sawtooth uses `P=-widetilde B_1`.

Factoring the common `e^(-s/2)` from (6.1) leaves exactly `g_(q,A)` in
(0.3).  Therefore every ordered reflected pair of normalized endpoint
terms is a fixed harmless parity sign times

\[
 2\lambda\gamma_{q,f}\gamma_{r,h}\mathcal Q_{q,r;A}.
                                                               \tag{6.5}
\]

This is the matrix transfer to which (0.13) applies.

## 7. Exact spheroidal endpoint-jet recurrence

Let `Y(z)=h_(n,lambda)(lambda*z)` be a pure prolate mode and write

\[
 {Y^{(j)}(1)\over Y(1)}=P_j(\Theta,c^2),
 \qquad c=2\pi\lambda^2.                                \tag{7.1}
\]

Differentiating

\[
 (1-z^2)Y''-2zY'+(\Theta-c^2z^2)Y=0                    \tag{7.2}
\]

`j` times and evaluating at `z=1` gives the exact recurrence

\[
\boxed{
\begin{aligned}
 2(j+1)P_{j+1}
 ={}&\{\Theta-c^2-j(j+1)\}P_j
 -2jc^2P_{j-1}-j(j-1)c^2P_{j-2},\\
 &P_0=1,\qquad P_{-1}=P_{-2}=0.
                                                               \tag{7.3}
\end{aligned}}
\]

In particular,

\[
 P_j(\Theta,c^2)
 ={(\Theta-c^2)^j\over2^jj!}
 +\hbox{terms of lower degree in }\Theta-c^2.            \tag{7.4}
\]

For every fixed label `t`, the frozen eigenvalue expansion gives

\[
 \Theta_{t,\lambda}=(2t+1)c+O_t(1),\qquad
 \Theta_{8,\lambda}-\Theta_{12,\lambda}
 =-8c+42+O(\lambda^{-2}).                                \tag{7.5}
\]

Thus, for fixed `j>=1`,

\[
\begin{aligned}
 P_j(\Theta_{t,\lambda},c^2)
 &\sim {(-c^2)^j\over2^jj!},\\
 P_j(\Theta_{8,\lambda},c^2)
 -P_j(\Theta_{12,\lambda},c^2)
 &\sim {(-c^2)^{j-1}(-8c)\over2^j(j-1)!}.
                                                               \tag{7.6}
\end{aligned}
\]

The actual fixed-even columns contain bounded label-4 and label-0 anchor
corrections and an interior bump.  The bump changes no endpoint jet.  For
label 8, the label-4 endpoint is smaller by `O(lambda^(-4))`; for label 12
it is smaller still.  The endpoint-null difference in (7.6) is only
`O(lambda^(-2))` below the common leading jet, so these anchor terms remain
lower order for every fixed `j`.  Consequently the pure-mode constants in
(7.6) also govern the actual columns.

## 8. Sharp fixed-8/12 jet growth and the transfer barrier

Use the frozen notation

\[
 a_t={E_t\over\sqrt{D_t}},\qquad
 r_\lambda=(a_8^2+a_{12}^2)^{1/2},\qquad
 v_\lambda={1\over r_\lambda}(a_{12},-a_8).              \tag{8.1}
\]

The endpoint normalization gives

\[
 a_8\sim a_{12}\sim\sqrt{2\pi\lambda},\qquad
 {a_8a_{12}\over r_\lambda}\sim\sqrt{\pi\lambda}.     \tag{8.2}
\]

For a single fixed column, equations (6.4), (7.6), and (8.2) give

\[
\boxed{
 \widehat\gamma_{q,t}
 \sim(-1)^{q-1}
 {2^{q-2}\sqrt{2\pi}\,\pi^{2q-2}\over(q-1)!q!}
 \lambda^{2q-2}.}                                      \tag{8.3}
\]

In the endpoint-null direction, with `j=q-1`, the normalized derivative is

\[
 {a_8a_{12}\over r_\lambda}\lambda^{-j}
 \{P_j(\Theta_8,c^2)-P_j(\Theta_{12},c^2)\}
 \{1+o(1)\}.                                            \tag{8.4}
\]

Substituting (7.6), `c=2*pi*lambda^2`, and the denominator in (6.4)
proves

\[
 \widehat\gamma_{q,v}
 \sim(-1)^{q-1}{2^q\pi^{2q-5/2}\over(q-2)!q!}
 \lambda^{2q-4},                                        \tag{8.5}
\]

which is (0.18).  The physical coefficient in the standard Bernoulli
convention is

\[
 \gamma_{q,v}=(-1)^q\widehat\gamma_{q,v}
 \sim-{2^q\pi^{2q-5/2}\over(q-2)!q!}\lambda^{2q-4}.
                                                               \tag{8.6}
\]

In particular,

\[
 \widehat\gamma_{2,v}=\gamma_{2,v}\longrightarrow
 -2\pi^{3/2},\qquad
 \gamma_{1,v}=0\quad\hbox{exactly}.                    \tag{8.7}
\]

Let `Gamma_R` be the matrix whose rows are the physical endpoint
coefficient rows `gamma_q`, `1<=q<=R`.  Equation (0.13) gives a bounded
Bernoulli-coordinate matrix, but its pullback to physical source
coordinates has the schematic form

\[
 \Gamma_R^*\{2\lambda(\mathcal Q_{q,r;A})\}\Gamma_R.
                                                               \tag{8.8}
\]

On the full fixed `8/12` block, (8.3) gives only
`O_R(lambda^(4R-4))` from the norm inequality.  On the endpoint-null line,
(8.5) gives only

\[
 \boxed{O_R(\lambda^{4R-8}).}                            \tag{8.9}
\]

For `R=1`, the full leading sawtooth matrix is `O(1)`.  For `R=2`, the
endpoint-null compression is `O(1)` because its `q=1` row vanishes and its
`q=2` row converges.  For `R>=3`, (8.9) grows and therefore supplies no
boundedness theorem.

Equation (8.9) is only a limitation of the termwise transfer.  The matrix
in braces in (8.8) is signed, its entries have no established limiting
sign, and different `q,r` entries may cancel.  This note proves neither
growth nor failure of the actual finite truncation.

## 9. Why the result does not sum to the complete tail

There are four independent stopping points.

1. **The endpoint expansion is not defect-uniform at the physical edge.**
   Equations (8.3) and (8.5) show that successive fixed endpoint terms gain
   powers of `lambda^2` at `u` on the scale `lambda`.  It is an ordinary
   large-`u` expansion, not a convergent or uniformly asymptotic expansion
   in the simultaneous prolate limit.

2. **The known Volterra remainders are non-small before the arithmetic
   sum.**  The frozen endpoint barrier proves that subtracting the leading
   term from a fixed column, or the first nonzero `B_2` term from the
   endpoint-null direction, leaves a non-`o(sqrt(D))` additive remainder.
   The present scalar theorem does not change either exact leakage fact.

3. **Complete arithmetic channels may cancel.**  The Bernoulli pieces,
   the Volterra remainder, near-range terms, and the divisor sum meet before
   the physical paired-zero matrix is formed.  No admitted theorem permits
   replacing that complete post-sum state by a fixed endpoint truncation in
   the paired-zero norm.

4. **Every estimate here is fixed-order and fixed-label.**  The zeta and
   factorial constants in (0.5), the endpoint recurrence asymptotics, the
   anchor comparison, and the fixed-prefix metric equivalence have no
   serialized uniformity when Bernoulli order, prolate label, or prefix
   depth grows.  Hence neither `R` nor the growing rest can be sent to
   infinity in (0.13) or (8.8).

Finally, all bounds in this note take absolute values after the exact
prime-quadrature identity.  Same-sign stationary phases still generate
weighted von Mangoldt sums with nonlinear square-root phases.  No admitted
input supplies their signed asymptotics.  The absolute upper bounds above
therefore choose neither a sign nor the aligned/anti-aligned paired-slot
orientation required by the signed floor.
