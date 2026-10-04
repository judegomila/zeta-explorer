/**
 * @fileoverview r6-falsify-2026-10-06 — targeted search for a WOL-C violation on the 369 uncertified P47 hybrid-path floors (cells 234–579)
 * of route P at PT height. One adversarial internal referee pass (tmp/r6-ref-falsify-*): core claim CONFIRMED as MEASURED; severity minor.
 *
 * Tool: tmp/r6-falsify-phi.c, a C port of the reference float replica tmp/r4-wolpd-flib.py of Φ_E with a reverse-mode θ-gradient
 * (agreement ≤ 3.9e-15 with flib on 14 entries; ≤ 9.5e-12 in centre value with the original r2 interval engine at point (t, a); K0* bit-exact).
 *
 * Referee corrections applied:
 *  - T2 θ-variation is up to +6.9e-4 at far points (|θ|∞ ≈ 2–3.1, where Φ − Φ(0) ≈ −0.6), not ≤ 1.8e-4; ≤ 1.8e-5 inside |θ_q| ≤ 0.3.
 *    Harmless: T2 ≤ 0.006 in size and restored in every reported value.
 *  - '640,000 starts' are SCREENED starts (3 L-BFGS iterations each); about 16.6k were continued and 3,136 run to convergence. The
 *    referee adds 11,200 converged L-BFGS-B ascents on 14 cells and 2,952 on all 369 entries; every one ends at the central maximum.
 *  - Per-entry excesses are corner / (t_lo, a_lo) values, i.e. lower bounds for the (t, a)-box sup (275: 6.70e-7 at an interior t).
 *  - 'sup Φ = Φ(0) fails by ≈ 2e-6' is MEASURED (two float implementations + r2 centre values), not certified.
 *  - Provenance: validate.json keeps only the last entry (overwritten per run); stale docstring defaults (K1 3, K2 15, N2 250, N3 50;
 *    16×16 pair grids); Wn/V maxima over 14 referee cells are 0.097 / 0.0144.
 *
 * PROVED (elementary): sign patterns θ ∈ {0, π}^15 are critical points wherever Φ_E is differentiable (Φ_E even in θ); closed form of
 *  the r2/flib label-tail functional at P47 (M_k = 0 for k ≥ 4). CERTIFIED: nothing (no candidate violation to certify).
 * MEASURED: no WOL-C violation; max excess 1.98e-6; sup Φ − K0* ≤ −0.00156 everywhere. HEURISTIC: unimodal landscape; the gap to the
 *  certified cone margins (≥ 0.0748) is majorant looseness. WOL-C NOT PROVED. Import-free.
 */

