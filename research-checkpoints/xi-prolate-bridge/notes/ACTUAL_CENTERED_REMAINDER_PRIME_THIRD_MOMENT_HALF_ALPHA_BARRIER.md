# Actual centered-remainder prime third-moment half-alpha barrier

## 0. Exact outcome and claim boundary

Put

\[
 x=\lambda^2,\qquad L=\log x,                         \tag{0.1}
\]

and retain the centered remainder statistics from the frozen phase-volume
reduction.  This note sharpens the previously frozen fourth-moment barrier.
For every fixed `A>0` and every fixed

\[
 {1\over2}<\alpha<1,                                  \tag{0.2}
\]

one has

\[
 \boxed{
 \mathfrak R_{\lambda,\alpha},\quad
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha}\lambda^4L.}                          \tag{0.3}
\]

Consequently neither centered statistic is
`O(lambda^2/L)` for any fixed `alpha` in (0.2).

The new input is the asymptotic vanishing of the normalized third moment of
the prime polynomial on the translated interval

\[
 I_x=[Ax^2,2Ax^2].                                    \tag{0.4}
\]

The mixed third moment is controlled by polarizing the Montgomery--Vaughan
mean-value theorem between `P_x^2` and `P_x`.  Their semiprime and prime
frequency supports are disjoint.  Together with the already-frozen fourth
moment, this implies a compact moment lemma: a normalized asymptotically
mean-zero, unit-second-moment, asymptotically zero-skew family with uniformly
bounded fourth moment must have positive excess above every fixed level
`c<1`.

The frozen phase-volume comparison remains one-way.  Equation (0.3) gives
no lower bound for the actual phase volume.  Nothing is proved here for
`0<alpha<=1/2`, and no determinant convergence, zero-location theorem,
Riemann hypothesis, converse, or de Bruijn--Newman bound follows.  The
formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies and source lineage

The exact local inputs are:

| Frozen path | SHA-256 |
|---|---|
| `notes/ACTUAL_PHASE_VOLUME_CENTERED_PNT_REMAINDER_REDUCTION_BARRIER.md` | `2b2a40a4ec087c77145b45fc54d8a5782a85ecd122b2d599d2c2d8a067b714f1` |
| `tests/test_actual_phase_volume_centered_pnt_remainder_reduction_barrier.py` | `7fbcdf15dde20d3d2a00303f74d5441ee143af74ae269992fe79b1fb0c97456f` |
| `notes/ACTUAL_CENTERED_REMAINDER_PRIME_FOURTH_MOMENT_LOWER_BARRIER.md` | `920b6434cc89c663ae95f6f7803780cd164e99b8e5cdc82c2de1a3655171035a` |
| `tests/test_actual_centered_remainder_prime_fourth_moment_lower_barrier.py` | `de1e282b5106d0dc3ecb95a19773433baff029f1ff7cb5c45229e86374696fe7` |

The phase-reduction pair supplies the exact definitions of
`R_lambda`, `mathfrak R_(lambda,alpha)`, its high-time restriction, and the
one-way phase-volume comparison.  The prior fourth-moment pair supplies the
PNT second moment, the translated weighted mean-value theorem, the prime-square
fourth moment, and the uniformly bounded proper-prime-power noise.

The substantive primary input inherited through that pair is H. L.
Montgomery and R. C. Vaughan, *Hilbert's Inequality*, *Journal of the London
Mathematical Society* (2) **8** (1974), 73--82, DOI
<https://doi.org/10.1112/jlms/s2-8.1.73>, Corollary 2, equations
(1.8)--(1.9).  It remains external and unvendored.  No new external input,
source lock, vendored byte, zero table, numerical sample, or artifact is
added.

For reference, the inherited translated-interval consequence is this.  If

\[
 F(t)=\sum_{2\leq n\leq N}c_nn^{it}
\]

and `I` has length `T`, then

\[
 \boxed{
 \left|\int_I|F(t)|^2dt-T\sum_n|c_n|^2\right|
 \leq{9\pi\over2}\sum_n n|c_n|^2.}                  \tag{1.1}
\]

