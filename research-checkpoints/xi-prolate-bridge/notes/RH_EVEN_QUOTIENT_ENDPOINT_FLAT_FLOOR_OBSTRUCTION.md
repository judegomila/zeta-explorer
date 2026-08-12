# RH even quotient endpoint-flat floor obstruction

## 0. Exact outcome and claim boundary

Let

\[
 L=2\log\lambda,
 \qquad N=\lceil\lambda L^3\rceil .                  \tag{0.1}
\]

Work on the branch where every nontrivial zero is on the critical line.
Let `A_circ` be the actual unshifted positive-index even zero Gram.  This
note constructs a unit vector from the first `M` distinct actual positive
ordinates, where `M` is a fixed proportion of `N`.  Its transform

1. vanishes exactly at those ordinates, with algebraic multiplicity still
   represented by repeated value rows; and
2. has a high-order zero at both physical endpoints, so its samples at all
   remaining ordinates have an exponentially small tail.

For every fixed `theta` with `1/2<theta<1`, the construction proves

\[
 \boxed{
 \limsup_{\lambda\longrightarrow\infty}{1\over N}
 \log\lambda_{\min}(A^\circ)
 \leq-4(1-\theta)\log(2\theta).}                     \tag{0.2}
\]

The convention in (0.2) is `log(0)=-infinity`.  Under the separately
frozen finite strictness hypothesis the floor is positive and the logarithm
is ordinary.

Optimizing gives

\[
 \boxed{
 \lambda_{\min}(A^\circ)
 \leq\exp\{-(c_* -o(1))N\},
 \qquad
 c_*=0.4087565478\ldots .}                            \tag{0.3}
\]

The exact constant is described by

\[
 w=W(2e),
 \qquad
 \theta_*={1\over w},
 \qquad
 c_*={4(w-1)^2\over w}.                               \tag{0.4}
\]

This is an upper-floor obstruction, not a lower frame theorem.  Since
`N/L` is asymptotic to `lambda*L^2`, (0.3) rules out any all-vector lower
bound of the form

\[
 A^\circ\succeq \exp\{-C N/L\}I                       \tag{0.5}
\]

with a fixed positive constant `C`.  It also shows that the previously
constructed smooth-radical Rayleigh value need not be on the scale of the
actual floor.

No lower bound for `lambda_min(A_circ)` is obtained.  In particular, the
result does not compare the actual projected-prolate Rayleigh value `q_N`
with the floor, does not bound `mu/lambda_min(A_circ)`, and does not prove or
disprove the even reserve.  Under the separately frozen finite strictness
hypothesis it only sharpens the necessary upper chain to

\[
 0\leq\mu<\lambda_{\min}(A^\circ)
 \leq\exp\{-(c_*-o(1))N\}.                            \tag{0.6}
\]

No zero table is read.  The standard eight are unchanged, this overlay has
no checkpoint-admission order, and the formal state remains
`P0_INVALIDATED`.

## 1. Frozen inputs

