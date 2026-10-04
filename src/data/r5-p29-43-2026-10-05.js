/**
 * @fileoverview r5-p29-43-2026-10-05 — WOL-C for the non-P47 uncertified hybrid-path floors (P29 ×5, P31 ×5, P43 ×1) by the wol-pd
 * engine with six refinements R1–R6. One adversarial internal referee pass (tmp/r5-ref-p29-43-*): not refuted in the certificates;
 * the 'certified-only' grading of the consumer value was REFUTED (rounding gap on the r4 wol-pd floors).
 *
 * Refinements: R1 Lemma ABS (1 − cos Σ e_q θ_q ≤ ω Σ (1 − cos e_q θ_q): mixed coefficients moved onto one-prime functions with weight
 *  ω(m)); R2 explicit rounding slacks (Mlab, bracket, block-suffix absolute slack 1.01 N u S_0); R3/R4 nt = 4, τ set, finer ladders;
 *  R5 band-local label norms (|w_j| ≤ C_j/μ etc.); R6 a-posteriori far tail of the smooth inverse (far_inv 1.39e-3 → 2.1e-6 at P43 c228).
 *
 * Referee corrections applied:
 *  - REFUTED grading: the r4 wol-pd engine computes block suffix sums as differences of global cumsums with only a relative (1+1e-9)
 *    factor; the worst-case absolute slack raises U by 9.74e-8–1.029e-7 (P7), 5.83e-8–7.10e-8 (P11), ≤ 3.81e-8 (P17–P29 samples) on the
 *    pd floors, not ~1.6e-8; the 1e-9 pad covers about 1%; a 1e-7 pad does not cover P7 23/26. The 'certified-only' value holds only modulo
 *    this gap; with a 2e-7 pd pad: 0.146763479719848. (The r5 synthesis closes the gap entry by entry on its path, see r5-synthesis.)
 *  - The P47 231/232 'bonus' certificates come from tmp/r5-p2943-p47probe.py, whose docstring wrongly says 'MEASUREMENT ONLY'; it is the
 *    certificate engine with Ms = 1e11; certified with the same caveats (referee re-grid 0.021669 / 0.021295).
 *  - P43 228 gain is mainly R1 (≈ 0.016), not R5/R6; formalization/paper/wol-pd-lemmas.md exists (L1–L5 written).
 *  - Latent: sparse-list suffix sums carry only (1+1e-9), valid while nsp < ~9.0e6 (all runs here; fails for P47 at Ms = 1e12).
 *  - r5 synthesis (2026-10-05): the consumer values below were computed on the r4 merged admission, whose 147 r3core4.c floors are NOT
 *    certified after the core-audit referee (F3): SUPERSEDED by r5-synthesis.
 *
 * PROVED (refereed internally): R1 (Lemma ABS), R2, R5, R6. CERTIFIED (single implementation + referee re-grid): WOL-C for 11 + 2 entries.
 * Import-free. ASSERTIONS recompute admissibility, the referee re-grid ordering, the gap coverage of the pads and the decimals.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const lt = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return a * d < c * b; };
const THR = 0.0223 / (1 + 1e-12);

export const R5_P29_43 = Object.freeze({
  id: 'r5-p29-43-2026-10-05',
  date: '2026-10-05',
  title: 'WOL-C for P29 ×5, P31 ×5, P43 ×1 (+ P47 cells 231, 232): all non-P47 hybrid-path floors certified',
  status: 'CERTIFIED (single implementation, one internal referee pass with an independent re-grid) for 13 entries; consumer grading corrected (pd rounding gap). NO QED.',
  certified: Object.freeze({
    '226|1|sharp (P29)': [0.0099386, 0.009501], '229|1|sharp (P29)': [0.0103614, 0.009929], '242|1|sharp (P29)': [0.0090385, 0.008619],
    '245|1|sharp (P29)': [0.0094360, 0.009014], '246|1|sharp (P29)': [0.0092852, 0.008858],
    '248|1|sharp (P31)': [0.0101690, 0.009972], '249|1|sharp (P31)': [0.0099927, 0.009782], '251|1|sharp (P31)': [0.0106221, 0.010420],
    '252|1|sharp (P31)': [0.0104423, 0.010235], '254|1|sharp (P31)': [0.0110936, 0.010914],
    '228|0.94|r_19_40 (P43)': [0.0202267, 0.019965],
    '231|0.94|r_19_40 (P47)': [0.0218815, 0.021669], '232|0.94|r_19_40 (P47)': [0.0215018, 0.021295],
  }),
  p47Misses: Object.freeze({ 234: 0.0227774, 235: 0.0223839, 237: 0.0237708 }),
  pdRoundingGap: Object.freeze({ P7: [9.74e-8, 1.029e-7], P11: [5.83e-8, 7.10e-8], P17: [3.66e-8, 3.81e-8], P19: [2.57e-8, 2.90e-8], P23: [2.24e-8, 2.59e-8], P29: [1.90e-8, 1.90e-8], measured: 29, pad1e9Covers: 0.01 }),
  values: Object.freeze({
    claimedCert: { exact: '146763479130779/1000000000000000', dec: '0.146763479130779', note: 'r4 merged + 11: holds only modulo the pd gap, and its r3core4.c floors are not certified (F3): SUPERSEDED' },
    pdPad2e7: { exact: '18345434964981/125000000000000', dec: '0.146763479719848', note: 'referee, 2e-7 pd pad, same r4 basis: SUPERSEDED' },
    hybrid: { exact: '14477421352093/100000000000000', dec: '0.14477421352093', note: 'CONDITIONAL on WOL-C for 372 P47 floors; NOT PROVED' },
  }),
  verdict: 'WOL-C is certified (single implementation, one internal referee pass with an independent re-grid) for P29 226/229/242/245/246, '
    + 'P31 248/249/251/252/254, P43 228 and P47 231/232: every P29, P31 and P43 floor on the hybrid path is now certified. The claimed '
    + 'certified-only consumer value was refuted in its grading (r4 wol-pd block-suffix rounding gap up to 1.03e-7) and rests on r3core4.c '
    + 'floors that are not certified; superseded by r5-synthesis. Lambda < 0.145 is NOT certified. PT Lambda <= 0.2 stands. RH open. NO QED.',
});

const W = R5_P29_43;
export const R5_P29_43_ASSERTIONS = Object.freeze([
  {
    id: 'r5-p2943-admissible',
    holds: () => Object.values(W.certified).every(([m, r]) => m > 0 && m <= THR && r < m && m - r <= 4.5e-4) && Object.keys(W.certified).length === 13
      && Object.values(W.p47Misses).every((m) => m > THR),
    why: '13 certified margins ≤ 0.0223/(1+1e-12); each referee re-grid margin is 1.8e-4 to 4.4e-4 smaller; P47 cells 234/235/237 miss.',
  },
  {
    id: 'r5-p2943-gap-coverage',
    holds: () => { const mx = Math.max(...['P7', 'P11', 'P17', 'P19', 'P23', 'P29'].map((p) => W.pdRoundingGap[p][1])); return mx > 1e-7 + 1e-9 && mx < 2e-7 && mx > 1e-9 * 50; },
    why: 'The worst measured pd gap (1.029e-7) exceeds the 1e-9 pad and a 1e-7 pad, and is covered by 2e-7 (referee correction).',
  },
  {
    id: 'r5-p2943-values',
    holds: () => Object.values(W.values).every((v) => { const n = exact15(v.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(v.dec)) < 1e-16; })
      && lt(W.values.hybrid.exact, '145/1000') && lt(W.values.claimedCert.exact, W.values.pdPad2e7.exact),
    why: 'Exact decimals; padding raises the value (safe direction); hybrid conditional below 0.145.',
  },
  {
    id: 'r5-p2943-honest',
    holds: () => /NO QED/.test(W.status) && /PT Lambda <= 0\.2 stands/.test(W.verdict) && /refuted/.test(W.verdict) && /NOT PROVED/.test(W.values.hybrid.note),
    why: 'Grading correction recorded; sub-0.145 conditional; no QED.',
  },
]);

export default R5_P29_43;
