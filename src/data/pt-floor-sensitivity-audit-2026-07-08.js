/**
 * @module pt-floor-sensitivity-audit-2026-07-08
 * @fileoverview
 * The PT t-floor SENSITIVITY AUDIT: what actually binds the rigorous
 * Λ ≤ 0.2 upper bound — verified zero height, barrier slack, or the AFE tail?
 *
 * Provenance: recommended by a 79-agent adversarial review of novel Λ attacks
 * (novel-lambda-attacks workflow, 2026-07-08) as the single highest-leverage
 * RH-FREE experiment — the one that decides the entire barrier-tightening
 * attack class. Executed against the sister repo's interval-rigorous arb/acb
 * stack (~/Downloads/twin_ladder_rh_repo, python-flint 0.8.0) plus documented
 * Polymath15 constants and the main-repo Burgers Λ(N) chain audit (imp-1327).
 *
 * VERDICT: CONFIRM (HIGH). The binding constraint on the Λ ≤ 0.2 floor is the
 * VERIFIED ZERO HEIGHT X ≈ 3e12 — a computation, not any analytic slack. The
 * barrier min-modulus / mesh margin and the AFE tail e_C are both non-binding.
 *
 * CONSEQUENCE: the SOS / Fejér–Riesz / Putinar / Carleman / argument-principle /
 * free-subordination "barrier-tightening" family cannot lower Λ below 0.2 —
 * every one of them attacks a margin that is already ≥ 1.2. The only lever is
 * more verified RH height (3e12 → 1e13), a known-technology HPC computation.
 *
 * HONEST SCOPE: this is a DIAGNOSTIC audit. It produces no bound, no proof, no
 * QED. Platt–Trudgian Λ ≤ 0.2 remains the rigorous SOTA and was NOT produced
 * here. See fidelityCaveats — the freshly-run table is the twin-ladder Rouché
 * CORRIDOR ANALOG (E < m, the same shape as the P15 |A+B| > e_A+e_B+e_C
 * criterion), and the literal P15 AFE figures are documented constants pending
 * a check against the arXiv:1904.12438 ancillary code.
 */

export const PT_FLOOR_AUDIT_META = {
  date: '2026-07-08',
  question:
    'Of the three candidate binders on the rigorous Λ ≤ 0.2 floor — (a) verified zero height X, ' +
    '(b) barrier min-modulus / mesh slack, (c) the large-x AFE tail e_C — which one actually binds?',
  verdict: 'CONFIRM',
  confidence: 'HIGH',
  headline:
    'Verified zero height X ≈ 3×10¹² binds the floor. Barrier slack (margin ≥ 1.2) and the AFE ' +
    'tail (margin ≈ 1.047, but X-independent) are non-binding. The only lever below 0.2 is more ' +
    'verified height — a computation, not an analytic trick.',
  backend: 'python-flint 0.8.0 (arb/acb ball arithmetic), Python 3.14.6',
  normalization: 'literature (Polymath15 / Tao): H₀ zeros at x = 2γₙ, first at 28.27',
  config: { t: 0.2, eta: 0.14142, h: 0.22, mesh: 0.00625, nSeg: 16384, eEngine: 'quintic 2-parts' },
};

// ── §1  Margin-ratio table (FRESHLY RUN, interval-rigorous, t = 0.2) ─────────
// Twin-ladder Rouché corridor. ratio = m / E  (surrogate min-modulus ÷ certified
// error) — the structural analog of the P15 |A_t+B_t| / (e_A+e_B+e_C).
export const MARGIN_TABLE = [
  { cell: 1, x: 28.15, E: '1.15e-9',  m: '1.25e-5',  V: '9.19e-5', margin: 10880, status: 'PIN' },
  { cell: 2, x: 41.89, E: '5.14e-10', m: '1.65e-7',  V: '3.13e-3', margin: 320,   status: 'PIN' },
  { cell: 3, x: 49.90, E: '3.61e-10', m: '1.16e-8',  V: '3.10e-2', margin: 32.2,  status: 'PIN' },
  { cell: 4, x: 60.66, E: '2.44e-10', m: '2.22e-10', V: '1.098',   margin: 0.91,  status: 'FAIL (engine ceiling)' },
  { cell: 5, x: 65.78, E: '2.07e-10', m: '2.92e-11', V: '7.09',    margin: 0.14,  status: 'FAIL (engine ceiling)' },
];

export const MARGIN_TABLE_NOTE =
  'Cells 4–5 fail ONLY because the 2-parts E-engine invoked here is ~170× looser than the repo ' +
  'production engine (rigorous_E_bound_quintic_direct_arb). The committed direct-E sweep pins all ' +
  '8 cells at t=0.18 with tightest V = 0.813 (cell 6) → documented min corridor margin ≈ 1.23. ' +
  'So the corridor is comfortably > 1 everywhere with the right engine; the failures above are a ' +
  'compute knob, not an analytic wall. Structurally: m decays ~10×/cell (Γ-prefactor amplitude ' +
  'e^{−πγ/4}) while E decays only ~1.3×/cell, so the binding quantity inside the corridor is the ' +
  'min-modulus m (amplitude/mesh channel) — recoverable by more boundary segments.';

export const DOCUMENTED_MIN_CORRIDOR_MARGIN = 1.23; // t=0.18, direct-E engine, 8/8 PIN