Only the following five frozen repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/RH_EVEN_ZERO_GRAM_GEVREY_RELATIVE_RESERVE_BARRIER.md` | `4527a5cc5ba8a7c66b76ff70c4aa4423aaecd60fe10ba52cee134b9d9c2ef36c` |
| `tests/test_rh_even_zero_gram_gevrey_relative_reserve_barrier.py` | `fe276d7e4e60f1f40ec10fc4dac1cee8084fc3e8df969fa3a9f30ef64cd4ad86` |
| `notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md` | `ceb3e7067ed9ef9f02f443b665a83f778500630ded912e60df128abc8c17514a` |
| `tests/test_anti_carrier_log_schedule.py` | `304175ece40e36ae979dffa44c43009d1b796be2d72a820d7021758a34472a1b` |
| `ZERO_SAMPLING_SOURCE_LOCK.json` | `f4cad4acb30dbfcdc5b30faafe92934e8958ad1cd11cbf6abea932f902e8c101` |

The first pair supplies the exact even evaluation rows, the reflected-height
factor two, and the distinction between a Rayleigh upper test and a floor.
The second pair and the source lock supply the multiplicity-aware HSW count.
No simplicity, zero-gap conjecture, numerical ordinate, prolate asymptotic,
or new external source is used.

## 2. The `M`th distinct ordinate lies beyond the carrier edge

Write the distinct positive critical ordinates in increasing order as

\[
 0<\gamma_1^\#<\gamma_2^\#<\cdots                    \tag{2.1}
\]

and retain the algebraic multiplicity `m_gamma` separately.  Let
`mathcal N(T)` count positive ordinates through height `T` with algebraic
multiplicity, and let `mathcal D(T)` count distinct ordinates.  Then

\[
 \mathcal D(T)\leq\mathcal N(T).                     \tag{2.2}
\]

The pinned HSW estimate is

\[
 \begin{aligned}
 \mathcal M(T)&={T\over2\pi}\log{T\over2\pi e},\\
 \mathcal R(T)&=0.103787\log T
       +0.257297\log\log T+9.367419,\\
 |\mathcal N(T)-\mathcal M(T)+1/8|&\leq\mathcal R(T)
 \end{aligned}                                       \tag{2.3}
\]

for `T` at least the locked starting height.  Fix

\[
 {1\over2}<\theta<1,
 \qquad M_N=\lfloor\theta N\rfloor .                 \tag{2.4}
\]

For a fixed `epsilon` with `0<epsilon<2*pi*(2*theta-1)`, put

\[
 T_{\epsilon,N}=(4\pi\theta-\epsilon){N\over L}.     \tag{2.5}
\]

The polynomial schedule gives

\[
 \log N={L\over2}+3\log L+o(1),                     \tag{2.6}
\]

and hence

\[
 \log{T_{\epsilon,N}\over2\pi e}
 ={L\over2}+2\log L+O_{\theta,\epsilon}(1).         \tag{2.7}
\]

Using the upper side of (2.3),

\[
 {\mathcal N(T_{\epsilon,N})\over N}
 \leq\theta-{\epsilon\over4\pi}+o(1)<{M_N\over N}
                                                               \tag{2.8}
\]

eventually.  Equation (2.2) therefore gives

\[
 \boxed{
 \gamma_{M_N}^\#>T_{\epsilon,N},
 \qquad
 \liminf_{N\longrightarrow\infty}
 {L\gamma_{M_N}^\#\over N}\geq4\pi\theta.}        \tag{2.9}
\]

This inference uses multiplicity in the safe direction.  A multiple zero
increases `mathcal N(T)` but contributes only one distinct value row.  No
lower bound on the number of simple zeros is being inserted.

Put

\[
 a_n={2\pi n\over L},
 \qquad
 \Omega_N=a_N={2\pi N\over L}.                       \tag{2.10}
\]

Equations (2.9)--(2.10) show the decisive overshoot:

\[
 {\Omega_N\over\gamma_{M_N}^\#}
 \leq{1\over2\theta}+o(1)<1.                        \tag{2.11}
\]

## 3. Exact source-Cauchy quotient vector

In the centered positive-index even basis, the evaluation row is

\[
 b_N(t)_n={2\sqrt{2/L}\,t\sin(Lt/2)
                    \over t^2-a_n^2},
 \qquad1\leq n\leq N,                               \tag{3.1}
\]

with every carrier interpreted continuously.  Define the monic
polynomials

\[
 D_N(y)=\prod_{n=1}^N(y-a_n^2),
 \qquad
 P_N(y)=\prod_{j=1}^{M_N}
              (y-(\gamma_j^\#)^2).                  \tag{3.2}
\]

For `1<=n<=N`, put

\[
 \widetilde x_n={P_N(a_n^2)\over D_N'(a_n^2)}.       \tag{3.3}
\]

Since `deg(P_N)=M_N<N`, the vector `widetilde x` is nonzero.  Indeed, if
all its coordinates vanished, `P_N` would vanish at the `N` distinct
numbers `a_n^2`, which is impossible for a nonzero polynomial of degree
less than `N`.  Partial fractions give the exact quotient identity

\[
 \boxed{
 {P_N(y)\over D_N(y)}
 =\sum_{n=1}^N{\widetilde x_n\over y-a_n^2}.}        \tag{3.4}
\]

Let

\[
 B_N^2=\sum_{n=1}^N\widetilde x_n^2>0,
 \qquad
 h_N={1\over B_N}\sum_{n=1}^N\widetilde x_ne_n^+.
                                                               \tag{3.5}
\]

Then `||h_N||_2=1`, and away from carriers its compact Fourier transform is

\[
 \boxed{
 \widehat h_N(t)
 ={2\sqrt{2/L}\over B_N}
 t\sin(Lt/2){P_N(t^2)\over D_N(t^2)}.}              \tag{3.6}
\]

Every selected actual row vanishes, including all carrier branches.

* If `gamma_j^#` is not a carrier, (3.6) vanishes through `P_N`.
* If `gamma_j^#=a_k` with `1<=k<=N`, the continuous row is supported only
  in coordinate `k`, while (3.3) gives `widetilde x_k=0`.
