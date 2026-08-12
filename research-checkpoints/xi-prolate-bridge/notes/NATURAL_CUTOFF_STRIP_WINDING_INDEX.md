# Natural-cutoff strip winding and Cauchy-index reduction

## 0. Claim boundary and exact outcome

This note gives an exact finite argument-principle formula for the roots of
the natural-cutoff raw anchor polynomial in the physical open half-strip.  It
does four things.

1. It expresses the strip-root count as the winding of the exact rational
   secular function on one parabolic boundary.
2. It converts that winding into a real polynomial Cauchy index, hence into
   a finite signed-subresultant/Sturm certificate.
3. After the already-proved closed-imaginary-segment positivity excludes the
   negative-real branch, it identifies the remaining index drop as exactly
   four times the number of conjugate nonreal raw-root pairs.
4. It records exact finite and analytic counterfamilies showing that the
   functional equation, imaginary-segment positivity, and the admitted
   Gevrey absolute estimates do not determine this index.

This is a theorem-only reduction.  It proves no actual-source Cauchy-index
equality on an unbounded schedule, no global finite-anchor strip exclusion,
no equation (5.2) of `DIRECT_RH_ATTACK.md`, and no Riemann-hypothesis conclusion.
It creates no numerical certificate or source lock.  The formal
project state remains `P0_INVALIDATED`.

The binding conventions remain those of `P0_SOURCE_LOCK.json` and
`P0_NORMALIZATION_AUDIT.md`:

\[
 L=2\log\lambda,
 \qquad M=\lceil\lambda\rceil,
 \qquad \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt,
 \qquad V_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L}.
\tag{0.1}
\]

Lebesgue measure, zero extension, explicit inversion evenization, and the
locked source normalization are unchanged.  Nothing below changes the
finite Weil matrix: the prime block retains the minus sign of the source and
all prime powers `1<n<=lambda^2`, including a possible endpoint, remain in
the assembly.

## 1. Raw polynomial and reduced secular function

Let `f` be a nonzero real inversion-even finite state,

\[
 f=x_0V_0+\sum_{n=1}^M x_n(V_n+V_{-n}),
 \qquad x_n\in\mathbb R,
\tag{1.1}
\]

so `p_x` below is not the zero polynomial.  The actual source-normalized
anchor satisfies this standing nonzero hypothesis.  The identically zero
state, whose transform vanishes everywhere, has no finite zero-counting
problem and is excluded throughout.

Put

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

The exact secular function is

\[
 \boxed{
 \Phi(y)={p_x(y)\over D_M(y)}
 =x_0+2y\sum_{n=1}^M{x_n\over y-n^2}
 =c+2\sum_{n=1}^M{n^2x_n\over y-n^2},}
\tag{1.4}
\]

where

\[
 c=x_0+2\sum_{n=1}^Mx_n
\tag{1.5}
\]

is the leading coefficient of `p_x`.  With

\[
 s={zL\over2\pi},
\tag{1.6}
\]

define the branch-independent raw-root height

\[
 \boxed{
 v(y)=|\operatorname {Im}\sqrt y|
 =\left({|y|-\operatorname {Re}y\over2}\right)^{1/2}.}
\tag{1.6a}
\]

Thus `v(y)<h` is exactly the condition that the square roots belonging to
the conjugate raw-root pair lie in the horizontal `s`-strip of height `h`.

The exact finite transform is

\[
 \boxed{
 \widehat f(z)={\sqrt L\over\pi}{\sin(\pi s)\over s}\Phi(s^2).}
\tag{1.7}
\]

All lattice values are interpreted by continuity.

If `x_n=0`, then `p_x(n^2)=0` and the corresponding factor of `D_M`
is removable in `Phi`.  For the rational count below, first set

\[
 g=\gcd(p_x,D_M),\qquad
 \widetilde p=p_x/g,\qquad
 \widetilde D=D_M/g,\qquad m=\deg\widetilde D,
\tag{1.8}
\]

and use the reduced quotient `Phi=tilde p/tilde D`.  This deletes only real
lattice factors.  It therefore changes neither the nonreal roots of `p_x`
nor the off-axis zeros under study.  In Sections 2--5 the uncluttered generic
notation assumes `g=1` and `c!=0`; Section 6 states the removable and
degree-degenerate branches precisely.

