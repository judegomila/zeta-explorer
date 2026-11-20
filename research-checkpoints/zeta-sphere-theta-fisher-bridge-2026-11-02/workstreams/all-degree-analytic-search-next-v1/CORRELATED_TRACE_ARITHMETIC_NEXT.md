# The canonical joint-channel completion behind the correlated trace

## Scope and result

This note attacks the combined-vector inequality in
`ANGLE_THETA_VECTOR_NEXT.md` without splitting its mismatch covector into
separate Cauchy bounds. There is an exact joint Gram completion which keeps
the positive derivative channel and the old signed theta channel coupled. It
yields

\[
\boxed{
\begin{aligned}
 &\begin{pmatrix}q\\t\end{pmatrix}^{\!*}
 \begin{pmatrix}H&r\\r^*&g\end{pmatrix}
 \begin{pmatrix}q\\t\end{pmatrix}\\
 &\quad=\inf_{a\in P}\{G_Y[a+q+tq_Y]+Q[a+tq_A]\}
       +|t|^2Q[\pi],
\end{aligned}}                                                    \tag{1}
\]

where `q_Y` is the old derivative-channel regression, `q_A` is the old
actual-target regression, and `pi=p-q_A`. Both forms inside the infimum are
nonnegative on the stipulated old prefix. They vanish simultaneously at

\[
 t=1,\qquad q=q_A-q_Y,\qquad a=-q_A.               \tag{2}
\]

Consequently the natural combined-vector test is saturated by an actual old
theta polynomial and

\[
\boxed{
\begin{pmatrix}q_A-q_Y\\1\end{pmatrix}^{\!*}
\begin{pmatrix}H&r\\r^*&g\end{pmatrix}
\begin{pmatrix}q_A-q_Y\\1\end{pmatrix}
=Q[\pi]=2\mathfrak q[\pi]=2S.}                    \tag{3}
\]

Thus realizing the bordered parallel-trace matrix as a positive joint-channel
covariance is equivalent to supplying a final orthogonal component of squared
norm `Q[pi]`. Calling that component an innovation or conditional variance
does not prove its sign. This does not refute a theta-specific proof of
`Q[pi]>=0`; it identifies exactly where such arithmetic must enter.

No finite-degree computation, endpoint sign, or RH conclusion is used.

## 1. Old and new channel data

Let `P` be one finite fixed-parity old polynomial prefix. Use

\[
 Xa=2h\,a(D)\psi+a'(D)\psi,
 \qquad Ya=a'(D)\psi,                              \tag{4}
\]

and suppose the old signed block is positive. In a coefficient basis set

\[
 G_X=X^*X,\qquad G_Y=Y^*Y,\qquad Q=G_X-G_Y>0.      \tag{5}
\]

For the new polynomial `p`, write

\[
 b_X(q)=\langle Xq,Xp\rangle,\quad c_X=\|Xp\|^2,
 \qquad
 b_Y(q)=\langle Yq,Yp\rangle,\quad c_Y=\|Yp\|^2. \tag{6}
\]

The Gram property gives `b_Y in Ran G_Y`: if `G_Yq=0`, then `Yq=0` and
`b_Y(q)=0`. Hence

\[
 q_Y=G_Y^\dagger b_Y                                  \tag{7}
\]

is defined modulo `ker G_Y`. Put

\[
 d=b_X-b_Y,\qquad q_A=Q^{-1}d,\qquad \pi=p-q_A.    \tag{8}
\]

Thus `q_A` is the old actual-target regression. The two positive channel
innovations are

\[
 A_X=c_X-b_X^*G_X^{-1}b_X,
 \qquad B_Y=c_Y-b_Y^*G_Y^\dagger b_Y.              \tag{9}
\]

The parallel metric, mismatch, and available scalar innovation are

\[
\begin{aligned}
 H&=G_Y-G_YG_X^{-1}G_Y,\\
 r&=b_Y-G_YG_X^{-1}b_X,\\
 g&=A_X-B_Y.
\end{aligned}                                      \tag{10}
\]

These definitions include the singular even-prefix derivative channel.

## 2. A three-block matrix whose short is the trace target

Introduce

\[
 \mathcal M=
 \begin{pmatrix}
  G_X&G_Y&b_X\\
  G_Y&G_Y&b_Y\\
  b_X^*&b_Y^*&c_X-B_Y
 \end{pmatrix}.                                    \tag{11}
\]

Because `G_X>0`, shorting the first block gives exactly

\[
 \mathcal M/G_X
 =\boxed{\begin{pmatrix}H&r\\r^*&g\end{pmatrix}}. \tag{12}
\]

Indeed, its entries are

\[
 G_Y-G_YG_X^{-1}G_Y,\quad
 b_Y-G_YG_X^{-1}b_X,\quad
 c_X-B_Y-b_X^*G_X^{-1}b_X.                        \tag{13}
\]

