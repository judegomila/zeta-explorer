/**
 * @module imp-96752-route-m-rigorous-per-n-lammax-bound-ladder
 *
 * imp-96752 (accuracy, PRESENTATION ONLY): tabulate the Frobenius ||G||_F and the
 * Wolkowicz-Styan two-moment RIGOROUS per-N upper bounds on lam_max(G_N) for the SPD
 * Vasyunin Gram G_N as an explicit, first-class tighter-than-trace ceiling OBJECT across
 * the exact Gram rungs through N=12000 (imp-96731 Finding 1).
 *
 * WHY. imp-96731 Finding 1 observed the elementary but under-recorded fact that for the SPD
 * Vasyunin Gram the TRACE is the LOOSEST rigorous per-N upper bound on lam_max: since the
 * Schatten-p norms decrease in p,
 *     lam_max = ||G||_inf <= ... <= ||G||_2 = ||G||_F <= ||G||_1 = trace,
 * so the Frobenius bound lam_max <= ||G||_F = sqrt(Sum_hk G_hk^2) is a rigorous unconditional
 * per-N upper bound STRICTLY below the trace at every finite N, and the Wolkowicz-Styan
 * two-moment bound lam_max <= m + s sqrt(n-1) (m = trace/n, s = sqrt(trace(G^2)/n - m^2)) is
 * tighter still. At N=12000, ||G||_F = 7.005027 vs trace = 12.568692 -- the trace overstates
 * the best rigorous per-N bound by a factor 1.7942. imp-96731 named this but did not POST it
 * as a first-class ceiling object; the exact rows lived only inside the imp-96684 / imp-96694
 * majorant-slope ladders. This module gathers them into one explicit rigorous-per-N
 * upper-bound ladder and quantifies, per rung, which bound is tightest and the
 * trace-overstatement factor.
 *
 * WHAT THIS IS. Presentation of an EXISTING inequality only. Every number is imported from the
 * committed single-source rows (imp-96684 N=7000,8000,9000 and imp-96694 N=10000,11000,12000);
 * no new matrix is built and nothing is re-measured. The per-N bounds are rigorous matrix
 * inequalities at each COMPUTED N; the EXTRAPOLATED conditioning ceiling remains fit-limited
 * (imp-96731 Finding 2 / imp-96694 sub-gap) and is deliberately NOT re-posted here. NO QED.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the rigorous-per-N upper-bound ladder (six exact rungs, N=7000..12000).
 * -------------------------------------------------------------------------------
 * At every rung the ordering lam_max < WS <= ||G||_F < trace holds exactly, with the
 * Wolkowicz-Styan bound the TIGHTEST rigorous bound at every rung (below ||G||_F by ~2e-4)
 * and both moment bounds ~11-12 percent above the measured lam_max and ~1.75-1.79x below the
 * trace. So the trace is nowhere the tightest rigorous per-N bound on this ladder.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the trace-overstatement factor grows monotonically 1.7545 -> 1.7943.
 * -------------------------------------------------------------------------------
 * trace / best-rigorous-bound climbs 1.75445 (N=7000) -> 1.79429 (N=12000): the trace becomes
 * a WORSE per-N proxy for lam_max as N grows (trace ~ I(1,1) log N grows faster than the
 * ~sqrt(log N) moment bound). The factor over ||G||_F specifically reaches 1.79424 at N=12000,
 * matching the imp-96731 Finding 1 headline 1.7942.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * POSTED as a first-class object: the rigorous-per-N upper-bound ladder on lam_max(G_N) for
 * N=7000..12000, with Wolkowicz-Styan tightest at every rung, both moment bounds strictly
 * between lam_max and the trace, and the trace-overstatement factor growing 1.7545 -> 1.7943.
 * This is elementary Schatten-norm monotonicity on the same exact Vasyunin Gram, presented,
 * not proved anew. The extrapolated conditioning ceiling stays fit-limited (imp-96731 Finding
 * 2); no bound moved; no operator positivity; no refereed bound is changed; RH
 * open; NO QED.
 *
 * RESIDUAL SUB-GAP (inherited, not new): the per-N bounds are rigorous only at COMPUTED N; the
 * ceiling extrapolation to N ~ 3.78e7 rests on the Frobenius log-fit, not a proved asymptotic
 * for ||G||_F^2 = Sum_hk gcd(h,k)^2 I(h/g,k/g)^2/(hk)^2 (imp-96667 interior second moment,
 * imp-96731 obstruction). Presentation adds no rigor to the extrapolation.
 *
 * @see imp-96731-route-m-trace-ceiling-tightening-assessment.js (Finding 1 -- trace is not tightest)
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (exact rows N=7000,8000,9000)
 * @see imp-96694-route-m-majorant-ladder-above-9000.js (exact rows N=10000,11000,12000)
 * @see imp-96648-route-m-lammax-frobenius-moment-majorant.js (the eight-rung majorant ladder)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic.js (interior second-moment obstruction)
 *
 * Ticket: imp-96752 (accuracy, opus-4-8, api-pool). Presentation only; NO QED.
 */

