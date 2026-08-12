# Cutoff-free actual-radical Floquet Xi minimum modulus and Pair-C barrier

## 0. Outcome and exact claim boundary

Put

\[
 L=2\log\lambda,\qquad 1\leq N\leq C_N\lambda^2,
 \qquad t_{n,\theta}={2\pi n+\theta\over L}.          \tag{0.1}
\]

There is an unconditional choice

\[
 {1\over2L}\leq\theta\leq{3\over2L}                 \tag{0.2}
\]

for which both Floquet grids `t_(n,theta)` and `t_(n,-theta)`, with
`|n|<=N`, stay polynomially separated from every complex zero of `Xi`.
Zeros off the real axis, clusters, and multiplicities are all retained.
The local zeta factorization, rather than a crude global Hadamard product,
then gives

\[
 \boxed{
 \min_{|n|\leq N}|\Xi(t_{n,\pm\theta})|
 \geq\exp\left\{-{\pi^2N\over2L}-C L^2\right\}
 =\exp\{-o(\lambda^2)\}.}                            \tag{0.3}
\]

The last equality is for `N=O(lambda^2)`.  Thus a Floquet shift genuinely
removes the sampled common-`Xi` minimum-modulus obstruction on a quadratic
mode band.  This positive statement is unconditional and assumes neither
RH nor zero simplicity.

It does not by itself produce a residual-safe radical frame.  The complete
Floquet-circle translation orbit of the locked `Xi/4` anchor has an
`exp(-o(lambda^2))` ideal diagonal floor, but the circle action wraps across
the finite-window seam.  Some shifts have order-one seam error.  Restricting
to the bounded global translations which retain `exp(-c lambda^2)` leakage
restores the exact, theta-independent binomial upper bound

\[
 c_{N,S}^{\theta}(p)
 \leq\|p\|^2{(2\pi S/L)^{2N}\over\binom{2N}{N}}
 \leq(2N+1)\|p\|^2\left({\pi S\over L}\right)^{2N}.
                                                               \tag{0.4}
\]

At `N` comparable to `lambda^2`, this is
`exp(-Theta(lambda^2 log log lambda))`.  Positive weights placed on
boundary-unsafe shifts satisfy the weighted refinement in Section 6 and
cannot repair the exponent while keeping a fixed Gaussian residual.

The nontranslation route is reduced exactly to Pair C.  If a finite actual
source prefix has invariant Floquet-band row floor `c_(theta,m)`, and a
dangerous-space theorem embeds the bottom space in that band with bounded
graph condition, then

\[
 \boxed{\gamma_m\geq{2c_{\theta,m}\over\lambda^2}}    \tag{0.5}
\]

up to the square of that graph condition.  Hence an
`exp(-o(lambda^2))` twisted cofactor floor and an `exp(-c lambda^2)` defect
would close the frozen Pair-C stopping condition.  No frozen theorem proves
this finite-prefix floor at `N=O(lambda^2)`.  Floquet separation conditions
the common `Xi` row factor; it does not prove the missing source principal
angle.

Divided differences and `zeta'/zeta` compensation do not give an exact
actual-source escape.  Holomorphy at every zeta zero forces precisely the
cancellation which restores the common divisor.  Without it, the proposed
Mellin factor is meromorphic and the profile has a global bulk residual.

No twisted transition-prefix floor, dangerous-space embedding, bottom
capture, new zero theorem, converse, or RH conclusion is proved.  The
standard eight are untouched and the formal state remains `P0_INVALIDATED`.

## 1. Frozen direct inputs

No zero table, numerical zero ordinate, or external artifact is used.  The
direct repository inputs are:

| Frozen path | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_ACTUAL_RADICAL_XI_IDEAL_TRANSLATION_FRAME_BARRIER.md` | `e961040eda5cdf2645d8c0a50d54dbbd269a666c55d3470e7fc9853b58e0da9e` |
| `tests/test_cutoff_free_actual_radical_xi_ideal_translation_frame_barrier.py` | `04dda3387b76d45a0fd9a3a054ffce662c78a6487d49c0995a6e3a9315c2b642` |
| `notes/MOVING_LABEL_CARRIER_COFRAME_DEFECT_RIGHT_INVERSE_THEOREM.md` | `caaa4df57d43f74ef56fed6df907da6db0daa7b0f89da23cce30bc2ac9369acd` |
| `tests/test_moving_label_carrier_coframe_defect_right_inverse_theorem.py` | `31f8ffad0dc5a1f2b6a00a47b55238d64d9bc6550813d5b77b15c00da1757913` |
| `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` | `3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81` |
| `tests/test_full_source_coframe_rank.py` | `dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `tests/test_growing_transition_sampling.py` | `ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac` |
| `notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md` | `c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c` |
| `tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py` | `d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11` |

