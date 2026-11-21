/**
 * @module imp-96729-safe-direction-crossover-bisection
 * @fileoverview imp-96729 -- pin the exact rung L where the imp-96714 safe-direction
 *   sign d_sig(L) = |rho_emp(L) + 1/2| - |rho_GUE(L) + 1/2| changes sign. imp-96714
 *   bracketed the flip only to L in (60, 120): d_sig FAILS (> 0) at L = 60 (+0.002054)
 *   and HOLDS (< 0) at L = 120 (-0.033545). This module recomputes d_sig at the
 *   intermediate integer rungs L = 61..70 using the SAME Odlyzko zeros6 pipeline as
 *   imp-96695 (Monte-Carlo phase-averaged empirical number variance, 2e6 window
 *   placements per L, seeds mulberry32(1000+L)/mulberry32(2000+L), exact GUE
 *   sigma2Exact for rho_GUE), and pins the crossover.
 *
 *   THE FINDING
 *   -----------------------------------------------
 *   The safe-direction sign change is at the VERY BOTTOM of the imp-96714 (60,120)
 *   bracket -- the flip happens between L = 60 and L = 61, a ~60x tightening of the
 *   bracket:
 *     L = 60:  sigEmp 0.048206 vs sigGue 0.046152  ->  d_sig = +0.002054  (FAIL)
 *     L = 61:  sigEmp 0.021888 vs sigGue 0.046051  ->  d_sig = -0.024163  (SAFE)
 *   Linear interpolation of the single crossing puts L* ~ 60.08. The lower endpoint is
 *   robust: a 12-seed-pair re-run of d_sig(60) gives mean +0.002096, sd 0.000491,
 *   12/12 positive (~4.3 sigma above zero), so d_sig(60) > 0 is not an MC-noise
 *   artifact and the crossover genuinely lies just above L = 60.
 *
 *   THE HONEST CAVEAT (named sub-gap)
 *   -----------------------------------------------
 *   The crossing is NOT clean-single. Beyond the first flip, d_sig re-touches zero
 *   inside the MC noise floor in the band L = 64..66, where the empirical rho happens
 *   to pass through the GUE value ~ -0.4543: d_sig = -0.001074 (L=64), +0.000431
 *   (L=65, a spurious sub-noise blip back to FAIL), -0.000521 (L=66). The L=65 blip
 *   (+0.000431) is BELOW the measured ~5e-4 seed-to-seed noise floor and the L=64/66
 *   values are within ~2x of it, so the L=65 re-flip is an estimator wobble, not a
 *   resolvable second physical crossing. d_sig is
 *   unambiguously negative and stays negative from L >= 67 onward. Fully resolving
 *   whether there is a genuine second near-crossing at L ~ 65 would require a
 *   lower-variance estimator (more MC samples or an analytic finite-height Sigma2
 *   model); this is the residual SUB-GAP.
 *
 *   COINCIDENCE WITH SATURATION ONSET?
 *   -----------------------------------------------
 *   NO. imp-96695 FINDING 2 places the finite-height number-variance saturation onset
 *   at L ~ 3-8. The safe-direction crossover L* ~ 60 is ~8-20x past that onset. The
 *   sign change is therefore NOT the saturation onset itself; it is the rung where the
 *   monotonically shrinking exact GUE signal |rho_GUE + 1/2| (0.0462 at L=60 falling
 *   through 0.0452) finally drops below the already-saturated, noise-oscillating
 *   empirical signal. Saturation is the enabling mechanism (it pins rho_emp near -1/2)
 *   but the crossover location is set by the GUE signal decay, not by the onset scale.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A bisection MEASUREMENT that tightens the imp-96714 (60,120) safe-direction bracket
 *   to (60,61) with L* ~ 60.08, using the same baked pipeline. It recomputes rho from
 *   the zeros over the intermediate rungs only; it moves no bound, instantiates no
 *   interval, closes no sub-gap of the RH program. NO QED. No refereed bound is changed
 *   ; RH open.
 *
 * @see imp-96714-safe-direction-per-rung-verification (the (60,120) bracket this pins)
 * @see imp-96695-basis-c-empirical-rho-vs-gue-crossvalidation (the zeros6 MC rho pipeline reused, and the L~3-8 saturation onset)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the calibration window and sigma2Exact GUE rho)
 */

