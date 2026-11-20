# Anchor/label-12 complete weighted cross asymptotic theorem

## 0. Exact result and claim boundary

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A.          \tag{0.1}
\]

Let `R_4` be the complete global-radical remainder of the actual
source-normalized anchor and let `R_12` be the remainder of the actual
anchor-deflated label-12 column.  Their exact scalar exterior metrics are
`D_4,D_12`.  The two frozen component theorems now give

\[
 \boxed{
 {\mathcal W_Z(R_{12},R_4)\over\sqrt{D_4D_{12}}}
   =\mathcal G_8\log c+o(\log c),}                    \tag{0.2}
\]

where

\[
 \mathcal G_8=\sum_{m\geq1}
 {\sin(8\arcsin(1/m))\over16\pi m}>0.                 \tag{0.3}
\]

Since

\[
 {\sqrt{D_4D_{12}}\over d_8}\longrightarrow
 \sqrt{14\over99},\qquad {\log c\over L}\longrightarrow1,
                                                               \tag{0.4}
\]

equation (0.2) gives the signed raw limit

\[
 \boxed{
 {\mathcal W_Z(R_{12},R_4)\over d_8L}
 \longrightarrow\mathcal G_8\sqrt{14\over99}>0.}     \tag{0.5}
\]

Therefore the sufficient first-transverse row condition

\[
 \mathcal W_Z(R_{12},R_4)=o(d_8L^{-1/2})              \tag{0.6}
\]

is false.  This is a failure of that sufficient residual route, not a
failure of positivity and not a statement about zeros.  The cross in
(0.5) is compatible with a positive `4/12` minor whose diagonal entries
have their natural `d_4L` and `d_12L` scales.

The centered logarithmic moment is `O(1)`, but the frozen fixed-label
inputs state the endpoint-defect normalization only as an asymptotic
equivalence.  This theorem therefore does **not** promote (0.2) to
`mathcal G_8*log(c)+O(1)`.  Writing a tilde for the actual
scalar-defect-white profile, that sharper remainder would require, for
example,

\[
 2\langle\widetilde B_{12},\widetilde B_4\rangle-\mathcal G_8
 =O(1/\log c),                                         \tag{0.7}
\]

or a separately pinned quantitative endpoint/Jost normalization lemma.
No admitted theorem supplies (0.7).  This does not affect (0.5).

No zero list, Weil-form positivity, Riemann hypothesis, determinant
limit, or equation (5.2) of `DIRECT_RH_ATTACK.md` is used or proved.  The
formal state remains `P0_INVALIDATED`.

## 1. Frozen inputs

| Dependency | SHA-256 |
|---|---|
| `notes/ANCHOR_LABEL12_SIGNED_CROSS_CORRELATION_BARRIER.md` | `632f9320855d48ac923e13d1176347cb9ccbe7925170babd52a0c5313d5bfb00` |
| `notes/FIXED_LABEL_4_12_WEIGHTED_ARCHIMEDEAN_CROSS_LIMIT_THEOREM.md` | `b6fd0f311d9b0822d2a0ad13c6b5d246c48bd694f692b3fb53ba5a7a47458a2e` |
| `tests/test_fixed_label_4_12_weighted_archimedean_cross_limit_theorem.py` | `9a11a4e23a3a31f871f8654debf4a6b48d244cc29843c1e04118fd8c8737efbe` |
| `notes/FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md` | `efde844cb3aa14a97277d3a7f62af4bf51f02578e4c2a06f1dc4354934713dca` |
| `tests/test_fixed_4_12_complete_nonarchimedean_cross_theorem.py` | `12a8624458a1da4cdc361e71b36356acfe0097284cb9ddb8c3bd4e15a238bca1` |
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |

Only fixed labels occur.  Nothing below is uniform in a growing label or
growing prefix.

## 2. Actual columns, ground correction, and defect scale

Write `f_j` for the pure fixed prolate label.  The exact zero-integral
anchor and exact anchor-deflated label-12 source are

\[
 q_{4,\lambda}=f_4+\rho_4f_0,\qquad
 q_{12,\lambda}=f_{12}-\alpha_{12}f_4+b_{12}f_0,      \tag{2.1}
\]

with bounded coefficients.  Orthogonality of the concentration defects
gives

\[
 D_4=d_4+|\rho_4|^2d_0,\qquad
 D_{12}=d_{12}+|\alpha_{12}|^2d_4+|b_{12}|^2d_0.       \tag{2.2}
\]

The fixed-label defect formula implies

\[
 \sqrt{d_0/d_4}=O(\lambda^{-4}),\qquad
 \sqrt{d_4/d_{12}}=O(\lambda^{-8}),\qquad
 \sqrt{d_0/d_{12}}=O(\lambda^{-12}).                  \tag{2.3}
\]

Thus the actual defect-white anchor differs from pure defect-white label
4 by `O(lambda^(-4))`, while the actual defect-white label-12 column
differs from pure label 12 by `O(lambda^(-8))`.  The invisible origin
correction preserves every endpoint jet and is smaller still in all
fixed-profile estimates.  In particular,

\[
 {D_4\over d_4}=1+O(\lambda^{-8}),\qquad
 {D_{12}\over d_{12}}=1+O(\lambda^{-16}).              \tag{2.4}
\]

This records the ground-label component of the actual anchor explicitly;
the anchor is not silently replaced by pure label 4.

The fixed defect constants give

