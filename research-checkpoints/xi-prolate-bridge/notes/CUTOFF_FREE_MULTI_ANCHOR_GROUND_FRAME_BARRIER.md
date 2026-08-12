# Cutoff-free multi-anchor ground frame and phase-volume barrier

## 0. Exact outcome and claim boundary

Let `p` tend to infinity through the odd positive integers, put

\[
 \lambda_p={p\over2},\qquad L_p=2\log\lambda_p,
\]

and let `Q_lambda` be the full cutoff-free semilocal Weil operator.  Write
`mu_lambda` for its bottom eigenvalue and `P_lambda` for the complete bottom
spectral projector, including multiplicity and both inversion parities.

This note proves a finite-family extension of the single-anchor estimate.
For vectors `kappa_(lambda,j)` in the operator domain, arbitrary real target
values `q_(lambda,j)`, and

\[
 e_{\lambda,j}=(Q_\lambda-q_{\lambda,j}I)
                    \kappa_{\lambda,j},\qquad
 r_{\lambda,j}=\|e_{\lambda,j}\|,
\]

\[
 \rho_{\lambda,j}
 =\langle\kappa_{\lambda,j},P_\lambda
                    \kappa_{\lambda,j}\rangle,
 \qquad q_{*,\lambda}=\max_j|q_{\lambda,j}|,
\]

one has the exact, multiplicity-safe inequality

\[
 \boxed{
 (|\mu_\lambda|-q_{*,\lambda})_+^2
       \sum_j\rho_{\lambda,j}
 \leq\sum_jr_{\lambda,j}^2.}                       \tag{0.1}
\]

Consequently the exact weakest family correlation needed by this route is

\[
 q_{*,\lambda_p}\longrightarrow0,
 \qquad
 {\sum_jr_{\lambda_p,j}^2
       \over\sum_j\rho_{\lambda_p,j}}
 \longrightarrow0.                                  \tag{0.2}
\]

Condition (0.2) forces `mu_(lambda_p)->0`; domain monotonicity then forces
the full limit `mu_lambda->0`, and the pinned CCM Corollary 3.8 implies RH.
This is an implication, not a proof that (0.2) holds.

For the fixed label-4 cutoff-free anchor, the frozen estimates give the
explicit useful envelope

\[
 r_{\lambda_p,\infty}
 \leq C\lambda_p^8L_p e^{-2\pi\lambda_p^2}            \tag{0.3}
\]

eventually, after increasing `C`.  Thus the single-anchor hypothesis may be
weakened from `limsup rho>0` to

\[
 {r_{\lambda_p,\infty}\over\sqrt{\rho_{\lambda_p}}}
 \longrightarrow0.                                    \tag{0.4}
\]

In particular, `rho>=exp(-o(lambda^2))` is more than enough.  For a family
of `M_lambda=exp(o(lambda^2))` anchors with the same residual exponent, a
total full-ground weight `sum rho_j>=exp(-o(lambda^2))` is enough.

The note also records three sharp barriers.

1. A single even anchor tested against the full projector still has zero
   weight when the full bottom is strictly odd.  Using both the even and odd
   symmetrizations of translated global radicals removes this algebraic
   parity blind spot, but supplies no frame lower bound.
2. Translation cyclicity is qualitative.  The exact translation average is
   a diagonal Fourier multiplier whose lower frame constant is the smallest
   anchor Fourier weight on the target band.  That constant has no current
   source lower bound and tends to zero on the full space.
3. Existing actual-source multiplier estimates leave an exponentially large
   dangerous space, while the stable near-radical prolate inventory has the
   `4 lambda^2` Shannon scale.  A new polynomial phase-volume and capture
   theorem, or the direct residual-weighted correlation (0.2), is still
   required.

No actual full-ground overlap, parity order, polynomial phase volume,
dangerous-space capture, new zero statement, converse, or RH is proved.
The standard eight are untouched and the formal state remains
`P0_INVALIDATED`.

## 1. Frozen dependencies

The binding source and exact repository bytes are:

