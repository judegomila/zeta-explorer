# Adaptive all-even prefixes eliminate the physical high space but not the signed bridge

## 0. Exact outcome and fail-closed boundary

The all-even coframe theorem has one exact consequence for the direct
prolate--Weil bridge that is stronger than a small-leverage estimate.  After
choosing any finite Fourier cutoff, one may take a sufficiently long finite
prefix of all even zero-integral prolate combinations so that its physical
images span the entire prescribed finite parity space.  For a countable
sequence of finite cutoffs this can be done pointwise, in both parities, and
the larger of the two prefix lengths is a common prefix.  Thus the physical
high complement is exactly zero at every selected finite point.

This observation does **not** prove either shifted-sector positivity or a
decaying shifted-resolvent action.  When the physical high complement is
zero, the leverage/shorted-Schur reduction collapses to the original full
signed low matrix

\[
 B=Q-U I=gI+C-R.                                           \tag{0.1}
\]

Full row span supplies a coordinate system for `B`; it supplies no sign for
that matrix.  Likewise it rewrites, but does not bound,

\[
 T=\|(A-U I)^{-1}b\|.                                     \tag{0.2}
\]

Two exact countermodels below separate these issues.  The first has full row
span and zero physical high complement but `B<0`.  The second satisfies both
strict sector comparisons and has zero physical high complements in both
parities, while `T=1` along every value of the external parameter.
They are finite logical countermodels to an implication between the stated
operator premises; neither is asserted to be an actual prolate--Weil matrix.

The obstruction is logical, not numerical: choosing more source columns
does not change `Q`, `U`, `A`, or `b`.  The all-even theorem also gives no
effective last label, mixes the two residue classes modulo four, and does not
place its prefix inside the growing transition range covered by the existing
source estimates.

The signed-floor part of this conclusion is not new.  Sections 5--7 of
`notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md` already prove that a simultaneous
mixed coframe preserves the inertia of the whole physical signed operator
and give a stronger coupled rational countermodel.  The new content here is
the explicit pointwise diagonalization over an arbitrary preselected
countable `(lambda_j,N_j)` sequence, the exact source-coordinate identity for
the shifted-resolvent action, and an exact model in which both strict sector
comparisons and full source capture hold while the action term in (5.2) stays
constant.  The one-dimensional negative-`B` model below is retained only as
a minimal regression oracle for the already-known signed-floor obstruction.

This note proves no shifted sector floor for the actual Weil matrix, no
bound required by equation (5.2) of `DIRECT_RH_ATTACK.md`, no locally uniform
determinant limit, no Lambda bound, and no statement about the Riemann
hypothesis.  It changes no status, replay, source lock, manifest, or numerical
artifact.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies

The argument is bound to these exact files.

| Dependency | SHA-256 |
|---|---|
| `DIRECT_RH_ATTACK.md` | `b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2` |
| `notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md` | `39147b7fcd5c71304c6977272b72a3f07a789b7c4fb34d2e2ebf51e3b60589f3` |
| `notes/LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR.md` | `c9f10ffb6b6ceeafe8ea63566d10c3af7eb6265c509c8d63e259bc407cc7f79a` |
| `notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md` | `544ce5d2ba527ba9200a64860d977c7191107c88798963591ed960bfa81e527c` |

Only finite-dimensional linear algebra is added here.  In particular, none
of the analytic estimates left open in those dependencies is assumed.

## 2. The pointwise all-even spanning theorem

The simultaneous fixed-`lambda`, fixed-target coframe statement in this
section is already Theorem 3.1 of the mixed-prefix audit.  We record only the
countable-sequence quantifier needed to test the proposed adaptive maneuver.

Fix `lambda` and a finite physical parity space `X`.  Write

\[
 {\cal T}_{\lambda,\sigma}
 =P_XS_\sigma A_\lambda:{\cal F}^{\rm ev}_0\longrightarrow X, \tag{2.1}
\]

where `sigma` is either inversion parity.  The all-even theorem proves that
(2.1) is onto and that the combinations

\[
 c_{2j}=h_{2j}-{I_{2j}\over I_0}h_0,
 \qquad j\geq1,                                           \tag{2.2}
\]

have dense span in the even zero-integral source space.  Since `X` is finite
dimensional, the images of a finite subset span `X`.  Enlarging that subset
to an initial segment shows that there is an integer `M` for which

\[
 W_{\lambda,\sigma,M}
 =\big[ {\cal T}_{\lambda,\sigma}c_2\ \cdots\
         {\cal T}_{\lambda,\sigma}c_{2M}\big],
 \qquad \operatorname {ran}W_{\lambda,\sigma,M}=X.        \tag{2.3}
\]

For the direct bridge, take `X_+` to be the finite even complement of the
projected anchor and `X_-` to be the finite odd sector.  At any fixed
`(lambda,N)`, obtain prefix lengths `M_+` and `M_-` from (2.3) and take

\[
 M=\max(M_+,M_-).                                         \tag{2.4}
\]

The prefix spaces are nested, so the same `M` spans both parity spaces.
Consequently

