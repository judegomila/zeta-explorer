# The complete-orbit Hardy gate in rootwise logarithmic coordinates

## Scope and outcome

`JOINT_ORBIT_SCORE_NEXT.md` reduces the fully assembled next pivot to

\[
 2\int_0^\infty h^2\psi(h)^2\{E_h[U_P]\}^2dh
 \geq {1\over4\pi}\int_{\mathbb R}
       \{q'^2-q q''\}W^2dt,                     \tag{1}
\]

where `P_N` is the single actual old-space residual,

\[
 q(t)=t^rP_N(t^2),\qquad W=\widehat\psi=2\Xi,
\]

and every Jacobi orbit is summed before the mean is squared.  This note
attacks (1) without separating the orbit indices or changing that residual.

There are three conclusions.

1. Under the two old-prefix positivity hypotheses from the preceding note,
   let `rho_1,...,rho_kappa` be the real simple zeros of `q` and put

   \[
    G=qW,\qquad H_j={G\over t-\rho_j}.
   \]

   These quotients are division-free polynomial multiples of `W`.  The
   complete-orbit Hardy inequality is exactly

   \[
    \boxed{\sum_{j=1}^{\kappa}{1\over\gamma_j}\leq2,\qquad
    \gamma_j={\int (t-\rho_j)^2H_j'(t)^2dt
                    \over\int H_j(t)^2dt}.}      \tag{2}
   \]

2. Passing separately to the two logarithmic radii
   `y=log|t-rho_j|` gives

   \[
    \gamma_j={1\over4}+{\|u_j'\|^2\over\|u_j\|^2}.
   \]

   A vector-valued uncertainty inequality therefore yields a genuinely
   stronger, noncircular sufficient condition.  If `V_j` is the variance of
   `log|t-rho_j|` under the positive density `H_j^2dt`, then

   \[
    \boxed{\sum_{j=1}^{\kappa}{4V_j\over1+V_j}\leq2}
                                                               \tag{3}
   \]

   proves the next pivot.  In particular, the uniform bounds
   `V_j<=1/(2kappa-1)` suffice.  The variances are exact Mellin curvatures,
   making (3) a concrete fractional/Ewald target which involves no
   derivative or quotient of `Xi`.
3. The source-free operator route is sharply obstructed.  Root vanishing
   alone gives only the optimal one-dimensional Hardy constant `1/4`, while
   even one residual root requires `gamma>=1/2`.  Moreover direct integration
   by parts gives

   \[
    2\|G'\|^2-\sum_j\|H_j\|^2
    =\int q^2\{W'^2-WW''\}dt.                    \tag{4}
   \]

   Thus a modular/Ewald argument which merely rewrites the right side of
   (4) has returned to the weighted first Xi--Laguerre density.  Pointwise
   positivity of its positive real-space inverse profile is not enough.

The exact criterion (2) is target-equivalent.  The Mellin-variance budget
(3) is a stronger sufficient condition and is the noncircular reduced blocker.
It remains unproved for the complete theta residuals.  No finite-degree
experiment, finite orbit packet, first-Laguerre sign, or RH conclusion is
asserted.

## 1. Normalization and the real-root curvature

Fix `r in {0,1}` and `N>=2`, and set

\[
 \kappa=r+2N.                                    \tag{5}
\]

Let `P_N` be the monic residual determined by the actual old moments through
`m_(kappa-1)`, and put

\[
 q(t)=t^rP_N(t^2),\qquad
 F_P=D^rP_N(-D^2)\psi,\qquad G=qW.                \tag{6}
\]

The complete positive-orbit feature from the preceding note obeys

\[
 F_P(h)=\psi(h)E_h[U_P]\qquad(h\geq0).            \tag{7}
\]

Plancherel and parity give

\[
 2\int_0^\infty h^2\psi^2\{E_h[U_P]\}^2dh
 =\int_{\mathbb R}h^2F_P^2dh
 ={1\over2\pi}\int_{\mathbb R}G'(t)^2dt.        \tag{8}
\]

Assume the coupled old-prefix conditions

\[
 H_{N-1}^{(r)}>0,
 \qquad H_{N-1}^{(r+1)}>0.                       \tag{9}
\]

As proved in `JOINT_ORBIT_SCORE_NEXT.md`, the compressed multiplication
matrix is then a positive irreducible Jacobi matrix.  Hence `P_N` has
positive simple zeros and `q` has `kappa` real simple zeros

\[
 \rho_1<\rho_2<\cdots<\rho_\kappa.               \tag{10}
\]

The logarithmic curvature of a real-rooted polynomial is

\[
 q'^2-q q''
 =q^2\sum_{j=1}^{\kappa}{1\over(t-\rho_j)^2}
 =\sum_{j=1}^{\kappa}q_j(t)^2,                  \tag{11}
\]

where

\[
 q_j(t)={q(t)\over t-\rho_j}                     \tag{12}
\]

is a polynomial.  Define the zero-safe complete-theta functions

\[
 \boxed{H_j(t)=q_j(t)W(t).}                      \tag{13}
\]

No division occurs in (13).  Equations (11)--(13) give

\[
 {1\over4\pi}\int(q'^2-q q'')W^2dt
 ={1\over4\pi}\sum_{j=1}^{\kappa}\|H_j\|_2^2. \tag{14}
\]

Thus (1) is equivalent to

\[
 \boxed{2\|G'\|_2^2\geq
        \sum_{j=1}^{\kappa}\|H_j\|_2^2.}        \tag{15}
\]

All functions in (13)--(15) contain the same global residual and the full
theta transform.  No zero or orbit receives its own fitted polynomial.

## 2. A rootwise exact energy identity

For each `j`,

\[
 G(t)=(t-\rho_j)H_j(t).                           \tag{16}
\]

Expansion followed by one integration by parts gives

\[
\begin{aligned}
 \|G'\|_2^2
 &=\int\{H_j+(t-\rho_j)H_j'\}^2dt\\
 &=\int(t-\rho_j)^2H_j'(t)^2dt.
\end{aligned}                                    \tag{17}
\]

Indeed, the cross term is

\[
 \int(t-\rho_j)(H_j^2)'dt=-\int H_j^2dt,
\]

which cancels the first square.  The boundary term vanishes because `H_j`
is a polynomial times the exponentially decreasing `W`.

Put

\[
 E=\|G'\|_2^2,\qquad B_j=\|H_j\|_2^2,\qquad
 \gamma_j={E\over B_j}.                          \tag{18}
\]

Equation (17) gives the quotient in (2), and (15) becomes

\[
 \boxed{
 \sum_{j=1}^{\kappa}{1\over\gamma_j}\leq2.}       \tag{19}
\]

This is an exact collective criterion.  It does not prove the desired sign:
`E` is the complete-orbit mean-square energy from (8), and (19) is another
coordinate form of the same next pivot.

## 3. Logarithmic radii and the sharp `1/4`

For each root introduce two functions on the whole `y` line,

\[
 \begin{aligned}
 u_{j,+}(y)&=e^{y/2}H_j(\rho_j+e^y),\\
 u_{j,-}(y)&=e^{y/2}H_j(\rho_j-e^y).
 \end{aligned}                                   \tag{20}
\]

The factor `e^(y/2)` is the unitary Jacobian for
`t=rho_j plus_or_minus e^y`.  Hence

\[
 B_j=\int_{\mathbb R}
 \{|u_{j,+}|^2+|u_{j,-}|^2\}dy.                 \tag{21}
\]

On either branch,

\[
 (t-\rho_j)H_j'(t)
 =e^{-y/2}\{u_{j,\pm}'(y)-\tfrac12u_{j,\pm}(y)\}.
\]

The cross term in `y` integrates to zero.  Combining with (17) gives

\[
 \boxed{
 E=K_j+{1\over4}B_j,
 \qquad
 K_j=\int_{\mathbb R}
 \{|u_{j,+}'|^2+|u_{j,-}'|^2\}dy.}              \tag{22}
\]

Therefore

\[
 \boxed{\gamma_j={1\over4}+{K_j\over B_j}.}      \tag{23}
\]

The boundary behavior needed above is automatic.  As `y` tends to
`-infinity`, `H_j` has a finite value at `rho_j` and `u_(j,plus_or_minus)`
is `O(e^(y/2))`; as `y` tends to `+infinity`, the exponential real-axis
decay of `W` dominates every polynomial factor.

Equation (23) displays the sharp generic obstruction.  Without a
source-specific spectral gap on the logarithmic line, it gives only

\[
 \gamma_j\geq{1\over4}.                           \tag{24}
\]

The constant cannot be improved for the class of root-vanishing Schwartz
functions.  Take a smooth compactly supported `u_L(y)` which is nearly
constant on an interval of length `L`, normalize its `L2` norm, and let
`L` tend to infinity.  Then `||u_L'||^2` tends to zero.  Pulling it back by
(20) produces a smooth function supported in an annulus away from the root,
and (23) tends to `1/4`.

For a single root, however, (19) asks for `gamma_1>=1/2`.  Thus neither root
vanishing, Schwartz decay, nor the ordinary one-dimensional Hardy inequality
can prove the complete-orbit payment.  Extra complete-theta concentration is
indispensable.

## 4. A noncircular log-variance sufficient condition

Regard

\[
 { |u_{j,+}(y)|^2+|u_{j,-}(y)|^2\over B_j}\,dy  \tag{25}
\]

as a probability measure.  Let its mean and variance be

\[
 \bar y_j={1\over B_j}\int y
 \{|u_{j,+}|^2+|u_{j,-}|^2\}dy,
\]

\[
 V_j={1\over B_j}\int(y-\bar y_j)^2
 \{|u_{j,+}|^2+|u_{j,-}|^2\}dy.                 \tag{26}
\]

The vector-valued Heisenberg estimate is elementary here.  Integration by
parts and Cauchy--Schwarz give

\[
\begin{aligned}
 B_j
 &=-\int(y-\bar y_j){d\over dy}
       \{|u_{j,+}|^2+|u_{j,-}|^2\}dy\\
 &\leq2(B_jV_j)^{1/2}K_j^{1/2}.
\end{aligned}
\tag{27}
\]

Consequently

\[
 {K_j\over B_j}\geq{1\over4V_j},
 \qquad
 \gamma_j\geq{1+V_j\over4V_j}.                 \tag{28}
\]

Taking reciprocals in (28) and using (19) proves the sufficient condition

\[
 \boxed{
 \sum_{j=1}^{\kappa}{4V_j\over1+V_j}\leq2
 \quad\Longrightarrow\quad \mathcal S_{N,r}\geq0.}       \tag{29}
\]

This is stronger than the target and therefore noncircular.  It contains no
newest Bell moment and no Xi logarithmic derivative.  It uses only the old
residual roots and positive integrals against `W^2`.

A simple, still stronger corollary is

\[
 \boxed{
 V_j\leq{1\over2\kappa-1}\quad(1\leq j\leq\kappa)
 \quad\Longrightarrow\quad \mathcal S_{N,r}\geq0.}       \tag{30}
\]

Indeed, each summand in (29) is then at most `2/kappa`.

The collective form (29) is preferable to (30): a broad logarithmic profile
at one residual root can be paid by stronger concentration at the others.
No separate root bound is logically required.

## 5. Mellin curvature: a modular/Ewald-compatible target

The variances in (26) can be formed without the logarithmic coordinate.
For complex `s` with `Re(s)>-1`, define

\[
 \boxed{
 Z_j(s)=\int_{\mathbb R}|t-\rho_j|^s
       q_j(t)^2W(t)^2dt.}                        \tag{31}
\]

Near `rho_j` the integrand is a bounded function times `|t-rho_j|^s`;
at infinity the exponential decay of `W` permits every real power.  Thus
`Z_j` is analytic near `s=0`, differentiation under the integral is valid,
and

\[
 \boxed{
 (\log Z_j)'(0)=\bar y_j,
 \qquad (\log Z_j)''(0)=V_j.}                   \tag{32}
\]

The noncircular sufficient condition (29) is therefore the single Mellin
curvature budget

\[
 \boxed{
 \sum_{j=1}^{\kappa}
 {4(\log Z_j)''(0)\over1+(\log Z_j)''(0)}\leq2.} \tag{33}
\]

Unlike (1), equation (33) contains only positive `W^2` integrals and their
fractional placement around the *actual* residual roots.  It is therefore a
legitimate target for modular/Ewald or fractional-Laplacian methods.  The
polynomial `q_j` is fixed globally before `Z_j` is formed, so (31) does not
perform a rootwise regression.

The important scale is explicit.  A proof needs collective log-radius
variance of order `1/kappa`.  Ordinary localization on a fixed logarithmic
scale is insufficient.  Any Ewald estimate of (33) must retain this degree
dependence rather than bounding the `Z_j` separately by degree-independent
envelopes.

## 6. Why direct integration by parts returns the Laguerre target

The rootwise Hardy identity also shows exactly where a direct modular
factorization stops.  Since `G=qW`, integration by parts gives

\[
 2\|G'\|_2^2
 =\int_{\mathbb R}\{G'^2-GG''\}dt.              \tag{34}
\]

Expanding the integrand and using (11)--(13) yields

\[
 G'^2-GG''
 =\sum_{j=1}^{\kappa}H_j^2
   +q^2\{W'^2-WW''\}.                            \tag{35}
\]

Therefore

\[
 \boxed{
 2\|G'\|_2^2-\sum_{j=1}^{\kappa}\|H_j\|_2^2
 =\int_{\mathbb R}q(t)^2
       \{W'(t)^2-W(t)W''(t)\}dt.}               \tag{36}
\]

The right side is four times the `q^2`-weighted first Xi--Laguerre density.
With the normalization of the workstream,

\[
 \mathcal S_{N,r}
 ={1\over4\pi}\int q^2\{W'^2-WW''\}dt.          \tag{37}
\]

Thus proving (15) by first asserting nonnegative curvature of `W` is not a
new Hardy proof.  It invokes the still-open pointwise first Laguerre sign,
which is stronger than the one-residual integral (37).

The modular real-space representation has the same gate.  The inverse
Fourier profile of `(W'^2-WW'')/4` is the strictly positive complete-theta
conditional-variance profile from `THETA_TURAN_NEXT.md`.  Its pointwise
positivity does not make its Fourier transform nonnegative.  A direct Ewald
rewrite of (36) is useful only if it supplies an independently proved signed
grouping or the Mellin concentration budget (33); positivity of the physical
profile alone is target-equivalent to no sign statement.

## 7. Route classification

The complete-orbit Hardy attack now separates three logically different
statements.

1. The exact collective gap condition (19) is equivalent to the next pivot.
   It is a useful normalization, not a proof.
2. The Mellin log-variance budget (29) or (33) is a stronger,
   noncircular sufficient condition.  It is the surviving theorem-shaped
   target for modular/Ewald analysis.
3. A source-free operator Hardy inequality cannot close the step: its sharp
   local constant is `1/4`, while the payment already demands `1/2` for one
   root.  Pointwise Xi curvature would close every step but is the separate
   open first-Laguerre route.

The next useful analytic question is therefore precise:

\[
 \boxed{
 \text{Can complete-theta fractional/Ewald arithmetic prove (33) for the
 actual old residual roots, with transformed log-variance budget at most }2?}
 \tag{38}
\]

Failure of the stronger budget would not refute the pivot; it would only
retire this logarithmic-concentration mechanism.

## Self-audit and nonclaims

- The constants in (8), (14), and (15) were checked against
  `S=2 integral_0^infinity h^2 psi^2(EU_P)^2-D_q` with
  `D_q=(4pi)^(-1) integral (q'^2-q q'')W^2`.
- In (17), the cross term is exactly minus `||H_j||^2`, so every root has
  the same numerator `E=||G'||^2` in (18).
- The two logarithmic branches in (20) are both required.  Their Jacobians
  give (21), and each contributes `||u'||^2+||u||^2/4` to (22).
- Equation (29) follows in the correct direction because (28) is a lower
  bound for `gamma_j`, hence an upper bound for `1/gamma_j`.
- The rootwise Mellin integrals in (31) are division-free: `q_j` is a
  polynomial.  Their largest moment input remains the old residual through
  `m_(kappa-1)`; no next-pivot sign is inserted.
- Expanding (35) cancels the two mixed terms `2qq'WW'` exactly and reproduces
  both polynomial and Xi logarithmic curvatures with the displayed signs.

No claim is made that (29), (30), or (33) holds for the actual theta
residuals.  No finite-degree computation is extrapolated, and neither the
first Xi--Laguerre inequality nor RH is claimed.
