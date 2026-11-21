/**
 * @module research-queue-permutation-freeze
 * @fileoverview Research tickets from the permutation-architecture + twistor
 * papers (Gomila 2026-08). SPLICED into improvement-queue.js's IMPROVEMENT_QUEUE
 * array on 2026-08-27 (inline copies, so the fleet's string-parser sees them);
 * this module is kept as the human-readable manifest of the batch.
 *
 * Kept in a dedicated file on purpose: improvement-queue.js is a ~84k-line
 * file the autonomous fleet writes continuously, so direct injection risks
 * git races, id collisions, and appending into the wrong array. Splice these
 * into the tickets array when the fleet is quiescent (or let the queue seeder
 * pull them). Ids use a 95xxx band to stay clear of the fleet's ~36xxx tail.
 *
 * Two workstreams:
 *   B — Aristotle/Lean formalization of the EXACT (E) and proved-implication (C)
 *       components identified by the freeze calculus.
 *   C — the one open family of the strict Λ≤0.14 completion contract + the five
 *       alternative sufficient gates + the [B_v,Π_p] weld.
 *
 * Honest scope on every ticket: none of these promotes Λ≤0.14 or proves RH;
 * no refereed bound is changed. NO QED.
 */

export const PERMUTATION_FREEZE_RESEARCH_TICKETS = [
  // ── B · Aristotle / Lean formalization (E and C components) ────────────────
  {
    id: 'imp-95001',
    title: 'Aristotle-formalize the permutation-defect lemma (Lemma 3.1): reduced adjacent-swap sorting bounds ||T_pi - T_id|| by the sum of pairwise commutator norms over inversions',
    category: 'formalization',
    priority: 'high',
    status: 'pending',
    proofSection: 'permutation-architecture',
    description:
      "Submit the permutation-defect lemma to Aristotle for a Lean-4 proof: for contractions T_1..T_m on a common Hilbert space and a permutation pi, ||T_pi - T_id|| <= sum_{(i,j) in Inv(pi)} ||[T_i,T_j]||, via reduced adjacent-swap (bubble-sort) telescoping. This is an E-status exact operator inequality, self-contained (no analytic zeta input), and is the load-bearing lemma of the typed freeze calculus. Target mathlib v4.28. Report the verified statement + faithfulness caveat. Establishes no bound; NO QED; no refereed bound is changed.",
    rationale: 'Freeze calculus (Permuting the Zeta Twin Ladder, Lemma 3.1): the exact commutator-sum bound underpinning admissible-word equivalence; ideal Aristotle target (discrete/operator, like the frozen-rung lemmas already verified).',
    estimatedComplexity: 'medium',
    dependsOn: [],
    model: 'opus-4-8',
  },
  {
    id: 'imp-95002',
    title: 'Aristotle-formalize the anti-Hermitian strip bound (Prop 2.1): a nonzero characteristic vector at every represented zero gives |Im x| <= eta and, if global, Lambda <= t + eta^2/2',
    category: 'formalization',
    priority: 'high',
    status: 'pending',
    proofSection: 'permutation-architecture',
    description:
      "Submit Proposition 2.1 (anti-Hermitian strip bound) to Aristotle: with L_t(x)=D_t - xI + R_t(x), D_t self-adjoint, K_t(x)=(R_t - R_t^*)/2i and eta=sup||K_t||, if every zero produces v with L_t(x)v=0 then Im(x)||v||^2 = <K_t v,v>, so |Im x|<=eta; combined with the de Bruijn strip contraction, Lambda <= t + eta^2/2. E-status once the (open) global-representation antecedent is taken as hypothesis; Aristotle checks the Rayleigh-quotient logic. Target v4.28. NO QED.",
    rationale: 'Permuting the Zeta Twin Ladder Prop 2.1: the exact operator route from a global characteristic representation to a Lambda bound; the logical skeleton is formalizable even while the antecedent stays open.',
    estimatedComplexity: 'medium',
    dependsOn: [],
    model: 'opus-4-8',
  },
  {
    id: 'imp-95003',
    title: 'Aristotle-formalize the exact five-shell identity E97 = (1-A97)Y4(0) - A97 sum_{g=1..4} Z_g(0) with mutually orthogonal annihilated shells (Fourier-disjoint supports)',
    category: 'formalization',
    priority: 'medium',
    status: 'pending',
    proofSection: 'permutation-architecture',
    description:
      "Submit the exact five-shell recursion/identity to Aristotle (paper Sections 4.3-4.4, eqs. (11)/(12)): the 25 primes <= 97 grouped by the cuts (0,5,10,17,25) into four blocks of sizes 5,5,7,8; the projections Pi_p = I - A_p are commuting self-adjoint orthogonals retaining Fourier modes not divisible by p; the FIVE SHELLS are the annihilated states Z_1..Z_4 plus the live state Y_4 (disjoint Fourier supports), giving the exact cocycle E97 = (1-A97)Y4(0) - A97 sum_{g=1..4} Z_g(0). E-status finite linear-algebra/Fourier identity. Verifies that 'bridge packets' are five orthogonal correlated sectors, not independent balls. Target v4.28. NO QED.",
    rationale: 'Permuting the Zeta Twin Ladder Section 4.4: the exact P97 five-shell identity is a finite, self-contained orthogonality fact — a clean Aristotle target that pins the modulus-barrier ordering constraint.',
    estimatedComplexity: 'medium',
    dependsOn: [],
    model: 'opus-4-8',
  },
  {
    id: 'imp-95004',
    title: 'Aristotle-formalize the packet-estimate -> de Bruijn implication chain (Section 4.7): a strict |E97| < R_ex plus the closed shell/transfer ledger gives wind(H_t0/B_t0)=0 and statement (ii) of Theorem 4.1 via the argument principle',
    category: 'formalization',
    priority: 'high',
    status: 'pending',
    proofSection: 'permutation-architecture',
    description:
      "Submit the Section 4.7 missing-implication chain to Aristotle as a C-status (conditional) Lean proof: from dist(C97,L)>=m97, |A97 H_t0/B_t0 - Q97|<=|A97|eps_tr, and the strict global reserve |E97|<R_ex, derive dist(Q97,L)>0, hence A97 H_t0/B_t0 avoids the closed negative ray, hence (via principal log, DERIVED not assumed) wind(H_t0/B_t0)=0, hence Theorem 4.1(ii). LOAD-BEARING HYPOTHESIS (H3), required for (22)=>(23) and omitted from the paper prose on first reading: R_ex <= m97 - |A97| eps_tr. Use the crisp hypothesis list (H0)-(H6) from the submitted Aristotle job. CONSUME the kernel-verified general argument principle on rectangles (windingRect_eq_sum_analyticOrder; audit-repo PR #30, lean/aristotle/argument_principle/, namespace ArgumentPrinciple) instead of hypothesizing it. Machine-checks the LOGIC from packet estimate to the de Bruijn conclusion; the analytic antecedent (the one open family) stays open. NO QED.",
    rationale: 'Permuting the Zeta Twin Ladder Section 4.7: the exact logical path from the packet estimate to the Lambda conclusion; formalizing it isolates precisely which analytic input (the open family) is missing.',
    estimatedComplexity: 'high',
    dependsOn: ['imp-95002'],
    model: 'opus-4-8',
  },
  {
    id: 'imp-95005',
    title: 'Aristotle-formalize the conditional heat-compatibility lemma (twistor Lemma 6.1): RA=AR + the intertwining square + Ahat_pm F_pm = F_pm A imply I_K Ahat_+ = Ahat_- I_K on ran(F_+)',
    category: 'formalization',
    priority: 'low',
    status: 'pending',
    proofSection: 'twistor-framework',
    description:
      "Submit twistor-framework Lemma 6.1 to Aristotle with the paper hypotheses exactly as stated (Section 6.2 + eq. (12) of Def 5.1): (i) R A = A R (plain commutation of the reflection with the channel heat generator, no I_K term); (ii) the incidence intertwining I_K F_+ = F_- R; (iii) Ahat_pm F_pm = F_pm A. Conclusion: I_K Ahat_+ = Ahat_- I_K on ran(F_+), by composing the three intertwining identities. Pure diagram-chase / operator algebra, C-status (the antecedents F_pm, K remain O-status constructions). Confirms the geometric layer is logically coherent even though it proves no bound. Target v4.28. NO QED; no refereed bound is changed.",
    rationale: 'Consistency-Preserving Twistor Framework Lemma 6.1: a clean conditional operator identity; formalizing it certifies the auxiliary geometric layer as coherent without over-claiming it as proof-bearing.',
    estimatedComplexity: 'medium',
    dependsOn: [],
    model: 'opus-4-8',
  },

  // ── C · The one open family + the five gates + the weld ─────────────────────
  {
    id: 'imp-95006',
    title: 'Approach the one open family of the Lambda<=0.14 completion contract: a uniform correlated enclosure |C_E,17| < 0.27968819555261474 on 690988 <= N <= 54799999, for every window parameter and both seam sides',
    category: 'proof',
    priority: 'critical',
    status: 'pending',
    proofSection: 'permutation-architecture',
    description:
      "The strict Lambda<=0.14 contract reduces to ONE open statement: a uniform bound |C_E,17| < 0.27968819555261474 on the correlated lower edge 690988 <= N <= 54799999. Raw tiling is infeasible (>7.2e26 cells). ASSESS a uniform correlated enclosure of the shifted prime-alias Fresnel-Airy packets that does not tile pointwise: e.g. a single stationary-phase / van der Corput majorant across the window, or a coercive bound on the five-shell correlated sum. Deliver either a uniform enclosure candidate with an explicit error budget vs the 0.0655627 reserve, or a rigorous obstruction. Does not promote Lambda<=0.14 unless the uniform bound is proved; NO QED.",
    rationale: 'Permuting the Zeta Twin Ladder Section 4.2/4.6: the single unresolved final-time boundary of the sharpest mapped route; every other component is closed in scope.',
    estimatedComplexity: 'high',
    dependsOn: [],
    model: 'opus-4-8',
  },
  {
    id: 'imp-95007',
    title: 'Evaluate the five alternative sufficient gates for the open family (full cocycle, 18-moment carrier, retained divisors, physical bulk, cubic canonical sum) and rank by promotability',
    category: 'proof',
    priority: 'medium',
    status: 'completed',
    closureNote: 'EXECUTED 2026-08-28 (5-assessor + synthesis workflow). RANKING: Gate 2 (18-moment carrier) STRONG - same reserve as Gate 1 within 9.671e-15, finite 18-number state makes analytic window-batching well-posed in moment space; Gate 1 viable (largest allowance 0.0655627 but infinite-dimensional residual phase); Gate 4 weak (excises only the h=0 fold - aliases relocate, not removed); Gate 3 weak (21/2000 flat charge is itself an independent-macro-budget pattern); Gate 5 weak/plausibly-dead (0.09619 charge exceeds the whole sibling reserve; measured sibling peak 0.2141 > its 0.1835 target). CROSS-GATE: all five share ONE missing theorem - a correlated cancellation-retaining intra-shell l2 enclosure of the 25-defect telescope (uniform aliased second moment); a Gate-2 producer subsumes Gate 1 verbatim. RECOMMENDED FIRST COMPUTATION spun out as imp-95011. Caveats: allowances not addable across gates; headroom anchored to ONE certified cell (N=690988); global sup unmeasured; nothing promoted; NO QED.',
    proofSection: 'permutation-architecture',
    description:
      "The open family has five exact representations with strict targets on DIFFERENT decompositions (allowances must not be added/subtracted): full cocycle |E97|<0.27968819555526244; 18-moment carrier |C_E,17|+r_num<0.27968819555261 (exact remainder <9.671e-15); retained divisors |E_D|<0.26918819555526 (15,849 branches collapsing to one O(N) transform); physical bulk |E_bulk|<0.27770076312019; cubic canonical sum |E_can|<0.18350115305285. ASSESS which is closest to a uniform estimate and cleanest to promote (paper flags the first two + the 25-defect telescope as smallest exact state). Report per-gate feasibility. Read/derive only; NO QED.",
    rationale: 'Permuting the Zeta Twin Ladder Section 4.8: five exact decompositions of the same remaining problem; picking the most promotable focuses the next computation.',
    estimatedComplexity: 'medium',
    dependsOn: ['imp-95006'],
    model: 'opus-4-8',
  },
  {
    id: 'imp-95008',
    title: 'Analyze the one noncommuting weld [B_v, Pi_p] != 0: bound the shifted Fresnel-Airy alias packets (h != 0, u=v/(k-h/p)) and their correlated coupling through the five shells / 25 defects',
    category: 'proof',
    priority: 'critical',
    status: 'pending',
    proofSection: 'permutation-architecture',
    description:
      "The decisive analytic object is the single noncommuting weld: the smooth zero-alias B-transform and a prime projection do not commute, [B_v,Pi_p]!=0. The h=0 stationary point u=v/k pairs exactly with the reflected B-dual lattice; only the nonzero aliases (u=v/(k-h/p)) create the open correlated packet theorem. MEASURE/BOUND the aliased Fresnel-Airy transition packets and whether their correlated sum stays controlled through the five orthogonal shells or the 25 defects. This commutator, not the already-paired smooth interior, is where the strict route lives. Deliver a quantitative alias bound or a named obstruction. NO QED; no refereed bound is changed.",
    rationale: 'Permuting the Zeta Twin Ladder Section 4.5: [B_v,Pi_p] is identified as THE decisive object; quantifying the alias coupling is the concrete lever on the open family.',
    estimatedComplexity: 'high',
    dependsOn: ['imp-95006'],
    model: 'opus-4-8',
  },

  // ── Possible-gain permutation families (atlas §9/§10.1, added 2026-08-28) ──
  {
    id: 'imp-95009',
    title: 'Approach the graph-compression possible-gain family: a correlated direct/dual graph isometry W_U with anti-Hermitian cancellation, gated on characteristic invariance and a Schur complement gap',
    category: 'proof',
    priority: 'critical',
    status: 'pending',
    proofSection: 'permutation-architecture',
    description:
      "The permutation atlas (Permuting the Zeta Twin Ladder Sections 6.2 + 9) classifies GRAPH COMPRESSIONS as the ONE permutation family with possible gain: for a unitary direct/dual bridge U, the graph isometry W_U v = 2^(-1/2)(v, Uv) gives W_U*(R_+ (+) R_-)W_U = (R_+ + U*R_-U)/2, where the anti-Hermitian parts CAN cancel - the operator analogue of retaining both ladder phases in the P97 center. Two indispensable obligations gate it: (i) every scalar zero must lift to a characteristic vector in the graph (or an exact determinant identity holds); (ii) the antisymmetric complement may not be discarded - the sufficient cellwise Schur condition is g_A > ||E_aa|| and ||E_ss|| + (||C||+||E_sa||)(||C||+||E_as||)/(g_A - ||E_aa||) < g_S (eq. 31). ASSESS: construct a candidate U for the twin-ladder direct/dual channels, measure the anti-Hermitian cancellation actually achieved, and check the two gates on a finite compression. Deliver either a quantified cancellation with the Schur closure verified at finite rank, or a named obstruction. No-gain rule caveat: the isometry alone proves nothing - value only via the invariant compression + complement closure. Changes no bound; NO QED.",
    rationale: 'Permutation atlas Section 9: graph compressions are the only rearrangement family classified POSSIBLE GAIN (correlated average residual can genuinely drop); the two gating obligations are crisply stated - this ticket operationalizes them.',
    estimatedComplexity: 'high',
    dependsOn: [],
    model: 'opus-4-8',
  },
  {
    id: 'imp-95010',
    title: 'Approach the moving-reference Rouche gluing permutation: replace the fixed rough center by a moving analytic reference Q with winding computed by |F-Q|<|Q| chart-gluing (eq. 44), where cancellation makes the constant-center budget too rigid',
    category: 'proof',
    priority: 'critical',
    status: 'pending',
    proofSection: 'permutation-architecture',
    description:
      "Route I's fixed rough center is sufficient but not logically mandatory (Permuting the Zeta Twin Ladder Section 10.1): a moving-reference implementation may retain the dominant zero-alias pair, selected prime aliases, exact gamma factor, and low shells in ONE analytic reference Q; on a closed chart boundary dOmega, Rouche gives |F-Q| < |Q| => wind F = wind Q, so Q need not lie in a fixed half-plane - overlapping analytic phase charts glue by the same inequality on their overlaps. This permutation is attractive exactly where cancellation makes the constant-center budget too rigid - i.e. on the one open family 690988 <= N <= 54799999 (imp-95006). ASSESS: build a pilot moving-reference chart cover on a sub-range of the open family, with explicit Q per chart, the |F-Q|<|Q| margins, and the overlap-gluing bookkeeping; compare the achieved budget against the constant-center |C_E,17| target. Deliver either a pilot chart-cover with margins, or a quantified reason the moving reference does not relax the budget. Changes no bound; NO QED.",
    rationale: 'Permutation atlas Section 10.1 (eq. 44): the second possible-gain permutation, aimed exactly at the open correlated lower-edge family where the fixed-center budget binds; complements imp-95006/95008.',
    estimatedComplexity: 'high',
    dependsOn: ['imp-95006'],
    model: 'opus-4-8',
  },
];
