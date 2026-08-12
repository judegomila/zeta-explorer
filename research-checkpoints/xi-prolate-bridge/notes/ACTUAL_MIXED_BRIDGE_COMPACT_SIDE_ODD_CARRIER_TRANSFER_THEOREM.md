# Actual mixed-bridge compact-side odd carrier transfer theorem

## 0. Outcome and exact boundary

Use the locked positive-at-origin prolate convention.  For real
`lambda>1`, put

\[
 b_\lambda=h_{2,\lambda}-{I_2\over I_0}h_{0,\lambda},
 \qquad A_\lambda=b_\lambda(0),
 \qquad X_\lambda=C_\lambda{\cal E}b_\lambda,       \tag{0.1}
\]

and let

\[
 w_\lambda=S_-X_\lambda,
 \qquad
 q^{\rm phys}_{\lambda,-}
 =\langle w_\lambda,Q_-w_\lambda\rangle.           \tag{0.2}
\]

Let `rho` run over the full nontrivial-zero multiset, with algebraic
multiplicity, and retain the checkpoint-1.75 quantities

\[
 C_\xi=\sum_\rho{1\over\rho(1-\rho)},
 \qquad
 {\cal S}_\lambda=\sum_\rho{\lambda^{-2\rho}\over\rho^2},
                                                               \tag{0.3}
\]

\[
 {\mathfrak b}_{\lambda,-}
 ={A_\lambda^2C_\xi\over8\lambda}
  -{A_\lambda^2\over8}{\cal S}_\lambda.            \tag{0.4}
\]

On the locked natural halfgrid

\[
 \lambda_p={p\over2},
 \qquad p\text{ every sufficiently large odd positive integer}, \tag{0.4a}
\]

this note proves the compact-side transfer

\[
 \boxed{
 q^{\rm phys}_{\lambda_p,-}
 = {\mathfrak b}_{\lambda_p,-}+r_p,
 \qquad r_p=o(\lambda_p^{-1}).}                     \tag{0.5}
\]

In fact, the admitted positive two-slot sampling estimate gives, for a
fixed polynomial envelope `P(lambda,log lambda)`,

\[
 |r_p|
 \leq C\left\{{\cal P}(\lambda_p,\log\lambda_p)^2d_2
       +{\cal P}(\lambda_p,\log\lambda_p)\sqrt {d_2}\right\},
 \qquad
 d_2\asymp\lambda_p^5e^{-4\pi\lambda_p^2}.          \tag{0.6}
\]

Checkpoint 1.75 retains the continuous **carrier-only** equivalence

\[
 \boxed{
 {\mathfrak b}_{\lambda,-}=O(\lambda^{-1})
 \text{ for every sufficiently large real }\lambda
 \quad\Longleftrightarrow\quad {\rm RH},}           \tag{0.7}
\]

The new physical conclusion is only on the complete schedule (0.4a):

\[
 \boxed{
 q^{\rm phys}_{\lambda_p,-}=O(\lambda_p^{-1}),
 \quad p\text{ every sufficiently large odd positive integer}
 \quad\Longleftrightarrow\quad {\rm RH}.}           \tag{0.8}
\]

Equations (0.7)--(0.8) are equivalences, not unconditional bounds.  The
continuous physical-self transfer is not proved.  These equivalences prove
neither side holds without the other; in particular they do not prove RH.

The proof deliberately does **not** establish the literal noncompact
outer-distribution identity

\[
 \operatorname {FP}^{\rm ord}_{s=0}
 \{W_{0,2}-W_{\mathbb R}-W_p\}
       (S_-O_{{\rm corr},{\rm phys}})^2
 =q^{\rm phys}_{\lambda,-}.                          \tag{0.9}
\]

Instead it applies the physical explicit formula only to compact
bounded-variation Fejer approximants of `w_lambda`, and then uses the exact
two-slot radical identity in the absolutely convergent zero-sampling space.
The spectral representative is never inserted into the physical
pole--Archimedean--prime distribution.

The shifted energy still is

\[
 E_\lambda=q^{\rm phys}_{\lambda,-}
              -\mu\|w_\lambda\|^2.                 \tag{0.10}
\]

No bound for `mu`, no `kappa*log^2(lambda)` reserve, no bridge overlap, no
bottom-projector floor, no new zero statement, and no RH conclusion is
proved.  The standard eight are untouched and the formal state remains
`P0_INVALIDATED`.

