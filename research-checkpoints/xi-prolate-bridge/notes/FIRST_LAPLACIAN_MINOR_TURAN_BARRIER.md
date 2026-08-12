# First Laplacian minor: exact Turan barrier

## 0. Exact outcome and claim boundary

This note evaluates the first matrix gate after the simultaneous positive-
degree theorem.  On the arbitrary-right-edge, nonattained record sequence
of the frozen record-filter theorem, the edge joining vertices `0` and `1`
has the rigorous sign

\[
 \boxed{w_{01}(L_n)>0.}                              \tag{0.1}
\]

That sign does not settle the first principal minor.  With the exact causal
resolvent notation introduced below, its normalized determinant is

\[
 \boxed{
 {L^2\over4p_0^2p_1^2}\{d_0d_1-w_{01}^2\}
  =(\Psi+\rho _0)(Y+\rho _1)-U^2.}                 \tag{0.2}
\]

The zero-side main term is the signed Turan quantity

\[
 \boxed{
 \Psi Y-U^2
 =q^2\{\Psi T^2\Psi-(T\Psi)^2\}
 ={1\over2}\sum_{\alpha,\beta\in Z_+}
 c_\alpha c_\beta(m_\alpha-m_\beta)^2.}            \tag{0.3}
\]

The complete prime, Gaussian, low-edge, and finite-anchor residual in (0.2)
is rigorously `o(q^2*P_n^2)` after an allowed refinement of the record
sequence.  Consequently, a strictly positive covariance margin of order
`P_n^2` is sufficient for the first minor.  No such margin is proved.

Under RH, (0.3) is a nonnegative real weighted variance, but nonnegativity
alone has no strict margin with which to absorb the residual.  Off the
critical line, a single conjugate pair makes a negative algebraic
contribution to (0.3).  That pair is only a synthetic centered-zero quartet:
it is not the actual zeta zero set, not a nonattained-edge counterexample,
and not an actual-source disproof.

Thus (0.3), rather than another scalar degree sign, is the first unresolved
actual-source matrix gate.  Nothing here proves the complete reduced
Laplacian positive, a routing contraction, finite hyperbolicity, equation
(5.2) of `DIRECT_RH_ATTACK.md`, a Lambda bound, or the Riemann hypothesis.
The formal project state remains `P0_INVALIDATED`.

## 1. Frozen dependencies and endpoint notation

