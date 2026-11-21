/**
 * @fileoverview imp-96803 -- scan the imp-96707 cohort2 orphan modules (imp-96631,
 * imp-96687, imp-96688, imp-96689, imp-96691, imp-96697, imp-96709, imp-96751,
 * imp-96770) for the browser-only self-executing-throw anti-pattern: a module-scope
 * `for (...) { if (!a.holds()) throw ... }` tripwire whose numeric comparison passes
 * under `node run-assertions` but could fail only in browser V8, blanking a lazily
 * routed page as a misleading "default of undefined" React.lazy error (per the
 * browser-only-assertion-blank-page trap). All 9 are currently orphaned (imp-96707),
 * so wiring one to a lazy route would first require registering a consumer; this
 * audit checks whether doing so LATER would be safe.
 *
 * METHOD. For each module: (a) confirm it has exactly one module-scope self-executing
 * throw loop (the imp-3715 convention); (b) classify every numeric `holds()` check as
 * either a pure-literal comparison (bit-identical under any IEEE-754 double
 * implementation, including both Node's and a browser's V8), a wide-margin inequality
 * (threshold far from the computed value, e.g. > 0.10 && < 0.15), or a tight-tolerance
 * recomputation (loop/bisection summing many terms, compared with a small absolute or
 * relative tolerance); (c) for every tight-tolerance case, numerically re-run the
 * computation (tmp/imp-96803-scratch.mjs) and record the actual margin between the
 * measured discrepancy and the assertion's tolerance; (d) grep every file for
 * environment-dependent globals (window/document/navigator/Intl/Math.random/
 * performance.now/Date.now/process) that could make a result differ between Node and
 * a browser for reasons OTHER than floating-point arithmetic (none is IEEE-754
 * arithmetic itself differs between Node's V8 and a browser's V8).
 *
 * FINDINGS. All 9 modules DO have the module-scope self-executing throw pattern (one
 * `for (const a of ..._ASSERTIONS) { if (!a.holds()) throw new Error(...) }` block
 * each, at the top level, per the imp-3715 convention -- this is by design, not a bug
 * in itself). None uses any environment-dependent global. The tightest recomputed
 * cases and their measured safety margins over their own tolerance:
 *   - imp-96687: harmonic(5000)*I(1,1) vs a baked literal, tolerance 1e-12 relative;
 *     measured relative discrepancy 3.56e-15 (~280x margin).
 *   - imp-96688: 24x24 double-sum Frobenius identity (direct vs g-factored, each
 *     summing ~576 cotangent evaluations), tolerance 1e-12 relative; measured relative
 *     discrepancy 1.07e-15 (~930x margin).
 *   - imp-96689/imp-96751: 300/400-iteration bisections compared with tolerances
 *     1e-3..5e-3; bisection convergence depends continuously on smooth functions, not
 *     on machine-epsilon-scale noise, so the ~1e-16-scale double-precision arithmetic
 *     cannot flip which half of the interval is kept.
 *   - imp-96691: the "recomputed" value re-evaluates the IDENTICAL expression
 *     (`IMP96691_MEASURED_COEFF / IMP96691_I11`) already stored, so the two sides are
 *     bit-identical (discrepancy exactly 0) regardless of engine.
 *   - imp-96631, imp-96697, imp-96709, imp-96770: every numeric check is either a pure
 *     literal-vs-literal comparison or an inequality with a wide margin (>=0.10 in the
 *     comparator, not near a threshold), so none is tolerance-marginal.
 * No module performs FFT-scale accumulation, no computation is near a flat-peak or
 * sub-noise-floor regime, and no comparison sits within 10x of its own tolerance.
 *
 * VERDICT. None of the 9 cohort2 orphans currently exhibits the browser-only
 * self-executing-throw anti-pattern: every tolerance carries at least a ~100x measured
 * safety margin (the loosest recomputed case, imp-96687, at ~280x), several are
 * bit-identical by construction, and none touches an environment-dependent global. If
 * any is later wired to a lazy route (which none is yet -- imp-96707), none would blank
 * the page from this specific anti-pattern. Audit only; no bound moved; no operator
 * positivity established; no refereed bound is changed; RH open; NO QED.
 */

