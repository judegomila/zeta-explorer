# Transported signed-kernel left reserve and shrinking-forcing action barrier

## 0. Outcome and claim boundary

This note identifies the exact signed estimate still missing after the
positive-sampling low-block forcing theorem.  For the combined label-8/rest
physical low range, the left-preconditioned defect is exactly the source
defect transported by the normalized synthesis:

\[
 \rho_L
 =\|\Delta_L^{-1}(B_L-\Delta_L)\|
 =\|A E_L A^\dagger\|.                                  \tag{0.1}
\]

The identity includes every label-8/rest correlation and remains valid when
the combined synthesis is noninjective.  The cancellation-preserving
Chebyshev rewrite below then displays the complete missing signed kernel.
The admitted positive zero-sampling bounds and the pinned unconditional
Chebyshev-error moments do not estimate that kernel in the required relative
metric.

An exact rational two-dimensional family makes the logical gap sharp.  Its
positive-sampling forcing tends to zero and saturates the available forcing
inequality, while its signed inverse action diverges.  Each member has the
pointwise reserve `rho_L<1`, but no uniform reserve.  The family is an
implication countermodel, not an actual prolate--Weil realization; it neither
proves that the actual reserve fails nor disproves a possible source-specific
estimate.

In particular, this note does **not** prove an actual residual-action bound,
equation (5.2) of `DIRECT_RH_ATTACK.md`, a sector floor, determinant
convergence, RH, or a Lambda bound.  No status, replay, source-lock, or
integration file is changed.

## 1. Frozen dependencies

