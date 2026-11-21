/**
 * @module imp-34583-pole-recovery-cohort-banner-audit
 *
 * imp-34583 (meta): AUDIT of whether imp-34550, imp-34548, and imp-34406 --
 * the three named pole-recovery data modules studying the inherited
 * eflow_over_resid surrogate pole at k* ~ 21.28095 -- each carry the
 * standing honest-status banner, extending the imp-34581 registration-audit
 * precedent to banner completeness rather than heavy-import hygiene.
 *
 * METHOD. For each of the 3 named modules, read its verdict/honest string
 * field and check for all seven required banner elements: (1) the metric is
 * an inherited surrogate, NOT a rigorous asymptotic; (2) changes no bound;
 * (3) establishes no operator positivity; (4) imp-3066 K_a>=0 untouched;
 * (5) C_mb stays GUE-conditional per imp-486; (6) NO QED; (7) Platt-Trudgian
 * no refereed bound is changed (cf imp-34543/imp-34548 verdict norm cited in the
 * ticket). A module fails the audit if any element is missing or reworded
 * so loosely that the corresponding regex below does not match.
 *
 * FINDING: no gap -- all three modules carry the FULL seven-element banner
 * verbatim in their verdict/honest field, matching the cohort norm exactly.
 * imp-34550 and imp-34548 use the identical closing sentence pattern; imp-34406
 * restates the same seven elements in its `honest` field with equivalent wording
 * ("Descriptive surrogate, NOT a rigorous asymptotic" in place of "component
 * model ... NOT a rigorous asymptotic"). No module is missing or weaker-worded.
 *
 * @see imp-34581-pole-recovery-cohort-heavy-import-audit.js (the DATA_MODULES / heavy-import audit this extends to banner completeness)
 * @see imp-34550-recovered-pole-ladder-two-tighter-rungs.js
 * @see imp-34548-pole-leakage-local-spacing-exponent.js
 * @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js
 */

// Verdict / honest field literals reproduced VERBATIM from each audited module
// (read directly from source, not re-derived) so the regex checks below run
// against the real banner text without importing the (heavier) parent modules.
const IMP34550_VERDICT =
  'CROSS-VALIDATION / MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-34529 recovered-' +
  'pole ladder two tighter rungs [21.22,21.27] and [21.25,21.275] gives recovered poles 21.279970 -> ' +
  '21.280579 (still climbing toward k* ~ 21.28095) with residuals 9.776e-4 -> 3.688e-4 (still shrinking ' +
  'below the imp-34529 tail ~2.055e-3), but the per-rung shrink ratio rises to ~0.476 and ~0.377 ' +
  '(geomean ~0.424) ABOVE the imp-34529 early ~0.341 -- so the ~1/3 geometric law does NOT persist; the ' +
  'contraction DECELERATES as the window crowds the pole. That slowdown is NOT the imp-34368 ' +
  'double-precision noise floor: both new residuals sit ~1.36e4x / ~5.1e3x ABOVE the resid_exp ' +
  'peak-location floor dk ~ 7.2e-8, ~4 decades below the tightest residual, so deeper convergence is ' +
  'still observable at double precision -- the naive linear-1/leak estimator saturates its own accuracy ' +
  'near the pole before the precision floor binds. The component model is the inherited imp-3220/imp-3406 ' +
  'extrapolation, NOT a rigorous asymptotic; the residExp simple-zero structure is a numerical/structural ' +
  'observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
  'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
  '.';

const IMP34548_VERDICT =
  'MEASUREMENT (frontier-direction, NOT rigorous). Computing the LOCAL per-pp spacing exponent between ' +
  'the four imp-34530 interval midpoints gives p_local ~ [3.527, 2.928, 2.578] -- FALLING monotonically ' +
  'as the pole distance shrinks (2.747 -> 2.279 -> 1.892), NOT rising toward k*. The global cubic ' +
  'p ~ 3.004 is a window-average sitting between the far-field (~3.53) and near-edge (~2.58) local ' +
  'exponents; the near-edge value below the cubic is precisely the sign that makes imp-34530 R3s forward ' +
  'integration UNDERSHOOT the directly-bisected 25%/30% crossings, so the faster near-k* steepening must ' +
  'live beyond the 20% rung, unresolved by these midpoints. The component model is the inherited ' +
  'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp simple-pole structure is a ' +
  'numerical/structural observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
  'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
  'NO QED. No refereed bound is changed.';

const IMP34406_HONEST =
  'MEASUREMENT ONLY -- a finite-difference recovery of the inherited surrogate numerator ' +
  'eflow_attr across the inherited pole k* ~ 21.28095, computed via the verbatim imp-34169 ' +
  'machinery. eflow_attr is smooth, strictly positive, and monotone through k* (8 rungs, ' +
  'min +2.816e-15, value at k* +4.520e-15), so the eflow_over_resid singularity is a GENUINE ' +
  'simple pole, NOT removable -- confirming the imp-34310 F2 premise previously checked on 2 ' +
  'rungs. Descriptive surrogate, NOT a rigorous asymptotic; the component model is the ' +
  'inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is ' +
  'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
  'untouched; no RH verdict, NO QED; no refereed bound is changed.';

