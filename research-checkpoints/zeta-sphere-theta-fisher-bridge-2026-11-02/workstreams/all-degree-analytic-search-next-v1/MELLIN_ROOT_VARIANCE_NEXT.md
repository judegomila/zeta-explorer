# The assembled Mellin root variance and its modular limits

## Scope and outcome

`COMPLETE_ORBIT_HARDY_NEXT.md` gives a sufficient condition for the actual
complete-orbit payment in terms of the separate logarithmic root variances

\[
 V_j=\operatorname{Var}_{q_j(t)^2W(t)^2dt}
          \{\log|t-\rho_j|\}.
\]

This note keeps the residual roots assembled before applying an uncertainty
inequality.  Let

\[
 q(t)=t^rP_N(t^2),\qquad
 q_j(t)={q(t)\over t-\rho_j},\qquad
 W=2\Xi,
\]

where `P_N` is the single actual old-space residual and
`rho_1,...,rho_kappa` are the real simple roots supplied by the two old
positive prefixes.  Define the joint positive fractional moment

\[
 \boxed{
 \mathcal Z(s)=\sum_{j=1}^{\kappa}
 \int_{\mathbb R}|t-\rho_j|^s q_j(t)^2W(t)^2dt.}  \tag{1}
\]

There are three conclusions.

1. The single aggregate Mellin curvature

   \[
    \mathcal V=(\log\mathcal Z)''(0)
   \]

   gives a new all-roots sufficient condition:

   \[
    \boxed{\mathcal V\leq{1\over2\kappa-1}
    \quad\Longrightarrow\quad\mathcal S_{N,r}\geq0.}       \tag{2}
   \]

   Every root, both logarithmic branches, the complete theta transform, and
   the actual residual remain in one vector inequality.
2. Equation (2) has an exact fractional/Ewald interpretation.  If `f_j` is
   the inverse Fourier transform of `q_jW`, then `mathcal Z(s)` is the sum of
   homogeneous fractional Sobolev energies of the modulated complete-theta
   features `e^(-i rho_j h)f_j`.  The curvature `mathcal V` is precisely the
   variance of the self-adjoint spectral operator `log|D|` in that vector
   state.
3. Two generic routes do not prove (2).  Ordinary fractional-moment
   interpolation supplies log **convexity**, hence only a lower bound
   `mathcal V>=0`, while (2) needs a degree-shrinking upper bound.  Strong
   log concavity in the original frequency variable is also insufficient:
   an exact Gaussian model has uniformly strongly log-concave `W^2`, a
   strictly positive Laguerre density, and a positive Hardy payment, but its
   actual degree-five residual has aggregate variance greater than `1/5`,
   while (2) requires at most `1/9`.

For the actual Xi transform, global strong log concavity is unavailable in
any case because `W` has real zeros.  A successful modular/Ewald proof would
therefore have to establish a reverse fractional-moment interpolation
estimate for the assembled `mathcal Z`, not invoke ordinary Hölder or a
source-free Brascamp--Lieb bound.

Equation (2) remains unproved.  No degree sweep, finite orbit packet, first
Xi--Laguerre sign, or RH conclusion is used.

## 1. Rootwise data and the assembled fractional moment

Fix

\[
 r\in\{0,1\},\qquad N\geq2,\qquad \kappa=r+2N,     \tag{3}
\]

and assume

\[
 H_{N-1}^{(r)}>0,\qquad H_{N-1}^{(r+1)}>0.        \tag{4}
\]

These hypotheses use moments only through `m_(kappa-1)`.  They make the
monic residual `P_N` the characteristic polynomial of a positive
irreducible compressed Jacobi matrix.  Thus

\[
 q(t)=t^rP_N(t^2)
 =\prod_{j=1}^{\kappa}(t-\rho_j)                  \tag{5}
\]

has real simple roots.  Put

\[
 q_j(t)=\prod_{\ell\ne j}(t-\rho_\ell),\qquad
 H_j(t)=q_j(t)W(t),\qquad G(t)=q(t)W(t).          \tag{6}
\]

Every expression in (6) is division-free.  Define

\[
 Z_j(s)=\int_{\mathbb R}|t-\rho_j|^sH_j(t)^2dt,
 \qquad \mathcal Z(s)=\sum_{j=1}^{\kappa}Z_j(s). \tag{7}
\]

The exponential real-axis decay of `W` and regularity of `H_j` at `rho_j`
make every `Z_j` analytic for `Re(s)>-1`.  In particular, differentiation
near zero is justified.

Write