Translation of `I` only changes the coefficients by unit phases, so the
error in (1.1) is uniform in the location of the interval.

## 2. Frozen first, second, and fourth moments

Write

\[
 P_x(t)=\sum_{p\leq x}a_pp^{it},\qquad
 a_p={\log p\over\sqrt p},\qquad Y_x=\operatorname {Re}P_x, \tag{2.1}
\]

and normalize the interval (0.4) by

\[
 T=Ax^2,\qquad
 \mathbb E_xf={1\over T}\int_{I_x}f(t)\,dt.           \tag{2.2}
\]

The frozen PNT calculation gives

\[
 S_x:=\sum_{p\leq x}a_p^2
 =\left({1\over2}+o(1)\right)L^2,                    \tag{2.3}
\]

\[
 \sum_{p\leq x}(\log p)^2=O(xL),\qquad
 \sum_{p\leq x}a_p=O(\sqrt x).                       \tag{2.4}
\]

The inherited endpoint and mean-value estimates are

\[
 \mathbb E_xY_x=o(1),\qquad
 \mathbb E_xY_x^2=\left({1\over2}+o(1)\right)S_x,     \tag{2.5}
\]

\[
 \mathbb E_x|P_x|^4=\left(2+o(1)\right)S_x^2,
 \qquad
 \mathbb E_xY_x^4\leq\left(2+o(1)\right)S_x^2.       \tag{2.6}
\]

Define the exact root-second-moment scale

\[
 \sigma_x^2=\mathbb E_xY_x^2.                         \tag{2.7}
\]

Equations (2.3), (2.5), and (2.6) imply

\[
 \sigma_x=\left({1\over2}+o(1)\right)L,qquad
 {\mathbb E_xY_x^4\over\sigma_x^4}\leq8+o(1).       \tag{2.8}
\]

Only the bounded fourth moment in (2.8), not an exact fourth moment for
`Y_x`, will be used below.

## 3. The translated third moment

Expand

\[
 P_x(t)^2=\sum_{n\leq x^2}b_nn^{it}.                  \tag{3.1}
\]

Unique factorization gives

\[
 b_{p^2}=a_p^2,\qquad b_{pq}=2a_pa_q\quad(p<q).       \tag{3.2}
\]

Thus the support of `(b_n)` consists of semiprimes and is disjoint from the
prime support of `P_x`.  Put

\[
 W_1=\sum_{p\leq x}p|a_p|^2,
 \qquad W_2=\sum_{n\leq x^2}n|b_n|^2.                \tag{3.3}
\]

The exact weighted convolution identity is

\[
 W_1=\sum_{p\leq x}(\log p)^2=O(xL),                 \tag{3.4}
\]

\[
 W_2=2\left(\sum_{p\leq x}(\log p)^2\right)^2
       -\sum_{p\leq x}(\log p)^4
 =O(x^2L^2).                                          \tag{3.5}
\]

Let

\[
 J_x=\int_{I_x}P_x(t)^2\overline {P_x(t)}\,dt.       \tag{3.6}
\]

For brevity, write

\[
 \|F\|_{I_x}^2=\int_{I_x}|F(t)|^2\,dt.                \tag{3.6a}
\]

Apply (1.1) to `P_x^2+zeta P_x` for
`zeta in {1,-1,i,-i}`.  Disjointness of the two coefficient supports makes
every diagonal coefficient sum equal to the sum of the two separate
diagonals.  The exact complex polarization identity therefore gives

\[
 4J_x=\|P_x^2+P_x\|_{I_x}^2-\|P_x^2-P_x\|_{I_x}^2
 +i\|P_x^2+iP_x\|_{I_x}^2-i\|P_x^2-iP_x\|_{I_x}^2,  \tag{3.7}
\]

and hence

\[
 |J_x|\leq{9\pi\over2}(W_1+W_2)=O(x^2L^2).           \tag{3.8}
\]

After division by `T=Ax^2`,

