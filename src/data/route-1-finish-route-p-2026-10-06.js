/**
 * @fileoverview route-1-finish-route-p-2026-10-06 — roadmap route 1 (batch 1): round 7 of route P (P47 late-cell full-run
 * certificates, referee re-certification sample, exact consumer). One run plus one adversarial internal referee pass (not
 * refuted, minor); the referee corrections are applied below.
 *
 * Outcome: Λ < 0.145 by route P is NOT certified. The certified route-P value at PT height drops from 0.146660920737233 (r6)
 * to 0.145694083872924 (r6 admission + 244 r7 full-run certificates, referee margin where smaller).
 *
 * PROVED: nothing new. Nothing is proved unconditionally below 0.2.
 * CERTIFIED (interval/Arb, single engine, internal referee; conditional on the shared ledger as in r6):
 *  - U = 36423520968231/(2.5·10^14) = 0.145694083872924 (exact consumer tmp/r3-outer-mixed.py; E1–E8 74,596 steps, 0 failures,
 *    h ∈ [0.6336, 2.18]; altlog U_robust = U). Full-run margins only: 0.145694090247016. 241-floor audited: 0.145727738916286.
 *  - Referee upgrade: all 244 assembled certificates (incl. idx 69/72/73 and the 13 budget-stopped ones) pass an EXACT real-
 *    coverage check (double-double endpoints, 0 holes, finite bounds, exact margins equal report.json); 523 certfile entries
 *    validated (279 = r6 base, 244 ≤ 0.0023 − m − 1e-9, min slack 1.13e-13). Independent rebuild: 145694083872923/10^15 (1e-15
 *    lower, pad-rounding convention).
 *  - Referee sample: 24 of 41 finished, 16 CONFIRMED, 8 budget-stopped, 17 never started. CONFIRMED means replication of the
 *    v4c engine bounds by an independent driver, grid, geometry and precision — NOT an independent implementation of the bounds.
 * CONDITIONAL: Λ < 0.145 needs the 125 missing P47 floors, referee confirmation and the shared ledger (G0-c, AF-gaps,
 *  lemmaB-written, producer-layer, RH-win, RH-head).
 * MEASURED (hypothetical margins, exact consumer): missing at target 0.145014984066468 (> 0.145); missing + 13 incomplete at
 *  target 0.144994807008588 (5.2e-6 below). Referee scan: missing floors alone at fraction f of target cross 0.145 between
 *  f = 0.97 and f = 0.90 — so "missing floors alone are not enough" holds only at exactly-target margins (corrected); whether
 *  0.9× target is reachable is unknown (no point bounds recorded for the missing floors).
 * HEURISTIC: cells 417–424 (0.88|sharp) are the binding obstacle (need point bound + ≈ 0.008; stalled at 0.10–0.19).
 *
 * PT Λ ≤ 0.2 is the accepted benchmark; 0.1758354 and 0.1787854 remain computer-assisted candidates; RH open; NO QED.
 * Import-free. ROUTE_1_ASSERTIONS recompute the exact decimals, orderings, threshold crossings and counts live.
 */

const big = (s) => { if (Array.isArray(s)) return s; const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const sub = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return [a * d - c * b, b * d]; };
const num = (x) => { const [a, b] = big(x); return Number(a) / Number(b); };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };

const V = (exact, dec, grade, label) => Object.freeze({ exact, dec, grade, label });

