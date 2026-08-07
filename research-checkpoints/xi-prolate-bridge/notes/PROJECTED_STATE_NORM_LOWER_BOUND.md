# Projected-state norm lower bound and normalized odd-scale shift

## 1. Claim boundary

This note closes one normalization issue left open after the hybrid
outer-sampling theorem.  On every schedule for which the already-proved
source comparison and Fourier projection errors tend to zero, the norm

\[
 a_{\lambda,N}=\|P_N k_\lambda^+\|_2
\]

converges to the norm of the fixed, source-normalized limiting arithmetic
state.  That limit is strictly positive.  Consequently the source-locked
estimate

\[
 \epsilon_\lambda=\|R_\lambda\|_{\mathfrak Z}^2=o(d_6)
\]

also gives

\[
 U_Z={\epsilon_\lambda\over a_{\lambda,N}^2}=o(d_6)
\]

on the locked exponential schedule.

This is only a scalar-shift theorem.  It proves no signed even or odd floor,
no finite Schur-complement sign, no graph-dual residual-action estimate, no
instance of equation (5.2) of `DIRECT_RH_ATTACK.md`, no locally uniform
determinant convergence, and no Riemann-hypothesis conclusion.  The project
terminal state remains `P0_INVALIDATED`.

## 2. Locked states and the existing comparison bound

Put

\[
 h(x)={\pi\over2}x^2(2\pi x^2-3)e^{-\pi x^2},\qquad
 K(s)=E(h)(e^s),qquad
 E(f)(u)=u^{1/2}\sum_{m\geq1}f(mu).                         \tag{2.1}
\]

For the source-normalized, zero-extended finite combination `h_lambda`, let

\[
 f_\lambda(s)=k_\lambda^+(e^s),\qquad
 I_\lambda=[-\log\lambda,\log\lambda].                    \tag{2.2}
\]

The state-invisible origin correction used for the global radical is
supported in `|x|<1/(2 lambda)`.  Every arithmetic sample on
`[lambda^(-1),lambda]` misses that support.  Hence it leaves `f_lambda`, its
evenization, `P_N f_lambda`, and `a_(lambda,N)` exactly unchanged.

Retain the exact quantities from `notes/PROJECTION_RATE_THEOREM.md`:

\[
\begin{aligned}
 A_\lambda&=h(\lambda)
 ={\pi\over2}\lambda^2(2\pi\lambda^2-3)e^{-\pi\lambda^2},\\
 I_\lambda^{h}&={\pi\over2}\lambda^3e^{-\pi\lambda^2},\\
 R_h(\lambda)^2
 &=(\lambda-\lambda^{-1})
       (A_\lambda^2+(I_\lambda^{h})^2)
   +4A_\lambda I_\lambda^{h}\log\lambda,                 \tag{2.3}\\
 \mathcal A_\lambda(\overline\delta)
 &=\overline\delta\sqrt{\lambda^3-\lambda}+R_h(\lambda),\\
 \mathcal F_{\lambda,N}
 &={C_*\log\lambda\over\pi(N+1)},
 \qquad C_*={3003\over500}.
\end{aligned}
\]

If `delta_lambda<=delta_bar`, the proved comparison and periodic Fourier
tail estimates are

\[
 \|f_\lambda-K\|_{L^2(I_\lambda)}
 \leq\mathcal A_\lambda(\overline\delta),\qquad
 \|(I-P_N)K\|_{L^2(I_\lambda)}
 \leq\mathcal F_{\lambda,N}.                               \tag{2.4}
\]

The rational value `C_*=6.006` is the admitted upper bound for
`||K'||_(L2(R))`; it is not a rounded point estimate.

## 3. A source-explicit positive lower bound for the limiting norm

For every integer `m>=1`, one has `2*pi*m^2-3>0`, and therefore

\[
 K(0)=\sum_{m\geq1}h(m)\geq h(1)=:
 H_*={\pi\over2}(2\pi-3)e^{-\pi}>0.                         \tag{3.1}
\]

Since `||K'||_2<=C_*`, one-dimensional Cauchy--Schwarz gives

\[
 |K(s)-K(0)|\leq C_*\sqrt{|s|}.                             \tag{3.2}
\]

Thus `K(s)>=H_*/2` whenever
`|s|<=(H_*/(2C_*))^2`.  Integrating on that symmetric interval proves the
fully explicit normalization-sensitive bound

\[
 \boxed{
 \|K\|_2\geq K_*:={H_*^2\over2\sqrt2\,C_*}>0.}             \tag{3.3}
\]

No zeta zero and no positivity of the Weil form is used here.  The factor in
(3.3) is tied to the locked source limit `h`; rescaling `h_lambda` changes
it.

## 4. Explicit tail of the limiting state

For `x>=1`,

\[
 0<h(x)\leq\pi^2x^4e^{-\pi x^2}.                            \tag{4.1}
\]

The summand `x^4 exp(-pi x^2)` decreases on `[1,infinity)`.  For `u>=1`, an
integral comparison, followed by
`exp(-pi*u^2*x^2)<=exp(-pi*(u^2-1))*exp(-pi*x^2)`, gives

\[
 \sum_{m\geq1}m^4e^{-\pi m^2u^2}
 \leq S_4e^{-\pi u^2},\qquad
 S_4=1+{e^\pi\Gamma(5/2,\pi)\over2\pi^{5/2}}.              \tag{4.2}
\]

