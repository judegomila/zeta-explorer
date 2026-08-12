# Real-window to zero-tail carrier transfer barrier

## 0. Exact outcome and claim boundary

Fix a real-frequency observation window `[-T,T]`.  This note proves that
small mass in that window cannot, by itself, be transferred to small
absolute paired-zero sampling, even after three pieces of the actual
radical construction are retained.

1. Two individually certified critical-line zeros produce a two-dimensional
   moving-carrier space.  Every unit vector in that space has real-window
   mass at most

   \[
   {512T\over L\gamma_{\min}^2},
   \]

   while its sampling by those two zeros has a lower frame constant

   \[
   {L\over8\pi^2}.
   \]

2. The carrier space has a nonzero intersection with the orthogonal
   complement of every one-dimensional anchor.  The same two estimates
   therefore hold for a unit anchor-orthogonal vector.

3. The all-vector radical lift turns that compact vector into an exact
   global radical plus an exterior remainder, with the compact samples
   equal to the negatives of the remainder samples.  At every fixed finite
   stage the complete polynomial--Xi correction tower also spans the whole
   even physical space.  Thus global radicality, anchor deflation, and
   unrestricted finite polynomial--Xi membership do not imply the desired
   transfer.

4. The extra hypothesis which could prevent this carrier mechanism is a
   **growing-depth defect-weighted right-inverse bound**.  Section 5 records
   its minimal basis-invariant form.

5. A separate logarithmic averaging argument transfers anti-carrier
   nonvanishing for every fixed finite zero set to the locked strict
   half-integer grid, with explicit constants.  The transfer condition is
   exponentially bad in the number of ordinates and fails to cover the
   natural growing choice `K asymp lambda*L^3`.

The two critical-line ordinates in the carrier theorem are finite declared
inputs.  Using them does not assume that any other zero is on the critical
line.  The theorem proves no statement about the specific moment-ratio
witness

\[
 p_n(y)=y^n(y-M_{n+1}/M_n),
\]

no estimate for its `D`-cost, no collapse or lower frame for the actual
fixed even prefix, no signed orientation, no signed singleton or rest
floor, no residual action estimate, no equation (5.2) of
`DIRECT_RH_ATTACK.md`, no RH conclusion, and no Lambda bound.  The formal
state remains `P0_INVALIDATED`.  No status, replay, source-lock, artifact,
or integration file is changed.

