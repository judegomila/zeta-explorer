# Natural-cutoff shrinking collar and horizontal-escape reduction

## 0. Claim boundary and exact outcome

This note weakens the global natural-cutoff winding target and separates its
local Riemann-hypothesis content from two additional finite-approximant
requirements.  It proves the following exact statements.

1. Between any two positive square-root heights, the difference of the
   one-sided Cauchy indices is exactly four times the algebraic number of
   conjugate nonreal raw-root pairs in the open collar, once the already
   proved negative-real branch has been excluded.
2. It is enough for the inner physical height to tend to zero.  Equality of
   the outer and inner one-sided counts on such a shrinking collar, together
   with the already-admitted locally uniform natural-cutoff convergence,
   would exclude every off-axis zero of `Xi` in the open strip.
3. Every finite raw polynomial has an explicit horizontal root bound.  The
   bound remains valid when its leading secular coefficient vanishes: the
   first nonzero even endpoint jet replaces that coefficient.
4. Exact counterfamilies show why shifted Hermite--Biehler, de Branges,
   endpoint signs, winding monotonicity, the rank-one determinant identity,
   imaginary-axis positivity, local uniform convergence, and Gevrey-scale
   absolute agreement do not by themselves prove the collar equality.

The first two items are reductions of the missing zero-location theorem, not
a proof of it.  No actual-source shrinking-collar equality, index gap smaller
than four, endpoint-jet lower bound, horizontal-escape rate, signed graph
gate, or contractive-routing estimate is established here.  In particular,
this note proves no equation (5.2) of `DIRECT_RH_ATTACK.md` and no
Riemann-hypothesis conclusion.  The formal terminal state remains
`P0_INVALIDATED`.

The binding conventions remain those of `P0_SOURCE_LOCK.json` and
`P0_NORMALIZATION_AUDIT.md`:

\[
 L=2\log\lambda,
 \qquad M=\lceil\lambda\rceil,
 \qquad V_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L},
 \qquad \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt.
\tag{0.1}
\]

Lebesgue measure, zero extension, explicit inversion evenization, and the
locked source normalization are unchanged.  Nothing below modifies the
finite Weil matrix: the pole--archimedean--minus-prime assembly and the
inclusive prime-power inventory `1<n<=lambda^2` remain binding.

The inputs used here are the exact transform and index identities of
`NATURAL_CUTOFF_STRIP_WINDING_INDEX.md`, the eventual closed negative-real
exclusion of `NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md`, and its
already-admitted locally uniform convergence

\[
 4\widehat f_\lambda(z)\longrightarrow\Xi(z)
 \quad\hbox{locally uniformly on }|\Im z|<1/2.
\tag{0.2}
\]

## 1. Reduced secular function and root height

Let

\[
 f=x_0V_0+\sum_{n=1}^M x_n(V_n+V_{-n}),
 \qquad x_n\in\mathbb R,
\tag{1.1}
\]

be nonzero and put

\[
 D_M(y)=\prod_{n=1}^M(y-n^2),
\tag{1.2}
\]

\[
 p_x(y)=x_0D_M(y)
 +2y\sum_{n=1}^Mx_n
       \prod_{\substack{1\le m\le M\\m\ne n}}(y-m^2).
\tag{1.3}
\]

The exact secular and transform formulas are

\[
 \boxed{
 \Phi(y)={p_x(y)\over D_M(y)}
 =c+2\sum_{n=1}^M{n^2x_n\over y-n^2},
 \qquad c=x_0+2\sum_{n=1}^Mx_n,}
\tag{1.4}
\]

and, with `s=zL/(2*pi)`,

\[
 \boxed{
 \widehat f(z)={\sqrt L\over\pi}{\sin(\pi s)\over s}
                         \Phi(s^2).}
\tag{1.5}
\]

If `x_n=0`, the factor `y-n^2` is common to `p_x` and `D_M`.  Set

\[
 g=\gcd(p_x,D_M),\qquad
 \widetilde p=p_x/g,\qquad
 \widetilde D=D_M/g,\qquad m=\deg\widetilde D.
\tag{1.6}
\]

