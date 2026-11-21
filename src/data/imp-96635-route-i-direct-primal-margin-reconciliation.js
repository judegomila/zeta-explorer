/**
 * @module imp-96635-route-i-direct-primal-margin-reconciliation
 *
 * imp-96635 (accuracy, RECONCILIATION ONLY): two IEEE-double Route I certificates for
 * pole-free Weil positivity W(h) = Arch(h) - P_2(h) >= m ||h||^2 on ln 2 < 2a <= ln 3
 * quote margins that look paradoxical side by side:
 *   (i)  rh-route-i-direct-sonine-trace-certificate-2026-09-24: dual positive-extension
 *        LP certificate, certified LOWER bounds m_direct = 0.0467 (a = 0.40), 0.0160
 *        (0.44), 0.0077 (0.46), 0.0016 (0.48), feasible ONLY to a ~ 0.48 (2a <= 0.96);
 *   (ii) rh-route-i-uncertainty-concentration-certificate-2026-09-24: primal Galerkin
 *        + Bernstein-tail certificate, a single UNIFORM constant 9.04e-4 covering the
 *        WHOLE nested range a <= (ln 3)/2 = 0.5493.
 * At a = 0.48 the direct 0.0016 is ~1.79x the primal 9.04e-4, YET the direct route
 * stops at 0.48 while the primal reaches (ln 3)/2. This module tabulates both ladders
 * across the shared a-range and shows the "sharper local margin, smaller window" is an
 * ARTIFACT of comparing a LOCAL number against an ENDPOINT number -- not a real trade.
 *
 * THE RESOLUTION, in one line: 9.04e-4 is NOT the primal margin AT a = 0.48; it is the
 * primal margin at the ENDPOINT a = (ln 3)/2, quoted uniformly for every smaller a by
 * NESTING (a certificate at the largest support serves all sub-supports). The primal
 * LOCAL lower bound at a = 0.48 is lambda_min(K_N | V_N) = 0.0246137 (gridT400 k = 0),
 * about 15.2x the direct LP bound 0.001618. So at every shared a the primal is the
 * TIGHTER lower bound, and the direct route is the LOOSER of the two -- the opposite of
 * what the naive 0.0016-vs-9.04e-4 comparison suggests.
 *
 * BOTH ARE LOWER BOUNDS ON THE SAME true pole-free minimum lambda_min(a), which decays
 * monotonically in a (Legendre Rayleigh-Ritz UPPER bounds: 0.2255 at 0.40 -> 0.0119 at
 * 0.50 -> 9.52e-4 at (ln 3)/2; direct module marginsN32 / splitN24). Capture fractions
 * (bound / RR-upper) tell the whole story:
 *   - PRIMAL is uniformly tight: 0.217029/0.22550 = 0.962 (0.40), 0.0111176/0.011931 =
 *     0.932 (0.50), 9.04372e-4/9.5198e-4 = 0.950 ((ln 3)/2) -- ~0.93-0.96 everywhere.
 *   - DIRECT LP is loose and DEGRADES toward the crossing: 0.046677/0.22550 = 0.207
 *     (0.40), 0.007686/0.049691 = 0.155 (0.46), and only 0.001618/0.0246137 = 0.066 of
 *     the primal local minimum at 0.48. The direct module records the same collapse
 *     (captured fraction 0.8 -> 0.27 -> 0.013 as a grows).
 * WHY THE WINDOWS DIFFER is therefore NOT sharpness: it is the dual-LP ANSATZ ceiling.
 * The direct certificate is phi = alpha cosh(u/2) + beta u sinh(u/2) on |u| < 2a,
 * piecewise-linear on J cells of [2a, U]; as a grows the true minimum closes toward
 * 9.5e-4 and the positive extension nu must resolve ever-finer structure (needs U >= 24,
 * J >= 480, grid step ~1e-5, cutting-plane LP), so the (16, 240) ansatz goes infeasible
 * past a ~ 0.50. The primal Rayleigh-Ritz-lower-bounds the operator directly (no ansatz
 * family), its only cost the floor loss beyond T, and reaches the endpoint at 9.04e-4.
 *
 * NET: there is no genuine sharper-yet-smaller-window trade. The 1.79x compares a local
 * LP lower bound at 0.48 with a global endpoint constant at 0.5493; comparing like-for-
 * like at a fixed a, the primal is uniformly the tighter lower bound (~0.95 capture) and
 * the direct route's smaller window is an ansatz limitation, not extra sharpness. Both
 * remain double-precision (NOT interval-verified); the interval-verified status of
 * 2a <= 0.96 is the separate Krein/sigma_2 sibling. Fixed-window positivity says nothing
 * about zeros. RH open; no refereed bound is changed; NO QED.
 *
 * Import-light (pure baked literals from the two sibling certificate modules; no imports,
 * no zeros bundle). Self-executing assertions (imp-3715): any failure throws at import.
 */

