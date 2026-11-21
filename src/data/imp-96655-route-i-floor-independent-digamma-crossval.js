/**
 * imp-96655 — INDEPENDENT interval-digamma cross-validation of the imp-96544
 * leg-(B) floor constant m_400.
 *
 * imp-96544 enclosed leg (B) of the Route I D_S <= L_S certificate (the floor
 * constant m_T = 2 theta'(T) - M_2, with 2 theta'(t) = Re psi(1/4 + i t/2) - ln pi)
 * WITHOUT a direct interval digamma: it summed the positive real-part-decomposition
 * series Re psi(s+iy) = psi(s) + sum y^2/((n+s)((n+s)^2+y^2)) to 2e5 terms and closed
 * the tail with an integral test, giving m_400 in [0.80677657222220, 0.80677657222720]
 * (width ~5e-12). This module re-encloses the SAME m_400 through a genuinely
 * INDEPENDENT rigorous code path and confirms the two agree.
 *
 * INDEPENDENT METHOD (tmp/imp-96655-independent-digamma.py, mpmath.iv, prec = 220):
 * a recurrence-shift + Stirling(asymptotic) interval digamma -- no term-by-term
 * real-part series, no integral-test tail.
 *   psi(z) = psi(z+K) - sum_{k=0}^{K-1} 1/(z+k),   z = 1/4 + i*200,  K = 400
 *            (the correction is a finite EXACT interval-complex sum),
 *   psi(w) = ln w - 1/(2w) - sum_{n=1}^{6} B_2n/(2n w^{2n}) + R,   w = 400.25 + 200 i,
 *            |R| <= |B_14/(14 w^14)| (x100 safety) valid because the shift puts
 *            |arg w| = 0.4634 < pi/4, the DLMF 5.11 sector where the digamma
 *            asymptotic remainder is bounded by the first neglected term.
 * The Bernoulli numbers B_2n and M_2 = ln2 (sqrt2-1)/(3/2-sqrt2) are carried as
 * EXACT rationals, so no series-truncation or machine-rounding slack enters.
 *
 * RESULT. m_400 (INDEPENDENT) in [0.80677657222470000271, 0.80677657222470000272]
 * (width ~1.3e-36), STRICTLY POSITIVE, and CONTAINED INSIDE the imp-96544 series+tail
 * enclosure [0.80677657222220, 0.80677657222720] -- the two independent code paths
 * agree. Because this path uses the EXACT rational M_2, its center 0.8067765722247000027
 * sits ~4.22e-15 ABOVE the baked IEEE double floorBeyond(400) = 0.80677657222469578713;
 * that offset matches the M_2 machine-rounding M2MAX - trueM2 ~ 4.44e-15 that imp-96544
 * already flagged (the IEEE double M_2 lies ~4.5e-15 outside its width-7e-59 enclosure),
 * independently reconfirming that observation too.
 *
 * SCOPE. Accuracy cross-check of leg (B) ONLY. Leg (E) (the verified constrained
 * Galerkin smallest eigenvalue) remains the sole open leg -- unchanged and untouched
 * here. Nothing localises a zero, moves a Lambda bound, or changes a verified height;
 * fixed-window positivity implies nothing about RH; RH open; no refereed bound is changed; NO QED.
 */

import { floorBeyond, M2MAX } from './rh-route-i-uncertainty-concentration-certificate-2026-09-24.js';

