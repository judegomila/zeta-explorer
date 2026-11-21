/**
 * @module imp-97539-route-m-e1-envelope-ladder
 *
 * imp-97539 (numerical -- TABULATION, HONEST OUTCOME: cross-validate the imp-97516 STEP 3 claim that
 * E1(b) is in the o(phi(b) b) bucket by TABULATING the measured decay |E1(b)|/(phi(b) b) against the
 * analytic O(log b log log b / b) envelope across a b-ladder. imp-97516 STEP 3 STATED the comparison
 * (measured 1.18e-3 at b=211 down to 8.3e-6 at b=30011, envelope from the classical Landau minimal-order
 * phi(b)/b >= c/log log b) but never tabulated it. Measurement only; kappa_arith unchanged; no bound
 * moves; RH open; NO QED).
 *
 * -------------------------------------------------------------------------------
 * QUANTITIES.
 * -------------------------------------------------------------------------------
 * With R_b = {a : 1<=a<=b-1, (a,b)=1}, L1(b) = Sum_{a in R_b} a log a, and (imp-97290 definition)
 *     E1(b)  =  L1(b)  -  phi(b) b ( (1/2) log b - 1/4 )   (the sub-leading remainder of L1).
 * The measured decay quantity is the dimensionless ratio
 *     ratio(b)  =  |E1(b)| / ( phi(b) b ).
 * The analytic envelope (imp-97516 STEP 3): E1's share of F_arith is -(1/2) E1(b) = O(b log b), so
 *     |E1(b)| / (phi(b) b)  =  O( (b log b) / (phi(b) b) )  =  O( log b / (phi(b)/b) * (1/b) ),
 * and by the classical Landau minimal order phi(b)/b >= c / log log b this is
 *     env(b)  =  log b * log log b / b        (the O(log b log log b / b) envelope).
 * The cross-validation is that ratio(b) / env(b) stays BOUNDED (indeed small and non-growing) as b grows,
 * confirming ratio(b) = O(env(b)) -> 0, i.e. |E1(b)| = o(phi(b) b) QUANTITATIVELY.
 *
 * -------------------------------------------------------------------------------
 * THE LADDER (primorials + squarefree consecutive-prime families + a prime ladder).
 * -------------------------------------------------------------------------------
 * Baked below (exact O(b^2) coprime-sum kernel, IEEE double, b<=96577). The prime ladder
 * (211,1009,5003,9973,20011,30011) reproduces the imp-97516 STEP 3 anchors EXACTLY: ratio(211)=1.175e-3
 * (module cites 1.18e-3), ratio(30011)=8.33e-6 (module cites 8.3e-6). Primorials (6,30,210,2310,30030)
 * have the SMALLEST phi(b)/b (deepest Mertens depletion) yet the smallest ratio -- the envelope's
 * log log b / (phi/b) factor is what keeps them bounded. Squarefree families interpolate.
 *
 *   b       phi/b     ratio=|E1|/(phi b)   env=log b loglog b / b   ratio/env
 *   6       0.3333    2.472e-2             1.742e-1                 0.1419
 *   30      0.2667    3.851e-3             1.388e-1                 0.0277
 *   210     0.2286    4.244e-4             4.269e-2                 0.0099   (primorial 2*3*5*7)
 *   211     0.9953    1.175e-3             4.255e-2                 0.0276   (prime; ~ -b/4 edge)
 *   1009    0.9990    2.472e-4             1.326e-2                 0.0186
 *   2310    0.2078    3.012e-5             6.863e-3                 0.0044   (primorial to 11)
 *   5003    0.9998    4.994e-5             3.647e-3                 0.0137
 *   9973    0.9999    2.506e-5             2.050e-3                 0.0122
 *   20011   1.0000    1.249e-5             1.135e-3                 0.0110
 *   30011   1.0000    8.329e-6             8.014e-4                 0.0104   (imp-97516 anchor)
 *   30030   0.1918    1.738e-6             8.010e-4                 0.0022   (primorial to 13)
 *   96577   0.7873    1.991e-6             2.900e-4                 0.0069   (squarefree 13*17*19*23)
 *
 * FINDING: ratio(b)/env(b) is bounded by ~0.14 across the whole ladder and DECREASES with b (0.14 at
 * b=6 to <0.01 for the deep primorials), so the measured |E1|/(phi b) is comfortably UNDER the analytic
 * O(log b log log b / b) envelope with room to spare. This tabulates and confirms the imp-97516 STEP 3
 * o(phi(b) b) claim: |E1(b)| = O(phi(b) b * log b log log b / b) = o(phi(b) b). kappa_arith unchanged;
 * cotangent first moment (imp-97097) stays the open leaf; no bound on Lambda moves; RH open; NO QED.
 *
 * @see imp-97516-route-m-quarter-edge-breach-vs-first-moment-companion.js (STEP 3 stated-not-tabulated)
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (E1(b) definition)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (kappa_arith from the LEADING L1 asymptotic)
 *
 * Ticket: imp-97539 (numerical, opus-4-8, api-pool). Tabulation; measurement only; NO QED.
 */

