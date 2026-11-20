# Fixed-capture / multiplier-danger nested Feshbach barrier

## 0. Exact result and fail-closed boundary

Work sectorwise at one finite locked parameter.  Let

\[
 B_+=P_{\kappa^\perp}(Q_+-U I)P_{\kappa^\perp},
 \qquad B_-=Q_--U I,                                  \tag{0.1}
\]

where the intended application is `U=U_Z`.  The complete multiplier
construction supplies an orthogonal dangerous/safe split

\[
 K_\epsilon=Y_\epsilon\oplus F_\epsilon,
 \qquad P_{F_\epsilon}B_\epsilon P_{F_\epsilon}
       \succeq\delta I.                               \tag{0.2}
\]

Checkpoint 1.22 separately supplies a positive compression on every fixed
captured source block `C_(epsilon,m)`.  These two statements cannot simply
be concatenated.  After safe elimination, the captured block acquires the
full safe Schur return, and its physical positivity does not imply positivity
of its harmonic shadow.

This note proves the exact two-level reduction.  For the pencil

\[
 T_{\epsilon,\theta}=B_\epsilon-\theta\Delta_\epsilon, \tag{0.3}
\]

first eliminate `F_epsilon`.  Project the fixed captured block into the
resulting dangerous coordinate, eliminate that harmonic shadow only when its
returned pivot is positive, and call the remaining dangerous coordinate
`U_(epsilon,m)`.  The smallest exact operator then is

\[
 \boxed{
 \mathcal K_{\epsilon,m,\theta}
 =R_{\epsilon,m,\theta}
 -X_{\epsilon,m,\theta}
  A_{\epsilon,m,\theta}^{-1}
  X_{\epsilon,m,\theta}^*.}                           \tag{0.4}
\]

All safe, captured, cross, and metric returns are present in (0.4).  Under
the two displayed positive pivots,

\[
 \boxed{
 T_{\epsilon,\theta}\succeq0
 \quad\Longleftrightarrow\quad
 \mathcal K_{\epsilon,m,\theta}\succeq0.}           \tag{0.5}
\]

The generalized range version is recorded below.  Crucially, checkpoint
1.22 does **not** prove that the harmonic captured pivot in (0.4) is
positive.  Consequently it does not yet reduce the exact multiplier
Feshbach operator to the uncaptured dangerous complement.  Unconditionally,
the smallest proved exact carrier remains the whole dangerous Schur operator
from the multiplier theorem.

An exact rational family below has all of the following simultaneously:

- the source-Cauchy off-diagonal identity;
- an exact compressed positive/negative-part multiplier decomposition;
- the multiplier spectral dangerous projector and a strict safe floor;
- a strictly positive captured compression;
- a negative harmonic captured pivot, or, in a second member, a positive
  harmonic pivot followed by a negative uncaptured short.

Thus phase support separation, source commutator rank, the safe floor, and
fixed captured positivity do not imply (0.4).  The family is structural.  It
is not the pinned von-Mangoldt multiplier and makes no assertion that the
actual arithmetic short is negative.

For the actual operator, one new cancellation-preserving inequality which
would suffice is the relative positive/negative multiplier angle in Section
5.  No frozen theorem proves it.  The paired `U_Z` version is RH-strength by
the existing widening-core theorem.  A genuinely weaker sector premise is
the lower two-vector Ritz shift; its exact one-vector response target toward
equation (5.2) of `DIRECT_RH_ATTACK.md` is isolated in Section 6.

No sector sign, source angle, equation (5.2), determinant limit, zero
statement, or Riemann-hypothesis conclusion is proved.  The formal state
remains `P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following repository bytes are used.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md` | `cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e` |
| `notes/GROWING_MIXED_BRIDGE_RETAINED_COMPLEMENT_TWO_STAGE_SCHUR_BARRIER.md` | `102f69ec567803153d5648316874c8369cd558ee17cfce71f3cca2e9bb259f81` |
| `notes/GROWING_SIGNED_DISCREPANCY_CENTERED_ZERO_KREIN_FACTORIZATION_BARRIER.md` | `0257bb5582700fada40fc2a6c6ba578a09fad94e11eb4fa0f72a525c80bd04c9` |
| `notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md` | `04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83` |
| `notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md` | `3efbbf5cd0888d2a645b11c73b625007bf38bf010881d5e0c9d8ecbc964fb1a6` |
| `DIRECT_RH_ATTACK.md` | `b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2` |
| `src/weil_matrix.py` | `9a6f7b4d8ef7a7f5d12445f61cce2cb23ec44625f63981e829d7286c4e856902` |
| `src/parity_multiplier_schur.py` | `63d1e2aa0616d36c6036ba44de618777f514237c627e43d58175a7ece4d47013` |

