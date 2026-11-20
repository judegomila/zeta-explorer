# Rigorous topological certificates for bounded zeta regions

## Result

The generator and a separate verifier process were run successfully using
python-flint 0.9.0 (FLINT 3.6.0 / Arb), with 160-bit complex ball arithmetic and exact
Python rational/integer arithmetic for the polygon winding counts.

| Region in the z-plane | Certified total zero count | Certified real simple zeros | Other zeros in the region |
| --- | ---: | ---: | ---: |
| 0 < Re z < 144, -1/2 < Im z < 1/2 | 50 | 50 | 0 |
| 7005 < Re z < 7005.125, -1/2 < Im z < 1/2 | 2 | 2 | 0 |

Here z is the critical-line coordinate: s = 1/2 + i z. Thus a real zero in
z is exactly a zero on Re s = 1/2. The first region covers the entire critical
strip for heights from 0 to 144. The second region also covers the entire
critical strip for its stated height interval, containing the close pair near
7005.062866174921 and 7005.100564672647. No assertion is made about heights
between the two bands or beyond them.

All 50 low cages have radius 1/64. The two close-pair cages have radius 1/512.
Their centers and all contour vertices are exact dyadic rationals. Decimal
heights shown in this document and in `display_only` certificate fields are
explanatory only.

This reproduces established finite zero information to validate the proposed
certificate mechanism. It is **not a proof of RH, a new zero-free strip, or a
new record in finite RH verification**. There is no all-height coverage theorem.

## Files and rerun

- `xi_certificates.py`: independent generation and verification modes.
- `certificates.json.gz`: the complete rational proposals, boundary subdivisions,
  and image polygons, losslessly compressed with a deterministic gzip timestamp
  of zero. The uncompressed JSON is about 1.5 MB and need not be distributed.
- `verification_report.json`: counts, negative-control outcomes, timing, and
  SHA-256 of the verified certificate.
- `requirements.txt`: pinned rigorous numerical dependency.

Install the dependency and run:

```bash
python -m pip install -r requirements.txt
python xi_certificates.py verify --certificate certificates.json.gz
```

To regenerate the proposals, followed by a separate verification process:

```bash
python xi_certificates.py generate --certificate certificates.json.gz
python xi_certificates.py verify --certificate certificates.json.gz
```

Both modes accept either `.json` or `.json.gz` paths transparently. The default
is `certificates.json.gz`. The verifier hashes the exact uncompressed JSON as
`certificate_sha256` and separately hashes the delivered bytes as
`artifact_sha256`; compression does not change the mathematical certificate.

Generation uses `acb.zeta_zero` to propose centers. The verifier never calls
that routine, never trusts a zero index or proposed location as evidence, and
never relies on the certificate's explanatory decimal bounds. It recomputes
the analytic enclosures and exact winding counts. Generation and verification
took seconds in this environment, but no complexity bound is claimed.

## Analytic function used

We evaluate

\[
G(z)=e^{\pi z/4}\,\xi(\tfrac12+iz).
\]

The exponential factor is entire and never vanishes, so it preserves zeros
and their multiplicities. It also has real coefficients, so G retains
G(conj z) = conj G(z). It compensates for exponential decay of xi at positive
heights, improving numerical scaling without changing the zero problem.

For s = 1/2 + i z, the implemented identity is

\[
G(z)=\Gamma(1+s/2)\exp(-s\log\pi/2+\pi z/4)
\left[1+(s-1)\left(\zeta(s)-\frac1{s-1}\right)\right].
\]

FLINT's deflated zeta series removes the singularity at s = 1. Replacing
(s/2) Gamma(s/2) by Gamma(1+s/2) removes the singularity at s = 0. All tested
boxes stay in Re s > -2, so the remaining gamma factor has no pole there.

## Local symmetric cage theorem and certificate

For a real center t and radius r, let

\[
M_2\ge \sup_{|z-t|\le r}|G''(z)|.
\]

The verifier proves the strict inequality

\[
|G(t)|+\frac{r^2}{2}M_2<r|G'(t)|.
\]

The derivative upper bound is obtained by evaluating the degree-two Arb
analytic series with its constant coefficient equal to the **whole complex
square** |Re z-t| <= r, |Im z| <= r. This encloses the closed disk. The
coefficient of the series variable squared is G''(z)/2 for every constant
z in that box. The value and first derivative at t are separately enclosed.
Thus the upper bound on the left and lower bound on the right are rigorous.

