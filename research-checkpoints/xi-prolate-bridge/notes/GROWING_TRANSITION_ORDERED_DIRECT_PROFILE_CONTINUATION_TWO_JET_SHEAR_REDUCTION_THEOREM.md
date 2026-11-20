# Growing-transition ordered direct-profile continuation and two-jet shear reduction theorem

## 0. Exact result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi\lambda^2,\qquad
 L=\log A=2\log\lambda .                              \tag{0.1}
\]

For an admitted even source `f`, put

\[
 \eta(f)=f(\lambda),\qquad \kappa(f)=f'(\lambda),
 \qquad
 \rho(f)=-{2\lambda\over c}\kappa(f)-c\eta(f).       \tag{0.2}
\]

The row `rho` in (0.2) is a source endpoint-jet row.  It is not the
unrelated outward test row `beta_0-lambda beta_L` used in the direct upper
form.

This note proves the following exact reduction.

1.  The tempting continuation
    `a_M(L+t)=lambda b_M(t)` is false at a finite Fejer cutoff, even for an
    explicit even compactly supported Fourier pair satisfying
    `f(0)=f(lambda)=integral f=0`.  After the prescribed ordered unweighted
    Poisson limit, however,

    \[
      \boxed{a_f(L+t)=\lambda b_f(t)\quad(t\geq0)}     \tag{0.3}
    \]

    holds on the endpoint-null space `eta(f)=0`.

2.  Substitution of (0.3) in the singular upper cross produces a
    separated off-diagonal Cauchy block, not a positive Carleman square.
    Its Hermitian Galerkin compressions have paired inertia.

3.  On the fixed corrected labels `8,12`, the exact pulled-back
    `D`-white row map `(eta,rho)` has the deterministic limit

    \[
      {1\over\sqrt{2\pi\lambda}}
      \binom{\eta}{\rho}G_A D_A^{-1/2}
      \longrightarrow
      \begin{pmatrix}1&1\\-17&-25\end{pmatrix}.       \tag{0.4}
    \]

    Its limiting determinant is `-8`.  Thus the fixed `8/12` plane gives
    an eventually uniformly invertible two-row anchor for `eta=rho=0`,
    equivalently `eta=kappa=0`.  This is deterministic and avoids the
    unproved sampler-trace determinant from the earlier two-anchor note.

4.  Once `eta=0`, every internal time-sampler value jump vanishes.  The
    remaining second-distributional-derivative atoms factor through the
    single row `kappa`; their Hermitian part has rank at most two and their
    rest--rest compression vanishes under the two-jet shear.  Once also
    `kappa=0`, the next atom is the `q=3` jet `f''(lambda)`, whose pure-mode
    row contains the uncontrolled `alpha^2` moment.

5.  If the retained anchor block is `kappa_0 L D_A`-positive, an
    anchor--rest cross of size `o(L)` in the full pulled-back `D` metric is
    enough for an `o(L)` Schur erosion.  The older `o(sqrt L)` target is
    only needed for an `o(1)` erosion.

The note does **not** prove that the complete Cauchy block is positive,
that equality rows complete it to a square, that the coherent atomic row
has the required `D`-relative bound, or that the `q=3` and Volterra rows
close.  The retained sampler trace `Gamma` is not killed by this shear and
the complete Plemelj assembly `PA` remains open.  No complete central
floor, equation (5.2) of `DIRECT_RH_ATTACK.md`, or RH conclusion follows.
The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The proof uses the following repository bytes.  The first six entries are
the exact checkpoint-1.10 integrated frontier pairs relevant to the
ordered finite-Fejer convention.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_FINITE_FEJER_XI_WRONSKIAN_ASSEMBLY_GATE.md` | `41dad88fd3e5bcb3277ccadb6baaa4bfa40ab683d15c747bebe8a50ce759ff23` |
| `tests/test_growing_transition_finite_fejer_xi_wronskian_assembly_gate.py` | `dcb9640a5294ae5c44502f983f20f9eadcdf8271dd02099b9d3887f255460aee` |
| `notes/GROWING_TRANSITION_LOCKED_CARRIER_FLAT_SCALAR_SUM_THEOREM.md` | `cf51bc269592e5ae2393e0c30931ca8fb4723283e70bb5981345f6e822afcc9e` |
| `tests/test_growing_transition_locked_carrier_flat_scalar_sum_theorem.py` | `6577d3a20f6917a7a807ded2bd90b8879122b7c259cbb6ce6be1b6ac22f8d5a3` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md` | `1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d` |
| `tests/test_growing_transition_edge_carleman_scattering_obstruction.py` | `b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb` |
| `notes/FIXED_ENDPOINT_BERNOULLI_MATRIX_QUADRATURE_AND_JET_GROWTH_THEOREM.md` | `287b0fe3cfad40b6d8b7bd4719a6ddcb8fc4073eb463188f6e1100a2dc6908b0` |
| `tests/test_fixed_endpoint_bernoulli_matrix_quadrature_and_jet_growth_theorem.py` | `36d9ca8f522f10b3bf8fd98bffa7b0a0e26a67eaee94ebaba18ff4912b9d651a` |
| `notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md` | `e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17` |
| `tests/test_fixed_even_8_12_plane_archimedean_arithmetic_floor_theorem.py` | `545fe85867f427cf778aabbb2b4a57dcc268d99ff13e5ca096d84d52d1cdf09f` |
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |
| `tests/test_growing_transition_equality_conductor_garding_theorem.py` | `61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_TWO_ANCHOR_BULK_TRACE_OBSTRUCTION_THEOREM.md` | `cb2afb9b28cbcaf4dbd55802b72e59a3f71cad0fa84e69ee18252c5f7dbef591` |
| `tests/test_growing_transition_direct_source_two_anchor_bulk_trace_obstruction_theorem.py` | `bd888e61906c5c696f8a7338dbf4d1b6861c888ee863d2ba6ba9ab14d05d8892` |

