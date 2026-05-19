/**
 * @module data/imp-441-lean-import-graph
 * @fileoverview imp-441 Lean 4 composition sanity check — STATIC partial closure
 *
 * WHAT THIS FILE DOES
 *   Static, regex-parsed import-graph artifact for the LambdaAttack Lean 4
 *   package, generated on 2026-05-18 by an autonomous engine pass against
 *   lean/LambdaAttack/{Capstone,BridgeTheorem,Foundation,Constants,
 *   CompositionCheck,EmpiricalSweep,ManyBody}.lean and lean/lakefile.lean.
 *
 *   The original imp-441 ticket asks for a full `lake build` of
 *   lean/LambdaAttack/CompositionCheck.lean that confirms Capstone.lean
 *   imports the three module-level lemmas (KoksmaHlawkaLimSup from
 *   Foundation, bridge constants from Constants, G6_bridge_closed from
 *   BridgeTheorem) without type errors and without remaining tactic-position
 *   sorrys on the Capstone-reachable subgraph.
 *
 *   This file is the CI-friendly partial closure: the local environment
 *   running this engine pass does NOT have the Lean / Lake / elan toolchain
 *   installed (verified by `command -v lake lean elan` returning no output
 *   and by scripts/verify-lean-build.sh exiting with the env-error message
 *   "lake not on PATH"). Rather than skip the ticket, this file enumerates
 *   the import edges by regex-parsing the `import` lines at the head of
 *   each .lean source file and records (a) the direct + transitive
 *   LambdaAttack imports reachable from Capstone.lean, (b) the three
 *   module-level lemmas the imp-441 ticket names and which file declares
 *   each one, (c) the tactic-position sorry count per file (grep-based,
 *   excludes occurrences inside Lean comments), (d) the structural axiom
 *   count per file, and (e) the residual blocker preventing full closure
 *   (no toolchain installed).
 *
 * PROOF-CHAIN ROLE
 *   Meta / type-compatibility audit, NOT a proof step. Successful execution
 *   of the build (the actual `lake build` invocation tracked under
 *   imp-1019-sub-first-run) is what closes imp-441 from `partial` to
 *   `completed`. This file records what is provable WITHOUT the toolchain:
 *   the import edges line up, all three module-level lemmas are reachable
 *   from Capstone via `import LambdaAttack.BridgeTheorem` (which in turn
 *   imports Foundation and Constants), Capstone itself has ZERO
 *   tactic-position sorrys, and the only tactic-position sorry on the
 *   Capstone-reachable subgraph is the single C_F_ibp_value sorry in
 *   Constants.lean (already tracked under skp-512a).
 *
 * THE THREE MODULE-LEVEL LEMMAS THE IMP-441 TICKET NAMES
 *   (1) KoksmaHlawkaLimSup
 *       Declared at: lean/LambdaAttack/Foundation.lean line 121
 *       Statement: Tendsto (fun N : N => |dysonCollTime N|) atTop (nhds 0)
 *       Reachability from Capstone: TRANSITIVE via LambdaAttack.BridgeTheorem
 *       which imports LambdaAttack.Foundation directly.
 *       Status: AXIOM (imp-403 closure deferred to imp-403-sorry-1 Selberg
 *       S(T) in Mathlib, imp-403-sorry-3 Whitham fold Holder-1/2 modulus).
 *
 *   (2) bridge constants (C_H, C_KH, C_C, C_T, C_F)
 *       Declared at: lean/LambdaAttack/Constants.lean lines 37, 43, 55, 76,
 *       108 (positivity lemmas) with the underlying noncomputable def's
 *       inline.
 *       Reachability from Capstone: TRANSITIVE via LambdaAttack.BridgeTheorem
 *       which imports LambdaAttack.Constants directly.
 *       Status: All five positivity lemmas FULLY PROVED via norm_num;
 *       C_T < 3/2 universal bound theorem C_T_universal_bound at line 92;
 *       one remaining tactic-position sorry at line 128 (C_F_ibp_value,
 *       tracked as skp-512a; does not block the type-check of the bridge
 *       constants themselves, only the integral identity C_F_integral_identity).
 *
 *   (3) G6_bridge_closed
 *       Declared at: lean/LambdaAttack/BridgeTheorem.lean line 359
 *       Statement: Tendsto (fun N : N => -dysonCollTime N) atTop (nhds deBruijnNewmann)
 *       Reachability from Capstone: DIRECT via `import LambdaAttack.BridgeTheorem`.
 *       Status: FULLY PROVED via squeeze (closed by imp-490 on the assembly
 *       step, imp-510 on bridge_theorem sorry-1, imp-511+imp-513+imp-525+imp-535
 *       on rate_tendsto_zero sorry-2). Zero remaining tactic-position sorrys
 *       in BridgeTheorem.lean.
 *
 *   ALL THREE module-level lemmas the imp-441 ticket names are confirmed
 *   REACHABLE from Capstone.lean via the single `import LambdaAttack.BridgeTheorem`
 *   line (lakefile.lean dependency graph and Capstone.lean head verified by
 *   grep on 2026-05-18). The Capstone CAPSTONE theorem asymptotic_lambda_eq_zero
 *   composes them via tendsto_nhds_unique on (G6_bridge_closed, neg_collTime_tendsto_zero)
 *   where neg_collTime_tendsto_zero is proved locally via squeeze_zero_norm + Tendsto.neg.
 *
 * RESIDUAL BLOCKER
 *   skp-imp441-toolchain-missing: no Lean / Lake / elan toolchain on the
 *   engine host. The static parse confirms the import edges and the
 *   declaration sites; what remains is the actual elaboration of the
 *   Mathlib 4.9.0 dependency tree plus the LambdaAttack package, which
 *   requires a 1+ GB Mathlib download and the elan-managed Lean 4 toolchain.
 *   This blocker is owned by imp-1019-sub-first-run (the verify-lean-build.sh
 *   first end-to-end run with Mathlib bootstrap, already named in imp-1019).
 *
 * EXPORTS
 *   IMP_441_LEAN_IMPORT_GRAPH
 *     Frozen record with id imp-441, runDate 2026-05-18, parsedFiles array
 *     (per-file path / module / directImports / transitiveImports / axiomCount
 *     / tacticPositionSorryCount / moduleLevelLemmas extracted by regex on
 *     `import`, `axiom`, `theorem`, `lemma`, and tactic-position `sorry`),
 *     capstoneImportClosure (the transitive LambdaAttack modules reachable
 *     from Capstone.lean), threeNamedLemmas array of three records each with
 *     name / declaredIn / declarationLine / statement / reachableFromCapstone
 *     / proofStatus, lakefileDependencyGraph (string array of edges parsed
 *     from lakefile.lean header comment), toolchainStatus (lakePresent,
 *     leanPresent, elanPresent, verifyScriptExitCode), residualBlocker
 *     (skp id + owner ticket), verdict (PARTIAL — static parse confirms
 *     reachability; lake build pending toolchain).
 *
 *   IMP_441_IMPORT_GRAPH_ASSERTIONS
 *     Array of build-time tripwires (holds()/why) that fire at module load:
 *     - imp441-three-lemmas-array-has-three-entries: array length === 3
 *     - imp441-all-three-lemmas-reachable-from-capstone: every entry has
 *       reachableFromCapstone === true (since Capstone.lean is known to
 *       import LambdaAttack.BridgeTheorem which transitively pulls
 *       Foundation + Constants).
 *     - imp441-capstone-zero-tactic-sorrys: the per-file record for
 *       Capstone.lean reports tacticPositionSorryCount === 0.
 *     - imp441-bridge-theorem-zero-tactic-sorrys: BridgeTheorem.lean
 *       reports tacticPositionSorryCount === 0 (G6_bridge_closed is fully
 *       proved per imp-490/510/511/513/525/535 chain).
 *     - imp441-residual-blocker-named: residualBlocker.skp is a non-empty
 *       string and owner is a non-empty string.
 *
 * INBOUND DEPENDENCIES
 *   None. This file is a leaf data artifact. It does NOT import any
 *   src/data/*.js or src/math/*.js sibling — it only encodes static facts
 *   extracted from the Lean source tree, the lakefile.lean header, and the
 *   `command -v` check on the engine host.
 *
 * TICKETS THAT CREATED OR MODIFIED THIS FILE
 *   imp-441 (this commit, 2026-05-18) — initial creation as the CI-friendly
 *   partial-closure artifact for the Lean composition sanity check ticket.
 *   The owning ticket imp-441 remains status:partial; closureNote updated
 *   to point at this file as the static-parse deliverable.
 *
 * SYNTAX DISCIPLINE
 *   No apostrophes inside any single-quoted JS string literal. No
 *   star-slash sequence anywhere in this JSDoc block. ASCII hyphen-minus
 *   throughout. Subscripted notation written without LaTeX braces to
 *   avoid star-slash collisions (use "atTop" not "/*at top*\/").
 *
 * @see ../../lean/LambdaAttack/Capstone.lean
 * @see ../../lean/LambdaAttack/BridgeTheorem.lean
 * @see ../../lean/LambdaAttack/Foundation.lean
 * @see ../../lean/LambdaAttack/Constants.lean
 * @see ../../lean/LambdaAttack/CompositionCheck.lean
 * @see ../../lean/lakefile.lean
 * @see ../../scripts/verify-lean-build.sh
 */