\[
 \mathbb E_x(P_x^2\overline {P_x})=O_A(L^2).         \tag{3.9}
\]

The purely analytic cubic has no zero frequency.  Direct endpoint
integration and (2.4) give

\[
 \begin{aligned}
 |\mathbb E_xP_x^3|
 &\leq{2\over T\log8}\left(\sum_{p\leq x}a_p\right)^3\\
 &=O_A(x^{-1/2}).
 \end{aligned}                                       \tag{3.10}
\]

Since

\[
 Y_x^3={1\over8}
 \left(P_x^3+3P_x^2\overline {P_x}
 +3P_x\overline {P_x}^{2}+\overline {P_x}^{3}\right), \tag{3.11}
\]

and the last two terms are the conjugates of the first two after integration,

\[
 \mathbb E_xY_x^3
 ={1\over4}\operatorname {Re}\mathbb E_xP_x^3
 +{3\over4}\operatorname {Re}
       \mathbb E_x(P_x^2\overline {P_x}).             \tag{3.11a}
\]

equations (3.9)--(3.10) prove

\[
 \boxed{\mathbb E_xY_x^3=O_A(L^2)=o(L^3).}           \tag{3.12}
\]

No independent-phase or Gaussian model is used.

## 4. A compact moment lemma below one normalized unit

We use the following deterministic probability lemma.

**Lemma.**  Let `(Z_j)` be real random variables such that

\[
 \mathbb EZ_j\longrightarrow0,\qquad
 \mathbb EZ_j^2=1,\qquad
 \mathbb EZ_j^3\longrightarrow0,qquad
 \sup_j\mathbb EZ_j^4<\infty.                        \tag{4.1}
\]

Then, for every fixed `0<c<1`,

\[
 \boxed{\liminf_{j\to\infty}\mathbb E(Z_j-c)_+>0.}  \tag{4.2}
\]

To prove the lemma, suppose a subsequence made the expectation in (4.2)
tend to zero.  The second moment gives tightness, so a further subsequence
converges weakly to a real random variable `Z`.  The fourth-moment bound
makes `|Z_j|^k` uniformly integrable for `k=1,2,3`.  Hence

\[
 \mathbb EZ=0,\qquad \mathbb EZ^2=1,
 \qquad \mathbb EZ^3=0.                              \tag{4.3}
\]

Portmanteau applied to the nonnegative continuous positive-part function
gives `E(Z-c)_+=0`, so `Z<=c` almost surely.  Therefore, for every real `a`,

\[
 0\leq\mathbb E\{(c-Z)(Z-a)^2\}
 =c(1+a^2)+2a.                                       \tag{4.4}
\]

Taking `a=-1/c` makes the right side

\[
 c-{1\over c}<0,                                     \tag{4.5}
\]

a contradiction.  This proves the lemma.  The fourth moment is used only
for uniform integrability; no convergence to a particular limiting law is
asserted.

Now put

\[
 Z_x={Y_x\over\sigma_x}.                              \tag{4.6}
\]

Equations (2.5), (2.8), and (3.12) verify every hypothesis of the lemma:

\[
 \mathbb E_xZ_x=o(1),\qquad
 \mathbb E_xZ_x^2=1,\qquad
 \mathbb E_xZ_x^3=o(1),\qquad
 \mathbb E_xZ_x^4\leq8+o(1).                        \tag{4.7}
\]

Consequently, for each fixed `0<c<1`, there is a constant
`delta_(A,c)>0` such that, for all sufficiently large `x`,

\[
 \boxed{
 \mathbb E_x(Y_x-c\sigma_x)_+
 =\sigma_x\mathbb E_x(Z_x-c)_+
 \geq\delta_{A,c}\sigma_x\gg_{A,c}L.}              \tag{4.8}
\]

## 5. The half-alpha threshold and centered remainder

Write

\[
 \beta=1-\alpha.                                     \tag{5.1}
\]

Since `h` is increasing on the positive half-line, put

\[
 q_x:=\sup_{t\in I_x}{\beta\over2}h(t)
 ={\beta\over4}\log(1+16A^2x^4)
 =\beta L+O_{A,\alpha}(1).                            \tag{5.2}
\]

