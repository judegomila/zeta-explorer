# Natural-cutoff negative-real root exclusion

## 0. Scope and exact outcome

This note isolates the part of the direct projected-anchor root problem that
is already accessible from the admitted prolate estimates.  At the natural
centered Fourier cutoff

\[
 M(\lambda)=\lceil\lambda\rceil,
 \qquad L=2\log\lambda,                              \tag{0.1}
\]

the correctly source-normalized projected prolate anchor eventually has no
raw-polynomial root in

\[
 \boxed{-\left({L\over4\pi}\right)^2\le y\le0.}     \tag{0.2}
\]

Equivalently, it has no purely imaginary transform zero on the closed
physical segment `z in i[-1/2,1/2]`.  The proof uses the already-admitted growing-order
Gevrey approximation to upgrade the anchor convergence to the **closed
imaginary segment** `z in i[-1/2,1/2]`, where the limiting function is
elementarily strictly positive.

This settles only the forbidden negative-real branch of the parabolic root
condition.  The nonreal branch remains unresolved.  In fact, local uniform
convergence shows that excluding that branch on the natural cutoff would
exclude every off-axis zero of `Xi` in the open strip and hence would have
Riemann-hypothesis strength.  Global finite-approximant exclusion is stronger
still because zeros may escape horizontally.

This is a theorem-only package.  It creates no numerical artifact, source
lock, asymptotic certificate, or finite effective threshold.  The constants
and starting threshold in the admitted Gevrey theorem remain qualitative.
It proves no nonreal-root exclusion, no ground-state statement, no equation
(5.2) of `DIRECT_RH_ATTACK.md`, and no Riemann-hypothesis conclusion.  The
formal project state remains `P0_INVALIDATED`.

The binding conventions remain those of `P0_SOURCE_LOCK.json` and
`P0_NORMALIZATION_AUDIT.md`:

\[
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt,
 \qquad
 V_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L}.          \tag{0.3}
\]

Lebesgue measure, zero extension, explicit inversion reflection, and the
locked source normalization are retained.  The anchor is not unit-normalized
before its source coefficient is fixed.  Nothing here
changes the finite Weil matrix: it retains the minus sign on the prime block
and the inclusive inventory `1<n<=lambda^2`.

The admitted inputs are

1. `notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md`, for the
   growing-order source approximation, endpoint tails, and analytic-strip
   projection estimate;
2. `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md`, for the
   source-normalized correction family;
3. `notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md`,
   for the exact polynomial--`Xi` transforms of those corrections; and
4. `notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md`, Section 5, for the
   already-admitted natural-cutoff tail.

No property of a finite Weil eigenvector is used.

## 1. Exact raw polynomial, secular form, and transform

Let

\[
 f(t)=x_0V_0(t)+\sum_{n=1}^M x_n\bigl(V_n(t)+V_{-n}(t)\bigr) \tag{1.1}
\]

be a real inversion-even finite state.  Put

\[
 D_M(y)=\prod_{m=1}^M(y-m^2)                       \tag{1.2}
\]

and define its raw polynomial by

\[
 p_x(y)=x_0D_M(y)
 +2y\sum_{n=1}^M x_n
       \prod_{\substack{1\le m\le M\\m\ne n}}(y-m^2).
                                                               \tag{1.3}
\]

### Proposition 1.1 (two exact rational forms)

Away from the squared lattice,

\[
 \boxed{
 {p_x(y)\over D_M(y)}
 =x_0+2y\sum_{n=1}^M{x_n\over y-n^2}
 =c_M+2\sum_{n=1}^M{n^2x_n\over y-n^2},}          \tag{1.4}
\]

where

\[
 c_M=x_0+2\sum_{n=1}^M x_n                         \tag{1.5}
\]

is the leading coefficient of `p_x`.

**Proof.**  The first equality is (1.3) divided by (1.2).  In each summand,

\[
 {y\over y-n^2}=1+{n^2\over y-n^2}.
\]

