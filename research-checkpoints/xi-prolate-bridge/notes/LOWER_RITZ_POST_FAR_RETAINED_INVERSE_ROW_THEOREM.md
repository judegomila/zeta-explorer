# Lower-Ritz post-far retained inverse-row theorem

## 0. Exact outcome and claim boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad L=2\log\lambda,
 \qquad N=2^{9600\lambda^2}.                         \tag{0.1}
\]

Write the complete inversion-even block and its lower two-vector Ritz
shift as

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix},\qquad
 u=\lambda_{\min}\left(Q_+|_{\operatorname {span}\{\kappa,b\}}
                  \right),\qquad B=A-uI.             \tag{0.2}
\]

Every ordinary inverse statement below is conditional on the unproved
strict lower-Ritz branch `B>0`.  No such sign is inferred here.

Let the half-power split, followed by a captured/retained split, be

\[
 \mathcal K=(\mathcal C\oplus\mathcal R)\oplus\mathcal F.
                                                               \tag{0.3}
\]

First eliminate the positive far block `H`, and then eliminate the
positive captured block `P` of the resulting short.  If

\[
 b=(b_Y,b_F),\qquad
 \beta=b_Y-\Gamma^*H^{-1}b_F=(c,r),                 \tag{0.4}
\]

\[
 \Sigma=D-\Gamma^*H^{-1}\Gamma
 =\begin{pmatrix}P&X^*\\X&R\end{pmatrix},\qquad
 R_1=R-XP^{-1}X^*,\qquad
 \rho_1=r-XP^{-1}c,                                 \tag{0.5}
\]

then the forcing inverse energy has the exact three-term split

\[
 \boxed{
 E_u:=b^*B^{-1}b
 =b_F^*H^{-1}b_F+c^*P^{-1}c
       +\rho_1^*R_1^{-1}\rho_1.}                    \tag{0.6}
\]

Every term in (0.6) is nonnegative.  Thus, with

\[
 \mathfrak d_\lambda=d_4L,                           \tag{0.7}
\]

the proposed replacement lemma `E_u=O(d_4 L)` is equivalent to the
three separate estimates

\[
 \boxed{
 b_F^*H^{-1}b_F=O(\mathfrak d_\lambda),\qquad
 c^*P^{-1}c=O(\mathfrak d_\lambda),\qquad
 \rho_1^*R_1^{-1}\rho_1=O(\mathfrak d_\lambda).}    \tag{0.8}
\]

Conditional on the first two estimates in (0.8), the third is therefore
necessary and sufficient.  It is exactly the one-row Loewner estimate

\[
 \boxed{
 \rho_1\rho_1^*\preceq C\mathfrak d_\lambda R_1.}   \tag{0.9}
\]

Equation (0.9) is weaker than a uniform retained floor.  It asks only that
the returned Ritz forcing functional be continuous in the exact retained
short energy.

There is also a complete semidefinite version.  If `B>=0`, `H>0`, `P>0`,
and `R_1>=0`, then

\[
 b\in\operatorname {Ran}B
 \quad\Longleftrightarrow\quad
 \rho_1\in\operatorname {Ran}R_1.                  \tag{0.10}
\]

Under this range condition,

\[
 \boxed{
 b^*B^\dagger b
 =b_F^*H^{-1}b_F+c^*P^{-1}c
       +\rho_1^*R_1^\dagger\rho_1.}                 \tag{0.11}
\]

Moreover, (0.9) is equivalent to the range condition together with
`rho_1^*R_1^dagger rho_1<=C mathfrak d_lambda`.

The frozen Toeplitz, far-cross, and multiplier inputs do not imply these
three rows.  The far-cross theorem controls `Gamma` from the captured
prefix, not the separate anchor forcing `b_F`.  The growing Toeplitz floor
acts on the captured compression, not on `R_1`.  The multiplier safe floor
does not orient its dangerous retained space.  The repaired label-16
barrier already separates the scalar coframe row, full-metric equivalence,
anchor-to-far row, and retained row; the present note supplies the exact
post-far identity that connects those gates to `E_u`.

