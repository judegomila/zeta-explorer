/**
 * @module imp-3447-capture-ratio-o2-coefficient-perturbation
 * @fileoverview imp-3447 -- DERIVE the imp-3409 O(a^2) capture-ratio coefficient c
 *   from first-order singular-value perturbation theory through the second-order
 *   sinh-correction operators T3, G3, and TEST the derived closed form against the
 *   imp-3409 measured c ~ 1.58e-5 at U = 6.
 *
 *   THE SETUP (imp-3409 named the operators; it only fit c numerically)
 *   ------------------------------------------------------------------
 *   sinh(a Delta) = a Delta (1 + (a Delta)^2 / 6 + O(a^4)), so both Gram matrices are
 *   the linear kernel plus an a^2 correction times the common weight a:
 *     Gshear = a [ Glin + a^2 G3 + ... ],  G3(u,v) = Phi(u) Phi(v) Delta^3 / 6,
 *     T      = a [ Tlin + a^2 T3 + ... ],  T3(u,v) = Delta^3 Abar(|Delta|) / 6.
 *   The common a cancels in the ratio, leaving r(a) = ||Tlin + a^2 T3|| / ||Glin + a^2 G3||.
 *   imp-3409 measured that r(a) = r_lin + c a^2 + O(a^4) with c ~ 1.58e-5 at U = 6 but
 *   gave NO closed form for c. This module derives one.
 *
 *   THE DERIVATION (first-order perturbation of the top singular pair)
 *   -----------------------------------------------------------------
 *   For a matrix M(eps) = M0 + eps M1 the largest singular value shifts as
 *     sigma(eps) = sigma0 + eps <u0 | M1 | v0> + O(eps^2),
 *   where u0 (left) and v0 (right) are the UNIT top singular vectors of M0 (the standard
 *   Hellmann-Feynman / analytic-singular-value first-order shift; u0 = M0 v0 / sigma0).
 *   Applying this with eps = a^2 to the numerator (M0 = Tlin, M1 = T3) and denominator
 *   (M0 = Glin, M1 = G3) SEPARATELY -- each singular-value shift uses its OWN matrix top pair --
 *     ||Tlin + a^2 T3|| = sigma_T + a^2 dT + O(a^4),   dT = <uT | T3 | vT>,
 *     ||Glin + a^2 G3|| = sigma_G + a^2 dG + O(a^4),   dG = <uG | G3 | vG>,
 *   so with r_lin = sigma_T / sigma_G,
 *     r(a) = (sigma_T + a^2 dT) / (sigma_G + a^2 dG)
 *          = r_lin + a^2 r_lin (dT/sigma_T - dG/sigma_G) + O(a^4),
 *   giving the CLOSED FORM
 *     c = r_lin (dT/sigma_T - dG/sigma_G) = (dT - r_lin dG) / sigma_G
 *       = <uT | T3 | vT> / ||Glin||  -  r_lin <uG | G3 | vG> / ||Glin||.
 *   This is the compact ticket form <u_top | (T3 - r_lin G3) | v_top> / ||Glin|| with the
 *   understanding that T3 is evaluated on the NUMERATOR top pair (uT,vT) and G3 on the
 *   DENOMINATOR top pair (uG,vG) -- the two matrices do not share top singular vectors.
 *
 *   THE FINDING (derivation + numerical test, RH-equivalent, NO QED)
 *   ---------------------------------------------------------------
 *   At U = 6, N = 240 the derived coefficient is c_derived = (dT - r_lin dG)/sigma_G
 *   ~ 1.5796e-5, reproducing the imp-3409 measured c ~ 1.5793e-5 (recomputed here as
 *   e(a)/a^2 at the smallest a = 0.0625) to ~2e-4 RELATIVE error (~0.02%). Both the
 *   numerator shift dT and the denominator shift dG are positive; the denominator shift
 *   dominates (dG/sigma_G > dT/sigma_T), yet r_lin dG < dT so the net c stays positive --
 *   the sinh nonlinearity is a small POSITIVE O(a^2) drift, exactly the imp-3409 picture,
 *   now with an analytic coefficient rather than a fit.
 *   Derivation + numerical test only; RH-equivalent; carries NO RH verdict and NO QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3409-capture-ratio-sinh-residual-order.js (measured the O(a^2) rate + c ~ 1.58e-5 at U = 6, fit only)
 *   @see imp-3442-sinh-residual-coefficient-U-scaling.js (mapped c(U) near-1/U across the U-grid)
 *   @see imp-3350-capture-ratio-linear-shear-limit.js (the a -> 0 linear-shear limit + top singular vectors)
 *
 *   Ticket: imp-3447 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3409 / imp-3350 / imp-3240)
const N = 240; // representative resolution (the imp-3240 / imp-3409 headline grid)
const ITERS = 500; // power-iteration steps (identical to imp-3409)
const U_STAR = 6; // headline lag cutoff (imp-3409 / imp-3350 headline cell)
const A_SMALL = 0.0625; // smallest a of the imp-3409 ladder (the cleanest leading-order regime for the measured c)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (identical to imp-3409). */
function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Shared per-U build: midpoint nodes, Phi samples, and the per-lag autocorrelation Abar (identical to imp-3409). */
function buildPhiAbar(U) {
  const H = U / N;
  const u = new Array(N);
  const phi = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  const abar = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    let c = 0;
    for (let i = 0; i + k < N; i++) {
      s += phi[i] * phi[i + k];
      c += 1;
    }
    abar[k] = c ? s / c : 0;
  }
  return { u, phi, abar };
}

