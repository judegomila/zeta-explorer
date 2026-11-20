# Audit: uniformly small selected leverage of the stated theta packets

2026-11-04. Independent algebraic audit of the supplied selected-packet bridge, sections 4–5, and the finite actual-theta parity bound, sections 1–3. This audit inherits, rather than independently reproves, the actual-theta packet asymptotics. No RH or selected-coherence conclusion is claimed.

## Verdict and scope

The proposed obstruction is valid for the exact family in bridge section 4.1, with fixed s, fixed positive kernel-size parameter, fixed 5/12 < delta < 1/2, and L in the stated fixed compact interval with L_min > 4/c. It applies uniformly, not merely to parameters tuned near a leading-coefficient zero. The selected leverage has exponential upper rate -eta_*/2 per actual polynomial degree n. Its implications for normalized triangular bases and the weighted-l1 sufficient criterion are correct.

Do not replace the proved mesoscopic regime by the sole hypothesis d=o(n) without retaining the uniform packet norm lower bound as an explicit additional assumption. The asymptotic algebra works under that lower bound; the packet theorem itself has more hypotheses. Likewise, the conclusion excludes uniform absolute inverse-column/synthesis bounds of the type proposed in bridge (5.7), not every possible meaning of localization. It leaves derivative cancellations entirely open.

## Exact coefficient calculation

Write n=2r+epsilon, h=sd, k=n-h, T=2k/c, x=T/(Ln), c=pi/2. For large n, d is positive and is the largest even integer below m. The even kernel polynomial E has degree-d coefficient

    [y^d] E(y) = (2/m)(1-d/m) 2^d T_d(x).

Consequently

    [t^d] q(t) = [(2/m)(1-d/m) T_d(x)/E(x)] (2/(Ln))^d.

Since |T_d(x)|<=1, E(x) is uniformly bounded below, and 1-d/m is either 1/m or 2/m,

    |[t^d]q| <= C m^(-2) (2/(Ln))^d.

In particular the proposed weaker bound without m^(-2) is valid. Fixed s then gives

    log |[t^n]p| <= -k log(2k/c) + h log(2/(Ln)) + O(1).

The bound is uniform even arbitrarily close to a top-coefficient zero. At an exact zero the packet has lower degree and leverage zero, so it satisfies the upper bound but cannot be used as the degree-n element of a triangular basis.

The supplied uniform packet estimate gives

    log X[p] = -2k + O(log n),

because a(T)^2 is asymptotic to a positive constant times T^(7/2) exp(-cT), the packet width is comparable to n^delta, and T is comparable to n. Only the lower half of this estimate is needed below.

## Monic comparison and the exponent

Use beta<c for the exponential-moment parameter, distinct from the packet kernel-size parameter. Monic minimization and the supplied finite bound imply

    log A_n <= 4r log(r/beta) + r Phi(a) + O_(beta,a)(1).

For fixed parity this is

    log A_n <= 2n log(n/(2beta)) + (n/2)Phi(a) + O_(beta,a)(log n).

Set z=h/n, and D(z)=(1-z)log(1-z)+z. Direct combination, keeping the k-versus-n terms rather than treating them separately as errors, yields

    log theta_n(p) <= n[-eta(a)/2 + 2log(c/beta)]
                     + 2h log(4/(cL)) - 2n D(z)
                     + O_(beta,a)(log n),

where eta(a)=4log4-4-Phi(a). This is uniform over the compact L interval under the packet estimates. D(z)>=0 for 0<=z<1, and log(4/(cL))<0 under the stated L condition. Both displayed correction terms are therefore nonpositive.

With a=a_* this proves, for every fixed beta<c,

    limsup_n sup_L [log theta_n(p_(n,L))/n]
        <= -eta_*/2 + 2log(c/beta).

The supremum may be restricted to exact-degree packets; alternatively use log(0)=-infinity at degenerate parameters. Taking beta upward to c only after this limit proves

    limsup_n sup_L [log theta_n(p_(n,L))/n] <= -eta_*/2,
    eta_*=0.228769704192781... .