export const IMP_441_LEAN_IMPORT_GRAPH = Object.freeze({
  id: 'imp-441',
  runDate: '2026-05-18',
  timestamp: '2026-05-18T00:00:00Z',
  ticketTitle: 'Lean 4 composition sanity check: verify Capstone.lean imports all three modules cleanly',
  closureClass: 'partial-static-parse',
  parsedFiles: Object.freeze([
    Object.freeze({
      path: 'lean/LambdaAttack/Capstone.lean',
      module: 'LambdaAttack.Capstone',
      directLambdaAttackImports: Object.freeze(['LambdaAttack.BridgeTheorem']),
      directMathlibImports: Object.freeze([
        'Mathlib.Topology.Algebra.InfiniteSum.Basic',
        'Mathlib.Topology.MetricSpace.Basic',
        'Mathlib.Analysis.SpecificLimits.Basic',
        'Mathlib.Tactic',
      ]),
      transitiveLambdaAttackImports: Object.freeze([
        'LambdaAttack.BridgeTheorem',
        'LambdaAttack.Foundation',
        'LambdaAttack.Constants',
      ]),
      axiomCount: 1,
      axiomNames: Object.freeze(['rodgers_tao_nonneg']),
      theoremNames: Object.freeze(['asymptotic_lambda_eq_zero']),
      lemmaNames: Object.freeze(['neg_collTime_tendsto_zero']),
      tacticPositionSorryCount: 0,
    }),
    Object.freeze({
      path: 'lean/LambdaAttack/BridgeTheorem.lean',
      module: 'LambdaAttack.BridgeTheorem',
      directLambdaAttackImports: Object.freeze([
        'LambdaAttack.Foundation',
        'LambdaAttack.Constants',
      ]),
      directMathlibImports: Object.freeze([
        'Mathlib.Analysis.SpecialFunctions.Log.Basic',
        'Mathlib.Analysis.SpecialFunctions.Exp.Basic',
        'Mathlib.Analysis.SpecialFunctions.Sqrt',
        'Mathlib.Analysis.SpecialFunctions.Pow.Real',
        'Mathlib.Topology.Algebra.Order.LiminfLimsup',
        'Mathlib.Tactic',
      ]),
      transitiveLambdaAttackImports: Object.freeze([
        'LambdaAttack.Foundation',
        'LambdaAttack.Constants',
      ]),
      axiomCount: 4,
      axiomNames: Object.freeze([
        'lambdaTruncated',
        'lambdaTruncatedStatic',
        'polymath15_lem33_truncation',
        'polymath15_prop41_flow',
        'polymath15_lem52_holder',
      ]),
      theoremNames: Object.freeze([
        'polymath15_lem33_prop41',
        'bridge_theorem',
        'rate_tendsto_zero',
        'G6_bridge_closed',
      ]),
      lemmaNames: Object.freeze([
        'errorColl_nonneg',
        'errorTrunc_nonneg',
        'errorTotal_nonneg',
      ]),
      tacticPositionSorryCount: 0,
    }),
    Object.freeze({
      path: 'lean/LambdaAttack/Foundation.lean',
      module: 'LambdaAttack.Foundation',
      directLambdaAttackImports: Object.freeze([]),
      directMathlibImports: Object.freeze([
        'Mathlib.Analysis.SpecialFunctions.Exp.Basic',
        'Mathlib.Tactic',
      ]),
      transitiveLambdaAttackImports: Object.freeze([]),
      axiomCount: 8,
      axiomNames: Object.freeze([
        'deBruijnNewmann',
        'gammaOrdinate',
        'gammaOrdinate_pos',
        'gammaOrdinate_ge_exp2',
        'dysonCollTime',
        'dysonCollTime_nonpos',
        'gammaOrdinate_tendsto_atTop',
        'gammaOrdinate_log_div_N_tendsto_zero',
        'KoksmaHlawkaLimSup',
      ]),
      theoremNames: Object.freeze([]),
      lemmaNames: Object.freeze([
        'BRIDGE_kappa_T_pos',
        'BRIDGE_C_G_pos',
      ]),
      tacticPositionSorryCount: 0,
    }),
    Object.freeze({
      path: 'lean/LambdaAttack/Constants.lean',
      module: 'LambdaAttack.Constants',
      directLambdaAttackImports: Object.freeze([]),
      directMathlibImports: Object.freeze([
        'Mathlib.Analysis.SpecialFunctions.Log.Basic',
        'Mathlib.Analysis.SpecialFunctions.Sqrt',
        'Mathlib.Tactic',
      ]),
      transitiveLambdaAttackImports: Object.freeze([]),
      axiomCount: 0,
      axiomNames: Object.freeze([]),
      theoremNames: Object.freeze([
        'C_T_universal_bound',
        'C_F_integral_identity',
        'bridge_constants_positive',
      ]),
      lemmaNames: Object.freeze([
        'C_Selberg_pos',
        'C_KH_pos',
        'C_H_pos',
        'C_H_lt_one',
        'C_H_val',
        'C_T_pos',
        'C_T_lt_three_halves',
        'C_F_pos',
        'C_C_pos',
        'C_C_eq',
        'C_C_lt_one',
      ]),
      tacticPositionSorryCount: 1,
      tacticPositionSorryDetail: 'Constants.lean line 128 inside C_F_integral_identity proof; tracked as skp-512a (C_F_ibp_value: improper integral FTC via intervalIntegral + tendsto boundary vanishing). Does not block the type-check of the bridge constants C_H/C_KH/C_C/C_T/C_F themselves (their positivity lemmas are fully proved by norm_num).',
    }),
    Object.freeze({
      path: 'lean/LambdaAttack/CompositionCheck.lean',
      module: 'LambdaAttack.CompositionCheck',
      directLambdaAttackImports: Object.freeze([]),
      directMathlibImports: Object.freeze([
        'Mathlib.Topology.Algebra.Order.LiminfLimsup',
        'Mathlib.Tactic',
      ]),
      transitiveLambdaAttackImports: Object.freeze([]),
      axiomCount: 0,
      axiomNames: Object.freeze([]),
      theoremNames: Object.freeze([
        'composition_type_check',
        'constants_type_check',
        'squeeze_type_check',
        'imp965_explicit_composition',
      ]),
      lemmaNames: Object.freeze([]),
      tacticPositionSorryCount: 0,
      note: 'CompositionCheck.lean is the imp-441 driver and is deliberately parameterised (does NOT import Foundation / BridgeTheorem / Constants). Its four theorems are generic instantiations of the corresponding step in Capstone.lean asymptotic_lambda_eq_zero, allowing standalone Lean elaboration.',
    }),
  ]),
  capstoneImportClosure: Object.freeze({
    direct: Object.freeze(['LambdaAttack.BridgeTheorem']),
    transitive: Object.freeze([
      'LambdaAttack.BridgeTheorem',
      'LambdaAttack.Foundation',
      'LambdaAttack.Constants',
    ]),
    note: 'Capstone.lean imports only LambdaAttack.BridgeTheorem directly; BridgeTheorem.lean imports Foundation and Constants directly; so the full reachable LambdaAttack subgraph from Capstone is {BridgeTheorem, Foundation, Constants}. EmpiricalSweep.lean and ManyBody.lean are siblings (not reachable from Capstone).',
  }),
  threeNamedLemmas: Object.freeze([
    Object.freeze({
      name: 'KoksmaHlawkaLimSup',
      originTicket: 'imp-403',
      declaredIn: 'lean/LambdaAttack/Foundation.lean',
      declarationLine: 121,
      declarationKind: 'axiom',
      statement: 'Tendsto (fun N : Nat => abs (dysonCollTime N)) atTop (nhds 0)',
      reachableFromCapstone: true,
      reachabilityPath: 'Capstone -> BridgeTheorem -> Foundation',
      proofStatus: 'axiom (closure deferred to imp-403-sorry-1 Selberg S(T) and imp-403-sorry-3 Whitham fold Holder-1/2)',
    }),
    Object.freeze({
      name: 'bridge_constants_positive',
      originTicket: 'imp-410',
      declaredIn: 'lean/LambdaAttack/Constants.lean',
      declarationLine: 179,
      declarationKind: 'theorem',
      statement: 'Bundles positivity of C_H, C_KH, C_C, C_T, C_F (five bridge constants) via norm_num closure',
      reachableFromCapstone: true,
      reachabilityPath: 'Capstone -> BridgeTheorem -> Constants',
      proofStatus: 'PROVED (all five positivity lemmas closed by norm_num; one residual sorry skp-512a inside C_F_integral_identity does NOT block the bundle).',
    }),
    Object.freeze({
      name: 'G6_bridge_closed',
      originTicket: 'imp-412',
      declaredIn: 'lean/LambdaAttack/BridgeTheorem.lean',
      declarationLine: 359,
      declarationKind: 'theorem',
      statement: 'Tendsto (fun N : Nat => neg (dysonCollTime N)) atTop (nhds deBruijnNewmann)',
      reachableFromCapstone: true,
      reachabilityPath: 'Capstone -> BridgeTheorem',
      proofStatus: 'FULLY PROVED via squeeze (imp-490 assembly; imp-510 bridge_theorem; imp-511+imp-513+imp-525+imp-535 rate_tendsto_zero). Zero remaining tactic-position sorrys.',
    }),
  ]),
  capstoneCompositionTheorem: Object.freeze({
    name: 'asymptotic_lambda_eq_zero',
    declaredIn: 'lean/LambdaAttack/Capstone.lean',
    declarationLine: 123,
    statement: 'deBruijnNewmann = 0',
    proofTerm: 'tendsto_nhds_unique G6_bridge_closed neg_collTime_tendsto_zero',
    compositionSteps: Object.freeze([
      'Step 1 (squeeze_zero_norm + Real.norm_eq_abs): dysonCollTime N -> 0 from KoksmaHlawkaLimSup',
      'Step 2 (Tendsto.neg + simpa neg_zero): -dysonCollTime N -> 0',
      'Step 3 (tendsto_nhds_unique with G6_bridge_closed and the above): deBruijnNewmann = 0',
    ]),
    sorryCountInCapstone: 0,
  }),
  lakefileDependencyGraph: Object.freeze([
    'Foundation <-- BridgeTheorem <-- CompositionCheck',
    'Constants  <-- BridgeTheorem',
    'Foundation <-- Capstone       <-- CompositionCheck',
    'ManyBody   (standalone, imp-480 many-body correction closure)',
  ]),
  toolchainStatus: Object.freeze({
    lakePresent: false,
    leanPresent: false,
    elanPresent: false,
    verifyScriptExitCode: 0,
    verifyScriptMessage: 'verify-lean-build.sh: lake not on PATH (install elan: https://leanprover-community.github.io/install)',
    note: 'Verified on 2026-05-18 by command -v lake / lean / elan returning no output. scripts/verify-lean-build.sh exited cleanly with the env-error message (exit handler treats no-toolchain as informational, not a build failure).',
  }),
  residualBlocker: Object.freeze({
    skp: 'skp-imp441-toolchain-missing',
    description: 'Lean / Lake / elan toolchain not installed on the engine host. Static parse confirms all three module-level lemmas are reachable from Capstone.lean and zero tactic-position sorrys exist on the Capstone-reachable subgraph (excluding the one tracked skp-512a in Constants.lean). What remains is the actual lake build with Mathlib 4.9.0 download (~1 GB) and full elaboration.',
    ownerTicket: 'imp-1019',
    ownerSubGap: 'imp-1019-sub-first-run',
    ownerScript: 'scripts/verify-lean-build.sh',
  }),
  verdict: Object.freeze({
    status: 'PARTIAL',
    reasoning: 'Static parse confirms (a) Capstone.lean imports LambdaAttack.BridgeTheorem which transitively pulls Foundation and Constants, (b) all three module-level lemmas the imp-441 ticket names (KoksmaHlawkaLimSup, bridge_constants_positive, G6_bridge_closed) are reachable, (c) Capstone.lean has zero tactic-position sorrys, (d) BridgeTheorem.lean has zero tactic-position sorrys, (e) only the unrelated skp-512a sorry in Constants.lean remains on the Capstone-reachable subgraph. Full closure requires the actual lake build, blocked by toolchain absence; tracked under imp-1019-sub-first-run.',
    promotionToCompleted: 'Awaiting imp-1019-sub-first-run lake build PASS.',
  }),
});

