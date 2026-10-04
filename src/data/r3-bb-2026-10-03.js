/**
 * @fileoverview r3-bb-2026-10-03 — band barriers BB1/BB2 of Lemma B, written as Theorem BB (single-cell first contact, Raymond AF §11
 * transplanted), Lemma C (rate at a contact; Near/Far partition) and Lemma H2 (analytic far field for b ≤ 1, both directions), in
 * formalization/paper/lemma-B-two-band.md §6.1–§6.2; exact replays of all seven band runs (tmp/r3-bb-replay.py, 0 failures).
 * One adversarial internal referee pass (tmp/r3-ref-bb-*, independent loaders, option generator and arb enclosures): CONFIRMED, minor.
 *
 * Referee corrections applied (also written into lemma-B-two-band.md in this synthesis):
 *  - §6.1.3 kernel count: 7 catalogue kernels with λ < 2 (N = 3), 6 with λ = 2 (N = 5); the script chose N per kernel, certificate unaffected.
 *  - Theorem B step 3 is used in every case (band 1 must be real at T = U1), not only "when U2 > U1".
 *  - Remark 6.1.6.2: band-1 far zeros lie right of the contact, their mirrors left; harmless (G even in d).
 *  - (BB2) does not need (RH-head): head zeros are > x_R − x_f ≈ 5.6e12 away and Lemma H2 covers any b ≤ 1.
 *  - The 0.0023 time-box allowance inside Route P's floors is measured (4 cells), not certified; it is part of (F).
 *  - /tmp/rhvenv has no python-flint; the working environment is /tmp/s145venv (python-flint 0.8.0).
 *
 * PROVED (written; one internal adversarial referee pass, no external reader): Theorem BB, Lemma C, Lemma H2, Remark 6.1.6.1 (no joint
 *  first contact needed), Theorem B′ (chained form) as an implication.
 * CERTIFIED: E1–E8 on every step of 7 band runs (≈520,000 steps), reproduced by independent code with arb end-value enclosures; window
 *  containment of all 325 used sharp windows; Lemma H2 inequality for 24 kernels (exact rationals; referee interval boxes min ratio 1118);
 *  near-field kernels (K) 13 + 10 re-certified by an independent Bernstein implementation.
 * CONDITIONAL: (F) source floors (G0, Track A, multi-height consumer; Route P also WOL-C), (RH-win), (RH-head) for band 1, (W).
 * Verdict: see `verdict`. Import-free. ASSERTIONS recompute the far-field d^-4 coefficient at D_W = 7252 for the tightest catalogue kernel
 *  (G > 0), the leading-coefficient margins, the band-1 start margin q0 − q_MTY(x_L), the kernel counts, the band values and the
 *  hypothesis bookkeeping (BB2 without RH-head).
 */

const rat = (s) => { const [a, b] = String(s).split('/').map(Number); return a / (b ?? 1); };
const K = (y, d, b) => (2 * y * (d * d + y * y - b * b)) / ((d * d + (y - b) ** 2) * (d * d + (y + b) ** 2));
const qMTY = (x) => (1 - 2 / (5.558691 * Math.log(x / 2))) ** 2;

export const R3_BB = Object.freeze({
  id: 'r3-bb-2026-10-03',
  date: '2026-10-03',
  title: 'Band barriers BB1/BB2 proved as Theorem BB (written, one internal referee pass); seven band runs replayed exactly',
  status: 'PROVED as written implications, CONFIRMED by one internal adversarial referee pass (minor corrections); no external referee. NO QED.',
  doc: 'formalization/paper/lemma-B-two-band.md §6.1–§6.2',

  pieces: Object.freeze([
    { id: 'Theorem BB', grade: 'CONFIRMED (written proof, one internal referee pass)', what: 'first-contact argument on one cell: lsc barrier from upward q_k, start (MTY / q0 > 1), compactness, multiple contact via P15 Prop 3.1(ii), simple contact via Lemma C' },
    { id: 'Lemma C', grade: 'CONFIRMED', what: 'Q′ = −2 − 4Y*Σ′K_{Y*} at a simple highest zero; Near (|b| ≤ Y*, kernel inequality K) / Far (other band, |d| > 7252.2056, b < 1, Lemma H2)' },
    { id: 'Lemma H2', grade: 'CONFIRMED', what: 'analytic far field for 24 kernels, h ∈ [1/2, 5/2], 0 ≤ b ≤ 1, |d| ≥ 7252 (≥ 1639 suffices for every kernel)' },
    { id: 'Remark 6.1.6.1', grade: 'CONFIRMED', what: 'BB1 does not use BB2 nor the reverse; no joint first contact needed' },
    { id: 'Theorem B′', grade: 'CONFIRMED as an implication', what: 'chained several-band form (1.6X three-band value 0.144951726247781; needs 1.65X walls/window and RH to 4.80e12)' },
  ]),
  hypotheses: Object.freeze({
    BB1: ['W', 'S', 'RH-head', 'RH-win', 'F', 'K', 'E1-E8', 'MTY'],
    BB2: ['W', 'S', 'RH-win', 'F', 'K', 'E1-E8', 'P15-1.5'],
  }),
  runs: Object.freeze([
    { id: 'routeP', U: '1448843462793/10000000000000', steps: 74181, band: 1 },
    { id: 'U2', U: '36063660805739/250000000000000', steps: 73859, band: 2 },
    { id: 'X170', U: 0.144867568901016, band: 1 },
    { id: 'PTMH', U: 0.147273668782792, band: 1 },
    { id: 'H160', U: 0.144974387559643, band: 1 },
    { id: 'H160b165', U: 0.144951726247781, band: 1 },
    { id: 'X165mid', U: 0.144912451862679, band: 1 },
  ]),
  kernels: Object.freeze({ catalogueLambdaLt2: 7, catalogueLambda2: 6, twoHeight: 10, sharp: 1 }),
  h2: Object.freeze({ DW: 7252, minDist: 1639, leadTailGlobal: 19.62, leadTailBoxes: 1118, tailTightness: 0.9999987, tightKernel: { r: 113 / 200, lambda: 2, rho: 1 / 5 } }),
  margins: Object.freeze({ lambdaLt2: 1 / 50, cat2: 93 / 40000, mh4: 0.0406, sharpMu5HalfH: 0.3357, windowLower: 2.2494e-3, windowSlackRaw: 1.3e-20 }),
  start: Object.freeze({ xL: 15600000002223.2344, q0band1: '195181606067939/200000000000000', q0band2: 1.000002000001, gap: 2.00000000052e-6 }),

  verdict:
    'BB1 and BB2 are proved as written implications (Theorem BB, Lemma C, Lemma H2) for every band run in use, including Route P band 1 '
    + '(0.1448843462793) and U2 (0.144254643222956), and confirmed by one internal adversarial referee pass. (BB2) needs (RH-win) but not (RH-head). '
    + 'They are no longer open inputs of Lemma B; the band values stay conditional on the source floors (F) (G0, Track A, consumer; Route P also '
    + 'WOL-C), the FLINT window, the walls and, for band 1, RH below the head wall. Nothing below 0.2 is proved. PT Lambda <= 0.2 stands. RH open. NO QED.',
  nextStep: 'External referee for §6.1–§6.2; copy /tmp/b145-A-archive, /tmp/b145-B-archive, /tmp/raymond_pr into a persistent hashed store so the replays stay reproducible.',
});

