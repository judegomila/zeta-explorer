# Growing-transition Hadamard--Pick carrier RH-equivalence theorem

## 0. Exact result and fail-closed boundary

Let

\[
 \xi_{\mathbb R}(s)
 ={1\over2}s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s),
 \qquad F(s)={\xi_{\mathbb R}'\over\xi_{\mathbb R}}(s).       \tag{0.1}
\]

For a scalar ordered-sampler factor `Z`, define the complete
infinite-half-line carrier core

\[
 \mathcal K_Z(s,t)
 =2Z(s)Z(t){F(s)-F(t)\over s-t}.                         \tag{0.2}
\]

The exact direct-source carrier theorem supplies (0.2), initially in its
absolute-convergence domain.  This note proves its zero factorization and
identifies the strength of a global positive-metric interpretation.

Let `rho` run through the nontrivial zeros of `xi_R`, with algebraic
multiplicity, and put

\[
 u_\rho(s)={\sqrt2 Z(s)\over s-\rho}.                  \tag{0.3}
\]

Then, locally uniformly away from the zeros and poles of the displayed
factors,

\[
 \boxed{
 \mathcal K_Z(s,t)=-\sum_\rho u_\rho(s)u_\rho(t).}    \tag{0.4}
\]

The series in (0.4) is the paired Hadamard series.  It is locally
absolutely convergent because the divided difference gains two powers of
the zero ordinate.  Formula (0.4) is a **complex-symmetric bilinear**
factorization.  It is not a positive Hermitian Gram.  The minus sign and
the absence of conjugation are binding.

Now set

