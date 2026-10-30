# Two neutral prime-excess routes: a rigorous relative bound and its limitation

30 October 2026. **New local analytic result; independent review pending.** No new endpoint or positivity computation.

## Outcome first

There is an unconditional logarithmic-energy estimate for the ACTUAL localized prime excess on moment-neutral envelopes. It removes the total prime-count error exactly and uses a finite positive-measure transport cost that can be computed from the actual inventory. However, even the OPTIMAL such absolute-transport cost, multiplied by the actual prime mass, necessarily grows at least like exp(b)/(b+1) at fixed envelope width. Thus this particular proof strategy cannot deliver a support-uniform relative contraction, even with perfect prime-count information.

The other tested route, signed Stieltjes integration by parts against a PNT error, requires autocorrelation variation that is not controlled by logarithmic gamma energy. A smooth exact-neutral high-carrier family proves that obstruction. Neither obstruction is a negative actual Weil vector or a lower bound on the true signed relative operator.

The prior WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM and PRIME_SIDE_SIGNED_RIESZ_HISTORY_BARRIER were read first. They already show that magnitude-only PNT does not supply the signed orientation. This note does not relabel those results as new. Its new content is the exact neutral mass matching, an explicit logarithmic-energy transport inequality, and a finite-atomic lower bound on the COST OF THAT INEQUALITY.

## 1. Exact actual setting and mass matching

Keep the reviewed paired-packet setup: fixed 0<delta<(log2)/2, b>delta, and even complex envelopes psi supported on (-delta,delta). Use unitary angular Fourier transform and zero extension. Let

    R_psi(s)=integral psi(x+s)conj(psi(x))dx,
    m(psi)=integral cosh(x/2)psi(x)dx,
    A=H_delta>=a_delta I>0.

The actual paired form is A-Delta_b-C_b, with C_b already given by an explicit positive series and a geometric upper tail. No new bound on C_b is needed here.

Set a=2delta, s_n=log n-2b. The positive EVEN actual atomic measure is

    mu_b=(1/2)sum_(|s_n|<a) Lambda(n)/sqrt(n) [delta_(s_n)+delta_(-s_n)],
    M_b=mu_b([-a,a]),
    X_b[psi]=integral R_psi(s) dmu_b(s),
    Delta_b[psi]=X_b[psi]-exp(b)|m(psi)|^2.                (1)

Repeated equal locations are combined when counting atoms. Endpoint atoms, if included instead, have R_psi=0 and can be accounted for consistently; this note uses the displayed strict inventory. All actual prime powers are retained. R_psi is real and even for complex even psi.

Let

    Z=4sinh(delta),
    sigma(ds)=cosh(s/2)ds/Z on [-a,a].                   (2)

Sigma is a probability measure, with density between 1/Z and p_max=cosh(delta)/Z. The exact envelope identity is

    integral R_psi(s) dsigma(s)=|m(psi)|^2/Z.             (3)

Assume M_b>0. For ANY probability coupling pi of mu_b/M_b and sigma,

    Delta_b[psi]
      =M_b integral [R_psi(s)-R_psi(r)] dpi(s,r)
         +(M_b/Z-exp(b))|m(psi)|^2.                     (4)

Thus the total-mass error is an exact ONE-DIMENSIONAL port. It disappears identically on ker m, regardless of how inaccurate the total prime count is. No PNT estimate, equidistribution assumption, Mobius inverse, or commuting physical-head projector enters (4). If M_b=0 then X_b=0 and the neutral excess is identically zero.

## 2. Route A: Stieltjes cancellation and the derivative obstruction

Let nu_b=mu_b-M_b sigma and F_b(s)=nu_b([-a,s]). Both total mass and lower outside mass are zero. For smooth envelopes, integration by parts gives

    X_b[psi]-(M_b/Z)|m(psi)|^2
        =-integral_(-a)^a F_b(s)R_psi'(s)ds.             (5)

There are no omitted atom or endpoint terms: the cumulative has total zero and R_psi(+-a)=0. The same formula with the original continuous prime main has a nonzero total mass, but the endpoint correlation is still zero. Hence either approach retains the original signed discrepancy before any estimate.

Writing epsilon_b=||F_b||_infinity/M_b, (5) gives

    |Delta_b[psi]|<=M_b epsilon_b ||R_psi'||_1
       <=4delta M_b epsilon_b ||psi'||_2||psi||_2,      psi in ker m. (6)

