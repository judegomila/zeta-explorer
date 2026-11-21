/**
 * @module imp-96714-safe-direction-per-rung-verification
 * @fileoverview imp-96714 -- verify the imp-96695 finite-height "safe direction" claim
 *   across the FULL imp-96430 calibration window, not just at the single L = 960 rung
 *   where it was exhibited. imp-96695 concluded that the real-zero corroboration signal
 *   |rho_emp + 1/2| is even smaller than the GUE signal |rho_GUE + 1/2| (so real zeros do
 *   not contradict the shrinking-signal crossover picture), but demonstrated it only at
 *   L = 960. This module recomputes the sign of the per-rung difference
 *
 *       d_sig(L) = |rho_emp(L) + 1/2| - |rho_GUE(L) + 1/2|
 *
 *   at every rung L in {30, 60, 120, 240, 480, 960}, reusing the imp-96695 baked rhoEmp /
 *   rhoGue table verbatim (the |.+1/2| signal columns are a pure arithmetic reshape). A
 *   negative d_sig means the empirical signal is smaller than GUE (the "safe direction");
 *   a non-negative d_sig means the real-zero signal is at least as large as GUE at that
 *   rung, contradicting the claim there.
 *
 *   THE FINDING
 *   -----------------------------------------------
 *   The safe-direction claim is NOT uniform over the window. It holds (d_sig < 0) at the
 *   four larger rungs L in {120, 240, 480, 960} but FAILS (d_sig > 0) at the two smallest
 *   rungs:
 *     L = 30:  |rho_emp+1/2| = 0.080896 vs |rho_GUE+1/2| = 0.050847  ->  d_sig = +0.030049  (FAILS)
 *     L = 60:  |rho_emp+1/2| = 0.048206 vs |rho_GUE+1/2| = 0.046152  ->  d_sig = +0.002054  (FAILS)
 *     L = 120: |rho_emp+1/2| = 0.008707 vs |rho_GUE+1/2| = 0.042252  ->  d_sig = -0.033545  (SAFE)
 *     L = 240: |rho_emp+1/2| = 0.015472 vs |rho_GUE+1/2| = 0.038960  ->  d_sig = -0.023488  (SAFE)
 *     L = 480: |rho_emp+1/2| = 0.001131 vs |rho_GUE+1/2| = 0.036143  ->  d_sig = -0.035012  (SAFE)
 *     L = 960: |rho_emp+1/2| = 0.000330 vs |rho_GUE+1/2| = 0.033707  ->  d_sig = -0.033377  (SAFE)
 *
 *   MECHANISM
 *   -----------------------------------------------
 *   The failure is exactly the pre-saturation regime. At L = 30 the empirical rho
 *   (-0.419104) has NOT yet reached the rigidity limit -1/2 -- it sits ABOVE it (less
 *   rigid), so its signal 0.080896 exceeds the GUE 0.050847. At L = 60 the empirical rho
 *   overshoots just below -1/2 (-0.548206) but by enough that |rho_emp+1/2| = 0.048206
 *   still marginally exceeds the GUE 0.046152. Only once the finite-height number-variance
 *   saturation (imp-96695 FINDING 2, onset L ~ 3-8) has pinned rho_emp hard against -1/2
 *   -- at L >= 120 -- does the empirical signal collapse below GUE and stay there. So the
 *   safe-direction interpretation is correct precisely in the reach-relevant large-L end of
 *   the window (where the corroboration crossover lives) but does not extend to the two
 *   smallest calibration rungs.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A per-rung sign verification of an existing measurement. It refines the imp-96695
 *   claim from "safe at L = 960" to "safe at L >= 120, fails at L in {30, 60}", using the
 *   same baked data. It recomputes nothing from the zeros, moves no bound, instantiates no
 *   interval, closes no sub-gap. NO QED. No refereed bound is changed; RH open.
 *
 * @see imp-96695-basis-c-empirical-rho-vs-gue-crossvalidation (the rhoEmp/rhoGue table and the L=960 safe-direction claim this checks)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the calibration window {30,60,120,240,480,960})
 * @see imp-96721-sigma2-emp-vs-gue-viz-data (the presentation reshape of the same signal columns)
 */

