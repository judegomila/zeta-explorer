/**
 * @fileoverview r3-synthesis-2026-10-03 — synthesis of the r3 round (r3-outer, r3-bb, r3-cg, r3-flint2, each with one adversarial internal
 * referee pass): the route-P value recomputed with the exact consumer using only margins that are now certified, the input ledger behind
 * each PT-height value with its status, and what remains before the project could put a value forward as a candidate.
 *
 * Exact consumer runs in this synthesis (tmp/r3-outer-mixed.py = r2-floor-consume arithmetic, unchanged; logs tmp/r3-synth-out/):
 *   certified floors only (referee admission file, smaller margin per entry) → 73770784989943/(5·10^14) = 0.147541569979886 (7 r2 floors used)
 *   no r2 floors                                                              → 29511133454807/(2·10^14) = 0.147555667274035
 *   uniform WOL-C margin 0.0223 on all 2074 adaptive keys (uncertified)        → 1448843462793/10^13      = 0.1448843462793
 * Band checks E1–E8 (tmp/r3-bb-replay.py, unchanged) on the certified-only run: U reproduced, 75,542 steps, 0 failures, heights [0.6688, 2.18],
 *  window lower-end margin 3.43e-3, start margin 2.0e-6 (tmp/r3-synth-bb-certonly.py → tmp/r3-synth-out/bb_certonly.json, 35 s).
 *
 * Referee corrections applied across the round: outer (unsplit share, θ=0 excess range, 191-floor partial path, certified-only value with
 *  smaller margins); bb (kernel count 7/6, step-3 wording, mirror far zeros, BB2 without RH-head, time-box allowance measured); cg (Lemma R
 *  domain x ≥ X − 2 + a, route-P provenance, Raymond Thm 4 already arbitrary-a, G0-d′ attached to 1.6X/1.65X/2.6X entries); flint2 (dyadic
 *  Turing points, single-reader lemma list, Brent's own step defeated, PT21 exposure undetermined). Docs updated: lemma-B-two-band.md,
 *  outer-lemma-weak.md, joint-pair-arbitrary-shift.md, verify_cg_monotonicity.py docstring, FLINT_AUDIT_2.md (appendix).
 * Supersedes the r2 ledger rows: BB1/BB2 'NOT PROVED' (r2-lemma-b-status, r2-second-referee) → proved as written, one internal referee pass;
 *  c_n G0 item → closed; two-height coupling 'needs: both routes' → Route H and the b145 PT value only; time-box step → absorbed by WOL-C
 *  (measured at 4 cells, not certified); FLINT premise → Route 2 certificate. The r2 modules are left as dated records.
 *
 * PROVED: nothing unconditional below 0.2. CERTIFIED: exact consumer values above. CONDITIONAL: every Λ value below 0.2.
 * Verdict: see `verdict`. Import-free. ASSERTIONS recompute the value ordering, the ledger counts by status, which inputs each value needs,
 *  and that every open item is listed in `remaining`.
 */

const rat = (s) => { const [a, b] = String(s).split('/').map(Number); return a / (b ?? 1); };

// status grades: 'proved+refereed(internal)' | 'certified' | 'published' | 'written, unrefereed' | 'open'
const I = (id, what, grade, note, usedBy) => Object.freeze({ id, what, grade, note, usedBy: Object.freeze(usedBy) });
const ALL = ['P-cert', 'P-cond', 'b145'];

