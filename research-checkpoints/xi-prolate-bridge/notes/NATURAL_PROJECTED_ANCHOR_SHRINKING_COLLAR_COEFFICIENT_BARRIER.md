# Natural projected-anchor shrinking-collar coefficient barrier

## 0. Exact outcome and claim boundary

This note audits the raw secular polynomial of the actual source-normalized
natural projected prolate anchor.  It adds five exact conclusions to the
earlier shrinking-collar reduction.

1. For a raw polynomial of actual degree `d`, a shifted Routh polynomial
   gives an exact necessary-and-sufficient coefficient criterion for an
   empty physical collar.  On the regular stratum the criterion is equality
   of two Hurwitz-determinant sign-variation counts.  Zero pivots require the
   one-sided epsilon-Routh, signed-subresultant, or equivalent Cauchy-index
   convention; silently deleting a zero Hurwitz minor is invalid.
2. The coefficients of the raw polynomial are triangular convolutions of
   the endpoint moments.  The positive-mode moments obey the characteristic
   recurrence of the squared lattice.
3. A direct Rouche argument closes a shrinking collar only under a relative
   lower bound for the first nonzero endpoint moment.  The admitted Gevrey
   bounds are upper bounds and therefore point in the opposite direction.
4. An exact checkerboard counterfamily has complete imaginary-axis
   positivity, arbitrarily many vanishing endpoint moments, and a nonreal
   pair at any prescribed physical height.  It can also match every fixed
   coefficient prefix of the actual anchor asymptotic.
5. For any finite anchor, the exact Hilbert distance from its high shell to
   a prescribed horizontally escaping root has a two-by-two endpoint-jet
   limit.  The natural endpoint flatness makes this distance exponentially
   small.  Thus the admitted absolute estimates and endpoint upper bounds
   cannot provide a uniform Routh-minor margin.

The Routh criterion is a reformulation of the missing root count, not a sign
theorem for the actual coefficients.  The two counterconstructions are
structurally compatible finite states, not the locked prolate source.  This
note proves no actual global collar equality, no eventual location of every
nonreal raw root outside the critical strip, no source-specific determinant
margin, no equation (5.2) of `DIRECT_RH_ATTACK.md`, and no Riemann-hypothesis
conclusion.  The formal state remains `P0_INVALIDATED`, and the standard
eight are unchanged.

## 1. Frozen inputs and cutoff convention

Only the following repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `notes/NATURAL_CUTOFF_STRIP_WINDING_INDEX.md` | `67997ba160cc3a9ba6cdcb4a387120e3b62cb9665b684c6253bb618ecd9053a0` |
| `tests/test_natural_cutoff_strip_winding_index.py` | `0b409b8fe8774ab8487bdac5cf3ba8dbaf2db4195ab0938a0ce5c7b1bcb8a45c` |
| `notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md` | `baa9a4d07f1bfa2e298efeca5ed8d226c2e991330a2f029f5586380ccb8d5c1c` |
| `tests/test_natural_cutoff_negative_real_root_exclusion.py` | `6b37c98bdb946d6c9236e768d4cf2c00652ecdbf10e221a516ac4454d6680fad` |
| `notes/NATURAL_CUTOFF_SHRINKING_COLLAR_ESCAPE_REDUCTION.md` | `6a14b68a7ab048aad90580c2043bb8309839b6ea9947e1eac0defaede3b8e120` |
| `tests/test_natural_cutoff_shrinking_collar_escape_reduction.py` | `04a66bfd2c4bd560b4fe0e5b3c5336c26a8bbc7535ad3e2fed73d4209845c55c` |
| `notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md` | `384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c` |
| `notes/VERIFIED_HEIGHT_SHRINKING_COLLAR_PARTIAL_THEOREM.md` | `d731f67fd8bb7b0a704728df1fc36b72984722eee3b5c29165503aca7d9a9f4d` |
| `tests/test_verified_height_shrinking_collar_partial_theorem.py` | `8d99ef99db0e2f36df4d76624afa39427ffff4c59c10fe0c9961aad9953e3c34` |

The source conventions are

\[
 L=2\log\lambda,
 \qquad
 V_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L},
 \qquad
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt.       \tag{1.1}
\]

Lebesgue measure, zero extension, explicit inversion evenization, the
label-zero/label-four source combination, and the factor-four limiting
normalization remain exactly as pinned.  No finite Weil ground vector or
numerical raw root is imported.

