# Effective mixed signed-quotient attack

## 0. Claim boundary

This note determines what the effective whole-target mixed-prefix theorem
does to the **complete** shifted finite Weil form.  There are three exact
conclusions.

1. After the physical Gram is retained, the whole-target source quotient is
   unitarily equivalent to the complete physical shifted operator.  Its
   spectrum, determinant, and inertia are therefore unchanged.  The mixed
   coframe conditions the congruence; it cannot create sign.
2. The concentration-defect metric of the ordinary prefix has a uniformly
   present low `c_2` direction.  Its best comparison with the source `L2`
   metric is at most `d_2(lambda)`, regardless of how large the effective
   source-`BV` terminal label becomes.  Thus the existing scalar conversion
   from a defect-relative estimate to a physical gap loses an exponentially
   small fixed-label factor.
3. At each fixed locked `lambda` and each finite log-Fourier target, every
   sufficiently long **high-only** all-even segment is onto.  On a
   sufficiently far high tail its defect Gram is comparable with its `L2`
   Gram.  This is an exact repair of the low-mode metric degeneration, but
   it gives no useful or uniform terminal-label bound and no signed estimate.

An exact rational bridge countermodel shows that a unit defect-relative
source floor and a fixed `L2` coframe floor can coexist while the ordinary
physical floor tends to zero.  The note proves no signed Weil lower bound,
no residual--gap limit in equation (5.2) of `DIRECT_RH_ATTACK.md`, and no
locally uniform determinant convergence.  The repository state remains
`P0_INVALIDATED`.

All source functions use `[-lambda,lambda]`, Lebesgue measure, and zero
extension.  The physical logarithmic interval, Fourier sign, inversion
reflection, prolate normalization, and prime-power endpoint remain those of
the source lock.  In particular, the complete physical matrix below is

\[
 Q_{\lambda,N}
 =Q_{\lambda,N}^{\rm pole}
  +Q_{\lambda,N}^{\rm arch}
  -Q_{\lambda,N}^{\rm prime},                         \tag{0.1}
\]

with every prime power `n<=lambda^2`; the minus sign in the prime block is
not absorbed into notation.

## 1. Whole-target capture and the exact normalized quotient

Let `X_N` be the full finite physical target and let

\[
 B_N(\tau)=Q_{\lambda,N}-\tau I_{X_N}                 \tag{1.1}
\]

be the complete shifted Hermitian operator.  Let `C` be any finite mixed
source synthesis with exact source Gram

\[
 D=C^*C\succ0,
\]

and let `W:X_{\rm coef}->X_N` be its physical synthesis.  Assume only that
`W` is onto, as supplied by the effective mixed-prefix stopping theorem.
Put

\[
 A=WD^{-1/2},\qquad
 P_0=P_{(\ker A)^\perp},\qquad
 A_0=A|_{(\ker A)^\perp},\qquad
 G=A_0^*A_0.                                           \tag{1.2}
\]

The spaces `(ker A)^perp` and `X_N` have the same dimension, `A_0` is
bijective, and `G` is positive definite.

### Theorem 1.1 (exact quotient spectral identity)

The map

\[
 U=A_0G^{-1/2}:(\ker A)^\perp\longrightarrow X_N       \tag{1.3}
\]

is unitary, and

\[
 \boxed{
 G^{-1/2}A_0^*B_N(\tau)A_0G^{-1/2}
 =U^*B_N(\tau)U.}                                     \tag{1.4}
\]

Consequently, with determinants taken in orthonormal bases,

\[
 \boxed{
 {\det\!\left(A_0^*(B_N(\tau)-zI)A_0\right)\over\det G}
 =\det(B_N(\tau)-zI)}                                 \tag{1.5}
\]

for every complex `z`, and

\[
 \boxed{
 \operatorname {spec}\!\left(
 G^{-1/2}A_0^*B_N(\tau)A_0G^{-1/2}\right)
 =\operatorname {spec}(B_N(\tau)),}                  \tag{1.6}
\]

including multiplicities.  In particular, the two operators have exactly
the same inertia.

**Proof.**  Equation (1.2) gives `U^*U=I`.  Since the domain and codomain
have the same finite dimension, `U` is unitary.  Equation (1.4) follows by
substitution.  Also

