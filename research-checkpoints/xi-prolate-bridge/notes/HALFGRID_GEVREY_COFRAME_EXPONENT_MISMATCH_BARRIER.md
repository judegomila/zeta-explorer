# Halfgrid Gevrey--coframe exponent mismatch barrier

## 0. Exact outcome and claim boundary

Let `p` tend to infinity through odd positive integers and put

\[
 \lambda={p\over2},\qquad L=2\log\lambda.                   \tag{0.1}
\]

Let `R=R(lambda)` be an integer Fourier cutoff satisfying

\[
 \boxed{L^2=o(R),\qquad R=o(\lambda L).}                    \tag{0.2}
\]

The second condition is exactly the scale on which the frozen continuous
HSW phase extraction can be rounded to the odd halfgrid by its certified
stability radius.  The first condition makes all polynomial sampling losses
negligible on the exponential scale below.

This note proves the following schedule audit.

1. The strongest exponential class obtained from the frozen Gevrey
   truncation and analytic-strip projection at cutoff `R` is

   \[
    \boxed{
    e_{\lambda,R}+|q_R|+
    \|(Q_{R,+}-q_RI)\kappa_R\|
    =O\!\left(\exp[-cR/L]\right)}                         \tag{0.3}
   \]

   for some fixed non-effective `c>0`.  The individual constants may
   differ.  This is a theorem about the actual source-normalized prolate
   anchor and does not assume RH.  The phrase "strongest class" refers only
   to the frozen estimates: their negative strip exponent is of order
   `R/L`; it is not a lower bound for the true error.

2. Assume RH only for the complete-zero-Gram diagnostic.  Put

   \[
    \rho_R={{\mathcal W}(R/e)\over L},                    \tag{0.4}
   \]

   where `mathcal W` is the principal Lambert function.  A two-dimensional
   rational-residue family, deflated by the actual anchor `kappa_R`, gives
   for every asymptotically admissible zero-row fraction `theta`

   \[
    \boxed{
    \limsup {1\over R}\log a_R
    \leq-c(\theta,\rho),\qquad
    c(\theta,\rho)=4(1-\theta)\log{\theta\over\rho},}     \tag{0.5}
   \]

   along any subsequence on which `rho_R -> rho` and
   `rho<theta<1`.  Here

   \[
    a_R=\lambda_{\min}\!\left(
    P_{\kappa_R^\perp}Q_{R,+}P_{\kappa_R^\perp}
    \big|_{\kappa_R^\perp}\right).                       \tag{0.6}
   \]

   The optimal fraction and exponent are

   \[
    \boxed{
    \theta_*(\rho)={1\over {\mathcal W}(e/\rho)},\qquad
    c_*(\rho)=4\,{({\mathcal W}(e/\rho)-1)^2
                     \over {\mathcal W}(e/\rho)}.}       \tag{0.7}
   \]

3. Condition (0.2) forces `limsup rho_R<=1/2`.  Consequently the fixed
   natural optimizer gives the schedule-uniform obstruction

   \[
    \boxed{
    a_R\leq
    \exp\{-(c_{\rm flat,*}-o(1))R\},\qquad
    c_{\rm flat,*}=0.408756547856\ldots .}                \tag{0.8}
   \]

   Natural and every halfgrid-roundable logarithmically supernatural
   schedule have `rho_R->1/2`, so (0.8) is sharp for this explicit witness
   uniformly over the allowed class.  Subnatural schedules never weaken the
   obstruction, and they strengthen it whenever `limsup rho_R<1/2`.

On RH the centered gate requires `a_R>q_R>=0`.  Therefore (0.8) makes
`q_R<exp(-(c_flat,*-o(1))*R)` a necessary condition for that gate, whereas
(0.3) certifies only an `exp(-cR/L)` upper class.  This is a
schedule-independent factor-`L` mismatch between the two proved
logarithmic exponents.  It is not a proof that the gate fails: the bound on
`q_R` is one-sided and the actual scalar may be much smaller.

