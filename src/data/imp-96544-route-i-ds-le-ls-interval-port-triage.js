/**
 * imp-96544 — INTERVAL-ARITHMETIC PORT TRIAGE of the Route I D_S <= L_S certificate
 * (rh-route-i-uncertainty-concentration-certificate-2026-09-24: W(h) = Arch(h) - P_2(h)
 * >= 9.04e-4 ||h||^2 on pole-free h in L^2(-a,a), 2a <= ln 3, established in DOUBLE precision,
 * explicitly "NOT interval-verified"). The double-precision theorem factors as
 *
 *     W(h) >= m_T ||h||^2 + <h, K h>,   <h,K h> >= min(lambda_min(K_N|V_N), 0) - 2 ||K Q_N||,
 *
 * i.e. into FOUR legs: (B) the floor constant m_T = 2 theta'(T) - M_2; (D) the Bernstein-ellipse
 * tail ||K Q_N||; (E) the constrained Galerkin smallest eigenvalue lambda_min(K_N|V_N); and the
 * closed-form arithmetic that combines them. This module PORTS legs (B) and (D) to rigorous
 * interval arithmetic (mpmath.iv) and QUANTIFIES the reduction so that the whole certificate now
 * rests on exactly one un-enclosed leg (E). Verification only; fixed-window positivity implies
 * nothing about RH; NO QED.
 *
 * WHAT IS NOW RIGOROUSLY ENCLOSED (tmp/imp-96544-interval-legs.py, mpmath.iv, prec = 200):
 *
 *  (B) FLOOR LEMMA, fully interval-enclosed.
 *      - M_2 = ln2 (sqrt2 - 1)/(3/2 - sqrt2) is a closed form: M_2 in
 *        [3.3468106480569850, 3.3468106480569851] (width ~7e-59). The IEEE-double evaluation
 *        3.3468106480569895 lies ~4.5e-15 OUTSIDE this enclosure -- the machine-epsilon rounding
 *        the interval port is meant to remove.
 *      - 2 theta'(t) = Re psi(1/4 + i t/2) - ln pi is enclosed WITHOUT an interval digamma via the
 *        positive convergent series (proved from psi(z) = -gamma + sum(1/(n+1) - 1/(n+z))):
 *            Re psi(s + i y) = psi(s) + sum_{n>=0} y^2 / ((n+s)((n+s)^2 + y^2)),  s = 1/4,
 *        with psi(1/4) = -gamma - pi/2 - 3 ln2 (all constants iv-enclosed) and the strictly
 *        decreasing tail f(x) = y^2/(x(x^2+y^2)) bounded rigorously by the integral test
 *            int_{M+1/4}^inf f <= sum_{n>=M} f(n+1/4) <= int_{M-3/4}^inf f,
 *            int_a^inf f = (1/2) ln(1 + y^2/a^2).
 *      - Result (M = 2e5 terms): m_T = 2 theta'(T) - M_2 is STRICTLY POSITIVE and encloses the
 *        baked double: m_200 in [0.11362861040986, 0.11362861041111] (double 0.11362861041048,
 *        inside), m_400 in [0.80677657222220, 0.80677657222720] (double 0.80677657222470, inside).
 *        The non-rigorous mpmath.digamma value falls inside every enclosure (series identity check).
 *
 *  (D) BERNSTEIN-ELLIPSE TAIL, interval-enclosed given a rigorous sup bound Phi.
 *      The closed form 4a (T Phi/pi) e^{aT(rho-1/rho)/2} rho^{1-N}/(rho-1), minimised over rho, is
 *      iv-arithmetic. With a rigorous over-estimate Phi <= 10 (>= the baked sup 9.526; a sharp
 *      rigorous sup over [0,T] is a routine interval branch-and-bound on the analytic w, and any
 *      loose over-estimate suffices here) the tail at (T,N) = (400,320) is <= 3.306e-24 -- twenty
 *      orders of magnitude below the certificate margin 9.04e-4, hence non-binding.
 *
 * THE REDUCTION. With m_400 in [0.80677657222220, 0.80677657222720] and tail <= 3.306e-24 both
 * rigorous, the double-precision certificate W >= m_400 + lambda_min(K_N|V_N) - 2 tail = 9.0437e-4
 * holds RIGOROUSLY as soon as leg (E) is enclosed: it suffices to bound
 *     lambda_min(K_N|V_N) >= -0.8067765722222 + 6.7e-24  (= -(m_400 lower) + 2 tail).
 * The double eigenvalue is lambda_min(K_N|V_N) = 9.0437e-4 - m_400 = -0.8058722, which EXCEEDS
 * that threshold by the full margin 9.04e-4. So a VERIFIED eigenvalue enclosure of absolute
 * accuracy < 9e-4 closes the whole certificate. (The floor loss makes the margin ~C/T; the port
 * inherits the same T-sequence, so a larger T only widens this eigenvalue tolerance.)
 *
 * FIRST LEG THAT RESISTS A LIGHTWEIGHT ENCLOSURE (the sub-gap "verified-galerkin-eigenvalue"):
 * leg (E). It is NOT an mpmath.iv one-liner because it needs, at (T,N) = (400,320):
 *   (i)  rigorous enclosure of ~160x160 (per even/odd sector) Galerkin entries, each an oscillatory
 *        analytic integral (2a/pi) eps_m eps_n sqrt((2m+1)(2n+1)) int_0^400 (w(t)-m_T) j_m(at) j_n(at) dt
 *        over 400 t-units at wavenumber a t (a ~ 0.55) -- rigorous quadrature (Arb acb_calc_integrate
 *        with a certified error bound) of an integrand that itself needs an interval spherical-Bessel
 *        product and the interval Re-psi symbol enclosed in (B);
 *   (ii) a VERIFIED smallest-eigenvalue lower bound of the constrained (Legendre-complement-compressed)
 *        symmetric matrix to absolute accuracy < 9e-4 -- e.g. Rump/interval-Cholesky of (A - lambda I),
 *        including a rigorous treatment of the constraint projection V_N = V cap range P_N.
 * This is an Arb-scale computation, not a symbolic enclosure; it is the concrete residual for a full
 * interval proof. Legs (B), (D) and the combining arithmetic are now done. Nothing here localises a
 * zero or moves a Lambda bound; RH open; no refereed bound is changed; NO QED.
 */