The last expression is `A_X-B_Y`.

Define the new actual-target Schur residual

\[
 \sigma:=c_X-c_Y-d^*Q^{-1}d
 =Q[\pi]=2\mathfrak q[\pi].                       \tag{14}
\]

For all `alpha,beta in P` and scalar `t`, direct expansion gives the coupled
factorization

\[
\boxed{
\begin{aligned}
 &\begin{pmatrix}\alpha\\\beta\\t\end{pmatrix}^{\!*}
  \mathcal M
  \begin{pmatrix}\alpha\\\beta\\t\end{pmatrix}\\
 &\quad=G_Y[\alpha+\beta+tq_Y]
       +Q[\alpha+tq_A]+\sigma|t|^2.
\end{aligned}}                                     \tag{15}
\]

The scalar coefficient checks because

\[
\begin{aligned}
 G_Y[q_Y]+Q[q_A]+\sigma
 &=b_Y^*G_Y^\dagger b_Y+d^*Q^{-1}d\\
 &\quad+c_X-c_Y-d^*Q^{-1}d\\
 &=c_X-(c_Y-b_Y^*G_Y^\dagger b_Y)=c_X-B_Y.
\end{aligned}                                      \tag{16}
\]

The first old--scalar cross term is `b_Y+d=b_X`; the second is `b_Y`.
Thus (15) is an identity, not a positivity assumption.

If `G_Y` is nonsingular, (15) is the explicit congruence

\[
 \mathcal M\sim G_Y\oplus Q\oplus[\sigma],       \tag{17}
\]

so

\[
 \det\mathcal M=\det(G_Y)\det(Q)\,\sigma.         \tag{18}
\]

When `G_Y` is singular, (15) descends to the quotient by `ker G_Y` and gives
the same inertia statement there. No inverse of `G_Y` outside its range is
used. More explicitly, on

\[
 P\oplus(P/\ker G_Y)\oplus\mathbb C
\]

the triangular map

\[
 (\alpha,[\beta],t)\longmapsto
 ([\alpha+\beta+tq_Y],\alpha+tq_A,t)              \tag{18a}
\]

is bijective. This is the quotient congruence meant above; no determinant is
assigned to the discarded null directions.

## 3. The exact combined variational identity

For fixed `(q,t)`, minimizing the left side of (15) over `alpha` is precisely
the Schur complement (12). This proves (1). Since `Q>0` and `G_Y>=0`, the
first two terms on the right of (1) are nonnegative. At (2) they both vanish.
Hence

\[
\boxed{
 \begin{pmatrix}H&r\\r^*&g\end{pmatrix}\succeq0
 \quad\Longleftrightarrow\quad Q[\pi]\ge0.}       \tag{19}
\]

This remains true when `G_Y` is singular. Changing the representative `q_Y`
by an element of `ker G_Y` changes the witness by the corresponding null
vector but leaves (1)--(3) invariant.

The previous regression notation gives

\[
 q_Y-q_A=(q_Y-q_X)+(q_X-q_A),                     \tag{20}
\]

the sum of the two regression disagreements. It is a quotient representative
of `H^dagger r`. Thus `q_A-q_Y` is the sign-reversed Riesz direction which
saturates the trace inequality. The intermediate positive-`X` regression
`q_X` cancels from the final joint completion.

If `G_Y` is nonsingular, using

\[
 \det H={\det(G_Y)\det(Q)\over\det(G_X)}           \tag{21}
\]

also gives

\[
\boxed{
 \det\begin{pmatrix}H&r\\r^*&g\end{pmatrix}
 =\det(H)\,Q[\pi].}                               \tag{22}
\]

Equation (22) is a determinant version of the same statement, not a new sign
source.

## 4. Complete-theta form and the covariance no-go

For old polynomials the two nonnegative terms in (1) have the undivided
complete-theta formulas

\[
 G_Y[u]={1\over\pi}\int_{\mathbb R}
       \Xi(\nu)^2|P_u'(\nu)|^2\,d\nu,             \tag{23}
\]

\[
 Q[v]={2\over\pi}\int_{\mathbb R}
  \{\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu)\}
  |P_v(\nu)|^2\,d\nu.                            \tag{24}
\]

Formula (24) is nonnegative here only because `v` lies in the stipulated old
positive prefix. The remaining scalar is

\[
 Q[\pi]={2\over\pi}\int_{\mathbb R}
  \{\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu)\}
  |P_\pi(\nu)|^2\,d\nu,                          \tag{25}
\]

which is exactly the new directional pivot.

In modular coordinates,

\[
 G_Y[u]=\int_0^\infty
 \left|{\Delta_u(h)\over D_{-\epsilon}(h)}\right|^2dh, \tag{26}
\]