Changing the lower bridge projection `M<R`, changing `M/R`, or moving to a
subnatural or an allowed supernatural `R` cannot remove the mismatch.  The
only formal scale at which the displayed exponent classes can balance is
near `log R=L-O(sqrt(L))`, hence near a quadratic cutoff; that scale violates
`R=o(lambda*L)` and is not roundable by the frozen halfgrid argument.

Off RH, the positive zero Gram used in (0.5)--(0.8) is unavailable because
every off-line quartet has a genuine signature-`(1,1)` Krein block.  No
unconditional coframe upper bound for the complete source is inferred.

This is one post-checkpoint-1.60 theorem/barrier pair.  It changes none of
the standard eight, adds no zero table or numerical artifact, proves no
actual centered gate or gate failure, no finite-good index, no determinant
convergence, no zero theorem, no Riemann hypothesis, no converse, and no
de Bruijn--Newman bound.  The formal state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly three theorem/test pairs are frozen.

| Dependency | SHA-256 |
|---|---|
| `notes/UNCONDITIONAL_NATURAL_HALFGRID_CROSSROOT_SCHEDULE_THEOREM.md` | `d1b73fc246fcc70886ba78dc074adac585372a2abfc9fbba678c03c4d47e30a5` |
| `tests/test_unconditional_natural_halfgrid_crossroot_schedule_theorem.py` | `00627aa69143c39a468dd06808fe6859beb16aff197127e66a93ff042377f1b9` |
| `notes/NATURAL_GEVREY_QUASIMODE_TEMPLE_ORIENTATION_BARRIER.md` | `c5cabe812995379a9e93fb32bb4ea648d97cbc52c7494d794ef1146cccc4b5c6` |
| `tests/test_natural_gevrey_quasimode_temple_orientation_barrier.py` | `1ce65c5ebd600120f65665cb650dec029f479fc7e95310b408570688e689c212` |
| `notes/NATURAL_COMPLETE_SOURCE_KAPPA_DEFLATED_COFRAME_OBSTRUCTION.md` | `b3a22dc296ada1e1ca9ba2ce49efcac1aa17b2dd6f2c2695ff2221f904508700` |
| `tests/test_natural_complete_source_kappa_deflated_coframe_obstruction.py` | `282252cd2c27992c3a87eff6068ed57c79f6dc32ab769db0e59a0d15b6065dc9` |

The first pair supplies the exact odd-halfgrid mesh, HSW stability radius,
and rounding criterion `R=o(lambda*L)`.  The second supplies the frozen
Gevrey-one truncation, analytic-strip projection, compact-BV transfer,
normalization, scalar, and residual inequalities.  The third supplies the
actual-zero rational-residue family, anchor deflation, endpoint flatness,
multiplicity-safe tail estimate, one-sided-`q` caveat, and off-RH Krein
scope.

All general schedule algebra, Lambert inversion, optimization, `M<R`
audit, and near-quadratic stopping line are proved directly.  No external
source, source lock, zero list, cached matrix, numerical producer, or
additional repository theorem is imported.

## 2. Halfgrid-roundable schedule and three separate indices

There are three indices which must not be conflated.

* `R` is the outer Fourier cutoff and the dimension parameter in (0.2).
* `M_b<R` is a possible lower bridge projection.
* `m=floor(theta*R)` is the number of distinct zero rows annihilated by the
  endpoint-flat witness.

The last choice is internal to a Rayleigh trial vector.  It is independent
of `M_b`.

The top Fourier carrier and the HSW shell height are

\[
 \Omega_R={2\pi(R+1)\over L},\qquad T\asymp {R\over L}.
                                                               \tag{2.1}
\]

The odd-halfgrid mesh is `O(lambda^(-1))`, while the certified phase
stability radius is `Omega(T^(-1))`.  Their ratio is

\[
 {T\over\lambda}\asymp {R\over\lambda L}.             \tag{2.2}
\]

Thus the second part of (0.2) is exactly the safe asymptotic regime of the
frozen rounding proof.  It says nothing about positivity of the complete
source or a zero Gram.

Moreover,

\[
 \log R\leq\log\lambda+\log L+o(L)
 ={L\over2}+o(L).                                      \tag{2.3}
\]

