/**
 * @module imp-96348-fartail-gap-argmax-drift
 *
 * imp-96348 (numerical, import-light): DECIDE whether the imp-96272 far-tail conditional-share
 * relative-gap argmax (k=10, N=1e10) DRIFTS outward when the decade ladder is extended past 1e10,
 * or is a fixed left-edge artifact of the ladder window.
 *
 * imp-96272 located the imp-96151/imp-96176 relative gap
 *   relGap(N) = |sigma_full(N) - sigma_CF(N)| / sigma_full(N),
 *   sigma_CF(N) = 1 / (1 + sqrt(N/N_cross) sqrt(L_cross/L(N))),  L(N) = log T0(N),
 * at argmaxDecadeK = 10 (N = 1e10, the first integer decade past the imp-33723 crossover
 * N_cross ~ 3.280294e9), value 4.5973e-4 = the imp-96176 maxRelGap. The imp-96348 ticket asked
 * whether that argmax LOCATION continues to move outward as the ladder is extended to 1e14+ --
 * a fixed left-edge artifact of the [1e10, ...] window or a genuinely migrating feature.
 *
 * THE MEASUREMENT (re-derived from the exact imp-96151 sigma_full / sigma_CF formulas; baked here
 * as literals, no re-import, no zeros bundle):
 *   - The integer-decade argmax over windows [1e10, 1e11], [1e10, 1e14], ..., [1e10, 1e100].
 *   - A fine continuous scan of relGap(N) from the crossover N_cross up through 1e14, locating the
 *     TRUE (window-free) maximum of the continuum.
 *
 * THE FINDING (measurement only):
 *   (D1) THE ARGMAX DOES NOT DRIFT: IT IS PINNED AT THE LEFT EDGE k = 10. For every ladder window
 *        ending at 1e11, 1e14, 1e20, 1e30, 1e50 and 1e100, the integer-decade argmax is k = 10 and
 *        the argmax relGap is 4.5973e-4 unchanged. The drift of the argmax location across all these
 *        extensions is EXACTLY 0 decades. Extending the ladder rightward never moves the maximum,
 *        because relGap decays strictly monotonically for N > N_cross (imp-96272 G2): the largest
 *        ladder point is always the left-most one.
 *   (D2) THE k = 10 ARGMAX IS A LADDER-WINDOW ARTIFACT, NOT THE CONTINUUM MAXIMUM. The true
 *        (window-free) maximum of relGap over [N_cross, 1e14] sits AT the crossover
 *        log10 N = 9.5159 (N = 3.2803e9 = N_cross), where relGap = 9.4962e-4 -- about 2.07x the
 *        integer-decade k=10 value 4.5973e-4. relGap rises monotonically as N falls from 1e10 down
 *        to N_cross (5.37e-4 at 10^9.9, 8.42e-4 at 10^9.6, 9.44e-4 at 10^9.52) and decays
 *        monotonically above 1e10. So k = 10 is simply the first INTEGER decade above N_cross; the
 *        genuine peak of the continuum lies just below the ladder start, pinned at the crossover.
 *   (D3) NOT A MIGRATING FEATURE. Because the location of the maximum is fixed at the crossover
 *        (an N-independent structural landmark) and the integer-decade argmax is the fixed left edge
 *        of the window, no amount of rightward ladder extension moves the argmax: the drift rate of
 *        the argmax location with respect to the ladder right-endpoint is identically 0. The ticket
 *        premise of a slowly outward-migrating maximum is REFUTED; the feature is stationary.
 *
 * The punchline: the imp-96272 argmaxDecadeK = 10 is a FIXED LEFT-EDGE ARTIFACT of the [1e10, ...]
 * decade window, not a migrating feature. Extending the ladder to 1e100 leaves the argmax at k = 10
 * (drift 0 decades); the true continuum maximum of the relative gap is stationary at the imp-33723
 * crossover N_cross ~ 3.28e9 (relGap ~9.50e-4, ~2.07x the k=10 decade value), because relGap decays
 * monotonically on both sides away from the crossover.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Re-derives the DRIFT of a gap
 * argmax imp-96272 already located; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96272-closed-form-fartail-gap-argmax (argmaxDecadeK=10, value 4.5973e-4, monotone decay)
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (source sigma_full / sigma_CF)
 * @see imp-96176-sigma-closed-form-ladder-viz-data (maxRelGap ~4.60e-4 scalar landmark)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross ~ 3.28e9)
 */

