# Anchor-complement parity pullback and two-direction Schur reduction

## 0. Claim boundary and outcome

This note gives an exact finite coupling between the latest even and odd
sign targets on one common parameter pair.

- The multiplier-dangerous even coframe satisfies
  `beta_lambda^mv>0` exactly when the shifted even compression on the
  projected-anchor complement is positive.
- The odd exterior coframe satisfies `vartheta_->0` exactly when the full
  shifted odd block is positive.
- Restricting the source mode derivative to the projected-anchor complement
  gives an invertible map between those two spaces.  Under its congruence,
  the odd block is an explicit Hermitian anticommutator core minus only two
  shorted directions.
- Adjoining the negative pole direction to the odd complete-symbol
  projector gives an odd radical coframe of dimension `exp(O(lambda))+1`.
  The even and odd rotated projectors do not preserve the clean parity Schur
  displacement: their exact defect is a projector--derivative leakage
  operator.  A boundary-rank commutator controls it only conditionally on a
  new quantitative spectral buffer.

Consequently the simultaneous finite signs are equivalent to positivity of
the even complement, positivity of one explicit pulled core, and positivity
of a `2 by 2` Schur reserve.  This is an exact reduction, not a proof of any
of those three signs on an unbounded schedule.

The construction uses the complete source-pinned matrix throughout.  The
odd pole remains negative, the prime block retains the minus sign in source
equation (3.19), and the prime-power inventory remains inclusive through
`n<=lambda^2`.  No pole, archimedean, or prime block is bounded separately.
No zero table, zero reality, global Weil positivity, compact interpolation,
or finite numerical extrapolation is used.

This note proves neither the quantitative even coframe floor, the two
shifted sector signs on an unbounded schedule, equation (5.2) of
`DIRECT_RH_ATTACK.md`, nor locally uniform determinant convergence.  The
formal project state remains `P0_INVALIDATED`.

## 1. Common shifted setup

Fix one locked pair `(lambda,N)` and let `H_+` and `H_-` be the finite
inversion sectors.  Use the normalized parity basis

\[
 e_0^+=V_0,
 \qquad e_n^+={V_n+V_{-n}\over\sqrt2},
 \qquad e_n^-={V_n-V_{-n}\over\sqrt2}.             \tag{1.1}
\]

Let

\[
 \mathcal D e_0^+=0,
 \qquad \mathcal D e_n^+=n e_n^-                  \tag{1.2}
\]

and retain the exact source displacement

\[
 \boxed{
 \mathcal DQ_+-Q_-\mathcal D
 =|\boldsymbol b\rangle\langle\eta|.}             \tag{1.3}
\]

Here `eta=sum_(|n|<=N)V_n` is inversion even and
`boldsymbol b=sum_(|n|<=N)b_nV_n` is inversion odd.  Equation (1.3) is the
plus-to-minus block of the source rank-two commutator; the scalar shift
cancels from it.

Let `kappa in H_+` be the real unit projected source anchor and put

\[
 \mathcal K=H_+\cap\kappa^\perp,
 \qquad
 \mathcal B_+=Q_+-UI,
 \qquad
 \mathcal B_-=Q_--UI.                              \tag{1.4}
\]

Relative to `H_+=C*kappa direct-sum mathcal K`, write

\[
 \mathcal B_+
 =\begin{bmatrix}\alpha&c^*\\c&A\end{bmatrix},
 \qquad
 A=P_{\mathcal K}\mathcal B_+|_{\mathcal K},
 \qquad
 c=P_{\mathcal K}Q_+\kappa.                       \tag{1.5}
\]

The cross vector `c` is independent of `U`; it is the complete signed
projected residual column.  Theorem 5.1 of
`notes/LOCKED_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md` gives

\[
 \boxed{\beta_\lambda^{\rm mv}>0\quad\Longleftrightarrow\quad A\succ0.}
                                                               \tag{1.6}
\]

Theorem 4.1 of `notes/ODD_RADICAL_PARITY_SCHUR_REDUCTION.md` gives

\[
 \boxed{\vartheta_->0\quad\Longleftrightarrow\quad
        \mathcal B_-\succ0.}                         \tag{1.7}
\]

Put

\[
 \kappa_0=\langle e_0^+,\kappa\rangle
 ={X(\kappa)\over\sqrt L}.                          \tag{1.8}
\]

The projected-anchor limit in
`notes/CRITICAL_HEIGHT_ANCHOR_TRANSFER_THEOREM.md` makes `kappa_0` nonzero
for every sufficiently large locked parameter.  No transfer to the actual
Weil ground is used here.

### Lemma 1.1 (anchor-complement derivative isomorphism)

If `kappa_0!=0`, then

\[
 T:=\mathcal D|_{\mathcal K}:\mathcal K\longrightarrow H_- \tag{1.9}
\]

is an isomorphism.  With

\[
 G=T^*T,                                                \tag{1.10}
\]

one has the explicit metric bounds

\[
 \boxed{|\kappa_0|^2I_{\mathcal K}\preceq G
        \preceq N^2I_{\mathcal K}.}                  \tag{1.11}
\]

**Proof.**  The kernel of `mathcal D` is `C*e_0^+`.  Since
`kappa_0!=0`, this line has zero intersection with `mathcal K`.  The domain
and codomain in (1.9) both have dimension `N`, so `T` is invertible.

For `y=y_0e_0^++y_perp in mathcal K`, orthogonality to `kappa` gives

\[
 |y_0|\,|\kappa_0|
 \leq\sqrt{1-|\kappa_0|^2}\,\|y_\perp\|.
\]

Hence `||y_perp||>=|kappa_0|*||y||`.  On the nonzero modes,
`I<=mathcal D^*mathcal D<=N^2I`, so

\[
 |\kappa_0|\|y\|\leq\|Ty\|\leq N\|y\|,
\]

which proves (1.11).  \(\square\)

## 2. Exact all-shift anchor displacement

Define the source and anchor directions

\[
 d=\mathcal D\kappa\in H_-,
 \qquad
 \eta_{\mathcal K}=P_{\mathcal K}\eta\in\mathcal K. \tag{2.1}
\]

### Theorem 2.1 (rank-two anchor-complement displacement)

For every `sigma>=0`,

\[
 \boxed{
 T(A+\sigma I)-(\mathcal B_-+\sigma I)T
 =|\boldsymbol b\rangle\langle\eta_{\mathcal K}|
  -|d\rangle\langle c|.}                            \tag{2.2}
\]

Thus the source boundary direction and the complete projected residual are
the only two displacement columns introduced by passing from the full even
space to the anchor complement.

**Proof.**  If `y in mathcal K`, the block form (1.5) gives

\[
 \mathcal B_+y=\kappa\langle c,y\rangle+Ay.          \tag{2.3}
\]

Apply `mathcal D` to (2.3), and apply the shifted form of (1.3) to `y`.
Since `<eta,y>=<eta_mathcalK,y>`, the result is (2.2) at `sigma=0`.
Adding `sigma*T` to both products proves every shifted identity at once.
\(\square\)

The sign in front of `|d><c|` in (2.2) is negative.  Reversing it would
break the exact source commutator.  The vector `c` contains the combined
pole--archimedean--minus-prime residual; no triangle inequality has been
inserted.

## 3. Hermitian pullback and the two-direction reserve

Put

\[
 u=T^*\boldsymbol b,
 \qquad
 v=T^*d.                                               \tag{3.1}
\]

The odd pullback is

\[
 H_\sigma=T^*(\mathcal B_-+\sigma I)T.              \tag{3.2}
\]

Multiplying (2.2) by `T^*` gives

\[
 H_\sigma
 =G(A+\sigma I)-|u\rangle\langle\eta_{\mathcal K}|
                    +|v\rangle\langle c|.            \tag{3.3}
\]

Although the right side of (3.3) is not manifestly Hermitian, its equality
to (3.2) proves that it is Hermitian.  Averaging it with its adjoint gives

\[
\begin{aligned}
 H_\sigma={}&{G(A+\sigma I)+(A+\sigma I)G\over2}\\
 &-{|u\rangle\langle\eta_{\mathcal K}|
       +|\eta_{\mathcal K}\rangle\langle u|\over2}
 +{|v\rangle\langle c|+|c\rangle\langle v|\over2}.
                                                               \tag{3.4}
\end{aligned}
\]

Define the Hermitian core

\[
\begin{aligned}
 \mathcal P_\sigma={}&
 {G(A+\sigma I)+(A+\sigma I)G\over2}\\
 &+{1\over4}|u-\eta_{\mathcal K}\rangle
                 \langle u-\eta_{\mathcal K}|
  +{1\over4}|v+c\rangle\langle v+c|,               \tag{3.5}
\end{aligned}
\]

and the two-column map

\[
 W=\begin{bmatrix}
       (u+\eta_{\mathcal K})/2&(v-c)/2
    \end{bmatrix}:\mathbb C^2\longrightarrow\mathcal K. \tag{3.6}
\]

Direct expansion gives the central identity

\[
 \boxed{H_\sigma=\mathcal P_\sigma-WW^*,
        \qquad \mathcal P_\sigma=\mathcal P_0+\sigma G.}
                                                               \tag{3.7}
\]

### Theorem 3.1 (common-schedule sign equivalence)

Assume `kappa_0!=0`.  At each sufficiently large fixed locked parameter for
which the cited high floors hold,

\[
\boxed{
\begin{aligned}
 &\beta_\lambda^{\rm mv}>0\quad\hbox{and}\quad\vartheta_->0\\
 &\quad\Longleftrightarrow\quad
 A\succ0,
 \quad\mathcal P_0\succ0,
 \quad I_2-W^*\mathcal P_0^{-1}W\succ0.
\end{aligned}}                                           \tag{3.8}
\]

When `mathcal P_0>0`, the all-shift shorted load is monotone:

\[
 W^*\mathcal P_\sigma^{-1}W
 \preceq W^*\mathcal P_0^{-1}W
 \qquad(\sigma\geq0).                                \tag{3.9}
\]

Thus the `2 by 2` reserve is worst at the endpoint `sigma=0`; there is no
hidden later shift in this pulled formulation.

**Proof.**  Equation (1.6) gives the even equivalence.  Since `T` is
invertible, (3.2) is a congruence, so

\[
 \mathcal B_-\succ0\quad\Longleftrightarrow\quad H_0\succ0.
                                                               \tag{3.10}
\]

If `H_0>0`, then `mathcal P_0=H_0+WW^*>0`.  Conversely, for
`mathcal P_0>0`, ordinary Schur complementation gives

\[
 \mathcal P_0-WW^*\succ0
 \quad\Longleftrightarrow\quad
 I_2-W^*\mathcal P_0^{-1}W\succ0.                   \tag{3.11}
\]

Combine (1.7), (3.7), and (3.10)--(3.11) to obtain (3.8).  Finally,
`G>0` and (3.7) imply `mathcal P_sigma>=mathcal P_0`; inverse monotonicity
proves (3.9).  \(\square\)

Whenever `mathcal P_sigma>0`, the determinant and inertia are also reduced
exactly:

\[
 \boxed{
 \det(\mathcal B_-+\sigma I)
 ={\det\mathcal P_\sigma\over|\det T|^2}
  \det\!\left(I_2-W^*\mathcal P_\sigma^{-1}W\right),}
                                                               \tag{3.12}
\]

\[
 n_-(\mathcal B_-+\sigma I)
 =n_-\!\left(I_2-W^*\mathcal P_\sigma^{-1}W\right),
 \quad
 n_0(\mathcal B_-+\sigma I)
 =n_0\!\left(I_2-W^*\mathcal P_\sigma^{-1}W\right).
                                                               \tag{3.13}
\]

Equation (3.12) follows from the matrix determinant lemma and the
congruence (3.2).  Equation (3.13) is the corresponding Schur-inertia
identity.  It is a genuine Hermitian inertia reduction, unlike the
rectangular similarity-coordinate relation alone.

There is also an explicit floor.  If

\[
 \mathcal P_0\succeq pI,
 \qquad
 I_2-W^*\mathcal P_0^{-1}W\succeq\varepsilon I_2
 \quad(p>0,\ 0<\varepsilon\leq1),                    \tag{3.14}
\]

then

\[
 \boxed{
 \mathcal B_-\succeq{\varepsilon p\over\|T\|^2}I
 \succeq{\varepsilon p\over N^2}I.}                \tag{3.15}
\]

Indeed the nonzero eigenvalues of
`mathcal P_0^(-1/2)WW^*mathcal P_0^(-1/2)` agree with those of the
`2 by 2` load in (3.14), so (3.7) gives
`H_0>=epsilon*mathcal P_0`; undoing the congruence and using (1.11) proves
(3.15).

## 4. Exact finite obstruction localized in the shorted reserve

The even sign and positivity of `mathcal P_0` do not make the last reserve
automatic.  This already fails in an exact `N=2` source-Cauchy model.

Take `U=0`, `kappa=e_0^+`, and set

\[
\begin{gathered}
 b_0=0,
 \qquad b_1={1\over2},
 \qquad b_2={1\over4},
 \qquad b_{-n}=-b_n,\\
 a_0=0,
 \qquad a_{\pm1}={1\over2},
 \qquad a_{\pm2}={7\over8},                         \tag{4.1}
\end{gathered}
\]

with

\[
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad Q_{nn}=a_n.                                  \tag{4.2}
\]

This is a real Hermitian inversion-symmetric matrix with the exact source
Cauchy displacement.  Its parity blocks are

\[
 Q_+=
 \begin{bmatrix}
 0&\sqrt2/2&\sqrt2/8\\
 \sqrt2/2&1&0\\
 \sqrt2/8&0&1
 \end{bmatrix},
 \qquad
 Q_-=
 \begin{bmatrix}
 0&-1/2\\
 -1/2&3/4
 \end{bmatrix}.                                      \tag{4.3}
\]

On `mathcal K=span{e_1^+,e_2^+}` one has

\[
 \boxed{A=I_2\succ0,}
 \qquad
 \det Q_-=-{1\over4}<0.                              \tag{4.4}
\]

Thus the even complement has unit floor while the odd block has one
negative direction.  The new reduction locates the entire failure.  Here

\[
 T=\operatorname {diag}(1,2),
 \qquad
 T^*Q_-T=\begin{bmatrix}0&-1\\-1&3\end{bmatrix},      \tag{4.5}
\]

and direct substitution in (3.5) gives

\[
 \mathcal P_0=
 \begin{bmatrix}
 5/4&5/32\\
 5/32&529/128
 \end{bmatrix}\succ0,
 \qquad
 \det\mathcal P_0={5265\over1024}.                  \tag{4.6}
\]

Nevertheless (3.12) gives

\[
 \boxed{
 \det\!\left(I_2-W^*\mathcal P_0^{-1}W\right)
 =-{1024\over5265}<0.}                               \tag{4.7}
\]

The obstruction is therefore exactly the final two-direction load, not the
even floor and not the pulled core.  This is a structural Cauchy model, not
the arithmetic Weil matrix or the source-normalized projected anchor.  It
does not decide any arithmetic parameter; it proves that the reserve in
(3.8) cannot be deleted using only the source displacement and even
positivity.

## 5. Anchor-pullback remaining source-specific theorem

On the actual locked common schedule, the new finite route is precisely:

1. prove the existing quantitative lower bound for `beta_lambda^mv`, which
   in particular gives `A>0`;
2. prove `mathcal P_0>0` for the complete signed arithmetic matrix; and
3. prove the explicit `2 by 2` shorted reserve

   \[
    I_2-W^*\mathcal P_0^{-1}W\succ0,                 \tag{5.1}
   \]

   with a quantitative margin if an odd floor is required.

The anchor theorem supplies `kappa_0!=0`, so no extra rank hypothesis is
hidden in this list.  The vectors in (3.1), (3.5), and (3.6) are reconstructed
from the source commutator, the projected anchor, and the complete residual
column.  The critical-height transfer theorem is downstream and supplies no
sign for (5.1).

Positivity of `A` alone does not orient the Jordan product
`(GA+AG)/2`, and the exact model in Section 4 shows that even positivity of
the completed core `mathcal P_0` does not orient the final load.  Hence the
reduction neither repeats a generic parity transfer nor assumes its missing
arithmetic input: it isolates that input in one Hermitian core and two
explicit shorted directions.

## 6. Odd complete-symbol dangerous coframe

The sharp odd dangerous space is already constructed in Section 5.1 of
`notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md`.  It can be combined directly
with the odd radical lift; no raw Fourier cutoff is required for that lift.

Retain the exact complete-symbol weight

\[
 v_{\lambda,U,g}(t)=[g+U-m_\lambda(t)]_+,
 \qquad 0<\delta<g,                                  \tag{6.1}
\]

and let `T_v` be its zero-extension concentration operator.  On `H_-`, put

\[
 \mathcal L_-^\sharp
 =\operatorname {Ran}1_{[g-\delta,\infty)}(T_v|_{H_-})
  +\operatorname {span}\{P_{H_-}p_-\},
 \qquad
 \mathcal F_-^\sharp=(\mathcal L_-^\sharp)^\perp.   \tag{6.2}
\]

The negative pole is included in the retained space, not discarded.  The
existing multiplier theorem proves

\[
 \dim\mathcal L_-^\sharp
 \leq {L\Phi_\lambda(U,g)\over2\pi(g-\delta)}+1,     \tag{6.3}
\]

\[
 P_{\mathcal F_-^\sharp}\mathcal B_-
 P_{\mathcal F_-^\sharp}\succeq\delta I.             \tag{6.4}
\]

Thus the rank-one negative pole costs at most one retained direction.  With
the explicit phase-volume majorant used by the multiplier-dangerous even
reduction, (6.3) is `exp(O(lambda))+1` on the locked schedule, uniformly in
the much larger outer cutoff `N`.

Write

\[
 \mathcal B_-
 =\begin{bmatrix}D_-&\Gamma_-^*\\\Gamma_-&H_-\end{bmatrix}
 \quad\hbox{on}\quad
 \mathcal L_-^\sharp\oplus\mathcal F_-^\sharp,
 \qquad H_-\succeq\delta I,                          \tag{6.5}
\]

and, for `sigma>=0`, define

\[
 \mathsf E_{-,\sigma}y
 =\left(y,-(H_-+\sigma I)^{-1}\Gamma_-y\right),       \tag{6.6}
\]

\[
 \Sigma_{-,\sigma}
 =D_-+\sigma I-\Gamma_-^*(H_-+\sigma I)^{-1}\Gamma_-.
                                                               \tag{6.7}
\]

The odd Möbius lift of Theorem 2.1 in
`notes/ODD_RADICAL_PARITY_SCHUR_REDUCTION.md` applies to every vector in
`E_N^-`.  Observing its exterior remainder only on
`mathcal L_-^sharp` therefore gives a canonical operator

\[
 T_{\rm ext}^{-,\sharp}
 =-P_{\mathcal L_-^\sharp}Q_-|_{E_N^-},               \tag{6.8}
\]

and the exact identity

\[
 \boxed{
 \Sigma_{-,\sigma}
 = (\sigma-U)I-T_{\rm ext}^{-,\sharp}
                     \mathsf E_{-,\sigma}.}           \tag{6.9}
\]

For any positive source-defined metric `Delta_-`, put

\[
 \vartheta_-^\sharp
 =\inf_{\substack{\sigma\geq0\\y\in\mathcal L_-^\sharp\setminus\{0\}}}
 {\|(\sigma-U)y-T_{\rm ext}^{-,\sharp}
                         \mathsf E_{-,\sigma}y\|
  \over\|\Delta_-\mathsf E_{-,\sigma}y\|}.          \tag{6.10}
\]

The same finite Schur proof as in the raw-low odd reduction gives

\[
 \boxed{
 \vartheta_-^\sharp>0
 \quad\Longleftrightarrow\quad
 \mathcal B_-\succ0
 \quad\Longleftrightarrow\quad
 \vartheta_->0.}                                      \tag{6.11}
\]

Thus the odd radical coframe can be posed honestly on the sharp
complete-symbol space of dimension (6.3).  This improves finite cost; it
does not orient the signed coframe.

## 7. What survives under the two nonmatching spectral splits

Let `mathcal L_+` be the multiplier-dangerous retained space in
`mathcal K`, and let `mathcal F_+` be its orthogonal complement there.  Use the
sharp odd spaces from (6.2).  Relative to these decompositions, write

\[
 A=\begin{bmatrix}D_+&\Gamma_+^*\\\Gamma_+&H_+\end{bmatrix},
 \qquad
 \mathcal B_-
 =\begin{bmatrix}D_-&\Gamma_-^*\\\Gamma_-&H_-\end{bmatrix},
 \qquad H_\pm\succeq\delta I.                       \tag{7.1}
\]

Let `i_+:mathcal L_+ -> mathcal K` be inclusion.  Define the two harmonic
lifts and Schur complements in the usual way:

\[
 \mathsf E_{+,\sigma}y
 =\left(y,-(H_++\sigma I)^{-1}\Gamma_+y\right),
 \qquad
 \Sigma_{+,\sigma}
 =D_++\sigma I-\Gamma_+^*(H_++\sigma I)^{-1}\Gamma_+,
                                                               \tag{7.2}
\]

with (6.6)--(6.7) on the odd side.  Introduce the odd shorting row

\[
 \mathscr R_{-,\sigma}
 =P_{\mathcal L_-^\sharp}
  -\Gamma_-^*(H_-+\sigma I)^{-1}P_{\mathcal F_-^\sharp}.
                                                               \tag{7.3}
\]

There are now two natural retained transfer maps:

\[
 \widehat T_\sigma=\mathscr R_{-,\sigma}T i_+,
 \qquad
 K_\sigma=P_{\mathcal L_-^\sharp}T\mathsf E_{+,\sigma}.
                                                               \tag{7.4}
\]

Short the four source directions by

\[
 \widetilde{\boldsymbol b}_{-,\sigma}
   =\mathscr R_{-,\sigma}\boldsymbol b,
 \qquad
 \widetilde d_{-,\sigma}=\mathscr R_{-,\sigma}d,     \tag{7.5}
\]

\[
 \widetilde\eta_{+,\sigma}
   =\mathsf E_{+,\sigma}^*\eta_{\mathcal K},
 \qquad
 \widetilde c_{+,\sigma}=\mathsf E_{+,\sigma}^*c.   \tag{7.6}
\]

### Theorem 7.1 (two-map projected Schur displacement)

For every `sigma>=0`,

\[
\boxed{
 \widehat T_\sigma\Sigma_{+,\sigma}
 -\Sigma_{-,\sigma}K_\sigma
 =|\widetilde{\boldsymbol b}_{-,\sigma}\rangle
       \langle\widetilde\eta_{+,\sigma}|
  -|\widetilde d_{-,\sigma}\rangle
       \langle\widetilde c_{+,\sigma}|.}             \tag{7.7}
\]

**Proof.**  Apply (2.2) to the even harmonic lift.  Since

\[
 (A+\sigma I)\mathsf E_{+,\sigma}y
 =i_+\Sigma_{+,\sigma}y,                              \tag{7.8}
\]

one obtains

\[
 (\mathcal B_-+\sigma I)T\mathsf E_{+,\sigma}y
 =Ti_+\Sigma_{+,\sigma}y
  -\boldsymbol b\langle\widetilde\eta_{+,\sigma},y\rangle
  +d\langle\widetilde c_{+,\sigma},y\rangle.        \tag{7.9}
\]

The low component of `T mathsf E_(+,sigma)y` is `K_sigma y`.
Subtract the odd harmonic lift of that low component and solve its high
row with `H_-+sigma I`.  Inserting the result in the low row is exactly
(7.7).  \(\square\)

The clean rank-two identity has two different maps on its left.  If one
insists on a single commutator map, an additional leakage operator appears:

\[
\boxed{
 K_\sigma\Sigma_{+,\sigma}
 -\Sigma_{-,\sigma}K_\sigma
 =|\widetilde{\boldsymbol b}_{-,\sigma}\rangle
       \langle\widetilde\eta_{+,\sigma}|
  -|\widetilde d_{-,\sigma}\rangle
       \langle\widetilde c_{+,\sigma}|
  +\mathcal L_\sigma\Sigma_{+,\sigma},}              \tag{7.10}
\]

where

\[
\boxed{
\begin{aligned}
 \mathcal L_\sigma
 :={}&K_\sigma-\widehat T_\sigma\\
 ={}&-P_{\mathcal L_-^\sharp}T P_{\mathcal F_+}
        (H_++\sigma I)^{-1}\Gamma_+\\
 &+\Gamma_-^*(H_-+\sigma I)^{-1}
        P_{\mathcal F_-^\sharp}T i_+.
\end{aligned}}                                          \tag{7.11}
\]

Both terms in (7.11) are projector--derivative cross blocks.  Their rank can
be as large as the smaller retained dimension; the source rank-two
commutator does not bound it.  The raw-coordinate identity is recovered
because its matched cutoff makes both cross blocks vanish.  For the rotated
complete-symbol projectors, vanishing of (7.11) is a new intertwining
theorem, not a consequence of the phase-volume or high-floor estimates.

### Theorem 7.2 (exact compatibility forces coordinate spaces)

Consider orthogonal decompositions of the full parity spaces

\[
 H_+=L_+\oplus F_+,
 \qquad H_-=L_-\oplus F_-.
\]

If

\[
 \mathcal D L_+\subseteq L_-,
 \qquad \mathcal D F_+\subseteq F_-,                  \tag{7.12}
\]

then `L_+` reduces `mathcal D^*mathcal D`.  Since

\[
 \mathcal D^*\mathcal D
 =\operatorname {diag}(0,1^2,\ldots,N^2)              \tag{7.13}
\]

has simple spectrum in the normalized even basis, `L_+` is the span of a
subset of the raw Fourier coordinates.  The nonzero coordinates of `L_-`
match those of `L_+` under `mathcal D`; the zero mode may be assigned on the
even side separately.

**Proof.**  If `z in L_-` and `f in F_+`, then
`<mathcal D^*z,f>=<z,mathcal Df>=0` by (7.12).  Hence
`mathcal D^*L_- subseteq L_+`, and therefore
`mathcal D^*mathcal D L_+ subseteq L_+`.  A self-adjoint simple-spectrum
diagonal operator has only coordinate reducing subspaces.  For each `n>=1`,
the two inclusions in (7.12) then send a selected `e_n^+` to `e_n^-` in
`L_-` and an unselected `e_n^+` to `e_n^-` in `F_-`.  Thus the nonzero
coordinate memberships match, proving the claim.  \(\square\)

After anchor removal, the analogous exact compatibility for
`T=mathcal D|_mathcal K` forces `mathcal L_+` to reduce the derivative metric
`G=T^*T` and forces the odd retained space to match its image.  Thus this
stronger two-inclusion compatibility route would require the complete-symbol
projector to commute with `G`.  No such source-specific invariance is
currently proved.  Cancellation between the two terms of (7.11) is a
different possibility and is not excluded by Theorem 7.2.  Forcing
compatibility at the full-parity level simply returns to raw Fourier
coordinate spans.

## 8. Boundary-rank commutator and the conditional buffer route

There is one exact reason not to discard the common-projector idea entirely.
Although `T_v` does not commute with the mode derivative, the full finite
commutator has boundary rank at most two and its even-to-odd block has rank
one before anchor removal.

Put `a=L/2` and write the concentration kernel as

\[
 k_v(s)={1\over2\pi}\int_{\mathbb R}v(t)e^{its}\,dt,
 \qquad
 (T_vf)(x)=\int_{-a}^a k_v(x-y)f(y)\,dy.              \tag{8.1}
\]

Every vector in the locked finite Fourier space is periodic across the two
endpoints, so `f(a)=f(-a)`.  Let `T_(v,N)` be the full finite compression and
let `T_(v,N,+)` and `T_(v,N,-)` denote its two parity blocks.  Since

\[
 D={L\over2\pi i}{d\over dx}                           \tag{8.2}
\]

on the locked modes, integration by parts gives, for `f in E_N^+`,

\[
 \boxed{
 [D,T_{v,N}]
 =|P_Nr_v\rangle\left\langle{\eta\over\sqrt L}\right|
  -\left|{\eta\over\sqrt L}\right\rangle\langle P_Nr_v|,
 \qquad
 \mathcal D T_{v,N,+}f-T_{v,N,-}\mathcal Df
   =P_{E_N^-}r_v\, f(a),
 \qquad
 r_v(x)={L\over2\pi i}
       \{k_v(x+a)-k_v(x-a)\}.}                       \tag{8.3}
\]

The adjoint odd-to-even block supplies the second boundary direction in the
full commutator.  Because `k_v` is even, `r_v` is odd, so (8.3) is exactly
the rank-one plus-to-minus block needed here.  The factor `L/(2*pi*i)` in
(8.3) is exactly the conversion from differentiation to the locked mode
number; endpoint evaluation contributes no extra factor two.

Let

\[
 R_+=P_{\mathcal K}T_{v,N,+}P_{\mathcal K},
 \qquad R_-^0=T_{v,N,-},                               \tag{8.4}
\]

and let

\[
 e_\partial={P_{\mathcal K}\eta\over\sqrt L}          \tag{8.4a}
\]

represent endpoint evaluation on `mathcal K`.  With

\[
 t_\kappa=P_{\mathcal K}T_{v,N,+}\kappa,
 \qquad d=\mathcal D\kappa,
\]

equation (8.3) gives the anchor-compressed rank-two commutator

\[
 \boxed{
 TR_+-R_-^0T
 =|P_{E_N^-}r_v\rangle\langle e_\partial|
  -|d\rangle\langle t_\kappa|.}                      \tag{8.5}
\]

Denote its right side by `C_partial`.  Let `Pi_+` and `Pi_-^0` be the
spectral projectors of `R_+` and `R_-^0` at the common threshold
`g-delta`.  Define the two finite adjacent spectral buffers

\[
\begin{aligned}
 \gamma_1={}&
 \lambda_{\min}(R_+|_{\operatorname {Ran}\Pi_+})
 -\lambda_{\max}(R_-^0|_{\ker\Pi_-^0}),\\
 \gamma_2={}&
 \lambda_{\min}(R_-^0|_{\operatorname {Ran}\Pi_-^0})
 -\lambda_{\max}(R_+|_{\ker\Pi_+}),                 \tag{8.6}
\end{aligned}
\]

