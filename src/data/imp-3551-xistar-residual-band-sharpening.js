/**
 * @module imp-3551-xistar-residual-band-sharpening
 * @fileoverview imp-3551 -- SHARPEN the imp-3523/imp-3548 residual band on the grid-converged
 *   PSD peak-slope maximizer xi*_inf ~ 12.0666876 below its CONSERVATIVE 1e-6, using the
 *   imp-3548 extrapolation-free composite 5-point Gauss-Legendre ladder that is bit-stable
 *   (converged-tail spread < 1e-8) from N = 90 through N = 720 WITHOUT any Richardson model.
 *
 *   WHY THIS IS NEEDED
 *   ------------------
 *   imp-3548 CONFIRMED that xi*_inf is quadrature-scheme-invariant -- an order-10 composite
 *   Gauss-Legendre rule (no extrapolation) and a composite trapezoid + its own 1/N^2 Richardson
 *   both land on the imp-3523 midpoint-extrapolated value. But imp-3548 explicitly capped its
 *   scope: it "does not sharpen the residual band", which stayed quoted at imp-3523s
 *   CONSERVATIVE 1e-6 even though its own converged Gauss-Legendre tail moved by < 1e-8. That
 *   left a 1e-6 uncertainty attached to a value that three independent numerical routes agree
 *   on to ~1e-9 or better -- a band six orders looser than the measured convergence. This
 *   module closes that gap: it recomputes the extrapolation-free Gauss-Legendre ladder, MEASURES
 *   the converged-tail bit-stability spread, and certifies a SHARPENED quadrature residual band
 *   as the smallest clean decade strictly above that measured spread.
 *
 *   THE MEASURED CONVERGENCE (self-computed here; identical de Bruijn-Newman kernel, NPHI = 10,
 *   U = 6, xi-scan [1e-4, 60] as imp-3523 / imp-3548)
 *   ----------------------------------------------------------------------------------------
 *     - Gauss-Legendre ladder (N = 45, 90, 180, 360, 720): the located P2 = 0 root is
 *       12.0666876106 already at N = 90 and settles to 12.0666876100 by N = 180, then holds.
 *     - CONVERGED-TAIL spread over N >= 90: ~6.5e-10 (dominated by the single N = 90 -> 180
 *       settling step; the DEEP tail N >= 180 is bit-stable to < 5e-13).
 *     - No extrapolation model is used at all -- the high-order rule resolves the smooth
 *       Phi-integrand directly, so this spread is a genuine convergence measurement, not an
 *       extrapolation-model residual.
 *
 *   THE SHARPENED BAND (data-derived, conservative)
 *   -----------------------------------------------
 *   sharpenedBand = 10^ceil(log10(tailSpread)) -- the smallest power-of-ten strictly ABOVE the
 *   measured converged-tail spread. With tailSpread ~6.5e-10 this rounds UP to 1e-9, guaranteed
 *   to bound the observed spread with headroom while staying a clean decade. That is 1000x
 *   TIGHTER than the imp-3523/imp-3548 conservative 1e-6, and it is corroborated (not merely
 *   asserted) by two INDEPENDENT routes that this module also re-checks: the composite trapezoid
 *   + Richardson limit agrees with the Gauss-Legendre limit to ~1e-15, and both sit ~4e-11 from
 *   the imp-3523 8-figure headline 12.06668761 -- every independent discrepancy lands strictly
 *   INSIDE the sharpened 1e-9 band.
 *
 *   SCOPE
 *   -----
 *   Measurement/certification only. This sharpens the QUADRATURE-CONVERGENCE residual band for
 *   the FIXED (NPHI = 10, U = 6) model -- exactly the band imp-3523 quoted -- from 1e-6 to 1e-9.
 *   It does NOT re-derive an analytic error bound, does NOT quantify the fixed NPHI/U truncation
 *   or domain systematics (which are constant across the ladder and cancel in the spread), and
 *   does NOT give xi* a closed form -- the imp-3470 stationarity equation stays transcendental.
 *   RH-EQUIVALENT; the imp-3066 off-diagonal endpoint-Hankel K_a >= 0 magnitude is the lone RH
 *   obstruction, UNTOUCHED. NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.
 *
 *   @see imp-3548-xistar-quadrature-scheme-invariance.js (scheme-invariance; capped its scope here)
 *   @see imp-3523-xistar-panel-count-convergence-limit.js (midpoint ladder; pinned xi*_inf, 1e-6 band)
 *   @see imp-3470-Ttilde-spectral-peak-xistar-obstruction.js (P2 assembly; located xi*)
 *
 *   Ticket: imp-3551 (accuracy, medium). Measurement/certification only; RH-equivalent; NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3548 / imp-3523 / imp-3470)

// imp-3523 headline converged location and its CONSERVATIVE residual band (baked literals so
// this module stays a light, self-contained cross-check and imports no heavy bundle).
const XISTAR_INF_IMP3523 = 12.06668761;
const RESIDUAL_BAND_IMP3523 = 1e-6; // the conservative band imp-3548 declined to sharpen

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-3548 / imp-3523 assembly). */
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

