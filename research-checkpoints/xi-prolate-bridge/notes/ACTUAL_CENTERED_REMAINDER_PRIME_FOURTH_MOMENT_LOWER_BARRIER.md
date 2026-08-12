# Actual centered remainder prime fourth-moment lower barrier

## 0. Exact outcome and claim boundary

Put `x=lambda^2` and `L=log x`, as in the frozen centered-PNT
reduction.  This note proves that its proposed centered-remainder upper
bound is false when the fixed splitting parameter `alpha` is sufficiently
close to one.  More precisely, set

\[
 c_*={1\over8\sqrt2}.                                      \tag{0.1}
\]

For every fixed `A>0` and every fixed

\[
 1-c_*<\alpha<1,                                           \tag{0.2}
\]

both the full and high-time centered statistics satisfy

\[
 \mathfrak R_{\lambda,\alpha},\quad
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha}\lambda^4L.                               \tag{0.3}
\]

Consequently neither statistic is
`O(lambda^2/L)` in this alpha range.  The proof is unconditional.  It
uses the prime number theorem already pinned through `P3_SOURCE_LOCK.json`
and the classical Montgomery--Vaughan weighted mean-value theorem.

This result does not give a lower bound for the actual phase volume.  The
frozen decomposition gives only an upper bound for that phase volume, and
there can be cancellation between its two separated positive-part terms.
The argument also proves no failure for
`0<alpha<=1-c_*`.  It proves no determinant convergence, zero-location
theorem, Riemann hypothesis, converse, or de Bruijn--Newman bound.  The
formal state remains `P0_INVALIDATED`.

## 1. Frozen local inputs and external theorem

The exact local dependencies are:

| Frozen path | SHA-256 |
|---|---|
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `vendor/FKS-PNT-2204.02588v3.pdf` | `15eff02042f2c1ab4878d029ce52a0abd6c95d66995b183a2dbc689ce9af49a4` |
| `notes/ACTUAL_PHASE_VOLUME_CENTERED_PNT_REMAINDER_REDUCTION_BARRIER.md` | `2b2a40a4ec087c77145b45fc54d8a5782a85ecd122b2d599d2c2d8a067b714f1` |
| `tests/test_actual_phase_volume_centered_pnt_remainder_reduction_barrier.py` | `7fbcdf15dde20d3d2a00303f74d5441ee143af74ae269992fe79b1fb0c97456f` |
| `notes/NATURAL_OUTER_SHELL_LARGE_SIEVE_INVERSE_SPREAD_BARRIER.md` | `79be0448f5e144819ee9eb2e249021c3c5ffe44949a58b75002e2a117c1b85da` |
| `tests/test_natural_outer_shell_large_sieve_inverse_spread_barrier.py` | `e65c890a6f97def68b48825ccb8c3148926c744cd77f27754fb7790534dbabf8` |

The centered-PNT pair supplies the exact definitions of
`R_lambda`, `mathfrak R_(lambda,alpha)`, and its high-time restriction.
The P3 lock and already-vendored Fiori--Kadiri--Swidinsky v3 PDF supply
the unconditional bound

\[
 |\psi(u)-u|
 <9.22022\,u(\log u)^{3/2}
             \exp(-0.8476836\sqrt{\log u})\qquad(u>2).   \tag{1.1}
\]

The large-sieve dependency carries the previously disclosed
Montgomery--Vaughan source lineage.  The substantive external input here
is H. L. Montgomery and R. C. Vaughan, *Hilbert's Inequality*,
*Journal of the London Mathematical Society* (2) **8** (1974), 73--82,
DOI <https://doi.org/10.1112/jlms/s2-8.1.73>.  The primary PDF used to
check the result is the author-hosted copy
<https://personal.science.psu.edu/rcv4/personal/Publications/s2-8-1-73.pdf>.
Corollary 2, equations (1.8)--(1.9), is the binding result.  This paper
remains external and unvendored; no new source-lock or source byte is
added.

For later reference, that result gives the following translated-interval
form.  If

\[
 F(t)=\sum_{2\leq n\leq N}c_nn^{it}                    \tag{1.2}
\]