\[
 \det(A_0^*(B_N(\tau)-zI)A_0)
 =|\det A_0|^2\det(B_N(\tau)-zI)
 =\det(G)\det(B_N(\tau)-zI),
\]

which proves (1.5).  Equation (1.6) and the inertia statement follow from
unitary equivalence.  `square`

Thus whole-target capture eliminates the physical complement **inside**
`X_N`, but only by putting every physical signed direction into the source
quotient.  It does not eliminate a negative direction of `B_N(tau)`.

### 1.1 Physical floors and source floors are different pencils

The exact physical statement

\[
 B_N(\tau)\succeq\delta I                              \tag{1.7}
\]

is equivalent to

\[
 A_0^*Q_{\lambda,N}A_0-(\tau+\delta)G\succeq0.         \tag{1.8}
\]

In original source coordinates this is

\[
 \boxed{
 P_0D^{-1/2}
 \left[W^*Q_{\lambda,N}W-(\tau+\delta)W^*W\right]
 D^{-1/2}P_0\succeq0.}                                \tag{1.9}
\]

By contrast, a quotient lower comparison against the source `L2` metric is

\[
 \boxed{
 P_0D^{-1/2}
 \left[W^*Q_{\lambda,N}W-\tau W^*W-\mu D\right]
 D^{-1/2}P_0\succeq0.}                                \tag{1.10}
\]

The physical scalar shift is therefore `-tau W^*W`; the source comparison
is the separate term `-mu D`.  Replacing either one by the other changes
the problem.  If `W` is redundant, (1.9)--(1.10) must remain compressed by
`P_0`; testing the whole raw coefficient space would introduce spurious
source-kernel directions.

For the effective mixed prefix, write

\[
 F_D=WD^{-1}W^*=AA^*.
\]

The proved lower frame floor and the locked arithmetic norm give

\[
 \gamma_\lambda I\preceq F_D\preceq\Gamma_\lambda I,
 \qquad
 \gamma_\lambda={9\over128\lambda^4},\qquad
 \Gamma_\lambda={\lambda^2\over2}.                   \tag{1.11}
\]

These constants only condition the congruence.  For example,

\[
 A_0^*B_N(\tau)A_0\succeq\mu I
 \quad\Longrightarrow\quad
 B_N(\tau)\succeq\mu F_D^{-1}
 \succeq {2\mu\over\lambda^2}I,                     \tag{1.12}
\]

where the hypothesis is precisely the still-missing signed estimate.
Conversely, (1.7) implies

\[
 A_0^*B_N(\tau)A_0\succeq\delta G
 \succeq\delta\gamma_\lambda I.                     \tag{1.13}
\]

The condition-number loss allowed by the current frame bounds is

\[
 {\Gamma_\lambda\over\gamma_\lambda}
 ={64\over9}\lambda^6.                               \tag{1.14}
\]

No sign follows from (1.11).

## 2. The complete block form and the bridge terms

Use the separated mixed inventory

\[
 C_{\rm sep}=(C_0,b,C_-)
\]

and group it as `U_0=ran C_0` and `U_2=ran(b,C_-)`.  With

\[
 u_j={I_{4j}\over I_0},\qquad
 \beta_s={I_2\over I_0},\qquad
 a_j={I_{4j+2}\over I_2},                             \tag{2.1}
\]

the exact source Gram is

\[
 D_{\rm sep}=
 \begin{bmatrix}
 I+uu^*&\beta_su&0\\
 \beta_su^*&1+\beta_s^2&a^*\\
 0&a&I+aa^*
 \end{bmatrix}.                                       \tag{2.2}
\]

Let

\[
 R=W^*W,
 \qquad
 {\cal Q}=W^*Q_{\lambda,N}W
 ={\cal Q}^{\rm pole}+{\cal Q}^{\rm arch}
  -{\cal Q}^{\rm prime}.                             \tag{2.3}
\]

Every block in (2.3) is assembled before any source comparison.  In the
two-family grouping, the cross block of (1.10) is exactly

