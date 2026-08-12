# Lower-Ritz actual-multiplier forcing-adapted safe-elimination theorem

## 0. Exact outcome and strict scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad N=2^{9600\lambda^2}.          \tag{0.1}
\]

Write the inversion-even block and its genuine lower two-vector Ritz shift
as

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix},\qquad
 u=\lambda_{\min}\left(
 Q_+|_{\operatorname {span}\{\kappa,b\}}\right),\qquad
 t=q-u\geq0.                                         \tag{0.2}
\]

The fixed source theorem gives

\[
 q\sim c_qd_4L>0,\qquad c_q>0,                       \tag{0.3}
\]

so the actual multiplier construction may be rebased at the eventually
nonnegative upper shift `U=q`.  Fix constants `g>delta>0` in that
construction.  Then `g+q=O(L)` and `g-delta` is not exponentially small, so
its frozen absolute phase-volume rank estimate applies.  Every inverse
statement below is conditional on the unproved strict lower-Ritz branch

\[
 B_u:=A-uI\succ0.                                    \tag{0.4}
\]

Perform the already defined positive far elimination and positive captured
elimination.  Let

\[
 \mathsf G_u:\mathcal R\longrightarrow\mathcal K,
 \qquad
 R_1=\mathsf G_u^*B_u\mathsf G_u,
 \qquad
 \rho_1=\mathsf G_u^*b                              \tag{0.5}
\]

be their exact combined harmonic lift, retained short, and returned forcing
row.  Let `Pi_q` be the physical complete-symbol multiplier-dangerous
projector at `U=q`, with safe floor `delta>0`.  Define the
**forcing-adapted dangerous space**

\[
 \boxed{
 \mathcal D_\rho
 =\operatorname {Ran}(\mathsf G_u^*\Pi_q)
       +\operatorname {span}\{\rho_1\},\qquad
 \mathcal F_\rho=\mathcal R\ominus\mathcal D_\rho.} \tag{0.6}
\]

Then

\[
 \boxed{
 \dim\mathcal D_\rho
 \leq\dim\operatorname {Ran}\Pi_q+1
 \leq\exp(O(\lambda))+1.}                          \tag{0.7}
\]

If `i_F` includes `mathcal F_rho` into `mathcal R` and

\[
 W_F=\mathsf G_ui_F,\qquad
 H_F=W_F^*B_uW_F,\qquad f_F=W_F^*b,                 \tag{0.8}
\]

then two exact orthogonality identities give

\[
 \boxed{\Pi_qW_F=0,\qquad f_F=0.}                   \tag{0.9}
\]

Consequently

\[
 \boxed{
 H_F\succeq(\delta+t)W_F^*W_F
       \succeq(\delta+t)I_{\mathcal F_\rho},
 \qquad f_F^*H_F^{-1}f_F=0.}                       \tag{0.10}
\]

Thus the post-far/post-capture multiplier-safe inverse forcing energy is
closed exactly, not merely bounded by `O(d_4 L)`.  Relative to
`mathcal R=mathcal D_rho direct-sum mathcal F_rho`, write

\[
 R_1=\begin{pmatrix}D_\rho&\Gamma_\rho^*\\
                     \Gamma_\rho&H_F\end{pmatrix},
 \qquad
 \rho_1=\binom{d_\rho}{0}.                           \tag{0.11}
\]

Then the complete retained inverse row reduces exactly to

\[
 \boxed{
 \rho_1^*R_1^{-1}\rho_1
 =d_\rho^*S_\rho^{-1}d_\rho,\qquad
 S_\rho=D_\rho-\Gamma_\rho^*H_F^{-1}\Gamma_\rho.} \tag{0.12}
\]

This is a coordinate reduction, not the desired determinant-scale bound.
The remaining forcing lies on the source-defined space of dimension at most
`exp(O(lambda))+1`, and no theorem here proves

\[
 d_\rho d_\rho^*\preceq C d_4L S_\rho.              \tag{0.13}
\]

