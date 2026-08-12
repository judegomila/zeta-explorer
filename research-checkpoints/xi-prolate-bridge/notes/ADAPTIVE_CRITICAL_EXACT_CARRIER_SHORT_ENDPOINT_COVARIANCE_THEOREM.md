# Adaptive critical exact-carrier short-endpoint covariance theorem

## 0. Exact outcome and claim boundary

Assume RH.  Fix

\[
 {1\over2\pi}<D_-<D_+<{1\over2},\qquad
 \mathcal D=[D_-,D_+],                              \tag{0.1}
\]

and let `D` range in `mathcal D`.  Put

\[
 \mathscr L_U={1\over2\pi}\log {U\over2\pi},\qquad
 \delta_Y={1/2\over\mathscr L_{2Y}}.               \tag{0.2}
\]

Thus the Gonek normalized shift parameter is `a=1/2`, not the `a=1/4`
used on the earlier `L/log Y -> 2` schedule.  At critical density
`L/log Y -> 1`, this is exactly the choice which places the zero at a
half carrier cell.

For every zeta-zero ordinate `gamma in (Y,2Y]`, counted with algebraic
multiplicity, set `t_gamma=gamma+delta_Y` and make `t_gamma` an exact
carrier by the nearest-integer construction in Section 2.  It produces

\[
 t_\gamma=m_\gamma h_\gamma,\qquad
 h_\gamma={2\pi\over L_\gamma},\qquad
 N_\gamma=m_\gamma-1
 =D e^{L_\gamma}L_\gamma+O_{\mathcal D}(L_\gamma). \tag{0.3}
\]

Thus `lambda_gamma^2=e^(L_gamma)` and (0.3) is the critical schedule

\[
 N_\gamma=D\lambda_\gamma^2L_\gamma+O(L_\gamma),
 \qquad L_\gamma=\log Y+O_{\mathcal D}(1).          \tag{0.4}
\]

Let `E_gamma` be the normalized one-sided alternating endpoint of the
globally positive tangent critical ideal, and let `C_gamma` be the
normalized Cauchy row belonging to the **same** zero `gamma`; their exact
definitions are (3.8)--(3.9).  The theorem proved here is

\[
 \boxed{
 \begin{aligned}
 A_Y&:=\sum_{Y<\gamma\leq2Y}\nu_\gamma|C_\gamma|^2
       \geq c_{\mathcal D}YL^3(\log L)^2,\\
 B_Y&:=\sum_{Y<\gamma\leq2Y}\nu_\gamma|E_\gamma|^2
       \leq C_{\mathcal D}YL^3,
 \end{aligned}\qquad L=\log Y.}                   \tag{0.5}
\]

Consequently there is one ordinate `gamma_Y in (Y,2Y]` for which both

\[
 \boxed{
 |C_{\gamma_Y}|^2\geq c_1(\log L)^2|E_{\gamma_Y}|^2,
 \qquad
 |C_{\gamma_Y}|^2\geq c_2L^2(\log L)^2.}           \tag{0.6}
\]

The first inequality is a squared gain of order only `(log L)^2`; it is
not a gain of order `L`.  Its divergence is nevertheless the precise
short-endpoint covariance improvement established by this pair.  After a
separate relative transfer it would be sufficient for `eta -> 0`, but no
such transfer is proved here.  The second inequality is an absolute
natural-scale row lower bound and keeps later comparison meaningful even
when the endpoint nearly cancels.

The proof retains both branches of a symmetric smoothed approximate
functional equation.  It never expands the high-high real square.  The
same-branch cross with the first mode uses the integer variable `X=n` in
the uniform Landau--Gonek formula.  The Hardy cross also uses exactly
`X=n`, now in the cumulative integer-`X` formula of Durkan, Hughes, and
Pearce-Crump.  There is no fixed-grid Poisson alias and no bounded prime
interval: direct sampling at the adaptively chosen zeros replaces the
fixed-origin progression.

This is a narrow, unbound, RH-conditional arithmetic theorem.  It proves
no supercritical Abel/Stokes transfer, no ideal-to-actual finite-prolate
transfer, no finite strict gate, no literal ceiling schedule, no theorem
for a prescribed fixed origin, no unconditional zero statement, no proof
of RH or converse to RH, and no de Bruijn--Newman `Lambda` bound.  It does
not change the standard eight or any checkpoint state.  The formal state
remains `P0_INVALIDATED`.

## 1. Frozen internal inputs and primary external sources

