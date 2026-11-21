/**
 * @fileoverview r2-second-referee-2026-10-02 — second internal referee pass on Track A (Lemma R, C_g monotonicity) and Track B (multi-height
 * consumer, two-height coupling, Lemma B, far-field identities), plus the r2 synthesis ledger: status of every conditional piece behind the
 * sub-0.145 values (r2-structured-floor, r2-height-reduction, r2-lemma-b-status, r2-flint-audit) and the decision left open.
 * Each argument re-derived from Raymond’s text (tmp/raymond-22867547/*); numerical checks share nothing with Track A/B except archived inputs
 * (tmp/r2-ref2-*.py, logs tmp/r2-ref2-out/).
 *
 * Grades: Lemma R SOUND; C_g monotonicity SOUND (and closes the G0 item “c_n(t) ≥ 0 nondecreasing, measured for n ≤ 1024” for every n ≥ 1 once
 *  written up); multi-height consumer SOUND; two-height coupling SOUND (conditional inputs: Raymond Theorem 4 at shifts outside his catalogue,
 *  part of G0); Lemma B GAP (logic sound; five written steps missing — see r2-lemma-b-status for which the written document now covers);
 *  far-field identities SOUND. No argument in ERROR. Every headline exact value reproduced by independent float code (≤ 8e-15).
 *
 * Synthesis corrections applied:
 *  - The referee’s “best at PT height is still 0.147273668782792” predates the structured floor. After it (slope-fixed), the best conditional PT-floor-
 *    height value is 0.144505784802732, which adds one new unproved input (the outer lemma) and one uncertified step (time-box zero-freeness).
 *  - Lemma B’s window premise makes even the PT-height band values conditional on the FLINT window (now audited once and rerun with the wrap patch)
 *    and MTY, though not on RH above PT.
 *  - The referee did not re-run the 608-cell interval certification or every Bernstein certificate (MH8 only).
 *
 * PROVED: nothing new unconditionally. CERTIFIED: MH8 kernel certificate re-run (same hash). MEASURED: all reproductions below.
 * Verdict: see `verdict`. Import-free. ASSERTIONS recompute the C_g covering (inclusion–exclusion) identity and its monotonicity on random data, the
 * Lemma R error scale, the consumer reproductions, the far-field d^-4 coefficient, and the ledger bookkeeping.
 */

const rat = (s) => { const [a, b] = String(s).split('/').map(Number); return a / (b ?? 1); };
const K = (y, d, b) => (2 * y * (d * d + y * y - b * b)) / ((d * d + (y - b) ** 2) * (d * d + (y + b) ** 2));
// deterministic PRNG for the live identity check
const lcg = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
// Möbius side Σ_{S⊆P} (−1)^{|P∖S|} Π_{p∈S}(1+π_p) Π_{pq⊆S}(1+r_pq) vs covering side Σ_{T∪V(E)=P} Π_T π_p Π_E r_pq
const coverCheck = (pi, r) => {
  const m = pi.length, pairs = [];
  for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) pairs.push([i, j]);
  let mob = 0;
  for (let S = 0; S < 1 << m; S++) {
    let v = 1; for (let i = 0; i < m; i++) if (S >> i & 1) v *= 1 + pi[i];
    pairs.forEach(([i, j], k) => { if ((S >> i & 1) && (S >> j & 1)) v *= 1 + r[k]; });
    mob += (m - popc(S)) % 2 ? -v : v;
  }
  let cov = 0;
  for (let T = 0; T < 1 << m; T++) for (let E = 0; E < 1 << pairs.length; E++) {
    let V = T, v = 1;
    for (let i = 0; i < m; i++) if (T >> i & 1) v *= pi[i];
    pairs.forEach(([i, j], k) => { if (E >> k & 1) { V |= (1 << i) | (1 << j); v *= r[k]; } });
    if (V === (1 << m) - 1) cov += v;
  }
  return [mob, cov];
};
const popc = (x) => { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; };

