/**
 * @fileoverview s145-requirements-map-2026-09-30 — What a Λ < 0.145 bound requires: which assumptions behind the
 * repo's Λ ≈ 0.145–0.150 floor are fundamental, what the external Raymond preprint (Λ ≤ 0.149396) does differently,
 * the 2021–2026 literature on verified height and Λ upper bounds, and compute pricing for 0.145 / 0.14 / 0.13 / 0.12 / 0.10.
 * Synthesis of four maps (floor audit, Raymond audit, literature, compute pricing) after a judge pass and the two executed
 * picks (s145-raymond-height-contract-2026-09-30.js, s145-zero-conditioned-floor-2026-09-30.js). Only referee-surviving
 * statements are kept; model numbers superseded by the executed picks are marked as superseded.
 *
 * MAIN FINDINGS (grades in brackets):
 *  - The Route VII floor U ≈ 0.145–0.150 (imp-95218 law ln N1* = (2c0 − y)/t + L0) and the ℓ¹/torus ceilings
 *    (barrier-mollifier-length-ceiling-2026-09.js: 0.154–0.156 ℓ¹, 0.1455 any-weight torus) are floors of the FIXED-t0
 *    Polymath15 architecture Λ ≤ t0 + y0²/2 [analysis; law reproduced here]. They are not floors of every method that uses
 *    the Platt–Trudgian height.
 *  - Raymond's decreasing-barrier architecture (Zenodo 22867547) has no lane and no t0 + y0²/2 term; the repo edge
 *    'lambda-raymond-0149396 uses lambda-p15-barrier-criterion' and the 'independent corroboration' reading of the Route VII
 *    band are inaccurate (numerical coincidence, not the same floor) [structural reading of the source].
 *  - Every sub-0.2 claim found (Planat 0.177954, Kornaus 0.172422, Raymond v1 0.163297, Gordon 0.157657, Raymond v2 0.149396)
 *    uses the same PT 3e12 height; the rigorous verified height has not moved since 2020 [literature map, not re-fetched here].
 *  - Measured on Raymond's regenerated chain (executed pick 1): Λ·ln T stays 4.29–4.33 from X to 10X, i.e. the chain behaves
 *    like the Polymath15 §10 heuristic Λ ≈ c/ln T. At current height 0.145 needs c ≈ 4.166 (−3% on Raymond's 4.292).
 *  - Pricing: PT recorded ~7.5e6 core-hours for 3e12 (arXiv:2004.09765 §2). The MAP 4 Platt cost model priced the same run at
 *    6.9e4 CPU-h, ~109× low, so every absolute MAP 4 height price must be rescaled by ~1e2. Rescaled, the P15-architecture
 *    route to 0.145 (height T_h ≈ 4.5e14) costs ~1.3–1.7e9 core-hours; the Raymond-architecture contract (T* = 7.8e12) costs
 *    ~1.3–1.7e7 core-hours, about 100× less [heuristic, scaled from PT's recorded figure].
 *
 * Superseded model numbers (kept for the record): constant-ℓ ODE model 'Raymond class ideal 0.134' / '0.145 needs loss −26%'
 * / '0.145 at X × 3.3, 0.14 at X × 15' — superseded by the measured floor drift (0.145 at 2.58X, 0.14 at 9.0X). Start-condition
 * gains from the model are ~40% too large (judge's exact replay: MTY q0 = 0.975110 gives 0.148103, model 0.1468).
 *
 * Verdict: no bound moves. PT Lambda <= 0.2 stands. The project's Λ ≤ 0.1758354 is an unreviewed computer-assisted candidate
 * (internal composition audit passed 2026-09-28; the user reports a referee check around 0.175). RH open. NO QED.
 * Scratch sources (not in the repo): /tmp/floor-audit/calc{2,3}.py, /tmp/raymond_model/*.py, /tmp/map4probe/*.py, /tmp/pm15.txt,
 * /tmp/pt2004.txt; Raymond deposit tmp/raymond-22867547/.
 * Import-free. ASSERTIONS recompute the Route VII law anchors, the seam N0, the Λ·ln T constants, the MTY start heights, the
 * PT-recorded cost rescaling and the pricing monotonicity.
 */

const X_PT = 6000000185827; // Raymond / Planat X in z-units (x = 2γ); PT ordinate 3.0001753e12
const T_PT = 3.0001753e12;
const C0 = 1.2218525, L0 = 1.1676005; // imp-95218 two-point calibration
const MTY_R = 5.558691; // Mossinghoff–Trudgian–Yang zero-free-region constant

