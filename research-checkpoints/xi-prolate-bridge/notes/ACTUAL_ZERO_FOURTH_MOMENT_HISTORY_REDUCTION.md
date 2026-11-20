# Actual-zero fourth-moment history reduction

## 0. Exact outcome and claim boundary

This note sharpens the actual-zero history estimate in the nonattained
right-edge branch.  It uses the exact finite projected-anchor transform,
not a continuation of an infinite zero formula.  For a fixed vertex `k`,
put

\[
 c=\left({2\pi\over L}\right)^2,
 \qquad
 A_{4,b}(L)=\sum_{\substack{\alpha\in Z_+\\
                              \Re\alpha\geq b}}
 {e^{(\Re\alpha)L}\over|\alpha|^4},                 \tag{0.1}
\]

where `b>0` is fixed and zeros are counted with multiplicity.  The exact
per-zero remainder contains the finite-anchor rational factor `H_N`.
The admitted growing-order Gevrey estimate makes that factor uniformly
Gaussian-small at **every** actual zero with `Re(alpha)>=b`, independently
of its ordinate.  The surviving explicit terms have a fourth inverse
ordinate.  Consequently

\[
 \boxed{
 |{\cal M}^{\geq b}_k(L)|
 \leq C_{k,b}|p_k|L^{-2}A_{4,b}(L)+O_{k,b}(e^{-d_bL^2}).} \tag{0.2}
\]

There is no hidden effective-height restriction in (0.2).  In particular,
the sharper cancellation-free high-edge gate is

\[
 \boxed{A_{4,b}(L)=o\{L^2\Psi(L)\}.}                \tag{0.3}
\]

The complementary zeros satisfy the improved generic bound

\[
 |{\cal M}^{<b}_k(L)|=O_{k,b}(L^{-3/2}e^{bL}).      \tag{0.4}
\]

If the centered-zero right edge `B>0` is not attained, then for every
`0<b<B` a strengthened scalar Landau argument supplies an unbounded
strict-half-integer natural grid sequence on which

\[
 \boxed{e^{-bL}\Psi(L)\longrightarrow+\infty.}      \tag{0.5}
\]

Thus (0.4) is negligible on that sequence.  If (0.3) also holds on the
**same** sequence, every fixed finite prefix of graph degrees is eventually
positive and its degree ratios tend to four.

This is an exact reduction, not a closure theorem.  The admitted
Hasanalizade--Shen--Wong local count `N(T+1)-N(T)=O(log T)`, positive zero
multiplicities, and the phases carried by `alpha^(-2)` do not currently
prove (0.3).  No Turan or Montgomery estimate supplying that comparison is
admitted.  This note proves no unconditional nonattained-edge selection,
no RH statement, no graph routing, no equation (5.2) of
`DIRECT_RH_ATTACK.md`, and no Lambda bound.  The formal project state
remains `P0_INVALIDATED`.

No `Xi'/Xi` continuation is inserted into the finite-anchor estimate.
The only use of a zero in Section 3 is the exact polynomial divisibility
`widehat(G_j)(z)=P_j(z^2)Xi(z)` at the corresponding actual transform zero.

## 1. Frozen dependencies and notation

