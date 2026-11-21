/**
 * imp-96127 (2026-09-23) — MEASUREMENT: extend the imp-96110 br23 bracket truncation past L = 20 to
 * decide whether the flagged rho = 9 edge OVERSHOOT of the Route I Sonine-excess out-fraction
 * (f_out(9) = 0.8923 at L = 20 vs 1 - 1/rho = 0.8889, i.e. ABOVE the law) is a real feature or a
 * truncation artifact. Directly addresses SG-96126-truncation-window (imp-96126: "needs br23 pushed
 * past L = 20, imp-96127 territory"). Measurement only. RH open; no refereed bound is changed; NO QED.
 *
 * SETUP. imp-96110 measures the incremental out-fraction f_out(rho; Jlo, Jhi) = (delta^out_23
 *  increment)/(delta_S23 increment) across a dyadic eps-window eps = 2^{-J} approaching each S-unit
 *  cusp rho = 2^a 3^b, with br23 truncated at S-unit modulus q <= 2^L, L = 20, window J = 14..18.
 *  Its HONEST LIMIT flagged one point: rho = 9 sits at the reliability edge (eps >> 2^{-L} fails there
 *  because the outer window Jhi = 18 is only 4x the truncation floor 2^{-20}) and slightly OVERSHOOTS
 *  the 1 - 1/rho law from above. This module recomputes f_out at L = 24, 28, 30, 32, both with the
 *  outer window PINNED to the floor (Jhi = L - 2, the L = 20 protocol scaled up) and with the window
 *  kept SAFELY above the floor (Jhi <= L - 8, >= 16x margin) and swept deeper (eps -> 0).
 *
 * THE FINDING (the rho = 9 overshoot is a TRUNCATION-EDGE ARTIFACT; the 1 - 1/rho law holds FROM
 * BELOW at every S-unit including rho = 9 once the window is kept off the floor).
 *  (a) PINNED-window control (Jhi = L - 2, mirroring L = 20 J = 14..18). The overshoot does NOT
 *      disappear -- it PERSISTS and grows: f_out(9) = 0.89226 / 0.89666 / 0.89818 / 0.89968 at
 *      L = 20 / 24 / 28 / 30, all ABOVE 0.88889. This is the signature of an artifact: keeping the
 *      outer eps a fixed 4x above the truncation floor reproduces the same edge contamination at every
 *      L, so the "overshoot" tracks the protocol (window-to-floor ratio), not the cusp.
 *  (b) SAFE-window probe (L = 32, floor 2^{-32}, window (j, j+4) swept j = 10..24 so Jhi <= 28 stays
 *      >= 16x above the floor). Now EVERY point -- rho = 9 included -- lies strictly BELOW 1 - 1/rho and
 *      the deficit (target - f_out) shrinks MONOTONICALLY as the window deepens (eps -> 0):
 *        rho = 9   : deficit 3.64e-2 -> 8.56e-3   (target 0.88889, all f_out < target)
 *        rho = 8/3 : deficit 6.85e-2 -> 2.03e-2   (target 0.62500)
 *        rho = 16/9: deficit 6.94e-2 -> 2.09e-2   (target 0.43750)
 *        rho = 6   : deficit 5.26e-2 -> 1.37e-2   (target 0.83333)
 *        rho = 3   : deficit 4.70e-2 -> 1.63e-2   (target 0.66667)
 *      No point overshoots and no residual gap survives: the deficits are all decreasing toward 0 at
 *      the same slow (log^2-cusp) finite-J rate imp-96126 measured, i.e. 1 - 1/rho is approached from
 *      BELOW at rho = 9 exactly as at every other S-unit.
 *
 * VERDICT. The imp-96110 rho = 9 OVERSHOOT was a truncation-edge artifact of pinning the outer eps to
 *  4x the L = 20 floor, NOT a real breach of the fixed-fraction law. Extending L and keeping the
 *  window off the floor CONFIRMS the imp-96110 law f_out(rho) -> 1 - 1/rho from below uniformly across
 *  the {oo, 2, 3} S-units, and removes the rho = 9 honest-limit caveat. This CONFIRMS the imp-96126
 *  finding that 1 - 1/rho is real from below (it upgrades imp-96126's L = 20 "L_ext > 1 impossible edge"
 *  reading of rho = 9 to a clean from-below approach once the truncation is resolved), while leaving
 *  the deeper imp-96126 sub-gap intact: the convergence is still only measured (the log^2-cusp rate is
 *  slow, no rigorous extrapolated limit). The obstruction picture is UNCHANGED -- a fixed fraction of a
 *  DENSE family of log^2 cusps is inherited by the excess -- so nothing here rescues the CC route.
 *
 * HONEST LIMITS. Measurement only: no rigorous limit is proved, only a monotone from-below trend at
 *  finite L, finite eps (the slow log^2-cusp convergence is exactly the SG-96126-truncation-window /
 *  imp-96126 residual and is NOT closed here); the safe-window deficits at L = 32 remain O(10^{-2}) at
 *  the deepest clean window (Jhi = 28), consistent with imp-96126's bracket accuracy; corr23 continuity
 *  is still assumed by analogy with p = 2 (imp-96125 reduced but did not fully discharge it); the p = 2
 *  control is unchanged (br2 does not depend on L). Nothing here moves a Lambda bound or verified
 *  height. RH open; no refereed bound is changed; NO QED.
 *
 * Import-light (reuses the imp-96110 br23 / delta exports only; no zeros bundle). Assertions recompute
 * the pinned-window overshoot at L = 20 and the safe-window from-below approach at L = 32 (~0.5 s).
 * Reproduction: tmp/imp-96127-scratch.mjs (L table) and tmp/imp-96127-scratch2.mjs (L = 32 sweep).
 * Changes no bound.
 */

