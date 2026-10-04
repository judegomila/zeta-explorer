/**
 * @fileoverview s145-raymond-height-contract-2026-09-30 — Executed pick 1: the decreasing-barrier (Raymond, Zenodo 22867547)
 * chain regenerated locally and re-run at larger verified heights, giving a costed contract of the form
 * “Λ ≤ 0.14496 if RH holds to T* = 7.8e12 and Raymond’s analytic chain holds”. Two adversarial referee passes, both minor,
 * not refuted; the second rebuilt the 2.6X output from a fresh unzip of Raymond’s sources, bit-identically.
 *
 * Referee corrections applied (both passes):
 *  - Deliverable status is PARTIAL: numerics of outcome (a) complete, but the G0 referee gate is OPEN (one self-review of AF §§6–9
 *    and main-paper Lemmas 2–4 only; wall/Abel §3, §11 first contact, AF §§2–5 and §§10–12, Part II unreviewed).
 *  - At fixed verified height the chain gives exactly Raymond’s 0.149395073827688: the gain is the known height lever, now
 *    measured inside a lane-free architecture. It is not a new fixed-height lever.
 *  - Contract (b) (MTY band, T* = 6.0e12, 0.1449877, margin 1.2e-5) is heuristic until the H1 strip and H2 far-field certificates
 *    exist and are refereed; contract (a) is the primary contract.
 *  - Reproduction is not independent re-implementation: Raymond’s own code with an env patch for X/N0; any defect in his code or
 *    analysis carries through. The θ0 ∈ (−1.1, −1) sanity pin was removed at the new walls (θ0 = −0.89790, −0.91295); this is
 *    harmless because e^{−iθ/2}(A + e^{iθ}·conj A) = 2 Re(e^{−iθ/2}A) holds for any branch of arg.
 *  - The driver dropped guards from Raymond’s assembler (strict time-zero entry, U < 41/250, h·r < 2, 0 < rate·δ < 1, terminal
 *    in cell); the referee re-checked them at 2.6X (rate 10.51, entry passes, U = 0.14496 < 0.164). For the band, q0 < 1 violates
 *    the entry guard by construction; the MTY strict-entry argument (closed zero-free region ⇒ y² < q_MTY at t = 0, first contact
 *    at positive time) must be written into the band lemma. q_MTY uses float log + 1e-9 pad (not interval).
 *  - The 0.14 figures (T* ≈ 2.70e13 no band, ≈ 2.0e13 band) have no certified wall; the band figure is interpolated.
 *  - RUN.py supplementary checks (DIRECT_192/256, XI_T0, direct paired tests) were not rerun at the new X.
 *
 * PROVED: nothing new. No bound is claimed.
 * CERTIFIED (interval arithmetic, Raymond’s code on a non-pinned runtime): regenerated probes at X bit-identical to the deposit;
 *  finite-head walls (AF eq. 3.1) PASS at x_w = 15600000009475.44 (N = 1114185, 4,456,740 prefix checks per lane, 256 / 384 bit)
 *  and x_w = 12000000012637.7051 (N = 977205, 3,908,820 checks); the step from prefix sums to all 0 ≤ y ≤ 1 is Raymond’s AF §3
 *  Abel argument, not re-refereed. Exact rational comparison outputs (below) are exact given the regenerated floors.
 * CONDITIONAL: contract (a) Λ ≤ 144960215684847/10^15 given (i) RH to T* = 7.80000000474e12, (ii) Raymond’s analytic chain,
 *  (iii) the regenerated floors and wall. Contract (b) Λ ≤ 0.1449877 given additionally the band lemma H1–H3 (unrefereed; H1, H2
 *  certificates not built).
 * MEASURED: floor drift over all 3,648 rectangles negative at every height (cost falls as X grows); exact U(X) at 13 heights.
 * HEURISTIC: pricing from PT’s recorded 7.5e6 core-hours; κ ∈ [1, 1.3] unmeasured; far-field distance d0 ≤ 3.9 (float scan).
 *
 * Verdict: PT Lambda <= 0.2 stands. RH open. NO QED. The project would re-implement this chain in its own pipeline; it does not
 * claim Raymond’s result.
 * Files: tmp/s145-1-g1/{pipeline.py, probe.sh, batch.sh, drift.py, band.py, farfield.py, wall_search.py, out/<tag>/RESULT.json,
 * out/WALLQ_*.json}; referee scripts tmp/s145-1-ref0-raymond/replay.py, tmp/s145-1-ref1-*.py; large probe files in
 * /tmp/s145-1-archive/ (outside the repo tree); runtime /tmp/s145venv.
 * Import-free. ASSERTIONS recompute the rationals, T* and PT ratios, N0 at each height, monotonicity and interpolated
 * crossings of U(X), the MTY band start, the Λ·ln T constant, and the PT-scaled prices.
 */

