/**
 * imp-826: Cross-verification of the Route A monotonicity-closure composition.
 *
 * The ticket originally requested cross-verification of a single module
 *   src/math/route-a-monotonicity-closure.js
 * that was supposed to tie together the B1 slope bound, the B2 intercept
 * bound, and the D-monotone analytic closure. HONEST-PARTIAL FINDING:
 * that monolithic file does not exist in the repository. The composition
 * is instead distributed across THREE already-present modules landed by
 * the predecessor cross-verifies imp-821/822/823:
 *
 *   D-monotone   (imp-463)  src/math/d-monotone-analytic-proof.js
 *   B1 slope     (imp-457)  src/data/b1-slope-conditional-upper-bound.js
 *   B2 intercept (imp-458)  src/data/b2-intercept-analytic-bound.js
 *
 * This module cross-verifies the DISTRIBUTED composition after the fixes
 * from imp-821/822/823. It does NOT create the missing monolithic file;
 * that would exceed the honest-partial scope of a single ticket run. The
 * missing file is recorded below as an explicit, non-blocking sub-gap so
 * that a future aggregator ticket can pick it up without re-discovering
 * the gap from scratch.
 *
 * Cross-verified invariants (C1..C5)
 * ----------------------------------
 *   (C1) id stability:
 *        D_MONOTONE_ANALYTIC_PROOF.id  === "imp-463",
 *        B1_CONDITIONAL_BOUND.id       === "imp-457",
 *        B2_INTERCEPT_BOUND.id         === "imp-458".
 *        Any drift breaks citation chains in route-a-argmin-closure.js
 *        (imp-456) and lambda-N1e6-final-assembly.js (imp-452).
 *
 *   (C2) D-monotone closure feeds B1:
 *        B1_CONDITIONAL_BOUND.closedConditions must literally contain
 *        both "skp-imp457-D-monotone" and "imp-463" so that the chain
 *        "D-monotone analytically closed -> B1 now conditional on NoSwap
 *        only" stays documented. If the citation string is rewritten,
 *        this tripwire fires before the chain silently breaks.
 *
 *   (C3) B1 status stays in the allowed vocabulary:
 *        B1_CONDITIONAL_BOUND.status must be one of
 *        {analytically-closed, numerically-closed, conditional-closed}.
 *        Any other value signals a regression in D-monotone or NoSwap,
 *        or a hardcoded override bypassing the conditional ternary.
 *
 *   (C4) B2 intercept bound is a positive finite number:
 *        B2_INTERCEPT_BOUND.bound.value must be finite and strictly
 *        positive (empirically about 0.0094). A null or non-positive
 *        value means either the N_max row is missing or a computational
 *        regression; both invalidate the intercept leg of Route A.
 *
 *   (C5) Composition never claims more than its weakest link:
 *        If D-monotone is not analytically-closed, B1 must not claim
 *        analytically-closed either. Guards against a future edit that
 *        unpins B1.status from D_MONOTONE_ANALYTIC_PROOF.status.
 *
 * Residual sub-gap named by imp-826
 * ---------------------------------
 *   ROUTE_A_MONOTONICITY_MONOLITHIC_FILE_MISSING:
 *   No single module src/math/route-a-monotonicity-closure.js exists.
 *   Status: open (non-blocking). The distributed composition above is
 *   already cross-verified by C1..C5. A future aggregator module would
 *   not change mathematical content; it would be purely organizational.
 *
 * SYNTAX NOTE: avoid the star-slash sequence anywhere in JSDoc text; it
 * closes the comment. Use forms like dg_{k*}/dtau in comments, not
 * dg_k/dt with a trailing slash.
 */

import { D_MONOTONE_ANALYTIC_PROOF } from './d-monotone-analytic-proof.js';
import { B1_CONDITIONAL_BOUND }      from '../data/b1-slope-conditional-upper-bound.js';
import { B2_INTERCEPT_BOUND }        from '../data/b2-intercept-analytic-bound.js';

const DISTRIBUTED_COMPOSITION = [
  {
    role:     'D-monotone',
    impId:    'imp-463',
    file:     'src/math/d-monotone-analytic-proof.js',
    supplies: 'D(tau) >= D(0) on [0, tau_c] under NoSwap (analytically closed).',
  },
  {
    role:     'B1 slope bound',
    impId:    'imp-457',
    file:     'src/data/b1-slope-conditional-upper-bound.js',
    supplies:
      'b(N) = N * tau_c(N) <= b_lin(N) <= B1_SLOPE_CEILING, ' +
      'conditional on NoSwap (D-monotone no longer a separate sub-gap).',
  },
  {
    role:     'B2 intercept bound',
    impId:    'imp-458',
    file:     'src/data/b2-intercept-analytic-bound.js',
    supplies:
      'a := lim inf_{N -> inf} |t_c(N)| <= A_UPPER_BOUND, ' +
      'conditional on the monotonicity conjecture M.',
  },
];

const MONOLITHIC_FILE_EXPECTED = 'src/math/route-a-monotonicity-closure.js';

