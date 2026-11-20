# Independent N1 arithmetic cancellation certificate

Owned certificate independently replayed and analytically reviewed PASS. This independently checks an already-known rung by the new arithmetic mechanism; it is not a finite ladder extension.

Only the old-contact enclosure alpha in[47/4-11/200,47/4+11/200] is used. No next moment, next-pivot reserve, or existing determinant result is read. The owned checker rechecks the two old entries G00,G01 of the existing source JSON and constructs L_1=D^4/16+(alpha/2)D²+alpha².

For K=4 the reviewed degree-only threshold is z_K=64pi: the other terms68,285/4, and(1/2)log[24*6400*6²*7³] are all smaller. Thus every exact arithmetic summand with k>=64 is strictly positive.

The checker certify_even1_arithmetic_core.py integrates the signed terms k=1,...,63 using the exact single-orbit Q-polynomial kernels, exact divisor counts, and interval divisor-log variances. Each whole-line integral uses160-bit Arb rectangles on0<=w<=3 with12000 cells. Its omitted tails are bounded separately using the reviewed global single-orbit M_j^f and positive-argument T_j. All actual alpha values in the old-contact interval are covered. The sum of those integration tail bounds is below8e-262.

The certified finite arithmetic core satisfies
 sum_(k=1)^63 U_k > 6.59.
Together with the proved positive remainder k>=64, this gives h_1>4pi*6.59>79.08. The weaker rational79.08 uses pi>3; the stronger live interval could also be retained. No assumption of h_1 positivity is used.

The cancellation is real: the independently certified first summand U_1<-19. Higher low-divisor terms compensate. Therefore this verifies aggregate arithmetic cancellation in one actual case while disproving termwise core positivity. It supplies no growing-degree monotonicity law and no reason to infer uniform success from this one case.

Artifacts: certify_even1_arithmetic_core.py and even1_arithmetic_core_12000.json. Use the directed lower endpoint (about6.59174789), not the coarse default Arb display string, when reading the result.