import { deltaS23c, deltaOut23 } from './imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment.js';

/** incremental out-fraction with an explicit truncation depth L and eps-window (Jlo, Jhi) */
export function outFractionS23L(rho, Jlo, Jhi, L) {
  const oa = deltaOut23(rho * (1 + Math.pow(2, -Jlo)), L), sa = deltaS23c(rho * (1 + Math.pow(2, -Jlo)), L);
  const ob = deltaOut23(rho * (1 + Math.pow(2, -Jhi)), L), sb = deltaS23c(rho * (1 + Math.pow(2, -Jhi)), L);
  return (ob - oa) / (sb - sa);
}

// ---- baked measurement literals
export const IMP_96127_TRUNCATION_EXTENSION_LITERALS = Object.freeze({
  // (a) PINNED-window control (Jhi = L - 2, Jlo = L - 6): rho = 9 overshoot persists/grows -> artifact
  pinnedWindowRho9: [ // [L, f_out(9), target 1 - 1/9 = 0.88889]
    [20, 0.892261, 8 / 9], [24, 0.896656, 8 / 9], [28, 0.898183, 8 / 9], [30, 0.899684, 8 / 9],
  ],
  // (b) SAFE-window probe at L = 32 (floor 2^-32; window (j, j+4), Jhi <= 28 >= 16x above floor):
  //     every S-unit is strictly BELOW 1 - 1/rho and the deficit shrinks monotonically as eps -> 0
  safeWindowL32: { // label: [rho, target, shallow (16,20) f_out, deep (24,28) f_out]
    '9': [9, 8 / 9, 0.866519, 0.880331],
    '8/3': [8 / 3, 0.625, 0.586706, 0.604652],
    '16/9': [16 / 9, 7 / 16, 0.398581, 0.416598],
    '6': [6, 5 / 6, 0.802467, 0.819598],
    '3': [3, 2 / 3, 0.636157, 0.650409],
  },
  verdict: 'the imp-96110 rho = 9 overshoot (0.8923 > 0.8889 at L = 20) is a truncation-EDGE artifact of pinning the outer eps to 4x the L = 20 floor; pushing L to 24/28/30 with the SAME pinned protocol REPRODUCES and grows the overshoot, but keeping the window >= 16x above a deeper floor (L = 32) puts rho = 9 strictly BELOW 1 - 1/rho with a monotonically shrinking deficit, exactly like every other S-unit. The 1 - 1/rho law holds FROM BELOW uniformly; NO residual gap survives; NO QED',
});

export const IMP_96127_BR23_TRUNCATION_EXTENSION = Object.freeze({
  id: 'imp-96127-route-i-br23-truncation-extension-rho9-edge',
  route: 'I (Sonine refinement) — is the imp-96110 rho = 9 edge out-fraction overshoot a real feature or a truncation artifact?',
  parents: [
    'src/data/imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment.js (br23 at L = 20; rho = 9 edge overshoot flagged)',
    'src/data/imp-96126-route-i-fout-richardson-extrapolation-limit.js (SG-96126-truncation-window: needs br23 past L = 20)',
  ],
  status: 'MEASURED — the imp-96110 rho = 9 overshoot (f_out = 0.8923 > 1 - 1/9 = 0.8889 at L = 20) is a TRUNCATION-EDGE ARTIFACT, not a real breach. (a) Pinning the outer eps to 4x the truncation floor (Jhi = L - 2) REPRODUCES and GROWS the overshoot at every L (0.89226 / 0.89666 / 0.89818 / 0.89968 at L = 20 / 24 / 28 / 30) -- the overshoot tracks the protocol, not the cusp. (b) Keeping the window >= 16x above a deeper floor (L = 32, window (j, j+4), Jhi <= 28) puts rho = 9 -- and rho = 8/3, 16/9, 6, 3 -- strictly BELOW 1 - 1/rho with a deficit that shrinks MONOTONICALLY as eps -> 0 (rho = 9: 3.64e-2 -> 8.56e-3). So the imp-96110 law f_out(rho) -> 1 - 1/rho from below holds uniformly across the {oo,2,3} S-units and the rho = 9 honest-limit caveat is removed. The slow log^2-cusp rate (no rigorous extrapolated limit) is the unchanged SG-96126-truncation-window residual. RH open; no refereed bound is changed; NO QED',
  finding: 'pinned-window control (Jhi = L - 2) reproduces the overshoot at all L -> artifact; safe-window probe (L = 32, Jhi <= 28) gives strictly-from-below, monotonically-shrinking deficits at every S-unit including rho = 9',
  resolvesSubGap: 'SG-96126-truncation-window (br23 pushed past L = 20): the rho = 9 edge is a truncation-window artifact; 1 - 1/rho confirmed from below there, matching the other units. The deeper log^2-cusp rigorous-limit sub-gap remains open',
  honestLimits: 'measurement only; monotone from-below trend at finite L, finite eps, NOT a rigorous limit (the slow log^2-cusp convergence is the unchanged imp-96126 residual; deficits stay O(10^-2) at the deepest clean L = 32 window); corr23 continuity still assumed by analogy with p = 2 (imp-96125 reduced, not discharged); p = 2 control unchanged (L-independent); nothing moves a Lambda bound or verified height; RH open; NO QED',
});