For fixed smooth psi, ordinary PNT gives an o(exp(b)) discrepancy bound at fixed delta. That is not an O(1)-scale bound against the fixed form A[psi]. Inserting a quantitative absolute PNT envelope improves the o-term but does not automatically change its exponential scale.

More fundamentally, there is NO constant C_delta such that

    ||R_psi'||_1<=C_delta A[psi] for every smooth psi in ker m. (7)

Proof: choose nonzero real nonnegative even phi in C_c^infinity((-delta,delta)) and a real even chi in C_c^infinity((-delta,delta)) with m(chi)!=0 (one may take chi=phi). Put

    psi_t(x)=phi(x)cos(tx)-alpha_t chi(x),
    alpha_t=m(phi cos(t .))/m(chi).

Repeated integration by parts gives alpha_t=O_N(t^(-N)) for every N, and m(psi_t)=0 exactly. Uniformly for |s|<=2delta, including one s-derivative,

    R_(psi_t)(s)=(1/2)cos(ts)R_phi(s)+O_N(t^(-N)).       (8)

The other product-to-sum term is an oscillatory integral with smooth compact amplitudes whose derivatives are uniform in s. Since R_phi(0)>0, on some fixed interval R_phi is bounded below. Differentiating (8), integrating |sin(ts)| there, and paying the bounded R_phi' term proves ||R_(psi_t)'||_1>=c_phi t eventually. Meanwhile ||psi_t||^2 tends to ||phi||^2/2 and A[psi_t]=O_phi(log(e+t)); this follows from the gamma multiplier's logarithmic upper growth and the two shifted smooth Fourier profiles. The exact-neutral correction is rapidly small also in the form norm. This proves (7).

This is a failure of the variation-based estimate, not of actual positivity: at any FIXED b, X_b is bounded while gamma energy of this family tends to infinity. A low/high-frequency split can avoid (7), but then its high-frequency payment must still use the full finite prime mass unless new signed information is supplied. No such improvement follows from (5) alone.

## 3. Route B: an unconditional logarithmic-energy transport bound

Define the positive logarithmic reference form

    E_log[psi]=integral log(e+|t|)|psihat(t)|^2 dt.       (9)

For h>0 put omega(h)=2/log(e+2/h), and omega(0)=0. The exact Fourier representation of the autocorrelation gives

    |R_psi(s)-R_psi(r)|<=omega(|s-r|) E_log[psi].        (10)

Indeed |exp(its)-exp(itr)|<=min(2,|s-r||t|). The function t/log(e+t) increases for t>=0, while 1/log(e+t) decreases. Therefore

    sup_(t>=0) min(2,ht)/log(e+t)=2/log(e+2/h).

The supremum is for this elementary upper majorant; it is not asserted to be the exact optimum for every cosine difference.

The logarithmic order of (10) cannot be improved merely by imposing the neutral moment. Use the exact-neutral family from Section 2 with t=pi/h. As h decreases to zero, (8) gives

    |R_(psi_t)(0)-R_(psi_t)(h)| -> ||phi||^2,
    E_log[psi_t]~(1/2)||phi||^2 log(1/h).

The second relation follows from the two translated Schwartz Fourier profiles; their cross term is rapidly small and log(e+|t+u|)/log t tends to1 under their integrable tails. Therefore the quotient is asymptotic to 2/log(1/h), matching omega(h) to leading order. This sharpness is for one translation pair, not simultaneous attainment across all actual prime transport edges. That distinction is precisely where arithmetic signed correlation could still help.

Define the finite transport cost

    tau_b=inf_(pi coupling(mu_b/M_b,sigma)) integral omega(|s-r|)dpi. (11)

The infimum is attained because the supports are compact and omega is continuous, including at zero. Combining (4),(10) yields, for EVERY envelope in the logarithmic form domain,

    |Delta_b[psi]-(M_b/Z-exp(b))|m(psi)|^2|
        <=M_b tau_b E_log[psi].                        (12)

In particular this is an unconditional two-sided relative estimate for the actual neutral excess. It has not replaced actual primes by a model measure.

### Comparison with the actual small-window reference

The accepted gamma lower bound a_(5/4)(t)>=log(|t|/(2pi))-4/5 and the exact recurrence give, for |t|>=1,

    a_(1/4)(t)>=log|t|-log(2pi)-4/5-4.

