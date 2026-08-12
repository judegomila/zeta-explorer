# First-transverse relative leakage and the endpoint-hierarchy barrier

## 0. Exact outcome and claim boundary

This note audits the first explicit transverse radical in the
source-normalized prolate construction.  It combines the exact first
correction, the finite secant, the Gevrey remainder, the fixed label-8
synthesis theorem, the fixed label-8/12 signed floor, and the polarized
radical-leakage identity.  The desired estimate

\[
 {r\over\varepsilon_W}=o(L^{-3/2})
 \quad\hbox{or}\quad
 {r\over\varepsilon_{\rm sec}}=o(L^{-3/2})             \tag{0.1}
\]

does **not** follow from these inputs.  No failure of (0.1) for the actual
arithmetic matrices is proved.

There are four precise conclusions.

1. The first transverse Xi radical is exactly the limiting
   anchor-deflated label-8 arithmetic column, up to one nonzero locked
   scalar.  Thus the fixed label-8/12 theorem supplies a strong
   `d_8 L` signed floor for the **actual finite prolate label-8 direction**.

2. The convergence of that actual direction to the fixed Xi radical is an
   ordinary `L2` convergence, not a signed graph-norm convergence.  The
   Gevrey theorem does not repair this: on its polynomial projection
   diagonal its exponential is much larger than `sqrt(d_8)`, while on its
   quadratic diagonal its constant is only an unspecified positive number.
   Resolving `sqrt(d_8)` requires an exponent at least `2*pi` before
   losses; a strictly larger exponent is robust after unspecified
   polynomial losses.

3. The formal expansion does not force an exterior Schur hierarchy.  In the
   diagonal prolate-defect proxy, the first correction is larger than the
   anchor by the amplitude factor asymptotic to `4*pi*lambda^2`; at every
   fixed higher order the top-label contribution grows by a positive power
   of `lambda`.  This is an endpoint singular perturbation, not a descending
   perturbation series in the exterior metric.

4. Even if the actual label-8 floor is granted as a proxy for the desired
   transverse energy, label 12 is the first critical residual channel:

   \[
    {\sqrt{d_4d_{12}}\over d_8}\longrightarrow
       \sqrt{14\over99}.                               \tag{0.2}
   \]

   Hence a scale-sharp geometric-mean estimate gives only an
   `O(L^(-1))` bound for the label-12 residual coordinate divided by the
   proved floor.  A proof using only that `d_8L` lower floor closes (0.1)
   if the complete signed anchor-to-label-12/rest row gains an additional
   `o(L^(-1/2))`, followed by a Bessel estimate for the whole orthogonal
   rest.  This is a sufficient checkpoint, not a necessary rate absent a
   matching upper bound for the transverse energy.

All actual-source pairings below are assembled from the pole,
Archimedean, and inclusive minus-prime blocks before any absolute value.
Every prime power `1<n<=lambda^2` is retained, and the prime block keeps the
minus sign from source equation (3.19).  No zero list and no global Weil
positivity are used.  The formal project state remains `P0_INVALIDATED`.

## 1. Frozen inputs and conventions

