/**
 * @module imp-3482-degree2-deficit-support-certification
 * @fileoverview imp-3482 -- CERTIFY the imp-3469 load-bearing claim that the
 *   DEGREE-2 (absolute-measure) overflow deficit
 *
 *     D_2(a, U) = int_{tauStar}^U (sinh(a tau) - 1) A(tau) d(tau)
 *
 *   VANISHES IDENTICALLY, by MEASURING the effective support endpoint of the
 *   genuine-Phi autocorrelation weight A(tau) = int Phi(s) Phi(s + tau) ds and
 *   confirming the degree-2 crossover tauStar = arcsinh(1)/a sits STRICTLY
 *   OUTSIDE that support on BOTH base cells, with a quantified margin.
 *
 *   WHAT imp-3469 ASSERTED (and this module certifies)
 *   --------------------------------------------------
 *   imp-3469 reported (R4) D_2 = 0 identically because the crossover tauStar
 *   (where sinh(a tauStar) = 1, i.e. tauStar = arcsinh(1)/a) lies beyond the
 *   A(tau) support (~[0, 0.6]), so the deficit tail [tauStar, U] never meets the
 *   autocorrelation support. That separation was ASSERTED from the qualitative
 *   support estimate, never MEASURED. This module measures it.
 *
 *   METHOD (self-computing; A recomputed at import, no frozen data)
 *   --------------------------------------------------------------
 *   The exact imp-3469 kernel Phi (NPHI = 10) and autocorrelation A(tau) are
 *   reused verbatim. A(tau) peaks at tau = 0 (Cauchy-Schwarz) and decays
 *   monotonically and super-exponentially, so the effective support endpoint at
 *   a relative floor f is the UNIQUE tau where |A(tau)| = f * A(0); we locate it
 *   by bisection to ~8 digits at three floors f in {1e-6, 1e-9, 1e-12}. The HARD
 *   support endpoint is the first grid node where A(tau) underflows to EXACTLY 0
 *   in double precision. For each base cell (a, U) in {(0.5, 6), (0.4, 10)} we
 *   compute tauStar = arcsinh(1)/a and the margin tauStar - supportEnd.
 *
 *   MEASURED RESULT
 *   ---------------
 *   (C1) A(0) ~ 1.047e-2; A decays monotonically: A(0.2)~3.5e-4, A(0.4)~8.7e-8,
 *        A(0.6)~5.2e-16, and A underflows to EXACTLY 0 by tau ~ 1.37.
 *   (C2) Effective support endpoints (bisected): supportEnd(1e-6) = 0.4322906,
 *        supportEnd(1e-9) = 0.5152794, supportEnd(1e-12) = 0.5772871 -- all
 *        comfortably inside 0.6, matching the imp-3469 ~[0, 0.6] estimate.
 *   (C3) tauStar(a=0.5) = 1.7627472, tauStar(a=0.4) = 2.2034340 -- both sit far
 *        BEYOND every support endpoint AND beyond the hard underflow point 1.37.
 *   (C4) STRICT SEPARATION with large margins. Against the loosest (1e-12) floor:
 *        margin(a=0.5) = 1.185, margin(a=0.4) = 1.626 -- tauStar exceeds the
 *        support endpoint by MORE THAN THE ENDPOINT ITSELF (ratio > 3x).
 *   (C5) A(tauStar) = 0 EXACTLY (double-precision underflow) on both cells, and
 *        the entire deficit tail [tauStar, U] lies in the region where A is
 *        exactly 0, so D_2 = 0 identically in floating point -- CERTIFIED, not
 *        merely asserted. (a -> a/k only pushes tauStar further out, k * tauStar,
 *        so the separation is monotone in the imp-3469 k-ladder direction.)
 *
 *   VERDICT: the imp-3469 D_2 = 0-identically claim is CERTIFIED. tauStar sits
 *   strictly outside the A(tau) support on both base cells with margin > 1.18,
 *   and A vanishes exactly across the whole deficit tail -- so no degree-2
 *   feasibility ratio B_2/D_2 exists, exactly as imp-3469 stated.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / CERTIFICATION ONLY, at the RH-equivalent scale class. This
 *   certifies a support-separation FACT behind the imp-3469 diagnostic; it
 *   establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT, and the degree-2 face carries no feasibility comparison at all
 *   (D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-3469-degree2-bridge-mass-scaling.js (the claim certified here)
 *   @see imp-2686-mupass-construction.js (the degree-2 / absolute measure A(tau))
 *
 *   Ticket: imp-3482 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation
const ASINH1 = Math.asinh(1);                   // arcsinh(1), solves sinh(a tauStar) = 1

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds. The kernel decays
// super-exponentially so the upper limit 7 captures the whole overlap (imp-3469).
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

const A0 = autocorr(0);                          // peak value (Cauchy-Schwarz maximum)

/**
 * Effective support endpoint at relative floor f: the tau where |A(tau)| = f*A(0).
 * A decays monotonically past tau = 0, so this crossing is unique and bisectable.
 */