Collecting the constant terms gives (1.5) and the second equality.  Since
both sides become polynomial identities after multiplication by `D_M`, the
formulas extend through removable lattice values.  \(\square\)

The rational function in (1.4) is a genuine Stieltjes/Herglotz secular
function only under an additional one-sign condition on its residues
`n^2*x_n`.  That condition is not available for the prolate anchor; see
Section 6.

### Proposition 1.2 (exact finite transform)

Set

\[
 s={zL\over2\pi}.
\]

Then, with removable values understood at the integer lattice,

\[
 \boxed{
 \widehat f(z)
 = {\sqrt L\over\pi}{\sin(\pi s)\over s}
   {p_x(s^2)\over D_M(s^2)}.}                      \tag{1.6}
\]

**Proof.**  Direct integration using `s=zL/(2*pi)` gives

\[
 \int_{-L/2}^{L/2}V_n(t)e^{-izt}\,dt
 ={\sqrt L\over\pi}{\sin(\pi s)\over s-n}.       \tag{1.7}
\]

The factor `(-1)^n` in the source-centered mode cancels the identical factor
from `sin(pi*(s-n))`.  Adding the `+n` and `-n` terms gives

\[
 {1\over s-n}+{1\over s+n}={2s\over s^2-n^2}.
\]

Equations (1.4) and (1.7) now give (1.6).  \(\square\)

### Proposition 1.3 (exact interpolation data)

One has

\[
 p_x(0)=(-1)^M(M!)^2x_0,                            \tag{1.8}
\]

and, for `1<=n<=M`,

\[
 \boxed{
 p_x(n^2)=(-1)^{M-n}(M-n)!(M+n)!x_n.}              \tag{1.9}
\]

**Proof.**  Equation (1.8) is immediate from (1.3).  At `y=n^2`, every
term except the `n`th one vanishes.  Splitting the remaining product into
`m<n` and `m>n` gives

\[
 2n^2\prod_{m\ne n}(n^2-m^2)
 =(-1)^{M-n}(M-n)!(M+n)!,
\]

which proves (1.9).  \(\square\)

## 2. The physical parabola is a horizontal strip in the square root

For `y=A+iB`, set

\[
 v(y)=\left({|y|-A\over2}\right)^{1/2},
 \qquad \delta={L\over4\pi}.                       \tag{2.1}
\]

If `s=u+iv` and `s^2=y`, then

\[
 |y|=u^2+v^2,\qquad \Re y=u^2-v^2,\qquad v(y)=|v|. \tag{2.2}
\]

By (1.6), a nonlattice root `y=s^2` gives the physical transform zero

\[
 z={2\pi\over L}s,\qquad
 |\Im z|={2\pi\over L}v(y).                       \tag{2.3}
\]

Thus the direct parabolic target is exactly

\[
 y\in[0,\infty)
 \quad\hbox{or}\quad
 v(y)\ge\delta                                      \tag{2.4}
\]

for every root of `p_x`.  In terms of the even polynomial

\[
 q_x(s)=p_x(s^2),                                   \tag{2.5}
\]

it says that every zero in `|Im s|<delta` is real.

For a negative root `y=-r^2`, equations (2.1)--(2.3) reduce to

\[
 v(y)=r,\qquad |\Im z|={r\over2\delta}.             \tag{2.6}
\]

Hence the interval forbidden by the open-strip condition is precisely
`-delta^2<y<0`.  The closed-segment convergence below proves the stronger
endpoint-safe exclusion `-delta^2<=y<=0`.

## 3. Closed-imaginary-segment convergence at the natural cutoff

Write the actual locked logarithmic prolate state as

\[
 X_\lambda(t)=k_\lambda^+(e^t),
 \qquad -L/2\le t\le L/2,                           \tag{3.1}
\]

and let

\[
 f_\lambda=P_{\lceil\lambda\rceil}X_\lambda.       \tag{3.2}
\]

