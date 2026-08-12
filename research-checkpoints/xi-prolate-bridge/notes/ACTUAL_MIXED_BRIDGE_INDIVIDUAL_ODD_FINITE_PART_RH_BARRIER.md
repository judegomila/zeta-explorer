# Actual mixed-bridge individual odd finite-part RH barrier

## 0. Outcome and exact claim boundary

Use the locked positive-at-origin prolate convention.  For every real
`lambda>1`, put

\[
 b_\lambda=h_{2,\lambda}-{I_2\over I_0}h_{0,\lambda},
 \qquad A_\lambda=b_\lambda(0),
 \qquad K_\lambda=C_\lambda{\cal E}b_\lambda,       \tag{0.1}
\]

and let

\[
 u_\lambda=S_+K_\lambda,
 \qquad w_\lambda=S_-K_\lambda                    \tag{0.2}
\]

be its inversion-even companion and the actual raw odd bridge.  Let `rho`
run over the full nontrivial-zero multiset, with algebraic multiplicity,
and define

\[
 C_\xi=\sum_\rho{1\over\rho(1-\rho)},
 \qquad
 {\cal S}_\lambda=\sum_\rho{\lambda^{-2\rho}\over\rho^2}.  \tag{0.3}
\]

The fixed-label expansion gives

\[
 A_\lambda=2^{3/4}+O(\lambda^{-2}).                \tag{0.4}
\]

This note proves an exact split of the two paired-slot **beta-carrier
sums**, denoted by `mathfrak b_(lambda,+/-)`:

\[
 \boxed{
 {\mathfrak b}_{\lambda,+}
 ={A_\lambda^2C_\xi\over8\lambda}
  +{A_\lambda^2\over8}{\cal S}_\lambda,
 \qquad
 {\mathfrak b}_{\lambda,-}
 ={A_\lambda^2C_\xi\over8\lambda}
  -{A_\lambda^2\over8}{\cal S}_\lambda.}          \tag{0.5}
\]

Consequently

\[
 \boxed{
 {\mathfrak b}_{\lambda,+}+{\mathfrak b}_{\lambda,-}
 ={A_\lambda^2C_\xi\over4\lambda},
 \qquad
 {\mathfrak b}_{\lambda,+}-{\mathfrak b}_{\lambda,-}
 ={A_\lambda^2\over4}{\cal S}_\lambda.}           \tag{0.6}
\]

Thus `S_lambda` cancels in the coherent two-parity carrier and survives in
the individual carrier.  On the full continuous family of real parameters
`lambda>=lambda_0>1`, the surviving term has the precise equivalence

\[
 \boxed{
 \sup_{\lambda\geq\lambda_0}
       \lambda|{\cal S}_\lambda|<\infty
 \quad\Longleftrightarrow\quad
 \operatorname {Re}\rho={1\over2}
 \text{ for every nontrivial zero }\rho.}           \tag{0.7}
\]

The locked natural halfgrid is

\[
 \lambda_p={p\over2},\qquad
 a_p=\log\lambda_p,
 \qquad p\text{ every sufficiently large odd positive integer}. \tag{0.7a}
\]

The continuous statement can be sharpened without selecting a subsequence:

\[
 \boxed{
 \sup_{\substack{p\geq p_0\\p\ {\rm odd}}}
       \lambda_p|{\cal S}_{\lambda_p}|<\infty
 \quad\Longleftrightarrow\quad
 \sup_{\lambda\geq\lambda_0}
       \lambda|{\cal S}_\lambda|<\infty
 \quad\Longleftrightarrow\quad\mathrm {RH}.}         \tag{0.7b}
\]

Since (0.4) is bounded away from zero eventually, the carrier-level
statement is equivalently

\[
 \boxed{
 {\mathfrak b}_{\lambda,-}=O(\lambda^{-1})
 \text{ on the continuous family}
 \quad\Longleftrightarrow\quad
 {\mathfrak b}_{\lambda_p,-}=O(\lambda_p^{-1})
 \text{ for every sufficiently large odd }p
 \quad\Longleftrightarrow\quad\mathrm {RH}.}         \tag{0.8}
\]

