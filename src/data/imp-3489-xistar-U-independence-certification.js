/**
 * @module imp-3489-xistar-U-independence-certification
 * @fileoverview imp-3489 -- CERTIFY the imp-3470 claim that the PSD peak-slope
 *   maximizer xi* = 12.0870439 is U-INDEPENDENT, by recomputing xi* as a root of
 *   the stationarity condition P2(xi) = 0 on the FULL imp-3240 U-grid and
 *   measuring the drift of the located maximizer across U.
 *
 *   CONTEXT
 *   -------
 *   imp-3470 located the slope maximizer xi* = 12.0870439 (the root of the PSD
 *   curvature P2(xi) = 0, i.e. the frequency where the power-spectrum slope
 *   |d/dxi |Phihat(xi)|^2| peaks) and described it as "stable across the U ladder
 *   (spread ~0)". But imp-3470 only used the short ladder {U = 6, U = 8}. This
 *   module tests the invariance DIRECTLY on the full imp-3240 capture-ratio grid
 *   U_GRID = {4, 6, 8, 10}: it re-solves P2(xi) = 0 at each U, tabulates xi*(U),
 *   and MEASURES the maximum drift max_U xi*(U) - min_U xi*(U).
 *
 *   METHOD (reuses the imp-3470 P2 assembly verbatim)
 *   -------------------------------------------------
 *   The de Bruijn-Newman kernel Phi (n = 1..10), the midpoint Fourier parts
 *     C  = int_0^U Phi cos(xi u) du,   S  = int_0^U Phi sin(xi u) du,
 *   their analytic xi-derivatives C1, S1, C2, S2, and the PSD slope/curvature
 *     P1 = 2(C C1 + S S1),   P2 = 2(C1^2 + S1^2 + C C2 + S S2)
 *   are computed exactly as in imp-3470. For each U we coarse-scan |P1| to bracket
 *   the peak, then bisect P2(xi) = 0 to machine precision; N = 60*U panels keeps
 *   the panel width fixed at the imp-3470 resolution (U=6 -> 360, U=8 -> 480).
 *
 *   FINDING
 *   -------
 *   Across all four windows the located maximizer is xi* = 12.08704387272693 --
 *   BIT-IDENTICAL, so the drift max_U xi* - min_U xi* is EXACTLY 0 (and the peak
 *   slope a*|P1(xi*)| = 6.546395e-5 is likewise bit-identical), reproducing the
 *   imp-3470 value 12.0870439 to 2.7e-8. This exact invariance is not a
 *   coincidence: Phi(u) has COMPACT EFFECTIVE SUPPORT -- its Gaussian tail
 *   exp(-pi n^2 e^{4u}) underflows to 0 by u ~ 1.4, well inside the shortest
 *   U = 4 window -- so every window U >= 4 already captures the entire nonzero Phi,
 *   and the fixed panel width H = U/N = 1/60 (N = 60*U) places IDENTICAL midpoint
 *   quadrature nodes in every window. The nodes beyond the shortest window fall
 *   where Phi = 0 and contribute nothing, so the Fourier integrals C, S and their
 *   derivatives -- hence P2(xi) and its root xi* -- are the same floating-point
 *   number for every U. This is the STRONGEST form of the imp-3470 "spread ~0"
 *   claim: xi* is not merely U-stable but exactly U-invariant on the imp-3240
 *   grid, a fixed property of the truncated dBN power spectrum, not an artifact of
 *   the imp-3470 ladder choice -- sharpening the imp-3400 caveat that the sup
 *   behind C_inf is a determined transcendental NUMBER. Certification/measurement
 *   only; RH-equivalent; the imp-3066 off-diagonal endpoint-Hankel K_a >= 0
 *   magnitude is the lone obstruction, UNTOUCHED. NO RH verdict, NO QED.
 *   Platt-Trudgian Lambda <= 0.2 stays SOTA.
 *
 *   @see imp-3470-Ttilde-spectral-peak-xistar-obstruction.js (located xi* on the short {6,8} ladder)
 *   @see imp-3240-mupass-capture-ratio-aU-grid.js (the U_GRID = {4,6,8,10} this certifies against)
 *   @see imp-3483-Ttilde-peak-slope-xistar-global-uniqueness.js (xi* is the unique global peak-slope maximizer)
 *
 *   Ticket: imp-3489 (numerical, medium). Certification/measurement only; RH-equivalent; NO RH verdict, NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3470 / imp-3400 / imp-3240)
const A_LINEAR = 1.0; // shear weight; a cancels in C, so factor it out and read the peak slope directly
const U_GRID = Object.freeze([4, 6, 8, 10]); // the imp-3240 capture-ratio U-grid
const PANELS_PER_UNIT = 60; // fixed panel width: matches imp-3470 (U=6 -> 360, U=8 -> 480)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3470). */
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
 * Analytic PSD derivatives at frequency xi (midpoint quadrature, exact
 * xi-differentiation of the Fourier parts). Returns P, its slope P1 and its
 * curvature P2 -- identical to the imp-3470 assembly.
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
 * One window [0, U]: coarse-scan |P1| to bracket the peak, then bisect
 * P2(xi) = 0 to machine precision (imp-3470 locatePeak, verbatim logic).
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
    U,
    N,
    coarseXi,
    xiStar,
    peakSlope,
    p2AtStar: at.P2,
    p1SignAtStar: Math.sign(at.P1),
    isStrictMax: peakSlope > left && peakSlope > right,
  };
}

