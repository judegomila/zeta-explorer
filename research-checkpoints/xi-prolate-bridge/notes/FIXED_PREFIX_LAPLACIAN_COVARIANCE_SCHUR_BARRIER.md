# Fixed-prefix Laplacian covariance and Schur barrier

## 0. Exact outcome and claim boundary

The positive-degree prefixes selected at checkpoint 0.84 do not yet sign a
two-by-two Laplacian minor.  This note gives the exact next reduction.  After
vertex `0` is eliminated, every fixed anchored prefix is a diagonal
congruence of

\[
 Q\,{\boldsymbol\Sigma\over\Psi(L)}Q
 +\operatorname {diag}(\rho_i)
 +{\rho_0\over\Psi(L)\{\Psi(L)+\rho_0\}}UU^T,       \tag{0.1}
\]

where `Q=diag(q_i)`, `q_i=(2*pi*i/L)^2`, and

\[
 \boxed{
 \boldsymbol\Sigma_{ij}
 =\Psi(L)(T_{q_i}T_{q_j}\Psi)(L)
  -(T_{q_i}\Psi)(L)(T_{q_j}\Psi)(L).}              \tag{0.2}
\]

Thus the first new matrix object is a signed resolvent covariance.  On the
nonattained-edge record extraction, all terms in (0.1) outside the covariance
are `o_K(L^(-4)*Psi(L))` entrywise for a fixed prefix.  The admitted results
do not sign (0.2).

For the first minor, with `q=(2*pi/L)^2`, the exact main Turan expression is

\[
 \boxed{
 \Psi(I-qT_q)^2\Psi-{(I-qT_q)\Psi\}^2
 =q^2\{\Psi T_q^2\Psi-(T_q\Psi)^2\}.}               \tag{0.3}
\]

Here and below every operator expression is evaluated at `L`; products
outside an operator are products of endpoint scalars.

Under RH, (0.2) is a positive-weight, real-node Stieltjes/Hankel covariance
and is positive semidefinite.  That is an RH-conditional observation, not an
input available in an RH-false branch.  It supplies neither the strict frame
margin nor the residual domination needed for the actual finite minor.
Conversely, the pair-pair sector of one off-axis conjugate zero pair is a
phase-independent negative-semidefinite rank-one matrix.  This is a local
centered-zero obstruction.  It does not assert that one pair dominates the
actual zeta zero sum, and it is not an actual-zeta counterexample.