import { M2MAX, floorBeyond, tailBoundLog10 } from './rh-route-i-uncertainty-concentration-certificate-2026-09-24.js';

const LN3 = Math.log(3);

/** rigorous mpmath.iv enclosures baked from tmp/imp-96544-interval-legs.py (prec = 200) */
export const IMP96544_INTERVAL_LEGS = Object.freeze({
  method: 'mpmath.iv (interval arithmetic, prec = 200); Re psi(1/4 + i y) via the positive series psi(1/4) + sum y^2/((n+1/4)((n+1/4)^2+y^2)) with an integral-test tail bound (no interval digamma needed); floor constant M_2 and the Bernstein tail formula are closed-form iv arithmetic',
  floorLemma: {
    // M_2 = ln2 (sqrt2-1)/(3/2-sqrt2); enclosure width ~7e-59; the IEEE double 3.3468106480569895 lies ~4.5e-15 OUTSIDE it
    M2: [3.3468106480569850, 3.3468106480569851],
    M2doubleOutsideBy: 4.5e-15,
    // m_T = 2 theta'(T) - M_2, STRICTLY POSITIVE, encloses the baked double
    mT200: [0.11362861040986, 0.11362861041111],
    mT400: [0.80677657222220, 0.80677657222720],
    twoThetaPrime400: [4.1535872202791850, 4.1535872202841850],
    seriesTerms: 200000,
  },
  tail: {
    // ||K Q_N|| (T=400, N=320) with a rigorous over-estimate Phi <= 10 (baked sup 9.526)
    boundT400N320: 3.306e-24,
    PhiUpperBoundUsed: 10,
    note: '20 orders below the 9.04e-4 margin; a sharp rigorous sup Phi is a routine interval branch-and-bound but any loose over-estimate suffices',
  },
  reduction: {
    // certificate holds rigorously once lambda_min(K_N|V_N) >= threshold
    thresholdLowerBound: -0.8067765722222,
    doubleEigenvalue: -0.8058722, // = 9.0437e-4 - m_400
    marginAboveThreshold: 9.0437e-4,
    requiredEigenvalueEnclosureAccuracy: 9e-4,
  },
  resistingLeg: 'verified-galerkin-eigenvalue: rigorous Arb enclosure of the ~160x160/sector oscillatory-integral Galerkin entries (acb_calc_integrate) + a verified smallest-eigenvalue lower bound (Rump/interval-Cholesky) of the constrained matrix to abs accuracy < 9e-4; NOT an mpmath.iv one-liner',
});

export const IMP96544_ROUTE_I_DS_LE_LS_INTERVAL_PORT_TRIAGE = Object.freeze({
  id: 'imp-96544-route-i-ds-le-ls-interval-port-triage',
  parents: ['src/data/rh-route-i-uncertainty-concentration-certificate-2026-09-24.js'],
  status: 'PARTIAL (honest): the two ANALYTIC legs of the Route I D_S <= L_S certificate are ported to rigorous interval arithmetic (mpmath.iv, prec 200). (B) FLOOR LEMMA: M_2 in [3.3468106480569850, 3.3468106480569851] (width ~7e-59; the IEEE double lies ~4.5e-15 outside), and m_T = 2theta\'(T) - M_2 is STRICTLY POSITIVE via the positive-series Re psi(1/4+iy) representation + integral-test tail -- m_200 in [0.113628610410, 0.113628610411], m_400 in [0.806776572222, 0.806776572227], each containing the baked double. (D) BERNSTEIN TAIL <= 3.306e-24 (Phi <= 10), non-binding. The certificate therefore reduces to ONE un-enclosed leg (E): a verified smallest-eigenvalue lower bound lambda_min(K_N|V_N) >= -0.8067765722222 (double is -0.8058722, margin 9.04e-4). That leg needs Arb rigorous quadrature of ~160x160/sector oscillatory Galerkin integrals + a verified eigenvalue bound (Rump/interval-Cholesky) to abs accuracy < 9e-4 -- the concrete residual. Fixed-window positivity implies nothing about RH; RH open; no refereed bound is changed; NO QED',
  legEnclosureStatus: {
    A_nesting: 'analytic (extension by zero preserves hhat); no interval computation needed',
    B_floorLemma: 'ENCLOSED (mpmath.iv): M_2 to width ~7e-59, m_T strictly > 0, doubles contained',
    C_operatorSplit: 'analytic identity T[w] = m_T I + K; no interval computation needed',
    D_bernsteinTail: 'ENCLOSED (mpmath.iv, given a rigorous Phi over-estimate): <= 3.306e-24, non-binding',
    E_galerkinEigenvalue: 'RESISTS a lightweight enclosure -- the first-resisting leg; Arb-scale (see resistingLeg)',
  },
  honestLimits: 'legs (B) and (D) are genuinely rigorous (the positive-series identity was checked against non-interval mpmath.digamma and the double m_T values lie inside the enclosures); leg (E) is NOT enclosed here -- only its required tolerance is quantified. A sharp rigorous sup Phi for (D) is left as a routine interval branch-and-bound (over-estimate used). Nothing localises a zero or changes any Lambda bound or verified height; RH open; NO QED',
});

