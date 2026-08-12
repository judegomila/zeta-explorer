# Locked-bandwidth odd high-Feshbach reduction

## 0. Claim boundary

This note combines the source-selected favorable odd pole direction with the
explicit high-Fourier coercivity theorem at the same locked exponential
bandwidth.  It proves that the shifted odd sign is equivalent to positivity
of an exact Feshbach matrix of dimension
`exp(O(lambda*log(lambda)))+1`, rather than the full exponentially larger
odd matrix.

The high tail is eliminated exactly, including all of its feedback.  The
remaining low Feshbach matrix is not proved positive.  This note also shows
that the critical-load obstruction from
`notes/ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md` applies at the fixed locked
bandwidth, rather than only after a qualitative parameter-by-parameter
cutoff choice.

No zero table, global Weil positivity, or separate norm estimate for the
pole, archimedean, and prime blocks is used.  This proves neither an odd
floor, equation (5.2), locally uniform determinant convergence, nor the
Riemann hypothesis.  The formal project state remains `P0_INVALIDATED`.

## 1. Favorable direction and the honest high cutoff

Let

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},
 \qquad N=N_{\exp}=2^{2400p^2}=2^{9600\lambda^2},          \tag{1.1}
\]

and suppose `lambda` is one of the source-selected favorable parameters in
equation (4.2) of
`notes/ODD_FAVORABLE_EXPONENTIAL_BANDWIDTH_TRANSFER.md`.  In the exact odd
Fourier space `E_N^-`, put

\[
 p_N=P_N\sinh(x/2),\qquad
 \mu_N=\|p_N\|^2,\qquad
 e={p_N\over\sqrt{\mu_N}},\qquad
 \alpha=\langle e,Q_-e\rangle.                            \tag{1.2}
\]

The effective transfer theorem gives

\[
 \boxed{\alpha\geq{3c_0\over4}.}                          \tag{1.3}
\]

Let

\[
 \beta=U_Z={\epsilon_\lambda\over a_{\lambda,N}^2}       \tag{1.4}
\]

be the admitted live upper shift, where `a_(lambda,N)` is the norm of the
projected even comparison state.  The hybrid remainder theorem and the
projected-state norm lower bound prove `beta=o(d_6)`, hence `beta->0` on the
full locked schedule.  On all sufficiently large favorable parameters, put
`r=alpha-beta`; then

\[
 0\leq\beta<{c_0\over4},
 \qquad r:=\alpha-\beta\geq{c_0\over2}.                  \tag{1.5}
\]

Use the exact cutoff in equation (5.5) of
`notes/HIGH_FOURIER_COERCIVITY.md`:

\[
 M_\lambda=M_*\!\left(\lambda,{c_0\over4},1\right).
                                                                    \tag{1.6}
\]

It satisfies

\[
 \log M_\lambda=O(\lambda\log\lambda),
 \qquad M_\lambda<N_{\exp}                               \tag{1.7}
\]

eventually.  Let `E_>M^-` be the odd span of the modes with
`M_lambda<n<=N`.  The high-compression theorem gives

\[
 P_{>M}^-(Q_--c_0I/4)P_{>M}^-\succeq P_{>M}^-.
\]

Together with (1.5), this proves

\[
 \boxed{
 P_{>M}^-(Q_--\beta I)P_{>M}^-\succeq P_{>M}^-.}          \tag{1.8}
\]

The cutoff is built from the complete source constants `C_a(lambda)` and
`c_lambda`; it retains the minus-prime sign through the exact finite matrix.

## 2. Exact dimension reduction

Let

\[
 G=e^\perp\subset E_N^-,
 \qquad
 \mathcal H_M=G\cap E_{>M}^-,
 \qquad
 \mathcal K_M=G\ominus\mathcal H_M.                      \tag{2.1}
\]

The exact pole coefficients in equation (1.4) of the exponential-bandwidth
transfer note are nonzero for every `n!=0`.  Therefore the projection of
`e` onto `E_>M^-` is nonzero.  Since `dim(E_N^-)=N` and
`dim(E_>M^-)=N-M_lambda`, one has

\[
 \dim\mathcal H_M=N-M_\lambda-1,
 \qquad
 \boxed{\dim\mathcal K_M=M_\lambda.}                    \tag{2.2}
\]

The space `K_M` is generally not the pure span of modes `n<=M_lambda`.
It also contains the one surviving high component aligned with
`P_>M^- e`; equation (2.2) is a dimension statement, not a low-mode
identification.

Relative to the orthogonal decomposition

\[
 E_N^-=\mathbb Ce\oplus\mathcal K_M\oplus\mathcal H_M,
\]

write the complete shifted odd matrix as

\[
 Q_--\beta I=
 \begin{bmatrix}
  r&b_K^*&b_H^*\\
  b_K&D&E^*\\
  b_H&E&H
 \end{bmatrix}.                                           \tag{2.3}
\]