with an empty block omitted.  At each fixed finite parameter these numbers
are positive unless an endpoint block is empty, but the existing rank bound
supplies no useful schedule-uniform lower bound for them.  The ordered
Sylvester equations obtained from (8.5) give

\[
 \boxed{
 \|(I-\Pi_-^0)T\Pi_+\|
 \leq{\|C_\partial\|\over\gamma_1},
 \qquad
 \|\Pi_-^0T(I-\Pi_+)\|
 \leq{\|C_\partial\|\over\gamma_2}.}                \tag{8.7}
\]

The Sylvester constant in (8.7) is exactly one.  After shifting two ordered
self-adjoint spectral blocks to bounds `A<=aI<bI<=B`, the solution of
`AX-XB=C` is
`X=-int_(0)^infinity exp(tA) C exp(-tB) dt`, whose norm is at most
`||C||/(b-a)`.

To pass from `Pi_-^0` to the sharp odd space, let `q_-` be the normalized
component of `p_-` orthogonal to `Ran(Pi_-^0)`, when that component is
nonzero.  Then the first bound in (8.7) only improves, while the second gains
the explicit rank-one pole leakage

\[
 \rho_{\rm pole}
 =\|\langle q_-,T(I-\Pi_+)\,\cdot\,\rangle\|.        \tag{8.8}
\]

Combining (7.11) and (8.7) gives the conditional estimate

\[
\begin{aligned}
 \|\mathcal L_\sigma\|
 \leq{}&\left({\|C_\partial\|\over\gamma_2}
                  +\rho_{\rm pole}\right)
       \|(H_++\sigma I)^{-1}\Gamma_+\|\\
 &+\|\Gamma_-^*(H_-+\sigma I)^{-1}\|
       {\|C_\partial\|\over\gamma_1}.               \tag{8.9}
\end{aligned}
\]

This is a valid conditional repair: a certified projector buffer, boundary
commutator norm, pole leakage, and the two harmonic graph slopes would
control the loss of the clean parity identity.

At the fixed threshold `g-delta`, this is not presently an unconditional
route.  A rank-two right side in (8.5) does not make the Sylvester solutions
in (8.7) rank two: in spectral coordinates even a rank-one numerator is
divided entrywise by the Cauchy denominators `lambda_j-mu_i`, which can
produce full rank.  The phase-volume estimate controls the number of
eigenvalues above a positive level, not the adjacent separation at that
particular level.

The fixed-threshold gap is not, however, a necessary input.  The next
section uses the same trace bound to select a common threshold in a compact
positive window.  This supplies an explicit, source-reconstructible gap and
replaces the crude numerator `||C_partial||` by its two oriented rank-two
factor loads.  The resulting bound is unconditional but not yet small: the
oriented boundary loads and the two harmonic graph slopes remain
uncontrolled on the locked schedule.

## 9. Trace-selected common buffer and oriented leakage theorem

The threshold used to define the dangerous projector is auxiliary.  It need
not be fixed at `g-delta`.  Fix exact numbers

\[
 0<a<b<g                                                   \tag{9.1}
\]

and retain the weight `v_(lambda,U,g)` from (6.1).  Let

\[
 \Theta=\operatorname {tr}R_++\operatorname {tr}R_-^0.
                                                               \tag{9.2}
\]

Because `R_+` is a compression of the even block and `R_-^0` is the odd
block of the same positive concentration operator,

\[
 \boxed{
  \Theta\leq\operatorname {tr}T_v
  ={L\over2\pi}\Phi_\lambda(U,g).}                 \tag{9.3}
\]

Let `M` be the number, with multiplicity, of eigenvalues of `R_+` and
`R_-^0` lying in `[a,b]`.  Positivity and (9.2) give

\[
 M\leq \left\lfloor{\Theta\over a}\right\rfloor.  \tag{9.4}
\]

Order the distinct spectral points in `(a,b)`, adjoin `a` and `b`, and
choose a longest consecutive gap, resolving ties by the leftmost gap.  Put
`tau` at its midpoint and let `ell_*` be its length.  This is a deterministic
function of the source-reconstructed finite matrices.  Equations
(9.3)--(9.4) imply

\[
 \boxed{
  \ell_*\geq {b-a\over M+1}
  \geq {b-a\over 1+\lfloor\Theta/a\rfloor}.}       \tag{9.5}
\]

Define the common spectral projectors

\[
 \Pi_+(\tau)=1_{[\tau,\infty)}(R_+),
 \qquad
 \Pi_-^0(\tau)=1_{[\tau,\infty)}(R_-^0),           \tag{9.6}
\]

and add the negative odd pole direction exactly as in (6.2).  The longest
gap contains no spectrum.  Hence every retained eigenvalue is at least
`tau+ell_*/2` and every discarded eigenvalue is at most
`tau-ell_*/2`.  Both adjacent buffers therefore satisfy

\[
 \boxed{\gamma_1(\tau)\geq\ell_*,
        \qquad\gamma_2(\tau)\geq\ell_*.}           \tag{9.7}
\]

At the same time, the far blocks retain the positive floor

\[
 \boxed{H_+(\tau)\succeq(g-b)I,
        \qquad H_-(\tau)\succeq(g-b)I,}            \tag{9.8}
\]

and their retained dimensions obey

\[
 \boxed{
 \dim\mathcal L_+(\tau)+\dim\mathcal L_-^\sharp(\tau)
 \leq {\Theta\over a}+1.}                          \tag{9.9}
\]

For example, the locked choice `g=1`, `a=1/2`, `b=3/4` keeps a far floor
`1/4`, retains `exp(O(lambda))` directions, and gives the explicit common
buffer

\[
 \boxed{
 \ell_*\geq
 {1\over4\{1+\lfloor L\Phi_\lambda(U,1)/\pi\rfloor\}}
 =\exp(-O(\lambda))}                                \tag{9.9a}
\]

from (9.3) and the already proved phase-volume majorant.  No
eigenvalue-spacing conjecture is being used.

The rank-two factorization in (8.5) yields a sharper numerator than the
global norm in (8.7).  Write

\[
 P_+=\Pi_+(\tau),\quad F_+=I-P_+,
 \qquad P_-^0=\Pi_-^0(\tau),\quad F_-^0=I-P_-^0,    \tag{9.10}
\]

and define the exact oriented numerator loads

\[
 \nu_1=\|F_-^0C_\partial P_+\|,
 \qquad
 \nu_2=\|P_-^0C_\partial F_+\|.                    \tag{9.11}
\]

Their factorwise triangle majorants are

\[
\begin{aligned}
 \chi_1={}&
 \|F_-^0P_{E_N^-}r_v\|\,\|P_+e_\partial\|
 +\|F_-^0d\|\,\|P_+t_\kappa\|,\\
 \chi_2={}&
 \|P_-^0P_{E_N^-}r_v\|\,\|F_+e_\partial\|
 +\|P_-^0d\|\,\|F_+t_\kappa\|.
                                                               \tag{9.12}
\end{aligned}
\]

Thus `nu_1<=chi_1` and `nu_2<=chi_2`.  The exact combined loads `nu_i`
should be retained whenever the two boundary directions cancel.

Projecting (8.5) before solving the two ordered Sylvester equations gives

\[
 \boxed{
 \|F_-^0TP_+\|\leq{\nu_1\over\ell_*}
                    \leq{\chi_1\over\ell_*},
 \qquad
 \|P_-^0TF_+\|\leq{\nu_2\over\ell_*}
                    \leq{\chi_2\over\ell_*}.}     \tag{9.13}
\]

Indeed, for the first cross block the numerator is
`F_-^0 C_partial P_+`; its norm is `nu_1`, and its two spectral
blocks are separated by (9.7).  The second equation is identical with the
opposite projections.  This also shows why replacing the projected combined
commutator by `||C_partial||` can lose the endpoint geometry.

After adjoining the odd pole direction, (8.9) improves to

\[
\boxed{
\begin{aligned}
 \|\mathcal L_\sigma\|
 \leq{}&\left({\nu_2\over\ell_*}+\rho_{\rm pole}(\tau)\right)
       \|(H_++\sigma I)^{-1}\Gamma_+\|\\
 &+\|\Gamma_-^*(H_-+\sigma I)^{-1}\|
       {\nu_1\over\ell_*}\\
 \leq{}&\left({\chi_2\over\ell_*}+\rho_{\rm pole}(\tau)\right)
       \|(H_++\sigma I)^{-1}\Gamma_+\|\\
 &+\|\Gamma_-^*(H_-+\sigma I)^{-1}\|
       {\chi_1\over\ell_*}.
                                                               \tag{9.14}
\end{aligned}}
\]

### Theorem 9.1 (what the adaptive buffer does and does not prove)

On every locked finite pair, the source trace determines a common dangerous
threshold for which the far floors, retained-rank bounds, both projector
buffers, and (9.14) are rigorous and independently reconstructible.  On the
locked unbounded schedule, the existing absolute phase-volume theorem makes
the reciprocal-buffer loss at most `exp(O(lambda))`.

This removes the unproved adjacent-gap hypothesis from the projector route.
It does **not** prove that (9.14) tends to zero.  That conclusion still
requires cancellation-preserving estimates for `nu_1`, `nu_2`, the pole
row, and the harmonic graph slopes strong enough to overcome the explicit
reciprocal-buffer loss.  Trace and rank alone provide no such orientation.

There is also no fixed-threshold shortcut.  An exact two-dimensional family
already has a rank-one derivative commutator tending to zero while one
projector--derivative cross block stays fixed.  Let

\[
 P_+={1\over25}\begin{bmatrix}9&12\\12&16\end{bmatrix},
 \qquad
 P_-={1\over73}\begin{bmatrix}9&24\\24&64\end{bmatrix},
 \qquad T=\operatorname {diag}(1,2),                 \tag{9.15}
\]

put `A=2P_+-I`, `B=2P_--I`, and, for `0<epsilon<tau`,

\[
 R_+=\tau I+\epsilon A,
 \qquad R_-=\tau I+\epsilon B.                     \tag{9.16}
\]

Both matrices are positive, have eigenvalues `tau+-epsilon`, and their
threshold-`tau` projectors are exactly `P_+` and `P_-`.  Direct rational
arithmetic gives

\[
 \det(TA-BT)=0,
 \qquad (I-P_-)TP_+=0,                              \tag{9.17}
\]

but

\[
 \boxed{
 \|P_-T(I-P_+)\|^2={1296\over1825},
 \qquad
 P_-(TR_+-R_-T)(I-P_+)
 =-2\epsilon P_-T(I-P_+).}                         \tag{9.18}
\]

Thus the commutator has rank one and norm `O(epsilon)`, whereas the second
leakage is independent of `epsilon`; the adjacent gap `2epsilon` is exactly
what the Sylvester equation divides by.  The family is a structural model,
not the arithmetic concentration operator.  It proves that the source
rank-one parity commutator and derivative singular values by themselves
cannot replace either the adaptive buffer or the oriented estimates in
(9.14).

## 10. Endpoint load audit and saturation obstruction

The large endpoint norm in (9.12) is not automatically harmless.  This
section keeps the Fourier convention used in (8.1),

\[
 \widehat f(t)=\int_{-L/2}^{L/2}f(x)e^{-itx}\,dx,
 \qquad
 \|f\|_2^2=\int_{\mathbb R}|\widehat f(t)|^2{dt\over2\pi}.
                                                               \tag{10.1}
\]

Put `delta_N=eta/sqrt(L)` and `omega_n=2*pi*n/L`.  Direct integration of
the locked Fourier modes gives the exact endpoint transform

\[
 \boxed{
 \widehat{\delta_N}(t)=D_N(t)
 ={2\sin(Lt/2)\over L}
   \sum_{|n|\leq N}{1\over t-\omega_n}.}             \tag{10.2}
\]

The apparent poles are removable.  Pairing `n` with `-n` and using the
partial-fraction expansion of the cotangent yields, for
`|t|<omega_(N+1)`,

\[
 \boxed{
 D_N(t)-\cos(Lt/2)
 ={4t\sin(Lt/2)\over L}
   \sum_{n>N}{1\over\omega_n^2-t^2}.}                \tag{10.3}
\]

Consequently, uniformly on `|t|<=Omega<omega_(N+1)`,

\[
 |D_N(t)-\cos(Lt/2)|
 \leq {|t|L\over
  \pi^2N\{1-(\Omega/\omega_{N+1})^2\}}.              \tag{10.4}
\]

Let `s=kappa(L/2)`.  Since the real source anchor is even and normalized,
the two anchor-compressed boundary directions have transforms

\[
 \boxed{
 \widehat e_\partial(t)=D_N(t)-s\widehat\kappa(t),
 \qquad
 \widehat d(t)={L\over2\pi}
   \{t\widehat\kappa(t)-2s\sin(Lt/2)\}.}             \tag{10.5}
\]

For the positive symbol `v`, define

\[
 E_e=\int_{\mathbb R}v(t)|\widehat e_\partial(t)|^2{dt\over2\pi},
 \qquad
 E_d=\int_{\mathbb R}v(t)|\widehat d(t)|^2{dt\over2\pi}.       \tag{10.6}
\]

The spectral definition of the common threshold gives

\[
 \|P_+e_\partial\|^2\leq {E_e\over\tau},
 \qquad
 \|P_-^0d\|^2\leq {E_d\over\tau},                  \tag{10.7}
\]

but also the reverse orientation

\[
 \boxed{
 \|F_+e_\partial\|^2\geq
 {2N+1\over L}-|s|^2-{E_e\over\tau}.}               \tag{10.8}
\]

Thus compact-frequency concentration puts almost all of the raw endpoint
mass into the `F_+` factor appearing in `nu_2`; it does not remove that
factor.  The source BV estimate does avoid replacing `s` by a raw endpoint
norm.  In the notation of the locked state it gives

\[
 |s|\leq
 { |c_0|/\sqrt L+(V_f/\pi)H_N\over\|P_Nf_\lambda\|}.            \tag{10.9}
\]

The existing source estimates make (10.9) polynomial in `lambda`, while
the locked schedule has `sqrt(N)=exp(Theta(lambda^2))`.

There is a useful exact way to retain the cancellation inside each
rank-two numerator.  For `j=1,2`, set

\[
 (r_1,d_1;e_1,t_1)
 =(F_-^0P_{E_N^-}r_v,F_-^0d;P_+e_\partial,P_+t_\kappa),
                                                               \tag{10.10}
\]

\[
 (r_2,d_2;e_2,t_2)
 =(P_-^0P_{E_N^-}r_v,P_-^0d;F_+e_\partial,F_+t_\kappa).        \tag{10.11}
\]

If `G(u,w)` denotes the `2 by 2` Gram matrix of `u,w`, put

\[
\begin{aligned}
 S_j={}&\|r_j\|^2\|e_j\|^2+\|d_j\|^2\|t_j\|^2
 -2\operatorname {Re}
   \{\langle r_j,d_j\rangle\langle t_j,e_j\rangle\},\\
 D_j={}&\det G(r_j,d_j)\det G(e_j,t_j).
                                                               \tag{10.12}
\end{aligned}
\]

The nonzero squared singular values of
`|r_j><e_j|-|d_j><t_j|` are the roots of
`x^2-S_j x+D_j`.  Hence the exact combined load is

\[
 \boxed{
 \nu_j^2={S_j+\sqrt{S_j^2-4D_j}\over2}.}             \tag{10.13}
\]

This formula is preferable to the factorwise majorants in (9.12), but it
does not by itself supply decay.

Indeed, trace selection and the boundary commutator admit a genuine
positive-symbol counterfamily.  Take the normalized constant anchor
`kappa=L^(-1/2)`, put `omega=pi/L`, and first use the positive even measure

\[
 v=\pi\gamma(\delta_\omega+\delta_{-\omega}),
 \qquad \gamma>0.                                    \tag{10.14}
\]

Writing

\[
 s_N=P_N\sin(\omega x),
 \qquad
 w_N=P_{\kappa^\perp}P_N\cos(\omega x),              \tag{10.15}
\]

the two concentration blocks and the commutator directions are

\[
 R_-^0=\gamma|s_N\rangle\langle s_N|,
 \quad
 R_+=\gamma|w_N\rangle\langle w_N|,
 \quad
 r_N={iL\gamma\over\pi}s_N,
 \quad d=0.                                          \tag{10.16}
\]

Choose a fixed threshold window below both nonzero eigenvalues.  Its
trace-selected gap stays bounded below, whereas the second exact oriented
load is

\[
 \boxed{
 \nu_2=\|r_N\|
 \left\{{2N\over L}
 -{|w_N(L/2)|^2\over\|w_N\|^2}\right\}^{1/2}
 \sim {\gamma L\over\pi}\sqrt N.}                  \tag{10.17}
\]

For each `N`, the atoms in (10.14) may be replaced by sufficiently narrow
symmetric compactly supported nonnegative `L^1` boxes.  Choosing the width
small enough at that `N` preserves the fixed spectral window and the lower
bound in (10.17), so this gives a genuine positive-symbol sequence with the
same growth.  It is not the arithmetic source symbol.  It proves that the
trace bound, the adaptive buffer, and the rank-two commutator identities
alone cannot control `nu_2/ell_*`.  A source-specific cancellation or a
strong decay estimate for `P_-^0r_v` is indispensable.

One-sided saturation is exact, but only relocates the same obstruction.
Starting from an odd base retained space, define

\[
 \mathcal L_-^{\rm sat}
 =\mathcal L_-^{\rm base}+T\mathcal L_+.             \tag{10.18}
\]

This preserves the positive far floor and the `exp(O(lambda))` dimension
bound and makes

\[
 P_{\mathcal F_-^{\rm sat}}TP_{\mathcal L_+}=0.      \tag{10.19}
\]

The other term of (7.11) remains.  Its crude bound is only

\[
 N\,\|(H_++\sigma I)^{-1}\Gamma_+\|,                \tag{10.20}
\]

The projector onto the newly added directions is not, in general, the
projector onto `T mathcal L_+`: the latter need not be orthogonal to the odd
base.  Let `P_0` project onto `mathcal L_-^(base)`, let `i_+` include
`mathcal L_+`, and put

\[
 \mathcal A=(I-P_0)Ti_+,
 \qquad G_0=\mathcal A^*\mathcal A
 =i_+^*T^*(I-P_0)Ti_+,
 \qquad \mathcal Z=\operatorname {Ran}\mathcal A.  \tag{10.21}
\]

The sum in (10.18) is the orthogonal sum
`mathcal L_-^(base) direct-sum mathcal Z`, and the exact projector is

\[
 \boxed{
 P_{\mathcal L_-^{\rm sat}}
 =P_0+\mathcal A G_0^\dagger\mathcal A^*.}          \tag{10.22}
\]

If `S_+=(H_++sigma I)^(-1)Gamma_+`, the norm of the newly added part of
the surviving leakage is therefore exactly

\[
 \boxed{
 \|P_{\mathcal Z}TP_{\mathcal F_+}S_+\|
 =\|(G_0^\dagger)^{1/2}i_+^*T^*(I-P_0)
       TP_{\mathcal F_+}S_+\|.}                    \tag{10.23}
\]

The Moore--Penrose inverse acts on `Ran(G_0)`.  Formula (10.23), not the
unresidualized derivative metric, is the correct covariance term when the
odd base is nonzero.  The complete surviving term is

\[
 P_{\mathcal L_-^{\rm sat}}TP_{\mathcal F_+}S_+
 =P_0TP_{\mathcal F_+}S_+
  +\mathcal A G_0^\dagger i_+^*T^*(I-P_0)
       TP_{\mathcal F_+}S_+.                       \tag{10.23a}
\]

Even though `T` is injective, `mathcal A` need not be: its kernel consists
of the retained even vectors whose derivative already lies in the odd base.
A two-dimensional principal-angle model shows why the dagger cannot be
dropped.  Take `Ti(1)=e_1`, assume `sin(theta)!=0`, and
`mathcal L_-^(base)=span{cos(theta)e_1+sin(theta)e_2}`.  The saturation is
the whole plane, but the new orthogonal direction is
`sin(theta)e_1-cos(theta)e_2` and `G_0=sin^2(theta)`.  Applied to `e_2`, its
projector norm tends to one as `theta->0`, whereas the projector onto
`T mathcal L_+` vanishes.

In the special case `P_0=0`, injectivity of `T` on the anchor complement
gives `G_0=i_+^*Gi_+`, `G=T^*T`, and (10.22) reduces to

\[
 \boxed{
 P_{T\mathcal L_+}TP_{\mathcal F_+}
 =Ti_+(i_+^*Gi_+)^{-1}i_+^*GP_{\mathcal F_+}.}       \tag{10.24}
\]

The exact norm is

\[
 \|P_{T\mathcal L_+}TP_{\mathcal F_+}S_+\|
 =\|(i_+^*Gi_+)^{-1/2}i_+^*G
       P_{\mathcal F_+}S_+\|
 \leq\|(P_{\mathcal F_+}GP_{\mathcal F_+})^{1/2}S_+\|.       \tag{10.24a}
\]

Thus the correct base-free datum is a directional derivative-metric graph
slope, not merely `||S_+||`.  If `P_+` is a spectral projector of `R_+`
with buffer `ell`, its off-diagonal metric block satisfies the Sylvester
bound

\[
 \|i_+^*GP_{\mathcal F_+}\|
 \leq {\|P_+[G,R_+]P_{\mathcal F_+}\|\over\ell},
 \qquad
 [G,R_+]=T^*C_\partial-C_\partial^*T.               \tag{10.24b}
\]

The second identity follows exactly from `C_partial=TR_+-R_-^0T` and its
adjoint.  It introduces the same endpoint directions with one more
derivative and supplies no automatic decay.

The base-zero covariance mechanism can also grow at the endpoint scale, but
its scope must be distinguished from the paired common-threshold split.
Reuse the even retained vector from the positive two-atom measure family
(10.14), take `mathcal L_+=span{w_N}`, and deliberately set the odd base to
zero.  This is an abstract covariance test.  In the uncentered normalized
cosine basis
`tilde e_n^+=sqrt(2/L)cos(2*pi*n*x/L)` write

\[
 w_N=\sum_{n=1}^Na_n\widetilde e_n^+,
 \qquad
 a_n={2\sqrt{2L}(-1)^{n+1}\over
              \pi(4n^2-1)},
 \qquad
 A_j=\sum_{n=1}^N n^{2j}|a_n|^2.                   \tag{10.25}
\]

The rank-one projection formula gives the exact identity

\[
 \boxed{
 \|P_{T\mathcal L_+}TP_{\mathcal F_+}\|^2
 ={A_2\over A_1}-{A_1\over A_0}.}                  \tag{10.26}
\]

Indeed, the numerator before division by `||Tw_N||^2=A_1` is
`||(I-P_(w_N))Gw_N||^2=A_2-A_1^2/A_0`.  Since

\[
 \sum_{n=1}^\infty{n^2\over(4n^2-1)^2}={\pi^2\over64},
 \qquad
 \sum_{n=1}^N{n^4\over(4n^2-1)^2}={N\over16}+O(1), \tag{10.27}
\]

the common coefficient in (10.25) cancels from the ratios and

\[
 \boxed{
 \|P_{T\mathcal L_+}TP_{\mathcal F_+}\|^2
 ={4N\over\pi^2}+O(1).}                            \tag{10.28}
\]

With `gamma_N=A_0^(-1)`, the even concentration block is the projector
`R_N=|w_N><w_N|/A_0`, of trace and nonzero eigenvalue one.  This does **not**
make the zero odd base the paired trace-selected base: for the same atoms,
`Tw_N=(i/2)s_N`, and the odd nonzero concentration eigenvalue relative to
the normalized even one is

\[
 {\|s_N\|^2\over\|w_N\|^2}
 =4{\sum_{n=1}^N n^2/(4n^2-1)^2
       \over\sum_{n=1}^N1/(4n^2-1)^2}\geq4.         \tag{10.28a}
\]

Every common threshold retaining `w_N`
therefore also retains `Tw_N`, so the residual map `mathcal A` in (10.21)
vanishes on that line.  In the paired atom model the newly added term is
zero, while the surviving base cross-block is already large.  If
`mu_-=gamma_N||s_N||^2`, then

\[
 \|P_0TP_{\mathcal F_+}\|={\nu_2\over\mu_-}\asymp\sqrt N. \tag{10.28b}
\]

Saturation leaves this cross-block unchanged.  Its later composition with
the harmonic slope `S_+` in (10.23a) can still cancel and is not bounded
below here.

Separately, for a completely positive abstract block model of the base-zero
covariance, put `ell_N=w_N/sqrt(A_0)` and assume `N>=2`,

\[
 z_N={P_{\mathcal F_+}G\ell_N\over
           \|P_{\mathcal F_+}G\ell_N\|},
 \qquad
 T_a=|2\ell_N+z_N\rangle\langle2\ell_N+z_N|
       +P_{\mathcal F_+\cap z_N^\perp},
 \qquad B_N=I+T_a-R_N.                              \tag{10.29}
\]

Relative to `mathcal L_+ direct-sum mathcal F_+`, this has

\[
 B_N=\begin{bmatrix}4&2\langle z_N|\\
                     2|z_N\rangle&2I\end{bmatrix}, \tag{10.30}
\]

so the far floor is two, the Schur complement is two, the complete block is
positive, and the ordinary harmonic graph slope sends `ell_N` to the unit
vector `z_N`.  Nevertheless its saturated leakage is exactly the left side
of (10.26).  Finally, every coefficient `a_n` is nonzero and the eigenvalues
`n^2` of `G` are distinct.  The Vandermonde determinant of
`[ell_N,Gell_N,...,G^(N-1)ell_N]` is therefore nonzero: alternating exact
closures fill all of `mathcal K_N` in this example.

Thus one-sided saturation converts the missing estimate into a residual
derivative-metric covariance estimate times the remaining harmonic graph
slope.  In the paired positive-symbol sequence from (10.17), the surviving
**base cross-block before composition by the harmonic slope** remains of
order `sqrt(N)`.  In the separate base-zero abstract model,
(10.26)--(10.30) show that the covariance term itself can have that size
while all displayed block floors remain positive.  The latter is not a
common-threshold counterexample for the arithmetic concentration pair.
Saturating the even side instead interchanges the two terms.  Alternating
both closures generates the corresponding residual `G`-cyclic hull and can
fill the whole finite space in the abstract model.

### Theorem 10.1 (remaining endpoint obligation)

Neither `nu_1/ell_*` nor `nu_2/ell_*` is currently proved small on the
locked schedule.  Equation (10.17) rules out deriving such smallness from
trace selection and boundary rank alone, while (10.23)--(10.28) rule out a
free structural repair by one-sided saturation: the paired model leaves the
base cross-block as an unproved harmonic composition, and the abstract
base-zero model can enlarge the covariance term.
The remaining theorem must use the
actual arithmetic symbol to prove cancellation in (10.13), decay of the
oriented boundary projection, or residual derivative-metric covariance
strong enough to overcome the explicit reciprocal-buffer and graph-slope
losses.  No such source-specific estimate is proved here.

## 11. Cancellation-preserving necessary boundary conditions

The exact Gram formula (10.13) can be turned into a one-sided necessary
condition without separating the two rank-one summands.  Put

\[
 u=P_-^0P_{E_N^-}r_v,\qquad z=P_-^0d,\qquad
 a=F_+e_\partial,\qquad b=F_+t_\kappa,              \tag{11.1}
\]

and write

\[
 R=\|u\|,\qquad D=\|z\|,\qquad E=\|a\|,\qquad
 C=|\langle a,b\rangle|.                            \tag{11.2}
\]

The scalar `S_2` in (10.12) is the squared Hilbert--Schmidt norm of
`|u><a|-|z><b|`.  Since this operator has rank at most two,

\[
 {S_2\over2}\leq\nu_2^2\leq S_2,
 \qquad
 2\nu_2^2\geq R^2E^2-2RDC.                         \tag{11.3}
\]

Consequently, whenever `E>0`, small `nu_2` necessarily implies

\[
 \boxed{
 R\leq {DC+\sqrt{D^2C^2+2E^2\nu_2^2}\over E^2}.}  \tag{11.4}
\]

This inequality retains the Gram cross term; it is not the triangle
majorant (9.12).

All auxiliary quantities in (11.4) have finite source bounds.  Let

\[
 \mathfrak A_\lambda=
 [g+U+2\Sigma_\lambda-\psi(1/4)+\log\pi]_+,
 \qquad \alpha=\langle\kappa,T_v\kappa\rangle.      \tag{11.5}
\]

Then `0<=T_v<=mathfrak A_lambda I`.  Positivity and the common spectral
threshold give

\[
 \begin{aligned}
 C&\leq C_{\rm mix}:=
 \sqrt{\alpha E_e}
       \left(1+\sqrt{\mathfrak A_\lambda/\tau}\right),\\
 E^2&\geq E_*^2:={2N+1\over L}-|s|^2-{E_e\over\tau}.
                                                               \tag{11.6}
 \end{aligned}
\]

Indeed,
`|<e_partial,t_kappa>|<=sqrt(alpha E_e)`,
`||P_+e_partial||<=sqrt(E_e/tau)`, and
`||P_+t_kappa||<=sqrt(mathfrak A_lambda alpha)`.  Thus projection onto
`F_+` gives the first line of (11.6).  If `f_lambda` is the unnormalised
source anchor, set

\[
 a_N=\|P_Nf_\lambda\|,\qquad
 V_f=\operatorname {TV}_{\mathbb R/L\mathbb Z}(f_\lambda),\qquad
 B_\kappa={V_f\sqrt{2L}\over2\pi a_N}.              \tag{11.7}
\]

Periodic BV integration by parts gives

\[
 |\langle e_n^+,\kappa\rangle|\leq{B_\kappa\over n},
 \qquad D\leq\|d\|\leq B_\kappa\sqrt N.           \tag{11.8}
\]

Equations (11.4), (11.6), and (11.8) are already an explicit finite
necessary bound after replacing `D,C,E` by
`B_kappa sqrt(N),C_mix,E_*`, provided the checked number `E_*^2` is
positive.  The next construction makes the endpoint scaling more direct
and avoids any possible ambiguity about Gram cancellation.

### 11.1 An explicit high-frequency witness

Let

