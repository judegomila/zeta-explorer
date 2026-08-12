# Locally uniform determinant attack

## 0. Claim boundary and outcome

This note asks whether the finite determinant theorem can close the direct
bridge without first proving the residual--gap estimate (5.2) of
`DIRECT_RH_ATTACK.md`.

There is an exact alternative criterion.  Normalize each finite even
transform at one fixed nonreal point `i*sigma`, with
`0<sigma<1/2`.  Its paired zero resolvent is a positive trace-class
operator.  Local uniform convergence to `Xi` is equivalent to convergence
of all of its trace moments to constants obtained directly from derivatives
of `Xi`; no zeta-zero list and no reality assumption on the zeros of `Xi`
enters those constants.  Equivalently, one may prove Hilbert--Schmidt
convergence of the symmetrically paired resolvents together with
identification of the limiting modified Fredholm determinant.

This criterion genuinely removes the source boundary scalar and the
projected-state scalar.  It does **not** remove the need to control the exact
finite ground line.  On schedules with `N/(log lambda)^2 -> infinity`, the
unperturbed Fourier-tail contribution to every trace moment vanishes
explicitly, but no current estimate controls the remaining finite quotient
trace, not even its first moment.

An exact diagonal Cauchy-matrix family below satisfies positivity,
simple-evenness, inversion commutation, the source commutator, and nonzero
boundary normalization at every finite stage, while its first paired
resolvent trace diverges like `log lambda`.  Thus the finite determinant
theorem and its structural hypotheses do not imply a normal family.  The
example is not the actual Weil matrix; it is a sharp logical obstruction to
deducing convergence from the presently available abstract inputs.

No locally uniform determinant limit, signed Weil floor, equation (5.2), or
Riemann-hypothesis conclusion is proved.  The project state remains
`P0_INVALIDATED`.

The binding finite source is Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The exact inputs are printed pp. 16--24, especially (5.2)--(5.5),
(5.15), (5.17), (5.25), (5.27), and Theorem 5.10.  The source's proposed
limit on pp. 27--32 is used only with the factor-four and omitted-tail
repairs in `P0_NORMALIZATION_AUDIT.md` and
`notes/DETERMINANT_LIMIT_AUDIT.md`.

## 1. The finite even characteristic function

Fix `lambda>1`, put

\[
 L=2\log\lambda,
\]

and suppose the exact finite Weil matrix has a simple inversion-even lowest
eigenvector `xi_(lambda,N)`.  The source Cauchy commutator then gives the
nonzero boundary pairing needed by Theorem 5.10.  The scale of `xi` will not
be fixed here.

Let

\[
 f_{\lambda,N}(z)=\widehat\xi_{\lambda,N}(z) .       \tag{1.1}
\]

The source Mellin convention, zero extension, and inversion symmetry give

\[
 f_{\lambda,N}(-z)=f_{\lambda,N}(z).                \tag{1.2}
\]

By Theorem 5.10, `f_(lambda,N)` is an entire function of exponential type
at most `L/2`, and all of its zeros are real.  The zero multiset is the
disjoint union, with multiplicity, of

