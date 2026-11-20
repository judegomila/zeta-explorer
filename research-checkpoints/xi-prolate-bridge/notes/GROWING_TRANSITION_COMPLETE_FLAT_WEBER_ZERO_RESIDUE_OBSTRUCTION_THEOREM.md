# Growing-transition complete flat-Weber zero-residue obstruction theorem

## 0. Exact result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad L=2\log\lambda .                \tag{0.1}
\]

This note computes the **complete affine flat-Weber transform** of the
Chebyshev-error boundary functional.  It does not compute the actual curved
finite-`c` prolate block.  For real Weber energies `alpha,beta`, put

\[
 \Delta=\alpha-\beta=2k
\]

and let `w_alpha` be the regular flat Weber solution.  If

\[
 k_*=-\{d\delta_*+\delta_*\,dr\},\qquad
 F_{\alpha\beta}=w_{-\alpha}*w_\beta,                  \tag{0.2}
\]

the affine complete kernel is

\[
 \mathcal K_c^{\rm flat}(\alpha,\beta)
 ={2\over c}\left\langle k_*(\,\cdot\,/c),
                         F_{\alpha\beta}\right\rangle . \tag{0.3}
\]

Let `rho` run over the zeros of the completed Riemann function `xi_R`,
with multiplicity and canonical paired Hadamard ordering.  Then

\[
\boxed{
 \mathcal K_c^{\rm flat}(\alpha,\beta)
 =-{2\over c}\sum_\rho
 W_{-\alpha}\!\left({1-\rho\over c}\right)
 W_\beta\!\left({1-\rho\over c}\right),}              \tag{0.4}
\]

where

\[
 W_\gamma(z)={1\over\sqrt{1+z^2}}
 \exp\left\{-{\gamma\over2}\arctan{1\over z}\right\}
                                                               \tag{0.5}
\]

has the principal Laplace branch in `Re z>0` and its inherited one-sided
continuation.  Formula (0.4) is unconditional.  Its proof first expands the
logarithmic derivative canonically and then inverts each pole.  A raw
`epsilon`-boundary contour shift is neither used nor licensed.

For `k>0`, set `a_rho=1-rho`.  The individual full zero contribution is

\[
\boxed{
 K_{\rho}^{\rm full}(k)
 =-{2c\over a_\rho^2+c^2}
 \left({a_\rho-ic\over a_\rho+ic}\right)^{ik/2}.}       \tag{0.6}
\]

The branch is inherited from the positive Laplace regulator.  Under the
rapidity substitution `tau=tanh y`, the part `|tau|<1` and the two exterior
parts satisfy the exact identities

\[
\boxed{
 K_\rho^{\rm int}(k)={K_\rho^{\rm full}(k)\over1-e^{-\pi k}},
 \qquad
 K_\rho^{\rm ext}(k)
 =-{e^{-\pi k}\over1-e^{-\pi k}}K_\rho^{\rm full}(k).} \tag{0.7}
\]

Thus the exterior completion does not cancel a large positive-gap interior
coefficient.  The two terms in (0.7) separately diverge when `k` tends to
zero and cancel in their sum.  The diagonal must be taken from (0.4) or
(0.6), not by substituting `k=0` into either separated term.

The functional-equation quartet only realifies (0.6).  It does not turn the
Hermitian kernel into a positive zero Gram.  Section 5 gives both an exact
difference-of-Grams identity and the missing zero reindexing which a
positive Gram would require.

Near the upper conductor collar, write

\[
 \rho=\sigma+i(c-r),\qquad x=1-\sigma .                 \tag{0.8}
\]

The exact leading squared envelope has its unique saddle at

\[
\boxed{r={kx\over2}.}                                   \tag{0.9}
\]

At that saddle a single zero can have size
`asymp e^(pi*k/2)/(k*x)`.  The functional-equation mate has `x` replaced by
`1-x`; it need not cancel.  A quartet-paired collar exponential-sum estimate,
stated precisely as an open gate in Section 7, is therefore indispensable.

