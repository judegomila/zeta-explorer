/**
 * @module imp-35894-empirical-vs-natural-rate-required-height
 *
 * imp-35894 (accuracy, measurement/cross-validation): COMPARE the two REQ-4 required-height
 * estimates that were never placed side by side -- the imp-35538 FIXED natural-rate closed
 * form log T0 >= 1/b (b = 0.5% => log T0 >= 200), and the height read off the imp-35853
 * EMPIRICAL required-height multiple 200 / log T0 along the actual imp-33582 sigma downslope --
 * for a grid of fidelity budgets b in {0.5%, 1%, 2%, 5%}, tabulating the ratio
 * (empirical required height) / (natural-rate required height) per budget.
 *
 * SET-UP. imp-35538 REQ 4 fixes the natural leading remainder rate O(1/log T0): to hit a
 * relative fidelity budget b it needs 1 / log T0 <= b, i.e. the natural-rate binding log-height
 *   naturalLogT0(b) = 1 / b   (200, 100, 50, 20 for b = 0.5, 1, 2, 5%; imp-35576 sweep),
 * with the closed-form height T0 = e^(1/b). imp-35853 instead reads a required-height MULTIPLE
 * 200 / log T0 continuously off the imp-33582 sigma surrogate (sigma = E_coll /
 * (E_trunc + E_flow + E_coll), log T0 = log(effectiveHeightForN(N)) on the imp-3220 / imp-3406
 * RvM surrogate), with the numerator FROZEN at 200 = 1 / b0 (b0 = 0.5%, the single budget
 * imp-35538 anchored on). The b-scaled binding on that fixed-numerator multiple -- the height at
 * which the multiple hits the b-relaxed threshold -- is (per the ticket) where
 *   200 / log T0 = 1 / (200 b),   i.e.   empiricalLogT0(b) = 200^2 * b = b / b0^2.
 *
 * WHAT THE COMPARISON SHOWS (the honest finding). The two required-height estimates COINCIDE
 * EXACTLY at the anchoring budget b = b0 = 0.5% (both log T0 = 200, T0 = e^200 ~ 7.23e86,
 * ratio = 1 -- reproducing the imp-35538 e^200 figure and the imp-35888 1x-binding N ~ 2.27e88,
 * sigma ~ 1.18e-39). Away from the anchor they DIVERGE QUADRATICALLY: the empirical b-scaled
 * binding demands log-height b / b0^2 (linear-INCREASING in b: 200, 400, 800, 2000), while the
 * natural rate relaxes as 1 / b (DECREASING: 200, 100, 50, 20), so the ratio is
 *   empiricalLogT0 / naturalLogT0 = (b / b0)^2 = 1, 4, 16, 100
 * for b = 0.5, 1, 2, 5%. The discrepancy is a MEASUREMENT ARTIFACT of the frozen numerator: the
 * imp-35853 multiple is a b0 = 0.5%-ANCHORED diagnostic, and interpreting its "1 / (200 b)"
 * b-scaled threshold as a required-height model implies a quadratic (b / b0)^2 over-demand of
 * log-height relative to the same O(1/log T0) rate that gives the natural-rate 1 / b. Rescaling
 * the numerator to 1 / b (the true b-budget) would make the empirical binding coincide with the
 * natural rate at EVERY budget -- so the two agree only at the anchoring budget, and the frozen
 * anchor, not the underlying rate, drives the gap.
 *
 * PRACTICAL CONSEQUENCE. The empirical b-scaled binding log-height b / b0^2 leaves the
 * double-precision-representable height range (T0 = e^(b/b0^2) < Number.MAX_VALUE, i.e.
 * b / b0^2 < log(MAX_VALUE) ~ 709.78 <=> b < ~1.77%) already at b = 2%. So on the sigma
 * surrogate only b = 0.5% (N ~ 2.27e88, sigma ~ 1.18e-39) and b = 1% (N ~ 3.30e175,
 * sigma ~ 4.37e-83) are reachable; b = 2% (log T0 = 800) and b = 5% (log T0 = 2000) need
 * T0 = e^800 / e^2000 far beyond MAX_VALUE and are not representable. The natural-rate heights
 * (1 / b = 200 ... 20) are all trivially representable.
 *
 * Measurement / cross-validation only; re-reads the imp-33582 model and the imp-35538 binding
 * log-height on the same imp-3220 / imp-3406 surrogate; derives no remainder; discharges
 * nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi)
 * (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are
 * UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35538-route-i-remainder-derivation-requirements (REQ 4; natural rate log T0 = 1/b, e^(1/b); imp-35576 budget sweep)
 * @see imp-35853-req4-required-height-continuous-sigma-knee (empirical multiple 200 / log T0 vs sigma)
 * @see imp-35888-req4-required-height-multiple-reaches-1x (1x binding at N ~ 2.27e88, T0 = e^200)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source model; peak sigma_max ~ 0.9494)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS } from './imp-35538-route-i-remainder-derivation-requirements.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// REQ-4 anchoring budget and binding log-height: 1/log T0 <= b0 => log T0 >= 1/b0 = 200 (imp-35538).
const HR = IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.heightRegime;
const LOG_T0_NEEDED = HR.logT0NeededForHalfPctBudget; // 200
const B0 = 1 / LOG_T0_NEEDED; // 0.005 (the imp-35538 anchoring budget, 0.5%)

// EXACT imp-3406 / imp-33582 sub-terms (identical to imp-35853 / imp-35888; no re-derivation).
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, sigma: E_coll / E_N, logT0: L };
}

// Bisect the downslope N whose surrogate log-height equals a target log T0 (monotone in N).
function nForLogT0(target) {
  let a = Math.log(1e6);
  let b = Math.log(1e300);
  for (let i = 0; i < 600; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).logT0 < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const LOG_MAX_VALUE = Math.log(Number.MAX_VALUE); // ~709.782712893384 (double-precision height ceiling)

// Per-budget comparison of the two required-height estimates.
const BUDGET_GRID = [0.005, 0.01, 0.02, 0.05];
const comparison = BUDGET_GRID.map((b) => {
  const naturalLogT0 = 1 / b; // imp-35538 closed form 1/b
  const bScaledThreshold = 1 / (LOG_T0_NEEDED * b); // the imp-35853 multiple threshold 1/(200 b)
  const empiricalLogT0 = LOG_T0_NEEDED / bScaledThreshold; // = 200^2 * b = b / b0^2
  const ratioLogHeight = empiricalLogT0 / naturalLogT0; // = (b / b0)^2
  const representable = empiricalLogT0 < LOG_MAX_VALUE; // T0 = e^empiricalLogT0 finite in double
  const row = {
    budget: b,
    budgetPct: +(100 * b).toPrecision(3), // 0.5, 1, 2, 5
    naturalLogT0: +naturalLogT0.toFixed(2), // 200, 100, 50, 20
    empiricalMultipleThreshold: +bScaledThreshold.toFixed(4), // 1/(200 b): 1, 0.5, 0.25, 0.1
    empiricalLogT0: +empiricalLogT0.toFixed(2), // 200, 400, 800, 2000
    ratioLogHeight: +ratioLogHeight.toFixed(4), // 1, 4, 16, 100
    empiricalHeightRepresentable: representable,
  };
  if (representable) {
    // Read off the sigma surrogate: the downslope N / sigma at the empirical binding height.
    const N = nForLogT0(empiricalLogT0);
    const p = parts(N);
    row.empiricalN = +N.toExponential(4);
    row.empiricalSigma = +p.sigma.toExponential(4);
    row.empiricalLogT0Check = +p.logT0.toFixed(4); // must equal empiricalLogT0
  }
  return row;
});

// The b = 0.5% anchor row (where the two estimates coincide) and the representability crossover.
const ANCHOR = comparison[0];
const B_REPRESENTABLE_CROSSOVER = LOG_MAX_VALUE * B0 * B0; // b/b0^2 < log(MAX) <=> b < log(MAX)*b0^2

export const IMP35894_EMPIRICAL_VS_NATURAL_RATE_REQUIRED_HEIGHT = {
  id: 'imp-35894',
  proofSection: 'S-frontier',
  question:
    'How does the required binding log-height read off the imp-35853 EMPIRICAL required-height multiple ' +
    '200 / log T0 (b-scaled threshold 1 / (200 b)) along the imp-33582 sigma downslope compare to the ' +
    'imp-35538 REQ-4 FIXED natural-rate closed form log T0 = 1 / b, across fidelity budgets b in ' +
    '{0.5%, 1%, 2%, 5%}? Does the actual sigma surrogate demand a different binding height than the ' +
    'natural O(1/log T0) rate predicts?',
  method:
    'For each budget b, form the imp-35538 natural-rate binding log-height 1 / b and its closed-form ' +
    'T0 = e^(1/b); form the imp-35853 b-scaled binding on the fixed-numerator multiple 200 / log T0 by ' +
    'solving 200 / log T0 = 1 / (200 b) => empiricalLogT0 = 200^2 * b = b / b0^2; read off the sigma ' +
    'surrogate the downslope N / sigma at that empirical height (where representable) by bisection on ' +
    'the shared imp-3220 / imp-3406 RvM surrogate; tabulate the ratio empiricalLogT0 / naturalLogT0 ' +
    'per budget and flag where the empirical height leaves the double-precision-representable range.',
  anchoringBudget: B0, // 0.005 (the single budget imp-35538 / imp-35853 anchored on)
  logT0Needed: LOG_T0_NEEDED, // 200 = 1/b0
  comparison,
  // The honest finding: the two estimates coincide EXACTLY at the anchoring budget and diverge
  // quadratically -- the ratio is (b/b0)^2 because the frozen 200-numerator makes the empirical
  // b-scaled binding demand b/b0^2 log-height (increasing in b) versus the natural rate 1/b.
  coincideAtAnchor: Math.abs(ANCHOR.ratioLogHeight - 1) < 1e-9,
  ratioIsBOverB0Squared: BUDGET_GRID.every((b, i) => Math.abs(comparison[i].ratioLogHeight - (b / B0) ** 2) < 1e-6),
  discrepancyIsFrozenNumeratorArtifact:
    'The imp-35853 multiple 200 / log T0 freezes its numerator at 200 = 1/b0 (b0 = 0.5%). Its ' +
    '1 / (200 b) b-scaled threshold therefore encodes empiricalLogT0 = b / b0^2, quadratic-increasing ' +
    'in b, whereas the same O(1/log T0) rate gives the natural-rate 1 / b, decreasing in b. The two ' +
    'coincide only at b = b0; rescaling the numerator to 1 / b would make them agree at every budget, ' +
    'so the frozen anchoring budget -- not the underlying rate -- drives the (b/b0)^2 over-demand.',
  representabilityCrossoverBudget: +B_REPRESENTABLE_CROSSOVER.toFixed(6), // ~0.017744 (1.77%)
  // Only b = 0.5% and b = 1% have a representable empirical binding height; b = 2% / 5% need e^800 / e^2000.
  representableBudgets: comparison.filter((r) => r.empiricalHeightRepresentable).map((r) => r.budgetPct),
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT / CROSS-VALIDATION (NOT rigorous). Placing the imp-35538 REQ-4 natural-rate binding ' +
    'log-height 1 / b (200, 100, 50, 20 for b = 0.5, 1, 2, 5%) side by side with the height read off the ' +
    'imp-35853 empirical required-height multiple 200 / log T0 (b-scaled binding 200 / log T0 = 1/(200 b), ' +
    'i.e. empiricalLogT0 = b / b0^2 = 200, 400, 800, 2000): the two estimates COINCIDE EXACTLY at the ' +
    'anchoring budget b = b0 = 0.5% (both log T0 = 200, T0 = e^200 ~ 7.23e86, reproducing the imp-35538 ' +
    'figure and the imp-35888 1x binding N ~ 2.27e88, sigma ~ 1.18e-39), but DIVERGE QUADRATICALLY away ' +
    'from it: the ratio empiricalLogT0 / naturalLogT0 = (b / b0)^2 = 1, 4, 16, 100. The discrepancy is a ' +
    'measurement artifact of the frozen 200-numerator -- the imp-35853 multiple is a b0 = 0.5%-anchored ' +
    'diagnostic, and its 1/(200 b) b-scaled threshold implies a quadratic (b/b0)^2 over-demand of ' +
    'log-height relative to the same O(1/log T0) rate that yields the natural-rate 1 / b; rescaling the ' +
    'numerator to 1 / b restores agreement at every budget, so the actual sigma surrogate does NOT demand ' +
    'a different binding height than the natural rate once the anchoring budget is matched. The empirical ' +
    'b-scaled height moreover leaves the double-precision-representable range at b > ~1.77% (b / b0^2 > ' +
    'log(MAX_VALUE) ~ 709.78), so only b = 0.5% (N ~ 2.27e88, sigma ~ 1.18e-39) and b = 1% (N ~ 3.30e175, ' +
    'sigma ~ 4.37e-83) are reachable on the surrogate; b = 2% / 5% need T0 = e^800 / e^2000 beyond ' +
    'MAX_VALUE. Measurement / cross-validation only on the existing surrogates; re-reads the imp-33582 ' +
    'model and the imp-35538 binding log-height; derives no remainder; discharges nothing; changes no ' +
    'bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), ' +
    'E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays ' +
    'OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35538 (REQ 4; natural rate log T0 = 1/b, T0 = e^(1/b); imp-35576 budget sweep); imp-35853 ' +
    '(empirical multiple 200 / log T0 vs sigma); imp-35888 (1x binding at N ~ 2.27e88, T0 = e^200); ' +
    'imp-33582 (sigma-decay model; peak sigma_max ~ 0.9494); imp-3220 / imp-3406 (RvM surrogate ' +
    'log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 ' +
    '(GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 ' +
    '(Lambda <= 0.2).',
};

export const IMP35894_EMPIRICAL_VS_NATURAL_RATE_REQUIRED_HEIGHT_ASSERTIONS = [
  {
    // (1) the natural-rate binding heights reproduce the imp-35538 / imp-35576 1/b closed form.
    id: 'imp35894-natural-rate-1overB-matches-imp35538',
    description: 'naturalLogT0 = 1/b = 200, 100, 50, 20 for b = 0.5, 1, 2, 5%, matching the imp-35538 / imp-35576 closed form',
    holds: () =>
      comparison.map((r) => r.naturalLogT0).join(',') === '200,100,50,20' &&
      Math.abs(LOG_T0_NEEDED - 200) < 1e-9 &&
      Math.abs(B0 - 0.005) < 1e-12,
  },
  {
    // (2) the two estimates coincide EXACTLY at the anchoring budget b0 = 0.5% (ratio = 1, both log T0 = 200).
    id: 'imp35894-coincide-at-anchor-budget',
    description: 'at b = b0 = 0.5% the empirical and natural binding log-heights both equal 200 and the ratio is 1',
    holds: () =>
      IMP35894_EMPIRICAL_VS_NATURAL_RATE_REQUIRED_HEIGHT.coincideAtAnchor === true &&
      Math.abs(ANCHOR.empiricalLogT0 - 200) < 1e-6 &&
      Math.abs(ANCHOR.naturalLogT0 - 200) < 1e-6,
  },
  {
    // (3) the ratio empiricalLogT0 / naturalLogT0 = (b/b0)^2 = 1, 4, 16, 100 -- quadratic divergence.
    id: 'imp35894-ratio-is-quadratic-bOverB0-squared',
    description: 'the ratio empiricalLogT0 / naturalLogT0 = (b/b0)^2 = 1, 4, 16, 100 across the budget grid',
    holds: () =>
      IMP35894_EMPIRICAL_VS_NATURAL_RATE_REQUIRED_HEIGHT.ratioIsBOverB0Squared === true &&
      comparison.map((r) => r.ratioLogHeight).join(',') === '1,4,16,100',
  },
  {
    // (4) the empirical b-scaled binding log-heights are b/b0^2 = 200, 400, 800, 2000 (increasing in b),
    //     opposite to the natural rate's decreasing 200, 100, 50, 20.
    id: 'imp35894-empirical-heights-increasing-opposite-natural',
    description: 'empiricalLogT0 = b/b0^2 = 200, 400, 800, 2000 (increasing in b) vs naturalLogT0 decreasing 200, 100, 50, 20',
    holds: () => {
      const emp = comparison.map((r) => r.empiricalLogT0);
      const nat = comparison.map((r) => r.naturalLogT0);
      const empIncreasing = emp.every((v, i) => i === 0 || v > emp[i - 1]);
      const natDecreasing = nat.every((v, i) => i === 0 || v < nat[i - 1]);
      return emp.join(',') === '200,400,800,2000' && empIncreasing && natDecreasing;
    },
  },
  {
    // (5) the b = 0.5% empirical binding reproduces the imp-35888 1x-binding N ~ 2.27e88, sigma ~ 1.18e-39.
    id: 'imp35894-anchor-reproduces-imp35888-1x-binding',
    description: 'the b = 0.5% empirical binding (log T0 = 200) reproduces the imp-35888 1x binding N ~ 2.27e88, sigma ~ 1.18e-39',
    holds: () =>
      ANCHOR.empiricalHeightRepresentable === true &&
      Math.abs(ANCHOR.empiricalN / 2.267e88 - 1) < 5e-3 &&
      Math.abs(ANCHOR.empiricalSigma / 1.178e-39 - 1) < 5e-3 &&
      Math.abs(ANCHOR.empiricalLogT0Check - 200) < 1e-3,
  },
  {
    // (6) representability: only b = 0.5% / 1% have a representable empirical height (b < ~1.77%);
    //     b = 2% (log T0 = 800) and b = 5% (log T0 = 2000) exceed log(MAX_VALUE) ~ 709.78.
    id: 'imp35894-representability-crossover-at-1p77pct',
    description: 'empirical binding height representable only for b < ~1.77% (b/b0^2 < 709.78): b = 0.5% / 1% reachable, b = 2% / 5% not',
    holds: () => {
      const reachable = IMP35894_EMPIRICAL_VS_NATURAL_RATE_REQUIRED_HEIGHT.representableBudgets;
      const cross = IMP35894_EMPIRICAL_VS_NATURAL_RATE_REQUIRED_HEIGHT.representabilityCrossoverBudget;
      return (
        reachable.join(',') === '0.5,1' &&
        Math.abs(cross - 0.017744) < 5e-5 &&
        comparison[2].empiricalHeightRepresentable === false &&
        comparison[3].empiricalHeightRepresentable === false &&
        Math.abs(LOG_MAX_VALUE - 709.7827) < 1e-3
      );
    },
  },
  {
    // (7) the b = 1% empirical binding lands at log T0 = 400, reproduced on the surrogate at N ~ 3.30e175.
    id: 'imp35894-b1pct-empirical-height-on-surrogate',
    description: 'the b = 1% empirical binding (log T0 = 400) is read off the surrogate at N ~ 3.30e175, sigma ~ 4.37e-83',
    holds: () => {
      const r = comparison[1];
      return (
        r.empiricalHeightRepresentable === true &&
        Math.abs(r.empiricalLogT0 - 400) < 1e-6 &&
        Math.abs(r.empiricalLogT0Check - 400) < 1e-3 &&
        Math.abs(r.empiricalN / 3.30e175 - 1) < 5e-3
      );
    },
  },
  {
    // (8) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, imp-486 kept, NO QED.
    id: 'imp35894-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35894_EMPIRICAL_VS_NATURAL_RATE_REQUIRED_HEIGHT;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35894_EMPIRICAL_VS_NATURAL_RATE_REQUIRED_HEIGHT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35894-empirical-vs-natural-rate-required-height assertion failed: ${a.id}`);
  }
}
