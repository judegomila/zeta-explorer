# Green-transfer localization obstruction

Date: 2026-11-04 UTC.

## Purpose

The wave-27 arithmetic reduction writes the actual endpoint angle as

\[
 X_n={2\pi\over\sigma_n}\{3C_n(5/2)-2C_n(3/2)\},
 \qquad
 C_n(a)=\int_0^\infty e^{-at}{\cal K}_n(t)\,dt.
\]

If `mathcal K_n` is nonnegative, the sign condition `X_n>=0` is equivalent
to localization of the probability measure proportional to
`e^(-5t/2) mathcal K_n(t)dt`:

\[
 {C_n(3/2)\over C_n(5/2)}\le {3\over2}.
\]

This note gives an exact countermodel to any attempt to deduce that
localization merely from positivity of the profiles, the local Green/source
identity, a positive Jacobi prefix, and `mathcal K>=0`.

## Exact model

Let

\[
 \beta={\sqrt{1957}-16\over63}.
\]

It is the unique positive root of

\[
 63\beta^2+32\beta-27=0,
 \qquad {8\over21}<\beta<{27\over56}.
\]

On `u>=0`, set

\[
 B(u)=e^{-u}+\beta e^{-2u},
 \qquad
 \psi(u)={4\pi\over35}e^{-u}+{4\pi\beta\over21}e^{-2u}.
\]

Both profiles are strictly positive, real analytic, and exponentially
decaying.  For

\[
 L_2=(D-5/2)(D-3/2),
\]

the two exponential modes give exactly

\[
 L_2\psi=-2\pi(D+1/2)B.                         \tag{1}
\]

Choose the monic parity-adapted polynomials

\[
 T_3(z)=z^3-{9\over4}z,
 \qquad
 T_4(z)=z^4-5z^2+{11\over4}.
\]

They are a positive symmetric Jacobi prefix: starting with `T_0=1` and
`T_1=z`, the recurrence `T_(j+1)=zT_j-b_jT_(j-1)` has

\[
 b_1=1,\qquad b_2={5\over4},\qquad b_3={11\over4}.
\]

Moreover,

\[
 q_3=T_4'-4T_3=-z.
\]

Thus

\[
 F=T_3(D)\psi={\pi\over7}e^{-u}-{2\pi\beta\over3}e^{-2u},
 \qquad
 g=q_3(D)B=e^{-u}+2\beta e^{-2u}.
\]

Equation (1), with constant-coefficient operators applied, retains the exact
one-sided Green transfer used in wave 27.

## Nonnegative correlation with the wrong localization

Direct integration gives

\[
 {\cal K}(t)=\int_0^\infty uF(u)g(u+t)\,du
 =\pi\left({1\over28}-{2\beta\over27}\right)e^{-t}
 +2\pi\beta\left({1\over63}-{\beta\over24}\right)e^{-2t}.
\]

The minimal polynomial of `beta` makes the two coefficients exact
opposites.  With

\[
 A=\pi\left({1\over28}-{2\beta\over27}\right)>0,
\]

one has

\[
 \boxed{{\cal K}(t)=A(e^{-t}-e^{-2t})\ge0\quad(t\ge0).} \tag{2}
\]

Nevertheless,

\[
 3C(5/2)-2C(3/2)
 =A\left({2\over35}-{2\over21}\right)
 =-{4A\over105}<0.                                \tag{3}
\]

Equivalently,

\[
 {C(3/2)\over C(5/2)}={9\over5}>{3\over2}.         \tag{4}
\]

So positivity of the shifted correlation does not provide the required
localization.  A proof for actual theta must use additional arithmetic
information that controls where the positive correlation mass lies, not
only its sign or a source-channel square norm.

## Actual-theta signed-correlation diagnostic

The companion bounded floating probe reconstructs the actual monic
polynomials from the same SHA-bound moment archive as the wave-27 angle
certificate.  It evaluates the complete theta orbit series and the standard
Jordan-`J_2` arithmetic translates on 224-by-128 Gauss grids.  At each tested
degree, the direct half-moment angle and the Green-transfer angle agree to
better than `9e-14` relative scale, while the sampled shifted correlation
takes both signs:

| odd degree | sampled `min K_n` | sampled `max K_n` | sampled sign-change brackets |
|---:|---:|---:|---|
| 3 | `-5.6867e1` | `2.2999` | `(0.2426,0.2579)` |
| 5 | `-2.6624e4` | `1.1195e6` | `(0.3395,0.3569)` |
| 7 | `-3.4995e9` | `2.5007e10` | `(0.3395,0.3569)`, `(0.5876,0.6084)` |

This is a reproducible floating structure diagnostic, not an interval
certificate.  It strongly retires `K_n>=0` as a working actual-theta
conjecture, including at degrees 5 and 7 where the integrated angle is
strictly positive.  The mathematical conclusion retained below is therefore
the signed compensation identity, not the sampled pointwise signs.

## Positive arithmetic Abel primitive

The arithmetic transform supplies a stronger exact reformulation that keeps
the sign changes.  Let `j_m` denote the positive coefficients called
`J_2(m)` in the imported operator `U`, and put

\[
 \Gamma_n(x)=x^2\int_0^\infty u e^{2u}F_n(u)
 [q_n(D+2)\psi](u+\log x)\,du.
\]

