# Independent finite arithmetic core audit

PASS, 2026-11-03. Actual unreflected first orbit retained, including its negative portion. Separate post-v29 analytical theorem, not a finite ladder run.

The nth summand is n^(-1/2)f(u+log n). For nm=k, set R=r+log(k)/2 and w=v+log(n/m)/2. Then the two arguments become R+w,R-w. Their product is even in w, so v² integrates to C_f(R)+log(n/m)² A_f(R)/4. Summing divisors yields precisely d(k) and ell2(k), with overall k^(-1/2).

To justify interchange, bound absolute differentiated pair integrals before grouping. On |w|<=R/2 the explicit pair formula and derivative polynomials give a fixed polynomial in exp(R) times exp(-2pi exp(2R)), times at most polynomial R. Outside, one argument is large positive and the other derivative has a global bound, giving a superexponential tail as in the reviewed noncentral estimate. The transformed v² weight is bounded by a constant times w²+log(k)². Thus for fixed derivative order and r in a compact nonnegative interval the absolute pair terms are bounded by a polynomial in k,log k times exp(-c k). Divisor factors are harmless. This establishes legitimate absolute integrated rearrangement; it does not assume absolute summability of individual translated-profile norms on the negative halfline.

For all real u, f=pi^(-1/4)(8z^(9/4)-12z^(5/4))e^-z. The Q recurrence bound uses beta=9/2 or5/2. On z<=1 all fractional powers are <=1 and the derivative multiplier is <=(2j+7)^j. On z>=1, the absolute terms are bounded by20(2j+7)^j z^(j+3)e^-z, whose maximum is <=20(2j+7)^j(j+3)^(j+3). The proposed factor40 safely covers both regions. Positive-u tail T_j from the complete-profile bound also bounds this single orbit.

The central derivative sign proof is an exact one-pair calculation and therefore applies without any global positivity assumption on f. Replacing global M by M^f in the previously audited noncentral calculation gives L_N C_f>=L^+/2 beyond the displayed z_N^f. For A_f, removing w² multiplies the retained small central mass by12z. On the noncentral part R>=log8 implies u=R+|w|>1, so its weight1 is bounded by u² and the same E_N estimate suffices. Thus both differentiated kernels are strictly positive at the same explicit threshold.

Since z=pi k e^(2r), k>=ceil(z_N^f/pi) ensures that threshold for every r>=0, including zero. All divisor/log-variance weights are nonnegative, and d(k)>0; the omitted arithmetic tail is genuinely positive and converges absolutely. The remaining finite core is a rigorous pointwise lower bound for actual C_N. Integrating against the positive exponential law gives the stated sufficient original-pivot inequality with factor8pi sqrt(s).

Accepted: reduction to an explicit finite signed divisor core with a positive infinite arithmetic remainder. Actual polynomial coefficients and their conditioning determine the cutoff. No uniform O(N²) cutoff, no positivity of the finite core or its mean, no next-pivot sign, and no RH conclusion are established.
