/**
 * @module imp-3506-xistar-U-invariance-bitidentity-derivation
 * @fileoverview imp-3506 -- DERIVE (not merely measure) the EXACT, bit-identical
 *   U-invariance of the PSD peak-slope maximizer xi* = 12.0870439 that imp-3489
 *   MEASURED (drift max_U xi* - min_U xi* exactly 0 across U in {4, 6, 8, 10}).
 *
 *   WHAT imp-3489 LEFT OPEN
 *   ----------------------
 *   imp-3489 re-solved the stationarity condition P2(xi) = 0 on the full imp-3240
 *   capture-ratio grid U_GRID = {4, 6, 8, 10} and found xi* = 12.08704387272693 on
 *   EVERY window -- bit-identical, drift exactly 0. It gave a QUALITATIVE reason
 *   (Phi has compact effective support, fixed panel width H = 1/60 places identical
 *   nodes) but never formalized WHY the drift is exactly 0 in IEEE-754 rather than
 *   merely tiny. This module supplies that derivation as a chain of four lemmas,
 *   each certified by self-computed floating-point equality on the actual imp-3489
 *   kernel.
 *
 *   THE DERIVATION (four bit-exact lemmas)
 *   --------------------------------------
 *   Notation: N(U) = 60 U midpoint panels on [0, U]; node u_i = (i + 0.5) H(U);
 *   weight w_i = Phi(u_i) H(U); Fourier parts C, S, C1, S1, C2, S2 accumulated in
 *   index order i = 0..N(U)-1; curvature P2 = 2(C1^2 + S1^2 + C C2 + S S2).
 *
 *   LEMMA 1 (panel width is a U-independent double). H(U) is evaluated as
 *   U / (60 U). For every U the exact quotient is 1/60, so IEEE-754 division returns
 *   the SAME correctly-rounded double round(1/60) = 0.016666666666666666 -- proved by
 *   4/240 === 6/360 === 8/480 === 10/600. Hence H is bit-identical across the grid.
 *
 *   LEMMA 2 (nodes depend only on the index). u_i = (i + 0.5) H is a function of the
 *   integer index i and the U-independent H alone; i + 0.5 is exact for integer i, so
 *   for a shared index i the node u_i is the SAME double in every window. The window U
 *   only sets HOW MANY nodes exist, never WHERE the shared ones sit.
 *
 *   LEMMA 3 (compact IEEE support: the nonzero-Phi node set is U-independent). The
 *   n = 1 Gaussian factor exp(-pi e^{4u}) underflows to exactly 0.0 once
 *   pi e^{4u} exceeds the Math.exp underflow argument X_u = 745.1332191019412, i.e.
 *   for u >= u_thr = (1/4) ln(X_u / pi) = 1.3672; larger n underflow earlier, so
 *   Phi(u) = 0.0 EXACTLY for u >= u_thr. On the 1/60 lattice the last node carrying
 *   nonzero Phi is index i_max = 81 (u = 1.3583, a subnormal 2.09e-309); index 82
 *   (u = 1.375) and every later node return 0.0. Since i_max = 81 < 240 = 60 * 4,
 *   the full nonzero-Phi node set lives inside the SHORTEST window U = 4, so every
 *   window U >= 4 carries the identical nonzero nodes and identical weights.
 *
 *   LEMMA 4 (extra nodes add signed zero, so the six integrals are bit-identical).
 *   Going from window U to a wider U2 > U appends the nodes i = N(U)..N(U2)-1, all at
 *   u_i > U >= 4 > u_thr, so Phi(u_i) = 0.0 and w_i = 0.0. Each appended contribution
 *   is w_i * (trig) = +/-0.0; for finite nonzero accumulator x, x + (+/-0.0) = x
 *   bit-for-bit. Therefore C, S, C1, S1, C2, S2 -- and hence P2(xi) at EVERY xi --
 *   are the SAME doubles for every U >= 4. Certified here by evaluating all six parts
 *   at a probe frequency across the grid and asserting bit-equality.
 *
 *   CONCLUSION. The peak locator is deterministic (a fixed coarse |P1| scan on
 *   xi in [0, 60] step 0.05, then 100 bisection steps on P2 = 0) and reads Phi only
 *   through those six bit-identical parts, so it returns the SAME IEEE-754 xi* for
 *   every U >= 4. This DERIVES imp-3489's measured drift = 0: the invariance is not
 *   approximate but bit-exact, forced by (L1) a U-independent H, (L2) index-only
 *   nodes, (L3) a U-independent compact IEEE support, and (L4) additive signed zero.
 *   xi* stays a determined TRANSCENDENTAL number (imp-3470: P2 = 0 has no elementary
 *   root); this certifies its U-invariance, not a closed form. Certification /
 *   derivation only; RH-equivalent; the imp-3066 off-diagonal endpoint-Hankel
 *   K_a >= 0 magnitude is the lone obstruction, UNTOUCHED. NO RH verdict, NO QED.
 *   Platt-Trudgian Lambda <= 0.2 stays SOTA.
 *
 *   @see imp-3489-xistar-U-independence-certification.js (MEASURED drift = 0; this derives WHY it is bit-exact)
 *   @see imp-3470-Ttilde-spectral-peak-xistar-obstruction.js (located xi*; P2 = 0 stays transcendental)
 *   @see imp-3240-mupass-capture-ratio-aU-grid.js (the U_GRID = {4,6,8,10} this derives over)
 *
 *   Ticket: imp-3506 (proof, medium). Derivation/certification only; RH-equivalent; NO RH verdict, NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3489 / imp-3470)
const A_LINEAR = 1.0; // shear weight; a cancels in C, read the peak slope directly
const U_GRID = Object.freeze([4, 6, 8, 10]); // the imp-3240 capture-ratio U-grid
const PANELS_PER_UNIT = 60; // fixed panel width: H = U/(60U) = 1/60
const PROBE_XI = 12.08704387272693; // imp-3489 xi*; probe frequency for the parts bit-identity

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-3489 verbatim). */
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

