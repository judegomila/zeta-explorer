/**
 * @module imp-34163-ladder-surrogate-what-remains
 * @fileoverview imp-34163 -- The imp-33810 quarter-decade ladder surrogate (k=6.00..11.00 rungs of
 * the inherited imp-3220/imp-3406 component model) has spawned a long diagnostic thread: imp-33843
 * (log-linear widening form), imp-33858 (residual localization), imp-33948 (apex curvature error
 * bar), imp-33962 (rung-by-rung attribution), imp-34008 (apex-parabola wing test), imp-34009
 * (window-endpoint sensitivity), imp-34022 (trough-vs-peak migration), imp-34023 (F4 collapse /
 * over-prediction extrapolation), imp-34024 (KPSS stationarity), imp-34025 (AR(2) + Breusch-Godfrey
 * LM), and the imp-34082..imp-34087 scout wave (endpoint-drop robustness, KPSS bandwidth sweep,
 * apex cubic tilt, trough/peak convergence, head/tail trim split, F4 cancellation-loss). Each
 * module reports its own settled finding and often its own named open follow-up, but no single note
 * tabulated which diagnostics are SETTLED (module landed, finding stands) vs still OPEN (a pending
 * queue ticket exists asking for more). This module is that WHAT-REMAINS tabulation.
 *
 * METHOD (read-only, performed at author time): read each thread module's landed finding from its
 * own summary/detail (as logged in improvements.js) and cross-checked the live pending queue
 * (scripts/queue-index.json) for follow-up tickets naming any thread id. Settled/open classification
 * reflects queue state at authoring time (2026-07-05); tickets may complete after this snapshot.
 *
 * Content/organization only. No computation performed, no bound changed, no operator positivity
 * established. The inherited component model is NOT a rigorous asymptotic; C_mb GUE-conditional per
 * imp-486 untouched; imp-3066 K_a>=0 untouched; NO QED; Platt-Trudgian Lambda<=0.2 remains SOTA.
 *
 * @see imp-33936-sigma-decay-cohort-citation-audit (sibling cohort-audit pattern this module follows)
 * @see SurrogateDiagnosticCohortNote (shared honest-status boilerplate for the imp-34082..34087 cohort)
 */

