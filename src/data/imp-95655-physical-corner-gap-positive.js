/**
 * @module imp-95655-physical-corner-gap-positive
 *
 * imp-95655 (numerical, frontier-direction): imp-95635-physical-bands-vs-inversion-wedge (P2) found that
 * even at the MOST-ADVERSE provenance-grounded physical corner (E_trunc generous one-sided-up 1.1x,
 * C_C best-case 0.577x from a conjectured Koksma-Hlawka C_Selberg 3 -> 1) the imp-95617 transition-vs-knee
 * ordering gap is ~ +0.00353 > 0 -- so the imp-95617 inversion wedge (min gap -0.00468, reached only in
 * the ARBITRARY [0.5x, 1.5x]^2 box at C_C 0.5x / E_trunc 1.5x) never enters the physically defensible
 * C_C / E_trunc band. That +0.00353 corner value was measured inside the imp-95635 module but is not
 * guarded by any registered standing assertion (imp-95635 is not in the run-assertions DATA_MODULES list,
 * so its self-executing throw is dead code from `npm run assert`, per the imp-95650 reachability audit).
 *
 * WHAT THIS MODULE ADDS (a standing, registered, import-light guard -- no new finding)
 * ----------------------------------------------------------------------------------
 *   This module INDEPENDENTLY RE-DERIVES the most-adverse-physical-corner gap from the byte-for-byte
 *   imp-95617 / imp-95635 exact-model machinery (lnSigmaFull -> pLocal -> pSecond knee bisection minus the
 *   crossoverLog10 fixed point) and pins:
 *     - the base pinned-point gap ~ +0.01315 > 0 (transition precedes knee at the pinned constants),
 *     - the most-adverse-physical-corner gap ~ +0.00353 > 0 (still no inversion),
 *     - the ordering that the corner gap is SMALLER than the base gap but still strictly positive,
 *   and asserts the corner stays strictly positive so any future edit to the height map, the Gronwall
 *   trap, or the pinned constants that would push the physically defensible corner into the imp-95617
 *   inversion wedge trips the build. Import-light: only effectiveHeightForN (pure Riemann-von Mangoldt
 *   inverse) and C_C_PINNED; NO 16.7MB zeros bundle.
 *
 * SENSITIVITY / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the exact-model gap functions
 * are byte-for-byte the imp-95617 / imp-95635 ones; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-95635-physical-bands-vs-inversion-wedge (P2 corner gap ~ +0.00353 guarded here)
 * @see imp-95617-transition-knee-ordering-joint-2d (the arbitrary +/-50% box inversion wedge)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); C_H = 1/8 ansatz, C_Selberg = 3 conservative)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-95617/imp-95635/imp-95598 exactly

// Physical multiplier band edges (provenance-derived; see imp-95635 header).
const CC_DOWN_MULT = Math.sqrt(1 / 3); // ~0.5774 best-case C_Selberg 3 -> 1 (C_C ~ sqrt(C_Selberg)); conjectured
const ET_UP_MULT = 1.1; // generous prefactor slack; no defensible route inflates E_trunc past ~1.1x

// EXACT full-model gap machinery, byte-for-byte the imp-95617 / imp-95635 functions (no fresh term).
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

const BASE_GAP = +gap(C_C_PINNED, E_TRUNC_PT).toFixed(6); // ~0.013150
const PHYS_CORNER_GAP = +gap(C_C_PINNED * CC_DOWN_MULT, E_TRUNC_PT * ET_UP_MULT).toFixed(6); // ~0.003532

export const IMP95655_PHYSICAL_CORNER_GAP_POSITIVE = {
  id: 'imp-95655',
  proofSection: 'S-frontier',
  question:
    'Independently re-derive the imp-95635 (P2) most-adverse-physical-corner transition-vs-knee gap and ' +
    'pin it as a standing guard: does the gap at (C_C 0.577x best-case, E_trunc 1.1x generous) stay ' +
    'strictly positive, so the imp-95617 inversion wedge never enters the provenance-grounded band? ' +
    'Sensitivity/measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the pinned-point gap and the most-adverse-physical-corner gap, recomputed from the byte-for-byte ' +
    'imp-95617/imp-95635 exact-model machinery, and the strict positivity of the corner gap',
  values: {
    baseGap: BASE_GAP, // ~0.013150 (pinned constants; transition precedes knee)
    physCornerGap: PHYS_CORNER_GAP, // ~0.003532 (adverse corner; still positive)
    physCornerAt: { C_C_mult: +CC_DOWN_MULT.toFixed(5), E_trunc_mult: ET_UP_MULT }, // ~0.57735, 1.1
    cornerInverts: PHYS_CORNER_GAP <= 0, // false
  },
  isRigorous: false,
  verdict:
    'SENSITIVITY / MEASUREMENT (frontier-direction, NOT rigorous). An independent recomputation of the ' +
    'imp-95635 (P2) corner gap confirms that at the most-adverse provenance-grounded physical corner ' +
    '(E_trunc generous 1.1x, C_C best-case 0.577x from a conjectured Koksma-Hlawka C_Selberg 3 -> 1) the ' +
    'transition-vs-knee gap is ~ +0.00353 > 0 -- the transition still precedes the knee, so the imp-95617 ' +
    'inversion wedge (reached only in the arbitrary [0.5x, 1.5x]^2 box) never enters the physically ' +
    'defensible band. This module pins the value as a registered standing assertion. The component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95635 (P2 physical-corner gap ~ +0.00353 mapped and guarded here); imp-95617 (the arbitrary ' +
    '+/-50% box inversion wedge, min gap -0.00468); imp-399/imp-2714 (C_C = (1/8) sqrt(3 pi); C_Selberg = ' +
    '3 conservative Koksma-Hlawka); imp-2631 (E_trunc = 3.06e-5, PT + Ingham; GM2024 route c one-sided ' +
    'down); imp-486 (C_mb GUE-conditional, untouched); lambda-rh-height-mapping.',
};

export const IMP95655_PHYSICAL_CORNER_GAP_POSITIVE_ASSERTIONS = [
  {
    // Base pinned-point gap is strictly positive (transition precedes knee at the pinned constants).
    id: 'imp95655-base-gap-positive',
    description: 'pinned-point transition-vs-knee gap is positive (~0.01315): transition precedes knee',
    holds: () => BASE_GAP > 0 && Math.abs(BASE_GAP - 0.01315) < 1e-4,
  },
  {
    // (P2) the most-adverse physical corner gap stays strictly positive (~+0.00353): no inversion.
    id: 'imp95655-physical-corner-gap-positive',
    description:
      'gap at (C_C 0.577x, E_trunc 1.1x) is strictly positive (~0.00353): wedge stays outside physical band',
    holds: () =>
      PHYS_CORNER_GAP > 0 &&
      PHYS_CORNER_GAP < BASE_GAP &&
      Math.abs(PHYS_CORNER_GAP - 0.00353) < 5e-5,
  },
  {
    // Honesty gate: sensitivity/measurement only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95655-honesty-gate-no-qed',
    description: 'Sensitivity/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95655_PHYSICAL_CORNER_GAP_POSITIVE.isRigorous === false &&
      /NO QED/.test(IMP95655_PHYSICAL_CORNER_GAP_POSITIVE.verdict) &&
      /refereed bound is changed/i.test(IMP95655_PHYSICAL_CORNER_GAP_POSITIVE.verdict),
  },
];

for (const a of IMP95655_PHYSICAL_CORNER_GAP_POSITIVE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95655-physical-corner-gap-positive assertion failed: ${a.id}`);
  }
}