| Dependency | SHA-256 |
|---|---|
| `vendor/CCM-ZST-2511.22755v1.pdf` | `c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b` |
| `notes/CUTOFF_FREE_PROLATE_GROUND_ALIGNMENT_RH_DICHOTOMY.md` | `37f381b6ed75017633f4c845f90ff7d2660699bc0ae7a4340ec789b0e8dccea7` |
| `tests/test_cutoff_free_prolate_ground_alignment_rh_dichotomy.py` | `b17c3c603d459547c09fd0abb92b595986356e29e1d53f7e8c6f3ace4a8baf80` |
| `notes/GROWING_RETAINED_NEGATIVE_INDEX_CAPTURE_BARRIER.md` | `9fc64fedde255791775861e7a3bb2b2d55eab1a3d402cf8b842d9e0d8519424c` |
| `tests/test_growing_retained_negative_index_capture_barrier.py` | `1e6067e8e4795eac284a8efc12bfc235ff7a6590efce28428b4569320257c4aa` |
| `notes/PHASE_VOLUME_SCALE_AUDIT.md` | `bae7414fed2ac861ac3211175cd8f8b7743c33bd37379e186a71d700554b7fcd` |
| `notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md` | `ec2881e0f233c2c57101e960e3b43cd0abfbf9ee25f342f08a01f35827883d7f` |
| `tests/test_compressed_multiplier_trace.py` | `ff7740f0e07db3674693a92e888935578036e4a745768bf47b10aea2c6a76f9c` |
| `notes/GROWING_WINDOW_THEOREM.md` | `dad6b0a878b7eba21cbc7aa8049cf3bf89a38df766cc157a87c416e79a721ac7` |
| `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` | `3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81` |
| `tests/test_full_source_coframe_rank.py` | `dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a` |
| `notes/NATURAL_CENTERED_GATE_ANCHOR_COFACTOR_NONEMPTYNESS_REDUCTION_BARRIER.md` | `88f6ffa991547f5ca88aacce893a585f3047d7675200288cd18a57cbbcfb7699` |
| `tests/test_natural_centered_gate_anchor_cofactor_nonemptiness_reduction_barrier.py` | `b57ad035543d21e4d6746bb58c19764171706ecc613932f850ea71e6857186bb` |

The first pair supplies the cutoff-free operator, graph transfer, the
label-4 scalar and residual limits, domain exhaustion, and the exact CCM
route from `mu_lambda->0` to RH.  The retained-index pair supplies the
actual multiplier index bound and the logarithmic source-Cauchy
counterfamily.  The phase-volume and compressed-trace notes identify the
actual arithmetic estimate that is missing.  The growing-window note fixes
the prolate Shannon scale, and the full-source note supplies the unrestricted
polynomial coframe together with its non-effective finite-prefix boundary.
The final pair supplies the exact prime-threshold derivative jump.

## 2. Multi-anchor bottom-projection theorem

Fix `lambda` and abbreviate `Q=Q_lambda`, `mu=mu_lambda`, and
`P=P_lambda`.  Spectral calculus gives `PQ=mu P`.  Therefore, for every
column,

\[
 Pe_j=P(Q-q_jI)\kappa_j=(\mu-q_j)P\kappa_j.          \tag{2.1}
\]

Taking squared norms, summing, and using that an orthogonal projection is a
contraction gives

\[
 \sum_j|\mu-q_j|^2\rho_j
 =\sum_j\|Pe_j\|^2
 \leq\sum_jr_j^2.                                    \tag{2.2}
\]

Since

\[
 |\mu-q_j|\geq(|\mu|-|q_j|)_+
              \geq(|\mu|-q_*)_+,                    \tag{2.3}
\]

equations (2.2)--(2.3) prove (0.1).  No bottom simplicity, parity choice,
gap, or normalization of the columns is used.

There is a stronger synthesis-operator version.  Define

\[
 Kc=\sum_jc_j\kappa_j,\qquad
 Ec=\sum_jc_je_j,\qquad S=KK^*.                       \tag{2.4}
\]

If the full bottom space obeys the frame condition

\[
 PSP\succeq c_\lambda P,
 \qquad c_\lambda>0,                                  \tag{2.5}
\]

then every unit `g in Ran P` satisfies