and `I` is any interval of length `T`, then

\[
 \left|\int_I|F(t)|^2dt-T\sum_n|c_n|^2\right|
 \leq3\pi\sum_n\delta_n^{-1}|c_n|^2,                   \tag{1.3}
\]

where `delta_n` is the nearest-neighbor spacing of `log n` among the
active frequencies.  Enlarging to all integer frequencies can only
decrease the spacing, and

\[
 \delta_n\geq\log(1+1/n)\geq{1\over n+1},
 \qquad n+1\leq{3n\over2}\quad(n\geq2).                \tag{1.4}
\]

Thus the exact convenient corollary is

\[
 \boxed{
 \left|\int_I|F(t)|^2dt-T\sum_n|c_n|^2\right|
 \leq{9\pi\over2}\sum_n n|c_n|^2.}                    \tag{1.5}
\]

Translation of `I` only multiplies each coefficient by a unimodular
factor, so (1.5) is uniform in the location of the interval.

## 2. Prime polynomial and the PNT variance

Fix `lambda>1` and write

\[
 x=\lambda^2,\qquad L=\log x.
\tag{2.1}
\]

Split the complete inclusive prime-power polynomial as

\[
 D_\lambda(t)=P_x(t)+H_x(t),                              \tag{2.2}
\]

where

\[
 P_x(t)=\sum_{p\leq x}{\log p\over\sqrt p}\,p^{it},
\qquad
 H_x(t)=\sum_{\substack{k\geq2\\p^k\leq x}}
              {\log p\over p^{k/2}}\,p^{ikt}.            \tag{2.3}
\]

Put

\[
 a_p={\log p\over\sqrt p},\qquad
 S_x=\sum_{p\leq x}a_p^2
    =\sum_{p\leq x}{(\log p)^2\over p}.                 \tag{2.4}
\]

Equation (1.1), with the elementary removal of proper prime powers,
gives

\[
 \vartheta(u)=\sum_{p\leq u}\log p=u+o(u).              \tag{2.5}
\]

Indeed `0<=psi(u)-vartheta(u)` is at most a fixed multiple of
`sqrt(u) log u`.  Stieltjes partial summation now gives

\[
 \begin{aligned}
 S_x
 &= {L\over x}\vartheta(x)
   +\int_2^x{\vartheta(u)(\log u-1)\over u^2}\,du \\
 &=\left({1\over2}+o(1)\right)L^2.
 \end{aligned}                                           \tag{2.6}
\]

Only the ordinary unconditional PNT is needed for (2.6); the pinned FKS
bound is stronger than that input.  The all-range consequence
`vartheta(u)<=psi(u)<=C_psi u` also gives

\[
 \sum_{p\leq x}(\log p)^2=O(xL),
 \qquad
 \sum_{p\leq x}a_p=O(\sqrt x).                          \tag{2.7}
\]

## 3. Exact second and fourth moment audit

Fix `A>0`, put

\[
 T=Ax^2,\qquad I_x=[T,2T],\qquad
 \mathbb E_x f={1\over T}\int_{I_x}f(t)\,dt,            \tag{3.1}
\]

and set `Y_x=Re P_x`.  Applying (1.5) to `P_x` and using
(2.7) yields

\[
 \mathbb E_x|P_x|^2
 =S_x+O_A(L/x)=S_x+o(S_x).                               \tag{3.2}
\]

Direct endpoint integration, rather than a mean-value theorem, gives

\[
 |\mathbb E_xP_x|
 \leq{2\over T}\sum_{p\leq x}{1\over\sqrt p}
 =O_A(x^{-3/2}),                                         \tag{3.3}
\]

and, since `log(pq)>=log 4`,

\[
 |\mathbb E_xP_x^2|
 \leq{2\over T\log4}
          \left(\sum_{p\leq x}a_p\right)^2
 =O_A(x^{-1}).                                           \tag{3.4}
\]

Consequently

\[
 \boxed{
 \mathbb E_xY_x=o(1),\qquad
 \mathbb E_xY_x^2=\left({1\over2}+o(1)\right)S_x.}     \tag{3.5}
\]

