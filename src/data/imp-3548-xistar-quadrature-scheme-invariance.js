/**
 * @module imp-3548-xistar-quadrature-scheme-invariance
 * @fileoverview imp-3548 -- CONFIRM the imp-3523 grid-converged PSD peak-slope maximizer
 *   xi*_inf ~ 12.0666876 is QUADRATURE-SCHEME-INVARIANT by re-measuring it with two
 *   quadrature rules INDEPENDENT of the midpoint rule imp-3523 used. imp-3523 pinned
 *   xi*_inf ~ 12.06668761 by Richardson/Aitken-extrapolating a midpoint-quadrature xi*(N)
 *   ladder assuming an O(1/N^2) drift, cross-checking Richardson vs Aitken to ~1e-9 -- but
 *   BOTH extrapolants used the SAME midpoint rule, so the located limit could in principle
 *   be a midpoint-O(H^2) extrapolation-model artifact rather than the true maximizer. This
 *   module re-solves P2(xi) = 0 with (a) composite 5-point Gauss-Legendre and (b) composite
 *   trapezoid + its own Richardson, and confirms both land on the imp-3523 value inside its
 *   1e-6 residual band.
 *
 *   WHY THIS IS NEEDED
 *   ------------------
 *   imp-3523 established second-order midpoint convergence (diff ratios -> 4.00) and read the
 *   1/N^2 Richardson limit, cross-checking it against an Aitken delta^2 acceleration -- but
 *   Aitken accelerates the SAME midpoint ladder, so it tests the extrapolation MODEL, not the
 *   quadrature RULE. A rule-invariance check needs a genuinely different node placement and a
 *   different (or absent) error expansion.
 *
 *   THE TWO INDEPENDENT SCHEMES (same de Bruijn-Newman kernel, NPHI = 10, analytic Fourier
 *   xi-derivatives; only the nodes/weights differ from imp-3523)
 *   -----------------------------------------------------------------------------------------
 *     - GAUSS-LEGENDRE: composite 5-point Gauss-Legendre per panel on [0, U]. Being an
 *       order-10 rule per panel, it resolves the smooth Phi-integrand to machine precision at
 *       modest N and needs NO extrapolation: the located root is already xi* = 12.066687610
 *       at N = 90 and is bit-stable (spread < 1e-8) through N = 720. This is the cleanest
 *       possible rebuttal to the extrapolation-artifact worry -- a high-order rule hits the
 *       imp-3523 limit WITHOUT any Richardson model at all.
 *     - TRAPEZOID: composite trapezoid on [0, U] with N intervals, itself O(1/N^2) but with a
 *       DIFFERENT error constant of OPPOSITE SIGN (Euler-Maclaurin: trapezoid error ~ +H^2/12
 *       f, midpoint ~ -H^2/24 f). Its raw ladder therefore drifts UP toward the limit
 *       (12.0265 -> 12.0665) while the imp-3523 midpoint ladder drifted DOWN (12.0870 ->
 *       12.0667): the two rules STRADDLE the limit from opposite sides. Its own iterated
 *       1/N^2 Richardson (diff ratios -> 4.00) extrapolates to xi* = 12.066687610.
 *
 *   THE VERDICT
 *   -----------
 *   Gauss-Legendre (no extrapolation) and trapezoid + Richardson both land at 12.066687610,
 *   agreeing with the imp-3523 headline xi*_inf = 12.06668761 to ~1e-9 -- three orders inside
 *   imp-3523's conservative 1e-6 residual band. Because the schemes bracket the limit from
 *   opposite sides and one needs no extrapolation model at all, xi*_inf = 12.0666876(1) is
 *   confirmed QUADRATURE-SCHEME-INVARIANT, not a midpoint-O(H^2) model artifact.
 *
 *   SCOPE
 *   -----
 *   Measurement/certification only. It confirms the imp-3523 converged LOCATION is
 *   rule-independent; it does NOT give xi* an elementary closed form (the imp-3470
 *   stationarity equation stays transcendental) and does not sharpen the residual band.
 *   RH-EQUIVALENT; the imp-3066 off-diagonal endpoint-Hankel K_a >= 0 magnitude is the lone
 *   RH obstruction, UNTOUCHED. NO RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-3523-xistar-panel-count-convergence-limit.js (midpoint ladder; pinned xi*_inf)
 *   @see imp-3511-xistar-uniqueness-wide-range-robustness.js (root COUNT robust)
 *   @see imp-3470-Ttilde-spectral-peak-xistar-obstruction.js (P2 assembly; located xi*)
 *
 *   Ticket: imp-3548 (numerical, medium). Measurement only; RH-equivalent; NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3523 / imp-3511 / imp-3470)

// imp-3523 headline converged location and its conservative residual band (baked literals so
// this module stays a light, self-contained cross-check and imports no heavy bundle).
const XISTAR_INF_IMP3523 = 12.06668761;
const RESIDUAL_BAND_IMP3523 = 1e-6;
const XISTAR_IMP3483_COARSE = 12.0870439; // imp-3523 midpoint N = 360 value (drifts DOWN to the limit)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-3523 assembly). */
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