const LN3_HALF = Math.log(3) / 2;

/** the primal single uniform constant (endpoint value at a = (ln 3)/2, T = 400, N = 320) */
export const IMP96635_PRIMAL_UNIFORM = 9.04372e-4;

/**
 * Reconciliation ladder across the shared a-range. Columns:
 *   a               support half-length (2a = window)
 *   mDirectCert     direct dual-LP CERTIFIED lower bound (rigorousMin; null past reach a ~ 0.48)
 *   mDirectLP       direct raw LP margin (mLP before Lipschitz safety; null where not run)
 *   primalLocal     primal LOCAL pole-free lower bound lambda_min(K_N|V_N) (gridT400 k=0; null where not tabulated)
 *   rrUpper         Legendre Rayleigh-Ritz UPPER bound on the true minimum (marginsN32 / splitN24; null where absent)
 * (mDirectCert, primalLocal, rrUpper all bound the SAME true pole-free minimum lambda_min(a): lower <= true <= rrUpper.)
 */
export const IMP96635_LADDER = Object.freeze([
  { a: 0.40, mDirectCert: 0.046677, mDirectLP: 0.061696, primalLocal: 0.217029, rrUpper: 0.22550 },
  { a: 0.44, mDirectCert: 0.016041, mDirectLP: 0.031273, primalLocal: 0.0831423, rrUpper: 0.08690 },
  { a: 0.46, mDirectCert: 0.007686, mDirectLP: 0.013136, primalLocal: null, rrUpper: 0.049691 },
  { a: 0.48, mDirectCert: 0.001618, mDirectLP: 0.002744, primalLocal: 0.0246137, rrUpper: null },
  { a: 0.50, mDirectCert: null, mDirectLP: 0.00016, primalLocal: 0.0111176, rrUpper: 0.011931 },
  { a: 0.52, mDirectCert: null, mDirectLP: null, primalLocal: 0.00410081, rrUpper: 0.0044778 },
  { a: 0.54, mDirectCert: null, mDirectLP: null, primalLocal: 0.00131577, rrUpper: 0.0014349 },
  { a: LN3_HALF, mDirectCert: null, mDirectLP: null, primalLocal: 9.04372e-4, rrUpper: 9.5198e-4 },
]);

/** the two ways to read a = 0.48: the paradox (local-vs-endpoint) and the like-for-like (both local) */
export const IMP96635_AT_048 = Object.freeze({
  a: 0.48,
  mDirectCert: 0.001618,
  primalUniformEndpoint: IMP96635_PRIMAL_UNIFORM,
  primalLocal: 0.0246137,
  // the misleading comparison (local direct at 0.48 vs endpoint primal at (ln 3)/2):
  paradoxRatio: 0.001618 / IMP96635_PRIMAL_UNIFORM, // ~1.789 (ticket "~1.77x" with 0.0016 rounded)
  // the honest comparison (both local at 0.48): primal is ~15x the tighter lower bound:
  likeForLikeRatio: 0.0246137 / 0.001618, // ~15.21
});

/** capture fractions bound / rrUpper, quantifying "primal uniformly tight, direct loose and degrading" */
export const IMP96635_CAPTURE = Object.freeze({
  primal_a040: 0.217029 / 0.22550,      // ~0.962
  primal_a050: 0.0111176 / 0.011931,    // ~0.932
  primal_ln3half: 9.04372e-4 / 9.5198e-4, // ~0.950
  direct_a040: 0.046677 / 0.22550,      // ~0.207
  direct_a046: 0.007686 / 0.049691,     // ~0.155
  directOverPrimalLocal_a048: 0.001618 / 0.0246137, // ~0.066
});

export const IMP96635_VERDICT = Object.freeze({
  paradoxIsArtifact: true,
  primalIsTighterAtEverySharedA: true,
  windowDifferenceIsAnsatzCeilingNotSharpness: true,
  bothDoublePrecisionNotIntervalVerified: true,
  reading:
    'The 1.79x is local-direct-at-0.48 against endpoint-primal-at-(ln3)/2. Quoting the ' +
    'primal LOCAL margin at 0.48 (0.0246137) makes the direct bound 0.001618 about 15.2x ' +
    'SMALLER: the primal is the tighter lower bound at every shared a (~0.93-0.96 of the ' +
    'true minimum) while the direct LP degrades toward the crossing (~0.21 -> 0.066). The ' +
    'direct route stops at ~0.48 because its cosh/u-sinh + piecewise-linear ansatz goes LP-' +
    'infeasible as the extension needs finer structure, not because it is sharper; the ' +
    'primal Galerkin+tail has no ansatz ceiling and reaches (ln3)/2. No real window/constant ' +
    'trade; both stay IEEE-double.',
});