/** rigorous mpmath.iv enclosure baked from tmp/imp-96655-independent-digamma.py (prec = 220) */
export const IMP96655_INDEPENDENT_DIGAMMA_CROSSVAL = Object.freeze({
  method: 'recurrence-shift psi(z)=psi(z+K)-sum_{k<K}1/(z+k) with K=400 (exact interval-complex correction) + Stirling asymptotic psi(w)=ln w-1/(2w)-sum_{n<=6} B_2n/(2n w^{2n})+R, remainder |R|<=|B_14/(14 w^14)| (x100 safety) valid in the sector |arg w|=0.4634<pi/4; Bernoulli numbers and M_2 carried as EXACT rationals; mpmath.iv prec 220',
  z: '1/4 + i*200 (T = 400, y = t/2 = 200)',
  shiftK: 400,
  argWShifted: 0.4633977339435379, // < pi/4 = 0.7853981633974483, DLMF 5.11 sector bound applies
  asymptoticTerms: 6,
  remainderMagBoundX100: 6.465e-37,
  // INDEPENDENT enclosure of m_400 = 2 theta'(400) - M_2, EXACT-rational M_2
  m400Independent: [0.80677657222470000271, 0.80677657222470000272],
  m400IndependentWidth: 1.3e-36,
  RepsiIndependent: [5.298317106131085179, 5.298317106131085180], // Re psi(1/4 + 200 i)
  strictlyPositive: true,
  crossCheck: {
    imp96544Enclosure: [0.80677657222220, 0.80677657222720], // series + integral-test tail, width ~5e-12
    containedInImp96544: true, // the independent tight enclosure sits inside the imp-96544 enclosure -> agreement
    bakedDoubleFloorBeyond400: 0.80677657222469578713, // uses the IEEE double M2MAX
    offsetIndependentAboveBakedDouble: 4.2188e-15, // = independent-lo - floorBeyond(400)
    m2RoundingMagnitude: 4.4409e-15, // = M2MAX - trueM2hi (imp-96544 flagged the double M_2 lies ~4.5e-15 outside)
    note: 'the ~4.2e-15 offset of the exact-M_2 independent center above the baked double matches the M_2 machine-rounding (~4.4e-15), so the two independent legs agree AND the imp-96544 M_2-rounding observation is reconfirmed',
  },
  scope: 'leg (B) only; leg (E) (verified constrained Galerkin smallest eigenvalue) remains the sole open leg, unchanged; NO QED',
});

/**
 * imp-96678 -- THIRD independent digamma path for the SAME m_400, retiring the
 * x100 safety inflation that imp-96655 put on the DLMF 5.11 sector remainder.
 * Path = mpmath NATIVE mp.digamma (a distinct algorithm from both the imp-96544
 * real-part series+tail and the imp-96655 hand-coded recurrence-shift+Stirling):
 * mpmath applies its own internal reflection/recurrence/asymptotic machinery with
 * guard-digit error control, so no hand-inflated remainder enters. Evaluated at
 * dps 40/60/90/130 (spread 1.3e-60) and the native routine is INDEPENDENTLY
 * validated on this exact argument z = 1/4 + 200 i by two algebraic identities:
 *   reflection    psi(1-z) - psi(z) = pi cot(pi z)     (residual 2.58e-136)
 *   duplication   psi(z) + psi(z+1/2) = 2 psi(2z) - 2 ln 2   (residual 0)
 * Result m_400 = 0.8067765722247000027131437188791001, strictly positive,
 * CONTAINED in the imp-96544 enclosure [0.80677657222220, 0.80677657222720] and
 * inside the imp-96655 displayed interval [0.80677657222470000271, ...0272],
 * agreeing with the imp-96655 center to 1.86e-21. The exact-M_2 native center sits
 * 4.2156e-15 above the baked IEEE double floorBeyond(400), again matching the M_2
 * machine-rounding ~4.44e-15. Script tmp/imp-96678-third-path-digamma.py, mpmath
 * 1.4.1. NOTE: mpmath.iv still lacks a native interval digamma and Arb/python-flint
 * is not installed, so this is the non-interval native routine validated by the two
 * identities rather than a black-box iv.psi enclosure; leg (E) untouched; NO QED.
 */