with the quotient read by its removable center limit. The `Q` term retains
the assembled `Omega/D_epsilon` and `Delta/D_(-epsilon)` density; its
division-free corrected-feature form supplies the global domain statement.
Thus (1) does not separate a raw theta feature, residue, or residue-drift term.

There is an abstract conditional-covariance interpretation of (15), but it is
diagnostic rather than a proof. On the old joint Hilbert sum, represent

\[
 q\longmapsto(G_Y^{1/2}q,Q^{1/2}q),
 \qquad q\longmapsto(G_Y^{1/2}q,0).                \tag{27}
\]

The least-norm vector matching the two new moment columns has old-coordinate
part

\[
 (G_Y^{\dagger/2}b_Y,Q^{-1/2}d),                  \tag{28}
\]

of squared norm

\[
 b_Y^*G_Y^\dagger b_Y+d^*Q^{-1}d.                \tag{29}
\]

The proposed total squared norm is `c_X-B_Y`; their difference is exactly
`Q[pi]`. A Hilbert Gram completion therefore exists if and only if the missing
target pivot is nonnegative. Adding an orthogonal "innovation" coordinate of
norm `sqrt(Q[pi])` assumes the desired sign; if `Q[pi]<0`, the completion is a
one-negative-direction Krein Gram instead.

Every old-channel term in the canonical combined test (2) cancels exactly.
Bounds using only the two old positive norms, their modular denominators, or
their abstract conditional-expectation geometry have no reserve on that
direction. Additional arithmetic must act on the particular residual `pi`.

## 5. Relation to the 2026 closed-trace quotient framework

Freedman's 2026 Weyl/Volterra manuscript gives a general closed-trace
Douglas--Moore--Penrose decomposition

\[
 q(n+u)=\|A^{1/2}n+\Gamma u\|^2
       +\langle(C-\Gamma^*\Gamma)u,u\rangle        \tag{30}
\]

inside a normalized full-theta Volterra quotient model. Algebraically, (15)
is the finite polynomial-channel analogue of (30): the first two squares are
the closed old-channel component and `Q[pi]` is the quotient Schur residual.

That source cannot supply the missing sign here without a new identification.
Its status layers are unreconciled: earlier sections list the
quotient-to-original Weyl lift and uniform `|omega|<1/2` coverage as open,
whereas later Appendix C asserts them. Even granting those strongest later
claims, the normalized quotient certificate is not identified with the
present Xi--Laguerre polynomial pivot. A proved evaluation-trace and joint
branch isometry pullback to the de Branges/KLM kernel, followed by the real
boundary and `omega downarrow 0` passage, is still absent. Importing its
positive quotient residual into (1) would therefore assume that external
bridge, not establish `Q[pi]>=0`. The detailed source-status and normalization
audit is in `VOLTERRA_QUOTIENT_CROSSWALK_NEXT.md`.

Primary source: Marvin B. Freedman, *Finite-core Volterra reductions for a
Weyl-positive Riemann phase kernel*, arXiv:2606.29555 (2026), especially
Sections 15.7 and C: <https://arxiv.org/abs/2606.29555>.

## 6. Resulting target and nonclaims

The joint completion supplies an exact answer to the combined-vector question:

1. it couples innovation and mismatch before any Cauchy estimate;
2. it remains valid for singular `G_Y` and uses only complete-theta polynomial
   domains;
3. its exact saturating direction is the old polynomial `q_A-q_Y`;
4. its only unpaired scalar is the actual new pivot `Q[pi]`.

A viable continuation must therefore prove `Q[pi]>=0` from arithmetic or
regional information which distinguishes the particular Galerkin residual.
The generic joint-channel completion itself supplies no strict reserve.

- Equations (1)--(3) do not show that `Q[pi]` is negative or positive.
- The congruence is all-rung finite-prefix algebra, not a finite-degree
  certificate.
- In (1), both arguments of `G_Y` and `Q` lie in the old polynomial prefix;
  the only new-direction evaluation is the explicitly displayed `Q[pi]`.
  Complete-theta decay makes all physical and spectral integrals finite.
- The square roots in (27)--(29) expose only the minimal completion norm; they
  do not replace the undivided theta formulas or cross a real Xi zero.
- A floating random-matrix replay of (12), (15), and the witness (3) was used
  only as an implementation check. The proof is the exact expansion above.
- The translation-kernel total-positivity route is unavailable independently:
  `RECENT_PF5_BARRIER_NEXT.md` records that the complete de Bruijn--Newman
  kernel is not `PF_5`. This note does not use variation diminution or claim
  anything about the associated Turan profile from that fact.
- No endpoint sign, all-degree closure, equivalence of the first Laguerre
  inequality with RH, or RH conclusion is asserted.
