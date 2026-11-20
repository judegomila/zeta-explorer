# Independent explicit arithmetic error budget audit

Analytic PASS without corrections, 2026-11-03. No numerical computation.

Since sigma+1>=1 and logN<=l_N, the earlier B_k is bounded by b_k*l_N^k/(8N). The displayed d_r and h_r therefore bound all derivative errors through2. The supremum over sigma also covers reflection; averaging cannot double the bound. Uniform Gamma decay makes C_r finite. Evaluating the bound at N1 and using explicit T1 proves M_r bounds for xi without a target sign assumption.

Substitution into the five-term D'' error bound yields coefficients4M1C1+2M2C0+2M0C2 and quadratic6C1^2+6C0C2, using l_N>=1 and N>=1. Thus normalized bridge error<=4Q_p*l_N^2/N. Writing x=logN>=0, (1+x)^2 exp(-x/2) has maximum16exp(-3/2)<4; the stated choice N>=ceil((16Q_p/epsilon)^2) guarantees error<=epsilon. This is an absolute prescribed-error bound tied to actual p, not a positive-margin theorem or uniform-in-degree estimate.

For every fixed corrected N, its center Fourier value is positive because D_N(1/2)<0 and A(1/2)<0, while subtracting the half-endpoint term makes the former more negative. The exact negative even tail -pi N exp(-5|u|/2) makes the Fourier value at ia tend to minus infinity as a approaches5/2 from below; higher-order tail terms remain bounded there. Continuity forces a positive imaginary zero and, before it, a negative derivative of squared modulus somewhere. Exponential vertical decay permits polynomial-density detection at that fixed shift. This excludes all-degree positivity across the entire natural strip for each fixed N, NOT across the critical shift strip for every N. Only N1 critical-strip failure has been proved. Actual theta and adaptive-N strategies remain unaffected by this approximant-family obstruction.
