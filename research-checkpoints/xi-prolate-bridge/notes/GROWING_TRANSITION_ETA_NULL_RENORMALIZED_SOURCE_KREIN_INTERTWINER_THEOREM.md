# Growing-transition endpoint-null renormalized source Krein completion and packet intertwiner

## 0. Exact result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad L=2\log\lambda .                 \tag{0.1}
\]

Let `V` be one fixed finite coefficient packet and let `x mapsto f_x` be
its linear source synthesis, bounded into `W^(2,1)([-lambda,lambda])`.
Assume that every source is even, supported on `[-lambda,lambda]`, and
satisfies

\[
 f_x(0)=0,\qquad \int_{\mathbb R}f_x=0,
 \qquad f_x(\lambda)=f_x(-\lambda)=0.                 \tag{0.2}
\]

The last condition is the actual endpoint row `eta=0`; it is not automatic
on the unrestricted transition packet.  Put `H_x=mathcal F_a f_x`.

For the exact ordered prime rows, define

\[
 r_{m,l,n}={m\over ln},\qquad
 \mathcal A'_{m,l,n}=r_{m,l,n}\mathcal A_{m,n},
 \qquad
 \mathcal B'_{m,l,n}=r_{m,l,n}^{-1}\mathcal B_{ln,n}. \tag{0.3}
\]

Here `ln` means the integer product `l*n`.  The gauge (0.3) preserves the
cross-slot involution exactly:

\[
 \boxed{
 \mathsf S(\mathcal A'_{m,l,n},\mathcal B'_{m,l,n})
 =\mathsf S(\mathcal A_{m,n},\mathcal B_{ln,n}).}     \tag{0.4}
\]

Unlike the raw gauge, the full unweighted ordered feature is now a genuine
Hilbert/Krein map.  With all `m,l>=1` and `n>=2`, Sections 2--3 prove