1. the `2N` eigenvalues of the finite self-adjoint quotient operator
   \(D_{\log}^{(\lambda,N)}|_{E'_N}\); and
2. the Fourier-tail lattice

\[
 \left\{{2\pi n\over L}: |n|>N\right\}.             \tag{1.3}
\]

Evenness pairs the complete multiset as `+/-rho`.  A zero at the origin has
even multiplicity.  Let `R_(lambda,N)` contain one `rho>=0` from each pair,
with half the origin multiplicity.

Fix once and for all

\[
 0<\sigma<{1\over2}.                                \tag{1.4}
\]

The convenient completely explicit choice is `sigma=1/4`.  The value
`Xi(i*sigma)` is nonzero without any zero hypothesis: its zeta argument is
`1/2-sigma` in `(0,1)`, where the alternating eta series is positive and
`zeta(s)=eta(s)/(1-2^(1-s))` is negative.

Every zero of (1.1) is real, so

\[
 f_{\lambda,N}(i\sigma)\ne0.                        \tag{1.5}
\]

Define the paired shifted inverse-square operator abstractly on
`ell^2(R_(lambda,N))` by

\[
 K_{\lambda,N;\sigma}
 =\operatorname {diag}_{\rho\in R_{\lambda,N}}
       {1\over \rho^2+\sigma^2}.                    \tag{1.6}
\]

It is positive trace class, satisfies

\[
 0\le K_{\lambda,N;\sigma}\le\sigma^{-2}I,          \tag{1.7}
\]

and includes both the finite quotient spectrum and the infinite lattice
tail.

### Proposition 1.1 (exact off-axis Fredholm formula)

For every complex `z`,

\[
 \boxed{
 {f_{\lambda,N}(z)\over f_{\lambda,N}(i\sigma)}
 =\det\!\left(I-(z^2+\sigma^2)
                  K_{\lambda,N;\sigma}\right).}     \tag{1.8}
\]

**Proof.**  An even entire function of order at most one has the paired
Hadamard factorization

\[
 f(z)=Cz^{2r}\prod_{\rho>0}\left(1-{z^2\over\rho^2}\right), \tag{1.9}
\]

because an order-one zero set has `sum_(rho>0) rho^(-2)<infinity`.  The quotient
of the two sides is a zero-free entire function of order at most one, hence is
`exp(a*z+b)`; evenness forces `a=0`.  Dividing (1.9) by its value at
`i*sigma`, including the origin factors, gives

\[
 {f(z)\over f(i\sigma)}
 =\prod_{\rho\in R}
   {\rho^2-z^2\over\rho^2+\sigma^2}
 =\prod_{\rho\in R}
   \left(1-{z^2+\sigma^2\over\rho^2+\sigma^2}\right),
\]

which is the ordinary Fredholm determinant in (1.8).  \(\square\)

The normalization in (1.8) is invariant under **every** nonzero rescaling
of the finite eigenvector.  In particular, neither a quantitative lower
bound for the source boundary value nor convergence of the natural scalar
`4*||P_N k_lambda^+||` is needed for this route.

## 2. A necessary and sufficient trace-moment theorem

Since `Xi` is even, there is a unique entire function `Phi` such that

\[
 \Phi(z^2)=\Xi(z).                                   \tag{2.1}
\]

Define the source-free target in the variable `t=z^2+sigma^2` by

\[
 \Psi_\sigma(t)
 ={\Phi(t-\sigma^2)\over\Phi(-\sigma^2)}.           \tag{2.2}
\]

Thus `Psi_sigma(0)=1`, and its Taylor coefficients are obtained directly
from `Xi` at `i*sigma`.  For every integer `m>=1`, put

\[
 \boxed{
 \tau_m(\sigma)
 =-{1\over(m-1)!}
   \left.{d^m\over dt^m}\log\Psi_\sigma(t)
   \right|_{t=0}.}                                  \tag{2.3}
\]

The logarithm in (2.3) is only the local analytic branch equal to zero at
the origin.  Formula (2.3) does not use a zero table and does not assume
that a zero of `Xi` is real.

For a sequence `(lambda_j,N_j)` satisfying the finite simple-even
hypotheses, write `f_j=f_(lambda_j,N_j)` and `K_j=K_(lambda_j,N_j;sigma)`,
and set

\[
 G_j(z)=\Xi(i\sigma){f_j(z)\over f_j(i\sigma)}.      \tag{2.4}
\]

Every `G_j` has only real zeros.

### Theorem 2.1 (trace moments are exactly the determinant limit)

The following are equivalent.

1. `G_j -> Xi` locally uniformly on the open strip `|Im z|<1/2`.
2. For every integer `m>=1`,

\[
 \boxed{
 \operatorname {tr}(K_j^m)\longrightarrow
       \tau_m(\sigma).}                            \tag{2.5}
\]

If either condition holds, the convergence in fact extends locally
uniformly to the whole complex plane.

**Proof.**  Write

\[
 D_j(t)=\det(I-tK_j).
\]

By (1.8), `G_j(z)/Xi(i*sigma)=D_j(z^2+sigma^2)`.

Suppose first that the convergence in item 1 holds.  A neighborhood of
`z=i*sigma` maps biholomorphically to a neighborhood of `t=0`.  Hence
`D_j -> Psi_sigma` locally there.  Since the limit is one at zero, the
local logarithms converge with all derivatives.  The finite or trace-class
identity

\[
 \log D_j(t)
 =-\sum_{m\ge1}{t^m\over m}\operatorname {tr}(K_j^m) \tag{2.6}
\]

then gives (2.5).

Conversely, the case `m=1` of (2.5) gives a finite constant `C` such that

\[
 \operatorname {tr}K_j\le C                         \tag{2.7}
\]

eventually.  Positivity implies

\[
 \|K_j\|\le\operatorname {tr}K_j\le C,
 \qquad
 \operatorname {tr}(K_j^m)\le C^m.                 \tag{2.8}
\]

On `|t|<1/(2C)`, equations (2.5)--(2.8) permit dominated passage in
(2.6), so `D_j -> Psi_sigma` on a neighborhood of zero.  Globally,

\[
 |D_j(t)|\le\exp(|t|\operatorname {tr}K_j)
             \le e^{C|t|}.                         \tag{2.9}
\]

Thus the `D_j` form a normal family on the whole `t`-plane.  Every
subsequential limit agrees with `Psi_sigma` near zero and hence everywhere
by the identity theorem.  Substitution `t=z^2+sigma^2` proves whole-plane
local uniform convergence of (2.4).  \(\square\)

The theorem also exposes immediate necessary inequalities.  If (2.5) is
true, then

\[
 0\le\tau_m(\sigma)
 \le\sigma^{-2(m-1)}\tau_1(\sigma)                 \tag{2.10}
\]

for every `m`.  Proving (2.5), rather than assuming a real zero
representation of `Xi`, would itself force these inequalities and the
real-zero conclusion.

### Corollary 2.2 (normal-family plus uniqueness-set criterion)

It is equivalently sufficient to prove

\[
 \sup_j\operatorname {tr}K_j<\infty                \tag{2.11}
\]

and pointwise convergence of (2.4) to `Xi` on any set with an accumulation
point, for example a nontrivial real interval.  Bound (2.9), Montel's
theorem, and the identity theorem then give the local uniform limit.  This
is a genuine characteristic-function criterion; real-axis eigenvalue
agreement without (2.11) is not one.

## 3. Hilbert--Schmidt and trace-class formulations

Let `mathcal D_j` denote the full source self-adjoint operator whose
spectrum is the zero multiset of `f_j`, with its induced quotient metric on
`E'_N` and the ordinary metric on the Fourier tail.  Symmetric pairing gives

\[
 \left\|(\mathcal D_j-i\sigma)^{-1}\right\|_{\mathfrak S_2}^2
 =2\operatorname {tr}K_j.                           \tag{3.1}
\]

Thus (2.11) is exactly a uniform Hilbert--Schmidt resolvent bound.  The
resolvent is generally not trace class: its two-sided lattice singular
values have a harmonic tail.

In finite symmetric truncations, and then by Hilbert--Schmidt passage, the
modified determinant satisfies

\[
 \boxed{
 {f_j(z)\over f_j(i\sigma)}
 =e^{-2i\sigma(z-i\sigma)\operatorname {tr}K_j}
   \det{}_2\!\left(
     I-(z-i\sigma)(\mathcal D_j-i\sigma)^{-1}
                \right).}                          \tag{3.2}
\]

Indeed, for a pair `+/-rho`, the two rational factors give
`(rho^2-z^2)/(rho^2+sigma^2)`, while the two regularizing exponentials give
`exp(2*i*sigma*(z-i*sigma)/(rho^2+sigma^2))`.

Consequently either of the following is a sufficient operator route.

1. After ordering the paired spectra on one `ell^2`, prove trace-norm
   convergence `K_j -> K` and identify

\[
 \det(I-tK)=\Psi_\sigma(t).                         \tag{3.3}
\]

2. Embed the self-adjoint spectral spaces in one Hilbert space, prove
   Hilbert--Schmidt convergence of the shifted resolvents in (3.2), and
   identify the corrected limiting `det_2` with (2.2).

Continuity of `det` in trace norm and of `det_2` in Hilbert--Schmidt norm
then supplies the limit.  Neither convergence has been proved for the
finite Weil operators.  Strong resolvent convergence alone supplies
neither (2.11) nor determinant convergence.

## 4. The Fourier tail is explicit

Let `B_(lambda,N)` be the `2N`-dimensional quotient operator
`D_log^(lambda,N)|_(E'_N)`.  Its spectrum is symmetric.  Equations
(1.3) and (1.6) give the exact split

\[
 \boxed{
 \operatorname {tr}(K_{\lambda,N;\sigma}^m)
 ={1\over2}\operatorname {Tr}_{E'_N}
       (B_{\lambda,N}^2+\sigma^2)^{-m}
 +\sum_{n>N}
   {1\over((2\pi n/L)^2+\sigma^2)^m}.}              \tag{4.1}
\]

For every `m>=1`, the second term has the elementary bound

\[
 \boxed{
 0\le T^{\rm tail}_{m}(L,N)
 \le {1\over2m-1}
      \left({L\over2\pi}\right)^{2m}N^{1-2m}.}      \tag{4.2}
\]

In particular,

\[
 T^{\rm tail}_{1}(L,N)\le {L^2\over4\pi^2N}.        \tag{4.3}
\]

Hence the simple schedule condition

\[
 {N\over L^2}\longrightarrow\infty                \tag{4.4}
\]

makes every lattice-tail trace moment vanish.  Both the quadratic schedules
`N` asymptotic to `lambda^2` and the locked exponential schedule are far
inside (4.4).  On such a schedule, Theorem 2.1 reduces exactly to

\[
 {1\over2}\operatorname {Tr}_{E'_N}
       (B_{\lambda,N}^2+\sigma^2)^{-m}
 \longrightarrow\tau_m(\sigma)
 \qquad(m=1,2,\ldots).                              \tag{4.5}
\]

This is the finite quotient trace target.  The rough dimensional estimate
is only

\[
 {1\over2}\operatorname {Tr}_{E'_N}
       (B_{\lambda,N}^2+\sigma^2)^{-m}
 \le N\sigma^{-2m},                                 \tag{4.6}
\]

which diverges and is useless for (2.11).

The first trace also has a direct ground-vector formula.  In centered log
coordinates, write

\[
 f_j(z)=\int_{-L_j/2}^{L_j/2}\xi_j(x)e^{-izx}\,dx . \tag{4.7}
\]

Differentiating (1.8) at `z=i*sigma` gives

\[
 \boxed{
 \operatorname {tr}K_j
 =-{f'_j(i\sigma)\over2i\sigma f_j(i\sigma)}
 ={\displaystyle\int x\sinh(\sigma x)\xi_j(x)\,dx
   \over
   \displaystyle2\sigma\int\cosh(\sigma x)\xi_j(x)\,dx}.} \tag{4.8}
\]

The last equality uses inversion evenness.  Higher traces are universal
polynomials in the normalized derivatives
`f_j^(r)(i*sigma)/f_j(i*sigma)`, hence in exponentially weighted signed
log-moments of the ground vector.  This is weaker information than complete
`L2` convergence, but none of these ratios is currently controlled on an
unbounded Weil schedule.

## 5. Exact finite-hypothesis countermodel

The finite source structure alone does not bound (4.8).  On
`E_N=span{V_n:|n|<=N}`, define

\[
 T_{L,N}V_0=0,
 \qquad
 T_{L,N}V_n=V_n\quad(0<|n|\le N).                  \tag{5.1}
\]

This is exactly of source Cauchy form (5.2): take

\[
 b_n=0,
 \qquad a_0=0,
 \qquad a_n=1\ (n\ne0).                            \tag{5.2}
\]

It is positive, has the simple inversion-even kernel `C*V_0`, commutes with
inversion, and satisfies the rank-two commutator with `beta=0`.  Since
`D V_0=0`, the exceptional branch of the source boundary proof gives
`<eta,V_0>=1`; the exact boundary value is nonzero.  Thus every finite
structural hypothesis used by the determinant theorem is present.

The centered transform of the kernel vector is

\[
 f_L(z)={2\sin(zL/2)\over\sqrt L\,z}.               \tag{5.3}
\]

Its zeros are the full real lattice `+/-2*pi*n/L`, independently of `N`:
the finite quotient simply restores the central lattice zeros removed from
the Fourier tail.  Off-axis normalization gives

\[
 {f_L(z)\over f_L(i\sigma)}
 ={\sigma\sin(zL/2)\over z\sinh(\sigma L/2)}.       \tag{5.4}
\]

At `z=i*sigma` this equals one, while at `z=0` it equals

\[
 {\sigma L\over2\sinh(\sigma L/2)}\longrightarrow0. \tag{5.5}
\]

In fact (5.4) tends to zero at every fixed point with
`|Im z|<sigma`, while it is identically one at `z=i*sigma`.  A locally
uniform limit on the connected strip would vanish on an open set and hence
at `i*sigma`, a contradiction.  More quantitatively, the classical partial
fraction for `coth` gives

\[
 \boxed{
 \operatorname {tr}K_{L,N;\sigma}
 =\sum_{n=1}^{\infty}{1\over(2\pi n/L)^2+\sigma^2}
 ={L\over4\sigma}\coth(\sigma L/2)
  -{1\over2\sigma^2}
 \sim {L\over4\sigma}.}                            \tag{5.6}
\]

The divergence persists for arbitrary `N`, even if `N/L^2 -> infinity`.
It is the finite quotient contribution, not the harmless far lattice tail.

This countermodel is deliberately not asserted to be an arithmetic Weil
matrix.  It proves that positivity, simple-evenness, the exact Cauchy form,
the commutator, and boundary nonvanishing do not imply (2.11).  Any proof
for the actual matrices must use additional arithmetic information about
their ground lines or quotient spectra.

## 6. Comparison with the current bridge estimates

The present repository proves none of (2.5), (2.11), or (4.5).

1. The scalar cancellation `q_lambda(p,p)=o(d_8)` controls one quadratic
   energy.  It does not control the ground spectral projector, the induced
   quotient operator `B_(lambda,N)`, or the weighted ratio (4.8).
2. Whole-target mixed-prefix capture is unitarily equivalent to the complete
   shifted physical Weil operator.  It preserves its spectrum and inertia;
   it supplies no convergence of the different scaling quotient operator
   in (4.1).
3. Fixed-parameter high-tail capture is onto, but its right inverses have the
   proved `R^(d-1/2)` lower blowup.  Neither onto-ness nor the positive
   defect comparison bounds a trace in (4.5).
4. The projection theorem controls the explicit prolate comparison state,
   not the exact ground line.  It enters a determinant proof only after a
   ground-line comparison is supplied.
5. Finite real-axis eigenvalue agreement cannot replace (2.11); the exact
   family (5.1)--(5.6) has real zeros at every finite stage but is not even
   a normal family after off-axis normalization.

`notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md` supplies another valid
weakening of equation (5.2): a sufficiently accurate projective comparison
on low log-Fourier modes, together with the explicit high-mode transform
bound, is enough for characteristic convergence.  That route and the trace
route here are complementary.  The projective theorem still requires an
unproved low-mode comparison with the exact simple-even ground line; the
trace theorem instead requires all normalized weighted moments, or an
equivalent Hilbert--Schmidt resolvent theorem.

## 7. Exact alternative obligation

A determinant-only completion may therefore replace the residual--gap
estimate by the following source-explicit program on one deterministic
unbounded schedule.

1. Prove the exact finite Weil ground eigenvalue is simple and inversion
   even at every sufficiently large index.
2. Choose `N(lambda)` with `N/(log lambda)^2 -> infinity`, so the explicit
   tail (4.2) vanishes.
3. For one fixed rational `sigma` in `(0,1/2)`, prove either every quotient
   trace limit (4.5), or a common-space Hilbert--Schmidt resolvent limit that
   identifies (3.2) with `Psi_sigma`.

No boundary reserve, unit-vector amplitude, or complete `L2` angle is part
of this obligation.  Its unresolved core is nevertheless the same exact
ground-line arithmetic in a different topology.  Current bounds do not
establish even the uniform first-trace gate (2.11), so locally uniform
determinant convergence remains open.