There are two distinct cutoffs which must not be conflated.

\[
 \boxed{M=\lceil\lambda\rceil}                         \tag{1.2}
\]

is the strict direct-anchor mode cutoff in
`f_lambda=P_M X_lambda`.  It has coordinates `x_0,...,x_M` and raw degree
at most `M`.  On the odd schedule `lambda=p/2`,

\[
 \boxed{M={p+1\over2}.}                                \tag{1.3}
\]

The adjacent outer finite-matrix pilot instead used

\[
 \boxed{N=M+1=\lceil\lambda\rceil+1,}                  \tag{1.4}
\]

with coordinates through `x_N` and raw degree at most `N`.  Here `M` and
`N` are mode cutoffs, not coordinate counts.

## 2. Exact raw, barycentric, and adjacent-cutoff formulas

For a generic mode cutoff `K`, write

\[
 f=x_0V_0+\sum_{n=1}^Kx_n(V_n+V_{-n}),
 \qquad
 D_K(y)=\prod_{n=1}^K(y-n^2),                         \tag{2.1}
\]

and

\[
 p_K(y)=x_0D_K(y)
       +2y\sum_{n=1}^Kx_n{D_K(y)\over y-n^2}.          \tag{2.2}
\]

The secular and transform identities are

\[
 \boxed{
 \Phi_K(y)={p_K(y)\over D_K(y)}
 =x_0+2y\sum_{n=1}^K{x_n\over y-n^2}
 =c+2\sum_{n=1}^K{n^2x_n\over y-n^2},}
 \qquad c=x_0+2\sum_{n=1}^Kx_n,                      \tag{2.3}
\]

and, with `s=zL/(2*pi)`,

\[
 \boxed{
 \widehat f(z)={\sqrt L\over\pi}{\sin(\pi s)\over s}
                \Phi_K(s^2).}                        \tag{2.4}
\]

The exact barycentric inverse is

\[
 \boxed{p_K(0)=(-1)^K(K!)^2x_0,}                     \tag{2.5}
\]

\[
 \boxed{
 p_K(n^2)=(-1)^{K-n}(K-n)!(K+n)!x_n
 \quad(1\leq n\leq K).}                             \tag{2.6}
\]

Adding one outer mode is not a harmless relabeling.  If `p_(K-1)` uses the
same lower coordinates, then

\[
 \boxed{
 p_K(y)=(y-K^2)p_{K-1}(y)+2yx_KD_{K-1}(y).}           \tag{2.7}
\]

Thus an adjacent-outer root table cannot be promoted to a theorem about the
strict direct-anchor polynomial.

For `y=A+iB`, set

\[
 v(y)=\left({|y|-A\over2}\right)^{1/2}.              \tag{2.8}
\]

If `s^2=y`, then `|Im(s)|=v(y)`, and the physical height is

\[
 |\Im z|={2\pi\over L}v(y),
 \qquad
 \delta={L\over4\pi}.                                \tag{2.9}
\]

The critical-strip boundary is `v(y)=delta`.

## 3. Endpoint moments, coefficients, and recurrence

Write the squared-lattice polynomial in descending order as

\[
 D_K(y)=\sum_{j=0}^K d_jy^{K-j},
 \qquad d_0=1,                                       \tag{3.1}
\]

and define

\[
 m_0=c,
 \qquad
 m_j=\mu_j:=2\sum_{n=1}^Kn^{2j}x_n\quad(j\geq1).     \tag{3.2}
\]

At infinity,

\[
 \Phi_K(y)=\sum_{j\geq0}m_jy^{-j}.                  \tag{3.3}
\]

If

\[
 p_K(y)=\sum_{j=0}^K\pi_jy^{K-j},                    \tag{3.4}
\]

where leading zero coefficients are retained, multiplication of (3.1) and
(3.3) gives the exact triangular rule

\[
 \boxed{
 \pi_j=\sum_{k=0}^jd_{j-k}m_k
 \quad(0\leq j\leq K).}                             \tag{3.5}
\]

The proper rational tail also gives

\[
 \boxed{
 m_{r+K}+d_1m_{r+K-1}+\cdots+d_Km_r=0
 \quad(r\geq1).}                                    \tag{3.6}
\]

The restriction `r>=1` is essential: the `r=0` expression is the constant
coefficient of `p_K`, not generally zero.

At the centered endpoint,

\[
 \boxed{c=\sqrt L\,f(L/2),}                          \tag{3.7}
\]

