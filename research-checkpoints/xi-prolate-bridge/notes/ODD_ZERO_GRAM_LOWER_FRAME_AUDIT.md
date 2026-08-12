# Odd zero-Gram lower-frame audit

## 0. Scope and outcome

This note asks whether the all-critical-line form of the odd zero-evaluation
Gram supplies a quantitative lower frame on the polynomial schedule

\[
 L=2\log\lambda,
 \qquad N=\lceil\lambda L^3\rceil .
\]

The answer from the currently pinned zero data is negative at the required
relative scale.  There is an exact Cauchy-minor lower bound, recorded below,
but it needs quantitatively well-conditioned distinct ordinates and their
phases relative to the carrier lattice `2*pi*Z/L`.  The pinned zero count
retains algebraic multiplicity.  It does supply a coarse linearly large
one-separated subset, as proved subsequently in
`notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md`, but it does not supply
carrier-scale separation or conditioning.  In fact, one fixed all-critical
carrier-lattice multiset can satisfy the same `T log T+O(log T)` counting
bound while making the odd sampling Gram singular on an infinite sequence
of logarithmic lengths.  This is a logical countermodel to a count-only
argument, not a model of the zeta function.

The exact surviving target is a relative lower sampling theorem stronger
than the projected-state sampling energy.  No such theorem, shifted odd
floor, equation (5.2), determinant convergence, or Riemann-hypothesis
conclusion is proved here.  No zero list is used.

## 1. Exact odd sampling matrix on the target branch

Put

\[
 \alpha={2\pi\over L},
 \qquad
 e_n^-={V_n-V_{-n}\over\sqrt2},
 \qquad 1\leq n\leq N.
\]

The locked transform is

\[
 \widehat e_n^-(t)
 ={2\sqrt{2/L}\,\alpha n\sin(Lt/2)
       \over t^2-\alpha^2n^2}.                         \tag{1.1}
\]

Every apparent value at `t=+/-alpha*n` is understood by continuity.  On the
all-critical-line branch, write the distinct positive ordinates as `gamma`
and their algebraic multiplicities as `m_gamma`.  Define the row

\[
 a(\gamma)_n=\widehat e_n^-(\gamma)
\]

and the positive-height Gram

\[
 G_{N,-}=\sum_{\gamma>0}m_\gamma
              a(\gamma)^*a(\gamma).                    \tag{1.2}
\]

The negative ordinate contributes the same absolute square.  Therefore the
complete odd Weil compression on this branch is exactly

\[
 Q_{N,-}=2G_{N,-},
 \qquad
 \mu_{N,-}=2\lambda_{\min}(G_{N,-}).                   \tag{1.3}
\]

Equation (1.3) is conditional target-branch bookkeeping.  It is not an
assumption of global Weil positivity in an unconditional argument.

## 2. Exact Cauchy determinant

Choose `N` distinct positive ordinates
`Gamma={gamma_1,...,gamma_N}` and let `A_Gamma` be the square matrix with
rows `a(gamma_j)`.  Set

\[
 x_j=(\gamma_j/\alpha)^2.
\]

Away from carrier collisions, (1.1) and the Cauchy determinant give

\[
\boxed{
\begin{aligned}
 |\det A_\Gamma|
 ={}&\left({\sqrt{2L}\over\pi}\right)^N N!
 {\displaystyle
   \prod_{j=1}^N|\sin(\pi\sqrt{x_j})|
   \prod_{1\leq j<k\leq N}|x_k-x_j|
   \prod_{1\leq n<m\leq N}(m^2-n^2)
  \over\displaystyle
   \prod_{j=1}^N\prod_{n=1}^N|x_j-n^2|}.
                                                               \tag{2.1}
\end{aligned}}
\]

The formula extends continuously when `x_j=n^2`.  At an in-range collision
the row has only its `n`th entry nonzero.  At an out-of-range carrier
`x_j=m^2` with `m>N`, the whole row is zero.

Each row is a restriction of the evaluation functional on
`L2([-L/2,L/2])`, so

\[
 \|A_\Gamma\|_F^2\leq NL.                              \tag{2.2}
\]

The product of the singular values and (2.2) now give the rigorous bound

\[
\boxed{
 \mu_{N,-}\geq
 {2|\det A_\Gamma|^2\over(NL)^{N-1}}.}                 \tag{2.3}
\]

Thus a completely explicit sufficient condition for live-shift admission
is

\[
\boxed{
 q_N< {2|\det A_\Gamma|^2\over(NL)^{N-1}}}             \tag{2.4}
\]

for one source-justified choice of `N` distinct ordinates.  A Cauchy--Binet
version may sum the squares of all such minors, but repeated value rows from
a multiple zero have zero determinant and do not turn into derivative rows.

Formula (2.1) exposes the missing inputs.  A useful lower bound needs both

1. separation of enough distinct ordinates, through
   `prod_(j<k)|x_j-x_k|`; and
2. anti-carrier separation, through the sine-to-denominator quotient.

The multiplicity-aware global count controls neither one at the scale needed
for a useful relative frame.  It does imply coarse one-separation for a
linear-size subset and, after logarithmic schedule averaging, a positive but
determinant-scale minor; see
`notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md`.

## 3. A count-compatible carrier-lattice countermodel

This section proves only insufficiency of the pinned zero-count hypotheses.
It does not alter the actual zeta zeros.

Fix `L_0>1/0.103787`, put `h=2*pi/L_0`, and let

\[
 M(T)={T\over2\pi}\log {T\over2\pi e}.
\]

For all sufficiently large integers `m`, define

