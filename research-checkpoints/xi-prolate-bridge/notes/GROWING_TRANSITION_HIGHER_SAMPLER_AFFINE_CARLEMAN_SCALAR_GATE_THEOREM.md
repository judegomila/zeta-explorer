# Growing-transition higher-sampler affine Carleman and scalar-gate theorem

## 0. Exact result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad \alpha_0=(\log L)^4.                         \tag{0.1}
\]

This note keeps all coherent sampler pairs `m,l>=2` in the subcritical
bulk `alpha_j>=alpha_0`.  Its first conclusion is an exact calculation for
the affine Liouville--Green corner carrier extracted from the direct-source
Carleman form.  On the expanded node set `i=(m,j)`, write its real inward
and outward carriers as

\[
 L_i(s)={\cal A}_i\cos(\phi_i-P_i s),\qquad
 R_i(t)={\cal A}_i\cos(\phi_i+P_i t).                  \tag{0.2}
\]

The Abel boundary value of the Hermitian affine corner is

\[
\boxed{
 K_{\rm aff}={\pi\over2}\left\{
 D_{{\cal A}\cos\phi}\,C_+\,D_{{\cal A}\cos\phi}
 -D_{{\cal A}\sin\phi}\,C_+\,D_{{\cal A}\sin\phi}
 \right\},\qquad
 (C_+)_{ik}={1\over P_i+P_k}.}                         \tag{0.3}
\]

Thus the expanded matrix is a **difference** of two positive Cauchy
Grams.  It is not an `I+iH` boundary matrix and it is not positive in
general.  A one-node carrier with `phi=pi/2` has the exact negative value

\[
 K_{\rm aff}(i,i)=-{\pi{\cal A}_i^2\over4P_i}.         \tag{0.4}
\]

Nevertheless, the physical coherent compression, after summing every
`m,l>=2`, is uniformly bounded in exterior-defect (`D`) coordinates:

\[
\boxed{\|K^M_{\rm aff,phys}\|\leq C,}                  \tag{0.5}
\]

with an absolute constant independent of the number of retained bulk
labels and of the finite Fejer cutoff `M`.  The proof uses the exact sum

\[
 \sum_{m,l\geq2}{1\over ml(m+l)}=2\zeta(3)-{3\over2}. \tag{0.6}
\]

No sampler Parseval comparison and no positivity hypothesis are needed
for (0.5).

For the `x>=1` portion of the curved post-Plemelj regular block, the frozen
exact action change factors the geometric matrix as

\[
 A^M=C^L\circ C^b\circ q^M.                            \tag{0.7}
\]

The normalized Loewner factor is a unital completely positive Schur
contraction and, on `x>=1`, the half-density factor has dimension-free
projective endpoint and derivative variation.  The full inward profile of
an `m>=2` sampler nevertheless reaches `x=0` at `s=log m`.  Accordingly the
remaining bulk gate consists of the coherently grouped finite-`M` scalar
family `q^M` on the regular portion **and** the exact `m_a`-weighted hard
factorization on `x<1`.  The exact conductor-scale sufficient condition is
the cutoff-matched seminorm defined in Section 7:

\[
 \boxed{\mathfrak S^\sharp_{\geq2}(L)=o(L).}           \tag{0.8}
\]

Conditional on (0.8), including its hard-factorization term, the full
post-Plemelj `m,l>=2` regular block is
`o(L)` in `D` coordinates.  Together with (0.5), its Hermitian lower bound
is `-o(L)D`.  This is a conditional norm statement, not positivity.

At constant amplitude, the complete unweighted modulo-four grouping has
an exact cancellation at the first Abel boundary: the two apparent zeta
residues at `s=1` cancel.  That cancellation is proved in Section 6.  It
does not prove (0.8): at finite `M` the corresponding pole coefficient is
generally nonzero, and sharp masks create atomic action derivatives with
only one gap denominator.

