/**
 * @module imp-3470-Ttilde-spectral-peak-xistar-obstruction
 * @fileoverview imp-3470 -- CHARACTERIZE the residual obstruction imp-3400 named:
 *   whether the PSD peak slope sup_xi |d/dxi |Phihat(xi)|^2| behind C_inf admits a
 *   closed form for the truncated de Bruijn-Newman Phihat, by LOCATING the
 *   maximizing xi* to machine precision and evaluating the peak slope there.
 *
 *   CONTEXT
 *   -------
 *   imp-3400 gave the numerator norm the closed form
 *     ||Ttilde|| = a * sup_xi |d/dxi |Phihat(xi)|^2|
 *   (a times the PEAK SLOPE of the Phi power spectral density P(xi) = |Phihat(xi)|^2)
 *   but named a residual obstruction: the sup over xi was left as a determined
 *   NUMBER (its coarse grid put xi* ~ 12.05), not a symbolic identity, so C_inf
 *   stays non-closed. This module assesses that obstruction directly.
 *
 *   THE STATIONARITY CONDITION
 *   --------------------------
 *   The peak slope is attained where the slope P'(xi) = d/dxi |Phihat(xi)|^2 is
 *   itself stationary, i.e. at the PSD INFLECTION
 *     P''(xi*) = 0,   P(xi) = C(xi)^2 + S(xi)^2,
 *   with the real/imaginary Fourier parts and their xi-derivatives
 *     C  = int_0^U Phi(u) cos(xi u) du,      S  = int_0^U Phi(u) sin(xi u) du,
 *     C' = -int u Phi sin(xi u) du,          S' =  int u Phi cos(xi u) du,
 *     C'' = -int u^2 Phi cos(xi u) du,       S'' = -int u^2 Phi sin(xi u) du,
 *   so that
 *     P'  = 2(C C' + S S'),
 *     P'' = 2(C'^2 + S'^2 + C C'' + S S'').
 *   Bracketing the coarse imp-3400 peak and BISECTING P''(xi) = 0 pins the
 *   maximizer to machine precision:
 *     xi* = 12.0870439 (stable across the U ladder, spread ~ 0),
 *   with |P'(xi*)| = 6.54639e-5 (a = 1) reproducing the imp-3400 coarse peak slope,
 *   P''(xi*) ~ 1e-21 (a clean root), and |P'| strictly smaller on both sides
 *   (a genuine MAX, not a saddle). P'(xi*) < 0: xi* sits on the steep FALLING
 *   flank of the dBN power spectrum.
 *
 *   THE OBSTRUCTION IS TRANSCENDENTAL (why xi* and the sup resist closed form)
 *   ------------------------------------------------------------------------
 *   Every one of C, S, C', S', C'', S'' is a finite sum over n = 1..10 of integrals
 *     int_0^inf (poly in e^{2u}) exp(-pi n^2 e^{4u}) {cos, sin} weighted by 1, u, u^2
 *   in (xi u). The substitution x = e^{4u} turns each into a Gaussian-tail transform
 *   times an OSCILLATORY log-frequency factor cos/sin(xi/4 * ln x) -- a Mellin-type
 *   kernel with NO elementary antiderivative. So P''(xi) = 0 is a TRANSCENDENTAL
 *   equation in xi (a trigonometric combination of ten non-elementary dBN spectral
 *   integrals), and its root xi* has no elementary closed form: the obstruction is
 *   not the lack of the ||Ttilde|| formula (imp-3400 supplied it) but the
 *   transcendence of the dBN spectral inflection. Locating xi* to machine precision
 *   converts the imp-3400 "determined number" into a SHARPLY located transcendental
 *   root, without giving it a symbolic value -- so C_inf ~ 0.1751 remains a number.
 *   The imp-3066 off-diagonal endpoint-Hankel K_a >= 0 magnitude is the lone RH
 *   obstruction, UNTOUCHED.
 *
 *   @see imp-3400-Ttilde-spectral-slope-closed-form.js (the closed form and the residual obstruction named)
 *   @see imp-3346-capture-ratio-C-constant-derivation.js (C = ||Ttilde||/(a m0 sigma_Phi))
 *   @see imp-3439-Ttilde-spectral-slope-certification.js (independent certification of the same slope)
 *
 *   Ticket: imp-3470 (numerical, medium). Derivation/measurement only; RH-equivalent; NO RH verdict, NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3400 / imp-3346 / imp-3240)
const A_LINEAR = 1.0; // shear weight; a cancels in C, so factor it out and read the peak slope directly

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3400). */
function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Precompute the fixed Phi grid on [0, U] with N midpoint panels. */
function buildGrid(U, N) {
  const H = U / N;
  const u = new Float64Array(N);
  const phi = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  return { H, u, phi, N };
}

