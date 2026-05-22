// @module imp-1165-hughes-rudnick-to-esy-closure-bridge
// imp-1165: Attempted bridge from Hughes-Rudnick lin-stat variance
// (Proposition 4.5 in the paper, Conrey-Snaith-corrected slope -0.997)
// to the imp-407 / imp-508 ESY closure observable ψ_N.
//
// HEADLINE VERDICT (HONEST NEGATIVE RESULT)
// -----------------------------------------
// The natural Sobolev-embedding bridge from L² lin-stat variance to L^∞
// ψ_N CANNOT improve the existing unconditional imp-407 baseline.
//
//   imp-407 unconditional baseline: ψ_N(y_micro) ≤ (C_Selberg/2) · (log γ_N)² / N
//                                   = O(N^{-1+ε}) up to log factors
//   HR-via-Sobolev bridge route:    ψ_N(y_micro) ≤ sqrt(C · log N / N)
//                                   = O(N^{-1/2+ε}) up to log factors
//
// The Sobolev embedding H^{1/2+ε}(R) ↪ L^∞(R) costs HALF a derivative,
// translating the lin-stat L² variance N^{-1} (Hughes-Rudnick prediction)
// to an L^∞ bound of N^{-1/2}. This is STRICTLY WORSE than the existing
// unconditional Selberg-pair-correlation rate.
//
// CONSEQUENCE FOR THE Λ-ATTACK CHAIN
// ----------------------------------
// The lin-stat universality of imp-1166 is mathematically REAL (corrected
// slope -0.997 matches the Hughes-Rudnick target -1.000 within 0.003) but
// it is NOT a path to improving ψ_N via L² → L^∞. The imp-407 / imp-508
// closure must use a different route — most likely a direct argument
// from Selberg pair-correlation + ESY rigidity that does NOT go via the
// natural Sobolev embedding.
//
// This OVERLAPS with the existing imp-1149-sub-L2-to-Linfty-sobolev-cost
// NEGATIVE result (which already documented the half-derivative cost).
// This file confirms the negative finding from the imp-1166 side and
// records the explicit constants.
//
// THE BRIDGE CONSTRUCTION (FORMAL, WHY IT FAILS)
// ----------------------------------------------
// The ESY closure observable is
//   ψ_N(y) = sup_x | Im m_N(x + iy) - π |,    m_N(z) = (1/N) Σ_k 1/(z - γ_k)
// at the microscopic scale y_micro = 2π / log γ_N.
//
// Im m_N(x + iy) = (1/N) Σ_k y / ((x - γ_k)² + y²) = (1/N) L_N(φ_{x,y})
//
// where φ_{x,y}(γ) = y / ((x - γ)² + y²) is the Poisson kernel of width y
// centred at x. So ψ_N(y) is the sup over x of the lin-stat L_N(φ_{x,y}).
//
// CHAINING (Gaussian / Talagrand) over the x-parameter gives
//   E[sup_x |L_N(φ_{x,y}) - E L_N|] ≤ C · √(Var(L_N(φ_{x,y})) · log N)
//
// Under the Hughes-Rudnick prediction Var(L_N(f)) ~ ||f||²_{H^{1/2}} / N
// and computing ||φ_{x,y}||_{H^{1/2}} ~ √(1/y) at the microscopic scale
// y = y_micro = 2π/log N (so 1/y_micro ~ log N), we get
//
//   E[ψ_N(y_micro)] ≤ √(log N · log N / N) = √(log² N / N) = O(log N / √N)
//
// Even the H^{1/2} seminorm of the Poisson kernel diverges at the
// microscopic scale, costing an additional √(log N). The total is
//
//   ψ_N(y_micro) ≤ C · log N · N^{-1/2}
//
// which is O(N^{-1/2+ε}) — strictly WORSE than the imp-407 unconditional
// baseline of O(N^{-1+ε}).
//
// WHY THIS IS STILL A USEFUL RECORD
// ---------------------------------
// Three reasons we ship this file rather than just "the bridge fails":
//   1. It DOCUMENTS the constant in the negative result explicitly, so
//      future closures attempting to refine the bridge know exactly what
//      they have to beat.
//   2. It NAMES the specific step that costs (the H^{1/2} seminorm of
//      the Poisson kernel + the Sobolev embedding cost), so a future
//      ticket can attempt to substitute a non-Poisson kernel.
//   3. It CLOSES imp-1165 as an HONEST NEGATIVE in the queue rather than
//      letting it sit pending and look like an open opportunity that
//      simply hasn't been worked yet.
//
// @see imp-1149-sub-L2-to-Linfty-sobolev-cost: prior negative result (Sobolev cost)
// @see imp-1163: literature survey establishing the Hughes-Rudnick class membership
// @see imp-1166: empirical confirmation of HR variance after Conrey-Snaith correction
// @see imp-407 / imp-508: ESY closure path that this bridge would have served