export const R3_SYNTHESIS = Object.freeze({
  id: 'r3-synthesis-2026-10-03',
  date: '2026-10-03',
  title: 'r3 synthesis: route-P value with certified margins only 0.1475416; sub-0.145 PT value still needs the weak outer lemma',
  status: 'SYNTHESIS of four internally refereed tasks. Every Λ value below 0.2 remains conditional. NO QED.',

  values: Object.freeze({
    'P-cert': { exact: '73770784989943/500000000000000', label: 'route P, certified r2 floors only (7 on path)' },
    'P-cond': { exact: '1448843462793/10000000000000', label: 'route P with WOL-C at margin 0.0223 on all band-path entries (626 uncertified)' },
    b145: { exact: '18409208597849/125000000000000', label: 'b145 PT band + grid + two-height kernels, no r2 floors' },
    noR2: { exact: '29511133454807/200000000000000', label: 'route-P consumer, no r2 floors' },
    s235: { exact: '36434271002361/250000000000000', label: 'route P, WOL-C on the 628 S={2,3,5} floors only (5 certified)' },
    routeH3: { exact: '144951726247781/1000000000000000', label: 'Route H three-band, floor height 1.6X (needs RH to 4.80e12)' },
    candidate01758354: { exact: '1758354/10000000', label: 'existing project candidate (y-transfer)' },
  }),

  certOnlyBandRun: Object.freeze({ steps: 75542, fails: 0, hMin: 0.6688, hMax: 2.18, windowMargin: 0.00342903300679041, maxCDelta: 4.33e-5, startMargin: 2.0000000005e-6, h2Range: [0.5, 2.5] }),

  ledger: Object.freeze([
    I('WOL-C', 'weak outer lemma in consumed form, margin 0.0223 (absorbs the 0.0023 time-box allowance)', 'open', '4 of 630 band-path entries certified; box method cannot reach P ≥ 13 late cells', ['P-cond']),
    I('r2-floors-cert', '7 r2 floors on the certified path (WOL-C single-entry certificates, r3core4.c + arb)', 'certified', 'one referee re-run at prec 192; engine sampling-tested (18,909 points, r3 ≥ r2); no line-by-line audit of r3core4.c', ['P-cert']),
    I('r2-floors-base', 'r2 floor ingredients pert, Dslope, v0 (slope-fixed)', 'certified', 'arb 128 bit, r2 referee; tail-FFT slack 1e-12·ΣDΣμ heuristic, negligible, not used by the r3 certificates', ['P-cert', 'P-cond']),
    I('timebox', '0.0023 time-box allowance', 'open', 'measured at 4 cells; needed only via WOL-C (whole time cell), so it is not a separate input', ['P-cond']),
    I('G0-a', 'c_n(t) ≥ 0 nondecreasing, every n (Lemma CG)', 'proved+refereed(internal)', 'computer algebra + arb + FLINT C checks', ALL),
    I('lemmaR', 'Track A Lemma R (domain x ≥ X − 2 + a)', 'proved+refereed(internal)', 'three internal passes; ε_R ≤ 4.29e-12', ALL),
    I('G0-c', 'Raymond Lemmas 2–4 / Theorem 4′ (written out in full)', 'open', 'internal adversarial re-derivation found no defect; non-project reader missing', ALL),
    I('G0-d', 'one-point input (OP) = AF Part I §§6–9', 'open', 'self-review; (8.1)–(8.3) closed forms, §7 blocks, E_ℓ cap, exceptional-pair enumeration not re-derived', ALL),
    I('G0-dprime', 'X-transfer of AF §§4–9 to 2.6X (U2 stack)', 'open', 'numerical premises regenerated; written argument not refereed', ALL),
    I('AF-gaps', 'AF §3 GAPs 3a/3b, AF §§10–12 GAP-1..4 (expository; GAP-1/2/4 enter the BB transplant)', 'open', 'graded SOUND internally, not written', ALL),
    I('twoHeight', 'two-height coupling at out-of-catalogue shifts (Theorem 4′ ⇒ (OP)) + 10 MH kernel certificates', 'proved+refereed(internal)', 'stored entries reproduced independently (stored ≤ independent)', ['b145']),
    I('consumer', 'multi-height consumer (exact rational)', 'proved+refereed(internal)', 'SOUND on two passes; outputs reproduced by independent code', ALL),
    I('lemmaB-written', 'Lemma B.1–B.3 and Theorem B', 'written, unrefereed', 'r2 referee GAP list absorbed; statement match checked by the r3 bb referee; B.1–B.3 not re-refereed as written', ALL),
    I('BB', 'BB1/BB2 = Theorem BB + Lemma C + Lemma H2', 'proved+refereed(internal)', 'one adversarial internal pass, CONFIRMED; BB2 needs RH-win, not RH-head', ALL),
    I('E1-E8', 'band-run checks (route P, PTMH, U2, four Route H runs, and the certified-only route-P run of this synthesis)', 'certified', 'exact replay, independently reproduced, 0 failures; certified-only run: 75,542 steps, 0 failures, h ∈ [0.6688, 2.18], window margin 3.43e-3 (tmp/r3-synth-bb-certonly.py)', ALL),
    I('K', 'near-field kernel certificates (13 catalogue + 10 two-height)', 'certified', 'independent Bernstein re-implementation 23/23 PASS', ALL),
    I('H2', 'far-field inequality for 24 kernels, |d| ≥ 7252, b ≤ 1', 'proved+refereed(internal)', 'analytic Lemma H2 + exact rational check; referee interval boxes min ratio 1118', ALL),
    I('W', 'walls at x_f, x_L, x_R (AF §3 Abel transfer)', 'certified', 'both lanes; transfer graded SOUND internally', ALL),
    I('RH-win', '7.8e12 window: 16,071 zeros on the line', 'certified', 'Route 2 (RS signs + Trudgian Thm 2.2 + parity), referee-reproduced; FLINT zeta_rs unaudited', ALL),
    I('RH-head', 'RH to the head wall at PT height', 'published', 'Platt–Trudgian 2021; exposure to the Gram-block Turing gap not determined (text points to the direct-integral form)', ALL),
    I('MTY', 'zero-free region for the band-1 start', 'published', 'Mossinghoff–Trudgian–Yang', ALL),
    I('P15', 'Polymath15 Prop 3.1, Thm 1.5(i); de Bruijn', 'published', 'statements checked against the local tex', ALL),
    I('archives', 'replay inputs in /tmp (b145-A/B archives, raymond_pr)', 'open', 'volatile; not yet in a persistent hashed store', ALL),
  ]),

  remaining: Object.freeze({
    candidate: Object.freeze([
      'G0-d: independent derivation of AF Part I §§6–9, starting with (8.1)–(8.3), §7 block enclosures, E_ℓ cap, exceptional pairs',
      'G0-dprime: written X-transfer of AF §§4–9 at 2.6X, refereed (U2)',
      'G0-c: a non-project reader of Theorem 4′ / Lemmas 2–4',
      'AF-gaps: write GAP 3a/3b and GAP-1..4',
      'lemmaB-written: adversarial referee of B.1–B.3 and Theorem B as written',
      'archives: persistent hashed review packet of all replay inputs (pattern of formalization/review-packet-01758354)',
      'RH-win trust base: audit or independently re-implement FLINT zeta_rs (Arias de Reyna bound)',
      'RH-head: confirm the PT21 Turing step is the direct-integral form, not the Gram-block criterion',
    ]),
    sub0145: Object.freeze([
      'WOL-C for the 626 uncertified band-path entries; P ≥ 13 late cells need a Φ-specific structural argument (box excess 0.033–1.29 > 0.0223)',
      'line-by-line audit of r3core4.c',
    ]),
    beyondCandidate: Object.freeze(['G0-e: external referee of the chain and of Lemma B / Theorem BB']),
  }),

  verdict:
    'Route-P Λ with only certified margins is 73770784989943/(5·10^14) = 0.147541569979886 (exact consumer, 7 certified r2 floors), above the '
    + 'b145 PT value 0.147273668782792, which needs no r2 floor and no outer lemma. Route-P Λ ≤ 0.1448843462793 < 0.145 remains conditional on the '
    + 'weak outer lemma (WOL-C) for 626 of 630 band-path entries, which is NOT PROVED. BB1/BB2 are now proved as written and internally refereed; '
    + 'the 7.8e12 window is certified by Route 2; c_n monotonicity is closed. Every value below 0.2 is still conditional on G0-c/d/d′, the AF '
    + 'expository gaps and Lemma B.1–B.3 (written, unrefereed). Nothing is proved unconditionally below 0.2. No refereed bound is changed. RH open. NO QED.',
});

