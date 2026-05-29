// @module imp-1299-symbolic-regression-survey
// imp-1299 -- Symbolic-regression / auto-conjecture SURVEY over existing
//   frozen empirical data. The ticket asks: apply symbolic-regression-style
//   search to our 60+ empirical files looking for unknown closed-form
//   structural identities, and surface any clean candidate as a NEW
//   conjecture for HUMAN verification.
//
// We do NOT add a PySR/Eureqa dependency (no new packages allowed). Instead
// this module runs a small, deterministic, dependency-free symbolic-fit pass
// at module-load over THREE named targets, reading the source data LIVE from
// the existing frozen data modules (so the survey can never silently drift
// from the underlying empirical rows it claims to analyse):
//
//   (a) imp-1238 3-point correlation -- the systematic ~0.85 plateau offset
//       (empirical / GUE ratio at points where the GUE prediction R_3 ~ 1).
//   (b) imp-1240 Volterra V_{a,Phi} operator-norm scaling vs (a, U).
//   (c) imp-1243 per-plateau ghost-margin sequence (margin_optimistic = t_hi).
//
// METHOD (per target)
// -------------------
//   - Fit the simplest model the data supports (constant; log-log power law;
//     discrete-value enumeration) by ordinary least squares / sample moments.
//   - For a fitted CONSTANT, compare against a small fixed dictionary of
//     simple closed forms and report the nearest by relative error. A match
//     is reported as a CANDIDATE only, never as a confirmed identity.
//   - For a POWER LAW, report the fitted exponent; an exponent that lands on
//     a clean integer/half-integer is the kind of structural signal worth a
//     human look.
//
// HEADLINE FINDINGS
// -----------------
//   (a) Plateau offset fits a CONSTANT ~0.860 (sd ~0.054 over 11 plateau
//       points). Nearest simple forms are 6/7 = 0.8571 (rel err 0.36%) and
//       sqrt(3)/2 = 0.8660 (rel err 0.67%). BOTH sit well inside one sample
//       sd of the fit AND of each other, so the data CANNOT distinguish them.
//       Verdict: candidate-within-noise -- consistent with the imp-1238
//       bin-convention-artifact reading, NOT a confirmed structural identity.
//   (b) ||V_{a,Phi}|| is a CLEAN power law in a with exponent 1.0001 (~exactly
//       1) at every swept U. This is the genuine clean signal of the survey:
//       it is the small-a linearization sinh(a*dt) ~ a*dt made quantitative
//       (already noted qualitatively in imp-1240). The proportionality
//       kappa(U) = ||V||/a plateaus at ~3.72e-4 for small U then decays --
//       the U-decay is the imp-1240 midpoint-discretization artifact, NOT a
//       structural law, so only the exponent-1 finding is reported as clean.
//   (c) Ghost-margin sequence takes only 3 distinct values across 9 plateaus
//       (a discrete OLS-bracket structure: {2e-4, 1e-3, 5e-4}), so NO smooth
//       closed-form identity exists. Honest negative result.
//
// HONEST SCOPE
// ------------
//   - This is AUTO-CONJECTURE: a candidate-surfacing survey, not a proof and
//     not human-verified. Every candidate closed form REQUIRES human
//     verification before it may be treated as a conjecture.
//   - A small-dictionary closed-form match within ~1% is ROUTINELY a
//     numerical coincidence (the rationals/surds with small denominators are
//     dense enough that almost any constant near 0.86 lands within 1% of
//     one). The only finding here with structural backing is the exponent-1
//     power law in (b), which has a known analytic origin (sinh linearization).
//   - The survey reads frozen empirical rows; it does NOT re-run any of the
//     underlying heavy computations and inherits every caveat of imp-1238,
//     imp-1240 and imp-1243 (bin convention; truncation / discretization;
//     OLS-bracket / PT-2021 conditionality).
//
// SYNTAX SAFETY: line comments only; no JSDoc asterisk-slash; no apostrophes
// inside single-quoted strings.
//
// @see src/data/imp-1238-3point-correlation-extended.js (target a source)
// @see src/data/imp-1240-volterra-norm-pilot.js          (target b source)
// @see src/data/imp-1243-imp1147-ghost-margin-audit.js   (target c source)

import { IMP_1238_3POINT_CORRELATION } from './imp-1238-3point-correlation-extended.js';
import { IMP1240_VOLTERRA_NORM_PILOT } from './imp-1240-volterra-norm-pilot.js';
import { IMP_1243_GHOST_MARGIN_AUDIT } from './imp-1243-imp1147-ghost-margin-audit.js';

const GENERATED_AT = '2026-05-29T06:30:00Z';

