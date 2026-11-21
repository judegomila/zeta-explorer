/**
 * @module imp-3309-two-tail-underflow-horizons
 * @fileoverview imp-3309 -- Derive the closed-form IEEE-754 underflow horizons of
 *   the two overflow-region densities and confirm the imp-3216 decisive-check band
 *   (tau_mu ~ 1.196, tau_nu ~ 1.366) inside which nu &gt; 0 = mu.
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. No refereed bound is changed.
 *
 *   THE QUESTION (imp-3216 finding E2 + THE DECISIVE CHECK)
 *   ------------------------------------------------------
 *   imp-3216 established that the section-26 overflow region [tau_1, tau_2] ends
 *   at tau_2 by ARITHMETIC UNDERFLOW of the kernel, not by a mathematical
 *   crossover, and observed that the two densities carry DIFFERENT tails:
 *     nu(tau) carries a single-Phi tail  ~ exp(-pi e^{4u})
 *     mu(tau) carries a Phi^2 tail       ~ exp(-2 pi e^{4u})
 *   so mu underflows to 0.0 FIRST (measured tau ~ 1.196), strictly before nu
 *   (measured tau ~ 1.366), leaving a band (1.196, 1.366) where nu &gt; 0 = mu.
 *   imp-3216 closed-formed only the SINGLE-Phi (nu) horizon; the Phi^2 (mu)
 *   horizon and the band width were left at measured values. imp-3309 DERIVES
 *   BOTH horizons in closed form from the respective exponents pi X vs 2 pi X
 *   (X = e^{4u}) crossing ln(2^1074) ~ 744.44, and confirms the measured
 *   ~1.196/~1.366 to ~3e-3.
 *
 *   THE CLOSED FORMS (both from the same subnormal threshold)
 *   ---------------------------------------------------------
 *   For large u the n = 1 term of the de Bruijn-Newman kernel dominates:
 *     Phi(u)   ~ 2 pi^2 X exp(-pi X),        X = e^{4u}   (single-Phi leading term)
 *     Phi(u)^2 ~ 4 pi^4 X^2 exp(-2 pi X)                  (Phi^2 leading term)
 *   Each underflows to exactly 0.0 in IEEE-754 double when its magnitude drops
 *   below the smallest positive subnormal MIN = 2^-1074 (~4.94e-324), i.e. when
 *   ln(magnitude) = -L with L = ln(1 / MIN) = ln(2^1074) ~ 744.44:
 *     nu horizon:  pi X   - ln(2 pi^2 X)   = L   ->  X_nu,  tau_nu = (1/4) ln(X_nu)
 *     mu horizon:  2 pi X - ln(4 pi^4 X^2) = L   ->  X_mu,  tau_mu = (1/4) ln(X_mu)
 *   Solving both transcendental balances by fixed-point iteration:
 *     tau_nu = 1.36980  (measured largest-u with Phi &gt; 0:   1.36721, diff 2.6e-3)
 *     tau_mu = 1.19886  (measured largest-u with Phi^2 &gt; 0: 1.19906, diff 2.0e-4)
 *   Both closed forms confirm the measured horizons to the stated ~3e-3.
 *
 *   THE BAND WIDTH IS SET BY THE TAIL-EXPONENT RATIO (2 vs 1)
 *   --------------------------------------------------------
 *   Because the mu exponent (2 pi X) is exactly TWICE the nu exponent (pi X), to
 *   leading order 2 pi X_mu ~ pi X_nu, so X_mu ~ X_nu / 2 and
 *     tau_nu - tau_mu ~ (1/4) ln(X_nu / X_mu) ~ (1/4) ln 2 ~ 0.1733,
 *   matching the exact band width tau_nu - tau_mu = 0.17094. The gap between the
 *   two horizons is thus (1/4)ln2 - controlled -- a fingerprint of the Phi^2 vs
 *   Phi tail, NOT of any Phi-autocorrelation structure. This makes explicit that
 *   the overflow-region UPPER geometry is pure arithmetic bookkeeping.
 *
 *   THE GENUINE DENSITIES (identical to imp-3216 / imp-3199 / imp-3175)
 *   ------------------------------------------------------------------
 *     nu(tau) = int_0^tau du int_tau^U dv  Phi(u) Phi(v) sinh(a(v-u))
 *     mu(tau) = (1 / 2pi) int_tau^U Phi(u)^2 sinh(2 a u) du
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC at the genuine Phi. This derives the two arithmetic underflow
 *   horizons that bound the overflow region and confirms the imp-3216 band; it
 *   re-derives no absolute deficit magnitude and proves no positivity. A nonzero
 *   overflow fraction is necessary-but-NOT-sufficient at operator order; the
 *   off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone
 *   obstruction. No RH verdict. No false QED. No refereed bound is changed.
 *
 *   @see imp-3216-overflow-support-length-closed-form.js (finding E2 + the decisive check)
 *   @see imp-3312-underflow-horizon-lock.js (the lock guarding the imp-3216 finding)
 *   @see imp-3307-tau1-phi-moment-balance.js (the lower-endpoint transcendental balance)
 *
 *   Ticket: imp-3309 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// ln(1 / smallest positive subnormal double) = ln(2^1074) ~ 744.44.
const L_SUBNORMAL = -Math.log(Number.MIN_VALUE);

// de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3216).
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
 * Closed-form nu (single-Phi) underflow horizon: the leading term 2 pi^2 X exp(-pi X)
 * (X = e^{4u}) underflows when pi X - ln(2 pi^2 X) = L; solve by fixed point.
 */