const X1 = 6000000185827; // Raymond X (z-units)
const T_PT = 3.0001753e12;
const rat = (s) => { const [a, b] = s.split('/').map(Number); return a / (b ?? 1); };
const isqrtN0 = (X) => Math.floor(Math.sqrt((X - 4) / (4 * Math.PI)));
const Nmain = (T) => T * (Math.log(T / (2 * Math.PI)) - 1);
const ptScaledPrice = (T2, kappa = 1) => (7.5e6 * kappa * (Nmain(T2) - Nmain(T_PT))) / Nmain(T_PT);
const qMTY = (x) => (1 - 2 / (5.558691 * Math.log(x / 2))) ** 2;

export const S145_RAYMOND_HEIGHT_CONTRACT = Object.freeze({
  id: 's145-raymond-height-contract-2026-09-30',
  date: '2026-09-30',
  title: 'Decreasing-barrier chain at larger verified height: Λ ≤ 0.14496 conditional on RH to 7.8e12',
  status:
    'CONDITIONAL contract + MEASURED drift + HEURISTIC pricing; PARTIAL deliverable (G0 independent referee of Raymond’s analytic chain OPEN). '
    + 'Two internal referee passes (minor, not refuted; 2.6X output rebuilt bit-identically from fresh sources). No bound is claimed. NO QED.',
  headline:
    'Re-running Raymond’s full chain with floors at X = 15600000009475 gives exact output 0.144960216: Λ ≤ 0.14496 if RH holds to '
    + 'T* = 7.80e12 (2.60× PT) and Raymond’s unrefereed analytic chain holds. Floor cost falls with X in every one of the 3,648 rectangles. '
    + 'At PT height the chain returns exactly Raymond’s 0.149395073827688.',

  reproduction: Object.freeze({
    raymondExact: '18674384228461/125000000000000',
    onePointAtX: 0.150841529745,
    runtime: 'macOS arm64, CPython 3.13, python-flint 0.8.0 (Raymond pins Linux x86_64 CPython 3.13)',
    probesBitIdentical: true,
  }),

  // Exact outputs with Raymond's schedule (PLAN heights fixed), q0 = 1.000002, 128 substeps; joint and one-point.
  heights: Object.freeze([
    { k: 1, X: 6000000185827, N0: 690988, joint: 0.149395073827688 },
    { k: 1.9, joint: 0.146350, onePoint: 0.147755 },
    { k: 2, X: 12000000012637, N0: 977205, joint: 0.146117526666441, onePoint: 0.147518903383958, tag: 'XW2.0 (wall abscissa, no band)' },
    { k: 2.34, joint: 0.145420, onePoint: 0.146808 },
    { k: 2.55, joint: 0.145045, onePoint: 0.146420 },
    { k: 2.6, X: 15600000009475, N0: 1114185, joint: 0.144960215684847, onePoint: 0.146332482680145, tag: 'XW2.6 (certified wall)' },
    { k: 2.62, joint: 0.144927, onePoint: 0.146298 },
    { k: 3.3, joint: 0.143943, onePoint: 0.145287 },
    { k: 5, joint: 0.142252, onePoint: 0.143543 },
    { k: 8.5, joint: 0.140215, onePoint: 0.141449 },
    { k: 9, X: 54000001672443, N0: 2072964, joint: 0.140001929042253, onePoint: 0.141231391546447 },
    { k: 10, X: 60000001858270, N0: 2185096, joint: 0.139614069584015, onePoint: 0.14083273671491 },
  ]),

  contractA: Object.freeze({
    grade: 'conditional (primary contract)',
    U: '144960215684847/1000000000000000',
    wall: '390000000236886/25', // = 15600000009475.44
    wallPrefixChecks: 4456740,
    wallPhysicalFloor: 0.78905,
    hypotheses: Object.freeze([
      'RH verified to ordinate T* = (x_w + 1)/2 = 7.80000000474e12 (NOT verified; PT covers 3.0001753e12)',
      'Raymond’s analytic chain (AF Part I §§2–12, Part II, main paper) — unrefereed; G0 open',
      'regenerated floors at X = 15600000009475 (N0 = 1114185) and the Arb wall at x_w (both lanes PASS)',
    ]),
  }),

  contractB: Object.freeze({
    grade: 'heuristic until H1/H2 certificates exist and the band lemma is refereed',
    U1: 0.144791170, U2: 0.144926933, Utail: '144987737368947/1000000000000000',
    wall: '120000000126377051/10000',
    Xb: 15720000486866, tc: 0.12818359375, B2tc: 0.0405638,
    fails19X: 0.145016,
    hypotheses: Object.freeze([
      'H1: zero-free strip certificate for H_t on [x_s − 2, x_s + 2] × [√B1(t), 1] × [0, t_c] (above verified height; not built)',
      'H2: far-field kernel certificate, (10.1) extended to heights y < b ≤ 1 for spacing d ≥ 4 (float scan d0 = 2.2–3.9; sharp kernel balanced at d^-4, sign at d^-6; not built)',
      'H3: after t_c continue the global barrier from B2(t_c) with floors ℓ(X′)',
      'MTY strict-entry argument replacing Raymond’s q0 > 1 guard (to be written)',
    ]),
    note: 'A band split at a single vertical wall does NOT suffice: a higher band-2 zero within distance 1 can repel the band-1 top zero (pair contraction needs d² > b² − y²).',
  }),

  drift: Object.freeze({
    note: 'cost = L/4 − ℓ with L/4 = ln(N0)/2; joint floors, 598 cells used by the comparison; negative = cheaper at larger X',
    medians: Object.freeze([[2, -0.049], [2.34, -0.059], [3.3, -0.080], [5, -0.104]]),
    worstCellAt234: -0.0008,
    allRectanglesMaxDrift: Object.freeze([[2, -0.00061], [2.34, -0.00073], [2.6, -0.00081]]),
    gate: 0.02,
    perUnitLnX: [-0.071, -0.065],
  }),

  mtyAtPtHeight: Object.freeze({ range: [0.14794, 0.14812], note: 'MTY seed alone at PT height (Xb = 1.5X–100X, cap re-evaluated, kernel re-selected): does not reach 0.145' }),

  pricing: Object.freeze({
    ptCoreHours: 7.5e6,
    kappa: [1, 1.3],
    rows: Object.freeze([
      { what: '0.145 contract (a), ΔT = 4.8e12', T: 7.80000000474e12, reported: [1.27e7, 1.65e7] },
      { what: '0.145 contract (b), ΔT = 3.0e12', T: 6.0000000063e12, reported: [7.9e6, 1.03e7] },
      { what: '0.14 no band', T: 2.70e13, reported: [6.6e7, 8.6e7] },
      { what: '0.14 band (interpolated)', T: 2.0e13, reported: [4.6e7, 6.0e7] },
    ]),
    dollars: 'illustrative $0.02–0.05 per core-hour: 0.145 ≈ $0.25M–0.8M',
  }),

  nextSteps: Object.freeze([
    'Independent adversarial referees: (1) AF §§2–5 incl. the §3 Abel transfer, §§10–12 incl. the §11 first-contact argument, Part II, main paper §§2–6; (2) band lemma H1–H3.',
    'Freeze the contract (a) artifact set (floors at 15600000009475, wall at 15600000009475.44, output 0.144960216) and write a costed RH-extension request for [3.0001753e12, 7.8000000048e12] (≈1.3–1.7e7 core-hours in PT terms).',
    'Hours-of-CPU levers: re-optimise Raymond’s PLAN heights and schedule at X′ (may lower T* below 2.58X); wall search near 5.4e13 for 0.14; Bernstein far-field certificate for (10.1) at b > y, d ≥ 4; restore the dropped assembler guards and rerun RUN.py supplementary checks at the new X.',
  ]),

  verdict:
    'PARTIAL (G0 open). Exact rational replays of Raymond’s regenerated chain give Λ ≤ 0.14496 at T* = 7.80e12 (certified wall, no band) — '
    + 'conditional on RH to T*, which has NOT been verified, and on Raymond’s unrefereed analytic chain. At PT height the output is exactly 0.149395. '
    + 'Band contract 0.14499 at T* = 6.0e12 is heuristic (H1/H2 not built). This is the height lever measured in a lane-free architecture, about 60× '
    + 'less height than the fixed-t0 P15 pricing (T_h ≈ 4.5e14). PT Lambda <= 0.2 stands. RH open. NO QED.',
});

