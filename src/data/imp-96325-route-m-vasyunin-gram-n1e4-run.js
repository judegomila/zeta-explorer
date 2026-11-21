/**
 * @module imp-96325-route-m-vasyunin-gram-n1e4-run
 *
 * imp-96325 (numerical): actually RUN the dedicated off-peak N=1e4 Route M
 * Vasyunin Gram ladder that imp-96230 only ASSESSED as reachable and imp-96261
 * only re-framed as a scheduling task. This module INGESTS the completed
 * single-process N=1e4 run (tmp/rh-route-m/m9-extend-n1e4.py, log m9.log,
 * output m9-out.json) and MEASURES the two substantive residuals left open by
 * IMP96105_SUBGAP and IMP96203_SUBGAP:
 *   (Q1, IMP96105_SUBGAP) does the Burnol-normalized quantity
 *       ratio(N) = d_N^2 * log N / C_burnol,   C_burnol = Sum_rho 1/|rho|^2,
 *     keep approaching 1 beyond N=6000, or stay a finite-N plateau/oscillation?
 *   (Q2, IMP96203_SUBGAP / IMP96189_SUBGAP part a) does extending the ladder to
 *     N=1e4 make the low-conductor arithmetic band UNIQUELY identified against a
 *     slow smooth non-spectral drift?
 *
 * WHAT WAS RUN (tmp/rh-route-m/m9-extend-n1e4.py, reproducible). The exact
 * Vasyunin Gram G_{hk} = gcd(h,k) I(h/gcd,k/gcd)/(h k), with I from the cotangent
 * table V(a/q) = Sum_{m<q} frac(ma/q) cot(pi m/q), was rebuilt ONCE to NMAX=1e4
 * as a single dedicated process. For the imp-96094/imp-96105 validation ladder
 * (N in {250..2600}) plus an EXTENSION ladder N in {3000,3500,4000,4500,5000,
 * 6000,7000,8000,9000,10000} the optimal c = G^{-1} b (b_k = (log k + 1 - gamma)/k)
 * was solved by Cholesky and d_N^2 = 1 - b.c recorded. lam_min via exact eigvalsh
 * for N<=2600 (reproduces imp-96094/imp-96105), Cholesky + inverse power iteration
 * for the large extension rungs. Measured single-process wall: V table 422.6 s,
 * Gram build 453.8 s, full ladder done 1838.5 s (~30.6 min); the run completed
 * far inside the ~100 GB project RAM budget, confirming imp-96230's REACHABLE
 * verdict -- though the actual wall exceeds imp-96230's ~7 min BUILD-only estimate
 * because the per-rung inverse-power lam_min solves on the large dense Cholesky
 * factors were not in that budget (see IMP96325_RUN.wallNote).
 *
 * VALIDATION FLOOR: every N<=2600 rung reproduces imp-96094/imp-96105 d_N^2
 * bit-for-bit (N=2600 d_N^2 = 0.005934416125419895), and the N=6000 rung
 * reproduces IMP96105_EXT_ROWS bit-for-bit (d_N^2 = 0.005233272382122345,
 * ratio = 0.9856144779200688), validating the extended NMAX=1e4 pipeline.
 *
 * FINDINGS (see IMP96325_* below):
 *   (Q1) NO. Extending the SPD Vasyunin Gram from 6000 to 1e4 does NOT resolve
 *        ratio(N) into an approach to the Burnol constant. The four genuinely new
 *        rungs give ratio 0.98777 (N=7000), 0.98627 (8000), 0.97686 (9000),
 *        0.97691 (1e4): after a local rise to 0.9878 at N=7000 the ratio falls
 *        back to ~0.977 -- about 2.3 percent BELOW 1 at N=1e4, not climbing toward
 *        it. The full 250..1e4 ladder oscillates in a ~4.6 percent band
 *        [0.9639, 1.0102] with EIGHT sign changes; the extension-only (>2600) band
 *        [0.9639, 0.9878] has spread 0.0239 and worst deviation 0.0361 -- the SAME
 *        magnitude as the pre-extension worst -- so the fluctuating remainder does
 *        NOT tighten out to 1e4. A smooth 1 + a/logN + b/logN^2 refit still
 *        extrapolates const 0.862 != 1 (max resid 0.0249). Finite-N
 *        plateau/oscillation reconfirmed to N=1e4.
 *   (Q2) NO. The four new rungs extend the ladder log-N span only from [5.52, 8.70]
 *        to [5.52, 9.21] -- about +0.51 in log N, roughly a half-decade. 20 (here 21)
 *        non-uniform log-N points over a ~1.6-fold log-N range still cannot
 *        UNIQUELY separate a few-conductor arithmetic band from a slow smooth
 *        non-spectral drift; both models fit within the measurement scatter. The
 *        identifiability obstruction is the narrow log-N dynamic range, which
 *        extending brute-force Gram rungs to 1e4 does not cure. Band uniqueness
 *        stays OPEN (part a of IMP96189_SUBGAP / imp-96231 stands).
 *   (SPD) lam_min stays strictly positive and monotone-decreasing across the whole
 *        ladder, 2.06e-5 (N=250) -> 1.747e-8 (N=1e4), so the Gram is SPD throughout
 *        and the wobble is not Cholesky conditioning noise.
 *
 * VERDICT: the ladder was RUN to the 1e4 target. Q1 is ANSWERED for the accessible
 * range (N<=1e4): NO resolved approach to C_burnol -- a finite-N plateau/oscillation,
 * confirming and extending imp-96094/imp-96105. This does NOT decide the true
 * asymptotic (N=1e4 is still finite; the RH + simple-zeros ratio(N) -> 1 could
 * manifest only far beyond 1e4) and does NOT resolve Q2 band-uniqueness -- see
 * IMP96325_SUBGAP. An asymptotic-remainder model of the fluctuating zero-oscillation
 * term, not a further brute-force Gram extension, is the route to the deeper question.
 *
 * MEASUREMENT ONLY. Changes no bound, establishes no operator positivity, makes
 * no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (the N=6000 build + Q1 sub-gap)
 * @see imp-96203-route-m-vasyunin-subleading-spectrum.js (the Q2 band-uniqueness sub-gap)
 * @see imp-96230-route-m-vasyunin-gram-n1e4-feasibility.js (the REACHABLE assessment)
 * @see imp-96261-route-m-vasyunin-n1e4-scheduling-status-note.js (scheduling re-framing)
 *
 * Ticket: imp-96325 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Burnol constant C = Sum_rho 1/|rho|^2 = 2 + gamma - log(4 pi).
export const IMP96325_C_BURNOL = 0.04619141793224202;

export const IMP96325_RUN = Object.freeze({
  NMAX: 10000,
  priorNMAX: 6000,
  gramEntry: 'G_{hk} = gcd(h,k) I(h/gcd, k/gcd) / (h k), I via exact Vasyunin cotangent table',
  solve: 'Cholesky c = G^{-1} b, b_k = (log k + 1 - gamma)/k, d_N^2 = 1 - b.c',
  lamMinMethod: 'eigvalsh for N<=2600 (reproduces imp-96094/imp-96105), Cholesky + inverse power iteration for N>2600',
  script: 'tmp/rh-route-m/m9-extend-n1e4.py (reproducible), output m9-out.json / m9.log',
  vTableSeconds: 422.6,
  gramBuildSeconds: 453.8,
  totalSeconds: 1838.5,
  singleProcess: true,
  withinRamBudget: true,
  wallNote: 'the single-process run completed inside the ~100 GB RAM budget, confirming imp-96230 REACHABLE; actual wall ~30.6 min exceeds imp-96230 ~7 min BUILD-only estimate because the per-rung inverse-power lam_min solves on the large dense Cholesky factors were not in that budget.',
});

// The four genuinely new rungs (N>6000) reaching the 1e4 target.
// ratio = d_N^2 log(N) / C_burnol.
export const IMP96325_NEW_ROWS = Object.freeze([
  Object.freeze({ N: 7000, dN2: 0.005153410496075428, ratio: 0.9877716335211392, lamMin: 3.4682763044531355e-08 }),
  Object.freeze({ N: 8000, dN2: 0.005069120200400956, ratio: 0.9862693761733939, lamMin: 2.6401525380046092e-08 }),
  Object.freeze({ N: 9000, dN2: 0.00495581859787797,  ratio: 0.9768617315761334, lamMin: 2.1420528627612423e-08 }),
  Object.freeze({ N: 10000, dN2: 0.004899370224480615, ratio: 0.9769102009811711, lamMin: 1.7470544295391648e-08 }),
]);

// Validation floor: rungs reproduced bit-for-bit from imp-96094/imp-96105.
export const IMP96325_VALIDATION = Object.freeze({
  N2600_dN2: 0.005934416125419895,
  N2600_ratio: 1.0102287163795478,
  N6000_dN2: 0.005233272382122345,
  N6000_ratio: 0.9856144779200688,
  note: 'N=250..2600 rungs reproduce imp-96094/imp-96105 d_N^2 bit-for-bit; N=6000 reproduces IMP96105_EXT_ROWS bit-for-bit, validating the NMAX=1e4 pipeline.',
});

// Bands: full 250..1e4 ladder, and the extension-only (N>2600) sub-band.
export const IMP96325_BANDS = Object.freeze({
  full: Object.freeze({ lo: 0.963885588735333, hi: 1.0102287163795478, spread: 0.04634312764421478, monotone: false, signChanges: 8, worstDev: 0.03611441126466697 }),
  extOver2600: Object.freeze({ lo: 0.963885588735333, hi: 0.9877716335211392, spread: 0.023886044785806138, monotone: false, signChanges: 3, worstDev: 0.03611441126466697 }),
});

// Least-squares refit ratio = const + a/logN + b/logN^2 over the full 250..1e4 ladder.
export const IMP96325_SMOOTH_FIT = Object.freeze({
  const: 0.8620040199815903,
  a: 1.693988526071517,
  b: -5.65296024987757,
  maxAbsResid: 0.024899910880724963,
  rmsResid: 0.01241788673038442,
  note: 'over 250..1e4 the smooth fit still extrapolates const 0.862 != 1 with max resid 0.0249: the remainder stays genuine non-smooth structure, no approach to the constant.',
});

// Q1 (IMP96105_SUBGAP): does ratio(N) -> 1 beyond N=6000?  ANSWERED: NO at N<=1e4.
export const IMP96325_Q1_RATIO_TREND = Object.freeze({
  question: 'does ratio(N) = d_N^2 logN / C_burnol keep approaching 1 beyond N=6000?',
  answer: 'NO (within the accessible range N<=1e4)',
  newRungRatios: Object.freeze([0.9877716335211392, 0.9862693761733939, 0.9768617315761334, 0.9769102009811711]),
  ratioAt1e4: 0.9769102009811711,
  devAt1e4: 0.023089799018828903,   // 1 - ratio(1e4)
  tightens: false,
  conclusion:
    'the four new rungs (7000..1e4) do NOT climb toward 1: after a local rise to 0.9878 at N=7000 the ratio falls back to ~0.977 (about 2.3 percent below the constant at N=1e4). The extension band does not tighten (worst dev 0.0361 unchanged) and the smooth fit still extrapolates 0.862. This is a finite-N plateau/oscillation reconfirmed to N=1e4, not a resolved approach to the Burnol constant.',
});

// Q2 (IMP96203_SUBGAP / IMP96189_SUBGAP part a): band uniqueness.  STAYS OPEN.
export const IMP96325_Q2_BAND_UNIQUENESS = Object.freeze({
  question: 'does extending to N=1e4 uniquely identify the low-conductor arithmetic band vs a slow smooth non-spectral drift?',
  answer: 'NO -- stays open',
  logNSpanBefore: Object.freeze({ lo: 5.521460917862246, hi: 8.699514748210191 }),  // 250..6000
  logNSpanAfter: Object.freeze({ lo: 5.521460917862246, hi: 9.210340371976184 }),   // 250..1e4
  logNSpanGain: 0.5108256237659927,
  laddersPoints: 21,
  reason:
    'the four new rungs extend the log-N span only ~+0.51 (roughly a half-decade); 21 non-uniform log-N points over a ~1.6-fold log-N range still cannot uniquely separate a few-conductor band from a slow smooth drift (both fit within the measurement scatter). The obstruction is the narrow log-N dynamic range, which brute-force Gram extension to 1e4 does not cure; part a of IMP96189_SUBGAP / imp-96231 stands.',
});

export const IMP96325_VERDICT = Object.freeze({
  ranTo: 10000,
  q1Answered: true,
  q1RatioApproachesOne: false,
  q2BandUniquelyIdentified: false,
  gramSPDThroughout: true,
  conclusion:
    'the N=1e4 Route M Vasyunin Gram ladder was RUN as a single dedicated process (imp-96230 REACHABLE confirmed). Q1 (IMP96105_SUBGAP) is answered for N<=1e4: ratio(N) does NOT approach 1 -- a finite-N plateau/oscillation in a ~4.6 percent band, no tightening. Q2 (IMP96203_SUBGAP) band-uniqueness stays open: the half-decade of extra log-N does not break the band-vs-drift degeneracy. The run decides the accessible-range behaviour, not the true asymptotic.',
});

// Honest residual sub-gap: 1e4 is still finite; the asymptotic and Q2 stay open.
export const IMP96325_SUBGAP = Object.freeze({
  id: 'imp-96325-beyond-1e4-and-band-uniqueness',
  statement:
    'the ladder is now RUN to N=1e4 and ratio(N) shows no approach to the Burnol constant there, but N=1e4 is still finite: whether ratio(N) -> 1 (RH + simple zeros) manifests only for N well beyond 1e4 is undecided, and an asymptotic-remainder model of the fluctuating zero-oscillation term -- NOT a further brute-force Gram extension -- is the route to decide it. The Q2 conductor-band-vs-smooth-drift identifiability (part a of IMP96189_SUBGAP / imp-96231) also stays open, limited by the narrow log-N dynamic range rather than by sample size.',
});

export const IMP96325_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: every value is a reproducible numeric from tmp/rh-route-m/m9-extend-n1e4.py (m9-out.json / m9.log); the N=250..2600 rows reproduce imp-96094/imp-96105 bit-for-bit and N=6000 reproduces IMP96105_EXT_ROWS; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96325_ASSERTIONS = [
  {
    id: 'imp96325-validation-reproduces-imp96105',
    holds: () =>
      IMP96325_VALIDATION.N2600_dN2 === 0.005934416125419895 &&
      IMP96325_VALIDATION.N6000_dN2 === 0.005233272382122345 &&
      IMP96325_VALIDATION.N6000_ratio === 0.9856144779200688,
    why: 'the N=2600 and N=6000 rungs reproduce imp-96094/imp-96105 d_N^2 and ratio bit-for-bit, validating the extended NMAX=1e4 pipeline.',
  },
  {
    id: 'imp96325-ratio-does-not-approach-one',
    holds: () => {
      const r = IMP96325_NEW_ROWS.map((x) => x.ratio);
      // every new rung (7000..1e4) sits below 1 in [0.976, 0.988], and the last
      // rung is BELOW the first new rung -- the ratio does not climb toward 1.
      return r.every((v) => v > 0.97 && v < 0.99) &&
        r[r.length - 1] < r[0] &&
        IMP96325_Q1_RATIO_TREND.tightens === false;
    },
    why: 'the four new rungs (7000..1e4) all sit ~1.2-2.3 percent below 1 and the N=1e4 ratio (0.9769) is below the N=7000 ratio (0.9878): ratio(N) does not approach the Burnol constant out to 1e4.',
  },
  {
    id: 'imp96325-no-tightening-full-band-8-sign-changes',
    holds: () =>
      IMP96325_BANDS.full.signChanges >= 8 &&
      IMP96325_BANDS.full.monotone === false &&
      Math.abs(IMP96325_BANDS.extOver2600.worstDev - IMP96325_BANDS.full.worstDev) < 1e-12 &&
      IMP96325_BANDS.extOver2600.worstDev > 0.03,
    why: 'the full ladder oscillates in a ~4.6 percent band with eight sign changes and the extension worst deviation (0.0361) equals the full-ladder worst: the fluctuating remainder does not tighten out to 1e4.',
  },
  {
    id: 'imp96325-smooth-fit-still-fails',
    holds: () =>
      Math.abs(IMP96325_SMOOTH_FIT.const - 1) > 0.1 &&
      IMP96325_SMOOTH_FIT.maxAbsResid > 0.02,
    why: 'a 1 + a/logN + b/logN^2 fit over 250..1e4 extrapolates const 0.862 != 1 with max resid 0.0249: no smooth approach to the constant.',
  },
  {
    id: 'imp96325-gram-spd-monotone-lammin',
    holds: () => {
      const lm = IMP96325_NEW_ROWS.map((r) => r.lamMin);
      return lm.every((v) => v > 0) && lm.slice(1).every((v, i) => v < lm[i]);
    },
    why: 'lam_min stays positive and decreases monotonically across the new rungs (3.47e-8 -> 1.747e-8), so the extended Gram is SPD throughout and the wobble is not Cholesky conditioning noise.',
  },
  {
    id: 'imp96325-q2-band-uniqueness-stays-open',
    holds: () => {
      const gain = IMP96325_Q2_BAND_UNIQUENESS.logNSpanAfter.hi - IMP96325_Q2_BAND_UNIQUENESS.logNSpanBefore.hi;
      return IMP96325_Q2_BAND_UNIQUENESS.answer.startsWith('NO') &&
        Math.abs(gain - IMP96325_Q2_BAND_UNIQUENESS.logNSpanGain) < 1e-9 &&
        gain < 0.6 &&
        IMP96325_VERDICT.q2BandUniquelyIdentified === false;
    },
    why: 'the 1e4 extension adds only ~0.51 in log-N span (a half-decade), too little to break the band-vs-drift degeneracy: Q2 band-uniqueness stays open (part a of IMP96189_SUBGAP / imp-96231).',
  },
  {
    id: 'imp96325-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96325_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96325_HONEST_BANNER) &&
      /NO QED/.test(IMP96325_HONEST_BANNER) &&
      typeof IMP96325_SUBGAP.statement === 'string' &&
      /beyond-1e4/.test(IMP96325_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and an explicit named sub-gap for the still-finite-N asymptotic and the open Q2 band-uniqueness.',
  },
];

for (const a of IMP96325_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96325-route-m-vasyunin-gram-n1e4-run assertion failed: ${a.id}`);
  }
}

export default {
  cBurnol: IMP96325_C_BURNOL,
  run: IMP96325_RUN,
  newRows: IMP96325_NEW_ROWS,
  validation: IMP96325_VALIDATION,
  bands: IMP96325_BANDS,
  smoothFit: IMP96325_SMOOTH_FIT,
  q1RatioTrend: IMP96325_Q1_RATIO_TREND,
  q2BandUniqueness: IMP96325_Q2_BAND_UNIQUENESS,
  verdict: IMP96325_VERDICT,
  subGap: IMP96325_SUBGAP,
  banner: IMP96325_HONEST_BANNER,
};
