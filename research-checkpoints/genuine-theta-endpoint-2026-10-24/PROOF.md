# Genuine theta-heat field: a finite collision-free box

24 October 2026. This is a reproducible computer-assisted local certificate,
conditional on the analytic bounds below and correctness of Python/python-flint/Arb.
It is not a proof-assistant proof, independent external peer review, an RH proof,
a new bound for the de Bruijn–Newman constant, or a novelty claim.

## Result

For the genuine family

H_t(x) = integral_0^infinity exp(t u^2) Phi(u) cos(xu) du,

Phi(u) = sum_(n>=1) [2 pi^2 n^4 exp(9u) - 3 pi n^2 exp(5u)]
                    exp(-pi n^2 exp(4u)),

let G(t,x) = H_t(x) + i partial_x H_t(x).

The endpoint-stress checker certifies that G is nonzero everywhere in the closed rectangle
Q = [0,1/2] x [200,220]. It separately certifies boundary winding zero,
with counterclockwise orientation in coordinate order (t,x).

The boundary is covered by 24 continuous interval segments. The certified
boundary lower bound is |G| > 2.76e-35. The entire closed box is covered by
90 interval rectangles, each of whose image enclosures excludes zero.
That direct interior certificate does not require a collision-index theorem,
an all-real starting configuration, or any assumption that RH is true.

Both 384-bit and 512-bit runs passed. These are two precisions of one
implementation, not independent implementations. The boundary argument-sum
interval divided by 2 pi lies within [-2.93e-33,2.93e-33]; since it contains
the integer winding, that integer is exactly zero. Computation uses actual
Arb comparisons, not rounded decimal claims from this note.

This box contains the previously reported approximate Q4-channel zero near
(t,x)=(0.29224249,210.99924687). The certificate concerns the genuine H, not
that finite asymptotic channel. No division by that channel occurs.

## Finite integral and analytic derivative enclosure

Set t0=1/4, x0=210, N=7, and

F(t,x) = integral_0^1 exp(t u^2) Phi_N(u) cos(xu) du.

Every summand of Phi_N is positive for real u>=0, since
2 pi n^2 exp(4u)>3. All differentiations in the finite integral are justified
by analyticity on compact sets. Define D_m=partial_x^m F(t0,x0).

The script encloses D_m for 0<=m<=193 using python-flint 0.9.0's acb.integral.
Its callback is an entire function of the complex integration variable:
integer powers, exponentials, sine, cosine, and finite sums only. It therefore
has no branch cuts or analyticity exceptions when the callback's analytic
flag is true. acb.integral uses rigorous analytic quadrature enclosures;
its returned balls, not requested tolerances alone, are used throughout.
Requested absolute tolerance is 1e-85 and relative tolerance is 1e-80.
All values must be finite; the real parts enclose the real integrals.

No claim is based on ordinary floating-point integration or comparing two
quadrature outputs. Arb tracks the errors of both arithmetic and quadrature.
Increasing precision is a replay, not a substitute for these error bounds.

## Two-variable Taylor approximation and its uniform remainder

Write dx=x-x0, dt=t-t0; throughout Q, |dx|<=X=10, |dt|<=T=1/4.
Choose J=112 and K=40. The polynomial for component l=0 or 1 is

P_l(dt,dx) = sum_(k=0)^K sum_(j=0)^J
 (-1)^k D_(j+2k+l) dt^k dx^j / (k! j!).

For l=0 this approximates F; for l=1 it approximates partial_x F.
The identity follows directly from differentiating under the integral:
partial_t^k partial_x^j F = (-1)^k partial_x^(j+2k) F.

A convenient bound for the finite positive kernel mass at t0 is

M = 2 pi^2 exp(19/2) sum_(n=1)^7 n^4 exp(-pi n^2) < 20000.

Indeed 0<=u<=1, t0<=1/2, and we can discard the negative term of each
positive kernel summand. This deliberately crude bound is enough.