\[
 \boxed{
 {\cal L}_{02}(\mu)
 ={\cal Q}_{02}-\tau R_{02}-\mu D_{02},
 \qquad D_{02}=\begin{bmatrix}\beta_su&0\end{bmatrix}.} \tag{2.4}
\]

Thus the pole, archimedean, minus-prime, physical-Gram, and bridge-metric
cross terms all remain.  For the physical floor (1.9), the corresponding
cross block is

\[
 {\cal Q}_{02}-(\tau+\delta)R_{02};                   \tag{2.5}
\]

there is no additional `D_02` term because `delta` is a physical shift.
If a Schur complement is used, it must be applied to these complete blocks
after quotient compression.  In general `P_0` mixes the two source groups,
so a raw blockwise Schur test need not be equivalent to the quotient.

Equations (1.4) and (2.3) also explain why separate block norms cannot prove
the desired cancellation.  Whitening and adding the three signed physical
blocks first gives the exact physical operator.  Taking norms of the pole,
archimedean, and prime pullbacks separately discards their signed
cancellation and then conditions the resulting overestimate by (1.14).

## 3. The ordinary prefix defect metric has a permanent low direction

Let

\[
 C_M=(c_2,c_4,\ldots,c_{2M}),\qquad
 c_n=h_n-{I_n\over I_0}h_0,
 \qquad
 v_M=(I_2/I_0,\ldots,I_{2M}/I_0)^T.                   \tag{3.1}
\]

Its source `L2` Gram and positive concentration-defect Gram are

\[
 D_M=I+v_Mv_M^*,                                      \tag{3.2}
\]

\[
 H_M=\operatorname {diag}(d_2,d_4,\ldots,d_{2M})
       +d_0v_Mv_M^*,
 \qquad d_n=1-\chi_{n,\lambda}^2.                    \tag{3.3}
\]

The concentration eigenvalues are ordered, hence `d_0<=d_2<=...<1`.
It follows immediately that

\[
 d_0D_M\preceq H_M\preceq D_M.                       \tag{3.4}
\]

Define the sharp generalized lower comparison

\[
 \alpha_M=\lambda_{\min}(D_M^{-1/2}H_MD_M^{-1/2}).    \tag{3.5}
\]

The coordinate supported on `c_2` gives the exact upper test

\[
 \boxed{
 d_0\leq\alpha_M
 \leq {d_2+d_0|I_2/I_0|^2\over1+|I_2/I_0|^2}
 \leq d_2}                                            \tag{3.6}
\]

for every `M>=1`.  In particular, increasing the terminal label does not
remove the low-defect direction.

For each fixed even label, the pinned source asymptotic is

\[
 d_n(\lambda)
 \sim A_n\lambda^{2n+1}e^{-4\pi\lambda^2},
 \qquad
 A_n=4\sqrt2\,\pi{(16\pi)^n\over n!}.                 \tag{3.7}
\]

Thus both endpoints in the safe scalar comparison (3.6) are exponentially
small on an unbounded `lambda` schedule.  A very large source-`BV` terminal
label does not change this fact because the original prefix still contains
`c_2`.

To see the precise loss, put

\[
 A_H=WH_M^{-1/2},\qquad F_H=A_HA_H^*=WH_M^{-1}W^*.
\]

Equations (3.4)--(3.6) imply

\[
 F_D\preceq F_H\preceq\alpha_M^{-1}F_D,
 \qquad
 \gamma_\lambda I\preceq F_H
 \preceq {\Gamma_\lambda\over\alpha_M}I.             \tag{3.8}
\]

Let `A_(H,0)` be the restriction of `A_H` to `(ker A_H)^perp`.  A
hypothetical defect-normalized quotient floor

\[
 A_{H,0}^*B_N(\tau)A_{H,0}\succeq\mu I
\]

would give only the scalar consequence

\[
 B_N(\tau)\succeq\mu F_H^{-1}
 \succeq {\alpha_M\over\Gamma_\lambda}\mu I
 ={2\alpha_M\mu\over\lambda^2}I.                    \tag{3.9}
\]

Likewise, an `L2` estimate

\[
 E^*E\preceq\varepsilon D_M
\]

becomes only

\[
 E^*E\preceq {\varepsilon\over\alpha_M}H_M.           \tag{3.10}
\]