\[
 \boxed{
 \sum_{m,l,n}{\Lambda(n)\over4}
 \left(\|\mathcal A'_{m,l,n}x\|^2
       +\|\mathcal B'_{m,l,n}x\|^2\right)<\infty .} \tag{0.5}
\]

Consequently the finite prime cutoff `R` and finite Fejer cutoff `M`
converge, at each fixed `lambda`, in the renormalized positive Hilbert
norm.  In particular their binding nested limit agrees with the full
feature:

\[
 \boxed{
 T_p x=\lim_{M\to\infty}^{\rm ordered}
          \lim_{R\to\infty}T_{p,M,R}'x,
 \qquad
 Q_p=T_p^*J_pT_p.}                                    \tag{0.6}
\]

This repairs the positive-feature divergence proved for the raw gauge in
the checkpoint-1.13 barrier.  It does not contradict that theorem: the raw
feature is `r=1`, while (0.3) is an unbounded diagonal change of gauge as
the ordered indices escape.

Under (0.2), the inherited `B_0` Abel row is an ordinary convergent row.
The already ordered continuous odd tower is square summable and gives a
second Krein map `T_c`.  Hence

\[
 \boxed{
 T=T_c\oplus T_p,\qquad J=J_c\oplus J_p,
 \qquad T^*JT=Q_X=Z_O^*\Sigma Z_O.}                  \tag{0.7}
\]

On the quotient of `V` by the source-synthesis kernel, `T` is injective.
Because its range is finite dimensional, the Moore--Penrose formula

\[
 \boxed{U_0=Z_OT^\dagger:\mathfrak H_{\rm src}\longrightarrow
 \mathfrak Z}                                        \tag{0.8}
\]

is a bounded, hence closable, packet-level sector-mixing map satisfying

\[
 U_0T=Z_O,
 \qquad
 \langle U_0Tx,\Sigma U_0Ty\rangle
 =\langle Tx,JTy\rangle .                            \tag{0.9}
\]

Equation (0.9) is equality of signed forms on `ran T`.  It is **not** the
operator identity `U_0^*Sigma U_0=J` on the whole source feature space.
The positive pullback is

\[
 G_0=U_0^*U_0=T^{\dagger *}(Z_O^*Z_O)T^\dagger,
 \qquad T^*G_0T=Z_O^*Z_O.                            \tag{0.10}
\]

Thus an explicit packet-level intertwiner exists once the endpoint-null
gauge is used.  Its positive metric is packet-, zero-feature-, and
gauge-dependent.  No uniform bound in growing `lambda`, no canonical
generator-level extension, and no one-sided continuous or prime sign
follows.  In particular, (0.8) does not prove the feature-angle inequality,
the nonresonant prime-frame inequality, a complete central sign, equation
(5.2), a determinant limit, or RH.  The project state remains
`P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_GLOBAL_RADICAL_SECTOR_MIXING_FEATURE_GEOMETRY_BARRIER.md` | `976f9299c4d002db3f0b73f0b4da8cc383480c8b55b7ea5ccdc219d9135fbdc4` |
| `tests/test_growing_transition_global_radical_sector_mixing_feature_geometry_barrier.py` | `61837a5180eac8fe307eca05578315066c39148c9d2dea143c6b1f7628e77b4d` |
| `notes/GROWING_TRANSITION_ODD_LAPLACE_ZETA_HURWITZ_FEATURE_ANGLE_REDUCTION_THEOREM.md` | `aaa5b189075b308f3d0ea0c0908ad36d4d871f4ce6626ff74ed9c730a09a0723` |
| `tests/test_growing_transition_odd_laplace_zeta_hurwitz_feature_angle_reduction_theorem.py` | `1bf0cec43d31d1d0f48899be0615faab108b99e86ef446894a8cdec807329a74` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_RESONANCE_AND_NONRESONANT_FRAME_GATE_THEOREM.md` | `511abdb8dd5e9bfe765e518812f19ab8df351803438c0a731387f3dd8d413460` |
| `tests/test_growing_transition_ordered_prime_resonance_and_nonresonant_frame_gate_theorem.py` | `634ec6af8e27db305c22d305d12bdd650b834d947c8afa9a3d6dbf27120482b8` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |

No zero table, prime-number theorem, short-interval estimate, or numerical
prolate datum is used.

## 2. Endpoint-null Fourier decay and exact row norms

The global `W^(2,1)` hypothesis excludes interior value or derivative
jumps.  The zero extension of `f_x` is continuous at both endpoints.  Two
integrations by parts, with the endpoint derivative jumps against the zero
extension retained, give

\[
 |H_x(y)|\leq C_H(x)(1+|y|)^{-2},                    \tag{2.1}
\]

where one may take `C_H(x)` bounded by an absolute constant times

\[
 \|f_x\|_{L^1}+|f_x'(\lambda-)|+|f_x'(-\lambda+)|
 +\|f_x''\|_{L^1}.                                   \tag{2.2}
\]

Because `V` is finite dimensional, these quantities are uniformly bounded
on its unit sphere at each fixed `lambda`.  No growing-`lambda` uniformity
is asserted.

For

\[
 u_n=\max\{\lambda/n,\lambda^{-1}\},\qquad
 I_n=[u_n,\lambda],                                   \tag{2.3}
\]

the exact ordered rows are

\[
 (\mathcal A_{m,n}x)(u)=(f_x+H_x)(mu),\qquad
 (\mathcal B_{ln,n}x)(u)=H_x(lnu).                   \tag{2.4}
\]

Changing variables, rather than replacing the intervals by a common
formal row, gives

\[
 \boxed{
 \begin{aligned}
 \|\mathcal A_{m,n}x\|^2
 &= {1\over m}\int_{mu_n}^{m\lambda}|f_x(v)+H_x(v)|^2\,dv,\\
 \|\mathcal B_{ln,n}x\|^2
 &= {1\over ln}\int_{lnu_n}^{ln\lambda}|H_x(v)|^2\,dv.
 \end{aligned}}                                      \tag{2.5}
\]

After (0.3), these become

\[
 \begin{aligned}
 \|\mathcal A'_{m,l,n}x\|^2
 &= {m\over l^2n^2}
    \int_{mu_n}^{m\lambda}|f_x(v)+H_x(v)|^2\,dv,\\
 \|\mathcal B'_{m,l,n}x\|^2
 &= {ln\over m^2}
    \int_{lnu_n}^{ln\lambda}|H_x(v)|^2\,dv.
 \end{aligned}                                      \tag{2.6}
\]

The scalar gauge cancels between the two slots, proving (0.4) before any
sum or limit.

## 3. Full unweighted prime Hilbert/Krein completion

Let `mathfrak H_p` be the Hilbert direct sum, over all ordered triples
`m,l>=1`, `n>=2`, of two copies of `L^2(I_n,du)`.  Define

\[
 (T_px)_{m,l,n}
 ={\sqrt{\Lambda(n)}\over2}
   (\mathcal A'_{m,l,n}x,\mathcal B'_{m,l,n}x),
 \qquad
 (J_pF)_{m,l,n}=J_\times F_{m,l,n},                  \tag{3.1}
\]

where

\[
 J_\times=\begin{pmatrix}0&1\\1&0\end{pmatrix}.
                                                               \tag{3.2}
\]

We now prove `T_p` is bounded at each fixed `lambda`.  Split the first
slot into its compact-source and Fourier-tail pieces.  If `2<=n<=A`, the
compact part is absent for `m>n`; if `n>A`, it is absent for `m>A`.
Using (2.6), `Lambda(n)<=log n`, and the elementary tail sums gives

\[
 \begin{aligned}
 \sum_{m,l,n}\Lambda(n)\|\mathcal A'_{m,l,n}f_x\|^2
 &\leq C\|f_x\|_2^2\left\{
 \sum_{n\leq A}\Lambda(n)
 +A^2\sum_{n>A}{\Lambda(n)\over n^2}\right\}\\
 &=O(A\log A)\|f_x\|_2^2.
 \end{aligned}                                      \tag{3.3}
\]

For the Fourier part, use

\[
 \int_a^\infty(1+v)^{-4}\,dv\ll(1+a)^{-3},
 \qquad
 \sum_{m\geq1}{m\over(1+mu)^3}\ll u^{-2}.          \tag{3.4}
\]

The two ranges of `u_n` then give

\[
 \begin{aligned}
 \sum_{m,l,n}\Lambda(n)\|\mathcal A'_{m,l,n}H_x\|^2
 &\leq CC_H(x)^2\left\{
 \lambda^{-2}\sum_{n\leq A}\Lambda(n)
 +\lambda^2\sum_{n>A}{\Lambda(n)\over n^2}\right\}\\
 &=O(C_H(x)^2\log A).
 \end{aligned}                                      \tag{3.5}
\]

For the second slot, the lower endpoint is `l*lambda` when `n<=A` and
`ln/lambda` when `n>A`.  Equations (2.1) and (2.6) yield

\[
 \begin{aligned}
 \sum_{m,l,n}\Lambda(n)\|\mathcal B'_{m,l,n}x\|^2
 &\leq CC_H(x)^2\left\{
 \lambda^{-3}\sum_{n\leq A}n\Lambda(n)
 +\lambda^3\sum_{n>A}{\Lambda(n)\over n^2}\right\}\\
 &=O(C_H(x)^2\lambda\log A).
 \end{aligned}                                      \tag{3.6}
\]

The hidden constants in (3.3)--(3.6) are absolute apart from harmless
`zeta(2)` factors; `C_H(x)` itself is source- and `lambda`-dependent.
These estimates prove (0.5).

For finite cutoffs, insert the factor

\[
 \sqrt{\omega_M(m)\omega_M(l)}\,
 \mathbf1_{\{n\leq R\}}                              \tag{3.7}
\]

in (3.1).  Since `0<=omega_M<=1` and `omega_M(k)->1` at each fixed
integer, (0.5) is a dominating square-summable family.  Hilbert-space
dominated convergence proves (0.6), even jointly at fixed `lambda`; we
retain the binding `R`-then-ordered-`M` notation.

Finally, (0.4) and (3.1)--(3.2) give

\[
 \boxed{
 T_p^*J_pT_p={1\over4}\sum_{m,l,n}\Lambda(n)
 \mathsf S(\mathcal A_{m,n},\mathcal B_{ln,n})=Q_p.} \tag{3.8}
\]

Deleting the atoms with `(m,l)=(1,1)`, or separating `ln=m`, is an
orthogonal coordinate restriction of this artificial source feature.
It does not assign a sign to the remaining nonresonant cross.

## 4. Continuous tower and the `B_0` row

Under the three source nulls in (0.2), global `W^(2,1)` regularity and
(2.1) make the inherited row `mathcal B_0` ordinary; this is also the
regularity used by the exact endpoint-null continuation theorem.  Define

\[
 \begin{aligned}
 T_cx&=(\mathcal A_0x,\mathcal B_0x)
 \oplus\bigoplus_{\nu\geq1}
 (\mathcal A_{2\nu+1}x,\mathcal B_{2\nu+1}x),\\
 J_c&=-J_\times\oplus\bigoplus_{\nu\geq1}J_\times.
 \end{aligned}                                      \tag{4.1}
\]

The ordered complete profiles are bounded and integrable on their
respective half-lines.  Their Laplace rows are `O_x((1+z)^(-1))` for
`z=3,5,...`; hence

\[
 \|T_cx\|^2
 =\|\mathcal A_0x\|^2+\|\mathcal B_0x\|^2
 +\sum_{\nu\geq1}
  \{\|\mathcal A_{2\nu+1}x\|^2
    +\|\mathcal B_{2\nu+1}x\|^2\}<\infty .         \tag{4.2}
\]

This construction is made after the binding ordered Fejer limit.  It does
not exchange the odd-row sum with a growing-`lambda` limit.  The frozen
common-representative identity gives

\[
 \boxed{T_c^*J_cT_c
 =-\mathsf S(\mathcal A_0,\mathcal B_0)
 +\sum_{\nu\geq1}\mathsf S(
   \mathcal A_{2\nu+1},\mathcal B_{2\nu+1})
 =Q_{\rm cont}.}                                     \tag{4.3}
\]

Combining (3.8) and (4.3), in the physical order of limits, proves (0.7).

## 5. Injectivity and the exact packet-level intertwiner

Suppose `T_px=0`.  The coordinate `(m,l,n)=(1,1,2)` gives

\[
 H_x(2u)=0\quad\hbox{for a.e. }u\in[\lambda/2,\lambda].
                                                               \tag{5.1}
\]

The Fourier transform of a compactly supported `L^1` function is entire.
Thus (5.1) implies `H_x=0` identically and hence `f_x=0`.  Therefore

\[
 \ker T=\ker(x\mapsto f_x)\subseteq\ker Z_O.          \tag{5.2}
\]

Pass to `V_0=V/ker T`.  The range of `T:V_0->mathfrak H_src` is closed
because `V_0` is finite dimensional.  Its Moore--Penrose inverse is bounded
and satisfies `T^dagger T=I_(V_0)`.  Formula (0.8) is therefore a genuine
bounded operator on the whole source Hilbert space (zero on the ordinary
Hilbert orthogonal complement selected by `T^dagger`).  Equations
(0.7)--(0.8) give

\[
 \begin{aligned}
 U_0Tx&=Z_Ox,\\
 \langle U_0Tx,\Sigma U_0Ty\rangle
 &=x^*Z_O^*\Sigma Z_Oy
 =x^*T^*JTy
 =\langle Tx,JTy\rangle.
 \end{aligned}                                      \tag{5.3}
\]

This proves (0.9).  Let `P_c,P_p` denote the orthogonal source-sector
projections.  The positive Gram blocks of this particular extension are

\[
 \boxed{
 G_{st}=P_sT^{\dagger *}(Z_O^*Z_O)T^\dagger P_t,
 \qquad s,t\in\{c,p\}.}                              \tag{5.4}
\]

There is no reason for the two off-diagonal blocks in (5.4) to vanish.
They are the explicit packet-level sector mixing demanded by the positive
pullback.  They may vanish accidentally on a special packet, so no
nonvanishing theorem is claimed.

The construction is not canonical.  A different admissible reciprocal
gauge `r_(m,l,n)` for which both square sums converge leaves (3.8)
unchanged but changes `T^*T`, `T^dagger`, and every block in (5.4).
Moreover,

\[
 \|U_0\|^2
 =\left\|(T^*T)^{-1/2}(Z_O^*Z_O)(T^*T)^{-1/2}\right\|
                                                               \tag{5.5}
\]

on `V_0`.  The present estimates give no growing-`lambda` control of the
right side.  Thus (5.3)--(5.5) prove existence and closability, not the
uniform sector geometry needed for a sign theorem.

## 6. Hadamard carrier kernel and why it does not close the gate

For `Re s,Re t>1`, let

\[
 H_\xi(s)={\xi_R'(s)\over\xi_R(s)},\qquad
 Z_M(s)=\sum_m\omega_M(m)m^{-s}.                     \tag{6.1}
\]

The exact infinite-half-line combined carrier kernel is

\[
 K_M(s,t)=2Z_M(s)Z_M(t)
 {H_\xi(s)-H_\xi(t)\over s-t}.                       \tag{6.2}
\]

In the canonical paired Hadamard ordering, the additive constants cancel
from the divided difference and

\[
 \boxed{
 K_M(s,t)=-2\sum_\rho^{\rm can}
 {Z_M(s)Z_M(t)\over(s-\rho)(t-\rho)}.}               \tag{6.3}
\]

The sum is absolutely convergent because the paired completed-zero set has
summable inverse squares.  Thus the formal carrier entries of the zero-side
map are

\[
 \Phi_{M,s}(\rho)={\sqrt2\,Z_M(s)\over s-\rho}.       \tag{6.4}
\]

After orbitwise realification, (6.3) is the signed Gram obtained by the
negative conjugate-slot exchange.  It is not an ordinary positive Gram
unless the required reflected Pick geometry is separately proved.

At finite central length the exact carrier is instead

\[
 K_{M,L}(s,t)=K_M(s,t)+\Delta_{M,L}(s,t),             \tag{6.5}
\]

with

\[
 \Delta_{M,L}(s,t)
 ={2Z_M(s)Z_M(t)\over s-t}
 \{t e^{(t-s)L}T_{t-1}(L)-sT_{s-1}(L)\}.            \tag{6.6}
\]

The tail (6.6), the endpoint and midpoint rows, and the finite-cutoff
radical defect do not disappear from the physical problem.  Consequently
(6.4) is an explicit kernel for the infinite-half-line completed carrier,
not a generator-level formula for `U_0` on the finite-length transition
packet.  Formula (0.8) includes those contributions only after the exact
physical source assembly has been taken.

There is also a sharp circularity boundary.  Center

\[
 h(z)={\xi_R'(1/2+z)\over\xi_R(1/2+z)}.              \tag{6.7}
\]

The correctly reflected positive-real Pick kernel is

\[
 \mathcal P_h(z,w)
 ={h(z)+\overline{h(w)}\over z+\overline w},
 \qquad \Re z,\Re w>0.                               \tag{6.8}
\]

If RH holds, every centered zero is `i*gamma` and canonical pairing gives

\[
 \mathcal P_h(z,w)
 =\sum_\gamma^{\rm can}
 {1\over(z-i\gamma)(\overline w+i\gamma)}\succeq0. \tag{6.9}
\]

Conversely, positivity of (6.8) on the whole right half-plane makes `h`
holomorphic there with nonnegative real part.  It can have no pole there;
functional-equation symmetry then puts every nontrivial zero on the
critical line.  Hence whole-half-plane positivity of (6.8) is RH-equivalent.
It cannot be used as the missing unconditional estimate.

## 7. Exact surviving advance and remaining lemma

The endpoint-null gauge has removed one genuine technical obstruction:
the ordered prime source feature no longer needs to exist only as a signed
Abel cross-form limit.  At each fixed `lambda` it has an honest Hilbert
majorant, an honest bounded fundamental symmetry, and strong `R,M` limits.
Together with the ordinary `B_0` row, this produces the packet-level
intertwiner (0.8).

One first quantitative lemma in the declared gauge (0.3) is now explicit.
On the realized exterior-white local packet `E`, it would be necessary to
prove the growing-transition graph bound

\[
 \boxed{
 \sup_{\lambda}\left\|
 (T_E^*T_E)^{-1/2}(Z_{O,E}^*Z_{O,E})
 (T_E^*T_E)^{-1/2}\right\|<\infty}                  \tag{7.1}
\]

together with source-sector localization strong enough to compare the
local row with the completed rest.  Equation (7.1) is gauge-dependent; it
is the squared norm of the particular `U_0` in (0.8).  A gauge-invariant
theorem would additionally require a normalized admissible gauge class,
uniform equivalence of its positive norms, or a direct quotient norm.
Thus a bound for one arbitrarily chosen gauge is insufficient.  No such
stability or localization estimate, and no one-sided consequence for the
signed blocks, is proved here.