For |t|<=1 the positive Levy increment gives a_(1/4)(t)>=a_(1/4)(0), with a_(1/4)(0)=-EulerGamma-pi/2-3log2-logpi>-8. Elementary e>2, pi<4 bounds therefore give the convenient global inequality

    log(e+|t|)<=a_(1/4)(t)+10.

Thus

    E_log[psi]<=A[psi]+10||psi||^2
                <=(1+10/a_delta)A[psi].                (13)

No numerical a_delta is extracted from an LDL pivot. If a genuine scalar coercivity bound is supplied, (12),(13) give a numerical relative bound; otherwise (12) and the first inequality of (13) are already explicit form inequalities.

### A directly computable CDF upper bound

Let epsilon_b be the sup difference between the CDFs of mu_b/M_b and sigma. Since sigma's density is at least 1/Z, the quantile coupling has displacement at most

    h_b<=min(4delta,Z epsilon_b).

For an atomic CDF the sup is found by checking its left and right values at the actual atom locations, because the reference CDF is increasing between them. Hence

    tau_b<=omega(h_b).                                 (14)

This quantile coupling need not minimize the concave-looking cost in (11); only the stated upper bound is used. Actual weighted quantiles and hyperbolic reference values can be enclosed rigorously at a fixed b without computing a Weil spectrum. No such numerical sweep was run here.

## 4. Why even the optimal absolute-transport budget cannot close cofinally

Let N_b be the number of distinct support atoms of mu_b; M_b>0 implies N_b>=1. Put

    r=1/(4N_b p_max).

The union of radius-r intervals around all N_b atoms has sigma measure at most 2N_b r p_max=1/2. In EVERY coupling, at least half of the reference mass is therefore transported by a distance at least r. Since omega increases,

    tau_b>=omega(r)/2=1/log(e+8N_b p_max),
    M_b tau_b>=M_b/log(e+8N_b p_max).                   (15)

This is an exact finite-atomic lower bound on the BUDGET in (12). It is NOT a lower bound on |Delta_b[psi]|/E_log[psi], or on any actual eigenvalue. The step from (4) to (12) has discarded signed correlation among different transport edges.

At fixed delta, the actual inventory satisfies the elementary bound N_b<=2exp(2b+2delta). Ordinary PNT, already used in the audited broad-packet source, gives

    M_b~Z exp(b), b->infinity.

Consequently

    M_b tau_b >= c_delta exp(b)/(b+1) eventually.        (16)

Thus even OPTIMIZING the scalar absolute-transport cost cannot provide a bounded, let alone small, uniform coefficient in (12). Finer total counts, smaller maximal gaps, or a better choice of coupling cannot remove this obstruction within this proof architecture. Its cause is the slow logarithmic continuity of translation in the gamma energy metric combined with exponentially large total arithmetic mass.

The order of limits matters. At each fixed b the estimate is finite and valid, and the exact signed relative operator is compact. Equation (16) concerns this proof budget along b->infinity at fixed delta. It does not contradict compactness at fixed support and does not refute an actual support-uniform one-sided signed inequality.

## 5. What arithmetic information is still missing

The genuinely signed transport identity is, in Fourier variables,

    R_psi(s)-R_psi(r)
      =-2 integral sin(t(s+r)/2) sin(t(s-r)/2)|psihat(t)|^2 dt. (17)

For even psi this is real. The cost bound keeps only an absolute envelope of the sine product. A useful improvement must instead control its signed sum across the ACTUAL prime locations and their matched displacements in the physical neutral energy metric. A pointwise scalar bound at every frequency is not imposed here: very narrow symbol resonances may be harmless or harmful only after the true supported-envelope constraint is retained. The earlier refuted constant-gap/clipped-aggregate hypotheses are not revived.

The justified next alternative is an arithmetic, phase-sensitive matrix estimate on a specified family of actual neutral envelopes, with cross-column signs retained and certified omitted-envelope bounds. The preceding adaptive Gram theorem can then pay a genuinely bounded residual and the paired theorem supplies the scalar moment Schur port plus the sharp true-physical-projection payment. Neither theorem supplies the missing signed arithmetic estimate. An entrywise absolute Gram, CDF-only transport cost, or more absolute PNT integrations cannot substitute for it.

This pass therefore produces a rigorous actual relative estimate useful at fixed support and an exact explanation of why its absolute transport version cannot close the cofinal gap. It supplies no new actual positivity sector, endpoint, uniform signed reserve, global/cofinal result, or RH claim. No accepted source, receipt, app module, PR head or remote state was changed.