\[
 C_m=\left\lfloor M(mh)-{1\over8}+{1\over2}\right\rfloor,
 \qquad k_m=C_m-C_{m-1}\geq0,                          \tag{3.1}
\]

and place an ordinate at `gamma_m=mh` with multiplicity `k_m` whenever
`k_m>0`.  Add the reflected negative ordinates.  The finite beginning may be
filled on the same lattice.

For `mh<=T<(m+1)h`, monotonicity of `M` gives

\[
\begin{aligned}
 |N_\Gamma(T)-M(T)+1/8|
 &\leq {1\over2}+M((m+1)h)-M(mh)\\
 &\leq {1\over2}+{1\over L_0}
              \log{(m+1)h\over2\pi}.                  \tag{3.2}
\end{aligned}
\]

Because `1/L_0<0.103787`, (3.2) is eventually smaller than the pinned HSW
error

\[
 0.103787\log T+0.257297\log\log T+9.367419.           \tag{3.3}
\]

Hence a symmetric all-critical multiset supported on one arithmetic lattice
is compatible with the locked global counting inequality.  Each
multiplicity in (3.1) is finite.

Now take one fixed integer `k>=2` and the logarithmic length

\[
 L=kL_0.
\]

Every model ordinate is a carrier:

\[
 \gamma_m={2\pi m\over L_0}={2\pi(km)\over L}.
\]

Equation (1.1) then gives

\[
 \widehat e_n^-(\gamma_m)=0
 \quad\hbox{unless}\quad n=km.                         \tag{3.4}
\]

In particular, every column with `k` not dividing `n` is identically zero.
For every `N>=1`, `e_1^-` is a null vector, and

\[
 \boxed{\lambda_{\min}(G_{N,-})=0.}                    \tag{3.5}
\]

The same fixed multiset works for every length `L=kL_0`.  Thus the
all-critical location statement, functional-equation symmetry, and the
locked multiplicity count do not imply even strict positivity of the odd
value Gram.  Any successful proof must use source information that excludes
this carrier locking.  Replacing repeated values by jets would change the
operator and is not allowed.

## 4. Scale obstruction on the polynomial schedule

The exact annihilators already recorded in
`notes/SIGNED_SHIFT_ODD_FLOOR_OBSTRUCTION.md` give, for every fixed `d`,

\[
 \mu_{N,-}\leq C_dL^{-(4d-1)}                           \tag{4.1}
\]

as soon as `N>=d`.  Therefore no lower frame of one fixed inverse-power
scale can be true on a growing odd sector.

If `gamma_*` is the least positive ordinate on the target branch, the
growing-degree witness `d=floor(r*gamma_*L/(2*pi))` gives

\[
 \mu_{N,-}\leq L^{O(1)}e^{-c(r,\gamma_*)L},             \tag{4.2}
\]

with the optimized exponent

\[
 c(1/\sqrt2,\gamma_*)
 ={2\gamma_*\over\pi}\operatorname {atanh}(1/\sqrt2).
                                                               \tag{4.3}
\]

Before the later Gevrey upgrade, the admitted projected-state sampling
estimate was

\[
 q_N={U_Z\over2}=O((\lambda L)^{-1})
     =O(e^{-L/2}/L).                                    \tag{4.4}
\]

At that historical envelope scale, if one separately had

\[
 \gamma_*>{\pi\over4\operatorname {atanh}(1/\sqrt2)}, \tag{4.5}
\]

then the odd upper witness (4.2) would already be smaller than the envelope
in (4.4).  This would not prove the wrong relative ordering of the actual
quantities; it would prove that those absolute envelopes cannot
establish the required ordering.  The later
`notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md` gives much smaller
absolute upper bounds for `q_N`, but still no lower bound for `mu_(N,-)` and
therefore no relative comparison.  The exact comparison remains

\[
\boxed{
 {U_Z\over2}=q_N<\mu_{N,-}.}                            \tag{4.6}
\]

## 5. Precise surviving theorem target

A zero-side proof on `N=ceil(lambda*L^3)` must supply at least one of the
following source-specific statements.

1. **Minor form.**  Produce `N` distinct positive ordinates, without reading
   a diagnostic zero table, and prove (2.4) with the continuous collision
   convention in (2.1).  The later anti-carrier schedule audit makes this
   minor positive on an implicit subsequence, but its determinant lower
   bound is far too small to prove (2.4); a quantitatively useful version
   remains open.
2. **Full singular-value form.**  Let `Z_(N,+)` and `Z_(N,-)` be the
   positive-height even and odd value maps, respectively, with each row
   weighted by the square root of its algebraic multiplicity.  For the unit
   projected state `kappa_N`, prove directly

   \[
    \sigma_{\min}(Z_{N,-})^2>
       \|Z_{N,+}\kappa_N\|^2.                          \tag{5.1}
   \]

   Indeed, `Q_(N,+)=2 Z_(N,+)^*Z_(N,+)` and
   `Q_(N,-)=2 Z_(N,-)^*Z_(N,-)`, so the common factor two cancels in the
   desired comparison.
3. **Cancellation-preserving form.**  Prove the shifted odd operator
   positive directly from the complete pole--archimedean--minus-prime form,
   without inserting a generic value-frame lower bound.

The count-only route on a preassigned schedule, a Vandermonde determinant
without carrier control, and the replacement of multiplicity by derivative
sampling are ruled out by Sections 2--3.  Count plus schedule averaging does
give strict positivity, but not the required relative scale.  Because of
(4.1)--(4.3), any viable lower theorem must live
on a superpolynomial and plausibly exponential scale and must be relative to
the particular projected prolate state.