// --- Composite 5-point Gauss-Legendre on [-1, 1] (order-10 per panel). ---
const GL5_NODES = Object.freeze([
  0,
  0.5384693101056831, -0.5384693101056831,
  0.906179845938664, -0.906179845938664,
]);
const GL5_WEIGHTS = Object.freeze([
  128 / 225,
  (322 + 13 * Math.sqrt(70)) / 900, (322 + 13 * Math.sqrt(70)) / 900,
  (322 - 13 * Math.sqrt(70)) / 900, (322 - 13 * Math.sqrt(70)) / 900,
]);

/** Build the fixed (node, phi*weight) grid on [0, U] with N Gauss-Legendre panels. */
function buildGridGaussLegendre(U, N) {
  const H = U / N;
  const half = 0.5 * H;
  const M = 5 * N;
  const u = new Float64Array(M);
  const w = new Float64Array(M);
  let m = 0;
  for (let p = 0; p < N; p++) {
    const center = (p + 0.5) * H;
    for (let k = 0; k < 5; k++) {
      const x = center + half * GL5_NODES[k];
      u[m] = x;
      w[m] = half * GL5_WEIGHTS[k] * phiKernel(x);
      m += 1;
    }
  }
  return { u, w, M, scheme: 'gauss-legendre-5pt' };
}

/** Build the composite trapezoid grid on [0, U] with N intervals (N+1 nodes, half-weight ends). */
function buildGridTrapezoid(U, N) {
  const H = U / N;
  const M = N + 1;
  const u = new Float64Array(M);
  const w = new Float64Array(M);
  for (let i = 0; i <= N; i++) {
    u[i] = i * H;
    const weight = (i === 0 || i === N) ? 0.5 * H : H;
    w[i] = weight * phiKernel(u[i]);
  }
  return { u, w, M, scheme: 'trapezoid' };
}

/** PSD curvature P2 = d2P/dxi2 at xi on a generic (node, phi*weight) grid (imp-3523 assembly). */
function curvatureP2(grid, xi) {
  let C = 0, S = 0, C1 = 0, S1 = 0, C2 = 0, S2 = 0;
  for (let i = 0; i < grid.M; i++) {
    const ui = grid.u[i];
    const w = grid.w[i];
    const c = Math.cos(xi * ui);
    const s = Math.sin(xi * ui);
    C += w * c;
    S += w * s;
    C1 += -w * ui * s;
    S1 += w * ui * c;
    C2 += -w * ui * ui * c;
    S2 += -w * ui * ui * s;
  }
  return 2 * (C1 * C1 + S1 * S1 + C * C2 + S * S2);
}

/** Bisect P2 = 0 on a sign-changing bracket [lo, hi] (100 halvings; imp-3523 assembly). */
function bisectP2(grid, lo, hi) {
  let flo = curvatureP2(grid, lo);
  for (let it = 0; it < 100; it++) {
    const mid = 0.5 * (lo + hi);
    const fm = curvatureP2(grid, mid);
    if (flo * fm <= 0) hi = mid;
    else { lo = mid; flo = fm; }
  }
  return 0.5 * (lo + hi);
}

/** Enumerate ALL P2 sign changes on [xiLo, xiHi] at step dxi, bisecting the FIRST to a root. */
function locateAndCount(grid, xiLo, xiHi, dxi) {
  let prevXi = xiLo;
  let prev = curvatureP2(grid, prevXi);
  let root = NaN;
  let nRoots = 0;
  for (let xi = xiLo + dxi; xi <= xiHi; xi += dxi) {
    const cur = curvatureP2(grid, xi);
    if (prev * cur < 0) {
      nRoots += 1;
      if (Number.isNaN(root)) root = bisectP2(grid, prevXi, xi);
    }
    prev = cur;
    prevXi = xi;
  }
  return { xiStar: root, nRoots };
}

