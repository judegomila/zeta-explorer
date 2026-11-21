/**
 * @module imp-36042-i4-landmarks-vs-winding-count-scale
 *
 * imp-36042 (numerical, S-frontier): MEASURE (double-precision SURROGATE) how the imp-35989 two-channel
 * I4 accrual landmarks -- the U-minimum LOCATION n_min, the U-minimum VALUE E_min, and the roundoff-only
 * pi crossover n* -- move as the winding-count N grows from the imp-35989 anchor N = 1 (single-mean-gap
 * box) up to the true T_PT retained-term count N ~ 488602, since imp-35989 E_round(n) scales linearly in
 * |S| = 2pi * N. Tests whether the imp-35989 "pi budget clear at every physical n" reading survives at the
 * true count.
 *
 * SURROGATE MEASUREMENT ONLY. imp-35989 anchored its I4 accrual surrogate at N = 1 and flagged, but never
 * measured, the linear-in-N roundoff scaling. This module supplies that N-track. It sums NO real per-panel
 * increments; evaluates NO A, B, or C; certifies NO count; fixes NO Delta or h; instantiates NO interval;
 * changes NO bound. NO QED. No refereed bound is changed.
 *
 * THE N-DEPENDENCE OF THE THREE LANDMARKS (CLOSED FORMS)
 * -----------------------------------------------------------------------------
 * The imp-35989 two channels at winding-count N, with |S| = 2pi * N and u = 2^-53:
 *     E_round(n; N) = ((n - 1) + RHO_EVAL) * u * 2pi * N   -- GROWS linearly in n AND linearly in N,
 *     E_trunc(n)    = K_TRUNC / n                          -- N-INDEPENDENT (I1 enclosure width).
 * Only the roundoff channel carries N. So as N grows the U tilts: the growing arm rises, the falling arm
 * is fixed, and the three landmarks track distinct powers of N:
 *
 *   (1) Roundoff-only crossover n*(N): E_round(n*; N) = pi  =>  n*(N) = pi/(u*2pi*N) + (1 - RHO_EVAL)
 *       = 1/(2 u N) + (1 - RHO_EVAL). Dominated by 1/(2 u N), so n*(N) FALLS as 1/N:
 *           d log n* / d log N = -1  (to O(RHO_EVAL/n*) ~ 1e-16).
 *       N = 1: n* ~ 4.50e15.  N ~ 488602: n* ~ 9.22e9 -- still ~4 orders above the physical max.
 *
 *   (2) U-minimum location n_min(N): dE_total/dn = u*2pi*N - K_TRUNC/n^2 = 0  =>
 *           n_min(N) = sqrt(K_TRUNC/(u*2pi*N)).  FALLS as 1/sqrt(N):  d log n_min / d log N = -1/2.
 *       N = 1: n_min ~ 1.56e8 (far ABOVE any physical n).  N ~ 488602: n_min ~ 2.23e5 -- INSIDE the
 *       physical heavy-refinement range (n ~ 17 .. ~1e6). QUALITATIVE SHIFT (see below).
 *
 *   (3) U-minimum value E_min(N) = 2*sqrt(K_TRUNC * u*2pi*N) + (RHO_EVAL - 1)*u*2pi*N ~ 2*sqrt(K_TRUNC*u*2pi*N).
 *       RISES as sqrt(N):  d log E_min / d log N = +1/2.
 *       N = 1: E_min ~ 2.18e-7 rad (~7 orders below pi).  N ~ 488602: E_min ~ 1.52e-4 rad (~4 orders below pi).
 *
 * THE QUALITATIVE SHIFT: THE U-MINIMUM MIGRATES INTO THE PHYSICAL RANGE
 * -----------------------------------------------------------------------------
 * At the imp-35989 anchor N = 1 the U-minimum n_min ~ 1.56e8 sits far ABOVE the physical panel range
 * (n ~ 17 .. ~1e6), so raising n MONOTONELY lowers E across the whole physical range (truncation-dominated).
 * As N grows, n_min descends as 1/sqrt(N) and crosses into the physical range at
 *     N_cross = K_TRUNC/(u*2pi*(1e6)^2) ~ 2.44e4,
 * i.e. for N > ~24372 the U-minimum sits BELOW the physical max 1e6. At the true count N ~ 488602 the
 * minimum n_min ~ 2.23e5 is well inside the physical range, so the imp-35989 "raising n always helps"
 * reading NO LONGER holds across the entire physical range -- beyond n ~ 2.23e5 the roundoff arm dominates
 * and further subdivision mildly HURTS I4.
 *
 * DOES THE pi BUDGET SURVIVE AT THE TRUE COUNT? YES, WITH A THINNED MARGIN
 * -----------------------------------------------------------------------------
 *   - The U-minimum value E_min ~ 1.52e-4 rad at N ~ 488602 is still ~4 orders below pi (vs ~7 orders at N=1).
 *   - At the physical max n = 1e6, E_total ~ 3.58e-4 rad -- still ~4 orders below pi.
 *   - The roundoff-only crossover n* ~ 9.22e9 stays ~4 orders above the physical max 1e6.
 * So the imp-35989 conclusion -- the closed-loop total comfortably clears the pi integer-closure budget at
 * every physical n -- SURVIVES at the true retained-term count. The linear-in-N roundoff growth thins the
 * safety margin from ~7 to ~4 orders of magnitude and relocates the U-minimum into the physical range, but
 * does not threaten pi. The operative constraint at the true count is still truncation up to n ~ 2.23e5.
 *
 * WHAT THIS IS NOT
 * -----------------------------------------------------------------------------
 * A double-precision SURROGATE, not a certificate. RHO_EVAL and K_TRUNC remain the imp-35989 ILLUSTRATIVE
 * constants (their landmark elasticities are <= 1/2, imp-36041); N ~ 488602 = floor(sqrt(T_PT/(4pi))) is the
 * imp-35674 Part D retained-term count, used here only as the top of the N-track. It sums no real increments,
 * evaluates no true H_t, certifies no count, fixes no Delta or h, instantiates no interval, changes no bound.
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35989-i4-accumulated-error-vs-panel-count-scale (two-channel accrual surrogate; N = 1 anchor)
 * @see imp-36041-i4-landmark-sensitivity-to-surrogate-constants (RHO_EVAL / K_TRUNC elasticities of the same landmarks)
 * @see imp-35804-i4-integer-closure-error-budget-scope (I4 < pi GLOBAL accumulated-error budget)
 * @see imp-35674 Part D (N(x) = floor(sqrt(x/4pi)) retained-term formula; N ~ 488602 at T_PT)
 * @see Polymath15 2019 (H_t = A + B - C; barrier method); Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed)
 */

