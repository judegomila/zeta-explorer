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
  {
    id: 'session-2026-09-11-seam-chain-24-25',
    date: '2026-09-11',
    title: 'Seam-chain legs 24-25: two-subspace split (SPLIT-2/ANG-PENCIL) + leave-one-out multi-block split (SPLIT-LOO/EV-OCT)',
    engineStateStart:
      'Signed-seam obligation chain at leg 23 (imp-95233 phase-priced small-theta bound). imp-95226 had named two residuals of the BL-LAT lattice-skeleton certificate as open: the in-octave multiplicity hybrid (a twin pair inside one octave breaks the raw Blaschke-Lagrange bound, per imp-95232 FINDING 3) and off-lattice rates.',
    engineStateEnd:
      'Seam chain advanced to leg 25. imp-95249 delivered THEOREM SPLIT-2 + THEOREM ANG-PENCIL + LEMMA ANG-DET + COROLLARY IN-OCT, the first coalescence-uniform certificate for a single tight in-octave pair. imp-95250 delivered LEMMA LOO + THEOREM SPLIT-LOO + COROLLARY EV-OCT + COROLLARY EV-OCT-UNIF, extending that to a twin pair in every octave at unbounded octave count (m-uniform). Neither changes the Λ headline; both are NO QED and explicitly scoped as model-family certificates, not paper-transferred bounds.',
    lambdaHeadline: {
      start: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      end: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      provenance:
        'Both legs work inside the model-family signed-seam obligation ledger (Cauchy-kernel pencil Lambda(V,d) = lambda_max(D G D, G)); they do not touch the program Λ bound or any verified-height input.',
      note:
        'Explicitly recorded HONEST LIMITS in both modules: imp-95249 is single-tight-pair only (unbounded in-octave multiplicity stays open, the fence tends to 1); imp-95250 needs an abstract m-uniform block Riesz-basis bound for >=3 rates per octave (still open, tracked as imp-95252).',
    },
    seededTickets: [
      {
        phase: 'Seam chain leg 24 (SPLIT-2/ANG-PENCIL)',
        ids: ['imp-95249'],
        summary:
          'THEOREM SPLIT-2: Lambda(V,d) <= [Lambda(V1,d)+Lambda(V2,d)]/(1-sigma) for a two-block partition; THEOREM ANG-PENCIL identifies the subspace angle sigma as a Blaschke-weighted seam pencil (G12 G2^-1 G12^T = G1 - Dp G1 Dp, verified entrywise to rel 1e-9); LEMMA ANG-DET fences sigma via a Blaschke-product determinant, coalescence-uniform (does not depend on the intra-pair separation r-1); COROLLARY IN-OCT fires for x > 7.101831 on the dyadic skeleton, staying finite where the raw Blaschke-Lagrange bound diverges as r -> 1. Refuted along the way: multi-block pairwise-angle Gershgorin (adjacent-octave correlation 0.9428 alone breaks it) and recursive SPLIT-2 peeling (compounds a ~7e3 collar per peel).',
        status: 'completed by engine',
      },
      {
        phase: 'Seam chain leg 25 (SPLIT-LOO/EV-OCT)',
        ids: ['imp-95250'],
        summary:
          'LEMMA LOO: a leave-one-out skew-projection bound ||F_k|| <= ||F||/sqrt(1-sigma_k^2) per block; THEOREM SPLIT-LOO: sqrt(Lambda(V,d)) <= sum_k sqrt(Lambda_k/(1-sigma_k^2)), paid additively per block instead of compounding; COROLLARY EV-OCT fires for x > 11.31664 with a twin pair in every octave of a 6-octave dyadic skeleton (m-uniform); COROLLARY EV-OCT-UNIF extends to unbounded octave count via a rigorous geometric tail bound (PhiUnif >= 9.98e-21). At m=2 neither SPLIT-2 nor SPLIT-LOO dominates the other (ratio depends on block-Lambda symmetry and sigma).',
        status: 'completed by engine',
      },
    ],
    shippedFiles: [
      {
        path: 'src/data/imp-95249-inoctave-pair-split-certificate.js',
        ticket: 'imp-95249',
        note: 'SPLIT-2 / ANG-PENCIL / ANG-DET / IN-OCT, first coalescence-uniform in-octave-pair certificate',
      },
      {
        path: 'src/data/imp-95250-leaveoneout-multiblock-split-certificate.js',
        ticket: 'imp-95250',
        note: 'LOO / SPLIT-LOO / EV-OCT / EV-OCT-UNIF, first m-uniform every-octave twin certificate',
      },
    ],
    keyFinding:
      'The two-block SPLIT-2 angle price and the additive multi-block SPLIT-LOO price are the same underlying seam-pencil object (LEMMA ANG-DET, reused unchanged in leg 25), applied once per block instead of compounding recursively. Together they fence both named residuals of the imp-95226 in-octave-multiplicity gap on lattices, at the cost of an explicit collar (~236x above the exact pencil for the single pair; ~1.6e4x for the every-octave case at m=6, per the imp-95283 honest-status note) and a firing-onset delay (7.10 / 11.32 vs the twin-free BL onset of 4.24).',
    mainLineBlocker: {
      label: 'block Riesz-basis / obligation (2) signed weight',
      description:
        'The surviving obstruction for >=3 rates per octave is a genuine m-uniform block Riesz-basis (Carleson-type) lower bound for cluster decompositions of exponential systems on geometric lattices -- the pairwise-angle route to it is refuted in imp-95249. Separately, signed-seam obligation (2) still needs a WEIGHT-channel port (count is closed via SGN-NP/SGN-C) or a modulus/phase route.',
      ticket: 'imp-95252',
    },
    openQuestions: [
      'Does an m-uniform block Riesz-basis bound exist for clusters with >=3 rates per octave, replacing the linear-in-m LOO collar with something sharper? (imp-95252 — high)',
      'How does the SPLIT-LOO / EV-OCT certificate degrade off the dyadic lattice (non-power-of-2 octave ratios)? (imp-95253 — medium)',
      'Where exactly does SPLIT-2 stop dominating SPLIT-LOO (and vice versa) across asymmetry and depth, beyond the single measured crossover point? (imp-95256 — medium)',
      'Can the LEMMA TAIL crude PhiUnif lower bound (9.98e-21 at N=30) be tightened against the exact infinite cross-Blaschke product? (imp-95259 — low)',
    ],
    metaObservations: [
      'This is a documentation-only session entry (no proof or numerical work performed here) — it records two legs (imp-95249, imp-95250) already committed to the seam-chain by prior engine runs, per imp-95260.',
      'The seam chain now stands at 25 legs; every leg to date changes NO Λ bound and carries explicit HONEST LIMITS / NO QED language — the chain is scoped as a model-family (Cauchy-kernel pencil) research program, not a paper-transferred result.',
      'Both modules cross-reference and reuse each other’s lemmas (LEMMA ANG-DET proven in imp-95249 is reused unchanged in imp-95250), which is the intended pattern for this chain: later legs extend rather than re-derive earlier ones.',
    ],
  },
  {
    id: 'session-2026-09-11-two-rate-band-edges-direct-rootfind',
    date: '2026-09-11',
    title: 'Direct root-find of the two-rate reentry-band edges (imp-35259)',
    engineStateStart:
      'imp-35243 R2 (single-rate vs two-rate surrogate fidelity) open. imp-35331 had reconstructed the two-rate ceil argument x_two but located the relocated off-by-one frac-window band only via a linear-drift extrapolation (reentry ~10^48.85, width ~17.4 decades), and imp-35332 showed the underlying drift decays like 1/(K log T0 - N_cross) rather than staying constant.',
    engineStateEnd:
      'imp-35259 bisects the two-rate phase directly (for x_two = 11 + W reentry and x_two = 12 exit, p in {1,2,3}) instead of extrapolating. The single-rate control root-finder reproduces the imp-35111 band edges exactly, confirming the locator is faithful. R2 / imp-35243a stay OPEN; this is measurement/assessment only.',
    lambdaHeadline: {
      start: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      end: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      provenance:
        'imp-35259 measures reentry-band edges on the inherited imp-3220/imp-3406 double surrogate; it does not touch the program Λ bound or any verified-height input.',
      note: 'Assessment only, isRigorous false, NO QED.',
    },
    seededTickets: [
      {
        phase: 'Reentry-band direct root-find',
        ids: ['imp-35259'],
        summary:
          'Directly bisecting the two-rate ceil-argument phase locates band edges far above the imp-35331 linear-drift extrapolation: p=1 reentry 10^60.66 (exit 10^178.35, width 117.69 decades) vs the single-rate band 10^27.08 / 10^37.17 / 10.08 decades -- a ~33-decade upward shift and ~12x widening. The imp-35331 extrapolation undershoots the direct p=1 reentry by ~11.8 decades and the width by a factor ~6.8, because it linearized a drift that in fact decays (imp-35332).',
        status: 'completed by engine',
      },
    ],
    shippedFiles: [
      {
        path: 'src/data/imp-35259-two-rate-band-edges-direct-rootfind.js',
        ticket: 'imp-35259',
        note: 'direct bisection of the two-rate reentry-band edges, corrects the imp-35331 linear-drift extrapolation',
      },
    ],
    keyFinding:
      'The two-rate frac-window band persists (it does not vanish) but is relocated far above and wider than both the single-rate band and the prior linear-drift estimate of its position. Single-rate fidelity is decisively not automatic for the band position or width.',
    mainLineBlocker: {
      label: 'R2 single-rate/two-rate surrogate fidelity',
      description:
        'This module discharges nothing: it does not certify which rate model is faithful to the true dynamic at ~10^37, so the off-by-one whether-question routes back onto R1 (terminal ceil / EPS_FP floor) per the imp-35330 DAG.',
      ticket: 'imp-35243',
    },
    openQuestions: [
      'Which rate model (single- or two-rate) is faithful to the true dynamic near the reentry band, and does R1 resolve the off-by-one independent of that choice? (imp-35243a — open)',
    ],
    metaObservations: [
      'This session entry is documentation only, recording a result already computed and committed by prior engine runs (imp-35259).',
    ],
  },
  {
    id: 'session-2026-09-11-gate2-frozen-spec-and-01399-unpark-independent',
    date: '2026-09-11',
    title: 'Gate-2 frozen spec (imp-95012) and the 0.1399-row UNPARK-INDEPENDENT disposition',
    engineStateStart:
      'The imp-95012 transcription of the Gate-2 frozen spec (eqs. 8-20 of the twin-ladder permutation architecture PDF) and the 0.1399-row (Lemma 4.4 / Theorem 4.5, ROW_01399_DECISION) were both already shipped as data modules, but no research-journal entry recorded the frozen row or the UNPARK-INDEPENDENT disposition reasoning.',
    engineStateEnd:
      'Frozen row (eq. 8): t0 = 24727519/200000000 = 0.123637595, y0 = 1809/10000 = 0.1809, verified-height anchor X = 6000000185827, target t0 + y0^2/2 = 7/50 = 0.14. The anchor cell at N=690988 is proven (|E97(x)| < 0.2141254901198318 < Rex = 0.2796881955526244146..., reserve 0.0655627054327926), but uniform coverage of the open family 690988 <= N <= 54799999 is not: a raw-tiling atlas at anchor width would need > 7.20e26 cells, so that route stays open. The 0.1399 row (y* = 33/200 = 0.165, t* = 10103/80000, target 1399/10000 = 0.1399) was assessed as ROW_01399_DECISION = UNPARK-INDEPENDENT: it is reached via two new, uncertified hypotheses (a rectangular slab H_tau(u+iv) != 0 on [X, X+1] x [y*, 1] x [0, t*], and a directed final-time tail H_{t*}(x+iv) != 0 for x >= X+1) instead of the Gate-2 residual cocycle, so it does not presuppose the open-family question and should be tracked on its own lane rather than blocked on or resolved by it.',
    lambdaHeadline: {
      start: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      end: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      provenance:
        'Both the Gate-2 frozen-spec transcription and the 0.1399-row disposition are bookkeeping/assessment on the twin-ladder permutation architecture; neither touches the program Λ bound or any verified-height input.',
      note: 'Documentation only, isRigorous false, NO QED.',
    },
    seededTickets: [
      {
        phase: 'Gate-2 frozen-spec and 0.1399-row record-keeping',
        ids: ['imp-95012', 'imp-95062'],
        summary:
          'imp-95012 transcribed the frozen Gate-2 spec (frozen row, two-ladder coefficient, E97 residual cocycle, carrier-remainder target, and the single proven anchor cell) from the source PDF; imp-95062 records that spec and the separately-reached 0.1399-row UNPARK-INDEPENDENT disposition in the research journal.',
        status: 'completed by engine',
      },
    ],
    shippedFiles: [
      {
        path: 'src/data/imp-95012-gate2-frozen-spec.js',
        ticket: 'imp-95012',
        note: 'transcription of the Gate-2 frozen spec (eqs. 8-20), anchor cell, and open-family raw-tiling cell count',
      },
    ],
    keyFinding:
      'The 0.1399 row and the Gate-2 0.14 row share the same verified height X and a similar-style initial condition ((1+y*)/2 = 0.5825, tighter than the 0.14 row’s 0.59045), but the 0.1399 row substitutes a compact slab plus one final-time tail for the Gate-2 residual cocycle -- so its UNPARK-INDEPENDENT status is a genuine decoupling, not a coincidence of shared inputs.',
    mainLineBlocker: {
      label: 'Gate-2 open-family coverage',
      description:
        'The Gate-2 anchor cell at N=690988 is proven, but uniform coverage of 690988 <= N <= 54799999 across every window parameter and both seam sides is not: raw tiling at anchor width would need more than 7.20e26 cells, so this remains the open family the frozen spec is measured against.',
      ticket: 'imp-95012',
    },
    openQuestions: [
      'Does a non-raw-tiling covering strategy bring the Gate-2 open family (690988 <= N <= 54799999) within reach, or does it stay parked pending a structurally different certificate?',
    ],
    metaObservations: [
      'This session entry is documentation only, recording the frozen spec and disposition already computed and committed by prior engine runs (imp-95012 and the ROW_01399_DECISION work).',
    ],
  },
  {
    id: 'session-2026-09-11-witness-floor-independent-reaudit',
    date: '2026-09-11',
    title: 'Independent re-audit of the witness-FLOOR currency (imp-95017)',
    engineStateStart:
      'The proof-logic referee that passed the far bracket re-audited the CEILING side (the nineteenth-continuation exact pair correlation) but explicitly did not re-audit the FLOOR side: the multi-rate floor evaluator floorMultiRate, the sharp-MAJ legality amplitude hLegal, and the carried floor literals HEAD_FLOOR = 0.096745062937484763 and F97_FLOOR = 0.0012054673720820889 that feed every tracked gap were unverified by an independent path.',
    engineStateEnd:
      'imp-95017 re-derives the floor machinery (cross-rate kernel K, exact excess E, far mass M, sharp-MAJ legality h, tail Tx) through a code path that shares no helper with the sibling modules -- a different three-piece antiderivative decomposition plus independent Simpson quadrature for K, and an independent full-line Gram quadrature for E. The BASE four-packet floors (theta = 10 headline 0.092871808411129783, fixed-97 0.0012038255978826329) reproduce to rel < 1e-6 (measured 1.2e-10 and 1.3e-14), and the closed-form excess matches the Gram quadrature to rel 5.2e-7, so floorMultiRate carries no coding bug in E, M, K, or h.',
    lambdaHeadline: {
      start: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      end: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      provenance:
        'imp-95017 re-audits the referee-unverified floor side of the twin-ladder permutation architecture far bracket; it changes no bound and does not touch the program Λ bound or any verified-height input.',
      note: 'Independent re-audit only, isRigorous true (for the machinery re-derivation), NO QED.',
    },
    seededTickets: [
      {
        phase: 'Witness-FLOOR independent re-audit',
        ids: ['imp-95017', 'imp-95079'],
        summary:
          'imp-95017 independently re-derived the floor machinery and BASE four-packet floors of the multi-rate witness currency; imp-95079 records that re-audit in the research journal.',
        status: 'completed by engine',
      },
    ],
    shippedFiles: [
      {
        path: 'src/data/imp-95017-witness-floor-reaudit.js',
        ticket: 'imp-95017',
        note: 'independent re-derivation of K, E, M, h, Tx and cross-check of the BASE four-packet floors against the carried literals',
      },
    ],
    keyFinding:
      'The BASE multi-rate floors are independently confirmed free of a coding bug in floorMultiRate. A separate honest-partial note: the tail sum Tx truncates at the first term underflowing to the IEEE double denormal floor (theta = 2 at j = 807, theta = 10 at j = 162), which drops positive tail mass and makes the reported floor F = E/(Tx M) strictly larger than the true floor -- floor-UNSAFE in direction, but with a first-dropped-term magnitude of ~1e-324, negligible against the ~1e-8 float rounding already priced.',
    mainLineBlocker: {
      label: 'imp-95017-subgap-append-lift',
      description:
        'This module re-audits the floor MACHINERY and the BASE floors only. The append-chain LIFT from the base floors (0.092871808411129783, 0.0012038255978826329) to the carried terminal literals HEAD_FLOOR and F97_FLOOR is performed by the occupied-block appends (fifteenth continuation) and the cancellation-aware corner envelope (sixteenth continuation); that lift is not independently re-derived here and remains the residual sub-gap.',
      ticket: 'imp-95017',
    },
    openQuestions: [
      'Does an independent path also reproduce the append-chain lift from the base floors to the carried terminal literals HEAD_FLOOR and F97_FLOOR? (imp-95017-subgap-append-lift -- open)',
    ],
    metaObservations: [
      'This session entry is documentation only, recording a re-audit already computed and committed by prior engine runs (imp-95017).',
    ],
  },
  {
    id: 'session-2026-09-11-paper-packet-far-ceiling-transfer',
    date: '2026-09-11',
    title: 'Paper-packet transfer assessment of the far-bracket ceiling ledger (imp-95026)',
    engineStateStart:
      'The nineteenth-continuation far-bracket ceiling reduces the model-family ledger from the pre-seventeenth 4 down to the closed-form literal 0.2717408057586117, but that reduction is stated only at the model-normalized packet constants (sigma=1, beta=1/3, c=v=D=1, theta=10); whether the far coefficient stays below 4 at the actual Section 4.5 paper packet constants was untested.',
    engineStateEnd:
      'imp-95026 parameterizes the far coefficient cFar = 2(sup_b OmegaE_b)/Tx(2) over (sigma, theta, beta, isolation Q) and scans a neighborhood around the model point. FINDING 0: the packet amplitude A_d cancels out of cFar entirely (it enters only the mass M on the other side of the roll-up inequality), so of the five named paper constants only four (sigma, theta, beta, Q) drive the ledger. FINDING 1: quadrature reproduces the model closed-form ceiling to rel 2.8e-6 and maps the levers -- s = sigma+theta and Q are dominant, beta is weak (~6 percent over 0.25..0.5). FINDING 2: the ledger TRANSFERS, staying strictly below 4 across the whole scanned neighborhood (worst 0.8924623374689161 at theta=2). FINDING 3: it DEGRADES about 3x in the low-theta regime. FINDING 4: the EXACT-substitution proof underlying the ceiling BREAKS below s = sigma+theta = 2.948383274238082, where the Lemma RM corner guard fails and the argument falls back to the (weaker) eighteenth window envelope.',
    lambdaHeadline: {
      start: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      end: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      provenance:
        'imp-95026 is a sensitivity map of the far-bracket ceiling ledger over the four undetermined paper-packet constants; it instantiates no paper number and changes no bound.',
      note: 'Measurement/derivation assessment, NO QED.',
    },
    seededTickets: [
      {
        phase: 'Paper-packet far-ceiling transfer',
        ids: ['imp-95026', 'imp-95080'],
        summary:
          'imp-95026 mapped the far-bracket ceiling transfer behavior over the four live paper-packet levers; imp-95080 records that assessment in the research journal.',
        status: 'completed by engine',
      },
    ],
    shippedFiles: [
      {
        path: 'src/data/imp-95026-paper-packet-ceiling-transfer.js',
        ticket: 'imp-95026',
        note: 'far coefficient cFar parameterized over (sigma, theta, beta, isolation Q), scanned around the model point, with the Lemma RM exact-proof break boundary located at s*',
      },
    ],
    keyFinding:
      'The far-bracket ceiling reduction is not fragile to the packet amplitude (A_d cancels structurally) and, over the scanned neighborhood, not fragile to the other four constants either (the ledger stays below 4 throughout, degrading to a worst case of ~0.89 at low theta). The one real risk this isolates is proof-domain, not numeric: the exact-substitution argument breaks below s = 2.948383274238082, below which the ceiling would need the weaker window-envelope fallback.',
    mainLineBlocker: {
      label: 'imp-95026-subgap-packet-constants-unpinned',
      description:
        'This is a sensitivity MAP, not an instantiated paper-packet number: the actual Section 4.5 constants (sigma, theta, beta, isolation Q) are not pinned in this repo, so which regime (transfers cleanly, degrades, or falls into the proof-break band) the real paper point occupies is still open.',
      ticket: 'imp-95026',
    },
    openQuestions: [
      'What are the actual Section 4.5 paper-packet values of (sigma, theta, beta, Q), and do they fall above or below the s* = 2.948383274238082 exact-proof break boundary? (imp-95026-subgap-packet-constants-unpinned -- open)',
    ],
    metaObservations: [
      'This session entry is documentation only, recording a transfer assessment already computed and committed by prior engine runs (imp-95026).',
    ],
  },
  {
    id: 'session-2026-09-11-headline-gap-attribution',
    date: '2026-09-11',
    title: 'Attribution of the 2.81x far-bracket headline gap (imp-95045)',
    engineStateStart:
      'The nineteenth continuation makes the per-pair envelope bound MAJ-class sharp, yet the headline gap between the witness floor (0.096745062937484763) and the achieved ceiling (0.2717408057586117) is still 2.8088338309749887. The open question posed a binary: does the residual live in (i) MAJ-class looseness against the true packet decay, or (ii) witness-floor looseness?',
    engineStateEnd:
      'imp-95045 finds the binary is INCOMPLETE. FINDING 1: the tail-truncation currency Tx(2) cancels identically between ceiling and floor and contributes exactly 1.000x -- ruled out as a gap source. FINDING 2: the DOMINANT contributor, ~67% of the log-gap, is the achieved-side parity AM-GM factor 2 (||x+y||^2 <= 2(||x||^2+||y||^2) applied across even/odd block color classes) -- a THIRD category outside the ticket binary, present only on the ceiling side and declared uniformly unrecoverable by the eleventh continuation. FINDING 3: the residual sub-sqrt(2) factor 1.4044169154874944x is, within the MODEL family (where MAJ equals the true decay by construction), witness-floor-side -- the exhibited witness realizes only 71.2% of the parity-halved ceiling, with MAJ-internal substitution slack bounded at <= 0.4 percent. The paper-packet split of (i) vs (ii) is deferred to the open packet-envelope constants.',
    lambdaHeadline: {
      start: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      end: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      provenance:
        'imp-95045 is an attribution audit of the headline far-bracket gap; it derives or changes no floor, ceiling, or bound literal.',
      note: 'Attribution assessment, NO QED.',
    },
    seededTickets: [
      {
        phase: 'Headline far-bracket gap attribution',
        ids: ['imp-95045', 'imp-95085'],
        summary:
          'imp-95045 attributed the 2.81x headline gap across the tail-truncation (cancels), the parity AM-GM factor 2 (dominant, ceiling-side, unrecoverable), and the residual 1.4044x (model-family witness-floor-side); imp-95085 records that attribution in the research journal.',
        status: 'completed by engine',
      },
    ],
    shippedFiles: [
      {
        path: 'src/data/imp-95045-headline-gap-attribution.js',
        ticket: 'imp-95045',
        note: 'multiplicative decomposition gap = (parity AM-GM 2.0) x (residual 1.4044169154874944), with the Tx(2) cancellation identity and the model-family witness-realization ratio 0.712039273361276',
      },
    ],
    keyFinding:
      'Neither half of the original binary carries the majority of the gap: the dominant ~67% (log-scale) is a ceiling-side parity AM-GM factor already fixed as unrecoverable, and the remaining sub-sqrt(2) residual is, at least within the model family, witness-floor-side rather than MAJ-envelope-side. No single-lever factor-2 improvement is available.',
    mainLineBlocker: {
      label: 'imp-95045-subgap-paper-packet-split',
      description:
        'Separating option (i) MAJ-envelope-vs-true-decay from option (ii) witness looseness for the actual PAPER packets, as opposed to the model family, requires the paper packet-envelope constants (c, beta, sigma, theta, A_d), which remain open (sibling openResiduals[0]). The model-family verdict is a lower bound on the witness-side share, not a paper-packet verdict.',
      ticket: 'imp-95045',
    },
    openQuestions: [
      'With the paper packet-envelope constants pinned, does part of the residual 1.4044x migrate from witness-floor-side (ii) back to MAJ-envelope-side (i)? (imp-95045-subgap-paper-packet-split -- open)',
    ],
    metaObservations: [
      'This session entry is documentation only, recording an attribution audit already computed and committed by prior engine runs (imp-95045).',
    ],
  },
  {
    id: 'session-2026-09-11-far-coefficient-quadrature-cross-check',
    date: '2026-09-11',
    title: 'Cross-check of the far-coefficient midpoint quadrature against an independent reference (imp-95073)',
    engineStateStart:
      'imp-95026 verifies its midpoint-quadrature evaluator for the far coefficient cFar only at the single model point (sigma=1, beta=1/3, c=v=D=1, theta=10), reproducing the closed-form ceiling 0.2717408057586117 to relative 2.8e-6; the quadrature error at the other scanned thetaScan points had no independent control.',
    engineStateEnd:
      'imp-95073 cross-checks the committed midpoint evaluator against an independent adaptive-Simpson reference split at the integrand corners u=0 and u=T (tol 1e-12). FINDING 0: at the model point the reference reproduces the exact closed form to relative 7.5e-9, three orders tighter than the midpoint 2.8e-6, validating it as an independent yardstick. FINDING 1: across the integer-s thetaScan the midpoint error is uniformly bounded by ~1.3e-5 (1.81e-6 at s=9, 2.82e-6 at s=11, 4.10e-6 at s=13, 5.68e-6 at s=15, 1.23e-5 at s=21) but GROWS monotonically with s, so the model-point 2.8e-6 is a mid-range figure, not a uniform bound. FINDING 2: the worst error ~1.3e-5 is far below every margin the imp-95026 transfer verdict turns on, so the qualitative conclusions (transfers / degrades ~3x / breaks below s*=2.9484) are unaffected.',
    lambdaHeadline: {
      start: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      end: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      provenance:
        'imp-95073 bounds the quadrature error of an already-committed sensitivity map (imp-95026); it derives or changes no floor, ceiling, or bound literal.',
      note: 'Measurement/error-control assessment, NO QED.',
    },
    seededTickets: [
      {
        phase: 'Far-coefficient quadrature cross-check',
        ids: ['imp-95073', 'imp-95103'],
        summary:
          'imp-95073 bounded the imp-95026 midpoint far-coefficient quadrature error uniformly (~1.3e-5, growing with s) against an independent adaptive-Simpson reference; imp-95103 records that cross-check in the research journal.',
        status: 'completed by engine',
      },
    ],
    shippedFiles: [
      {
        path: 'src/data/imp-95073-far-coefficient-quadrature-cross-check.js',
        ticket: 'imp-95073',
        note: 'independent adaptive-Simpson reference (corner-split, tol 1e-12) cross-checked against the committed midpoint thetaScan values, plus a bit-reproduction faithfulness check of the copied midpoint machinery',
      },
    ],
    keyFinding:
      'The imp-95026 midpoint quadrature is not exact even at reported precision -- its error grows with the decay exponent s -- but the growth stays four to five orders of magnitude below the smallest margin any imp-95026 finding depends on, so none of those findings are put at risk by discretization error.',
    mainLineBlocker: {
      label: 'imp-95073-subgap-non-integer-s-anchor',
      description:
        'The exact-closed-form anchor exists only on the integer-s thetaScan (sigma=1); the sigmaScan and isolationScan pass through non-integer s and different Q where no closed-form literal is baked, so there the error is controlled only by Simpson-vs-midpoint agreement (a converged independent rule), not a second exact anchor.',
      ticket: 'imp-95073',
    },
    openQuestions: [
      'Does a uniform quadrature-error certificate extend from the anchored integer-s thetaScan to the whole continuous transfer scan theta in [2,20]? (imp-95073-subgap-non-integer-s-anchor -- open; imp-95120 addresses this)',
    ],
    metaObservations: [
      'This session entry is documentation only, recording a quadrature cross-check already computed and committed by prior engine runs (imp-95073).',
    ],
  },
  {
    id: 'session-2026-09-11-isolation-Q-far-ceiling-sensitivity',
    date: '2026-09-11',
    title: 'Isolation-constant Q sensitivity of the far-bracket ceiling (imp-95075)',
    engineStateStart:
      'imp-95026 Finding 1 identifies the isolation constant Q = (c D^(1-beta)/v) 2^(-(1-beta)) as the single group through which the three physical constants (c, v, D) enter the far coefficient cFar, and shows cFar grows with Q, but only via a tabulated isolationScan indexed by c -- the local sensitivity dcFar/dQ at the model point, and where the paper Q would sit relative to that derivative, were not derived.',
    engineStateEnd:
      'imp-95075 derives the central-difference sensitivity dcFar/dQ = 0.3816620268743663 at the model point Q0 = 2^(-2/3) = 0.6299605249474366 (cFar0 = 0.2717400426244421), giving a dimensionless elasticity of 0.8847868296486842 -- a strong, near-proportional lever comparable to s = sigma + theta and far stronger than beta (~6 percent over 0.25..0.5, imp-95026 Finding 1). It further finds cFar(Q) is CONCAVE (secant slope falls monotonically from ~0.44 near c=0.5 to ~0.17 near c=2), so the local linear model over-predicts the ceiling above the model point (6.49 percent over at Q(c=1.5): 0.39195604802558137 predicted vs 0.36807989528190543 actual), making the derivative a conservative upper estimate in the direction that matters for transfer risk. The Q-indexed isolationScan spans Q in [0.315, 1.260] with cFar rising monotonically 0.137 -> 0.421, all far below the pre-seventeenth 4; even the conservative linear model needs Q ~ 10.4 (c ~ 16.5) to reach cFar = 4.',
    lambdaHeadline: {
      start: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      end: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      provenance:
        'imp-95075 derives a local sensitivity and re-indexes an already-committed sensitivity map (imp-95026); it instantiates no paper number and changes no bound.',
      note: 'Measurement/derivation assessment, NO QED.',
    },
    seededTickets: [
      {
        phase: 'Isolation-Q far-ceiling sensitivity',
        ids: ['imp-95075', 'imp-95104'],
        summary:
          'imp-95075 derived the isolation-group sensitivity dcFar/dQ=0.3816620268743663 (elasticity 0.8847868296486842) and located the model Q on the concave cFar(Q) curve; imp-95104 records that derivation in the research journal.',
        status: 'completed by engine',
      },
    ],
    shippedFiles: [
      {
        path: 'src/data/imp-95075-isolation-Q-far-ceiling-sensitivity.js',
        ticket: 'imp-95075',
        note: 'central-difference dcFar/dQ and elasticity at the model point, concavity over-prediction check at Q(c=1.5), and the isolationScan re-indexed by Q',
      },
    ],
    keyFinding:
      'The isolation group Q is a strong (~0.88-elastic) lever on the far-bracket ceiling, comparable to s = sigma + theta, but cFar(Q) is concave, so the sensitivity is conservative (over-predicting) in the direction that matters -- and even a large isolation mis-estimate keeps the ledger comfortably below 4.',
    mainLineBlocker: {
      label: 'imp-95075-subgap-paper-Q-unpinned',
      description:
        'The actual Section 4.5 physical constants (c, v, D), hence the paper Q, are not pinned in this repository; this module places the MODEL Q on the scan and gives the local sensitivity and elasticity, but reading the paper cFar off this curve needs the paper (c, v, D, beta) values.',
      ticket: 'imp-95075',
    },
    openQuestions: [
      'What are the actual Section 4.5 values of (c, v, D), and where does the resulting paper Q land on the concave cFar(Q) curve relative to the below-4 margin? (imp-95075-subgap-paper-Q-unpinned -- open; shares the sibling imp-95026-subgap-packet-constants-unpinned gap)',
    ],
    metaObservations: [
      'This session entry is documentation only, recording a sensitivity derivation already computed and committed by prior engine runs (imp-95075).',
    ],
  },
  {
    id: 'session-2026-09-11-adin-cancellation-independent-trace',
    date: '2026-09-11',
    title: 'Independent trace of the imp-95026 amplitude-cancellation claim (imp-95076)',
    engineStateStart:
      'imp-95026 Finding 0 asserts the packet amplitude A_d cancels from the far coefficient cFar = 2 (sup_b OmegaE_b) / Tx(2) and instead enters only the mass M on the other side of the roll-up inequality, but the imp-95026 code path checks this by calling farCoefficient with no amplitude argument at all -- a tautology by construction, not an independent trace.',
    engineStateEnd:
      'imp-95076 re-derives the same claim on a fully independent code path: composite Simpson quadrature (instead of the imp-95026 midpoint rule) with amplitude threaded as an explicit argument. FINDING A: the Simpson evaluator reproduces the model closed-form ceiling at the model point to relative 2.18e-4 (0.2716816410981926 vs 0.2717408057586117), confirming cFar is not an artifact of the midpoint code path. FINDING B: scanning amplitude A in {0.5, 1, 2, 3, 7} returns a bit-identical cFar = 0.2716816410981926 at every value -- none of the SHAPE functionals (cornerV, rhoCap, the decay exponent s = sigma+theta, phiTail) consume A. FINDING C: the mass M(A) = A^2 sum_b r_b rescales exactly as A^2 for any positive radii (M(A)/A^2 = 4.241406839130188 constant to machine precision on representative radii). FINDING D: the assembled ceiling term 2(sup_b OmegaE_b) M divided by A^2 is likewise constant (0.0003327244461629), so of the five named paper constants only four (sigma, theta, beta, isolation Q) drive the far-bracket ledger; A_d rescales the mass side only.',
    lambdaHeadline: {
      start: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      end: 'Platt-Trudgian Λ ≤ 0.2 (SOTA, unchanged)',
      provenance:
        'imp-95076 independently corroborates an already-committed structural claim (imp-95026 Finding 0) on a separate quadrature path; it instantiates no paper number and changes no bound.',
      note: 'Measurement/verification assessment, NO QED.',
    },
    seededTickets: [
      {
        phase: 'Independent A_d-cancellation trace',
        ids: ['imp-95076', 'imp-95105'],
        summary:
          'imp-95076 independently traced the amplitude cancellation on a composite-Simpson path (cFar bit-invariant across A, mass exactly A^2-scaled); imp-95105 records that trace in the research journal.',
        status: 'completed by engine',
      },
    ],
    shippedFiles: [
      {
        path: 'src/data/imp-95076-adin-cancellation-trace.js',
        ticket: 'imp-95076',
        note: 'independent composite-Simpson quadrature with amplitude threaded as an explicit argument, amplitude scan over cFar, and mass/ceiling-term rescaling checks',
      },
    ],
    keyFinding:
      'The A_d cancellation is not a tautology of the imp-95026 code path: a fully independent quadrature rule with amplitude as an explicit argument reproduces both the closed-form ceiling and the cancellation, and additionally confirms the mass rescales exactly as A_d^2 for arbitrary positive radii, isolating the far-bracket ledger to four (not five) live paper-packet constants.',
    mainLineBlocker: {
      label: 'imp-95026-subgap-packet-constants-unpinned',
      description:
        'This trace establishes STRUCTURE only (cFar amplitude-invariant, M proportional to A_d^2 for any positive radii), not a numeric paper mass: the actual Section 4.5 packet radii r_d and amplitude A_d are still not pinned in this repository.',
      ticket: 'imp-95076',
    },
    openQuestions: [
      'What are the actual Section 4.5 paper-packet radii r_d and amplitude A_d, so the mass M can be instantiated to a single concrete number rather than a proportionality? (imp-95026-subgap-packet-constants-unpinned -- open)',
    ],
    metaObservations: [
      'This session entry is documentation only, recording an independent verification trace already computed and committed by prior engine runs (imp-95076).',
    ],
  },
];