## 1. Frozen inputs

The direct FROZEN inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/ACTUAL_MIXED_BRIDGE_INDIVIDUAL_ODD_FINITE_PART_RH_BARRIER.md` | `e107730d3a51bc727f030ff6bb2711fde01eab3c9a3eafb11dcd2fafd68ecfbc` |
| `tests/test_actual_mixed_bridge_individual_odd_finite_part_rh_barrier.py` | `2c5a14ccb10ffff51d53955aa679a87dbc006196e5db92e9afb0ea35f19c2770` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/OUTER_OUTER_SPECTRAL_THEOREM.md` | `02407eafa8fd5db4c5d8b5bbb2f62d5215f6ef5bf1cb5104fa53caddb52800e4` |
| `tests/test_outer_outer_spectral_theorem.py` | `23f212a876183f3c0bef0f4acdf7b20db23436451d72e8abc5a4cf59c782bb1f` |
| `notes/OUTER_OUTER_SPECTRAL_THEOREM_ERRATUM.md` | `fecb3647b1e632debd5d7ae3cff1cb5b8db0c29e858041e5037d5c496529f145` |
| `tests/test_outer_outer_spectral_theorem_erratum.py` | `59f71abdaca30440d3b2d177be0426ac9af4f5975beae2de3bcc335f6e4c5ca0` |
| `notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md` | `e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816` |
| `tests/test_common_radical_leakage_gram_orientation.py` | `d897e662d05665930d3b651d0460dd14f84f8e143ed010c9e248c948a5ace417` |
| `notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md` | `335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb` |
| `tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py` | `0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc` |
| `notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md` | `43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2` |
| `tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py` | `95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a` |

The checkpoint-1.75 pair fixes the exact individual carrier (0.4), its
forced odd sign, normal convergence, and both RH equivalences.  The radical
note supplies the origin-null BV Mellin continuation and the two zero
evaluations.  The outer--outer theorem supplies the compact-BV log-form core
passage; its additive erratum supplies the correct paired-slot orientation.
The common-radical pair fixes the orbitwise realification, the factor
`1/2` relating its positive Gram to the repository two-slot seminorm, and
the slot-exchange representation of the signed spectral pairing.
The gauge pair fixes the raw and corrected physical rows, the raw and
endpoint-sheared modal defects, and the fact that the gauge equality holds
only after zero evaluation.  The coherent-beta pair supplies the positive
absolute two-slot modal/projection estimate on the locked all-odd halfgrid.
Only that positive estimate is used from its remainder audit; no coherent
signed lower bound is used to infer an individual parity bound or a
continuous physical transfer.

No zero table, numerical ordinate, graph limit, or zero-reality premise is
added.

## 2. The positive two-slot sampling space

Write a nontrivial zero as

\[
 \rho={1\over2}+iw_\rho,                             \tag{2.1}
\]

without assuming `w_rho` is real.  For a log-profile `f`, let `Zf` denote
the two evaluations occurring in the Hermitian Weil polarization.  Grouping
the zero multiset into its functional-equation and conjugation orbits,
define the positive real Gram and the repository seminorm by

\[
 \begin{aligned}
 {\mathfrak A}(f,g)
 &:={1\over2}\operatorname {Re}\sum_\rho\left\{
       \widehat f(w_\rho)\overline{\widehat g(w_\rho)}
       +\widehat f(\overline {w_\rho})
          \overline{\widehat g(\overline {w_\rho})}\right\},\\
 \|Zf\|_{{\mathfrak Z},{\rm repo}}^2
 &:=\sum_\rho\left\{
       |\widehat f(w_\rho)|^2
       +|\widehat f(\overline {w_\rho})|^2\right\}
   =2{\mathfrak A}(f,f).
 \end{aligned}                                      \tag{2.2}
\]

On the orbitwise realification of this two-slot space, let `Sigma` be the
self-adjoint involution which exchanges the paired slots.  The signed form
is exactly

\[
 {\cal W}_Z(f,g)
 =:{\mathfrak S}(f,g)
 =\langle Zf,\Sigma Zg\rangle_{\mathbb R}.          \tag{2.3}
\]

Hence ordinary sequence-space Cauchy--Schwarz and `||Sigma||=1` give