## 2. The parabolic boundary and its exact values

For `h>0`, define

\[
 \Gamma_h(t)=\Phi((t+ih)^2),\qquad -\infty<t<\infty.
\tag{2.1}
\]

If `c!=0`, then

\[
 \Gamma_h(-t)=\overline{\Gamma_h(t)},
 \qquad
 \lim_{t\to\pm\infty}\Gamma_h(t)=c.
\tag{2.2}
\]

Thus, when `Gamma_h` has no zero, the oriented path `t=-infinity` to
`t=+infinity` compactifies to a loop based at `c`.  Its winding about zero is

\[
 \boxed{
 W_h={1\over2\pi}\Delta_{t=-\infty}^{\infty}
             \arg\Gamma_h(t).}
\tag{2.3}
\]

This orientation is binding: increasing `t` is used on the upper line
`Im(s)=h`.  In particular, the example `(s^2+a)/(s^2-1)` with
`a>h^2` has `W_h=1`.

Write

\[
 a=t^2-h^2,\qquad b=2ht,\qquad d_n=a-n^2.
\tag{2.4}
\]

Substitution into the second form of (1.4) gives the exact boundary values

\[
 \boxed{
 A_h(t):=\Re\Gamma_h(t)
 =c+2\sum_{n=1}^M
       {n^2x_n d_n\over d_n^2+b^2},}
\tag{2.5}
\]

\[
 \boxed{
 B_h(t):=\Im\Gamma_h(t)
 =-2b\sum_{n=1}^M
       {n^2x_n\over d_n^2+b^2}.}
\tag{2.6}
\]

In particular, `A_h` is even, `B_h` is odd, and the only information supplied
by a sign at the imaginary endpoint is the single value
`A_h(0)=Phi(-h^2)`.

The strictly positive common denominator

\[
 Q_h(t)=\prod_{n=1}^M
       \left((t^2-h^2-n^2)^2+4h^2t^2\right)>0
\tag{2.7}
\]

produces real polynomials

\[
 \mathsf A_h=Q_hA_h,\qquad \mathsf B_h=Q_hB_h.
\tag{2.8}
\]

They have a common real zero exactly when `p_x((t+ih)^2)=0`, equivalently
when a raw root lies on `v(y)=h`.

## 3. Argument-principle identity

Let `Z_h` be the number, with algebraic multiplicity, of zeros of

\[
 q_x(s)=p_x(s^2)
\tag{3.1}
\]

in the open horizontal strip `|Im(s)|<h`.  In the generic branch assume
that no zero lies on either boundary.

### Theorem 3.1 (one-boundary winding identity)

If `c!=0` and no lattice pole is removable, then

\[
 \boxed{Z_h=2M-2W_h.}
\tag{3.2}
\]

**Proof.**  Apply the argument principle to

\[
 F(s)=\Phi(s^2)
\tag{3.3}
\]

on the counterclockwise rectangle
`[-T,T] times [-h,h]`.  Its `2M` poles are the real points
`+/-1,...,+/-M`.  The vertical integrals tend to zero because `F(s)->c`.

On the bottom boundary, oriented from `-T-ih` to `T-ih`, the value is
`overline(Gamma_h(t))`, so its argument change is minus that of `Gamma_h`.
The top boundary is traversed from `T+ih` to `-T+ih`, and contributes the
same negative change.  Therefore

\[
 Z_h-2M=-2W_h,
\tag{3.4}
\]

which is (3.2).  `square`

For the reduced quotient of (1.8), the identical proof gives

\[
 \boxed{\widetilde Z_h=2m-2W_h,}
\tag{3.5}
\]

where `tilde Z_h` counts the zeros of `tilde p(s^2)`.  Deleted lattice roots
are real and make no contribution to any later off-axis count.

## 4. Cauchy-index form and orientation

For a real rational function `R`, define

\[
 \operatorname {Ind}^{\uparrow}_{\mathbb {RP}^1}(R)
\tag{4.1}
\]

to be the number of jumps from `-infinity` to `+infinity` minus the number
of jumps from `+infinity` to `-infinity`, counted on the oriented real
projective line.  This is the opposite of conventions which count downward
jumps positively.