All rational counts use the reduced quotient
`Phi=tilde p/tilde D`.  The deleted roots are real squared-lattice roots and
therefore never enter a positive-height collar.

For `y=A+iB`, define

\[
 v(y)=\left({|y|-A\over2}\right)^{1/2}.
\tag{1.7}
\]

If `s^2=y`, then `|Im(s)|=v(y)`.  In physical units,

\[
 |\Im z|={2\pi\over L}v(y),
 \qquad
 \delta={L\over4\pi}.
\tag{1.8}
\]

Thus `v(y)=delta` is exactly the boundary `|Im z|=1/2`.

## 2. One-sided collar count

For `r>0`, let `Z_(r-)` count, with algebraic multiplicity, the zeros of

\[
 \widetilde q(s)=\widetilde p(s^2)
\tag{2.1}
\]

in `|Im(s)|<r`, and let `Z_(r+)` count those in `|Im(s)|<=r`.  Equivalently,
these are the inward and outward limits through heights which contain no
root:

\[
 Z_{r-}=\lim_{\rho\uparrow r}Z_\rho,
 \qquad
 Z_{r+}=\lim_{\rho\downarrow r}Z_\rho.
\tag{2.2}
\]

When `c!=0`, use the same one-sided convention for the finite Cauchy index
of the reduced secular boundary loop:

\[
 \mathcal I_{r-}=\lim_{\rho\uparrow r}\mathcal I_\rho,
 \qquad
 \mathcal I_{r+}=\lim_{\rho\downarrow r}\mathcal I_\rho.
\tag{2.3}
\]

The exact winding theorem gives

\[
 \boxed{Z_{r\pm}=2m-\mathcal I_{r\pm}.}
\tag{2.4}
\]

If `c=0`, let

\[
 \Upsilon_r(t)=\widetilde p((t+ir)^2),
\tag{2.5}
\]

and set, with the same inward/outward convention,

\[
 U_{r-}=\lim_{\rho\uparrow r}\operatorname {wind}\Upsilon_\rho,
 \qquad
 U_{r+}=\lim_{\rho\downarrow r}\operatorname {wind}\Upsilon_\rho.
\tag{2.5a}
\]

The polynomial-loop branch is instead

\[
 \boxed{Z_{r\pm}=-2U_{r\pm}.}
\tag{2.6}
\]

The universal statements below are most cleanly made using `Z`; equations
(2.4) and (2.6) then translate them into the appropriate finite index.

### Theorem 2.1 (exact open-collar identity)

Fix `0<a<b`.  Assume

\[
 p_x(y)\ne0\qquad(-b^2\le y\le0).
\tag{2.7}
\]

Let `C_(a,b)` be the number, with algebraic multiplicity, of conjugate
nonreal root pairs `y,bar(y)` of `p_x` satisfying

\[
 a<v(y)<b.
\tag{2.8}
\]

Then

\[
 \boxed{4C_{(a,b)}=Z_{b-}-Z_{a+}.}
\tag{2.9}
\]

For `c!=0`, this is

\[
 \boxed{4C_{(a,b)}=\mathcal I_{a+}-\mathcal I_{b-}.}
\tag{2.10}
\]

For `c=0`, it is

\[
 \boxed{4C_{(a,b)}=2(U_{a+}-U_{b-}).}
\tag{2.11}
\]

**Proof.**  The difference `Z_(b-)-Z_(a+)` counts exactly the roots of
`tilde q` with

\[
 a<|\Im s|<b.
\tag{2.12}
\]

A positive real `y`-root gives two real `s`-roots and contributes nothing.
A negative real root in the relevant range would give two imaginary
`s`-roots, but (2.7) excludes that branch, including both endpoints.  A
conjugate nonreal pair `y,bar(y)` gives the four roots
`s,-s,bar(s),-bar(s)`, all with the same absolute imaginary part.  Root
multiplicity is preserved.  This proves (2.9); (2.4) and (2.6) give
(2.10)--(2.11).  The factors deleted in (1.6) have height zero and do not
alter the count.  \(\square\)

