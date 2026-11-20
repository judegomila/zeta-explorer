# Hybrid outer sampling theorem at the first odd defect scale

Status: analytic component theorem for the actual corrected,
source-normalized and inversion-reflected `0/4` state.  It combines a new
weighted `L2` estimate for the **complete sampled exterior series** with the
already admitted weighted-translation theorem.  On the locked projection
schedule it proves that the complete absolute-sampling remainder, and hence
the common normalization-free scalar shift, is `o(d_6)`.

This is not a signed odd-sector floor, a shifted Schur-complement theorem, a
shifted-resolvent estimate, equation (5.2) of `DIRECT_RH_ATTACK.md`, locally
uniform determinant convergence, or an RH conclusion.  The project terminal
state remains `P0_INVALIDATED`.

## 1. State and existing inputs

Retain the conventions of
`OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md`.  Thus

\[
 K_\lambda=S\mathcal E(\widetilde h_\lambda),\qquad
 O_\lambda=(1-C_\lambda)K_\lambda,\qquad S={1+J\over2},
                                                               \tag{1.1}
\]

and, on the right tail, with `u=lambda exp(s)`,

\[
 O_\lambda(\log\lambda+s)=B_f(s),\qquad
 B_f(s)={\sqrt u\over2}\sum_{m\geq1}
                 \widehat {\widetilde h_\lambda}(mu).         \tag{1.2}
\]

The left tail is its exact inversion reflection.  For a single prolate label
`n=0,4`, write

\[
 H_n=\widehat h_{n,\lambda},\quad
 e_n=h_{n,\lambda}(\lambda),\quad
 d_n=1-\chi_n^2,\quad K=2\pi\lambda^3.                       \tag{1.3}
\]

The proof uses only the following already admitted finite inequalities:

\[
 \int_\lambda^\infty H_n(u)^2du={d_n\over2},\qquad
 e_n^2\leq256\pi^2\lambda d_n,                              \tag{1.4}
\]

\[
 |H_n(u)|\leq {2|e_n|\over\pi\sqrt3\,u}\quad(u\geq2\lambda), \tag{1.5}
\]

and equation (3.5) of `OUTER_OUTER_ENDPOINT_OBSTRUCTION.md`,

\[
 \left|\sum_{m\geq2}H_n(mu)\right|
 \leq {12|e_n|\over\pi u}
 \left(1+\log\left(2+{K\over u}\right)\right),
 \qquad u\geq\lambda.                                      \tag{1.6}
\]

The source coefficients and invisible bump obey

\[
 a_4={\sqrt3\over2^{11/4}},\quad
 |a_{0,\lambda}|^2\leq8a_4^2\lambda^2,\quad d_0\leq d_4,
                                                               \tag{1.7}
\]

\[
 |A_\lambda|^2\leq8a_4^2\lambda d_4^2
       \leq8a_4^2\lambda d_4,\qquad
 |F_\psi(s)|\leq {C_2\over6}e^{-3s/2},                     \tag{1.8}
\]

where

\[
 C_2={40\,3^{-1/4}e^{-(1+\sqrt3)/2}
          \over(1-1/\sqrt3)^2}.                             \tag{1.9}
\]

The second inequality in (1.8) uses only `0<=d_4<=1`; it is the explicitly
stated weakening used for the finite bound below.

No fixed-index asymptotic is used in Sections 2--4.

## 2. Complete-series weighted `L2` lemma

Put

\[
 L_\lambda=1+\log(2+2\pi\lambda^2),\qquad
 \epsilon(y)={1\over2}-|y|,                                 \tag{2.1}
\]

and define the displayed constant

\[
 \boxed{C_{L2}=a_4^2\left(502299+{C_2^2\over192}\right).}   \tag{2.2}
\]

**Lemma 1 (complete sampled-series weighted norm).**  For every
`lambda>=2` and every real `|y|<1/2`,

\[
 \boxed{
 \|e^{y\,\cdot}O_\lambda\|_2^2
 \leq C_{L2}\lambda^3L_\lambda^2
       \epsilon(y)^{-1}d_4.}                                \tag{2.3}
\]

**Proof.**  First consider one label and one right tail.  Set
`delta=1/2-y`, so `u^(2y)=u^(1-2delta)`.  The `m=1` contribution has squared
norm

\[
 {1\over4}\int_\lambda^\infty u^{2y}H_n(u)^2du.             \tag{2.4}
\]

On `[lambda,2lambda]`, (1.4) and
`u^(2y)<=2lambda` give at most `lambda*d_n/4`.  When `y<0` the sharper
`u^(2y)<=1` applies, so the same bound remains valid.  On `[2lambda,infty)`,
(1.5) gives at most

\[
 {e_n^2/\pi^2\over6\delta}(2\lambda)^{-2\delta}
 \leq {128\over3\delta}\lambda d_n.                         \tag{2.5}
\]

Since `0<delta<1`, (2.4)--(2.5) are at most

\[
 {515\over12}\,{\lambda d_n\over\delta}.                  \tag{2.6}
\]

