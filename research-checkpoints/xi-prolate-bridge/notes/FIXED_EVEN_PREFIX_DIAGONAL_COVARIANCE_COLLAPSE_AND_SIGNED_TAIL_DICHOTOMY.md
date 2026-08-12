# Fixed even-prefix diagonal covariance collapse and signed-tail dichotomy

## 0. Exact outcome and claim boundary

Fix a real frequency window `[-T,T]` with (T>0).  This note has three
conclusions.

1. The polynomial--Xi covariance collapse transfers, by a non-effective
   diagonal choice, to the **actual finite anchor-deflated even prefixes**

   \[
   8,12,\ldots,4m
   \]

   on one unbounded locked schedule.  Their generalized real-window
   covariance floors satisfy

   \[
   \boxed{\lim_{m\to\infty}
          \gamma_{m,\lambda_m}(T)^{1/m}=0.}             \tag{0.1}
   \]

   The same diagonal can retain fixed-prefix injectivity, all fixed-prefix
   metric comparisons, transition inclusion, and a vanishing whitened
   scalar shift.

2. The actual signed radical-tail matrix has an exact two-slot
   factorization.  After defect whitening it is (Y^*JY), whereas the
   positive absolute tail Gram is (Y^*Y).  For every proposed floor
   (mu), signed positivity is equivalent to a positive absolute base plus
   one aligned/anti-aligned contraction, including its singular range
   branch.

3. Equation (0.1) does **not** imply collapse of the signed floor.  Its
   denominator is the raw polynomial--Xi Gram (G), while the signed target
   is whitened by the exterior defect metric (D).  Moreover the
   real-window covariance is not the absolute paired-zero tail Gram.  A
   growing-index (G/D) comparison and a real-window-to-zero-tail transfer
   are both missing before the covariance witness can become a signed
   obstruction.

In particular, this note does **not** prove that the actual growing-rest
signed floor fails.  It proves no signed singleton floor, signed rest floor,
residual action estimate, odd-sector floor, physical high-complement floor,
low/high reduction, equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant
limit, RH conclusion, or Lambda bound.  The formal state remains
`P0_INVALIDATED`.  No status, replay, source-lock, artifact, or integration
file is changed.

## 1. Frozen dependencies and conventions

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md` | `6281a93e4320e6c25fa09fdf942b94147a9b6aa1706b6c34dd079074d2f0ee98` |
| `notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md` | `000be1947a8cc22e7f96a080b8775ce0343fbeb36f886929c7ea5188191e0932` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md` | `e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816` |
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |

The locked arithmetic schedule is

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 N=2^{2400p^2}.                                         \tag{1.1}
\]

Every limiting operation below uses zero extension to the full logarithmic
line.  All generalized eigenvalues are taken only after the relevant raw
Gram has been proved positive.  All source spaces are finite dimensional at
each finite stage.

## 2. The limiting label prefix is the complete polynomial--Xi prefix

For (t=4j), let (K_t={\cal E}(q_t)) be the limiting arithmetic column
from the fixed-prefix theorem.  Its Fourier--Mellin transform has the form

\[
 \widehat K_{4j}(\xi)
 =\widetilde P_{j-1}(\xi^2)\Xi(\xi),\qquad
 \deg\widetilde P_{j-1}=j-1,                            \tag{2.1}
\]

and every leading coefficient is nonzero.  Consequently

\[
 \operatorname {span}\{K_4,K_8,\ldots,K_{4m}\}
 =\{p(\xi^2)\Xi(\xi):\deg p<m\}                       \tag{2.2}
\]

on the Fourier side.  Constants absorbed into (Xi) or into the polynomial
basis do not change the span.

Let (K_4) be the anchor and define

\[
 W_{t,\infty}=K_t-
 {\langle K_4,K_t\rangle\over\|K_4\|^2}K_4,
 \qquad t=8,12,\ldots,4m.                              \tag{2.3}
\]