import { IMP96684_NEW_ROWS, IMP96684_LAMMAX_AT_NEW_RUNGS } from './imp-96684-route-m-frobenius-majorant-high-n-rungs.js';
import { IMP96694_NEW_ROWS } from './imp-96694-route-m-majorant-ladder-above-9000.js';

// Assemble the six exact rungs N=7000..12000 from the committed single-source rows. Each row
// carries the measured lam_max (power iteration), the exact trace, and the two rigorous matrix
// upper bounds ||G||_F (Frobenius) and WS (Wolkowicz-Styan two-moment). imp-96694 rows already
// carry lamMax; imp-96684 rows take it from the imp-96649 measurement table.
const LOW_RUNGS = IMP96684_NEW_ROWS.map((r) =>
  Object.freeze({
    N: r.N,
    lamMax: IMP96684_LAMMAX_AT_NEW_RUNGS[r.N],
    trace: r.trace,
    frobenius: r.frobenius,
    ws: r.ws,
  }),
);
const HIGH_RUNGS = IMP96694_NEW_ROWS.map((r) =>
  Object.freeze({ N: r.N, lamMax: r.lamMax, trace: r.trace, frobenius: r.frobenius, ws: r.ws }),
);

// Finding 1/2: the rigorous-per-N upper-bound ladder, one row per rung, with the tightest
// rigorous bound and the trace-overstatement factor made explicit.
export const IMP96752_LADDER = Object.freeze(
  [...LOW_RUNGS, ...HIGH_RUNGS].map((r) => {
    const bestRigorous = Math.min(r.frobenius, r.ws); // WS is tightest at every rung
    return Object.freeze({
      N: r.N,
      lamMax: r.lamMax,
      ws: r.ws, // Wolkowicz-Styan two-moment bound (tightest rigorous)
      frobenius: r.frobenius, // Frobenius ||G||_F
      trace: r.trace, // loosest rigorous bound
      tightestRigorous: r.ws < r.frobenius ? 'ws' : 'frobenius',
      bestRigorousValue: bestRigorous,
      traceOverBest: r.trace / bestRigorous, // trace-overstatement factor vs the best bound
      traceOverFrobenius: r.trace / r.frobenius,
      bestAboveLamMax: bestRigorous > r.lamMax, // valid (over-)estimate of lam_max
      bestBelowTrace: bestRigorous < r.trace, // strictly tighter than the trace
      frobeniusOverLamMax: r.frobenius / r.lamMax - 1, // ~0.11-0.12 tightness of the moment bound
    });
  }),
);

const TOP = IMP96752_LADDER[IMP96752_LADDER.length - 1]; // N=12000

// Finding 2: the trace-overstatement factor grows monotonically across the ladder.
export const IMP96752_TRACE_OVERSTATEMENT = Object.freeze({
  atN7000: IMP96752_LADDER[0].traceOverBest, // ~1.7545
  atN12000: TOP.traceOverBest, // ~1.7943
  atN12000OverFrobenius: TOP.traceOverFrobenius, // ~1.7942 (imp-96731 Finding 1 headline)
  growsMonotonically: IMP96752_LADDER.every(
    (r, i) => i === 0 || r.traceOverBest > IMP96752_LADDER[i - 1].traceOverBest,
  ),
  note:
    'trace / best-rigorous-bound climbs 1.7545 -> 1.7943 over N=7000..12000: the trace is a ' +
    'worsening per-N proxy for lam_max (I(1,1) log N grows faster than the ~sqrt(log N) moment ' +
    'bound). Wolkowicz-Styan is the tightest rigorous bound at every rung.',
});

