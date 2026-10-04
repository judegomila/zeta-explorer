/**
 * @fileoverview r4-wol-pd-2026-10-04 — WOL-C angle 1: positive-definite Fourier (cosine-series) majorant of the r2 bound function Φ_E on
 * the outer torus. One adversarial internal referee pass (tmp/r4-ref-wol-pd-*): not refuted, minor.
 *
 * Method: on the outer torus K0(θ) = Σ_m (b_m/2) cos(a log m/2) cos<e(m),θ> and X_j(θ) = −Σ_m (b_{m r_j}/2) cos(a log(m r_j)/2) e^{i<e(m),θ>}
 *  (L1, needs c_1 zero-free on the closed S-polydisc); b_n ≥ 0 for n ≤ N0 and n^{tL/4} b_n nondecreasing in t (L2, lognormal cumulants /
 *  Mayer expansion, mechanism of Lemma CG); AM-GM + first variation + Cauchy–Schwarz cosine majorant (L3); θ-uniform extra part with a
 *  region ladder and weak duality (L4); tail identities and a head-subtracted Cauchy far-tail bound at radius q^δ, δ ∈ {0.5,0.4,0.3,0.2} (L5).
 *
 * Referee corrections applied:
 *  - Rounding: Mlab = bincount(..)·(1+1e-9) rounds mixed-sign float sums the wrong way; measured understatement of U up to 1.65e-11 per
 *    piece (P29), above the 1e-13 admission slack. Every r4 shift is lowered by 1e-9 (tmp/r4-ref-wol-pd-out/adm_r4_all_pad1e-9.json);
 *    padded values below are the ones consumed. Coverage of the padding: 5 audited pieces + an a-priori ~1e-10 estimate, not a full audit.
 *  - E6-altlog: the unpadded runs fail the redundant altlog cross-check listed in lemma-B §6.1.2 by 6.3e-17 / 1.6e-17 (primary Leibniz
 *    bound holds); the padded runs pass E1–E8 with 0 failures.
 *  - r4-only band run heights [0.71, 2.18] (0.6688 is the merged run); certified on-list cells 0–243; 267 distinct consumer keys (not 268);
 *    L5 radius q^δ with δ ∈ {0.5,0.4,0.3,0.2}; CPU 21,398 s incl. a duplicate run.
 *  - Unwritten steps re-derived TRUE: region-B duality uses only the + probe (f_q even, log g⁻(θ) = log g⁺(−θ)); far_D0inv2 bound needs
 *    log m · m^−δ decreasing for m ≥ e^{1/δ}.
 *  - P47 wording: the IMPLEMENTED majorants leave measured bad mass 0.0166–0.19; that the angle cannot reach P47 in general is HEURISTIC.
 *
 * CERTIFIED (in-session, one referee pass, single implementation): WOL-C for 263 entries (257 of 630 band-path + 6 off-list P11).
 * CONDITIONAL: every Λ value below (shared G0/AF/Lemma-B inputs). MEASURED: P47 survey. HEURISTIC: P47 general obstruction.
 * Import-free. ASSERTIONS recompute the per-prefix counts, the rational→decimal values, the padding direction and the value ordering.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const lt = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return a * d < c * b; };

export const R4_WOL_PD = Object.freeze({
  id: 'r4-wol-pd-2026-10-04',
  date: '2026-10-04',
  title: 'WOL-C angle 1 (positive-definite Fourier majorant): 257 of 630 band-path entries certified; certified-only route P 0.1468431',
  status: 'PARTIAL: WOL-C certified for 263 single entries (257 band-path: all P7–P23, 3 of P29); P47 (363 entries) not reached. One internal referee pass (minor). NO QED.',
  lemmas: Object.freeze(['L1 Fourier form', 'L2 log-positivity b_n ≥ 0', 'L3 cosine majorant', 'L4 extra part + region ladder', 'L5 tail identities']),
  lemmaGrade: 're-derived by the referee and confirmed; exist only in code docstrings and the report (no formalization note)',
  certifiedByPrefix: Object.freeze({ P7: [15, 15], P11: [70, 70], P13: [74, 74], P17: [22, 22], P19: [34, 34], P23: [39, 39], P29: [3, 8], P31: [0, 5], P47: [0, 363] }),
  offList: 6,
  margins: Object.freeze({ P7: [0.002508, 0.004271], P11: [0.00338, 0.00824], P13: [0.00704, 0.017], P17: [0.01092, 0.01212], P19: [0.01272, 0.01567], P23: [0.01612, 0.02156], P29: [0.021486, 0.021988] }),
  failed: Object.freeze({ P29: [0.0224, 0.0227, 0.0231, 0.0241, 0.0249], P31: [0.0256, 0.0259, 0.0263, 0.0267, 0.0275] }),
  rounding: Object.freeze({ worstUnderstatement: 1.65e-11, admissionSlack: 1e-13, pad: 1e-9 }),
  values: Object.freeze({
    r4Unpadded: { exact: '4588846805597/31250000000000', dec: '0.146843097779104', note: 'valid only to ~1e-11 (rounding defect)' },
    r4Padded: { exact: '29368619557091/200000000000000', dec: '0.146843097785455', note: 'consumed form; E1–E8 0 failures, 75,184 steps, h ∈ [0.71, 2.18]; no r3core4.c floor' },
    r4r3Padded: { exact: '146827593305099/1000000000000000', dec: '0.146827593305099', note: 'with the 9 r3 certificates (r3core4.c); E1–E8 0 failures, 75,176 steps' },
    hybrid: { exact: '18100123898753/125000000000000', dec: '0.144800991190024', note: 'CONDITIONAL on WOL-C at 0.0223 for 379 uncertified path floors (P47 370, P29 5, P31 3, P43 1)' },
  }),
  p47Survey: Object.freeze({ min: 0.0166, median: 0.098, max: 0.19, below0223: 9, n: 363, grade: 'measured (float), implemented majorant variants only' }),
  verdict: 'WOL-C certified for 263 entries by the positive-definite majorant (257 of 630 band-path entries). With the referee 1e-9 padding the '
    + 'certified-only route-P value is 0.146843097785455, below the b145 PT value 0.147273668782792. P47 is not reached by the implemented '
    + 'majorants (measured); the general obstruction is heuristic. Conditional on the shared inputs and on the unaudited single implementation. '
    + 'PT Lambda <= 0.2 stands. RH open. NO QED.',
});

const W = R4_WOL_PD;
export const R4_WOL_PD_ASSERTIONS = Object.freeze([
  {
    id: 'r4-wolpd-counts',
    holds: () => {
      const c = Object.values(W.certifiedByPrefix);
      return c.reduce((s, [a]) => s + a, 0) === 257 && c.reduce((s, [, b]) => s + b, 0) === 630 && c.every(([a, b]) => a <= b) && 257 + W.offList === 263;
    },
    why: '257 of the 630 band-path entries (all P7–P23 and 3 of 8 P29) plus 6 off-list P11 entries = 263 certificates.',
  },
  {
    id: 'r4-wolpd-margins-admissible',
    holds: () => Object.values(W.margins).every(([lo, hi]) => lo > 0 && lo <= hi && hi <= 0.0223 / (1 + 1e-12))
      && Object.values(W.failed).flat().every((m) => m > 0.0223 / (1 + 1e-12)),
    why: 'Every certified margin is ≤ 0.0223/(1+1e-12); every failed attempt is above it.',
  },
  {
    id: 'r4-wolpd-values-exact',
    holds: () => Object.values(W.values).every((v) => { const n = exact15(v.exact); return n !== null && `0.${String(n).padStart(15, '0')}`.replace(/0+$/, '') === v.dec.replace(/0+$/, ''); }),
    why: 'Every stated decimal is the exact value of its rational on the 1e-15 grid.',
  },
  {
    id: 'r4-wolpd-padding-direction',
    holds: () => lt(W.values.r4Unpadded.exact, W.values.r4Padded.exact) && lt(W.values.r4r3Padded.exact, W.values.r4Padded.exact)
      && W.rounding.pad > 60 * W.rounding.worstUnderstatement && W.rounding.worstUnderstatement > W.rounding.admissionSlack,
    why: 'Lowering every floor by 1e-9 raises Λ (safe direction); the pad is > 60× the worst audited deficit, which exceeds the 1e-13 slack.',
  },
  {
    id: 'r4-wolpd-ordering',
    holds: () => lt(W.values.hybrid.exact, '145/1000') && lt('145/1000', W.values.r4Padded.exact)
      && lt(W.values.r4Padded.exact, '18409208597849/125000000000000') && lt('18409208597849/125000000000000', '73770784989943/500000000000000'),
    why: 'hybrid (conditional) < 0.145 < certified-only r4 < b145 PT < previous certified-only route P.',
  },
  {
    id: 'r4-wolpd-honest', holds: () => /NO QED/.test(W.status) && /PT Lambda <= 0\.2 stands/.test(W.verdict) && /heuristic/.test(W.verdict) && /CONDITIONAL/.test(W.values.hybrid.note),
    why: 'P47 general obstruction is heuristic; sub-0.145 value conditional; no QED.',
  },
]);

export default R4_WOL_PD;