\[
 |{\cal W}_Z(f,g)|
 \leq {\mathfrak A}(f,f)^{1/2}{\mathfrak A}(g,g)^{1/2}
 ={1\over2}\|Zf\|_{{\mathfrak Z},{\rm repo}}
             \|Zg\|_{{\mathfrak Z},{\rm repo}}.   \tag{2.4}
\]

This is not Cauchy--Schwarz in a positive Weil form.  It is a bound in the
separate positive real Gram (2.2).  The factor `1/2` is required because
the repository seminorm is twice that Gram.

Let `Jf(y)=f(-y)`.  Then

\[
 \widehat {Jf}(z)=\widehat f(-z).                   \tag{2.5}
\]

Functional-equation symmetry preserves the full zero multiset, so `J` is
unitary for the repository seminorm in (2.2).  Therefore

\[
 S_+={1+J\over2},\qquad S_-={1-J\over2}             \tag{2.6}
\]

are orthogonal contractions for the positive sampling seminorm.  The physical
complete symbol is inversion invariant, so the same projections reduce the
compact physical form.  No parity split of a noncompact physical finite
part has been made here.

## 3. Compact BV and the ordered Fejer limit

Put `a=log lambda`.  The zero extension of `w_lambda` is real, compactly
supported in `[-a,a]`, piecewise smooth, and of bounded variation.  In
particular, its circle Fourier coefficients obey

\[
 |c_n(w_\lambda)|\leq {K_{\lambda,1}\over1+|n|}.    \tag{3.1}
\]

The literal complete multiplier in the odd sector has logarithmic growth,
and the pole row is a bounded rank-one form on this fixed compact window.
Thus

\[
 \sum_{n\in\mathbb Z}
       \log(2+|n|)|c_n(w_\lambda)|^2<\infty.         \tag{3.2}
\]

Let `sigma_H` be the symmetric normalized Fejer mean on the circle and put

\[
 w_{\lambda,H}=\sigma_Hw_\lambda.                   \tag{3.3}
\]

Symmetry of the kernel preserves odd parity.  Fejer contraction of
variation, (3.1), and dominated convergence in (3.2) give

\[
 w_{\lambda,H}\longrightarrow w_\lambda
 \quad\text{in the logarithmic form norm}.          \tag{3.4}
\]

For `|Im z|<=1/2`, Stieltjes integration by parts gives, uniformly in `H`,

\[
 |\widehat w_{\lambda,H}(z)|
 +|\widehat w_\lambda(z)|
 \leq {K_{\lambda,2}\over1+|\operatorname {Re}z|}. \tag{3.5}
\]

The classical zero count implies

\[
 \sum_\rho(1+|\operatorname {Im}\rho|)^{-2}<\infty. \tag{3.6}
\]

At finite `H`, first apply the symmetric Abel explicit formula to the
compact-BV profile `w_(lambda,H)`, and only then remove the Abel parameter.
Equations (3.5)--(3.6) make its paired zero sum absolutely convergent.
The compact formula is

\[
 \langle w_{\lambda,H},Q_-w_{\lambda,H}\rangle
 ={\cal W}_Z(w_{\lambda,H},w_{\lambda,H}).           \tag{3.7}
\]

Now take `H` to infinity.  The left side converges by (3.4), while the
right side converges by (3.5)--(3.6).  Consequently

\[
 \boxed{
 q^{\rm phys}_{\lambda,-}
 ={\cal W}_Z(w_\lambda,w_\lambda).}                 \tag{3.8}
\]

This is the only physical explicit-form passage used in the proof.  It is
entirely on the compact side.

## 4. Corrected radical polarization

Let `psi` be the locked even smooth bump with zero integral,
`psi(0)=1`, and support in `[-1,1]`.  Put

\[
 \psi_\lambda(x)=\psi(2\lambda x),
 \qquad
 \widetilde b_\lambda=b_\lambda-A_\lambda\psi_\lambda,
 \qquad
 R_\lambda={\cal E}(\widetilde b_\lambda).          \tag{4.1}
\]

Then `tilde b_lambda` is even, compact BV, zero-integral, origin-null, and
`O(x^2)` at the origin.  The radical BV lemma therefore gives both zero
evaluations

\[
 ZR_\lambda=0.                                      \tag{4.2}
\]

The bump is invisible on the central multiplicative interval, so

\[
 C_\lambda R_\lambda=X_\lambda.                    \tag{4.3}
\]

Define the physical corrected exterior row by