/** Precompute the fixed Phi grid on [0, U] with N midpoint panels (imp-3489 verbatim). */
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

/** The six Fourier parts at frequency xi (imp-3489 psdDerivs, exposing C..S2). */
function fourierParts(grid, xi) {
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
  return { C, S, C1, S1, C2, S2 };
}

/** P, its slope P1 and curvature P2 from the six parts (imp-3489 assembly). */
function psdDerivs(grid, xi) {
  const { C, S, C1, S1, C2, S2 } = fourierParts(grid, xi);
  const P = C * C + S * S;
  const P1 = 2 * (C * C1 + S * S1);
  const P2 = 2 * (C1 * C1 + S1 * S1 + C * C2 + S * S2);
  return { P, P1, P2 };
}

/** One window [0, U]: coarse-scan |P1|, then bisect P2(xi) = 0 (imp-3489 locatePeak verbatim). */
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
  return { U, N, xiStar, peakSlope: a * Math.abs(at.P1), p2AtStar: at.P2 };
}

// --- LEMMA 1: the panel width H = U/(60U) is a single U-independent double. -------
const hValues = U_GRID.map((U) => U / (PANELS_PER_UNIT * U));
const hAllEqual = hValues.every((h) => h === hValues[0]);
const hIsRoundOneOver60 = hValues[0] === 1 / 60;

// --- Determine the Math.exp underflow argument X_u and the analytic Phi support. --
function expUnderflowArg() {
  // largest x with Math.exp(-x) === 0 (deterministic IEEE-754 fact); bisect in [700, 760]
  let xlo = 700, xhi = 760;
  for (let k = 0; k < 100; k++) {
    const m = 0.5 * (xlo + xhi);
    if (Math.exp(-m) === 0) xhi = m;
    else xlo = m;
  }
  return xhi;
}
const X_UNDERFLOW = expUnderflowArg();
const U_THRESHOLD = 0.25 * Math.log(X_UNDERFLOW / Math.PI); // n=1 underflow: pi e^{4u} > X_u

// --- LEMMA 3: locate the last lattice node carrying nonzero Phi across all windows. --
const H0 = hValues[0];
const maxU = Math.max(...U_GRID);
const minU = Math.min(...U_GRID);
let iMaxNonzero = -1;
for (let i = 0; i < PANELS_PER_UNIT * maxU; i++) {
  if (phiKernel((i + 0.5) * H0) !== 0) iMaxNonzero = i;
}
const uLastNonzero = (iMaxNonzero + 0.5) * H0;
const phiLastNonzero = phiKernel(uLastNonzero);
const uFirstZero = (iMaxNonzero + 1 + 0.5) * H0;
const phiFirstZero = phiKernel(uFirstZero);
// the nonzero support sits inside the SHORTEST window if i_max < node count of min-U
const supportInsideShortestWindow = iMaxNonzero < PANELS_PER_UNIT * minU;