When `mathsf A_h` and `mathsf B_h` have no common real zero, set

\[
 \boxed{
 \mathcal I_h
 =-\operatorname {Ind}^{\uparrow}_{\mathbb {RP}^1}
       \left({\mathsf B_h\over\mathsf A_h}\right).}
\tag{4.2}
\]

Before evaluating (4.2), cancel any common polynomial factor of
`mathsf A_h` and `mathsf B_h` which has no real root.  Such a factor does not
represent a zero of the boundary loop.  A common factor with a real root is
instead exactly the boundary branch of Section 6.1 and must not be canceled
across that root.

The ratio tends to zero at projective infinity, so there is no unresolved
endpoint convention in (4.2).

### Theorem 4.1 (winding equals a finite Cauchy index)

With the orientations (2.3) and (4.1),

\[
 \boxed{\mathcal I_h=2W_h.}
\tag{4.3}
\]

Consequently,

\[
 \boxed{Z_h=2M-\mathcal I_h}
\tag{4.4}
\]

in the generic branch, and `tilde Z_h=2m-\mathcal I_h` after removable
factors are canceled.

**Proof.**  The Cauchy index of `B_h/A_h` records the oriented crossings of
the imaginary axis by the loop `A_h+iB_h`.  One positive turn has two
downward jumps of `B_h/A_h`, so its upward index is `-2`.  Homotopy through
loops avoiding zero proves (4.3).  Equation (4.4) is Theorem 3.1.  `square`

This is an exact algebraic certificate.  For example, form the signed Sturm
sequence

\[
 \mathsf A_h,\quad \mathsf B_h,\quad
 -\operatorname {rem}(\mathsf A_h,\mathsf B_h),\quad\ldots.
\tag{4.5}
\]

If `V(-infinity)` and `V(+infinity)` are its sign variations, then

\[
 \operatorname {Ind}^{\uparrow}
       (\mathsf B_h/\mathsf A_h)
 =V(-\infty)-V(+\infty).
\tag{4.6}
\]

Thus only exact coefficient signs and rational polynomial division are
needed.  Signed subresultants give the coefficient-growth-safe version of
the same calculation.

## 5. Separation of real, imaginary, and genuinely complex roots

Assume first that `p_x(0)!=0`.  Let

- `R_+` be the number of positive real roots of `p_x`;
- `R_-(h)` be the number of roots in `(-h^2,0)`; and
- `C_h` be the number of conjugate pairs of nonreal roots `y,conjugate(y)`
  satisfying `v(y)<h`.

All counts include algebraic multiplicity.  A positive real root gives two
real `s`-roots, a root in `(-h^2,0)` gives two imaginary `s`-roots, and one
nonreal conjugate pair gives four off-axis `s`-roots.  Hence

\[
 Z_h=2R_++2R_-(h)+4C_h.
\tag{5.1}
\]

For sufficiently small `epsilon>0`, only the real `s`-roots lie in
`|Im(s)|<epsilon`, so

\[
 \boxed{
 W_{0+}=M-R_+,\qquad
 \mathcal I_{0+}=2(M-R_+).}
\tag{5.2}
\]

Subtracting the counts at `0+` and `h` gives the central identity

\[
 \boxed{
 R_-(h)+2C_h=W_{0+}-W_h,}
\tag{5.3}
\]

or, equivalently,

\[
 \boxed{
 2R_-(h)+4C_h=\mathcal I_{0+}-\mathcal I_h.}
\tag{5.4}
\]

The right side is exactly the number of nonreal `s`-zeros in the strip.
For the reduced branch, replace `M` and `p_x` by `m` and `tilde p`; deleted
lattice roots appear on the real axis in both counts and cancel.  If
`p_x(0)=0`, replace `R_+` throughout by
`R_(>=0)=R_++mult_0(p_x)`: a zero of multiplicity `k` at `y=0` gives a zero
of multiplicity `2k` at `s=0`.

### Corollary 5.1 (certificate after negative-root exclusion)

If

\[
 p_x(y)\ne0\qquad(-h^2<y<0),
\tag{5.5}
\]

then

\[
 \boxed{
 C_h={\mathcal I_{0+}-\mathcal I_h\over4}.}
\tag{5.6}
\]

