# Growing-transition discrepancy zero-orbit and Bernoulli-tail barrier

## 0. Exact theorem and boundary

Use the locked schedule and the actual ordered profiles

\[
 \lambda={p\over2},\quad p\geq5\text{ odd},\quad
 A=\lambda^2,\quad L=\log A,\quad \ell={L\over2}=\log\lambda,
 \quad \sigma:=hC,\quad {1\over2}<\sigma<1,\quad
 T_L={A^{hC}\over L^{2m}}={A^\sigma\over L^{2m}},
                                                               \tag{0.1}
\]

\[
 \mathfrak a_x(s)={\sqrt\lambda\over2}
 C_x(\lambda e^{-s}),\quad 0\leq s\leq L,
 \qquad
 \mathfrak b_x(t)={\sqrt\lambda e^t\over2}
 \sum_{l\geq1}H_x(l\lambda e^t),\quad t\geq0.       \tag{0.2}
\]

Put

\[
 \mu_D=\sum_{n\geq2}{\Lambda(n)\over n}\delta_{\log n}-dr,
 \qquad
 E(z)=-{\zeta'(1+z)\over\zeta(1+z)}-{1\over z},
 \qquad \Re z>0.                                    \tag{0.3}
\]

Let

\[
 \xi_{\mathbb R}(s)={1\over2}s(s-1)\pi^{-s/2}
 \Gamma(s/2)\zeta(s),\qquad F={\xi_{\mathbb R}'\over\xi_{\mathbb R}},
 \qquad C_*= {3\over2}-\log(2\pi).                  \tag{0.4}
\]

With canonical genus-one zero ordering, the exact inverse-Laplace
distribution on `[0,infinity)` is

\[
\boxed{
\begin{aligned}
 d\mu_D(r)={}&C_*\delta_0
 -\sum_\rho^{\rm can}
 \left\{e^{-(1-\rho)r}\,dr+{1\over\rho}\delta_0\right\}\\
 &+\sum_{\nu\geq1}
 \left\{{1\over2\nu+2}\delta_0
             -e^{-(2\nu+1)r}\,dr\right\}.
\end{aligned}}                                                   \tag{0.5}
\]

The `delta_0` coefficient in (0.5) is a canonical distributional
normalization.  The individual delta coefficients must not be summed
separately.  The measure on the left has no atom at zero, and no
derivative of `delta_0` occurs.

For the finite central interval define the ordinary rows

\[
 \mathcal A_{L,z}x=\int_0^L\mathfrak a_x(s)e^{-zs}\,ds,
 \qquad
 \mathcal B_zx=\int_0^\infty\mathfrak b_x(t)e^{-zt}\,dt,
 \qquad \Re z>0.                                    \tag{0.6}
\]

If

\[
 \Phi_{xy}(r)=\int_0^{\min(L,r)}
       \overline{\mathfrak a_x(s)}\mathfrak b_y(r-s)\,ds,
                                                               \tag{0.7}
\]

then `Phi_xy(0)=0` and

\[
 \int_0^\infty e^{-zr}\Phi_{xy}(r)\,dr
 =\overline{\mathcal A_{L,\bar z}x}\,\mathcal B_zy. \tag{0.8}
\]

Consequently, in the inherited source/Abel and canonical zero-orbit
ordering,

\[
\boxed{
 \mathfrak a^*\mathcal V_{\mu_D}\mathfrak b
 =-\sum_\rho^{\rm can}
       \mathcal A_{L,1-\bar\rho}^*\mathcal B_{1-\rho}
  -\sum_{\nu\geq1}
       \mathcal A_{L,2\nu+1}^*\mathcal B_{2\nu+1}.} \tag{0.9}
\]

Every formal delta term in (0.5) annihilates (0.7) before any infinite
sum is taken.  Combining (0.9) with the exact density cancellation and
the continuous odd-Laplace tower gives

\[
\boxed{
 Q_X^\uparrow
 =-2\sum_\rho^{\rm can}
       \mathcal A_{L,1-\bar\rho}^*\mathcal B_{1-\rho},
 \qquad
 Q_X=-\sum_\rho^{\rm can}
 \mathsf S(\mathcal A_{L,1-\bar\rho},\mathcal B_{1-\rho}),}    \tag{0.10}
\]

where `mathsf S(U,V)=U^*V+V^*U`.  Thus the coefficient `-2` in the
upper form becomes coefficient `-1` in front of each Hermitian cross.
The finite cutoff in `A_(L,z)` is binding and retains the moving threshold
and the exact tail `T_(D,L)`.

On the forced seven-row packet `E`, `mathcal A_0=0`.  Put
`Q_D=mathsf S(mathfrak a,mathcal V_(mu_D)mathfrak b)`.  Then

\[
 P_EQ_XP_E=P_E(Q_D+Q_{\rm cont})P_E
 =P_E\{\mathsf S(\mathfrak a,\mathcal V_{\mu_D}\mathfrak b)
                 +Q_{\rm cont}\}P_E=o(T_L),          \tag{0.11}
\]

while the already-proved edge theorem gives

\[
 P_E\mathsf S(\mathfrak a,\mathcal V_{\mu_D}\mathfrak b)P_E
 \succeq {c'_m\over8}T_LP_E.                        \tag{0.12}
\]

Therefore the realized discrepancy cross is necessarily a same-scale
carrier.  Formula (0.10) is an exact structural reduction, but (0.11) is
the already-proved complete matching rewritten in zero rows; it is not a
new independent zero estimate.

At a critical-line conjugate pair, the physical parity and radical
relations collapse the two zero rows to a positive Gram.  Off the line,
the full four-zero orbit has an exchange-signature row factorization.
This row-Krein factorization is not yet a literal identification with the
physical feature `Z_O^*Sigma Z_O`: a uniform source-to-zero-row
intertwiner has not been constructed.

Finally, weighted Mertens integration by parts isolates the minimal
prime-side tail condition.  The outward derivative has a nondecaying
periodic-Bernoulli leading term and an uncontrolled corner row
`J_L=mathfrak b'(0)`.  Hence no absolute-BV or termwise mixed-Weber
argument proves that condition.  A weighted, coherent
Mertens--Bernoulli correlation estimate remains necessary.

This theorem proves no new sign for `Q_X`, no zero-free region, no RH
statement, no new bound for `J_L`, and no complete central sign.  The
project state remains `P0_INVALIDATED`.

## 1. Frozen post-checkpoint-1.16 inputs

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_MIXED_WEBER_ORDINARY_ENDPOINT_OBSTRUCTION_THEOREM.md` | `45615e23dcb698c69d757de136a596a59ee12cfa913d1931942ba90e7ee539c9` |
| `tests/test_growing_transition_mixed_weber_ordinary_endpoint_obstruction_theorem.py` | `fbe130ffb9b44798455cc06be1d265a10a80a7a75002a748e731ef8c235a99dc` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_MOVING_DIVISOR_DENSITY_DISCREPANCY_VOLTERRA_THEOREM.md` | `3c2005552a6c18919f31391d64a33d54be0ce51fc8a9190474fec58b06477f83` |
| `tests/test_growing_transition_ordered_prime_moving_divisor_density_discrepancy_volterra_theorem.py` | `ba54a785c91db4898a4243c99253a540b8ba855e4243eba41836b950398d658e` |
| `notes/GROWING_TRANSITION_HADAMARD_PICK_CARRIER_RH_EQUIVALENCE_THEOREM.md` | `092d0adefb7bafea8d931a2741299d19feef2a45ccc3d243c3543765fdf5cff7` |
| `tests/test_growing_transition_hadamard_pick_carrier_rh_equivalence_theorem.py` | `d15fff20bc0aa62ad63903b6c17e64b11ecba3ab965f179c82086e261c398b43` |
| `notes/GROWING_TRANSITION_GLOBAL_RADICAL_SECTOR_MIXING_FEATURE_GEOMETRY_BARRIER.md` | `976f9299c4d002db3f0b73f0b4da8cc383480c8b55b7ea5ccdc219d9135fbdc4` |
| `tests/test_growing_transition_global_radical_sector_mixing_feature_geometry_barrier.py` | `61837a5180eac8fe307eca05578315066c39148c9d2dea143c6b1f7628e77b4d` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `tests/test_chebyshev_hankel_bound.py` | `ce931fc6a5b6d9af78abf6ed278d733d434e0041f2c84231345ab2e7c0d3d1f1` |

No zero table, numerical prolate datum, or new prime estimate is used.
The only external prime input is the already-vendored and hashed FKS
Chebyshev envelope in `P3_SOURCE_LOCK.json`.

## 2. Completion constants and the inverse-Laplace distribution

The canonical Hadamard logarithmic derivative is

\[
 F(s)=B_\xi+\sum_\rho^{\rm can}
 \left\{{1\over s-\rho}+{1\over\rho}\right\},
 \qquad
 B_\xi=-1-{\gamma\over2}+{1\over2}\log(4\pi).       \tag{2.1}
\]

Direct logarithmic differentiation of (0.4) gives

\[
 E(z)=-F(1+z)+{1\over1+z}
       +{1\over2}\psi\!\left({1+z\over2}\right)
       -{1\over2}\log\pi.                           \tag{2.2}
\]

The digamma series, with its `nu=0` pole combined with `1/(1+z)`, is

\[
 {1\over1+z}+{1\over2}\psi\!\left({1+z\over2}\right)
       -{1\over2}\log\pi
 =C_\Gamma+\sum_{\nu\geq1}
 \left\{{1\over2\nu+2}-{1\over z+2\nu+1}\right\}, \tag{2.3}
\]

where

\[
 C_\Gamma={1\over2}-{\gamma\over2}-{1\over2}\log\pi,
 \qquad C_\Gamma-B_\xi={3\over2}-\log(2\pi)=C_*.   \tag{2.4}
\]

Substitution of (2.1) and (2.3) into (2.2) gives

\[
\boxed{
\begin{aligned}
 E(z)={}&C_*
 -\sum_\rho^{\rm can}
 \left\{{1\over z+1-\rho}+{1\over\rho}\right\}\\
 &+\sum_{\nu\geq1}
 \left\{{1\over2\nu+2}-{1\over z+2\nu+1}\right\}.
\end{aligned}}                                                   \tag{2.5}
\]

For a compactly supported smooth test function, each bracket in (2.5)
is the Laplace transform of the corresponding canonical bracket in
(0.5).  One integration by parts exposes cancellation of the value at
zero, and a second gives `O((1+|rho|)^(-2))`; the classical zero count
then proves distributional convergence.  This proves (0.5).

Equation (0.5) is not a license to form
`C_*-sum 1/rho+sum 1/(2nu+2)`.  That expression separates a convergent
canonical distribution into divergent pieces.  For the correlation
(0.7), the safer fact is stronger: `Phi_xy(0)=0`, so all delta brackets
vanish before the zero and trivial-zero limits.

## 3. Finite-slot Volterra factorization and tower cancellation

Ordinary Fubini in the original prime/discrepancy cross gives

\[
 \langle\mathfrak a_x,\mathcal V_{\mu_D}\mathfrak b_y\rangle
 =\int_{[0,\infty)}\Phi_{xy}(r)\,d\mu_D(r).          \tag{3.1}
\]

Writing `r=s+t` proves (0.8).  Applying (0.5) to (3.1), first with the
inherited source/Abel regulator and finite symmetric zero orbits, proves
(0.9).  The regulator is removed only after the complete orbit has been
formed.  No ordinary absolutely convergent infinite-prime Hilbert feature
is asserted.

The exact upper-oriented forms are

\[
 Q_{\rm mov}^\uparrow
 =2\mathcal A_{L,0}^*\mathcal B_0
  +2\mathfrak a^*\mathcal V_{\mu_D}\mathfrak b,     \tag{3.2}
\]

\[
 Q_{\rm cont}^\uparrow
 =-2\mathcal A_{L,0}^*\mathcal B_0
  +2\sum_{\nu\geq1}
       \mathcal A_{L,2\nu+1}^*\mathcal B_{2\nu+1}. \tag{3.3}
\]

The density row cancels the continuous pole and the last sum in (0.9)
cancels (3.3) term for term.  This proves the first identity in (0.10).
Hermitian averaging means `(Q^up+(Q^up)^*)/2`; it proves the second
identity with no additional factor of two.

The finite central slot cannot be replaced by a half-line row.  For probe
exponents `alpha,beta` with `Re alpha,Re beta>0` and `alpha!=beta`, take
`a(s)=e^(-alpha*s)1_[0,L](s)` and `b(t)=e^(-beta*t)`.  The same
factorization is the exact identity

\[
 \int_0^Le^{-\alpha s}
 (\mathcal V_{\mu_D}e^{-\beta\,\cdot})(s)\,ds
 ={E(\beta)-E(\alpha)+T_{D,L}(\alpha)
       -e^{-(\alpha-\beta)L}T_{D,L}(\beta)\over\alpha-\beta}.
                                                               \tag{3.4}
\]

The diagonal `alpha=beta` is the continuous divided-difference limit.

where

\[
 T_{D,L}(z)=\sum_{n>A}{\Lambda(n)\over n^{1+z}}
                  -{A^{-z}\over z}.                 \tag{3.5}
\]

Here `A=p^2/4` is not an integer, so there is no endpoint atom.  Dropping
either `mathcal A_(L,z)`'s finite endpoint or `T_(D,L)` changes the
operator and loses the moving threshold.

## 4. Physical phases, parity, and radical equations

Let the inversion parity be `epsilon in {+1,-1}`; the admitted physical
packet uses `epsilon=+1`.  With the locked Mellin convention

\[
 \widehat G(z)=\int_0^\infty G(u)u^{-iz}{du\over u}, \tag{4.1}
\]

the central and exterior transforms are exactly

\[
\boxed{
 \widehat X(z)=e^{-iz\ell}\mathcal A_{L,1/2-iz},
 \qquad
 \widehat O(z)=e^{-iz\ell}\mathcal B_{1/2+iz}
       +\epsilon e^{iz\ell}\mathcal B_{1/2-iz}.}    \tag{4.2}
\]

Indeed the positive central coordinate is `u=lambda*e^(-s)` and the
positive exterior coordinate is `u=lambda*e^t`; the factor `e^(-t/2)`
between the physical exterior state and `mathfrak b(t)` accounts for the
real part `1/2` in both exterior rows.

Write a nontrivial zero as

\[
 \rho={1\over2}+is_\rho,
 \qquad s_\rho=\gamma+i(1/2-\beta)
 \quad(\rho=\beta+i\gamma).                         \tag{4.3}
\]

The two-sided physical radical is evaluated at both `s_rho` and
`bar(s_rho)`.  Substitution in (4.2) gives the two exact equations

\[
\boxed{
 \mathcal A_{L,1-\rho}+\mathcal B_\rho
 +\epsilon e^{2is_\rho\ell}\mathcal B_{1-\rho}=0,} \tag{4.4}
\]

\[
\boxed{
 \mathcal A_{L,\bar\rho}+\mathcal B_{1-\bar\rho}
 +\epsilon e^{2i\bar s_\rho\ell}\mathcal B_{\bar\rho}=0.}   \tag{4.5}
\]

Central parity supplies

\[
 \mathcal A_{L,\rho}
 =\epsilon e^{-2is_\rho\ell}\mathcal A_{L,1-\rho},
 \qquad
 \mathcal A_{L,1-\bar\rho}
 =\epsilon e^{-2i\bar s_\rho\ell}\mathcal A_{L,\bar\rho}.
                                                               \tag{4.6}
\]

Equations (4.4)--(4.6), not the false single-row relation
`B_(bar rho)=-A_rho`, contain the reflected exterior boundary.  Deleting
one `B` row loses the physical inversion phase and the finite-tail
content.

## 5. Critical-line pair and off-line quartet

Assume one zero lies on the critical line.  Then `s=s_rho` is real,
`bar rho=1-rho`, and

\[
 t=\epsilon e^{2is\ell},\qquad |t|=1.               \tag{5.1}
\]

Equations (4.4) and (4.6) reduce to

\[
 \mathcal A_{L,\rho}=t^{-1}\mathcal A_{L,\bar\rho},
 \qquad
 \mathcal A_{L,\bar\rho}+\mathcal B_\rho
                         +t\mathcal B_{\bar\rho}=0. \tag{5.2}
\]

The upper-oriented sum of the two conjugate-zero rows is therefore

\[
 -\mathcal A_{L,\rho}^*\mathcal B_{\bar\rho}
 -\mathcal A_{L,\bar\rho}^*\mathcal B_\rho
 =\mathcal A_{L,\bar\rho}^*\mathcal A_{L,\bar\rho}. \tag{5.3}
\]

After Hermitianization, a conjugate pair of multiplicity one contributes

\[
\boxed{2\mathcal A_{L,\bar\rho}^*
             \mathcal A_{L,\bar\rho}\succeq0.}      \tag{5.4}
\]

Thus RH positivity appears only after the complete conjugate pair,
central parity, and both reflected exterior rows are retained.  It is
not a termwise sign of (0.9).

For an off-line orbit
`mathfrak o={rho,bar rho,1-rho,1-bar rho}`, define

\[
 U_{\mathfrak o}=
 \begin{pmatrix}
 \mathcal A_{L,1-\bar\rho}\\
 \mathcal A_{L,1-\rho}\\
 \mathcal A_{L,\bar\rho}\\
 \mathcal A_{L,\rho}
 \end{pmatrix},
 \qquad
 V_{\mathfrak o}=
 \begin{pmatrix}
 \mathcal B_{1-\rho}\\
 \mathcal B_{1-\bar\rho}\\
 \mathcal B_\rho\\
 \mathcal B_{\bar\rho}
 \end{pmatrix}.                                      \tag{5.5}
\]

Then the quartet contribution is exactly

\[
 Q_{\mathfrak o}
 =\begin{pmatrix}U_{\mathfrak o}\\V_{\mathfrak o}\end{pmatrix}^{\!*}
 \underbrace{\begin{pmatrix}0&-I_4\\-I_4&0\end{pmatrix}}
 _{\Sigma_{\rm row,\mathfrak o}}
 \begin{pmatrix}U_{\mathfrak o}\\V_{\mathfrak o}\end{pmatrix}. \tag{5.6}
\]

The fixed Hadamard rotation diagonalizes the coefficient block as
`diag(-I_4,+I_4)`.  This is the off-line exchange signature.  It is an
exact algebraic factorization of the row form, but it does not prove that
the completed row vector belongs to a positive Hilbert feature space.

The global radical theorem separately supplies a physical zero feature
and a paired-slot involution, written `Z_O^*Sigma Z_O`.  Equality of the
two scalar source forms is exact on admitted source pairs:

\[
 Q_X(x,y)=\mathcal W_Z(O_x,O_y)
 =\langle Z_Ox,\Sigma Z_Oy\rangle_{\mathfrak Z}.     \tag{5.7}
\]

A literal operator identity between the row vector in (5.6) and the
physical feature `Z_O` would require a uniformly bounded,
source-compatible intertwiner which respects canonical orbit limits.
No frozen theorem constructs it, so (5.6) is denoted `Sigma_row`, not
silently identified with `Sigma`.

## 6. What is and is not RH-strength

For the one realized packet, (0.11) is unconditional because it is a
corollary of complete source matching.  It neither assumes nor proves RH.
A direct zero-side proof of the same estimate would need the
packet-specific lemma

\[
 \left\|P_E\sum_\rho^{\rm can}
 \mathsf S(\mathcal A_{L,1-\bar\rho},
           \mathcal B_{1-\rho})P_E\right\|=o(T_L).   \tag{6.1}
\]

RH alone supplies the orbit sign (5.4), not the quantitative cancellation
(6.1).  Conversely, (6.1) on a single finite packet is far weaker than
RH.

An RH-strength assertion needs both a density and a closed-form-domain
passage.  One sufficient upgrade would be:

1. the admitted source rows, under a uniform canonical intertwiner,
   form a form core dense enough to approximate every finite collection
   of completed Pick generators;
2. the zero-orbit form is closable on that core and the canonical sums
   pass to its closure; and
3. the closed form is nonnegative on the entire core.

Those hypotheses would extend positivity to the global completed Pick
kernel.  The frozen Hadamard--Pick theorem then makes the conclusion
equivalent to RH.  Neither density nor the uniform intertwiner follows
from the seven-dimensional spaces `E=E_lambda`.

The logical trichotomy is therefore sharp: the factorization (0.10) is
unconditional; (6.1) is an unconditional realized-packet target already
known indirectly from matching; and global positive-metric completion on
a form core is RH-strength.

## 7. Exact Mertens tail and the missing `W_L(R)` lemma

Define the right-continuous weighted Mertens discrepancy

\[
 \Delta(r)=\sum_{n\leq e^r}{\Lambda(n)\over n}-r+\gamma.
                                                               \tag{7.1}
\]

Let `psi(X)=sum_(n<=X) Lambda(n)`.  Partial summation, the Laurent
expansion `-zeta'(1+epsilon)/zeta(1+epsilon)
=1/epsilon-gamma+O(epsilon)`, and FKS-dominated passage as
`epsilon downarrow 0` give

\[
 \Delta(r)={\psi(e^r)-e^r\over e^r}
 -\int_r^\infty{\psi(e^u)-e^u\over e^u}\,du.        \tag{7.2}
\]

The locked FKS bound, with `K_FKS=9.22022` and
`alpha_FKS=0.8476836`, therefore gives for `r>log 2`

\[
 |\Delta(r)|\leq K_{\rm FKS}
 \left\{r^{3/2}e^{-\alpha_{\rm FKS}\sqrt r}
 +2\int_{\sqrt r}^\infty v^4e^{-\alpha_{\rm FKS}v}\,dv\right\}
 \longrightarrow0.                                  \tag{7.3}
\]

The frozen endpoint-null decay `mathfrak b(t)=O_lambda(e^(-t))` gives
`Phi_xy(r)=O_lambda(e^(-r))` after `r>L`, so the boundary at infinity
vanishes.  If `R` is not the logarithm of an integer, Stieltjes
integration by parts now gives the exact identity

\[
\boxed{
 \int_{[R,\infty)}\Phi_{xy}(r)\,d\mu_D(r)
 =-\Delta(R)\Phi_{xy}(R)
  -\int_R^\infty\Delta(r)\Phi'_{xy}(r)\,dr.}         \tag{7.4}
\]

The derivative exists almost everywhere and is

\[
 \Phi'_{xy}(r)=
 \overline{\mathfrak a_x(r)}\mathfrak b_y(0)
             \mathbf1_{r<L}
 +\int_0^{\min(L,r)}
       \overline{\mathfrak a_x(s)}\mathfrak b'_y(r-s)\,ds.
                                                               \tag{7.5}
\]

On `E`, `mathfrak b(0)=Gamma_out=0`; the moving-diagonal value term
vanishes.  The frozen ordinary-endpoint identity also gives
`mathfrak a(L)=0`, so there is no hard-endpoint jump at `r=L`.  Neither
null controls the derivative near the moving diagonal.

Let `Phi_L(r)` denote the coefficient matrix in (0.7), and define the
oriented tail matrix

\[
 \mathcal W_L(R)=\Delta(R)\Phi_L(R)
       +\int_R^\infty\Delta(r)\Phi'_L(r)\,dr.        \tag{7.6}
\]

By (7.4), the discrepancy contribution from `r>=R` is
`-mathcal W_L(R)`.  A sufficient packet-localization lemma is the
existence of `R_L to infinity`, with `R_L<L`, such that

\[
\boxed{
 \left\|P_E\operatorname {Herm}\mathcal W_L(R_L)P_E\right\|
 =o(T_L),\qquad
 \operatorname {Herm}W={W+W^*\over2}.}              \tag{7.7}
\]

If (7.7) held, (0.12) would force the compensating discrepancy mass into
the exact region `r<R_L`, without changing the moving threshold.  A
polylogarithmic choice of `R_L` would follow from a pointwise PNT envelope
only after polynomial-in-`L`, white-uniform coherent bounds for the
profiles and their derivative convolution had been proved.  Those bounds
are not frozen.

## 8. Bernoulli derivative and the absolute-variation no-go

Let `f` be an actual smooth endpoint-null source and put

\[
 \kappa(f)=f'(\lambda-),\qquad
 P(x)={1\over2}-\{x\},\qquad
 \widetilde B_2(x)=\{x\}^2-\{x\}+{1\over6}.         \tag{8.1}
\]

Three integrations by parts in its additive Fourier transform give

\[
 H_f(y)={\kappa(f)\over2\pi^2y^2}
            \cos(2\pi\lambda y)+O_{\lambda,f}(y^{-3}).        \tag{8.2}
\]

Since

\[
 \sum_{l\geq1}{\cos(2\pi lx)\over l^2}
 =\pi^2\widetilde B_2(x),                            \tag{8.3}
\]

the actual outward profile has

\[
 \mathfrak b_f(t)={\kappa(f)\over4\lambda^{3/2}}
 e^{-t}\widetilde B_2(Ae^t)+O_{\lambda,f}(e^{-2t}), \tag{8.4}
\]

and, almost everywhere,

\[
\boxed{
 \mathfrak b'_f(t)=-{\sqrt\lambda\over2}\kappa(f)P(Ae^t)
                    +O_{\lambda,f}(e^{-t}).}         \tag{8.5}
\]

On `E`, where the endpoint and exterior-trace nulls hold, the exact
corner value is the different growing row

\[
\boxed{
 J_L(f):=\mathfrak b_f'(0)
 =-{1\over2\sqrt\lambda}
 \sum_{1\leq n<A}{n\over\lambda}f'(n/\lambda).}    \tag{8.6}
\]

There are `A+O(1)` summands in (8.6), and no frozen theorem gives a
growing-`lambda`, defect-white uniform bound for this row.

The logarithmic periodic averages are exact:

\[
 \int_0^Y P(Ae^t)^2\,dt={Y\over12}+O(A^{-1}),
 \qquad
 \int_0^Y |P(Ae^t)|\,dt={Y\over4}+O(A^{-1}).        \tag{8.7}
\]

Thus, if `kappa(f) != 0`,

\[
 \int_0^Y|\mathfrak b'_f(t)|^2\,dt
 ={\lambda|\kappa(f)|^2\over48}Y+O_{\lambda,f}(1),
 \qquad
 \int_0^Y|\mathfrak b'_f(t)|\,dt
 ={\sqrt\lambda|\kappa(f)|\over8}Y+O_{\lambda,f}(1).         \tag{8.8}
\]

In particular the primitive derivative is neither `L1` nor `L2`.
Therefore the shortcut
`sup_(r>=R)|Delta(r)| times ||mathfrak b'||_1` is unavailable.
The statement is not that a PNT-weighted integral diverges; the decaying
weight can make it converge.  The missing issue is a white-uniform bound
after the coherent convolution in (7.5), including the corner row (8.6).

Define the exact remainder

\[
 \mathcal R_{b,f}(t)=\mathfrak b'_f(t)
        +{\sqrt\lambda\over2}\kappa(f)P(Ae^t).      \tag{8.9}
\]

It is `O_(lambda,f)(e^(-t))` at infinity, but its compact part contains
`J_L`.  Substitution into (7.6) exposes the leading ordered correlation

\[
\boxed{
 \mathcal C_{L,R}(x,y)
 ={\sqrt\lambda\over2}\kappa(y)
 \int_R^\infty\Delta(r)
 \int_0^{\min(L,r)}\overline{\mathfrak a_x(s)}
       P(Ae^{r-s})\,ds\,dr.}                        \tag{8.10}
\]

Up to its fixed sign in (7.6), (8.10), the boundary value
`Delta(R)Phi(R)`, and the coherent `R_b` convolution are exactly the
contents of the missing lemma (7.7).  Estimating isolated `(m,l,n)`
Weber carriers before forming (8.10) loses the common endpoint null and
is not a proof of (7.7).

Adding the extra row `kappa=0` removes the far Bernoulli leading term,
but it does not control `J_L` or prove (7.7).  Any nonzero subspace left
inside `E` also inherits the coercive lower bound (0.12).  Finite row
nulling therefore cannot make the complete discrepancy cross `o(T_L)`.

## 9. Conclusion

The pole-deleted von Mangoldt discrepancy has an exact completed
inverse-Laplace distribution.  Applied to the physical finite-slot
correlation, it cancels the continuous pole and every odd trivial-zero
row, leaving precisely the nontrivial-zero cross (0.10).  On RH a full
conjugate pair becomes the positive Gram (5.4); off the line the natural
four-zero block retains exchange signature.

For the realized packet the nontrivial-zero form is already `o(T_L)` by
complete matching, while the discrepancy part alone is coercive at
scale `T_L`.  A standalone arithmetic localization must therefore prove
(7.7), whose leading new component is the coherent
Mertens--Bernoulli correlation (8.10) together with the growing corner
row (8.6).  This is the strongest current reduction and the exact
remaining barrier; it supplies neither a new sign nor an RH conclusion.
