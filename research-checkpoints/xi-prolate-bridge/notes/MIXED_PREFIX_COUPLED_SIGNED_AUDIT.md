# Mixed-prefix coupled signed audit

## 1. Claim boundary

This note determines exactly what the non-effective mixed all-even coframe
can and cannot contribute to the signed prolate--Weil comparison.

It proves four finite-dimensional facts.

1. The mixed corrected prefix has an invertible triangular description in
   terms of the `0 mod 4` family, the `2 mod 4` minus family, and the single
   bridge source `c_2`.  The complete source Gram is computed explicitly.
2. For every fixed `lambda` and fixed finite pair of physical inversion
   sectors, one mixed prefix gives a simultaneous row coframe in both
   sectors.
3. On the source quotient, the complete coupled signed form is congruent to
   the physical signed operator.  Consequently the mixed coframe preserves,
   rather than removes, every negative direction.
4. The closed annular concentration projector has uniformly bounded rank.
   Its angle to a mixed captured range is bounded by an exact right-inverse
   source tail, and some non-effective prefix captures the whole fixed
   target exactly.

The note also gives an exact rational countermodel in which the mixed frame
has a quantitative coframe floor and both diagonal residue-family signed
comparisons are strictly positive, while the complete coupled signed form is
indefinite.

These statements do **not** prove an effective prefix, a matched growing
schedule, either signed sector floor, the residual--gap limit in equation
(5.2) of `DIRECT_RH_ATTACK.md`, or locally uniform determinant convergence.
The repository state remains `P0_INVALIDATED`.

The source interval is `[-lambda,lambda]` with Lebesgue measure and zero
extension.  Multiplicative inversion is retained, and a source residue
class is never identified with physical inversion parity.

## 2. Exact residue-plus-bridge coordinates

Let `(e_n)_(n=0,2,4,...)` be the real orthonormal even prolate modes in the
pinned convention, and put

\[
 I_n=\int_{-\lambda}^{\lambda}e_n(x)\,dx .                \tag{2.1}
\]

The positive ground mode gives `I_0>0`.  The prescribed minus family uses
`I_2` as a denominator, so retain the same standing nonvanishing condition
`I_2 != 0`.  Define

\[
 b=c_2=e_2-{I_2\over I_0}e_0,                             \tag{2.2}
\]

\[
 p_j=c_{4j}=e_{4j}-{I_{4j}\over I_0}e_0,\qquad j\geq1,   \tag{2.3}
\]

and, for `t_j=4j+2>=6`,

\[
 m_j=c^-_{t_j}=-e_{t_j}+{I_{t_j}\over I_2}e_2.           \tag{2.4}
\]

All these sources have zero Lebesgue integral.  The ordinary mixed
zero-integral correction at a `2 mod 4` label is

\[
 q_j=c_{t_j}=e_{t_j}-{I_{t_j}\over I_0}e_0.              \tag{2.5}
\]

The exact bridge identity is

\[
 \boxed{q_j=-m_j+a_jb,\qquad a_j={I_{t_j}\over I_2}.}    \tag{2.6}
\]

Indeed, the two `e_2` terms cancel and
`a_j I_2/I_0=I_(t_j)/I_0`.  No asymptotic prolate formula is used.

For finite label sets, write

\[
 C_0=(p_j)_j,\qquad C_-=(m_j)_j,qquad
 C_{\rm sep}=(C_0,b,C_-),                                \tag{2.7}
\]

and

\[
 C_{\rm mix}=(C_0,b,(q_j)_j).                            \tag{2.8}
\]

If `a=(a_j)_j`, then

\[
 C_{\rm mix}=C_{\rm sep}{\cal S},\qquad
 {\cal S}=
 \begin{bmatrix}
 I&0&0\\
 0&1&a^*\\
 0&0&-I
 \end{bmatrix}.                                         \tag{2.9}
\]

The matrix `${\cal S}` is invertible.  Thus the mixed prefix and the
residue-plus-bridge inventory are exactly the same source subspace.

### 2.1 Complete source Gram

Put

\[
 u_j={I_{4j}\over I_0},\qquad
 \beta={I_2\over I_0}.                                  \tag{2.10}
\]