// ── dependency-free fit helpers ───────────────────────────────────────────

function mean(arr) {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function sampleStdDev(arr) {
  const m = mean(arr);
  const v = arr.reduce((s, x) => s + (x - m) * (x - m), 0) / arr.length;
  return Math.sqrt(v);
}

// OLS slope of y vs x (used for log-log power-law exponent).
function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  return num / den;
}

// Round-trip a value to a fixed precision for stable frozen reporting.
function round(v, p) {
  const f = Math.pow(10, p);
  return Math.round(v * f) / f;
}

// ── Target A: imp-1238 3-point plateau offset (constant fit) ──────────────

const PLATEAU_GUE_THRESHOLD = 0.99; // points where GUE R_3 ~ 1 (plateau)
const A_PLATEAU_ROWS = IMP_1238_3POINT_CORRELATION.grid.filter(
  (r) => r.gueR3 >= PLATEAU_GUE_THRESHOLD,
);
const A_PLATEAU_RATIOS = A_PLATEAU_ROWS.map((r) => r.empiricalRatio);
const A_OFFSET_FIT = mean(A_PLATEAU_RATIOS);
const A_OFFSET_SD = sampleStdDev(A_PLATEAU_RATIOS);

// Small fixed dictionary of simple closed forms near the fitted constant.
const A_DICTIONARY = [
  { form: '6/7', value: 6 / 7 },
  { form: 'sqrt(3)/2', value: Math.sqrt(3) / 2 },
  { form: '27/pi^3', value: 27 / (Math.PI * Math.PI * Math.PI) },
  { form: 'e^(-1/6)', value: Math.exp(-1 / 6) },
];
const A_CANDIDATES = A_DICTIONARY
  .map((c) => ({
    form: c.form,
    value: round(c.value, 6),
    relErr: round(Math.abs(c.value - A_OFFSET_FIT) / A_OFFSET_FIT, 5),
    withinOneSd: Math.abs(c.value - A_OFFSET_FIT) <= A_OFFSET_SD,
  }))
  .sort((x, y) => x.relErr - y.relErr);
const A_BEST = A_CANDIDATES[0];

const TARGET_A = Object.freeze({
  id: 'target-a-3point-plateau-offset',
  source: 'imp-1238',
  description:
    'Constant fit to the empirical/GUE ratio at plateau points (gueR3 >= ' +
    PLATEAU_GUE_THRESHOLD + ') in the imp-1238 25-point R_3 grid.',
  model: 'constant',
  nPoints: A_PLATEAU_ROWS.length,
  fittedConstant: round(A_OFFSET_FIT, 6),
  sampleStdDev: round(A_OFFSET_SD, 6),
  candidates: Object.freeze(A_CANDIDATES.map((c) => Object.freeze(c))),
  bestCandidate: Object.freeze(A_BEST),
  verdict: 'candidate-within-noise',
  conjectureStatus: 'NOT-CONFIRMED-residual-is-noise-not-identity',
  note:
    'Best closed-form match is ' + A_BEST.form + ' (rel err ' + A_BEST.relErr +
    '). The fitted sample sd (~0.054) exceeds the gap between the top two ' +
    'candidates, so the data cannot select one closed form over the other. ' +
    'imp-1257 independently attributes this residual to sampling-noise / ' +
    'finite-height (a bin-integration variant left it unmoved), so the ~0.86 ' +
    'offset is an artifact, NOT a structural identity.',
});

// ── Target B: imp-1240 Volterra norm power law in a ───────────────────────

const B_ROWS = IMP1240_VOLTERRA_NORM_PILOT.rows;
const B_BY_U = new Map();
for (const r of B_ROWS) {
  if (!B_BY_U.has(r.U)) B_BY_U.set(r.U, []);
  B_BY_U.get(r.U).push(r);
}
const B_PER_U = Array.from(B_BY_U.entries())
  .map(([U, arr]) => {
    const xs = arr.map((r) => Math.log(r.a));
    const ys = arr.map((r) => Math.log(r.norm));
    const slope = olsSlope(xs, ys);
    const kappa = mean(arr.map((r) => r.norm / r.a));
    return Object.freeze({ U, exponentInA: round(slope, 6), kappa: +kappa.toExponential(5) });
  })
  .sort((a, b) => a.U - b.U);
const B_MEAN_EXPONENT = mean(B_PER_U.map((r) => r.exponentInA));
// Small-U kappa plateau (U <= 2), before the imp-1240 discretization decay.
const B_KAPPA_SMALL_U = mean(B_PER_U.filter((r) => r.U <= 2).map((r) => r.kappa));

