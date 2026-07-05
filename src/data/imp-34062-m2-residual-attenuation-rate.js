/**
 * @module imp-34062-m2-residual-attenuation-rate
 *
 * imp-34062 (accuracy, frontier-direction): imp-34003 located the F4 = 1 crossing and the imp-33773
 * M2 sub-leading residual extremum at k_peak = 8.8210916 (N = 6.624e8), stating that BEYOND that
 * peak the residual "attenuates rather than amplifies" -- but never quantified HOW FAST. This module
 * tabulates the SAME inherited imp-33878/imp-34003 resid(k) surrogate for k in k_peak..k_peak+3,
 * fits the post-peak decay (exponential in k vs power in k), and reports the step over which the
 * residual halves from its peak resid(k_peak) = 0.0653366.
 *
 * THE SURROGATE (reuses the imp-33810/imp-33878/imp-34003 component model verbatim -- no fresh model)
 * ---------------------------------------------------------------------------------------------------
 *   resid(k) = pEcoll(k) * (1 - sigma_hi) - pSigma(k), window [10^k, 10^(k+1)] evaluated at the upper
 *   endpoint hi = 10^(k+1), with pSigma = -OLS slope of ln sigma vs ln N (4 pts/decade),
 *   pEcoll = the E_coll log-log exponent magnitude, sigma = E_coll/E_N, and the same inherited parts
 *   (E_trunc = 3.06e-5 fixed strip, E_coll = C_C sqrt(log T0 / N), E_flow = C_F (log T0 / T0) Gronwall,
 *   T0 = effectiveHeightForN(N)). This is the imp-34003 resid(k), continued past its k_peak apex.
 *
 * THE FINDING (accuracy / measurement only)
 * -----------------------------------------
 *   (A1) THE RESIDUAL ATTENUATES MONOTONICALLY PAST THE PEAK. From resid(k_peak) = 6.5337e-2, the
 *        surrogate falls monotonically over the next three decades to resid(k_peak+3) = 9.4343e-3 --
 *        a factor 6.93 drop (down to 14.44% of the peak), with no secondary hump: the imp-34003
 *        "attenuates rather than amplifies" claim holds across the whole k_peak..k_peak+3 span.
 *   (A2) THE RESIDUAL HALVES OVER dk_half = 1.646 DECADES. Bisecting resid(k_peak+dk) = resid(k_peak)/2
 *        puts the half-attenuation step at dk_half = 1.646 decades past the peak, i.e. the residual
 *        first reaches half its peak value at k = 10.467 (N_half = 2.93e10, ~44x the peak height
 *        N_peak = 6.624e8). This is the DIRECTLY-MEASURED half-life, independent of any fit form.
 *   (A3) NEITHER A SINGLE EXPONENTIAL NOR A SINGLE POWER LAW IS FAITHFUL -- THE DECAY ACCELERATES.
 *        Over the post-peak window an exponential ln resid = A - B(k - k_peak) fits marginally better
 *        (B = 0.7159 per decade, R^2 = 0.9716) than a power law ln resid = C + D ln k (D = -7.391,
 *        R^2 = 0.9582), so the exponential is the better one-parameter description. BUT the local
 *        decay exponent -d ln resid / dk is NOT constant: it RAMPS monotonically from ~0.276 per
 *        decade just past the peak (dk = 0.5) to ~1.019 per decade at dk = 3.0 -- the attenuation
 *        ACCELERATES with k. This is why the single-exponential half-step ln2/B = 0.968 decades
 *        under-reads the directly-measured dk_half = 1.646 (the decay is SLOW near the apex, where a
 *        broad quadratic maximum flattens resid'(k), and speeds up only in the tail). The honest
 *        reading is: monotone accelerating attenuation, half-life ~1.65 decades, not a clean
 *        constant-rate exponential.
 *
 * The punchline: past k_peak = 8.8211 the imp-33773 M2 residual attenuates monotonically and its
 * value halves over dk_half ~ 1.646 decades (N ~ 2.93e10), but the decay is NOT a single-rate
 * exponential -- the local decay exponent ramps from ~0.28 to ~1.02 per decade over the first three
 * decades, so the attenuation accelerates. An exponential fit (R^2 = 0.972) is the least-bad single
 * form, edging out a power law (R^2 = 0.958), but its constant-rate half-step (0.968) under-reads the
 * measured half-life because of the broad-apex slow start. SUB-GAP: the accelerating (super-
 * exponential-near-peak) decay is captured by no single-parameter law fitted here.
 *
 * ACCURACY / MEASUREMENT ONLY. Quantifies an imp-34003 qualitative claim. The inherited
 * imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the resid(k) surrogate is
 * descriptive, not derived; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34003-f4-unity-crossing-locator (located k_peak = 8.8210916, resid_peak = 0.0653366)
 * @see imp-33878-hump-argmax-grid-refinement (the resid_exp(k) surrogate, reused verbatim)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the ladder storing resid(k))
 * @see imp-33773-ecoll-sigma-offset-eflow-attribution (the M2 sub-leading residual)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34003 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34003 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33582/imp-33730 defn: p_sigma = -slope OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// The imp-33773 M2 sub-leading residual as a CONTINUOUS function of k (imp-34003 resid, verbatim).
function resid(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}

// imp-34003 pointwise resid'(k)=0 peak (verbatim literal); recompute the apex value here.
const K_PEAK = 8.8210916010;
const RESID_PEAK = resid(K_PEAK); // ~0.0653366 (matches imp-34003 to 1e-6)

// (A1) Tabulate resid(k) for k in k_peak..k_peak+3 at the quarter-decade ladder step.
const POST_PEAK_TABLE = [];
for (let dk = 0; dk <= 3 + 1e-9; dk += 0.25) {
  const k = K_PEAK + dk;
  const r = resid(k);
  POST_PEAK_TABLE.push({
    dk: +dk.toFixed(4),
    k: +k.toFixed(6),
    resid: +r.toExponential(6),
    ratioToPeak: +(r / RESID_PEAK).toFixed(6),
  });
}
const RESID_AT_PLUS3 = POST_PEAK_TABLE[POST_PEAK_TABLE.length - 1].resid; // ~9.4343e-3
const RATIO_AT_PLUS3 = POST_PEAK_TABLE[POST_PEAK_TABLE.length - 1].ratioToPeak; // ~0.1444
const DROP_FACTOR_3DEC = +(RESID_PEAK / RESID_AT_PLUS3).toFixed(4); // ~6.93x
// monotone-decreasing check across the tabulated window
const IS_MONOTONE_DECREASING = POST_PEAK_TABLE.every(
  (t, i) => i === 0 || t.resid < POST_PEAK_TABLE[i - 1].resid,
);

// (A2) Half-attenuation step: bisect resid(k_peak+dk) = resid(k_peak)/2 over dk in [0,3].
function bisectHalfStep(target) {
  let a = 0;
  let b = 3;
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (a + b);
    if (resid(K_PEAK + m) > target) a = m;
    else b = m;
  }
  return 0.5 * (a + b);
}
const HALF_DK = +bisectHalfStep(RESID_PEAK / 2).toFixed(6); // ~1.646 decades
const K_HALF = +(K_PEAK + HALF_DK).toFixed(6); // ~10.467
const N_PEAK = +Math.pow(10, K_PEAK).toExponential(4); // 6.6236e8
const N_HALF = +Math.pow(10, K_HALF).toExponential(4); // ~2.93e10
const N_HALF_OVER_N_PEAK = +(Math.pow(10, HALF_DK)).toFixed(2); // ~44x

// (A3) Fit the post-peak decay: exponential (ln resid vs k-k_peak) vs power (ln resid vs ln k).
function fitLinear(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = (sxy * sxy) / (sxx * syy);
  return { slope, intercept, r2 };
}
// exclude the apex (dk=0, where resid'(k)~0 flattens the log-slope) -- fit the strictly-decaying tail.
const POST = POST_PEAK_TABLE.filter((t) => t.dk > 0);
const T_VALS = POST.map((t) => t.dk); // k - k_peak
const LNK = POST.map((t) => Math.log(t.k));
const LNR = POST.map((t) => Math.log(t.resid));
const EXP_FIT = fitLinear(T_VALS, LNR);
const POW_FIT = fitLinear(LNK, LNR);
const EXP_DECAY_RATE = +(-EXP_FIT.slope).toFixed(6); // ~0.7159 per decade
const EXP_R2 = +EXP_FIT.r2.toFixed(6); // ~0.9716
const POW_EXPONENT = +POW_FIT.slope.toFixed(6); // ~-7.3909
const POW_R2 = +POW_FIT.r2.toFixed(6); // ~0.9582
const EXP_BEATS_POW = EXP_R2 > POW_R2;
const EXP_IMPLIED_HALF_STEP = +(Math.LN2 / EXP_DECAY_RATE).toFixed(6); // ~0.968 (under-reads dk_half)

// Local decay exponent -d ln resid / dk (central difference) -- shows the ramp.
const H_LOC = 1e-4;
const localRate = (k) => -(Math.log(resid(k + H_LOC)) - Math.log(resid(k - H_LOC))) / (2 * H_LOC);
const LOCAL_RATE_LADDER = [0.5, 1.0, 1.5, 2.0, 3.0].map((dk) => ({
  dk,
  rate: +localRate(K_PEAK + dk).toFixed(6),
}));
const RATE_NEAR_PEAK = LOCAL_RATE_LADDER[0].rate; // ~0.276 at dk=0.5
const RATE_FAR = LOCAL_RATE_LADDER[LOCAL_RATE_LADDER.length - 1].rate; // ~1.019 at dk=3.0
const RATE_RAMPS_UP = LOCAL_RATE_LADDER.every(
  (r, i) => i === 0 || r.rate > LOCAL_RATE_LADDER[i - 1].rate,
);

export const IMP34062_M2_RESIDUAL_ATTENUATION_RATE = {
  id: 'imp-34062',
  proofSection: 'S-frontier',
  question:
    'imp-34003 located the imp-33773 M2 residual peak at k_peak = 8.8210916 (resid = 0.0653366) and ' +
    'said the residual attenuates rather than amplifies beyond it, but never quantified how fast. ' +
    'Tabulate the SAME resid(k) surrogate for k in k_peak..k_peak+3, fit the post-peak decay ' +
    '(exponential vs power in k), and report the step over which the residual halves. Measurement ' +
    'only; component model NOT rigorous; changes no bound; NO QED.',
  measuredQuantity:
    'the post-peak decay of the continuous imp-33773 M2 residual resid(k) over k in k_peak..k_peak+3: ' +
    'the quarter-decade table, the directly-bisected half-attenuation step dk_half, the exponential ' +
    'vs power-law fit quality, and the local decay exponent -d ln resid / dk',
  peakAnchor: {
    k_peak: K_PEAK, // 8.8210916010 (imp-34003 resid-prime-zero root)
    resid_peak: +RESID_PEAK.toFixed(7), // 0.0653366 (matches imp-34003)
    N_peak: N_PEAK, // 6.6236e8
  },
  postPeakTable: POST_PEAK_TABLE, // dk, k, resid, ratioToPeak (dk = 0..3 at 0.25 step)
  attenuationOverThreeDecades: {
    resid_at_plus3: RESID_AT_PLUS3, // 9.4343e-3
    ratio_at_plus3: RATIO_AT_PLUS3, // 0.1444
    drop_factor_3dec: DROP_FACTOR_3DEC, // 6.93x
    monotone_decreasing: IS_MONOTONE_DECREASING, // true (no secondary hump)
  },
  halfAttenuation: {
    dk_half_decades: HALF_DK, // 1.646
    k_half: K_HALF, // 10.467
    N_half: N_HALF, // ~2.93e10
    N_half_over_N_peak: N_HALF_OVER_N_PEAK, // ~44x
    note:
      'directly bisected resid(k_peak+dk) = resid(k_peak)/2, independent of any fit form -- the ' +
      'residual first reaches half its peak value 1.646 decades past k_peak',
  },
  decayFit: {
    exponential: { decay_rate_per_decade: EXP_DECAY_RATE, R2: EXP_R2, implied_half_step: EXP_IMPLIED_HALF_STEP },
    powerLaw: { exponent: POW_EXPONENT, R2: POW_R2 },
    exp_beats_pow: EXP_BEATS_POW, // true (0.9716 > 0.9582), but see localDecayRamp
    note:
      'exponential is the least-bad single-parameter form (R^2 0.9716 vs power-law 0.9582), but its ' +
      'constant-rate half-step 0.968 UNDER-reads the directly-measured dk_half = 1.646 because the ' +
      'decay accelerates -- see localDecayRamp',
  },
  localDecayRamp: {
    ladder: LOCAL_RATE_LADDER, // dk -> -d ln resid / dk
    rate_near_peak: RATE_NEAR_PEAK, // ~0.276 at dk=0.5
    rate_far: RATE_FAR, // ~1.019 at dk=3.0
    ramps_up: RATE_RAMPS_UP, // true -- attenuation ACCELERATES with k
  },
  finding: {
    A1_monotone_attenuation:
      'The residual falls monotonically from resid(k_peak) = 6.5337e-2 to resid(k_peak+3) = 9.4343e-3 ' +
      '(14.44% of peak, a 6.93x drop) with no secondary hump -- the imp-34003 "attenuates rather than ' +
      'amplifies" claim holds across the whole k_peak..k_peak+3 span.',
    A2_half_attenuation_step:
      'Bisecting resid(k_peak+dk) = resid(k_peak)/2 puts the half-attenuation step at dk_half = 1.646 ' +
      'decades (k_half = 10.467, N_half = 2.93e10, ~44x the peak height N_peak = 6.624e8) -- the ' +
      'directly-measured half-life, independent of any fit form.',
    A3_decay_accelerates_not_clean_exponential:
      'An exponential ln resid = A - B(k - k_peak) fits marginally better (B = 0.7159 per decade, ' +
      'R^2 = 0.9716) than a power law (exponent -7.391, R^2 = 0.9582), so the exponential is the ' +
      'least-bad single form. BUT the local decay exponent -d ln resid / dk RAMPS from ~0.276 per ' +
      'decade at dk = 0.5 to ~1.019 at dk = 3.0 -- the attenuation ACCELERATES. This is why the ' +
      'single-exponential half-step ln2/B = 0.968 under-reads the directly-measured dk_half = 1.646 ' +
      '(the broad quadratic apex flattens resid-prime near the peak, so the decay starts slow and ' +
      'speeds up only in the tail). SUB-GAP: no single-parameter law fitted here captures the ' +
      'accelerating decay.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / MEASUREMENT (frontier-direction, NOT rigorous). Quantifies the imp-34003 ' +
    '"attenuates rather than amplifies" claim past k_peak = 8.8210916 (resid_peak = 0.0653366). Over ' +
    'k in k_peak..k_peak+3 the imp-33773 M2 residual surrogate falls MONOTONICALLY to 9.4343e-3 ' +
    '(14.44% of peak, 6.93x drop) and HALVES over a directly-bisected dk_half = 1.646 decades ' +
    '(N_half = 2.93e10, ~44x N_peak). A single exponential fits marginally better than a power law ' +
    '(R^2 0.9716 vs 0.9582) so it is the least-bad one-parameter form, BUT the local decay exponent ' +
    '-d ln resid / dk is NOT constant -- it RAMPS from ~0.276 per decade just past the peak to ~1.019 ' +
    'at dk = 3.0, so the attenuation ACCELERATES; the constant-rate half-step ln2/B = 0.968 therefore ' +
    'under-reads the measured half-life of 1.646 decades. SUB-GAP: the accelerating ' +
    '(super-exponential-near-peak) decay is captured by no single-parameter law fitted here. The ' +
    'inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the resid(k) surrogate ' +
    'is descriptive, not derived; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34003 (located k_peak = 8.8210916, resid_peak = 0.0653366, "attenuates rather than ' +
    'amplifies"); imp-33878 (the resid_exp(k) surrogate reused verbatim); imp-33810 (the ladder ' +
    'storing resid(k)); imp-33773 (the M2 sub-leading residual); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34062_M2_RESIDUAL_ATTENUATION_RATE_ASSERTIONS = [
  {
    // (A1) The residual attenuates monotonically past the peak to ~14% of peak over three decades.
    id: 'imp34062-monotone-attenuation-past-peak',
    description: 'resid falls monotonically to ~14.4% of peak (6.93x drop) over k_peak..k_peak+3, no secondary hump',
    holds: () =>
      Math.abs(RESID_PEAK - 0.0653366) < 1e-5 &&
      IS_MONOTONE_DECREASING &&
      RATIO_AT_PLUS3 > 0.13 &&
      RATIO_AT_PLUS3 < 0.16 &&
      DROP_FACTOR_3DEC > 6.5 &&
      DROP_FACTOR_3DEC < 7.5,
  },
  {
    // (A2) The directly-bisected half-attenuation step is ~1.646 decades past the peak.
    id: 'imp34062-half-attenuation-step',
    description: 'resid halves at dk_half ~ 1.646 decades (N_half ~ 2.93e10, ~44x N_peak)',
    holds: () =>
      Math.abs(HALF_DK - 1.646) < 5e-3 &&
      Math.abs(resid(K_HALF) - RESID_PEAK / 2) < 1e-4 &&
      N_HALF_OVER_N_PEAK > 40 &&
      N_HALF_OVER_N_PEAK < 48,
  },
  {
    // (A3) Exponential edges out power law, but the local decay rate RAMPS UP (accelerating decay).
    id: 'imp34062-decay-accelerates-exp-beats-pow',
    description: 'exp R^2 0.9716 > power R^2 0.9582; local decay rate ramps ~0.276 -> ~1.019 (accelerating); ln2/B=0.968 < dk_half',
    holds: () =>
      EXP_BEATS_POW &&
      EXP_R2 > 0.96 &&
      POW_R2 > 0.95 &&
      RATE_RAMPS_UP &&
      RATE_NEAR_PEAK < 0.4 &&
      RATE_FAR > 0.9 &&
      EXP_IMPLIED_HALF_STEP < HALF_DK,
  },
  {
    // Honesty gate: accuracy/measurement only, isRigorous false, sub-gap named, no QED, PT SOTA.
    id: 'imp34062-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, SUB-GAP named, no QED, PT Lambda<=0.2 SOTA',
    holds: () =>
      IMP34062_M2_RESIDUAL_ATTENUATION_RATE.isRigorous === false &&
      /SUB-GAP/.test(IMP34062_M2_RESIDUAL_ATTENUATION_RATE.verdict) &&
      /NO QED/.test(IMP34062_M2_RESIDUAL_ATTENUATION_RATE.verdict) &&
      /remains SOTA/.test(IMP34062_M2_RESIDUAL_ATTENUATION_RATE.verdict),
  },
];

for (const a of IMP34062_M2_RESIDUAL_ATTENUATION_RATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34062-m2-residual-attenuation-rate assertion failed: ${a.id}`);
  }
}
