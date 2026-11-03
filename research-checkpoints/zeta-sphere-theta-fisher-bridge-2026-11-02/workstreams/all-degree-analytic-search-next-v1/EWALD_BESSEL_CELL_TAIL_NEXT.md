# The Bessel tail of the assembled Ewald cells

## Scope and outcome

The fixed-frequency Euler expansion

\[
 d_n(s)=-s\int_0^1u(n-1+u)^{-s-1}\,du
\]

has size `n^(-3/2)` on the critical line.  That is not the tail of the
fully assembled scalar cell: after correlation with the complete theta leg,
the logarithmic oscillation is integrated at frequency `log n`.  This note
computes the tail in the physical orbit variables, before any positive and
negative cell split.

Let `p` be any real monic polynomial of degree `kappa` and parity `kappa`,
and let

\[
 P(t)=i^{-\kappa}p(it).                           \tag{0}
\]

Because every power in `p` has parity `kappa`, `P` is a real monic
polynomial and `|p(it)|^2=P(t)^2`.  This is the exact map from the monic
differential polynomial in the physical formula to the real frequency
residual in the scalar-cell formula.  Equivalently, starting with an actual
real monic spectral residual `q(t)` of parity `kappa`, the inverse map is

\[
 \boxed{p(z)=(-1)^\kappa i^{-\kappa}q(-iz),
 \qquad p(it)=(-1)^\kappa i^{-\kappa}q(t).}      \tag{0a}
\]

Indeed, the first factor in (0a) makes the coefficient of `z^kappa` equal
to one, and the second identity shows `|p(it)|^2=q(t)^2`; substituting it
in (0) returns `P=q`.  Let

\[
 J_p(x)={1\over\pi}\int_{\mathbb R}
 \mathcal B(\Xi,C_x)(t)|p(it)|^2\,dt,            \tag{1}
\]

\[
 e_n(p)=J_p(n)-\int_{n-1}^nJ_p(x)\,dx.          \tag{2}
\]

These are exactly the continuous paid source and complete left Euler cells
used in `EWALD_CORRELATED_PAIRING_NEXT.md`; replacing `p(it)` by a unit
multiple does not change (1).  The main result is

\[
 \boxed{
 J_p(x)=(-1)^\kappa C_\kappa
 x^{2\kappa+7/2}(\log x)^2e^{-2\pi x}
 \{1+O_p(x^{-1})\},}                            \tag{3}
\]

where

\[
 C_\kappa=8\pi^4(2\pi)^{2\kappa}>0.            \tag{4}
\]

Consequently, with

\[
 H={e^{2\pi}-1\over2\pi}-1>0,
\]

\[
 \boxed{
 e_n(p)=(-1)^{\kappa+1}C_\kappa H
 n^{2\kappa+7/2}(\log n)^2e^{-2\pi n}
 \{1+O_p(n^{-1})\}.}                            \tag{5}
\]

In particular, every fixed actual residual has an eventual strict cell sign

\[
 \operatorname {sgn}e_n=(-1)^{\kappa+1},        \tag{6}
\]

and

\[
 \lim_{n\to\infty}{|e_{n+1}|\over|e_n|}=e^{-2\pi}. \tag{7}
\]

This proves a genuine analytic Ewald-index tail theorem, not a finite-cell
observation.  It also gives a sharp obstruction to the proposed all-`k`
reverse stochastic-tail certificate.  At every odd rung the far tail is
strictly positive.  If that residual has even one negative head cell, then
`P B_k >= N A_k` fails for every sufficiently large cutoff `k`, at every
`z>0`.  This does **not** disprove the aggregate inequality `D<=0`; the
positive far tail is exponentially small and must instead be paid by a
correlated finite-head estimate.

No half-seed, Abel derivative sign, aggregate tilted order, all-degree
theorem, or RH statement is proved here.

## 1. The physical correlation kept assembled

Use the complete positive theta profile and continuous orbit

\[
 \psi(h)=\sum_{m\geq1}\omega_m(h)\quad(h\geq0),
\]

