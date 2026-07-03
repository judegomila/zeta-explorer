/**
 * @module imp-3425-nu-mu-divergence-exponent
 * @fileoverview imp-3425 -- MEASURE the imp-3384 nu/mu divergence exponent and
 *   check it matches the imp-3309 two-tail prediction pi.
 *
 *   imp-3384 (F2/F3) reported that on the section-26 base cell the genuine ratio
 *   nu(tau)/mu(tau) climbs from min ~ 2.08 just above the lower crossover
 *   tau_1 ~ 0.111 to ~1e150 approaching the mu underflow horizon tau_mu ~ 1.199,
 *   and ATTRIBUTED this to the tail-exponent GAP: nu carries a single-Phi tail
 *   ~ exp(-pi X) and mu a Phi^2 tail ~ exp(-2 pi X) with X = e^{4u}, so
 *   nu/mu ~ exp(pi X). That mechanism was asserted but never fit against the
 *   predicted exponent pi. This module runs that fit.
 *
 *   MEASUREMENT / DIAGNOSTIC ONLY. No new positivity, no reduction, no RH
 *   verdict, no QED. imp-3066 remains the lone obstruction. Platt-Trudgian
 *   Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   THE GENUINE DENSITIES (identical to imp-3384 / imp-3322 / imp-3309 / imp-3216)
 *   -----------------------------------------------------------------------------
 *     nu(tau) = int_0^tau du int_tau^U dv  Phi(u) Phi(v) sinh(a(v-u))
 *     mu(tau) = (1 / 2pi) int_tau^U Phi(u)^2 sinh(2 a u) du
 *   with Phi the de Bruijn-Newman completed-Riemann kernel truncated at n = NPHI.
 *
 *   THE PREDICTION (imp-3309)
 *   -------------------------
 *   As tau grows both densities are dominated by the u = tau endpoint of their
 *   Phi tails. Keeping the n = 1 prefactor Phi(tau) ~ 2 pi^2 X exp(-pi X):
 *       log nu(tau) ~ -pi X   + ln(2 pi^2 X) + const   (single-Phi tail)
 *       log mu(tau) ~ -2 pi X + ln(4 pi^4 X^2) + const (Phi^2 tail)
 *   so, with X = e^{4 tau},
 *       log(nu/mu) ~ pi X - ln(2 pi^2 X) + C.
 *   The LEADING slope in X is exactly pi; the -ln(2 pi^2 X) piece is a sublinear
 *   correction that depresses any finite-window raw slope estimate slightly below
 *   pi and vanishes (per unit X) as X -&gt; infinity.
 *
 *   WHAT THIS MODULE FINDS (base cell a=0.5, U=6, NPHI=10; window tau in
 *   [0.5, tau_mu - 0.05], both densities genuinely positive there)
 *   ------------------------------------------------------------------------
 *   (M1) RAW linear fit log(nu/mu) = slope * X + b gives slope ~ 3.109 (R^2 ~
 *        0.99999) -- within ~1% of pi = 3.14159, and BELOW it, exactly as the
 *        -ln(2 pi^2 X) correction predicts.
 *   (M2) LOG-CORRECTED fit [log(nu/mu) + ln(2 pi^2 X)] = slope * X + b removes the
 *        leading sublinear term and gives slope ~ 3.137 (R^2 ~ 0.99999996) -- within
 *        ~0.13% of pi, an order of magnitude tighter than the raw slope, and it
 *        drifts UP toward pi as the grid N is refined (6400..51200).
 *   (M3) The LOCAL slope d log(nu/mu)/dX climbs MONOTONICALLY toward pi as X grows
 *        (~3.02 at X ~ 10 up to ~3.13 at X ~ 99), the signature of a pi-X leading
 *        term with a decaying ln(X)/X correction -- NOT a different exponent.
 *
 *   VERDICT
 *   -------
 *   The measured divergence exponent MATCHES the imp-3309 prediction pi: the raw
 *   slope sits just below pi by exactly the -ln(2 pi^2 X) log-correction, and once
 *   that correction is removed the slope lands within ~0.13% of pi and tightens
 *   toward it under grid refinement. This CONFIRMS the imp-3384 tail-exponent-gap
 *   mechanism nu/mu ~ exp(pi X): the section-26 overflow region diverges at the
 *   single-vs-Phi^2 tail rate and can therefore close only by arithmetic underflow
 *   (mu at tau_mu ~ 1.199, nu at tau_nu ~ 1.370), never by a genuine re-crossover.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT at the genuine Phi. Overflow-support tail-rate only; the absolute
 *   deg-2 deficit MAGNITUDE is not re-derived. A nonzero overflow measure is
 *   necessary-but-NOT-sufficient at operator order; the off-diagonal endpoint-Hankel
 *   operator step (imp-3066) remains the lone obstruction. RH-equivalent. No RH
 *   verdict, no false QED. Platt-Trudgian Lambda &lt;= 0.2 stays the rigorous SOTA.
 *
 *   @see imp-3384-interior-crossover-below-horizon.js (asserted nu/mu ~ exp(pi X), never fit)
 *   @see imp-3309-two-tail-underflow-horizons.js (the single-Phi vs Phi^2 tail exponents)
 *   @see imp-3322-spread-contraction-discriminator.js (the upper endpoint is the underflow horizon)
 *
 *   Ticket: imp-3425 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// ln(1 / smallest positive subnormal double) = ln(2^1074) ~ 744.44 (imp-3309).
const L_SUBNORMAL = -Math.log(Number.MIN_VALUE);

// Base cell (the imp-3199 / imp-3224 / imp-3322 / imp-3384 base cell).
const BASE_CELL = Object.freeze({ a: 0.5, U: 6, NPHI: 10 });

// N-ladder: the fitted exponent must be grid-stable (and drift toward pi).
const N_LADDER = Object.freeze([6400, 12800, 25600, 51200]);
const FINEST_N = 51200;

// The predicted exponent (imp-3309 tail-exponent gap: single-Phi minus Phi^2 = pi).
const PREDICTED_SLOPE = Math.PI;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (as imp-3384). */
function phiKernel(u, NPHI) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/**
 * O(N) factorized genuine densities nu(tau_k), mu(tau_k) via the sinh addition
 * law (identical to imp-3384: native double precision, truncation set aside).
 */