The Xi-ideal note supplies the exact common divisor, limiting anchor tail,
and boundary-safe binomial argument.  The moving-label note supplies the
ideal polynomial--Xi matrix and its presently frozen range.  The full-source
note supplies the invariant row floor and source-Gram formalism.  The
transition note supplies only defect-relative residual upper bounds.  The
weighted coframe note supplies Pair C and its stopping condition.  These
roles are not interchangeable.

## 2. Simultaneous separation of the paired Floquet grids

Let `Z_Xi` be the multiset of zeros of `Xi` in its angular variable.  Put

\[
 T={2\pi N+2\over L},\qquad
 M(T)=\#\{\zeta\in Z_\Xi:|\operatorname {Re}\zeta|\leq T+1\},
                                                               \tag{2.1}
\]

with multiplicity.  The classical zero count gives

\[
 M(T)\leq C_Z(T+2)\log(T+3).                         \tag{2.2}
\]

All nontrivial zeta zeros satisfy `0<Re(rho)<1`.  In the angular variable
their imaginary parts therefore have modulus less than `1/2`; no RH input
is being hidden here.

Choose theta from the interval

\[
 \Theta_L=\left[{1\over2L},{3\over2L}\right],
 \qquad \eta:=|\Theta_L|={1\over L},                 \tag{2.3}
\]

and set

\[
 r={\eta\over8L\max\{M(T),1\}}.                     \tag{2.4}
\]

Fix one zero `zeta=x+iy`, one sign, and one integer `|n|<=N`.  The bad
condition

\[
 \left|{2\pi n\pm\theta\over L}-\zeta\right|<r     \tag{2.5}
\]

cuts from `Theta_L` an interval of length at most `2Lr`.  Since the possible
centers for consecutive `n` are separated by `2*pi`, at most one such
interval occurs for each zero and each sign once `L` is large.  Counting
both signs and all multiplicities, the total bad length is at most

\[
 4LM(T)r\leq{\eta\over2}<|\Theta_L|.                 \tag{2.6}
\]

There is therefore a surviving theta for which

\[
 \boxed{
 \operatorname {dist}(t_{n,\pm\theta},Z_\Xi)\geq r,
 \qquad |n|\leq N.}                                  \tag{2.7}
\]

Zeros with imaginary part at least `r` were never dangerous, but including
them in (2.6) makes the conclusion uniform.  Repeated zeros merely repeat a
bad interval and are safely overcounted.  The symmetry `Z_Xi=-Z_Xi` also
shows directly why the two signs have the same separation property.

For `N<=C_N lambda^2`, equations (2.1)--(2.4) give

\[
 M(T)\leq C N,
 \qquad r\geq{c\over NL^2}.                           \tag{2.8}
\]

This is a polynomial separation, selected without moving the locked
half-integer lambda schedule.

## 3. The local minimum-modulus lemma

The distance estimate (2.7) is not enough if inserted factor by factor into
the global genus-one product.  That crude argument loses
`O(T(log T)^2)`, which is too large when `T` is `lambda^2/L`.  The correct
argument is local in height.

Let `s=1/2-it`, with real `|t|>=3`, and let

\[
 \mathcal Z_t=\{\rho:\zeta(\rho)=0,
                  |\operatorname {Im}\rho+t|\leq1\}. \tag{3.1}
\]

Riemann--von Mangoldt counting gives

\[
 \#\mathcal Z_t\leq C\log(|t|+3),                    \tag{3.2}
\]

with multiplicity.  Remove these local factors from zeta.  The standard
local logarithmic-derivative formula, uniformly throughout the fixed strip
`1/2<=Re(w)<=2`, gives

\[
 \log\left|{G_t(1/2-it)\over G_t(2-it)}\right|
 =O(\log(|t|+3)),                                    \tag{3.3}
\]

where

\[
 G_t(w)=\zeta(w)\prod_{\rho\in\mathcal Z_t}(w-\rho)^{-1}.
                                                               \tag{3.4}
\]

The identity is understood after removable singularities are filled.  It
can equivalently be proved by integrating `zeta'/zeta` after subtracting
the local principal parts.  Since the absolutely convergent reciprocal
Dirichlet series gives