Equation (0.8) is an equivalence, not a proof that its left side holds.
Here `p` is not a prime variable: every sufficiently large odd positive
integer is used.  Prime-only sampling is neither needed nor asserted.
No converse from an arbitrary sparse subsequence is asserted.

The theorem stops at the carrier level.  Write the physical odd self and
shifted energy as

\[
 q^{\rm phys}_{\lambda,-}
 =\langle w_\lambda,Q_-w_\lambda\rangle,
 \qquad
 E_\lambda
 =\langle w_\lambda,(Q_--\mu)w_\lambda\rangle.     \tag{0.9}
\]

The frozen inputs do **not** prove the missing paritywise physical
identification

\[
 \boxed{
 \text{missing:}\qquad
 q^{\rm phys}_{\lambda,-}-{\mathfrak b}_{\lambda,-}
 =o(\lambda^{-1}).}                                  \tag{0.10}
\]

In particular, this note does not turn (0.8) into an RH-equivalent estimate
for the physical self.  What is always exact is only

\[
 \boxed{
 E_\lambda=q^{\rm phys}_{\lambda,-}
             -\mu\|w_\lambda\|^2.}                 \tag{0.11}
\]

No estimate in (0.7), no individual physical odd `O(lambda^(-1))` bound,
no bridge overlap, no new zero statement, and no Riemann-hypothesis
conclusion is proved.  The formal state remains `P0_INVALIDATED`; the
standard eight are untouched.

## 1. Frozen inputs

