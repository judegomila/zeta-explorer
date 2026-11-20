# Independent audit: sharp reoptimized cubic margin

2026-11-03. Analytic PASS. Fixed degree three, large positive shift only. No finite numerical certificate or critical-range inference.

The actual old scalar M1 is positive from g1>17/2. Fixed-order shifted moments give alpha=M2/M1=3a+O(1), without using the cubic target. The local ratios g2/g1=6Z+O(1), g3/g1=60Z^2+O(Z) hold globally on Z>=pi after enlarging constants on a compact interval. Since g1 is continuous, strictly >17/2, and coercive, its attained minimum m is strictly >17/2.

For v=(2+sqrt(10)-epsilon)a, expansion gives the displayed Q_epsilon and a uniform error O(a+Z+1). Direct exact symbolic verification confirms min Q_epsilon=(3/5)epsilon(2sqrt(10)-epsilon). For fixed epsilon in (0,1), Q_epsilon>=c_epsilon(1+t^2) on t>=0. Since (a+Z+1)/(a^2+Z^2) tends uniformly to zero for Z>=pi, the lower remainder bound by (c_epsilon/2)a^2 g1 is valid over the entire spatial tail, including moving Z/a scales. A fixed sufficiently large R then places the tail above the desired compact-scale margin. Uniform convergence on [0,R] yields liminf L/a^2>=C_epsilon m; epsilon decreases only after this large-a limit. This justifies the liminf without a hidden exchange of spatial and shift limits.

The atom u0 minimizing g1 has z0=-3ma+O(1), f0=9ma^2+O(a). The moving atom Z=t_*a has z1=6t_*(2t_*-1)a^2+O(a)>0 and the stated cubic f1. Exact weights -z0/(z1-z0) give a feasible zero-cross-mean probability, not approximate feasibility. Their leading mass is m/[2t_*(2t_*-1)a]. The objective divided by a^2 converges to C_*m. Exact symbolic checks verify t_*=(5+sqrt(10))/10 and C_*=21+6sqrt(10). Hence weak duality gives the matching upper bound; finite-a optimality of these atoms is unnecessary.

At any optimal plane, evaluating at the moving atom first gives v_a<=O(a) and limsup v_a/a<=(10t_*^2-6t_*+3/2)/(2t_*-1)=2+sqrt(10). Evaluating at the fixed atom with negative z0 gives the matching liminf from the proved margin asymptotic. This holds for every optimizer, without assuming uniqueness or smoothness. Independent exact constants output is cubic_dual_constants_independent.txt.

The target expectation is derived separately as M3/M0-M2^2/(M1 M0)=6a^3+O(a^2). It is not used in either dual-margin bound. Thus the optimized margin/actual mean ratio is C_*m/(6a)(1+o(1)), while every optimal plane has norm asymptotic (2+sqrt(10))a.

Accepted scope: actual complete-theta failure of shift-uniform optimizer bounds and of a fixed positive fractional margin relative to the target mean, despite a positive asymptotic optimized margin. No degree-uniform degeneration at fixed shift, negative dual witness, critical-strip sign, or derivative asymptotic follows.