The use of `a+` and `b-` is essential: a root on either boundary is not in
the open collar.  Under (2.7), the difference in (2.10) is a nonnegative
multiple of four.  Therefore the strict integer-gap estimate

\[
 0\le\mathcal I_{a+}-\mathcal I_{b-}<4
\tag{2.13}
\]

already forces equality.  No such actual-source estimate is proved here.

## 3. A shrinking collar is sufficient for the limiting theorem

Return to the actual source-normalized natural-cutoff state with
`M=ceil(lambda)`.  Let `epsilon_lambda>0` satisfy

\[
 \epsilon_\lambda\longrightarrow0,
 \qquad
 a_\lambda={\epsilon_\lambda L\over2\pi}
            =2\epsilon_\lambda\delta<\delta
\tag{3.1}
\]

eventually.  The physical inner height corresponding to `a_lambda` is
exactly `epsilon_lambda`.

### Theorem 3.1 (shrinking-collar implication)

Assume the already-admitted locally uniform convergence (0.2) on an
unbounded natural-cutoff schedule.  Suppose also that, eventually on that
schedule, the proved closed negative-real exclusion holds and

\[
 \boxed{Z_{\delta-}=Z_{a_\lambda+}.}
\tag{3.2}
\]

Equivalently, use

\[
 \mathcal I_{\delta-}=\mathcal I_{a_\lambda+}
\tag{3.3}
\]

when `c!=0`, and

\[
 U_{\delta-}=U_{a_\lambda+}
\tag{3.3a}
\]

in the `c=0` branch.  Then

\[
 Z(\Xi)\cap\{z:|\Im z|<1/2,\ z\notin\mathbb R\}
 =\varnothing.
\tag{3.4}
\]

**Proof.**  Suppose instead that `Xi(z_0)=0`, where

\[
 0<|\Im z_0|<1/2,
 \qquad z_0\notin\mathbb R.
\tag{3.5}
\]

The elementary positivity `Xi(i*tau)>0` for `|tau|<=1/2` shows that
`Re(z_0)!=0`.  Choose a closed disk about `z_0` contained in the open strip,
disjoint from both axes, and with zero-free boundary.  Shrink it so that
every point `z` in the disk satisfies

\[
 0<\beta_-\le |\Im z|\le\beta_+<1/2
\tag{3.5a}
\]

for fixed `beta_-` and `beta_+`.  By (0.2) and Rouche's theorem, every
sufficiently late `widehat(f_lambda)` has a zero `z_lambda` in this disk,
counted with the positive multiplicity of `z_0`.

The disk is nonreal, so the sine and lattice factors in (1.5) neither create
nor remove this zero.  Hence

\[
 y_\lambda=\left({Lz_\lambda\over2\pi}\right)^2
\tag{3.6}
\]

is a nonreal raw root and

\[
 v(y_\lambda)={L\over2\pi}|\Im z_\lambda|.
\tag{3.7}
\]

Because `epsilon_lambda->0`, equation (3.5a) gives, eventually,

\[
 a_\lambda<v(y_\lambda)<\delta.
\tag{3.8}
\]

Theorem 2.1 then makes `Z_(delta-)-Z_(a_lambda+)` positive, contradicting
(3.2).  \(\square\)

This is deliberately one-way.  Even if every zero of `Xi` were real,
finite approximants could split a multiple real zero into a close conjugate
pair, or could have nonreal zeros escape horizontally.  Thus the global
finite equality against `0+` is stronger than the limiting conclusion.
The shrinking collar removes the first unnecessary demand by allowing
arbitrary finite nonreal roots with physical height at most
`epsilon_lambda`; it does not by itself remove horizontal escape.

The logically minimal phase target can be weakened further to compact
rectangles.  For every fixed `0<epsilon<eta<1/2` and `R>0`, it is enough to
show eventual zero-freeness in

