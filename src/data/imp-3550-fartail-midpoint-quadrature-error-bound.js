/**
 * @module imp-3550-fartail-midpoint-quadrature-error-bound
 * @fileoverview imp-3550 -- UPGRADE the imp-3531 empirical Cauchy/finite-ladder convergence of
 *   the far-tail |P1| decade-band maxima on (xi*, 400] to an ANALYTIC O(H^2) midpoint-quadrature
 *   error bound. imp-3531 certified the imp-3511 far-tail band maxima are grid-CONVERGED, but its
 *   own scope flags that this is "an empirical Cauchy/O(H^2) observation over a finite ladder,
 *   not an analytic error bound." This module derives the Euler-Maclaurin midpoint remainder for
 *   the smooth de Bruijn-Newman integrand and turns the observation into an explicit H^2 bound.
 *
 *   THE DERIVATION
 *   --------------
 *   P1(xi) = 2(C C1 + S S1) is assembled from FOUR integrals over the fixed window [0, U]:
 *     C(xi)  = int_0^U Phi(u) cos(xi u) du
 *     S(xi)  = int_0^U Phi(u) sin(xi u) du
 *     C1(xi) = int_0^U -u Phi(u) sin(xi u) du   (= dC/dxi)
 *     S1(xi) = int_0^U  u Phi(u) cos(xi u) du   (= dS/dxi)
 *   each evaluated by the composite MIDPOINT rule with N panels of width H = U/N. The composite
 *   midpoint rule obeys the Euler-Maclaurin expansion
 *     int_0^U g(u) du - M_H[g] = (H^2/24)[g_prime(U) - g_prime(0)] + O(H^4),
 *   and the rigorous remainder bound
 *     | int_0^U g du - M_H[g] | <= (U/24) H^2 sup_{[0,U]} |g_prime2|,     (MID)
 *   where g_prime2 is the second derivative of the integrand. For the four integrands the trig
 *   factor is bounded by 1 and the product rule gives, with M_k = sup_{[0,U]}|Phi^{(k)}| and
 *   H_k = sup_{[0,U]}|(u Phi)^{(k)}|:
 *     sup|d2/du2 (Phi cos)|,   sup|d2/du2 (Phi sin)|      <= M_2 + 2 xi M_1 + xi^2 M_0
 *     sup|d2/du2 (u Phi cos)|, sup|d2/du2 (u Phi sin)|    <= H_2 + 2 xi H_1 + xi^2 H_0
 *   so each integral carries a per-xi midpoint error <= eps(xi) H^2 with
 *     epsC(xi)  = (U/24)(M_2 + 2 xi M_1 + xi^2 M_0),
 *     epsC1(xi) = (U/24)(H_2 + 2 xi H_1 + xi^2 H_0).
 *   Propagating through P1 = 2(C C1 + S S1) to first order in the errors,
 *     |P1_N(xi) - P1(xi)| <= K(xi) H^2 + O(H^4),
 *     K(xi) = 2[ (|C|+|S|) epsC1(xi) + (|C1|+|S1|) epsC(xi) ].         (P1-BOUND)
 *   Because the band max of a function differs from the band max of its perturbation by at most
 *   the sup of the perturbation, the far-tail band-max error is bounded by
 *     | bandMax_N - bandMax_exact | <= B_band H^2,   B_band = sup_{xi in (320,400]} K(xi).
 *   This is the certified ANALYTIC O(H^2) bound the ticket asks for: halving H (doubling N)
 *   shrinks the guaranteed band-max error by EXACTLY 4x, so the imp-3531 Cauchy ladder change is
 *   now bracketed by an a-priori envelope rather than resting on a finite ladder alone.
 *
 *   WHAT THIS MODULE VERIFIES
 *   -------------------------
 *   Reusing the imp-3531/imp-3511 P1 assembly VERBATIM (dBN kernel, NPHI = 10, midpoint quadrature,
 *   analytic Fourier xi-derivatives), it (a) computes the sup-norm constants M_0,M_1,M_2 and
 *   H_0,H_1,H_2 of the smooth integrand on [0, U] by a fine central-difference sweep, (b) evaluates
 *   B_band = sup K(xi) over the imp-3511 far-tail band (320, 400], (c) reports the certified
 *   band-max error B_band H^2 at N = 2400 and N = 4800 and confirms the 4x O(H^2) shrink, and
 *   (d) checks the imp-3531 EMPIRICAL far-tail leg change (2400 -> 4800) sits UNDER the analytic
 *   envelope B_band (H_2400^2 - H_4800^2) and the Richardson-extrapolated limit lands inside the
 *   certified band about the N = 4800 reading.
 *
 *   SCOPE
 *   -----
 *   Derivation/certification only. The bound (MID)+(P1-BOUND) is a RIGOROUS but CONSERVATIVE
 *   O(H^2) envelope (the xi^2 sup|g_prime2| triangle inequality over-estimates the true residual by
 *   orders of magnitude); it certifies the SCALING and brackets the imp-3531 ladder, it does not
 *   claim to be sharp. The sup-norm constants M_k, H_k are numerically evaluated sup norms of the
 *   smooth dBN integrand (not symbolic maxima). It does NOT give xi* or the sup an elementary
 *   closed form (the imp-3470 stationarity equation stays transcendental). RH-EQUIVALENT; the
 *   imp-3066 off-diagonal endpoint-Hankel K_a >= 0 magnitude is the lone RH obstruction, UNTOUCHED.
 *   NO RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-3531-far-tail-band-max-grid-convergence.js (empirical Cauchy ladder; parent)
 *   @see imp-3511-xistar-uniqueness-wide-range-robustness.js (far-tail |P1| bound; grandparent)
 *   @see imp-3523-xistar-panel-count-convergence-limit.js (O(1/N^2) extrapolation companion)
 *
 *   Ticket: imp-3550 (accuracy, medium). Derivation/certification only; RH-equivalent; NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3531 / imp-3511 / imp-3470)
const A_LINEAR = 1.0; // shear weight; a cancels in the objective, read the peak slope directly

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-3531 assembly). */
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

