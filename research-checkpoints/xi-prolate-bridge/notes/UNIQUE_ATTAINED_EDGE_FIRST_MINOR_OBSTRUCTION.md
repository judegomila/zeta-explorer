# Unique attained edge forces a negative first minor

## 0. Conditional theorem and claim boundary

Assume RH is false and the centered-zero right edge

\[
 B=\max_{\zeta\in Z_+}\Re\zeta>0                 \tag{0.1}
\]

is attained.  Assume further that its complete edge multiset consists of
exactly one conjugate orbit

\[
 \alpha=B+i\gamma,\qquad \bar\alpha=B-i\gamma,    \tag{0.2}
\]

each with the same multiplicity `r>=1`, where `gamma!=0`.  No gap below
`B` is assumed: lower zero lines may accumulate at the edge.

Under precisely this conditional actual-zeta hypothesis, there is an
unbounded strict-half-integer natural-cutoff sequence on which

\[
 \boxed{d_0>0,\qquad d_1>0,\qquad w_{01}>0,}       \tag{0.3}
\]

but

\[
 \boxed{d_0d_1-w_{01}^2<0}                         \tag{0.4}
\]

eventually.  Thus the actual `{0,1}` principal Laplacian block is
indefinite on that sequence.  The decisive normalized limit is

\[
 \boxed{
 {\Psi T_q^2\Psi-(T_q\Psi)^2\over\Psi^2}
 \longrightarrow-\{\Im(\alpha^{-2})\}^2<0.}       \tag{0.5}
\]

The proof uses the checkpoint-0.84 exact fourth-order filter, including its
uniform high-zero `H_N` residual bound.  That bound pushes every nonfiltered
source error below the `q^2*Psi^2` scale at which the rank-one leading
minor cancels.

This is a conditional obstruction for the actual zeta source, not a
synthetic zero fixture.  The edge hypothesis is not known to occur, and
the result says nothing about a multi-orbit attained edge or a nonattained
edge.  It therefore proves neither RH nor its negation.  It also proves no
Lambda bound or equation (5.2) of `DIRECT_RH_ATTACK.md`.  The formal project
state remains `P0_INVALIDATED`.

## 1. Frozen dependencies and exact first-minor formulas