/**
 * Top singular triple of M via power iteration on M^T M: returns the largest singular
 * value sigma, the UNIT right singular vector v (top eigenvector of M^T M) and the UNIT
 * left singular vector u = M v / sigma. The <u|M1|v> shift is invariant under the shared
 * sign flip of (u,v), so no sign fix is needed.
 */
function topSVD(M, n, iters) {
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.sin(0.3 * i + 1);
  const nrm = (x) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += x[i] * x[i];
    return Math.sqrt(s);
  };
  const s0 = nrm(v);
  for (let i = 0; i < n; i++) v[i] /= s0;
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const Mv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const Mi = M[i];
      for (let j = 0; j < n; j++) s += Mi[j] * v[j];
      Mv[i] = s;
    }
    const MtMv = new Float64Array(n);
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += M[i][j] * Mv[i];
      MtMv[j] = s;
    }
    lam = nrm(MtMv);
    if (lam === 0) break;
    for (let j = 0; j < n; j++) v[j] = MtMv[j] / lam;
  }
  const sigma = Math.sqrt(lam);
  const uVec = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    const Mi = M[i];
    for (let j = 0; j < n; j++) s += Mi[j] * v[j];
    uVec[i] = sigma ? s / sigma : 0;
  }
  return { sigma, v, u: uVec };
}

/** Bilinear form <u | M | v> = sum_i u_i (M v)_i. */
function bilinear(uVec, M, v, n) {
  let s = 0;
  for (let i = 0; i < n; i++) {
    let row = 0;
    const Mi = M[i];
    for (let j = 0; j < n; j++) row += Mi[j] * v[j];
    s += uVec[i] * row;
  }
  return s;
}

/** Spectral norm only (top singular value) -- for the finite-a measured-c cross-check. */
function spectralNorm(M, n, iters) {
  return topSVD(M, n, iters).sigma;
}

// --- Build the linear kernels Tlin, Glin and the second-order sinh operators T3, G3. ---
const CTX = buildPhiAbar(U_STAR);
const { u, phi, abar } = CTX;
const Glin = [];
const Tlin = [];
const G3 = [];
const T3 = [];
for (let i = 0; i < N; i++) {
  const rG = new Float64Array(N);
  const rT = new Float64Array(N);
  const rG3 = new Float64Array(N);
  const rT3 = new Float64Array(N);
  for (let j = 0; j < N; j++) {
    const k = Math.abs(j - i);
    const d = u[j] - u[i];
    const d3 = d * d * d;
    rG[j] = phi[i] * phi[j] * d; // Glin(u,v) = Phi(u) Phi(v) Delta
    rT[j] = d * abar[k]; // Tlin(u,v) = Delta Abar(|Delta|)
    rG3[j] = (phi[i] * phi[j] * d3) / 6; // G3(u,v) = Phi(u) Phi(v) Delta^3 / 6
    rT3[j] = (d3 * abar[k]) / 6; // T3(u,v) = Delta^3 Abar(|Delta|) / 6
  }
  Glin.push(rG);
  Tlin.push(rT);
  G3.push(rG3);
  T3.push(rT3);
}

