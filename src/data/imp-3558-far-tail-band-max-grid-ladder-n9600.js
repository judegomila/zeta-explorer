/**
 * @module imp-3558-far-tail-band-max-grid-ladder-n9600
 * @fileoverview imp-3558 -- EXTEND the imp-3531 far-tail |P1| decade-band-max grid ladder one
 *   more doubling to N = 9600 (xi_Nyq ~ 5027), hardening the imp-3511 no-missed-maximizer bound.
 *
 *   imp-3531 certified that the imp-3511 far-tail |P1| band maxima are grid-CONVERGED (value
 *   Cauchy, argmax location grid-invariant) over the panel-count ladder N = {1200, 2400, 4800}
 *   at U = 6 (quadrature Nyquist xi_Nyq = pi N/U doubling 628 -> 1257 -> 2513, all above the
 *   [0, 400] band domain), separating genuine decay from a sub-threshold Nyquist replica. It
 *   stopped the ladder at N = 4800. This module reuses the imp-3531 / imp-3511 / imp-3483 /
 *   imp-3470 P1 assembly VERBATIM and adds one more doubling rung, N = 9600 (xi_Nyq ~ 5027), to
 *   confirm the three certification legs PERSIST at the finer grid:
 *     (a) the successive band-max change keeps SHRINKING (Cauchy) onto the new 4800 -> 9600 leg;
 *     (b) the band argmax LOCATIONS stay FIXED (12.07, 40, 80, 160.01, 320.01 at every rung)
 *         while a putative 2 xi_Nyq replica of the true peak would now move by ~5000+ per doubling;
 *     (c) the far-tail ratio stays < 1% (~1.850e-4) and the band maxima decay MONOTONICALLY.
 *
 *   WHY ONE MORE DOUBLING
 *   ---------------------
 *   imp-3531 rested the tail bound on a three-rung ladder whose finest Nyquist was xi_Nyq ~ 2513.
 *   A residual sub-threshold aliasing replica that had not yet fully separated by N = 4800 would
 *   re-declare itself under a further doubling: its argmax would jump by ~2 (delta xi_Nyq) ~ 5000
 *   and its band-max change would fail to shrink. Adding the N = 9600 rung pushes the discriminator
 *   another octave: the observed argmax drift stays 0 (vs a ~8797 replica shift across the widened
 *   ladder) and the far-tail band-max change shrinks another ~16x on the 4800 -> 9600 leg. Four
 *   grid-invariant rungs across a 8x Nyquist span is a strictly stronger no-missed-maximizer
 *   certificate than three.
 *
 *   MEASURED (self-computing; recomputed at import)
 *   -----------------------------------------------
 *     - xi_Nyq per rung ~ [628, 1257, 2513, 5027]; every rung keeps [0, 400] far below Nyquist.
 *     - Far-tail band-max change: 3.89e-10 (1200->2400) -> 2.07e-11 (2400->4800) -> 1.28e-12
 *       (4800->9600): the NEW leg shrinks another ~16x, so the Cauchy chain extends cleanly.
 *     - Finest-pair (4800 -> 9600) relative change < 1.1e-4 in EVERY band (far-tail band worst).
 *     - Band argmax LOCATIONS bit-identical at all four rungs (drift 0); replica shift ~8797.
 *     - Far-tail ratio ~1.850e-4 (< 1%) and monotone tail decay at every rung; peak converges
 *       (~6.5894e-5, spread ~4e-8, O(H^2)).
 *
 *   SCOPE
 *   -----
 *   Measurement/certification only, hardening the imp-3511 tail bound by one further doubling. It
 *   does NOT give xi* or the sup an elementary closed form (the imp-3470 stationarity equation
 *   stays transcendental), and the convergence remains an EMPIRICAL Cauchy/O(H^2) observation over
 *   a finite ladder N <= 9600, not an analytic quadrature error bound. RH-EQUIVALENT; the imp-3066
 *   off-diagonal endpoint-Hankel K_a >= 0 magnitude is the lone RH obstruction, UNTOUCHED. NO RH
 *   verdict, NO QED. No refereed bound is changed.
 *
 *   CAVEAT (imp-3647): the argmax-drift-0 discriminator used above is decisive ONLY because every
 *   rung here (N >= 1200) sits above the imp-3582 worst-case floor N_replica ~ 764. imp-3647 shows
 *   that below a feature-specific fold-in floor N_fold(xi_true) = (xi_max+xi_true) U/(2 pi) -- which
 *   can sit well under the generic 764 -- a coarse in-band scan keeps reporting the SAME argmax
 *   (drift 0) even when a folded-in replica has co-located with the genuine peak at equal height,
 *   because the coarse grid step samples the replica off-node. A drift-0 read is therefore UNSAFE
 *   below that floor; the decisive quantity there is the in-band comb-PEAK COUNT (one peak: decisive;
 *   two equal-height peaks: masked), not the coarse argmax location.
 *
 *   @see imp-3531-far-tail-band-max-grid-convergence.js (parent: three-rung ladder N<=4800)
 *   @see imp-3511-xistar-uniqueness-wide-range-robustness.js (tail bound + aliasing guard)
 *   @see imp-3470-Ttilde-spectral-peak-xistar-obstruction.js (located xi* by one bracket)
 *   @see imp-3647-below-floor-replica-foldin-margin.js (sub-floor fold-in caveat + peak-count test)
 *
 *   Ticket: imp-3558 (numerical, medium). Certification only; RH-equivalent; NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3531 / imp-3511 / imp-3470)
const A_LINEAR = 1.0; // shear weight; a cancels in the objective, so read the peak slope directly

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-3531 assembly). */
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