The exact source-Cauchy family in Section 6 makes the first term zero and
the captured term `O(d_4 L)`, while the retained term diverges relative to
`d_4 L`.  Hence neither the captured floor, a perfect captured-to-far
decoupling, the multiplier safe floor, nor source-Cauchy displacement
implies (0.9).

This note proves an exact finite-dimensional identity and a sharp logical
barrier.  It does not prove any estimate in (0.8) for the pinned arithmetic
matrices, either strict lower-Ritz sign on an unbounded schedule, equation
(5.2) of `DIRECT_RH_ATTACK.md`, a determinant limit, a zero statement, the
Riemann hypothesis, or a de Bruijn--Newman `Lambda` bound.  The formal state
remains `P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following strict-PASS repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/LOWER_RITZ_ACTUAL_LABEL16_RESIDUAL_CAPTURE_ACTION_BARRIER.md` | `8b54fe4064ddaf5047763aaef301856ccfa82bfa6bf27691d582cd559d4a5d77` |
| `tests/test_lower_ritz_actual_label16_residual_capture_action_barrier.py` | `67407df0c007b50046c0ca4b8dec1a36910d1ad44fc3f2f8e48242f8a1dc6572` |
| `notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md` | `aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce` |
| `tests/test_lower_ritz_half_power_one_inverse_source_angle_reduction.py` | `27b8284faefe471934d40ca0937bdba4cb4a764b7aa1597559fd1cc0c774a9ed` |
| `notes/GROWING_MIXED_BRIDGE_RETAINED_COMPLEMENT_TWO_STAGE_SCHUR_BARRIER.md` | `102f69ec567803153d5648316874c8369cd558ee17cfce71f3cca2e9bb259f81` |
| `tests/test_growing_mixed_bridge_retained_complement_two_stage_schur_barrier.py` | `0613ef6cb25d6c1c7182011d7092fb42786af3a1d25244d2d0451f26f8098a15` |
| `notes/GROWING_LOW_PREFIX_HALF_POWER_FAR_CROSS_THEOREM.md` | `c0428b5c0ab43719b8e82b24ff21f7c40ebfde978ddb8d4185f92abb633ab55f` |
| `tests/test_growing_low_prefix_half_power_far_cross_theorem.py` | `be358852f5f5749e25aca722a18cfb081b8c36bab7aeed74343b624d49ef0569` |
| `notes/GROWING_FIXED_CAPTURE_MULTIPLIER_DANGER_NESTED_FESHBACH_BARRIER.md` | `0abc50aabff9e630001e1164eafba8de52ef5804e1c2251e70e1367e5b7c9197` |
| `tests/test_growing_fixed_capture_multiplier_danger_nested_feshbach_barrier.py` | `31d09931272864bc1f8dc93e5008d4453f30ad953916cf5a2a56f3cabb636750` |
| `notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md` | `0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3` |
| `tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py` | `8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b` |

The half-power note supplies the one-stage inverse-row identity.  The
retained barrier supplies the second Feshbach split.  The label-16 note
separates the actual modal, full-metric, far, and retained row gates.  The
last pair supplies the exact lower-Ritz inverse-spread family used below.

## 2. First elimination: the far inverse row

Write `Y=mathcal C direct-sum mathcal R` and decompose

\[
 B=\begin{pmatrix}D&\Gamma^*\\\Gamma&H\end{pmatrix}
 \quad\hbox{on}\quad Y\oplus\mathcal F,
 \qquad H\succ0.                                    \tag{2.1}
\]

Put

\[
 \mathsf S=H^{-1}\Gamma,\qquad
 \Sigma=D-\Gamma^*H^{-1}\Gamma.                    \tag{2.2}
\]

The exact factorization is

\[
 B=
 \begin{pmatrix}I&\mathsf S^*\\0&I\end{pmatrix}
 \begin{pmatrix}\Sigma&0\\0&H\end{pmatrix}
 \begin{pmatrix}I&0\\\mathsf S&I\end{pmatrix}.  \tag{2.3}
\]

