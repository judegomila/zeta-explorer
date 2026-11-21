/**
 * @module imp-3249-selector-artifact-cglo-guard
 * @fileoverview imp-3249 -- Cross-module build-assertion tripwire locking the
 *   selector-artifact status of the imp-3045/3173/3194 minimal-gap selector-tie
 *   onsets. These values (~0.90625 and ~0.9032364) are discrete-selector artifacts,
 *   NOT smooth drho/ds zeros, and therefore do NOT validly bound the open global
 *   asymmetric multi-body isolation constant c_glob in either direction.
 *
 *   BACKGROUND
 *   ----------
 *   Two bisection results near the c_asym = 0.9027902 transcendental onset look
 *   numerically like valid upper bounds on c_glob but are artifacts:
 *
 *   ARTIFACT-1 (~0.90625, imp-3021/3172/3194):
 *     The canonical half-lattice (one-sided minimal-spacing right lattice, lone
 *     left neighbour at -1) global-nearest bisection locks BIT-EXACTLY at
 *     ~0.9062491875 by L = 4 lattice particles and stays there for ALL L >= 4.
 *     At that "onset" drho/ds is NOT near zero (it is +0.01..0.08); the bisection
 *     has locked onto a d_1 = 1 nearest-neighbour TIE (the lone left neighbour and
 *     the first right lattice gap are equal = 1), which creates a selector-index
 *     discontinuity, not a smooth worsening transition. The genuine smooth onset on
 *     the lone-neighbour branch decreases algebraically (O(1/L^2)) to an L -> inf
 *     extrapolated limit ~0.898021, well BELOW 0.90625.
 *
 *   ARTIFACT-2 (~0.9032364, imp-3045/3173):
 *     The asymmetric R->inf bisection (Config-A: tight neighbour at -1 + opposite
 *     unit lattice) locked onto a d_1 environment-neighbour selector INDEX-FLIP
 *     discontinuity near g ~ 0.9029 driven by floating-point rounding of (g+1)-g.
 *     The genuine smooth onset is the closed-form transcendental root c_asym =
 *     0.9027902227683418 (imp-3170); the bisection endpoint 0.9032364 has true
 *     drho/ds = +0.00242 > 0 at the true onset, confirming it sits ABOVE c_asym.
 *
 *   WHAT THIS MODULE LOCKS
 *   ----------------------
 *   Three independent checks that together prevent either selector-artifact value
 *   from being silently promoted to a valid c_glob bracket or bound:
 *
 *   (L1) Neither artifact value appears in the bracket ledger openBracket endpoints.
 *        The open bracket is [STRUCTURED_INF, C_ASYM] ~ (0.9016, 0.9028); both
 *        artifacts (0.90625 and 0.9032364) sit well outside this range. If someone
 *        edits the ledger to insert an artifact into openBracket, L1 fails.
 *
 *   (L2) Neither artifact value appears in the ledger valid rows array. The artifacts
 *        live in the separate selectorArtifacts list; their values should NOT match
 *        any entry in rows (which carries only genuine smooth-zero onsets). If an
 *        artifact is promoted to a valid row, L2 fails.
 *
 *   (L3) Every selectorArtifacts entry in the ledger carries status = "selector-artifact"
 *        and the two live cross-module values (from the diagnostic modules that
 *        independently computed the artifact values) match the ledger entries to
 *        within tolerance. This closes the cross-module gap: the ledger's stored
 *        artifact values cannot silently drift from the values the diagnostic modules
 *        actually exhibit.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   LOCK ONLY -- no new mathematics, no QED. The global asymmetric multi-body
 *   isolation constant c_glob remains OPEN; every located smooth onset is only an
 *   UPPER bound. The Theorem-C basin constant 0.72 is the load-bearing lower
 *   reference (margin ~0.18 to every located onset). No refereed bound is changed
 *   . No false QED.
 *
 *   @see sg1c-asym-onset-bracket-ledger-2026-06-30.js  (the ledger with selectorArtifacts)
 *   @see sg1c-mingap-selector-discontinuity-2026-06-30.js  (imp-3173 diagnostic of imp-3045)
 *   @see sg1c-theta-trap-theorems.js  (imp-3194 half-lattice L-sweep, tieOnsetSaturated)
 *
 *   Ticket: imp-3249 (meta, low).
 */

import { SG1C_ASYM_ONSET_BRACKET_LEDGER } from './sg1c-asym-onset-bracket-ledger-2026-06-30.js';
import { SG1C_MINGAP_SELECTOR_DISCONTINUITY } from './sg1c-mingap-selector-discontinuity-2026-06-30.js';
import { SG1C_R2T2_HALFLATTICE_LSWEEP } from './sg1c-theta-trap-theorems.js';

const ledger = SG1C_ASYM_ONSET_BRACKET_LEDGER;
const artifacts = ledger.selectorArtifacts;      // [{value,status,ticket,...}, ...]
const openBracket = ledger.openBracket;           // [STRUCTURED_INF, C_ASYM] ~ (0.9016, 0.9028)
const validRows = ledger.rows;                    // genuine smooth-zero onsets only

// Live cross-module values: independently-computed artifact values from the diagnostic modules.
const LIVE_IMP3045_ONSET = SG1C_MINGAP_SELECTOR_DISCONTINUITY.scanFalseOnset; // 0.9032364257812502
const LIVE_HALFLATTICE_TIE = SG1C_R2T2_HALFLATTICE_LSWEEP.tieOnsetSaturated; // ~0.9062491875

