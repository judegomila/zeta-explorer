/** Research prioritization, not a theorem ranking or a claim of proximity to a proof. */
export const RH_DIRECTION_AUDIT = Object.freeze({
  date: '2026-09-30',
  recommendation: 'Prioritize exact arithmetic positivity: twin ladder / Weil / Route I certificates.',
  reason: 'This direction has an exact RH criterion, explicit finite-support arithmetic, and coefficient payloads that can be independently replayed. The all-support construction remains open.',
  routes: Object.freeze([
    { name: 'Twin ladder + bridge → Weil / Toeplitz–Krein', status: 'Best direct RH direction', next: 'Bound the signed off-diagonal prime-pair energy uniformly in the endpoint. Its diagonal is already polynomially bounded. Random-twist energy bounds do not yet recover ordinary zeta; the full-space certificate remains at width 2.' },
    { name: 'Freezing permutations / correlated barriers', status: 'Best quantitative Λ direction', next: 'Close the named finite and tail obligations. Positive candidate bounds do not establish RH.' },
    { name: 'Fluid mechanics / Burgers', status: 'Exact reformulations and useful dynamics', next: 'Prove the missing infinite-system or zero-exclusion estimate.' },
    { name: 'Heisenberg / uncertainty', status: 'A tool for the positivity problem', next: 'Preserve signed cancellation; failure of one split bound does not exclude every uncertainty argument.' },
    { name: 'Supercritical fluids / superwires', status: 'Exploratory models', next: 'Specify a theorem linking the simulated system to the completed zeta function.' },
    { name: 'Gödel witnesses', status: 'Logical exploration', next: 'Separate analogical witness behavior from a theorem about RH or formal independence.' },
  ]),
  corrections: Object.freeze([
    'Pole-free positivity over all compact smooth tests already suffices for RH.',
    'All tests on unbounded nested supports suffice without a uniform positive margin.',
    'The rank-two pole form is indefinite; the two moment directions are cosh(x/2) and sinh(x/2).',
    'Flow-blindness excludes only explicitly flow-stable hypothesis classes containing the Riemann profile.',
    'The continuum diagonal has zero product measure; a positive comparison kernel needs a separate signed residual identity.',
  ]),
  rhProved: false,
  localTwoPrimeCertificate: Object.freeze({ width: 1.3, gap: 0.0000005, status: 'Computer-assisted local certificate; analytic reduction supplied; not formally verified or refereed.' }),
  localWindowCertificate: Object.freeze({ width: 2, gap: 1e-24, primePowers: Object.freeze([2, 3, 4, 5, 7]), status: '768-bit interval congruence certificate with exact prime-5/7 interactions and full complement bounds; independent review and the all-support inequality remain outstanding.' }),
  unboundedSupportReduction: Object.freeze({ testFamily: 'One fixed pole-free spline and its two signed translates.', criterion: 'For every epsilon>0, |k(R)| <= C_epsilon exp(epsilon R) for all R>1.', globalBoundProved: false, status: 'Equivalence derived, pending independent review; finite two-copy diagnostics do not certify all supports.' }),
  unboundedSupportEnergy: Object.freeze({ criterion: 'For every epsilon>0, integral from 1 to infinity of exp(-2 epsilon R) P(R)^2 is finite.', diagonalBound: 'At most ||C||_2^2 (L+1)^2 (L+2) through endpoint L.', missingEstimate: 'A one-sided subexponential upper bound for the signed off-diagonal prime-pair sum.', randomTwistResult: 'Weighted energy is finite almost surely for every epsilon>0 under independent fair prime signs extended completely multiplicatively.', recoveryOfOrdinaryZetaProved: false, globalUntwistedBoundProved: false, status: 'Analytic derivations require independent review; continuous finite energy checks through L=6 do not prove RH.' }),
  allPlusRecoveryAudit: Object.freeze({ rawUniformConditioningBound: 'False for epsilon<1/2: the moving cutoff edge has divergent weighted energy.', nonzeroBias: 'Retains a nonzero multiple of the original deterministic prime sum; the fluctuation bound does not control this mean.', centeredRecovery: 'Exact continuum subtraction and endpoint identity derived; the uniform bound remains unproved.', absolutePrimePairBound: 'Grows at least exponentially in the endpoint, so cannot establish the desired signed estimate.', centeredUniformBoundProved: false, status: 'Nine exact/512-bit check groups; independent review required. No improvement of the unconditional growth exponent or RH proof.' }),
  newLambdaBound: false,
});