Under the same absolute-convergence hypotheses as the Green transfer,

\[
 {\cal K}_n(t)=\sum_{m\ge1}j_m m^{-5/2}\Gamma_n(me^t).       \tag{5}
\]

Consequently

\[
 C_n(a)=\int_1^\infty x^{-a-1}\Gamma_n(x)
 \sum_{m\le x}j_m m^{a-5/2}\,dx.                           \tag{6}
\]

Define

\[
 S_0(x)=\sum_{m\le x}j_m,\qquad
 S_1(x)=\sum_{m\le x}{j_m\over m},
\]

\[
 \mathfrak H(x)=x^{-3}\{xS_1(x)-S_0(x)\}
 =x^{-3}\sum_{m\le x}j_m\left({x\over m}-1\right)\ge0.
\]

New summands vanish at `x=m`, so `mathfrak H` is continuous there, and
almost everywhere

\[
 \mathfrak H'(x)=x^{-4}\{3S_0(x)-2xS_1(x)\}.
\]

With `Z_n(x)=x^(1/2) Gamma_n(x)`, equations (5)--(6) give the exact signed
target in positive-weight form:

\[
 \boxed{3C_n(5/2)-2C_n(3/2)
 =-\int_1^\infty\mathfrak H(x)Z_n'(x)\,dx.}                 \tag{7}
\]

The boundary terms vanish because `mathfrak H(1)=0`, `mathfrak H` is
bounded, and the theta packet makes `Z_n(infinity)=0`.  Thus the surviving
all-degree payment is

\[
 -\int_1^\infty\mathfrak H(x)Z_n'(x)\,dx
 \ge {\sigma_n\over2\pi}(A_n-nB_n).                        \tag{8}
\]

This replaces the sign-changing fixed kernel by a positive,
degree-independent arithmetic weight without taking an absolute value of
the degree-dependent correlation.  A pointwise conjecture `Z_n'<=0` would
be sufficient, but it would also force `Gamma_n>=0` and hence `K_n>=0` in
(5).  The actual-theta floating diagnostic therefore strongly disfavors that
shortcut.  Equation (8), with signed variation retained, is the live target.

## Common scale with the Ewald head

The same change of variables puts the angle on the multiplicative scale of
the wave-24 Ewald cells.  The original transfer integral is

\[
 \int_0^\infty R(t){\cal K}_n(t)\,dt
 =\int_1^\infty\Gamma_n(x)
 \{2x^{-5/2}S_1(x)-3x^{-7/2}S_0(x)\}\,dx.                 \tag{9}
\]

Put

\[
 P(x)=-{4\over3}S_1(x)x^{-3/2}+{6\over5}S_0(x)x^{-5/2}.
\]

Between integers, `P'` is the brace in (9), while its jump at `m` is
`-(2/15)j_m m^(-5/2)`.  Stieltjes integration by parts gives

\[
 \int R{\cal K}_n
 =-\int_1^\infty P(x)\Gamma_n'(x)\,dx
 +{2\over15}\sum_{m\ge1}j_m m^{-5/2}\Gamma_n(m).          \tag{10}
\]

Combining (10) with the imported exact wave-24 quadrature-discrepancy
identity `H^0_(n,J)+E_(n,J)=Lambda_J^par[mathcal J_n]` produces one
correlated sufficient gate:

\[
 \Lambda_J^{\rm par}[\mathcal J_n]
 +{8\pi\over\sigma_n}\int_1^\infty P\Gamma_n'
 -{16\pi\over15\sigma_n}\sum_{m\ge1}j_m m^{-5/2}\Gamma_n(m)
 >4(A_n-nB_n).                                             \tag{11}
\]

Unlike separate head and angle estimates, (11) can be split at the same
integer `J` and retain cellwise cancellation.  No sign or comparison between
the Ewald source `mathcal J_n` and `Gamma_n` is currently proved; (11) is a
new exact reduction, not a payment theorem.

## Scope and nonclaims

This is a route obstruction, not an actual-theta counterexample.

- The model satisfies the exact local source identity (1), the corresponding
  Green transfer, strict profile positivity, correct polynomial parity and
  monicity, and a positive abstract Jacobi prefix.
- It does **not** assert `B=U psi` for the campaign's arithmetic translate
  operator, satisfy the imported `0.9/1.1` weighted operator estimate, or
  claim that these polynomials are selected by the actual-theta moment
  functional.
- It therefore does not refute a complete-theta localization theorem.  It
  shows that such a theorem must use precisely the arithmetic/selection
  information omitted by this model.
- The sampled actual-theta sign changes are nonrigorous floating diagnostics.
  They guide route selection but are not used as a mathematical
  counterexample.
- Equations (5)--(11) retain the wave-27 absolute convergence and Fubini
  assumptions and the wave-24 Ewald-source definitions; this checkpoint does
  not independently reprove those analytic inputs.
- No next pivot, Xi--Laguerre inequality, all-degree theorem, or RH conclusion
  follows.

The companion standard-library verifier checks the Jacobi recurrence, the
local source identity mode by mode, the algebraic coefficient cancellation,
the strict rational root brackets, and the exact constants in (2)--(4).