\[
 \omega_a(h)=4z_a(2z_a-3)e^{h/2-z_a},
 \qquad z_a=\pi a^2e^{2h},                       \tag{8}
\]

and extend `psi` evenly.  Put

\[
 \sigma_x(h)={1\over2}\{\omega_x(h)+\omega_x(-h)\}.
\]

The audited physical formula is

\[
 R_x(u)={1\over16}\int_{\mathbb R}v^2
 \psi\!\left({u+v\over2}\right)
 \sigma_x\!\left({u-v\over2}\right)dv,         \tag{9}
\]

\[
 \boxed{J_p(x)=2[p(D)p(-D)R_x](0).}             \tag{10}
\]

All functions in (9) are the complete objects.  The orbit sum is used only
to estimate the already assembled correlation; it is not truncated in
(10).  For fixed derivative order, the differentiated orbit series is
absolutely and locally uniformly convergent.

The change `(u,v)->(-u,-v)`, together with evenness of `psi` and `sigma_x`,
shows that

\[
 R_x(-u)=R_x(u).                                 \tag{11}
\]

## 2. Exact crossed-orbit reduction

First take the half-space `u+v>=0`, so the theta leg in (9) may be expanded
by (8).  Pair its `m`th orbit with the crossed term
`omega_x((u-v)/2)` from `sigma_x`.  Define

\[
 L_m=\log{x\over m},\qquad
 \lambda_m^+(u)=\pi mx e^u,
 \qquad v=L_m+w.                                 \tag{12}
\]

For the two orbit variables one then has the exact identities

\[
 z_1z_2=(\lambda_m^+)^2,qquad
 z_1+z_2=2\lambda_m^+\cosh w.                   \tag{13}
\]

Including the factors `1/16` in (9) and `1/2` in `sigma_x`, the crossed
integrand is exactly

\[
 e^{u/2}(L_m+w)^2
 \left\{2\lambda^4-6\lambda^3\cosh w
                 +{9\over2}\lambda^2\right\}
 e^{-2\lambda\cosh w},                          \tag{14}
\]

where `lambda=lambda_m^+(u)`.  The half-space boundary becomes
`w>=-L_m-u`.  Extending it to the whole real line costs
`O_{r,delta}(e^{-c_delta x^2})` after any fixed number `r` of `u`
derivatives, uniformly for `|u|<=delta<1/2`.

On the other half-space the reflected crossed term has the same formula
with

\[
 \lambda_m^-(u)=\pi mx e^{-u},qquad u\mapsto-u. \tag{15}
\]

The two uncrossed products have their minimum at a half-space boundary and
are also `O_{r,delta}(e^{-c_delta x^2})`.  Thus the only `e^{-c x}`
contribution is (14) and its reflection.

Formula (14) is already an exact modified-Bessel reduction.  For example,

\[
 \int_{\mathbb R}e^{-2\lambda\cosh w+\nu w}dw
   =2K_\nu(2\lambda),                            \tag{16}
\]

and the factors `(L_m+w)^2` are obtained by applying
`(L_m+partial_nu)^2` at `nu=0`.  A factor `cosh w` is `-1/2` times a
`lambda` derivative.  Hence every term in (14), and every fixed `u`
derivative of it, is a finite combination of ordinary derivatives of
`K_nu(2 lambda)` with explicit polynomial coefficients.  This is the
certifiable tail representation; it is obtained before a cell sign split.

## 3. Dominance of the first orbit

For completeness, the needed Laplace estimate follows directly from the
integral in (16).  Since

\[
 \cosh w\geq1+{w^2\over2},
\]

Gaussian domination gives, for each fixed pair of nonnegative integers
`a,b`,

\[
 \int_{\mathbb R}|w|^a(\cosh w)^b
 e^{-2\lambda\cosh w}dw
 =O_{a,b}(\lambda^{-1/2}e^{-2\lambda}).          \tag{17}
\]

