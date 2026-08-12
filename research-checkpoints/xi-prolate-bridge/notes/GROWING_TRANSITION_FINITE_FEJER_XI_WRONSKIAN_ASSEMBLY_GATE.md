# Growing-transition finite-Fejer Xi-Wronskian assembly gate

## 0. Exact result and claim boundary

Use a finite sampler weight `omega_M` and put

\[
 Z_M(s)=\sum_{m\geq1}\omega_M(m)m^{-s},\qquad
 \ell_M(N)=\sum_{n\mid N}\Lambda(n)\omega_M(N/n).       \tag{0.1}
\]

This note proves three algebraic facts.

First, before the adjoint and physical-boundary folds, the mask variables
determine the signs of two logarithmic carrier coordinates exactly.  If
`N=mln`,

\[
 y=\log(N/A),\qquad z=e^\rho,\qquad w=e^{y-\rho},       \tag{0.2}
\]

then

\[
 t_j=\rho-\log m,\qquad t_k=y-\rho-\log l,qquad
 t_j+t_k=\log(n/A).                                    \tag{0.3}
\]

The frozen formulas do **not** determine whether the positive or negative
coordinate in (0.3) is the physical inward or outward slot after Poisson
recombination and reflection.  Consequently they do not identify `C_R`
with `R(alpha_j,alpha_k)` rather than its transpose.

Second, in the absolute-convergence half-plane, the ordered finite-Fejer
sampler and its prime derivative have an exact antisymmetric divided
difference.  If the missing complete pre-Hermitian physical assembly were
to add the pole and Archimedean logarithmic derivative with the same two
ordered slots, its infinite-half-line kernel would be

