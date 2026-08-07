# Compact BV absolute sampling and the complete remainder bound

## 1. Claim boundary

This note proves the previously missing absolute zero-sampling estimate for
the compact log-Fourier projection remainder.  Combined with the admitted
physical-outer sampling theorem, it gives an explicit absolute-sampling bound
for the complete radical remainder at scale `O(lambda^7 d_4)` on the locked
exponential schedule.

The proof uses only the pinned analytic zero count, ordinary submean and
Plancherel, real-variable bounded variation, and the already admitted
defect-relative projection theorem.  It uses no zero list, no assertion that
a zero parameter is real, and no positivity of the Weil form.

This closes only hypothesis (3.4) of
`notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md`.  Uniform source-window Bessel
bounds, the reciprocal defect sum, both shifted-sector comparisons, equation
(5.2), and locally uniform determinant convergence remain open.  The formal
repository state remains `P0_INVALIDATED`.

All source and formula dependencies are pinned in
`COMPACT_ABSOLUTE_SAMPLING_SOURCE_LOCK.json`.

## 2. A compact BV sampling theorem

Put

\[
 \ell=\log\lambda,
 \qquad r_\lambda={1\over4(1+\ell)},
 \qquad w(x)=\log(2+|x|),                                  \tag{2.1}
\]

and let `f` be a real BV function supported in `[-ell,ell]`, with zero
extension outside that interval.  Write

\[
 E=\|f\|_2,
 \qquad V=\operatorname {TV}_{\mathbb R}(f),
 \qquad F(z)=\int_{\mathbb R}f(t)e^{-izt}\,dt.              \tag{2.2}
\]

For a nontrivial zero `rho=beta+i gamma`, retain

\[
 s_\rho=\gamma+i(1/2-\beta)
\]

without assuming `Im(s_rho)=0`, and define the positive sampling seminorm

\[
 \|f\|_{\mathfrak Z}^2
 =\sum_\rho\left(|F(s_\rho)|^2
                 +|F(\overline{s_\rho})|^2\right).         \tag{2.3}
\]

The transform of a compact function is entire, so the disks of radius
`r_lambda` need not remain inside the Mellin strip.  They lie in

\[
 |\operatorname {Im}z|\le {1\over2}+r_\lambda.              \tag{2.4}
\]

Let

\[
 T_0=30610046000,
 \qquad U=2(T_0+1)=61220092002,                              \tag{2.5}
\]

\[
 M(t)={t\over2\pi}\log{t\over2\pi e},
 \quad
 R(t)=0.103787\log t+0.257297\log\log t+9.367419,           \tag{2.6}
\]

\[
 Z_{\rm finite}=1+M(U)-{1\over8}+R(U),                      \tag{2.7}
\]

and

\[
 C_Z=1+{1\over\pi}
       +2(0.103787+0.257297)+2(9.367419).                    \tag{2.8}
\]

The locked HSW count shows, separately on each height sign, that the number
of disk centers above a point with real coordinate `x` is at most

\[
 Z_{\rm finite}+C_Zw(x).                                    \tag{2.9}
\]

Indeed, the finite branch is bounded by the total count at `U`.  In the
analytic branch the center ordinates occupy an interval of length
`2r_lambda<1`; equations (4.4)--(4.5) of
`notes/ZERO_SAMPLING_SOURCE_AUDIT.md` give
`1+pi^(-1)log B+2R(B)`, and every constant or `log log B` term is bounded by
its displayed coefficient times `log B` for `B>=T_0`.  Increasing `B` to
`2+|x|` gives (2.9).

For `|y|<=1/2+r_lambda`, put `g_y(t)=e^(yt)f(t)`.  Product variation and
Cauchy--Schwarz give

\[
 \|g_y\|_2^2\le \sqrt e\,\lambda E^2,                      \tag{2.10}
\]

\[
 \operatorname {TV}(g_y)
 \le e^{(1/2+r_\lambda)\ell}
 \left(V+{3\over4}\sqrt{2\ell}\,E\right).                 \tag{2.11}
\]

Here `2 r_lambda ell<=1/2` and `1/2+r_lambda<=3/4` for
`lambda>=2`.  If `E>0`, define

\[
 H=\max\left\{1,
 {\left(V+(3/4)\sqrt{2\ell}\,E\right)^2\over E^2}
 \right\}.                                                  \tag{2.12}
\]

Angular Plancherel controls `|x|<=H`.  On the complement, Stieltjes
integration by parts gives

\[
 |F(x+iy)|\le {\operatorname {TV}(g_y)\over |x|}.            \tag{2.13}
\]

The elementary integral

\[
 2\int_H^\infty{\log(2+x)\over x^2}\,dx
 \le {2(\log(H+2)+1)\over H}                               \tag{2.14}
\]

therefore proves

\[
 \int_{\mathbb R}w(x)|F(x+iy)|^2\,dx
 \le2\sqrt e\,\lambda E^2
 \left((\pi+1)\log(H+2)+1\right).                          \tag{2.15}
\]