function nuHorizonClosedForm() {
  let X = 200;
  for (let i = 0; i < 300; i++) {
    X = (L_SUBNORMAL + Math.log(2 * Math.PI * Math.PI * X)) / Math.PI;
  }
  return { X, tau: 0.25 * Math.log(X) };
}

/**
 * Closed-form mu (Phi^2) underflow horizon: the leading term 4 pi^4 X^2 exp(-2 pi X)
 * (X = e^{4u}) underflows when 2 pi X - ln(4 pi^4 X^2) = L; solve by fixed point.
 */
function muHorizonClosedForm() {
  const c = 4 * Math.pow(Math.PI, 4);
  let X = 100;
  for (let i = 0; i < 300; i++) {
    X = (L_SUBNORMAL + Math.log(c * X * X)) / (2 * Math.PI);
  }
  return { X, tau: 0.25 * Math.log(X) };
}

/** Bisect for the largest u satisfying predicate f on [1.0, 1.6] (a monotone-in-u threshold). */
function largestU(f) {
  let lo = 1.0;
  let hi = 1.6;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (f(m)) lo = m;
    else hi = m;
  }
  return lo;
}

// -- Closed-form horizons -----------------------------------------------------
const nuClosed = nuHorizonClosedForm();
const muClosed = muHorizonClosedForm();

// -- Direct IEEE-754 measurement of the two horizons at the genuine kernel -----
// nu horizon: largest lag with Phi(u) still representable ( > 0 ).
const nuMeasured = largestU((u) => phiKernel(u, 10) > 0);
// mu horizon: largest lag with Phi(u)^2 still representable ( > 0, i.e. Phi^2 does not underflow ).
const muMeasured = largestU((u) => {
  const p = phiKernel(u, 10);
  return p * p > 0;
});

// -- Closed-form vs measured agreement (both must be within the stated ~3e-3) --
const nuClosedVsMeasured = Math.abs(nuClosed.tau - nuMeasured);
const muClosedVsMeasured = Math.abs(muClosed.tau - muMeasured);

// -- The band (tau_mu, tau_nu) where nu > 0 = mu -------------------------------
const bandWidthClosed = nuClosed.tau - muClosed.tau; // 0.17094
const bandWidthQuarterLn2 = 0.25 * Math.log(2); // 0.17329 leading-order prediction
const muUnderflowsBeforeNu = muClosed.tau < nuClosed.tau && muMeasured < nuMeasured;

// The exponent ratio is exactly 2 (Phi^2 tail vs single-Phi tail).
const exponentRatioIsTwo = true;

const verdict =
  muUnderflowsBeforeNu &&
  nuClosedVsMeasured < 3e-3 &&
  muClosedVsMeasured < 3e-3 &&
  Math.abs(bandWidthClosed - bandWidthQuarterLn2) < 0.01
    ? 'TWO-TAIL-UNDERFLOW-HORIZONS-CLOSED-FORM; mu(Phi^2)@1.199-FIRST, nu(Phi)@1.370-LATER; BAND-WIDTH~(1/4)ln2; ARITHMETIC-NOT-STRUCTURE'
    : 'INDETERMINATE';

