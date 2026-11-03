# The scalar Ewald pivot: harmonic compensation and a renormalized Abel path

## Scope and outcome

`EWALD_FRACTIONAL_PLACEMENT_NEXT.md` distinguishes the actual paid scalar

\[
 \mathfrak q(\pi)=\sum_{m\geq1}J_\pi(m)          \tag{1}
\]

from the stronger pointwise sine family. This note attacks (1) directly,
with the globally corrected residual

\[
 \pi=p-q_X+q_{Q^{-1}r}=p-q_A                    \tag{2}
\]

formed before every decomposition. It obtains three exact results.

1. The scalar pivot is one harmonic-weighted half-space in the second
   differences of the assembled samples `m J_pi(m)`. This half-space is
   strictly weaker than fractional placement and permits signed compensation
   between all indices.
2. The seam-free Ewald cells have a closed Euler-renormalized Abel generating
   function. Its continuum counterterm cancels the divergent polylogarithmic
   mode at the endpoint, and the paid pivot is the endpoint of one smooth
   scalar path. This gives a direct theta/polylog target without splitting
   the feature, residue, or mismatch channels.
3. Self-duality, the endpoint conditions, all forced curvature moments, and
   any finite collection of sample or Ewald-cell values do not determine the
   scalar sign. A distributional interpolation theorem proves this without a
   numerical grid. Thus a finite sample replay can only test a proposed
   complete-theta inequality; it cannot supply the missing analytic input.

No sign theorem is proved for the actual complete-theta residual. The new
identities expose a closer scalar target and a structural no-go for finite
Ewald coordinates; they do not prove a paid border, the first Xi Laguerre
inequality, or RH.

## 1. The exact scalar half-space

The audited correlation-domain argument gives

\[
 J_\pi\in\mathcal S(\mathbb R),\qquad
 J_\pi(-x)=J_\pi(x),\qquad
 \widehat J_\pi=J_\pi,\qquad J_\pi(0)=0.        \tag{3}
\]

Put

\[
 a_m=mJ_\pi(m),\qquad
 \Delta a_m=a_m-a_{m+1},\qquad
 b_m=\Delta^2a_m=a_m-2a_{m+1}+a_{m+2}.          \tag{4}
\]

Every sequence in (4) is rapidly decreasing. Therefore the discrete
reconstructions

\[
 \Delta a_m=\sum_{k\geq m}b_k,\qquad
 a_m=\sum_{k\geq m}(k-m+1)b_k                  \tag{5}
\]

are absolutely convergent. Let

\[
 H_k=\sum_{j=1}^k{1\over j},\qquad
 W_k=(k+1)H_k-k
     =\sum_{m=1}^k{k-m+1\over m}.               \tag{6}
\]

Substituting first one and then both identities in (5) into (1) gives

\[
 \boxed{
 \mathfrak q(\pi)
 =\sum_{k\geq1}H_k\Delta a_k
 =\sum_{k\geq1}W_k b_k.}                       \tag{7}
\]

The weights are explicit and positive:

\[
 W_{k+1}-W_k=H_{k+1}>0,
 \qquad W_k-2W_{k+1}+W_{k+2}={1\over k+2}>0.   \tag{8}
\]

Thus the actual scalar target in the second-difference coordinates of the
preceding note is the single signed compensation inequality

\[
 \boxed{
 \sum_{k\geq1}W_k\Delta^2[kJ_\pi(k)]\geq0.}    \tag{9}
\]

It is important that (9) is one half-space, not the termwise cone
`Delta^2[kJ_pi(k)]>=0`.

### Relation to the triangular sine kernels

Let

\[
 T_k(\theta)=\sum_{m=1}^k(k-m+1)\sin(m\theta)
\]

be the nonnegative triangular kernel from
`EWALD_FRACTIONAL_PLACEMENT_NEXT.md`. Direct integration gives, for every
integer `m>=1`,

\[
 \int_0^{1/2}\left({1\over2}-r\right)
       \sin(2\pi mr)\,dr={1\over4\pi m}.         \tag{10}
\]

Consequently