\[
 {d_4\over d_8}\sim {105\over4096\pi^4}\lambda^{-8},
 \qquad
 {d_{12}\over d_8}\sim
 {16^4\pi^4\over9\cdot10\cdot11\cdot12}\lambda^8. \tag{2.5}
\]

The powers of `lambda` and `pi` cancel in the geometric mean.  The
product of the two rational constants is `14/99`, proving (0.4).

## 3. Weighted Archimedean leading coefficient

Let `\widetilde B_4,\widetilde B_12` be the complete one-tail profiles of
the actual scalar-defect-white columns.  The exact even Archimedean symbol
is

\[
 a(\xi)=\operatorname {Re}\psi\!\left({1\over4}
                   +{i\xi\over2}\right)-\log\pi.      \tag{3.1}
\]

The frozen weighted theorem proves, with the complete Fejer and hard-edge
conventions,

\[
 \boxed{
 2\int_{\mathbb R}\{a(\xi)-\log c\}
 \widehat{\widetilde B}_{12}(\xi)
 \overline{\widehat{\widetilde B}_4(\xi)}
 {d\xi\over2\pi}=O(1).}                               \tag{3.2}
\]

Its proof contains the cutoff-uniform scaled `H^(1/8)` bound, the exact
sawtooth jump modulus with its mandatory harmonic logarithm, the
low-frequency `O(c^(-1))` mass, and the reciprocal/hard-edge estimates.
No endpoint series is differentiated term by term.

The physical cross has the qualitative limit

\[
\begin{aligned}
 2\langle\widetilde B_{12},\widetilde B_4\rangle
 &\longrightarrow {1\over2\pi}\sum_{m\geq1}{1\over m}
 \int_{\sqrt{m^2-1}}^\infty
 {\cos(8\arctan(1/x))\over1+x^2}\,dx\\
 &=\mathcal G_8.
\end{aligned}
\tag{3.3}
\]

The orientation in (3.3) is the one required by
`mathcal W_Z(R_12,R_4)`.  The profiles are real and all labels are
divisible by four, so there is no conjugation or endpoint-phase minus
sign.  Plancherel and (3.2)--(3.3) give

\[
 \boxed{
 {2\over\log c}\int_{\mathbb R}a(\xi)
 \widehat{\widetilde B}_{12}(\xi)
 \overline{\widehat{\widetilde B}_4(\xi)}
 {d\xi\over2\pi}\longrightarrow\mathcal G_8.}        \tag{3.4}
\]

This is `mathcal G_8*log(c)+o(log(c))`, with the exact positive sign and
factor.  Equation (0.7) is precisely the missing input for replacing its
remainder by `O(1)`.

## 4. Complete non-Archimedean ledger

Write

\[
 R_j=O_j+P_j,\qquad X_j=W_j+P_j.                        \tag{4.1}
\]

Use a tilde for scalar-defect whitening.  The frozen non-Archimedean
theorem proves

\[
\begin{aligned}
 |Q_{\rm pr}^{\rm same}(\widetilde O_{12},\widetilde O_4)|&=O(1),\\
 |Q_{\rm refl}(\widetilde O_{12},\widetilde O_4)|&=O(1),\\
 |P_+(\widetilde O_{12},\widetilde O_4)|&=O(1),\\
 \mathcal W_Z(\widetilde R_{12},\widetilde R_4)
 -\mathcal W_Z(\widetilde O_{12},\widetilde O_4)&=o(1).
\end{aligned}
\tag{4.2}
\]

This package redoes the pure `4/12` analysis; it does not infer it from
the special `8/12` endpoint/null coframe.  It retains:

- the exact integer-dilation sawtooth covariance and both same-side
  orientations;
- the bounded unequal-order perturbation of the equality/reciprocal
  stationary branches;
- the unique quartic reflected center and the separate hard-edge lattice
  term;
- the right-continuous inclusive prime endpoint, where a possible
  `n=A` atom is multiplied by the zero convolution value;
- the complete reflected prime-minus-Lebesgue Stieltjes quadrature before
  taking absolute values; and
- the even pole magnitude, not merely its positive rank-one sign.

For the compact projection, both mixed orientations are mandatory:

\[
\begin{aligned}
 \mathcal W_Z(O_{12},P_4)&=-q_\lambda(X_{12},P_4),\\
 \mathcal W_Z(P_{12},O_4)&=-q_\lambda(P_{12},X_4),\\
 \mathcal W_Z(P_{12},P_4)&=q_\lambda(P_{12},P_4).
\end{aligned}
\tag{4.3}
\]

The locked cutoff makes all three central-form terms `o(1)`.  Thus (4.2)
is exactly

\[
 \boxed{
 {\mathcal W_Z(R_{12},R_4)\over\sqrt{D_4D_{12}}}
 -{Q_{\rm ar}^{\rm same}(O_{12},O_4)\over\sqrt{D_4D_{12}}}
 =O(1).}                                               \tag{4.4}
\]

No sign is assigned separately to the reflected prime and continuous
pieces.

## 5. Assembly

The complete physical outer cross is the sum, with the locked explicit
kernel signs, of the same-side Archimedean term, inclusive same-side
minus-prime term, complete reflected term, and even pole.  Equation (3.4)
fixes its only logarithmic coefficient, while (4.4) bounds everything
else.  Therefore

\[
 {\mathcal W_Z(R_{12},R_4)\over\sqrt{D_4D_{12}}\log c}
 \longrightarrow\mathcal G_8.                         \tag{5.1}
\]

Equations (0.4) and `log(c)/L -> 1` prove (0.5).  No standard-eight file,
source lock, artifact, replay output, or formal project status is changed
by this theorem.
