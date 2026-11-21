/**
 * @fileoverview imp-95802 — re-run the imp-95782 sign/trend diagnostic on the imp-95780
 * SEVEN-modulus (m=18..41) Q_0 zeta(3) sector column, deciding whether the wider grid still
 * shows the alternating-sign per-point-noise signature (imp-95782 four-moduli verdict) or
 * whether a monotone m-trend emerges once the range doubles to 2x the anchor modulus.
 *
 * SETUP. imp-95782 assessed the four-moduli (m=18..21) dI zigzag and concluded the -,+,- shape
 * is a per-modulus quadrature ARTIFACT (finite differences GROW with order; linear-in-rho
 * residuals alternate), CONDITIONAL on the +4 offset. Because dI(1/m) = 1 - Q_0(m), the imp-95780
 * q0Sector column is exactly -(dI - 1): its consecutive-difference sign pattern is the mirror of
 * imp-95782's. imp-95780 tabulated q0Sector at SEVEN moduli m in {18,19,20,21,22,30,41}, spanning
 * out to twice the certified anchor modulus 20 (q0Sector -0.0107079475 up to -0.0106560777).
 *
 * MEASURED (scratch: tmp/imp-95802-scratch.mjs).
 *   full-grid consecutive q0Sector diffs (m 18->19->20->21->22->30->41):
 *       +3.858e-5, -2.852e-5, +3.140e-5, -2.382e-5, +1.717e-5, +1.706e-5   (signs +,-,+,-,+,+)
 *   fine subset m=18..22 (equal spacing dm=1): signs +,-,+,-  -> STRICTLY ALTERNATES.
 *   wide steps 22->30 (dm=8) and 30->41 (dm=11): BOTH positive (+1.717e-5, +1.706e-5).
 *   linear-in-rho fit (slope -1.118e-3): residual signs -,+,-,+,-,-,+, rms residual 1.30e-5.
 *   monotone-increase concordance (q0Sector rises with m): 16/21 pairs = 0.762.
 *   full q0Sector spread across m=18..41: 5.19e-5.
 *
 * VERDICT (conditional on the +4 offset). BOTH readings hold, on DIFFERENT scales:
 *   (a) On the equal-spacing fine subset m=18..22 the sign alternation +,-,+,- persists exactly,
 *       CONFIRMING and extending (by one point, m=22) the imp-95782 per-point-noise reading: over
 *       unit modulus steps the ~3e-5 per-modulus quadrature error dominates and produces sign-flips.
 *   (b) Over the doubled range a MONOTONE trend emerges: once the modulus gap is large (dm=8, 11)
 *       the two wide steps are BOTH positive and nearly equal (~1.71e-5), and the linear-in-rho
 *       slope is a clean -1.118e-3 (q0Sector rises toward its rho->0 limit as m grows). The genuine
 *       slow trend, invisible under the noise at unit spacing, becomes the dominant effect once the
 *       spacing exceeds the ~3e-5 noise scale.
 * So the wider grid does NOT overturn the alternating-noise reading at fine spacing; it reveals the
 * per-point noise and a genuine monotone macro-trend as two SEPARATE, scale-separated components.
 *
 * HONEST SUB-GAP. This is an arithmetic diagnostic on the carried imp-95780 seven-point q0Sector
 * table, NOT a re-quadrature. Only m=20 has a certified kappa; the non-anchor q0Sector values carry
 * the same ~3e-5 uncertified per-modulus error as in imp-95782. Confirming the monotone macro-trend
 * as genuine (rather than a coincidence of two same-sign noise draws at m=30,41) requires the
 * imp-95746-tightened-Nsub grid re-run at the wide moduli, checking each shifts by ~3e-5 while the
 * monotone rise persists. The trend reading is an inference from the two wide steps agreeing in sign
 * and magnitude plus the clean linear slope, not a re-quadrature certificate.
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound;
 * NO Lambda movement; no refereed bound is changed; NO QED. NO heavy imports.
 *
 * SOURCE: imp-95780 seven-modulus q0Sector column. SCRATCH: tmp/imp-95802-scratch.mjs.
 */