The first note fixes the actual multiplier dangerous spaces and their safe
floor.  The second fixes the captured/bridge/retained Schur bookkeeping.
The third fixes the centered zero/Krein orientation and the RH-strength of
the paired `U_Z` target.  Checkpoint 1.22 fixes only physical compressions on
fixed source spans.  The Ritz note and `DIRECT_RH_ATTACK.md` fix the weaker
lower-shift response route.  The source modules fix the inclusive prime-power
inventory, source-Cauchy convention, and multiplier signs.

## 2. Exact double Feshbach operator

Suppress `epsilon` temporarily.  Let `Delta>0` be the declared physical
metric and suppose that the safe compression of

\[
 T_\theta=B-\theta\Delta
\]

is positive.  Relative to `K=Y direct-sum F`, write

\[
 T_\theta=
 \begin{pmatrix}D_\theta&\Gamma_\theta^*\\
                 \Gamma_\theta&H_\theta\end{pmatrix},
 \qquad H_\theta\succ0.                              \tag{2.1}
\]

At `theta=0`, the multiplier theorem gives `H_0>=delta I`.  For positive
`theta`, the sufficient condition from the frozen theorem is
`theta C_(Delta,F)<delta`; no such positive angle is assumed here.

Define the exact safe harmonic lift and short

\[
 E_\theta y=
 \binom{y}{-H_\theta^{-1}\Gamma_\theta y},
 \qquad
 \Sigma_\theta
 =D_\theta-\Gamma_\theta^*H_\theta^{-1}\Gamma_\theta.
                                                               \tag{2.2}
\]

Let `C_m` be the fixed physical captured source range and define its
dangerous coordinate shadow

\[
 W_m=\operatorname {Ran}(P_Yi_{C_m}),
 \qquad U_m=Y\ominus W_m.                             \tag{2.3}
\]

This definition loses no dangerous coordinate belonging to the physical
captured range.  Relative to `Y=W_m direct-sum U_m`, write

\[
 \Sigma_\theta=
 \begin{pmatrix}A_{m,\theta}&X_{m,\theta}^*\\
                 X_{m,\theta}&R_{m,\theta}
 \end{pmatrix}.                                      \tag{2.4}
\]

If `A_(m,theta)>0`, set

\[
 G_{m,\theta}u
 =E_\theta\binom{-A_{m,\theta}^{-1}
                         X_{m,\theta}^*u}{u}.         \tag{2.5}
\]

Two exact Gaussian congruences give

\[
 \boxed{
 G_{m,\theta}^*T_\theta G_{m,\theta}
 =R_{m,\theta}-X_{m,\theta}A_{m,\theta}^{-1}
                         X_{m,\theta}^*
 =\mathcal K_{m,\theta}.}                            \tag{2.6}
\]

They also prove

\[
 T_\theta\ \sim_{\rm cong}\
 H_\theta\oplus A_{m,\theta}\oplus
 \mathcal K_{m,\theta}.                              \tag{2.7}
\]

Equations (2.6)--(2.7) prove (0.4)--(0.5).  They also show why no metric may
be inserted after the reductions: `H_theta`, `E_theta`, `Sigma_theta`,
`A_(m,theta)`, and `G_(m,theta)` all depend on the complete pencil
`B-theta Delta`.  The final pulled metric is nevertheless exact:

\[
 \Delta_{U,m,\theta}=G_{m,\theta}^*\Delta G_{m,\theta}>0. \tag{2.8}
\]

If the harmonic pivot is only semidefinite, the exact non-strict criterion
is

\[
 \boxed{
 \begin{aligned}
 \Sigma_\theta\succeq0\quad\Longleftrightarrow\quad
 &A_{m,\theta}\succeq0,\\
 &\operatorname {ran}X_{m,\theta}^*
       \subseteq\operatorname {ran}A_{m,\theta},\\
 &R_{m,\theta}-X_{m,\theta}A_{m,\theta}^\dagger
                      X_{m,\theta}^*\succeq0.
 \end{aligned}}                                      \tag{2.9}
\]