\[
 \boxed{
 \mu_j=(-1)^j\sqrt L
 \left({L\over2\pi}\right)^{2j}f^{(2j)}(L/2)
 \quad(j\geq1).}                                    \tag{3.8}
\]

Hence if `m_0=...=m_(J-1)=0`, the raw degree is at most `K-J`, and its
new leading coefficient is `m_J`.

## 4. Exact shifted Routh-Hurwitz collar criterion

Let `p` be the reduced raw numerator after deleting common squared-lattice
factors, let `d=deg(p)`, and write

\[
 p(y)=\sum_{k=0}^da_ky^k,
 \qquad a_d\ne0.                                    \tag{4.1}
\]

For `r>0`, define the monic shifted Routh polynomial

\[
 \boxed{
 {\cal R}_r(w)={(-1)^d\over a_d}p(-(w+r)^2)
 =w^{2d}+\alpha_1(r)w^{2d-1}+\cdots+\alpha_{2d}(r).} \tag{4.2}
\]

The coefficients are explicit:

\[
 \boxed{
 \alpha_j(r)={(-1)^d\over a_d}
 \sum_{k=\lceil(2d-j)/2\rceil}^d
 (-1)^ka_k{2k\choose 2d-j}r^{2k-(2d-j)}.}           \tag{4.3}
\]

Put `alpha_0=1`, set all out-of-range `alpha_j` to zero, and define the
Hurwitz determinants

\[
 \boxed{
 \Delta_j(r)=\det\bigl(\alpha_{2q-p}(r)\bigr)_{p,q=1}^j
 \quad(1\leq j\leq2d).}                             \tag{4.4}
\]

Let `nu(r)` count roots of `R_r` in `Re(w)>0`, with multiplicity.  The map

\[
 s=i(w+r)                                             \tag{4.5}
\]

sends `Re(w)>0` to `Im(s)>r`.  Therefore, away from a boundary root,

\[
 \boxed{Z_r=2d-2\nu(r),}                             \tag{4.6}
\]

where `Z_r` counts roots of `p(s^2)` in `|Im(s)|<r`.

On the regular Routh stratum, where the displayed denominators are nonzero,

\[
 \boxed{
 \nu(r)=\operatorname {Var}\left(
 1,\Delta_1,{\Delta_2\over\Delta_1},\ldots,
 {\Delta_{2d}\over\Delta_{2d-1}}
 \right).}                                           \tag{4.7}
\]

Here `Var` is the number of sign changes.  If a first-column entry vanishes,
(4.7) must be replaced by exact epsilon-Routh signs, signed subresultants,
or the equivalent one-sided Cauchy index.  A zero minor may occur even when
there is no boundary root, so a zero is not simply omitted.

Let `nu(r+)` and `nu(r-)` denote the limits from heights above and below
`r`, respectively.  After the proved closed negative-real branch is
excluded, the number `C_(a,b)` of conjugate nonreal raw-root pairs with
`a<v(y)<b` is

\[
 \boxed{
 C_{(a,b)}={\nu(a+)-\nu(b-)\over2}.}                 \tag{4.8}
\]

Thus the open physical collar `epsilon<|Im(z)|<1/2`, with

\[
 a={\epsilon L\over2\pi},
 \qquad b=\delta,                                    \tag{4.9}
\]

is empty if and only if

\[
 \boxed{\nu(a+)=\nu(\delta-).}                       \tag{4.10}
\]

The exact coefficient condition for no raw nonreal root in
`0<|Im(z)|<1/2` is the one-sided limit

\[
 \boxed{\nu(0+)=\nu(\delta-),}                       \tag{4.11}
\]

with each side evaluated by (4.7) on a neighboring regular height or by the
degenerate rule above.  The point `r=0` is necessarily nongeneric because
`R_0` is even.

For orientation, take `p(y)=y^2+A^2`.  Then

\[
 \Delta_1=4r,
 \qquad
 \Delta_2=20r^3,
 \qquad
 \Delta_3=16r^2(4r^4-A^2),
 \qquad
 \Delta_4=(r^4+A^2)\Delta_3.                        \tag{4.12}
\]

The only crossing occurs at `A=2r^2`, exactly when the raw roots have
`v=sqrt(A/2)=r`.  For `A<2r^2`, all four `s` roots are inside the strip and
`nu(r)=0`.  This is the stable shifted Hermite--Biehler branch, demonstrating
its reversed geometry: stability puts all roots inside the strip, whereas
the collar problem permits exterior roots and seeks only to remove its
interior nonreal roots.

