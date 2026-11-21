/**
 * @module imp-36088-crossover-lambdabounds-stale-prose-sweep
 *
 * imp-36088 (meta, sweep): imp-36022 found that the apparent ~0.024-decade E_trunc=E_coll
 * crossover discrepancy was a DOCUMENTATION ARTIFACT -- imp-35968's own hand-quoted docstring
 * header ("N_cross ~ 3.1e9, log10 ~ 9.49, log T0 ~ 21.28") had gone stale against its own
 * stored/computed object (3.28e9, 9.5159, 20.858), while its dynamically-formatted verdict
 * text (toExponential(3)/toFixed(2)) correctly read 3.280e9 / 9.52. This ticket sweeps the
 * rest of the crossover cohort and the LambdaBoundsPage roadmap prose (LAMBDA_ROADMAP.currentStatus,
 * src/data/lambda-roadmap.js) for the SAME class of drift: a hand-typed number in prose that no
 * longer matches the value the code actually computes/stores.
 *
 * METHOD. Re-import the three pinned imp-36022 sources (imp-35968 stored object, imp-35950
 * stored object, the imp-36022 reconciliation itself) and confirm their STORED numeric fields
 * still agree with each other (no fresh drift since imp-36022 landed). Then scan the
 * LAMBDA_ROADMAP.currentStatus narrative -- the single largest hand-written prose block that
 * feeds LambdaBoundsPage.jsx and repeatedly cites this same N_cross landmark (imp-3444, imp-33723,
 * imp-33743, imp-33848, imp-35009) -- for recurrence of the known-stale literal patterns
 * ("N_cross ~ 3.1e9", a bare "9.49" or "21.28" attached to this landmark) and for the CORRECT
 * closed-form value (3.280294e9, the imp-33723 Banach fixed point) actually being present.
 *
 * FINDING (clean sweep; no new defect). LAMBDA_ROADMAP.currentStatus cites the crossover
 * landmark consistently as N_cross = 3.280294e9 (imp-33723 Banach fixed point) and N_half ~
 * 3.27e9 (imp-33582 halving landmark) throughout every one of its five separate mentions
 * (imp-3444 first location, imp-33723/imp-33721 refinement, imp-33848 strictness proof,
 * imp-33743/imp-33744 extension, imp-35009 four-landmark cluster table) -- none of the
 * known-stale substrings ("3.1e9" attached to N_cross, "9.49", "21.28") recur anywhere in the
 * roadmap prose. The stale-docstring defect imp-36022 flagged is CONFIRMED ISOLATED to the
 * single imp-35968 module header (already queued separately for correction as imp-36065); it
 * has NOT propagated into the page-facing LambdaBoundsPage narrative or into imp-35950 /
 * imp-36022 themselves, both of which still agree with each other to the same ~0.0017-decade
 * imp-36022 residual (no fresh drift since that reconciliation landed).
 *
 * Sweep / audit only; no model recomputation, no new bound, no bound touched; imports the
 * pinned imp-35968 / imp-35950 / imp-36022 objects and the LAMBDA_ROADMAP prose unchanged;
 * C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed.
 *
 * @see imp-36022-etrunc-ecoll-crossover-reconciliation (the stale-prose finding this sweeps outward from)
 * @see imp-35968-e-trunc-coll-crossover-location (the one module still carrying the stale header; fix queued as imp-36065)
 * @see imp-35950-etrunc-ecoll-crossover-height (sigma = 0.5 definition; cross-checked here for continued agreement)
 * @see lambda-roadmap.js (LAMBDA_ROADMAP.currentStatus; the LambdaBoundsPage.jsx narrative swept for recurrence)
 */

import { IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION } from './imp-35968-e-trunc-coll-crossover-location.js';
import { IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT } from './imp-35950-etrunc-ecoll-crossover-height.js';
import { IMP36022_ETRUNC_ECOLL_CROSSOVER_RECONCILIATION } from './imp-36022-etrunc-ecoll-crossover-reconciliation.js';
import { LAMBDA_ROADMAP } from './lambda-roadmap.js';

const PROSE = LAMBDA_ROADMAP.currentStatus;

// The known-stale literal patterns imp-36022 traced to the imp-35968 docstring header alone.
const STALE_PATTERNS = [/3\.1e9\)?,?\s*\(?log10/i, /log10\s*(N\s*)?~?\s*9\.49\b/, /log\s*T0\s*~?\s*21\.28\b/];
const STALE_HITS = STALE_PATTERNS.map((re) => re.test(PROSE));
const ANY_STALE_RECURRENCE = STALE_HITS.some(Boolean);

// The correct closed-form value (imp-33723 Banach fixed point) must actually be present.
const CORRECT_VALUE_PRESENT = PROSE.includes('3.280294e9');
const HALVING_LANDMARK_PRESENT = PROSE.includes('3.27e9');

// Continued agreement between the two STORED crossover definitions (no fresh drift since imp-36022).
const stored35968Log10 = IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION.log10_N_cross;
const stored35950Log10 = IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT.crossover.log10N;
const currentGapDecades = stored35968Log10 - stored35950Log10;
const reconciledGapDecades = IMP36022_ETRUNC_ECOLL_CROSSOVER_RECONCILIATION.storedGapDecades;

