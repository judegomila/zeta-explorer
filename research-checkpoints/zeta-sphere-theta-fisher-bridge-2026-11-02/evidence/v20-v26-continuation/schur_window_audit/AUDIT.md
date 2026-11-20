# Independently reproduced H5 one-crossing Schur envelope

PASS, post-v19 addendum. This is an alternative finite H5 cancellation proof, not a higher-order or all-order claim. No acquired checker was executed.

The newly authored replay evaluates full theta derivatives by the independent Arb routine and complete omitted-orbit tail already proved in source_2354_audit/H6_AUDIT.md. For q_n=(-1)^n D_v^(2n)[psi(h-v)psi(h+v)]/psi(h)^2, it encloses
 S=q5-(q3^3-2q2q3q4+q1q4²)/(q1q3-q2²).
Every accepted cell has strictly positive denominator; q1>0 also follows from the previously audited strict log-concavity. Adaptive CLOSED interval coverage gives:
-3798 cells on[0,1/10]: S>-2e9;
-824 cells on[1/10,1/8]: S>0;
-2089 cells on[3/20,1/5]: S>3e9.
The prior independently audited h5_tail_v1 pointwise odd-block positivity supplies S>0 for all h>=1/8. This dependency, rather than the source's separate z>=20 checker, closes the infinite domain. The independently enclosed ratio psi(.2)^2/psi(0)^2>.46398>1/4 is recorded in certificate.json.

Because psi decreases on h>=0, bound negative-core magnitude with psi(0)^2 and positive-window weight below with psi(.2)^2>=psi(0)^2/4. The exact endpoint envelope integral is at least
 [-2e9*(2/3)*(.1)^3+3e9*(1/4)*(2/3)*((.2)^3-(.15)^3)]psi(0)^2
 =(2937500/3)psi(0)^2>0.
For every a>0, r_a(h)=sinh(2ah)/(2ah) increases in h. The envelope's negative support precedes.1 and positive support follows.1, so its shifted integral is at least r_a(.1) times this positive endpoint reserve. Pointwise S is everywhere above the envelope. The averaged-Schur identity adds nonnegative coupling-variation covariance because each local old block is positive. Hence the integrated odd H5 block is positive at every finite shift and normalized a0. Our already-certified other parity completes H5.

This is concrete negative-core/positive-window transport, not positivity of every local fiber and not a uniform-in-degree envelope. Frozen v19 remains untouched; its H6 acceptance already used our earlier H5 theorem and does not depend on this addendum.