\[
 M=\lceil N/2\rceil,\qquad K=N-M+1,\qquad
 c_{M,N}=K^{-1/2}\sum_{n=M}^Ne_n^+,                \tag{11.9}
\]

and define the finite sums

\[
 S_1=\sum_{n=M}^N{1\over n},\qquad
 J_2=\sum_{n=M}^N{1\over\omega_n^2},\qquad
 H_N=\sum_{n=1}^N{1\over n}.                       \tag{11.10}
\]

With `c_0=<e_0^+,f_lambda>`, put

\[
 K_\kappa={B_\kappa S_1\over\sqrt K},\qquad
 S_\kappa={{|c_0|/\sqrt L+(V_f/\pi)H_N}\over a_N}. \tag{11.11}
\]

Thus `|<kappa,c_(M,N)>|<=K_kappa` and `|s|<=S_kappa` exactly.  For the
absolute source envelope set

\[
 W_\lambda=\sqrt{e^{2\mathfrak A_\lambda}-1},\qquad
 \Omega_\lambda={W_\lambda\over2},\qquad
 \overline\Phi_\lambda=W_\lambda-\arctan W_\lambda. \tag{11.12}
\]

The complete symbol, with the source minus sign still inside
`m_lambda`, satisfies

\[
 0\leq v\leq\mathfrak A_\lambda,\qquad
 \operatorname {supp}v\subseteq[-\Omega_\lambda,\Omega_\lambda],
 \qquad \Phi_\lambda(U,g)\leq\overline\Phi_\lambda. \tag{11.13}
\]

Assume the finite, checkable inequality `omega_M>=2 Omega_lambda`, and
define

\[
 \begin{aligned}
 E_C&={64\Omega_\lambda^2\overline\Phi_\lambda J_2^2
             \over9\pi LK},\\
 \epsilon_C&={\sqrt{E_C}+\sqrt{\mathfrak A_\lambda}K_\kappa
                    \over\sqrt\tau},\\
 \alpha_C&=\sqrt{2K/L}-S_\kappa K_\kappa
                 -\sqrt{(2N+1)/L}\,\epsilon_C,\\
 \beta_C&=\sqrt{\mathfrak A_\lambda}
       \left(\sqrt{E_C}+\sqrt{\mathfrak A_\lambda}K_\kappa\right)
       +\mathfrak A_\lambda\epsilon_C.             \tag{11.14}
 \end{aligned}
\]

The centered even modes obey the exact transform formula

\[
 \widehat {e_n^+}(t)
 ={2\sqrt{2/L}\,t\sin(Lt/2)\over t^2-\omega_n^2}.  \tag{11.15}
\]

Therefore (11.13) and `omega_M>=2 Omega_lambda` give

\[
 \langle c_{M,N},T_vc_{M,N}\rangle\leq E_C.         \tag{11.16}
\]

After anchor projection, positivity gives

\[
 \|P_+P_{\mathcal K}c_{M,N}\|\leq\epsilon_C.       \tag{11.17}
\]

Let \(x=F_+P_{\mathcal K}c_{M,N}\).  Its norm is at most one.  Direct endpoint
evaluation and (11.14)--(11.17) give

\[
 |\langle e_\partial,x\rangle|\geq\alpha_C,
 \qquad
 |\langle t_\kappa,x\rangle|\leq\beta_C.           \tag{11.18}
\]

Hence, if the explicitly computed `alpha_C` is positive, testing the
combined rank-two operator on `x` proves

\[
 \boxed{
 \nu_2\geq
 \alpha_C\|P_-^0P_{E_N^-}r_v\|
       -\beta_CB_\kappa\sqrt N,}                   \tag{11.19}
\]

and consequently

\[
 \boxed{
 \|P_-^0P_{E_N^-}r_v\|
 \leq {\nu_2+\beta_CB_\kappa\sqrt N\over\alpha_C}.} \tag{11.20}
\]

Every number in (11.20) is a finite source parameter, integral, or finite
sum.  No unspecified finite constant occurs.  For the intended choice
`g=1` and the admitted live-shift tail `0<=U<=1`, the explicit PNT envelope
makes `Omega_lambda` and `overline Phi_lambda` exponential only in `lambda`,
whereas `sqrt(N)` is exponential in `lambda^2` on the locked schedule.
The BV estimates in `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` and the
projected norm bound in `notes/PROJECTED_STATE_NORM_LOWER_BOUND.md` give
asymptotically

\[
 B_\kappa=O(\lambda^4\sqrt L),\qquad
 S_\kappa=O(\lambda^6),\qquad
 \alpha_C=(1+o(1))\sqrt{N/L},\qquad
 \beta_C=O\!\left(\lambda^{11/2}\sqrt{L/N}\right). \tag{11.20a}
\]

Thus the finite conditions `omega_M>=2 Omega_lambda` and `alpha_C>0` hold
eventually, and (11.20) gives

\[
 \|P_-^0P_{E_N^-}r_v\|
 \leq(1+o(1))\sqrt{L/N}\,\nu_2
 +O\!\left({\lambda^{19/2}L^{3/2}\over\sqrt N}\right). \tag{11.20b}
\]

Thus any successful small-`nu_2` estimate forces the actual retained
boundary vector to beat the `sqrt(N)` endpoint scale up to the displayed
polynomial factor.  The underlying source normalization rate is qualitative,
so a finite run must
still check `a_N`, `omega_M`, and `alpha_C` rather than infer an effective
starting point.  The PNT envelope alone does not prove the oriented
cancellation.

### 11.2 Eigenvector-free boundary-leverage excess

There is an exact feature factorization of the same missing vector.  Define

\[
 \mathcal A_{v,N}:E_N^-\longrightarrow
 L^2(\mathbb R,dt/(2\pi)),\qquad
 (\mathcal A_{v,N}f)(t)=\sqrt{v(t)}\,\widehat f(t),
 \qquad
 \zeta_v(t)={L\over\pi}\sqrt{v(t)}\sin(Lt/2),        \tag{11.21}
\]

with target measure `dt/(2*pi)`.  Direct substitution in (8.3) gives

\[
 R_-^0=\mathcal A_{v,N}^*\mathcal A_{v,N},
 \qquad
 P_{E_N^-}r_v=\mathcal A_{v,N}^*\zeta_v.            \tag{11.22}
\]

Put

\[
 c_v=\|\zeta_v\|^2
 ={L^2\over\pi^2}\int_{\mathbb R}
 v(t)\sin^2(Lt/2){dt\over2\pi}.                    \tag{11.23}
\]

Every discarded odd eigenvalue is at most `tau-ell_*/2`.  Therefore

\[
 \boxed{
 \|P_-^0P_{E_N^-}r_v\|^2\geq
 \left[
 \|P_{E_N^-}r_v\|^2-(\tau-\ell_*/2)c_v
 \right]_+.}                                       \tag{11.24}
\]

Combining (11.20) and (11.24) yields the fully scalar necessary condition

\[
 \boxed{
 \left[
 \|P_{E_N^-}r_v\|^2-(\tau-\ell_*/2)c_v
 \right]_+^{1/2}
 \leq {\nu_2+\beta_CB_\kappa\sqrt N\over\alpha_C}.} \tag{11.25}
\]

The boundary-leverage excess on the left of (11.25) contains no projector
eigenvectors and keeps the pole, archimedean term, and every prime power
combined inside `v=[g+U-m_lambda]_+`.  It is the smallest current
actual-arithmetic boundary target; `nu_2` on the right still uses the
source-reconstructed spectral projectors.  Existing trace, support, and
PNT-magnitude bounds do not control the signed excess.

### 11.3 The pole row is an independent endpoint condition

Adjoining the pole direction cannot cancel the multiplier leakage.  The
sharp odd retained space is the orthogonal sum of `Ran(P_-^0)` and the
normalized residual pole direction `q_-`; the two output rows therefore
add as positive squares.

There is also a source-geometry countermodel showing that the trace-selected
gap alone does not control this row.  Take the nonnegative structural symbol
`v=0` and the constant anchor `kappa=e_0^+`.  Then `P_+=P_-^0=0`, the common
gap is the whole selected interval.  With
`p_{-,N}:=P_{E_N^-}p_-`, one has

\[
 q_-={p_{-,N}\over\|p_{-,N}\|},\qquad
 \rho_{\rm pole}=\|T^*q_-\|.                       \tag{11.26}
\]

In the locked centered odd basis,

\[
 \beta_n:=\langle e_n^-,p_-\rangle
 ={2\sqrt2\,i\omega_n\sinh(L/4)
       \over\sqrt L(\omega_n^2+1/4)}.              \tag{11.27}
\]

Consequently the exact finite row norm is

\[
 \boxed{
 \rho_{\rm pole}^2
 ={\sum_{n=1}^N n^2\omega_n^2/(\omega_n^2+1/4)^2
   \over
   \sum_{n=1}^N \omega_n^2/(\omega_n^2+1/4)^2}.}   \tag{11.28}
\]

At fixed `L`, Parseval and (11.27) give

\[
 \boxed{
 \lim_{N\to\infty}{\rho_{\rm pole}^2\over N}
 ={2L\sinh^2(L/4)
   \over\pi^2\{\sinh(L/2)-L/2\}}>0.}              \tag{11.29}
\]

This is not the actual arithmetic symbol.  It proves that even a maximal
common gap permits a pole row of order `sqrt(N)`; source-specific pole
alignment must be proved separately.

### Theorem 11.1 (sharpened open arithmetic target)

The adaptive trace-selected buffer is rigorous, but closing its leakage on
the locked schedule requires all of the following new source estimates:
the scalar boundary-leverage excess in (11.25), the orthogonal pole row,
the opposite oriented load `nu_1`, and the two harmonic graph slopes.
Subject to the explicit checks `omega_M>=2 Omega_lambda` and `alpha_C>0`,
equations (11.19)--(11.25) give the finite necessary bound that any such
cancellation must satisfy; equations (11.26)--(11.29) prove that the pole
row is independent.  Current pinned PNT information controls only magnitudes
and phase volume and proves none of these oriented cancellations.  The
project state therefore remains `P0_INVALIDATED`.

## 12. Exact pole--multiplier load tradeoff

The sharp odd augmentation gives a stronger conclusion than treating
`rho_pole` and `nu_2` as unrelated errors.  Let

\[
 p=P_{E_N^-}p_-,\qquad P=P_-^0,\qquad F=I-P,
 \qquad h=Pp,\qquad f=Fp,                            \tag{12.1}
\]

and, when `f!=0`, let `q=f/||f||`; when `f=0`, the added row is absent and
set `rho_pole=0`.  Put

\[
 X=PTF_+,\qquad
 Y=P_{\mathcal L_-^\sharp}TF_+,
 \qquad w=T^*p=P_{\mathcal K}\mathcal D^*p.         \tag{12.2}
\]

The two output summands of `Y` are orthogonal: `X` maps into `Ran(P)` and
the added row maps into `span{q}`.  Hence

\[
 \|Y\|\leq\sqrt{\|X\|^2+\rho_{\rm pole}^2}
 \leq\sqrt{(\nu_2/\ell_*)^2+\rho_{\rm pole}^2}.     \tag{12.3}
\]

On the other hand, the construction of the sharp space puts the complete
finite pole vector `p=h+f` in `mathcal L_-^sharp`, including the case `f=0`.
Therefore

\[
 \boxed{Y^*p=F_+T^*p=F_+w,\qquad
 \|Y\|\geq{\|F_+w\|\over\|p\|}.}                  \tag{12.4}
\]

When `f!=0`, the same fact can be seen in the cancellation-preserving row
identity

\[
 \boxed{
 \rho_{\rm pole}\|f\|
 =\|F_+T^*f\|=\|F_+w-X^*h\|.}                     \tag{12.5}
\]

The ordered Sylvester equation gives `||X||<=nu_2/ell_*`; hence (12.5)
also implies

\[
 \rho_{\rm pole}\|f\|+{\nu_2\over\ell_*}\|h\|
 \geq\|F_+w\|.                                    \tag{12.6}
\]

There is no pole-normalization mismatch in these formulas.

### 12.1 Exact source reconstruction of the forcing row

Write

\[
 s_L=\sinh(L/4),\qquad
 C_L={\sqrt{2L}\,s_L\over\pi},\qquad
 \vartheta_n={\omega_n^2\over\omega_n^2+1/4},\qquad
 \chi_N=\sum_{n=1}^N\vartheta_n^2.                 \tag{12.7}
\]

The pole coefficients (11.27) satisfy

\[
 n\beta_n=iC_L\vartheta_n.                         \tag{12.8}
\]

If `p_(+,N)=P_(E_N^+)p_+` and
`delta_N=eta/sqrt(L)` is the full finite endpoint vector, then coefficient
comparison gives the exact identity

\[
 \boxed{
 z_0:=\mathcal D^*p
 ={iL\over4\pi}\{4s_L\delta_N-p_{+,N}\},
 \qquad w=P_{\mathcal K}z_0.}                      \tag{12.9}
\]

The zero coefficient on the right cancels exactly.  Thus

\[
 \|z_0\|^2=C_L^2\chi_N,
 \qquad
 \|w\|^2=C_L^2\chi_N-|\langle\kappa,z_0\rangle|^2. \tag{12.10}
\]

Let

\[
 E_w=\langle w,T_vw\rangle
 ={1\over2\pi}\int_{\mathbb R}v(t)|\widehat w(t)|^2dt. \tag{12.11}
\]

Since `P_+=1_[tau,infinity)(R_+)`, the exact source-reconstructible scalar

\[
 M_{\rm exact}^2=
 \left[C_L^2\chi_N-|\langle\kappa,z_0\rangle|^2
             -{E_w\over\tau}\right]_+              \tag{12.12}
\]

satisfies

\[
 \boxed{\|F_+w\|\geq M_{\rm exact}.}              \tag{12.13}
\]

This form retains the complete locked archimedean-minus-prime combination
inside the single positive symbol `v`, without splitting its blocks.

For a formula using only the pinned envelopes, retain `B_kappa` from
(11.7), let `H_N=sum_(n=1)^N 1/n`, and define

\[
 \overline J_N
 =1+{2\over\pi}\log\cot{\pi\over4(2N+1)},          \tag{12.14}
\]

\[
 Z_1={L\over4\pi}
 \left\{4s_L\overline J_N
 +\sqrt{L\{\sinh(L/2)+L/2\}}\right\}.             \tag{12.15}
\]

Here `overline J_N` bounds `||delta_N||_1`, and (12.9) gives
`||z_0||_1<=Z_1`.  With `mathfrak A_lambda` and
`overline Phi_lambda` from (11.5) and (11.12), put

\[
 \boxed{
 \begin{aligned}
 M_{\rm env}^2:=\Bigg[&C_L^2
       \{\chi_N-B_\kappa^2H_N^2\}\\
 &-{1\over\tau}
 \left\{
  \sqrt{\overline\Phi_\lambda/(2\pi)}\,Z_1
  +B_\kappa C_LH_N\sqrt{\mathfrak A_\lambda}
 \right\}^2\Bigg]_+.
                                                               \tag{12.16}
 \end{aligned}}
\]

The BV coefficient bound gives
`|<kappa,z_0>|<=B_kappa C_L H_N`.  The `T_v` seminorm triangle,
`0<=v<=mathfrak A_lambda`, and `int v<=overline Phi_lambda` give the
second line of (12.16).  Consequently

\[
 \boxed{\|F_+w\|\geq M_{\rm env}.}                \tag{12.17}
\]

Every quantity in (12.16) is a finite source parameter or finite sum; no
unspecified finite constant occurs.

### 12.2 Endpoint-size lower bound and its exact scope

The elementary estimate

\[
 1-\vartheta_n^2\leq {2\over1+16\pi^2n^2/L^2}
\]

and an integral comparison give the finite bound

\[
 \chi_N\geq N-{L\over4}.                           \tag{12.18}
\]

On the intended locked tail `g=1`, `0<=U<=1`, and
`N=2^(9600 lambda^2)`, the source bounds used in (11.20a) make every
negative term in (12.16) only `exp(O(lambda))` times a polynomial, while
`C_L^2N=exp(Theta(lambda^2))` times a polynomial.  Hence

\[
 M_{\rm env}=(1-o(1))C_L\sqrt N.                  \tag{12.19}
\]

The coefficient formula (11.27) also gives the finite tail bound

\[
 0\leq\|p_-\|^2-\|p\|^2
 \leq {2L\sinh^2(L/4)\over\pi^2N}.                 \tag{12.20}
\]

Since

\[
 \|p\|^2\leq\|p_-\|^2=\sinh(L/2)-L/2,
 \qquad
 {C_L\over\sqrt{\sinh(L/2)-L/2}}
 =(1+o(1)){\sqrt L\over\pi},                      \tag{12.20a}
\]

equations (12.3)--(12.4) and (12.17) prove

\[
 \boxed{
 \sqrt{\rho_{\rm pole}^2+(\nu_2/\ell_*)^2}
 \geq {M_{\rm env}\over\|p\|}
 =(1-o(1)){\sqrt{LN}\over\pi}.}                  \tag{12.21}
\]

Thus the multiplier load and normalized pole row cannot both be small on
this split.  In particular, any attempt to make the first nonnegative term
of the norm majorant (9.14) tend to zero must prove

\[
 \|(H_++\sigma I)^{-1}\Gamma_+\|
 =o\!\left((LN)^{-1/2}\right)                     \tag{12.22}
\]

uniformly over the claimed shift range.

This does **not** lower-bound the actual composed leakage.  If
`S_(+,sigma)=(H_++sigma I)^(-1)Gamma_+`, then the exact oriented statement is

\[
 \boxed{
 \|YS_{+,\sigma}\|
 \geq{\|S_{+,\sigma}^*F_+w\|\over\|p\|}.}         \tag{12.23}
\]

A large `||Y||` may be invisible on `Ran(S_(+,sigma))`, and the two terms of
(7.11) may cancel before norms.  Therefore (12.21) rules out only the
strategy of making both scalar loads small and then using an ordinary graph
norm in (9.14).  A surviving route must instead prove the endpoint-oriented
smallness in (12.23), retain cancellation between both terms of (7.11), or
change the spectral split.  No such source-specific theorem is proved here,
and the formal state remains `P0_INVALIDATED`.

## 13. Exact one-dimensional boundary-leverage formula

The scalar excess in (11.24) can be reconstructed without forming either
the odd projector or the boundary vector in physical space.  This section
keeps the complete arithmetic cancellation inside one positive-part symbol.
Set `a=L/2`, `omega_n=2*pi*n/L`, `dmu(t)=dt/(2*pi)`, and, for the intended
choice `g=1`, write

\[
 \begin{aligned}
 F_{\lambda,U}(t)={}&1+U+\log\pi
 -\operatorname {Re}\psi\!\left({1\over4}+{it\over2}\right)\\
 &+2\sum_{p^r\leq\lambda^2}
       {\log p\over p^{r/2}}\cos(rt\log p),
 \qquad v(t)=[F_{\lambda,U}(t)]_+ .                \tag{13.1}
 \end{aligned}
\]

The prime-power sum in (13.1) is inclusive and is precisely the negative
prime block of the source multiplier after it is subtracted in
`v=[1+U-m_lambda]_+`; no sign has been changed.  Define the absolutely
convergent one-dimensional integrals

\[
 J_0=\int_{\mathbb R}v(t)\sin^2(at)\,d\mu(t),
 \qquad
 J_n=\int_{\mathbb R}
 {v(t)\sin^2(at)\over t^2-\omega_n^2}\,d\mu(t).   \tag{13.2}
\]

At `t=+-omega_n` the quotient in `J_n` has a removable zero, not a pole.
The centered odd basis has transform

\[
 \widehat {e_n^-}(t)
 ={2\sqrt{2/L}\,\omega_n\sin(at)
       \over t^2-\omega_n^2}.                     \tag{13.3}
\]

Combining (13.3) with the exact feature factorization (11.21)--(11.22)
gives

\[
 \boxed{
 \langle e_n^-,r_v\rangle
 ={2\sqrt{2L}\,\omega_n\over\pi}J_n,
 \qquad
 c_v={L^2\over\pi^2}J_0.}                         \tag{13.4}
\]

Here `J_0>0` on the admitted `0<=U<=1` range.  Indeed,
`psi(1/4)=-gamma-pi/2-3log(2)`, so

\[
 F_{\lambda,U}(0)
 =1+U+\log\pi+\gamma+{\pi\over2}+3\log2
     +2\Sigma_\lambda>0,                           \tag{13.4a}
\]

and continuity makes `v` positive on a neighborhood of zero.  Thus the
division by `J_0` below is legitimate.

Consequently, with `c_N=tau-ell_*/2`, the boundary-leverage excess is

\[
 \boxed{
 L_{v,N}:=\|P_{E_N^-}r_v\|^2-c_Nc_v
 ={8L\over\pi^2}\sum_{n=1}^N\omega_n^2J_n^2-c_Nc_v
 =c_v(\rho_N-c_N),}                               \tag{13.5}
\]

where

\[
 \boxed{
 \rho_N={8\over LJ_0}\sum_{n=1}^N\omega_n^2J_n^2.} \tag{13.6}
\]

Thus the positive part, the digamma term, and every prime power remain
combined through the quadratures in (13.2).  Equations (13.5)--(13.6) are
also an independent scalar assembly path for the left side of (11.25).

### 13.1 Continuum quotient and explicit projection tail

Let

\[
 k_v(s)=\int_{\mathbb R}v(t)e^{its}\,d\mu(t).
                                                               \tag{13.7}
\]

Since `v` is real and even, `k_v` is real and even and

\[
 k_v(0)-k_v(L)=2J_0.                               \tag{13.8}
\]

Parseval applied directly to (8.3) gives the exact continuum quotient

\[
 \boxed{
 \rho_\infty={\|r_v\|^2\over c_v}
 ={\displaystyle\int_0^L
       [k_v(u)-k_v(L-u)]^2\,du
   \over 2[k_v(0)-k_v(L)]}.}                      \tag{13.9}
\]

It follows without a limiting interchange that

\[
 \boxed{
 L_{v,N}=c_v(\rho_\infty-c_N)
          -\|(I-P_{E_N^-})r_v\|^2.}               \tag{13.10}
\]

If `supp(v) subseteq [-Omega,Omega]` and
`omega_(N+1)>=2Omega`, then (13.2) gives

\[
 |J_n|\leq{4J_0\over3\omega_n^2}\quad(n>N),
\]

and hence the fully explicit tail estimate

\[
 \boxed{
 \|(I-P_{E_N^-})r_v\|^2
 \leq {32c_v^2\over9LN},
 \qquad
 0\leq\rho_\infty-\rho_N
 \leq {32c_v\over9LN}.}                           \tag{13.11}
\]

The locked schedule therefore removes the Fourier projection tail once
the support condition is checked.  The unresolved source theorem is the
uniform strict inequality `rho_infty>c_N` with enough reserve to survive
(13.11).

There is a second exact interpretation.  Freeze `v` and let `K_a^-` be
the odd concentration operator, represented on `L^2(0,a)` by the kernel
`k_v(x-y)-k_v(x+y)`.  Differentiating its two trace identities with respect
to the interval half-length, while holding `v` fixed, gives