Equation (1.8) implies

\[
 \boxed{H\succeq I.}                                     \tag{2.4}
\]

Define the exact high-shorted transverse block and forcing by

\[
 S=D-E^*H^{-1}E,
 \qquad
 \widetilde b=b_K-E^*H^{-1}b_H.                          \tag{2.5}
\]

### Theorem 2.1 (locked odd high-Feshbach equivalence)

On every sufficiently large favorable parameter for which (1.5)--(1.8)
hold,

\[
 \boxed{
 Q_--\beta I\succ0
 \quad\Longleftrightarrow\quad
 S\succ0\ \hbox{ and }\
 b_H^*H^{-1}b_H+\widetilde b^*S^{-1}\widetilde b<r.}      \tag{2.6}
\]

Equivalently, the shifted odd sign is exactly positivity of the
`(M_lambda+1)`-dimensional Feshbach matrix

\[
 \boxed{
 \begin{bmatrix}r&b_K^*\\ b_K&D\end{bmatrix}
 -\begin{bmatrix}b_H^*\\E^*\end{bmatrix}
  H^{-1}
  \begin{bmatrix}b_H&E\end{bmatrix}\succ0.}              \tag{2.7}
\]

**Proof.**  By (2.4), Schur complementation of `H` in (2.3) is exact and
preserves strict positivity.  The resulting matrix on
`C*e direct-sum K_M` is

\[
 \begin{bmatrix}
  r-b_H^*H^{-1}b_H&\widetilde b^*\\
  \widetilde b&S
 \end{bmatrix}.                                           \tag{2.8}
\]

A second Schur complement, now of `S`, gives (2.6).  Writing the first
Schur complement without expanding its blocks gives (2.7).  \(\square\)

Theorem 2.1 removes `N-M_lambda-1` transverse dimensions without replacing
their feedback by an operator-norm triangle.  This is an algebraic reduction,
not yet a cheaper exact computation: constructing its entries still requires
the high solve with `H^(-1)`.  It does not show that the remaining `S` is
positive or that its inverse-weighted effective load is smaller than `r`.

### Theorem 2.2 (direct high pole-axis feedback is negligible)

On all sufficiently large members of the locked favorable subsequence, let

\[
 K_\lambda=\lfloor\sqrt{M_\lambda}\rfloor.
\]

Then

\[
 \boxed{
 \|b_H\|
 =O\!\left(
   \lambda^2(1+\log\lambda)^{3/2}M_\lambda^{-1/4}
 \right)
 =O\!\left(\lambda^{-4\lambda+O(1)}\right),}           \tag{2.9}
\]

and consequently

\[
 \boxed{b_H^*H^{-1}b_H=o(1).}                           \tag{2.10}
\]

Moreover,

\[
 \boxed{
 \|\widetilde b-b_K\|
 =\|E^*H^{-1}b_H\|=o(1).}                              \tag{2.11}
\]

Thus the favorable scalar survives the exact high elimination:

\[
 r-b_H^*H^{-1}b_H\geq {c_0\over2}-o(1).                \tag{2.12}
\]

**Proof.**  Write the exact Cauchy decomposition from
`notes/HIGH_FOURIER_COERCIVITY.md` as

\[
 Q=D_a+C,
 \qquad \|C\|\leq c_\lambda.                            \tag{2.13}
\]

Because `mathcal H_M` is contained in the raw high space and is orthogonal
to `e`, the scalar shift and the pole-axis component are killed by its
projection:

\[
 b_H=P_{\mathcal H_M}(Q-\beta I)e=P_{\mathcal H_M}Qe,
 \qquad
 \|b_H\|\leq\|P_{>M}Qe\|.                              \tag{2.14}
\]

Split `e=P_(<=K)e+P_(>K)e`.  The separated Cauchy estimate in Lemma 2.1 of
`notes/THREE_SCALE_TRANSVERSE_RESOLVENT_REDUCTION.md`, followed by (2.13),
gives

\[
\begin{aligned}
 \|P_{>M}Qe\|
 \leq{}&d_{\lambda;K,M}
 +\max_{M<n\leq N}|a_n|\,\|P_{>M}e\|\\
 &+c_\lambda\|P_{>K}e\|,                              \tag{2.15}
\end{aligned}
\]

so, entirely at finite parameters,

\[
 b_H^*H^{-1}b_H
 \leq\left[
 d_{\lambda;K,M}
 +\bigl(\log(N+2)+C_{|a|}(\lambda)\bigr)
      \sqrt{{A_M\over\mu_N}}
 +c_\lambda\sqrt{{A_K\over\mu_N}}
 \right]^2.                                           \tag{2.15a}
\]

Here