\[
 \boxed{
 \int_0^{1/2}\left({1\over2}-r\right)
       T_k(2\pi r)\,dr={W_k\over4\pi}.}         \tag{11}
\]

Integrating the exact sine decomposition

\[
 \mathcal F_\pi(r)=4\pi\sum_{k\geq1}b_kT_k(2\pi r)
\]

against the positive weight in (11) recovers (7). Hence fractional placement
requires the whole family

\[
 \sum_{k\geq1}b_kT_k(\theta)\geq0
 \quad(0\leq\theta\leq\pi),                     \tag{12}
\]

whereas the target requires only (9). The self-dual source `J_*` in the
preceding note has positive (7) and a negative value in (12), so the scalar
half-space is strictly larger even inside the even self-Fourier Schwartz
class with `J(0)=0`.

Every entry in (9) remains an assembled complete-theta directional value. If

\[
 C_x(t)={1\over2}\operatorname {Re}\{K(t)x^{-s}\},
 \qquad s={1\over2}-it,
\]

then

\[
 b_k={1\over\pi}\int_{\mathbb R}
 \mathcal B(\Xi,D_k)(t)|P_\pi(t)|^2dt,           \tag{13}
\]

with the three-scale packet

\[
 D_k=kC_k-2(k+1)C_{k+1}+(k+2)C_{k+2}.           \tag{14}
\]

Thus (9) does not estimate positive channels separately and does not drop
`q_(Q^(-1)r)`. It is an exact coordinate change, not a positivity proof.

## 2. The Euler-renormalized Abel path

The raw orbit series cannot simply be Abel-summed at the source level. The
individual Mellin waves decay only as `m^(-1/2)`, and the leading polylogarithm
diverges as its Abel parameter approaches one. The left Ewald cell supplies
the required continuum subtraction.

Retain the exact left-cell Mellin remainder

\[
 d_n(s)=n^{-s}
 -{n^{1-s}-(n-1)^{1-s}\over1-s},
 \qquad0<\operatorname {Re}s<1.                 \tag{15}
\]

For `0<=z<1`, its generating function has the closed form

\[
 \boxed{
 D(z,s):=\sum_{n\geq1}z^nd_n(s)
 =\operatorname {Li}_s(z)
 -{1-z\over1-s}\operatorname {Li}_{s-1}(z).}   \tag{16}
\]

Indeed,

\[
 \sum_{n\geq1}z^n
 \{n^{1-s}-(n-1)^{1-s}\}
 =(1-z)\operatorname {Li}_{s-1}(z).             \tag{17}
\]

The second term in (16) is not optional. With `z=e^(-mu)`, the singular
polylogarithm terms are

\[
 \operatorname {Li}_s(e^{-\mu})
 =\Gamma(1-s)\mu^{s-1}+\zeta(s)+O(\mu),
\]

\[
 {1-e^{-\mu}\over1-s}
 \operatorname {Li}_{s-1}(e^{-\mu})
 =\Gamma(1-s)\mu^{s-1}+o(1).                   \tag{18}
\]

They cancel exactly, and therefore

\[
 \boxed{\lim_{z\uparrow1}D(z,s)=\zeta(s).}      \tag{19}
\]

This is the generating-function form of the Ewald/Euler counterterm, not an
insertion of analytic continuation after the fact.

Let

\[
 E_n(t)=C_n(t)-\int_{n-1}^nC_x(t)dx
       ={1\over2}\operatorname {Re}\{K(t)d_n(s)\},              \tag{20}
\]

and define its Abel sum

\[
 \mathcal E_z(t)=\sum_{n\geq1}z^nE_n(t)
 ={1\over2}\operatorname {Re}\{K(t)D(z,s)\}.    \tag{21}
\]

The seam-free Ewald convergence proved in
`MODULAR_EWALD_GROUPING_NEXT.md` gives

\[
 \mathcal E_1(t)=\Xi(t)                          \tag{22}
\]

in the weighted Fourier topology required by every fixed polynomial
residual.

For the same globally corrected `pi`, put