No external source, zero table, or numerical prolate data is used.

## 2. Finite-Fejer continuation is false

Let `H=F_a f` and

\[
 \omega_M(m)=\left(1-{m\over M+1}\right)_+ .          \tag{2.1}
\]

The direct-source finite profiles are

\[
\begin{aligned}
 \mathfrak a_{f,M}(s)
  &={\sqrt\lambda\over2}\sum_{m\geq1}\omega_M(m)
       \{f+H\}(m\lambda e^{-s}),\\
 b_{f,M}(t)
  &={\sqrt\lambda e^t\over2}\sum_{m\geq1}\omega_M(m)
       H(m\lambda e^t).
\end{aligned}                                         \tag{2.2}
\]

Extending the first displayed formula beyond `L` gives, coefficient by
coefficient,

\[
\begin{aligned}
 \mathfrak a_{f,M}(L+t)
  &={\sqrt\lambda\over2}\sum_m\omega_M(m)
       \{f+H\}(me^{-t}/\lambda),\\
 \lambda b_{f,M}(t)
  &={\lambda^{3/2}e^t\over2}\sum_m\omega_M(m)
       H(m\lambda e^t).
\end{aligned}                                         \tag{2.3}
\]

There is no finite weighted Poisson identity equating the two lines.
The exact finite-cutoff defect is

\[
\boxed{
 E_{M,f}(t)={\sqrt\lambda\over2}\sum_m\omega_M(m)
       \{f+H\}(me^{-t}/\lambda)
 -{\lambda^{3/2}e^t\over2}\sum_m\omega_M(m)
       H(m\lambda e^t).}                              \tag{2.4}
\]

Here is an explicit physical Fourier-pair counterexample.  Take
`lambda=5/2`, `M=1`, `t=1/5`, and, with `u=x/lambda`,

\[
 f(x)=
 \begin{cases}
 u^2(1-u^2)^5(u^2-1/5),&|x|\leq\lambda,\\
 0,&|x|>\lambda,
 \end{cases}
 \qquad
 H(y)=\int_{-\lambda}^{\lambda}f(x)e^{2\pi ixy}\,dx. \tag{2.5}
\]

The source is even and `C^4`, and beta integration gives

\[
 f(0)=f(\lambda)=0,
 \qquad \int_{-\lambda}^{\lambda}f(x)\,dx=0.          \tag{2.6}
\]

Direct quadrature, reproduced by the focused regression, gives

\[
 \mathfrak a_{f,1}(L+1/5)=-0.00454037117166\ldots,
 \qquad
 \lambda b_{f,1}(1/5)=-0.000000225761914\ldots .      \tag{2.7}
\]

Thus (0.3) is not a finite-`M` identity, even on this doubly normalized
source.  This is why all uses below retain the ordered limit.

## 3. Ordered unweighted continuation

After the ordered unweighted Poisson limit, the frozen full time-sampler
form is