const TARGET_B = Object.freeze({
  id: 'target-b-volterra-norm-scaling',
  source: 'imp-1240',
  description:
    'Log-log power-law fit of ||V_{a,Phi}|| vs a at each swept U over the ' +
    'imp-1240 5x5 (U, a) pilot grid.',
  model: 'power-law ||V|| = kappa(U) * a^p',
  perU: Object.freeze(B_PER_U),
  meanExponentInA: round(B_MEAN_EXPONENT, 6),
  kappaSmallU: +B_KAPPA_SMALL_U.toExponential(5),
  verdict: 'clean-linear-exponent-1',
  conjectureStatus: 'STRUCTURALLY-BACKED-small-a-sinh-linearization',
  note:
    'Exponent in a is ' + round(B_MEAN_EXPONENT, 6) + ' (~exactly 1) at every ' +
    'U. This is the small-a linearization sinh(a*dt) ~ a*dt made quantitative ' +
    '-- a clean, analytically-explained identity, NOT a surprise. kappa(U) ' +
    'decays with U (imp-1240 midpoint-discretization artifact), so kappa is ' +
    'NOT reported as a structural law.',
});

// ── Target C: imp-1243 ghost-margin sequence (discrete enumeration) ───────

const C_MARGINS = IMP_1243_GHOST_MARGIN_AUDIT.perPlateauRows.map((r) => r.margin_optimistic);
const C_DISTINCT = Array.from(new Set(C_MARGINS)).sort((a, b) => a - b);

const TARGET_C = Object.freeze({
  id: 'target-c-ghost-margin-sequence',
  source: 'imp-1243',
  description:
    'Search for a smooth closed-form law in the per-plateau ghost-margin ' +
    'sequence (margin_optimistic = t_hi) across the 9 imp-1136 plateaus.',
  model: 'discrete-value-enumeration',
  nPlateaus: C_MARGINS.length,
  distinctValues: Object.freeze(C_DISTINCT),
  nDistinct: C_DISTINCT.length,
  verdict: 'no-clean-identity-discrete-brackets',
  conjectureStatus: 'NEGATIVE-RESULT-no-smooth-law',
  note:
    'The sequence takes only ' + C_DISTINCT.length + ' distinct values ' +
    '(the OLS bracket levels), so it is a discrete bracket structure rather ' +
    'than a sampling of any smooth function. No closed-form identity to ' +
    'surface; honest negative result.',
});

// ── Survey payload ────────────────────────────────────────────────────────

const TARGETS = Object.freeze([TARGET_A, TARGET_B, TARGET_C]);
const N_CLEAN_IDENTITIES = TARGETS.filter(
  (t) => t.conjectureStatus.indexOf('STRUCTURALLY-BACKED') === 0,
).length;

export const IMP_1299_SYMBOLIC_REGRESSION_SURVEY = Object.freeze({
  id: 'imp-1299-symbolic-regression-survey',
  ticket: 'imp-1299',
  generatedAt: GENERATED_AT,

  summary:
    'Dependency-free symbolic-fit survey over 3 frozen empirical targets ' +
    '(imp-1238 plateau offset, imp-1240 Volterra norm scaling, imp-1243 ' +
    'ghost-margin sequence). One clean structurally-backed identity surfaced ' +
    '(||V_{a,Phi}|| ~ a^1, the sinh linearization); one candidate-within-noise ' +
    '(plateau offset ~0.86, likely bin-convention artifact); one negative ' +
    'result (ghost-margin is a discrete 3-value bracket sequence).',

  method: Object.freeze({
    approach:
      'In-process deterministic fits (constant / log-log power law / discrete ' +
      'enumeration); NO new dependency. Source rows read LIVE from the frozen ' +
      'imp-1238 / imp-1240 / imp-1243 data modules.',
    closedFormDictionary: '{6/7, sqrt(3)/2, 27/pi^3, e^(-1/6)} for the plateau-offset constant',
    matchPolicy:
      'A nearest closed form is reported as a CANDIDATE only. A match is ' +
      'treated as structural ONLY if it has an independent analytic origin ' +
      '(as in target b) -- otherwise it is presumed a numerical coincidence.',
  }),

  targets: TARGETS,
  nTargets: TARGETS.length,
  nCleanStructuralIdentities: N_CLEAN_IDENTITIES,

  verdict: 'one-clean-identity-one-candidate-one-negative',

  honestScope: Object.freeze({
    isProof: false,
    isAutoConjecture: true,
    requiresHumanVerification: true,
    readsFrozenDataOnly: true,
    smallDictionaryCoincidenceCaveat:
      'Simple rationals/surds near 0.86 are dense enough that an ~1% match is ' +
      'routine and NOT evidence of a structural identity. Only target b has ' +
      'an independent analytic explanation.',
    inheritedCaveats:
      'Inherits all caveats of the source files: imp-1238 bin convention, ' +
      'imp-1240 truncation/discretization, imp-1243 OLS-bracket / PT-2021 ' +
      'conditionality. This survey re-runs none of those heavy computations.',
  }),

  references: Object.freeze({
    target_a: 'src/data/imp-1238-3point-correlation-extended.js',
    target_b: 'src/data/imp-1240-volterra-norm-pilot.js',
    target_c: 'src/data/imp-1243-imp1147-ghost-margin-audit.js',
    symbolicRegressionBackground:
      'Schmidt & Lipson 2009 (distilling free-form natural laws from data); ' +
      'Cranmer et al. 2020 (PySR / symbolic regression) -- referenced as the ' +
      'methodological inspiration, NOT used as a dependency.',
  }),
});