\[
 K_\sigma=\operatorname {ran}W_{\lambda,\sigma,M}=X_\sigma,
 \qquad H_\sigma=K_\sigma^\perp=\{0\}.                   \tag{2.5}
\]

This argument applies separately at every point of any preselected countable
sequence `(lambda_j,N_j)`.  Choosing the least successful integer, or merely
one successful integer, produces a pointwise sequence `M_j`.  It is an exact
existence statement.  It gives no bound on `M_j`, no algorithm for certifying
the terminal label, and no comparison of `M_j` with the
`O(lambda_j^2)` transition window.

## 3. Inherited signed-floor collapse when the high complement is zero

This section is the physical-short form of the inertia statement already
proved in Sections 5 and 7 of the mixed-prefix audit.  It is included to
separate that inherited obstruction from the new action calculation below.

With `H={0}`, the physical high evaluation density and every quantity
integrated against it vanish:

\[
 \kappa_H=0,\qquad V_H=0,\qquad M_H=0.                    \tag{3.1}
\]

The odd pole surcharge also vanishes because `P_Hp_-=0`.  Hence the
trimmed-mean and high-leverage conditions become vacuous.

Now use the exact split

\[
 B=gI+C-R,\qquad C\succeq0,\quad R\succeq0.              \tag{3.2}
\]

The positive short to `K=X` is simply

\[
 C_{/K}=C.                                                \tag{3.3}
\]

In the feature factorization `R=Y^*Y`, the high feature block is absent, so
`Z=Y_HY_H^*=0`.  The exact high-eliminated negative load is therefore

\[
 Y_K^*(I-Z/g)^{-1}Y_K=Y_K^*Y_K=R.                         \tag{3.4}
\]

Substitution into the low Schur matrix gives

\[
 \boxed{S_K=gI+C-R=B.}                                   \tag{3.5}
\]

Thus exact elimination of the physical high complement does not produce a
new lower comparison.  It removes one geometric obligation and leaves the
original signed-sector obligation unchanged.

## 4. Exact pullback equivalence

Let `W:F->X` be any onto map between finite-dimensional Hilbert spaces.  Put

\[
 P_0=1_{(\ker W)^\perp},\qquad W_0=W|_{(\ker W)^\perp}.    \tag{4.1}
\]

Then `W_0:(ker W)^perp->X` is bijective.  For every Hermitian operator `B`
on `X`, congruence by this bijection gives

\[
 \boxed{B\succ0\quad\Longleftrightarrow\quad
 P_0W^*BWP_0\succ0\text{ on }(\ker W)^\perp.}            \tag{4.2}
\]

There is also an exact metric form.  Since `W` is onto, define

\[
 \Delta=(WW^*)^{-1}.                                     \tag{4.3}
\]

For `x=W_0y`, one has

\[
 \langle x,\Delta x\rangle=\|y\|^2.                     \tag{4.4}
\]

Consequently, for every real `mu`,

\[
 \boxed{B\succeq\mu\Delta
 \quad\Longleftrightarrow\quad
 P_0W^*BWP_0\succeq\mu P_0.}                             \tag{4.5}
\]

The all-even theorem proves the premise needed to define the left side of
(4.3), namely `WW^*>0`.  It gives no sign or reserve in (4.2)--(4.5).  These
floor equivalences are the unweighted form of equations (5.5)--(5.9) in the
mixed-prefix audit; their role here is to fix notation for the genuinely new
action identity (6.5).

## 5. Minimal regression oracle for the inherited signed obstruction

Take the one-dimensional real space `X=R` and the onto synthesis

\[
 W=[1].                                                   \tag{5.1}
\]

Thus `K=X`, `H={0}`, and every high-complement statistic in (3.1) vanishes.
Choose

\[
 g=1,\qquad C=0,\qquad R=2.                              \tag{5.2}
\]

Both `C` and `R` are positive semidefinite, but

\[
 \boxed{B=g+C-R=-1<0.}                                   \tag{5.3}
\]

The pulled-back matrix is the same negative scalar.  This is only the
one-dimensional sanity check for the previously proved inertia obstruction;
the mixed-prefix audit's Section 6 contains the stronger coupled rational
model with positive diagonal family comparisons.

## 6. Exact source-coordinate formula for the shifted solve

Relative to the projected anchor `kappa` and its even complement `X`, write

\[
 Q_+=\begin{bmatrix}q&b^*\\ b&A\end{bmatrix},
 \qquad L=A-U I\succ0.                                   \tag{6.1}
\]

The shifted-resolvent quantity is

\[
 T=\|L^{-1}b\|.                                          \tag{6.2}
\]

Let `W:F->X` be onto and use the bijection `W_0` from (4.1).  Define

\[
 G=W_0^*W_0,\qquad L_s=W_0^*LW_0,
 \qquad b_s=W_0^*b.                                      \tag{6.3}
\]

If `y=L_s^{-1}b_s`, then

\[
 W_0^*(LW_0y-b)=0.                                       \tag{6.4}
\]

The adjoint of the bijection `W_0` is injective, so
`W_0y=L^{-1}b`.  Therefore