Multiplying `f_lambda` by the eventual nonzero projected norm, or by the
final factor four, changes no root.  We therefore keep the source scale in
this section.

### Theorem 3.1 (closed imaginary segment)

The admitted Gevrey estimates imply

\[
 \boxed{
 \sup_{|\tau|\le1/2}
 \left|\widehat f_\lambda(i\tau)-{\Xi(i\tau)\over4}\right|
 \longrightarrow0.}                                \tag{3.3}
\]

**Proof.**  Fix a sufficiently small constant `A_0>0` and take formal
Hermite order

\[
 J=\lfloor A_0L\rfloor.                             \tag{3.4}
\]

Let

\[
 G_{\lambda,J}=\sum_{j=0}^J\lambda^{-2j}G_j        \tag{3.5}
\]

be the logarithmic arithmetic image of the admitted source-normalized
Hermite approximation.  Equations (4.3)--(5.6) of the Gevrey audit, in the
specialization recorded in Section 5 of the natural-cutoff note, give
qualitative constants `c,C>0` such that

\[
 \|X_\lambda-G_{\lambda,J}\|_{L^2(-L/2,L/2)}
 \le Ce^{-cL^2},                                    \tag{3.6}
\]

and

\[
 \|(I-P_{\lceil\lambda\rceil})X_\lambda\|_2
 \le Ce^{-cL^2}.                                    \tag{3.7}
\]

Orthogonality of `P_M` and the triangle inequality also give

\[
 \|f_\lambda-G_{\lambda,J}\|_{L^2(-L/2,L/2)}
 \le C'e^{-c'L^2}.                                  \tag{3.8}
\]

Indeed, `(I-P_M)G` is bounded by `(I-P_M)X+(G-X)`.

For `|tau|<=1/2`, Cauchy--Schwarz gives