First expand exp(dt u^2) through order K at fixed real x. The real exponential
Taylor remainder is at most exp(T) T^(K+1)/(K+1)! on this interval. Multiply
by the positive kernel and integrate. For the derivative component there is
one additional factor u, which is at most one.

Then expand the sine or cosine in dx through order J in each retained time
coefficient. On the real line every derivative of sine and cosine has
absolute value at most one. Thus its remainder is at most
X^(J+1)/(J+1)!, with no complex-domain or differentiated-error assumption.
The sum of absolute retained time coefficients is at most exp(T).
Consequently, for both components, uniformly on the entire real box,

|F_l - P_l| <= M exp(T) [T^(K+1)/(K+1)! + X^(J+1)/(J+1)!].

All higher derivatives D_m here are of the finite integral F, not unbounded
moments of the full integral. The full-function tails are added only after
this finite-domain Taylor approximation. This avoids an unjustified
high-moment tail estimate.

## Infinite theta and integral tails

For u in [0,1], the omitted theta summands, including a factor u for the
spatial derivative if present, have absolute integral bounded by

E_series = 2 pi^2 exp(19/2) (N+1)^4 exp(-pi(N+1)^2)
           / [1 - 16 exp(-pi(2N+3))].

This follows by bounding u and exponentials as above, discarding the negative
term, and summing a geometric majorant for n^4 exp(-pi n^2). Its successive
ratio is at most 16 exp(-pi(2N+3)) for n>=N+1. The denominator is positive.
The bound applies uniformly for all real x and 0<=t<=1/2.

For u>=1, both value and first-spatial-derivative integrands are bounded in
absolute value by the sum of

f_n(u)=2 pi^2 n^4 u^2 exp(u^2/2+9u-pi n^2 exp(4u)).

The logarithmic derivative satisfies

(log f_n)' = u+9+2/u-4 pi n^2 exp(4u) <= -500 n^2.

To check it, g(u)=4 pi exp(4u)-u-9-2/u is increasing for u>=1,
and g(1)>588>500 using pi>3 and exp(4)>50. Multiplying the positive terms
u+9+2/u by n^2 only weakens the bound. Hence integral_1^infinity f_n
is at most f_n(1)/(500 n^2). With A=pi exp(4), summing another geometric
majorant yields

E_u = [2 pi^2 exp(19/2)/500] exp(-A) / [1-4 exp(-3A)].

The theta-series tail on [0,1] and full integral tail on [1,infinity) are
disjoint omitted domains, so no omitted part of the genuine function is
ignored. The same bounds apply to both H and Hx because |cos|,|sin|<=1
for real x,u and the derivative contributes u<=1 on the first domain,
or u<=u^2 on the second.

Thus each component of G is approximated by its polynomial with error at
most E_total=E_series+E_u+E_Taylor. After multiplication by the positive
constant 10^35, the checker proves E_total*10^35 < 6.577e-33.
Polynomial coefficient balls separately retain all quadrature and arithmetic
errors; these are not silently discarded into the analytic remainder.

## Continuous boundary and exact winding

We multiply the field by 10^35, a fixed positive scalar that changes neither
zeros nor winding. Restrict the bivariate polynomial to each edge. For an
edge parameter interval [a,b], translate its polynomial to midpoint
coordinates by polynomial composition and evaluate it on the entire interval
[-(b-a)/2,(b-a)/2] using Arb complex rectangles. Enlarge each Cartesian
component by the analytic error above.

Accept a segment only if one entire Cartesian component has strict sign.
Its image enclosure therefore lies in an open coordinate half-plane and
excludes zero at every point, not just sample points. If it fails, bisect
and repeat. The successful subintervals cover each original closed edge.

