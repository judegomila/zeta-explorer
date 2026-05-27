/**
 * @module rigorous-numerics-stages
 * @fileoverview Structured reference doc for §20 of the user paper
 * `research-inputs/twin_ladder_consolidated_v52.pdf` (page 42), titled
 * "Rigorous-numerics program".
 *
 * Section 20 declares a three-stage rigorous-numerics program:
 *
 *   Stage I   (§20.1) — classical benchmark at (beta, P) = (0, 0).
 *                       Coherent low-shell observables on Riemann-Siegel
 *                       scale, windowed transfer criterion on constant-
 *                       shell-length windows, hard vs viscosity-smoothed
 *                       cutoffs, affine / cubic / quintic bridges, frozen
 *                       ladders for interval-certified H_t, H_t', H_t''.
 *
 *   Stage II  (§20.2) — pressure-temperature exploration. Choose equations
 *                       of state psi, construct admissible multipliers
 *                       M_{beta, P}, track zeros while monitoring analytic
 *                       and computational supercriticality.
 *
 *   Stage III (§20.3) — interval certification. Replace floating-point
 *                       quadrature by ball arithmetic, certify proxy tails,
 *                       verify zero cells with local interval slacks,
 *                       compare runtime / error budgets to Polymath15-type
 *                       baselines.
 *
 * **Purpose of this module.** Each stage is mapped onto current app
 * infrastructure (paths + brief), with explicit gaps that remain before
 * the stage is closed in the sense of the paper. The companion page
 * `src/pages/RigorousNumericsStagesPage.jsx` is presentation-only; all
 * structural facts (statuses, infrastructure paths, gap counts) live here.
 *
 * **Status vocabulary.**
 *   - `stage-implemented`  — every primitive the paper names exists in-tree
 *                            and the stage can be executed end-to-end.
 *   - `stage-partial`      — at least one primitive exists, but at least
 *                            one named ingredient is missing or unwired.
 *   - `stage-not-started`  — no primitive exists.
 *
 * **Tickets**: imp-1220 (this file + companion page).
 */

/**
 * Frozen capstone record for §20. Field semantics for each stage entry:
 *
 *   - `stageNumber`               — Roman numeral I / II / III.
 *   - `sectionRef`                — `§20.1` / `§20.2` / `§20.3`.
 *   - `title`                     — short stage title from the paper.
 *   - `paperDescription`          — verbatim or near-verbatim paper text.
 *   - `paperBullets`              — array of bullet strings (Stage I has 5;
 *                                   Stages II / III are prose, so a single
 *                                   summary bullet is used).
 *   - `currentAppInfrastructure`  — array of `{ path, brief }` entries
 *                                   mapping stage primitives onto in-tree
 *                                   code. Paths are repo-relative.
 *   - `gaps`                      — array of human-readable strings naming
 *                                   what is still missing before the stage
 *                                   is closed in the paper's sense.
 *   - `status`                    — see vocabulary above.
 *
 * @type {Readonly<object>}
 */
