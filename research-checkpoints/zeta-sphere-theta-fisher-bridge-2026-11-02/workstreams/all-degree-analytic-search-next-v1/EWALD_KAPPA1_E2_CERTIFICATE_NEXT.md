# A rigorous negative head cell at the first odd rung

## Scope and result

This note certifies one **complete** scalar Ewald cell for the actual
degree-one residual

\[
 q(t)=t.
\]

With the normalization of `ACTUAL_EWALD_REVERSE_ORDER_NEXT.md`, Arb interval
quadrature on `0 <= t <= 40` and an independent analytic bound on the two
omitted spectral tails give

\[
 \boxed{e_2(q=t)<0.}                                      \tag{1}
\]

The frozen enclosure is approximately

\[
 e_2\in -0.4254680068681658+[-1.43,1.43]10^{-6}.          \tag{2}
\]

The tail radius in (2) deliberately includes an extra factor two beyond
the derived two-sided normalization.  Thus (1) does not depend on a marginal
rounding or normalization choice.

Combining (1) with the already proved Bessel result that every fixed odd
residual has a strictly positive eventual Ewald-index tail rigorously rules
out the stronger cutoff-by-cutoff stochastic order (11) of
`ACTUAL_EWALD_REVERSE_ORDER_NEXT.md` for `q=t`: a negative cell at index two
and a positive far tail cannot satisfy that order at every sufficiently
large cutoff and any `z>0`.

This result does **not** determine the sign of the aggregate

\[
 D(z)=P'(z)N(z)-P(z)N'(z),
\]

does not prove the half-seed or `S'(z)>=0`, and makes no RH claim.  Regional
compensation can keep `D<=0` even though the stronger termwise tail order
fails.

## 1. The complete analytic integrand

Put

\[
 s={1\over2}-it,\qquad
 K(s)=s(s-1)\pi^{-s/2}\Gamma(s/2),              \tag{3}
\]

\[
 d_2(s)=2^{-s}-{2^{1-s}-1\over1-s}.             \tag{4}
\]

All logarithms of positive real constants in the checker are real
logarithms.  In particular

\[
 2^{-s}=\exp(-s\log2),\qquad
 \pi^{-s/2}=\exp\{-\tfrac{s}{2}\log\pi\}.       \tag{5}
\]

For a complex variable `t`, define the analytic even completions

\[
 X(t)={K(s(t))\zeta(s(t))+K(s(-t))\zeta(s(-t))\over4},     \tag{6}
\]

\[
 E_2(t)={K(s(t))d_2(s(t))+K(s(-t))d_2(s(-t))\over4}.       \tag{7}
\]

On the real axis these are exactly `Xi(t)` and the complete second Ewald
packet.  The product in (6) is analytic on every integration disk used by
the checker: the zero `s-1` in `K` cancels the zeta pole, while the nearest
gamma pole and the removable denominator in (4) lie outside the disks.

The certified cell is

\[
 e_2={1\over\pi}\int_{\mathbb R}t^2
 \left\{X'E_2'-{XE_2''+X''E_2\over2}\right\}dt.            \tag{8}
\]

The integrand is even.  At every Arb quadrature centre the checker forms
third-order `acb_series` expansions of (6)--(7).  If `[j]` denotes the
coefficient of the local series variable to power `j`, the value supplied
to `acb.integral` is exactly

\[
 t^2\{X[1]E_2[1]-X[0]E_2[2]-X[2]E_2[0]\}.       \tag{9}
\]

The finite part uses 320 closed subintervals of width `1/8`, 160-bit Arb
arithmetic, and absolute and relative integration goals `10^-32`.  Arb
returns the outward enclosure

\[
 {2\over\pi}\int_0^{40}(9)dt
 \in -0.42546800686816579594009338701
       +[-1.08,1.08]10^{-30}.                   \tag{10}
\]

Its imaginary enclosure contains zero with radius below `8.3e-31`.

## 2. Complete-theta bounds for `Xi`