Together with `H_theta>0`, (2.9) is necessary and sufficient for
`T_theta>=0`.  The range condition is part of the theorem.

## 3. Why physical captured positivity is not the pivot

Let `J=P_Yi_(C_m)` and write the physical captured inclusion as

\[
 i_{C_m}c=Jc+fc,
 \qquad
 Zc=fc+H_0^{-1}\Gamma_0Jc.                           \tag{3.1}
\]

Completing the safe square gives the exact identity

\[
 \boxed{
 i_{C_m}^*Bi_{C_m}
 =J^*\Sigma_0J+Z^*H_0Z.}                             \tag{3.2}
\]

Checkpoint 1.22 proves positivity of the left side on every fixed captured
block.  The second term on the right is positive and is the nonharmonic safe
excess.  It can mask an arbitrarily negative harmonic term.  Therefore

\[
 i_{C_m}^*Bi_{C_m}\succ0
 \quad\not\Longrightarrow\quad
 A_{m,0}\succ0.                                      \tag{3.3}
\]

The genuinely new first inequality needed to use the fixed block after the
multiplier reduction is a **harmonic capture floor**, for example

\[
 \boxed{P_{W_m}\Sigma_0P_{W_m}\succeq a_m M_{W_m},
        \qquad a_m>0,}                               \tag{3.4}
\]

in the desired physical metric `M_(W_m)`.  Equivalently, one may prove on
the source coefficients that the captured floor exceeds the exact excess
`Z^*H_0Z`.  No fixed-depth asymptotic in checkpoint 1.22 estimates that
excess.

Even (3.4) is not the final sign.  It merely licenses the second Feshbach
step; the remaining necessary and sufficient operator is (0.4).

## 4. Exact source-Cauchy / multiplier countermodels

Use the ordered basis `(c,u,f)`, identified with three consecutive source
modes `(-1,0,1)`.  For `a=3` or `a=6`, put

\[
 B(a)=
 \begin{pmatrix}
 a&2&2\\2&-1&2\\2&2&1
 \end{pmatrix},
 \qquad g=1,
 \qquad\delta={1\over10},                            \tag{4.1}
\]

\[
 T_v=\operatorname {diag}\left(20,20,{4\over5}\right),
 \qquad T_a(a)=B(a)-I+T_v.                           \tag{4.2}
\]

For `a=3`, the leading principal minors of `T_a` are

\[
 22,\qquad392,\qquad{848\over5};                     \tag{4.3}
\]

for `a=6`, they are

\[
 25,\qquad446,\qquad{1004\over5}.                    \tag{4.4}
\]

Thus `T_a(a)>0` and

\[
 \boxed{B(a)=gI+T_a(a)-T_v.}                         \tag{4.5}
\]

Nonzero parity poles can be retained as well.  With `p=c`, the even identity
uses `T_(a,+)=T_a-2|p><p|`, whose leading minors stay positive, while the odd
identity uses `T_(a,-)=T_a+2|p><p|`.  Hence

\[
 B(a)=gI+T_{a,+}-T_v+2|p\rangle\langle p|
     =gI+T_{a,-}-T_v-2|p\rangle\langle p|.           \tag{4.6}
\]

The threshold is `g-delta=9/10`.  Therefore

\[
 Y=\operatorname {span}\{c,u\},
 \qquad F=\operatorname {span}\{f\},
 \qquad H=B(a)|_F=1\geq\delta.                       \tag{4.7}
\]

The captured space `C=span{c}` has the strictly positive physical
compression `a`.  Safe elimination gives

\[
 \boxed{
 \Sigma(a)=
 \begin{pmatrix}a-4&-2\\-2&-5\end{pmatrix}.}        \tag{4.8}
\]

For `a=3`, the harmonic captured pivot is `-1`, proving (3.3).  For `a=6`,
the harmonic captured pivot is positive, but the exact uncaptured short is

\[
 \boxed{-5-(-2)^2/2=-7<0.}                           \tag{4.9}
\]

Thus even a separately proved harmonic capture floor would leave (0.4) as
a genuine signed obligation.