Thus the limiting deflated space is exactly the anchor-orthogonal part of
the complete degree-less-than-(m) polynomial--Xi prefix.  Put

\[
 {\cal W}_{m,\infty}x
 =\sum_{t=8,12,\ldots,4m}x_tW_{t,\infty},             \tag{2.4}
\]

\[
 G_{m,\infty}={\cal W}_{m,\infty}^*{\cal W}_{m,\infty},
 \qquad
 C_{m,\infty}(T)
 =({\cal A}_T{\cal W}_{m,\infty})^*
   ({\cal A}_T{\cal W}_{m,\infty}),                  \tag{2.5}
\]

where ({\cal A}_T) is real-frequency Fourier restriction to `[-T,T]`.
The triangular independence theorem gives (G_{m,\infty}\succ0).  Define

\[
 \gamma_m(T)=\lambda_{\min}\!\left(
 G_{m,\infty}^{-1/2}C_{m,\infty}(T)
 G_{m,\infty}^{-1/2}\right).                          \tag{2.6}
\]

Every finite (gamma_m(T)) is positive.  Indeed a nonzero polynomial
times (Xi) cannot vanish almost everywhere on a real open interval.
The polynomial--Xi covariance theorem is basis invariant, so its complete
prefix result applies to (2.6):

\[
 \boxed{\lim_{m\to\infty}\gamma_m(T)^{1/m}=0.}       \tag{2.7}
\]

This means faster decay than every fixed exponential in the prefix depth.
It is a positive real-window statement, not a signed Weil statement.

## 3. Actual finite-prefix diagonal transfer

At a locked finite stage, let (W_{t,\lambda}) be the actual projected,
anchor-deflated column from the fixed-prefix theorem, and let

\[
 {\cal W}_{m,\lambda}x
 =\sum_{t=8,12,\ldots,4m}x_tW_{t,\lambda}.             \tag{3.1}
\]

Define

\[
 G_{m,\lambda}={\cal W}_{m,\lambda}^*{\cal W}_{m,\lambda},
 \qquad
 C_{m,\lambda}(T)
 =({\cal A}_T{\cal W}_{m,\lambda})^*
   ({\cal A}_T{\cal W}_{m,\lambda}).                 \tag{3.2}
\]

For every fixed (m), the arithmetic convergence and anchor convergence
give

\[
 G_{m,\lambda}\longrightarrow G_{m,\infty}.           \tag{3.3}
\]

Fourier transform followed by restriction is a contraction on (L^2), so
the same column convergence gives

\[
 C_{m,\lambda}(T)\longrightarrow C_{m,\infty}(T).    \tag{3.4}
\]

Hence (G_{m,\lambda}\succ0) eventually and continuity of generalized
eigenvalues proves

\[
 \gamma_{m,\lambda}(T):=\lambda_{\min}\!\left(
 G_{m,\lambda}^{-1/2}C_{m,\lambda}(T)
 G_{m,\lambda}^{-1/2}\right)
 \longrightarrow\gamma_m(T).                         \tag{3.5}
\]

### Theorem 3.1 (non-effective actual diagonal collapse)

For every fixed (T>0), there is a strictly increasing sequence of locked
parameters (lambda_m=p_m/2), (p_m\geq5) odd, indexed by integers
(m\geq3), such that

\[
 4m<n_*(\lambda_m),\qquad G_{m,\lambda_m}\succ0,     \tag{3.6}
\]

\[
 \gamma_{m,\lambda_m}(T)\leq2\gamma_m(T),            \tag{3.7}
\]

and therefore

\[
 \boxed{\lim_{m\to\infty}
 \gamma_{m,\lambda_m}(T)^{1/m}=0.}                   \tag{3.8}
\]

The sequence can simultaneously be chosen so that every fixed-(m) metric
comparison in the fixed-prefix theorem is within (1/m) of its limiting
value and

\[
 \|U_{\lambda_m}D_{m,\lambda_m}^{-1/2}
       G_{m,\lambda_m}D_{m,\lambda_m}^{-1/2}\|
 \leq {1\over m}.                                     \tag{3.9}
\]

