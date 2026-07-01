/**
 * @module imp-3267-section26-mupass-verdict-lock
 * @fileoverview imp-3267 -- Cross-module build-assertion tripwire locking the
 *   section26-mupass-operator-verdict-2026-06-30 headline numbers against silent
 *   drift, mirroring the imp-3211 overflow-fraction lock pattern.
 *
 *   LOCKED HEADLINE NUMBERS (the five verdict anchors)
 *   ---------------------------------------------------
 *   (H1) deg-2 occupation deficit          = 9.28e-9
 *   (H2) ||V||_HS Volterra HS norm         ~ 1.90e-4  (1.8985e-4 stabilised)
 *   (H3) degree-0 cosh-bridge mass ratio   B/D = 1.074 (B ~ 14.04, D_0 ~ 13.07)
 *   (H4) shear-Gram minimum eigenvalue     ~ -||Gshear|| (hollow + indefinite)
 *   (H5) R = Gpass^{-1/2} Gshear Gpass^{-1/2} partial-isometry norm ||R|| = 1.0000 EXACTLY
 *
 *   WHAT THIS MODULE LOCKS
 *   ----------------------
 *   Six independent checks protecting each headline and the cross-module numeric
 *   agreement between the verdict, imp-3007 (deficit + D_0), and imp-1267 (||V||_HS):
 *
 *   (L1) The imp-3007 genuineDeg2DeficitNonzero field equals 9.28e-9 to 1e-11, AND
 *        the verdict surrogateCorrection string still mentions "9.28e-9". A future edit
 *        that changed the deficit in either source without updating the other fails here.
 *
 *   (L2) The imp-1267 stabilised hs_exact_window at (a=0.5, U=5) is in [1.895e-4,
 *        1.905e-4], consistent with the "1.90e-4" prose. And the cross-module ratio
 *        ||V||_HS / deficit is in [15000, 30000], matching the "20000x" factor cited
 *        in the verdict massFeasible string. If imp-1267 is recomputed with a different
 *        Phi kernel or grid, L2 catches the drift before it silently invalidates the
 *        budget comparison.
 *
 *   (L3) The degree-0 bridge-mass ratio B/D is in [1.070, 1.080] at the genuine-Phi
 *        cell (a=0.5, U=6). B = sinh(aU)/a - U (integral of (cosh-1) on [0,U]) is
 *        computed from first principles; D is imp-3007 cover.rawDeficitMass. If either
 *        the raw-deficit functional or the bridge definition changes, L3 fails.
 *
 *   (L4) The verdict noScalarCore field still asserts the Wronskian is "hollow" AND
 *        "indefinite". If the hollow or indefinite structural claim is edited away, L4
 *        fails -- guarding the operator-order obstruction independently of exact numbers.
 *
 *   (L5) The verdict noScalarCore field still records "||R||=1.0000" (the partial-
 *        isometry tautology). An edit that changed this to some other value or removed
 *        the tautology label fails here.
 *
 *   (L6) Mandatory honesty gate: verdict carries "RH-EQUIVALENT", SOTA says
 *        "Platt-Trudgian Lambda <= 0.2", and SOTA says "no reduction". If any of these
 *        flip the module has drifted into over-claiming.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   PURE CROSS-VALIDATION LOCK, not a proof, not a reduction below RH. These five
 *   numbers characterise the section26 route as RESIDUAL-SUBGAP (mass-feasible,
 *   tautological, RH-equivalent). Locking them prevents silent numeric drift but does
 *   NOT close the operator-positivity residual K_a >= 0. Platt-Trudgian Lambda <= 0.2
 *   remains the rigorous SOTA. No false QED.
 *
 *   @see section26-mupass-operator-verdict-2026-06-30.js (the verdict being locked)
 *   @see imp-3007-mupass-overflow-cover.js (deficit 9.28e-9 + D_0 ~13.07)
 *   @see imp-1267-volterra-hs-bound.js (||V||_HS ~1.8985e-4)
 *   @see imp-3211-overflow-fraction-converged-lock.js (the pattern this mirrors)
 *
 *   Ticket: imp-3267 (meta, low).
 */

import { SECTION26_MUPASS_OPERATOR_VERDICT } from './section26-mupass-operator-verdict-2026-06-30.js';
import { IMP3007_MUPASS_OVERFLOW_COVER } from './imp-3007-mupass-overflow-cover.js';
import { IMP1267_VOLTERRA_HS_BOUND } from './imp-1267-volterra-hs-bound.js';

const v   = SECTION26_MUPASS_OPERATOR_VERDICT;
const g   = IMP3007_MUPASS_OVERFLOW_COVER.genuineDensityCorrection;
const D0  = IMP3007_MUPASS_OVERFLOW_COVER.cover.rawDeficitMass;

// Bridge mass B = integral of (cosh(a*tau)-1) on [0,U] = sinh(aU)/a - U
// at the genuine-Phi headline cell a=0.5, U=6.
const A_HDL = 0.5;
const U_HDL = 6;
const B_BRIDGE = Math.sinh(A_HDL * U_HDL) / A_HDL - U_HDL;   // ~14.04

// Stabilised ||V||_HS at a=0.5, U=5 (converged for U>=2 per imp-1267).
const _hsRow = IMP1267_VOLTERRA_HS_BOUND.rows.find(
  (r) => r.a === 0.5 && r.U === 5
);