The numerical values `3` and `6` are only rational regressions.  The same
construction has an arbitrary prescribed captured scale.  Replace `a` by
any `a_lambda>0`, the common off-diagonal `2` by `gamma_lambda`, and the
safe diagonal `1` by `h_lambda>delta`.  The returned captured pivot is

\[
 a_\lambda-{\gamma_\lambda^2\over h_\lambda}.        \tag{4.9a}
\]

Choosing `gamma_lambda^2>a_lambda h_lambda` reverses that pivot at any
specified checkpoint-1.22 singleton scale.  Choosing the opposite strict
inequality licenses the pivot, after which the free uncaptured diagonal can
make the second short negative.  The dangerous diagonals of `T_v` may then
be increased until `T_a>0`, without changing `B` or the fixed captured
compression.  Thus the obstruction is not tied to an order-one captured
floor.  A growing direct family can place the adverse coordinate beyond
every prescribed fixed source depth, so fixed-depth eventual positivity
does not supply growing-depth exhaustion.

These matrices obey the exact source-Cauchy identity.  Put

\[
 b_n=2n\qquad(n=-1,0,1).
\]

Then for every `n!=m`,

\[
 {b_n-b_m\over n-m}=2=B(a)_{nm}.                    \tag{4.10}
\]

The diagonal coefficients remain free in the source-Cauchy theorem, so
(4.10) also gives its rank-two commutator exactly.

Finally, (4.5) can be realized by an exact scalar positive/negative-part
multiplier, not merely by two unrelated positive matrices.  For any
`M>||T_a+T_v||`, put

\[
 R_0=I-{T_a+T_v\over M}>0
\]

and define the isometry into three mutually orthogonal phase pieces

\[
 Cx=\left(M^{-1/2}T_a^{1/2}x,
          M^{-1/2}T_v^{1/2}x,
          R_0^{1/2}x\right).                         \tag{4.11}
\]

Let the scalar multiplier equal `g+M`, `g-M`, and `g` on those three
pieces.  Its positive and negative parts relative to `g` compress exactly
to `T_a` and `T_v`.  Their phase supports are disjoint.  Nevertheless the
captured harmonic pivot and the uncaptured short fail as above.

The dilation (4.11) is not asserted to be the actual Paley--Wiener
zero-extension Fourier embedding, and the scalar values are not the actual
von-Mangoldt symbol.  Its precise logical role is to show that positive and
negative phase separation, source-Cauchy displacement, fixed captured
positivity, and the safe spectral projector are insufficient abstract data.
Any successful proof must use additional actual-symbol/Paley--Wiener
orientation.

## 5. One sufficient actual phase-angle inequality

For the actual complete shifted sector, keep the multiplier pieces combined
as

\[
 B_\epsilon=P_\epsilon-N_\epsilon,                  \tag{5.1}
\]

where

\[
 \begin{aligned}
 P_+&=gI+T_a+2|p_+\rangle\langle p_+|,&N_+&=T_v,\\
 P_-&=gI+T_a,&N_-&=T_v+2|p_-\rangle\langle p_-|.
 \end{aligned}                                      \tag{5.2}
\]

Every prime power through `lambda^2` and the boundary alias remain inside
the same actual scalar symbol used to define `T_a-T_v`; no `O(lambda)`
piece is estimated separately.

Assume the two pivots needed to define the combined lift `G_(epsilon,m,0)`
in (2.5).  A single genuinely new sufficient inequality is

\[
 \boxed{
 G_{\epsilon,m,0}^*N_\epsilon G_{\epsilon,m,0}
 \preceq(1-\rho)
 G_{\epsilon,m,0}^*P_\epsilon G_{\epsilon,m,0},
 \qquad\rho>0.}                                      \tag{5.3}
\]

Indeed, (2.6) and (5.1) give

\[
 \mathcal K_{\epsilon,m,0}
 \succeq\rho G_{\epsilon,m,0}^*P_\epsilon
                   G_{\epsilon,m,0}
 \succeq\rho g I_{U_{\epsilon,m}},                  \tag{5.4}
\]

because the `U_(epsilon,m)` coordinate of the combined lift is the identity.
For a positive source angle, the exact sufficient version is

\[
 G_{\epsilon,m,\theta}^*(N_\epsilon+\theta\Delta_\epsilon)
 G_{\epsilon,m,\theta}
 \preceq(1-\rho)
 G_{\epsilon,m,\theta}^*P_\epsilon
 G_{\epsilon,m,\theta}.                              \tag{5.5}
\]