Here (D_{m,\lambda}) may be any one of the three fixed-prefix metrics
proved asymptotically equivalent in that theorem.

**Proof.**  Fix (m).  Positivity of (gamma_m(T)), equations
(3.3)--(3.5), transition growth, the fixed-prefix metric limits, and the
fixed-depth whitened shift estimate each hold after some locked threshold.
Choose (p_m) odd, larger than the preceding choice, beyond the maximum of
those finitely many thresholds, and impose

\[
 |\gamma_{m,\lambda_m}(T)-\gamma_m(T)|
 \leq\gamma_m(T).                                     \tag{3.10}
\]

This gives (3.6), (3.7), (3.9), and the metric assertions.  Taking
(m)-th roots in (3.7) and using (2^{1/m}\to1) with (2.7) proves
(3.8).  No effective bound for (p_m) is asserted.  \(\square\)

The quantifier in Theorem 3.1 is **there exists one diagonal schedule**.  It
does not assert collapse on every growing schedule and does not transfer a
signed matrix.

## 4. The polynomial--Xi factor disappears at the zero slots

Return to one finite stage and its actual source columns.  The invisible
origin correction and the global radical construction give a linear map

\[
 {\cal K}_{\lambda,m}:\mathbb C^{m-1}
 \longrightarrow\text{global two-sided radicals}     \tag{4.1}
\]

whose physical restriction and projection is ({\cal W}_{m,\lambda}).
Let (T_{\lambda,N}) denote that restriction/projection operation and put

\[
 {\cal R}_{\lambda,m}
 =(I-T_{\lambda,N}){\cal K}_{\lambda,m}.              \tag{4.2}
\]

At the complete paired zero slots, global radicality gives

\[
 Z{\cal K}_{\lambda,m}=0,
 \qquad
 Z{\cal W}_{m,\lambda}=-Z{\cal R}_{\lambda,m}.       \tag{4.3}
\]

Thus polynomial--Xi triangularity supplies rank and limiting real-line
geometry, but it contributes no positive zero-slot term: the signed matrix
is wholly a truncation/projection remainder matrix.

Let (J=J^*=J^{-1}) be the paired-slot signature and set

\[
 \Pi_\parallel={I+J\over2},\qquad
 \Pi_{\rm anti}={I-J\over2}.                           \tag{4.4}
\]

With the actual split exterior metric (D>0), define

\[
 Y=Z{\cal R}_{\lambda,m}D^{-1/2}.                     \tag{4.5}
\]

The defect-whitened positive absolute and signed tail matrices are

\[
 \widehat A=Y^*Y,
 \qquad
 \widehat\Sigma=Y^*JY,                                \tag{4.6}
\]

and the anti-aligned defect is

\[
 \widehat E
 =2Y^*\Pi_{\rm anti}Y\succeq0.                       \tag{4.7}
\]

Consequently

\[
 \boxed{\widehat\Sigma=\widehat A-\widehat E.}       \tag{4.8}
\]

This is the actual source-specific signed radical-tail covariance.  It is
not the real-frequency covariance (C_{m,\lambda}(T)) from Section 3.

## 5. Exact absolute-base/orientation dichotomy

Put

\[
 \widehat G=D^{-1/2}G_{m,\lambda}D^{-1/2},
 \qquad
 P_0=1_{(0,\infty)}(\widehat G).                       \tag{5.1}
\]

Equation (4.3) gives (Y=-Z{\cal W}_{m,\lambda}D^{-1/2}), so
(Y=YP_0).  Hence (\widehat A), (\widehat\Sigma),
(\widehat E), and (\widehat G) are all supported on
({\rm ran}P_0).  Every inequality and range below is understood on that
support (and extends by zero to its orthogonal complement).

The normalized source pullback of the actual shifted physical operator is

\[
 H=\widehat\Sigma-U\widehat G.                         \tag{5.2}
\]

As in the growing-rest reduction, the physical comparison is equivalent to

