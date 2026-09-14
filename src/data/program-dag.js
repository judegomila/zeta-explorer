/**
 * program-dag — the complete retrospective graph of the freeze/permutation-
 * calculus program: every attempt, result, merge and pivot, with its outcome
 * and grade verbatim from the source module or ledger. Rendered by
 * /program-dag.
 *
 * GRADE: documentation only. Import-light; no heavy bundle; no new
 * computation. Every node restates a verdict already recorded in the named
 * source module, page, or ledger; nothing here promotes a bound; NO QED.
 * The live open-object graph is /frontier-dag; the historical insight DAG
 * is /rh-dag. This page is the program history: wins, refutations, merges
 * and pivots in one place.
 *
 * Sources: formalization/ARISTOTLE_TARGETS.md (master ledger, read end to
 * end), PermutationArchitecturePage (atlas family table), imp-95006/95007/
 * 95009/95010 (family pilots + gate ranking), imp-95012/95013/95013b
 * (frozen spec + Lane-A block), imp-95205 (G3 pilot), imp-95049/95210/
 * 95213/95214/95238/95245 (certification chain), imp-95203 (cutoff-tensor
 * scan), imp-95201/95206/95202/95207 (0.1399 lane + collar), imp-95208/
 * 95212/95140 (y-thaw), imp-95031/95045/95153/95169/95170/95171 (weld
 * ladder), imp-95217 (inertia-PCC), imp-95218 (Route VII), imp-95204
 * (graph-compression merge), frozen-rung/l2_detection_modulus (Aristotle
 * waves).
 */

