# Joint Hardy--Cauchy phase-energy nonconcentration barrier

## 0. Exact outcome and claim boundary

This note continues the checkpoint-1.43 ideal Stokes reduction.  It has
two exact purposes.

First, the fixed physical HSW micro-window has a phase-good subset of
explicit positive relative Lebesgue measure.  This is stronger than merely
knowing that the unweighted phase average is positive.  The remaining
arithmetic input can then be stated as one endpoint-energy
nonconcentration condition on that proved phase-good set.  Under the
conservative checkpoint-1.43 row bound

\[
 \left|{\widetilde C_{\gamma,L}\over\widetilde E_L}\right|
 \geq {T(L)\over16B},                               \tag{0.1}
\]

that condition implies the missing `q_L`-weighted joint Hardy--Cauchy
inequality with an explicit constant.  The sharp ideal asymptotic
`T/(2*Delta)` improves that constant by the expected factor `64`.  An
exact covariance identity gives an equivalent formulation of the
minimal weighted phase-energy gate.

Second, a local artificial source family shows why local density, real
zeros, Laguerre--Polya geometry, the correct Riemann--Siegel type, and a
positive slow multiplier do not prove the gate.  At the locked scale put

\[
 g_L(T+x)=
 \left({\sin(\beta x)\over\beta x}\right)^2
 \cos(\omega x),
 \qquad \omega={L\over4},
 \qquad \beta={1\over4}\log{T\over2\pi}-{L\over8}.
                                                               \tag{0.2}
\]

The simple cosine zeros lie on every other carrier and have zero boundary
phase at the central length.  The double sinc zeros supply exactly the
missing lower-order algebraic density.  Counting multiplicity, the total
local density and exponential type are both

\[
 {1\over2\pi}\log{T\over2\pi}
 \quad\hbox{and}\quad
 {1\over2}\log{T\over2\pi},                        \tag{0.3}
\]

respectively.  Thus `h*Omega=pi/2+o(1)`, not the Nyquist-saturating
`pi` of the checkpoint-1.43 cardinal annihilator.

The exact alternating multiplier preserves localization.  The identity

\[
 {\displaystyle\int_{\mathbb R}x^2
    \left({\sin(\beta x)\over\beta x}\right)^4dx
  \over
  \displaystyle\int_{\mathbb R}
    \left({\sin(\beta x)\over\beta x}\right)^4dx}
 ={3\over4\beta^2}                                  \tag{0.4}
\]

then makes the carrier-aligned part of the normalized joint energy
`O(beta^(-2)+h^2)`.  The algebraically counted double sinc zeros contribute
only `O(beta/L)`.  With `beta=(1/2+o(1))*log(L)`, the complete normalized
model contribution is

\[
 O\!\left({1\over\log^2L}+{\log L\over L}\right)=o(1).
                                                               \tag{0.5}
\]

This is a local continuous-edge model, not the actual Hardy `Z` source,
not the actual finite-`lambda` projected state, and not one global
HSW-compatible zeta divisor.  It neither disproves the actual arithmetic
nonconcentration gate nor transports itself through the locked ceiling
schedule as an actual source theorem.  It proves only that the listed
local structural data do not force the gate.

This is an unbound theorem/barrier pair after checkpoint 1.43.  It adds no
zero table, source lock, numerical source sample, or standard-eight edit,
and no serialized artifact.  It proves no actual joint inequality, no decay or
failure of `eta_N^pr`, no actual arithmetic sign, no new zeta-zero theorem,
no RH implication or converse, and no de Bruijn--Newman `Lambda` bound.
The formal state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly two frozen theorem/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/IDEAL_STOKES_ALTERNATING_CAUCHY_FILTER_REDUCTION.md | fb68a7b26abdbc938536c88c9e9780314c0d8b4fc794f24d69a0d4cd8b5a30d2 |
| tests/test_ideal_stokes_alternating_cauchy_filter_reduction.py | 696b74f6743aa7fbd6d1d784381386efc9b588cbd3e9d5eecbe57d822374d6b0 |
| notes/HSW_CONTINUOUS_L_PHASE_SHELL_THEOREM.md | 49a53cb1f8ee6db85040cd39aa6faa4fff0296d8bb8b99b18e830efce63df70e |
| tests/test_hsw_continuous_l_phase_shell_theorem.py | 54e28858ad50a9b29578ff7719a2bb9818e02d7f275530a9da8cc15a023b6d9f |