\[
 |\Re z|\le R,
 \qquad \epsilon<|\Im z|<\eta.
\tag{3.9}
\]

The argument principle for `tilde p(s^2)` on the corresponding finite
rectangles gives an exact boundary-phase certificate without any convention
at infinity.  This compact-eventual family is equivalent to the desired
limiting zero-free statement under (0.2), but proving it for the actual
source is still Riemann-hypothesis strength.

## 4. Exact horizontal-escape bound, including `c=0`

Define the signed secular moments

\[
 \mu_k=2\sum_{n=1}^M n^{2k}x_n,
 \qquad k\ge1.
\tag{4.1}
\]

There are two branches.

- If `c!=0`, set

  \[
   k=0,\qquad a_0=c,\qquad
   B_0=2\sum_{n=1}^M n^2|x_n|.
  \tag{4.2}
  \]

- If `c=0`, let `k` be the least integer in `1,...,M` for which
  `mu_k!=0`, and set

  \[
   a_k=\mu_k,\qquad
   B_k=2\sum_{n=1}^M n^{2k+2}|x_n|.
  \tag{4.3}
  \]

The second branch always terminates for a nonzero state.  Indeed, if
`mu_1=...=mu_M=0`, the Vandermonde matrix on the distinct numbers
`1^2,...,M^2` gives `x_1=...=x_M=0`; then `c=0` also gives `x_0=0`.

### Theorem 4.1 (endpoint-jet horizontal bound)

Every nonlattice zero `s` of `Phi(s^2)` satisfies

\[
 \boxed{
 |\Re s|^2\le M^2+{B_k\over|a_k|}.}
\tag{4.4}
\]

Consequently every nonreal zero of the finite transform satisfies

\[
 \boxed{
 |\Re z|\le {2\pi\over L}
 \left(M^2+{B_k\over|a_k|}\right)^{1/2}.}
\tag{4.5}
\]

**Proof.**  In the branch `c!=0`, if `s=u+iv` and `|u|>M`, then

\[
 |s^2-n^2|=|s-n|\,|s+n|
 \ge (|u|-n)(|u|+n)=u^2-n^2
 \ge u^2-M^2.
\tag{4.6}
\]

Therefore

\[
 |\Phi(s^2)-c|
 \le {B_0\over u^2-M^2}.
\tag{4.7}
\]

The right side is strictly smaller than `|c|` beyond (4.4), so `Phi(s^2)`
cannot vanish there.

For `k>=1`, the exact finite geometric identity

\[
 {n^2\over y-n^2}
 =\sum_{r=1}^k{n^{2r}\over y^r}
  +{n^{2k+2}\over y^k(y-n^2)}
\tag{4.8}
\]

and the minimality of `k` give

\[
 \boxed{
 y^k\Phi(y)=a_k+
       2\sum_{n=1}^M{n^{2k+2}x_n\over y-n^2}.}
\tag{4.9}
\]

Equations (4.6) and (4.9) now give

\[
 |(s^2)^k\Phi(s^2)-a_k|
 \le {B_k\over u^2-M^2}<|a_k|
\tag{4.10}
\]

beyond (4.4), which again excludes a zero.  A deleted lattice factor is
real and cannot create a nonreal exception.  Scaling by `z=2*pi*s/L`
proves (4.5).  \(\square\)

This is a finite theorem, not a useful asymptotic rate until the ratio
`B_k/|a_k|` is controlled for the actual source.  The ratio is invariant
under nonzero rescaling of the state.

## 5. The leading coefficient is the first nonzero even endpoint jet

At the right endpoint, the centered source modes satisfy

\[
 V_n(L/2)={1\over\sqrt L}
\tag{5.1}
\]

for every integer `n`.  Direct differentiation of (1.1) therefore gives

\[
 \boxed{c=\sqrt L\,f(L/2),}
\tag{5.2}
\]

and, for `k>=1`,

\[
 \boxed{
 \mu_k=(-1)^k\sqrt L
       \left({L\over2\pi}\right)^{2k}f^{(2k)}(L/2).}
\tag{5.3}
\]