\[
 \boxed{T^2=b_s^*L_s^{-1}G L_s^{-1}b_s.}                 \tag{6.5}
\]

Equivalently, by substituting `z=Lv`,

\[
 \boxed{T=\sup_{v\neq0}{|\langle b,v\rangle|\over\|Lv\|}.}
                                                                  \tag{6.6}
\]

Equations (6.5)--(6.6) show exactly what full source span does: it supplies
coordinates for the solve.  Rank alone bounds none of `L_s^{-1}`, `b_s`, or
their oriented combination in (6.5).

## 7. Strict shifted sectors with a nondecaying action

The failure of a rate persists even when the two strict sector comparisons
already hold.  For every value of an external parameter `lambda`, take

\[
 Q_+=\begin{bmatrix}1&1\\1&1\end{bmatrix},
 \qquad \kappa=e_1.                                      \tag{7.1}
\]

In the block notation (6.1),

\[
 q=1,\qquad b=1,\qquad A=1.                              \tag{7.2}
\]

The mandatory two-vector Ritz space is the entire two-dimensional space.
The eigenvalues of `Q_+` are `0` and `2`, so its lower Ritz value is

\[
 u=0.                                                     \tag{7.3}
\]

Take the certified shift `U=0`.  Then the even-complement floor satisfies

\[
 \alpha-U=1>0.                                           \tag{7.4}
\]

Take the odd sector to be the one-dimensional matrix

\[
 Q_-=[2],\qquad \omega-U=2>0.                            \tag{7.5}
\]

Thus both strict comparisons required in (4.14) of `DIRECT_RH_ATTACK.md`
hold.  Let a one-column source prefix span the even complement and another
one-column prefix span the odd sector.  Both physical high complements are
zero.  Nevertheless,

\[
 \boxed{T=|(1-0)^{-1}1|=1}                               \tag{7.6}
\]

for every `lambda`.

This model is compatible with the positive/negative split.  If

\[
 P_+={1\over2}\begin{bmatrix}1&1\\1&1\end{bmatrix},
 \qquad
 P_-={1\over2}\begin{bmatrix}1&-1\\-1&1\end{bmatrix},  \tag{7.7}
\]

then `P_+,P_-` are orthogonal positive projectors and

\[
 Q_+=I+P_+-P_-.                                          \tag{7.8}
\]

Hence (7.1) has the form (3.2) with `g=1`, `C=P_+`, and `R=P_-`.

The chordal bound in the direct bridge is also constant:

\[
 D(T)=\sqrt{2-{2\over\sqrt{1+T^2}}}
     =\sqrt{2-\sqrt2}>0.                                 \tag{7.9}
\]

Even granting zero projection error and projected-state norm one, the
weighted expression in (5.2) at `eta=0` contains
`sqrt(log(lambda))*D(1)` and cannot tend to zero.  Full span and strict
sector comparisons therefore do not imply the required action rate.

## 8. The adaptive-prefix quantifier does not select a good cutoff

The coframe theorem has the pointwise form

\[
 \forall(\lambda,N)\ \exists M:\quad
 \operatorname {ran}W_{\lambda,N,M}=X_{\lambda,N}.        \tag{8.1}
\]

For fixed `(lambda,N)`, however, the matrices `Q`, `A`, the shift `U`, and
the residual `b` do not depend on `M`.  Thus (8.1) cannot imply that there is
an `N` for which the shifted matrices are positive or (6.2) is small.  The
constant families (5.1)--(5.3) and (7.1)--(7.6) can be repeated for every
`N` while (8.1) remains true.

There is a second, analytic mismatch.  The existence proof supplies no
upper bound for `M(lambda,N)`.  Its prefix may extend beyond every source
window for which the current transition sampling and exterior-defect bounds
have been proved.  In addition, the prefix in (2.2) mixes labels congruent to
zero and two modulo four, whereas the existing split-block estimates keep
those prescribed families separate.  Taking `M` adaptively therefore does
not import the signed source estimates required for (4.2) or (6.5).

## 9. Exact remaining conditions

After the maneuver (2.3)--(2.5), the physical high-space problem is gone.
The two remaining obligations are unchanged and can be stated without any
eigenspace choice.

For each parity, shifted positivity is exactly the pullback condition

\[
 \boxed{P_0W^*(Q-U I)WP_0\succ0}                           \tag{9.1}
\]

on the kernel-free source coordinates.  By (4.2), this is equivalent to the
original physical shifted-sector positivity; it is not a consequence of
full span.

For the even residual solve, the strong target `T=O(lambda^{-1/2})` is
exactly

\[
 \boxed{b_s^*L_s^{-1}G L_s^{-1}b_s=O(\lambda^{-1}).}       \tag{9.2}
\]

For the weaker operative bridge one must instead insert the square root of
(6.5) into `D(T)` and prove the weighted limit (5.2).  Neither (9.1) nor
(9.2) follows from the all-even rank theorem.  Proving a signed source
pullback reserve and an oriented residual-action estimate on the same
explicit schedule remains necessary.