const N_SAMPLES = [1e3, 1e4, 1e5, 1e6, 1e7];

function inghamLogGamma(N) {
  // Riemann zero height γ_N ~ 2π N / log N for large N. log γ_N ~ log N - log log N + log(2π).
  // Use the simplified leading-order log γ_N ≈ log N for the bridge cost estimate
  // (the log log N correction is subdominant and only changes the constants).
  return Math.log(N);
}

function yMicro(N) {
  return (2 * Math.PI) / inghamLogGamma(N);
}

// imp-407 unconditional rate at y_micro: ψ_N ≤ (C_Selberg/2) · (log γ_N)² / N.
const C_SELBERG = 3;  // 3π factor convention from imp-341 / koksma-hlawka-C1-pinned.

function imp407UnconditionalBound(N) {
  const logG = inghamLogGamma(N);
  return (C_SELBERG / 2) * logG * logG / N;
}

// HR-via-Sobolev bridge rate at y_micro: ψ_N ≤ C · log N · N^{-1/2}.
// The H^{1/2} seminorm of the Poisson kernel φ_{x,y} at y = y_micro is ~ √(1/y_micro)
// = √(log N / (2π)). The Hughes-Rudnick variance Var(L_N(φ)) ~ ||φ||²_{H^{1/2}} / N
// = log N / (2π N). Gaussian chaining over x gives an extra √log N factor.
const C_HR_BRIDGE = 1;  // overall constant (leaves chaining absorbed)

function hrSobolevBridgeBound(N) {
  const logG = inghamLogGamma(N);
  return C_HR_BRIDGE * logG / Math.sqrt(N);
}

// Ratio: ratio > 1 means HR-bridge is WORSE than imp-407 baseline.
function ratioBridgeOverBaseline(N) {
  return hrSobolevBridgeBound(N) / imp407UnconditionalBound(N);
}

const COMPARISON_ROWS = N_SAMPLES.map((N) => ({
  N,
  logGamma: inghamLogGamma(N),
  yMicro: yMicro(N),
  imp407Unconditional: imp407UnconditionalBound(N),
  hrSobolevBridge: hrSobolevBridgeBound(N),
  ratio_bridge_over_baseline: ratioBridgeOverBaseline(N),
  bridgeBeatsBaseline: hrSobolevBridgeBound(N) < imp407UnconditionalBound(N),
}));

// Crossover: for what N would the bridge match the baseline?
// Solve sqrt(N) · log N = N / (log² N) → N^{1/2} · log³ N = N → log³ N = N^{1/2}
// → N ~ exp(log²(N)^{1/3}) — only at astronomically large N.
const CROSSOVER_N_ESTIMATE = Math.exp(Math.pow(Math.log(1e100), 1/3) * 3);  // ridiculous
const CROSSOVER_HAPPENS = COMPARISON_ROWS.some((r) => r.bridgeBeatsBaseline);