\[
\begin{aligned}
 a_f(s)
  &={\sqrt\lambda\over2}\sum_{m\geq1}f(m\lambda e^{-s})
    +{e^s\over2\sqrt\lambda}
       \sum_{m\geq1}f(me^s/\lambda),\\
 b_f(t)
  &={1\over2\sqrt\lambda}
       \sum_{m\geq1}f(me^{-t}/\lambda).
\end{aligned}                                         \tag{3.1}
\]

At `s=L+t`, this becomes

\[
 a_f(L+t)
 ={\sqrt\lambda\over2}\sum_{m\geq1}f(me^{-t}/\lambda)
 +{\lambda^{3/2}e^t\over2}
       \sum_{m\geq1}f(m\lambda e^t).                 \tag{3.2}
\]

The second sum vanishes by time support for `t>0`.  At `t=0`, only the
one-sided endpoint term `f(lambda)=eta(f)` can remain.  Hence `eta=0`
proves (0.3), including its one-sided value at zero.  This is an identity
of the ordered complete profiles; it is not a coefficientwise identity
for their finite Fejer approximants.

## 4. The continued cross is off-diagonal Cauchy

The singular upper cross is

\[
 \mathcal C^\uparrow(j,k)
 =\int_0^L\!\int_0^\infty
   {\overline{a_j(s)}b_k(t)\over s+t}\,dt\,ds.        \tag{4.1}
\]

Set `x=L-s` and `u=L+t`.  On `eta=0`, (0.3) gives

\[
 \boxed{
 \mathcal C^\uparrow(j,k)
 ={1\over\lambda}
 \int_{0\leq x\leq L<u}
 {\overline{a_j(L-x)}a_k(u)\over u-x}\,du\,dx.}      \tag{4.2}
\]

Let `T` denote the separated Cauchy map with kernel `(u-x)^(-1)` from the
right space `u>L` to the reflected interval space `0<x<L`.  The
Hermitian average of (4.2) is represented on their orthogonal direct sum
by

\[
 \boxed{
 {1\over2\lambda}
 \begin{pmatrix}0&T\\T^*&0\end{pmatrix}.}             \tag{4.3}
\]

Every finite-dimensional Galerkin compression respecting the two spaces
has nonzero eigenvalues

\[
 \pm {s_\nu(T)\over2\lambda}.                         \tag{4.4}
\]

In particular it is indefinite whenever the compressed cross is nonzero.
The inversion-parity copy changes orientation or duplicates the same
off-diagonal structure; it does not create the two diagonal Cauchy blocks
needed for a positive square.  The frozen equality conductor is a
separate arithmetic/equality contribution and no frozen identity
identifies it with those missing blocks.  Therefore profile continuation
alone proves neither positivity nor `PA`.

## 5. The stable endpoint two-jet anchor

For a pure prolate mode write `e_j=f_j(lambda)` and

\[
 \alpha_j={c^2-\Theta_j\over c}.
\]

The endpoint ODE gives exactly

\[
 \kappa_j=f'_j(\lambda)
 ={\Theta_j-c^2\over2\lambda}e_j
 =-{c\alpha_j\over2\lambda}e_j,
 \qquad
 \rho_j=(\alpha_j-c)e_j.                              \tag{5.1}
\]

For every fixed label `t`, the frozen eigenvalue expansion says

\[
 \alpha_t-c=-(2t+1)+O_t(c^{-1}).                      \tag{5.2}
\]

Let `G_A` synthesize the corrected fixed columns `8,12` and let
`D_A=G_A^*D_{\rm full}G_A`.  The bounded lower-label anchor corrections
are lower order after exact `D_A` whitening, and the invisible origin
bump changes no endpoint jet.  The fixed-plane normalization and (5.2)
therefore prove (0.4).

For

\[
 M_*=\begin{pmatrix}1&1\\-17&-25\end{pmatrix},
 \qquad \det M_*=-8,                                  \tag{5.3}
\]

one has

\[
 s_{\min}(M_*)
 =\left\{{916-\sqrt{916^2-256}\over2}\right\}^{1/2}
 =0.2643375\ldots .                                   \tag{5.4}
\]

Consequently, for all sufficiently large locked `lambda`, there is an
absolute `c_*>0` such that

\[
 \binom{\eta}{\rho}G_A D_A^{-1}
       G_A^*\binom{\eta}{\rho}^{\!*}
 \succeq c_*\lambda I_2,                              \tag{5.5}
\]

and the inverse row map has norm `O(lambda^(-1/2))` in `D_A`-white
coordinates.  In the ordered column convention `(8,12)`, the equivalent
raw two-jet determinant is

