/**
 * @fileoverview imp-96807 -- MEASUREMENT / EXTRAPOLATION: fit the per-rung decrement law of the
 * imp-96772 fixed-T=800 Legendre-Galerkin floor lambda_min(T_a[sigma_2]) at 2a=ln3 (0.625397 at N=20
 * down to 0.533852 at N=100), extrapolate the N->infinity limit, and test whether the descent could
 * reach zero -- probing IMP96749_UNIFORM_N_GAP_UNSETTLED from the numerical side.
 *
 * PREMISE (from the ticket). imp-96772 FINDING 3 recorded the 2a=ln3 extended-precision floor
 * descending monotonically with "slow, non-accelerating decrements (~0.008/rung)" to 0.5339 at N=100
 * and called the limit "consistent with a positive N->infinity value but not proven." This leaf models
 * the per-rung decrement as a sequence, extrapolates the fixed-T floor limit, and quantifies a lower
 * envelope + the N at which a continued descent would first threaten zero. Driver:
 * tmp/imp-96807-fit.py + tmp/imp-96807-fit2.py (/tmp/rhvenv, scipy 1.18 curve_fit). Every literal
 * below is a verbatim copy from the run.
 *
 * KEY RESULT (and the honest reconciliation).
 *   A. THE FIXED-T=800 DECREMENT DOES NOT DECAY TO ZERO -- IT IS FLAT-TO-GROWING. The 10 per-rung
 *      decrements (dN=8) are 0.027256, 0.010074, 0.004645, then in the tail (N>=52) 0.006407, 0.006515,
 *      0.005911, 0.007343, 0.007898, 0.007399, 0.008097: after the N=20..44 Legendre transient the
 *      decrement is NOT decaying but flat-to-slightly-GROWING (tail linear-in-N slope +3.94e-5/unitN,
 *      decrement at N=100 ~0.008185 > 0.006407 at N=52). A geometric-to-asymptote fit d_k = dinf + b r^k
 *      returns a POSITIVE asymptote dinf = 0.006806/rung (r=0.127), i.e. the decrement settles to a
 *      positive constant, not zero.
 *   B. SO A LITERAL EXTRAPOLATION OF THE FIXED-T=800 LADDER CROSSES ZERO AT N ~ 620..730. With a per-rung
 *      decrement in the measured range 0.006806..0.008185 the fixed-T=800 floor (0.533852 at N=100)
 *      would reach zero after ~65..78 more rungs, i.e. N ~ 622 (growing-decrement) to ~728
 *      (geometric-asymptote). A power-law-with-limit fit f = L + A N^{-p} does NOT rescue a positive
 *      limit: it degenerates to L = -179, p = 2.8e-4 (a near-logarithmic descent, no positive floor).
 *   C. BUT THIS ZERO-CROSSING IS THE t-TRUNCATION ARTIFACT, NOT A SPECTRAL COLLAPSE. imp-96806 pinned
 *      the t-CONVERGED plateau at 2a=ln3 to ~0.579 (T=3200/4800), and its N-ladder at T=4800 is
 *      0.585319 (N=52) -> 0.581679 (N=76) -> 0.579988 (N=100) -- FLAT (~-2.7e-3 per 24-rung step), not
 *      descending. A physical operator floor cannot both plateau at ~0.579 (t-converged) and descend to
 *      zero (fixed-T=800), so the fixed-T=800 ladder is provably NOT tracking the true N->infinity
 *      operator floor. The gap plateau - fixedT800 WIDENS with N (0.001985 at N=52 -> 0.045148 at
 *      N=100), which is exactly the (N,T) joint-resolution coupling: larger-N Galerkin modes probe finer
 *      t-structure that a fixed T=800 under-resolves, spuriously lowering the Rayleigh floor. The
 *      N ~ 620..730 zero-crossing is a diagnostic of when T=800 becomes wholly inadequate, NOT evidence
 *      of a closing spectral gap.
 *
 * VERDICT. The ticket's premise -- fit a DECAYING decrement law to bound the fixed-T=800 limit from
 * below -- is confounded: at fixed T=800 the decrement is NOT decaying (settles to ~0.0068/rung), so the
 * fixed-T=800 ladder carries NO positive lower envelope and would literally cross zero near N ~ 620..730.
 * That descent is the t-truncation artifact already identified by imp-96768/imp-96806, not a spectral
 * collapse: the genuine lower envelope on the true (t-converged) floor is the imp-96806 T=4800 ladder,
 * flat at 0.580..0.585 with no threat to positivity. CONSEQUENCE: a lower bound on the N->infinity floor
 * must be read off a t-CONVERGED (T scaled with N) ladder, never the fixed-T=800 one; the fixed-T
 * decrement-decay law neither bounds the limit below nor threatens it. SUB-GAP
 * IMP96807_TCONV_LADDER_LOWER_ENVELOPE: extend the imp-96806 T-converged ladder to N >> 100 with T
 * scaled to hold the t-truncation gap fixed, and fit ITS decrement law, to place a numerical positive
 * lower envelope on the true floor. This does NOT settle IMP96749_UNIFORM_N_GAP_UNSETTLED either way.
 * Measurement/extrapolation only; the Rayleigh floor is an UPPER bound; establishes NO operator
 * positivity; interval-rigorous reach stays 2a <= 0.96; RH open; no refereed bound is changed;
 * NO QED.
 *
 * @see imp-96772-krein-lammin-double-double-recompute.js (fixed-T=800 ladder; FINDING 3, source data)
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (t-converged plateau ~0.579; N-flat T=4800 ladder)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (descent = t-truncation, condB=1 basis)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (SUB-GAP IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// fixed-T=800 2a=ln3 ladder (verbatim from imp-96772 IMP96772_LADDER_EXT)
export const IMP96807_NS = Object.freeze([20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100]);
export const IMP96807_FLOOR_FIXED_T800 = Object.freeze([
  0.625397, 0.598141, 0.588067, 0.583422, 0.577015, 0.570500, 0.564589, 0.557246, 0.549348, 0.541949, 0.533852,
]);

// per-rung decrements (dN=8), f[k] - f[k+1]; the initial N=20..44 values are the Legendre transient
export const IMP96807_DECREMENTS = Object.freeze([
  0.027256, 0.010074, 0.004645, 0.006407, 0.006515, 0.005911, 0.007343, 0.007898, 0.007399, 0.008097,
]);

// A -- decrement law: NOT decaying to zero in the tail
export const IMP96807_DECREMENT_LAW = Object.freeze({
  tailMeanDecrementPerRung: 0.007194, // mean of decrements at N>=52 (dN=8 rungs)
  tailLinearInNSlopePerUnitN: 3.94e-5, // decrement vs N, POSITIVE => flat-to-growing, not decaying
  decrementAtN100Extrap: 0.008185, // from the tail linear fit
  geometricAsymptoteDinfPerRung: 0.006806, // d_k = dinf + b r^k fit; dinf > 0 (r = 0.127307, b = 0.020492)
  decays_to_zero: false, // the fixed-T=800 decrement settles to a POSITIVE constant, not zero
});

// B -- literal extrapolation of the fixed-T=800 ladder crosses zero (an artifact, see C)
export const IMP96807_FIXED_T800_ZERO_CROSSING = Object.freeze({
  floorAtN100: 0.533852,
  N_zero_growingDecrement: 622, // per-rung decrement 0.008185
  N_zero_meanTailDecrement: 694, // per-rung decrement 0.007194
  N_zero_geometricAsymptote: 728, // per-rung decrement 0.006806
  N_zero_range: Object.freeze([620, 730]),
  powerLawWithLimitFits: false, // f=L+A N^-p degenerates to L=-179, p=2.8e-4 (no positive limit)
});

// C -- the honest reconciliation: t-CONVERGED ladder (imp-96806, T=4800) is FLAT and positive
export const IMP96807_TCONV_LADDER_T4800 = Object.freeze([
  { N: 52, floor: 0.585319 },
  { N: 76, floor: 0.581679 },
  { N: 100, floor: 0.579988 },
]);
export const IMP96807_PLATEAU = 0.579; // imp-96806 t-converged plateau at 2a=ln3

// gap (t-converged plateau) - (fixed-T=800 floor) WIDENS with N -> the descent is a t-truncation artifact
export const IMP96807_PLATEAU_GAP = Object.freeze({
  atN52: 0.001985, // 0.579 - 0.577015
  atN100: 0.045148, // 0.579 - 0.533852
  widensWithN: true,
});

export const IMP96807_VERDICT = Object.freeze({
  ticket: 'imp-96807',
  question:
    'does the imp-96772 fixed-T=800 2a=ln3 floor decrement law decay to a positive N->infinity limit, or could the descent reach zero?',
  answer:
    'at fixed T=800 the per-rung decrement does NOT decay -- it is flat-to-growing (tail slope +3.9e-5/unitN, geometric asymptote 0.0068/rung > 0), so a literal extrapolation of the fixed-T=800 ladder crosses zero at N ~ 620..730 and a power-law-with-limit fit gives no positive floor. But that zero-crossing is the t-truncation artifact: the t-converged plateau is ~0.579 (imp-96806) and its T=4800 N-ladder is FLAT (0.585/0.582/0.580 at N=52/76/100), so the fixed-T=800 ladder is provably not tracking the true operator floor; the gap below the plateau WIDENS with N. A lower envelope on the true limit must come from a t-converged ladder, not the fixed-T one.',
  fixedT800DecrementDecaysToZero: false,
  fixedT800LiteralZeroCrossingN: Object.freeze([620, 730]),
  zeroCrossingIsTTruncationArtifact: true,
  tconvPlateauLowerEnvelope: 0.579, // FLAT to N=100, no threat to positivity
  fixedT800BoundsTrueLimit: false,
  subGap:
    'IMP96807_TCONV_LADDER_LOWER_ENVELOPE -- extend the imp-96806 T-converged ladder to N >> 100 with T scaled to hold the t-truncation gap fixed, then fit ITS decrement law, to place a numerical positive lower envelope on the true floor.',
  uniformNGapSettled: false, // does NOT settle IMP96749_UNIFORM_N_GAP_UNSETTLED
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96807_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96807_ASSERTIONS = [
  {
    id: 'imp96807-decrements-match-fixedT800-ladder',
    holds: () => {
      const f = IMP96807_FLOOR_FIXED_T800;
      return IMP96807_DECREMENTS.every((d, i) => Math.abs(d - (f[i] - f[i + 1])) < 5e-6);
    },
    why: 'the baked per-rung decrements must equal the successive differences of the imp-96772 fixed-T=800 ladder.',
  },
  {
    id: 'imp96807-tail-decrement-not-decaying',
    holds: () =>
      IMP96807_DECREMENT_LAW.decays_to_zero === false &&
      IMP96807_DECREMENT_LAW.tailLinearInNSlopePerUnitN > 0 &&
      IMP96807_DECREMENT_LAW.geometricAsymptoteDinfPerRung > 0,
    why: 'the fixed-T=800 tail decrement is flat-to-growing (positive linear slope) and its geometric asymptote is positive -- it does NOT decay to zero.',
  },
  {
    id: 'imp96807-fixedT800-crosses-zero-in-range',
    holds: () => {
      const z = IMP96807_FIXED_T800_ZERO_CROSSING;
      return (
        z.N_zero_growingDecrement >= z.N_zero_range[0] &&
        z.N_zero_geometricAsymptote <= z.N_zero_range[1] &&
        z.powerLawWithLimitFits === false
      );
    },
    why: 'a literal extrapolation of the non-decaying fixed-T=800 decrement crosses zero within N ~ 620..730, and a power-law-with-limit fit gives no positive floor.',
  },
  {
    id: 'imp96807-tconv-ladder-flat-and-positive',
    holds: () => {
      const l = IMP96807_TCONV_LADDER_T4800;
      const positive = l.every((r) => r.floor > 0.57);
      const flat = Math.abs(l[0].floor - l[l.length - 1].floor) < 0.01; // ~5.3e-3 across N=52..100
      return positive && flat && IMP96807_PLATEAU > 0.5;
    },
    why: 'the imp-96806 t-converged T=4800 ladder stays > 0.57 and flat (< 0.01 spread over N=52..100) -- the genuine positive lower envelope, no threat to positivity.',
  },
  {
    id: 'imp96807-plateau-gap-widens-with-N',
    holds: () => {
      const g = IMP96807_PLATEAU_GAP;
      const gN52 = Math.abs(IMP96807_PLATEAU - IMP96807_FLOOR_FIXED_T800[4]); // N=52
      const gN100 = Math.abs(IMP96807_PLATEAU - IMP96807_FLOOR_FIXED_T800[10]); // N=100
      return (
        g.widensWithN === true &&
        gN100 > gN52 &&
        Math.abs(gN52 - g.atN52) < 1e-6 &&
        Math.abs(gN100 - g.atN100) < 1e-6
      );
    },
    why: 'the (plateau - fixed-T800) gap widens from ~0.002 at N=52 to ~0.045 at N=100 -- the descent is a t-truncation artifact, not a spectral collapse.',
  },
  {
    id: 'imp96807-measurement-only-no-qed',
    holds: () =>
      IMP96807_VERDICT.operatorPositivityProved === false &&
      IMP96807_VERDICT.uniformNGapSettled === false &&
      IMP96807_VERDICT.fixedT800BoundsTrueLimit === false &&
      IMP96807_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96807_VERDICT.qed === false,
    why: 'extrapolation only: no operator positivity, the uniform-in-N gap stays unsettled, the fixed-T ladder does not bound the true limit, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96807_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96807-krein-floor-decrement-decay-extrapolation assertion failed: ${a.id}`);
  }
}

void LN3;