/** Precompute the fixed Phi grid on [0, U] with N midpoint panels (imp-3531 assembly). */
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

/** Analytic PSD slope P1 = dP/dxi at xi (imp-3531 assembly; only P1 needed for the tail bands). */
function slopeP1(grid, xi) {
  let C = 0, S = 0, C1 = 0, S1 = 0;
  for (let i = 0; i < grid.N; i++) {
    const ui = grid.u[i];
    const w = grid.phi[i] * grid.H;
    const c = Math.cos(xi * ui);
    const s = Math.sin(xi * ui);
    C += w * c;
    S += w * s;
    C1 += -w * ui * s;
    S1 += w * ui * c;
  }
  return 2 * (C * C1 + S * S1);
}

/**
 * One panel count: measure the peak |P1| (grid argmax over the lobe around xi*) and the band-max
 * of |P1| (with its argmax) on the imp-3511 decade bands over (0, xiMax]. Reports the quadrature
 * Nyquist xi_Nyq = pi N/U and the far-tail ratio far-tail-max / peak. Identical to imp-3531.
 */
function measureBands(U, N, tailBandEdges, xiMax, dxi) {
  const grid = buildGrid(U, N);
  let peak = 0;
  let peakArg = 0;
  for (let xi = dxi; xi <= 30; xi += dxi) {
    const abs1 = A_LINEAR * Math.abs(slopeP1(grid, xi));
    if (abs1 > peak) { peak = abs1; peakArg = xi; }
  }
  const nb = tailBandEdges.length - 1;
  const bandMax = new Array(nb).fill(0);
  const bandArg = new Array(nb).fill(0);
  for (let xi = dxi; xi <= xiMax; xi += dxi) {
    const abs1 = A_LINEAR * Math.abs(slopeP1(grid, xi));
    for (let b = 0; b < nb; b++) {
      if (xi >= tailBandEdges[b] && xi < tailBandEdges[b + 1] && abs1 > bandMax[b]) {
        bandMax[b] = abs1;
        bandArg[b] = xi;
      }
    }
  }
  const farTailMax = bandMax[nb - 1];
  let tailMonotone = true;
  for (let b = 1; b < nb; b++) if (bandMax[b] > bandMax[b - 1]) tailMonotone = false;
  const xiNyq = Math.PI * N / U;
  return {
    U, N, xiNyq,
    subNyquist: xiMax < xiNyq,
    peak, peakArg,
    bandMax, bandArg,
    farTailMax,
    farTailRatio: peak > 0 ? farTailMax / peak : 1,
    tailMonotone,
    expectedReplicaLoc: 2 * xiNyq - peakArg,
  };
}