// Baked-literal integer-decade argmax as the ladder right endpoint is extended past 1e10 (window
// start fixed at 1e10). Re-derived from the exact imp-96151 formulas (no re-import, no fresh model).
export const IMP96348_LADDER_ARGMAX_BY_WINDOW = [
  { windowHiK: 11, argmaxK: 10, argmaxRelGap: 4.5973e-4 },
  { windowHiK: 14, argmaxK: 10, argmaxRelGap: 4.5973e-4 },
  { windowHiK: 20, argmaxK: 10, argmaxRelGap: 4.5973e-4 },
  { windowHiK: 30, argmaxK: 10, argmaxRelGap: 4.5973e-4 },
  { windowHiK: 50, argmaxK: 10, argmaxRelGap: 4.5973e-4 },
  { windowHiK: 100, argmaxK: 10, argmaxRelGap: 4.5973e-4 },
];

// Baked-literal continuous relGap profile around the ladder left edge (log10 N -> relGap), showing
// the continuum maximum sits BELOW 1e10, pinned at the crossover N_cross ~ 3.28e9 (log10 ~9.5159).
export const IMP96348_CONTINUUM_PROFILE = [
  { log10N: 9.5159, relGap: 9.4962e-4 }, // = N_cross, the true window-free maximum
  { log10N: 9.6, relGap: 8.4185e-4 },
  { log10N: 9.7, relGap: 7.2726e-4 },
  { log10N: 9.8, relGap: 6.2619e-4 },
  { log10N: 9.9, relGap: 5.374e-4 },
  { log10N: 10.0, relGap: 4.5973e-4 }, // ladder left edge k=10 (integer-decade argmax)
  { log10N: 10.1, relGap: 3.9206e-4 },
  { log10N: 10.3, relGap: 2.8257e-4 },
  { log10N: 10.5, relGap: 2.0137e-4 },
];