export const IMP3309_TWO_TAIL_UNDERFLOW_HORIZONS = Object.freeze({
  id: 'imp-3309-two-tail-underflow-horizons',
  ticket: 'imp-3309',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedSupportLength: 'imp-3216-overflow-support-length-closed-form.js',
  relatedHorizonLock: 'imp-3312-underflow-horizon-lock.js',
  relatedLowerEndpoint: 'imp-3307-tau1-phi-moment-balance.js',

  summary:
    'DERIVES both IEEE-754 double underflow horizons that bound the section-26 overflow region. nu carries a ' +
    'single-Phi tail (leading term 2 pi^2 X exp(-pi X), X = e^{4u}) and mu a Phi^2 tail (4 pi^4 X^2 exp(-2 pi X)). ' +
    'Each underflows to 0.0 when its magnitude drops below the smallest subnormal 2^-1074, i.e. pi X - ln(2 pi^2 X) ' +
    '= L for nu and 2 pi X - ln(4 pi^4 X^2) = L for mu, with L = ln(2^1074) ~ 744.44. Fixed-point solving gives ' +
    'tau_nu = (1/4)ln(X_nu) = 1.36980 and tau_mu = (1/4)ln(X_mu) = 1.19886, confirming the imp-3216 measured ' +
    'largest-representable-lag horizons (nu 1.36721, mu 1.19906) to 2.6e-3 and 2.0e-4 respectively (both < 3e-3). ' +
    'Because the mu exponent 2 pi X is exactly TWICE the nu exponent pi X, X_mu ~ X_nu/2 and the band width ' +
    'tau_nu - tau_mu = 0.17094 ~ (1/4)ln2, so mu underflows FIRST leaving the band (1.199, 1.370) where nu > 0 = mu. ' +
    'This makes explicit that the overflow-region UPPER endpoint is arithmetic bookkeeping set by the tail-exponent ' +
    'ratio, NOT Phi-autocorrelation structure. DIAGNOSTIC; confirms imp-3216 E2; NO RH verdict.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    nuTail: 'nu carries a single-Phi tail; leading term 2 pi^2 X exp(-pi X), X = e^{4u}',
    muTail: 'mu carries a Phi^2 tail; leading term 4 pi^4 X^2 exp(-2 pi X), X = e^{4u}',
    subnormalThreshold: 'L = ln(1 / MIN_SUBNORMAL) = ln(2^1074) ~ 744.44 (smallest positive double 2^-1074)',
    nuHorizonEquation: 'pi X - ln(2 pi^2 X) = L  ->  X_nu,  tau_nu = (1/4) ln(X_nu)',
    muHorizonEquation: '2 pi X - ln(4 pi^4 X^2) = L  ->  X_mu,  tau_mu = (1/4) ln(X_mu)',
    bandWidthLeadingOrder: 'tau_nu - tau_mu ~ (1/4) ln(X_nu / X_mu) ~ (1/4) ln 2 (exponent ratio exactly 2)',
    solver: 'fixed-point iteration on X, 300 sweeps (quadratically stable, log correction slowly varying)',
    measurementMethod: 'bisection for the largest lag u with Phi(u) > 0 (nu) and Phi(u)^2 > 0 (mu) in IEEE-754 double',
    selfComputing: true,
  }),

  measured: Object.freeze({
    lnInvMinSubnormal: L_SUBNORMAL,
    nuHorizonClosedForm: nuClosed.tau,
    nuHorizonX: nuClosed.X,
    muHorizonClosedForm: muClosed.tau,
    muHorizonX: muClosed.X,
    nuHorizonMeasured: nuMeasured,
    muHorizonMeasured: muMeasured,
    nuClosedVsMeasured, // 2.6e-3
    muClosedVsMeasured, // 2.0e-4
    bandWidthClosed, // tau_nu - tau_mu = 0.17094
    bandWidthQuarterLn2, // (1/4) ln 2 = 0.17329
    muUnderflowsBeforeNu,
    exponentRatioIsTwo,
    verdict,
  }),

  interpretation: Object.freeze({
    bothHorizonsClosedForm:
      'Both underflow horizons follow from the same subnormal threshold L = ln(2^1074) ~ 744.44 applied to the ' +
      'two different tails: pi X - ln(2 pi^2 X) = L for the single-Phi nu (tau_nu = 1.36980) and 2 pi X - ' +
      'ln(4 pi^4 X^2) = L for the Phi^2 mu (tau_mu = 1.19886). Both match the measured largest-representable-lag ' +
      'horizons to < 3e-3, closing the imp-3216 finding E2 that had left the mu horizon and the band at measured values.',
    muUnderflowsFirst:
      'The mu exponent 2 pi X is exactly TWICE the nu exponent pi X, so mu drops below the subnormal threshold at ' +
      'a smaller X (X_mu ~ X_nu/2) and hence a smaller lag. mu underflows to 0.0 FIRST at tau ~ 1.199, then across ' +
      'the band (1.199, 1.370) we have nu > 0 = mu, and beyond tau_nu ~ 1.370 both are 0.0. Confirms the imp-3216 ' +
      'decisive check that the region ends by nu underflowing, not by mu overtaking nu.',
    bandWidthIsArithmetic:
      'The band width tau_nu - tau_mu = 0.17094 ~ (1/4)ln2 is a direct fingerprint of the Phi^2-vs-Phi tail ' +
      'exponent ratio (2 vs 1), independent of a, U, NPHI and of any Phi-autocorrelation length. The overflow ' +
      'region UPPER endpoint is therefore arithmetic bookkeeping, not autocorrelation structure -- exactly the ' +
      'imp-3216 correction, now quantified in closed form.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    confirmsImp3216FindingE2:
      'This derives the two-tail underflow horizons imp-3216 finding E2 identified but left partly measured, ' +
      'confirming both closed forms against the measured horizons to < 3e-3 and quantifying the band width as (1/4)ln2.',
    addressesUnderflowGeometryOnly:
      'This derives the arithmetic underflow horizons bounding the overflow region only; the absolute deg-2 ' +
      'deficit magnitude and any positivity are NOT addressed here.',
    necessaryNotSufficient:
      'A nonzero overflow fraction is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3309_TWO_TAIL_UNDERFLOW_HORIZONS_ASSERTIONS = [
  {
    id: 'imp3309-nu-horizon-closed-form-matches-measurement',
    why: 'The single-Phi (nu) horizon closed form tau_nu = (1/4)ln(X_nu), pi X_nu - ln(2 pi^2 X_nu) = ln(2^1074), ' +
         'must reproduce the measured largest-lag-with-Phi>0 horizon (~1.367) to the stated ~3e-3.',
    holds: () =>
      Math.abs(nuClosed.tau - 1.3698) < 1e-3 &&
      nuMeasured > 1.36 &&
      nuMeasured < 1.37 &&
      nuClosedVsMeasured < 3e-3,
  },
  {
    id: 'imp3309-mu-horizon-closed-form-matches-measurement',
    why: 'The Phi^2 (mu) horizon closed form tau_mu = (1/4)ln(X_mu), 2 pi X_mu - ln(4 pi^4 X_mu^2) = ln(2^1074), ' +
         'must reproduce the measured largest-lag-with-Phi^2>0 horizon (~1.196/~1.199) to the stated ~3e-3.',
    holds: () =>
      Math.abs(muClosed.tau - 1.1989) < 1e-3 &&
      muMeasured > 1.19 &&
      muMeasured < 1.20 &&
      muClosedVsMeasured < 3e-3,
  },
  {
    id: 'imp3309-mu-underflows-before-nu',
    why: 'THE DECISIVE CHECK: because the Phi^2 exponent 2 pi X is twice the single-Phi exponent pi X, mu underflows ' +
         'strictly BEFORE nu (both closed form and measured), leaving the band (tau_mu, tau_nu) where nu > 0 = mu.',
    holds: () => muUnderflowsBeforeNu && muClosed.tau < nuClosed.tau && muMeasured < nuMeasured,
  },
  {
    id: 'imp3309-band-width-is-quarter-ln2',
    why: 'The band width tau_nu - tau_mu (~0.171) must match the leading-order (1/4)ln2 prediction (~0.173) to ~0.01, ' +
         'confirming the gap is set by the tail-exponent ratio (2 vs 1), not by Phi-autocorrelation structure.',
    holds: () =>
      bandWidthClosed > 0.16 &&
      bandWidthClosed < 0.18 &&
      Math.abs(bandWidthClosed - bandWidthQuarterLn2) < 0.01,
  },
  {
    id: 'imp3309-verdict-is-two-tail-closed-form',
    why: 'The classified verdict must be the two-tail-closed-form reconciliation (mu first, nu later, band ~(1/4)ln2, ' +
         'arithmetic not structure), not indeterminate; a flip means a horizon, the ordering, or the band broke.',
    holds: () =>
      verdict ===
      'TWO-TAIL-UNDERFLOW-HORIZONS-CLOSED-FORM; mu(Phi^2)@1.199-FIRST, nu(Phi)@1.370-LATER; BAND-WIDTH~(1/4)ln2; ARITHMETIC-NOT-STRUCTURE',
  },
  {
    id: 'imp3309-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC that CONFIRMS the imp-3216 finding E2, underflow-horizon geometry only, ' +
         'necessary-but-not-sufficient at operator order, positivity not attempted, no refereed bound is changed.',
    holds: () => {
      const c = IMP3309_TWO_TAIL_UNDERFLOW_HORIZONS.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3309_TWO_TAIL_UNDERFLOW_HORIZONS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3309-two-tail-underflow-horizons assertion failed: ${assertion.id}`);
  }
}

export default IMP3309_TWO_TAIL_UNDERFLOW_HORIZONS;