On `|w|<=lambda^(-1/2)`, Taylor's formula for `cosh` gives the matching
lower expansion.  In particular,

\[
 \int_{\mathbb R}(L+w)^2e^{-2\lambda\cosh w}dw
 =\sqrt{\pi\over\lambda}\,L^2e^{-2\lambda}
 \left\{1+O\!\left({1+L^{-2}\over\lambda}\right)\right\}. \tag{18}
\]

The `-6 lambda^3 cosh w` and `9 lambda^2/2` terms in (14) are smaller than
the leading `2 lambda^4` term by `O(1/lambda)`.  A precise differentiated
version of the resulting estimate is as follows.  For every
`0<delta<1/2` and integer `r>=0`, there are positive constants
`C_(r,delta),c_delta` such that, uniformly for `|u|<=delta`,

\[
 \begin{aligned}
 \partial_u^rR_x(u)=2\pi^4x^{7/2}(\log x)^2
 \partial_u^r\{&e^{4u}e^{-2\pi xe^u}
 +e^{-4u}e^{-2\pi xe^{-u}}\}+E_r(x,u),          \tag{19a}
 \end{aligned}
\]

\[
 \begin{aligned}
 |E_r(x,u)|\leq C_{r,\delta}\{&
 x^{r+5/2}(1+(\log x)^2)e^{-2\pi xe^{-|u|}}\\
 &+x^{r+7/2}(1+(\log x)^2)e^{-4\pi xe^{-\delta}}
 +x^{C_{r,\delta}}e^{-c_\delta x^2}\}.         \tag{19b}
 \end{aligned}
\]

The three terms in (19b) respectively bound the lower powers of `lambda`
and the next Laplace moments, the summed `m>=2` crossed orbits, and the
uncrossed plus moving-boundary pieces.  For the orbit sum, split
`m<=2xe^delta` and its complement.  Estimate (17) gives a geometric
`e^{-2 pi m x e^{-delta}}` majorant on the first part; at the half-space
boundary the complement has Gaussian decay in `m^2+x^2`.  A fixed number
of `u` derivatives adds only polynomial factors, so these same majorants
justify termwise differentiation.

In particular, equations (19a)--(19b) give, near `u=0`,