## 1. Frozen dependencies and conventions

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md` | `e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816` |
| `notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md` | `6281a93e4320e6c25fa09fdf942b94147a9b6aa1706b6c34dd079074d2f0ee98` |
| `notes/FIXED_EVEN_PREFIX_DIAGONAL_COVARIANCE_COLLAPSE_AND_SIGNED_TAIL_DICHOTOMY.md` | `6d8be3d8bef6002d7fa2f1581e09bf27aa0dc12b2a3805fa7cd5e92863cd70d8` |
| `notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md` | `ceb3e7067ed9ef9f02f443b665a83f778500630ded912e60df128abc8c17514a` |
| `notes/CENTERED_ZERO_PALEY_WIENER_INTERPOLATION_OBSTRUCTION.md` | `b23720bd4c05afbda4aa3f50176ff0580bacda0668264fd4fcc075b7c43d5ae2` |
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,
\]

so the centered logarithmic interval is `[-L/2,L/2]`.  For `n>=1`, let

\[
 e_n^+(u)=\sqrt{2/L}\cos(a_nu),
 \qquad a_n={2\pi n\over L}.                         \tag{1.1}
\]

The angular transform is

\[
 F_n(z)=\int_{-L/2}^{L/2}e_n^+(u)e^{-izu}\,du.
                                                               \tag{1.2}
\]

Direct integration gives the entire function

\[
 \boxed{
 F_n(z)=\sqrt{2/L}\left\{
 {\sin((z-a_n)L/2)\over z-a_n}
 +{\sin((z+a_n)L/2)\over z+a_n}
 \right\}.}                                           \tag{1.3}
\]

Every removable carrier value in (1.3) is interpreted by continuity.
The vectors `e_n^+` are orthonormal.  The positive paired-zero seminorm is
the repository seminorm

\[
 \|v\|_{\mathfrak Z}^2
 =\sum_\rho\bigl(|F_v(s_\rho)|^2
                 +|F_v(\overline{s_\rho})|^2\bigr). \tag{1.4}
\]

Only two nonnegative summands of (1.4) will be used.

## 2. Exact moving-carrier estimates

Fix `T>0`.  Let

\[
 \rho_i={1\over2}+i\gamma_i,\qquad i=1,2,             \tag{2.1}
\]

be two individually certified nontrivial zeros with

\[
 \gamma_{\min}:=\min(\gamma_1,\gamma_2)
 \geq\max\{2,4T+1\},
 \qquad |\gamma_2-\gamma_1|\geq4.                    \tag{2.2}
\]

No assertion is made about any other zero.  Suppose `L>=4*pi`, and choose
`n_i` to be a nearest integer to `gamma_i*L/(2*pi)`.  Then

\[
 |a_{n_i}-\gamma_i|\leq{\pi\over L}.                 \tag{2.3}
\]

The two indices are positive and distinct under (2.2).

### Lemma 2.1 (diagonal carrier value)

For `i=1,2`,

\[
 \boxed{|F_{n_i}(\gamma_i)|
 \geq {1\over\pi}\sqrt{L\over2}.}                  \tag{2.4}
\]

**Proof.**  Put `delta=gamma_i-a_(n_i)`.  Equation (2.3) gives
`|delta*L/2|<=pi/2`.  On that interval,

\[
 \left|{\sin(\delta L/2)\over\delta}\right|
 ={L\over2}\left|{\sin(\delta L/2)\over\delta L/2}\right|
 \geq {L\over\pi}.                                  \tag{2.5}
\]

The other summand in (1.3) has modulus at most
`1/(gamma_i+a_(n_i))<=L/(2*pi)`, because `n_i>=1`.
The reverse triangle inequality in (1.3) proves (2.4).  At `delta=0`,
equation (2.5) is its continuous value.  \(\square\)

### Lemma 2.2 (off-carrier value)

For `i!=j`,

\[
 \boxed{|F_{n_j}(\gamma_i)|
 \leq {2\over3}\sqrt{2\over L}.}                    \tag{2.6}
\]

**Proof.**  Equations (2.2)--(2.3) and `L>=4*pi` give

\[
 |\gamma_i-a_{n_j}|\geq4-{1\over4}>3,
 \qquad \gamma_i+a_{n_j}>3.                          \tag{2.7}
\]

Bound both sine numerators in (1.3) by one and both denominators below by
three.  \(\square\)

Let

\[
 M_L=(F_{n_j}(\gamma_i))_{1\leq i,j\leq2}.           \tag{2.8}
\]

The diagonal part of `M_L` has least singular value at least

\[
 d_L={1\over\pi}\sqrt{L\over2},
\]

whereas its off-diagonal part has norm at most

\[
 b_L={2\over3}\sqrt{2\over L}.
\]

For `L>=4*pi`,

\[
 {b_L\over d_L}={4\pi\over3L}\leq{1\over3}.         \tag{2.9}
\]

Singular-value perturbation therefore gives the deliberately weaker clean
bound

\[
 \boxed{\sigma_{\min}(M_L)
 \geq {d_L\over2},
 \qquad
 \sigma_{\min}(M_L)^2\geq{L\over8\pi^2}.}           \tag{2.10}
\]

### Lemma 2.3 (fixed real-window upper bound)

For `i=1,2` and `|x|<=T`,

\[
 \boxed{|F_{n_i}(x)|
 \leq {8\sqrt{2/L}\over\gamma_{\min}}.}             \tag{2.11}
\]

**Proof.**  Equations (2.2)--(2.3) imply
`a_(n_i)>=2T` and `a_(n_i)>=gamma_i/2`.  Hence each denominator in
(1.3) has modulus at least `a_(n_i)-T>=a_(n_i)/2`.  Bounding both sine
numerators by one proves (2.11).  \(\square\)

## 3. Two-carrier no-transfer theorem and anchor deflation

Put

\[
 H_L=\operatorname {span}\{e_{n_1}^+,e_{n_2}^+\}.    \tag{3.1}
\]

### Theorem 3.1 (real-window collapse with a zero-sampling frame)

Every unit vector `v in H_L` satisfies

\[
 \boxed{
 \int_{-T}^T|F_v(x)|^2\,dx
 \leq {512T\over L\gamma_{\min}^2},}                 \tag{3.2}
\]

and

\[
 \boxed{\|v\|_{\mathfrak Z}^2
 \geq {L\over8\pi^2}.}                              \tag{3.3}
\]

**Proof.**  Write `v=c_1e_(n_1)^++c_2e_(n_2)^+`, with `||c||_2=1`.
By Cauchy--Schwarz and (2.11),

\[
 |F_v(x)|^2\leq {256\over L\gamma_{\min}^2}.
\]

Integration over an interval of length `2T` proves (3.2).  The two selected
critical zeros contribute `||M_Lc||_2^2` to the nonnegative sum (1.4), so
(2.10) proves (3.3).  \(\square\)

Let `kappa_L` be any unit even anchor in the same finite physical space.
Put

\[
 J_L:=H_L\cap\kappa_L^\perp.
\]

The dimension formula gives

\[
 \dim J_L\geq1.                                      \tag{3.4}
\]

Every unit vector in `J_L` obeys (3.2)--(3.3).  Choose one such vector
`v_L`.  Therefore, along every unbounded locked sequence on which
`n_1,n_2<=N`,

\[
 \int_{-T}^T|F_{v_L}(x)|^2dx\longrightarrow0,
 \qquad
 \|v_L\|_{\mathfrak Z}^2\geq {L\over8\pi^2}.         \tag{3.5}
\]

For the repository exponential projection cutoff, the two indices are
`O(L)` and are eventually below `N`.  Thus two fixed certified ordinates
satisfying (2.2) are enough; no moving zero table and no simultaneous phase
recurrence are needed.

Theorem 3.1 rules out every implication of the form

\[
 \|{\cal A}_Tv\|\longrightarrow0
 \quad\Longrightarrow\quad
 \|Zv\|_{\mathfrak Z}\longrightarrow0               \tag{3.6}
\]

on the unrestricted anchor complement.  It does not assert that the
specific polynomial moment witness contains a vector of the form (3.1).

## 4. Exact radical and polynomial--Xi compatibility

The all-vector radical theorem supplies a linear map on every finite even
physical space,

\[
 {\cal K}_+:E_N^+\longrightarrow
       \{\hbox{global two-sided radicals}\},          \tag{4.1}
\]

such that

\[
 C_\lambda{\cal K}_+v=v,
 \qquad
 {\cal R}_+v={\cal K}_+v-v,
 \qquad
 Z{\cal R}_+v=-Zv.                                   \tag{4.2}
\]

Apply (4.2) to the anchor-orthogonal carrier vector `v_L`.  Its compact
zero samples are exactly the negatives of the samples of its global
radical remainder.  Hence (3.3) is already an exact absolute-tail lower
bound for this radical lift.  Radicality has not converted (3.2) into a
tail upper bound.

There is also a precise polynomial--Xi compatibility statement.  Let
`G_j` be the complete limiting polynomial--Xi radical tower and let
`T_(lambda,N)` be finite restriction and projection.  At every fixed
finite stage, the admitted density and surjectivity theorem gives

\[
 \operatorname {span}\{T_{\lambda,N}G_j:j\geq0\}
 =E_N^+.                                              \tag{4.3}
\]

Because the target is finite dimensional, there exists a finite, generally
unknown integer `d_*(lambda,N)` such that

\[
 \operatorname {span}\{T_{\lambda,N}G_j:0\leq j<d_*\}
 =E_N^+.                                              \tag{4.4}
\]

Projecting (4.4) orthogonally away from `kappa_L` gives

\[
 \operatorname {span}\{P_{\kappa_L^\perp}
 T_{\lambda,N}G_j:0\leq j<d_*\}
 =\kappa_L^\perp.                                    \tag{4.5}
\]

Thus `v_L` has an exact representation by some finite anchor-deflated
polynomial--Xi prefix at each fixed stage.

Equations (4.3)--(4.5) are qualitative saturation statements.  They give
no bound for `d_*`, no transition inclusion at that depth, no condition
number, no comparison with the actual finite-prolate correction prefix,
and no estimate for the exterior defect cost of the representing
coefficients.  Those omissions are exactly why Theorem 3.1 does not decide
the actual growing-prefix problem.

## 5. The minimal defect-weighted right-inverse gate

Let

\[
 W_{m,\lambda}:\mathbb C^{m-1}\longrightarrow
                 \kappa_\lambda^\perp               \tag{5.1}
\]

be an allowed anchor-deflated synthesis and let `D_(m,lambda)>0` be its
actual exterior defect metric.  Define

\[
 A_{D,m,\lambda}=W_{m,\lambda}D_{m,\lambda}^{-1/2}.   \tag{5.2}
\]

For a subspace `H` contained in `ran(W_(m,lambda))`, put

\[
 \boxed{
 {\cal R}_D(H;m,\lambda)
 =\left\|A_{D,m,\lambda}^{\dagger}\big|_H\right\|^2.}
                                                               \tag{5.3}
\]

Equivalently,

\[
 \boxed{
 {\cal R}_D(H;m,\lambda)
 =\sup_{\substack{0\ne v\in H}}
 {\displaystyle\inf_{W_{m,\lambda}x=v}x^*D_{m,\lambda}x
  \over\|v\|^2}.}                                    \tag{5.4}
\]

Indeed, with `y=D^(1/2)x`, the constraint is
`A_(D,m,lambda)y=v`, and the minimum is attained by the Moore--Penrose
solution.  Formula (5.3) is invariant under every invertible change of
source coordinates accompanied by the corresponding congruence of `D`.

Take `kappa_lambda=kappa_L`, so the nonzero carrier section `J_L` from
Section 3 lies in the codomain of (5.1).  Suppose, on an unbounded schedule,
that

\[
 J_L\subseteq\operatorname {ran}W_{m,\lambda},
 \qquad
 {\cal R}_D(J_L;m,\lambda)\leq C L.                  \tag{5.5}
\]

For a minimum-`D` preimage of a unit `v in J_L`, Theorem 3.1 gives

\[
 {\|ZW_{m,\lambda}x\|^2\over x^*D_{m,\lambda}x}
 \geq {1\over8\pi^2C}.                               \tag{5.6}
\]

If the prefix synthesis is injective, as it is eventually at every proved
fixed depth, the preimage is unique and (5.6) is the actual source quotient.

Consequently an `O(L)` bound in (5.5) is the minimal source-specific gate
which would make the carrier obstruction survive defect normalization.  A
bound `o(L)` would make the displayed quotient diverge.  Conversely,
qualitative saturation (4.4) without any control of (5.3) says nothing at
the `D` scale.

No admitted theorem proves (5.5) at a depth containing `J_L`.  The
fixed-prefix synthesis theorem proves strong `D`-weighted bounds only at
each fixed depth, while the carrier indices in Section 2 grow linearly with
`L`.  This is the exact noncommutation left by the carrier construction.

The gate (5.5) concerns a carrier subspace.  It neither proves nor refutes
the desired estimate for the separate moment-ratio vector
`x_(n,lambda)`.

## 6. Locked-grid recurrence for a fixed finite zero set

The moving-carrier theorem did not need phase recurrence.  For comparison,
this section records exactly what recurrence can prove when the Fourier
indices are fixed.

Let `gamma_1,...,gamma_K` be arbitrary positive real numbers, let `H>0`,
and define

\[
 S_K(H)=2^{-K}\exp\left{-{\pi^2\over3H}
                     \sum_{j=1}^K{1\over\gamma_j}\right\}. \tag{6.1}
\]

The finite carrier-product mean theorem gives, in every interval
`[A,A+H]`, a point `L_0` such that

\[
 P_K(L_0):=\prod_{j=1}^K
       \left|\sin{\gamma_jL_0\over2}\right|
 \geq S_K(H).                                        \tag{6.2}
\]

The product is globally Lipschitz with

\[
 |P_K(L)-P_K(L')|
 \leq {1\over2}\left(\sum_{j=1}^K\gamma_j\right)|L-L'|.
                                                               \tag{6.3}
\]

This follows by telescoping the products, bounding every unused sine by
one, and using the Lipschitz constant `gamma_j/2` for the `j`th factor.

The locked lengths are

\[
 {\cal L}_{\rm lock}
 =\{L_p=2\log(p/2):p\geq5\text{ odd}\}.              \tag{6.4}
\]

For every sufficiently large real `L`, choosing the nearest odd `p` to
`2e^(L/2)` gives the safe estimate

\[
 |L_p-L|\leq4e^{-L/2}.                                \tag{6.5}
\]

### Theorem 6.1 (fixed-set locked anti-carrier recurrence)

If

\[
 \boxed{
 e^{A/2}\geq {4\sum_{j=1}^K\gamma_j\over S_K(H)},}   \tag{6.6}
\]

then there is a locked length within `4e^(-A/2)` of `[A,A+H]` such that

\[
 \boxed{P_K(L_p)\geq{1\over2}S_K(H)>0.}              \tag{6.7}
\]

**Proof.**  Choose `L_0` by (6.2), then choose `L_p` by (6.5).  Equations
(6.3) and (6.6) make the loss at most `S_K(H)/2`.  \(\square\)

Thus every fixed finite verified zero set has an unbounded locked
anti-carrier schedule with a completely explicit positive product.  This
is a strict-rank statement, not a uniform frame.

### Why the growing anti-carrier construction does not transfer

The polynomial diagonal in the anti-carrier audit uses

\[
 K_A=\left\lceil e^{(A+H)/2}(A+H)^3\right\rceil.      \tag{6.8}
\]

Since `S_(K_A)(H)<=2^(-K_A)`, condition (6.6) asks at least for

\[
 e^{A/2}\geq
 4\left(\sum_{j=1}^{K_A}\gamma_j\right)2^{K_A}.      \tag{6.9}
\]

But `K_A>=e^(A/2)`, so the logarithm of the right side already exceeds
`(log 2)e^(A/2)` up to a harmless positive term, while the logarithm of the
left side is only `A/2`.  Hence (6.9) fails for all sufficiently large
`A`.

This proves failure of the **mean-plus-nearest-grid argument** at growing
`K`; it does not prove that no favorable locked point exists.  A useful
growing locked theorem would require new simultaneous phase information,
not merely density of the logarithmic grid.

## 7. Exact conclusion

The carrier theorem is stronger than an abstract covariance countermodel:
it uses actual compact Fourier vectors, actual certified zero evaluations,
an arbitrary actual anchor, the exact all-vector radical lift, and exact
finite-stage polynomial--Xi saturation.  It proves that none of those data
alone can transfer real-window collapse to absolute zero-tail collapse.

The theorem deliberately stops before the actual fixed-prefix metric.  The
remaining source-specific alternatives are now precise.

* To make the carrier obstruction defect-normalized, prove (5.5) for the
  anchor-orthogonal carrier section inside an allowed growing prefix.
* To prove collapse for the particular moment-ratio witness, estimate its
  own paired-zero remainder directly relative to its own `D` denominator.
* To prove a signed floor, additionally establish the independent paired-slot
  orientation contraction.  Positive absolute sampling alone is not enough.

None of these three statements follows from this note.

The isolated regression is

```text
python3 -m unittest tests.test_real_window_to_zero_tail_carrier_transfer_barrier -v
```