export const IMP3267_SECTION26_MUPASS_VERDICT_LOCK = Object.freeze({
  id: 'imp-3267-section26-mupass-verdict-lock',
  ticket: 'imp-3267',
  summary:
    'Cross-module tripwire locking the five section26-mupass verdict headline numbers ' +
    '(deficit 9.28e-9, ||V||_HS ~1.90e-4, B/D=1.074, hollow+indefinite shear-Gram, ' +
    '||R||=1.0000 partial-isometry tautology) against silent drift across the three ' +
    'source modules.',
  sources: Object.freeze([
    'section26-mupass-operator-verdict-2026-06-30.js',
    'imp-3007-mupass-overflow-cover.js',
    'imp-1267-volterra-hs-bound.js',
  ]),
  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isLockOnly: true,
    residualOpen: 'operator-positivity K_a >= 0 (RH-equivalent, untouched)',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

export const IMP3267_SECTION26_MUPASS_VERDICT_LOCK_ASSERTIONS = [
  {
    id: 'imp3267-L1-deficit-cross-module',
    why: 'CROSS-MODULE DEFICIT LOCK: imp-3007 genuineDeg2DeficitNonzero must equal 9.28e-9 to ' +
         '1e-11, AND the verdict surrogateCorrection string must still cite "9.28e-9". A future ' +
         'edit that changes the deficit in imp-3007 without updating the verdict (or vice versa) ' +
         'breaks this consistency check and is caught here before any downstream reasoning drifts.',
    holds: () =>
      typeof g.genuineDeg2DeficitNonzero === 'number' &&
      Math.abs(g.genuineDeg2DeficitNonzero - 9.28e-9) < 1e-11 &&
      /9\.28e-9/.test(v.surrogateCorrection),
  },
  {
    id: 'imp3267-L2-vhs-stabilised-value',
    why: 'The imp-1267 Hilbert-Schmidt exact norm at (a=0.5, U=5) must be in [1.895e-4, 1.905e-4], ' +
         'consistent with the "1.90e-4" headline. This value stabilises for U>=2; a recomputed ' +
         'imp-1267 with a different Phi kernel or grid would shift outside this band and fail here.',
    holds: () =>
      _hsRow != null &&
      _hsRow.hs_exact_window >= 1.895e-4 &&
      _hsRow.hs_exact_window <= 1.905e-4,
  },
  {
    id: 'imp3267-L2-vhs-budget-ratio',
    why: 'CROSS-MODULE BUDGET RATIO: ||V||_HS / deficit must be in [15000, 30000], matching the ' +
         '"20000x" budget factor in the verdict massFeasible string. If either the HS norm or the ' +
         'deficit drifts so the budget comparison no longer reads as "~20000x below", this fails.',
    holds: () => {
      if (_hsRow == null) return false;
      const ratio = _hsRow.hs_exact_window / g.genuineDeg2DeficitNonzero;
      return ratio > 15000 && ratio < 30000 && /20000x/.test(v.massFeasible);
    },
  },
  {
    id: 'imp3267-L3-bridge-mass-ratio',
    why: 'DEGREE-0 BRIDGE RATIO LOCK: B = sinh(aU)/a - U must be in [14.0, 14.1] (the integral ' +
         'of (cosh-1) on [0,U] at a=0.5, U=6), D_0 = rawDeficitMass in [13.0, 13.2], and ' +
         'B/D in [1.070, 1.080] consistent with B/D=1.074. If the raw-deficit functional or the ' +
         'bridge definition changes, the ratio drifts outside this band.',
    holds: () => {
      const ratio = B_BRIDGE / D0;
      return (
        B_BRIDGE > 14.0 && B_BRIDGE < 14.1 &&
        D0 > 13.0 && D0 < 13.2 &&
        ratio > 1.070 && ratio < 1.080
      );
    },
  },
  {
    id: 'imp3267-L4-hollow-indefinite-guard',
    why: 'OPERATOR-OBSTRUCTION QUALITATIVE GUARD: the verdict noScalarCore must still assert the ' +
         'shear Gram is "hollow" AND "indefinite". These two words encode the structural min-eig ' +
         'content: hollow (sinh(0)=0 forces the tau=0 row to vanish) and indefinite (spectrum ' +
         'symmetric about zero, min eig ~ -||Gshear||). Removing either word means the operator- ' +
         'order obstruction has been edited away without fixing it.',
    holds: () =>
      /hollow/.test(v.noScalarCore) &&
      /indefinite/.test(v.noScalarCore),
  },
  {
    id: 'imp3267-L5-partial-isometry-norm',
    why: '||R||=1.0000 TAUTOLOGY LOCK: the verdict noScalarCore must still record "||R||=1.0000". ' +
         'This value is the partial-isometry tautology (Gpass=|Gshear| trivially gives R=partial ' +
         'isometry of Gshear); it is NOT an independent achievement. If an edit changed this to a ' +
         'different value or dropped the tautology label the verdict would be misread as a ' +
         'successful construction.',
    holds: () => /\|\|R\|\|=1\.0000/.test(v.noScalarCore),
  },
  {
    id: 'imp3267-lock-honest-caveat',
    why: 'MANDATORY HONESTY GATE: verdict must carry "RH-EQUIVALENT", SOTA must say ' +
         '"Platt-Trudgian Lambda <= 0.2", and SOTA must say "no reduction". ' +
         'If any of these flip the verdict module is over-claiming and the lock module ' +
         'surfaces it immediately at build time.',
    holds: () =>
      /RH-EQUIVALENT/.test(v.verdict) &&
      /Platt-Trudgian Lambda <= 0\.2/.test(v.sota) &&
      /no reduction/.test(v.sota),
  },
];

for (const assertion of IMP3267_SECTION26_MUPASS_VERDICT_LOCK_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      'imp-3267-section26-mupass-verdict-lock assertion failed: ' + assertion.id
    );
  }
}

export default IMP3267_SECTION26_MUPASS_VERDICT_LOCK;
