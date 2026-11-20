# Ideal Stokes alternating-Cauchy filter reduction

## 0. Exact outcome and claim boundary

Put

\[
 h={2\pi\over L},\qquad m=N+1,\qquad T=mh,
 \qquad t_k=T+kh.                                   \tag{0.1}
\]

For a proposed edge-tail amplitude `f_L`, define

\[
 a_k=(-1)^kf_L(t_k),\qquad
 E_m=\sum_{k\geq0}a_k,\qquad
 S_L(\Delta)=\sum_{k\geq0}{a_k\over\Delta+kh}.     \tag{0.2}
\]

The first result in this note is an exact Paley--Wiener model theorem.
If the normalized local tail has a positive exponential damping factor
and its frequency support stays a fixed distance below the alternating
Nyquist frequency, then, in squared-average norm,

\[
 \boxed{
 S_L(\Delta)={E_m\over\Delta}
   +O_{L^2}\!\left({h\over\Delta^2}E_m\right)}       \tag{0.3}
\]

uniformly for `delta<=Delta<=B`.  More precisely, the exceptional set
carries only `O(h^2)` of the endpoint-tail squared energy.  This is a
one-vector averaged statement.  It is not a pointwise lower frame for
arbitrary coefficient vectors.

For a zero row immediately below the first omitted carrier,
`gamma=T-Delta`, the exact Cauchy kernel gives

\[
 C_\gamma
 =-\frac T2\{S_L(\Delta)+\mathcal K_L(\Delta)\}.   \tag{0.4}
\]

Section 4 records explicit hypotheses under which the kernel correction,
the endpoint Stokes remainder, and the row Stokes remainder are small
relative to `E_m`.  Under those hypotheses, the good part of (0.3) yields
`|H_N/d_N|>=T/(16B)` on the fixed near-edge shell.

There is then a completely deterministic conditional closing lemma.
On a micro interval of `L`-length `A/T`, with `A>2`, one can keep a common
fixed zero window of width

\[
 W=B-\delta-{A\over2}+o(1).                         \tag{0.5}
\]

If `W>4*pi*0.103787`, the frozen HSW estimate supplies order `log(T)`
algebraic multiplicity in that common window.  Exact integration gives the
sharper limiting phase constant
`p_A=1/2-|sin(A/2)|/A`, which is at least `1/2-1/A`.  A uniform near-edge
amplitude bound on the same micro interval would therefore imply

\[
 (\eta_N^{\rm pr})^2=O_{A,B,\delta}(1/\log T)       \tag{0.6}
\]

at one point of a cofinal sequence.

Equation (0.6) is **conditional**.  The exact finite-`lambda` Stokes tail,
its positive slow multiplier, and relative endpoint and row remainders are
not proved here.  There is also a separate quantifier gap: an `E_m^2`-
typical statement over a long carrier average does not imply a uniform
statement, or even the required joint phase-amplitude statement, on one
`O(1/T)` micro interval.  Section 6 isolates the exact missing joint
one-vector inequality.

This is an unbound theorem-only continuation.  It adds no numerical zero
sample, no source lock, and no serialized artifact.  The standard eight
are unchanged.  It proves no decay of `eta_N^pr`, no actual arithmetic
sign, no new zeta-zero theorem, no RH implication or converse, and no de
Bruijn--Newman `Lambda` bound.  The formal state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly two frozen note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/HSW_CONTINUOUS_L_PHASE_SHELL_THEOREM.md | 49a53cb1f8ee6db85040cd39aa6faa4fff0296d8bb8b99b18e830efce63df70e |
| tests/test_hsw_continuous_l_phase_shell_theorem.py | 54e28858ad50a9b29578ff7719a2bb9818e02d7f275530a9da8cc15a023b6d9f |
| notes/ACTUAL_ENDPOINT_RATIONAL_VARIANCE_FAR_TAIL_BARRIER.md | 88965c9926092be319f83014408b689622911b1d27b5e5f266e2d7fb74e92644 |
| tests/test_actual_endpoint_rational_variance_far_tail_barrier.py | bd993af601bcddbd48ad077bd9b9c64f0cfb34ba2354b617de94f66029d0716c |

The first pair supplies the frozen HSW functions and the rule that a
phase theorem and an amplitude theorem must hold at the same `L`.  The
second supplies `d_N`, `H_N`, `D_N`, `S_0`, and

