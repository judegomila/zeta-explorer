/**
 * @module data/rust-port-phase5-verner-triangulation
 * @fileoverview imp-1111 Phase 5 -- third-integrator triangulation
 * CONTRACT for the native Rust interval-RK4 crate at
 * rust/interval-rk4. This artefact is an HONEST PARTIAL closure: it
 * ships the build-verified methodology contract that the future
 * Verner 8(7) Rust port must satisfy, NOT the port itself. The
 * actual rust/interval-rk4/src/verner87.rs module + the
 * --integrator CLI flag + the measured RK4-vs-Verner87 cross-check
 * at N in {500, 1000, 5000} are tracked as the open named sub-gap
 * imp-1111-sub-rust-port-and-N-sweep below.
 *
 * WHY THIS TICKET EXISTS (the circular bug-class problem)
 * ------------------------------------------------------
 * imp-1090 / imp-1091 verified the Rust interval integrator against
 * the JS interval integrator at maxAbsDiff = 0. But BOTH the JS and
 * the Rust path use the SAME imp-925 eml primitive and the SAME
 * classical RK4 Butcher tableau. If there is a subtle drift-sum
 * indexing bug or an off-by-one in the shared eml expansion, the
 * JS-vs-Rust cross-check is CIRCULAR: both implementations would
 * carry the identical defect and agree perfectly while both being
 * wrong. A cross-language port catches transcription bugs; it does
 * NOT catch an algorithmic bug shared by construction.
 *
 * THE TRIANGULATION FIX
 * ---------------------
 * Add a THIRD, ALGORITHMICALLY INDEPENDENT integrator: an embedded
 * Verner 8(7) Runge-Kutta pair (8th-order solution with an embedded
 * 7th-order error estimator). Its Butcher tableau is structurally
 * unrelated to the 4-stage classical RK4 tableau (a high-stage
 * explicit pair, distinct stage count, distinct node vector,
 * distinct weight vectors). It reuses ONLY the lowest-level shared
 * primitives that are themselves separately verified: the inari
 * interval arithmetic kernel and dyson_drift_interval (the RHS).
 * Three integrators that disagree localise the bug; three that
 * agree to within the certified wrapper width make a shared-defect
 * explanation implausible.
 *
 * THE CROSS-CHECK ACCEPTANCE CRITERION
 * ------------------------------------
 * At each N in {500, 1000, 5000}, run BOTH integrators on the same
 * initial gammas with the same dt and step budget. The two
 * certified t_c brackets must overlap, and the centre-to-centre
 * distance must not exceed 2 * max(wrapperWidth_rk4,
 * wrapperWidth_verner87). The factor-2 envelope is the rigorous
 * tolerance: each method certifies a bracket of half-width up to
 * its own wrapper width, so two SOUND methods of differing order
 * integrating the same flow must produce brackets whose centres lie
 * within the sum of the two half-widths, bounded above by twice the
 * larger wrapper width. A disagreement WIDER than this envelope is
 * not floating-point noise -- it is a real bug in at least one
 * integrator and triggers a STOP-AND-DIAGNOSE, not a tolerance bump.
 *
 * WHY THE TABLEAU CONTRACT IS SHIPPED BUT NOT THE NUMERIC TABLEAU
 * --------------------------------------------------------------
 * The engine verification gate is npm run build (vite), which does
 * NOT compile or run the Rust crate, and the imp-1112 sanity sweep
 * already measured that a single Rust interval-RK4 plateau at the
 * relevant N costs minutes to tens of minutes of wall clock -- far
 * outside one atomic engine pass, and a Verner pair is ~2.5-3x
 * slower again (more stages per step). Fabricating a 13-stage
 * rational Butcher tableau from memory and asserting its row-sum
 * consistency at build time would risk shipping WRONG coefficients
 * that pass a self-consistency tripwire while still being the wrong
 * method. Instead this artefact ships the METHODOLOGY CONTRACT --
 * the structural invariants any correct Verner 8(7) port MUST
 * satisfy (stage count, embedded/principal order pair, the three
 * Butcher consistency conditions stated symbolically, the
 * cross-check N set, the rigorous tolerance formula, the honest
 * not-yet-measured verdict) -- so the future Rust port is a
 * transcription against a fixed, build-checked spec rather than an
 * unconstrained free design. triangulationVerdict is held at
 * pending-rust-port and allAgreementsWithinTolerance at null so no
 * tripwire can ever read as a passed cross-check before the port
 * and the measured N-sweep actually exist.
 *
 * SYNTAX NOTE
 * -----------
 * Per repository convention (CLAUDE.md): no apostrophes inside
 * single-quoted JS strings, no slash-star sequences inside JSDoc
 * comments.
 */