// --- Composite 5-point Gauss-Legendre on [-1, 1] (order-10 per panel; imp-3548 nodes/weights). ---
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
  return { u, w, M };
}

/** PSD curvature P2 = d2P/dxi2 at xi on a (node, phi*weight) grid (imp-3548 / imp-3523 assembly). */
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

/** Bisect P2 = 0 on a sign-changing bracket [lo, hi] (100 halvings; imp-3548 / imp-3523). */
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

/** Locate the FIRST P2 sign change on [xiLo, xiHi] at step dxi and bisect it to a root. */
function locateRoot(grid, xiLo, xiHi, dxi) {
  let prevXi = xiLo;
  let prev = curvatureP2(grid, prevXi);
  for (let xi = xiLo + dxi; xi <= xiHi; xi += dxi) {
    const cur = curvatureP2(grid, xi);
    if (prev * cur < 0) return bisectP2(grid, prevXi, xi);
    prev = cur;
    prevXi = xi;
  }
  return NaN;
}

// --- Fixed enumeration domain (identical to imp-3548 / imp-3523). ---
const U_FIXED = 6;
const XI_LO = 1e-4;
const XI_HI = 60;
const DXI = 0.01;

// --- Extrapolation-free Gauss-Legendre ladder (imp-3548 rungs). ---
const GL_N_LADDER = Object.freeze([45, 90, 180, 360, 720]);
const glLadder = GL_N_LADDER.map((N) => locateRoot(buildGridGaussLegendre(U_FIXED, N), XI_LO, XI_HI, DXI));
const glLimit = glLadder[glLadder.length - 1]; // finest GL rung == converged (NO extrapolation)

// Converged tail (N >= 90): the coarse N = 45 rung is still ~3e-6 off, so drop it.
const glTail = glLadder.slice(1); // N = 90, 180, 360, 720
const glTailSpread = Math.max(...glTail) - Math.min(...glTail); // ~6.5e-10 -- the sharpening driver

// Consecutive settling steps across the tail (largest is the N = 90 -> 180 step).
const glTailSteps = [];
for (let i = 1; i < glTail.length; i++) glTailSteps.push(Math.abs(glTail[i] - glTail[i - 1]));
const glMaxTailStep = Math.max(...glTailSteps);

// DEEP tail (N >= 180): bit-stable to < 5e-13, reported for context but NOT used to set the band.
const glDeepTail = glLadder.slice(2); // N = 180, 360, 720
const glDeepTailSpread = Math.max(...glDeepTail) - Math.min(...glDeepTail);

// --- The SHARPENED band: smallest clean decade strictly above the measured converged-tail spread. ---
const sharpenedBand = Math.pow(10, Math.ceil(Math.log10(glTailSpread))); // ~6.5e-10 -> 1e-9
const sharpeningFactor = RESIDUAL_BAND_IMP3523 / sharpenedBand; // 1e-6 / 1e-9 = 1000
const bandStrictlyTighter = sharpenedBand < RESIDUAL_BAND_IMP3523;
const bandBoundsTailSpread = sharpenedBand > glTailSpread; // conservative: band exceeds the measured spread
const bandBoundsMaxStep = sharpenedBand > glMaxTailStep;