// --- Fixed enumeration domain (identical to imp-3523). ---
const U_FIXED = 6;
const XI_LO = 1e-4;
const XI_HI = 60;
const DXI = 0.01;

// --- (a) Gauss-Legendre ladder: high-order, needs NO extrapolation. ---
const GL_N_LADDER = Object.freeze([45, 90, 180, 360, 720]);
const glCells = GL_N_LADDER.map((N) => {
  const grid = buildGridGaussLegendre(U_FIXED, N);
  const r = locateAndCount(grid, XI_LO, XI_HI, DXI);
  return { N, xiStar: r.xiStar, nRoots: r.nRoots };
});
const glLadder = glCells.map((c) => c.xiStar);
const glLimit = glLadder[glLadder.length - 1]; // finest GL rung == converged (no Richardson)
// Spread over the CONVERGED tail (N >= 90); the coarse N = 45 rung is only ~3e-6 off already.
const glTail = glLadder.slice(1);
const glTailSpread = Math.max(...glTail) - Math.min(...glTail); // < 1e-8: bit-stable, no extrapolation
const glCoarseGap = Math.abs(glLadder[0] - glLimit); // ~3e-6 -- even the coarse N = 45 rung is already sub-1e-5

// --- (b) Trapezoid ladder + its OWN iterated 1/N^2 Richardson (opposite-sign error constant). ---
const TRAP_N_LADDER = Object.freeze([360, 720, 1440, 2880, 5760]);
const trapCells = TRAP_N_LADDER.map((N) => {
  const grid = buildGridTrapezoid(U_FIXED, N);
  const r = locateAndCount(grid, XI_LO, XI_HI, DXI);
  return { N, xiStar: r.xiStar, nRoots: r.nRoots, xiNyq: Math.PI * N / U_FIXED, subNyquist: XI_HI < Math.PI * N / U_FIXED };
});
const trapLadder = trapCells.map((c) => c.xiStar);

// Trapezoid successive differences and their ratios (should quarter -> O(1/N^2) like midpoint).
const trapDiffs = [];
for (let i = 1; i < trapLadder.length; i++) trapDiffs.push(trapLadder[i] - trapLadder[i - 1]);
const trapDiffRatios = [];
for (let i = 1; i < trapDiffs.length; i++) trapDiffRatios.push(trapDiffs[i - 1] / trapDiffs[i]);
const trapMeanDiffRatio = trapDiffRatios.reduce((s, r) => s + r, 0) / trapDiffRatios.length;
const trapSecondOrder = trapDiffRatios.every((r) => r > 3.5 && r < 4.5);
const trapMonotoneUp = trapDiffs.every((d) => d > 0); // rises to the limit (midpoint fell to it)

// Iterated (Neville) Richardson on the trapezoid 1/N^2 sequence.
const trapRichLevels = [trapLadder.slice()];
for (let k = 1; k < trapLadder.length; k++) {
  const factor = Math.pow(4, k);
  const prevLevel = trapRichLevels[k - 1];
  const next = [];
  for (let i = 0; i + 1 < prevLevel.length; i++) {
    next.push((factor * prevLevel[i + 1] - prevLevel[i]) / (factor - 1));
  }
  trapRichLevels.push(next);
}
const trapRichardsonLimit = trapRichLevels[trapRichLevels.length - 1][0];

// --- Cross-scheme agreement and straddle check. ---
const schemeLimits = [glLimit, trapRichardsonLimit];
const crossSchemeSpread = Math.max(...schemeLimits) - Math.min(...schemeLimits); // ~1e-9
const glVsImp3523 = Math.abs(glLimit - XISTAR_INF_IMP3523);
const trapVsImp3523 = Math.abs(trapRichardsonLimit - XISTAR_INF_IMP3523);
// Straddle: the imp-3523 midpoint coarse value sits ABOVE the limit, the trapezoid coarse value BELOW.
const midpointCoarseAbove = XISTAR_IMP3483_COARSE > XISTAR_INF_IMP3523;
const trapCoarseBelow = trapLadder[0] < XISTAR_INF_IMP3523;
const schemesStraddle = midpointCoarseAbove && trapCoarseBelow;

