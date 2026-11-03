# Independent audit and scope record

An independent AI-assisted mathematical reviewer checked the identities without using a next-pivot sign or RH. This is not peer review or a machine-formalized theorem.

Reviewed conclusions:
- The shifted autocorrelation has the stated 1/(2π) normalization and the orbit-pair change of variables gives d_a(j)=Σ(n/m)^a.
- The arbitrary-prime recurrence b_m−2cosh(a log p)b_(m+1)+b_(m+2)=X_m is exact.
- The generating-series derivative identity proves the full prime correction equals (2π/a)Σj^(−1/2)d_a′(j)a_j(a).
- The original arithmetic derivative appears with half that coefficient; full sieve reverses it and half sieve cancels it.
- At a=0, a_j′(a)/a→a_j″(0)=4T_qC_f(log j/2) and d_a′(j)/a→ell₂(j).
- Complete single-orbit saddle decay justifies fixed-degree all-prime convergence and differentiation on compact real shift intervals.
- Actual residual q(a) must be frozen during shift differentiation. A total derivative along q(a) has extra coefficient-variation terms.
- The Abel boundary kernel is exactly 2πΣδ−(log p)P_(1/p), including the lattice masses. The prime brackets must remain paired.

The reviewer supplied the independent exact Bessel expression included as equation (10) of the main note. The elementary finite-factor logarithmic derivative at the boundary was subsequently checked explicitly in the boundary note. No conclusion about positivity of the remaining signed low core or an old inverse bound is established.

Reproducibility:
- verify_generating_identity.py verifies the two rational generating identities exactly with SymPy.
- probe_base_collapse.py and BASE_DIAGNOSTIC.txt are ordinary high-precision numerical diagnostics only, truncated at arithmetic j=12 and spatial v=4. They are not interval certificates and are not used in any theorem.
- No live 4CT code was used, and no GitHub state was modified.

The research baseline was read at PR #40 head 6c6c81697fdc527d017dc592b55bea3efa5bb31b. The PR itself remains a draft and its finite positivity claims are not promoted here.

## Follow-up: actual odd-base arithmetic reserve

Independent analytic audit PASS for ODD_BASE_ARITHMETIC_RESERVE_NO_GO.md. The reviewer reproduced the derivative polynomials P_2,Q_2 and the positive-coefficient shift Z=6+y, checked the log-convex K-order ratio bound and its direction with Q_2<0, and verified D_t(a)<0 for 0≤a≤1/2 under the Abel endpoint convention. The contrasting D_1(a)>0 was also verified. The q=t witness is the actual empty odd prefix; it does not refute a candidate restricted to nonempty prefixes. The uniform exact C_* bound and individual-frequency extension follow directly from the displayed inequalities and were checked in the parent derivation. The symbolic polynomial replay passes. No original signed bridge negativity is asserted.

## Follow-up: quantitative paid signed debit

Independent analytic audit PASS for ODD_BASE_SIGNED_DEBIT_PAYMENT.md, explicitly inheriting the complete-theta source curvature theorem v′>17. The reviewer checked the integration-by-parts reserve, the Bessel upper bound, divisor-log bound, geometric tail, and strict relative payment. It inspected and reran certify_odd_base_payment_mpfi.py; the replay was byte-identical to ODD_BASE_PAYMENT_CERTIFICATE.json and is saved as ODD_BASE_PAYMENT_AUDIT_REPLAY.json. A separate 50-digit mpmath.iv calculation with independently arranged exponential and divisor-ratio expressions reproduced both strict source bounds. The conclusion is only q=t, uniform in 0≤a≤1/2 with Abel endpoint: debit<(6/7)S_half and original bridge>(1/7)S_half. It is not a new positive rung or a nonempty-prefix estimate.

## Follow-up: nonempty-prefix inverse-preserving transport

Independent analytic audit PASS for the transport, whitening, domain, derivative, and concavity formulas in NONEMPTY_PREFIX_PAID_DEBIT_BARRIER.md. These are standard Schur identities, not a newly proved theta-specific all-degree bound. The audit emphasized that the source lower bound must be for the reselected Schur source, and that adding the mismatch to a lower bound for the fixed-original-q source would double-count it. No such double counting is used in the final note. The conditioning-only matrix model is labeled non-theta. No uniform nonempty-prefix payment is established.

## Follow-up: all-degree fixed-polynomial prime-tail obstruction