// --- Independent-route corroboration (all baked from imp-3548s self-computed limits; each must
//     land INSIDE the sharpened band or the sharpening is unjustified). ---
const TRAP_RICHARDSON_LIMIT_IMP3548 = 12.0666876099614; // imp-3548 trapezoid + Richardson limit
const glVsTrapRichardson = Math.abs(glLimit - TRAP_RICHARDSON_LIMIT_IMP3548); // ~1e-15 (machine)
const glVsImp3523Headline = Math.abs(glLimit - XISTAR_INF_IMP3523); // ~4e-11
const trapVsImp3523Headline = Math.abs(TRAP_RICHARDSON_LIMIT_IMP3548 - XISTAR_INF_IMP3523); // ~4e-11
const maxIndependentDiscrepancy = Math.max(glVsTrapRichardson, glVsImp3523Headline, trapVsImp3523Headline);
const allRoutesInsideSharpenedBand = maxIndependentDiscrepancy < sharpenedBand;

// The sharpened uncertainty quote: xi*_inf = 12.0666876100 +/- 1e-9.
const XISTAR_INF_SHARPENED = glLimit;

const verdict =
  bandStrictlyTighter && bandBoundsTailSpread && bandBoundsMaxStep &&
  allRoutesInsideSharpenedBand && glTailSpread < 1e-8 && sharpenedBand <= 1e-9
    ? 'XISTAR-INF-RESIDUAL-BAND-SHARPENED-1e-6-TO-1e-9-VIA-EXTRAPOLATION-FREE-GAUSS-LEGENDRE'
    : 'INDETERMINATE';