export const RIGOROUS_NUMERICS_STAGES = Object.freeze({
  ticketId: 'imp-1220',
  paperRef: 'research-inputs/twin_ladder_consolidated_v52.pdf, §20, page 42',
  title: 'Rigorous-numerics program (three stages)',
  oneLine:
    'Three-stage rigorous-numerics program: classical benchmark (Stage I), ' +
    'pressure-temperature exploration (Stage II), interval certification (Stage III).',

  stages: Object.freeze([
    Object.freeze({
      stageNumber: 'I',
      sectionRef: '§20.1',
      title: 'Classical benchmark',
      paperDescription:
        'At the classical point (beta, P) = (0, 0): build coherent low-shell ' +
        'observables on the Riemann-Siegel scale; verify the windowed ' +
        'transfer criterion on constant-shell-length windows; compare hard ' +
        'vs viscosity-smoothed cutoffs; test affine, cubic, and quintic ' +
        'bridges; evaluate whether frozen ladders improve interval-' +
        'certified H_t, H_t\', H_t\'\' bounds.',
      paperBullets: Object.freeze([
        'Build coherent low-shell observables on Riemann-Siegel scale.',
        'Verify the windowed transfer criterion on constant-shell-length windows.',
        'Compare hard and viscosity-smoothed cutoffs.',
        'Test affine, cubic, and quintic bridges.',
        'Evaluate whether frozen ladders improve interval-certified H_t, H_t\', H_t\'\' bounds.',
      ]),
      currentAppInfrastructure: Object.freeze([
        Object.freeze({
          path: 'src/math/zeta.js',
          brief:
            'Riemann-Siegel Z evaluation (riemannSiegelZ, riemannSiegelTheta, ' +
            'riemannSiegelZEnhanced, findZerosRS), Dirichlet partial sums, ' +
            'Euler product, ZETA_ZEROS catalog — the Riemann-Siegel scale ' +
            'the paper names for low-shell observables.',
        }),
        Object.freeze({
          path: 'rust/interval-rk4/src/rk4.rs',
          brief:
            'Classical forward / backward RK4 in interval arithmetic ' +
            '(rk4_interval_step, dyson_drift_vector). The Phase 1 MVP ' +
            'baseline used at (beta, P) = (0, 0) for the imp-1090 / ' +
            'imp-1091 / imp-1092 Rust port chain.',
        }),
        Object.freeze({
          path: 'src/math/interval-dyson-integrator.mjs',
          brief:
            'JS-side interval RK4 mirror of rk4.rs — used at small N and ' +
            'as the bitwise-identical reference for the Rust acceptance tests.',
        }),
        Object.freeze({
          path: 'src/data/finite-height-beats-platt-trudgian.js',
          brief:
            'Frozen-ladder K_PLATEAU_LADDER consumer; rigorous-unconditional-' +
            'beat at N* = 1e4 and conservative carryforward to N* = 1e6 — ' +
            'the load-bearing classical-point benchmark this stage is meant ' +
            'to tighten.',
        }),
      ]),
      gaps: Object.freeze([
        'No coherent-shell observable layer per se: zeta.js exposes ' +
          'Riemann-Siegel Z, but the windowed transfer criterion on ' +
          'constant-shell-length windows is not implemented as a named ' +
          'subroutine.',
        'Hard vs viscosity-smoothed cutoff comparison not wired; the JS / ' +
          'Rust integrators run with hard cutoffs only.',
        'Affine / cubic / quintic bridge sweep not present; only the ' +
          'baseline cubic bridge is exercised by the existing chain.',
        'Frozen-ladder evaluation of H_t\' and H_t\'\' (second-derivative ' +
          'sensitivity) is open: K_PLATEAU_LADDER bounds H_t = Lambda only.',
      ]),
      status: 'stage-partial',
    }),

    Object.freeze({
      stageNumber: 'II',
      sectionRef: '§20.2',
      title: 'Pressure-temperature exploration',
      paperDescription:
        'Choose equations of state psi, construct admissible multipliers ' +
        'M_{beta, P}, and track zeros while monitoring analytic and ' +
        'computational supercriticality.',
      paperBullets: Object.freeze([
        'Choose equations of state psi (the thermodynamic input).',
        'Construct admissible multipliers M_{beta, P} (pressure-temperature deformations).',
        'Track zeros while monitoring analytic and computational supercriticality.',
      ]),
      currentAppInfrastructure: Object.freeze([
        Object.freeze({
          path: 'src/math/supercritical.js',
          brief:
            'Thermodynamic state, partition-function interpretation, ' +
            'heat-evolved Xi (heatFlowZeros, heatEvolvedXi, heatFlowScan), ' +
            'thermodynamic scan over sigma — covers the (beta, P)-style ' +
            'thermodynamic axis the paper names.',
        }),
        Object.freeze({
          path: 'src/pages/HamiltonianPage.jsx',
          brief:
            'Von Mangoldt explicit-formula visualization and ladder ' +
            'network at varied temperature — the existing UI for ' +
            'pressure-temperature deformations of the ladder.',
        }),
        Object.freeze({
          path: 'src/pages/SupercriticalPage.jsx',
          brief:
            'Tab for the supercritical/heat-flow exploration (beta-axis ' +
            'sweep, heat-evolved Xi landscape).',
        }),
      ]),
      gaps: Object.freeze([
        'No admissible-multiplier family M_{beta, P} is constructed; ' +
          'supercritical.js exposes the heat flow and primon partition ' +
          'function, not the paper\'s M_{beta, P} family.',
        'No zero-tracking sweep along (beta, P) deformations: the existing ' +
          'heatFlowZeros traces zeros only along the t (heat-time) axis, ' +
          'not along a curve in (beta, P).',
        'Analytic vs computational supercriticality monitor is not ' +
          'implemented as a named tripwire (see §19 for the distinction).',
        'No equation-of-state catalog psi: only the primon gas partition ' +
          'function is wired, not the paper\'s broader psi family.',
      ]),
      status: 'stage-partial',
    }),

    Object.freeze({
      stageNumber: 'III',
      sectionRef: '§20.3',
      title: 'Interval certification',
      paperDescription:
        'Replace floating-point quadrature by ball arithmetic, certify ' +
        'proxy tails, verify zero cells with local interval slacks, and ' +
        'compare runtime / error budgets to Polymath15-type baselines.',
      paperBullets: Object.freeze([
        'Replace floating-point quadrature by ball arithmetic.',
        'Certify proxy tails.',
        'Verify zero cells with local interval slacks.',
        'Compare runtime / error budgets with Polymath15-type baselines.',
      ]),
      currentAppInfrastructure: Object.freeze([
        Object.freeze({
          path: 'rust/interval-rk4/',
          brief:
            'Full Rust crate built on inari directed-rounding intervals: ' +
            'rk4.rs (classical RK4), dp45.rs (Dormand-Prince adaptive), ' +
            'verner87.rs (Verner 8(7)), barnes_hut*.rs (multipole O(N log N)), ' +
            'chain.rs (long-horizon chains), parallel.rs (Rayon sweep) — ' +
            'the ball-arithmetic substrate for Stage III.',
        }),
        Object.freeze({
          path: 'lean/LambdaAttack/',
          brief:
            'Lean 4 scaffolding: Foundation.lean, Constants.lean, ' +
            'BridgeTheorem.lean, FiniteHeightBeat.lean, ManyBody.lean, ' +
            'EmpiricalSweep.lean, CompositionCheck.lean, Capstone.lean — ' +
            'the formal-verification layer named in the paper as the ' +
            'certification target.',
        }),
        Object.freeze({
          path: 'scripts/run-assertions.mjs',
          brief:
            'Build-time assertion sweep harness that runs every ' +
            'exported *_ASSERTIONS array — the runtime tripwire layer ' +
            'that catches regressions in the chain numerics.',
        }),
        Object.freeze({
          path: 'src/data/rust-port-phase1-validation.js',
          brief:
            'imp-1090 Phase 1 MVP validation record: 17.32x speedup vs JS, ' +
            'maxAbsDiff = 0 at N = 1000, max-interval width 3.31e-8 — the ' +
            'first measured Stage-III runtime / error budget number.',
        }),
        Object.freeze({
          path: 'src/data/rust-port-phase3-pilot-validation.js',
          brief:
            'imp-1092 Phase 3 pilot at N = 2e4: certified bracket ' +
            't_c in [0.0001, 0.0002] with max interval width 4.91e-10 ' +
            '(replaces conservative carryforward at first plateau).',
        }),
      ]),
      gaps: Object.freeze([
        'Lean axioms still encode upstream chain links as numeric pinning ' +
          'axioms (see FiniteHeightBeat.lean link1..link6) rather than ' +
          'discharged proofs — the formal-verification side is not yet ' +
          'a closed chain.',
        'Full 9-plateau measured sweep (5e4..1e6) is open as named sub-gap ' +
          'imp-1092-sub-full-9plateau-measured-sweep; only the first ' +
          'plateau (N = 2e4) is measured.',
        'Proxy-tail certification is not yet wired as a tripwire-grade ' +
          'subroutine: the tail bounds used downstream are conservative ' +
          'analytic estimates, not certified intervals.',
        'Direct Polymath15-baseline comparison (runtime + error budget ' +
          'at matched precision) is not in-tree; only the Lambda <= 0.2 ' +
          'Platt-Trudgian 2021 bound is compared to, not the Polymath15 ' +
          'interval-arithmetic runtime ledger.',
      ]),
      status: 'stage-partial',
    }),
  ]),

  stageNumbers: Object.freeze(['I', 'II', 'III']),
  paperOrder: Object.freeze(['I', 'II', 'III']),
});