Use the audited positive Fourier profile

\[
 2\Xi(t)=\widehat\psi(t)
        =\int_{\mathbb R}\psi(h)e^{-ith}dh,qquad \psi\geq0. \tag{11}
\]

Write

\[
 X_0=\Xi(0),\qquad X_2=-\Xi''(0),\qquad
 X_1=\sqrt{X_0X_2}.                             \tag{12}
\]

Positivity of `psi` and Cauchy--Schwarz give, for real `t`,

\[
 |\Xi(t)|\leq X_0,qquad
 |\Xi'(t)|\leq X_1,qquad
 |\Xi''(t)|\leq X_2.                           \tag{13}
\]

Indeed `int psi=2X_0`, `int h^2 psi=2X_2`, and
`int |h|psi <= sqrt(int psi int h^2 psi)`.  Direct Arb series evaluation at
zero gives the outward bounds

\[
 (X_0,X_1,X_2)\subset
 (0.497120778188315,\ 0.106863608559902,\ 0.022971944315146). \tag{14}
\]

These are global real-axis bounds; no unproved zero or sign information
about `Xi(t)` is used.

## 3. Explicit log-Gamma contour bound

Let

\[
 A(s)=\pi^{-s/2}\Gamma(s/2)
     =\int_{-\infty}^{\infty}
       \exp\{sv/2-\pi e^v\}\,dv.               \tag{15}
\]

For `s=1/2-it`, `t>=0`, shift the log variable down along

\[
 v=u-i\theta,qquad \theta={49\pi\over100}<{pi\over2}.     \tag{16}
\]

The horizontal connectors vanish: at the positive end
`exp(-pi e^u cos theta)` supplies superexponential decay, and at the
negative end `exp(u/4)` supplies exponential decay.  Hence this is an
ordinary contour deformation, not an appeal to asymptotic Stirling
notation.  Set

\[
 \beta={\theta\over2},\quad a={1\over4},\quad
 c=\pi\cos\theta>0.                             \tag{17}
\]

After `x=ce^u`, define

\[
 M_0=\Gamma(a),qquad
 M_2=\Gamma(a)\{(\psi_0(a)-\log c)^2+\psi_1(a)\},           \tag{18}
\]

where `psi_0` and `psi_1` are the di- and trigamma functions.  The exact
log-moment identities behind (18) are

\[
 \int e^{au-ce^u}du=c^{-a}M_0,qquad
 \int u^2e^{au-ce^u}du=c^{-a}M_2.              \tag{19}
\]

Cauchy--Schwarz for the first shifted log moment gives

\[
 |A^{(j)}(1/2-it)|\leq C_j e^{-\beta t},\quad j=0,1,2,       \tag{20}
\]

with the fully explicit constants

\[
 \begin{aligned}
 C_0&=c^{-a}M_0,\\
 C_1&={c^{-a}\over2}\sqrt{M_0(M_2+\theta^2M_0)},\\
 C_2&={c^{-a}\over4}(M_2+\theta^2M_0).
 \end{aligned}                                    \tag{21}
\]

The Arb enclosures are

\[
 (C_0,C_1,C_2)\subset(6.468805,\ 15.586045,\ 37.553275).   \tag{22}
\]

There is no branch ambiguity in (17)--(21): `c>0`, and every power and
logarithm is taken on the positive real axis.

## 4. The complete multiplier and Euler remainder

Let `P(s)=s(s-1)` and `K=PA`.  On `s=1/2-it`,

\[
 |P|=t^2+{1\over4},\qquad |P'|=2t,qquad P''=2.              \tag{23}
\]

Equations (20)--(23) give

\[
 \begin{aligned}
 |K|&\leq k_0(t)e^{-\beta t},\\
 |K'|&\leq k_1(t)e^{-\beta t},\\
 |K''|&\leq k_2(t)e^{-\beta t},
 \end{aligned}                                             \tag{24}
\]

where

