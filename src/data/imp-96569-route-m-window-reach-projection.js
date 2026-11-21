/**
 * @module imp-96569-route-m-window-reach-projection
 *
 * imp-96569 (numerical): measure how much WIDER a log-N window (what larger N
 * reach) would be needed to separate the Route M Burnol quantity
 *     ratio(N) = d_N^2 * log N / C_burnol
 * converging to 1 (RH + simple zeros) from the imp-96487 finite-N plateau at
 * c0 ~ 0.985, at a stated confidence, and compare that reach to the imp-96352
 * wall-clock compute ceiling N ~ 9916 (30-min budget).
 *
 * imp-96487 fit the decaying-oscillation asymptotic-remainder model over the
 * N=250..10000 ladder (21 rungs, log-N span 3.689) and returned a plateau
 * centerline c0 = 0.984564 with the RH value 1 disfavored ~1.9x in rms, but
 * UNDECIDED because the window is only ~2.26 oscillation periods wide. imp-96532
 * confirmed the ~29 percent rms reduction is leave-one-out robust. This ticket
 * quantifies the reach the CPU-blocked wider build would need to overturn that
 * ~1.9x reading. MEASUREMENT/PROJECTION ONLY. Changes no bound; NO QED.
 *
 * SETUP (tmp/imp-96569-scratch.mjs, reproducible):
 *   - current right edge L0 = log(10000) = 9.2103; measured span 3.6889, 21 rungs,
 *     rung density in L = 21/3.6889 = 5.692 per unit L.
 *   - plateau centerline c_plat = 0.984564 (imp-96487 MB fit); the RH-vs-plateau
 *     centerline gap is gapFull = 1 - c_plat = 0.015436.
 *   - fluctuation scales: sigma_MB = 8.8545e-3 (remainder-model residual rms),
 *     sigma_scatter = 1.2477e-2 (flat-constant per-rung scatter rms).
 *   - RH drift model c_RH(L) = 1 - A/L^q, calibrated so c_RH(L0) = c_plat (the two
 *     hypotheses coincide at the current edge and the drift lifts the centerline
 *     toward 1 only beyond it); gap(L) = gapFull * (1 - (L0/L)^q). q in {0.5,1,2}
 *     spans the imp-96487 degenerate decay exponent.
 *   - cost model (imp-96352): T(N) = kappa N^3 + beta N^2, kappa = 9.621e-10,
 *     beta = 8.764e-6; the 30-min reach ceiling is N ~ 9916.
 *
 * FINDING 1 -- FUNDAMENTAL FLOOR (IMP96569_GAP_FLOOR). The entire RH-vs-plateau
 * separation the wider window can ever deliver is bounded by gapFull: even at
 * infinite N (centerline fully at 1) the gap is only 1.237 * sigma_scatter and
 * 1.743 * sigma_MB. So a per-rung-scatter-limited reading can NEVER reach the
 * 2-sigma level -- the gap is smaller than twice the rung-to-rung fluctuation.
 * Any decisive separation therefore REQUIRES averaging many rungs (a sqrt(m)
 * standard-error gain), which is exactly where the imp-96487 low-frequency
 * degeneracy (a slow centerline drift is absorbable into the remainder) bites.
 *
 * FINDING 2 -- REACH PROJECTION (IMP96569_PROJECTION). Under the OPTIMISTIC
 * standard-error model (centerline offset averaged over the extended window,
 * SE = sigma/sqrt(m) with m = 5.692*(L1-L0) rungs, IGNORING the degeneracy so it
 * is a lower bound on the reach), the log-N edge L1 and reach N1 to detect the
 * drift at confidence z are:
 *   - most optimistic corner (z=2, q=2, sigma_MB): L1 = 12.52, N1 = 2.74e5 --
 *     already ~1.44 orders of magnitude beyond the ceiling N ~ 9916 and ~28x the
 *     largest measured rung N=1e4.
 *   - representative (z=3, q=1, sigma_MB): L1 = 16.59, N1 = 1.60e7 -- a log-N
 *     window ~3.0x wider than the measured span, ~3.21 orders beyond the ceiling,
 *     wall-clock ~1.25e5 years at the imp-96352 cubic cost.
 *   - conservative (z=5, q=0.5, sigma_scatter): L1 = 35.93, N1 = 4.00e15 --
 *     ~8.2x the measured span, ~11.6 orders beyond the ceiling.
 *
 * VERDICT (IMP96569_VERDICT): deciding ratio(N)->1 against the ~0.985 plateau is
 * out of reach by a wide margin under EVERY drift exponent and confidence target.
 * The minimum projected reach (2-sigma, fastest decay, tightest noise) is already
 * N ~ 2.7e5 -- ~1.4 orders beyond the compute ceiling -- and a genuine 3-sigma
 * decision under a 1/logN drift needs N ~ 1.6e7, ~3.2 orders beyond it. The
 * robust, model-independent reading is that the gap (0.0154) is only ~1.24x the
 * per-rung scatter, so no accessible or even foreseeable Gram ladder can separate
 * the two hypotheses; the imp-96487 ~1.9x plateau preference is not overturnable
 * by more compute on this Route M observable.
 *
 * MEASUREMENT/PROJECTION ONLY. Establishes no operator positivity, changes no
 * bound, makes no RH claim; no refereed bound is changed. RH open.
 * NO QED.
 *
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (plateau 0.985, ~1.9x)
 * @see imp-96532-route-m-remainder-reduction-loo-robustness.js (reduction robust)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (reach ceiling N ~ 9916)
 *
 * Ticket: imp-96569 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Current measured log-N window (imp-96487).
export const IMP96569_WINDOW = Object.freeze({
  L0: 9.210340371976184,        // log(10000), current right edge
  Lmin: 5.521460917862246,      // log(250)
  spanNow: 3.6888794541139376,  // L0 - Lmin
  nRungs: 21,
  rungsPerL: 21 / 3.6888794541139376, // 5.6926 rungs per unit L
});

// Separation budget: the RH-vs-plateau centerline gap and the fluctuation scales.
export const IMP96569_SCALES = Object.freeze({
  cPlat: 0.984564,                  // imp-96487 MB fitted plateau centerline
  gapFull: 0.015436,                // 1 - cPlat, the max achievable RH-vs-plateau gap
  sigmaMB: 0.008854508473866598,    // imp-96487 remainder-model residual rms
  sigmaScatter: 0.012476992801577314, // imp-96487 flat-constant per-rung scatter rms
});

// FINDING 1: the gap is smaller than twice the per-rung fluctuation -- a hard floor.
export const IMP96569_GAP_FLOOR = Object.freeze({
  gapToScatter: 1.237157081476285,  // gapFull / sigma_scatter
  gapToMB: 1.7432927017415112,      // gapFull / sigma_MB
  canReachTwoSigmaPerRung: false,
  note: 'even at infinite N (centerline fully at 1) the RH-vs-plateau gap is only 1.24 * sigma_scatter and 1.74 * sigma_MB, so a per-rung-scatter-limited reading can NEVER reach 2 sigma; any decision REQUIRES averaging (sqrt(m) SE), which is where the imp-96487 low-frequency drift/remainder degeneracy bites.',
});

// FINDING 2: reach projection under the optimistic SE-of-mean model.
// Row: confidence z, drift exponent q, noise label, required L1, reach N1,
// averaging rungs m, orders of magnitude beyond the N~9916 ceiling, span factor
// (L1-Lmin)/spanNow, wall-clock years at the imp-96352 cubic cost.
// (SE = sigma/sqrt(m), m = rungsPerL*(L1-L0); ignores degeneracy -> lower bound on reach.)
export const IMP96569_PROJECTION = Object.freeze([
  Object.freeze({ z: 2, q: 2,   noise: 'MB',   L1: 12.520, N1: 2.736e5,  ordersBeyondCeil: 1.44,  spanFactor: 1.897, wallYears: 6.459e-1 }),
  Object.freeze({ z: 2, q: 1,   noise: 'MB',   L1: 14.485, N1: 1.953e6,  ordersBeyondCeil: 2.29,  spanFactor: 2.430, wallYears: 2.284e2  }),
  Object.freeze({ z: 2, q: 0.5, noise: 'MB',   L1: 17.835, N1: 5.569e7,  ordersBeyondCeil: 3.75,  spanFactor: 3.338, wallYears: 5.271e6  }),
  Object.freeze({ z: 3, q: 2,   noise: 'MB',   L1: 13.848, N1: 1.033e6,  ordersBeyondCeil: 2.02,  spanFactor: 2.257, wallYears: 3.396e1  }),
  Object.freeze({ z: 3, q: 1,   noise: 'MB',   L1: 16.589, N1: 1.602e7,  ordersBeyondCeil: 3.21,  spanFactor: 3.000, wallYears: 1.254e5  }),
  Object.freeze({ z: 3, q: 0.5, noise: 'MB',   L1: 21.343, N1: 1.859e9,  ordersBeyondCeil: 5.27,  spanFactor: 4.288, wallYears: 1.959e11 }),
  Object.freeze({ z: 5, q: 2,   noise: 'MB',   L1: 16.554, N1: 1.546e7,  ordersBeyondCeil: 3.19,  spanFactor: 2.990, wallYears: 1.127e5  }),
  Object.freeze({ z: 5, q: 1,   noise: 'MB',   L1: 20.815, N1: 1.096e9,  ordersBeyondCeil: 5.04,  spanFactor: 4.144, wallYears: 4.017e10 }),
  Object.freeze({ z: 5, q: 0.5, noise: 'scat', L1: 35.925, N1: 3.9995e15, ordersBeyondCeil: 11.61, spanFactor: 8.242, wallYears: 1.952e30 }),
]);

// Headline scenarios pulled from the projection table.
export const IMP96569_HEADLINE = Object.freeze({
  ceilN: 9916,                     // imp-96352 30-min wall reach
  measuredMaxN: 10000,             // largest measured Gram rung
  minReachN: 2.736e5,              // z=2, q=2, sigma_MB -- most optimistic corner
  minReachOrdersBeyondCeil: 1.44,
  representativeReachN: 1.602e7,   // z=3, q=1, sigma_MB
  representativeOrdersBeyondCeil: 3.21,
  representativeSpanFactor: 3.0,
  note: 'even the most optimistic corner (2 sigma, fastest 1/L^2 decay, tightest MB noise) needs N ~ 2.7e5, ~1.4 orders beyond the N ~ 9916 ceiling and ~28x the largest measured rung; a genuine 3-sigma decision under a 1/logN drift needs N ~ 1.6e7 over a log-N window ~3x wider than the one measured.',
});

export const IMP96569_VERDICT = Object.freeze({
  decidableWithinCeiling: false,
  minReachExceedsCeiling: true,
  fundamentalGapFloor: true,       // gap < 2 * per-rung scatter
  conclusion:
    'deciding ratio(N)->1 against the imp-96487 ~0.985 plateau is out of reach under EVERY drift exponent q in {0.5,1,2} and confidence z in {2,3,5}: the minimum projected reach is N ~ 2.7e5 (~1.4 orders beyond the N ~ 9916 compute ceiling) and a 3-sigma decision under a 1/logN drift needs N ~ 1.6e7 (~3.2 orders beyond). The model-independent floor is decisive: the RH-vs-plateau gap 0.0154 is only ~1.24x the per-rung scatter and ~1.74x the remainder-model residual, so no per-rung reading can ever hit 2 sigma and any averaging route collides with the imp-96487 low-frequency degeneracy. The ~1.9x plateau preference is not overturnable by more Route M Gram compute; this quantifies the reach the CPU-blocked build would need but cannot attain.',
});

export const IMP96569_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/projection only: every value is a reproducible numeric from tmp/imp-96569-scratch.mjs over the baked imp-96487 fluctuation scales and the imp-96352 cost model. The SE-of-mean reach is an OPTIMISTIC lower bound (it ignores the imp-96487 low-frequency drift/remainder degeneracy, which only enlarges the required reach); no new solve, no bound is claimed, no operator positivity is established.';

// Honest residual sub-gap.
export const IMP96569_SUBGAP = Object.freeze({
  id: 'imp-96569-reach-projection-model-dependent',
  statement:
    'the reach projection is a scaling estimate, not a rigorous power calculation: the required N1 depends on the drift exponent q (the imp-96487 degenerate parameter) and on the assumed noise floor, and the SE-of-mean model IGNORES the low-frequency degeneracy that lets a slow centerline drift hide inside the remainder, so every quoted reach is an optimistic LOWER bound. The robust, model-free part is the gap floor: gap = 0.0154 is only ~1.24x the per-rung scatter, so no accessible ladder can decide the asymptote. A rigorous decision needs an entirely different observable (a wider log-N reach is provably insufficient at any wall-feasible N), not a longer Gram ladder.',
  status: 'open',
});

// Registration for the sub-gap harvester (literal openSubGap key).
export const IMP96569_OPEN_SUBGAP_REGISTRATION = Object.freeze({
  openSubGap: {
    id: 'imp-96569-reach-projection-model-dependent',
    statement:
      'the imp-96569 log-N window reach to decide the Route M Burnol ratio->1 against the imp-96487 ~0.985 plateau is an optimistic lower bound of N ~ 2.7e5 (2 sigma) to N ~ 1.6e7 (3 sigma), all beyond the imp-96352 N ~ 9916 ceiling by 1.4 to 3.2 orders, and the model-free gap floor (gap 0.0154 is only ~1.24x the per-rung scatter) shows no wall-feasible ladder can separate the hypotheses. Deciding the asymptote needs a different observable, not a longer Gram ladder.',
    status: 'open',
  },
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96569_ASSERTIONS = [
  {
    id: 'imp96569-gap-floor-below-two-sigma',
    holds: () =>
      Math.abs(IMP96569_GAP_FLOOR.gapToScatter - 1.237157081476285) < 1e-9 &&
      Math.abs(IMP96569_GAP_FLOOR.gapToMB - 1.7432927017415112) < 1e-9 &&
      IMP96569_GAP_FLOOR.gapToScatter < 2 &&
      IMP96569_GAP_FLOOR.canReachTwoSigmaPerRung === false,
    why: 'the RH-vs-plateau gap 0.0154 is only 1.237 * sigma_scatter and 1.743 * sigma_MB, both below 2: no per-rung-scatter reading can ever reach 2 sigma.',
  },
  {
    id: 'imp96569-gap-consistent-with-scales',
    holds: () =>
      Math.abs(IMP96569_SCALES.gapFull - (1 - IMP96569_SCALES.cPlat)) < 1e-9 &&
      Math.abs(IMP96569_SCALES.gapFull / IMP96569_SCALES.sigmaScatter - IMP96569_GAP_FLOOR.gapToScatter) < 1e-9 &&
      Math.abs(IMP96569_SCALES.gapFull / IMP96569_SCALES.sigmaMB - IMP96569_GAP_FLOOR.gapToMB) < 1e-9,
    why: 'the baked gap-to-fluctuation ratios reproduce gapFull/sigma exactly from the imp-96487 scales.',
  },
  {
    id: 'imp96569-projection-monotone-and-beyond-ceiling',
    holds: () =>
      IMP96569_PROJECTION.length === 9 &&
      IMP96569_PROJECTION.every((r) => r.N1 > 9916 && r.ordersBeyondCeil > 1 && r.spanFactor > 1) &&
      IMP96569_PROJECTION.every((r) => r.L1 > IMP96569_WINDOW.L0),
    why: 'every projected reach exceeds the N ~ 9916 ceiling (ordersBeyondCeil > 1) and sits beyond the current right edge L0.',
  },
  {
    id: 'imp96569-headline-min-reach',
    holds: () =>
      Math.abs(IMP96569_HEADLINE.minReachN - 2.736e5) < 1e2 &&
      IMP96569_HEADLINE.minReachN > IMP96569_HEADLINE.ceilN &&
      Math.abs(IMP96569_HEADLINE.minReachOrdersBeyondCeil - 1.44) < 0.05 &&
      Math.abs(IMP96569_HEADLINE.representativeReachN - 1.602e7) < 1e4,
    why: 'the most optimistic corner needs N ~ 2.7e5 (~1.44 orders beyond the ceiling) and the representative 3-sigma/1-logN case needs N ~ 1.6e7.',
  },
  {
    id: 'imp96569-verdict-not-decidable',
    holds: () =>
      IMP96569_VERDICT.decidableWithinCeiling === false &&
      IMP96569_VERDICT.fundamentalGapFloor === true &&
      /1.9x/.test(IMP96569_VERDICT.conclusion),
    why: 'the verdict records the decision is out of reach within the ceiling and cites the model-free gap floor and the imp-96487 ~1.9x preference.',
  },
  {
    id: 'imp96569-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96569_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96569_HONEST_BANNER) &&
      /NO QED/.test(IMP96569_HONEST_BANNER) &&
      /OPTIMISTIC lower bound/.test(IMP96569_HONEST_BANNER) &&
      typeof IMP96569_SUBGAP.statement === 'string' &&
      IMP96569_OPEN_SUBGAP_REGISTRATION.openSubGap.status === 'open',
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and flags the lower-bound caveat, and the named sub-gap is registered open.',
  },
];

for (const a of IMP96569_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96569-route-m-window-reach-projection assertion failed: ${a.id}`);
  }
}

export default {
  window: IMP96569_WINDOW,
  scales: IMP96569_SCALES,
  gapFloor: IMP96569_GAP_FLOOR,
  projection: IMP96569_PROJECTION,
  headline: IMP96569_HEADLINE,
  verdict: IMP96569_VERDICT,
  subGap: IMP96569_SUBGAP,
  openSubGapRegistration: IMP96569_OPEN_SUBGAP_REGISTRATION,
  banner: IMP96569_HONEST_BANNER,
};