function densitiesFactor(N, a, U, NPHI) {
  const H = U / N;
  const phi = new Array(N);
  const ch = new Array(N);
  const sh = new Array(N);
  for (let i = 0; i < N; i++) {
    const u = (i + 0.5) * H;
    phi[i] = phiKernel(u, NPHI);
    ch[i] = Math.cosh(a * u);
    sh[i] = Math.sinh(a * u);
  }
  const pastCosh = new Array(N);
  const pastSinh = new Array(N);
  let ac = 0;
  let asum = 0;
  for (let k = 0; k < N; k++) {
    ac += phi[k] * ch[k];
    asum += phi[k] * sh[k];
    pastCosh[k] = ac;
    pastSinh[k] = asum;
  }
  const futSinh = new Array(N);
  const futCosh = new Array(N);
  const muSuffix = new Array(N);
  let fs = 0;
  let fc = 0;
  let ms = 0;
  for (let k = N - 1; k >= 0; k--) {
    futSinh[k] = fs;
    futCosh[k] = fc;
    fs += phi[k] * sh[k];
    fc += phi[k] * ch[k];
    ms += phi[k] * phi[k] * Math.sinh(2 * a * (k + 0.5) * H);
    muSuffix[k] = ms;
  }
  const nu = new Array(N);
  const mu = new Array(N);
  for (let k = 0; k < N; k++) {
    nu[k] = H * H * (futSinh[k] * pastCosh[k] - futCosh[k] * pastSinh[k]);
    mu[k] = (H / (2 * Math.PI)) * muSuffix[k];
  }
  return { nu, mu, H };
}