\[
 |\zeta(2-it)|\geq{1\over\zeta(2)},                  \tag{3.5}
\]

and every denominator `|2-it-rho|` in (3.4) is bounded above by an absolute
constant, distance `delta` from every zeta zero gives

\[
 \log|\zeta(1/2-it)|
 \geq-C\log(|t|+3)\{1+\log(1/\delta)\}.             \tag{3.6}
\]

The compact range `|t|<=3` follows by removing its finitely many zeros and
enlarging `C`.

For

\[
 C(s)={1\over2}s(s-1)\pi^{-s/2}\Gamma(s/2),
 \qquad \Xi(t)=C(1/2-it)\zeta(1/2-it),               \tag{3.7}
\]

Stirling's formula gives

\[
 \log|C(1/2-it)|
 =-{\pi|t|\over4}+{7\over4}\log(|t|+2)+O(1).       \tag{3.8}
\]

Combining (3.6)--(3.8) proves the uniform local lemma

\[
 \boxed{
 \log|\Xi(t)|\geq-{\pi|t|\over4}
 -C\log(|t|+3)\{1+\log(1/\delta)\}.}                \tag{3.9}
\]

Under `s=1/2-it`, Euclidean distance from `s` to a zeta zero is exactly
Euclidean distance from `t` to the corresponding angular Xi zero.  Apply
(3.9) with `delta=r` from (2.7).  Equations (2.1), (2.8), and
`log(1/r)=O(L)` give

\[
 \log|\Xi(t_{n,\pm\theta})|
 \geq-{\pi^2N\over2L}-CL^2,                         \tag{3.10}
\]

after enlarging `C` to absorb the bounded endpoint terms.  This proves
(0.3).  Notice that the gamma-factor cost itself is only
`O(lambda^2/L)` at the top frequency.

## 4. Exact parity repair and its Riesz bounds

One Floquet exponential grid is not invariant under reflection unless
`theta` is zero or `pi`: reflection sends the `theta` grid to the `-theta`
grid.  Folding those paired rows gives the exact inversion-parity systems

\[
 c_n^\theta(t)=\cos(t_{n,\theta}t),\quad0\leq n\leq N,
 \qquad
 s_n^\theta(t)=\sin(t_{n,\theta}t),\quad1\leq n\leq N.
                                                               \tag{4.1}
\]

On `[-L/2,L/2]`, product-to-sum gives the following exact normalized
Grams.  Here `sinc(theta)=sin(theta)/theta`, the cosine row zero is scaled
by `a_0`, every positive-index row is scaled by `sqrt(2)`, `G_theta^+` is
the cosine Gram, and `G_theta^-` is the sine Gram:

\[
 \begin{aligned}
 I^c_{nm}&:={1\over L}\int_{-L/2}^{L/2}
       c_n^\theta(t)c_m^\theta(t)\,dt
 ={1\over2}\delta_{nm}
  +{1\over2}{\sin\{\pi(n+m)+\theta\}
                  \over\pi(n+m)+\theta},\\
 I^s_{nm}&:={1\over L}\int_{-L/2}^{L/2}
       s_n^\theta(t)s_m^\theta(t)\,dt
 ={1\over2}\delta_{nm}
  -{1\over2}{\sin\{\pi(n+m)+\theta\}
                  \over\pi(n+m)+\theta},\\
 a_0&:=\left\{{1+\operatorname {sinc}\theta\over2}\right\}^{-1/2},
 \qquad G^+_{00}=1,\\
 G^+_{0m}&={a_0\over\sqrt2}
       {(-1)^m\sin\theta\over\pi m+\theta}\quad(m\geq1),\\
 G^\pm_{nm}&=\delta_{nm}\pm
       {(-1)^{n+m}\sin\theta\over\pi(n+m)+\theta}
       \quad(n,m\geq1).
 \end{aligned}                                      \tag{4.2}
\]

The positive-index perturbations are Hankel matrices.  Moreover `a_0` is
uniformly bounded and the separate cosine first row and column obey

\[
 \sin\{\pi(n+m)+\theta\}=(-1)^{n+m}\sin\theta,
 \qquad
 \sum_{m=1}^\infty|G^+_{0m}|^2\leq C\theta^2.       \tag{4.3}
\]

Hilbert's inequality bounds the positive block by `C|theta|`, while the
last estimate bounds the first row and column by the same amount.  Therefore