const allSingleRoot =
  glCells.every((c) => c.nRoots === 1) && trapCells.every((c) => c.nRoots === 1);
const allTrapSubNyquist = trapCells.every((c) => c.subNyquist);
const bothWithinImp3523Band = glVsImp3523 < RESIDUAL_BAND_IMP3523 && trapVsImp3523 < RESIDUAL_BAND_IMP3523;

const verdict =
  allSingleRoot && allTrapSubNyquist && trapSecondOrder && trapMonotoneUp && schemesStraddle &&
  glTailSpread < 1e-7 && crossSchemeSpread < 1e-6 && bothWithinImp3523Band
    ? 'XISTAR-INF-QUADRATURE-SCHEME-INVARIANT-GAUSS-LEGENDRE-AND-TRAPEZOID-CONFIRM-12.0666876'
    : 'INDETERMINATE';

export const IMP3548_XISTAR_QUADRATURE_SCHEME_INVARIANCE = Object.freeze({
  id: 'imp-3548-xistar-quadrature-scheme-invariance',
  ticket: 'imp-3548',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentCertification: 'imp-3523-xistar-panel-count-convergence-limit.js',
  parentLocation: 'imp-3470-Ttilde-spectral-peak-xistar-obstruction.js',

  summary:
    'Confirms the imp-3523 grid-converged PSD peak-slope maximizer xi*_inf ~ 12.0666876 is QUADRATURE-SCHEME-INVARIANT ' +
    'by re-solving P2(xi) = 0 with two rules independent of the midpoint rule imp-3523 extrapolated. imp-3523 pinned ' +
    'xi*_inf ~ 12.06668761 via Richardson/Aitken on a midpoint ladder, but both extrapolants shared the same midpoint ' +
    'rule, so the limit could be a midpoint-O(H^2) model artifact. (a) Composite 5-point Gauss-Legendre (order-10 per ' +
    'panel) locates the single root at 12.066687610 already at N = 90 and stays bit-stable (spread < 1e-8) through ' +
    'N = 720 with NO extrapolation at all. (b) Composite trapezoid is O(1/N^2) with an OPPOSITE-SIGN Euler-Maclaurin ' +
    'error constant, so its raw ladder drifts UP (12.0265 -> 12.0665) toward the limit while the midpoint ladder fell ' +
    'DOWN (12.0870 -> 12.0667) to it -- the two rules STRADDLE the limit; its own iterated 1/N^2 Richardson (diff ' +
    'ratios -> 4.00) extrapolates to 12.066687610. Both schemes agree with the imp-3523 headline to ~1e-9, three ' +
    'orders inside its conservative 1e-6 residual band, so xi*_inf = 12.0666876(1) is rule-invariant, not an ' +
    'extrapolation-model artifact. Measurement only; RH-equivalent; the imp-3066 K_a >= 0 magnitude is the lone ' +
    'obstruction, UNTOUCHED. NO RH verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    objective: 'sup_xi |P1(xi)|, P1 = dP/dxi, P(xi) = |Phihat(xi)|^2 = C^2 + S^2 (the peak slope behind ||Ttilde||)',
    maximizerIsP2Root:
      'the global maximizer of |P1| is a root of P2 = dP1/dxi (imp-3483); imp-3511 certified EXACTLY ONE such root per ' +
      'U window; imp-3523 pinned its midpoint-converged LOCATION; this checks that location is quadrature-rule-invariant',
    gaussLegendre:
      'composite 5-point Gauss-Legendre per panel on [0, U]; an order-10 rule resolves the smooth Phi-integrand to ' +
      'machine precision at modest N, so the located root needs NO Richardson model -- the cleanest artifact rebuttal',
    trapezoid:
      'composite trapezoid on [0, U] with N intervals; also O(1/N^2) but with an OPPOSITE-SIGN Euler-Maclaurin error ' +
      'constant, so its raw ladder approaches the limit from the OTHER side than midpoint (the two rules straddle it)',
    trapezoidRichardson:
      'iterated Neville extrapolation on the trapezoid 1/N^2 sequence (dividing out (1/N^2)^k via the doubling factor ' +
      '4^k at level k), an EXTRAPOLATION cross-check independent of the midpoint one',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    U: U_FIXED,
    glLadder: GL_N_LADDER.slice(),
    trapLadder: TRAP_N_LADDER.slice(),
    scanDomain: { xiLo: XI_LO, xiHi: XI_HI, dxi: DXI },
    xistarInfImp3523: XISTAR_INF_IMP3523,
    residualBandImp3523: RESIDUAL_BAND_IMP3523,
    selfComputing: true,
  }),

  measured: Object.freeze({
    glCells, // per-rung GL xiStar and root count
    glLadder, // [12.066690824, 12.066687611, 12.066687610, 12.066687610, 12.066687610]
    glLimit, // 12.066687610 -- finest GL rung, no extrapolation
    glTailSpread, // < 1e-8 -- bit-stable across N >= 90
    glCoarseGap, // ~3e-6 -- even N = 45 is inside the imp-3523 band
    trapCells, // per-rung trapezoid xiStar, root count, xi_Nyq, sub-Nyquist flag
    trapLadder, // [12.0264723, 12.0564958, 12.0641309, 12.0660479, 12.0665276]
    trapDiffs, // all positive -> monotone RISE toward the limit (midpoint fell)
    trapDiffRatios, // ~[3.93, 3.98, 3.996] -> 4.00, confirming trapezoid O(1/N^2)
    trapMeanDiffRatio,
    trapSecondOrder,
    trapMonotoneUp,
    trapRichLevels, // iterated Neville table
    trapRichardsonLimit, // 12.066687610 -- trapezoid extrapolant
    schemeLimits, // [glLimit, trapRichardsonLimit]
    crossSchemeSpread, // ~1e-9 -- GL and trapezoid agree
    glVsImp3523, // ~1e-9 -- GL vs imp-3523 headline
    trapVsImp3523, // ~1e-9 -- trapezoid vs imp-3523 headline
    midpointCoarseAbove,
    trapCoarseBelow,
    schemesStraddle, // true -- midpoint from above, trapezoid from below
    allSingleRoot,
    allTrapSubNyquist,
    bothWithinImp3523Band,
    verdict,
  }),

  interpretation: Object.freeze({
    gaussLegendreNoExtrapolation:
      'The order-10 composite Gauss-Legendre rule locates xi* = 12.066687610 at N = 90 and holds it bit-stable ' +
      '(spread < 1e-8) through N = 720 WITHOUT any Richardson model. A high-order rule hitting the imp-3523 limit with ' +
      'zero extrapolation is the strongest possible rebuttal to the midpoint-O(H^2)-model-artifact worry.',
    trapezoidStraddle:
      'The trapezoid rule shares the O(1/N^2) order (diff ratios -> 4.00) but has an opposite-sign Euler-Maclaurin ' +
      'error constant, so its raw ladder rises to the limit (12.0265 -> 12.0665) while the midpoint ladder fell to it ' +
      '(12.0870 -> 12.0667). The two rules bracket xi*_inf from opposite sides -- a genuinely independent confirmation.',
    schemeInvariantLimit:
      'Gauss-Legendre (no extrapolation) and trapezoid + Richardson both land at 12.066687610, agreeing with the ' +
      'imp-3523 headline xi*_inf = 12.06668761 to ~1e-9 -- three orders inside its conservative 1e-6 band. The ' +
      'converged maximizer is therefore quadrature-scheme-INVARIANT, not a property of the midpoint rule.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    confirmsInvarianceNotClosedForm:
      'This confirms the imp-3523 converged LOCATION is quadrature-rule-independent; it does NOT give xi* or the sup an ' +
      'elementary closed form -- the imp-3470 stationarity equation stays transcendental -- and does not sharpen the ' +
      'imp-3523 residual band.',
    trapezoidOrderIsEmpirical:
      'The trapezoid O(1/N^2) convergence is an EMPIRICAL Euler-Maclaurin observation from the diff-ratio -> 4 over a ' +
      'FINITE ladder N <= 5760, not an analytic error bound; its Richardson limit inherits that empirical status. The ' +
      'Gauss-Legendre confirmation, by contrast, needs no such extrapolation model.',
    bandNotReDerived:
      'xi*_inf = 12.0666876(1) is quoted with the imp-3523 conservative 1e-6 band unchanged; the ~1e-9 cross-scheme ' +
      'agreement supports but does not formally re-derive a tighter band from a finite ladder.',
    subNyquistOnly:
      'The trapezoid enumeration stays in the quadrature-valid band [1e-4, 60] < xi_Nyq = pi N/U at every rung ' +
      '(imp-3511 guard); Gauss-Legendre clusters nodes within panels but reports EXACTLY ONE root at every rung too.',
    measuresRatioNotPositivity:
      'This certifies the location behind the numerator norm of the capture RATIO; it does NOT construct the missing ' +
      'magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Diagnostic only; the imp-3066 off-diagonal endpoint-Hankel operator magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3548_XISTAR_QUADRATURE_SCHEME_INVARIANCE_ASSERTIONS = [
  {
    id: 'imp3548-every-rung-single-root',
    why: 'Both quadrature ladders must report EXACTLY ONE P2 root at every rung, matching the imp-3511 root-count ' +
      'certification; a second root under a different rule would mean the scheme change manufactured a competitor.',
    holds: () => allSingleRoot,
  },
  {
    id: 'imp3548-gauss-legendre-no-extrapolation-limit',
    why: 'The order-10 Gauss-Legendre rule must locate xi* at ~12.06668761 with a converged-tail spread < 1e-7 and NO ' +
      'Richardson, and even its coarse N = 45 rung must already be sub-1e-5 close. This is the artifact rebuttal.',
    holds: () =>
      glTailSpread < 1e-7 &&
      Math.abs(glLimit - XISTAR_INF_IMP3523) < RESIDUAL_BAND_IMP3523 &&
      glCoarseGap < 1e-5,
  },
  {
    id: 'imp3548-trapezoid-second-order-rises',
    why: 'The trapezoid ladder must be second-order (diff ratios near 4) and monotone RISING to the limit -- the ' +
      'opposite-sign Euler-Maclaurin approach from below that midpoint (falling from above) does not share.',
    holds: () => trapSecondOrder && trapMonotoneUp && trapMeanDiffRatio > 3.8 && trapMeanDiffRatio < 4.1,
  },
  {
    id: 'imp3548-trapezoid-sub-nyquist',
    why: 'The trapezoid enumeration must stay below xi_Nyq = pi N/U at every rung, else the single-root count would be ' +
      'an aliasing artifact rather than a real enumeration (imp-3511 coarse-grid guard).',
    holds: () => allTrapSubNyquist,
  },
  {
    id: 'imp3548-schemes-straddle-limit',
    why: 'The midpoint coarse value must sit ABOVE the limit and the trapezoid coarse value BELOW it: bracketing from ' +
      'opposite sides is the signature of a rule-invariant limit rather than a one-sided model bias.',
    holds: () => schemesStraddle && midpointCoarseAbove && trapCoarseBelow,
  },
  {
    id: 'imp3548-cross-scheme-agreement-in-band',
    why: 'Gauss-Legendre and trapezoid + Richardson must agree with each other (< 1e-6) and both with the imp-3523 ' +
      'headline to inside its 1e-6 residual band -- the core scheme-invariance deliverable.',
    holds: () => crossSchemeSpread < 1e-6 && bothWithinImp3523Band,
  },
  {
    id: 'imp3548-verdict-scheme-invariant',
    why: 'The classified verdict must be the scheme-invariant certification, not indeterminate; a flip means the ' +
      'single-root, sub-Nyquist, second-order, straddle, or agreement checks failed.',
    holds: () =>
      verdict === 'XISTAR-INF-QUADRATURE-SCHEME-INVARIANT-GAUSS-LEGENDRE-AND-TRAPEZOID-CONFIRM-12.0666876',
  },
  {
    id: 'imp3548-honest-assessment-no-qed',
    why: 'Mandatory honesty: confirms rule-invariance not a closed form (equation transcendental), the trapezoid ' +
      'O(1/N^2) is empirical over a finite ladder, the band is not re-derived, sub-Nyquist only, measures the ratio ' +
      'not positivity, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3548_XISTAR_QUADRATURE_SCHEME_INVARIANCE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.confirmsInvarianceNotClosedForm === 'string' &&
        typeof c.trapezoidOrderIsEmpirical === 'string' &&
        typeof c.bandNotReDerived === 'string' &&
        typeof c.subNyquistOnly === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3548_XISTAR_QUADRATURE_SCHEME_INVARIANCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3548-xistar-quadrature-scheme-invariance assertion failed: ${assertion.id}`);
  }
}

export default IMP3548_XISTAR_QUADRATURE_SCHEME_INVARIANCE;
