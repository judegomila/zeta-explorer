# Fixed-prefix edge-sign synchronization

## 0. Exact outcome and claim boundary

Let the centered-zero right edge `B>0` be nonattained.  Fix `K>=1`, put

\[
 q_k=\left({2\pi k\over L}\right)^2,
 \qquad F_k=I-q_kT_{q_k},                            \tag{0.1}
\]

and retain the strict natural-grid record sequence of the frozen
nonattained-edge theorem, with

\[
 B\theta_K<\eta<B,
 \qquad \theta_K=1-{x_0\over2\pi K},
 \qquad 3\sin x_0+x_0\cos x_0=0.                   \tag{0.2}
\]

On that same sequence, every fixed-prefix cross-filter is eventually
positive:

\[
 \boxed{
 Z_{ij}(L_n):=(F_iF_j\Psi)(L_n)>0
 \qquad(0\leq i,j\leq K).}                         \tag{0.3}
\]

For distinct vertices the exact source-Cauchy divided difference is

\[
 \boxed{D_{ij}=-Z_{ij}.}                            \tag{0.4}
\]

The fixed-mode coordinate signs are eventually
`sign(p_k)=(-1)^k`.  Hence the exact edge weights satisfy

\[
 \boxed{
 w_{ij}>0\iff i+j\ \hbox{is odd},
 \qquad
 w_{ij}<0\iff i+j\ \hbox{is even}
 \quad(i\ne j,\ 0\leq i,j\leq K).}                \tag{0.5}
\]

Thus the positive-edge graph on the fixed prefix is the complete bipartite
graph between the even and odd vertices, and is connected.  This is a
sign theorem for each fixed prefix.  A diagonal extraction gives only an
unquantified growing prefix; it gives no comparison with the natural outer
dimension and no result for a complete natural finite section.

