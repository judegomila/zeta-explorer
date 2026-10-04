/**
 * research-threads.js — the curated research-thread narrative layer (/threads).
 *
 * Each thread is a dated, honest timeline of one line of work, populated from
 * the repo record (formalization/ARISTOTLE_TARGETS.md is the master ledger,
 * plus the named src/data modules). Grades are verbatim; nothing here
 * promotes a bound; unresolved threads are marked 'in progress'.
 * Import-light: pure literals, no heavy bundles.
 *
 * Timeline entry fields: { date, event, verdict, module? | route? | commit? }.
 */

export const THREADS = [
  {
    slug: 'weld-ladder',
    title: 'The weld ladder (imp-95008 → 951xx)',
    oneLine:
      'The [B_v, Π_p] weld bracket of the permutation architecture: exact alias decomposition, the far-bracket gap narrowed 41.3x → 2.81x, the mass-ratio wall dissolved by copositivity, and the parity-pure MAJ occupancy ladder certified down to floor 47/200.',
    status: 'in progress',
    grade: 'refereed-sound (with caveats)',
    timeline: [
      {
        date: '2026-08-28',
        event:
          'imp-95008: exact alias decomposition [B, Π_p] = (1/p) Σ_{h≠0} [B, M_h] (operator identity, h = 0 contributes zero for ANY B) + bounded-overlap l2 collapse lemma; the five-shell weld coupling reduces to single-shell packet masses.',
        verdict: 'unconditional lemmas',
        module: 'src/data/imp-95008-weld-alias-l2-collapse.js',
      },
      {
        date: '2026-09-02',
        event:
          'imp-95045: the residual 2.81x far-bracket headline gap attributed — parity AM-GM (ceiling side, ~67%) dominant; witness-side appends had lifted the floor 0.0929 → 0.0967 (gap 43.07 → 41.35) before the ceiling-side ledger factor 2.8489 became the binding figure.',
        verdict: 'attribution, assessment only',
        module: 'src/data/imp-95045-headline-gap-attribution.js',
      },
      {
        date: '2026-09-06',
        event:
          'imp-95153 THEOREM VX: middle-heavy quadruple-block ladder-floor step certified at 47/200 = 0.235 via an 872M-cell branch-and-bound — the final strip [47/200, 59/250) certified for the k ≤ 4 middle-head channel; joint threshold 0.236 → 0.235. Caveat (referee): the closure rests on one baked offline run with worst margin 1.66e-12 ~ the float-guard scale; directed-rounding re-run of the worst cells queued.',
        verdict: 'rigorous step, caveat carried',
        module: 'src/data/imp-95153-gram-cone-stall-verdict.js',
      },
      {
        date: '2026-09-06',
        event:
          'imp-95167 THEOREM SP: single-packet strip closure — 626-cell branch-and-bound closes the open strip [0.2320723, 0.23209) for at-most-one-packet-per-block witnesses; the crossing bracket [0.2320715, 0.2320723] reproduces the recorded intrinsic anchor to 9.4e-10. Strip NOT closed for multi-packet hulls.',
        verdict: 'rigorous step, scope-limited',
        module: 'src/data/imp-95167-single-packet-strip-closure.js',
      },
      {
        date: '2026-09-09',
        event:
          'imp-95169 LEMMA WD: copositive weld dissolution — the mass-ratio variables eliminated EXACTLY (sup over profiles λ_max(M) < 1 ⟺ 2D − G strictly copositive); the 12-D cover collapses to 9-D and the recorded cross-entry ratio-decoupling wall dissolves.',
        verdict: 'rigorous step',
        module: 'src/data/imp-95169-copositive-weld-dissolution.js',
      },
      {
        date: '2026-09-09',
        event:
          'Independent referee pass over continuations 20–52 (three lenses): ALL SOUND-WITH-CAVEATS, zero refutations. Load-bearing caveats recorded: the VX 872M-cell margin, the chain-wide float branch-and-bound nudge-domination assumption (disclosed, unproved), lemma-name collisions, and the class sandwich [0.2320723, 0.24502] being a MODEL-FAMILY constant (no arithmetic transfer claimed).',
        verdict: 'refereed sound-with-caveats',
        commit: '0d23e88f0 (era)',
      },
    ],
    openObjects: [
      'directed-rounding re-run of the worst VX cells',
      'float branch-and-bound nudge-domination assumption (disclosed, unproved)',
      'multi-packet hulls in the [0.2320723, 0.23209) strip',
      'arithmetic transfer of the model-family class sandwich',
    ],
    keyNumbers: [
      { value: '2.8489', meaning: 'ceiling-side ledger factor — the residual far-bracket headline gap (down from 41.35)', provenanceRoute: '/permutation-architecture' },
      { value: '47/200 = 0.235', meaning: 'certified parity-pure MAJ occupancy ladder floor (THEOREM VX)', provenanceRoute: '/permutation-architecture' },
      { value: '1.66e-12', meaning: 'worst VX cell margin — at the float-guard scale, the flagged caveat', provenanceRoute: '/permutation-architecture' },
    ],
  },
  {
    slug: 'gate2-contract',
    title: 'Gate-2 / the Λ ≤ 0.14 completion contract',
    oneLine:
      'The fail-closed 0.14 contract’s one open family: Lane-A evaluator, the unreplayable anchor literal, the G3 first-window pilot pass (12.8% / 30.8% margins), the envelope-pivot refutation, and a tiered certifier priced 434x then 17.9x down — the window-1 continuum run is now executing.',
    status: 'in progress',
    grade: 'contract-not-a-bound',
    timeline: [
      {
        date: '2026-09-02',
        event:
          'imp-95012: the Gate-2 frozen spec — the strict correlated-center target |C_E,17| < Rex = 0.2796881955526244 (eq. 20) over the 54,109,012-window family.',
        verdict: 'frozen spec',
        module: 'src/data/imp-95012-gate2-frozen-spec.js',
      },
      {
        date: '2026-09-09',
        event:
          'Archive hunt: the paper’s anchor literal 0.2141254901198318 is unreplayable — its companion source archive (refs [17]–[19]) was never downloaded to this machine. The paper’s own §12.1 G1–G5 program provides an archive-free path.',
        verdict: 'provenance gap, archive-free lane adopted',
        module: 'formalization/ARISTOTLE_TARGETS.md (archive recovery)',
      },
      {
        date: '2026-09-09',
        event:
          'imp-95205 G3 first-window pilot: the STRONGER pilot passes on the complete N = 690988 window — sup Σ|D_j| = 0.24375 < Rex (margin 12.8%), sup |E97| = 0.19344 (margin 30.8%); telescope verified to 8e-14 over 612,290 dd evaluations + mpmath audit to 8e-79. Sampled sup, not continuum.',
        verdict: 'pilot pass (sampled)',
        module: 'src/data/imp-95205-g3-first-window-pilot.js',
      },
      {
        date: '2026-09-10',
        event:
          'imp-95210: the envelope-scale certification pivot REFUTED (measured, two independent obstructions — slack and rigor); phase-resolving certification stands as the only path.',
        verdict: 'refutation (measured)',
        module: 'src/data/imp-95210-window1-pilot-certificate.js',
      },
      {
        date: '2026-09-10',
        event:
          'imp-95213: tier-P/B/S certifier built + validated — first continuum-certified slice (0.058% of window 1, both seam charts); full window priced 378 CPU-days, a 434x cut over the direct interval certifier (~1.6e5 CPU-days).',
        verdict: 'certifier built, slice certified',
        module: 'src/data/imp-95213-tier-certifier-build.js',
      },
      {
        date: '2026-09-11',
        event:
          'imp-95214/95228/95238: the tier-2 frequency-bin chirp level built + validated — the identical window-1 continuum certificate at 21.1 CPU-days (17.9x below level-1, which is now strictly dominated). A full-window-1 run sets NO G5 promotion flag and changes no bound (imp-95280 scope note): 54,109,011 windows remain beyond it.',
        verdict: 'priced, level-1 dominated',
        module: 'src/data/imp-95238-fullwindow-run-decision.js',
      },
      {
        date: '2026-09-14',
        event:
          'Window-1 tier-2 continuum certification run (W1-CERT, run_w1cert_95216.sh shards) is EXECUTING on this machine.',
        verdict: 'in progress',
        module: 'native/gate2-interval/run_w1cert_95216.sh',
      },
      {
        date: '2026-09-14',
        event:
          'The measured first-window landscape rendered as data geometry: Σ|D_j|(w) and |E97|(w) over the full window (max-preserving downsample of the deterministic pilotg3 grid, sups pinned to the recorded literals), the certified tier slice shaded, and a phase-scale zoom at the sup witness. Sampled measurement; only the slice is certified.',
        verdict: 'presentation (measured)',
        route: '/viz-window-landscape',
      },
    ],
    openObjects: [
      'window-1 continuum certificate (run in progress)',
      'anchor-literal provenance (companion archive unrecovered)',
      '54,109,011 windows beyond window 1',
      'G5 precision replays (160/192-bit) and window promotion',
    ],
    keyNumbers: [
      { value: '0.2437541384450471', meaning: 'sup Σ|D_j| on the complete first window (sampled) vs Rex = 0.2796881955526244 — 12.8% margin', provenanceRoute: '/permutation-architecture' },
      { value: '21.1 CPU-days', meaning: 'tier-2 price of the full window-1 continuum certificate (was 378; direct ~1.6e5)', provenanceRoute: '/permutation-architecture' },
      { value: '54,109,012', meaning: 'windows in the Gate-2 family — window 1 is one of them', provenanceRoute: '/permutation-architecture' },
    ],
  },
  {
    slug: 'y-thaw-0177',
    title: 'y-thaw: the 0.17759432 candidate package',
    oneLine:
      'A delivered-face y-thaw of the sealed 0.1787854 candidate (y-anchor 0.18727 → 0.1808, value 129/800 + 0.1808²/2 = 0.17759432): S0 note refereed, the 3.15M-row sharp-weight sweep fail-closed clean, O5/O3 certified, O1 submitted to Aristotle. A package value, not a bound.',
    status: 'in progress',
    grade: 'candidate package (per-obligation grades)',
    timeline: [
      {
        date: '2026-09-09',
        event:
          'imp-95207 split-collar salvage: the 0.139981915 collar ELIMINATED twice over, but a days-scale delivered-face y-thaw of the sealed 0.1787854 candidate to 0.17759432 identified (sharp vecmax weight replacing the triangle weight, whose sealed 7.9e-7 floor was a ~79,000x-pessimistic artifact).',
        verdict: 'salvage found',
        module: 'src/data/imp-95207-split-collar-analysis.js',
      },
      {
        date: '2026-09-10',
        event:
          'Stage 1 (SHARP_WEIGHT_NATIVE_BINDING.md): the sharp-weight native-binding lemma CLOSES at (t = 129/800, y = 0.1808), with the new radial-monotonicity sub-lemma S0. Independent referee pass 2026-09-10: S0/S1/S2 sound, rows 1–6 accurate, O1 restated (one route STRUCK with reason recorded).',
        verdict: 'prose-proof, refereed',
        module: 'formalization/y-thaw-01775943/SHARP_WEIGHT_NATIVE_BINDING.md',
      },
      {
        date: '2026-09-10',
        event:
          'Stage 2: sharp-weight re-sweep of the finite lane N = 690988..3840000 — 3,149,013 rows, every integer N, Arb prec 256, strict fail-closed, ZERO uncertified rows. Under OUR compile, not the sealed toolchain.',
        verdict: 'arb-certified (our toolchain)',
        module: 'src/data/imp-95208-ythaw-package-stage12.js',
      },
      {
        date: '2026-09-11',
        event:
          'imp-95212: O5 (site coverage) CERTIFIED — exact-rational + 400-bit mpmath.iv + independent Arb lanes, three-way agreement. O3 (E_max budget) CERTIFIED-INTERVAL — 320-bit directed rounding on the full y-hull [0.1808, y_max] via inclusion isotonicity; thawed budget sits 257,170x below the stage-2 sharp floor.',
        verdict: 'O5 + O3 certified (our toolchain)',
        module: 'src/data/imp-95212-ythaw-o5-o3.js',
      },
      {
        date: '2026-09-11',
        event:
          'imp-95140 obligation ledger: O3 + O5 CLOSE; O1 (sharp-mass y-monotonicity), O2 (barrier/winding slab), O4 (analytic tail N > 3840000), O6 (assembly) remain OPEN. 0.17759432 stays a package VALUE.',
        verdict: 'ledger: 2 of 6 closed',
        module: 'src/data/imp-95140-ythaw-obligation-ledger.js',
      },
      {
        date: '2026-09-10',
        event:
          'Wave 6: the O1 theorem (sharp_mass_monotonicity, gates G1–G4, per-cell hull form) submitted to Aristotle; success would reduce O1 to a producer run.',
        verdict: 'at Aristotle, pending',
        module: 'formalization/ARISTOTLE_TARGETS.md (wave 6)',
      },
    ],
    openObjects: [
      'O1 sharp-mass y-monotonicity (at Aristotle)',
      'O2 barrier/winding slab at the 0.1808 edge',
      'O4 analytic tail N > 3,840,000',
      'O6 criterion assembly',
      'sealed-toolchain replay of the certified rows',
    ],
    keyNumbers: [
      { value: '0.17759432', meaning: '129/800 + 0.1808²/2 — the package value (not a bound; 4 of 6 obligations open)', provenanceRoute: '/lambda-bounds' },
      { value: '3,149,013', meaning: 'sweep rows N = 690988..3840000, prec 256, fail-closed, zero UNCERT', provenanceRoute: '/lambda-bounds' },
      { value: '257,170x', meaning: 'O3 margin factor: thawed error budget below the stage-2 sharp floor', provenanceRoute: '/lambda-bounds' },
    ],
  },
  {
    slug: 'formalization',
    title: 'Formalization: the Aristotle waves',
    oneLine:
      'Six submission waves to the Harmonic Aristotle ATP: 30 of 31 wave-1–4 jobs delivered kernel-verified (zero sorry/axiom beyond the three standard ones), two repo conjectures upgraded to unconditional theorems, and the frozen-rung⟺PT promotion reduced to exactly one named hypothesis (ZR).',
    status: 'in progress',
    grade: 'kernel-verified (per delivered project)',
    timeline: [
      {
        date: '2026-08-28',
        event:
          'Wave 1 delivered: permutation-defect lemma, anti-Hermitian strip bound, five-shell identity E97, §4.7 implication chain, twistor Lemma 6.1 — all five kernel-verified (lake build green) and rated FAITHFUL by independent review. Already banked: the frozen-rung set, the DBN base case, RealRootedPreservation.lean.',
        verdict: 'kernel-verified, faithful',
        route: '/formalization-status',
      },
      {
        date: '2026-08-28',
        event:
          'Waves 2–3 delivered: 10/10 kernel-verified, 9 FAITHFUL + 1 MINOR DRIFT (burgers IsHeatFlow global-in-s, disclosed). ramanujan_reversal proved ALL FOUR theorems for all n from scratch (AbelIdentity + TreeSeries) — BOTH imp-35068 conjectures (row sum, subleading) upgraded from conjecture to unconditional theorem.',
        verdict: 'kernel-verified; 2 conjectures upgraded',
        route: '/formalization-status',
      },
      {
        date: '2026-09-01',
        event:
          'Wave 4 close-out: 15/15 ledger targets delivered kernel-verified, ALL FAITHFUL. jet_lemma proved both non-banked pieces from scratch; flow_blindness formalizes the program’s headline no-go with Rodgers–Tao as a variable (project axiom-free). Tally: 31 jobs, 30 delivered, 1 budget-parked (entirelp).',
        verdict: 'kernel-verified, all faithful',
        route: '/formalization-review',
      },
      {
        date: '2026-09-09',
        event:
          'Wave 5: l2_detection_modulus DELIVERED (build green, faithfulness MINOR with five disclosed non-material deviations) — Target 1 detection_radius_robust UNCONDITIONAL, Target 2 conditional on the named ZeroRepulsion structure only. The frozen-rung⟺PT promotion now rests on EXACTLY ONE named hypothesis: (ZR). weld_cc_rm OUT_OF_BUDGET, parked.',
        verdict: 'kernel-verified; one hypothesis remains',
        module: 'formalization/ARISTOTLE_TARGETS.md (wave 5)',
      },
      {
        date: '2026-09-10',
        event:
          'Wave 6 submitted (sequential through the single-slot throttle): heat transfer (entirelp stage 1) → sharp_mass_monotonicity (the y-thaw O1 theorem) → the weld PF/CC/RM singles.',
        verdict: 'submitted, pending',
        module: 'formalization/ARISTOTLE_TARGETS.md (wave 6)',
      },
    ],
    openObjects: [
      '(ZR) — the one named hypothesis under the frozen-rung⟺PT promotion',
      'entirelp locally-uniform heat-flow approximation (budget-parked, staged retry running)',
      'weld PF / CC / RM single-lemma jobs',
      'sharp_mass_monotonicity (y-thaw O1)',
    ],
    keyNumbers: [
      { value: '30 / 31', meaning: 'waves 1–4 jobs delivered kernel-verified (1 budget-parked)', provenanceRoute: '/formalization-status' },
      { value: '2', meaning: 'repo conjectures upgraded to unconditional theorems (imp-35068 row sum + subleading)', provenanceRoute: '/formalization-review' },
      { value: '1', meaning: 'named hypothesis (ZR) remaining under the frozen-rung⟺PT promotion', provenanceRoute: '/frozen-rung-pt-equivalence' },
    ],
  },
  {
    slug: 'no-gos',
    title: 'The no-go ledger',
    oneLine:
      'The negative results that shape the program: flow-blindness (soft hypotheses cannot prove RH), frozen-rung⟺PT (freezing the rungs is Platt–Trudgian in operator language), the C_H/C_Lip wall closed three ways, the no-gain rule, and the permutation-architecture route atlas.',
    status: 'closed (individual entries final)',
    grade: 'no-go / theorem (per entry)',
    timeline: [
      {
        date: '2026-07',
        event:
          'Frozen-rung⟺PT equivalence: freezing the ladder rungs IS Platt–Trudgian in operator language — the inertia calculus locks the frozen-ladder route to verified height. 13pp proof PDF; Aristotle autoformalization banked (frozen-rung set kernel-verified).',
        verdict: 'prose-proof + kernel-verified core',
        route: '/frozen-rung-pt-equivalence',
      },
      {
        date: '2026-07-08',
        event:
          'PT-floor audit: the Λ ≤ 0.2 floor binds on verified zero height X ≈ 3e12, not barrier slack — the whole barrier-tightening class (SOS/Carleman/Putinar/free-sub) refuted as a Λ < 0.2 lever.',
        verdict: 'audit, refutation of a route class',
        route: '/pt-floor-audit',
      },
      {
        date: '2026-06-30',
        event:
          'The C_H / C_Lip wall closed three ways; the field-channel reroute (imp-3933) bypasses it in the vector-field-error channel only.',
        verdict: 'no-go (wall), reroute scoped',
        route: '/no-gos',
      },
      {
        date: '2026-08',
        event:
          'Flow-blindness SL2 no-go: the backward heat flow stays soft yet breaks RH — no soft hypothesis proves RH; arithmetic input is necessary. Twin-ladder T3 is a zero-free strip in disguise (dictionary verified to 1e-30). Formalized in wave 4 with Rodgers–Tao as a named variable.',
        verdict: 'no-go, formalized',
        route: '/flow-blindness-no-go',
      },
      {
        date: '2026-08',
        event:
          'The no-gain rule (isometry cannot sharpen a margin) and the permutation-architecture atlas: the post-freeze frontier mapped, every closure route across 6 clusters located at its split point.',
        verdict: 'no-go rule + route map',
        route: '/route-map',
      },
    ],
    openObjects: [
      'the crossing point: finite N-uniform C_Lip → D_rest (the located exception)',
    ],
    keyNumbers: [
      { value: 'Λ ≥ 0', meaning: 'Rodgers–Tao — the hypothesis the flow-blindness no-go is conditional on (formalized as hRT)', provenanceRoute: '/flow-blindness-no-go' },
      { value: 'X ≈ 3e12', meaning: 'verified zero height — what actually binds the Λ ≤ 0.2 floor', provenanceRoute: '/pt-floor-audit' },
    ],
  },
  {
    slug: 'theta-cm-flow',
    title: 'Θ-trap & the CM heat flow',
    oneLine:
      'The finite-N Dyson/heat-flow theory: the Θ ≤ 1/4 trap invariant, the heat-discriminant ODE, the sharp excursion cap Θ ≤ 1 − 2/N, and the exact c_glob = c_half closure — the class-level theory is done; the R1 transfer stays open.',
    status: 'closed at class level; R1 transfer open',
    grade: 'kernel-verified (core) / prose-proof (rest)',
    timeline: [
      {
        date: '2026-08-28',
        event:
          'c_glob isolation CLOSED: c_glob = c_half = 0.8980208880762339 EXACTLY (root of 4 + 4r − 4/r − 4/(r+1) − 2[ψ(1+2/r) − ψ(1+1/r)]) via the exact digamma telescope of the half-lattice majorant — a universal sharp rate bound; the R2 subgap closed.',
        verdict: 'exact closure (prose-proof)',
        module: 'src/data/sg1c-theta-trap-theorems.js',
      },
      {
        date: '2026-08-28',
        event:
          'Wave 2 formalization: the Θ-trap core package (dg/ds = −(4/g)(1−Θ), Theorem A Θ ≤ 1/4 invariant sharp, Corollary E1 t_c ≤ g²/(8(1−Θ*))) and the heat-discriminant ODE (d/ds log Disc = −8Σ 1/(x_i−x_j)² + the vanishing triple-sum lemma) delivered kernel-verified, FAITHFUL — flow existence/no-collision carried as explicit named hypotheses.',
        verdict: 'kernel-verified',
        route: '/formalization-status',
      },
      {
        date: '2026-08-28',
        event:
          'Wave 3: Lemma R1-FN sharp excursion cap (Θ ≤ 1 − 2/N sharp, balanced-lattice maximiser) and the isolation-onset closed forms (c* = √(2+√3) − 1) delivered kernel-verified.',
        verdict: 'kernel-verified',
        route: '/formalization-status',
      },
    ],
    openObjects: [
      'R1 transfer (c_glob is a class theorem; the transfer to the target chain stays open)',
      'Θ* persistence on (0.443, 0.5073) — nothing claimed, per the source’s own refutation band',
    ],
    keyNumbers: [
      { value: '0.8980208880762339', meaning: 'c_glob = c_half exactly — universal sharp rate bound (digamma telescope)', provenanceRoute: '/theta-basin-closure' },
      { value: '1/4', meaning: 'the sharp Θ-trap invariant threshold (Theorem A, kernel-verified)', provenanceRoute: '/formalization-status' },
    ],
  },
  {
    slug: 'route-vii',
    title: 'Route VII: the t↓0 diagonal family',
    oneLine:
      'The complete-row route U = t + y²/2 → 0 (which with Λ ≥ 0 would give RH): the cost curve is derived from the verifier’s contraction structure — N1*(t) = exp(Θ(1/t)) — and calibrated on two Arb-measured points; the verified-height wall is located. Scoping, not a program.',
    status: 'in progress (cost-curve scoping)',
    grade: 'analysis',
    timeline: [
      {
        date: '2026-09-09',
        event:
          'imp-95206 T-P1: the 0.1399 tail lane K2-KILLED — N1* = 220,495,706, 4.01x the economic line (Arb 320/512-bit, exact integer boundary). The second calibration point of the cost curve.',
        verdict: 'eliminated (lane), calibration banked',
        module: 'src/data/imp-95206-t-p1-tail-repricing.js',
      },
      {
        date: '2026-09-11',
        event:
          'imp-95218: the complete-row cost curve derived from verify_tail_arb.c’s contraction structure — t multiplies ln N in the ladder exponents, so N1*(t) = exp(Θ(1/t)); calibrated on (t = 129/800 → N1 = 3.84e6) and (t = 10103/80000 → N1* = 220,495,706); complete rows priced along the §10.7 diagonal family and the verified-height wall located. Derives no bound, closes no gap.',
        verdict: 'analysis',
        module: 'src/data/imp-95218-route7-cost-curve.js',
      },
      {
        date: '2026-09-14',
        event:
          'The cost law rendered as accurate idea geometry: the (t, y) plane colored by the calibrated law log10 N1*(t, y), with iso-U parabolas, the row-budget frontiers, the four frozen rows, and the derived U ≈ 0.145–0.150 floor band — every pixel from the imp-95218 formulas (derived analysis, 2-point calibration, NO QED).',
        verdict: 'presentation (derived analysis)',
        route: '/viz-cost-floor',
      },
    ],
    openObjects: [
      'whether any complete row below 0.1758354 is affordable before the exponential wall',
      'the fixed-t0 floor: y = 0 inadmissible, endpoint infimum is a target not a shortcut',
    ],
    keyNumbers: [
      { value: 'exp(Θ(1/t))', meaning: 'the derived tail-cutoff scaling — why t↓0 rows price out exponentially', provenanceRoute: '/lambda-bounds' },
      { value: '220,495,706', meaning: 'N1* at t = 10103/80000 (the eliminated 0.1399 lane’s Arb-measured cutoff)', provenanceRoute: '/lambda-bounds' },
    ],
  },
  {
    slug: 'lambda-candidates',
    title: 'The Λ candidate ladder',
    oneLine:
      'The unreviewed candidate packages below the peer-reviewed benchmark: the sealed 0.1787854 v3 package (public record), the conditional 0.1758354 y-transfer, and the in-progress 0.17759432 y-thaw. None is an established bound.',
    status: 'in progress',
    grade: 'candidate-unrefereed (per package)',
    timeline: [
      {
        date: '2026-07-28',
        event:
          'The Λ ≤ 0.1787854 candidate sealed as the immutable v3 review package (public GitHub release + container image, SHA-256 sealed). Unconditional logical form by design; unreviewed — not an established theorem.',
        verdict: 'candidate-unrefereed, sealed',
        route: '/newman-lambda-01787854-candidate',
      },
      {
        date: '2026-08',
        event:
          'Λ ≤ 0.1758354 y-transfer package: four gates certified in Arb, y-transfer reduction and Lemma B3 Lean-checked; termwise monotonicity found FALSE (double cancellations), fixed by profile-sector cells + excision budget B ≈ 2.5e-4 vs the 1.87e-3 margin. The Arb verify run of the y-Dini general-mollifier gate passed (2026-08-02, B = 2.4957e-4; partials reproduced 2026-09-22); internal composition audit 2026-09-28 (gate 1.622504e-3 > 0). Unreviewed, unpublished; human sign-off on y-transfer Theorems B/C open.',
        verdict: 'conditional candidate',
        route: '/lambda-01758354-candidate',
      },
      {
        date: '2026-09-09',
        event:
          '0.139981915 and the 0.1399 tail lane ELIMINATED (split-collar analysis + T-P1 repricing) — the sealed minima live on the 0.1787854 face; the salvage became the 0.17759432 y-thaw package (its own thread).',
        verdict: 'eliminated (two lanes); salvage spun out',
        module: 'src/data/imp-95207-split-collar-analysis.js',
      },
    ],
    openObjects: [
      'independent review of the 0.1787854 v3 package',
      'the 0.1758354 conditional gate (Arb verify)',
      'the y-thaw obligations O1/O2/O4/O6 (see the y-thaw thread)',
    ],
    keyNumbers: [
      { value: '0.2', meaning: 'Platt–Trudgian — the peer-reviewed benchmark every package sits below only as a candidate', provenanceRoute: '/lambda-timeline' },
      { value: '0.1787854', meaning: 'the sealed v3 candidate (public record, unreviewed)', provenanceRoute: '/newman-lambda-01787854-candidate' },
      { value: '0.1758354', meaning: 'the conditional y-transfer candidate', provenanceRoute: '/lambda-01758354-candidate' },
    ],
  },
  {
    slug: 'inertia-pcc',
    title: 'Inertia × pair-correlation (the 2/3-technique experiment)',
    oneLine:
      'The external 2/3-on-the-line inertia + von Neumann trace-inequality technique, run on OUR kernels at 21 seam points: the crossing was pre-decided structurally — the SAME PCC wall — but three genuinely new measurements were delivered.',
    status: 'closed (measurement delivered)',
    grade: 'measured',
    timeline: [
      {
        date: '2026-08',
        event:
          'Method provenance: the Claude/Anthropic Aug-2026 result made a previously RH-conditional Montgomery pair-correlation bound unconditional via Sylvester inertia + a von Neumann trace inequality on a finite compression of Weil’s form (external result — Lean-checked, reviewed by Conrey and Goldston, not peer-reviewed, not this project’s).',
        verdict: 'external technique identified',
        route: '/critical-line-proportion',
      },
      {
        date: '2026-09-14',
        event:
          'imp-95217: the analogous finite compression run on the Gate-2 seam-point defect form (18-mode carrier over 25 prime nodes, 21 seam points). Q < allowance everywhere, but STRUCTURALLY pre-decided (the Christoffel diagonal is an orthogonal-projection diagonal, so Q ≤ 1 identically) — the load lands wholly on the imp-95008 identification residual: the SAME PCC wall (soft linear algebra creates no arithmetic input; the flow-blindness pattern).',
        verdict: 'same-wall verdict',
        module: 'src/data/imp-95217-inertia-pcc-q-measurement.js',
      },
      {
        date: '2026-09-14',
        event:
          'Three new measurements banked: λ_max(ρ) = 0.6231344958476320 (the imp-95020 named unmeasured number); family-wide pointwise indefiniteness of the compressed defect form (n⁻ ∈ [5,11], n0 = 0 everywhere — every PSD-certificate route through this compression refuted pointwise); small-prime Christoffel concentration (K → 1 at p = 2, 3, 5).',
        verdict: 'measurements, not theorems',
        module: 'src/data/imp-95217-inertia-pcc-q-measurement.js',
      },
    ],
    openObjects: [
      'the imp-95008 identification residual (the unidentified weld constants)',
      'conditional transfer available if C·√K·‖f‖ < 1.8149 is ever identified',
    ],
    keyNumbers: [
      { value: '0.6231344958476320', meaning: 'λ_max(ρ) — the named unmeasured number of imp-95020, now measured', provenanceRoute: '/permutation-architecture' },
      { value: 'n⁻ ∈ [5, 11], n0 = 0', meaning: 'inertia signatures at all 21 seam points — PSD-certificate routes refuted pointwise', provenanceRoute: '/permutation-architecture' },
    ],
  },
];

export const THREADS_META = {
  compiled: '2026-09-14',
  source:
    'formalization/ARISTOTLE_TARGETS.md (master ledger) + the named src/data modules; grades verbatim; unresolved threads marked in progress',
  count: THREADS.length,
};