Finally, (0.4) is an affine flat formula.  In the physical block the prime
shell is curved, the profiles are finite-`c` prolate profiles, and the
inward coordinate has a finite endpoint.  No shellwise curved composition,
physical sign, complete `PA`, central floor, determinant conclusion,
equation (5.2) of `DIRECT_RH_ATTACK.md`, or RH follows.  The project state
remains `P0_INVALIDATED`.

## 1. Frozen inputs and source status

The proof uses the following repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/NEAR_SIGNED_HANKEL_REDUCTION.md` | `fba7078c9695951fa7160e2587ff774dc1d10730bd94dc3efdec4b851ef9408e` |
| `tests/test_near_hankel_geometry_replay.py` | `9eea35b97e06cb942c36c14cbf489544965793bf89a2ca878c089cb00c11930c` |
| `notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md` | `1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d` |
| `tests/test_growing_transition_edge_carleman_scattering_obstruction.py` | `b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md` | `a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85` |
| `tests/test_growing_transition_complete_central_plemelj_cauchy_floor_theorem.py` | `b9f9cf3d76554b988d7c6d9408130a9ab2b45d37a1862279e139ed7e62edbe61` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_FINITE_FEJER_XI_WRONSKIAN_ASSEMBLY_GATE.md` | `41dad88fd3e5bcb3277ccadb6baaa4bfa40ab683d15c747bebe8a50ce759ff23` |
| `tests/test_growing_transition_finite_fejer_xi_wronskian_assembly_gate.py` | `dcb9640a5294ae5c44502f983f20f9eadcdf8271dd02099b9d3887f255460aee` |
| `notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md` | `18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b` |
| `tests/test_centered_zero_gram_simultaneous_vertex_subsequence.py` | `39ee34b725a27873143e140a3e4ba71489e8deb406eb73bbefde63ecb68fdc0d` |

The paired Hadamard product is the standard completed-`xi_R` product and is
also frozen in the last dependency.  No zero table, RH assumption,
zero-density estimate, short-interval zero estimate, or external source is
used.  In particular the collar estimate in Section 7 is not imported from
an unvendored source; it remains an explicit theorem input.

## 2. Complete boundary distribution and canonical inversion

The completed boundary functional for inward `a` and outward `b` is

