/**
 * @module imp-96791-route-m-conditioning-ceiling-loo-refit
 *
 * imp-96791 (accuracy, AUDIT ONLY): quantify the extrapolation uncertainty of the two
 * FIT conditioning ceilings behind the imp-96693 three-ceiling ladder (T 2.594e7 rigorous
 * < F 3.764e7 Frobenius-fit < M 4.109e7 measured-fit) by leave-one-out (jackknife) and
 * leave-one-decade-out refitting of the underlying imp-96684 Frobenius rungs and imp-96443
 * measured lam_max rungs, and report whether the strict T < F < M ordering survives. NO
 * bound moved.
 *
 * THE ISSUE. imp-96693 confirmed the three Route M lam_max conditioning ceilings are
 * mutually consistent and strictly ordered T < F < M, but flagged an inherited RESIDUAL
 * SUB-GAP: both F (Frobenius majorant ceiling ~3.764e7) and M (measured composed ceiling
 * ~4.109e7) rest on a + b log N log-fits extrapolated ~four decades from the accessible
 * rungs (N <= 9000 for F, N <= 6000 for M) out to N ~ 4e7. Only the trace ceiling
 * T ~ 2.594e7 is a rigorous lower bound. The magnitude of the extrapolation uncertainty on
 * F and M -- and whether the ordering is robust to which rungs enter the fit -- was never
 * measured. This ticket measures it.
 *
 * WHAT WAS DONE (tmp/imp-96791-loo.mjs, reproducible; pure re-analysis, no new solves).
 * The two log-fits are refit under two resampling schemes and the ceiling
 * cond#(N) = lam_max(N)/lam_min(N) = 1/eps is re-solved by the SAME imp-96684 bisection
 * (lam_min = imp-96428 power law A N^-p, A=0.8186721, p=1.917927) for each refit:
 *   (LOO)     leave-one-rung-out jackknife: drop each rung in turn, refit a + b log N,
 *             re-solve the ceiling; report the min/max spread across all drops.
 *   (DECADE)  leave-one-decade-out: drop every rung in one base-10 decade of N at once
 *             (10^2 = {250,500}; 10^3 = {1000..9000}), refit, re-solve.
 * The Frobenius fit uses the eleven imp-96684 rungs N=250..9000; the measured fit uses the
 * eight imp-96443 lam_max rungs N=250..6000. T is recomputed from the imp-96548 trace law
 * lam_max_trace(N) = I11 (log N + gamma), I11 = 1.2606614, unchanged (no fit, so no LOO).
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the jackknife (LOO) extrapolation band is tight: F +/-0.32%, M +/-0.67%.
 * -------------------------------------------------------------------------------
 * Leaving any single rung out of the Frobenius fit moves the ceiling F within
 * [3.7591e7, 3.7830e7] about the full-fit 3.7637e7 -- a half-band of +/-0.32%. The measured
 * ceiling M moves within [4.0948e7, 4.1499e7] about 4.1089e7 -- half-band +/-0.67%. The
 * single most influential rung is in both cases the lowest, N=250 (its removal raises F by
 * +0.51% and M by +1.00%: a high-leverage low-N anchor), while every interior rung shifts
 * the ceiling by <0.35%. The ~four-decade log-fit extrapolation is therefore stable at the
 * sub-percent level to which accessible rungs enter it.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the leave-one-decade-out band is wider but still <5%.
 * -------------------------------------------------------------------------------
 * Dropping an entire decade is far more destructive (it removes up to nine of eleven rungs).
 * Frobenius: dropping 10^2 (the 2 lowest rungs) shifts F +1.00% to 3.8012e7; dropping 10^3
 * (leaving only the 2 lowest rungs) shifts F -3.07% to 3.6483e7. Measured: dropping 10^2
 * shifts M +1.96% to 4.1896e7; dropping 10^3 shifts M -4.64% to 3.9184e7. Even at this
 * coarsest resampling the two ceilings stay in their ~3.7e7 / ~4.0e7 bands; the ~4.6% swing
 * for M reflects that its fit rests on only eight rungs over ~1.4 decades, so it carries the
 * larger extrapolation uncertainty of the two -- consistent with M sitting on the shorter
 * ladder.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the strict ordering T < F < M is ROBUST to every refit.
 * -------------------------------------------------------------------------------
 * Across all LOO refits: T = 2.594e7 < min(F) = 3.759e7 and max(F) = 3.783e7 < min(M) =
 * 4.095e7, so T < F < M holds with wide margins for every single-rung-drop fit. It also
 * survives the coarser decade-out resampling: the widest Frobenius band [3.648e7, 3.801e7]
 * stays strictly below the widest measured band [3.918e7, 4.190e7] (max F 3.801e7 <
 * min M 3.918e7), and both stay strictly above T = 2.594e7. No refit inverts any pair. The
 * imp-96693 ordering is not an artifact of the particular fit windows.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The two FIT conditioning ceilings carry small extrapolation uncertainty: under leave-one-
 * rung-out jackknife F moves +/-0.32% and M moves +/-0.67%; under the coarser leave-one-
 * decade-out resampling F stays within +1.00%/-3.07% and M within +1.96%/-4.64%. The
 * strict T(2.594e7,rigorous) < F(3.764e7,fit) < M(4.109e7,fit) ordering is robust to every
 * refit, with the lowest rung N=250 the single most influential point. This quantifies the
 * inherited imp-96693 fit-extrapolation sub-gap without removing it -- the fits remain non-
 * rigorous extrapolations, only now with a measured uncertainty band. Accuracy audit only;
 * no bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (inherited, unchanged): the LOO/decade band measures SENSITIVITY of the
 * fit to its own rungs, not the model error of the a + b log N form itself. A rigorous
 * asymptotic for ||G||_F^2 (Frobenius) or the measured lam_max would be needed to make F/M
 * rigorous; this audit does not supply one. Compute-binds-first (imp-96352 ~9916) is
 * unaffected -- all bands sit >1500x above the wall-clock ceiling.
 *
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (the three-ceiling ladder audited)
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (Frobenius eleven-rung ladder + fit)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured lam_max eight-rung ladder + fit)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min power law)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916)
 *
 * Ticket: imp-96791 (accuracy, opus-4-8, api-pool). Audit only; NO QED.
 */