// --- First-order perturbation shifts through T3, G3 on their respective top singular pairs. ---
const TT = topSVD(Tlin, N, ITERS); // numerator top pair (uT, vT), sigma_T = ||Tlin||
const GG = topSVD(Glin, N, ITERS); // denominator top pair (uG, vG), sigma_G = ||Glin||
const SIGMA_T = TT.sigma;
const SIGMA_G = GG.sigma;
const R_LIN = SIGMA_T / SIGMA_G; // a-FREE linear-shear ratio r_lin (~0.02966, reproduces imp-3350)
const D_T = bilinear(TT.u, T3, TT.v, N); // dT = <uT | T3 | vT>  (numerator first-order shift)
const D_G = bilinear(GG.u, G3, GG.v, N); // dG = <uG | G3 | vG>  (denominator first-order shift)
// Closed-form coefficient: c = (dT - r_lin dG) / sigma_G = dT/sigma_G - r_lin dG/sigma_G.
const C_DERIVED = (D_T - R_LIN * D_G) / SIGMA_G;

// --- Independent measured-c cross-check: recompute e(a)/a^2 at the smallest imp-3409 a. ---
function ratioSinh(a) {
  const G = [];
  const T = [];
  for (let i = 0; i < N; i++) {
    const rG = new Float64Array(N);
    const rT = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const k = Math.abs(j - i);
      const sh = Math.sinh(a * (u[j] - u[i]));
      rG[j] = phi[i] * phi[j] * sh;
      rT[j] = sh * abar[k];
    }
    G.push(rG);
    T.push(rT);
  }
  return spectralNorm(T, N, ITERS) / spectralNorm(G, N, ITERS);
}
const C_MEASURED = (ratioSinh(A_SMALL) - R_LIN) / (A_SMALL * A_SMALL); // e(a)/a^2 at a = 0.0625, imp-3409 ~1.58e-5

const REL_ERROR = Math.abs(C_DERIVED - C_MEASURED) / Math.abs(C_MEASURED);
const shiftsPositive = D_T > 0 && D_G > 0;
const coefficientPositive = C_DERIVED > 0;
const derivedMatchesMeasured = REL_ERROR < 5e-3; // agree to better than 0.5%
const coefficientInImp3409Band = C_DERIVED > 1.4e-5 && C_DERIVED < 1.8e-5;

const verdict =
  shiftsPositive && coefficientPositive && derivedMatchesMeasured && coefficientInImp3409Band
    ? 'O(a^2)-COEFFICIENT-DERIVED-FROM-T3-G3-FIRST-ORDER-SHIFT-MATCHES-MEASURED'
    : 'INDETERMINATE';