Unique modal rows show directly that the columns of `C_sep` are linearly
independent.  Orthonormality of the `e_n` gives their exact source Gram

\[
 \boxed{
 D_{\rm sep}=C_{\rm sep}^*C_{\rm sep}=
 \begin{bmatrix}
 I+uu^*&\beta u&0\\
 \beta u^*&1+\beta^2&a^*\\
 0&a&I+aa^*
 \end{bmatrix}\succ0.}                                  \tag{2.11}
\]

In particular, after grouping the bridge with the `2 mod 4` minus family,
the two family blocks are

\[
 D_{00}=I+uu^*,\qquad
 D_{22}=
 \begin{bmatrix}1+\beta^2&a^*\\a&I+aa^*\end{bmatrix},  \tag{2.12}
\]

while

\[
 D_{02}=\begin{bmatrix}\beta u&0\end{bmatrix}.           \tag{2.13}
\]

The bridge therefore does not make the full source metric block diagonal.
From (2.9),

\[
 D_{\rm mix}={\cal S}^*D_{\rm sep}{\cal S}.              \tag{2.14}
\]

For any bounded physical map `T`, put

\[
 W_{\rm sep}=TC_{\rm sep},\qquad
 W_{\rm mix}=TC_{\rm mix}=W_{\rm sep}{\cal S}.           \tag{2.15}
\]

Then the coordinate-invariant restricted row frame is unchanged:

\[
 \boxed{
 W_{\rm mix}D_{\rm mix}^{-1}W_{\rm mix}^*
 =W_{\rm sep}D_{\rm sep}^{-1}W_{\rm sep}^*.}            \tag{2.16}
\]

Thus the bridge decomposition is legitimate for row-frame and quotient
arguments only when the complete Gram (2.11), including (2.13), is retained.

## 3. A simultaneous mixed-prefix coframe

Let

\[
 {\cal H}_0^{\rm ev}
 =\left\{f\in L^2[-\lambda,\lambda]:
 f(-x)=f(x),\ \int f=0\right\}.                          \tag{3.1}
\]

On `I_lambda=[lambda^(-1),lambda]`, use the locked arithmetic map

\[
 (A_\lambda f)(v)=\sqrt v\sum_{n\leq\lambda/v}f(nv),    \tag{3.2}
\]

in `L^2(I_lambda,dv/v)`.  Let `S_+` and `S_-` be the two orthogonal
inversion-parity projections.  Fix finite-dimensional physical target
spaces `X_+` and `X_-` in the corresponding parity sectors and define

\[
 T_\oplus f=
 \left(P_{X_+}S_+A_\lambda f,
       P_{X_-}S_-A_\lambda f\right).                    \tag{3.3}
\]

Put

\[
 M_\mu(\lambda)=
 \sum_{n\leq\lfloor\lambda^2\rfloor}{|\mu(n)|\over\sqrt n}
 \leq2\lambda.                                         \tag{3.4}
\]

The explicit full-source right inverse used in
`notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` applies simultaneously.  Given
`x_+ in X_+` and `x_- in X_-`, apply it to `g=x_++x_-`.  Orthogonality of
the parity sectors and the right-inverse construction give a source
`${\cal B}_\oplus(x_+,x_-)` satisfying

\[
 T_\oplus {\cal B}_\oplus=I_{X_+\oplus X_-},\qquad
 \|{\cal B}_\oplus\|\leq\sqrt2\,\lambda M_\mu(\lambda).\tag{3.5}
\]

Also `T_oplus` is a compression of `A_lambda`, so

\[
 \|T_\oplus\|^2\leq{\lambda^2\over2}.                  \tag{3.6}
\]

### Theorem 3.1 (simultaneous full-source and finite-prefix floors)

The combined full-source map obeys

\[
 \boxed{
 {1\over2\lambda^2M_\mu(\lambda)^2}I
 \preceq T_\oplus T_\oplus^*
 \preceq{\lambda^2\over2}I.}                            \tag{3.7}
\]

For every fixed `lambda`, `X_+`, and `X_-`, some finite mixed corrected
prefix `F_M=span(c_2,c_4,...,c_(2M))` satisfies

