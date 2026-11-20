# Rayleigh-shift scale audit for the first even and odd prolate windows

Status: exact asymptotic bookkeeping from the pinned fixed-index prolate
source.  This note corrects a possible cross-parity inference and records
which part of the original scale obstruction was subsequently discharged by
the hybrid complete-series theorem.  It proves no signed Weil-sector floor,
no shifted-resolvent estimate, no instance of equation (5.2), and no
Riemann-hypothesis conclusion.  The project terminal state remains
`P0_INVALIDATED`.

## 1. Pinned input and exact ratios

Write

\[
 d_m(\lambda)=1-\chi_m(\lambda)^2,
 \qquad c=2\pi\lambda^2.
\]

The source-locked fixed-index equivalence in
`PROLATE_DEFECT_SOURCE_LOCK.json` is

\[
 d_m(\lambda)\sim
 {4\,8^m\over m!}\sqrt\pi\,c^{m+1/2}e^{-2c}
 \quad(m\text{ fixed}).                                      \tag{1.1}
\]

The source gives no effective starting threshold and no growing-index
uniformity.  All conclusions below are therefore qualitative limits only.

For the first odd comparison label and the first even comparison label,
exact cancellation of the common factors in (1.1) gives

\[
 {d_8\over d_6}
 \sim {8^2 6!\over8!}c^2
 ={8\over7}c^2
 ={32\pi^2\over7}\lambda^4,                         \tag{1.2}
\]

and

\[
 {d_4\over d_6}
 \sim {6!\over8^2 4!}c^{-2}
 ={15\over32}c^{-2}
 ={15\over128\pi^2}\lambda^{-4}.                 \tag{1.3}
\]

The rational factors `32/7` and `15/128` are independently reconstructed by
`src/prolate_defect_source_lock.py` and its tests; they are not decimal
inputs.

## 2. The same scalar shift acts in both parity sectors

Let `a=||p_N||`, let `epsilon_lambda` be the complete-remainder absolute
sampling upper bound, and retain the rigorous common Ritz upper shift

\[
 U_Z={\epsilon_\lambda\over a^2}.
\]

In normalization-free variables the two shifted blocks are exactly

\[
 \widehat B_+=a^2Q_+-\epsilon_\lambda I
             =a^2(Q_+-U_ZI),
 \qquad
 \widehat B_-=a^2Q_--\epsilon_\lambda I
             =a^2(Q_--U_ZI).                         \tag{2.1}
\]

Thus the odd block does not receive a smaller shift merely because the
forcing vector is inversion even.  Evenness removes odd forcing; it does not
remove the scalar shift needed to place the entire odd spectrum above the
Ritz value.

## 3. Historical compact-BV baseline and the hybrid update

Before the hybrid complete-series theorem, the admitted compact-BV bound was

\[
 \epsilon_\lambda=O(\lambda^7d_4).                       \tag{3.1}
\]

Together with the pinned `d_4/d_8=O(lambda^{-8})`, it yields

\[
 \epsilon_\lambda=O(\lambda^{-1}d_8)=o(d_8).              \tag{3.2}
\]

Therefore that historical bound made the normalization-free scalar shift
asymptotically negligible relative to a hypothetical positive even
comparison floor of order `d_8`.

For the odd scale, however, (1.3) and (3.1) give only

\[
 {\epsilon_\lambda\over d_6}=O(\lambda^3).                \tag{3.3}
\]

Equation (3.3) is not a lower bound and did not prove that the shift was
large.  It says precisely that the older upper estimate failed to prove
`epsilon_lambda=o(d_6)`.  Consequently (3.2) must not be reused by itself as
an odd shift-smallness statement.

More generally, a bound

\[
 \epsilon_\lambda=O(\lambda^p d_4)
\]

would imply `o(d_6)` from the pinned fixed-index limits when `p<4`.
The borderline `p=4` gives only `O(d_6)`, and the historical compact-BV
exponent was `p=7`.

`notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md` now proves

\[
 \epsilon_\lambda=o(d_6)                                  \tag{3.4}
\]

by retaining the complete sampled series and switching blockwise between
two proved estimates.  Thus the common normalization-free shift
`epsilon_lambda I` in (2.1) is negligible at the fixed odd scale.  Equation
(3.4) does **not** imply `U_Z=epsilon_lambda/a^2=o(d_6)` without separate
lower control of `a`, and it supplies no signed odd-sector floor.

## 4. Honest remaining alternatives after the hybrid update

The first alternative in the original audit--proving
`epsilon_lambda=o(d_6)`--is now discharged for the normalization-free
blocks.  At least one genuinely new signed odd-sector input is still
required:

1. prove the complete shifted odd Schur complement directly, retaining
   `epsilon_lambda I` rather than treating it as a negligible perturbation;
2. prove an odd unshifted comparison floor on a larger scale, with all
   low/high couplings and the negative rank-one pole included.

The second option is not supplied by the natural fixed-index `d_6` scale.
Moreover, the odd pole is negative and must be placed in the low dangerous
space or handled by its exact rank-one leverage condition, as established in
`notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md`.  A positive sampling Gram or an
even-sector estimate alone cannot decide that Schur sign.

The hybrid update closes the normalization-free scalar scale obstruction;
this scale audit still does not close the signed odd-sector obligation.
