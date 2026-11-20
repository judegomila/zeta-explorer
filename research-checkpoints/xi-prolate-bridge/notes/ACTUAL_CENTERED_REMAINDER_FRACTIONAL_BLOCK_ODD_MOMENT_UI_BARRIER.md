# Actual centered-remainder fractional-block odd-moment UI barrier

## 0. Exact outcome and claim boundary

Put

\[
 x=\lambda^2,\qquad L=\log x,\qquad \beta=1-\alpha.       \tag{0.1}
\]

For fixed real `s>1` and fixed `A>0`, consider

\[
 I_{x,s}=[Ax^s,2Ax^s],\qquad T_s=Ax^s.                    \tag{0.2}
\]

The frozen Montgomery--Vaughan input controls the normalized Gaussian
moments on this block through exactly the guaranteed degree

\[
 M(s)=\lfloor2s\rfloor.                                  \tag{0.3}
\]

Equality is included: at a half-integer `s=r+1/2`, the odd moment of
degree `2r+1` is controlled.  That extra odd moment does not supply the
uniform integrability needed to turn the `He_(r+1)` weighted tail into a
macroscopic positive excess.  For the order-`T_s L` conclusion, the usable
Hermite index is therefore

\[
 k_{\rm UI}(s)=\lfloor s\rfloor,\qquad
 s(1-\alpha)<\rho_{\lfloor s\rfloor}.                    \tag{0.4}
\]

On each interval `r<=s<r+1`, the ratio
`rho_r/s` is largest at `s=r`.  Consequently the checkpoint-1.68 integer
optimum remains the exact optimum of the full fixed-real-exponent
Montgomery--Vaughan/moment/uniform-integrability hierarchy:

\[
 \sup_{s\geq2}{\rho_{\lfloor s\rfloor}\over s}
 =\sup_{r\geq2}{\rho_r\over r}
 ={\sqrt{3+\sqrt6}\over4}.                              \tag{0.5}
\]

There is a weaker odd-shelf consequence.  If `r>=1`,

\[
 r+{1\over2}\leq s<r+1,
 \qquad s(1-\alpha)<\rho_{r+1},                         \tag{0.6}
\]

then the full and high-time centered remainder statistics satisfy

\[
 \boxed{
 \mathfrak R_{\lambda,\alpha},\qquad
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha,r,s}x^{s-r}L^{2r+1}.}                   \tag{0.7}
\]

For every fixed `s<r+1`, however,

\[
 {x^{s-r}L^{2r+1}\over x/L}
 =x^{s-r-1}L^{2r+2}\longrightarrow0.                   \tag{0.8}
\]

Thus the fractional odd shelf cannot invalidate the required upper target
`x/L=lambda^2/L`.  At `s=r+1`, the next even moment becomes controlled and
one is back at the integer `He_(r+1)` hierarchy.

The best odd-shelf threshold, only for the sub-target-scale conclusion
(0.7), occurs at `r=2`, `s=5/2`:

\[
 \alpha>1-{2\sqrt3\over5}
 \quad\Longrightarrow\quad
 \mathfrak R_{\lambda,\alpha},\qquad
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha}x^{1/2}L^5=\lambda L^5.                 \tag{0.9}
\]

This is `o(lambda^2/L)` and is not an improvement of the checkpoint-1.68
barrier at the required scale.

The phase-volume comparison remains one-way.  No lower bound here is a
lower bound for actual phase volume.  No determinant convergence,
zero-location theorem, Riemann hypothesis, converse, or de
Bruijn--Newman bound follows.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen pair and source boundary

This note freezes exactly the checkpoint-1.68 long-block pair:

| Frozen path | SHA-256 |
|---|---|
| `notes/ACTUAL_CENTERED_REMAINDER_LONG_BLOCK_HERMITE_MOMENT_BARRIER.md` | `1997f8b14c5f90977f744788d069f6e771da078c06562dac2d78c671c01a95c1` |
| `tests/test_actual_centered_remainder_long_block_hermite_moment_barrier.py` | `cbbc300b9a050ac161d9f8feae996947b522043ae50663799dfc194ed4d3dd2d` |

That pair supplies the prime polynomial, the proper-prime-power split, the
weighted Montgomery--Vaughan form, Gaussian diagonal moments, Hermite
localizer, centered-remainder definition, and one-way phase-volume scope.
Its inherited primary input remains Montgomery and Vaughan, *Hilbert's
Inequality*, Corollary 2.  No new external input, source lock, vendored
byte, zero table, orbit sample, or numerical artifact is introduced here.