\[
 O_{{\rm corr},{\rm phys}}
 =(1-C_\lambda)R_\lambda,
 \qquad
 R_\lambda=X_\lambda+O_{{\rm corr},{\rm phys}}.    \tag{4.4}
\]

The cutoff `C_lambda` commutes with inversion.  Applying `S_-` to
(4.2)--(4.4) gives, in both zero slots,

\[
 Z(S_-O_{{\rm corr},{\rm phys}})=-Zw_\lambda.       \tag{4.5}
\]

The two minus signs cancel under polarization.  Combining (3.8) and (4.5)
proves the exact compact-side radical identity

\[
 \boxed{
 q^{\rm phys}_{\lambda,-}
 ={\cal W}_Z(S_-O_{{\rm corr},{\rm phys}},
             S_-O_{{\rm corr},{\rm phys}}).}        \tag{4.6}
\]

Equation (4.6) is notation for the absolutely convergent spectral pairing
specified by (4.5); it is not the noncompact physical distribution in
(0.9).

## 5. Gauge equality only after `Z`

The physical row is

\[
 O_{{\rm corr},{\rm phys}}
 =O_{b,{\rm modal}}+O_{\rm bump}.                   \tag{5.1}
\]

The zero evaluations satisfy

\[
 ZO_{\rm bump}=-A_\lambda Z(J\beta_\lambda),
 \qquad
 \beta_\lambda(u)={{\bf1}_{\{u>\lambda\}}\over2\sqrt u}.  \tag{5.2}
\]

Thus, and only after applying `Z`,

\[
 ZO_{{\rm corr},{\rm phys}}
 =Z(O_{b,{\rm modal}}-A_\lambda J\beta_\lambda)
 =:ZO_{\rm spec}.                                   \tag{5.3}
\]

The rows themselves are different:

\[
 O_{{\rm corr},{\rm phys}}
 \ne O_{b,{\rm modal}}-A_\lambda J\beta_\lambda.  \tag{5.4}
\]

Using (5.3) only in the sampling space, (4.6) becomes

\[
 q^{\rm phys}_{\lambda,-}
 ={\cal W}_Z(S_-O_{\rm spec},S_-O_{\rm spec}).      \tag{5.5}
\]

No term on the right of (5.3) is substituted into a pole,
Archimedean, or prime distribution.

## 6. Carrier plus the absolute modal remainder

Define the two profiles

\[
 m_\lambda=S_-O_{b,{\rm modal}},
 \qquad
 v_\lambda=-A_\lambda S_-J\beta_\lambda.          \tag{6.1}
\]

The locked paired-slot calculation of checkpoint 1.75, with the
normalization (2.2)--(2.3), is exactly

\[
 {\cal W}_Z(v_\lambda,v_\lambda)
 ={\mathfrak b}_{\lambda,-}.                        \tag{6.2}
\]

Expanding (5.5), while keeping both cross orientations, gives

\[
 \begin{aligned}
 r_\lambda
 &: =q^{\rm phys}_{\lambda,-}
       -{\mathfrak b}_{\lambda,-}\\
 &= {\cal W}_Z(m_\lambda,m_\lambda)
   +{\cal W}_Z(m_\lambda,v_\lambda)
   +{\cal W}_Z(v_\lambda,m_\lambda).
 \end{aligned}                                      \tag{6.3}
\]

This is an exact spectral identity.  It does not assert that a physical
bump self or bump--modal cross equals a separated beta self or beta--modal
cross.

For `0<Re rho<1`, the beta slots are

\[
 B_\rho={\lambda^{-\rho}\over2\rho},
 \qquad
 B_\rho^\vee={\lambda^{-(1-\rho)}\over2(1-\rho)}.   \tag{6.4}
\]

Since `lambda>1`,

\[
 |B_\rho|\leq {1\over2|\rho|},
 \qquad
 |B_\rho^\vee|\leq {1\over2|1-\rho|}.             \tag{6.5}
\]

The full zero multiset is invariant under `rho -> 1-rho`, and
`A_lambda` is eventually bounded.  Equations (3.6) and (6.4)--(6.5) give
the unconditional positive bound

\[
 \sup_{\lambda\geq\lambda_0}
       \|Zv_\lambda\|_{{\mathfrak Z},{\rm repo}}<\infty. \tag{6.6}
\]

The absolute modal-sampling estimate underlying the frozen coherent-beta
remainder audit is positive before paired-slot contraction, but is frozen
only on (0.4a).  It is first available for the endpoint-null bridge and the
fixed-label shear vector.  With
`b_(lambda_p)=b_(lambda_p)^#+gamma_(lambda_p)m_1`, it gives

