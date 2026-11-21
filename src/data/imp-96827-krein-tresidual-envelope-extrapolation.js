/**
 * @fileoverview imp-96827 -- MEASUREMENT / EXTRAPOLATION: model the t-truncation residual of the
 * imp-96806 2a=ln3 Krein Rayleigh floor lambda_min(T_a[sigma_2]) as a decaying-in-T sequence, extrapolate
 * the T->infinity limit of the floor, and report an upper envelope on the residual beyond T=4800 so the
 * plateau value carries an EXPLICIT +/- tolerance instead of the unquantified ~1e-3 left by imp-96806.
 *
 * PREMISE (from the ticket). imp-96806 F1 recorded the N=100 floor climbing 0.533846 (T=800) ->
 * 0.570764 (T=1600) -> 0.578956 (T=3200) -> 0.579988 (T=4800), with the T=3200->4800 increment shrunk
 * to +1.03e-3 (IMP96806_T3200_T4800_INCREMENT). The plateau ~0.579 was thus pinned only to ~1e-3: the
 * residual beyond T=4800 was never bounded. This leaf fits the per-step t-truncation increment as a
 * decaying sequence and turns the ~1e-3 into a stated tolerance. Driver: tmp/imp-96827-tresidual.py +
 * tmp/imp-96827-allN.py (/tmp/rhvenv, scipy 1.18 curve_fit). Every literal below is a verbatim copy from
 * the run.
 *
 * METHOD (measurement / extrapolation only). The floor climbs monotonically OFF its under-resolved
 * T=800 value toward the t-converged plateau; the per-step increment is the t-truncation residual being
 * paid down. Two credible decay models on the T in {800,1600,3200,4800} ladder:
 *   (GEOM) geometric-per-doubling: the two clean doubling increments d1=f(1600)-f(800),
 *          d2=f(3200)-f(1600) give a ratio r = d2/d1; assuming the increment decays at least
 *          geometrically with ratio r per doubling, the tail sum of all further doublings from T=3200 is
 *          d2*r/(1-r), a CONSERVATIVE upper envelope on the remaining climb (rigorous-style, not proven).
 *   (EXP)  exponential f(T) = L - A*exp(-T/tau) fit to all four points (tighter: N=100 rms 2.5e-4 vs the
 *          degenerate power-law f=L-A*T^-p which returns p~45, an ill-conditioned step-fit and is
 *          discarded). The exponential limit L sits AT or just below f(4800), i.e. the floor is already
 *          t-converged to within the fit noise.
 *
 * FINDINGS (measured).
 *   1. THE t-TRUNCATION RESIDUAL BEYOND T=4800 IS BOUNDED, AND SMALL, AT EVERY TESTED N. The conservative
 *      geometric-per-doubling upper envelope on the residual (L_geom - f(4800)) is 7.05e-5 (N=52),
 *      3.21e-4 (N=76), 1.30e-3 (N=100). The exponential fit is even tighter: its limit is AT or below
 *      f(4800) (residual -4.9e-5/-1.6e-4/-3.2e-4), i.e. the floor at T=4800 has essentially converged
 *      within the ~1e-4..3e-4 fit noise. So the two credible models bracket the plateau in a narrow band.
 *   2. THE BINDING N=100 PLATEAU CARRIES AN EXPLICIT TOLERANCE. Enclosure [L_exp, L_geom] =
 *      [0.579666, 0.581292], i.e. plateau = 0.580479 +/- 8.13e-4 (conservative), replacing the imp-96806
 *      unquantified ~1e-3. The residual beyond T=4800 is at most +1.30e-3 (geometric envelope) and likely
 *      ~3e-4 or less (exponential fit). The plateau stays firmly positive: its lower end 0.579666 > 0.
 *   3. THE RESIDUAL GROWS WITH N VIA THE (N,T) JOINT-RESOLUTION COUPLING. The per-doubling ratio r=d2/d1
 *      grows 0.152784 (N=52) -> 0.172951 (N=76) -> 0.221897 (N=100), so the residual envelope grows
 *      7.05e-5 -> 3.21e-4 -> 1.30e-3: higher-N Galerkin modes probe finer t-structure that a fixed T
 *      under-resolves (same coupling imp-96807 read off the plateau gap), so a T-converged floor at
 *      N >> 100 needs T scaled UP with N. Even so the N=100 (largest-residual) envelope keeps the plateau
 *      in [0.5797, 0.5813], well clear of zero.
 *
 * VERDICT. The imp-96806 unquantified ~1e-3 is converted to an explicit tolerance: at the binding N=100
 * rung the 2a=ln3 t-converged Krein floor is 0.5805 +/- 0.0008 (conservative geometric-per-doubling
 * envelope; residual beyond T=4800 <= 1.30e-3, and the tighter exponential fit puts it at ~3e-4 or less),
 * and the plateau enclosure [0.5797, 0.5813] stays firmly positive at every tested N. The residual grows
 * with N (r = d2/d1 grows 0.153 -> 0.222), so N >> 100 certification needs T scaled with N -- the
 * IMP96807_TCONV_LADDER_LOWER_ENVELOPE sub-gap. Measurement / extrapolation only: the geometric envelope
 * is a rigorous-STYLE modeling bound (increments decay at least geometrically), NOT a proof; the Rayleigh
 * floor stays an UPPER bound on the true lambda_min; establishes NO operator positivity; the uniform-in-N
 * gap IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; interval-rigorous reach stays 2a <= 0.96; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (source T-sweep IMP96806_TSWEEP_LN3; unquantified ~1e-3)
 * @see imp-96807-krein-floor-decrement-decay-extrapolation.js ((N,T) coupling; IMP96807_TCONV_LADDER_LOWER_ENVELOPE)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (condB=1 Gegenbauer basis; t-converged estimate ~0.579)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// t-truncation ladder (verbatim from imp-96806 IMP96806_TS)
export const IMP96827_TS = Object.freeze([800, 1600, 3200, 4800]);
export const IMP96827_NS = Object.freeze([52, 76, 100]);

// floor lambda_min(T_a[sigma_2]) at 2a=ln3 vs (N,T) (verbatim from imp-96806 IMP96806_TSWEEP_LN3)
export const IMP96827_FLOOR = Object.freeze({
  52: Object.freeze([0.577015, 0.584110, 0.585194, 0.585319]),
  76: Object.freeze([0.557245, 0.577719, 0.581260, 0.581679]),
  100: Object.freeze([0.533846, 0.570764, 0.578956, 0.579988]),
});

// per-N residual model: geometric-per-doubling upper envelope + exponential best-fit limit
// (verbatim from tmp/imp-96827-allN.py). r = d2/d1 (doubling-increment ratio); tailFromT3200 = d2*r/(1-r);
// LGeom = f(3200)+tailFromT3200; residualBeyondT4800Geom = LGeom - f(4800).
export const IMP96827_MODEL = Object.freeze({
  52: Object.freeze({
    r: 0.152784, tailFromT3200: 1.954843e-4,
    LGeom: 0.585389, LExp: 0.585270, tauExp: 408.16, rmsExp: 3.62e-5,
    residualBeyondT4800Geom: 7.048428e-5, residualBeyondT4800Exp: -4.936334e-5,
  }),
  76: Object.freeze({
    r: 0.172951, tailFromT3200: 7.404879e-4,
    LGeom: 0.582000, LExp: 0.581523, tauExp: 432.37, rmsExp: 1.16e-4,
    residualBeyondT4800Geom: 3.214879e-4, residualBeyondT4800Exp: -1.557903e-4,
  }),
  100: Object.freeze({
    r: 0.221897, tailFromT3200: 2.336172e-3,
    LGeom: 0.581292, LExp: 0.579666, tauExp: 489.64, rmsExp: 2.50e-4,
    residualBeyondT4800Geom: 1.304172e-3, residualBeyondT4800Exp: -3.218568e-4,
  }),
});

// the binding N=100 rung: explicit tolerance replacing the imp-96806 unquantified ~1e-3
export const IMP96827_N100_ENCLOSURE = Object.freeze({
  LExp: 0.579666, // exponential-fit limit (lower end)
  floorT4800: 0.579988, // measured floor at T=4800
  LGeom: 0.581292, // geometric-per-doubling upper envelope (upper end)
  center: 0.580479, // (LExp + LGeom)/2
  halfWidth: 8.13e-4, // (LGeom - LExp)/2 -- the explicit +/- tolerance
  residualBeyondT4800UpperEnvelope: 1.304172e-3, // conservative (geometric)
  firmlyPositive: true, // lower end 0.579666 > 0
});

export const IMP96827_VERDICT = Object.freeze({
  ticket: 'imp-96827',
  question:
    'can the t-truncation residual of the imp-96806 2a=ln3 Krein floor be modeled as a decaying-in-T sequence to bound the residual beyond T=4800 and give the plateau an explicit +/- tolerance instead of the unquantified ~1e-3?',
  answer:
    'yes: the per-step increment decays (geometric-per-doubling ratio r=d2/d1), giving a conservative upper envelope on the residual beyond T=4800 of 7.0e-5 (N=52), 3.2e-4 (N=76), 1.30e-3 (N=100); the tighter exponential fit (rms ~1e-4..3e-4) puts the limit at or just below f(4800), i.e. essentially t-converged. At the binding N=100 rung the plateau is 0.5805 +/- 0.0008 (enclosure [0.579666, 0.581292]), firmly positive. The residual grows with N because r grows (0.153->0.222), the (N,T) joint-resolution coupling, so N >> 100 needs T scaled with N.',
  binding2a: 'ln3',
  n100PlateauCenter: 0.580479,
  n100PlateauHalfWidth: 8.13e-4, // explicit tolerance replacing imp-96806 ~1e-3
  n100ResidualBeyondT4800UpperEnvelope: 1.304172e-3,
  residualGrowsWithN: true, // r = d2/d1 grows 0.152784 -> 0.221897 across N=52,76,100
  plateauFirmlyPositiveAllN: true, // lower ends 0.585270 / 0.581523 / 0.579666 all > 0
  powerLawFitDiscarded: true, // f=L-A*T^-p degenerates (p~45, ill-conditioned step-fit)
  envelopeIsRigorousStyleNotProof: true, // assumes increments decay at least geometrically
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  subGap:
    'IMP96827_TRESIDUAL_GROWS_WITH_N -- the t-residual envelope grows with N (r=d2/d1: 0.153->0.222), so a T-converged floor at N >> 100 needs T scaled with N (matching IMP96807_TCONV_LADDER_LOWER_ENVELOPE); this leaf bounds the residual only over the tested reach N<=100.',
  extrapolatedLimitBaked: false, // reported as an enclosure, not baked as the true limit
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96827_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96827_ASSERTIONS = [
  {
    id: 'imp96827-floor-mirrors-imp96806-sweep',
    holds: () =>
      IMP96827_NS.every((N) => {
        const row = IMP96827_FLOOR[N];
        // monotone climb in T off the under-resolved T=800 value up to T=4800
        return row.length === 4 && row.every((v, i) => i === 0 || v > row[i - 1]);
      }),
    why: 'the baked 2a=ln3 floor must reproduce the imp-96806 T-sweep: monotone climb in T at every N (t-truncation being paid down).',
  },
  {
    id: 'imp96827-geometric-envelope-matches-model',
    holds: () =>
      IMP96827_NS.every((N) => {
        const row = IMP96827_FLOOR[N];
        const m = IMP96827_MODEL[N];
        const d1 = row[1] - row[0];
        const d2 = row[2] - row[1];
        const r = d2 / d1;
        const tail = (d2 * r) / (1 - r);
        const LGeom = row[2] + tail;
        const residual = LGeom - row[3];
        return (
          Math.abs(r - m.r) < 1e-5 &&
          Math.abs(LGeom - m.LGeom) < 1e-5 &&
          Math.abs(residual - m.residualBeyondT4800Geom) < 5e-6
        );
      }),
    why: 'the geometric-per-doubling ratio r=d2/d1, the extrapolated limit LGeom, and the residual-beyond-T4800 envelope must match the successive differences of the baked floor at every N.',
  },
  {
    id: 'imp96827-residual-envelope-small-and-grows-with-N',
    holds: () => {
      const g52 = IMP96827_MODEL[52].residualBeyondT4800Geom;
      const g76 = IMP96827_MODEL[76].residualBeyondT4800Geom;
      const g100 = IMP96827_MODEL[100].residualBeyondT4800Geom;
      // small (< 2e-3 even at the worst N=100) and monotone-growing with N
      return g52 > 0 && g52 < g76 && g76 < g100 && g100 < 2e-3 &&
        IMP96827_MODEL[52].r < IMP96827_MODEL[76].r &&
        IMP96827_MODEL[76].r < IMP96827_MODEL[100].r;
    },
    why: 'the conservative residual envelope must be small (< 2e-3) yet grow monotonically with N, mirroring the growing per-doubling ratio r=d2/d1 -- the (N,T) joint-resolution coupling.',
  },
  {
    id: 'imp96827-n100-enclosure-brackets-floor-and-is-positive',
    holds: () => {
      const e = IMP96827_N100_ENCLOSURE;
      return (
        e.LExp < e.floorT4800 && e.floorT4800 < e.LGeom && // T=4800 floor sits inside the enclosure
        Math.abs(e.center - (e.LExp + e.LGeom) / 2) < 1e-6 &&
        Math.abs(e.halfWidth - (e.LGeom - e.LExp) / 2) < 1e-5 &&
        e.halfWidth < 1e-3 && // explicit tolerance tighter than the imp-96806 unquantified ~1e-3
        e.firmlyPositive === true && e.LExp > 0
      );
    },
    why: 'the N=100 plateau enclosure [LExp, LGeom] must bracket the measured T=4800 floor, give a half-width < 1e-3 (an explicit tolerance), and keep the lower end firmly positive.',
  },
  {
    id: 'imp96827-measurement-only-no-qed',
    holds: () =>
      IMP96827_VERDICT.operatorPositivityProved === false &&
      IMP96827_VERDICT.uniformNGapSettled === false &&
      IMP96827_VERDICT.extrapolatedLimitBaked === false &&
      IMP96827_VERDICT.envelopeIsRigorousStyleNotProof === true &&
      IMP96827_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96827_VERDICT.qed === false,
    why: 'extrapolation only: the envelope is rigorous-style not a proof, no operator positivity, the uniform-in-N gap stays open, no limit is baked, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96827_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96827-krein-tresidual-envelope-extrapolation assertion failed: ${a.id}`);
  }
}

void LN3;