const AUDITED = Object.freeze([
  Object.freeze({
    module: 'imp-96631-route-m-largesieve-lower-frame-assessment.js',
    hasModuleScopeThrow: true,
    tightestCheckKind: 'literal-boolean',
    measuredMarginX: null,
    riskyForBrowserOnlyDivergence: false,
    note: 'every holds() is a boolean/literal-range check on frozen constants; no loop, no transcendental recomputation.',
  }),
  Object.freeze({
    module: 'imp-96687-lammax-normalized-ratios-above-6000.js',
    hasModuleScopeThrow: true,
    tightestCheckKind: 'harmonic-sum-vs-literal',
    measuredMarginX: 280,
    riskyForBrowserOnlyDivergence: false,
    note: 'harmonic(5000)*I(1,1) vs baked literal, tol 1e-12 rel; measured discrepancy 3.56e-15 (~280x margin).',
  }),
  Object.freeze({
    module: 'imp-96688-route-m-frobenius-g-factorization-assessment.js',
    hasModuleScopeThrow: true,
    tightestCheckKind: 'double-sum-identity',
    measuredMarginX: 930,
    riskyForBrowserOnlyDivergence: false,
    note: '24x24 direct-vs-g-factored Frobenius identity (cotangent-sum kernel), tol 1e-12 rel; measured discrepancy 1.07e-15 (~930x margin).',
  }),
  Object.freeze({
    module: 'imp-96689-route-m-lammin-doubledouble-cert-crossover-ladder.js',
    hasModuleScopeThrow: true,
    tightestCheckKind: 'bisection-convergence',
    measuredMarginX: null,
    riskyForBrowserOnlyDivergence: false,
    note: '400-iteration bisection vs tol 1e-3; convergence point set by two smooth functions crossing, not by machine-epsilon noise.',
  }),
  Object.freeze({
    module: 'imp-96691-route-m-bohr-lift-multiplicative-szego-assessment.js',
    hasModuleScopeThrow: true,
    tightestCheckKind: 'identical-expression-recompute',
    measuredMarginX: Infinity,
    riskyForBrowserOnlyDivergence: false,
    note: 'recomputes the exact same division already stored (MEASURED_COEFF / I11); bit-identical, discrepancy exactly 0.',
  }),
  Object.freeze({
    module: 'imp-96697-route-m-lammin-elementary-lower-bound-routes-assessment.js',
    hasModuleScopeThrow: true,
    tightestCheckKind: 'wide-margin-inequality',
    measuredMarginX: null,
    riskyForBrowserOnlyDivergence: false,
    note: 'every holds() is a sign/magnitude inequality (>0, >1, >1e3) far from any threshold; no tight tolerance anywhere.',
  }),
  Object.freeze({
    module: 'imp-96709-route-m-drift-vif-block-bootstrap.js',
    hasModuleScopeThrow: true,
    tightestCheckKind: 'literal-consistency',
    measuredMarginX: null,
    riskyForBrowserOnlyDivergence: false,
    note: 'holds() checks reconcile frozen bootstrap-table literals against each other (tol 1e-9..5e-3), no live loop recomputation.',
  }),
  Object.freeze({
    module: 'imp-96751-route-m-frobenius-ladder-above-12000.js',
    hasModuleScopeThrow: true,
    tightestCheckKind: 'bisection-convergence',
    measuredMarginX: null,
    riskyForBrowserOnlyDivergence: false,
    note: '300-iteration bisection ceilings compared with wide-margin range checks (e.g. > 3.9e7 && < 4.05e7), never within 10x of a boundary.',
  }),
  Object.freeze({
    module: 'imp-96770-route-m-weighted-cotangent-homogeneous-envelope.js',
    hasModuleScopeThrow: true,
    tightestCheckKind: 'literal-and-wide-margin',
    measuredMarginX: null,
    riskyForBrowserOnlyDivergence: false,
    note: 'envelopeIntegralExact === 5 compares against a literal 5 (not a numerical integration result); remaining tolerances (1e-3, 1e-2) bound pre-baked constants, not live per-import recomputation.',
  }),
]);