\[
 e_n(\pi)={1\over\pi}\int_{\mathbb R}
 \mathcal B(\Xi,E_n)(t)|P_\pi(t)|^2dt.           \tag{23}
\]

Linearity of the continuous-scale source gives the elementary scalar formula

\[
 \boxed{
 e_n(\pi)=J_\pi(n)-\int_{n-1}^nJ_\pi(x)dx.}     \tag{24}
\]

Because `J_pi` is Schwartz, `(e_n)` is rapidly decreasing. Hence

\[
 \mathcal S_\pi(z):=\sum_{n\geq1}e_n(\pi)z^n    \tag{25}
\]

is smooth through `z=1`. For `0<=z<1`, equations (21) and (23) yield the
fully assembled identity

\[
 \boxed{
 \mathcal S_\pi(z)
 ={1\over\pi}\int_{\mathbb R}
 \mathcal B(\Xi,\mathcal E_z)(t)|P_\pi(t)|^2dt.} \tag{26}
\]

At the endpoint, use `int_0^infinity J_pi=J_pi(0)/2=0` and (24):

\[
 \boxed{
 \mathcal S_\pi(1)
 =\sum_{n\geq1}e_n(\pi)
 =\sum_{n\geq1}J_\pi(n)
 =\mathfrak q(\pi).}                            \tag{27}
\]

Thus (27) is a direct seam-free Abel path from zero to the actual pivot. It
retains the complete Ewald counterterm and the regression mismatch before the
sum is formed.

For `0<z<1`, differentiation of (16) gives

\[
 \partial_zD(z,s)
 ={\operatorname {Li}_{s-1}(z)\over z}
 +{\operatorname {Li}_{s-1}(z)\over1-s}
 -{1-z\over z(1-s)}\operatorname {Li}_{s-2}(z). \tag{28}
\]

At the scalar level,

\[
 \mathcal A_\pi(z):=\mathcal S_\pi'(z)
 =\sum_{n\geq1}ne_n(\pi)z^{n-1}                 \tag{29}
\]

extends continuously, indeed smoothly, to `z=1`, and

\[
 \boxed{
 \mathfrak q(\pi)=\int_0^1\mathcal A_\pi(z)dz.} \tag{30}
\]

The unpaired polylogarithms in (28) need not have a source-level limit term by
term. The endpoint in (29) must be taken after the Ewald combination and the
complete correlation. Treating the first term of (16) alone would restore
the divergent continuum mode that (15) removes.

Equation (30) is closer to the scalar target than fractional placement: it
allows arbitrary sign changes of `A_pi` as long as their one-dimensional
integral is nonnegative. Proving `A_pi(z)>=0` pointwise would again be a
strictly stronger route. A useful continuation should instead seek a
theta-specific signed bound on the complete integral in (30), with all three
polylogarithmic terms in (28) retained.

## 3. Finite Ewald data cannot determine the scalar sign

The limitation of finite sampling can be made exact. Let

\[
 \mathscr S_+^0=\{J\in\mathcal S(\mathbb R;\mathbb R):
 J(-x)=J(x),\ \widehat J=J,\ J(0)=0\}.           \tag{31}
\]

Every member of this space has all the generic constraints used by the Ewald
reduction:

\[
 J'(0)=0,\qquad \int_0^\infty J(x)dx=0,
 \qquad\int_0^\infty x^jJ''(x)dx=0
 \quad(j=0,1,2).                                 \tag{32}
\]

Define the scalar lattice functional and the left-cell functionals

\[
 L(J)=\sum_{m\geq1}J(m),\qquad
 \ell_n(J)=J(n)-\int_{n-1}^nJ(x)dx.              \tag{33}
\]

**Finite-coordinate interpolation theorem.** For every `M>=1`, the
functionals

\[
 J\longmapsto J(0),\quad \ell_1(J),\ldots,\ell_M(J),\quad L(J) \tag{34}
\]

are linearly independent on the real even Fourier-`+1` Schwartz space.
Consequently, for arbitrary real `y_1,...,y_M` and `lambda`, there exists
`J in S_+^0` such that

