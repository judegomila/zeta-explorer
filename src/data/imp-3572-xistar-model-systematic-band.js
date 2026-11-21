/**
 * @module imp-3572-xistar-model-systematic-band
 * @fileoverview imp-3572 -- MEASURE the xi*_inf NPHI-truncation and U-window MODEL-systematic
 *   uncertainty that imp-3551 explicitly EXCLUDED from its sharpened 1e-9 QUADRATURE-only band,
 *   by re-locating the imp-3548 extrapolation-free Gauss-Legendre P2 = 0 root at every combination
 *   of NPHI in {10, 12, 14} and U in {6, 7, 8} and reporting the spread as a SEPARATE band.
 *
 *   WHY THIS IS NEEDED
 *   ------------------
 *   imp-3551 sharpened the xi* residual band from the imp-3523/imp-3548 conservative 1e-6 to a
 *   data-derived 1e-9, but scoped its band strictly to QUADRATURE CONVERGENCE for the FIXED
 *   (NPHI = 10, U = 6) model. Its honest caveat says the fixed NPHI = 10 de Bruijn-Newman
 *   truncation and the finite U = 6 domain systematics "are constant across the ladder and cancel
 *   in the spread" and "remain a separate, LARGER, un-sharpened uncertainty on the true
 *   infinite-model xi*." That left the TOTAL xi* uncertainty unquantified: the 1e-9 quadrature
 *   band could be swamped by a much larger NPHI/U model bias, or it could dominate. This module
 *   settles it by directly measuring how far xi* moves under truncation-depth and window changes.
 *
 *   THE MEASUREMENT (self-computed here; same imp-3548 assembly -- composite 5-point
 *   Gauss-Legendre, order-10 per panel, at the converged rung N = 360, xi-scan [1e-4, 60])
 *   ---------------------------------------------------------------------------------------
 *   Re-locate the single P2 = 0 root xi* on the 3x3 grid NPHI in {10, 12, 14} x U in {6, 7, 8}:
 *     - Every cell returns xi* = 12.0666876099614.
 *     - NPHI-only spread (fixed U = 6, NPHI 10 -> 14): 0 exactly. The extra de Bruijn-Newman
 *       terms n = 11..14 carry weight ~ exp(-pi n^2 e^{4u}); at n = 11 near u = 0 this is
 *       ~ exp(-pi*121) ~ 1e-165, so they change no representable bit of the integrand.
 *     - U-only spread (fixed NPHI = 10, U 6 -> 8): ~1.1e-14 (last-bit node-placement rounding).
 *       The integrand support collapses by u ~ 0.7 (e^{4u} in the exponent), so extending the
 *       window from 6 to 8 adds only machine-noise-level contribution.
 *     - FULL 3x3 model-systematic spread: ~1.1e-14 -- machine epsilon.
 *
 *   THE VERDICT
 *   -----------
 *   The NPHI/U model-systematic band, taken as the smallest clean decade strictly above the
 *   measured 3x3 spread, is 1e-13 -- FOUR orders of magnitude BELOW imp-3551s 1e-9 quadrature
 *   band. So imp-3551s worry that the model systematics might be the LARGER, dominant source is
 *   REBUTTED for this truncated kernel: the true total xi* uncertainty on the (NPHI, U)-family is
 *   DOMINATED by quadrature convergence (1e-9), not by the truncation-depth or domain model. The
 *   sharpened quote xi*_inf = 12.0666876100 +/- 1e-9 therefore already bounds the total (NPHI, U)
 *   model uncertainty with three decades of headroom.
 *
 *   SCOPE
 *   -----
 *   Measurement only. It quantifies the model systematic ACROSS the discrete family NPHI in
 *   {10, 12, 14}, U in {6, 7, 8}; it does NOT prove the NPHI -> infinity, U -> infinity continuum
 *   limit analytically (the terms drop faster than any decade the family samples, so the discrete
 *   spread is a faithful proxy, but this is an empirical measurement, not an analytic tail bound).
 *   It does NOT give xi* a closed form -- the imp-3470 stationarity equation stays transcendental.
 *   RH-EQUIVALENT; the imp-3066 off-diagonal endpoint-Hankel K_a >= 0 magnitude is the lone RH
 *   obstruction, UNTOUCHED. NO RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-3551-xistar-residual-band-sharpening.js (1e-9 quadrature band; scoped OUT NPHI/U)
 *   @see imp-3548-xistar-quadrature-scheme-invariance.js (extrapolation-free GL assembly reused)
 *   @see imp-3506-xistar-U-invariance-bitidentity-derivation.js (U-invariance identity)
 *   @see imp-3470-Ttilde-spectral-peak-xistar-obstruction.js (P2 assembly; located xi*)
 *
 *   Ticket: imp-3572 (numerical, medium). Measurement only; RH-equivalent; NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// imp-3551 sharpened headline location and its QUADRATURE-only band (baked literals so this module
// stays a light, self-contained cross-check and imports no heavy bundle).
const XISTAR_INF_SHARPENED_IMP3551 = 12.06668761; // 8-figure headline (imp-3523/imp-3548/imp-3551)
const QUADRATURE_BAND_IMP3551 = 1e-9; // the sharpened quadrature-convergence band imp-3551 scoped

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-3548 / imp-3551 assembly). */
function makePhiKernel(NPHI) {
  return function phiKernel(uu) {
    let s = 0;
    const e2 = Math.exp(2 * uu);
    const e4 = Math.exp(4 * uu);
    for (let n = 1; n <= NPHI; n++) {
      const n2 = n * n;
      const n4 = n2 * n2;
      s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
    }
    return s;
  };
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
function buildGridGaussLegendre(phiKernel, U, N) {
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

/** PSD curvature P2 = d2P/dxi2 at xi on a (node, phi*weight) grid (imp-3548 / imp-3551 assembly). */
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

/** Bisect P2 = 0 on a sign-changing bracket [lo, hi] (100 halvings; imp-3548 / imp-3551). */
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

// --- Fixed enumeration domain and converged rung (identical to imp-3548 / imp-3551). ---
const XI_LO = 1e-4;
const XI_HI = 60;
const DXI = 0.01;
const N_CONVERGED = 360; // deep inside the imp-3548/imp-3551 bit-stable Gauss-Legendre tail (N >= 90)

// --- The 3x3 model grid: NPHI in {10, 12, 14} x U in {6, 7, 8}. ---
const NPHI_LADDER = Object.freeze([10, 12, 14]);
const U_LADDER = Object.freeze([6, 7, 8]);

const cells = [];
for (const NPHI of NPHI_LADDER) {
  const phiKernel = makePhiKernel(NPHI);
  for (const U of U_LADDER) {
    const grid = buildGridGaussLegendre(phiKernel, U, N_CONVERGED);
    const xiStar = locateRoot(grid, XI_LO, XI_HI, DXI);
    cells.push({ NPHI, U, xiStar });
  }
}

// Baseline cell (NPHI = 10, U = 6) -- the fixed model imp-3551 sharpened.
const baseCell = cells.find((c) => c.NPHI === 10 && c.U === 6);
const xiStarBase = baseCell.xiStar;

const allXi = cells.map((c) => c.xiStar);
const modelSystematicSpread = Math.max(...allXi) - Math.min(...allXi); // ~1.1e-14 -- machine epsilon

// NPHI-only spread at fixed U = 6 (truncation-depth systematic in isolation).
const nphiOnly = cells.filter((c) => c.U === 6).map((c) => c.xiStar);
const nphiOnlySpread = Math.max(...nphiOnly) - Math.min(...nphiOnly); // 0 -- n >= 11 terms below machine

// U-only spread at fixed NPHI = 10 (domain-window systematic in isolation).
const uOnly = cells.filter((c) => c.NPHI === 10).map((c) => c.xiStar);
const uOnlySpread = Math.max(...uOnly) - Math.min(...uOnly); // ~1.1e-14 -- node-placement rounding

// The smallest retained-term weight the largest NPHI adds (why the truncation systematic vanishes):
// weight of the n = 11 term at u = 0 is exp(-pi * 11^2 * e^0) = exp(-pi * 121).
const smallestAddedTermWeight = Math.exp(-Math.PI * 11 * 11); // ~1e-165 -- below any representable bit

// --- The MODEL-SYSTEMATIC band: smallest clean decade strictly above the measured 3x3 spread. ---
// (Mirrors the imp-3551 band rule so the two bands are reported on the same footing.)
const modelSystematicBand = modelSystematicSpread > 0
  ? Math.pow(10, Math.ceil(Math.log10(modelSystematicSpread)))
  : 1e-15; // spread exactly 0 -> floor at machine epsilon
const modelVsQuadratureRatio = QUADRATURE_BAND_IMP3551 / modelSystematicBand; // ~1e4 -- quadrature dominates
const quadratureDominates = modelSystematicBand < QUADRATURE_BAND_IMP3551;

// Every cell must sit inside the imp-3551 sharpened 1e-9 quadrature band of the headline location.
const maxCellDeviationFromHeadline = Math.max(
  ...cells.map((c) => Math.abs(c.xiStar - XISTAR_INF_SHARPENED_IMP3551)),
);
const allCellsInsideQuadratureBand = maxCellDeviationFromHeadline < QUADRATURE_BAND_IMP3551;

const verdict =
  modelSystematicSpread < 1e-11 &&
  nphiOnlySpread < 1e-13 &&
  uOnlySpread < 1e-11 &&
  quadratureDominates &&
  allCellsInsideQuadratureBand
    ? 'XISTAR-INF-MODEL-SYSTEMATIC-BAND-1e-13-QUADRATURE-1e-9-DOMINATES-BY-FOUR-ORDERS'
    : 'INDETERMINATE';

export const IMP3572_XISTAR_MODEL_SYSTEMATIC_BAND = Object.freeze({
  id: 'imp-3572-xistar-model-systematic-band',
  ticket: 'imp-3572',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentCertification: 'imp-3551-xistar-residual-band-sharpening.js',
  grandparentCertification: 'imp-3548-xistar-quadrature-scheme-invariance.js',

  summary:
    'Measures the xi*_inf NPHI-truncation and U-window MODEL-systematic uncertainty that imp-3551 explicitly EXCLUDED ' +
    'from its sharpened 1e-9 QUADRATURE-only band, by re-locating the imp-3548 extrapolation-free composite 5-point ' +
    'Gauss-Legendre P2(xi) = 0 root at every combination of NPHI in {10, 12, 14} and U in {6, 7, 8} (converged rung ' +
    'N = 360, xi-scan [1e-4, 60]). Every cell returns xi* = 12.0666876099614: the NPHI-only spread at fixed U = 6 is 0 ' +
    'exactly (the extra de Bruijn-Newman terms n = 11..14 carry weight ~ exp(-pi n^2 e^{4u}) ~ 1e-165, changing no ' +
    'representable bit), the U-only spread at fixed NPHI = 10 is ~1.1e-14 (last-bit node-placement rounding, since the ' +
    'integrand support collapses by u ~ 0.7), and the full 3x3 model-systematic spread is ~1.1e-14 -- machine epsilon. ' +
    'Reported as a separate band (smallest clean decade above the spread) the NPHI/U model systematic is 1e-13, FOUR ' +
    'orders BELOW imp-3551s 1e-9 quadrature band, so the total xi* uncertainty on the (NPHI, U)-family is DOMINATED by ' +
    'quadrature, not by the truncation-depth/domain model -- rebutting imp-3551s worry that the excluded systematics ' +
    'might be the larger source. The sharpened quote xi*_inf = 12.0666876100 +/- 1e-9 already bounds the total (NPHI, U) ' +
    'model uncertainty with three decades of headroom. Measurement only; does NOT prove the analytic NPHI/U continuum ' +
    'limit and gives NO closed form (imp-3470 equation stays transcendental). RH-equivalent; the imp-3066 K_a >= 0 ' +
    'magnitude is the lone obstruction, UNTOUCHED. NO RH verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    objective: 'sup_xi |P1(xi)|, P1 = dP/dxi, P(xi) = |Phihat(xi)|^2 = C^2 + S^2 (the peak slope behind ||Ttilde||)',
    maximizerIsP2Root:
      'the global maximizer of |P1| is a root of P2 = dP1/dxi (imp-3483); imp-3511 certified EXACTLY ONE such root per ' +
      'U window; imp-3523 pinned its converged LOCATION; imp-3551 sharpened its QUADRATURE band to 1e-9 for the FIXED ' +
      '(NPHI = 10, U = 6) model -- this module measures the NPHI/U MODEL systematic imp-3551 excluded',
    modelGrid:
      're-locate the single P2 = 0 root on the 3x3 grid NPHI in {10, 12, 14} x U in {6, 7, 8}; NPHI varies the de ' +
      'Bruijn-Newman truncation depth, U varies the finite integration window',
    reusedAssembly:
      'identical imp-3548/imp-3551 extrapolation-free composite 5-point Gauss-Legendre rule (order-10 per panel) at the ' +
      'converged rung N = 360, deep inside the bit-stable tail; only NPHI (kernel term count) and U (window) differ',
    bandRule:
      'modelSystematicBand = 10^ceil(log10(3x3 spread)): the smallest power-of-ten strictly ABOVE the measured spread ' +
      '(same rule imp-3551 used for its quadrature band), so the two bands are reported on the same footing',
    whyTruncationVanishes:
      'the n-th kernel term weight ~ exp(-pi n^2 e^{4u}); at n = 11, u = 0 this is exp(-pi*121) ~ 1e-165, so terms ' +
      'beyond NPHI = 10 are below any representable double-precision bit -- the truncation systematic is exactly 0',
    whyWindowVanishes:
      'the integrand support collapses by u ~ 0.7 (e^{4u} inside the exponent), so extending U from 6 to 8 adds only ' +
      'machine-noise-level contribution; the residual ~1e-14 is last-bit node-placement rounding, not a real shift',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    nphiLadder: NPHI_LADDER.slice(),
    uLadder: U_LADDER.slice(),
    nConverged: N_CONVERGED,
    scanDomain: { xiLo: XI_LO, xiHi: XI_HI, dxi: DXI },
    xistarInfSharpenedImp3551: XISTAR_INF_SHARPENED_IMP3551,
    quadratureBandImp3551: QUADRATURE_BAND_IMP3551,
    selfComputing: true,
  }),

  measured: Object.freeze({
    cells, // per-(NPHI, U) located xiStar over the full 3x3 grid
    xiStarBase, // 12.0666876099614 -- the fixed (NPHI = 10, U = 6) model
    modelSystematicSpread, // ~1.1e-14 -- full 3x3 spread (machine epsilon)
    nphiOnlySpread, // 0 -- truncation-depth systematic in isolation (fixed U = 6)
    uOnlySpread, // ~1.1e-14 -- domain-window systematic in isolation (fixed NPHI = 10)
    smallestAddedTermWeight, // ~1e-165 -- weight of the first term NPHI = 14 adds beyond NPHI = 10
    modelSystematicBand, // 1e-13 -- clean decade above the measured spread
    quadratureBandImp3551: QUADRATURE_BAND_IMP3551, // 1e-9 -- for comparison
    modelVsQuadratureRatio, // ~1e4 -- quadrature band is four orders larger
    quadratureDominates, // true -- model systematic << quadrature band
    maxCellDeviationFromHeadline, // ~4e-11 -- every cell inside the 1e-9 quadrature band
    allCellsInsideQuadratureBand, // true
    verdict,
  }),

  interpretation: Object.freeze({
    modelSystematicIsMachineLevel:
      'Across NPHI in {10, 12, 14} and U in {6, 7, 8} the located xi* does not move beyond ~1.1e-14 -- machine epsilon. ' +
      'The truncation-depth systematic is EXACTLY 0 (the n >= 11 kernel terms are ~1e-165, below any representable bit) ' +
      'and the window systematic is last-bit node-placement rounding, because the integrand support ends near u ~ 0.7.',
    quadratureDominatesTotalUncertainty:
      'The separate NPHI/U model-systematic band (1e-13) is FOUR orders of magnitude BELOW imp-3551s 1e-9 quadrature ' +
      'band, so the total xi* uncertainty on the (NPHI, U)-family is DOMINATED by quadrature convergence, not the ' +
      'truncation-depth or domain model -- directly rebutting imp-3551s worry that the excluded systematics might be larger.',
    sharpenedQuoteAlreadyBoundsModel:
      'Because every 3x3 cell sits ~4e-11 from the headline (inside the 1e-9 band), the imp-3551 sharpened quote ' +
      'xi*_inf = 12.0666876100 +/- 1e-9 already bounds the total (NPHI, U) model uncertainty with three decades of ' +
      'headroom; no widening of the band is needed to absorb the NPHI/U systematics.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    measuresDiscreteFamilyNotContinuumLimit:
      'This measures the model systematic ACROSS the discrete family NPHI in {10, 12, 14}, U in {6, 7, 8}; it does NOT ' +
      'prove the NPHI -> infinity, U -> infinity continuum limit analytically. The kernel terms drop faster than any ' +
      'decade the family samples (n = 11 weight ~1e-165), so the discrete spread is a faithful proxy, but this remains ' +
      'an empirical measurement, not an analytic tail bound.',
    bandIsMeasuredNotAnalytic:
      'The 1e-13 model-systematic band is derived from a MEASURED 3x3 spread rounded up to a clean decade, mirroring the ' +
      'imp-3551 quadrature-band rule; it is conservative but empirical, not an analytic error bound.',
    quadratureBandNotReDerived:
      'The 1e-9 quadrature band it compares against is imp-3551s baked figure, unchanged; this module only adds the ' +
      'SEPARATE model-systematic band and the domination verdict, it does not re-derive the quadrature band.',
    doesNotGiveClosedForm:
      'This does NOT give xi* or the sup an elementary closed form -- the imp-3470 stationarity equation stays transcendental.',
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
export const IMP3572_XISTAR_MODEL_SYSTEMATIC_BAND_ASSERTIONS = [
  {
    id: 'imp3572-full-grid-single-valued',
    why: 'Every one of the 9 (NPHI, U) cells must locate a finite xi* and the full 3x3 spread must be machine-level ' +
      '(< 1e-11), the core measurement: changing truncation depth and window does not move the maximizer.',
    holds: () =>
      cells.length === 9 && cells.every((c) => Number.isFinite(c.xiStar)) && modelSystematicSpread < 1e-11,
  },
  {
    id: 'imp3572-nphi-truncation-systematic-vanishes',
    why: 'The NPHI-only spread at fixed U = 6 must be < 1e-13: the de Bruijn-Newman terms n = 11..14 carry weight ' +
      '~ exp(-pi n^2) ~ 1e-165, below any representable bit, so deepening the truncation changes no representable bit.',
    holds: () => nphiOnlySpread < 1e-13 && smallestAddedTermWeight < 1e-100,
  },
  {
    id: 'imp3572-u-window-systematic-machine-level',
    why: 'The U-only spread at fixed NPHI = 10 must be < 1e-11: the integrand support collapses by u ~ 0.7, so ' +
      'extending the window from 6 to 8 adds only last-bit node-placement rounding, not a real shift.',
    holds: () => uOnlySpread < 1e-11,
  },
  {
    id: 'imp3572-quadrature-dominates-model',
    why: 'The separate NPHI/U model-systematic band must be strictly BELOW the imp-3551 1e-9 quadrature band (ratio ' +
      '>= 100), the headline finding that the total xi* uncertainty is dominated by quadrature, not the model.',
    holds: () => quadratureDominates && modelSystematicBand < QUADRATURE_BAND_IMP3551 && modelVsQuadratureRatio >= 100,
  },
  {
    id: 'imp3572-every-cell-inside-quadrature-band',
    why: 'Every 3x3 cell must sit inside the imp-3551 sharpened 1e-9 quadrature band of the headline location, ' +
      'confirming the sharpened quote already bounds the total (NPHI, U) model uncertainty.',
    holds: () => allCellsInsideQuadratureBand && maxCellDeviationFromHeadline < QUADRATURE_BAND_IMP3551,
  },
  {
    id: 'imp3572-verdict-quadrature-dominates',
    why: 'The classified verdict must be the quadrature-dominates certification, not indeterminate; a flip means the ' +
      'machine-level spread, truncation-vanish, window, or domination checks failed.',
    holds: () =>
      verdict === 'XISTAR-INF-MODEL-SYSTEMATIC-BAND-1e-13-QUADRATURE-1e-9-DOMINATES-BY-FOUR-ORDERS',
  },
  {
    id: 'imp3572-honest-assessment-no-qed',
    why: 'Mandatory honesty: measures a discrete family not the analytic continuum limit, the band is empirical not ' +
      'analytic, the quadrature band is not re-derived, gives no closed form, measures the ratio not positivity, ' +
      'RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3572_XISTAR_MODEL_SYSTEMATIC_BAND.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.measuresDiscreteFamilyNotContinuumLimit === 'string' &&
        typeof c.bandIsMeasuredNotAnalytic === 'string' &&
        typeof c.doesNotGiveClosedForm === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3572_XISTAR_MODEL_SYSTEMATIC_BAND_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3572-xistar-model-systematic-band assertion failed: ${assertion.id}`);
  }
}

export default IMP3572_XISTAR_MODEL_SYSTEMATIC_BAND;