The effective trace stop at a polynomial `L2` scale and the existence of a
possibly enormous terminal label do not control the factor
`1/alpha_M`.  This does not make `H_M` logically useless: at every fixed
parameter it is positive and an exact positive comparison still proves a
finite statement.  It makes the present scalar metric conversion
asymptotically scale-vacuous for the required common-schedule
residual--gap estimate.  It is a certificate-level obstruction, not a
proof that every optimized defect-relative construction must fail.

## 4. A high-tail capture theorem

The low-direction obstruction in Section 3 is caused by retaining the low
prefix.  It is not a fixed-parameter failure of high modes to span a finite
physical target.

Let

\[
 X_N=\operatorname {span}\{\phi_k:-N\leq k\leq N\},
 \qquad
 \phi_k(x)={(-1)^k\over\sqrt L}e^{i\omega_kx},
 \quad
 \omega_k={2\pi k\over L},\quad L=2\log\lambda.       \tag{4.1}
\]

Identify the direct sum of the two inversion sectors with `X_N`, and let
`T_N` be the locked arithmetic map followed by projection onto `X_N`, with
the even zero-integral source convention retained.  For a finite cutoff
`R`, define

\[
 {\cal F}_{>R}
 =\overline{\operatorname {span}}
 \{c_n:n>R,\ n\ {m even}\}.                         \tag{4.2}
\]

### Theorem 4.1 (every fixed high tail captures the full target)

For every locked half-integer `lambda=p/2`, `p>=5` odd, every finite `N`,
and every finite `R`,

\[
 \boxed{T_N{\cal F}_{>R}=X_N.}                        \tag{4.3}
\]

Consequently there is a finite `M>R` such that

\[
 \operatorname {span}\{T_Nc_n:R<n\leq M, n\ {m even}\}
 =X_N.                                                 \tag{4.4}
\]

**Proof.**  Suppose a vector `x in X_N` is orthogonal to the range in
(4.3), and let `z=T_N^*x` in the even source space.  Write

\[
 z_n=\langle h_n,z\rangle.
\]

Orthogonality to every tail correction gives

\[
 z_n={I_n\over I_0}z_0
 \qquad(n>R,\ n\ {m even}).                         \tag{4.5}
\]

The even prolate modes form an orthonormal basis of the even source space,
and the constant function has expansion coefficients `I_n`.  Hence

\[
 z-{z_0\over I_0}\,1                                 \tag{4.6}
\]

has only finitely many prolate coefficients.  It therefore has a real-
analytic representative across every interior arithmetic breakpoint.

On the positive source interval, before the harmless even reflection and
zero-integral projection, the exact adjoint row is

\[
 K_k(y)={(-1)^k\over\sqrt L}
 y^{-1/2-i\omega_k}
 \sum_{a\leq\lambda y}a^{-1/2+i\omega_k}.             \tag{4.7}
\]

At an interior breakpoint `y_m=m/lambda`, `2<=m<lambda^2`, its
right-minus-left derivative jumps are

\[
 [K_k^{(r)}]_{y_m}
 =\sqrt{\lambda\over L}{(-\lambda)^r\over m^{r+1}}
 \left({1\over2}+i\omega_k\right)_r.                 \tag{4.8}
\]

Passing to the even source convention only reflects the positive-side row
and may multiply every row by the same nonzero normalization; it does not
change the jump rank.  Projecting to the zero-integral source space
subtracts a constant, which changes none of the jumps.  Thus analyticity of
(4.6) forces the jumps of the row combination representing `z` to vanish
for `r=0,1,...,2N`.

The polynomials `(s)_r`, `r=0,...,2N`, are monic of degrees
`0,...,2N`.  Evaluating them at the `2N+1` distinct points

\[
 s_k={1\over2}+i\omega_k,\qquad -N\leq k\leq N,
\]

gives a matrix with determinant

\[
 \prod_{-N\leq i<j\leq N}(s_j-s_i)\ne0.              \tag{4.9}
\]

All Fourier coefficients of `x` therefore vanish, so `x=0`.  The range in
(4.3) has zero orthogonal complement.  Since its codomain is finite
dimensional, it is all of `X_N`.  Finally, a spanning set in a finite-
dimensional space has a finite spanning subset, proving (4.4).  `square`