// ── Build-time tripwires (6 required) ─────────────────────────────────────

export const IMP_1299_SYMBOLIC_REGRESSION_SURVEY_ASSERTIONS = [
  {
    id: 'imp1299-survey-covers-exactly-three-targets',
    why:
      'The ticket names exactly 3 targets (a: imp-1238 plateau offset, ' +
      'b: imp-1240 Volterra norm scaling, c: imp-1217/imp-1243 ghost margin). ' +
      'Dropping or adding a target means the survey no longer matches its spec.',
    holds: () => {
      const t = IMP_1299_SYMBOLIC_REGRESSION_SURVEY.targets;
      return t.length === 3 &&
        t[0].source === 'imp-1238' &&
        t[1].source === 'imp-1240' &&
        t[2].source === 'imp-1243';
    },
  },
  {
    id: 'imp1299-target-b-exponent-is-one',
    why:
      'The single clean structural finding is that ||V_{a,Phi}|| scales as ' +
      'a^1 (the small-a sinh linearization). The fitted exponent must land ' +
      'within 0.01 of 1.0 at every U; a drift would either break the live ' +
      'read of imp-1240 or contradict the headline identity.',
    holds: () => {
      const b = IMP_1299_SYMBOLIC_REGRESSION_SURVEY.targets[1];
      return Math.abs(b.meanExponentInA - 1) < 0.01 &&
        b.perU.every((r) => Math.abs(r.exponentInA - 1) < 0.01);
    },
  },
  {
    id: 'imp1299-target-a-offset-and-best-candidate',
    why:
      'Target a must fit a constant in the documented plateau band [0.80, ' +
      '0.92] and its nearest closed form must match within 1% (else the ' +
      '~0.85 offset claim or the candidate dictionary has drifted). The ' +
      'survey must still classify it as NOT-CONFIRMED to stay honest.',
    holds: () => {
      const a = IMP_1299_SYMBOLIC_REGRESSION_SURVEY.targets[0];
      return a.fittedConstant >= 0.8 && a.fittedConstant <= 0.92 &&
        a.bestCandidate.relErr < 0.01 &&
        a.conjectureStatus.indexOf('NOT-CONFIRMED') === 0;
    },
  },
  {
    id: 'imp1299-target-c-is-negative-result',
    why:
      'The ghost-margin sequence is a discrete OLS-bracket structure (<= 3 ' +
      'distinct values across 9 plateaus). The survey must report a negative ' +
      'result here rather than inventing a spurious smooth law.',
    holds: () => {
      const c = IMP_1299_SYMBOLIC_REGRESSION_SURVEY.targets[2];
      return c.nPlateaus === 9 &&
        c.nDistinct <= 3 &&
        c.verdict === 'no-clean-identity-discrete-brackets';
    },
  },
  {
    id: 'imp1299-honest-scope-auto-conjecture-not-proof',
    why:
      'This is auto-conjecture, not a proof. honestScope must flag ' +
      'isProof=false, isAutoConjecture=true, requiresHumanVerification=true ' +
      'so no candidate is mistaken for a confirmed result.',
    holds: () => {
      const h = IMP_1299_SYMBOLIC_REGRESSION_SURVEY.honestScope;
      return h.isProof === false &&
        h.isAutoConjecture === true &&
        h.requiresHumanVerification === true;
    },
  },
  {
    id: 'imp1299-exactly-one-clean-structural-identity',
    why:
      'Across the 3 targets exactly ONE (target b) has independent analytic ' +
      'backing and may be labelled STRUCTURALLY-BACKED. If this count drifts ' +
      'the survey is either over-claiming the artifact/negative targets or ' +
      'has lost the clean exponent-1 finding.',
    holds: () => IMP_1299_SYMBOLIC_REGRESSION_SURVEY.nCleanStructuralIdentities === 1,
  },
];
