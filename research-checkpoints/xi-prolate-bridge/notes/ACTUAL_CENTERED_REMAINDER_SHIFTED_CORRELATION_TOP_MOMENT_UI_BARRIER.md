# Actual centered-remainder shifted-correlation and top-moment UI barrier

## 0. Exact outcome and claim boundary

Put

\[
 x=\lambda^2,\qquad L=\log x,\qquad
 P_x(t)=\sum_{p\leq x}{\log p\over\sqrt p}\,p^{it}.       \tag{0.1}
\]

The frozen long-block theorem controls the Gaussian moments of
`Re P_x` through degree `2k` on

\[
 I_{x,k}=[Ax^k,2Ax^k]                                   \tag{0.2}
\]

and gives positive excess below the largest zero `rho_k` of the
probabilists' Hermite polynomial `He_k`.  This note determines exactly
what the next moment step asks from the arithmetic.

For the first central odd term, the unresolved near-diagonal equation is

\[
 \prod_{i=1}^{k+1}p_i-\prod_{j=1}^{k}q_j=h,
 \qquad |h|=O_A(1),                                    \tag{0.3}
\]

with every prime at most `x`.  Exact equality `h=0` is impossible by
unique factorization.  This is a fixed-shift `(k+1)`-almost-prime versus
`k`-almost-prime correlation, but its control alone does not advance the
Hermite threshold.

The degree-`k` localizer also needs uniform integrability one degree
higher.  A natural sufficient arithmetic target is

\[
 {1\over Ax^k}\int_{Ax^k}^{2Ax^k}|P_x(t)|^{2k+2}\,dt
 =O_{A,k}(L^{2k+2}).                                   \tag{0.4}
\]

Its central off-diagonal equation is

\[
 \prod_{i=1}^{k+1}p_i-\prod_{j=1}^{k+1}q_j=h,
 \qquad 0<|h|\ll_A x,                                  \tag{0.5}
\]

at the top of the product range.  Thus the top moment has a growing
shift band, not the fixed band in (0.3).  Weighted
Montgomery--Vaughan gives an error `O_(A,k)(xL^(k+1))` in (0.4), so an
improvement by at least the factor `x/L^(k+1)` is required even for a
uniform bound of the displayed size.

There is also a sharp moment-theoretic obstruction.  For every
`c>=rho_k`, convergence to the Gaussian moments through degree `2k+1`
alone does **not** force a positive lower bound for
`E(Z-c)_+`.  For `rho_k<c<rho_(k+1)` an explicit Jacobi-boundary measure
plus a vanishing remote atom has the first `2k+1` Gaussian moments in the
limit and positive excess tending to zero, while its `(2k+2)`-nd moment
diverges.  Thus exact control of the first missing odd moment cannot
replace `(2k+2)`-moment uniform integrability.

For `k=4`, the necessary arithmetic objects are the `P_x^5 overline
P_x^4` ninth-moment correlation and the `|P_x|^10` top moment.  The
frozen arithmetic inputs prove neither the required shifted correlation
package nor the tenth-moment bound.  This note proves no extension below

\[
 \alpha_*=1-{\sqrt{3+\sqrt6}\over4}.                   \tag{0.6}
\]

It proves no failure of an actual shifted correlation and no upper or
lower bound for the actual phase volume.  The one-way phase-volume
comparison is not reversed.  No determinant theorem, zero-location
result, Riemann hypothesis, converse, or de Bruijn--Newman bound follows.
The formal state remains `P0_INVALIDATED`.

## 1. Frozen dependency and admitted arithmetic

This note freezes exactly the checkpoint-1.68 centered-remainder pair:

| Frozen path | SHA-256 |
|---|---|
| `notes/ACTUAL_CENTERED_REMAINDER_LONG_BLOCK_HERMITE_MOMENT_BARRIER.md` | `1997f8b14c5f90977f744788d069f6e771da078c06562dac2d78c671c01a95c1` |
| `tests/test_actual_centered_remainder_long_block_hermite_moment_barrier.py` | `cbbc300b9a050ac161d9f8feae996947b522043ae50663799dfc194ed4d3dd2d` |

That pair supplies the prime polynomial (0.1), the PNT estimates

\[
 S_x:=\sum_{p\leq x}{(\log p)^2\over p}
 =\left({1\over2}+o(1)\right)L^2,
 \qquad
 V_x:=\sum_{p\leq x}(\log p)^2=O(xL),                 \tag{1.1}
\]