Taylor's integral remainder gives

\[
|G(z)-G'(t)(z-t)|\le |G(t)|+\frac{r^2}{2}M_2
\]

on the circle. Rouché's theorem gives exactly one zero, with multiplicity,
inside the disk. The disk is invariant under conjugation. A nonreal zero
would have a distinct conjugate in the same disk, contradicting the count of
one. Consequently this zero is real and simple.

This local criterion is sufficient, not necessary. A global use of unit cages
would prove simplicity as well as RH. A general framework should allow
clusters with higher counts to avoid silently assuming simplicity.

## Total band winding certificate

For each rectangle the certificate contains a counterclockwise, dyadic
subdivision of its entire boundary and a rational image polygon.

For each full boundary edge, the verifier recomputes a rigorous rectangle
enclosing the image under G (or the specified negative-control function).
There are two allowed enclosure methods:

1. Direct complex ball evaluation on a box containing the full edge.
2. A midpoint evaluation plus a first-derivative enclosure on the full edge,
   using Taylor's integral formula on that convex segment.

The verifier forms the coordinatewise convex hull of this analytic enclosure
and the two proposed polygon endpoints. It requires that the entire hull
exclude zero. Therefore the actual analytic image of the edge is homotopic
to its polygon chord without passing through zero. The edge homotopies join
continuously at their endpoints.

The verifier independently checks that the input nodes traverse exactly the
specified rectangle once counterclockwise. It then computes the polygon's
winding using exact rational ray-crossing predicates. This integer is the
analytic winding, hence the total zero count by the argument principle.
No phase samples, floating-point argument unwrapping, or guesses about
unobserved parts of an edge are used.

There are 3994 certified edges for the low band and 212 for the close-pair
band. The separate local cages are checked to lie strictly inside their
band and to be pairwise disjoint. Their counts exhaust the total band
winding, which proves there are no other zeros in that bounded region.

## Negative controls

The polynomial

\[
P(z)=((z-3)^2+1/64)((z+3)^2+1/64)
\]

has off-real roots at +/-3 +/- i/8. The checker obtains winding 2 around
the positive pair and winding 4 around the whole quartet. It also reruns
verification after deliberately changing each claimed winding to 1 and
confirms that the false claim is rejected.

A stronger analytic control uses

\[
Q(z)=\frac{((z-200)^2+1/16)((z+200)^2+1/16)}{(200^2+1/16)^2}
\]

and compares G to GQ. On the identical symmetric rectangle

\[
199.875<\Re z<200.125,\qquad |\Im z|<0.375,
\]

the original G has certified winding 0, while GQ has certified winding 2.
Thus the implementation detects the deliberately inserted pair at
200 +/- i/4. The added zeros lie outside the low band; multiplication by Q
preserves every zero and its multiplicity in that band because Q has no
zero there. The numerical certificates do not themselves assert anything
about positivity of a transformed theta kernel; that is a separate analytic
question.

## Trusted base and scope

The trusted base consists of Python exact arithmetic, python-flint/FLINT/Arb
correctly enclosing the special functions and their analytic series, and
the standard argument principle, Taylor remainder formula, Rouché theorem,
and xi reflection identity. This is a rigorous numerical certificate under
that numerical-library trust base, not a Lean kernel formalization.

Infinite-dimensional bridge positivity, a uniform supply of cages at all
heights, and control of an infinite remainder have not been proved here.
Topological integer accounting is exact once boundary nonvanishing is
certified; it does not itself supply that analytic nonvanishing bound.

## Sources

- NIST DLMF 1.10, including argument principle equation 1.10.9:
  https://dlmf.nist.gov/1.10#iv
- Yum-Tong Siu, Argument Principle and Rouché's Theorem:
  https://people.math.harvard.edu/~siu/math113/11_argument_principle_and_rouche_theorem.pdf
- Python-FLINT documentation: https://python-flint.readthedocs.io/
- FLINT complex calculus documentation:
  https://flintlib.org/doc/acb_calc/integrate.html
- Platt and Trudgian, The Riemann hypothesis is true up to 3*10^12
  (established finite-verification precedent, not a claim to a new record):
  https://arxiv.org/pdf/2004.09765