\[
 \boxed{
 T_\oplus P_{F_M}T_\oplus^*
 \succeq {1\over4\lambda^2M_\mu(\lambda)^2}I
 \succeq {1\over16\lambda^4}I.}                         \tag{3.8}
\]

Equivalently, after applying the triangular change (2.9),

\[
 W_{\rm sep}D_{\rm sep}^{-1}W_{\rm sep}^*
 \succeq {1\over16\lambda^4}I_{X_+\oplus X_-}.          \tag{3.9}
\]

**Proof.**  For `x in X_+ direct-sum X_-`, (3.5) gives

\[
 \|x\|^2
 =\langle T_\oplus {\cal B}_\oplus x,x\rangle
 \leq\|{\cal B}_\oplus\|\,\|x\|\,\|T_\oplus^*x\|,
\]

which proves the lower bound in (3.7).  Equation (3.6) proves the upper
bound.

The mixed corrected prolates have dense span in `${\cal H}_0^{ev}`.
Therefore `P_(F_M)` converges strongly to the identity.  Since the target is
finite-dimensional,

\[
 (T_\oplus T_\oplus^*)^{-1/2}
 T_\oplus(I-P_{F_M})T_\oplus^*
 (T_\oplus T_\oplus^*)^{-1/2}\longrightarrow0
\]

in norm.  Choose `M` so that this positive tail has norm at most `1/2`.
Then

\[
 T_\oplus P_{F_M}T_\oplus^*
 \succeq{1\over2}T_\oplus T_\oplus^*,
\]

and (3.7), (3.4), and (2.16) prove (3.8)--(3.9).  `square`

This theorem permits the same mixed inventory to span both physical parity
targets.  It does not prove that `T_+C_0` or `T_-C_-` spans separately.
The last label `2M` is non-effective, may lie far beyond the pinned
transition buffer, and has no proved uniform behavior as `lambda` and the
target dimension grow.

## 4. Closed annular capture from a mixed prefix

This section records a qualitative consequence for the closed annular
projector in `notes/ANNULAR_GRAY_MASS_OBSTRUCTION.md`.

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,
\]

fix `delta<b_0<pi/2`, and let

\[
 {\cal A}_{\delta,b_0}(\lambda)
 =\{t:\delta<|Lt|<b_0\}.                                \tag{4.1}
\]

On a finite physical parity target `X subset L^2[-ell,ell]`, define

\[
 C_{\rm ann}
 =P_X{\cal F}^{-1}M_{{\bf1}_{{\cal A}_{\delta,b_0}}}
       {\cal F}P_X,                                      \tag{4.2}
\]

and, for a fixed `sigma_0>0`, the closed projector

\[
 F_{\sigma_0}={\bf1}_{[\sigma_0,1]}(C_{\rm ann}).        \tag{4.3}
\]

### Lemma 4.1 (uniformly bounded annular rank)

One has

\[
 \boxed{
 \operatorname {rank}F_{\sigma_0}
 \leq {b_0-\delta\over\pi\sigma_0}.}                   \tag{4.4}
\]

**Proof.**  The full time--band concentration operator on
`L^2[-ell,ell]` has constant diagonal kernel

\[
 {|{\cal A}_{\delta,b_0}(\lambda)}|\over2\pi}
 ={b_0-\delta\over\pi L}.
\]

Its trace on the interval of length `L` is therefore
`(b_0-delta)/pi`.  Compression to `X` cannot increase the trace, so

\[
 \operatorname {tr}C_{\rm ann}
 \leq {b_0-\delta\over\pi}.
\]

Every eigenvalue on `ran(F_(sigma_0))` is at least `sigma_0`, which proves
(4.4).  `square`

Let `T=P_XS_\epsilon A_\lambda` in one parity and let

\[
 B_X:X\longrightarrow{\cal H}_0^{\rm ev},\qquad
 TB_X=I_X,qquad
 \|B_X\|\leq\sqrt2\,\lambda M_\mu(\lambda)              \tag{4.5}
\]

be the explicit full-source right inverse.  For a mixed prefix `F_M`, put

\[
 K_M=\operatorname {ran}(TP_{F_M}),\qquad
 H_M=K_M^\perp.                                         \tag{4.6}
\]

### Lemma 4.2 (right-inverse source-tail angle)

