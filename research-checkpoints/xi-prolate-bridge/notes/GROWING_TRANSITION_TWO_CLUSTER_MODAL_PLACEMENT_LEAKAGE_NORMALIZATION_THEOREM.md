# Growing-transition two-cluster modal placement, leakage, and normalization theorem

## 0. Result and exact scope

Use the locked half-integer schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad L=2\log\lambda,
 \qquad S={2c\over\pi}=4\lambda^2=p^2,
 \qquad h={\pi\over4}.                                  \tag{0.1}
\]

Fix a positive integer `m`, two fixed sets of distinct real offsets
`a_1,...,a_m` and `b_1,...,b_m`, and a fixed `D>0`.  This theorem treats
either of the following two target families.

* **Fixed linear base.**  For fixed `A_1,C>0` with `A_1+C<D`, put

\[
 \alpha_i=(A_1+C)L+a_i,\qquad
 \beta_j=A_1L+b_j.                                      \tag{0.2F}
\]

* **Polylogarithmic base.**  Put

\[
 B_L=(\log L)^4,
 \qquad \alpha_i=CL+B_L+a_i,\qquad
 \beta_j=B_L+b_j,                                      \tag{0.2P}
\]

where `0<C<D` and

\[
 b_*:=\min_j b_j>0.                                    \tag{0.3}
\]

For every target `gamma` in either family, there is, for all sufficiently
large locked `lambda`, a label

\[
 n_\gamma\equiv0\pmod4,
 \qquad 2\leq n_\gamma\leq S-1,                       \tag{0.4}
\]

whose separation eigenvalue is exactly

\[
 \mu_{n_\gamma}=c^2-c\widehat\gamma,
 \qquad
 \boxed{|\widehat\gamma-\gamma|\leq{24\pi\over L}.}  \tag{0.5}
\]

All `2m` labels obtained from the two clusters are distinct.  Since they
are divisible by four, their Fourier phase is the same plus phase.  In
particular, the actual modal parameters have precisely the perturbation
form required by a fixed-dimensional analytic two-cluster theorem:

\[
 \widehat\alpha_i=\alpha_i+O(L^{-1}),\qquad
 \widehat\beta_j=\beta_j+O(L^{-1}).                    \tag{0.6}
\]

Let `chi_n` denote the positive concentration eigenvalue and
`d_n=1-chi_n^2` its two-sided exterior defect.  An absolute constant
`kappa_0>0` may be taken to be `pi/64`, and the selected modes satisfy

\[
 \boxed{d_{n_\gamma}\leq10e^{-\kappa_0\gamma}.}        \tag{0.7}
\]

Thus `chi_(n_gamma)=1+O(d_(n_gamma))` and is uniformly bounded below.
More explicitly, on the fixed-base family,

\[
 d_{n_{\beta_j}}\leq c^{-\kappa_0A_1+o(1)},\qquad
 d_{n_{\alpha_i}}\leq c^{-\kappa_0(A_1+C)+o(1)},       \tag{0.8F}
\]

whereas on the polylogarithmic family,

\[
 d_{n_{\beta_j}}\leq e^{-\kappa_0B_L+O(1)},\qquad
 d_{n_{\alpha_i}}\leq c^{-\kappa_0C+o(1)}
                         e^{-\kappa_0B_L}.              \tag{0.8P}
\]

For an actual selected parameter put

\[
 r_\gamma^2={\widehat\gamma\over c},\qquad
 J_\gamma=K\!\left(\sqrt{1-r_\gamma^2}\right).
                                                                  \tag{0.9}
\]

Let `h_n` be unit-normalized on `[-lambda,lambda]`, let `H_n` be its
additive Fourier transform, set `e_n=h_n(lambda)`, and choose each harmless
modal sign consistently.  The exact finite-Fourier relation and defect
normalization are

\[
 H_n(\lambda)=\chi_ne_n,\qquad
 z_n={e_n\over\sqrt{d_n}},\qquad
 \widehat z_n={H_n(\lambda)\over\sqrt{d_n}}=\chi_nz_n. \tag{0.10}
\]

