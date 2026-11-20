# A complete-theta quadratic-Jacobi obstruction to a growing reserve shortcut

## Result and boundary

The complete theta profile, positive quadratic recurrence coefficients, real
simple interlacing roots, and logarithmic spatial localization do **not**
force a conditioning reserve of order `log n`. This note proves that claim
false for an explicit coherent polynomial ladder, while keeping the theta
profile and both of its correlated Fourier legs unchanged.

The ladder below is **not** the actual signed-orthogonal endpoint ladder.
Consequently this is not a counterexample to the criterion in
`MODULAR_THETA_HIGH_DEGREE_CRITERION_20261103.md`, nor a lower bound for its
actual reserve. It identifies the missing input more sharply: exact signed
stationarity must quantitatively distinguish the actual ladder from other
positive quadratic Jacobi ladders. Eventual positivity of individual test
energies, even with asymptotically correct source norm ratios, is insufficient.
No all-degree theta-pivot sign or RH conclusion follows.

Fix any `C>1`; `C=4` is a concrete choice. Define monic real polynomials by

\[
 p_0=1,\qquad p_1=t,\qquad
 p_{n+1}(t)=t p_n(t)-Cn^2p_{n-1}(t).                 \tag{1}
\]

Keep the complete campaign profile `psi`, put

\[
 \widehat\psi(t)=2\Xi(t),\qquad
 f(t)=\Xi'(t)^2-\Xi(t)\Xi''(t),\qquad
 a={\pi\over2\sqrt C}< {\pi\over2},                 \tag{2}
\]

and define the **test** energies (not actual pivots)

\[
 \begin{split}
 F_n&=i^n p_n(-iD)\psi,\\
 \widetilde P_n&=\|F_n\|_2^2
       ={2\over\pi}\int_{\mathbb R}p_n(t)^2\Xi(t)^2\,dt,\\
 \widetilde\sigma_n&={2\over\pi}
       \int_{\mathbb R}p_n(t)^2 f(t)\,dt,\\
 \widetilde c_n&={\widetilde\sigma_n\over\widetilde P_n},
 \qquad
 \widetilde{\mathcal R}_n=
       {\widetilde\sigma_{n+1}\over\widetilde P_n}.
 \end{split}                                           \tag{3}
\]

Every integral uses complete theta and converges absolutely, without an
assumption on the sign of `f`. Then

\[
 \boxed{\begin{split}
 \widetilde c_n&\longrightarrow c_C\in(0,\infty),\\
 \widetilde\sigma_n&>0\quad\hbox{eventually},\\
 {\widetilde\sigma_{n+1}\over\widetilde\sigma_n}
       &\sim Cn^2,\\
 \widetilde{\mathcal R}_n&\sim Cc_Cn^2,\\
 {\widetilde{\mathcal R}_n\over n^2(\log n+1)}
       &\longrightarrow0,
 \end{split}}                                          \tag{4}
\]

where the limiting constant has two exact complete-theta expressions:

\[
 \boxed{
 c_C={\int\cosh(at)f(t)\,dt\over
             \int\cosh(at)\Xi(t)^2\,dt}
     ={2\|h\psi(h-ia/2)\|_2^2\over
             \|\psi(h-ia/2)\|_2^2}>0.}                \tag{5}
\]

Moreover the parent spatial mass really does reach logarithmic order:

\[
 \boxed{
 {\|hF_n\|_2^2\over\widetilde P_n\log^2n}
       \longrightarrow{1\over4C}.}                    \tag{6}
\]

If `q_(n,j)=p_n/(t-r_(n,j))` are all the root-deletion quotients, the exact
source identity consequently gives

\[
 \boxed{
 {\sum_{j=1}^n\|q_{n,j}(-iD)\psi\|_2^2
       \over\widetilde P_n\log^2n}
       \longrightarrow{1\over2C}.}                    \tag{7}
\]

Thus the positive spatial term and the full root-deletion cost cancel to
leading order `log^2 n`, leaving the bounded positive ratio (5). This is an
actual complete-theta correlation, not a Gaussian profile countermodel or a
finite-orbit approximation.