Define the far harmonic lift

\[
 \mathsf E_Fy=(y,-\mathsf Sy).                      \tag{2.4}
\]

Then

\[
 \Sigma=\mathsf E_F^*B\mathsf E_F,
 \qquad \beta=\mathsf E_F^*b
              =b_Y-\Gamma^*H^{-1}b_F.              \tag{2.5}
\]

Inverting (2.3) proves

\[
 \boxed{
 b^*B^{-1}b
 =b_F^*H^{-1}b_F+\beta^*\Sigma^{-1}\beta.}          \tag{2.6}
\]

The returned row is `beta`, not the raw projection `b_Y`.  Thus a theorem
for the captured-to-far operator `Gamma` is not by itself a theorem for
the anchor-to-far row `b_F`.

## 3. Second elimination: the retained inverse row

Relative to `Y=mathcal C direct-sum mathcal R`, write

\[
 \Sigma=\begin{pmatrix}P&X^*\\X&R\end{pmatrix},
 \qquad \beta=\binom c r,\qquad P\succ0.             \tag{3.1}
\]

Set

\[
 R_1=R-XP^{-1}X^*,\qquad
 \rho_1=r-XP^{-1}c.                                 \tag{3.2}
\]

There is a second exact factorization,

\[
 \Sigma=
 \begin{pmatrix}I&0\\XP^{-1}&I\end{pmatrix}
 \begin{pmatrix}P&0\\0&R_1\end{pmatrix}
 \begin{pmatrix}I&P^{-1}X^*\\0&I\end{pmatrix}.    \tag{3.3}
\]

Consequently

\[
 \boxed{
 \beta^*\Sigma^{-1}\beta
 =c^*P^{-1}c+\rho_1^*R_1^{-1}\rho_1.}               \tag{3.4}
\]

Define the captured harmonic lift into `Y` by

\[
 \mathsf E_Cz=(-P^{-1}X^*z,z),\qquad z\in\mathcal R,
                                                               \tag{3.5}
\]

and the combined lift `mathsf G=mathsf E_F mathsf E_C`.  Then

\[
 \boxed{
 R_1=\mathsf G^*B\mathsf G,\qquad
 \rho_1=\mathsf G^*b.}                              \tag{3.6}
\]

Thus the last term in (0.6) is the inverse energy of the actual forcing
row pulled onto the twice-harmonic retained range.  Every far and captured
Schur return is already inside `mathsf G`.

Combining (2.6) and (3.4) proves (0.6).

## 4. Semidefinite range theorem and sharp Loewner form

Assume now only

\[
 B\succeq0,\qquad H\succ0,\qquad P\succ0.
                                                               \tag{4.1}
\]

The factorizations (2.3) and (3.3) are congruences by invertible matrices.
They imply

\[
 B\succeq0\quad\Longleftrightarrow\quad R_1\succeq0. \tag{4.2}
\]

They also transform the equation `Bx=b` into two diagonal equations.  The
`H` and `P` equations are always solvable, while the last one is

\[
 R_1z=\rho_1.                                       \tag{4.3}
\]

This proves (0.10).  If (4.3) is solvable, the scalar `b^*x` is independent
of the chosen solution because `b` annihilates `ker B`.  Taking the
Moore--Penrose solution therefore gives (0.11).  Notice that no false
congruence formula for a Moore--Penrose inverse is asserted.

For any positive semidefinite `R_1`, spectral decomposition gives

\[
 \sup_{z:\,z^*R_1z>0}
 { |\rho_1^*z|^2\over z^*R_1z}
 =\rho_1^*R_1^\dagger\rho_1                       \tag{4.4}
\]

when `rho_1` lies in `Ran R_1`.  If it has a nonzero kernel component,
the corresponding row inequality is impossible.  Hence the following are
equivalent for every `K>=0`:

