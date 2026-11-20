# Growing-transition odd-Laplace middle-band alias-frame obstruction theorem

## 0. Exact result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad L=2\log\lambda,\qquad
 h={\pi\over4}.                                      \tag{0.1}
\]

This note isolates the row range which a proof of the physical
zeta--Hurwitz feature-angle inequality cannot estimate away.  Let

\[
 W_\gamma(\rho)={1\over\sqrt{1+\rho^2}}
 \exp\left\{-{\gamma\over2}\arctan{1\over\rho}\right\},
 \qquad \rho>0,                                      \tag{0.2}
\]

be the exact flat Kummer Laplace row.  For a forward high--low pair put

\[
 \Delta=\alpha-\beta=CL+d_L,qquad |d_L|\leq D,qquad C>0. \tag{0.3}
\]

Then the normalized local odd-row product is

\[
 F_\Delta(\rho):=W_{-\alpha}(\rho)W_\beta(\rho)
 ={1\over1+\rho^2}
  \exp\left\{{\Delta\over2}\arctan{1\over\rho}\right\}. \tag{0.4}
\]

The following conclusions are unconditional within the frozen flat local
model.

1.  The odd lattice is an exact Riemann discretization of the local
    Cauchy kernel:

    \[
     {2\over c}\sum_{\nu\geq1}
       F_\Delta\left({2\nu+1\over c}\right)
     ={2\{e^{h\Delta}-1\}\over\Delta}
       +O_D\left({e^{h\Delta}\over c}\right).        \tag{0.5}
    \]

2.  For fixed `0<=a<b`, the band with
    `(2*nu+1)/c in [a/L,b/L]` contains the fixed fraction

    \[
    \boxed{
     {2\over c}\sum_{a/L\leq(2\nu+1)/c\leq b/L}
       F_\Delta\left({2\nu+1\over c}\right)
     ={2e^{h\Delta}\over CL}
       \{e^{-Ca/2}-e^{-Cb/2}\}\{1+o(1)\}.}          \tag{0.6}
    \]

    It contains `Theta(c/L)` odd rows.  Thus the dangerous rows have
    `z=Theta(c/L)`, not fixed `z` and not merely the fixed-`lambda`
    endpoint tail `z to infinity`.

3.  If `Y_L=K log L` and `K>8m/C`, the truncated band

    \[
       3\leq z=2\nu+1\leq {cY_L\over L}              \tag{0.7}
    \]

    recovers the fixed-`m` two-cluster Cauchy matrix in operator norm down
    to its smallest singular scale:

    \[
     \left\|R_{\rm flat}-R_{\rm mid}\right\|
       =o\left({e^{hCL}\over L^{2m-1}}\right).        \tag{0.8}
    \]

    After the frozen physical radial factors this is
    `o(e^(hCL)/L^(2m))` in exact exterior-defect-white coordinates.

4.  Deleting or nulling the single `z=1` inward row cannot create a
    conductor-power gap.  More generally, on the `m`-dimensional local
    negative spectral space, imposing any fixed `r<m` source or endpoint
    rows leaves at least `m-r` directions on which the middle band still
    has the local negative scale, up to `o(tau_L)`, where

    \[
       \tau_L={c^{hC+o(1)}\over L^{2m}}.              \tag{0.9}
    \]

5.  Consequently a favorable full continuous feature-angle theorem, if
    true, must use a coherent same-scale cancellation between (0.7) and
    the generalized-harmonic/Hurwitz alias pieces in `t_z,p_z`.  A
    rowwise Weber exponent gap, a fixed number of endpoint jets, or the
    fixed-`lambda` high-odd expansion cannot prove it.