// double-precision machine epsilon; conditioning breakdown scale cond# = 1/eps.
const IMP96791_EPS = 2.220446049250313e-16;
// imp-96428 lam_min power law (shared non-rigorous input, held fixed across all refits).
const IMP96791_LAMMIN = Object.freeze({ A: 0.8186721, p: 1.917927 });
// imp-96548 trace law lam_max_trace(N) = I11 (log N + gamma) (no fit, so no LOO on T).
const IMP96791_I11 = 1.2606614015078126;
const IMP96791_GAMMA = 0.5772156649015329;

// Frobenius majorant eleven-rung ladder (imp-96684): [N, ||G||_F].
const IMP96791_FROB_RUNGS = Object.freeze([
  [250, 5.156452701268937], [500, 5.529997674354878], [1000, 5.8818954543089985],
  [2000, 6.214997339611781], [3000, 6.402120438801899], [4000, 6.5317250252564945],
  [5000, 6.63054847658566], [6000, 6.710233218835323], [7000, 6.776886864553974],
  [8000, 6.834107225532644], [9000, 6.884189704438562],
]);
// Measured lam_max eight-rung ladder (imp-96443): [N, lam_max].
const IMP96791_MEAS_RUNGS = Object.freeze([
  [250, 4.930210017770543], [500, 5.228866173055301], [1000, 5.495523758931842],
  [2000, 5.733924618097868], [3000, 5.861648882285381], [4000, 5.94745308383515],
  [5000, 6.01140643903531], [6000, 6.062043896086687],
]);

// OLS fit y ~ a + b log N over the given [N, y] rungs.
function olsLog(rows) {
  const n = rows.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const [N, y] of rows) {
    const x = Math.log(N);
    sx += x; sy += y; sxx += x * x; sxy += x * y;
  }
  const b = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a = (sy - b * sx) / n;
  return { a, b };
}
// Re-solve cond#(N)=lam_max(N)/lam_min(N)=1/eps by bisection (matches imp-96684).
function solveCeiling(lamMaxOf) {
  const { A, p } = IMP96791_LAMMIN;
  let lo = 1e3, hi = 1e12;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    const cond = lamMaxOf(N) / (A * Math.pow(N, -p));
    if (cond > 1 / IMP96791_EPS) hi = N; else lo = N;
  }
  return Math.sqrt(lo * hi);
}
const ceilingOfFit = (rows) => {
  const f = olsLog(rows);
  return solveCeiling((N) => f.a + f.b * Math.log(N));
};

// Rigorous trace ceiling T (no fit -- recomputed for the ordering check).
const IMP96791_TRACE_CEILING = solveCeiling((N) => IMP96791_I11 * (Math.log(N) + IMP96791_GAMMA));