Equations (5.3)--(5.5) are relative compressed phase-angle inequalities,
not separate magnitude bounds.  They include both Schur returns through
`G`.  Current phase volume gives only the rank of `Y`; it gives no relative
angle on `U`.  The source commutator leaves arbitrary diagonal coefficients,
as (4.10) demonstrates.  Disjoint multiplier supports also do not imply
orthogonal compressed ranges, as (4.11) demonstrates.  Finally, the exact
centered-zero factorization shows that a paired proof of (5.3) along the
`U_Z` schedule is already an RH-strength signed-arithmetic theorem.

## 6. Strictly weaker lower-Ritz one-vector route

The `U_Z` whole-sector signs are not required merely to obtain the weighted
ground approximation in equation (5.2) of `DIRECT_RH_ATTACK.md`.  Write

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix},
 \qquad r=\|b\|,
\]

and let `u_R` be the lower Ritz value of the compression to
`span{kappa,b/r}`.  A strictly weaker finite sector premise is

\[
 \boxed{A-u_RI\succ0,
        \qquad Q_--u_RI\succ0.}                      \tag{6.1}
\]

It is weaker because `u_R<=q<=U_Z`.  For example,

\[
 \begin{pmatrix}q&r\\r&c\end{pmatrix}
 =\begin{pmatrix}3&2\\2&0\end{pmatrix}
\]

has `u_R=-1`.  Taking the odd block equal to zero makes both signs in (6.1)
strict, while both corresponding `q`-shifted signs fail.

Under (6.1), the narrow one-vector response is

\[
 T_R=\|(A-u_RI)^{-1}b\|.                              \tag{6.2}
\]

The already proved projection rate, bounded projected-anchor norm, and
`D(T)<=T` from the weighted sector bridge show that

\[
 \boxed{T_R=O\!\left(\lambda^{-1/2}
                 \operatorname {polylog}\lambda\right)}       \tag{6.3}
\]

is sufficient for equation (5.2) for every fixed strip height
`eta<1/2`.  This asks for one resolvent vector, not a uniform inverse norm,
not the full dangerous-space inf--sup, and not the source-angle inequality
(5.3).

The frozen Ritz self-regularization theorem gives the more source-positive,
but stronger, sufficient condition

\[
 \sqrt L\,\lambda^\eta
 \left\{
 A_R\!\left({q-u_R\over r}\right)
 r\operatorname {tr}(A-u_RI+rI)^{-1}
 \right\}^{1/2}\longrightarrow0                    \tag{6.4}
\]

for every `eta<1/2`.  Neither (6.3) nor (6.4) is currently proved on the
actual schedule.  While the lower-shift sector premise is genuinely weaker
than the `q`/`U_Z` premise, completing it together with the response rate and
the existing determinant bridge would of course still be an RH proof.

## 7. Exact stopping line

Checkpoint 1.22 proves physical fixed-block positivity but not the harmonic
capture floor (3.4).  Without (3.4), the fixed source blocks cannot legally
be removed from the multiplier-dangerous Feshbach operator.  With (3.4),
the remaining exact sign is (0.4), and the structural model (4.9) shows that
it is independent information.

Phase localization has the wrong one-sided datum on the dangerous space:
the spectral definition gives a lower bound on the deficit energy, whereas
positivity needs an upper comparison with the complete positive part.
Source-Cauchy commutators do not control the free diagonal.  Compression also
destroys orthogonality of disjoint multiplier supports.  These three facts
rule out a lower bound from the currently frozen structural inputs.

The two honest next options are therefore:

1. prove the actual relative phase-angle inequality (5.3), with every Schur
   return and the complete signed symbol retained; or
2. avoid the RH-equivalent `U_Z` gate and prove the lower-Ritz signs (6.1)
   together with the one-vector rate (6.3), or the sufficient positive
   response (6.4).

Neither option is discharged here.

## 8. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_fixed_capture_multiplier_danger_nested_feshbach_barrier -v

The regression checks every frozen hash, the two exact Schur congruences,
the harmonic-capture identity, both rational countermodels, source-Cauchy
off-diagonals, multiplier and parity-pole decompositions, dangerous/safe
thresholds, the phase-angle implication, the lower-Ritz strictness example,
displayed TeX, ASCII hygiene, and the fail-closed scope.
