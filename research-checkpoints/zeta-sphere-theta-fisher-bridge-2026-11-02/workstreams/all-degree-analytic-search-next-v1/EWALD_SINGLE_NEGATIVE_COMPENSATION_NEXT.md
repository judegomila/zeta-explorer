# A one-negative-cell collapse for the first odd Ewald aggregate

## Scope and outcome

For the actual degree-one residual, the frozen diagnostic has the sign pattern

\[
 e_1>0,
 \qquad e_2<0,
 \qquad e_n\geq0\quad(n\geq3).
 \tag{1}
\]

Only the middle sign in (1) is currently certified: the complete Arb result
in `EWALD_KAPPA1_E2_CERTIFICATE_NEXT.md` proves `e_2<0`, while the Bessel
theorem proves `e_n>0` only eventually.  Thus (1) remains an explicit
additional hypothesis, not a result of this note.

Conditional on (1), the aggregate reverse-order inequality has a much smaller
exact form.  It holds on the whole Abel interval if and only if one endpoint
moment is nonpositive:

\[
 \boxed{
 D(z)=P'(z)N(z)-P(z)N'(z)\leq0
 \quad(0<z\leq1)
 \iff
 S'(1)-2S(1)\leq0.}
 \tag{2}
\]

The magnitude of the negative second cell cancels from the test; its strict
negativity only supplies a positive overall factor.  Equation (2) keeps the
favorable low-index/high-index compensation and is strictly weaker than the
already-refuted cutoff-by-cutoff stochastic order.

The endpoint in (2) has a complete spectral and physical correlation formula.
Consequently an actual proof program needs only:

1. the finite missing signs in (1), joined to an explicit eventual-positive
   Bessel threshold;
2. one endpoint correlation `S'(1)-2S(1)<=0`;
3. the separate half-seed and derivative-mass conditions already required by
   the bounded Abel lemma.

This is a conditional analytic reduction, not a certificate of (1) or (2),
not a pivot theorem, and not an RH result.

## 1. Exact collapse of the aggregate Wronskian

Let

\[
 S(z)=\sum_{n\geq1}e_nz^n=P(z)-N(z),
 \qquad
 P(z)=\sum e_n^+z^n,
 \qquad
 N(z)=\sum e_n^-z^n.
 \tag{3}
\]

The cells are rapidly decreasing, so all displayed series and their
derivatives converge through `z=1`.  Under (1), put `b=-e_2>0`.  Then

\[
 N(z)=bz^2,
 \qquad
 P(z)=S(z)+N(z).
 \tag{4}
\]

Substitution into the exact placement term gives

\[
 \begin{aligned}
 D(z)
  &=\{S'(z)+N'(z)\}N(z)-\{S(z)+N(z)\}N'(z)\\
  &=S'(z)N(z)-S(z)N'(z)\\
  &=bz\{zS'(z)-2S(z)\}.
 \end{aligned}
 \tag{5}
\]

Define

\[
 F(z):={zS'(z)-2S(z)\over z}
       =-e_1+\sum_{n\geq3}(n-2)e_nz^{n-1}.
 \tag{6}
\]

Every coefficient in `F'` is nonnegative:

\[
 F'(z)=\sum_{n\geq3}(n-2)(n-1)e_nz^{n-2}\geq0.
 \tag{7}
\]

Therefore `F` is nondecreasing on `[0,1]`, and (5) has the same sign as
`F`.  Its maximum occurs at the endpoint,

\[
 F(1)=S'(1)-2S(1),
 \tag{8}
\]

which proves (2).  Strict endpoint inequality gives strict `D(z)<0` for
every `0<z<=1`.  Conversely, `D(1)<=0` forces (8), so the endpoint condition
is also necessary under (1).

The pairwise compensation is visible directly.  The negative cell at index
two pairs favorably with `e_1`, and unfavorably with every positive later
cell:

\[
 {D(z)\over bz^2}
 =-e_1+\sum_{n\geq3}(n-2)e_nz^{n-1}.
 \tag{9}
\]

Unlike the cutoff-by-cutoff order, (9) permits the entire positive Bessel tail
provided its aggregate index excess is paid by `e_1`.

## 2. The endpoint is one completed correlation

The complete-cell identities give

\[
 S(1)={1\over\pi}\int_{\mathbb R}q(t)^2
       \mathcal B(\Xi,\Xi)(t)\,dt,
 \tag{10}
\]

and

\[
 S'(1)={1\over2\pi}\int_{\mathbb R}q(t)^2
       \mathcal B(\Xi,H_1)(t)\,dt,
 \qquad
 H_1=-s(2-s)\pi^{-s/2}\Gamma(s/2)\zeta(s-1).
 \tag{11}
\]

Linearity in the second entry of `mathcal B` therefore gives the exact scalar
test

\[
 \boxed{
 S'(1)-2S(1)
 ={1\over2\pi}\int_{\mathbb R}q(t)^2
 \mathcal B(\Xi,H_1-4\Xi)(t)\,dt.}
 \tag{12}
\]

Writing `A(s)=pi^(-s/2)Gamma(s/2)` and
`2Xi=s(s-1)A(s)zeta(s)`, the completed multiplier is

\[
 \boxed{
 H_1-4\Xi
 =-sA(s)\{(2-s)\zeta(s-1)+2(s-1)\zeta(s)\}.}
 \tag{13}
\]

No separate cell sign or quotient by `Xi` occurs in (12)--(13).

There is also an ordinary physical-space form.  Let `eta` be the real even
packet from `EWALD_ENDPOINT_PACKET_SIGN_NEXT.md`, so that
`widehat eta=Re H_1`, and retain `Xi=(1/2)widehat psi`.  Put

\[
 \theta=\eta-2\psi,
 \qquad
 R_{1,2}(u)={1\over8}\int_{\mathbb R}v^2
 \psi\!\left({u+v\over2}\right)
 \theta\!\left({u-v\over2}\right)\,dv.
 \tag{14}
\]

The audited convolution normalization then yields

\[
 \boxed{
 S'(1)-2S(1)=[q(-iD)^2R_{1,2}](0).}
 \tag{15}
\]

The packet `theta` is signed; (15) is a correlated endpoint test, not a
pointwise-positivity claim.

## 3. The other Abel gates also simplify under the sign pattern

The half-seed has the immediate lower bound

\[
 S(1/2)
 ={e_1\over2}+{e_2\over4}
   +\sum_{n\geq3}{e_n\over2^n}
 \geq {2e_1+e_2\over4}.
 \tag{16}
\]

Thus `2e_1+e_2>=0` pays the seed once (1) is known.

The derivative condition cannot be reduced to endpoints alone, but it has a
one-turn geometry.  Differentiating three times gives

\[
 S'''(z)=\sum_{n\geq3}n(n-1)(n-2)e_nz^{n-3}\geq0.
 \tag{17}
\]

Hence `S''` is nondecreasing, and `S'` has at most one interior minimizer on
`[1/2,1]`.  A rigorous derivative proof can therefore use exactly one of:

- `S''(1/2)>=0`, in which case the minimum of `S'` is at `1/2`;
- `S''(1)<=0`, in which case the minimum is at `1`;
- otherwise, the unique zero of the monotone function `S''`, enclosed once
  by interval arithmetic.

In the last case strict uniqueness follows as soon as one `e_n>0` with
`n>=3`; the actual eventual-positive Bessel tail supplies that input if the
finite missing signs in (1) are certified.

This is not yet a proof that the minimum is positive, but it replaces a dense
Abel grid by one monotone-root enclosure.

## 4. A finite-head/tail certificate for the new endpoint

Fix `N>=3` and suppose (1) has been certified through `N`, while the Bessel
estimate proves `e_n>=0` for `n>N`.  Then

\[
 S'(1)-2S(1)
 =-e_1+\sum_{n=3}^{N}(n-2)e_n
   +\sum_{n>N}(n-2)e_n.
 \tag{18}
\]

The last term is nonnegative and is bounded above by the `r=1` absolute tail
majorant in `EWALD_SCALAR_CELL_TAIL_NEXT.md`.  Consequently a single outward
head enclosure plus that analytic tail proves (12).  This is sharper than the
generic bilinear error bound for `D-D_N`: it uses the actual sign placement
and certifies every Abel parameter at once.

Equivalently, one may certify (12) directly with its completed multiplier
(13), using the same real-line quadrature plus spectral-tail architecture as
the certified `e_2` calculation.  Either route is an endpoint certificate,
not a finite-cell table presented as an all-index result.

For orientation only, the existing first-ten-cell floating diagnostic gives

\[
 S(1)\approx0.3692731,
 \qquad S'(1)\approx0.3158752,
 \qquad S'(1)-2S(1)\approx-0.4226709.
 \tag{19}
\]

These numbers are not interval evidence.  They only show that the endpoint
test exposed by (2) is not numerically marginal in that diagnostic.

## 5. Exact scope and next proof obligations

The rigorous conclusion of this note is the conditional equivalence (2) and
the exact correlations (12), (15).  To apply them to the actual degree-one
residual one must still certify:

1. `e_1>0` and every finite sign between index three and an explicit
   eventual-positive Bessel threshold;
2. the endpoint inequality (12);
3. the half-seed, for example through (16);
4. the positive minimum of `S'`, using the one-turn reduction (17).

The already certified `e_2<0` supplies only one of those inputs.  No finite
set of floating cells, including the diagnostic behind (19), proves the sign
pattern or the endpoint.  Even if all four obligations are discharged, the
result would establish the bounded Abel hazard only for the first odd rung;
it would not be an all-degree first Xi--Laguerre theorem or an RH proof.

## Reproduction

`src/verify_ewald_single_negative_compensation.py` is a standard-library
exact-rational replay.  It checks the polynomial identity (5), the coefficient
formula (6), endpoint collapse (8), pairwise expansion (9), seed bound (16),
and monotonicity coefficients (7), (17) on deterministic finite exemplars.

Two clean executions produced the same receipt.  The frozen SHA-256 values
are

```text
checker  493e926d2d93f5246359ac57b55defdc1752dbf1fd73d2584a56272f226c9d6e
receipt  0a2ba64c8401934cd26494a9d706dc393e93dfd4e426dd0b749ffe7884051057
```