export const ROUTE_A_MONOTONICITY_CROSSVERIFY = {
  id:    'imp-826',
  title: 'Cross-verify the distributed Route A monotonicity-closure composition',

  monolithicFileExpected: MONOLITHIC_FILE_EXPECTED,
  monolithicFilePresent:  false,

  distributedComposition: DISTRIBUTED_COMPOSITION,

  residualSubGap: {
    id:     'ROUTE_A_MONOTONICITY_MONOLITHIC_FILE_MISSING',
    title:  MONOLITHIC_FILE_EXPECTED + ' does not exist as a single module',
    status: 'open',
    blocker: false,
    note:
      'The composition is distributed across three modules (see ' +
      'distributedComposition). The distributed form is cross-verified ' +
      'by assertions C1..C5 below. A future aggregator module would not ' +
      'change mathematical content; it would be purely organizational.',
  },

  verdict:
    'imp-826 delivers PARTIAL closure via distributed cross-verification. ' +
    'The three composing modules (imp-457, imp-458, imp-463) pass their ' +
    'own build-time assertions and expose records whose id, status, and ' +
    'citation strings satisfy C1..C5 here. The monolithic assembly file ' +
    'named by the ticket does not exist; its absence is recorded as a ' +
    'non-blocking sub-gap. Downstream consumers (route-a-argmin-closure.js, ' +
    'lambda-N1e6-final-assembly.js, lambda-zero-attack.js) read directly ' +
    'from the distributed records, so no caller is affected.',

  snapshot: {
    dMonotoneStatus: D_MONOTONE_ANALYTIC_PROOF.status,
    b1Status:        B1_CONDITIONAL_BOUND.status,
    b2Status:        B2_INTERCEPT_BOUND.status,
    b2BoundValue:    (B2_INTERCEPT_BOUND.bound && B2_INTERCEPT_BOUND.bound.value) || null,
  },
};

// --- Cross-verify assertions (ready to run; self-invoke at module load) ----

export const ROUTE_A_MONOTONICITY_CROSSVERIFY_ASSERTIONS = [
  {
    id: 'imp826-C1-id-stability',
    holds: () =>
      D_MONOTONE_ANALYTIC_PROOF.id === 'imp-463' &&
      B1_CONDITIONAL_BOUND.id      === 'imp-457' &&
      B2_INTERCEPT_BOUND.id        === 'imp-458',
    why:
      'C1: the three composing modules must retain ids imp-463, imp-457, ' +
      'imp-458. Id drift strands citation chains in route-a-argmin-closure.js ' +
      'and lambda-N1e6-final-assembly.js.',
  },
  {
    id: 'imp826-C2-d-monotone-feeds-b1',
    holds: () => {
      const hay = (B1_CONDITIONAL_BOUND.closedConditions || []).join(' | ');
      return hay.indexOf('skp-imp457-D-monotone') !== -1 &&
             hay.indexOf('imp-463')               !== -1;
    },
    why:
      'C2: B1.closedConditions must literally reference the sub-gap id ' +
      '"skp-imp457-D-monotone" and its closing ticket "imp-463". If the ' +
      'citation text is rewritten, the D-monotone -> B1 chain is silently ' +
      'broken and this tripwire catches it.',
  },
  {
    id: 'imp826-C3-b1-status-in-allowed-vocabulary',
    holds: () => {
      const s = B1_CONDITIONAL_BOUND.status;
      return s === 'analytically-closed' ||
             s === 'numerically-closed'  ||
             s === 'conditional-closed';
    },
    why:
      'C3: B1.status must be one of the three expected strings. Any other ' +
      'value signals a regression in D-monotone or NoSwap, or a hardcoded ' +
      'override bypassing the conditional ternary in b1.',
  },
  {
    id: 'imp826-C4-b2-bound-positive-finite',
    holds: () => {
      const v = B2_INTERCEPT_BOUND.bound && B2_INTERCEPT_BOUND.bound.value;
      return typeof v === 'number' && Number.isFinite(v) && v > 0;
    },
    why:
      'C4: B2.bound.value must be a positive finite number (empirically ' +
      'around 0.0094). A null or non-positive value invalidates the ' +
      'intercept leg of Route A.',
  },
  {
    id: 'imp826-C5-no-unwarranted-upgrade',
    holds: () => {
      if (B1_CONDITIONAL_BOUND.status === 'analytically-closed' &&
          D_MONOTONE_ANALYTIC_PROOF.status !== 'analytically-closed') {
        return false;
      }
      return true;
    },
    why:
      'C5: the composition must never claim strength beyond its weakest ' +
      'link. If D-monotone regresses, B1 must not retain analytically-closed.',
  },
  {
    id: 'imp826-monolithic-file-gap-still-named',
    holds: () =>
      ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.status === 'open' &&
      ROUTE_A_MONOTONICITY_CROSSVERIFY.monolithicFilePresent === false,
    why:
      'SCOPE TRIPWIRE: imp-826 is a partial closure; the missing monolithic ' +
      'file is recorded as a non-blocking sub-gap. If a future aggregator ' +
      'module is added, flip monolithicFilePresent to true and close the ' +
      'sub-gap in the same commit to keep the chain honest.',
  },
];

// Self-invoke at module load (d-monotone-analytic-proof.js pattern) so that
// any downstream consumer importing this record surfaces chain breakage at
// build time rather than silently.
for (const a of ROUTE_A_MONOTONICITY_CROSSVERIFY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      'ROUTE_A_MONOTONICITY_CROSSVERIFY assertion failed: ' + a.id + ' -- ' + a.why,
    );
  }
}
