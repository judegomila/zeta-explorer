/**
 * @fileoverview r4-synthesis-2026-10-04 — synthesis of the r4 round (wol-pd, wol-sym, wol-adapt, g0d, g0dprime, packet; each with one
 * adversarial internal referee pass): WOL-C certified margins combined per entry across the three angles, the route-P value recomputed with
 * the exact consumer, the updated input ledger, and what remains.
 *
 * Merge rule (tmp/r4-synth-merge.py → tmp/r4-synth-out/cert_merged.json, sha256 14e65e93…): for each r2 floor key@file take the LARGEST
 *  refereed admission shift (= smallest certified margin) among
 *    pd    wol-pd shifts lowered by 1e-9 (referee rounding correction; tmp/r4-ref-wol-pd-out/adm_r4_all_pad1e-9.json, 263 entries)
 *    ad    wol-adapt claimant margins (refereed, minor; tmp/r4-woladapt-out/certfile_final.json, 169 entries incl. 5 r3 S = {2,3,5})
 *    r3    r3 referee admission file (tmp/r3-ref-outer-out/certfile_ref.json, 9 entries)
 *    adref wol-adapt referee independent re-certificates (13 entries; margin → Lemma-1 shift)
 *  wol-sym contributes nothing (refuted reach; only a one-point first-branch pilot). Result: 268 entries (267 consumer keys);
 *  per-entry winner pd 112, ad 154, adref 2 (139|1|sharp margin 0.009945, 52|1|r_49_100 margin 0.002869).
 *
 * Exact consumer runs (tmp/r3-outer-mixed.py unchanged; logs tmp/r4-synth-out/):
 *   certified floors only (merged)                   → 5872323230689/(4·10^13)  = 0.146808080767225 (261 r2 floors on path)
 *   hybrid: merged certified + WOL-C ASSUMED (0.0223)  → 579107326857/(4·10^12)   = 0.14477683171425  (635 floors; 380 uncertified)
 * Band checks E1–E8 (tmp/r4-wolpd-bb.py → tmp/r3-bb-replay.py unchanged, s145venv): both runs reproduce U exactly with 0 failures
 *  (no E6-altlog flag): certified 75,166 steps, h ∈ [0.6688, 2.18], window margin 2.054e-3, start margin 2.0e-6; hybrid 74,126 steps,
 *  h ∈ [0.6336, 2.18]. Replay packet default tier rerun: REPLAY PASS 25/25 runs, 7/7 checks, 232.5 s (r3 values).
 *
 * PROVED: nothing unconditional below 0.2. CERTIFIED: exact consumer values above. CONDITIONAL: every Λ value below 0.2.
 * Import-free. ASSERTIONS recompute the merge rule on sample entries (including the Lemma-1 shift of the referee margins), the exact
 * decimals, the value ordering, the path bookkeeping, ledger counts by grade and which inputs each value needs.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const shift = (m) => `${Math.floor((0.0023 - m * (1 + 1e-12)) * 1e13) - 1}/10000000000000`;

const I = (id, what, grade, note, usedBy) => Object.freeze({ id, what, grade, note, usedBy: Object.freeze(usedBy) });
const ALL = ['P-cert', 'P-cond', 'b145'];

export const R4_SYNTHESIS = Object.freeze({
  id: 'r4-synthesis-2026-10-04',
  date: '2026-10-04',
  title: 'r4 synthesis: route-P Λ with certified margins only 0.1468081 (below b145 PT); sub-0.145 still needs WOL-C for 380 floors; G0-d and G0-d′ (2.6X) closed internally',
  status: 'SYNTHESIS of six internally refereed tasks (one refuted in its reach). Every Λ value below 0.2 remains conditional. NO QED.',

  values: Object.freeze({
    'P-cert': { exact: '5872323230689/40000000000000', dec: '0.146808080767225', label: 'route P, merged certified WOL-C floors only (261 on path)' },
    'P-cond': { exact: '579107326857/4000000000000', dec: '0.14477683171425', label: 'route P, merged certified + WOL-C at 0.0223 assumed for 380 uncertified path floors' },
    b145: { exact: '18409208597849/125000000000000', dec: '0.147273668782792', label: 'b145 PT band + grid + two-height kernels, no r2 floors' },
    PcertPdOnly: { exact: '29368619557091/200000000000000', dec: '0.146843097785455', label: 'route P, wol-pd floors only (padded): no r3core4.c floor' },
    PcertAdapt: { exact: '73578925151847/500000000000000', dec: '0.147157850303694', label: 'route P, wol-adapt certfile only' },
    PcertR3: { exact: '73770784989943/500000000000000', dec: '0.147541569979886', label: 'r3 certified-only route P (superseded)' },
    PcondR3: { exact: '1448843462793/10000000000000', dec: '0.1448843462793', label: 'r3 conditional route P, WOL-C for 626 entries (superseded)' },
    U2: { exact: '36063660805739/250000000000000', dec: '0.144254643222956', label: 'band 2 at 2.6X' },
    noR2: { exact: '29511133454807/200000000000000', dec: '0.147555667274035', label: 'route-P consumer, no r2 floors' },
    candidate01758354: { exact: '1758354/10000000', dec: '0.1758354', label: 'existing project candidate (y-transfer)' },
  }),

  merge: Object.freeze({
    entries: 268, consumerKeys: 267, winners: { pd: 112, ad: 154, adref: 2 }, sha256: '14e65e93054c2b3f2540d4ba119cc5500c10d8c1eabc8d2b8eae069e5186ea4a',
    marginRange: [0.0022846, 0.0219877],
    samples: Object.freeze([
      { key: '0|1|r_49_100 (P7)', pd: '-312325439/1250000000000', ad: '-15304329731/10000000000000', r3: '-130398140749/10000000000000', merged: '-312325439/1250000000000', winner: 'pd' },
      { key: '139|1|sharp (P17)', pd: '-21538642253/2500000000000', ad: '-19870505879/1000000000000', refMargin: 0.009944925475814936, merged: '-1911231369/250000000000', winner: 'adref' },
      { key: '52|1|r_49_100 (P13)', pd: '-48244629673/10000000000000', ad: '-6579376661/5000000000000', refMargin: 0.00286892410282491, merged: '-568924103/1000000000000', winner: 'adref' },
      { key: '99|1|sharp (S235)', ad: '-155638670591/10000000000000', r3: '-155638670591/10000000000000', merged: '-155638670591/10000000000000', winner: 'ad' },
    ]),
  }),

  // original r3 band path (tmp/r3-outer-out/used_w002.json, 630 entries): certified [n, total] per prefix after the merge
  bandPath: Object.freeze({ P7: [15, 15], P11: [70, 70], P13: [74, 74], P17: [22, 22], P19: [34, 34], P23: [39, 39], P29: [3, 8], P31: [0, 5], P47: [0, 363] }),
  certPath: Object.freeze({ floors: 261, byPrefix: { P7: 15, P11: 76, P13: 68, P17: 22, P19: 34, P23: 39, P29: 3, S235: 4 }, bySource: { pd: 112, ad: 147, adref: 2 } }),
  hybridPath: Object.freeze({ floors: 635, certified: 255, uncertified: { P47: 372, P29: 4, P31: 3, P43: 1 }, uncertifiedCells: [226, 579] }),
  bandRuns: Object.freeze({
    'P-cert': { steps: 75166, fails: 0, hMin: 0.6688, hMax: 2.18, windowMargin: 0.0020537663779811757, maxCDelta: 4.367792912495384e-5, startMargin: 2.000000000517967e-6 },
    'P-cond': { steps: 74126, fails: 0, hMin: 0.6336, hMax: 2.18, windowMargin: 0.0020537663779811757, maxCDelta: 4.5894676898419604e-5, startMargin: 2.000000000517967e-6 },
    h2Range: [0.5, 2.5],
  }),

  angles: Object.freeze({
    'wol-pd': { referee: 'not refuted, minor', certified: 263, bandPath: 257, contributes: true },
    'wol-sym': { referee: 'REFUTED (major) in its reach claims', certified: 0, bandPath: 0, contributes: false },
    'wol-adapt': { referee: 'not refuted, minor', certified: 164, bandPath: 164, contributes: true },
  }),

  ledger: Object.freeze([
    I('WOL-C', 'weak outer lemma in consumed form, margin 0.0223 (absorbs the 0.0023 time-box allowance)', 'open',
      '257 of 630 r3 band-path entries certified (all P7–P23, 3 of P29); 380 uncertified floors on the r4 hybrid path (P47 372); no implemented angle reaches P47', ['P-cond']),
    I('r2-floors-cert', '261 r2 floors on the certified path (single-entry WOL-C certificates)', 'certified',
      '112 by the wol-pd engine (r4-wolpd-rig.c + cert/cert2; single implementation, referee containment tests on 8 entries, 1e-9 padding); 149 by r3core4.c (+ r4core_t.c truncation, diff read by referee; core not audited line by line)', ['P-cert', 'P-cond']),
    I('wolpd-lemmas', 'wol-pd L1–L5 (Fourier form, log-positivity b_n ≥ 0, cosine majorant, extra part/region ladder, tail identities)', 'proved+refereed(internal)',
      're-derived by the referee incl. two unwritten steps; exist only in docstrings and the report (no formalization note)', ['P-cert', 'P-cond']),
    I('r2-floors-base', 'r2 floor ingredients pert, Dslope, v0 (slope-fixed); r2 construction Φ_E ≥ J; r3 Lemma 1', 'certified', 'arb 128 bit, r2 referee; Lemma 1 written + r3 referee', ['P-cert', 'P-cond']),
    I('timebox', '0.0023 time-box allowance', 'open', 'measured at 4 cells; absorbed by WOL-C for the uncertified floors (the certificates cover the whole cell)', ['P-cond']),
    I('G0-a', 'c_n(t) ≥ 0 nondecreasing, every n (Lemma CG)', 'proved+refereed(internal)', 'computer algebra + arb + FLINT C checks; re-confirmed by G0-d (covering-graph proof)', ALL),
    I('lemmaR', 'Track A Lemma R (domain x ≥ X − 2 + a)', 'proved+refereed(internal)', 'three internal passes; ε_R ≤ 4.29e-12 (1.66e-12 at 2.6X)', ALL),
    I('G0-c', 'Raymond Lemmas 2–4 / Theorem 4′ (written out in full)', 'open', 'internal adversarial re-derivation found no defect; non-project reader missing', ALL),
    I('G0-d', 'one-point input (OP) = AF Part I §§6–9', 'proved+refereed(internal)',
      'r4: re-derived (no ERROR, 8 expository GAPs g1–g8 with fixes), one adversarial internal pass; all 11 one-point producer families read at PT height recomputed, 0 failures; non-project reader missing', ALL),
    I('G0-dprime', 'X-transfer of AF §§4–9 to 2.6X (U2 stack) = Theorem XT', 'proved+refereed(internal)',
      'r4: written, premises certified at X′ (second library for the row checks), H_enc point data certified on the U2 path, one internal pass; OPEN at 1.6X/1.65X/1.7X (Route H, not used here)', ALL),
    I('AF-4-5', 'AF Part I §§4–5 probe constants (|R| < 2e-6, |R_y| < 2e-4, Re β/2 > L/4 − 1e-6, 1.01 factor, masses 6/22/180)', 'proved+refereed(internal)',
      'Raymond text graded SOUND by the b145 internal referee; not re-derived in r4; named as a condition of G0-d and Theorem XT', ALL),
    I('AF-gaps', 'AF §3 GAPs 3a/3b (wall budget), AF §§10–12 GAP-1..4 (expository)', 'open', 'graded SOUND internally, not written; G21 wall-budget formulas transcribed from certify_anchor_q.py', ALL),
    I('twoHeight', 'two-height coupling at out-of-catalogue shifts + 10 MH kernel certificates', 'proved+refereed(internal)', 'stored entries reproduced independently; MH one-point families K21_10/K12_5/K11_4/K31_10 recomputed (G0-d referee)', ['b145']),
    I('consumer', 'multi-height consumer (exact rational)', 'proved+refereed(internal)', 'SOUND on two passes; outputs reproduced by independent code', ALL),
    I('lemmaB-written', 'Lemma B.1–B.3 and Theorem B', 'written, unrefereed', 'statement match checked by the r3 bb referee; B.1–B.3 not re-refereed as written', ALL),
    I('BB', 'BB1/BB2 = Theorem BB + Lemma C + Lemma H2', 'proved+refereed(internal)', 'one adversarial internal pass, CONFIRMED', ALL),
    I('E1-E8', 'band-run checks', 'certified', 'r4 merged certified run 75,166 steps and hybrid run 74,126 steps, 0 failures each; earlier runs replayed by the packet', ALL),
    I('K', 'near-field kernel certificates (13 catalogue + 10 two-height)', 'certified', 'independent Bernstein re-implementation 23/23 PASS (packet R21)', ALL),
    I('H2', 'far-field inequality for 24 kernels, |d| ≥ 7252, b ≤ 1', 'proved+refereed(internal)', 'analytic Lemma H2 + exact rational check (packet R22)', ALL),
    I('W', 'walls at x_f, x_L, x_R (AF §3 Abel transfer)', 'certified', 'both lanes; x_L/x_R re-verified by independent C/Arb at 160–512 bits (G0-d′)', ALL),
    I('RH-win', '7.8e12 window: 16,071 zeros on the line', 'certified', 'Route 2 (RS signs + Trudgian Thm 2.2 + parity); FLINT zeta_rs unaudited', ALL),
    I('RH-head', 'RH to the head wall at PT height', 'published', 'Platt–Trudgian 2021; exposure to the Gram-block Turing gap not determined', ALL),
    I('MTY', 'zero-free region for the band-1 start', 'published', 'Mossinghoff–Trudgian–Yang; Q0B recomputed in mpmath (packet referee)', ALL),
    I('P15', 'Polymath15 Prop 3.1, Thm 1.5(i); de Bruijn', 'published', 'statements checked against the local tex', ALL),
    I('archives', 'consumer-layer replay inputs (formerly volatile /tmp)', 'certified',
      'formalization/review-packet-sub0145: SHA-256 pinned, ./replay.sh reproduces the r3 values (25/25 + 7/7 rerun here; 44/44 deep, sandboxed by the referee); untracked in git pending approval', ALL),
    I('producer-layer', 'producer runs (Raymond probes, r2 campaign + 112 GB coef caches, WOL-C engine runs, RH-window RS/Turing) and the r4 merged admission', 'open',
      'hashed only, not re-executed by the packet; wheels/ and upstream/ local only; r4 cert files still in REPO/tmp', ALL),
  ]),

  remaining: Object.freeze({
    candidate: Object.freeze([
      'G0-c: a non-project reader of Theorem 4′ / Lemmas 2–4',
      'AF-gaps: write GAP 3a/3b (wall budget) and GAP-1..4; fold the G0-d fixes g1–g8 into the chain write-up',
      'lemmaB-written: adversarial referee of B.1–B.3 and Theorem B as written',
      'producer-layer: commit the packet (with approval), add the r4 merged admission + certificates, copy wheels/upstream off this machine',
      'r2-floors-cert: line-by-line audit of r3core4.c (149 of 261 certified-path floors; r3core4.c-free value 0.146843097785455) and a second implementation of the wol-pd assembly',
      'wolpd-lemmas: formalization note for L1–L5 and the log-positivity lemma, then a non-author referee',
      'RH-win trust base: audit or re-implement FLINT zeta_rs; RH-head: confirm the PT21 Turing step form',
    ]),
    sub0145: Object.freeze([
      'WOL-C for the 380 uncertified hybrid-path floors: P47 372 (cells 226–579) need a new angle — the mixed-frequency (ω = 2, 3) bad mass of the label part (wol-pd) or a far-region monotonicity argument outside the 6–8-prime near box (wol-adapt)',
      'WOL-C for P29 ×4, P31 ×3, P43 ×1 (wol-pd misses by 0.0001–0.005; nt = 4 t-pieces, per-label λ, sharper reflected bound)',
    ]),
    beyondCandidate: Object.freeze(['G0-e: external referee of the chain, Lemma B / Theorem BB and the WOL-C certificate engines', "G0-d′ at 1.6X/1.65X/1.7X (Route H only)"]),
  }),

  verdict:
    'Best certified-margin route-P value at PT height: Λ ≤ 5872323230689/(4·10^13) = 0.146808080767225 (exact consumer, 261 certified r2 floors, '
    + 'E1–E8 0 failures), below the b145 PT value 0.147273668782792 and the r3 value 0.147541569979886. It is conditional on the shared inputs '
    + '(G0-c, AF expository gaps, Lemma B.1–B.3 as written, RH-win trust base, RH-head, producer layer) and on two unaudited certificate engines. '
    + 'Λ < 0.145 is NOT certified: Λ ≤ 0.14477683171425 needs WOL-C for 380 uncertified floors (372 of them P47), which is NOT PROVED. '
    + 'G0-d (AF Part I §§6–9) and G0-d′ at 2.6X are closed internally (one adversarial pass each); no external referee. '
    + 'Nothing is proved unconditionally below 0.2. No refereed bound is changed. RH open. NO QED.',
});

const S = R4_SYNTHESIS;
const v = (k) => S.values[k].exact;

export const R4_SYNTHESIS_ASSERTIONS = Object.freeze([
  {
    id: 'r4-syn-values-exact',
    holds: () => Object.values(S.values).every((x) => { const n = exact15(x.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(x.dec)) < 1e-16; }),
    why: 'Every stated decimal is the exact value of its rational (all denominators divide 10^15).',
  },
  {
    id: 'r4-syn-ordering',
    holds: () => lt(v('U2'), v('P-cond')) && lt(v('P-cond'), '145/1000') && lt(v('P-cond'), v('PcondR3')) && lt('145/1000', v('P-cert'))
      && lt(v('P-cert'), v('PcertPdOnly')) && lt(v('PcertPdOnly'), v('PcertAdapt')) && lt(v('PcertAdapt'), v('b145'))
      && lt(v('b145'), v('PcertR3')) && lt(v('PcertR3'), v('noR2')) && lt(v('noR2'), v('candidate01758354')),
    why: 'U2 < P-cond < 0.145 < P-cert (merged) < pd-only < adapt-only < b145 < r3 P-cert < noR2 < 0.1758354: only the WOL-C-conditional value is below 0.145.',
  },
  {
    id: 'r4-syn-merge-rule-live',
    holds: () => S.merge.samples.every((s) => {
      const cands = [s.pd, s.ad, s.r3, s.refMargin !== undefined ? shift(s.refMargin) : undefined].filter(Boolean);
      const best = cands.reduce((a, b) => (cmp(b, a) > 0 ? b : a));
      return cmp(best, s.merged) === 0;
    }) && S.merge.winners.pd + S.merge.winners.ad + S.merge.winners.adref === S.merge.entries && S.merge.marginRange[1] <= 0.0223 / (1 + 1e-12),
    why: 'Recomputed here: the merged shift is the maximum of the source shifts, with referee margins converted by the Lemma-1 formula; winners partition the 268 entries.',
  },
  {
    id: 'r4-syn-path-bookkeeping',
    holds: () => {
      const bp = Object.values(S.bandPath); const cert = bp.reduce((s, [a]) => s + a, 0), tot = bp.reduce((s, [, b]) => s + b, 0);
      const cp = S.certPath, hp = S.hybridPath;
      const sum = (o) => Object.values(o).reduce((s, x) => s + x, 0);
      return cert === 257 && tot === 630 && sum(cp.byPrefix) === cp.floors && sum(cp.bySource) === cp.floors
        && hp.certified + sum(hp.uncertified) === hp.floors && sum(hp.uncertified) === 380 && hp.uncertified.P47 / sum(hp.uncertified) > 0.97;
    },
    why: '257 of 630 r3 band-path entries certified; 261 certified floors on the P-cert path; 635 = 255 + 380 on the hybrid path, 372 of the 380 at P47.',
  },
  {
    id: 'r4-syn-band-runs',
    holds: () => ['P-cert', 'P-cond'].every((k) => { const b = S.bandRuns[k]; return b.fails === 0 && b.hMin >= S.bandRuns.h2Range[0] && b.hMax <= S.bandRuns.h2Range[1] && b.windowMargin > 0 && b.maxCDelta < 1 && b.startMargin > 1.99e-6; }),
    why: 'Both new route-P runs pass E1–E8 with heights inside the Lemma H2 range and positive window and start margins.',
  },
  {
    id: 'r4-syn-angles',
    holds: () => S.angles['wol-sym'].contributes === false && S.angles['wol-sym'].certified === 0 && /REFUTED/.test(S.angles['wol-sym'].referee)
      && S.angles['wol-pd'].bandPath === 257 && S.angles['wol-adapt'].bandPath <= S.angles['wol-pd'].bandPath,
    why: 'Only refereed certificates enter: wol-sym (refuted reach) contributes none; wol-adapt band-path entries are a subset of wol-pd ones (margins differ).',
  },
  {
    id: 'r4-syn-ledger-grades',
    holds: () => {
      const grades = ['proved+refereed(internal)', 'certified', 'published', 'written, unrefereed', 'open'];
      const c = (g) => S.ledger.filter((x) => x.grade === g).length;
      return S.ledger.every((x) => grades.includes(x.grade)) && new Set(S.ledger.map((x) => x.id)).size === S.ledger.length && S.ledger.length === 26
        && c('proved+refereed(internal)') === 10 && c('certified') === 7 && c('published') === 3 && c('written, unrefereed') === 1 && c('open') === 5
        && S.ledger.find((x) => x.id === 'G0-d').grade !== 'open' && S.ledger.find((x) => x.id === 'G0-dprime').grade !== 'open';
    },
    why: 'Ledger of 26 inputs: 10 proved + internally refereed, 7 certified, 3 published, 1 written unrefereed, 5 open; G0-d and G0-d′ (2.6X) moved out of open.',
  },
  {
    id: 'r4-syn-which-value-needs-what',
    holds: () => {
      const needs = (k) => S.ledger.filter((x) => x.usedBy.includes(k));
      const openFor = (k) => needs(k).filter((x) => x.grade === 'open').map((x) => x.id);
      return openFor('P-cond').includes('WOL-C') && !openFor('P-cert').includes('WOL-C') && !openFor('b145').includes('WOL-C')
        && openFor('P-cond').length === openFor('P-cert').length + 2 && openFor('P-cert').length === openFor('b145').length
        && needs('b145').some((x) => x.id === 'twoHeight') && !needs('b145').some((x) => /^r2-|^wolpd/.test(x.id))
        && ['G0-c', 'AF-gaps', 'producer-layer'].every((id) => openFor('P-cert').includes(id));
    },
    why: 'WOL-C (with the measured time box) separates the sub-0.145 value from P-cert; P-cert and b145 share the same three open inputs.',
  },
  {
    id: 'r4-syn-remaining-covers-open',
    holds: () => {
      const txt = [...S.remaining.candidate, ...S.remaining.sub0145, ...S.remaining.beyondCandidate].join(' | ');
      return S.ledger.filter((x) => (x.grade === 'open' && x.id !== 'timebox') || x.grade === 'written, unrefereed').every((x) => txt.includes(x.id) || (x.id === 'WOL-C' && /WOL-C/.test(txt)))
        && /r3core4\.c/.test(txt) && /wolpd-lemmas/.test(txt);
    },
    why: 'Every open or unrefereed input, the r3core4.c audit and the wol-pd lemma write-up appear in the remaining steps.',
  },
  {
    id: 'r4-syn-honest-scope',
    holds: () => /refereed bound is changed/i.test(S.verdict) && /NO QED/.test(S.verdict) && /NOT certified/.test(S.verdict) && /NOT PROVED/.test(S.verdict)
      && /Nothing is proved unconditionally below 0\.2/.test(S.verdict) && /NO QED/.test(S.status),
    why: 'No bound below 0.2 is proved; Λ < 0.145 not certified; RH open.',
  },
]);

export default R4_SYNTHESIS;
