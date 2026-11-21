/**
 * @module imp-33790-fold-jet-mprime-mdoubleprime-ratio-crossvalidation
 *
 * imp-33790 (numerical, frontier-scoping): CROSS-VALIDATE on ONE common reading-strip ladder the two
 * boundary-derivative rungs of the imp-33766 FOLD_JET, and MEASURE the single-derivative gap ratio
 * that the H4/H3 coupling rests on -- WITHOUT claiming closure. The imp-33766 FOLD_JET records:
 *   H4 = k=1 fold-reading derivative m_prime ~ eps^{-3/2} (N-exponent 3/4, imp-33646), and
 *   H3 = k=2 fold curvature    m_double_prime ~ eps^{-5/2} (N-exponent 5/4, imp-33645),
 * both read at the strip height eps = y_N^sharp = sqrt(2 pi / N). The two exponents were established
 * in SEPARATE modules on independent eps-ladders and never cross-validated on ONE common ladder, and
 * the predicted single-derivative ratio m_double_prime / m_prime ~ eps^{-1} was never measured.
 *
 * THE COMMON READING-STRIP LADDER
 * -------------------------------
 * Both quantities are read on ONE shared eps = y_N^sharp ladder (N in {1e3 .. 1e7}) for the symmetric
 * Holder-1/2 cusp rho(x) = |x|^{-1/2} on [-1, 1], x_star = 0, critical point z_0* = i eps. The
 * Stieltjes-transform derivatives at z_0 = i eps are, with the x = +- u^2 substitution removing the
 * sqrt singularity (|x|^{-1/2} dx = 2 du):
 *     m_prime        = -  integral rho / (z - x)^2 dx = -2 [ B2(+) + B2(-) ],  Bp(sgn) = int_0^1 (i eps -sgn u^2)^{-p} du
 *     m_double_prime = 2  integral rho / (z - x)^3 dx =  4 [ B3(+) + B3(-) ].
 * Simpson quadrature, N_PANELS panels on [0, 1], complex arithmetic in [re, im] pairs.
 *
 * WHAT IS MEASURED (all on the SAME rungs)
 * ----------------------------------------
 * (i)   the m_prime        N-exponent by local log-log differencing d log|m_prime| / d log N  -> 0.7500 (= 3/4);
 * (ii)  the m_double_prime N-exponent by local log-log differencing d log|m''|     / d log N  -> 1.2500 (= 5/4);
 * (iii) the ratio R(eps) = |m_double_prime| / |m_prime| and its N-exponent               -> 0.5000 (= 1/2);
 * (iv)  the renormalized ratio  R(eps) * eps  ->  K / C_PS, the predicted amplitude of R ~ (K/C_PS) eps^{-1}.
 *
 * RESULT
 * ------
 * On the common ladder the two exponents reproduce their separate-module values to four places:
 * 3/4 for m_prime and 5/4 for m_double_prime. The ratio R(eps) = |m''| / |m'| is a clean power law
 *     R(eps) ~ (K / C_PS) eps^{-1}   as eps -> 0+,    K / C_PS -> 1.49998  ( = 3/2 to five places),
 * measured N-exponent 0.5000 (equivalently R ~ (3/2) (N / 2 pi)^{1/2}). The amplitude 3/2 is the clean
 * single-derivative gap: for the 1/2-cusp the k-th derivative amplitude obeys A_{k+1} / A_k = (2k+1)/2,
 * so A_2 / A_1 = 3/2 with C_PS = A_1 = pi / sqrt(2) = 2.221441 (imp-33646) and K = A_2 = 3 pi / (2 sqrt(2))
 * = 3.332162 (imp-33645). The two rungs are consistent, differ by exactly one derivative, and the
 * coupling ratio the FOLD_JET rests on is confirmed both in exponent (eps^{-1}, N^{1/2}) and in amplitude
 * (3/2). This is a CONSISTENCY CROSS-CHECK: it welds the two separately-measured rungs onto one ladder;
 * it does NOT discharge H4 or H3. Both grow as y_N^sharp -> 0 and the strip-height renormalization that
 * would floor either is a change of units, not a free win (imp-33645 / imp-33646).
 *
 * VERDICT: MEASUREMENT / SCOPING ONLY, G6a_shock_lipschitz STAYS OPEN. The two FOLD_JET boundary rungs
 * m_prime (3/4) and m_double_prime (5/4) are cross-validated on ONE common eps = y_N^sharp ladder and
 * the single-derivative ratio m''/m' ~ (3/2) eps^{-1} ~ (3/2)(N/2pi)^{1/2} is confirmed in both exponent
 * and amplitude. No positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; imp-3066
 * UNTOUCHED; NO QED. No refereed bound is changed.
 *
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (H4 m_prime, exponent 3/2 eps, 3/4 N)
 * @see imp-33645-h3-curvature-divergence-scoping (H3 m_double_prime, exponent 5/2 eps, 5/4 N)
 * @see imp-33766-h4-independent-discharge-scoping (FOLD_JET couples the two rungs)
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N) (imp-341 / imp-354 convention); it descends to 0.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// Complex arithmetic in [re, im] pairs.
const N_PANELS = 8000;
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
// B_p(sgn) = integral_0^1 1 / (i eps - sgn u^2)^p du by Simpson quadrature on [0, 1].
function branch(eps, sgn, p) {
  const h = 1 / N_PANELS;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= N_PANELS; i++) {
    const u = i * h;
    const w = i === 0 || i === N_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const z = [-sgn * u * u, eps]; // i eps - x, with x = sgn u^2
    let d = [1, 0];
    for (let k = 0; k < p; k++) d = cmul(d, z);
    const v = cinv(d);
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
// m_prime = - integral |x|^{-1/2} / (i eps - x)^2 dx = -2 [ B2(+) + B2(-) ].
function mpMag(eps) {
  const Bp = branch(eps, +1, 2);
  const Bm = branch(eps, -1, 2);
  return Math.hypot(-2 * (Bp[0] + Bm[0]), -2 * (Bp[1] + Bm[1]));
}
// m_double_prime = 2 integral |x|^{-1/2} / (i eps - x)^3 dx = 4 [ B3(+) + B3(-) ].
function mppMag(eps) {
  const Bp = branch(eps, +1, 3);
  const Bm = branch(eps, -1, 3);
  return Math.hypot(4 * (Bp[0] + Bm[0]), 4 * (Bp[1] + Bm[1]));
}

// The one common reading-strip ladder: eps = y_N^sharp for a shared N range. Both rungs read here.
const N_LADDER = [1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 3e6, 1e7];
const COMMON_LADDER = N_LADDER.map((N, i) => {
  const eps = ySharp(N);
  const mp = mpMag(eps);
  const mpp = mppMag(eps);
  const ratio = mpp / mp;
  // Local log-log slopes in N (fold-reading derivative 3/4, curvature 5/4, ratio 1/2).
  let slopeMpN = null;
  let slopeMppN = null;
  let slopeRatioN = null;
  if (i > 0) {
    const prevN = N_LADDER[i - 1];
    const prevEps = ySharp(prevN);
    const dlnN = Math.log(N) - Math.log(prevN);
    slopeMpN = (Math.log(mp) - Math.log(mpMag(prevEps))) / dlnN;
    slopeMppN = (Math.log(mpp) - Math.log(mppMag(prevEps))) / dlnN;
    const prevRatio = mppMag(prevEps) / mpMag(prevEps);
    slopeRatioN = (Math.log(ratio) - Math.log(prevRatio)) / dlnN;
  }
  return {
    N,
    y_N_sharp: +eps.toExponential(4),
    mp: +mp.toExponential(4),
    mpp: +mpp.toExponential(4),
    ratio: +ratio.toExponential(5),
    // eps-renormalized rungs -> the imp-33646 PS constant and imp-33645 curvature floor, on this ladder.
    renMp: +(mp * Math.pow(eps, 1.5)).toFixed(6),
    renMpp: +(mpp * Math.pow(eps, 2.5)).toFixed(6),
    // the single-derivative ratio, renormalized: R(eps) * eps -> K / C_PS = 3/2.
    ratioTimesEps: +(ratio * eps).toFixed(6),
    slopeMpN: slopeMpN === null ? null : +slopeMpN.toFixed(4),
    slopeMppN: slopeMppN === null ? null : +slopeMppN.toFixed(4),
    slopeRatioN: slopeRatioN === null ? null : +slopeRatioN.toFixed(4),
  };
});

const TAIL = COMMON_LADDER[COMMON_LADDER.length - 1];

// Closed-form amplitudes of the 1/2-cusp derivative blow-up (imp-33646 / imp-33645).
const C_PS = Math.PI / Math.SQRT2; // A_1 = pi / sqrt(2) = 2.221441 (imp-33646 m_prime amplitude)
const K_CURV = (3 * Math.PI) / (2 * Math.SQRT2); // A_2 = 3 pi / (2 sqrt(2)) = 3.332162 (imp-33645 m'' amplitude)
const RATIO_AMPLITUDE = K_CURV / C_PS; // A_2 / A_1 = 3/2 = (2k+1)/2 at k = 1 (single-derivative gap)

export const IMP33790_FOLD_JET_RATIO_CROSSVALIDATION = {
  id: 'imp-33790',
  proofSection: 'S-frontier',
  scopes:
    'Cross-validate the imp-33766 FOLD_JET boundary rungs m_prime (imp-33646, 3/4) and ' +
    'm_double_prime (imp-33645, 5/4) on ONE common eps = y_N^sharp ladder and measure the coupling ratio',
  question:
    'On one shared reading-strip eps = y_N^sharp = sqrt(2 pi / N) ladder, do the fold-reading derivative ' +
    'm_prime (N-exponent 3/4, imp-33646) and the curvature m_double_prime (N-exponent 5/4, imp-33645) ' +
    'reproduce their separate-module exponents, and does the single-derivative ratio m_double_prime / m_prime scale as ' +
    'eps^{-1} (equivalently N^{1/2}) with the predicted amplitude K / C_PS = 3/2? Measurement only; G6a OPEN; no QED.',

  cuspModel: 'rho(x) ~ C / |x - x_star|^{1/2} (Holder-1/2, alpha = 1/2 exactly) -- the RvM cusp of imp-394',
  commonLadder: COMMON_LADDER,
  readingStrip: 'eps = y_N^sharp = sqrt(2 pi / N), N in {1e3 .. 1e7}, one ladder for BOTH rungs',

  // (i)-(ii): the two boundary-derivative N-exponents reproduced on the common ladder.
  mpNExponentMeasured: TAIL.slopeMpN, // -> 0.7500 (= 3/4, imp-33646)
  mpNExponentPredicted: 0.75,
  mppNExponentMeasured: TAIL.slopeMppN, // -> 1.2500 (= 5/4, imp-33645)
  mppNExponentPredicted: 1.25,

  // (iii): the single-derivative ratio and its N-exponent.
  ratioLawEps: 'R(eps) = |m_double_prime| / |m_prime| ~ (K / C_PS) eps^{-1} as eps -> 0+',
  ratioLawN: 'R ~ (3/2) (N / 2 pi)^{1/2} at eps = y_N^sharp',
  ratioNExponentMeasured: TAIL.slopeRatioN, // -> 0.5000 (= 1/2 = 5/4 - 3/4)
  ratioNExponentPredicted: 0.5,

  // (iv): the renormalized-ratio amplitude, the single-derivative gap the coupling rests on.
  ratioAmplitudeMeasured: TAIL.ratioTimesEps, // R(eps) * eps -> 1.49998 (= 3/2 to five places)
  ratioAmplitudePredicted: RATIO_AMPLITUDE, // K / C_PS = 3/2 exactly
  ratioAmplitudeClosedForm: 'A_2 / A_1 = (2k+1)/2 at k = 1 = 3/2, with A_1 = pi/sqrt(2), A_2 = 3 pi/(2 sqrt(2))',
  psConstantOnLadder: TAIL.renMp, // eps^{3/2}|m_prime| -> ~2.2214 (imp-33646 PS constant reproduced here)
  curvatureFloorOnLadder: TAIL.renMpp, // eps^{5/2}|m_double_prime| -> ~3.3322 (imp-33645 floor reproduced here)

  // The assessment: consistency cross-check, NOT a discharge.
  rungsAreConsistent: true, // 3/4 and 5/4 reproduced on the common ladder; ratio exponent 1/2, amplitude 3/2
  differByOneDerivative: true, // 5/4 - 3/4 = 1/2 = one derivative pushed through eps ~ N^{-1/2}; ratio ~ eps^{-1}
  dischargesH4OrH3: false, // welds the two rungs onto one ladder; does NOT floor either -- both grow as y_N^sharp -> 0
  residualObstruction:
    'both rungs grow as y_N^sharp -> 0 (m_prime ~ N^{3/4}, m_double_prime ~ N^{5/4}); the cross-check ' +
    'confirms the coupling ratio, it does not supply the strip-height-uniformity the H4/H3 discharge needs',

  isRigorous: false,
  verdict:
    'MEASUREMENT / SCOPING ONLY, G6a_shock_lipschitz STAYS OPEN. The two imp-33766 FOLD_JET boundary rungs ' +
    'm_prime (N-exponent 3/4, imp-33646) and m_double_prime (N-exponent 5/4, imp-33645) are cross-validated ' +
    'on ONE common eps = y_N^sharp = sqrt(2 pi / N) ladder (measured N-exponents 0.7500 and 1.2500), and the ' +
    'single-derivative ratio m_double_prime / m_prime ~ (3/2) eps^{-1} ~ (3/2)(N/2pi)^{1/2} is confirmed in ' +
    'both exponent (measured 0.5000) and amplitude (measured 1.49998 = 3/2, the clean (2k+1)/2 gap at k=1). ' +
    'The cross-check welds the two separately-measured rungs onto one ladder; it does NOT discharge H4 or H3 ' +
    '(both grow as y_N^sharp -> 0). No positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; ' +
    'imp-3066 UNTOUCHED; NO QED. No refereed bound is changed.',
};

export const IMP33790_FOLD_JET_RATIO_ASSERTIONS = [
  {
    // (i) the fold-reading derivative reproduces the imp-33646 N-exponent 3/4 on the common ladder.
    id: 'imp33790-mprime-N-exponent-is-three-quarters',
    description: 'd log|m_prime| / d log N -> 3/4 on the common eps = y_N^sharp ladder (imp-33646)',
    holds: () =>
      Math.abs(IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.mpNExponentMeasured - 0.75) < 1e-3,
  },
  {
    // (ii) the curvature reproduces the imp-33645 N-exponent 5/4 on the SAME ladder.
    id: 'imp33790-mdoubleprime-N-exponent-is-five-quarters',
    description: 'd log|m_double_prime| / d log N -> 5/4 on the common eps = y_N^sharp ladder (imp-33645)',
    holds: () =>
      Math.abs(IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.mppNExponentMeasured - 1.25) < 1e-3,
  },
  {
    // (iii) the ratio N-exponent is the difference 5/4 - 3/4 = 1/2 (single derivative through eps ~ N^{-1/2}).
    id: 'imp33790-ratio-N-exponent-is-one-half',
    description: 'd log(|m_double_prime|/|m_prime|) / d log N -> 1/2 = 5/4 - 3/4',
    holds: () =>
      Math.abs(IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.ratioNExponentMeasured - 0.5) < 1e-3,
  },
  {
    // (iv) the renormalized ratio R(eps)*eps -> K/C_PS = 3/2, the predicted single-derivative amplitude.
    id: 'imp33790-ratio-amplitude-is-three-halves',
    description: 'R(eps) * eps -> K / C_PS = 3/2 (A_2 / A_1 = (2k+1)/2 at k = 1)',
    holds: () =>
      Math.abs(IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.ratioAmplitudeMeasured - 1.5) < 5e-4 &&
      Math.abs(IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.ratioAmplitudePredicted - 1.5) < 1e-12,
  },
  {
    // The PS constant (imp-33646) and curvature floor (imp-33645) are both reproduced on this one ladder.
    id: 'imp33790-both-renormalized-floors-reproduced',
    description: 'eps^{3/2}|m_prime| -> ~2.2214 (imp-33646) and eps^{5/2}|m_double_prime| -> ~3.3322 (imp-33645) on the common ladder',
    holds: () =>
      Math.abs(IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.psConstantOnLadder - Math.PI / Math.SQRT2) < 1e-3 &&
      Math.abs(IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.curvatureFloorOnLadder - (3 * Math.PI) / (2 * Math.SQRT2)) < 1e-3,
  },
  {
    // Honesty gate: consistency cross-check, NOT a discharge; G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33790-honesty-gate-no-qed',
    description: 'Measurement only: cross-check does not discharge H4/H3, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.isRigorous === false &&
      IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.dischargesH4OrH3 === false &&
      IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.rungsAreConsistent === true &&
      /NO QED/.test(IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.verdict) &&
      /STAYS OPEN/.test(IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.verdict) &&
      /imp-3066 UNTOUCHED/.test(IMP33790_FOLD_JET_RATIO_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP33790_FOLD_JET_RATIO_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33790-fold-jet-mprime-mdoubleprime-ratio-crossvalidation assertion failed: ${a.id}`);
  }
}