const B = R3_BB;

export const R3_BB_ASSERTIONS = Object.freeze([
  {
    id: 'r3-bb-h2-tight-kernel',
    holds: () => {
      const { r } = B.h2.tightKernel, d = B.h2.DW;
      return [0.5, 2.5].every((h) => [0, 0.5, 1].every((b) => {
        const a = r * h, y = h / 5, g = 2 * K(y, d, b) - (2 * y / h) * (K(h, d - a, b) + K(h, d + a, b)) / 2;
        const mu3 = 4 * (h * h - y * y - 3 * a * a);
        return g > 0 && mu3 > 0 && Math.abs((g * d ** 4) / y / mu3 - 1) < 1e-3;
      }));
    },
    why: 'At D_W = 7252 and the tightest catalogue kernel (r = 113/200, λ = 2, ρ = 1/5), G·d⁴/y matches μ3 = 4(h² − y² − 3a²) with no b-dependence (b ≤ 1 > y allowed) and G > 0.',
  },
  {
    id: 'r3-bb-lead-margins',
    holds: () => {
      const { r, rho } = B.h2.tightKernel;
      return Math.abs(1 - 3 * r * r - rho * rho - B.margins.cat2) < 1e-15 && 4 - 2 * 1.99 >= B.margins.lambdaLt2 - 1e-15
        && (16 / 9) * (0.25 - 0) * (1 - 0) > B.margins.sharpMu5HalfH && B.h2.leadTailGlobal > 1 && B.h2.minDist < B.h2.DW;
    },
    why: 'Leading coefficients positive: 1 − 3r² − ρ² = 93/40000 at the tightest catalogue kernel, 4 − 2λ ≥ 1/50; the minimal distance 1639 is below D_W.',
  },
  {
    id: 'r3-bb-start-margin',
    holds: () => {
      const g = rat(B.start.q0band1) - qMTY(B.start.xL);
      return Math.abs(g - B.start.gap) < 1e-11 && g > 1.99e-6 && B.start.q0band2 - 1 > 1.99e-6;
    },
    why: 'Band-1 start q0 exceeds q_MTY(x_L) by 2.0e-6 (live float check of the arb value); band 2 starts at 1 + 2.0e-6.',
  },
  {
    id: 'r3-bb-kernel-count-corrected',
    holds: () => { const k = B.kernels; return k.catalogueLambdaLt2 + k.catalogueLambda2 === 13 && 13 + k.twoHeight + k.sharp === 24; },
    why: 'Referee correction: 7 + 6 catalogue kernels (not 8 + 5); 24 kernels covered by Lemma H2.',
  },
  {
    id: 'r3-bb-runs',
    holds: () => {
      const v = (x) => (typeof x === 'string' ? rat(x) : x);
      const rp = B.runs.find((x) => x.id === 'routeP'), u2 = B.runs.find((x) => x.id === 'U2');
      return B.runs.length === 7 && Math.abs(v(rp.U) - 0.1448843462793) < 1e-15 && Math.abs(v(u2.U) - 0.144254643222956) < 1e-15
        && B.runs.filter((x) => x.band === 1).every((x) => v(x.U) > v(u2.U));
    },
    why: 'Seven runs replayed exactly; every band-1 value exceeds U2, so Theorem B uses band-2 persistence on the half-infinite cell.',
  },
  {
    id: 'r3-bb-hypotheses',
    holds: () => B.hypotheses.BB1.includes('RH-head') && !B.hypotheses.BB2.includes('RH-head') && B.hypotheses.BB2.includes('RH-win')
      && B.pieces.every((p) => /CONFIRMED/.test(p.grade)),
    why: 'Referee correction: BB2 rests on (RH-win), not (RH-head).',
  },
  {
    id: 'r3-bb-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(B.verdict) && /NO QED/.test(B.verdict) && /no external referee/.test(B.status),
    why: 'Internal referee only; no bound below 0.2 proved.',
  },
]);

export default R3_BB;