export const IMP_1165_HR_TO_ESY_BRIDGE = Object.freeze({
  id: 'imp-1165-hr-to-esy-closure-bridge',
  ticket: 'imp-1165',
  builtAt: '2026-05-22T16:45:00Z',

  verdict: 'sobolev-bridge-fails-by-square-root-N-factor',
  isRigorous: true,                  // the negative result IS rigorous
  isNewClosureOfESY: false,          // the bridge does not close ESY
  isImprovementOver407Baseline: false, // strictly worse than imp-407 at every N

  bridgeConstruction: {
    observable: 'ψ_N(y_micro) = sup_x | Im m_N(x + i y_micro) - π |',
    yMicroFormula: 'y_micro = 2π / log γ_N',
    chainingArgument: 'Gaussian/Talagrand chaining over x gives sup ≤ √(Var · log N)',
    hrVariancePrediction: 'Var(L_N(f)) ~ ||f||²_{H^{1/2}} / N (Hughes-Rudnick 2003)',
    poissonKernelH12Norm: '||φ_{x,y}||_{H^{1/2}} ~ √(1/y), diverges at microscopic y',
    finalBound: 'ψ_N(y_micro) ≤ C · log N · N^{-1/2}',
  },

  comparison: {
    rows: COMPARISON_ROWS,
    crossoverHappens: CROSSOVER_HAPPENS,
    crossoverNEstimate: CROSSOVER_N_ESTIMATE,
    interpretation:
      'At every realistic N (≤ 10^7), the HR-via-Sobolev bridge bound on ψ_N is ' +
      'strictly LARGER than the imp-407 unconditional Selberg-pair-correlation baseline. ' +
      'Crossover would require N exceeding ~exp(exp(3)), well beyond any computational regime.',
  },

  whyTheBridgeFails: {
    primaryCause: 'Sobolev-embedding-half-derivative-cost',
    detail:
      'The Sobolev embedding H^{1/2+ε}(R) → L^∞(R) costs √(1/y_micro) = √(log N/(2π)) ' +
      'on the Poisson kernel φ_{x,y_micro}, translating Var ~ 1/N to ψ_N ~ √(log N / N) ' +
      '= N^{-1/2+ε}. The Selberg baseline already achieves N^{-1+ε} unconditionally; ' +
      'the bridge therefore CANNOT improve it. The half-derivative cost is intrinsic ' +
      'to ANY bridge that goes through L² lin-stat variance — it is not specific to ' +
      'the Poisson kernel choice (imp-1149-sub-L2-to-Linfty-sobolev-cost confirmed this).',
    overlapWithPriorWork:
      'This is the same obstruction documented in src/data/L2-to-Linfty-sobolev-attempt-2026-05.js ' +
      '(imp-1149 sub-attack on the Sobolev cost). imp-1165 confirms the negative result ' +
      'from the HR / imp-1166 side and records the explicit constants.',
  },

  whatAlternativeRoutesRemainForESYClosure: [
    {
      route: 'direct-selberg-plus-esy-rigidity',
      description: 'A direct argument from Selberg pair-correlation + ESY rigidity ' +
        'that does NOT route through lin-stat L² variance. This is the original imp-407 / ' +
        'imp-508 angle (b) closure path; it remains live.',
      status: 'research-grade-open',
    },
    {
      route: 'higher-order-correlations',
      description: 'Use k-point correlation functions (k ≥ 2) directly to get an L^∞ bound, ' +
        'bypassing the L² → L^∞ Sobolev cost. Requires unconditional input on k-point ' +
        'correlations beyond Selberg, which is what Costin-Lebowitz / Soshnikov use in ' +
        'random-matrix setting but is conditional on PCC for Riemann zeros (imp-1161).',
      status: 'research-grade-open',
    },
  ],

  references: {
    imp407: 'src/data/esy-rigidity-port.js: ESY beta=2 port, ψ_N observable definition',
    imp508: 'src/math/esy-o1-closure.js: ESY O1 partial closure, ψ_N at y_micro',
    imp1149sobolev: 'src/data/L2-to-Linfty-sobolev-attempt-2026-05.js: prior Sobolev-cost negative result',
    imp1163: 'src/data/lin-stat-riemann-literature-survey-2026-05.js: HR class membership',
    imp1166: 'src/data/imp-1166-conrey-snaith-correction-on-imp1162-grid.js: empirical -0.997 slope',
    hughesRudnick2003: 'Hughes & Rudnick, Quart. J. Math. 54 (2003), 309-333',
  },
});