// -- Anchor + operative constants (import-light; matching imp-35989 / imp-36041) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const HALF_TURN = Math.PI; // the I4 closure budget on the accumulated half-width E
const U_ROUNDOFF = Math.pow(2, -53); // double-precision unit roundoff ~ 1.1102e-16
const RHO_EVAL = 4; // imp-35989 per-panel arg/atan2 evaluation condition (illustrative)
const K_TRUNC = 17; // imp-35989 1/n truncation-accrual constant (illustrative)
const N_ANCHOR = 1; // imp-35989 winding-count anchor (single-mean-gap box)
const N_TPT = 488602; // T_PT retained-term count = floor(sqrt(T_PT/(4pi))), imp-35674 Part D
const PHYSICAL_N_MAX = 1e6; // imp-35989 physical heavy-refinement panel-count ceiling

// Two-channel accrual surrogate parameterised by winding-count N (imp-35989 generalised: |S| = 2pi*N).
const sTotal = (N) => 2 * Math.PI * N;
const eRound = (n, N) => ((n - 1) + RHO_EVAL) * U_ROUNDOFF * sTotal(N);
const eTrunc = (n) => K_TRUNC / n; // N-independent
const eTotal = (n, N) => eRound(n, N) + eTrunc(n);

// Closed-form landmark tracks in N.
const nStar = (N) => HALF_TURN / (U_ROUNDOFF * sTotal(N)) - RHO_EVAL + 1; // ~ 1/N
const nMin = (N) => Math.sqrt(K_TRUNC / (U_ROUNDOFF * sTotal(N))); // ~ 1/sqrt(N)
const eMin = (N) => eTotal(nMin(N), N); // ~ sqrt(N)

// N-track grid: anchor -> physical-range entry of n_min -> true retained-term count.
const N_CROSS = K_TRUNC / (U_ROUNDOFF * 2 * Math.PI * PHYSICAL_N_MAX * PHYSICAL_N_MAX); // ~ 2.44e4
const N_GRID = [1, 1e3, 1e4, N_CROSS, 1e5, N_TPT];