The ideal Stokes pair supplies the exact `q_L`-weighted target, the common
micro-window, the conservative row bound, and the sharp ideal
`T/(2*Delta)` scale.  The HSW pair supplies the multiplicity-aware counting
functions.  No source-rational pair is imported directly, and no actual
finite-`lambda` remainder theorem is assumed.

## 2. An explicit positive-measure phase-good set

Retain the constants and notation of the ideal Stokes theorem.  Thus

\[
 B_{\rm HSW}=4\pi(0.103787),
 \qquad
 A>2,
 \qquad
 B>\delta+{A\over2}+B_{\rm HSW},                    \tag{2.1}
\]

and

\[
 q_0=B-\delta-{A\over2}-B_{\rm HSW}>0,
 \qquad
 p_A={1\over2}-{|\sin(A/2)|\over A}>0.             \tag{2.2}
\]

For the common row interval `mathcal J_0`, let

\[
 M_0=\sum_{\gamma\in\mathcal J_0}m_\gamma,
 \qquad
 R_0(L)=\sum_{\gamma\in\mathcal J_0}
 m_\gamma\sin^2\!\left({\gamma L\over2}\right).  \tag{2.3}
\]

The sum is over distinct ordinates and `m_gamma` is algebraic
multiplicity.  The frozen count and exact phase integration give

\[
 \liminf_{L_0\to\infty}{M_0\over\log T_0}
 \geq {q_0\over2\pi},
 \qquad
 \liminf_{L_0\to\infty}{1\over|I|\log T_0}
 \int_I R_0(L)\,dL
 \geq c_-:={p_Aq_0\over2\pi}.                      \tag{2.4}
\]

The HSW upper estimate on an interval of width at most `B-delta` also
gives

\[
 \limsup_{L_0\to\infty}{M_0\over\log T_0}
 \leq c_+:={B-\delta\over2\pi}+2(0.103787).         \tag{2.5}
\]

Since `0<=R_0(L)<=M_0`, define the phase-good set

\[
 \mathcal G_0=
 \left\{L\in I:R_0(L)\geq {c_-\over2}\log T_0\right\}.
                                                               \tag{2.6}
\]

Splitting the integral in (2.4) over `mathcal G_0` and its complement,
and using (2.5), proves the explicit measure bound

\[
 \boxed{
 \liminf_{L_0\to\infty}{|\mathcal G_0|\over|I|}
 \geq {c_-\over2c_+-c_-}>0.}                       \tag{2.7}
\]

No zero-spacing or simplicity hypothesis enters this argument.  An exact
carrier has zero raw phase and is included with its algebraic weight.
Equation (2.7) is an unweighted Lebesgue-measure theorem; it says nothing
about where the endpoint energy is concentrated.

## 3. Minimal endpoint-energy nonconcentration gate

Use the exact checkpoint-1.43 remainder notation

\[
 \widetilde E_L=E_m+r_0,
 \qquad
 \widetilde C_{\gamma,L}=C_\gamma+r_\gamma,
 \qquad
 q_L=-{2(-1)^m\over\sqrt L},                        \tag{3.1}
\]

and define the nonnegative endpoint-energy density

\[
 w_L=|q_L|^2|\widetilde E_L|^2.                    \tag{3.2}
\]

The minimal additional arithmetic statement used in this section is:
there are a fixed `rho>0` and a cofinal sequence of the common micro
windows for which

\[
 \int_Iw_L\,dL>0,
 \qquad
 \boxed{
 \int_{\mathcal G_0}w_L\,dL
 \geq\rho\int_Iw_L\,dL.}                           \tag{3.3}
\]