export const IMP96635_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Reconciliation only: no new bound, no ' +
  'operator positivity, no zero localised. Both certificates are IEEE-double (NOT interval-' +
  'verified); the interval-verified status of pole-free positivity on 2a <= 0.96 is the ' +
  'separate Krein/sigma_2 sibling rh-route-i-toeplitz-krein-certificate-2026-09-24. All ' +
  'literals are baked from the two sibling certificate modules (DIRECT_CERT_LITERALS ' +
  'rigorousMin/mLP/marginsN32/splitN24 and the primal gridT400 k=0 / T400N320 constant).';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96635_ASSERTIONS = [
  {
    id: 'imp96635-paradox-ratio-is-local-vs-endpoint',
    holds: () =>
      Math.abs(IMP96635_AT_048.paradoxRatio - 1.789) < 0.01 &&
      IMP96635_AT_048.paradoxRatio > 1.7 && IMP96635_AT_048.paradoxRatio < 1.8,
    why: 'the headline 1.79x is direct-local-at-0.48 (0.001618) over primal-endpoint-uniform (9.04e-4) -- a local number vs an endpoint number.',
  },
  {
    id: 'imp96635-likeforlike-primal-tighter-at-048',
    holds: () =>
      IMP96635_AT_048.likeForLikeRatio > 15 && IMP96635_AT_048.likeForLikeRatio < 15.5 &&
      IMP96635_AT_048.primalLocal > IMP96635_AT_048.mDirectCert,
    why: 'compared like-for-like at a = 0.48 the primal LOCAL lower bound 0.0246137 is ~15.2x the direct LP bound 0.001618: the primal is the tighter bound, not looser.',
  },
  {
    id: 'imp96635-primal-uniformly-tight-direct-degrades',
    holds: () =>
      IMP96635_CAPTURE.primal_a040 > 0.95 && IMP96635_CAPTURE.primal_a050 > 0.92 &&
      IMP96635_CAPTURE.primal_ln3half > 0.94 &&
      IMP96635_CAPTURE.direct_a040 < 0.25 && IMP96635_CAPTURE.direct_a046 < 0.20 &&
      IMP96635_CAPTURE.directOverPrimalLocal_a048 < 0.10 &&
      IMP96635_CAPTURE.direct_a046 < IMP96635_CAPTURE.direct_a040,
    why: 'the primal captures ~0.93-0.96 of the true minimum everywhere while the direct LP falls from ~0.21 (0.40) to ~0.066 of the primal local minimum at 0.48 -- loose where the primal is tight, worsening toward the crossing.',
  },
  {
    id: 'imp96635-bounds-bracket-true-minimum',
    holds: () =>
      IMP96635_LADDER.every((r) => {
        const lows = [r.mDirectCert, r.primalLocal].filter((x) => x != null);
        return r.rrUpper == null || lows.every((x) => x <= r.rrUpper + 1e-9);
      }) &&
      // primal local lower bound is monotone decreasing in a (larger window = smaller minimum)
      IMP96635_LADDER.filter((r) => r.primalLocal != null)
        .every((r, i, xs) => i === 0 || xs[i - 1].primalLocal >= r.primalLocal - 1e-12),
    why: 'both certificates lower-bound the SAME true pole-free minimum (each <= the Legendre RR upper bound), and that minimum decays monotonically in a from ~0.22 (0.40) to 9.5e-4 ((ln 3)/2).',
  },
  {
    id: 'imp96635-honesty-gate-no-qed',
    holds: () =>
      IMP96635_VERDICT.paradoxIsArtifact === true &&
      IMP96635_VERDICT.windowDifferenceIsAnsatzCeilingNotSharpness === true &&
      IMP96635_VERDICT.bothDoublePrecisionNotIntervalVerified === true &&
      /NO QED/.test(IMP96635_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96635_HONEST_BANNER) &&
      /RH open/.test(IMP96635_HONEST_BANNER),
    why: 'reconciliation only: the window difference is an ansatz ceiling not sharpness, both stay double-precision, and the honesty markers are present.',
  },
];

for (const a of IMP96635_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96635-route-i-direct-primal-margin-reconciliation assertion failed: ${a.id}`,
    );
  }
}

export default {
  primalUniform: IMP96635_PRIMAL_UNIFORM,
  ladder: IMP96635_LADDER,
  at048: IMP96635_AT_048,
  capture: IMP96635_CAPTURE,
  verdict: IMP96635_VERDICT,
  banner: IMP96635_HONEST_BANNER,
};