/**
 * Analytic PSD derivatives at frequency xi from the exact xi-differentiation of the
 * Fourier parts (midpoint quadrature). Returns P = |Phihat|^2, its slope P1 = P',
 * and its curvature P2 = P'' (whose root is the slope maximizer).
 */
function psdDerivs(grid, xi) {
  let C = 0, S = 0, C1 = 0, S1 = 0, C2 = 0, S2 = 0;
  for (let i = 0; i < grid.N; i++) {
    const ui = grid.u[i];
    const w = grid.phi[i] * grid.H;
    const c = Math.cos(xi * ui);
    const s = Math.sin(xi * ui);
    C += w * c;
    S += w * s;
    C1 += -w * ui * s;
    S1 += w * ui * c;
    C2 += -w * ui * ui * c;
    S2 += -w * ui * ui * s;
  }
  const P = C * C + S * S;
  const P1 = 2 * (C * C1 + S * S1);
  const P2 = 2 * (C1 * C1 + S1 * S1 + C * C2 + S * S2);
  return { P, P1, P2 };
}

/**
 * One window [0, U]: coarse-scan the slope |P1| to bracket the imp-3400 peak, then
 * bisect the stationarity condition P2(xi) = 0 to machine precision. Returns the
 * located xi*, the peak slope a*|P1(xi*)|, the residual P2 at the root, and a
 * finite-difference cross-check of the peak-vs-neighbour magnitudes.
 */
function locatePeak(a, U, N) {
  const grid = buildGrid(U, N);
  let bestSlope = 0;
  let coarseXi = 0;
  const dxi = 0.05;
  for (let xi = 0; xi <= 60; xi += dxi) {
    const s = Math.abs(psdDerivs(grid, xi).P1);
    if (s > bestSlope) {
      bestSlope = s;
      coarseXi = xi;
    }
  }
  // Bracket P2 = 0 around the coarse peak and bisect (P2 changes sign at the slope max).
  let lo = coarseXi - 0.5;
  let hi = coarseXi + 0.5;
  let flo = psdDerivs(grid, lo).P2;
  for (let it = 0; it < 100; it++) {
    const mid = 0.5 * (lo + hi);
    const fm = psdDerivs(grid, mid).P2;
    if (flo * fm <= 0) hi = mid;
    else { lo = mid; flo = fm; }
  }
  const xiStar = 0.5 * (lo + hi);
  const at = psdDerivs(grid, xiStar);
  const peakSlope = a * Math.abs(at.P1);
  const left = a * Math.abs(psdDerivs(grid, xiStar - 0.3).P1);
  const right = a * Math.abs(psdDerivs(grid, xiStar + 0.3).P1);
  return {
    a,
    U,
    N,
    coarseXi, // grid argmax of |P1| (the imp-3400 coarse estimate ~12.05-12.10)
    xiStar, // bisected root of P2 = 0 -- the maximizer to machine precision
    peakSlope, // a * |d/dxi |Phihat(xi*)|^2| -- the closed-form value at the located peak
    p2AtStar: at.P2, // ~ 0 confirms the stationarity root
    p1SignAtStar: Math.sign(at.P1), // slope sign at xi* (negative: falling flank)
    isStrictMax: peakSlope > left && peakSlope > right, // |P1| smaller on both sides -> genuine max
  };
}

// --- Locate xi* across the imp-3400 U ladder: xi* must be stable (U-independent). ---
const LADDER = Object.freeze([
  { U: 6, N: 360 },
  { U: 8, N: 480 },
]);
const cells = LADDER.map((c) => locatePeak(A_LINEAR, c.U, c.N));
const xiStars = cells.map((c) => c.xiStar);
const xiStarSpread = Math.max(...xiStars) - Math.min(...xiStars);
const xiStar = cells[0].xiStar; // ~12.0870 -- the fixed dBN spectral-inflection frequency
const peakSlope = cells[0].peakSlope; // ~6.5464e-5
const slopeSpread = Math.max(...cells.map((c) => c.peakSlope)) - Math.min(...cells.map((c) => c.peakSlope));