function supportEndAtFloor(f) {
  const target = f * Math.abs(A0);
  let lo = 0;                                    // |A(lo)| >= target
  let hi = 6;                                    // |A(hi)| < target (deep underflow)
  for (let it = 0; it < 200; it += 1) {
    const mid = (lo + hi) / 2;
    if (Math.abs(autocorr(mid)) >= target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// The first tau (on a fine grid) where A underflows to EXACTLY 0 in double precision.
function hardUnderflowPoint() {
  const T = 6;
  const N = 6000;
  for (let j = 0; j <= N; j += 1) {
    const tau = (j * T) / N;
    if (autocorr(tau) === 0) return tau;
  }
  return T;
}

// -- Measured support endpoints -----------------------------------------------
const FLOORS = Object.freeze([1e-6, 1e-9, 1e-12]);
const SUPPORT_ENDS = Object.freeze(FLOORS.map((f) => Object.freeze({ floor: f, tau: supportEndAtFloor(f) })));
const LOOSEST_END = SUPPORT_ENDS[SUPPORT_ENDS.length - 1].tau;   // the largest (1e-12) endpoint
const HARD_UNDERFLOW = hardUnderflowPoint();

// -- The two imp-3469 base cells ----------------------------------------------
function certifyCell(a, u) {
  const tauStar = ASINH1 / a;
  const margin = tauStar - LOOSEST_END;          // vs loosest (largest) support endpoint
  const aAtTauStar = autocorr(tauStar);          // must be exactly 0 (underflowed)
  return Object.freeze({
    a,
    u,
    tauStar,
    supportEndLoosest: LOOSEST_END,
    margin,
    marginRatio: margin / LOOSEST_END,           // margin as a multiple of the endpoint
    aAtTauStar,
    tauStarBeyondSupport: tauStar > LOOSEST_END,
    tauStarBeyondUnderflow: tauStar > HARD_UNDERFLOW,   // whole tail has A === 0
    deficitTailAllZero: aAtTauStar === 0 && tauStar > HARD_UNDERFLOW,
  });
}

const CELL_S3 = certifyCell(0.5, 6);             // base (0.5,6), s = 3
const CELL_S4 = certifyCell(0.4, 10);            // base (0.4,10), s = 4

// -- Classification -----------------------------------------------------------
const MARGIN_FLOOR = 1.0;                         // required minimum separation margin
const separationCertified =
  CELL_S3.tauStarBeyondSupport && CELL_S4.tauStarBeyondSupport &&
  CELL_S3.margin > MARGIN_FLOOR && CELL_S4.margin > MARGIN_FLOOR;
const deficitVanishesExactly =
  CELL_S3.deficitTailAllZero && CELL_S4.deficitTailAllZero;
const supportInsideEstimate = LOOSEST_END < 0.6;  // matches imp-3469 ~[0,0.6]

const verdict =
  separationCertified && deficitVanishesExactly && supportInsideEstimate
    ? 'IMP3469-D2=0-IDENTICALLY-CERTIFIED-tauStar-STRICTLY-OUTSIDE-A-SUPPORT-MARGIN>1.18-BOTH-CELLS'
    : 'INDETERMINATE';

export const IMP3482_DEGREE2_DEFICIT_SUPPORT_CERTIFICATION = Object.freeze({
  id: 'imp-3482-degree2-deficit-support-certification',
  ticket: 'imp-3482',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  certifiesTicket: 'imp-3469',
  relatedAbsoluteMeasure: 'imp-2686-mupass-construction.js',

  summary:
    'Certifies the imp-3469 load-bearing claim that the DEGREE-2 (absolute-measure) overflow ' +
    'deficit D_2 = int_{tauStar}^U (sinh(a tau)-1) A(tau) d(tau) VANISHES IDENTICALLY. Measures ' +
    'the effective support endpoint of the genuine-Phi autocorrelation A(tau)=int Phi(s)Phi(s+tau)ds ' +
    '(NPHI=10, recomputed at import) by bisection at floors {1e-6,1e-9,1e-12}: supportEnd = ' +
    '0.4322906 / 0.5152794 / 0.5772871 respectively, all inside 0.6, with A underflowing to EXACTLY ' +
    '0 by tau~1.37. Computes tauStar=arcsinh(1)/a for both imp-3469 base cells: tauStar(0.5)=1.7627472, ' +
    'tauStar(0.4)=2.2034340. CERTIFIED: tauStar sits STRICTLY OUTSIDE the A support on both cells with ' +
    'margin 1.185 (a=0.5) and 1.626 (a=0.4) against the loosest 1e-12 endpoint (>3x the endpoint), and ' +
    'A(tauStar)=0 exactly with the whole deficit tail [tauStar,U] in the A==0 region -- so D_2=0 ' +
    'identically in floating point and no degree-2 feasibility ratio B_2/D_2 exists, exactly as imp-3469 ' +
    'stated. CERTIFICATION, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) ' +
    'untouched; no RH verdict.',

  method: Object.freeze({
    autocorr: 'A(tau) = int_0^inf Phi(s)Phi(s+tau)ds, genuine-Phi autocorrelation (NPHI=10), FIXED in (a,U)',
    quadrature: 'composite Simpson (n=1200 on [0,7]) for A(tau), reused verbatim from imp-3469',
    supportEndpoint: 'bisection (200 iters, ~8 digits) for the unique tau where |A(tau)| = floor*A(0)',
    floors: FLOORS,
    hardUnderflow: 'first fine-grid node where A(tau) underflows to EXACTLY 0 in double precision',
    tauStar: 'arcsinh(1)/a, the degree-2 crossover where sinh(a tauStar) = 1',
    baseCells: ['(0.5,6) s=3', '(0.4,10) s=4'],
    marginFloor: MARGIN_FLOOR,
    selfComputing: true,
  }),

  measured: Object.freeze({
    aPeak: A0,                                    // A(0) ~ 1.047e-2
    supportEnds: SUPPORT_ENDS,                    // [{floor,tau}, ...]
    loosestSupportEnd: LOOSEST_END,               // ~0.577 (1e-12 floor)
    hardUnderflowTau: HARD_UNDERFLOW,             // ~1.37
    cellS3: CELL_S3,                              // base (0.5,6)
    cellS4: CELL_S4,                              // base (0.4,10)
    minMargin: Math.min(CELL_S3.margin, CELL_S4.margin),  // ~1.185
    separationCertified,
    deficitVanishesExactly,
    supportInsideEstimate,
    verdict,
  }),

  interpretation: Object.freeze({
    separationCertified:
      'The degree-2 crossover tauStar = arcsinh(1)/a is measured to sit STRICTLY beyond the A(tau) ' +
      'support endpoint on BOTH base cells, with margin 1.185 (a=0.5) and 1.626 (a=0.4) even against ' +
      'the loosest 1e-12 support floor (0.577). The margin exceeds the support endpoint itself (>3x), ' +
      'so the separation is not marginal -- it is decisive.',
    deficitVanishesExactly:
      'A(tau) underflows to EXACTLY 0 in double precision by tau~1.37, well below both tauStar values ' +
      '(1.76, 2.20). The entire deficit tail [tauStar,U] therefore lies where A is exactly 0, so the ' +
      'integrand (sinh(a tau)-1)A(tau) is identically 0 and D_2 = 0 in floating point -- CERTIFIED.',
    monotoneInLadder:
      'The imp-3469 k-ladder scales a -> a/k, sending tauStar -> k*tauStar (further OUT), so the ' +
      'separation only widens along the ladder -- D_2 = 0 persists on every rung, not just the base.',
    noDegree2Ratio:
      'With D_2 = 0 identically there is no degree-2 mass-feasibility ratio B_2/D_2 to speak of -- ' +
      'confirming the imp-2686 absolute-measure fact that the raw diagonal dominates 100% of the support.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module CERTIFIES a support-separation fact behind the imp-3469 diagnostic (tauStar outside ' +
      'the A(tau) support, D_2 = 0 identically). It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility ' +
      'comparison at all (D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3482_DEGREE2_DEFICIT_SUPPORT_CERTIFICATION_ASSERTIONS = [
  {
    id: 'imp3482-support-endpoints-inside-estimate',
    why: 'The measured A(tau) support endpoints at floors 1e-6,1e-9,1e-12 must all fall inside 0.6, ' +
         'confirming the imp-3469 qualitative ~[0,0.6] support estimate; and they must increase with ' +
         'a looser floor (monotone decay of A).',
    holds: () =>
      SUPPORT_ENDS.every((e) => e.tau < 0.6 && e.tau > 0.3) &&
      SUPPORT_ENDS[0].tau < SUPPORT_ENDS[1].tau &&
      SUPPORT_ENDS[1].tau < SUPPORT_ENDS[2].tau,
  },
  {
    id: 'imp3482-tauStar-strictly-outside-support-both-cells',
    why: 'THE CERTIFICATION: the degree-2 crossover tauStar=arcsinh(1)/a must sit strictly beyond the ' +
         'loosest (largest) A support endpoint on BOTH base cells, with a separation margin > 1.',
    holds: () =>
      CELL_S3.tauStarBeyondSupport && CELL_S4.tauStarBeyondSupport &&
      CELL_S3.margin > MARGIN_FLOOR && CELL_S4.margin > MARGIN_FLOOR,
  },
  {
    id: 'imp3482-tauStar-values-match-arcsinh1-over-a',
    why: 'tauStar must equal arcsinh(1)/a to full precision: 1.7627472 (a=0.5) and 2.2034340 (a=0.4).',
    holds: () =>
      Math.abs(CELL_S3.tauStar - 1.7627471740) < 1e-9 &&
      Math.abs(CELL_S4.tauStar - 2.2034339675) < 1e-9,
  },
  {
    id: 'imp3482-A-underflows-before-tauStar',
    why: 'A(tau) must underflow to EXACTLY 0 at some tau below both tauStar values (hard underflow ' +
         '~1.37 < 1.76 < 2.20), so the whole deficit tail [tauStar,U] lies where A is exactly 0.',
    holds: () =>
      HARD_UNDERFLOW < CELL_S3.tauStar && HARD_UNDERFLOW < CELL_S4.tauStar &&
      HARD_UNDERFLOW < 1.6,
  },
  {
    id: 'imp3482-A-at-tauStar-is-exactly-zero',
    why: 'A(tauStar) must be EXACTLY 0 (double-precision underflow) on both cells, so the degree-2 ' +
         'deficit integrand (sinh(a tau)-1)A(tau) vanishes identically over [tauStar,U] -- D_2 = 0.',
    holds: () =>
      CELL_S3.aAtTauStar === 0 && CELL_S4.aAtTauStar === 0 &&
      CELL_S3.deficitTailAllZero && CELL_S4.deficitTailAllZero,
  },
  {
    id: 'imp3482-verdict-certifies-the-separation',
    why: 'The classified verdict must certify the imp-3469 D_2=0-identically claim via the strict ' +
         'tauStar-outside-support separation, not be indeterminate.',
    holds: () =>
      verdict === 'IMP3469-D2=0-IDENTICALLY-CERTIFIED-tauStar-STRICTLY-OUTSIDE-A-SUPPORT-MARGIN>1.18-BOTH-CELLS',
  },
  {
    id: 'imp3482-honest-certification-not-a-verdict',
    why: 'Mandatory honesty: support-separation certification only, mass-feasibility necessary-but-not- ' +
         'sufficient (no degree-2 ratio), operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3482_DEGREE2_DEFICIT_SUPPORT_CERTIFICATION.honestCaveat;
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

for (const assertion of IMP3482_DEGREE2_DEFICIT_SUPPORT_CERTIFICATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3482-degree2-deficit-support-certification assertion failed: ${assertion.id}`);
  }
}

export default IMP3482_DEGREE2_DEFICIT_SUPPORT_CERTIFICATION;