The argument is bound to the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/ATTAINED_RIGHT_EDGE_VECTOR_SELECTION_THEOREM.md` | `6f67349e53e761744408bfa053874ce4f79b22aac578fa6fff48fa5915e65edf` |
| `notes/NONATTAINED_HIGH_EDGE_RECORD_FILTER_THEOREM.md` | `14be9eca50d64ff2c4c6710e1523238e1a3df21464f40b13b9ab86478b0e61ae` |
| `notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md` | `4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be` |
| `notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md` | `18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b` |
| `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` | `ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171` |
| `notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md` | `cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d` |

Take

\[
 a={2\pi\over L},\qquad q=a^2,                    \tag{1.1}
\]

and let `T_q` be the causal zero-data inverse of `D^2+q` on `[0,L]`.
An operator expression below means its endpoint value at `L`.  Define

\[
 \Psi=-A_0,\qquad
 U=(I-qT_q)\Psi=-A_1,\qquad
 Y=(I-qT_q)^2\Psi.                                 \tag{1.2}
\]

With `S=sqrt(L)*J_L`, the exact degree and edge formulas are

\[
 d_0={2p_0^2\over L}(\Psi+\rho _0),
 \qquad \rho _0={S\over p_0},                      \tag{1.3}
\]

\[
 d_1={2p_1^2\over L}(Y+\rho _1),
 \qquad
 w_{01}=-{2p_0p_1\over L}U,                        \tag{1.4}
\]

where the exact high/low decomposition of `rho_1` is recorded in Section
5.  Consequently,

\[
 \boxed{
 {L^2\over4p_0^2p_1^2}(d_0d_1-w_{01}^2)
 =(\Psi+\rho _0)(Y+\rho _1)-U^2.}                 \tag{1.5}
\]

The zero-side identity is

\[
 \boxed{
 \Psi Y-U^2
 =q^2\{\Psi T_q^2\Psi-(T_q\Psi)^2\}.}            \tag{1.6}
\]

Finally, the fixed prolate coordinates obey

\[
 \sqrt Lp_0\longrightarrow C>0,
 \qquad \sqrt Lp_1\longrightarrow-2C.             \tag{1.7}
\]

## 2. Positive-phase recurrence on the strict natural grid

Relabel the orbit so that `gamma>0` and choose real `t_j->infinity` with

\[
 {e^{i\gamma t_j}\over\alpha^2}={1\over|\alpha|^2},
 \qquad
 \gamma t_j-\arg(\alpha^2)\in2\pi\mathbb Z.       \tag{2.1}
\]

These times form an arithmetic progression.  For each `t_j`, choose the
nearest strict half integer

\[
 \lambda_j={s_j\over2},\qquad s_j\geq5\text{ odd},
 \qquad L_j=2\log\lambda_j.                        \tag{2.2}
\]

The elementary logarithmic grid estimate gives

\[
 |L_j-t_j|=O(e^{-t_j/2}).                           \tag{2.3}
\]

Thus `L_j->infinity` and the fixed edge frequency retains its phase:

\[
 \boxed{
 {e^{i\gamma L_j}\over\alpha^2}
 \longrightarrow {1\over|\alpha|^2}>0.}           \tag{2.4}
\]

This direct periodic recurrence is stronger than merely finding an
unspecified positive value of the edge almost-periodic function.  The
strict-grid displacement is exponentially small and is also within the
pinned PNT grid-transfer tolerance used for the exact source formulas.

## 3. Gap-free dominant-orbit limits

For every centered-zero representative `zeta`, set

\[
 c_\zeta(L)={2\{\cosh(\zeta L)-1\}\over\zeta^2},
 \qquad
 \nu_\zeta(L)={1\over\zeta^2+q}.                  \tag{3.1}
\]

The exact zero expansions are

\[
 \begin{aligned}
 \Psi&=\sum_\zeta c_\zeta,\\
 T_q\Psi&=\sum_\zeta c_\zeta\nu_\zeta,\\
 T_q^2\Psi&=\sum_\zeta c_\zeta\nu_\zeta^2.
 \end{aligned}                                     \tag{3.2}
\]

There is a qualitative `gamma_0>0` with `|Im(zeta)|>=gamma_0`, and

\[
 \sum_{\zeta\in Z_+}|\zeta|^{-2}<\infty.          \tag{3.3}
\]

For all sufficiently large `L`, therefore,

\[
 |\zeta^2+q|\geq{1\over2}|\zeta|^2,
 \qquad
 |\nu_\zeta|\leq2|\zeta|^{-2}.                   \tag{3.4}
\]

After multiplication by `e^(-BL)`, each lower-line forward exponential
contains `e^{-(B-Re(zeta))L}->0`.  Its absolute value is dominated by the
summable sequence in (3.3); the extra resolvents in (3.2) only improve that
majorant.  Backward exponentials and constant terms vanish under the same
majorant.  Dominated convergence therefore applies even if infinitely many
lower lines approach `B`.

Put

\[
 z=\alpha^{-2},\qquad A={2r\over|\alpha|^2}.       \tag{3.5}
\]

The unique edge orbit, its multiplicity, and (2.4) now give the five
gap-free limits

\[
 \boxed{
 \begin{aligned}
 e^{-BL_j}\Psi&\longrightarrow A,\\
 e^{-BL_j}T_q\Psi&\longrightarrow A\Re z,\\
 e^{-BL_j}T_q^2\Psi&\longrightarrow A\Re(z^2),\\
 e^{-BL_j}U&\longrightarrow A,\\
 e^{-BL_j}Y&\longrightarrow A.
 \end{aligned}}                                    \tag{3.6}
\]

For the last two lines, use
`U=Psi-q*T_q*Psi`, `Y=Psi-2*q*T_q*Psi+q^2*T_q^2*Psi`, and `q->0`.
In particular,

\[
 \Psi(L_j)>0,qquad {U(L_j)\over\Psi(L_j)}\to1,
 \qquad {Y(L_j)\over\Psi(L_j)}\to1.               \tag{3.7}
\]

No fixed separation between `B` and the lower real parts was used.

## 4. The dominant conjugate orbit has negative covariance

Equations (3.6) give

\[
 \begin{aligned}
 {\Psi T_q^2\Psi-(T_q\Psi)^2\over\Psi^2}
 &\longrightarrow
 \Re(z^2)-\{\Re z\}^2\\
 &=-\{\Im z\}^2
 =-\{\Im(\alpha^{-2})\}^2<0,
 \end{aligned}                                     \tag{4.1}
\]

which proves (0.5).  Strictness follows because `B>0` and `gamma!=0`, so
`Im(alpha^(-2))!=0`.

The same sign is visible before taking the limit.  The two edge atoms alone
contribute

\[
 r^2|c_\alpha|^2(\nu_\alpha-\bar\nu_\alpha)^2
 =-4r^2|c_\alpha|^2\{\Im\nu_\alpha\}^2<0          \tag{4.2}
\]

to `Psi*T_q^2*Psi-(T_q*Psi)^2`.  The dominated-convergence calculation in
Section 3 proves that every lower-line and edge--lower cross contribution
is `o(e^(2*B*L_j))`, even when lower real parts accumulate at `B`.  Thus
(4.2) is not a synthetic-pair argument: it is the dominant term of the
complete actual zero sum under hypothesis (0.1)--(0.2).

## 5. Checkpoint-0.84 residual is below `q^2*Psi^2`

Fix any

\[
 0<b_0<B.                                           \tag{5.1}
\]

Split the actual zeros into `Re(zeta)<b_0` and `Re(zeta)>=b_0`.  With
`R_q=2*T_q-q*T_q^2`, the exact checkpoint-0.84 formula is

\[
 \rho _1=qR_q\Psi_<
 +{{\cal H}_{1,>}+{\cal M}_{1,<}+\sqrt L\,J_L\over p_1}. \tag{5.2}
\]

The high sector `b_0<=Re(zeta)<=B`, including the unique edge orbit and
all lower lines which approach it, is handled by the uniform `H_N`
finite-anchor estimate.  Its nonfiltered remainder is Gaussian-small.  The
low sector has the fixed exponential gap `B-b_0`.  Precisely,

\[
 \rho _0=O_A(Le^{-AL/2}),                            \tag{5.3}
\]

and

\[
 \rho _1
 =O_{b_0}(L^{-1}e^{b_0L})
  +O_{b_0}(\sqrt L\,e^{-dL^2})
  +O_A(Le^{-AL/2}).                                 \tag{5.4}
\]

Here `A` in the `O_A` notation can be chosen arbitrarily large and is
unrelated to the positive constant in (3.5).  Equations (3.6), (5.3)--
(5.4), and `q^2=(2*pi)^4*L^(-4)` imply

\[
 \boxed{
 {\Psi\rho _1+Y\rho _0+\rho _0\rho _1
  \over q^2\Psi^2}
 =O_{b_0}\{L^3e^{-(B-b_0)L}\}+o(1)
 \longrightarrow0.}                               \tag{5.5}
\]

This is the gain unavailable from the older cancellation-free
`O(e^(B*L)/L)` history estimate.  The high/low `H_N` split incorporates the
entire high zero signal into the exact filter `Y` and leaves only the
Gaussian residual.

## 6. Negative actual first minor with positive scalar data

Expanding (1.5), then using (1.6), gives

\[
 \begin{aligned}
 &(\Psi+\rho _0)(Y+\rho _1)-U^2\\
 &\quad=q^2\{\Psi T_q^2\Psi-(T_q\Psi)^2\}
       +\Psi\rho _1+Y\rho _0+\rho _0\rho _1.
 \end{aligned}                                     \tag{6.1}
\]

Divide by `q^2*Psi^2` and use (4.1), (5.5):

\[
 \boxed{
 {(\Psi+\rho _0)(Y+\rho _1)-U^2\over q^2\Psi^2}
 \longrightarrow-\{\Im(\alpha^{-2})\}^2<0.}      \tag{6.2}
\]

The prefactor in (1.5) is positive, so (6.2) proves (0.4).  At the same
time, (3.6) and (5.3)--(5.4) give

\[
 \Psi+\rho _0>0,qquad Y+\rho _1>0                \tag{6.3}
\]

eventually.  Hence `d_0,d_1>0`.  Equations (1.7), (3.7), and (1.4) give
`w_(01)>0`.  In fact the leading rank-one ratios still satisfy

\[
 {d_1\over d_0}\longrightarrow4,
 \qquad {w_{01}\over d_0}\longrightarrow2,        \tag{6.4}
\]

but their leading determinant cancels and the strictly negative Turan
correction decides the first minor.

## 7. Exact scope

The theorem is about the locked, actual pole--archimedean--minus-prime
source, conditional on one explicit possible geometry of the actual zeta
zeros.  It proves that the present diagonal-forcing route cannot yield a
positive Laplacian in the unique-attained-orbit RH-false subcase: the first
principal minor has the opposite sign on its favorable scalar sequence.

It does not prove that this zero geometry occurs, exclude multiple edge
orbits, handle the nonattained edge, or turn a desired matrix positivity
statement into an unconditional theorem.  In particular, no contradiction
with known zeta facts and no conclusion about RH follows.