The reduction uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md` | `9700501a367ea7ae2b843ee61b45bec3970fc35db1715613099b08439be0415c` |
| `notes/CHEBYSHEV_ERROR_REWRITE.md` | `164482f280284c49eda27c6d22607f32d5e16db4ab053b965c97f8bbd81db20a` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `notes/LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md` | `93457a821e2fcf3771201af6cc4673ac5a4cd2410be722ad94f2d9f881f3e329` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |

## 2. Exact transport of the signed quotient defect

Use the block-diagonal source metric and combined physical synthesis

\[
 X_L=X_8\oplus X_R,\qquad
 D_{\rm bd}=D_8\oplus D_R,\qquad
 A=W_LD_{\rm bd}^{-1/2}=[\,A_8\;A_R\,].                 \tag{2.1}
\]

Put

\[
 K_L=\operatorname {ran}A,\qquad
 P_0=A^\dagger A=1_{(\ker A)^\perp},\qquad
 P_K=AA^\dagger,                                         \tag{2.2}
\]

and, only on `K_L`,

\[
 \Delta_L=(AA^*)^\dagger\big|_{K_L},\qquad
 \Delta_L^{-1}=AA^*\big|_{K_L}.                         \tag{2.3}
\]

Let

\[
 B_L=P_K(Q-U_0I)P_K\big|_{K_L}                           \tag{2.4}
\]

and define the Hermitian, `P_0`-supported source defect

\[
 \boxed{E_L=A^*B_LA-P_0.}                               \tag{2.5}
\]

The support assertion follows from `AP_0=A` and `P_0A^*=A^*`.  Since
`AA^*\Delta_L=I_{K_L}` and `AA^\dagger=I_{K_L}`, direct multiplication gives

\[
\begin{aligned}
 A E_L A^\dagger
 &=AA^*B_LAA^\dagger-AP_0A^\dagger\\
 &=AA^*B_L-I_{K_L}\\
 &=\Delta_L^{-1}(B_L-\Delta_L).
\end{aligned}                                            \tag{2.6}
\]

Thus the still-unproved hypothesis in the low-block action theorem is
exactly

\[
 \boxed{\|A E_L A^\dagger\|\leq\rho_0<1}               \tag{2.7}
\]

with one `lambda`-independent `rho_0`.  This is an identity, not an estimate.
If `A=(AA^*)^{1/2}V` is the polar decomposition on `ran P_0`, then `V` is a
unitary map from `ran P_0` onto `K_L` and

\[
 \|E_L\|
 =\|\Delta_L^{-1/2}(B_L-\Delta_L)\Delta_L^{-1/2}\|.     \tag{2.8}
\]

Thus `||E_L||` is exactly the Hermitian, two-sided relative defect and gives
the corresponding two-sided Loewner comparison.  It is generally **not**
equal to the left-preconditioned norm in (2.7): that norm uses the
nonunitary similarity transport by `A` and `A^dagger`.
The rational countermodel in Section 4 takes `A=I`, so its obstruction is
present even without a co-frame conditioning loss.

## 3. The complete label-8/rest Chebyshev-error target

Let `q_kappa=<kappa,Q kappa>` be the Rayleigh shift used in the
cancellation-preserving rewrite, and define

\[
 G(s)=e^s-\psi_C(e^s)-\frac12\log(1-e^{-2s}).             \tag{3.1}
\]

For `x,y in ran P_0`, put `v=Ax`, `w=Ay`.  Equations (2.5) and (4.4) of
`CHEBYSHEV_ERROR_REWRITE.md` give the exact bilinear identity

\[
\boxed{
 \begin{aligned}
 \langle x,E_Ly\rangle
 ={}&(q_\kappa-U_0)\langle Ax,Ay\rangle-\langle x,y\rangle\\
 &-\int_0^L G(s)\frac d{ds}
   \left(e^{-s/2}\omega^q_{Ax,Ay}(s)\right)\,ds .
 \end{aligned}}                                          \tag{3.2}
\]

This one expression already combines the pole, archimedean, and
minus-prime contributions before any absolute value is taken.

Let `i_8:X_8->X_L` and `i_R:X_R->X_L` be the coordinate inclusions.  The
complete label-8/rest source entry is therefore

\[
\boxed{
 \begin{aligned}
 E_{8R}:=i_8^*E_Li_R
 ={}&(q_\kappa-U_0)A_8^*A_R-i_8^*P_0i_R-\mathcal T_{8R},\\
 \langle x_8,\mathcal T_{8R}y_R\rangle
 :={}&\int_0^L G(s)\frac d{ds}
 \left(e^{-s/2}\omega^q_{A_8x_8,A_Ry_R}(s)\right)\,ds .
 \end{aligned}}                                          \tag{3.3}
\]

If `A` is injective, then `P_0=I` and the coordinate off-diagonal
`i_8^*P_0i_R` vanishes, so `E_8R=A_8^*B_LA_R`.  In the noninjective case the
projection term in (3.3) must not be dropped: the correct object is the full
`P_0`-compressed defect (2.5), transported as in (2.6).

The growing-transition theorem controls the positive paired-zero objects

\[
 \|SA_8\|^2\leq C_8,\qquad \|SA_R\|^2\leq C_R,           \tag{3.4}
\]

including their row-operator cross term, and hence closes the forcing factor
in the low-block theorem.  Those are positive `S^*S` correlations.  By
contrast, `mathcal T_8R` is a signed correlation derivative against `G`.
The lock `P3_SOURCE_LOCK.json` proves only finite `L^2` and first weighted
`L^2` moments for the normalized combined kernel

\[
 \delta_*(s)=e^{-s}G(s).                                 \tag{3.5}
\]

Moment finiteness does not compare (3.2) with `D_bd`, choose its sign, or
bound its label-8/rest phase.  Thus neither (3.4) nor the admitted P3 moments
implies (2.7).  The minimal missing phase-sensitive statement is precisely
the uniform full-matrix inequality (2.7), equivalently a uniform bound on
all diagonal and cross entries in (3.2) after the same `A`/`A^dagger`
transport.  Alternatively, a uniform lower comparison
`B_L>=mu Delta_L`, `mu>0`, would suffice for action through the
dominating-action theorem, but it does not imply (2.7).  Neither route is
currently proved.

### 3.1 Endpoint cancellation and P3 moments alone allow an arbitrary formal entry

There is a sharp formal reason that moment finiteness cannot choose the
missing sign.  Work on `[0,L]`, let `d=delta_*`, let `r(s)=e^{-s}`, and use
the real `L^2` inner product.  Define

\[
 h=d-\frac{\langle d,r\rangle}{\langle r,r\rangle}r,
 \qquad J=\langle d,h\rangle=\|h\|_2^2>0.                \tag{3.6}
\]

The P3 moments make these quantities finite.  Moreover `J>0`: near zero,
`d(s)=1-(1/2)log(2s)+O(s|log s|)`, so `d` is not proportional to the bounded
function `r` on any interval of positive length.

For any finite Hermitian matrix `T`, set

\[
 F(s)=-\frac{h(s)}J T,
 \qquad
 \Omega(s)=e^s\int_0^s e^{-t}F(t)\,dt.                  \tag{3.7}
\]

Then `Omega'-Omega=F`, `Omega(0)=0`, and orthogonality ` <r,h>=0` gives
`Omega(L)=0`.  The signed kernel entry is exactly