export const IMP96678_THIRD_PATH_DIGAMMA_CROSSVAL = Object.freeze({
  method: 'mpmath NATIVE mp.digamma (distinct algorithm; internal reflection/recurrence/asymptotic with guard-digit error control, NO x100 hand-inflation), dps sweep 40/60/90/130; native routine independently validated on z=1/4+200 i via reflection psi(1-z)-psi(z)=pi cot(pi z) and duplication psi(z)+psi(z+1/2)=2 psi(2z)-2 ln 2',
  m400ThirdPath: 0.8067765722247000027131437188791001,
  precisionSpread: 1.306e-60, // max abs diff among dps 60/90/130 evaluations
  strictlyPositive: true,
  containedInImp96544: true, // inside [0.80677657222220, 0.80677657222720]
  insideImp96655Interval: true, // native center lies inside the imp-96655 displayed [...0271, ...0272]
  agreementWithImp96655Center: 1.856e-21, // |third-path center - imp-96655 interval center|
  offsetAboveBakedDouble: 4.21558e-15, // = third-path center - floorBeyond(400); matches M_2 rounding ~4.44e-15
  reflectionIdentityResidual: 2.58e-136,
  duplicationIdentityResidual: 0,
  x100InflationRetired: true, // this path does not use the DLMF 5.11 hand-coded remainder at all
  note: 'THIRD independent path confirms m_400 WITHOUT the imp-96655 x100 sector-remainder inflation; mpmath.iv still lacks a native interval digamma / Arb unavailable, so the native mp.digamma point value is validated by the reflection and duplication identities rather than an iv.psi enclosure; leg (E) untouched; NO QED',
  scope: 'accuracy cross-check of leg (B) only; leg (E) remains the sole open leg, unchanged; NO QED',
});

export const IMP96655_ROUTE_I_FLOOR_INDEPENDENT_DIGAMMA_CROSSVAL = Object.freeze({
  id: 'imp-96655-route-i-floor-independent-digamma-crossval',
  parents: ['src/data/imp-96544-route-i-ds-le-ls-interval-port-triage.js'],
  status: 'CROSS-VALIDATED (accuracy check): the imp-96544 leg-(B) floor constant m_400 is re-enclosed through an INDEPENDENT rigorous interval-digamma path -- a recurrence-shift (K=400, exact interval-complex correction) + Stirling asymptotic (sector |arg w|<pi/4, remainder bounded by the first neglected term), with the Bernoulli numbers and M_2 carried as EXACT rationals. It gives m_400 in [0.80677657222470000271, 0.80677657222470000272] (width ~1.3e-36), STRICTLY POSITIVE and CONTAINED INSIDE the imp-96544 series+tail enclosure [0.80677657222220, 0.80677657222720], so the two independent code paths agree. The exact-M_2 center sits ~4.22e-15 above the baked IEEE double floorBeyond(400)=0.80677657222469578713, matching the M_2 machine-rounding ~4.44e-15 that imp-96544 flagged (reconfirmed). Accuracy cross-check of leg (B) only; leg (E) remains the sole open leg; fixed-window positivity implies nothing about RH; RH open; no refereed bound is changed; NO QED',
  honestLimits: 'this is an accuracy cross-check of ONE already-ported leg (B), not new coverage -- it neither closes leg (E) nor tightens the certificate margin. The sector remainder bound uses the standard DLMF 5.11 result that the digamma asymptotic remainder is bounded by the first neglected term for |arg w|<=pi/4 (arg w=0.4634 here), with an extra x100 safety factor -- imp-96678 (IMP96678_THIRD_PATH_DIGAMMA_CROSSVAL) later retires reliance on that x100 inflation by re-enclosing the same m_400 through mpmath native mp.digamma (a distinct algorithm), agreeing to ~2e-21 and self-validated on this argument by the reflection and duplication identities. mpmath.iv lacks a native digamma and python-flint/Arb is not installed in the venv, so both the imp-96655 recurrence-shift+asymptotic construction and the imp-96678 native mp.digamma point value stand in for a black-box iv.psi enclosure. Nothing localises a zero or changes any Lambda bound or verified height; RH open; NO QED',
});

export default IMP96655_ROUTE_I_FLOOR_INDEPENDENT_DIGAMMA_CROSSVAL;