For all `m>=2`, (1.6) and `K/lambda=2*pi*lambda^2` give

\[
\begin{aligned}
 {1\over4}\int_\lambda^\infty u^{2y}
       \left|\sum_{m\geq2}H_n(mu)\right|^2du
 &\leq36{e_n^2\over\pi^2}L_\lambda^2
       \int_\lambda^\infty u^{-1-2\delta}du\\
 &\leq {4608\over\delta}\lambda d_nL_\lambda^2.           \tag{2.7}
\end{aligned}
\]

The elementary inequality `|x+z|^2<=2|x|^2+2|z|^2` therefore proves

\[
 \|e^{y(\log\lambda+\cdot)}B_n\|_2^2
 \leq {55811\over6}{\lambda d_nL_\lambda^2\over\delta}.
                                                               \tag{2.8}
\]

For the reflected left tail the weight is `u^(-y)` and the margin is
`1/2+y`.  Both margins are at least `epsilon(y)`, and the two tails have
disjoint supports.  Hence their combined constant is `55811/3`.

For the complete corrected profile, use the three-term inequality

\[
 \|x+y+z\|_2^2\leq3(\|x\|_2^2+\|y\|_2^2+\|z\|_2^2)       \tag{2.9}
\]

with `x=a4*O4`, `y=-a0*O0`, and `z=O_bump`.  From (1.7),

\[
 a_4^2d_4+|a_{0,\lambda}|^2d_0
 \leq a_4^2(1+8\lambda^2)d_4
 \leq9a_4^2\lambda^2d_4.                                  \tag{2.9a}
\]

Equations (2.8)--(2.9a) give the two prolate terms in (2.3) with constant
`3*(55811/3)*9*a4^2=502299*a4^2`.

Finally the right bump is

\[
 -{A_\lambda\over4\sqrt\lambda}F_\psi(s).
\]

Using (1.8) and then adding the reflected left tail gives

\[
 \|e^{y\,\cdot}O_{\rm bump}\|_2^2
 \leq {A_\lambda^2C_2^2\over576}
 \leq {a_4^2C_2^2\over72}\lambda d_4.                     \tag{2.10}
\]

For `lambda>=2`, `L_lambda>=1`, and `epsilon<=1/2`,
`lambda^3*L_lambda^2/epsilon>=8lambda`.  The factor three on the bump in
(2.9), followed by (2.10), therefore costs at most
`a4^2*C2^2/192` in (2.2).  This proves (2.3).  Notice that the complete
sampled series was retained through (2.7); the large second endpoint term
was never estimated separately.  \(\square\)

## 3. Exact hybrid sampling series

Retain the pinned zero parameters and overlap function from
`OUTER_OUTER_SPECTRAL_THEOREM.md`.  Thus

\[
 T_j=3\,2^j,\qquad
 \delta_j={1\over55.241(\log(2T_j))^{2/3}
                    (\log\log(2T_j))^{1/3}},                \tag{3.1}
\]

and `Z_j=Z(T_j)` is the exact piecewise HSW overlap.  Put

\[
 \phi_j={3\delta_j\over4}\log(2T_j),\qquad
 E_\lambda=C_{L2}\lambda^3L_\lambda^2.                     \tag{3.2}
\]

The low block is bounded from Lemma 1, submean, and angular Plancherel by
`256*Z_finite*E_lambda*d4`.  On a high dyadic block, submean with disks of
radius `delta_j/4` and the margin
`epsilon>=3*delta_j/4` gives, including both height signs and both
evaluations in the paired sampling seminorm,

\[
 S_j\leq {512\over3}Z_j\delta_j^{-3}E_\lambda d_4.          \tag{3.3}
\]

The already-proved translation/filter estimate gives independently

\[
 S_j\leq {5120\over3}Z_j\delta_j^{-3}
             D_S(\lambda)e^{-\phi_j}d_4.                   \tag{3.4}
\]

Every cross term remains inside the complete outer transform in both
bounds.  Taking the better valid upper bound on each block proves the finite
theorem

\[
\boxed{
 \|O_\lambda\|_{\mathfrak Z}^2\leq
 B_{\rm hyb}(\lambda)d_4,}                                  \tag{3.5}
\]

where the exact convergent positive series is

\[
\boxed{
\begin{aligned}
 B_{\rm hyb}(\lambda)={}&256Z_{\rm finite}E_\lambda\\
 &+\sum_{j=0}^\infty Z_j\delta_j^{-3}
 \min\left\{{512\over3}E_\lambda,
 {5120\over3}D_S(\lambda)e^{-\phi_j}\right\}.
\end{aligned}}                                               \tag{3.6}
\]

The minimum in (3.6) is not a numerical truncation.  It is the blockwise
minimum of two proved analytic upper bounds.  The series converges because
its second branch is ten times the already admitted convergent high series.

## 4. Explicit summation threshold and asymptotic scale

This section records a fully explicit domination; it is not needed to
evaluate the finite series (3.6).  Put

\[
 a={3\over4\cdot55.241},\qquad
 x(L)=\left({L\over\log L}\right)^{1/3},                    \tag{4.1}
\]

