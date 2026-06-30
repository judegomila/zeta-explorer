/**
 * @module sg1c-asym-digamma-root-tripwire-2026-06-30
 *
 * imp-3174: CROSS-MODULE tripwire lock for the imp-3170 transcendental
 * isolation onset c_asym. The closed-form module
 * sg1c-asym-isolation-closed-form-2026-06-30 SELF-ASSERTS c_asym as the unique
 * (0,1) root of  drho/ds(g) = psi(g+1) + gamma + 2g - 2/g - 1/(g+1) = 0
 * using its OWN in-module digamma. This module RE-DERIVES that root from an
 * INDEPENDENT digamma implementation (different recurrence shift threshold +
 * an extended Bernoulli asymptotic, two more terms) and an INDEPENDENT Newton
 * solve (the closed-form module used bisection), then certifies the live
 * export matches to ~1e-9. A silent edit to the closed form -- a changed sign,
 * a dropped term, a perturbed digamma -- is therefore caught here.
 *
 * INDEPENDENCE of the two psi paths: the closed-form module recurses to x >= 6
 * and truncates the asymptotic at the 1/(252 x^6) term; this module recurses to
 * x >= 12 and carries the +1/(240 x^8) and -1/(132 x^10) Bernoulli terms. The
 * two roundoff paths are genuinely distinct, so agreement to ~1e-9 is a real
 * cross-check, not a tautology.
 *
 * RE-CERTIFIED INDEPENDENTLY (the three ticket deliverables):
 *   (1) recomputed root == live c_asym export to ~1e-9,
 *   (2) drho/ds(0.72) < 0 strictly (basin self-improving), near its -1.1177,
 *   (3) drho/ds(0.9032364) > 0 strictly (imp-3045 false-onset sits above the
 *       true root), near its +0.00242.
 *
 * LOCK ONLY -- no new math, no QED; PT Lambda <= 0.2 stays the rigorous SOTA.
 *
 * @see sg1c-asym-isolation-closed-form-2026-06-30 (imp-3170, the self-asserted closed form this locks)
 */

import {
  SG1C_ASYM_ISOLATION_CLOSED_FORM,
  asymOnsetDrho,
} from './sg1c-asym-isolation-closed-form-2026-06-30.js';

// INDEPENDENT digamma psi(x): recurrence to x >= 12 (vs the closed-form
// module's x >= 6), then an extended Bernoulli asymptotic carrying two more
// terms (+1/(240 x^8) - 1/(132 x^10)). Distinct roundoff path on purpose.
function digammaIndep(x) {
  let r = 0;
  while (x < 12) { r -= 1 / x; x += 1; }
  const inv = 1 / x;
  const f = inv * inv;
  // psi(x) ~ ln x - 1/(2x) - [1/(12 x^2) - 1/(120 x^4) + 1/(252 x^6) - 1/(240 x^8) + 1/(132 x^10)]
  r += Math.log(x) - 0.5 * inv
    - f * (1 / 12 - f * (1 / 120 - f * (1 / 252 - f * (1 / 240 - f * (1 / 132)))));
  return r;
}

const GAMMA_INDEP = 0.57721566490153286060651209;

// Independent re-evaluation of the imp-3170 onset functional drho/ds(g).
function drhoIndep(g) {
  return digammaIndep(g + 1) + GAMMA_INDEP + 2 * g - 2 / g - 1 / (g + 1);
}

// INDEPENDENT Newton solve (the closed-form module used 200-step bisection).
function newtonRootIndep() {
  let g = 0.85;
  for (let i = 0; i < 80; i++) {
    const f = drhoIndep(g);
    const h = 1e-7;
    const fp = (drhoIndep(g + h) - drhoIndep(g - h)) / (2 * h);
    const step = f / fp;
    g -= step;
    if (Math.abs(step) < 1e-15) break;
  }
  return g;
}