// Leave-one-rung-out jackknife: drop each rung, refit, re-solve; report the spread.
function looBand(rows) {
  const full = ceilingOfFit(rows);
  const drops = rows.map((_, i) => ({
    leftOutN: rows[i][0],
    ceiling: ceilingOfFit(rows.filter((_, j) => j !== i)),
  }));
  const cs = drops.map((d) => d.ceiling);
  const min = Math.min(...cs);
  const max = Math.max(...cs);
  // most influential rung = largest absolute relative shift from the full fit.
  const mostInfluential = drops.reduce(
    (best, d) => (Math.abs(d.ceiling - full) > Math.abs(best.ceiling - full) ? d : best),
    drops[0],
  );
  return Object.freeze({
    full,
    min,
    max,
    halfBandPct: ((max - min) / 2) / full,
    mostInfluentialRungN: mostInfluential.leftOutN,
    mostInfluentialShiftPct: (mostInfluential.ceiling - full) / full,
    drops: Object.freeze(drops.map((d) => Object.freeze({ ...d, relShift: (d.ceiling - full) / full }))),
  });
}
// Leave-one-decade-out: drop every rung with the same floor(log10 N), refit, re-solve.
function decadeBand(rows) {
  const full = ceilingOfFit(rows);
  const decades = [...new Set(rows.map((r) => Math.floor(Math.log10(r[0]))))];
  const drops = decades
    .map((d) => {
      const sub = rows.filter((r) => Math.floor(Math.log10(r[0])) !== d);
      return { decade: d, remaining: sub.length, ceiling: sub.length >= 2 ? ceilingOfFit(sub) : null };
    })
    .filter((x) => x.ceiling !== null);
  const cs = drops.map((d) => d.ceiling);
  return Object.freeze({
    full,
    min: Math.min(...cs),
    max: Math.max(...cs),
    drops: Object.freeze(drops.map((d) => Object.freeze({ ...d, relShift: (d.ceiling - full) / full }))),
  });
}

export const IMP96791_FROB_LOO = looBand(IMP96791_FROB_RUNGS);
export const IMP96791_MEAS_LOO = looBand(IMP96791_MEAS_RUNGS);
export const IMP96791_FROB_DECADE = decadeBand(IMP96791_FROB_RUNGS);
export const IMP96791_MEAS_DECADE = decadeBand(IMP96791_MEAS_RUNGS);

// Ordering robustness: T < F < M across every refit (both schemes).
export const IMP96791_ORDERING = Object.freeze({
  T: IMP96791_TRACE_CEILING, // ~2.594e7 (rigorous, no fit)
  fLooRange: Object.freeze([IMP96791_FROB_LOO.min, IMP96791_FROB_LOO.max]),
  mLooRange: Object.freeze([IMP96791_MEAS_LOO.min, IMP96791_MEAS_LOO.max]),
  fDecadeRange: Object.freeze([IMP96791_FROB_DECADE.min, IMP96791_FROB_DECADE.max]),
  mDecadeRange: Object.freeze([IMP96791_MEAS_DECADE.min, IMP96791_MEAS_DECADE.max]),
  // strict T < F < M under both the LOO and the coarser decade resampling.
  looOrderingHolds:
    IMP96791_TRACE_CEILING < IMP96791_FROB_LOO.min && IMP96791_FROB_LOO.max < IMP96791_MEAS_LOO.min,
  decadeOrderingHolds:
    IMP96791_TRACE_CEILING < IMP96791_FROB_DECADE.min &&
    IMP96791_FROB_DECADE.max < IMP96791_MEAS_DECADE.min,
});