## 2. Exact real-exponent moment ceiling

Retain

\[
 P_x(t)=\sum_{p\leq x}{\log p\over\sqrt p}p^{it},
 \qquad Y_x(t)=\operatorname {Re}P_x(t),                \tag{2.1}
\]

and the normalized block average

\[
 \mathbb E_{x,s}f={1\over T_s}\int_{I_{x,s}}f(t)dt,
 \quad
 \sigma_{x,s}^2=\mathbb E_{x,s}Y_x^2,
 \quad Z_{x,s}={Y_x\over\sigma_{x,s}}.                 \tag{2.2}
\]

For fixed nonnegative integers `a,b`, unique factorization removes the
coefficient diagonal when `a!=b`.  Polarized Montgomery--Vaughan gives

\[
 \left|\mathbb E_{x,s}
 P_x(t)^a\overline {P_x(t)}^{\,b}\right|
 \ll_{A,a,b}x^{(a+b)/2-s}L^{(a+b)/2}.                  \tag{2.3}
\]

For `a=b=j`, the diagonal is `j!S_x^j` and the normalized error is

\[
 O_{A,j}\bigl(x^{j-s}L^j\bigr),
 \qquad S_x=\left({1\over2}+o(1)\right)L^2.            \tag{2.4}
\]

If `d=a+b<=2s`, the ratio of (2.3) to the natural scale `L^d` is

\[
 O\left(x^{d/2-s}L^{-d/2}\right)=o(1).                \tag{2.5}
\]

The same conclusion holds for (2.4).  In particular, equality `d=2s`
still has a negative power of `L`.  Expanding powers of
`(P_x+overline P_x)/2` proves

\[
 \mathbb E_{x,s}Z_{x,s}^j\longrightarrow
 \begin{cases}
 0,&j\text{ odd},\\
 (j-1)!!,&j\text{ even},
 \end{cases}
 \qquad 0\leq j\leq\lfloor2s\rfloor.                 \tag{2.6}
\]

For the first missing even degree on the odd shelf,
`r+1/2<=s<r+1`, the same source gives only

\[
 \mathbb E_{x,s}|Z_{x,s}|^{2r+2}
 \ll_{A,r}1+{x^{r+1-s}\over L^{r+1}}.                 \tag{2.7}
\]

For every fixed `s<r+1`, the second term diverges polynomially.  Equation
(2.7) is not a uniform-integrability bound.

## 3. Why the odd Hermite localizer loses uniform integrability

Let `q_k` be the normalized top eigenpolynomial of the Gaussian Jacobi
matrix `J_k`, so that `deg q_k=k-1` and

\[
 \int zq_k(z)^2d\gamma(z)=\rho_k.                     \tag{3.1}
\]

Put `r=floor(s)`.  Moments through degree `2r` control

\[
 \mathbb E\{(c-Z)q_r(Z)^2\}\longrightarrow c-\rho_r  \tag{3.2}
\]

and uniformly bound the next power needed to interpolate the positive
tail.  This is the checkpoint-1.68 argument and proves a fixed positive
`E(Z-c)_+` whenever `c<rho_r`.

On the odd shelf, moments through `2r+1` instead give the formally stronger
identity

\[
 \mathbb E\{(c-Z)q_{r+1}(Z)^2\}\longrightarrow
 c-\rho_{r+1}.                                        \tag{3.3}
\]

For `c<rho_(r+1)`, (3.3) forces a fixed amount of the *weighted* tail

\[
 \mathbb E\{(Z-c)_+q_{r+1}(Z)^2\}\geq d_{r,c}>0.      \tag{3.4}
\]

But the integrand grows like `(Z-c)_+|Z|^(2r)`.  Turning (3.4) into a
fixed lower bound for `E(Z-c)_+` requires a uniformly bounded absolute
moment of some order strictly larger than `2r+1`; the natural first choice
is degree `2r+2`.  Interpolation would read

\[
 \mathbb E U^{2r+1}
 \leq
 (\mathbb E U)^{1/(2r+1)}
 (\mathbb E U^{2r+2})^{2r/(2r+1)},
 \qquad U=(Z-c)_+.                                    \tag{3.5}
\]

The signed odd moment in (2.6) is not an absolute-moment bound, and (2.7)
does not close (3.5).  This is the precise uniform-integrability gap.

## 4. General escaping-mass countermeasure

The gap is real, not merely a missing interpolation trick.  Fix `r>=1`
and `c>rho_r`.  Let `He_j` be the probabilists' Hermite polynomials and put