\[
 (\eta_N^{\rm pr})^2={d_N^2S_0\over D_N},\qquad
 S_0\leq C_{\mathfrak Z}<\infty.                    \tag{1.1}
\]

No statement below promotes the ideal tail to the actual finite prolate
state.

## 2. Exact alternating Paley--Wiener multiplier

Fix `alpha>0`, `0<epsilon<pi/2`, and `h>0`.  Let `g` be an `L^2(R)`
function whose Fourier transform is supported in `[-Omega,Omega]`, where

\[
 h\Omega\leq\pi-\epsilon.                           \tag{2.1}
\]

For `y>=0`, put

\[
 \mathscr E_y(x)=\sum_{k\geq0}(-1)^k
 e^{-(\alpha+y)kh}g(x+kh),\qquad
 \mathscr E=\mathscr E_0.                           \tag{2.2}
\]

The series converges in `L^2`.  Translation and the geometric series give
the exact Fourier multiplier

\[
 \widehat{\mathscr E_y}(\xi)
 =M_y(\xi)\widehat g(\xi),\qquad
 M_y(\xi)={1\over
  1+e^{-(\alpha+y)h+i\xi h}}.                       \tag{2.3}
\]

For `|xi*h|<=pi-epsilon`, elementary minimization over `0<=r<=1` gives

\[
 |1+re^{i\xi h}|\geq\sin\epsilon,
 \qquad |M_y(\xi)|\leq{1\over\sin\epsilon},
 \qquad |M_0(\xi)|\geq{1\over2}.                   \tag{2.4}
\]

Differentiating the multiplier gives

\[
 \left|{\partial M_y(\xi)\over\partial y}\right|
 ={h e^{-(\alpha+y)h}\over
  |1+e^{-(\alpha+y)h+i\xi h}|^2}
 \leq {h\over\sin^2\epsilon}.                     \tag{2.5}
\]

Now define the ideal Stieltjes tail

\[
 \mathscr S_\Delta(x)=\sum_{k\geq0}{(-1)^k
 e^{-\alpha kh}g(x+kh)\over\Delta+kh},
 \qquad \Delta>0.                                  \tag{2.6}
\]

The Laplace identity for the denominator and Fubini in `L^2` give

\[
 \mathscr S_\Delta(x)
 =\int_0^\infty e^{-\Delta y}\mathscr E_y(x)\,dy.  \tag{2.7}
\]

Put `mathscr R_Delta=mathscr S_Delta-mathscr E/Delta`.  Equations
(2.5)--(2.7) and Plancherel prove

\[
 \boxed{
 \|\mathscr R_\Delta\|_2
 \leq {2h\over\sin^2\epsilon\,\Delta^2}
       \|\mathscr E\|_2.}                          \tag{2.8}
\]

Indeed, the multiplier difference is bounded by
`h/(sin(epsilon)^2*Delta^2)` times `|g-hat|`, and (2.4) gives
`||g||_2<=2||mathscr E||_2`.  A second integration gives

\[
 \boxed{
 \|\partial_\Delta\mathscr R_\Delta\|_2
 \leq {4h\over\sin^2\epsilon\,\Delta^3}
       \|\mathscr E\|_2.}                          \tag{2.9}
\]

These are exact operator estimates; there is no asymptotic input.

## 3. Uniform `Delta` estimate and the energy-typical set

Fix `0<delta<B`.  Apply the one-dimensional Sobolev inequality in the
`Delta` variable to (2.8)--(2.9), and then integrate in `x`.  There is an
explicit finite constant depending only on `epsilon`, `delta`, and `B`
such that

\[
 C_{\epsilon,\delta,B}=
 {8\over(B-\delta)\sin^4\epsilon}
  \int_\delta^B{du\over u^4}
 +{32(B-\delta)\over\sin^4\epsilon}
  \int_\delta^B{du\over u^6}                       \tag{3.1}
\]

is admissible and

\[
 \boxed{
 \int_{\mathbb R}\sup_{\delta\leq\Delta\leq B}
 \left|\mathscr S_\Delta(x)-{\mathscr E(x)\over\Delta}
 \right|^2dx
 \leq C_{\epsilon,\delta,B}h^2
       \int_{\mathbb R}|\mathscr E(x)|^2dx.}        \tag{3.2}
\]

