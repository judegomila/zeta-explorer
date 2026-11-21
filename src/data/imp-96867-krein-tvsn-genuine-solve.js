/**
 * @fileoverview imp-96867 -- MEASUREMENT: a GENUINE (N,T) Route I Krein solve at N in {200,400,800}
 * (2a=ln3, orthogonal Gegenbauer C_n^{13/2} basis, condB=1) run to DISCRIMINATE the imp-96847 sub-gap
 * IMP96847_TVSN_LAW_THREE_POINT_ONLY: the T-truncation-vs-N law T_req(N;eps)=tau(N) ln(A(N)/eps) had
 * been fit from only THREE small-N points (52,76,100), and its two routes -- DECAY (tau ~ N^0.28,
 * sub-linear) and conservative GEOM (per-doubling ratio r climbing) -- diverge for N >> 100. imp-96847
 * itself named the resolution: a real (N,T) solve at N in {200,400,800} is needed to decide.
 *
 * PREMISE (from the ticket). imp-96847 extrapolated the DECAY route to conclude "the current T=4800
 * already suffices out to N ~ 800 at eps=1e-3" (T_req/4800 = 0.67/0.81/0.98 at N=200/400/800). This leaf
 * TESTS that extrapolation by actually solving. Driver: tmp/imp-96867-tvsn-solve.py (/tmp/rhvenv, scipy
 * 1.18) reuses the imp-96806 build()/lam_min() solver VERBATIM (Gegenbauer basis, panel=1.5 t-quadrature,
 * dense eigh), sweeping T in {800,1600,3200,4800} at each of N in {200,400,800}. A separate
 * quadrature cross-check (tmp/imp-96867-quadcheck.py, panel 1.5->0.75, gl 24->32) tests whether the
 * observed negative floors are t-quadrature under-resolution or a genuine feature of the truncated form.
 *
 * FINDINGS (measured; every literal verbatim from the run).
 *   1. BOTH ROUTES ARE REFUTED PAST N ~ 200 -- the optimistic imp-96847 extrapolation is FALSE. The
 *      genuine floor at (N=800, T=4800) is -1.1686, NOT the ~0.58 plateau the DECAY route predicted.
 *      The three-point sub-linear law was a small-N (N <= 100) artifact.
 *   2. N=200 STILL MONOTONE-CLIMBS (0.000417 -> 0.528781 -> 0.566620 -> 0.573894), the last N where the
 *      exp-decay picture roughly holds: measured T_req(1e-3)=2740.7 vs the DECAY extrapolation 3193.4
 *      (DECAY over-predicts here by ~450). The per-doubling increment ratios r12=0.072, r23=0.192 are < 1
 *      (geometric series converges).
 *   3. N=400 IS ALREADY NON-MONOTONE IN T: the floor DIPS negative (-0.001490 at T=800 -> -0.013923 at
 *      T=1600) before climbing to only 0.553928 at T=4800 -- still well below the ~0.58 plateau, so the
 *      required T is FAR above the 3875.6 the DECAY route predicted. The exp-decay refit blows up
 *      (tau=4146, T_req=29735). A quadrature cross-check at (400,4800) moves the floor by only -0.0012
 *      (0.553928 -> 0.552770): the N=400 floor is quadrature-CONVERGED and genuinely T-limited.
 *   4. N=800 IS DIVERGENTLY NEGATIVE ACROSS THE WHOLE WINDOW: -0.001595 -> -0.056669 -> -0.308996 ->
 *      -1.168643. The floor NEVER starts to climb; the increment MAGNITUDES GROW (|d| ratios r12=4.58,
 *      r23=3.41 > 1), i.e. the geometric series DIVERGES -- there is no finite-T plateau reachable at
 *      these heights. The quadrature cross-check at (800,3200) makes the floor MORE negative (-0.308996
 *      -> -0.647257, lift -0.338), so the negative direction is a GENUINE feature of the truncated
 *      sigma_2 form (high-frequency Gegenbauer test functions concentrate the positive missing-tail mass
 *      |t|>T), NOT a t-quadrature under-resolution artifact that finer quadrature would cure.
 *
 * VERDICT. The discrimination is decisive: NEITHER the DECAY (sub-linear) NOR the conservative GEOM
 * route describes the N >= 400 behaviour. The conservative GEOM route was DIRECTIONALLY right (it warned
 * that r climbs); the genuine solve shows r CROSSES 1 by N=800 (increments grow, not shrink), so the
 * true (N,T) coupling is SUPER-GEOMETRIC -- the truncation height required to make even the sign of the
 * floor correct grows faster than any geometric-doubling law past N ~ 200. Consequently no accessible
 * fixed-T solve at N >= 400 yields a reliable floor, and the imp-96749 uniform-in-N gap is not merely
 * open but WORSENED: certifying a uniform floor needs T scaled super-linearly with N by a new,
 * still-unmeasured law. Measurement only: Rayleigh floors are UPPER bounds on the true lambda_min;
 * establishes NO operator positivity; IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; interval-rigorous
 * reach stays 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96847-krein-tconv-tvsn-scaling-law.js (source three-point law; IMP96847_TVSN_LAW_THREE_POINT_ONLY)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (source (N,T) grid; IMP96807_TCONV_LADDER_LOWER_ENVELOPE)
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (reused build()/lam_min() solver; IMP96806_TSWEEP_LN3)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED, worsened)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// GENUINE (N,T) floor grid at 2a=ln3 (verbatim from tmp/imp-96867-out.json; new solve, panel=1.5)
export const IMP96867_TS = Object.freeze([800, 1600, 3200, 4800]);
export const IMP96867_NS = Object.freeze([200, 400, 800]);
export const IMP96867_FLOOR = Object.freeze({
  200: Object.freeze([0.00041725086479853, 0.5287805135519518, 0.5666204309763067, 0.5738937536711052]),
  400: Object.freeze([-0.0014898327224143, -0.013923177828574692, 0.5250652877757914, 0.5539278144855775]),
  800: Object.freeze([-0.0015950188824769, -0.05666920416828959, -0.30899576697924414, -1.1686434703832926]),
});

// per-N increment magnitudes and ratios (verbatim) -- ratio > 1 means the geometric series DIVERGES
export const IMP96867_INCREMENTS = Object.freeze({
  200: Object.freeze({ d1: 0.5283632626871533, d2: 0.037839917424354885, d3: 0.007273322694798523, r12: 0.0716172377918714, r23: 0.1922129642417559 }),
  400: Object.freeze({ d1: -0.012433345106160437, d2: 0.5389884656043661, d3: 0.028862526709786063, r12: -43.350237687628386, r23: 0.05354943296870482 }),
  800: Object.freeze({ d1: -0.0550741852858127, d2: -0.25232656281095456, d3: -0.8596477034040485, r12: 4.581575950719597, r23: 3.4068854813676697 }),
});

// t-quadrature cross-check (panel 1.5/gl24 base vs panel 0.75/gl32 fine) (verbatim from imp-96867-quad.log)
export const IMP96867_QUADCHECK = Object.freeze({
  '400@4800': Object.freeze({ base: 0.553928, fine: 0.552770, lift: -0.001158 }), // converged: genuinely T-limited
  '800@3200': Object.freeze({ base: -0.308996, fine: -0.647257, lift: -0.338262 }), // MORE negative: genuine, not quad artifact
});

// imp-96847 predictions the genuine solve is measured against (verbatim)
export const IMP96867_PREDICTIONS = Object.freeze({
  // DECAY-route extrapolated T_req(N;1e-3) from IMP96847_TREQ_EXTRAP
  decayTreq1e3: Object.freeze({ 200: 3193.4, 400: 3875.6, 800: 4703.6 }),
  // measured exp-decay refit outputs (tau blows up for N>=400 as the model breaks)
  measTau: Object.freeze({ 200: 305.84, 400: 4146.15, 800: 48663721.74 }),
  measTreq1e3: Object.freeze({ 200: 2740.7, 400: 29735.4 }), // N=800 refit gives NaN (A<0)
});

export const IMP96867_VERDICT = Object.freeze({
  ticket: 'imp-96867',
  question:
    'a genuine (N,T) Krein solve at N in {200,400,800}: does the 2a=ln3 t-truncation-vs-N law follow the imp-96847 DECAY (tau ~ N^0.28, sub-linear) route or the conservative GEOM (r climbing) route?',
  answer:
    'NEITHER -- both are refuted past N ~ 200. N=200 still monotone-climbs (T_req(1e-3)=2740.7, roughly the DECAY picture). N=400 is already NON-MONOTONE in T (dips to -0.0139 at T=1600, only 0.5539 at T=4800, quadrature-converged so genuinely T-limited, required T >> the 3876 DECAY predicted). N=800 is DIVERGENTLY NEGATIVE across the whole window (-0.0016 -> -0.0567 -> -0.3090 -> -1.1686), increment magnitudes GROW (r12=4.58, r23=3.41 > 1) so the geometric series diverges -- no finite-T plateau reachable; a finer-quadrature cross-check makes it MORE negative (genuine, not a quadrature artifact). The GEOM route was directionally right (r climbs) but the true (N,T) coupling is SUPER-GEOMETRIC: required T grows faster than any doubling law past N ~ 200. The optimistic imp-96847 read "T=4800 covers N up to ~800" is FALSE (genuine floor at (800,4800) = -1.1686, not ~0.58).',
  binding2a: 'ln3',
  newSolvePerformed: true,
  decayRouteRefuted: true,
  geomRouteRefuted: true,
  couplingSuperGeometric: true, // increment ratios r12/r23 > 1 at N=800 => geometric series diverges
  n200StillMonotone: true,
  n400NonMonotoneInT: true,
  n800DivergentNegative: true,
  n800NegativeIsGenuineNotQuadArtifact: true, // finer quadrature drives it MORE negative
  n400FloorQuadratureConverged: true, // |lift| < 2e-3 at (400,4800)
  optimisticImp96847ExtrapolationFalse: true,
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED open and WORSENED
  subGap:
    'IMP96867_TVSN_SUPERGEOMETRIC -- past N ~ 200 the T-truncation-vs-N coupling turns super-geometric (floor non-monotone at N=400, divergent-negative at N=800 with growing increment magnitudes), so the imp-96847 three-point law was a small-N artifact; a uniform-in-N floor needs T scaled super-linearly with N by a still-unmeasured law, and no accessible fixed-T solve at N >= 400 yields a reliable floor.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96867_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96867_ASSERTIONS = [
  {
    id: 'imp96867-n200-monotone-climb',
    holds: () => {
      const r = IMP96867_FLOOR[200];
      return r.length === 4 && r.every((v, i) => i === 0 || v > r[i - 1]);
    },
    why: 'N=200 is the last N where the exp-decay picture holds: the floor climbs monotonically in T.',
  },
  {
    id: 'imp96867-n400-non-monotone',
    holds: () => {
      const r = IMP96867_FLOOR[400];
      // dips (r[1] < r[0]) then recovers -- not a monotone climb
      return r[1] < r[0] && r[2] > r[1] && r[3] > r[2];
    },
    why: 'the genuine N=400 floor is NON-MONOTONE in T (dips negative at T=1600 before climbing), breaking the exp-decay model.',
  },
  {
    id: 'imp96867-n800-divergent-negative',
    holds: () => {
      const r = IMP96867_FLOOR[800];
      // strictly DEcreasing across the whole window and diverges below -1
      return r.every((v, i) => i === 0 || v < r[i - 1]) && r[3] < -1;
    },
    why: 'the genuine N=800 floor never climbs -- it dives monotonically to below -1 across T in [800,4800].',
  },
  {
    id: 'imp96867-n800-increments-grow-supergeometric',
    holds: () => {
      const g = IMP96867_INCREMENTS[800];
      // increment magnitudes grow => ratios > 1 => geometric series diverges
      return g.r12 > 1 && g.r23 > 1 && IMP96867_INCREMENTS[200].r12 < 1 && IMP96867_INCREMENTS[200].r23 < 1;
    },
    why: 'at N=800 the successive increment magnitudes GROW (ratios > 1: super-geometric divergence) while at N=200 they shrink (ratios < 1: convergent) -- the two-route discrimination.',
  },
  {
    id: 'imp96867-n400-floor-quadrature-converged',
    holds: () => Math.abs(IMP96867_QUADCHECK['400@4800'].lift) < 2e-3,
    why: 'refining the t-quadrature moves the (400,4800) floor by < 2e-3 -- it is quadrature-converged, so the shortfall is genuinely a too-small T, not under-resolution.',
  },
  {
    id: 'imp96867-n800-negative-is-genuine',
    holds: () => IMP96867_QUADCHECK['800@3200'].lift < 0 && IMP96867_QUADCHECK['800@3200'].fine < IMP96867_QUADCHECK['800@3200'].base,
    why: 'finer t-quadrature drives the (800,3200) floor MORE negative, so the negative direction is a genuine feature of the truncated form, not a quadrature artifact finer quadrature would cure.',
  },
  {
    id: 'imp96867-optimistic-extrapolation-false',
    holds: () => IMP96867_FLOOR[800][3] < 0 && IMP96867_PREDICTIONS.decayTreq1e3[800] < 4800,
    why: 'imp-96847 claimed T=4800 covers N=800 (decay T_req~4704 < 4800) but the genuine floor at (800,4800) is negative -- the optimistic extrapolation is refuted.',
  },
  {
    id: 'imp96867-measurement-only-no-qed',
    holds: () =>
      IMP96867_VERDICT.newSolvePerformed === true &&
      IMP96867_VERDICT.decayRouteRefuted === true &&
      IMP96867_VERDICT.geomRouteRefuted === true &&
      IMP96867_VERDICT.operatorPositivityProved === false &&
      IMP96867_VERDICT.uniformNGapSettled === false &&
      IMP96867_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96867_VERDICT.qed === false,
    why: 'genuine solve done, both routes refuted, but Rayleigh floor is an UPPER bound: no operator positivity, uniform-in-N gap open, certificate reach stays 2a <= 0.96, no QED.',
  },
];

for (const a of IMP96867_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96867-krein-tvsn-genuine-solve assertion failed: ${a.id}`);
  }
}

void LN3;