The frozen radial mass theorem gives, uniformly on both families,

\[
 \boxed{
 \widehat z_{n_\gamma}^{2}
 ={\pi c\over2\lambda J_\gamma}
 \left\{1+O\left({\log(2+\widehat\gamma)
                         \over\widehat\gamma}\right)\right\},
 \qquad J_\gamma\asymp L.}                             \tag{0.11}
\]

The error in (0.11) is `o(1)` even on the polylogarithmic low cluster.
Consequently the exact forward physical endpoint factor satisfies

\[
\boxed{
 {\lambda\over4c}(1+\chi_{n_\alpha})\chi_{n_\beta}
 z_{n_\alpha}z_{n_\beta}
 ={\pi\over8\sqrt{J_\alpha J_\beta}}
 {1+\chi_{n_\alpha}\over\chi_{n_\alpha}}\{1+o(1)\}
 ={\pi\over4\sqrt{J_\alpha J_\beta}}\{1+o(1)\}.}    \tag{0.12}
\]

The reverse orientation has the same formula with `alpha,beta` interchanged.
Thus the physical exterior-defect-white pair factor is uniformly
`Theta(L^(-1))`; no unproved leakage gate remains for these actual rows.

For any `r` fixed linear source or endpoint rows and any `m`-dimensional
negative subspace `E_-` of a separately proved local `2m`-mode matrix,

\[
 \boxed{
 \dim\left(E_-\cap\bigcap_{s=1}^r\ker\ell_s\right)
 \geq m-r.}                                             \tag{0.13}
\]

The exact zero-integral source condition costs one row.  The retained
Hermitian Plemelj endpoint form factors through two rows and has rank at
most two, so source nulling plus that endpoint nulling costs at most three
rows and, when `m>3`, leaves at least `m-3` local negative directions.
The endpoint value row is a separate fourth row in general, and its
derivative row is a separate fifth row in general.

This package proves modal placement, leakage, radial normalization, and
only this finite-row dimension statement.  It proves no mixed or higher
sampler estimate, no finite-Fejer or fixed-product closure, no source
congruence beyond imposed finite rows, no complete central negative packet,
no determinant conclusion, and no RH statement.  Moreover, the frozen
absolute-sampling barrier shows that if a separately assembled local white
block has scale `c^(hC+o(1))/L^(2m)` with `hC>1/2`, then its omitted complete
channels cannot all be lower order: their compression must cancel at the
same scale.  The present theorem therefore cannot be promoted to a full
counterexample by termwise remainder bounds.  The project state remains
`P0_INVALIDATED`.

## 1. Frozen inputs and conventions

The proof uses exactly the following frozen bytes.