Independent analytic audit PASS for ALL_DEGREE_PRIME_TAIL_PAYMENT_OBSTRUCTION.md. The reviewer checked both amplitude coefficients, the prime divisor ratio, and uniform differentiated remainders via the exact Gaussian form of the Bessel integral. It also verified the refinement 1/(2Z)+(4n−1)/(8Z²)+O(Z⁻³), with coefficients frozen and log absolute value used for odd-degree amplitudes. This rules out matching-index payment at every fixed odd degree; it neither controls the degree-dependent core nor proves a negative integrated pivot. Uniformity requires bounded coefficient sets at fixed degree and does not extend through singular old inverses. The arbitrary-degree symbolic coefficient verification passes.


## Follow-up: degree-uniform aggregate odd half-source reserve

Independent analytic audit PASS for AGGREGATE_ODD_HALFSOURCE_RESERVE.md and ALL_SHIFT_AGGREGATE_ODD_RESERVE.md. The reviewer checked contour normalization and residue signs, cancellation of all zeta-zero poles before moving contours, the positive trigamma kernel, the exact compact rational negative mass, real-rooted odd-polynomial inequalities, and all endpoint conventions. The resulting lower bound holds at every degree for each nonzero real odd polynomial with only real roots and every 0≤a≤1/2, with coefficients frozen during derivatives. It uses the integrated paired Abel value at a=1/2 and preserves unbounded-support convergence.

The source reserve is S_half[q;a]≥P_(q,a)+π(8F(0)−1)|q(i/2)|²>P_(q,a)+(173π/25)|q(i/2)|², where P_(q,a)>0 is the explicit archimedean integral. At a=0 the sharper reserve P_q+(8π−2)|q(i/2)|² follows. These bounds arise from aggregate contour cancellation and do not pay individual odd prime terms. A selected original residual has the necessary real roots under positivity of its full old Hankel prefix, not its odd prefix alone. Its actual inverse coefficients remain in q(i/2) and P.

Independent inspection and MPFI replay of certify_transform_origin_mpfi.py verified rational cell endpoints, outward rounding, the evenness factor two, and positivity of all omitted orbits and tails. The replay is byte-identical to TRANSFORM_ORIGIN_CERTIFICATE.json and proves F(0)>99/100. A separately factored 50-digit mpmath.iv replay confirms this strict inequality. Both replay artifacts are included. The script's opening docstring was corrected after review; its executable calculation was unchanged.

No all-degree bound paying the negative part of D_q/2 is established. The source bound controls s_half+M_half for the original residual when the source prefix is positive, so the mismatch must not be counted a second time. This is not an original Schur-sign proof, an added original ladder rung, or an RH proof.


## Follow-up: aggregate payment and source-domain obstructions

Independent analytic audit PASS for AGGREGATE_REAL_ROOTED_PAYMENT_OBSTRUCTION.md. Odd constrained minimum-norm polynomials for a positive exponential weight are real-rooted, have |q(i/2)|²=1, and make both the original bridge integral and archimedean source integral tend to zero. Unbounded imaginary evaluation is proved by analytic continuation of the sine transform, avoiding any unproved moment-determinacy premise. The exact source pole term then disproves every uniform relative payment factor below one and the two stated explicit reserve-budget payments over this broad real-rooted class. The minimizers are not asserted to be the actual theta-selected residuals.

Independent analytic audit PASS for HALFSOURCE_INTERIOR_DOMAIN_OBSTRUCTION.md. The reviewer checked the exact imaginary-point pole jets, joint unboundedness of the relevant functionals, divergence of the least jet-Gram eigenvalue, fixed-shift exponential domination, and the interior/endpoint distinction. At each 0≤a<1/2, exact constrained interpolation produces some finite odd polynomial with negative half-source. At a=1/2 the odd half-source is strictly positive on every nonzero odd polynomial after the correct Abel limit. If original old blocks stay positive, the whitened arithmetic correction has largest eigenvalue greater than two at some finite block, so the positive half-source reselection domain cannot continue through all degrees. No original bridge negativity or explicit obstruction degree is claimed.

These results are analytic, not finite numerical checks, and use no RH assumption, finite zero verification, or origin interval certificate. Independent review of both complete written deliverables passed.


The source-domain theorem was subsequently strengthened, with an additional independent analytic audit PASS, to INFINITE NEGATIVE INDEX at every fixed 0≤a<1/2. The proof bounds g_a(0)≤−4+π²/24, kills the exact pole residues with the factors (t²+b_+²)(t²+b_-²), and uses exponential-moment density to approximate arbitrary finite-dimensional negative subspaces. This gives unbounded negative inertia of finite odd half-source blocks. If original blocks remain positive, congruence implies unbounded counts of whitened arithmetic eigenvalues strictly greater than two. The Abel endpoint remains positive. No explicit first negative degree or original negative pivot is asserted.
