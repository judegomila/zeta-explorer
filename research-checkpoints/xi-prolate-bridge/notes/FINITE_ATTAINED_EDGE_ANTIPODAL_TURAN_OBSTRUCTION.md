# Finite attained edge with antipodal phases forces a negative first minor

## 0. Conditional theorem and claim boundary

Assume RH is false and the centered-zero right edge

\[
 B=\max_{\zeta\in Z_+}\Re\zeta>0                         \tag{0.1}
\]

is attained.  Assume that its complete edge multiset is the finite union of
distinct conjugate orbits

\[
 \alpha_j=B+i\gamma_j,\qquad \overline{\alpha_j}=B-i\gamma_j,
 \qquad 1\leq j\leq m,                               \tag{0.2}
\]

where `gamma_j>0` are distinct and orbit `j` has multiplicity `r_j>=1`.
No gap below `B` is assumed: lower zero lines may accumulate at the edge.

Let

\[
 K=\overline{\{(e^{i\gamma_1t},\ldots,e^{i\gamma_mt}):t\in\mathbb R\}}
 \subset\mathbb T^m                                  \tag{0.3}
\]

be the frequency hull.  Impose the antipodal phase condition

\[
 \boxed{(-1,\ldots,-1)\in K.}                        \tag{0.4}
\]

Then there is an unbounded strict-half-integer natural-cutoff sequence on
which

\[
 \boxed{d_0>0,\qquad d_1>0,\qquad w_{01}>0,}          \tag{0.5}
\]

but

\[
 \boxed{d_0d_1-w_{01}^2<0}                           \tag{0.6}
\]

eventually.  Thus the actual `{0,1}` principal Laplacian block is
indefinite under these conditional actual-zeta hypotheses.

Condition (0.4) is exact and checkable.  If

\[
 \Lambda_\gamma={n\in\mathbb Z^m:n_1\gamma_1+\cdots+n_m\gamma_m=0\},
                                                               \tag{0.7}
\]

then

\[
 \boxed{(-1,\ldots,-1)\in K
 \quad\Longleftrightarrow\quad
 \sum_{j=1}^m n_j\ \hbox{is even for every }n\in\Lambda_\gamma.} \tag{0.8}
\]

In particular, rational independence of the edge ordinates implies (0.4).
The one-orbit theorem is the case `m=1`.

This is a conditional obstruction for the actual zeta source.  The edge
hypothesis and the phase condition are not known to hold.  The argument
does not handle a finite phase-locked edge for which (0.4) fails, and it
does not handle a countably infinite attained edge.  It proves neither RH
nor its negation, no Lambda bound, and no equation (5.2) of
`DIRECT_RH_ATTACK.md`.  The formal project state remains `P0_INVALIDATED`.

## 1. Frozen dependencies and exact first-minor identity