| Dependency | SHA-256 |
|---|---|
| `vendor/BK-PSWF-1405.3676v2.pdf` | `9fe8dc39e4440200a29ff94bb640b693c06a176d28b7e38a468dce98afa7d7b8` |
| `BONAMI_KAROUI_PSWF_ACTION_SOURCE_LOCK.json` | `81ded707ec47ff5c3c1c25eb2503ef4c3d54a9280acfd94254d16f0eee4c9a06` |
| `tests/test_bonami_karoui_pswf_action_source_lock.py` | `06fdee68ab201bcf724d22f852172017fd77eedf1531f4e5bd3f61527a5c670a` |
| `P2_SOURCE_LOCK.json` | `8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a` |
| `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` | `215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6` |
| `tests/test_transition_prolate_outer.py` | `bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433` |
| `notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md` | `3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f` |
| `tests/test_defect_relative_projection.py` | `21b33670a9d017d363f53776ba05ca93ce3588eb049ba9dcb7e61f202bc01999` |
| `notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md` | `1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c` |
| `tests/test_growing_transition_subcritical_lg_action_bv_theorem.py` | `a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `tests/test_growing_transition_sampling.py` | `ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md` | `a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85` |
| `tests/test_growing_transition_complete_central_plemelj_cauchy_floor_theorem.py` | `b9f9cf3d76554b988d7c6d9408130a9ab2b45d37a1862279e139ed7e62edbe61` |
| `notes/GROWING_TRANSITION_ORDERED_DIRECT_PROFILE_CONTINUATION_TWO_JET_SHEAR_REDUCTION_THEOREM.md` | `e3b1228a1fb22270a01f061c198239f3e60cb00b675da55ddd13420f9929dea3` |
| `tests/test_growing_transition_ordered_direct_profile_continuation_two_jet_shear_reduction_theorem.py` | `7d6e46c302276563cfc88e4826903a344c0937eb29f3645daf473d5ba1917341` |
| `notes/GROWING_TRANSITION_ABSOLUTE_SAMPLING_FORCED_CANCELLATION_BARRIER.md` | `eb04692b7ce8e06efe254053ba93e4c5f2051ceffe47e68015c9e12886d77584` |
| `tests/test_growing_transition_absolute_sampling_forced_cancellation_barrier.py` | `3bb7d6c45bd0d4d1564624f7ab9f22532229d51dd51d71a474674081fd266a7b` |

Bonami--Karoui use `chi_n(c)` for the separation eigenvalue.  In this note
that quantity is `mu_n`; `chi_n` is reserved for the positive concentration
eigenvalue, so that `d_n=1-chi_n^2`.  No equality between these two uses of
the letter `chi` is made.

The exact KRD leading-side inequality on the locked integer-Shannon
schedule is

\[
 d_n\leq10\exp\left\{-{S-n-7\over\beta_\lambda}\right\},
 \qquad
 \beta_\lambda={2\over\pi^2}\log(200\lambda^2+25),
 \qquad 0\leq n\leq S-1.                               \tag{1.1}
\]

## 2. Exact action reduction and its derivative

For `mu>0`, write the source-locked Bonami--Karoui action as

\[
 \mathcal A_c(\mu)=\sqrt\mu\,
 \mathbf E\!\left({c\over\sqrt\mu}\right),
 \qquad
 \mathbf E(k)=\int_0^{\min(1,1/k)}
 \sqrt{{1-k^2t^2\over1-t^2}}\,dt.                       \tag{2.1}
\]

For a subcritical target set

\[
 \mu(\gamma)=c^2-c\gamma,
 \qquad r^2={\gamma\over c},\qquad
 \kappa=\sqrt{1-r^2}.                                   \tag{2.2}
\]

Substitute `t=kappa s`, then `s=sin theta`, in (2.1).  This gives the exact
identity

\[
\begin{aligned}
 \mathcal A_c(\mu(\gamma))
 &=c\kappa^2\int_0^{\pi/2}
 {\cos^2\theta\over
 \sqrt{1-\kappa^2\sin^2\theta}}\,d\theta\\
 &=c\{E(\kappa)-r^2K(\kappa)\}
 =:cC(r).
\end{aligned}                                             \tag{2.3}
\]

Define

\[
 \sigma_c(\gamma)=cC(\sqrt{\gamma/c})-{\pi\over4},
 \qquad J(r)=K(\sqrt{1-r^2}).                            \tag{2.4}
\]

The differentiated elliptic identity in the frozen radial theorem yields

\[
 \boxed{{d\sigma_c\over d\gamma}=-{J(r)\over2}.}       \tag{2.5}
\]

The integral representation

\[
 J(r)=\int_0^\infty
 {dt\over\sqrt{(1+t^2)(r^2+t^2)}}                       \tag{2.6}
\]

gives, by restricting to `r<=t<=1`,

\[
 J(r)\geq{1\over2}\log{1\over r}
 ={1\over4}\log{c\over\gamma}.                       \tag{2.7}
\]

Uniformly for every target in (0.2F) or (0.2P),
`B_L<=gamma<=DL` eventually.  Hence

\[
 J(\sqrt{\gamma/c})\geq {L\over8},
 \qquad
 \left|{d\sigma_c\over d\gamma}\right|\geq{L\over16}
                                                                  \tag{2.8}
\]

on a fixed neighborhood of every target.  The upper comparison in the
frozen radial theorem gives `J=O(L)` there, so `J=Theta(L)`.

The action deficit

\[
 \Delta(\gamma)=c-\mathcal A_c(\mu(\gamma))             \tag{2.9}
\]

satisfies `Delta(0)=0` and `Delta'=J/2`.  Integrating (2.7) gives the
explicit lower bound