\[
 \boxed{
 \begin{aligned}
 &\rho_1\rho_1^*\preceq K R_1;\\
 &\rho_1\in\operatorname {Ran}R_1
   \quad\hbox{and}\quad
   \rho_1^*R_1^\dagger\rho_1\leq K;\\
 &|\rho_1^*z|^2\leq K z^*R_1z
   \quad\hbox{for every }z\in\mathcal R.
 \end{aligned}}                                      \tag{4.5}
\]

Taking `K=C mathfrak d_lambda` proves the generalized form of (0.9).

## 5. Exact scale ledger and audit of the frozen inputs

Name the three terms in (0.6)

\[
 \mathcal E_F=b_F^*H^{-1}b_F,\qquad
 \mathcal E_C=c^*P^{-1}c,\qquad
 \mathcal E_R=\rho_1^*R_1^{-1}\rho_1.              \tag{5.1}
\]

Since all three are nonnegative,

\[
 E_u=O(\mathfrak d_\lambda)
 \quad\Longleftrightarrow\quad
 \mathcal E_F,\mathcal E_C,\mathcal E_R
       =O(\mathfrak d_\lambda).                    \tag{5.2}
\]

The three sufficient metric packages have different carriers.

For the far term, `H>=G_R I` would reduce the issue to

\[
 \|b_F\|^2=O(G_R\mathfrak d_\lambda).               \tag{5.3}
\]

The far-cross theorem estimates `Gamma` on the captured prefix.  It does
not prove (5.3).

For the captured term, a post-far prefix floor and returned dual row

\[
 P\succeq aL\Delta_C,\qquad
 c^*\Delta_C^{-1}c=O(d_4L^2)                        \tag{5.4}
\]

would give `mathcal E_C=O(mathfrak d_lambda)`.  The fixed Toeplitz theorem
has the wrong quantifier order for the growing raw row.  The repaired
label-16 theorem additionally isolates the required full-metric
equivalence.  Neither theorem proves (5.4) for the returned row `c`.

For the retained term, the minimal statement is (0.9).  A stronger
full-metric package would be

\[
 R_1\succeq a_RL\Delta_R,\qquad
 \rho_1^*\Delta_R^{-1}\rho_1=O(d_4L^2),             \tag{5.5}
\]

but no current theorem supplies either half on the twice-harmonic retained
range.  The multiplier construction gives a safe floor only outside its
dangerous space; the soft direction in (5.5) may remain dangerous.  Rank,
phase volume, or a captured Toeplitz floor does not imply (0.9).

Thus the existing inputs do not imply `E_u=O(d_4 L)`.  Even after future
proofs of (5.3)--(5.4), the exact new retained statement would still be
(0.9), not a uniform inverse norm.

## 6. Exact retained source-Cauchy non-implication family

Let `0<delta<1` and `s>0`, and put

\[
 t=s\delta^2,\qquad
 B_0=s\operatorname {diag}(1,\delta^4),\qquad
 w={1\over\sqrt {17}}(-4,-1),                       \tag{6.1}
\]

\[
 r=s\delta\sqrt{{16+\delta^4\over17}},\qquad b=rw.
                                                               \tag{6.2}
\]

The exact source-Cauchy construction on the nodes `-2,-1,0,1,2` has

\[
 Q_+=\begin{pmatrix}
 t&-4r/\sqrt {17}&-r/\sqrt {17}\\
 -4r/\sqrt {17}&s&0\\
 -r/\sqrt {17}&0&s\delta^4
 \end{pmatrix}.                                      \tag{6.3}
\]

Its odd block is

\[
 Q_-=\begin{pmatrix}
 s+8r/\sqrt {34}&4r/\sqrt {34}\\
 4r/\sqrt {34}&s\delta^4+2r/\sqrt {34}
 \end{pmatrix}\succ0.                                \tag{6.4}
\]

Moreover,

\[
 t\langle w,B_0w\rangle=r^2.                       \tag{6.5}
\]

Thus the lower two-vector Ritz value is exactly `u=0`, and both strict
lower-Ritz signs hold.