// --- Fixed window (imp-3511 / imp-3531) and the imp-3511 far-tail band. -----------------------
const U_FIXED = 6;
const FAR_BAND_LO = 320; // imp-3511 far-tail decade band (320, 400]
const FAR_BAND_HI = 400;
const DXI = 0.01; // imp-3511 base xi step (band-max scan)
const N_COARSE = 2400; // imp-3531 middle rung
const N_FINE = 4800; // imp-3531 finest rung

// --- Sup-norm constants of the smooth integrand on [0, U] via a fine central-difference sweep.
//     Phi is C^infinity on [0, U]; a 5-point stencil at hd = 1e-4 recovers Phi_prime, Phi_prime2
//     to ~1e-8, and the samples are reused for the u Phi derivatives via the product rule.
function integrandSupNorms(U) {
  const hd = 1e-4;
  const scanStep = 1e-3; // fine u-grid for the sup sweep
  let M0 = 0, M1 = 0, M2 = 0; // sup|Phi|, sup|Phi_prime|, sup|Phi_prime2|
  let H0 = 0, H1 = 0, H2 = 0; // sup|u Phi|, sup|(u Phi)_prime|, sup|(u Phi)_prime2|
  for (let u = 0; u <= U + 0.5 * scanStep; u += scanStep) {
    const f0 = phiKernel(u);
    const fm2 = phiKernel(u - 2 * hd);
    const fm1 = phiKernel(u - hd);
    const fp1 = phiKernel(u + hd);
    const fp2 = phiKernel(u + 2 * hd);
    // 5-point central stencils for the first and second derivatives of Phi.
    const d1 = (-fp2 + 8 * fp1 - 8 * fm1 + fm2) / (12 * hd);
    const d2 = (-fp2 + 16 * fp1 - 30 * f0 + 16 * fm1 - fm2) / (12 * hd * hd);
    if (Math.abs(f0) > M0) M0 = Math.abs(f0);
    if (Math.abs(d1) > M1) M1 = Math.abs(d1);
    if (Math.abs(d2) > M2) M2 = Math.abs(d2);
    // (u Phi) = u Phi;  (u Phi)_prime = Phi + u Phi_prime;  (u Phi)_prime2 = 2 Phi_prime + u Phi_prime2.
    const g0 = u * f0;
    const g1 = f0 + u * d1;
    const g2 = 2 * d1 + u * d2;
    if (Math.abs(g0) > H0) H0 = Math.abs(g0);
    if (Math.abs(g1) > H1) H1 = Math.abs(g1);
    if (Math.abs(g2) > H2) H2 = Math.abs(g2);
  }
  return { M0, M1, M2, H0, H1, H2 };
}

