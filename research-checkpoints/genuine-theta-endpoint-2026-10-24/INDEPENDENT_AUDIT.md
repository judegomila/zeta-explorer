# Independent audit: endpoint extension

24 October 2026. Result: the reviewed computer-assisted certificate passes for the genuine theta-heat field G(t,x)=H_t(x)+i H_x(t,x) on the closed rectangle [0,1/2] × [200,220]. The original narrower certificate was not changed.

## Analytic and implementation review

The changes from the audited narrower box are consistent: time center t0=1/4, radius T=1/4, time Taylor degree K=40, space degree J=112, and derivative indices 0 through 193. The heat-identity coefficient signs and factorials remain correct.

The finite-integral Taylor remainder for each of H and Hx is bounded by

M exp(T) [T^(K+1)/(K+1)! + 10^(J+1)/(J+1)!].

This follows by expanding the time exponential and real trigonometric factors separately. All real trigonometric derivatives have modulus at most one. The additional factor u for Hx is at most one on the finite integration interval. The original positive finite-kernel mass bound remains valid because t0≤1/2.

The omitted theta-series tail and the full integral tail beyond u=1 are unchanged and were already proved uniformly for 0≤t≤1/2. They therefore apply at both endpoint times without a limiting argument. The complete scaled analytic component error is less than 6.577e-33. Coefficient balls separately retain numerical quadrature and arithmetic errors.

The callback for rigorous Arb integration remains entire. Restricting the finite polynomial to boundary edges and evaluating full real parameter intervals preserves continuous, not sampled, coverage. Positive scaling by 10^35 changes neither zeros nor winding. Half-plane containment justifies the principal argument increments. Exact rational box exports retain the signs that coarse display strings can hide.

## Independent checks performed

1. Regenerated the entire endpoint certificate at 512 bits with the portable audit_endpoint.py, launched from a different working directory. This reproduced 194 derivative enclosures, 24 continuous boundary segments, 90 closed interior cells, and winding zero. The certified boundary norm is greater than 2.76e-35.
2. Independently parsed all cell endpoints as exact rational numbers. Verified domain containment, pairwise disjoint interiors, and total area exactly 10. A finite closed union with these properties covers the complete closed rectangle.
3. Separately checked that the cells meeting t=0 concatenate across the whole x interval [200,220]. Endpoint coverage is direct; the checker does not infer it from positive-time samples or a limit.
4. Ran the standard-library saved-geometry verifier against both 384-bit and 512-bit archives. Both pass strict image-component signs, exact edge coverage, complete interior coverage, and exact polygon winding zero. The polygon homotopy and ray-crossing logic remain valid after the domain change.
5. Independently evaluated H0 and its x derivative at x=200,205,210,211,215,220 using xi(1/2+ix/2)/8 through the zeta and gamma functions and their first-order power series. Both components agree with the endpoint Taylor enclosures at all six points. This is an independent normalization and derivative consistency check, not a substitute for continuous interval coverage.
6. Reviewed PROOF.md and README.md for stale narrower-domain claims. The only identified stale sentence described an absent diagnostic probe; the author removed it before archival. No mathematical defect was identified.

The execution transcript is audit_endpoint_output.txt. Install the pinned requirements and use the disposable-copy commands in [README.md](README.md); the audit writes its replay beside the script.

## Exact scope

This establishes no simultaneous real zero of H and Hx in one bounded-height box, including deformation time zero. It does not establish global reality of zeros, exclude off-real zeros, control all heights as time tends to zero, provide a new bound on the Newman constant, or prove RH. It does not need the proposed collision-index theorem, because direct interior exclusion suffices.

The replay is not an independent implementation of Arb. The xi checks use a distinct mathematical representation but the same arithmetic library. This is an independent internal review, not external peer review or proof-assistant verification. Correctness still depends on the reviewed analytic bounds and the Python/python-flint/Arb implementation.