export const ROUTE_1 = Object.freeze({
  id: 'route-1-finish-route-p-2026-10-06',
  route: 1,
  date: '2026-10-06',
  title: 'Route 1: route P round 7 — certified 0.145694083872924 at PT height; Λ < 0.145 not certified',
  status: 'partial',
  headline: 'Round 7 lowers the certified route-P value at PT height from 0.146660920737233 to 0.145694083872924 (244 P47 full-run '
    + 'certificates, exact coverage re-checked by the referee). Λ < 0.145 is not certified: 125 floors are missing and 13 are budget-stopped.',

  values: Object.freeze({
    fullref: V('36423520968231/250000000000000', '0.145694083872924', 'CERTIFIED', 'r6 + 244 r7 full-run floors, referee margin where smaller (best)'),
    full: V('18211761280877/125000000000000', '0.145694090247016', 'CERTIFIED', 'r6 + 244 r7 full-run margins only'),
    audited241: V('72863869458143/500000000000000', '0.145727738916286', 'CERTIFIED', 'r6 + the 241 floors audited earlier'),
    refall: V('14660599017087/100000000000000', '0.14660599017087', 'CERTIFIED', 'r6 + all 24 referee certificates'),
    refconf: V('146627093782297/1000000000000000', '0.146627093782297', 'CERTIFIED', 'r6 + 16 referee-CONFIRMED margins'),
    r6: V('146660920737233/1000000000000000', '0.146660920737233', 'CERTIFIED', 'r6 admission (reproduced)'),
    rebuildReferee: V('145694083872923/1000000000000000', '0.145694083872923', 'CERTIFIED', 'referee rebuild, own pad convention'),
    scenMissing: V('36253746016617/250000000000000', '0.145014984066468', 'MEASURED', 'hypothetical: 125 missing at target'),
    scenMissingIncomplete: V('36248701752147/250000000000000', '0.144994807008588', 'MEASURED', 'hypothetical: missing + 13 incomplete at target'),
  }),
  // Referee scan (MEASURED, hypothetical): 125 missing floors at fraction f of their targets, on top of the fullref certfile.
  missingFractionScan: Object.freeze([
    Object.freeze({ f: 0.99, exact: '72506606848579/500000000000000', dec: '0.145013213697158' }),
    Object.freeze({ f: 0.97, exact: '580038686009/4000000000000', dec: '0.14500967150225' }),
    Object.freeze({ f: 0.90, exact: '72498756048599/500000000000000', dec: '0.144997512097198' }),
    Object.freeze({ f: 0.80, exact: '18122496514641/125000000000000', dec: '0.144979972117128' }),
  ]),
  floors: Object.freeze({ p47Total: 369, certified: 244, missing: 125, incompleteAmongCertified: 13, newThisSession: Object.freeze([69, 72, 73]),
    newMargins: Object.freeze([0.0204923, 0.0222960, 0.0222073]) }),
  referee: Object.freeze({ sample: 41, finished: 24, confirmed: 16, budgetStopped: 8, notStarted: 17, diffRange: [-8.3e-5, -9.4e-8],
    coverage: Object.freeze({ certificates: 244, holes: 0, certfileEntries: 523, r6Base: 279, minSlack: 1.13e-13 }),
    independence: 'driver-level only: r7-ref-full-cert.py imports the r7-engine-cert-v4c.py bound routines unchanged' }),
  bands: Object.freeze({ steps: 74596, fails: 0, hMin: 0.6336, hMax: 2.18, h2Range: [0.5, 2.5], altlog: 'pass (U_robust − U = 0)' }),
  cost: Object.freeze({ wallHoursPerFloor2Workers: 2.1, cpuHoursRemaining: [300, 350] }),

  refereeKilled: Object.freeze([
    '"completing the missing floors alone is not enough" — true only at exactly-target margins; at ≈ 0.90–0.92 of target they would suffice (unknown if reachable)',
    '16 CONFIRMED floors presented as independent verification — they replicate the v4c bound formulas with an independent driver, not an independent implementation',
    'idx 69/72/73 cover-checked only with float tolerances — now closed by the referee\'s exact coverage check',
  ]),
  nextStep: 'Use tmp/routes-b1-r1-venv/bin/python. (1) Resume the 13 incomplete floors with --resume --retarget, cells 417–424 first. '
    + '(2) tmp/routes-b1-r1-full-sched.py on the 125 missing floors (≈ 300–350 CPU-h, 2 workers, bounded --deadline); record point bounds '
    + 'to test whether 0.9× target is reachable. (3) Finish the referee sample (8 budget-stopped, 17 never started). (4) Rerun '
    + 'tmp/routes-b1-r1-final.sh. Move /tmp-hardcoded inputs to a durable location (path change needs approval).',
  environment: 'macOS /tmp cleaner deleted venv sources and b145 archive inputs; restored from the review packet (sha256 match MANIFEST.sha256); packet-pinned venv tmp/routes-b1-r1-venv.',
  files: Object.freeze(['tmp/r7-final/README.md', 'tmp/r7-final/results.json', 'tmp/r7-final/merge2/certfile_fullref.json', 'tmp/r7-final/assembled/report.json',
    'tmp/r7-final/referee_summary.json', 'tmp/routes-b1-ref1-out/cover_all.json', 'tmp/routes-b1-ref1-out/rcert_check.json', 'tmp/routes-b1-r1-full-sched.py']),
  verdict: 'Λ < 0.145 by route P is NOT certified. Certified route P at PT height: 0.145694083872924 (from 0.146660920737233), conditional on the '
    + 'shared ledger as in r6; single engine, internal referee only. Measured: missing floors at target give 0.145015; adding the 13 '
    + 'budget-stopped floors at target gives 0.144995; missing floors alone suffice only at ≈ 0.9× target or better. Nothing new is proved. '
    + 'No refereed bound is changed; 0.1758354 and 0.1787854 remain computer-assisted candidates; RH open; NO QED.',
});