// -- Per-rung safe-direction verification (arithmetic reshape of imp-96695 table) --
// Columns reuse imp-96695 rhoEmp/rhoGue verbatim. sigEmp = |rhoEmp + 1/2|,
// sigGue = |rhoGue + 1/2|, dSig = sigEmp - sigGue; safe = (dSig < 0).
const IMP96714_SAFE_DIRECTION_TABLE = Object.freeze([
  Object.freeze({ L: 30, rhoEmp: -0.419104, rhoGue: -0.449153, sigEmp: 0.080896, sigGue: 0.050847, dSig: 0.030049, safe: false }),
  Object.freeze({ L: 60, rhoEmp: -0.548206, rhoGue: -0.453848, sigEmp: 0.048206, sigGue: 0.046152, dSig: 0.002054, safe: false }),
  Object.freeze({ L: 120, rhoEmp: -0.491293, rhoGue: -0.457748, sigEmp: 0.008707, sigGue: 0.042252, dSig: -0.033545, safe: true }),
  Object.freeze({ L: 240, rhoEmp: -0.484528, rhoGue: -0.461040, sigEmp: 0.015472, sigGue: 0.038960, dSig: -0.023488, safe: true }),
  Object.freeze({ L: 480, rhoEmp: -0.498869, rhoGue: -0.463857, sigEmp: 0.001131, sigGue: 0.036143, dSig: -0.035012, safe: true }),
  Object.freeze({ L: 960, rhoEmp: -0.499670, rhoGue: -0.466293, sigEmp: 0.000330, sigGue: 0.033707, dSig: -0.033377, safe: true }),
]);

const IMP96714_SAFE_FROM_L = 120; // safe direction holds at every rung L >= this
const IMP96714_FAIL_RUNGS = Object.freeze([30, 60]); // rungs where the claim fails

export const IMP96714_SAFE_DIRECTION_PER_RUNG = Object.freeze({
  id: 'imp-96714',
  proofSection: 'S-frontier',
  verifies: 'imp-96695 finite-height "safe direction" claim across the full imp-96430 window',
  table: IMP96714_SAFE_DIRECTION_TABLE,
  safeFromL: IMP96714_SAFE_FROM_L,
  failRungs: IMP96714_FAIL_RUNGS,
  anyBoundMoved: false,
  verdict:
    'PER-RUNG VERIFICATION. The imp-96695 safe-direction claim (|rho_emp+1/2| < |rho_GUE+1/2|) ' +
    'is NOT uniform over the L = {30,60,120,240,480,960} calibration window. It FAILS at the ' +
    'two smallest rungs -- L = 30 (d_sig = +0.030) and L = 60 (d_sig = +0.002), where the ' +
    'empirical number variance has not yet saturated to the rigidity limit -1/2 -- and HOLDS ' +
    '(d_sig < 0) at L >= 120, where saturation pins rho_emp against -1/2 and the empirical ' +
    'signal collapses below GUE. So the safe-direction interpretation is correct at the ' +
    'reach-relevant large-L end but must be restated as "safe at L >= 120" rather than ' +
    'across the whole window. Reuses the imp-96695 baked table; recomputes nothing from the ' +
    'zeros; moves no bound; instantiates no interval; NO QED. No refereed bound is changed' +
    '; RH open.',
  citation:
    'imp-96695 (rhoEmp/rhoGue table and the L=960 safe-direction claim); imp-96430 ' +
    '(calibration window); imp-96721 (signal-column presentation reshape).',
});

export default IMP96714_SAFE_DIRECTION_PER_RUNG;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96714_SAFE_DIRECTION_PER_RUNG_ASSERTIONS = [
  {
    id: 'imp96714-signal-columns-match-baked-rho',
    why: 'The signal columns must be the exact |rho + 1/2| reshape of the imp-96695 baked ' +
      'rhoEmp/rhoGue values -- no independent recomputation, so they must agree to rounding.',
    holds: () => IMP96714_SAFE_DIRECTION_TABLE.every((r) => {
      const eEmp = Math.abs(Math.abs(r.rhoEmp + 0.5) - r.sigEmp);
      const eGue = Math.abs(Math.abs(r.rhoGue + 0.5) - r.sigGue);
      const eDif = Math.abs((r.sigEmp - r.sigGue) - r.dSig);
      return eEmp < 5e-7 && eGue < 5e-7 && eDif < 5e-7;
    }),
  },
  {
    id: 'imp96714-safe-direction-fails-at-small-rungs',
    why: 'The core finding: the safe-direction claim fails (d_sig > 0) at exactly L = 30 and ' +
      'L = 60, refuting uniformity over the window.',
    holds: () => {
      const fails = IMP96714_SAFE_DIRECTION_TABLE.filter((r) => r.dSig > 0).map((r) => r.L);
      return fails.length === 2 && fails[0] === 30 && fails[1] === 60;
    },
  },
  {
    id: 'imp96714-safe-direction-holds-from-L120',
    why: 'The complementary half: the claim holds (d_sig < 0) at every rung L >= 120, where ' +
      'finite-height saturation has pinned rho_emp against the rigidity limit.',
    holds: () => IMP96714_SAFE_DIRECTION_TABLE
      .filter((r) => r.L >= IMP96714_SAFE_FROM_L)
      .every((r) => r.dSig < 0 && r.safe === true),
  },
  {
    id: 'imp96714-no-bound-moved',
    why: 'This is a per-rung sign verification only; it must not assert any bound movement.',
    holds: () => IMP96714_SAFE_DIRECTION_PER_RUNG.anyBoundMoved === false,
  },
];