\[
 B\succeq\mu\Delta
 \quad\Longleftrightarrow\quad
 H\succeq\mu P_0.                                     \tag{5.3}
\]

For a declared real (mu), define the positive-base candidate

\[
 C_\mu=\widehat A-U\widehat G-\mu P_0.                \tag{5.4}
\]

Then (4.8) gives the exact identity

\[
 \boxed{H-\mu P_0=C_\mu-\widehat E.}                 \tag{5.5}
\]

### Theorem 5.1 (signed-tail dichotomy, including the singular branch)

On ({\rm ran}P_0), the following statements hold.

Here (C_\mu^{\dagger/2}) denotes the positive square root of the
Moore--Penrose inverse of (C_\mu) on its support.

1. If (C_\mu\not\succeq0), then (H\succeq\mu P_0) is impossible.

2. If (C_\mu\succeq0), then

   \[
   \boxed{
   H\succeq\mu P_0
   \quad\Longleftrightarrow\quad
   {\rm ran}\widehat E\subseteq{\rm ran}C_\mu
   \text{ and }
   \left\|C_\mu^{\dagger/2}\widehat E
                 C_\mu^{\dagger/2}\right\|\leq1.}  \tag{5.6}
   \]

3. In particular, if (C_\mu\succ0), then

   \[
   \boxed{
   H\succeq\mu P_0
   \quad\Longleftrightarrow\quad
   \left\|C_\mu^{-1/2}\widehat E
                 C_\mu^{-1/2}\right\|\leq1.}        \tag{5.7}
   \]

   A strict contraction gives a strict reserve relative to (C_\mu).

**Proof.**  If (C_\mu-\widehat E\succeq0), then
(C_\mu=(C_\mu-\widehat E)+\widehat E\succeq0), proving the first
branch.  For positive semidefinite (C_\mu) and (widehat E), the
standard support decomposition gives

\[
 C_\mu-\widehat E\succeq0
 \quad\Longleftrightarrow\quad
 \ker C_\mu\subseteq\ker\widehat E
 \text{ and }
 C_\mu^{\dagger/2}\widehat E C_\mu^{\dagger/2}\preceq I.
\]

For Hermitian matrices the kernel condition is equivalent to the range
condition in (5.6), and the middle matrix is positive semidefinite, so its
top eigenvalue is its norm.  Equation (5.5) completes the proof.  \(\square\)

Theorem 5.1 is equivalent to the singleton/rest Schur branches after the
label-8 coordinate is shorted.  Applying it before shorting avoids losing
the paired-slot orientation in separate block estimates.

### A sharp positive failure certificate

Define

\[
 \alpha_{\lambda,m}
 =\lambda_{\min}\!\left(
 P_0(\widehat A+|U|\widehat G)P_0
 \big|_{{\rm ran}P_0}\right).                         \tag{5.8}
\]

The universal paired-slot inequality
(-\widehat A\preceq\widehat\Sigma\preceq\widehat A)
implies

\[
 H\preceq\widehat A+|U|\widehat G.                    \tag{5.9}
\]

Hence, on any unbounded schedule,

\[
 \boxed{\alpha_{\lambda,m}\longrightarrow0
 \quad\Longrightarrow\quad
 \text{no uniform }\mu_0>0\text{ can satisfy }
 H\succeq\mu_0P_0.}                                  \tag{5.10}
\]

This is a sufficient failure theorem, not a statement that the actual
(alpha_{\lambda,m}) tends to zero.

For the explicit polynomial witness from the covariance obstruction,

\[
 p_n(y)=y^n(y-c_n),\qquad c_n={M_{n+1}\over M_n},
 \qquad M_n=\int_{\mathbb R}t^{2n}|\Xi(t)|^2dt,       \tag{5.11}
\]

one has exact anchor orthogonality.  Let (x_{n,\lambda}) be its coordinate
vector in the actual finite prefix, with depth (m=n+2), whenever the
synthesis is injective.  The single scalar estimate