export const IMP96791_VERDICT = Object.freeze({
  question:
    'how much do the two FIT Route M conditioning ceilings (Frobenius F ~3.764e7, measured ' +
    'M ~4.109e7) move under leave-one-out and leave-one-decade-out refitting of their ' +
    'underlying imp-96684 / imp-96443 rungs, and is the T < F < M ordering robust?',
  frobLooHalfBandPct: IMP96791_FROB_LOO.halfBandPct, // ~0.0032 (+/-0.32%)
  measLooHalfBandPct: IMP96791_MEAS_LOO.halfBandPct, // ~0.0067 (+/-0.67%)
  frobMostInfluentialRungN: IMP96791_FROB_LOO.mostInfluentialRungN, // 250
  measMostInfluentialRungN: IMP96791_MEAS_LOO.mostInfluentialRungN, // 250
  orderingRobust: IMP96791_ORDERING.looOrderingHolds && IMP96791_ORDERING.decadeOrderingHolds,
  anyBoundMoved: false,
  conclusion:
    'AUDIT CONFIRMED. Leave-one-rung-out jackknife moves the Frobenius ceiling F within ' +
    '[3.759e7, 3.783e7] (+/-0.32%) and the measured ceiling M within [4.095e7, 4.150e7] ' +
    '(+/-0.67%), the lowest rung N=250 being the single most influential point for both. ' +
    'Leave-one-decade-out is wider but still <5% (F +1.00%/-3.07%, M +1.96%/-4.64%). The ' +
    'strict ordering T(2.594e7,rigorous) < F(3.764e7,fit) < M(4.109e7,fit) survives every ' +
    'refit under both schemes with wide margins, so it is not an artifact of the fit ' +
    'windows. The inherited imp-96693 fit-extrapolation sub-gap is now quantified, not ' +
    'removed: the a + b log N fits remain non-rigorous extrapolations. Accuracy audit only; ' +
    'no bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96791_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Accuracy audit only: every ceiling is a ' +
  're-solve of the SAME imp-96684 cond#=1/eps bisection on a refit of existing rungs; no new ' +
  'solves. The LOO/decade bands measure the fit sensitivity to its own rungs, NOT the model ' +
  'error of the log-fit form -- only the trace ceiling T=2.594e7 is a rigorous lower bound; ' +
  'F and M stay non-rigorous four-decade extrapolations. No bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96791_ASSERTIONS = [
  {
    id: 'imp96791-loo-bands-tight-frobenius-under-half-pct',
    holds: () =>
      IMP96791_FROB_LOO.halfBandPct > 0 && IMP96791_FROB_LOO.halfBandPct < 0.005 &&
      IMP96791_FROB_LOO.min > 3.75e7 && IMP96791_FROB_LOO.max < 3.79e7 &&
      IMP96791_FROB_LOO.mostInfluentialRungN === 250,
    why: 'leave-one-out jackknife moves the Frobenius ceiling within a +/-0.32% band [3.759e7, 3.783e7], the lowest rung N=250 being the single most influential point.',
  },
  {
    id: 'imp96791-loo-bands-measured-wider-still-under-one-pct',
    holds: () =>
      IMP96791_MEAS_LOO.halfBandPct > IMP96791_FROB_LOO.halfBandPct &&
      IMP96791_MEAS_LOO.halfBandPct < 0.01 &&
      IMP96791_MEAS_LOO.min > 4.08e7 && IMP96791_MEAS_LOO.max < 4.16e7 &&
      IMP96791_MEAS_LOO.mostInfluentialRungN === 250,
    why: 'the measured ceiling carries the larger jackknife band (+/-0.67% vs +/-0.32%) -- it sits on the shorter eight-rung ladder -- but still under 1%, again with N=250 most influential.',
  },
  {
    id: 'imp96791-decade-out-bands-wider-but-under-five-pct',
    holds: () =>
      IMP96791_FROB_DECADE.min > 3.6e7 && IMP96791_FROB_DECADE.max < 3.85e7 &&
      IMP96791_MEAS_DECADE.min > 3.9e7 && IMP96791_MEAS_DECADE.max < 4.25e7 &&
      (IMP96791_MEAS_DECADE.max - IMP96791_MEAS_DECADE.min) / IMP96791_MEAS_DECADE.full < 0.08,
    why: 'leave-one-decade-out is more destructive (drops up to 9 of 11 rungs) but the ceilings stay in their bands: F within +1.00%/-3.07%, M within +1.96%/-4.64%, total measured swing <8%.',
  },
  {
    id: 'imp96791-ordering-T-lt-F-lt-M-robust-both-schemes',
    holds: () =>
      IMP96791_ORDERING.looOrderingHolds === true &&
      IMP96791_ORDERING.decadeOrderingHolds === true &&
      IMP96791_ORDERING.T > 2.5e7 && IMP96791_ORDERING.T < 2.7e7 &&
      IMP96791_VERDICT.orderingRobust === true,
    why: 'the strict T(2.594e7) < F < M ordering survives every leave-one-out AND leave-one-decade-out refit: T < min(F), max(F) < min(M) under both schemes with wide margins.',
  },
  {
    id: 'imp96791-honesty-gate-no-qed',
    holds: () =>
      IMP96791_VERDICT.anyBoundMoved === false &&
      IMP96791_VERDICT.orderingRobust === true &&
      /NO QED/.test(IMP96791_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96791_HONEST_BANNER) &&
      /RH open/.test(IMP96791_HONEST_BANNER) &&
      /model error/.test(IMP96791_HONEST_BANNER),
    why: 'audit only: no bound moved, the ordering-robust flag is set, and the honesty markers plus the model-error caveat (LOO measures fit sensitivity, not log-fit model error) are present.',
  },
];

for (const a of IMP96791_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96791-route-m-conditioning-ceiling-loo-refit assertion failed: ${a.id}`,
    );
  }
}

export default {
  frobLoo: IMP96791_FROB_LOO,
  measLoo: IMP96791_MEAS_LOO,
  frobDecade: IMP96791_FROB_DECADE,
  measDecade: IMP96791_MEAS_DECADE,
  ordering: IMP96791_ORDERING,
  verdict: IMP96791_VERDICT,
  banner: IMP96791_HONEST_BANNER,
};