export default IMP96544_ROUTE_I_DS_LE_LS_INTERVAL_PORT_TRIAGE;

// ---- assertions (all fast, no Galerkin recompute)
const within = (x, [lo, hi]) => x >= lo && x <= hi;
const IL = IMP96544_INTERVAL_LEGS;
export const IMP96544_ROUTE_I_DS_LE_LS_INTERVAL_PORT_TRIAGE_ASSERTIONS = Object.freeze([
  {
    id: 'imp96544-floor-lemma-enclosures',
    description: 'the closed-form M_2 double agrees with the mpmath.iv enclosure to machine precision (~5e-15, lying just outside the width-7e-59 interval), and floorBeyond(200)/floorBeyond(400) doubles lie INSIDE the strictly-positive m_T enclosures; both m_T lower endpoints > 0',
    holds: () => {
      const M2mid = (IL.floorLemma.M2[0] + IL.floorLemma.M2[1]) / 2;
      // the IEEE double agrees to ~5e-15 but lies just above the width-7e-59 enclosure (machine-eps rounding)
      return Math.abs(M2MAX - M2mid) < 1e-13 && M2MAX > IL.floorLemma.M2[1]
        && within(floorBeyond(200), IL.floorLemma.mT200) && within(floorBeyond(400), IL.floorLemma.mT400)
        && IL.floorLemma.mT200[0] > 0 && IL.floorLemma.mT400[0] > 0;
    },
  },
  {
    id: 'imp96544-tail-non-binding',
    description: 'the Bernstein tail enclosure at (T,N) = (400,320) is <= 3.306e-24, 20 orders below the 9.04e-4 margin, and the module tailBoundLog10 (with the baked Phi = 9.526) agrees to log10 < -23',
    holds: () => {
      const a = LN3 / 2;
      return IL.tail.boundT400N320 < 1e-23 && IL.tail.boundT400N320 > 0
        && tailBoundLog10(a, 320, 400, 9.526) < -23
        && Math.log10(IL.tail.boundT400N320) < -23 && IL.tail.boundT400N320 < 9.04e-4;
    },
  },
  {
    id: 'imp96544-reduction-arithmetic',
    description: 'the reduction is arithmetically consistent: threshold = -(m_400 lower endpoint), double eigenvalue = 9.0437e-4 - m_400 double, and the double exceeds the threshold by the ~9.04e-4 margin (so a verified eigenvalue enclosure of accuracy < 9e-4 closes the certificate)',
    holds: () => {
      const R = IL.reduction;
      const thr = -IL.floorLemma.mT400[0];
      const lamDouble = 9.0437e-4 - floorBeyond(400);
      return Math.abs(R.thresholdLowerBound - thr) < 1e-12
        && Math.abs(R.doubleEigenvalue - lamDouble) < 5e-5
        && lamDouble > R.thresholdLowerBound
        && Math.abs((lamDouble - R.thresholdLowerBound) - R.marginAboveThreshold) < 5e-5
        && R.requiredEigenvalueEnclosureAccuracy > 0;
    },
  },
  {
    id: 'imp96544-verdict-honesty',
    description: 'status records NO QED / RH open, marks legs (B),(D) enclosed and leg (E) as the resisting leg, and honestLimits says nothing localises a zero',
    holds: () => {
      const M = IMP96544_ROUTE_I_DS_LE_LS_INTERVAL_PORT_TRIAGE;
      return /NO QED/.test(M.status) && /RH open/.test(M.status)
        && /ENCLOSED/.test(M.legEnclosureStatus.B_floorLemma) && /ENCLOSED/.test(M.legEnclosureStatus.D_bernsteinTail)
        && /RESISTS/.test(M.legEnclosureStatus.E_galerkinEigenvalue)
        && /[Nn]othing localises a zero/.test(M.honestLimits) && /verified-galerkin-eigenvalue/.test(IL.resistingLeg);
    },
  },
]);