For the fourth moment, write

\[
 P_x(t)^2=\sum_{n\leq x^2}b_nn^{it}.                    \tag{3.6}
\]

Unique factorization gives

\[
 b_{p^2}=a_p^2,qquad b_{pq}=2a_pa_q\quad(p<q),          \tag{3.7}
\]

and hence the exact diagonal identity

\[
 \sum_n|b_n|^2
 =2S_x^2-\sum_{p\leq x}a_p^4
 =\left(2+o(1)\right)S_x^2.                             \tag{3.8}
\]

Here `sum_p a_p^4` is bounded.  The weighted MV error is smaller by two
logarithmic powers:

\[
 \begin{aligned}
 \sum_n n|b_n|^2
 &=2\left(\sum_{p\leq x}(\log p)^2\right)^2
      -\sum_{p\leq x}(\log p)^4 \\
 &\leq2\left(\sum_{p\leq x}(\log p)^2\right)^2
 =O(x^2L^2).
 \end{aligned}                                           \tag{3.9}
\]

Applying (1.5) to `P_x^2` on the interval of length `Ax^2` proves

\[
 \mathbb E_x|P_x|^4
 =\left(2+o(1)\right)S_x^2.                             \tag{3.10}
\]

Since `|Y_x|<=|P_x|`,

\[
 \boxed{
 \mathbb E_xY_x^4\leq\left(2+o(1)\right)S_x^2.}        \tag{3.11}
\]

The weighted error in (1.5) is essential for the sharp `o(S_x^2)`
remainder in (3.10).  The coarser
`(T+x^2) sum_n |b_n|^2` estimate gives only a constant-factor upper bound.

## 4. A positive prime excursion of order L

Holder interpolation gives, for every real random variable on the
normalized interval,

\[
 \mathbb E_x|Y_x|
 \geq{(\mathbb E_xY_x^2)^{3/2}
             \over(\mathbb E_xY_x^4)^{1/2}}.            \tag{4.1}
\]

Equations (2.6), (3.5), and (3.11) therefore imply

\[
 \mathbb E_x|Y_x|
 \geq\left({1\over4}-o(1)\right)\sqrt{S_x}.             \tag{4.2}
\]

Since `Y_+=(|Y|+Y)/2` and (3.3) makes the mean negligible,

\[
 \boxed{
 \mathbb E_x(Y_x)_+
 \geq\left({1\over8\sqrt2}-o(1)\right)L
 =(c_*-o(1))L.}                                         \tag{4.3}
\]

This is a deterministic time-average theorem.  No independent-phase or
Gaussian model is used.

## 5. Proper prime powers and the continuous main term

The proper-prime-power diagonal is uniformly summable:

\[
 Q_x:=\sum_{\substack{k\geq2\\p^k\leq x}}
              {(\log p)^2\over p^k}
 \leq Q_\infty:=\sum_p{(\log p)^2\over p(p-1)}<\infty. \tag{5.1}
\]

Moreover,

\[
 \sum_{\substack{k\geq2\\p^k\leq x}}(\log p)^2
 =O(\sqrt x\,L^2).                                      \tag{5.2}
\]

A final application of (1.5) gives

\[
 \mathbb E_x|H_x|^2=Q_x+o(1)\leq Q_\infty+o(1).         \tag{5.3}
\]

The exact continuous PNT main term from the frozen split is

\[
 M_\lambda(t)={\sqrt x\,e^{iLt}-1\over1/2+it}.          \tag{5.4}
\]

On `I_x`,

\[
 \sup_{t\in I_x}|M_\lambda(t)|
 \leq{\sqrt x+1\over Ax^2}
 =O_A(x^{-3/2}).                                         \tag{5.5}
\]

Thus, with `Z_x=Re(H_x-M_lambda)`, Cauchy--Schwarz gives the uniform
noise bound

\[
 \mathbb E_x|Z_x|\leq\sqrt{Q_\infty}+o(1).              \tag{5.6}
\]

## 6. Lower bound for the centered remainder