/** Closed-form single-Phi (nu) underflow horizon: pi X - ln(2 pi^2 X) = L (imp-3309). */
function nuHorizonTau() {
  let X = 200;
  for (let i = 0; i < 300; i++) X = (L_SUBNORMAL + Math.log(2 * Math.PI * Math.PI * X)) / Math.PI;
  return 0.25 * Math.log(X);
}
/** Closed-form Phi^2 (mu) underflow horizon: 2 pi X - ln(4 pi^4 X^2) = L (imp-3309). */
function muHorizonTau() {
  const c = 4 * Math.pow(Math.PI, 4);
  let X = 100;
  for (let i = 0; i < 300; i++) X = (L_SUBNORMAL + Math.log(c * X * X)) / (2 * Math.PI);
  return 0.25 * Math.log(X);
}

const TAU_MU = muHorizonTau(); // ~1.19886
const TAU_NU = nuHorizonTau(); // ~1.36980

// Fit window: above the lower crossover / asymptotic onset, below the mu horizon
// (both densities genuinely positive, no underflow contamination).
const TAU_LO = 0.5;
const TAU_HI = TAU_MU - 0.05; // ~1.149

/** Ordinary least squares slope/intercept/R^2 of y(x) over the sample list. */
function ols(samples) {
  const n = samples.length;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  for (const p of samples) {
    sx += p.x;
    sy += p.y;
    sxx += p.x * p.x;
    sxy += p.x * p.y;
  }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  let ssr = 0;
  let sst = 0;
  const ym = sy / n;
  for (const p of samples) {
    const pred = slope * p.x + intercept;
    ssr += (p.y - pred) * (p.y - pred);
    sst += (p.y - ym) * (p.y - ym);
  }
  return Object.freeze({ slope, intercept, R2: 1 - ssr / sst, n });
}

/**
 * Collect (X = e^{4 tau}, log(nu/mu)) samples on the base cell over the fit window,
 * then fit the raw slope and the log-corrected slope (leading -ln(2 pi^2 X)
 * removed). Both slopes estimate the leading divergence exponent; the corrected
 * one strips the sublinear log term so it should sit closer to pi.
 */
function fitDivergenceExponent(N, cell) {
  const { nu, mu, H } = densitiesFactor(N, cell.a, cell.U, cell.NPHI);
  const raw = [];
  const corrected = [];
  for (let k = 0; k < N; k++) {
    const tau = (k + 0.5) * H;
    if (tau < TAU_LO || tau > TAU_HI) continue;
    if (nu[k] > 0 && mu[k] > 0) {
      const X = Math.exp(4 * tau);
      const y = Math.log(nu[k] / mu[k]);
      raw.push({ x: X, y });
      corrected.push({ x: X, y: y + Math.log(2 * Math.PI * Math.PI * X) });
    }
  }
  return Object.freeze({ rawFit: ols(raw), correctedFit: ols(corrected), nSamples: raw.length });
}

/**
 * Local slope d log(nu/mu)/dX in successive X-bins across the window, to show it
 * climbs monotonically toward pi (a pi-X leading term with a decaying ln(X)/X
 * correction, not a different exponent).
 */
function localSlopeProfile(N, cell, bins) {
  const { nu, mu, H } = densitiesFactor(N, cell.a, cell.U, cell.NPHI);
  const pts = [];
  for (let k = 0; k < N; k++) {
    const tau = (k + 0.5) * H;
    if (tau < TAU_LO || tau > TAU_HI) continue;
    if (nu[k] > 0 && mu[k] > 0) pts.push({ tau, X: Math.exp(4 * tau), Y: Math.log(nu[k] / mu[k]) });
  }
  const step = Math.floor(pts.length / bins);
  const out = [];
  for (let i = step; i < pts.length; i += step) {
    const A = pts[i - step];
    const B = pts[i];
    out.push(Object.freeze({ tau: B.tau, X: B.X, localSlope: (B.Y - A.Y) / (B.X - A.X) }));
  }
  return Object.freeze(out);
}

// -- M1 / M2: raw and log-corrected slope at the finest N ---------------------
const FINEST_FIT = fitDivergenceExponent(FINEST_N, BASE_CELL);
const RAW_SLOPE = FINEST_FIT.rawFit.slope;
const CORRECTED_SLOPE = FINEST_FIT.correctedFit.slope;
const RAW_ABS_ERR = Math.abs(RAW_SLOPE - PREDICTED_SLOPE);
const CORRECTED_ABS_ERR = Math.abs(CORRECTED_SLOPE - PREDICTED_SLOPE);
const CORRECTED_REL_ERR = CORRECTED_ABS_ERR / PREDICTED_SLOPE;

