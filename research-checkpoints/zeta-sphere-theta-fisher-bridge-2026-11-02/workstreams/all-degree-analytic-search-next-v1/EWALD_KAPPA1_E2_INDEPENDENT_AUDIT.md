# Independent audit of the negative degree-one Ewald head cell

## Verdict and scope

`EWALD_KAPPA1_E2_CERTIFICATE_NEXT.md` and
`src/certify_ewald_kappa1_e2.py` pass an independent source, normalization,
tail, and replay audit.  For the actual first odd residual `q(t)=t`, they
rigorously prove

\[
 e_2<0.
\]

The independently replayed full upper endpoint is

\[
 e_2<-0.4254665817610170622670363919792527.
\]

Together with the separately proved eventual-positive odd Ewald-index tail,
this refutes the stronger cutoff-by-cutoff stochastic-tail order for this
residual.  It does not determine the aggregate `D`, the half-seed, `S'(1)`,
the endpoint pivot, or RH.

## 1. Cell formula and analytic completion

With

\[
 s=\tfrac12-it,\quad
 K=s(s-1)\pi^{-s/2}\Gamma(s/2),\quad
 d_2=2^{-s}-{2^{1-s}-1\over1-s},
\]

put `H(t)=K(t)d_2(s(t))`.  The real complete packet used by the cell is

\[
 E_2(t)={H(t)+H(-t)\over4}={\operatorname {Re}H(t)\over2}
 \qquad(t\in\mathbb R).
\]

The completed Xi factor is formed by the identical analytic symmetrization.
The checker evaluates

\[
 {1\over\pi}\int_{\mathbb R}t^2
 \{\Xi'E_2'-\tfrac12(\Xi E_2''+\Xi''E_2)\}\,dt.
\]

For a local `acb_series`, coefficient two is the second derivative divided by
`2!`; consequently the implemented expression

```text
Xi[1] E[1] - Xi[0] E[2] - Xi[2] E[0]
```

has exactly the displayed bilinear normalization.  The formula for `d_2` is
also the exact left Euler cell

\[
 2^{-s}-\int_1^2x^{-s}\,dx.
\]

The apparent singularity at `s=1` is removable, and the completed Xi zeta
pole is cancelled by `s-1`.  Neither lies on the real integration path.

## 2. Finite interval quadrature

The checker covers `[0,40]` by 320 closed segments of width `1/8` and uses
160-bit `acb.integral` with absolute and relative goals `10^-32`.  Evenness
supplies the factor `2/pi`.  The returned outward enclosure is

\[
 -0.42546800686816579594009338701
   +[-1.08,1.08]10^{-30},
\]

and the imaginary enclosure contains zero with radius below `8.3e-31`.
This agrees with, but does not rely on, the earlier floating Ewald diagnostic.

## 3. Complete-theta real-axis envelope

The audit checked the use of the positive complete Fourier profile
`2 Xi = Fourier(psi)`.  With

\[
 X_0=\Xi(0),\qquad X_2=-\Xi''(0),\qquad
 X_1=(X_0X_2)^{1/2},
\]

positivity and Cauchy--Schwarz give the global bounds

\[
 |\Xi|\le X_0,\qquad |\Xi'|\le X_1,\qquad
 |\Xi''|\le X_2.
\]

Thus no zero assumption, finite-orbit replacement, or unbounded numerical
sampling enters the spectral tail.

## 4. Log-Gamma contour and derivatives

The exact representation

\[
 \pi^{-s/2}\Gamma(s/2)
 =\int_{-\infty}^{\infty}e^{sv/2-\pi e^v}\,dv
\]

is shifted to `v=u-i theta`, with `theta=49 pi/100`.  Both connecting arcs
vanish: `exp(-pi e^u cos(theta))` controls `u -> +infinity`, and `exp(u/4)`
controls `u -> -infinity`.  The shift contributes
`exp(-theta t/2)`.  After `x=pi cos(theta) exp(u)`, the zeroth and second log
moments are exactly gamma/digamma/trigamma expressions.  Cauchy--Schwarz gives
the first derivative bound.  The implemented constants therefore bound the
first three `t` derivatives of the Gamma factor without an asymptotic
Stirling remainder.

Multiplication by `s(s-1)=-(t^2+1/4)` gives the three polynomial `K`
envelopes with derivative coefficients `2t` and `2`.  Direct quotient
differentiation of `d_2`, using `|1-s|>=t` for `t>=40`, gives the recorded
`D_0,D_1,D_2`.  Leibniz' rule then gives the `h_0,h_1,h_2` envelopes for
`H=Kd_2`.

## 5. Two-tail normalization and explicit integral

There are two real spectral tails, contributing `2/pi`.  On the real axis,

\[
 |E_2^{(j)}|\le\tfrac12|H^{(j)}|,
\]

so the minimal derived polynomial scale is `1/pi`.  The frozen checker uses
`2/pi` instead, an explicit additional safety factor of two.  This resolves
the only plausible factor-of-two ambiguity conservatively.

All coefficients of the resulting polynomial majorant are positive.  Each
monomial tail is evaluated outward by the exact identity

\[
 \int_T^\infty t^m e^{-\beta t}\,dt
 =e^{-\beta T}{m!\over\beta^{m+1}}
   \sum_{j=0}^m{(\beta T)^j\over j!}.
\]

At `T=40` the deployed two-sided safety majorant is

\[
 1.4251071458817267129864192701\,10^{-6},
\]

over five orders of magnitude smaller than the negative finite-part margin.

## 6. Independent replay and provenance

The frozen checker was replayed with the recorded Arb-enabled interpreter.
The replay and tracked receipt are byte-identical:

```text
b22fc12b2710807b9f124922959eef6348e1f9379d7e018c482313bd801cb99f
```

The independently observed source hashes are

```text
checker  ae5e91dc5f8d4eecfe30f527257461dcc61302a44dcdc96e2c4ce0857cd40e24
note     b8677e949ff33bc11728408669b862ec8149ea580f7d73bd13ec22bc47c34df4
```

The checker hash and the three upstream analytic-note hashes agree with the
receipt's provenance block.  `git diff --check` passes on the source commit.
This is an internal independent audit, not external peer review or
proof-assistant formalization.
