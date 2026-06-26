/**
 * @module sessions
 * @fileoverview Coarse-grained journal of working sessions on the RH Λ-
 * bound attack. Mirrors SESSIONS.md at the repo root (write-through to
 * the .md file; this is the read interface consumed by the Sessions page).
 * Exports {@link SESSIONS} (frozen entry list with date, focus, outcomes).
 * Background reference; NOT part of the formal proof chain. Module-doc
 * added by imp-954.
 * @see SESSIONS.md
 */

// Research Sessions — ZPO Explorer / RH Attack Journal
//
// Coarse-grained journal of work sessions on the Riemann Hypothesis Λ bound
// attack. One entry per working session. Mirrors SESSIONS.md at the repo root.
// SESSIONS.md is the write-through; this file is the read interface consumed
// by src/pages/ResearchJournalPage.jsx.
//
// For per-commit detail see src/data/improvements.js. For the live task list
// see src/data/improvement-queue.js.

export const SESSIONS = [
  {
    id: 'session-2026-04-10',
    date: '2026-04-10',
    title: 'Engine rewiring + B2(a) statistical closure',
    engineStateStart:
      'auto-improve.sh running category-rotation prompt (ignoring the queue). 9 pending queue items (all proof, stale references to work already shipped in `229133e PATH C HYBRID`). MAX_RUNS=100 hit and exited mid-session. 876 total runs prior.',
    engineStateEnd:
      'Running PID 1833, MAX_RUNS bumped to 1000. Queue now drives engine selection in critical → high → medium order via updated IMPROVE_PROMPT. Cron monitor d76fd47f fires every ~10min to re-check and re-seed.',
    lambdaHeadline: {
      start: 'Λ = 0.0066 ± 0.01',
      end: 'Λ = 0.0066 ± 0.01',
      provenance:
        'Path C Hybrid (commit 229133e, 2458 zeros, fit |t_c| = 0.0066 + 4.91/N with R² = 0.943). Error bar exceeds central value — cannot yet claim Λ > 0.',
      note:
        'Headline unchanged, but session produced a much richer understanding of what the number represents and what it would take to upgrade it to a theorem-grade RH statement.',
    },
    seededTickets: [
      {
        phase: 'Phase 5',
        ids: ['imp-314', 'imp-315', 'imp-316', 'imp-317'],
        summary:
          'Λ error budget audit, extend Dyson to N=5000, Λ→RH bridge theorem, Guth-Maynard tail certification',
        status: 'all completed by engine',
      },
      {
        phase: 'Phase 6',
        ids: ['imp-318', 'imp-319', 'imp-320', 'imp-321', 'imp-322'],
        summary:
          'verified-computing Dyson integration, Λ≤0 attack note enumerating 4 blockers B1–B4, cross-validation table, push to PT-scale 10^10, analytic monotonicity proof of B(t)',
        status: 'all completed by engine',
      },
      {
        phase: 'Phase 7',
        ids: ['imp-323', 'imp-324', 'imp-325', 'imp-326', 'imp-327'],
        summary:
          'attack each of B1–B4 plus exact Λ≤0 ⟺ RH height mapping',
        status: 'all completed by engine',
      },
      {
        phase: 'Phase 8',
        ids: ['imp-328', 'imp-329', 'imp-330', 'imp-331', 'imp-332'],
        summary:
          'five independent B2 closure angles — imp-328 analytic is the main line; imp-329/331/332 tighten B2(a) statistically; imp-330 reconciles the â=0.0029 vs headline=0.0066 gap',
        status: 'imp-328 pending at session end; others completed',
      },
    ],
    shippedFiles: [
      { path: 'src/data/lambda-error-budget.js', ticket: 'imp-314' },
      { path: 'src/data/dyson-scaling-N5000.js', ticket: 'imp-315' },
      { path: 'src/data/bridge-lambda-rh.js', ticket: 'imp-316' },
      { path: 'src/data/guth-maynard-tail-bound.js', ticket: 'imp-317' },
      { path: 'src/data/interval-dyson-collision.js', ticket: 'imp-318' },
      {
        path: 'src/data/lambda-zero-attack.js',
        ticket: 'imp-319',
        note: 'the B1–B4 blocker enumeration',
      },
      { path: 'src/data/lambda-cross-validation.js', ticket: 'imp-320' },
      { path: 'src/data/lambda-pt-scale-extrapolation.js', ticket: 'imp-321' },
      { path: 'src/data/dyson-monotonicity-proof.js', ticket: 'imp-322' },
      {
        path: 'src/data/lambda-intercept-confidence.js',
        ticket: 'imp-323',
        note: 'the load-bearing B2(a) verdict',
      },
      { path: 'src/data/dyson-slope-analytic-bound.js', ticket: 'imp-324' },
      { path: 'src/data/dyson-collision-lower-bound.js', ticket: 'imp-325' },
      { path: '(GM tail tightening)', ticket: 'imp-326' },
      { path: 'src/data/lambda-rh-height-mapping.js', ticket: 'imp-327' },
      {
        path: '(B2(a) 8-point projection, WLS re-fit, OLS/headline reconciliation, log-spaced ladder)',
        ticket: 'imp-329/330/331/332',
      },
    ],
    keyFinding:
      'imp-323 (the verdict driving Phase 8): OLS on the 5-point Path C baseline gives â ≈ 0.0029, smaller than the headline 0.0066. The one-sided 95% CI on a contains 0 but the upper bound is strictly positive, so B2(a) statistical angle is consistent with Λ ≤ 0 but does not prove it. imp-323 explicitly flags: "Angle (b) — analytic bound on a from the Dyson ODE — remains the only path to a theorem-grade closure."',
    mainLineBlocker: {
      label: 'B2(b)',
      description:
        'Derive an a-priori analytic upper bound on the fit intercept a from the Dyson evolution equation, not from least-squares. Tracked as imp-328 and remains pending at session end. Every other pending ticket either supports this one (by shrinking errors) or is a parallel alternate route.',
      ticket: 'imp-328',
    },
    openQuestions: [
      'Does the 1/N ansatz |t_c| = a + b/N have a quadratic correction + c/N² that would change â when fit with three parameters? (no ticket yet)',
      'Can the B2(a) angles be pooled (OLS baseline + projected 8-point + WLS + log-spaced ladder) into a single Bayesian posterior on a that is tighter than any individual fit? (no ticket yet)',
      'Does the Tao-Rodgers unconditional Λ ≥ 0 interact with our upper bounds in a way that gives a direct analytic attack independent of B1–B4? (no ticket yet)',
      'If imp-328 succeeds, what exact RH statement does the resulting Λ ≤ 0 establish — at what effective height T* from lambda-rh-height-mapping.js? (imp-327 answers for N=2458; not yet re-run for the PT-scale data from imp-321)',
    ],
    metaObservations: [
      'The engine completes ~10 tickets per hour at 60s cadence, mostly substantive — queue consumption is the primary bottleneck, not Claude inference time.',
      'Critical RH tickets consistently take 2–3× longer than random category-rotation improvements (expected — they touch math, not UI).',
      'The engine is good at the pending → completed + real code loop, but does not re-seed itself when the queue drains. A cron monitor is required.',
      'improvement-queue.js is 4300+ lines. Future sessions should consider pagination or archive pruning (tracked as imp-312, pending medium).',
    ],
  },
  {
    id: 'session-2026-06-23',
    date: '2026-06-23',
    title: 'Visual-geometries gallery + honest-SOTA wave',
    engineStateStart:
      'Multi-channel engine pool: opus-4-8 on api-pool bucket, sonnet-4-6 on sonnet bucket, fable-5 on fable bucket. ~159 pending tickets seeded in the giant backlog upgrade. Queue-index cache driving model routing.',
    engineStateEnd:
      'Pool running. ~143 pending. 32 tickets completed in the past 24 h. Overclaim ledger consolidated; assertion sweep gated into npm run build; visual-geometries gallery fully wired with 10 panels.',
    lambdaHeadline: {
      start: 'Λ = 0.0066 ± 0.01 (Path C Hybrid, N=2458)',
      end: 'Λ = 0.0066 ± 0.01 (unchanged — no new ODE data)',
      provenance:
        'Headline unchanged; session focused on visualization, honest-ceiling labeling, and build-hardening rather than numerical tightening.',
      note:
        'C_H wall confirmed RH-HARD (not rigorous-upper-bound). All consumers now carry isRigorousUpperBound=false. Overclaim ledger consolidated in src/data/overclaim-ledger.js.',
    },
    seededTickets: [
      {
        phase: 'Visual geometries wave',
        ids: ['imp-2717', 'imp-2718', 'imp-2719', 'imp-2720', 'imp-2724', 'imp-2726'],
        summary:
          'six new viz panels: prime-density-caustic, euler-product, near-a-zeta-zero, vortex-field animation, caustic-resonance overlay, winding-under-dyson-flow',
        status: 'all completed by engine',
      },
      {
        phase: 'Honest-SOTA / overclaim wave',
        ids: ['imp-2776', 'imp-2777', 'imp-2792'],
        summary:
          'rigor-dashboard pointer fix, overclaim-ledger consolidation, glossary entries for PCC-free/RH-equivalent/C_H wall/vortex-field',
        status: 'all completed by engine',
      },
      {
        phase: 'Build hardening',
        ids: ['imp-2737', 'imp-2745', 'imp-2753'],
        summary:
          'per-module watchdog timeout, fail-inject self-test mode, assertion sweep gated into npm run build',
        status: 'all completed by engine',
      },
    ],
    shippedFiles: [
      { path: 'src/pages/VizPrimeDensityCausticPage.jsx', ticket: 'imp-2717' },
      { path: 'src/pages/VizEulerProductPage.jsx', ticket: 'imp-2718' },
      { path: 'src/pages/VizNearZeroPage.jsx', ticket: 'imp-2719' },
      { path: 'src/pages/VortexFieldPage.jsx', ticket: 'imp-2720', note: 'animated heat-flow sweep tau -4→0' },
      { path: 'src/pages/VizCausticResonancePage.jsx', ticket: 'imp-2724' },
      { path: 'src/pages/VizWindingDysonFlowPage.jsx', ticket: 'imp-2726' },
      { path: 'src/data/overclaim-ledger.js', ticket: 'imp-2777', note: 'shared overclaim-status registry' },
      { path: 'scripts/run-assertions.mjs', ticket: 'imp-2737 / imp-2745 / imp-2753', note: 'watchdog + fail-inject + build gate' },
    ],
    keyFinding:
      'The C_H wall is rigorously RH-HARD: the Gronwall backward-flow integral diverges and no known technique closes it without first proving RH. All pages that previously implied C_H was a rigorous upper bound now carry an honest-ceiling label. The overclaim-ledger.js module is the canonical registry for this status and is imported by all affected consumers.',
    mainLineBlocker: {
      label: 'C_H closure',
      description:
        'C_H = C_shock * C_Lip / 4 requires bounding C_Lip from the backward Gronwall flow integral. The integral diverges without an a-priori RH assumption, making C_H RH-equivalent at best. The highest-leverage open theorem is the Gronwall backward-flow stability bound (imp-2520).',
      ticket: 'imp-2520',
    },
    openQuestions: [
      'Can the Theta-trap + discriminant ladder replace the divergent Gronwall integral for C_H? (imp-2672 — critical)',
      'Is the Theta-trap W_1 Lipschitz modulus N-independent at the microscopic collision scale? (imp-2680 — high)',
      'Does the collision-regularized C_H route survive the Polymath15 C_shock/C_cusp analysis? (imp-2681 — medium)',
      'Can a 2024-2026 literature pass surface a tighter effective coefficient than Heath-Brown 1979 for C_T? (imp-2698 — high)',
    ],
    metaObservations: [
      'Queue-index cache (scripts/queue-index.json) eliminates the need to read 280K-token improvements.js; all engines now read the index first.',
      'Fable-5 model routes to claude-fable-5 via engine-model.json; pool is three-channel (opus / sonnet / fable) with separate buckets.',
      'The honest-SOTA wave (overclaim ledger + honest-ceiling banners) is a standing project: new pages must declare isRigorousUpperBound status on any C_H-derived constant.',
      'Assertion sweep gated into build (npm run build calls node scripts/run-assertions.mjs --fast) catches silent assertion failures before deploy.',
    ],
  },
  {
    id: 'session-2026-06-25',
    date: '2026-06-25',
    title: 'Visual-geometries gallery v3 + honest-ceiling audit wave',
    engineStateStart:
      'Multi-channel pool (opus-4-8 / sonnet-4-6 / fable-5). ~143 pending tickets. Visual-geometries gallery wired from session-2026-06-23, but VisualGeometriesPage panels lacked per-panel honest-ceiling labels and several new viz pages (angular-spacing, zoom-hierarchy) were still in-flight.',
    engineStateEnd:
      'Pool running. ~93 pending. VortexField upgraded to real backward Dyson/CM zero flow (imp-2677). Two new viz pages shipped: AngularSpacingStatsPage (imp-2678) and VizZoomHierarchyPage (imp-2679). All 11 VisualGeometriesPage panels carry explicit honest-ceiling labels. Honest-SOTA audit wave consolidated 30+ banners across ~20 pages. ConceptsPage glossary expanded with C_H Wall, Honest Ceiling, PCC-Free Route, Overclaim Ledger, and Finite-N* Beat.',
    lambdaHeadline: {
      start: 'Λ = 0.0066 ± 0.01 (Path C Hybrid, N=2458)',
      end: 'Λ = 0.0066 ± 0.01 (unchanged — no new ODE data)',
      provenance:
        'Headline unchanged; session focused on visualization hardening and honest-scope labeling, not numerical tightening.',
      note:
        'VortexField animation upgraded from model split to real backward Dyson/CM zero flow. Mathematically honest, but the animation remains illustrative — it does not change the Λ bound.',
    },
    seededTickets: [
      {
        phase: 'Visual-geometries v3',
        ids: ['imp-2677', 'imp-2678', 'imp-2679'],
        summary:
          'VortexField redriven from real backward Dyson/CM zero flow; angular-spacing statistics page (/angular-spacing-stats); zoom-hierarchy of the log-phase prime spiral (/zoom-hierarchy)',
        status: 'all completed by engine',
      },
      {
        phase: 'VisualGeometriesPage honest-ceiling',
        ids: ['imp-2801', 'imp-2922'],
        summary:
          'per-panel honest-ceiling provenance notes added to all 11 VisualGeometriesPage Lambda-claim panels',
        status: 'all completed by engine',
      },
      {
        phase: 'Honest-SOTA banners',
        ids: ['imp-2898', 'imp-2893', 'imp-2941', 'imp-2930', 'imp-2929', 'imp-2943', 'imp-2935'],
        summary:
          'dismissable HonestCeilingBanner on 6 overclaim-risk pages; RelatedLinks on 6 dead-end hub pages; honest-ceiling/scope banners on /supercritical, /calabi-yau, /control, /esy-rigidity-empirical, /odd-zeta',
        status: 'all completed by engine',
      },
      {
        phase: 'Glossary expansion',
        ids: ['imp-2948', 'imp-2949', 'imp-2950'],
        summary:
          'PCC-Free Route, C_H Wall, Honest Ceiling, Overclaim Ledger, and Finite-N* Beat entries added to ConceptsPage',
        status: 'all completed by engine',
      },
    ],
    shippedFiles: [
      {
        path: 'src/pages/VortexFieldPage.jsx',
        ticket: 'imp-2677',
        note: 'upgraded to real backward Dyson/CM zero flow (vortex-v3)',
      },
      {
        path: 'src/pages/AngularSpacingStatsPage.jsx',
        ticket: 'imp-2678',
        note: 'local angular-spacing statistics (/angular-spacing-stats)',
      },
      {
        path: 'src/pages/VizZoomHierarchyPage.jsx',
        ticket: 'imp-2679',
        note: 'zoom hierarchy of the log-phase prime spiral (/zoom-hierarchy)',
      },
      {
        path: 'src/pages/VisualGeometriesPage.jsx',
        ticket: 'imp-2801 / imp-2922',
        note: 'per-panel honest-ceiling provenance on all 11 Lambda-claim cards',
      },
    ],
    keyFinding:
      'The visual-geometries gallery and vortex-field animations are visualization and intuition artifacts, not new rigorous bounds. No panel in VisualGeometriesPage and no viz page changes the Λ headline or opens a new proof route. The VortexField upgrade to real backward Dyson/CM flow makes the animation mathematically honest (real zeros, not a model), but the Λ = 0.0066 ± 0.01 bound is unchanged. All 11 gallery panels now carry explicit honest-ceiling labels: these show known structure under RH, they do not prove it.',
    mainLineBlocker: {
      label: 'C_H closure',
      description:
        'C_H = C_shock * C_Lip / 4 requires bounding C_Lip from the backward Gronwall flow integral. The integral diverges without an a-priori RH assumption. Visualization pages cannot bypass this; the honest-ceiling labels on all panels reflect this blocker.',
      ticket: 'imp-2520',
    },
    openQuestions: [
      'Can the Theta-trap + discriminant ladder replace the divergent Gronwall integral for C_H? (imp-2672 — critical)',
      'Is the vortex winding-number change under real backward Dyson/CM flow quantizable as a topological invariant? (no ticket yet)',
      'Does the angular-spacing CDF of real zeros near a given height match the GUE edge distribution at finite sample size? (no ticket yet)',
      'Can the zoom-hierarchy visualization surface hidden scale-dependent structure in the log-phase prime spiral relevant to the Theta-trap? (no ticket yet)',
    ],
    metaObservations: [
      'The honest-ceiling audit wave (30+ banners across ~20 pages) is a standing pattern: every new page displaying a Λ or C_H estimate must declare isRigorousUpperBound status.',
      'VortexField v3 demonstrates that animation quality can improve without changing the proof state — real backward Dyson/CM flow is honest, but still empirical visualization.',
      'ConceptsPage glossary expansion (C_H Wall, Honest Ceiling, PCC-Free Route, Overclaim Ledger, Finite-N* Beat) establishes shared vocabulary for the honest-SOTA framing project-wide.',
      'The queue-index.json cache continues to be essential for multi-channel routing; engines read only the 4 KB index rather than the 280 K-token improvements.js.',
    ],
  },
];