\[
 \det\!\left[\binom{\eta}{\kappa}G_A D_A^{-1/2}\right]
 =16\pi^2\lambda^2\{1+o(1)\}.                        \tag{5.6}
\]

Reversing either row or column order reverses the sign.  Since

\[
 \rho=-{2\lambda\over c}\kappa-c\eta,
 \qquad
 \ker(\eta,\rho)=\ker(\eta,\kappa),                  \tag{5.7}
\]

this proves an eventually stable fixed-anchor shear with no condition on
the oscillatory sampler trace `Gamma`.

Explicitly, split source coordinates into anchor and rest, set

\[
 R=(R_A,R_R)=\binom{\eta}{\rho}(G_A,G_R),
 \qquad
 S=\begin{pmatrix}I_2&-R_A^{-1}R_R\\0&I_R\end{pmatrix}.
                                                               \tag{5.8}
\]

Then

\[
 RS=(R_A,0),\qquad
 D^\#=S^*D_{\rm full}S,\qquad Q^\#=S^*QS.            \tag{5.9}
\]

The transformed rest is exactly `eta=kappa=0`.  Equation (5.9), with its
off-diagonal metric blocks retained, is the only licensed metric
bookkeeping.

## 6. Internal sampler atoms: `q=2` factors, `q=3` survives

For an internal sampler `2<=m<A`, put

\[
\begin{aligned}
 g_{m,f}(s)&={\sqrt\lambda\over2}\omega_M(m)
 f(m\lambda e^{-s})\,\mathbf1_{\{s\geq\log m\}},\\
 h_{m,f}(s)&={e^s\over2\sqrt\lambda}\omega_M(m)
 f(me^s/\lambda)\,\mathbf1_{\{s\leq L-\log m\}}.
\end{aligned}                                         \tag{6.1}
\]

These are the two compact-`f` branches of the finite time-sampler
approximant

\[
 a^{\rm time}_{f,M}(s):=\sum_{2\leq m<A}
       \{g_{m,f}(s)+h_{m,f}(s)\}.                    \tag{6.2}
\]

Its ordered limit is the internal part of the unweighted profile in
(3.1); it is not the finite direct `(f+H)` profile in (2.2).  Writing
`x=m lambda e^(-s)`, the first branch has smooth-side derivatives

\[
 g'={\sqrt\lambda\over2}\omega_M(m)(-xf'),
 \qquad
 g''={\sqrt\lambda\over2}\omega_M(m)(xf'+x^2f'').   \tag{6.3}
\]

Thus, on `eta=0`, its value jump is zero and