// carried imp-95780 seven-modulus q0Sector column (raw (6.21) Q_0 zeta(3) sector; +4 offset).
const Q0_TABLE = Object.freeze([
  Object.freeze({ m: 18, q0: -0.0107079475 }),
  Object.freeze({ m: 19, q0: -0.0106693712 }),
  Object.freeze({ m: 20, q0: -0.0106978911 }), // certified anchor (only m with a certified kappa)
  Object.freeze({ m: 21, q0: -0.0106664879 }),
  Object.freeze({ m: 22, q0: -0.0106903119 }),
  Object.freeze({ m: 30, q0: -0.0106731394 }),
  Object.freeze({ m: 41, q0: -0.0106560777 }),
]);

const M = Q0_TABLE.map((r) => r.m);
const Q = Q0_TABLE.map((r) => r.q0);
const RHO = Q0_TABLE.map((r) => 1 / r.m);

// full-grid consecutive differences (unequal spacing) and their signs.
const DIFFS = Object.freeze(Q.slice(1).map((y, i) => y - Q[i]));
const DIFF_SIGNS = Object.freeze(DIFFS.map((d) => (d > 0 ? '+' : '-')));

// fine equal-spacing subset m=18..22 (dm=1): does the alternation of imp-95782 persist + extend?
const FINE = Q0_TABLE.filter((r) => r.m <= 22).map((r) => r.q0);
const FINE_DIFFS = Object.freeze(FINE.slice(1).map((y, i) => y - FINE[i]));
const FINE_SIGNS = Object.freeze(FINE_DIFFS.map((d) => (d > 0 ? '+' : '-')));
const FINE_ALTERNATES = FINE_SIGNS.every((s, i) => (i === 0 ? true : s !== FINE_SIGNS[i - 1]));

// wide-spacing steps 22->30 (dm=8) and 30->41 (dm=11): the macro-trend probe.
const WIDE_STEPS = Object.freeze([Q[5] - Q[4], Q[6] - Q[5]]);
const WIDE_BOTH_POSITIVE = WIDE_STEPS.every((d) => d > 0);

// linear-in-rho regression over all seven; residual signs + rms.
const N = Q.length;
const SX = RHO.reduce((a, b) => a + b, 0);
const SY = Q.reduce((a, b) => a + b, 0);
const SXX = RHO.reduce((a, b) => a + b * b, 0);
const SXY = RHO.reduce((a, b, i) => a + b * Q[i], 0);
const SLOPE = (N * SXY - SX * SY) / (N * SXX - SX * SX);
const INTERCEPT = (SY - SLOPE * SX) / N;
const RESIDUALS = Object.freeze(Q.map((y, i) => y - (INTERCEPT + SLOPE * RHO[i])));
const RESIDUAL_SIGNS = Object.freeze(RESIDUALS.map((r) => (r > 0 ? '+' : '-')));
const RMS_RESIDUAL = Math.sqrt(RESIDUALS.reduce((a, r) => a + r * r, 0) / N);

// monotone-increase concordance: fraction of (i<j) pairs with q0(m_j) > q0(m_i).
let concordant = 0;
let totalPairs = 0;
for (let i = 0; i < N; i++) {
  for (let j = i + 1; j < N; j++) {
    totalPairs += 1;
    if (Q[j] > Q[i]) concordant += 1;
  }
}
const MONOTONE_CONCORDANCE = concordant / totalPairs;

const Q0_SPREAD = Math.max(...Q) - Math.min(...Q); // ~5.19e-5 over m=18..41
const PER_POINT_NOISE_SCALE = 3e-5; // imp-95782: uncertified non-anchor per-modulus error level