\[
 \boxed{
 \rho_\infty
 ={\partial_a\operatorname {tr}(K_a^-)^2
       \over2\,\partial_a\operatorname {tr}K_a^-}
 ={\sum_j\lambda_j(a)\lambda_j'(a)
       \over\sum_j\lambda_j'(a)}.}                \tag{13.12}
\]

The adaptive gap in Section 9 controls only the finite Ritz spectra of
`R_-^0` and `R_+`, not the continuum eigenvalues `lambda_j(a)` in (13.12).
It supplies neither a continuum value gap nor the boundary-flow weights
`lambda_j'`; even hypothetical value control alone would not sign their
weighted average.  The eigenvalue form in (13.12) is read at differentiability
points, while the trace-derivative form is the invariant statement.

### 13.2 Stronger finite lower bound and a structural no-go

The feature factorization yields a stronger eigenvector-free finite
estimate than (11.24).  Put

\[
 G=\mathcal A_{v,N}^*\mathcal A_{v,N}=R_-^0,
 \qquad b=\mathcal A_{v,N}^*\zeta_v=P_{E_N^-}r_v. \tag{13.13}
\]

On the support of `G`, spectral expansion gives

\[
 b^*G^\dagger b
 =\|P_{\operatorname {Ran}\mathcal A_{v,N}}\zeta_v\|^2
 \leq c_v.                                        \tag{13.14}
\]

Since every discarded eigenvalue is at most `c_N`,

\[
 \boxed{
 \|P_-^0b\|^2
 \geq[\|b\|^2-c_Nb^*G^\dagger b]_+
 \geq[\|b\|^2-c_Nc_v]_+.}                        \tag{13.15}
\]

The first lower bound can be strictly sharper and is still reconstructed
from the finite source matrix and feature vector.

No theorem based only on evenness, nonnegativity, compact support, and the
adaptive trace gap can force (13.5) to be positive.  Indeed, take any
nonzero symbol `w` with those properties and put `v_gamma=gamma w`.  For
small enough `gamma`, both concentration blocks have norm below the left
endpoint `a` of the threshold window.  The selected gap is then the whole
window and `c_N=a`, whereas

\[
 c_{v_\gamma}=\gamma c_w,
 \qquad
 \|P_Nr_{v_\gamma}\|^2=\gamma^2\|P_Nr_w\|^2,
 \qquad
 L_{v_\gamma,N}
 =\gamma c_w\{\gamma\rho_N(w)-a\}<0.             \tag{13.16}
\]

This is a structural family, not the pinned arithmetic symbol.  It proves
that an actual-amplitude or cancellation estimate for (13.1) is
indispensable.

There is at least one cancellation-free part of the arithmetic sum.  If
`Omega_*` is any certified support radius for `v` and

\[
 n_0=\min\{n\geq1:\omega_n>\Omega_*\},             \tag{13.17}
\]

then every `J_n` with `n>=n_0` is strictly negative when `J_0>0`, and
`|J_n|>=J_0/omega_n^2`.  Therefore

\[
 \boxed{
 \rho_N\geq {2c_v\over L}
 \sum_{n=n_0}^N{1\over n^2}
 \geq {2c_v\over L}
 \left({1\over n_0}-{1\over N+1}\right).}         \tag{13.18}
\]

With only the present absolute support envelope and near-zero lower
information on `c_v`, (13.18) is too small to exceed `c_N`.  It is a
rigorous sign mechanism for exact source quadrature, not a completed
asymptotic estimate.

### 13.3 Small source pilot (diagnostic only)

For `g=1`, `U=0`, and threshold window `[1/2,3/4]`, a direct full-Fourier
assembly and a separate parity/feature assembly gave the following rounded
point-arithmetic diagnostics.  Every prime power through `lambda^2` was
generated inclusively; no zero data, stored matrix, or cached eigensystem was
read.

| `(lambda,N)` | `L_(v,N)` | `||P_-^0r_v||` | `nu_2` | projection error |
|---|---:|---:|---:|---:|
| `(1.5,5)` | `-0.0630381` | `0.0668466` | `0.184590` | `7.23e-4` |
| `(2,4)` | `-0.184608` | `0.298093` | `0.517035` | `3.32e-5` |
| `(2,8)` | `-0.201905` | `0.321389` | `0.918074` | `1.40e-7` |
| `(2,12)` | `-0.194210` | `0.335036` | `1.25615` | `8.80e-8` |

The positive part in (11.24) is therefore zero at every listed pilot even
though the actual retained boundary vector is nonzero.  At `(1.5,5)`, the
60- and 120-decimal runs at fixed quadrature configuration agreed through
the 60 retained digits.  For the three `lambda=2` pairs, halving the support
mesh and increasing quadrature order preserved at least 18 reported digits.
In the doubled run, the
full/parity and feature/commutator reconstruction defects were below
`3.3e-120`, while the independent scalar-`J_n` reconstruction defect was
below `2e-61`.

Both numerical routes share `mpmath`; these are rounded point values, not
directed balls.  Their robust negative signs show only that the coarse
positive-part lower bound is vacuous at these small pairs.  They neither
refute eventual positive reserve nor supply an asymptotic estimate.

### Theorem 13.1 (precise remaining scalar sign)

Equations (13.1)--(13.11) reduce the boundary-leverage component of the
second oriented load to one-dimensional quadratures of the complete pinned
symbol, with an explicit `O(1/N)` tail containing no unspecified finite
constant.  Equations (13.12) and (13.16) show why the trace-selected gap and
positive-symbol structure alone cannot prove the required sign.  The
source-specific inequality `rho_infty>c_N`, uniformly over the live shift
and with quantitative reserve, remains open.  No asymptotic sign or
determinant conclusion follows from this section.

## 14. Harmonic forcing orientation and exact cancellation obstruction

The pole--multiplier lower bound (12.21) cannot be upgraded by multiplying
it by an ordinary harmonic graph norm.  This section identifies the exact
missing feature overlap and gives a rational family in which both leakage
terms cancel for every shift.

Put `P=P_+`, `F=F_+`, `B_sigma=A+sigma I`, and

\[
 S_{+,\sigma}=(H_++\sigma I)^{-1}\Gamma_+,
 \qquad
 \mathsf E_{+,\sigma}=P-FS_{+,\sigma}.             \tag{14.1}
\]

Here projections also denote their canonical inclusions when the domain is
the retained space.  The even Schur identities are

\[
 B_\sigma\mathsf E_{+,\sigma}=P\Sigma_{+,\sigma},
 \qquad
 \mathsf E_{+,\sigma}^*B_\sigma=\Sigma_{+,\sigma}P. \tag{14.2}
\]

For the pole forcing `w=T^*p` from Section 12, (14.2) gives, whenever
`B_sigma` is invertible,

\[
 \boxed{
 S_{+,\sigma}^*Fw
 =-\Sigma_{+,\sigma}PB_\sigma^{-1}Fw
 =Pw-\Sigma_{+,\sigma}PB_\sigma^{-1}w.}           \tag{14.3}
\]

Thus a positive Schur floor only moves the problem to the signed
off-diagonal resolvent `P B_sigma^(-1) Fw`; it does not orient it.

### 14.1 Screened endpoint feature

The complete-symbol split gives a cancellation-preserving feature formula.
On `mathcal K`, put

\[
 R=P_{\mathcal K}T_vP_{\mathcal K},
 \qquad
 C=P_{\mathcal K}T_aP_{\mathcal K}
   +2|P_{\mathcal K}p_{+,N}\rangle
        \langle P_{\mathcal K}p_{+,N}|,
 \qquad A=gI-R+C.                                  \tag{14.4}
\]

Since `P` is a spectral projector of `R`,

\[
 \Gamma_+=FCP,
 \qquad
 H_++\sigma I=K_{F,\sigma}+FCF,
 \qquad
 K_{F,\sigma}=F\{(g+\sigma)I-R\}F,               \tag{14.5}
\]

and the selected gap gives

\[
 K_{F,\sigma}\succeq
 (g+\sigma-\tau+\ell_*/2)F.                       \tag{14.6}
\]

Let `a_lambda(t)=[m_lambda(t)-(g+U)]_+` and define the source feature map

\[
 Zx=\left(\sqrt{a_\lambda}\,\widehat x,
           \sqrt2\langle p_{+,N},x\rangle\right),
 \qquad C=Z^*Z,                                    \tag{14.7}
\]

where the first component uses `dt/(2*pi)`.  Write `Z_P=ZP`, `Z_F=ZF`, and

\[
 Q_\sigma=Z_FK_{F,\sigma}^{-1/2}.                 \tag{14.8}
\]

For every `y in Ran(F)`, the push-through identity gives

\[
 \boxed{
 S_{+,\sigma}^*y
 =Z_P^*(I+Q_\sigma Q_\sigma^*)^{-1}
        Q_\sigma K_{F,\sigma}^{-1/2}y.}           \tag{14.9}
\]

In particular, if

\[
 \xi_\sigma=(I+Q_\sigma Q_\sigma^*)^{-1}
        Q_\sigma K_{F,\sigma}^{-1/2}Fw,           \tag{14.10}
\]

then

\[
 \boxed{
 \|S_{+,\sigma}^*Fw\|^2
 =\langle\xi_\sigma,Z_PZ_P^*\xi_\sigma\rangle.} \tag{14.11}
\]

The missing theorem is therefore a lower bound on the overlap of the
screened endpoint feature `xi_sigma` with the retained source-feature
range.  Positivity supplies only the upper bound

\[
 \|S_{+,\sigma}^*y\|
 \leq{\|PCP\|^{1/2}
       \over2\sqrt{g+\sigma-\tau+\ell_*/2}}\|y\|, \tag{14.12}
\]

because `sup_(s>=0) s/(1+s^2)=1/2`.  It supplies no positive lower bound.

The positive pole and `T_a` contributions can also be kept combined without
the abstract feature map.  Put

\[
 p_c=P_{\mathcal K}p_{+,N},
 \quad u=Fp_c,
 \quad a_P=Pp_c,
 \quad H_{0,\sigma}=K_{F,\sigma}+FT_aF,
 \quad G=PT_aF,
 \quad \mu=\langle u,H_{0,\sigma}^{-1}u\rangle.   \tag{14.13}
\]

Sherman--Morrison applied before taking norms gives

\[
 \boxed{
 \begin{aligned}
 S_{+,\sigma}^*y={}&GH_{0,\sigma}^{-1}y\\
 &+{2\over1+2\mu}
  \{a_P-GH_{0,\sigma}^{-1}u\}
  \langle u,H_{0,\sigma}^{-1}y\rangle.
 \end{aligned}}                                    \tag{14.14}
\]

The two terms in (14.14) can cancel.  Their norms must not be separated in
an endpoint-orientation estimate.  For `y=Fw`, the forcing itself remains
the exact pole combination

\[
 Fw={iL\over4\pi}
       \{4s_LF\delta_N-Fp_{+,N}\}.                \tag{14.15}
\]

There is an equally exact identity for cancellation between the two terms
of (7.11).  Put

\[
 S_{-,\sigma}=(H_-+\sigma I)^{-1}\Gamma_-.
\]

Since the finite pole vector belongs to `mathcal L_-^sharp`, taking the
adjoint of (7.11) on `p` gives

\[
 \boxed{
 \begin{aligned}
 \mathcal L_\sigma^*p
 ={}&-S_{+,\sigma}^*F_+w
 +P_+T^*F_-^\sharp S_{-,\sigma}p\\
 ={}&\mathsf E_{+,\sigma}^*w
      -P_+T^*\mathsf E_{-,\sigma}p.
 \end{aligned}}                                    \tag{14.16}
\]

Consequently,

\[
 \boxed{
 \|\mathcal L_\sigma\|
 \geq{\|S_{+,\sigma}^*F_+w
       -P_+T^*F_-^\sharp S_{-,\sigma}p\|
          \over\|p\|}.}                           \tag{14.17}
\]

The current first oriented Sylvester bound yields only

\[
 \|\mathcal L_\sigma\|
 \geq{\left[
   \|S_{+,\sigma}^*F_+w\|
   -(\nu_1/\ell_*)\|S_{-,\sigma}p\|
  \right]_+\over\|p\|}.                           \tag{14.18}
\]

Thus both endpoint orientation and cancellation against the opposite
harmonic lift remain live source obligations.

### 14.2 Rational all-shift cancellation family

The losses above are genuine even when every currently used structural
floor and gap is fixed.  For an integer `M>=2`, take both parity spaces to
be `C^2` and put

\[
 P_+=P_-^0=|e_1\rangle\langle e_1|,
 \qquad
 F_+=F_-^\sharp=|e_2\rangle\langle e_2|,           \tag{14.19}
\]

\[
 R=\operatorname {diag}(3/2,6/5),
 \qquad
 T_M=\begin{bmatrix}0&M\\1&0\end{bmatrix},
 \qquad p=2e_1.                                    \tag{14.20}
\]

Every threshold in `(6/5,3/2)` gives the same retained spaces and a fixed
common spectral gap.  Define the complete even and odd blocks

\[
 A_M=\begin{bmatrix}2&M^{-2}\\M^{-2}&1\end{bmatrix},
 \qquad
 B_M=\begin{bmatrix}2&M^{-1}\\M^{-1}&1\end{bmatrix}. \tag{14.21}
\]

Both are positive and have far floor one.  They also have the required
source-sign structural decompositions

\[
 A_M=2I-R+C_{+,M},
 \qquad
 C_{+,M}=\begin{bmatrix}3/2&M^{-2}\\M^{-2}&1/5\end{bmatrix}
 \succ0,                                           \tag{14.22}
\]

\[
 B_M=2I-R+C_{-,M}-2|p\rangle\langle p|,
 \qquad
 C_{-,M}=\begin{bmatrix}19/2&M^{-1}\\M^{-1}&1/5\end{bmatrix}
 \succ0.                                           \tag{14.23}
\]

The derivative singular values are exactly `1,M`, and the source-form
displacement has rank two:

\[
 \boxed{
 T_MA_M-B_MT_M
 =|e_2\rangle\langle e_1|
  -\left|\begin{matrix}M\\1-M^{-2}\end{matrix}\right\rangle
       \langle e_2|.}                              \tag{14.24}
\]

The concentration commutator is

\[
 T_MR-RT_M
 =\begin{bmatrix}0&-3M/10\\3/10&0\end{bmatrix}, \tag{14.25}
\]

so the two oriented Sylvester loads recover cross blocks of norms `M` and
one exactly.  Nevertheless, for every `sigma>=0`,

\[
 S_{+,\sigma}={1\over M^2(1+\sigma)},
 \qquad
 S_{-,\sigma}={1\over M(1+\sigma)}.                \tag{14.26}
\]

Since `P_-^0T_MF_+=M` and `F_-^\sharp T_MP_+=1`, the two terms of (7.11)
cancel:

\[
 \boxed{
 -P_-^0T_MF_+S_{+,\sigma}
 +S_{-,\sigma}^*F_-^\sharp T_MP_+=0}              \tag{14.27}
\]

for every nonnegative shift.  At the same time,

\[
 w=T_M^*p=2Me_2,
 \qquad {\|F_+w\|\over\|p\|}=M,                 \tag{14.28}
\]

while

\[
 \boxed{
 \|P_-^0T_MF_+S_{+,\sigma}\|
 ={1\over M(1+\sigma)}
 ={\|S_{+,\sigma}^*F_+w\|\over\|p\|}
 \longrightarrow0.}                               \tag{14.29}
\]

This is a rational structural family, not the arithmetic source.  It proves
that an arbitrarily large pole--multiplier load can be erased by an
inverse-scale harmonic slope and that the opposite leakage term can cancel
it for all shifts.  Positivity, fixed far floors, a common spectral gap,
derivative singular values, boundary-commutator rank, and the source-form
displacement do not upgrade (12.21) or (12.23).  A successful route must
prove the source-specific screened-feature overlap in (14.11), control the
combined expression in (14.16), or choose a different split.

### 14.3 Exact Green transport and why its scalar margin is insufficient

The pole-deleted odd Green vector transports the screen through the exact
rank-two displacement.  Put

\[
 R_0=|\boldsymbol b\rangle\langle\eta_{\mathcal K}|
       -|d\rangle\langle c|,
 \qquad B_{-,\sigma}=\mathcal B_-+\sigma I,
 \qquad M_\sigma=B_{-,\sigma}+2|p\rangle\langle p|,             \tag{14.30}
\]

and, whenever `M_sigma` is invertible and the scalar below is nonzero, define

\[
 m_\sigma=M_\sigma^{-1}p,
 \qquad
 \delta_\sigma=1-2\langle p,m_\sigma\rangle.       \tag{14.31}
\]

Then

\[
 B_{-,\sigma}m_\sigma=\delta_\sigma p.             \tag{14.32}
\]

Taking the adjoint of (2.2) and applying it to `m_sigma` gives

\[
 (A+\sigma I)T^*m_\sigma
 =\delta_\sigma w+R_0^*m_\sigma.                  \tag{14.33}
\]

Multiplication by the even harmonic lift, followed by (14.2), yields the
exact screen formula

\[
 \boxed{
 \mathsf E_{+,\sigma}^*w
 ={1\over\delta_\sigma}
 \left\{\Sigma_{+,\sigma}PT^*m_\sigma
       -\mathsf E_{+,\sigma}^*R_0^*m_\sigma\right\},}          \tag{14.34}
\]

or equivalently

\[
 \boxed{
 S_{+,\sigma}^*Fw
 =Pw-{1\over\delta_\sigma}
 \left\{\Sigma_{+,\sigma}PT^*m_\sigma
       -\mathsf E_{+,\sigma}^*R_0^*m_\sigma\right\}.}         \tag{14.35}
\]

Substitution in (14.16) gives

\[
 \boxed{
 \mathcal L_\sigma^*p
 ={1\over\delta_\sigma}
 \left\{\Sigma_{+,\sigma}PT^*m_\sigma
       -\mathsf E_{+,\sigma}^*R_0^*m_\sigma\right\}
 -P_+T^*\mathsf E_{-,\sigma}p.}                   \tag{14.36}
\]

The displacement remainder contains exactly two signed Green moments,

\[
 R_0^*m_\sigma
 =\eta_{\mathcal K}\langle\boldsymbol b,m_\sigma\rangle
  -c\langle d,m_\sigma\rangle.                   \tag{14.37}
\]

Thus even a positive scalar `delta_sigma` leaves a transported Green vector,
two signed boundary moments, and the opposite harmonic lift.  It does not
orient either (14.35) or (14.36).  The critical-load audit in Section 8.2
of `notes/ARITHMETIC_TWO_DIRECTION_RESERVE_NORMAL_FORM.md` gives the more
precise caveat: on its source-selected neutral diagonal, every passing
projected Green scalar at `sigma=0` obeys
`limsup lambda*delta_0<=2c_0`; for each fixed nonnegative `sigma`, the same
calculation has upper coefficient `2c_0+sigma`.  Thus the ceiling is
`O(1/lambda)`.  This is conditional on the scalar passing, not a proof that
a positive margin exists.  Its effective transfer to the preselected
exponential cutoff still requires the uniform form-tail check stated there.

The rational family in Section 14.2 already has a uniformly healthy version
of this scalar gate.  In that family

\[
 M_\sigma=
 \begin{bmatrix}10+\sigma&M^{-1}\\M^{-1}&1+\sigma\end{bmatrix}
 \succeq(1/2+\sigma)I,                             \tag{14.38}
\]

and

\[
 \boxed{
 \delta_\sigma=
 { (2+\sigma)(1+\sigma)-M^{-2}\over
   (10+\sigma)(1+\sigma)-M^{-2}}
 \geq{7\over39}.}                                 \tag{14.39}
\]

Nevertheless, (14.27) and (14.29) give `mathcal L_sigma=0` and screened
overlap tending to zero.  A Green floor and a Green scalar, even uniformly
bounded away from zero, are therefore structurally insufficient.

### 14.4 Orthogonality of the positive and multi-lobe features

The multi-lobe theorem below concerns a restriction `v_M<=v` of the
negative-part symbol.  Pointwise,

\[
 a=[m_\lambda-(1+U)]_+,
 \qquad v_M\leq[1+U-m_\lambda]_+
 \quad\Longrightarrow\quad
 \sqrt a\sqrt{v_M}=0.                              \tag{14.40}
\]

If `mathcal A_a f=sqrt(a) widehat f` and
`mathcal A_(v_M)f=sqrt(v_M) widehat f`, then

\[
 \boxed{\mathcal A_a^*\mathcal A_{v_M}=0.}         \tag{14.41}
\]

After time compression, the corresponding Toeplitz and Hankel pieces obey

\[
 \boxed{T_aT_{v_M}=-H_a^*H_{v_M}.}                 \tag{14.42}
\]

Hence the only positive-feature interaction with the large multi-lobe
boundary vector is a signed boundary-Hankel defect, together with the pole.
The spectral projector of `T_{v_M}` is not nested in the spectral projector
of the full `T_v`; Loewner order does not make spectral subspaces monotone.
The quotient growth in Section 16 therefore cannot be inserted as a lower
bound in (14.11).

There is also an exact continuum cancellation in the untruncated
endpoint--pole profile.  Write `x=Lt`, `s=sinh(L/4)`, and
`c_L=cosh(L/4)`.  The continuum even pole transform satisfies

\[
 \widehat p_+(t)
 ={s\cos(x/2)+2tc_L\sin(x/2)\over t^2+1/4},        \tag{14.43}
\]

so

\[
 4s\cos(x/2)-\widehat p_+(x/L)
 ={2(x/L)\{2s(x/L)\cos(x/2)-c_L\sin(x/2)\}
       \over1/4+x^2/L^2}.                          \tag{14.44}
\]

Define only for this continuum comparison

\[
 \widehat z_0^{\rm cont}(t)
 ={iL\over4\pi}\{4s\cos(Lt/2)-\widehat p_+(t)\}.
\]

Then, uniformly on every `|x|<=pi M=o(L)`,

\[
 \widehat z_0^{\rm cont}(x/L)
 =-{2ic_L\over\pi}x\sin(x/2)+O(sx^2/L).           \tag{14.45}
\]

Equations (14.43)--(14.45) are continuum identities: the separately
order-`Ls` endpoint and pole profiles cancel on every retained lobe.  The
exact finite forcing remains (14.15), with `D_N` in place of the cosine and
`p_(+,N)` in place of `p_+`; its difference from the displayed continuum
profile is

\[
 {iL\over4\pi}\left(
 4s\{D_N(t)-\cos(Lt/2)\}
 -\{\widehat p_{+,N}(t)-\widehat p_+(t)\}\right).
\]

That projection error must be bounded rather than silently discarded.
Anchor projection can also add a `kappa` component, so the continuum
cancellation is not a finite screened-feature lower bound.

## 15. Actual boundary quotient: honest bracket and central-lobe limit

The exact quotient in Section 13 admits a source-specific lower bound, but
the bound furnished by the current pinned inputs is exponentially below the
selected threshold.  The compact-rescaling input below is Lemma 2.1 of
`notes/ANNULAR_GRAY_MASS_OBSTRUCTION.md`, locked as the annular prime profile
in `COVARIANCE_ANNULAR_ODD_SUBSEQUENCE_SOURCE_LOCK.json`.  The fixed-parameter
Haar identity is the unique-factorization/Kronecker--Weyl derivation in
Section 2 of `notes/PHASE_VOLUME_SCALE_AUDIT.md`, whose bytes are pinned by
`COMPRESSED_MULTIPLIER_TRACE_SOURCE_LOCK.json`.  Both are repository
derivations from the explicit Fiori--Kadiri--Swidinsky estimate; neither is
attributed to the CCM source.  Put

\[
 \Sigma_\lambda=
 \sum_{p^r\leq\lambda^2}{\log p\over p^{r/2}},
 \qquad
 A_U=1+U+2\Sigma_\lambda-\psi(1/4)+\log\pi,
 \qquad A_*=A_{U=1}.                               \tag{15.1}
\]

The endpoint `p^r<=lambda^2` remains inclusive.  The lower digamma bound and
`cos(rt log p)<=1` show that

\[
 \boxed{\|v_{\lambda,U}\|_\infty=A_U,
        \qquad0<\rho_\infty\leq A_U\leq A_*}       \tag{15.2}
\]

uniformly for `0<=U<=1`.  Equality in the first formula occurs at `t=0`.
The same bound gives the compact envelope

\[
 v_{\lambda,U}(t)
 \leq\left[A_*-{1\over2}\log(1+4t^2)\right]_+.   \tag{15.3}
\]

Consequently, if

\[
 M_1=\int_{\mathbb R}|t|v_{\lambda,U}(t){dt\over2\pi},
\]

then direct integration of (15.3) gives the fully finite estimate

\[
 \boxed{
 M_1\leq{e^{2A_*}-2A_*-1\over16\pi}.}             \tag{15.4}
\]

For the uniform near-zero mass, define

\[
 C_{\rm arch}(\lambda)
 =\operatorname {Re}\psi\!\left({1\over4}
        +{i\over4\log\lambda}\right)-\log\pi,    \tag{15.5}
\]

\[
 B_*=\left[1-C_{\rm arch}(\lambda)
              +2\cos(1)\Sigma_\lambda\right]_+,
 \qquad
 J_*={(1-\sin1)B_*\over2\pi L}.                  \tag{15.6}
\]

For `|t|<=1/L`, every prime phase satisfies
`|rt log p|=|t log(p^r)|<=1`; the exact near-zero check therefore proves

\[
 J_0(U)\geq J_*                                    \tag{15.7}
\]

for all admitted `U`.

Let `d(u)=k_v(u)-k_v(L-u)`.  Equations (13.8)--(13.9) give
`d(0)=2J_0`, while (15.4) gives `|d'(u)|<=2M_1`.  The endpoint value must
therefore persist on an explicit interval at both ends of `[0,L]`.  Inserting
those two intervals into (13.9) yields

\[
 \boxed{
 \rho_\infty\geq
 \min\left\{{LJ_*\over4},
 {4\pi J_*^2\over e^{2A_*}-2A_*-1}\right\}.}      \tag{15.8}
\]

There is no unspecified finite constant in (15.8).  The locked annular
rescaling lemma at `x=0` gives

\[
 \Sigma_\lambda=2\lambda+o(\lambda),
 \qquad A_*=(4+o(1))\lambda,
 \qquad B_*=(4\cos1+o(1))\lambda.                 \tag{15.9}
\]

Thus, uniformly for `0<=U<=1`, the current source information proves only

\[
 \boxed{
 \exp\{-(8+o(1))\lambda\}
 \leq\rho_\infty\leq(4+o(1))\lambda.}            \tag{15.10}
\]

The lower side of (15.10) is honest but far below
`c_N=tau-ell_*/2 in [1/2,3/4]`.

### 15.1 The actual central PNT lobe

The weak lower bound is not caused by the central source geometry.  Keeping
the continuous main term and signed discrepancy combined, put

\[
 \Psi(y)=y+E(y),\qquad
 f_{\lambda,x}(y)=y^{-1/2}
       \cos\!\left({x\log y\over L}\right).
\]

For fixed `X`,

\[
 |f'_{\lambda,x}(y)|
 \leq\left({1\over2}+{X\over L}\right)y^{-3/2}
 \qquad(|x|\leq X).
\]

Thus `E(y)=o(y)` and Stieltjes integration by parts give, uniformly on the
compact `x`-interval,

\[
 \sup_{|x|\leq X}\left|
 \int_{1^-}^{\lambda^2}f_{\lambda,x}(y)\,dE(y)
 \right|=o_X(\lambda),
\]

while

\[
 \int_1^{\lambda^2}f_{\lambda,x}(y)\,dy
 =\operatorname {Re}{\lambda e^{ix}-1\over1/2+ix/L}.
\]

The doubled prime block divided by `lambda` therefore tends uniformly to
`4*cos(x)`.  The archimedean and live-shift terms are `o(lambda)` uniformly,
and positive part is `1`-Lipschitz.  Hence, for each fixed `X`,

\[
 \boxed{
 \sup_{\substack{|x|\leq X\\0\leq U\leq1}}
 \left|{v_{\lambda,U}(x/L)\over\lambda}
       -4(\cos x)_+\right|\longrightarrow0.}       \tag{15.11}
\]

Restrict the actual symbol to its central interval
`|t|<=pi/(2L)` and denote the corresponding quantities by a subscript `c`.
Set

\[
 j={2\over\pi}-{1\over2},
 \qquad
 \kappa(y)={4\cos(\pi y/2)\over\pi(1-y^2)},       \tag{15.12}
\]

where the value at `y=1` is removable, and define the positive exact
constant

\[
 \boxed{
 R_c={1\over4j}\int_0^1
 \{\kappa(y)-\kappa(1-y)\}^2dy
 =0.0471233973017\ldots .}                         \tag{15.13}
\]

Equation (15.11), after the changes of variables `x=Lt` and `y=u/L`, gives

\[
 \boxed{
 J_{0,c}\sim{\lambda\over L}j,
 \qquad
 c_c\sim{\lambda Lj\over\pi^2},
 \qquad
 \rho_c\sim R_c\lambda}                           \tag{15.14}
\]

uniformly in the admitted shift.  Thus the actual central prime lobe by
itself eventually exceeds every fixed selected threshold.

### 15.2 Exact outer-interference term

The central conclusion does not pass monotonically to the full positive
symbol.  Write `v=v_c+v_o`, and let `r_c,r_o` and `c_c,c_o` be their boundary
vectors and feature energies.  Use the zero-energy convention

\[
 \rho_\alpha=
 \begin{cases}
  \|r_\alpha\|^2/c_\alpha,&c_\alpha>0,\\
  0,&c_\alpha=0,
 \end{cases}
 \qquad \alpha\in\{c,o\}.
\]

The feature bound
`||r_alpha||^2<=||v_alpha||_infty*c_alpha` forces `r_alpha=0` in the
zero-energy case, so `rho_alpha*c_alpha=||r_alpha||^2` always.  Linearity
gives the exact identity

\[
 \boxed{
 \rho_\infty(c_c+c_o)
 =\rho_c c_c+\rho_o c_o
   +2\operatorname {Re}\langle r_c,r_o\rangle.}   \tag{15.15}
\]

The covariance can be negative.  Since `rho_o<=A_*`, the orientation-free
lower bound is only

\[
 \boxed{
 \rho_\infty\geq
 {\left[\sqrt{\rho_c c_c}-\sqrt{A_*c_o}\right]_+^2
       \over c_c+c_o}.}                            \tag{15.16}
\]

The pinned global envelope permits `c_o` to be exponentially larger than
the central scale and gives no sign for the covariance in (15.15).
Therefore (15.14) does not prove the required full quotient inequality.

The phase-volume audit explains why ordinary PNT does not supply the missing
orientation.  It controls the arithmetic cutoff variable in the signed
discrepancy, whereas (15.15) requires uniform finite-height estimates for
the thresholded prime polynomial and its low-frequency transforms

\[
 k_v(s)=\int v(t)e^{ist}{dt\over2\pi},
 \qquad0\leq s\leq L,                              \tag{15.17}
\]

including the resonant frequencies `s=log n`.  Uniformity in `U` also
requires level-set or transversality control across an interval of
thresholds.  Scalar phase volume contains neither datum.

For comparison, the exact infinite-time law is large rather than
negligible.  If

\[
 S_\lambda(t)=\sum_{p^r\leq\lambda^2}
 {\log p\over p^{r/2}}\cos(rt\log p),              \tag{15.18}
\]

unique ergodicity of the finite prime torus gives

\[
 \begin{aligned}
 \lim_{T\to\infty}{1\over T}\int_0^T e^{2S_\lambda(t)}dt
 =\prod_{p\leq\lambda^2}{1\over2\pi}
   \int_0^{2\pi}
   \exp\left(2\sum_{r\leq R_p}
       {\log p\over p^{r/2}}\cos(r\theta)\right)d\theta,
 \end{aligned}                                     \tag{15.19}
\]

Here `R_p=max{r:p^r<=lambda^2}`.  The logarithm of (15.19) is
`(1/2+o(1))L^2`.  For completeness, set

\[
 a_{p,r}={\log p\over p^{r/2}},\qquad
 X_p(\theta)=\sum_{r\leq R_p}a_{p,r}\cos(r\theta),\qquad
 b_p={\log p\over\sqrt p-1}.
\]

Normalized Haar expectation satisfies
`E X_p=0` and `2 E X_p^2=sum_(r<=R_p) a_(p,r)^2`.  Taylor's theorem and
`|X_p|<=b_p` give the explicit summable estimate

\[
 \left|\log\mathbb E e^{2X_p}
 -\sum_{r\leq R_p}a_{p,r}^2\right|
 \leq {4\over3}e^{2b_p}b_p^3+2e^{4b_p}b_p^4.
\]

Therefore, with the finite constant defined by the convergent positive
series

\[
 C_{\rm cum}:=\sum_p\left{
 {4\over3}e^{2b_p}b_p^3+2e^{4b_p}b_p^4\right}<\infty,
\]

\[
 \left|\log(\text{right side of (15.19)})
 -\sum_{p^r\leq\lambda^2}{(\log p)^2\over p^r}\right|
 \leq C_{\rm cum}.
\]

Finally, PNT partial summation gives

\[
 \sum_{p\leq\lambda^2}{(\log p)^2\over p}
 ={1\over2}L^2+o(L^2),
 \qquad
 \sum_p\sum_{r\geq2}{(\log p)^2\over p^r}<\infty,
\]

which proves the stated logarithmic asymptotic.  This is an
infinite-time statement at each fixed parameter, not a uniform orbit theorem
before the natural finite support cutoff.  It cannot be substituted into
(15.15).

### 15.3 Narrow-band obstruction

Even peak height of the correct order cannot replace the missing outer-band
orientation.  Fix

\[
\xi_j={(2j+1)\pi\over L},\qquad j\in\mathbb Z_{\geq0},
\]

and take two disjoint symmetric bands of height `A` and half-width `delta`
centered at `+-xi_j`.  Their mass at each center with respect to
`dt/(2*pi)` is

\[
 \mu={A\delta\over\pi}.
\]

Put `sinc(z)=sin(z)/z`, with `sinc(0)=1`.  Direct substitution gives the
finite-band formulas

\[
 \begin{aligned}
 k_\delta(s)&=2\mu\cos(\xi_js)\operatorname{sinc}(\delta s),\\
 c_\delta&={\mu L^2\over\pi^2}
       \{1+\operatorname{sinc}(L\delta)\},\\
 \|r_\delta\|^2&={\mu^2L^2\over\pi^2}
   \int_0^L\cos^2(\xi_ju)
   \{\operatorname{sinc}(\delta u)
      +\operatorname{sinc}(\delta(L-u))\}^2du.
                                                               \tag{15.20}
 \end{aligned}
\]

Consequently, as `delta*L -> 0`, with `mu` fixed,

\[
 \boxed{
 \begin{aligned}
 c_\delta&={2\mu L^2\over\pi^2}
             \{1+O((\delta L)^2)\},\\
 \|r_\delta\|^2&={2\mu^2L^3\over\pi^2}
             \{1+O((\delta L)^2)\},\\
 \rho_\delta&=\mu L\{1+O((\delta L)^2)\}
 ={A\delta L\over\pi}\{1+O((\delta L)^2)\}.
 \end{aligned}}                                  \tag{15.21}
\]

Thus nonnegative even symbols with height `A` of order `lambda` can have
arbitrarily small leverage when their excursion widths are small.  Bands at
distinct half-integer centers give exactly orthogonal boundary directions
on `[0,L]` only in the atomic limit; finite rectangular bands are
asymptotically orthogonal as the largest `delta*L` tends to zero.  Thus
adding many sufficiently narrow bands does not restore a generic lower
bound.  This is a structural band model, not the arithmetic source symbol.

### 15.4 Exact prime-log recurrence normal form

The actual outer problem has a useful exact conditionally-negative-definite
form.  From the locked multiplier, with the prime-power endpoint still
inclusive,

\[
 \boxed{
 \begin{aligned}
 \phi_\lambda(t)
 :={}&m_\lambda(t)-m_\lambda(0)\\
 ={}&\Phi_{\rm arch}(t)
 +2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
           \{1-\cos(t\log n)\},
 \end{aligned}}                                    \tag{15.22}
\]

where

\[
 \Phi_{\rm arch}(t)
 =\operatorname {Re}\psi\!\left({1\over4}+{it\over2}\right)
       -\psi(1/4)
 =\int_0^\infty {e^{-s/4}\{1-\cos(ts/2)\}
                    \over1-e^{-s}}\,ds.            \tag{15.23}
\]

Every term in (15.22)--(15.23) is nonnegative and conditionally negative
definite.  Therefore

\[
 \boxed{
 v_{\lambda,U}(t)=\{A_U-\phi_\lambda(t)\}_+,
 \qquad A_U=1+U-m_\lambda(0).}                     \tag{15.24}
\]

This identity preserves the source minus sign: subtracting the multiplier
turns each prime atom into the displayed positive recurrence deficit.  It
shows precisely what a successful outer estimate must use.  The total prime
mass and the archimedean envelope do not determine the quotient; the
finite-height recurrence geometry of the exact atom locations `log n` does.
Conditional negative definiteness alone supplies no covariance sign.

### Theorem 15.1 (actual source frontier)

The pinned source inputs together with the derivation above prove the
explicit finite lower bound (15.8), the uniform bracket (15.10), and the
central asymptotic (15.14).  These do not sign the
full boundary-leverage excess.  A sufficient new input must control the
outer energy and signed covariance in (15.15), or equivalently the
low-frequency transforms in (15.17), uniformly over the live shift.  The
current PNT, support, phase-volume, and peak-height bounds do not provide
that finite-height orientation.

## 16. Growing actual multi-lobe core

The fixed central interval in (15.14) leaves a constant-factor amount of
source information unused.  Ordinary PNT control extends to a growing
number of the actual prime lobes, provided their rescaled width remains
`o(L)`.  This produces a larger proved core quotient.  It still does not
orient the covariance with the rest of the source symbol.

Let `M=M(lambda)` be an even integer schedule satisfying

\[
 M\longrightarrow\infty,
 \qquad {M\over L}\longrightarrow0,               \tag{16.1}
\]

and define the restricted actual symbol

\[
 v_M(t)=v_{\lambda,U}(t)\mathbf1_{\{|Lt|\leq\pi M\}},
 \qquad
 w_{\lambda,U}(x)={v_{\lambda,U}(x/L)\over\lambda}.
                                                               \tag{16.2}
\]

The subscript `M` in this section counts retained model periods; it is not
the eigenvalue count in Section 9.  Put

\[
 q(x)=4(\cos x)_+,
 \qquad d={4\over\pi}-1,
 \qquad j={d\over2}={2\over\pi}-{1\over2}.        \tag{16.3}
\]

For `|x|<=pi M`, the derivative in the Stieltjes argument of Section 15.1
obeys the uniform bound

\[
 \left|{d\over dy}
  \left[y^{-1/2}\cos\!\left({x\log y\over L}\right)\right]
 \right|
 \leq\left({1\over2}+{\pi M\over L}\right)y^{-3/2}.
                                                               \tag{16.4}
\]

Writing `Psi(y)=y+E(y)` with `E(y)=o(y)`, split the integration-by-parts
remainder at a fixed `Y`.  The part below `Y` is `O_Y(1)`, uniformly in
`x`, while the part above `Y` is at most `O(epsilon lambda)` once
`|E(y)|<=epsilon y`.  The endpoint term is `o(lambda)`.  Thus the error is
`o(lambda)` uniformly on the growing interval in (16.2).  The continuous
main term is

\[
 \operatorname {Re}{\lambda e^{ix}-1\over1/2+ix/L};
\]

after the source factor two and division by `lambda`, it differs from
`4 cos(x)` by `o(1)+O(M/L)`.  The archimedean and live-shift terms are
`O(1/lambda)` there, and positive part is `1`-Lipschitz.  Consequently

\[
 \boxed{
 \sup_{\substack{|x|\leq\pi M\\0\leq U\leq1}}
 |w_{\lambda,U}(x)-q(x)|\longrightarrow0.}        \tag{16.5}
\]

This is a repository PNT/Stieltjes derivation from the same locked input as
(15.11), not a claim imported from the CCM source.

### 16.1 Periodic model transform

Let

\[
 q_M(x)=q(x)\mathbf1_{\{|x|\leq\pi M\}},
 \qquad
 K_M(y)={1\over2\pi}\int_{-\pi M}^{\pi M}
             q(x)e^{ixy}\,dx.                    \tag{16.6}
\]

With the Fourier convention

\[
 a_n={1\over2\pi}\int_{-\pi}^{\pi}q(x)e^{-inx}\,dx,
\]

direct integration gives

\[
 a_0={4\over\pi},\qquad a_{1}=a_{-1}=1,
 \qquad a_n=O(n^{-2}).                            \tag{16.7}
\]

The interval in (16.6) contains exactly `M` periods, so

\[
 \boxed{K_M(0)-K_M(1)=Md.}                        \tag{16.8}
\]

Absolute summability of the coefficients and evenness of `M` also give,
for `0<y<1`,

\[
 K_M(y)-K_M(1-y)
 ={\sin(\pi My)\over\pi}
 \left\{{d\over y}+{d\over1-y}+h(y)\right\},   \tag{16.9}
\]

where the terms with indices `0,+-1` have been displayed and the remaining
series defines a bounded function `h` on `[0,1]`.  The two endpoint layers
satisfy

\[
 \int_0^1{\sin^2(\pi My)\over\pi^2y^2}\,dy
 ={M\over2}+O(1),                                 \tag{16.10}
\]

and the reflected identity holds at `y=1`.  Their cross term and the terms
containing `h` are `O(log M)`.  Hence

\[
 \boxed{
 I_M:=\int_0^1[K_M(y)-K_M(1-y)]^2dy
 =Md^2+O(\log M).}                                \tag{16.11}
\]

### 16.2 Stable replacement by the actual source

For the actual restricted profile in (16.2), define

\[
 K_{\lambda,U,M}(y)={1\over2\pi}
  \int_{-\pi M}^{\pi M}w_{\lambda,U}(x)e^{ixy}\,dx,
\]

and let `D_(lambda,U,M)` and `I_(lambda,U,M)` be the analogues of the two
left sides in (16.8) and (16.11).  If the supremum in (16.5) is
`epsilon_lambda`, then

\[
 D_{\lambda,U,M}=Md+O(\epsilon_\lambda M).        \tag{16.12}
\]

Plancherel, with the normalization in (16.6), gives

\[
 \left\|\{K_{\lambda,U,M}-K_M\}(y)
       -\{K_{\lambda,U,M}-K_M\}(1-y)
 \right\|_{L^2(0,1)}
 \leq2\epsilon_\lambda\sqrt M.                  \tag{16.13}
\]

Thus no quantitative rate relating `epsilon_lambda` to `M` is needed:
(16.5) and (16.11) imply, uniformly for `0<=U<=1`,

\[
 D_{\lambda,U,M}=Md\{1+o(1)\},
 \qquad
 I_{\lambda,U,M}=Md^2\{1+o(1)\}.                 \tag{16.14}
\]

The exact rescaling

\[
 k_{v_M}(Ly)={\lambda\over L}K_{\lambda,U,M}(y)
\]

in (13.9) now proves

\[
 \boxed{
 \rho_\infty(v_M)\sim j\lambda,
 \qquad
 c_M\sim{\lambda LMj\over\pi^2},
 \qquad
 \|r_M\|^2\sim{\lambda^2LMj^2\over\pi^2}.}     \tag{16.15}
\]

The coefficient `j=0.1366197723...` is almost three times the central-only
coefficient `R_c` in (15.13).  Since `supp(v_M)` is contained in
`[-pi M/L,pi M/L]`, (13.11) further gives

\[
 0\leq\rho_\infty(v_M)-\rho_N(v_M)
 =O\!\left({\lambda M\over N}\right).            \tag{16.16}
\]

In particular, `N/M->infinity` preserves
`rho_N(v_M)~j lambda`.

There is one limited covariance gain inside the same growing PNT regime.
If `M<=M'` are even, the Fourier calculation behind (16.9) gives

\[
 \langle\mathcal Tq_M,\mathcal Tq_{M'}\rangle
 =d^2M+O(\log M'),
 \quad
 (\mathcal Tf)(y)=K_f(y)-K_f(1-y).                \tag{16.17}
\]

For `M'=2M`, (16.5) and (16.13) show that the actual annulus between the
`M`- and `2M`-cores has only `o(M)` covariance with the inner core.  Thus
the immediately adjacent growing family of source lobes cannot cancel the
leading core vector.  This conclusion does not reach the much farther
finite-height recurrence region.

### 16.3 Low-mode cancellation sign

Frequency separation does not protect the individual low boundary
coefficients.  For the periodic model put

\[
 f(x)=q(x)\sin^2(x/2).
\]

This is a nonnegative `2*pi`-periodic function.  For every integer `n>=1`,
partial fractions and the periodic cotangent sum give

\[
 \sum_{k\in\mathbb Z}
 {1\over(x+2\pi k)^2-(2\pi n)^2}=0.               \tag{16.18}
\]

If `n<M/2`, every term omitted from the `M`-period core has positive
denominator.  Multiplying (16.18) by `f`, integrating over one period, and
unfolding therefore yields the strict sign

\[
 \boxed{
 \int_{-\pi M}^{\pi M}
 {q(x)\sin^2(x/2)\over x^2-(2\pi n)^2}\,dx<0.}    \tag{16.19}
\]

The apparent singularities are removable.  Conversely, every contribution
of the actual outer symbol supported on `|x|>pi M` is positive in the same
coefficient, because `x^2-(2*pi*n)^2>0`.  On a sufficiently slow growing
diagonal the actual core inherits the strict model sign from (16.5).
Hence the unknown farther source has exactly the sign capable of cancelling
the protected low-mode coefficients.  It cannot be discarded by a
frequency-separation argument.

### 16.4 Exact failure of the outer-energy shortcut

Write the full symbol as `v=v_M+v_o` and put

\[
 \theta_\lambda={c_o\over c_M}.
\]

Since `A_*/lambda->4`, inserting (16.15) into the orientation-free bound
(15.16) yields, along every schedule on which `theta_lambda` remains
bounded,

\[
 \boxed{
 {\rho_\infty(v)\over\lambda}
 \geq
 {\bigl[\sqrt j-2\sqrt{\theta_\lambda}\bigr]_+^2
       \over1+\theta_\lambda}+o(1).}              \tag{16.20}
\]

Therefore the source-specific estimate

\[
 \limsup_{\lambda\to\infty}\theta_\lambda
 <{j\over4}=0.0341549430\ldots                    \tag{16.21}
\]

would force linear growth of the full quotient.  The present envelope and
phase-volume inputs do not prove (16.21).  In fact, the growing source
asymptotic proves that (16.21) is impossible.  Let

\[
 v_{M,2M}=v_{2M}-v_M.
\]

Feature energy is linear in the nonnegative symbol.  Applying (16.15) at
`M` and `2M` therefore gives

\[
 \boxed{
 {c_{M,2M}\over c_M}
 ={c_{2M}-c_M\over c_M}\longrightarrow1.}         \tag{16.22}
\]

Since `v_o>=v_(M,2M)`, one has
`liminf theta_lambda>=1`, far above `j/4`.  At the same time, (16.17) says
that this equal-energy adjacent annulus has only lower-order signed
covariance with the core.  Thus (15.16) loses the leading effect precisely
because it replaces orientation by energy.  The farther covariance in
(15.15), not an outer-energy smallness estimate, is the irreducible target.

### Theorem 16.1 (proved multi-lobe gain and stopping point)

Equations (16.5)--(16.16) prove, from the inclusive prime-power source and
ordinary PNT alone, that a growing actual multi-lobe core has quotient
`rho_infty~(2/pi-1/2)lambda`, uniformly over the live shift, and that this
asymptotic survives Fourier projection when `N/M->infinity`.  Equation
(16.17) excludes leading cancellation by the immediately adjacent growing
annulus, while (16.22) proves that the same annulus already defeats every
orientation-free outer-energy criterion of the form (16.21).  Passing to
the full source therefore requires a signed finite-height covariance
estimate.  No full sector sign, asymptotic residual--gap estimate, or
determinant convergence follows from this theorem.

## 17. Moving-window scalar closure and leakage obstruction

The explicit lower bound (15.8) can force the scalar excess in (13.5) to be
positive if the auxiliary trace-selected threshold window is allowed to
shrink with `lambda`.  This is a valid finite construction, but it moves in
the wrong direction for the full graph estimate.

Assume first that the finite source evaluation certifies `B_*>0`, and set

\[
 \mathcal R_\lambda=min\left\{{LJ_*\over4},
 {4\pi J_*^2\over e^{2A_*}-2A_*-1}\right\},
 \qquad
 \eta_\lambda=\min\{1,\mathcal R_\lambda\}.        \tag{17.1}
\]

For an interval or ball implementation, `eta_lambda` is to be replaced by
a positive dyadic lower enclosure, within a fixed factor of the right side;
it must not be read through binary64.  Choose the threshold window

\[
 a_\lambda={\eta_\lambda\over8},
 \qquad b_\lambda={\eta_\lambda\over4}.            \tag{17.2}
\]

The support envelope (15.3) and height bound (15.2) give

\[
 \Omega_*={1\over2}\sqrt{e^{2A_*}-1},
 \qquad
 c_v\leq C_\lambda:={L^2A_*\Omega_*\over\pi^3}.   \tag{17.3}
\]

Select `N` so that

\[
 {2\pi(N+1)\over L}\geq2\Omega_*,
 \qquad
 \omega_{\lceil N/2\rceil}
 ={2\pi\lceil N/2\rceil\over L}\geq2\Omega_*,
 \qquad
 N\geq{128C_\lambda\over9L\eta_\lambda}.         \tag{17.4}
\]

Equations (13.11), (15.8), and (17.1) then imply, uniformly for the admitted
live shift,

\[
 \rho_N\geq\rho_\infty-{32C_\lambda\over9LN}
 \geq{3\eta_\lambda\over4}.                       \tag{17.5}
\]

The deterministic longest-gap construction of Section 9 has
`c_N=tau-ell_*/2<=b_lambda`.  Therefore

\[
 \boxed{
 L_{v,N}=c_v(\rho_N-c_N)
 \geq{\eta_\lambda\over2}c_v>0.}                  \tag{17.6}
\]

This is an exact source-specific closure of the scalar sign, not of an odd
sector sign.  The same gap selection gives

\[
 \boxed{
 \ell_*\geq{\eta_\lambda\over
  8\{1+\lfloor8\Theta/\eta_\lambda\rfloor\}},
 \qquad
 \dim\mathcal L_++\dim\mathcal L_-^\sharp
 \leq{8\Theta\over\eta_\lambda}+1,}              \tag{17.7}
\]

and both far floors are at least
`1-b_lambda>=3/4`.  The same `N`, `eta_lambda`, and bounds work for all
`U in [0,1]`; the source-reconstructed midpoint `tau` and its projectors may
depend on `U`.  No common `U`-independent spectral gap is asserted.

The construction is feasible on the locked enormous diagonal.  Equations
(15.9) and (17.1) give `eta_lambda=exp(-O(lambda))`, while the support,
trace, rank, and reciprocal-buffer costs in (17.3)--(17.7) are also only
`exp(O(lambda))`.  The locked cutoff is `exp(Theta(lambda^2))`.

However, (17.6) makes the oriented numerator in the second Sylvester block
large rather than small.  Since `J_0>=J_*`, (11.23)--(11.24) give

\[
 \|P_-^0P_{E_N^-}r_v\|
 \geq{L\over\pi}\sqrt{{\eta_\lambda J_*\over2}}.  \tag{17.8}
\]

Recomputing the explicit high-frequency witness (11.14) with
`tau in [eta_lambda/8,eta_lambda/4]` leaves

\[
 \alpha_C=(1+o(1))\sqrt{N/L},
 \qquad
 \beta_CB_\kappa\sqrt N=\exp(O(\lambda)),          \tag{17.9}
\]

because every new factor `tau^{-1/2}` is only `exp(O(lambda))`.  Inserting
(17.8)--(17.9) into (11.19) yields

\[
 \boxed{
 \nu_2\geq(1+o(1)){\sqrt{NL}\over\pi}
       \sqrt{{\eta_\lambda J_*\over2}}
       -\exp(O(\lambda)).}                         \tag{17.10}
\]

The right side diverges on the locked diagonal.  Independently of the lower
bound in (17.7), the selected gap is contained in the window, so
`ell_*<=b_lambda-a_lambda=eta_lambda/8`; this is the reason the common
buffer shrinks on the locked diagonal.  Thus the moving window rules out a route
that requires `nu_2/ell_*` to tend to zero.  It does not rule out signed
cancellation after harmonic composition or between the two complete
leakage terms in (9.14).

### 17.1 Fixed scalar reserve with identically zero composition

An exact shrinking-window family shows that the large numerator in (17.10)
is not itself a lower bound after harmonic composition.  Let `k>=2`, put
`eta=1/k` and `M=k^2`, and define

\[
 R_+=R_-^0=
 \begin{bmatrix}3/(4k)&0\\0&1/(16k)\end{bmatrix},
 \qquad
 T=\begin{bmatrix}0&M\\1&0\end{bmatrix},
 \qquad p=2e_1.                                    \tag{17.11}
\]

For the window `[1/(8k),1/(4k)]`, there is no spectrum inside.  Hence

\[
 \tau={3\over16k},
 \qquad \ell_*={1\over8k},
 \qquad c_N={1\over8k},                            \tag{17.12}
\]

and both retained projectors equal `|e_1><e_1|`.  Put

\[
 A=\begin{bmatrix}2&k^{-4}\\k^{-4}&1\end{bmatrix},
 \qquad
 B=\begin{bmatrix}2&k^{-2}\\k^{-2}&1\end{bmatrix}.            \tag{17.13}
\]

These have the required source-sign structural decompositions at `g=1`,

\[
 A=I-R_++C_+,
 \qquad B=I-R_-^0+C_--2|p\rangle\langle p|,        \tag{17.14}
\]

where

\[
 C_+=\begin{bmatrix}1+3/(4k)&k^{-4}\\k^{-4}&1/(16k)\end{bmatrix},
 \quad
 C_-=\begin{bmatrix}9+3/(4k)&k^{-2}\\k^{-2}&1/(16k)\end{bmatrix}.             \tag{17.15}
\]

Both matrices in (17.15), as well as `A` and `B`, are positive for `k>=2`;
their determinants are respectively

\[
 {1\over16k}+{3\over64k^2}-{1\over k^8},
 \quad
 {9\over16k}+{3\over64k^2}-{1\over k^4},
 \quad 2-k^{-8},
 \quad 2-k^{-4}.                                  \tag{17.16}
\]

With `Delta=11/(16k)`, the two exact oriented loads are

\[
 \nu_2=M\Delta={11k\over16},
 \qquad
 \nu_1=\Delta={11\over16k},
 \qquad
 {\nu_2\over\ell_*}={11\over2}k^2.               \tag{17.17}
\]

At the same time, the scalar feature can have a fixed positive excess.  Set

\[
 R:=R_+=R_-^0,
 \mathcal A_v=R^{1/2},
 \qquad \zeta=\sqrt{k}\,e_1,
 \qquad r_\partial=\mathcal A_v^*\zeta={\sqrt3\over2}e_1,
 \qquad c_v=k.                                     \tag{17.18}
\]

Then

\[
 \rho_N={3\over4k},
 \qquad
 L_{v,N}=c_v(\rho_N-c_N)={5\over8}
 \geq{\eta c_v\over2}={1\over2}.                 \tag{17.19}
\]

The boundary factorization can also be realized exactly with

\[
 e_\partial=-{11k\over8\sqrt3}e_2,
 \qquad t_\kappa={3\over4k}e_1,
 \qquad d=-{11\over12}e_2.                        \tag{17.20}
\]

Nevertheless, the two harmonic slopes are

\[
 S_{+,\sigma}={k^{-4}\over1+\sigma},
 \qquad
 S_{-,\sigma}={k^{-2}\over1+\sigma},             \tag{17.21}
\]

and the exact composed leakage cancels for every shift:

\[
 \boxed{
 \mathcal L_\sigma
 =-{k^2k^{-4}\over1+\sigma}
   +{k^{-2}\over1+\sigma}=0.}                    \tag{17.22}
\]

Indeed, the two vectors in (14.16) are both
`2e_1/(k^2(1+sigma))`.  Even the Green gate remains uniformly healthy,

\[
 \delta_\sigma=
 { (2+\sigma)(1+\sigma)-k^{-4}\over
   (10+\sigma)(1+\sigma)-k^{-4}}
 \geq{31\over159}.                                \tag{17.23}
\]

This is a finite structural family, not the arithmetic Toeplitz source.
It proves that a fixed scalar boundary reserve, divergent `nu_2/ell_*`,
positive complete-symbol pieces, perfect witness alignment, and a healthy
Green scalar still do not orient the composed leakage.  A source theorem
must control the screened harmonic gain or the signed difference in
(14.36), not merely the numerator size.

### Theorem 17.1 (scope of the moving-window workaround)

For every sufficiently large locked source parameter, and at every finite
parameter where `B_*>0` is certified, (17.1)--(17.4) construct a replayable
auxiliary spectral window for which the scalar boundary-leverage excess is
strictly positive uniformly in `U`.  On the locked diagonal the same choice
forces a growing second oriented numerator and a shrinking common buffer.
It therefore supplies a scalar diagnostic and a no-go result for a
small-`nu_2/ell_*` proof.  The family (17.11)--(17.23) also proves that the
opposite large-numerator strategy has no structural force after harmonic
composition.  No decay toward equation (5.2) follows.

## 18. Exact prime-log recurrence frontier

The CND form (15.22) identifies the information not contained in the
growing-core theorem.  This section makes that distinction sharp in two
directions: a scalar-matched CND surrogate can have a vanishing full
quotient, while an actual-source mean-square estimate removes leading
anti-alignment from a chosen superlinear tail.  The remaining *covariance*
band can be taken finite and polynomial in `lambda`, but is not controlled
by current inputs.  Feature-energy dilution remains uncontrolled all the
way to the exponential support envelope.

### 18.1 Scalar-matched single-atom surrogate

Retain the exact inclusive total mass `Sigma=Sigma_lambda` and the exact
archimedean term (15.23), but replace the individual prime-log atom
locations by one atom at `L`.  Define

\[
 \widetilde\phi_\lambda(t)
 =\Phi_{\rm arch}(t)+2\Sigma\{1-\cos(Lt)\},        \tag{18.1}
\]

\[
 \widetilde v_U(t)
 =\{A_U-\widetilde\phi_\lambda(t)\}_+
 =\{C_U-\Phi_{\rm arch}(t)+2\Sigma\cos(Lt)\}_+,
 \quad
 C_U=1+U-\psi(1/4)+\log\pi.                       \tag{18.2}
\]

This preserves the exact archimedean term, live shift, peak `A_U`, total
prime Levy mass, conditional negative definiteness, and the support
envelope.  Since `Sigma/lambda->2`, it also has the same uniform growing-core
limit `4(cos x)_+` on every `|x|<=pi M=o(L)`.

Put

\[
 T_U=2\pi\exp\{1+U+2\Sigma\},
 \qquad \delta=\log(T_U/t).                        \tag{18.3}
\]

The standard digamma expansion, uniformly in `U in [0,1]`, gives near the
outer edge

\[
 \widetilde v_U(t)
 =\{\delta-2\Sigma(1-\cos Lt)+O(t^{-2})\}_+.      \tag{18.4}
\]

For the local periodic profile define

\[
 g_{\Sigma,\delta}(\theta)
 =\{\delta-2\Sigma(1-\cos\theta)\}_+,
 \qquad
 a_n(\delta)={1\over2\pi}\int_{-\pi}^{\pi}
   g_{\Sigma,\delta}(\theta)e^{-in\theta}\,d\theta,          \tag{18.5}
\]

and

\[
 d_\Sigma(\delta)=a_0(\delta)-a_1(\delta)
 ={1\over2\pi}\int_{-\pi}^{\pi}
  g_{\Sigma,\delta}(\theta)(1-\cos\theta)\,d\theta.         \tag{18.6}
\]

The change `theta=z/sqrt(Sigma)` and dominated convergence give, for every
fixed nonnegative `delta`,

\[
 \boxed{
 \Sigma^{3/2}d_\Sigma(\delta)
 \longrightarrow{\delta^{5/2}\over15\pi}.}        \tag{18.7}
\]

Indeed, the limiting integral is

\[
 {1\over4\pi}\int_{-\sqrt\delta}^{\sqrt\delta}
       (\delta-z^2)z^2\,dz={\delta^{5/2}\over15\pi}.          \tag{18.8}
\]

Here is the required modulation estimate with its cutoff and cross terms
made explicit.  Assume `Sigma>1`, put `D=8 log Sigma`, and choose
`chi in C^1(R)` with

\[
 0\leq\chi\leq1,\qquad
 \chi=1\ \hbox{on }[0,D],\qquad
 \chi=0\ \hbox{on }[D+1,\infty),\qquad
 |\chi'|\leq2.                                    \tag{18.8a}
\]

For `t>0` let `delta(t)=log(T_U/t)` and, on
`T_Ue^{-(D+1)}<t<T_U`, set

\[
 b_n(t)=\chi(\delta(t))a_n(\delta(t)),             \tag{18.8b}
\]

then extend `b_n` evenly and by zero.  These are weakly `H^1`; the zero at
`delta=0` removes the apparent outer-endpoint jump.  Parseval in the
periodic variable gives, for `0<=delta<=D+1`,

\[
 \sum_n|a_n(\delta)|^2
 ={1\over2\pi}\int_{-\pi}^{\pi}g_{\Sigma,\delta}^2
 \leq C{\delta^{5/2}\over\sqrt\Sigma},
 \qquad
 \sum_n|a_n'(\delta)|^2
 ={|\{g_{\Sigma,\delta}>0\}|\over2\pi}
 \leq C\sqrt{\delta\over\Sigma}.                \tag{18.8c}
\]

Here and in the next four estimates `C` is one universal asymptotic
domination constant, independent of `lambda` and `U`; no finite matrix or
source parameter is being defined through it.  Changing variables from
`t` to `delta` in the weak derivatives now proves

\[
 E_{\rm der}:=\sum_n\|b_n'\|_2^2
 \leq {C\Sigma^8(1+D^3)\over T_U}.                \tag{18.8d}
\]

Use the transform
`mathcal F b(s)=(2pi)^(-1)int_R b(t)e^(ist)dt`.  The Fourier expansion of
the smoothly cut edge is

\[
 k_{\rm e}(s)=\sum_{n\in\mathbb Z}
                    \mathcal F b_n(s+nL).         \tag{18.8e}
\]

On `0<=s<=L`, the two leading sidebands are `n=0` and `n=-1`.  Since
`b_(-1)=b_1`, their difference must be combined *before* taking absolute
values.  With `h=b_0-b_1`, integration by parts in every other sideband and
weighted Cauchy--Schwarz give

\[
 \left\|[k_{\rm e}(s)-k_{\rm e}(L-s)]
 -[\mathcal Fh(s)-\mathcal Fh(L-s)]\right\|_{L^2(0,L)}^2
 \leq {C E_{\rm der}\over L^2}.                  \tag{18.8f}
\]

This is a summed bound: the weights
`sum_(|n|>=1)n^(-2)<infinity` are applied before integrating the disjoint
frequency strips.  Plancherel, followed by the same derivative tail bound,
also gives

\[
 \begin{aligned}
 \int_0^L[\mathcal Fh(s)-\mathcal Fh(L-s)]^2ds
  ={1\over\pi}\int_0^\infty h(t)^2dt
  +O\!\left({\|h\|_2\|h'\|_2\over L}
             +{E_{\rm der}\over L^2}\right),\\
 \int_0^\infty h(t)^2dt
  =T_U\int_0^\infty e^{-\delta}d_\Sigma(\delta)^2d\delta
   +O\!\left(T_U\Sigma^{-11}(1+D^5)\right).
                                                               \tag{18.8g}
 \end{aligned}
\]

The first error in (18.8g) is obtained by splitting at `L/2`: one factor
then lies in the derivative-controlled Fourier tail.  Equations
(18.8c)--(18.8d) show that every error in (18.8f)--(18.8g) is
`o(T_U Sigma^(-3))`.

The denominator is averaged separately.  Period-by-period comparison with
the mean of
`g_(Sigma,delta)(theta)(1-cos(theta))`, using its uniform Lipschitz
dependence on `delta`, gives

\[
 k_{\rm e}(0)-k_{\rm e}(L)
 ={T_U\over\pi}\int_0^\infty
       e^{-\delta}d_\Sigma(\delta)d\delta
 +O\!\left({D\over L}
       +T_U\Sigma^{-19/2}(1+D^{5/2})\right).       \tag{18.8h}
\]

The literal sharp cutoff would leave nonzero Fourier envelopes at
`delta=D` and would not justify (18.8d); this is why (18.8a) is part of the
argument.  It remains to compare the edge model with the exact surrogate.
Write `g(t)=g_(Sigma,delta(t))(Lt)`.  On the transition
`D<delta<D+1`, the exact difference is split *before* applying the feature
bound:

\[
 \widetilde v_U-\chi g=(\widetilde v_U-g)+(1-\chi)g.          \tag{18.8i}
\]

The second term is nonnegative.  The first is the signed digamma error, and
positive-part Lipschitz continuity gives it `L^1` norm
`O(Sigma^8/T_U)` over the whole cut edge.  If `epsilon` denotes that error,
the bounded Fourier kernel gives
`sup_s|k_epsilon(s)|<=||epsilon||_1/(2pi)` and hence a boundary-numerator
bound `O(L||epsilon||_1^2)`; its covariance with the edge is therefore
negligible at the displayed scales below.  The possible exact support strip
above `T_U` has width `O(T_U^(-1))` and is negligible by the same argument.

Below `T_Ue^{-(D+1)}` use the nonnegative exact surrogate itself, and on the
transition use the nonnegative term `(1-chi)g` from (18.8i).  Their sum is
supported in `0<t<T_Ue^{-D}`, has height `O(Sigma)`, and has `L^1` norm
`O(T_U Sigma^(-7))`.  Applying the nonnegative-symbol feature inequality to
this sum gives

\[
 D_{\rm int}=O(T_U\Sigma^{-7}),\qquad
 N_{\rm int}=O(T_U\Sigma^{-6}),\qquad
 |N_{\rm cross}|=O(T_U\Sigma^{-9/2}),              \tag{18.8j}
\]

where `D_int` is its contribution to `k(0)-k(L)`, `N_int` is its boundary
numerator, and the last estimate is Cauchy--Schwarz against the edge
numerator.  Thus none of the discarded pieces contributes at either
leading scale.  Consequently, if `widetilde k` is the transform of (18.2),

\[
 \boxed{
 \begin{aligned}
 \widetilde k(0)-\widetilde k(L)
 &\sim {T_U\over\pi}\int_0^\infty
       e^{-\delta}d_\Sigma(\delta)\,d\delta,\\
 \int_0^L\{\widetilde k(s)-\widetilde k(L-s)\}^2ds
 &\sim {T_U\over\pi}\int_0^\infty
       e^{-\delta}d_\Sigma(\delta)^2\,d\delta.
 \end{aligned}}                                    \tag{18.9}
\]

For completeness, the active-arc estimate
`d_Sigma(delta)<<delta^(5/2)Sigma^(-3/2)` for `delta<=Sigma`, together with
the exponential weight beyond that range, supplies the domination needed
to insert (18.7) in (18.9).  Equation (13.9) and the two gamma integrals now
give

\[
 \boxed{
 \widetilde\rho_\infty
 \sim {1\over2}
 {\Gamma(6)\over15\pi\Gamma(7/2)}\Sigma^{-3/2}
 ={32\over15\pi^{3/2}}\Sigma^{-3/2}
 \sim{8\sqrt2\over15\pi^{3/2}}\lambda^{-3/2}.}    \tag{18.10}
\]

This is a structural surrogate, not the arithmetic source.  It does not
preserve the individual prime-log atoms, the fixed-height PNT profile,
the prime-square moment, Haar variance, or finite-orbit correlations.  It
proves precisely that the exact archimedean term, total mass, CND structure,
peak, envelope, and the uniform `M=o(L)` growing-core asymptotic do not
determine the full quotient.

### 18.2 Actual-source very-far covariance

Return to the exact source.  Let

\[
 B={\pi M\over L},
 \qquad
 P_M=\int_0^Bv_{\lambda,U}(t)\,dt,
 \qquad
 W_R=\int_R^\infty {v_{\lambda,U}(s)\over s}\,ds,              \tag{18.11}
\]

and let `r_(>=R)` denote the boundary vector of
`v 1_(|t|>=R)`.  With `a=L/2`, the exact sine representation of (8.3) is

\[
 d_v(a+x)=-{2\over\pi}\int_0^\infty
              v(t)\sin(at)\sin(tx)\,dt,
 \qquad r_v=-{iL\over2\pi}d_v.                    \tag{18.12}
\]

The cross kernel satisfies

\[
 \int_{-a}^a\sin(tx)\sin(sx)\,dx
 ={\sin a(t-s)\over t-s}-{\sin a(t+s)\over t+s}.  \tag{18.13}
\]

For `0<=t<=B` and `s>=R>=2B`, its absolute value is at most `3/s`.
Therefore

\[
 \boxed{
 |\langle r_M,r_{\geq R}\rangle|
 \leq {3L^2\over\pi^4}P_MW_R.}                   \tag{18.14}
\]

The growing-core limit gives, uniformly in the live shift,

\[
 P_M\sim{4\lambda M\over L}.                      \tag{18.15}
\]

To bound `W_R`, write

\[
 H_U(t)=\operatorname {Re}\psi(1/4+it/2)
            -\log\pi-(1+U),
 \qquad v=\{2S_\lambda-H_U\}_+.                  \tag{18.16}
\]

Put

\[
 c_\Gamma=-\psi(1/4)+\log\pi,
 \qquad
 R_0=\exp\{2(c_\Gamma+2-\log2)\}.                 \tag{18.16a}
\]

The explicit two-sided digamma estimate in Lemma 2.1 of
`notes/UNPROJECTED_ODD_NU_SIGN_ATTACK.md` implies, uniformly for
`U in [0,1]`,

\[
 H_U(t)\geq\log(2t)-c_\Gamma-2
            \geq{1\over2}\log t
 \qquad(t\geq R_0).                               \tag{18.16b}
\]

On the positive set and for `t>=R_0`,

\[
 v(t)\leq{S_\lambda(t)^2\over H_U(t)}
       \leq{2S_\lambda(t)^2\over\log t},          \tag{18.17}
\]

because `S^2/H-(2S-H)=(S-H)^2/H`.

Define the exact finite arithmetic quantities

\[
 \begin{aligned}
 A_{2,\Lambda}&=\sum_{1<n\leq\lambda^2}{\Lambda(n)^2\over n},
 &B_{2,\Lambda}&=\sum_{1<n\leq\lambda^2}\Lambda(n)^2,\\
 c_*&={1\over\sqrt2}\log{1\over1-1/\sqrt2},
 &C_{\rm ms}&=\left(1+{\sqrt2\over\log2}\right)B_{2,\Lambda}
 +{8c_*\over\pi\log2}C_\psi^2\lambda^2
 +{\Sigma_\lambda^2\over4\pi\log2}.
                                                               \tag{18.18a}
 \end{aligned}
\]

The constant `C_psi` is the pinned all-range FKS consequence (2.8) in
`notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md`; thus every term in
(18.18a) is source-reconstructed.  The exact finite mean-square theorem
(3.6) in that note gives, for every `Y>0`,

\[
 {1\over2\pi}\int_{-Y}^Y S_\lambda(t)^2\,dt
 \leq {Y A_{2,\Lambda}\over2\pi}+C_{\rm ms},     \tag{18.18}
\]

and its explicit consequences (3.7) give

\[
 A_{2,\Lambda}=O(L^2),
 \qquad C_{\rm ms}=O(\lambda^2L).                 \tag{18.19}
\]

Use the exact support radius from (17.3),

\[
 \Omega_*={1\over2}\sqrt{e^{2A_*}-1}.
\]

For `R>=R_0`, dyadic summation of (18.17)--(18.19) gives the more precise
uniform estimate, where `log^+(x)=max{log(x),0}`,

\[
 \boxed{
 W_R\leq
 4A_{2,\Lambda}\left\{{1\over\log R}
  +{1\over\log2}\log^+{\log(2\Omega_*)\over\log R}\right\}
 +{8\pi C_{\rm ms}\over R\log R}.}               \tag{18.20}
\]

If `R>=Omega_*` the left side is zero and the same statement is understood
with the logarithmic term omitted.  Now let `Y_lambda` be any chosen cutoff
schedule with `Y_lambda/lambda->infinity`.  Since
`log Omega_*=O(lambda)`, (18.20) proves

\[
 W_{Y_\lambda}
 =O(L^3+\lambda^2/Y_\lambda)=o(\lambda).          \tag{18.21}
\]

Combining (16.15), (18.14), (18.15), and (18.21) proves

\[
 \boxed{
 { |\langle r_M,r_{\{|t|\geq Y_\lambda\}}\rangle|
      \over\|r_M\|^2}
 \leq\left({12\over\pi^2j^2}+o(1)\right)
       {W_{Y_\lambda}\over\lambda}
 \longrightarrow0.}                              \tag{18.22}
\]

Thus the actual superlinear recurrence tail cannot anti-align with the
proved core at leading order.  The convenient choice `Y_lambda=lambda L`
recovers the earlier cutoff, but no special status is attached to that
choice.  At `R=C lambda` with fixed `C`, the present input gives only an
`O(lambda)` remainder.  Moreover, (18.22) controls the signed cross term;
it does not bound the far feature energy and therefore does not rule out
denominator dilution of the full quotient.

The adjacent band `B<|t|<2B` is already handled by (16.17).  For any chosen
`Y_lambda/lambda->infinity`, the still-uncontrolled covariance band may be
written

\[
 \boxed{{2\pi M\over L}<|t|<Y_\lambda.}            \tag{18.23}
\]

This is schedule-relative, not an intrinsic exact frontier.  A layer-cake
rewrite is equivalent to the same missing finite-height
excursion-transform estimate.  Independently, feature-energy dilution is
still uncontrolled from this band through the full exponential support.

### Theorem 18.1 (recurrence data that remain indispensable)

The surrogate (18.1)--(18.10) proves that the listed total-mass, peak,
envelope, CND, and growing-core data are compatible with a vanishing full
quotient.  For the actual prime-log inventory, (18.22) removes leading
anti-alignment beyond every chosen superlinear cutoff
`Y_lambda/lambda->infinity`, and (16.17) removes it from the immediately
adjacent growing annulus.  The proof must still control signed covariance in
the schedule-relative intermediate band (18.23), while feature-energy
dilution remains open all the way through the very far tail.  These are
statements about the actual locations `log n`; they are not supplied by
ordinary PNT, the present mean-square estimate, or conditional negative
definiteness.

## 19. FKS-uniform mesoscopic source core

The fixed and `M=o(L)` cores do not use the full uniform range of the
pinned FKS estimate.  On a subexponential physical interval that estimate
still reconstructs the complete source symbol by a slowly modulated
positive cosine.  Keeping the modulation, rather than freezing its height,
gives an exact logarithmic denominator and a finite nonzero boundary
numerator.

Retain the FKS constants

\[
 A=9.22022,\qquad \alpha=0.8476836,
 \qquad \beta={\alpha\over4\sqrt2},\qquad
 T_\lambda=\exp\{\beta\sqrt L\}.                 \tag{19.1}
\]

Put

\[
 w_L(t)=\left[4\operatorname {Re}
              {e^{iLt}\over1+2it}\right]_+ .      \tag{19.2}
\]

The approximation below is uniform in the live shift.  To make the rate
fully explicit, let

\[
 \epsilon_1=A L^{3/2}e^{-\alpha\sqrt L},\qquad
 \epsilon_{1/2}=A(L/2)^{3/2}e^{-\alpha\sqrt{L/2}},
 \qquad q_T=\sqrt{T_\lambda^2+1/4},                \tag{19.3}
\]

and use the all-range `C_psi` in (18.18a).  For
`L/2>=(3/alpha)^2`, Stieltjes partial summation with
`E(y)=psi_C(y)-y`, split at `y=lambda`, gives

\[
 {1\over\lambda}\left|
  \int_{1^-}^{\lambda^2}y^{-1/2+it}\,dE(y)\right|
 \leq {1\over\lambda}+\epsilon_1
 +\sqrt{t^2+1/4}\left{
 {2(C_\psi+1)\over\sqrt\lambda}+2\epsilon_{1/2}\right}.
                                                               \tag{19.4}
\]

Indeed, on `[1,lambda]` use
`|E(y)|<=(C_psi+1)y`; on `[lambda,lambda^2]` the function
`z^3e^(-alpha z)` is decreasing and the FKS relative error is at most
`epsilon_(1/2)`.  The endpoint at `lambda^2` costs `epsilon_1`, and the
lower Stieltjes endpoint costs `1/lambda`.  There is no unspecified finite
constant in (19.4).

Lemma 2.1 of `notes/UNPROJECTED_ODD_NU_SIGN_ATTACK.md` also gives

\[
 |1+U-2\theta'(t)|
 \leq c_\Gamma+6+{1\over2}\log(1+4T_\lambda^2)
 \quad (|t|\leq T_\lambda).                       \tag{19.5}
\]

Positive part is `1`-Lipschitz.  Equations (19.4)--(19.5), including the
lower endpoint in the continuous main term, therefore prove

\[
 \sup_{\substack{|t|\leq T_\lambda\\0\leq U\leq1}}
 \left|{v_{\lambda,U}(t)\over\lambda}-w_L(t)\right|
 \leq\eta_\lambda,                                \tag{19.6}
\]

where one admissible explicit bound is

\[
 \eta_\lambda=
 {c_\Gamma+12+\tfrac12\log(1+4T_\lambda^2)\over\lambda}
 +2\epsilon_1+4q_T\left{
 {C_\psi+1\over\sqrt\lambda}+\epsilon_{1/2}\right}.
                                                               \tag{19.7}
\]

The choice in (19.1) has

\[
 T_\lambda\eta_\lambda\longrightarrow0,
 \qquad \sqrt{T_\lambda}\eta_\lambda\longrightarrow0.       \tag{19.8}
\]

The first limit uses
`2*beta-alpha/sqrt(2)=-alpha/(2*sqrt(2))`; all other terms decay faster.

### 19.1 Exact model denominator and boundary numerator

Write

\[
 A(t)={4\over\sqrt{1+4t^2}},\qquad
 \vartheta(t)=Lt-\arctan(2t),
\]

so that `w_L(t)=A(t)(cos vartheta(t))_+`.  Averaging one fast phase while
retaining the phase lag gives

\[
 \boxed{
 B(T)={2\over\pi}\operatorname {arsinh}(2T)
       -{1\over2}\arctan(2T),}                    \tag{19.9}
\]

and integration by parts in every nonresonant Fourier mode proves,
uniformly for growing `T`,

\[
 \int_{-T}^{T}w_L(t)\sin^2(Lt/2)\,dt=B(T)+O(L^{-1}).           \tag{19.10}
\]

For the numerator, the Fourier coefficients of `(cos theta)_+` are

\[
 a_0={1\over\pi},\quad a_{\pm1}={1\over4},\quad
 a_{\pm2k}={(-1)^{k-1}\over\pi(4k^2-1)},           \tag{19.11}
\]

with all other odd coefficients zero.  The two sidebands that meet
`0<=s<=L` must be subtracted before absolute values.  Their envelope is

\[
 h(t)={4\over\pi\sqrt{1+4t^2}}-{1\over1+2it}.       \tag{19.12}
\]

For the locked transform
`mathcal Fh(s)=(2*pi)^(-1)int h(t)e^(ist)dt`, contour orientation gives

\[
 \mathcal Fh(s)={2\over\pi^2}K_0(|s|/2)
 -{1\over2}e^{-s/2}\mathbf1_{\{s>0\}}.             \tag{19.13}
\]

The one-sided exponential in (19.13) is sign-sensitive.  Using

\[
 \int_0^\infty K_0(x)^2dx={\pi^2\over4},\qquad
 \int_0^\infty e^{-x}K_0(x)dx=1,
\]

gives the exact positive endpoint energy

\[
 \boxed{
 E_0=2\int_0^\infty\{\mathcal Fh(s)\}^2ds
 ={1\over2}-{4\over\pi^2}>0.}                    \tag{19.14}
\]

Here is an explicit endpoint regularization for the sideband argument.  Let
`chi_T(t)=1` for `|t|<=T-1`, let

\[
 \chi_T(t)={1+\cos\{\pi(|t|-T+1)\}\over2}
 \quad(T-1<|t|<T),
\]

and extend it by zero.  Apply the Fourier expansion (19.11) to
`chi_Tw_L`.  The squared `H^1` norms of the carrier-removed envelopes are
summable because
`sum |a_n|<infinity` and `sum n^2|a_n|^2<infinity`.  Integration by parts
in the disjoint nonresonant strips, followed by weighted
Cauchy--Schwarz, therefore makes their combined contribution
`o(1)` in `L^2(0,L)`.  On the two transition intervals the sharp-minus-
tapered symbol has `L^1+L^2=O(T^(-1))`; full-line Plancherel makes its
boundary profile `o(1)`.  Finally truncate (19.12) at `T` and let
`T->infinity`.  Thus

\[
 \int_0^L[d_{w_L\mathbf1_{[-T_\lambda,T_\lambda]}}(s)]^2ds
 \longrightarrow E_0.                              \tag{19.15}
\]

There is no extra `sqrt(L)` loss in replacing the model by the actual
source.  If
`e=(v/lambda-w_L)1_[-T_lambda,T_lambda]`, then the sine representation
(18.12) and full-line Plancherel give

\[
 \int_0^L d_e(s)^2ds
 \leq {2\over\pi}\|e\|_2^2
 \leq {4T_\lambda\eta_\lambda^2\over\pi}=o(1).     \tag{19.16}
\]

Let `v_T=v 1_(|t|<=T_lambda)`.  Equations (19.8)--(19.16) now prove,
uniformly for `0<=U<=1`,

\[
 \boxed{
 \begin{aligned}
 c_T&\sim {\lambda L^2B(T_\lambda)\over2\pi^3},\\
 \|r_T\|^2&\sim{\lambda^2L^2E_0\over4\pi^2},\\
 \rho_\infty(v_T)&\sim {\pi E_0\lambda\over2B(T_\lambda)}
 \sim {\pi^2/8-1\over\beta}{\lambda\over\sqrt L}.
 \end{aligned}}                                      \tag{19.17}
\]

The last coefficient is
`4*sqrt(2)*(pi^2/8-1)/alpha=1.5595558887...`; in particular the
mesoscopic quotient diverges.  If
`2*pi*(N+1)/L>=2T_lambda`, (13.11) gives

\[
 0\leq\rho_\infty(v_T)-\rho_N(v_T)
 \leq {16\lambda L B(T_\lambda)\over9\pi^3N}\{1+o(1)\}.       \tag{19.18}
\]

The support condition already makes the relative loss
`O(B(T_lambda)^2/T_lambda)=o(1)`.

### 19.2 The farther mesoscopic annulus is anti-aligned

The mesoscopic theorem also determines the signed relation with the
original growing core.  Choose the explicit even schedule

\[
 M_\lambda=2\left\lfloor{\sqrt L\over2}\right\rfloor,
 \qquad B_\lambda={\pi M_\lambda\over L}\longrightarrow0,
 \qquad d={4\over\pi}-1=2j.                       \tag{19.19}
\]

The endpoint envelope of the Section 16 core is

\[
 H_B(s)={d\sin(Bs)\over\pi s},\qquad
 N_B=2\int_0^\infty H_B(s)^2ds={d^2B\over\pi}.    \tag{19.20}
\]

Write `H=mathcal Fh` for (19.13).  The combined mesoscopic covariance is

\[
 C_B=2\int_0^\infty H_B(s)H(s)\,ds.               \tag{19.21}
\]

The one-sided term in (19.13) is essential here.  Direct integration gives

\[
 \int_0^\infty H(s)\,ds={2\over\pi}-1.
\]

Since `H in L^1(0,infinity)` and
`|sin(Bs)/s|<=B`, dominated convergence gives

\[
 {C_B\over N_B}\longrightarrow
 {2(2/\pi-1)\over d}=1-{1\over d}.                \tag{19.22}
\]

The actual-source replacements in Sections 16 and 19.1 are stable in the
same boundary-profile norm.  Consequently, uniformly in the live shift,

\[
 \boxed{
 {\langle r_M,r_T\rangle\over\|r_M\|^2}
 \longrightarrow1-{1\over d},
 \qquad
 {\langle r_M,r_T-r_M\rangle\over\|r_M\|^2}
 \longrightarrow-{1\over d}=-{1\over2j}.}         \tag{19.23}
\]

Thus the much farther actual annulus from `B_lambda` to `T_lambda` is
strongly anti-aligned with the original core.  The adjacent-annulus
near-orthogonality (16.17) cannot be iterated across successively larger
scales.  Equation (19.23) is a signed source calculation, not a loss from a
triangle inequality.

### 19.3 Far covariance and the distinct denominator frontier

The same phase average gives

\[
 P_T:=\int_0^{T_\lambda}v(t)dt
 \sim\lambda A(T_\lambda),\qquad
 A(T)={2\over\pi}\operatorname {arsinh}(2T).       \tag{19.24}
\]

Applying the exact cross kernel (18.13) to this larger core shows, for
`Y>=2T_lambda`,

\[
 { |\langle r_T,r_{\{|t|\geq Y\}}\rangle|\over\|r_T\|^2}
 \leq\left\{{12A(T_\lambda)\over\pi^2E_0}+o(1)\right\}
 {W_Y\over\lambda}.                               \tag{19.25}
\]

Together with (18.21), this tends to zero whenever

\[
 {Y\over\lambda\log T_\lambda}\longrightarrow\infty.        \tag{19.26}
\]

This is a covariance theorem, not a denominator theorem.  In fact the
exact positive feature energy satisfies only

\[
 \boxed{
 c_{\geq Y}\leq {L^2\Omega_*\over\pi^3}W_Y,
 \qquad
 c_{[R,2R]}\leq {2L^2R\over\pi^3}(W_R-W_{2R}).}    \tag{19.27}
\]

The factor `R` cannot be discarded for a general nonnegative symbol, and
`Omega_*=exp((4+o(1))*lambda)`.  Thus (19.25) does not control far
denominator dilution.

The mesoscopic numerator does relax the required new input.  Once the
complete complementary covariance is `o(||r_T||^2)`, a fixed positive
full quotient does not require `c_outer=o(c_T)`: because
`||r_T||^2` has scale `lambda^2L^2`, it is enough to control the complete
outer feature energy on that larger scale.  The current mean-square input
still misses it.  Directly from (18.17)--(18.18), put

\[
 M_2(Y)={1\over2\pi}\int_{-Y}^{Y}S_\lambda(t)^2dt.
\]

Then

\[
 c_{[T,Y]}\leq {2L^2\over\pi^2\log T}M_2(Y)
 \leq {L^2YA_{2,\Lambda}\over\pi^3\log T}
 +{2L^2C_{\rm ms}\over\pi^2\log T}.               \tag{19.28}
\]

At `T=T_lambda` and `Y=lambda*L`, (19.28) is only
`O(lambda*L^(9/2)+lambda^2*L^(5/2))`, missing the useful
`lambda^2L^2` scale by `sqrt(L)` in the dominant term.  A shifted
mean-square improvement, a longer source-uniform profile, or a direct
excursion-transform estimate is still required.  No full-symbol reserve is
claimed here.

### Theorem 19.1 (proved mesoscopic gain and stopping point)

The pinned FKS estimate and the inclusive source prime sum prove the
uniform actual-core asymptotics (19.17), including a residual norm of exact
leading scale `lambda^2*L^2*E_0/(4*pi^2)`, and the finite projection loss
(19.18).  The same source calculation proves the nonzero anti-alignment
(19.23), while (19.25)--(19.26) remove covariance only beyond a chosen
superlinear far cutoff.  Neither (19.27) nor the current mean-square bound
(19.28) controls the complete feature denominator on the required scale.
No full quotient, sector sign, graph estimate, or determinant limit follows;
the formal project state remains `P0_INVALIDATED`.

## 20. The complete residual numerator cannot collapse

The covariance left open in Theorem 19.1 can in fact be controlled without
a translated prime-number theorem.  The centered finite mean-square bound
(18.18), applied on a larger symmetric interval, already supplies the
needed estimate.  This closes cancellation of the *residual numerator*;
it does not control the positive feature denominator.

Keep `T=T_lambda` from (19.1), and set

\[
 R=T^2,
 \qquad Y=\lambda L.                               \tag{20.1}
\]

Reapply the finite inequalities (19.4)--(19.5) with `R` in place of `T`,
and denote the resulting right side of (19.7) by `eta_(lambda,R)`.  This is
not an extrapolation of (19.6): it is a fresh use of the same explicit
finite bound.  Since `R=exp(alpha*sqrt(L)/(2*sqrt(2)))`, its slowest term is
`O(L^(3/2)/R)`, and direct inspection of all terms gives

\[
 \eta_{\lambda,R}\longrightarrow0,
 \qquad R\eta_{\lambda,R}^2\longrightarrow0.       \tag{20.2}
\]

Let `v_b=v 1_(T<|t|<R)`.  For `t>=T`, (19.2) satisfies
`w_L(t)^2<=4/t^2`.  Positive-part Lipschitz continuity and (20.2) therefore
give the explicit estimate

\[
 \|v_b\|_{L^2(\mathbb R)}^2
 \leq {16\lambda^2\over T}
       +4\lambda^2R\eta_{\lambda,R}^2=o(\lambda^2).           \tag{20.3}
\]

The same full-line Plancherel calculation as in (19.16) gives

\[
 \|r_b\|^2\leq {L^2\over2\pi^3}\|v_b\|_2^2
 =o(\lambda^2L^2).                                  \tag{20.4}
\]

It remains to control the separated region `|t|>=R`.  Put

\[
 P_\lambda(t)=\operatorname {Re}
 {\lambda e^{iLt}-1\over1/2+it},
 \qquad E_\lambda(t)=S_\lambda(t)-P_\lambda(t).    \tag{20.5}
\]

For every `X>0`, use
`[X,2X] subseteq [-2X,2X]`, (18.18),
`(S-P)^2<=2S^2+2P^2`, and
`|P_lambda(t)|<=(lambda+1)/t`.  This proves the fully finite bound

\[
 \boxed{
 \int_X^{2X}E_\lambda(t)^2dt
 \leq4XA_{2,\Lambda}+4\pi C_{\rm ms}
       +{(\lambda+1)^2\over X}.}                  \tag{20.6}
\]

Thus no translation-invariance assumption has entered.  Cauchy--Schwarz
gives, on one dyadic interval,

\[
 \int_X^{2X}{|E_\lambda(t)|\over t}dt
 \leq\sqrt{2A_{2,\Lambda}}
 +\sqrt{{2\pi C_{\rm ms}\over X}}
 +{\lambda+1\over\sqrt2X}.                        \tag{20.7}
\]

Let `K=ceil(log_2(Y/R))`.  Enlarging the last interval if necessary and
summing (20.7) gives

\[
\begin{aligned}
 D_1(R,Y):={}&\int_R^Y {|E_\lambda(t)|\over t}dt\\
 \leq{}&(K+1)\sqrt{2A_{2,\Lambda}}
 +{\sqrt{2\pi C_{\rm ms}/R}\over1-2^{-1/2}}
 +{\sqrt2(\lambda+1)\over R}\\
 ={}&O\!\left(L^2+\lambda\sqrt{L/R}+\lambda/R\right)
 =o\!\left({\lambda\over\log T}\right).         \tag{20.8}
\end{aligned}
\]

For the kernel remainder, a second weighted integral is needed.  Since
`int_X^(2X)t^(-4)dt=7/(24X^3)`, the same argument gives

\[
\begin{aligned}
 D_2(R,Y):={}&\int_R^Y {|E_\lambda(t)|\over t^2}dt\\
 \leq{}&{2\sqrt{7A_{2,\Lambda}/6}\over R}
 +{\sqrt{7\pi C_{\rm ms}/6}\over
       R^{3/2}(1-2^{-3/2})}
 +{4\sqrt{7/24}(\lambda+1)\over3R^2}\\
 ={}&O\!\left(L/R+\lambda\sqrt L/R^{3/2}
                    +\lambda/R^2\right).          \tag{20.9}
\end{aligned}
\]

Recall `H_U` from (18.16).  For `t>=R` and all sufficiently large
`lambda`, (18.16b) gives `H_U(t)>=0`.  Define

\[
 v_0(t)=[2P_\lambda(t)-H_U(t)]_+.
\]

Then

\[
 |v(t)-v_0(t)|\leq2|E_\lambda(t)|,
 \qquad v_0(t)\leq2|P_\lambda(t)|.                \tag{20.10}
\]

With the signed integral

\[
 I_R=\int_R^\infty {v(t)\sin(Lt)\over t}\,dt,
\]

equations (18.20), (20.8), and (20.10) prove

\[
 |I_R|\leq2D_1(R,Y)+{2(\lambda+1)\over R}+W_Y
 =o\!\left({\lambda\over\log T}\right).          \tag{20.11}
\]

Similarly, (20.9)--(20.10) give

\[
 \int_R^\infty {v(t)\over t^2}dt
 \leq2D_2(R,Y)+{\lambda+1\over R^2}+{W_Y\over Y}. \tag{20.12}
\]

These estimates retain the combined excursion before absolute values in
(20.11); the absolute values are used only on the signed discrepancy error.

For completeness, the exact separated-kernel calculation is recorded next.
Let `a=L/2`, let `f=v 1_[0,T]` and `g=v 1_[R,infinity)`, and put

\[
 A_f=\int_0^T f(t)\sin^2(at)dt,
 \quad P_f=\int_0^T f(t)dt,
 \quad B_f=\int_0^Tt f(t)dt.                     \tag{20.13}
\]

The phase average and (19.8) give

\[
 A_f,P_f=O(\lambda\log T),
 \qquad B_f=O(\lambda T).                         \tag{20.14}
\]

Multiplying (18.13) by the two exterior sine factors gives the identity

\[
 \sin(at)\sin(as)K_a(t,s)
 ={s\sin(Ls)\sin^2(at)-t\sin(Lt)\sin^2(as)
    \over t^2-s^2}.                               \tag{20.15}
\]

Since `s>=R>T`, (20.15) isolates the signed leading term and yields

\[
 \langle r_T,r_{\geq R}\rangle
 =-{L^2\over\pi^4}A_fI_R+\mathcal E_R,            \tag{20.16}
\]

with the explicit remainder bound

\[
 |\mathcal E_R|
 \leq {L^2\over\pi^4(1-T^2/R^2)}
 \left\{
 T^2P_f\int_R^\infty{g(s)\over s^3}ds
 +B_f\int_R^\infty{g(s)\over s^2}ds\right\}.     \tag{20.17}
\]

Use (20.12), `int g/s^3<=(1/R)int g/s^2`, (20.14), and `R=T^2`.
Every term on the right of (20.17) is `o(lambda^2*L^2)`.  Equation
(20.11) gives the same conclusion for the leading term in (20.16).  Hence

\[
 \langle r_T,r_{\geq R}\rangle=o(\lambda^2L^2).   \tag{20.18}
\]

Combining (19.17), (20.4), and (20.18) proves, uniformly for the live shift,

\[
 \langle r_T,r_v\rangle
 =\|r_T\|^2+o(\lambda^2L^2).                      \tag{20.19}
\]

Projecting `r_v` onto the oriented line spanned by `r_T` and using Cauchy--
Schwarz finally gives the complete continuum residual floor

\[
 \boxed{
 \|r_v\|^2\geq
 { |\langle r_T,r_v\rangle|^2\over\|r_T\|^2}
 =\left(E_0+o(1)\right){\lambda^2L^2\over4\pi^2}.}            \tag{20.20}
\]

### Theorem 20.1 (numerator closure, denominator still open)

The inclusive source inventory, explicit FKS remainder, centered finite
mean-square theorem, and exact boundary kernel prove (20.20).  Thus the
complete source residual numerator cannot be cancelled below the
mesoscopic leading scale.  This does not bound
`c_v=L^2J_0/pi^2`; current inputs still permit feature-energy dilution on
the full recurrence support.  Therefore no positive full quotient, shifted
sector sign, graph estimate, equation (5.2), or determinant convergence is
claimed.  The formal project state remains `P0_INVALIDATED`.

## 21. The denominator frontier is near quadratic height

The same centered mean-square estimate used in Section 20 controls more of
the positive feature denominator than (19.28) records.  For denominator
mass one should apply Cauchy--Schwarz before inserting the lower bound for
`H_U`, rather than square the whole excursion.  This removes the apparent
`sqrt(L)` loss throughout a near-quadratic interval.

Retain `P_lambda` and `E_lambda` from (20.5).  Cauchy--Schwarz in (20.6)
gives, for every `X>0`,

\[
 \boxed{
 \int_X^{2X}|E_\lambda(t)|dt
 \leq2X\sqrt{A_{2,\Lambda}}
 +2\sqrt{\pi X C_{\rm ms}}+(\lambda+1).}          \tag{21.1}
\]

For `T<Y`, put `K=ceil(log_2(Y/T))`.  Cover `[T,Y]` by the corresponding
dyadic intervals.  Since their left endpoints have sum at most `2Y` and
the sum of their square roots is at most
`sqrt(2Y)/(sqrt(2)-1)`, (21.1) proves the fully finite estimate

\[
\boxed{
\begin{aligned}
 D_0(T,Y):={}&\int_T^Y|E_\lambda(t)|dt\\
 \leq{}&4Y\sqrt{A_{2,\Lambda}}
 +{2\sqrt{2\pi}\over\sqrt2-1}\sqrt{Y C_{\rm ms}}
 +K(\lambda+1).
                                                               \tag{21.2}
\end{aligned}}
\]

For all sufficiently large `lambda`, one has `T>=R_0`, so (18.16b) and
(20.10) give

\[
 v(t)\leq2|P_\lambda(t)|+2|E_\lambda(t)|
 \qquad(T\leq t\leq Y).                            \tag{21.3}
\]

Moreover, retain the exact quantity
`P_T=int_0^T v(t)dt` from (19.24), and use
`|P_lambda(t)|<=(lambda+1)/t`.  Hence

\[
 \boxed{
 \int_0^Yv(t)dt
 \leq P_T+2D_0(T,Y)
       +2(\lambda+1)\log(Y/T).}                   \tag{21.4}
\]

The first term in (21.4) has the exact asymptotic (19.24), in particular
`P_T=O(lambda*sqrt(L))`.  No finite source constant is hidden in
(21.1)--(21.4).

Choose the concrete cutoff

\[
 \boxed{Y_\lambda={\lambda^2\over L\log L}.}       \tag{21.5}
\]

The pinned consequences (18.19) now turn (21.2)--(21.4) into

\[
 \int_0^{Y_\lambda}v(t)dt
 =O\!\left({\lambda^2\over\sqrt{\log L}}+\lambda L\right)
 =o(\lambda^2),                                    \tag{21.6}
\]

uniformly for `0<=U<=1`.  Since `v` is even and `sin^2<=1`, the exact
feature definition (11.23) gives

\[
 \boxed{
 c_{\{|t|\leq Y_\lambda\}}
 \leq {L^2\over\pi^3}\int_0^{Y_\lambda}v(t)dt
 =O\!\left({\lambda^2L^2\over\sqrt{\log L}}+\lambda L^3\right)
 =o(\lambda^2L^2).}                               \tag{21.7}
\]

Thus all feature dilution below the near-quadratic height (21.5) is lower
order relative to the complete residual floor (20.20).

The remaining statement is now exact and one-sided:

\[
 \boxed{
 \int_{Y_\lambda}^\infty
 v_{\lambda,U}(t)\sin^2(Lt/2)dt=o(\lambda^2)
 \quad\hbox{uniformly in }U.}                     \tag{21.8}
\]

Equation (21.8) would combine with (20.20) and (21.7) to make the full
continuum quotient diverge.  It is not proved.  The support-envelope bound
(19.27) remains exponential there, while another centered mean-square
summation grows with the interval length.  The fixed-parameter Haar law in
`notes/PHASE_VOLUME_SCALE_AUDIT.md` also cannot be substituted: it has no
uniform finite-orbit rate at `Y=Y_lambda` or beyond.

### Theorem 21.1 (near-quadratic denominator closure)

The inclusive source sum, exact continuous main term, and pinned centered
mean-square theorem prove (21.7).  The only denominator mass still capable
of diluting the mesoscopic residual floor lies in the endpoint-weighted
excursion tail (21.8).  No current source lock controls that finite-orbit
large-deviation tail, and no full quotient or downstream sign claim is made.
The formal project state remains `P0_INVALIDATED`.

## 22. Exact high moments and the finite-orbit stopping point

The usual higher-moment repair can also be made fully finite, with no
unrecorded mean-value theorem.  It does not prove (21.8).  This section
records the exact inequality and separates its stopping point from the
fixed-parameter Haar heuristic.

Put `x=lambda^2=exp(L)` and

\[
 D_\lambda(t)=\sum_{1<n\leq x}{\Lambda(n)\over\sqrt n}
                         e^{it\log n},
 \qquad
 A_{2,\Lambda}=\sum_{1<n\leq x}{\Lambda(n)^2\over n}.
                                                               \tag{22.1}
\]

For an integer `k>=1`, write

\[
 D_\lambda(t)^k=\sum_{m\leq x^k}b_k(m)m^{it},
 \qquad A_k=\sum_m|b_k(m)|^2,                                \tag{22.2}
\]

and define `C_0=3+2sqrt(2)`.  Grouping the terms in (22.1) by
their underlying prime gives independent centered variables on the prime
Haar torus,

\[
 Y_p=(\log p)\sum_{1\leq r\leq R_p}p^{-r/2}e^{ir\vartheta_p}.
\]

If `c_p=(log p)sum_(r<=R_p)p^(-r/2)`, then, with
`q=p^(-1/2)`,

\[
 {c_p^2\over\mathbb E|Y_p|^2}
 ={1+q\over1-q}{1-q^{R_p}\over1+q^{R_p}}
 \leq3+2\sqrt2=C_0.                                          \tag{22.3}
\]

Hoeffding's elementary convexity bound applied to every angular projection
therefore gives

\[
 \mathbb E\left|\operatorname {Re}
       (e^{-i\phi}\sum_pY_p)\right|^{2k}
 \leq2^{k+1}k!(C_0A_{2,\Lambda})^k.                          \tag{22.4}
\]

Prime-torus Parseval identifies the left side of (22.2) with
`E|sum_pY_p|^(2k)`.  Averaging (22.4) in `phi` and using
`(2pi)^(-1)int_0^(2pi)cos(phi)^(2k)dphi=binom(2k,k)/4^k`
proves the exact coefficient bound

\[
 \boxed{
 A_k\leq{2^{3k+1}k!\over\binom{2k}{k}}
             (C_0A_{2,\Lambda})^k.}                         \tag{22.5}
\]

This is finite Haar algebra only.  It does not replace the actual orbit by
its Haar distribution.

The logarithmic Hilbert identity (2.5) in
`notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md` yields a particularly simple
mean-value bound for an arbitrary polynomial
`P(t)=sum_(m<=M)b(m)m^(it)`.  The discrete Hilbert-transform norm is `pi`,
so

\[
 |H_{\log}(b)|
 \leq\pi\int_0^1\|m^sb_m\|_2\|m^{1-s}b_m\|_2ds
 \leq\pi M\sum_m|b_m|^2.                                   \tag{22.6}
\]

The exact endpoint expansion on `[X,2X]` consequently gives

\[
 \boxed{
 \int_X^{2X}|D_\lambda(t)|^{2k}dt
 \leq(X+2\pi x^k)A_k.}                                     \tag{22.7}
\]

No asymptotic mean-value theorem is being imported in (22.7).

For `X>=R_0`, set

\[
 h_X=\log(2X)-c_\Gamma-2>0,
 \qquad
 \kappa_k={4^k(2k-1)^{2k-1}\over(2k)^{2k}}.
                                                               \tag{22.8}
\]

The scalar maximization

\[
 [2S-H]_+\leq\kappa_k{|S|^{2k}\over H^{2k-1}}
 \qquad(H>0)                                                 \tag{22.9}
\]

is exact: after putting `z=2S/H`, it is the maximum of
`4^k(z-1)/z^(2k)` on `z>=1`.  Since `H_U(t)>=h_X` on
`X<=|t|<=2X`, `|S_lambda|<=|D_lambda|`, and the integrand is even, define

\[
 J_{0,X}={1\over2\pi}\int_{X\leq|t|\leq2X}
          v_{\lambda,U}(t)\sin^2(Lt/2)dt
\]

and obtain, uniformly for `0<=U<=1`,

\[
 \boxed{
 J_{0,X}\leq{\kappa_k\over\pi h_X^{2k-1}}
                (X+2\pi x^k)A_k.}                           \tag{22.10}
\]

The factor `1/pi` in (22.10) includes both halves of the even integral.
Using
`binom(2k,k)>=4^k/(2sqrt(k))`, `k!<=k^k`, and
`kappa_k<=4^k/(2k)` gives the convenient fully explicit relaxation

\[
 \boxed{
 J_{0,X}\leq{2h_X\over\pi\sqrt k}(X+2\pi x^k)
       \left({8kC_0A_{2,\Lambda}\over h_X^2}\right)^k.}     \tag{22.11}
\]

### 22.1 What the bound does and does not prove

Put `X=x^a`.  From (18.19), `A_(2,Lambda)=O(L^2)`, while
`h_X=aL+O(1)`.  The logarithm of the right side of (22.11) has the form

\[
 \max\{a,k\}L+k\log(Ck/a^2)+O(\log(aL)+k),                 \tag{22.12}
\]

with a source-explicit absolute `C`.  For fixed `a>1`, every `k<=a` is
fixed and (22.11) retains the block-length factor `x^a`; taking `k>a`
introduces the still larger off-diagonal length `x^k`.  Thus this bound
chain does not certify an `o(x)` estimate even on one fixed block above
`x`.  At the frontier `a=1-o(1)`, `k=1` gives only `O(xL)`, while
`k>=2` introduces `x^2`.

For growing `a`, the relaxed expression (22.12) is minimized at
`k` of order `a` and gives

\[
 \log J_{0,X}\leq a\{L-\log a+O(1)\}.                      \tag{22.13}
\]

The exact support satisfies
`a<=log(Omega_*)/L=(4+o(1))*lambda/L`; hence the best upper bound furnished
by (22.11) at the top of that range is still on the scale
`exp((2+o(1))*lambda)`, enormously larger than `x=exp(L)`.  This is a
stopping result for the particular chain (22.5), (22.7), and (22.9).  It is
not a lower bound for the actual tail and not an impossibility theorem for
a source-specific one-sided method.

The fixed-parameter Haar law in `notes/PHASE_VOLUME_SCALE_AUDIT.md` is
consistent with a much larger tail: on `X=lambda^A` it predicts positive
excursion mass of order
`lambda^A*log(lambda)*E(2Z-A)_+`, with `Z` standard normal.  That statement
has no uniform finite-orbit rate and remains a diagnostic heuristic only.
It cannot be used either to prove or to disprove (21.8).

### Theorem 22.1 (audited high-moment stopping theorem)

Equations (22.5), (22.7), and (22.10) are exact finite source bounds.  Their
explicit relaxation (22.11) does not extend the denominator closure beyond
the cutoff in (21.5).  Within this continuum-quotient route, the missing
input remains a one-sided, carrier-weighted finite-orbit estimate for
(21.8), already on blocks of height comparable to `x`.  Section 23 gives a
different finite-compression bypass; (22.11) itself yields no full quotient,
sector sign, graph estimate, equation (5.2), or determinant convergence.
The formal project state remains `P0_INVALIDATED`.

## 23. The far excursion tail is invisible to a subquadratic compression

The global denominator condition (21.8) is sufficient for the continuum
quotient, but it is not necessary for the finite bridge.  A Fourier cutoff
well below the frontier (21.5) sees the far positive-part symbol only
through inverse powers of its height.  This section gives the exact bounds
and a local replacement for the full quotient.  Retain the same conditional
live-shift range `0<=U<=1`.  The earlier proof that the live upper shift is
admitted uses the locked exponential schedule; this section does not yet
transfer that shift theorem to the new subquadratic schedule.

Retain

\[
 Y={\lambda^2\over L\log L},\qquad
 N=\lceil\lambda L^3\rceil,\qquad
 \omega_n={2\pi n\over L},\qquad
 S_2(N)={N(N+1)(2N+1)\over6},                    \tag{23.1}
\]

and split

\[
 v=v_{\rm in}+w,\qquad
 w=v\,1_{\{|t|\geq Y\}},\qquad
 W_Y=\int_Y^\infty {v(t)\over t}dt.              \tag{23.2}
\]

Equations (18.20) and (21.5) give `W_Y=O(L^3)`, uniformly for
`0<=U<=1`.  Moreover,

\[
 {2\omega_N\over Y}
 \leq {4\pi(\lambda L^3+1)\log L\over\lambda^2}
 \longrightarrow0,                               \tag{23.3}
\]

so `Y>=2omega_N` eventually.

### 23.1 Exact compression tails

Let `T_(w,N,+)` and `T_(w,N,-)` be the even and odd Fourier compressions of
the zero-extension concentration operator with symbol `w`.  With
`a=L/2`, the exact centered transforms, up to harmless unit phases, are

\[
 \begin{aligned}
 |\widehat e_0(t)|
  &={2|\sin(at)|\over\sqrt L\,|t|},\\
 |\widehat e_n^+(t)|
  &=2\sqrt{2\over L}{|t\sin(at)|\over|t^2-\omega_n^2|},\\
 |\widehat e_n^-(t)|
  &=2\sqrt{2\over L}{\omega_n|\sin(at)|\over|t^2-\omega_n^2|}.
                                                               \tag{23.4}
 \end{aligned}
\]

For `|t|>=Y>=2omega_N`, one has
`t^2-omega_n^2>=3t^2/4`.  The diagonal parity reproducing kernels therefore
satisfy

\[
 K_+(t,t)\leq{4+(128/9)N\over Lt^2},
 \qquad
 K_-(t,t)\leq{128\sum_{n=1}^N\omega_n^2\over9Lt^4}.          \tag{23.5}
\]

A positive compression has norm at most its trace.  Since both `v` and
`w` are even and the feature measure is `dt/(2pi)`, (23.5) gives the fully
finite estimates

\[
 \boxed{
 \begin{aligned}
 \epsilon_+&:=\|T_{w,N,+}\|
 \leq {\{4+(128/9)N\}W_Y\over\pi L Y},\\
 \epsilon_-&:=\|T_{w,N,-}\|
 \leq {512\pi S_2(N)W_Y\over9L^3Y^3}.
 \end{aligned}}                                               \tag{23.6}
\]

The boundary vector has an equally explicit tail.  In the notation of
(13.2),

\[
 |J_n(w)|\leq {4W_Y\over3\pi Y},
\]

and (13.4) yields

\[
 \boxed{
 B_{\rm out}^2:=\|P_{E_N^-}r_w\|^2
 \leq {512S_2(N)W_Y^2\over9\pi^2LY^2}.}           \tag{23.7}
\]

On the schedule (23.1), these bounds are

\[
 \begin{aligned}
 \epsilon_+&=O\!\left({L^6\log L\over\lambda}\right)
              =o(\lambda^{-1/2}),\\
 \epsilon_-&=O\!\left({L^{12}(\log L)^3\over\lambda^3}\right),\\
 B_{\rm out}&=O\!\left(\lambda^{-1/2}L^8\log L\right)
              =o(\lambda L).                     \tag{23.8}
 \end{aligned}
\]

No unweighted integral of `w`, support-envelope factor, or form of (21.8)
enters (23.6)--(23.8).

### 23.2 A local spectral replacement for the full quotient

On `E_N^-`, let

\[
 G_{\rm in}=\mathcal A_{v_{\rm in},N}^*
                 \mathcal A_{v_{\rm in},N},
 \quad G=G_{\rm in}+G_{\rm out},
 \quad b_{\rm in}=P_{E_N^-}r_{v_{\rm in}},
 \quad b_{\rm out}=P_{E_N^-}r_w,
 \quad b=b_{\rm in}+b_{\rm out},                 \tag{23.9}
\]

and put `c_in=||zeta_(v_in)||^2`.  For `tau>=0`, define
`P_tau=1_[tau,infinity)(G)` and `F=I-P_tau`.  Positivity gives
`G_in<=G` and `FGF<=tau F`, whence

\[
 \|Fb_{\rm in}\|
 \leq\|\mathcal A_{v_{\rm in},N}F\|\sqrt{c_{\rm in}}
 \leq\sqrt{\tau c_{\rm in}},
 \qquad
 \|Fb\|\leq\sqrt{\tau c_{\rm in}}+B_{\rm out}.
\]

Orthogonal Cauchy--Schwarz in
`Ran(P_tau)\mathbin{\oplus}Ran(F)` now proves, for every nonzero
`z in E_N^-`,

\[
 \boxed{
 \|P_\tau b\|^2\geq
 \left[
 { |\langle z,b\rangle|^2\over\|z\|^2}
 -\left(\sqrt{\tau c_{\rm in}}+B_{\rm out}\right)^2
 \right]_+.}                                                \tag{23.10}
\]

This inequality differs essentially from (13.15): the uncontrolled feature
energy of `w` has been replaced by its small compressed boundary norm.

Take `z=P_Nr_T`, with the mesoscopic source core from Section 19.  If
`Q_N=I-P_N`, then exactly

\[
 \langle z,b\rangle
 =\langle r_T,r_{\rm in}\rangle
  -\langle Q_Nr_T,r_{\rm in}\rangle
  +\langle z,P_Nr_w\rangle.                       \tag{23.11}
\]

Equations (20.19) and (19.25), together with
`A(T_lambda)=O(sqrt(L))` and `W_Y=O(L^3)`, give

\[
 \langle r_T,r_{\rm in}\rangle
 =\|r_T\|^2+o(\lambda^2L^2).                     \tag{23.12}
\]

The projection estimate (13.11) applied to the mesoscopic core and (19.17)
give

\[
 \delta_T:=\|Q_Nr_T\|
 \leq\sqrt{32\over9LN}\,c_T=O(\sqrt{\lambda L}).             \tag{23.13}
\]

The generic upper quotient and (21.7) give

\[
 \|r_{\rm in}\|^2\leq A_*c_{\rm in},
 \qquad
 c_{\rm in}
 =O\!\left({\lambda^2L^2\over\sqrt{\log L}}+\lambda L^3\right)
 =o(\lambda^2L^2).                               \tag{23.14}
\]

Thus the middle error in (23.11) is `o(lambda^2L^2)`.  The final error is
at most `||z||B_out=o(lambda^2L^2)`.  Consequently

\[
 \langle z,b\rangle=\|r_T\|^2+o(\lambda^2L^2),
 \qquad
 \|z\|=\|r_T\|(1+o(1)).                          \tag{23.15}
\]

For `tau` in any fixed bounded interval, (19.17), (23.8), (23.10), and
(23.14)--(23.15) prove, uniformly in the live shift,

\[
 \boxed{
 \|P_\tau P_{E_N^-}r_v\|^2
 \geq\left(E_0+o(1)\right){\lambda^2L^2\over4\pi^2},
 \qquad E_0={1\over2}-{4\over\pi^2}.}             \tag{23.16}
\]

Equation (23.16) is a retained odd boundary-commutator floor.  It can make
the raw second graph load larger; by itself it is not a small-leakage or
state-closeness estimate.

### 23.3 Exact transfer to a truncated shifted solve

The same tail estimates give a direct perturbative reduction of the even
shifted complement.  Retain every positive-feature and pole term, but
truncate the negative feature `v` at `Y`.  On the even complement of the
normalized state, write the full and truncated systems as

\[
 A=A_0-E,
 \qquad c=c_0-e,
 \qquad
 E=P_{\mathcal K}T_{w,N,+}P_{\mathcal K},
 \qquad e=P_{\mathcal K}T_{w,N,+}\kappa.          \tag{23.17}
\]

Then `||E||,||e||<=epsilon_+`.  If

\[
 A_0\succeq\gamma I,\qquad \gamma>\epsilon_+,
 \qquad z_0=A_0^{-1}c_0,                          \tag{23.18}
\]

one has `A>= (gamma-epsilon_+)I` and the exact residual identity

\[
 c-Az_0=Ez_0-e.
\]

It follows that

\[
 \boxed{
 \|A^{-1}c-z_0\|
 \leq{\epsilon_+(1+\|z_0\|)\over\gamma-\epsilon_+},
 \qquad
 \|A^{-1}c\|
 \leq\|z_0\|+{\epsilon_+(1+\|z_0\|)\over
                         \gamma-\epsilon_+}.}     \tag{23.19}
\]

The full even and odd sector floors are likewise at least their truncated
floors minus `epsilon_+` and `epsilon_-`, respectively.  The projection
estimate (5.4) in `DIRECT_RH_ATTACK.md` remains
`O(lambda^(-1/2))` on (23.1), since its Fourier term is
`O(1/(lambda*L^2))`.

Therefore (21.8) is unnecessary for the finite bridge if one proves,
uniformly in the live shift, positive truncated sector floors and

\[
 \|z_0\|=O(\lambda^{-1/2}),
 \qquad
 {\epsilon_+(1+\|z_0\|)\over\gamma-\epsilon_+}
       =O(\lambda^{-1/2}).                         \tag{23.20}
\]

Fixed positive truncated floors would make this perturbative estimate
sufficient, but Section 25 below proves that a fixed odd floor is
incompatible with the critical-line branch.  None of these finite-height
signed statements is currently proved by (23.16).  For the only viable
case, a shrinking floor `gamma_lambda`, the transfer requires
`epsilon_+=o(gamma_lambda)` in addition to the action rate.  Equations
(23.6)--(23.8) do not compare the tail with the exponentially small defect
scales occurring in older prolate-floor routes.

Indeed, with the notation of the second graph load, the exact rank-two
difference obeys only

\[
 \left\||r\rangle\langle e|-|d\rangle\langle t|\right\|
 \geq\max\left\{
  \operatorname {dist}(r,\mathbb C d)\|e\|,
  \|r\|\operatorname {dist}(e,\mathbb C t)
 \right\}.                                       \tag{23.21}
\]

Equation (23.16) controls `||r||`, not either angle in (23.21).  The exact
all-shift family in Section 14.2 shows that scalar floors and arbitrarily
large loads do not prevent cancellation after the harmonic lifts.

### 23.4 Schedule compatibility and its missing shift theorem

The exact projection estimate (5.4) of `DIRECT_RH_ATTACK.md` applies for
every `N`; on (23.1) its Fourier term is `O(1/(lambda*L^2))`, so the complete
projection error remains `O(lambda^(-1/2))`.  The projected-state norm,
origin, critical-height anchor, parity, commutator, determinant-size,
`omega_(N+1)>=2T_lambda`, and `Y>=2omega_N` conditions also hold eventually.
No finite source determinant or inversion theorem intrinsically requires a
quadratic or exponential cutoff.

However, the currently proved admission `U_Z=o(d_6)`, and hence the
eventual live range `0<=U<=1`, uses hybrid projection estimates on the
locked exponential schedule.  The quadratic/exponential hypotheses in the
older prolate-coframe, zero-sampling, and mixed-prefix routes are
route-specific and cannot be imported at (23.1).  Thus the new schedule is
structurally admissible, but its live upper shift remains a separate signed
source obligation.

### Theorem 23.1 (finite-compression tail bypass)

On the explicit schedule (23.1), the complete feature tail beyond (21.5)
has operator norms (23.6) and boundary norm (23.7), all tending to zero at
the rates (23.8), uniformly conditional on `0<=U<=1`.  The actual
mesoscopic covariance survives projection and gives the retained floor
(23.16).  The full shifted solve transfers from the truncated system by
(23.19).  Thus the unresolved global condition (21.8) is not required for
this finite-matrix route.  The remaining obligations are to admit the live
shift on (23.1), prove a finite-height signed truncated floor/solve, and
control a source-specific angle or screened-feature cancellation.  No graph
estimate, equation (5.2), or determinant convergence is claimed.  The
formal project state remains `P0_INVALIDATED`.

## 24. The truncated problem is a signed weighted-PNT gate

Section 23 removes the very-far positive feature.  It does not make the
remaining finite-height sector positive.  The first odd Fourier mode already
identifies the missing signed arithmetic datum.

To avoid collision with the geometric constant in (18.18a), write

\[
 c_{\rm nf}:=\psi(1/4)-\log\pi+4<0.              \tag{24.1}
\]

The exact weighted-PNT normal form is

\[
 Q_\lambda=c_{\rm nf}I+A_{\rm tail}-T_D,
 \qquad
 T_D=\int_{[0,L]}K_h\,dD_\lambda(h),             \tag{24.2}
\]

where

\[
 D_\lambda(h)=
 \sum_{1<n\leq e^h}{\Lambda(n)\over\sqrt n}
       -2(e^{h/2}-1).                             \tag{24.3}
\]

### 24.1 The exact first-odd-mode gate

Use the real representative
`e_1^-(x)=sqrt(2/L)sin(2pi*x/L)`.  Direct zero-extension overlap gives, for
`0<=h<=L`,

\[
 \begin{aligned}
 q_1^-(h)&:=\langle e_1^-,K_he_1^-\rangle\\
 &=2(1-h/L)\cos(2\pi h/L)+{1\over\pi}\sin(2\pi h/L),\\
 (q_1^-)'(h)&=-{4\pi\over L}(1-h/L)\sin(2\pi h/L).
                                                               \tag{24.4}
 \end{aligned}
\]

Since `D_lambda(0)=0` and `q_1^-(L)=0`, Stieltjes integration by parts has
no endpoint remainder and proves

\[
 \boxed{
 M_1(\lambda):=\langle e_1^-,T_De_1^-\rangle
 ={4\pi\over L}\int_0^L
 D_\lambda(h)(1-h/L)\sin(2\pi h/L)dh.}           \tag{24.5}
\]

Equivalently, with the endpoint inventory still inclusive,

\[
 \boxed{
 \begin{aligned}
 M_1(\lambda)={}&
 \sum_{p^r\leq\lambda^2}{\log p\over p^{r/2}}
                 q_1^-(r\log p)\\
 &-\int_0^Le^{h/2}q_1^-(h)dh.
 \end{aligned}}                                                \tag{24.6}
\]

An atom at `p^r=lambda^2` has `q_1^-(L)=0`, but it is not omitted from
(24.6).

The zero extension of `e_1^-` lies in `H_0^1(I)`.  The translation
difference inequality, together with

\[
 \int_{\mathbb R}h^2\nu_{\rm tail}(dh)
 ={1\over2}\zeta(3,5/4),
 \qquad \|(e_1^-)'\|^2={4\pi^2\over L^2},
\]

gives the exact finite bound

\[
 \boxed{
 0\leq\langle e_1^-,A_{\rm tail}e_1^-\rangle
 \leq{\pi^2\zeta(3,5/4)\over L^2}.}              \tag{24.7}
\]

The odd operator with only the far negative feature removed is

\[
 B_{0,-}=(Q_\lambda-U I)|_{E_N^-}+T_{w,N,-}.
\]

Therefore a floor `B_(0,-)>=gamma_lambda I` necessarily implies

\[
 \boxed{
 M_1(\lambda)
 \leq c_{\rm nf}-U-\gamma_\lambda
 +{\pi^2\zeta(3,5/4)\over L^2}+\epsilon_-.}       \tag{24.8}
\]

For `U>=0` and a fixed positive `gamma_lambda=gamma`, the right side is a
strictly negative constant for all sufficiently large `lambda`.  No fixed
floor is asserted here.  If `gamma_lambda` shrinks, (24.8) instead requires
the corresponding asymptotic precision relative to `c_nf`; the pinned FKS
magnitude estimate, centered mean square, and Sections 19--23 do not supply
that precision or sign.

This is not an artifact of the estimate.  In the continuous-main model
`D_lambda=0`, the first odd expectation is
`c_nf-U+O(L^(-2))<0`.  Its negative feature vanishes above `Y` eventually:
the continuous source transform is at most `(lambda+1)/t=o(1)` there, while
the archimedean term grows.  Thus the truncation does not repair the sign.

Conversely, for fixed `A>0`, put

\[
 D_A(h)=-A\sin(2\pi h/L).                          \tag{24.9}
\]

Then `D_A(0)=D_A(L)=0`, the gate value is exactly `-pi*A`, and the continuous
source density `e^(h/2)dh+dD_A(h)` remains nonnegative when `L>2pi*A`.
Its fixed `O(A)` Fourier perturbation is also dominated beyond `Y`.
Consequently
`A>(U-c_nf+gamma_lambda)/pi` is a sufficient first-mode sign reversal for large
`L`.  These are logical continuous-source models, not replacements for the
actual prime-power inventory.  They prove that magnitude bounds and endpoint
values alone cannot supply (24.8).

### 24.2 Exact full-floor and shifted-action obligations

On the complete odd compression, a floor `gamma` is equivalent to

\[
 \boxed{
 (T_D)_{N,-}\preceq(A_{\rm tail})_{N,-}+T_{w,N,-}
       +(c_{\rm nf}-U-\gamma)I.}                  \tag{24.10}
\]

On the even anchor complement `mathcal K`, the corresponding condition is

\[
 \boxed{
 P_{\mathcal K}T_DP_{\mathcal K}
 \preceq P_{\mathcal K}(A_{\rm tail}+T_w)P_{\mathcal K}
       +(c_{\rm nf}-U-\gamma)P_{\mathcal K}.}     \tag{24.11}
\]

The scalar disappears from the cross column.  For the truncated solve,

\[
 c_0=P_{\mathcal K}(A_{\rm tail}-T_D+T_w)\kappa,  \tag{24.12}
\]

and, for every unit `f perpendicular kappa`,

\[
 \boxed{
 \begin{aligned}
 \langle f,c_0\rangle={}&
 \mathfrak a_{\rm tail}(f,\kappa)
 +\int_0^LD_\lambda(h)q'_{f,\kappa}(h)dh\\
 &+\langle f,T_w\kappa\rangle.
 \end{aligned}}                                                \tag{24.13}
\]

Thus, after a floor `gamma` is proved, the cancellation-preserving estimate

\[
 \sup_{\substack{f\perp\kappa\\\|f\|=1}}
 \left|\mathfrak a_{\rm tail}(f,\kappa)
       +\int_0^LD_\lambda(h)q'_{f,\kappa}(h)dh\right|
 =O(\gamma\lambda^{-1/2})                         \tag{24.14}
\]

would, with (23.8), give `||z_0||=O(lambda^(-1/2))`.  No current source
estimate proves either (24.10)--(24.11) or (24.14).

Floors alone cannot replace (24.14).  In an exact two-dimensional even
model take `kappa=e_0`, `U=0`,

\[
 R=\begin{pmatrix}2&0\\0&1\end{pmatrix},
 \qquad
 C_s=\begin{pmatrix}1&s\\s&1\end{pmatrix}\succeq0,
 \qquad
 B_s=I+C_s-R=\begin{pmatrix}0&s\\s&1\end{pmatrix}.          \tag{24.15}
\]

For `|s|<=1/2`, the anchor-complement floor is exactly `1`, the cross column
is `s e_1`, and the shifted solve has norm `|s|`.  The even ground is
`(1-sqrt(1+4s^2))/2<0`, so `U=0` is an admissible upper shift; an independent
odd block `[1]` supplies a strict odd comparison.  Shifting instead by the
exact even ground `u_s` changes the solve only to `|s|/(1-u_s)`.  Both `R`
and `C_s` have positive Gram realizations in orthogonal feature targets.
Fixed sector floors and complete negative-feature data therefore do not
force the needed action decay.

### 24.3 The remaining projective-angle scalar

Write the truncated odd boundary and derivative coefficients as

\[
 q_n={2\sqrt{2L}\,\omega_n\over\pi}J_n(v_{\rm in}),
 \qquad a_n=n\kappa_n,
 \qquad P=1_{[\tau,\infty)}(G).                   \tag{24.16}
\]

Then the exact projective distance entering (23.21) is

\[
 \boxed{
 \operatorname {dist}(Pq,\mathbb C Pa)^2
 =q^*Pq-{ |q^*Pa|^2\over a^*Pa},}                \tag{24.17}
\]

with value `||Pq||^2` when `Pa=0`.  Since
`q=mathcal A_(v_in,N)^*zeta_(v_in)`, the unresolved mixed scalar is

\[
 q^*Pa=\langle\zeta_{v_{\rm in}},
              \mathcal A_{v_{\rm in},N}Pa\rangle.           \tag{24.18}
\]

Section 23 proves the first term in (24.17) has the mesoscopic floor.  It
does not give a strict nonsaturation bound for (24.18).  Raw spatial
separation does not survive the spectral projection: in two dimensions,
`b=e_1`, `d=e_1+M e_2`, and `P=|e_1><e_1|` make `b` and `d` asymptotically
orthogonal before projection but exactly collinear afterward.

There is also no feature-space Cauchy transfer from (23.16) to the harmonic
screen in (14.7)--(14.11).  The former uses the negative feature
`v=[g+U-m]_+`, while the latter uses
`a=[m-(g+U)]_+` and the pole; their continuous feature measures satisfy
`a(t)v(t)=0`.  A successful bridge must retain the signed identity
`a-v=m-(g+U)` after compression or prove a strict source-specific coherence
bound for (24.18) or its even analogue.

### Theorem 24.1 (exact finite-height stopping point)

The necessary first-mode condition is the signed weighted-PNT moment
(24.8).  Section 25 shows that its fixed-gap version cannot be the target;
the full shrinking-floor and action targets are (24.10)--(24.14),
and the remaining graph orientation contains the coherence scalar (24.18).
The continuous-source and finite Gram models prove that magnitude estimates,
endpoint data, scalar floors, and separated feature norms cannot replace
these signed inputs.  The live shift on the subquadratic schedule is also
not yet admitted.  No shifted solve, graph estimate, equation (5.2), or
determinant convergence is claimed.  The formal project state remains
`P0_INVALIDATED`.

## 25. The first odd gate is a critical zero filter

The signed moment in (24.5) has an exact carrier representation.  This
shows that a fixed odd floor is not merely unproved: it is the wrong
asymptotic target for a direct proof of the critical-line statement.

Put

\[
 x=e^L=\lambda^2,\qquad \omega={2\pi\over L},\qquad
 s_-={1\over2}-i\omega,
 \qquad H(s)=-{\zeta'(s)\over\zeta(s)}-{1\over s-1}.       \tag{25.1}
\]

The pole of `-zeta'/zeta` at one is canceled in `H`.  Define the exact
inclusive discrepancies

\[
 \begin{aligned}
 F_0(s;x)&=\sum_{1<n\leq x}{\Lambda(n)\over n^s}
             -\int_1^xy^{-s}dy,\\
 F_1(s;x)&=\sum_{1<n\leq x}{\Lambda(n)\over n^s}
                  \log(x/n)
             -\int_1^xy^{-s}\log(x/y)dy.
 \end{aligned}                                            \tag{25.2}
\]

Since `F_1=L*F_0+partial_s F_0`, direct expansion of (24.4) gives

\[
 \boxed{
 M_1(L)=\operatorname {Re}\left\{
       {2\over L}F_1(s_-;x)-{i\over\pi}F_0(s_-;x)
                         \right\}.}                       \tag{25.3}
\]

The endpoint prime power remains included.  A sharp Perron integral
ordinarily half-weights an atom at `n=x`, but that convention is immaterial
only after the two terms in (25.3) are combined: the `F_1` endpoint weight
is zero and
`Re(-i*x^(-s_-)/pi)=0` because `omega*L=2*pi`.  Thus (25.3), not either
complex summand separately, is the locked endpoint formula.

For a right Perron line, (25.3) becomes

\[
 M_1=\operatorname {Re}{1\over2\pi i}\int
 H(s_-+w)e^{Lw}
 \left({2\over Lw^2}-{i\over\pi w}\right)dw.              \tag{25.4}
\]

Adding the conjugate carrier and putting both contours on the same line
gives the exact averaged kernel

\[
 \begin{aligned}
 \mathcal K_L(z)
 &={1\over2}\left\{
 {2\over L(z+i\omega)^2}-{i\over\pi(z+i\omega)}
 +{2\over L(z-i\omega)^2}+{i\over\pi(z-i\omega)}
 \right\}\\
 &=-{4\omega^2\over L(z^2+\omega^2)^2}.                  \tag{25.5}
 \end{aligned}
\]

The fourth-order decay makes the residue sum absolute.  For all sufficiently
large `L`, so that the carriers do not collide with a zero, contour shifting
therefore gives

\[
 \boxed{
 \begin{aligned}
 M_1(L)={}&\mathcal H_L
 +\operatorname {Re}\sum_\rho
 {4\omega^2e^{(\rho-1/2)L}
  \over L\{(\rho-1/2)^2+\omega^2\}^2}
 +\mathcal T_{\rm triv}(L),\\
 \mathcal H_L={}&\operatorname {Re}\left\{
 (2-i/\pi)H(s_-)+{2\over L}H'(s_-)
 \right\},\\
 \mathcal T_{\rm triv}(L)={}&{4\omega^2\over L}
 \sum_{m\geq1}{e^{-(2m+1/2)L}
  \over\{(2m+1/2)^2+\omega^2\}^2}>0.
 \end{aligned}}                                           \tag{25.6}
\]

The nontrivial zeros in (25.6) are counted with multiplicity.  The sum is
absolutely convergent by the admitted zero-count bound and is real after
conjugate pairing; no zero table or reality assumption is used.  The plus
sign is forced by `res(H,rho)=-m_rho` and the minus sign in (25.5).  As an
independent transform check,

\[
 \int_0^Lq_1^-(h)e^{zh}dh
 =-{2z\over z^2+\omega^2}
 -{4\omega^2\over L}
       {e^{zL}-1\over(z^2+\omega^2)^2},                   \tag{25.7}
\]

with removable values understood at `z=+/-i*omega`.  The center term in
(25.6) supplies the rational part of `-`(25.7), and each zero residue
supplies its exponential part.

### 25.1 The center and the no-right-zero branch

The completed functional equation gives

\[
 H(1/2)={c_{\rm nf}\over2},\qquad
 H''(1/2)=-{1\over4}\zeta(3,5/4).                         \tag{25.8}
\]

For the second identity, the oddness of `xi'/xi` about one half kills its
second derivative there, while
`psi^(2)(z)=-2*zeta(3,z)` and
`zeta(3,1/4)=64+zeta(3,5/4)`.  Taylor expansion at `s_-` has two
order-`L^(-1)` terms,
`-omega*H'(1/2)/pi` and `2*H'(1/2)/L`; they cancel exactly.  Hence

\[
 \boxed{
 \mathcal H_L=c_{\rm nf}
 +{\pi^2\zeta(3,5/4)\over L^2}+O(L^{-3}).}                \tag{25.9}
\]

If there is no zeta zero to the right of the critical line, functional-
equation symmetry places every nontrivial zero on it.  Equation (25.6) and
the zero-count bound then give

\[
 \sum_\rho {4\omega^2e^{(\rho-1/2)L}
  \over L\{(\rho-1/2)^2+\omega^2\}^2}=O(L^{-3}),
 \qquad
 \mathcal T_{\rm triv}=O(e^{-5L/2}L^{-3}),                \tag{25.10}
\]

and therefore

\[
 \boxed{
 M_1(L)=c_{\rm nf}
 +{\pi^2\zeta(3,5/4)\over L^2}+O(L^{-3})
 >c_{\rm nf}\quad\hbox{eventually}.}                     \tag{25.11}
\]

This is a conditional analysis of one side of an exhaustive case split,
not a zero-location assumption used elsewhere.

### 25.2 The right-zero branch and the Landau alternative

There is also a zero-table-free converse obstruction.  Regard the actual
discrepancy in (24.3) as one function `D(h)`, independent of the terminal
length.  For `Re(z)>1/2`, direct Tonelli summation gives

\[
 \mathscr L D(z):=\int_0^\infty D(h)e^{-zh}dh
 ={H(1/2+z)\over z}.                                     \tag{25.12}
\]

Since
`M_1(L)=4*pi*int_0^1 D(Lu)(1-u)sin(2*pi*u)du`, another
Tonelli step gives

\[
 \boxed{
 \mathscr L M_1(z)={4\pi\over z}\int_0^1
 (1-u)\sin(2\pi u)H(1/2+z/u)du.}                         \tag{25.13}
\]

The continued right side is holomorphic near every positive real `z`:
`H` is regular at one, zeta has no real zero in `(0,1)`, and the integrand
is `O(u^2)` at zero.  If there is a right-half zero, choose
`rho=1/2+a`, `Re(a)>0`, radially outermost among the zeros on its ray;
such a choice exists because `Re(a)<1/2` and the zero set is discrete.
If its multiplicity is `m`, the endpoint `u=1` in (25.13) has the
nonremovable local term

\[
 -{8\pi^2m\over a^4}(z-a)^2\log(z-a).                    \tag{25.14}
\]

No farther collinear zero then meets the integration path in its interior.
Closer and noncollinear zeros are analytic at `z=a`, while multiplicities
add with the displayed sign, so (25.14) cannot cancel.

Apply the eventual-nonnegative Mellin/Landau lemma already proved in
`notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md`, after `X=e^L`.  If `M_1`
were eventually bounded above, the nonnegative function `C-M_1` would make
the defining transform in (25.13) absolutely holomorphic throughout
`Re(z)>0`, contradicting (25.14).  Applying the same argument to `C+M_1`
gives

\[
 \boxed{
 \operatorname {Re}\rho>1/2\ \hbox{for some }\rho
 \quad\Longrightarrow\quad
 \limsup_{L\to\infty}M_1(L)=+\infty,
 \quad\liminf_{L\to\infty}M_1(L)=-\infty.}              \tag{25.15}
\]

Combining (25.11) and (25.15) without assuming which branch holds proves

\[
 \boxed{\limsup_{L\to\infty}M_1(L)\geq c_{\rm nf}.}      \tag{25.16}
\]

It also shows that a uniform estimate
`M_1-mathcal H_L=O(L^(-2))` is a critical-line criterion, not an
elementary consequence of the PNT envelope: the no-right-zero branch gives
the stronger `O(L^(-3))`, whereas a right zero makes `M_1` unbounded.  This
is an equivalent reformulation of the open zero-location problem, not its
solution.

### Theorem 25.1 (fixed-floor stopping theorem)

Suppose a fixed `gamma>0`, `U>=0`, and the truncated odd floor in (24.8)
held for every sufficiently large real parameter.  Equations (24.7)--
(24.8) and `epsilon_-=o(1)` would force

\[
 M_1(L)\leq c_{\rm nf}-\gamma+O(L^{-2})+o(1)
          \leq c_{\rm nf}-\gamma/2,                      \tag{25.17}
\]

contradicting (25.16).  More strongly, in the no-right-zero branch (25.11)
rules out a fixed positive floor along every unbounded schedule, even at
`U=0`.  Therefore only a shrinking odd floor can be compatible with the
mathematical target; its scale must be retained in the tail comparison and
shifted solve.  The theorem does not rule out a specially selected
favorable subsequence in the right-zero branch, and it proves no shrinking
floor, solve, graph estimate, or determinant convergence.

## 26. The polynomial schedule does not yet admit the live shift

The missing shift statement in Section 23 can also be stated exactly.  Use
the notation of `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`:

\[
 K=Sk,\qquad p_N=P_NC_\lambda K,\qquad
 R_N=K-p_N,\qquad a_N=\|p_N\|_2,
 \qquad\kappa_N=p_N/a_N.                                 \tag{26.1}
\]

Let `Z` be the paired zero-evaluation map and `||.||_mathfrak Z` its
positive sampling seminorm.  Exact two-sided radicality is the pointwise
identity `ZK=0`.  Consequently

\[
 \boxed{
 ZR_N=-Zp_N,\qquad
 \epsilon_N:=\|R_N\|_{\mathfrak Z}^2
 =\|p_N\|_{\mathfrak Z}^2,\qquad
 U_Z={\epsilon_N\over a_N^2}
 =\|\kappa_N\|_{\mathfrak Z}^2.}                         \tag{26.2}
\]

Thus `U_Z` is exactly a positive normalized sampling energy, not merely a
loose name for a projection remainder.  In contrast, the weighted-PNT
normal form determines the signed scalar

\[
 q_N=\langle\kappa_N,Q\kappa_N\rangle
 =c_{\rm nf}
 +{\mathfrak a_{\rm tail}(p_N,p_N)
       -\langle p_N,T_Dp_N\rangle\over a_N^2}.             \tag{26.3}
\]

Ordinary sequence Cauchy--Schwarz gives only `|q_N|<=U_Z`.  There is no
reverse implication: a signed bilinear zero sum can cancel while its
positive sample-square norm is large.  Hence (26.3) cannot by itself prove
`U_Z<=1`.

### 26.1 What the admitted schedule-free estimates give

Put `ell=log(lambda)=L/2` and retain
`N=ceil(lambda*L^3)`.  For the projection part of `R_N`, the locked
comparison and Fourier estimates give

\[
 \begin{aligned}
 E_N:=\|R_N^{\rm proj}\|_2
 &\leq\delta_\lambda\sqrt{\lambda^3-\lambda}
       +R_h(\lambda)+{C_*\ell\over\pi(N+1)}\\
 &=O(\lambda^{-1/2}),
 \qquad C_*={3003\over500}.                              \tag{26.4}
 \end{aligned}
\]

The last Fourier term is `O(1/(lambda*L^2))`.  The schedule-free variation
calculation, with the already locked
`A_\lambda^{src}=a_4(1+2*sqrt(2)*lambda)=O(lambda)` and
`V_*(lambda)=O(lambda^3)`, gives

\[
 V_N:=\operatorname {TV}_{\mathbb R}(R_N^{\rm proj})
 \leq3A_\lambda^{src}V_*(\lambda)(1+\sqrt{2N})
 =O(\lambda^{9/2}L^{3/2}).                               \tag{26.5}
\]

For directed upper bounds `bar E_N,bar V_N`, set

\[
 X_N=\bar E_N^2=O(\lambda^{-1}),\qquad
 W_N=\bar V_N+{3\over4}\sqrt L\,\bar E_N,
 \qquad
 \bar H_N=\max\{1,W_N^2/X_N\}=O(\lambda^{10}L^3).        \tag{26.6}
\]

The monotone compact-BV sampler then yields the explicit bound

\[
 \begin{aligned}
 \|R_N^{\rm proj}\|_{\mathfrak Z}^2
 \leq{}&192\sqrt e\,\lambda(1+\ell)^2X_N\\
 &\times\left[Z_{\rm finite}+{C_Z\over\pi}
 \{(\pi+1)(\log3+\log\bar H_N)+1\}\right]
 =O(L^3).                                                \tag{26.7}
 \end{aligned}
\]

The hybrid complete-series estimate for the physical outer part is
`||R_N^out||_mathfrak Z^2<=B_hyb(lambda)*d_4=o(1)` and is independent of
`N`.  The positive-norm triangle inequality and
`a_N->a_infinity>0` therefore give only

\[
 \boxed{\epsilon_N=O(L^3),\qquad U_Z=O(L^3).}             \tag{26.8}
\]

This is a limitation of the proved upper bounds, not evidence that the
actual live shift grows.  The absolute-sampling route would close at this
schedule if

\[
 \boxed{
 \lambda L^3E_N^2\longrightarrow0,
 \qquad\hbox{equivalently}\qquad
 E_N=o(\lambda^{-1/2}L^{-3/2}).}                          \tag{26.9}
\]

The present `E_N^2=O(lambda^(-1))` misses (26.9) by exactly `L^3`.  An
equivalent source target is a strip-weighted high-Fourier estimate of order
`o(L^(-3))` or a direct paired-zero sampling theorem.  Moreover, the pinned
`delta_lambda=O(lambda^(-2))` has no effective constant, so (26.4) cannot
silently be promoted to a finite admission threshold.

### 26.2 A weaker signed alternative

The finite bridge does not intrinsically require the particular upper
bound `U_Z`.  Its lower two-vector Ritz value satisfies `u_N<=q_N`.
Therefore the fixed choice `U=1` is admissible if one proves directly

\[
 \boxed{
 q_N\leq1
 \quad\Longleftrightarrow\quad
 \langle p_N,T_Dp_N\rangle
       -\mathfrak a_{\rm tail}(p_N,p_N)
 \geq(c_{\rm nf}-1)a_N^2.}                               \tag{26.10}
\]

This is strictly weaker than `U_Z<=1` and is reconstructible from the
inclusive prime-power inventory.  Present magnitude-only PNT envelopes do
not prove its sign.  A finite interval check would admit only that finite
matrix; an unbounded schedule still requires a uniform signed theorem.

### Theorem 26.1 (live-shift stopping theorem)

On `N=ceil(lambda*L^3)`, exact radicality reduces the normalized remainder
shift to the paired zero-sampling energy (26.2).  The admitted
schedule-free projection and sampling bounds yield only (26.8), not
`0<=U_Z<=1`.  Admission requires either the positive norm improvement
(26.9), with effective data for any finite claim, or the separate signed
Rayleigh inequality (26.10), in which case `U=1` may be used without
asserting `U_Z<=1`.  Neither scalar alternative supplies a shrinking sector
floor, the shifted solve, the projective angle, equation (5.2), or
determinant convergence.  The formal project state remains `P0_INVALIDATED`.

## 27. The odd floor collapses beyond the first mode

The first-mode estimate in Section 25 has an exact positive scale on the
no-right-zero side of that section's case split.  It does not, however,
extend to a sector floor when the number of odd modes grows.  This section
records both facts and compares the resulting upper witnesses with the
far-tail norm envelope.  The zero-location condition below is used only to
audit the target branch; it is not an admitted positivity input.

### 27.1 Exact first-mode tail and conditional zero Gram

Write

\[
 \rho_{\rm tail}(h)={e^{-5h/2}\over1-e^{-2h}},\qquad
 a_1(L)=\langle e_1^-,A_{\rm tail}e_1^-\rangle .
\]

Zero extension and (24.4) give the exact formula

\[
 \boxed{
 a_1(L)=\int_0^L\{2-q_1^-(h)\}\rho_{\rm tail}(h)dh
       +2\int_L^\infty\rho_{\rm tail}(h)dh.}             \tag{27.1}
\]

For every integer `m>=1`,

\[
 \int_0^\infty h^m\rho_{\rm tail}(h)dh
 ={m!\over2^{m+1}}\zeta(m+1,5/4).                        \tag{27.2}
\]

Taylor's theorem on `0<=h/L<=1`, followed by (27.2), is uniform and gives

\[
 \boxed{
 \begin{aligned}
 a_1(L)={}&{\pi^2\zeta(3,5/4)\over L^2}
 -{\pi^2\zeta(4,5/4)\over L^3}
 -{\pi^4\zeta(5,5/4)\over L^4}\\
 &+{2\pi^4\zeta(6,5/4)\over L^5}+O(L^{-6}).
 \end{aligned}}                                          \tag{27.3}
\]

Thus (24.7) has the correct leading constant but discards the signed lower
terms.

Now take the no-right-zero branch of Section 25.  Functional-equation
symmetry then puts every nontrivial zero on the center line.  Let its
ordinates be `gamma`, counted with multiplicity and both signs, and put
`omega=2*pi/L`.  Direct evaluation of the explicit Weil sum, not an
assumption of global positivity, gives

\[
 \boxed{
 q_1(L):=\langle e_1^-,Q_\lambda e_1^-\rangle
 =c_{\rm nf}+a_1(L)-M_1(L)
 =\sum_\rho {4\omega^2\over L}
 {1-\cos(\gamma L)\over(\gamma^2-\omega^2)^2}\geq0.}    \tag{27.4}
\]

The values at a carrier collision are removable.  In fact, (13.3) shows
that each summand is `|widehat(e_1^-)(gamma)|^2`.  If

\[
 S_4(L)=\sum_\rho{1-\cos(\gamma L)\over\gamma^4},
\]

then absolute convergence and the absence of a zero at `gamma=0` imply

\[
 \boxed{q_1(L)={16\pi^2\over L^3}S_4(L)+O(L^{-5}).}       \tag{27.5}
\]

The uniformly convergent almost-periodic sum `S_4` is nonnegative, has
mean `sum_rho gamma^(-4)>0`, but has `liminf_(L->infinity)S_4(L)=0`.
For the last assertion, first make the absolutely convergent zero tail
small and then use simultaneous recurrence for the finitely many remaining
phases.  Consequently `L^(-3)` is the generic first-mode scale, not a
uniform first-mode lower bound.

There is a sharp sign warning.  In the right-zero branch, (25.15) and
`a_1(L)=O(L^(-2))` give `liminf q_1(L)=-infinity`; in the no-right-zero
branch (27.4) gives `q_1(L)>=0`.  Hence eventual nonnegativity of this one
moving Rayleigh quotient is itself equivalent to the critical-line
statement.  It is a reformulation of the missing theorem, not a proof of
the sign.  A quantitative positive lower bound would additionally require
a recurrence-resistant sampling estimate.

### 27.2 An exact multi-mode annihilator

The full odd sector collapses faster.  For `d>=1`, define coefficients in
the locked centered parity basis by

\[
 \beta_{d,n}={2(-1)^{d-n}n\over(d-n)!(d+n)!},\quad
 B_d^2=\sum_{n=1}^d\beta_{d,n}^2
 ={2d^2(4d)!\over(4d-1)(2d)!^4},\quad
 f_d={1\over B_d}\sum_{n=1}^d\beta_{d,n}e_n^-.          \tag{27.6}
\]

These are exact rational quantities.  Residues at `z=+/-n` prove

\[
 \boxed{
 \sum_{n=1}^d{\beta_{d,n}n\over z^2-n^2}
 ={1\over\prod_{m=1}^d(z^2-m^2)}.}                      \tag{27.7}
\]

Equivalently,
`sum_n beta_(d,n)n^(2j+1)=0` for `0<=j<=d-2`, while the value for
`j=d-1` is one.  The endpoint phase `(-1)^n` is already built into the
source basis `V_n`; adding another such sign would make (27.7) false for
the transform convention (13.3).

Put `alpha=2*pi/L`.  Equations (13.3) and (27.7) give

\[
 \widehat f_d(t)={2\sqrt{2/L}\,\alpha^{2d-1}\sin(Lt/2)
 \over B_d\prod_{m=1}^d(t^2-\alpha^2m^2)}.              \tag{27.8}
\]

Thus, in the same no-right-zero branch,

\[
 \boxed{
 \langle f_d,Q_\lambda f_d\rangle
 ={8\alpha^{4d-2}\over LB_d^2}
 \sum_\rho{\sin^2(\gamma L/2)
 \over\prod_{m=1}^d(\gamma^2-\alpha^2m^2)^2}.}          \tag{27.9}
\]

Again every apparent carrier collision is removable.  For each fixed `d`,

\[
 \langle f_d,Q_\lambda f_d\rangle=O_d(L^{-(4d-1)}).     \tag{27.10}
\]

Since `f_d` belongs to `E_N^-` whenever `N>=d`, (27.10) implies, on every
growing schedule, that the least odd Rayleigh quotient is `O_A(L^(-A))`
for every fixed `A`: choose `d` first and then let `L` grow.  Therefore no
fixed inverse-power positive odd-sector floor is compatible with the
no-right-zero target branch.  The rank-one `L^(-3)` leading Gram seen by
the individual fixed modes is successively annihilated by the exact moment
conditions in (27.7).

### 27.3 Growing degree versus the far-tail envelope

The preceding fixed-degree statement is superpolynomial but does not by
itself compare with an exponential tail.  Let

\[
 \gamma_*:=\min_\rho|\gamma|>0,\qquad
 C_4:=\sum_\rho|\gamma|^{-4}<\infty,
\]

still only in the no-right-zero branch.  Fix `0<r<1` and choose

\[
 d=d(L)=\left\lfloor {r\gamma_*L\over2\pi}\right\rfloor .
\]

For all `m<=d` and every zero,

\[
 \gamma^2-\alpha^2m^2
 \geq\gamma^2\{1-r^2(m/d)^2\}.
\]

Consequently (27.9) has the explicit zero-table-free upper bound

\[
 \boxed{
 \langle f_d,Q_\lambda f_d\rangle
 \leq {8C_4\gamma_*^4\alpha^{4d-2}\over LB_d^2}
 {\gamma_*^{-4d}\over P_d(r)^2},\qquad
 P_d(r):=\prod_{m=1}^d\{1-r^2(m/d)^2\}.}                \tag{27.11}
\]

This finite product needs no Gamma-function remainder estimate.  The
function `g_r(x)=log(1-r^2*x^2)` is decreasing on `[0,1]`, so its left and
right Riemann sums give the exact bounds

\[
 dI(r)+\log(1-r^2)\leq\log P_d(r)\leq dI(r),\qquad
 I(r)=\int_0^1g_r(x)dx
 =\log(1-r^2)-2+{2\operatorname {atanh}r\over r}.         \tag{27.11a}
\]

The schedule `N=ceil(lambda*L^3)` contains this `d=O(L)`.  Stirling's
formula in the exact expression (27.6) yields

\[
 \log\langle f_d,Q_\lambda f_d\rangle
 \leq-c(r,\gamma_*)L+O(\log L),                         \tag{27.12}
\]

where

\[
 \boxed{
 c(r,\gamma_*)={r\gamma_*\over2\pi}
 \{4(1-\log r)+2I(r)\}.}                                \tag{27.13}
\]

The derivative of
`r*{4(1-log r)+2I(r)}` is
`2*log((1-r^2)/r^2)`, so the rate in (27.13) is maximized at
`r=1/sqrt(2)`.  At this value the cancellations in `I(r)` give

\[
 \boxed{
 c(1/\sqrt2,\gamma_*)={2\gamma_*\over\pi}
 \operatorname {atanh}(1/\sqrt2).}                     \tag{27.14}
\]

Let

\[
 \mathcal E_-(L)=e^{-3L/2}L^{12}(\log L)^3,
\]

the scale of the proved upper estimate `epsilon_-=O(mathcal E_-)` on the
polynomial schedule.  Equations (27.12)--(27.14) show

\[
 \langle f_d,Q_\lambda f_d\rangle=o(\mathcal E_-(L))    \tag{27.15}
\]

provided

\[
 \boxed{
 \gamma_*>{3\pi\over4\operatorname {atanh}(1/\sqrt2)}
 =2.673320967\ldots .}                                  \tag{27.16}
\]

The decimal in (27.16) is only an evaluation of the displayed exact
constant, not a zero ordinate.  The presently admitted source locks do not
certify the lower bound (27.16).  The finite-height theorem places any zero
with `0<|gamma|<3` on the line but does not, in the locked statement used
here, assert that this interval contains no zero.  In combination with that
theorem, the precise remaining finite check would be a certified proof that
`zeta(1/2+it)` is nonzero for
`0<|t|<=3*pi/(4*atanh(1/sqrt(2)))`; no zero list is needed for such a check,
but no such interval certificate is admitted here.  Thus (27.15) is a
conditional comparison, not a completed tail obstruction.

It is also essential that `mathcal E_-` is an upper-envelope scale, not the
actual value of `epsilon_-`.  If (27.16) were separately certified, then
no norm-transfer argument using only `epsilon_-<=C*mathcal E_-` could prove
an unshifted odd floor larger than that bound, because the minimum is at
most (27.15).  This would not show that the actual positive tail form is
large, nor would it exclude a direct cancellation argument.  For the
shifted truncated form, the exact necessary inequality is

\[
 U+\gamma_L
 \leq\langle f_d,Q_\lambda f_d\rangle
      +\langle f_d,T_{w,N,-}f_d\rangle
 \leq\langle f_d,Q_\lambda f_d\rangle+\epsilon_- .      \tag{27.17}
\]

Finally, the restriction `alpha*d<=r*gamma_*` in (27.11) is substantive.
Once `d` crosses a zero ordinate, factors
`gamma^2-alpha^2m^2` may be arbitrarily small.  The sine in (27.9) removes
an exact collision, but the denominator-only estimate used in (27.11)
loses that cancellation near a collision.  Extending (27.12) through those
resonances requires a stable sine-denominator estimate or a separately
justified interpolating numerator; importing a zero list to design one is
not an admissible proof step.  Below the first ordinate the entire zero
tail is already controlled by `C_4`, so no additional tail hypothesis is
hidden in (27.11).

The Taylor coefficients in (27.3), the norm identity in (27.6), the moment
cancellations, the partial fractions (27.7), the finite-product bounds
(27.11a), and the exact threshold in (27.16) are replayed in
`tests/test_exact_fraction_parity_multiplier_schur.py`.  These identities
sharpen the stopping point: eventual first-mode nonnegativity is equivalent to
the missing zero-location theorem, while a genuine growing-sector floor
must be smaller than every fixed inverse power and may lie below the
currently proved far-tail envelope.  No such floor, shifted solve,
equation (5.2), or determinant convergence is proved.  The formal project
state remains `P0_INVALIDATED`.