Exactly three frozen note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/CRITICAL_DENSITY_PROLATE_MELLIN_TRANSPORT_CONNECTION_THEOREM.md | 4d20e37cb8b6cfe3d92da7e1344da0f1b12ca9d20185fd7b6d8ac406ef7846c6 |
| tests/test_critical_density_prolate_mellin_transport_connection_theorem.py | 0a6128433698ecdc83252747971c61fb0859bf12a2afe582cd78808b8c5b8cf3 |
| notes/CRITICAL_NEAR_NYQUIST_TWO_BRANCH_BLOCK_COVARIANCE_BARRIER.md | b4d43f3c92e58aa164b78379e2f27761ddc7a9033dfa4aea8a983c29675de052 |
| tests/test_critical_near_nyquist_two_branch_block_covariance_barrier.py | 217df2931005ca8397a8e7bb60701dd41e9d3c596f30d9bdbec021adcecc39ce |
| notes/ADAPTIVE_GONEK_ENDPOINT_FILTER_SELECTION_THEOREM.md | 7354d464d4a3d53cb32c83b941a24aac60c5cbbf9b87c5bf56a907193459bd46 |
| tests/test_adaptive_gonek_endpoint_filter_selection_theorem.py | e8e96cab5e5bd817650c0f323f248d00772802e439474b1f9d890083f8ca6396 |

The first pair supplies the positive critical-density source multiplier
and its relative first derivative.  The second supplies the critical
schedule, exact endpoint/Cauchy normalization, and near-Nyquist Lerch
symbol.  The third supplies the positive Hardy--Xi envelope, the symmetric
two-branch smoothed AFE with differentiated decay, the variable-coefficient
mean-value inequality, and multiplicity-safe Sobolev sampling.