export const IMP3551_XISTAR_RESIDUAL_BAND_SHARPENING = Object.freeze({
  id: 'imp-3551-xistar-residual-band-sharpening',
  ticket: 'imp-3551',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentCertification: 'imp-3548-xistar-quadrature-scheme-invariance.js',
  grandparentCertification: 'imp-3523-xistar-panel-count-convergence-limit.js',

  summary:
    'Sharpens the imp-3523/imp-3548 residual band on the grid-converged PSD peak-slope maximizer xi*_inf ~ 12.0666876 ' +
    'from its CONSERVATIVE 1e-6 down to 1e-9 (1000x tighter) using the imp-3548 extrapolation-free composite 5-point ' +
    'Gauss-Legendre ladder. imp-3548 confirmed xi*_inf is quadrature-scheme-invariant and that its order-10 ' +
    'Gauss-Legendre tail is bit-stable WITHOUT any Richardson model, but its scope explicitly declined to sharpen the ' +
    'band. Re-solving P2(xi) = 0 on the same de Bruijn-Newman kernel (NPHI = 10, U = 6), the located root is ' +
    '12.0666876106 at N = 90 and settles to 12.0666876100 by N = 180, giving a converged-tail (N >= 90) spread of ' +
    '~6.5e-10 with the DEEP tail (N >= 180) bit-stable to < 5e-13. The sharpened band is set data-derived as the ' +
    'smallest clean decade strictly above that spread -- 10^ceil(log10(spread)) = 1e-9 -- and is corroborated: the ' +
    'independent trapezoid + Richardson limit agrees to ~1e-15 and both sit ~4e-11 from the imp-3523 headline, so ' +
    'every independent discrepancy lands strictly inside 1e-9. Sharpened quote: xi*_inf = 12.0666876100 +/- 1e-9. ' +
    'Measurement/certification only; sharpens the QUADRATURE-CONVERGENCE band for the fixed (NPHI = 10, U = 6) model, ' +
    'NOT the fixed truncation/domain systematics, and gives NO closed form (imp-3470 equation stays transcendental). ' +
    'RH-equivalent; the imp-3066 K_a >= 0 magnitude is the lone obstruction, UNTOUCHED. NO RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    objective: 'sup_xi |P1(xi)|, P1 = dP/dxi, P(xi) = |Phihat(xi)|^2 = C^2 + S^2 (the peak slope behind ||Ttilde||)',
    maximizerIsP2Root:
      'the global maximizer of |P1| is a root of P2 = dP1/dxi (imp-3483); imp-3511 certified EXACTLY ONE such root per ' +
      'U window; imp-3523 pinned its midpoint-converged LOCATION with a conservative 1e-6 band; imp-3548 confirmed the ' +
      'location is quadrature-rule-invariant but declined to sharpen the band -- this module sharpens it',
    gaussLegendre:
      'composite 5-point Gauss-Legendre per panel on [0, U]; an order-10 rule resolves the smooth Phi-integrand to ' +
      'machine precision at modest N, so the located root needs NO Richardson model and its converged-tail spread is a ' +
      'genuine convergence measurement rather than an extrapolation-model residual',
    bandRule:
      'sharpenedBand = 10^ceil(log10(convergedTailSpread)): the smallest power-of-ten strictly ABOVE the measured ' +
      'N >= 90 tail spread, guaranteeing the band conservatively bounds the observed convergence while staying a clean ' +
      'decade for reporting',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    U: U_FIXED,
    glLadder: GL_N_LADDER.slice(),
    scanDomain: { xiLo: XI_LO, xiHi: XI_HI, dxi: DXI },
    xistarInfImp3523: XISTAR_INF_IMP3523,
    residualBandImp3523: RESIDUAL_BAND_IMP3523,
    selfComputing: true,
  }),

  measured: Object.freeze({
    glLadder, // [12.0666908239, 12.0666876106, 12.0666876100, 12.0666876100, 12.0666876100]
    glLimit, // 12.0666876100 -- finest GL rung, no extrapolation
    glTail, // N >= 90 converged tail
    glTailSpread, // ~6.5e-10 -- the sharpening driver
    glTailSteps, // consecutive settling steps; largest is the N = 90 -> 180 step
    glMaxTailStep,
    glDeepTail, // N >= 180
    glDeepTailSpread, // < 5e-13 -- deep tail bit-stable (context, not band-setting)
    sharpenedBand, // 1e-9
    sharpeningFactor, // 1000 -- vs the imp-3523/imp-3548 conservative 1e-6
    bandStrictlyTighter,
    bandBoundsTailSpread,
    bandBoundsMaxStep,
    glVsTrapRichardson, // ~1e-15 -- independent order-10 vs trapezoid+Richardson
    glVsImp3523Headline, // ~4e-11
    trapVsImp3523Headline, // ~4e-11
    maxIndependentDiscrepancy,
    allRoutesInsideSharpenedBand, // true -- every independent route inside 1e-9
    xistarInfSharpened: XISTAR_INF_SHARPENED, // 12.0666876100
    verdict,
  }),

  interpretation: Object.freeze({
    sharpenedFromExtrapolationFreeData:
      'The sharpened 1e-9 band rests on the order-10 Gauss-Legendre convergence itself -- no extrapolation model -- so ' +
      'it is not exposed to the midpoint-O(H^2)-model worry imp-3548 was built to rebut. The band is the smallest clean ' +
      'decade above the measured N >= 90 tail spread ~6.5e-10, three orders TIGHTER than the imp-3523 conservative 1e-6.',
    corroboratedByIndependentRoutes:
      'The sharpening is not asserted in isolation: the independent trapezoid + Richardson limit agrees with the ' +
      'Gauss-Legendre limit to ~1e-15 and both agree with the imp-3523 8-figure headline to ~4e-11 -- every independent ' +
      'discrepancy lands strictly INSIDE the sharpened 1e-9 band, so the tighter band is corroborated, not merely quoted.',
    whatTheBandCovers:
      'The sharpened band is the QUADRATURE-CONVERGENCE uncertainty for the FIXED (NPHI = 10, U = 6) model -- exactly ' +
      'the band imp-3523 quoted. It does NOT fold in the fixed NPHI/U truncation and domain systematics, which are ' +
      'constant across the ladder and cancel in the spread; those remain a separate, un-sharpened source.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    sharpensBandNotClosedForm:
      'This tightens the quadrature-convergence residual band from 1e-6 to 1e-9; it does NOT give xi* or the sup an ' +
      'elementary closed form -- the imp-3470 stationarity equation stays transcendental.',
    bandIsConvergenceNotSystematic:
      'The 1e-9 band is a QUADRATURE-CONVERGENCE band for the fixed (NPHI = 10, U = 6) model. It does NOT quantify the ' +
      'fixed NPHI = 10 truncation or the finite U = 6 domain systematics, which are constant across the ladder and ' +
      'cancel in the tail spread -- those remain a separate, larger, un-sharpened uncertainty on the true infinite-model xi*.',
    bandIsEmpiricalNotAnalytic:
      'The band is derived from a MEASURED finite-ladder tail spread rounded up to a clean decade, not from an analytic ' +
      'error bound. It is conservative (strictly above the observed spread, corroborated by two independent routes) but ' +
      'remains an empirical certification, not a proof of the error.',
    measuresRatioNotPositivity:
      'This certifies the location behind the numerator norm of the capture RATIO; it does NOT construct the missing ' +
      'magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Diagnostic only; the imp-3066 off-diagonal endpoint-Hankel operator magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3551_XISTAR_RESIDUAL_BAND_SHARPENING_ASSERTIONS = [
  {
    id: 'imp3551-gauss-legendre-tail-bit-stable',
    why: 'The extrapolation-free Gauss-Legendre converged tail (N >= 90) must be bit-stable with spread < 1e-8 (the ' +
      'imp-3548 finding) and its limit must match the imp-3523 headline inside the OLD 1e-6 band -- the raw material ' +
      'the sharpening rests on.',
    holds: () =>
      glTailSpread < 1e-8 &&
      Math.abs(glLimit - XISTAR_INF_IMP3523) < RESIDUAL_BAND_IMP3523,
  },
  {
    id: 'imp3551-deep-tail-machine-stable',
    why: 'The DEEP tail (N >= 180) must be bit-stable to < 1e-11, confirming the ~6.5e-10 converged-tail spread is ' +
      'dominated by the single N = 90 -> 180 settling step and the root has genuinely stopped moving.',
    holds: () => glDeepTailSpread < 1e-11,
  },
  {
    id: 'imp3551-band-strictly-tighter-and-conservative',
    why: 'The sharpened band must be STRICTLY tighter than the imp-3523/imp-3548 1e-6, yet still conservatively exceed ' +
      'both the measured tail spread and the largest tail settling step -- a valid sharpening, not an over-tight claim.',
    holds: () =>
      bandStrictlyTighter && bandBoundsTailSpread && bandBoundsMaxStep && sharpenedBand <= 1e-9,
  },
  {
    id: 'imp3551-sharpening-factor-three-orders',
    why: 'The sharpening must buy three orders of magnitude (factor 1e-6 / sharpenedBand >= 1000) -- the headline ' +
      'deliverable of tightening 1e-6 to 1e-9.',
    holds: () => sharpeningFactor >= 1000 - 1e-6,
  },
  {
    id: 'imp3551-independent-routes-inside-band',
    why: 'Every independent route (trapezoid + Richardson vs Gauss-Legendre ~1e-15; both vs the imp-3523 headline ' +
      '~4e-11) must land strictly INSIDE the sharpened band, or the tighter band would be unjustified by the ' +
      'cross-scheme evidence.',
    holds: () => allRoutesInsideSharpenedBand && maxIndependentDiscrepancy < sharpenedBand,
  },
  {
    id: 'imp3551-verdict-sharpened',
    why: 'The classified verdict must be the band-sharpened certification, not indeterminate; a flip means the ' +
      'bit-stability, conservatism, or independent-route checks failed.',
    holds: () =>
      verdict === 'XISTAR-INF-RESIDUAL-BAND-SHARPENED-1e-6-TO-1e-9-VIA-EXTRAPOLATION-FREE-GAUSS-LEGENDRE',
  },
  {
    id: 'imp3551-honest-assessment-no-qed',
    why: 'Mandatory honesty: sharpens the band not a closed form (equation transcendental), the band is convergence ' +
      'not systematic and empirical not analytic, measures the ratio not positivity, RH-equivalent, PT 0.2 stays SOTA. ' +
      'Any flip over-claims.',
    holds: () => {
      const c = IMP3551_XISTAR_RESIDUAL_BAND_SHARPENING.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.sharpensBandNotClosedForm === 'string' &&
        typeof c.bandIsConvergenceNotSystematic === 'string' &&
        typeof c.bandIsEmpiricalNotAnalytic === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3551_XISTAR_RESIDUAL_BAND_SHARPENING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3551-xistar-residual-band-sharpening assertion failed: ${assertion.id}`);
  }
}

export default IMP3551_XISTAR_RESIDUAL_BAND_SHARPENING;