Write `beta=1-alpha`.  The centered remainder is exactly

\[
 R_\lambda=P_x+H_x-M_\lambda.                           \tag{6.1}
\]

For `t` in `I_x`,

\[
 h(t)={1\over2}\log(1+4t^2)
 \leq{1\over2}\log(1+16A^2x^4)
 =2L+\log(4A)+o(1).                                     \tag{6.2}
\]

For real `y,z` and `q>=0`, the pointwise inequalities

\[
 [y+z-q]_+\geq[y-q]_+-|z|
              \geq[y]_+-q-|z|                          \tag{6.3}
\]

are exact.  Restricting the defining integral to `I_x` and using
(4.3), (5.6), and (6.2) yields

\[
 \begin{aligned}
 \mathfrak R_{\lambda,\alpha}
 &\geq2T\left\{
       \mathbb E_x(Y_x)_+
       -{\beta\over2}\sup_{I_x}h
       -\mathbb E_x|Z_x|\right\} \\
 &\geq2Ax^2\{(c_*-\beta-o(1))L-O_A(1)\}.
 \end{aligned}                                           \tag{6.4}
\]

Therefore, whenever `beta<c_*`,

\[
 \boxed{
 \liminf_{\lambda\to\infty}
 {\mathfrak R_{\lambda,\alpha}\over\lambda^4L}
 \geq2A\{c_*-(1-\alpha)\}>0.}                          \tag{6.5}
\]

The high-time cutoff in the frozen note is

\[
 T_0={\lambda\over(\log\lambda)^2}
     ={4\sqrt x\over L^2}=o(Ax^2).                      \tag{6.6}
\]

Hence `I_x` lies in `|t|>T_0` for all sufficiently large `lambda`, and
the same proof gives

\[
 \boxed{
 \liminf_{\lambda\to\infty}
 {\mathfrak R^{\rm hi}_{\lambda,\alpha}\over\lambda^4L}
 \geq2A\{c_*-(1-\alpha)\}>0.}                          \tag{6.7}
\]

Since

\[
 {\lambda^4L\over\lambda^2/L}=\lambda^2L^2\longrightarrow\infty,
                                                                    \tag{6.8}
\]

equations (6.5)--(6.7) disprove the proposed
`O(lambda^2/L)` centered-remainder bound throughout (0.2).

## 7. Why this is not an all-alpha or phase-volume theorem

The proof uses (4.3) and then pays the deterministic threshold
`beta L+O_A(1)`.  It stops when `beta>=c_*`.  This stopping line is a
limitation of the present moment argument, not evidence that the actual
statistic is small there.

In particular, the second/fourth-moment facts alone cannot prove an
all-alpha tail.  A mean-zero two-point variable taking the values
`+-sqrt(S/2)` has second moment `S/2` and fourth moment `S^2/4`, which is
well below the upper bound `2S^2`, but it has no positive excess above
any threshold at least `sqrt(S/2)`.  Since
`sqrt(S_x/2)=(1/2+o(1))L`, this countermodel blocks any all-alpha
deduction from only (3.5) and (3.11).  It is a moment-method countermodel,
not a model of the actual prime polynomial.

Finally, the frozen relation is one-way:

\[
 \Phi_\lambda(U,g)
 \leq\mathfrak M_{\lambda,\alpha}(C)
       +\mathfrak R_{\lambda,\alpha}.                   \tag{7.1}
\]

A lower bound for the rightmost term cannot be reversed into a lower
bound for `Phi_lambda`.  Proving such a lower bound would require an
independent upper control on the archimedean symbol together with a
positive-excursion theorem at the full, rather than split, logarithmic
threshold.  Neither input is proved here.

Thus this note closes one proposed upper-bound route for
`alpha>1-1/(8sqrt(2))`, but it proves no statement for smaller alpha, no
actual phase-volume lower bound, no dangerous-projector capture, no
weighted coframe rate, no parity ordering, no determinant convergence,
no unconditional zero theorem, no RH proof or converse, and no
de Bruijn--Newman bound.  The formal state remains `P0_INVALIDATED`.