The annular sine angle satisfies the exact bound

\[
 \boxed{
 \|P_{H_M}F_{\sigma_0}\|
 \leq\|T(I-P_{F_M})B_XF_{\sigma_0}\|
 \leq{\lambda\over\sqrt2}
       \|(I-P_{F_M})B_XF_{\sigma_0}\|.}                 \tag{4.7}
\]

**Proof.**  For `y in ran(F_(sigma_0))`, the vector
`TP_(F_M)B_Xy` lies in `K_M`, while `y=TB_Xy`.  Hence

\[
 \operatorname {dist}(y,K_M)
 \leq\|T(I-P_{F_M})B_Xy\|.
\]

Take the operator supremum and use (3.6).  `square`

The bounded rank in (4.4) makes

\[
 \|(I-P_{F_M})B_XF_{\sigma_0}\|\longrightarrow0         \tag{4.8}
\]

for every fixed `lambda` and fixed target.  Theorem 3.1 is stronger
qualitatively: for some finite `M`, `K_M=X` exactly, and then

\[
 P_{H_M}=0,qquad \|P_{H_M}F_{\sigma_0}\|=0.             \tag{4.9}
\]

This does not supply the growing-schedule angle required by the annular
necessity theorem.  The target squared angle is `O(L/lambda)`.  Using only
the coarse second inequality in (4.7) would need the sufficient, presently
unproved uniform source-tail rate

\[
 \|(I-P_{F_M})B_XF_{\sigma_0}\|^2
 =O\!\left({L\over\lambda^3}\right).                    \tag{4.10}
\]

Fixed-`lambda` norm convergence gives no such rate.  More importantly,
making `K_M=X` removes the annular high complement but moves the complete
signed operator into the low block.  The sign obligation then becomes the
whole physical signed-sector problem in Section 5 below.

## 5. The exact coupled signed quotient

Let

\[
 B_\oplus=B_+\oplus B_-                                \tag{5.1}
\]

be the two complete shifted physical signed operators, with every pole,
archimedean, and minus-prime contribution retained.  Apply the combined
physical map to the separated source inventory and write

\[
 W=\begin{bmatrix}W_+\\W_-\end{bmatrix},\qquad
 A=WD_{\rm sep}^{-1/2},\qquad
 K=\operatorname {ran}A.                                \tag{5.2}
\]

Let

\[
 P_0=P_{(\ker A)^\perp},\qquad
 \Delta=(AA^*)^\dagger\big|_K.                          \tag{5.3}
\]

The complete source pullback is

\[
 \boxed{
 {\cal Q}=W^*B_\oplus W
 =W_+^*B_+W_+ + W_-^*B_-W_-.}                            \tag{5.4}
\]

The signed quotient theorem gives, for every real `mu`,

\[
 \boxed{
 P_KB_\oplus P_K\succeq\mu\Delta
 \quad\Longleftrightarrow\quad
 P_0D_{\rm sep}^{-1/2}{\cal Q}D_{\rm sep}^{-1/2}P_0
 \succeq\mu P_0.}                                      \tag{5.5}
\]

This is the quotient-aware coupled signed condition.  A positive inequality
against `D_sep` on the entire raw coefficient space is impossible whenever
`W` has a source kernel; the projector `P_0` may not be dropped.

### 5.1 Inertia is preserved

Assume the mixed coframe fills `X_+ direct-sum X_-`, so `K` is the whole
physical target.  The restriction

\[
 A_0=A|_{(\ker A)^\perp}:(\ker A)^\perp
 \longrightarrow X_+\oplus X_-                          \tag{5.6}
\]

is bijective.  Therefore

\[
 A_0^*B_\oplus A_0                                      \tag{5.7}
\]

is congruent to `B_oplus`.  Sylvester's law gives

\[
 \boxed{
 \operatorname {Inertia}(A_0^*B_\oplus A_0)
 =\operatorname {Inertia}(B_\oplus).}                   \tag{5.8}
\]

In particular, every negative physical direction gives a negative source
quotient direction.  A coframe floor conditions the coordinate map; it
cannot change the sign.

In the full-row case (5.5) becomes