the proper-prime-power noise bound, the one-way phase-volume reduction,
and the translated weighted Montgomery--Vaughan consequence

\[
 \left|\int_I|F(t)|^2dt-|I|\sum_n|c_n|^2\right|
 \leq {9\pi\over2}\sum_n n|c_n|^2,
 \qquad F(t)=\sum_nc_nn^{it}.                          \tag{1.2}
\]

Its source lineage is H. L. Montgomery and R. C. Vaughan, *Hilbert's
Inequality*, *Journal of the London Mathematical Society* (2) **8**
(1974), 73--82, Corollary 2.  That paper remains external and unvendored.
No new external result is admitted here.

The PNT in (1.1) is a one-variable coefficient estimate.  It is not a
shifted almost-prime correlation.  Unique factorization identifies exact
diagonals but does not control nonzero additive shifts.  The other
repository large sieves concern fixed Bessel-dilation packets or
different source operators; they are not estimates for the convolution
coefficients below.  No Brun--Selberg sieve, additive divisor theorem,
short-interval almost-prime theorem, or oscillatory shifted-convolution
bound is silently imported.

## 2. Exact mixed-moment kernel

Define the prime-only von Mangoldt weight

\[
 \ell_x(n)=
 \begin{cases}
  \log n,&n\leq x\text{ is prime},\\
  0,&\text{otherwise},
 \end{cases}
 \qquad C_{r,x}=\ell_x^{*r},                            \tag{2.1}
\]

where the star is Dirichlet convolution.  Thus

\[
 C_{r,x}(n)=
 \sum_{\substack{p_1\cdots p_r=n\\p_i\leq x}}
       \prod_{i=1}^r\log p_i,
 \qquad
 P_x(t)^r=\sum_{n\leq x^r}{C_{r,x}(n)\over\sqrt n}\,n^{it}. \tag{2.2}
\]

Every active index of `C_(r,x)` has exactly `r` prime factors counted
with multiplicity.  Put

\[
 K(v)=\int_1^2e^{isv}\,ds
 =e^{3iv/2}{2\sin(v/2)\over v},\qquad K(0)=1.          \tag{2.3}
\]

For `T>0`, direct finite expansion gives the exact identity

\[
 \boxed{
 M_{a,b}(T):={1\over T}\int_T^{2T}
       P_x(t)^a\overline {P_x(t)}^{\,b}\,dt
 =\sum_{n,m}{C_{a,x}(n)C_{b,x}(m)\over\sqrt{nm}}
       K\!\left(T\log{n\over m}\right).}             \tag{2.4}
\]

Equivalently, writing `n=m+h`,

\[
 M_{a,b}(T)=
 \sum_h\sum_{\substack{m\geq1\\m+h\geq1}}
 {C_{a,x}(m+h)C_{b,x}(m)\over\sqrt{m(m+h)}}
 K\!\left(T\log\left(1+{h\over m}\right)\right).   \tag{2.5}
\]

This is the exact shifted almost-prime object.  It contains the translated
endpoint phase `exp(3iT log(n/m)/2)` and the sinc factor.  Replacing it by
an unsigned count discards cancellation that can be essential.

The unit near band is

\[
 \left|T\log\left(1+{h\over m}\right)\right|\leq1.   \tag{2.6}
\]

For `T>=2`, (2.6) implies

\[
 |h|\leq(e^{1/T}-1)m\leq{2m\over T}.                  \tag{2.7}
\]

Conversely, `|h|<=m/(2T)` implies (2.6).  Hence the arithmetic resolution
is exactly `|h|` of order `m/T`.

## 3. The two different next-moment equations

Take `T=Ax^k`.  The central term in the first missing odd moment is
`M_(k+1,k)(T)`.  Since the denominator index has `m<=x^k`, equations
(2.6)--(2.7) give

\[
 |h|\leq{2\over A}.                                    \tag{3.1}
\]

Moreover, `h=0` would equate an integer with `k+1` prime factors to an
integer with `k` prime factors, counted with multiplicity.  Unique
factorization excludes it.  Thus the near contribution is supported on
finitely many nonzero equations

\[
 p_1\cdots p_{k+1}-q_1\cdots q_k=h,
 \qquad 0<|h|\leq\left\lceil{2\over A}\right\rceil.   \tag{3.2}
\]

