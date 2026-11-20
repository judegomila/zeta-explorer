# Growing-rest transition-capture and fixed-plane nonimplication barrier

## 0. Exact outcome and fail-closed boundary

This note audits two proposed routes to the singleton-shorted growing-rest
inequality (5.9) of the frozen growing-rest reduction.

First, the realized transition packet can be made exactly orthogonal to the
label-4 physical anchor.  Adding that one scalar row to the seven frozen
packet rows leaves a nonzero space when `m>8`:

\[
 E_\kappa=E\cap\ker\ell_\kappa,
 \qquad \dim E_\kappa\geq m-8>0.                       \tag{0.1}
\]

Its physical image belongs to the actual anchor-deflated growing rest and,
with the retained half-power choice, to the harmonic retained space `Y`.
This is only a range statement.  In full-metric white coordinates the exact
capture map is

\[
 \boxed{C_E=P_0J,\qquad C_E^*C_E=J^*P_0J.}             \tag{0.2}
\]

The missing quantitative theorem is the lower coframe

\[
 \boxed{J^*P_0J\succeq\kappa_E I_{E_\kappa}}          \tag{0.3}
\]

at a usable growing-`lambda` scale.  The structured full/block exterior
metric bridge does not prove (0.3): it controls the metric, not the angle of
the packet injection to `ker A`.  Qualitative physical-map injectivity also
supplies no locked polynomial value of `kappa_E`.

Second, the favorable fixed label-8/12 plane remains favorable when the
shift is lowered from `U_Z` to the genuine lower Ritz value `u`.  That fact
cannot be iterated at fixed depth to prove a growing-rest floor.  An exact
coherent rank-one family has uniformly favorable fixed-label principal
planes while its full rest floor is `L tau_q`, which may tend to zero or
become slightly negative.  The family has an exact paired-slot Gram
realization and even has identical full and block source metrics.

These are implication barriers, not counterexamples to the actual
prolate--Weil matrices.  In particular, this note does **not** prove that the
actual transition packet loses quotient capture, that the actual growing
rest floor collapses, or that (5.9) fails.  It proves no strict sector sign,
source-angle floor, equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant
limit, RH conclusion, or Lambda bound.  The project remains fail closed at
`P0_INVALIDATED`, and the pole--Archimedean--prime cancellation remains
assembled before any sign or inverse is used.

## 1. Frozen inputs