\[
 \Xi(z)=\xi_{\mathbb R}(\tfrac12+iz),\qquad
 m(z)=-{\Xi'(z)\over\Xi(z)},                          \tag{0.5}
\]

and define its Pick kernel on the upper half-plane by

\[
 \mathcal P_m(z,w)
 ={m(z)-\overline{m(w)}\over z-\overline w}.          \tag{0.6}
\]

The exact equivalence is

\[
 \boxed{
 \mathcal P_m\succeq0\hbox{ on }\mathbb C_+
 \quad\Longleftrightarrow\quad
 \hbox{every zero of }\Xi\hbox{ is real}
 \quad\Longleftrightarrow\quad RH.}                  \tag{0.7}
\]

No zero simplicity is assumed.  Under RH, each zero of multiplicity
`k_gamma` contributes `k_gamma` identical positive features.

The gamma-conjugated carrier is the exact Wronskian

\[
 \boxed{
 \begin{aligned}
 &{\xi_{\mathbb R}'(s)\xi_{\mathbb R}(t)
       -\xi_{\mathbb R}(s)\xi_{\mathbb R}'(t)\over s-t}\\
 &\qquad=\Xi(z)\overline{\Xi(w)}\mathcal P_m(z,w)\\
 &\qquad=-{\Xi'(z)\overline{\Xi(w)}
       -\Xi(z)\overline{\Xi'(w)}\over z-\overline w},
 \end{aligned}}                                      \tag{0.8}
\]

where `s=1/2+iz` and `t=1/2+i bar(w)`.  Under RH it has the positive
feature expansion

\[
 \Xi(z)\overline{\Xi(w)}\mathcal P_m(z,w)
 =\sum_\gamma k_\gamma
 {\Xi(z)\over\gamma-z}
 \overline{{\Xi(w)\over\gamma-w}}.                  \tag{0.9}
\]

Consequently, a generator-level theorem asserting the global Pick
positivity in (0.7) is literally an RH-strength theorem.  It cannot be
inserted as an unconditional positive metric for all carrier generators.
The realized growing-transition packet asks only for one finite,
source-integrated compression.  Positivity of that special compression is
strictly weaker than (0.7) and does not imply RH.

This theorem does not identify the raw sampler factor with a Hermitian
multiplier, does not remove the finite-central-length tail, does not prove
a boundary-value theorem for the physical transition profiles, and does
not prove RH.  The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_FINITE_FEJER_XI_WRONSKIAN_ASSEMBLY_GATE.md` | `41dad88fd3e5bcb3277ccadb6baaa4bfa40ab683d15c747bebe8a50ce759ff23` |
| `tests/test_growing_transition_finite_fejer_xi_wronskian_assembly_gate.py` | `dcb9640a5294ae5c44502f983f20f9eadcdf8271dd02099b9d3887f255460aee` |
| `notes/GROWING_TRANSITION_GLOBAL_RADICAL_SECTOR_MIXING_FEATURE_GEOMETRY_BARRIER.md` | `976f9299c4d002db3f0b73f0b4da8cc383480c8b55b7ea5ccdc219d9135fbdc4` |
| `tests/test_growing_transition_global_radical_sector_mixing_feature_geometry_barrier.py` | `61837a5180eac8fe307eca05578315066c39148c9d2dea143c6b1f7628e77b4d` |
| `notes/CENTERED_ZERO_BOUNDARY_CONVOLUTION_OBSTRUCTION.md` | `c9b4513fb0afa57a396f3c1bf7326bb94969d4c8d51a245ea66fa64c1889061e` |
| `notes/TAIL_DISCREPANCY_SAFE_HERGLOTZ_AND_ACTUAL_SCHUR_OBSTRUCTION.md` | `5efd87e2ff6bd21b498a1ff3d189fe252f4617c58da28d9650237763e3928341` |

No zero table, zero simplicity, RH assumption, numerical prolate datum, or
new external source is used.

## 2. Paired Hadamard divided difference

The classical zero-count bound gives

\[
 \sum_\rho(1+|\rho|)^{-2}<\infty.                    \tag{2.1}
\]

In the canonical genus-one expansion,

\[
 F(s)=B+\sum_\rho
 \left\{{1\over s-\rho}+{1\over\rho}\right\},       \tag{2.2}
\]

with the standard symmetric grouping.  The constants `B` and `1/rho`
cancel from a divided difference.  Hence

\[
 \begin{aligned}
 F(s)-F(t)
 &=\sum_\rho\left\{{1\over s-\rho}
                   -{1\over t-\rho}\right\}\\
 &=-(s-t)\sum_\rho{1\over(s-\rho)(t-\rho)}.
 \end{aligned}                                       \tag{2.3}
\]

This manipulation is rigorous without assigning separate values to the
conditionally grouped logarithmic derivatives.  Indeed, on a compact set
`C` avoiding the zeros, there is `R_C` such that

\[
 \sup_{s,t\in C}
 {1\over|(s-\rho)(t-\rho)|}
 \leq {4\over|\rho|^2},\qquad |\rho|\geq R_C.        \tag{2.4}
\]

Equations (2.1) and (2.4) give normal convergence of the difference
series.  Multiplying (2.3) by `2Z(s)Z(t)/(s-t)` proves (0.4).  On the
diagonal, the continuous limit is

\[
 \mathcal K_Z(s,s)=2Z(s)^2F'(s)
 =-2Z(s)^2\sum_\rho{1\over(s-\rho)^2}.               \tag{2.5}
\]

The right side of (2.5) is not an absolute-value square.  Even when `s`
is real, its summands are generally complex before zero-orbit pairing.

## 3. Relation to the ordered carrier core

At finite Fejer cutoff the direct-source carrier theorem has

\[
 \mathcal K_{M}(s,t)
 ={2Z_M(s)Z_M(t)\over s-t}
 \left\{F(s)-F(t)\right\}.                           \tag{3.1}
\]

Therefore (0.4) applies with `Z=Z_M`:

\[
 \mathcal K_M(s,t)
 =-\sum_\rho
 {\sqrt2Z_M(s)\over s-\rho}
 {\sqrt2Z_M(t)\over t-\rho}.                        \tag{3.2}
\]

In the ordered sampler limit in `Re s,Re t>1`, `Z_M` tends to `zeta` and

\[
 \mathcal K_\infty(s,t)
 =2\zeta(s)\zeta(t){F(s)-F(t)\over s-t}.             \tag{3.3}
\]

Writing

\[
 g(s)={1\over2}s(s-1)\pi^{-s/2}\Gamma(s/2),
 \qquad \xi_{\mathbb R}=g\zeta,                     \tag{3.4}
\]

gives the exact gamma conjugation

\[
 \boxed{
 \mathcal K_\infty(s,t)
 ={2\over g(s)g(t)}
 {\xi_{\mathbb R}'(s)\xi_{\mathbb R}(t)
       -\xi_{\mathbb R}(s)\xi_{\mathbb R}'(t)
  \over s-t}.}                                      \tag{3.5}
\]

The factor `1/(g(s)g(t))` is mandatory in the raw sampler normalization.
At finite `M`, replacing (3.1) by the Christoffel--Darboux numerator of
`gZ_M` is false.  At finite central length, the exact retained tail and
endpoint rows also remain.  Neither issue is changed by the Hadamard
factorization.

## 4. Critical-variable orientation

For `z,w in C_+`, put

\[
 s_z={1\over2}+iz,\qquad
 t_w={1\over2}+i\overline w.                         \tag{4.1}
\]

The completed function is real entire in the critical variable:

\[
 \Xi(\overline w)=\overline{\Xi(w)}.                 \tag{4.2}
\]

Differentiating (0.5) gives

\[
 {\Xi'(z)\over\Xi(z)}=iF(s_z),qquad
 F(s_z)=i m(z).                                      \tag{4.3}
\]

Because `s_z-t_w=i(z-bar(w))`, equations (4.1)--(4.3) prove

\[
 \boxed{
 {F(s_z)-F(t_w)\over s_z-t_w}
 ={m(z)-\overline{m(w)}\over z-\overline w}
 =\mathcal P_m(z,w).}                                \tag{4.4}
\]

Multiplying (4.4) by
`xi_R(s_z)xi_R(t_w)=Xi(z)overline{Xi(w)}` proves (0.8).
This is the sign which is reversed if one uses `s=1/2-iz` without also
changing the critical-variable orientation.

The raw factors `zeta(s_z)zeta(t_w)` are not, by themselves, a Hermitian
multiplier pair.  The completed Wronskian in (0.8) is the object for which
the functional equation supplies the conjugate pair.  This distinction
prevents a complex-symmetric carrier identity from being mislabeled as a
positive Gram.

## 5. Pick positivity is equivalent to RH

Let the zeros of `Xi` be denoted by `gamma`, with multiplicity `k_gamma`.
They are the critical-variable images of the nontrivial zeros:

\[
 \gamma=-i(\rho-\tfrac12).                            \tag{5.1}
\]

Thus RH is exactly the assertion `gamma in R` for every zero.

Assume RH.  Pairing `gamma` with `-gamma` in the even Hadamard product
gives, locally normally away from the real zeros,

\[
 m(z)=\sum_\gamma k_\gamma
 \left\{{1\over\gamma-z}
       -{\gamma\over1+\gamma^2}\right\}.            \tag{5.2}
\]

The real subtraction in (5.2) is only a convergence normalization and
cancels from the Pick difference.  Therefore

\[
 \boxed{
 \mathcal P_m(z,w)
 =\sum_\gamma{k_\gamma\over
       (\gamma-z)(\gamma-\overline w)}.}             \tag{5.3}
\]

For any finite points `z_1,...,z_N in C_+` and coefficients
`c_1,...,c_N`, normal convergence gives

\[
 \sum_{j,k=1}^N\overline{c_j}\mathcal P_m(z_j,z_k)c_k
 =\sum_\gamma k_\gamma
 \left|\sum_{k=1}^N{c_k\over\gamma-\overline{z_k}}
 \right|^2\geq0.                                    \tag{5.4}
\]

This proves the forward implication in (0.7), including multiple zeros.

Conversely, suppose `P_m` is a finite, positive-semidefinite kernel on all
of `C_+`.  In particular, `m` is holomorphic there and

\[
 \mathcal P_m(z,z)={\Im m(z)\over\Im z}\geq0.        \tag{5.5}
\]

Thus `m` is a Pick--Herglotz function.  A zero of `Xi` in `C_+` would be a
pole of `m`, contradicting holomorphy on that domain.  Real-entire symmetry
then excludes zeros in `C_-` as well.  Every zero is real, proving RH.

The phrase "on all of `C_+`" is essential.  Positivity of one finite
principal matrix, or on a finite set avoiding an off-real pole, does not
imply that `m` is a global Pick function.

## 6. Global generator condition versus the realized packet

Under RH, (0.8) and (5.3) give the completed carrier features

\[
 v_\gamma(z)=\sqrt{k_\gamma}
 {\Xi(z)\over\gamma-z},\qquad
 \Xi(z)\overline{\Xi(w)}\mathcal P_m(z,w)
 =\sum_\gamma v_\gamma(z)\overline{v_\gamma(w)}.     \tag{6.1}
\]

A theorem asserting (6.1) unconditionally for every generator in the
upper half-plane would establish the middle condition in (0.7), hence RH.
Calling that statement a missing routine Gram lemma would hide its exact
logical strength.

The growing-transition packet has a different quantifier structure.  It
uses finitely many physical source columns at each `lambda`, integrates
the carrier kernel against their actual profiles, retains the finite-`L`
tail and endpoint rows, whitens by the physical exterior Gram, and only
then takes the locked limit.  Its required inequality is a compression

\[
 P_E\widehat Q_{\rm packet}P_E\succeq-o(\tau_L)P_E,  \tag{6.2}
\]

not the global kernel assertion `P_m succeq 0` on `C_+`.

A finite compression may be positive even when another principal matrix
of the global kernel is negative or when `m` has an off-real pole outside
the sampled set.  Conversely, the global Pick condition would be far
stronger than needed for one packet.  Formula (0.7) therefore marks the
exact boundary: a successful packet-specific sector-mixing estimate must
use its restricted physical geometry and must not assume global carrier
Pick positivity.

## 7. Conclusion

The complete carrier core has the exact paired-zero factorization

\[
 \mathcal K_Z(s,t)=-\sum_\rho
 {\sqrt2Z(s)\over s-\rho}{\sqrt2Z(t)\over t-\rho}.    \tag{7.1}
\]

After the critical-variable rotation and gamma conjugation, its divided
difference is the Pick kernel of `-Xi'/Xi`.  Positivity of that kernel on
the whole upper half-plane is equivalent to RH.  The identity is exact;
the positivity is not available unconditionally.  Nothing here promotes
a special realized packet compression to the global Pick condition, and
no RH conclusion is claimed.