No Laplacian positivity, graph connectivity, routing contraction, finite
hyperbolicity, equation (5.2) of `DIRECT_RH_ATTACK.md`, Lambda bound, or RH
statement is proved.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies and notation

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md` | `18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b` |
| `notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md` | `4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be` |
| `notes/NONATTAINED_HIGH_EDGE_RECORD_FILTER_THEOREM.md` | `14be9eca50d64ff2c4c6710e1523238e1a3df21464f40b13b9ab86478b0e61ae` |
| `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` | `ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171` |
| `notes/PRIME_SIDE_SIGNED_RIESZ_HISTORY_BARRIER.md` | `ca6fd1e6d34b7872fc55f20e6005cdec0c9c7f81a4ad3ac50187a8b30db5521c` |

Retain the natural schedule, the fixed-mode coordinates `p_i`, and

\[
 P=\Psi(L),\qquad q_i=\left({2\pi i\over L}\right)^2. \tag{1.1}
\]

Let `T_i=T_(q_i)` be the causal zero-data inverse from the record-filter
note.  For one representative from every centered pair, put

\[
 c_\alpha(L)={2\{\cosh(\alpha L)-1\}\over\alpha^2},
 \qquad m_i(\alpha)={1\over\alpha^2+q_i}.           \tag{1.2}
\]

Conjugates are paired.  For every fixed prefix and all sufficiently large
`L`, the qualitative lower ordinate bound keeps every denominator in (1.2)
away from zero.  The centered-zero expansion and the resonant endpoint
identities give

\[
 \begin{aligned}
 P&=\sum_\alpha c_\alpha,\\
 t_i:=(T_i\Psi)(L)&=\sum_\alpha c_\alpha m_i(\alpha),\\
 K_{ij}:=(T_iT_j\Psi)(L)
 &=\boxed{\sum_\alpha c_\alpha m_i(\alpha)m_j(\alpha)}.
 \end{aligned}                                     \tag{1.3}
\]

These series are absolutely convergent after conjugate pairing.  The
coefficients `c_alpha` are neither nonnegative nor supported on real nodes
off RH.

## 2. Exact filtered degrees and collective residuals

Write

\[
 H=\sqrt L\,J_L,
 \qquad
 h_i=A_i-g=q_it_i,                                  \tag{2.1}
\]

where `g=-P`.  The exact one-zero identity in the fourth-moment note sums to

\[
 \boxed{
 {\cal M}_i=-p_iq_i(2T_i-q_iT_i^2)\Psi+{\cal C}_i,} \tag{2.2}
\]

with the complete finite-anchor residual

\[
 {\cal C}_i
 =\sum_\alpha
 c_\alpha\,{q_iH_N(-i\alpha L/(2\pi))
                 \over\alpha^2+q_i}.               \tag{2.3}
\]

Define

\[
 \rho_0={H\over p_0},
 \qquad
 \rho_i={H+{\cal C}_i\over p_i}\quad(i\geq1),      \tag{2.4}
\]

and

\[
 U_i=(I-q_iT_i)\Psi=P-q_it_i,
 \qquad
 Y_i=(I-q_iT_i)^2\Psi=P-2q_it_i+q_i^2K_{ii}.       \tag{2.5}
\]

The exact degree identities are therefore

\[
 \boxed{
 d_0={2p_0^2\over L}(P+\rho_0),\qquad
 d_i={2p_i^2\over L}(Y_i+\rho_i).}                 \tag{2.6}
\]

In particular, positive degrees sign only the diagonal scalars in (2.6).
They do not compare `U_i` with those diagonal terms.

## 3. Exact fixed-prefix block and central Schur complement

For distinct indices, retain

\[
 D_{ij}={q_iA_i-q_jA_j\over q_i-q_j},
 \qquad
 w_{ij}={2\over L}p_ip_jD_{ij}.                     \tag{3.1}
\]

Let `J` be a fixed subset of the positive vertices and `I={0} union J`.
Factoring the anchor coordinates gives the exact principal block

\[
 L_w[I,I]={2\over L}\operatorname {diag}(p_I)
             {\cal B}_I\operatorname {diag}(p_I),  \tag{3.2}
\]

where

\[
 \begin{aligned}
 ({\cal B}_I)_{00}&=P+\rho_0,\\
 ({\cal B}_I)_{0i}&=U_i,\\
 ({\cal B}_I)_{ii}&=Y_i+\rho_i,\\
 ({\cal B}_I)_{ij}&=-D_{ij}\quad(i\ne j,\ i,j\in J).
 \end{aligned}                                     \tag{3.3}
\]

Indeed, `D_(0i)=A_i=-U_i`.  For `i,j>=1`, the resolvent identity gives

\[
 -D_{ij}-{U_iU_j\over P}
 =q_iq_j\left(K_{ij}-{t_it_j\over P}\right).       \tag{3.4}
\]

The same formula on the diagonal follows from (2.5).  Define the signed
covariance matrix

\[
 \boxed{\boldsymbol\Sigma_{ij}=PK_{ij}-t_it_j.}     \tag{3.5}
\]

If `P+rho_0>0`, exact elimination of vertex `0` in the core (3.3) yields

\[
 \boxed{
 {\cal S}_J
 =Q_J{\boldsymbol\Sigma_J\over P}Q_J
  +\operatorname {diag}(\rho_i)_{i\in J}
  +{\rho_0\over P(P+\rho_0)}U_JU_J^T.}             \tag{3.6}
\]

The Schur complement of the actual block (3.2) is

\[
 {2\over L}\operatorname {diag}(p_J)
 {\cal S}_J\operatorname {diag}(p_J).              \tag{3.7}
\]

Thus the anchored prefix is positive definite exactly when `P+rho_0>0`
and (3.6) is positive definite.  This is the complete fixed-prefix Schur
gate; it is not implied by the signs in (2.6).

## 4. Residual ledger on the nonattained record extraction

Fix `K`, choose the record exponent `eta` as in the nonattained-edge note,
and then choose `0<b_0<eta`.  On its strict natural-grid record sequence,

\[
 P=R_ne^{\eta L}\{1+o(1)\},\qquad R_n\longrightarrow\infty. \tag{4.1}
\]

The all-order estimate and fixed-mode asymptotics give, uniformly for the
fixed prefix,

\[
 {H\over p_i}=O_A(Le^{-AL/2})                       \tag{4.2}
\]

for every fixed `A`.  Split (2.3) at `b_0`.  The uniform actual-zero
finite-anchor estimate gives

\[
 {\cal C}_{i,\geq b_0}=O_{K,b_0}(e^{-dL^2}).        \tag{4.3}
\]

For the low part, (2.2), the improved history bound, and
`q_i R_(q_i) Psi_< =O_(K,b_0)(L^(-1)e^(b_0L))` give

\[
 {\cal C}_{i,<}=O_{K,b_0}(L^{-3/2}e^{b_0L}).        \tag{4.4}
\]

Since `|p_i|` is comparable to `L^(-1/2)` for fixed `i`, (4.1)--(4.4)
imply, for every fixed power `M`,

\[
 \rho_0=o_K(L^{-M}P),\qquad
 \rho_i=o_K(L^{-M}P).                              \tag{4.5}
\]

The exact zero-edge envelope also gives `U_i=O_K(e^(BL))`.  Choosing `A`
in (4.2) after `K,M` makes the last rank-one term of (3.6)
`o_K(L^(-M)P)` entrywise.  In particular,

\[
 \boxed{
 {\cal S}_{\{1,\ldots,K\}}
 =Q{\boldsymbol\Sigma\over P}Q
  +o_K(L^{-4}P)\quad\hbox{entrywise}.}              \tag{4.6}
\]

Equation (4.6) is only a reduction.  It gives no lower bound for the least
eigenvalue of the signed covariance.

## 5. The first minor and the weakest missing scalar lemma

Put `q=q_1`, `T=T_q`, `U=U_1`, `Y=Y_1`, and `rho_1` as in (2.4).  From
(3.2)--(3.3),

\[
 \boxed{
 \det L_w[\{0,1\}]
 ={4p_0^2p_1^2\over L^2}
 \left[ (P+\rho_0)(Y+\rho_1)-U^2\right].}          \tag{5.1}
\]

The filter algebra cancels its rank-one leading term exactly:

\[
 \begin{aligned}
 PY-U^2
 &=P\{P-2qT\Psi+q^2T^2\Psi\}
   -\{P-qT\Psi\}^2\\
 &=\boxed{q^2\{P(T^2\Psi)-(T\Psi)^2\}}.           \tag{5.2}
 \end{aligned}
\]

Consequently the exact normalized determinant is

\[
 q^2\{P(T^2\Psi)-(T\Psi)^2\}
 +P\rho_1+Y\rho_0+\rho_0\rho_1.                   \tag{5.3}
\]

On the record sequence, the last three terms are `o(q^2P^2)`: (4.5)
handles `P*rho_1` and `rho_0*rho_1`, while the zero-edge bound for `Y`
and the all-order choice in (4.2) handle `Y*rho_0`.

The exact weakest new scalar inequality is therefore

\[
 \boxed{
 P(T^2\Psi)-(T\Psi)^2
 >-{P\rho_1+Y\rho_0+\rho_0\rho_1\over q^2}.}       \tag{5.4}
\]

A clean sufficient asymptotic lemma would be the same-sequence margin

\[
 \liminf_n{P(T^2\Psi)-(T\Psi)^2\over P^2}>0.       \tag{5.5}
\]

Neither endpoint record positivity nor positivity of `Y+rho_1` proves
(5.4).  Even a bare nonnegative main covariance, with no quantitative
margin, need not dominate the finite residuals.

## 6. Stieltjes/Hankel meaning and the RH boundary

Equations (1.3) and (3.5) give the exact double-sum factorization

\[
 \boxed{
 \boldsymbol\Sigma_{ij}
 ={1\over2}\sum_{\alpha,\beta}c_\alpha c_\beta
 \{m_i(\alpha)-m_i(\beta)\}
 \{m_j(\alpha)-m_j(\beta)\}.}                      \tag{6.1}
\]

Assume RH only for the next observation.  Then `alpha=i*gamma`, and

\[
 c_\gamma={2\{1-\cos(\gamma L)\}\over\gamma^2}\geq0,
 \qquad
 m_i(\gamma)={1\over q_i-\gamma^2}\in\mathbb R.   \tag{6.2}
\]

Thus `boldsymbol Sigma` is `P` times the covariance matrix of the real
features `m_i` under the positive weights `c_gamma`; it is positive
semidefinite by Cauchy--Schwarz.  For one feature, strictness requires two
active distinct ordinates.  For a `K`-feature block, strictness requires
that no nonzero linear combination of the features be constant on the
active support.  No admitted result gives a uniform lower frame bound for
this feature family along the selected schedule.

For large fixed-prefix schedules `q_i<gamma_0^2`; replacing `m_i` by
`-m_i=1/(gamma^2-q_i)` puts the nodes on the positive real axis without
changing a covariance sign.  This is therefore a Stieltjes/Hankel variance
conditional on real centered zeros.  It is not an independently admitted
Laguerre--Polya criterion that can be used to prove those zeros real.  In
this setting, inserting Laguerre--Polya membership or the positive measure
(6.2) into an RH-false branch would assume the missing zero location.  The
unconditional Hadamard product gives conjugate symmetry and summability,
but it signs neither the weights nor the nodes in (6.1).

## 7. One off-axis conjugate pair has the opposite sign

Let `alpha=beta+i*gamma` with `beta*gamma!=0`, and consider the pair
`alpha,conjugate(alpha)`.  Write

\[
 c=c_\alpha,\qquad m_i=m_i(\alpha).
\]

The pair-pair sector of (6.1) is exactly

\[
 \boxed{
 \boldsymbol\Sigma^{\rm pair}_{ij}
 =|c|^2(m_i-\overline {m_i})(m_j-\overline {m_j})
 =-4|c|^2\Im(m_i)\Im(m_j).}                        \tag{7.1}
\]

It is negative semidefinite of rank one whenever the vector of imaginary
parts is nonzero.  In particular,

\[
 \boldsymbol\Sigma^{\rm pair}_{11}
 =-4|c|^2\left\{\Im{1\over\alpha^2+q}\right\}^2<0. \tag{7.2}
\]

The sign in (7.1) is independent of the oscillatory phase of `c`.  If one
off-axis pair were to dominate all the actual moments on a favorable phase
sequence, then `P` and `Y` could both be positive while (5.2) is negative.
The current record theorem does not exclude such signed moment behavior.

Equations (7.1)--(7.2) are deliberately local and conditional.  They do not
claim that an off-axis pair exists, that it is isolated or dominant in the
actual zeta zero set, or that the full actual covariance has negative sign.
They show that centered-zero symmetry, inverse-square summability, and the
record-selected positive degrees cannot by themselves supply (5.4).

## 8. Higher fixed-prefix Hankel hierarchy

For large `L` and fixed indices, `|q_i/alpha^2|<1`.  Define the signed
moments

\[
 \mu_r=\sum_\alpha c_\alpha\alpha^{-2r},
 \qquad \mu_0=P,                                   \tag{8.1}
\]

and the covariance Hankel array

\[
 {\cal H}_{ab}=P\mu_{a+b+2}-\mu_{a+1}\mu_{b+1}
 \qquad(a,b\geq0).                                 \tag{8.2}
\]

The uniformly convergent resolvent series gives

\[
 \boxed{
 \boldsymbol\Sigma_{ij}
 =\sum_{a,b\geq0}(-q_i)^a(-q_j)^b{\cal H}_{ab}.}   \tag{8.3}
\]

Hence every fixed-prefix Schur pivot is a signed Hankel-moment condition.
If the first nonvanishing Hankel minors have quantitative margins, the
positive square of the `q_i` Vandermonde transfers their signs to the
successive covariance pivots.  Without those margins, the common
`q_i -> 0` limit is rank one and no sign follows from the entrywise leading
term.  No admitted actual-zero or prime-side estimate signs this Hankel
hierarchy on the arbitrary-edge record sequence.

The weakest remaining matrix task is therefore precise: prove that the
`Q*boldsymbol Sigma*Q/P` term dominates the explicit residual in (3.6) at
its actual scale on the same record-selected sequence.  A positive
least-eigenvalue margin for (0.2) is a convenient stronger sufficient
condition.  It is neither necessary nor expected uniformly when dominant
ordinates can escape.  Separate positive-degree sequences or an unsigned
fourth-moment majorant do not meet the exact gate.