// outcome: 'won' | 'ruled-out' | 'merged' | 'pivoted' | 'open' | 'in-progress'
// `grade` is the honest verbatim grade/verdict text and is authoritative.
export const NODES = [
  // ── phase 0 · architecture & no-gos (2026-07-31 → 08-14) ────────────────
  {
    id: 'frozen-rung-prop',
    name: 'Frozen-rung ⟺ PT proposition + 13pp proof',
    outcome: 'won',
    grade: 'inertia half prose-proof (unconditional); rigorous 13pp proof PDF linked on page; converse left conditional',
    date: '2026-07-31',
    route: '/frozen-rung-pt-equivalence',
    source: 'commits 06e21f6a3 / 164db7e5f',
  },
  {
    id: 'flow-blindness',
    name: 'Flow-blindness no-go (SL2) + T3⟺strip dictionary',
    outcome: 'won',
    grade: 'no-go theorem class: no soft hypothesis proves RH (Λ≥0 needs arithmetic input); T3 = zero-free-strip dictionary verified to 1e-30',
    date: '2026-08-14',
    route: '/flow-blindness-no-go',
    source: 'commit 340b69d45 / SL0-SL2',
  },

  // ── phase 1 · the permutation atlas families (2026-08-27 → 08-28) ───────
  {
    id: 'fam-isometric',
    name: 'Isometric families: 25! orders / fiber forms / DFT',
    outcome: 'ruled-out',
    grade: 'no-gain (atlas family table): all 25! prime orders = conditioning only; divisor/25-defect/five-shell/Heat–Euler fiber forms = alternative coordinates, budgets cannot be added; DFT/chirp/block isometries transport the remainder exactly, center still open',
    date: '2026-08-27',
    route: '/permutation-architecture',
    source: 'permutation atlas §6/§9',
  },
  {
    id: 'fam-bicomplex-twistor',
    name: 'Bicomplex sectors + unitary twistor rotations',
    outcome: 'ruled-out',
    grade: 'no improvement (atlas family table, both rows): maximum sector residual / spectrum and residual norm unchanged — provably no-gain',
    date: '2026-08-27',
    route: '/permutation-architecture',
    source: 'permutation atlas family table',
  },
  {
    id: 'fam-early-moduli',
    name: 'Early componentwise moduli',
    outcome: 'ruled-out',
    grade: 'FORBIDDEN when correlation is needed — no recoverable complex sum (atlas family table)',
    date: '2026-08-27',
    route: '/permutation-architecture',
    source: 'permutation atlas family table',
  },
  {
    id: 'fam-graph-compression',
    name: 'Graph compressions (§6.2 correlated isometry)',
    outcome: 'merged',
    grade: 'POSSIBLE GAIN (atlas) → imp-95009 named obstruction on a finite-rank model (characteristic invariance pins U to the intertwiner class, κ=1, no gain) → imp-95204: lever pinned shut at every admissible eq-43 slot, its one live residue already banked inside the weld ladder',
    date: '2026-09-07',
    route: '/permutation-architecture',
    source: 'imp-95009 / imp-95204',
  },
  {
    id: 'fam-moving-rouche',
    name: 'Moving-reference Rouché gluing',
    outcome: 'ruled-out',
    grade: 'pilot negative (imp-95010): the chart cover is VALID (winding-0 glues chart-by-chart) but does NOT relax the budget — analytic-carrier redundancy; budget gain −5.3e-3, reserve not opened',
    date: '2026-08-28',
    route: null,
    source: 'imp-95010',
  },
  {
    id: 'majorant-obstruction',
    name: 'Shell-decoupled stationary-phase majorant',
    outcome: 'ruled-out',
    grade: 'rigorous obstruction (imp-95006): a shell-decoupled envelope majorant reproduces the raw-tiling divergence and cannot fit the 0.0655627 reserve — a uniform enclosure must retain correlated phase across shells',
    date: '2026-08-28',
    route: '/permutation-architecture',
    source: 'imp-95006',
  },
  {
    id: 'gate-ranking',
    name: 'Gate ranking (imp-95007)',
    outcome: 'won',
    grade: 'assessment: Gate 2 (the 18-moment carrier) ranked most promotable on two falsifiable premises; Gates 3–5 (physical-bulk / cubic-canonical) ranked weak',
    date: '2026-08-28',
    route: null,
    source: 'imp-95007 / imp-95011',
  },

  // ── phase 2 · the Gate-2 probe chain (2026-09-02 → 09-09) ───────────────
  {
    id: 'gate2-frozen-spec',
    name: 'Gate-2 frozen spec (eqs 8–20)',
    outcome: 'won',
    grade: 'spec frozen; eq (17)–(20) constants re-derived from closed forms BigInt-exact (imp-95050), target 0.27968819555261474 < Rex verified',
    date: '2026-09-02',
    route: null,
    source: 'imp-95012 / imp-95050',
  },
  {
    id: 'lane-a-blocked',
    name: 'Lane-A anchor gate: BLOCKED-ON-SPEC',
    outcome: 'pivoted',
    grade: 'HONEST STATUS: BLOCKED-ON-SPEC — the hard gate |E97|(N=690988) = 0.2141254901198318 is unreplayable from in-repo sources (anchor provenance gap); no surrogate substitution',
    date: '2026-09-02',
    route: null,
    source: 'imp-95013 / imp-95013b',
  },
  {
    id: 'archive-hunt',
    name: 'Companion-archive recovery hunt',
    outcome: 'ruled-out',
    grade: 'exhaustive machine hunt (SHA-256 digests, Spotlight, releases): the reference-[19] companion archive was NEVER DOWNLOADED to this machine; recovery needs the originating session re-export',
    date: '2026-09-09',
    route: null,
    source: 'ARISTOTLE_TARGETS.md archive recovery',
  },
  {
    id: 'archive-free-pivot',
    name: 'Archive-free G1/G3 pivot (paper §12.1)',
    outcome: 'pivoted',
    grade: 'the paper’s own stop/go program needs no anchor literal: G1 source-closed 25-term evaluator verified against the telescope (~1e-14) + G3 “prove the complete N=690988 window first”',
    date: '2026-09-09',
    route: null,
    source: 'ARISTOTLE_TARGETS.md / imp-95205',
  },
  {
    id: 'g3-pilot',
    name: 'G3 first-window pilot',
    outcome: 'won',
    grade: 'VERDICT (a) — stronger pilot PASSES on the complete N=690988 window: sup Σ|D_j| margin 12.8%, sup |E97| margin 30.8%; telescope 8e-14 over 612,290 dd evals + mpmath audit to 1e-79; sampled sup, not continuum',
    date: '2026-09-09',
    route: null,
    source: 'imp-95205',
  },

  // ── phase 3 · the certification chain (2026-09-02 → in progress) ────────
  {
    id: 'raw-tiling',
    name: 'Raw pointwise tiling (7.2e26 cells / 1.6e5 CPU-days)',
    outcome: 'ruled-out',
    grade: 'family-wide raw tiling > 7.2e26 cells (cross-checked, imp-95049); the direct 128-bit interval certifier needs ~1.115e10 cells ≈ 1.6e5 CPU-days for window 1 alone — excluded',
    date: '2026-09-02',
    route: null,
    source: 'imp-95049 / imp-95210 pricing',
  },
  {
    id: 'envelope-pivot',
    name: 'Envelope-scale subdivision pivot',
    outcome: 'ruled-out',
    grade: 'REFUTED (measured, refutation-grade, imp-95210): two independent obstructions — slack-level and rigor-level — with a witnessed envelope-decomposition counterexample; no certification run launched because it could not pass regardless of cell count',
    date: '2026-09-10',
    route: null,
    source: 'imp-95210',
  },
  {
    id: 'tier1-certifier',
    name: 'Tier-P/B/S certifier (level 1)',
    outcome: 'won',
    grade: 'BUILD + PRICE + SMALL-SLICE VALIDATION: Taylor-panel tier certifier built; full window priced 378.2 CPU-days; the first continuum-certified slice of the program; full-window run NOT launched',
    date: '2026-09-10',
    route: null,
    source: 'imp-95213',
  },
  {
    id: 'tier2-chirp',
    name: 'Tier-2 frequency-bin/chirp level',
    outcome: 'won',
    grade: 'measured 17.9× speedup over level 1: window-1 certificate repriced 378 → 21.1 CPU-days; derivation + validation in Arb with exact Lagrange remainders',
    date: '2026-09-11',
    route: null,
    source: 'imp-95214',
  },
  {
    id: 'window1-run',
    name: 'Window-1 continuum certificate run',
    outcome: 'in-progress',
    grade: 'hardest slice certified (800 of 1,381,977 q-units, 0.058%, 0 failures); full-window run a deferred separate decision; window 1 is 1 of 54,109,012 Gate-2 windows',
    date: '2026-09-11',
    route: '/viz-imp95278-window1-coverage-bar',
    source: 'imp-95238 / imp-95245 / imp-95278',
  },

  // ── phase 4 · freeze-tuple levers (2026-09-07) ──────────────────────────
  {
    id: 'cutoff-tensor',
    name: 'Cutoff-tensor scan (is P = 97 optimal?)',
    outcome: 'ruled-out',
    grade: 'recommendation KEEP-P97-FROZEN: no P in {79, 83, 89, 101, 107} beats 97 on reserve-per-difficulty; first-order reserve invariant under recuts; the local objective is flat, material-improvement bar not met',
    date: '2026-09-07',
    route: null,
    source: 'imp-95203',
  },
  {
    id: 'gu-word-composition',
    name: 'G_U inside the eq-43 barrier word',
    outcome: 'merged',
    grade: 'assessment: the composed graph-compression lever is pinned shut at every admissible slot; its one live residue is already banked inside the weld ladder (merge verified against LEMMA WD / THEOREM WP)',
    date: '2026-09-07',
    route: null,
    source: 'imp-95204',
  },

  // ── phase 5 · the weld ladder (2026-09-02 → 09-09) ──────────────────────
  {
    id: 'weld-gap-41x',
    name: 'Far-bracket gap measured at 41.3×',
    outcome: 'won',
    grade: 'measurement (fifteenth continuation): witness floor pinned on both axes (joint re-optimization moves it +0.27% only); far-bracket gap ≈ 41.345× at θ=10',
    date: '2026-09-02',
    route: null,
    source: 'imp-95031',
  },
  {
    id: 'weld-gap-281x',
    name: 'Gap attributed and cut to 2.81×',
    outcome: 'won',
    grade: 'gap = 2.8088338309749887 = (parity AM-GM 2.0) × (residual 1.4044) after the nineteenth-continuation exact closed form (Lemma PF partial fractions); tail truncation contributes exactly 1.000×',
    date: '2026-09-02',
    route: null,
    source: 'imp-95045 / imp-95008 chain',
  },
  {
    id: 'weld-vx',
    name: 'THEOREM VX final-strip closure at 0.235',
    outcome: 'won',
    grade: 'middle-heavy quadruple-block ladder-floor step certified at 47/200 = 0.235 via an 872M-cell branch-and-bound; caveat (referee): rests on one baked offline run with worst margin 1.66e-12 ~ the float-guard scale',
    date: '2026-09-06',
    route: null,
    source: 'imp-95153',
  },
  {
    id: 'weld-wd-dissolution',
    name: 'LEMMA WD copositive weld dissolution',
    outcome: 'won',
    grade: 'RIGOROUS: mass ratios eliminated EXACTLY (12-D cover collapses to 9-D); sup over all nonnegative profiles of λ_max(M) < 1 ⟺ H = 2D − G strictly copositive, with quantitative transfer',
    date: '2026-09-07',
    route: null,
    source: 'imp-95169',
  },
  {
    id: 'weld-psd-route',
    name: 'Convex operator-inequality (PSD) route',
    outcome: 'ruled-out',
    grade: 'refuted (THEOREM WP): the operator-inequality strip route fails — the weld floor is a strict copositivity question, not a PSD one',
    date: '2026-09-07',
    route: null,
    source: 'imp-95169 THEOREM WP',
  },
  {
    id: 'weld-two-point',
    name: 'Two-point class closed on the band',
    outcome: 'won',
    grade: 'RIGOROUS (LEMMA MC + LEMMA FB + THEOREM MC): merge-consistent cover TERMINATES — 55,398 cells, zero unresolved, ~1 s — closing the full two-point class on [0.2320727, 0.23209)',
    date: '2026-09-07',
    route: null,
    source: 'imp-95170',
  },
  {
    id: 'weld-triple-cover',
    name: 'Triple merge-consistent cover',
    outcome: 'in-progress',
    grade: 'HONEST PARTIAL: lemmas MC3/FB rigorous; the 45-min budget terminated only the top μ-layer, so THEOREM MC3-TOP closes the three-point class on the top sub-band [0.23208119492058613, 0.23209) alone; long-budget relaunch owed',
    date: '2026-09-09',
    route: null,
    source: 'imp-95171',
  },
  {
    id: 'weld-referee',
    name: 'Referee pass, continuations 20–52',
    outcome: 'won',
    grade: 'ALL SOUND-WITH-CAVEATS, zero refutations across the ~50-theorem stretch (three lenses); load-bearing caveats named (VX baked run, float-branch-and-bound nudge domination, lemma-name collisions)',
    date: '2026-09-09',
    route: null,
    source: 'ARISTOTLE_TARGETS.md 2026-09-09 verdicts',
  },

  // ── phase 6 · the 0.1399 lane + the collar (2026-09-07 → 09-09) ─────────
  {
    id: 'campaign-01399',
    name: '0.1399 certification-campaign design (T-P1 ranked first)',
    outcome: 'won',
    grade: 'DESIGN ONLY (grade: contract/conditional-design): transfer ledger from the 0.1787854/0.1758354 machinery, failure criteria K1/K2, ranked first computation; derives no bound',
    date: '2026-09-07',
    route: null,
    source: 'imp-95201',
  },
  {
    id: 'tp1-tail-repricing',
    name: 'T-P1 tail repricing (the 0.1399 tail lane)',
    outcome: 'ruled-out',
    grade: 'K1 does NOT fire (N1* = 220,495,706 exists, Arb 320/512-bit exact boundary) but K2 FIRES DECISIVELY: 4.01× the economic cutoff line — in this architecture the 0.1399 tail lane is economically dead',
    date: '2026-09-09',
    route: null,
    source: 'imp-95206',
  },
  {
    id: 'collar-split',
    name: 'Prop-4.3 collar (0.14 → 0.139981915)',
    outcome: 'ruled-out',
    grade: 'ELIMINATED twice over (feasibility assessment + split analysis): the sealed minima live on the 0.1787854 face, and at the 0.14 row’s own t* the lemma fails O(1)',
    date: '2026-09-09',
    route: null,
    source: 'imp-95202 / imp-95207',
  },
  {
    id: 'ythaw-salvage',
    name: 'y-thaw salvage found (0.17759432)',
    outcome: 'pivoted',
    grade: 'SALVAGE: days-scale delivered-face y-thaw of the sealed 0.1787854 to 0.17759432 (shadow-positive across the stretch); the sealed triangle-weight floor was a ~79,000×-pessimistic artifact — sharp weight replaces it',
    date: '2026-09-09',
    route: null,
    source: 'imp-95207 salvage finding',
  },

  // ── phase 7 · the y-thaw package (2026-09-10 → open) ────────────────────
  {
    id: 'ythaw-stage12',
    name: 'y-thaw stages 1+2 (S0 note + re-sweep)',
    outcome: 'won',
    grade: 'stage 1 sharp-weight native-binding note: CLOSES (prose-proof, refereed in the 20–52 pass); stage 2 re-sweep clean — Arb-certified rows under OUR compile (prec 256), NOT the sealed toolchain',
    date: '2026-09-10',
    route: null,
    source: 'imp-95208-ythaw / SHARP_WEIGHT_NATIVE_BINDING.md',
  },
  {
    id: 'ythaw-o5-o3',
    name: 'O5 + O3 certified',
    outcome: 'won',
    grade: 'O5 (site coverage) CERTIFIED under our toolchain (three-way: exact-rational + mpmath.iv 400-bit + Arb 400-bit); O3 (E_max budget) CERTIFIED-INTERVAL (mpmath.iv 320-bit, y-hull isotonicity, no monotonicity appeal)',
    date: '2026-09-10',
    route: null,
    source: 'imp-95212-ythaw',
  },
  {
    id: 'ythaw-o1-aristotle',
    name: 'O1 sharp-mass y-monotonicity at Aristotle',
    outcome: 'in-progress',
    grade: 'job38 sharp_mass_monotonicity (wave 6, sequential slot); success reduces O1 to a producer run (gates G1–G4, per-cell hull form)',
    date: '2026-09-10',
    route: null,
    source: 'imp-95130 / ARISTOTLE_TARGETS.md wave 6',
  },
  {
    id: 'ythaw-package',
    name: 'Λ ≤ 0.17759432 y-thaw package',
    outcome: 'open',
    grade: 'candidate-unrefereed — package value 129/800 + 0.1808²/2, not a bound; obligation ledger: O3, O5 closed / O1, O2, O4, O6 open',
    date: '2026-09-11',
    route: '/lambda-bounds',
    source: 'imp-95140 obligation ledger',
  },

  // ── phase 8 · inertia-PCC + Route VII (2026-09-14) ──────────────────────
  {
    id: 'inertia-pcc',
    name: 'Inertia × pair-correlation Q measurement',
    outcome: 'ruled-out',
    grade: 'MEASUREMENT ONLY: Q crosses the threshold everywhere but STRUCTURALLY (projection identity), not by discovery — the lane is the PCC wall again; banked 3 new measurements (arithmetic Q landscape, inertia signatures, λ_max(ρ) = 0.6231344958476320 → allowance 1.8149072)',
    date: '2026-09-14',
    route: null,
    source: 'imp-95217',
  },
  {
    id: 'route7-floor',
    name: 'Route VII cost curve — the program floor',
    outcome: 'won',
    grade: 'ANALYSIS (grade: analysis): N1*(t,y) exponential in 1/t derived from the tail architecture (SC3 floor ln N1* > 2/t); the t↓0 diagonal is COMPUTE-BLOCKED below U ≈ 0.14–0.15; reachable floor U ≈ 0.150, stretch 0.145; below that needs a new tail mechanism, i.e. arithmetic input',
    date: '2026-09-14',
    route: '/flow-blindness-no-go',
    source: 'imp-95218',
  },

  // ── phase 9 · the Aristotle formalization waves ─────────────────────────
  {
    id: 'aristotle-wave1',
    name: 'Aristotle wave 1 (5 projects)',
    outcome: 'won',
    grade: 'all five kernel-verified (lake build green, zero sorry/axiom, three standard axioms only), rated FAITHFUL by independent review: permutation-defect, anti-Hermitian strip, five-shell E97, §4.7 chain, twistor Lemma 6.1',
    date: '2026-08-28',
    route: '/formalization-status',
    source: 'ARISTOTLE_TARGETS.md wave 1',
  },
  {
    id: 'aristotle-waves23',
    name: 'Aristotle waves 2–3 (10 projects)',
    outcome: 'won',
    grade: '10/10 delivered, 10/10 kernel-verified, 9 FAITHFUL + 1 MINOR DRIFT (burgers IsHeatFlow global-in-s, disclosed); ramanujan_reversal proved from scratch — both imp-35068 conjectures now unconditional theorems',
    date: '2026-08-28',
    route: '/formalization-status',
    source: 'ARISTOTLE_TARGETS.md waves 2–3',
  },
  {
    id: 'aristotle-wave4',
    name: 'Aristotle wave 4 (6 jobs)',
    outcome: 'won',
    grade: 'CLOSE-OUT 2026-09-01: 15/15 ledger targets delivered and kernel-verified, ALL FAITHFUL (jet_lemma proved both not-banked pieces from scratch; flow_blindness formalized with hRT as a variable, project axiom-free)',
    date: '2026-09-01',
    route: '/formalization-status',
    source: 'ARISTOTLE_TARGETS.md wave 4',
  },
  {
    id: 'entirelp-parked',
    name: 'entirelp bonus target',
    outcome: 'open',
    grade: 'ATTEMPTED / OUT_OF_BUDGET (first quota event in 31 jobs; per-job compute budget on a genuinely deep analytic target); NOT retried pending the user’s call — retry / split into stages / park; weld_cc_rm parked the same way (second budget event)',
    date: '2026-09-01',
    route: null,
    source: 'ARISTOTLE_TARGETS.md waves 4–5',
  },
  {
    id: 'aristotle-wave5',
    name: 'Aristotle wave 5 (l2_detection_modulus)',
    outcome: 'won',
    grade: 'DELIVERED 2026-09-09: build green, zero nonstandard axioms, faithfulness MINOR (five disclosed non-material deviations); Target 1 UNCONDITIONAL (detection_radius_robust, stronger than briefed); Target 2 conditional on the named ZeroRepulsion structure only',
    date: '2026-09-09',
    route: '/formalization-status',
    source: 'ARISTOTLE_TARGETS.md wave 5 delivery',
  },
  {
    id: 'aristotle-wave6',
    name: 'Aristotle wave 6 (sequential slot)',
    outcome: 'in-progress',
    grade: 'submitted 2026-09-10 through the single-slot throttle: job34 heat transfer (entirelp stage 1) → job38 sharp_mass_monotonicity → weld PF / CC / RM singles',
    date: '2026-09-10',
    route: null,
    source: 'ARISTOTLE_TARGETS.md wave 6',
  },
  {
    id: 'zr-promotion',
    name: 'Frozen-rung ⟺ PT promotion',
    outcome: 'open',
    grade: '(ZR)-gated: THE FROZEN-RUNG⟺PT PROMOTION NOW RESTS ON EXACTLY ONE NAMED HYPOTHESIS: (ZR); by the inertia half, the certificate can never beat verified height — it promotes a theorem, not a Λ value',
    date: '2026-09-09',
    route: '/frozen-rung-pt-equivalence',
    source: 'l2_detection_modulus (job32) / frozen-rung Kernels.lean',
  },
];