In particular, the necessary and sufficient finite certificate for no
nonreal raw root with `v(y)<h` is

\[
 \boxed{
 \mathcal I_h=\mathcal I_{0+}=2(M-R_+).}
\tag{5.7}
\]

This is also a sufficient sign criterion.  Root multiplicities must be
retained: for the squarefree decomposition with pairwise coprime squarefree
factors `g_j`,

\[
 p_x=\prod_{j\ge1}g_j^j,
\tag{5.7a}
\]

one computes

\[
 R_+=\sum_{j\ge1}j\,N_+(g_j),
\tag{5.7b}
\]

where each `N_+(g_j)` is the ordinary Sturm count on `(0,infinity)`.
Equivalently, recursively add the distinct positive-root count of `p_x` to
the algebraic count for `gcd(p_x,p_x')`.  The index `\mathcal I_h` is
obtained from the signed-remainder signs (4.5)--(4.6), after the harmless
no-real-root common factors described above are canceled.  Under (5.5), the
index drop is automatically a nonnegative multiple of four.  Thus even the
weaker strict estimate

\[
 \mathcal I_h>\mathcal I_{0+}-4
\tag{5.8}
\]

would force equality.  No such actual-source lower bound is presently
proved.

## 6. Boundary, removable-pole, and vanishing-leading-coefficient branches

The exact count does not discard any degeneracy.

### 6.1 Roots on the parabolic boundary

If a root satisfies `v(y)=h`, then `Gamma_h` passes through zero and its
literal winding is undefined.  The open-strip count is defined by

\[
 \boxed{
 \mathcal I_{h-}=\lim_{r\uparrow h}\mathcal I_r,}
\tag{6.1}
\]

where `r` avoids the finitely many root heights.  Equations (5.4)--(5.7)
hold with `\mathcal I_h` replaced by `\mathcal I_(h-)`.  A boundary root is
therefore not counted.  The outward limit instead includes it.

### 6.2 Removable lattice poles

Use the reduced quotient (1.8).  The count becomes

\[
 \widetilde Z_h=2m-\mathcal I_h,\qquad
 \mathcal I_{0+}=2(m-\widetilde R_+).
\tag{6.2}
\]

The deleted roots are real squared-lattice roots and cannot alter
`R_-(h)` or `C_h`.

### 6.3 The branch `c=0`

If `c=0`, the rational boundary path tends to zero and is not a based loop.
No winding is assigned to it.  Instead let `d=deg(tilde p)` and use the
polynomial boundary loop

\[
 \Upsilon_h(t)=\widetilde p((t+ih)^2),
 \qquad
 U_h=\operatorname {wind}_{t=-\infty}^{\infty}\Upsilon_h(t).
\tag{6.3}
\]

Its two endpoints have the same nonzero leading direction because its
degree in `t` is even.  The pole-free argument principle gives

\[
 \boxed{\widetilde Z_h=-2U_h.}
\tag{6.4}
\]

The same real/imaginary polynomial clearing and Cauchy-index convention
applies to `U_h`.  Equivalently, one may multiply `Phi(s^2)` by the even
power `s^(2(m-d))` to obtain a nonzero limit at infinity and then subtract
the introduced zero at the origin.  Formula (6.4) is the cleaner branch.

## 7. Natural-cutoff closed negative-root exclusion

Set

\[
 \delta={L\over4\pi}.
\tag{7.1}
\]

For `s=ir`, `0<=r<=delta`, the physical point is

\[
 z={2\pi\over L}ir=i{r\over2\delta}.
\tag{7.2}
\]

The factor

\[
 {\sin(\pi ir)\over ir}={\sinh(\pi r)\over r}
\tag{7.3}
\]

is strictly positive, with its positive limiting value at zero.  Therefore
the already-admitted eventual positivity

\[
 \widehat f_\lambda(i\tau)>0
 \qquad(|\tau|\le1/2)
\tag{7.4}
\]

implies

\[
 \Phi_\lambda(-r^2)\ne0
 \qquad(0\le r\le\delta),
\tag{7.5}
\]

and hence `R_-(delta)=0`.  Corollary 5.1 then gives the exact remaining
natural-cutoff target