\[
\begin{aligned}
 I_*(a,b)={}&2a(0)\langle\delta_*,b\rangle
 +2\int_0^L\{a'(s)-a(s)\}(H_{\delta_*}b)(s)\,ds\\
 &-2a(L)\langle\delta_*(L+\cdot),b\rangle .
\end{aligned}                                           \tag{2.1}
\]

After the retained endpoints are included, distributional integration by
parts gives the quadratic kernel `2*k_*`.  Its Laplace transform is

\[
 \mathcal L k_*(z)=-(z+1)D(z),\qquad
 (z+1)D(z)={\xi_R'\over\xi_R}(z+1)+C_0,                \tag{2.2}
\]

where `C_0` is constant.  The Weber convolution in (0.2) obeys

\[
 F_{\alpha\beta}(r)=\int_0^r
 w_{-\alpha}(u)w_\beta(r-u)\,du,qquad
 F_{\alpha\beta}(0)=0.                                 \tag{2.3}
\]

Use the canonical paired expansion

\[
 {\xi_R'\over\xi_R}(s)
 =B+\sum_\rho\left\{{1\over s-\rho}+{1\over\rho}\right\}. \tag{2.4}
\]

Every constant in (2.4) inverts to a multiple of `delta_0` and vanishes on
(2.3).  For one pole,

\[
 -{2\over1+cz-\rho}
 =-{2\over c}{1\over z+(1-\rho)/c}
 \quad\longleftrightarrow\quad
 -{2\over c}e^{-(1-\rho)r/c}.                           \tag{2.5}
\]

Pairing (2.5) with the convolution and using the Laplace convolution
identity proves (0.4).  For fixed `c` and bounded real energies,

\[
 -{2\over c}
 W_{-\alpha}\!\left({1-\rho\over c}\right)
 W_\beta\!\left({1-\rho\over c}\right)
 =O\!\left({c\over|\rho|^2}\right).                   \tag{2.6}
\]

Since the completed zero set has summable inverse squares, the resulting
zero series is absolutely convergent after the canonical constants have
been annihilated.  This termwise inverse-Laplace proof avoids two invalid
operations: the positive regulator gives opposite signs in the two Weber
factors, and no uniform zero-free strip permits a naive global shift of the
unexpanded logarithmic derivative.

## 3. Exact individual zero formula

For `Re z>0`, the flat transform is (0.5).  With `a=a_rho` and
`Delta=2k`, direct multiplication gives

\[
\begin{aligned}
 W_{-\alpha}(a/c)W_\beta(a/c)
 &={c^2\over a^2+c^2}
   \exp\left\{k\arctan{c\over a}\right\}\\
 &={c^2\over a^2+c^2}
   \left({a-ic\over a+ic}\right)^{ik/2}.
\end{aligned}                                           \tag{3.1}
\]

Here

\[
 \arctan{c\over a}
 ={1\over2i}\operatorname {Log}{a+ic\over a-ic}       \tag{3.2}
\]

is continued from the positive Laplace half-plane.  Equations (0.4) and
(3.1) prove (0.6), including its minus sign and factor `2c`.

The formal unexpanded boundary representation is

\[
 {1\over2\pi i}\int_{i\mathbb R}
 \left[-2{\xi_R'\over\xi_R}(1+cw)\right]
 W_{-\alpha}(-w)W_\beta(-w)\,dw .                      \tag{3.3}
\]

Formula (3.3) is a diagnostic boundary value, not the proof of (0.4).
Before the regulator is removed its two Weber arguments are not obtained by
one analytic substitution, the points `w=+/-i` are boundary branch points,
and zeros can approach the boundary from the left.  The legal route is
(2.4)--(2.6).

## 4. Rapidity interior and exterior completion

On `|tau|<1`, put `tau=tanh y`.  The Weber product and Jacobian give

\[
 \mathcal K_c^{\rm int}
 ={e^{\pi k/2}\over2\pi}
 \int_{\mathbb R}M_c(\tanh y)e^{iky}\,dy,             \tag{4.1}
\]

where a Hadamard pole contributes `-2/(a+ic*tanh y)`.  For `k>0` and
`Re a>0`, the inherited branch gives

\[
\boxed{
 \int_{\mathbb R}{e^{iky}\over a+ic\tanh y}\,dy
 ={\pi c\over(a^2+c^2)\sinh(\pi k/2)}
 \left({a-ic\over a+ic}\right)^{ik/2}.}              \tag{4.2}
\]

\[
 K_\rho^{\rm int}(k)
 =-{2c\over(1-e^{-\pi k})(a^2+c^2)}
 \left({a-ic\over a+ic}\right)^{ik/2},                \tag{4.3}
\]

which is the first identity in (0.7).  Subtracting it from (0.6) gives the
second.  For `k` of logarithmic size the exterior-to-full ratio is exactly
`-e^(-pi*k)/(1-e^(-pi*k))`; it is exponentially small.  This statement is
termwise and exact.  It does not estimate the coherent zero sum.

## 5. Quartets, missing Gram reindexing, and difference of Grams

Let `rho=sigma+i*gamma` be a generic zero with `gamma>0` and
`sigma!=1/2`.  Its functional-equation orbit is

\[
 \mathfrak Q(\rho)=\{\rho,\bar\rho,1-\rho,1-\bar\rho\}. \tag{5.1}
\]

Put

\[
 \Phi_\Delta(z)={1\over1+z^2}
 \exp\left\{{\Delta\over2}\arctan{1\over z}\right\}. \tag{5.2}
\]

Real symmetry and the functional equation give the exact ordered orbit

\[
\boxed{
 K_{\mathfrak Q}^{\rm ord}(\alpha,\beta)
 =-{4\over c}\operatorname {Re}\left\{
 \Phi_\Delta\!\left({1-\rho\over c}\right)
 +\Phi_\Delta\!\left({\rho\over c}\right)\right\}.}  \tag{5.3}
\]

Its Hermitian part is

\[
\boxed{
 H_{\mathfrak Q}(\alpha,\beta)
 =-{4\over c}\operatorname {Re}\left\{
 {\cosh\{\Delta A((1-\rho)/c)/2\}\over1+((1-\rho)/c)^2}
 +{\cosh\{\Delta A(\rho/c)/2\}\over1+(\rho/c)^2}
 \right\},}                                            \tag{5.4}
\]

where `A(z)=arctan(1/z)`.  If `Re rho=1/2`, the orbit has only two
elements and (5.3)--(5.4) contain only one of the displayed terms.  Using
the generic formula on the critical line would double count the orbit.

The orbit realification is not a Gram identity.  Indeed, a zero reindexing
which would turn

\[
 W_{-\alpha}(a/c)W_\beta(a/c)
\]

into `g_rho(alpha)*conj(g_rho(beta))` would require a second zero parameter
`a'` satisfying

\[
 A(a'/c)=-\overline{A(a/c)},\qquad
 {1\over1+(a'/c)^2}
 =\overline{{1\over1+(a/c)^2}}.                        \tag{5.5}
\]

Thus `a'=-conj(a)`, or equivalently `rho'=2-conj(rho)`.  Neither conjugation
nor the functional equation supplies that zero.  The actual mate replaces
`a` by `1-a` and only realifies the result.

There is also an exact finite-matrix difference-of-Grams formula.  On any
finite real energy set define

\[
 u_\rho(\alpha)=W_{-\alpha}(a_\rho/c),\qquad
 v_\rho(\alpha)=\overline{W_\alpha(a_\rho/c)}.          \tag{5.6}
\]

The ordered summand is `-(2/c)u_rho*v_rho^*`.  Hence its Hermitian part is

\[
\boxed{
 H_\rho={1\over2c}\left\{
 (u_\rho-v_\rho)(u_\rho-v_\rho)^*
 -(u_\rho+v_\rho)(u_\rho+v_\rho)^*\right\}.}          \tag{5.7}
\]

If `u_rho,v_rho` are linearly independent, the two nonzero eigenvalues of
`H_rho` have product

\[
 { |\langle u_\rho,v_\rho\rangle|^2
   -\|u_\rho\|^2\|v_\rho\|^2\over c^2}<0.             \tag{5.8}
\]

Thus an individual canonical Hermitian summand is indefinite.  Equivalently,
after conjugate pairing, `cosh(A*(alpha-beta)/2)` splits as
`C_A(alpha)C_A(beta)-S_A(alpha)S_A(beta)`.  These identities prove neither
that the complete sum has a prescribed inertia nor that no accidental
alternative representation exists; they prove that quartet symmetry alone
supplies no positive zero Gram.

## 6. Exact conductor-collar saddle

Write an upper-collar zero as in (0.8), with

\[
 a=x-i(c-r),\qquad 0<x<1,qquad0<r<2c.                 \tag{6.1}
\]

Put

\[
 \mathcal A(a)={1\over2i}\operatorname {Log}{a+ic\over a-ic}.
                                                               \tag{6.2}
\]

Then `K_rho^full=-2c*(a^2+c^2)^(-1)*exp(k*mathcal A)`, and direct
factorization gives

\[
\begin{aligned}
 \operatorname {Re}\mathcal A
 &={1\over2}\left\{
   \arctan{r\over x}+\arctan{2c-r\over x}\right\},\\
 \operatorname {Im}\mathcal A
 &={1\over4}\log{x^2+(2c-r)^2\over x^2+r^2},\\
 |a^2+c^2|
 &=\sqrt{(x^2+r^2)\{x^2+(2c-r)^2\}}.
\end{aligned}                                           \tag{6.3}
\]

Consequently

\[
\boxed{
 |K_\rho^{\rm full}(k)|
 ={2c\,e^{k\operatorname {Re}\mathcal A}
   \over\sqrt{(x^2+r^2)\{x^2+(2c-r)^2\}}}.}           \tag{6.4}
\]

If `r+x+k*x=o(c)`, this becomes

\[
 |K_\rho^{\rm full}(k)|^2
 ={e^{\pi k-k\arctan(x/r)}\over r^2+x^2}
 \left\{1+O\left({r+x+kx\over c}\right)\right\}.    \tag{6.5}
\]

The logarithmic derivative of the leading envelope is exactly

\[
 {d\over dr}\left\{-\log(r^2+x^2)
                    -k\arctan{x\over r}\right\}
 ={kx-2r\over r^2+x^2}.                                \tag{6.6}
\]

This proves the unique saddle (0.9).  When `1<<k` and `kx=o(c)`,

\[
 |K_\rho^{\rm full}(k)|_{r=kx/2}
 ={2e^{-1}\over kx}e^{\pi k/2}
 \left\{1+O(k^{-2}+kx/c)\right\}.                     \tag{6.7}
\]

One convenient phase convention at the saddle is inherited from

\[
 \Theta_{c,k}(x,r)=\pi
 +\arctan{2c-r\over x}-\arctan{r\over x}
 +{k\over4}\log{x^2+(2c-r)^2\over x^2+r^2}.          \tag{6.8}
\]

The conjugate contribution is `2*abs(K)*cos(Theta)`.  The positive-ordinate
functional mate `1-conj(rho)` has horizontal parameter `1-x` and therefore
a different saddle `r=k*(1-x)/2`.  Even RH only fixes `x=1/2`; it does not
control the cosine sum over ordinates.

## 7. The weakest collar exponential-sum input

The following is an explicit missing lemma, not a conclusion.

For `k>0`, let `chi` belong to `C_c^infinity((0,infinity))`, equal one on a
fixed neighborhood of `1`, and be supported in a fixed larger neighborhood
of `1`.  Choose one upper zero from each orbit of the involution
`rho -> 1-conj(rho)`, and write `rho=sigma+i(c-r)` and `x=1-sigma`.  Define
the model-free canonical collar sum

\[
\begin{aligned}
 \mathfrak C_{c,k}^{\rm can}(\chi)
 :=2\operatorname {Re}\sum_{\rho\in\mathcal R_c^+}^{\rm can}
 \biggl[&\chi\!\left({2r\over kx}\right)K_\rho^{\rm full}(k)\\
 &+\mathbf 1_{\{x\ne1/2\}}
 \chi\!\left({2r\over k(1-x)}\right)
 K_{1-\bar\rho}^{\rm full}(k)\biggr].
\end{aligned}                                           \tag{7.1}
\]

The two cutoffs in (7.1) are different because the two positive-ordinate
functional-equation mates have saddles at `kx/2` and `k(1-x)/2`.
Conjugates are included by taking twice the real part.  On the critical
line the involution fixes the upper zero, and the indicator prevents a
double count.

The weakest comparison hypothesis must name an explicit reference main
`mathfrak M_{c,k}(chi)`, derived independently of the individual zero
locations and supplied with whatever one-sided sign the intended
application needs.  It is then:

\[
\boxed{
 \mathfrak C_{c,k}^{\rm can}(\chi)-\mathfrak M_{c,k}(\chi)
 =o\!\left({e^{\pi k/2}\over k}\right)}                \tag{7.2}
\]

uniformly for the project conductors, `k` comparable to `log L`, and fixed
saddle cutoffs.  A smooth Riemann--von Mangoldt main alone is not admissible
at this accuracy.  On RH, at `x=1/2` and `r=k/4`, differentiation of (6.8)
gives

\[
 {\partial\Theta_{c,k}\over\partial\gamma}
 =2+O(k/c).                                            \tag{7.3}
\]

At the formal Fourier/stationary level, the explicit-formula frequencies
with `log n` near `2` are therefore stationary.  The scaled saddle for `n`
lies at

\[
 q_n={2\over\log n}.                                   \tag{7.4}
\]

That term is selected only if `chi(q_n)!=0`; when the cutoff is fixed and
nonzero there, its normalized stationary size is of order `k^(-1/2)`,
which is larger than the `o(k^(-1))` remainder in (7.2) after the common
exponential is removed.  For example,
`q_7=1.02779668...` and `q_8=0.96179669...`, so a cutoff covering those two
points selects the `n=7,8` von-Mangoldt terms.  A cutoff merely known to
equal one on an unspecified neighborhood of `1` need not select them.

This is a stationary diagnostic, not yet a legal use of the Weil formula:
a compact smooth ordinate cutoff does not by itself justify the infinite
prime sum.  An admissible `mathfrak M_{c,k}` must first supply an analytic
or Abel localization, and then explicitly extract the smooth term **and
every finite stationary prime/prime-power term selected by the fixed
cutoff** before (7.2) is requested.  RH, zero density, or ordinary
unweighted averaging does not perform those steps.

Off RH, Riemann--von Mangoldt fixes only the ordinate marginal; it supplies
no canonical marked `(x,gamma)` density.  Thus any off-line smooth main
with horizontal marks is a further hypothesis, in addition to the finite
stationary arithmetic extraction.  A model-free one-sided bound on (7.1),
relative to the required application floor, is an equivalent sufficient
replacement for (7.2).

For zeros with `x` tending to zero, either version must retain the visible
`1/x` weight from (6.7), or impose a separate horizontal-zero control.  The
mate `x -> 1-x` does not remove that loss.

Equation (7.2), after the stationary terms just specified have been
extracted and together with separately proved one-sided control of the
resulting explicit main, is the weakest scalar input separating a reference
collar main from the canonical zero sum at the scale of one saddle packet.
An operator conclusion on a growing energy set additionally requires a
Schur/Bessel upgrade.  The classical local count
`N(T+1)-N(T)=O(log T)`, even if inserted, yields only the absolute bound
`O(log c)` times the single-zero envelope and does not prove (7.2).
No legal collar localization, stationary-term extraction, admissible main,
one-sided estimate, or exponential-sum comparison is frozen here.

## 8. Affine formula versus the physical curved block

The exact affine object proved above is

\[
 \mathcal K_c^{\rm flat}(\alpha,\beta)
 ={2\over c}\int_0^\infty\!\int_0^\infty
 k_*\!\left({U+V\over c}\right)
 w_{-\alpha}(U)w_\beta(V)\,dV\,dU.                    \tag{8.1}
\]

By contrast, after the exact finite-`c` edge substitutions the physical
dimensionless kernel is

\[
\boxed{
 \mathcal K_c^{\rm phys}(\alpha,\beta)
 =2\int_0^{U_L}\!\int_0^\infty
 {k_*\!\left(\log{c+V\over c-U}\right)\over c-U}
 p_{c,\alpha}(U)q_{c,\beta}(V)\,dV\,dU,}              \tag{8.2}
\]

with `U_L=c*(1-lambda^(-2))`.  The omitted modal endpoint and scattering
factors multiply (8.2) outside this dimensionless kernel; they do not turn
(8.2) into (8.1).

The mismatch is macroscopic on every prime shell.  In (8.1) a prime `n`
lies on

\[
 U+V=c\log n,                                          \tag{8.3}
\]

whereas in (8.2) it lies on

\[
 1+{V\over c}=n\left(1-{U\over c}\right).             \tag{8.4}
\]

Their intercepts differ by `c*(n-1-log n)` and their slopes differ by
`n-1`.  They may meet at one point, but their displacement is order `c` on
generic macroscopic portions of the edge.  Local fixed-`U,V` Weber
convergence therefore does not compare the full shell integrals.  A
physical promotion needs a shellwise curved two-profile composition
theorem, with the finite inward endpoint, exact scattering normalization,
source congruence, and all mixed sampler axes retained.  Neither the exact
zero sum (0.4), the small exterior ratio (0.7), nor the collar hypothesis
(7.2) supplies that theorem.

## 9. Exact conclusion

The complete affine calculation proves:

1. the canonical zero-residue formula (0.4), with absolute convergence;
2. the exact full, rapidity-interior, and rapidity-exterior coefficients
   (0.6)--(0.7);
3. the quartet formulas (5.3)--(5.4), including the RH no-double-count rule;
4. the missing zero reindexing (5.5) and the exact difference of Grams
   (5.7);
5. the conductor-collar saddle `r=kx/2` and its exponential size; and
6. the precise scalar collar cancellation target (7.2).

It does not prove (7.2), an operator upgrade of (7.2), or the curved
composition from (8.1) to (8.2).  Therefore it supplies an exact
obstruction/target, not a complete-central sign theorem.