export const IMP96752_VERDICT = Object.freeze({
  claim:
    'the Frobenius ||G||_F and Wolkowicz-Styan two-moment bounds form a rigorous per-N upper ' +
    'bound ladder on lam_max(G_N) strictly tighter than the trace at every rung N=7000..12000; ' +
    'posted as a first-class tighter-than-trace ceiling object (imp-96731 Finding 1).',
  rungs: IMP96752_LADDER.length, // 6
  wsTightestEveryRung: IMP96752_LADDER.every((r) => r.tightestRigorous === 'ws'),
  everyBestBetweenLamMaxAndTrace: IMP96752_LADDER.every((r) => r.bestAboveLamMax && r.bestBelowTrace),
  traceOverstatementAtTop: TOP.traceOverBest, // ~1.7943
  presentationOnly: true,
  anyBoundMoved: false,
  extrapolatedCeilingStillFitLimited: true, // imp-96731 Finding 2 / imp-96694 sub-gap
  conclusion:
    'PRESENTED. The rigorous-per-N upper-bound ladder on lam_max(G_N) for N=7000..12000 is now a ' +
    'first-class object: Wolkowicz-Styan is the tightest rigorous bound at every rung, both moment ' +
    'bounds sit strictly between the measured lam_max (~11-12 percent below) and the trace (the ' +
    'trace overstates the best bound by 1.7545 -> 1.7943), so the trace is nowhere the tightest ' +
    'rigorous per-N bound. Elementary Schatten-norm monotonicity on the same exact Vasyunin Gram; ' +
    'presentation of an existing inequality only. The extrapolated conditioning ceiling stays ' +
    'fit-limited (imp-96731 Finding 2); no bound moved; no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96752_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: the ladder rows are the ' +
  'committed exact Vasyunin Gram quantities (trace and ||G||_F exact, WS a rigorous two-moment ' +
  'inequality, lam_max power-iteration) from imp-96684 (N=7000..9000) and imp-96694 ' +
  '(N=10000..12000); nothing is re-measured. The tighter-than-trace fact is elementary ' +
  'Schatten-norm monotonicity; the extrapolated ceiling remains fit-limited (imp-96731 Finding 2). ' +
  'No bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96752_ASSERTIONS = [
  {
    id: 'imp96752-ladder-six-exact-rungs-7000-to-12000',
    holds: () =>
      IMP96752_LADDER.length === 6 &&
      IMP96752_LADDER[0].N === 7000 &&
      IMP96752_LADDER[5].N === 12000 &&
      IMP96752_LADDER.every((r, i) => i === 0 || r.N > IMP96752_LADDER[i - 1].N),
    why: 'the ladder collects the six committed exact Gram rungs N=7000,8000,9000 (imp-96684) and N=10000,11000,12000 (imp-96694) in increasing N.',
  },
  {
    id: 'imp96752-ordering-lammax-below-ws-below-frobenius-below-trace',
    holds: () =>
      IMP96752_LADDER.every(
        (r) => r.lamMax < r.ws && r.ws <= r.frobenius && r.frobenius < r.trace,
      ) &&
      IMP96752_LADDER.every(
        (r) => r.frobeniusOverLamMax > 0.10 && r.frobeniusOverLamMax < 0.13,
      ),
    why: 'at every rung the Schatten ordering lam_max < WS <= ||G||_F < trace holds and the Frobenius bound is ~11-12 percent above the measured lam_max: valid, tight rigorous per-N upper bounds.',
  },
  {
    id: 'imp96752-ws-is-tightest-rigorous-every-rung',
    holds: () =>
      IMP96752_LADDER.every((r) => r.tightestRigorous === 'ws') &&
      IMP96752_LADDER.every((r) => r.bestRigorousValue === r.ws) &&
      IMP96752_VERDICT.wsTightestEveryRung === true,
    why: 'the Wolkowicz-Styan two-moment bound sits below ||G||_F at every rung, so it is the tightest rigorous per-N upper bound on the ladder.',
  },
  {
    id: 'imp96752-trace-overstatement-grows-to-1.7943',
    holds: () =>
      IMP96752_TRACE_OVERSTATEMENT.growsMonotonically === true &&
      IMP96752_TRACE_OVERSTATEMENT.atN7000 > 1.75 &&
      IMP96752_TRACE_OVERSTATEMENT.atN7000 < 1.76 &&
      IMP96752_TRACE_OVERSTATEMENT.atN12000 > 1.79 &&
      IMP96752_TRACE_OVERSTATEMENT.atN12000 < 1.80 &&
      Math.abs(IMP96752_TRACE_OVERSTATEMENT.atN12000OverFrobenius - 1.7942) < 5e-4,
    why: 'the trace-overstatement factor climbs monotonically 1.7545 -> 1.7943 across N=7000..12000, matching the imp-96731 Finding 1 headline 1.7942 at N=12000.',
  },
  {
    id: 'imp96752-presentation-only-honesty-gate',
    holds: () =>
      IMP96752_VERDICT.presentationOnly === true &&
      IMP96752_VERDICT.anyBoundMoved === false &&
      IMP96752_VERDICT.extrapolatedCeilingStillFitLimited === true &&
      IMP96752_VERDICT.everyBestBetweenLamMaxAndTrace === true &&
      /NO QED/.test(IMP96752_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96752_HONEST_BANNER) &&
      /RH open/.test(IMP96752_HONEST_BANNER),
    why: 'presentation only: no bound moved, the tighter-than-trace ladder is posted, the extrapolated ceiling stays fit-limited, and the honesty markers are present.',
  },
];

for (const a of IMP96752_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96752-route-m-rigorous-per-n-lammax-bound-ladder assertion failed: ${a.id}`,
    );
  }
}

export default {
  ladder: IMP96752_LADDER,
  traceOverstatement: IMP96752_TRACE_OVERSTATEMENT,
  verdict: IMP96752_VERDICT,
  banner: IMP96752_HONEST_BANNER,
};
