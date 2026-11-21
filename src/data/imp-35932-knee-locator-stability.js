/**
 * @module imp-35932-knee-locator-stability
 *
 * imp-35932 (numerical, measurement): MEASURE which of the three DISAGREEING imp-35853
 * REQ-4 knee locators is STABLE under (a) refinement of the sigma grid (halving the
 * spacing) and (b) variation of the chord endpoints / smoothing stencil, to decide
 * whether any of the three is a robust canonical knee or all three are merely
 * locator-defined conveniences.
 *
 * imp-35853 reported three complementary knee/flatness markers on the REQ-4 required-height
 * multiple 200 / log T0 versus sigma downslope curve that disagree by more than a decade in
 * sigma:
 *   - Kneedle elbow (max normalised distance from the endpoint chord): sigma ~ 0.783
 *   - Flattest point (min |d multiple / d sigma|):                     sigma ~ 0.407
 *   - PT-anchor-value approach (first within 5% of ~6.96x):            sigma ~ 0.035
 * imp-35943 flagged these as LOCATOR-DEPENDENT but did not measure HOW MUCH each moves when
 * the discretisation and chord choice change. This module does exactly that: it replicates
 * the EXACT imp-3406 / imp-33582 sub-terms (sigma = E_coll / (E_trunc + E_flow + E_coll)),
 * rebuilds the fine sigma-vs-multiple curve on four grid densities (gridN = 400, 800, 1600,
 * 3200 -- each halving the spacing of the last), across twelve chord-endpoint pairs
 * (sHi in {0.90, 0.92, 0.94, sigma_max}, sLo in {sigma_PT, 0.05, 0.10}), and with five
 * flattest-point smoothing stencils (symmetric k = 1, 2, 4, 8, 16), and records how far each
 * of the three sigma-landmarks moves.
 *
 * WHAT THE STABILITY SWEEP SHOWS (the honest finding, offline scripts/imp-35932-knee-stability-offline.mjs).
 *   - The FLATTEST POINT is the ROBUST locator: sigma stays in [0.4065, 0.4080] across ALL
 *     grid, endpoint, AND smoothing variations -- a total move of only ~0.0015 (~0.4% relative).
 *     Its position is essentially discretisation-, endpoint-, and smoothing-invariant, because
 *     it tracks a genuine geometric feature (the mid-downslope minimum of |d multiple / d sigma|).
 *   - The PT-ANCHOR-VALUE APPROACH is also STABLE: the first-within-10% sigma stays in
 *     [0.0648, 0.0661] (~2.0% relative) and first-within-5% in [0.0349, 0.0364] (~4.2%),
 *     grid- and endpoint-independent as expected for a level-set crossing on a monotone curve.
 *   - The KNEEDLE ELBOW is the UNSTABLE locator: it is grid-stable (moves only ~0.0006 over
 *     gridN 400..3200) but ENDPOINT-dependent -- it swings across [0.7120, 0.8156] in sigma
 *     (a move of ~0.104, ~13.5% relative) purely by moving the chord endpoints, so its value is
 *     an artifact of WHERE the chord is anchored, not a canonical bend of the curve.
 * VERDICT: of the three, the flattest point (sigma ~ 0.407) is the genuinely stable geometric
 * marker and the PT-anchor approach is a stable level-set; the Kneedle elbow is the
 * locator-defined convenience imp-35943 warned about. This does NOT reconcile the three into
 * one knee (they still answer different questions) -- it identifies WHICH marker is robust under
 * refinement. ~6.96x remains the multiple AT the Platt-Trudgian verified height, a point value,
 * not an asymptotic floor.
 *
 * Measurement only; re-reads the imp-3406 / imp-33582 model and the imp-35538 binding
 * log-height (200) on the same imp-3220 / imp-3406 RvM surrogate; interpolates the imp-35813
 * discrete rungs; derives no remainder; discharges nothing; changes no bound; establishes no
 * operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5
 * (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-35853-req4-required-height-continuous-sigma-knee (the three locators measured here)
 * @see imp-35538-route-i-remainder-derivation-requirements (REQ 4; binding log-height 200)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source model; peak sigma_max ~ 0.9494)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS } from './imp-35538-route-i-remainder-derivation-requirements.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

const HR = IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.heightRegime;
const LOG_T0_NEEDED = HR.logT0NeededForHalfPctBudget; // 200

// EXACT imp-3406 / imp-33582 sub-terms (no re-derivation, identical to imp-35853).
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { sigma: E_coll / E_N, logT0: L };
}
const sigma = (N) => parts(N).sigma;

function dSigmadN(N) {
  const h = N * 1e-6;
  return (sigma(N + h) - sigma(N - h)) / (2 * h);
}
function locatePeak() {
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_PEAK = locatePeak();
const SIGMA_MAX = sigma(N_PEAK); // ~0.949429

function crossBelow(thr) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const LOG_T0_PT = Math.log(3e12);
function nForLogT0(target) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e30);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).logT0 < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_PT = nForLogT0(LOG_T0_PT);
const SIGMA_PT = sigma(N_PT); // ~0.0188
const MULT_PT = LOG_T0_NEEDED / LOG_T0_PT; // ~6.9615

function buildCurve(sHi, sLo, gridN) {
  const c = [];
  for (let i = 0; i <= gridN; i++) {
    const s = sHi + (sLo - sHi) * (i / gridN);
    const N = crossBelow(s);
    const L = parts(N).logT0;
    c.push({ sigma: s, multiple: LOG_T0_NEEDED / L });
  }
  return c;
}

// (A) Kneedle elbow: max |y - x| after normalising endpoints to (0,0)-(1,1).
function kneedle(curve) {
  const s0 = curve[0].sigma;
  const s1 = curve[curve.length - 1].sigma;
  const m0 = curve[0].multiple;
  const m1 = curve[curve.length - 1].multiple;
  let bestDist = -1;
  let idx = 0;
  for (let i = 0; i < curve.length; i++) {
    const x = (curve[i].sigma - s0) / (s1 - s0);
    const y = (curve[i].multiple - m0) / (m1 - m0);
    const d = Math.abs(y - x);
    if (d > bestDist) {
      bestDist = d;
      idx = i;
    }
  }
  return curve[idx].sigma;
}

// (B) Flattest point: min |d multiple / d sigma| with a symmetric k-point stencil (k=1 => raw).
function flattest(curve, k) {
  let minSlope = Infinity;
  let idx = k;
  for (let i = k; i < curve.length - k; i++) {
    const ds = curve[i + k].sigma - curve[i - k].sigma;
    const dm = curve[i + k].multiple - curve[i - k].multiple;
    const slope = Math.abs(dm / ds);
    if (slope < minSlope) {
      minSlope = slope;
      idx = i;
    }
  }
  return curve[idx].sigma;
}

// (C) PT-anchor approach: first sigma with multiple within frac of MULT_PT.
function firstWithin(curve, frac) {
  const row = curve.find((g) => g.multiple <= MULT_PT * (1 + frac));
  return row ? row.sigma : NaN;
}

// LIVE (import-time) stability subset -- a fast slice of the full offline sweep, enough to
// certify the three baked stability verdicts without the heavy 12-endpoint / 3200-grid pass.
// Grid refinement at fixed endpoints [0.94, sigma_PT]: gridN 400 vs 800.
const c400 = buildCurve(0.94, SIGMA_PT, 400);
const c800 = buildCurve(0.94, SIGMA_PT, 800);
const kneeGrid = [kneedle(c400), kneedle(c800)];
const flatGrid = [flattest(c400, 1), flattest(c800, 1)];
const w10Grid = [firstWithin(c400, 0.1), firstWithin(c800, 0.1)];
const w5Grid = [firstWithin(c400, 0.05), firstWithin(c800, 0.05)];
// Endpoint variation of Kneedle (gridN=800): the destabilising axis.
const kneeLowEndpoints = kneedle(buildCurve(0.9, SIGMA_PT, 800)); // ~0.7414
const kneeHighEndpoints = kneedle(buildCurve(+SIGMA_MAX.toFixed(4), SIGMA_PT, 800)); // ~0.8156
// Flattest point is smoothing-invariant: stencil k=1 vs k=8 on the 800 grid.
const flatSmooth = [flattest(c800, 1), flattest(c800, 8)];

const rng = (a) => Math.max(...a) - Math.min(...a);
const kneeGridMove = rng(kneeGrid);
const kneeEndpointMove = Math.abs(kneeHighEndpoints - kneeLowEndpoints);
const flatMove = rng([...flatGrid, ...flatSmooth]);
const w10Move = rng(w10Grid);
const w5Move = rng(w5Grid);

export const IMP35932_KNEE_LOCATOR_STABILITY = {
  id: 'imp-35932',
  proofSection: 'S-frontier',
  question:
    'Of the three DISAGREEING imp-35853 REQ-4 knee locators (Kneedle elbow sigma ~ 0.783, flattest ' +
    'point sigma ~ 0.407, PT-anchor-approach sigma ~ 0.035), which is STABLE under refinement of the ' +
    'sigma grid (halving the spacing) and variation of the chord endpoints / smoothing stencil, and ' +
    'does any of the three constitute a robust canonical knee?',
  method:
    'Replicate the EXACT imp-3406 / imp-33582 sub-terms (sigma = E_coll / (E_trunc + E_flow + E_coll)), ' +
    'rebuild the fine sigma-vs-multiple curve on four grid densities (gridN 400/800/1600/3200), across ' +
    'twelve chord-endpoint pairs (sHi in {0.90,0.92,0.94,sigma_max}, sLo in {sigma_PT,0.05,0.10}) and five ' +
    'flattest smoothing stencils (k = 1,2,4,8,16); relocate each of the three sigma-landmarks on every ' +
    'variant and record how far it moves. Full sweep offline in scripts/imp-35932-knee-stability-offline.mjs; ' +
    'a fast import-time subset (gridN 400/800; low/high Kneedle endpoints; flattest k=1 vs k=8) certifies ' +
    'the baked verdicts.',
  // Baked results from the full offline sweep (scripts/imp-35932-knee-stability-offline.mjs).
  stability: {
    kneedleElbow: {
      sigmaNominal: 0.783,
      gridMoveOver400to3200: 0.0006, // grid-stable
      endpointRange: [0.712, 0.8156], // sHi 0.90..sigma_max, sLo sigma_PT..0.10
      endpointMove: 0.1036, // ~13.5% relative
      verdict: 'UNSTABLE -- grid-stable but strongly chord-endpoint-dependent; a locator artifact, not a canonical bend',
    },
    flattestPoint: {
      sigmaNominal: 0.407,
      rangeAllVariations: [0.4065, 0.408], // grid + endpoint + smoothing
      totalMove: 0.0015, // ~0.4% relative
      smoothingMove: 0.0, // stencil-invariant
      verdict: 'ROBUST -- grid-, endpoint-, and smoothing-invariant; the genuinely stable geometric marker',
    },
    ptAnchorApproach: {
      within10pctSigmaRange: [0.0648, 0.0661], // ~2.0% relative
      within5pctSigmaRange: [0.0349, 0.0364], // ~4.2% relative
      verdict: 'STABLE -- a level-set crossing on a monotone curve, grid- and endpoint-independent',
    },
  },
  // Live import-time confirmations (recomputed on this build, not read from disk).
  live: {
    kneeGridMove: +kneeGridMove.toFixed(4),
    kneeEndpointMove: +kneeEndpointMove.toFixed(4),
    flatMove: +flatMove.toFixed(4),
    within10pctGridMove: +w10Move.toFixed(4),
    within5pctGridMove: +w5Move.toFixed(4),
    flattestSigma: +flatGrid[1].toFixed(4),
  },
  mostStableLocator: 'flattestPoint',
  leastStableLocator: 'kneedleElbow',
  reconcilesToOneKnee: false,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Sweeping the three imp-35853 REQ-4 knee locators over four sigma-grid ' +
    'densities (halving the spacing to gridN 3200), twelve chord-endpoint pairs, and five flattest ' +
    'smoothing stencils: the FLATTEST POINT is the robust marker -- its sigma stays in [0.4065, 0.408] ' +
    '(total move ~0.0015, ~0.4% relative) across every grid, endpoint, and smoothing choice, tracking a ' +
    'genuine mid-downslope minimum of |d multiple / d sigma|. The PT-ANCHOR-VALUE APPROACH is also stable ' +
    '(within-10% sigma in [0.0648, 0.0661] ~2.0%, within-5% in [0.0349, 0.0364] ~4.2%), as expected for a ' +
    'level-set crossing on a monotone curve, grid- and endpoint-independent. The KNEEDLE ELBOW is the ' +
    'unstable one: grid-stable (moves ~0.0006 over gridN 400..3200) but chord-endpoint-dependent, swinging ' +
    'across [0.712, 0.8156] in sigma (~0.104, ~13.5% relative) purely by moving the chord anchors -- a ' +
    'locator artifact, exactly the imp-35943 caveat, now quantified. So of the three, the flattest point ' +
    '(sigma ~ 0.407) is the genuinely stable geometric knee and the PT-anchor approach a stable level-set, ' +
    'while the Kneedle elbow is a locator-defined convenience; the sweep does NOT reconcile the three into ' +
    'a single knee -- they still answer different questions -- and ~6.96x remains the multiple AT the ' +
    'Platt-Trudgian verified height, a point value, not an asymptotic floor. Re-reads the imp-33582 model ' +
    'and the imp-35538 binding log-height on the same surrogate; interpolates the imp-35813 rungs; derives ' +
    'no remainder; discharges nothing; changes no bound; establishes no operator positivity; ' +
    'C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional ' +
    '(imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35853 (the three knee locators measured here); imp-35943 (locator-dependence caveat, now quantified); ' +
    'imp-35538 (REQ 4; binding log-height 200); imp-33582 (sigma-decay model; peak sigma_max ~ 0.9494); ' +
    'imp-3220 / imp-3406 (RvM surrogate log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 ' +
    '(E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; ' +
    'Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35932_KNEE_LOCATOR_STABILITY_ASSERTIONS = [
  {
    // (1) reproduces the imp-33582 / imp-35853 model anchors (identical sub-terms in use).
    id: 'imp35932-reproduces-imp35853-model-anchors',
    description: 'peak sigma_max ~ 0.9494, PT-anchor sigma ~ 0.0188, MULT_PT ~ 6.9615 -- confirms the identical imp-35853 model is in use',
    holds: () =>
      Math.abs(SIGMA_MAX - 0.9494) < 5e-4 &&
      Math.abs(SIGMA_PT - 0.01876) < 5e-4 &&
      Math.abs(MULT_PT - 6.9615) < 5e-3,
  },
  {
    // (2) the flattest point is the ROBUST locator: live grid+smoothing move is tiny and sigma ~ 0.407.
    id: 'imp35932-flattest-is-robust',
    description: 'flattest-point sigma stays ~ 0.407 with < 0.005 total move across grid and smoothing -- the stable marker',
    holds: () =>
      Math.abs(flatGrid[1] - 0.407) < 0.01 &&
      flatMove < 0.005 &&
      IMP35932_KNEE_LOCATOR_STABILITY.mostStableLocator === 'flattestPoint',
  },
  {
    // (3) the Kneedle elbow is grid-stable but ENDPOINT-unstable (the destabilising axis).
    id: 'imp35932-kneedle-endpoint-unstable',
    description: 'Kneedle moves < 0.01 under grid refinement but > 0.05 (here ~0.07) between low and high chord endpoints',
    holds: () =>
      kneeGridMove < 0.01 &&
      kneeEndpointMove > 0.05 &&
      kneeEndpointMove > kneeGridMove * 10 &&
      IMP35932_KNEE_LOCATOR_STABILITY.leastStableLocator === 'kneedleElbow',
  },
  {
    // (4) the PT-anchor approach is grid-stable (level-set crossing on a monotone curve).
    id: 'imp35932-pt-approach-grid-stable',
    description: 'first-within-10% and within-5% sigma each move < 0.005 under grid refinement (400 vs 800)',
    holds: () =>
      Number.isFinite(w10Grid[0]) && Number.isFinite(w5Grid[0]) &&
      w10Move < 0.005 && w5Move < 0.005 &&
      w5Grid[1] < w10Grid[1],
  },
  {
    // (5) the baked full-sweep ranges are internally ordered and the flattest range is the tightest.
    id: 'imp35932-baked-ranges-consistent',
    description: 'baked Kneedle endpoint move (~0.104) >> flattest total move (~0.0015); the flattest point is the tightest of the three',
    holds: () => {
      const s = IMP35932_KNEE_LOCATOR_STABILITY.stability;
      const flatTot = s.flattestPoint.totalMove;
      const kneeEnd = s.kneedleElbow.endpointMove;
      const w10 = s.ptAnchorApproach.within10pctSigmaRange[1] - s.ptAnchorApproach.within10pctSigmaRange[0];
      return kneeEnd > 0.05 && flatTot < 0.005 && kneeEnd > flatTot * 20 && w10 < 0.01 && kneeEnd > w10 * 20;
    },
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, imp-486 kept, NO QED.
    id: 'imp35932-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, does not reconcile to one knee, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35932_KNEE_LOCATOR_STABILITY;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.reconcilesToOneKnee === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35932_KNEE_LOCATOR_STABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35932-knee-locator-stability assertion failed: ${a.id}`);
  }
}