\[
 \boxed{
 4C_\delta=\mathcal I_{0+}-\mathcal I_{\delta-}.}
\tag{7.6}
\]

Proving `\mathcal I_(delta-)=\mathcal I_(0+)` for the actual source would prove
the missing finite nonreal-root exclusion.  The admitted positivity proves
only (7.5); it supplies no signs for `A_delta(t)` or `B_delta(t)` when
`t!=0`.

On the physical upper boundary, (1.7) reads

\[
 \Gamma_\delta(t)
 ={\pi(t+i\delta)\over\sqrt L\sin(\pi(t+i\delta))}
 \widehat f_\lambda\!\left({2\pi t\over L}+{i\over2}\right).
\tag{7.7}
\]

Thus (7.6) is literally a boundary-phase problem after removal of the known
sine factor.

## 8. Why the admitted analytic inputs do not fix the winding

### 8.1 Functional symmetry

Reality and inversion evenness give

\[
 \widehat f(-z)=\widehat f(z),\qquad
 \widehat f(\overline z)=\overline{\widehat f(z)}.
\tag{8.1}
\]

On the upper and lower strip boundaries this is exactly the conjugation
relation used in Theorem 3.1.  It forces nonreal roots into quadruples and,
after (7.5), forces the index drop to be divisible by four.  It does not
force that drop to vanish.

The limiting functional equation has the same limitation.  The physical
lines `Im(z)=+/-1/2` correspond to the two boundaries of the critical strip.
Their argument-principle count is the total zero count in that strip.
Equating it to the real-axis count is precisely the missing critical-line
statement, not a consequence of the functional equation.

### 8.2 Imaginary-segment positivity

The sign (7.4) controls `Gamma_r(0)=Phi(-r^2)`.  It excludes the negative
real raw roots and nothing in (2.5)--(2.6) controls the winding away from
`t=0`.  Section 9 gives an exact family which stays positive on the entire
imaginary axis while its index changes by four.

### 8.3 Gevrey absolute error

The admitted growing-order estimates give strong absolute approximation on
fixed physical compacts, and an exponentially small absolute transform
remainder after comparison with a polynomial multiple of `Xi`.  Winding is
a relative quantity.  Across the natural finite bandwidth

\[
 |\Re z|\asymp{M\over L}\asymp{\lambda\over L},
\tag{8.2}
\]

the gamma factor makes the comparator exponentially smaller than the
admitted `exp(-cL^2)` absolute error.  Consequently no boundary lower bound
needed to preserve argument is available.  Compact convergence controls
compact pieces of the loop but permits index-changing zeros to escape in
the real direction.

## 9. Exact positive-imaginary-axis counterfamily

Fix `M>=2`, `h>0`, and choose positive distinct numbers
`rho_1,...,rho_(M-2)` which avoid the squared lattice.  For `a>0`, define

\[
 \boxed{
 p_a(y)=(y^2+a^2)\prod_{j=1}^{M-2}(y-\rho_j).}
\tag{9.1}
\]

The empty product is one when `M=2`.  This is a legitimate raw polynomial:
the exact interpolation inverse is

\[
 x_0={p_a(0)\over(-1)^M(M!)^2},
\tag{9.2}
\]

\[
 x_n={p_a(n^2)\over
 (-1)^{M-n}(M-n)!(M+n)!},\qquad1\le n\le M.
\tag{9.3}
\]

Every coordinate is nonzero, and the leading coefficient identity gives
`c=1`.

For every real `r`,

\[
 p_a(-r^2)=(r^4+a^2)
 \prod_{j=1}^{M-2}(-r^2-\rho_j),
\tag{9.4}
\]

while

\[
 D_M(-r^2)=\prod_{n=1}^M(-r^2-n^2).
\tag{9.5}
\]

Both have sign `(-1)^M`, so

\[
 \boxed{\Phi_a(-r^2)>0\quad(r\in\mathbb R).}
\tag{9.6}
\]

By (1.7), the finite transform is strictly positive on the entire imaginary
axis.  It also has all the real-even functional symmetries.

Nevertheless the nonreal raw roots are `y=+/-ia`, and

\[
 \boxed{v(\mathord\pm ia)^2={a\over2}.}
\tag{9.7}
\]

Thus