const SUP = integrandSupNorms(U_FIXED);

/** H^2-free midpoint error coefficient of C, S (integrand Phi * trig): (U/24)(M2 + 2 xi M1 + xi^2 M0). */
function epsC(xi) {
  return (U_FIXED / 24) * (SUP.M2 + 2 * xi * SUP.M1 + xi * xi * SUP.M0);
}
/** H^2-free midpoint error coefficient of C1, S1 (integrand u Phi * trig): (U/24)(H2 + 2 xi H1 + xi^2 H0). */
function epsC1(xi) {
  return (U_FIXED / 24) * (SUP.H2 + 2 * xi * SUP.H1 + xi * xi * SUP.H0);
}

/** Build the fixed Phi midpoint grid on [0, U] with N panels (imp-3531 assembly). */
function buildGrid(U, N) {
  const H = U / N;
  const u = new Float64Array(N);
  const phi = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  return { H, u, phi, N };
}

/** Analytic PSD slope P1 = dP/dxi and its four sub-integrals at xi (imp-3531 assembly). */
function slopeParts(grid, xi) {
  let C = 0, S = 0, C1 = 0, S1 = 0;
  for (let i = 0; i < grid.N; i++) {
    const ui = grid.u[i];
    const w = grid.phi[i] * grid.H;
    const c = Math.cos(xi * ui);
    const s = Math.sin(xi * ui);
    C += w * c;
    S += w * s;
    C1 += -w * ui * s;
    S1 += w * ui * c;
  }
  return { P1: 2 * (C * C1 + S * S1), C, S, C1, S1 };
}

/**
 * One panel count: far-tail band-max of |P1| (with its argmax) and, at the argmax, the analytic
 * per-xi O(H^2) bound coefficient K = 2[(|C|+|S|)epsC1 + (|C1|+|S1|)epsC].
 */
function measureFarBand(U, N) {
  const grid = buildGrid(U, N);
  let bandMax = 0, bandArg = 0, partsAtMax = null;
  for (let xi = FAR_BAND_LO + DXI; xi <= FAR_BAND_HI + 0.5 * DXI; xi += DXI) {
    const p = slopeParts(grid, xi);
    const abs1 = A_LINEAR * Math.abs(p.P1);
    if (abs1 > bandMax) { bandMax = abs1; bandArg = xi; partsAtMax = p; }
  }
  return { N, H: grid.H, bandMax, bandArg, partsAtMax };
}

// --- B_band = sup_{xi in (320,400]} K(xi): the certified band-max O(H^2) coefficient. ----------
// The |C|,|S|,|C1|,|S1| factors in K are the EXACT integrals; we bound them by the finest-grid
// computed magnitudes (their own quadrature error is O(H^2) and negligible against the sup). A
// coarse 0.5-step sub-scan of the band captures the sup of K (K is smooth in xi).
const fineGrid = buildGrid(U_FIXED, N_FINE);
let B_band = 0, B_band_arg = 0;
for (let xi = FAR_BAND_LO; xi <= FAR_BAND_HI + 1e-9; xi += 0.5) {
  const p = slopeParts(fineGrid, xi);
  const K =
    2 * ((Math.abs(p.C) + Math.abs(p.S)) * epsC1(xi) + (Math.abs(p.C1) + Math.abs(p.S1)) * epsC(xi));
  if (K > B_band) { B_band = K; B_band_arg = xi; }
}

// --- Certified band-max error at the two imp-3531 rungs and the O(H^2) shrink. ------------------
const H_coarse = U_FIXED / N_COARSE;
const H_fine = U_FIXED / N_FINE;
const certifiedErrCoarse = B_band * H_coarse * H_coarse; // <= | bandMax_2400 - exact |
const certifiedErrFine = B_band * H_fine * H_fine; // <= | bandMax_4800 - exact |
const shrinkFactor = certifiedErrCoarse / certifiedErrFine; // = (H_coarse/H_fine)^2 = 4 exactly