The result is distinct from the original half-power anchor-to-far row
`b_F=P_Fb`.  That row is a raw high-Fourier projection and is controlled by
fixed-anchor BV/Cauchy decay.  The row in (0.8) is pulled through two
harmonic eliminations and an actual-multiplier safe projector; it need not
be a raw Fourier tail.  Its vanishing comes from the one-dimensional
forcing adaptation in (0.6), not from a second use of the half-power bound.

This theorem proves neither (0.13), the strict lower-Ritz branch, either
complete sector sign, equation (5.2) of `DIRECT_RH_ATTACK.md`, a determinant
limit, a zero statement, RH, nor a de Bruijn--Newman `Lambda` bound.  The
formal state remains `P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following exact repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/LOWER_RITZ_POST_FAR_RETAINED_INVERSE_ROW_THEOREM.md` | `9288ac25216781416d0bb1d0ef7d2a11f3dd09bac8e8f04195ac9b3e928229f3` |
| `tests/test_lower_ritz_post_far_retained_inverse_row_theorem.py` | `8f2aa9cb6daca472d75a890520c23dfd1b5dcb487e8454b1c12b598b61a58327` |
| `notes/GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md` | `cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e` |
| `tests/test_growing_mixed_bridge_actual_multiplier_dangerous_feshbach_reduction.py` | `1bbe3d751efedb86ab412921a5f99d243b1ebffef33afe325e2930a5d5670a0c` |
| `notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md` | `04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83` |
| `tests/test_fixed_source_block_shift_asymptotic_theorem.py` | `433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5` |

The first pair fixes (0.5) with every far and captured return retained.  The
second pair fixes the actual complete-symbol projector, its physical safe
floor, its phase-volume rank bound, and its pullback duality.  The final pair
fixes (0.3), so `U=q` is an admitted nonnegative multiplier shift eventually.
No positive zero-sampling, compact-BV, or generic absolute-sampling estimate
is used.

More explicitly, `Pi_q` is the even block of the paired physical projector
at `U=q`.  Equivalently, embed the anchor-compressed even physical space into
the paired space and use the paired projector there.  The paired safe floor
restricts to this block, while its rank is no larger than the paired rank in
the second frozen note.  Thus no odd-sector vector is silently inserted into
the even returned row.

## 2. The twice-harmonic lift keeps an identity coordinate

Write the first far split as `mathcal K=Y direct-sum mathcal F` and its
harmonic lift as

\[
 \mathsf E_Fy=(y,-H_u^{-1}\Gamma_uy).                 \tag{2.1}
\]

After splitting `Y=mathcal C direct-sum mathcal R`, the captured harmonic
lift is

\[
 \mathsf E_Cz=(-P^{-1}X^*z,z).                       \tag{2.2}
\]

The combined lift is `mathsf G_u=mathsf E_F mathsf E_C`.  Both maps retain
their input as an orthogonal coordinate.  Therefore

\[
 \|\mathsf G_uz\|^2
 \geq\|\mathsf E_Cz\|^2
 \geq\|z\|^2,
 \qquad
 \boxed{\mathsf G_u^*\mathsf G_u\succeq I_{\mathcal R}.} \tag{2.3}
\]

This fact uses neither a norm bound for either shear nor a floor on the
retained short.  It is the source of the second inequality in (0.10).

## 3. Multiplier pullback plus forcing adaptation

At `U=q`, let

\[
 B_q=A-qI,
 \qquad B_u=B_q+tI.                                  \tag{3.1}
\]

The actual multiplier theorem gives

\[
 P_{\Pi_q^\perp}B_qP_{\Pi_q^\perp}
 \succeq\delta P_{\Pi_q^\perp}.                    \tag{3.2}
\]

Take `z in mathcal F_rho`.  Orthogonality to the first summand in (0.6)
gives, for every physical vector `x`,

\[
 \langle\Pi_q\mathsf G_uz,x\rangle
 =\langle z,\mathsf G_u^*\Pi_qx\rangle=0.           \tag{3.3}
\]

Thus `Pi_q mathsf G_u z=0`.  Orthogonality to the second summand gives