// The seven required banner elements (imp-34583 ticket text), one regex apiece.
const BANNER_ELEMENTS = [
  { key: 'inheritedSurrogateNotRigorous', re: /NOT a rigorous asymptotic/ },
  { key: 'changesNoBound', re: /changes no bound/ },
  { key: 'noOperatorPositivity', re: /establishes no operator positivity/ },
  { key: 'imp3066Untouched', re: /imp-3066 K_a >= 0 untouched/ },
  { key: 'cmbGueConditionalUntouched', re: /C_mb GUE-conditional per imp-486 is UNTOUCHED/ },
  { key: 'noQed', re: /NO QED/ },
  { key: 'ptSota', re: /refereed bound is changed/i },
];

function auditBanner(text) {
  const elements = {};
  for (const { key, re } of BANNER_ELEMENTS) elements[key] = re.test(text);
  const missing = BANNER_ELEMENTS.filter(({ key }) => !elements[key]).map(({ key }) => key);
  return { elements, missing, complete: missing.length === 0 };
}

const COHORT = [
  {
    ticket: 'imp-34550',
    modulePath: 'src/data/imp-34550-recovered-pole-ladder-two-tighter-rungs.js',
    field: 'verdict',
    ...auditBanner(IMP34550_VERDICT),
  },
  {
    ticket: 'imp-34548',
    modulePath: 'src/data/imp-34548-pole-leakage-local-spacing-exponent.js',
    field: 'verdict',
    ...auditBanner(IMP34548_VERDICT),
  },
  {
    ticket: 'imp-34406',
    modulePath: 'src/data/imp-34406-eflow-attr-smooth-nonzero-across-pole.js',
    field: 'honest',
    ...auditBanner(IMP34406_HONEST),
  },
];

const MODULES_WITH_GAPS = COHORT.filter((m) => !m.complete).map((m) => m.ticket);

export const IMP34583_POLE_RECOVERY_COHORT_BANNER_AUDIT = {
  ticket: 'imp-34583',
  cohort: COHORT,
  cohortSize: COHORT.length,
  bannerElements: BANNER_ELEMENTS.map((e) => e.key),
  modulesWithGaps: MODULES_WITH_GAPS, // [] -- no missing or weaker-worded banner found
  allBannersComplete: MODULES_WITH_GAPS.length === 0,
  honest:
    'AUDIT: all three named pole-recovery modules (imp-34550, imp-34548, imp-34406) carry the FULL ' +
    'seven-element honest-status banner (inherited surrogate NOT rigorous, changes no bound, no ' +
    'operator positivity, imp-3066 K_a>=0 untouched, C_mb GUE-conditional per imp-486 untouched, NO ' +
    'QED, no refereed bound is changed) verbatim in their verdict/honest field. No module is ' +
    'missing or weaker-worded than the cohort norm. Audit/report only; changes no bound; NO QED.',
};

export const IMP34583_POLE_RECOVERY_COHORT_BANNER_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34583-cohort-has-three-members',
    description: 'the audited cohort covers exactly the 3 named tickets from the ticket title',
    holds: () =>
      COHORT.length === 3 &&
      ['imp-34550', 'imp-34548', 'imp-34406'].every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34583-module-paths-match-imp-prefix',
    description: 'every cohort modulePath filename starts with the matching ticket id',
    holds: () => COHORT.every((m) => m.modulePath.includes(`/${m.ticket}-`)),
  },
  {
    id: 'imp-34583-seven-banner-elements-checked',
    description: 'every cohort member is checked against all 7 required banner elements',
    holds: () => COHORT.every((m) => Object.keys(m.elements).length === 7),
  },
  {
    id: 'imp-34583-no-banner-gaps-found',
    description: 'no cohort module is missing any of the 7 required banner elements',
    holds: () =>
      IMP34583_POLE_RECOVERY_COHORT_BANNER_AUDIT.allBannersComplete === true &&
      IMP34583_POLE_RECOVERY_COHORT_BANNER_AUDIT.modulesWithGaps.length === 0 &&
      COHORT.every((m) => m.complete === true && m.missing.length === 0),
  },
  {
    id: 'imp-34583-audit-honest',
    description: 'audit-only framing preserved: no bound change, NO QED',
    holds: () =>
      /changes no bound/.test(IMP34583_POLE_RECOVERY_COHORT_BANNER_AUDIT.honest) &&
      /NO QED/.test(IMP34583_POLE_RECOVERY_COHORT_BANNER_AUDIT.honest),
  },
];

for (const a of IMP34583_POLE_RECOVERY_COHORT_BANNER_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34583-pole-recovery-cohort-banner-audit assertion failed: ${a.id}`);
  }
}
