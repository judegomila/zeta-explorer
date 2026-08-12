# Growing-transition forced ordered nonresonant prime-frame theorem

## 0. Result and exact scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=2\log\lambda,
 \qquad h={\pi\over4}.                              \tag{0.1}
\]

This theorem is restricted to the realized polylogarithmic-base packet

\[
 B_L=(\log L)^4,\qquad
 \alpha_i=CL+B_L+a_i+O(L^{-1}),\qquad
 \beta_j=B_L+b_j+O(L^{-1}),                        \tag{0.2}
\]

where the two fixed offset sets are distinct within each cluster,
`b_*:=min_j b_j>0`, the packet parameter satisfies

\[
 \boxed{{1\over2}<hC<1,}                            \tag{0.3}
\]

and there are `m` nodes in each cluster with `m>7`.  Use the actual
same-plus-phase modal labels supplied by the frozen placement theorem.

Choose any fixed `epsilon>0` and any fixed

\[
 0<\theta<\min\left\{{1\over2},1-hC\right\};       \tag{0.3a}
\]

these are only the internal error and cutoff parameters required by the
frozen polylogarithmic shell theorem.

All hats below mean the same exact exterior-defect whitening on the
quotient by `ker D` as in the frozen direct-source and absolute-sampling
theorems.  Put

\[
 T_L={e^{hCL}\over L^{2m}}
 ={c^{hC+o(1)}\over L^{2m}}.                       \tag{0.4}
\]

Let `E_-` be the `m`-dimensional local negative spectral space.  Start
with the zero-integral modal source `g`.  In addition to the six rows used
by the frozen complete-tail theorem, impose the pre-correction
central-value row

\[
 \ell_0(g)=a_0(g)=g(0)=0.                           \tag{0.5a}
\]

The fixed invisible-origin correction is then identically zero.  Retain
the ordered physical rows at fixed `lambda` and impose the seven scalar
rows

\[
 \ell_{\rm int},\quad \ell_0,\quad \Gamma_{\rm in},\quad
 \rho_{\rm out},\quad \eta,\quad
 \widehat{\mathcal A}^{1,\rm mod}_0,\quad
 \widehat{\mathcal A}_1.                           \tag{0.5}
\]

Here `mathcal A_0^(1,mod)` is the uncorrected modal local pole row and
`mathcal A_1` is the complete corrected row after the ordered Poisson
limit.  Define

\[
 E=E_-\cap\bigcap_{j=1}^7\ker\ell_j,
 \qquad \dim E\geq m-7>0.                          \tag{0.6}
\]

Let `P_E` denote its orthogonal projection in the exact white quotient.

The frozen complete odd-Laplace tail theorem then gives, for a fixed
constant `c'_m>0`,