const LANDMARK_TABLE = Object.freeze(
  N_GRID.map((N) =>
    Object.freeze({
      N: Number(N.toExponential(6)),
      nStar: Number(nStar(N).toExponential(6)),
      nMin: Number(nMin(N).toExponential(6)),
      eMin: Number(eMin(N).toExponential(6)),
      nMinBelowPhysicalMax: nMin(N) < PHYSICAL_N_MAX,
      eMinUnderPiBudget: eMin(N) < HALF_TURN,
    }),
  ),
);

// Landmark values at the two anchors of the N-track.
const N_STAR_AT_1 = nStar(N_ANCHOR); // ~ 4.50e15
const N_STAR_AT_TPT = nStar(N_TPT); // ~ 9.22e9
const N_MIN_AT_1 = nMin(N_ANCHOR); // ~ 1.56e8
const N_MIN_AT_TPT = nMin(N_TPT); // ~ 2.23e5
const E_MIN_AT_1 = eMin(N_ANCHOR); // ~ 2.18e-7
const E_MIN_AT_TPT = eMin(N_TPT); // ~ 1.52e-4
const E_TOTAL_AT_PHYSICAL_MAX_TPT = eTotal(PHYSICAL_N_MAX, N_TPT); // ~ 3.58e-4

export const IMP36042_I4_LANDMARKS_VS_WINDING_COUNT_SCALE = {
  id: 'imp-36042',
  proofSection: 'S-frontier',
  question:
    'Measure (double-precision surrogate) how the imp-35989 I4 accrual landmarks -- U-minimum location n_min, ' +
    'U-minimum value E_min, and the roundoff-only pi crossover n* -- move as the winding-count N grows from the ' +
    'imp-35989 anchor N = 1 up to the true T_PT retained-term count N ~ 488602 (E_round scales linearly in ' +
    '|S| = 2pi*N), and whether the imp-35989 pi-budget-clear-at-every-physical-n reading survives at the true count. ' +
    'Surrogate measurement only; sums no real increments; certifies no count; changes no bound; NO QED.',
  model: {
    channels:
      'E_round(n; N) = ((n-1) + RHO_EVAL)*u*2pi*N GROWS linearly in BOTH n and N; E_trunc(n) = K_TRUNC/n is ' +
      'N-INDEPENDENT. Only the roundoff arm carries N, so growing N tilts the U upward on its right arm.',
    unitRoundoff: U_ROUNDOFF,
    evalCondition: RHO_EVAL,
    truncConstant: K_TRUNC,
    windingAnchor: N_ANCHOR,
    windingTrueCount: N_TPT,
    physicalNMax: PHYSICAL_N_MAX,
    scalingLaws:
      'n*(N) ~ 1/N (d log n*/d log N = -1); n_min(N) ~ 1/sqrt(N) (d log n_min/d log N = -1/2); ' +
      'E_min(N) ~ sqrt(N) (d log E_min/d log N = +1/2).',
  },
  landmarkTable: LANDMARK_TABLE,
  roundoffCrossover: {
    nStarAtAnchor: N_STAR_AT_1,
    nStarAtTrueCount: N_STAR_AT_TPT,
    finding:
      'n*(N) falls as 1/N from ~ 4.50e15 (N = 1) to ~ 9.22e9 (N ~ 488602) -- still ~4 orders above the physical ' +
      'panel-count max (~1e6). The per-panel rounding accrual never reaches pi at any physical n, even at the true count.',
  },
  uMinimumLocation: {
    nMinAtAnchor: N_MIN_AT_1,
    nMinAtTrueCount: N_MIN_AT_TPT,
    nCrossIntoPhysical: Number(N_CROSS.toExponential(6)),
    finding:
      'n_min(N) falls as 1/sqrt(N) from ~ 1.56e8 (N = 1, far ABOVE physical) to ~ 2.23e5 (N ~ 488602, INSIDE the ' +
      'physical range n ~ 17 .. 1e6). It crosses into the physical range at N ~ 2.44e4. QUALITATIVE SHIFT: at the ' +
      'true count, raising n past ~ 2.23e5 mildly HURTS I4 -- the imp-35989 monotone-help reading holds only up to n_min.',
  },
  uMinimumValue: {
    eMinAtAnchor: E_MIN_AT_1,
    eMinAtTrueCount: E_MIN_AT_TPT,
    eTotalAtPhysicalMax: E_TOTAL_AT_PHYSICAL_MAX_TPT,
    finding:
      'E_min(N) rises as sqrt(N) from ~ 2.18e-7 rad (N = 1) to ~ 1.52e-4 rad (N ~ 488602). At the physical max ' +
      'n = 1e6 the total is ~ 3.58e-4 rad. Both stay ~4 orders below pi -- the pi budget SURVIVES at the true count.',
  },
  verdict:
    'SURROGATE MEASUREMENT (frontier-direction, NOT rigorous). Tracking the imp-35989 two-channel I4 landmarks in ' +
    'the winding-count N (only E_round = ((n-1)+RHO_EVAL)*u*2pi*N carries N; E_trunc = K_TRUNC/n does not) gives three ' +
    'clean power laws: the roundoff-only pi crossover n*(N) ~ 1/N (4.50e15 at N=1 -> 9.22e9 at N ~ 488602), the ' +
    'U-minimum location n_min(N) ~ 1/sqrt(N) (1.56e8 -> 2.23e5), and the U-minimum value E_min(N) ~ sqrt(N) ' +
    '(2.18e-7 rad -> 1.52e-4 rad). Two structural readings at the true retained-term count N ~ 488602 = ' +
    'floor(sqrt(T_PT/4pi)) (imp-35674 Part D): (i) the U-minimum MIGRATES into the physical panel range (crossing ' +
    'below n = 1e6 at N ~ 2.44e4), so the imp-35989 monotone-help-of-subdivision reading holds only up to n ~ 2.23e5 ' +
    'at the true count, not across the whole physical range; (ii) the pi integer-closure budget nonetheless SURVIVES ' +
    '-- E_min ~ 1.52e-4 rad and the physical-max total ~ 3.58e-4 rad both stay ~4 orders below pi, and n* stays ~4 ' +
    'orders above the physical max. The linear-in-N roundoff growth thins the safety margin from ~7 to ~4 orders and ' +
    'relocates the U-minimum, but does not threaten pi. RHO_EVAL, K_TRUNC are the imp-35989 illustrative constants ' +
    '(landmark elasticities <= 1/2, imp-36041). It sums no real increments; evaluates no true H_t; certifies no ' +
    'count; fixes no Delta or h; instantiates no interval; changes no bound; NO QED. No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-35989 (two-channel I4 accrual surrogate; N = 1 anchor; roundoff linear in |S| = 2pi*N); imp-36041 (RHO_EVAL / ' +
    'K_TRUNC landmark elasticities <= 1/2); imp-35804 (I4 < pi GLOBAL accumulated-error budget); imp-35674 Part D ' +
    '(N(x) = floor(sqrt(x/4pi)); N ~ 488602 at T_PT); Polymath15 2019 (H_t = A + B - C; barrier method); ' +
    'Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed).',
};