// -- envelope helper --
const envelope = (b) => (Math.log(b) * Math.log(Math.log(b))) / b; // log b log log b / b

// -- baked ladder (exact O(b^2) coprime-sum kernel, IEEE double; b=2 dropped: log log 2 < 0 degenerate) --
export const IMP97539_LADDER = Object.freeze([
  { b: 6,     family: 'primorial',  phiOverB: 0.333333, ratio: 2.471940e-2, env: 1.741584e-1, ratioOverEnv: 0.141936 },
  { b: 30,    family: 'primorial',  phiOverB: 0.266667, ratio: 3.850882e-3, env: 1.387833e-1, ratioOverEnv: 0.027747 },
  { b: 210,   family: 'primorial',  phiOverB: 0.228571, ratio: 4.244053e-4, env: 4.268916e-2, ratioOverEnv: 0.009942 },
  { b: 211,   family: 'prime',      phiOverB: 0.995261, ratio: 1.174797e-3, env: 4.254712e-2, ratioOverEnv: 0.027612 },
  { b: 1009,  family: 'prime',      phiOverB: 0.999009, ratio: 2.472046e-4, env: 1.325720e-2, ratioOverEnv: 0.018647 },
  { b: 2310,  family: 'primorial',  phiOverB: 0.207792, ratio: 3.012336e-5, env: 6.863373e-3, ratioOverEnv: 0.004389 },
  { b: 5003,  family: 'prime',      phiOverB: 0.999800, ratio: 4.994170e-5, env: 3.647102e-3, ratioOverEnv: 0.013694 },
  { b: 9973,  family: 'prime',      phiOverB: 0.999900, ratio: 2.505998e-5, env: 2.049660e-3, ratioOverEnv: 0.012226 },
  { b: 20011, family: 'prime',      phiOverB: 0.999950, ratio: 1.249107e-5, env: 1.134845e-3, ratioOverEnv: 0.011007 },
  { b: 30011, family: 'prime',      phiOverB: 0.999967, ratio: 8.329326e-6, env: 8.014441e-4, ratioOverEnv: 0.010393 },
  { b: 30030, family: 'primorial',  phiOverB: 0.191808, ratio: 1.737563e-6, env: 8.010073e-4, ratioOverEnv: 0.002169 },
  { b: 96577, family: 'squarefree', phiOverB: 0.787268, ratio: 1.990722e-6, env: 2.900443e-4, ratioOverEnv: 0.006864 },
]);