A complete proof of Gaussian moment `2k+1` would have to control (2.4)
for every unbalanced pair in the expansion of
`(P_x+overline P_x)^(2k+1)`, not only (3.2).  Equation (3.2) is the
central and most visibly near-diagonal necessary correlation.

The uniform-integrability term is different.  For
`M_(k+1,k+1)(T)`, both indices extend to `x^(k+1)`.  Its exact diagonal is

\[
 D_{k+1,x}:=\sum_n{C_{k+1,x}(n)^2\over n}
 =\{(k+1)!+o(1)\}S_x^{k+1}.                            \tag{3.3}
\]

At the top of the product range, the off-diagonal unit band is

\[
 0<|h|\ll_A{x^{k+1}\over x^k}\ll_A x.                \tag{3.4}
\]

In prime variables this is precisely (0.5).  Therefore a theorem only
for each fixed shift in (3.2) does not control (3.4).

For reference, define a dyadic unsigned correlation

\[
 \mathcal C_{r,s}(h;X)=
 \sum_{X<m\leq2X}C_{r,x}(m+h)C_{s,x}(m).              \tag{3.5}
\]

The independent-density logarithmic scale for the equal pair is
`X(log X)^(2k+o(1))`.  Even if one had an upper bound at that ideal scale
for every active shift, summing absolute values over the `x` shifts in
(3.4) would leave a budget of size

\[
 xL^{2k+o(1)},                                         \tag{3.6}
\]

rather than `O(L^(2k+2))`.  This calculation is not a lower bound for the
actual signed kernel.  It shows exactly why a pointwise positive
shifted-sieve majorant or divisor switching followed by absolute values
does not by itself prove (0.4): a signed aggregate cancellation or a
genuinely beyond-length mean-value theorem is still required.

## 4. Exact Montgomery--Vaughan deficit

Write

\[
 W_{r,x}=\sum_n C_{r,x}(n)^2.
\]

Since the coefficient of `n^(it)` in `P_x^r` is
`C_(r,x)(n)/sqrt(n)`, the weighted energy in (1.2) is `W_(r,x)`.  The
ordered-representation Cauchy--Schwarz argument from the frozen note gives

\[
 W_{r,x}\leq r!V_x^r\ll_r(xL)^r.                      \tag{4.1}
\]

Polarization of (1.2) now yields, on `T=Ax^k`,

\[
 \left|M_{a,b}(T)-\boldsymbol1_{a=b}
       \sum_n{C_{a,x}(n)^2\over n}\right|
 \ll_{A,a,b}x^{(a+b)/2-k}L^{(a+b)/2}.                 \tag{4.2}
\]

For the first central odd term this is only

\[
 |M_{k+1,k}(Ax^k)|
 \ll_{A,k}x^{1/2}L^{k+1/2}.                           \tag{4.3}
\]

Gaussian normalization requires `o(L^(2k+1))`.  Thus (4.3) must be
improved by a factor tending to infinity faster than

\[
 {x^{1/2}\over L^{k+1/2}}.                             \tag{4.4}
\]

For the top moment, (4.2) gives

\[
 M_{k+1,k+1}(Ax^k)
 =D_{k+1,x}+O_{A,k}(xL^{k+1}).                         \tag{4.5}
\]

The diagonal has size `L^(2k+2)`.  To prove the uniform bound (0.4), the
error mechanism in (4.5) must be improved by at least

\[
 {x\over L^{k+1}}.                                     \tag{4.6}
\]

This is the rigorous gap in the admitted weighted mean-value input.  A
sharper count of the active frequency spacings can gain logarithms from
sparsity, but the top band still contains a growing number of active
almost-prime products per `1/T` frequency cell.  No admitted spacing
theorem supplies the power-scale improvement in (4.6).

## 5. Jacobi-boundary measure through degree `2k`

Let `gamma` be standard Gaussian measure and use the orthonormal Hermite
basis

\[
 e_j(z)={\operatorname {He}_j(z)\over\sqrt{j!}},
 \qquad0\leq j\leq k.                                 \tag{5.1}
\]

The compression of multiplication by `z` is the Jacobi matrix

\[
 J_{k+1}e_j=\sqrt{j+1}\,e_{j+1}+\sqrt j\,e_{j-1},     \tag{5.2}
\]

with absent endpoint terms omitted.  Its largest eigenvalue is
`rho_(k+1)`.  The leading `k by k` principal block has largest eigenvalue
`rho_k`.

