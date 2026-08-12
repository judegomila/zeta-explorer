# Growing mixed-bridge retained-complement two-stage Schur barrier

## 0. Outcome and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad L=2\log\lambda,\qquad
 N=2^{9600\lambda^2},\qquad
 R=\sqrt N=2^{4800\lambda^2},\qquad Q\leq C_0L.       \tag{0.1}
\]

The strict-PASS coherent mixed-bridge theorem proves a positive floor on
the finite captured parity cap plus the one endpoint-sheared bridge.  The
half-power theorem separately proves a positive far block and closes the
captured-to-far cross.  This note records exactly what follows when those
two results are inserted into the retained Schur problem.

Let `K_0` denote the full finite captured parity cap after the same metric
whitening and shears, let `b` be the normalized coherent bridge coordinate,
and let `mathcal R_Q` be the remaining retained space.  After every already
proved far elimination, absorb the candidate metric subtraction into the
Hermitian operator `T_theta` and write

\[
 T_\theta=
 \begin{bmatrix}
  A_\theta&r_\theta^*&X_\theta^*\\
  r_\theta&q_\theta&y_\theta^*\\
  X_\theta&y_\theta&R_\theta
 \end{bmatrix}
 \quad\hbox{on}\quad
 K_0\oplus\mathbb Cb\oplus\mathcal R_Q.              \tag{0.2}
\]

The already-proved finite mixed floor controls `A_theta`, `q_theta`, and
`r_theta` for every candidate `theta` lying below that floor.  It does not
control `X_theta`, `y_theta`, or `R_theta`.  If

\[
 A_\theta\succ0,\qquad
 q_{1,\theta}:=q_\theta-r_\theta A_\theta^{-1}
                         r_\theta^*>0,                 \tag{0.3}
\]

then the exact remaining condition is

\[
 \boxed{
 S_{\mathcal R,\theta}:=
 R_\theta-X_\theta A_\theta^{-1}X_\theta^*
 -\bigl(y_\theta-X_\theta A_\theta^{-1}r_\theta^*\bigr)
 q_{1,\theta}^{-1}
 \bigl(y_\theta^*-r_\theta A_\theta^{-1}X_\theta^*\bigr)
 \succeq0.}                                           \tag{0.4}
\]

Thus the captured pivot costs `1/L`, while the bridge pivot costs a fixed
constant.  Neither cost disappears.  The earliest missing retained theorem
is (0.4), or sufficient relative estimates for its three unproved blocks.

The finite cap cannot exhaust the retained space.  The raw half-power low
Fourier window contributes at least `R` dimensions to the retained space,
whereas the captured cap and bridge have only `O(L)` dimensions.  Hence

\[
 \boxed{
 \dim\mathcal R_Q
 \geq R-\dim K_0-1
 =R-O(L)\sim R.}                                      \tag{0.5}
\]

An exact `N=2` source-Cauchy family below has a conductor-size captured
compression, a positive constant bridge compression, a positive high block
of arbitrary size, and nevertheless a negative retained short.  It proves
that the listed block floors and the source-Cauchy identity do not imply
(0.4).  It is a logical countermodel only.  It does **not** prove that the
genuine arithmetic retained short is negative or that the desired genuine
arithmetic theorem is false.

No retained sign, complete sector sign, source-angle theorem, determinant
limit, zero statement, or Riemann-hypothesis conclusion is proved.  No
standard-eight file is changed.  The formal project state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