Since `mathcal W(x)<=log x` for large `x`, (2.3) implies

\[
 \boxed{\limsup_{R\to\infty}\rho_R\leq{1\over2}.}      \tag{2.4}
\]

## 3. General frozen Gevrey exponent

For a formal Hermite order `J`, the frozen estimates give a Hermite support
`K<=4J+4` and the directed projection-error bound

\[
\begin{aligned}
 E_R(J)\leq{}&C\lambda e^{-c_0\lambda^2}
 +C\lambda\left({B(J+1)\over\lambda^2}\right)^{J+1}\\
 &+C\exp\{C_\sigma K\log(K+2)-\sigma\Omega_R\}
 +C\operatorname {poly}(\lambda,J,R)e^{-c_1\lambda^2}.
\end{aligned}                                             \tag{3.1}
\]

Choose a sufficiently small fixed `delta>0` and put

\[
 J_R=\left\lfloor{\delta R\over L^2}\right\rfloor .     \tag{3.2}
\]

Condition (0.2) gives

\[
 J_R\longrightarrow\infty,\qquad
 J_R=o(\lambda/L),\qquad
 \log(J_R+2)\leq {L\over2}+o(L).                         \tag{3.3}
\]

Consequently

\[
 C_\sigma K\log(K+2)
 \leq(C'\delta+o(1)){R\over L}.                         \tag{3.4}
\]

Choose `delta` so that the right side of (3.4) is less than one half of
`sigma*Omega_R`.  This makes the strip term in (3.1)

\[
 O\!\left(\exp[-c_2R/L]\right).                         \tag{3.5}
\]

For the truncation term, (3.2)--(3.3) give

\[
 \log{\lambda^2\over B(J_R+1)}
 \geq {L\over2}-o(L).                                   \tag{3.6}
\]

Because `R/L^2 -> infinity`, the leading factor `lambda` is absorbed:

\[
\begin{aligned}
 &(J_R+1)\log{\lambda^2\over B(J_R+1)}-\log\lambda\\
 &\hspace{25mm}\geq(c_3+o(1)){R\over L}.
\end{aligned}                                             \tag{3.7}
\]

All endpoint terms have exponent `-Theta(lambda^2)`, which is smaller than
`-Theta(R/L)` under (0.2).  Combining (3.1)--(3.7) proves

\[
 \boxed{e_{\lambda,R}=O\!\left(e^{-c_ER/L}\right).}     \tag{3.8}
\]

The same formulas identify the ceiling of this frozen proof.  The only
negative exponent in its whole-line strip term is

\[
 \sigma\Omega_R=\Theta(R/L),                              \tag{3.9}
\]

and increasing `J` adds the positive entropy `C_sigma*K*log K`.  Thus
(3.8) is the best exponent *class furnished by these estimates*.  It does
not assert that the true Fourier tail has a matching lower bound or that
the unknown exponential coefficient is optimal.

## 4. Transfer to the actual scalar and residual

The compact-BV variation and finite-window Bessel envelopes are polynomial
in `lambda` and `R`.  Under (0.2), their logarithms are `O(L)`, while

\[
 {R\over L}\gg L.                                      \tag{4.1}
\]

The monotone compact-BV insertion therefore preserves the exponential
class after squaring the projection error:

\[
 U_{Z,R}=O\!\left(e^{-c_UR/L}\right),\qquad
 |q_R|\leq U_{Z,R}.                                    \tag{4.2}
\]

The constants in (3.8) and (4.2) need not agree.  At the level before
constants are renamed, `U_Z` has twice the base error exponent up to
subexponential losses.

For the exact finite residual, the frozen Riesz estimate is

\[
 r_R:=\|(Q_{R,+}-q_RI)\kappa_R\|
 \ll\sqrt{B_{\rm abs}(\lambda,R)U_{Z,R}}+U_{Z,R},       \tag{4.3}
\]

where `log B_abs=O(L)`.  Equation (4.1) absorbs this loss and yields

\[
 \boxed{|q_R|+r_R=O\!\left(e^{-c_QR/L}\right)}          \tag{4.4}
\]

after decreasing a fixed positive constant.  The square root in (4.3)
explains why the residual can lose half the scalar exponent but not the
`R/L` class.  Equations (3.8) and (4.4) prove (0.3).

If `R` were only `O(L^2)`, (3.8) could still be discussed with a fixed
formal order, but the polynomial sampling losses would no longer be
uniformly negligible.  Such schedules are outside (0.2) and do not improve
the exponent comparison.

## 5. General actual-zero endpoint-flat witness

Assume RH in Sections 5--8 only.  On RH, and only on RH, the complete even
source is the positive evaluation Gram

\[
 \langle f,Q_{R,+}f\rangle
 =2\sum_{\gamma>0}m_\gamma|\widehat f(\gamma)|^2.       \tag{5.1}
\]

Let `a_n=2*pi*n/L`, choose `m=floor(theta*R)` first distinct positive
ordinates `gamma_j^#`, and put

\[
 D_R(y)=\prod_{n=1}^R(y-a_n^2),\qquad
 P_m(y)=\prod_{j=1}^m(y-(\gamma_j^\#)^2).               \tag{5.2}
\]

For every affine polynomial `A(y)=u+vy`, define residues

\[
 x_n(A)={P_m(a_n^2)A(a_n^2)\over D_R'(a_n^2)},
 \qquad1\leq n\leq R.                                  \tag{5.3}
\]

The partial-fraction identity

\[
 {P_m(y)A(y)\over D_R(y)}
 =\sum_{n=1}^R{x_n(A)\over y-a_n^2}                    \tag{5.4}
\]

gives a two-dimensional Fourier-vector space.  Its intersection with the
single hyperplane `kappa_R^perp` contains a normalized nonzero vector
`h_R`.  It annihilates the first `m` distinct zero rows, including the
continuous carrier cases.  Algebraic multiplicity repeats a vanished row
and creates no derivative condition.

With

\[
 s=R-m-2,                                               \tag{5.5}
\]

the expansion of (5.4) at infinity makes `h_R` flat at both endpoints
through order `2s-1`.  Integration by parts and Bernstein give

\[
 |\widehat h_R(t)|
 \leq\sqrt L\left({\Omega_R\over|t|}\right)^{2s}.       \tag{5.6}
\]

This construction works for every anchor; no orientation or visibility of
`kappa_R` is assumed.

## 6. Lambert inversion and the general coframe exponent

The main Riemann--von Mangoldt count is

\[
 {T\over2\pi}\log{T\over2\pi e}.                       \tag{6.1}
\]

Its exact main-term inverse at count `theta*R` is

\[
 T_{\theta,R}={2\pi\theta R\over
                    {\mathcal W}(\theta R/e)}.           \tag{6.2}
\]

Indeed, substituting `T=2*pi*e*x` reduces (6.1) to
`e*x*log(x)=theta*R`.  Taking a fixed factor slightly below (6.2) and using
the count error proves, multiplicity-safely,

\[
 \gamma_m^\#>(1-o(1))T_{\theta,R}.                     \tag{6.3}
\]

The ratio of the Fourier edge to this threshold is

\[
 {\Omega_R\over T_{\theta,R}}
 ={ {\mathcal W}(\theta R/e)\over\theta L}(1+o(1)).     \tag{6.4}
\]

For fixed `theta` and `R->infinity`,

\[
 { {\mathcal W}(\theta R/e)\over L}
 =\rho_R+o(1).                                          \tag{6.5}
\]

Thus a decaying endpoint tail requires `theta>rho` along a subsequence
where `rho_R->rho`.

The multiplicity-safe Stieltjes tail estimate

\[
 \sum_{\gamma>T}m_\gamma\gamma^{-4s}
 \ll T^{1-4s}\log T                                    \tag{6.6}
\]

and (5.1), (5.6) give

\[
 \langle h_R,Q_{R,+}h_R\rangle
 \ll LT_{\theta,R}\log T_{\theta,R}
       \left({\Omega_R\over T_{\theta,R}}\right)^{4s}.
                                                               \tag{6.7}
\]

The leading factor is `exp(o(R))`.  Since `s/R=1-theta+o(1)`, equations
(6.4)--(6.7) prove

\[
 \limsup {1\over R}\log a_R
 \leq-4(1-\theta)\log{\theta\over\rho}.                \tag{6.8}
\]

This is (0.5).  It is an upper bound for the true coframe floor, not a
lower frame bound and not an asymptotic formula.

## 7. Optimization and the uniform roundable obstruction

For fixed `0<rho<1`, differentiate the positive coefficient in (6.8):

\[
 {1\over4}{\partial c\over\partial\theta}
 =-\log{\theta\over\rho}+{1-\theta\over\theta}.         \tag{7.1}
\]

At the unique critical point,

\[
 \log{\theta\over\rho}={1\over\theta}-1.               \tag{7.2}
\]

Writing `w=1/theta`, equation (7.2) is `w*e^w=e/rho`.  Hence

\[
 \theta_*(\rho)={1\over {\mathcal W}(e/\rho)},\qquad
 c_*(\rho)=4\,{({\mathcal W}(e/\rho)-1)^2
                   \over {\mathcal W}(e/\rho)}.         \tag{7.3}
\]

The extended value is `c_*(0)=+infinity`.  The function `c_*` decreases
as `rho` increases.  At the maximal halfgrid-roundable value,

\[
\begin{aligned}
 \theta_*(1/2)&={1\over {\mathcal W}(2e)}
 =0.727366608780\ldots,\\
 c_*(1/2)&=4\,{({\mathcal W}(2e)-1)^2
                  \over {\mathcal W}(2e)}
 =0.408756547856\ldots .
\end{aligned}                                             \tag{7.4}
\]

There is a uniform proof which does not require `rho_R` to converge.  Use
the fixed `theta_0=theta_*(1/2)`.  Equations (2.4) and (6.8) give

\[
 4(1-\theta_0)\log{\theta_0\over\rho_R}
 \geq4(1-\theta_0)\log(2\theta_0)-o(1).                 \tag{7.5}
\]

This is exactly (0.8).  If `R=lambda^(a+o(1))` with `0<a<=1`, then
`rho_R->a/2` and the optimized coefficient is `c_*(a/2)`.  It is strictly
larger than (7.4) for `a<1`.  Multiplication or division by powers of `L`
does not change `rho_R`; every allowed schedule
`R=lambda*L^(O(1))` has the natural coefficient (7.4).

## 8. The two `M/R` audits

First let `M_b<R` denote the lower bridge projection, and assume
`L^2=o(M_b)` when invoking the exponential transfer at that cutoff.
Applying Section 3 at both cutoffs, one may optimize separately and obtain
exponent classes `M_b/L` and `R/L`.  If a common directed bound is required,
the smaller cutoff controls it:

\[
 e_{\lambda,M_b}+e_{\lambda,R}
 =O\!\left(e^{-cM_b/L}\right).                         \tag{8.1}
\]

If `M_b/R->alpha` with `0<alpha<=1`, comparing (8.1) with (0.8) gives the
logarithmic-exponent ratio

\[
 {c_{\rm flat,*}R\over cM_b/L}
 \asymp {L\over\alpha}\geq L.                          \tag{8.2}
\]

Estimating `q_R` directly at the outer cutoff improves (8.1) only to
`R/L`, leaving the factor `L`.  If the centered gate is instead formed at
`M_b`, both `R` occurrences are replaced by `M_b` and the same factor `L`
remains.  Thus the adjacent choice `M_b=R-O(1)` is already the least-bad
choice; a smaller projection worsens the simultaneous comparison.

Second, `m/R=theta` in Sections 5--7 is not the bridge ratio `M_b/R`.
The endpoint-flat trial is free to annihilate the optimizing
`theta_*(rho)*R` zero rows regardless of `M_b`.  Artificially setting
`m=M_b`, or taking `theta` close to `rho` or to one, merely discards a
stronger admissible Rayleigh witness.  It cannot raise the true minimum.

Changing `M_b` can affect the downstream projective observable, but it does
not alter the full centered compression on `kappa_R^perp` and cannot remove
the coframe obstruction above.

## 9. The near-quadratic formal escape is not roundable

The only way to reduce the optimized coframe coefficient to the Gevrey
scale is to leave the range (2.4).  As `rho` tends to one from below,

\[
 {\mathcal W}(e/\rho)=1+{1-\rho\over2}
 +O((1-\rho)^2),\qquad
 c_*(\rho)=(1-\rho)^2+O((1-\rho)^3).                    \tag{9.1}
\]

Balancing `c_*(rho)*R` with `R/L` therefore requires

\[
 1-\rho=O(L^{-1/2}).                                    \tag{9.2}
\]

Since `rho=mathcal W(R/e)/L`, inversion gives

\[
 \log R=L-O(\sqrt L),\qquad
 R=\lambda^2\exp\{-O(\sqrt L)+O(\log L)\}.             \tag{9.3}
\]

But then

\[
 {R\over\lambda L}\longrightarrow\infty.             \tag{9.4}
\]

Thus the halfgrid mesh is no longer dominated by the frozen HSW stability
radius.  Equation (9.3) is only a formal exponent-balancing scale; it is not
an RH-free roundable schedule supplied by the project.

## 10. Centered-gate logic and off-RH scope

On RH, (5.1) gives `q_R>=0`, and the centered gate is

\[
 P_{\kappa_R^\perp}(Q_{R,+}-q_RI)P_{\kappa_R^\perp}
 \big|_{\kappa_R^\perp}\succ0
 \quad\Longleftrightarrow\quad a_R>q_R.                 \tag{10.1}
\]

Combining a hypothetical pass in (10.1) with the proved upper obstruction
(0.8) would force

\[
 q_R<\exp\{-(c_{\rm flat,*}-o(1))R\}.                  \tag{10.2}
\]

The frozen result (4.4) has the correct direction for an upper bound but
the weaker exponent class `R/L`.  It neither proves (10.2) nor contradicts
it.  In particular, one must not reverse (4.4) into a lower bound and claim
gate failure.

Do not assume RH now.  An off-line quartet contributes one positive and one
negative square to the complete centered source, hence a signature-`(1,1)`
Krein block.  Critical-line rows are not a positive subform in Loewner
order.  Therefore (5.1), (0.5), and (0.8) are RH-diagnostic statements only.
The unconditional target remains a direct signed relative inequality for
the complete pole--archimedean--minus-prime source.

The exponent mismatch proves a stopping line for the present centered-gate
mechanism, not a statement about the actual size of `q_R`, the actual
coframe floor off RH, or the truth of RH.

## 11. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. applies (0.3) when `R/L^2` does not tend to infinity without separately
   auditing the polynomial sampling losses;
2. describes `R/L` as a lower bound for the true error rather than the best
   class supplied by the frozen strip estimate;
3. uses the positive zero Gram or the coframe obstruction without explicitly
   assuming RH;
4. treats multiplicity as independent rows or derivative jets;
5. conflates the bridge projection `M_b` with the annihilated zero count
   `m=floor(theta*R)`;
6. chooses a nonoptimal `theta` and claims the stronger witness has
   disappeared;
7. reverses the upper bound on `a_R` into a lower frame estimate;
8. reverses the one-sided upper bound on `q_R`, or claims centered-gate
   failure without a positive lower bound for `q_R`;
9. uses the near-quadratic scale (9.3) as though it satisfied the frozen
   halfgrid rounding criterion;
10. replaces an off-line Krein block by positive critical-line squares;
11. claims an actual centered gate, gate failure, finite-good index,
    determinant convergence, zero theorem, RH, converse, or
    de Bruijn--Newman bound.

The proved RH-free content is the roundable schedule algebra and the
`exp(-cR/L)` Gevrey/scalar/residual class.  The proved RH-diagnostic content
is the optimized endpoint-flat upper obstruction and the resulting
necessary scale for a centered gate.  The formal state remains
`P0_INVALIDATED`.