## 5. The strongest direct Rouche condition is relative

Let `k` be the least nonnegative index with `m_k!=0`.  The finite geometric
identity gives

\[
 \boxed{
 y^k\Phi_K(y)=m_k+
 2\sum_{n=1}^K{n^{2k+2}x_n\over y-n^2}.}             \tag{5.1}
\]

For `s=t+ir`,

\[
 |s^2-n^2|=|s-n|\,|s+n|\geq2nr.                     \tag{5.2}
\]

Consequently

\[
 \left|(s^2)^k\Phi_K(s^2)-m_k\right|
 \leq{1\over r}\sum_{n=1}^Kn^{2k+1}|x_n|.           \tag{5.3}
\]

Define

\[
 A_k=\sum_{n=1}^Kn^{2k+1}|x_n|.                     \tag{5.4}
\]

The exact sufficient condition

\[
 \boxed{r|m_k|>A_k}                                  \tag{5.5}
\]

excludes every nonlattice root on the complete line `|Im(s)|=r`.  If (5.5)
holds at one `a>0`, it holds for every `r>=a`, so every nonreal root has raw
height below `a`.  In particular, a shrinking-collar theorem would follow
from

\[
 \boxed{{A_k\over|m_k|}=o(L),}                       \tag{5.6}
\]

by choosing `A_k/|m_k|<a_lambda=o(L)`.

The admitted Gevrey estimates have the opposite orientation.  The analytic
projection-tail estimate, the moving-endpoint Gaussian bound, and the
finite-degree Bernstein evaluation of the projected remainder imply, for
each fixed `j`, qualitative constants `c_j,C_j>0` with

\[
 |m_j|\leq C_je^{-c_jL^2}.                            \tag{5.7}
\]

Equation (5.7) is an upper bound on the denominator of (5.6).  It supplies
neither a nonzero lower bound nor control of `A_k/|m_k|`.  Likewise, every
Hurwitz determinant is a polynomial in coefficients which are triangular
combinations of these moments.  Driving the leading moments toward zero
drives the Routh array toward a degenerate stratum; it does not fix the
one-sided signs of its minors.

## 6. Checkerboard, flat-jet, prescribed-height counterfamily

Fix integers `K>=2` and `0<=J<=K-2`, choose `A>0`, and take distinct real
numbers

\[
 \rho_1,\ldots,\rho_{K-J-2}>K^2.                     \tag{6.1}
\]

Define

\[
 \boxed{
 p(y)=(-1)^J(y^2+A^2)
 \prod_{\ell=1}^{K-J-2}(y-\rho_\ell).}              \tag{6.2}
\]

Use (2.5)--(2.6) to define its unique raw coordinates.  Since `p(n^2)` has
sign `(-1)^K` for every `0<=n<=K`, one obtains

\[
 \boxed{\operatorname {sgn}(x_n)=(-1)^n
 \quad(0\leq n\leq K).}                              \tag{6.3}
\]

For every real `r`, both numerator and denominator have sign `(-1)^K` at
`y=-r^2`, so

\[
 \boxed{\Phi_K(-r^2)>0\quad(r\in\mathbb R).}          \tag{6.4}
\]

The degree of (6.2) is `K-J`.  Equations (3.3)--(3.5) therefore give

\[
 \boxed{m_0=m_1=\cdots=m_{J-1}=0,
 \qquad m_J=(-1)^J.}                                 \tag{6.5}
\]

Nevertheless, `p` has the nonreal roots `y=+iA` and `y=-iA`, with

\[
 |\Im z|={2\pi\over L}\sqrt{A\over2}.               \tag{6.6}
\]

For any prescribed `0<alpha<1/2`, taking

\[
 \boxed{A={\alpha^2L^2\over2\pi^2}}                 \tag{6.7}
\]

puts those roots at physical height `alpha`.

The family can also reproduce the actual fixed-prefix asymptotic.  The
exact ratio is

\[
 {x_n\over(-1)^nx_0}
 ={(K!)^2\over(K-n)!(K+n)!}
  {n^4+A^2\over A^2}
  \prod_{\ell=1}^{K-J-2}{\rho_\ell-n^2\over\rho_\ell}. \tag{6.8}
\]

