/** Research prioritization, not a theorem ranking or a claim of proximity to a proof. */
export const RH_DIRECTION_AUDIT = Object.freeze({
  date: '2026-09-30',
  recommendation: 'Prioritize exact arithmetic positivity: twin ladder / Weil / Route I certificates.',
  reason: 'This direction has an exact RH criterion, explicit finite-support arithmetic, and coefficient payloads that can be independently replayed. The all-support construction remains open.',
  routes: Object.freeze([
    { name: 'Twin ladder + bridge → Weil / Toeplitz–Krein', status: 'Best direct RH direction', next: 'Replay the local certificates; reach log(3); include p=3 beyond that threshold.' },
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
  newLambdaBound: false,
});
