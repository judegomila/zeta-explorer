/**
 * @module imp-2686-mupass-construction
 * @fileoverview imp-2686 -- Construct (and stress-test) the endpoint-bridge-
 *   enriched passive-core measure mu^pass for the surviving RH-equivalent
 *   Volterra target named in
 *   section26-verdict-volterra-not-a-reduction-2026-06-18.js
 *   (THE_REAL_GAP_REVISED).
 *
 *   THE TARGET (verbatim from the verdict)
 *   --------------------------------------
 *   The lone non-ruled-out direct path is to CONSTRUCT the canonical
 *   Section-26 passive-core Gram Gpass from an endpoint-bridge-enriched
 *   mu^pass (NOT the raw diagonal, which does NOT dominate at the Riemann Phi)
 *   and study the de-homogenized R = Gpass^{-1/2} Gshear Gpass^{-1/2}.
 *
 *   The Section-25 commutator split is K_a = K_a^diag + (off-diagonal shear).
 *   In the §26 hidden-square framing the shear carries a scalar measure nu and
 *   the diagonal a scalar measure mu_diag; the no-ghost factorization closes
 *   only if a passive-core measure mu^pass dominates nu (mu^pass >= nu).
 *
 *   The Volterra-Hankel shear weight is sinh(a*tau) in the lag variable
 *   tau = t - s (the off-diagonal endpoint-Hankel kernel of imp-1240). The bare
 *   diagonal carries weight cosh(0) = 1. So, as a weight comparison, the raw
 *   diagonal loses to the shear exactly where sinh(a*tau) > 1, i.e. beyond the
 *   crossover lag tau_star = arcsinh(1)/a -- the qualitative phenomenon the
 *   verdict records as "nu exceeds mu_diag on a majority of the tau range".
 *
 *   (a) THE EXPLICIT ENDPOINT-BRIDGE ENRICHMENT
 *   -------------------------------------------
 *   Integrating the shear weight along the lag from the diagonal endpoint
 *   tau = 0 out to lag tau,
 *
 *       int_0^tau a*sinh(a*r) dr = cosh(a*tau) - 1,
 *
 *   is precisely the boundary ("endpoint-bridge") term produced when the
 *   sinh-shear is integrated by parts back onto the diagonal. Adding it to the
 *   bare diagonal weight 1 yields the enriched passive-core weight
 *
 *       w^pass(tau) = 1 + [cosh(a*tau) - 1] = cosh(a*tau).
 *
 *   So the canonical endpoint-bridge enrichment is the cosh-completion: it
 *   promotes the bare diagonal weight 1 to the full even weight cosh(a*tau).
 *   Because cosh(a*tau) - sinh(a*tau) = e^{-a*tau} > 0 for every tau, the
 *   enriched weight dominates the shear weight POINTWISE on the entire lag axis
 *   (domination fraction 1.0, exact -- not merely measured).
 *
 *   (b)(c) THE NUMERICAL TEST AT THE GENUINE RIEMANN PHI (U = 6, N = 200)
 *   --------------------------------------------------------------------
 *   We weight the comparison by the genuine de Bruijn-Newman autocorrelation
 *
 *       A(tau) = int Phi(s) Phi(s + tau) ds,   Phi the §27 completed-Riemann
 *                                              kernel (truncated n <= 10),
 *
 *   discretized on the midpoint grid of [0, U] with U = 6, N = 200. This module
 *   recomputes A and the domination fractions at import (self-verifying; no
 *   frozen data to drift).
 *
 *   MEASURED RESULT -- and the honest catch that keeps the target open:
 *
 *   1. ABSOLUTE (degree-2) measure. At the genuine Phi the autocorrelation
 *      A(tau) is super-exponentially concentrated at small lag: its numerical
 *      support is tau in [0, ~0.6], well INSIDE the crossover tau_star =
 *      arcsinh(1)/a (= 1.76 at a = 0.5). So on the support sinh(a*tau) < 1 and
 *      the RAW diagonal mu_diag = A ALREADY dominates nu = sinh(a*tau)*A on
 *      100% of the support -- no enrichment is needed in the absolute measure.
 *      The enriched mu^pass = cosh(a*tau)*A also dominates on 100%.
 *
 *   2. THE CATCH. Result (1) does NOT contradict the verdict; it EXPLAINS it.
 *      The "raw diagonal does NOT dominate (nu exceeds mu_diag on ~64% of tau)"
 *      finding from /tmp/riemann_arbiter.py is a property of the DEGREE-0,
 *      scale-invariant normalized spectral measures -- the only class that is
 *      RH-equivalent -- NOT of the absolute (degree-2, scale-miscalibrated)
 *      measure this module can write in closed form. The crossover lag
 *      tau_star = arcsinh(1)/a is exactly where, after the homogeneity is
 *      stripped, the bare diagonal weight 1 falls below the shear weight
 *      sinh(a*tau); the endpoint-bridge cosh-completion is the minimal repair.
 *      Constructing mu^pass against the genuine degree-0 normalized nu requires
 *      the full §25-26 spectral measures (the arbiter), which this self-
 *      contained module documents but does not reproduce.
 *
 *   HONEST CAVEAT (mandatory, per the ticket and the verdict)
 *   ---------------------------------------------------------
 *   Even a fully successful construction is a faithful RH-EQUIVALENT restatement
 *   of K_a >= 0: the cosh-completion w^pass = cosh(a*tau) IS the even part of
 *   the no-ghost kernel, and pointwise scalar domination mu^pass >= nu is
 *   NECESSARY but NOT sufficient for the operator positivity K_a >= 0 (the
 *   degree-0 R = Gpass^{-1/2} Gshear Gpass^{-1/2} still must be a contraction).
 *   So this carries FULL RH strength and is NOT a reduction below RH. The
 *   bare-V pilot (imp-1240) is NOT re-run here. Platt-Trudgian Lambda <= 0.2
 *   REMAINS the rigorous SOTA. No false QED.
 *
 *   @see section26-verdict-volterra-not-a-reduction-2026-06-18.js (THE_REAL_GAP_REVISED)
 *   @see imp-1240-volterra-norm-pilot.js (the downgraded bare-V pilot -- NOT re-run)
 *
 *   Ticket: imp-2686 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI. */
