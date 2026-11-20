# Independent audit: sharp dyadic arithmetic threshold

PASS, 2026-11-03. Read the authored proof and checker, replayed the checker, and independently implemented prime-power accumulation rather than its least-prime-factor recurrence. Both exhaustive checks over 107521 through 2^21 give integer lower-margin 11. The independent checker is independent_threshold_check.py.

For each prime exponent a, summing increments (2r+1)q_p^2 for r=1..a gives a(a+2)q_p^2. Since q_p=floor(4 log_2 p), division by 48 gives a valid lower bound for ell2/(d log^2 2). The finite interval includes both endpoints. The prior analytic bound uses log_2 j>=21 and (v-9)(2v-17)>=0 for every nonnegative INTEGER v, covering the infinite remainder. At 107520=2^10*3*5*7, exact integer power comparisons give a strict upper bound below 56; thus no smaller threshold works.

Accepted scope: optimal threshold for this arithmetic coefficient inequality only. Apply together with the degree-dependent derivative sign cutoff. Normalized a=0 even terms dominate their eta payment; odd terms remain negative and require absolute tail payment. No finite-core sign, all-degree closure, or positive-shift claim follows.