This is the endpoint-energy nonconcentration gate, abbreviated `NC`.  It
is not proved by HSW, the ideal multiplier theorem, a separate second
moment, or (2.7).

On `mathcal G_0`, equation (2.6) and `NC` imply

\[
 \int_Iw_LR_0(L)\,dL
 \geq {\rho p_Aq_0\over4\pi}
       \log T_0\int_Iw_L\,dL.                      \tag{3.4}
\]

Assume additionally that the conservative row bound (0.1) holds at the
same noncarrier points.  Since every common row has `gamma<T(L)`,

\[
 {1\over\gamma^2}|\widetilde C_{\gamma,L}|^2
 \geq {1\over256B^2}|\widetilde E_L|^2.            \tag{3.5}
\]

Carrier crossings form a measure-zero subset of `I`; their exact
carrier-continuous second-moment contributions are nonnegative and may be
discarded in a lower bound.  Combining (3.4)--(3.5) proves

\[
 \boxed{
 \begin{aligned}
 &\int_I|q_L|^2\sum_{\gamma\in\mathcal J_0}
 {m_\gamma\sin^2(\gamma L/2)\over\gamma^2}
 |\widetilde C_{\gamma,L}|^2\,dL\\
 &\qquad\geq
 \left({\rho p_Aq_0\over1024\pi B^2}+o(1)\right)
 \log T_0\int_I|q_L|^2|\widetilde E_L|^2\,dL.
 \end{aligned}}                                    \tag{3.6}
\]

If instead the uniform sharp ideal relation

\[
 {\widetilde C_{\gamma,L}\over\widetilde E_L}
 =-{T(L)\over2\Delta_{\gamma,L}}\{1+o(1)\},
 \qquad
 \Delta_{\gamma,L}=T(L)-\gamma\in[\delta,B],      \tag{3.7}
\]

holds on the same energy, then (3.5) improves by a factor `64`.  The
constant in (3.6) becomes

\[
 \boxed{{\rho p_Aq_0\over16\pi B^2}.}              \tag{3.8}
\]

Equations (3.6) and (3.8) are conditional implications.  Neither `NC`
nor (3.7) is asserted for the actual source.

## 4. Equivalent covariance formulation

Put

\[
 \mathcal A_0(L)=
 \sum_{\gamma\in\mathcal J_0}m_\gamma e^{i\gamma L}.
                                                               \tag{4.1}
\]

There is an exact pointwise identity

\[
 R_0(L)={M_0-\operatorname {Re}\mathcal A_0(L)\over2}.
                                                               \tag{4.2}
\]

Consequently, for every nonnegative integrable `w_L`,

\[
 \boxed{
 \int_Iw_LR_0(L)\,dL
 ={1\over2}\left\{
 M_0\int_Iw_L\,dL
 -\operatorname {Re}\int_Iw_L\mathcal A_0(L)\,dL
 \right\}.}                                        \tag{4.3}
\]

Thus the normalized phase-energy gate

\[
 \int_Iw_LR_0(L)\,dL
 \geq\kappa M_0\int_Iw_L\,dL                      \tag{4.4}
\]

is exactly equivalent to the covariance gap

\[
 \boxed{
 \operatorname {Re}\int_Iw_L\mathcal A_0(L)\,dL
 \leq(1-2\kappa)M_0\int_Iw_L\,dL.}                \tag{4.5}
\]

The `NC` condition is one sufficient way to obtain such a gap
asymptotically: (2.5) and (3.4) permit every fixed

\[
 0<\kappa<{\rho c_-\over2c_+}.                      \tag{4.6}
\]

This formulation exposes the arithmetic content.  HSW bounds `M_0` and
the unweighted integral of `mathcal A_0`, but it does not bound the same
exponential sum against the moving actual endpoint energy.

## 5. Correct-type and correct-density local LP source

The rest of the note constructs the local structural countermodel.  For
large `L`, let

