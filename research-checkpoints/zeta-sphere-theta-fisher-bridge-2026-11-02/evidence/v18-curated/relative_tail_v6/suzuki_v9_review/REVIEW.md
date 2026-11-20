# Independent review of Suzuki support continuation v9

Status: analytic framework checked; endpoint-validation bridge clarification and independent finite replay pending.

Read SUPPORT_CONTINUATION.md, certify_support.py, support_linear_probe.py and its own-code dependency suzuki_v8/block_probe.py. The primitive asymptotic and curvature estimates follow from the signed q1/q2 formulas. The exact fractional interpolation moments 1/18 and3/14 check. The nonsingular L2/L1 sums have the correct exponents and constants. The two shifted primitive-error sequences overlap; the added eM(s2+b1/sqrt(dx)) term bounds that overlap correctly. The n=2 support count gives the stated factor1/4. Both coarse matrix norms admit the stated disjoint-index counting bound.

The exact linear-interpolant Gram formula is correct. The high-block bound uses positivity of the truncated n=2 kernel and an explicitly checked negative trailing interval for n=1. The signed Schur test and omega continuation have the same valid scope as v8. The stated floating accumulation reserves are sufficient under the documented basic-arithmetic assumptions.

Requested clarification: the candidate table compared with the elementary polynomial must be the actual generator table, not nearby special-function calls with different rounded parameters. In particular generator (.5-w), denominator(.5-w), and np.log(2) differ in expression from the wrapper's initial hardcoded .1 and mp-rounded log2. Since special-function accuracy is not presumed, direct comparison of the exact generator expression closes this gap. Tiny expected differences are not themselves a proof. Independent interval replay has been launched with enlarged decimal matrix entry radii.

## Final status: PASS

Inspected the final wrapper after its exact-expression correction. It now reconstructs the actual generator grid, c2 and every special-function expression, including (.5-.4) rather than nearby hardcoded parameters. Direct log2/c2 comparisons against interval-centered constants pass. The full rerun passes, recording maximum actual-candidate/elementary-table difference 2.708944180085382e-14. Thus no accuracy/continuity assumption about nearby SciPy calls is needed.

The enlarged-entry independent interval Cholesky replay passes both signs, with minimum pivot lower endpoints approximately .593126769496370 and .843032994496270. Final analytic error budgets include the previously omitted overlap and remain below the declared e and ae constants.

The reviewed finite theorem is norm<=.99995 at omega=2/5, R=(16/15)log2, and norm<=.99996 for |omega-2/5|<=1e-8 on the same support and every smaller compression. Hence inverse norms of I±H are <=25000 in that compact omega range. This remains a finite-support statement under the documented basic-floating and interval-arithmetic assumptions. It does not establish a global determinant, canonical-system continuation, RH, or C_a positivity.