\[
 \begin{aligned}
 k_0&=C_0(t^2+1/4),\\
 k_1&=2C_0t+C_1(t^2+1/4),\\
 k_2&=2C_0+4C_1t+C_2(t^2+1/4).
 \end{aligned}                                             \tag{25}
\]

For (4), put `L=log 2`, `U=2^-s`, `N=2^(1-s)-1`, and `a_1=1-s`.
For `t>=T=40`, `|a_1|>=t`, and direct differentiation gives

\[
 \begin{aligned}
 |d_2|&\leq D_0:=2^{-1/2}+{\sqrt2+1\over T},\\
 |d_2'|&\leq D_1:=L2^{-1/2}+{L\sqrt2\over T}
                         +{\sqrt2+1\over T^2},\\
 |d_2''|&\leq D_2:=L^22^{-1/2}+{L^2\sqrt2\over T}
 +{2L\sqrt2\over T^2}+{2(\sqrt2+1)\over T^3}.
 \end{aligned}                                             \tag{26}
\]

Numerically, with outward rounding,

\[
 (D_0,D_1,D_2)\subset(0.767463,\ 0.516145,\ 0.358019).     \tag{27}
\]

For `H=Kd_2`, define the positive-coefficient polynomials

\[
 h_0=k_0D_0,quad
 h_1=k_1D_0+k_0D_1,quad
 h_2=k_2D_0+2k_1D_1+k_0D_2.                  \tag{28}
\]

Then `|H^(j)|<=h_j(t)e^(-beta t)` for `j=0,1,2`.

## 5. Closing the two infinite spectral tails

On the real axis, (7) gives

\[
 |E_2^{(j)}(t)|\leq {1\over2}|H^{(j)}(t)|.     \tag{29}
\]

Combining (8), (13), (28), and the two symmetric half-lines gives the
derived bound

\[
 |e_2-e_2^{[-T,T]}|
 \leq\int_T^\infty Q(t)e^{-\beta t}dt,          \tag{30}
\]

\[
 Q(t)={t^2\over\pi}
 \{X_1h_1(t)+\tfrac12X_0h_2(t)+\tfrac12X_2h_0(t)\}.        \tag{31}
\]

The factor `1/pi` in (31) already includes both symmetric tails: the
`2/pi` from evenness is cancelled by the `1/2` in (29).  The frozen checker
uses `2Q`, an additional normalization safety factor of two.  Its polynomial
coefficients in ascending powers of `t` are enclosed by

\[
 2Q(t)\subset
 3.708716\,t^2+10.360027\,t^3+8.550185\,t^4.    \tag{32}
\]

For every integer `m>=0`, the remaining integral is evaluated outward from
the exact identity

\[
 \int_T^\infty t^m e^{-\beta t}dt
 =e^{-\beta T}{m!\over\beta^{m+1}}
   \sum_{j=0}^{m}{(\beta T)^j\over j!}.          \tag{33}
\]

Equations (30)--(33), including the extra factor two, give

\[
 |e_2-e_2^{[-40,40]}|<1.426\,10^{-6}.           \tag{34}
\]

Together with (10), this proves (1) with a negative margin greater than
`0.4254665`.

## 6. Replay and limitations

From the checkpoint root, run

```text
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/all-degree-analytic-search-next-v1/src/certify_ewald_kappa1_e2.py \
  --output /tmp/ewald_kappa1_e2_certificate.json
```

The frozen receipt is
`results/ewald_kappa1_e2_certificate.json`.  It records the Python and
python-flint versions and SHA-256 hashes of the checker and the three
analytic notes on which the interpretation depends.

The certificate closes the finite quadrature and both unbounded spectral
tails for one actual scalar cell.  It does not evaluate the separate
Ewald-index total-variation constant `C_(q,Y)` from
`EWALD_SCALAR_CELL_TAIL_NEXT.md`.  Consequently it does not turn a finite
cell list into a proof of the half-seed, uniform `S'>=0`, or aggregate
`D<=0`.  Those remain distinct obligations.