\[
 \langle b,\mathsf G_uz\rangle
 =\langle\mathsf G_u^*b,z\rangle
 =\langle\rho_1,z\rangle=0.                         \tag{3.4}
\]

Equations (3.3)--(3.4) prove (0.9).  Equations (3.1)--(3.3) and (2.3)
then give, for every `z in mathcal F_rho`,

\[
 \begin{aligned}
 \langle z,H_Fz\rangle
 &=\langle\mathsf G_uz,B_u\mathsf G_uz\rangle\\
 &\geq(\delta+t)\|\mathsf G_uz\|^2\\
 &\geq(\delta+t)\|z\|^2.
 \end{aligned}                                      \tag{3.5}
\]

This proves (0.10).  Notice that the adapted space uses `rho_1`, not the raw
projection of `b` onto `mathcal R`.  Replacing it by the raw row would drop
the far and captured returns.

The dimension estimate is elementary:

\[
 \begin{aligned}
 \dim\mathcal D_\rho
 &\leq\operatorname {rank}(\mathsf G_u^*\Pi_q)+1\\
 &\leq\operatorname {rank}\Pi_q+1.
 \end{aligned}                                      \tag{3.6}
\]

The phase-volume theorem at `U=q` supplies the last inequality in (0.7).

## 4. Exact inverse-row elimination

Under (0.4), the post-far theorem gives `R_1>0`.  Equation (0.10) gives
`H_F>0`.  Relative to (0.11), exact Gaussian factorization gives

\[
 R_1=\begin{pmatrix}I&\Gamma_\rho^*H_F^{-1}\\0&I\end{pmatrix}
 \begin{pmatrix}S_\rho&0\\0&H_F\end{pmatrix}
 \begin{pmatrix}I&0\\H_F^{-1}\Gamma_\rho&I\end{pmatrix}. \tag{4.1}
\]

Hence `S_rho>0`.  Applying the inverse factorization to the row
`(d_rho,0)` proves (0.12).  Equivalently, the usual two-term identity is

\[
 \rho_1^*R_1^{-1}\rho_1
 =f_F^*H_F^{-1}f_F
  +(d_\rho-\Gamma_\rho^*H_F^{-1}f_F)^*
    S_\rho^{-1}
   (d_\rho-\Gamma_\rho^*H_F^{-1}f_F),               \tag{4.2}
\]

and `f_F=0` reduces it to (0.12).  No inverse of `R_1` is used to define
the adapted space, so this is not a circular Riesz-representer construction.

## 5. Strict stopping point

The multiplier-safe forcing row is now absent.  The exact remaining target
is the forcing-adapted dangerous one-row estimate

\[
 \boxed{d_\rho d_\rho^*\preceq C d_4L S_\rho.}      \tag{5.1}
\]

Its carrier has dimension at most `exp(O(lambda))+1`, but rank reduction is
not an energy estimate.  Source-Cauchy displacement leaves free diagonal
data, and phase volume controls only the carrier dimension.  Neither fact
proves (5.1).

If one insists on the unadapted multiplier split

\[
 \mathcal D_0=\operatorname {Ran}(\mathsf G_u^*\Pi_q),
 \qquad\mathcal F_0=\mathcal R\ominus\mathcal D_0,   \tag{5.2}
\]

then its safe row need not vanish and requires a separate
sampling-to-signed-energy comparison.  Equation (0.6) shows that this is a
coordinate choice, not an intrinsic obstruction to reducing the complete
inverse row.  Adding the one exact returned forcing direction removes it
without changing the multiplier floor or the exponential rank class.

No standard-eight file, source lock, replay output, or formal-status file is
changed.

## 6. Reproduction

Run

    python3 -B -m unittest \
      tests.test_lower_ritz_actual_multiplier_forcing_adapted_safe_elimination_theorem -v

The regression checks all six frozen hashes, the twice-harmonic identity
coordinate, multiplier-pullback orthogonality, forcing annihilation, safe
floor, exact inverse-row factorization, dimension increment, displayed TeX,
ASCII hygiene, and the fail-closed scope.
