# An actual negative regional remainder paid by regression coupling

Independent analytic and4000-cell numerical replay PASS. Separate from the frozen half-split certificate. This reproduces the same existing normalized degree-seven rung with a more informative partition; it is not a degree extension or an all-order result.

## 1. Same complete theta target, split at one eighth

Retain all definitions, original moments, and exact global/regional inverses from DEGREE7_REGIONAL_PAYMENT.md, but take the regions |u|<=1/8 and |u|>=1/8. The owned `check_degree7_eighth_partition.py` differs from the reviewed half-split code only in the exact partition index, grid divisibility assertion, and output label. It uses the identical full-theta derivative16 enclosure, midpoint second-derivative errors, and complete spatial tails.

Both regional old matrices on t,t³,t⁵ are checked positive again in this run. Conservative pivot bounds follow from the recorded intervals:
- Core: first>0.033835, second>13.673, third>2870.
- Tail: first>0.335437, second>274.006, third>785000.
These are LDL pivots, not eigenvalues.

## 2. Negative optimized core and its exact payment

All quantities below are in h/(4pi) units. Directed interval results show
 -347755655 < s_C < -342212016,
 s_T > 5870098045,
 V_C > 520963072,
 V_T > 3983913,
 V_C+V_T > 524946985,
 S=s_C+s_T+V_C+V_T > 6047289376.
Thus the exact core correction alone pays the negative optimized core remainder:
                  s_C+V_C > 173207417.             (1)
The target mass and inverse feedback remain in s_C=c_C-b_C^T A_C^-1b_C with their original signs; no part of the negative s_C is discarded.

The meaning of(1) is precise. s_C is the minimum regional value over monic degree-seven polynomials with adjustable old coefficients. V_C measures how far the actual *globally selected* coefficients differ from that regional optimizer, in the certified regional old metric. Consequently s_C+V_C is the actual global residual's core integral. This certificate does **not** say that the global residual's core integral is negative and then canceled by its tail. Instead it proves a negative regional optimum is paid through the coupling forced by the global inverse. Pointwise old-density indefiniteness near0 remains present.

## 3. Matrix-level signed cancellation is genuine

The central degree-seven regional4x4 target block has positive old3x3 block and strictly negative Schur remainder. Hence its inertia is exactly three positive and one negative direction. The tail degree-seven4x4 block is positive definite, since its old block and s_T are positive. Their sum is positive definite by the complete global Schur bound above.

This is an actual complete-theta instance of an indefinite regional new block and a positive combined target. It does not assume either regional target block positive, and never assumes pointwise old positivity. The explicit between-region correction explains the scalar regression version of that matrix compensation.

## 4. Verification, provenance, and limits

The independent direct global-Schur enclosure remains (6072812178,6108399979), compatible with the complete regional enclosure. It is computed from the same newly integrated moments, not supplied as an input. Original target M6,M7 are evaluated; no target pivot reserve is borrowed. Existing full_split/finite endpoint certificates already include normalized odd degree7, so only this decomposition and quantified signed mechanism are new here.

The entire derivative/orbit/quadrature/tail proof is unchanged from the frozen half-split packet. The grid contains the1/8 split exactly (250 of4000 cells on[0,2]). The old metrics are revalidated, rather than presumed positive because the half-split worked. There is no inference that this partition remains valid at larger degree, other shifts, or that the demonstrated compensation has a uniform lower bound.
