# Nearby-shell signed flow: independent audit and replay

PASS, 2026-11-03. The owned checker and its two owned implementation dependencies were copied into this folder. The degree6/7 eighth-core moment files were copied from the auditor's independently generated regional_metric_replay inputs, rather than the author's output files. No fresh whole-line quadrature was needed or claimed; full-theta local density evaluation was independently rerun at Arb 192 bits. No acquired source code was executed.

The checker uses only M1..M6 for odd7 and M0..M5 for even6. The existing JSON files also contain target moments, but these entries are not accessed or used. Padding the unused top moment with zero affects the discarded Schur return only; it does not affect the old LDL decomposition or regression coefficients.

For each moment, displacement from H0=1/8 is bounded by delta times the supremum absolute boundary density on the entire interval. The symmetric ball is conservative for every H in the interval, regardless of density sign. The local calc function includes the full-line weight 2H^2 psi(H)^2, full orbit derivative enclosure, and correct monomial parity shifts. Both actual moving-core and boundary old blocks have strictly positive interval LDL pivots. Reusing the interval LDL factorization to evaluate the mismatch quadratic is valid despite dependence and only widens the enclosure.

With z=-A^-1 b, differentiation gives z'=-A^-1(Lz+l). The envelope identity S'=d+2z^T l+z^T Lz completes to s_local+(z-z_local)^T L(z-z_local). A second derivative gives d'+2z^T l'+z^T L'z-2(Lz+l)^T A^-1(Lz+l); the negative inverse-feedback sign is correct. The finite-shell limit follows with shell A=delta L+o(delta) and shell regression approaching the local one.

Independent output result.json certifies, everywhere on [1/8,1/8+10^-8]:
- odd7: S' > 9,584,501,356.6631; local target Schur is negative but mismatch pays it.
- even6: S' < -1,373,960.27146; local target Schur is negative and mismatch does not pay it.
Units are normalized h/(4pi) per unit cutoff H. Integrating the uniform bounds gives the stated strict finite-displacement inequalities on every nonempty initial subinterval.

Scope: an actual-theta counterexample to monotone optimized-core growth from positive old metrics and adjacency. This is not a new rung, a failure of eventual finite-shell compensation, or a statement about all degrees, all shifts, or the complete kernel. The earlier larger middle-shell compensation is fully compatible with this initially adverse interval. No integrated top target moment or target reserve is used to determine the derivative signs.