Two primary external results are used.  The uniform ordinary explicit
formula is Theorem 1 of S. M. Gonek,
[*A formula of Landau and mean values of zeta(s)*](https://www.sas.rochester.edu/mth/people/faculty/gonek-steve/assets/pdf/8-landau-form.pdf),
in *Topics in Analytic Number Theory* (Austin, 1982), 92--97, Univ.
Texas Press, 1985.  The Hardy-cross input is Theorem 5 and the dyadic
decomposition in the proof of Corollary 5.2 of B. Durkan, C. Hughes, and
A. Pearce-Crump,
[*Generalisations of the Landau--Gonek Theorem and Applications to Mean Values of Zeta*](https://arxiv.org/abs/2601.18025).
Both are primary, external, unvendored, and unhashed.  The displayed
error in Corollary 5.2 is not read uniformly in its integer parameter.
Section 5 repeats its dyadic decomposition and keeps the honest RH-PNT
loss `O(sqrt(nU)*(log U)^2)`; no unprinted prefix version of Theorem 5 is
asserted.

## 2. Exact adaptive critical carrier

For real `t` in the dyadic range define the smooth length and carrier
index

\[
 L_0(t;D)=\log {t\over2\pi D},\qquad
 m_*(t;D)={tL_0(t;D)\over2\pi}.                    \tag{2.1}
\]

Choose a nearest integer `m(t;D)` to `m_*` and put

\[
 L(t;D)={2\pi m(t;D)\over t},\qquad
 h(t;D)={2\pi\over L(t;D)},\qquad N=m-1.           \tag{2.2}
\]

Then, exactly,

\[
 t=mh,\qquad
 |L-L_0|\leq{\pi\over t},\qquad
 \left|h-{2\pi\over L_0}\right|
 \ll_{\mathcal D}{1\over tL^2}.                   \tag{2.3}
\]

Since `D*e^(L_0)=t/(2*pi)`, the mean-value theorem gives

\[
 D e^LL={tL_0\over2\pi}+O_{\mathcal D}(L),
 \qquad
 N=D e^LL+O_{\mathcal D}(L).                       \tag{2.4}
\]

Writing `c=2*pi*e^L` and using `t=2*pi*(N+1)/L` also gives

\[
 t=Dc+O_{\mathcal D}(1).                            \tag{2.5}
\]

This proves (0.3).  It also gives the actual density seen by the critical
symbol,

\[
 D_t:={t\over2\pi e^L}=D\{1+O_{\mathcal D}(t^{-1})\}. \tag{2.6}
\]

For `t_gamma=gamma+delta_Y`, define

\[
 x_\gamma={t_\gamma-\gamma\over h_\gamma}
 ={1\over2}{L_\gamma\over\log(2Y/(2\pi))}
 ={1\over2}+O_{\mathcal D}(L^{-1}).                \tag{2.7}
\]

Thus the selected zero is a fixed distance from the carrier and is never
a carrier row for all sufficiently large `Y`.  The construction is
nearest-integer adaptive rounding.  It is not the identity
`N=ceil(D*e^L*L)`.

## 3. Critical source, endpoint, and same-zero row

Let `c_H(t)>0` denote the Hardy--Xi envelope from the frozen adaptive
pair.  For `c=2*pi*e^L`, put

\[
 \Phi(d)=\sqrt{1-d^2/4}-1+{d\over2}\arcsin(d/2),
 \qquad
 A_4(d)=\cos(\tfrac12\arcsin(d/2))^{-9/2}
          \cos(\arcsin(d/2))^{-1/2}.               \tag{3.1}
\]

On the local subturning interval `|v-t|<=B log Y`, the leading positive
critical-density envelope at fixed `c` is

\[
 \mathcal A_c^{\rm loc}(v)
 =c_H(v)e^{c\Phi(v/c)}A_4(v/c).                    \tag{3.2}
\]

The frozen connection theorem shows that this is the leading normalized
label-0/4 physical source multiplier, with relative error `O(c^(-1/2))`
and the same bound after one `t` derivative.  This pair proves the
arithmetic theorem for the tangent model defined below; it does not
identify the resulting infinite tails with actual finite-prolate tails.
No value of `Phi(v/c)` is used past the subturning domain.

Differentiating (3.1) gives the exact cancellation

\[
 \Phi'(d)={1\over2}\arcsin(d/2).                    \tag{3.3}
\]

Together with `d(log c_H)/dt=-pi/4+O(t^(-1))`, this yields

\[
 -{d\over dv}\log\mathcal A_c^{\rm loc}(v)
 =a(v/c)+O_{\mathcal D}(t^{-1}),\qquad
 a(d)={\pi\over4}-{1\over2}\arcsin(d/2).           \tag{3.4}
\]

In particular

\[
 a_D:={\pi\over4}-{1\over2}\arcsin(D/2)
 \geq a_*:=\min_{d\in\mathcal D}a(d)>0.            \tag{3.5}
\]

For each base point `t=t_gamma`, define the global tangent envelope only
on its future half-line by

\[
 \boxed{
 \mathcal A_{D,t}^{\rm tan}(t+u)
 =\mathcal A_c^{\rm loc}(t)e^{-a_Du},\qquad u\geq0.} \tag{3.6}
\]

This is globally positive and exponentially decreasing by definition.
Uniformly for `0<=u<=B log Y`, Taylor's theorem in the proved local
subturning collar gives the comparison

\[
 {\mathcal A_c^{\rm loc}(t+u)
  \over\mathcal A_{D,t}^{\rm tan}(t+u)}
 =1+O_{B,\mathcal D}((1+u)^2/Y).                   \tag{3.7}
\]

Equation (3.7) only identifies the tangent ideal with the physical source
locally.  Comparing their complete future tails, in particular after a
turning point or in a supercritical region, is explicitly deferred.

For the exact adaptive data belonging to `gamma`, abbreviate
`t=t_gamma`, `h=h_gamma`, `m=m_gamma`, `c=2*pi*e^(L_gamma)`, and
`A(u)=mathcal A_(D,t)^tan(u)`.  Define the complete tangent-ideal endpoint
and row

\[
 E_\gamma={1\over A(t)}\sum_{k\geq0}(-1)^k
 A(t+kh)Z(t+kh),                                   \tag{3.8}
\]

\[
 C_\gamma=-{2\over\gamma A(t)}\sum_{k\geq0}(-1)^k
 A(t+kh)Z(t+kh){\gamma^2\over\gamma^2-(t+kh)^2}.  \tag{3.9}
\]

Both sums are absolutely convergent because (3.6) has a fixed positive
decay rate and `Z` has polynomial growth.  The normalization in (3.9) is the
exact phase-normalized Cauchy row at the half-cell.  Indeed, with
`x=(t-gamma)/h`,

\[
 -{2\over\gamma}{\gamma^2\over\gamma^2-(t+kh)^2}
 ={1\over h(k+x)}{2\gamma\over t+kh+\gamma}
 ={1\over h(k+x)}\{1+O((1+k)h/Y)\}.               \tag{3.10}
\]

Also `sin(gamma*L/2)=(-1)^(m+1)sin(pi*x)`, so (3.9) is equivalent to the
frozen phase/gamma normalization with no small divisor because
`x=1/2+O(1/L)`.

The tangent ideal also preserves the exact adjacent tail algebra.  For
`j>=0` put

\[
 A_j=\mathcal A_{D,t}^{\rm tan}(t+jh)>0,\qquad
 Z_j=Z(t+jh),\qquad
 r={A_{j+1}\over A_j}=e^{-a_Dh}>0.                 \tag{3.11}
\]

Define the endpoint `e_j` and normalized same-zero row `c_j` by

\[
 \begin{aligned}
 A_je_j&=\sum_{k\geq0}(-1)^kA_{j+k}Z_{j+k},\\
 A_jc_j&=-{2\over\gamma}\sum_{k\geq0}(-1)^k
 A_{j+k}Z_{j+k}{\gamma^2\over
                   \gamma^2-(t+(j+k)h)^2}.
 \end{aligned}                                     \tag{3.12}
\]

Absolute convergence permits an exact index shift, with no asymptotic
step:

\[
 \boxed{
 e_j+r e_{j+1}=Z_j,\qquad
 c_j+r c_{j+1}=-{2\over\gamma}
 {\gamma^2\over\gamma^2-(t+jh)^2}Z_j.}            \tag{3.13}
\]

At `j=0`, `e_0=E_gamma` and `c_0=C_gamma`.  Thus the global positive
tangent extension changes neither the exact endpoint recurrence nor the
exact Cauchy recurrence used by the frozen adjacent-cutoff algebra.

## 4. Exact short symbol and bounded-variation envelopes

Use the symmetric smoothed AFE from the frozen adaptive pair.  For one
positive branch and one Dirichlet index define

\[
 z_{D,n}=a_D+i\{\log n-\tfrac12\log D\},\qquad
 q_{D,n}=e^{-h z_{D,n}}.                            \tag{4.1}
\]

The tangent definition (3.6) makes the damping `exp(-a_D*h)` exact for
every `k`.  The carrier identity `h*L/2=pi`, (2.6), and the Hardy phase
formula show that the leading alternating ratio is (4.1), with only the
AFE-weight and phase-curvature `C^1` symbol error
`O_\mathcal D((1+k)^2h^2/Y)` on the effective tail.
The two leading multipliers are therefore

\[
 M_E(n)={1\over1-q_{D,n}},\qquad
 M_C(n)={1\over h}\Phi(q_{D,n},1,x_\gamma).        \tag{4.2}
\]

For fixed `n`, the Lerch expansion from the frozen critical barrier gives

\[
 M_E(n)={L\over2\pi z_{D,n}}+O_{\mathcal D,n}(1), \tag{4.3}
\]

\[
 M_C(n)={L\over2\pi}
 \{\log L-\log(2\pi z_{D,n})-\gamma_0-\psi(1/2)\}
 +O_{\mathcal D,n}(L).                              \tag{4.4}
\]

In particular

\[
 |M_E(n)|\asymp_{\mathcal D,n}{L\over
 \{a_D^2+(\log n-\tfrac12\log D)^2\}^{1/2}},
 \qquad |M_C(1)|\asymp_\mathcal D L\log L.        \tag{4.5}
\]

Equations (4.3)--(4.5) are precisely the critical short-endpoint effect:

\[
 \sum_{n\geq1}{1\over n\{a_D^2+
       (\log n-\tfrac12\log D)^2\}}<\infty.       \tag{4.6}
\]

Here and below the AFE weight supplies rapid decay past `sqrt(Y)`.  Fix

\[
 \eta={1\over10},\qquad M=Y^{1/2+\eta}=Y^{3/5}.    \tag{4.7}
\]

Writing `A_n(t)` and `B_n(t)` for the exact smooth-schedule endpoint and
row coefficients, summation by parts in the geometric/Lerch sums and the
differentiated AFE estimates give, for every fixed large `R`,

\[
 \begin{aligned}
 |A_n(t)|&\ll_{\mathcal D,R}{L\over a_*+\log n}
       \left(1+{n\over\sqrt Y}\right)^{-R},\\
 |B_n(t)|&\ll_{\mathcal D,R}L
 \left\{1+\log_+{L\over1+\log n}\right\}
       \left(1+{n\over\sqrt Y}\right)^{-R},\\
 |B_1(t)|&\asymp_\mathcal D L\log L.
 \end{aligned}                                     \tag{4.8}
\]

For a function on `[Y,2Y]` put

\[
 \|W\|_{BV}=\sup_{Y\leq u\leq2Y}|W(u)|
             +\int_Y^{2Y}|W'(u)|du.                \tag{4.9}
\]

The same estimates hold with absolute value replaced by the `BV` norm.
This follows directly from `L_0'(t)=1/t`, (3.4), the AFE derivative
bound, and differentiated summation by parts.  In particular, with
`mathcal B_n` denoting the second envelope in (4.8),

\[
 \begin{aligned}
 \sum_{n\geq2}{\mathcal B_n\over n}&\ll L^2,
 &\sum_{n\geq2}{\Lambda(n)\mathcal B_n\over n}&\ll L^2,\\
 \sum_{n\leq M}\mathcal B_n&\ll Y^{1/2+\eta}L,
 &\sum_{n\leq M}\mathcal B_n\log n&\ll Y^{1/2+\eta}L^2,\\
 \sum_{n\leq M}{\mathcal B_n\over\sqrt n}&\ll M^{1/2}L.
 \end{aligned}                                     \tag{4.10}
\]

For the endpoint upper bound one may freeze `L_0` at the lower dyadic
endpoint:

\[
 A_n(t)=a_n+r_n(t),\qquad
 |a_n|\ll{L\over a_*+\log n},\qquad
 \|r_n\|_{BV}\ll{1\over a_*+\log n}.              \tag{4.11}
\]

All constants are uniform for `D in mathcal D`.  These symbol/BV bounds,
not a coefficientwise absolute sum of the full AFE, are the analytic
shortness used below.

## 5. The uniform cumulative chi bound and the microscopic shift

For each integer `n=o(U)`, Corollary 5.2 of the
Durkan--Hughes--Pearce-Crump paper prints under RH a cumulative formula
with error `O(n*log n)+O(U^(1/2)*(log U)^2)`.  That statement does not
by itself supply a uniform implied constant for all `n<=U^(1-kappa)`, so
we do not use its smaller displayed square-root error uniformly.

Instead return to their uniform Theorem 5 and repeat the dyadic
decomposition printed in the proof of Corollary 5.2, but stop it at
`V=U^(2/5)`.  Under RH the omitted zeros have total absolute contribution

`O(sqrt(n)*N(V))=O(sqrt(n)*V*log V)`.  On every retained dyadic scale
`T_k>=V/2`, one has `n^(1/log T_k)<=exp(3/2+o(1))`.  Consequently the
first two errors of Theorem 5 sum to
`O(sqrt(U)*(log U)^2+n*U^(-1/5)*(log U)^2)`.  Splitting the two transition
errors into `T_k>>n`, `T_k` comparable to `n`, and `T_k<<n` gives
respectively
geometric sums bounded by `O(sqrt(U)*log U)`, `O(n*log U)`, and
`O(sqrt(n)*log U)`.

For integer `n`, the same three-regime main-sum algebra as in the printed
proof combines the retained main terms into
`-n*psi(U/(2*pi*n))+O(V+n*log n)`; the `O(V)` is the lower truncation
boundary.  Since `n<=U^(3/5)`, RH PNT gives
`psi(v)=v+O(v^(1/2)*log^2(2v))` uniformly at
`v=U/(2*pi*n)>=c*U^(2/5)`, and therefore contributes the error
`O(sqrt(nU)*(log U)^2)`.  Each preceding error is absorbed by this last
quantity uniformly for `1<=n<=U^(3/5)`.  Thus the uniform weakening
actually used here is

\[
 \sum_{0<\gamma\leq U}\chi(\rho)n^\rho
 =-{U\over2\pi}+O(n\log n)
   +O(\sqrt{nU}(\log U)^2),\qquad n\leq U^{3/5}.  \tag{5.1}
\]

With `eta=1/10`, uniformly for `Y<=U<=2Y` and `n<=M`, subtracting (5.1)
at heights `U` and `Y` gives

\[
 \mathcal S_n(U):=\sum_{Y<\gamma\leq U}\chi(\rho)n^\rho
 =-{U-Y\over2\pi}+O(n\log n+\sqrt{nY}L^2).        \tag{5.2}
\]

This is not a new two-height theorem: it is a difference of the uniform
cumulative weakening just derived from Theorem 5.  Every variable in
that theorem is exactly `X=n`, and

\[
 |Y-2\pi n|\asymp Y,\qquad |Y-\pi n|\asymp Y      \tag{5.3}
\]

uniformly for `n<=Y^(3/5)`.  Thus no transition at `Y/(2*pi)` or `Y/pi`
is approached.

Stieltjes partial summation in (5.2) proves, for every `C^1` or BV weight,

\[
 \boxed{
 \sum_{Y<\gamma\leq2Y}W(\gamma)\chi(\rho)n^\rho
 =-{1\over2\pi}\int_Y^{2Y}W(u)du
 +O\!\left(\|W\|_{BV}
       \{n\log n+\sqrt{nY}L^2\}\right).}         \tag{5.4}
\]

The shift in (0.2) is kept exactly.  On RH put

\[
 R_{\delta,n}(u)
 ={\chi(1/2+iu)\over\chi(1/2+i(u+\delta_Y))}
 n^{-i\delta_Y}.                                   \tag{5.5}
\]

Stirling's formula gives

\[
 R_{\delta,n}(u)
 =\exp\left\{i\delta_Y\log{u\over2\pi n}\right\}
 \{1+O((YL)^{-1})\},\qquad
 |R_{\delta,n}'(u)|\ll{1\over YL}.                \tag{5.6}
\]

Consequently `sup|R|+TV(R)<<1`.  The microscopic shift, the smooth
coefficient variation, and their products are therefore legitimate
weights in (5.4); no shift is dropped.

For completeness, the ordinary same-branch input is also used in
cumulative form.  Gonek's uniform formula, specialized to the integer
`n`, gives uniformly for `Y<=U<=2Y` and `n<=M`

\[
 \mathcal L_n(U):=\sum_{Y<\gamma\leq U}n^\rho
 =-{U-Y\over2\pi}\Lambda(n)+O(nL\log L).           \tag{5.7}
\]

The two distance-to-prime-power errors in the general real-`X` theorem
are subsumed in this integer specialization.  A second Stieltjes partial
summation therefore gives

\[
 \sum_{Y<\gamma\leq2Y}W(\gamma)n^\rho
 =-{\Lambda(n)\over2\pi}\int_Y^{2Y}W(u)du
 +O\{\|W\|_{BV}nL\log L\}.                         \tag{5.8}
\]

Equations (5.4) and (5.8) include algebraic multiplicity, as do both
primary source formulas.

## 6. Real two-branch row lower bound

The exact two-branch AFE and (3.8)--(3.10) give a real expansion

\[
 C_\gamma=F_1(t_\gamma)+H(t_\gamma),               \tag{6.1}
\]

where

\[
 F_1(t)=e^{i\vartheta(t)}B_1(t)
        +e^{-i\vartheta(t)}\overline {B_1(t)},      \tag{6.2}
\]

and `H` contains every mode `n>=2`, its conjugate AFE branch, the smooth
AFE tail, and the real remainder.  Thus `H(t)` is real and `H(t)^2>=0`.
Only `F_1^2` and `2F_1H` need evaluation.

Here is the complete cross-channel bookkeeping.  At
`t=gamma+delta_Y`, the terms are as follows.

| term | zero sum after RH | explicit-formula variable |
|---|---|---|
| diagonal in `F_1^2` | zero count | none |
| Hardy cross in `F_1^2` | `chi(rho)` or its conjugate | `X=1` |
| same branch, modes `1,n` | `n^rho/n` or its conjugate | `X=n` |
| opposite Hardy branches, modes `1,n` | `overline(chi(rho)n^rho)/n` times (5.5) | `X=n` |

There is no general ratio `m/n` because one index is fixed at one, and
there is no product `mn`.  High-high terms are inside the nonnegative
real square `H^2` and are not expanded.

The diagonal and Riemann--von Mangoldt formula give

\[
 2\sum_{Y<\gamma\leq2Y}\nu_\gamma|B_1(t_\gamma)|^2
 \geq c_{\mathcal D}YL^3(\log L)^2.               \tag{6.3}
\]

The `X=1` Hardy cross in `F_1^2`, evaluated by (5.4), is only

\[
 O_{\mathcal D}(Y|B_1|^2+Y^{1/2}L^2|B_1|^2)
 =O_{\mathcal D}(YL^2(\log L)^2).                  \tag{6.4}
\]

For the same-branch `1,n` terms, Gonek's uniform integer formula and
partial summation give main contribution

\[
 \ll Y|B_1|\sum_{n\geq2}{\Lambda(n)\mathcal B_n\over n}
 \ll YL^3\log L.                                   \tag{6.5}
\]

Its total coefficient-weighted error is

\[
 \ll |B_1|L\log L\sum_{n\leq M}\mathcal B_n
 \ll Y^{1/2+\eta}L^3(\log L)^2
 =o\{YL^3(\log L)^2\}.                            \tag{6.6}
\]

For the opposite-branch terms, (5.4)--(5.6) give the main bound

\[
 \ll Y|B_1|\sum_{n\geq2}{\mathcal B_n\over n}
 \ll YL^3\log L,                                   \tag{6.7}
\]

and the entire error is

\[
 \begin{aligned}
 &|B_1|\sum_{2\leq n\leq M}\mathcal B_n
 \left\{\log n+{Y^{1/2}L^2\over\sqrt n}\right\}\\
 &\qquad\ll
 Y^{3/5}L^3\log L+Y^{4/5}L^4\log L
 =o\{YL^3(\log L)^2\}.
 \end{aligned}                                     \tag{6.8}
\]

The AFE remainder has arbitrarily small pointwise size after smooth
truncation and is included in the same `F_1 H` estimate.  Since

\[
 C_\gamma^2=F_1(t_\gamma)^2+2F_1(t_\gamma)H(t_\gamma)
              +H(t_\gamma)^2,                     \tag{6.9}
\]

equations (6.3)--(6.8) prove the first line of (0.5).  Both AFE branches,
all high modes, and their cross terms are present; positivity of the full
real high square is what avoids a nonexistent high-high shifted-
convolution estimate.

## 7. Low endpoint upper bound

The endpoint has the exact real two-branch form

\[
 E(t)=2\operatorname {Re}\left\{e^{i\vartheta(t)}P_E(t)\right\}
       +R_E(t),\qquad
 P_E(t)=\sum_{n\leq M}{A_n(t)\over\sqrt n}n^{-it}. \tag{7.1}
\]

Use the pointwise inequality `|2 Re z|^2<=4|z|^2`.  This retains both
branches but reduces the upper bound to the complex norm of one branch.
In particular, an expansion of the real square would contain
same-branch ratios `m/n` and Hardy-cross products `mn`; neither is needed
or claimed here.

Put

\[
 X=Y^\varepsilon,\qquad \varepsilon={1\over10}.     \tag{7.2}
\]

For `n<=X`, use (4.11).  The varying remainder polynomial has continuous
energies

\[
 I_{0,r}\ll Y,\qquad I_{1,r}\ll YL^2,             \tag{7.3}
\]

and Section 8 samples it with total cost `O(YL^2)`.  It remains to bound
the fixed polynomial with coefficients `a_n`.

Its diagonal is

\[
 \{N(2Y)-N(Y)\}\sum_{n\leq X}{|a_n|^2\over n}
 \ll YL^3.                                         \tag{7.4}
\]

For `n>m`, put `x=n/m`.  On RH the off-diagonal phase is
`x^(1/2)x^(-rho)`, so Gonek's uniform reciprocal formula applies.  Its
prime-power main term is

\[
 \begin{aligned}
 &\ll YL^2\sum_{mq\leq X}{\Lambda(q)\over mq
 (a_*+\log m)(a_*+\log(mq))}\\
 &\ll YL^2\int_{u+v\leq\varepsilon L}
 {du\,dv\over(a_*+u)(a_*+u+v)}
 \ll YL^2(\log L)^2.
 \end{aligned}                                     \tag{7.5}
\]

The three uniform error terms in the reciprocal Landau--Gonek formula
are, respectively,

\[
 O(L\log L),\quad
 O\!\left(\log x\min\{Y/x,1/\langle x\rangle\}\right),\quad
 O\!\left(L\min\{Y/x,1/(x\log x)\}\right).       \tag{7.6}
\]

For the rational `x=n/m`, distance from every distinct prime power is at
least `1/m`, while `log(n/m)>=(n-m)/n`.  Summing (7.6), with the factor
`|a_ma_n|/m`, gives

\[
 O(XL^4\log L)+O(X^2L^3)+O(XL^4)=o(YL^3).          \tag{7.7}
\]

The conjugate half is identical.  Equations (7.3)--(7.7) prove that the
complete low endpoint contributes `O(YL^3)`.

## 8. High endpoint and multiplicity-safe H1 sampling

For `n>X`, (4.8) gives the exact coefficient energies

\[
 \mathcal A_0:=\sup_t\sum_{X<n\leq M}{|A_n(t)|^2\over n}
 \ll L^2\int_{\varepsilon L}^{L/2}{du\over u^2}
 \ll L,                                             \tag{8.1}
\]

\[
 \mathcal A_1:=\sup_t\sum_{X<n\leq M}
 {\left|A_n'(t)+i\{\vartheta'(t)-\log n\}A_n(t)\right|^2\over n}
 \ll L^3.                                           \tag{8.2}
\]

The variable-coefficient mean-value inequality from the frozen adaptive
pair applies because the `BV` form of (4.8) also bounds the square-root
coefficient norms and their integrated derivatives by `O(L^(1/2))` for
the polynomial and by `O(L^(3/2))` for its differentiated oscillatory
coefficients.  It therefore gives, on `[Y-1,2Y+1]`,

\[
 I_0:=\int|e^{i\vartheta(t)}P_{>X}(t)|^2dt\ll YL,
 \qquad
 I_1:=\int|\{e^{i\vartheta(t)}P_{>X}(t)\}'|^2dt
 \ll YL^3.                                         \tag{8.3}
\]

Multiplicity is retained.  Let

\[
 \mu_Y=\sum_{Y<\gamma\leq2Y}\nu_\gamma
        \delta_{\gamma+\delta_Y},\qquad
 r={1\over L},\qquad
 M_Y=\sup_u\mu_Y([u-r,u+r]).                       \tag{8.4}
\]

Riemann--von Mangoldt gives an absolute constant `C_RvM` such that

\[
 M_Y\leq C_{\rm RvM}L.                              \tag{8.5}
\]

For every `F in H^1`, the point-evaluation inequality and overlap count
give with explicit sampling structure

\[
 \boxed{
 \int|F|^2d\mu_Y
 \leq M_Y\left\{{1\over2r}\int|F|^2
       +2\left(\int|F|^2\int|F'|^2\right)^{1/2}\right\}.} \tag{8.6}
\]

Using (8.3)--(8.5),

\[
 \int|e^{i\vartheta}P_{>X}|^2d\mu_Y
 \ll L\{L(YL)+2(YL\cdot YL^3)^{1/2}\}
 \ll YL^3.                                         \tag{8.7}
\]

The AFE remainder and the smooth tail `n>M` are `O_A(Y^(-A))` with one
derivative and contribute `o(1)`.  Combining (7.1), Section 7, and (8.7)
proves the endpoint upper bound in (0.5).  No zero simplicity or spacing
lower bound has been used.

## 9. Nearest-integer staircase defect

All `BV` and `H^1` estimates above were made for the smooth length
`L_0(t;D)`.  The exact sample uses the discontinuous nearest-integer
length `L(t;D)`.  No derivative of that staircase is taken.

Differentiate the geometric and Lerch symbols with respect to `h` on the
fixed half-cell compact set.  Equations (2.3), (4.2), and summation by
parts give

\[
 |\partial_h A_n|\ll L^2\left(1+{n\over\sqrt Y}\right)^{-R},
 \qquad
 |\partial_h B_n|\ll L^2\log L
       \left(1+{n\over\sqrt Y}\right)^{-R}.        \tag{9.1}
\]

Therefore the coefficient defects at every sampled point satisfy

\[
 |\Delta A_n|\ll {1\over Y}
       \left(1+{n\over\sqrt Y}\right)^{-R},
 \qquad
 |\Delta B_n|\ll {\log L\over Y}
       \left(1+{n\over\sqrt Y}\right)^{-R}.        \tag{9.2}
\]

Trivial summation only for this already tiny defect gives

\[
 |\Delta E_\gamma|+|\Delta C_\gamma|
 \ll Y^{-1}M^{1/2}L^{O(1)}
 =Y^{-7/10}L^{O(1)}.                               \tag{9.3}
\]

After summing over `O(YL)` zeros, (9.3) is `o(YL^3)` in endpoint energy
and `o(YL^3(log L)^2)` in the row calculation, including its cross term
by Cauchy--Schwarz.  The perturbation `D_t-D=O(1/Y)` in (2.6) is absorbed
by the same estimate.  Thus (0.5) holds on the exact adaptive staircase.

## 10. Strengthened same-ordinate selection

Let

\[
 Z_Y=\sum_{Y<\gamma\leq2Y}\nu_\gamma
 \sim {Y\over2\pi}L.                               \tag{10.1}
\]

Fix `0<a<1` and discard ordinates for which

\[
 |C_\gamma|^2<a{A_Y\over Z_Y}.                      \tag{10.2}
\]

Their total row energy is less than `a*A_Y`; the remaining ordinates
carry at least `(1-a)A_Y`, and every remaining ordinate satisfies

\[
 |C_\gamma|^2\geq a{A_Y\over Z_Y}
 \gg_{\mathcal D}L^2(\log L)^2.                   \tag{10.3}
\]

If all remaining ordinates also had

\[
 |C_\gamma|^2<c_1(\log L)^2|E_\gamma|^2,          \tag{10.4}
\]

then (0.5) would imply

\[
 (1-a)A_Y<c_1(\log L)^2B_Y,                        \tag{10.5}
\]

which is impossible for a sufficiently small fixed
`c_1=c_1(mathcal D,a)>0`.  Hence one and the same ordinate satisfies
(10.3)--(10.4), proving (0.6).  If its endpoint is zero, the ratio
inequality is interpreted in the favorable zero-endpoint sense; the
absolute row bound still holds.

The conclusion `|C_gamma|>>L log L` implies
`|C_gamma|/log L>>L`.  Thus a future relative transfer could compare
errors to this natural scale even if `E_gamma` nearly cancels.  Such a
transfer is not part of this theorem.

## 11. What the adaptive theorem removes, and what it does not

The fixed-grid barrier expanded a Poisson-sampled statistic and therefore
encountered the four variables

\[
 {qm\over Qn},\qquad {qn\over Qm},\qquad
 {qmn\over Q},\qquad {q\over Qmn}.                 \tag{11.1}
\]

At critical density its diagonal prime interval had bounded physical
width.  None of (11.1) appears here.  The carrier is chosen after the zero
ordinate, and the covariance is summed directly over the same zeros.  By
projecting only the first row mode, the explicit formulas see `X=n` and
the associated prime range in the dyadic chi formula has length
`asymp Y/n>=Y^(2/5)`, not bounded length.

The earliest arithmetic input beyond the older barrier is precisely the
printed cumulative integer-`X` chi formula (5.1).  Its combination with
the short endpoint and the nonnegative unexpanded high square closes the
ideal same-zero covariance.  No new shifted-convolution estimate is
assumed.

What remains is separate: identifying these leading ideal critical-source
tails with the actual finite-prolate endpoint and row at relative scale,
controlling any supercritical Abel tail needed by that interface,
intersecting the selected cutoff with every finite strict gate, and
returning from the adaptive `O(L)` schedule to any literal ceiling rule.
Until those are proved at the same parameter, (0.6) is not a checkpoint
theorem and implies no bound for the actual project quotient.