const R = ROUTE_1;
const v = (k) => R.values[k].exact;

export const ROUTE_1_ASSERTIONS = Object.freeze([
  {
    id: 'r1-values-exact',
    holds: () => [...Object.values(R.values), ...R.missingFractionScan].every((x) => { const n = exact15(x.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(x.dec)) < 1e-16; }),
    why: 'Every stated decimal is the exact value of its rational (denominators divide 10^15).',
  },
  {
    id: 'r1-ordering',
    holds: () => lt(v('scenMissingIncomplete'), '145/1000') && lt('145/1000', v('scenMissing')) && lt(v('scenMissing'), v('rebuildReferee'))
      && lt(v('rebuildReferee'), v('fullref')) && lt(v('fullref'), v('full')) && lt(v('full'), v('audited241')) && lt(v('audited241'), v('refall'))
      && lt(v('refall'), v('refconf')) && lt(v('refconf'), v('r6')),
    why: 'missing+incomplete (0.144995) < 0.145 < missing only (0.145015) < certified r7 (0.145694…) < 241-floor < referee-only merges < r6.',
  },
  {
    id: 'r1-gain-and-gaps',
    holds: () => { const g = num(sub(v('r6'), v('fullref'))); const m = num(sub('145/1000', v('scenMissingIncomplete')));
      const rb = num(sub(v('fullref'), v('rebuildReferee')));
      return g > 9.66e-4 && g < 9.67e-4 && m > 5.19e-6 && m < 5.20e-6 && Math.abs(rb - 1e-15) < 1e-18 && num(sub(v('fullref'), '145/1000')) > 6.9e-4; },
    why: 'r7 lowers certified route P by 9.668e-4; still 6.94e-4 above 0.145; the all-at-target scenario is 5.19e-6 below; rebuild differs by 1e-15.',
  },
  {
    id: 'r1-missing-fraction-crossing',
    holds: () => { const s = R.missingFractionScan;
      return s.every((x, i) => i === 0 || (x.f < s[i - 1].f && lt(x.exact, s[i - 1].exact)))
        && !lt(s[0].exact, '145/1000') && !lt(s[1].exact, '145/1000') && lt(s[2].exact, '145/1000') && lt(s[3].exact, '145/1000')
        && lt(s[0].exact, v('scenMissing')); },
    why: 'Referee correction: the missing floors alone cross below 0.145 between 0.97 and 0.90 of target (monotone scan), so "not enough" holds only at target.',
  },
  {
    id: 'r1-counts',
    holds: () => { const f = R.floors, r = R.referee;
      return f.certified + f.missing === f.p47Total && f.incompleteAmongCertified < f.certified && f.newMargins.every((m) => m > 0 && m < 0.0233)
        && r.confirmed + r.budgetStopped === r.finished && r.finished + r.notStarted === r.sample && r.diffRange.every((d) => d < 0)
        && r.coverage.certificates === f.certified && r.coverage.holes === 0 && r.coverage.r6Base + r.coverage.certificates === r.coverage.certfileEntries; },
    why: '244 + 125 = 369 P47 floors; referee 16 + 8 = 24 finished, + 17 = 41; exact coverage 244/244, 0 holes; 279 + 244 = 523 certfile entries.',
  },
  {
    id: 'r1-bands',
    holds: () => R.bands.fails === 0 && R.bands.hMin >= R.bands.h2Range[0] && R.bands.hMax <= R.bands.h2Range[1] && R.bands.steps > 7e4,
    why: 'E1–E8 on the r7 certfile: 74,596 steps, 0 failures, heights inside the Lemma H2 range.',
  },
  {
    id: 'r1-honest-scope',
    holds: () => R.status === 'partial' && /NOT certified/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict)
      && /not an independent implementation/.test(R.refereeKilled[1]) && /driver-level/.test(R.referee.independence),
    why: 'Λ < 0.145 not certified; referee independence is driver-level only; no QED.',
  },
]);

export default ROUTE_1;
