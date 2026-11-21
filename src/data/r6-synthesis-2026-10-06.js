/**
 * @fileoverview r6-synthesis-2026-10-06 — synthesis of the r6 round (falsify, fiber, suffix; each with one adversarial internal referee
 * pass): referee corrections applied, route-P decision at PT height, refereed certified margins merged, the certified route-P value
 * recomputed with the exact consumer and E1–E8, the replay packet extended (R32–R39, A10–A12), the ledger and the path below 0.145.
 *
 * Decision on route P (task branch (b)): no certified WOL-C violation exists at P47 — the targeted search found none (max excess over
 *  Φ(0) 1.98e-6; sup_found Φ − K0* ≤ −0.00156 on all 369 floors; MEASURED). So route P is not ruled out; the refereed certified margins
 *  were merged and Λ recomputed.
 *
 * Referee corrections applied:
 *  falsify (confirmed, minor): T2 variation up to 6.9e-4 at far points; 640,000 = screened starts (3,136 converged; referee + 14,152
 *    converged ascents); per-entry excesses are corner lower bounds; 'sup Φ = Φ(0) fails by 2e-6' is MEASURED (r6-falsify module).
 *  fiber (REFUTED, fatal): tails_defect omits −c_r w_μ for N0/r < μ ≤ N0; certfile_r6.json NOT merged; referee-corrected margins
 *    (unrefereed patch) carried only as a variant value (r6-fiber module).
 *  suffix (not refuted, minor): F1–F4/A1 confirmed by exact tests; the 1e-9 pad stays in the rigour budget; same-config matches 250 exact
 *    + 19 approximate; A1 not asserted in p47mix (holds) (r6-suffix module). Its admission tmp/r6-suffix-out/final/cert_r6.json is the r6
 *    certified admission (rebuilt byte-identically by packet run R32).
 *
 * Exact consumer (tmp/r3-outer-mixed.py, unchanged):
 *   certified (r6 admission)                   → 146660920737233/10^15 = 0.146660920737233 (337 floors, same path as r5)
 *   hybrid: + WOL-C ASSUMED (0.0223), 369 P47  → 5791903551831/(4·10^13) = 0.144797588795775 (CONDITIONAL)
 *   variant + fiber referee-corrected 12       → 29327387153371/(2·10^14) = 0.146636935766855 (unrefereed patch: NOT certified)
 *   MEASURED sensitivity (hypothetical margins on the 369 P47 floors, tmp/r6-synth-scen.py, tmp/r6-synth-out/scen.log): see `scenarios`.
 *
 * PROVED: nothing unconditional below 0.2. CERTIFIED: P-cert(r6), conditional on the ledger. CONDITIONAL: every Λ below 0.2.
 * Import-free. ASSERTIONS recompute exact decimals, the ordering, the route-P threshold from the scenarios, the Route H cost arithmetic,
 * the ledger grades, which inputs each value needs, and the replay result.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const sub = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return [a * d - c * b, b * d]; };
const num = ([a, b]) => Number(a) / Number(b);
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };

const I = (id, what, grade, note, usedBy) => Object.freeze({ id, what, grade, note, usedBy: Object.freeze(usedBy) });
const ALL = ['P-cert', 'P-cond', 'b145'];
const S = (tag, early, late, exact, dec) => Object.freeze({ tag, early, late, split: 300, exact, dec });

export const R6_SYNTHESIS = Object.freeze({
  id: 'r6-synthesis-2026-10-06',
  date: '2026-10-06',
  title: 'r6 synthesis: certified route P 0.146660920737233 (rounding slacks fixed at source); no WOL-C violation at P47 (measured); sub-0.145 still needs WOL-C',
  status: 'SYNTHESIS of three internally refereed tasks (fiber refuted, fatal). Every Λ value below 0.2 remains conditional. NO QED.',
  decision: Object.freeze({ branch: 'b', wolcViolationCertified: false, wolcAtP47: 'true as MEASURED, NOT PROVED', maxExcessOverPhi0: 1.98275e-6, maxWolcMetric: -0.0015629 }),

  values: Object.freeze({
    'P-cert': { exact: '146660920737233/1000000000000000', dec: '0.146660920737233', label: 'route P, certified margins only (r6 admission, 337 floors), CERTIFIED' },
    'P-cond': { exact: '5791903551831/40000000000000', dec: '0.144797588795775', label: 'route P, + WOL-C at 0.0223 ASSUMED for 369 P47 floors (CONDITIONAL)' },
    PcertCr8: { exact: '146659467964229/1000000000000000', dec: '0.146659467964229', label: 'variant: + 8 referee r3core4.c re-certificates (referee code unrefereed)' },
    fiberCorrected: { exact: '29327387153371/200000000000000', dec: '0.146636935766855', label: 'variant: + 12 referee-corrected fiber margins (unrefereed patch), NOT certified' },
    fiberClaim: { exact: '73317871105603/500000000000000', dec: '0.146635742211206', label: 'r6 fiber claim on the r5 base: REFUTED (engine defect)' },
    PcertR5: { exact: '73330460909801/500000000000000', dec: '0.146660921819602', label: 'r5 certified route P (superseded by P-cert r6)' },
    PcondR5: { exact: '18099698688547/125000000000000', dec: '0.144797589508376', label: 'r5 conditional route P (superseded)' },
    b145: { exact: '18409208597849/125000000000000', dec: '0.147273668782792', label: 'b145 PT band + grid + two-height kernels, no r2 floors' },
    routeH3: { exact: '144951726247781/1000000000000000', dec: '0.144951726247781', label: 'Route H three-band, floor height 1.6X (needs RH to 4.80e12 and G0-d′ at 1.6X)' },
    U2: { exact: '36063660805739/250000000000000', dec: '0.144254643222956', label: 'band 2 at 2.6X' },
    noR2: { exact: '29511133454807/200000000000000', dec: '0.147555667274035', label: 'route-P consumer, no r2 floors' },
    candidate01758354: { exact: '1758354/10000000', dec: '0.1758354', label: 'existing project candidate (y-transfer)' },
  }),

  merge: Object.freeze({
    admitted: 'tmp/r6-suffix-out/final/cert_r6.json', sha256: '7d90d602cc97e54aa2b2c637416c277f0feb86b4f60bc9afcf2c21c549139eae',
    hybridSha256: '21f8e92b2200d66095e65715a60e971803eec8b694eda52d369ac1f2f5be0f1d', entries: 338,
    winners: { pd_r6: 164, wpd2: 68, l1l5ref_r6: 23, p2943ref: 13, p47farref_r6: 64, p47far_r6: 1, s235: 5 },
    notAdmitted: Object.freeze(['tmp/r6-fiber-out/final/certfile_r6.json (REFUTED engine)', 'referee-corrected fiber margins (unrefereed patch)', '8 referee r3core4.c re-certificates (variant only)']),
    lemma1: { checked: 333, ok: 333, minSlack: 1.0001e-9 }, gapRule: 'none (slacks fixed at source)',
  }),
  certPath: Object.freeze({ floors: 337, wolc: 272, finiteMarginOnly: 65, sameAsR5: true,
    byPrefix: { P7: 15, P11: 76, P13: 68, P17: 22, P19: 34, P23: 37, P29: 8, P31: 5, P43: 1, P47: 67, S235: 4 },
    wolcMarginRange: [0.0020771, 0.0216687], finiteMarginRange: [0.0747894, 0.2727520] }),
  hybridPath: Object.freeze({ floors: 635, certified: 266, uncertified: { P47: 369 }, uncertifiedCells: [234, 579] }),
  bandRuns: Object.freeze({
    'P-cert': { steps: 75091, fails: 0, hMin: 0.6688, hMax: 2.18, windowMargin: 0.002055206525634991, startMargin: 2.000000000517967e-6, altlog: 'pass' },
    'P-cond': { steps: 74137, fails: 0, hMin: 0.6336, hMax: 2.18, windowMargin: 0.0020552, startMargin: 2.0e-6, altlog: 'pass' },
    PcertCr8: { steps: 75090, fails: 0, hMin: 0.6688, hMax: 2.18, windowMargin: 0.0020537, startMargin: 2.0e-6 },
    h2Range: [0.5, 2.5],
  }),

  // MEASURED: exact consumer on the r6 admission with HYPOTHETICAL margins on the 369 P47 hybrid-path floors (cell ≤ 300: early, > 300: late)
  scenarios: Object.freeze([
    S('S1', 0.0223, 0.0533, '145017102249493/1000000000000000', '0.145017102249493'),
    S('S2', 0.035, 0.0533, '145046943575777/1000000000000000', '0.145046943575777'),
    S('S3', 0.035, 0.116, '9093282261763/62500000000000', '0.145492516188208'),
    S('S4', 0.0436, 0.0436, '144996173474757/1000000000000000', '0.144996173474757'),
    S('S5', 0.0223, 0.050, '28998632330891/200000000000000', '0.144993161654455'),
    S('S6', 0.0223, 0.048, '144978556429729/1000000000000000', '0.144978556429729'),
    S('S7', 0.035, 0.048, '145007985358407/1000000000000000', '0.145007985358407'),
    S('S8', 0.035, 0.045, '144986139557661/1000000000000000', '0.144986139557661'),
  ]),
  // best refereed-corrected fiber margins (unrefereed patch): early cells 0.0223–0.035, late cells 0.053–0.116
  bestCorrectedLate: 0.0533095, bestCertifiedLateR5Cone: 0.0748,

  routes: Object.freeze({
    P: Object.freeze({
      certifiedNow: '146660920737233/1000000000000000', target: '145/1000', spendUSD: 0,
      needs: 'WOL-C (0.0223) on the 369 P47 floors, or certified margins <= ~0.050 on late cells (> 300) with early cells at WOL-C (S5), <= ~0.0436 uniformly (S4)',
      reachableWithImplementedEngines: false,
      why: 'best corrected late margin 0.0533 gives 0.145017 even with every early floor at WOL-C (S1); the r5 cone engine loses >= 0.075',
      truthMeasured: 'sup Phi - K0* <= -0.00156 on all 369 floors: the obstruction is majorant looseness, not Phi_E',
      cpuHoursFiberEngine: [300, 460], levers: 'beta-label terms kept inside the labels (~0.0075 late, HEURISTIC), regional extra part (~0.0115), tighter tail cones; then independent referee',
    }),
    H: Object.freeze({
      value: '144951726247781/1000000000000000', height: 4.8e12, ptHeight: 3e12, rateHeightPerCoreSecond: 88.0, coreHours: 5.681e6,
      usdPerCoreHour: [0.02, 0.05], kappaHwMax: 2.5, usd: [113620, 284050], usdKhwMax: 710125, wallDays1e4Cores: 23.7,
      extraInputs: Object.freeze(['RH verified on (3e12, 4.80e12] (paid compute)', 'G0-d′ (AF §§4–9 X-transfer) at 1.6X: open, no compute']),
    }),
    recommendation: 'Route P first: 0 purchase; WOL-C is measured true with >= 0.00156 headroom on every P47 floor; needed: a late-cell '
      + 'majorant about 6% tighter than the corrected fiber engine (0.0533 -> <= 0.050) on ~300 late floors, ~300-460 CPU-h locally, then an '
      + 'independent referee. Route H (0.144951726247781, 4.83e-5 below 0.145) is the paid fallback: RH to 4.8e12 = 5.68e6 core-hours, '
      + '$0.11M-0.28M (up to ~$0.71M at kappa_hw 2.5), ~24 days at 10^4 cores, plus G0-d′ at 1.6X. Spending is a user decision.',
  }),

  tasks: Object.freeze({
    falsify: { referee: 'confirmed (MEASURED), minor', module: 'r6-falsify-2026-10-06.js', contributes: false, why: 'no violation; nothing to certify' },
    fiber: { referee: 'REFUTED (fatal)', module: 'r6-fiber-2026-10-06.js', contributes: false, why: 'engine not a majorant (tails_defect); variant value only' },
    suffix: { referee: 'not refuted, minor', module: 'r6-suffix-2026-10-06.js', contributes: true, why: 'r6 admission: rounding slacks at source; P-cert 0.146660920737233' },
  }),
  replay: Object.freeze({ ok: true, runs: [39, 39], assembly: [13, 13], seconds: 286.1, manifest: 'ca7705b64d0862ffc2afc386200a99e70a35db7266028be75427d37bd42ad399',
    newRuns: ['R32', 'R33', 'R34', 'R35', 'R36', 'R37', 'R38', 'R39'], newChecks: ['A10', 'A11', 'A12'] }),

  ledger: Object.freeze([
    I('WOL-C', 'weak outer lemma in consumed form, margin 0.0223 (absorbs the 0.0023 time-box allowance)', 'open',
      '369 uncertified P47 floors on the hybrid path (cells 234–579); r6 search: no violation, sup Φ − K0* ≤ −0.00156 (MEASURED); best certified P47 margins ≥ 0.0748 (cone); fiber certificates refuted', ['P-cond']),
    I('P47-search', 'targeted WOL-C falsification search on the 369 P47 floors (r6-falsify)', 'measured', 'float64, two implementations, one internal referee; evidence only', []),
    I('fiber-P47', 'factorized-fiber WOL-C engine (Fiber Lemma, Lemma Q, majorant tails, box theorem)', 'open',
      'lemmas proved and re-derived internally; certificates REFUTED (tails_defect); referee patch unrefereed; not used by any value', []),
    I('r2-floors-cert', '337 r2 floors on the certified path (single-entry certificates, Lemma 1 at the certified margin)', 'certified',
      'r6 admission: 164 pd + 23 l1l5ref + 64 p47farref + 1 p47far re-run with the fixed engines; 68 wpd2 (second implementation); 13 p2943ref; 4 S={2,3,5}; no r3core4.c floor with eta primes', ['P-cert', 'P-cond']),
    I('blocksuffix-gap', 'r4 wol-pd rounding slacks: block suffix F1, M_lab F2, bracket F3, Σκ F4, A1', 'certified',
      'fixed at source in the r6 engines (no 2e-7 gap rule); F1–F4/A1 re-derived and tested exactly by one internal referee; 1e-9 pad kept in the rigour budget', ['P-cert', 'P-cond']),
    I('wolpd-lemmas', 'wol-pd L1–L5 and Theorem 6.1', 'proved+refereed(internal)',
      'formalization/paper/wol-pd-lemmas.md (Known limits updated for r6), one internal pass; engine bounds (H1)–(H5) certified only', ['P-cert', 'P-cond']),
    I('r5-lemmas', 'r5 majorant lemmas used on the path (Lemma ABS, band-local norms, inverse tail; cone/Q/K lemmas)', 'proved+refereed(internal)',
      'one internal adversarial pass each; single implementations', ['P-cert', 'P-cond']),
    I('r3core4-NL2', 'r3core4.c leaf bounds with eta primes (F1 fixed; F3 stale pair table)', 'open',
      'not used by P-cert/P-cond; variant cr8 0.146659467964229 (referee code unrefereed)', []),
    I('r2-floors-base', 'r2 floor ingredients pert, Dslope, v0 (slope-fixed); r2 construction Φ_E ≥ J; r3 Lemma 1', 'certified', 'arb 128 bit, r2 referee; Lemma 1 written + r3 referee; r6 exact Lemma-1 check 333/333 (R39)', ['P-cert', 'P-cond']),
    I('timebox', '0.0023 time-box allowance', 'open', 'absorbed by WOL-C for the uncertified floors (certificates cover the whole cell)', ['P-cond']),
    I('G0-a', 'c_n(t) ≥ 0 nondecreasing, every n (Lemma CG)', 'proved+refereed(internal)', 'computer algebra + arb + FLINT C checks', ALL),
    I('lemmaR', 'Track A Lemma R (domain x ≥ X − 2 + a)', 'proved+refereed(internal)', 'three internal passes', ALL),
    I('G0-c', 'Raymond Lemmas 2–4 / Theorem 4′ (written out in full)', 'open', 'internal re-derivation found no defect; non-project reader missing', ALL),
    I('G0-d', 'one-point input (OP) = AF Part I §§6–9', 'proved+refereed(internal)', 'r4: re-derived, one adversarial internal pass', ALL),
    I('G0-dprime', 'X-transfer of AF §§4–9 to 2.6X (U2 stack) = Theorem XT', 'proved+refereed(internal)', 'r4: one internal pass; open at 1.6X/1.65X/1.7X (Route H only)', ALL),
    I('AF-4-5', 'AF Part I §§4–5 probe constants', 'proved+refereed(internal)', 'graded SOUND by the b145 internal referee', ALL),
    I('AF-gaps', 'AF §3 GAPs 3a/3b (wall budget), AF §§10–12 GAP-1..4 (expository)', 'open', 'graded SOUND internally, not written', ALL),
    I('twoHeight', 'two-height coupling + 10 MH kernel certificates', 'proved+refereed(internal)', 'b145 only', ['b145']),
    I('consumer', 'multi-height consumer (exact rational)', 'proved+refereed(internal)', 'SOUND on two passes; outputs reproduced by independent code', ALL),
    I('lemmaB-written', 'Lemma B.1–B.3 and Theorem B', 'written, unrefereed', 'B.1–B.3 not re-refereed as written', ALL),
    I('BB', 'BB1/BB2 = Theorem BB + Lemma C + Lemma H2', 'proved+refereed(internal)', 'one adversarial internal pass', ALL),
    I('E1-E8', 'band-run checks', 'certified', 'r6 certified run 75,091 steps and hybrid run 74,137 steps, 0 failures, E6-altlog pass; replayed by the packet (R35, R37)', ALL),
    I('K', 'near-field kernel certificates (13 catalogue + 10 two-height)', 'certified', 'independent Bernstein re-implementation 23/23 PASS (packet R21)', ALL),
    I('H2', 'far-field inequality for 24 kernels, |d| ≥ 7252, b ≤ 1', 'proved+refereed(internal)', 'analytic Lemma H2 + exact rational check (packet R22)', ALL),
    I('W', 'walls at x_f, x_L, x_R (AF §3 Abel transfer)', 'certified', 'both lanes; independent C/Arb re-verification', ALL),
    I('RH-win', '7.8e12 window: 16,071 zeros on the line', 'certified', 'Route 2; FLINT zeta_rs unaudited', ALL),
    I('RH-head', 'RH to the head wall at PT height', 'published', 'Platt–Trudgian 2021; exposure to the Gram-block Turing gap not determined', ALL),
    I('MTY', 'zero-free region for the band-1 start', 'published', 'Mossinghoff–Trudgian–Yang', ALL),
    I('P15', 'Polymath15 Prop 3.1, Thm 1.5(i); de Bruijn', 'published', 'statements checked against the local tex', ALL),
    I('archives', 'consumer-layer replay inputs', 'certified',
      'formalization/review-packet-sub0145 includes the r6 re-certificates, the r6 admission and runs R32–R39 (rebuild, consumer, E1–E8, exact Lemma-1 check); untracked in git pending approval', ALL),
    I('producer-layer', 'producer runs (r2 campaign, WOL-C engine runs incl. the r6 fixed engines, RH-window RS/Turing)', 'open',
      'hashed only, not re-executed by the packet; wheels/ and upstream/ local only', ALL),
  ]),

  remaining: Object.freeze({
    candidate: Object.freeze([
      'G0-c: a non-project reader of Theorem 4′ / Lemmas 2–4',
      'AF-gaps: write GAP 3a/3b and GAP-1..4',
      'lemmaB-written: adversarial referee of B.1–B.3 and Theorem B as written',
      'producer-layer: commit the packet (with approval); second implementation of the wol-pd/r6 engines beyond the 75 wpd2 floors; audit rig_tails and the grid-maximisation allowances',
      'r3core4-NL2: fix F3, re-certify, referee (variant cr8 only)',
      'RH-win trust base: audit or re-implement FLINT zeta_rs; RH-head: confirm the PT21 Turing step form',
    ]),
    sub0145: Object.freeze([
      'WOL-C for the 369 P47 floors (cells 234–579), or certified late-cell margins <= ~0.050: fix the fiber engine (tails_defect patch, refereed), keep the β-label terms inside the labels, tighten the regional extra part and tail cones, run ~300–460 CPU-h, then an independent referee (fiber-P47, P47-search measured as the target)',
      'Route H alternative: RH to 4.80e12 (5.68e6 core-hours, paid) + G0-d′ at 1.6X',
    ]),
    beyondCandidate: Object.freeze(['G0-e: external referee of the chain, Lemma B / Theorem BB and the WOL-C certificate engines']),
  }),

  verdict:
    'WOL-C at P47 (cells 234-579, 369 floors): no violation exists in the searched space (MEASURED: max excess over Phi(0) 1.98e-6, '
    + 'sup_found Phi - K0* <= -0.00156 everywhere), so route P is not ruled out; WOL-C is NOT PROVED. The r6 fiber certificates are REFUTED '
    + '(engine defect) and not merged. Certified route-P value at PT height: Lambda <= 146660920737233/10^15 = 0.146660920737233 (r6 admission '
    + 'with rounding slacks fixed at source, 337 floors, E1-E8 0 failures, replay 39/39 + 13/13), conditional on the shared inputs and on '
    + 'single-implementation engines with internal referee passes only. Lambda < 0.145 is NOT certified: 0.144797588795775 needs WOL-C for '
    + '369 P47 floors; with the implemented engines route P stops at about 0.14502 (measured). Route H gives 0.144951726247781 for '
    + '5.68e6 paid core-hours plus G0-d′ at 1.6X. Nothing is proved unconditionally below 0.2. No refereed bound is changed. RH open. NO QED.',
});

const R = R6_SYNTHESIS;
const v = (k) => R.values[k].exact;
const sum = (o) => Object.values(o).reduce((s, x) => s + x, 0);

export const R6_SYNTHESIS_ASSERTIONS = Object.freeze([
  {
    id: 'r6-syn-values-exact',
    holds: () => [...Object.values(R.values), ...R.scenarios].every((x) => { const n = exact15(x.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(x.dec)) < 1e-16; }),
    why: 'Every stated decimal is the exact value of its rational (all denominators divide 10^15).',
  },
  {
    id: 'r6-syn-ordering',
    holds: () => lt(v('U2'), v('P-cond')) && lt(v('P-cond'), v('PcondR5')) && lt(v('PcondR5'), v('routeH3')) && lt(v('routeH3'), '145/1000')
      && lt('145/1000', v('fiberClaim')) && lt(v('fiberClaim'), v('fiberCorrected')) && lt(v('fiberCorrected'), v('PcertCr8')) && lt(v('PcertCr8'), v('P-cert'))
      && lt(v('P-cert'), v('PcertR5')) && lt(v('PcertR5'), v('b145')) && lt(v('b145'), v('noR2')) && lt(v('noR2'), v('candidate01758354')),
    why: 'U2 < P-cond(r6) < P-cond(r5) < Route H < 0.145 < fiber claim (refuted) < fiber corrected (unrefereed) < cr8 < P-cert(r6) < P-cert(r5) < b145 < noR2 < 0.1758354.',
  },
  {
    id: 'r6-syn-gain-over-r5',
    holds: () => { const g = num(sub(v('PcertR5'), v('P-cert'))); const h = num(sub(v('b145'), v('P-cert')));
      return Math.abs(g - 1.082369e-9) < 1e-15 && h > 6.12e-4 && h < 6.13e-4; },
    why: 'r6 lowers the certified value by exactly 1.082369e-9 (slacks at source instead of the 2e-7 pad); 6.13e-4 below b145.',
  },
  {
    id: 'r6-syn-decision',
    holds: () => R.decision.branch === 'b' && R.decision.wolcViolationCertified === false && R.decision.maxWolcMetric < 0
      && R.decision.maxExcessOverPhi0 < 0.0223 && R.merge.notAdmitted.some((s) => /REFUTED/.test(s)) && R.merge.lemma1.ok === R.merge.lemma1.checked
      && sum(R.merge.winners) === R.merge.entries && R.tasks.fiber.contributes === false && R.tasks.suffix.contributes === true,
    why: 'No certified violation → branch (b); only the refereed suffix admission is merged; the refuted fiber certfile is excluded; Lemma-1 333/333.',
  },
  {
    id: 'r6-syn-route-p-threshold',
    holds: () => {
      const sc = Object.fromEntries(R.scenarios.map((s) => [s.tag, s]));
      const below = (t) => lt(sc[t].exact, '145/1000');
      return !below('S1') && !below('S2') && !below('S3') && !below('S7') && below('S4') && below('S5') && below('S6') && below('S8')
        && sc.S1.late === Math.round(R.bestCorrectedLate * 1e4) / 1e4 && R.bestCorrectedLate > sc.S5.late && R.bestCertifiedLateR5Cone > sc.S1.late
        && R.routes.P.reachableWithImplementedEngines === false && lt(v('P-cond'), '145/1000');
    },
    why: 'Late margins ≤ 0.050 (early at WOL-C) or uniform 0.0436 reach < 0.145; the best corrected late margin 0.0533 does not (0.145017): route P needs a tighter late-cell majorant.',
  },
  {
    id: 'r6-syn-route-h-cost',
    holds: () => {
      const H = R.routes.H; const ch = (H.height - H.ptHeight) / H.rateHeightPerCoreSecond / 3600;
      return Math.abs(ch - H.coreHours) / H.coreHours < 1e-3 && Math.abs(H.usd[0] - H.coreHours * H.usdPerCoreHour[0]) < 1
        && Math.abs(H.usd[1] - H.coreHours * H.usdPerCoreHour[1]) < 1 && Math.abs(H.usdKhwMax - H.usd[1] * H.kappaHwMax) < 1
        && Math.abs(H.wallDays1e4Cores - H.coreHours / 1e4 / 24) < 0.1 && Math.abs(H.height / H.ptHeight - 1.6) < 1e-12 && lt(H.value, '145/1000')
        && Math.abs(num(sub('145/1000', H.value)) - 4.8273752219e-5) < 1e-15;
    },
    why: 'Route H: (4.8e12 − 3e12)/88 per core-second = 5.68e6 core-hours, $0.11M–0.28M (×2.5 hardware ≈ $0.71M), ~24 days at 10^4 cores; 4.83e-5 below 0.145.',
  },
  {
    id: 'r6-syn-band-runs',
    holds: () => ['P-cert', 'P-cond', 'PcertCr8'].every((k) => { const b = R.bandRuns[k]; return b.fails === 0 && b.hMin >= R.bandRuns.h2Range[0] && b.hMax <= R.bandRuns.h2Range[1] && b.windowMargin > 0 && b.startMargin > 1.99e-6; }),
    why: 'All three r6 runs pass E1–E8 with heights inside the Lemma H2 range.',
  },
  {
    id: 'r6-syn-path',
    holds: () => { const cp = R.certPath, hp = R.hybridPath;
      return sum(cp.byPrefix) === cp.floors && cp.wolc + cp.finiteMarginOnly === cp.floors && cp.sameAsR5 && cp.wolcMarginRange[1] <= 0.0223 / (1 + 1e-12)
        && cp.finiteMarginRange[0] > 0.0223 && hp.certified + sum(hp.uncertified) === hp.floors && Object.keys(hp.uncertified).join() === 'P47'; },
    why: 'Certified path 337 = 272 WOL-C + 65 finite-margin (same as r5); hybrid 635 = 266 + 369 uncertified, all P47.',
  },
  {
    id: 'r6-syn-replay',
    holds: () => R.replay.ok === true && R.replay.runs[0] === R.replay.runs[1] && R.replay.runs[1] === 39 && R.replay.assembly[0] === R.replay.assembly[1] && R.replay.assembly[1] === 13 && R.replay.newRuns.length === 8,
    why: './replay.sh end to end: 39/39 runs (incl. R32–R39) and 13/13 assembly checks (incl. A10–A12).',
  },
  {
    id: 'r6-syn-ledger-grades',
    holds: () => {
      const grades = ['proved+refereed(internal)', 'certified', 'published', 'written, unrefereed', 'open', 'measured'];
      const c = (g) => R.ledger.filter((x) => x.grade === g).length;
      return R.ledger.every((x) => grades.includes(x.grade)) && new Set(R.ledger.map((x) => x.id)).size === R.ledger.length && R.ledger.length === 31
        && c('proved+refereed(internal)') === 11 && c('certified') === 8 && c('published') === 3 && c('written, unrefereed') === 1 && c('open') === 7 && c('measured') === 1
        && ['r3core4-NL2', 'fiber-P47', 'P47-search'].every((id) => R.ledger.find((x) => x.id === id).usedBy.length === 0);
    },
    why: 'Ledger of 31 inputs: 11 proved + internally refereed, 8 certified, 3 published, 1 written unrefereed, 7 open, 1 measured; refuted/measured items feed no value.',
  },
  {
    id: 'r6-syn-which-value-needs-what',
    holds: () => {
      const needs = (k) => R.ledger.filter((x) => x.usedBy.includes(k));
      const openFor = (k) => needs(k).filter((x) => x.grade === 'open').map((x) => x.id);
      return openFor('P-cond').includes('WOL-C') && !openFor('P-cert').includes('WOL-C') && openFor('P-cond').length === openFor('P-cert').length + 2
        && openFor('P-cert').length === openFor('b145').length && ['G0-c', 'AF-gaps', 'producer-layer'].every((id) => openFor('P-cert').includes(id));
    },
    why: 'WOL-C (with the time box) separates the sub-0.145 value from P-cert; P-cert and b145 share the same open inputs.',
  },
  {
    id: 'r6-syn-remaining-covers-open',
    holds: () => {
      const txt = [...R.remaining.candidate, ...R.remaining.sub0145, ...R.remaining.beyondCandidate].join(' | ');
      return R.ledger.filter((x) => (x.grade === 'open' && !['timebox', 'WOL-C'].includes(x.id)) || x.grade === 'written, unrefereed').every((x) => txt.includes(x.id))
        && /WOL-C/.test(txt) && /P47/.test(txt) && /Route H/.test(txt);
    },
    why: 'Every open or unrefereed input, the P47 WOL-C gap and the Route H alternative appear in the remaining steps.',
  },
  {
    id: 'r6-syn-honest-scope',
    holds: () => /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict) && /NOT certified/.test(R.verdict) && /NOT PROVED/.test(R.verdict)
      && /Nothing is proved unconditionally below 0\.2/.test(R.verdict) && /NO QED/.test(R.status) && /REFUTED/.test(R.verdict) && /user decision/.test(R.routes.recommendation),
    why: 'No bound below 0.2 is proved; Λ < 0.145 not certified; fiber refuted; spending left to the user; RH open.',
  },
]);

export default R6_SYNTHESIS;