/**
 * imp-1111 Phase 5 Verner 8(7) triangulation contract. Frozen.
 * status is the honest contract state; it flips to
 * triangulation-passed only when the Rust port + the measured
 * N-sweep close the sub-gap.
 */
export const PHASE5_VERNER87 = Object.freeze({
  id: 'imp-1111-phase-5-verner87',
  status: 'rust-port-deferred-contract-shipped',
  ticketTitle:
    'Rust port Phase 5: Verner 8(7) third integrator for bug-class triangulation',
  motivation: Object.freeze({
    circularCrossCheck:
      'imp-1090 / imp-1091 cross-checked Rust vs JS at maxAbsDiff = ' +
      '0, but both share the imp-925 eml primitive and the classical ' +
      'RK4 tableau, so a shared algorithmic drift-sum defect would ' +
      'make the agreement circular -- both wrong, both agreeing.',
    fix:
      'A third integrator whose Butcher tableau is structurally ' +
      'independent of RK4 (Verner 8(7) embedded pair) reusing only ' +
      'the separately-verified inari kernel and dyson_drift_interval ' +
      'RHS breaks the circularity: a defect shared by all three by ' +
      'construction becomes implausible.',
  }),
  thirdIntegratorChoice: Object.freeze({
    method: 'Verner embedded Runge-Kutta 8(7) pair',
    principalOrder: 8,
    embeddedOrder: 7,
    independenceFromRk4:
      'Distinct stage count, distinct node vector c, distinct ' +
      'principal weight vector b and embedded weight vector bhat ' +
      'from the 4-stage classical RK4 tableau. No tableau ' +
      'coefficient is reused; only the interval kernel and the ' +
      'shared RHS dyson_drift_interval are common (each separately ' +
      'verified upstream).',
    source:
      'J. H. Verner, embedded explicit Runge-Kutta 8(7) pairs ' +
      '(Verner high-order family). The Rust port must transcribe ' +
      'the rational Butcher coefficients from a primary published ' +
      'tableau, NOT reconstruct them, and validate them against the ' +
      'symbolic consistency contract below before any cross-check.',
  }),
  butcherTableauContract: Object.freeze({
    description:
      'Structural invariants the ported tableau must satisfy ' +
      'BEFORE it is trusted for the triangulation cross-check. ' +
      'These are stated symbolically here; the Rust port enforces ' +
      'them numerically at tableau-load with an interval tolerance.',
    consistencyConditions: Object.freeze([
      'Node consistency: c_i = sum_j a_ij for every stage i ' +
        '(the node vector equals the row sums of the strictly ' +
        'lower-triangular coefficient matrix).',
      'Principal weight consistency: sum_i b_i = 1 ' +
        '(8th-order solution weights sum to unity).',
      'Embedded weight consistency: sum_i bhat_i = 1 ' +
        '(7th-order embedded estimator weights sum to unity).',
      'First moment (order >= 2): sum_i b_i c_i = 1/2 and ' +
        'sum_i bhat_i c_i = 1/2 for both weight vectors.',
    ]),
    enforcementPoint:
      'rust/interval-rk4/src/verner87.rs must check all four ' +
      'conditions inside an interval tolerance at module load and ' +
      'panic with a named error if any fails -- a wrong-tableau ' +
      'transcription must abort, never silently produce a ' +
      'plausible-looking but unsound bracket.',
  }),
  crossCheckProtocol: Object.freeze({
    acceptanceN: Object.freeze([500, 1000, 5000]),
    perN:
      'Run rk4_interval_step path and verner87_interval_step path ' +
      'on identical initial gammas, identical dt, identical step ' +
      'budget; record both certified brackets and both wrapper ' +
      'widths.',
    toleranceFormula:
      'centreDistance(bracket_rk4, bracket_verner87) <= 2 * ' +
      'max(wrapperWidth_rk4, wrapperWidth_verner87)',
    toleranceRationale:
      'Two SOUND methods integrating the same flow each certify a ' +
      'bracket whose half-width is at most its own wrapper width; ' +
      'their centres must therefore lie within the sum of the two ' +
      'half-widths, bounded above by twice the larger wrapper ' +
      'width. This is a rigorous criterion, not a tuned constant.',
    disagreementVerdict:
      'A gap WIDER than the envelope is a real bug in at least one ' +
      'integrator: STOP and diagnose (suspect the newer Verner ' +
      'transcription first, then the shared RHS, then RK4). Never ' +
      'widen the tolerance to force a pass.',
  }),
  acceptanceTable: null,
  allAgreementsWithinTolerance: null,
  triangulationVerdict: 'pending-rust-port',
  rustPortPlan: Object.freeze({
    newModule: 'rust/interval-rk4/src/verner87.rs',
    libWiring: 'pub mod verner87 + re-export in lib.rs',
    cliFlag:
      '--integrator={rk4|verner87}, default rk4 (backward ' +
      'compatible: the JS dispatch wrapper and every existing ' +
      'caller keep the rk4 path with no change).',
    reuses:
      'inari interval kernel (crate::as_interval) and ' +
      'crate::dyson::dyson_drift_interval as the RHS -- no new ' +
      'numerical primitives.',
    expectedSlowdownVsRk4:
      'Verner 8(7) evaluates the RHS ~2.5-3x more times per step ' +
      '(high stage count vs 4). This is the VERIFICATION path, not ' +
      'the production path -- slower is expected and acceptable.',
    integrationTest:
      'rust/interval-rk4/tests/verner87_vs_rk4_triangulation.rs ' +
      'asserting the toleranceFormula at each acceptanceN and ' +
      'asserting the tableau consistency contract.',
  }),
  honestScope: Object.freeze({
    whatWasShipped: [
      'The build-verified triangulation methodology contract: the ' +
        'circular-bug-class motivation, the Verner 8(7) choice and ' +
        'its independence argument, the four symbolic Butcher ' +
        'consistency conditions the port must enforce, the ' +
        'acceptance N set, and the rigorous factor-2 wrapper-width ' +
        'tolerance formula.',
      'A set of build-time tripwires that pin the contract and, ' +
        'critically, assert that the cross-check has NOT been ' +
        'claimed as passed (triangulationVerdict held at ' +
        'pending-rust-port, allAgreementsWithinTolerance held at ' +
        'null) so no future edit can silently fake a green ' +
        'triangulation.',
    ],
    whatWasNotShipped: [
      'rust/interval-rk4/src/verner87.rs (the actual Verner 8(7) ' +
        'interval step + the transcribed rational Butcher tableau).',
      'The --integrator CLI flag and the lib.rs wiring.',
      'The MEASURED RK4-vs-Verner87 cross-check at N in {500, ' +
        '1000, 5000}: this needs the Rust toolchain plus minutes ' +
        'to tens of minutes of wall clock per N (imp-1112 measured ' +
        'the RK4 single-plateau cost; a Verner pair is ~2.5-3x ' +
        'slower again), which is outside one atomic engine pass ' +
        'and outside the npm run build verification gate.',
    ],
    whyPartialIsHonestlyValuable:
      'A high-complexity research ticket cannot be force-closed in ' +
      'one atomic pass. Locking the methodology contract converts ' +
      'the remaining work from an unconstrained free design into a ' +
      'transcription against a fixed, build-checked specification, ' +
      'and the tripwires guarantee the not-yet-done state stays ' +
      'visible until the port and the measured sweep actually ' +
      'exist.',
    sub_gap: Object.freeze({
      id: 'imp-1111-sub-rust-port-and-N-sweep',
      status: 'open',
      blockerFor:
        'Full de-circularisation of the t_c bracket bug-class. ' +
        'Until this closes, every t_c bracket in the imp-1082 / ' +
        'imp-1087 / imp-1088 / imp-1092 ladder rests on an RK4 + ' +
        'RK4 cross-check that is bug-class circular by ' +
        'construction.',
      closureCondition:
        'Closes when rust/interval-rk4/src/verner87.rs ships with ' +
        'the tableau consistency contract enforced at load, the ' +
        '--integrator flag is wired, and the measured ' +
        'RK4-vs-Verner87 cross-check satisfies the toleranceFormula ' +
        'at every N in {500, 1000, 5000} -- at which point ' +
        'acceptanceTable is populated, allAgreementsWithinTolerance ' +
        'is set true, and triangulationVerdict flips to ' +
        'triangulation-passed.',
    }),
  }),
  citations: Object.freeze([
    'J. H. Verner, "Explicit Runge-Kutta methods with estimates of ' +
      'the local truncation error", SIAM J. Numer. Anal. (Verner ' +
      'high-order embedded pairs).',
    'imp-1090 / imp-1091 closure notes (Rust-vs-JS interval ' +
      'integrator cross-check at maxAbsDiff = 0).',
    'imp-1112 rust-port-sanity-sweep-2026-05 (measured ' +
      'single-plateau Rust interval-RK4 wall-clock cost model).',
  ]),
});