Fix `c>rho_k` and define

\[
 \tau_c={\operatorname {He}_{k+1}(c)\over
                 \operatorname {He}_k(c)},
 \qquad
 J_{k+1}^{(c)}=J_{k+1}+\tau_c|e_k\rangle\langle e_k|. \tag{5.3}
\]

The determinant recurrence gives

\[
 \det(zI-J_{k+1}^{(c)})
 =\operatorname {He}_{k+1}(z)
       -\tau_c\operatorname {He}_k(z),                \tag{5.4}
\]

so `c` is an eigenvalue.  Cauchy interlacing with the leading block and
`c>rho_k` show that `c` is the largest eigenvalue.  The spectral measure
of `J_(k+1)^(c)` at `e_0`, denoted by `mu_c`, is therefore a positive
probability measure supported on `(-infinity,c]`.

Closed Jacobi walks from `e_0` of length at most `2k` cannot reach the
perturbed last diagonal and return: that takes at least `2k+1` steps.
Nor can they see the omitted next Jacobi edge.  Hence

\[
 \int z^j\,d\mu_c(z)=\int z^j\,d\gamma(z),
 \qquad0\leq j\leq2k.                                 \tag{5.5}
\]

At length `2k+1` there is exactly one new minimal walk.  Its outward and
return edge product is `k!`, so

\[
 \int z^{2k+1}\,d\mu_c(z)=k!\tau_c.                  \tag{5.6}
\]

When

\[
 \rho_k<c<\rho_{k+1},                                  \tag{5.7}
\]

Hermite-root interlacing gives `He_k(c)>0` and
`He_(k+1)(c)<0`.  Therefore `tau_c<0`.

## 6. Remote-atom obstruction to odd-moment sufficiency

Assume (5.7) and put

\[
 \delta_c=-k!\tau_c>0.                                \tag{6.1}
\]

For `R>c`, define the probability measure

\[
 \boxed{
 \nu_{c,R}=
 {\mu_c+\delta_cR^{-(2k+1)}\delta_R
  \over1+\delta_cR^{-(2k+1)}}.}                       \tag{6.2}
\]

For every `0<=j<=2k`, equations (5.5) and (6.2) give

\[
 \int z^j\,d\nu_{c,R}(z)
 ={m_j(\gamma)+\delta_cR^{j-(2k+1)}
       \over1+\delta_cR^{-(2k+1)}}
 \longrightarrow m_j(\gamma).                        \tag{6.3}
\]

Equation (5.6) and the definition of `delta_c` give the exact odd moment

\[
 \int z^{2k+1}\,d\nu_{c,R}(z)=0.                     \tag{6.4}
\]

The base measure has no mass above `c`, while the remote atom gives

\[
 \int(z-c)_+\,d\nu_{c,R}(z)
 ={\delta_cR^{-(2k+1)}(R-c)
       \over1+\delta_cR^{-(2k+1)}}
 =O_{k,c}(R^{-2k})\longrightarrow0.                   \tag{6.5}
\]

In contrast,

\[
 \int |z|^{2k+2}\,d\nu_{c,R}(z)
 ={\int |z|^{2k+2}d\mu_c+\delta_cR
       \over1+\delta_cR^{-(2k+1)}}
 \longrightarrow\infty.                              \tag{6.6}
\]

This is an exact positive-measure countermodel, not a signed formal
functional.

If `c>=rho_(k+1)`, the ordinary `(k+1)`-node Gauss--Hermite spectral
measure of `J_(k+1)` is supported in `(-infinity,rho_(k+1)]`, matches the
Gaussian moments through degree `2k+1`, and has zero excess above `c`.
At the endpoint `c=rho_k`, take `c_j` down to `rho_k` in (5.7) and choose
`R_j` sufficiently rapidly that the remote lower-moment errors and
`delta_(c_j)R_j^(-2k)` both tend to zero.  The base excess above `rho_k`
is at most `c_j-rho_k`.  Thus the same vanishing-excess conclusion holds
for every

\[
 c\geq\rho_k.                                          \tag{6.7}
\]

Consequently, convergence of moments only through degree `2k+1` cannot
improve the degree-`k-1` Hermite threshold `rho_k`.  A degree-`k`
localizer uses a polynomial of degree `2k+1`; turning its positive
expectation into a positive **first** excess requires uniform
integrability, for example a uniform `(2k+2)`-moment bound.  Equation
(6.6) is exactly the missing escape route.