The proof is qualitative but effective in the fail-closed sense: enumerate
the finite high segments and reconstruct their moment matrices with
shrinking outward intervals until a square maximal minor, equivalently the
row-Gram determinant, excludes zero.  The
theorem proves that this search halts for each fixed input.  It supplies no
useful bound for the first successful `M`, uniformly in either `lambda` or
`N`.  Choosing `N=ceil(lambda^2)` does not improve that conclusion.

## 5. Defect comparability on a high-only segment

For a finite segment in (4.4), let

\[
 v=(I_n/I_0)_{R<n\leq M},\qquad
 D_{R,M}=I+vv^*,                                      \tag{5.1}
\]

\[
 H_{R,M}=\operatorname {diag}(d_n)_{R<n\leq M}
          +d_0vv^*.                                   \tag{5.2}
\]

Put

\[
 \eta_R=\sum_{\substack{n>R\\n\ {m even}}}
            \left|{I_n\over I_0}\right|^2,
 \qquad
 \delta_R=\inf_{\substack{n>R\\n\ {m even}}}d_n. \tag{5.3}
\]

Parseval for the constant function and monotonicity of the concentration
defects give

\[
 \sum_{n\ {m even}}|I_n|^2=2\lambda,
 \qquad
 \eta_R\longrightarrow0,
 \qquad
 \delta_R\longrightarrow1.                           \tag{5.4}
\]

For every terminal `M>R`,

\[
 D_{R,M}\preceq(1+\eta_R)I,
 \qquad
 H_{R,M}\succeq\delta_RI,
\]

and hence

\[
 \boxed{
 {\delta_R\over1+\eta_R}D_{R,M}
 \preceq H_{R,M}\preceq D_{R,M}.}                    \tag{5.5}
\]

In particular, for each fixed `lambda` one may choose `R` so that
`delta_R>=1/2` and `eta_R<=1`, obtaining the uniform-in-`M` comparison

\[
 \boxed{{1\over4}D_{R,M}\preceq H_{R,M}\preceq D_{R,M}.} \tag{5.6}
\]

This choice can be checked from source data: monotonicity reduces the first
condition to an enclosure for the first retained defect, while

\[
 \eta_R={2\lambda-
 \sum_{\substack{n\leq R\\n\ {m even}}}|I_n|^2
 \over |I_0|^2}                                      \tag{5.7}
\]

reduces the second to a lower partial-sum enclosure and a positive lower
enclosure for `I_0`.  One may then run the finite rank search from Theorem
4.1.  This is still a fixed-parameter halting construction, not a
transition-scale schedule.

### 5.1 The bridge has not been dropped

The high-only ordinary coordinates can be represented in separated
residue-plus-bridge coordinates without adding a free low bridge.  For
every retained `t=4j+2`, write

\[
 b=c_2,\qquad
 m_t=-h_t+{I_t\over I_2}h_2,\qquad
 q_t=c_t=-m_t+{I_t\over I_2}b.                        \tag{5.8}
\]

Let `C_sep^(R,M)=(C_0^(R,M),b,C_-^(R,M))` and let `S_(R,M)` be the
rectangular injective map which leaves each retained `0 mod 4` column
unchanged and sends a retained `q_t` coefficient to
`(I_t/I_2)b-m_t`.  Then

\[
 C_{R,M}=C_{\rm sep}^{(R,M)}S_{R,M},                  \tag{5.9}
\]

and, exactly,

\[
 \begin{aligned}
 D_{R,M}&=S_{R,M}^*D_{\rm sep}S_{R,M},\\
 H_{R,M}&=S_{R,M}^*H_{\rm sep}S_{R,M},\\
 W_{R,M}^*W_{R,M}&=S_{R,M}^*R_{\rm sep}S_{R,M},\\
 W_{R,M}^*Q_{\lambda,N}W_{R,M}
 &=S_{R,M}^*{\cal Q}_{\rm sep}S_{R,M}.
 \end{aligned}                                       \tag{5.10}
\]

All bridge metric and signed cross terms therefore survive the
compression.  Testing the whole separated space instead of `ran S_(R,M)`
would incorrectly reintroduce `b` as a free low-defect direction.