/** Route VII law: rows = N1* − N0 at time t = (2c0 − y)/(ln N1* − L0); U = t + y²/2. */
const route7U = (rows, y, N0 = 690988) => (2 * C0 - y) / (Math.log(rows + N0) - L0) + (y * y) / 2;
const route7N1 = (t, y) => Math.exp((2 * C0 - y) / t + L0);
/** Riemann–von Mangoldt main term N(T) ≈ (T/2π)(ln(T/2π) − 1) (times 2π, used only as a density weight). */
const Nmain = (T) => T * (Math.log(T / (2 * Math.PI)) - 1);
/** Height-extension price scaled from PT's recorded 7.5e6 core-hours by ΔT and average zero density. */
const ptScaledPrice = (T2, T1 = T_PT, ptCoreH = 7.5e6) =>
  (ptCoreH * (Nmain(T2) - Nmain(T1))) / Nmain(T1);
const qMTY = (x) => (1 - 2 / (MTY_R * Math.log(x / 2))) ** 2;

export const S145_REQUIREMENTS_MAP = Object.freeze({
  id: 's145-requirements-map-2026-09-30',
  date: '2026-09-30',
  title: 'Requirements for Λ < 0.145: floor assumptions, the Raymond architecture, literature heights and compute pricing',
  status:
    'SYNTHESIS of four maps + judge pass + two executed picks. Analysis (Route VII law, reproduced), literature reading '
    + '(not re-fetched in this module), heuristic pricing scaled from PT’s recorded compute, and model numbers explicitly marked '
    + 'as superseded where the executed picks measured them. No bound moves. PT Lambda <= 0.2 stands. NO QED.',

  floorAssumptions: Object.freeze([
    { rank: 1, cls: 'M', assumption: 'Fixed-t0 region (iii): H_t0 ≠ 0 on y ∈ [y0, 1] for all x ≥ X, Λ ≤ t0 + y0²/2 (P15 Thm 1.2)',
      effect: 'Raymond’s decreasing barrier at the same X has no lane, no seam torus/ℓ¹ obstruction and no y0²/2 term (0.0136 at y = 0.165). Removing this architecture is what the sub-0.145 contracts use.' },
    { rank: 2, cls: 'M', assumption: 'Source-floor loss L/4 − ℓ in the decreasing-barrier class',
      effect: 'L/4 = ln(N0)/2 = 6.723 at X. Kronecker lower bounds on the cost: one-point is saturated at t = 0 (0.612 vs 0.605); joint slack 0.1–0.3 at later t. Perfect joint cost + re-optimised heights: model 0.1441 (±0.002).' },
    { rank: 3, cls: 'F', assumption: 'Any uniform source floor satisfies inf S ≤ mean S = L/4 + o(1)',
      effect: 'Zero-cost ceiling of the class at X: model 0.1335. Depends on height only through ln X; never reaches 0.' },
    { rank: 4, cls: 'M', assumption: 'Kernel class: one height, nonnegative, symmetric, λ = 2, v ≤ v* = 0.2037 (Raymond Thm 2 optimal only inside it)',
      effect: 'Multi-height / signed kernels: measured ×1.025–1.035 gain, Λ ≈ 0.1474–0.1482 alone (judge). frontier-dag.js “EXHAUSTED” overstates Thm 2.' },
    { rank: 5, cls: 'M', assumption: 'Triangle inequality on the tail (closes at σ_c = 1/2 + c0 = 1.72)',
      effect: 'Law with L0 fixed at the K2 budget: σ_c = 1.6 → 0.130, 1.5 → 0.118 (extrapolation); seam floors (rows 6–7) bind first inside P15.' },
    { rank: 6, cls: 'M', assumption: 'x-uniform coefficient-magnitude certificates at the seam (ℓ¹/Wiener)',
      effect: 'ℓ¹ ceiling 0.154–0.156; any-weight torus obstruction 0.1455 at y0. Below needs sup-evaluation of H_t on [N0, ~1.5e6] ≈ as costly as height to ~1.5e13 (P15 pricing).' },
    { rank: 7, cls: 'M', assumption: 'Row-by-row lane certification and the K2 5.5e7-row budget',
      effect: 'Rows are cheap (measured 7.5–9.8 ms/row Arb single-thread, not the 1.143 s campaign rate); the per-row lemma fails at the seam for every sub-0.145 row (float lbound −1.33 at (0.145, 0.165), −1.83 at the 0.14 Gate-2 row; Arb UNCERT).' },
    { rank: 8, cls: 'M', assumption: 'P1113 mollifier tuned at t = 129/800; MHEAD caps; two-point fit of c0/L0',
      effect: 'Re-optimising per t keeps the (2c0 − y)/t form; the fit has two points with y ∈ [0.165, 0.19] and understates cost at small y.' },
    { rank: 9, cls: 'M', assumption: 'Gate-2 contract (R_strict literal fixed; pilot/ℓ² majorant)',
      effect: 'Certifying |E97| directly moves the sampled t-axis break from ~0.13–0.14 to ~0.10; Theorem U covers only in-algebra diagonal changes.' },
    { rank: 10, cls: 'M', assumption: 'SC3 gate (σ > 1 on the extended hull)',
      effect: 'Non-binding at 0.145 (forces N ≥ 1.39e6); binds below U ≈ 0.1295 where exp(2/U − 2) > N0.' },
    { rank: 11, cls: 'M', assumption: 'Constant-p H_desc / mirror descent',
      effect: 'Dead as stated (ns3-locallev-2026-09-29.js); Raymond’s probe transfer is an unconditional y-dependent-pull analogue.' },
    { rank: 12, cls: 'F', assumption: 'Verified height X (PT 3e12; seam N0 = 690988)',
      effect: 'Measured on Raymond’s regenerated chain: 0.145 at 2.58X (T* ≈ 7.73e12), 0.14 at 9.0X (T* ≈ 2.70e13). P15 architecture: 0.145 needs T_h ≈ 4.5e14 (151× PT, float N_row* measurement).' },
    { rank: 13, cls: 'F', assumption: 'Effective approximation A + B − C (P15 §6; Raymond extends it to −1 ≤ σ ≤ 2)',
      effect: '≈ 0 at this level (AFE tail non-binding per the PT-floor audit).' },
    { rank: 14, cls: 'F', assumption: 'Mean-value / zero-density inputs; heat lift breaks multiplicativity',
      effect: '≈ 0 at this level (MV-CAP; density bounds cannot exclude a single violating zero).' },
    { rank: 15, cls: 'F', assumption: 'Flow-blindness; Λ ≥ 0 (Rodgers–Tao)',
      effect: 'Irrelevant to 0.145; for Λ → 0 every class above needs ln X → ∞ or arithmetic input.' },
  ]),

  raymond: Object.freeze({
    record: 'src/data/lambda-roadmap.js id external-preprint-raymond-0149396; value 18674384228461/125000000000000 = 0.149395073827688',
    architecture: 'Decreasing zero-height barrier from the t = 0 strip (q0 = 1.000002), comparison ODE q′ < −2 − c·q integrated exactly to q_e = 1e-8; finite-head wall |H_t/B_t| > 3/4 at X; 608 time cells × 6 frequency ranges = 3,648 source rectangles; correlated two-probe surplus + Euler multiplier over {2, 3, 5}. No Λ ≤ t0 + y0²/2 barrier; imports P15 Prop 3.1, Thm 3.2, Thm 1.5(i), §6 and PT Thm 1.',
    reproduced: 'Full chain regenerated locally (macOS arm64, CPython 3.13, python-flint 0.8.0): both probe lanes bit-identical to the deposit; exact output 0.149395073827688 (pick 1, confirmed by two referees).',
    reviewed: 'AF §4.1 (P15 re-derivation) checked 2026-09-21; AF §§6–9 and main-paper Lemmas 2–4 self-checked by one reviewer 2026-09-30, no defect found. AF §§2–5 (wall/Abel §3), §§10–12 (§11 first contact), Part II: not re-refereed. Independent adversarial referee: OPEN.',
    substepLimit: 0.149395,
    ladder: Object.freeze([['earlier fixed-time paper', 0.163297], ['one-point', 0.1511], ['sharp continuum kernel', 0.150842], ['both gains', 0.149398], ['128 substeps', 0.149395]]),
    repoCorrections: 'project-attempts-dag.js: the “uses lambda-p15-barrier-criterion” edge is removed and the route7-floor edge note reworded (numerical coincidence, different architecture). frontier-dag.js t0-program-floor note and “kernel/averaging lever EXHAUSTED” wording still to correct (not edited here).',
  }),

  literature: Object.freeze({
    verifiedHeight: 'Platt–Trudgian 2021 (Bull. LMS 53; arXiv:2004.09765): RH to 3,000,175,332,800, the rigorous record; no newer rigorous complete verification found 2021–2026. Gourdon 2004 (10^13 zeros) is non-rigorous; Odlyzko / Bober–Hiary windows are not complete coverage.',
    claims: Object.freeze([
      { value: 0.2, who: 'Platt–Trudgian 2021 (Cor. 2)', grade: 'refereed', arch: 'P15 fixed-t0 barrier' },
      { value: 0.1787854, who: 'this project (v3 package)', grade: 'project candidate; externally reviewed per the History page', arch: 'P15 fixed-t0 barrier' },
      { value: 0.177954, who: 'Planat arXiv:2609.37164 (2026-09-29)', grade: 'unrefereed; imports the project 0.1787854 package', arch: 'collective contraction add-on' },
      { value: 0.1758354, who: 'this project', grade: 'unreviewed candidate; internal composition audit passed 2026-09-28', arch: 'P15 fixed-t0 barrier' },
      { value: 0.172422, who: 'Kornaus Zenodo 22658444', grade: 'unrefereed; not read in depth', arch: 'collision exclusion in P15 framework' },
      { value: 0.163297, who: 'Raymond v1 Zenodo 22626161', grade: 'unrefereed; superseded by v2', arch: 'P15 criterion + intermediate barrier' },
      { value: 0.157657, who: 'Gordon github stefangordon/dbn-upper-bound', grade: 'unrefereed; partial Lean', arch: 'piecewise-affine moving barrier from t = 0' },
      { value: 0.149396, who: 'Raymond v2 Zenodo 22867547', grade: 'unrefereed; chain regenerated here', arch: 'decreasing barrier from t = 0' },
    ]),
    roadmapGap: 'Planat 0.177954, Gordon 0.157657, Kornaus 0.172422 and Raymond v1 0.163297 are not yet rows in lambda-roadmap.js (not edited here).',
    pm15Table1: 'Polymath15 §10 Table 1 (conditional, P15 architecture): Λ ≤ 0.15 needs X = 7e15 + 68886; Λ ≤ 0.14 needs X = 6e16; Λ ≤ 0.1 needs T ≈ 4.5e21. Heuristic: Λ = O(1/log T) without excluding RH violations at height T.',
    heightFreeRoutes: 'No published upper bound below 1/2 without a verified-height input; effective KKL = P15 Thm 1.3 (already used). Zero-density advances (Guth–Maynard, Tao–Trudgian–Yang) bound counts, not a single violating zero. MTY zero-free region shrinks the t = 0 strip to |y| ≤ 1 − 2/(5.558691 ln(x/2)) (0.9875 at x = 6e12).',
    unreliable: 'mathlumen “2026 status report” (claims 2e13 zeros certified and Λ < 1e-12) contradicts the primary sources; do not cite.',
  }),

  pricing: Object.freeze({
    ptRecorded: { coreHours: 7.5e6, height: T_PT, source: 'arXiv:2004.09765v1 §2 (“some 7.5 million core hours on 3.6GHz Intel Xeon”)' },
    map4ModelPtPrice: 6.9e4,
    rowRate: { armGeneralMs: [7.5, 9.8], p3Ms: 0.13, campaignS: 1.143, source: 'tmp/sweep_15830/SWEEP_SUMMARY.txt (measured) vs imp-95218 (campaign)' },
    // P15 architecture, cheapest split = verify RH to T_h, then rows [N_row*, N1*] (float lbound N-scans; N_row* at ≥ 0.13 extrapolated)
    p15Table: Object.freeze([
      { target: 0.145, t0: 0.13139, y0: 0.165, N1: 1.10e8, Nrow: 8.5e6, Th: 4.5e14, map4HeightCpuH: 1.2e7 },
      { target: 0.14, t0: 0.123638, y0: 0.1809, N1: 2.85e8, Nrow: 1.55e7, Th: 1.5e15, map4HeightCpuH: 4.3e7 },
      { target: 0.13, t0: 0.11639, y0: 0.165, N1: 1.02e9, Nrow: 9e7, Th: 5.1e16, map4HeightCpuH: 1.6e9 },
      { target: 0.12, t0: 0.10639, y0: 0.165, N1: 6.4e9, Nrow: 5e8, Th: 1.6e18, map4HeightCpuH: 5.4e10 },
      { target: 0.10, t0: 0.08639, y0: 0.165, N1: 9.2e11, Nrow: 3e10, Th: 6e21, map4HeightCpuH: 2e14 },
    ]),
    raymondArch: Object.freeze([
      { target: 0.145, Tstar: 7.80000000474e12, note: 'no band, certified wall (pick 1 contract a)' },
      { target: 0.145, Tstar: 6.0000000063e12, note: 'MTY band; H1/H2 certificates not built (pick 1 contract b)' },
      { target: 0.14, Tstar: 2.70e13, note: 'no band, interpolated 9.005X, no wall searched' },
    ]),
    note: 'MAP 4 absolute prices are ~1e2 low (its model reprices PT’s own run at 6.9e4 vs the recorded 7.5e6); ratios within MAP 4 survive. The per-row lemma price is not the bill: the height step is.',
  }),

  assessment: Object.freeze([
    'Inside the fixed-t0 P15 architecture the floor at current height is ~0.1455–0.155 (torus / ℓ¹ ceilings); 0.145 there needs verified height ≈ 4.5e14 (≈1.3–1.7e9 core-hours after PT rescaling).',
    'In the decreasing-barrier architecture the regenerated chain reaches 0.14496 at T* = 7.8e12 (2.6× PT), conditional on RH to T* and on Raymond’s unrefereed analytic chain; ≈1.3–1.7e7 core-hours at PT’s recorded rate. This is the most credible path to Λ < 0.145.',
    'At current height, every in-class lever measured (MTY start, joint Kronecker floor, zero-conditioned floor, multi-height kernels) lands at 0.143–0.148 ideal and ≥ 0.1444 model-consistent; below 0.145 at fixed height is not established by any executed measurement.',
    'For RH: Λ·ln T ≈ 4.29–4.33 across 1X–10X on the regenerated chain; compute and kernel engineering move the constant, not the 1/ln T rate. Λ → 0 needs a source floor not bounded by the mean L/4, i.e. arithmetic input excluding an off-line zero locally.',
  ]),

  verdict:
    'Requirements map only. The sub-0.145 route with measured support is the decreasing-barrier architecture plus RH verified to ~7.8e12; it is '
    + 'conditional and unrefereed. PT Lambda <= 0.2 stands; the project Λ ≤ 0.1758354 remains an unreviewed candidate; RH open; NO QED.',
});