\[
 Q_{r+1,c}(z)=\operatorname {He}_{r+1}(z)
 -{\operatorname {He}_{r+1}(c)\over
    \operatorname {He}_r(c)}\operatorname {He}_r(z). \tag{4.1}
\]

The Christoffel--Darboux formula shows that `Q_(r+1,c)` has `r+1` simple
real roots, all at most `c`, with `c` itself the largest root.  Division by
`Q_(r+1,c)` gives a Gaussian--Radau quadrature measure `nu_(r,c)` on those
roots such that

\[
 \int z^j d\nu_{r,c}(z)=\int z^j d\gamma(z),
 \qquad 0\leq j\leq2r.                                \tag{4.2}
\]

All quadrature weights are positive: exactness through degree `2r`
applied to the square of each degree-`r` Lagrange cardinal polynomial
identifies its weight with a strictly positive Gaussian integral.

Write

\[
 m=\int z^{2r+1}d\nu_{r,c}(z).                        \tag{4.3}
\]

If `m!=0`, choose `epsilon=-sgn(m)` and, for large `R`, set

\[
 w_R={|m|\over R^{2r+1}+|m|},\qquad
 \mu_R=(1-w_R)\nu_{r,c}+w_R\delta_{\epsilon R}.       \tag{4.4}
\]

If `m=0`, simply take `mu_R=nu_(r,c)`.  Equations (4.2)--(4.4) give

\[
 \int z^j d\mu_R(z)\longrightarrow
 \int z^j d\gamma(z),\qquad0\leq j\leq2r+1,          \tag{4.5}
\]

and the top odd moment in (4.5) is exactly zero for every `R`.  Yet

\[
 \int(z-c)_+d\mu_R(z)=O_{r,c}(R^{-2r})\longrightarrow0.
                                                                    \tag{4.6}
\]

For `c=rho_r`, let the Radau endpoint decrease to `rho_r` while `R`
increases.  The same diagonal construction makes the excess above
`rho_r` tend to zero.  Thus Gaussian moment convergence through degree
`2r+1` forces no fixed positive excess at any `c>=rho_r`.

The countermeasure may be placed inside the deterministic support scale
available for the actual prime polynomial.  Indeed,

\[
 \|Z_{x,s}\|_\infty
 \leq B_x\ll{\sqrt x\over L},                          \tag{4.7}
\]

so taking `R` comparable to `sqrt(x)/L` in (4.4) respects (4.7).  When the
remote atom is needed, its mass is `asymp R^(-(2r+1))`, smaller than the
tail bound obtained from the controlled `2r`-th moment.  The elementary derivative
bound `||Z'_(x,s)||_infty=O(sqrt(x))=O(LB_x)` only requires a peak width
`Omega(1/L)`.  On an odd-shelf block, the time length represented by the
escaping mass is

\[
 T_sw_R\asymp
 x^{s-r-1/2}L^{2r+1}\gg L^{2r+1},                    \tag{4.8}
\]

so that derivative bound does not exclude it.  This is a structural
nonimplication, not a claim that the actual prime polynomial realizes the
quadrature measure.

Fixed truncations and rational localizers do not evade the example.
The measures `mu_R` converge weakly to `nu_(r,c)`, which is supported on
`(-infinity,c]`.  A bounded fixed truncation loses the remote atom and
therefore loses the top odd moment.  A localizer growing slowly enough to
be uniformly integrable is governed only by the retained lower moments.
A localizer retaining degree-`2r+1` growth sees the odd moment but is not
uniformly integrable.  Letting the truncation grow with `R` incurs exactly
the `R^(-2r)` loss in (4.6).

## 5. The sharp weak odd-shelf consequence

Although (3.4) does not give macroscopic excess, it gives the sharp scale
that survives the deterministic support bound.  The frozen PNT estimates
also give

\[
 \|Y_x\|_\infty=O(\sqrt x),\qquad
 \|H_x\|_\infty\leq\left({1\over2}+o(1)\right)L,
 \qquad
 \mathbb E_{x,s}|H_x|=O(1),                            \tag{5.1}
\]

while

\[
 \sigma_{x,s}=\left({1\over2}+o(1)\right)L,\qquad
 \sup_{t\in I_{x,s}}
 {\beta h(t)/2\over\sigma_{x,s}}\longrightarrow s\beta.
                                                                    \tag{5.2}
\]

Assume (0.6), and choose `c` strictly between `s beta` and `rho_(r+1)`.
Equation (3.4) holds with a fixed `d>0`.  Choose a fixed
`K>c+3` and split (3.4) at `K`.