The following exact repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md` | `000be1947a8cc22e7f96a080b8775ce0343fbeb36f886929c7ea5188191e0932` |
| `tests/test_growing_rest_signed_radical_tail_schur_reduction.py` | `3a28e4ae33896fa14ad2f68bf8fa5de71abf49d1b62bcc8a95d6751cbd306970` |
| `notes/STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md` | `ad11c56795dd721f09b4bdfce286c69ba8825867ccf03e3a127e27957f93aa86` |
| `tests/test_structured_full_block_exterior_metric_quotient_bridge_theorem.py` | `bd772ad22906038480061226b9271ecfb76b3b5099065e6ae7b958d2d423095d` |
| `notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md` | `787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79` |
| `tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py` | `73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7` |
| `notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md` | `3d6428991a0e66e1c2752c8eec76375576e6f94f68a65891cd3215495e6d4e61` |
| `tests/test_physical_map_conditioning.py` | `d5caad0dc12a2b3ca202fa49552c9cc384b3fc4c4ac3f71b68cc74e90970e396` |
| `notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md` | `1d900d615aaa21845f8413b9677286901bf41855d43c7df5c6fecea88f06a1b1` |
| `notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md` | `aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce` |
| `tests/test_lower_ritz_half_power_one_inverse_source_angle_reduction.py` | `27b8284faefe471934d40ca0937bdba4cb4a764b7aa1597559fd1cc0c774a9ed` |
| `notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md` | `e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17` |
| `tests/test_fixed_even_8_12_plane_archimedean_arithmetic_floor_theorem.py` | `545fe85867f427cf778aabbb2b4a57dcc268d99ff13e5ca096d84d52d1cdf09f` |

All spaces below are finite dimensional.  Every pseudoinverse and support
projection is therefore unambiguous.

## 2. The eighth row and exact physical range capture

Use the realized polylogarithmic-base packet of the frozen prime-frame
theorem with fixed `m>8`.  Its seven-row space is

\[
 E=E_-\cap\bigcap_{j=1}^7\ker\ell_j,
 \qquad \dim E\geq m-7.                               \tag{2.1}
\]

All selected modal labels are divisible by four and, for sufficiently
large locked `lambda`, lie below `n_*` and above the fixed labels.  They
therefore belong to the declared rest inventory

\[
 \mathcal T_R=\{12,16,20,\ldots\}\cap[0,n_*).          \tag{2.2}
\]

Let `V_R` denote the exact physical synthesis of the zero-integral rest
sources before label-4 orthogonal deflation.  Let `iota_E` insert the
selected packet coefficients into the rest inventory, including the
inverse of the exact packet whitening.  Thus the domain of `iota_E` carries
the source-white norm used in (2.7).  With `kappa` the normalized physical
label-4 anchor, impose the additional scalar row

\[
 \ell_\kappa(x)=\langle\kappa,V_R\iota_E x\rangle,
 \qquad
 E_\kappa=E\cap\ker\ell_\kappa.                       \tag{2.3}
\]

One scalar row costs at most one dimension, so

\[
 \dim E_\kappa
 \geq\dim E-1\geq m-8>0.                              \tag{2.4}
\]

Write `P_kappa=I-kappa kappa^*` and `W_R=P_kappa V_R` for
the actual anchor-deflated rest synthesis.  For every `x in E_kappa`,

\[
 \boxed{
 V_R\iota_E x=P_\kappa V_R\iota_E x
              =W_R\iota_E x\in\mathcal K_L.}          \tag{2.5}
\]

Thus the added row supplies exact physical range membership; it is not a
norm estimate.  In the half-power construction one may take

\[
 F\subset\mathcal K_L^\perp,
 \qquad \mathcal K_L\subset Y,                         \tag{2.6}
\]

so the same packet image is retained by `Y`.  Neither (2.5) nor (2.6)
identifies the transition positive feature with ordinary paired-zero
sampling or with the harmonic lift `E_u`.

Every frozen compression estimate on `E` survives restriction to
`E_kappa`.  In particular,

\[
 \widehat{\mathcal G}_+^*\widehat{\mathcal G}_+
 \succeq {c'_m\over8}T_LI_{E_\kappa},
 \qquad
 T_L={e^{hCL}\over L^{2m}},\quad {1\over2}<hC<1,       \tag{2.7}
\]

and the complete continuous/off cancellation remains

\[
 \left\|P_{E_\kappa}
 (\widehat Q_{\rm off}+\widehat Q_{\rm cont})
 P_{E_\kappa}\right\|=o(T_L).                         \tag{2.8}
\]

Restriction creates no new sign for the complete form.

## 3. Exact full-metric quotient capture map

Use the actual full exterior metric on the singleton/rest source:

\[
 X=X_8\oplus X_R,
 \qquad D_{\rm full}>0,
 \qquad W=[\,W_8\;W_R\,].                              \tag{3.1}
\]

In full-metric white coordinates put

\[
 A=WD_{\rm full}^{-1/2},
 \qquad P_0=A^\dagger A=1_{(\ker A)^\perp},            \tag{3.2}
\]

\[
 R_{\rm full}=AA^*,
 \qquad
 \Delta_{\rm full}=R_{\rm full}^\dagger
     \big|_{\mathcal K_L}.                             \tag{3.3}
\]

Let `widetilde iota_E:E_kappa -> X` be the raw coefficient injection
whose singleton coordinate is zero and whose rest coordinates are those
in (2.5).  The exact injection into full-metric white source coordinates is

\[
 J=D_{\rm full}^{1/2}\widetilde\iota_E,
 \qquad AJx=W\widetilde\iota_E x.                      \tag{3.4}
\]

Although the raw packet uses rest labels only, `D_full^(1/2)` need not
preserve the displayed coordinate block.  Its image in (3.4) is the
full-metric-white rest injection meant by `J`.

The minimum-energy quotient identity is exact:

\[
 \boxed{
 \langle AJx,\Delta_{\rm full}AJx\rangle
 =\|P_0Jx\|^2
 =\langle x,J^*P_0Jx\rangle.}                         \tag{3.5}
\]

Indeed, the minimum-norm representative of `AJx` is `P_0Jx`.  Therefore
the transition packet is quantitatively captured by the quotient at scale
`kappa_E` if and only if

\[
 \boxed{
 C_E:=P_0J,
 \qquad C_E^*C_E=J^*P_0J\succeq\kappa_EI_{E_\kappa}.} \tag{3.6}
\]

This is the earliest missing capture map.  The qualitative statement
`AJx` belongs to `K_L` proves neither injectivity of `C_E` on the locked
schedule nor a polynomial lower bound for its least singular value.

## 4. Why the structured metric bridge does not supply the coframe

The frozen structured theorem proves

\[
 (1-\varepsilon_L)D_{\rm block}
 \preceq D_{\rm full}
 \preceq(1+\varepsilon_L)D_{\rm block},
 \qquad \varepsilon_L=O(\lambda^{-4}).                 \tag{4.1}
\]

It consequently compares the two physical quotient metrics.  It does not
bound the support projection in (3.2) on the particular injected packet.
The distinction already appears with identical metrics.  For `delta>0`,
take

\[
 D_{\rm full}=D_{\rm block}=I_2,
 \qquad A_\delta=\begin{pmatrix}1&\delta\end{pmatrix},
 \qquad J_\delta=\begin{pmatrix}0\\1\end{pmatrix}.    \tag{4.2}
\]

Then `epsilon_L=0`, `A_delta J_delta` is nonzero, and

\[
 P_{0,\delta}={1\over1+\delta^2}
 \begin{pmatrix}1&\delta\\\delta&\delta^2\end{pmatrix},
 \qquad
 \boxed{
 J_\delta^*P_{0,\delta}J_\delta
 ={\delta^2\over1+\delta^2}\longrightarrow0.}         \tag{4.3}
\]

Thus even exact full/block metric equality and pointwise nonzero physical
images do not give a uniform coframe.  This is an abstract quotient model,
not an assertion about the actual synthesis.

The physical-map conditioning theorem proves qualitative injectivity only
after an unspecified finite projection threshold at each fixed `lambda`.
It explicitly supplies no proof that the locked projection exceeds that
threshold uniformly and no lower singular-value scale.  Hence it cannot
replace (3.6).

## 5. Why the transition frame gives no present source-angle no-go

Equations (2.7)--(2.8) exhibit forced cancellation: a positive off-prime
feature has source-white floor `T_L`, while its leading complete
continuous/off contribution cancels.  Three identifications would still be
needed before this could bound the retained angle `theta_lambda`.

1. The Hilbert map `widehat mathcal G_+` would have to be a controlled
   subfeature of the ordinary paired-zero analysis after harmonic
   shorting.
2. The quotient energy would have to control the packet source norm through
   (3.6), with a known `kappa_E`.
3. The complete packet form would have to be compared with the genuine
   lower-Ritz harmonic short, including its scalar shift.

The only exact quotient energy presently available is (3.5).  The lower
frame (2.7) is a different Gram and does not insert a factor `T_L` into
`J^*P_0J`.

The shift obstruction is algebraic.  If `Q_phys` denotes the complete
physical signed operator, its direct pullback to the packet is

\[
 \boxed{
 J^*A^*(Q_{\rm phys}-uI)AJ
 =J^*A^*Q_{\rm phys}AJ-uJ^*A^*AJ.}                    \tag{5.1}
\]

In unwhitened source notation this is `Q_X-u G_phys`, not `Q_X`.
The genuine lower Ritz value `u` has no proved nonnegative sign and no
frozen rate which makes the second term harmless.  Moreover the harmonic
quadratic is

\[
 \langle y,\Sigma_u y\rangle
 =\min_{f\in F}\langle(y,f),B_u(y,f)\rangle,           \tag{5.2}
\]

so the unshorted transition pullback is not automatically `Sigma_u`.

Put `T_E=AJ:E_kappa -> Y` and define the exact harmonic packet pullback

\[
 \mathfrak S_{u,E}=T_E^*\Sigma_uT_E.                  \tag{5.3}
\]

Even under the extra, unproved comparison

\[
 \widehat{\mathcal G}_+^*\widehat{\mathcal G}_+
 \preceq C_R\mathfrak S_{u,E},
 \qquad \mathfrak S_{u,E}\preceq C\lambda P I_E,      \tag{5.4}
\]

one would get only

\[
 C_R\gtrsim{T_L\over\lambda P}.                        \tag{5.5}
\]

Combining (5.5) with the current conditional estimate
`C_R=O(lambda^3P/theta_lambda)` yields

\[
 \theta_\lambda\lesssim
 {\lambda^4P(\lambda)^2\over T_L}.                    \tag{5.6}
\]

Even the unproved collective replacement
`C_R=O(lambda P/theta_lambda)` would yield only

\[
 \theta_\lambda\lesssim
 {\lambda^2P(\lambda)^2\over T_L}.                    \tag{5.7}
\]

Since `T_L=lambda^(2hC)` times a reciprocal polylogarithm and `hC<1`,
neither right side is a decaying upper bound.  Thus these conditional
scale ledgers do not contradict the required
`theta_lambda >> lambda^(-1+eta) polylog(lambda)`.  The previously tempting
`lambda/T_L` upper bound does not follow from the frozen maps.

## 6. The fixed 8/12 plane survives the lower shift

On the frozen fixed label-8/12 plane, positivity at the stronger shift
`U_Z` transfers monotonically to the genuine lower Ritz shift because

\[
 u\leq q\leq U_Z,
 \qquad
 Q-uI=(Q-U_ZI)+(U_Z-u)I.                               \tag{6.1}
\]

The structured full/block metric bridge perturbs the relevant quotient
metric by only `1+O(lambda^(-4))`.  These are favorable facts.  They remain
fixed-dimensional and do not control coherent combinations across a rest
inventory of dimension `q=q(lambda)`.

## 7. Exact coherent fixed-plane nonimplication family

Fix a model rest dimension `q>=2`, `L>0`, and `-1<=tau<=1`.  This `q` is
unrelated to the Ritz scalar in (6.1).  Put

\[
 v={1\over\sqrt q}{\bf1}_q,
 \qquad
 R_{q,\tau}=I_q-(1-\tau)vv^*,                          \tag{7.1}
\]

and define the singleton/rest shifted form

\[
 H_{q,\tau}
 =L\begin{pmatrix}1&0\\0&R_{q,\tau}\end{pmatrix}.
                                                               \tag{7.2}
\]

Take `D_full=D_block=G=P_0=I_(q+1)` and zero singleton/rest cross.
The singleton short is exactly `L R_(q,tau)`, whose eigenvalues are

\[
 L\quad(q-1\hbox{ times}),
 \qquad L\tau\quad(1\hbox{ time}).                    \tag{7.3}
\]

For a fixed set `I` of `k` rest coordinate labels, its principal block is

\[
 R_{q,\tau}[I,I]
 =I_k-{1-\tau\over q}{\bf1}_k{\bf1}_k^*.              \tag{7.4}
\]

Its eigenvalues are one with multiplicity `k-1` and

\[
 \boxed{1-(1-\tau){k\over q}.}                         \tag{7.5}
\]

Thus every fixed-label principal plane, and indeed every fixed number of
coordinate labels, has a floor tending to `L` as `q` grows, independently
of whether the coherent full-rest eigenvalue `L tau` tends to zero.

Fixed-depth Schur iteration does not remove the coherent direction.  If
the `k` coordinates in `I` are eliminated and `J=I^c`, the exact Schur
complement is

\[
 S_{q,\tau,I}
 =I_{q-k}
 -{1-\tau\over1-(1-\tau)k/q}\,v_Jv_J^*,              \tag{7.6}
\]

and its coherent eigenvalue is

\[
 \boxed{{\tau\over1-(1-\tau)k/q}.}                    \tag{7.7}
\]

For fixed `k`, this has the same asymptotic scale and sign as `tau`.
Only a depth comparable with `q` can expose the coherent load by coordinate
pivots.

The family also obeys the exact paired-slot structure.  Let

\[
 \mathfrak A=L I_{q+1},
 \qquad
 \mathfrak A^{\parallel}_{q,\tau}
 ={\mathfrak A+H_{q,\tau}\over2},
 \qquad
 \mathfrak A^{\rm anti}_{q,\tau}
 ={\mathfrak A-H_{q,\tau}\over2}.                     \tag{7.8}
\]

Because the spectrum of `H_(q,tau)` lies in `[-L,L]`, both matrices in
(7.8) are positive semidefinite, and

\[
 \mathfrak A^{\parallel}_{q,\tau}
 +\mathfrak A^{\rm anti}_{q,\tau}=\mathfrak A,
 \qquad
 \mathfrak A^{\parallel}_{q,\tau}
 -\mathfrak A^{\rm anti}_{q,\tau}=H_{q,\tau}.         \tag{7.9}
\]

Cholesky factors give explicit paired-slot feature maps.  Hence this is
not merely a formal Hermitian matrix family.

Choosing `tau_q>0` with `tau_q->0` preserves positivity but destroys every
uniform quantitative growing-rest floor.  Choosing `tau_q<0` with
`tau_q->0` makes the full rest slightly indefinite while every fixed-label
principal block is eventually positive.  The second choice proves only a
logical nonimplication from fixed-plane data; it does not assert that the
actual growing rest is indefinite.

## 8. Earliest missing theorem

The transition packet now has exact physical range membership, but a
usable argument still needs both of the following source-specific inputs.

1. A locked quantitative capture theorem for the map in (3.6), with an
   explicit lower scale for `kappa_E` after the full metric and physical
   quotient are applied.
2. A growing-rest signed theorem which controls the coherent rest--rest
   direction and the singleton-relative cross, equivalently the actual
   inequality

\[
 \inf_{0\ne y\in X_R}
 {\langle y,K_{\mu_0}y\rangle
       -|c_{\mu_0}^*y|^2/s_{\mu_0}\over\|y\|^2}
 \geq0,
 \qquad s_{\mu_0}>0,                                  \tag{8.1}
\]

or a stronger quantitative version on one unbounded locked schedule.

A whole-growing-rest Bessel/coframe or mixed-row estimate could provide
the second input.  The fixed 8/12 plane and any fixed-depth Schur iteration
cannot.  Until (3.6) and (8.1), or a direct cancellation-preserving
substitute, are proved, the required source angle

\[
 \Sigma_u\succeq\theta_\lambda\Delta_Y,
 \qquad
 \theta_\lambda\gg
 \lambda^{-1+\eta}\operatorname {polylog}\lambda       \tag{8.2}
\]

remains an open hypothesis.  No actual floor is demoted by this note.