Apply submean on every disk.  The factor four below keeps both height signs
and both evaluations in (2.3); multiplicity is already included in (2.9):

\[
 \|f\|_{\mathfrak Z}^2
 \le {4\over\pi r_\lambda^2}
 \int_{-1/2-r_\lambda}^{1/2+r_\lambda}
 \int_{\mathbb R}
   \left(Z_{\rm finite}+C_Zw(x)\right)|F(x+iy)|^2\,dx\,dy.
                                                                  \tag{2.16}
\]

Since `1+2r_lambda<=3/2`, equations (2.10), (2.15), and (2.16) give the
fully explicit theorem

\[
\boxed{
 \|f\|_{\mathfrak Z}^2
 \le192\sqrt e\,\lambda(1+\log\lambda)^2E^2
 \left[
 Z_{\rm finite}+{C_Z\over\pi}
 \left((\pi+1)\log(H+2)+1\right)
 \right].}                                                  \tag{2.17}
\]

If `E=0`, both sides are zero.  Equation (2.17) is a positive sequence
estimate, not Weil-form Cauchy--Schwarz.

## 3. Explicit insertion for the projection remainder

Use the locked half-integer schedule

\[
 \lambda_j=j+{1\over2},
 \qquad
 N_j=2^{2400(2j+1)^2},
 \qquad j\ge2.                                              \tag{3.1}
\]

Let `P_lambda` denote the compact log-Fourier projection remainder of the
actual source-normalized `0/4` state.  Put

\[
 a_4={\sqrt3\over2^{11/4}},
 \qquad A_\lambda=a_4(1+2\sqrt2\lambda),                    \tag{3.2}
\]

\[
 V_*(\lambda)
 =4\lambda(2\pi\lambda^2+1/2)
   +16\sqrt2\pi\lambda^2.                                  \tag{3.3}
\]

The admitted circular-BV theorem and `d_0<=d_4<=1/2` give

\[
 \operatorname {TV}_{\rm circle}(K_\lambda)
 \le A_\lambda V_*(\lambda).                               \tag{3.4}
\]

For a circle-BV function with variation `V_K`, equation (3.1) of
`notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md` gives
`|c_r|<=sqrt(L)V_K/(2pi|r|)`.  Parseval and Cauchy--Schwarz therefore give

\[
 \|(P_NK)'\|_2^2
 \le {2NV_K^2\over L},
 \qquad
 \operatorname {TV}_{\rm circle}(P_NK)
 \le\sqrt L\,\|(P_NK)'\|_2,
\]

and hence

\[
 \operatorname {TV}_{\rm circle}(P_NK)\le V_K\sqrt{2N}.    \tag{3.5}
\]

The tail `(I-P_N)K` is real and has circle mean zero.  Its endpoint traces
are therefore bounded by its circular variation, so zero extension adds at
most twice that variation.  Thus

\[
\boxed{
 V_P:=\operatorname {TV}_{\mathbb R}(P_\lambda)
 \le3A_\lambda V_*(\lambda)(1+\sqrt{2N_j}).}                \tag{3.6}
\]

Retain the exact relative terms from equations (6.1)--(6.2) of the defect
projection theorem.  With

\[
 A={160\pi\log96\over\log2},
 \qquad M_*=4800\log2-A>0,                                  \tag{3.7}
\]

\[
 C_\lambda={\sqrt{2\log\lambda}\over\pi\sqrt2},            \tag{3.8}
\]

put

\[
\begin{aligned}
 R_{\rm bulk}
 &=C_\lambda\,4\lambda(2\pi\lambda^2+1/2)
   {96^{5/2}\over\sqrt6}e^{-M_*\lambda^2},\\
 R_{\rm jump}
 &=C_\lambda\,32\pi\lambda^2
   e^{-4800(\log2)\lambda^2},\\
 R_{\rm proj}&=R_{\rm bulk}+R_{\rm jump}.
\end{aligned}                                               \tag{3.9}
\]

Then

\[
 \|P_\lambda\|_2
 \le\sqrt{d_4}\,A_\lambda R_{\rm proj}.                  \tag{3.10}
\]

The same admitted theorem gives

\[
 d_4\ge d_{\rm low}
 =6\,96^{-5-(320\pi/\log2)\lambda^2}.                      \tag{3.11}
\]

Define the completely explicit quantities

\[
 W_P=3A_\lambda V_*(\lambda)(1+\sqrt{2N_j})
     +{3\over4}\sqrt{2\log\lambda}\,A_\lambda R_{\rm proj},
                                                                  \tag{3.12}
\]

\[
 H_P=\max\left\{1,
 {W_P^2\over d_{\rm low}(A_\lambda R_{\rm proj})^2}
 \right\},
 \qquad
 \overline w_P=\log3+\log H_P.                             \tag{3.13}
\]

Since `H_P>=1`, `log(H_P+2)<=overline w_P`.  Equations (3.6),
(3.10), and (3.11) can be inserted into (2.17), but this insertion is not
an assumption that the unknown ratio `V_P/||P_lambda||_2` is bounded by a
ratio of upper bounds.  The required monotonicity is elementary.  For
`a>=0`,