\[
 \boxed{
 \|G_\theta^\pm-I\|\leq C|\theta|=O(L^{-1}).}        \tag{4.4}
\]

Thus the shifted cosine and sine rows are uniformly conditioned parity
bases.  The sine inventory begins at `n=1`; no artificial vanishing
near-zero sine row is inserted.  Pairing the signs costs neither a factor of
two in the parity dimension nor an exponential condition number.

## 5. The ideal complete-circle frame and the seam

Let `K_0` be the locked limiting label-four radical, normalized by

\[
 \widehat K_0(t)={1\over4}\Xi(t).                   \tag{5.1}
\]

For the finite restriction `p=C_lambda K_0`, its Floquet coefficient is

\[
 p_n=L^{-1/2}{\Xi(t_{n,\theta})\over4}+e_{n,\theta},
 \qquad
 |e_{n,\theta}|\leq L^{-1/2}\|1_{I_\lambda^c}K_0\|_1.
                                                               \tag{5.2}
\]

The locked tail is `exp(-c lambda^2+o(lambda^2))`, so (0.3) implies

\[
 \min_{|n|\leq N}|p_n|^2=\exp\{-o(\lambda^2)\}.     \tag{5.3}
\]

On the abstract Floquet circle, define

\[
 U_\tau^\theta\phi_{n,\theta}
 =e^{it_{n,\theta}\tau}\phi_{n,\theta},
 \qquad
 \phi_{n,\theta}=L^{-1/2}e^{it_{n,\theta}t}.         \tag{5.4}
\]

Then

\[
 {1\over L}\int_0^L|\langle g,U_\tau^\theta p\rangle|^2\,d\tau
 =\sum_{|n|\leq N}|g_n|^2|p_n|^2.                   \tag{5.5}
\]

Equations (5.3)--(5.5) are the positive ideal Floquet frame.

They are not an actual-source translation theorem.  The circle action in
(5.4) wraps across the endpoints with the Floquet phase.  At
`tau=L/2`, points near the right endpoint receive wrapped values of `K_0`
from a fixed neighborhood of zero, whereas the true global translate
`K_0(t+L/2)` samples its vanishing far tail.  Since `K_0` is nonzero,

\[
 \liminf_{\lambda\to\infty}
 \|U_{L/2}^\theta C_\lambda K_0
       -C_\lambda\{K_0(\,\cdot+L/2)\}\|_2>0.        \tag{5.6}
\]

The phase has modulus one and cannot remove this seam.  Therefore the
complete-circle diagonalization loses the truncation-only radical residual.

## 6. Boundary-safe translations and weighted unsafe mass

For true global translations restricted to `|tau|<=S`, write a band
correlation as

\[
 \langle g,U_\tau^\theta p\rangle
 =e^{i\theta\tau/L}
   \sum_{n=0}^N\overline {g_n}p_n e^{2\pi in\tau/L}. \tag{6.1}
\]

The leading phase disappears after taking absolute values.  The normalized
binomial witness

\[
 b_n={(-1)^{N-n}\binom Nn\over\sqrt{\binom{2N}{N}}},
 \qquad
 g_n={\overline {b_n}\over\overline {p_n}}          \tag{6.2}
\]

therefore gives exactly (0.4), just as on the untwisted grid.  If some
`p_n` vanishes, the floor is already zero.

The statement persists for a weighted orbit.  Let `nu` be a probability
measure on a full translation range and put

\[
 \varepsilon_S=\nu\{\tau:|\tau|>S\}.                 \tag{6.3}
\]

Use the binomial witness on the safe part and Cauchy--Schwarz on its
complement.  Then

\[
 \boxed{
 c_N^\theta(p;\nu)
 \leq\|p\|^2{(2\pi S/L)^{2N}\over\binom{2N}{N}}
       +\varepsilon_S\|p\|^2.}                      \tag{6.4}
\]

The exact translated tail asymptotic has squared exponent
`2*pi*lambda^2*exp(-2|tau|)`.  Given a requested residual exponent `c_0>0`,
choose a fixed `S` with

\[
 2\pi e^{-2S}<{c_0\over2}.                            \tag{6.5}
\]

Every shift outside that safe range has exterior leakage at least
`exp(-c_0 lambda^2/2+o(lambda^2))`.  A positive weighted exterior error of
order `exp(-c_0 lambda^2)` therefore forces

\[
 \varepsilon_S\leq
 \exp\{-c_0\lambda^2/2+o(\lambda^2)\}.              \tag{6.6}
\]