const S = R3_SYNTHESIS;
const v = (k) => rat(S.values[k].exact);

export const R3_SYNTHESIS_ASSERTIONS = Object.freeze([
  {
    id: 'r3-syn-values',
    holds: () => Math.abs(v('P-cert') - 0.147541569979886) < 1e-15 && Math.abs(v('P-cond') - 0.1448843462793) < 1e-15
      && Math.abs(v('b145') - 0.147273668782792) < 1e-15 && Math.abs(v('noR2') - 0.147555667274035) < 1e-15
      && v('P-cond') < 0.145 && v('s235') > 0.145 && v('b145') < v('P-cert') && v('P-cert') < v('noR2') && v('noR2') < v('candidate01758354'),
    why: 'Only the uncertified uniform WOL-C value is below 0.145; with certified margins route P sits at 0.1475416, above b145 PT 0.1472737, all below the 0.1758354 candidate.',
  },
  {
    id: 'r3-syn-certonly-band-run',
    holds: () => {
      const b = S.certOnlyBandRun;
      return b.fails === 0 && b.hMin >= b.h2Range[0] && b.hMax <= b.h2Range[1] && b.windowMargin > 0 && b.maxCDelta < 1 && b.startMargin > 1.99e-6;
    },
    why: 'The certified-only route-P run passes E1–E8 (Theorem BB applies): heights inside the Lemma H2 range [1/2, 5/2], positive window and start margins.',
  },
  {
    id: 'r3-syn-ledger-grades',
    holds: () => {
      const grades = ['proved+refereed(internal)', 'certified', 'published', 'written, unrefereed', 'open'];
      const c = (g) => S.ledger.filter((x) => x.grade === g).length;
      return S.ledger.every((x) => grades.includes(x.grade)) && new Set(S.ledger.map((x) => x.id)).size === S.ledger.length
        && c('proved+refereed(internal)') === 6 && c('certified') === 6 && c('published') === 3 && c('written, unrefereed') === 1 && c('open') === 7;
    },
    why: 'Ledger of 23 inputs: 6 proved + internally refereed, 6 certified, 3 published, 1 written unrefereed, 7 open.',
  },
  {
    id: 'r3-syn-which-value-needs-what',
    holds: () => {
      const needs = (k) => S.ledger.filter((x) => x.usedBy.includes(k));
      const openFor = (k) => needs(k).filter((x) => x.grade === 'open').map((x) => x.id);
      return openFor('P-cond').includes('WOL-C') && !openFor('P-cert').includes('WOL-C') && !openFor('b145').includes('WOL-C')
        && needs('b145').some((x) => x.id === 'twoHeight') && !needs('P-cert').some((x) => x.id === 'twoHeight')
        && !needs('b145').some((x) => /^r2-/.test(x.id)) && openFor('P-cert').length === openFor('b145').length
        && openFor('P-cond').length === openFor('P-cert').length + 2;
    },
    why: 'WOL-C (and the measured time box) separate the conditional sub-0.145 value from the certified-margin value; b145 uses two-height kernels and no r2 floor.',
  },
  {
    id: 'r3-syn-remaining-covers-open',
    holds: () => {
      const txt = [...S.remaining.candidate, ...S.remaining.sub0145, ...S.remaining.beyondCandidate].join(' | ');
      return S.ledger.filter((x) => x.grade === 'open' && x.id !== 'timebox').every((x) => txt.includes(x.id) || (x.id === 'WOL-C' && /WOL-C/.test(txt)))
        && S.ledger.filter((x) => x.grade === 'written, unrefereed').every((x) => txt.includes(x.id));
    },
    why: 'Every open or unrefereed ledger input appears in the list of remaining steps (the time box is absorbed by WOL-C).',
  },
  {
    id: 'r3-syn-honest-scope',
    holds: () => /refereed bound is changed/i.test(S.verdict) && /NO QED/.test(S.verdict) && /NOT PROVED/.test(S.verdict)
      && /Nothing is proved unconditionally below 0\.2/.test(S.verdict) && /NO QED/.test(S.status),
    why: 'No bound below 0.2 is proved; RH open.',
  },
]);

export default R3_SYNTHESIS;