## 7. The `k=4` ninth-versus-tenth specialization

For the frozen optimal block,

\[
 k=4,\qquad T=Ax^4,\qquad
 \rho_4=\sqrt{3+\sqrt6},\qquad
 \rho_5=\sqrt{5+\sqrt{10}}.                            \tag{7.1}
\]

The centered threshold normalized by the prime standard deviation tends
to

\[
 c=4(1-\alpha).                                        \tag{7.2}
\]

Below the checkpoint-1.68 alpha threshold one has `c>=rho_4`.  The first
new localizer would require the ninth Gaussian moment and tenth-moment
uniform integrability.

The central ninth term is

\[
 M_{5,4}(Ax^4)=
 \sum_{h\ne0}\sum_m
 {C_{5,x}(m+h)C_{4,x}(m)\over\sqrt{m(m+h)}}
 K\!\left(Ax^4\log\left(1+{h\over m}\right)\right),  \tag{7.3}
\]

whose unit near band has

\[
 p_1\cdots p_5-q_1\cdots q_4=h,
 \qquad0<|h|\leq\left\lceil{2\over A}\right\rceil.  \tag{7.4}
\]

The admitted estimate is only

\[
 M_{5,4}(Ax^4)=O_A(x^{1/2}L^{9/2}),                   \tag{7.5}
\]

where `o(L^9)` is required for Gaussian normalization.

The natural sufficient tenth-moment target is

\[
 {1\over Ax^4}\int_{Ax^4}^{2Ax^4}|P_x(t)|^{10}\,dt
 =O_A(L^{10}).                                         \tag{7.6}
\]

Its exact expansion is

\[
 \sum_h\sum_m
 {C_{5,x}(m+h)C_{5,x}(m)\over\sqrt{m(m+h)}}
 K\!\left(Ax^4\log\left(1+{h\over m}\right)\right), \tag{7.7}
\]

with diagonal

\[
 D_{5,x}=\{120+o(1)\}S_x^5\asymp L^{10},             \tag{7.8}
\]

and top near-band shifts `0<|h|<<_A x`.  Weighted
Montgomery--Vaughan supplies only

\[
 {1\over Ax^4}\int_{Ax^4}^{2Ax^4}|P_x(t)|^{10}\,dt
 =D_{5,x}+O_A(xL^5).                                   \tag{7.9}
\]

Thus the tenth-moment error needs a factor `x/L^5` improvement.  The
Jacobi construction can be made completely rational at, for example,
`c=5/2`.  Here

\[
 \operatorname {He}_4(5/2)={73\over16},\qquad
 \operatorname {He}_5(5/2)=-{675\over32},\qquad
 \tau_{5/2}=-{675\over146}.                            \tag{7.10}
\]

The base ninth moment is `24 tau_(5/2)`, and a remote atom of unnormalized
weight `-24tau_(5/2)R^(-9)` cancels it exactly.  Its positive excess is
`O(R^(-8))`, while its tenth moment grows linearly in `R`.  This is the
explicit ninth-versus-tenth stopping mechanism.

## 8. Exact stopping line

The post-checkpoint-1.68 arithmetic fork is therefore precise:

1. controlling the first missing odd moment requires the full signed
   kernel (2.4), including fixed-shift central correlations such as
   (7.4) and all other unbalanced terms;
2. using that odd moment to move the Hermite localizer requires a uniform
   next even moment, naturally (7.6);
3. the next even moment contains the growing shift band in (7.7), and the
   admitted theorem misses its target by the factor `x/L^5`;
4. exact odd-moment control without top-moment uniform integrability is
   logically insufficient by (6.2)--(6.6).

A weighted shifted almost-prime theorem, divisor switching, or a sharper
frequency-spacing count is useful only if it proves the complete signed
kernel estimates at these scales.  None is present in the frozen source
set.  The calculation does not prove such a theorem false, and the
countermeasure is not the actual prime polynomial.

Nothing here extends the centered-remainder lower bound to
`alpha<=alpha_*`, and nothing turns any centered-remainder lower bound
into an actual phase-volume lower bound.  No dangerous-projector capture,
weighted coframe rate, parity order, determinant convergence,
unconditional zero theorem, RH proof or converse, or de Bruijn--Newman
bound is obtained.  The formal state remains `P0_INVALIDATED`.
