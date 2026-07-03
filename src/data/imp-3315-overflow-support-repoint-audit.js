/**
 * imp-3315: Overflow-support-length re-point audit -- RE-POINT / KEEP verdicts
 * for every in-repo appearance of the imp-3199 cell-invariant absolute
 * overflow-support measure frac*U ~1.2535, checking whether each site still
 * frames it as a genuine Phi-autocorrelation length to be derived / cross-
 * validated / explained, versus correctly citing the imp-3216 correction that
 * its upper endpoint tau_2~1.366 is the IEEE-754 kernel UNDERFLOW HORIZON
 * (not a genuine nu(tau)>mu(tau) down-crossing).
 *
 * Background:
 *   imp-3199-overflow-fraction-cell-sweep finding F3 measured frac*U ~1.2535
 *   +-0.001 as invariant across seven (a,U,NPHI) cells, framing it as a fixed
 *   absolute lag-length worth explaining. imp-3216-overflow-support-length-
 *   closed-form later found the upper endpoint of that support is exactly the
 *   double-precision underflow horizon of the truncated kernel (Phi's n=1
 *   term exp(-pi e^{4u}) drops below 2^-1074 at u~1.370), so frac*U ~1.2535
 *   is a MEASUREMENT ARTIFACT of finite arithmetic, not a structural
 *   Phi-autocorrelation length. Sites written before imp-3216 (or without
 *   awareness of it) risk pursuing a closed form / N-convergence / mechanism
 *   for an artifact rather than a genuine invariant.
 *
 * Audit scope: src/data/ modules and src/pages/ presenting frac*U ~1.2535 or
 * the ~0.209 overflow fraction, plus pending queue tickets whose title/
 * description still frames the ~1.2535 length as a target for derivation.
 * Mirrors the imp-3233 overflow-anchor-audit RE-POINT/KEEP pattern.
 */

export const imp3315OverflowSupportRepointAudit = Object.freeze({

  id: 'imp-3315',
  correction: 'imp-3216-overflow-support-length-closed-form.js',
  correctedQuantity: 'frac*U ~1.2535 (imp-3199 finding F3, cell-invariant absolute overflow-support length)',
  correctionSummary:
    'Upper endpoint tau_2~1.366 is the IEEE-754 kernel underflow horizon, not a ' +
    'genuine nu/mu down-crossing; the mathematically-correct overflow fraction ' +
    '(U-tau_1)/U -> 1 as U grows, not a fixed ~0.209 / ~1.2535 anchor.',

  sites: Object.freeze([

    {
      file: 'src/data/imp-3199-overflow-fraction-cell-sweep.js',
      appearance: 'Original F3 measurement: frac*U ~1.2535 +-0.001 cell-invariant across seven a/U/NPHI cells',
      verdict: 'KEEP',
      reason:
        'This IS the original raw measurement document, predating the imp-3216 ' +
        'underflow-horizon finding. It is authoritative as the historical snapshot ' +
        'and does not itself claim a genuine-invariant mechanism; the correction ' +
        'belongs downstream in imp-3216 and its consumers.',
    },

    {
      file: 'src/data/imp-3216-overflow-support-length-closed-form.js',
      appearance: 'The corrective document itself: identifies tau_2~1.366 as the kernel underflow horizon',
      verdict: 'KEEP',
      reason: 'This is the correction source; nothing to re-point against itself.',
    },

    {
      file: 'src/data/imp-3224-overflow-support-finer-N-crossval.js',
      appearance:
        '"RELATION TO imp-3216" section + CRITICAL honesty flag: the frac*U upper ' +
        'endpoint tau_2~1.366 is the underflow horizon, not a genuine crossing',
      verdict: 'KEEP',
      reason:
        'Already carries an explicit imp-3216/imp-3278 honesty flag stating the ' +
        'N-converged frac*U value is bounded by the underflow horizon and is not ' +
        'itself a genuine Phi-autocorrelation length. Already re-pointed.',
    },

    {
      file: 'src/data/imp-3312-underflow-horizon-lock.js',
      appearance: 'Build-assertion tripwire locking the imp-3216 two-tail underflow horizons (mu ~1.196, nu ~1.366)',
      verdict: 'KEEP',
      reason: 'This module exists specifically to protect the imp-3216 correction; already correctly framed.',
    },

    {
      file: 'src/pages/ClosureRoutesPage.jsx',
      lines: '~3870-3960',
      appearance:
        '"imp-3199: ~0.209 is the U=6 reading of a cell-invariant absolute lag-length ' +
        '~1.254" section, followed by an "HONEST-STATUS CORRECTION (imp-3216)" note',
      verdict: 'KEEP',
      reason:
        'The page already carries the imp-3216 honest-status correction directly ' +
        'beneath the imp-3199 ~1.254 presentation, labeling the historical numbers ' +
        'as double-precision snapshots. Already re-pointed.',
    },

    {
      queueTicket: 'imp-3239',
      appearance:
        'Title: "Derive/assess WHY the imp-3199 converged overflow-support length ' +
        'frac*U~1.2535 is invariant under shear weight a and kernel truncation NPHI"',
      verdict: 'RE-POINT',
      reason:
        'Still pending and frames the ~1.2535 length as a genuine quantity whose ' +
        'a/NPHI-invariance mechanism should be derived. Per imp-3216 the upper ' +
        'endpoint of that length is the kernel underflow horizon, which is itself ' +
        'a-invariant and NPHI-saturated for arithmetic reasons (the horizon is set ' +
        'by tau alone via exp(-pi e^{4u}), independent of a and already saturated at ' +
        'NPHI=6). A future execution of this ticket should first rule out that ' +
        'arithmetic explanation before pursuing a genuine structural mechanism.',
      appendedNote:
        'RE-POINT (imp-3216/imp-3315): tau_2~1.366 is the IEEE-754 kernel underflow ' +
        'horizon, not a genuine nu/mu crossover -- rule out the underflow-horizon ' +
        '(arithmetic, a-invariant and NPHI-saturated by construction) explanation ' +
        'before pursuing a structural a/NPHI-invariance mechanism.',
    },

    {
      queueTicket: 'imp-3258',
      appearance:
        'Title: "Assess whether the imp-3199 overflow-support measure frac*U has a ' +
        'weak genuine U-dependence ... or is pure finite-resolution noise around the ' +
        'cell-invariant ~1.2535"',
      verdict: 'RE-POINT',
      reason:
        'Still pending and treats the ~1.2535 cell-invariance as the reference ' +
        'baseline against which a small U-drift is judged genuine-vs-noise. Per ' +
        'imp-3216 the baseline itself is an underflow-horizon artifact, so the ' +
        'observed drift should first be checked against the underflow-horizon ' +
        'closed form (imp-3216 finding E2) rather than treated as a perturbation of ' +
        'a genuine Phi-autocorrelation length.',
      appendedNote:
        'RE-POINT (imp-3216/imp-3315): the ~1.2535 baseline itself is bounded by the ' +
        'IEEE-754 kernel underflow horizon (imp-3216), not a genuine Phi-autocorrelation ' +
        'length -- check the measured drift against the closed-form underflow-horizon ' +
        'dependence (imp-3216 finding E2) before treating it as genuine-vs-noise.',
    },

  ]),

  summary: Object.freeze({
    keepCount: 5,
    repointCount: 2,
    repointTickets: ['imp-3239', 'imp-3258'],
  }),

});