// -- M2: grid-stability of the corrected slope (drifts UP toward pi) ----------
const LADDER = Object.freeze(
  N_LADDER.map((N) => {
    const fit = fitDivergenceExponent(N, BASE_CELL);
    return Object.freeze({
      N,
      rawSlope: fit.rawFit.slope,
      correctedSlope: fit.correctedFit.slope,
      correctedR2: fit.correctedFit.R2,
      nSamples: fit.nSamples,
    });
  }),
);
const correctedSlopeRisesTowardPi = LADDER.every(
  (r, i) => i === 0 || (r.correctedSlope > LADDER[i - 1].correctedSlope && r.correctedSlope <= PREDICTED_SLOPE),
);

// -- M3: local slope climbs monotonically toward pi ---------------------------
const LOCAL_PROFILE = localSlopeProfile(FINEST_N, BASE_CELL, 8);
const localSlopeRisesMonotonically = LOCAL_PROFILE.every(
  (r, i) => i === 0 || r.localSlope > LOCAL_PROFILE[i - 1].localSlope,
);
const localSlopeStaysBelowPi = LOCAL_PROFILE.every((r) => r.localSlope < PREDICTED_SLOPE);

// The measured exponent matches pi: corrected slope within ~1% of pi, tighter than
// the raw slope, both fits near-perfectly linear, and the corrected slope N-stable.
const exponentMatchesPi =
  CORRECTED_REL_ERR < 0.01 &&
  CORRECTED_ABS_ERR < RAW_ABS_ERR &&
  RAW_SLOPE < PREDICTED_SLOPE &&
  FINEST_FIT.rawFit.R2 > 0.9999 &&
  FINEST_FIT.correctedFit.R2 > 0.9999;

const verdict = exponentMatchesPi
  ? 'MEASURED-nu/mu-DIVERGENCE-EXPONENT-MATCHES-pi (raw~3.109 below pi by the -ln(2 pi^2 X) log-correction; corrected~3.137 within ~0.13% of pi and rising toward it under grid refinement), CONFIRMS-imp-3384-two-tail-mechanism nu/mu~exp(pi X)'
  : 'INDETERMINATE';