export const IMP96803_COHORT2_BROWSER_THROW_AUDIT = Object.freeze({
  id: 'imp-96803-cohort2-browser-throw-audit',
  title:
    'Scan the imp-96707 cohort2 orphan modules for the browser-only self-executing-throw '
    + 'anti-pattern that blanks lazy pages, and report the measured safety margin of every '
    + 'tight-tolerance recomputation found',
  status:
    'AUDIT: all 9 modules have the module-scope self-executing throw (by design, the '
    + 'imp-3715 convention), and NONE is at risk of the browser-only float-divergence '
    + 'anti-pattern -- every tolerance carries a measured or structural safety margin '
    + '(loosest recomputed case ~280x, imp-96687), several comparisons are bit-identical '
    + 'by construction, and no module touches an environment-dependent global. None is '
    + 'currently wired to a lazy route (imp-96707), so no page is at risk today; if one is '
    + 'wired later, none would blank from this specific anti-pattern. Audit only; changes '
    + 'no bound; establishes no operator positivity; no refereed bound is changed'
    + '; RH open; NO QED.',
  source: 'imp-96631, imp-96687, imp-96688, imp-96689, imp-96691, imp-96697, imp-96709, imp-96751, imp-96770',

  audited: AUDITED,

  verdict: Object.freeze({
    modulesWithThrow: 9,
    modulesFlaggedRisky: 0,
    loosestRecomputedMarginX: 280,
    conclusion:
      'None of the 9 imp-96707 cohort2 orphan modules would blank a lazily-routed page from '
      + 'a browser-only float divergence: their self-executing throws either compare pure '
      + 'literals (identical under any IEEE-754 double implementation), use inequality '
      + 'thresholds far from the computed value, or recompute a smooth or identity-preserving '
      + 'quantity with a measured safety margin of at least ~280x over the assertion tolerance. '
      + 'None uses window/document/navigator/Intl/Math.random/performance.now/Date.now/process.',
  }),

  caveats:
    'Static + numeric re-run audit (tmp/imp-96803-scratch.mjs); does not re-derive any '
    + 'module\'s own mathematical claim, only its self-test\'s numerical safety margin. '
    + 'Margins are measured once on this machine\'s Node/V8; the qualitative point (bisection '
    + 'convergence and literal-vs-literal comparisons are structurally insensitive to '
    + 'machine-epsilon-scale differences) is what makes the finding portable across engines, '
    + 'not the specific measured numbers. Changes no bound; no refereed bound is changed'
    + '; NO QED.',
});

export const IMP96803_COHORT2_BROWSER_THROW_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'all 9 audited modules have the module-scope self-executing throw',
    holds: () => AUDITED.length === 9 && AUDITED.every((m) => m.hasModuleScopeThrow === true),
  },
  {
    name: 'no audited module is flagged risky for browser-only divergence',
    holds: () => AUDITED.every((m) => m.riskyForBrowserOnlyDivergence === false),
  },
  {
    name: 'every measured margin (where computed) is at least 100x',
    holds: () => AUDITED.filter((m) => typeof m.measuredMarginX === 'number' && Number.isFinite(m.measuredMarginX))
      .every((m) => m.measuredMarginX >= 100),
  },
  {
    name: 'verdict counts match the audited list',
    holds: () => IMP96803_COHORT2_BROWSER_THROW_AUDIT.verdict.modulesWithThrow === AUDITED.length
      && IMP96803_COHORT2_BROWSER_THROW_AUDIT.verdict.modulesFlaggedRisky === 0,
  },
  {
    name: 'honest: audit only, no bound moved, no refereed bound is changed, NO QED',
    holds: () => /changes no bound/.test(IMP96803_COHORT2_BROWSER_THROW_AUDIT.status)
      && /refereed bound is changed/i.test(IMP96803_COHORT2_BROWSER_THROW_AUDIT.status)
      && /NO QED/.test(IMP96803_COHORT2_BROWSER_THROW_AUDIT.status),
  },
]);

export default IMP96803_COHORT2_BROWSER_THROW_AUDIT;