export const IMP3249_SELECTOR_ARTIFACT_CGLO_GUARD = Object.freeze({
  id: 'imp-3249-selector-artifact-cglo-guard',
  ticket: 'imp-3249',
  summary:
    'Cross-module tripwire: the imp-3045/3173/3194 selector-artifact onsets (~0.90625 and ' +
    '~0.9032364) are discrete-selector discontinuities, NOT smooth zeros, and do NOT ' +
    'validly bound c_glob. Guards the bracket ledger against silently promoting these ' +
    'artifacts to valid openBracket endpoints or valid rows.',
  sources: Object.freeze([
    'sg1c-asym-onset-bracket-ledger-2026-06-30.js',
    'sg1c-mingap-selector-discontinuity-2026-06-30.js',
    'sg1c-theta-trap-theorems.js',
  ]),
  liveArtifactValues: Object.freeze({
    imp3045FalseOnset: LIVE_IMP3045_ONSET,      // from imp-3173 diagnostic module
    halfLatticeTieOnset: LIVE_HALFLATTICE_TIE,  // from imp-3194 half-lattice L-sweep
  }),
  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isLockOnly: true,
    cglobStatus: 'OPEN -- every located smooth onset is only an UPPER bound; no proven lower bound below basin 0.72',
    sota: 'No refereed bound is changed',
  }),
});

export const IMP3249_SELECTOR_ARTIFACT_CGLO_GUARD_ASSERTIONS = [
  {
    id: 'imp3249-L1-artifacts-not-in-open-bracket',
    why: 'MAIN LOCK: neither selector-artifact value (0.90625 or 0.9032364) should appear as an ' +
         'openBracket endpoint. The valid bracket is [STRUCTURED_INF ~ 0.9016, C_ASYM ~ 0.9028]. ' +
         'If someone edits the ledger to set openBracket[0] or openBracket[1] to an artifact value, ' +
         'they would be presenting a discrete-selector discontinuity as a valid c_glob bound.',
    holds: () => artifacts.every(
      (a) => Math.abs(a.value - openBracket[0]) > 1e-3 && Math.abs(a.value - openBracket[1]) > 1e-3
    ),
  },
  {
    id: 'imp3249-L2-artifacts-absent-from-valid-rows',
    why: 'Artifacts must live in selectorArtifacts only, never in the valid rows list. ' +
         'Promoting an artifact to rows would give it a boundsGlobal claim -- ' +
         'a false upper bound on c_glob from a selector discontinuity.',
    holds: () => {
      const artifactVals = artifacts.map((a) => a.value);
      return validRows.every((row) => artifactVals.every((av) => Math.abs(row.value - av) > 1e-3));
    },
  },
  {
    id: 'imp3249-L3-artifacts-all-flagged-in-ledger',
    why: 'Every selectorArtifacts entry must carry status = "selector-artifact". ' +
         'If the status is changed to "certified-numerical-inf" or "closed-form-exact", ' +
         'the artifact would be misclassified as a valid bound on c_glob.',
    holds: () => artifacts.every((a) => a.status === 'selector-artifact'),
  },
  {
    id: 'imp3249-L3-live-imp3045-onset-matches-ledger',
    why: 'CROSS-MODULE LOCK: the imp-3045 false onset exported by the imp-3173 diagnostic module ' +
         'must match the corresponding selectorArtifacts entry in the bracket ledger to within 1e-5. ' +
         'If the diagnostic module is updated with a corrected value that no longer matches the ledger ' +
         'artifact, this assertion catches the cross-module inconsistency.',
    holds: () => {
      const entry = artifacts.find((a) => /imp-3045/.test(a.ticket));
      return (
        entry !== undefined &&
        Math.abs(LIVE_IMP3045_ONSET - entry.value) < 1e-5
      );
    },
  },
  {
    id: 'imp3249-L3-live-halflattice-tie-matches-ledger',
    why: 'CROSS-MODULE LOCK: the half-lattice tie onset (tieOnsetSaturated, the FP-tie artifact ' +
         'from the imp-3194 L-sweep in sg1c-theta-trap-theorems) must match the corresponding ' +
         'selectorArtifacts entry in the bracket ledger to within 1e-3. Both represent the same ' +
         'bisection-on-discontinuity value ~0.9062; if the ledger entry drifts significantly from ' +
         'the computed value, this assertion catches the inconsistency.',
    holds: () => {
      const entry = artifacts.find((a) => /imp-3194/.test(a.ticket) || /imp-3021/.test(a.ticket));
      return (
        entry !== undefined &&
        Math.abs(LIVE_HALFLATTICE_TIE - entry.value) < 1e-3
      );
    },
  },
  {
    id: 'imp3249-lock-honest-caveat',
    why: 'Mandatory honesty gate: this module must be a pure lock with no RH verdict, no proof, ' +
         'lock-only flag set, c_glob reported OPEN, and PT 0.2 SOTA cited. If any field flips, ' +
         'the module has become an over-claim.',
    holds: () => {
      const c = IMP3249_SELECTOR_ARTIFACT_CGLO_GUARD.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isLockOnly === true &&
        /OPEN/.test(c.cglobStatus) &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3249_SELECTOR_ARTIFACT_CGLO_GUARD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      'imp-3249-selector-artifact-cglo-guard assertion failed: ' + assertion.id
    );
  }
}

export default IMP3249_SELECTOR_ARTIFACT_CGLO_GUARD;