No zero table or external numerical constant is imported.  The minimal
direct FROZEN inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/ACTUAL_MIXED_BRIDGE_POLE_ROW_RESOLVENT_CANCELLATION_REDUCTION.md` | `610aa2b58734ab191e561bbaa7529f0558e1f979fa67461273e69f6d6253cde2` |
| `tests/test_actual_mixed_bridge_pole_row_resolvent_cancellation_reduction.py` | `678e6da6c989c536ba6131fdfd38fe5927c60d464b29e8d358d94af0a9c0f2a4` |
| `notes/MIXED_BRIDGE_XI_OVER_S_BOUNDARY_OBSTRUCTION_THEOREM.md` | `4c4bb0344735a0d605e1052ac06b383144f2cdbb85d2c088bf0b6683e67f06a2` |
| `tests/test_mixed_bridge_xi_over_s_boundary_obstruction_theorem.py` | `1bc81194a9fa2fd4eac92491a08c60bc58f3640ac16e4e5e17864da8a2970c67` |
| `notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md` | `43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2` |
| `tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py` | `95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a` |
| `notes/ACTUAL_MIXED_BRIDGE_TRANSVERSE_GAP_ENERGY_BARRIER.md` | `d9fea23ec9427a2bfcf8f22ec6465cafbdd5623f4adc311e83114fd8b8591677` |
| `tests/test_actual_mixed_bridge_transverse_gap_energy_barrier.py` | `822711c839de663d5152ea61cc438a194780d80444f02cbac07b365947a608f1` |
| `notes/UNCONDITIONAL_NATURAL_HALFGRID_CROSSROOT_SCHEDULE_THEOREM.md` | `d1b73fc246fcc70886ba78dc074adac585372a2abfc9fbba678c03c4d47e30a5` |
| `tests/test_unconditional_natural_halfgrid_crossroot_schedule_theorem.py` | `00627aa69143c39a468dd06808fe6859beb16aff197127e66a93ff042377f1b9` |

The pole-row pair fixes the raw label-zero/label-two bridge, (0.4), the
actual pole row, and its mass.  The Xi-over-s pair supplies the raw
zero-integral radical, the two beta carriers, and the explicit warning
that the common finite-part physical identity is missing.  The
coherent-beta pair fixes the paired-slot sign and the concatenated
two-parity diagonal.  The transverse-energy pair fixes `E_lambda`,
`kappa`, and the sharp constant four.  The natural-halfgrid pair fixes the
all-odd schedule (0.7a) and its exact logarithmic mesh.  None of those
inputs proves (0.10).

## 2. Exact algebraic parity split

The fixed-label bridge tends to the locked Hermite profile

\[
 b_\infty(x)=2^{3/4}(1-2\pi x^2)e^{-\pi x^2},
 \qquad
 B_\infty(s)=\int_0^\infty b_\infty(x)x^{s-1}\,dx
 =2^{-1/4}(1-s)\pi^{-s/2}\Gamma(s/2).              \tag{2.0}
\]

Its exact Mellin sampling factor is

\[
 \boxed{
 \zeta(s)B_\infty(s)=-2^{3/4}{\xi(s)\over s}.}     \tag{2.0a}
\]

The `1/s` factor is the source-origin pole, while `xi(s)` supplies the
nontrivial-zero radical.  This Xi-over-s identity fixes the carrier rows
below; by itself it does not supply the missing physical finite part.

For `lambda>1` and `0<Re(rho)<1`, put

\[
 B_\rho={\lambda^{-\rho}\over2\rho},
 \qquad
 B_\rho^\vee={\lambda^{-(1-\rho)}\over2(1-\rho)}.   \tag{2.1}
\]

The classical zero-counting bound gives

\[
 \sum_\rho{1\over|\rho|^2}<\infty.                 \tag{2.2}
\]

Every quadratic series below is therefore absolutely convergent.  The
functional equation preserves algebraic multiplicity under
`rho -> 1-rho`, so reindexing gives

\[
 \sum_\rho(B_\rho^\vee)^2
 =\sum_\rho B_\rho^2
 ={1\over4}{\cal S}_\lambda,                        \tag{2.3}
\]

while

\[
 \sum_\rho B_\rho B_\rho^\vee
 ={1\over4\lambda}
       \sum_\rho{1\over\rho(1-\rho)}
 ={C_\xi\over4\lambda}.                            \tag{2.4}
\]

Conjugation preserves the same multiset and multiplicities, so
`S_lambda` is real.  No zero-reality assumption is used in (2.3)--(2.4).

The inversion-even and inversion-odd beta rows are

\[
 F_+(w_\rho)=-{A_\lambda\over2}
                    (B_\rho+B_\rho^\vee),
 \qquad
 F_-(w_\rho)={A_\lambda\over2}
                    (B_\rho-B_\rho^\vee).          \tag{2.5}
\]

The locked paired-slot convention is

\[
 F(w_\rho)\overline {F(\overline w_\rho)}
 =F(w_\rho)F(-w_\rho).                              \tag{2.6}
\]

Even reflection gives `F_+(-w)=F_+(w)`, whereas odd reflection gives
`F_-(-w)=-F_-(w)`.  Hence define the exact carrier sums by

\[
 {\mathfrak b}_{\lambda,+}
 ={A_\lambda^2\over4}
       \sum_\rho(B_\rho+B_\rho^\vee)^2,
 \qquad
 {\mathfrak b}_{\lambda,-}
 =-{A_\lambda^2\over4}
       \sum_\rho(B_\rho-B_\rho^\vee)^2.            \tag{2.7}
\]

The minus sign in the odd sum is forced by paired-slot reflection; it is
not an inserted sector convention.  Expanding (2.7) gives

\[
 \begin{aligned}
 {\mathfrak b}_{\lambda,+}
 &= {A_\lambda^2\over4}
    \left\{\sum_\rho B_\rho^2
      +2\sum_\rho B_\rho B_\rho^\vee
      +\sum_\rho(B_\rho^\vee)^2\right\},\\
 {\mathfrak b}_{\lambda,-}
 &= -{A_\lambda^2\over4}
    \left\{\sum_\rho B_\rho^2
      -2\sum_\rho B_\rho B_\rho^\vee
      +\sum_\rho(B_\rho^\vee)^2\right\}.
 \end{aligned}                                      \tag{2.8}
\]

Equations (2.3)--(2.4) prove (0.5), and therefore

\[
 F_+(w_\rho)^2-F_-(w_\rho)^2
 ={A_\lambda^2\over4\lambda\rho(1-\rho)},
 \qquad
 \sum_\rho\{F_+(w_\rho)^2-F_-(w_\rho)^2\}
 ={A_\lambda^2C_\xi\over4\lambda}.                \tag{2.9}
\]

This last sum is the frozen coherent beta diagonal.  The difference in
(0.6) is the same-tail (compact/compact plus inverted/inverted) carrier
that the coherent diagonal cancels.  These are spectral carrier identities,
not physical paritywise quadratic-form identities.

## 3. Why the physical transfer remains open

For a time-limited zero-integral source `f`, the exact Poisson identity is

\[
 (1-C_\lambda){\cal E}(f)
 =J\left[T_\lambda(1-P_\lambda^a)\widehat f_a
              -f(0)\beta_\lambda\right],
 \qquad
 \beta_\lambda(u)={{\bf1}_{u>\lambda}\over2\sqrt u}. \tag{3.1}
\]

An invisible-origin correction exchanges the displayed beta row for the
locked bump row.  It preserves the compact vector and the complete
nontrivial-zero spectral quadratic form.  That gauge invariance does not
separately identify the raw pole, Archimedean, prime, beta-self, and cross
terms.

The available ordered finite-Fejer/Abel theorem keeps both parities
concatenated until the physical coherent identity is obtained.  Its
absolute remainder bounds therefore do not imply a bound for either
individual physical parity.  In particular, there is no valid inference
from the coherent `q_(bb)` estimate to (0.10).

The physical corrected exterior row and its zero-evaluation relation are

\[
 \begin{aligned}
 O_{{\rm corr},{\rm phys}}
 &=O_{b,{\rm modal}}+O_{\rm bump},\\
 ZO_{\rm bump}
 &=-A_\lambda Z(J\beta_\lambda),\\
 ZO_{{\rm corr},{\rm phys}}
 &=Z(O_{b,{\rm modal}}-A_\lambda J\beta_\lambda)
 =:ZO_{\rm spec}.
 \end{aligned}                                      \tag{3.2}
\]

The first line of (3.2) is the physical row identity.  The last two lines
hold only after applying the nontrivial-zero evaluation map `Z`.
Accordingly, `O_(b,modal)-A_lambda*J*beta_lambda` is a spectral
representative `O_spec`; it is not the physical corrected row and cannot
be substituted inside a physical distributional finite part.

The required new theorem would have to construct, in this order, the
paritywise common finite part

\[
 \operatorname {FP}^{\rm ord}_{s=0}
 \{W_{0,2}-W_{\mathbb R}-W_p\}
       (S_-O_{{\rm corr},{\rm phys}})^2
 =q^{\rm phys}_{\lambda,-}
 ={\mathfrak b}_{\lambda,-}+o(\lambda^{-1}).        \tag{3.3}
\]

Equation (3.3) is the precise missing identity, not an assertion made by
this note.  It must be formed before splitting the pole--Archimedean--prime
distributions and before separating beta self and cross terms.  The frozen
Xi-over-s theorem expressly does not supply that Plemelj/closability step.
The equality of the two `Z`-images in (3.2) is not a substitute for it.
There is no graph-limit or zero-reality premise in the frozen inputs that
closes it.  Therefore the draft inference that the coherent diagonal
bounds each parity is rejected.

## 4. Continuous-parameter Landau--Laplace equivalence

Write

\[
 a=\log\lambda,
 \qquad
 G(a)=e^a{\cal S}_{e^a}
 =\sum_\rho{e^{(1-2\rho)a}\over\rho^2}.             \tag{4.1}
\]

If RH holds, every exponential in (4.1) has modulus one, and (2.2) gives

\[
 |G(a)|\leq\sum_\rho|\rho|^{-2}                    \tag{4.2}
\]

for every `a>0`.

Conversely, suppose `G` is bounded on `[a_0,infinity)` for one `a_0>0`.
Its Laplace transform

\[
 {\cal L}(\sigma)
 =\int_{a_0}^\infty G(a)e^{-\sigma a}\,da           \tag{4.3}
\]

is holomorphic for `Re(sigma)>0`.  For `Re(sigma)>1`, absolute convergence
permits termwise integration and gives

\[
 {\cal L}(\sigma)
 =\sum_\rho
 {e^{-(\sigma-1+2\rho)a_0}
  \over\rho^2(\sigma-1+2\rho)}.                    \tag{4.4}
\]

Away from its displayed poles, the right side converges normally because
its large-zero terms are `O(|rho|^(-3))`; it is the meromorphic
continuation of (4.3) into `Re(sigma)>0`.

If a zero `rho_0` has `Re(rho_0)<1/2`, then

\[
 \sigma_0=1-2\rho_0,
 \qquad\operatorname {Re}\sigma_0>0,                \tag{4.5}
\]

and (4.4) has residue

\[
 \operatorname {Res}_{\sigma=\sigma_0}{\cal L}(\sigma)
 ={m(\rho_0)\over\rho_0^2}\ne0,                    \tag{4.6}
\]

where `m(rho_0)` is its algebraic multiplicity.  The map
`rho -> 1-2rho` is injective: no distinct zero contributes at the same
pole, while repeated occurrences add the identical nonzero coefficient.
This contradicts holomorphy of (4.3).  Functional-equation symmetry sends
each zero with real part greater than one half to a zero of the same
multiplicity with real part less than one half.  Thus boundedness forces
all zeros onto the line and proves (0.7).

It remains to justify the stronger all-odd halfgrid statement.  For
`0<h<=1`, the elementary exponential-increment bound, followed by splitting
the zero multiset at height `h^(-1)`, gives

\[
 \begin{aligned}
 |G(a+h)-G(a)|
 &\leq C e^a\left\{
 h\sum_{|\rho|\leq h^{-1}}{1\over|\rho|}
 +\sum_{|\rho|>h^{-1}}{1\over|\rho|^2}\right\}\\
 &\leq C'e^a h\log^2(2/h).
 \end{aligned}                                      \tag{4.7}
\]

Indeed, zero counting `N(T)=O(T log(2T))` and partial summation make the
first brace term `O(h log^2(2/h))` and the second
`O(h log(2/h))`.  Algebraic multiplicities are already included in `N`.
For consecutive odd integers, the exact logarithmic mesh is

\[
 0<a_{p+2}-a_p
 =\log\left(1+{2\over p}\right)
 \leq{2\over p}=e^{-a_p}.                            \tag{4.8}
\]

Given any sufficiently large `a`, choose the preceding odd-halfgrid point
`a_p` and put `h=a-a_p`.  On `0<h<=e^(-a_p)`, the function
`h log^2(2/h)` is increasing eventually.  Thus (4.7)--(4.8) show that
bounded halfgrid samples imply

\[
 |G(a)|\leq
 \sup_{\substack{p\geq p_0\\p\ {\rm odd}}}|G(a_p)|
 +C''(1+a)^2.                                       \tag{4.9}
\]

Polynomial growth still makes the Laplace transform (4.3) holomorphic in
`Re(sigma)>0`; the same noncancelling pole (4.6) therefore forces RH.
Conversely RH gives the continuous bound (4.2), hence the sampled bound.
This proves (0.7b).

The discrete converse uses all sufficiently large odd-halfgrid points,
whose mesh is (4.8), not an arbitrary selected subsequence.  Equations
(0.4)--(0.5) then prove only the carrier-level equivalence (0.8).

## 5. Physical energy, literal symbol, and the two later gates

The complete odd operator and actual pole coordinate are

\[
 Q_-=H_--2|p_\lambda\rangle\langle p_\lambda|,
 \qquad
 \beta_{{\rm pole},\lambda}
 =\langle p_\lambda,w_\lambda\rangle.               \tag{5.1}
\]

Consequently the physical identities are

\[
 q^{\rm phys}_{\lambda,-}
 =\langle w_\lambda,H_-w_\lambda\rangle
    -2\beta_{{\rm pole},\lambda}^2,
 \qquad
 E_\lambda=q^{\rm phys}_{\lambda,-}
             -\mu\|w_\lambda\|^2.                 \tag{5.2}
\]

The fixed bridge has nonvanishing limiting norm:

\[
 \|w_\lambda\|^2\longrightarrow\|W_\infty\|^2>0. \tag{5.3}
\]

Retaining the negative prime sign, the complete source multiplier is

\[
 m_\lambda(t)
 =\operatorname {Re}\psi\!\left({1\over4}+{it\over2}\right)
  -\log\pi
  -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).              \tag{5.4}
\]

The upper arithmetic index in (5.4) is inclusive.  On the actual odd
physical domain, (5.2) is equivalently the literal complete-symbol identity

\[
 \boxed{
 E_\lambda
 =\int_{\mathbb R}m_\lambda(t)|\widehat w_\lambda(t)|^2
                  {dt\over2\pi}
  -2\beta_{{\rm pole},\lambda}^2
  -\mu\|w_\lambda\|^2.}                             \tag{5.5}
\]

Equation (5.5) is exact, but the missing ordered finite-part theorem (3.3)
is needed before its first two terms can be replaced by the odd carrier in
(0.5).  Thus `S_lambda`, the physical finite part, and the live shift must
not be conflated.

Even if a future theorem proved
`q^(phys)_(lambda,-)=O(lambda^(-1))`, (5.2)--(5.3) would still require the
lower shift control

\[
 \mu\geq-O(\lambda^{-1})                            \tag{5.6}
\]

to deduce the corresponding upper bound for `E_lambda`.  No such physical
self estimate or shift estimate is proved here.

The actual pole row and mass obey

\[
 \beta_{{\rm pole},\lambda}
 =2^{-5/4}\log\lambda+O(1),
 \qquad
 M_\lambda=\|p_\lambda\|^2
 ={\lambda-\lambda^{-1}\over2}-\log\lambda.         \tag{5.7}
\]

Hence the exact cancellation threshold has scale

\[
 {4\kappa\beta_{{\rm pole},\lambda}^2\over M_\lambda}
 =\sqrt2\,\kappa{\log^2\lambda\over\lambda}
       \{1+o(1)\}.                                   \tag{5.8}
\]

For fixed `0<delta<4`, even an independently proved estimate
`E_lambda=O(lambda^(-1))` would not by itself imply

\[
 E_\lambda
 <{(4-\delta)\kappa\beta_{{\rm pole},\lambda}^2
       \over M_\lambda}.                            \tag{5.9}
\]

It also needs a quantitative transverse reserve at least on the scale

\[
 \kappa\log^2\lambda\gtrsim1                       \tag{5.10}
\]

with the constant margin required by `delta`.  The frozen inputs supply
neither that reserve nor the earlier physical finite-part and shift gates.

## 6. Final stopping line

The new exact information is only the carrier decomposition

\[
 \boxed{
 \text{coherent beta carrier}
 \quad\oplus\quad
 {\cal S}_\lambda\text{ same-tail carrier}.}        \tag{6.1}
\]

The first component is `A_lambda^2*C_xi/(4*lambda)`.  The second has the
continuous-parameter RH equivalence (0.7).  Neither component has yet been
identified with the individual physical odd self.  After that missing
ordered identity, the shifted energy would still retain
`-mu*||w_lambda||^2`; comparison with the sharp cancellation threshold
would still retain `kappa`.

Therefore the frozen results license none of the arrows

\[
 \begin{gathered}
 {\mathfrak b}_{\lambda,+}+{\mathfrak b}_{\lambda,-}
       =O(\lambda^{-1})
 \quad\not\Longrightarrow\quad
 q^{\rm phys}_{\lambda,-}=O(\lambda^{-1}),\\
 q^{\rm phys}_{\lambda,-}=O(\lambda^{-1})
 \quad\not\Longrightarrow\quad E_\lambda=O(\lambda^{-1}),\\
 E_\lambda=O(\lambda^{-1})
 \quad\not\Longrightarrow\quad
 E_\lambda<{(4-\delta)\kappa\beta_{{\rm pole},\lambda}^2
                   \over M_\lambda}.
 \end{gathered}                                      \tag{6.2}
\]

The carrier split and its Landau--Laplace obstruction are exact.  The
individual physical finite-part identity is not.  The audit fails closed
and makes no RH claim.