\[
 [g'_m]_{\log m}
 =-{\lambda^{3/2}\over2}\omega_M(m)\kappa(f).       \tag{6.4}
\]

For the reciprocal branch use the right-minus-left jump convention.  On
its smooth left side,

\[
 h'_m={e^s\omega_M(m)\over2\sqrt\lambda}
       \{f(x)+xf'(x)\},\qquad x=me^s/\lambda.
\]

At `s=L-log m`, the value jump again vanishes on `eta=0`, while

\[
 [h'_m]_{L-\log m}
 =-{\lambda^{5/2}\over2m}\omega_M(m)\kappa(f).       \tag{6.5}
\]

Consequently the **complete two-branch time-sampler** internal `q=2`
atom inventory is

\[
\boxed{
\begin{aligned}
 D_s^2a^{\rm time}_{f,M}\big|_{\rm int.atoms}
 ={}&-{\lambda^{3/2}\over2}\kappa(f)
   \sum_{2\leq m<A}\omega_M(m)\delta_{\log m}\\
 &-{\lambda^{5/2}\over2}\kappa(f)
   \sum_{2\leq m<A}{\omega_M(m)\over m}
        \delta_{L-\log m}.
\end{aligned}}                                        \tag{6.6}
\]

The two atom sets do not collide: a collision would give `mn=A`, which is
impossible because `A=p^2/4` is nonintegral.  After the exact second
Stieltjes integration, all right-slot evaluations and common constants
from both lines can be collected in one coherent row
`R_M^comb=R_M^g+R_M^h`.  The complete internal `q=2` atomic upper channel
therefore has the exact oriented factorization

\[
 \boxed{J_{2,M}^\uparrow=\kappa^*R_M^{\rm comb},\qquad
 {J_{2,M}^\uparrow+(J_{2,M}^\uparrow)^*\over2}
 ={\kappa^*R_M^{\rm comb}+(R_M^{\rm comb})^*\kappa\over2}.}
                                                               \tag{6.7}
\]

Its Hermitian rank is at most two.  On the transformed rest,
`kappa_R=0`, so its rest--rest block vanishes **exactly**.  This statement
does not bound the remaining anchor--rest row `R^{comb}_{M,R}`.

If also `kappa=0`, then

\[
\begin{aligned}
 [g''_m]_{\log m}
 &= {\lambda^{5/2}\over2}\omega_M(m)f''(\lambda),\\
 [h''_m]_{L-\log m}
 &=-{\lambda^{7/2}\over2m}\omega_M(m)f''(\lambda).
\end{aligned}                                         \tag{6.8}
\]

Thus the full `D_s^3a` has both `q=3` atom families, with a common
`f''(lambda)` row and cubic action denominators.  The exact endpoint
recurrence gives

\[
 {f''_j(\lambda)\over f_j(\lambda)}
 ={1\over\lambda^2}
 \left\{{c^2\alpha_j^2\over8}
       +{c\alpha_j\over4}-{c^2\over2}\right\}.        \tag{6.9}
\]

For a modal combination with `eta=0` and `kappa=0`, the constant and
`alpha` moments in (6.9) vanish, leaving the `alpha^2` endpoint moment.
No frozen theorem supplies a growing-rest `D`-relative frame bound for
that row.  The two-jet shear therefore pushes the first internal atom one
order higher; it does not close the higher-jet tower.

## 7. Two-branch ordered Euler cancellation of the isolated main

The coherent row in (6.7) must not be estimated by its isolated atoms
before the regular bulk and the last endpoint are restored.  For
`z=i xi`, direct Mellin swapping first gives the exact compact-`f` branch
identity

\[
\begin{aligned}
 T_A(f;z)
 &:=\int_0^L\sum_{m\geq1}f(m\lambda e^{-s})e^{-zs}\,ds\\
 &=\int_{1/A}^1 f(\lambda x)x^{z-1}S(Ax,z)\,dx,
 \qquad S(X,z)=\sum_{m\leq X}m^{-z}.
\end{aligned}                                         \tag{7.1}
\]

This `T_A` is one branch, not the complete inward profile.  If

\[
 \widehat a_f(z)=\int_0^L a_f(s)e^{-zs}\,ds,
\]

then the exact ordered two-branch formula (3.1), followed by `r=L-s` in
the reciprocal branch, gives

\[
 \boxed{
 \widehat a_f(z)={\sqrt\lambda\over2}T_A(f;z)
 +{A^{1-z}\over2\sqrt\lambda}T_A(f;1-z).}             \tag{7.2}
\]

The Euler main `X^(1-z)/(1-z)` in the first branch contributes exactly

\[
 {A^{1-z}\over1-z}\int_{1/A}^1f(\lambda x)\,dx
 =-{A^{1-z}\over\lambda(1-z)}
       \int_0^{1/\lambda}f(u)\,du,                    \tag{7.3}
\]

where evenness and `integral f=0` were used.  If in addition `f(0)=0`
and `f` is even `C^2`, then `f'(0)=0` and, on the imaginary axis,

\[
 \left|{A^{1-z}\over1-z}\int_{1/A}^1
          f(\lambda x)\,dx\right|
 \leq {\|f''\|_\infty\over6A|1-z|}.                  \tag{7.4}
\]

For `z` off zero, applying the same identity at `1-z` shows that the
reflected branch's Euler main, including its coefficient in (7.2), is

\[
 -{A\over2\lambda\sqrt\lambda\,z}
       \int_0^{1/\lambda}f(u)\,du.                    \tag{7.5}
\]

Thus both apparent coherent Euler mains reduce to the short-origin
functional once the two ordered branches, regular pieces, and retained
endpoints are kept together.  On action off-diagonals `z=i xi !=0`, their
absolute bounds follow from `|f(u)|<=u^2||f''||_infinity/2`.  This is not
a bound for the remaining zeta/Bernoulli frame.

At finite Fejer cutoff and `M>=floor(A)`, one instead has exactly

\[
 S_M(X,z)=S(X,z)-{1\over M+1}S(X,z-1).                \tag{7.6}
\]

The second sum has the additional Euler main

\[
 -{A^{2-z}\over(M+1)(2-z)}
       \int_{1/A}^1x f(\lambda x)\,dx,                \tag{7.7}
\]

which is not killed by the zero integral.  It disappears only in the
ordered limit `M to infinity` with `A` fixed.  Equation (7.6) applies
branchwise to the ordered time-sampler approximants; Section 2 proves that
those two weighted time branches are not coefficientwise equal to the
finite direct `(f+H)` profile.  After (7.3)--(7.5), the complete ordered
transform (7.2) still contains the `zeta(z)` and `zeta(1-z)` Mellin
multipliers and both periodic-Bernoulli remainders.  No frozen theorem
bounds that completed two-branch remainder in the growing-rest pulled-back
`D` metric.  Equations (7.1)--(7.7) improve the diagnosis but do not supply
the missing frame estimate.

## 8. The correct weakened Schur target

Write the transformed Hermitian form in anchor/rest blocks as

\[
 Q^\#=\begin{pmatrix}\mathcal A&\mathcal C\\
                      \mathcal C^*&\mathcal R\end{pmatrix},
 \qquad
 \mathcal A\succeq\kappa_0L D_A.                     \tag{8.1}
\]

Then

\[
\begin{aligned}
 &\left\|D_R^{-1/2}\mathcal C^*\mathcal A^{-1}
          \mathcal C D_R^{-1/2}\right\|\\
 &\hspace{18mm}\leq {1\over\kappa_0L}
 \left\|D_A^{-1/2}\mathcal C D_R^{-1/2}\right\|^2.
\end{aligned}                                         \tag{8.2}
\]

Therefore

\[
 \boxed{
 \|D_A^{-1/2}\mathcal C D_R^{-1/2}\|=o(L)
 \quad\Longrightarrow\quad
 \|D_R^{-1/2}\mathcal C^*\mathcal A^{-1}
       \mathcal C D_R^{-1/2}\|=o(L).}                \tag{8.3}
\]

The stricter target is precisely

\[
 \|D_A^{-1/2}\mathcal C D_R^{-1/2}\|=o(\sqrt L)
 \quad\Longrightarrow\quad
 \|D_R^{-1/2}\mathcal C^*\mathcal A^{-1}
       \mathcal C D_R^{-1/2}\|=o(1),                 \tag{8.4}
\]

but it is not needed merely to preserve an `L`-scale floor.

For the atomic factor (6.7), let

\[
 K_\lambda=\|\kappa_A D_A^{-1/2}\|.
\]

Its exact raw sufficient condition is

\[
 K_\lambda\|R^{\rm comb}_{M,R}D_R^{-1/2}\|=o(L).     \tag{8.5}
\]

Equivalently, absorb the fixed two-dimensional anchor factor
`kappa_A D_A^(-1/2)` into the definition of the anchor-normalized coherent
row `R_M^(comb,norm)`; then the target is simply

\[
 \boxed{\|R_{M,R}^{\rm comb,norm}D_R^{-1/2}\|=o(L).} \tag{8.6}
\]

No `o(1)` estimate is required for this Schur purpose, but no frozen input
currently proves even (8.5) or (8.6).

## 9. Retained `Gamma` row and exact exclusions

The ordered traces obey

\[
 \Gamma_{\rm in}-\Gamma_{\rm out}
 ={\sqrt\lambda\over2}\eta.                           \tag{9.1}
\]

Thus the two-jet-null rest has
\(\Gamma_{\rm in}=\Gamma_{\rm out}\), not `Gamma=0`.  The exact oriented endpoint form
remains

\[
 2\Gamma_{\rm in}^*(\beta_0-\lambda\beta_L),          \tag{9.2}
\]

together with its adjoint after Hermitianization.  It remains inside the
complete Plemelj form; this theorem neither shears it away nor bounds its
anchor--rest or rest--rest action.

For clarity, the following are not consequences of this theorem:

* finite-`M` profile continuation;
* positivity or a square completion of the separated Cauchy cross;
* identification of equality rows with missing Cauchy diagonals;
* a `D`-relative estimate for the coherent row in (6.7), (7.2), or (8.6);
* control of the `alpha^2` row, higher jets, or complete Volterra terms;
* cancellation or control of the retained `Gamma` endpoint form;
* complete multi-sampler Plemelj synthesis, `PA`, edge--bulk closure, or a
  full-metric Schur theorem;
* any RH conclusion.

The exact gain is narrower but useful: the fixed `8/12` plane supplies a
stable deterministic value/derivative two-row congruence, all internal
`q=2` atoms leave the rest--rest block, the isolated coherent Euler main
cancels after whole-profile completion, and the remaining quantitative
cross target is only `o(L)`.  The completed zeta/Bernoulli frame and the
retained `Gamma`/`PA` assembly are the precise next gates.