For each fixed `n`, if `K` tends to infinity, `A` tends to infinity as in
(6.7), and `min(rho_l)/K^4` tends to infinity, the right side tends to one.
After setting `sqrt(L)x_0=Xi(0)/4`, this matches

\[
 \sqrt L\,x_n\longrightarrow(-1)^n{\Xi(0)\over4}     \tag{6.9}
\]

on every fixed prefix.  The family is not asserted to satisfy the global
prolate source equations.  It proves that checkerboard signs, full
imaginary-axis positivity, fixed-prefix asymptotics, and any prescribed
finite string of zero endpoint moments do not imply an empty collar.

The barycentric signs also explain why ordinary total positivity points in
the wrong direction: checkerboard `x_n` make all interpolation values
`p(n^2)` have the same sign, rather than the alternating signs which would
force a real zero between consecutive nodes.

## 7. Exact high-shell distance to a prescribed escaping root

Use Hilbert coordinates

\[
 u_n=\sqrt2\,x_n\quad(n\geq1),
 \qquad
 \|f\|_2^2=x_0^2+\sum_{n=1}^Ku_n^2.                 \tag{7.1}
\]

Let

\[
 I_K=\{\lceil K/2\rceil,\ldots,K\},
 \qquad m=|I_K|,
 \qquad S_2=\sum_{n\in I_K}n^2,
 \qquad S_4=\sum_{n\in I_K}n^4.                    \tag{7.2}
\]

Fix `v>0`, put `s_R=R+iv`, `y_R=s_R^2`, and perturb only the real
coordinates `u_n` with `n in I_K`.  Define the complex evaluation row

\[
 g_{R,n}=\sqrt2\,{y_R\over y_R-n^2},                 \tag{7.3}
\]

the real two-row matrix

\[
 B_R=\begin{pmatrix}
       \Re g_{R,n}\\
       \Im g_{R,n}
     \end{pmatrix}_{n\in I_K},                       \tag{7.4}
\]

and

\[
 b_R=-\begin{pmatrix}\Re\Phi_K(y_R)\\
                      \Im\Phi_K(y_R)\end{pmatrix}.   \tag{7.5}
\]

For all sufficiently large `R`, `B_R` has rank two.  The exact squared
distance from the original shell to the affine set which makes `y_R` a raw
root is

\[
 \boxed{
 d_R^2=b_R^T(B_RB_R^T)^{-1}b_R.}                    \tag{7.6}
\]

The minimum perturbation is

\[
 \boxed{
 \Delta u_R=B_R^T(B_RB_R^T)^{-1}b_R,}               \tag{7.7}
\]

and satisfies `Phi_(x+Delta x)(y_R)=0` exactly.

As `R` tends to infinity,

\[
 \Re g_{R,n}\longrightarrow\sqrt2,
 \qquad
 -{R^3\over2v}\Im g_{R,n}\longrightarrow\sqrt2\,n^2, \tag{7.8}
\]

while

\[
 \Re\Phi_K(y_R)\longrightarrow c,
 \qquad
 -{R^3\over2v}\Im\Phi_K(y_R)\longrightarrow\mu_1.  \tag{7.9}
\]

Rescaling the second constraint does not change its affine solution set.
Therefore (7.6) has the exact limit

\[
 \boxed{
 \lim_{R\to\infty}d_R^2
 =(c,\mu_1)G_K^{-1}(c,\mu_1)^T,}                    \tag{7.10}
\]

where

\[
 G_K=2\begin{pmatrix}m&S_2\\S_2&S_4\end{pmatrix}.  \tag{7.11}
\]

Equivalently,

\[
 \boxed{
 \lim_{R\to\infty}d_R^2
 ={S_4c^2-2S_2c\mu_1+m\mu_1^2
   \over2(mS_4-S_2^2)}.}                             \tag{7.12}
\]

The denominator is positive because the shell contains at least two
distinct squared modes.  Riemann-sum evaluation gives

\[
 {m\over K}\longrightarrow{1\over2},
 \qquad
 {S_2\over K^3}\longrightarrow{7\over24},
 \qquad
 {S_4\over K^5}\longrightarrow{31\over160},
 \qquad
 {mS_4-S_2^2\over K^6}\longrightarrow{17\over1440}. \tag{7.13}
\]

Hence an absolute constant `C` gives

\[
 \boxed{
 \limsup_{R\to\infty}d_R
 \leq C\left({|c|\over\sqrt K}
              +{|\mu_1|\over K^{5/2}}\right).}       \tag{7.14}
\]