export const R2_SECOND_REFEREE = Object.freeze({
  id: 'r2-second-referee-2026-10-02',
  date: '2026-10-02',
  title: 'Second internal referee pass (Lemma R, C_g, consumer, coupling, Lemma B, far field) and the r2 conditional-input ledger',
  status: 'REFEREE (internal, second pass): no ERROR; Lemma B GAP (logic sound). Ledger of conditional inputs. Not an external review. NO QED.',

  grades: Object.freeze([
    { item: 'Track A Lemma R (reflected-label phase rotation)', grade: 'SOUND', note: 'max |θ − aL/2| = 1.99e-14 (allowance 1e-9); residual after a·t·π/(8x): 3e-25; max x|Re β_t − L/2| = 0.060 ≤ 12.5' },
    { item: 'Track A C_g monotonicity', grade: 'SOUND', note: 'covering-graph identity vs Möbius sum: max rel. error 9e-34 (2000 points); 0 monotonicity violations (4000 pairs); closes a G0 item once written' },
    { item: '(i) multi-height consumer', grade: 'SOUND', note: 'each floor and kernel inequality valid separately; largest valid rate licensed' },
    { item: '(ii) two-height coupling', grade: 'SOUND (conditional inputs)', note: 'self terms 2/(h(1+r²)) and 2κ/(h(κ² − v)); d^-4 coefficients +0.16..+0.90; MH8 re-run PASS' },
    { item: '(iii) Lemma B', grade: 'GAP (logic sound)', note: 'five missing written steps; 3 absorbed by lemma-B-two-band.md, 2 deferred into BB1/BB2' },
    { item: '(iv) far-field identities', grade: 'SOUND', note: 'd^-4 coefficient independent of b, = 4y(h² − y² − 3a²) at w = 0; sharp-law d^-6 = (16/9)y(h²−y²)(4h²−y²); min d⁴F/y = 0.005' },
  ]),
  reproductions: Object.freeze([
    ['1.7X band U1', 0.144867568901016, 5.6e-17], ['U2', 0.144254643222956, 7e-15], ['1.7X stack without band', 0.146296949977236, 6e-15],
    ['PT band + grid + two-height', 0.147273668782792, 5e-15], ['PT grid + two-height', 0.148796921571845, 8e-15],
  ]),
  gains: Object.freeze({ certifiedOverFloat: 0, minRatio: 0.979, cell300pair00: { float: [0.013640, 0.012927, 0.025111], cert: [0.013483, 0.012796, 0.024980] } }),
  lemmaR: Object.freeze({ maxDev: 1.99e-14, x: 6000000185827, tMax: 41 / 250, hRange: [11 / 20, 12 / 5], allowance: 1e-9 }),

  // Status of every conditional piece behind the sub-0.145 values (as of this synthesis).
  ledger: Object.freeze([
    { piece: 'outer lemma (θ_S = 0 maximises Φ)', status: 'UNPROVED; numerical support only (216/635 entries sampled, max excess −7.6e-5; ascents at θ_S = 0); weak form margin 0.02 suffices', needs: 'PT-height route only' },
    { piece: 'time-box zero-freeness of F* on the closed polydisc', status: 'UNCERTIFIED extra step; lemma-free direct ball costs ≤ 0.0023 at nsub = 2 (measured at 4 entries), 0.0006–0.0009 at nsub = 3–4', needs: 'PT-height route only' },
    { piece: 'Lemma B (B.1–B.3, Theorem B)', status: 'written, unrefereed; BB1/BB2 band barriers NOT PROVED; chained three-band form not written', needs: 'both routes' },
    { piece: 'FLINT 3.6.0 Platt/Turing', status: 'audited once (1 ERROR harmless at pilot σ, wrap GAP closed by patch); every window used rerun with the patch; no independent referee', needs: 'both routes' },
    { piece: 'Lemma R', status: 'SOUND on two internal passes; conditional input', needs: 'both routes (Track A floors)' },
    { piece: 'C_g monotonicity', status: 'SOUND on two internal passes; also closes the c_n G0 item once written up', needs: 'both routes (Track A floors)' },
    { piece: 'multi-height consumer', status: 'SOUND on two internal passes', needs: 'both routes' },
    { piece: 'two-height coupling', status: 'SOUND (conditional on Raymond Theorem 4 / joint-pair lemma at arbitrary shifts, G0); r2 additions on 0.97/0.94/0.91 sets refereed once (geometry)', needs: 'both routes; heavier on the height route' },
    { piece: 'Raymond chain G0', status: 'OPEN: AF §§6–9 and main Lemmas 2–4 self-reviewed only; joint-pair lemma at arbitrary shifts; no external referee', needs: 'both routes' },
    { piece: 'MTY zero-free region, H2 far field, U2 stack', status: 'published input (MTY); certified (H2_BMAX52, 24/24); certified stack value (U2)', needs: 'both routes' },
    { piece: 'RH to T*', status: 'PT height: proved by Platt–Trudgian; 4.80e12 (1.6X route): NOT verified, 5.681e6 core-hours', needs: 'height route only' },
  ]),
  routes: Object.freeze({
    ptHeight: { value: '36126446200683/250000000000000', spend: 0, extra: ['outer lemma', 'time-box step'] },
    height16: { value: '144951726247781/1000000000000000', spend: 5.681e6, extra: ['RH to 4.80e12'] },
  }),
  decision:
    'Two routes to a sub-0.145 statement share Lemma B (BB1/BB2), the FLINT premise and G0. Route P (PT floor height, 0 core-hours): add a proof of '
    + 'the weak outer lemma (margin 0.02) and the time-box step. Route H (1.6X, 5.681e6 core-hours ≈ $0.11M–0.28M physical-core, more with κ_hw and vCPU '
    + 'pricing): add verified RH to 4.80e12; margin 2.6e-5–4.8e-5. The open choice is whether to fund Route H now or first close the shared inputs and the '
    + 'outer lemma, which Route P needs and which costs no compute purchase.',

  verdict:
    'No refereed argument is in ERROR. Lemma R, C_g, the multi-height consumer, two-height coupling and the far-field identities are SOUND as conditional '
    + 'inputs; Lemma B is GAP as written (logic sound; band barriers BB1/BB2 not proved). Best conditional value at PT floor height is 0.144505784802732 '
    + '(adds the unproved outer lemma); on the Track A route Λ < 0.145 needs verified RH to 4.80e12. Nothing is proved unconditionally below 0.2. '
    + 'No refereed bound is changed. RH open. NO QED.',
});