export const IMP36042_I4_LANDMARKS_VS_WINDING_COUNT_SCALE_ASSERTIONS = [
  {
    // Only the roundoff channel carries N; the truncation channel is N-independent.
    id: 'imp36042-only-roundoff-carries-N',
    description: 'E_round scales linearly in N (E_round(n;10N)=10*E_round(n;N)); E_trunc is N-independent',
    holds: () =>
      Math.abs(eRound(1000, 10) - 10 * eRound(1000, 1)) < 1e-20 &&
      eTrunc(1000) === K_TRUNC / 1000 &&
      Math.abs(sTotal(N_TPT) - 2 * Math.PI * N_TPT) < 1e-6,
  },
  {
    // Roundoff-only crossover falls as 1/N: n*(N) = c/N to leading order.
    id: 'imp36042-nstar-falls-as-inverse-N',
    description: 'n*(N) ~ 1/N: n* drops from ~4.50e15 (N=1) to ~9.22e9 (N~488602), still ~4 orders above the 1e6 physical max',
    holds: () =>
      N_STAR_AT_1 > 4e15 && N_STAR_AT_1 < 5e15 &&
      N_STAR_AT_TPT > 9e9 && N_STAR_AT_TPT < 1e10 &&
      N_STAR_AT_TPT > 1e3 * PHYSICAL_N_MAX &&
      Math.abs((N_STAR_AT_1 - (1 - RHO_EVAL)) / (N_STAR_AT_TPT - (1 - RHO_EVAL)) - N_TPT) < 1,
  },
  {
    // U-minimum location falls as 1/sqrt(N) and MIGRATES into the physical range at the true count.
    id: 'imp36042-nmin-falls-as-inverse-sqrt-N-into-physical',
    description: 'n_min(N) ~ 1/sqrt(N): drops from ~1.56e8 (N=1, above physical) to ~2.23e5 (N~488602, INSIDE physical range)',
    holds: () =>
      N_MIN_AT_1 > 1e8 && N_MIN_AT_1 < 2e8 &&
      N_MIN_AT_1 > PHYSICAL_N_MAX &&
      N_MIN_AT_TPT > 1e5 && N_MIN_AT_TPT < 3e5 &&
      N_MIN_AT_TPT < PHYSICAL_N_MAX &&
      Math.abs(N_MIN_AT_1 / N_MIN_AT_TPT - Math.sqrt(N_TPT)) < 1,
  },
  {
    // U-minimum value rises as sqrt(N) but stays ~4 orders below pi at the true count.
    id: 'imp36042-emin-rises-as-sqrt-N-stays-below-pi',
    description: 'E_min(N) ~ sqrt(N): rises from ~2.18e-7 (N=1) to ~1.52e-4 rad (N~488602), still ~4 orders below pi',
    holds: () =>
      E_MIN_AT_1 > 1e-7 && E_MIN_AT_1 < 3e-7 &&
      E_MIN_AT_TPT > 1e-4 && E_MIN_AT_TPT < 2e-4 &&
      E_MIN_AT_TPT < HALF_TURN / 1e3 &&
      Math.abs(E_MIN_AT_TPT / E_MIN_AT_1 - Math.sqrt(N_TPT)) < 1,
  },
  {
    // The pi budget survives at the true count: even the physical-max total is ~4 orders below pi.
    id: 'imp36042-pi-budget-survives-at-true-count',
    description: 'At N~488602 the physical-max total E_total(1e6) ~ 3.58e-4 rad stays ~4 orders below pi; n* stays above physical max',
    holds: () =>
      E_TOTAL_AT_PHYSICAL_MAX_TPT > 1e-4 && E_TOTAL_AT_PHYSICAL_MAX_TPT < 1e-3 &&
      E_TOTAL_AT_PHYSICAL_MAX_TPT < HALF_TURN / 1e3 &&
      LANDMARK_TABLE.every((row) => row.eMinUnderPiBudget === true) &&
      N_STAR_AT_TPT > PHYSICAL_N_MAX,
  },
  {
    // The U-minimum crosses below the physical max at N ~ 2.44e4 (the qualitative shift).
    id: 'imp36042-umin-crosses-into-physical-range',
    description: 'n_min crosses below the 1e6 physical max at N ~ 2.44e4; at N=1 it is above, at N~488602 it is below',
    holds: () =>
      N_CROSS > 2e4 && N_CROSS < 3e4 &&
      Math.abs(nMin(N_CROSS) - PHYSICAL_N_MAX) < 1 &&
      LANDMARK_TABLE.find((row) => row.N === Number((1).toExponential(6))).nMinBelowPhysicalMax === false &&
      LANDMARK_TABLE.find((row) => row.N === Number(N_TPT.toExponential(6))).nMinBelowPhysicalMax === true,
  },
  {
    // Honesty gate: surrogate only, sums no increments, certifies no count, NO QED, no refereed bound is changed.
    id: 'imp36042-honesty-gate-no-qed',
    description: 'Surrogate measurement only; sums no real increments; certifies no count; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36042_I4_LANDMARKS_VS_WINDING_COUNT_SCALE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies no count/.test(IMP36042_I4_LANDMARKS_VS_WINDING_COUNT_SCALE.verdict) &&
      /NO QED/.test(IMP36042_I4_LANDMARKS_VS_WINDING_COUNT_SCALE.verdict) &&
      /refereed bound is changed/i.test(IMP36042_I4_LANDMARKS_VS_WINDING_COUNT_SCALE.verdict),
  },
];

for (const a of IMP36042_I4_LANDMARKS_VS_WINDING_COUNT_SCALE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36042-i4-landmarks-vs-winding-count-scale assertion failed: ${a.id}`);
  }
}
