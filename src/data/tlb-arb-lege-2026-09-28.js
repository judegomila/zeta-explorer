/**
 * tlb-arb-lege-2026-09-28 — ARB-LEGE (twin-ladder + bridge wave, pick 1): leg (E) of the Route I pole-free
 * one-prime Weil positivity certificate, executed in Arb ball arithmetic (python-flint 0.9.0, 256-bit). This
 * closes the only leg imp-96544 left open. Together with legs (A) nesting, (B) floor lemma, (C) operator split
 * and (D) tail, the certificate is interval-rigorous. Two adversarial referee passes; referee corrections applied
 * (see refereeCorrections in the exported object). Supersedes the unrefereed draft rh-route-i-arb-lege-one-prime-interval-certificate-2026-09-28.
 *
 * =====================================================================================================
 * PROVED (computer-assisted, Arb; two internal adversarial referee passes, no error in the argument; one
 * quadrature constant corrected, conclusion unchanged; NOT externally refereed)
 * =====================================================================================================
 * Let a0 = (ln 3)/2 and w(t) = 2theta'(t) - m_2(t), with 2theta'(t) = Re psi(1/4 + it/2) - ln pi and
 * m_2(t) = 2 ln2 sum_k 2^{-k/2} cos(k t ln2). For every real h in L^2(-a, a) with a <= a0 and hhat(+-i/2) = 0,
 *     W(h) = (1/2pi) int w(t) |hhat(t)|^2 dt  >=  8.2045368e-4 ||h||^2        [(T,N) = (200,240), M_2 floor]
 *                                             >=  9.0434717e-4 ||h||^2        [(T,N) = (400,320), M_2 floor]
 *                                             >=  9.1897354e-4 ||h||^2        [(T,N) = (200,240), sqrt2 ln2 floor]
 * (Arb lower endpoints, rounded down). For 2a <= ln 3 < 2 ln 2 the k >= 2 terms of m_2 pair with the
 * autocorrelation g = h*h~ outside its support (and g(ln 3) = 0 at the endpoint), so W is the same quadratic form
 * with the single-cosine symbol w_1 = 2theta' - sqrt2 ln2 cos(t ln2). By the explicit formula, W = Arch(h) - P_2(h):
 * Weil's functional restricted to POLE-FREE test functions of support width 2a <= ln 3. This is not positivity of
 * the full Weil functional (pole terms excluded). Scope in the repo: the previous interval-rigorous reach was
 * 2a <= 0.96 (Toeplitz-Krein LP certificate); this covers 0.96 < 2a <= ln 3 = 1.0986. Novelty against the
 * small-support literature (Yoshida 1992, Bombieri 2000, Connes-Consani 2021 up to support ln 2) has NOT been
 * checked; the claim is a gain in the repo's own interval-rigorous reach.
 *
 * COROLLARY (T_a[sigma_2]), reduction written out and re-derived by both referees. For phi in H^2_0(-a,a) put
 * h = phi/4 - phi''. Then hhat(t) = (t^2 + 1/4) phihat(t), so h is pole-free and
 * q(phi) := (1/2pi) int sigma_2 |phihat|^2 = W(h), sigma_2 = (t^2+1/4)^2 w_1. Also
 * ||h||^2 = ||phi''||^2 + ||phi'||^2/2 + ||phi||^2/16 >= (1/4 + (pi/2a)^2)^2 ||phi||^2 (Dirichlet Poincare on phi
 * and on phi', both in H^1_0). Hence lambda_1(T_a[sigma_2]) >= 8.2045e-4 * 71.01967 = 0.058268 > 0 for every
 * 2a <= ln 3 (the factor grows as a shrinks, so nesting holds). This settles frontier-dag node route-i-uniform-n-gap
 * on 2a <= ln 3, and replaces the Krein c-sharp cohort's best rigorous floor (-3065.4) by +0.0583.
 *
 * PROOF STRUCTURE (every number an Arb ball or a rigorous upper bound; scripts tmp/tlb-1-*, corrected reruns
 * tmp/tlb-1-ref0-arb-lege-fixed-T*-N*-*.json):
 *  (B) m_T = 2theta'(T) - floor, by acb_digamma: m_200 = 0.11362861041048217323 (M_2 floor), inside the imp-96544
 *      mpmath.iv enclosure [0.11362861040986, 0.11362861041111]; m_400 = 0.80677657222470000271.
 *  (E) Galerkin entries A_mn = (2a0/pi) eps_m eps_n sqrt((2m+1)(2n+1)) int_0^T (w - m_T) j_m(a0 t) j_n(a0 t) dt by
 *      Gauss-Legendre with Q = 24 nodes (Arb nodes/weights) on panels of width 1/2. Error bound for the Q-node rule
 *      (Trefethen 2008 Thm 4.5 with I_n the (n+1)-point rule): |I - I_Q| <= (64/15) M rho^{-2(Q-1)}/(rho^2 - 1).
 *      [REFEREE FIX: the draft used rho^{-2Q}, too small by rho^2 = 9.737; counterexample T_{2Q} violates it.]
 *      Ellipse semi-minor axis 0.35 < 1/2 (poles of psi(1/4+iz/2) and of m_2 sit at Im z = +-1/2), rho = 3.1205.
 *      M bounded by maximum modulus on 256 Arb boxes covering each ellipse boundary, times |j_n(zeta)| <=
 *      sinh|Im zeta|/|Im zeta| (Poisson representation). Per-entry radius r_mn = C sqrt((2m+1)(2n+1)), corrected
 *      C = 9.64e-22 (T=200) / 1.92e-21 (T=400) / 3.59e-22 (single cosine); r_max = 4.62e-19 (T200N240) /
 *      1.23e-18 (T400N320) / 1.72e-19 (T200N240, single cosine). Arb bessel_j at 256 bits; wide-but-valid balls
 *      recomputed at 512-2048 bits. Parity sectors split exactly (cross-parity blocks are zero).
 *      Pole-free compression: c_n = sqrt(2a0(2n+1)) i_n(a0/2), the Legendre coefficients of cosh/sinh(u/2).
 *      lambda_min(A|c^perp) >= s - ||E||_2, with s from a successful Arb LDL^T of the midpoint matrix
 *      (A_mid - sI + 10^6 c c^T/|c|^2), every pivot lower endpoint > 0 (min 0.024 at T=200, 0.042 at T=400), and
 *      ||E||_2 <= max row sum of radii <= 1.31e-16 (corrected). Interval LDL^T of the ball matrix itself fails from
 *      the wrapping effect (radius 1e-20 grows to 1 by pivot 42), hence the Weyl-on-midpoint route.
 *  (D) ||K Q_N|| <= sqrt((2 Phi^2/pi) sum_{n>=N} (aT)^{2n+1}/((2n+1)!!)^2) (Hilbert-Schmidt, from |j_n(x)| <=
 *      x^n/(2n+1)!! and Plancherel), Phi = sup_[0,T] |w - m_T| <= 8.8381 (T=200) / 9.5313 (T=400) from an Arb
 *      real-ball cover. Cross terms are <= 1.618 ||K Q_N||, so charging 2 ||K Q_N|| is safe.
 *  (trunc) eta' = ||Q_N c||/||P_N c|| <= 1e-400; cost (2 eta' + eta'^2) Phi carried explicitly; mu < 0 asserted.
 *  c_lower = m_T + s - ||E|| - 2||K Q_N|| - (2eta' + eta'^2) Phi, an Arb ball with positive lower endpoint.
 *
 * =====================================================================================================
 * MEASURED (double precision / numerical cross-checks)
 * =====================================================================================================
 *  - Double rebuilds from two independent quadratures (scipy GL q=20 on 0.5-panels; referee GL q=40 on 0.25-panels
 *    with QR complement) agree with the Arb Galerkin enclosure [8.20453687159e-4, 8.20453697160e-4] to within
 *    3e-15. [REFEREE FIX: this is agreement within a roundoff tolerance, NOT strict inclusion; the referee's double
 *    values sit 1.5-2.8e-15 above the Arb upper endpoint, from double roundoff in m_T and eigh.] The certificate's
 *    lower endpoint is ~1e-11 below the double value, so containment is not load-bearing.
 *  - Normalisation, 4 ways, for pole-free h = (a0^2 - x^2)^6 (1 + beta x^2): W = 5.47451987918e-8; zero sum over 138
 *    zeros vs t-side 4.0e-15, Arb-midpoint Galerkin vs t-side 1.0e-13, single vs full m_2 6e-16, P_2 x- vs t-side
 *    1.1e-13; a flipped p=2 sign would move W by 14%. Referee: random rough pole-free h, direct t-quadrature to 4000
 *    equals m_T||h||^2 + x^T K x + tail to 8e-16 relative; adaptive rigorous acb.integral entries at 320 bits match.
 *  - sigma_2 reduction: q(phi) = W(h) to 2.7e-14; imp-96749 Ritz value (N=20, m=3) reproduced as 0.6253969.
 *  - Tightness: independent Rayleigh-Ritz upper bounds (basis (a^2-x^2)^m P_n, no Bessel) on inf W/||h||^2 give
 *    9.78e-4 / 9.60e-4 / 9.49e-4, all >= the certified 9.0435e-4: certificate within ~5% of tight.
 *  - Quadrature bound conservative by >= 1e7 (GL24 vs GL48 at 60 digits differ by 1e-32..1e-181 vs bound 3.4e-24).
 *
 * CONDITIONAL / CITED (not re-proved): Gauss-Legendre error theorem (Trefethen 2008 Thm 4.5 / ATAP Thm 19.3,
 * constant 64/15); Arb correctness for digamma, Bessel, Legendre roots; 2theta' increasing for t > 0 (positive
 * series). The margin survives even a weakened rho^{-Q} quadrature law (error norm ~4e-6 << 8.2e-4).
 *
 * HEURISTIC / INTERPRETATION (no proof content). Twin-ladder reading: 2theta' is the Wigner-Smith delay of the
 * lossless bridge chi on sigma = 1/2 and the cos(t ln2) term is the delay of the p = 2 prime section T_2. The theorem
 * says the total interferometer delay, compressed to PW_{a0} and restricted to pole-free inputs, is positive-definite
 * with margin 8.2e-4, with no zero-location input. Sibling tlb-dh-blind-2026-09-28 shows (at conductor 5) that
 * positivity at this support is also satisfied by a same-bridge RH-false twin, so it does not encode the Euler product.
 *
 * SCOPE. Fixed-window positivity of the one-prime pole-free Weil form is consistent with RH and implies nothing about
 * it: it localises no zero and moves no Lambda bound. RH is open. PT Lambda <= 0.2 stands as the accepted benchmark;
 * the repo's Lambda <= 0.1758354 remains a computer-assisted candidate (four barrier gates in Arb, y-transfer
 * reduction and Lemma B3 Lean-checked), not yet peer-reviewed. External Sept-2026 preprints (2a <= 1.6) remain UNVERIFIED here. NO QED.
 *
 * Import-light: only floorBeyond/M2MAX from the uncertainty-certificate module (no zeros bundle).
 * Assertions compare baked literals and recompute the Poincare factor / floor live; well under 1 s.
 */