\[
 {x_{n,\lambda}^*(\mathfrak A+|U|G)x_{n,\lambda}
  \over x_{n,\lambda}^*Dx_{n,\lambda}}
 \longrightarrow0                                    \tag{5.12}
\]

would imply (5.10).  Here (mathfrak A=D^{1/2}\widehat A D^{1/2}).
No admitted theorem proves (5.12).

## 6. Why the diagonal covariance theorem does not prove (5.12)

There are two independent mismatches.

### 6.1 Raw polynomial Gram versus exterior defect metric

For every nonzero raw coordinate vector (x), the identity

\[
 \boxed{
 {x^*C_{m,\lambda}(T)x\over x^*Dx}
 =
 {x^*C_{m,\lambda}(T)x\over x^*G_{m,\lambda}x}
 {x^*G_{m,\lambda}x\over x^*Dx}.}                    \tag{6.1}
\]

is exact.  The diagonal theorem controls the first factor for one extremal
vector.  It gives no growing-depth control of the second.

For every fixed (m), the fixed-prefix theorem gives

\[
 \lambda_{\min}(D^{-1/2}GD^{-1/2})
 =\Theta_m(d_{4m}^{-1}),\qquad
 \lambda_{\max}(D^{-1/2}GD^{-1/2})
 =\Theta_m(d_8^{-1}).                                 \tag{6.2}
\]

Each fixed-index defect contains the common factor
(e^{-4\pi\lambda^2}).  Thus the (G/D) factor is exponentially large
in (lambda^2) at fixed depth.  Equation (2.7), which has no quantitative
joint relation between (m) and (lambda), cannot be multiplied through
(6.1).  A useful theorem must control, for the same witness and schedule,

\[
 {x^*C(T)x\over x^*Gx}
 {x^*Gx\over x^*Dx}.                                  \tag{6.3}
\]

The fixed-(m)-then-(lambda) limit and the growing-(m) limit cannot be
interchanged without such a rate theorem.

### 6.2 Real-window covariance versus absolute zero-tail sampling

Even a proof that (6.3) tends to zero would concern
(C_{m,\lambda}(T)), not (mathfrak A).  The former is the real-frequency
restriction Gram

\[
 C(T)=({\cal A}_T{\cal W})^*({\cal A}_T{\cal W}),     \tag{6.4}
\]

whereas the latter is the complete paired-zero sampling Gram of the
truncation remainder,

\[
 \mathfrak A=(Z{\cal R})^*(Z{\cal R}).                \tag{6.5}
\]

The polynomial witness proves that real-frequency mass escapes every fixed
window.  The zero-slot map samples all zero heights and may follow that
escaping mass.  There is no admitted bounded intertwiner from (6.4) to
(6.5), much less one controlled at the (D)-scale.

Therefore a covariance-based signed no-go needs both

\[
 {x^*Gx\over x^*Dx}\quad\text{in the same growing regime}, \tag{6.6}
\]

and a source-specific estimate transferring the selected real-window
witness to

\[
 {x^*\mathfrak A x\over x^*Dx}.                        \tag{6.7}
\]

If (6.7) stays bounded below, Theorem 5.1 still requires the independent
anti-aligned orientation contraction.  Positive covariance, absolute tail
sampling, and signed tail orientation are three distinct data.

## 7. Exact next fork and final scope

The actual growing-rest problem now has a fail-closed fork.

* A no-go theorem may prove (alpha_{\lambda,m}\to0), or merely the
  explicit witness estimate (5.12), on one unbounded schedule.
* A positive theorem may choose one (mu_0>0) and prove the absolute-base
  support condition and contraction (5.6), uniformly on one unbounded
  schedule.  The singleton/rest short in the growing-rest theorem then
  gives the physical comparison.

Theorem 3.1 rigorously eliminates a uniform real-window covariance floor as
a surrogate on one actual diagonal schedule.  It does not decide either
branch of this signed fork.  In particular, the actual growing prolate rest
floor is neither proved nor disproved here.
