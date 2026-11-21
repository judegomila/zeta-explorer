// src/data/imp-96261-route-m-vasyunin-n1e4-scheduling-status-note.js
//
// imp-96261: Correct the Route M residual framing left by IMP96105_SUBGAP
// (src/data/imp-96105-route-m-vasyunin-gram-extend-n6000.js) and IMP96203_SUBGAP
// (src/data/imp-96203-route-m-vasyunin-subleading-spectrum.js). Both describe
// the N=1e4 Vasyunin Gram target as "CPU-starved" without qualification, which
// reads as an intrinsic compute wall. imp-96230
// (src/data/imp-96230-route-m-vasyunin-gram-n1e4-feasibility.js) measured the
// actual cost drivers and found the opposite: a standalone dedicated process
// reaches N=1e4 in ~7 min wall / ~2 GB peak, far inside the ~100 GB project
// budget. The prior CPU-starvation (imp-96105 m9 died at N=3500) was POOL
// CONTENTION from concurrent workers sharing cores, not an O(N^3) wall.
//
// This note performs no new computation; it is a cross-reference only.

const IMP96105_SUBGAP_FRAMING = Object.freeze({
  ticket: 'imp-96105',
  subgapId: 'imp-96105-beyond-6000',
  statementFragment: 'the 1e4 build is CPU-starved by the active pool',
  readsAsComputeWall: true,
});

const IMP96203_SUBGAP_FRAMING = Object.freeze({
  ticket: 'imp-96203',
  subgapId: 'imp-96203-band-uniqueness-and-beyond-6000',
  statementFragment: 'extending d_N past N = 6000 (the 1e4 target of IMP96105_SUBGAP) remains CPU-starved',
  readsAsComputeWall: true,
});

const IMP96230_CORRECTION = Object.freeze({
  ticket: 'imp-96230',
  verdict: 'REACHABLE',
  totalWallMinutes: 6.6,
  eigvalshPeakMemoryGB: 1.92,
  ramBudgetGB: 100,
  priorBlocker: 'pool CPU-starvation (concurrent workers sharing cores), NOT an intrinsic O(N^3) wall',
  recommendation: 'a single dedicated off-peak process with a lam_min-only spectral check',
  classification: 'scheduling',
});

export const IMP96261_ROUTE_M_N1E4_SCHEDULING_STATUS_NOTE = Object.freeze({
  id: 'imp-96261-route-m-vasyunin-n1e4-scheduling-status-note',
  ticket: 'imp-96261',
  priorFraming: [IMP96105_SUBGAP_FRAMING, IMP96203_SUBGAP_FRAMING],
  correction: IMP96230_CORRECTION,

  summary:
    'IMP96105_SUBGAP and IMP96203_SUBGAP both describe the Route M N=1e4 Vasyunin Gram target as ' +
    '"CPU-starved" with no further qualification, which reads as an intrinsic O(N^3) compute wall. ' +
    'imp-96230 measured the actual cost drivers (Gram build ~315 s dominates, eigvalsh ~33 s, ' +
    'Cholesky ~2 s/rung) and found the N=1e4 build is REACHABLE at ~7 min wall / ~2 GB peak on a ' +
    'single dedicated process -- far inside the ~100 GB project RAM budget. The historical stall ' +
    '(imp-96105 attempt m9 died at N=3500) was pool CONTENTION from many concurrent workers sharing ' +
    'cores, not a wall inherent to the N=1e4 problem size.',

  honest:
    'CROSS-REFERENCE / STATUS-NOTE ONLY -- no new computation. imp-96230 is an ASSESSMENT: it did ' +
    'NOT run the N=1e4 ladder itself, so IMP96105_SUBGAP and IMP96203_SUBGAP stay open exactly as ' +
    'written on the substantive question (whether ratio(N) -> 1 beyond N=6000, and band uniqueness). ' +
    'What this note corrects is narrower: the RESOURCE framing. "CPU-starved" should be read as a ' +
    'scheduling condition (route the build to a dedicated off-peak process) reported as ~7 min / ~2 GB ' +
    'reachable, not as evidence the N=1e4 target is computationally infeasible. Changes no bound; ' +
    'establishes no operator positivity; NO QED; no refereed bound is changed; RH open.',
});

const IMP96261_ASSERTIONS = [
  {
    id: 'imp96261-prior-framing-flagged-as-wall-reading',
    holds: () =>
      IMP96105_SUBGAP_FRAMING.readsAsComputeWall === true &&
      IMP96203_SUBGAP_FRAMING.readsAsComputeWall === true,
  },
  {
    id: 'imp96261-correction-cites-imp96230-scheduling-verdict',
    holds: () =>
      IMP96230_CORRECTION.verdict === 'REACHABLE' &&
      IMP96230_CORRECTION.classification === 'scheduling' &&
      IMP96230_CORRECTION.totalWallMinutes < 10 &&
      IMP96230_CORRECTION.eigvalshPeakMemoryGB < IMP96230_CORRECTION.ramBudgetGB,
  },
  {
    id: 'imp96261-honesty-gate-no-qed-and-subgaps-stay-open',
    holds: () =>
      /NO QED/.test(IMP96261_ROUTE_M_N1E4_SCHEDULING_STATUS_NOTE.honest) &&
      /refereed bound is changed/i.test(IMP96261_ROUTE_M_N1E4_SCHEDULING_STATUS_NOTE.honest) &&
      /stay open/.test(IMP96261_ROUTE_M_N1E4_SCHEDULING_STATUS_NOTE.honest),
  },
];

for (const a of IMP96261_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96261-route-m-vasyunin-n1e4-scheduling-status-note assertion failed: ${a.id}`);
  }
}

export default IMP96261_ROUTE_M_N1E4_SCHEDULING_STATUS_NOTE;