All odd derivatives vanish at the endpoint because the positive and
negative modes are paired.  Thus the `c=0` branch of Theorem 4.1 simply
selects the first nonzero even endpoint jet of the trigonometric polynomial.
A nonzero degree-`M` even trigonometric polynomial cannot have all of these
jets vanish through order `2M`, which is the endpoint version of the
Vandermonde argument above.

The admitted natural-cutoff `L2`, Gevrey, and compact-transform estimates do
not give a lower bound for this first nonzero endpoint jet relative to the
absolute moment `B_k`.  In particular, an absolute error which is tiny on
the `exp(-cL^2)` scale need not be small relative to an endpoint value of a
Gaussian-type comparator.  Theorem 4.1 therefore identifies an additional
source-specific obligation; it does not close horizontal escape.

## 6. Why the standard phase routes do not close the collar

### 6.1 Winding monotonicity is the count, not an estimate

As `r` increases, `Z_r` is nondecreasing.  Hence (2.4) makes
`mathcal I_r` nonincreasing away from boundary heights.  At a nonreal
conjugate pair the index drops by four times its algebraic multiplicity; at
a negative real root it drops by two times its multiplicity.  After (2.7),
only the first type occurs in a positive collar.  Thus monotonicity merely
restates (2.10).  It supplies no lower bound such as (2.13).

The sign `Phi(-r^2)>0` controls only the point `t=0` of the loop
`Phi((t+ir)^2)`.  Its value at infinity is the coefficient `c` when
`c!=0`.  Equal endpoint signs and boundary nonvanishing do not determine the
winding between them.

### 6.2 Shifted Hermite--Biehler has the opposite geometry

Let `q(s)=p(s^2)` be a real even polynomial and consider

\[
 E_h(z)=q(z+ih).
\tag{6.1}
\]

The polynomial Hermite--Biehler condition puts every zero of `E_h` in one
open half-plane.  Because the zeros of `q` are invariant under conjugation,
this is equivalent to putting every zero of `q` **inside** the horizontal
strip `|Im(s)|<h`.  The stronger global `a=0` target instead permits roots
outside that strip and requires only those inside it to be real.  The
shrinking-collar target is weaker still: it permits nonreal roots below its
positive inner height `a`.  None of these conditions is a substitute for
the Hermite--Biehler inclusion; Section 7.1 gives an exact two-way
counterexample for the stronger global target.

A generalized Hermite--Biehler theorem can encode a prescribed number of
broken interlacings, but setting that number to zero is again the Cauchy
index equality in (2.10).  It supplies a different language for the count,
not an actual-source sign.

### 6.3 A de Branges real-root certificate is stronger than required

For a real polynomial `q` with simple real zeros, and with the convention
here that a Hermite--Biehler polynomial has its zeros in the lower
half-plane, the strict certificate is built from `q+iq'`.  Multiple real
zeros require the weak/closure form rather than the strict
Hermite--Biehler class.  Either version is a route to all-real zeros of `q`.
It would exclude every allowed exterior nonreal root as well as the
forbidden collar roots.  In a locally uniform limit to `Xi`, proving the
corresponding entire-function condition is itself a real-zero theorem of
Riemann-hypothesis strength.  No de Branges positivity kernel for the actual
projected source is supplied by the present source locks.

### 6.4 The rank-one determinant needs a new positive metric

Assume `c!=0` and put

\[
 u_n={2n^2x_n\over c},
 \qquad
 \mathsf X=\operatorname {diag}(1^2,\ldots,M^2)-u\mathbf1^T.
\tag{6.2}
\]

The matrix determinant lemma gives the exact identity

\[
 \boxed{p_x(y)=c\det(yI-\mathsf X).}
\tag{6.3}
\]

A positive diagonal symmetrizer `H=diag(h_n)` would require

\[
 h_i u_i=h_j u_j\qquad(i\ne j),
\tag{6.4}
\]