/**
 * Helper: find a stage by Roman numeral (case-insensitive).
 * Returns the frozen stage entry, or null if the input is not I / II / III.
 *
 * @param {string} numeral - one of 'I', 'II', 'III' (case-insensitive)
 * @returns {object|null}
 */
export function findStage(numeral) {
  if (typeof numeral !== 'string') return null;
  const upper = numeral.toUpperCase();
  const hit = RIGOROUS_NUMERICS_STAGES.stages.find(
    (s) => s.stageNumber === upper,
  );
  return hit || null;
}

// ── Build-time tripwires (>= 5) ──────────────────────────────────────────────
//
// Guards the structural invariants of RIGOROUS_NUMERICS_STAGES. The
// scripts/run-assertions.mjs harness invokes every .holds() and fails the
// build if any returns false. The .why string is the human-readable failure
// reason.

export const RIGOROUS_NUMERICS_STAGES_ASSERTIONS = [
  {
    id: 'imp1220-three-stages-present',
    holds: () =>
      Array.isArray(RIGOROUS_NUMERICS_STAGES.stages) &&
      RIGOROUS_NUMERICS_STAGES.stages.length === 3 &&
      RIGOROUS_NUMERICS_STAGES.stages.every(
        (s) =>
          s &&
          typeof s.stageNumber === 'string' &&
          /^(I|II|III)$/.test(s.stageNumber),
      ),
    why:
      'RIGOROUS_NUMERICS_STAGES.stages must contain exactly 3 entries with ' +
      'Roman-numeral identifiers I, II, III. Section 20 of the paper names ' +
      'exactly these three stages.',
  },
  {
    id: 'imp1220-stages-ordered-I-II-III',
    holds: () =>
      RIGOROUS_NUMERICS_STAGES.stages
        .map((s) => s.stageNumber)
        .join('-') === 'I-II-III',
    why:
      'Stages must appear in canonical paper order I, II, III. Out-of-' +
      'order entries break the lettering used by the companion page and the ' +
      'cross-references in §20.1 / §20.2 / §20.3.',
  },
  {
    id: 'imp1220-every-stage-has-required-fields',
    holds: () =>
      RIGOROUS_NUMERICS_STAGES.stages.every(
        (s) =>
          typeof s.title === 'string' &&
          s.title.length >= 5 &&
          typeof s.paperDescription === 'string' &&
          s.paperDescription.length >= 60 &&
          Array.isArray(s.paperBullets) &&
          s.paperBullets.length >= 1 &&
          Array.isArray(s.currentAppInfrastructure) &&
          s.currentAppInfrastructure.length >= 1 &&
          s.currentAppInfrastructure.every(
            (r) =>
              r &&
              typeof r.path === 'string' &&
              r.path.length >= 5 &&
              typeof r.brief === 'string' &&
              r.brief.length >= 20,
          ) &&
          Array.isArray(s.gaps) &&
          s.gaps.length >= 1 &&
          typeof s.status === 'string' &&
          /^stage-(implemented|partial|not-started)$/.test(s.status),
      ),
    why:
      'Every stage record must carry title, substantive paperDescription ' +
      '(>=60 chars), at least one paperBullet, at least one ' +
      'currentAppInfrastructure entry with path + brief, at least one gap, ' +
      'and a status from the allowed vocabulary.',
  },
  {
    id: 'imp1220-stage-I-cites-zeta-and-rk4',
    holds: () => {
      const s = findStage('I');
      if (!s) return false;
      const paths = s.currentAppInfrastructure.map((r) => r.path);
      return (
        paths.some((p) => p === 'src/math/zeta.js') &&
        paths.some((p) => p === 'rust/interval-rk4/src/rk4.rs')
      );
    },
    why:
      'Stage I (classical benchmark) must cite src/math/zeta.js (Riemann-' +
      'Siegel evaluation, the "Riemann-Siegel scale" the paper names) and ' +
      'rust/interval-rk4/src/rk4.rs (the classical-point RK4 baseline).',
  },
  {
    id: 'imp1220-stage-II-cites-supercritical-and-hamiltonian',
    holds: () => {
      const s = findStage('II');
      if (!s) return false;
      const paths = s.currentAppInfrastructure.map((r) => r.path);
      return (
        paths.some((p) => p === 'src/math/supercritical.js') &&
        paths.some((p) => p === 'src/pages/HamiltonianPage.jsx')
      );
    },
    why:
      'Stage II (pressure-temperature exploration) must cite ' +
      'src/math/supercritical.js (heat-flow / partition-function ' +
      'primitives) and src/pages/HamiltonianPage.jsx (the existing ' +
      'pressure-temperature UI).',
  },
  {
    id: 'imp1220-stage-III-cites-rust-and-lean',
    holds: () => {
      const s = findStage('III');
      if (!s) return false;
      const paths = s.currentAppInfrastructure.map((r) => r.path);
      return (
        paths.some((p) => p.startsWith('rust/interval-rk4')) &&
        paths.some((p) => p.startsWith('lean/'))
      );
    },
    why:
      'Stage III (interval certification) must cite the rust/interval-rk4/ ' +
      'ball-arithmetic crate AND the lean/ formal-verification scaffolding. ' +
      'These are the two named substrates of the certification stage.',
  },
  {
    id: 'imp1220-stage-III-cites-tripwire-harness',
    holds: () => {
      const s = findStage('III');
      if (!s) return false;
      return s.currentAppInfrastructure.some(
        (r) => r.path === 'scripts/run-assertions.mjs',
      );
    },
    why:
      'Stage III must cite scripts/run-assertions.mjs (the runtime ' +
      'tripwire harness named in §20.3 as the "verify zero cells with ' +
      'local interval slacks" infrastructure).',
  },
  {
    id: 'imp1220-no-stage-overclaims-complete',
    holds: () =>
      RIGOROUS_NUMERICS_STAGES.stages.every(
        (s) => s.status !== 'stage-implemented' || s.gaps.length === 0,
      ),
    why:
      'No stage may carry status stage-implemented while still listing ' +
      'open gaps. If gaps are non-empty the honest status is stage-partial.',
  },
  {
    id: 'imp1220-find-stage-helper-works',
    holds: () => {
      const i = findStage('i');
      const iii = findStage('III');
      const bogus = findStage('IV');
      return (
        i &&
        i.stageNumber === 'I' &&
        iii &&
        iii.stageNumber === 'III' &&
        bogus === null &&
        findStage('') === null &&
        findStage(null) === null
      );
    },
    why:
      'findStage(numeral) must be case-insensitive for I / II / III, ' +
      'return null for any other numeral, and gracefully handle empty / ' +
      'non-string inputs.',
  },
  {
    id: 'imp1220-stage-titles-match-paper',
    holds: () => {
      const titles = {
        I: 'Classical benchmark',
        II: 'Pressure-temperature exploration',
        III: 'Interval certification',
      };
      return RIGOROUS_NUMERICS_STAGES.stages.every(
        (s) => s.title === titles[s.stageNumber],
      );
    },
    why:
      'Stage titles must match the §20.1 / §20.2 / §20.3 paper titles ' +
      'verbatim ("Classical benchmark", "Pressure-temperature exploration", ' +
      '"Interval certification"). Drift here silently misrepresents §20.',
  },
];