Define

\[
 \mathcal G_h=
 \left\{x:\sup_{\delta\leq\Delta\leq B}
 \left|\mathscr S_\Delta(x)-{\mathscr E(x)\over\Delta}
 \right|\leq{|\mathscr E(x)|\over2B}\right\}.     \tag{3.3}
\]

On its complement, `|mathscr E|^2` is at most `4B^2` times the squared
supremum in (3.2).  Hence

\[
 \boxed{
 \int_{\mathbb R\setminus\mathcal G_h}
 |\mathscr E(x)|^2dx
 \leq4B^2C_{\epsilon,\delta,B}h^2
 \int_{\mathbb R}|\mathscr E(x)|^2dx.}             \tag{3.4}
\]

At every `x` in `mathcal G_h` for which `mathscr E(x)` is nonzero,

\[
 \boxed{
 \left|{\mathscr S_\Delta(x)\over\mathscr E(x)}
 \right|\geq{1\over2\Delta}
 \qquad(\delta\leq\Delta\leq B).}                 \tag{3.5}
\]

Thus the ideal lower bound is uniform in the row offset but typical only
with respect to endpoint-tail squared energy.  Equations (3.2)--(3.5) do
not bound the Lebesgue measure of the exceptional set when `mathscr E`
can be very small.

The local Riemann--Siegel frequencies motivate (2.1): after removing the
positive gamma envelope, their absolute frequencies are at most
`(1/2)log(T/(2*pi))+o(1)`, while the locked edge has
`h=2*pi/L` and `log(T)=L/2+O(log L)`.  Formally this gives
`h*Omega=pi/2+o(1)`, well inside the forbidden alternating frequency
`pi`.  This observation does not prove that the actual finite-prolate
tail has the representation (2.2), nor that its prolate multiplier is
positive and slow at Stokes scale.

## 4. Exact near-edge kernel and relative remainder hypotheses

Return to (0.1)--(0.2), assume that the series defining `E_m`, `S_L`, and
the two series below are absolutely convergent, let `gamma=T-Delta`, and
set

\[
 C_\gamma(L)=\sum_{k\geq0}a_k
 {\gamma^2\over\gamma^2-(T+kh)^2}.                 \tag{4.1}
\]

There is an exact factorization

\[
 C_\gamma(L)=-{T\over2}
 \{S_L(\Delta)+\mathcal K_L(\Delta)\},             \tag{4.2}
\]

where

\[
 \mathcal K_L(\Delta)=
 \sum_{k\geq0}{a_k\over\Delta+kh}
 \left\{{2(T-\Delta)^2\over
 T(2T+kh-\Delta)}-1\right\}.                       \tag{4.3}
\]

For fixed `Delta` and `kh=o(T)`, the factor in braces is
`O((Delta+kh)/T)`.  Equation (4.3), rather than that local expansion, is
the binding formula.  A proof for the actual tail must control its whole
sum; absolute convergence alone does not provide a bound relative to a
possibly small `E_m`.

The exact finite-transform interface needed here is the existence of
remainders `r_0(L)` and `r_gamma(L)` such that

\[
 \begin{aligned}
 d_N&=q_L\{E_m+r_0\},\\
 H_N\!\left({\gamma L\over2\pi}\right)
 &=q_L\{C_\gamma+r_\gamma\},
 \qquad q_L=-{2(-1)^m\over\sqrt L}.
 \end{aligned}
                                                               \tag{4.4}
\]

Suppose, at one `L`, that `B>=1`, that `E_m` is nonzero, and, uniformly for
all rows
with `delta<=Delta<=B`,

\[
 \begin{aligned}
 \left|S_L(\Delta)-{E_m\over\Delta}\right|
 &\leq{|E_m|\over2B},\\
 |\mathcal K_L(\Delta)|&\leq\varepsilon_L|E_m|,\\
 |r_0|&\leq\varepsilon_L|E_m|,\\
 |r_\gamma|&\leq\varepsilon_LT|E_m|,
 \qquad 0\leq\varepsilon_L\leq{1\over16B}.
 \end{aligned}
                                                               \tag{4.5}
\]

Then (3.5), (4.2), and the triangle inequality give the conservative
bound

\[
 \boxed{
 \left|{H_N(\gamma L/(2\pi))\over d_N}\right|
 \geq {T\over16B}.}                                \tag{4.6}
\]