/**
 * Build-time assertions. Seven tripwires. The load-bearing ones are
 * the honesty guards (verdict-not-overclaimed,
 * agreements-null-until-measured): they make it impossible to ship a
 * fake green triangulation by editing only this file.
 */
export const PHASE5_VERNER87_ASSERTIONS = [
  {
    id: 'imp1111-phase5-status-is-contract-shipped',
    holds: () =>
      PHASE5_VERNER87.status === 'rust-port-deferred-contract-shipped',
    why:
      'Phase 5 must surface status === ' +
      '"rust-port-deferred-contract-shipped" while the Verner 8(7) ' +
      'Rust port and the measured N-sweep are still the open ' +
      'sub-gap. A flip to triangulation-passed requires the ported ' +
      'module, the wired CLI flag, and the populated acceptanceTable.',
  },
  {
    id: 'imp1111-verdict-not-overclaimed',
    holds: () =>
      PHASE5_VERNER87.triangulationVerdict === 'pending-rust-port',
    why:
      'The triangulation verdict must read pending-rust-port until ' +
      'an actual measured RK4-vs-Verner87 cross-check exists. This ' +
      'tripwire is the primary honesty guard: it makes a silent ' +
      'fake-pass (editing the verdict without doing the port) fail ' +
      'the build.',
  },
  {
    id: 'imp1111-agreements-null-until-measured',
    holds: () =>
      PHASE5_VERNER87.allAgreementsWithinTolerance === null &&
      PHASE5_VERNER87.acceptanceTable === null,
    why:
      'allAgreementsWithinTolerance and acceptanceTable must stay ' +
      'null until the Rust cross-check is actually run and ' +
      'recorded. A non-null value without the ported module is an ' +
      'overclaim and must fail the build.',
  },
  {
    id: 'imp1111-acceptance-n-matches-ticket-spec',
    holds: () => {
      const n = PHASE5_VERNER87.crossCheckProtocol.acceptanceN;
      return (
        Array.isArray(n) &&
        n.length === 3 &&
        n[0] === 500 &&
        n[1] === 1000 &&
        n[2] === 5000
      );
    },
    why:
      'The cross-check N set is fixed by the ticket at {500, 1000, ' +
      '5000}. Drifting this set would let a future port cherry-pick ' +
      'easier N values; the spec is pinned here.',
  },
  {
    id: 'imp1111-tolerance-formula-is-rigorous',
    holds: () => {
      const t = PHASE5_VERNER87.crossCheckProtocol.toleranceFormula;
      return (
        typeof t === 'string' &&
        t.indexOf('2 * max(wrapperWidth') !== -1
      );
    },
    why:
      'The acceptance tolerance must be the rigorous 2 * ' +
      'max(wrapperWidth) envelope derived from interval soundness, ' +
      'not a hand-tuned constant. Pinning the formula string ' +
      'prevents a future loosening to force a pass.',
  },
  {
    id: 'imp1111-butcher-contract-has-four-conditions',
    holds: () => {
      const c =
        PHASE5_VERNER87.butcherTableauContract.consistencyConditions;
      return Array.isArray(c) && c.length === 4;
    },
    why:
      'The ported tableau must enforce all four Butcher consistency ' +
      'conditions (node consistency, principal weight sum, embedded ' +
      'weight sum, first-moment for both weight vectors). The ' +
      'contract enumerates exactly these four.',
  },
  {
    id: 'imp1111-subgap-named-and-open',
    holds: () => {
      const s = PHASE5_VERNER87.honestScope.sub_gap;
      return (
        s.id === 'imp-1111-sub-rust-port-and-N-sweep' &&
        s.status === 'open'
      );
    },
    why:
      'The deferred Rust port + measured N-sweep must be tracked as ' +
      'an explicitly named open sub-gap so the residual work stays ' +
      'visible in the queue and is not silently lost.',
  },
];