\[
 \begin{aligned}
 \|ZO_{{\rm modal}}(b_{\lambda_p}^\#)\|_{{\mathfrak Z},{\rm repo}}
 &\leq {\cal P}(\lambda_p,\log\lambda_p)
          D_{\rm mod}(b_{\lambda_p}^\#)^{1/2},\\
 \|ZO_{{\rm modal}}(\gamma_{\lambda_p}m_1)\|_{{\mathfrak Z},{\rm repo}}
 &\leq {\cal P}(\lambda_p,\log\lambda_p)
       |\gamma_{\lambda_p}|D_{\rm mod}(m_1)^{1/2}.
 \end{aligned}                                      \tag{6.7}
\]

The frozen gauge identities give
`D_mod(b_(lambda_p)^#)=Theta(d_2)` and
`gamma_(lambda_p)^2 D_mod(m_1)=O(d_2)`.  Triangle inequality, followed by
the parity contraction from Section 2, therefore proves the raw bound

\[
 \|Zm_{\lambda_p}\|_{{\mathfrak Z},{\rm repo}}
 \leq {\cal P}_1(\lambda_p,\log\lambda_p)\sqrt {d_2},
 \qquad
 D_{\rm mod}(b_{\lambda_p})
 =d_2\{1+O(\lambda_p^{-4})\}.                       \tag{6.8}
\]

Applying (2.4), (6.6), and (6.8) to (6.3) proves

\[
 |r_p|
 \leq {\cal P}_1^2d_2+C{\cal P}_1\sqrt {d_2}.       \tag{6.9}
\]

The fixed-label defect law in (0.6) now proves

\[
 r_p=o(\lambda_p^{-N})
 \quad\text{for every fixed }N>0.                  \tag{6.10}
\]

In particular (6.10) proves (0.5) on (0.4a).  Only positive sampling norms
were used to estimate (6.3); no sign or positivity of the Weil form was
assumed.  No all-real version of (6.7), and hence no continuous physical
transfer, is asserted.

## 7. Endpoint shear and compact projection audit

The endpoint-null representative in the frozen gauge theorem is

\[
 b_\lambda^\#=b_\lambda-\gamma_\lambda m_1,
 \qquad
 \gamma_\lambda=\Theta(\lambda^{-4}).               \tag{7.1}
\]

Its exact modal defect and origin change satisfy

\[
 D_{\rm mod}(b_\lambda^\#)=\Theta(d_2),
 \qquad
 A_\lambda-A_\lambda^\#
 =\gamma_\lambda m_1(0)=O(\sqrt {d_2d_6}).          \tag{7.2}
\]

Although the shear difference need not be smaller than `d_2` in the modal
metric, it remains on that same superexponential scale.  On (0.4a), applying
the positive triangle estimates (6.6)--(6.8) to the fixed-label vector
`gamma_(lambda_p)*m_1` and its origin beta row gives

\[
 q^{\rm phys}_{\lambda_p,-}(b_{\lambda_p})
 -q^{\rm phys}_{\lambda_p,-}(b_{\lambda_p}^\#)
 -\left\{{\mathfrak b}_{\lambda_p,-}(A_{\lambda_p})
       -{\mathfrak b}_{\lambda_p,-}(A_{\lambda_p}^\#)\right\}
 =o(\lambda_p^{-1}).                                \tag{7.3}
\]

Thus the raw and endpoint-null routes give the same transfer conclusion at
the declared schedule and scale.  Equation (7.3) is a triangle estimate,
not an invariance statement and not a separated physical bump identity.

The Fejer multiplier in Section 3 is a proof-core approximation, not a new
physical projection in the definition of `q^(phys)`.  If the frozen finite
log-Fourier projection is inserted as an intermediate approximation, its
positive absolute sampling remainder obeys the same polynomial times
`sqrt(d_2)` bound on (0.4a).  Since `S_-` is contractive for the repository
seminorm in (2.2), its
contribution is also paritywise `o(lambda_p^(-1))`.  No cancellation between
even and odd sectors is used.

## 8. Physical-self RH equivalence

Combining (0.4)--(0.5) gives, on (0.4a), the exact asymptotic formula

\[
 \boxed{
 q^{\rm phys}_{\lambda_p,-}
 ={A_{\lambda_p}^2C_\xi\over8\lambda_p}
  -{A_{\lambda_p}^2\over8}{\cal S}_{\lambda_p}
  +o(\lambda_p^{-1}).}                              \tag{8.1}
\]

The fixed-label expansion is

\[
 A_\lambda=2^{3/4}+O(\lambda^{-2}),                 \tag{8.2}
\]

so `A_lambda` is bounded above and away from zero eventually.  Hence, on
the complete all-odd halfgrid,

\[
 q^{\rm phys}_{\lambda_p,-}=O(\lambda_p^{-1})
 \quad\Longleftrightarrow\quad
 {\mathfrak b}_{\lambda_p,-}=O(\lambda_p^{-1}).     \tag{8.3}
\]

Checkpoint 1.75 proves that the carrier bound on every point of (0.4a), not
on a selected sparse subsequence, is equivalent to RH.  Thus

\[
 q^{\rm phys}_{\lambda_p,-}=O(\lambda_p^{-1})
 \quad\Longleftrightarrow\quad
 {\mathfrak b}_{\lambda_p,-}=O(\lambda_p^{-1})
 \quad\Longleftrightarrow\quad {\rm RH}.            \tag{8.4}
\]

This proves (0.8).  Prime-only sampling and arbitrary sparse subsequences
are not asserted.  Checkpoint 1.75 also proves the continuous carrier-only
equivalence (0.7).  Because (6.7) is not frozen on all real `lambda`, the
continuous physical-self analogue remains open.

## 9. The literal outer finite part is still open

Define the gauge-null row

\[
 G_\lambda=O_{\rm bump}+A_\lambda J\beta_\lambda,
 \qquad ZG_\lambda=0.                               \tag{9.1}
\]

The spectral form descends through this null row.  The existing physical
pole--Archimedean--prime distribution is not proved to do so on the
noncompact outer domain.  A literal proof of (0.9) would require the common
ordered cancellation represented schematically by

\[
 \operatorname {FP}^{\rm ord}
 \left\{
 2W(S_-O_{\rm spec},S_-G_\lambda)
   +W(S_-G_\lambda,S_-G_\lambda)\right\}=0,          \tag{9.2}
\]

formed before splitting pole, Archimedean, and prime distributions.  The
display is only the missing quotient/closability condition: the separated
terms need not exist.  In particular,

\[
 \widehat\beta_\lambda(i/2)
 ={1\over2}\int_\lambda^\infty{du\over u}=+\infty. \tag{9.3}
\]

Therefore (5.3) cannot be used as a physical-row equality, and (9.2) is not
proved here.  The compact-side identity (4.6) bypasses this domain issue; it
does not solve it.

## 10. Later gates remain

The physical norm has a nonzero limit,

\[
 \|w_\lambda\|^2\longrightarrow\|W_\infty\|^2>0.   \tag{10.1}
\]

Thus (0.10) shows that even under RH, an `O(lambda^(-1))` upper bound for
`E_lambda` still requires the live-shift control

\[
 \mu\geq-O(\lambda^{-1})                            \tag{10.2}
\]

in the relevant sign convention.  Moreover, comparison with the exact
pole-cancellation threshold still requires

\[
 \kappa\log^2\lambda\gtrsim1.                      \tag{10.3}
\]

Neither (10.2) nor (10.3) follows from (8.1).  Accordingly this theorem
proves no bound for `E_lambda`, no transverse reserve, no overlap estimate,
no Pair-C closure, and no determinant convergence.

## 11. Final stopping line

The new result is precisely

\[
 \boxed{
 \text{compact physical odd self on the complete all-odd halfgrid}
 =\text{odd beta carrier}
  +o(\lambda_p^{-1})}                               \tag{11.1}
\]

through the compact BV explicit formula and absolutely convergent spectral
radical polarization.  It licenses the physical RH equivalence (0.8), while
(0.7) remains carrier-only.  It proves neither an unconditional estimate
nor a continuous physical transfer.  It does not identify the literal
noncompact ordered physical finite part, does not remove the live shift or
`kappa` reserve, and makes no RH claim.

## 12. Reproduction

Run

    python3 -B -m unittest \
      tests.test_actual_mixed_bridge_compact_side_odd_carrier_transfer_theorem -v

from `research-checkpoints/xi-prolate-bridge` with `PYTHONPATH=src` and
`PYTHONDONTWRITEBYTECODE=1`.