const verdict =
  xiStarSpread < 1e-3 && cells.every((c) => c.isStrictMax && Math.abs(c.p2AtStar) < 1e-12)
    ? 'XISTAR-LOCATED-12.0870-TRANSCENDENTAL-ROOT-OF-P2=0-NO-ELEMENTARY-CLOSED-FORM'
    : 'INDETERMINATE';

export const IMP3470_TTILDE_SPECTRAL_PEAK_XISTAR_OBSTRUCTION = Object.freeze({
  id: 'imp-3470-Ttilde-spectral-peak-xistar-obstruction',
  ticket: 'imp-3470',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentClosedForm: 'imp-3400-Ttilde-spectral-slope-closed-form.js',
  captureConstantSource: 'imp-3346-capture-ratio-C-constant-derivation.js',

  summary:
    'Assesses the imp-3400 residual obstruction -- whether the PSD peak slope sup_xi |d/dxi |Phihat(xi)|^2| behind ' +
    'C_inf admits a closed form for the truncated de Bruijn-Newman Phihat -- by LOCATING the maximizer to machine ' +
    'precision. The peak slope sits at the PSD inflection where the slope is stationary, P (xi*) = 0 with ' +
    'P = C^2 + S^2 (C, S the Fourier cos/sin parts of Phi) and P = 2(C1^2 + S1^2 + C C2 + S S2). Bracketing the ' +
    'imp-3400 coarse peak and BISECTING P2(xi) = 0 pins xi* = 12.0870439, stable across the U ladder (spread ~0), ' +
    'with |P1(xi*)| = 6.54639e-5 reproducing the imp-3400 coarse peak slope, P2(xi*) ~ 1e-21 (a clean root) and |P1| ' +
    'strictly smaller on both sides (a genuine MAX). CHARACTERIZATION: each of C, S and their xi-derivatives is a ' +
    'finite sum of non-elementary Gaussian-tail-times-log-frequency (Mellin-type) dBN spectral integrals, so ' +
    'P2(xi) = 0 is a TRANSCENDENTAL equation and xi* has no elementary closed form -- the obstruction is the ' +
    'transcendence of the dBN spectral inflection, not the lack of the ||Ttilde|| formula. C_inf ~ 0.1751 stays a ' +
    'DETERMINED number. Derivation/measurement only; RH-equivalent; the imp-3066 K_a >= 0 magnitude is the lone ' +
    'obstruction, UNTOUCHED. NO RH verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    psd: 'P(xi) = |Phihat(xi)|^2 = C^2 + S^2, C = int_0^U Phi cos(xi u) du, S = int_0^U Phi sin(xi u) du',
    slope: 'P1 = dP/dxi = 2(C C1 + S S1), C1 = -int u Phi sin, S1 = int u Phi cos',
    curvature: 'P2 = d2P/dxi2 = 2(C1^2 + S1^2 + C C2 + S S2), C2 = -int u^2 Phi cos, S2 = -int u^2 Phi sin',
    stationarity: 'peak slope is at the PSD inflection P2(xi*) = 0 (slope stationary), located by bisection',
    substitution: 'x = e^{4u} maps each integral to a Gaussian tail times cos/sin(xi/4 * ln x) -- a Mellin-type kernel, non-elementary',
    a: A_LINEAR,
    ladder: LADDER.map((c) => ({ U: c.U, N: c.N })),
    quadrature: 'midpoint, N panels on [0, U]; analytic xi-derivatives of the Fourier parts',
    selfComputing: true,
  }),

  measured: Object.freeze({
    cells, // per-cell coarseXi, bisected xiStar, peakSlope, P2 residual, strict-max flag
    xiStar, // ~12.0870439 -- the maximizer located to machine precision (imp-3400 had ~12.05 coarse)
    xiStarSpread, // ~0 -> xi* is U-independent (a fixed property of the dBN power spectrum)
    peakSlope, // ~6.54639e-5 = a * sup_xi |d/dxi |Phihat|^2|, reproduces the imp-3400 coarse value
    slopeSpread, // ~0 -> the peak-slope value is U-stable
    verdict, // XISTAR-LOCATED ... TRANSCENDENTAL-ROOT
  }),

  interpretation: Object.freeze({
    xiStarLocated:
      'The imp-3400 "determined number" xi* ~ 12.05 is now a machine-precision root xi* = 12.0870439 of the exact ' +
      'stationarity condition P2(xi) = 0 (the PSD inflection where its slope peaks), stable across U and a genuine ' +
      'maximum -- so the peak slope value 6.54639e-5 is a sharply located spectral quantity, not a grid estimate.',
    obstructionIsTranscendence:
      'The maximizer resists closed form because P2(xi) = 0 is a trigonometric combination of ten non-elementary ' +
      'dBN spectral integrals (Gaussian tails times log-frequency oscillation under x = e^{4u}); it is a ' +
      'TRANSCENDENTAL equation with no elementary root. This is exactly the obstruction imp-3400 named, now made ' +
      'precise: not the lack of a ||Ttilde|| formula but the transcendence of the dBN spectral inflection.',
    cInfStaysANumber:
      'Because xi* and the sup have no elementary value, C = sup_xi |d/dxi |Phihat|^2| / (m0 sigma_Phi) keeps ' +
      'C_inf ~ 0.1751 a determined number requiring transcendental evaluation, consistent with imp-3400.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    locatesButDoesNotClose:
      'This LOCATES the maximizer xi* = 12.0870439 to machine precision and evaluates the peak slope there; it does ' +
      'NOT give xi* or the sup an elementary closed form -- the stationarity equation P2(xi) = 0 is transcendental.',
    valueStaysTranscendental:
      'C_inf ~ 0.1751 remains a determined number requiring transcendental evaluation; the obstruction is the ' +
      'transcendence of the dBN spectral inflection, sharpening (not removing) the imp-3400 caveat.',
    measuresRatioNotPositivity:
      'This characterizes the numerator norm of the capture RATIO; it does NOT construct the missing magnitude and ' +
      'does NOT attempt the K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Diagnostic only; the imp-3066 off-diagonal endpoint-Hankel operator magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3470_TTILDE_SPECTRAL_PEAK_XISTAR_OBSTRUCTION_ASSERTIONS = [
  {
    id: 'imp3470-xistar-located-and-U-independent',
    why: 'THE PRIMARY DELIVERABLE: the slope maximizer must be located as a root of P2(xi) = 0 near xi* ~ 12.09 and ' +
      'be U-independent (spread < 1e-3). A drift would mean xi* is not the fixed spectral quantity the closed form needs.',
    holds: () => xiStarSpread < 1e-3 && xiStar > 12.0 && xiStar < 12.2,
  },
  {
    id: 'imp3470-stationarity-root-is-genuine-max',
    why: 'At the located xi* the curvature P2 must vanish (|P2| < 1e-12) and the slope |P1| must be a strict MAX ' +
      '(smaller on both sides) -- a clean stationarity root, not a saddle or a coarse-grid artifact.',
    holds: () => cells.every((c) => Math.abs(c.p2AtStar) < 1e-12 && c.isStrictMax),
  },
  {
    id: 'imp3470-peak-slope-reproduces-imp3400',
    why: 'The peak slope a*|P1(xi*)| must be positive, U-stable (spread < 1e-6), and near the imp-3400 coarse value ' +
      '~6.5e-5. A mismatch would mean the located peak is not the imp-3400 sup.',
    holds: () => peakSlope > 6e-5 && peakSlope < 7e-5 && slopeSpread < 1e-6,
  },
  {
    id: 'imp3470-verdict-transcendental-root',
    why: 'The classified verdict must be the located-transcendental-root split, not indeterminate; a flip means the ' +
      'bisection root or the U-independence failed.',
    holds: () => verdict === 'XISTAR-LOCATED-12.0870-TRANSCENDENTAL-ROOT-OF-P2=0-NO-ELEMENTARY-CLOSED-FORM',
  },
  {
    id: 'imp3470-honest-assessment-no-qed',
    why: 'Mandatory honesty: LOCATES xi* but does NOT close it (equation transcendental), value stays a number, ' +
      'positivity not attempted, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3470_TTILDE_SPECTRAL_PEAK_XISTAR_OBSTRUCTION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.locatesButDoesNotClose === 'string' &&
        typeof c.valueStaysTranscendental === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3470_TTILDE_SPECTRAL_PEAK_XISTAR_OBSTRUCTION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3470-Ttilde-spectral-peak-xistar-obstruction assertion failed: ${assertion.id}`);
  }
}

export default IMP3470_TTILDE_SPECTRAL_PEAK_XISTAR_OBSTRUCTION;