import { floorBeyond, M2MAX } from './rh-route-i-uncertainty-concentration-certificate-2026-09-24.js';

/** baked Arb endpoints (strings rounded OUTWARD from the corrected reruns tmp/tlb-1-ref0-arb-lege-fixed-*.json) */
export const TLB_ARB_LEGE = Object.freeze({
  id: 'tlb-arb-lege-2026-09-28',
  date: '2026-09-28',
  title: 'ARB-LEGE: Arb interval certificate of pole-free one-prime Weil positivity on 2a <= ln 3',
  supersedesDraft: 'rh-route-i-arb-lege-one-prime-interval-certificate-2026-09-28 (unrefereed draft, removed)',
  status: 'PROVED (computer-assisted, Arb; two internal adversarial referee passes, one quadrature constant corrected, '
    + 'conclusion unchanged; not externally refereed) for pole-free h, 2a <= ln 3. Corollary lambda_1(T_a[sigma_2]) >= 0.0583. '
    + 'Implies nothing about Lambda, zero locations or RH. NO QED.',
  verdict: 'SUCCESS: W(h) >= 8.2045e-4 ||h||^2 (9.0435e-4 at T=400) on pole-free h in L^2(-a,a), all 2a <= ln 3, certified in Arb; '
    + 'repo interval-rigorous reach moves from 2a <= 0.96 to 2a <= ln 3 (novelty vs small-support literature not checked). '
    + 'No new Lambda bound. No refereed bound is changed; 0.1758354 remains a candidate. NO QED.',
  a0: 'ln(3)/2 (Arb ball)',
  arithmetic: 'python-flint 0.9.0 (Arb), 256-bit working precision; Bessel recomputed at 512-2048 bits where Arb returned a wide ball',
  quadrature: {
    rule: 'Gauss-Legendre Q=24 nodes on panels of width 0.5, Arb nodes/weights',
    ellipseSemiMinor: 0.35, rho: 3.1204650534, boundaryBoxes: 256, nodes: 24,
    errorTheorem: 'Trefethen 2008 Thm 4.5 (I_n = (n+1)-point rule): Q-node error <= (64/15) M rho^{-2(Q-1)}/(rho^2-1)',
    draftErrorTheoremWrong: '(64/15) M rho^{-2Q}/(rho^2-1) (too small by rho^2; violated by T_{2Q})',
  },
  runs: Object.freeze({
    T200N160full: {
      floor: 'M_2', mT: '0.11362861041048217323', PhiRealUpper: 8.838065298, quadConst: 9.643e-22, rMax: 3.076e-19, EnormMax: 1.651e-17,
      muEven: { sLower: '-0.112808156723323', rayleighUpper: '-0.112808156713322', double: -0.11280815671332282 },
      muOdd: { sLower: '-0.0937440880305968', rayleighUpper: '-0.0937440870305977', double: -0.0937440870305967 },
      pivotMinLower: 0.02403, tailHS: 2.734e-6, tailBernsteinForm: 5.47e-11, etaTermLog10: -421,
      cGalerkin: ['8.20453687159e-4', '8.20453697160e-4'], cLower: '8.14986392380e-4',
    },
    T200N240full: {
      floor: 'M_2', mT: '0.11362861041048217323', PhiRealUpper: 8.838065298, quadConst: 9.643e-22, rMax: 4.619e-19, EnormMax: 3.711e-17,
      muEven: { sLower: '-0.112808156723323', rayleighUpper: '-0.112808156713322', double: -0.11280815671332245 },
      muOdd: { sLower: '-0.0937440880305977', rayleighUpper: '-0.0937440870305977', double: -0.09374408703059765 },
      pivotMinLower: 0.02403, tailHS: 3.83e-51, tailBernsteinForm: 1.36e-52, etaTermLog10: -674,
      cGalerkin: ['8.20453687159e-4', '8.20453697160e-4'], cLower: '8.20453687159e-4',
    },
    T400N320full: {
      floor: 'M_2', mT: '0.80677657222470000271', PhiRealUpper: 9.531213260, quadConst: 1.919e-21, rMax: 1.226e-18, EnormMax: 1.312e-16,
      muEven: { sLower: '-0.805872224981097', rayleighUpper: '-0.805872224971095', double: -0.8058722249710961 },
      muOdd: { sLower: '-0.777026771195484', rayleighUpper: '-0.777026761195481', double: -0.7770267611954833 },
      pivotMinLower: 0.04171, tailHS: 3.30e-11, tailBernsteinForm: 3.15e-24, etaTermLog10: -938,
      cGalerkin: ['9.04347243603e-4', '9.04347253605e-4'], cLower: '9.04347177660e-4',
    },
    T200N160one: {
      floor: 'sqrt2 ln2 (single-cosine symbol w_1; valid for 2a < 2 ln2)', mT: '2.4801811149989199838', PhiRealUpper: 8.840838524, quadConst: 3.587e-22, rMax: 1.144e-19, EnormMax: 6.141e-18,
      muEven: { sLower: '-2.47926214145791', rayleighUpper: '-2.47926214144790', double: -2.4792621414479092 },
      muOdd: { sLower: '-2.44912337427882', rayleighUpper: '-2.44912336427882', double: -2.4491233642788184 },
      pivotMinLower: 0.04159, tailHS: 2.735e-6, tailBernsteinForm: 5.47e-11, etaTermLog10: -421,
      cGalerkin: ['9.18973541010e-4', '9.18973551011e-4'], cLower: '9.13504530692e-4',
    },
    T200N240one: {
      floor: 'sqrt2 ln2 (single-cosine symbol w_1; valid for 2a < 2 ln2)', mT: '2.4801811149989199838', PhiRealUpper: 8.840838524, quadConst: 3.587e-22, rMax: 1.718e-19, EnormMax: 1.380e-17,
      muEven: { sLower: '-2.47926214145792', rayleighUpper: '-2.47926214144790', double: -2.4792621414479115 },
      muOdd: { sLower: '-2.44912337427882', rayleighUpper: '-2.44912336427882', double: -2.4491233642788193 },
      pivotMinLower: 0.04159, tailHS: 3.831e-51, tailBernsteinForm: 1.36e-52, etaTermLog10: -674,
      cGalerkin: ['9.18973541008e-4', '9.18973551011e-4'], cLower: '9.18973541008e-4',
    },
  }),
  /** double rebuilds: tmp/tlb-1-double-repro.py (scipy) and referee tmp/tlb-1-ref1-double.py (GL q=40, 0.25-panels) */
  doubleRepro: {
    T200N160: 8.204536971555265e-4, T200N160_aMinus1e6: 8.204659960145549e-4, T400N320: 9.043472536029995e-4, T200N160one: 9.189735509980146e-4,
    refereeT200N240: 8.2045369716088e-4, refereeT200N160: 8.2045369716224e-4,
    containmentTolerance: 1e-14,
    bakedModule: { exactLn3Half: 8.204537e-4, aMinus1e6: 8.204659960e-4, T400: 9.043473e-4 },
  },
  imp96544mT200: [0.11362861040986, 0.11362861041111],
  normalisationCheck: {
    h: '(a0^2 - x^2)^6 (1 + beta x^2), beta = -49.50720179528036 (pole-free)',
    W: { tSideFull: 5.4745198791813455e-8, tSideSingle: 5.474519879181349e-8, zeroSide138: 5.4745198791813673e-8, galerkinArbMid: 5.474519879180776e-8 },
    P2: { tSide: 3.883173479775613e-9, xSide: 3.883173479775199e-9 },
    normSq: 1.162250449136667e-7,
  },
  ritzUpperBounds: [9.78e-4, 9.60e-4, 9.49e-4], // referee tmp/tlb-1-ref0-ritz-upper.py, true w_1, t in [0, 3000-6000]
  sigma2Corollary: {
    statement: 'lambda_1(T_a[sigma_2]) >= c_lower (1/4 + (pi/2a)^2)^2 for phi in H^2_0(-a,a), 2a <= ln 3',
    poincareFactorAtA0: 71.01967385320022, lowerBound: 0.058268,
    check: { qPhiEqualsWh_relDiff: 2.72e-14, ritzN20: 0.6253969462487796, imp96749N20: 0.625397, ritzHoverPhiSq: 613.3978 },
    cSharpCohortPriorRigorousFloor: -3065.435, cSharpCohortMeasuredUpper: 0.581059,
  },
  refereeCorrections: [
    'Gauss-Legendre exponent rho^{-2Q} -> rho^{-2(Q-1)} (Q-node rule); quadConst/rMax/EnormMax x9.737; all runs re-executed with the fix.',
    'T400N320full cLower rebaked 9.04347177661e-4 -> 9.04347177660e-4 (corrected Arb lower endpoint 9.04347177660896e-4).',
    'Error-budget assertion thresholds relaxed from 1e-16 to 1e-15 (T400: ||E|| = 1.31e-16); margin is ~8e-4.',
    'sLower/rayleighUpper strings rebaked with outward rounding from the corrected sCertified/rayleighUpper balls.',
    '"double value inside the Arb ball" restated as agreement within 3e-15 (roundoff), not strict inclusion.',
    'Reach statement scoped to the repo; novelty vs Yoshida/Bombieri/Connes-Consani small-support results not checked.',
  ],
  label: 'PROVED (computer-assisted, Arb, internal referee passes; pending external referee) for 2a <= ln 3; implies nothing about Lambda, zero locations or RH; NO QED for RH',
});

