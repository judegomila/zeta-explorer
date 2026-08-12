# Generic finite commensurable phase transversality via a resultant

## 0. Outcome and fail-closed boundary

Fix a finite one-dimensional commensurable support

\[
 1\leq k_1<\cdots<k_m=n,
\]

and fix `B, omega > 0`.  For the locked inverse-square coefficients

\[
 b_k=(B+ik\omega)^{-2}
\]

and arbitrary positive real weights `r_1,...,r_m`, this note proves a
generic statement in **weight space**.  If there is no phase with

\[
 P>0,\qquad {\cal C}=PW-V^2<0,                    \tag{0.1}
\]

then an explicit Sylvester resultant in the weights vanishes.  That
resultant is not the zero polynomial.  Consequently the possible failure
weights lie in a proper real-algebraic zero set, which has empty interior
and Lebesgue measure zero in the positive orthant.  Equivalently, (0.1)
holds on an open dense full-measure set of positive real weights for every
fixed support, `B`, and `omega`.

This is not a universal theorem.  The exceptional algebraic set can be
nonempty, and this note does not prove that its points are favorable.  In
particular it does not settle a prescribed positive integer multiplicity
vector.  It also does not assert that an actual attained zeta edge is
finite or commensurable.  Nothing here proves RH or its negation, a Lambda
bound, a routing contraction, a positive full Laplacian, or equation (5.2)
of `DIRECT_RH_ATTACK.md`.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies and setup