const C_ASYM_INDEP = newtonRootIndep();
const C_ASYM_LIVE = SG1C_ASYM_ISOLATION_CLOSED_FORM.cAsym;
const SCAN_DISCONTINUITY = 0.9032364257812502; // imp-3045 false-onset point

export const SG1C_ASYM_DIGAMMA_ROOT_TRIPWIRE = {
  ticket: 'imp-3174',
  date: '2026-06-30',
  locks: 'imp-3170',
  transcendentalEquation: 'psi(g+1) + gamma + 2g - 2/g - 1/(g+1) = 0',
  recomputedRoot: C_ASYM_INDEP,
  liveExport: C_ASYM_LIVE,
  rootMatchAbsErr: Math.abs(C_ASYM_INDEP - C_ASYM_LIVE),
  drhoAt072: drhoIndep(0.72),                       // -1.1177 < 0 (basin self-improving)
  drhoAtScanDiscontinuity: drhoIndep(SCAN_DISCONTINUITY), // +0.00242 > 0 (false-onset above root)
  digammaIndependence: 'recurrence shift x>=12 + 1/(240 x^8) and 1/(132 x^10) Bernoulli terms; closed-form module used x>=6 truncated at 1/(252 x^6)',
  solverIndependence: 'Newton with central-difference derivative; closed-form module used 200-step bisection',
  status: 'cross-module tripwire: an independent digamma + Newton root reproduces the live c_asym to ~1e-9; the basin sign (drho/ds(0.72)<0) and false-onset sign (drho/ds(0.9032364)>0) are re-certified from the independent path',
  honest: 'LOCK ONLY -- independent recompute of an existing transcendental root, no new math, no QED; PT Lambda <= 0.2 stays the rigorous SOTA.',
};

export const SG1C_ASYM_DIGAMMA_ROOT_TRIPWIRE_ASSERTIONS = [
  {
    id: 'sg1c-asym-tripwire-root-matches-live-1e-9',
    description: 'the independent digamma+Newton root equals the live imp-3170 c_asym export to ~1e-9',
    holds: () => Math.abs(C_ASYM_INDEP - C_ASYM_LIVE) < 1e-9,
  },
  {
    id: 'sg1c-asym-tripwire-independent-digamma-agrees',
    description: 'the independent digamma reproduces the live in-module drho/ds at the root to ~1e-9, and zeroes the functional at the recomputed root',
    holds: () => Math.abs(drhoIndep(C_ASYM_LIVE) - asymOnsetDrho(C_ASYM_LIVE)) < 1e-9
      && Math.abs(drhoIndep(C_ASYM_INDEP)) < 1e-9,
  },
  {
    id: 'sg1c-asym-tripwire-basin-072-strictly-negative',
    description: 'drho/ds(0.72) < 0 strictly (basin self-improving), independently re-certified near the stated -1.1177',
    holds: () => drhoIndep(0.72) < 0 && Math.abs(drhoIndep(0.72) - (-1.1177)) < 1e-3,
  },
  {
    id: 'sg1c-asym-tripwire-false-onset-strictly-positive',
    description: 'drho/ds(0.9032364) > 0 strictly (the imp-3045 false-onset point sits above the true root), independently re-certified near the stated +0.00242',
    holds: () => drhoIndep(SCAN_DISCONTINUITY) > 0 && Math.abs(drhoIndep(SCAN_DISCONTINUITY) - 0.00242) < 1e-3,
  },
  {
    id: 'sg1c-asym-tripwire-lock-honest',
    description: 'explicitly a LOCK ONLY (no new math, no QED) and PT Lambda <= 0.2 stays SOTA',
    holds: () => /LOCK ONLY/.test(SG1C_ASYM_DIGAMMA_ROOT_TRIPWIRE.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(SG1C_ASYM_DIGAMMA_ROOT_TRIPWIRE.honest),
  },
];

for (const a of SG1C_ASYM_DIGAMMA_ROOT_TRIPWIRE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-asym-digamma-root-tripwire assertion failed: ${a.id}`);
}