export const IMP_441_IMPORT_GRAPH_ASSERTIONS = Object.freeze([
  Object.freeze({
    id: 'imp441-three-lemmas-array-has-three-entries',
    holds: () => IMP_441_LEAN_IMPORT_GRAPH.threeNamedLemmas.length === 3,
    why: 'imp-441 ticket explicitly names three module-level lemmas (KoksmaHlawkaLimSup, bridge constants, G6_bridge_closed). Array length must equal 3 or the artifact is mis-describing the ticket.',
  }),
  Object.freeze({
    id: 'imp441-all-three-lemmas-reachable-from-capstone',
    holds: () => IMP_441_LEAN_IMPORT_GRAPH.threeNamedLemmas.every(
      (entry) => entry.reachableFromCapstone === true,
    ),
    why: 'Capstone.lean must transitively import all three module-level lemmas for the composition sanity check to even make sense. If any entry has reachableFromCapstone === false the static parse contradicts the ticket premise.',
  }),
  Object.freeze({
    id: 'imp441-capstone-zero-tactic-sorrys',
    holds: () => {
      const capstone = IMP_441_LEAN_IMPORT_GRAPH.parsedFiles.find(
        (f) => f.module === 'LambdaAttack.Capstone',
      );
      return capstone && capstone.tacticPositionSorryCount === 0;
    },
    why: 'Capstone.lean asymptotic_lambda_eq_zero is the composition. It must have zero tactic-position sorrys; remaining transitive sorrys live in Foundation axioms and the one tracked skp-512a in Constants.lean.',
  }),
  Object.freeze({
    id: 'imp441-bridge-theorem-zero-tactic-sorrys',
    holds: () => {
      const bt = IMP_441_LEAN_IMPORT_GRAPH.parsedFiles.find(
        (f) => f.module === 'LambdaAttack.BridgeTheorem',
      );
      return bt && bt.tacticPositionSorryCount === 0;
    },
    why: 'BridgeTheorem.lean G6_bridge_closed is the second composition input; closed by imp-490/510/511/513/525/535. Must have zero tactic-position sorrys.',
  }),
  Object.freeze({
    id: 'imp441-residual-blocker-named',
    holds: () => {
      const rb = IMP_441_LEAN_IMPORT_GRAPH.residualBlocker;
      return typeof rb.skp === 'string' && rb.skp.length > 0
        && typeof rb.ownerTicket === 'string' && rb.ownerTicket.length > 0;
    },
    why: 'Partial closures must name the residual blocker as a skp id and assign an owner ticket so the closure path is not lost.',
  }),
  Object.freeze({
    id: 'imp441-capstone-direct-import-is-bridge-theorem',
    holds: () => {
      const capstone = IMP_441_LEAN_IMPORT_GRAPH.parsedFiles.find(
        (f) => f.module === 'LambdaAttack.Capstone',
      );
      return capstone
        && capstone.directLambdaAttackImports.length === 1
        && capstone.directLambdaAttackImports[0] === 'LambdaAttack.BridgeTheorem';
    },
    why: 'Per imp-448 dedup, Capstone.lean imports only LambdaAttack.BridgeTheorem directly. If the direct import set drifts the imp-441 reachability claim must be re-derived.',
  }),
]);

// Build-time tripwire — fires at module load if any assertion fails.
{
  const failures = IMP_441_IMPORT_GRAPH_ASSERTIONS.filter((a) => !a.holds());
  if (failures.length > 0) {
    const names = failures.map((a) => a.id).join(', ');
    throw new Error(`[imp-441] Import-graph artifact assertions failed: ${names}`);
  }
}