export const R6_FALSIFY = Object.freeze({
  id: 'r6-falsify-2026-10-06',
  date: '2026-10-06',
  title: 'P47 WOL-C falsification search: no violation found on the 369 uncertified floors (max excess 1.98e-6 over Φ(0)); MEASURED, not proved',
  status: 'MEASURED (float64 search, two independent implementations, one internal adversarial referee pass: confirmed, minor). WOL-C NOT PROVED. NO QED.',

  scope: Object.freeze({ floors: 369, cells: [234, 579], prefix: 'P47', multistartCells: 64, deepCells: 12, censusEntries: 305, flatScanCells: 16 }),
  search: Object.freeze({
    screenedStarts: 640000, continued: 16600, converged: 3136, signPatternsExhaustive: 393216, cpuSeconds: 92248,
    refereeConvergedAscents14Cells: 11200, refereeConvergedAscentsAll: 2952, refereeEvaluations: 5.53e6, refereeCpuSeconds: 93000,
  }),
  results: Object.freeze({
    maxExcessOverPhi0: 1.98275e-6, maxExcessEntry: '424|1|r_23_40', maxExcessThetaInf: 0.029,
    medianExcess: 1.0e-14, cellsAbove1e10: 12, multistartCells: 64,
    wolcMetricMax: -0.0015629, wolcMetricMaxEntry: '235 (t_lo)', headroomRange: [0.0015629, 0.0050623],
    entriesMetricPositive: 0, entriesExcessAbove0223: 0, entriesExcessAbove0436: 0,
    stableNonCentralMaxima: 0, nonCentralTested: 256,
    bestSignPattern: -0.0038, bestSignPatternRange: [-0.0090, -0.0038], flip2Cost: 0.274, flip47CostMin: 0.00382,
    kroneckerLineMax: -0.0011, pairGridMaxOffOrigin: -0.00013, maxWn: 0.097, maxV: 0.0144, minAbsC1: 0.512,
  }),
  corrections: Object.freeze([
    'T2 θ-variation up to +6.9e-4 at far points (Φ − Φ(0) ≈ −0.6); ≤ 1.8e-5 inside |θ_q| ≤ 0.3',
    'search count: 640,000 screened, ~16.6k continued, 3,136 converged; + referee 11,200 + 2,952 converged ascents',
    'per-entry excesses are corner / (t_lo, a_lo) lower bounds for the (t, a)-box sup',
    'sup Φ = Φ(0) failing by ≈ 2e-6 is MEASURED, not certified',
    'provenance: validate.json overwritten per run; docstring defaults stale; Wn/V scope 14 cells (0.097 / 0.0144)',
  ]),
  proved: Object.freeze(['sign patterns are critical points (Φ_E even in θ)', 'closed form of the P47 label-tail functional (M_k = 0 for k ≥ 4)']),
  certified: Object.freeze([]),
  files: Object.freeze(['tmp/r6-falsify-phi.c', 'tmp/r6-falsify-*.py', 'tmp/r6-falsify-out/summary.json', 'tmp/r6-ref-falsify-*.py', 'tmp/r6-ref-falsify-out/summary.json']),
  verdict: 'FALSIFICATION NEGATIVE (MEASURED): no WOL-C violation on the 369 uncertified P47 floors (cells 234-579); max excess over '
    + 'Phi(0) 1.98e-6 (|X_r| kink), sup_found Phi - K0* <= -0.00156 on every entry, so neither 0.0223 nor 0.0436 is approached. Nothing '
    + 'certified (none needed). WOL-C NOT PROVED; P-cond stays conditional. PT Lambda <= 0.2 stands. RH open. NO QED.',
});

const F = R6_FALSIFY;
export const R6_FALSIFY_ASSERTIONS = Object.freeze([
  {
    id: 'r6-falsify-no-violation',
    holds: () => F.results.wolcMetricMax < 0 && F.results.maxExcessOverPhi0 < 0.0223 && F.results.maxExcessOverPhi0 < 0.0436
      && F.results.entriesMetricPositive === 0 && F.results.entriesExcessAbove0223 === 0 && F.results.entriesExcessAbove0436 === 0
      && F.results.headroomRange[0] === -F.results.wolcMetricMax && F.results.headroomRange[0] / F.results.maxExcessOverPhi0 > 780
      && F.results.stableNonCentralMaxima === 0,
    why: 'No entry exceeds K0* (metric ≤ −0.00156); the measured excess over Φ(0) is ≥ 780× below the headroom; no stable non-central maximum.',
  },
  {
    id: 'r6-falsify-coverage',
    holds: () => F.scope.multistartCells + F.scope.censusEntries === F.scope.floors && F.search.converged < F.search.continued
      && F.search.continued < F.search.screenedStarts && F.search.signPatternsExhaustive === 12 * 2 ** 15 && F.scope.cells[0] === 234 && F.scope.cells[1] === 579,
    why: '64 multistart + 305 census = 369 floors; screened > continued > converged (referee correction); exhaustive 2^15 sign patterns on 12 cells.',
  },
  {
    id: 'r6-falsify-honest',
    holds: () => F.certified.length === 0 && /MEASURED/.test(F.status) && /NOT PROVED/.test(F.verdict) && /NO QED/.test(F.verdict)
      && /PT Lambda <= 0\.2 stands/.test(F.verdict) && F.corrections.length === 5,
    why: 'Float search only: evidence for WOL-C, not a bound; referee corrections carried.',
  },
]);

export default R6_FALSIFY;