The following exact bytes are the only repository theorems imported here.
The first pair is the strict-PASS coherent bridge pair.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md` | `43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2` |
| `tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py` | `95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a` |
| `notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md` | `1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032` |
| `tests/test_growing_low_prefix_physical_coframe_half_power_schur_barrier.py` | `e31ae1d17c4d0df595b022d74ea6b8894ad45588d9693a1c7a318aa2874212aa` |
| `notes/GROWING_LOW_PREFIX_HALF_POWER_FAR_CROSS_THEOREM.md` | `c0428b5c0ab43719b8e82b24ff21f7c40ebfde978ddb8d4185f92abb633ab55f` |
| `tests/test_growing_low_prefix_half_power_far_cross_theorem.py` | `be358852f5f5749e25aca722a18cfb081b8c36bab7aeed74343b624d49ef0569` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `tests/test_high_fourier_coercivity.py` | `64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae` |

The coherent pair fixes the bridge normalization and the captured bridge
row.  The physical-coframe barrier fixes the retained space and its exact
generalized Schur obligation.  The far-cross theorem closes only the
captured-to-far row.  The high-Fourier theorem fixes the complete source
Cauchy convention used in the finite countermodel.

## 2. What the coherent bridge floor actually supplies

In captured/bridge coordinates, the strict-PASS theorem gives

\[
 \widehat\Sigma_{N,{\rm mix},Q}^{\#}
 =\begin{bmatrix}
   \widehat\Sigma_{N,C,Q}^{\#}&r_Q^*\\
   r_Q&q_{bb}
  \end{bmatrix},
 \qquad
 \widehat\Sigma_{N,C,Q}^{\#}\succeq{L\over8}D_{C,Q}. \tag{2.1}
\]

With the bridge coordinate normalized by `lambda^(-1)` as in that theorem,

\[
 a_\lambda={L\over8},\qquad
 b_\lambda=\lambda q_{bb}\longrightarrow{C_\xi\over\sqrt2},
 \qquad
 e_\lambda^2=\lambda\|r_QD_{C,Q}^{-1/2}\|^2=o(L).   \tag{2.2}
\]

Therefore captured elimination erodes the normalized bridge diagonal by

\[
 {e_\lambda^2\over a_\lambda}=o(1),                  \tag{2.3}
\]

and the coherent theorem supplies a fixed positive bridge pivot after a
fixed safety margin is reserved.  Conversely bridge elimination erodes the
captured block by `o(L)`.  These are the two finite scales and no more.

For a candidate `theta` strictly below the frozen mixed floor, all metric
crosses are already included in `T_theta`.  The finite theorem then permits
constants `c_A,c_b>0`, independent of the growing schedule, such that

\[
 A_\theta\succeq c_AL I_{K_0},\qquad
 q_{1,\theta}\geq c_b.                               \tag{2.4}
\]

Equation (2.4) concerns the finite cap plus bridge.  It is not a statement
on `mathcal R_Q`, and positive compression does not make `K_0 direct-sum Cb`
a reducing subspace.

## 3. Exact two-stage Schur factorization

Suppress `theta` temporarily and put

\[
 q_1=q-rA^{-1}r^*,\qquad
 y_1=y-XA^{-1}r^*,\qquad
 R_1=R-XA^{-1}X^*.                                    \tag{3.1}
\]

The first block Gaussian congruence gives

\[
 T\ \sim_{\rm cong}\
 A\oplus
 \begin{bmatrix}q_1&y_1^*\\y_1&R_1\end{bmatrix}.    \tag{3.2}
\]

If `A` and `q_1` are positive, the second congruence gives

\[
 \boxed{
 T\ \sim_{\rm cong}\
 A\oplus q_1\oplus
 \bigl(R_1-y_1q_1^{-1}y_1^*\bigr).}                  \tag{3.3}
\]

Restoring `theta`, equations (3.1)--(3.3) prove

\[
 \boxed{
 T_\theta\succeq0
 \quad\Longleftrightarrow\quad
 S_{\mathcal R,\theta}\succeq0}                     \tag{3.4}
\]

under (0.3).  The same equivalence holds with strict inequalities.

The scale-correct sufficient comparison is not an unweighted entry bound.
It is exactly

\[
 R_\theta\succeq
 X_\theta A_\theta^{-1}X_\theta^*
 +y_{1,\theta}q_{1,\theta}^{-1}y_{1,\theta}^*,
 \qquad
 y_{1,\theta}=y_\theta-X_\theta A_\theta^{-1}r_\theta^*.
                                                               \tag{3.5}
\]

The proved pivots yield only

\[
 X_\theta A_\theta^{-1}X_\theta^*
 \preceq{1\over c_AL}X_\theta X_\theta^*,
 \qquad
 y_{1,\theta}q_{1,\theta}^{-1}y_{1,\theta}^*
 \preceq{1\over c_b}y_{1,\theta}y_{1,\theta}^*.      \tag{3.6}
\]

Thus the cap pivot pays `1/L`, but the bridge pivot pays `O(1)`.  No
current theorem proves that the right side of (3.5) is dominated by
`R_theta`.

If one instead starts with a merely semidefinite `R_1`, the equivalent
generalized Schur statement is

\[
 R_1\succeq0,\qquad
 \operatorname {ran}y_1\subseteq\operatorname {ran}R_1,
 \qquad
 q_1-y_1^*R_1^\dagger y_1\geq0.                      \tag{3.7}
\]

The range condition in (3.7) is part of the theorem; it cannot be inferred
from a trace or an average floor.

## 4. No exhaustion of the half-power retained space

At the locked half-power split, let `P_<=R^+` be the raw even Fourier
projection.  The raw low space has dimension `R+1`.  Intersecting with the
one anchor orthogonal complement loses at most one dimension, so

\[
 \dim\bigl(\operatorname {ran}P_{\leq R}^+
                 \cap\kappa^\perp\bigr)\geq R.        \tag{4.1}
\]

The allowed far space lies inside the raw high window.  Consequently the
space in (4.1) remains in the retained side `Y`.  The captured parity cap
has dimension `O(Q)=O(L)` and adjoining the coherent bridge adds only one
coordinate.  Orthogonalizing these finite coordinates inside `Y` therefore
leaves

\[
 \dim\mathcal R_Q
 \geq R-\dim K_0-1=R-O(L).                            \tag{4.2}
\]

Since `R=2^(4800 lambda^2)`, equation (4.2) proves (0.5).  In particular,
the finite mixed floor cannot be promoted to the whole retained operator by
an onto-coframe or finite-codimension argument.

The proved far-cross theorem estimates the captured row into

\[
 F\subset\operatorname {ran}P_{>R}^+                 \tag{4.3}
\]

and gains the Fourier denominator `R^(-1)`.  The spaces `K_0` and
`mathcal R_Q` both live on the retained side and are not separated by a
Fourier-index gap.  Ambient Hilbert-space orthogonality does not create the
denominator in (4.3).  Thus that theorem supplies no estimate for
`X_theta` or `y_theta`.

## 5. Trace and Hilbert--Schmidt bounds do not supply a floor

In the source Cauchy form,

\[
 Q=D_a+D_bH-HD_b,
 \qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m).              \tag{5.1}
\]

If `S` is a set of `d` Fourier indices and
`B_b=sup_n|b_n|`, the presently available absolute estimate is

\[
 \begin{aligned}
 \|P_S(D_bH-HD_b)P_S\|_{\rm HS}^2
 &\leq4B_b^2\sum_{n\in S}\sum_{k\ne0}{1\over k^2}\\
 &={4\pi^2\over3}B_b^2d.
 \end{aligned}                                        \tag{5.2}
\]

For `d` comparable with `R`, (5.2) is exponentially large.  The dimension-
free operator estimate

\[
 \|D_bH-HD_b\|\leq2\pi B_b=c_\lambda               \tag{5.3}
\]

is also only a magnitude estimate.  It becomes small between genuinely
separated Fourier bands, but `K_0` and `mathcal R_Q` occupy the same low
band.  The commutator in (5.1) is traceless, yet a positive total trace of
the diagonal plus commutator does not imply a lower eigenvalue bound.

The high-Fourier theorem can move the boundary inward and leave a smaller
window of dimension `exp(O(lambda log lambda))`.  It still proves no sign on
that remaining window.  Hence neither the half-power trace nor the current
Hilbert--Schmidt and high-mode bounds prove `R_theta>=0`.

## 6. Exact `N=2` source-Cauchy countermodel

Fix

\[
 L>1,\qquad \tau>0,\qquad
 b={L-1\over2},\qquad G>{16b^2\over9}.                \tag{6.1}
\]

On the five modes `-2<=n<=2`, define

\[
 a_0=-\tau,\qquad a_{\pm1}={L+1\over2},\qquad
 a_{\pm2}=G,                                          \tag{6.2}
\]

\[
 b_0=b_{\pm2}=0,\qquad b_1=b,\qquad b_{-1}=-b,       \tag{6.3}
\]

and use the exact source-Cauchy rule

\[
 Q_{nn}=a_n,\qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m).              \tag{6.4}
\]

With

\[
 e_0^+=V_0,\qquad
 e_n^+={V_n+V_{-n}\over\sqrt2},\qquad
 e_n^-={V_n-V_{-n}\over\sqrt2},                      \tag{6.5}
\]

order the parity basis as

\[
 (e_1^+,e_1^-,e_0^+,e_2^+,e_2^-).                    \tag{6.6}
\]

Direct substitution in (6.4) gives

\[
 Q_{\rm par}=
 \begin{bmatrix}
 L&0&\sqrt2b&-2b/3&0\\
 0&1&0&0&-4b/3\\
 \sqrt2b&0&-\tau&0&0\\
 -2b/3&0&0&G&0\\
 0&-4b/3&0&0&G
 \end{bmatrix}.                                      \tag{6.7}
\]

Thus `K_0=span(e_1^+)` has compression `L`, the bridge
`span(e_1^-)` has compression one, the retained line
`span(e_0^+)` has compression `-tau`, and the high block
`span(e_2^+,e_2^-)` is exactly `G I_2>0`.

Eliminating the high block changes only the first two diagonals:

\[
 Q_{\rm low}^{\rm short}=
 \begin{bmatrix}
  L-{4b^2\over9G}&0&\sqrt2b\\
  0&1-{16b^2\over9G}&0\\
  \sqrt2b&0&-\tau
 \end{bmatrix}.                                      \tag{6.8}
\]

Both the captured and bridge pivots in (6.8) are positive under (6.1).
The bridge row into the retained line vanishes.  Nevertheless, after the
captured pivot the exact retained short is

\[
 \boxed{
 -\tau-{2b^2\over L-4b^2/(9G)}<0.}                   \tag{6.9}
\]

Taking `G` of order `lambda^2` and `L=2 log(lambda)` makes the high-return
cost `O(L^2/lambda^2)` while preserving (6.9).  Therefore even a positive
conductor-size cap, a positive constant bridge, a positive high block, and
the exact source-Cauchy identity do not logically force the retained short
to be nonnegative.

The coefficients (6.2)--(6.3) are chosen for a logical model.  They are not
claimed to be the actual pole--Archimedean--prime coefficients at any
conductor.  In particular, (6.9) is **not** an arithmetic counterexample and
does not show that the genuine `S_(mathcal R,theta)` is negative.

## 7. Precise remaining theorem

After the strict-PASS coherent bridge pair and the half-power far-cross
theorem, a retained proof must establish at least one of the following for
the actual complete arithmetic operator.

1.  Prove the exact short

\[
 S_{\mathcal R,\theta}\succeq0                       \tag{7.1}
\]

with all complete signed source cancellations retained.

2.  Prove an actual retained floor and relative cross estimates, for
example

\[
 R_\theta\succeq\delta_\theta I,\qquad
 \|R_\theta^{-1/2}X_\theta A_\theta^{-1/2}\|^2
 +{\|R_{1,\theta}^{-1/2}y_{1,\theta}\|^2
       \over q_{1,\theta}}<1,                         \tag{7.2}
\]

where

\[
 R_{1,\theta}=R_\theta-X_\theta A_\theta^{-1}X_\theta^*.
                                                               \tag{7.3}
\]

The second term in (7.2) is interpreted only after
`R_(1,theta)>0`; the generalized range version is (3.7).  No theorem frozen
in Section 1 proves (7.1), (7.2), or the range condition.

Accordingly, the finite coherent bridge floor is complete on its declared
finite span, but it does not exhaust or orient the retained complement.
This is the exact fail-closed boundary of the two-stage route.

## 8. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_mixed_bridge_retained_complement_two_stage_schur_barrier -v

The regression checks the frozen coherent bridge pair, the two-stage Schur
identity, the exponential no-exhaustion dimension, the Hilbert--Schmidt
scale, the exact `N=2` source-Cauchy countermodel, the fail-closed language,
displayed TeX, and ASCII hygiene.