Equations (6.4)--(6.6) rule out an `exp(-o(lambda^2))` weighted translation
floor with that fixed Gaussian residual.  Even and odd translated pairs do
not help: their squared correlations sum by the parallelogram identity to
the two reflected raw-translation energies.

## 7. The exact nontranslation Pair-C reduction

Let `X_(lambda,theta)^sigma` be one of the parity Floquet bands in Section 4,
and let

\[
 \mathcal A_{\lambda,\theta}^\sigma:
 \mathcal H_0^{\rm ev}\longrightarrow X_{\lambda,\theta}^\sigma
                                                               \tag{7.1}
\]

be the full actual source map followed by the band projection.  For a
finite source synthesis `C_m`, set

\[
 G_m=C_m^*C_m,\qquad
 W_{\theta,m}=\mathcal A_{\lambda,\theta}^\sigma C_m,
 \qquad
 c_{\theta,m}=\lambda_{\min}
   (W_{\theta,m}G_m^\dagger W_{\theta,m}^*).         \tag{7.2}
\]

The middle operator is invariant under every change or rescaling of source
coordinates because

\[
 W_{\theta,m}G_m^\dagger W_{\theta,m}^*
 =\mathcal A_{\lambda,\theta}^\sigma
       P_{F_m}(\mathcal A_{\lambda,\theta}^\sigma)^*.
                                                               \tag{7.3}
\]

Suppose a new dangerous-space theorem places the complete bottom space in
this band.  Compressing (7.3) to that space gives

\[
 T_mT_m^*\succeq c_{\theta,m}P_\lambda.              \tag{7.4}
\]

If the dangerous space is a graph rather than a literal subspace, the
right side is divided by the square of the graph-lift norm.  Pair C uses

\[
 R_\lambda=T_\infty T_\infty^*,\qquad
 \gamma_m=\lambda_{\min}
  (R_\lambda^{-1/2}T_mT_m^*R_\lambda^{-1/2}),        \tag{7.5}
\]

and the full-source upper bound is

\[
 R_\lambda\preceq{\lambda^2\over2}I.                \tag{7.6}
\]

Equations (7.4)--(7.6) prove (0.5).  Combining it with the frozen stopping
condition gives

\[
 {8\mathcal C_{F_m}^2\lambda^4d_m\over\gamma_m}
 \leq {4\mathcal C_{F_m}^2\lambda^6d_m
                 \over c_{\theta,m}}.                \tag{7.7}
\]

Thus a polynomial `mathcal C_(F_m)`, an `exp(-c lambda^2)` defect, and
`c_(theta,m)=exp(-o(lambda^2))` would close Pair C.  Proving the last
inequality is not a consequence of (0.3); it is the missing principal-angle
theorem in different coordinates.

## 8. What the polynomial--Xi matrix does and does not prove

For the ideal Hermite source family, the even sample matrix is

\[
 (A_\theta^0)_{nj}
 =c_{n,L}\Xi(t_{n,\theta})P_{j-1}(t_{n,\theta}^2),
 \qquad0\leq n\leq N,\quad1\leq j\leq N+1.          \tag{8.1}
\]

The polynomials have exact degrees `0,...,N`.  The nodes
`t_(n,theta)^2` are distinct and (0.3) makes every diagonal Xi factor
nonzero.  Hence

\[
 \det A_\theta^0\ne0.                                \tag{8.2}
\]

This is algebraic full rank, not a usable lower singular value after the
source defect is inserted.  The currently frozen coefficient argument has
the scale

\[
 \log\|(A_\theta^0)^{-1}\|
 \leq C N^2\log(N+2)+H_{\Xi,\theta}+C N\log(NL+2),  \tag{8.3}
\]

which is far larger than `o(lambda^2)` at `N=O(lambda^2)`.  The bound is not
asserted sharp; it simply cannot prove the required theorem.

There is also a direct moving-label scaling failure.  In the frozen Gevrey
majorant, for largest source index `Q`,

\[
 \epsilon=\lambda^{-2},\qquad B_Q\asymp Q^2,
 \qquad Q\asymp\lambda^2
 \quad\Longrightarrow\quad
 \epsilon B_Q\asymp\lambda^2\longrightarrow\infty. \tag{8.3a}
\]

Thus its factorial series is not a decreasing perturbative majorant for a
quadratic family of independently moving labels.  The separately frozen
fixed-label Gevrey strip controls a total moving-order budget of size at
most `O(lambda^2/L^2)` after its uniform strip and projection reserves are
allocated; it is not a theorem for `Theta(lambda^2)` independent source
columns.  Fixed-label least-term depth and moving-label inventory are
different resources and may not be identified.