\[
 m=\left\lceil e^{L/2}L^3\right\rceil+1,
 \qquad
 h={2\pi\over L},
 \qquad
 T=mh,
 \qquad
 \ell_T=\log{T\over2\pi}.                           \tag{5.1}
\]

Set

\[
 \omega={L\over4},
 \qquad
 \beta={\ell_T\over4}-{L\over8},
 \qquad
 \Omega=\omega+2\beta={\ell_T\over2}.             \tag{5.2}
\]

Then `beta=(1/2+o(1))*log(L)>0`, and

\[
 h\Omega={\pi\ell_T\over L}={\pi\over2}+o(1)<\pi-\epsilon
                                                               \tag{5.3}
\]

for any fixed `epsilon<pi/2` and all sufficiently large `L`.

In the centered variable `x=t-T`, define

\[
 a_\beta(x)=
 \begin{cases}
 \left({\sin(\beta x)\over\beta x}\right)^2,&x\ne0,\\
 1,&x=0,
 \end{cases}
 \qquad
 g_L(T+x)=a_\beta(x)\cos(\omega x).                \tag{5.4}
\]

Both factors are real entire Laguerre--Polya functions.  Their product is
real entire Laguerre--Polya of order one and type `Omega`.  Its real zeros,
with algebraic multiplicity, are:

\[
 \begin{array}{ll}
 x=(2r+1)h,&r\in\mathbb Z,\quad\hbox{multiplicity one},\\
 x=n\pi/\beta,&n\in\mathbb Z\setminus\{0\},
                  \quad\hbox{multiplicity two}.
 \end{array}                                        \tag{5.5}
\]

At a collision the multiplicities add; no zero is deleted.  In every
fixed real interval `J` of length `W`, the algebraic count is

\[
 \begin{aligned}
 n_{g_L}(J)
 &= {W\omega\over\pi}+{2W\beta\over\pi}+O(1)\\
 &= {W\Omega\over\pi}+O(1)
  ={W\over2\pi}\log{T\over2\pi}+O(1).
 \end{aligned}                                      \tag{5.6}
\]

The factor `2` in the sinc contribution is its algebraic multiplicity,
not a second set of distinct ordinates.  Equation (5.6) is the local zeta
main density, including the `log(L)` correction at the locked scale.

The cosine zeros immediately below the edge are

\[
 \gamma_r=T-(2r+1)h.                                \tag{5.7}
\]

They are exact carriers at the central length:

\[
 {\gamma_rL\over2\pi}=m-(2r+1)\in\mathbb Z,
 \qquad
 \sin^2\!\left({\gamma_rL\over2}\right)=0.        \tag{5.8}
\]

Thus the leading-order `Theta(L)` algebraic mass in every fixed edge
window can be phase-aligned.  The double sinc zeros contribute only
`O(beta)=O(log(L))` algebraic mass there.

## 6. Exact alternating-filter localization

Fix `alpha>0` and define the translated alternating endpoint model

\[
 \mathscr E_L(x)=
 \sum_{k\geq0}(-1)^ke^{-\alpha kh}g_L(T+x+kh).
                                                               \tag{6.1}
\]

The series is absolutely convergent pointwise and in `L^2`.  With the
Fourier convention of the ideal Stokes note,

\[
 \widehat{\mathscr E_L}(\xi)
 =M(\xi)\widehat g_L(\xi),
 \qquad
 M(\xi)={1\over1+e^{-\alpha h+i\xi h}}.             \tag{6.2}
\]

The Fourier support of `a_beta` is contained in `[-2*beta,2*beta]`.
Consequently `g_L` is supported in two translates of that interval and
is contained in `[-Omega,Omega]`.  On this support,

\[
 |M(\xi)|\geq{1\over2},
 \qquad
 |M(\xi)|\leq{1\over\sin\epsilon},
 \qquad
 |M'(\xi)|\leq{h\over\sin^2\epsilon}.              \tag{6.3}
\]

The exact sinc moments are