Take `mathcal C=span{e_1}`, `mathcal R=span{e_2}`, and initially
`mathcal F={0}`.  Then

\[
 P=s,\qquad X=0,\qquad R_1=s\delta^4,               \tag{6.6}
\]

\[
 c=-{4r\over\sqrt {17}},\qquad
 \rho_1=-{r\over\sqrt {17}}.                       \tag{6.7}
\]

The two inverse-row terms are exactly

\[
 \boxed{
 \mathcal E_C={16s\delta^2(16+\delta^4)\over289}
               =O(t),}                              \tag{6.8}
\]

\[
 \boxed{
 \mathcal E_R={s\delta^{-2}(16+\delta^4)\over289},
 \qquad
 {\mathcal E_R\over t}
 ={16+\delta^4\over289\delta^4}\longrightarrow\infty.}
                                                               \tag{6.9}
\]

Consequently

\[
 E_u=t{(16+\delta^4)(16+\delta^{-4})\over289}
 \sim {16s\over289}\delta^{-2}.                   \tag{6.10}
\]

This isolates the retained failure: the far term is zero and the captured
term has the desired scale.

The structural Toeplitz and multiplier conclusions may be attached
without changing (6.8)--(6.10).  Give the captured line the metric

\[
 \Delta_C={s\over L},\qquad P=L\Delta_C,             \tag{6.11}
\]

and append an orthogonal far line with block `G>0` and zero forcing.  Then
the captured-to-far cross and `mathcal E_F` are exactly zero.  For any
`g>delta_0>0`, choose `M>g` and `G>g`, and put

\[
 T_v=M(P_{\mathcal C}+P_{\mathcal R}),\qquad
 T_a=(B_0\oplus G)-gI+T_v\succ0.                    \tag{6.12}
\]

Thus

\[
 B_0\oplus G=gI+T_a-T_v,                            \tag{6.13}
\]

the dangerous space is `mathcal C direct-sum mathcal R`, and the far line
is safe with floor `G`.  As in the frozen nested-Feshbach barrier,
`T_a` and `T_v` can be realized as compressions of disjoint scalar
multiplier supports by the standard three-piece isometric dilation.
The retained soft line remains multiplier-dangerous, so the safe floor is
irrelevant to (6.9).

The core (6.3)--(6.4) is an exact source-Cauchy matrix.  The orthogonal far
line and multiplier dilation are a structural decoration, not the pinned
Paley--Wiener embedding or the actual von-Mangoldt symbol.  Their logical
role is only to show that the abstract conclusions of the captured,
far-cross, and multiplier theorems do not imply the retained row (0.9).

Finally, taking

\[
 \delta=\sqrt{d_4/d_{12}},\qquad s=d_{12}L          \tag{6.14}
\]

makes `t=d_4L`, while (6.9) still diverges relative to `d_4L`.  This is a
non-implication model, not an arithmetic counterexample.

## 7. Strict stopping point

The proposed inverse-energy replacement is not supplied by the present
Toeplitz, far-cross, or multiplier inputs.  Equation (0.6) gives the exact
reason.  Before the retained estimate is even reached, the separate
anchor-to-far energy and returned captured row must be controlled.  Once
they are controlled, the smallest remaining statement is exactly

\[
 \rho_1\rho_1^*\preceq C d_4L R_1,                  \tag{7.1}
\]

including the range condition when `R_1` is semidefinite.  A full retained
Toeplitz floor is sufficient but stronger than (7.1).

No standard-eight file, source lock, replay output, or formal status file
is changed.

## 8. Reproduction

Run

    python3 -B -m unittest \
      tests.test_lower_ritz_post_far_retained_inverse_row_theorem -v

The regression checks every frozen hash, both Gaussian factorizations,
the strict and semidefinite inverse-row identities, the range/Loewner
equivalence, the exact source-Cauchy split, the multiplier decoration,
displayed TeX, ASCII hygiene, and the fail-closed scope.
