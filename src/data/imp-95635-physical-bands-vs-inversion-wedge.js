/**
 * @module imp-95635-physical-bands-vs-inversion-wedge
 *
 * imp-95635 (numerical, frontier-direction): imp-95617-transition-knee-ordering-joint-2d (G1) found the
 * E_coll = E_trunc transition-before-knee ordering INVERTS in the low-C_C / high-E_trunc corner of an
 * ARBITRARY [0.5x, 1.5x] x [0.5x, 1.5x] multiplier box (min gap ~ -0.00468 at C_C 0.5x, E_trunc 1.5x),
 * while neither 1-D band inverts. But the +/-50% box is a modelling convenience, NOT a physical band. This
 * module derives the actual plausible physical uncertainty ranges on C_C and E_trunc from their provenance
 * and measures the distance from the pinned point to the gap = 0 inversion contour IN THOSE PHYSICAL UNITS.
 *
 * THE PHYSICAL BAND ON C_C = C_H * sqrt(C_KH) = (1/8) sqrt(3 pi) ~ 0.38375 (imp-399/imp-2714)
 * -----------------------------------------------------------------------------------------------
 *   C_C = C_H * sqrt(pi * C_Selberg). Two provenance-grounded levers, both NARROW and ASYMMETRIC:
 *   - C_H: the 1/8 is the EXACT leading-order quadratic-tangency coefficient (ansatz, imp-2642). The
 *     positive O(1) tangency remainder pushes the effective coefficient UP to ~0.127 (imp-2643), and the
 *     finite-N Gronwall C_Lip is > 1 (< 0.2% at N >= 2458, imp-399 openWork). Both move C_H UP, not down:
 *     C_H upper multiplier ~ 0.127 / 0.125 = 1.016.
 *   - C_Selberg = 3 is a CONSERVATIVE Koksma-Hlawka discrepancy estimate (imp-341). The 1-D Koksma-Hlawka
 *     star-discrepancy floor is C_Selberg ~ 1; a tighter sieve/level-statistics input could lower it toward
 *     1 (imp-399 openWork), but no smaller value is certified. Since C_C ~ sqrt(C_Selberg), the best-case
 *     DOWN multiplier is sqrt(1/3) ~ 0.5774. Nothing physical pushes C_Selberg above 3.
 *   => physical C_C multiplier band ~ [0.577, 1.016] (down-lever = a hypothetical tighter Selberg only).
 *
 * THE PHYSICAL BAND ON E_trunc = 3.06e-5 (imp-2631, PT + Ingham sigma = 3/4 at T_PT = 3e12)
 * -----------------------------------------------------------------------------------------------
 *   E_trunc = (2 e_I/kappa) T_PT^{-kappa} with the honest Ingham e_I = 0.6, kappa = 0.4, evaluated at the
 *   LARGEST unconditionally verified height T_PT = 3e12. Its genuine physical uncertainty is essentially
 *   ONE-SIDED DOWN:
 *   - Guth-Maynard 2024 sharpens the near-sigma=3/4 density exponent to e_GM = 0.577, giving E_trunc ~
 *     1.4e-5 = 0.458x (imp-2631 route c). This is the only defensible MOVE and it LOWERS E_trunc.
 *   - There is no defensible physics that INFLATES E_trunc above 3.06e-5 while keeping the honest optimum
 *     (sigma = 3/4 at T_PT): route (b) sigma = 0.62 gives 6.4e-2 but that is a strictly WORSE conservative
 *     CHOICE, not an uncertainty on the optimal route. Allowing only small prefactor slack, the generous
 *     physical UPPER multiplier is ~ 1.1x.
 *   => physical E_trunc multiplier band ~ [0.458, 1.1], ONE-SIDED DOWN. The 1.5x upper edge of the arbitrary
 *      box is unphysical AND wrong-signed: every honest E_trunc route moves it down, not up.
 *
 * WHAT IS NEW (vs imp-95617, which measured the wedge only over the arbitrary +/-50% box)
 * -------------------------------------------------------------------------------------------
 *   (P1) THE INVERSION WEDGE SITS IN THE PHYSICALLY WRONG-SIGNED CORNER. The wedge needs E_trunc to move UP
 *        (toward the 1.5x edge) AND C_C to shrink. But the physical E_trunc band is one-sided DOWN (GM2024
 *        -> 0.458x): the honest direction of E_trunc uncertainty points AWAY from the wedge. Lowering
 *        E_trunc raises A = C_C/E_trunc and pushes the knee UP, widening the gap, not closing it.
 *   (P2) AT THE MOST-ADVERSE PHYSICAL CORNER THE ORDERING STILL DOES NOT INVERT. Even taking the generous
 *        one-sided-up E_trunc 1.1x together with the best-case C_C 0.577x, the gap is ~ +0.00353 > 0 -- the
 *        transition still precedes the knee. The arbitrary-box inversion at (0.5x, 1.5x) is not reachable
 *        by any defensible combination.
 *   (P3) THE C_C DOWN-LEVER FALLS SHORT OF THE CONTOUR BY ~0.063 IN MULTIPLIER SPACE. At the generous
 *        physical E_trunc 1.1x the gap = 0 contour is at C_C ~ 0.514x (a 1.95x shrink from pinned), but the
 *        best-case physical C_C floor is 0.577x (a 1.73x shrink, Selberg 3 -> 1). The physical floor sits
 *        ~0.063 ABOVE the contour: reaching inversion needs a ~1.95x C_C shrink, ~13% more than the most
 *        aggressive certified Selberg improvement can deliver, and that improvement is itself only a
 *        conjectured tightening. In physical units the pinned point does NOT reach the wedge.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the exact-model gap functions are
 * byte-for-byte the imp-95617/imp-95598 ones; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-95617-transition-knee-ordering-joint-2d (the arbitrary +/-50% box wedge this maps to physical units)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); C_H = 1/8 ansatz, C_Selberg = 3 conservative)
 * @see imp-2631-honest-truncation-route-assessment (E_trunc routes; GM2024 -> 1.4e-5, one-sided down)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-95617/imp-95598 exactly

// EXACT full-model gap machinery, byte-for-byte the imp-95617 functions (no re-derivation, no fresh term).
function lnSigmaFull(x, C_C, E_trunc) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // absolute additive term, breaks pure-A scaling
  const E_coll = C_C * Math.sqrt(L / N); // GUE-conditional (C_H)
  return Math.log(E_coll / (E_trunc + E_flow + E_coll));
}
function pLocal(x, h, C_C, E_trunc) {
  return -(lnSigmaFull(x + h, C_C, E_trunc) - lnSigmaFull(x - h, C_C, E_trunc)) / (2 * h);
}
function pSecond(x, h, C_C, E_trunc) {
  return (
    (pLocal(x + h, h, C_C, E_trunc) - 2 * pLocal(x, h, C_C, E_trunc) + pLocal(x - h, h, C_C, E_trunc)) /
    (h * h)
  );
}
function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}
function crossoverLog10(C_C, E_trunc) {
  const A = C_C / E_trunc;
  let N = 3e9;
  for (let i = 0; i < 300; i++) N = A * A * Math.log(effectiveHeightForN(N));
  return Math.log10(N);
}
function kneeLog10(C_C, E_trunc) {
  const x = bisect((xx) => pSecond(xx, 1e-3, C_C, E_trunc), Math.log(1e5), Math.log(1e14));
  return x / Math.LN10;
}
const gap = (C_C, E_trunc) => kneeLog10(C_C, E_trunc) - crossoverLog10(C_C, E_trunc);

const BASE_GAP = gap(C_C_PINNED, E_TRUNC_PT); // ~0.01315

// ── Physical multiplier bands (provenance-derived; see header) ──────────────────────────────────────
const CC_UP_MULT = 0.127 / 0.125; // ~1.016 (C_H remainder up, imp-2643; finite-N C_Lip > 1, imp-399)
const CC_DOWN_MULT = Math.sqrt(1 / 3); // ~0.5774 (best-case C_Selberg 3 -> 1, C_C ~ sqrt(C_Selberg))
const ET_DOWN_MULT = 1.4e-5 / 3.06e-5; // ~0.4575 (Guth-Maynard 2024 route c, imp-2631)
const ET_UP_MULT = 1.1; // generous prefactor slack; no defensible route inflates E_trunc past ~1.1x
const E_TRUNC_ONE_SIDED_DOWN = ET_DOWN_MULT < 1 && ET_UP_MULT < 1.5; // honest E_trunc uncertainty points down

// ── (P2) gap at the most-adverse physical corner (lowest C_C, highest E_trunc) ──────────────────────
const PHYS_CORNER_GAP = +gap(C_C_PINNED * CC_DOWN_MULT, E_TRUNC_PT * ET_UP_MULT).toFixed(6); // ~0.00353
const PHYS_CORNER_INVERTS = PHYS_CORNER_GAP <= 0; // false

// ── inversion contour C_C_invert(E_trunc) in multiplier space (gap rises with C_C) ──────────────────
function cCInvertMult(me) {
  let lo = 0.1;
  let hi = 1.5;
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (gap(C_C_PINNED * m, E_TRUNC_PT * me) < 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const CONTOUR_CC_AT_ET_UP = +cCInvertMult(ET_UP_MULT).toFixed(5); // ~0.51390 (C_C mult where gap=0 at ET 1.1x)
const CONTOUR_CC_AT_1X = +cCInvertMult(1.0).toFixed(5); // ~0.49888

// ── (P3) shortfall of the physical C_C floor from the contour at the generous physical E_trunc ceiling ─
const PHYS_FLOOR_ABOVE_CONTOUR = CC_DOWN_MULT > CONTOUR_CC_AT_ET_UP; // true: floor 0.577 > contour 0.514
const MULT_SHORTFALL = +(CC_DOWN_MULT - CONTOUR_CC_AT_ET_UP).toFixed(5); // ~0.06345 (multiplier space)
const SHRINK_NEEDED = +(1 / CONTOUR_CC_AT_ET_UP).toFixed(3); // ~1.946x C_C shrink to invert at ET 1.1x
const SHRINK_AVAILABLE = +(1 / CC_DOWN_MULT).toFixed(3); // ~1.732x best-case physical C_C shrink

export const IMP95635_PHYSICAL_BANDS_VS_INVERSION_WEDGE = {
  id: 'imp-95635',
  proofSection: 'S-frontier',
  question:
    'Do the PHYSICAL uncertainty bands on C_C and E_trunc reach the imp-95617 transition-before-knee ' +
    'inversion wedge, or is the arbitrary [0.5x, 1.5x]^2 box unphysically wide? Derive the provenance-based ' +
    'plausible ranges on C_C = (1/8) sqrt(3 pi) (imp-2714) and E_trunc = 3.06e-5 (imp-2631) and measure the ' +
    'distance of the pinned point from the gap = 0 inversion contour in those physical units. ' +
    'Sensitivity/measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the provenance-derived physical multiplier bands on C_C and E_trunc, the gap at the most-adverse ' +
    'physical corner, and the multiplier-space shortfall of the physical C_C floor from the inversion contour',
  base: {
    gap: +BASE_GAP.toFixed(5), // ~0.01315
    C_C_pinned: +C_C_PINNED.toFixed(6), // ~0.383748
    E_trunc_pinned: E_TRUNC_PT, // 3.06e-5
  },
  physicalBands: {
    C_C_mult: { down: +CC_DOWN_MULT.toFixed(5), up: +CC_UP_MULT.toFixed(5) }, // ~[0.577, 1.016]
    C_C_down_lever: 'best-case Koksma-Hlawka C_Selberg 3 -> 1 (C_C ~ sqrt(C_Selberg)); conjectured, not certified',
    C_C_up_lever: 'C_H tangency remainder ~0.127 (imp-2643) + finite-N Gronwall C_Lip > 1 (imp-399); both move C_C UP',
    E_trunc_mult: { down: +ET_DOWN_MULT.toFixed(5), up: ET_UP_MULT }, // ~[0.458, 1.1]
    E_trunc_down_lever: 'Guth-Maynard 2024 exponent e_GM = 0.577 -> E_trunc ~ 1.4e-5 (imp-2631 route c)',
    E_trunc_one_sided_down: E_TRUNC_ONE_SIDED_DOWN, // true: no defensible route inflates E_trunc past ~1.1x
  },
  physicalCorner: {
    at: { C_C_mult: +CC_DOWN_MULT.toFixed(5), E_trunc_mult: ET_UP_MULT },
    gap: PHYS_CORNER_GAP, // ~0.00353 (> 0: still no inversion)
    inverts: PHYS_CORNER_INVERTS, // false
  },
  contourShortfall: {
    contour_C_C_mult_at_E_trunc_up: CONTOUR_CC_AT_ET_UP, // ~0.51390
    contour_C_C_mult_at_1x: CONTOUR_CC_AT_1X, // ~0.49888
    physical_C_C_floor_mult: +CC_DOWN_MULT.toFixed(5), // ~0.57735
    physical_floor_above_contour: PHYS_FLOOR_ABOVE_CONTOUR, // true
    mult_space_shortfall: MULT_SHORTFALL, // ~0.06345
    shrink_needed_to_invert: SHRINK_NEEDED, // ~1.946x
    shrink_physically_available: SHRINK_AVAILABLE, // ~1.732x
  },
  finding: {
    P1_wedge_in_wrong_signed_corner:
      'The inversion wedge needs E_trunc to move UP (toward the 1.5x edge) and C_C to shrink, but the ' +
      'physical E_trunc band is one-sided DOWN (Guth-Maynard 2024 -> 0.458x): the honest direction of ' +
      'E_trunc uncertainty points AWAY from the wedge. Lowering E_trunc raises A = C_C/E_trunc and pushes ' +
      'the knee UP, widening the gap. The 1.5x upper box edge is unphysical and wrong-signed.',
    P2_physical_corner_does_not_invert:
      'Even taking the generous one-sided-up E_trunc 1.1x together with the best-case C_C 0.577x (Selberg ' +
      '3 -> 1), the gap is ~ +0.00353 > 0 -- the transition still precedes the knee. The arbitrary-box ' +
      'inversion at (C_C 0.5x, E_trunc 1.5x) is not reachable by any defensible combination.',
    P3_C_C_down_lever_falls_short:
      'At the generous physical E_trunc 1.1x the gap = 0 contour is at C_C ~ 0.514x (a ~1.95x shrink from ' +
      'pinned), but the best-case physical C_C floor is 0.577x (a ~1.73x shrink, Selberg 3 -> 1). The ' +
      'physical floor sits ~0.063 ABOVE the contour in multiplier space: inverting needs ~13% more C_C ' +
      'shrink than the most aggressive (and only conjectured) Selberg improvement can deliver.',
  },
  isRigorous: false,
  verdict:
    'SENSITIVITY / MEASUREMENT (frontier-direction, NOT rigorous). Mapping the provenance-based physical ' +
    'uncertainty bands onto the imp-95617 inversion wedge shows the arbitrary [0.5x, 1.5x]^2 box is ' +
    'unphysically wide -- especially on E_trunc, whose genuine uncertainty is ONE-SIDED DOWN (Guth-Maynard ' +
    '2024 -> ~0.458x), never up toward the 1.5x edge the wedge sits at. The wedge therefore lives in the ' +
    'physically wrong-signed corner. At the most-adverse defensible corner (E_trunc generous 1.1x, C_C ' +
    'best-case 0.577x from a conjectured Koksma-Hlawka C_Selberg 3 -> 1) the gap is still ~ +0.00353 > 0: ' +
    'the transition-before-knee ordering does NOT invert. The gap = 0 contour at E_trunc 1.1x needs a ' +
    '~1.95x C_C shrink, but the best-case physical C_C floor delivers only ~1.73x, sitting ~0.063 above ' +
    'the contour in multiplier space. So NO physically defensible perturbation of (C_C, E_trunc) reaches ' +
    'the inversion wedge; the imp-95617 inversion is confined to unphysically large / wrong-signed moves. ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95617 (the arbitrary +/-50% box inversion wedge mapped here to physical units); imp-399/imp-2714 ' +
    '(C_C = (1/8) sqrt(3 pi); C_H = 1/8 ansatz with ~0.127 remainder imp-2643; C_Selberg = 3 conservative ' +
    'Koksma-Hlawka, imp-341); imp-2631 (E_trunc = 3.06e-5, PT + Ingham sigma = 3/4; GM2024 route c -> ' +
    '1.4e-5); imp-486 (C_mb GUE-conditional, untouched); lambda-rh-height-mapping.',
};

export const IMP95635_PHYSICAL_BANDS_VS_INVERSION_WEDGE_ASSERTIONS = [
  {
    // (P1) the physical E_trunc band is one-sided down; the wedge sits in the wrong-signed corner.
    id: 'imp95635-e-trunc-band-one-sided-down',
    description: 'physical E_trunc band is one-sided down (GM2024 ~0.458x, up-lever <= ~1.1x, not 1.5x)',
    holds: () =>
      E_TRUNC_ONE_SIDED_DOWN === true &&
      ET_DOWN_MULT < 0.5 &&
      ET_UP_MULT <= 1.1 &&
      ET_UP_MULT < 1.5,
  },
  {
    // (P2) the most-adverse physical corner does NOT invert (gap stays strictly positive).
    id: 'imp95635-physical-corner-does-not-invert',
    description: 'gap at (C_C 0.577x, E_trunc 1.1x) is positive (~0.0035): ordering still holds physically',
    holds: () =>
      PHYS_CORNER_INVERTS === false &&
      PHYS_CORNER_GAP > 0 &&
      PHYS_CORNER_GAP < BASE_GAP,
  },
  {
    // (P3) the physical C_C floor sits above the inversion contour: down-lever falls short.
    id: 'imp95635-c-c-floor-above-contour',
    description: 'physical C_C floor 0.577x > contour 0.514x at E_trunc 1.1x; shrink needed (~1.95x) > available (~1.73x)',
    holds: () =>
      PHYS_FLOOR_ABOVE_CONTOUR === true &&
      MULT_SHORTFALL > 0 &&
      CC_DOWN_MULT > CONTOUR_CC_AT_ET_UP &&
      SHRINK_NEEDED > SHRINK_AVAILABLE,
  },
  {
    // Honesty gate: sensitivity/measurement only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95635-honesty-gate-no-qed',
    description: 'Sensitivity/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95635_PHYSICAL_BANDS_VS_INVERSION_WEDGE.isRigorous === false &&
      /NO QED/.test(IMP95635_PHYSICAL_BANDS_VS_INVERSION_WEDGE.verdict) &&
      /refereed bound is changed/i.test(IMP95635_PHYSICAL_BANDS_VS_INVERSION_WEDGE.verdict),
  },
];

for (const a of IMP95635_PHYSICAL_BANDS_VS_INVERSION_WEDGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95635-physical-bands-vs-inversion-wedge assertion failed: ${a.id}`);
  }
}