\[
 \|E^*g\|^2
 =\sum_j|\mu-q_j|^2|\langle\kappa_j,g\rangle|^2
 \geq(|\mu|-q_*)_+^2\langle g,Sg\rangle.             \tag{2.6}
\]

Hence

\[
 \boxed{
 (|\mu_\lambda|-q_{*,\lambda})_+
 \leq{\|E_\lambda\|\over\sqrt{c_\lambda}}.}        \tag{2.7}
\]

The Hilbert--Schmidt bound `||E||^2<=sum r_j^2` makes (2.7) a convenient
sufficient estimate.  It coincides with (0.1) for a simple bottom when
`c_lambda=<g,Sg>=sum rho_j`.  At a multiple bottom, (0.1) is instead the
sharper trace inequality, while (2.7) uses the smallest frame eigenvalue.
Coherent residual cancellation can make (2.7) sharper in a different
direction than the columnwise estimate.

For the frozen anchor, the finite residual estimate has

\[
 r_{\lambda_p,N_p}
 \leq\sqrt{B_{\rm abs}(\lambda_p,N_p)
                  U_{Z,\lambda_p,N_p}}
       +U_{Z,\lambda_p,N_p},                         \tag{2.8}
\]

with `B_abs=O(lambda^3 L^2)`, `U_Z=o(d_6)`, and

\[
 d_{6,p}=\Theta(\lambda_p^{13}e^{-4\pi\lambda_p^2}). \tag{2.9}
\]

Eventually `U_Z<=d_6`, so (2.8)--(2.9), followed by the much smaller graph
tail, prove (0.3).  Thus the exponent statement in Section 0 is already
contained in the frozen estimates; no numerical extrapolation is used.

## 3. Rank-one spectral flow and the exact residue statistic

The overlap has a multiplicity-safe spectral-flow interpretation.  For a
unit or nonunit vector `kappa`, set

\[
 m_\kappa(s)=\lambda_{\min}
   (Q-s|\kappa\rangle\langle\kappa|),\qquad s\geq0.    \tag{3.1}
\]

Degenerate first-order perturbation theory, equivalently the min--max
principle on the bottom eigenspace, gives

\[
 \boxed{-m_\kappa'(0+)
 =\lambda_{\max}(P|\kappa\rangle\langle\kappa|P)
 =\|P\kappa\|^2=\rho.}                              \tag{3.2}
\]

For a family with `S=KK^*`, the same derivative is
`-lambda_max(PSP)`.  The total weight in (0.1) is the bottom-pole residue

\[
 \boxed{
 \sum_j\rho_j
 =\lim_{z\uparrow\mu}(\mu-z)
    \operatorname {tr}\!\left(
       K^*(Q-zI)^{-1}K\right).}                       \tag{3.3}
\]

Thus a lower bound for (3.3), or for the left side of (2.5), is an exact
full-projector formulation of the missing actual-source correlation.
Ordinary moment sum rules do not supply it.  Each anchor spectral measure
has

\[
 \int1\,d\nu_j=\|\kappa_j\|^2,\quad
 \int(x-q_j)^2\,d\nu_j=r_j^2,
 \quad \nu_j(\{\mu\})=\rho_j,                         \tag{3.4}
\]

but the mass near `q_j` may sit on an excited level while the bottom atom
has arbitrarily small weight.  Cyclicity says only that the atom is nonzero
when the spectrum is simple.  It supplies no lower rate.

## 4. Full projector, parity, and paired translates

Write `Q=Q_+ direct-sum Q_-`, with bottom values `mu_+` and `mu_-`, and let
the original anchor be even.  Then exactly

\[
 \rho_\lambda^{\rm full}
 =\begin{cases}
   \langle\kappa,P_{\mu_+,+}\kappa\rangle,
       &\mu_+\leq\mu_-,\\
   0,&\mu_-<\mu_+.
  \end{cases}                                          \tag{4.1}
\]

At equality the full projector also contains the odd bottom space, but that
extra summand is orthogonal to the even anchor.  Hence using the full
projector makes the implication to RH legal; it does not prove or bypass a
parity order for one even anchor.

There is an algebraic way to remove the blind spot for a family.  Let `T_s`
be global translation in centered logarithmic coordinates and let `K` be an
even global radical state.  Put