// --- Recompute xi* on the FULL imp-3240 U-grid and MEASURE the drift. ---
const cells = U_GRID.map((U) => locatePeak(A_LINEAR, U, PANELS_PER_UNIT * U));
const xiStars = cells.map((c) => c.xiStar);
const xiStarMin = Math.min(...xiStars);
const xiStarMax = Math.max(...xiStars);
const xiStarDrift = xiStarMax - xiStarMin; // the headline invariance measure
const xiStarMean = xiStars.reduce((acc, x) => acc + x, 0) / xiStars.length;
const xiStarRelDrift = xiStarDrift / xiStarMean; // relative drift across U

// The imp-3470 sub-grid U in {6,8,10} (dropping the most-truncated U=4 window) is tighter.
const settledCells = cells.filter((c) => c.U >= 6);
const settledXiStars = settledCells.map((c) => c.xiStar);
const settledDrift = Math.max(...settledXiStars) - Math.min(...settledXiStars);

const peakSlopes = cells.map((c) => c.peakSlope);
const peakSlopeDrift = Math.max(...peakSlopes) - Math.min(...peakSlopes); // U-stability of the slope value

const IMP3470_XISTAR = 12.0870439; // the value imp-3470 reported; xi* must reproduce it
const maxDevFromImp3470 = Math.max(...xiStars.map((x) => Math.abs(x - IMP3470_XISTAR)));

const verdict =
  xiStarDrift < 1e-3 &&
  cells.every((c) => c.isStrictMax && Math.abs(c.p2AtStar) < 1e-12 && c.xiStar > 12.0 && c.xiStar < 12.2)
    ? 'XISTAR-U-INDEPENDENT-CERTIFIED-12.0870-DRIFT-BELOW-1e-3-ACROSS-imp3240-U-GRID'
    : 'INDETERMINATE';