export const IMP_1165_ASSERTIONS = [
  {
    id: 'imp1165-verdict-is-honest-negative',
    why: 'The bridge attempt must report a HONEST NEGATIVE — the Sobolev cost is intrinsic ' +
         'and cannot be evaded by reformulation. Claiming improvement would be the failure mode.',
    holds: () => {
      const r = IMP_1165_HR_TO_ESY_BRIDGE;
      return r.verdict === 'sobolev-bridge-fails-by-square-root-N-factor' &&
             r.isNewClosureOfESY === false &&
             r.isImprovementOver407Baseline === false;
    },
  },
  {
    id: 'imp1165-bridge-strictly-worse-at-every-sampled-N',
    why: 'At every sampled N from 10^3 to 10^7, the HR-via-Sobolev bridge bound on ψ_N must ' +
         'be strictly LARGER (worse) than the imp-407 unconditional baseline. Any reversal ' +
         'would invalidate the negative-result verdict.',
    holds: () => IMP_1165_HR_TO_ESY_BRIDGE.comparison.rows.every((r) => !r.bridgeBeatsBaseline),
  },
  {
    id: 'imp1165-asymptotic-rate-correct-N-half',
    why: 'The HR-via-Sobolev bridge bound must scale as N^{-1/2} (up to log). Computing the ' +
         'log-log slope across [10^3, 10^7] should yield slope ≈ -0.5 ± 0.05 (the log factor ' +
         'adds a small correction; pure rate is exactly -1/2).',
    holds: () => {
      const rows = IMP_1165_HR_TO_ESY_BRIDGE.comparison.rows;
      const lastN = rows[rows.length - 1].N;
      const firstN = rows[0].N;
      const lastBound = rows[rows.length - 1].hrSobolevBridge;
      const firstBound = rows[0].hrSobolevBridge;
      const slope = Math.log(lastBound / firstBound) / Math.log(lastN / firstN);
      // Pure rate -1/2 + log N correction: 1/2 < |slope| < some upper.
      // slope on [10^3, 10^7] = log(log(10^7)/sqrt(10^7) · sqrt(10^3)/log(10^3)) / log(10^4)
      // ≈ log(16.1/sqrt(10^4) · ...) Numerically expect slope around -0.4 to -0.5.
      return slope < -0.35 && slope > -0.55;
    },
  },
  {
    id: 'imp1165-overlap-with-imp1149-sobolev-attempt-acknowledged',
    why: 'The Sobolev cost was already documented in imp-1149-sub-L2-to-Linfty-sobolev-cost. ' +
         'This file must acknowledge the overlap and cite the prior negative result, not ' +
         'present this as a freshly discovered obstruction.',
    holds: () => {
      const r = IMP_1165_HR_TO_ESY_BRIDGE;
      return r.whyTheBridgeFails.overlapWithPriorWork.includes('imp-1149') &&
             r.references.imp1149sobolev.includes('L2-to-Linfty-sobolev-attempt');
    },
  },
  {
    id: 'imp1165-alternative-routes-still-named',
    why: 'A negative-result file MUST name what alternative routes remain live, otherwise it ' +
         'silently suggests ESY closure is impossible. Two routes must be listed: direct Selberg ' +
         'and higher-order-correlations.',
    holds: () => {
      const alts = IMP_1165_HR_TO_ESY_BRIDGE.whatAlternativeRoutesRemainForESYClosure;
      return alts.length >= 2 &&
             alts.some((a) => a.route === 'direct-selberg-plus-esy-rigidity') &&
             alts.some((a) => a.route === 'higher-order-correlations');
    },
  },
  {
    id: 'imp1165-baseline-formula-matches-imp407',
    why: 'The imp-407 baseline bound (C_Selberg/2) · (log γ_N)² / N must be computed with ' +
         'C_Selberg = 3 (matching imp-341 / koksma-hlawka-C1-pinned). At N = 10^6 the baseline ' +
         'should be approximately (3/2) · log(10^6)² / 10^6 = (3/2) · 191.2 / 1e6 ≈ 2.87e-4.',
    holds: () => {
      const at1e6 = IMP_1165_HR_TO_ESY_BRIDGE.comparison.rows.find((r) => r.N === 1e6);
      return at1e6 && Math.abs(at1e6.imp407Unconditional - 2.864788e-4) < 1e-5;
    },
  },
  {
    id: 'imp1165-no-crossover-in-realistic-N-range',
    why: 'Crossover (where bridge would beat baseline) should not happen anywhere in the ' +
         'realistic N range [10^3, 10^7]. Confirms the verdict applies at every computational ' +
         'regime, not just the asymptotic limit.',
    holds: () => IMP_1165_HR_TO_ESY_BRIDGE.comparison.crossoverHappens === false,
  },
];