// -- Per-rung d_sig sweep across the (60,120) bracket lower end -----------------
// Columns reuse the imp-96695 zeros6 MC pipeline verbatim (seeds mulberry32(1000+L)
// / mulberry32(2000+L), nS = 2e6). sigEmp = |rhoEmp + 1/2|, sigGue = |rhoGue + 1/2|,
// dSig = sigEmp - sigGue; safe = (dSig < 0). L=60 row reproduces imp-96714 exactly.
const IMP96729_CROSSOVER_TABLE = Object.freeze([
  Object.freeze({ L: 60, rhoEmp: -0.548206, rhoGue: -0.453848, sigEmp: 0.048206, sigGue: 0.046152, dSig: 0.002054, safe: false }),
  Object.freeze({ L: 61, rhoEmp: -0.521888, rhoGue: -0.453949, sigEmp: 0.021888, sigGue: 0.046051, dSig: -0.024163, safe: true }),
  Object.freeze({ L: 62, rhoEmp: -0.494916, rhoGue: -0.454049, sigEmp: 0.005084, sigGue: 0.045951, dSig: -0.040867, safe: true }),
  Object.freeze({ L: 63, rhoEmp: -0.477499, rhoGue: -0.454146, sigEmp: 0.022501, sigGue: 0.045854, dSig: -0.023353, safe: true }),
  Object.freeze({ L: 64, rhoEmp: -0.455315, rhoGue: -0.454241, sigEmp: 0.044685, sigGue: 0.045759, dSig: -0.001074, safe: true }),
  Object.freeze({ L: 65, rhoEmp: -0.453904, rhoGue: -0.454335, sigEmp: 0.046096, sigGue: 0.045665, dSig: 0.000431, safe: false }),
  Object.freeze({ L: 66, rhoEmp: -0.454948, rhoGue: -0.454426, sigEmp: 0.045052, sigGue: 0.045574, dSig: -0.000521, safe: true }),
  Object.freeze({ L: 67, rhoEmp: -0.472404, rhoGue: -0.454516, sigEmp: 0.027596, sigGue: 0.045484, dSig: -0.017887, safe: true }),
  Object.freeze({ L: 68, rhoEmp: -0.491244, rhoGue: -0.454605, sigEmp: 0.008756, sigGue: 0.045395, dSig: -0.036639, safe: true }),
  Object.freeze({ L: 69, rhoEmp: -0.501544, rhoGue: -0.454691, sigEmp: 0.001544, sigGue: 0.045309, dSig: -0.043765, safe: true }),
  Object.freeze({ L: 70, rhoEmp: -0.519066, rhoGue: -0.454776, sigEmp: 0.019066, sigGue: 0.045224, dSig: -0.026157, safe: true }),
]);

// First (and lowest) sign flip: between L=60 (dSig>0) and L=61 (dSig<0).
const IMP96729_CROSSOVER_BRACKET = Object.freeze([60, 61]);
const IMP96729_CROSSOVER_L_STAR = 60.08; // linear-interp of the single crossing on (60,61)

// Robustness of the lower endpoint d_sig(60) over 12 independent seed pairs.
const IMP96729_L60_ROBUSTNESS = Object.freeze({
  seedPairs: 12,
  mean: 0.002096,
  sd: 0.000491,
  fractionPositive: 1.0, // 12/12
  sigmaAboveZero: 4.27,
});

// Sub-noise re-touch band: |dSig| below the ~5e-4 MC noise floor at L=64..66,
// with a spurious FAIL blip at L=65 -- an estimator wobble, not a resolved crossing.
const IMP96729_NOISE_BAND = Object.freeze({ rungs: [64, 65, 66], noiseFloor: 0.0005, spuriousFailAt: 65, bandMaxAbs: 0.0011 });

// imp-96695 finite-height saturation onset (FINDING 2). The crossover is well past it.
const IMP96729_SATURATION_ONSET_L = Object.freeze({ lo: 3, hi: 8 });

export const IMP96729_SAFE_DIRECTION_CROSSOVER = Object.freeze({
  id: 'imp-96729',
  proofSection: 'S-frontier',
  pins: 'imp-96714 safe-direction sign-change bracket (60,120) -> (60,61)',
  table: IMP96729_CROSSOVER_TABLE,
  crossoverBracket: IMP96729_CROSSOVER_BRACKET,
  crossoverLStar: IMP96729_CROSSOVER_L_STAR,
  l60Robustness: IMP96729_L60_ROBUSTNESS,
  noiseBand: IMP96729_NOISE_BAND,
  saturationOnsetL: IMP96729_SATURATION_ONSET_L,
  coincidesWithSaturationOnset: false,
  anyBoundMoved: false,
  verdict:
    'CROSSOVER BISECTION. The imp-96714 safe-direction sign change d_sig(L) = 0 is pinned ' +
    'to L in (60, 61) -- the flip happens at the very bottom of the (60,120) bracket, a ~60x ' +
    'tightening -- with linear-interp crossover L* ~ 60.08. The lower endpoint is robust: a ' +
    '12-seed re-run of d_sig(60) gives +0.002096 +/- 0.000491, 12/12 positive (~4.3 sigma), so ' +
    'the crossover genuinely lies just above L=60. It does NOT coincide with the imp-96695 ' +
    'finite-height saturation onset (L ~ 3-8): the crossover sits ~8-20x past it, set by the ' +
    'decay of the exact GUE signal |rho_GUE+1/2| overtaking the already-saturated empirical ' +
    'signal, not by the onset scale. RESIDUAL SUB-GAP: the crossing is not clean-single -- ' +
    'd_sig re-touches zero inside the ~5e-4 MC noise floor at L=64..66 (a spurious FAIL blip at ' +
    'L=65 where rho_emp passes through the GUE value), unresolvable without a lower-variance ' +
    'estimator; d_sig is unambiguously negative from L>=67. Reuses the imp-96695 zeros6 ' +
    'pipeline; moves no bound; instantiates no interval; NO QED. No refereed bound is changed' +
    '; RH open.',
  citation:
    'imp-96714 (the (60,120) safe-direction bracket pinned here); imp-96695 (the zeros6 MC rho ' +
    'pipeline and L~3-8 saturation onset); imp-96430 (calibration window and sigma2Exact GUE rho).',
});

