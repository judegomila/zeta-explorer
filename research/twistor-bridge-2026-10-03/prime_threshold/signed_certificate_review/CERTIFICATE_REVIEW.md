# Independent review of the signed-window certificate

## Decision

**Passed independent mathematical/code review and rerun.** The updated certificate supports

||H_{1/4,L}|| <= 49999/50000

and I +/- H_{1/4,L} >= (1/50000) I for every 1<L<=3/2. The statement concerns the full signed operator, including all omitted Fourier modes. It is a local fixed-width result, not a proof of RH or a statement for arbitrary widths or windows.

## Reviewed artifact

- Script: signed_certificate/certify_signed_window.py
- SHA-256: `2eda087855d5cac8486b12d08c9ac2ed676b498738ad1d06fde64c3f329221f4`
- Independent rerun: completed successfully from /tmp in approximately 2.5 seconds
- Rerun log: independent_rerun.log in this folder

## Checks performed

1. **Actual kernel and normalization.** Verified the n=1 and n=2 arithmetic terms, logarithmic unitary, circle length 2V, frequency pi*k/V, and the absence of a spurious Fourier normalization factor.
2. **Incomplete-beta formula and tail.** Independently derived the integration-by-parts formula. Verified c_j=c_(j-1)(j-r)/j and the geometric remainder bound using convexity of |1-r/n|^2 in 1/n. Complex tails are enclosed by rectangular interval padding, which safely contains the tail disk.
3. **Full infinite-dimensional remainder.** Independently derived the power-singularity subtraction and bounded-variation tail bound. The interval upper bound for all |k|>=17 is approximately 0.822974956171, strictly below the chosen delta=17/20.
4. **Finite real basis.** Checked the cosine/sine Gram entries and the signs in the symmetric 2x2 Fourier blocks and their inverses. The finite matrix is a true majorant compression, not a numerical replacement of the continuous operator.
5. **Inertia and quantitative gap.** Verified the two Schur-complement identities and the Woodbury inverse bound. SciPy only proposes a real congruence matrix; interval Q^TQ and Q^TSQ computations subsequently verify invertibility, inertia, and spectral separation. No unchecked floating eigenvalue enters the accepted conclusion.
6. **Outward endpoint directions.** The final script takes upper endpoints for row sums and radii, and lower endpoints for row gaps, the S gap, and the resulting operator gap. This resolves the interval-min/max ambiguity identified during review.
7. **Rational conclusion.** The script asserts both operator gaps exceed the exact interval rational 1/50000. For a self-adjoint operator this gives norm <=49999/50000. For smaller L, compression of the same original operator on L2(0,3/2) proves the stated corollary.

## Independently reproduced results

- I-H: matching negative counts 28/28; certified gap > 0.0000222801224437
- I+H: matching negative counts 29/29; certified gap > 0.00174098138915
- Both exceed 1/50000 = 0.00002

No blocking issue remains in the reviewed script or the stated scope. The result is a reproducible interval-arithmetic certificate relying on the stated analytic bounds and mpmath.iv outward-rounded operations. It is not a proof-assistant formalization.
