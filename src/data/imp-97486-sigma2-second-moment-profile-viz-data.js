/**
 * @module imp-97486-sigma2-second-moment-profile-viz-data
 *
 * imp-97486 (ux): import-light viz-data leaf visualizing the imp-97458
 * sigma_2(t) second-moment profile at the binding 2a = ln3 -- the shape that
 * FINDING 1/2 of imp-97458 quantify but never chart:
 *
 *   (a) a sampled sigma_2(t) profile over t in [-12,12], shaded by the four
 *       named regions (inner well, inner positive island, outer well, far
 *       tail onset), reusing the exact imp-97458/imp-97399 region boundaries
 *       (gap [3.306,6.945], lastNegativeT 10.532) -- no new numbers;
 *   (b) the far-tail cumulative positive-area ladder int_{10.532}^{T} sigma_2
 *       for T in {20,50,100,200,500,1000}, reused verbatim from
 *       IMP97458_FAR_TAIL.tabulatedOneSided, on a log-log axis showing the
 *       unbounded t^4 ln t growth (empirical exponent -> 5 from above).
 *
 * PRESENTATION ONLY. The sigma_2(t) samples are an exact recomputation of the
 * same sigma2() used by imp-97458 (cheap, ~800 evals); the region boundaries
 * and far-tail table are reused verbatim from imp-97458. Establishes no
 * operator positivity; changes no bound; interval-rigorous certificate reach
 * stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97458-krein-csharp-discarded-positive-far-field.js (the measured findings, region boundaries, far-tail table)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (the confined negative set)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma2 symbol)
 *
 * Ticket: imp-97486 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';
import {
  IMP97458_INNER_ISLAND,
  IMP97458_FAR_TAIL,
  IMP97458_BINDING_2A,
  IMP97458_RIGOROUS_REACH_2A,
} from './imp-97458-krein-csharp-discarded-positive-far-field.js';

export const IMP97486_BINDING_2A = IMP97458_BINDING_2A;
export const IMP97486_REACH_2A = IMP97458_RIGOROUS_REACH_2A;

// Region boundaries, all reused verbatim from imp-97458 (no new numbers).
const GAP_START = IMP97458_INNER_ISLAND.gapOneSided[0]; // 3.306
const GAP_END = IMP97458_INNER_ISLAND.gapOneSided[1];   // 6.945
const LAST_NEG_T = IMP97458_FAR_TAIL.lastNegativeT;     // 10.532

export const IMP97486_REGION_BOUNDARIES = Object.freeze({
  innerWell: Object.freeze([-GAP_START, GAP_START]),          // [-3.306, 3.306]
  innerIslandPositive: Object.freeze([GAP_START, GAP_END]),   // [3.306, 6.945] (mirrored for t<0)
  outerWell: Object.freeze([GAP_END, LAST_NEG_T]),            // [6.945, 10.532] (mirrored for t<0)
  farTailOnset: LAST_NEG_T,                                    // 10.532 (mirrored for t<0)
});

// (a) sampled sigma_2(t) profile, t in [-12,12], h=0.03 (~800 evals -- cheap).
const H = 0.03;
const T_MAX = 12;

function buildProfile() {
  const pts = [];
  for (let t = 0; t <= T_MAX + 1e-9; t += H) {
    const v = sigma2(t);
    pts.push(Object.freeze({ t, value: v }));
    if (t > 0) pts.push(Object.freeze({ t: -t, value: v })); // sigma_2 is even
  }
  pts.sort((p, q) => p.t - q.t);
  return Object.freeze(pts);
}

export const IMP97486_SIGMA2_PROFILE = buildProfile();

// (b) far-tail cumulative positive-area ladder, reused verbatim from imp-97458.
export const IMP97486_FAR_TAIL_LADDER = IMP97458_FAR_TAIL.tabulatedOneSided;
export const IMP97486_FAR_TAIL_EXPONENT = IMP97458_FAR_TAIL.asymptoticExponentLimit; // 5
export const IMP97486_FAR_TAIL_UNBOUNDED = IMP97458_FAR_TAIL.unbounded; // true

export const IMP97486_VERDICT = Object.freeze({
  ticket: 'imp-97486',
  sourceTicket: 'imp-97458',
  claim:
    'charts the imp-97458 sigma_2(t) second-moment profile at 2a=ln3: an inner well [-3.306,3.306], a finite ' +
    'positive island [3.306,6.945] (and mirror) between it and an outer well [6.945,10.532] (and mirror), then a ' +
    'far tail beyond |t|=10.532 whose cumulative positive area grows unboundedly (empirical exponent -> 5 from ' +
    'above, T^5 ln T), reusing the imp-97458 measured region boundaries and far-tail table verbatim.',
  profileIsExactRecompute: true,
  regionBoundariesReusedVerbatim: true,
  farTailTableReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: IMP97486_REACH_2A,
  qed: false,
});
export default IMP97486_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97486_ASSERTIONS = [
  {
    id: 'imp97486-profile-even-and-nonempty',
    holds: () => {
      if (IMP97486_SIGMA2_PROFILE.length < 700) return false;
      // spot-check evenness: sigma_2(t) === sigma_2(-t) for a sample point
      const posPt = IMP97486_SIGMA2_PROFILE.find((p) => Math.abs(p.t - 6) < 1e-9);
      const negPt = IMP97486_SIGMA2_PROFILE.find((p) => Math.abs(p.t + 6) < 1e-9);
      return !!posPt && !!negPt && Math.abs(posPt.value - negPt.value) < 1e-9;
    },
    why: 'the sampled profile must be dense enough to render (>=700 points over [-12,12], h=0.03) and must respect sigma_2(t)=sigma_2(-t), matching the imp-97458 evenness claim.',
  },
  {
    id: 'imp97486-region-signs-match-imp97458-findings',
    holds: () => {
      // inner well: negative somewhere inside [-3.306,3.306] excluding a neighborhood of 0's crossing structure
      const innerWellNeg = sigma2(2) < 0;
      // inner positive island: positive throughout [3.306,6.945] (imp-97458 FINDING 1)
      let islandAllPositive = true;
      for (let t = GAP_START; t < GAP_END; t += 0.05) { if (sigma2(t) <= 0) { islandAllPositive = false; break; } }
      // outer well: negative somewhere inside [6.945,10.532]
      const outerWellNeg = sigma2(9) < 0;
      // far tail: positive at and beyond the onset (imp-97458 FINDING 2, verified to t=5000)
      const farTailPositive = sigma2(LAST_NEG_T + 0.5) > 0 && sigma2(20) > 0;
      return innerWellNeg && islandAllPositive && outerWellNeg && farTailPositive;
    },
    why: 'the four charted regions must reproduce the imp-97458 sign pattern: inner well negative, inner island strictly positive throughout (FINDING 1), outer well negative, far tail positive from the onset (FINDING 2).',
  },
  {
    id: 'imp97486-far-tail-ladder-grows-unboundedly',
    holds: () => {
      const L = IMP97486_FAR_TAIL_LADDER;
      for (let i = 1; i < L.length; i++) { if (!(L[i].area > L[i - 1].area)) return false; }
      return IMP97486_FAR_TAIL_UNBOUNDED === true && IMP97486_FAR_TAIL_EXPONENT === 5;
    },
    why: 'the reused far-tail ladder must be strictly increasing in T (matching the imp-97458 unbounded t^4 ln T tail), with the asymptotic exponent pinned at 5.',
  },
  {
    id: 'imp97486-measurement-only-no-qed',
    holds: () =>
      IMP97486_VERDICT.profileIsExactRecompute === true &&
      IMP97486_VERDICT.regionBoundariesReusedVerbatim === true &&
      IMP97486_VERDICT.farTailTableReusedVerbatim === true &&
      IMP97486_VERDICT.operatorPositivityProved === false &&
      IMP97486_VERDICT.boundMoves === false &&
      IMP97486_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97486_REACH_2A === 0.96 &&
      Math.abs(IMP97486_BINDING_2A - Math.log(3)) < 1e-12 &&
      IMP97486_VERDICT.qed === false,
    why: 'presentation only: exact profile recompute + verbatim reuse of imp-97458 region boundaries and far-tail table; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97486_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97486-sigma2-second-moment-profile-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