export const LADDER_SURROGATE_WHAT_REMAINS = {
  id: 'imp-34163',
  snapshotAt: '2026-07-05',
  threadRootId: 'imp-33810',
  settled: [
    { id: 'imp-33843', finding: 'The ~918x eflow_attr/resid_exp widening across k=6..11 follows a LOG-LINEAR (constant-per-decade), not power-law, form; RMSE~0.116.' },
    { id: 'imp-33858', finding: 'The imp-33843 fit residual is STRUCTURED (not uniform noise) -- it concentrates rather than scattering evenly across the ladder.' },
    { id: 'imp-33948', finding: 'Local-quadratic error bar on the imp-33878 resid_exp(k) apex confirms the curvature reading: resid double-prime(k*)~-3.613e-2, matching the central-difference estimate.' },
    { id: 'imp-33962', finding: 'The imp-33922 F2*F3*F4=0.05022 attribution attenuation was decomposed rung-by-rung across all 20 adjacent-rung steps of the ladder.' },
    { id: 'imp-34009', finding: 'The imp-33962 aggregate 92.25% F2 |ln|-share drifts under symmetric window-endpoint shrink; sub-rung crossing/peak later pinned exactly by imp-34128 (s*=0.16977, share apex 0.96624).' },
    { id: 'imp-34022', finding: 'The endpoint-peak (argmax) and interior-trough (argmin) migrate in OPPOSITE senses across BASE/EXT115/EXT12, and the interior is not boundary-invariant after stripping edge excursions.' },
    { id: 'imp-34023', finding: 'The F4 (imp-33773 M2 residual ratio) collapse across kEnd=11..13 extrapolates the F1 over-prediction ratio past kEnd=13, up to a sign-change ceiling kEnd*~21.281 later DERIVED in closed form by imp-34127 (estimator-discretization artifact, D^2/160 exactly).' },
    { id: 'imp-34024', finding: 'KPSS (opposite null to the imp-33963 Dickey-Fuller test) combined into a DF/KPSS confirmatory-classification cell on the same 21 signed imp-33858 residuals.' },
    { id: 'imp-34025', finding: 'AR(2) + Breusch-Godfrey LM (orders 2..5) test whether the imp-33964 sign-changing negative-lobe ACF survives beyond pure AR(1).' },
    { id: 'imp-34082', finding: 'Leave-endpoints-out (drop k=6 head, k=11 tail) re-fit of the imp-33843 log-linear OLS on 19 interior rungs, re-checking Durbin-Watson + Ljung-Box.' },
    { id: 'imp-34083', finding: 'KPSS Newey-West Bartlett-bandwidth sweep (l in {0,1,2,8}) tests whether the imp-34024 fails-to-reject-stationarity verdict is bandwidth-robust.' },
    { id: 'imp-34084', finding: 'Apex CUBIC coefficient d=(1/6)resid-triple-prime(k*) measured directly (P(t)=a+bt+ct^2+dt^3), replacing the imp-34008 wing-asymmetry-INFERRED estimate.' },
    { id: 'imp-34085', finding: 'Trough-to-peak amplitude ratio tested for convergence as the ladder fit boundary recedes (extended to k=6..12.5, 6..13).' },
    { id: 'imp-34086', finding: 'imp-34009 symmetric window-endpoint sensitivity split into ONE-sided head-only and tail-only trims, attributing the ~0.18 drift; cross-linked to viz by imp-34162.' },
    { id: 'imp-34087', finding: 'Catastrophic-cancellation significance loss in the imp-34023 F4 surrogate quantified as kEnd approaches the ~21.281 zero crossing.' },
  ],
  openFollowUps: [
    { id: 'imp-34089', of: 'imp-34022', question: 'Fit the interior residual drift as its own growth law and test saturation vs endpoint-peak amplification rate.' },
    { id: 'imp-34090', of: 'imp-34023', question: 'Refit the F4 collapse with an accelerating quadratic-in-kEnd log-decay to close the under-prediction gap.' },
    { id: 'imp-34131', of: 'imp-34084', question: 'Cross-check the apex cubic coefficient d against the imp-34008 wing-asymmetry-inferred cubic tilt.' },
    { id: 'imp-34133', of: 'imp-34023', question: 'Fit the asymptotic limits of the near-flat F2(kEnd)/F3(kEnd) per-unit factors near the surrogate ceiling.' },
    { id: 'imp-34146', of: 'imp-34084', question: 'Fit the apex QUINTIC (t^5) term to isolate the residual odd overshoot the cubic left.' },
    { id: 'imp-34147', of: 'imp-34084', question: 'Test whether the negative apex cubic-tilt sign d<0 persists as the fit window centre is swept.' },
    { id: 'imp-34148', of: 'imp-34086', question: 'Locate the combined-trim m where head and tail F4 pushes exactly cancel.' },
    { id: 'imp-34149', of: 'imp-34086', question: 'Locate the fractional tail-only trim m* where the tail-only F4 crosses unity exactly.' },
    { id: 'imp-34150', of: 'imp-34023 / imp-34087', question: 'Cross-validate the kEnd*~21.281 crossing by an independent direct bisection of raw resid(kEnd).' },
    { id: 'imp-34151', of: 'imp-34087', question: 'Verify the cancellation numerator stays O(1) past the 21.281 crossing and locate where it departs.' },
    { id: 'imp-34152', of: 'imp-34082', question: 'Test robustness of the residual-ACF lag-4 sign-change on the quadratic re-fit residual.' },
    { id: 'imp-34153', of: 'imp-34085', question: 'Locate where interior-trough per-step deepening overtakes endpoint-peak per-step growth.' },
    { id: 'imp-34154', of: 'imp-34085', question: 'Test whether the R3 stall-then-jump argmin migration is a grid-discretization artifact via continuous-k argmin.' },
    { id: 'imp-34155', of: 'imp-34083', question: 'Measure the margin of the KPSS l=0 borderline rejection.' },
    { id: 'imp-34164', of: 'imp-34082..imp-34087', question: 'Audit that run-assertions.mjs registers every one of the six modules.' },
    { id: 'imp-34165', of: 'imp-34085', question: 'Audit the EXT125/EXT13 extension-rung reuse gate against the inherited BASE/EXT115/EXT12 argmax/argmin.' },
  ],
  honestNote:
    'This note tabulates an inherited-surrogate diagnostic thread, not an RH bound. The component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; C_mb ' +
    'GUE-conditional per imp-486 untouched; imp-3066 K_a>=0 untouched; changes no bound; no operator ' +
    'positivity established; NO QED; Platt-Trudgian Lambda<=0.2 remains SOTA.',
};

const LADDER_SURROGATE_WHAT_REMAINS_ASSERTIONS = [
  {
    id: 'imp34163-settled-count',
    holds: () => LADDER_SURROGATE_WHAT_REMAINS.settled.length === 15,
    why: 'The tabulation covers all 15 named thread-root modules (imp-33843/33858/33948/33962/34009/34022/34023/34024/34025/34082..34087) landed as of the 2026-07-05 snapshot.',
  },
  {
    id: 'imp34163-open-followups-nonempty',
    holds: () => LADDER_SURROGATE_WHAT_REMAINS.openFollowUps.length > 0,
    why: 'The thread is still active in the live pending queue; a WHAT-REMAINS note with zero open items would misrepresent the queue snapshot.',
  },
  {
    id: 'imp34163-no-id-overlap-settled-vs-open',
    holds: () => {
      const settledIds = new Set(LADDER_SURROGATE_WHAT_REMAINS.settled.map((s) => s.id));
      return LADDER_SURROGATE_WHAT_REMAINS.openFollowUps.every((o) => !settledIds.has(o.id));
    },
    why: 'A ticket id must not be double-counted as both landed and still-open in the same snapshot.',
  },
  {
    id: 'imp34163-honest-scope-locked',
    holds: () =>
      /SOTA/.test(LADDER_SURROGATE_WHAT_REMAINS.honestNote) &&
      /NO QED/.test(LADDER_SURROGATE_WHAT_REMAINS.honestNote),
    why: 'VERDICT LOCK: this is a content/organization tabulation, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of LADDER_SURROGATE_WHAT_REMAINS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-34163 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { LADDER_SURROGATE_WHAT_REMAINS_ASSERTIONS };