Indeed, the first line of (4.5) gives
`|S_L|>=|E_m|/(2B)`.  Hence
`|C_gamma+r_gamma|>=5*T*|E_m|/(32B)`, whereas
`|E_m+r_0|<=17*|E_m|/16`; their quotient is at least
`5*T/(34B)>T/(16B)`.  This also shows why the harmless restriction
`B>=1` was included.

The common scalar `q_L` cancels.  If `d_N=0` and `D_N>0`, the exact eta
quotient is already zero; (4.6) concerns the nonzero endpoint branch.

The current repository proves neither (4.4) with the relative bounds
(4.5) nor the ideal-tail premise behind the first line of (4.5).  In
particular, an absolute all-order endpoint estimate cannot be divided by
`E_m` without an independent lower or relative Stokes theorem.

## 5. Fixed-width HSW micro-window and conditional eta estimate

The frozen HSW estimate also has a fixed-width consequence.  For every
fixed `W>0`, its main term and two endpoint errors give

\[
 \mathcal N(Y+W)-\mathcal N(Y)
 \geq
 \left\{{W\over2\pi}-2(0.103787)+o(1)\right\}\log Y.
                                                               \tag{5.1}
\]

Thus define

\[
 B_{\rm HSW}=4\pi(0.103787)
 =1.3042259069\ldots .                              \tag{5.2}
\]

Every fixed interval of width `W>B_HSW` contains at least
`c_W*log(Y)` positive ordinates counted with algebraic multiplicity, for
all sufficiently large `Y`.

Fix constants

\[
 A>2,\qquad \delta>0,\qquad
 B>\delta+{A\over2}+B_{\rm HSW}.                    \tag{5.3}
\]

Let `I=[L_0,L_0+A/T_0]`, where `T_0` is the first-omitted-carrier scale at
the left endpoint.  Put

\[
 T_-:=\inf_{L\in I}T(L),\qquad
 T_+:=\sup_{L\in I}T(L).                            \tag{5.4}
\]

For completeness, put

\[
 X(L)=e^{L/2}L^3,\qquad
 G(L)=2\pi e^{L/2}L^2.                              \tag{5.5}
\]

Since `N(L)=ceil(X(L))`, `m=N+1`, and `T=2*pi*m/L`, the exact ceiling
enclosure is

\[
 G(L)+{2\pi\over L}\leq T(L)
 <G(L)+{4\pi\over L}.                              \tag{5.6}
\]

Moreover, `G'(L)/G(L)=1/2+2/L`.  Across `I`, (5.6) therefore gives

\[
 T_+-T_-\leq {A\over2}+o(1),\qquad
 T_\pm=T_0+O_{A}(1).                                \tag{5.7}
\]

There are `O_A(L_0)` ceiling jumps in `I`, each of physical size
`2*pi/L+o(1/L)`.  Thus the ceiling is not constant on the micro interval,
but its physical error in (5.6) is only `O(1/L)`.  All jumps are included
in the supremum and infimum in (5.4).  The common
physical interval

\[
 \mathcal J_0=(T_+-B,T_- -\delta]                  \tag{5.8}
\]

has width `w_0=B-delta-(T_+-T_-)`.  Define the strictly positive margin

\[
 q_0=B-\delta-{A\over2}-B_{\rm HSW}>0.             \tag{5.9}
\]

By (5.1), its total algebraic multiplicity `M_0` satisfies the precise
lower limit

\[
 \liminf_{L_0\to\infty}{M_0\over\log T_0}
 \geq {q_0\over2\pi}.                              \tag{5.10}
\]

Every ordinate in `mathcal J_0` has
`delta<=T(L)-gamma<=B` throughout `I`.  Direct integration, without a
zero-spacing or simplicity hypothesis, gives

\[
 {1\over|I|}\int_I\sin^2\!\left({\gamma L\over2}\right)dL
 \geq p_A+o(1),\qquad
 p_A={1\over2}-{|\sin(A/2)|\over A}
 \geq {1\over2}-{1\over A}>0.                     \tag{5.11}
\]

Indeed, the exact error from `1/2` is at most
`|sin(gamma*|I|/2)|/(gamma*|I|)`, while
`gamma*|I|=A+o(1)`.  If