The calculation uses the following repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/PROLATE_SECANT_RADICAL_BLOCK_REDUCTION.md` | `419bc795572c1fa72b89d246dc2ae8cb036b8a700b8437bea5de723dd3d28ffe` |
| `notes/TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md` | `e5a0888f54ae4ae97d00462b7cfd00cbc9d98638ff9d36aea0fdb7a1c861e77f` |
| `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` | `ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171` |
| `notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md` | `384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md` | `9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71` |
| `notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md` | `e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17` |
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |

Put

\[
 L=2\log\lambda,\qquad c=2\pi\lambda^2.              \tag{1.1}
\]

The global Fourier convention for the Xi radicals is

\[
 \widehat f(t)=\int_{\mathbb R}f(x)e^{-itx}\,dx.       \tag{1.2}
\]

The additive source transform retains the locked `e^(2*pi*i*x*y)` sign.
All prolate functions use Lebesgue measure, zero extension, and source phase
positive at zero.

## 2. Exact identification of the first transverse direction

Let `q_4,q_8` be the limiting zero-value, zero-integral Hermite source
functions in the fixed-prefix theorem.  Its first anchor correction is

\[
 q_{4,1}={\sqrt6\over8\pi}h_0+{3\over64\pi}h_4
              -{\sqrt{105}\over16\pi}h_8.             \tag{2.1}
\]

Using

\[
 q_4=h_4-{\sqrt6\over4}h_0,\qquad
 q_8=h_8-{\sqrt{70}\over16}h_0,                       \tag{2.2}
\]

and `sqrt(7350)=35*sqrt(6)`, direct substitution gives the exact triangular
identity

\[
 \boxed{
 q_{4,1}={3\over64\pi}q_4
              -{\sqrt{105}\over16\pi}q_8.}            \tag{2.3}
\]

Let

\[
 K_j={\cal E}(q_j)(e^{\,\cdot}),\qquad j=4,8,          \tag{2.4}
\]

and retain the locked source coefficient `a_4`.  The limiting anchor and
first correction are

\[
 K_\infty=a_4K_4,\qquad G_1=a_4{\cal E}(q_{4,1}).       \tag{2.5}
\]

Put

\[
 W_{8,\infty}=P_{K_4^\perp}K_8.                       \tag{2.6}
\]

Equations (2.3)--(2.6) imply

\[
 P_{K_\infty^\perp}G_1
 =-{a_4\sqrt{105}\over16\pi}W_{8,\infty}.            \tag{2.7}
\]

The secant theorem independently proves

\[
 W_\Xi:=-16\pi P_{K_\infty^\perp}G_1,                \tag{2.8}
\]

so

\[
 \boxed{W_\Xi=a_4\sqrt{105}\,W_{8,\infty}.}          \tag{2.9}
\]

This is an exact identification, including sign.  It concerns the limiting
global radicals.

At a finite locked stage, let `W_(8,lambda)` be the actual compact
anchor-deflated label-8 column.  Let `D^(unc)_(8,12)` be the exact
**uncorrected** quotient exterior metric of the raw label-8/12 plane.  The
invisible origin bump is part of the global radical lift but is explicitly
excluded from this metric in the fixed-plane theorem.  Its label-8 diagonal
is the uncorrected fixed-label metric, and the fixed label theorem gives

\[
 W_{8,\lambda}\longrightarrow W_{8,\infty},\qquad
 {D^{\rm unc}_{88}\over d_8}\longrightarrow1,\qquad
 \|W_{8,\infty}\|>0.                                  \tag{2.10}
\]

The fixed label-8/12 plane theorem gives, at its common shift `U_lambda`,

\[
 \mathsf H_{8,12}(\lambda)
 \succeq\left({E\over2}\log c-C\right)D^{\rm unc}_{8,12},
 \qquad E>0.                                          \tag{2.11}
\]

Consequently, for
`omega_(8,lambda)=W_(8,lambda)/||W_(8,lambda)||`,

\[
 \boxed{
 \langle\omega_{8,\lambda},(Q-U_\lambda I)
            \omega_{8,\lambda}\rangle
 \geq \left({E\over2}\log c-C\right)
       {D^{\rm unc}_{88}\over\|W_{8,\lambda}\|^2}
 \gg d_8L.}                                           \tag{2.12}
\]

Equation (2.12) is the strong signed/source-metric first-transverse floor
already available.  It is not reproved here.

For comparison with the older notation, put

\[
 B_q=P_{\kappa^\perp}(Q-qI)P_{\kappa^\perp}
          \big|_{\kappa^\perp}.                        \tag{2.13}
\]

Let `z_W=P_NC_lambda W_Xi` and define

\[
 w_W=P_{\kappa^\perp}z_W,\qquad
 \omega_W={w_W\over\|w_W\|},\qquad
 \varepsilon_W=\langle\omega_W,B_q\omega_W\rangle.   \tag{2.14}
\]

Let `z_0=P_NC_lambda K_infinity` and define the exact finite secant

\[
 t_{\rm sec}=P_{\kappa^\perp}z_0,\qquad
 \omega_{\rm sec}={t_{\rm sec}\over\|t_{\rm sec}\|},
 \qquad
 \varepsilon_{\rm sec}
 =\langle\omega_{\rm sec},B_q\omega_{\rm sec}\rangle. \tag{2.15}
\]

Finally define the actual label-8 energies at the plane-theorem shift and
at the Rayleigh shift by

\[
 \varepsilon_{8,U}
 =\langle\omega_{8,\lambda},(Q-U_\lambda I)
            \omega_{8,\lambda}\rangle,
 \qquad
 \varepsilon_{8,q}
 =\langle\omega_{8,\lambda},B_q\omega_{8,\lambda}\rangle.
                                                               \tag{2.16}
\]

They satisfy the exact scalar relation

\[
 \varepsilon_{8,q}=\varepsilon_{8,U}-(q-U_\lambda).   \tag{2.17}
\]

Thus (2.12) is directly a floor for `epsilon_(8,U)`.  Using it for
`epsilon_(8,q)` requires the separately justified estimate
`q-U_lambda=o(d_8L)`.  Using it for (2.14) or (2.15) additionally requires
the graph transfer below.

## 3. Why the actual finite floor does not yet bound
`epsilon_W` or `epsilon_sec`

The fixed-radical direction in `epsilon_W`, the exact secant direction, and
the actual finite label-8 direction all converge to the same nonzero
`L2` line.  Relative signed energies require more.

If `delta_lambda` denotes the difference between two normalized choices,
transferring (2.12) to the other one requires, at minimum, control of

\[
 |\langle\delta_\lambda,(Q-U_\lambda I)
        \omega_{8,\lambda}\rangle|
 +|\langle\delta_\lambda,(Q-U_\lambda I)
        \delta_\lambda\rangle|
 =o(d_8L).                                             \tag{3.1}
\]

Ordinary norm convergence gives no estimate of (3.1).  This is exactly the
graph-norm warning in the secant theorem.

The endpoint scale makes the gap quantitative.  The fixed-index defect is

\[
 d_n\sim A_n\lambda^{2n+1}e^{-4\pi\lambda^2},
 \qquad A_n=4\sqrt2\,\pi{(16\pi)^n\over n!}.           \tag{3.2}
\]

Thus

\[
 \sqrt{d_8}\asymp\lambda^{17/2}e^{-2\pi\lambda^2}.   \tag{3.3}
\]

On `N=ceil(lambda*L^3)`, the Gevrey projection audit gives only

\[
 O(e^{-c_1\lambda L^2}),                              \tag{3.4}
\]

and

\[
 {e^{-c_1\lambda L^2}\over\sqrt{d_8}}\longrightarrow\infty
                                                               \tag{3.5}
\]

for every fixed positive `c_1`.  On the quadratic projection diagonal it
gives

\[
 O(e^{-c_2\lambda^2})                                 \tag{3.6}
\]

for some noncomputed `c_2>0`.  Before any additional loss, comparison with
(3.3) gives

\[
 e^{-c_2\lambda^2}=o(\sqrt{d_8})
 \quad\Longleftrightarrow\quad c_2\geq2\pi.           \tag{3.7}
\]

At equality the remaining factor is `lambda^(-17/2)`.  The strict condition
`c_2>2*pi` is a robust sufficient condition after unspecified fixed
polynomial arithmetic or sampling losses; equality would require auditing
their degree.  No lower bound `c_2>=2*pi` is proved.  The Gevrey construction
deliberately chooses a small endpoint-safe truncation constant and claims no
optimal exponential constant.  Hence it supplies neither (3.1) nor a
relative lower bound for `epsilon_W` or `epsilon_sec`.

There is a second way to see the same singularity.  If the formal correction
components are measured in the diagonal prolate-defect proxy, then (2.3)
and

\[
 {d_4\over d_8}\sim {105\over4096\pi^4}\lambda^{-8}  \tag{3.8}
\]

give

\[
 \lambda^{-2}{\sqrt{105}\over16\pi}
       \sqrt{d_8\over d_4}
 \longrightarrow 4\pi\lambda^2.                     \tag{3.9}
\]

Thus the label-8 part of the nominal first correction is not small relative
to the anchor in that exterior proxy; its amplitude grows like
`4*pi*lambda^2`.

More generally, the unique raising path makes the `j`-th correction contain
a nonzero label `4j+4` coefficient.  Equation (3.2) gives, for fixed `j`,

\[
 \lambda^{-2j}\sqrt{d_{4j+4}\over d_4}
 =C_j\lambda^{2j}\{1+o(1)\},\qquad C_j>0.             \tag{3.10}
\]

The proxy contributions grow at every fixed order.  Equations (3.9)--(3.10)
do not claim that the formal components equal the actual exterior remainder;
they prove the opposite logical point: the central expansion by itself
cannot force a descending exterior Gram or Schur hierarchy.  The exact
prolate endpoint cancellation is an all-order effect which the admitted
Gevrey constants do not resolve at the `d_8` scale.

## 4. Exact complete residual row

Let `p_4=a*kappa` be the actual finite anchor and put

\[
 q=\langle\kappa,Q\kappa\rangle,\qquad
 b=(Q-qI)\kappa,\qquad r=\|b\|.                       \tag{4.1}
\]

For every actual anchor-deflated fixed label `t=8,12,...`, let `W_t` be
its compact column, `K_t=W_t+R_t` its origin-corrected global radical lift,
and `omega_t=W_t/||W_t||`.  Since `W_t` is orthogonal to `p_4`, the shift
does not enter its residual coordinate.  Polarized two-sided radicality
gives the exact complete formula

\[
 \boxed{
 \langle\omega_t,b\rangle
 ={\mathcal W_Z(R_t,R_4)\over
       a\,\|W_t\|}.}                                  \tag{4.2}
\]

The Hermitian order of the two arguments may conjugate the displayed
scalar, but not its modulus.  The right side of (4.2) is one combined
pole--Archimedean--minus-prime pairing.  Replacing it by three block norms
destroys the cancellation which the desired estimate must exploit.

Equation (4.2) identifies the actual missing object: the complete Riesz row
of the anchor radical remainder on the transverse rest.

## 5. Label 12 is the first critical scale

From (3.2),

\[
 {d_{12}\over d_8}
 \sim{(16\pi)^4\over9\cdot10\cdot11\cdot12}\lambda^8.
                                                               \tag{5.1}
\]

Combining (3.8) and (5.1) gives the exact constant

\[
 \boxed{
 {d_4d_{12}\over d_8^2}\longrightarrow
 {105\over4096\pi^4}
 {65536\pi^4\over11880}={14\over99}.}                \tag{5.2}
\]

Therefore (0.2) follows.

For comparison, the label-8 geometric mean is favorable:

\[
 {\sqrt{d_4d_8}\over d_8}
 \sim {\sqrt{105}\over64\pi^2}\lambda^{-4}.          \tag{5.3}
\]

Thus a defect-relative bound on the anchor-to-label-8 cross would carry a
polynomial gain.  At label 12 the gain disappears exactly.

Grant, only for a sufficient scale comparison, the strong actual energy

\[
 \varepsilon_8\geq\kappa_0d_8L                     \tag{5.4}
\]

from (2.12), after whatever separately justified scalar-shift comparison is
required.  Let `D^(unc)_4` denote the uncorrected anchor exterior metric and
let `D^(unc)_12` be the corresponding label-12 diagonal; the fixed-label
theorems give

\[
 D^{\rm unc}_4/d_4\longrightarrow1,
 \qquad D^{\rm unc}_{12}/d_{12}\longrightarrow1.      \tag{5.4a}
\]

Even the sharp-looking estimate

\[
 |\mathcal W_Z(R_{12},R_4)|
 \leq C\sqrt{D^{\rm unc}_4D^{\rm unc}_{12}}           \tag{5.5}
\]

would give only

\[
 {|\langle\omega_{12},b\rangle|\over\varepsilon_8}
 =O(L^{-1}),                                          \tag{5.6}
\]

because `a`, `||W_12||`, and the fixed-label metric ratios have nonzero
finite limits.  Equation (5.6) is not `o(L^(-3/2))`.

A first scale-sharp sufficient scalar checkpoint for a proof using only
(5.4) is therefore

\[
 \boxed{
 |\mathcal W_Z(R_{12},R_4)|
 =o(d_8L^{-1/2}).}                                    \tag{5.7}
\]

A sufficient invariant checkpoint for the complete residual is

\[
 \boxed{
 \|P_{\{\kappa,\omega_8\}^\perp}b\|
 =o(d_8L^{-1/2}),}                                    \tag{5.8}
\]

together with the corresponding control of the label-8 coordinate and a
graph transfer if `epsilon_W` or `epsilon_sec` is used in place of the
actual label-8 energy.  A collection of per-label bounds is insufficient
without a Bessel/coframe estimate for the whole growing rest.

There is an exact raw-coordinate form of that requirement.  Let `W_R`
synthesize any finite family of actual anchor-deflated rest columns, let

\[
 G_R=W_R^*W_R,\qquad c_R=W_R^*b.                       \tag{5.9}
\]

Finite-dimensional least squares gives

\[
 \boxed{
 \|P_{\operatorname {ran}W_R}b\|^2
 =c_R^*G_R^\dagger c_R.}                              \tag{5.10}
\]

Every entry of `a*c_R` is the corresponding complete pairing in (4.2)
before division by the column norm.  Thus the corresponding sufficient
growing-rest row lemma is

\[
 \boxed{
 (c_R^*G_R^\dagger c_R)^{1/2}
 =o(d_8L^{-1/2}).}                                    \tag{5.11}
\]

One must also control the component of `b` outside `ran(W_8,W_R)` to
obtain the full norm `r`.

### 5.1 Why neither the singleton short nor the positive plane supplies
the saving

The fixed 8/12 theorem says that the assembled shifted form is positive on
the transverse plane:

\[
 H_{8,12}=
 [\mathcal W_Z(R_i,R_j)-U_\lambda\langle W_i,W_j\rangle]
 _{i,j=8,12}>0.                                      \tag{5.12}
\]

It controls the internal entry `H_(8,12)` by the two transverse diagonals.
The residual entry in (5.7) is instead the anchor-to-12 entry
`mathcal W_Z(R_12,R_4)`.  The anchor is not in the positive plane.  At the
Rayleigh shift its diagonal is exactly zero, while its cross row is `b`;
the full block is

\[
 \begin{pmatrix}0&b^*\\ b&B_q\end{pmatrix}.           \tag{5.13}
\]

Unless `b=0`, (5.13) is not positive even when `B_q>0`.  Applying a positive
form Cauchy--Schwarz inequality to (5.13) would therefore assume precisely
the missing global signed information.

The secant scalar identity likewise controls only
`<omega_sec,b>`.  Its exact orthogonal decomposition is

\[
 r^2=|\langle\omega_{\rm sec},b\rangle|^2
       +\|P_{\{\kappa,\omega_{\rm sec}\}^\perp}b\|^2. \tag{5.14}
\]

The label-12 coordinate lies in the second term after the evident
orthogonalization.  The singleton short and the positive 8/12 internal
cross do not cancel it.  Hence (5.7), or its row form (5.11), is genuinely
new rather than a hidden polarization consequence of the fixed-plane
floor.

Finally, the sufficient threshold algebra is exact.  If a transverse
energy satisfies

\[
 \varepsilon\geq\kappa_0d_8L,                         \tag{5.15}
\]

then the desired ratio follows from

\[
 r=o(d_8L^{-1/2}),                                    \tag{5.16}
\]

because

\[
 {r\over\varepsilon}
 =o\!\left({d_8L^{-1/2}\over d_8L}\right)
 =o(L^{-3/2}).                                        \tag{5.17}
\]

By contrast, inserting the critical geometric-mean estimate `r=O(d_8)`
and only the lower floor (5.15) yields merely the bound

\[
 {r\over\varepsilon}=O(L^{-1}),\qquad
 L^{3/2}{r\over\varepsilon}=O(L^{1/2}),               \tag{5.18}
\]

which need not tend to zero.  This does not make (5.16) necessary: if the
actual transverse energy is larger than `d_8L`, a weaker numerator estimate
could suffice.  No matching upper bound is used here.

Equations (5.7)--(5.8) are carrier-sensitive signed statements about the
complete distribution.  Neither absolute sampling, the first correction,
the Gevrey upper bound, nor the fixed-plane floor proves them.

## 6. Exact critical-scale countermodel

The following finite family shows that the available geometry and scales do
not imply (0.1).  It is a synthetic metric-compatible model, not an
arithmetic Weil matrix.  In particular, it is not an arithmetic Weil matrix
reconstructed from the pinned inventory.

For an integer `L>=2`, put

\[
 \delta_L=2^{-L^2},\qquad
 d_8=\delta_L,\qquad d_4=L^{-8}\delta_L,
 \qquad d_{12}=L^8\delta_L.                            \tag{6.1}
\]

Then

\[
 \sqrt{d_4d_{12}}=d_8.                                \tag{6.2}
\]

In the orthonormal basis `(kappa,e_8,e_12)`, take

\[
 Q-qI=
 \begin{pmatrix}
 0&0&\delta_L\\
 0&L\delta_L&0\\
 \delta_L&0&L^{9}\delta_L
 \end{pmatrix}.                                      \tag{6.3}
\]

The complement is exactly

\[
 B=L\operatorname {diag}(d_8,d_{12})>0,              \tag{6.4}
\]

so it has the strongest possible `L`-scale source-metric floor.  Declare a
central secant

\[
 z_0=\kappa+L^{-2}e_8.                                \tag{6.5}
\]

It has the first-correction scale and points exactly in the strong
transverse direction.  Nevertheless

\[
 b=\delta_Le_{12},\qquad r=\delta_L,qquad
 \varepsilon_8=L\delta_L,                             \tag{6.6}
\]

and hence

\[
 {r\over\varepsilon_8}={1\over L},\qquad
 L^{3/2}{r\over\varepsilon_8}=\sqrt L\longrightarrow\infty.
                                                               \tag{6.7}
\]

All entries tend to zero faster than every inverse power of `L`, the
anchor cross has exactly the geometric-mean scale, the complement is
strictly positive, and the secant is correctly placed.  The hidden label-12
row alone defeats the target.  This proves a non-implication only; (6.3) is
not reconstructed from the pinned prime inventory and does not claim that
the actual ratio behaves like `1/L`.

## 7. First scale-sharp sufficient route not yet proved

There are two ordered sufficient obligations for the route audited here.

1. To use `epsilon_W` or `epsilon_sec`, prove a signed graph-norm transfer
   from the actual finite label-8 column to the fixed-radical or exact-secant
   direction at `o(d_8L)` energy resolution.  Central `L2` convergence and
   the admitted Gevrey constants do not provide it.

2. Even after using the actual label-8 floor directly, prove the complete
   residual-row estimate (5.8), or replace it by a stronger joint theorem.
   Its first scale-sharp scalar checkpoint is (5.7): an
   `o(L^(-1/2))` improvement over the natural
   `sqrt(d_4d_12)=Theta(d_8)` cross scale.  The estimate must be made on the
   combined pole--Archimedean--minus-prime form, with both mixed orientations
   and the inclusive prime endpoint retained.

The second obligation is the first explicit transverse-versus-rest
arithmetic comparison on this sufficient route.  The fixed 8/12 floor is a
denominator theorem with no matching numerator theorem at present.  A
different proof could exploit an energy larger than its proved lower floor
or estimate the ratio jointly.  No relative bound, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant convergence, or Riemann hypothesis
conclusion follows from the inputs audited here.