## 6. Exact bridge countermodel for the defect-scale loss

The factor `alpha_M` in (3.9) cannot be removed by an abstract appeal to the
mixed coframe.  Let `e_0,e_2,e_4,e_6` be orthonormal raw source rows and set

\[
 p=e_4-e_0,\qquad b=e_2-e_0,\qquad m=e_2-e_6.          \tag{6.1}
\]

These are the separated columns with formal integral ratios
`I_0=I_2=I_4=I_6=1`; the ordinary bridge identity is `q=-m+b=e_6-e_0`.
Their exact `L2` Gram is

\[
 D=
 \begin{bmatrix}
 2&1&0\\
 1&2&1\\
 0&1&2
 \end{bmatrix}.                                       \tag{6.2}
\]

For any rational `0<epsilon<=1`, assign raw defect weights

\[
 d_0=d_2=\varepsilon,
 \qquad d_4=d_6=1.
\]

The exact bridge defect Gram is

\[
 H_\varepsilon=
 \begin{bmatrix}
 1+\varepsilon&\varepsilon&0\\
 \varepsilon&2\varepsilon&\varepsilon\\
 0&\varepsilon&1+\varepsilon
 \end{bmatrix}.                                       \tag{6.3}
\]

It is positive definite: its first two leading principal minors are
`1+epsilon` and `2epsilon+epsilon^2`, and its determinant is
`2epsilon(1+epsilon)`.

Take the physical synthesis `W=I_3` and the physical Hermitian operator
`B_epsilon=H_epsilon`.  Then

\[
 WD^{-1}W^*=D^{-1}\succeq{1\over2+\sqrt2}I
 \succ{1\over4}I,                                    \tag{6.4}
\]

so the `L2` coframe floor is fixed.  The complete source pullback obeys the
unit defect-relative comparison

\[
 W^*B_\varepsilon W=H_\varepsilon.                    \tag{6.5}
\]

Nevertheless, the middle coefficient vector
`e_b=(0,1,0)^T` gives

\[
 \lambda_{\min}(B_\varepsilon)
 \leq \langle e_b,B_\varepsilon e_b\rangle
 =2\varepsilon\longrightarrow0.                       \tag{6.6}
\]

This exact family retains both bridge cross entries.  It proves that a
fixed `L2` coframe and a unit source floor relative to a degenerating defect
metric do not imply a uniform ordinary physical floor.  It does not claim
that the actual finite Weil operator is negative.  The separate exact
countermodel in `notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md` already shows
that a mixed coframe and positive diagonal source-family blocks do not
exclude a negative direction when the complete coupled cross block is
retained.

## 7. Exact reduction and remaining target

For the full target `X_N`, whole-target capture has the following exact
effect:

\[
 \begin{array}{c|c}
 \text{quantity}&\text{effect of capture}\\ \hline
 X_N\ominus\operatorname {ran}W&0\\
 \text{normalized complete source quotient}
 &\text{unitarily equivalent to }B_N(\tau)\\
 \text{spectrum, determinant, inertia}&\text{unchanged}\\
 (I-P_N)L^2&\text{unchanged}\\
 \text{projection error and determinant limit}&\text{unchanged}
 \end{array}                                          \tag{7.1}
\]

Thus the physical low/high cross term internal to `X_N` disappears only
because the whole physical signed problem has become the low block.  The
external Fourier complement, projection error, and locally uniform
determinant-convergence obligation remain.  Nothing special happens to the
identity (1.4) when `N=ceil(lambda^2)`.

There are now two honest routes forward, neither completed here.

1. Prove a lower bound directly for the complete physical operator
   `B_N(tau)`, retaining the signed pole--archimedean--prime cancellation.
   By Theorem 1.1 this is exactly the whole-target source-quotient problem,
   not a weaker surrogate.
2. Use high-only segments so that (5.6) replaces the degenerating prefix
   comparison, and prove both a useful common unbounded terminal-label
   bound and the complete quotient inequality with all bridge and physical
   cross terms.  The fixed-parameter halting theorem does not supply either
   estimate.

Until one of those routes also controls the external projection error and
establishes the residual divided by the exact complementary gap tending to
zero on one common schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`
remains open.