\[
 d_{\lambda;K,M}
 =2\sqrt2B_b(\lambda)
   \sqrt{{2K+1\over M-K}}.                              \tag{2.16}
\]

The exact pole-tail bound in Lemma 1.1 of
`notes/ODD_FAVORABLE_EXPONENTIAL_BANDWIDTH_TRANSFER.md` and
`mu_N~lambda/2` give, uniformly at the displayed cutoffs,

\[
 \|P_{>K}e\|=O\!\left(\sqrt{{L\over K}}\right),
 \qquad
 \|P_{>M}e\|=O\!\left(\sqrt{{L\over M}}\right).         \tag{2.17}
\]

On the locked outer schedule,

\[
 B_b(\lambda),c_\lambda=O(\lambda\log\lambda),
 \qquad
 \max_{M<n\leq N}|a_n|
 \leq\log(N+2)+C_{|a|}(\lambda)=O(\lambda^2).           \tag{2.18}
\]

Since `K=floor(sqrt(M))`, equations (2.15)--(2.18) prove the first bound in
(2.9).  The explicit cutoff contains both positive summands

\[
 C_a(\lambda)\geq4L(\lambda-1),
 \qquad
 c_\lambda\geq4L(\lambda-1),                            \tag{2.19}
\]

so

\[
 M_\lambda\geq2\lambda^{16(\lambda-1)}-1.              \tag{2.20}
\]

This proves the second bound in (2.9).  Equation (2.4) now gives (2.10).

Finally, the high row of the complete source matrix obeys

\[
 \|E\|\leq\log(N+2)+C_{|a|}(\lambda)+c_\lambda
 =O(\lambda^2).                                         \tag{2.21}
\]

Together with `||H^(-1)||<=1` and (2.9), this proves (2.11).  Equations
(1.5) and (2.10) give (2.12).  \(\square\)

Theorem 2.2 removes only the direct high-axis load and its forcing
correction.  It gives no sign for `S` and no bound for the retained load
`b_K^*S^(-1)b_K`; that retained orientation is still the decisive term.
In particular, `widetilde b-b_K=o(1)` cannot be inserted inside the
`S^(-1)` quadratic until an appropriate inverse-energy bound for `S` has
been proved.

### Theorem 2.3 (raw-high short and neutral positive direction)

There is an equivalent elimination which avoids the high-aligned component
in `mathcal K_M`.  Put

\[
 \mathcal L_M^{\rm raw}=E_{\leq M}^-,
 \qquad
 \mathcal F_M^{\rm raw}=E_{>M}^-,                         \tag{2.22}
\]

and write

\[
 Q_--\beta I=
 \begin{bmatrix}A_0&C_0^*\\C_0&H_0\end{bmatrix}
 \quad\hbox{on}\quad
 \mathcal L_M^{\rm raw}\oplus\mathcal F_M^{\rm raw}. \tag{2.23}
\]

Then `H_0>=I` and, for the raw-low Schur complement

\[
 \Sigma_0=A_0-C_0^*H_0^{-1}C_0,                         \tag{2.24}
\]

one has the exact sign equivalence

\[
 \boxed{Q_--\beta I\succ0\quad\Longleftrightarrow\quad
        \Sigma_0\succ0.}                                \tag{2.25}
\]

Let `e=e_L+e_F` be the raw low/high decomposition of the normalized pole
direction.  The exact completion identity is

\[
 \boxed{
 r=\langle e_L,\Sigma_0e_L\rangle+\eta_{\rm hi},
 \qquad
 \eta_{\rm hi}=\|H_0^{1/2}(e_F+H_0^{-1}C_0e_L)\|^2.}   \tag{2.26}
\]

Moreover, `eta_hi=o(1)` on the full locked schedule.  On the neutral
source-selected subsequence of Theorem 4.3 in
`notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md`,

\[
 \boxed{
 \left\langle{e_L\over\|e_L\|},
       \Sigma_0{e_L\over\|e_L\|}\right\rangle
 \longrightarrow2c_0.}                                  \tag{2.27}
\]

**Proof.**  The high floor is (1.8), so ordinary Schur complementation gives
(2.25) and completing the square gives (2.26).  For an explicit bound, put

\[
 D_{\rm glob}=\log(N+2)+C_{|a|}(\lambda)+c_\lambda+\beta,
 \qquad K=\lfloor\sqrt M\rfloor.                         \tag{2.28}
\]

The exact pole tails and the separated Cauchy estimate give

\[
 \|e_F\|^2\leq{A_M\over\mu_N},
 \qquad
 \|C_0e_L\|
 \leq d_{\lambda;K,M}
       +c_\lambda\sqrt{{A_K\over\mu_N}}.                \tag{2.29}
\]

Since `||H_0||<=D_glob`,