// --- LEMMA 2 + 3 check: shared nodes bit-identical AND every extra node has Phi = 0. --
const shortGrid = buildGrid(minU, PANELS_PER_UNIT * minU);
const longGrid = buildGrid(maxU, PANELS_PER_UNIT * maxU);
let sharedNodesBitIdentical = true;
for (let i = 0; i < shortGrid.N; i++) {
  if (!Object.is(shortGrid.u[i], longGrid.u[i]) || !Object.is(shortGrid.phi[i], longGrid.phi[i])) {
    sharedNodesBitIdentical = false;
    break;
  }
}
let extraNodesAllZeroPhi = true;
for (let i = shortGrid.N; i < longGrid.N; i++) {
  if (longGrid.phi[i] !== 0) { extraNodesAllZeroPhi = false; break; }
}

// --- LEMMA 4: the six Fourier parts are bit-identical across the U-grid at PROBE_XI. --
const partsByU = U_GRID.map((U) => fourierParts(buildGrid(U, PANELS_PER_UNIT * U), PROBE_XI));
const partKeys = ['C', 'S', 'C1', 'S1', 'C2', 'S2'];
const partsBitIdentical = partsByU.every((p) =>
  partKeys.every((k) => Object.is(p[k], partsByU[0][k])),
);

// --- CONCLUSION: run the full imp-3489 locator per U and assert bit-identical xi*. --
const cells = U_GRID.map((U) => locatePeak(A_LINEAR, U, PANELS_PER_UNIT * U));
const xiStars = cells.map((c) => c.xiStar);
const xiStarBitIdentical = xiStars.every((x) => Object.is(x, xiStars[0]));
const xiStarDrift = Math.max(...xiStars) - Math.min(...xiStars);
const peakSlopes = cells.map((c) => c.peakSlope);
const peakSlopeBitIdentical = peakSlopes.every((s) => Object.is(s, peakSlopes[0]));
const IMP3489_XISTAR = 12.08704387272693; // the value imp-3489 measured; derivation must reproduce it
const reproducesImp3489 = Object.is(xiStars[0], IMP3489_XISTAR);

const verdict =
  hAllEqual && hIsRoundOneOver60 &&
  supportInsideShortestWindow && sharedNodesBitIdentical && extraNodesAllZeroPhi &&
  partsBitIdentical && xiStarBitIdentical && peakSlopeBitIdentical && reproducesImp3489
    ? 'XISTAR-U-INVARIANCE-DERIVED-BIT-EXACT-L1-L4-RECONCILES-imp3489-DRIFT-ZERO'
    : 'INDETERMINATE';