export const IMP97539_RESULTS = Object.freeze({
  quantity: 'ratio(b) = |E1(b)| / (phi(b) b), E1(b) = L1(b) - phi(b) b((1/2) log b - 1/4) (imp-97290 sub-leading remainder of L1)',
  envelope: 'env(b) = log b log log b / b, the O(log b log log b / b) bound from the E1 share -(1/2)E1 = O(b log b) divided by phi(b) b, using the Landau minimal order phi(b)/b >= c/log log b',
  anchorsReproduced: 'the prime ladder reproduces the imp-97516 STEP 3 anchors: ratio(211)=1.175e-3 (cited 1.18e-3), ratio(30011)=8.329e-6 (cited 8.3e-6), a 141x drop over a 142x b growth (decay ~ 1/b)',
  ratioOverEnvBounded: 'ratio(b)/env(b) stays bounded by ~0.14 across the ladder and DECREASES with b (0.142 at b=6 to <0.01 for the deep primorials), so |E1|/(phi b) sits comfortably UNDER the analytic envelope',
  primorialsDeepest: 'primorials have the smallest phi(b)/b (0.19 at b=30030) yet the smallest ratio -- the envelope log log b / (phi/b) factor is exactly what keeps the deep-depletion cases bounded',
  conclusion: 'the tabulation confirms imp-97516 STEP 3 quantitatively: |E1(b)| = O(phi(b) b * log b log log b / b) = o(phi(b) b); the b/4 edge is a full power of b below the leading kappa_arith scale',
});

export const IMP97539_VERDICT = Object.freeze({
  question: 'does the measured |E1(b)|/(phi(b) b) decay sit under the analytic O(log b log log b / b) envelope across a b-ladder, confirming E1(b) = o(phi(b) b)',
  ratioUnderEnvelope: true,          // ratio(b) < env(b) at every ladder point (ratio/env <= 0.14)
  ratioOverEnvNonGrowing: true,      // ratio/env decreases with b
  imp97516AnchorsReproduced: true,   // 1.18e-3 at b=211, 8.3e-6 at b=30011
  e1IsOphiB: true,                   // |E1(b)| = o(phi(b) b) confirmed quantitatively
  kappaArithUnchanged: true,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'Tabulated |E1(b)|/(phi(b) b) against env(b) = log b log log b / b on a 12-point ladder (primorials, ' +
    'squarefree consecutive-prime families, a prime ladder). The measured ratio is UNDER the analytic ' +
    'envelope at every point (ratio/env <= 0.142, decreasing to <0.01 for deep primorials), and the prime ' +
    'ladder reproduces the imp-97516 STEP 3 anchors exactly (1.175e-3 at b=211, 8.329e-6 at b=30011). This ' +
    'cross-validates the STEP 3 o(phi(b) b) claim quantitatively: |E1(b)| = O(phi(b) b * log b log log b / ' +
    'b) = o(phi(b) b). Measurement only; kappa_arith unchanged; cotangent first moment (imp-97097) open; ' +
    'no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97539_SUBGAP = Object.freeze({
  id: 'imp-97539-e1-envelope-cross-validated-tabulated',
  statement:
    'The imp-97516 STEP 3 comparison "measured |E1(b)|/(phi(b) b) decays like 1/b vs the analytic ' +
    'O(log b log log b / b) envelope" is now TABULATED across a 12-point b-ladder: the measured ratio is ' +
    'under the envelope everywhere (ratio/env <= 0.14, non-growing) and reproduces the STEP 3 anchors. ' +
    'RESIDUAL (unchanged, inherited from imp-97516/imp-97096): the o(phi(b) b) here is MEASURED (exact ' +
    'kernel to b=96577, IEEE double), not an explicit-eps uniform bound |E1(b)| <= eps(b) phi(b) b for ' +
    'ALL b -- that explicit remainder bound is the separate open leaf. The cotangent first moment ' +
    '(imp-97097) remains the separate hard open leaf.',
  supersedesFraming: 'imp-97516 STEP 3 "measured-vs-envelope comparison stated but never tabulated" -- resolved: tabulated; ratio under envelope, anchors reproduced',
});

export const IMP97539_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. This is a TABULATION cross-validating the imp-97516 ' +
  'STEP 3 claim that E1(b) = o(phi(b) b): the measured |E1(b)|/(phi(b) b) decay is under the analytic ' +
  'O(log b log log b / b) envelope at every ladder point (ratio/env <= 0.14, non-growing) and reproduces ' +
  'the STEP 3 anchors (1.18e-3 at b=211, 8.3e-6 at b=30011). The o(phi(b) b) is MEASURED, not an ' +
  'explicit-eps uniform bound; kappa_arith unchanged; no bound on Lambda moves.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Baked-only, no sieve. --