\[
 A_0^*B_\oplus A_0\succeq\mu I
 \quad\Longleftrightarrow\quad
 B_\oplus\succeq\mu(AA^*)^{-1}.                         \tag{5.9}
\]

The restricted frame also satisfies `AA^*<=lambda^2 I/2`, so

\[
 (AA^*)^{-1}\succeq{2\over\lambda^2}I.                  \tag{5.10}
\]

Thus a positive `mu` in the coupled source condition would already prove
the physical floor

\[
 B_\oplus\succeq{2\mu\over\lambda^2}I.                  \tag{5.11}
\]

Equation (5.11) is a consequence of the still-unproved signed hypothesis,
not a conclusion of the mixed coframe theorem.

### 5.2 Literal two-family block form

Group the source coordinates as

\[
 {\cal U}_0=\operatorname {ran}C_0,qquad
 {\cal U}_2=\operatorname {ran}(b,C_-).                  \tag{5.12}
\]

Then

\[
 {\cal Q}_{ij}
 =\sum_{\epsilon\in\{+,-\}}
 W_{\epsilon,i}^*B_\epsilon W_{\epsilon,j},             \tag{5.13}
\]

and no term in (5.13) vanishes merely because `i` and `j` denote different
source residues.  Physical inversion parity was already imposed by
`W_(epsilon,i)`; source residue is a different decomposition.

If the selected physical synthesis is injective, the lower comparison is
equivalently

\[
 {\cal L}(\mu):={\cal Q}-\mu D_{\rm sep}\succeq0.        \tag{5.14}
\]

Writing this in the two blocks from (5.12), if
`L_(22)(mu)` is positive definite, then the exact Schur condition is

\[
 \boxed{
 {\cal L}_{22}(\mu)\succ0,qquad
 {\cal L}_{00}(\mu)
 -{\cal L}_{02}(\mu){\cal L}_{22}(\mu)^{-1}
  {\cal L}_{20}(\mu)\succeq0.}                          \tag{5.15}
\]

The off-diagonal entry contains both the signed physical coupling
`Q_(02)` and the metric coupling `-mu D_(02)` from (2.13).  If `W` is
redundant, (5.15) must instead be applied after the quotient compression in
(5.5); in general `P_0` mixes the two source blocks.  A raw two-family Schur
test is then not equivalent to the physical problem.

## 6. Exact rational countermodel

This model shows that a quantitative mixed coframe and strictly positive
diagonal family comparisons do not control the coupled Schur term.

Take a real source space with orthonormal rows
`e_0,e_2,e_4,e_6` and formal integral data

\[
 I_0=I_2=I_4=I_6=1.                                    \tag{6.1}
\]

Define

\[
 p=c_4=e_4-e_0,\qquad
 b=c_2=e_2-e_0,\qquad
 m=c_6^-=-e_6+e_2.                                      \tag{6.2}
\]

Then

\[
 c_6=e_6-e_0=-m+b,                                      \tag{6.3}
\]

so the exact bridge identity is present.  In the separated coordinates
`(p,b,m)`,

\[
 D=
 \begin{bmatrix}
 2&1&0\\
 1&2&1\\
 0&1&2
 \end{bmatrix}.                                         \tag{6.4}
\]

Its eigenvalues are `2-sqrt(2),2,2+sqrt(2)`, so

\[
 0\prec D\preceq4I.                                    \tag{6.5}
\]

Let the physical space be

\[
 H_+\oplus H_-=\mathbb R^2\oplus\mathbb R
\]

and take the block-diagonal signed operator

\[
 B_\oplus=I_{\mathbb R^2}\oplus(-I_{\mathbb R}).       \tag{6.6}
\]

Define the three physical columns

\[
 w_0=(1,0,1/2)^T,\qquad
 w_b=(0,1,1/4)^T,\qquad
 w_2=(1,0,-1/2)^T,                                      \tag{6.7}
\]

and `W=[w_0,w_b,w_2]`.  Every displayed column has a nonzero component in
both physical parity sectors.  Also `det(W)=-1`, so the synthesis has full
row rank.

Direct multiplication gives

\[
 WW^*=
 \begin{bmatrix}
 2&0&0\\
 0&1&1/4\\
 0&1/4&9/16
 \end{bmatrix}\succeq{1\over4}I.                        \tag{6.8}
\]

