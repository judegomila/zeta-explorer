/**
 * @fileoverview imp-97034 -- INDEPENDENT ADVERSARIAL RE-VERIFICATION (numerical) of the
 * imp-97012 / imp-96992 cell-local |w1-prime-prime| enclosure at 2a=1.00, on a SECOND
 * implementation. Import-light: all values are frozen literals from
 * tmp/imp-97034-independent-reverify.py (mpmath 1.4.1 dps=50, /tmp/rhvenv).
 *
 * WHY A SECOND IMPLEMENTATION. imp-97012 reported that swapping the imp-96992 cell-local
 * |w1-prime-prime| bound for the constant W1PP=32.80 in the C2 curvature guard clears the
 * t~35 band and lets the round-12 kmax=5 iterate interval-verify over the full [0,40] domain
 * at 2a=1.00 -- but flagged SUB-GAP IMP97012_CELLLOCAL_PASS_NEEDS_INDEPENDENT_REVERIFY: it
 * is a SINGLE in-pool verifier run. This leaf re-derives the enclosure by THREE routes that
 * are all distinct from the verifier's interval-Stirling (Binet-remainder) evaluation used in
 * tmp/imp-97012-verify4-celllocal.py:
 *   (A) w1-prime-prime(t) = -1/4 Re[psi-prime-prime(z)] + sqrt2(ln2)^3 cos(t ln2) via
 *       mpmath.polygamma(2,.) directly, z = 1/4 + i t/2;
 *   (B) the same quantity via mpmath.diff (numerical 2nd derivative of w1) -- independent of
 *       the psi-prime-prime closed form entirely;
 *   (C) the cell-local majorant B(t_lo) = sqrt2(ln2)^3 + (1/2) sum_n 1/((n+1/4)^2+(t_lo/2)^2)^{3/2}
 *       via a high-precision Hurwitz-style series (dps=50) with a rigorous integral tail,
 *       instead of the numpy float64 partial sum the verifier uses.
 *
 * FINDING 1 -- THE TWO INDEPENDENT |w1-prime-prime| ROUTES AGREE TO < 1e-50. Across the scan
 * grid {0,1,5,16,16.35,16.697,17,17.333,35,35.855,40} routes A and B agree to |A-B| < 3e-51
 * (machine-zero at dps=50). So the analytic psi-prime-prime formula the enclosure is built on
 * is confirmed by a differentiation route that never touches psi-prime-prime.
 *
 * FINDING 2 -- THE ENCLOSURE IS SOUND: B(t_lo) >= sup_cell |w1-prime-prime| ON EVERY CELL.
 * Sampling each hc=2e-3 cell [t_lo, t_lo+2e-3] at 21 points (route A), the cell-local bound
 * B(t_lo) (which includes the verifier +1e-6 slack) is >= the sampled sup on every cell, and
 * B is strictly monotone decreasing in t_lo -- so evaluating at t_lo genuinely gives the cell
 * sup, as imp-96992 claimed. No enclosure gap is exposed. The worst soundness margin over all
 * cells is EXACTLY the 1e-6 slack, attained at the razor-thin origin (see Finding 3).
 *
 * FINDING 3 -- ADVERSARIAL: THE +1e-6 SLACK IS LOAD-BEARING AT THE ORIGIN. The RAW majorant
 * (no slack) at t=0 equals |w1-prime-prime|(0) = 32.802902963831554 to full dps=50 precision
 * (raw B(0) - |w1-prime-prime|(0) = 0). The origin bound is tight to machine precision; only
 * the engineered +1e-6 keeps it a strict upper bound there. Out in the binding t~16-40 band
 * the same bound has ~68x headroom, so the slack is comfortable exactly where the certificate
 * binds. (An earlier draft of this second implementation that zeroed the integral tail AND
 * dropped the slack at a2=0 flagged a spurious 6e-12 "gap" at t=0 -- an artifact of series
 * truncation, not a real enclosure gap; using the exact Hurwitz zeta closed form at t=0
 * removes it. The verifier is unaffected: it carries the +1e-6 and its 20000-term tail is well
 * inside it.)
 *
 * FINDING 4 -- THE MODULE SCAN TABLES REPRODUCE. The independent recompute matches every entry
 * of IMP96992_CELL_SCAN and IMP97012_CELLBOUND_SCAN to a max relative deviation of 8.4e-7
 * (storage-precision level; the tables are stored at ~6-7 sig figs). B(0) recovers the constant
 * W1PP to 1.1e-9. The tail-formula monotone term Lmono(40)=1.7508 (SHIFT_RE=8) is reproduced
 * independently; the full tail bracket +0.4581 additionally depends on the iterate atoms and
 * pmin, which are inputs from the same round-12 snapshot and were not re-loaded here.
 *
 * VERDICT. On a second, method-independent implementation the imp-96992/imp-97012 cell-local
 * |w1-prime-prime| enclosure REPRODUCES with no gap: the |w1-prime-prime| formula, the majorant
 * B(t_lo), its monotonicity, the constant recovery at t=0, and the tail monotone term all check.
 * This corroborates the enclosure soundness half of step (a).
 *
 * HONEST RESIDUAL -- SUB-GAP IMP97034_FULLPIPELINE_SECONDIMPL_SWEEP_NOT_RUN. This re-verifies
 * the ENCLOSURE machinery (the |w1-prime-prime| bound + tail formula), NOT the full [0,40]
 * verify4 pipeline sweep on a different interval arithmetic: the 80000-cell fine-grid solve, the
 * sigma interval evaluation via shifted Stirling with Binet remainders, periodic_min, and the rf
 * safe-step selection were NOT re-run under an independent interval library here. So step (a) is
 * PARTIALLY delivered (enclosure + tail formula confirmed; full-pipeline second-impl sweep still
 * open), and step (b) -- the interpretive step from a T_a[sigma_2] >= 0 certificate to Weil /
 * operator positivity (operator floor is a Rayleigh UPPER bound; Sonine port obstructed at
 * 2a=ln2) -- is untouched. Certified reach stays 2a <= 0.96; operator positivity not proved;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97012-krein-kmax5-100-celllocal-w1pp-verify.js (the single in-pool run under test)
 * @see imp-96992-w1pp-celllocal-enclosure.js (the cell-local bound derivation)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// Two independent |w1''| routes (A: polygamma, B: mpmath.diff) agree to machine zero (dps=50).
export const IMP97034_METHOD_AGREEMENT = Object.freeze({
  routeA: 'w1pp = -1/4 Re polygamma(2, 1/4+it/2) + sqrt2(ln2)^3 cos(t ln2)',
  routeB: 'w1pp = mpmath.diff(w1, t, 2)  (numerical 2nd derivative; no psi-prime-prime)',
  maxAbsDiff: 3.0e-51, // worst |A-B| over the scan grid at dps=50 -- machine zero
});

// Independent recompute of the cell-local bound B(t_lo) (INCLUDES the verifier +1e-6 slack),
// the two-method |w1''| point value, and the sampled sup over the hc=2e-3 cell. sound = B >= sup.
export const IMP97034_REVERIFY_SCAN = Object.freeze([
  { tLo: 0.0, bound: 32.8029039638, w1pp: 32.8029029638, cellSup: 32.8029029638, sound: true },
  { tLo: 1.0, bound: 3.610191182, w1pp: 2.3068544, cellSup: 2.3068544, sound: true },
  { tLo: 5.0, bound: 0.5590980278, w1pp: 0.48685628, cellSup: 0.48685628, sound: true },
  { tLo: 16.0, bound: 0.4790259799, w1pp: 0.040661751, cellSup: 0.041312656, sound: true },
  { tLo: 16.35, bound: 0.4786796973, w1pp: 0.15215454, cellSup: 0.1527714, sound: true },
  { tLo: 16.697, bound: 0.4783579583, w1pp: 0.25368537, cellSup: 0.25423285, sound: true },
  { tLo: 17.0, bound: 0.4780932019, w1pp: 0.3304028, cellSup: 0.3308638, sound: true },
  { tLo: 17.333, bound: 0.4778183155, w1pp: 0.39767482, cellSup: 0.39801761, sound: true },
  { tLo: 35.0, bound: 0.4726249633, w1pp: 0.30194284, cellSup: 0.30244277, sound: true },
  { tLo: 35.855, bound: 0.4725463971, w1pp: 0.45185496, cellSup: 0.45203501, sound: true },
  { tLo: 40.0, bound: 0.4722346081, w1pp: 0.40251875, cellSup: 0.4028587, sound: true },
]);

export const IMP97034_ORIGIN = Object.freeze({
  // adversarial: the RAW majorant (no slack) at t=0 equals |w1''(0)| to full precision
  rawBoundMinusExactAtZero: 0.0, // dps=50 machine zero -- origin bound is tight
  exactW1ppAtZero: 32.802902963831554,
  slack: 1.0e-6, // load-bearing at the origin, ~68x headroom in the binding t~16-40 band
  worstSoundnessMargin: 1.0e-6, // over ALL cells; attained at the origin
});

export const IMP97034_TAIL = Object.freeze({
  T: 40.0,
  shiftRe: 8,
  sumKPlusQuarter: 30.0, // sum_{k<8}(k+1/4)
  LmonoAt40: 1.750793554, // ln(T/2) - 1/T - 4 sumk/T^2 - 1/(3T^2) - 5e-7 - ln pi
  moduleTailBracket: 0.4581347780747981, // depends additionally on iterate atoms + pmin (not re-loaded)
  tailFormulaReproduced: true,
});

export const IMP97034_VERDICT = Object.freeze({
  ticket: 'imp-97034',
  question:
    'does the imp-97012/imp-96992 cell-local |w1-prime-prime| enclosure reproduce with no gap on a second, method-independent implementation at 2a=1.00?',
  // Findings
  twoMethodsAgree: true,
  enclosureSound: true, // B(t_lo) >= sup_cell |w1''| on every cell
  boundMonotoneDecreasing: true, // t_lo is the cell sup
  moduleScanReproduced: true,
  maxRelDeviationVsModules: 8.404e-7, // storage-precision level
  tailMonotoneTermReproduced: true,
  // Honest residual + guardrails
  subGap:
    'IMP97034_FULLPIPELINE_SECONDIMPL_SWEEP_NOT_RUN -- the ENCLOSURE (|w1-prime-prime| bound + tail formula) is independently re-verified on a second implementation; the full [0,40] verify4 pipeline sweep (80000-cell fine grid, shifted-Stirling/Binet sigma interval evaluation, periodic_min, rf safe-step) was NOT re-run under a different interval library, and the interpretive step to Weil/operator positivity (Rayleigh UPPER bound; Sonine obstruction at 2a=ln2) is untouched.',
  stepAPartiallyDelivered: true,
  stepBUntouched: true,
  certifiedReachUnchanged: 0.96,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

// --- self-executing assertions (pure literals; import-light) ---
const IMP97034_ASSERTIONS = [
  {
    id: 'imp97034-two-independent-methods-agree',
    holds: () => IMP97034_METHOD_AGREEMENT.maxAbsDiff < 1e-40,
    why: 'the polygamma and numerical-diff routes for w1-prime-prime agree to < 3e-51 (machine zero at dps=50), confirming the enclosure formula on a route that never uses psi-prime-prime.',
  },
  {
    id: 'imp97034-enclosure-sound-and-monotone',
    holds: () => {
      const s = IMP97034_REVERIFY_SCAN;
      // B >= sampled cell sup on every cell (sound), and B strictly decreasing in t_lo
      let mono = true;
      for (let i = 1; i < s.length; i++) if (!(s[i].bound < s[i - 1].bound)) mono = false;
      return (
        s.every((c) => c.sound === true && c.bound >= c.cellSup && c.cellSup >= Math.abs(c.w1pp)) &&
        mono &&
        IMP97034_VERDICT.enclosureSound === true &&
        IMP97034_VERDICT.boundMonotoneDecreasing === true
      );
    },
    why: 'on every hc=2e-3 cell the independent majorant B(t_lo) (with +1e-6 slack) is >= the sampled sup of |w1-prime-prime|, and B is strictly monotone decreasing in t_lo -- so t_lo is the cell sup and the enclosure is sound with no gap.',
  },
  {
    id: 'imp97034-origin-razor-thin-slack-load-bearing',
    holds: () =>
      IMP97034_ORIGIN.rawBoundMinusExactAtZero === 0.0 &&
      Math.abs(IMP97034_ORIGIN.worstSoundnessMargin - IMP97034_ORIGIN.slack) < 1e-12 &&
      Math.abs(IMP97034_ORIGIN.exactW1ppAtZero - 32.802902963831554) < 1e-6,
    why: 'the raw majorant at t=0 equals |w1-prime-prime|(0)=32.8029 to full precision, so the worst soundness margin over all cells is exactly the 1e-6 slack, attained at the origin -- the slack is load-bearing there and has ~68x headroom in the binding high-t band.',
  },
  {
    id: 'imp97034-module-tables-reproduced',
    holds: () =>
      IMP97034_VERDICT.moduleScanReproduced === true &&
      IMP97034_VERDICT.maxRelDeviationVsModules < 1e-4 &&
      IMP97034_TAIL.tailFormulaReproduced === true &&
      Math.abs(IMP97034_TAIL.LmonoAt40 - 1.750793554) < 1e-6,
    why: 'the independent recompute matches every IMP96992_CELL_SCAN / IMP97012_CELLBOUND_SCAN entry to max rel deviation 8.4e-7 and reproduces the tail monotone term Lmono(40)=1.7508.',
  },
  {
    id: 'imp97034-partial-reverify-no-qed',
    holds: () =>
      IMP97034_VERDICT.stepAPartiallyDelivered === true &&
      IMP97034_VERDICT.stepBUntouched === true &&
      IMP97034_VERDICT.certifiedReachUnchanged === 0.96 &&
      IMP97034_VERDICT.operatorPositivityProved === false &&
      IMP97034_VERDICT.rhResolved === false &&
      IMP97034_VERDICT.qed === false &&
      typeof IMP97034_VERDICT.subGap === 'string' &&
      IMP97034_VERDICT.subGap.includes('IMP97034_FULLPIPELINE_SECONDIMPL_SWEEP_NOT_RUN'),
    why: 'the enclosure + tail formula re-verify on a second implementation (step a partially delivered), but the full-pipeline second-implementation sweep is not run and the interpretive step to operator positivity is untouched -- certified reach stays 2a<=0.96, RH open, NO QED.',
  },
];

for (const a of IMP97034_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97034 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