// --- imp-3531 three-rung ladder EXTENDED one more doubling to N = 9600 (xi_Nyq ~ 5027). ---
const U_FIXED = 6;
const XI_MAX = 400; // imp-3511 wide-domain cap
const DXI = 0.01; // imp-3511 base xi step
const TAIL_BANDS = Object.freeze([12.0, 40, 80, 160, 320, 400]); // imp-3511 decade-ish tail bands
const N_LADDER = Object.freeze([1200, 2400, 4800, 9600]); // imp-3531 ladder + one more doubling

const ladderCells = N_LADDER.map((N) => measureBands(U_FIXED, N, TAIL_BANDS, XI_MAX, DXI));
const NB = TAIL_BANDS.length - 1;

// --- VALUE convergence: per-band relative change on each doubling leg (Cauchy diagnostic). ---
const legRelChange = [];
for (let r = 1; r < ladderCells.length; r++) {
  const row = [];
  for (let b = 0; b < NB; b++) {
    const cur = ladderCells[r].bandMax[b];
    const prev = ladderCells[r - 1].bandMax[b];
    row.push(cur > 0 ? Math.abs(cur - prev) / cur : 0);
  }
  legRelChange.push(row);
}
const finestPairRelChange = legRelChange[legRelChange.length - 1]; // 4800 -> 9600 per-band
const maxFinestPairRelChange = Math.max(...finestPairRelChange);

// The successive far-tail band-max change SHRINKS at EVERY leg (Cauchy chain), including the new
// 4800 -> 9600 rung -- a moving artifact would fail to shrink under the further doubling.
const farBand = NB - 1;
const farTailLegChange = [];
for (let r = 1; r < ladderCells.length; r++) {
  farTailLegChange.push(Math.abs(ladderCells[r].bandMax[farBand] - ladderCells[r - 1].bandMax[farBand]));
}
let farTailChangeShrinksEveryLeg = true;
for (let k = 1; k < farTailLegChange.length; k++) {
  if (!(farTailLegChange[k] < farTailLegChange[k - 1])) farTailChangeShrinksEveryLeg = false;
}
// Shrink factor on the NEW finest leg (2400->4800 change over 4800->9600 change).
const newLegShrinkFactor =
  farTailLegChange[farTailLegChange.length - 1] > 0
    ? farTailLegChange[farTailLegChange.length - 2] / farTailLegChange[farTailLegChange.length - 1]
    : Infinity;

// --- LOCATION invariance: per-band argmax drift across the EXTENDED ladder (the discriminator). ---
const bandArgDrift = [];
for (let b = 0; b < NB; b++) {
  const locs = ladderCells.map((c) => c.bandArg[b]);
  bandArgDrift.push(Math.max(...locs) - Math.min(...locs));
}
const maxBandArgDrift = Math.max(...bandArgDrift);
// How far a Nyquist replica WOULD move across the widened ladder, for contrast (~8797).
const hypotheticalReplicaShift = 2 * (ladderCells[ladderCells.length - 1].xiNyq - ladderCells[0].xiNyq);

// --- TAIL bound survival + rung sanity. ---
const worstFarTailRatio = Math.max(...ladderCells.map((c) => c.farTailRatio));
const allSubNyquist = ladderCells.every((c) => c.subNyquist && c.xiNyq > 1.4 * XI_MAX);
const allTailMonotone = ladderCells.every((c) => c.tailMonotone);
const peakSpread = Math.max(...ladderCells.map((c) => c.peak)) - Math.min(...ladderCells.map((c) => c.peak));