Combining (6.5)--(6.8),

\[
 \boxed{WD^{-1}W^*\succeq{1\over16}I.}                  \tag{6.9}
\]

Thus the model has a strict quantitative source-normalized mixed coframe.

The complete signed pullback is

\[
 {\cal Q}=W^*B_\oplus W
 =\begin{bmatrix}
 3/4&-1/8&5/4\\
 -1/8&15/16&1/8\\
 5/4&1/8&3/4
 \end{bmatrix}.                                         \tag{6.10}
\]

For the first residue block,

\[
 {\cal Q}_{00}={3\over4}={3\over8}D_{00}.               \tag{6.11}
\]

For the bridge-plus-minus block,

\[
 {\cal Q}_{22}=
 \begin{bmatrix}15/16&1/8\\1/8&3/4\end{bmatrix},
 \qquad
 D_{22}=\begin{bmatrix}2&1\\1&2\end{bmatrix}.          \tag{6.12}
\]

The generalized eigenvalues are

\[
 \frac{25\pm\sqrt{97}}{48},                             \tag{6.13}
\]

so in particular

\[
 {\cal Q}_{22}\succeq
 {25-\sqrt{97}\over48}D_{22}\succ0.                     \tag{6.14}
\]

Both diagonal family comparisons are therefore strictly positive.  But for

\[
 x=(1,0,-1)^T,
\]

one has

\[
 Wx=(0,0,1)^T,qquad
 x^*{\cal Q}x=-1,qquad
 x^*Dx=4.                                                \tag{6.15}
\]

The full coupled signed form is indefinite.  The off-diagonal value
`Q_(02)=5/4` is exactly what the two positive diagonal checks discard.

This countermodel does not assert that the actual finite Weil operator has
a negative direction.  It proves that mixed coframe data and diagonal
residue-family signed estimates alone cannot imply the required coupled
signed comparison.

## 7. Relation to the existing transition and Schur reductions

1. **Transition estimates.**  The proof in
   `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` uses a single residue
   class so that `(-1)^(n/2)` is constant.  Its split-block quotient theorem
   deliberately introduces a block-diagonal exterior metric and retains a
   cross term only after bounding the complete row operator.  That metric is
   not the full bridge Gram (2.11).  Its estimates cannot be transferred to
   (2.11) by retaining only diagonal compressions.

2. **Signed quotient.**  Equation (5.5) is precisely the source-coordinate
   condition isolated in `notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md`.
   Enlarging the physical range with a mixed prefix can make its high
   complement vanish, but then the low signed comparison is the entire
   physical operator by (5.8)--(5.9).

3. **Physical soft short.**  The soft-short identity in
   `notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md` splits an orthogonal physical
   low/high decomposition.  The residue decomposition (5.12) is an oblique
   source-coordinate split and is not shorted by that theorem.  When the
   mixed range fills the whole physical target, the physical high space is
   zero and the soft-short criterion reduces to the sign of `B_oplus`
   itself.

4. **Annular projector.**  Bounded rank and fixed-`lambda` source-tail
   convergence prove qualitative mixed capture, but no uniform last label
   or tail rate.  Exact whole-target capture removes the exterior angle only
   by placing every signed direction into the low block.

## 8. Precise remaining target

The mixed-prefix route is a valid alternative formulation only if all of the
following are proved on one common unbounded schedule.

1. Choose an effective mixed inventory, including the bridge, and retain one
   declared complete source metric throughout the transition, residual, and
   signed estimates.
2. Prove either the full-row coframe on that schedule or the annular
   source-tail rate needed in (4.7), together with the remaining dangerous
   physical directions.
3. Prove the complete quotient-aware inequality (5.5), or equivalently its
   full coupled Schur condition with every off-diagonal term.  Positive
   diagonal family blocks are insufficient by Section 6.
4. Retain the complete low/high signed feature contraction and residual
   action in the same metric, then establish the residual--gap limit and the
   separate determinant-convergence obligation.

Thus the mixed coframe can replace separate **spanning** statements if a
larger coupled source family is admitted.  It does not weaken the signed
analytic obligation: after the coframe is full, the source quotient has
exactly the same inertia as the complete physical signed operator.
