/**
 * @fileoverview r5-synthesis-2026-10-05 — synthesis of the r5 round (p47-mixed, p47-far, p29-43, core-audit, l1l5; each with one adversarial
 * internal referee pass): referee corrections applied, refereed WOL-C certified margins merged per entry across r4 + r5, the route-P value
 * recomputed with the exact consumer, band checks E1–E8, the replay packet extended to reproduce the new value, the ledger and what remains.
 *
 * Referee corrections applied (tmp/r5-synth-merge.py → tmp/r5-synth-out/cert_final.json, sha256 below):
 *  C1 core-audit REFUTED (fatal): r3core4.c leaf bounds with eta primes are not certified (F1 beta product, F3 stale pair table). Dropped:
 *     every r4 'ad' (wol-adapt) and 'adref' entry, the 4 NL = 2 'r3' entries, the audit's 50 re-certificates. Kept: the 5 S = {2,3,5}
 *     entries (NH = 0; 4 re-evaluated bit-exact over 9254 leaves by the referee). r4 P-cert 0.146808080767225 is NOT certified.
 *  C2 p29-43 referee: the r4 wol-pd norms_tails takes block suffix sums as differences of global cumsums with a relative factor only.
 *     Sources reusing it (r4 pd, r5 p47-far cone, r5 p47-mixed, referee re-grids of those engines) are admitted at shift − 2e-7, and only
 *     where the gap dU_max of that entry was measured (tmp/r5-synth-gapcheck.py: same engine, same t-pieces, original vs patched slack
 *     1.01·N·u·S_0, the referee's method) with dU_max ≤ 1.5e-7. 282 entries measured (253 new in this synthesis), max 1.029e-7 (P7 26);
 *     every one of the 252 such entries on the certified path is measured (max 7.17e-8); 145 unmeasured off-path entries are dropped.
 *  C3 referee re-certificates at other grids with the refereed engines (p29-43, p47-far, p47-mixed, l1l5) are sources like r4 'adref'.
 *  Grading/wording corrections of each task are carried in the r5-<key> modules (MEASURED vs proved, thresholds, superseded values).
 *  Not admitted: the 8 referee F1+F3 r3core4.c re-certificates (referee code, unrefereed) → variant P-cert(cr8) only.
 *
 * Exact consumer runs (tmp/r3-outer-mixed.py unchanged; tmp/r5-synth-out/, script tmp/r5-synth-final.sh):
 *   certified floors only                         → 73330460909801/(5·10^14) = 0.146660921819602 (337 r2 floors on the path)
 *   + 8 referee r3core4.c re-certificates (cr8)   → 73329734513657/(5·10^14) = 0.146659469027314
 *   hybrid: certified + WOL-C ASSUMED (0.0223)    → 18099698688547/(1.25·10^14) = 0.144797589508376 (369 uncertified, all P47)
 * E1–E8 (tmp/r4-wolpd-bb.py → tmp/r3-bb-replay.py, s145venv) reproduce all three with 0 failures; E6-altlog passes on cert and hybrid.
 * Replay packet formalization/review-packet-sub0145: new runs R26–R31 + assembly A7–A9; ./replay.sh result recorded in `replay`.
 *
 * PROVED: nothing unconditional below 0.2. CERTIFIED: the consumer values above, conditional on the ledger. CONDITIONAL: every Λ below 0.2.
 * Import-free. ASSERTIONS recompute the merge rule on sample entries (Lemma-1 shift, gap pad), exact decimals, the value ordering, the path
 * bookkeeping, the gap coverage, ledger grades and which inputs each value needs.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const sub = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return [a * d - c * b, b * d]; };
const eqFrac = ([a, b], s) => { const [c, d] = big(s); return a * d === c * b; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const shift = (m) => `${Math.floor((0.0023 - m * (1 + 1e-12)) * 1e13) - 1}/10000000000000`;

const I = (id, what, grade, note, usedBy) => Object.freeze({ id, what, grade, note, usedBy: Object.freeze(usedBy) });
const ALL = ['P-cert', 'P-cond', 'b145'];

export const R5_SYNTHESIS = Object.freeze({
  id: 'r5-synthesis-2026-10-05',
  date: '2026-10-05',
  title: 'r5 synthesis: certified-margin route P 0.1466609 without any r3core4.c eta-prime floor; sub-0.145 still needs WOL-C for 369 P47 floors',
  status: 'SYNTHESIS of five internally refereed tasks (core-audit refuted, fatal). Every Λ value below 0.2 remains conditional. NO QED.',

  values: Object.freeze({
    'P-cert': { exact: '73330460909801/500000000000000', dec: '0.146660921819602', label: 'route P, refereed certified floors only (337 on the path), referee corrections C1–C3' },
    'P-cond': { exact: '18099698688547/125000000000000', dec: '0.144797589508376', label: 'route P, certified + WOL-C at 0.0223 ASSUMED for 369 uncertified P47 path floors' },
    b145: { exact: '18409208597849/125000000000000', dec: '0.147273668782792', label: 'b145 PT band + grid + two-height kernels, no r2 floors' },
    PcertCr8: { exact: '73329734513657/500000000000000', dec: '0.146659469027314', label: 'variant: + 8 referee F1+F3 r3core4.c re-certificates (referee code unrefereed)' },
    r4PcertNotCertified: { exact: '5872323230689/40000000000000', dec: '0.146808080767225', label: 'r4 P-cert: NOT certified (147 r3core4.c floors, F1 + F3)' },
    auditClaim: { exact: '29363368800049/200000000000000', dec: '0.146816844000245', label: 'core-audit claim: NOT certified (F3)' },
    coreRefB: { exact: '29365248320989/200000000000000', dec: '0.146826241604945', label: 'core-audit referee: r4 wol-pd + S235 + 8 referee re-certificates (r4 sources only)' },
    noNL2r4: { exact: '73413796652503/500000000000000', dec: '0.146827593305006', label: 'r4 wol-pd + S235 only (r4 sources, no r5)' },
    PcertR3: { exact: '73770784989943/500000000000000', dec: '0.147541569979886', label: 'r3 certified-only route P (superseded)' },
    U2: { exact: '36063660805739/250000000000000', dec: '0.144254643222956', label: 'band 2 at 2.6X' },
    noR2: { exact: '29511133454807/200000000000000', dec: '0.147555667274035', label: 'route-P consumer, no r2 floors' },
    candidate01758354: { exact: '1758354/10000000', dec: '0.1758354', label: 'existing project candidate (y-transfer)' },
  }),

  merge: Object.freeze({
    entries: 346, consumerKeys: 345, sha256: 'ed0c495666833ce0a030cf9cfc50e52c316120fef45b8e1548b18c50b1a13572', hybridSha256: 'fe6ea114715764ae561fae8fdcaab3ccbe5f68e4a04cfbaab09c68cd41d3b93a',
    sources: { pd: 263, wpd2: 79, s235: 5, p2943: 13, p2943ref: 13, p47mix: 7, p47mixref: 7, p47far: 198, p47farref: 80, l1l5ref: 24 },
    winners: { pd: 171, wpd2: 68, l1l5ref: 24, p2943ref: 13, p47farref: 64, p47far: 1, s235: 5 },
    dropped: { r3core4NH1: 'all r4 ad/adref/NL=2 r3 entries', unmeasuredGapSource: 145 },
    gap: { pad: '1/5000000', acceptMax: 1.5e-7, measured: 282, newlyMeasured: 253, maxAll: 1.029e-7, onPath: 252, onPathMeasured: 252, maxOnPath: 7.17e-8, peakRssBytes: 3978231808 },
    samples: Object.freeze([
      { key: '0|1|r_49_100 (P7)', source: 'wpd2', margin: 0.0025498587678326468, pad1e9: true, merged: '-31232471/125000000000' },
      { key: '121|1|sharp (P13)', source: 'pd', pdShift: '-122220613211/10000000000000', gapMeasured: 4.900782002784099e-8, merged: '-122222613211/10000000000000' },
      { key: '228|0.94|r_19_40 (P43)', source: 'p2943ref', margin: 0.019965467108249868, pad1e9: true, claimant: '-35853445541/2000000000000', merged: '-44163670271/2500000000000' },
      { key: '232|0.94|r_19_40 (P47)', source: 'p2943ref', margin: 0.021294848512295683, pad1e9: true, claimant: '-96008766603/5000000000000', merged: '-1519587961/80000000000' },
      { key: '99|1|sharp (S235)', source: 's235', merged: '-155638670591/10000000000000' },
    ]),
  }),

  certPath: Object.freeze({
    floors: 337, wolc: 272, finiteMarginOnly: 65,
    byPrefix: { P7: 15, P11: 76, P13: 68, P17: 22, P19: 34, P23: 37, P29: 8, P31: 5, P43: 1, P47: 67, S235: 4 },
    bySource: { pd: 164, wpd2: 68, l1l5ref: 23, p2943ref: 13, p47farref: 64, p47far: 1, s235: 4 },
    wolcMarginRange: [0.0020772, 0.0216687], finiteMarginRange: [0.0747896, 0.2727521],
  }),
  // original r3 band path (tmp/r3-outer-out/used_w002.json, 630 entries): [WOL-C certified, total]; P47 also 65 at finite margin > 0.0223
  bandPath: Object.freeze({ P7: [15, 15], P11: [70, 70], P13: [74, 74], P17: [22, 22], P19: [34, 34], P23: [39, 39], P29: [8, 8], P31: [5, 5], P47: [1, 363], p47FiniteMargin: 65 }),
  hybridPath: Object.freeze({ floors: 635, certified: 266, uncertified: { P47: 369 }, uncertifiedCells: [234, 579] }),
  bandRuns: Object.freeze({
    'P-cert': { steps: 75091, fails: 0, hMin: 0.6688, hMax: 2.18, windowMargin: 0.002055207209642648, maxCDelta: 4.367792912495384e-5, startMargin: 2.000000000517967e-6, altlog: 'pass' },
    'P-cond': { steps: 74137, fails: 0, hMin: 0.6336, hMax: 2.18, windowMargin: 0.002055207209642648, maxCDelta: 4.5894676898419604e-5, startMargin: 2.000000000517967e-6, altlog: 'pass' },
    PcertCr8: { steps: 75090, fails: 0, hMin: 0.6688, hMax: 2.18, windowMargin: 0.0020537048355006057, maxCDelta: 4.367792912495384e-5, startMargin: 2.000000000517967e-6 },
    h2Range: [0.5, 2.5],
  }),

  tasks: Object.freeze({
    'p47-mixed': { referee: 'not refuted, minor', module: 'r5-p47-mixed-2026-10-05.js', contributes: false, why: '7 P29/P31 certificates superseded by p29-43; P47 0/372' },
    'p47-far': { referee: 'not refuted, minor', module: 'r5-p47-far-2026-10-05.js', contributes: true, why: '65 P47 path floors at finite margin (0.0748–0.2728) via claimant + referee re-certificates' },
    'p29-43': { referee: 'certificates confirmed; consumer grading refuted (pd rounding gap)', module: 'r5-p29-43-2026-10-05.js', contributes: true, why: 'all P29/P31/P43 + P47 231/232 at WOL-C (referee re-grid margins)' },
    'core-audit': { referee: 'REFUTED (fatal): F3', module: 'r5-core-audit-2026-10-05.js', contributes: true, why: 'second wol-pd implementation (68 path floors); removes all r3core4.c NH ≥ 1 floors' },
    l1l5: { referee: 'not refuted, minor ((H2) fix)', module: 'r5-l1l5-2026-10-05.js', contributes: true, why: 'written L1–L5 + Theorem 6.1; 24 referee re-grid certificates (23 on the path)' },
  }),
  r3core4Audit: 'REFUTED (fatal): F1 real and fixed, F3 missed; no r3core4.c floor with eta primes is certified; 4–5 S={2,3,5} floors stand.',
  replay: Object.freeze({ ok: true, runs: [31, 31], assembly: [10, 10], seconds: 246.0, manifest: '5703ce266541a3e761489a621a7085c81b4c7285a3f75b2796bcdbb21d9e67a0', newRuns: ['R26', 'R27', 'R28', 'R29', 'R30', 'R31'], newChecks: ['A7', 'A8', 'A9'] }),

  ledger: Object.freeze([
    I('WOL-C', 'weak outer lemma in consumed form, margin 0.0223 (absorbs the 0.0023 time-box allowance)', 'open',
      '268 of 630 r3 band-path entries WOL-C-certified (all P7–P31, P47 1); 369 uncertified floors on the r5 hybrid path, all P47 (cells 234–579); best P47 margins 0.0213–0.0217 at cells 231, 232 (WOL-C) and ≥ 0.0748 elsewhere (cone, finite margin)', ['P-cond']),
    I('r2-floors-cert', '337 r2 floors on the certified path (single-entry certificates, Lemma 1 at the certified margin)', 'certified',
      'wol-pd family: 164 r4 pd (single implementation, gap measured), 68 second implementation wpd2, 23 l1l5 referee re-grids; 13 r5 p29-43 (R2 slacks, referee re-grid); 65 P47 cone (gap measured); 4 S={2,3,5} r3core4.c (NH = 0). No r3core4.c floor with eta primes', ['P-cert', 'P-cond']),
    I('blocksuffix-gap', 'r4 wol-pd block-suffix rounding gap (p29-43 referee) on gap-source path floors', 'certified',
      'per-entry measurement with the patched absolute slack (referee method), max 7.17e-8 on the path < pad 2e-7; off-path unmeasured entries dropped', ['P-cert', 'P-cond']),
    I('wolpd-lemmas', 'wol-pd L1–L5 and Theorem 6.1', 'proved+refereed(internal)',
      'written: formalization/paper/wol-pd-lemmas.md (r5 l1l5), one internal pass, (H2) corrected to two-sided κ enclosures; engine bounds (H1)–(H5) certified only', ['P-cert', 'P-cond']),
    I('r5-lemmas', 'r5 majorant lemmas used on the path: Lemma ABS, band-local norms, a-posteriori inverse tail (p29-43); cone/Q/K lemmas (p47-far)', 'proved+refereed(internal)',
      'one internal adversarial pass each, re-derived by the referees; single implementations; Lemma MS (p47-mixed) proved but not used on the path', ['P-cert', 'P-cond']),
    I('r3core4-NL2', 'r3core4.c leaf bounds with eta primes (F1 fixed; F3 stale pair table)', 'open',
      'not used by P-cert/P-cond; 8 referee F1+F3 re-certificates exist (variant P-cert(cr8) 0.146659469027314), referee code unrefereed', []),
    I('r2-floors-base', 'r2 floor ingredients pert, Dslope, v0 (slope-fixed); r2 construction Φ_E ≥ J; r3 Lemma 1', 'certified', 'arb 128 bit, r2 referee; Lemma 1 written + r3 referee', ['P-cert', 'P-cond']),
    I('timebox', '0.0023 time-box allowance', 'open', 'measured at 4 cells; absorbed by WOL-C for the uncertified floors (the certificates cover the whole cell)', ['P-cond']),
    I('G0-a', 'c_n(t) ≥ 0 nondecreasing, every n (Lemma CG)', 'proved+refereed(internal)', 'computer algebra + arb + FLINT C checks; re-confirmed by G0-d', ALL),
    I('lemmaR', 'Track A Lemma R (domain x ≥ X − 2 + a)', 'proved+refereed(internal)', 'three internal passes', ALL),
    I('G0-c', 'Raymond Lemmas 2–4 / Theorem 4′ (written out in full)', 'open', 'internal adversarial re-derivation found no defect; non-project reader missing', ALL),
    I('G0-d', 'one-point input (OP) = AF Part I §§6–9', 'proved+refereed(internal)', 'r4: re-derived, one adversarial internal pass; non-project reader missing', ALL),
    I('G0-dprime', 'X-transfer of AF §§4–9 to 2.6X (U2 stack) = Theorem XT', 'proved+refereed(internal)', 'r4: one internal pass; open at 1.6X/1.65X/1.7X (Route H only)', ALL),
    I('AF-4-5', 'AF Part I §§4–5 probe constants', 'proved+refereed(internal)', 'graded SOUND by the b145 internal referee', ALL),
    I('AF-gaps', 'AF §3 GAPs 3a/3b (wall budget), AF §§10–12 GAP-1..4 (expository)', 'open', 'graded SOUND internally, not written', ALL),
    I('twoHeight', 'two-height coupling + 10 MH kernel certificates', 'proved+refereed(internal)', 'b145 only', ['b145']),
    I('consumer', 'multi-height consumer (exact rational)', 'proved+refereed(internal)', 'SOUND on two passes; outputs reproduced by independent code', ALL),
    I('lemmaB-written', 'Lemma B.1–B.3 and Theorem B', 'written, unrefereed', 'B.1–B.3 not re-refereed as written', ALL),
    I('BB', 'BB1/BB2 = Theorem BB + Lemma C + Lemma H2', 'proved+refereed(internal)', 'one adversarial internal pass', ALL),
    I('E1-E8', 'band-run checks', 'certified', 'r5 certified run 75,091 steps and hybrid run 74,137 steps, 0 failures, E6-altlog pass; replayed by the packet (R28, R30)', ALL),
    I('K', 'near-field kernel certificates (13 catalogue + 10 two-height)', 'certified', 'independent Bernstein re-implementation 23/23 PASS (packet R21)', ALL),
    I('H2', 'far-field inequality for 24 kernels, |d| ≥ 7252, b ≤ 1', 'proved+refereed(internal)', 'analytic Lemma H2 + exact rational check (packet R22)', ALL),
    I('W', 'walls at x_f, x_L, x_R (AF §3 Abel transfer)', 'certified', 'both lanes; independent C/Arb re-verification', ALL),
    I('RH-win', '7.8e12 window: 16,071 zeros on the line', 'certified', 'Route 2; FLINT zeta_rs unaudited', ALL),
    I('RH-head', 'RH to the head wall at PT height', 'published', 'Platt–Trudgian 2021; exposure to the Gram-block Turing gap not determined', ALL),
    I('MTY', 'zero-free region for the band-1 start', 'published', 'Mossinghoff–Trudgian–Yang', ALL),
    I('P15', 'Polymath15 Prop 3.1, Thm 1.5(i); de Bruijn', 'published', 'statements checked against the local tex', ALL),
    I('archives', 'consumer-layer replay inputs', 'certified',
      'formalization/review-packet-sub0145 now includes the r4 + r5 certificate and admission files, the gap measurements and runs R26–R31 that rebuild the r5 admission and reproduce P-cert/P-cond; untracked in git pending approval', ALL),
    I('producer-layer', 'producer runs (r2 campaign, WOL-C engine runs incl. r5 engines and gap measurements, RH-window RS/Turing)', 'open',
      'hashed only, not re-executed by the packet; wheels/ and upstream/ local only', ALL),
  ]),

  remaining: Object.freeze({
    candidate: Object.freeze([
      'G0-c: a non-project reader of Theorem 4′ / Lemmas 2–4',
      'AF-gaps: write GAP 3a/3b and GAP-1..4; fold the G0-d fixes g1–g8 into the chain write-up',
      'lemmaB-written: adversarial referee of B.1–B.3 and Theorem B as written',
      'producer-layer: commit the packet (with approval); re-execute or independently re-implement the wol-pd and r5 certificate engines (only 75 floors have a second implementation)',
      'r5-lemmas / wolpd-lemmas: non-author referee of wol-pd-lemmas.md and of Lemmas ABS, C, Q, K, band-local norms, inverse tail; fix the r4 norms_tails suffix sums in the code (instead of per-entry gap measurement)',
      'r3core4-NL2: fix F3 in the drivers (initialise pairs before reading), re-certify the NL = 2 floors with F1 + F3 fixed and referee that code (variant cr8 gains only 1.45e-6)',
      'RH-win trust base: audit or re-implement FLINT zeta_rs; RH-head: confirm the PT21 Turing step form',
    ]),
    sub0145: Object.freeze([
      'WOL-C for the 369 uncertified hybrid-path P47 floors (cells 234–579): no implemented angle reaches 0.0223 past cell 232. Needed: a label representation with factorized/longer fibers and regional label norms (p47-mixed), a θ = 0 point bound plus cone variation for the early cells and a label bound that keeps intra-label cancellation at late large-a cells (p47-far); every P47 margin must be ≲ 0.0436 for sub-0.145 via finite margins',
    ]),
    beyondCandidate: Object.freeze(['G0-e: external referee of the chain, Lemma B / Theorem BB and the WOL-C certificate engines', 'G0-d′ at 1.6X/1.65X/1.7X (Route H only)']),
  }),

  verdict:
    'Certified-margin route-P value at PT height: Λ ≤ 73330460909801/(5·10^14) = 0.146660921819602 (exact consumer, 337 refereed certified r2 '
    + 'floors, no r3core4.c floor with eta primes, block-suffix gap measured on every affected path floor, E1–E8 0 failures, replayed by the packet). '
    + 'It replaces the r4 value 0.146808080767225, which is NOT certified (r3core4.c F1 + F3), and lies 6.13e-4 below the b145 PT value '
    + '0.147273668782792. It is conditional on the shared inputs (G0-c, AF expository gaps, Lemma B.1–B.3 as written, RH-win trust base, RH-head, '
    + 'producer layer) and on single-implementation certificate engines with internal referee passes only. Λ < 0.145 is NOT certified (not even '
    + 'modulo G0-c / external review): Λ ≤ 0.144797589508376 needs WOL-C for 369 P47 floors, which is NOT PROVED. '
    + 'Nothing is proved unconditionally below 0.2. No refereed bound is changed. RH open. NO QED.',
});

const S = R5_SYNTHESIS;
const v = (k) => S.values[k].exact;
const sum = (o) => Object.values(o).reduce((s, x) => s + x, 0);

export const R5_SYNTHESIS_ASSERTIONS = Object.freeze([
  {
    id: 'r5-syn-values-exact',
    holds: () => Object.values(S.values).every((x) => { const n = exact15(x.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(x.dec)) < 1e-16; }),
    why: 'Every stated decimal is the exact value of its rational (all denominators divide 10^15).',
  },
  {
    id: 'r5-syn-ordering',
    holds: () => lt(v('U2'), v('P-cond')) && lt(v('P-cond'), '145/1000') && lt('145/1000', v('PcertCr8')) && lt(v('PcertCr8'), v('P-cert'))
      && lt(v('P-cert'), v('r4PcertNotCertified')) && lt(v('r4PcertNotCertified'), v('auditClaim')) && lt(v('auditClaim'), v('coreRefB'))
      && lt(v('coreRefB'), v('noNL2r4')) && lt(v('noNL2r4'), v('b145')) && lt(v('b145'), v('PcertR3')) && lt(v('PcertR3'), v('noR2'))
      && lt(v('noR2'), v('candidate01758354')),
    why: 'U2 < P-cond < 0.145 < P-cert(cr8) < P-cert < (not certified: r4 0.1468081, audit 0.1468168) < r4-source values < b145 < r3 < noR2 < 0.1758354.',
  },
  {
    id: 'r5-syn-gains',
    holds: () => { const [a, b] = sub(v('noNL2r4'), v('P-cert')); const g = Number(a) / Number(b); const [c, d] = sub(v('b145'), v('P-cert')); const h = Number(c) / Number(d);
      return g > 1.66e-4 && g < 1.67e-4 && h > 6.12e-4 && h < 6.13e-4; },
    why: 'Against the valid r4-source value (wol-pd + S235) the r5 sources lower route P by 1.667e-4; the value is 6.13e-4 below b145.',
  },
  {
    id: 'r5-syn-merge-rule-live',
    holds: () => S.merge.samples.every((s) => {
      if (s.source === 'wpd2' || s.source === 'p2943ref') return cmp(shift(s.margin + 1e-9), s.merged) === 0 && (!s.claimant || cmp(s.merged, s.claimant) > 0);
      if (s.source === 'pd') return eqFrac(sub(s.pdShift, S.merge.gap.pad), s.merged) && s.gapMeasured <= S.merge.gap.acceptMax;
      return typeof s.merged === 'string';
    }) && sum(S.merge.winners) === S.merge.entries && S.merge.gap.maxOnPath <= S.merge.gap.maxAll && S.merge.gap.maxAll <= S.merge.gap.acceptMax
      && S.merge.gap.acceptMax + 1e-9 < 2e-7 && S.merge.gap.onPath === S.merge.gap.onPathMeasured,
    why: 'Recomputed: referee margins → Lemma-1 shift with the 1e-9 pad, beating the claimant shift; pd shift lowered by exactly 2e-7 with a measured gap ≤ 1.5e-7; winners partition the 346 entries; every gap-source path floor measured.',
  },
  {
    id: 'r5-syn-path-bookkeeping',
    holds: () => {
      const cp = S.certPath, hp = S.hybridPath, bp = S.bandPath;
      const bc = ['P7', 'P11', 'P13', 'P17', 'P19', 'P23', 'P29', 'P31', 'P47'].reduce((s, p) => s + bp[p][0], 0);
      const bt = ['P7', 'P11', 'P13', 'P17', 'P19', 'P23', 'P29', 'P31', 'P47'].reduce((s, p) => s + bp[p][1], 0);
      return sum(cp.byPrefix) === cp.floors && sum(cp.bySource) === cp.floors && cp.wolc + cp.finiteMarginOnly === cp.floors
        && cp.wolcMarginRange[1] <= 0.0223 / (1 + 1e-12) && cp.finiteMarginRange[0] > 0.0223 && bc === 268 && bt === 630
        && hp.certified + sum(hp.uncertified) === hp.floors && Object.keys(hp.uncertified).join() === 'P47' && !('r3core4' in cp.bySource);
    },
    why: '337 = 272 WOL-C + 65 finite-margin P47 floors on the certified path; 268 of 630 band-path entries WOL-C; hybrid 635 = 266 + 369, all uncertified at P47.',
  },
  {
    id: 'r5-syn-band-runs',
    holds: () => ['P-cert', 'P-cond', 'PcertCr8'].every((k) => { const b = S.bandRuns[k]; return b.fails === 0 && b.hMin >= S.bandRuns.h2Range[0] && b.hMax <= S.bandRuns.h2Range[1] && b.windowMargin > 0 && b.maxCDelta < 1 && b.startMargin > 1.99e-6; }),
    why: 'All three r5 runs pass E1–E8 with heights inside the Lemma H2 range and positive window and start margins.',
  },
  {
    id: 'r5-syn-replay',
    holds: () => S.replay.ok === true && S.replay.runs[0] === S.replay.runs[1] && S.replay.runs[1] >= 31 && S.replay.assembly[0] === S.replay.assembly[1] && S.replay.assembly[1] >= 10,
    why: './replay.sh end to end: every run (incl. R26–R31) and every assembly check (incl. A7–A9) passes.',
  },
  {
    id: 'r5-syn-ledger-grades',
    holds: () => {
      const grades = ['proved+refereed(internal)', 'certified', 'published', 'written, unrefereed', 'open'];
      const c = (g) => S.ledger.filter((x) => x.grade === g).length;
      return S.ledger.every((x) => grades.includes(x.grade)) && new Set(S.ledger.map((x) => x.id)).size === S.ledger.length && S.ledger.length === 29
        && c('proved+refereed(internal)') === 11 && c('certified') === 8 && c('published') === 3 && c('written, unrefereed') === 1 && c('open') === 6
        && S.ledger.find((x) => x.id === 'r3core4-NL2').usedBy.length === 0;
    },
    why: 'Ledger of 29 inputs: 11 proved + internally refereed, 8 certified, 3 published, 1 written unrefereed, 6 open; the r3core4.c NL=2 item is used by no value.',
  },
  {
    id: 'r5-syn-which-value-needs-what',
    holds: () => {
      const needs = (k) => S.ledger.filter((x) => x.usedBy.includes(k));
      const openFor = (k) => needs(k).filter((x) => x.grade === 'open').map((x) => x.id);
      return openFor('P-cond').includes('WOL-C') && !openFor('P-cert').includes('WOL-C') && openFor('P-cond').length === openFor('P-cert').length + 2
        && openFor('P-cert').length === openFor('b145').length && ['G0-c', 'AF-gaps', 'producer-layer'].every((id) => openFor('P-cert').includes(id))
        && !needs('P-cert').some((x) => x.id === 'r3core4-NL2');
    },
    why: 'WOL-C (with the time box) separates the sub-0.145 value from P-cert; P-cert and b145 share the same three open inputs; P-cert does not use r3core4.c NL=2.',
  },
  {
    id: 'r5-syn-remaining-covers-open',
    holds: () => {
      const txt = [...S.remaining.candidate, ...S.remaining.sub0145, ...S.remaining.beyondCandidate].join(' | ');
      return S.ledger.filter((x) => (x.grade === 'open' && !['timebox', 'WOL-C'].includes(x.id)) || x.grade === 'written, unrefereed').every((x) => txt.includes(x.id))
        && /WOL-C/.test(txt) && /P47/.test(txt) && /r5-lemmas/.test(txt);
    },
    why: 'Every open or unrefereed input, the P47 WOL-C gap and the r5 lemma referee appear in the remaining steps.',
  },
  {
    id: 'r5-syn-honest-scope',
    holds: () => /refereed bound is changed/i.test(S.verdict) && /NO QED/.test(S.verdict) && /NOT certified/.test(S.verdict) && /NOT PROVED/.test(S.verdict)
      && /Nothing is proved unconditionally below 0\.2/.test(S.verdict) && /NO QED/.test(S.status) && /REFUTED/.test(S.r3core4Audit),
    why: 'No bound below 0.2 is proved; Λ < 0.145 not certified; r3core4.c NL=2 not certified; RH open.',
  },
]);

export default R5_SYNTHESIS;