The calculation is bound to the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/NONATTAINED_HIGH_EDGE_RECORD_FILTER_THEOREM.md` | `14be9eca50d64ff2c4c6710e1523238e1a3df21464f40b13b9ab86478b0e61ae` |
| `notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md` | `4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be` |
| `notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md` | `cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d` |
| `notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md` | `18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b` |
| `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` | `ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171` |

At vertex `1`, set

\[
 a={2\pi\over L},\qquad q=a^2.                     \tag{1.1}
\]

Let `T=T_q` be the zero-data causal inverse of `D^2+q` on `[0,L]`:

\[
 (Tf)(t)=\int_0^t{\sin\{a(t-v)\}\over a}f(v)\,dv. \tag{1.2}
\]

An expression such as `T f` or `T^2 f` without a displayed argument below
means its endpoint value at `L`.  The resonance `aL=2*pi` is always retained.
Put

\[
 S=\sqrt L\,J_L,\qquad
 \Psi=-A_0,\qquad
 U=(I-qT)\Psi=-A_1,\qquad
 Y=(I-qT)^2\Psi.                                   \tag{1.3}
\]

The fixed-mode limits are

\[
 \sqrt Lp_0\longrightarrow C>0,
 \qquad \sqrt Lp_1\longrightarrow-2C.             \tag{1.4}
\]

In particular, `p_0>0>p_1` for every sufficiently late natural cutoff.

## 2. Exact degree and edge formulas

Choose a fixed low/high separator `b_0` as in the frozen record-filter
theorem.  In its notation define the exact errors

\[
 \rho _0={S\over p_0},                              \tag{2.1}
\]

and

\[
 \rho _1=q{\cal R}_q\Psi_<
 +{{\cal H}_{1,>}+{\cal M}_{1,<}+S\over p_1},
 \qquad {\cal R}_q=2T-qT^2.                        \tag{2.2}
\]

Equations (6.8) and (6.11) of the frozen record theorem give, without an
asymptotic replacement,

\[
 \boxed{
 d_0={2p_0^2\over L}(\Psi+\rho _0),\qquad
 d_1={2p_1^2\over L}(Y+\rho _1).}                  \tag{2.3}
\]

The locked weighted-Loewner/source-Cauchy edge formula has

\[
 D_{01}={0\cdot A_0-qA_1\over0-q}=A_1.
\]

Therefore

\[
 \boxed{w_{01}={2p_0p_1\over L}A_1
 =-{2p_0p_1\over L}U.}                             \tag{2.4}
\]

Substitution of (2.3)--(2.4) proves the exact normalization (0.2).  This is
the first condition not contained in the scalar inequalities `d_0>0` and
`d_1>0`: the `{0,1}` principal block is positive definite only if, in
addition,

\[
 d_0d_1-w_{01}^2>0.                                \tag{2.5}
\]

## 3. The edge `w_(01)` is positive on the record sequence

Assume the centered-zero right edge `B>0` is not attained.  Fix any prefix
`K>=1`, choose

\[
 B\theta_K<\eta<B,                                 \tag{3.1}
\]

and retain the strict natural-grid record sequence from the frozen theorem.
It supplies

\[
 P_n=R_ne^{\eta L_n},\qquad
 \Psi(L_n)=P_n\{1+o(1)\},\qquad R_n\longrightarrow\infty. \tag{3.2}
\]

For `0<=t<=L_n`, put

\[
 h_n(t)=R_ne^{\eta t}-\Psi(t)\geq0.                \tag{3.3}
\]

Natural-grid transfer gives `h_n(L_n)=o(P_n)`.  The exact resonant
comparator is

\[
 \boxed{
 (I-qT)e^{\eta\,\cdot}(L)
 =e^{\eta L}{\eta^2\over\eta^2+q}
  +{q\over\eta^2+q}>0.}                            \tag{3.4}
\]

Consequently,

\[
 U=R_n(I-qT)e^{\eta\,\cdot}(L_n)
       -h_n(L_n)+qTh_n.                             \tag{3.5}
\]

For `a=2*pi/L`, the kernel of `qT` at the endpoint is
`a*sin(a(L-t))`.  Its negative support is contained in `0<=t<=L/2`.
Using `h_n(t)<=R_n*e^(eta*t)+C_Z*e^(B*t)` there gives

\[
 qTh_n\geq-{C\over L_n}
 \{R_ne^{\eta L_n/2}+e^{BL_n/2}\}.                \tag{3.6}
\]

The first kernel root used to define `theta_1` is smaller than `pi`, so
`theta_1>1/2`.  Since `theta_K>=theta_1`, (3.1) implies `eta>B/2`.
After division by `P_n`, both terms in (3.6) tend to zero.  Equations
(3.2)--(3.6) therefore yield the one-sided estimate

\[
 U(L_n)\geq P_n\{1-o(1)\}>0.                       \tag{3.7}
\]

There is deliberately no matching upper estimate: positive kernel lobes
can enlarge `U`.  Combining (1.4), (2.4), and (3.7) proves (0.1).  This
argument signs one edge on the nonattained record sequence; it does not
sign all edges or prove positive-graph connectivity.

## 4. Exact Turan identity

For each centered-zero representative define

\[
 c_\alpha={2\{\cosh(\alpha L)-1\}\over\alpha^2},
 \qquad
 \nu_\alpha={1\over\alpha^2+q},
 \qquad
 m_\alpha={\alpha^2\over\alpha^2+q}=1-q\nu_\alpha. \tag{4.1}
\]

The endpoint resolvent identities are

\[
 T\Psi=\sum_\alpha c_\alpha\nu_\alpha,
 \quad
 T^2\Psi=\sum_\alpha c_\alpha\nu_\alpha^2,
 \quad
 U=\sum_\alpha c_\alpha m_\alpha,
 \quad
 Y=\sum_\alpha c_\alpha m_\alpha^2.               \tag{4.2}
\]

All sums of complete zero contributions are absolutely convergent for fixed
`L`.  At a resonance `alpha^2+q=0`, the bare factors `nu_alpha` and
`m_alpha` have simple poles.  They are not assigned finite values.  The
quadratic zero of `c_alpha` makes only the complete summands
`c_alpha*nu_alpha`, `c_alpha*nu_alpha^2`, `c_alpha*m_alpha`, and
`c_alpha*m_alpha^2` removable.  The pair-sum expression below is likewise
interpreted by the continuous limit of its complete summands.  More
explicitly, at `alpha->i*a` with `aL=2*pi`, those four limits are,
respectively,

\[
 0,\qquad {L^2\over4a^4},\qquad0,\qquad {L^2\over4}. \tag{4.2a}
\]

Expanding the two products away from resonance and then taking those
limits gives

\[
 \begin{aligned}
 \Psi Y-U^2
 &=q^2\{\Psi T^2\Psi-(T\Psi)^2\}\\
 &={1\over2}\sum_{\alpha,\beta}
 c_\alpha c_\beta(m_\alpha-m_\beta)^2.
 \end{aligned}                                     \tag{4.3}
\]

This proves (0.3).  The word `variance` in this note refers only to this
algebraic identity.  Unconditionally its weights and nodes are complex or
signed, so it has no positivity interpretation.

## 5. The full residual is below the natural Turan scale

The all-order prime estimate and (1.4) give, for every fixed `A`,

\[
 \rho _0=O_A(L\lambda^{-A}).                        \tag{5.1}
\]

The exact low/high split in the record theorem gives

\[
 \rho _1
 =O_{b_0}(L^{-1}e^{b_0L})
  +O(\sqrt L\,e^{-dL^2})
  +O_A(L\lambda^{-A}).                             \tag{5.2}
\]

Inverse-square zero summability, the qualitative zero-height gap, and the
bounded multipliers in (4.2) give

\[
 |\Psi(L)|+|Y(L)|=O(e^{BL}).                        \tag{5.3}
\]

The record construction permits any `0<b_0<eta`.  Since (3.1) implies
`2*eta-B>0`, choose more precisely

\[
 0<b_0<\min\{\eta,2\eta-B\}.                       \tag{5.4}
\]

Recall `lambda=e^(L/2)` and `q^2=(2*pi)^4*L^(-4)`.  Take `A` large in the
all-order estimates, pass to a sufficiently late tail with `R_n>=1`, and
use (3.2).  Equations (5.1)--(5.4) then give

\[
 \boxed{
 \rho _0Y+\rho _1\Psi+\rho _0\rho _1
   =o(q^2P_n^2).}                                  \tag{5.5}
\]

For example, the only exponential comparison not settled directly by the
Gaussian or all-order factors is

\[
 {L^{-1}e^{(b_0+B)L}\over L^{-4}R_n^2e^{2\eta L}}
 \leq L^3e^{-(2\eta-B-b_0)L}\longrightarrow0,      \tag{5.6}
\]

which is exactly why (5.4) is retained.  The remaining terms have either
`e^(-d*L^2)` or an arbitrarily strong `e^(-A*L/2)` factor.  Passing to this
tail preserves every record and strict-grid property.

Combining (0.2), (4.3), and (5.5) leaves the exact asymptotic gate

\[
 {L_n^2\over4p_0^2p_1^2}\{d_0d_1-w_{01}^2\}
 =q^2\{\Psi T^2\Psi-(T\Psi)^2\}+o(q^2P_n^2).       \tag{5.7}
\]

Before discarding the signed residual, the exact requirement is that
`q^2*{Psi*T^2*Psi-(T*Psi)^2}` plus that residual be positive.  Any proof
using only the absolute estimate (5.5) must make its positive Turan term
dominate the explicit residual.  The following `P_n^2` margin is one clean
sufficient way to do so; it is neither an equivalence nor the weakest
possible condition.  In particular, it may be much too strong when the
dominant nonattained-edge ordinates escape and the resolvent nodes shrink.

### Lemma 5.1 (sufficient positive margin)

If, on a refinement of the same record sequence,

\[
 \boxed{
 \liminf_{n\to\infty}
 {\Psi T^2\Psi-(T\Psi)^2\over P_n^2}>0,}           \tag{5.8}
\]

then `d_0*d_1-w_(01)^2>0` eventually.  Since the record theorem already
gives `d_0,d_1>0`, the `{0,1}` principal block is then positive definite.

**Proof.**  A positive lower bound in (5.8), multiplied by `q^2`, dominates
the signed error in (5.7).  The prefactor removed in (5.7) is positive.
\(\square\)

Mere nonnegativity in (5.8), without a positive lower margin, is not
sufficient: the main Turan term may vanish or be smaller than the residual,
whose sign is not controlled.  Lemma 5.1 is a reduction, not an established
property of the actual zero set.

## 6. RH-conditional variance and its exact limitation

Assume RH only in this section.  Write `alpha=i*gamma`, with `gamma>0` and
multiplicity.  Then

\[
 c_\gamma={2\{1-\cos(\gamma L)\}\over\gamma^2}\geq0,
 \qquad
 m_\gamma={\gamma^2\over\gamma^2-q}\in\mathbb R.  \tag{6.1}
\]

With removable resonance limits understood for the complete summands,
(4.3) becomes

\[
 \boxed{
 \Psi Y-U^2
 ={1\over2}\sum_{\gamma,\delta>0}
 c_\gamma c_\delta(m_\gamma-m_\delta)^2\geq0
 \qquad\text{under RH}.}                           \tag{6.2}
\]

This is a useful sign check, not the needed theorem.  It supplies neither
strictness nor the quantitative `P_n^2` lower margin in (5.8).  Moreover,
the record sequence under study belongs to the RH-false `B>0` branch, so
(6.2) cannot be inserted into that branch.

## 7. Why an off-axis pair has no variance sign

Take a purely algebraic conjugate pair `alpha,bar(alpha)` with
`Re(alpha)>0`, and set

\[
 c=c_\alpha,\qquad \nu=(\alpha^2+q)^{-1}.
\]

Its two-term contribution to the covariance in (4.3) is exactly

\[
 \begin{aligned}
 &(c+\bar c)(c\nu^2+\bar c\bar\nu^2)
   -(c\nu+\bar c\bar\nu)^2\\
 &\hspace{30mm}=|c|^2(\nu-\bar\nu)^2
 =-4|c|^2\{\Im\nu\}^2<0,                          \tag{7.1}
 \end{aligned}
\]

provided `c` and `Im(nu)` are nonzero.  Equivalently, its contribution to
the Turan term is

\[
 \boxed{-4q^2|c|^2\{\Im\nu\}^2<0.}                \tag{7.2}
\]

The negativity is compatible with positive scalar signals.  Fix
`alpha=beta+i*gamma` with `0<beta<gamma`, take phase-aligned lengths
`gamma*L=(2r+1)*pi`, and let `r` tend to infinity.  Then
`Re(c_alpha)>0`, while `q=(2*pi/L)^2` tends to zero and
`m_alpha=1+o(1)`.  Hence the conjugate-pair values `Psi`, `U`, and `Y` are
all positive and pairwise comparable for large `r`, even though (7.2) is
negative.

This construction is intentionally only an algebraic quartet
`{+/-alpha,+/-bar(alpha)}`.  It has an attained edge, carries no
Riemann--von Mangoldt inventory, and is not asserted to arise from zeta or
from the pinned prime--archimedean source.  It neither contradicts the
nonattained record theorem nor disproves the actual first minor.  Its exact
role is to show why conjugation symmetry does not turn the off-axis Turan
form into a positive variance.

## 8. Surviving gate

The nonattained record theorem now signs `d_0`, `d_1`, and `w_(01)` on one
sequence.  The unresolved first matrix question is precisely the strict
margin (5.8), or another actual-source inequality strong enough to imply
(2.5).  Even a proof of this first minor would not by itself settle the
higher Schur pivots, positive connectivity, or the full routing norm.