The scope excludes every channel with `m=1` or `l=1`, the Weber edge,
edge--bulk crosses, endpoint shear, and the singular flat index `N=1`.
It also excludes the raw prime discrepancy and any identification of a
physical weighted fixed-product sample `K(N)` with a deterministic paired
Fourier alias `S_h`.  No complete `PA`, complete central floor, equation
(5.2) of `DIRECT_RH_ATTACK.md`, determinant conclusion, or RH follows.
The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The proof uses the following repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md` | `1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c` |
| `tests/test_growing_transition_subcritical_lg_action_bv_theorem.py` | `a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92` |
| `notes/GROWING_TRANSITION_POST_PLEMELJ_REGULAR_ACTION_REDUCTION_THEOREM.md` | `c7793bec967d219d06eecee76f5606b871b77b75f068648fcf2607977791afd8` |
| `tests/test_growing_transition_post_plemelj_regular_action_reduction_theorem.py` | `00d3fe6c8eb1c1e145abf4d5d1dbee5e38cd33259b1e33d6316246dc61c6eeb1` |
| `notes/GROWING_TRANSITION_LOCKED_CARRIER_FLAT_SCALAR_SUM_THEOREM.md` | `cf51bc269592e5ae2393e0c30931ca8fb4723283e70bb5981345f6e822afcc9e` |
| `tests/test_growing_transition_locked_carrier_flat_scalar_sum_theorem.py` | `6577d3a20f6917a7a807ded2bd90b8879122b7c259cbb6ce6be1b6ac22f8d5a3` |
| `notes/GROWING_TRANSITION_FINITE_FEJER_POST_CORE_QUANTIFIER_THEOREM.md` | `c366a3a379a7b6f147b6cfcef07f9bd2b373e21a392c02b58aaa1e28c038f4a9` |
| `tests/test_growing_transition_finite_fejer_post_core_quantifier_theorem.py` | `409b119b42d8202511d0253a638d08c9e6585e4866337de4a7a14cbae76e9f1a` |
| `notes/GROWING_TRANSITION_EDGE_EDGE_HIGHER_ALIAS_THEOREM.md` | `3bd3bf977178be94e91b7c6603db9df7f861f1cfe498bef303c210e9b87b9ec5` |
| `tests/test_growing_transition_edge_edge_higher_alias_theorem.py` | `c7f6920d5253d31d3acc73c00412567294791c51d62c18291f8407a0ea53be2f` |

No external prime estimate, generalized-Hilbert positivity theorem, or
numerical prolate data is used.  The whole-profile Euler identity in
Section 8 is elementary Euler summation.  A later use of Brun--Titchmarsh
or of a completed-sampler frame bound must be declared separately.

## 2. Direct-source normalization and bulk affine nodes

The singular part of the exact direct-source upper form is

\[
 \int_0^L\!\int_0^\infty
 {a_j(s)b_k(t)\over s+t}\,dt\,ds.                     \tag{2.1}
\]

At finite Fejer cutoff its inward and outward profiles contain

\[
 {\sqrt\lambda\over2}\omega_M(m)
 H_j(m\lambda e^{-s}),\qquad
 {\sqrt\lambda e^t\over2}\omega_M(l)
 H_k(l\lambda e^t).                                   \tag{2.2}
\]

At the corner the second factor's `e^t` is one.  Hence the exact
direct-source coefficient for a sampler pair is

\[
 {\lambda\over4}\omega_M(m)\omega_M(l),              \tag{2.3}
\]

with no factor `m/l` or `l/m`.  In particular, different sampler labels
have the same conormal order and may not be discarded before the coherent
sum.

For a bulk label `j`, put

\[
 r_j^2={\alpha_j\over c},\qquad J_j=J(r_j),\qquad
 x_m=\sqrt{m^2-1},\qquad y_{m,j}=\sqrt{x_m^2+r_j^2}.   \tag{2.4}
\]

For `m>=2`, the completed LG phase has corner momentum

\[
 \boxed{P_{m,j}=cm{y_{m,j}\over x_m}\geq cm.}         \tag{2.5}
\]

Indeed `dx/ds=-m^2/x` at `s=0` and
`T_r'(x)=sqrt(x^2+r^2)/sqrt(1+x^2)=y/m`.  The connection action `C(r)` is
independent of `s`.  Write the real corner phase, including the fixed
connection convention of the retained carrier, as `phi_(m,j)`.

In `D`-white coordinates define the value and normalized phase derivative

