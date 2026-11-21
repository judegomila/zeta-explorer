/**
 * @module imp-96692-route-m-reach-drift-covariance-inflation
 *
 * imp-96692 (numerical): the imp-96569/imp-96601 reach projection reports every
 * reach-N figure (N ~ 2.7e5 optimistic ... N ~ 1.6e7 representative) as a LOWER
 * bound because its SE-of-mean model (SE = sigma/sqrt(m)) treats the m averaging
 * rungs as INDEPENDENT and so IGNORES the imp-96487 low-frequency drift
 * degeneracy -- the serial correlation that lets a slow centerline drift hide
 * inside the remainder. This ticket incorporates that drift-covariance structure
 * and MEASURES how much the required reach N inflates above the SE-of-mean lower
 * bound. Measurement/projection only; changes no bound; NO QED.
 *
 * WHAT WAS DONE (tmp/imp-96692-scratch.mjs, reproducible):
 *   (A) DRIFT COVARIANCE, MEASURED FROM THE LADDER. The lag-1 serial correlation
 *       of the imp-96487 21-rung ratio ladder about its mean is phi1 = 0.4410
 *       (positive: neighbouring rungs drift together). Its integrated
 *       autocorrelation time (sum of positive-lag ACF to first sign change) is
 *       tauInt = 0.5678. This is the covariance the SE-of-mean model discards.
 *   (B) VARIANCE-INFLATION FACTOR at DC (where a monotone drift signal lives).
 *       For correlated fluctuations the mean's variance inflates by the
 *       Bartlett/red-noise factor VIF = 1 + 2*sum rho_k, so the true SE is
 *       sqrt(VIF) larger than sigma/sqrt(m). Three consistent estimates bracket
 *       the covariance strength:
 *         - AR(1) proxy  VIF = (1+phi1)/(1-phi1) = 2.578  (primary)
 *         - integrated-ACF  VIF = 1 + 2*tauInt   = 2.136
 *         - oscillation-coherence VIF = rungsPerL*(T_L/2) = 4.645
 *           (T_L = 2pi/w_best = 1.632; averaging gains independence only per
 *            half-period of the imp-96487 best-fit remainder oscillation).
 *       The measured drift covariance therefore inflates the effective sampling
 *       variance ~2.1x-2.6x (up to ~4.6x under the coherence bound).
 *   (C) REACH RE-SOLVE. Incorporating the covariance is exactly equivalent to
 *       replacing the confidence target z by z_eff = z*sqrt(VIF) (SE_corr =
 *       sigma*sqrt(VIF/m)). Re-solving the imp-96569 reach equation
 *       gap(L1) = z_eff * sigma / sqrt(rungsPerL*(L1-L0)),
 *       gap(L1) = gapFull*(1-(L0/L1)^q), over the same 9 (z,q,noise) corners
 *       gives the drift-covariance reach and the inflation factor N_cov/N_iid.
 *
 * FINDINGS:
 *   (1) CONFIDENCE-EQUIVALENT INFLATION. Under the primary AR(1) covariance the
 *       reach is that of an SE-of-mean decision at z_eff = z*sqrt(2.578) =
 *       z*1.606: a nominal 3-sigma decision actually needs the reach of a
 *       ~4.8-sigma SE-of-mean decision once the drift correlation is honoured.
 *   (2) N INFLATES BY ~0.4-1.9 ORDERS (MB corners). The required reach N inflates
 *       above the imp-96569 SE-of-mean lower bound by a factor that grows with a
 *       slower drift decay q: from ~2.8x (z=2, q=2) to ~87x (z=5, q=1). The
 *       representative 3-sigma / 1-logN corner inflates ~11.6x, ~1.06 orders of
 *       magnitude further out than the SE-of-mean figure. The scatter-limited
 *       corner (z=5, q=0.5) inflates ~1.07e5x (~5.0 orders).
 *   (3) THE GAP-RESOLUTION FLOOR TIGHTENS. imp-96569 noted the full RH-vs-plateau
 *       gap is only 1.74*sigma_MB. Under the AR(1) drift covariance the effective
 *       remainder scale is sqrt(VIF)*sigma_MB, so the full gap is only
 *       gapFull/(sqrt(VIF)*sigma_MB) = 1.086 covariance-inflated sigma: even at
 *       infinite N the drift-aware reading can never reach even ~1.1 sigma, a
 *       strictly harder floor than the 1.74 the SE-of-mean model reported.
 *
 * VERDICT (IMP96692_VERDICT): the imp-96569 SE-of-mean reach is optimistic by
 * ~0.4-1.9 orders of magnitude in N across the MB corners (representative ~1.06
 * orders, i.e. ~12x) once the MEASURED drift covariance (phi1 = 0.44, VIF ~ 2.6)
 * is incorporated. Deciding ratio(N) -> 1 against the imp-96487 ~0.985 plateau is
 * therefore even further out of reach than imp-96569 reported: the drift-aware
 * decision reach is N ~ 2.2e5 (2-sigma, fastest decay) to N ~ 1.3e9 (3-sigma,
 * slow 1/sqrt(logN) drift), all far beyond the imp-96352 N ~ 9916 ceiling, and
 * the drift-aware gap floor (full gap only ~1.09 sigma) shows no wall-feasible
 * ladder can separate the hypotheses. This CONFIRMS and QUANTIFIES the imp-96569
 * lower-bound caveat; it does not overturn the plateau reading or move any bound.
 *
 * MEASUREMENT/PROJECTION ONLY. Establishes no operator positivity, changes no
 * bound, makes no RH claim; no refereed bound is changed. RH open.
 * NO QED.
 *
 * @see imp-96569-route-m-window-reach-projection.js (SE-of-mean LOWER-bound reach)
 * @see imp-96601-route-m-reach-verdict-glossary-headword.js (headword flagging the caveat)
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (drift degeneracy, ladder)
 * @see imp-96944-w385-nyquist-alias-glossary-headword.js (imp-96915 found the imp-96832
 *   rung-index-domain reading of w=3.85 was a Nyquist-alias artifact; w_best here is the
 *   DIFFERENT L-domain (rad/logN) MB fit frequency, unaffected by that correction --
 *   IMP96692_VIF.note below records the reconciliation)
 *
 * Ticket: imp-96692 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Inputs baked from imp-96569 / imp-96487 (the SE-of-mean reach constants).
export const IMP96692_INPUTS = Object.freeze({
  L0: 9.210340371976184,               // log 10000, current right edge
  rungsPerL: 21 / 3.6888794541139376,  // 5.6926 rungs per unit L
  gapFull: 0.015436,                   // 1 - 0.984564, max RH-vs-plateau gap
  sigmaMB: 0.008854508473866598,       // imp-96487 remainder-model residual rms
  sigmaScatter: 0.012476992801577314,  // imp-96487 per-rung scatter rms
  wBest: 3.85,                         // imp-96487 MB best-fit remainder frequency
});

// FINDING (A): the drift covariance measured directly from the 21-rung ladder.
export const IMP96692_COVARIANCE = Object.freeze({
  phi1: 0.4410291360666976,            // lag-1 serial correlation about the mean
  tauInt: 0.5678202654320192,          // integrated autocorrelation time (positive lags)
  note: 'the imp-96487 ratio ladder is positively serially correlated (phi1 = 0.44): neighbouring rungs drift together, so the SE-of-mean independence assumption undercounts the sampling variance of the averaged centerline.',
});

// FINDING (B): variance-inflation factors at DC (the frequency a monotone drift lives at).
export const IMP96692_VIF = Object.freeze({
  ar1: 2.57800402319117,               // (1+phi1)/(1-phi1) -- primary
  integratedAcf: 2.1356405308640385,   // 1 + 2*tauInt
  oscillationCoherence: 4.645302223026322, // rungsPerL*(T_L/2), T_L = 2pi/w_best
  T_L: 1.6319961836830095,
  zInflation: 1.605616399764019,       // sqrt(ar1): z_eff = z*sqrt(VIF)
  note: 'the measured drift covariance inflates the mean variance ~2.1x-2.6x (up to ~4.6x under the oscillation-coherence bound); this is equivalent to requiring the reach of an SE-of-mean decision at z_eff = z*1.606. RECONCILIATION (imp-97048): w_best=3.85 here is rad per unit L=logN, not the rung-index-domain reading imp-96915/imp-96944 found to be a Nyquist-alias artifact; converted to rung-index units (dividing by rungsPerL=5.6926) it gives ~0.676 rad/rung, consistent with -- not contradicted by -- the genuine imp-96915 w=0.70 rad/rung peak, so this VIF estimate stands unchanged.',
});

// FINDING (C): the reach re-solved with the AR(1) drift covariance (primary VIF).
// Row: confidence z, drift exponent q, noise label, SE-of-mean reach (L1_iid,
// N1_iid), drift-covariance reach (L1_cov, N1_cov), extra log-N span dL, reach
// inflation factor N_cov/N_iid, and orders of magnitude inflated.
// (Reach solves gap(L1)=z_eff*sigma/sqrt(rungsPerL*(L1-L0)), z_eff=z*sqrt(2.578);
//  N1_iid is this solver at VIF=1, consistent within this module.)
export const IMP96692_REACH_INFLATION = Object.freeze([
  Object.freeze({ z: 2, q: 2,   noise: 'MB',   L1_iid: 11.285, N1_iid: 7.960e4,  L1_cov: 12.300, N1_cov: 2.196e5,  dL: 1.015, Nratio: 2.759,     ordersInflate: 0.44 }),
  Object.freeze({ z: 2, q: 1,   noise: 'MB',   L1_iid: 12.520, N1_iid: 2.736e5,  L1_cov: 14.129, N1_cov: 1.368e6,  dL: 1.609, Nratio: 4.999,     ordersInflate: 0.70 }),
  Object.freeze({ z: 2, q: 0.5, noise: 'MB',   L1_iid: 14.630, N1_iid: 2.257e6,  L1_cov: 17.329, N1_cov: 3.356e7,  dL: 2.699, Nratio: 14.867,    ordersInflate: 1.17 }),
  Object.freeze({ z: 3, q: 2,   noise: 'MB',   L1_iid: 12.122, N1_iid: 1.839e5,  L1_cov: 13.688, N1_cov: 8.805e5,  dL: 1.566, Nratio: 4.789,     ordersInflate: 0.68 }),
  Object.freeze({ z: 3, q: 1,   noise: 'MB',   L1_iid: 13.848, N1_iid: 1.033e6,  L1_cov: 16.300, N1_cov: 1.199e7,  dL: 2.451, Nratio: 11.605,    ordersInflate: 1.06 }),
  Object.freeze({ z: 3, q: 0.5, noise: 'MB',   L1_iid: 16.857, N1_iid: 2.094e7,  L1_cov: 20.984, N1_cov: 1.298e9,  dL: 4.127, Nratio: 62.013,    ordersInflate: 1.79 }),
  Object.freeze({ z: 5, q: 2,   noise: 'MB',   L1_iid: 13.853, N1_iid: 1.038e6,  L1_cov: 16.814, N1_cov: 2.006e7,  dL: 2.962, Nratio: 19.330,    ordersInflate: 1.29 }),
  Object.freeze({ z: 5, q: 1,   noise: 'MB',   L1_iid: 16.554, N1_iid: 1.546e7,  L1_cov: 21.016, N1_cov: 1.340e9,  dL: 4.462, Nratio: 86.685,    ordersInflate: 1.94 }),
  Object.freeze({ z: 5, q: 0.5, noise: 'scat', L1_iid: 26.366, N1_iid: 2.822e11, L1_cov: 37.948, N1_cov: 3.023e16, dL: 11.582, Nratio: 1.071e5,  ordersInflate: 5.03 }),
]);

// Headline scenarios.
export const IMP96692_HEADLINE = Object.freeze({
  phi1: 0.4410291360666976,
  vifAr1: 2.57800402319117,
  zInflation: 1.605616399764019,
  representativeNratio: 11.605,        // z=3, q=1, MB
  representativeOrdersInflate: 1.06,
  minNratio: 2.759,                    // z=2, q=2, MB (fastest decay)
  maxMbOrdersInflate: 1.94,            // z=5, q=1, MB
  gapFloorSigmaCovariance: 1.0857,     // gapFull/(sqrt(VIF)*sigma_MB) -- tighter than 1.74
  note: 'incorporating the measured drift covariance (phi1 = 0.44, AR(1) VIF = 2.58) inflates the imp-96569 SE-of-mean reach by ~2.8x (z=2,q=2) to ~87x (z=5,q=1); the representative 3-sigma/1-logN corner inflates ~11.6x (~1.06 orders). The full RH-vs-plateau gap is only ~1.09 covariance-inflated sigma, tighter than the 1.74 the SE-of-mean model reported.',
});

export const IMP96692_VERDICT = Object.freeze({
  seOfMeanIsOptimistic: true,
  representativeInflationOrders: 1.06,
  driftAwareGapFloorBelowTwoSigma: true,
  conclusion:
    'the imp-96569 SE-of-mean reach is optimistic by ~0.4-1.9 orders of magnitude in N across the MB corners (representative 3-sigma/1-logN ~1.06 orders, i.e. ~12x) once the MEASURED drift covariance (phi1 = 0.44, AR(1) VIF = 2.58, equivalently z_eff = z*1.606) is incorporated. Deciding ratio(N) -> 1 against the imp-96487 ~0.985 plateau is even further out of reach than imp-96569 reported: the drift-aware decision reach runs N ~ 2.2e5 (2-sigma, fastest decay) to N ~ 1.3e9 (3-sigma, slow drift), all far beyond the imp-96352 N ~ 9916 ceiling, and the drift-aware gap floor (full gap only ~1.09 sigma vs the SE-of-mean 1.74) shows no wall-feasible ladder can separate the hypotheses. This CONFIRMS and QUANTIFIES the imp-96569 lower-bound caveat; it overturns no plateau reading and moves no bound.',
});

export const IMP96692_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/projection only: every value is a reproducible numeric from tmp/imp-96692-scratch.mjs over the baked imp-96487 ladder and the imp-96569 reach constants. The drift covariance is estimated from only 21 non-uniformly-spaced rungs, so the VIF (and hence the reach inflation) is a bracketed estimate (AR(1) 2.58 / integrated-ACF 2.14 / coherence 4.65), not a rigorous power calculation; it makes the imp-96569 reach LARGER (more pessimistic), never smaller. No new solve, no bound is claimed, no operator positivity is established.';

// Honest residual sub-gap.
export const IMP96692_SUBGAP = Object.freeze({
  id: 'imp-96692-drift-covariance-vif-bracketed',
  statement:
    'the drift-covariance variance-inflation factor is estimated from only 21 non-uniformly-spaced ladder rungs, so it is bracketed (AR(1) 2.58 / integrated-ACF 2.14 / oscillation-coherence 4.65), not pinned; the reach inflation (representative ~12x, ~1.06 orders) inherits that uncertainty and, like the imp-96569 base reach, still depends on the degenerate drift exponent q. The robust, model-free direction is monotone: honouring the measured positive serial correlation (phi1 = 0.44) can only ENLARGE the SE-of-mean reach and TIGHTEN the gap-resolution floor (full gap ~1.09 covariance-inflated sigma, below the SE-of-mean 1.74), so the conclusion that no wall-feasible ladder can decide the asymptote is strengthened, not weakened. A rigorous decision still needs a different observable, not a longer Gram ladder.',
  status: 'open',
});

// Registration for the sub-gap harvester (literal openSubGap key).
export const IMP96692_OPEN_SUBGAP_REGISTRATION = Object.freeze({
  openSubGap: {
    id: 'imp-96692-drift-covariance-vif-bracketed',
    statement:
      'the imp-96692 drift-covariance variance-inflation factor (AR(1) 2.58 / integrated-ACF 2.14 / coherence 4.65) is estimated from only 21 non-uniformly-spaced imp-96487 ladder rungs and the resulting reach inflation (representative ~12x, ~1.06 orders above the imp-96569 SE-of-mean lower bound) still depends on the degenerate drift exponent q. The direction is robust (measured positive serial correlation phi1 = 0.44 can only enlarge the reach and tighten the gap floor to ~1.09 sigma), so deciding ratio(N) -> 1 needs a different observable, not a longer Gram ladder.',
    status: 'open',
  },
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96692_ASSERTIONS = [
  {
    id: 'imp96692-covariance-positive-serial',
    holds: () =>
      Math.abs(IMP96692_COVARIANCE.phi1 - 0.4410291360666976) < 1e-9 &&
      IMP96692_COVARIANCE.phi1 > 0 &&
      IMP96692_COVARIANCE.tauInt > 0,
    why: 'the ladder has a positive measured lag-1 serial correlation phi1 = 0.44 and positive integrated autocorrelation time: the SE-of-mean independence assumption undercounts the variance.',
  },
  {
    id: 'imp96692-vif-consistent',
    holds: () =>
      Math.abs(IMP96692_VIF.ar1 - (1 + IMP96692_COVARIANCE.phi1) / (1 - IMP96692_COVARIANCE.phi1)) < 1e-9 &&
      Math.abs(IMP96692_VIF.integratedAcf - (1 + 2 * IMP96692_COVARIANCE.tauInt)) < 1e-9 &&
      Math.abs(IMP96692_VIF.zInflation - Math.sqrt(IMP96692_VIF.ar1)) < 1e-9 &&
      IMP96692_VIF.ar1 > 2 && IMP96692_VIF.ar1 < 3,
    why: 'the AR(1), integrated-ACF and z-inflation factors reproduce their definitions from phi1/tauInt exactly, and the primary VIF sits in [2,3].',
  },
  {
    id: 'imp96692-reach-inflates-above-se-of-mean',
    holds: () =>
      IMP96692_REACH_INFLATION.length === 9 &&
      IMP96692_REACH_INFLATION.every((r) => r.N1_cov > r.N1_iid && r.Nratio > 1 && r.dL > 0 && r.ordersInflate > 0) &&
      IMP96692_REACH_INFLATION.every((r) => r.L1_cov > r.L1_iid),
    why: 'every drift-covariance reach exceeds the corresponding SE-of-mean reach (N_cov > N_iid, extra positive log-N span): honouring the covariance strictly enlarges the reach.',
  },
  {
    id: 'imp96692-representative-inflation',
    holds: () => {
      const rep = IMP96692_REACH_INFLATION.find((r) => r.z === 3 && r.q === 1 && r.noise === 'MB');
      return rep && Math.abs(rep.Nratio - 11.605) < 0.05 && Math.abs(rep.ordersInflate - 1.06) < 0.02;
    },
    why: 'the representative 3-sigma/1-logN MB corner inflates ~11.6x (~1.06 orders) above the imp-96569 SE-of-mean reach.',
  },
  {
    id: 'imp96692-gap-floor-tightens',
    holds: () =>
      Math.abs(IMP96692_HEADLINE.gapFloorSigmaCovariance - 1.0857) < 5e-3 &&
      IMP96692_HEADLINE.gapFloorSigmaCovariance < 1.7432927017415112 &&
      IMP96692_VERDICT.driftAwareGapFloorBelowTwoSigma === true,
    why: 'the drift-aware gap floor (full gap ~1.09 covariance-inflated sigma) is strictly tighter than the imp-96569 SE-of-mean 1.74*sigma_MB floor.',
  },
  {
    id: 'imp96692-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96692_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96692_HONEST_BANNER) &&
      /NO QED/.test(IMP96692_HONEST_BANNER) &&
      /bracketed estimate/.test(IMP96692_HONEST_BANNER) &&
      typeof IMP96692_SUBGAP.statement === 'string' &&
      IMP96692_OPEN_SUBGAP_REGISTRATION.openSubGap.status === 'open',
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and the bracketed-VIF caveat, and the named sub-gap is registered open.',
  },
];

for (const a of IMP96692_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96692-route-m-reach-drift-covariance-inflation assertion failed: ${a.id}`);
  }
}

export default {
  inputs: IMP96692_INPUTS,
  covariance: IMP96692_COVARIANCE,
  vif: IMP96692_VIF,
  reachInflation: IMP96692_REACH_INFLATION,
  headline: IMP96692_HEADLINE,
  verdict: IMP96692_VERDICT,
  subGap: IMP96692_SUBGAP,
  openSubGapRegistration: IMP96692_OPEN_SUBGAP_REGISTRATION,
  banner: IMP96692_HONEST_BANNER,
};