The connected positive subgraph does not make the signed Laplacian positive
semidefinite: all same-parity edges have the opposite sign, and their
effective-resistance load is not controlled here.  No routing contraction,
finite hyperbolicity, Lambda bound, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or Riemann-hypothesis statement is proved.  The
formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies and notation

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/NONATTAINED_HIGH_EDGE_RECORD_FILTER_THEOREM.md` | `14be9eca50d64ff2c4c6710e1523238e1a3df21464f40b13b9ab86478b0e61ae` |
| `notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md` | `18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b` |
| `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` | `ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171` |
| `notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md` | `cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d` |

Put

\[
 a_k={2\pi k\over L},\qquad q_k=a_k^2.             \tag{1.1}
\]

For `k>=1`, let `T_k=T_(q_k)` be the causal zero-data inverse

\[
 (T_ku)(t)=\int_0^t{\sin\{a_k(t-v)\}\over a_k}u(v)\,dv.
                                                               \tag{1.2}
\]

At the anchor set `F_0=I`; no value of `T_0` is needed.  All operators
below act on `[0,L]`, and an operator expression without a displayed
argument is evaluated at `L`.  Put

\[
 P=\Psi(L),\qquad U_k=F_k\Psi.                     \tag{1.3}
\]

The exact actual-centered-zero relation is

\[
 A_k=-U_k\quad(k\geq0),                            \tag{1.4}
\]

where `A_0=-P`.

## 2. Exact cross-filter kernel and the edge divided difference

For distinct positive `i,j`, the causal resolvents commute and obey

\[
 T_iT_j={T_i-T_j\over q_j-q_i}.                    \tag{2.1}
\]

Since

\[
 F_iF_j=I-\mathcal C_{ij},
 \qquad
 \mathcal C_{ij}=q_iT_i+q_jT_j-q_iq_jT_iT_j,       \tag{2.2}
\]

At the boundaries this means
`C_(0j)=q_j*T_j`, `C_(jj)=2*q_j*T_j-q_j^2*T_j^2`, and
`C_(00)=0`; in particular, no product with an undefined `T_0` is used.

equation (2.1) gives the exact convolution kernel, for `0<=i<j`,

\[
 \boxed{
 \kappa_{ij,L}(u)
 ={a_j^3\sin(a_ju)-a_i^3\sin(a_iu)\over a_j^2-a_i^2},
 \qquad
 (\mathcal C_{ij}f)(L)=\int_0^L\kappa_{ij,L}(L-t)f(t)\,dt.}    \tag{2.3}
\]

The formula includes the anchor boundary `i=0`:

\[
 \kappa_{0j,L}(u)=a_j\sin(a_ju).                   \tag{2.4}
\]

On the diagonal the continuous divided-difference limit is

\[
 \boxed{
 \kappa_{jj,L}(u)
 ={a_j\over2}\{3\sin(a_ju)+a_ju\cos(a_ju)\}.}    \tag{2.5}
\]

This is the correction kernel of
`I-F_j^2=2q_jT_j-q_j^2T_j^2` from the frozen record-filter theorem.

The same resolvent identity gives, for distinct `i,j`,

\[
 \begin{aligned}
 Z_{ij}
 &=P-q_iT_i\Psi-q_jT_j\Psi+q_iq_jT_iT_j\Psi\\
 &={q_iU_i-q_jU_j\over q_i-q_j}.                  \tag{2.6}
 \end{aligned}
\]

Using (1.4) in the exact source-Cauchy formula therefore proves

\[
 D_{ij}={q_iA_i-q_jA_j\over q_i-q_j}
       =-Z_{ij}.                                   \tag{2.7}
\]

There is no prime-side, Gaussian, or finite-anchor residual in (2.7).
Those residuals enter the row sums and degree formulas, not the exact
off-diagonal edge.

## 3. The first negative cross-filter lobe

Assume first `0<i<j`, put `r=i/j`, and use the scaled variable
`y=a_ju`.  Apart from a positive factor, the kernel in (2.3) has sign

\[
 \varphi_r(y)=\sin y-r^3\sin(ry).                  \tag{3.1}
\]

There is a unique `zeta_r` in `(0,pi)` satisfying

\[
 \boxed{\sin\zeta_r=r^3\sin(r\zeta_r).}           \tag{3.2}
\]

Indeed, on `(0,pi)` the ratio

\[
 {\sin y\over\sin(ry)}                            \tag{3.3}
\]

decreases strictly from `1/r` to zero.  Its logarithmic derivative is
`cot(y)-r*cot(ry)`, which is negative because `s*cot(s)` is strictly
decreasing on `(0,pi)`.  The right side of (3.2), after division by
`sin(r*zeta_r)`, is the fixed number `r^3`.  This proves uniqueness and
also shows that `kappa_(ij,L)` is positive before `zeta_r/a_j` and negative
immediately after it.

The location is strictly later than the diagonal first root.  Let

\[
 g(x)=3\sin x+x\cos x,
 \qquad x_0=2.455643862879\ldots                    \tag{3.4}
\]

be its first positive zero.  For `0<r<1`,

\[
 {d\over dr}\{r^3\sin(rx_0)\}
 =r^2g(rx_0)>0.                                    \tag{3.5}
\]

Consequently `r^3*sin(r*x_0)<sin(x_0)`, so

\[
 \boxed{x_0<\zeta_r<\pi.}                         \tag{3.6}
\]

At the two boundaries, set

\[
 \zeta_0=\pi,
 \qquad \lim_{r\uparrow1}\zeta_r=x_0.            \tag{3.7}
\]

The first identity is (2.4).  For the second, division of (3.1) by
`1-r^2` and passage to `r=1` gives `g(y)/2`, exactly the diagonal kernel
in (2.5).

Define, for `0<=i<j`,

\[
 \theta_{ij}=1-{\zeta_{i/j}\over2\pi j}.           \tag{3.8}
\]

Every negative value of `kappa_(ij,L)(L-t)` is then confined to

\[
 t\leq\theta_{ij}L,
 \qquad
 \theta_{ij}<1-{x_0\over2\pi j}\leq\theta_K
 \quad(j\leq K).                                  \tag{3.9}
\]

For the anchor, `theta_(0j)=1-1/(2j)`.  For the diagonal, the frozen
support fraction is `theta_(jj)=1-x_0/(2*pi*j)`.  Thus (3.9), with a
nonstrict first comparison on the diagonal, covers every pair in the fixed
prefix.  Moreover,

\[
 |\kappa_{ij,L}(u)|\leq{2\pi\over L}
 {j^3+i^3\over j^2-i^2}=O_K(L^{-1})               \tag{3.10}
\]

for distinct vertices, and (2.5) gives the same `O_K(L^(-1))` bound on
the diagonal.

## 4. Exact positive exponential comparators

Let `E=e^(eta*L)`.  At a positive resonant mode,

\[
 (T_ke^{\eta\,\cdot})(L)={E-1\over\eta^2+q_k}.     \tag{4.1}
\]

For distinct positive modes, (2.1) also gives

\[
 (T_iT_je^{\eta\,\cdot})(L)
 ={E-1\over(\eta^2+q_i)(\eta^2+q_j)}.              \tag{4.2}
\]

Direct substitution yields the exact comparator

\[
 \boxed{
 (F_iF_je^{\eta\,\cdot})(L)
 ={E\eta^4\over(\eta^2+q_i)(\eta^2+q_j)}
 +{\eta^2(q_i+q_j)+q_iq_j
   \over(\eta^2+q_i)(\eta^2+q_j)}>0.}             \tag{4.3}
\]

Formula (4.3) remains correct at the anchor `q_i=0`, where it reduces to

\[
 (F_je^{\eta\,\cdot})(L)
 ={E\eta^2+q_j\over\eta^2+q_j}>0.                 \tag{4.4}
\]

The diagonal is not obtained by coalescing two distinct integer
resonances.  Its exact repeated-resolvent formula is instead

\[
 \begin{aligned}
 (F_j^2e^{\eta\,\cdot})(L)
 ={}&{E\eta^4\over(\eta^2+q_j)^2}
 +{q_j(2\eta^2+q_j)\over(\eta^2+q_j)^2}\\
 &+{q_j\eta L\over2(\eta^2+q_j)}>0.               \tag{4.5}
 \end{aligned}
\]

For fixed `K`, the coefficient of `E` in (4.3)--(4.5) tends uniformly to
one.  Hence every comparator in the fixed prefix is at least `E/2` for all
sufficiently large `L`.

## 5. Record-envelope proof on the strict natural grid

The frozen record extraction supplies times `T_n`, record heights `R_n`,
and strict natural-grid lengths `L_n<=T_n` such that

\[
 R_n\longrightarrow\infty,
 \qquad
 \Psi(t)\leq R_ne^{\eta t}\quad(0\leq t\leq T_n),
 \qquad
 0\leq T_n-L_n\leq Ce^{-T_n/2}.                   \tag{5.1}
\]

Put

\[
 h_n(t)=R_ne^{\eta t}-\Psi(t)\geq0,
 \qquad P_n=R_ne^{\eta L_n}.                      \tag{5.2}
\]

The prime-discrepancy grid transfer already proved in the frozen theorem
gives

\[
 h_n(L_n)=o(P_n).                                  \tag{5.3}
\]

The actual zero-edge envelope gives, throughout the interval,

\[
 0\leq h_n(t)\leq R_ne^{\eta t}+C_Ze^{Bt}.         \tag{5.4}
\]

Since `F_iF_j=I-C_(ij)`, equations (2.2) and (5.2) give the exact endpoint
identity

\[
 Z_{ij}(L_n)
 =R_n(F_iF_je^{\eta\,\cdot})(L_n)
  +(\mathcal C_{ij}h_n)(L_n)-h_n(L_n).             \tag{5.5}
\]

Discard every positive kernel lobe.  Equations (3.9)--(3.10) and (5.4)
give, uniformly for all pairs in the fixed prefix,

\[
 (\mathcal C_{ij}h_n)(L_n)
 \geq-{C_{K,\eta}\over L_n}R_ne^{\eta\theta_KL_n}
       -{C_{K,B}\over L_n}e^{B\theta_KL_n}.        \tag{5.6}
\]

After division by `P_n`, these two losses are bounded by

\[
 {C_{K,\eta}\over L_n}e^{-\eta(1-\theta_K)L_n},
 \qquad
 {C_{K,B}\over L_nR_n}e^{-(\eta-B\theta_K)L_n}.   \tag{5.7}
\]

Both tend to zero under the already chosen condition
`B*theta_K<eta<B`.  Combining (4.3)--(4.5), (5.3), and (5.5)--(5.7)
proves the simultaneous lower bound

\[
 \boxed{
 Z_{ij}(L_n)\geq P_n\{1-o_K(1)\}>0
 \qquad(0\leq i,j\leq K).}                        \tag{5.8}
\]

The proof uses the same exponent threshold, record sequence, and grid
transfer as the frozen positive-degree theorem.  It requires no stronger
condition on `eta`.  The natural grid is essential for the exact resonance
formulas, but it creates no new convolution residual beyond (5.3).

## 6. Edge signs, connectivity, and exact remaining limitation

The exact edge formula and fixed-mode limits are

\[
 w_{ij}={2\over L}p_ip_jD_{ij}\quad(i\ne j),       \tag{6.1}
\]

\[
 \sqrt Lp_0\longrightarrow C>0,
 \qquad
 \sqrt Lp_k\longrightarrow2(-1)^kC\quad(k\geq1). \tag{6.2}
\]

Equations (2.7), (5.8), and (6.1)--(6.2) prove (0.5).  In particular every
even vertex is joined by a positive edge to every odd vertex.  For every
fixed `K>=1`, the positive-edge graph on `{0,...,K}` is therefore connected.

Choosing one sufficiently late grid point for each successive fixed prefix
gives an unquantified diagonal sequence with prefix length tending to
infinity on which (5.8) and the complete-bipartite sign pattern both hold.
There is no rate for that prefix length, no comparison with `N(L)`, and no
claim that all vertices in any natural finite section obey the pattern.

Finally, positive-edge connectivity is only the hypothesis needed to state
the signed effective-resistance routing criterion.  This note does not
bound the same-parity negative-edge load in that metric.  It therefore does
not prove a positive reduced Laplacian, even though the frozen theorem also
makes every degree in the same fixed prefix positive.