// meaning: 'led-to' | 'refuted-by' | 'pivoted-to' | 'merged-into' | 'closes' | 'gates'
export const EDGES = [
  // atlas → gate ranking
  { from: 'majorant-obstruction', to: 'gate-ranking', meaning: 'led-to', note: 'names the correlated-phase gates' },
  { from: 'fam-moving-rouche', to: 'gate-ranking', meaning: 'led-to', note: 'routes the lever to the gates' },
  { from: 'fam-graph-compression', to: 'gu-word-composition', meaning: 'merged-into' },
  { from: 'gu-word-composition', to: 'weld-wd-dissolution', meaning: 'merged-into', note: 'residue banked in the weld ladder' },
  { from: 'gate-ranking', to: 'gate2-frozen-spec', meaning: 'led-to' },

  // probe chain
  { from: 'gate2-frozen-spec', to: 'lane-a-blocked', meaning: 'led-to' },
  { from: 'gate2-frozen-spec', to: 'cutoff-tensor', meaning: 'led-to', note: 'is the freeze tuple optimal?' },
  { from: 'lane-a-blocked', to: 'archive-hunt', meaning: 'led-to' },
  { from: 'archive-hunt', to: 'archive-free-pivot', meaning: 'pivoted-to' },
  { from: 'archive-free-pivot', to: 'g3-pilot', meaning: 'led-to' },
  { from: 'g3-pilot', to: 'window1-run', meaning: 'gates', note: 'pilot pass → certification worth pricing' },
  { from: 'g3-pilot', to: 'inertia-pcc', meaning: 'led-to', note: 'Lane-A evaluator reused' },

  // certification chain
  { from: 'raw-tiling', to: 'envelope-pivot', meaning: 'pivoted-to' },
  { from: 'envelope-pivot', to: 'tier1-certifier', meaning: 'pivoted-to', note: 'the one live path after the refutation' },
  { from: 'tier1-certifier', to: 'tier2-chirp', meaning: 'led-to' },
  { from: 'tier2-chirp', to: 'window1-run', meaning: 'gates', note: '17.9× repricing makes the run decidable' },

  // weld ladder
  { from: 'weld-gap-41x', to: 'weld-gap-281x', meaning: 'led-to' },
  { from: 'weld-gap-281x', to: 'weld-vx', meaning: 'led-to' },
  { from: 'weld-vx', to: 'weld-wd-dissolution', meaning: 'led-to' },
  { from: 'weld-psd-route', to: 'weld-wd-dissolution', meaning: 'refuted-by', note: 'THEOREM WP' },
  { from: 'weld-wd-dissolution', to: 'weld-two-point', meaning: 'led-to' },
  { from: 'weld-two-point', to: 'weld-triple-cover', meaning: 'led-to' },
  { from: 'weld-vx', to: 'weld-referee', meaning: 'led-to', note: 'refereed in the 20–52 pass' },
  { from: 'weld-two-point', to: 'weld-referee', meaning: 'led-to' },

  // 0.1399 lane + collar → y-thaw
  { from: 'campaign-01399', to: 'tp1-tail-repricing', meaning: 'led-to', note: 'ranked first computation' },
  { from: 'campaign-01399', to: 'collar-split', meaning: 'led-to' },
  { from: 'tp1-tail-repricing', to: 'route7-floor', meaning: 'led-to', note: 'N1* calibration point' },
  { from: 'collar-split', to: 'ythaw-salvage', meaning: 'pivoted-to' },
  { from: 'ythaw-salvage', to: 'ythaw-stage12', meaning: 'led-to' },
  { from: 'ythaw-stage12', to: 'ythaw-o5-o3', meaning: 'led-to' },
  { from: 'ythaw-o5-o3', to: 'ythaw-package', meaning: 'gates' },
  { from: 'ythaw-o1-aristotle', to: 'ythaw-package', meaning: 'gates' },

  // no-gos and floors
  { from: 'flow-blindness', to: 'route7-floor', meaning: 'gates', note: 'below the floor = arithmetic input' },
  { from: 'flow-blindness', to: 'inertia-pcc', meaning: 'gates', note: 'soft linear algebra creates no arithmetic input' },

  // formalization
  { from: 'frozen-rung-prop', to: 'zr-promotion', meaning: 'gates' },
  { from: 'aristotle-wave1', to: 'aristotle-waves23', meaning: 'led-to' },
  { from: 'aristotle-waves23', to: 'aristotle-wave4', meaning: 'led-to' },
  { from: 'aristotle-wave4', to: 'entirelp-parked', meaning: 'led-to', note: 'first budget event' },
  { from: 'aristotle-wave4', to: 'aristotle-wave5', meaning: 'led-to' },
  { from: 'aristotle-wave5', to: 'zr-promotion', meaning: 'closes', note: 'reduces the converse to (ZR) exactly' },
  { from: 'aristotle-wave5', to: 'aristotle-wave6', meaning: 'led-to' },
  { from: 'aristotle-wave6', to: 'ythaw-o1-aristotle', meaning: 'gates', note: 'job38' },
];

export const PROGRAM_DAG = { asOf: '2026-09-14', nodes: NODES, edges: EDGES };