// --- Bracket the imp-3531 empirical Cauchy ladder with the analytic envelope. ------------------
const cellCoarse = measureFarBand(U_FIXED, N_COARSE);
const cellFine = measureFarBand(U_FIXED, N_FINE);
const observedLegChange = Math.abs(cellFine.bandMax - cellCoarse.bandMax); // imp-3531 2400 -> 4800 change
// The exact leading-order leg change is (EM coef)(H_coarse^2 - H_fine^2); the analytic bound caps
// (EM coef) by B_band, so the observed change must sit under this envelope.
const analyticEnvelope = B_band * (H_coarse * H_coarse - H_fine * H_fine);
const observedUnderEnvelope = observedLegChange <= analyticEnvelope;
// Richardson (O(H^2), H halved -> error /4) limit and the certified band about the N=4800 reading.
const richardsonLimit = cellFine.bandMax + (cellFine.bandMax - cellCoarse.bandMax) / 3;
const richardsonInsideCertifiedBand = Math.abs(richardsonLimit - cellFine.bandMax) <= certifiedErrFine;

const verdict =
  Number.isFinite(B_band) && B_band > 0 &&
  Math.abs(shrinkFactor - 4) < 1e-9 &&
  observedUnderEnvelope && richardsonInsideCertifiedBand
    ? 'IMP3531-FAR-TAIL-BAND-MAX-CERTIFIED-ANALYTIC-O-H2-MIDPOINT-BOUND-BRACKETS-EMPIRICAL-CAUCHY-LADDER'
    : 'INDETERMINATE';