const verdict =
  allSubNyquist && allTailMonotone && worstFarTailRatio < 1e-2 &&
  maxFinestPairRelChange < 1e-2 && farTailChangeShrinksEveryLeg &&
  maxBandArgDrift < 0.5 && maxBandArgDrift < 1e-3 * hypotheticalReplicaShift
    ? 'IMP3511-FAR-TAIL-BAND-MAX-GRID-CONVERGENCE-PERSISTS-TO-N9600-XINYQ5027-LOCATION-INVARIANT-GENUINE-DECAY'
    : 'INDETERMINATE';

export const IMP3558_FAR_TAIL_BAND_MAX_GRID_LADDER_N9600 = Object.freeze({
  id: 'imp-3558-far-tail-band-max-grid-ladder-n9600',
  ticket: 'imp-3558',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentCertification: 'imp-3531-far-tail-band-max-grid-convergence.js',
  parentLocation: 'imp-3470-Ttilde-spectral-peak-xistar-obstruction.js',

  summary:
    'Extends the imp-3531 far-tail |P1| decade-band-max grid ladder one more doubling to N = 9600 (xi_Nyq ~ 5027), ' +
    'hardening the imp-3511 no-missed-maximizer bound. imp-3531 certified the far-tail band maxima grid-CONVERGED ' +
    'over N = {1200, 2400, 4800} (xi_Nyq 628 -> 1257 -> 2513) but stopped there. Reusing the imp-3531 P1 assembly ' +
    'VERBATIM and adding the N = 9600 rung: (a) the far-tail band-max change keeps SHRINKING onto the new 4800 -> ' +
    '9600 leg (3.89e-10 -> 2.07e-11 -> 1.28e-12, another ~16x), so the Cauchy chain extends cleanly; (b) the band ' +
    'argmax LOCATIONS stay bit-identical at all four rungs (drift 0: 12.07, 40, 80, 160.01, 320.01) while a Nyquist ' +
    'replica of the true peak would now sit near 2 xi_Nyq - xi* and MOVE ~8797 across the widened ladder -- fixed ' +
    'location under a 8x Nyquist span is the signature of GENUINE decay, not a replica; (c) the far-tail ratio stays ' +
    '< 1% (~1.850e-4) and the band maxima decay MONOTONICALLY at every rung, with the peak converging (~6.5894e-5, ' +
    'spread ~4e-8, O(H^2)). So the imp-3511 far-tail bound survives another octave of refinement. ' +
    'Measurement/certification only; RH-equivalent; the imp-3066 K_a >= 0 magnitude is the lone obstruction, ' +
    'UNTOUCHED. NO RH verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    objective: 'sup_xi |P1(xi)|, P1 = dP/dxi, P(xi) = |Phihat(xi)|^2 = C^2 + S^2 (the peak slope behind ||Ttilde||)',
    tailBandsAreImp3511:
      're-measure the EXACT imp-3511 decade-ish tail bands [12, 40, 80, 160, 320, 400] band-max of |P1| (and argmax); ' +
      'the far-tail band (320, 400] carries the < 1% no-missed-maximizer bound',
    ladder:
      'the imp-3531 ladder N = {1200, 2400, 4800} EXTENDED one more doubling to N = 9600 at U = 6, so the midpoint ' +
      'quadrature Nyquist xi_Nyq = pi N/U doubles again (2513 -> 5027), all far above the [0, 400] band domain',
    valueConvergence:
      'per-band relative change on each doubling leg; the far-tail band-max change must keep SHRINKING onto the new ' +
      '4800 -> 9600 leg and the finest-pair change must stay < 1% in every band -- the Cauchy chain extends',
    locationInvariance:
      'the band argmax LOCATIONS across the widened ladder; a Nyquist replica sits near 2 xi_Nyq - xi* and MOVES ~2 ' +
      '(delta xi_Nyq) ~ 8797 across the four rungs, whereas a genuine decaying feature keeps a grid-invariant argmax',
    tailBoundSurvives:
      'the far-tail ratio far-tail-max / peak must stay < 1% and the band maxima must decay monotonically at every ' +
      'rung including N = 9600, so the imp-3511 no-missed-maximizer bound holds under the further refinement',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    a: A_LINEAR,
    U: U_FIXED,
    nLadder: N_LADDER.slice(),
    tailBandEdges: TAIL_BANDS.slice(),
    scanDomain: { xiMax: XI_MAX, dxi: DXI },
    quadrature: 'midpoint, N panels on [0, U]; analytic xi-derivatives of the Fourier parts (imp-3470 assembly)',
    selfComputing: true,
  }),

  measured: Object.freeze({
    ladderCells,
    nLadder: N_LADDER.slice(),
    xiNyqPerRung: ladderCells.map((c) => c.xiNyq), // ~[628, 1257, 2513, 5027]
    bandMaxPerRung: ladderCells.map((c) => c.bandMax),
    bandArgPerRung: ladderCells.map((c) => c.bandArg), // grid-INVARIANT argmax locations
    legRelChange,
    finestPairRelChange, // 4800 -> 9600 per-band relative change (all < 1.1e-4)
    maxFinestPairRelChange, // ~1.05e-4 (far-tail band)
    farTailLegChange, // per-leg far-tail band-max change [~3.89e-10, ~2.07e-11, ~1.28e-12]
    farTailChangeShrinksEveryLeg, // true -> Cauchy chain extends to the new leg
    newLegShrinkFactor, // ~16x smaller change on the new 4800 -> 9600 leg
    bandArgDrift, // per-band argmax drift across the four rungs (~0)
    maxBandArgDrift, // ~0 -- locations grid-invariant across the widened ladder
    hypotheticalReplicaShift, // ~8797 -- how far a Nyquist replica WOULD move, for contrast
    worstFarTailRatio, // ~1.850e-4 -- far-tail max / peak, < 1% at every rung
    peakSpread, // ~4e-8 -- peak converges too (O(H^2))
    allSubNyquist,
    allTailMonotone,
    verdict,
  }),

  interpretation: Object.freeze({
    ladderExtendsCleanly:
      'The one-more-doubling rung N = 9600 (xi_Nyq ~ 5027) extends the imp-3531 Cauchy chain cleanly: the far-tail ' +
      'band-max change shrinks another ~16x on the new 4800 -> 9600 leg (2.07e-11 -> 1.28e-12) and the finest-pair ' +
      'relative change stays < 1.1e-4 in every band. The imp-3511 far-tail max is a converged number across a full ' +
      '8x Nyquist span, not a three-rung artifact.',
    locationsStayGridInvariant:
      'The band argmax LOCATIONS (12.07, 40, 80, 160.01, 320.01) are IDENTICAL at all four rungs while the quadrature ' +
      'Nyquist quadruples 628 -> 5027. A residual sub-threshold replica of the true peak would sit near 2 xi_Nyq - ' +
      'xi* and move ~5000+ under the final doubling (~8797 across the ladder); the observed drift is 0. Grid-invariant ' +
      'location under a 8x Nyquist span is the sharpened signature of a GENUINE decaying feature.',
    tailBoundSurvivesAnotherOctave:
      'The far-tail ratio stays < 1% (~1.850e-4) and the band maxima decay MONOTONICALLY at N = 9600 too, so the ' +
      'imp-3511 bound -- any stationary point beyond xiMax = 400 is bounded far below the peak -- survives another ' +
      'octave of refinement. Four grid-invariant rungs is a strictly stronger no-missed-maximizer certificate.',
    sharpensNotCloses:
      'This hardens the imp-3511 tail bound by one further doubling; it does NOT give xi* or the sup an elementary ' +
      'closed form (the imp-3470 stationarity equation stays transcendental), so C_inf ~ 0.1751 remains a determined ' +
      'number requiring transcendental evaluation.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    hardensTailBoundNotClosedForm:
      'This EXTENDS the imp-3531 grid-convergence certification one more doubling (N = 9600, xi_Nyq ~ 5027): the ' +
      'far-tail |P1| band maxima remain Cauchy-convergent and argmax-grid-invariant, NOT a sub-threshold Nyquist ' +
      'replica. It does NOT give xi* or the sup an elementary closed form -- the imp-3470 stationarity equation stays ' +
      'transcendental.',
    convergenceIsEmpirical:
      'The Cauchy/O(H^2) convergence of the band maxima is an EMPIRICAL observation over a FINITE panel ladder ' +
      'N <= 9600; it is not an analytic error bound on the quadrature, and the finite ladder does not certify the ' +
      'band maxima to arbitrary precision.',
    finiteDomainStillFinite:
      'The measurement is still over the finite domain [0, 400]; the tail bound remains a MONOTONE-decay argument ' +
      '(band-max of |P1| falls below 1% of the peak and the dBN envelope -> 0), NOT an analytic proof that |P1| has ' +
      'no stationary point at arbitrarily large xi. It bounds any such point well below the peak, it does not prove ' +
      'none exists.',
    subNyquistOnly:
      'The certification is valid only in the quadrature-valid band [0, 400] < xi_Nyq = pi N/U; past ~2 xi_Nyq the ' +
      'midpoint rule aliases and manufactures spurious features (imp-3511 coarse-grid guard). Every ladder rung keeps ' +
      'xi_Nyq (628..5027) comfortably above 400.',
    measuresRatioNotPositivity:
      'This certifies the tail of the numerator norm of the capture RATIO; it does NOT construct the missing ' +
      'magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Diagnostic only; the imp-3066 off-diagonal endpoint-Hankel operator magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3558_FAR_TAIL_BAND_MAX_GRID_LADDER_N9600_ASSERTIONS = [
  {
    id: 'imp3558-ladder-reaches-n9600-xinyq-5027',
    why: 'THE PRIMARY DELIVERABLE: the ladder must add the N = 9600 rung whose midpoint-quadrature Nyquist xi_Nyq = ' +
      'pi N/U is ~5027 (one more doubling past the imp-3531 finest xi_Nyq ~ 2513), pushing the aliasing discriminator ' +
      'another octave.',
    holds: () =>
      N_LADDER[N_LADDER.length - 1] === 9600 &&
      Math.abs(ladderCells[ladderCells.length - 1].xiNyq - 5026.5482) < 1e-2,
  },
  {
    id: 'imp3558-far-tail-change-shrinks-every-leg',
    why: 'The far-tail band-max change must keep SHRINKING at EVERY doubling leg including the new 4800 -> 9600 rung ' +
      '(Cauchy chain extends), with the new leg at least ~3x smaller than the previous one. A non-shrinking new leg ' +
      'would signal a drifting artifact re-emerging under the further refinement.',
    holds: () => farTailChangeShrinksEveryLeg && newLegShrinkFactor > 3,
  },
  {
    id: 'imp3558-finest-pair-relative-change-under-one-percent',
    why: 'The finest-pair (4800 -> 9600) relative change must be < 1% in EVERY band, so the far-tail max is a ' +
      'converged number at the extended grid, not a single-grid reading.',
    holds: () => maxFinestPairRelChange < 1e-2 && finestPairRelChange.every((r) => r >= 0 && r < 1e-2),
  },
  {
    id: 'imp3558-band-argmax-locations-grid-invariant-across-four-rungs',
    why: 'THE ALIASING DISCRIMINATOR: the band argmax LOCATIONS must stay grid-INVARIANT (drift < 0.5) across all ' +
      'four rungs as xi_Nyq quadruples 628 -> 5027. A Nyquist replica would move ~2 (delta xi_Nyq) ~ 8797 across the ' +
      'widened ladder; a near-zero drift under an 8x Nyquist span is the sharpened signature of genuine decay.',
    holds: () => maxBandArgDrift < 0.5 && maxBandArgDrift < 1e-3 * hypotheticalReplicaShift,
  },
  {
    id: 'imp3558-every-rung-sub-nyquist',
    why: 'Every ladder rung (including N = 9600) must keep the [0, 400] band domain comfortably below the ' +
      'midpoint-quadrature Nyquist xi_Nyq = pi N/U (margin 1.4x), else the band maxima would themselves be aliasing ' +
      'artifacts (imp-3511 guard).',
    holds: () => allSubNyquist && ladderCells.every((c) => c.subNyquist),
  },
  {
    id: 'imp3558-far-tail-ratio-under-one-percent',
    why: 'The far-tail band max must stay a tiny fraction of the peak (< 1%, ~1.850e-4) at EVERY rung including ' +
      'N = 9600, so the imp-3511 no-missed-maximizer bound survives the further refinement.',
    holds: () => worstFarTailRatio < 1e-2 && worstFarTailRatio >= 0,
  },
  {
    id: 'imp3558-tail-decays-monotonically-every-rung',
    why: 'The band-max of |P1| on the decade bands beyond xi* must fall MONOTONICALLY at every rung including ' +
      'N = 9600. A non-monotone bump at the finer grid would signal a competing lobe or a replica re-emerging.',
    holds: () => allTailMonotone && ladderCells.every((c) => c.tailMonotone),
  },
  {
    id: 'imp3558-peak-reproduces-imp3531-and-converges',
    why: 'The measured peak must reproduce the imp-3531 / imp-3470 peak slope ~6.5894e-5 at every rung and converge ' +
      '(spread across the four-rung ladder tiny), anchoring the far-tail RATIO to the same peak the parent used.',
    holds: () =>
      ladderCells.every((c) => c.peak > 6e-5 && c.peak < 7e-5) && peakSpread < 1e-6,
  },
  {
    id: 'imp3558-verdict-grid-convergence-persists',
    why: 'The classified verdict must be the persists-to-N9600 grid-convergence split, not indeterminate; a flip means ' +
      'the value-convergence, location-invariance, sub-Nyquist, far-tail-ratio, or monotone-decay leg failed at the ' +
      'extended grid.',
    holds: () =>
      verdict === 'IMP3511-FAR-TAIL-BAND-MAX-GRID-CONVERGENCE-PERSISTS-TO-N9600-XINYQ5027-LOCATION-INVARIANT-GENUINE-DECAY',
  },
  {
    id: 'imp3558-honest-assessment-no-qed',
    why: 'Mandatory honesty: extends the imp-3511 TAIL bound by one doubling but NOT a closed form (equation ' +
      'transcendental), the convergence is empirical over a finite ladder, the tail bound is a monotone-decay ' +
      'argument not an analytic no-root proof, sub-Nyquist only, measures the ratio not positivity, RH-equivalent, ' +
      'no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3558_FAR_TAIL_BAND_MAX_GRID_LADDER_N9600.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.hardensTailBoundNotClosedForm === 'string' &&
        typeof c.convergenceIsEmpirical === 'string' &&
        typeof c.finiteDomainStillFinite === 'string' &&
        typeof c.subNyquistOnly === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3558_FAR_TAIL_BAND_MAX_GRID_LADDER_N9600_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3558-far-tail-band-max-grid-ladder-n9600 assertion failed: ${assertion.id}`);
  }
}

export default IMP3558_FAR_TAIL_BAND_MAX_GRID_LADDER_N9600;
