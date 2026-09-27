/**
 * @module imp-97589-sigma-landmark-ladder-viz-data
 *
 * imp-97589 (ux): import-light viz-data leaf charting the imp-97520 sigma(N)
 * conditional-share decay curve (sigma(N) = E_coll/E_N) with the four
 * tabulated landmarks overlaid: the interior PEAK (N~9.218633e5,
 * sigma~0.949429), the BELOW-0.9 downslope crossing (N~2.572361e7), the
 * HALVING crossing (N~3.267235e9), and the BELOW-0.1 crossing (N~3.213181e11).
 *
 * PRESENTATION ONLY. The curve re-evaluates the exact inherited
 * imp-3406/imp-33582/imp-33601/imp-33723 sigma(N) sub-terms (identical
 * formula to imp-97520 -- E_coll = C_C sqrt(log T0/N), E_flow = Gronwall
 * flow term, E_trunc = 3.06e-5 fixed-strip constant), and the four landmark
 * points are pulled verbatim from the imp-97520 tabulated ladder object.
 * Nothing re-derived; no bound moves; establishes no operator positivity;
 * Platt-Trudgian Lambda<=0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97520-sigma-conditional-share-landmark-ladder.js (four-landmark ladder object, baked verbatim)
 *
 * Ticket: imp-97589 (ux, sonnet-4-6, sonnet). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER } from './imp-97520-sigma-conditional-share-landmark-ladder.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-97520 exactly

// EXACT imp-97520 sigma(N) sub-terms (same formula, no re-derivation).
function sigmaAt(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}

const LADDER = IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER.ladder;

// Decay curve samples spanning below the peak through past the below-0.1 landmark.
export const IMP97589_CURVE_SAMPLES = Object.freeze(
  Array.from({ length: 141 }, (_, i) => {
    const logN = 3 + (i * (13 - 3)) / 140;
    const N = Math.pow(10, logN);
    return Object.freeze({ logN, N, sigma: sigmaAt(N) });
  })
);

// The four landmarks, pulled verbatim from the imp-97520 ladder object.
export const IMP97589_LANDMARKS = Object.freeze([
  Object.freeze({ label: 'L1 peak', N: LADDER.L1_peak.N, sigma: LADDER.L1_peak.sigma, logN: Math.log10(LADDER.L1_peak.N) }),
  Object.freeze({ label: 'L2 below-0.9', N: LADDER.L2_below_0p9.N, sigma: LADDER.L2_below_0p9.sigma, logN: Math.log10(LADDER.L2_below_0p9.N) }),
  Object.freeze({ label: 'L3 halving', N: LADDER.L3_halving.N, sigma: LADDER.L3_halving.sigma, logN: Math.log10(LADDER.L3_halving.N) }),
  Object.freeze({ label: 'L4 below-0.1', N: LADDER.L4_below_0p1.N, sigma: LADDER.L4_below_0p1.sigma, logN: Math.log10(LADDER.L4_below_0p1.N) }),
]);

export const IMP97589_VERDICT = Object.freeze({
  ticket: 'imp-97589',
  sourceTicket: 'imp-97520',
  claim:
    'The sigma(N) = E_coll/E_N conditional-share curve rises to an interior peak (sigma~0.949429 at ' +
    'N~9.22e5), then decays through three downslope crossings (below-0.9 at N~2.57e7, halving at ' +
    'N~3.27e9, below-0.1 at N~3.21e11), spanning ~5.54 decades of N.',
  decadesSpanPeakToTail: LADDER.decades_peak_to_tail,
  boundMoves: false,
  qed: false,
});
export default IMP97589_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97589_ASSERTIONS = [
  {
    id: 'imp97589-curve-samples-well-formed',
    holds: () => {
      const s = IMP97589_CURVE_SAMPLES;
      return s.length === 141 && s.every((p) => p.sigma > 0 && p.sigma < 1 && Number.isFinite(p.N));
    },
    why: 'sigma(N) is a share (E_coll/E_N) and must stay strictly between 0 and 1 across every sampled N.',
  },
  {
    id: 'imp97589-curve-reproduces-landmarks',
    holds: () => IMP97589_LANDMARKS.every((lm) => Math.abs(sigmaAt(lm.N) - lm.sigma) < 2e-3),
    why: 'evaluating the same sigma(N) formula at each landmark N must reproduce the imp-97520 tabulated sigma value.',
  },
  {
    id: 'imp97589-landmarks-strictly-increasing-in-N',
    holds: () => {
      for (let i = 1; i < IMP97589_LANDMARKS.length; i++) {
        if (!(IMP97589_LANDMARKS[i].N > IMP97589_LANDMARKS[i - 1].N)) return false;
      }
      return true;
    },
    why: 'the four landmarks must be strictly increasing in N (peak, then three downslope crossings).',
  },
  {
    id: 'imp97589-honesty-gate-no-qed',
    holds: () => IMP97589_VERDICT.qed === false && IMP97589_VERDICT.boundMoves === false,
    why: 'presentation-only leaf charting an already-tabulated ladder: no bound moves, NO QED.',
  },
];

for (const t of IMP97589_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97589-sigma-landmark-ladder-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