* If `gamma_j^#=a_k` with `k>N`, the complete retained row is zero.
* Algebraic multiplicity repeats the same vanished value row; it never
  creates derivative jets.

Consequently

\[
 \boxed{
 \widehat h_N(\gamma_j^\#)=0,
 \qquad1\leq j\leq M_N.}                             \tag{3.7}
\]

## 4. The quotient is endpoint-flat

Put

\[
 s_N=N-M_N-1.                                        \tag{4.1}
\]

The expansion of (3.4) at infinity has two forms:

\[
 {P_N(y)\over D_N(y)}
 =y^{M_N-N}\{1+O(y^{-1})\}                          \tag{4.2}
\]

and

\[
 \sum_{n=1}^N{\widetilde x_n\over y-a_n^2}
 =\sum_{k\geq0}
   \left(\sum_{n=1}^N\widetilde x_na_n^{2k}\right)y^{-k-1}.
                                                               \tag{4.3}
\]

Comparing coefficients gives the exact moment cancellations

\[
 \boxed{
 \sum_{n=1}^N\widetilde x_na_n^{2k}=0,
 \qquad0\leq k\leq s_N-1.}                          \tag{4.4}
\]

The aligned basis is

\[
 e_n^+(x)=\sqrt{2/L}(-1)^n\cos(a_nx).                \tag{4.5}
\]

Every odd derivative of (4.5) vanishes at `x=+/-L/2`.  Its even endpoint
derivatives are a common nonzero factor times `a_n^(2k)`.  Equations
(3.5) and (4.4) therefore imply

\[
 \boxed{
 h_N^{(j)}(\pm L/2)=0,
 \qquad0\leq j\leq2s_N-1.}                           \tag{4.6}
\]

Integrating the compact Fourier transform by parts `2*s_N` times, with no
boundary term, gives

\[
 |\widehat h_N(t)|
 \leq {|t|^{-2s_N}}\sqrt L\,\|h_N^{(2s_N)}\|_2.
                                                               \tag{4.7}
\]

The centered Fourier basis gives the exact Bernstein estimate

\[
 \|h_N^{(2s_N)}\|_2\leq\Omega_N^{2s_N}\|h_N\|_2
 =\Omega_N^{2s_N}.                                    \tag{4.8}
\]

Thus

\[
 \boxed{
 |\widehat h_N(t)|
 \leq\sqrt L\left({\Omega_N\over|t|}\right)^{2s_N}.}
                                                               \tag{4.9}
\]

This estimate is independent of the possibly very small normalization
`B_N`; normalization was completed before Bernstein was applied.

## 5. Multiplicity-safe zero-tail estimate

The HSW upper count implies, for all sufficiently large `u`,

\[
 \mathcal N(u)\leq C u\log u.                        \tag{5.1}
\]

For every `p>=2` and sufficiently large `T`, Stieltjes partial summation
therefore gives

\[
 \begin{aligned}
 \sum_{\gamma>T}m_\gamma\gamma^{-p}
 &\leq pC\int_T^\infty u^{-p}\log u\,du\\
 &=pC T^{1-p}
   \left({\log T\over p-1}+{1\over(p-1)^2}\right)\\
 &\leq C_1T^{1-p}\log T,
 \end{aligned}                                       \tag{5.2}
\]

where `C_1` is independent of `p`.  Take

\[
 T_N=\gamma_{M_N}^\#,
 \qquad p_N=4s_N.                                    \tag{5.3}
\]

The exact reflected-height normalization, (3.7), and (4.9) give

\[
 \begin{aligned}
 \langle h_N,A^\circ h_N\rangle
 &=2\sum_{\gamma>0}m_\gamma
                     |\widehat h_N(\gamma)|^2\\
 &\leq2L\Omega_N^{p_N}
        \sum_{\gamma>T_N}m_\gamma\gamma^{-p_N}\\
 &\leq C_2L T_N\log T_N
       \left({\Omega_N\over T_N}\right)^{p_N}.
 \end{aligned}                                       \tag{5.4}
\]

There is no hidden assumption that `T_N` has an upper bound.  For `p>=2`,

\[
 T\longmapsto T^{1-p}\log T                         \tag{5.5}
\]

is decreasing once `T>=exp(1/(p-1))`.  Hence (2.9) allows `T_N` in the
right side before the last line of (5.4) to be replaced by the smaller
explicit lower threshold `T_(epsilon,N)`.  Since

\[
 {\Omega_N\over T_{\epsilon,N}}
 ={2\pi\over4\pi\theta-\epsilon},
 \qquad
 {p_N\over N}=4(1-\theta)+o(1),                     \tag{5.6}
\]

the polynomial prefactor is `exp(o(N))` and min--max yields

\[
 \limsup_{N\longrightarrow\infty}{1\over N}
 \log\lambda_{\min}(A^\circ)
 \leq4(1-\theta)
 \log{2\pi\over4\pi\theta-\epsilon}.              \tag{5.7}
\]

Letting `epsilon` decrease to zero proves (0.2).

## 6. Optimized exponent and scale consequence

Define

\[
 c(\theta)=4(1-\theta)\log(2\theta),
 \qquad {1\over2}<\theta<1.                          \tag{6.1}
\]

Its derivative has the sign of

\[
 {1\over\theta}-1-\log(2\theta).                    \tag{6.2}
\]

This expression is strictly decreasing from a positive value to a negative
value, so it has one zero.  Writing `w=1/theta` turns the zero equation into

\[
 w+\log w=1+\log2,
 \qquad we^w=2e.                                     \tag{6.3}
\]

Thus the unique maximizer and its value are exactly (0.4), with

\[
 \theta_*=0.7273666087\ldots,
 \qquad c_*=0.4087565478\ldots .                     \tag{6.4}
\]

On the locked schedule,

\[
 {N\over L}=\lambda L^2+O(L^{-1}).                   \tag{6.5}
\]

For every fixed `C>0`, therefore,

\[
 \exp\{-(c_*/2)N\}
 =o\!\left(\exp\{-CN/L\}\right).                  \tag{6.6}
\]

Equation (0.3) contradicts an all-vector lower frame at the right-hand
scale of (6.6).  By contrast, the frozen estimates

\[
 q_N=O(e^{-c_qN/L}),
 \qquad
 r_N^+=O(e^{-c_{\rm ev}N/L})                         \tag{6.7}
\]

are upper bounds with qualitative positive constants.  The new upper bound
for the floor cannot be compared with either actual scalar in (6.7).
Indeed, `q_N` could itself be much smaller than its current envelope.

The quotient vector also need not be the ground vector.  Formula (0.3)
therefore does not give a lower bound for the floor, an asymptotic formula
for it, or a relative reserve estimate.  Its exact content is that generic
all-vector sampling is the wrong route at the `N/L` scale.

## 7. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. reverses the upper bound in (0.2) or calls it a lower frame;
2. infers `q_N>lambda_min(A_circ)` from the two absolute envelopes;
3. infers a bound for `mu/lambda_min(A_circ)` from (0.6);
4. replaces repeated value rows by derivative jets;
5. omits the in-band or out-of-band carrier branch;
6. uses `mathcal D(T)>=mathcal N(T)` instead of (2.2);
7. forgets that a larger `T_N` only improves the decreasing tail bound;
8. identifies the quotient vector with the prolate state or the smooth
   derivative radical; or
9. infers shifted-node uniqueness, determinant convergence, RH, a converse
   from RH, or a de Bruijn--Newman `Lambda` bound.

The surviving input is a cancellation-preserving source-specific relative
comparison, or a direct signed proof.  An all-vector lower sampling theorem
at the frozen Gevrey envelope scale is now excluded by the actual zero rows
themselves.