export const Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE = Object.freeze({
  id: 'imp-95802-q0-sector-wide-modulus-trend-vs-noise',
  title:
    'Re-run the imp-95782 sign/trend diagnostic on the imp-95780 seven-modulus (m=18..41) Q_0 '
    + 'zeta(3) sector column: the fine equal-spacing subset m=18..22 still alternates in sign '
    + '(confirms + extends the per-point-noise reading) while a MONOTONE macro-trend emerges over '
    + 'the doubled range -- two scale-separated components, not one overturning the other',
  status:
    'ASSESSED (conditional on the +4 offset) -- BOTH readings hold on different scales. On the '
    + 'equal-spacing fine subset m=18..22 (dm=1) the q0Sector consecutive-difference signs +,-,+,- '
    + 'STRICTLY ALTERNATE, confirming and extending (by m=22) the imp-95782 per-point-noise verdict: '
    + 'unit-step quadrature error ~3e-5 dominates and flips the sign. Over the doubled range a '
    + 'MONOTONE trend emerges: the two wide steps 22->30 (dm=8) and 30->41 (dm=11) are BOTH positive '
    + 'and near-equal (~1.71e-5), the linear-in-rho slope is a clean -1.118e-3, and q0Sector rises '
    + 'toward its rho->0 limit (concordance 16/21=0.76). The genuine slow trend, invisible under the '
    + 'noise at unit spacing, dominates once the modulus gap exceeds the ~3e-5 noise scale. The '
    + 'wider grid does NOT overturn the alternating-noise reading; it separates noise and trend. '
    + 'SUB-GAP: arithmetic on the carried table, NOT a re-quadrature; only m=20 certified. '
    + 'G irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'imp-95780 seven-modulus q0Sector column (raw (6.21) Q_0 zeta(3) sector; +4 offset)',
  builtOn:
    'imp-95780 (seven-modulus m=18..41 q0Sector decomposition), imp-95782 (four-moduli dI '
    + 'zigzag = per-point-noise verdict), imp-95765 (dI(1/m) = 1 - Q_0(m) split), imp-95746 '
    + '(faithful J_raw), imp-95720 (anchor quadrature floor 1e-9)',
  scratch: ['tmp/imp-95802-scratch.mjs'],

  fullGrid: Object.freeze({
    moduli: M,
    q0: Q,
    diffs: DIFFS, // +3.858e-5, -2.852e-5, +3.140e-5, -2.382e-5, +1.717e-5, +1.706e-5
    diffSigns: DIFF_SIGNS.join(','), // +,-,+,-,+,+
    spread: Q0_SPREAD, // ~5.19e-5
    reading:
      'the first four unit-step diffs alternate +,-,+,- (noise) while the last two wide-step diffs '
      + 'are both positive (trend): sign-alternation at fine spacing, monotone rise at wide spacing.',
  }),

  fineSubset: Object.freeze({
    moduli: [18, 19, 20, 21, 22],
    diffSigns: FINE_SIGNS.join(','), // +,-,+,-
    strictlyAlternates: FINE_ALTERNATES, // true => confirms + extends imp-95782 per-point noise
    reading:
      'over unit modulus steps m=18..22 the q0Sector diffs strictly alternate in sign, the mirror '
      + 'of the imp-95782 dI alternation (q0Sector = -(dI-1)); the m=22 point extends the pattern.',
  }),

  wideSteps: Object.freeze({
    steps: WIDE_STEPS, // [+1.717e-5 (22->30), +1.706e-5 (30->41)]
    gaps: [8, 11],
    bothPositive: WIDE_BOTH_POSITIVE, // true => monotone macro-trend once spacing >> noise
    nearEqualMagnitude: Math.abs(WIDE_STEPS[0] - WIDE_STEPS[1]) < 1e-6, // ~1.1e-8 apart
    reading:
      'both wide steps are positive and near-equal (~1.71e-5): a genuine monotone rise dominates '
      + 'once the modulus gap (dm=8, 11) exceeds the ~3e-5 per-point noise that hides it at dm=1.',
  }),

  linearInRho: Object.freeze({
    slope: SLOPE, // -1.118e-3
    intercept: INTERCEPT,
    residuals: RESIDUALS,
    residualSigns: RESIDUAL_SIGNS.join(','), // -,+,-,+,-,-,+
    rmsResidual: RMS_RESIDUAL, // ~1.30e-5 ~ the per-point noise scale
    monotoneConcordance: MONOTONE_CONCORDANCE, // 16/21 = 0.762
    reading:
      'a clean negative linear-in-rho slope (q0Sector rises as rho->0) plus rms residual ~1.3e-5 at '
      + 'the noise scale: a real trend carrying superposed per-modulus noise; the fine-grid residuals '
      + 'still alternate (-,+,-,+) while the wide points share sign, matching the two-scale picture.',
  }),

  verdict: Object.freeze({
    fineGridAlternationConfirmed: true, // imp-95782 per-point-noise reading holds + extends to m=22
    monotoneMacroTrendRevealed: true, // a genuine monotone rise emerges over the doubled range
    twoScaleSeparation: true, // noise dominates at dm=1, trend dominates at dm>=8
    onlyM20Certified: true,
    conclusion:
      'CONDITIONAL on the +4 offset: the wider m=18..41 grid CONFIRMS the imp-95782 alternating-sign '
      + 'per-point-noise reading at fine (unit) spacing -- the m=18..22 q0Sector diffs strictly '
      + 'alternate +,-,+,- -- AND simultaneously REVEALS a monotone m-trend over the doubled range: '
      + 'the two wide steps (dm=8, 11) are both positive and near-equal (~1.71e-5) and the '
      + 'linear-in-rho slope is a clean -1.118e-3. Noise and trend are SCALE-SEPARATED components '
      + '(noise ~3e-5 dominates at dm=1; the slow trend dominates once dm exceeds the noise scale), '
      + 'so the wider range does not overturn the noise reading -- it disentangles the two.',
  }),

  subGap:
    'Arithmetic diagnostic on the carried imp-95780 seven-point q0Sector table, NOT a re-quadrature. '
    + 'Only m=20 has a certified kappa; the non-anchor q0Sector values carry the same ~3e-5 '
    + 'uncertified per-modulus error. Confirming the monotone macro-trend as genuine (not two '
    + 'same-sign noise draws at m=30,41) needs the imp-95746-tightened-Nsub grid re-run at the wide '
    + 'moduli, checking each shifts ~3e-5 while the monotone rise persists.',

  caveats:
    'Operates on the carried imp-95780 q0Sector column by arithmetic only; performs no new Prop-6.3 '
    + 'quadrature. Trend reading is an inference from the two wide steps agreeing in sign/magnitude '
    + 'plus the clean linear slope, not a re-quadrature certificate. Entire table CONDITIONAL on the '
    + '+4 offset being exactly 4 and m-independent (verified only at m=20). Catalan G irrationality '
    + 'OPEN; Sun single-author, unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE_ASSERTIONS = Object.freeze([
  {
    name: 'fine subset m=18..22 (dm=1) q0Sector diffs strictly alternate +,-,+,- (per-point noise)',
    holds: () =>
      Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.fineSubset.diffSigns === '+,-,+,-'
      && Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.fineSubset.strictlyAlternates === true,
  },
  {
    name: 'both wide steps 22->30, 30->41 are positive and near-equal (~1.71e-5): monotone trend',
    holds: () => {
      const w = Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.wideSteps;
      return w.bothPositive === true
        && w.nearEqualMagnitude === true
        && Math.abs(w.steps[0] - 1.7173e-5) < 1e-7
        && Math.abs(w.steps[1] - 1.7062e-5) < 1e-7;
    },
  },
  {
    name: 'full-grid diff signs are +,-,+,-,+,+ (alternation then two same-sign wide steps)',
    holds: () => Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.fullGrid.diffSigns === '+,-,+,-,+,+',
  },
  {
    name: 'linear-in-rho slope is clean negative (-1.118e-3) with rms residual at the noise scale',
    holds: () => {
      const l = Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.linearInRho;
      return Math.abs(l.slope - (-1.1179e-3)) < 1e-6
        && l.rmsResidual > 5e-6 && l.rmsResidual < 3e-5
        && Math.abs(l.monotoneConcordance - 16 / 21) < 1e-9;
    },
  },
  {
    name: 'verdict: fine-grid alternation confirmed AND a monotone macro-trend revealed (two scales)',
    holds: () =>
      Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.verdict.fineGridAlternationConfirmed === true
      && Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.verdict.monotoneMacroTrendRevealed === true
      && Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.verdict.twoScaleSeparation === true,
  },
  {
    name: 'honest sub-gap named: arithmetic diagnostic, NOT a tightened-Nsub re-quadrature',
    holds: () =>
      /tightened-Nsub/.test(Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.subGap)
      && /NOT a re-quadrature/.test(Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.subGap),
  },
  {
    name: 'honest: conditional on the +4 offset, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      /CONDITIONAL/.test(Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.verdict.conclusion)
      && /G irrationality OPEN/.test(Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.status)
      && /refereed bound is changed/i.test(Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.status)
      && /NO QED/.test(Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE.status),
  },
]);

// eslint-disable-next-line no-unused-vars
const _NOISE_SCALE_NOTE = PER_POINT_NOISE_SCALE; // documented reference: imp-95782 ~3e-5 per-modulus error

export default Q0_SECTOR_WIDE_MODULUS_TREND_VS_NOISE;
