/**
 * @fileoverview r5-p47-mixed-2026-10-05 — WOL-C for the P47 floors via the mixed-frequency part of the wol-pd label majorant
 * (Lemma MS, matrix-stiffness decoupling). One adversarial internal referee pass (tmp/r5-ref-p47-mixed-*): not refuted, minor.
 *
 * Method: u_q = |e^{iθ_q} − 1|; 1 − cos<e,θ> ≤ (Σ_q e_q u_q)²/2 (telescoping, |z^k − 1| ≤ k|z − 1|). With σ_q ≤ inf_{0<θ≤π} h_q(θ),
 *  h_q = −f_q/(1 − cos θ) (Fejér kernels), r_q = f_q + σ_q(1 − cos θ) ≤ 0; if diag(σ + d) − Σ_m β_m M_m⁺ e(m)e(m)ᵀ ⪰ 0 (exact-rational
 *  Bareiss check), the one-prime + mixed part is ≤ Σ_q r_q(θ_q) + B, B = 2Σ(1−β_m)M_m⁺ + 2Σd_q. Region ladder on the residual functions r_q.
 *
 * Referee corrections applied:
 *  - Grading: the 'correction to the r4 diagnosis' is MEASURED (certified component bounds against float true values), not proved.
 *  - Scope: the mixed-frequency term is not binding at P47 cells 231/260 (B = 0 / 6.9e-4) but IS binding again at cell 300 (certified
 *    B = 0.025932 > 0.0223); at late cells the first-branch majorant itself binds (survey lower limit up to 0.063).
 *  - 'Each large on its own' overstated: at cell 231 the certified tail BOUND is 0.02496 but the true tail mass is about 0.002–0.009
 *    (float), so the tail LOSS is about 0.016–0.023 (measured); only tails + extra (about 0.029–0.036, measured) exceeds the budget.
 *  - The Ms = 1e12 cell-231 figures come from a run above the 4 GB cap and are unconfirmed (not load-bearing); referee Ms = 1e11:
 *    margin 0.051031, tails 0.029715, Ms-independent components reproduced exactly.
 *  - r4-decoupling reproduction within the r5 engine is ≤ 7.2e-6 per entry (per-piece λ choice), not ≤ 7e-6.
 *  - Hypothetical consumer values exclude the 7 r5 floors.
 *  - r5 synthesis (2026-10-05): the 7 certificates are superseded entry by entry by the r5 p29-43 certificates (smaller margins); the
 *    engine also reuses the r4 norms_tails block-suffix code (gap found by the p29-43 referee). The value 0.146777842448268 was computed on
 *    the r4 merged admission, whose 147 r3core4.c floors are NOT certified (core-audit referee, F3); it is superseded.
 *
 * PROVED (refereed internally): Lemma MS, the residual region ladder, the rounding fix. CERTIFIED (refereed internally): WOL-C for P29 ×4,
 * P31 ×3. NOT certified: P47 (0/372) and P43 228. MEASURED: P47 surveys. HEURISTIC: P47 needs a new label representation.
 * Import-free. ASSERTIONS recompute the admissibility of the margins, the rational decimals and the ordering.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const lt = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return a * d < c * b; };
const THR = 0.0223 / (1 + 1e-12);

export const R5_P47_MIXED = Object.freeze({
  id: 'r5-p47-mixed-2026-10-05',
  date: '2026-10-05',
  title: 'P47 mixed-frequency decoupling (Lemma MS): 0 of 372 P47 floors; WOL-C for P29 ×4 and P31 ×3',
  status: 'PARTIAL: Lemma MS proved; WOL-C certified for 7 non-P47 floors; P47 NOT certified (0/372). One internal referee pass (minor). NO QED.',
  lemma: 'MS (matrix-stiffness decoupling): one-prime + mixed part ≤ Σ_q r_q(θ_q) + B under an exact-rational PSD certificate',
  certified: Object.freeze({
    '226|1|sharp (P29)': { margin: 0.014114, referee: 0.013250 },
    '229|1|sharp (P29)': { margin: 0.014856, referee: 0.013958 },
    '242|1|sharp (P29)': { margin: 0.012593, referee: 0.011833 },
    '245|1|sharp (P29)': { margin: 0.013218, referee: 0.012434 },
    '248|1|sharp (P31)': { margin: 0.014891, referee: 0.014121 },
    '251|1|sharp (P31)': { margin: 0.015548, referee: 0.014757 },
    '254|1|sharp (P31)': { margin: 0.016253, referee: 0.015440 },
  }),
  notCertified: Object.freeze({
    'P47 231|0.94|r_19_40 (Ms 1e11, referee)': 0.051031, 'P47 260|0.94|r_19_40': 0.07922, 'P47 300|0.94|r_49_100': 0.18185, 'P43 228|0.94|r_19_40': 0.039872,
  }),
  p47Components: Object.freeze({
    cell231: { msB: 0, r4Mixed: 0.017732, tailsBound: 0.02496, tailsTrueFloat: [0.002, 0.009], extraLossFloat: 0.013443 },
    cell260: { msB: 0.00069, r4Mixed: 0.0279, tailsBound: 0.04471 },
    cell300: { msB: 0.025932, r4Mixed: 0.0579, tailsBound: 0.08333 },
  }),
  values: Object.freeze({
    claimedCert: { exact: '36694460612067/250000000000000', dec: '0.146777842448268', note: 'on the r4 merged admission (147 r3core4.c floors, not certified after the core-audit referee): SUPERSEDED' },
    refereeRegrid: { exact: '146777674239293/1000000000000000', dec: '0.146777674239293', note: 'same basis, referee re-grid shifts: SUPERSEDED' },
    hybrid: { exact: '72387568486103/500000000000000', dec: '0.144775136972206', note: 'CONDITIONAL on WOL-C for 373 path floors (P47 372, P43 1); NOT PROVED' },
  }),
  verdict: 'NOT PROVED for P47: 0 of 372 P47 floors certified. Lemma MS (proved, refereed internally) removes the mixed-frequency loss at early '
    + 'P47 cells (231, 260) but not at cell 300; the theta-uniform label tails plus extra part (measured about 0.029-0.036 at cell 231) and, at '
    + 'late cells, the first-branch majorant block P47. WOL-C certified for P29 x4 and P31 x3 (superseded in the r5 synthesis by smaller '
    + 'p29-43 margins). Lambda < 0.145 is NOT certified. PT Lambda <= 0.2 stands. RH open. NO QED.',
});

const W = R5_P47_MIXED;
export const R5_P47_MIXED_ASSERTIONS = Object.freeze([
  {
    id: 'r5-p47mix-margins',
    holds: () => Object.values(W.certified).every((x) => x.margin > 0 && x.margin <= THR && x.referee <= x.margin)
      && Object.values(W.notCertified).every((m) => m > THR) && Object.keys(W.certified).length === 7,
    why: '7 certified margins ≤ 0.0223/(1+1e-12), each with a smaller referee re-grid margin; the P47/P43 bounds exceed it.',
  },
  {
    id: 'r5-p47mix-cell300-binding',
    holds: () => W.p47Components.cell300.msB > 0.0223 && W.p47Components.cell231.msB === 0
      && W.p47Components.cell231.tailsBound - W.p47Components.cell231.tailsTrueFloat[1] < 0.0223,
    why: 'Referee correction: MS B is binding at cell 300; at cell 231 the tail loss alone is not shown to exceed the budget.',
  },
  {
    id: 'r5-p47mix-values',
    holds: () => Object.values(W.values).every((v) => { const n = exact15(v.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(v.dec)) < 1e-16; })
      && lt(W.values.hybrid.exact, '145/1000') && lt('145/1000', W.values.refereeRegrid.exact) && lt(W.values.refereeRegrid.exact, W.values.claimedCert.exact),
    why: 'Exact decimals; hybrid (conditional) < 0.145 < superseded certified-basis values.',
  },
  {
    id: 'r5-p47mix-honest',
    holds: () => /NO QED/.test(W.status) && /PT Lambda <= 0\.2 stands/.test(W.verdict) && /NOT certified/.test(W.verdict) && /SUPERSEDED/.test(W.values.claimedCert.note),
    why: 'P47 not certified; the claimed certified value rests on the refuted r3core4.c floors; no QED.',
  },
]);

export default R5_P47_MIXED;