\[
 \eta_{\rm hi}
 \leq2D_{\rm glob}{A_M\over\mu_N}
 +2\left(
 d_{\lambda;K,M}
 +c_\lambda\sqrt{{A_K\over\mu_N}}
 \right)^2=o(1)                                         \tag{2.30}
\]

by the estimates in Theorem 2.2.  The same tails give `||e_L||->1`.
On the neutral subsequence, Theorem 1.1 and Theorem 4.3 of the favorable
note, the complete-form transfer (3.4) of the exponential-bandwidth note,
and `mu_N/lambda->1/2` give

\[
 \alpha={q_\lambda(p_N,p_N)\over\mu_N}\longrightarrow2c_0.
\]

Since `beta->0`, one has `r=alpha-beta->2c_0`.  Insert this and
`eta_hi=o(1)` into (2.26) to prove (2.27).  \(\square\)

Equation (2.27) proves only one positive retained direction.  The missing
odd theorem is positivity of the whole raw-low Schur complement (2.24), or
an equivalent transverse floor and inverse-load reserve.  A zero high charge
and a positive pole-axis limit do not determine that sign.

## 3. Fixed-bandwidth critical load

The same cutoff also closes the finite-projection hypotheses left open in
Section 4 of `notes/ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md`.  Orthogonal
projection and the explicit pole tail give

\[
 \mu_N=\mu_\lambda-\|(I-P_N)p_\lambda\|^2
 =\mu_\lambda+o(1)\sim{\lambda\over2}.                    \tag{3.1}
\]

The unconditional retained-Riesz theorem proves
`mathcal G_lambda=o(lambda^2)`, while the effective complete-form transfer
gives

\[
 q_\lambda(p_N,p_N)=\mathcal G_\lambda+O(\lambda).
\]

Consequently,

\[
 \boxed{\alpha=o(\lambda).}                              \tag{3.2}
\]

Assume, only for this implication, that `Q_--beta*I` is strictly positive.
Write the complete odd operator as

\[
 Q_-=T-2|p_N\rangle\langle p_N|
\]

and define the retained-excess load

\[
 \mathcal L_{\beta,\lambda,N}
 =2\langle p_N,(T-\beta I)^{-1}p_N\rangle.                \tag{3.3}
\]

The exact critical-load identity gives

\[
 0<1-\mathcal L_{\beta,\lambda,N}
 \leq{\alpha-\beta\over2\mu_N+\alpha-\beta}.            \tag{3.4}
\]

Let `lambda_j` be any unbounded favorable subsequence on which
`Q_-(lambda_j,N_exp)-beta_j*I` is strictly positive for all sufficiently
large `j`.  Equations (1.4), (3.1), and (3.2) then prove the conditional
limit

\[
 \boxed{
 \mathcal L_{\beta_j,\lambda_j,N_{\exp}(\lambda_j)}
 \longrightarrow1^- .}
                                                                    \tag{3.5}
\]

Thus a fixed positive load gap cannot prove the odd sign even at the fixed
locked bandwidth.  A successful argument must resolve a positive margin
which may tend to zero.

On the neutral subsequence of Theorem 2.3, the conditional bound is sharper.
If the shifted odd matrices are positive there, then

\[
 \boxed{
 0<1-\mathcal L_{\beta,\lambda,N}
 \leq{2c_0+o(1)\over\lambda}.}                         \tag{3.6}
\]

Indeed `alpha-beta=2c_0+o(1)` and `2mu_N=lambda+o(lambda)` in (3.4).
This is an upper bound on the possible load reserve, not a proof that the
reserve is positive.

## 4. Remaining arithmetic theorem

The high-frequency part of the odd sign is now explicit and uniform in the
outer cutoff.  Put

\[
 \eta_\lambda=b_H^*H^{-1}b_H\geq0,
 \qquad \eta_\lambda=o(1).                               \tag{4.1}
\]

By Theorem 2.2, the remaining theorem may be sharpened to

\[
 \boxed{
 S\succ0,
 \qquad
 \widetilde b^*S^{-1}\widetilde b
 <r-\eta_\lambda,}                                      \tag{4.2}
\]

with `widetilde b=b_K+o(1)` in norm.  For an exact finite pass one must still
use the unreduced inequality (2.6), with the computed positive quantity
`eta_lambda`; the assertion `eta_lambda=o(1)` is asymptotic bookkeeping,
not a finite replacement.

Equivalently, the smallest raw-coordinate sign target is
`Sigma_0\succ0` in (2.24).  The neutral subsequence proves only that its
distinguished normalized pole direction has limiting Rayleigh quotient
`2c_0`; it does not control the remaining retained directions.

All entries in (4.2) are compressions and solves of the complete source
matrix.  Separate pole, archimedean, and prime norms do not establish it.
The favorable pole-axis theorem supplies only the right side; the signed
orientation of the low Feshbach block and effective forcing remains the
missing arithmetic input.
