/**
 * @fileoverview r6-suffix-2026-10-06 — the r4 wol-pd block-suffix rounding gap (found by the r5 p29-43 referee) fixed AT SOURCE in every
 * engine that reused the r4 norms_tails, with absolute slacks for the other mixed-sign sums; all 425 affected certificates on the
 * certified route-P path re-run; r6 admission without the 2e-7 gap rule. One adversarial internal referee pass (tmp/r6-ref-suffix-*):
 * not refuted, minor.
 *
 * Engine changes (tmp/r6-suffix-mkengines.py; standard FP model, u = 2^-53, UU = 2.3e-16 ≥ 2u):
 *  F1 block suffix (cs[i] − cs[next])(1 + 1e-9) + 1e-300 + 1.01·N·UU·S_0 ≥ exact block suffix (asserted N·UU < 1e-6);
 *  F2 M_lab per bin ≤ bincount(w) + 1e-9·bincount(|w|) (bins < 10^6 terms); F3 bracket ≤ qmax + S1|c| + (|qmax| + S1|c|)·8UU;
 *  F4 Σκ^hi ≤ s + |s|·1e-9 + (n+3)·UU·Σ|κ^hi| (either sign, any order); A1 remaining relative-factor sums have N·UU < 1.9e-9.
 *
 * Referee corrections applied:
 *  - The 1e-9 admission pad is NOT a pure safety margin: it also absorbs the heuristic grid-maximisation allowances and the unaudited C
 *    accumulation in rig_tails (tmp/r4-wolpd-rig.c); it stays part of the rigour budget (minimum exact Lemma-1 slack 1.0001e-9 kept).
 *  - Same-configuration comparison: 250 exact matches (pd 190, p47far 1, p47farref 59) + 19 approximate (l1l5ref); on all 269 the change
 *    is ≤ dU_r5 + 1.21e-11.
 *  - F4 equals the v1 draft or is within 1 ulp on 82 pd re-runs; against the r4 form it adds (n+3)·UU·Σ|κ^hi| (1e-13 to 1e-11).
 *  - A1 is asserted in cert, cert2, cone (via cert2) and the l1l5 copies, not in p47mix (holds there: nsp·UU ≤ 5.3e-10; not path winners).
 *  - The 23 l1l5ref r6 files store no per-piece rows (tiling not checkable from the files; 4|1|r_49_100 reproduced bit-exactly).
 *  - P47 cone margins vary with the configuration at the 0.02 level (referee re-grid −0.0049..+0.0223), as documented in r5-p47-far.
 *
 * PROVED+REFEREED(internal): F1–F4, A1 (elementary FP bounds; exact-rational and big-integer tests: r6 never below the exact value).
 * CERTIFIED: 425 re-certificates (0 failures), P-cert(r6) with E1–E8 0 failures. CONDITIONAL: P-cond(r6) assumes WOL-C on 369 P47 floors.
 * Import-free.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const sub = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return [a * d - c * b, b * d]; };

export const R6_SUFFIX = Object.freeze({
  id: 'r6-suffix-2026-10-06',
  date: '2026-10-06',
  title: 'wol-pd rounding slacks fixed at source; 425 path certificates re-run; certified route P 0.146660920737233 without the 2e-7 gap rule',
  status: 'CERTIFIED (engine changes with one internal adversarial referee pass: not refuted, minor). Λ < 0.145 NOT certified. NO QED.',

  reruns: Object.freeze({ pd: 255, l1l5ref: 23, p47far: 67, p47farref: 66, p47mix: 7, p47mixref: 7, failures: 0, peakRssBytes: 3709000000, longestSeconds: 3227 }),
  admission: Object.freeze({ entries: 338, marginShifts: 333, s235: 5, lemma1MinSlack: 1.0001e-9, winners: { pd: 164, wpd2: 68, l1l5ref: 23, p2943ref: 13, p47farref: 64, p47far: 1, s235: 5 } }),
  path: Object.freeze({ floors: 337, wolc: 272, finite: 65, wolcMarginRange: [0.0020771, 0.0216687], finiteMarginRange: [0.0747894, 0.2727519],
    bySource: { pd: 164, wpd2: 68, l1l5ref: 23, p2943ref: 13, p47farref: 64, p47far: 1, s235: 4 } }),
  marginChange: Object.freeze({ min: 1.0e-8, max: 1.073e-7, negative: 0, above2e7: 0, sameCfgExact: 250, sameCfgApprox: 19, maxOverGap: 1.21e-11 }),
  rigorTest: Object.freeze({ P7: { entries: 5145644, r4BelowW: 511357, r4BelowDw: 429001, r6Below: 0, relDeficitMax: 5.6e-6 },
    P29: { entries: 6859347, r4BelowW: 280652, r4BelowDw: 205481, r6Below: 0, relDeficitMax: 9.4e-7 } }),
  bandRuns: Object.freeze({ cert: { steps: 75091, fails: 0, hMin: 0.6688, hMax: 2.18, windowMargin: 0.002055206525634991, startMargin: 2.000000000517967e-6, altlog: 'pass' },
    hybrid: { steps: 74137, fails: 0, hMin: 0.6336, hMax: 2.18, altlog: 'pass' }, cr8: { steps: 75090, fails: 0 } }),
  values: Object.freeze({
    'P-cert': { exact: '146660920737233/1000000000000000', dec: '0.146660920737233' },
    'P-cond': { exact: '5791903551831/40000000000000', dec: '0.144797588795775' },
    cr8: { exact: '146659467964229/1000000000000000', dec: '0.146659467964229' },
    r5Pcert: { exact: '73330460909801/500000000000000', dec: '0.146660921819602' },
    r5Pcond: { exact: '18099698688547/125000000000000', dec: '0.144797589508376' },
  }),
  corrections: Object.freeze(['1e-9 pad stays in the rigour budget', 'same-configuration matches 250 exact + 19 approximate', 'F4 comparison is against the v1 draft',
    'A1 not asserted in p47mix (holds)', 'l1l5ref files store no per-piece rows', 'P47 cone configuration noise ~0.02']),
  verdict: 'Rounding slacks fixed at source; all 425 affected path certificates re-run (0 failures); exact consumer gives the certified '
    + 'route-P value 146660920737233/10^15 = 0.146660920737233 (1.08e-9 below r5) on the same 337-floor path, E1-E8 0 failures. '
    + 'P-cond 0.144797588795775 still assumes WOL-C for 369 P47 floors: NOT certified. PT Lambda <= 0.2 stands. RH open. NO QED.',
});

const X = R6_SUFFIX;
export const R6_SUFFIX_ASSERTIONS = Object.freeze([
  {
    id: 'r6-suffix-counts',
    holds: () => {
      const s = (o) => Object.values(o).reduce((a, b) => a + b, 0);
      const { failures, peakRssBytes, longestSeconds, ...runs } = X.reruns;
      return s(runs) === 425 && failures === 0 && peakRssBytes < 4e9 && s(X.admission.winners) === X.admission.entries
        && X.admission.marginShifts + X.admission.s235 === X.admission.entries && s(X.path.bySource) === X.path.floors
        && X.path.wolc + X.path.finite === X.path.floors && X.path.wolcMarginRange[1] <= 0.0223 / (1 + 1e-12) && X.path.finiteMarginRange[0] > 0.0223;
    },
    why: '425 re-runs, 0 failures, < 4 GB; 338 admitted = 333 margin shifts + 5 S235; path 337 = 272 WOL-C + 65 finite-margin.',
  },
  {
    id: 'r6-suffix-values',
    holds: () => {
      const d = sub(X.values.r5Pcert.exact, X.values['P-cert'].exact); const g = Number(d[0]) / Number(d[1]);
      const e = sub(X.values.r5Pcond.exact, X.values['P-cond'].exact); const h = Number(e[0]) / Number(e[1]);
      return Math.abs(g - 1.082369e-9) < 1e-15 && h > 7.1e-10 && h < 7.2e-10 && X.marginChange.negative === 0 && X.marginChange.max < 2e-7
        && X.rigorTest.P7.r6Below === 0 && X.rigorTest.P29.r6Below === 0 && X.rigorTest.P7.r4BelowW > 0;
    },
    why: 'r6 lowers P-cert by exactly 1082369/10^15 and P-cond by 7.13e-10; margins only rise and by < 2e-7; r4 form undercuts the exact sums, r6 never.',
  },
  {
    id: 'r6-suffix-honest',
    holds: () => /NOT certified/.test(X.verdict) && /NO QED/.test(X.verdict) && /PT Lambda <= 0\.2 stands/.test(X.verdict) && X.corrections.length === 6,
    why: 'Certified, not proved; sub-0.145 conditional on WOL-C; referee corrections carried.',
  },
]);

export default R6_SUFFIX;