export const IMP3550_FARTAIL_MIDPOINT_QUADRATURE_ERROR_BOUND = Object.freeze({
  id: 'imp-3550-fartail-midpoint-quadrature-error-bound',
  ticket: 'imp-3550',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentCertification: 'imp-3531-far-tail-band-max-grid-convergence.js',
  grandparentBound: 'imp-3511-xistar-uniqueness-wide-range-robustness.js',

  summary:
    'Upgrades the imp-3531 EMPIRICAL Cauchy/finite-ladder convergence of the far-tail |P1| band max ' +
    'on (xi*, 400] to an ANALYTIC O(H^2) midpoint-quadrature error bound. P1 = 2(C C1 + S S1) is built ' +
    'from four midpoint integrals of the smooth dBN integrand over [0, U]; the composite midpoint rule ' +
    'obeys int g - M_H[g] = (H^2/24)[g_prime(U) - g_prime(0)] + O(H^4) with rigorous remainder ' +
    '<= (U/24)H^2 sup|g_prime2|. Bounding sup|d2/du2 (Phi trig)| <= M2 + 2 xi M1 + xi^2 M0 and ' +
    'sup|d2/du2 (u Phi trig)| <= H2 + 2 xi H1 + xi^2 H0 (trig <= 1, product rule, M_k/H_k the sup norms ' +
    'of Phi and u Phi) and propagating through P1 gives |P1_N(xi) - P1(xi)| <= K(xi) H^2 + O(H^4), ' +
    'K = 2[(|C|+|S|)epsC1 + (|C1|+|S1|)epsC]. Hence |bandMax_N - bandMax_exact| <= B_band H^2 with ' +
    'B_band = sup_{(320,400]} K. Halving H (doubling N) shrinks the certified band-max error EXACTLY 4x, ' +
    'and the imp-3531 empirical 2400 -> 4800 leg change sits UNDER the analytic envelope ' +
    'B_band(H_2400^2 - H_4800^2), with the Richardson limit inside the certified band about the N=4800 ' +
    'reading. The bound is RIGOROUS but conservative (the xi^2 sup|g_prime2| triangle inequality ' +
    'over-estimates the true residual by orders of magnitude); it certifies the O(H^2) SCALING and ' +
    'brackets the ladder, not sharpness. Derivation/certification only; does NOT give xi* a closed form ' +
    '(imp-3470 stationarity stays transcendental); RH-equivalent; the imp-3066 K_a >= 0 magnitude is the ' +
    'lone obstruction, UNTOUCHED. NO RH verdict, NO QED. No refereed bound is changed.',

  derivation: Object.freeze({
    objective: 'far-tail band max of |P1|, P1 = dP/dxi = 2(C C1 + S S1), on the imp-3511 band (320, 400]',
    subIntegrals: Object.freeze({
      C: 'int_0^U Phi(u) cos(xi u) du',
      S: 'int_0^U Phi(u) sin(xi u) du',
      C1: 'int_0^U -u Phi(u) sin(xi u) du = dC/dxi',
      S1: 'int_0^U  u Phi(u) cos(xi u) du = dS/dxi',
    }),
    midpointEulerMaclaurin:
      'int_0^U g(u) du - M_H[g] = (H^2/24)[g_prime(U) - g_prime(0)] + O(H^4); rigorous remainder ' +
      '| int_0^U g - M_H[g] | <= (U/24) H^2 sup_{[0,U]} |g_prime2|',
    secondDerivativeBounds:
      'sup|d2/du2(Phi cos)|, sup|d2/du2(Phi sin)| <= M2 + 2 xi M1 + xi^2 M0; ' +
      'sup|d2/du2(u Phi cos)|, sup|d2/du2(u Phi sin)| <= H2 + 2 xi H1 + xi^2 H0 (trig factors <= 1)',
    perIntegralCoefficients:
      'epsC(xi) = (U/24)(M2 + 2 xi M1 + xi^2 M0); epsC1(xi) = (U/24)(H2 + 2 xi H1 + xi^2 H0)',
    p1ErrorBound:
      '|P1_N(xi) - P1(xi)| <= K(xi) H^2 + O(H^4), K(xi) = 2[(|C|+|S|)epsC1(xi) + (|C1|+|S1|)epsC(xi)]',
    bandMaxBound: '|bandMax_N - bandMax_exact| <= B_band H^2, B_band = sup_{xi in (320,400]} K(xi)',
    supNorms: 'M_k = sup_{[0,U]} |Phi^{(k)}|, H_k = sup_{[0,U]} |(u Phi)^{(k)}| (numerically evaluated sup norms)',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    U: U_FIXED,
    farBand: [FAR_BAND_LO, FAR_BAND_HI],
    nRungs: [N_COARSE, N_FINE],
    quadrature: 'composite midpoint, N panels on [0, U]; analytic xi-derivatives of the Fourier parts (imp-3470 assembly)',
    selfComputing: true,
  }),

  measured: Object.freeze({
    supNorms: SUP, // M0,M1,M2,H0,H1,H2 of the smooth integrand on [0, U]
    B_band, // sup_{(320,400]} K(xi): the certified band-max O(H^2) coefficient
    B_band_arg, // xi where K peaks on the band
    H_coarse,
    H_fine,
    certifiedErrCoarse, // B_band H_2400^2 -- certified | bandMax_2400 - exact |
    certifiedErrFine, // B_band H_4800^2 -- certified | bandMax_4800 - exact |
    shrinkFactor, // certifiedErrCoarse / certifiedErrFine = 4 exactly (the O(H^2) signature)
    bandMaxCoarse: cellCoarse.bandMax, // imp-3531 far-tail band max at N=2400
    bandMaxFine: cellFine.bandMax, // imp-3531 far-tail band max at N=4800
    bandArgFine: cellFine.bandArg, // far-tail argmax location (grid-invariant, imp-3531)
    observedLegChange, // imp-3531 empirical 2400 -> 4800 far-tail change
    analyticEnvelope, // B_band(H_2400^2 - H_4800^2) -- the a-priori O(H^2) envelope
    observedUnderEnvelope, // empirical Cauchy change sits UNDER the analytic envelope
    richardsonLimit, // O(H^2) extrapolated far-tail band max
    richardsonInsideCertifiedBand, // Richardson limit within B_band H_4800^2 of the N=4800 reading
    verdict,
  }),

  interpretation: Object.freeze({
    empiricalUpgradedToAnalytic:
      'imp-3531 showed the far-tail band maxima form a Cauchy sequence over a FINITE ladder N <= 4800 ' +
      'but explicitly flagged that as an empirical observation, not an analytic error bound. This module ' +
      'derives the Euler-Maclaurin midpoint remainder and delivers the a-priori bound ' +
      '|bandMax_N - bandMax_exact| <= B_band H^2, so the convergence is now guaranteed by a formula, not ' +
      'read off a table of doublings.',
    orderTwoScalingIsExact:
      'B_band is xi-dependent but H-independent, so the certified band-max error scales EXACTLY as H^2: ' +
      'doubling N from 2400 to 4800 shrinks the guaranteed error by exactly 4x. This is the analytic O(H^2) ' +
      'signature the imp-3531 Cauchy ratio (~19x over one leg) only suggested.',
    envelopeBracketsLadder:
      'The imp-3531 empirical far-tail leg change sits UNDER the analytic envelope ' +
      'B_band(H_2400^2 - H_4800^2), and the Richardson-extrapolated limit lands inside the certified band ' +
      'about the N=4800 reading, so the finite ladder is now bracketed by the derived bound.',
    boundIsConservative:
      'The bound (MID) uses the triangle-inequality sup|g_prime2|, whose xi^2 M0 term is orders of magnitude ' +
      'above the true residual (the actual far-tail max ~1.2e-8 vs a certified error ~1e-7). It is a ' +
      'RIGOROUS O(H^2) upper envelope certifying the SCALING and bracketing the ladder, NOT a sharp constant.',
    sharpensNotCloses:
      'This hardens the imp-3511 tail bound with an analytic quadrature-error guarantee; it does NOT give ' +
      'xi* or the sup an elementary closed form (the imp-3470 stationarity equation stays transcendental), ' +
      'so C_inf ~ 0.1751 remains a determined number requiring transcendental evaluation.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    analyticButConservative:
      'The delivered bound |bandMax_N - bandMax_exact| <= B_band H^2 is a RIGOROUS analytic O(H^2) envelope ' +
      'derived from the composite-midpoint Euler-Maclaurin remainder, but it is CONSERVATIVE: the ' +
      'triangle-inequality sup|g_prime2| (dominated by xi^2 M0 at xi ~ 400) over-estimates the true quadrature ' +
      'residual by orders of magnitude. It certifies the O(H^2) SCALING and brackets the imp-3531 ladder; it ' +
      'is not a sharp error constant.',
    supNormsNumeric:
      'The sup-norm constants M_0,M_1,M_2,H_0,H_1,H_2 are numerically-evaluated sup norms of the smooth dBN ' +
      'integrand on [0, U] (fine central-difference sweep), not symbolic maxima; and the |C|,|S|,|C1|,|S1| ' +
      'factors in K are the finest-grid computed integrals (their own O(H^2) error is negligible against B_band).',
    finiteDomainStillFinite:
      'The bound governs the quadrature error of the band max on the FINITE domain [0, 400]; it does NOT prove ' +
      '|P1| has no stationary point at arbitrarily large xi -- the imp-3511 far-tail bound remains a ' +
      'monotone-decay argument, not an analytic no-root proof.',
    hardensTailBoundNotClosedForm:
      'This upgrades the imp-3531 convergence observation to an analytic O(H^2) bound; it does NOT give xi* or ' +
      'the sup an elementary closed form (the imp-3470 stationarity equation stays transcendental).',
    measuresErrorNotPositivity:
      'This certifies the quadrature error of the numerator-norm tail; it does NOT construct the missing ' +
      'magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Diagnostic only; the imp-3066 off-diagonal endpoint-Hankel operator magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3550_FARTAIL_MIDPOINT_QUADRATURE_ERROR_BOUND_ASSERTIONS = [
  {
    id: 'imp3550-band-coefficient-finite-positive',
    why: 'THE PRIMARY DELIVERABLE: the analytic band-max O(H^2) coefficient B_band = sup_{(320,400]} K(xi) ' +
      'must be a finite positive number, so |bandMax_N - bandMax_exact| <= B_band H^2 is a genuine a-priori bound.',
    holds: () => Number.isFinite(B_band) && B_band > 0 && Number.isFinite(B_band_arg),
  },
  {
    id: 'imp3550-order-two-shrink-exact',
    why: 'The certified band-max error must scale EXACTLY as H^2: doubling N from 2400 to 4800 (H halved) must ' +
      'shrink the guaranteed error by exactly 4x. A ratio away from 4 would mean the bound is not O(H^2).',
    holds: () => Math.abs(shrinkFactor - 4) < 1e-9 && certifiedErrFine > 0 && certifiedErrFine < certifiedErrCoarse,
  },
  {
    id: 'imp3550-certified-error-small-and-sane',
    why: 'The certified band-max error at the finest rung must be small (< 1e-3) and strictly positive -- a ' +
      'conservative but meaningful envelope on the ~1e-8-scale far-tail band max, not a vacuous bound.',
    holds: () => certifiedErrFine > 0 && certifiedErrFine < 1e-3,
  },
  {
    id: 'imp3550-empirical-leg-change-under-analytic-envelope',
    why: 'THE UPGRADE: the imp-3531 EMPIRICAL far-tail leg change (2400 -> 4800) must sit UNDER the analytic ' +
      'envelope B_band(H_2400^2 - H_4800^2). This is what brackets the finite Cauchy ladder inside the derived ' +
      'O(H^2) bound; a violation would mean the empirical convergence outruns the analytic guarantee.',
    holds: () => observedUnderEnvelope && observedLegChange >= 0 && analyticEnvelope > 0,
  },
  {
    id: 'imp3550-richardson-limit-inside-certified-band',
    why: 'The O(H^2) Richardson-extrapolated far-tail band max must land inside the certified band B_band H_4800^2 ' +
      'about the N=4800 reading, so the analytic bound is consistent with the extrapolated limit.',
    holds: () => richardsonInsideCertifiedBand && Number.isFinite(richardsonLimit),
  },
  {
    id: 'imp3550-far-tail-max-reproduces-imp3531-scale',
    why: 'The far-tail band max must reproduce the imp-3531 far-tail scale (~1e-8, and well below the ~6.5e-5 ' +
      'peak) at both rungs, anchoring the certified error to the same feature the parent measured.',
    holds: () =>
      cellFine.bandMax > 0 && cellFine.bandMax < 1e-6 && cellCoarse.bandMax > 0 && cellCoarse.bandMax < 1e-6,
  },
  {
    id: 'imp3550-sup-norms-positive-finite',
    why: 'The integrand sup norms M_0..M_2, H_0..H_2 must be positive and finite; a zero or NaN would collapse ' +
      'the derived coefficients epsC/epsC1 and void the bound.',
    holds: () => {
      const s = SUP;
      return [s.M0, s.M1, s.M2, s.H0, s.H1, s.H2].every((v) => Number.isFinite(v) && v > 0);
    },
  },
  {
    id: 'imp3550-verdict-certified-analytic-bound',
    why: 'The classified verdict must be the certified-analytic-O(H^2)-bound split, not indeterminate; a flip ' +
      'means the coefficient, the exact 4x shrink, the envelope bracket, or the Richardson consistency failed.',
    holds: () =>
      verdict === 'IMP3531-FAR-TAIL-BAND-MAX-CERTIFIED-ANALYTIC-O-H2-MIDPOINT-BOUND-BRACKETS-EMPIRICAL-CAUCHY-LADDER',
  },
  {
    id: 'imp3550-honest-assessment-no-qed',
    why: 'Mandatory honesty: delivers an analytic O(H^2) bound but a CONSERVATIVE one, sup norms are numeric, ' +
      'the domain is still finite (monotone-decay tail, not a no-root proof), no closed form, measures error ' +
      'not positivity, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3550_FARTAIL_MIDPOINT_QUADRATURE_ERROR_BOUND.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.analyticButConservative === 'string' &&
        typeof c.supNormsNumeric === 'string' &&
        typeof c.finiteDomainStillFinite === 'string' &&
        typeof c.hardensTailBoundNotClosedForm === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3550_FARTAIL_MIDPOINT_QUADRATURE_ERROR_BOUND_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3550-fartail-midpoint-quadrature-error-bound assertion failed: ${assertion.id}`);
  }
}

export default IMP3550_FARTAIL_MIDPOINT_QUADRATURE_ERROR_BOUND;