\[
 B_j=Z_j(0),\qquad B=\mathcal Z(0)=\sum_jB_j,
 \qquad \alpha_j={B_j\over B}.                   \tag{8}
\]

For the individual root law, let

\[
 \mu_j={Z_j'(0)\over Z_j(0)},\qquad
 V_j=(\log Z_j)''(0).                            \tag{9}
\]

The log-sum differentiation formula gives the exact law of total variance

\[
 \boxed{
 \mathcal V:=(\log\mathcal Z)''(0)
 =\sum_{j=1}^{\kappa}\alpha_jV_j
  +\sum_{j=1}^{\kappa}\alpha_j(\mu_j-\bar\mu)^2,}
 \qquad
 \bar\mu=\sum_j\alpha_j\mu_j.                    \tag{10}
\]

Thus `mathcal V` is not an average of the separate within-root variances
alone.  It retains the between-root displacement of their logarithmic
scales, which a rootwise envelope would discard.

## 2. One vector uncertainty inequality

For each root and each sign introduce the logarithmic branches

\[
 u_{j,\pm}(y)=e^{y/2}H_j(\rho_j\pm e^y),
 \qquad y\in\mathbb R.                            \tag{11}
\]

Collect all `2kappa` functions into one vector `mathbf u(y)`.  The unitary
Jacobian gives

\[
 \|\mathbf u\|_2^2
 =\sum_{j=1}^{\kappa}\|H_j\|_2^2=B.              \tag{12}
\]

Let

\[
 K=\|\mathbf u'\|_2^2.
\]

The rootwise integration-by-parts identity from the preceding note says

\[
 \|G'\|_2^2
 =\|\mathbf u_j'\|_2^2+{1\over4}\|\mathbf u_j\|_2^2
 \qquad(1\leq j\leq\kappa),                     \tag{13}
\]

where `mathbf u_j=(u_(j,+),u_(j,-))`.  Summing (13) over all roots gives

\[
 \boxed{\kappa E=K+{1\over4}B,\qquad
 E=\|G'\|_2^2.}                                  \tag{14}
\]

The probability density `|\mathbf u(y)|^2/B` has mean `bar(mu)` and variance
`mathcal V` from (10).  Integration by parts followed by Cauchy--Schwarz
gives the vector uncertainty inequality

\[
 B
 =-\int(y-\bar\mu){d\over dy}|\mathbf u(y)|^2dy
 \leq2(B\mathcal V)^{1/2}K^{1/2}.                \tag{15}
\]

Hence

\[
 {K\over B}\geq{1\over4\mathcal V}.              \tag{16}
\]

Combining (14) and (16) yields

\[
 {\kappa E\over B}
 \geq{1+\mathcal V\over4\mathcal V},
 \qquad
 \boxed{{B\over E}\leq
 {4\kappa\mathcal V\over1+\mathcal V}.}          \tag{17}
\]

The exact complete-orbit Hardy target is `B<=2E`.  Therefore (17) proves
(2), since

\[
 \mathcal V\leq{1\over2\kappa-1}
 \quad\Longrightarrow\quad
 {4\kappa\mathcal V\over1+\mathcal V}\leq2.       \tag{18}
\]

This is a genuinely joint root budget.  It does not require the individual
conditions `V_j<=1/(2kappa-1)` and it does not apply the nonlinear map
`4V/(1+V)` before the roots are combined.  It is stronger than the desired
pivot and hence is a noncircular sufficient condition.

## 3. The exact fractional/Ewald form

Let the Fourier convention be

\[
 \widehat f(t)=\int_{\mathbb R}f(h)e^{-ith}dh.
\]

For each `j`, let `f_j` be the inverse Fourier transform of

\[
 H_j(t)=q_j(t)W(t).                              \tag{19}
\]

It is a constant-coefficient derivative polynomial applied to the complete
theta profile `psi`; no theta orbit is truncated.  Center the root by
modulation:

\[
 v_j(h)=e^{-i\rho_jh}f_j(h).                     \tag{20}
\]

Then

\[
 \widehat v_j(\tau)=H_j(\tau+\rho_j).
\]

Let `|D|` denote the positive Fourier multiplier `|tau|`.  Plancherel gives

\[
 \boxed{
 Z_j(s)=2\pi\bigl\||D|^{s/2}v_j\bigr\|_2^2,
 \qquad
 \mathcal Z(s)=2\pi\sum_{j=1}^{\kappa}
       \bigl\||D|^{s/2}v_j\bigr\|_2^2.}          \tag{21}
\]

All root shifts and complete-theta derivative features are summed in the
second identity.  With

\[
 \mathcal L=\log|D|,
\]

spectral calculus and differentiation at zero give

\[
 \bar\mu=
 {\sum_j\langle v_j,\mathcal L v_j\rangle
  \over\sum_j\|v_j\|^2},                         \tag{22}
\]

\[
 \boxed{
 \mathcal V=
 {\sum_j\|(\mathcal L-\bar\mu)v_j\|^2
  \over\sum_j\|v_j\|^2}.}                        \tag{23}
\]

The reduced sufficient condition is therefore the complete-theta vector
operator inequality

\[
 \boxed{
 \sum_{j=1}^{\kappa}\|(\log|D|-\bar\mu)v_j\|^2
 \leq{1\over2\kappa-1}\sum_{j=1}^{\kappa}\|v_j\|^2.}       \tag{24}
\]

This is the precise statement on which modular or Ewald arithmetic would
have to act.  Unlike a pointwise Xi logarithmic derivative, `log|D|` is
defined by positive spectral calculus.  Unlike separate orbit estimates,
the direct sum in (24) keeps every residual root and every complete-theta
orbit assembled.

## 4. What ordinary fractional interpolation supplies

Hölder's inequality gives, for real `s_0,s_1>-1` and `0<theta<1`,

\[
 Z_j((1-\theta)s_0+\theta s_1)
 \leq Z_j(s_0)^{1-\theta}Z_j(s_1)^\theta.        \tag{25}
\]

The same statement holds for `mathcal Z`, either directly on the disjoint
union of the root-indexed measure spaces or by another application of
Hölder.  Hence

\[
 (\log\mathcal Z)''(0)=\mathcal V\geq0.           \tag{26}
\]

This is the opposite type of information from the upper bound in (2).
More precisely,

\[
 \log{\mathcal Z(s)\mathcal Z(-s)\over\mathcal Z(0)^2}
 =\mathcal V s^2+o(s^2).                         \tag{27}
\]

Thus (2) would follow from the local reverse-interpolation cap

\[
 \boxed{
 \limsup_{s\to0}{1\over s^2}
 \log{\mathcal Z(s)\mathcal Z(-s)\over\mathcal Z(0)^2}
 \leq{1\over2\kappa-1}.}                         \tag{28}
\]

Ordinary Hölder supplies only the reverse inequality without the Gaussian
factor:

\[
 \mathcal Z(s)\mathcal Z(-s)\geq\mathcal Z(0)^2. \tag{29}
\]

Therefore complex interpolation or log convexity alone cannot prove the
Mellin budget.  A useful Ewald theorem must be a quantitative *upper*
curvature estimate for the assembled fractional energies, not another proof
of (25).

There is also a scale guardrail.  Replacing every distance
`|t-rho_j|` by `a|t-rho_j|` multiplies `mathcal Z(s)` by `a^s`, adding only a
linear term to `log(mathcal Z)`.  The curvature `mathcal V` is unchanged.
Consequently a scale envelope or dilation estimate for the theta tail cannot
by itself yield (2).

## 5. Strong log concavity does not imply the budget

The actual spectral weight `W^2=4Xi^2` has real zeros.  A nonzero log-concave
density on an interval is positive throughout the interior of its support,
so global log concavity, much less uniform strong log concavity, is
unavailable for `W^2`.

Partitioning into nodal cells does not remove the issue automatically.  The
aggregate variance (10) includes the variance of the cell and root means.
Separate Brascamp--Lieb bounds inside cells leave that between-component
term unpaid.

There is a sharper generic obstruction at the same nontrivial rung
`(N,r,kappa)=(2,1,5)` used by the campaign.  Take

\[
 W_G(t)=e^{-t^2/2}.                               \tag{30}
\]

Then

\[
 W_G'^2-W_GW_G''=W_G^2>0,\qquad
 -(\log W_G^2)''=2,                              \tag{31}
\]

so every Gaussian target pivot is positive and the spectral weight is
uniformly strongly log-concave.  The actual monic degree-five residual is

\[
 q(t)=t^5-5t^3+{15\over4}t
 =t\left(t^4-5t^2+{15\over4}\right).             \tag{32}
\]

This is not a polynomial chosen after the fact: it is the monic Hermite
residual for the positive target measure `e^(-t^2)dt`.  At the central root
`rho_0=0`,

\[
 H_0(t)=\left(t^4-5t^2+{15\over4}\right)e^{-t^2/2}. \tag{33}
\]

Put `y=(s+1)/2`.  Direct Gaussian integration gives

\[
 Z_0(s)=\Gamma(y)R(y),                            \tag{34}
\]

where

\[
 R(y)=y^4-4y^3+{27\over2}y^2-19y+{225\over16}.
\]

At `y=1/2`,

\[
 R={15\over2},\qquad R'=-8,\qquad R''=18.
\]

Using `psi_1(1/2)=pi^2/2` for the trigamma function therefore gives the exact
within-root variance

\[
 \boxed{
 V_0=(\log Z_0)''(0)
 ={\pi^2\over8}+{71\over225}>1.}                 \tag{35}
\]

The same Gaussian identities give

\[
 B_0=Z_0(0)={15\over2}\sqrt\pi,\qquad
 E=\|(qW_G)'\|_2^2={165\over8}\sqrt\pi,           \tag{36}
\]

and

\[
 \|qW_G\|_2^2={15\over4}\sqrt\pi.
\]

Since the Laguerre density in (31) equals `W_G^2`, the exact collective
identity is

\[
 B=\sum_jB_j=2E-\|qW_G\|_2^2
 ={75\over2}\sqrt\pi.                            \tag{37}
\]

Thus the central-root weight in the aggregate law is

\[
 \alpha_0={B_0\over B}={1\over5}.
\]

The law of total variance (10) now yields

\[
 \boxed{
 \mathcal V_G\geq\alpha_0V_0>{1\over5}>{1\over9}
 ={1\over2\kappa-1}.}                            \tag{38}
\]

So the **assembled** condition (2), not only a separate-root condition,
fails for this actual Gaussian residual.  Nevertheless

\[
 2E-B=\|qW_G\|_2^2>0,                            \tag{39}
\]

and the exact Hardy target holds strictly.

This analytic model is not the complete theta source and is not a
counterexample to its pivot.  It proves two method limitations:

- strong log concavity in `t` does not imply the assembled log-radius
  variance budget;
- condition (2) is sufficient but not necessary, even when the spectral
  Laguerre density is pointwise positive.

## 6. What modular/Ewald arithmetic would still need to prove

The positive complete-theta profile gives each `f_j` in (19) an exact
all-orbit derivative expansion.  Poisson/modular reflection may therefore
be applied to the vector `v=(v_1,...,v_kappa)` in (21).  But two structural
facts must be retained.

First, the modulations `e^(-i rho_j h)` are essential.  Removing their
phases before summing changes the centered fractional multipliers
`|t-rho_j|^s` and destroys `mathcal Z`.

Second, the required estimate is an upper variance bound for `log|D|`.
Positive Ewald squares, ordinary fractional Sobolev interpolation, and
Hölder naturally give lower convexity or nonnegative energies.  They do not
give the reverse-curvature cap (28).

The surviving theorem-shaped target is therefore

\[
 \boxed{
 \text{prove (28), uniformly for the actual residual root vector, by a
 modularly complete grouping of the modulated features }v_j.}    \tag{40}
\]

An equivalent infinitesimal form is the operator variance inequality (24).
A proof may use cancellation among root phases, but it must sum all roots
before estimating; separate absolute bounds would lose the between-root
term in (10).

Failure of (24) for an actual rung would not refute that pivot.  The Gaussian
model shows that the sufficient Mellin budget can fail while the target
remains positive.  It would retire this particular log-concentration route
and return the problem to the exact collective Hardy criterion.

## Self-audit and nonclaims

- The law of total variance in (10) follows by differentiating the logarithm
  of the sum `mathcal Z=sum_j Z_j`; the weights are `alpha_j=Z_j(0)/mathcal
  Z(0)`.
- Summing the rootwise identities gives `kappa E=K+B/4`, not
  `E=K+B/4`; this factor is responsible for the threshold
  `1/(2kappa-1)`.
- Equation (21) uses the shift
  `widehat(e^(-i rho_j h)f_j)(tau)=H_j(tau+rho_j)` and the nonunitary
  Plancherel factor `2pi`.
- Ordinary Hölder fixes only the sign of the Mellin curvature.  The target
  requires the upper cap in (28).
- In the Gaussian model, `V_0>1` follows from `pi^2/8>1`; the aggregate
  failure then follows from `alpha_0=1/5` and `1/5>1/9`.  No numerical
  approximation is used.

No claim is made that (2), (24), (28), or (40) holds for the actual
complete-theta residuals.  No finite-degree computation is used as endpoint
evidence, and neither a new Xi--Laguerre inequality nor RH is claimed.