\[
 \boxed{
 \Delta(\gamma)\geq{\gamma\over8}
 \left\{\log{c\over\gamma}+1\right\}.}                \tag{2.10}
\]

In particular, the target lies an action distance tending to infinity
below the separatrix `mathcal A=c`.

## 3. Same-phase placement and distinctness

The source-locked theorem gives, for every integer `n>=2`,

\[
 {\pi n\over2}<\mathcal A_c(\mu_n)
 <{\pi(n+1)\over2}.                                    \tag{3.1}
\]

For a target `gamma`, choose an integer `k_gamma` nearest to
`sigma_c(gamma)/(2 pi)` and put `n_gamma=4k_gamma`.  Then

\[
 |\sigma_c(\gamma)-2\pi k_\gamma|\leq\pi.              \tag{3.2}
\]

For a plus label, (3.1) is exactly

\[
 \left|\mathcal A_c(\mu_{n_\gamma})-{\pi\over4}
          -2\pi k_\gamma\right|<{\pi\over4}.          \tag{3.3}
\]

Thus the actual and target actions differ by less than `5pi/4`.  Equation
(2.10) shows that the actual action is below `c` for large `lambda`.
For `mu>c^2`, the integrand representation

\[
 \mathcal A_c(\mu)=\int_0^1
 \sqrt{{\mu-c^2t^2\over1-t^2}}\,dt                     \tag{3.4}
\]

is pointwise larger than its value `c` at `mu=c^2`; hence the actual
eigenvalue is subcritical and uniquely has the form
`mu_(n_gamma)=c^2-c widehat gamma` with `widehat gamma>0`.

Take `delta_L=24 pi/L`.  By (2.8), moving from `gamma` to either
`gamma+delta_L` or `gamma-delta_L` changes the action by at least
`3pi/2`, while all targets remain positive.  Strict monotonicity and the
`5pi/4` mismatch therefore give

\[
 |\widehat\gamma-\gamma|<\delta_L,                       \tag{3.5}
\]

which proves (0.5).

If two fixed target offsets in the same cluster produced the same label,
their target parameters would differ by at most `2delta_L`, contradicting
their fixed positive separation for large `L`.  The two clusters are
separated by `CL`.  Hence all selected labels are distinct.  Finally,
`mathcal A_c(mu_(n_gamma))<c=pi S/2` and the lower inequality in (3.1)
give `n_gamma<S`; integrality gives (0.4).

## 4. Quantitative leakage from the action deficit

Let

\[
 \Delta_n=c-\mathcal A_c(\mu_n).                        \tag{4.1}
\]

The lower bracket in (3.1) gives the exact strict inequality

\[
 S-n>{2\Delta_n\over\pi}.                               \tag{4.2}
\]

The construction in Section 3 and (2.10) give

\[
\begin{aligned}
 S-n_\gamma-7
 &>{2\over\pi}\left\{\Delta(\gamma)-{5\pi\over4}\right\}-7\\
 &\geq {\gamma\over4\pi}
      \left\{\log{c\over\gamma}+1\right\}-{19\over2}\\
 &\geq {\gamma L\over16\pi}.
\end{aligned}                                             \tag{4.3}
\]

for every target in either family and all sufficiently large `L`.  Also

\[
 \beta_\lambda\leq {3L\over\pi^2}                       \tag{4.4}
\]

eventually.  Since (0.4) places the label in the KRD leading range, (1.1),
(4.3), and (4.4) imply

\[
 d_{n_\gamma}
 \leq10\exp\left\{-{\pi\gamma\over48}\right\}
 \leq10e^{-(\pi/64)\gamma}.                             \tag{4.5}
\]