\[
 K_s^+={T_sK+T_{-s}K\over\sqrt2},\qquad
 K_s^-={T_sK-T_{-s}K\over\sqrt2}.                    \tag{4.2}
\]

The first vector is even and the second is odd.  For every `g`, the
parallelogram identity gives

\[
 |\langle g,K_s^+\rangle|^2
 +|\langle g,K_s^-\rangle|^2
 =|\langle g,T_sK\rangle|^2
 +|\langle g,T_{-s}K\rangle|^2.                       \tag{4.3}
\]

Because the full operator commutes with inversion and
`T_(-s)K=J T_sK`, two translated states assigned the same real target `q`
have defects related by inversion:

\[
 (Q-qI)T_{-s}K=J(Q-qI)T_sK.                         \tag{4.4}
\]

Their even and odd defect combinations obey the same parallelogram identity
as (4.3).  Thus a residual-weighted frame built from both signs can see
either parity without first proving `mu_+<=mu_-`.  Equations (4.3)--(4.4)
are only an algebraic reduction: no lower frame bound for the actual
translated states is presently known.

## 5. Exact translation-frame obstruction

On the log interval of length `L`, let `U_s` denote periodic translation and
write

\[
 \kappa=\sum_{n\in\mathbb Z}\kappa_nV_n,qquad
 g=\sum_{n\in\mathbb Z}g_nV_n.                         \tag{5.1}
\]

Fourier orthogonality gives the exact continuous average

\[
 \boxed{
 {1\over L}\int_0^L
       |\langle g,U_s\kappa\rangle|^2\,ds
 =\sum_{n\in\mathbb Z}|g_n|^2|\kappa_n|^2.}          \tag{5.2}
\]

For finitely many base anchors the multiplier on the right is
`sum_a |kappa_(a,n)|^2`.  Consequently the exact lower frame constant on
the Fourier band `|n|<=R` is

\[
 c_R=\min_{|n|\leq R}\sum_a|\kappa_{a,n}|^2.          \tag{5.3}
\]

Qualitative translation cyclicity means only that the multiplier is nonzero
almost everywhere.  Since every finite family belongs to `ell^2`,

\[
 \sum_a|\kappa_{a,n}|^2\longrightarrow0
 \qquad(|n|\longrightarrow\infty),                    \tag{5.4}
\]

so there is no full-space lower frame bound.  Even on a growing band,
analyticity and nonvanishing give no quantitative lower bound for (5.3).
Translations change phases, not the magnitudes in (5.3).

There is also a boundary tradeoff.  Translating a global radical through a
fixed interior range can preserve a small truncation defect, but the
restricted translation Gram has eigenvalues tending to zero as the target
dimension grows.  Translating through the complete period yields (5.2),
but includes states centered arbitrarily close to the semilocal boundary,
where the exponentially small radical leakage is lost.  Domain exhaustion
alone supplies neither a uniform interior frame nor a boundary nonescape
theorem.

## 6. Coercive dimension versus the prolate Shannon scale

The scalar diagonal-plus-Cauchy estimate has

\[
 a_n\geq\log(|n|/2)-{1\over2\pi|n|}-C_a(\lambda),
 \qquad \|D_bH-HD_b\|\leq c_\lambda,                  \tag{6.1}
\]

where `C_a(lambda)+c_lambda=O(lambda log lambda)`.  Its direct high-mode
cutoff is therefore

\[
 R_\lambda=\exp(O(\lambda\log\lambda)).                \tag{6.2}
\]

This is enough for compact resolvent, but not for a polynomial-dimensional
ground capture.

Let `H_u=A-uI` be the retained plus-sector anchor-complement compression
from the frozen theorem, with `u<=U_Z`.  The sharper actual multiplier
reduction writes, for suitable `g`, `delta`, and every finite orthogonal
compression `P`,

\[
 n_-(P H_uP)
 \leq {L\Phi_\lambda(U,g)
             \over2\pi(g-\delta)}.                       \tag{6.3}
\]

The currently proved phase-volume bound gives only

\[
 n_-(P H_uP)\leq\exp(O(\lambda)).                       \tag{6.4}
\]

With `g-delta` comparable to `L`, the new arithmetic estimate