\[
 \int_{\mathbb R}\left({\sin y\over y}\right)^4dy
 ={2\pi\over3},
 \qquad
 \int_{\mathbb R}y^2\left({\sin y\over y}\right)^4dy
 ={\pi\over2}.                                     \tag{6.4}
\]

For the second identity use
`sin^4(y)={4(1-cos(2y))-(1-cos(4y))}/8` and
`int_R (1-cos(a*y))/y^2 dy=pi*|a|`.  Since the Fourier
support of `a_beta^2` is in `[-4*beta,4*beta]` and
`2*omega>4*beta` eventually, the cross terms from `cos^2(omega*x)`
vanish exactly.  Therefore

\[
 {\|xg_L\|_2^2\over\|g_L\|_2^2}
 ={\|xa_\beta\|_2^2\over\|a_\beta\|_2^2}
 ={3\over4\beta^2}.                                \tag{6.5}
\]

Plancherel, (6.2), and differentiation in `xi` give

\[
 \boxed{
 {\|x\mathscr E_L\|_2^2\over\|\mathscr E_L\|_2^2}
 \leq {6\over\sin^2\epsilon\,\beta^2}
       +{8h^2\over\sin^4\epsilon}.}               \tag{6.6}
\]

Indeed, `||mathscr E_L||_2>=||g_L||_2/2`, while

\[
 \|x\mathscr E_L\|_2
 \leq {1\over\sin\epsilon}\|xg_L\|_2
      +{h\over\sin^2\epsilon}\|g_L\|_2.          \tag{6.7}
\]

Thus the alternating filter does not spread the endpoint energy beyond
the `1/beta` physical scale.  Multiplication by `W_lambda=1` already
satisfies positivity and
`|partial_t log(W_lambda)|=0=O(L^2/lambda)`.  More generally, the stated
slow logarithmic-derivative bound changes a fixed physical edge packet by
`1+o(1)`; it cannot itself provide the missing phase decorrelation.

## 7. The normalized joint model tends to zero

This section uses an affine continuous-edge micro model and makes no
claim about the ceiling staircase.  Fix `a>0` and offsets

\[
 0<a<\delta,
 \qquad
 \delta+a<B-a.                                      \tag{7.1}
\]

Let `x` range over `[-a,a]`, put

\[
 T_x=T+x,
 \qquad
 L_x=L+{2x\over T},                                 \tag{7.2}
\]

and retain the source and spacing from Sections 5--6.  Use all source
zeros in the fixed inner edge window

\[
 \Gamma_L=
 \{\gamma:g_L(\gamma)=0,\quad
             \delta+a\leq T-\gamma\leq B-a\},      \tag{7.3}
\]

with algebraic multiplicity.  Then
`delta<=T_x-gamma<=B` throughout the micro interval.

For each row define the exact ideal Cauchy tail

\[
 \mathscr C_{\gamma,L}(x)=
 \sum_{k\geq0}(-1)^ke^{-\alpha kh}g_L(T+x+kh)
 {\gamma^2\over\gamma^2-(T_x+kh)^2}.               \tag{7.4}
\]

The exact kernel factorization of the ideal Stokes note applies with
`Delta=T_x-gamma`.  Its Stieltjes remainder is `O(h)` in `L^2`, uniformly
for `delta<=Delta<=B`.  For this exponentially damped source, its kernel
correction also obeys

\[
 \|\mathcal K_L(\Delta)\|_2
 \leq {4\over(T-a)(1-e^{-\alpha h})}\|g_L\|_2.     \tag{7.5}
\]

To see (7.5), the exact factor in braces in the kernel correction,
divided by `Delta+kh`, has absolute value at most `4/T_x` for large `T`;
then use the `l^1` norm of the positive geometric translations.  After
division by `gamma`, (7.5) contributes
`O((T*h)^(-1))*||mathscr E_L||_2`.

For a cosine zero in (7.3), (5.8) and (7.2) give

\[
 \sin^2\!\left({\gamma L_x\over2}\right)
 =\sin^2\!\left({\gamma x\over T}\right)
 \leq x^2.                                         \tag{7.6}
\]