\[
 \Phi_a(x)=x\log\left(2+\max\{1,a/x\}\right),\qquad x>0,
\]

is increasing.  On `x<=a`, with `t=a/x`,

\[
 \Phi_a'(x)=\log(2+t)-{t\over2+t}\ge\log2>0.              \tag{3.14}
\]

Indeed the displayed left side is increasing in `t>=0`, with value `log 2`
at zero.  On `x>=a` the derivative of `Phi_a` is `log 3`, and the two formulas agree at
`x=a`.

Put `x=||P_lambda||_2^2`,
`X=d_4(A_lambda R_proj)^2`, and let `W_P` be (3.12).  Then
`0<=x<=X`, while

\[
 \left(V_P+{3\over4}\sqrt{2\log\lambda}\sqrt{x}\right)^2
 \le W_P^2.
\]

Applying the monotonicity first in the second argument and then in `x`
gives

\[
 x\log\left(2+\max\left\{1,
 {\left(V_P+(3/4)\sqrt{2\log\lambda}\sqrt{x}\right)^2\over x}
 \right\}\right)
 \le X\log\left(2+\max\left\{1,{W_P^2\over X}\right\}\right).
                                                                  \tag{3.15}
\]

Finally `d_4>=d_low` and `H_P>=1` imply
`max{1,W_P^2/X}<=H_P`, and hence the last logarithm is at most
`log(3)+log(H_P)`.  This proves, without any lower bound on the actual
projection norm,

\[
\boxed{
 {\|P_\lambda\|_{\mathfrak Z}^2\over d_4}
 \le B_P(\lambda),}                                        \tag{3.16}
\]

where

\[
\boxed{
\begin{aligned}
 B_P(\lambda)
={}&192\sqrt e\,\lambda(1+\log\lambda)^2
       (A_\lambda R_{\rm proj})^2\\
 &\times\left[
 Z_{\rm finite}+{C_Z\over\pi}
 \left((\pi+1)\overline w_P+1\right)
 \right].
\end{aligned}}                                             \tag{3.17}
\]

Every term in (3.17) is finite and specified; there is no hidden `O(1)` in
the finite formula.

## 4. Asymptotic consequence and complete remainder

The exact positive margin `M_*>0`, together with the two explicit summands
in (3.9), gives the asymptotic comparison

\[
 A_\lambda R_{\rm proj}
 =O\!\left(e^{-M_*\lambda^2}
       \operatorname {poly}(\lambda,\sqrt{\log\lambda})\right).
                                                                  \tag{4.1}
\]

This `O` notation is used only to read the limit; the finite inequality is
the fully specified formula (3.17).

Although `V_P` contains `sqrt(N_j)`, equations (3.1), (3.11), and (3.13)
show only

\[
 \log H_P=O(\lambda^2).                                    \tag{4.2}
\]

Thus (3.17) implies
`B_P(lambda)=O(exp(-2M_* lambda^2)
poly(lambda,sqrt(log lambda)))`, and

\[
 \boxed{\|P_\lambda\|_{\mathfrak Z}^2=o(d_4).}             \tag{4.3}
\]

The pinned fixed-index prolate asymptotic gives
`d_4/d_8=O(lambda^(-8))`, so (4.3) also yields

\[
 \boxed{\|P_\lambda\|_{\mathfrak Z}^2=o(d_8).}             \tag{4.4}
\]

For the physical outer state, retain the positive sample-square estimates
before polarization in the proof of
`notes/OUTER_OUTER_SPECTRAL_THEOREM.md`.  In the low block, its equation
(4.2) is `64 Z_finite D_S(lambda)d_4` for one positive-height evaluation;
the two height signs and the two evaluations in the definition of
`||.||_mathfrak Z` give at most `256 Z_finite D_S(lambda)d_4`.  In each high
block, the corresponding one-evaluation estimate is `320 a_j D_S(lambda)d_4`;
the same fourfold bookkeeping gives `1280 a_j D_S(lambda)d_4`.  Hence the
slightly looser single constant `2C_spec` gives

\[
 \|O_\lambda\|_{\mathfrak Z}^2
 \le2C_{\rm spec}D_S(\lambda)d_4.                           \tag{4.5}
\]

Finally `R_lambda=O_lambda+P_lambda`.  The ordinary sequence triangle
inequality and (3.16), (4.5) prove

\[
\boxed{
 \|R_\lambda\|_{\mathfrak Z}^2
 \le d_4\left(4C_{\rm spec}D_S(\lambda)+2B_P(\lambda)\right)
 =O(\lambda^7d_4).}                                        \tag{4.6}
\]

This is the first complete absolute-sampling remainder bound for the
graph-dual program.  It does not bound arbitrary complementary source
windows.  The next exact obligation is the Bessel estimate (3.5) and
reciprocal sum (4.3) of
`notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md`.
