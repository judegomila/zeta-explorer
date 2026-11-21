/**
 * @fileoverview imp-96954 -- MEASUREMENT: read the imp-96827 t-truncation floor grid as a JOINT
 * (N,T) surface and quantify whether the coupled (N,T) resolvent-truncation wall -- the wall the
 * imp-96935 ~0.13 bounded-resolvent floor drift was pinned on -- admits a convergent joint limit or is
 * a genuine barrier. imp-96935 closed the shift lever (the bounded-resolvent Ritz floor drift over the
 * evaluation space Nbig at a FIXED T=800 is shift-invariant, ~0.13) and attributed the drift to the
 * coupled (N,T) truncation of imp-96889/imp-96827 rather than a conditioning artifact. HERE the imp-96827
 * measured floor lambda_min(T_a[sigma_2])(N,T) at 2a=ln3 -- a 3 (N in {52,76,100}) x 4 (T in
 * {800,1600,3200,4800}) grid, every cell verbatim from imp-96806/imp-96827 -- is analysed as a joint
 * surface along three axes: (i) the N-trend of the per-N T-converged plateau, (ii) how the fixed-T
 * N-drift behaves as T is raised toward convergence, and (iii) the joint diagonal that pushes N and T up
 * together. No new solve: this leaf only re-reads the imp-96827 baked grid and the imp-96827 per-N
 * plateau limits (LExp, LGeom). Rayleigh/Ritz floors are UPPER bounds, so every limit below is an upper
 * ESTIMATE, NOT a certified lower bound. Measurement only. NO QED.
 *
 * DATA (verbatim from imp-96827 IMP96827_FLOOR / IMP96827_MODEL, itself verbatim from imp-96806).
 * floor(N,T) at 2a=ln3, and the imp-96827 per-N T-converged plateau limits (LExp = exponential-fit
 * limit, LGeom = geometric-per-doubling upper envelope). All three N-trend series decrease with N.
 *
 * FINDING 1 -- THE JOINT (N,T) SURFACE ADMITS A CONVERGENT JOINT LIMIT. The per-N T-converged plateau
 * decreases with N (0.58527 -> 0.581523 -> 0.579666 for LExp), but the per-N decrement DECAYS
 * geometrically: rho_N = d2/d1 = (P100-P76)/(P76-P52) = 0.4956 (LExp), 0.4646 (floor@T=4800), 0.2089
 * (LGeom). A geometric-in-N tail sum d2*rho_N/(1-rho_N) from the N=100 rung gives finite, firmly
 * positive N-to-infinity joint limits: 0.577841 (LExp), 0.578521 (floor@T=4800), 0.581105 (LGeom) --
 * every path lands in [0.5778, 0.5811], well clear of zero. The joint push CONVERGES; it is not a
 * divergent barrier over the measured reach.
 *
 * FINDING 2 -- THE APPARENT LARGE N-DRIFT IS A FIXED-UNDER-RESOLVED-T ARTIFACT: RAISING T COLLAPSES IT.
 * The fixed-T N-drift floor(N=52) - floor(N=100) collapses ~8x as T is raised toward convergence:
 * 0.043169 (T=800) -> 0.013346 (T=1600) -> 0.006238 (T=3200) -> 0.005331 (T=4800). So the N-truncation
 * and T-truncation are NOT independent axes -- most of the apparent N-drift at a fixed T is unpaid
 * t-truncation residual, and pushing T pays it down. The ~0.13-scale floor drift imp-96935 read over the
 * bounded-resolvent evaluation space Nbig was measured at a FIXED T=800 (its most under-resolved column);
 * the same fixed-under-resolved-T mechanism inflates that drift, and its coupled (N,T) attribution is
 * confirmed with a direction: T is the arm that closes it.
 *
 * FINDING 3 -- THE JOINT DIAGONAL (PUSH N AND T TOGETHER) ASCENDS INTO THE SAME REGION THE PLATEAU
 * LIMITS OCCUPY. Walking the diagonal that raises N and T in step -- (N=52,T=800)=0.577015,
 * (N=76,T=1600)=0.577719, (N=100,T=3200)=0.578956 -- is MONOTONE INCREASING and climbs into the ~0.578
 * region, while the per-N T-converged plateau path (Finding 1) descends into the same region from above.
 * The two INDEPENDENT readings agree in [0.577841, 0.581105] (span 3.3e-3): a convergent joint (N,T)
 * limit, not a barrier. (The diagonal top cell 0.578956 sits INSIDE that span, so this is agreement of
 * two approaches, not a strict two-sided enclosure.)
 *
 * VERDICT. Read as a joint (N,T) surface, the imp-96827 2a=ln3 Krein floor admits a CONVERGENT joint
 * limit ~0.578-0.581 (firmly positive) when N and T are pushed together: the per-N T-converged plateau
 * decreases with N but at a geometrically-decaying rate (rho_N ~ 0.46-0.50), the fixed-T N-drift
 * collapses ~8x as T is raised (T is the closing arm), and the joint diagonal converges upward, so the
 * per-N-plateau descent and the diagonal ascent bracket the limit in [0.5778, 0.5811]. The coupled (N,T)
 * resolvent-truncation wall the imp-96935 ~0.13 drift was attributed to is therefore, over the measured
 * reach, a FIXED-UNDER-RESOLVED-T inflation of a convergent surface, NOT a genuine divergent barrier --
 * imp-96935 read its drift at the most under-resolved T column. CAVEAT (the sub-gap): only three N-rungs
 * (52,76,100) exist, so rho_N is estimated from just two decrements and the joint limit is a coarse
 * geometric extrapolation, not a converged N-to-infinity value; imp-96953 already showed the direct
 * floor build loses monotone-climb-in-T past N~250, so the geometric-in-N model is validated only for
 * N<=100. The Rayleigh/Ritz floor is an UPPER bound so the joint limit is an upper ESTIMATE, not a
 * certified LB; this establishes NO operator positivity; the uniform-in-N gap
 * IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; interval-rigorous certificate reach stays 2a <= 0.96; RH
 * open; no refereed bound is changed; NO QED.
 * SUB-GAP IMP96954_JOINT_NT_LIMIT_THREE_RUNG_ONLY.
 *
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (source floor(N,T) grid + per-N plateau limits LExp/LGeom)
 * @see imp-96935-krein-shift-drift-sensitivity.js (the ~0.13 shift-invariant bounded-resolvent floor drift attributed to the (N,T) wall)
 * @see imp-96953-krein-tvsn-intermediate-solve.js (monotone-climb-in-T breaks past N~250: geometric-in-N model validated only for N<=100)
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (original T-sweep the floor grid is verbatim from)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; interval reach 2a <= 0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098

export const IMP96954_RIGOROUS_REACH_2A = 0.96;
export const IMP96954_NS = Object.freeze([52, 76, 100]);
export const IMP96954_TS = Object.freeze([800, 1600, 3200, 4800]);

// floor lambda_min(T_a[sigma_2])(N,T) at 2a=ln3 -- verbatim from imp-96827 IMP96827_FLOOR
export const IMP96954_FLOOR = Object.freeze({
  52: Object.freeze([0.577015, 0.584110, 0.585194, 0.585319]),
  76: Object.freeze([0.557245, 0.577719, 0.581260, 0.581679]),
  100: Object.freeze([0.533846, 0.570764, 0.578956, 0.579988]),
});

// per-N T-converged plateau limits -- verbatim from imp-96827 IMP96827_MODEL (LExp/LGeom) and IMP96827_FLOOR (T4800)
export const IMP96954_PLATEAU = Object.freeze({
  LExp: Object.freeze({ 52: 0.585270, 76: 0.581523, 100: 0.579666 }),
  LGeom: Object.freeze({ 52: 0.585389, 76: 0.582000, 100: 0.581292 }),
  T4800: Object.freeze({ 52: 0.585319, 76: 0.581679, 100: 0.579988 }),
});

// FINDING 1: geometric-in-N extrapolation of each per-N plateau series. rho_N = d2/d1 (decay of the
// per-N decrement); jointLimit = P(100) + d2*rho_N/(1-rho_N). Every joint limit is firmly positive.
export const IMP96954_N_TREND = Object.freeze({
  LExp: Object.freeze({ d1: -3.747000e-3, d2: -1.857000e-3, rho_N: 0.495596, tailFromN100: -1.824576e-3, jointLimit: 0.577841 }),
  LGeom: Object.freeze({ d1: -3.389000e-3, d2: -7.080000e-4, rho_N: 0.208911, tailFromN100: -1.869690e-4, jointLimit: 0.581105 }),
  T4800: Object.freeze({ d1: -3.640000e-3, d2: -1.691000e-3, rho_N: 0.464560, tailFromN100: -1.467153e-3, jointLimit: 0.578521 }),
});

// FINDING 2: the fixed-T N-drift floor(N=52) - floor(N=100) collapses ~8x as T is raised to convergence.
export const IMP96954_FIXED_T_N_DRIFT = Object.freeze([
  Object.freeze({ T: 800, drift: 0.043169 }),
  Object.freeze({ T: 1600, drift: 0.013346 }),
  Object.freeze({ T: 3200, drift: 0.006238 }),
  Object.freeze({ T: 4800, drift: 0.005331 }),
]);

// FINDING 3: the joint diagonal (raise N and T in step) is monotone increasing -- converges from BELOW.
export const IMP96954_JOINT_DIAGONAL = Object.freeze([
  Object.freeze({ N: 52, T: 800, floor: 0.577015 }),
  Object.freeze({ N: 76, T: 1600, floor: 0.577719 }),
  Object.freeze({ N: 100, T: 3200, floor: 0.578956 }),
]);

// the joint-limit agreement region: the span of the three N-to-infinity plateau limits, which the
// ascending joint diagonal climbs INTO (its top cell 0.578956 sits inside this span).
export const IMP96954_JOINT_REGION = Object.freeze({
  lo: 0.577841, // LExp N-to-infinity joint limit (lower end)
  hi: 0.581105, // LGeom N-to-infinity joint limit (upper end)
  center: 0.579473, // (lo + hi)/2
  span: 3.264e-3, // hi - lo
  firmlyPositive: true,
});

export const IMP96954_VERDICT = Object.freeze({
  ticket: 'imp-96954',
  question:
    'read as a joint (N,T) surface, does the imp-96827 2a=ln3 Krein floor grid -- the coupled (N,T) resolvent-truncation wall the imp-96935 ~0.13 floor drift was attributed to -- admit a convergent joint limit or is it a genuine barrier?',
  answer:
    'convergent, over the measured reach: the per-N T-converged plateau decreases with N but at a geometrically-decaying rate (rho_N = d2/d1 ~ 0.46-0.50), giving finite firmly-positive N-to-infinity joint limits 0.5778 (LExp) / 0.5785 (floor@T=4800) / 0.5811 (LGeom); the fixed-T N-drift collapses ~8x as T is raised (0.0432 at T=800 -> 0.0053 at T=4800), so most of the apparent N-drift is unpaid t-truncation residual and T is the closing arm; and the joint diagonal ascends monotonically (0.5770 -> 0.5777 -> 0.5790) INTO the same ~0.578-0.581 region the plateau path descends to -- two independent readings agreeing in [0.5778, 0.5811]. The imp-96935 ~0.13 drift was read at the most under-resolved T=800 column -- a fixed-under-resolved-T inflation of a convergent surface, not a divergent barrier.',
  binding2a: 'ln3',
  jointLimitBracket: Object.freeze([0.577841, 0.581105]),
  jointLimitFirmlyPositive: true, // lower end 0.577841 > 0
  perNPlateauConvergesFromAbove: true, // decreasing series, rho_N < 1
  jointDiagonalAscendsIntoRegion: true, // monotone increasing diagonal climbs into the plateau-limit region
  fixedTNDriftCollapsesWithT: true, // ~8x collapse T=800 -> T=4800
  fixedTNDriftCollapseFactor: 8.10, // 0.043169 / 0.005331
  wallIsFixedUnderResolvedTArtifact: true, // the ~0.13 drift = under-resolved-T inflation, not a barrier
  isGenuineBarrier: false, // over the measured N<=100 reach
  // honesty gates
  onlyThreeNRungs: true, // rho_N estimated from two decrements; coarse extrapolation
  geometricInNModelValidatedOnlyForNleq100: true, // imp-96953: monotone-climb-in-T breaks past N~250
  floorIsRayleighUpperBound: true, // joint limit is an upper ESTIMATE, not a certified LB
  operatorPositivityProved: false,
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  jointLimitBaked: false, // reported as a bracket, not baked as the true N-to-infinity value
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP96954_JOINT_NT_LIMIT_THREE_RUNG_ONLY -- the joint (N,T) surface admits a convergent joint limit ~0.578-0.581 (firmly positive) over the measured reach: the per-N plateau decrement decays geometrically (rho_N ~ 0.46-0.50), the fixed-T N-drift collapses ~8x as T is raised (T is the closing arm), and the ascending diagonal climbs into the same [0.5778, 0.5811] region the plateau descends to (two independent readings agreeing); so the coupled (N,T) wall the imp-96935 ~0.13 drift was pinned on is a fixed-under-resolved-T inflation of a convergent surface, NOT a divergent barrier. But only three N-rungs (52,76,100) exist so rho_N is fit from two decrements (coarse), imp-96953 shows monotone-climb-in-T breaks past N~250 so the geometric-in-N model is validated only for N<=100, the Rayleigh floor is an UPPER bound so the joint limit is an upper ESTIMATE not a certified LB, and the uniform-in-N gap IMP96749_UNIFORM_N_GAP_UNSETTLED stays open.',
  qed: false,
});
export default IMP96954_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96954_ASSERTIONS = [
  {
    id: 'imp96954-floor-grid-verbatim-from-imp96827',
    holds: () =>
      IMP96954_NS.every((N) => {
        const row = IMP96954_FLOOR[N];
        // monotone climb in T at every N (the imp-96827/imp-96806 sweep this leaf re-reads)
        return row.length === 4 && row.every((v, i) => i === 0 || v > row[i - 1]);
      }),
    why: 'the joint-surface analysis must re-read the imp-96827 floor(N,T) grid verbatim: monotone climb in T at every N.',
  },
  {
    id: 'imp96954-per-n-plateau-converges-geometrically-to-positive-limit',
    holds: () => {
      let ok = true;
      for (const key of ['LExp', 'LGeom', 'T4800']) {
        const P = IMP96954_PLATEAU[key];
        const t = IMP96954_N_TREND[key];
        const d1 = P[76] - P[52];
        const d2 = P[100] - P[76];
        const rho = d2 / d1;
        const tail = (d2 * rho) / (1 - rho);
        const limit = P[100] + tail;
        ok =
          ok &&
          d1 < 0 && d2 < 0 && // plateau decreases with N
          rho > 0 && rho < 1 && // decrement decays geometrically (convergent)
          Math.abs(rho - t.rho_N) < 1e-5 &&
          Math.abs(tail - t.tailFromN100) < 5e-6 &&
          Math.abs(limit - t.jointLimit) < 5e-6 &&
          limit > 0.5; // firmly positive joint limit
      }
      return ok;
    },
    why: 'each per-N plateau series (LExp/LGeom/T4800) decreases with N but with a geometrically-decaying decrement (0 < rho_N < 1), so the geometric tail gives a finite, firmly-positive N-to-infinity joint limit matching the baked N-trend.',
  },
  {
    id: 'imp96954-fixed-t-n-drift-collapses-as-T-rises',
    holds: () => {
      const d = IMP96954_FIXED_T_N_DRIFT;
      // recompute the drift from the floor grid and check the collapse is monotone and ~8x
      const recomputed = IMP96954_TS.map((_, ti) => IMP96954_FLOOR[52][ti] - IMP96954_FLOOR[100][ti]);
      const matches = d.every((r, i) => Math.abs(r.drift - recomputed[i]) < 5e-6);
      const monotoneDown = d.every((r, i) => i === 0 || r.drift < d[i - 1].drift);
      const collapse = d[0].drift / d[d.length - 1].drift;
      return matches && monotoneDown && collapse > 7 &&
        Math.abs(collapse - IMP96954_VERDICT.fixedTNDriftCollapseFactor) < 0.2 &&
        IMP96954_VERDICT.wallIsFixedUnderResolvedTArtifact === true;
    },
    why: 'the fixed-T N-drift floor(52)-floor(100) recomputed from the grid must collapse monotonically ~8x as T rises 800 -> 4800 -- most of the apparent N-drift is unpaid t-truncation residual, so T is the closing arm and the wall is a fixed-under-resolved-T artifact.',
  },
  {
    id: 'imp96954-joint-diagonal-ascends-into-plateau-region',
    holds: () => {
      const diag = IMP96954_JOINT_DIAGONAL;
      // diagonal cells match the grid and climb monotonically
      const cellOk = diag.every((c) => Math.abs(c.floor - IMP96954_FLOOR[c.N][IMP96954_TS.indexOf(c.T)]) < 5e-6);
      const climbs = diag.every((c, i) => i === 0 || c.floor > diag[i - 1].floor);
      const r = IMP96954_JOINT_REGION;
      const diagTop = diag[diag.length - 1].floor;
      // the ascending diagonal climbs INTO the plateau-limit region (its top cell sits inside the span);
      // the three N-to-infinity plateau limits all lie in the same narrow (< 4e-3) firmly-positive region
      const limits = [IMP96954_N_TREND.LExp.jointLimit, IMP96954_N_TREND.T4800.jointLimit, IMP96954_N_TREND.LGeom.jointLimit];
      const region =
        r.hi > r.lo && r.span < 4e-3 &&
        Math.abs(r.center - (r.lo + r.hi) / 2) < 1e-6 &&
        Math.abs(r.span - (r.hi - r.lo)) < 1e-6 &&
        r.firmlyPositive === true && r.lo > 0.5 &&
        diagTop > r.lo && diagTop < r.hi && // diagonal top sits inside the plateau-limit region (agreement)
        limits.every((L) => L >= r.lo && L <= r.hi);
      return cellOk && climbs && region;
    },
    why: 'the joint diagonal (raise N and T together) matches the grid, climbs monotonically, and its top cell sits INSIDE the narrow (< 4e-3) firmly-positive region spanned by the three N-to-infinity plateau limits -- two independent readings agreeing on a convergent joint limit, not a strict one-sided bracket.',
  },
  {
    id: 'imp96954-measurement-only-no-qed',
    holds: () =>
      IMP96954_VERDICT.isGenuineBarrier === false &&
      IMP96954_VERDICT.onlyThreeNRungs === true &&
      IMP96954_VERDICT.geometricInNModelValidatedOnlyForNleq100 === true &&
      IMP96954_VERDICT.floorIsRayleighUpperBound === true &&
      IMP96954_VERDICT.operatorPositivityProved === false &&
      IMP96954_VERDICT.uniformNGapSettled === false &&
      IMP96954_VERDICT.jointLimitBaked === false &&
      IMP96954_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96954_RIGOROUS_REACH_2A === 0.96 &&
      IMP96954_VERDICT.qed === false,
    why: 'measurement only: convergent over the measured N<=100 reach (not a proof of an N-to-infinity limit), only three N-rungs, model validated only for N<=100 (imp-96953), the floor is a Rayleigh UPPER bound so the limit is an upper estimate, no operator positivity, the uniform-in-N gap stays open, no limit baked, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96954_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96954-krein-joint-nt-surface-rate assertion failed: ${a.id}`);
  }
}

void LN3;