const M = S145_REQUIREMENTS_MAP;

export const S145_REQUIREMENTS_MAP_ASSERTIONS = Object.freeze([
  {
    id: 's145-map-route7-law-anchors',
    holds: () => {
      const k2 = 5.5e7;
      const u165 = route7U(k2, 0.165), u059 = route7U(k2, 0.059), pt = route7U(0, 0.187);
      const n145 = route7N1(0.13139, 0.165), n14 = route7N1(0.123638, 0.1809);
      return Math.abs(u165 - 0.15033) < 2e-5 && Math.abs(u059 - 0.14481) < 3e-5 && Math.abs(pt - 0.2013) < 2e-4
        && n145 > 1.0e8 && n145 < 1.2e8 && n14 > 2.7e8 && n14 < 3.0e8
        && Math.abs(M.pricing.p15Table[0].t0 + 0.165 ** 2 / 2 - 0.145) < 1e-4 && Math.abs(M.pricing.p15Table[1].t0 + 0.1809 ** 2 / 2 - 0.14) < 1e-4;
    },
    why: 'Route VII law (c0 = 1.2218525, L0 = 1.1676005, rows = N1* − N0) reproduces U = 0.15033 (y = 0.165) and 0.14481 (y = 0.059) at the K2 5.5e7-row budget, PT’s 0.2013 with zero lane rows, and N1* = 1.1e8 / 2.85e8 for the 0.145 / 0.14 rows.',
  },
  {
    id: 's145-map-seam-and-mty-start',
    holds: () => {
      const N0 = Math.floor(Math.sqrt((X_PT - 4) / (4 * Math.PI)));
      const L4 = Math.log(N0) / 2;
      const ymax = Math.sqrt(qMTY(X_PT));
      return N0 === 690988 && Math.abs(L4 - 6.7229) < 1e-3 && Math.abs(qMTY(X_PT) - 0.97511) < 1e-5 && Math.abs(ymax - 0.9875) < 1e-4;
    },
    why: 'Seam N0 = isqrt((X − 4)/4π) = 690988 at X = 6000000185827; L/4 = ln(N0)/2 = 6.723; the MTY region gives y_max = 0.9875, q = 0.97511 at x = X.',
  },
  {
    id: 's145-map-lambda-log-constants',
    holds: () => {
      const L = Math.log(T_PT), c = (lam) => lam * L;
      return Math.abs(c(0.2) - 5.746) < 1e-3 && Math.abs(c(0.149395073827688) - 4.292) < 1e-3 && Math.abs(c(0.145) - 4.166) < 1e-3
        && Math.abs(c(0.157657) - 4.529) < 1e-3 && (c(0.149395073827688) - c(0.145)) / c(0.149395073827688) > 0.029
        && (c(0.149395073827688) - c(0.145)) / c(0.149395073827688) < 0.03;
    },
    why: 'Λ·ln T at T = 3e12: PT 5.746, Gordon 4.529, Raymond 4.292; 0.145 needs 4.166 (−2.9%). Only the constant is movable at fixed height (P15 §10 heuristic).',
  },
  {
    id: 's145-map-pt-recorded-rescale',
    holds: () => {
      const p = M.pricing, ratio = p.ptRecorded.coreHours / p.map4ModelPtPrice;
      const p15 = ptScaledPrice(p.p15Table[0].Th), ray = ptScaledPrice(p.raymondArch[0].Tstar);
      const map4Consistent = p.p15Table[0].map4HeightCpuH * ratio; // MAP 4 price × calibration ratio
      return ratio > 100 && ratio < 120 && p15 > 1.3e9 && p15 < 1.4e9 && ray > 1.26e7 && ray < 1.28e7
        && map4Consistent > 1.0e9 && map4Consistent < 1.5e9 && p15 / ray > 90 && p15 / ray < 120;
    },
    why: 'PT recorded 7.5e6 core-h; MAP 4’s model gave 6.9e4 (109× low). Scaled from PT: P15 route to 0.145 (T_h = 4.5e14) ≈ 1.34e9 core-h (MAP 4 × 109 ≈ 1.3e9 agrees); Raymond-architecture contract (T* = 7.8e12) ≈ 1.27e7 — about 105× cheaper.',
  },
  {
    id: 's145-map-pricing-monotone',
    holds: () => {
      const t = M.pricing.p15Table;
      const mono = t.every((r, i) => i === 0 || (r.target < t[i - 1].target && r.N1 > t[i - 1].N1 && r.Nrow > t[i - 1].Nrow && r.Th > t[i - 1].Th && r.map4HeightCpuH > t[i - 1].map4HeightCpuH));
      const thFromNrow = t.slice(0, 2).every((r) => Math.abs(2 * Math.PI * r.Nrow ** 2 / r.Th - 1) < 0.1);
      return mono && thFromNrow && M.pricing.raymondArch.every((r) => r.Tstar < t.find((q) => q.target === r.target).Th / 50);
    },
    why: 'P15 pricing is monotone in the target; T_h = 2π·N_row*² for the measured rows; every Raymond-architecture T* is < 1/50 of the P15 height for the same target (0.145: 7.8e12 vs 4.5e14; 0.14: 2.7e13 vs 1.5e15).',
  },
  {
    id: 's145-map-floor-table-classes',
    holds: () => {
      const f = M.floorAssumptions;
      return f.length === 15 && f.every((r, i) => r.rank === i + 1 && (r.cls === 'F' || r.cls === 'M'))
        && f.filter((r) => r.cls === 'F').map((r) => r.rank).join(',') === '3,12,13,14,15';
    },
    why: 'Fifteen ranked assumptions; fundamental (any method using verified height X) = uniform-floor mean ceiling, verified height, effective approximation, mean-value inputs, flow-blindness.',
  },
  {
    id: 's145-map-literature-ordering',
    holds: () => {
      const c = M.literature.claims.map((x) => x.value);
      return c.every((v, i) => i === 0 || v < c[i - 1]) && c[c.length - 1] > 0.145
        && M.literature.claims.filter((x) => /refereed/.test(x.grade) && !/unrefereed/.test(x.grade)).length === 1;
    },
    why: 'Claims listed in decreasing order; none is below 0.145; only PT 0.2 is refereed.',
  },
  {
    id: 's145-map-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(M.verdict) && /NO QED/.test(M.verdict) && /NO QED/.test(M.status)
      && /conditional/.test(M.verdict) && /unrefereed/.test(M.verdict) && /OPEN/.test(M.raymond.reviewed)
      && /RH open/.test(M.verdict) && !/Λ ≤ 0\.14[0-9]* (is|has been) (proved|established)/.test(JSON.stringify(M)),
    why: 'No bound is claimed; the Raymond referee gate is open; RH open.',
  },
]);

export default S145_REQUIREMENTS_MAP;