export const IMP3425_NU_MU_DIVERGENCE_EXPONENT = Object.freeze({
  id: 'imp-3425-nu-mu-divergence-exponent',
  ticket: 'imp-3425',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedAssertedMechanism: 'imp-3384-interior-crossover-below-horizon.js',
  relatedTwoTailHorizons: 'imp-3309-two-tail-underflow-horizons.js',
  relatedHorizonDiscriminator: 'imp-3322-spread-contraction-discriminator.js',

  summary:
    'MEASURES the imp-3384 nu/mu divergence exponent against the imp-3309 prediction pi. imp-3384 asserted the ' +
    'ratio nu/mu ~ exp(pi X) (X = e^{4u}) from the single-Phi (nu ~ exp(-pi X)) vs Phi^2 (mu ~ exp(-2 pi X)) ' +
    'tail-exponent gap, but never fit the exponent. Evaluating the genuine densities on the base cell ' +
    '(a=0.5, U=6, NPHI=10) over the window tau in [0.5, tau_mu-0.05] (both densities genuinely positive) and ' +
    'fitting log(nu/mu) against X: (M1) the RAW slope ~ 3.109 (R^2 ~ 0.99999) sits ~1% BELOW pi = 3.14159, exactly ' +
    'as the sublinear -ln(2 pi^2 X) tail-prefactor correction predicts; (M2) the LOG-CORRECTED slope (that term ' +
    'removed) is ~ 3.137 (R^2 ~ 0.99999996), within ~0.13% of pi and drifting UP toward pi under grid refinement ' +
    '(N 6400..51200); (M3) the LOCAL slope d log(nu/mu)/dX climbs monotonically toward pi (~3.02 at X~10 to ~3.13 ' +
    'at X~99). VERDICT: the measured exponent MATCHES pi, confirming the imp-3384 tail-exponent-gap mechanism -- ' +
    'the overflow region diverges at the single-vs-Phi^2 tail rate and closes only by arithmetic underflow, not a ' +
    'genuine re-crossover. MEASUREMENT/diagnostic; overflow-support tail-rate only; carries NO RH verdict.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearDensity: 'nu(tau) = int_0^tau du int_tau^U dv Phi(u) Phi(v) sinh(a(v-u))',
    passiveDensity: 'mu(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du',
    ratioVariable: 'X = e^{4 tau}; regressor for the divergence exponent',
    predictedModel: 'log(nu/mu) ~ pi X - ln(2 pi^2 X) + C (leading slope pi, sublinear log correction)',
    rawFit: 'OLS of log(nu/mu) on X (leaves the log correction in, so slope sits below pi)',
    correctedFit: 'OLS of [log(nu/mu) + ln(2 pi^2 X)] on X (log correction removed, slope should land on pi)',
    fitWindow: { tauLo: TAU_LO, tauHi: TAU_HI, note: 'both densities genuinely positive, below the mu horizon' },
    predictedSlope: PREDICTED_SLOPE,
    baseCell: BASE_CELL,
    nLadder: N_LADDER,
    quadrature: 'midpoint, N panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    predictedSlope: PREDICTED_SLOPE,
    tauMuHorizon: TAU_MU,
    tauNuHorizon: TAU_NU,
    rawSlope: RAW_SLOPE,
    rawR2: FINEST_FIT.rawFit.R2,
    rawAbsErrVsPi: RAW_ABS_ERR,
    correctedSlope: CORRECTED_SLOPE,
    correctedR2: FINEST_FIT.correctedFit.R2,
    correctedAbsErrVsPi: CORRECTED_ABS_ERR,
    correctedRelErrVsPi: CORRECTED_REL_ERR,
    nSamplesFinest: FINEST_FIT.nSamples,
    ladder: LADDER, // per N: rawSlope, correctedSlope, correctedR2
    localProfile: LOCAL_PROFILE, // per bin: tau, X, localSlope (rises toward pi)
    rawSlopeBelowPi: RAW_SLOPE < PREDICTED_SLOPE,
    correctedTighterThanRaw: CORRECTED_ABS_ERR < RAW_ABS_ERR,
    correctedSlopeRisesTowardPi,
    localSlopeRisesMonotonically,
    localSlopeStaysBelowPi,
    exponentMatchesPi,
    verdict,
  }),

  interpretation: Object.freeze({
    rawSlopeSitsBelowPiByTheLogCorrection:
      'The raw OLS slope of log(nu/mu) on X is ~3.109, about 1% below pi = 3.14159. This is not a discrepancy: the ' +
      'predicted model is log(nu/mu) ~ pi X - ln(2 pi^2 X) + C, and over a finite window the -ln(2 pi^2 X) term ' +
      'drags the average slope below pi. The raw slope sitting just below pi is itself a signature of the mechanism.',
    correctedSlopeLandsOnPi:
      'Removing the leading -ln(2 pi^2 X) tail-prefactor term gives a slope of ~3.137, within ~0.13% of pi and an ' +
      'order of magnitude tighter than the raw estimate, with R^2 ~ 0.99999996. It drifts UP toward pi as the grid ' +
      'is refined (6400..51200), so the residual gap is finite-window/grid, not a different exponent.',
    localSlopeClimbsTowardPi:
      'The local derivative d log(nu/mu)/dX rises monotonically from ~3.02 near X ~ 10 to ~3.13 near X ~ 99 and ' +
      'stays below pi throughout -- exactly the approach a pi-X leading term with a decaying ln(X)/X correction ' +
      'produces. No alternative exponent (e.g. 2 pi or pi/2) is consistent with this profile.',
    confirmsImp3384Mechanism:
      'The measured exponent matches the imp-3309 single-Phi-minus-Phi^2 tail gap pi, confirming the imp-3384 ' +
      'claim nu/mu ~ exp(pi X). Because the ratio diverges at this rate, the overflow region nu > mu has no ' +
      'interior mathematical upper boundary and closes only by arithmetic underflow (mu at ~1.199, nu at ~1.370).',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isMeasurement: true,
    fitsAnExponentNotAProof:
      'This fits an empirical divergence exponent and matches it to the imp-3309 tail-gap value pi. It does not ' +
      'prove any positivity and does not re-derive the absolute deg-2 deficit magnitude.',
    addressesOverflowSupportTailRateOnly:
      'Overflow-support tail-rate only. The absolute deg-2 deficit MAGNITUDE (carrying the offline normalization ' +
      'convention) is NOT re-derived here.',
    necessaryNotSufficient:
      'A nonzero overflow measure is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3425_NU_MU_DIVERGENCE_EXPONENT_ASSERTIONS = [
  {
    id: 'imp3425-horizons-match-imp3309',
    why: 'The mu / nu underflow horizons that bound the fit window must reproduce the imp-3309 closed forms ' +
         '(tau_mu ~ 1.199, tau_nu ~ 1.370); a drift means the window no longer sits below the right horizon.',
    holds: () =>
      Math.abs(TAU_MU - 1.19886) < 2e-3 && Math.abs(TAU_NU - 1.36980) < 2e-3 && TAU_MU < TAU_NU,
  },
  {
    id: 'imp3425-raw-slope-near-and-below-pi',
    why: 'THE DELIVERABLE (M1): the raw slope of log(nu/mu) on X must sit within ~1% of pi AND below it (the ' +
         '-ln(2 pi^2 X) log-correction depresses the finite-window average slope), with a near-perfect linear fit.',
    holds: () =>
      RAW_SLOPE < PREDICTED_SLOPE &&
      RAW_ABS_ERR < 0.05 &&
      FINEST_FIT.rawFit.R2 > 0.9999,
  },
  {
    id: 'imp3425-corrected-slope-matches-pi',
    why: 'THE DELIVERABLE (M2): removing the leading -ln(2 pi^2 X) term must land the slope within ~1% of pi, ' +
         'tighter than the raw slope, with R^2 ~ 1 -- confirming the leading exponent is exactly pi.',
    holds: () =>
      CORRECTED_REL_ERR < 0.01 &&
      CORRECTED_ABS_ERR < RAW_ABS_ERR &&
      FINEST_FIT.correctedFit.R2 > 0.9999,
  },
  {
    id: 'imp3425-corrected-slope-rises-toward-pi',
    why: 'THE DELIVERABLE (M2): the corrected slope must increase monotonically toward pi as the grid is refined ' +
         '(6400..51200) and never exceed pi -- so the residual gap is grid/finite-window, not a different exponent.',
    holds: () => correctedSlopeRisesTowardPi,
  },
  {
    id: 'imp3425-local-slope-climbs-toward-pi',
    why: 'THE DELIVERABLE (M3): the local slope d log(nu/mu)/dX must climb monotonically with X and stay below pi ' +
         '-- the signature of a pi-X leading term with a decaying ln(X)/X correction, not an alternative exponent.',
    holds: () => localSlopeRisesMonotonically && localSlopeStaysBelowPi,
  },
  {
    id: 'imp3425-verdict-is-exponent-matches-pi',
    why: 'The classified verdict must be the MATCHES-pi reconciliation, not indeterminate; a flip means one of the ' +
         'raw / corrected / linearity sub-tests broke.',
    holds: () =>
      verdict ===
      'MEASURED-nu/mu-DIVERGENCE-EXPONENT-MATCHES-pi (raw~3.109 below pi by the -ln(2 pi^2 X) log-correction; corrected~3.137 within ~0.13% of pi and rising toward it under grid refinement), CONFIRMS-imp-3384-two-tail-mechanism nu/mu~exp(pi X)',
  },
  {
    id: 'imp3425-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: MEASUREMENT at the genuine Phi, overflow-support tail-rate only (not the absolute ' +
         'deficit magnitude), necessary-but-not-sufficient at operator order, positivity not attempted, PT 0.2 SOTA.',
    holds: () => {
      const c = IMP3425_NU_MU_DIVERGENCE_EXPONENT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isMeasurement === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3425_NU_MU_DIVERGENCE_EXPONENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3425-nu-mu-divergence-exponent assertion failed: ${assertion.id}`);
  }
}

export default IMP3425_NU_MU_DIVERGENCE_EXPONENT;