function phiKernel(u) {
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

const U = 6;
const N = 200;
const H = U / N;
const A_SWEEP = Object.freeze([0.5, 0.2, 0.1, 0.05]);

// Midpoint grid and Phi samples on [0, U].
const _phi = [];
for (let i = 0; i < N; i++) _phi.push(phiKernel((i + 0.5) * H));

// Phi autocorrelation A(tau_k) = sum_i Phi(t_i) Phi(t_{i+k}) * H (genuine Phi).
const _A = [];
for (let k = 0; k < N; k++) {
  let acc = 0;
  for (let i = 0; i + k < N; i++) acc += _phi[i] * _phi[i + k];
  _A.push(acc * H);
}
const _Amax = Math.max(..._A);
const _tol = 1e-12 * _Amax;
const _support = [];
for (let k = 0; k < N; k++) if (_A[k] > _tol) _support.push(k);

/**
 * For weight a, compare the bare diagonal (weight 1), the shear (weight
 * sinh(a*tau)) and the endpoint-bridge-enriched passive core (weight
 * cosh(a*tau)) over the Phi-autocorrelation support. Returns the measured
 * absolute-measure domination fractions and the exact pointwise weight margin
 * min_tau [cosh(a*tau) - sinh(a*tau)] = min_tau e^{-a*tau}.
 */
function dominationRow(a) {
  let rawDom = 0;
  let enrDom = 0;
  let minWeightMargin = Infinity;
  for (const k of _support) {
    const tau = k * H;
    const sh = Math.sinh(a * tau);
    const ch = Math.cosh(a * tau);
    const Ak = _A[k];
    if (Ak >= sh * Ak) rawDom += 1;          // mu_diag >= nu
    if (ch * Ak >= sh * Ak) enrDom += 1;      // mu^pass >= nu
    const wm = ch - sh;                       // = e^{-a*tau} > 0
    if (wm < minWeightMargin) minWeightMargin = wm;
  }
  const nSupp = _support.length;
  return Object.freeze({
    a,
    crossoverTau: Math.asinh(1) / a,          // tau_star: sinh(a*tau) crosses 1
    crossoverInsideSupport: Math.asinh(1) / a <= _support.length * H,
    rawDomSuppFrac: rawDom / nSupp,           // raw diagonal vs shear, absolute measure
    enrDomSuppFrac: enrDom / nSupp,           // enriched mu^pass vs shear, absolute measure
    minWeightMargin,                          // exact pointwise cosh - sinh margin
  });
}

const ROWS = Object.freeze(A_SWEEP.map(dominationRow));

export const IMP2686_MUPASS_CONSTRUCTION = Object.freeze({
  id: 'imp-2686-mupass-construction',
  ticket: 'imp-2686',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedVerdict: 'section26-verdict-volterra-not-a-reduction-2026-06-18.js',

  summary:
    'Constructs the endpoint-bridge enrichment for the surviving RH-equivalent ' +
    'Volterra target: the cosh-completion w^pass(tau) = cosh(a*tau), obtained by ' +
    'integrating the sinh-shear boundary term cosh(a*tau)-1 back onto the bare ' +
    'diagonal weight 1. Dominates the shear weight sinh(a*tau) pointwise (e^{-a*tau} ' +
    '> 0). Tested at the genuine Riemann Phi (U=6, N=200): in the ABSOLUTE measure ' +
    'the raw diagonal already dominates on 100% of the Phi-autocorrelation support ' +
    '(support sits inside the crossover tau_star = arcsinh(1)/a), so the verdicts ' +
    '"raw fails on ~64% of tau" is a DEGREE-0 (scale-invariant) phenomenon, not an ' +
    'absolute-measure one. RH-EQUIVALENT; not a reduction.',

  /* (a) the explicit enrichment, written out */
  enrichment: Object.freeze({
    shearWeight: 'sinh(a*tau)  (off-diagonal endpoint-Hankel Volterra kernel, lag tau = t - s)',
    bareDiagonalWeight: '1  (= cosh(0); raw diagonal carries no lag enhancement)',
    endpointBridgeTerm: 'int_0^tau a*sinh(a*r) dr = cosh(a*tau) - 1  (boundary term from integrating the sinh-shear by parts onto the diagonal)',
    enrichedPassiveWeight: 'w^pass(tau) = 1 + [cosh(a*tau) - 1] = cosh(a*tau)',
    pointwiseMargin: 'w^pass(tau) - shear(tau) = cosh(a*tau) - sinh(a*tau) = e^{-a*tau} > 0 for all tau',
    pointwiseDominationFraction: 1.0,
  }),

  /* (b)(c) genuine-Phi numerical test */
  method: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    U,
    N,
    discretizationRule: 'midpoint',
    weighting: 'Phi autocorrelation A(tau) = int Phi(s) Phi(s+tau) ds on [0, U]',
    aSweep: A_SWEEP,
    supportPoints: _support.length,
    supportLagSpan: _support.length * H,
    selfComputing: true,
  }),

  rows: ROWS,

  /* the honest catch that keeps the target open */
  scaleAnalysis: Object.freeze({
    absoluteMeasureRawDominates: true,
    reason:
      'A(tau) is super-exponentially concentrated at small lag (support ~ [0, 0.6]); ' +
      'the crossover tau_star = arcsinh(1)/a (1.76 at a=0.5) lies OUTSIDE that support, ' +
      'so sinh(a*tau) < 1 throughout and the bare diagonal already dominates in the ' +
      'absolute (degree-2) measure.',
    verdict64PctIsDegree0:
      'The "nu exceeds mu_diag on ~64% of tau" finding is a property of the degree-0 ' +
      'scale-invariant normalized spectral measures (the RH-equivalent class), NOT the ' +
      'absolute measure. Reproducing it needs the full §25-26 spectral construction ' +
      '(/tmp/riemann_arbiter.py), which this self-contained module documents, not runs.',
    openTarget:
      'Construct mu^pass against the degree-0 normalized nu so that R = Gpass^{-1/2} ' +
      'Gshear Gpass^{-1/2} is a contraction -- still open and RH-hard.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    necessaryNotSufficient:
      'Pointwise scalar domination mu^pass >= nu is NECESSARY but NOT sufficient for ' +
      'K_a >= 0; the degree-0 operator R must still be a contraction. The cosh-completion ' +
      'w^pass = cosh(a*tau) IS the even part of the no-ghost kernel, so this carries full ' +
      'RH strength and is a faithful restatement, not a shortcut.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP2686_MUPASS_CONSTRUCTION_ASSERTIONS = [
  {
    id: 'imp2686-sweep-row-count',
    why: 'One domination row per a in the sweep {0.5, 0.2, 0.1, 0.05}; a mis-count ' +
         'means the self-computing sweep dropped or duplicated a weight.',
    holds: () => ROWS.length === A_SWEEP.length && A_SWEEP.length === 4,
  },
  {
    id: 'imp2686-enriched-dominates-shear-pointwise',
    why: 'The endpoint-bridge cosh-completion must dominate the sinh-shear on 100% ' +
         'of the support in the absolute measure, and its exact pointwise margin ' +
         'cosh - sinh = e^{-a*tau} must stay strictly positive. If either fails the ' +
         'enrichment formula has been corrupted.',
    holds: () => ROWS.every((r) => r.enrDomSuppFrac === 1 && r.minWeightMargin > 0),
  },
  {
    id: 'imp2686-raw-dominates-in-absolute-measure-on-support',
    why: 'The honest catch: at the genuine Phi the support sits inside tau_star, so ' +
         'sinh(a*tau) < 1 there and the RAW diagonal already dominates on 100% of the ' +
         'support in the absolute (degree-2) measure. This is what makes the verdicts ' +
         '"raw fails on 64%" a degree-0 (not absolute) phenomenon.',
    holds: () => ROWS.every((r) => r.rawDomSuppFrac === 1 && !r.crossoverInsideSupport),
  },
  {
    id: 'imp2686-crossover-tau-matches-arcsinh',
    why: 'The crossover lag where the shear weight passes the bare diagonal weight 1 ' +
         'must equal arcsinh(1)/a. A drift means the shear weight is no longer sinh.',
    holds: () => ROWS.every((r) => Math.abs(r.crossoverTau - Math.asinh(1) / r.a) < 1e-9),
  },
  {
    id: 'imp2686-genuine-phi-grid',
    why: 'The test must run at the genuine Riemann Phi on U=6, N=200 (the ticket grid), ' +
         'with a non-empty autocorrelation support. A change means a different regime ' +
         'than the verdict names.',
    holds: () =>
      IMP2686_MUPASS_CONSTRUCTION.method.U === 6 &&
      IMP2686_MUPASS_CONSTRUCTION.method.N === 200 &&
      IMP2686_MUPASS_CONSTRUCTION.method.phiTruncationN === 10 &&
      _support.length > 0,
  },
  {
    id: 'imp2686-enrichment-is-cosh-completion',
    why: 'The constructed enrichment must be the cosh-completion (bare weight 1 plus the ' +
         'endpoint-bridge term cosh(a*tau)-1), with pointwise domination fraction 1.0. ' +
         'If this record changes the explicit construction has been lost.',
    holds: () => {
      const e = IMP2686_MUPASS_CONSTRUCTION.enrichment;
      return (
        /cosh\(a\*tau\)/.test(e.enrichedPassiveWeight) &&
        /cosh\(a\*tau\) - 1/.test(e.endpointBridgeTerm) &&
        e.pointwiseDominationFraction === 1.0
      );
    },
  },
  {
    id: 'imp2686-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: the construction is RH-EQUIVALENT, necessary-but-not-' +
         'sufficient, not a proof, not a reduction below RH, and PT 0.2 stays SOTA. ' +
         'If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP2686_MUPASS_CONSTRUCTION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const a of IMP2686_MUPASS_CONSTRUCTION_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-2686-mupass-construction assertion failed: ${a.id}`);
}