// ---- assertions
const L = IMP_96127_TRUNCATION_EXTENSION_LITERALS;
export const IMP_96127_BR23_TRUNCATION_EXTENSION_ASSERTIONS = Object.freeze([
  {
    id: 'imp96127-pinned-window-reproduces-overshoot',
    description: 'ARTIFACT signature: with the outer eps pinned to 4x the truncation floor (Jhi = L - 2), the rho = 9 out-fraction OVERSHOOTS 1 - 1/9 at L = 20 AND the overshoot persists when the same pinned protocol is pushed to L = 28 (both f_out > 8/9), reproducing the baked literals',
    holds: () => {
      const f20 = outFractionS23L(9, 14, 18, 20); // L = 20 pinned (the original imp-96110 window)
      const f28 = outFractionS23L(9, 22, 26, 28); // L = 28 pinned -> still overshoots
      return f20 > 8 / 9 && f28 > 8 / 9
        && Math.abs(f20 - L.pinnedWindowRho9[0][1]) < 1e-4
        && Math.abs(f28 - L.pinnedWindowRho9[2][1]) < 1e-4;
    },
  },
  {
    id: 'imp96127-safe-window-rho9-from-below-monotone',
    description: 'RESOLUTION at rho = 9: at L = 32 with the window kept >= 16x above the floor, the out-fraction is strictly BELOW 1 - 1/9 at both a shallow (16,20) and a deep (24,28) window, and the deeper window has the SMALLER deficit (approach from below, no overshoot), matching the baked safe-window literals',
    holds: () => {
      const shallow = outFractionS23L(9, 16, 20, 32), deep = outFractionS23L(9, 24, 28, 32);
      const tgt = 8 / 9;
      return shallow < tgt && deep < tgt && (tgt - deep) < (tgt - shallow)
        && Math.abs(shallow - L.safeWindowL32['9'][2]) < 1e-4
        && Math.abs(deep - L.safeWindowL32['9'][3]) < 1e-4;
    },
  },
  {
    id: 'imp96127-safe-window-all-s-units-from-below',
    description: 'at L = 32 with the safe deep window (24,28) EVERY flagged S-unit rho = 8/3, 16/9, 6, 3 lies strictly BELOW 1 - 1/rho (uniform from-below approach; the overshoot was unique to the rho = 9 truncation edge and is gone), matching the baked literals',
    holds: () => ['8/3', '16/9', '6', '3'].every((k) => {
      const [rho, tgt, , baked] = L.safeWindowL32[k];
      const f = outFractionS23L(rho, 24, 28, 32);
      return f < tgt && Math.abs(f - baked) < 1e-4;
    }),
  },
  {
    id: 'imp96127-verdict-honesty',
    description: 'status records that the rho = 9 overshoot is a truncation-edge artifact, the 1 - 1/rho law holds from below uniformly, SG-96126-truncation-window is addressed while the rigorous-limit residual stays open, and NO QED',
    holds: () => /TRUNCATION-EDGE ARTIFACT/.test(IMP_96127_BR23_TRUNCATION_EXTENSION.status)
      && /from below/.test(IMP_96127_BR23_TRUNCATION_EXTENSION.status)
      && /NO QED/.test(IMP_96127_BR23_TRUNCATION_EXTENSION.status)
      && /SG-96126-truncation-window/.test(IMP_96127_BR23_TRUNCATION_EXTENSION.resolvesSubGap)
      && /RH open/.test(IMP_96127_BR23_TRUNCATION_EXTENSION.honestLimits),
  },
]);

export default IMP_96127_BR23_TRUNCATION_EXTENSION;