and therefore requires all nonzero residues to have one sign.  The admitted
fixed-mode source asymptotic has alternating signs, in particular
`x_1*x_2<0` eventually.  A general positive symmetrizer exists precisely
when the real matrix is diagonalizable with real spectrum, so postulating
one without an independent construction assumes the desired real-root
conclusion.

The forced signed-Laplacian and contractive-routing construction is an
independent possible metric route: proving its strict actual-source gate
would force real raw roots, after which the closed negative-real theorem
would close the collar.  That routing inequality remains unproved and is
not a consequence of (6.3).

### 6.5 The source radical carries the unknown zero divisor

The exact codimension-two correction in
`CENTERED_ZERO_BOUNDARY_CONVOLUTION_OBSTRUCTION.md` leaves the finite
semilocal projected source unchanged, while its full transform vanishes at
every centered nontrivial zeta zero.  Restriction and projection replace
that exact zero by explicit exterior-tail and projection defects.  Thus the
source determinant structure is designed to reproduce every limiting zeta
zero, whether or not it is on the critical line.  Excluding an off-line
zero through those defects requires a genuinely new relative or phase
estimate; the algebraic radical identity alone cannot provide it.

## 7. Exact positive-imaginary-axis and splitting countermodels

### 7.1 Hermite--Biehler reversal and a four-unit index jump

Fix `M=2` and `A>0`, and define

\[
 p_A(y)=y^2+A^2.
\tag{7.1}
\]

Its exact raw coordinates are

\[
 x_0={A^2\over4},\qquad
 x_1=-{1+A^2\over6},\qquad
 x_2={16+A^2\over24},
\tag{7.2}
\]

and `c=1`.  For every real `r`,

\[
 p_A(-r^2)=r^4+A^2>0,
 \qquad
 D_2(-r^2)=(r^2+1)(r^2+4)>0.
\tag{7.3}
\]

Hence the transform is strictly positive on the complete imaginary axis.
The two raw roots are `y=+/-iA`, and

\[
 v(\mathord\pm iA)^2={A\over2}.
\tag{7.4}
\]

Consequently, for a fixed height `h`,

\[
 0<A<2h^2
 \quad\Longrightarrow\quad
 \mathcal I_{0+}-\mathcal I_h=4,
\tag{7.5}
\]

whereas the difference is zero for `A>2h^2`.  At equality the roots lie on
the boundary and the one-sided conventions of Section 2 apply.

For `q_A(s)=s^4+A^2`, the shifted polynomial `q_A(z+ih)` has every zero in
the lower half-plane when `A<2h^2`; this is the Hermite--Biehler branch, but
it is exactly the branch in which the stronger `a=0` inside-strip-real
condition fails.  When `A>2h^2`, that stronger global strip condition holds
while the shifted polynomial has upper-half-plane zeros and is not
Hermite--Biehler.  Moreover, away from the boundary both loops have the same
positive value at `t=0`, the same limit `c=1` at infinity, and no boundary
zero.  Their windings still differ by two turns, because
\(\mathcal I=2W\) and the index difference is four.

### 7.2 Complex splitting of a double real limit root

Fix `R>0` and `epsilon>0`, and put

\[
 \boxed{
 p_{R,\epsilon}(y)
 =y^2+2(\epsilon^2-R^2)y+(R^2+\epsilon^2)^2.}
\tag{7.6}
\]

Then

\[
 \boxed{
 p_{R,\epsilon}(s^2)
 =((s-R)^2+\epsilon^2)((s+R)^2+\epsilon^2),}
\tag{7.7}
\]

so its four `s`-roots are

\[
 s=\mathord\pm R\mathord\pm i\epsilon.
\tag{7.8}
\]

On the imaginary axis,

\[
 p_{R,\epsilon}(-r^2)
 =(R^2+\epsilon^2-r^2)^2+4R^2r^2>0.
\tag{7.9}
\]

For every `h>epsilon`, the finite collar therefore contains one conjugate
nonreal raw-root pair and the index drop is four.  Nevertheless,

\[
 p_{R,\epsilon}(s^2)
 \longrightarrow(s^2-R^2)^2
 \qquad(\epsilon\downarrow0)
\tag{7.10}
\]