The physical full-profile sign is **not** decided here.  In particular,
this note proves neither that the Bernoulli/Hurwitz aliases cancel (0.7)
nor that they reinforce it.  It constructs no physical compact-prolate
counterpacket to the one-sided lemma.  It proves no complete continuous
sign, no ordered-prime sign, no sector-resolving intertwiner, no complete
central sign, no RH statement, and no Lambda bound.  The project state
remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md` | `1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d` |
| `tests/test_growing_transition_edge_carleman_scattering_obstruction.py` | `b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb` |
| `notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md` | `6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c` |
| `tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py` | `626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34` |
| `notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md` | `7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564` |
| `tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py` | `caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c` |
| `notes/GROWING_TRANSITION_ODD_LAPLACE_ZETA_HURWITZ_FEATURE_ANGLE_REDUCTION_THEOREM.md` | `aaa5b189075b308f3d0ea0c0908ad36d4d871f4ce6626ff74ed9c730a09a0723` |
| `tests/test_growing_transition_odd_laplace_zeta_hurwitz_feature_angle_reduction_theorem.py` | `1bf0cec43d31d1d0f48899be0615faab108b99e86ef446894a8cdec807329a74` |

No external source, zero table, prime estimate, or numerical prolate data
is used.

## 2. Exact Kummer row product

The frozen flat regular solution has Laplace transform

\[
 \int_0^\infty e^{-\rho U}w_\gamma(U)\,dU
 ={1\over\sqrt{1+\rho^2}}
  \exp\left\{-{\gamma\over2}\arctan{1\over\rho}\right\}.
                                                               \tag{2.1}
\]

The inward edge uses `w_(-alpha)` and the outward edge uses `w_beta`.
Multiplication proves (0.4).  Since

\[
 {d\over d\rho}\arctan{1\over\rho}
 =-{1\over1+\rho^2},                                  \tag{2.2}
\]

`F_Delta` is positive and strictly decreasing when `Delta>0`.

Set

\[
 \vartheta=\arctan{1\over\rho}.
\]

Then `d rho/(1+rho^2)=-d vartheta`, and the endpoints
`rho=0,infinity` correspond to `vartheta=pi/2,0`.  Therefore

\[
 \boxed{
 \int_0^\infty F_\Delta(\rho)\,d\rho
 =\int_0^{\pi/2}e^{\Delta\vartheta/2}\,d\vartheta
 ={2\{e^{h\Delta}-1\}\over\Delta}.}                 \tag{2.3}
\]

This is exactly the flat forward Cauchy entry already frozen in the local
two-cluster theorem.  It is not merely comparable to that entry.

## 3. Odd-lattice Riemann sum

The mesh of `rho_(nu)=(2nu+1)/c` is `2/c`.  For a positive decreasing
function, upper and lower rectangular sums differ by at most one mesh
times its left endpoint.  Hence

\[
 \left|{2\over c}\sum_{\nu\geq1}F_\Delta(\rho_\nu)
       -\int_{3/c}^\infty F_\Delta(\rho)\,d\rho\right|
 \leq {2\over c}F_\Delta(3/c).                       \tag{3.1}
\]

The omitted integral from zero to `3/c` has the same bound up to an
absolute factor.  Since `F_Delta(0+)=e^(h Delta)`, (2.3)--(3.1) prove
(0.5).  The exclusion of `z=1` changes the normalized sum by only

\[
 {2\over c}F_\Delta(1/c)
 =O\left({e^{h\Delta}\over c}\right),                \tag{3.2}
\]

which is smaller than `e^(hCL)/L^M` for every fixed `M`.

The same monotone-sum argument on a finite interval gives, uniformly for
fixed `0<=a<b`,

\[
 {2\over c}\sum_{a/L\leq\rho_\nu\leq b/L}
 F_\Delta(\rho_\nu)
 =\int_{a/L}^{b/L}F_\Delta(\rho)\,d\rho
 +O_D\left({e^{h\Delta}\over c}\right).             \tag{3.3}
\]

There are

\[
 {c(b-a)\over2L}+O(1)                                \tag{3.4}
\]

odd lattice points in this interval.

## 4. The `z=Theta(c/L)` asymptotic

Put `rho=y/L`.  Uniformly for `y` in a fixed compact interval,

\[
 \arctan{1\over\rho}
 ={\pi\over2}-\arctan\rho
 ={\pi\over2}-{y\over L}+O\left({1\over L^3}\right). \tag{4.1}
\]

Together with `Delta=CL+O(1)`, this yields

\[
 F_\Delta(y/L)
 =e^{h\Delta}e^{-Cy/2}\{1+o(1)\}.                    \tag{4.2}
\]

After `d rho=dy/L`, equations (3.3) and (4.2) prove (0.6).  Notice the
three distinct row regimes.

* Fixed `z` has `rho=o(1/L)` and sees essentially the common coefficient
  `e^(h alpha)`.
* The middle band `z=Theta(c/L)` changes that coefficient by the order-one
  factor `e^(-Cy/2)` and supplies the forward Cauchy mass.
* Only beyond this band does the endpoint large-`z` expansion begin to
  suppress the forbidden-action coefficient uniformly.

Thus a fixed-`lambda` expansion as `z to infinity` does not commute with
the growing transition.

## 5. Logarithmically enlarged band and the smallest Cauchy scale

Let

\[
 Y_L=K\log L,\qquad r_L={Y_L\over L}.                \tag{5.1}
\]

For large `L`, `r_L<1`.  On `0<=rho<=1`,
`arctan rho>=rho/2`, so

\[
 F_\Delta(\rho)
 \leq e^{h\Delta}e^{-\Delta\rho/4}.                  \tag{5.2}
\]

It follows that

\[
 \int_{r_L}^1F_\Delta(\rho)\,d\rho
 \leq {4e^{h\Delta}\over\Delta}
       e^{-\Delta r_L/4}
 =O_D\!\left({e^{h\Delta}\over L^{KC/4+1}}\right).  \tag{5.3}
\]

For `rho>=1`, `arctan(1/rho)<=pi/4`, and hence

\[
 \int_1^\infty F_\Delta(\rho)\,d\rho
 \leq {\pi\over2}e^{h\Delta/2}.                     \tag{5.4}
\]

The second term has a fixed conductor-power gap from `e^(h Delta)`.
If `K>8m/C`, (5.3)--(5.4), the odd-mesh error, and fixed dimensionality
give

\[
 \|R_{\rm flat}-R_{\rm mid}\|
 =o\left({e^{hCL}\over L^{2m-1}}\right),             \tag{5.5}
\]

uniformly on the two fixed offset sets.  The exact Cauchy inverse in the
frozen local theorem gives

\[
 s_{\min}(R_{\rm flat}^{HL})
 \geq c_m{e^{hCL}\over L^{2m-1}}.                    \tag{5.6}
\]

Thus (5.5) proves (0.8) by Weyl's inequality.  This argument uses an
operator-norm tail smaller than the smallest singular value; an entrywise
`o(1)` relative error would not suffice.

Here `R_flat` means the Hermitian dominant two-cluster matrix with
high--low block (2.3), low--high adjoint block, and zero diagonal blocks.
The matrix `R_mid` is defined identically with its high--low block replaced
by the odd sum in (0.7).  The reverse exponential, same-cluster blocks, and
the frozen curved-to-flat errors are already `o(e^(hCL)/L^(2m-1))` in the
local theorem and do not alter (5.5).

The realized modal theorem supplies exact exterior-defect whitening and
pair factors

\[
 {\lambda\over4c}(1+\chi_\alpha)\chi_\beta
 z_\alpha z_\beta
 ={\pi\over4\sqrt{J_\alpha J_\beta}}\{1+o(1)\}
 =\Theta(L^{-1}).                                    \tag{5.7}
\]

Their fixed-dimensional condition number is bounded.  Multiplication by
these diagonal factors changes (5.5)--(5.6) by one power of `L`, proving
the exterior-white sentence following (0.8).

## 6. Why `A_1=0` does not remove the band

Let `E_-` be the `m`-dimensional negative spectral space of the local
two-cluster matrix.  Every unit vector in `E_-` obeys

\[
 \langle Q_{\rm loc}x,x\rangle
 \leq-c_m{e^{hCL}\over L^{2m}}                       \tag{6.1}
\]

in the physical exterior-white metric.  For any fixed rows
`ell_1,...,ell_r`, including `mathcal A_1`,

\[
 \dim\left(E_-\cap\bigcap_{j=1}^r\ker\ell_j\right)
 \geq m-r.                                           \tag{6.2}
\]

When `r<m`, combine (0.8) with (6.1)--(6.2).  On the resulting nonzero
space the local middle-band form is still at most

\[
 -c'_m{e^{hCL}\over L^{2m}}=-c'_m\tau_L              \tag{6.3}
\]

for all sufficiently large `L`.  This is a statement about the **local**
middle band.  It does not say that the completed full-profile band has the
same sign.

The exact product formula also exposes the failure of the proposed
shortcut.  For `rho=y/L` and
`Delta_(ij)=alpha_i-beta_j=CL+a_i-b_j`,

\[
 {F_{\Delta_{ij}}(y/L)\over F_{\Delta_{ij}}(1/c)}
 =e^{-Cy/2+o(1)}.                                    \tag{6.4}
\]

The cancellation of the common cluster slope in (6.4) is essential.  On
the fixed-linear schedule,

\[
 {W_{-\alpha_i}(y/L)\over W_{-\alpha_i}(1/c)}
 =e^{-(A_1+C)y/2+o(1)},\qquad
 {W_{\beta_j}(y/L)\over W_{\beta_j}(1/c)}
 =e^{A_1y/2+o(1)}.                                  \tag{6.5}
\]

Only their product has exponent `-Cy/2`; the first ratio alone does not.
Across fixed offsets the additional product variation is only
`exp\{-(a_i-b_j)y/(2L)+o(L^(-1))\}=1+O(L^(-1))`.
Nulling the common `z=1` coefficient therefore gains powers of `L`
through offset moments, not a factor `c^(-delta)`.  The `Theta(c/L)` rows
in (0.6) remain and their coherent sum restores the Cauchy scale.

## 7. The periodic Bernoulli alias is the exact remaining object

For the complete physical inward branch the frozen Euler identity is

\[
 S(X,z)={X^{1-z}\over1-z}+\zeta(z)-B_1(X)X^{-z}
 +z\int_X^\infty B_1(t)t^{-z-1}\,dt.                \tag{7.1}
\]

The zero-integral and invisible-origin conditions suppress the isolated
Euler main only after the two ordered branches are recombined.  They do
not remove the periodic Bernoulli remainder in (7.1), which is the same
remainder encoded exactly by the `t_z,p_z` and Hurwitz rows.

Its first Fourier harmonics are physically resonant, not nonstationary.
For every selected plus-phase prolate mode,

\[
 \int_{-\lambda}^{\lambda}h_n(u)e^{-2\pi i\lambda u}\,du
 =H_n(\lambda)=\chi_n h_n(\lambda).                  \tag{7.2}
\]

More generally, differentiating the finite Fourier transform gives

\[
 \int_{-\lambda}^{\lambda}u^j h_n(u)
       e^{-2\pi i\lambda u}\,du
 ={H_n^{(j)}(-\lambda)\over(2\pi i)^j}               \tag{7.3}
\]

with the equivalent endpoint sign determined by parity.  On the
band, `H_n=chi_n h_n`, and the prolate ODE expresses the endpoint jets as
spectral polynomials.  Thus fixed-order integration by parts does not
make the `r=1` Bernoulli harmonic small uniformly on the selected packet.

Combining Sections 5--7 gives the precise remaining alternative.  In the
full rows

\[
 {1\over4}\mathsf S(t_z+p_z,\zeta(z)m_z-t_z),        \tag{7.4}
\]

the nonlocal generalized-harmonic/Hurwitz features must be summed
coherently over (0.7).  To prove the desired one-sided feature-angle lemma
one must show that their compression cancels the local form (6.3), or
completes it to a favorable square, to relative accuracy `o(1)` at the
smallest Cauchy scale.  To disprove the lemma one must instead construct a
physical row-null compact-prolate direction on which that cancellation
fails.  Neither conclusion follows from (7.1)--(7.3), and neither is
claimed here.

## 8. Conclusion

The local Cauchy exponential is not hidden in finitely many low odd rows or
in the eventual endpoint tail.  It is the Riemann sum of
`Theta(c log L/L)` rows centered on the scale `z=c/L`.  The single
`A_1` null and every other fixed row inventory preserve a nonzero part of
the local negative space, while the periodic Bernoulli harmonics remain
exactly resonant with the realized plus-phase modes.  Therefore the next
valid attack is a signed middle-band alias-frame theorem for the exact
`m_z,t_z,p_z` matrix, not another rowwise decay estimate.  Its sign remains
open, and the formal project state remains `P0_INVALIDATED`.