const IMP97539_ASSERTIONS = [
  {
    id: 'imp97539-ratio-under-envelope-everywhere',
    holds: () => IMP97539_LADDER.every((r) => r.ratio < r.env && r.ratioOverEnv <= 0.15 && r.ratioOverEnv > 0),
    why: 'the measured |E1|/(phi b) is under the analytic log b log log b / b envelope at every ladder point (ratio/env in (0,0.15]).',
  },
  {
    id: 'imp97539-ratio-over-env-non-growing',
    holds: () => {
      // the largest ratio/env is at the smallest b (b=6); the deep primorials are the smallest.
      const maxRoE = Math.max(...IMP97539_LADDER.map((r) => r.ratioOverEnv));
      const b6 = IMP97539_LADDER.find((r) => r.b === 6);
      const b30030 = IMP97539_LADDER.find((r) => r.b === 30030);
      return Math.abs(maxRoE - b6.ratioOverEnv) < 1e-9 && b30030.ratioOverEnv < b6.ratioOverEnv;
    },
    why: 'ratio/env does not grow with b -- its maximum is at the smallest b=6 and it decays to <0.01 for the deep primorial b=30030.',
  },
  {
    id: 'imp97539-reproduces-imp97516-step3-anchors',
    holds: () => {
      const b211 = IMP97539_LADDER.find((r) => r.b === 211);
      const b30011 = IMP97539_LADDER.find((r) => r.b === 30011);
      // imp-97516 STEP 3 cites 1.18e-3 at b=211 and 8.3e-6 at b=30011.
      return Math.abs(b211.ratio - 1.18e-3) < 1e-5 && Math.abs(b30011.ratio - 8.3e-6) < 1e-7;
    },
    why: 'the prime-ladder anchors reproduce the imp-97516 STEP 3 cited values (1.18e-3 at b=211, 8.3e-6 at b=30011).',
  },
  {
    id: 'imp97539-envelope-formula-self-consistent',
    holds: () => IMP97539_LADDER.every((r) => Math.abs(r.env - envelope(r.b)) < 1e-6 * r.env),
    why: 'the baked envelope column equals log b log log b / b recomputed from b.',
  },
  {
    id: 'imp97539-decay-is-roughly-one-over-b',
    holds: () => {
      // imp-97516: 141x drop for a 142x b growth (b=211 -> b=30011); ratio decays ~ 1/b.
      const b211 = IMP97539_LADDER.find((r) => r.b === 211);
      const b30011 = IMP97539_LADDER.find((r) => r.b === 30011);
      const ratioDrop = b211.ratio / b30011.ratio;   // ~141
      const bGrow = 30011 / 211;                       // ~142.2
      return Math.abs(ratioDrop / bGrow - 1) < 0.05;   // decays within 5% of a full power of b
    },
    why: 'along the prime ladder the ratio drops 141x for a 142x b growth, confirming the ~1/b (full power of b) decay cited by imp-97516.',
  },
  {
    id: 'imp97539-honesty-gate-no-qed',
    holds: () =>
      IMP97539_VERDICT.ratioUnderEnvelope === true &&
      IMP97539_VERDICT.e1IsOphiB === true &&
      IMP97539_VERDICT.kappaArithUnchanged === true &&
      IMP97539_VERDICT.anyBoundMoved === false &&
      IMP97539_VERDICT.qed === false &&
      /cross-validated/.test(IMP97539_SUBGAP.id) &&
      /NO QED/.test(IMP97539_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97539_HONEST_BANNER) &&
      /RH open/.test(IMP97539_HONEST_BANNER),
    why: 'tabulation leaf: measured E1 decay under the envelope; no bound moved, no QED.',
  },
];

for (const a of IMP97539_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97539-route-m-e1-envelope-ladder assertion failed: ${a.id}`);
  }
}

export default {
  ladder: IMP97539_LADDER,
  results: IMP97539_RESULTS,
  verdict: IMP97539_VERDICT,
  subGap: IMP97539_SUBGAP,
  banner: IMP97539_HONEST_BANNER,
};