\[
 \begin{aligned}
 V_{m,j}&={\sqrt\lambda\over2}\omega_M(m)
             {H_j(m\lambda)\over\sqrt{d_j}},\\
 W_{m,j}&=-{\sqrt\lambda\over2}\omega_M(m)
 {m\lambda\over P_{m,j}}{H'_j(m\lambda)\over\sqrt{d_j}},\\
 {\cal A}_{m,j}&=(V_{m,j}^2+W_{m,j}^2)^{1/2},\qquad
 \cos\phi_{m,j}={V_{m,j}\over{\cal A}_{m,j}},\qquad
 \sin\phi_{m,j}={W_{m,j}\over{\cal A}_{m,j}}.
 \end{aligned}                                                \tag{2.6}
\]

The zero-amplitude convention for `phi` is immaterial.  With (2.6), the
inward affine carrier has the exact corner value and phase derivative

\[
 L_{m,j}(0)=V_{m,j},\qquad L'_{m,j}(0)=P_{m,j}W_{m,j}.
                                                               \tag{2.6a}
\]

The outward `H` carrier has derivative `-P_(m,j)W_(m,j)`; the derivative
of its explicit slow factor `e^t` belongs to the envelope remainder, not
to the frozen phase.  Thus `A_iA_k` in Section 3 already contains the
direct-source factor `lambda/4` from (2.3); no second copy is inserted.

The exact LG representation is a geometric prefactor times the Bessel
carrier `W_r(cT_r)`.  Since `z=sqrt(1+x^2)`, at `z=m` one has the exact
normalization

\[
 {m\over P_{m,j}}{d\over dz}W_{r_j}(cT_{r_j}(x(z)))
 =W'_{r_j}(cT_{r_j}(x_m)).                             \tag{2.6b}
\]

On `x>=sqrt(3)`, `W_r` and `W'_r` have the same Bessel envelope.  The
logarithmic derivative of the geometric prefactor costs `O(1)` and hence
`O(P^(-1))` after normalization.  The frozen uniform Volterra transfer
bounds preserve both estimates.
Together with the exact mass normalizer, this gives an absolute constant
`C_LG` such that, uniformly for `alpha_j>=alpha_0` and `m>=2`,

\[
 { |H_j(m\lambda)|
 +{m\lambda\over P_{m,j}}|H'_j(m\lambda)|\over\sqrt{d_j}}
 \leq {C_{\rm LG}\over
 \sqrt{\lambda J_j}\sqrt{x_m y_{m,j}}},\qquad
 |{\cal A}_{m,j}|
 \leq {C_{\rm LG}\omega_M(m)\over m\sqrt{J_j}}.      \tag{2.7}
\]

The second inequality uses `x_m>=sqrt(3)m/2`.  It is an envelope for the
retained LG carrier.  The exact Volterra correction is not silently put
inside the affine model; its action variation belongs to Section 5.

## 3. Exact Hermitian Abel calculation

Let `i=(m,j)`, `k=(l,kappa)` and abbreviate
`(A_i,phi_i,P_i)=({\cal A}_{m,j},phi_(m,j),P_(m,j))`.
For positive Abel parameters define

\[
 U^\varepsilon_{ik}=A_iA_k
 \int_0^\infty\!\int_0^\infty
 {e^{-\varepsilon(s+t)}
  \cos(\phi_i-P_i s)\cos(\phi_k+P_k t)\over s+t}
 \,dt\,ds.                                            \tag{3.1}
\]

Equation (3.1) is the affine conormal principal obtained by extending the
frozen corner carrier on the two half-lines.  It is not an assertion that
the curved physical profiles equal these cosines away from the corner.

Set `r=s+t`, `u=s/r`.  The Jacobian cancels the denominator.  The
difference-frequency branch has

\[
 q(u)=P_k+(P_i-P_k)u>0                                 \tag{3.2}
\]

and contributes in the boundary value

\[
 {A_iA_k\over2}\sin(\phi_i-\phi_k)
 {\log(P_i/P_k)\over P_i-P_k}.                         \tag{3.3}
\]

Its continuous diagonal value is zero.  Expression (3.3) changes sign
under `i<->k`, so it vanishes after Hermitianization.

The sum-frequency branch has

\[
 h(u)=P_k-(P_i+P_k)u.                                  \tag{3.4}
\]

Its principal-value logarithm is likewise skew.  Its unique delta point
`u=P_k/(P_i+P_k)` gives

\[
 \boxed{
 \operatorname {Herm}U_{ik}
 ={\pi\over2}A_iA_k
 {\cos(\phi_i+\phi_k)\over P_i+P_k}.}                 \tag{3.5}
\]

This is also obtained from the exact Abel integral

\[
 \int_0^\infty\!\int_0^\infty
 {e^{-ps-qt}\over s+t}\,dt\,ds
 ={\log(p/q)\over p-q}                                \tag{3.6}
\]

by taking the four boundary values and then the Hermitian average.  On
the diagonal,

\[
 \operatorname {Herm}U_{ii}
 ={\pi A_i^2\over4P_i}\cos(2\phi_i).                  \tag{3.7}
\]

Since

\[
 {1\over P_i+P_k}=\int_0^\infty e^{-P_i u}e^{-P_k u}\,du, \tag{3.8}
\]

`C_+` is positive semidefinite.  Expanding
`cos(phi_i+phi_k)=cos(phi_i)cos(phi_k)-sin(phi_i)sin(phi_k)` proves (0.3).
Equation (3.7) proves (0.4), and therefore refutes positivity of the
expanded affine block from its boundary-value structure alone.

This calculation also explains why a cross-sampler difference gap is not
the relevant frozen denominator after Hermitianization: every surviving
affine term has `P_i+P_k`.  It does not assert that a curved interior
difference branch may be discarded by the same algebra.

## 4. Uniform physical `D` bound for all `m,l>=2`

Let `I` be the retained bulk labels and compress (3.5) coherently by
summing the two sampler indices at fixed modal labels.  Equations
(2.5)--(2.7) imply

\[
 \begin{aligned}
 |(K^M_{\rm aff,phys})_{j\kappa}|
 &\leq {\pi C_{\rm LG}^2\over2c\sqrt{J_jJ_\kappa}}
 \sum_{m,l\geq2}{\omega_M(m)\omega_M(l)\over ml(m+l)}\\
 &\leq {\pi C_{\rm LG}^2\over2c\sqrt{J_jJ_\kappa}}
 \left(2\zeta(3)-{3\over2}\right).
 \end{aligned}                                                \tag{4.1}
\]

For completeness,

\[
 \sum_{m,l\geq1}{1\over ml(m+l)}=2\zeta(3),\qquad
 \sum_{l\geq1}{1\over l(l+1)}=1,                    \tag{4.2}
\]

and removing the two first rows while restoring their intersection gives
(0.6).

The right side of (4.1) is a rank-one majorant with vector
`u_j=J_j^(-1/2)`.  The admitted inventory and the elementary elliptic
lower bound are

\[
 |I|\leq{3\lambda^2\over2}={3c\over4\pi},\qquad
 J_j\geq{\pi\over2}.                                  \tag{4.3}
\]

Therefore

\[
 \boxed{
 \|K^M_{\rm aff,phys}\|
 \leq {3C_{\rm LG}^2\over4\pi}
 \left(2\zeta(3)-{3\over2}\right).}                 \tag{4.4}
\]

This proves (0.5).  The proof is an absolute coherent-synthesis bound; it
does not assume the false estimate that the unweighted profile sum is an
`L^2` contraction.

## 5. POST projective pullback closes the regular geometric factors

For `m,l>=2`, the affine corner variables are
`x_m=sqrt(m^2-1)>=sqrt(3)`.  This is the region used in Sections 2--4.
It is not true that the whole inward profile stays there: its exact variable
`x(s)=sqrt(m^2e^(-2s)-1)` decreases to zero at `s=log m`.  Split every
curved channel at `x=1`.  On the regular piece `x>=1`, the exact pairwise
action change of the frozen post-Plemelj theorem gives (0.7), where

\[
 C^L_{jk}={F(a_j)-F(a_k)\over
 (a_j-a_k)\sqrt{J(a_j)J(a_k)}},\qquad C^L_{jj}=1,      \tag{5.1}
\]

and

\[
 C^b_{jk}={1\over2}\left({u_j\over u_k}+{u_k\over u_j}\right),
 \qquad u_j=(x^2+a_j)^{1/4}.                           \tag{5.2}
\]

Operator monotonicity of `F` makes `C^L` positive semidefinite with
diagonal one.  Thus `X -> C^L \circ X` is a unital completely positive Schur
contraction.  Moreover

\[
 \|C^b(x)\|_\pi\leq2^{1/4},                            \tag{5.3}
\]

and the exact action derivative obeys

\[
 \partial_yC^b_{jk}
 =-{\sigma_j-\sigma_k\over c}
 {x\sqrt{1+x^2}(a_j-a_k)\over4(b_jb_k)^{5/2}}.        \tag{5.4}
\]

The projective norm of (5.4) is `O(x^(-3))`, and its `x` derivative is
`O(x^(-4))`.  Hence its endpoint and total projective variations are
dimension-free.  The exact LG Volterra coefficient adds

\[
 O\left({\log(2+\alpha_0)\over\alpha_0}\right)       \tag{5.5}
\]

to the slow coefficient variation.

Consequently the **regular** geometric pullback introduces no
growing-label loss: any scalar `E_d+B_0+B_2` and jump bound for `q^M`
promotes through (0.7) on `x>=1` with only an absolute multiplicative
constant.  On `x<1`, the frozen POST theorem instead gives the exact hard
half-density

\[
 m_a(\xi)={1\over\sqrt{1+q_r(\xi)}}.
\]

It occurs inside a Hankel--Christoffel--Darboux Stieltjes factorization.
The pure `m_a=1` reference is a contraction, but `m_a` depends on the
action parameter and cannot be removed by pointwise domination.  Its exact
endpoint/BV factorization seminorm is retained as `cal H_hard^M` in
Section 7.  Equations (5.1)--(5.5) do not prove either that hard seminorm or
the regular scalar bound.  In particular, equality layers
`s+t=log(m/l)` occur for every `m>l` and approach the corner for adjacent
large samplers.  A uniform cross-`m` interior gap argument is false; the
projective action pullback is the valid geometric reduction.

## 6. Whole modulo-four cancellation at constant amplitude

The locked carrier is `e^(icN)=i^N`.  In the unweighted ordered limit put

\[
 L_{\infty,i}(s)=\sum_{l\geq1}{Q_{l\bmod4}(s)\over l^s},
 \qquad a=2^{-s},\qquad \Re s>1.                      \tag{6.1}
\]

Let `S_r(s)` be the sum of `l^(-s)` in residue class `r mod 4`.  Then

\[
 \begin{gathered}
 S_0=a^2\zeta(s),\qquad S_2=(a-a^2)\zeta(s),\\
 S_1+S_3=(1-a)\zeta(s),\qquad
 S_1-S_3=L(s,\chi_4).
 \end{gathered}                                                \tag{6.2}
\]

Substitution of the four exact locked coefficients `Q_r` gives

\[
\boxed{
 L_{\infty,i}(s)
 =-(2a^2-a)\zeta'(s)
 +(\log2)(4a^2-a)\zeta(s)
 -iL'(s,\chi_4).}                                     \tag{6.3}
\]

All two-adic terms are included in (6.3).  At `s=1`,

\[
 2a^2-a=0,\qquad
 {d\over ds}(2a^2-a)=-{\log2\over2},\qquad
 4a^2-a={1\over2}.                                   \tag{6.4}
\]

Since `zeta'(s)=-1/(s-1)^2+O(1)`, the first term in (6.3) has residue
`-(log2)/2`; the second has residue `+(log2)/2`.  They cancel exactly.
The character term is regular there.  Hence `L_(infinity,i)` has a finite
boundary value at `s=1`.  So does the unweighted center transform

\[
 C_{\infty,i}(s)=2L_{\infty,i}(s)-Q_1(s).             \tag{6.5}
\]

This proves that the Abel pole obtained by isolating one even sampler
class is an artifact of incomplete modulo-four grouping at constant
amplitude.  It is not a variable-amplitude or finite-cutoff theorem.  At
finite `M`, the coefficient of the zeta logarithmic-derivative pole is

\[
 A_M(s)=
 \sum_{\substack{l\leq M\\l\equiv0\ (4)}}
 {\omega_M(l)\over l^s}
 -\sum_{\substack{l\leq M\\l\equiv2\ (4)}}
 {\omega_M(l)\over l^s},                              \tag{6.6}
\]

which is generally nonzero.  For `M=2`, it equals
`-omega_2(2)2^(-s)`.  Thus (6.3) cannot replace the exact finite-`M`
weighted scalar gate.

## 7. Exact conductor-scale finite-`M` scalar gate

The finite-cutoff center coefficient which belongs inside the
cutoff-matched boundary assembly is

\[
 C_M(N)=2\omega_M(1)\ell_M(N)-\omega_M(1)^2\Lambda(N),
 \qquad
 \ell_M(N)=\sum_{n\mid N}\Lambda(n)\omega_M(N/n).     \tag{7.1}
\]

All fixed-product divisors and physical orientations are summed before a
norm is taken.  After subtraction of the exact `PA_M`, let the regulated
scalar action channel `q^M_{\mathfrak c}` have

\[
 Dq^M_{\mathfrak c}=q^M_{1,\mathfrak c}(y)\,dy
 +\nu^M_{\mathfrak c},\qquad
 \nu^M_{\mathfrak c}=\sum_sJ^M_{\mathfrak c,s}\delta_s. \tag{7.2}
\]

For the sum of all `m,l>=2` bulk channels define

\[
 \begin{aligned}
 E_{\rm d}^M={}&\sum_{\mathfrak c}\sup_j
 \left|\int_0^1q^M_{\mathfrak c,jj}(y)\,dy\right|,\\
 B_0^M={}&\sum_{\mathfrak c}
 \left\{\|q^M_{\mathfrak c}(0)\|_\pi
          +\|q^M_{\mathfrak c}(1)\|_\pi\right\},\\
 B_2^M={}&\sum_{\mathfrak c}\sup_{j\ne k}
 \left\{|q^M_{1,\mathfrak c,jk}(0+)|
 +|q^M_{1,\mathfrak c,jk}(1-)|
 +\operatorname {Var}q^M_{1,\mathfrak c,jk}\right\},\\
 {\cal J}^M={}&\sum_{\mathfrak c}\left\|
 \left[{\widehat\nu^M_{\mathfrak c,jk}(-\Delta_{jk})
 \over i\Delta_{jk}}{\bf1}_{j\ne k}\right]_{j,k}
 \right\|.
 \end{aligned}                                                \tag{7.3}
\]

Let `cal H_hard^M` denote the sum over the `x<1` fixed-product channels of
the infimal endpoint/BV Stieltjes factorization seminorm in equations
(7.8)--(7.9) of the frozen POST theorem, with both exact factors
`m_((t/c)^2)` retained, together with the arithmetic mask, cutoff, and
Volterra coefficient.  This defines the unresolved hard gate; it does not
assert an estimate.  Stieltjes integration against the reference Hankel
contractions adds `cal H_hard^M` to the regular sequence bound.

Here `Delta_jk=sigma_j-sigma_k`; endpoint values already assigned to
`PA_M` are zero in (7.3), while any unassigned endpoint must remain in
`B_0^M`.  The exact sequence estimate is

\[
 \|\operatorname {Herm}R^M_{\rm scalar}\|
 \leq E_{\rm d}^M+\left({1\over2}+{\pi\over18}\right)B_0^M
 +{4\over27}B_2^M+{\cal J}^M.                         \tag{7.4}
\]

Thus the corresponding regular-plus-hard estimate is

\[
 \|\operatorname {Herm}R^M_{\rm reg+hard}\|
 \leq E_{\rm d}^M+\left({1\over2}+{\pi\over18}\right)B_0^M
 +{4\over27}B_2^M+{\cal J}^M+{\cal H}_{\rm hard}^M. \tag{7.4a}
\]

The conductor-scale cutoff-matched hypothesis in (0.8) means precisely

\[
\boxed{
 \mathfrak S^\sharp_{\geq2}(L):=
 \sup_M\left\{E_{\rm d}^M+\left({1\over2}+{\pi\over18}\right)B_0^M
 +{4\over27}B_2^M+{\cal J}^M+{\cal H}_{\rm hard}^M
 \right\}_{\rm post\text{-}PA_M}
 =o(L).}                                               \tag{7.5}
\]

If only the limiting unweighted `PA` is subtracted, the honest alternative
is

\[
\boxed{
 \mathfrak S^\to_{\geq2}(L):=
 \limsup_{M\to\infty}\left\{E_{\rm d}^M
 +\left({1\over2}+{\pi\over18}\right)B_0^M
 +{4\over27}B_2^M+{\cal J}^M+{\cal H}_{\rm hard}^M
 +E_{\rm core}(M,L)\right\}
 =o(L),}                                               \tag{7.6}
\]

with `M->infinity` taken at fixed `L`.  A supremum over `M` after
subtracting the limiting core is false, since `C_1(N)=Lambda(N)/4`.

A sufficient scalar estimate for the atomic term is, for some fixed
`eta>0`,

\[
 |\widehat\nu^M_{\mathfrak c,jk}(-\Delta_{jk})|
 \leq\epsilon_{\mathfrak c}(L)
 (1+|n_j-n_k|)^{-\eta},\qquad
 \sum_{\mathfrak c}\epsilon_{\mathfrak c}(L)=o(L).   \tag{7.7}
\]

Indeed the locked gaps give

\[
 {\cal J}^M\leq {4\zeta(1+\eta)\over3\pi}
 \sum_{\mathfrak c}\epsilon_{\mathfrak c}(L).       \tag{7.8}
\]

Equations (5.1)--(5.5) promote the regular part of (7.5) or (7.6) with no
dimension loss, while `cal H_hard^M` is precisely the separate Stieltjes
hypothesis needed on `x<1`.  No frozen input proves either complete
hypothesis.

## 8. Sharp masks, whole-profile cancellation, and the remaining frame lemma

### 8.1 Atomic sharp-mask obstruction

For the step `q=1_(s_0,1]`, the derivative measure contains
`nu=delta_(s_0)`.  Its exact Fourier coefficient is

\[
 \int_{s_0}^1e^{i\Delta y}\,dy
 ={e^{i\Delta}-e^{i\Delta s_0}\over i\Delta}.         \tag{8.1}
\]

At `s_0=1/2` and `Delta=2pi k`, `k` odd, its magnitude is
`2/|Delta|`, not `O(|Delta|^(-2))`.  Thus `Var(q')` is not a valid
description of a sharp channel and total jump mass alone supplies only
one action-gap denominator.

At a locked physical transition with phase origin `u_0=c(m-1)`,

\[
 e^{-iNu_0}=i^{-N(m-1)}.                               \tag{8.2}
\]

This may be real or imaginary according to the full modulo-four data.
Consequently an individual sharp channel need not have a real principal
multiplier.  Reality, if present, must be proved after the exact residue,
orientation, and endpoint grouping; it cannot be imposed channelwise.

### 8.2 Recombined compact branch cancels the false Euler main

The sharp-mask obstruction does not license splitting artificial internal
boundaries out of one exact sampler branch.  Let `f` be even, supported on
`[-lambda,lambda]`, and put `z=i\xi`.  The compact-`f` inward time branch is
exactly

\[
 \begin{aligned}
 {\cal T}_A(f;z)
 &: =\int_0^L\sum_{m\geq1}f(m\lambda e^{-s})e^{-zs}\,ds\\
 &=\int_{1/A}^1 f(\lambda x)x^{z-1}S(Ax,z)\,dx,
 \qquad S(X,z)=\sum_{m\leq X}m^{-z}.
 \end{aligned}                                                \tag{8.3}
\]

After ordered unweighted Poisson completion, the **full** inward
coefficient contains the reflected reciprocal branch as well:

\[
 {\cal C}_{\rm full}(f;z)
 ={\sqrt\lambda\over2}{\cal T}_A(f;z)
 +{A^{1-z}\over2\sqrt\lambda}{\cal T}_A(f;1-z).     \tag{8.3a}
\]

Equation (8.3a) is not a finite-Fejer identity.  At finite cutoff the two
weighted branches must remain in their exact direct-source form.

With `B_1(X)=\{X\}-1/2` and the usual right-continuous endpoint convention,
Euler summation gives

\[
\boxed{
 S(X,z)={X^{1-z}\over1-z}+\zeta(z)-B_1(X)X^{-z}
 +z\int_X^\infty B_1(t)t^{-z-1}\,dt.}                \tag{8.4}
\]

On `Re z=0` the last integral is its Dirichlet/Abel boundary value.  The
large Euler term in (8.3) is not a kink atom by itself; it is

\[
 {A^{1-z}\over1-z}\int_{1/A}^1f(\lambda x)\,dx.      \tag{8.5}
\]

If `\int_{\mathbb R}f=0` and `f(0)=0`, evenness gives

\[
 \int_{1/A}^1f(\lambda x)\,dx
 =-{1\over\lambda}\int_0^{1/\lambda}f(u)\,du.        \tag{8.6}
\]

For even `C^2` data,

\[
 \left|{A^{1-z}\over1-z}\int_{1/A}^1f(\lambda x)\,dx\right|
 \leq{\|f''\|_\infty\over6A|1-z|}.                  \tag{8.7}
\]

Thus the apparent `A^(1-z)` coherence of the isolated internal
derivative-kink sum cancels within the compact branch against the regular
pieces and the retained last endpoint.  The reflected term in (8.3a) has
the same zero-integral suppressed Euler main with `z` replaced by `1-z`;
it must be retained in the full frame inventory.  In particular, after
`f(lambda)=f'(lambda)=0`, the remaining `f''(lambda)` or `alpha^2` jet may
not be normed as a standalone Dirichlet polynomial.

For finite Fejer weights, replace `S` by

\[
 S_M(X,z)=\sum_{m\leq X}\omega_M(m)m^{-z}.             \tag{8.8}
\]

At fixed `A`,

\[
 \sup_{1\leq X\leq A}|S_M(X,z)-S(X,z)|
 \leq\sum_{m\leq A}|1-\omega_M(m)|\longrightarrow0   \tag{8.9}
\]

in the ordered limit.  Equation (8.9) supplies no conductor-uniform rate.
The exact remaining whole-profile lemma is therefore a `D`-white frame
bound for both truncated-Mellin/zeta terms in (8.3a), both Bernoulli
remainders, and the ordered finite-`M` error.  Neither the isolated kink
atom nor (8.7) proves that lemma.

### 8.3 Deterministic aliases are not physical weighted samples

The frozen higher-alias theorem controls a channel already written as the
self-adjoint deterministic pair

\[
 S_h=\widehat K(h)+\widehat K(-h),\qquad |h|\geq2.     \tag{8.10}
\]

Its edge rank estimate and Hilbert--Schmidt contraction apply to (8.10).
The physical fixed-product expression instead has the form
`sum_N W_N K(N)` with prime weights, divisor masks, and endpoints.  Masks
convolve Fourier coefficients, and ordinary cutoffs break the naive
pairing.  There is no frozen weighted Poisson/orientation identity
identifying these two objects.  Hence the deterministic alias theorem
does not prove (7.5), and its `o(L)` bound may not be imported into the raw
weighted scalar channel.

## 9. Exact exceptions and conditional conclusion

The sampler `m=1` has `x_1=0`, so (2.5) is not a finite affine momentum.
It is the hard Weber/Carleman endpoint.  The classifications are:

1. `m=l=1`: the local logarithmic Carleman and reciprocal-core channel;
2. exactly one of `m,l` equal to one: an edge--bulk or bulk--edge channel;
3. flat reciprocal index `N=1`: the singular factor
   `(N^2-1)^(-1/2)` and divergent logarithmic translation;
4. `m,l>=2`, `alpha>=alpha_0`: the bulk channel treated here; and
5. `alpha<alpha_0`: the Weber edge/hard patch, even when `m,l>=2`.

The exact reciprocal core `(-2L)S_1=(L/2)\mathsf X` and its midpoint rows
belong to `PA_M` or to the ordered limiting `PA`; they are not part of the
regular seminorm (7.5).  Endpoint shear also lies outside this theorem,
because it inserts the fixed label-`8` bulk row into edge and cross
blocks.

Accordingly the rigorous higher-sampler statement is:

* unconditionally, the exact Hermitian affine corner is (0.3), is
  indefinite, and its complete physical `m,l>=2` compression is `O(1)`;
* unconditionally, the POST pullback removes the regular `x>=1` geometric
  growing-dimension loss and the constant-amplitude unweighted residue
  grouping cancels at `s=1`; the exact `m_a`-weighted `x<1` factorization
  remains in the hard seminorm; and
* conditionally on (7.5), or on the ordered version (7.6), the curved
  post-Plemelj `m,l>=2` regular block is `o(L)` and hence bounded below by
  `-o(L)D`.

The finite-`M` weighted scalar seminorm, the `m_a`-weighted hard
factorization, its whole-profile frame bound, and its sharp transition
grouping remain open.  This is the exact obstruction, not positivity of an
expanded generalized-Hilbert matrix.