\[
 \boxed{
 {2Z_M(s)Z_M(t)\over s-t}
 \left\{{\xi_R'\over\xi_R}(s)
             -{\xi_R'\over\xi_R}(t)\right\}.}          \tag{0.4}
\]

After the ordered sampler limit this becomes a gamma-conjugated
Xi-Wronskian,

\[
 \boxed{
 {2\over g(s)g(t)}
 {\xi_R'(s)\xi_R(t)-\xi_R(s)\xi_R'(t)\over s-t},
 \qquad
 g(s)={1\over2}s(s-1)\pi^{-s/2}\Gamma(s/2).}           \tag{0.5}
\]

Third, (0.4) is not a finite-central-length identity.  The exact retained
last boundary leaves the explicit tail correction (4.3c), whose
mask-resolved finite-Fejer image must be assembled separately.

Equations (0.4)--(0.5) are an **assembly target**, not a proved formula for
the complete central form.  The frozen reduction attaches the masks
`R,C_R,C_L,B` only after it has folded physical boundaries and adjoints.
It does not prove that the pole--Archimedean rows use the same ordered slot
map, nor that every residual reflected term is contained in (0.4).
Consequently this note proves neither `PA`, cancellation of the upper
conjugated-Hilbert channel, a de Branges positivity theorem, a complete
edge floor, nor RH.  The formal project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The exact formulas used below are frozen at the following bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `notes/GROWING_TRANSITION_POST_PLEMELJ_REGULAR_ACTION_REDUCTION_THEOREM.md` | `c7793bec967d219d06eecee76f5606b871b77b75f068648fcf2607977791afd8` |
| `notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md` | `1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d` |
| `notes/GROWING_TRANSITION_FINITE_FEJER_POST_CORE_QUANTIFIER_THEOREM.md` | `c366a3a379a7b6f147b6cfcef07f9bd2b373e21a392c02b58aaa1e28c038f4a9` |
| `tests/test_growing_transition_finite_fejer_post_core_quantifier_theorem.py` | `409b119b42d8202511d0253a638d08c9e6585e4866337de4a7a14cbae76e9f1a` |
| `notes/NEAR_SIGNED_HANKEL_REDUCTION.md` | `fba7078c9695951fa7160e2587ff774dc1d10730bd94dc3efdec4b851ef9408e` |
| `notes/MELLIN_PROJECTION_SOFT_SYMBOL_REDUCTION.md` | `97bdb89e2d98811d98c0aa9d4b007bd644066b14e05b78ca7a763d6b48dceea1` |

No external source and no zero table is used.  The Xi-Wronskian statement is
first proved only for `Re s,Re t>1`.  No unrecorded continuation to the
critical line is made.

## 2. Exact mask coordinates and the missing slot bridge

With (0.2), define (0.3).  Directly,

\[
 m\leq z\Longleftrightarrow t_j\geq0,
 \qquad
 l\leq w\Longleftrightarrow t_k\geq0.                 \tag{2.1}
\]

Therefore the exact coordinate table is

\[
\begin{array}{c|c|c|c|c}
 \text{mask}&t_j&t_k&\text{arithmetic condition}\\ \hline
 R&\geq0&\geq0&n>A\\
 C_R&<0&\geq0&\text{mixed signs}\\
 C_L&\geq0&<0&\text{mixed signs}\\
 B&<0&<0&n<A.
\end{array}                                             \tag{2.2}
\]

It is tempting to call positive `t` outward and infer

\[
 C_R:X_j\to O_k,qquad C_L:O_j\to X_k.                 \tag{2.2a}
\]

That inference is **not** frozen.  The complete-central reduction explicitly
places `B` in the physical `O--O` prime fold, whereas the same sign rule
would label the last row of (2.2) inward--inward.  Poisson recombination and
the reflected boundary can change the physical representation.  A new
pre-fold identity is therefore required before (2.2a), or its transpose,
may be used.

The arithmetic coefficient of an ordered triple is

\[
 {\Lambda(n)\over\sqrt N}\omega_M(m)\omega_M(l).       \tag{2.3}
\]

The three physical prime quadrants `R,C_R,C_L` have the common multiplier
`-2` in the outer representation.  Equivalently,

\[
 -2(R+C_R+C_L)=-2G+2B.                                 \tag{2.4}
\]

Thus `B` has coefficient `+2` only as the correction to the unrestricted
`-2G` representation; it is not a fourth original prime quadrant carrying
an independent positive sign.

At `m=z` or `l=w`, the corresponding arithmetic layer in (2.2) is split
with weight `1/2`.  Simultaneous equality would give
`n=A`, which is impossible on the locked nonintegral schedule.  The two
endpoint traces of the center interval are `rho=0` and `rho=y_N`.  Under
the essential collar restriction

\[
 A<N<2A,
\]

the equality layer at either endpoint is

\[
\begin{aligned}
 E_{N,M}^{\rm end}(A)
 &:=\omega_M(1)\sum_{\substack{n\mid N\\n<A}}
       \Lambda(n)\omega_M(N/n)\\
 &=\omega_M(1)
 \{\ell_M(N)-\omega_M(1)\Lambda(N)\}.
\end{aligned}                                         \tag{2.5}
\]

The corresponding midpoint coefficient is

\[
 (G_{N,M}-B_{N,M})_{\rm midpoint}
 =2\omega_M(1)\ell_M(N)-\omega_M(1)^2\Lambda(N)
  -{1\over2}E_{N,M}^{\rm end}(A).                    \tag{2.6}
\]

Indeed, when `A<N<2A`, every proper divisor of `N` is below `A`, so the
only divisor omitted from the sum in (2.5) is `n=N`.  The defining sum in
the first line of (2.5) remains the exact endpoint equality layer more
generally.  Its reduction to the second line, and hence the simplified
formula (2.6), is not valid without this restriction: for `N\geq2A`,
proper divisors between `A` and `N` can contribute to `ell_M(N)` without
belonging to the endpoint equality layer.

The half-row travels with the Plemelj boundary rows; it is not part of an
open-cell correlation integral.

For comparison, the source correlation before parity folding is

\[
 \mathfrak q(v,w;x)=\int_{\mathbb R}
 \{\overline {v(t)}w(t+x)+\overline {v(t+x)}w(t)\}\,dt.
                                                               \tag{2.7}
\]

For equal parity, its right and reflected-left central--outer pieces both
give the same ordered convolution `2(overline A_j*B_k)`.  Thus the physical
boundary table which is independently recoverable is

\[
\begin{array}{c|c}
 \text{physical contribution}&\text{flat kernel}\\ \hline
 \text{right }X_j\to O_k&R(\alpha_j,\alpha_k)\\
 \text{reflected left }X_j\to O_k&R(\alpha_j,\alpha_k)\\
 \text{adjoint }O_j\to X_k&R(\alpha_k,\alpha_j).
\end{array}                                             \tag{2.8}
\]

The two physical boundaries add rather than cancel.  No frozen equation
identifies a row of (2.8) with `C_R` or `C_L` in (2.2).

## 3. Exact finite-Fejer ordered commutator

For `Re s>1`, put

\[
 P(s)=\sum_{n\geq2}{\Lambda(n)\over n^s}
     =-{\zeta'(s)\over\zeta(s)},qquad
 L_M(s)=\sum_{N\geq1}{\ell_M(N)\over N^s}.            \tag{3.1}
\]

Absolute convergence and the divisor definition of `ell_M` give

\[
 \boxed{L_M(s)=P(s)Z_M(s).}                            \tag{3.2}
\]

Therefore the two ordered slots satisfy the exact identity

\[
\boxed{
 Z_M(s)L_M(t)-L_M(s)Z_M(t)
 =Z_M(s)Z_M(t)
 \left\{{\zeta'(s)\over\zeta(s)}
             -{\zeta'(t)\over\zeta(t)}\right\}.}      \tag{3.3}
\]

Equation (3.3) is the pre-Hermitian information erased by a fixed-product
scalar coefficient.  Indeed, the coefficient

\[
 G_{N,M}=\sum_{mln=N}
       \omega_M(m)\Lambda(n)\omega_M(l)                \tag{3.4}
\]

is invariant under `m<->l`; it cannot remember whether a term came from
`Z_M(s)L_M(t)` or `L_M(s)Z_M(t)`.

## 4. Pole--Archimedean completion and the conditional assembly target

Write

\[
 \xi_R(s)=g(s)\zeta(s),\qquad
 g(s)={1\over2}s(s-1)\pi^{-s/2}\Gamma(s/2),            \tag{4.1}
\]

so that

\[
 {g'(s)\over g(s)}={1\over s}+{1\over s-1}
 -{1\over2}\log\pi+{1\over2}\psi(s/2).               \tag{4.2}
\]

The exact infinite-half-line complete Chebyshev transform gives, with
`s=p+1,t=q+1`,

\[
 I_*(p,q)=2
 {\xi_R'/\xi_R(s)-\xi_R'/\xi_R(t)\over s-t}.          \tag{4.3}
\]

The additive constant in `(z+1)D(z)` cancels from this divided difference.
This statement is not independent of the finite central length.  For
exponential carriers `a(u)=e^{-pu}`, `b(v)=e^{-qv}`, put

\[
 A_z(L)=\int_0^L\delta_*(r)e^{-zr}\,dr,\qquad
 T_z(L)=\int_L^\infty\delta_*(r)e^{-zr}\,dr,\qquad
 E=e^{(q-p)L}.                                        \tag{4.3a}
\]

Indeed, if
`F_q(u)=\int_0^\infty\delta_*(u+v)e^{-qv}\,dv=e^{qu}T_q(u)`, the retained
`+` first boundary, bulk, and `-` last boundary give

\[
 {I_{*,L}\over2}=D(q)
 -(p+1)\int_0^L e^{(q-p)u}T_q(u)\,du-E T_q(L),
\]

while Fubini gives

\[
 \int_0^L e^{(q-p)u}T_q(u)\,du
 ={A_p(L)-A_q(L)+(E-1)T_q(L)\over q-p}.
\]

For `p\neq q` in the half-plane where these tails converge, the exact
first-boundary, bulk, and last-boundary expression is

\[
 \boxed{
 {I_{*,L}(p,q)\over2}
 ={(p+1)A_p(L)-(q+1)A_q(L)
       +(q+1)(E-1)T_q(L)\over p-q}.}                 \tag{4.3b}
\]

Equivalently,

\[
 \boxed{
 I_{*,L}(p,q)=I_*(p,q)
 +{2\{(q+1)E T_q(L)-(p+1)T_p(L)\}\over p-q}.}       \tag{4.3c}
\]

The diagonal `p=q` is the continuous divided-difference limit.
Thus the retained last boundary does not make (4.3) finite-`L` exact; it
produces the explicit finite-length tail correction (4.3c).  In the
formal Weber substitution `Re p=-1/2`, the two tails in (4.3a) need not
exist.  Formula (4.3) therefore cannot be substituted for the physical
finite-length boundary form without a separate boundary-value and tail
assembly.

At finite `M`, the exact algebraic completion of (3.3) is

\[
\begin{aligned}
 C_M(s,t)
 &:={Z_M(s)L_M(t)-L_M(s)Z_M(t)}\\
 &\quad+Z_M(s)Z_M(t)
   \left\{{g'\over g}(s)-{g'\over g}(t)\right\}\\
 &=Z_M(s)Z_M(t)
   \left\{{\xi_R'\over\xi_R}(s)
                 -{\xi_R'\over\xi_R}(t)\right\}.
\end{aligned}                                                   \tag{4.3d}
\]

Combining (3.3) with the difference of (4.2) therefore proves the
following purely algebraic implication:

**Assembly implication AH.**  If the complete mask-resolved physical form
places the pole and Archimedean difference on the same ordered sampler
slots as (3.3), and if all reflected and midpoint rows not displayed in
(3.3) have already been retained separately, then its infinite-half-line
two-slot kernel is exactly (0.4).  At finite `L`, the mask-resolved image
of (4.3c) must also be retained.

`AH` is not proved by the frozen scalar identity (2.4).  A proof requires a
single pre-Hermitian formula indexed simultaneously by physical boundary,
mask, and ordered source/target slot.  The formulas frozen before this note
provide the boundary orientation (2.7), while the later formulas provide
the masks (2.2); no frozen equation contains both data sets before the
folds.

The oriented endpoint row is exactly

\[
 2\Gamma_{\rm in}^*(\beta_0-\lambda\beta_L).           \tag{4.4}
\]

Its Hermitian part is

\[
 \Gamma_{\rm in}^*(\beta_0-\lambda\beta_L)
 +(\beta_0-\lambda\beta_L)^*\Gamma_{\rm in}.          \tag{4.5}
\]

The first singular row participates in the Carleman/Plemelj completion and
must not be added twice.  The far row and the midpoint rows remain explicit
finite-row terms.  Formula (4.4) does not prove that the infinite-rank
kernel (0.4) factors through `eta`, `Gamma_in`, or `Gamma_out`.

## 5. Ordered limit and the exact gamma factor

For the standard Fejer weights, or any dominated pointwise sampler
approximation, `Z_M(s)->zeta(s)` locally uniformly on `Re s>1`.  Hence (0.4)
has the ordered limit

\[
 2\zeta(s)\zeta(t)
 {\xi_R'/\xi_R(s)-\xi_R'/\xi_R(t)\over s-t}.           \tag{5.1}
\]

Since `xi_R=g zeta`, direct multiplication gives

\[
 \xi_R'(s)\xi_R(t)-\xi_R(s)\xi_R'(t)
 =g(s)g(t)\zeta(s)\zeta(t)
 \left\{{\xi_R'\over\xi_R}(s)
             -{\xi_R'\over\xi_R}(t)\right\}.         \tag{5.2}
\]

Equations (5.1)--(5.2) prove (0.5).  The factor
`1/(g(s)g(t))` is mandatory in the raw sampler normalization.  Conjugating
each slot by `g` produces the pure Xi-Wronskian.

At finite `M`, define `xi_M=gZ_M`.  Then

\[
\begin{aligned}
 &g(s)g(t)Z_M(s)Z_M(t)
 \left\{{\xi_R'\over\xi_R}(s)
             -{\xi_R'\over\xi_R}(t)\right\}\\
 &\quad-{\xi_M'(s)\xi_M(t)-\xi_M(s)\xi_M'(t)\}\\
 &=g(s)g(t)\Bigl[
 Z_M(s)Z_M(t)
 \left\{{\zeta'\over\zeta}(s)-{\zeta'\over\zeta}(t)\right\}
 -Z_M'(s)Z_M(t)+Z_M(s)Z_M'(t)\Bigr].
\end{aligned}                                                   \tag{5.3}
\]

The right side is generally nonzero.  Thus (0.4) is **not** the
Christoffel--Darboux numerator of `gZ_M` at a finite cutoff.  Replacing it by
that numerator violates the ordered sampler convention.

## 6. Distinguished Xi source and the critical-line gate

The generic arithmetic radical has Mellin transform

\[
 \widehat{\mathcal E(f)}(z)
 =\zeta(1/2-iz)m_f(z),                                 \tag{6.1}
\]

so a generic transition column does not contribute a universal Xi factor.
There is one frozen special case.  For

\[
 h(x)={\pi\over2}x^2(2\pi x^2-3)e^{-\pi x^2},          \tag{6.2}
\]

the distinguished arithmetic state satisfies

\[
 \widehat{\mathcal E(h)}(t)={\Xi(t)\over4}.            \tag{6.3}
\]

Consequently, if the two slots in (4.3) are both this distinguished state,
their two factors `Xi/4` turn the complete divided difference into

\[
 \boxed{
 {1\over8}
 {\xi_R'(s)\xi_R(t)-\xi_R(s)\xi_R'(t)\over s-t}.}      \tag{6.4}
\]

Equivalently, multiplying each distinguished slot by `4` gives twice the
Xi-Wronskian divided difference.  This is a special-source corollary, not a
formula for the growing transition columns.

Formally putting `s=1/2-i alpha` and `t=1/2-i beta` in (4.3) meets the
poles of `xi_R'/xi_R` at zero ordinates.  The product in (5.2) may cancel
those poles after full Xi slot factors are present, but neither (0.4) nor
(6.4) supplies the required boundary-value theorem.  Any critical-line use
must therefore remain distributional and fail closed until the ordered
finite-Fejer limit, mask assembly, and boundary values are proved jointly.
Moreover, for real `alpha,beta` and
`Xi(u)=xi_R(1/2+iu)`, the Wronskian changes sign under this substitution:

\[
 {\xi_R'(s)\xi_R(t)-\xi_R(s)\xi_R'(t)\over s-t}
 =-{\Xi'(\alpha)\Xi(\beta)-\Xi(\alpha)\Xi'(\beta)
        \over\alpha-\beta}.                            \tag{6.5}
\]

Dropping this minus sign reverses the diagonal Laguerre orientation.

## 7. Exact remaining identity

The smallest missing statement is not a norm estimate.  It is the
pre-Hermitian equality

\[
 \boxed{
 U_{{\rm complete},M,L}(s,t)
 ={2Z_M(s)Z_M(t)\over s-t}
 \left\{{\xi_R'\over\xi_R}(s)
             -{\xi_R'\over\xi_R}(t)\right\}
 +\mathcal T_{M,L}(s,t)
 +\mathcal R_{M,L}^*Y_{M,L}
 +Y_{M,L}^*\mathcal R_{M,L},}                         \tag{7.1}
\]

where a proof must explicitly identify the endpoint/midpoint row map
`mathcal R_{M,L}` and its physical profile map `Y_{M,L}`.
Here `mathcal T_{M,L}` denotes the mask-resolved, finite-Fejer image of the
explicit tail correction (4.3c); it is not asserted to vanish or to equal
a scalar multiple of `Z_M(s)Z_M(t)` before the missing slot bridge is
proved.
A valid proof must start before the physical-boundary fold and before the
scalar replacement `R+C_R+C_L=G-B`.  It must connect (2.2) to (2.8), verify
the two midpoint half-rows, the common prime factor `-2`, and the pole and
Archimedean slot orientation.

Equation (7.1) is not asserted here.  It is the exact assembly gate exposed
by (2.2)--(6.4).  Until it is proved, (0.5) is an algebraic candidate rather
than a completed edge kernel.