\[
 \begin{aligned}
 R_x(u)=2\pi^4x^{7/2}(\log x)^2\{&
 e^{4u}e^{-2\pi xe^u}
 +e^{-4u}e^{-2\pi xe^{-u}}\}\{1+O(x^{-1})\}
 \end{aligned}                                  \tag{19}

where the two reflected terms have separate fixed-order differentiated
expansions with the absolute remainder (19b).  (Odd
derivatives of their sum vanish at `u=0`, so a multiplicative relative
statement for that cancelled quantity would be meaningless.)  Only the
even derivatives at zero are used below.  This proves both completeness of
(19) and the nonvanishing of its leading coefficient.

An entirely explicit finite threshold can be certified from (14), without
asymptotic special-function software.  For `lambda>=1`,

\[
 \begin{aligned}
 \int(L+w)^2e^{-2\lambda\cosh w}dw
 &\leq e^{-2\lambda}\sqrt{\pi\over\lambda}
       \left(L^2+{1\over2\lambda}\right),\\
 \int(L+w)^2\cosh w\,e^{-2\lambda\cosh w}dw
 &\leq e^{-2\lambda}\sqrt{2\pi\over\lambda}
       \left(L^2+{1\over\lambda}\right).       \tag{20}
 \end{aligned}
\]

For `L>=2`, restricting the first integral to
`|w|<=lambda^(-1/2)` gives

\[
 \int(L+w)^2e^{-2\lambda\cosh w}dw
 \geq {2(L-1)^2\over\sqrt\lambda}
       e^{-2\lambda-\cosh1}.                    \tag{21}
\]

The same elementary bounds after differentiating (14), plus the geometric
`m>=2` majorant, give rational/exponential upper and lower bounds for any
fixed residual and therefore a certified eventual-sign index.  The purpose
of (20)--(21) is a proof mechanism, not a reported numerical threshold.

## 4. Applying the residual differential operator

Write the monic parity residual as

\[
 p(z)=z^\kappa+c_{\kappa-2}z^{\kappa-2}+\cdots .
\]

Then

\[
 p(D)p(-D)=(-1)^\kappa D^{2\kappa}
              +\hbox{lower even derivatives}.   \tag{22}

For either exponential in (19), every `u` derivative falling on the
exponential contributes a leading factor of magnitude `2 pi x`.  Thus

\[
 R_x^{(2\kappa)}(0)=4\pi^4(2\pi)^{2\kappa}
 x^{2\kappa+7/2}(\log x)^2e^{-2\pi x}
 \{1+O_\kappa(x^{-1})\}.                        \tag{23}

All lower residual derivatives in (22) are smaller by at least two powers
of `x`; derivatives of the amplitude in (19) are included in the relative
`O(1/x)` term.  Combining (10), (22), and (23) proves (3)--(4).  Notice that
the lower residual coefficients cannot change the leading sign.  The
parity pattern is therefore degree-uniform for every fixed monic residual,
not a peculiarity of the first five floating profiles.

## 5. Passing from the source to the left Euler cell

Put

\[
 \beta=2\kappa+{7\over2}.
\]

Uniformly for `0<=y<=1`, equation (3) gives

\[
 J_p(n-y)=(-1)^\kappa C_\kappa
 n^\beta(\log n)^2e^{-2\pi n}e^{2\pi y}
 \{1+O_p(n^{-1})\}.                             \tag{24}

Therefore

\[
 \int_{n-1}^nJ_p(x)dx=(-1)^\kappa C_\kappa
 n^\beta(\log n)^2e^{-2\pi n}
 \left\{{e^{2\pi}-1\over2\pi}+O_p(n^{-1})\right\}. \tag{25}

Subtracting (25) from `J_p(n)` proves (5).  The strict positivity of `H`
is just `e^a>1+a` at `a=2 pi`.  The ratio limit (7) follows immediately.

The ratio limit also supplies a geometric total-variation tail.  Given any
fixed `rho` with

\[
 e^{-2\pi}<\rho<1,
\]

there is an effectively certifiable `N=N(p,rho)` such that

\[
 |e_{n+1}|\leq\rho|e_n|\quad(n\geq N),          \tag{26}
\]

and hence, for `0<=z<=1`,

\[
 \sum_{j\geq n}|e_j|z^j
 \leq {|e_n|z^n\over1-\rho z}\qquad(n\geq N).  \tag{27}

This complements the sign-free arbitrary-power contour bound in
`EWALD_SCALAR_CELL_TAIL_NEXT.md`: that bound certifies a head/tail split
without resolving signs, while (14)--(21) certify the eventual parity sign
and the much sharper geometric tail.

## 6. Consequence for reverse tilted-tail order

After the complete scalar cells are formed, write

\[
 a_n=e_n^+,qquad b_n=e_n^-,qquad
 P(z)=\sum a_nz^n,quad N(z)=\sum b_nz^n,
\]

\[
 A_k(z)=\sum_{n\geq k}a_nz^n,qquad
 B_k(z)=\sum_{n\geq k}b_nz^n.                  \tag{28}
\]

If `kappa` is odd, (6) gives an index `N_0` with

\[
 a_n>0,qquad b_n=0\qquad(n\geq N_0).           \tag{29}
\]

Suppose at least one negative head cell exists.  Then `N(z)>0` for every
`z>0`, while for every `k>=N_0`,

\[
 B_k(z)=0,qquad A_k(z)>0.
\]

It follows that

\[
 \boxed{P(z)B_k(z)-N(z)A_k(z)<0
 \quad(k\geq N_0,\ z>0).}                      \tag{30}

Thus first-order stochastic domination in the form proposed in
`ACTUAL_EWALD_REVERSE_ORDER_NEXT.md` cannot be the odd-rung proof whenever
the signed head is nontrivial.  The earlier first-ten-cell diagnostics show
such negative head cells at degrees 1, 3, and 5, but those floating values
are not promoted here to a certificate; (30) is an exact conditional
statement.

If `kappa` is even, the far tail is strictly negative, so the expressions
in (30) are nonnegative at sufficiently late cutoffs (strict when positive
head mass is present), and the individual tail cutoffs become compatible
with the proposed stochastic order.  A finite analytic head is still
required.

For odd degree the viable target is the weaker aggregate identity

\[
 -zD(z)=\sum_{k\geq1}\{P(z)B_k(z)-N(z)A_k(z)\}. \tag{31}

The summands in (31) are eventually negative by (30), but their geometric
total is explicitly bounded by (27).  A proof of `D<=0` must therefore keep
the favorable finite-head compensation and pay the unfavorable Bessel tail
in aggregate.  Likewise, (27) is the correct tail tool for a finite analytic
proof of the half-seed and `S'(z)>=0`; neither sign follows from (5) alone.

### Explicit finite-head margins for the three remaining obligations

The reduction can be made quantitative without deciding any tail sign.
Fix a head cutoff `N` and put

\[
 T_0(z)=\sum_{n>N}|e_n|z^n,qquad
 T_1(z)=\sum_{n>N}n|e_n|z^{n-1},                \tag{32}
\]

\[
 H_0(z)=\sum_{n\leq N}|e_n|z^n,qquad
 H_1(z)=\sum_{n\leq N}n|e_n|z^{n-1}.           \tag{33}
\]

Let `S_N` and `D_N` be formed from the signed head exactly as `S` and `D`
are formed from the full sequence.  The triangle inequality gives

\[
 S(1/2)\geq S_N(1/2)-T_0(1/2),                 \tag{34}
\]

\[
 S'(z)\geq S_N'(z)-T_1(z),                     \tag{35}
\]

and expansion of `D=P'N-PN'` into head and tail parts gives

\[
 \boxed{|D(z)-D_N(z)|
 \leq H_1(z)T_0(z)+H_0(z)T_1(z)+2T_0(z)T_1(z).} \tag{36}
\]

The arbitrary-power bound from `EWALD_SCALAR_CELL_TAIL_NEXT.md` supplies
uniform explicit majorants for (32); differentiating its elementary series
supplies `T_1`.  Past a Bessel-certified sign threshold, (26)--(27) give a
much sharper geometric majorant.  Therefore outward enclosures proving

\[
 S_N(1/2)>T_0(1/2),qquad
 \inf_{1/2\leq z\leq1}\{S_N'(z)-T_1(z)\}>0,     \tag{37}
\]

\[
 \sup_{1/2\leq z\leq1}\left\{D_N(z)
 +H_1T_0+H_0T_1+2T_0T_1\right\}<0              \tag{38}
\]

would certify the half-seed, derivative sign, and **aggregate** reverse
order on the whole Abel interval.  These are finite analytic head checks
with a proved infinite tail, not finite-cell evidence presented as a proof.
No such interval head computation is supplied in this note.

For even degree, a certified eventual-negative threshold additionally makes
`A_k=0` at all later cutoffs, so the termwise tail order is automatic there;
only finitely many earlier cutoffs remain.  For odd degree with a negative
head, (30) proves that this stronger termwise route is unavailable, and
(34)--(38) isolate the aggregate replacement.

## 7. Reproducibility and boundary

`src/check_ewald_bessel_tail_algebra.py` checks, using exact rational
polynomial arithmetic where possible,

- the crossed-orbit polynomial in (14);
- the leading derivative coefficients of both reflected exponentials;
- the operator sign through degree twelve;
- positivity of the Euler factor `H` and the ratio `e^(-2 pi)` numerically
  to recorded high precision.

The checker audits algebra only.  The analytic estimates are (17)--(21),
not a floating certificate.  No finite orbit packet replaces the complete
theta profile, no live experiment is modified, and no RH conclusion is
drawn.