\[
 \ell_n(J)=y_n\quad(1\leq n\leq M),
 \qquad L(J)=\lambda.                            \tag{35}
\]

The same statement holds with the sample evaluations `J(1),...,J(M)` in
place of the cell functionals.

### Proof

Let

\[
 \operatorname{III}_{\mathbb Z}
 =\sum_{k\in\mathbb Z}\delta_k
\]

be the Dirac comb, which is Fourier invariant in the convention used here.
On even test functions,

\[
 L={1\over2}(\operatorname{III}_{\mathbb Z}-\delta_0). \tag{36}
\]

Suppose a real linear combination `T` of the functionals in (34) annihilates
the Fourier-`+1` subspace. Applying it to the projection
`(I+mathcal F)/2` of every real even Schwartz function gives the distribution
identity

\[
 T+\widehat T=0.                                 \tag{37}
\]

If the coefficient of `L` is `c`, the singular part of the left side of
(37), at every sufficiently large integer, is
\(c\operatorname{III}_{\mathbb Z}\). Fourier transforms of
the finitely many point masses and compact interval densities in the cell
functionals are smooth there. Hence `c=0`.

With `c=0`, the remaining singular point mass at the distinct integer `n`
has exactly the coefficient of `ell_n`; it cannot be cancelled by a smooth
Fourier transform or by an interval density. All cell coefficients vanish,
and then the coefficient at zero vanishes as well. This proves independence.
If the map from the Schwartz space to the finite vector of values in (34)
were not onto, a nonzero linear functional on its finite-dimensional range
would give a dependence. Thus it is onto, proving (35). The sample version is
the same argument without the interval densities. \(\square\)

Taking all `y_n=0` and `lambda=1` or `lambda=-1` produces two sources with
identical first `M` Ewald cells and opposite pivot signs. Taking the sample
version with `L(J)=1` and, for example, `J(1)=-1` also shows that samplewise
nonnegativity is not necessary for the scalar sign in the generic class.

These interpolants are not asserted to come from the complete theta profile
or from an actual Galerkin residual. The theorem has a precise methodological
meaning: no finite set of Ewald cell values, raw samples, or their finite
differences can determine (1) from self-duality and the forced moments alone.
An all-index analytic estimate must use additional complete-theta arithmetic.

## 4. Resulting analytic target

The direct Ewald branch now has two exact scalar coordinate systems:

\[
 \mathfrak q(\pi)
 =\sum_{k\geq1}W_k\Delta^2[kJ_\pi(k)]            \tag{38}
\]

and

\[
 \mathfrak q(\pi)
 =\int_0^1\mathcal A_\pi(z)dz,                  \tag{39}
\]

where `A_pi` is built from the Euler-renormalized polylogarithmic source
(16), (21), and (28). Both preserve the corrected residual and allow signed
compensation. Equation (38) is strictly weaker than the pointwise triangular
kernel family; equation (39) makes the continuum subtraction and the Abel
endpoint explicit.

A noncircular continuation may therefore try to prove either

1. the single harmonic-weighted inequality (9) from a modular identity for
   the complete three-scale packets (14); or
2. a signed integral estimate for (30) using the full Euler-renormalized
   polylogarithmic combination, without demanding pointwise positivity in
   `z`.

Merely checking finitely many packets or Abel parameters is ruled out by the
interpolation theorem unless an independent theta-specific tail or rigidity
theorem is supplied.

## Nonclaims

- Equations (7), (27), and (30) are exact reorganizations of the pivot, not
  positivity proofs.
- The interpolation theorem concerns the generic even self-Fourier Schwartz
  class. Its sources are not Xi, theta, zeta, or RH counterexamples.
- Pointwise positivity of `A_pi`, of every Ewald cell, or of every second
  difference is sufficient but is not asserted and is stronger than the
  scalar target.
- A finite core plus a residual-dependent analytic tail bound can certify one
  fixed residual, but it is not a degree-uniform theorem and is not promoted
  here.
- No finite computation is extrapolated to an all-index, all-degree, first
  Xi Laguerre, or RH conclusion.