\[
 -\int_0^L d(s)(\Omega'(s)-\Omega(s))\,ds
 ={\langle d,h\rangle\over J}T=T.                       \tag{3.8}
\]

Taking the formal correlation `omega(s)=e^{-s/2}Omega(s)` also gives both
correlation endpoints zero and turns (3.8) into the integral in (3.2).
This is only a formal matrix-correlation model satisfying the endpoint and
P3-moment constraints.  It is not asserted to arise from actual prolate
source states, to satisfy their additional correlation identities, or to
preserve the positive sampling data.  Its exact role is narrower: the
Chebyshev rewrite, endpoint cancellation, and admitted kernel moments alone
place no sign or size restriction on `mathcal T_8R`.

## 4. Shrinking forcing with divergent signed action

Fix a rational number `0<f<1` and set

\[
 \delta=f^2.                                              \tag{4.1}
\]

Take `X_8=X_R=R`, `K_L=R^2`, and the exact positive data

\[
 D_{\rm bd}=W_L=A=\Delta_L=S=G_L=P_0=I_2.               \tag{4.2}
\]

Consequently

\[
 C_8=C_R=M_8=M_R=\Gamma_L=1.                             \tag{4.3}
\]

Choose

\[
 c_f=f\begin{bmatrix}1\\-1\end{bmatrix},\qquad
 \epsilon_f=2f^2.                                        \tag{4.4}
\]

Then the complete positive forcing data hold sharply:

\[
 c_fc_f^*\preceq\epsilon_fG_L,qquad
 \|\Delta_L^{-1}c_f\|^2=2f^2
 =\epsilon_f\Gamma_L.                                   \tag{4.5}
\]

Indeed, `c_fc_f^*` has eigenvalues `0,2f^2`; equivalently,

\[
 \epsilon_fI_2-c_fc_f^*
 =f^2\begin{bmatrix}1&1\\1&1\end{bmatrix}\succeq0.     \tag{4.6}
\]

Now define the signed low operator

\[
 B_\delta=
 \begin{bmatrix}1&1-\delta\\1-\delta&1\end{bmatrix}.    \tag{4.7}
\]

Its two diagonal label-8/rest compressions still equal the target metric.
Its eigenpairs are exact:

\[
 B_\delta(1,-1)^T=\delta(1,-1)^T,\qquad
 B_\delta(1,1)^T=(2-\delta)(1,1)^T.                      \tag{4.8}
\]

Hence `B_delta>0` for every member of the family.  Nevertheless,

\[
 E_L=B_\delta-I_2
 =\begin{bmatrix}0&1-\delta\\1-\delta&0\end{bmatrix},
 \qquad
 \rho_L=\|E_L\|=1-\delta=1-f^2,                         \tag{4.9}
\]

and

\[
 B_\delta^{-1}c_f=\delta^{-1}c_f,
 \qquad
 \boxed{\|B_\delta^{-1}c_f\|^2={2\over f^2}.}           \tag{4.10}
\]

Thus `||Delta_L^-1 c_f||=sqrt(2)f` tends to zero while the signed action
`||B_delta^-1 c_f||=sqrt(2)/f` diverges.  Any rational sequence `f->0` may
be placed at or below a prescribed shrinking forcing scale.  Every fixed
member satisfies `rho_L<1`, but `1-rho_L=f^2->0`; pointwise invertibility is
therefore not the uniform reserve required by the conditional action
theorem.

The boundary is equally exact.  Keeping all positive data (4.2)--(4.5)
fixed while replacing the off-diagonal coupling in (4.7) by `r=1` gives
`rho_L=1` and a singular signed operator.  Any rational `r>1` gives
`rho_L>1` and determinant `1-r^2<0`, while both diagonal compressions and
all positive-sampling data remain unchanged.

## 5. Relation to the checkpoint-0.91 barrier and final scope

Section 4 of `LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md` used the fixed
forcing `(1,-1)^T` while its signed eigenvalue tended to zero.  That proved
that diagonal signed marginals do not determine inverse action.  The new
family couples the small eigenvalue to the forcing by `delta=f^2` and
`c_f=f(1,-1)^T`: the forcing itself now shrinks and exactly saturates the
available positive forcing inequality, yet the action still diverges.

Accordingly, the positive forcing factor proved at checkpoint 0.91 cannot be
promoted to an action estimate without a uniform version of (2.7).  The
countermodel does not assert that the actual Chebyshev kernel realizes
(4.7); it proves only that the currently admitted positive label-8/rest
sampling data and P3 moment data leave that implication open.  The actual
next analytic target is the transported, phase-sensitive signed-kernel
comparison (2.7), with the complete cross term (3.3), on one common schedule
and in both parities.