The proof and exact regression are bound to these bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md` | `ae87b9100f8eea9ec9feddeec7f8343197ba5c14b25b2245afb96a2deec45fb1` |
| `notes/FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md` | `00db33f1263cbb7eeb1fed4d500d683920cd2444ccef58112b46ee67414904ff` |
| `notes/TWO_FREQUENCY_PHASE_TRANSVERSALITY_THEOREM.md` | `6a704c20640a9c113836904e91c7fafbe12bee0a03d31f623faad988bd306959` |

For `z=e^(it)`, define

\[
 \begin{aligned}
 P(t)&=\sum_{j=1}^m r_j
       \{b_{k_j}z^{k_j}+\overline {b_{k_j}}z^{-k_j}\},\\
 V(t)&=\sum_{j=1}^m r_j
       \{b_{k_j}^2z^{k_j}+\overline {b_{k_j}}^{\,2}z^{-k_j}\},\\
 W(t)&=\sum_{j=1}^m r_j
       \{b_{k_j}^3z^{k_j}+\overline {b_{k_j}}^{\,3}z^{-k_j}\},\\
 {\cal C}(t)&=P(t)W(t)-V(t)^2.
 \end{aligned}                                     \tag{1.1}
\]

These are exactly the finite-edge functions after parametrizing a
one-dimensional commensurable hull.  A common divisor of all `k_j` merely
causes the same primitive circle to be traversed repeatedly; it does not
affect the argument.

The function `P` is a nonzero real trigonometric polynomial with mean zero.
Indeed its positive-frequency coefficients are nonzero and occur at
distinct frequencies.  Hence `P` takes both signs.

## 2. Failure forces every sign boundary to be common

Suppose (0.1) fails, so that

\[
 {\cal C}(t)\geq0\quad\hbox{whenever}\quad P(t)>0. \tag{2.1}
\]

Let `t_0` be any sign-changing zero of `P`.  There are points with `P>0`
arbitrarily close to `t_0`.  Passing to the limit in (2.1) and using
`P(t_0)=0` gives

\[
 0\leq {\cal C}(t_0)=-V(t_0)^2\leq0.
\]

Therefore

\[
 \boxed{P(t_0)=V(t_0)=0}                           \tag{2.2}
\]

at **every** sign-changing boundary point.  Conversely, if just one such
boundary has `V(t_0) != 0`, then `C(t_0)<0`, and continuity supplies a
nearby point on the `P>0` side satisfying (0.1).

## 3. Polynomial lifts and the resultant obstruction

Multiply the Laurent polynomials for `P` and `V` by `z^n`:

\[
 \begin{aligned}
 F_{\boldsymbol r}(z)
  &=\sum_{j=1}^m r_j\{b_{k_j}z^{n+k_j}
       +\overline {b_{k_j}}z^{n-k_j}\},\\
 G_{\boldsymbol r}(z)
  &=\sum_{j=1}^m r_j\{b_{k_j}^2z^{n+k_j}
       +\overline {b_{k_j}}^{\,2}z^{n-k_j}\}.
 \end{aligned}                                     \tag{3.1}
\]

Because `r_m>0`, both lifts have exact degree `2n` and a nonzero constant
term.  On the unit circle,

\[
 F_{\boldsymbol r}(e^{it})=e^{int}P(t),\qquad
 G_{\boldsymbol r}(e^{it})=e^{int}V(t).            \tag{3.2}
\]

Let

\[
 {\cal R}(\boldsymbol r)
   =\operatorname {Res}_z(F_{\boldsymbol r},G_{\boldsymbol r}). \tag{3.3}
\]

The coefficients in (3.1) depend linearly on the real weights.  Thus
`R` is a complex-coefficient homogeneous polynomial in the weights.  Since
the two polynomial degrees are `2n`, its total weight degree is `4n`.
Equation (2.2) gives a common unit-circle root, so every failure vector
satisfies

\[
 \boxed{{\cal R}(\boldsymbol r)=0.}                \tag{3.4}
\]

Periodicity in fact supplies at least two distinct sign-changing zeros.
Consequently failure forces `deg gcd(F_r,G_r) >= 2`, a stronger first-
subresultant condition.  No codimension claim for that smaller pulled-back
set is needed here.

## 4. The resultant polynomial is not identically zero

It remains essential to show that (3.4) is a proper condition, rather than
an identity caused by the locked coefficients.  Specialize algebraically
to the boundary weight vector

\[
 r_m=1,\qquad r_1=\cdots=r_{m-1}=0,
\]

and put `b=b_n`.  Then

\[
 F(z)=bz^{2n}+\overline b,qquad
 G(z)=b^2z^{2n}+\overline b^{\,2}.                \tag{4.1}
\]

Their binomial resultant is

\[
 \operatorname {Res}(F,G)
  =(b\overline b^{\,2}-b^2\overline b)^{2n}
  =\{|b|^2(\overline b-b)\}^{2n}.                 \tag{4.2}
\]

But

\[
 \Im b_n={-2Bn\omega\over(B^2+n^2\omega^2)^2}<0, \tag{4.3}
\]

so (4.2) is nonzero.  This proves that `R` is not the zero polynomial.
It also gives a direct topological check: by continuity, all sufficiently
small positive lower-mode weights preserve a nonzero resultant, so the
positive orthant itself contains favorable vectors.

For a real-algebraic formulation, write `R=R_1+iR_2` on real weight
space and put

\[
 H(\boldsymbol r)=R_1(\boldsymbol r)^2
                  +R_2(\boldsymbol r)^2.          \tag{4.4}
\]

This is a nonzero real polynomial and `R=0` exactly when `H=0`.  The zero
set of a nonzero real polynomial has empty interior and Lebesgue measure
zero.  Combining (3.4) and (4.4) proves the generic theorem stated in
Section 0.

## 5. Exact three-frequency favorable fixtures

The algebraic theorem does not need a numerical example.  For a transparent
exact check, take `B=omega=1`, all three weights equal to one, and `z=i`.
Direct rational arithmetic gives:

| support | `P` | `V` | `W` | `C` |
|---|---:|---:|---:|---:|
| `(1,2,3)` | `28/25` | `26/625` | `-8339/31250` | `-117422/390625` |
| `(1,2,4)` | `8209/7225` | `1370544/52200625` | `-399804155209/1508598062500` | `-455294930593/1508598062500` |
| `(1,3,4)` | `5608/7225` | `1203502/52200625` | `-190017743099/754299031250` | `-73945767296/377149515625` |

Thus all three fixtures have `P>0` and `C<0`.  They demonstrate exact
favorable points only; they do not remove their exceptional resultant
sets.

## 6. Diagnostic search, not proof

The supports `(1,2,3)`, `(1,2,4)`, and `(1,3,4)` were also searched after
normalizing `B=1` and writing `x=omega/B`.  A necessary-condition search
did not merely sample `C`: it tuned two prescribed roots to satisfy
`P=V=0`, then enumerated every sign-changing zero of `P`.  Across 21
logarithmically spaced `x` values in `[0.1,10]` and 3,150 Newton starts per
support, it retained respectively 51, 84, and 46 distinct tuned solutions.
None made all sign-changing zeros common.  Every retained solution had an
additional boundary with `V != 0`, and therefore a favorable nearby phase.

As spot checks, 80-decimal refinement at `x=1` produced tuned positive
weight vectors with two common boundaries but the following remaining
transverse geometry:

| support | weights (rounded) | sign boundaries | transverse boundaries | smallest displayed transverse `|V|` |
|---|---|---:|---:|---:|
| `(1,2,3)` | `(1,33.61111021,139.12225973)` | 6 | 4 | `1.50685628` |
| `(1,2,4)` | `(1,2.91540020,106.54014525)` | 8 | 6 | `0.05907770` |
| `(1,3,4)` | `(1,13.29600536,86.04058253)` | 8 | 6 | `0.17309847` |

A separate boundary-loss search was driven only toward the degeneracies
`x -> 0`, `x -> infinity`, or a vanishing weight; dense phase audits still
found `C<0` on `P>0`.  All statements in this section are floating-point
diagnostics.  They are neither exhaustive nor inputs to Sections 2--4.
No exact compatible failure was found, but the exceptional algebraic set
may contain one.

## 7. Scope boundary

The result is confined to a fixed finite one-dimensional commensurable
integer support and generic positive real weights.  It does not handle an
arbitrary relation lattice, a prescribed exceptional or integer weight
vector, a countably infinite attained edge, a nonattained edge, higher
Schur pivots, full-section connectivity, Laplacian positivity, or routing
contraction.  No source lock, status, replay, integration, or checkpoint
artifact is changed by this package.