Equivalently, for every rho<eta_*/2 there is a uniform sufficiently large degree threshold such that theta_n(p)<=exp(-rho n). Do not set beta=c in the finite bound, let beta depend on n without controlling K_beta, or claim a finite-n constant at the endpoint exponent from this argument alone.

This calculation avoids an apparent d log n error: the degree-deficit log n terms cancel exactly. Even a coarser expansion gives O(h)+O(h^2/n)=o(n) when h=o(n), rather than O(h log n). For the present L condition, their exact combination has the favorable sign above.

## Consequences for an exact-degree triangular hierarchy

Take an X-normalized polynomial at each successive degree of one parity, with a nonzero leading coefficient, using the stated packet family for all sufficiently large degrees. Any finitely many initial basis vectors may be chosen separately. The old vectors span the complete old prefix, so the exact Schur complement and selection identities give

    (G_N^(-1))_(NN) = 1/theta_n(e_N),
    |c_N| = 1/sqrt(theta_n(e_N)),
    lambda_min(G_N) <= theta_n(e_N),
    kappa_2(G_N) >= 1/theta_n(e_N).

Thus per actual polynomial degree n,

    liminf log((G_N^(-1))_(NN))/n >= eta_*/2,
    liminf log |c_N|/n >= eta_*/4,
    liminf log kappa_2(G_N)/n >= eta_*/2.

The parity dimension N is approximately n/2; rates stated per N are correspondingly twice these rates. There can be no uniform positive lower Riesz bound for these normalized packet hierarchies. This conclusion uses only the last packet's leverage and completeness of the old span; it does not require a regular relationship between earlier L choices.

Since the supplied packet estimate gives

    H[e_N] ~ 3pi^2/(16 log^2 n),

the weighted-l1 synthesis quantity satisfies

    sum_j |c_j| sqrt(H[e_j]) >= |c_N| sqrt(H[e_N]),
    liminf (1/n) log(sum_j |c_j| sqrt(H[e_j])) >= eta_*/4.

It therefore diverges exponentially rather than tending to zero. Uniform absolute exponential decay of the selected synthesis column as in bridge (5.7), or a uniformly bounded full selected-synthesis l1 norm, is impossible for this hierarchy. A statement about a normalized or rescaled inverse column, or localization allowing an exponentially large diagonal prefactor, is not excluded merely by this diagonal argument.

The divergence is a failure of the triangle-inequality sufficient criterion, not a lower bound on H[q_n]. Very large derivative contributions may cancel. Accordingly this establishes neither failure of selected coherence nor failure of Delta positivity. It also does not exclude differently constructed packet families, different height/degree geometry, nontriangular frames, or direct control of derivative synthesis with cancellations retained.

## Check of the subsequent full draft

Read DRAFT_EXPONENTIAL_PACKET_LEVERAGE.md on 2026-11-04. Equations (6), (11), and (12) pass. In (6), its right side without the O(log n) term differs from 4r log(r/beta)+r Phi(a) by

    2n log(2n/c)-2n - [4r log(4r/c)-4r],

which is zero in even parity and O(log n) in odd parity by the mean-value theorem. Equation (11) is an exact identity followed by a correctly directed logarithmic inequality. Therefore (12) genuinely has O(log n), not an uncontrolled O(d log n) remainder.

Two editorial corrections are recommended:

1. In section 5 choose 0<rho<eta_*/2 before (14)–(15). The earlier inequalities remain true for negative rho, but the displayed lower bound in (15) tends to infinity only when rho is positive.
2. Replace “arbitrary fixed lower-degree polynomials to fill the finite initial segment” by “a fixed triangular basis of the finite initial parity prefix,” or specify one nonzero-leading-coefficient polynomial at each initial parity degree. Arbitrary lower-degree polynomials need not span that prefix.

The draft's restrictions to the given hierarchy, absolute bounds of the specified form, and the remaining possibility of derivative cancellation are appropriate. No further substantive overreach or exponent defect was identified.