export const IMP3489_XISTAR_U_INDEPENDENCE_CERTIFICATION = Object.freeze({
  id: 'imp-3489-xistar-U-independence-certification',
  ticket: 'imp-3489',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentLocator: 'imp-3470-Ttilde-spectral-peak-xistar-obstruction.js',
  uGridSource: 'imp-3240-mupass-capture-ratio-aU-grid.js',

  summary:
    'CERTIFIES the imp-3470 claim that the PSD peak-slope maximizer xi* = 12.0870439 (the root of the curvature ' +
    'P2(xi) = 0) is U-INDEPENDENT, by re-solving P2(xi) = 0 on the FULL imp-3240 capture-ratio grid ' +
    'U_GRID = {4, 6, 8, 10} (imp-3470 used only the short {6, 8} ladder) and MEASURING the drift of the located ' +
    'maximizer across U. Reusing the imp-3470 P2 assembly verbatim (dBN kernel n=1..10, midpoint Fourier parts and ' +
    'their analytic xi-derivatives, N = 60*U panels fixing the panel width), every window locates xi* = ' +
    '12.08704387272693 as a clean stationarity root (|P2(xi*)| < 1e-12, a strict slope MAX) -- BIT-IDENTICAL, so the ' +
    'drift max_U xi* - min_U xi* is EXACTLY 0 (reproducing the imp-3470 value to 2.7e-8). This exact invariance ' +
    'follows because Phi has COMPACT EFFECTIVE SUPPORT (its Gaussian tail underflows to 0 by u ~ 1.4, inside the ' +
    'shortest U = 4 window), so every window U >= 4 captures the full nonzero Phi and the fixed panel width ' +
    'H = 1/60 places IDENTICAL quadrature nodes in every window; nodes beyond the shortest window fall where Phi = 0. ' +
    'The peak-slope value a*|P1(xi*)| is likewise bit-identical. So xi* is not merely U-stable but exactly ' +
    'U-invariant -- the STRONGEST form of the imp-3470 "spread ~0" claim, a FIXED property of the truncated dBN ' +
    'power spectrum, not an artifact of the imp-3470 ladder choice, ' +
    'sharpening the imp-3400 caveat that the sup behind C_inf is a determined transcendental NUMBER. ' +
    'Certification/measurement only; RH-equivalent; the imp-3066 K_a >= 0 magnitude is the lone obstruction, ' +
    'UNTOUCHED. NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    psd: 'P(xi) = C^2 + S^2, C = int_0^U Phi cos(xi u) du, S = int_0^U Phi sin(xi u) du',
    curvature: 'P2 = 2(C1^2 + S1^2 + C C2 + S S2); root P2(xi*) = 0 is the slope maximizer',
    stationarity: 'per-U: coarse-scan |P1| to bracket, then bisect P2(xi) = 0 to machine precision (imp-3470 method)',
    a: A_LINEAR,
    uGrid: U_GRID.slice(),
    panelsPerUnit: PANELS_PER_UNIT,
    quadrature: 'midpoint, N = 60*U panels on [0, U] (fixed panel width); analytic xi-derivatives',
    selfComputing: true,
  }),

  measured: Object.freeze({
    cells, // per-U: coarseXi, bisected xiStar, peakSlope, P2 residual, strict-max flag
    xiStars, // xi*(U) for U in {4, 6, 8, 10}
    xiStarMin,
    xiStarMax,
    xiStarDrift, // THE HEADLINE: max_U xi* - min_U xi* (expected ~0 if U-independent)
    xiStarMean,
    xiStarRelDrift, // relative drift xiStarDrift / xiStarMean
    settledDrift, // drift over the settled U in {6, 8, 10} sub-grid (tighter)
    peakSlopeDrift, // U-stability of the peak-slope value a*|P1(xi*)|
    maxDevFromImp3470, // max |xi*(U) - 12.0870439| -- reproduces the imp-3470 value
    verdict,
  }),

  interpretation: Object.freeze({
    invarianceCertified:
      'Re-solving P2(xi) = 0 on the full imp-3240 U-grid {4, 6, 8, 10} gives xi* = 12.08704387272693 on every ' +
      'window -- BIT-IDENTICAL, so the drift is exactly 0. The imp-3470 "stable across the U ladder" claim, tested ' +
      'on a grid twice as wide, holds in its strongest form: xi* is exactly U-invariant, a fixed spectral quantity.',
    whyExactlyInvariant:
      'The drift is exactly 0 (not merely small) because Phi has compact effective support: its Gaussian tail ' +
      'underflows to 0 by u ~ 1.4, inside the shortest U = 4 window, so every window U >= 4 captures the full nonzero ' +
      'Phi. With the fixed panel width H = 1/60 (N = 60*U) the midpoint nodes are identical across windows and the ' +
      'extra nodes beyond the shortest window fall where Phi = 0, so the Fourier integrals and their root xi* are the ' +
      'same floating-point number for every U.',
    sharpensImp3400:
      'This certifies the invariance the imp-3400 closed form needs -- the sup behind C_inf is a U-independent ' +
      'determined transcendental NUMBER (xi* has no elementary root, per imp-3470), not a grid- or U-dependent estimate.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    certifiesInvarianceNotClosedForm:
      'This CERTIFIES the U-independence of xi* on the imp-3240 grid and bounds the residual drift; it does NOT give ' +
      'xi* an elementary closed form -- the stationarity equation P2(xi) = 0 stays transcendental (imp-3470).',
    valueStaysTranscendental:
      'C_inf ~ 0.1751 remains a determined number requiring transcendental evaluation; this sharpens (not removes) ' +
      'the imp-3400 caveat by confirming the sup is a fixed, U-independent spectral quantity.',
    measuresRatioNotPositivity:
      'This characterizes the numerator norm of the capture RATIO; it does NOT construct the missing magnitude and ' +
      'does NOT attempt the K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Diagnostic only; the imp-3066 off-diagonal endpoint-Hankel operator magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3489_XISTAR_U_INDEPENDENCE_CERTIFICATION_ASSERTIONS = [
  {
    id: 'imp3489-recomputed-on-full-imp3240-U-grid',
    why: 'THE PRIMARY DELIVERABLE: xi* must be recomputed on the full imp-3240 U-grid {4,6,8,10} (four windows, not ' +
      'the imp-3470 short {6,8} ladder), each a bisected root of P2(xi) = 0 near xi* ~ 12.09.',
    holds: () =>
      cells.length === U_GRID.length &&
      cells.every((c, i) => c.U === U_GRID[i]) &&
      cells.every((c) => c.xiStar > 12.0 && c.xiStar < 12.2),
  },
  {
    id: 'imp3489-drift-exactly-zero-U-independence-certified',
    why: 'The measured drift max_U xi* - min_U xi* must be EXACTLY 0 (bit-identical xi* across the grid), the ' +
      'strongest form of the imp-3470 U-independence claim: with fixed panel width H = 1/60 and Phi compactly ' +
      'supported (underflow by u ~ 1.4) every window U >= 4 uses identical quadrature nodes. Any nonzero drift would ' +
      'mean this mechanism broke.',
    holds: () => xiStarDrift === 0 && settledDrift === 0 && peakSlopeDrift === 0,
  },
  {
    id: 'imp3489-reproduces-imp3470-xistar',
    why: 'Every located xi*(U) must reproduce the imp-3470 value 12.0870439 (max deviation < 1e-3); a mismatch would ' +
      'mean the recomputation disagrees with the parent locator.',
    holds: () => maxDevFromImp3470 < 1e-3,
  },
  {
    id: 'imp3489-each-U-is-genuine-stationarity-max',
    why: 'At each U the curvature P2 must vanish (|P2| < 1e-12) and |P1| be a strict MAX -- clean stationarity roots, ' +
      'not saddles or coarse-grid artifacts, on every window.',
    holds: () => cells.every((c) => Math.abs(c.p2AtStar) < 1e-12 && c.isStrictMax),
  },
  {
    id: 'imp3489-peak-slope-U-stable',
    why: 'The peak-slope value a*|P1(xi*)| must be positive and U-stable (drift < 1e-6) across the grid, confirming ' +
      'the imp-3470 slope-value invariance alongside the maximizer invariance.',
    holds: () => cells.every((c) => c.peakSlope > 6e-5 && c.peakSlope < 7e-5) && peakSlopeDrift < 1e-6,
  },
  {
    id: 'imp3489-verdict-certified',
    why: 'The classified verdict must be the U-independent-certified split, not indeterminate; a flip means the ' +
      'per-U bisection or the drift bound failed.',
    holds: () => verdict === 'XISTAR-U-INDEPENDENT-CERTIFIED-12.0870-DRIFT-BELOW-1e-3-ACROSS-imp3240-U-GRID',
  },
  {
    id: 'imp3489-honest-assessment-no-qed',
    why: 'Mandatory honesty: CERTIFIES invariance but does NOT close xi* (equation transcendental), value stays a ' +
      'number, positivity not attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3489_XISTAR_U_INDEPENDENCE_CERTIFICATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.certifiesInvarianceNotClosedForm === 'string' &&
        typeof c.valueStaysTranscendental === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3489_XISTAR_U_INDEPENDENCE_CERTIFICATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3489-xistar-U-independence-certification assertion failed: ${assertion.id}`);
  }
}

export default IMP3489_XISTAR_U_INDEPENDENCE_CERTIFICATION;