Consequently

\[
 |K(\log u)|\leq\pi^2S_4u^{9/2}e^{-\pi u^2}.               \tag{4.3}
\]

Poisson summation gives `K(-s)=K(s)`.  Therefore the two omitted logarithmic
tails satisfy

\[
 \boxed{
 \|K\|_{L^2(\mathbb R\setminus I_\lambda)}
 \leq\mathcal T_\lambda
 :=\pi^2S_4
 \left({\Gamma(9/2,2\pi\lambda^2)
              \over(2\pi)^{9/2}}\right)^{1/2}.}             \tag{4.4}
\]

This is exponentially small and contains both inversion-reflected tails.

For a replay requiring only elementary directed interval functions, define

\[
 G_{1/2}(x)=e^{-x}x^{-1/2},\qquad
 G_{r+1}(x)=rG_r(x)+x^re^{-x}
 \quad(r=1/2,3/2,5/2,7/2).                                  \tag{4.5}
\]

The integral definition and the incomplete-gamma recurrence give
`Gamma(r,x)<=G_r(x)` at each displayed half integer.  Hence the completely
elementary enlargements

\[
 \overline S_4=1+{e^\pi G_{5/2}(\pi)\over2\pi^{5/2}},
 \qquad
 \overline{\mathcal T}_\lambda
 =\pi^2\overline S_4
 \left({G_{9/2}(2\pi\lambda^2)
              \over(2\pi)^{9/2}}\right)^{1/2}              \tag{4.6}
\]

satisfy `S_4<=overline S_4` and
`mathcal T_lambda<=overline mathcal T_lambda`.  The producer and independent
replay use (4.5)--(4.6), so they do not promote a point evaluation of an
incomplete gamma function to an interval.

## 5. Finite lower bound and asymptotic norm theorem

Extend `P_N f_lambda` by zero outside `I_lambda`.  The exact decomposition

\[
 P_Nf_\lambda-K
 =P_N(f_\lambda-K)
  +(P_NK-K)1_{I_\lambda}
  -K1_{\mathbb R\setminus I_\lambda}                       \tag{5.1}
\]

and orthogonal contractivity give an inside-window error at most
`mathcal A_lambda+mathcal F_(lambda,N)`.  The omitted limiting-state tail is
orthogonal to that inside-window error.  Hence

\[
 \left|a_{\lambda,N}-\|K\|_2\right|
 \leq\left(
   [\mathcal A_\lambda(\overline\delta)
      +\mathcal F_{\lambda,N}]^2
      +\overline{\mathcal T}_\lambda^2
 \right)^{1/2}.                                             \tag{5.2}
\]

Combining (3.3) and (5.2) yields the finite fail-closed lower bound

\[
 \boxed{
 a_{\lambda,N}\geq
 K_*-\left(
   [\mathcal A_\lambda(\overline\delta)
      +\mathcal F_{\lambda,N}]^2
      +\overline{\mathcal T}_\lambda^2
 \right)^{1/2}.}                                            \tag{5.3}
\]

A finite run may report a positive reserve only when the right side of
(5.3) is rigorously positive.  In particular, a decimal diagnostic for
`delta_lambda` is not an effective source enclosure and cannot be promoted
to such a run.

The pinned source Lemma 7.2 gives
`delta_lambda=O(lambda^(-2))` in the locked, fixed-`a4` normalization.  Hence
`mathcal A_lambda(delta_lambda)->0`.  If

\[
 {\log\lambda\over N(\lambda)+1}\longrightarrow0,          \tag{5.4}
\]

then (4.4), (5.2), and (5.4) prove

\[
 \boxed{
 a_{\lambda,N(\lambda)}\longrightarrow
 a_\infty:=\|E(h)(e^{\,\cdot})\|_{L^2(\mathbb R)}>0.}       \tag{5.5}
\]

This applies both to every fixed positive quadratic schedule
`N>=c*lambda^2` and to the locked exponential projection schedule.

The limit in (5.5) also gives an adversarial normalization regression.  The
source value is

\[
 \|h\|_2={\sqrt{33}\over2^{17/4}}\ne1.                     \tag{5.6}
\]

Replacing the required fixed-`a4` normalization by unit norm changes the
limit in (5.5) to

\[
 {a_\infty\over\|h\|_2}
 ={2^{17/4}\over\sqrt{33}}a_\infty,                         \tag{5.7}
\]

and must be rejected.  Positivity of the wrong limiting norm is not enough;
the scalar is part of the source convention.

## 6. Normalized hybrid-shift corollary

On the locked exponential schedule, (5.5) supplies a constant `c>0` and an
index after which `a_(lambda,N)>=c`.  The source-locked hybrid theorem gives

\[
 \epsilon_\lambda=o(d_6).                                  \tag{6.1}
\]

Therefore

\[
 \boxed{
 U_Z={\epsilon_\lambda\over a_{\lambda,N}^2}=o(d_6).}       \tag{6.2}
\]

Equation (6.2) proves that the normalized common Ritz upper shift is
negligible at the first fixed odd defect scale.  It does not prove the
unshifted odd lower bound `Q_- >= c*d_6`, so it does not establish
`omega>U_Z`.  It likewise supplies no even-complement signed comparison and
no graph-dual action estimate.  Those are the remaining operator-level
obligations.