## 1. Definitions and factors

For a real polynomial `p`, let `U=2Xi`. Integration by parts gives

\[
 \begin{split}
 h_\psi[p]
 &=\int p^2(U'^2-UU'')\,dt\\
 &=2\|(pU)'\|_2^2+
       \int\{pp''-(p')^2\}U^2\,dt.                  \tag{8}
 \end{split}
\]

If the roots of `p` are real and simple, then

\[
 (p')^2-pp''=\sum_j\left({p\over t-r_j}\right)^2.
                                                               \tag{9}
\]

Using Plancherel with `hat psi=2Xi`, (8)--(9) give

\[
 {h_\psi[p]\over2\pi}
  ={2\over\pi}\int p^2f
  =2\|h p(-iD)\psi\|_2^2
       -\sum_j\|q_j(-iD)\psi\|_2^2.                 \tag{10}
\]

This is the endpoint divided-source normalization used in the high-degree
criterion. In particular the ratio in that normalization is exactly
`integral p^2 f / integral p^2 Xi^2`; no extra factor `2` or half-line factor
belongs in it. Formula (10) holds for every such test polynomial; its
identification as a **Schur pivot** additionally requires actual signed
stationarity, which is deliberately not assumed in (1).

For (1), a real symmetric unreduced tridiagonal matrix with zero diagonal
and off-diagonal entries `sqrt(C),2sqrt(C),..., (n-1)sqrt(C)` has
characteristic polynomial `p_n`. Its eigenvalues are simple and real, and
principal-submatrix eigenvalue interlacing is strict. Thus all root-deletion
quotients in (7) are legitimate and the ladder is coherent across degree.

## 2. Full-theta strip control

The complete theta series is holomorphic in `|Im h|<pi/4`. On every smaller
closed horizontal strip its derivatives have double-exponential decay at
both real ends. On the positive end this follows directly from
`Re(pi m^2 exp(2h))>0` and the convergent complete orbit sum; the modular even
identity gives the negative end. Contour translation, including the factor
`h^j` for Fourier derivatives, therefore gives, for every `d<pi/4`,

\[
 |\Xi^{(j)}(t)|\le K_{d,j}e^{-d|t|},\qquad j\ge0.
                                                               \tag{11}
\]

Since `a<pi/2`, choose `a/2<d<pi/4`. It follows that

\[
 \int(1+t^2)e^{a|t|}
       (\Xi(t)^2+|f(t)|+\Xi'(t)^2)\,dt<\infty.       \tag{12}
\]

These are complete-theta bounds at fixed strip width. No degree-dependent
orbit truncation, spectral sign, or raw hierarchy limit is used.

## 3. Exact generating function and an integrable uniform bound

Set `A_n=n! C^(n/2)` and `Q_n=p_n/A_n`. The recurrence becomes

\[
 (n+1)Q_{n+1}={t\over\sqrt C}Q_n-nQ_{n-1}.
                                                               \tag{13}
\]

Consequently `G(z,t)=sum Q_n(t)z^n` solves

\[
 (1+z^2)G_z=(t/\sqrt C-z)G,\qquad G(0,t)=1,
\]

and hence

\[
 \boxed{
 G(z,t)=(1+z^2)^{-1/2}
       \exp\{(t/\sqrt C)\arctan z\}
   =(1-iz)^{-1/2+i\tau}(1+iz)^{-1/2-i\tau},
 \quad \tau={t\over2\sqrt C}.}                       \tag{14}
\]

This is the `lambda=1/2, phi=pi/2` Meixner--Pollaczek generating function,
with the scaled variable `tau`; the derivation above fixes all conventions.
See the [NIST generating function](https://dlmf.nist.gov/18.23.E7) and
[recurrence](https://dlmf.nist.gov/18.22.E8) for the standard identification.
The proof below does not import a uniform asymptotic theorem.

Here is a uniform coefficient estimate needed to control the entire real
frequency axis. There is a constant `K_C`, independent of `n>=2,t`, such that

\[
 \begin{split}
 \sqrt n\,|Q_n(t)|
       &\le K_C(1+|t|)e^{a|t|/2},\\
 {\sqrt n\over1+\log n}|Q_n'(t)|
       &\le K_C(1+|t|)e^{a|t|/2}.                    \tag{15}
 \end{split}
\]

For completeness, these bounds follow directly from boundary Fourier
coefficients of (14). On `z=exp(i theta)`, away from the two singularities
`theta=+-pi/2`,

\[
 \Re\arctan(e^{i\theta})={\pi\over4}
                 \operatorname{sgn}(\cos\theta),
 \quad
 |G|\le e^{a|t|/2}|2\cos\theta|^{-1/2}.             \tag{16}
\]

With `delta` the distance to those singularities, differentiating (14)
also gives

\[
 |\partial_\theta G|
    \le K_C(1+|t|)e^{a|t|/2}\delta^{-3/2}.          \tag{17}
\]

Integrate directly on the arcs `delta<1/n`, obtaining `O(n^-1/2)`;
on their complement, integrate the coefficient integral by parts once.
The endpoint terms and the integral of (17), each divided by `n`, are
`O((1+|t|)n^-1/2)`. Radial limits are justified by the integrable
`delta^-1/2` bound. For the second estimate use
`G_t=C^-1/2 (arctan z)G`; its boundary amplitude and derivative acquire at
most `K_C(1+|log delta|)`. The same split adds the factor `1+log n`.
This proves (15), including an integrable global majorant through (12).

## 4. Two singularities, weak averaging, and the finite limit

The leading singular terms at `z=i` and `z=-i` in (14) give, uniformly for
`t` in compact real intervals,

\[
 Q_n(t)=n^{-1/2}\left\{
       i^{-n}A(t)n^{i\tau}
       +(-i)^{-n}\overline{A(t)}n^{-i\tau}
                    \right\}+O(n^{-3/2}),             \tag{18}
\]

where

\[
 A(t)={2^{-1/2+i\tau}\over\Gamma(1/2+i\tau)},\qquad
 2|A(t)|^2={\cosh(at)\over\pi}.                      \tag{19}
\]

One can verify (18) without a separate asymptotic input. Replace the factor
analytic at each singularity by its value there. The coefficient of
`(1-z/z0)^(-alpha)` is `(alpha)_n z0^-n/n!`, equal to
`z0^-n n^(alpha-1)/Gamma(alpha)(1+O(1/n))` for compact `alpha`.
After the leading terms are removed, the local remainder has amplitude
`O(delta^1/2)` and second derivative `O(delta^-3/2)`. The same `1/n` arc
split, with two integrations by parts on the complement, bounds its
coefficient by `O(n^-3/2)`. A smooth partition around the two singularities
leaves a smooth remainder with faster coefficient decay. The argument also
holds after one `t` derivative, with the corresponding logarithmic factor.
The gamma identity in (19) is
`Gamma(1/2+iy)Gamma(1/2-iy)=pi/cosh(pi y)`.

Squaring (18) gives a nonoscillatory contribution `2|A|^2` plus a cross
term with frequency `log n/sqrt C` in `t`. If a weight `w` satisfies the
integrability in (12), the bounds (15) control the tails; on compact
intervals (18) applies; the cross term vanishes by the Riemann--Lebesgue
lemma. Thus

\[
 \boxed{
 n\int_{\mathbb R}Q_n(t)^2w(t)\,dt
    \longrightarrow {1\over\pi}
       \int_{\mathbb R}\cosh(at)w(t)\,dt.}             \tag{20}
\]

This applies to the **signed** complete-theta weight `w=f`, as well as to
`w=Xi^2`. Entrywise limits of growing Hankel blocks and their inverses are
not involved.

Let `I_f=int cosh(at)f`, `I_W=int cosh(at)Xi^2`. The latter is strictly
positive. Since `f` and `Xi^2` are even, their cosh-weighted integrals equal
their `exp(at)`-weighted integrals. Integration by parts yields

\[
 I_f=2\int e^{at}\{\Xi'(t)+(a/2)\Xi(t)\}^2\,dt>0.    \tag{21}
\]

Strictness holds because equality would force the even, nonzero, decaying
function `Xi` to be a multiple of `exp(-at/2)`. Alternatively, contour
translation gives
`Fourier[psi(h-ia/2)](t)=2exp(at/2)Xi(t)`, so Plancherel in (21) proves
the physical identity (5). Both integrals in (5) are finite since `a/2<pi/4`.

Using (20),

\[
 \widetilde\sigma_n={2A_n^2\over\pi^2 n}(I_f+o(1)),
 \qquad
 \widetilde P_n={2A_n^2\over\pi^2 n}(I_W+o(1)).       \tag{22}
\]

Taking ratios and using `A_(n+1)^2/A_n^2=C(n+1)^2` proves every assertion
in (4). These are asymptotic theorems, not finite-degree extrapolations.

## 5. The root-deletion cancellation is leading order

Differentiating the compact asymptotic (18) makes its leading derivative
equal to `+-i log n/(2sqrt C)` times each of its two oscillatory terms.
The second bound in (15), together with (11)--(12), controls the weighted
tails. The same weak-averaging argument therefore gives

\[
 {n\over\log^2n}\int\{(Q_n\Xi)'\}^2\,dt
     \longrightarrow {1\over4C\pi}I_W.               \tag{23}
\]

Terms where the derivative hits `Xi` or `A(t)` vanish under this scaling;
this is immediate on compact intervals, with the tails bounded by (15).
Plancherel and (20) now prove (6). Finally (10) and the bounded limit of
`tilde c_n` prove (7). This argument retains the **whole** root-deletion
sum; it is precisely that sum that cancels the spatial leading term.

## 6. What this rules out, and what remains open

The following proposed shortcut is false for the actual complete theta
profile: a coherent positive quadratic Jacobi recurrence, simple real
interlacing roots, and a genuine logarithmic parent spatial scale imply
`c_n >= eta log n` or a direct reserve of order `n^2 log n`.
Equations (4), (6), and (7) give its explicit obstruction.

The recurrence coefficients in (1) are **not** exact ratios of its theta
test energies; they only agree asymptotically. Nor do the polynomials in
(1) satisfy the exact target orthogonality equations

\[
 \int f(t)p_n(t)t^j\,dt=0\qquad(0\le j<n).            \tag{24}
\]

For example, at `C=4`, `p_2=t^2-4`, whereas the audited complete-theta
curvature bound implies the actual first recurrence coefficient is greater
than `17/2`. Thus (24) already fails at the second polynomial. No assertion
about positive definiteness of every theta Gram block for this trial basis
is made.

This does not invalidate the actual sufficient condition or any implication
that explicitly uses (24). It shows why its remaining inverse-selection
condition cannot be replaced by root geometry, a quadratic norm-ratio
asymptotic, or the raw monomial saddle. The actual lower bound for
`sigma_(n+1)/P_n`, and upper control of its reflection cost, remain open.

Every complete-theta/Ewald regrouping valid in the fixed-degree topology
computes the same energies (3). Regrouping their orbit contributions cannot
remove the cancellation (7). A successful Ewald or orbit argument for the
actual reserve must use information that distinguishes (24) from this
explicit alternate ladder. The large-order raw-slice Gaussian theorem does
not supply that distinction.

## Reproduction

The companion standard-library verifier binds the cited repository sources,
checks exact recurrence/generating-function algebra, the tridiagonal
characteristic recurrence, the root-deletion polynomial identity, the
normalization factors, and the asymptotic ratio arithmetic. It does not
claim to machine-prove the analytic estimates (11), (15), or (18)--(23),
which are proved above; no theta quadrature or degree sweep is used.

```text
python3 research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/workstreams/all-degree-analytic-search-next-v1/src/verify_theta_reserve_quadratic_jacobi_obstruction_20261103.py \
  --root . \
  --output research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/workstreams/all-degree-analytic-search-next-v1/results/theta_reserve_quadratic_jacobi_obstruction_20261103.json
```
