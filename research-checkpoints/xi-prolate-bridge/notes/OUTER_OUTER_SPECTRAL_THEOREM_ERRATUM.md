# Erratum to the outer--outer spectral theorem

## 0. Scope and immutable historical bytes

This non-mutating erratum corrects the displayed signed zero-pairing
summand in equation (1.5) of
`notes/OUTER_OUTER_SPECTRAL_THEOREM.md`.  The historical theorem is retained
byte for byte because several admitted source locks depend on it.  Its
SHA-256 remains

`02407eafa8fd5db4c5d8b5bbb2f62d5215f6ef5bf1cb5104fa53caddb52800e4`.

The correction changes no absolute-value bound, numerical constant, source
admission, artifact, or replay result in that theorem.  In particular, its
constants `C_low`, `S_high`, `C_spec`, and `C_D`, the absolute estimate
(6.2), the qualitative `o(d_8)` conclusion (6.5), and the absolute
Ritz-energy conclusion (7.3) remain valid.

This erratum proves no positivity of the signed Weil form, no signed sector
floor, no `P_0` floor, no residual action, no equation (5.2) of
`DIRECT_RH_ATTACK.md`, no determinant limit, and no RH conclusion.  The
formal state remains `P0_INVALIDATED`.

## 1. Correct paired-slot summand

Keep the historical convention

\[
 F_f(z)=\int_{\mathbb R}f(t)e^{-izt}\,dt,
 \qquad s_\rho=\gamma+i(1/2-\beta).                  \tag{1.1}
\]

For the Hermitian polarization, the signed spectral pairing is obtained by
exchanging the two zero-evaluation slots.  Its diagonal summand is therefore

\[
 \boxed{
 F_f(s_\rho)\,\overline{F_f(\overline{s_\rho})},}     \tag{1.2}
\]

not the unconjugated product
`F_f(s_rho)F_f(overline{s_rho})` displayed in historical equation (1.5).
Equivalently, after orbitwise realification, the signed form is the absolute
two-slot Gram composed with the self-adjoint slot-exchange involution.  This
is the paired-slot orientation recorded independently in
`notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md`.

If `f` is real and even, then

\[
 F_f(\overline z)=\overline{F_f(z)},
 \qquad
 F_f(s_\rho)\overline{F_f(\overline{s_\rho})}
 =F_f(s_\rho)^2.                                      \tag{1.3}
\]

For an off-critical-line zero parameter, `s_rho` is nonreal and this square
need not be nonnegative or even real before the functional-equation orbit is
assembled.  Orbit assembly makes the total Hermitian pairing real; it does
not turn the summand into an absolute square.  Thus the corrected identity
is fully consistent with the historical theorem's explicit statement that
no Weil positivity is used.

A concrete real-even transform already shows the distinction.  The symmetric
two-point measure at `+1` and `-1` has transform `F(z)=2 cos z`.  At
`z=pi/2+iy`, `y` nonzero, equation (1.2) equals
`F(z)^2=-4 sinh(y)^2<0`, whereas the historical unconjugated display would
give `F(z)F(overline z)=|F(z)|^2>0`.

## 2. Why every absolute bound and constant survives

The sampling proof in Sections 4--6 of the historical theorem estimates the
modulus before summation.  Under the corrected pairing,

\[
 \left|F_f(s_\rho)
       \overline{F_f(\overline{s_\rho})}\right|
 =|F_f(s_\rho)|\,|F_f(\overline{s_\rho})|.             \tag{2.1}
\]

Hence the same elementary inequality

\[
 2|ab|\leq |a|^2+|b|^2                              \tag{2.2}
\]

reduces the signed summand to the same two absolute sampling sums.  Neither
the low-block factor `128 Z_finite` nor the high-block factor `1280` changes.
Consequently the admitted estimate remains, with exactly the historical
constant,

\[
 |\mathcal W_Z(O_\lambda,O_\lambda)|
 \leq C_{\rm spec}D_S(\lambda)d_4.                    \tag{2.3}
\]

The derivation of (6.5) uses only (2.3), the degree-seven majorant, and the
fixed-index Slepian ratio.  The derivation of (7.3) likewise uses only
absolute `o(d_j)` estimates after the exact radical expansion.  Both
conclusions therefore survive unchanged.  What does not survive, and was
never an admitted claim of the historical theorem, is any inference that
the signed outer--outer term is positive because `f` is real and even.

## 3. Checkpoint-1.08 interaction and fail-closed boundary

The complete growing-transition central-form reduction uses the signed
paired-slot form throughout.  Its absolute sequence-space Cauchy estimate
controls only the projection erosion

\[
 -\delta_qD_{\rm full}\preceq\Sigma_N-Q_X
 \preceq\delta_qD_{\rm full};                         \tag{3.1}
\]

it does not assign a sign to `Q_X`.  This erratum therefore changes no line
of that reduction.  It only prevents a false shortcut from real-even source
symmetry to positivity of the complete central form.

The following historical files and dependent source locks remain immutable:

| Path | SHA-256 |
|---|---|
| `notes/OUTER_OUTER_SPECTRAL_THEOREM.md` | `02407eafa8fd5db4c5d8b5bbb2f62d5215f6ef5bf1cb5104fa53caddb52800e4` |
| `tests/test_outer_outer_spectral_theorem.py` | `23f212a876183f3c0bef0f4acdf7b20db23436451d72e8abc5a4cf59c782bb1f` |
| `src/outer_outer_spectral_theorem.py` | `fb665df6207257916643619cd09bd291888a4f18e752f4bb38d497371559aba5` |
| `verifier/outer_outer_spectral_theorem_replay.py` | `de9862d8f5b90d5dbadef8044c1dd939daa51536fbf81cae0cbb237e8312b5d1` |
| `artifacts/outer_outer_spectral_theorem/README.md` | `be3bd6d6024acfe547d1592ef736a43fe700bb7c088393a7816cfa29e8dc85c1` |
| `HYBRID_OUTER_SAMPLING_SOURCE_LOCK.json` | `65df5f6f47aa0718f1768d1dfafa5f5ec659e4c2681419ef130cd15572b6a9f9` |
| `TRANSITION_PROLATE_OUTER_SOURCE_LOCK.json` | `463511b13e9313178980c57cdd7bfd008f84d447a3d8e20c3774e4b1b498be9d` |
| `COMPACT_ABSOLUTE_SAMPLING_SOURCE_LOCK.json` | `48c1bb3a206b4b7d4b448775a7ed6041a248b345a09fe42ab925c5cd233f0cf4` |

No source-lock JSON is rewritten by this erratum.  No historical source hash
is superseded.  The correction is an additive interpretive record, and the
project remains `P0_INVALIDATED`.