const R = R2_SECOND_REFEREE;

export const R2_SECOND_REFEREE_ASSERTIONS = Object.freeze([
  {
    id: 'r2-ref2-cg-covering-identity',
    holds: () => {
      const rnd = lcg(20261002);
      for (let trial = 0; trial < 20; trial++) {
        const m = 2 + (trial % 2); // |P| = 2 or 3 (g | 30)
        const t = 0.02 + 0.2 * rnd(), lw = 1 + 5 * rnd(), lp = [Math.log(2), Math.log(3), Math.log(5)].slice(0, m);
        const pi = lp.map((l) => Math.exp((t * l * lw) / 2) - 1), r = [];
        for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) r.push(Math.exp((t * lp[i] * lp[j]) / 2) - 1);
        const [mob, cov] = coverCheck(pi, r);
        const [mob2, cov2] = coverCheck(lp.map((l) => Math.exp((t * l * (lw + 1)) / 2) - 1), r);
        if (!(Math.abs(mob - cov) < 1e-12 * Math.max(1, Math.abs(cov)) && cov >= 0 && cov2 >= cov && Math.abs(mob2 - cov2) < 1e-12 * Math.max(1, cov2))) return false;
      }
      return true;
    },
    why: 'Inclusion–exclusion: the Möbius sum equals the covering sum Σ_{T∪V(E)=P} Π π_p Π r_pq, every term ≥ 0 and nondecreasing in w (live check, 20 random cases, |P| ≤ 3).',
  },
  {
    id: 'r2-ref2-lemmaR-scale',
    holds: () => {
      const L = R.lemmaR, aImplied = (L.maxDev * 8 * L.x) / (L.tMax * Math.PI);
      return aImplied > L.hRange[0] && aImplied < L.hRange[1] && (L.hRange[1] * 12.5) / L.x < L.allowance;
    },
    why: 'The measured deviation 1.99e-14 matches a·t·π/(8x) at a ≈ 1.85 (inside h ∈ [0.55, 2.4]); even the loose written O(12.5/x) bound gives ≤ 5e-12 < 1e-9.',
  },
  {
    id: 'r2-ref2-reproductions',
    holds: () => R.reproductions.every(([, , d]) => d < 1e-14) && R.gains.certifiedOverFloat === 0 && R.gains.minRatio > 0.97
      && R.gains.cell300pair00.cert.every((c, i) => c <= R.gains.cell300pair00.float[i]),
    why: 'Independent float consumer within 8e-15 of every module value; certified gains never exceed per-label float gains.',
  },
  {
    id: 'r2-ref2-farfield-d4',
    holds: () => [[1.3, 0.5, 0.3, 0.2], [2.0, 0.6, 0.9, 0.5], [0.7, 0.3, 0.1, 0.1]].every(([h, y, b, a]) => {
      const d = 300, g = 2 * K(y, d, b) - (2 * y / h) * (K(h, d - a, b) + K(h, d + a, b)) / 2;
      return Math.abs((g * d ** 4) / (4 * y * (h * h - y * y - 3 * a * a)) - 1) < 2e-3;
    }),
    why: 'd^-4 coefficient of the one-height kernel at w = 0 is 4y(h² − y² − 3a²), independent of b (numerical at d = 300).',
  },
  {
    id: 'r2-ref2-ledger',
    holds: () => {
      const routeOnly = (s) => R.ledger.filter((x) => x.needs === s).map((x) => x.piece);
      return R.ledger.length === 11 && routeOnly('PT-height route only').length === 2 && routeOnly('height route only').length === 1
        && /NOT PROVED/.test(R.ledger[2].status) && /UNPROVED/.test(R.ledger[0].status) && /NOT verified/.test(R.ledger[10].status)
        && rat(R.routes.ptHeight.value) < 0.145 && rat(R.routes.height16.value) < 0.145 && R.routes.ptHeight.spend === 0
        && rat(R.routes.ptHeight.value) < rat(R.routes.height16.value);
    },
    why: 'Route P adds the outer lemma and time-box step; Route H adds RH to 4.80e12; all other conditional inputs are shared.',
  },
  {
    id: 'r2-ref2-honest-scope',
    holds: () => /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict) && /Nothing is proved unconditionally below 0\.2/.test(R.verdict)
      && /Not an external review/.test(R.status) && R.grades.every((g) => g.grade !== 'ERROR'),
    why: 'Internal referee; no bound below 0.2 proved; RH open.',
  },
]);

export default R2_SECOND_REFEREE;