\[
 \boxed{
 \Phi_\lambda(U_Z,g)\ll{\lambda^2\over\log\lambda}}    \tag{6.5}
\]

would reduce (6.3) to `O(lambda^2)`.  The phase-volume audit proves that
(6.5) follows neither from the pinned PNT, fixed moments, nor the
infinite-time Haar law.  It is neither proved nor rigorously disproved for
the actual prime polynomial.

The compressed multiplier trace does give an `O(lambda^2)` dangerous rank
when its Fourier cutoff itself satisfies `N asymptotic lambda^2`.  At the
exponential projection schedule, its leading trace term is proportional to
`N`, so that theorem does not pass to the cutoff-free problem.

On the source side, the prolate parameter is

\[
 c=2\pi\lambda^2,
 \qquad {2c\over\pi}=4\lambda^2.                         \tag{6.6}
\]

The growing-window theorem proves that after only an `O(log lambda)` buffer
beyond (6.6), every prolate concentration defect is at least `1/2`.  Thus
the stably near-radical prolate eigenspace has only `O(lambda^2)` dimensions.
The unrestricted full-source map has the exact row floor

\[
 TT^*\succeq{1\over8\lambda^4}I_X                    \tag{6.7}
\]

on every fixed finite physical target `X`, but the finite prolate prefix
which inherits a floor is non-effective and has no simultaneous small
radical-residual estimate.  Equations (6.4), (6.6), and (6.7) are the precise
rank/exponent mismatch.

## 7. Why source-Cauchy displacement and boundary jumps do not close it

The structural obstruction is exact.  Put

\[
 b_n=B\sin{\pi n\over2},\qquad a_n=\log(|n|+2),             \tag{7.1}
\]

and use the source-Cauchy entries

\[
 Q^{(B)}_{nm}={b_n-b_m\over n-m}\quad(n\ne m).             \tag{7.2}
\]

The frozen countermodel has the exact rank-two displacement, inversion
symmetry, and logarithmic high-mode coercivity, yet its even block has a
negative subspace of dimension comparable to `e^(B/4)`.  At the same time,
all modes above `e^((2 pi+1)B)` have a positive floor.  Thus the rank two of
the commutator is not a rank bound for the operator or its dangerous
projector.  With `B=lambda`, the negative dimension is superpolynomial while
remaining inside the available structural coefficient envelope.

This family is not the actual von Mangoldt operator and does not disprove
(6.5).  It proves that no diagonal average, displacement-rank count,
logarithmic tail, or source-Cauchy identity can prove a polynomial cutoff
without using new arithmetic information.

On each finite source compression, the prime-threshold
Hellmann--Feynman jump has the form

\[
 \Delta\partial_LQ=-c_r|\eta_r\rangle\langle\eta_r|.       \tag{7.3}
\]

On a simple branch it measures `|<eta_r,g_lambda>|^2`.  It does not measure
the radical-anchor residue (3.3), and it is blind on
`Ran P_lambda intersect eta_r^perp`.  Between thresholds the interval,
blocks, and shift operators continue to move.  Summing the rank-one jumps
therefore gives neither a rank bound for the accumulated prime operator nor
a lower bound for the ground frame.

## 8. Stopping line

Any one of the following actual-source statements would close the new
multi-anchor route.

1. Construct a finite family in both parities for which (0.2) holds.
2. Prove the operator frame and defect estimate

   \[
    P_\lambda K_\lambda K_\lambda^*P_\lambda
       \succeq c_\lambda P_\lambda,
    \qquad
    {\|E_\lambda\|\over\sqrt{c_\lambda}}
       \longrightarrow0.                                  \tag{8.1}
   \]
3. Prove the polynomial phase-volume bound (6.5), capture its dangerous
   projector by an `O(lambda^2)` near-radical source range, and control the
   combined residual synthesis on that range.

The first is the weakest exact correlation.  The second is a convenient
frame form.  The third explains what an averaged prime/coercivity proof
would have to add.  Pointwise nonorthogonality, analyticity, cyclicity,
spectral moments, domain exhaustion, boundary rank-one jumps, and the
present source-Cauchy/logarithmic estimates prove none of them.