\[
 0<a<2h^2
 \quad\Longrightarrow\quad
 \mathcal I_{0+}-\mathcal I_h=4,
\tag{9.8}
\]

whereas

\[
 a>2h^2
 \quad\Longrightarrow\quad
 \mathcal I_{0+}-\mathcal I_h=0.
\tag{9.9}
\]

At `a=2h^2`, the pair lies exactly on the boundary and the inward index in
(6.1) gives the open-strip count.  This is a sharp obstruction to deriving
the winding from imaginary-axis positivity and symmetry.

For `M=2`, the coefficients are exactly

\[
 x_0={a^2\over4},\qquad
 x_1=-{1+a^2\over6},\qquad
 x_2={16+a^2\over24},
\tag{9.10}
\]

and `p_a(y)=y^2+a^2`.  This is also the exact finite source-Cauchy structural
fixture with `b_1=1,b_2=0` recorded in
`DIAGONAL_ANCHOR_FORCING_SIGNED_LAPLACIAN_STRIP_GATE.md`.  It is not the
pinned arithmetic source.

## 10. Gevrey-scale escaping-zero obstruction

The limitation of absolute approximation can be made quantitative.  Fix

\[
 0<\alpha<1/2,\qquad
 R_L\asymp{\lambda\over L},\qquad
 k_L=\lfloor\varepsilon L\rfloor
\tag{10.1}
\]

with a sufficiently small fixed `epsilon>0`, and define the real-even
polynomial

\[
 \boxed{
 H_L(z)=
 \left[1-\left({z\over R_L+i\alpha}\right)^{2k_L}\right]
 \left[1-\left({z\over R_L-i\alpha}\right)^{2k_L}\right].}
\tag{10.2}
\]

It has the exact properties

\[
 H_L(-z)=H_L(z),\qquad
 H_L(\overline z)=\overline{H_L(z)},
\tag{10.3}
\]

and, for real `tau`,

\[
 \boxed{
 H_L(i\tau)=
 \left|1-\left({i\tau\over R_L+i\alpha}\right)^{2k_L}\right|^2>0}
\tag{10.4}
\]

once `R_L>|tau|`.  Yet it has zeros at `R_L+i alpha`, `R_L-i alpha`, and
their even reflections, all in the open physical strip.

On every fixed compact set,

\[
 |H_L(z)-1|
 \le2\left({|z|\over\sqrt{R_L^2+\alpha^2}}\right)^{2k_L}
 +\left({|z|\over\sqrt{R_L^2+\alpha^2}}\right)^{4k_L}
 =\exp\{-\Theta(L^2)+O(L\log L)\}.
\tag{10.5}
\]

Multiplication by `H_L` therefore preserves the even functional equation,
real symmetry, imaginary-segment positivity, and Gevrey-scale compact
agreement with `Xi`, while inserting escaping off-axis zeros.  Using the
standard gamma-factor decay on `|Im(z)|<=1/2`, the perturbation
`Xi(z)(H_L(z)-1)` is Gevrey-small in **absolute** size on the full closed
horizontal strip: the maximum of

\[
 e^{-c|x|}(|x|/R_L)^{2k_L}
\tag{10.6}
\]

occurs at `|x|=O(k_L)=O(L)`, far below `R_L`, and is
`exp(-Theta(L^2))`.  Near the inserted roots the comparator itself is vastly
smaller still.

This analytic family is a non-implication example, not an actual finite source anchor.
The exact finite rational counterfamily is Section 9.  Both
show why a relative lower bound or an actual-source Cauchy-index theorem is
the missing input.

## 11. Exact remaining target

For the actual source-normalized natural-cutoff anchor, the admitted theorem
already gives the closed negative-real exclusion.  The remaining direct
target is exactly

\[
 \boxed{
 \mathcal I_{\delta-}=\mathcal I_{0+},
 \qquad \delta={L\over4\pi}.}
\tag{11.1}
\]

Every term in (11.1) is a finite Cauchy index with the orientation and
degenerate branches fixed above.  It can be certified for a specified exact
finite polynomial, but no theorem presently fixes it for the pinned
arithmetic anchor on an unbounded projection-convergent schedule.  Treating
(11.1) as automatic from the functional equation, positivity, or Gevrey
absolute control would assume the unresolved off-axis zero count.