so `phi_j=a*x(log(2T_j))`.  Let

\[
 M_\lambda=max\left\{100000,
       \left\lceil{18\over a}\log\lambda\right\rceil\right\},
                                                               \tag{4.2}
\]

and let `J_lambda` be the least integer with

\[
 x(\log(2T_{J_\lambda}))\geq M_\lambda.                     \tag{4.3}
\]

For `x>=2` (and hence throughout the tail used below), the identity
`L=x^3 log L` implies

\[
 \log L\leq6\log(2x),\qquad
 L\leq6x^3\log(2x),\qquad
 {dL\over dx}\leq36x^2\log(2x).                            \tag{4.4}
\]

Indeed `(2x)^6>=6x^3 log(2x)` for `x>=1`, and differentiation of
`L=x^3 log L` gives the last inequality when `log L>=2`.

The exact overlap satisfies

\[
 Z_j\leq Z_*\log(2T_j),\qquad
 Z_*:=\max\{Z_{\rm finite},2C_Z\},                           \tag{4.5}
\]

with `C_Z` from equation (5.5) of the admitted spectral theorem.  Grouping
indices for which `m<=x(L_j)<m+1`, equations (4.4)--(4.5) give

\[
 \sum_{x(L_j)\geq M}Z_j\delta_j^{-3}e^{-\phi_j}
 \leq Z_*55.241^3\,68688
 \sum_{m\geq M}(m+1)^{11}\log^5(2(m+1))e^{-am}.             \tag{4.6}
\]

Here `68688=1296*53`.  The factor `1296=6^4` bounds `L^3*log(L)`
using (4.4).  The number of lattice points in one `x`-group is at most
`53*(m+1)^2*log(2(m+1))`: indeed

\[
 \log2=2\sum_{r\geq0}{1\over(2r+1)3^{2r+1}}
 >{842\over1215}>{9\over13},                                \tag{4.6a}
\]

so `36/log(2)<52`, and the remaining endpoint lattice point is absorbed by
the slack from `52` to `53`.

For `m>=100000`, direct rational/monotone comparison gives

\[
 68688(m+1)^{11}\log^5(2(m+1))\leq e^{am/2}.                \tag{4.7}
\]

At `m=100000` the logarithm of the left side is below `159`: use
`log(68688)<12`, `log(100001)<12`, and
`log(log(200002))<3`.  On the other hand `55.241<56` gives
`am/2>300000/448>669`.  The derivative of the latter logarithmic difference
is positive thereafter because

\[
 {a\over2}>{11\over m+1}
       +{5\over(m+1)\log(2(m+1))}.                          \tag{4.8}
\]

Consequently the tail beginning at (4.3) is at most

\[
 {Z_*55.241^3\,e^{-aM_\lambda/2}
       \over1-e^{-a/2}}
 \leq {Z_*55.241^3\over1-e^{-a/2}}\lambda^{-9}.             \tag{4.9}
\]

Before `J_lambda`, (4.4) gives the explicit bounds

\[
 L_j< L_\lambda^*:=6M_\lambda^3\log(2M_\lambda),\qquad
 J_\lambda\leq1+{L_\lambda^*-\log6\over\log2}.             \tag{4.10}
\]

Equations (3.6), (4.5), and (4.9)--(4.10), together with
`D_S(lambda)<=C_D*lambda^7`, prove

\[
 \boxed{B_{\rm hyb}(\lambda)
 =O\!\left(\lambda^3\operatorname {polylog}\lambda\right).} \tag{4.11}
\]

All finite quantities are (3.6) or the displayed majorants above; the `O`
notation in (4.11) is used only to read the qualitative limit.

## 5. First odd-scale corollary

On the locked half-integer exponential projection schedule,
`COMPACT_ABSOLUTE_SAMPLING_THEOREM.md` proves

\[
 \|P_\lambda\|_{\mathfrak Z}^2=o(d_4).                     \tag{5.1}
\]

For `R_lambda=O_lambda+P_lambda`, ordinary sequence Hilbert-space geometry,
not Weil positivity, gives

\[
 \|R_\lambda\|_{\mathfrak Z}^2
 \leq2B_{\rm hyb}(\lambda)d_4+2\|P_\lambda\|_{\mathfrak Z}^2.
                                                               \tag{5.2}
\]

The pinned fixed-index limit is

\[
 {d_6\over d_4}\sim {128\pi^2\over15}\lambda^4.           \tag{5.3}
\]

Equations (4.11), (5.1), and (5.3) therefore prove

\[
 \boxed{\epsilon_\lambda:=
       \|R_\lambda\|_{\mathfrak Z}^2=o(d_6).}              \tag{5.4}
\]

Since `|W_Z(R,R)|<=||R||_mathfrakZ^2`, the common
normalization-free upper shift in both parity blocks is also `o(d_6)`.
This removes the scalar-shift obstruction recorded in
`PARITY_SHIFT_SCALE_AUDIT.md`.  It supplies neither the unshifted odd floor
nor the shifted odd Schur sign; those remain independent obligations.