The moving-label coframe theorem transfers only `N=O(L^2)`.  The growing
transition sampling theorem proves a polynomial defect-relative **upper**
bound for the radical remainder, not a synthesis lower singular value.  Its
compact-projection estimate uses the exponential Fourier cutoff; at a
quadratic cutoff its factor `1/(N*d_LS)` is exponentially adverse.  The
full-source theorem gives

\[
 \mathcal A_{\lambda,\theta}^\sigma
 (\mathcal A_{\lambda,\theta}^\sigma)^*
 \succeq{1\over8\lambda^4}I,                         \tag{8.4}
\]

but explicitly leaves the finite transition-prefix principal angle
unproved.  At the matched quadratic bandwidth there is no count obstruction;
there is also no positive floor theorem.  The Floquet diagonal does not fill
that logical gap.

Finally, a common theta shift leaves all difference frequencies exact:

\[
 t_{n,\theta}-t_{m,\theta}={2\pi(n-m)\over L}.       \tag{8.5}
\]

Folded parity sums replace `n+m` by `n+m+theta/pi`, which is uniformly
comparable away from the separately handled constant row.  This makes a
uniform-twist Cauchy/coercivity extension plausible, but the frozen theorem
does not serialize it.  Even such an extension would locate the dangerous
graph; it would not prove (7.2).

## 9. Divided differences and logarithmic-derivative compensation

Let

\[
 F(z)=\Xi(z)A(z),\qquad \Xi(\rho)=0.                 \tag{9.1}
\]

At a simple zero, the resonant divided difference is

\[
 D_\rho F(z)={F(z)-F(\rho)\over z-\rho}
             ={\Xi(z)A(z)\over z-\rho}.             \tag{9.2}
\]

If it were another actual radical, its cofactor relative to Xi would be
`A(z)/(z-rho)`.  This is holomorphic only if `A(rho)=0`.  In that case
the divided difference still has the full Xi divisor.  If `A(rho)!=0`, the
zero is genuinely removed, but the profile is outside the actual source class
and contributes a global bulk residual.  The same multiplicity argument
applies after removing more than one zero.

The logarithmic derivative has an equally exact obstruction.  Suppose one
formally asks for an admissible source Mellin factor

\[
 m_g(s)={\zeta'(s)\over\zeta(s)}m_f(s)+h(s).         \tag{9.3}
\]

If `rho` is a zeta zero of order `q`, then

\[
 {\zeta'(s)\over\zeta(s)}={q\over s-\rho}+O(1).     \tag{9.4}
\]

Holomorphy of `m_g` forces `m_f(rho)=0`.  Writing
`m_f(s)=(s-rho)u(s)` shows

\[
 \zeta'(s)m_f(s)=\zeta(s)\,q u(s)+O((s-\rho)^{q+1}),
                                                               \tag{9.5}
\]

so the resulting radical transform

\[
 \zeta(s)m_g(s)=\zeta'(s)m_f(s)+\zeta(s)h(s)        \tag{9.6}
\]

still vanishes to order at least `q`.  Residue cancellation across a finite
family merely replaces `m_f` by its combined Mellin factor and gives the
same conclusion.  Without the cancellation, (9.3) is meromorphic and is not
the Mellin transform of an admissible actual source.  Thus compensation
either preserves the common divisor or leaves the source class.

## 10. Exact stopping line

The new positive theorem is

\[
 \boxed{
 \text{a paired, parity-stable Floquet grid exists with}
 \quad\min|\Xi|=\exp\{-o(\lambda^2)\}.}              \tag{10.1}
\]

The exact remaining target is

\[
 \boxed{
 c_{\theta,m}\geq\exp\{-o(\lambda^2)\},\qquad
 d_m\leq\exp\{-c\lambda^2\},}                      \tag{10.2}
\]

for an actual finite prefix whose band contains, or stably graphs onto, the
complete bottom space.  Equations (7.5)--(7.7) make (10.2) a Pair-C theorem,
not a further zero-separation problem.

Complete-circle translation violates the residual; boundary-safe
translation violates the floor; and divisor removal violates actual-source
holomorphy.  High-complexity nontranslated actual sources remain a logically
open route, exactly at the principal-angle gate (10.2).  Nothing in this
note promotes algebraic ideal rank to that quantitative statement.