Together with (2.8), this is the exact threshold comparison

\[
 {q_x\over\sigma_x}\longrightarrow2\beta.           \tag{5.3}
\]

If `alpha>1/2`, then `0<2beta<1`.  Fix once and for all

\[
 2\beta<c<1.                                         \tag{5.4}
\]

For all sufficiently large `x`, (5.3) gives

\[
 {\beta\over2}h(t)\leq c\sigma_x\qquad(t\in I_x).  \tag{5.5}
\]

Split the inclusive prime-power polynomial as in the frozen note:

\[
 R_\lambda(t)=P_x(t)+H_x(t)-M_\lambda(t),             \tag{5.6}
\]

and put

\[
 W_x(t)=\operatorname {Re}\{H_x(t)-M_\lambda(t)\}.  \tag{5.7}
\]

The inherited proper-prime-power and continuous-main estimates give

\[
 \mathbb E_x|W_x|\leq\sqrt{Q_\infty}+o(1)=O(1).      \tag{5.8}
\]

For real `y,w` and `q>=0`,

\[
 [y+w-q]_+\geq[y-q]_+-|w|.                            \tag{5.9}
\]

Equations (4.8), (5.5), (5.8), and (5.9) yield

\[
 \begin{aligned}
 \mathbb E_x\left[
 \operatorname {Re}R_\lambda(t)-{\beta\over2}h(t)
 \right]_+
 &\geq\mathbb E_x(Y_x-c\sigma_x)_+-\mathbb E_x|W_x|\\
 &\gg_{A,\alpha}L.
 \end{aligned}                                       \tag{5.10}
\]

The defining integrand satisfies

\[
 [2\operatorname {Re}R_\lambda(t)-\beta h(t)]_+
 =2\left[\operatorname {Re}R_\lambda(t)
                  -{\beta\over2}h(t)\right]_+.       \tag{5.11}
\]

Restricting its integral to the single positive interval `I_x` proves

\[
 \boxed{
 \mathfrak R_{\lambda,\alpha}
 \gg_{A,\alpha}x^2L
 =\lambda^4L.}                                       \tag{5.12}
\]

The high-time cutoff is

\[
 T_0={\lambda\over(\log\lambda)^2}
 ={4\sqrt x\over L^2}=o(Ax^2).                      \tag{5.13}
\]

Thus `I_x` lies in `|t|>T_0` for all sufficiently large `x`, and the same
restriction proves

\[
 \boxed{
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha}\lambda^4L.}                          \tag{5.14}
\]

## 6. Exact stopping line

The third moment removes the symmetric two-point obstruction that limited
the prior second/fourth-moment argument.  It does not prove an all-threshold
tail.  The present compact moment lemma reaches every fixed normalized
level below one, while the split threshold tends to `2(1-alpha)`.  It stops
exactly when that limiting level reaches one, namely at `alpha=1/2`.

This endpoint is genuinely invisible to the stated moment data: the
symmetric random variable taking the values `-1` and `1` with equal
probability has mean zero, variance one, third moment zero, bounded fourth
moment, and `(Z-1)_+=0` identically.

No claim is made at the endpoint or below it.  Additional moments or direct
arithmetic distribution information would be needed to cross that line.
Most importantly, the frozen relation remains

\[
 \Phi_\lambda(U,g)
 \leq\mathfrak M_{\lambda,\alpha}(C)
       +\mathfrak R_{\lambda,\alpha}.                 \tag{6.1}
\]

A lower bound for the rightmost term cannot be reversed into a lower bound
for `Phi_lambda`.  Thus (0.3) invalidates the proposed centered-remainder
upper-bound route for every fixed `alpha>1/2`, but proves no actual
phase-volume lower bound, dangerous-projector capture, weighted coframe
rate, parity ordering, determinant convergence, unconditional zero theorem,
RH proof or converse, or de Bruijn--Newman bound.  The formal state remains
`P0_INVALIDATED`.