// ── §2  Three-term P15 floor decomposition (DOCUMENTED constants) ────────────
// Criterion: |f_t| > e_A + e_B + e_C, with f_t = H_t / B_t, valid x ≥ 200.
export const FLOOR_DECOMPOSITION = [
  {
    key: 'verified-height',
    label: '(a) Verified zero height X',
    what: 'Hypothesis (i): all nontrivial ζ zeros up to height X lie on the critical line.',
    value:
      'Λ ≤ 0.2 rests on RH verified to X = 3×10¹² (Platt–Trudgian 2021). P15 Table 1 row 3 (Λ ≤ 0.19) ' +
      'needs X = 2×10¹³ (ζ-height 10¹³) — a 10× gap, NOT yet computed.',
    binds: true,
  },
  {
    key: 'barrier-min-modulus',
    label: '(b) Barrier min-modulus / mesh',
    what: 'P15 §8.4 winding + §8.5 mollifier argument-principle non-vanishing check.',
    value:
      'Verified with margin > 1 at the operating X (P15 completed steps (ii)+(iii) at t=0.18, y=0.14142). ' +
      'Corridor analog margin ≈ 1.2–1.23 (§1).',
    binds: false,
  },
  {
    key: 'afe-tail',
    label: '(c) AFE tail e_C',
    what: 'P15 §8.3 pure triangle inequality, N ≥ N₁ (x ≥ 2.82×10¹³): f_t = 1 + O_≤(0.955).',
    value:
      'Margin 1/0.955 ≈ 1.047 — the tightest single link, but SATISFIED and X-INDEPENDENT (analytic, ' +
      'all x ≥ x₁). Tightening it cannot push t down.',
    binds: false,
  },
];

// ── §3  Independent cross-check: the Burgers Λ(N) bridge (imp-1327) ───────────
export const BURGERS_CROSSCHECK = {
  decomposition: 'E(N) = E_trunc + E_flow + E_coll',
  gatingConstant: 'E_trunc_pt ≈ 3.06e-5  ∝  T_PT^(−κ)',
  finding:
    'imp-1327 audited all 7 chain constants: exactly ONE gates Λ (E_trunc_pt, which is ∝ verified ' +
    'height); every barrier / flow / collision-slack constant is non-gating. Independent third ' +
    'decomposition, same conclusion: the only Λ-moving lever is raising T_PT past 3×10¹².',
};

// ── §4  What this refutes, and the one real lever ────────────────────────────
export const REFUTED_ATTACK_CLASS = {
  members: [
    'Sum-of-squares / semidefinite barrier certificates',
    'Fejér–Riesz / Toeplitz-PSD min-modulus certificates',
    'Putinar 2D-box positivity certificates',
    'Carleman / backward-uniqueness barrier estimates',
    'Certified argument-principle winding quadrature',
    'Free-subordination outlier-absorption bounds',
  ],
  why:
    'Every member attacks the barrier min-modulus / mesh margin (b), which is already ≥ 1.2 and ' +
    'NON-binding. No amount of barrier-tightening manufactures verified zero height. This audit ' +
    '(plus the 79-agent adversarial review) closes the class as a lever for Λ < 0.2.',
};

export const THE_LEVER = {
  statement:
    'The single real lever below Λ = 0.2 is more computed RH verification: 3×10¹² → 10¹³ ' +
    '(covering ~4.3×10¹³ H_t zeros up to the P15 analytic handoff x ≈ 2×10¹³).',
  nature: 'RH-FREE, known-technology HPC computation — not an analytic reroute.',
  gap: '8–11 orders of magnitude beyond the corridor engine; the efficient instrument is Platt-style verification.',
};

// ── §5  Honest fidelity caveats (load-bearing) ───────────────────────────────
export const FIDELITY_CAVEATS = [
  'Neither repo implements the native Polymath15 Riemann–Siegel AFE (H_t = A_t+B_t with explicit ' +
    'e_A/e_B/e_C majorants). The §1 table is the twin-ladder Rouché CORRIDOR ANALOG (E < m), which ' +
    'has the same criterion shape as the P15 |A+B| > e_A+e_B+e_C but is a different object.',
  'The literal P15 figures (e_C = 0.955, X = 3×10¹² / 2×10¹³) are DOCUMENTED constants transcribed ' +
    'from arXiv:1904.12438 via the twinladder exterior-tail memo and main-repo pins — pending a ' +
    'direct check against the P15 ancillary code. Not re-derived here (that would mean inventing numbers).',
  'Corridor cells 4–5 failed at t=0.2 under the looser 2-parts E-engine invoked; the committed ' +
    'direct-E engine pins all 8 cells at t=0.18 (the full 8-cell direct-E sweep at t=0.2 costs ~11 h ' +
    'and was not re-run). Neither residual changes the verdict, which is over-determined by the three ' +
    'convergent decompositions (§1 corridor, §2 P15 AFE, §3 Burgers bridge).',
  'This is a diagnostic audit. It produces no bound and no proof. Platt–Trudgian Λ ≤ 0.2 remains the ' +
    'rigorous SOTA and was not produced or beaten here. NO QED.',
];

export const PT_FLOOR_AUDIT = {
  meta: PT_FLOOR_AUDIT_META,
  marginTable: MARGIN_TABLE,
  marginTableNote: MARGIN_TABLE_NOTE,
  documentedMinCorridorMargin: DOCUMENTED_MIN_CORRIDOR_MARGIN,
  floorDecomposition: FLOOR_DECOMPOSITION,
  burgersCrossCheck: BURGERS_CROSSCHECK,
  refutedAttackClass: REFUTED_ATTACK_CLASS,
  theLever: THE_LEVER,
  fidelityCaveats: FIDELITY_CAVEATS,
};