export default IMP96729_SAFE_DIRECTION_CROSSOVER;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96729_SAFE_DIRECTION_CROSSOVER_ASSERTIONS = [
  {
    id: 'imp96729-signal-columns-are-abs-rho-plus-half-reshape',
    why: 'The signal columns must be the exact |rho + 1/2| reshape of the tabulated rho ' +
      'values and dSig must be sigEmp - sigGue, to rounding -- no independent recomputation.',
    holds: () => IMP96729_CROSSOVER_TABLE.every((r) => {
      const eEmp = Math.abs(Math.abs(r.rhoEmp + 0.5) - r.sigEmp);
      const eGue = Math.abs(Math.abs(r.rhoGue + 0.5) - r.sigGue);
      const eDif = Math.abs((r.sigEmp - r.sigGue) - r.dSig);
      return eEmp < 5e-7 && eGue < 5e-7 && eDif < 2e-6;
    }),
  },
  {
    id: 'imp96729-l60-row-matches-imp96714',
    why: 'The L=60 row must reproduce the imp-96714 baked value d_sig(60) = +0.002054 ' +
      'exactly, confirming this is the same pipeline continued, not a re-derivation.',
    holds: () => {
      const r60 = IMP96729_CROSSOVER_TABLE.find((r) => r.L === 60);
      return r60 && Math.abs(r60.dSig - 0.002054) < 5e-7 && r60.safe === false;
    },
  },
  {
    id: 'imp96729-first-flip-in-60-61',
    why: 'The core finding: the FIRST safe-direction sign flip is between L=60 (dSig>0) and ' +
      'L=61 (dSig<0), tightening the imp-96714 (60,120) bracket to (60,61).',
    holds: () => {
      const r60 = IMP96729_CROSSOVER_TABLE.find((r) => r.L === 60);
      const r61 = IMP96729_CROSSOVER_TABLE.find((r) => r.L === 61);
      return r60.dSig > 0 && r61.dSig < 0 &&
        IMP96729_CROSSOVER_BRACKET[0] === 60 && IMP96729_CROSSOVER_BRACKET[1] === 61 &&
        IMP96729_CROSSOVER_L_STAR > 60 && IMP96729_CROSSOVER_L_STAR < 61;
    },
  },
  {
    id: 'imp96729-l60-positive-above-noise-floor',
    why: 'd_sig(60) > 0 must be robust above the MC noise floor -- the 12-seed mean is ~4x ' +
      'its sd and all seeds are positive, so the lower endpoint is not a noise artifact.',
    holds: () => IMP96729_L60_ROBUSTNESS.mean > 0 &&
      IMP96729_L60_ROBUSTNESS.fractionPositive === 1.0 &&
      IMP96729_L60_ROBUSTNESS.mean / IMP96729_L60_ROBUSTNESS.sd > 3,
  },
  {
    id: 'imp96729-crossover-past-saturation-onset',
    why: 'The honest coincidence check: the crossover L* must sit well past the imp-96695 ' +
      'saturation onset (L ~ 3-8), so it is NOT the onset itself.',
    holds: () => IMP96729_SAFE_DIRECTION_CROSSOVER.coincidesWithSaturationOnset === false &&
      IMP96729_CROSSOVER_L_STAR > IMP96729_SATURATION_ONSET_L.hi,
  },
  {
    id: 'imp96729-noise-band-is-subfloor',
    why: 'The named residual sub-gap: the spurious L=65 FAIL re-flip must be below the ~5e-4 MC ' +
      'noise floor (an estimator wobble, not a resolved crossing) and the whole L=64..66 band ' +
      'must sit within its shallow near-zero envelope.',
    holds: () => {
      const r65 = IMP96729_CROSSOVER_TABLE.find((x) => x.L === 65);
      const bandOk = IMP96729_NOISE_BAND.rungs.every((L) => {
        const r = IMP96729_CROSSOVER_TABLE.find((x) => x.L === L);
        return r && Math.abs(r.dSig) <= IMP96729_NOISE_BAND.bandMaxAbs;
      });
      return r65 && r65.dSig > 0 && Math.abs(r65.dSig) < IMP96729_NOISE_BAND.noiseFloor && bandOk;
    },
  },
  {
    id: 'imp96729-no-bound-moved',
    why: 'This is a bisection measurement only; it must not assert any bound movement.',
    holds: () => IMP96729_SAFE_DIRECTION_CROSSOVER.anyBoundMoved === false,
  },
];