// ---- assertions (all fast, no digamma recompute; live-compare the baked interval to the module doubles)
const CV = IMP96655_INDEPENDENT_DIGAMMA_CROSSVAL;
export const IMP96655_ROUTE_I_FLOOR_INDEPENDENT_DIGAMMA_CROSSVAL_ASSERTIONS = Object.freeze([
  {
    id: 'imp96655-independent-enclosure-agrees',
    description: 'the INDEPENDENT recurrence-shift+asymptotic enclosure of m_400 is strictly positive, non-degenerate, and contained inside the imp-96544 series+tail enclosure [0.80677657222220, 0.80677657222720] -- the two independent code paths agree',
    holds: () => {
      const [lo, hi] = CV.m400Independent;
      const [ilo, ihi] = CV.crossCheck.imp96544Enclosure;
      return lo > 0 && hi >= lo && lo >= ilo && hi <= ihi && CV.strictlyPositive === true
        && CV.argWShifted < Math.PI / 4;
    },
  },
  {
    id: 'imp96655-m2-rounding-reconfirmed',
    description: 'the exact-M_2 independent center sits ABOVE the baked IEEE double floorBeyond(400) by ~4.2e-15, matching the M_2 machine-rounding M2MAX - trueM2 ~4.4e-15 that imp-96544 flagged (the double M_2 lies ~4.5e-15 outside its width-7e-59 enclosure)',
    holds: () => {
      const trueM2hi = 3.3468106480569851; // imp-96544 M_2 enclosure upper endpoint
      const offset = CV.m400Independent[0] - floorBeyond(400);
      const m2round = M2MAX - trueM2hi;
      return offset > 3e-15 && offset < 6e-15
        && Math.abs(offset - CV.crossCheck.offsetIndependentAboveBakedDouble) < 1e-16
        && m2round > 4e-15 && m2round < 5e-15
        && Math.abs(m2round - CV.crossCheck.m2RoundingMagnitude) < 1e-16
        && floorBeyond(400) < CV.m400Independent[0]
        && Math.abs(offset - m2round) < 1e-15;
    },
  },
  {
    id: 'imp96678-third-path-agrees-without-x100',
    description: 'the imp-96678 THIRD path (native mp.digamma, no x100 sector-remainder inflation) re-encloses m_400 strictly positive, inside the imp-96544 series+tail enclosure, agreeing with the imp-96655 center to ~2e-21, with the exact-M_2 native center ~4.2e-15 above the baked double (matching the M_2 rounding); the native routine is self-validated on z=1/4+200 i by the reflection and duplication identities',
    holds: () => {
      const T = IMP96678_THIRD_PATH_DIGAMMA_CROSSVAL;
      const [ilo, ihi] = CV.crossCheck.imp96544Enclosure;
      const offset = T.m400ThirdPath - floorBeyond(400);
      return T.m400ThirdPath > 0 && T.m400ThirdPath >= ilo && T.m400ThirdPath <= ihi
        && T.strictlyPositive === true && T.x100InflationRetired === true
        && T.agreementWithImp96655Center < 1e-18
        && Math.abs(offset - T.offsetAboveBakedDouble) < 1e-16
        && offset > 3e-15 && offset < 6e-15
        && T.reflectionIdentityResidual < 1e-100 && T.duplicationIdentityResidual === 0;
    },
  },
  {
    id: 'imp96655-verdict-honesty',
    description: 'status records NO QED / RH open, scopes the check to leg (B) only, and honestLimits notes leg (E) is untouched and nothing localises a zero',
    holds: () => {
      const M = IMP96655_ROUTE_I_FLOOR_INDEPENDENT_DIGAMMA_CROSSVAL;
      return /NO QED/.test(M.status) && /RH open/.test(M.status)
        && /leg \(E\)/.test(M.status) && /CONTAINED INSIDE/.test(M.status)
        && /accuracy cross-check of ONE already-ported leg/.test(M.honestLimits)
        && /[Nn]othing localises a zero/.test(M.honestLimits)
        && CV.crossCheck.containedInImp96544 === true;
    },
  },
]);