export const IMP3447_CAPTURE_RATIO_O2_COEFFICIENT_PERTURBATION = Object.freeze({
  id: 'imp-3447-capture-ratio-o2-coefficient-perturbation',
  ticket: 'imp-3447',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentDiagnostic: 'imp-3409-capture-ratio-sinh-residual-order.js',
  relatedScaling: 'imp-3442-sinh-residual-coefficient-U-scaling.js',

  summary:
    'DERIVE the imp-3409 O(a^2) capture-ratio coefficient c from first-order singular-value perturbation theory ' +
    'through the second-order sinh operators T3(u,v) = Delta^3 Abar/6 and G3(u,v) = Phi(u) Phi(v) Delta^3/6, and ' +
    'TEST it against the imp-3409 measured c ~ 1.58e-5 at U = 6. Writing r(a) = ||Tlin + a^2 T3|| / ||Glin + a^2 G3||, ' +
    'the standard first-order shift sigma(eps) = sigma0 + eps <u0|M1|v0> applied with eps = a^2 to numerator and ' +
    'denominator on their OWN top singular pairs gives the closed form c = (dT - r_lin dG)/||Glin|| with ' +
    'dT = <uT|T3|vT>, dG = <uG|G3|vG>, r_lin = ||Tlin||/||Glin||. At U = 6, N = 240 this yields c_derived ~ 1.5796e-5, ' +
    'reproducing the imp-3409 measured c ~ 1.5793e-5 (recomputed as e(a)/a^2 at a = 0.0625) to ~0.02% relative error. ' +
    'Both shifts dT, dG are positive and r_lin dG < dT, so the net c stays positive -- the sinh nonlinearity is a ' +
    'small POSITIVE O(a^2) drift, now with an analytic coefficient. Derivation + numerical test only; RH-equivalent; ' +
    'carries NO RH verdict and NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    linearKernels: 'Glin(u,v) = Phi(u) Phi(v) Delta,  Tlin(u,v) = Delta Abar(|Delta|),  Delta = v - u',
    secondOrderOperators: 'T3(u,v) = Delta^3 Abar(|Delta|)/6,  G3(u,v) = Phi(u) Phi(v) Delta^3/6  (the imp-3409 sinh cubic term)',
    perturbationFormula: 'sigma(eps) = sigma0 + eps <u0|M1|v0> + O(eps^2), eps = a^2, u0 = M0 v0 / sigma0 (unit top singular pair)',
    numeratorShift: 'dT = <uT | T3 | vT>  (top pair of Tlin)',
    denominatorShift: 'dG = <uG | G3 | vG>  (top pair of Glin)',
    closedForm: 'c = r_lin (dT/sigma_T - dG/sigma_G) = (dT - r_lin dG)/sigma_G,  r_lin = sigma_T/sigma_G',
    ticketFormEquivalence:
      'the compact <u_top|(T3 - r_lin G3)|v_top>/||Glin|| with T3 on the numerator top pair and G3 on the denominator top pair (the two matrices do NOT share top singular vectors)',
    measuredCrossCheck: 'c_measured = (r(a) - r_lin)/a^2 at a = 0.0625 (smallest imp-3409 ladder point, cleanest leading order)',
    U: U_STAR,
    N,
    iters: ITERS,
    quadrature: 'midpoint, N panels on [0, U]; top singular pair via power iteration on M^T M (identical to imp-3409)',
    selfComputing: true,
  }),

  measured: Object.freeze({
    linearRatio: R_LIN, // a-FREE r_lin at U = 6, ~0.02966 (reproduces imp-3350 / imp-3409)
    sigmaT: SIGMA_T, // ||Tlin||
    sigmaG: SIGMA_G, // ||Glin||
    numeratorShift: D_T, // dT = <uT|T3|vT>
    denominatorShift: D_G, // dG = <uG|G3|vG>
    coefficientDerived: C_DERIVED, // c from first-order perturbation ~1.5796e-5
    coefficientMeasured: C_MEASURED, // imp-3409 e(a)/a^2 at a = 0.0625 ~1.5793e-5
    relativeError: REL_ERROR, // |c_derived - c_measured| / |c_measured| ~2e-4
    shiftsPositive,
    coefficientPositive,
    derivedMatchesMeasured, // |rel error| < 0.5%
    coefficientInImp3409Band, // 1.4e-5 < c < 1.8e-5
    verdict, // O(a^2)-COEFFICIENT-DERIVED-...-MATCHES-MEASURED
  }),

  interpretation: Object.freeze({
    closedFormForC:
      'The imp-3409 O(a^2) coefficient c, previously only fit numerically, is the standard first-order ' +
      'singular-value shift through the sinh cubic operators: c = (dT - r_lin dG)/||Glin|| with dT = <uT|T3|vT> ' +
      'and dG = <uG|G3|vG> the numerator/denominator shifts on their OWN top singular pairs. It reproduces the ' +
      'measured c to ~0.02% at U = 6.',
    whyPositive:
      'Both shifts dT, dG are positive; the denominator (Glin/G3) shift is the larger fractional shift ' +
      '(dG/sigma_G > dT/sigma_T), but r_lin dG < dT so the numerator wins and c > 0 -- confirming the imp-3409 ' +
      'positive O(a^2) drift with an analytic sign, not just a fitted one.',
    distinctSingularVectors:
      'The compact ticket form <u_top|(T3 - r_lin G3)|v_top>/||Glin|| must be read with T3 on the NUMERATOR top ' +
      'pair and G3 on the DENOMINATOR top pair: Tlin and Glin do not share top singular vectors, so a single ' +
      'shared (u_top, v_top) would be an approximation; using each matrix top pair is what recovers the 0.02% match.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationIsFirstOrderNotExact:
      'c is the LEADING (first-order in a^2) singular-value shift; the O(a^4) term (second-order perturbation + ' +
      'the sinh quintic) is neglected. The ~0.02% match at U = 6 confirms the leading term dominates the imp-3409 ' +
      '[0.0625, 0.5] ladder, but c is a leading-order coefficient, not an exact identity for r(a).',
    perturbationAssumesSimpleTopSingularValue:
      'The Hellmann-Feynman first-order shift assumes the top singular value of Tlin (and of Glin) is simple ' +
      '(non-degenerate) so the top singular pair is analytic in the perturbation; this is the generic case here ' +
      'but is not separately proved.',
    measuresCoefficientNotPositivity:
      'This derives and tests the O(a^2) coefficient c only; it does NOT construct the missing off-diagonal ' +
      'endpoint-Hankel magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity obstruction.',
    numericalTestNotSymbolicProof:
      'The closed form is verified NUMERICALLY (c_derived vs recomputed e(a)/a^2 at N = 240, ITERS = 500), not by ' +
      'a symbolic proof that the two agree to all orders; it is a derived-and-tested leading coefficient.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3447_CAPTURE_RATIO_O2_COEFFICIENT_PERTURBATION_ASSERTIONS = [
  {
    id: 'imp3447-linear-ratio-reproduces-imp3350',
    why: 'The a-FREE linear ratio r_lin = ||Tlin||/||Glin|| at U = 6 must reproduce the imp-3350 / imp-3409 ' +
      'headline capture ~0.02966, confirming the perturbation baseline is the correct linear-shear limit.',
    holds: () => R_LIN > 0.0296 && R_LIN < 0.0297,
  },
  {
    id: 'imp3447-shifts-positive',
    why: 'Both first-order shifts dT = <uT|T3|vT> and dG = <uG|G3|vG> through the sinh cubic operators must be ' +
      'positive; a negative shift would break the positive O(a^2) drift picture the derivation reproduces.',
    holds: () => shiftsPositive,
  },
  {
    id: 'imp3447-derived-coefficient-positive-and-in-band',
    why: 'THE CORE DELIVERABLE: the derived c = (dT - r_lin dG)/||Glin|| must be positive and land in the ' +
      'imp-3409 band (1.4e-5 < c < 1.8e-5), i.e. the analytic first-order shift recovers the measured order of ' +
      'magnitude and sign.',
    holds: () => coefficientPositive && coefficientInImp3409Band,
  },
  {
    id: 'imp3447-derived-matches-measured',
    why: 'THE CORE TEST: the derived c must match the independently recomputed measured c = e(a)/a^2 at a = 0.0625 ' +
      'to better than 0.5% relative error, certifying the first-order perturbation closed form is correct.',
    holds: () => derivedMatchesMeasured,
  },
  {
    id: 'imp3447-verdict-derived-matches',
    why: 'The classified verdict must be the derived-matches-measured finding, not indeterminate; a flip means the ' +
      'shift signs, the coefficient band, or the derived-vs-measured agreement failed.',
    holds: () => verdict === 'O(a^2)-COEFFICIENT-DERIVED-FROM-T3-G3-FIRST-ORDER-SHIFT-MATCHES-MEASURED',
  },
  {
    id: 'imp3447-honest-derivation-no-qed',
    why: 'Mandatory honesty: DERIVATION + numerical test only -- not a proof to all orders, not a reduction below ' +
      'RH, RH-equivalent, positivity not attempted, first-order (leading) coefficient not an exact identity, PT ' +
      '0.2 stays SOTA. Any flip is over-claiming.',
    holds: () => {
      const c = IMP3447_CAPTURE_RATIO_O2_COEFFICIENT_PERTURBATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.derivationIsFirstOrderNotExact === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3447_CAPTURE_RATIO_O2_COEFFICIENT_PERTURBATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3447-capture-ratio-o2-coefficient-perturbation assertion failed: ${assertion.id}`);
  }
}

export default IMP3447_CAPTURE_RATIO_O2_COEFFICIENT_PERTURBATION;