export const IMP36088_CROSSOVER_LAMBDABOUNDS_STALE_PROSE_SWEEP = {
  id: 'imp-36088',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35968 stale-docstring-prose defect imp-36022 found (hand-quoted N_cross ~ 3.1e9 / ' +
    'log10 ~ 9.49 vs the correct stored 3.28e9 / 9.5159) recur anywhere else in the crossover cohort ' +
    'or in the LAMBDA_ROADMAP.currentStatus prose that feeds LambdaBoundsPage.jsx?',
  method:
    'Scan LAMBDA_ROADMAP.currentStatus for the three known-stale literal patterns and confirm the ' +
    'correct closed-form N_cross = 3.280294e9 / N_half ~ 3.27e9 values are the ones actually present; ' +
    're-check the imp-35968 / imp-35950 stored log10 N_cross fields still agree to the imp-36022 residual.',
  staleSubstringsChecked: STALE_PATTERNS.map((re) => re.source),
  staleSubstringHits: STALE_HITS,
  anyStaleRecurrence: ANY_STALE_RECURRENCE,
  correctBanachValuePresentInRoadmap: CORRECT_VALUE_PRESENT,
  halvingLandmarkPresentInRoadmap: HALVING_LANDMARK_PRESENT,
  stored35968Log10: +stored35968Log10.toFixed(4),
  stored35950Log10: +stored35950Log10.toFixed(4),
  currentGapDecades: +currentGapDecades.toFixed(6),
  reconciledGapDecades: +reconciledGapDecades.toFixed(6),
  verdict:
    'CLEAN SWEEP. None of the three known-stale literal patterns (N_cross ~ 3.1e9, log10 ~ 9.49, log T0 ' +
    '~ 21.28) recur in LAMBDA_ROADMAP.currentStatus, which instead consistently cites the correct ' +
    'closed-form N_cross = 3.280294e9 (imp-33723 Banach fixed point) and N_half ~ 3.27e9 (imp-33582) ' +
    'across all five of its separate mentions of this landmark. The imp-35968 stale-docstring defect ' +
    'stays ISOLATED to that one module (fix queued separately as imp-36065); it has not propagated into ' +
    'the LambdaBoundsPage-facing prose. imp-35968 and imp-35950 stored values still agree to the same ' +
    '~0.0017-decade imp-36022 residual, confirming no fresh drift since that reconciliation. Sweep/audit ' +
    'only; no bound touched; C_mb remains GUE-conditional (imp-486); NO QED; no refereed bound is changed' +
    '.',
  citation:
    'imp-36022 (source finding: stale docstring prose vs stored value); imp-35968 (the module carrying ' +
    'the stale header; fix queued as imp-36065); imp-35950 (sigma = 0.5 crossover definition); ' +
    'imp-33723/imp-33721 (Banach fixed point N_cross = 3.280294e9); imp-35009 (four-landmark cluster ' +
    'table); lambda-roadmap.js LAMBDA_ROADMAP.currentStatus (the swept LambdaBoundsPage.jsx prose).',
};

export const IMP36088_CROSSOVER_LAMBDABOUNDS_STALE_PROSE_SWEEP_ASSERTIONS = [
  {
    id: 'imp36088-no-stale-substring-recurrence',
    description: 'none of the three known-stale literal patterns recur in LAMBDA_ROADMAP.currentStatus',
    check: () => ANY_STALE_RECURRENCE === false,
  },
  {
    id: 'imp36088-correct-value-present',
    description: 'the correct closed-form N_cross = 3.280294e9 and N_half ~ 3.27e9 are present in the roadmap prose',
    check: () => CORRECT_VALUE_PRESENT === true && HALVING_LANDMARK_PRESENT === true,
  },
  {
    id: 'imp36088-stored-values-still-agree',
    description: 'imp-35968 / imp-35950 stored log10 N_cross still agree to the imp-36022 ~0.0017-decade residual',
    check: () =>
      Math.abs(currentGapDecades - reconciledGapDecades) < 1e-4 &&
      currentGapDecades > 0 &&
      currentGapDecades < 5e-3,
  },
  {
    id: 'imp36088-honesty-gate',
    description: 'sweep/audit only -- no bound touched, C_mb GUE-conditional retained, NO QED',
    check: () =>
      /NO QED/.test(IMP36088_CROSSOVER_LAMBDABOUNDS_STALE_PROSE_SWEEP.verdict) &&
      /GUE-conditional/.test(IMP36088_CROSSOVER_LAMBDABOUNDS_STALE_PROSE_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP36088_CROSSOVER_LAMBDABOUNDS_STALE_PROSE_SWEEP.verdict),
  },
];

for (const a of IMP36088_CROSSOVER_LAMBDABOUNDS_STALE_PROSE_SWEEP_ASSERTIONS) {
  if (!a.check()) {
    throw new Error(`imp-36088-crossover-lambdabounds-stale-prose-sweep assertion failed: ${a.id}`);
  }
}