locally uniformly.  The limit has only real zeros, but they are double.
This proves that local convergence to an all-real-zero limit and positivity
on the imaginary axis do not imply exact finite index equality unless a
separate mechanism prevents complex splitting.  It is a structural family,
not the actual source.

If `R->infinity` with `epsilon` fixed, the normalized polynomials

\[
 {p_{R,\epsilon}(s^2)\over(R^2+\epsilon^2)^2}
 \longrightarrow1
\tag{7.11}
\]

locally uniformly while retaining the roots (7.8).  Thus even exact finite
raw polynomials exhibit horizontal escape.

## 8. Gevrey-scale horizontal escape

The stronger analytic non-implication retains the scale of the admitted
absolute approximation.  Fix

\[
 0<\alpha<1/2,
 \qquad R_L\asymp{\lambda\over L},
 \qquad k_L=\lfloor\varepsilon L\rfloor
\tag{8.1}
\]

with fixed sufficiently small `epsilon>0`, and define

\[
 H_L(z)=
 \left[1-\left({z\over R_L+i\alpha}\right)^{2k_L}\right]
 \left[1-\left({z\over R_L-i\alpha}\right)^{2k_L}\right].
\tag{8.2}
\]

It obeys

\[
 H_L(-z)=H_L(z),
 \qquad H_L(\overline z)=\overline{H_L(z)},
\tag{8.3}
\]

and, for real `tau`,

\[
 H_L(i\tau)=
 \left|1-\left({i\tau\over R_L+i\alpha}\right)^{2k_L}\right|^2>0
\tag{8.4}
\]

once `R_L>|tau|`.  It nevertheless has zeros at
`+/-R_L+/-i*alpha` in the open physical strip.  On every fixed compact,

\[
 |H_L(z)-1|
 \le2\left({|z|\over\sqrt{R_L^2+\alpha^2}}\right)^{2k_L}
 +\left({|z|\over\sqrt{R_L^2+\alpha^2}}\right)^{4k_L}
 =\exp\{-\Theta(L^2)+O(L\log L)\}.
\tag{8.5}
\]

Multiplying `Xi` by `H_L` preserves the functional symmetries,
imaginary-segment positivity, and Gevrey-scale compact agreement while
inserting escaping off-axis zeros.  Gamma-factor decay makes the difference
Gevrey-small in absolute size even on the complete closed horizontal strip;
near the inserted roots the comparator is much smaller still.  This family
is not a finite projected source anchor.  Together with (7.11), it shows
that neither local nor full-strip absolute approximation controls winding
without a relative lower bound or a source-specific phase theorem.

## 9. Exact remaining obligations

The direct root route can now be stated without the unnecessary global
finite real-root demand.

1. **Shrinking collar.**  On one projection-convergent natural schedule,
   choose an explicit `epsilon_lambda->0` and prove

   \[
   Z_{\delta-}=Z_{a_\lambda+},
   \qquad a_\lambda={\epsilon_\lambda L\over2\pi},
   \tag{9.1}
   \]

   or prove that the nonnegative multiple of four in Theorem 2.1 is
   strictly smaller than four.
2. **Compact alternative.**  Prove the finite-rectangle phase count in
   (3.9) for every fixed rational rectangle.  This avoids both real-axis
   splitting and horizontal escape, but remains the limiting zero-location
   problem.
3. **Global finite alternative.**  If the stronger global index equality is
   retained, prove an actual-source bound on `B_k/|a_k|` in Theorem 4.1 in
   addition to the collar phase estimate.
4. **Metric alternative.**  Prove the actual combined-source signed
   Laplacian or contractive-routing gate.  With the already-proved closed
   negative-real exclusion, that stronger finite real-root mechanism would
   imply (9.1).

None of these actual-source estimates is proved in this note.  Treating the
collar equality as a consequence of symmetry, endpoint positivity,
Hermite--Biehler, determinant algebra, or absolute Gevrey control would
assume precisely the missing phase information.
