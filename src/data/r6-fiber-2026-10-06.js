/**
 * @fileoverview r6-fiber-2026-10-06 — factorized-fiber WOL-C certificate engine for the P47 hybrid-path floors (Fiber Lemma: P47 labels,
 * K0 and norms reduced exactly to S = {2,3,5} structure data times finite fiber sums over the primes 7..47; Lemma Q; majorant tails;
 * regional extra-part bound; structure-gap bound; Taylor-model best-first branch and bound over θ_{2,3,5}). Run on 12 of 369 floors.
 * One adversarial internal referee pass (tmp/r6-ref-fiber-*): REFUTED, FATAL.
 *
 * Referee findings:
 *  - FATAL: tmp/r6-fiber-cert.py Piece.tails_defect builds the x = 1 dual totals E1, dE1 only on S235 labels ρ = μr ≤ N0 and drops the
 *    coefficients e_{μr} = −c_r w_μ, de_{μr} = −dc_r w_μ − c_r dw_μ for N0/r < μ ≤ N0. The lemma (all μ) is correct; the implementation
 *    is not a majorant. Demonstrated: at cell 579, θ = 0, t = t_L, 54,096 of 95,905 labels have a true fiber tail above T_r (ratio up to
 *    6.2); e.g. p = 688111: |tail| 1.2260e-8 vs T_p 2.3950e-9. The defective tails feed the label tail cone, KLtail (β) and the
 *    structure-gap tail; all 12 certificates use them.
 *  - Corrected re-certification (claimant engine + referee patch tmp/r6-ref-fiber-fix.py, stored covers, stored bounds discarded):
 *    WOL-C only for 234, 235, 237; 247 → 0.0239997 and 256 → 0.0269994 (not WOL-C; the corrected point bound at θ_s = 0 already exceeds
 *    0.0223, MEASURED); late cells 0.053–0.116. The patch is unrefereed (single implementation).
 *  - Minor: 265 had r5 base margin 0.1536; hybrid with r6 shifts 0.144797588132355 (moot); trust base is r6t2_label/r6t2_aggmask (r6tm2.c),
 *    r6maj.c and the numpy assembly (tails, tails_defect), not r6core.c; the 4π³ volume check is not a cover proof (referee verified the
 *    covers exactly); fresh runs took 2800–5816 s.
 *
 * PROVED (re-derived by the referee): Fiber Lemma (finite and log parts), Lemma Q (also in the unconditional AM–GM form), cone and
 *  weighted Cauchy–Schwarz splits, AM–GM fold, majorant tail lemma in both forms (provided E, dE carry all μ), extra-part chord lemma,
 *  structure-gap corollary, symmetry, box theorem. CERTIFIED: nothing admitted (claimant certfile refuted; corrected margins rest on an
 *  unrefereed patch). MEASURED: corrected point bounds; consumer sensitivity. Import-free.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };

const E = (cell, key, claimed, corrected, wolcCorrected, budgetStopped) => Object.freeze({ cell, key, claimed, corrected, wolcCorrected, budgetStopped });

export const R6_FIBER = Object.freeze({
  id: 'r6-fiber-2026-10-06',
  date: '2026-10-06',
  title: 'P47 factorized-fiber WOL-C engine: lemmas proved; the 12 certificates REFUTED (defect-form tail majorant drops −c_r w_μ terms)',
  status: 'REFUTED (fatal) by the internal referee: the certificate engine is not a majorant (tails_defect). Lemmas proved as mathematics. Nothing admitted. NO QED.',

  defect: Object.freeze({
    file: 'tmp/r6-fiber-cert.py', fn: 'Piece.tails_defect', missing: '−c_r w_μ and −dc_r w_μ − c_r dw_μ for N0/r < μ ≤ N0',
    cell579: { labelsViolated: 54096, labels: 95905, maxRatio: 6.2 }, worstRatio234: 1.9, worstRatio256: 1.4,
    example: { p: 688111, trueTail: 1.2260e-8, codeBound: 2.3950e-9 }, plainFormMaxRatio: 0.72, patchedMaxRatio: 0.74,
  }),
  entries: Object.freeze([
    E(234, '234|0.94|r_19_40', 0.0222922, 0.0222885, true, false),
    E(235, '235|0.94|r_19_40', 0.0222802, 0.0222798, true, false),
    E(237, '237|0.94|r_19_40', 0.0222974, 0.0222968, true, false),
    E(247, '247|0.94|r_19_40', 0.0222778, 0.0239997, false, false),
    E(256, '256|0.94|r_19_40', 0.0222996, 0.0269994, false, false),
    E(265, '265|0.94|r_19_40', 0.0276157, 0.0349954, false, false),
    E(508, '508|0.88|r_23_40', 0.0992388, 0.1162102, false, true),
    E(544, '544|0.88|r_3_5', 0.0789993, 0.0889734, false, true),
    E(553, '553|0.88|r_3_5', 0.0599987, 0.0765267, false, true),
    E(562, '562|0.88|r_3_5', 0.0555467, 0.0555392, false, false),
    E(571, '571|0.88|r_3_5', 0.0601200, 0.0601195, false, false),
    E(579, '579|0.88|r_3_5', 0.0449790, 0.0533095, false, true),
  ]),
  values: Object.freeze({
    claimRefuted: { exact: '73317871105603/500000000000000', dec: '0.146635742211206', label: 'claimant consumer value with the 12 r6 fiber shifts (NOT certified: engine defect)' },
    refCorrectedOnR5: { exact: '146636936821847/1000000000000000', dec: '0.146636936821847', label: 'referee-corrected 12 margins on the r5 admission (unrefereed patch)' },
    refCorrectedOnR6: { exact: '29327387153371/200000000000000', dec: '0.146636935766855', label: 'referee-corrected 12 margins on the r6 admission (r6 synthesis; unrefereed patch)' },
    r5Base: { exact: '73330460909801/500000000000000', dec: '0.146660921819602', label: 'r5 certified route P (unchanged by this task)' },
  }),
  proved: Object.freeze(['Fiber Lemma (finite + log parts)', 'Lemma Q', 'cone / weighted Cauchy–Schwarz / AM–GM fold', 'majorant tail lemma (plain + defect form, all μ)',
    'extra-part chord lemma', 'structure-gap corollary', 'symmetry Φ_E(−θ) = Φ_E(θ)', 'box theorem']),
  costPerFloorSeconds: Object.freeze([2800, 5816]),
  verdict: 'REFUTED (fatal): the r6 fiber certificates are not certificates (defect-form tail majorant omits the -c_r w_mu coefficients '
    + 'for N0/r < mu <= N0; per-label tails violated up to 6.2x). With the referee patch (unrefereed) WOL-C holds only at cells 234, 235, 237; '
    + '247/256 out of reach for this method; late cells 0.053-0.116. Nothing admitted; certified route P unchanged by this task. '
    + 'PT Lambda <= 0.2 stands. RH open. NO QED.',
});

const B = R6_FIBER;
export const R6_FIBER_ASSERTIONS = Object.freeze([
  {
    id: 'r6-fiber-corrected-margins',
    holds: () => {
      const wolc = B.entries.filter((e) => e.corrected <= 0.0223 / (1 + 1e-12));
      return B.entries.length === 12 && wolc.map((e) => e.cell).join() === '234,235,237' && B.entries.every((e) => e.wolcCorrected === wolc.includes(e))
        && B.entries.filter((e) => e.claimed <= 0.0223 / (1 + 1e-12)).length === 5 && B.entries.filter((e) => e.cell >= 500).every((e) => e.corrected > 0.05);
    },
    why: 'Claimed 5 WOL-C floors; after correction only 234/235/237 are ≤ 0.0223; every late cell (≥ 500) stays above 0.05.',
  },
  {
    id: 'r6-fiber-defect-real',
    holds: () => B.defect.cell579.maxRatio > 1 && B.defect.example.trueTail > B.defect.example.codeBound && B.defect.plainFormMaxRatio < 1
      && B.defect.patchedMaxRatio < 1 && B.defect.cell579.labelsViolated < B.defect.cell579.labels,
    why: 'True tails exceed the code bound (ratio up to 6.2); plain-form and patched majorants hold (ratios < 1).',
  },
  {
    id: 'r6-fiber-values-not-admitted',
    holds: () => cmp(B.values.claimRefuted.exact, B.values.refCorrectedOnR5.exact) < 0 && cmp(B.values.refCorrectedOnR5.exact, B.values.r5Base.exact) < 0
      && cmp(B.values.refCorrectedOnR6.exact, B.values.refCorrectedOnR5.exact) < 0 && /REFUTED/.test(B.status) && /Nothing admitted/.test(B.verdict) && /NO QED/.test(B.verdict),
    why: 'Claimed value < corrected value < r5 base; neither fiber value is admitted.',
  },
]);

export default R6_FIBER;
