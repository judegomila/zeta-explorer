# Adaptive Gonek endpoint-filter selection theorem

## 0. Exact outcome and claim boundary

Assume RH.  Fix `x=1/4`, put

\[
 \mathscr L_U={1\over2\pi}\log {U\over2\pi},
 \qquad
 \delta_Y={x\over\mathscr L_{2Y}},                 \tag{0.1}
\]

and write `nu_gamma` for the algebraic multiplicity of a zero ordinate.
For each `gamma in (Y,2Y]` put

\[
 t_\gamma=\gamma+\delta_Y.                         \tag{0.2}
\]

Apply the frozen adaptive nearest-integer construction separately to
every `t_gamma`.  Thus `t_gamma=m_gamma h_gamma`, where

\[
 h_\gamma={2\pi\over L_\gamma},\qquad
 m_\gamma=N_\gamma+1,\qquad
 N_\gamma=e^{L_\gamma/2}L_\gamma^3+O(L_\gamma),
 \qquad L_\gamma\sim2\log Y.                       \tag{0.3}
\]

This note proves a joint selection theorem which is stronger than the
previously missing existential arithmetic gate.  For every sufficiently
large dyadic `Y`, there is one ordinate `gamma_Y in (Y,2Y]` such that,
on its own adaptive singleton block `J={m_gamma_Y}`,

\[
 \boxed{
 \begin{aligned}
 &Z(t_{\gamma_Y})\ne0,\\
 &{\sf PW1}(J)\quad\hbox{holds for every fixed }\kappa<4,\\
 &|e_{m_{\gamma_Y}}|^2+r_{m_{\gamma_Y}}^2
   |e_{m_{\gamma_Y}+1}|^2
   \leq C L_{\gamma_Y}|Z(t_{\gamma_Y})|^2.
 \end{aligned}}                                    \tag{0.4}
\]

Here `Z` is Hardy's real function, `e_m` is the complete normalized
one-sided alternating Hardy--Xi endpoint, and
`r_m=A_(m+1)/A_m`.  In particular the singleton endpoint-frame constant
satisfies

\[
 \boxed{C_E(L)=O(L)=o(L^2).}                       \tag{0.5}
\]

The frozen adjacent-cutoff theorem therefore selects
`n in {m_gamma,m_gamma+1}` with

\[
 \boxed{
 {D_n^{\rm id}\over|e_n|^2}\geq c_\kappa L_{\gamma_Y}
 \longrightarrow\infty,}                          \tag{0.6}
\]

unless its separately declared zero-endpoint branch already succeeds.
The loss of one power of `L` comes from a deliberately crude but rigorous
multiplicity-safe Sobolev sampling step.  Gonek's full mixed-derivative
formula is not needed.

The proof does **not** establish the exponentially envelope-weighted
dyadic inequality (6.8) in the predecessor note.  That inequality is
strictly different from the unweighted selection estimate proved here.
It also proves no literal ceiling schedule, no prescribed locked-origin
theorem, no actual finite-prolate Stokes/operator transfer, and no
intersection with the finite simple-ground, boundary, shifted-sign,
denominator, or reserve gates.  It proves no unconditional zeta-zero
statement, no RH implication or converse, and no de Bruijn--Newman
`Lambda` bound.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen inputs and external sources

Exactly three frozen internal theorem/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/ADAPTIVE_GONEK_EXACT_CARRIER_PW1_THEOREM.md | c53d7fb8862813bbb75f10ca9c0ad4d5d385ff9c8d3084d3238afe77220b4a7b |
| tests/test_adaptive_gonek_exact_carrier_pw1_theorem.py | 0fa1da396704e7343f3f0e3c8231f8d376ae77ced264a173c2619dd024765e5e |
| notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md | 2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87 |
| tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py | d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97 |
| notes/ADAPTIVE_EXACT_CARRIER_GEVREY_SCHEDULE_FINITE_GATE_BARRIER.md | ecfb29e9e95bb031b95abb27e2eac97c1f466b84a795335a4645d0a6c9cb668f |
| tests/test_adaptive_exact_carrier_gevrey_schedule_finite_gate_barrier.py | e2ed609e22ec3f81c53c237f9dfd73d972cc0963ad74fd5943222110d192198d |

