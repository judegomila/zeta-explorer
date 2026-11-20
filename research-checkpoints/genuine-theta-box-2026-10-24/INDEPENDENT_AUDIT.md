# Independent audit of the genuine finite-box certificate

24 October 2026. Scope: the current `certify_boundary.py` and `PROOF.md`.

## Findings

The continuous runtime certificate passes mathematical and implementation review. It establishes that the actual theta-heat transform and its first spatial derivative do not vanish simultaneously on the real closed parameter box [1/5,1/3] × [200,220]. This is local collision exclusion, not a proof of RH or a new bound on the de Bruijn–Newman constant. Direct interior coverage makes the result independent of the proposed higher-multiplicity index theorem.

The audit checked:

- The kernel normalization agrees with H_0(z)=xi(1/2+iz/2)/8 in Tao's primary exposition: https://terrytao.wordpress.com/2018/01/19/the-de-bruijn-newman-constant-is-non-negativ/.
- D_m are finite-integral derivatives for 0≤m≤161. The polynomial uses the heat identity with the correct (-1)^k sign and factorials.
- The bivariate rectangular Taylor remainder is valid for both components. Real sine/cosine derivative bounds avoid an unnecessary exp(10) factor; the extra derivative factor u is at most 1 on [0,1]. Infinite-domain high derivatives are never being estimated by this finite mass bound.
- The omitted theta terms on [0,1] and the full kernel on [1,infinity) are bounded separately, uniformly on the stated time range. The u² majorant controls both H and Hx in the latter domain. Both geometric ratios and the -500n² log-derivative estimate are conservative and valid.
- Analytic quadrature uses an entire callback, so ignoring the analytic flag introduces no branch assumption. Finite returned ball enclosures, rather than agreement of numerical tolerances, support the calculation. Arithmetic and coefficient uncertainty propagate through the polynomial independently of the analytic remainder.
- Positive scaling by 10^35 changes neither zeros nor winding.
- Each accepted boundary segment is enclosed throughout in a convex rectangle lying in one open coordinate half-plane. Therefore its principal endpoint argument increment is the correct continuous lift. The specified orientation is counterclockwise in (t,x).
- Direct interior interval evaluations cover full parameter rectangles, not samples.

## Independent execution

`audit_independent.py` reran the original checker at 512 bits. It reproduced 23 boundary segments, 68 interior cells, winding enclosure ±1.36e-16, and a scaled boundary lower bound greater than 2.94.

It then independently parsed exact rational cell endpoints, checked that they lie in the target rectangle, checked pairwise disjoint interiors, and verified total area 8/3, equal to the entire target area. Since a finite union of closed cells is closed, these checks leave no uncovered points in the closed target rectangle.

Five independent direct-integral evaluations used 8 theta terms and integration through u=1.1, rather than the certificate's 7 terms and upper endpoint 1. Their value and derivative enclosures agreed with the Taylor model at (1/5,200), (1/3,220), (4/15,210), (1/4,211), (3/10,205). These are consistency checks only, not a replacement for the uniform analytic proof. The polynomial replay is not an independent implementation of Arb.

Audit transcript: `audit_independent_output.txt`. Invocation requires python-flint. After installing the pinned requirements, run the audit on a disposable copy as described in [README.md](README.md), because it writes its replay beside the script.

## Artifact correction completed

The original JSON used str(acb) for image boxes. For broad intervals this intentionally prints a coarse symmetric enclosure containing zero, even when an underlying component had a strict sign. Thus the original JSON alone loses the exclusion evidence. This does not invalidate runtime assertions. The corrected export now includes exact rational directed component endpoints and an offline standard-library checker. Both 384-bit and 512-bit archives pass the checker. The exact rational polygon construction was reviewed: vertices lie in adjacent image-box intersections, each polygon edge lies in its convex nonzero image box, and the actual field loop is homotopic to this polygon. Exact ray crossings yield winding zero. This validates saved enclosure geometry; genuine-function containment still relies on regeneration and the analytic proof. Switching the parameter partition to exact Fraction arithmetic reduced the earlier 136-cell decomposition to 68 cells; the revised checker was replayed and the revised cells independently checked.

This is an internal independent audit, not external peer review or a proof-assistant verification. It relies on correctness of Python, python-flint, Arb, and the reviewed analytic estimates.