const C = TLB_ARB_LEGE;
const num = (s) => Number(s);
const within = (x, [lo, hi], tol = 0) => x >= num(lo) - tol && x <= num(hi) + tol;

export const TLB_ARB_LEGE_ASSERTIONS = Object.freeze([
  {
    id: 'arb-lege-c-lower-positive',
    description: 'every baked c_lower (Arb lower endpoint, corrected constant) is strictly positive; M_2-floor constants 8.2045e-4 (T=200) and 9.0434e-4 (T=400)',
    holds: () => Object.values(C.runs).every((r) => num(r.cLower) > 0)
      && num(C.runs.T200N240full.cLower) > 8.2045e-4 && num(C.runs.T400N320full.cLower) > 9.0434e-4
      && C.runs.T400N320full.cLower === '9.04347177660e-4',
  },
  {
    id: 'arb-lege-c-lower-assembly-live',
    description: 'live: m_T + min(sLower) - 2*tail from the outward-rounded baked parts (sLower already includes -||E||; tail rounded up) is itself positive and within 1e-9 below the baked c_lower',
    holds: () => Object.values(C.runs).every((r) => {
      const s = Math.min(num(r.muEven.sLower), num(r.muOdd.sLower));
      const recomputed = num(r.mT) + s - 2 * r.tailHS;
      return recomputed > 0 && recomputed <= num(r.cLower) + 2e-14 && num(r.cLower) - recomputed < 1e-9;
    }),
  },
  {
    id: 'arb-lege-double-agrees-with-ball',
    description: 'independent double rebuilds agree with the Arb Galerkin enclosure within the 1e-14 roundoff tolerance (not strict inclusion)',
    holds: () => {
      const d = C.doubleRepro; const tol = d.containmentTolerance;
      return within(d.T200N160, C.runs.T200N160full.cGalerkin, tol) && within(d.T400N320, C.runs.T400N320full.cGalerkin, tol)
        && within(d.T200N160one, C.runs.T200N160one.cGalerkin, tol)
        && within(d.refereeT200N240, C.runs.T200N240full.cGalerkin, tol) && within(d.refereeT200N160, C.runs.T200N160full.cGalerkin, tol)
        && Math.abs(d.T200N160 - d.bakedModule.exactLn3Half) < 1e-10 && Math.abs(d.T200N160_aMinus1e6 - d.bakedModule.aMinus1e6) < 1e-12;
    },
  },
  {
    id: 'arb-lege-sectors-consistent',
    description: 'per sector: sLower < double lambda_min <= Rayleigh upper (+1e-13 roundoff), lambda_min < 0, c_Galerkin lower = m_T + min sLower',
    holds: () => Object.values(C.runs).every((r) => {
      const ok = [r.muEven, r.muOdd].every((m) => num(m.sLower) < m.double && m.double <= num(m.rayleighUpper) + 1e-13 && num(m.rayleighUpper) < 0);
      const mu = Math.min(num(r.muEven.sLower), num(r.muOdd.sLower));
      return ok && Math.abs(num(r.mT) + mu - num(r.cGalerkin[0])) < 2e-14;
    }),
  },
  {
    id: 'arb-lege-error-budget',
    description: 'corrected d*r_max, ||E||, tail and truncation term each far below the ~8e-4 margin (thresholds 1e-15 after the referee fix)',
    holds: () => Object.values(C.runs).every((r) => 160 * r.rMax < 1e-15 && r.EnormMax < 1e-15 && 2 * r.tailHS < 1e-5 && r.etaTermLog10 < -400 && r.pivotMinLower > 0)
      && Math.abs(C.runs.T200N240full.quadConst / 9.904e-23 - C.quadrature.rho ** 2) < 0.01,
  },
  {
    id: 'arb-lege-quadrature-exponent-live',
    description: 'live: the Q-node Gauss bound with rho^{-2(Q-1)} is rho^2 larger than the draft rho^{-2Q} form (the fix), and 64/15 rho^{-46}/(rho^2-1) < 1e-22',
    holds: () => {
      const rho = C.quadrature.rho, Q = C.quadrature.nodes;
      const fixed = (64 / 15) * rho ** (-2 * (Q - 1)) / (rho ** 2 - 1), draft = (64 / 15) * rho ** (-2 * Q) / (rho ** 2 - 1);
      const b = 0.35, amaj = Math.sqrt(0.25 * 0.25 + b * b); // panel half-width 0.25
      return Math.abs(fixed / draft - rho ** 2) < 1e-9 && fixed < 1e-22 && Math.abs((amaj + b) / 0.25 - rho) < 1e-9;
    },
  },
  {
    id: 'arb-lege-floor-matches-interval-legs',
    description: 'Arb m_200 inside the imp-96544 mpmath.iv enclosure; double floorBeyond(200/400) agrees with Arb m_T to 1e-13; M2MAX matches',
    holds: () => within(num(C.runs.T200N160full.mT), C.imp96544mT200)
      && Math.abs(floorBeyond(200) - num(C.runs.T200N160full.mT)) < 1e-13
      && Math.abs(floorBeyond(400) - num(C.runs.T400N320full.mT)) < 1e-13
      && Math.abs(M2MAX - 3.3468106480569850) < 1e-13,
  },
  {
    id: 'arb-lege-normalisation-two-way',
    description: 'W(h) for one explicit pole-free h agrees between t-side quadrature, the zero sum, and the Arb Galerkin form to < 1e-10 relative; P_2 x vs t agree',
    holds: () => {
      const W = C.normalisationCheck.W; const ref = W.tSideFull;
      const rel = (x) => Math.abs(x - ref) / ref;
      return rel(W.zeroSide138) < 1e-10 && rel(W.galerkinArbMid) < 1e-10 && rel(W.tSideSingle) < 1e-10
        && Math.abs(C.normalisationCheck.P2.tSide - C.normalisationCheck.P2.xSide) / C.normalisationCheck.P2.xSide < 1e-10
        && W.tSideFull / C.normalisationCheck.normSq > num(C.runs.T200N240full.cLower);
    },
  },
  {
    id: 'arb-lege-ritz-upper-consistent',
    description: 'independent Rayleigh-Ritz upper bounds lie above the certified lower bound and within 10% of it',
    holds: () => C.ritzUpperBounds.every((u) => u >= num(C.runs.T400N320full.cLower) && u < 1.1 * num(C.runs.T400N320full.cLower)),
  },
  {
    id: 'arb-lege-sigma2-corollary-arithmetic',
    description: 'live: lambda_1(T_a[sigma_2]) >= c_lower (1/4 + (pi/(2 a0))^2)^2 = 0.0583 < Ritz 0.6254; replaces the c-sharp cohort floor -3065',
    holds: () => {
      const a0 = Math.log(3) / 2; const f = (0.25 + (Math.PI / (2 * a0)) ** 2) ** 2;
      const S = C.sigma2Corollary;
      return Math.abs(f - S.poincareFactorAtA0) < 1e-9 && S.lowerBound <= num(C.runs.T200N240full.cLower) * f
        && S.lowerBound > 0.058 && S.lowerBound < S.check.ritzN20 && S.lowerBound < S.cSharpCohortMeasuredUpper
        && S.lowerBound > S.cSharpCohortPriorRigorousFloor
        && Math.abs(S.check.ritzN20 - S.check.imp96749N20) < 1e-6 && S.check.ritzHoverPhiSq >= f;
    },
  },
  {
    id: 'arb-lege-honesty',
    description: 'status/verdict/label: computer-assisted, pending external referee, NO QED, no refereed bound is changed, nothing about Lambda',
    holds: () => /pending external referee/.test(C.label) && /NO QED/.test(C.label) && /nothing about Lambda/.test(C.label)
      && /refereed bound is changed/i.test(C.verdict) && /NO QED/.test(C.verdict) && /NO QED/.test(C.status)
      && /No new Lambda bound/.test(C.verdict) && /not checked/.test(C.verdict),
  },
]);

// self-executing: literal comparisons plus cheap live arithmetic (deterministic in any JS engine)
for (const a of TLB_ARB_LEGE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`TLB ARB-LEGE assertion failed: ${a.id}`);
}

export default TLB_ARB_LEGE;