export const IMP3506_XISTAR_U_INVARIANCE_BITIDENTITY_DERIVATION = Object.freeze({
  id: 'imp-3506-xistar-U-invariance-bitidentity-derivation',
  ticket: 'imp-3506',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentLocator: 'imp-3489-xistar-U-independence-certification.js',
  derivesTargetOf: 'imp-3470-Ttilde-spectral-peak-xistar-obstruction.js',

  summary:
    'DERIVES (not merely measures) the EXACT bit-identical U-invariance of the PSD peak-slope maximizer ' +
    'xi* = 12.0870439 that imp-3489 measured (drift exactly 0 across U in {4,6,8,10}). imp-3489 gave only a ' +
    'qualitative support/panel-node argument; this module formalizes it as four bit-exact lemmas certified on the ' +
    'imp-3489 kernel. L1: the panel width H = U/(60U) is the SAME double round(1/60) = 0.016666666666666666 for ' +
    'every U (4/240 === 6/360 === 8/480 === 10/600), since the exact quotient is always 1/60. L2: the node ' +
    'u_i = (i + 0.5) H depends only on the index i (exact for integer i) and the U-independent H, so shared indices ' +
    'give bit-identical nodes. L3: the n = 1 Gaussian factor exp(-pi e^{4u}) underflows to exactly 0.0 for ' +
    'u >= u_thr = (1/4) ln(X_u/pi) = 1.3672 (Math.exp underflow arg X_u = 745.1332), larger n earlier, so Phi = 0.0 ' +
    'beyond u_thr; on the 1/60 lattice the last nonzero-Phi node is index 81 (u = 1.3583, subnormal 2.09e-309) and ' +
    'index 82 onward return 0.0 -- and 81 < 240 = 60*4, so the full nonzero support lives inside the SHORTEST ' +
    'window U = 4. L4: widening U only appends nodes at u > U >= 4 > u_thr with Phi = 0.0, each contributing ' +
    '+/-0.0, and x + (+/-0.0) = x bit-for-bit, so C, S, C1, S1, C2, S2 -- hence P2(xi) at every xi -- are the SAME ' +
    'doubles for every U >= 4. The deterministic locator (fixed coarse |P1| scan, 100 bisection steps) then returns ' +
    'the SAME IEEE-754 xi* = 12.08704387272693, reconciling imp-3489 drift = 0 as bit-exact rather than approximate. ' +
    'xi* stays a determined transcendental number (imp-3470: P2 = 0 has no elementary root); this certifies its ' +
    'U-invariance, not a closed form. Derivation/certification only; RH-equivalent; the imp-3066 K_a >= 0 magnitude ' +
    'is the lone obstruction, UNTOUCHED. NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    parts: 'C, S = int_0^U Phi {cos,sin}(xi u) du and analytic xi-derivatives C1,S1,C2,S2 (midpoint quadrature)',
    curvature: 'P2 = 2(C1^2 + S1^2 + C C2 + S S2); root P2(xi*) = 0 is the slope maximizer',
    a: A_LINEAR,
    uGrid: U_GRID.slice(),
    panelsPerUnit: PANELS_PER_UNIT,
    probeXi: PROBE_XI,
    selfComputing: true,
  }),

  lemmas: Object.freeze({
    L1_panelWidthUIndependent: Object.freeze({
      claim: 'H(U) = U/(60U) is the SAME double round(1/60) for every U in the grid.',
      hValues: hValues.slice(),
      hAllEqual,
      hIsRoundOneOver60,
      hValue: hValues[0],
    }),
    L2_nodesIndexOnly: Object.freeze({
      claim: 'u_i = (i + 0.5) H depends only on the index i and the U-independent H; shared indices are bit-identical.',
      sharedNodesBitIdentical,
      sharedNodeCount: shortGrid.N,
    }),
    L3_compactIEEEsupportUIndependent: Object.freeze({
      claim: 'Phi(u) = 0.0 exactly for u >= u_thr; the nonzero-Phi node set lies inside the SHORTEST window.',
      expUnderflowArg: X_UNDERFLOW,
      uThreshold: U_THRESHOLD,
      iMaxNonzero,
      uLastNonzero,
      phiLastNonzero, // subnormal ~2.09e-309, still nonzero
      uFirstZero,
      phiFirstZero, // exactly 0.0
      shortestWindowNodeCount: PANELS_PER_UNIT * minU,
      supportInsideShortestWindow,
    }),
    L4_extraNodesAddSignedZero: Object.freeze({
      claim: 'Widening U appends only Phi = 0.0 nodes (u > U >= 4); x + (+/-0.0) = x, so the six parts are bit-identical.',
      extraNodesAllZeroPhi,
      extraNodeCount: longGrid.N - shortGrid.N,
      partsBitIdentical,
      partsByU: partsByU.map((p, i) => ({ U: U_GRID[i], ...p })),
    }),
  }),

  measured: Object.freeze({
    cells, // per-U: bisected xiStar, peakSlope, P2 residual
    xiStars,
    xiStarDrift, // must be exactly 0
    xiStarBitIdentical,
    peakSlopeBitIdentical,
    reproducesImp3489,
    verdict,
  }),

  interpretation: Object.freeze({
    whatWasDerived:
      'The exact drift = 0 imp-3489 MEASURED is now DERIVED from four bit-exact lemmas: a U-independent panel width ' +
      '(L1), index-only nodes (L2), a U-independent compact IEEE support with the last nonzero node at index 81 well ' +
      'inside the shortest window (L3), and additive signed zero for every appended node (L4). Together they force ' +
      'C, S, C1, S1, C2, S2 -- hence P2(xi) and its bisected root xi* -- to be the SAME IEEE-754 numbers for every ' +
      'U >= 4. The invariance is bit-exact, not approximate.',
    reconcilesImp3489:
      'This reproduces imp-3489 xi* = 12.08704387272693 on every window and explains its measured drift = 0, ' +
      'settledDrift = 0 and peakSlopeDrift = 0 as forced IEEE-754 equalities rather than fortunate rounding.',
    scopeOfInvariance:
      'The bit-identity holds precisely BECAUSE the compact support (index 81) sits inside the shortest grid window ' +
      '(240 nodes) at the fixed panel width H = 1/60; it is a property of this quadrature configuration, and any ' +
      'window U < 1.375 or a coarser panel would break it. It says nothing new about the transcendence of xi* itself.',
  }),

  honestCaveat: Object.freeze({
    isProof: false, // a floating-point derivation of a NUMERICAL invariance, NOT a theorem about RH
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivesInvarianceNotClosedForm:
      'This DERIVES why xi* is bit-identical across the imp-3240 U-grid; it does NOT give xi* an elementary closed ' +
      'form -- the stationarity equation P2(xi) = 0 stays transcendental (imp-3470).',
    valueStaysTranscendental:
      'C_inf ~ 0.1751 remains a determined number requiring transcendental evaluation; this sharpens (not removes) ' +
      'the imp-3400 caveat by proving the sup is a fixed, U-independent spectral quantity in IEEE-754.',
    invarianceIsQuadratureScoped:
      'The bit-identity is scoped to the imp-3489 quadrature (H = 1/60, U >= 4); it is a numerical fact about the ' +
      'truncated dBN power spectrum on this grid, not a continuum theorem.',
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
export const IMP3506_XISTAR_U_INVARIANCE_BITIDENTITY_DERIVATION_ASSERTIONS = [
  {
    id: 'imp3506-L1-panel-width-U-independent-double',
    why: 'LEMMA 1: H(U) = U/(60U) must be the SAME double round(1/60) for every U (4/240 === 6/360 === 8/480 === ' +
      '10/600); a mismatch would break the identical-node premise the whole derivation rests on.',
    holds: () => hAllEqual && hIsRoundOneOver60 && hValues[0] === 0.016666666666666666,
  },
  {
    id: 'imp3506-L2-shared-nodes-bit-identical',
    why: 'LEMMA 2: nodes u_i = (i + 0.5) H depend only on the index; the first N(minU) nodes and their Phi values ' +
      'must be bit-identical between the shortest and longest windows.',
    holds: () => sharedNodesBitIdentical && shortGrid.N === PANELS_PER_UNIT * minU,
  },
  {
    id: 'imp3506-L3-compact-support-inside-shortest-window',
    why: 'LEMMA 3: the last node carrying nonzero Phi must be index 81 (u = 1.3583, subnormal), index 82 onward ' +
      'exactly 0.0, and 81 < 240 = 60*4 so the full nonzero support sits inside the shortest window; the analytic ' +
      'n=1 underflow threshold u_thr ~ 1.367 must bracket the empirical last/first-zero nodes.',
    holds: () =>
      iMaxNonzero === 81 &&
      phiLastNonzero !== 0 &&
      phiFirstZero === 0 &&
      supportInsideShortestWindow &&
      uLastNonzero < U_THRESHOLD && U_THRESHOLD < uFirstZero,
  },
  {
    id: 'imp3506-L4-extra-nodes-zero-and-parts-bit-identical',
    why: 'LEMMA 4: every node appended when widening U must have Phi = 0.0, and the six Fourier parts C..S2 at the ' +
      'probe frequency must be bit-identical across the whole U-grid (additive signed zero leaves them unchanged).',
    holds: () => extraNodesAllZeroPhi && partsBitIdentical && (longGrid.N - shortGrid.N) > 0,
  },
  {
    id: 'imp3506-conclusion-xistar-bit-identical',
    why: 'CONCLUSION: the deterministic locator must return a bit-identical xi* (drift exactly 0) and bit-identical ' +
      'peak slope across the grid, reproducing the imp-3489 value 12.08704387272693 exactly.',
    holds: () =>
      xiStarBitIdentical && xiStarDrift === 0 && peakSlopeBitIdentical && reproducesImp3489 &&
      cells.length === U_GRID.length,
  },
  {
    id: 'imp3506-verdict-derived',
    why: 'The classified verdict must be the bit-exact-derived split, not indeterminate; a flip means one of the ' +
      'four lemmas or the reconciliation with imp-3489 failed.',
    holds: () => verdict === 'XISTAR-U-INVARIANCE-DERIVED-BIT-EXACT-L1-L4-RECONCILES-imp3489-DRIFT-ZERO',
  },
  {
    id: 'imp3506-honest-assessment-no-qed',
    why: 'Mandatory honesty: DERIVES a numerical bit-identity but is NOT a proof about RH, does NOT close xi* ' +
      '(equation transcendental), invariance is quadrature-scoped, positivity not attempted, RH-equivalent, PT 0.2 ' +
      'stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3506_XISTAR_U_INVARIANCE_BITIDENTITY_DERIVATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.derivesInvarianceNotClosedForm === 'string' &&
        typeof c.invarianceIsQuadratureScoped === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3506_XISTAR_U_INVARIANCE_BITIDENTITY_DERIVATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3506-xistar-U-invariance-bitidentity-derivation assertion failed: ${assertion.id}`);
  }
}

export default IMP3506_XISTAR_U_INVARIANCE_BITIDENTITY_DERIVATION;
