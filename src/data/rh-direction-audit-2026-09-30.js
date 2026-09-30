/** Research prioritization, not a theorem ranking or a claim of proximity to a proof. */
export const RH_DIRECTION_AUDIT = Object.freeze({
  date: '2026-09-30',
  recommendation: 'Prioritize exact arithmetic positivity: twin ladder / Weil / Route I certificates.',
  reason: 'This direction has an exact RH criterion, explicit finite-support arithmetic, and coefficient payloads that can be independently replayed. The all-support construction remains open.',
  routes: Object.freeze([
    { name: 'Twin ladder + bridge → Weil / Toeplitz–Krein', status: 'Best direct RH direction', next: 'Review the width-1.65 certificate retaining the prime-5 edge coupling; test the derived prime-7 four-node blocks. All-support positivity remains open.' },
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
  localWindowCertificate: Object.freeze({ width: 1.65, gap: 1e-14, primePowers: Object.freeze([2, 3, 4, 5]), status: '512-bit interval certificate with exact prime-5 coupling and full complement bounds; the all-support inequality remains unproved.' }),
  newLambdaBound: false,
});