\[
 P_E\widehat Q_{\rm cont}P_E
 \preceq-{c'_m\over4}T_LP_E.                       \tag{0.7}
\]

In the exact ordered direct-source representative, split the complete
prime form into the local `(1,1)` shell, the ordered resonance, and the
ordered nonresonant remainder.  The complete central form has the exact
exhaustive identity

\[
 \boxed{
 \widehat Q_X=\widehat Q_{\rm cont}
 +\widehat Q_{p,11}+\widehat Q_{\rm res}
 +\widehat Q_{\rm off}.}                           \tag{0.8}
\]

Then the ordered nonresonant compression matches the negative of the
complete continuous compression in operator norm:

\[
 \boxed{
 \left\|P_E(\widehat Q_{\rm off}
                 +\widehat Q_{\rm cont})P_E\right\|
 =o(T_L).}                                         \tag{0.9}
\]

Consequently, for all sufficiently large locked `lambda`,

\[
 \boxed{
 P_E\widehat Q_{\rm off}P_E
 \succeq {c'_m\over8}T_LP_E.}                      \tag{0.10}
\]

Use the reciprocal-gauged source rows of the frozen endpoint-null Krein
theorem, first send the prime cutoff `R` to infinity, and then take the
ordered Fejer limit `M to infinity` at fixed `lambda`.  The resulting
off-subset maps are genuine Hilbert maps and satisfy

\[
 \boxed{
 \left.P_E\widehat Q_{\rm off}P_E\right|_E
 =\widehat{\mathcal G}_{+}^*\widehat{\mathcal G}_{+}
 -\widehat{\mathcal G}_{-}^*\widehat{\mathcal G}_{-},
 \qquad \widehat{\mathcal G}_{\pm}:E\to\mathfrak H_{\rm off}.}
                                                               \tag{0.11}
\]

Therefore (0.10), together with positivity of the negative-branch Gram,
gives the actual positive lower frame

\[
 \boxed{
 \widehat{\mathcal G}_{+}^*
       \widehat{\mathcal G}_{+}
 \succeq {c'_m\over8}T_LI_E,\qquad
 s_{\min}\!\left(\widehat{\mathcal G}_{+}|_E\right)
 \geq \sqrt{{c'_mT_L\over8}}.}                    \tag{0.12}
\]

Consequently, for every `x in E`,

\[
 \boxed{
 \|\widehat{\mathcal G}_{+}x\|^2
 \geq {c'_m\over8}T_L\|x\|^2.}                   \tag{0.13}
\]

This is an actual packet-level prime feature at each fixed `lambda`.  It
does not bound the negative branch, give a growing-`lambda` uniform target
space, or produce a canonical generator-level intertwiner.

The fixed-linear packet is excluded: no frozen theorem proves the complete
physical-white `(1,1)` prime-shell operator estimate on all four cluster
orientations there.  This theorem uses no fixed-product mask, equality
representative, midpoint row, or separately appended endpoint.  It proves
no sign for `Q_X`, no whole-space prime sign, no complete central sign,
no equation (5.2) of `DIRECT_RH_ATTACK.md`, no determinant convergence,
no RH statement, and no Lambda bound.  The project state remains
`P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_COMPLETE_ODD_LAPLACE_TAIL_THEOREM.md` | `a65edf2f7268cf9be46cdb711a5999c90ce667c9928986b0bf607915a3d92408` |
| `tests/test_growing_transition_complete_odd_laplace_tail_theorem.py` | `3cde8608887da5354b6afebb84696f8110b573dae6b76a7abe6198ee52482e0e` |
| `notes/GROWING_TRANSITION_ETA_NULL_RENORMALIZED_SOURCE_KREIN_INTERTWINER_THEOREM.md` | `0c7c20639645d912d0e896bf064f83e3bd26078d716a183fa703d1586673d0d5` |
| `tests/test_growing_transition_eta_null_renormalized_source_krein_intertwiner_theorem.py` | `fac207d0c4847e7f624848aa174fae013f7099382d9ba785651be634849c5505` |
| `notes/GROWING_TRANSITION_ONE_SIDED_ODD_LAPLACE_ROW_AND_FORWARD_ALIAS_THEOREM.md` | `0edbe7253f6164399d468517bc9cbb9c8d9317250ac7dcc526eca9a8e15e7d3b` |
| `tests/test_growing_transition_one_sided_odd_laplace_row_and_forward_alias_theorem.py` | `97215866f7cf3a6969a7ec92d81e722a6e376034e95d58ff1e759b3780fcc79f` |
| `notes/GROWING_TRANSITION_ABSOLUTE_SAMPLING_FORCED_CANCELLATION_BARRIER.md` | `eb04692b7ce8e06efe254053ba93e4c5f2051ceffe47e68015c9e12886d77584` |
| `tests/test_growing_transition_absolute_sampling_forced_cancellation_barrier.py` | `3bb7d6c45bd0d4d1564624f7ab9f22532229d51dd51d71a474674081fd266a7b` |
| `notes/GROWING_TRANSITION_POLYLOG_BASE_CONTINUOUS_PRIME_SHELL_COROLLARY.md` | `326d4d19a4c7bf93e920f2af1438fb0aba7dc797091bf0957abf9149bca018e1` |
| `tests/test_growing_transition_polylog_base_continuous_prime_shell_corollary.py` | `de07ecbac9c7404edc2508b54d3aa25a15f2d8f102b86199119af65ef9e6a2a7` |
| `notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md` | `7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564` |
| `tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py` | `caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_RESONANCE_AND_NONRESONANT_FRAME_GATE_THEOREM.md` | `511abdb8dd5e9bfe765e518812f19ab8df351803438c0a731387f3dd8d413460` |
| `tests/test_growing_transition_ordered_prime_resonance_and_nonresonant_frame_gate_theorem.py` | `634ec6af8e27db305c22d305d12bdd650b834d947c8afa9a3d6dbf27120482b8` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md` | `7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74` |
| `tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py` | `d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140` |

No prime-number theorem, short-interval estimate, zero list, or numerical
prolate datum is added.  No dyadic localization is used.

## 2. The seven-row realized packet and the vanished bump

The frozen modal-placement theorem realizes the `2m` nodes in (0.2) by
distinct labels congruent to zero modulo four.  Their concentration
eigenvalues satisfy `chi_gamma to 1`, so the physical radial normalization
gate in the polylogarithmic shell theorem is unconditional on these rows.

The frozen correction formula is

\[
 f=g-a_0\psi(2\lambda\,\cdot),\qquad
 H=G-{a_0\over2\lambda}
       \widehat\psi\!\left({\,\cdot\,\over2\lambda}\right).
                                                               \tag{2.1}
\]

On `E`, the new row (0.5a) gives `a_0=0`.  Hence `f=g`, `H=G`, and every
compact, Fourier, mixed, and bump--bump contribution of the invisible
correction to the direct prime shell vanishes identically:

\[
 \widehat Q_{p,11}^{\rm bump}=0=o(T_L).             \tag{2.2}
\]

The frozen one-sided bump estimates control specified odd-Laplace slots;
they do not themselves state a corrected prime-shell bound.  Equation
(2.2) avoids extrapolating those estimates to a new block.

Thus the analytic/modal shell is exactly the corrected physical shell on
`E`, not merely an uncorrected proxy.  The full four-orientation conclusion
of the frozen polylogarithmic shell theorem and modal-placement theorem is

\[
 \|P_E\widehat Q_{p,11}P_E\|=o(T_L).               \tag{2.3}
\]

Thus (2.3) is re-established for the physical source on this smaller
space; it is not inferred from the unexpanded `(1,1)` sentence in the
common-representative note.

The endpoint rows in (0.5) are imposed on this now unchanged physical
source.  The exact trace identity

\[
 \Gamma_{\rm in}-\Gamma_{\rm out}
 ={\sqrt\lambda\over2}\eta                         \tag{2.4}
\]

shows that `Gamma_in=eta=0` also gives `Gamma_out=0`; it is not an eighth
row.  The uncorrected modal local row
`mathcal A_0^(1,mod)` is formed in white coordinates before restriction.
It may depend on `L` and may have large norm, but its kernel has
codimension at most one.  The complete corrected row `mathcal A_1` is a
different scalar row and is retained separately.

Let `E_6` denote the standard six-row space obtained by omitting only
`ell_0` from (0.5).  The frozen tail theorem gives (0.7) on `E_6`, so it
also gives (0.7) on the smaller space `E subset E_6`.  Intersecting the
`m`-dimensional local negative space with all seven scalar kernels costs at
most seven dimensions, which proves (0.6).  The low-row hypotheses apply
because the physical source has

\[
 f(0)=0,\qquad \int_{\mathbb R}f=0,\qquad \eta(f)=0. \tag{2.5}
\]

After the ordered rows are formed, `mathcal A_1=0` implies the exact
ordinary continuation identity

\[
 \mathcal A_0=\lambda\mathcal A_1=0.               \tag{2.6}
\]

Thus the complete corrected `z=0` cross vanishes.  The uncorrected modal
row in (0.5) is used only in the local odd-tail subtraction; it is not
mistaken for the complete row in (2.6).

## 3. Exact ordered prime partition

At a finite Fejer cutoff let `r` and `l` be the inward and outward sampler
indices, let `n>=2` be the prime index, and put

\[
 u_n=\max\{\lambda/n,\lambda^{-1}\}.                \tag{3.1}
\]

The exact direct-source rows into `L^2([u_n,lambda],du)` are

\[
 (\mathcal A_{r,n}x)(u)=\{f_x+H_x\}(ru),\qquad
 (\mathcal B_{ln,n}x)(u)=H_x(lnu).                 \tag{3.2}
\]

Hermitian averaging at that same cutoff gives

\[
 Q_{p,M}={1\over4}\sum_{r,n,l}
 \omega_M(r)\Lambda(n)\omega_M(l)
 \mathsf S(\mathcal A_{r,n},\mathcal B_{ln,n}),
 \qquad \mathsf S(U,V)=U^*V+V^*U.                 \tag{3.3}
\]

Partition the ordered triples into

\[
 \begin{aligned}
 \mathcal T_{11}&=\{r=l=1\},\\
 \mathcal T_{\rm res}&=\{(r,l)\ne(1,1),\ ln=r\},\\
 \mathcal T_{\rm off}&=\{(r,l)\ne(1,1),\ ln\ne r\}.
 \end{aligned}                                     \tag{3.4}
\]

These sets are disjoint and exhaustive.  In particular, a `(1,1)` triple
cannot be resonant, because `ln=r` would force `n=1`, contrary to `n>=2`.
Therefore

\[
 Q_{p,M}=Q_{p,11,M}+Q_{{\rm res},M}+Q_{{\rm off},M}. \tag{3.5}
\]

On `mathcal T_res`, the compact source sample vanishes and the two rows
agree, so

\[
 Q_{{\rm res},M}={1\over2}\sum_{ln=r}
 \omega_M(r)\Lambda(n)\omega_M(l)
 \mathcal B_{r,n}^*\mathcal B_{r,n}\succeq0.       \tag{3.6}
\]

For the off-resonant set use the reciprocal gauge

\[
 \varrho_{r,l,n}={r\over ln},\qquad
 \mathcal A'_{r,l,n}=\varrho_{r,l,n}\mathcal A_{r,n},
 \qquad
 \mathcal B'_{r,l,n}=\varrho_{r,l,n}^{-1}
                         \mathcal B_{ln,n}.          \tag{3.7}
\]

The gauge scalars are positive and reciprocal, so they preserve every
cross exactly:

\[
 \mathsf S(\mathcal A'_{r,l,n},\mathcal B'_{r,l,n})
 =\mathsf S(\mathcal A_{r,n},\mathcal B_{ln,n}).    \tag{3.8}
\]

Put

\[
 \mathfrak H_{\rm off}
 =\bigoplus_{(r,n,l)\in\mathcal T_{\rm off}}
       L^2([u_n,\lambda],du).                       \tag{3.8a}
\]

For a finite prime cutoff `R`, let `Q_(off,M,R)` be (3.3) restricted to
`mathcal T_off` and `n<=R`.  For `x in E`, regard the following maps as
taking values in the full off-subset direct sum, with the omitted
coordinates set to zero:

\[
 \widehat{\mathcal G}_{\pm,M,R}x
 =\bigoplus_{\substack{(r,n,l)\in\mathcal T_{\rm off}\\n\leq R}}
 \sqrt{{\omega_M(r)\Lambda(n)\omega_M(l)\over8}}
 \{\widehat{\mathcal A}'_{r,l,n}
       \pm\widehat{\mathcal B}'_{r,l,n}\}x.       \tag{3.9}
\]

The coefficient `1/8` is forced by

\[
 (U+V)^*(U+V)-(U-V)^*(U-V)=2\mathsf S(U,V).       \tag{3.10}
\]

Hence, exactly at both finite cutoffs,

\[
 \left.P_E\widehat Q_{{\rm off},M,R}P_E\right|_E
 =\widehat{\mathcal G}_{+,M,R}^*
       \widehat{\mathcal G}_{+,M,R}
 -\widehat{\mathcal G}_{-,M,R}^*
       \widehat{\mathcal G}_{-,M,R}.              \tag{3.11}
\]

Every source on `E` is even, compactly supported, endpoint-null, and in
`W^(2,1)` at fixed `lambda`.  Equations (2.5) and (0.5a) give the other
two hypotheses of the frozen endpoint-null Krein theorem.  Apply that
theorem to the fixed finite coefficient packet `V=E`; it proves

\[
 \sum_{r,l,n}{\Lambda(n)\over4}
 \left(\|\widehat{\mathcal A}'_{r,l,n}x\|^2
       +\|\widehat{\mathcal B}'_{r,l,n}x\|^2\right)<\infty.
                                                               \tag{3.12}
\]

The exact whitening is a bounded finite-dimensional domain congruence at
fixed `lambda`, so the cited square summability survives it.  Restricting
to `mathcal T_off` is an orthogonal coordinate deletion.  Hilbert-space
dominated convergence therefore gives genuine off-subset maps

\[
 \boxed{
 \widehat{\mathcal G}_{\pm}x
 =\lim_{M\to\infty}^{\rm ordered}
    \lim_{R\to\infty}
       \widehat{\mathcal G}_{\pm,M,R}x}             \tag{3.13}
\]

at each fixed `lambda`.  Taking the same nested limit in (3.11), using
(3.8), proves the genuine difference-of-positive-Grams identity.  Indeed,
`E` is finite dimensional, so the pointwise Hilbert convergence in (3.13)
is operator-norm convergence and the two positive Grams converge
separately:

\[
 \left.P_E\widehat Q_{\rm off}P_E\right|_E
 =\widehat{\mathcal G}_{+}^*\widehat{\mathcal G}_{+}
 -\widehat{\mathcal G}_{-}^*\widehat{\mathcal G}_{-}. \tag{3.14}
\]

No scalar fixed-product regrouping has been used.  The integral in (3.2)
has its ordinary endpoint values.  Midpoint half-rows belong only to an
alternative mask partition and are not appended to (3.3).

## 4. Ordered limit and complete central identity

The quantifier order is binding:

1. fix `lambda`, the realized packet, a finite Fejer cutoff `M`, and a
   finite prime cutoff `R`;
2. form the exact reciprocal-gauged rows and Hermitianize at those
   cutoffs;
3. make the disjoint split (3.4) without changing representatives;
4. take `R to infinity` in the positive Hilbert norm at fixed `M` and
   `lambda`;
5. take `M to infinity` in the prescribed ordered sense at fixed
   `lambda`; and
6. only then let `lambda to infinity` along (0.1).

The direct-source and endpoint-null Krein theorems give, after step 5,

\[
 \widehat Q_X=\widehat Q_{\rm cont}+\widehat Q_p.   \tag{4.1}
\]

Combining (3.5) and (4.1) proves (0.8).  This identity is exhaustive:
`Q_cont` contains the pole and Archimedean blocks, including its retained
finite-length endpoint, while `Q_p` contains every ordered prime triple.
The invisible-origin correction is already inside the physical profiles
and vanishes on `E` by (0.5a).
There is no additional equality-conductor, midpoint, mask, or central
summand.

The frozen resonance theorem gives uniformly at finite cutoff

\[
 \sup_M\|\widehat Q_{{\rm res},M}\|=O_m(L^2),       \tag{4.2}
\]

and hence the same bound for its ordered limit.  The complete absolute
sampling theorem gives

\[
 \|\widehat Q_X\|
 \leq B_{{\rm out},2m}
 =O_m(\lambda\operatorname {polylog}\lambda)
 =c^{1/2+o(1)}.                                    \tag{4.3}
\]

These estimates use the complete source and exact exterior metric; they
do not assume positivity of the Weil form.

## 5. Scale ledger and exact matching

The strict lower inequality in (0.3) is used exactly here.  From (0.4),

\[
 {B_{{\rm out},2m}\over T_L}
 =c^{1/2-hC+o(1)}L^{2m}\longrightarrow0,\qquad
 {L^2\over T_L}\longrightarrow0.                  \tag{5.1}
\]

Equation (2.3) gives

\[
 \|P_E\widehat Q_{p,11}P_E\|=o(T_L).              \tag{5.2}
\]

Rearrange the exact identity (0.8):

\[
 P_E(\widehat Q_{\rm off}+\widehat Q_{\rm cont})P_E
 =P_E(\widehat Q_X-\widehat Q_{p,11}
                 -\widehat Q_{\rm res})P_E.        \tag{5.3}
\]

Equations (4.2)--(5.2) prove the two-sided operator-norm matching (0.9).
Write its error as `R_L`, so `||R_L||=o(T_L)`.  Then (0.7) gives

\[
 \begin{aligned}
 P_E\widehat Q_{\rm off}P_E
 &=-P_E\widehat Q_{\rm cont}P_E+R_L\\
 &\succeq\left({c'_m\over4}-o(1)\right)T_LP_E
 \succeq{c'_m\over8}T_LP_E
 \end{aligned}                                     \tag{5.4}
\]

for all sufficiently large locked `lambda`.  This proves (0.10).

At fixed `lambda`, (3.14) is an identity of bounded forms induced by
genuine Hilbert maps.  Thus (0.10) gives

\[
 \begin{aligned}
 \widehat{\mathcal G}_{+}^*
       \widehat{\mathcal G}_{+}
 &=\left.P_E\widehat Q_{\rm off}P_E\right|_E
   +\widehat{\mathcal G}_{-}^*
       \widehat{\mathcal G}_{-}\\
 &\succeq {c'_m\over8}T_LI_E.
 \end{aligned}                                     \tag{5.5}
\]

For `x in E`, (5.5) is the norm inequality in (0.13).  Taking the infimum
over the unit sphere of `E` proves the singular-value statement in (0.12).
The argument uses only nonnegativity of the negative Gram; it gives no
upper or lower frame bound for `mathcal G_-`.

The Hilbert convergence (3.13) is separate convergence of both branches,
not merely convergence of their signed difference.  No common target or
uniform norm as `lambda to infinity` is asserted.

## 6. Exact boundary of the conclusion

The result identifies the only same-scale compensator after the completed
continuous theorem: on `E`, the ordered nonresonant prime form equals the
negative of the continuous form up to `o(T_L)`.  It is stronger than a
mere norm dichotomy, but it remains a compressed, packet-dependent result.

It does not extend to the fixed-linear schedule, to a growing packet
dimension, or outside `E`.  It does not prove a positive complete central
form: in fact `Q_X` is used only through the two-sided absolute bound
`||Q_X||=o(T_L)` on this scale.  It also does not identify a mask-resolved
finite-cutoff radical defect, prove an equality-conductor sign, construct
a growing-`lambda` feature limit, control `mathcal G_-`, produce a
canonical generator-level intertwiner, establish equation (5.2), or imply
RH.