This is (0.7).  It is eventually smaller than `1/2`, so the selected rows
also lie below the pinned transition index `n_*`.  Since
`chi_n=sqrt(1-d_n)`, (0.8F)--(0.8P) and the asserted uniform lower bound
follow.

## 5. Exact exterior metric and endpoint normalization

For each selected mode, the frozen prolate normalization gives

\[
 2\int_\lambda^\infty|H_n(t)|^2\,dt=d_n.                \tag{5.1}
\]

Orthogonality makes the exact full exterior metric on a same-phase modal
synthesis

\[
 D(a)=\sum_n d_n|a_n|^2.                                \tag{5.2}
\]

Thus division by `sqrt(d_n)` is the actual `D`-whitening, not a model
normalization.  The finite Fourier eigenrelation on the band gives (0.10).
It is essential not to replace `widehat z_n=chi_n z_n` by `z_n` before
the leakage estimate has been proved.

For `widehat gamma>=B_L`, the frozen radial theorem applies with
`alpha=widehat gamma`.  Equations (0.6), (0.3), and (3.5) ensure this on
the polylogarithmic low cluster; it is automatic on the fixed linear-base
family.  Its exact endpoint mass formula is

\[
 \widehat z_n
 ={1\over\sqrt{2\lambda\mathcal N_{r_n}}},\qquad
 \mathcal N_{r_n}={J(r_n)\over\pi c}
 \left\{1+O\left({\log(2+\widehat\gamma)
                         \over\widehat\gamma}\right)\right\}. \tag{5.3}
\]

This proves (0.11).  Since (0.7) gives
`chi_n=1+O(exp(-kappa_0 gamma))`, substitution of
`z_n=widehat z_n/chi_n` into the exact physical factor gives (0.12).
The diagonal factors `J_gamma^(-1/2)` have bounded condition number on
either fixed set of nodes.

## 6. Finite rows and the unavoidable complete-remainder wall

For a finite-dimensional subspace `E` and linear functionals
`ell_1,...,ell_r`, codimension subadditivity gives

\[
 \dim\left(E\cap\bigcap_{s=1}^r\ker\ell_s\right)
 \geq\dim E-r.                                          \tag{6.1}
\]

Apply this to the `m`-dimensional negative spectral subspace of any
separately proved local two-cluster block to obtain (0.13).  In the frozen
direct-source bookkeeping, the zero-integral source condition is one row.
The retained endpoint form is exactly

\[
 \Gamma_{\rm in}^*\rho_{\rm out}
 +\rho_{\rm out}^*\Gamma_{\rm in},                     \tag{6.2}
\]

so nulling `Gamma_in` and `rho_out` kills it with two more rows.  The
endpoint value row `eta` is not generally proportional to `Gamma_in`: the
frozen identity is only
`Gamma_in-Gamma_out=(sqrt(lambda)/2)eta`.  Thus adding `eta=0` raises the
inventory from at most three to at most four, and adding the independent
derivative row `kappa=0` raises it to at most five.  These are
finite-dimensional identities only.  Midpoint, transition, equality, and
whole-profile sampler families are not promoted to a fixed-rank reserve.

Finally, the frozen absolute-sampling theorem and complete-central identity
give, in exact `D`-white coordinates and for fixed modal count `q`,

\[
 -B_{{\rm out},q}I\preceq Q_X\preceq B_{{\rm out},q}I,
 \qquad B_{{\rm out},q}=c^{1/2+o(1)}.                   \tag{6.3}
\]

Indeed `Q_X=W_Z(O,O)`, while the paired two-evaluation involution has norm
one and `|W_Z(O,O)|<=||ZO||^2`.  Therefore, if a local block on a nonzero
row-null subspace has negative size

\[
 \tau_L={c^{hC+o(1)}\over L^{2m}},\qquad hC>{1\over2},  \tag{6.4}
\]

then the compression of the omitted complete assembly has norm at least
`(1-o(1))tau_L`.  This is the precise reason the modal realization and
normalization theorem stops before any full-remainder or counterexample
claim.