The first pair supplies Gonek's dyadic shifted second moment, the
half-cell row, and singleton `PW1`.  The second supplies the exact adjacent
endpoint recurrence and aggregate quotient.  The third supplies the
smooth inverse and its nearest-integer perturbation.

There are two primary external sources.  Corollary 2 of S. M. Gonek,
[*Mean values of the Riemann zeta-function and its derivatives*](https://www.sas.rochester.edu/mth/people/faculty/gonek-steve/assets/pdf/5-mvzdrvs.pdf),
Invent. Math. 75 (1984), 123--141, supplies the shifted-zero second
moment.  A. F. Lavrik,
[*Approximate functional equations for Dirichlet functions*](https://www.mathnet.ru/eng/im2696),
Math. USSR-Izv. 2 (1968), 129--179, supplies a general smoothed
two-branch approximate-functional-equation contour form.  Both sources
are primary, external, unvendored, and nonbinding.  The precise critical-
line specialization and all uniform derivative estimates used below are
derived from the displayed contour and Stirling's formula in Section 3;
they are not imported as an unstated black box.

## 2. Exact Hardy--Xi envelope and adaptive spacings

Use the standard Hardy phase `vartheta` and real Hardy function

\[
 Z(t)=e^{i\vartheta(t)}\zeta\left({1\over2}+it\right),
 \qquad
 \vartheta'(t)={1\over2}\log {t\over2\pi}+O(t^{-2}). \tag{2.1}
\]

The exact completed-zeta identity is

\[
 \Xi(t)=-c(t)Z(t),\qquad
 c(t)={t^2+1/4\over2}\pi^{-1/4}
 \left|\Gamma\left({1\over4}+{it\over2}\right)\right|>0. \tag{2.2}
\]

The harmless common factor `1/4` may be included in the positive
envelope.  Thus set

\[
 A(t)={c(t)\over4},\qquad f(t)={\Xi(t)\over4}=-A(t)Z(t). \tag{2.3}
\]

Stirling's formula, differentiated twice, gives

\[
 \begin{aligned}
 c(t)&=C_0t^{7/4}e^{-\pi t/4}\{1+O(t^{-1})\},\\
 {d\over dt}\log c(t)&=-{\pi\over4}+{7\over4t}+O(t^{-2}),\\
 {d^q\over dt^q}\log c(t)&=O_q(t^{-q})\qquad(q=2,3).
 \end{aligned}                                      \tag{2.4}
\]

In particular, uniformly for `0<=u<=B log t`,

\[
 {c(t+u)\over c(t)}
 =e^{-\pi u/4}\left(1+{u\over t}\right)^{7/4}
 \{1+O_B(t^{-1})\}.                                \tag{2.5}
\]

The same ratio and its first three `t,u` derivatives have an integrable
majorant `C_B(1+u)^B exp(-pi*u/5)` for all sufficiently large `t`.  This
last, slightly weaker exponential is used to justify every differentiated
tail interchange below.

For each real `t` let `ell(t)>=1` be the unique solution of

\[
 t=2\pi\left(e^{\ell(t)/2}\ell(t)^2+{1\over\ell(t)}\right),
 \qquad h_0(t)={2\pi\over\ell(t)}.                 \tag{2.6}
\]

Implicit differentiation and the frozen inverse calculation give, on a
dyadic interval,

\[
 \begin{aligned}
 \ell(t)&=2\log t-4\log\log t+O(1),\\
 h_0(t)&={\pi\over\log t}\{1+O(\log\log t/\log t)\},\\
 h_0'(t)&=O((t\log^2t)^{-1}),\qquad
 h_0''(t)=O((t^2\log^2t)^{-1}).
 \end{aligned}                                      \tag{2.7}
\]

The exact adaptive construction chooses

\[
 m_*(t)={t\ell(t)\over2\pi},\qquad
 m(t)\in\mathbb Z,\quad |m(t)-m_*(t)|\leq{1\over2},
 \qquad
 L(t)={2\pi m(t)\over t},\quad h(t)={t\over m(t)}. \tag{2.8}
\]

Consequently

\[
 \boxed{
 |L(t)-\ell(t)|\leq{\pi\over t},\qquad
 |h(t)-h_0(t)|\ll {1\over t\log^2t}.}             \tag{2.9}
\]

The first identity in (2.8) is the nearest-integer adaptive schedule,
not the literal rule `N=ceil(e^(L/2)L^3)`.

For any spacing `h_*`, define the complete normalized endpoint

\[
 \mathcal E_{h_*}(t)
 ={1\over c(t)}\sum_{k\geq0}(-1)^k
 c(t+kh_*)Z(t+kh_*).                               \tag{2.10}
\]

Equations (2.4)--(2.5), the classical convexity bound, and its Cauchy
derivative consequences make (2.10) and the differentiations used below
absolutely convergent.  With the sign convention (2.3), the normalized
endpoint in the adjacent theorem is `e_m=-mathcal E_h(t_m)`.

## 3. Symmetric two-branch smoothed AFE with `C^2` control

This section records the exact analytic input needed for (2.10).  Let

\[
 s={1\over2}+it,\qquad
 \gamma(s)=\pi^{-s/2}\Gamma(s/2),\qquad G(w)=e^{w^2}. \tag{3.1}
\]

Start from the Mellin contour

\[
 V_s(n)={1\over2\pi i}\int_{(3)}
 G(w){\gamma(s+w)\over\gamma(s)}n^{-w}{dw\over w}. \tag{3.2}
\]

Shift the contour through `w=0`, apply
`gamma(s)zeta(s)=gamma(1-s)zeta(1-s)`, and pair the two vertical
integrals.  The residues from the zeta poles are
`O_A(t^(-A))` after the Gaussian factor is evaluated at their imaginary
heights.  This gives the symmetric specialization of Lavrik's contour
formula

\[
 \boxed{
 Z(t)=2\operatorname {Re}\left\{
 e^{i\vartheta(t)}\sum_{n\geq1}{V(n,t)\over\sqrt n}n^{-it}
 \right\}+R_A(t).}                                \tag{3.3}
\]

On the critical line the second AFE branch is exactly the complex
conjugate of the displayed branch.  It has not been discarded.

Move (3.2) to fixed right or left vertical lines and differentiate under
the integral.  Uniform Stirling estimates for the gamma ratio give, for
`q=0,1,2`, every fixed `B`, and `Y<=t<=2Y+O(log Y)`,

\[
 \left|\partial_t^qV(n,t)\right|
 \ll_{q,B}t^{-q}\left(1+{n\over\sqrt t}\right)^{-B},
 \qquad
 |\partial_t^qR_A(t)|\ll_{A,q}t^{-A}.              \tag{3.4}
\]

For definiteness fix `epsilon=1/10`.  Truncating (3.3) at

\[
 n\leq T_0:=Y^{1/2+\epsilon}=Y^{3/5}               \tag{3.5}
\]

changes (3.3) and its first two derivatives by `O_A(Y^(-A))`, after `B`
is chosen in terms of `A`.  The infinite sum in (3.3), rather than a
sharp Riemann--Siegel cutoff, is what makes the differentiated statement
uniform.

## 4. The alternating multiplier has a fixed margin

Apply (3.3) at the translated points in (2.10), initially with the smooth
spacing `h_0(t)`.  Terms with `u=kh_0(t)>B log Y` contribute
`O_A(Y^(-A))`, with two derivatives, by (2.4), (3.4), and convexity.
For a retained Dirichlet index put

\[
 \omega_n(t)=\vartheta'(t)-\log n,\qquad
 z_n(t)=-e^{ih_0(t)\omega_n(t)}.                   \tag{4.1}
\]

Equations (2.7), (3.5), and (2.1) imply, uniformly in the whole retained
range and throughout the dyadic interval,

\[
 |h_0(t)\omega_n(t)|\leq {2\pi\over3}              \tag{4.2}
\]

once `Y` is large.  Hence both AFE branches obey the same fixed
below-Nyquist margin

\[
 \boxed{|1-z_n(t)|=|1+e^{ih_0(t)\omega_n(t)}|\geq1.} \tag{4.3}
\]

Factor the base oscillation in the positive branch and define

\[
 \begin{aligned}
 b_{n,t}(u)&={c(t+u)\over c(t)}V(n,t+u)
 \exp i\{\vartheta(t+u)-\vartheta(t)-u\vartheta'(t)\},\\
 B_n(t)&=\sum_{k\geq0}z_n(t)^k b_{n,t}(kh_0(t)).
 \end{aligned}                                      \tag{4.4}
\]

For `|z|=1`, `|1-z|>=rho`, and an absolutely continuous decaying `b`,
summation by parts gives the elementary bound

\[
 \left|\sum_{k\geq0}z^kb(kh)\right|
 \leq {1\over\rho}
 \left\{|b(0)|+\int_0^\infty|b'(u)|\,du\right\}. \tag{4.5}
\]

The same argument applied to `k*b(kh)` and `k^2*b(kh)` gives, for
`j=0,1,2`,

\[
 \left|\sum_{k\geq0}k^jz^kb(kh)\right|
 \ll_{j,\rho}h^{-j}
 \sum_{q\leq j+1}\int_0^\infty(1+u)^j|b^{(q)}(u)|\,du. \tag{4.6}
\]

The exponential majorant after (2.5), the curvature
`vartheta''(t)=1/(2t)+O(t^(-2))`, and (3.4) make the integrals in
(4.5)--(4.6) uniform.  Moreover

\[
 {d\over dt}\log z_n(t)=O((t\log t)^{-1}),\qquad
 {d^2\over dt^2}\log z_n(t)=O((t^2\log t)^{-1}).   \tag{4.7}
\]

Differentiating (4.4), using (4.6) for the factors `k` and `k^2`, proves

\[
 \boxed{
 |\partial_t^qB_n(t)|
 \ll_{q,B}t^{-q}\left(1+{n\over\sqrt t}\right)^{-B},
 \qquad q=0,1,2.}                                  \tag{4.8}
\]

Differentiating with respect to the spacing instead gives the deliberately
conservative stability bound

\[
 \boxed{
 |\partial_hB_n(t;h)|
 \ll_B(\log t)^2\left(1+{n\over\sqrt t}\right)^{-B}} \tag{4.9}
\]

throughout the interval between `h_0(t)` and `h(t)`.  The margin (4.3)
persists there by (2.9).  The conjugate AFE branch has coefficient
`overline(B_n(t))`; real endpoint filtering therefore retains both
branches exactly.

Combining (3.3) and (4.4) now gives

\[
 \mathcal E_{h_0}(t)=2\operatorname {Re}\left\{
 e^{i\vartheta(t)}\sum_{n\leq T_0}{B_n(t)\over\sqrt n}n^{-it}
 \right\}+O_A(Y^{-A}),                             \tag{4.10}
\]

with the same estimate after two `t` derivatives.

## 5. Variable-coefficient mean value and the endpoint `H^1` norm

We use a short self-contained variable-coefficient form of the Dirichlet-
polynomial mean-value inequality.  If `N<=Y`, `a_n in C^1([Y,2Y])`, and

\[
 P(t)=\sum_{n\leq N}{a_n(t)\over\sqrt n}n^{-it},
 \qquad
 \|a(t)\|_*^2=\sum_{n\leq N}{|a_n(t)|^2\over n},   \tag{5.1}
\]

then the fixed-coefficient Hilbert inequality, the fundamental theorem of
calculus, and Minkowski give

\[
 \boxed{
 \|P\|_{L^2(Y,2Y)}
 \ll (Y+N)^{1/2}
 \left\{\|a(Y)\|_*+\int_Y^{2Y}\|a'(u)\|_*\,du\right\}.} \tag{5.2}
\]

Indeed write `a_n(t)=a_n(Y)+integral_Y^t a_n'(u)du`, apply the ordinary
mean-value inequality on `[u,2Y]` for each fixed `u`, and then integrate
in `u`.  Thus no mean-value result for a hidden time-dependent polynomial
is being assumed.

From (4.8) and `T_0=Y^(3/5)`,

\[
 \|B(t)\|_*\ll(\log Y)^{1/2},\qquad
 \int_Y^{2Y}\|B'(u)\|_*du\ll(\log Y)^{1/2}.        \tag{5.3}
\]

For the derivative of the oscillatory polynomial put

\[
 C_n(t)=i\{\vartheta'(t)-\log n\}B_n(t)+B_n'(t).   \tag{5.4}
\]

Equations (2.1) and (4.8) similarly give

\[
 \|C(t)\|_*\ll(\log Y)^{3/2},\qquad
 \int_Y^{2Y}\|C'(u)\|_*du\ll(\log Y)^{3/2}.       \tag{5.5}
\]

Apply (5.2) to (4.10) and its derivative.  Enlarging the integration
interval by one at each endpoint changes no order.  With
`ell_Y=log Y`,

\[
 \boxed{
 \begin{aligned}
 I_0&:=\int_{Y-1}^{2Y+1}|\mathcal E_{h_0}(t)|^2dt
       \ll Y\ell_Y,\\
 I_1&:=\int_{Y-1}^{2Y+1}|\mathcal E_{h_0}'(t)|^2dt
       \ll Y\ell_Y^3.
 \end{aligned}}                                    \tag{5.6}
\]

These are the promised two-branch filtered `L^2/H^1` estimates.  The
first line is where the fixed Nyquist margin saves the two powers of `L`
lost by absolute summation.

## 6. Stability under nearest-integer rounding

Let `mathcal E_h(t)` denote (2.10) at the exact rounded spacing (2.8).
Equations (2.9) and (4.9) show that every retained AFE coefficient changes
by

\[
 |B_n(t;h(t))-B_n(t;h_0(t))|
 \ll {1\over t}\left(1+{n\over\sqrt t}\right)^{-B}. \tag{6.1}
\]

The trivial sum over `n<=T_0=Y^(3/5)`, followed by the rapidly decaying
AFE and endpoint tails, therefore gives the uniform pointwise comparison

\[
 \boxed{
 |\mathcal E_h(t)-\mathcal E_{h_0}(t)|
 \ll Y^{-1}T_0^{1/2}+Y^{-10}
 \ll Y^{-7/10}.}                                   \tag{6.2}
\]

The discontinuous nearest-integer staircase is used only in the exact
sample on the left of (6.2); no derivative of that staircase is taken.
This is why the smooth inverse was separated from rounding.

## 7. Multiplicity-safe zero sampling and all logarithms

Let

\[
 \mu_Y=\sum_{Y<\gamma\leq2Y}\nu_\gamma
 \delta_{\gamma+\delta_Y}.                         \tag{7.1}
\]

The Riemann--von Mangoldt formula, including algebraic multiplicity,
implies for `r=1/ell_Y`

\[
 M_Y:=\sup_u\mu_Y([u-r,u+r])\ll\ell_Y.             \tag{7.2}
\]

For every `F in H^1` the one-dimensional point-evaluation inequality is

\[
 |F(x)|^2\leq {1\over2r}\int_{x-r}^{x+r}|F(u)|^2du
 +2\int_{x-r}^{x+r}|F(u)F'(u)|du.                  \tag{7.3}
\]

Sum (7.3) against (7.1).  Every integration point is covered with total
multiplicity at most `M_Y`; Cauchy--Schwarz gives

\[
 \int |F|^2d\mu_Y
 \ll M_Y\{r^{-1}\|F\|_2^2+\|F\|_2\|F'\|_2\}.    \tag{7.4}
\]

Apply (7.4) to `F=mathcal E_(h_0)`, use (5.6), and then use (6.2) and
`mu_Y(R)<<Y*ell_Y`.  Every logarithm is now visible:

\[
 \begin{aligned}
 \sum_{Y<\gamma\leq2Y}\nu_\gamma
 |\mathcal E_h(t_\gamma)|^2
 &\ll \ell_Y\{\ell_Y(Y\ell_Y)
       +(Y\ell_Y)^{1/2}(Y\ell_Y^3)^{1/2}\}+o(1)\\
 &\boxed{\ll Y\ell_Y^3.}
 \end{aligned}                                      \tag{7.5}
\]

No zero separation or simplicity hypothesis was used.

## 8. Gonek pigeonhole and same-ordinate `PW1+NY`

The exact dyadic subtraction in the frozen Gonek pair gives, for
`x=1/4`,

\[
 \boxed{
 \sum_{Y<\gamma\leq2Y}\nu_\gamma|Z(t_\gamma)|^2
 =W(1/4){Y\over2\pi}\log^2Y+O(Y\log Y),
 \quad W(1/4)=1-{8\over\pi^2}>0.}                 \tag{8.1}
\]

For the exact adaptive lattice belonging to one `gamma`, write `e_gamma`
for its first normalized endpoint and `e_(gamma,+)` for the adjacent one
on the **same** lattice.  The exact recurrence is

\[
 -Z(t_\gamma)=e_\gamma+r_\gamma e_{\gamma,+},
 \qquad r_\gamma={A(t_\gamma+h_\gamma)\over A(t_\gamma)}>0. \tag{8.2}
\]

The minus sign is forced by (2.3) and cancels in every squared formula.
Put

\[
 Q_\gamma=|e_\gamma|^2+r_\gamma^2|e_{\gamma,+}|^2.
 \tag{8.3}
\]

Since `r_gamma*e_(gamma,+)=-Z(t_gamma)-e_gamma`,

\[
 Q_\gamma\leq3|e_\gamma|^2+2|Z(t_\gamma)|^2.      \tag{8.4}
\]

Equations (7.5), (8.1), and (8.4) give

\[
 \sum_{Y<\gamma\leq2Y}\nu_\gamma Q_\gamma
 \ll Y\ell_Y^3
 \ll\ell_Y\sum_{Y<\gamma\leq2Y}\nu_\gamma
 |Z(t_\gamma)|^2.                                  \tag{8.5}
\]

Weighted pigeonholing with the nonnegative weights
`nu_gamma*|Z(t_gamma)|^2` selects one ordinate for which

\[
 Z(t_\gamma)\ne0,\qquad
 \boxed{Q_\gamma\leq C\ell_Y|Z(t_\gamma)|^2.}     \tag{8.6}
\]

Since `L_gamma asymp ell_Y`, this is exactly (0.4)--(0.5), including the
strict positivity part of singleton `NY`.

It remains to check that the **same** ordinate gives `PW1`.  Uniformly for
all `gamma in (Y,2Y]`, its selected-zero coordinate is

\[
 y_{\gamma,Y}={t_\gamma-\gamma\over h_\gamma}
 =x{L_\gamma\over\log(2Y/(2\pi))}\longrightarrow {1\over2}. \tag{8.7}
\]

Use the fixed compact profile which equals one near `+/-1/2`.  The
selected ordinate is noncarrier for large `Y`, and its own nonnegative
row gives

\[
 S_{m_\gamma}^{\rm ph}
 \geq {\sin^2(\pi y_{\gamma,Y})\over y_{\gamma,Y}^2}
 =4+o(1).                                           \tag{8.8}
\]

Because the ordinate selected in (8.6) has `Z(t_gamma)!=0`, equations
(8.7)--(8.8) prove `PW1(J)` for every fixed `kappa<4` on that same
singleton.  Combining the weighted singleton form of the adjacent theorem
with (8.6) cancels the one common factor `A(t_gamma)^2` and proves

\[
 {D_n^{\rm id}\over|e_n|^2}
 \geq{\kappa\over18C\ell_Y}h_\gamma^{-2}
 \geq c_\kappa L_\gamma                            \tag{8.9}
\]

for some `n in {m_gamma,m_gamma+1}`, subject to the declared zero-endpoint
alternative.  This is (0.6).

## 9. Why the weighted dyadic formula is not proved

The predecessor's proposed dyadic formula (6.8) inserts
`A(t_gamma)^2` before pigeonholing.  Here

\[
 A(t)^2\asymp t^{7/2}e^{-\pi t/2}.                 \tag{9.1}
\]

Across `(Y,2Y]` this weight localizes the sum to a fixed physical
neighborhood of the lower endpoint.  Gonek's global error
`O(Y log Y)` does not give a lower bound for the shifted Hardy mass in
every such fixed interval.  Therefore (8.5) neither states nor implies
the `A_m^2`-weighted formula (6.8).

The unweighted estimate is nevertheless sufficient.  It first selects
one ordinate.  Only after that selection is its singleton inequality
multiplied by `A(t_gamma)^2`; the common scalar then cancels exactly in
the adjacent quotient.  No illicit comparison of exponentially different
dyadic envelopes occurs.

## 10. Stopping line

The adaptive arithmetic intersection `PW1+NY` is closed on a cofinal
RH-conditional family, with the explicit loss `C_E=O(L)`.  What remains
is analytically separate:

1. operator-relative transfer of both adjacent ideal endpoints and rows
   through the actual finite-prolate Stokes interface;
2. intersection of the energy-selected member of the adjacent pair with
   every finite strict gate;
3. any return from the adaptive nearest-integer family to the literal
   ceiling schedule.

Until those obligations are proved at the same parameter, (8.9) is an
ideal arithmetic quotient only.  It is not a checkpoint-level RH result.