If at least half the weighted mass lies in `c<Z<=K`, the localizer is
bounded there, so `E(Z-c)_+` has a fixed positive lower bound.  The
`L^1` estimate in (5.1) then gives centered-remainder excess of order
`T_sL`.

Otherwise at least half lies in `Z>K`.  On the full deterministic range,

\[
 q_{r+1}(Z)^2\ll_r B_x^{2r}.                           \tag{5.3}
\]

Equations (3.4), (4.7), and (5.3) give

\[
 \mathbb E_{x,s}\{(Z-c)_+;Z>K\}
 \gg_{r,c}B_x^{-2r}
 \gg_{r,c}x^{-r}L^{2r}.                               \tag{5.4}
\]

On `Z>K`, the pointwise bound in (5.1) absorbs at most one normalized
unit, so the actual centered remainder retains a fixed fraction of the
prime excess.  Multiplication by `sigma_(x,s)T_s` proves

\[
 \mathfrak R_{\lambda,\alpha},\qquad
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha,r,s}T_sL B_x^{-2r}
 \gg_{A,\alpha,r,s}x^{s-r}L^{2r+1}.                  \tag{5.5}
\]

The high-time cutoff `4sqrt(x)/L^2` is below `Ax^s` here.  The moderate
case is stronger than (5.5), so (5.5) holds in both cases.  The
countermeasure (4.4) shows that the factor `B_x^(-2r)` cannot be removed
from moment and support information alone.

For fixed `s<r+1`, comparison with the required target is exactly (0.8).
At the endpoint `s=r+1`, (2.7) is bounded and the ordinary even-moment
uniform-integrability argument supplies the integer-block conclusion.

A varying exponent cannot create a fixed threshold improvement.  If
`s_x=r+1-delta_x`, the Montgomery--Vaughan upper bound for the next even
moment is uniform only when

\[
 {x^{\delta_x}\over L^{r+1}}=O(1),
 \qquad
 \delta_x=O\left({\log L\over\log x}\right)=o(1).     \tag{5.6}
\]

Then `s_x beta` has the same limit as `(r+1)beta`, so the integer threshold
returns.  Any fixed positive gap leaves the uniform-integrability loss.

## 6. Optimizing the weak shelf does not change the required-scale result

At the left endpoint of the odd shelf, the formal threshold ratio is

\[
 \eta_r={\rho_{r+1}\over r+1/2}.                      \tag{6.1}
\]

The first three values satisfy

\[
 \eta_1={2\over3},\qquad
 \eta_2={2\sqrt3\over5},\qquad
 \eta_3={2\sqrt{3+\sqrt6}\over7}
 <{2\sqrt3\over5}.                                   \tag{6.2}
\]

For `r>=4`, checkpoint 1.68 gives `rho_(r+1)/(r+1)<7/12`; hence

\[
 \eta_r<{7\over12}{r+1\over r+1/2}
 \leq {35\over54}<{2\sqrt3\over5}.                  \tag{6.3}
\]

This proves the threshold in (0.9).  Its scale is nevertheless

\[
 x^{1/2}L^5=\lambda L^5
 =o\left({\lambda^2\over L}\right).                  \tag{6.4}
\]

Therefore fractional exponents, half-integer odd moments, fixed or growing
truncations, rational localizers, the deterministic prime-polynomial sup
bound, its moment tail bound, and its elementary derivative bound do not
improve the checkpoint-1.68 `k=4` threshold at the scale needed to refute
the centered-remainder target.  New arithmetic tail control or a genuine
higher absolute-moment estimate would be required.

## 7. Fail-closed stopping line

The exact conclusions are limited to the following.

1. Fixed real block exponents control Gaussian moments through
   `floor(2s)`.
2. Uniform integrability reduces the macroscopic Hermite index to
   `floor(s)`, so the integer `k=4` optimum remains global in this
   hierarchy.
3. The odd shelf gives the weaker bound (0.7), but it is always
   `o(x/L)` for fixed `s<r+1`.
4. The explicit Gaussian--Radau escaping-mass family proves that the loss
   cannot be removed from the stated moment, sup, tail, and elementary
   derivative inputs alone.

No claim is made that the actual prime polynomial realizes the
countermeasure.  No new actual phase-volume lower bound, dangerous-space
capture, parity ordering, determinant convergence, unconditional zero
theorem, RH proof or converse, or de Bruijn--Newman bound follows.  The
formal state remains `P0_INVALIDATED`.