\[
\begin{aligned}
 \left|\int_{-L/2}^{L/2}
  (f_\lambda-G_{\lambda,J})(t)e^{\tau t}\,dt\right|
 &\le \|f_\lambda-G_{\lambda,J}\|_2
 \left(\int_{-L/2}^{L/2}e^{2\tau t}\,dt\right)^{1/2}\\
 &\le C''\lambda^{1/2}e^{-c'L^2}=o(1).             \tag{3.9}
\end{aligned}
\]

The deliberately coarser bound with an additional `sqrt(L)` is also
`o(1)`.  Here is the weighted full-line tail explicitly.  If `F` is one of
the formal Hermite combinations, with Hermite support at most `K=O(L)`, the
pointwise Mehler estimate and the arithmetic sum give constants `b,c,C>0`
such that, for `u>=lambda`,

\[
 |E(F)(u)|
 \le C\exp(cK)u^{1/2}e^{-bu^2}.                    \tag{3.9a}
\]

Indeed, the first Gaussian summand dominates the remaining monotone tail
after decreasing `b` if necessary.  Put `G(t)=E(F)(e^t)`.  Every formal
correction is Fourier invariant and has zero value and integral, so Poisson
summation gives the exact inversion evenness

\[
 G(-t)=G(t).                                        \tag{3.9b}
\]

Changing variables `u=e^t`, and using
`u^(|tau|-1/2)<=1` for `u>=lambda>=1` and `|tau|<=1/2`, now yields

\[
 \sup_{|\tau|\le1/2}
 \int_{|t|\ge L/2}|G(t)e^{\tau t}|\,dt
 \le C\exp(cK)\int_\lambda^\infty e^{-bu^2}\,du=o(1). \tag{3.9c}
\]

Since `K=O(L)`, the Gaussian endpoint exponent dominates `exp(cK)`.
Summing the decreasing Gevrey terms preserves (3.9c) for
`G_(lambda,J)`.  Thus the weighted full-line tail is uniformly `o(1)` on
the closed segment.

For every correction, the exact Mellin calculation gives

\[
 \widehat G_j(z)=P_j(z^2)\Xi(z),                    \tag{3.10}
\]

where the leading source term is

\[
 \widehat G_0(z)={\Xi(z)\over4}.                    \tag{3.11}
\]

On a fixed compact set, the Gevrey-one coefficient majorant and the fixed
evaluation functional give, after enlarging its constant if necessary,

\[
 \sup_{|z|\le1/2}|P_j(z^2)|\le C_0B_0^j j!.        \tag{3.12}
\]

Since `J=O(L)` while `lambda^2=exp(L)`, the ratios of consecutive majorant
terms are at most

\[
 {B_0(j+1)\over\lambda^2}=o(1)                    \tag{3.13}
\]

uniformly for `j<=J`.  Hence

\[
 \sup_{|z|\le1/2}
 \left|\sum_{j=1}^J\lambda^{-2j}P_j(z^2)\right|
 =O(\lambda^{-2}).                                  \tag{3.14}
\]

Combining (3.9)--(3.14) proves (3.3).  \(\square\)

The endpoint `|tau|=1/2` is important.  The elementary first-order source
comparison alone pays `lambda^(1/2)` and does not close there.  The admitted
growing-order remainder `e^(-cL^2)` does.

## 4. Positivity on the imaginary segment and negative-root exclusion

Recall the locked convention

\[
 \Xi(z)=\xi\!\left({1\over2}+iz\right).             \tag{4.1}
\]

### Lemma 4.1 (elementary imaginary-axis sign)

\[
 \boxed{\Xi(i\tau)>0\qquad(-1/2\le\tau\le1/2).}    \tag{4.2}
\]

**Proof.**  Put `sigma=1/2-tau`.  For `0<sigma<1`, the alternating
Dirichlet series

\[
 \eta_D(\sigma)=\sum_{n\ge1}(-1)^{n-1}n^{-\sigma}
\]

is strictly positive, while

\[
 \eta_D(\sigma)=(1-2^{1-\sigma})\zeta(\sigma)
\]

has a strictly negative parenthetical factor.  Thus `zeta(sigma)<0`.
In

\[
 \xi(\sigma)={1\over2}\sigma(\sigma-1)
 \pi^{-\sigma/2}\Gamma(\sigma/2)\zeta(\sigma),     \tag{4.3}
\]

the two negative real factors cancel and all remaining factors are positive.
At the endpoints, analytic continuation gives `xi(0)=xi(1)=1/2`.  This
proves (4.2).  \(\square\)

### Theorem 4.2 (eventual forbidden-negative-root exclusion)

Let `p_lambda` be the raw polynomial of the actual source-normalized state
`f_lambda` in (3.2), and put `delta=L/(4*pi)`.  Then, for all sufficiently
large `lambda`, depending on the qualitative admitted constants,

\[
 \boxed{p_\lambda(y)\ne0\qquad(-\delta^2\le y\le0).} \tag{4.4}
\]

The same conclusion holds after the usual nonzero projected normalization.

**Proof.**  Lemma 4.1 and compactness give

\[
 m_0:=\min_{|\tau|\le1/2}{\Xi(i\tau)\over4}>0.      \tag{4.5}
\]

Theorem 3.1 makes `widehat(f_lambda)(i*tau)` strictly positive on the whole
closed segment eventually; the transform is real there because `f_lambda`
is real and even.

If `p_lambda(-r^2)=0` with `0<=r<=delta`, take

\[
 s=ir,\qquad z={2\pi\over L}s=i{r\over2\delta}.     \tag{4.6}
\]

Then `|Im z|<=1/2`.  For `r>0`, neither `sin(pi*s)/s` nor `D_M(s^2)`
vanishes.  For `r=0`, the first factor has the nonzero removable value `pi`
and `D_M(0)!=0`.  Thus the exact transform formula (1.6) gives
`widehat(f_lambda)(z)=0` in every case, contradicting (4.5) and Theorem 3.1.
Scaling the state by a nonzero scalar leaves `p_lambda` projectively
unchanged.  \(\square\)

No effective `lambda` is asserted: the prolate branch and concentration
thresholds feeding (3.6)--(3.7) remain noncomputed.

## 5. Why the nonreal branch has RH strength

The same admitted estimates, without using the endpoint, give locally
uniform convergence

\[
 4\widehat f_\lambda(z)\longrightarrow\Xi(z)
 \quad\hbox{on}\quad |\Im z|<1/2.                  \tag{5.1}
\]

### Theorem 5.1 (off-axis zeros force forbidden finite roots)

Suppose `Xi` has a zero `z_0` with

\[
 z_0\notin\mathbb R,\qquad |\Im z_0|<1/2.           \tag{5.2}
\]

Then every sufficiently large natural-cutoff anchor has a nonreal raw root
`y_lambda` satisfying

\[
 \boxed{v(y_\lambda)<\delta.}                      \tag{5.3}
\]

**Proof.**  Lemma 4.1 shows that `z_0` is not on the imaginary axis.  Choose
a small closed disk around `z_0`, contained in the open strip and disjoint
from both axes, whose boundary contains no zero of `Xi`.  Rouche's theorem
and (5.1) show that the total multiplicity of the zeros of
`widehat(f_lambda)` in that disk equals the multiplicity of `z_0` for every
sufficiently large `lambda`.  Those finite zeros may split.  Select any one
of them and call it `z_lambda`.

The sine and denominator factors in (1.6) have no nonreal zeros or poles in
this disk.  Therefore

\[
 y_\lambda=\left({Lz_\lambda\over2\pi}\right)^2    \tag{5.4}
\]

is a root of `p_lambda`.  Since both real and imaginary parts of `z_lambda`
are nonzero, `y_lambda` is nonreal.  Finally,

\[
 {v(y_\lambda)\over\delta}
 ={(L/(2\pi))|\Im z_\lambda|\over L/(4\pi)}
 =2|\Im z_\lambda|<1.                              \tag{5.5}
\]

This proves (5.3).  \(\square\)

A nontrivial zeta zero `rho=beta+i*gamma` corresponds, under (4.1), to

\[
 z_0=\gamma+i(1/2-\beta),                           \tag{5.6}
\]

so `0<beta<1` puts it in the open physical strip and `beta!=1/2` makes it
off the real axis.  Consequently:

> Eventual parabolic exclusion of all nonreal roots on the
> projection-convergent natural cutoff would itself exclude all
> off-critical nontrivial zeta zeros.

This is not a proof that such finite exclusion is false.  It identifies its
strength.  Conversely, even if every zero of `Xi` in the strip is real,
(5.1) yields only compact-eventual exclusion.  It does not exclude finite
zeros whose real parts escape to infinity.  Hence global finite exclusion is stronger
than the limiting RH statement.

## 6. Exact route obstructions

### 6.1 The positive-measure secular route is unavailable

If all residues `n^2*x_n` in (1.4) had one sign, the rational secular
function would be Herglotz up to a global sign and its roots would be real
and interlacing.  The admitted fixed-mode source asymptotic instead gives

\[
 \sqrt L\,x_n(\lambda)\longrightarrow
 (-1)^n{\Xi(0)\over4}.                              \tag{6.1}
\]

In particular, eventually `x_1*x_2<0`.  Thus the exact rank-one secular
matrix is not symmetrizable by the natural positive diagonal metric, and no
Stieltjes, positive-measure orthogonal-polynomial, or direct total-positivity
argument follows from (1.4).  Indefinite-metric formulations count possible
complex pairs but do not lower-bound their height.

The positivity of the limiting logarithmic kernel does not repair this:
ordinary centered Fourier projection is not positivity preserving, and
positivity alone is weaker than the `PF_infinity` property required by a
variation-diminishing root theorem.

### 6.2 Hermite--Biehler has the wrong one-sided geometry

Classical Hermite--Biehler applied to `q_lambda(s+i*delta)` controls zeros on
one side of the line `Im s=delta`; with conjugation symmetry it naturally
certifies that all zeros lie *inside* a horizontal strip.  The present target
allows complex zeros outside the strip and asks only that zeros inside be
real.  A generalized Hermite--Biehler or argument-principle formulation is
possible, but it becomes an equality of Cauchy indices on the two strip
boundaries.  Proving that equality is exactly the missing off-axis zero
count exposed by Theorem 5.1.

### 6.3 A global Rouche comparison cannot use the admitted absolute error

On fixed compact subsets, comparison with `Xi` first requires knowing that
`Xi` is nonzero there.  Across the entire finite bandwidth

\[
 \Omega_M={2\pi(M+1)\over L}\asymp{2\pi\lambda\over L}, \tag{6.2}
\]

the completed gamma factor makes a polynomial--`Xi` comparator at most

\[
 \exp\{-\Theta(\lambda/L)+O(L^2)\},                 \tag{6.3}
\]

where the `O(L^2)` allows the degree-`O(L)` formal multiplier.  The admitted
absolute natural-cutoff remainder is only `exp(-cL^2)`, which is much larger
than (6.3).  Moreover, every nonzero compactly supported finite-mode state
has some nonvanishing endpoint jet after zero extension, so its transform
has algebraic endpoint contributions, while `Xi` decays exponentially on
horizontal lines.  A single global Rouche contour comparing the two cannot
close from these estimates.

## 7. Fixed rank is not the growing natural cutoff

At every fixed mode, (6.1) holds.  For fixed `M=2`, the projective limiting
coefficient vector is `(1,-1,1)` and (1.3) gives

\[
 p_*(y)=y^2+y+4.                                    \tag{7.1}
\]

Its roots satisfy

\[
 v(y_\pm)^2={5\over4}.                              \tag{7.2}
\]

Since `delta=L/(4*pi)` tends to infinity, these fixed-rank nonreal roots
eventually lie in the forbidden parabola.  This does not contradict Theorem
4.2, which concerns negative real roots, and it does not decide the growing
cutoff: fixed rank is not projection-convergent.

Nor may the high natural-cutoff coordinates be discarded merely because
they are small in Hilbert norm.  Equations (1.8)--(1.9) give the exact
endpoint conditioning identity

\[
 \boxed{
 { |p_x(M^2)|\over |p_x(0)|}
 =\binom{2M}{M}\left|{x_M\over x_0}\right|.}       \tag{7.3}
\]

Thus a top-coordinate perturbation

\[
 |\delta x_M|={|x_0|\over\binom{2M}{M}}             \tag{7.4}
\]

already changes the endpoint interpolation datum by the full magnitude of
the zero-mode datum.  Since

\[
 {1\over\binom{2M}{M}}>4^{-M},                     \tag{7.5}
\]

a fixed-mode perturbative argument would need roughly the `4^{-M}` scale
even to neglect this single endpoint datum.  With `M=ceil(lambda)`, the
admitted `e^{-cL^2}` absolute control is vastly larger because
`M` grows exponentially in `L`.

This conditioning statement is not a counterexample to the actual growing
anchor.  It explains why the fixed-`M` polynomial cannot be transferred by
the available absolute coefficient error.  The projection-convergent
growing problem is instead governed on physical compacts by the limiting
`Xi` geometry of Section 5.

## 8. Remaining direct target

The natural-cutoff direct root program is now separated cleanly:

1. all negative real roots in the forbidden interval, together with both
   boundary values `-delta^2` and `0`, are eventually excluded by Theorem
   4.2;
2. nonreal roots with `v(y)<delta` remain unresolved and have RH strength by
   Theorem 5.1; and
3. even after the limiting statement is settled, a global finite theorem
   would need an additional horizontal-escape estimate.

No ground-state forcing is involved in this separation.  The next valid
advance must therefore be a source-specific nonreal-root theorem, a strip
boundary winding identity with the required sign, or a compact-eventual
argument strong enough to establish the same zero geometry.  The admitted
Gevrey/prolate asymptotics alone do not supply it.