For the natural anchor, the fixed-jet upper bounds (5.7) make (7.14)
exponentially small.  Choosing

\[
 v={\alpha L\over2\pi},
 \qquad0<\alpha<1/2,                                 \tag{7.15}
\]

inserts a root at physical height `alpha`, while `R` sends its physical real
part to infinity.  Every fixed low coefficient is unchanged.  Moreover,
Cauchy--Schwarz on `|Im(z)|<=1/2` costs only `O(lambda^(1/2))`, so an
`exp(-cL^2)` Hilbert perturbation preserves the admitted absolute compact
and closed-imaginary-segment estimates.

This is the promised sharp obstruction: endpoint flatness makes a bad
escaping root close in coefficient norm.  To control the Routh determinants
one needs a source-specific oriented lower margin, not another one-sided
upper bound on endpoint jets.

## 8. Audit of the proposed closure routes

1. **Routh--Hurwitz and generalized Hermite--Biehler.**  Equations
   (4.7)--(4.11) are exact and complete, including degeneracy.  What is
   missing is an actual-source theorem fixing the one-sided determinant
   signs.  Classical shifted Hermite--Biehler has the reversed inclusion
   geometry shown by (4.12).
2. **Stieltjes and continued fractions.**  The exact fixed-mode asymptotic
   (6.9) gives alternating residues `n^2x_n`; in particular
   `x_1x_2<0` eventually.  Thus the secular function is not a positive
   Stieltjes or Herglotz transform.  Indefinite continued fractions encode a
   negative index but do not lower-bound the heights of its complex pairs.
3. **Total positivity and sign regularity.**  Formula (6.3) makes the
   barycentric values same-signed.  The exact counterfamily shows that this
   sign pattern coexists with a prescribed collar pair.
4. **Rouche.**  The usable estimate is precisely the relative inequality
   (5.5).  Absolute Gevrey agreement, including exponentially small endpoint
   jets, cannot substitute for (5.6).  A global comparison with `Xi` also
   loses to gamma-factor decay at the horizontal edge.
5. **Prolate recurrences.**  Individual prolate labels have exact
   three-term Mellin recurrences, but the locked label-zero/label-four source
   is a two-channel combination (or a scalar higher-order recurrence), and
   arithmetic sampling plus finite projection introduces connection data.
   No positive Jacobi or sign-regular coefficient recurrence for the raw
   `p_M` follows from the admitted recurrence package.

The minimal new coefficient theorem is therefore explicit: prove that the
one-sided Routh sign-variation count in (4.7), with its signed-subresultant
extension through zero minors, has the same value at `0+` (or a chosen
`a_lambda+`) and at `delta-` for the actual strict-`M` coefficients.  A
quantitative alternative is the relative endpoint lower bound (5.6).

## 9. Strongest actual theorem and noncertified diagnostics

The strongest current actual-source statement remains the fixed-horizontal
compact theorem imported above.  Let

\[
 H_{\rm PT}=3000175332800.                            \tag{9.1}
\]

For every fixed `0<R<H_PT`, the strict direct anchor with
`M=ceil(lambda)` is eventually zero-free on

\[
 \boxed{
 |\Re z|\leq R,
 \qquad {1\over L}\leq|\Im z|\leq{1\over2}.}         \tag{9.2}
\]

No simplicity of the verified zeros is used.  The pinned finite-height
zeta verification is disclosed but is not replayed in this repository.
The radius `R` is fixed; (9.2) supplies neither a cofinal horizontal
exhaustion nor the global Routh equality (4.11).

For context only, a live pilot used the adjacent outer cutoff `N=M+1`, not
the strict direct cutoff.  It reported: `p=3, N=3`, all raw roots positive;
`p=5, N=4`, two nonreal raw roots and minimum physical off-axis height
`10.0571004864`; and `p=7, N=5`, four nonreal raw roots and minimum height
`7.46895478018`.  The reported secular residuals were below `1.3e-81` and
determinant-lemma defects below `9.1e-79`.

Those decimal observations are noncertified point diagnostics, are not read
by the exact test, and are not part of any theorem here.  Their off-axis
zeros are far outside `|Im(z)|<1/2`, so they do not contradict the desired
shrinking-collar statement.  Equations (1.2)--(1.4) and (2.7) prevent their
promotion to the strict-`M` anchor.

The direct route remains open.  This note supplies an exact coefficient
criterion and a sharp stability barrier, not its actual-source sign input.
