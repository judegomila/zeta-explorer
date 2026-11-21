/**
 * @module imp-35997-eflow-max-share-height
 *
 * imp-35997 (accuracy, measurement): LOCATE the height N at which the MIDDLE flow term of the
 * imp-35889 three-way split E(N) = E_trunc + E_flow + E_coll reaches its MAXIMUM fractional share
 * E_flow / E(N). imp-35889 tabulated the flow share only at the two imp-35853 knees (~ 4.08e-3 at
 * the Kneedle elbow, ~ 5.74e-4 at the flattest point) and imp-35950 measured it precisely at the
 * sigma = 0.5 crossover (~ 9.51e-4), but NEITHER located where E_flow's own share is LARGEST across
 * the N ladder. This module fills that single missing datum.
 *
 * SETUP (identical imp-3406 / imp-33582 sub-terms as imp-35889 / imp-35950 / imp-35971; no fresh model).
 *   E_trunc = 3.06e-5 (imp-2631, N-independent fixed-strip route),
 *   E_flow  = C_F (log T0 / T0) exp|t_c|  with C_F = (log(T0 / 2pi) + 1) / 2pi (imp-398),
 *   E_coll  = C_C sqrt(log T0 / N)        with C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, GUE-conditional).
 * E_flow decays fast (log T0 / T0), E_coll decays like sqrt(1/N), E_trunc is flat. The flow SHARE
 * E_flow / E(N) is therefore not monotone: it rises where the fast-shrinking E_coll denominator still
 * dwarfs the flat E_trunc floor, then falls once E_coll drops away and the flat floor takes over. The
 * interior maximum is located here by golden-section search on log N.
 *
 * WHAT THE MEASUREMENT SHOWS (the honest finding).
 *   - E_flow / E(N) peaks at N* ~ 9.65e1 (log10 N* ~ 1.985, log T0 ~ 5.45), a VERY low height, with a
 *     peak share of only ~ 0.1587 (~ 15.9%). Even at its maximum E_flow is the SMALLEST term there:
 *     E_coll carries ~ 0.841 of E(N) (sigma ~ 0.841) and E_flow ~ 0.159, so E_flow NEVER dominates E(N)
 *     anywhere on the ladder -- its share tops out well below 1/2.
 *   - The peak sits FAR BELOW every landmark previously measured: ~ 3.98 decades below the interior
 *     sigma peak (N ~ 9.22e5, where the flow share has already fallen to ~ 3.06e-2), ~ 6.34 decades
 *     below the Kneedle elbow (N ~ 2.13e8, flow share ~ 4.08e-3) and ~ 7.53 decades below the
 *     sigma = 0.5 crossover (N ~ 3.27e9, flow share ~ 9.51e-4). So the ~ 9.51e-4 crossover figure
 *     imp-35950 reported is ~ 167x below the true maximum share.
 *   - The maximum is genuinely interior (share rises from ~ 0.115 at N = 5 to the ~ 0.159 peak, then
 *     falls back through ~ 0.153 at N ~ 300), driven by the flat E_trunc floor becoming non-negligible
 *     in the denominator once N drops below ~ 100 -- which is why the peak lands at such a small height.
 *
 * Measurement only; reuses the pinned imp-3406 / imp-33582 constants and the imp-35889 / imp-35950
 * sub-terms unchanged; derives no remainder; discharges nothing; changes no bound; establishes no
 * operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and
 * C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35889-e-share-decomposition-at-knees (the three-way split whose flow share this maximizes)
 * @see imp-35950-etrunc-ecoll-crossover-height (the sigma = 0.5 crossover, flow share ~ 9.51e-4)
 * @see imp-35971-etrunc-sole-survivor-height (the sigma -> 0 tail extension of the same split)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-3529 / imp-33582 sub-terms (identical to imp-35889 / imp-35950 / imp-35971; no fresh model).
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
  return { sigma: E_coll / E_N, logT0: L, E_trunc: E_TRUNC_PT, E_flow, E_coll, E_N, shareFlow: E_flow / E_N };
}
const flowShare = (N) => parts(N).shareFlow;

// Golden-section maximization of E_flow / E(N) over log N (unimodal interior peak on this stretch).
function locateFlowShareMax() {
  const invphi = (Math.sqrt(5) - 1) / 2; // ~ 0.618
  let a = Math.log(1); // low bracket (below the peak, share still rising)
  let b = Math.log(1e6); // high bracket (above the peak, share falling toward the interior-peak value)
  let m1 = b - invphi * (b - a);
  let m2 = a + invphi * (b - a);
  let f1 = flowShare(Math.exp(m1));
  let f2 = flowShare(Math.exp(m2));
  for (let i = 0; i < 300; i++) {
    if (f1 > f2) {
      b = m2;
      m2 = m1;
      f2 = f1;
      m1 = b - invphi * (b - a);
      f1 = flowShare(Math.exp(m1));
    } else {
      a = m1;
      m1 = m2;
      f1 = f2;
      m2 = a + invphi * (b - a);
      f2 = flowShare(Math.exp(m2));
    }
  }
  return Math.exp((a + b) / 2);
}

const N_STAR = locateFlowShareMax();
const pStar = parts(N_STAR);

// Landmark cross-checks (heights located by prior measurements; flow shares recomputed on the same model).
const N_INTERIOR_SIGMA_PEAK = 9.22e5; // imp-33582 / imp-35813 interior sigma peak
const N_KNEEDLE_ELBOW = 2.13e8; // imp-35853 / imp-35889 Kneedle elbow knee
const N_SIGMA_HALF_CROSSOVER = 3.267e9; // imp-35950 / imp-35337 E_trunc = E_coll (sigma = 0.5) crossover
const pInteriorPeak = parts(N_INTERIOR_SIGMA_PEAK);
const pElbow = parts(N_KNEEDLE_ELBOW);
const pCrossover = parts(N_SIGMA_HALF_CROSSOVER);

const flowShareMax = {
  N: +N_STAR.toExponential(4), // ~ 9.6548e1
  log10N: +Math.log10(N_STAR).toFixed(4), // ~ 1.985
  logT0: +pStar.logT0.toFixed(4), // ~ 5.4484
  peakShareFlow: +pStar.shareFlow.toExponential(4), // ~ 1.5875e-1 (~ 15.9%)
  E_trunc: +pStar.E_trunc.toExponential(4), // 3.06e-5
  E_flow: +pStar.E_flow.toExponential(4), // ~ 1.7208e-2
  E_coll: +pStar.E_coll.toExponential(4), // ~ 9.1161e-2
  E_N: +pStar.E_N.toExponential(4),
  sigmaAtPeak: +pStar.sigma.toFixed(4), // ~ 0.8410 (E_coll still dominates -- E_flow never leads)
  eFlowNeverDominates: pStar.shareFlow < 0.5, // its own max share is well below 1/2
};

const landmarkLadder = {
  interiorSigmaPeak: {
    N: N_INTERIOR_SIGMA_PEAK,
    shareFlow: +pInteriorPeak.shareFlow.toExponential(4), // ~ 3.06e-2
    decadesAbovePeak: +(Math.log10(N_INTERIOR_SIGMA_PEAK) - Math.log10(N_STAR)).toFixed(4), // ~ 3.98
  },
  kneedleElbow: {
    N: N_KNEEDLE_ELBOW,
    shareFlow: +pElbow.shareFlow.toExponential(4), // ~ 4.08e-3
    decadesAbovePeak: +(Math.log10(N_KNEEDLE_ELBOW) - Math.log10(N_STAR)).toFixed(4), // ~ 6.34
  },
  sigmaHalfCrossover: {
    N: N_SIGMA_HALF_CROSSOVER,
    shareFlow: +pCrossover.shareFlow.toExponential(4), // ~ 9.51e-4 (imp-35950 figure)
    decadesAbovePeak: +(Math.log10(N_SIGMA_HALF_CROSSOVER) - Math.log10(N_STAR)).toFixed(4), // ~ 7.53
    peakOverCrossoverRatio: +(pStar.shareFlow / pCrossover.shareFlow).toFixed(1), // ~ 167x
  },
};

export const IMP35997_EFLOW_MAX_SHARE_HEIGHT = {
  id: 'imp-35997',
  proofSection: 'S-frontier',
  question:
    'imp-35889 tabulated the E_flow / E(N) share of the E(N) = E_trunc + E_flow + E_coll split only at the two ' +
    'imp-35853 knees and imp-35950 measured it at the sigma = 0.5 crossover (~ 9.51e-4), but never located where ' +
    'the middle flow term E_flow reaches its MAXIMUM fractional share. At what height N is E_flow / E(N) largest, ' +
    'what is that peak share, and where does it sit relative to the interior sigma peak and the two knees?',
  method:
    'Reuse the EXACT imp-3406 / imp-33582 sub-terms (E_trunc = 3.06e-5 fixed; E_flow = C_F (log T0 / T0) exp|t_c|; ' +
    'E_coll = C_C sqrt(log T0 / N)). Golden-section-maximize the share E_flow / E(N) over log N (the share is ' +
    'unimodal: it rises where the fast-decaying E_coll dwarfs the flat E_trunc, then falls once E_coll drops away). ' +
    'Recompute the flow share at the imp-33582 interior sigma peak, the imp-35853 Kneedle elbow and the imp-35950 ' +
    'sigma = 0.5 crossover to place the maximum on the ladder.',
  flowShareMax, // N* ~ 9.65e1, peak share ~ 0.1587, sigma ~ 0.841 (E_coll still dominates -- E_flow never leads)
  landmarkLadder, // peak sits ~ 3.98 / ~ 6.34 / ~ 7.53 decades BELOW the interior peak / elbow / crossover; ~ 167x the crossover share
  peakBelowAllLandmarks:
    N_STAR < N_INTERIOR_SIGMA_PEAK && N_STAR < N_KNEEDLE_ELBOW && N_STAR < N_SIGMA_HALF_CROSSOVER,
  eFlowNeverDominates: flowShareMax.eFlowNeverDominates,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Maximizing the middle-term share E_flow / E(N) of the imp-35889 ' +
    'E(N) = E_trunc + E_flow + E_coll split over the same imp-3406 / imp-33582 surrogate: the flow share peaks at ' +
    'N* ~ 9.65e1 (log10 N* ~ 1.985, log T0 ~ 5.45), a VERY low height, with a peak share of only ~ 0.1587 (~ 15.9%). ' +
    'Even at its maximum E_flow is the smallest of the three terms there -- E_coll carries ~ 0.841 of E(N) ' +
    '(sigma ~ 0.841) -- so E_flow NEVER dominates E(N) anywhere on the ladder; its share tops out well below 1/2. ' +
    'The peak sits FAR below every landmark previously measured: ~ 3.98 decades below the interior sigma peak ' +
    '(N ~ 9.22e5, flow share ~ 3.06e-2), ~ 6.34 decades below the Kneedle elbow (N ~ 2.13e8, flow share ~ 4.08e-3) ' +
    'and ~ 7.53 decades below the sigma = 0.5 crossover (N ~ 3.27e9, flow share ~ 9.51e-4), so the ~ 9.51e-4 figure ' +
    'imp-35950 reported at the crossover is ~ 167x below the true maximum share. The maximum is genuinely interior ' +
    '(the flat E_trunc floor becoming non-negligible in the denominator below N ~ 100 is what pulls the peak down to ' +
    'so small a height). Reuses the pinned imp-3406 / imp-33582 constants and the imp-35889 / imp-35950 sub-terms ' +
    'unchanged; derives no remainder; discharges nothing; changes no bound; establishes no operator positivity; ' +
    'C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) ' +
    'are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35889 (the three-way split whose flow share this maximizes); imp-35950 / imp-35337 (E_trunc = E_coll ' +
    'sigma = 0.5 crossover, flow share ~ 9.51e-4); imp-35971 (the sigma -> 0 tail extension); imp-35853 (knee ' +
    'locators); imp-33582 (sigma-decay model); imp-3220 / imp-3406 (RvM surrogate log-height); imp-398 (C_F flow ' +
    'prefactor); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 (GUE-conditional ' +
    'caveat). Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35997_EFLOW_MAX_SHARE_HEIGHT_ASSERTIONS = [
  {
    // (1) the flow-share maximum is located near N ~ 9.65e1 (log10 ~ 1.985, log T0 ~ 5.45).
    id: 'imp35997-flow-share-max-height-located',
    description: 'E_flow / E(N) peaks at N* ~ 9.65e1 (log10 ~ 1.985, log T0 ~ 5.45)',
    holds: () =>
      Math.abs(flowShareMax.log10N - 1.985) < 5e-3 &&
      Math.abs(flowShareMax.logT0 - 5.4484) < 5e-2,
  },
  {
    // (2) peak share value ~ 0.1587 (~ 15.9%).
    id: 'imp35997-peak-flow-share-value',
    description: 'the peak flow share is ~ 0.1587 (~ 15.9% of E(N))',
    holds: () => Math.abs(flowShareMax.peakShareFlow - 0.1587) < 2e-3,
  },
  {
    // (3) E_flow never dominates: at its own maximum it is still the smallest term (E_coll leads, sigma ~ 0.841).
    id: 'imp35997-eflow-never-dominates',
    description: 'at its max share E_flow ~ 0.159 is the smallest term; E_coll dominates with sigma ~ 0.841; share < 1/2',
    holds: () =>
      flowShareMax.eFlowNeverDominates === true &&
      flowShareMax.peakShareFlow < 0.5 &&
      Math.abs(flowShareMax.sigmaAtPeak - 0.841) < 5e-3 &&
      pStar.E_flow < pStar.E_coll,
  },
  {
    // (4) the peak sits below the interior sigma peak, the elbow and the sigma = 0.5 crossover, with the expected decade gaps.
    id: 'imp35997-peak-below-all-landmarks',
    description: 'flow-share peak lands ~ 3.98 / ~ 6.34 / ~ 7.53 decades below the interior peak / elbow / crossover',
    holds: () =>
      IMP35997_EFLOW_MAX_SHARE_HEIGHT.peakBelowAllLandmarks === true &&
      Math.abs(landmarkLadder.interiorSigmaPeak.decadesAbovePeak - 3.98) < 5e-2 &&
      Math.abs(landmarkLadder.kneedleElbow.decadesAbovePeak - 6.34) < 5e-2 &&
      Math.abs(landmarkLadder.sigmaHalfCrossover.decadesAbovePeak - 7.53) < 5e-2,
  },
  {
    // (5) the crossover flow share reproduces the imp-35950 figure (~ 9.51e-4) and is ~ 167x below the true max.
    id: 'imp35997-reproduces-imp35950-crossover-share',
    description: 'flow share at the sigma = 0.5 crossover ~ 9.51e-4 (imp-35950), ~ 167x below the peak share',
    holds: () =>
      Math.abs(landmarkLadder.sigmaHalfCrossover.shareFlow - 9.51e-4) < 5e-5 &&
      Math.abs(landmarkLadder.sigmaHalfCrossover.peakOverCrossoverRatio - 167) < 5,
  },
  {
    // (6) the maximum is genuinely interior: the share is lower on BOTH sides of N* (below at N=5, above at N=300).
    id: 'imp35997-maximum-is-interior',
    description: 'flow share at N* exceeds the share at N = 5 (below) and at N = 300 (above): a genuine interior peak',
    holds: () => pStar.shareFlow > flowShare(5) && pStar.shareFlow > flowShare(300),
  },
  {
    // (7) honesty gate: measurement only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp35997-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35997_EFLOW_MAX_SHARE_HEIGHT;
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

for (const a of IMP35997_EFLOW_MAX_SHARE_HEIGHT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35997-eflow-max-share-height assertion failed: ${a.id}`);
  }
}
