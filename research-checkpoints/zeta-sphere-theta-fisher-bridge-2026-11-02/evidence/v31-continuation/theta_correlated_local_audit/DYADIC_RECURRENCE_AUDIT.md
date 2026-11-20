# Independent audit: dyadic correlation recurrence and finite cost tails

PASS, 2026-11-03. Reviewed the final Section 2 monotonicity addition separately. No acquired code executed. The campaign-owned finite checker was replayed; original input moment enclosures were not regenerated in this check.

From d(2^(v-m)u)=(v-m+1)d(u), absolute reindexing gives b_m=sum_(v>=m)(v-m+1)X_v. First and second differences are respectively sum_(v>=m)X_v and X_m. The prime-variance contribution is L² v(v+1)(v+2)X_v/12; sum_m m(v-m+1)=v(v+1)(v+2)/6 verifies the target coefficient L²/2. The cost coefficient is 2pi L² times 5 sum_m b_m, distinct from the target's 4pi normalization.

Beyond the degree-only arithmetic cutoff, all constituent a_j have the established even-positive/odd-negative sign. Therefore the stated positivity/decreasing/convex and negativity/increasing/concave conclusions hold for b_m=q^m C_m, not unweighted C_m. Convergence to zero follows from the complete single-orbit exponential bounds. No next pivot or next norm is needed.

The omitted cost sum over m=M+1,...,v contributes (v-M)(v-M+1)/2. This verifies the factor 5pi in the exact collapsed tail. Its divisor coefficient is bounded by d(j)(v+1), hence by j(1+log_2 j). Multiplying the single-orbit bound gives 10L²B_K times the displayed scalar prefactor. The geometric sum costs less than 2, yielding exactly 20L²B_K. All stated thresholds ensure R>=1, the derivative-polynomial bound, and prefactor logarithmic derivative <=(K+3)/j. Both parity signs and all absolute-value operations are valid.

At J=64, M=5, the ratio to the accepted arithmetic remainder envelope is 5pi L²(1+log_2 J)/(1+log²J/4). Input strings are Arb enclosures including their decimal radius, not unguarded rounded centers. Replayed bounds are <5.257e-18 for odd1 and <2.426e-12 for corrected even2. Thus the conservative stated one-sided enclosures with 6e-18 and 3e-12 pass. The checker reads only mode and arithmetic_tail_upper; it does not use successful pivot lower reserves. Corrected even2 polynomial ordering is inherited from the previously reviewed input certificate.

Scope: finite-degree actual correlation-tail control and exact correlated target/cost identities. E_5 is NOT evaluated. Low correlations and signed Y_v remain unpaid. No new pivot, uniform filtered-surplus domination, or RH consequence follows. Independent replay output and exact input hashes are under dyadic_tail_replay/.
