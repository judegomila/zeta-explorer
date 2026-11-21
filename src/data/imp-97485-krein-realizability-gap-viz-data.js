/**
 * @module imp-97485-krein-realizability-gap-viz-data
 *
 * imp-97485 (ux): import-light viz-data leaf visualizing the imp-97457
 * realizability gap between the imp-97416 bathtub optimiser and the best
 * genuinely band-limited density.
 *
 *   (a) the two density profiles over t: f_bath = (a/pi) 1_{deepest set} (the
 *       EXACT bathtub indicator, recomputed here on the same deepest-measure
 *       selection imp-97457 used) and f_real (an ILLUSTRATIVE smoothed proxy
 *       -- band-limitedness forbids a sharp 0/(a/pi) switch, so f_real is
 *       shown as a smoothed, sub-ceiling version of the same mask, rescaled
 *       to the imp-97457 measured peak-to-cap ratio 0.5251; it is NOT the
 *       exact numerically-solved top eigenfunction of P_a M_{sigma_2^-} P_a,
 *       which this leaf does not re-solve);
 *   (b) the gap-split bar from the bathtub floor -3065.435 up to the measured
 *       c_sharp ~ +0.582, split into the realizability share (+1721.639,
 *       56.2%) and the discarded t^4 positive far-field share (+1344.378,
 *       43.8%) -- both reused verbatim from imp-97457.
 *
 * PRESENTATION ONLY. The bathtub indicator f_bath and the gap-split numbers
 * are exact recomputations / verbatim reuse of the imp-97457 measurement; the
 * f_real curve is a labeled illustrative schematic, not new data. Establishes
 * no operator positivity; changes no bound; interval-rigorous certificate
 * reach stays 2a<=0.96; no refereed bound is changed; RH open;
 * NO QED.
 *
 * @see imp-97457-krein-bathtub-realizability-gap.js (the measured R, gap attribution, verdict)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (the bathtub floor -3065.435)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma2 symbol)
 *
 * Ticket: imp-97485 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';
import {
  IMP97457_REALIZABILITY,
  IMP97457_GAP_ATTRIBUTION,
  IMP97457_VERDICT,
  IMP97457_BINDING_2A,
  IMP97457_RIGOROUS_REACH_2A,
} from './imp-97457-krein-bathtub-realizability-gap.js';

const LN3 = Math.log(3);
const A = LN3 / 2;
const POINTWISE_BUDGET = A / Math.PI;       // a/pi -- the pointwise mass cap
const FILLABLE_MEASURE = Math.PI / A;       // pi/a -- measure fillable at the cap, total mass 1

export const IMP97485_BINDING_2A = IMP97457_BINDING_2A;
export const IMP97485_REACH_2A = IMP97457_RIGOROUS_REACH_2A;
export const IMP97485_POINTWISE_BUDGET = POINTWISE_BUDGET;

// Exact recompute of the imp-97416/imp-97457 deepest-measure-(pi/a) selection
// of sigma_2^- on a symmetric grid over t in [-12,12] (h=0.02, ~1200 points --
// cheap, matches the grid-stability window imp-97457 documents).
const H = 0.02;
const T_MAX = 12;

function buildGrid() {
  const pts = [];
  for (let t = H / 2; t <= T_MAX; t += H) {
    const neg = Math.max(0, -sigma2(t));
    pts.push({ t: -t, neg });
    pts.push({ t, neg });
  }
  pts.sort((p, q) => p.t - q.t);
  return pts;
}

const GRID = buildGrid();

// Rank by magnitude, mark the top pi/a measure of the grid as "in the deepest set".
function deepestSetMask(grid) {
  const ranked = grid
    .map((p, i) => ({ i, neg: p.neg }))
    .filter((p) => p.neg > 0)
    .sort((p, q) => q.neg - p.neg);
  const inSet = new Array(grid.length).fill(false);
  let measure = 0;
  for (const r of ranked) {
    if (measure >= FILLABLE_MEASURE) break;
    inSet[r.i] = true;
    measure += H;
  }
  return { inSet, measure };
}

const { inSet: DEEPEST_MASK, measure: DEEPEST_MEASURE } = deepestSetMask(GRID);

// f_bath(t): the exact bathtub indicator, height a/pi on the deepest set, 0 elsewhere.
export const IMP97485_F_BATH = Object.freeze(
  GRID.map((p, i) => Object.freeze({ t: p.t, value: DEEPEST_MASK[i] ? POINTWISE_BUDGET : 0 }))
);

// f_real(t): ILLUSTRATIVE smoothed proxy -- a boxcar-smoothed version of the
// same mask (band-limitedness forbids the sharp 0/(a/pi) switch), rescaled so
// its peak matches the imp-97457 measured peakToCapRatio = 0.5251. This is a
// labeled schematic, not a re-solved eigenfunction.
const SMOOTH_RADIUS = 45; // ~0.9 in t, order 1/a ~ 1.82 (imp-97457's stated resolution scale)
function boxcarSmooth(mask, radius) {
  const n = mask.length;
  const out = new Array(n).fill(0);
  let running = 0;
  for (let i = -radius; i <= radius; i++) {
    const idx = i;
    if (idx >= 0 && idx < n && mask[idx]) running++;
  }
  out[0] = running / (2 * radius + 1);
  for (let i = 1; i < n; i++) {
    const leave = i - radius - 1;
    const enter = i + radius;
    if (leave >= 0 && mask[leave]) running--;
    if (enter < n && mask[enter]) running++;
    out[i] = running / (2 * radius + 1);
  }
  return out;
}
const RAW_SMOOTH = boxcarSmooth(DEEPEST_MASK, SMOOTH_RADIUS);
const RAW_PEAK = Math.max(...RAW_SMOOTH);
const TARGET_PEAK = IMP97457_REALIZABILITY.peakToCapRatio * POINTWISE_BUDGET;
const RESCALE = RAW_PEAK > 0 ? TARGET_PEAK / RAW_PEAK : 0;

export const IMP97485_F_REAL_ILLUSTRATIVE = Object.freeze(
  GRID.map((p, i) => Object.freeze({ t: p.t, value: RAW_SMOOTH[i] * RESCALE }))
);

export const IMP97485_PEAK_TO_CAP_RATIO = IMP97457_REALIZABILITY.peakToCapRatio;

// (b) gap-split bar, reused verbatim from imp-97457.
export const IMP97485_GAP_BAR = Object.freeze({
  bathtubFloor: IMP97457_REALIZABILITY.bathtubFloor,           // -3065.435
  realizableFloor: IMP97457_REALIZABILITY.realizableFloor,     // -1343.796
  measuredCsharp: IMP97457_REALIZABILITY.measuredCsharp,       // +0.582
  realizabilityShare: IMP97457_GAP_ATTRIBUTION.realizabilityShare,       // +1721.639
  farFieldShare: IMP97457_GAP_ATTRIBUTION.farFieldShare,                 // +1344.378
  realizabilityShareFraction: IMP97457_GAP_ATTRIBUTION.realizabilityShareFraction, // 0.5615
  farFieldShareFraction: IMP97457_GAP_ATTRIBUTION.farFieldShareFraction,           // 0.4385
  totalGap: IMP97457_GAP_ATTRIBUTION.totalGap,
});

export const IMP97485_VERDICT = Object.freeze({
  ticket: 'imp-97485',
  sourceTicket: 'imp-97457',
  claim:
    'the exact bathtub indicator f_bath never gets filled by any admissible band-limited density: the best realizable psi (illustrated here as a smoothed, sub-ceiling proxy consistent with the measured peak-to-cap ratio 0.5251) peaks at only 52.5% of the a/pi ceiling. The gap from the bathtub floor -3065.435 to the measured c_sharp ~+0.582 splits into comparable realizability (56.2%) and far-field (43.8%) shares.',
  fBathMeasureMatchesFillable: Math.abs(DEEPEST_MEASURE - FILLABLE_MEASURE) < 2 * H,
  fRealIsIllustrativeSchematic: true,
  fRealNotReSolvedEigenfunction: true,
  measuredNotIntervalCertified: IMP97457_VERDICT.measuredNotIntervalCertified,
  operatorPositivityProved: false,
  rigorousLowerBoundPromoted: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: IMP97485_REACH_2A,
  qed: false,
});
export default IMP97485_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97485_ASSERTIONS = [
  {
    id: 'imp97485-fbath-measure-matches-fillable',
    holds: () => Math.abs(DEEPEST_MEASURE - FILLABLE_MEASURE) < 2 * H,
    why: 'the recomputed deepest-set selection must fill measure pi/a, matching the imp-97416/imp-97457 bathtub construction (within one grid step h=0.02).',
  },
  {
    id: 'imp97485-fbath-only-takes-two-values',
    holds: () => IMP97485_F_BATH.every((p) => p.value === 0 || Math.abs(p.value - POINTWISE_BUDGET) < 1e-12),
    why: 'f_bath is a strict 0/(a/pi) indicator by construction (the bathtub optimiser assumption).',
  },
  {
    id: 'imp97485-freal-never-exceeds-ceiling',
    holds: () => IMP97485_F_REAL_ILLUSTRATIVE.every((p) => p.value <= POINTWISE_BUDGET + 1e-9) &&
      Math.abs(Math.max(...IMP97485_F_REAL_ILLUSTRATIVE.map((p) => p.value)) / POINTWISE_BUDGET - IMP97457_REALIZABILITY.peakToCapRatio) < 1e-6,
    why: 'the illustrative f_real proxy is rescaled to peak at exactly the imp-97457 measured peakToCapRatio = 0.5251 of the a/pi ceiling, and never exceeds it -- the qualitative point of the ticket.',
  },
  {
    id: 'imp97485-gap-bar-sums-to-total',
    holds: () => {
      const G = IMP97485_GAP_BAR;
      return Math.abs(G.realizabilityShare + G.farFieldShare - G.totalGap) < 1e-6 &&
        Math.abs(G.realizabilityShareFraction + G.farFieldShareFraction - 1) < 1e-6 &&
        Math.abs((G.bathtubFloor + G.realizabilityShare) - G.realizableFloor) < 1e-6 &&
        Math.abs((G.realizableFloor + G.farFieldShare) - G.measuredCsharp) < 1e-3;
    },
    why: 'the two gap segments must sum end-to-end from the bathtub floor -3065.435 through the realizable floor -1343.796 to the measured c_sharp ~+0.582, reproducing imp-97457 verbatim.',
  },
  {
    id: 'imp97485-measurement-only-no-qed',
    holds: () =>
      IMP97485_VERDICT.fRealIsIllustrativeSchematic === true &&
      IMP97485_VERDICT.fRealNotReSolvedEigenfunction === true &&
      IMP97485_VERDICT.operatorPositivityProved === false &&
      IMP97485_VERDICT.rigorousLowerBoundPromoted === false &&
      IMP97485_VERDICT.boundMoves === false &&
      IMP97485_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97485_VERDICT.qed === false,
    why: 'presentation only: f_real is a labeled illustrative schematic (not a re-solved eigenfunction); no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97485_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97485-krein-realizability-gap-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