\[
 W_{\mathcal J_0}(L)=
 \sum_{\gamma\in\mathcal J_0}
 {m_\gamma\sin^2(\gamma L/2)\over\gamma^2},       \tag{5.12}
\]

then `gamma/T_0=1+o(1)` uniformly in the fixed physical window, and
(5.10)--(5.11) give

\[
 \liminf_{L_0\to\infty}{T_0^2\over\log T_0}
 {1\over|I|}\int_IW_{\mathcal J_0}(L)\,dL
 \geq {p_Aq_0\over2\pi}.                           \tag{5.13}
\]

Assume now that the exact relative hypotheses (4.5), and hence (4.6),
hold for every `L` in `I` away from the measure-zero ceiling jumps and
exact-carrier crossings, and for every distinct noncarrier ordinate in
`mathcal J_0`, with algebraic weights retained.  At an exact carrier the
raw phase factor is zero, so no noncarrier amplitude condition is imposed;
the frozen carrier-continuous convention retains its nonnegative second-
moment limit.  Using only the common rows in the positive denominator and
(5.13) gives

\[
 {1\over|I|}\int_I{D_N(L)\over d_N(L)^2}\,dL
 \geq
 \left\{{p_Aq_0\over512\pi B^2}+o(1)\right\}
 \log T_0.                                         \tag{5.14}
\]

Consequently some `L` in `I` satisfies the same lower bound.  Equation
(1.1) then gives, on the strict branch,

\[
 \boxed{
 (\eta_N^{\rm pr})^2
 \leq {C_{A,B,\delta}\over\log T_0}.}              \tag{5.15}
\]

This proves the conditional implication from a uniform relative Stokes
theorem.  It does not prove that theorem.  The case `d_N=0<D_N` gives
`eta_N^pr=0` directly; `D_N=0` is outside the frozen strict quotient.

## 6. The quantifier gap and sharp missing one-vector inequality

Equation (3.4) says that the long-average exceptional set carries little
`E_m^2` energy.  It does **not** say that the exceptional set has small
Lebesgue measure, that every micro interval contains a good point, or that
the good amplitude points intersect the good phase points.  Conversely,
(5.11) is an unweighted phase average.  The product of these two separate
averages cannot be inserted into (5.14).

This remains true if one has an ordinary fourth-moment upper bound but no
quantitative small-value or joint estimate at the required micro scale.
The moving cutoff, the moving tail vector, and the moving common zero
window all have to be controlled at the same `L`.

The exact missing statement can be written without any uniform-row
hypothesis.  With the remainders in (4.4), put

\[
 \widetilde E_L=E_m+r_0,\qquad
 \widetilde C_{\gamma,L}=C_\gamma+r_\gamma.         \tag{6.1}
\]

A sufficient sharp local theorem is that on a cofinal sequence of common
micro windows, with a nonzero right-hand energy,

\[
 \boxed{
 \int_I|q_L|^2\sum_{\gamma\in\mathcal J_0}
 {m_\gamma\sin^2(\gamma L/2)\over\gamma^2}
 |\widetilde C_{\gamma,L}|^2\,dL
 \geq c\log T_0\int_I|q_L|^2
 |\widetilde E_L|^2\,dL.}                         \tag{6.2}
\]

The sum is over distinct ordinates with algebraic weights.  The displayed
`|q_L|^2` factors turn (6.2) exactly into
`integral(D_N)>=c*log(T_0)*integral(d_N^2)`, so some point satisfies the
desired quotient.  Omitting these factors would give an equivalent
`1+o(1)` statement on a micro interval, but not a literal identity.  This
is a one-vector joint Hardy--Cauchy inequality, not a frame bound for every
tail vector.

Neither the frozen HSW count, the ideal Paley--Wiener multiplier lemma,
nor their separate averages prove (6.2).  A successful continuation must
either prove the finite-`lambda` relative Stokes representation uniformly
on one micro interval, or prove (6.2) directly for the actual tail and
actual zeta rows.

## 7. Stopping point

The alternating filter itself is not the obstruction: below Nyquist its
Stieltjes damping is an `O(h)` perturbation in squared-average norm.  The
unresolved work is the actual finite-prolate Stokes transfer and the joint
micro-window quantifier.  No conclusion about `eta_N^pr` is drawn until
both are supplied on the same cofinal sequence.