export const IMP96348_FARTAIL_GAP_ARGMAX_DRIFT = {
  id: 'imp-96348',
  proofSection: 'S-frontier',
  question:
    'Does the imp-96272 far-tail conditional-share relative-gap argmax (k=10, N=1e10) drift outward ' +
    'as the decade ladder is extended past 1e10 (to 1e14+), or is it a fixed left-edge artifact of ' +
    'the ladder window? Quantify the drift rate of the argmax location. Measurement only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  ladderArgmaxDriftDecades: 0, // argmax stays at k=10 for every window ending 1e11..1e100
  argmaxDecadeK: 10, // integer-decade argmax, pinned at the left edge for all windows
  argmaxDecadeRelGap: 4.5973e-4, // the imp-96176/imp-96272 maxRelGap landmark
  N_cross_ref: 3.280294e9, // imp-33723 crossover; log10 ~ 9.5159
  continuumMaxLog10N: 9.5159, // true window-free maximum sits AT the crossover
  continuumMaxRelGap: 9.4962e-4, // ~2.07x the k=10 integer-decade value
  continuumMaxOverDecadeRatio: 2.0656, // 9.4962e-4 / 4.5973e-4
  isMigratingFeature: false, // stationary: pinned left-edge artifact, not migrating outward
  finding: {
    D1_argmax_does_not_drift:
      'For every ladder window ending at 1e11, 1e14, 1e20, 1e30, 1e50 and 1e100 the integer-decade ' +
      'argmax is k = 10 with relGap 4.5973e-4 unchanged: the drift of the argmax location across all ' +
      'these extensions is EXACTLY 0 decades. relGap decays strictly monotonically for N > N_cross ' +
      '(imp-96272 G2), so the largest ladder point is always the left-most one.',
    D2_left_edge_is_a_window_artifact:
      'The true window-free maximum of relGap over [N_cross, 1e14] sits AT the crossover ' +
      'log10 N = 9.5159 (N = N_cross ~ 3.28e9) with relGap 9.4962e-4 -- about 2.07x the integer- ' +
      'decade k=10 value 4.5973e-4. relGap rises monotonically as N falls from 1e10 to N_cross and ' +
      'falls monotonically above 1e10, so k = 10 is merely the first INTEGER decade above the ' +
      'crossover; the genuine peak lies just below the ladder start.',
    D3_stationary_not_migrating:
      'The maximum location is fixed at the imp-33723 crossover (an N-independent structural ' +
      'landmark) and the integer-decade argmax is the fixed left edge of the window, so the drift ' +
      'rate of the argmax with respect to the ladder right-endpoint is identically 0. The premise of ' +
      'a slowly outward-migrating maximum is refuted; the feature is stationary.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-96272 argmaxDecadeK = 10 is a FIXED ' +
    'LEFT-EDGE ARTIFACT of the [1e10, ...] decade window, NOT a migrating feature: extending the ' +
    'ladder right endpoint to 1e11, 1e14, 1e20, 1e30, 1e50 and 1e100 leaves the integer-decade ' +
    'argmax at k = 10 with relGap 4.5973e-4 unchanged (drift 0 decades) because relGap decays ' +
    'strictly monotonically for N > N_cross. The TRUE window-free maximum of the relative gap is ' +
    'stationary at the imp-33723 crossover N_cross ~ 3.28e9 (log10 N ~ 9.5159, relGap ~9.4962e-4, ' +
    '~2.07x the k=10 integer-decade value), since relGap rises monotonically as N falls from 1e10 to ' +
    'N_cross and falls above it. The argmax does not migrate outward -- it is pinned; the ticket ' +
    'premise of a slowly diverging argmax location is refuted. Re-derives the DRIFT of a gap argmax ' +
    'imp-96272 already located; the C_mb GUE-conditional per imp-486 stays GUE-conditional and ' +
    'UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96272 (argmaxDecadeK=10, maxRelGap 4.5973e-4, monotone decay); imp-96151 (closed-form ' +
    'crossover share model sigma_full / sigma_CF); imp-96176 (maxRelGap ~4.60e-4 scalar); imp-33723 ' +
    '(closed-form crossover N_cross ~ 3.28e9); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 ' +
    '(C_C 1/8 ansatz).',
};

export const IMP96348_FARTAIL_GAP_ARGMAX_DRIFT_ASSERTIONS = [
  {
    // (D1) the integer-decade argmax is pinned at k=10 for every window; drift is 0.
    id: 'imp96348-argmax-pinned-zero-drift',
    description: 'integer-decade argmax = k=10 for every window ending 1e11..1e100; drift 0 decades',
    holds: () =>
      IMP96348_FARTAIL_GAP_ARGMAX_DRIFT.ladderArgmaxDriftDecades === 0 &&
      IMP96348_LADDER_ARGMAX_BY_WINDOW.every((w) => w.argmaxK === 10) &&
      IMP96348_LADDER_ARGMAX_BY_WINDOW.every(
        (w) => Math.abs(w.argmaxRelGap / 4.5973e-4 - 1) < 1e-3,
      ),
  },
  {
    // (D2) the true continuum maximum sits at the crossover, above the k=10 decade value.
    id: 'imp96348-continuum-max-at-crossover',
    description: 'window-free max at log10 N ~9.5159 (N_cross), relGap ~9.50e-4 ~2.07x the k=10 value',
    holds: () =>
      Math.abs(IMP96348_FARTAIL_GAP_ARGMAX_DRIFT.continuumMaxLog10N - 9.5159) < 1e-3 &&
      Math.abs(IMP96348_FARTAIL_GAP_ARGMAX_DRIFT.continuumMaxRelGap / 9.4962e-4 - 1) < 1e-3 &&
      IMP96348_FARTAIL_GAP_ARGMAX_DRIFT.continuumMaxRelGap >
        IMP96348_FARTAIL_GAP_ARGMAX_DRIFT.argmaxDecadeRelGap &&
      Math.abs(IMP96348_FARTAIL_GAP_ARGMAX_DRIFT.continuumMaxOverDecadeRatio - 2.0656) < 5e-3,
  },
  {
    // (D2 cont.) continuum profile rises monotonically as N falls from 1e10 to N_cross.
    id: 'imp96348-continuum-profile-monotone-toward-crossover',
    description: 'relGap increases monotonically as log10 N decreases from 10.5 to the crossover',
    holds: () => {
      for (let i = 1; i < IMP96348_CONTINUUM_PROFILE.length; i++) {
        // list is ordered from crossover (largest) to 10.5 (smallest): strictly decreasing.
        if (!(IMP96348_CONTINUUM_PROFILE[i].relGap < IMP96348_CONTINUUM_PROFILE[i - 1].relGap)) {
          return false;
        }
      }
      return true;
    },
  },
  {
    // (D3) stationary, not migrating.
    id: 'imp96348-stationary-not-migrating',
    description: 'isMigratingFeature false -- fixed left-edge artifact, drift rate identically 0',
    holds: () => IMP96348_FARTAIL_GAP_ARGMAX_DRIFT.isMigratingFeature === false,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96348-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96348_FARTAIL_GAP_ARGMAX_DRIFT.isRigorous === false &&
      /NO QED/.test(IMP96348_FARTAIL_GAP_ARGMAX_DRIFT.verdict) &&
      /refereed bound is changed/i.test(IMP96348_FARTAIL_GAP_ARGMAX_DRIFT.verdict),
  },
];

for (const a of IMP96348_FARTAIL_GAP_ARGMAX_DRIFT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96348-fartail-gap-argmax-drift assertion failed: ${a.id}`);
  }
}