const R = S145_RAYMOND_HEIGHT_CONTRACT;

export const S145_RAYMOND_HEIGHT_CONTRACT_ASSERTIONS = Object.freeze([
  {
    id: 's145-ray-rationals',
    holds: () => {
      const r0 = rat(R.reproduction.raymondExact), a = rat(R.contractA.U), b = rat(R.contractB.Utail);
      return Math.abs(r0 - 0.149395073827688) < 1e-15 && a < 0.145 && Math.abs(a - 0.144960215684847) < 1e-15
        && b < 0.145 && 0.145 - b > 1.2e-5 && 0.145 - b < 1.3e-5 && Math.max(R.contractB.U1, R.contractB.U2, b) === b
        && R.contractB.fails19X > 0.145 && R.heights[2].joint > 0.145;
    },
    why: 'Raymond 18674384228461/1.25e14 = 0.149395073827688; contract (a) 0.144960 < 0.145; band max(U1, U2, U_tail) = U_tail = 0.1449877 (margin 1.23e-5); 1.9X band and 2X no-band fail.',
  },
  {
    id: 's145-ray-tstar-and-pt-ratio',
    holds: () => {
      const xa = rat(R.contractA.wall), xb = rat(R.contractB.wall);
      const Ta = (xa + 1) / 2, Tb = (xb + 1) / 2;
      return Math.abs(xa - 15600000009475.44) < 1e-3 && Math.abs(Ta / 7.80000000474e12 - 1) < 1e-11 && Math.abs(Ta / T_PT - 2.600) < 1e-3
        && Math.abs(Tb / 6.0000000063e12 - 1) < 1e-11 && Math.abs(Tb / T_PT - 2.0) < 2e-4 && xa > R.heights[5].X && xb > R.heights[2].X
        && xa - R.heights[5].X < 1 && xb - R.heights[2].X < 1;
    },
    why: 'T* = (x_w + 1)/2 (Raymond PROOF.md §2, x = 2γ): 7.80000000474e12 = 2.600× PT and 6.0000000063e12 = 2.0× PT; each wall sits within 1 above its floor height.',
  },
  {
    id: 's145-ray-n0-per-height',
    holds: () => R.heights.filter((h) => h.X).every((h) => isqrtN0(h.X) === h.N0) && Math.abs(R.heights[5].X / X1 - 2.6) < 1e-6,
    why: 'N0 = isqrt((X − 4)/4π) = 690988, 977205, 1114185, 2072964, 2185096 at X, 2X, 2.6X, 9X, 10X.',
  },
  {
    id: 's145-ray-u-monotone-and-crossings',
    holds: () => {
      const h = R.heights;
      const mono = h.every((r, i) => i === 0 || (r.k > h[i - 1].k && r.joint < h[i - 1].joint));
      const oneAbove = h.filter((r) => r.onePoint).every((r) => r.onePoint > r.joint);
      const lerp = (a, b, target) => a.k + ((a.joint - target) / (a.joint - b.joint)) * (b.k - a.k);
      const k145 = lerp(h[4], h[6], 0.145), k14 = lerp(h[10], h[11], 0.14);
      return mono && oneAbove && k145 > 2.57 && k145 < 2.58 && k14 > 9.0 && k14 < 9.01 && Math.abs((k14 * X1) / 2 - 2.70e13) < 0.01e13;
    },
    why: 'U(X) strictly decreasing over 12 heights, one-point above joint everywhere; linear interpolation puts 0.145 at 2.577X (T* ≈ 7.73e12) and 0.14 at 9.005X (T* ≈ 2.70e13).',
  },
  {
    id: 's145-ray-lambda-log-constant',
    holds: () => {
      const c = R.heights.map((r) => r.joint * Math.log((r.k * X1) / 2));
      const lo = Math.min(...c), hi = Math.max(...c);
      return lo > 4.29 && hi < 4.34 && (hi - lo) / lo < 0.012 && c[c.length - 1] > c[0];
    },
    why: 'Λ·ln T = 4.292 … 4.333 from X to 10X (spread < 1.2%, drifting slightly up): the chain follows Λ ≈ c/ln T; height moves Λ only logarithmically.',
  },
  {
    id: 's145-ray-mty-band-start',
    holds: () => Math.abs(qMTY(R.contractB.Xb) - 0.97591221044) < 1e-9 && Math.abs(qMTY(X1) - 0.97511) < 1e-5
      && Math.abs(R.contractB.Xb / X1 - 2.62) < 1e-3 && R.mtyAtPtHeight.range[0] > 0.145,
    why: 'q_MTY(x) = (1 − 2/(5.558691 ln(x/2)))² = 0.97591221 at x_s = 1.572e13, 0.97511 at X; the MTY seed alone at PT height stays at 0.1479–0.1481.',
  },
  {
    id: 's145-ray-drift-negative',
    holds: () => R.drift.medians.every(([, m], i, a) => m < 0 && (i === 0 || m < a[i - 1][1])) && R.drift.worstCellAt234 < 0
      && R.drift.allRectanglesMaxDrift.every(([, d]) => d < 0) && R.drift.worstCellAt234 < R.drift.gate,
    why: 'Median drift −0.049 / −0.059 / −0.080 / −0.104 at 2 / 2.34 / 3.3 / 5X; worst cell −0.0008; max over all 3,648 rectangles negative; stop gate (+0.02) not triggered.',
  },
  {
    id: 's145-ray-pricing',
    holds: () => R.pricing.rows.every((r) => {
      const lo = ptScaledPrice(r.T, 1), hi = ptScaledPrice(r.T, 1.3);
      return Math.abs(lo / r.reported[0] - 1) < 0.02 && Math.abs(hi / r.reported[1] - 1) < 0.02;
    }),
    why: 'Price = 7.5e6 core-h × κ × [N(T*) − N(T_PT)]/N(T_PT), N(T) = T(ln(T/2π) − 1): 1.27–1.65e7 (a), 7.9e6–1.03e7 (b), 6.6–8.5e7 and 4.6–6.0e7 (0.14).',
  },
  {
    id: 's145-ray-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict) && /NO QED/.test(R.status)
      && /G0 open/.test(R.verdict) && /NOT been verified/.test(R.verdict) && /heuristic/.test(R.contractB.grade)
      && /OPEN/.test(R.status) && R.contractA.hypotheses.some((h) => /NOT verified/.test(h)) && /exactly/.test(R.headline),
    why: 'Referee corrections: G0 open, height extension not done, band contract heuristic; no bound claimed.',
  },
]);

export default S145_RAYMOND_HEIGHT_CONTRACT;