Evaluate endpoint enclosures with the same uniform remainder. For each
accepted segment, the principal argument of G(b)/G(a) equals the net
argument change along the actual field: the entire field segment lies in
one open coordinate half-plane, so its argument lift has range of width
less than pi. Interval division and argument enclose that increment.
Adding increments around the closed boundary therefore encloses 2 pi times
the actual winding. The accepted total divided by 2 pi is strictly between
-1/2 and 1/2, proving the winding is the integer zero.

Equivalently, each image segment can be homotoped to its endpoint chord
inside a convex rectangle avoiding zero. There is no inference from grid
sampling to continuous nonvanishing.

## Independent direct interior coverage

For each real parameter rectangle, translate each x-polynomial to that
rectangle's x midpoint and evaluate its full x interval, retaining the
result as a coefficient enclosure for a polynomial in dt. Translate that
time polynomial to the time midpoint and evaluate the full time interval.
Add the same analytic component errors.

Accept only when at least one entire image component has strict sign;
otherwise bisect a parameter interval. The successful 90 closed cells
cover all Q, and each excludes G=0. This proves directly that H_t(x) and
partial_x H_t(x) cannot both vanish anywhere in Q, independently of any
higher-multiplicity local-index assertion.

## Scope and remaining global gap

This is one bounded-height box that includes deformation time zero. It does
not exclude off-real zeros, prove all zeros real at these times globally,
cover every height, or control the joint limit of vanishing time and increasing height. The proposed RH route
still needs a theorem supplying genuine-field exclusion or winding control
on an appropriate exhaustion as t decreases to zero and height increases,
together with the established tail/strip/continuation machinery. Finite
successes, even many of them, cannot replace that universal statement.

## Sources and reproduction

Normalization and theta family:
https://arxiv.org/abs/1801.05914
https://terrytao.wordpress.com/2018/01/19/the-de-bruijn-newman-constant-is-non-negativ/

Existing central-certificate conventions and tails:
https://github.com/judegomila/mathexplorer/pull/17

Existing collision limitations:
https://github.com/judegomila/mathexplorer/pull/16

Rigorous quadrature interface and analytic-callback contract:
https://python-flint.readthedocs.io/en/latest/acb.html
https://flintlib.org/doc/acb_calc.html

Run in a fresh Python environment after installing the pinned requirement.
Use the disposable-copy commands in [README.md](README.md) so the frozen
saved certificates are not overwritten.

All mathematical inputs are constants in the script. The JSON outputs record
all derivative balls, boundary segments, interior cells, and error budgets.
Neither the computation nor replay needs private files or network inputs.


## Exact saved-certificate verification

Each accepted image rectangle is also exported with exact rational directed
lower and upper endpoints of both Cartesian components. Display strings for
wide Arb balls alone can lose sign information, so they are not the certificate
format used by the offline verifier. All parameter endpoints are exact fractions.

verify_saved_certificate.py uses only Python's rational arithmetic to check
that the edge intervals concatenate to the entire oriented boundary; all image
rectangles exclude zero; interior cells lie within Q, have pairwise disjoint
interiors, and have total area exactly 10. Because their union is closed, the
area and disjointness checks establish complete coverage, including boundaries.

It also independently computes winding by choosing rational vertices in each
pair of consecutive image-box intersections. Each polygon edge lies inside its
corresponding convex origin-free box. The true curve can be homotoped to this
polygon within those boxes, using their intersections at shared endpoints.
An exact rational ray-crossing algorithm gives polygon winding zero. This is
an independent winding calculation, not an independent proof of the integral
enclosures. The saved geometry cannot by itself establish that genuine G lies
in those boxes; regenerate the certificate and review the analytic lemmas for
that part. Run: python verify_saved_certificate.py.

This separate endpoint test preserves the original [1/5,1/3] archive unchanged.
It increases the time Taylor order from 24 to 40 and changes the time center
and radius to 1/4. The same tail estimates remain valid on 0<=t<=1/2.
The successful computation shows that this local representation introduces no
artificial singularity as t reaches zero at fixed finite height. It is not
a new verified-zero-height record or a bound on the global Newman constant.