The argument is bound to the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/UNIQUE_ATTAINED_EDGE_FIRST_MINOR_OBSTRUCTION.md` | `04c55777689638dff3fa7416bd4380cda0efbf02ea94d55431f4ff0c0787a28d` |
| `notes/ATTAINED_RIGHT_EDGE_VECTOR_SELECTION_THEOREM.md` | `6f67349e53e761744408bfa053874ce4f79b22aac578fa6fff48fa5915e65edf` |
| `notes/NONATTAINED_HIGH_EDGE_RECORD_FILTER_THEOREM.md` | `14be9eca50d64ff2c4c6710e1523238e1a3df21464f40b13b9ab86478b0e61ae` |
| `notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md` | `4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be` |
| `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` | `ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171` |

Put

\[
 a={2\pi\over L},\qquad q=a^2,                     \tag{1.1}
\]

and let `T_q` be the causal zero-data inverse of `D^2+q` on `[0,L]`.
Every operator expression below is evaluated at `L`.  Define

\[
 \Psi=-A_0,\qquad U=(I-qT_q)\Psi=-A_1,
 \qquad Y=(I-qT_q)^2\Psi.                           \tag{1.2}
\]

The locked exact degree and edge identities are

\[
 d_0={2p_0^2\over L}(\Psi+\rho_0),\qquad
 d_1={2p_1^2\over L}(Y+\rho_1),\qquad
 w_{01}=-{2p_0p_1\over L}U.                        \tag{1.3}
\]

Consequently,

\[
 \boxed{
 {L^2\over4p_0^2p_1^2}(d_0d_1-w_{01}^2)
 =(\Psi+\rho_0)(Y+\rho_1)-U^2,}                   \tag{1.4}
\]

and the zero-side cancellation is

\[
 \boxed{
 \Psi Y-U^2
 =q^2\{\Psi T_q^2\Psi-(T_q\Psi)^2\}.}             \tag{1.5}
\]

The fixed prolate coordinates satisfy

\[
 \sqrt Lp_0\longrightarrow C_*>0,
 \qquad \sqrt Lp_1\longrightarrow-2C_*.           \tag{1.6}
\]

## 2. The three leading edge functions

Write

\[
 b_j=\alpha_j^{-2}.                                 \tag{2.1}
\]

For `z=(z_1,...,z_m)` in `K`, define the real continuous functions

\[
 \begin{aligned}
 P(z)&=2\Re\sum_{j=1}^m r_jb_jz_j,\\
 V(z)&=2\Re\sum_{j=1}^m r_jb_j^2z_j,\\
 W(z)&=2\Re\sum_{j=1}^m r_jb_j^3z_j,
 \end{aligned}                                      \tag{2.2}
\]

and their Turan covariance

\[
 \boxed{{\cal C}(z)=P(z)W(z)-V(z)^2.}              \tag{2.3}
\]

Let `z(L)=(e^(i*gamma_1*L),...,e^(i*gamma_m*L))`.
The exact centered-zero expansions and inverse-square zero summability give

\[
 \boxed{
 \begin{aligned}
 e^{-BL}\Psi(L)&=P(z(L))+o(1),\\
 e^{-BL}(T_q\Psi)(L)&=V(z(L))+o(1),\\
 e^{-BL}(T_q^2\Psi)(L)&=W(z(L))+o(1).
 \end{aligned}}                                     \tag{2.4}
\]

Indeed, the forward exponential of orbit `j` gives the displayed term.
Every lower-line forward exponential contains
`exp(-(B-Re(zeta))*L)` and tends to zero.  The summable majorant from
`sum |zeta|^(-2)<infinity` permits dominated convergence even when lower
real parts approach `B`.  Backward exponentials and constant terms vanish
under the same majorant.  Finally,
`(zeta^2+q)^(-1)->zeta^(-2)`; the qualitative positive lower bound for zero
ordinates makes this convergence uniformly dominated.  Finiteness of the
edge sum then proves (2.4).

Since `q->0`, (1.2) and (2.4) also give

\[
 e^{-BL}U(L)=P(z(L))+o(1),\qquad
 e^{-BL}Y(L)=P(z(L))+o(1).                         \tag{2.5}
\]

In particular,

\[
 \boxed{
 e^{-2BL}\{\Psi T_q^2\Psi-(T_q\Psi)^2\}
 ={\cal C}(z(L))+o(1).}                            \tag{2.6}
\]

The equality of the leading functions for `Psi`, `U`, and `Y` is only the
rank-one leading cancellation.  The sign of (2.3) decides the first
nonzero determinant scale.

## 3. The covariance has strictly negative Bohr mean

Let `mu_K` be normalized Haar measure on `K`.  Distinct positive ordinates
give

\[
 \int_Kz_j\overline {z_k}\,d\mu_K=\delta_{jk},
 \qquad \int_Kz_jz_k\,d\mu_K=0.                   \tag{3.1}
\]

These are character orthogonality statements: for `j!=k` the relevant
frequencies are `gamma_j-gamma_k!=0`, and for every `j,k` the sum
`gamma_j+gamma_k` is positive.  Higher rational relations among three or
more ordinates do not enter this quadratic mean.

Using (3.1) in (2.2) gives

\[
 \begin{aligned}
 \int_KPW\,d\mu_K
 &=2\sum_{j=1}^m r_j^2|b_j|^2\Re(b_j^2),\\
 \int_KV^2\,d\mu_K
 &=2\sum_{j=1}^m r_j^2|b_j|^4.
 \end{aligned}                                      \tag{3.2}
\]

Therefore

\[
 \boxed{
 \int_K{\cal C}\,d\mu_K
 =-4\sum_{j=1}^m r_j^2|b_j|^2\{\Im b_j\}^2<0.}     \tag{3.3}
\]

Strictness follows orbit by orbit from

\[
 \Im b_j={-2B\gamma_j\over(B^2+\gamma_j^2)^2}\neq0. \tag{3.4}
\]

Thus the negative sign is not an assumption and does not require rational
independence.  It is the sum of the phase-independent negative self-pair
means; all cross-orbit terms have zero Bohr mean.  In particular, there is
a real `t_*` with

\[
 {\cal C}(z(t_*))<0.                                \tag{3.5}
\]

The finite exponential polynomial `P(z(t))` is real analytic and is not
identically zero, by uniqueness of its distinct nonzero Fourier
coefficients.  Since (3.5) persists on an open interval, `t_*` may be
chosen so that also

\[
 P(z(t_*))\neq0.                                    \tag{3.6}
\]

This finite-edge analytic nonflatness is one reason the present theorem is
not asserted for an infinite edge.

## 4. Exact antipodal criterion and sign synchronization

The annihilator description of the closed subgroup `K` is

\[
 K=\{z\in\mathbb T^m:z_1^{n_1}\cdots z_m^{n_m}=1
                   \text{ for every }n\in\Lambda_\gamma\}.       \tag{4.1}
\]

Substituting `epsilon=(-1,...,-1)` into (4.1) gives

\[
 \epsilon_1^{n_1}\cdots\epsilon_m^{n_m}
 =(-1)^{n_1+\cdots+n_m}.                            \tag{4.2}
\]

Equations (4.1)--(4.2) prove the equivalence (0.8).  If the ordinates are
rationally independent, `Lambda_gamma={0}`, so the criterion is automatic.
The criterion is weaker than rational independence because it permits
relations whose coefficient sum is even.

Multiplication by `epsilon` negates every linear edge function but leaves
the quadratic covariance fixed:

\[
 P(\epsilon z)=-P(z),\quad V(\epsilon z)=-V(z),\quad
 W(\epsilon z)=-W(z),\quad {\cal C}(\epsilon z)={\cal C}(z).       \tag{4.3}
\]

Starting from (3.5)--(3.6), use either `z(t_*)` or `epsilon*z(t_*)` to
obtain a phase `z_* in K` and constants `delta_P,delta_C>0` such that

\[
 \boxed{P(z_*)>2\delta_P,qquad
        {\cal C}(z_*)<-2\delta_C.}                 \tag{4.4}
\]

This is the synchronization step: negative Bohr mean alone supplies
(3.5), while the antipode supplies the favorable sign of `P` without
changing the covariance.

The one-parameter orbit is dense in `K`, and every open set in this compact
group is visited at unbounded times.  Hence there are `t_n->infinity` with

\[
 z(t_n)\longrightarrow z_*.                         \tag{4.5}
\]

Continuity and (4.4) give, eventually,

\[
 P(z(t_n))>\delta_P,qquad
 {\cal C}(z(t_n))<-\delta_C.                        \tag{4.6}
\]

## 5. Strict natural-grid transfer

For each `t_n`, choose the nearest strict half integer

\[
 \lambda_n={s_n\over2},\qquad s_n\geq5\text{ odd},
 \qquad L_n=2\log\lambda_n.                        \tag{5.1}
\]

The logarithmic grid estimate is

\[
 |L_n-t_n|=O(e^{-t_n/2}).                            \tag{5.2}
\]

The finite functions in (2.2)--(2.3) are uniformly continuous.  Therefore

\[
 z(L_n)\longrightarrow z_*                          \tag{5.3}
\]

in the only sense needed here, namely convergence of `P,V,W,C` to their
values at `z_*`.  Equations (2.4)--(2.6) and (4.4) now yield

\[
 \boxed{
 \begin{aligned}
 e^{-BL_n}\Psi(L_n)&\longrightarrow P(z_*)>0,\\
 e^{-BL_n}U(L_n)&\longrightarrow P(z_*)>0,\\
 e^{-BL_n}Y(L_n)&\longrightarrow P(z_*)>0,\\
 e^{-2BL_n}\{\Psi T_q^2\Psi-(T_q\Psi)^2\}
   &\longrightarrow {\cal C}(z_*)<0.
 \end{aligned}}                                     \tag{5.4}
\]

Equivalently, the normalized covariance has the strict limit

\[
 \boxed{
 {\Psi T_q^2\Psi-(T_q\Psi)^2\over\Psi^2}
 \longrightarrow{{\cal C}(z_*)\over P(z_*)^2}<0.}  \tag{5.5}
\]

The exponentially fine grid displacement is also inside the pinned-PNT
transfer tolerance for the exact source formulas.

## 6. The full residual is below the Turan scale

Fix any

\[
 0<b_0<B.                                           \tag{6.1}
\]

The checkpoint-0.84 high/low finite-anchor split is uniform over all zeros
with `b_0<=Re(zeta)<=B`; it therefore includes every finite edge orbit and
all lower lines accumulating at `B`.  With the exact errors in (1.3), it
gives

\[
 \rho_0=O_A(Le^{-AL/2})                              \tag{6.2}
\]

for arbitrary fixed `A`, and

\[
 \rho_1
 =O_{b_0}(L^{-1}e^{b_0L})
  +O_{b_0}(\sqrt L\,e^{-dL^2})
  +O_A(Le^{-AL/2}).                                 \tag{6.3}
\]

The first line of (5.4) gives `Psi` comparable to `e^(B*L_n)`, and the
third does the same for `Y`.  Since
`q^2=(2*pi)^4*L^(-4)`, choosing `A` large in (6.2)--(6.3) gives

\[
 \boxed{
 {\Psi\rho_1+Y\rho_0+\rho_0\rho_1
  \over q^2\Psi^2}
 =O_{b_0}\{L_n^3e^{-(B-b_0)L_n}\}+o(1)
 \longrightarrow0.}                               \tag{6.4}
\]

This is the same fourth-order residual gain used by the unique-orbit
obstruction.  A cancellation-free history estimate only at scale
`e^(B*L)/L` would not suffice after the rank-one determinant cancellation.

## 7. Negative actual first minor with positive scalar data

Expanding (1.4) and using (1.5) gives the exact identity

\[
 \begin{aligned}
 &(\Psi+\rho_0)(Y+\rho_1)-U^2\\
 &\quad=q^2\{\Psi T_q^2\Psi-(T_q\Psi)^2\}
       +\Psi\rho_1+Y\rho_0+\rho_0\rho_1.
 \end{aligned}                                      \tag{7.1}
\]

Divide by `q^2*Psi^2` and use (5.5), (6.4):

\[
 \boxed{
 {(\Psi+\rho_0)(Y+\rho_1)-U^2\over q^2\Psi^2}
 \longrightarrow{{\cal C}(z_*)\over P(z_*)^2}<0.} \tag{7.2}
\]

The prefactor in (1.4) is positive, so (7.2) proves (0.6).  Equations
(5.4) and (6.2)--(6.3) give

\[
 \Psi+\rho_0>0,\qquad Y+\rho_1>0                   \tag{7.3}
\]

eventually, hence `d_0,d_1>0`.  Finally, (1.3), (1.6), and the positive
limit for `U` in (5.4) give `w_(01)>0`.  The leading ratios still obey

\[
 {d_1\over d_0}\longrightarrow4,
 \qquad {w_{01}\over d_0}\longrightarrow2,         \tag{7.4}
\]

but their leading determinant cancels and the strictly negative finite-edge
Turan covariance decides the first minor.

## 8. Exact surviving cases

The exact weakest leading phase requirement exposed by the proof is the
existence of some `z in K` with

\[
 P(z)>0,\qquad {\cal C}(z)<0.                       \tag{8.1}
\]

Condition (0.4) is a transparent sufficient condition for (8.1), not a
necessary one.  Formula (3.3) alone does not choose the sign of `P` at a
negative-covariance phase.  A finite phase-locked edge violating the parity
criterion may still satisfy (8.1), but the present argument does not decide
it.

For a countably infinite attained edge, the inverse-square coefficients do
define uniformly convergent leading functions, and the formal mean in
(3.3) remains suggestive.  The finite analytic nonflatness step and the
uniform phase-hull sign selection require a separate proof, so no infinite-
edge conclusion is recorded here.

Thus this note extends the actual-source obstruction from one edge orbit to
every finite antipodally recurrent attained edge.  It does not settle the
remaining phase-locked finite case, the infinite attained case, the
nonattained edge, higher Schur pivots, connectivity, or routing.