The proof is bound to the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` | `ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171` |
| `notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md` | `baa9a4d07f1bfa2e298efeca5ed8d226c2e991330a2f029f5586380ccb8d5c1c` |
| `notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md` | `18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b` |
| `notes/PRIME_SIDE_SIGNED_RIESZ_HISTORY_BARRIER.md` | `ca6fd1e6d34b7872fc55f20e6005cdec0c9c7f81a4ad3ac50187a8b30db5521c` |
| `notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md` | `cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d` |
| `notes/ATTAINED_RIGHT_EDGE_VECTOR_SELECTION_THEOREM.md` | `6f67349e53e761744408bfa053874ce4f79b22aac578fa6fff48fa5915e65edf` |
| `notes/ZERO_SAMPLING_SOURCE_AUDIT.md` | `f17f843414a18b47a2abf4b4386f99dcbb420d1912c69e99d34fe4bc8ccdd0f4` |

Retain the natural schedule

\[
 \lambda={r\over2},\quad r\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad N=\lceil\lambda\rceil,       \tag{1.1}
\]

and the normalized-even anchor coordinates

\[
 F_L(t)=\sqrt L f_N(t)=\sum_{j=0}^Np_j\cos(a_jt),
 \qquad a_j={2\pi j\over L},\qquad a_j^2=cj^2.       \tag{1.2}
\]

For fixed `k>=1`, use the exact history kernel

\[
 \begin{aligned}
 Q_{k,L}(t)&=k^2\sum_{\substack{0\leq j\leq N\\j\ne k}}
 p_j{\cos(k\omega t)-\cos(j\omega t)\over k^2-j^2},\\
 S_{k,L}(t)&=-p_k\{\cos(k\omega t)-1\}+Q_{k,L}(t),
 \qquad \omega={2\pi\over L},
 \end{aligned}                                      \tag{1.3}
\]

and

\[
 {\cal M}_k(L)=\int_0^L\Psi(t)S_{k,L}'(t)\,dt.      \tag{1.4}
\]

The improved localization theorem in the frozen prime-side note gives

\[
 \boxed{\|S_{k,L}''\|_1=O_k(L^{-3/2}).}             \tag{1.5}
\]

Choose one zero `alpha` from each pair `{alpha,-alpha}`, with
`beta=Re(alpha)>=0`, and pair conjugates.  The global count gives

\[
 \sum_{\alpha\in Z_+}|\alpha|^{-2}<\infty.          \tag{1.6}
\]

There is no real centered zero, and discreteness therefore gives a
qualitative `gamma_0>0` such that, writing `alpha=beta+i*gamma`,
`|gamma|>=gamma_0`.  Since `0<=beta<1/2`, `|alpha|` and `|gamma|` are
uniformly comparable.  All constants below may depend on the fixed `k`
and fixed positive `b`, never on `gamma`.

## 2. Exact per-zero collective identity

Put

\[
 C_\alpha(L)=\cosh(\alpha L)-1.                     \tag{2.1}
\]

The actual centered-zero cosine formula gives the contribution of one
`alpha` to `A_j` and `g=A_0` as

\[
 A_j^{(\alpha)}=-{2C_\alpha(L)\over\alpha^2+cj^2},
 \qquad
 g^{(\alpha)}=-{2C_\alpha(L)\over\alpha^2}.         \tag{2.2}
\]

The exact all-vertex remainder is

\[
 {\cal M}_k=-p_k(A_k-g)
 +k^2\sum_{j\ne k}p_j{A_k-A_j\over k^2-j^2}.       \tag{2.3}
\]

### Proposition 2.1 (one-zero identity)

With removable values understood at a lattice resonance, the contribution
of `alpha` to (2.3) is

\[
 \boxed{
 {\cal M}_{k,\alpha}(L)=
 {2ck^2C_\alpha(L)\over\alpha^2+ck^2}
 \left\{
 \sum_{j\ne k}{p_j\over\alpha^2+cj^2}
 -{p_k\over\alpha^2}
 \right\}.}                                        \tag{2.4}
\]

**Proof.**  From (2.2),

\[
 A_k^{(\alpha)}-A_j^{(\alpha)}
 ={2c(k^2-j^2)C_\alpha(L)\over
   (\alpha^2+ck^2)(\alpha^2+cj^2)}.                 \tag{2.5}
\]

The first term of (2.3) is

\[
 -{2ck^2p_kC_\alpha(L)\over
   \alpha^2(\alpha^2+ck^2)}.                        \tag{2.6}
\]

Substitution of (2.5)--(2.6) into (2.3) proves (2.4).  The original
integral fixes any removable value.  \(\square\)

Now set

\[
 s=-{i\alpha\over\sqrt c}=-{i\alpha L\over2\pi},
 \qquad
 H_N(s)=p_0+s^2\sum_{j=1}^N{p_j\over s^2-j^2}.      \tag{2.7}
\]

The finite rational identity is

\[
 \boxed{
 \sum_{j=0}^N{p_j\over\alpha^2+cj^2}
 ={H_N(s)\over\alpha^2}.}                          \tag{2.8}
\]

Therefore (2.4) is equivalently

\[
 \boxed{
 {\cal M}_{k,\alpha}(L)=
 {2ck^2C_\alpha(L)\over\alpha^2+ck^2}
 \left\{
 {H_N(s)\over\alpha^2}
 -{p_k\over\alpha^2+ck^2}
 -{p_k\over\alpha^2}
 \right\}.}                                        \tag{2.9}
\]

Equation (2.9) is the decisive exact split: `H_N` is the moving
high-zero finite-anchor residual, while both remaining terms explicitly
carry `p_k` and four inverse ordinate powers after the outer factor is
included.

## 3. Uniform finite-anchor residual at every high-edge zero

Let `f_lambda=P_N X_lambda` in the locked source normalization, and take
the formal growing-order approximation

\[
 G_{\lambda,J}=\sum_{j=0}^J\lambda^{-2j}G_j,
 \qquad J=\lfloor A_0L\rfloor.                      \tag{3.1}
\]

Equations (3.6)--(3.8) of the frozen natural-cutoff note give

\[
 \|f_\lambda-G_{\lambda,J}\|_{L^2(-L/2,L/2)}
 \leq Ce^{-dL^2}.                                   \tag{3.2}
\]

The exact polynomial divisibility there is

\[
 \widehat G_j(z)=P_j(z^2)\Xi(z).                   \tag{3.3}
\]

For a centered zero `alpha`, take

\[
 z=-i\alpha=\gamma-i\beta,
 \qquad \Xi(z)=\xi_R(1/2+\alpha)=0.                \tag{3.4}
\]

Thus the full-line transform of (3.1) vanishes exactly at `z`; no
logarithmic derivative or continued zero sum is being evaluated.

### Lemma 3.1 (uniform weighted transform error)

For each fixed `b>0`, there are `C_b,d_b>0` such that, uniformly over all
actual zeros with `beta>=b`,

\[
 \boxed{
 |\widehat f_\lambda(-i\alpha)|
 \leq C_b e^{\beta L/2}e^{-d_bL^2}.}                \tag{3.5}
\]

**Proof.**  Weighted Cauchy--Schwarz and (3.2) give

\[
 \begin{aligned}
 \left|\int_{-L/2}^{L/2}
 (f_\lambda-G_{\lambda,J})(t)e^{-\alpha t}\,dt\right|
 &\leq Ce^{-dL^2}
 \left(\int_{-L/2}^{L/2}e^{-2\beta t}\,dt\right)^{1/2}\\
 &\leq C_be^{\beta L/2}e^{-dL^2}.                  \tag{3.6}
 \end{aligned}
\]

The real oscillation `e^(-i*gamma*t)` has modulus one, so this estimate is
independent of `gamma`.  It remains to compare the finite-interval formal
transform with its zero full-line transform.  Equations (3.9a)--(3.9c) of
the frozen note give, for Hermite support `K=O(L)` and `u>=lambda`,

\[
 |E(F)(u)|\leq C e^{CK}u^{1/2}e^{-du^2}.            \tag{3.7}
\]

Exact inversion evenness treats both tails.  Since `0<=beta<1/2`, the
change of variables `u=e^{|t|}` leaves a factor
`u^(beta-1/2)<=1`.  Hence the weighted full-line tail is at most

\[
 Ce^{CL}\int_\lambda^\infty e^{-du^2}\,du
 \leq \exp\{CL-d'e^L\}=O(e^{-d''L^2}).              \tag{3.8}
\]

The decreasing Gevrey correction sum preserves (3.8), exactly as in the
frozen proof.  Combine (3.3)--(3.8).  \(\square\)

The exact finite transform formula is

\[
 \widehat f_\lambda(z)
 = {\sqrt L\over\pi}{\sin(\pi s)\over s}H_N(s),
 \qquad s={zL\over2\pi}.                            \tag{3.9}
\]

At (3.4),

\[
 |\sin(\pi s)|^2
 =\sin^2(\gamma L/2)+\sinh^2(\beta L/2).           \tag{3.10}
\]

For `beta>=b` and large `L`, (3.10) is bounded below by a fixed positive
multiple of `e^(beta*L)`.  The exponential weight in (3.5) therefore
cancels exactly against the sine denominator.

### Theorem 3.2 (uniform actual-zero `H_N` bound)

For every fixed `b>0`, uniformly over the complete actual-zero multiset
with `Re(alpha)>=b`,

\[
 \boxed{
 |H_N(-i\alpha L/(2\pi))|
 \leq C_b|\alpha|\sqrt L\,e^{-d_bL^2}.}             \tag{3.11}
\]

**Proof.**  Solve (3.9) for `H_N`, use
`|s|=|alpha|L/(2*pi)`, then apply (3.5) and (3.10).  \(\square\)

The bound is uniform on the whole ordinate line.  No condition such as
`|gamma|<=exp(o(L^2))` is present.

## 4. The high-edge fourth-moment estimate

For fixed `k` and large `L`, `a_k<gamma_0/2`, so

\[
 |\alpha^2+ck^2|\asymp_k|\alpha|^2                 \tag{4.1}
\]

uniformly on `beta>=b`.  Also

\[
 |C_\alpha(L)|\leq C_be^{\beta L}.                 \tag{4.2}
\]

### Theorem 4.1 (fourth-moment high-edge reduction)

For every fixed `k>=1` and `b>0`, equation (0.2) holds.

**Proof.**  Apply (3.11), (4.1), and (4.2) to the `H_N` term in (2.9).
Its absolute contribution is at most

\[
 C_{k,b}L^{-3/2}e^{-d_bL^2}
 \sum_{\Re\alpha\geq b}{e^{\beta L}\over|\alpha|^3}
 \leq C_{k,b}L^{-3/2}e^{-d_bL^2+L/2}
 \sum_{\alpha\in Z_+}|\alpha|^{-3}.                \tag{4.3}
\]

The last sum is finite by (1.6) and the lower bound away from zero.  After
decreasing `d_b`, (4.3) is `O(e^(-d_b*L^2))`.

Each of the two explicit `p_k` terms in (2.9) is bounded by

\[
 C_{k,b}|p_k|L^{-2}{e^{\beta L}\over|\alpha|^4}.    \tag{4.4}
\]

Summing (4.4) gives the first term in (0.2).  \(\square\)

The powers in (4.3)--(4.4) are worth recording.  The outer `c` contributes
`L^(-2)` and `|alpha|^(-2)`.  The residual (3.11) contributes
`sqrt(L)*|alpha|`, leaving `L^(-3/2)|alpha|^(-3)` with a Gaussian factor.
The explicit terms instead contribute one further
`|alpha|^(-2)`, leaving exactly `L^(-2)|alpha|^(-4)`.  No power of `L` or
`gamma` is discarded between (2.9) and (0.2).

## 5. Low-edge bound and strengthened strict-grid Landau lemma

Split the unconditional history formula at `b`:

\[
 {\cal M}_k(L)=\sum_{\alpha\in Z_+}{1\over\alpha^3}
 \left\{\int_0^Le^{-\alpha t}S_{k,L}''(t)\,dt
       -\int_0^Le^{ \alpha t}S_{k,L}''(t)\,dt\right\}.
                                                               \tag{5.1}
\]

For `0<=beta<b`, (1.5)--(1.6) immediately give

\[
 \boxed{
 |{\cal M}^{<b}_k(L)|
 \leq C_kL^{-3/2}(1+e^{bL})
       \sum_{\alpha\in Z_+}|\alpha|^{-3}
 =O_{k,b}(L^{-3/2}e^{bL}).}                         \tag{5.2}
\]

This use of (5.1) includes any removable lattice resonance and makes no
finite-transform claim at `beta=0`.

Now assume the nonattained branch

\[
 0<B=\sup_{\alpha\in Z_+}\Re\alpha,
 \qquad \Re\alpha<B\quad\hbox{for every }\alpha.   \tag{5.3}
\]

### Lemma 5.1 (exponentially strengthened scalar Landau selection)

For every fixed `0<b<B`,

\[
 \boxed{
 \limsup_{t\to\infty}e^{-bt}\Psi(t)=+\infty.}      \tag{5.4}
\]

Moreover there is an unbounded strict-half-integer natural grid sequence
on which the ratio in (5.4) tends to `+infinity`.

**Proof.**  Choose a centered zero
`alpha_*=beta_*+i*gamma_*` with `beta_*>b`.  If (5.4) were finite, then
for some `C,T` the function

\[
 h(t)=Ce^{bt}-\Psi(t)\geq0\qquad(t\geq T)           \tag{5.5}
\]

would be nonnegative.  In its initial convergence half-plane its tail
Laplace transform is

\[
 H(s)={Ce^{-(s-b)T}\over s-b}
 -{1\over s^2}{\xi_R'\over\xi_R}(1/2+s)
 +\int_0^Te^{-st}\Psi(t)\,dt.                      \tag{5.6}
\]

The locked PNT estimate gives a finite abscissa `sigma_c<=1/2`.  The pole
of the second term at `alpha_*` forces `sigma_c>=beta_*>b`; otherwise the
defining nonnegative tail transform would be holomorphic at `alpha_*` and
the identity theorem would remove that pole.  At the real point
`sigma_c`, the comparator pole at `b` is absent, while
`xi_R(1/2+sigma_c)` is nonzero because zeta has no real zero in `(0,1)`
and the endpoint is nonzero.  Thus the continued right side of (5.6) is
holomorphic at `sigma_c`, contradicting the eventual-nonnegative Laplace
barrier.  This proves (5.4).

Choose real `t_j` with `e^(-b*t_j)Psi(t_j)->+infinity`, and let `L_j` be
the nearest strict-half-integer logarithmic grid point.  The elementary
grid estimate gives

\[
 |L_j-t_j|\leq2e^{-t_j/2}.                           \tag{5.7}
\]

The locked PNT derivative envelope then gives

\[
 |\Psi(L_j)-\Psi(t_j)|
 \leq C(1+t_j^2)e^{-a\sqrt {t_j}}=o(e^{bt_j}).      \tag{5.8}
\]

Also `e^(bL_j)/e^(bt_j)->1`, so (5.8) preserves the divergent normalized
positive values.  \(\square\)

On the sequence from Lemma 5.1, (5.2) and the fixed-mode asymptotic
`|p_k|\asymp_k L^(-1/2)` give

\[
 { |{\cal M}^{<b}_k(L)|\over |p_k|\Psi(L)}
 =O_{k,b}\left({e^{bL}\over L\Psi(L)}\right)=o(1). \tag{5.9}
\]

## 6. Conditional simultaneous fixed-prefix consequence

### Theorem 6.1 (exact remaining fourth-moment gate)

Assume (5.3), fix `0<b<B`, and take a strict-half-integer grid sequence
from Lemma 5.1.  Suppose, on that same sequence, that

\[
 \boxed{A_{4,b}(L)=o\{L^2\Psi(L)\}.}                \tag{6.1}
\]

Then for every fixed `K`, simultaneously for `1<=k<=K`,

\[
 \boxed{{\cal M}_k(L)=o\{|p_k|\Psi(L)\}.}           \tag{6.2}
\]

Consequently, eventually on the sequence,

\[
 \boxed{d_k(L)>0\qquad(0\leq k\leq K),}            \tag{6.3}
\]

and, for every fixed `1<=k<=K`,

\[
 \boxed{{d_k(L)\over d_0(L)}\longrightarrow4.}     \tag{6.4}
\]

**Proof.**  The high part is `o(|p_k|Psi)` by (0.2), (6.1), and the
Gaussian remainder; the low part is negligible by (5.9).  The constants
are uniform over a fixed finite set of vertices, proving (6.2).

The all-order convolution estimate gives
`J_L=O_A(lambda^(-A))` for every fixed `A`, hence

\[
 {\sqrt L|J_L|\over|p_k|\Psi(L)}\longrightarrow0   \tag{6.5}
\]

because `Psi(L)/e^(bL)->+infinity`.  Insert (6.2)--(6.5) into the exact
identities

\[
 E_k=\sqrt L J_L+{\cal M}_k,
 \qquad
 d_k={2p_k^2\over L}\Psi+{2p_k\over L}E_k.         \tag{6.6}
\]

For `k=0`, `M_0=0`.  The fixed-mode limits

\[
 \sqrt Lp_0\to C>0,
 \qquad \sqrt Lp_k\to2(-1)^kC                     \tag{6.7}
\]

now prove (6.3)--(6.4).  \(\square\)

Theorem 6.1 is conditional only on the scalar comparison (6.1) along the
selected sequence.  It does not assume RH and it does not alter the exact
pole--archimedean--minus-prime source cancellation.

## 7. What HSW supplies, and the surviving barrier

The frozen HSW count implies, with multiplicity,

\[
 N(T+1)-N(T)=O(\log T).                              \tag{7.1}
\]

Together with the zero-free compact interval at the origin, (7.1) implies
the inverse-power summability used above and makes `A_{4,b}(L)` finite for
each fixed `L`.  Positive multiplicities make it a positive majorant.

That is all the local count contributes here.  It controls ordinates, but
(6.1) compares:

1. a positive sum weighted by both the moving abscissae and fourth inverse
   ordinates; and
2. the signed phase sum `Psi`, whose coefficients contain
   `alpha^(-2)` and whose oscillations contain `e^(i*gamma*L)`.

The local `O(log T)` count gives neither a quantitative relation between
`B-beta` and `gamma` nor a recurrence time before the weights
`e^(beta*L)` drift.  Positivity of multiplicity does not remove the complex
coefficient phases.  Therefore neither (7.1) nor any result proved in this
package establishes (6.1).

Two simple obstruction models also do not settle the issue after the new
gain.  Sparse Fejer blocks respecting a local count lose against the extra
factor `L`, while realizing equal-abscissa Fejer weights by large
multiplicities forces a huge carrier height and is suppressed by the
fourth inverse ordinate.  This rules out those two naive counterblock
arguments; it is not a Turan theorem and not a counterconfiguration for
the actual zeros.

The exact surviving task is thus fail-closed:

\[
 \boxed{
 \text{on one strengthened-Landau grid sequence, prove or refute }
 A_{4,b}(L)=o\{L^2\Psi(L)\}.}                       \tag{7.2}
\]

No admitted zero-count, zero-free-region, PNT-magnitude, or scalar Landau
statement presently decides (7.2).