Equations (6.6), (7.5), (7.6), and the uniform Stieltjes estimate imply

\[
 \int_{-a}^a
 {\sin^2(\gamma L_x/2)\over\gamma^2}
 |\mathscr C_{\gamma,L}(x)|^2dx
 \leq C_{\alpha,\epsilon,\delta,B,a}
 \left(\beta^{-2}+h^2+(Th)^{-2}\right)
 \|\mathscr E_L\|_2^2.                             \tag{7.7}
\]

There are `Theta(L)` such cosine rows.  For every sinc row, the elementary
operator upper bound gives instead

\[
 \int_{-a}^a
 {\sin^2(\gamma L_x/2)\over\gamma^2}
 |\mathscr C_{\gamma,L}(x)|^2dx
 \leq C_{\alpha,\epsilon,\delta,B,a}
 \|\mathscr E_L\|_2^2.                             \tag{7.8}
\]

There are `O(beta)` sinc positions in (7.3), each counted twice.  If a
sinc zero collides with a cosine zero, adding its two sinc copies to its
one cosine copy is exactly the algebraic multiplicity convention.

Finally, (6.6) and Chebyshev give

\[
 \int_{-a}^a|\mathscr E_L(x)|^2dx
 =\{1-o(1)\}\|\mathscr E_L\|_2^2.                  \tag{7.9}
\]

Summing (7.7)--(7.8), retaining every algebraic copy, and using
`log(T)=(1/2+o(1))*L`, proves

\[
 \boxed{
 {\displaystyle
  \int_{-a}^a\sum_{\gamma\in\Gamma_L}
  {m_\gamma\sin^2(\gamma L_x/2)\over\gamma^2}
  |\mathscr C_{\gamma,L}(x)|^2dx
  \over
  \displaystyle
  \log T\int_{-a}^a|\mathscr E_L(x)|^2dx}
 \ll
 \beta^{-2}+h^2+(Th)^{-2}+{\beta\over L}.}         \tag{7.10}
\]

Since `beta=(1/2+o(1))*log(L)`, the right side is

\[
 O\!\left({1\over\log^2L}+{\log L\over L}\right)=o(1).
                                                               \tag{7.11}
\]

The affine change `dL_x=2*dx/T` and any constant positive `q` weight
cancel from the ratio.  Equation (7.10) is therefore a literal
Lebesgue-measure one-vector joint estimate in the local continuous-edge
model.  It is not a transport through the discontinuous locked ceiling,
and `g_L` changes with the scale `L`; these limitations are part of the
claim.

## 8. Arithmetic stopping point

On the physical micro-coordinate, the phase `exp(i*gamma*L)` has local
frequency approximately `2`.  The filtered Riemann--Siegel polynomial has
difference frequencies `log(m/n)` spanning that value.  Therefore an
ordinary Montgomery--Vaughan diagonalization has no frequency gap on a
fixed physical interval.  Enlarging to a moving mesoscopic edge does not
by itself fix the quantifiers: after interchanging the zero sum and the
edge integral, each zero is still tested only while it lies in one fixed
physical window of length `B-delta`.

In normalized zero-spacing variables the phase corresponds to form-factor
frequency

\[
 \alpha={L\over\log T}=2+o(1).                     \tag{8.1}
\]

Thus even an unweighted attack naturally reaches the unproved strong
pair-correlation range beyond the classical `|alpha|<1` theorem.  The
actual target is stronger still because it weights that zero exponential
sum by one moving Hardy endpoint energy.  A mixed strong-pair-correlation
or direct endpoint-energy nonconcentration theorem such as (3.3), (4.4),
or (4.5) is genuinely new arithmetic input.

The local LP family proves no failure for the actual Hardy source.  It
does show that replacing this mixed arithmetic statement by real-zero
geometry, correct density/type, HSW counting, a positive slow multiplier,
or separate phase and amplitude averages is invalid.  The project remains
fail-closed at this gate.
