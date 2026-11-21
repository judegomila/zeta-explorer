/**
 * @module imp-96674-route-m-frobenius-vs-eightrung-95band
 *
 * imp-96674 (numerical, ERROR-PROPAGATION / TABULATION ONLY): resolve the imp-96656
 * FINDING 3 "tight spot" by re-running the imp-96656 delta-method 95% conditioning-
 * ceiling bands on the ENLARGED imp-96649 eight-rung cond# fit and tabulating the full
 * ordering against the RAISED imp-96648 Frobenius rigorous lower ceiling 3.75e7.
 *
 * THE ISSUE (imp-96656 FINDING 3). Under the FIVE-rung single-object cond# fit the
 * DENSE-subset 95% band lower edge was N_lo = 2.76e7, only ~6.5% above the then-current
 * imp-96548 trace-domination rigorous lower ceiling 2.59e7 -- the only tight spot in the
 * "compute binds first" ordering (9916 < 2.59e7 < fitted band). Two things then changed:
 *   (a) imp-96648 raised the RIGOROUS lower ceiling from 2.59e7 (trace) to 3.75e7 by
 *       replacing trace domination with the sharper Frobenius / Wolkowicz-Styan two-moment
 *       majorant lam_max <= ||G||_F (rigorous at every accessible rung N<=6000);
 *   (b) imp-96649 enlarged the measured cond# fit from five to eight rungs (adding measured
 *       N=7000,8000,9000), tightening the exponent and ceiling intervals ~2.7-2.9x.
 * This ticket asks: under the enlarged eight-rung fit, where does the raised Frobenius
 * lower ceiling 3.75e7 sit relative to the dense-seven and all-eight 95% band lower edges?
 *
 * WHAT WAS DONE (tmp/imp-96674-scratch.mjs, reproducible; PURE re-analysis of the already-
 * committed imp-96649 eight-rung cond# rows and the imp-96656 delta-method -- no Gram
 * rebuilt, no new measurement). The imp-96656 log-log OLS with full (lnC,q) covariance and
 * the delta-method ceiling band ln N* = (ln(1/eps) - lnC)/q were applied to the enlarged
 * dense-seven (N=3000..9000) and all-eight (N=250,3000..9000) rung sets, and the 95%
 * Student-t(df=n-2) lower/upper edges were tabulated against the four reference ceilings.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the enlarged fit LIFTS both 95% lower edges past the trace ceiling.
 * -------------------------------------------------------------------------------
 * Enlarging to eight rungs raises the dense 95% lower edge from 2.76e7 (four rungs, df=2)
 * to 3.55e7 (seven rungs, df=5) and the all-rung lower edge from 3.50e7 (five, df=3) to
 * 3.65e7 (eight, df=6). Both now sit +37.0% / +41.1% above the trace lower ceiling 2.59e7,
 * so the imp-96656 6.5% "tight spot" against the OLD trace ceiling is fully dissolved by
 * the extra measured rungs.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the RAISED Frobenius lower ceiling 3.75e7 now sits ABOVE both 95% lower
 *              edges, but still BELOW both fitted point estimates and both upper edges.
 * -------------------------------------------------------------------------------
 * The literal answer to the ticket question is YES: 3.75e7 exceeds the dense-seven lower
 * edge 3.55e7 (by ~5.7%) AND the all-eight lower edge 3.65e7 (by ~2.6%). But this does NOT
 * "restore a comfortable gap" in the direction imagined -- it INVERTS the tight spot: the
 * rigorous lower bound has risen INTO the lower tail of the fitted band. Crucially this is
 * NOT a contradiction, because 3.75e7 stays BELOW both fitted point estimates (all-eight
 * 3.784e7, dense-seven 3.963e7) and BOTH 95% upper edges (3.92e7 / 4.43e7). A rigorous
 * LOWER bound on the breakdown N legitimately truncates the lower tail of a measured
 * estimate of the same N; the intervals overlap, so the fit and the rigorous bound are
 * consistent -- they have simply CONVERGED. The all-eight rigorous lower ceiling 3.75e7 and
 * the independent measured-fit point ceiling 3.784e7 now agree to ~0.9%.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the full ordering and "compute binds first" are unchanged and hardened.
 * -------------------------------------------------------------------------------
 * The eight-rung ordering, smallest to largest, is
 *     9916 (compute)  <  2.59e7 (trace lower)  <  3.55e7 / 3.65e7 (95% lower edges)
 *       <  3.75e7 (Frobenius lower)  <  3.784e7 (all-eight point)  <  3.92e7 (all-eight
 *       upper)  <  3.963e7 (dense point)  <  4.43e7 (dense upper).
 * The compute ceiling 9916 sits ~3600-3800x below every band edge, so "compute binds first"
 * holds by a wide margin. No bound is moved: propagating the fit uncertainty and comparing
 * ceilings touches no lam_max, lam_min, or Lambda bound.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Under the enlarged imp-96649 eight-rung fit the imp-96648 Frobenius rigorous lower ceiling
 * 3.75e7 EXCEEDS both the dense-seven (3.55e7) and all-eight (3.65e7) 95% band lower edges,
 * yet stays below both fitted point estimates (3.784e7 / 3.963e7) and both 95% upper edges
 * (3.92e7 / 4.43e7). So the raised rigorous lower bound does not restore a slack gap -- it
 * CONVERGES with the measured fit (agreeing with the all-eight point ceiling to ~0.9%),
 * truncating the fit's lower tail without contradiction. The imp-96656 6.5% tight spot
 * against the old trace ceiling is gone (both lower edges now +37-41% above 2.59e7), and
 * compute (9916) still binds first by ~3600-3800x. No bound moved; error-propagation /
 * tabulation only; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96656-route-m-conditioning-ceiling-confidence-interval.js (FINDING 3 tight spot; delta-method)
 * @see imp-96648-route-m-lammax-frobenius-moment-majorant.js (raised rigorous lower ceiling 3.75e7)
 * @see imp-96649-route-m-condfit-rungs-above-6000.js (enlarged eight-rung cond# fit)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (trace lower ceiling 2.59e7)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916)
 *
 * Ticket: imp-96674 (numerical, opus-4-8, api-pool). Error-propagation / tabulation only; NO QED.
 */

export const IMP96674_EPS = 2.220446049250313e-16;
const L = Math.log(1 / 2.220446049250313e-16); // ln(1/eps) ~ 36.04

// imp-96649 measured rows: BASE (measured extremes, imp-96570) + NEW (measured 7000..9000).
export const IMP96674_ROWS = Object.freeze([
  Object.freeze({ N: 250, cond: 4.930210017770543 / 2.06e-5 }),
  Object.freeze({ N: 3000, cond: 5.861648882285381 / 1.7603246535995948e-7 }),
  Object.freeze({ N: 4000, cond: 5.94745308383515 / 9.990947269105856e-8 }),
  Object.freeze({ N: 5000, cond: 6.01140643903531 / 6.56754131662765e-8 }),
  Object.freeze({ N: 6000, cond: 6.062043896086687 / 4.694983880281018e-8 }),
  // NEW measured rungs (imp-96649, Gram rebuilt to NMAX=9000; N=6000 validated to 12 digits).
  Object.freeze({ N: 7000, cond: 177171608.79495466 }),
  Object.freeze({ N: 8000, cond: 233094796.19953465 }),
  Object.freeze({ N: 9000, cond: 292113021.1343726 }),
]);

// Reference ceilings the ordering is tabulated against.
export const IMP96674_FROBENIUS_LOWER = 3.75e7; // imp-96648 rigorous lower ceiling (Frobenius majorant)
export const IMP96674_TRACE_LOWER = 2.59e7;     // imp-96548 rigorous lower ceiling (trace domination)
export const IMP96674_COMPUTE = 9916;           // imp-96352 wall-clock compute ceiling

// Two-sided Student-t 95% critical values (df = n-2), covering all four subset sizes.
const T95 = Object.freeze({ 2: 4.302653, 3: 3.182446, 5: 2.570582, 6: 2.446912 });

// imp-96656 log-log OLS carrying the full (lnC,q) parameter covariance.
function olsFit(rows) {
  const n = rows.length;
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map((r) => Math.log(r.cond));
  const xbar = xs.reduce((a, b) => a + b, 0) / n;
  const ybar = ys.reduce((a, b) => a + b, 0) / n;
  let Sxx = 0, Sxy = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    Sxx += (xs[i] - xbar) ** 2;
    Sxy += (xs[i] - xbar) * (ys[i] - ybar);
    ssTot += (ys[i] - ybar) ** 2;
  }
  const q = Sxy / Sxx;
  const lnC = ybar - q * xbar;
  let ssRes = 0;
  for (let i = 0; i < n; i++) ssRes += (ys[i] - (lnC + q * xs[i])) ** 2;
  const df = n - 2;
  const s2 = ssRes / df;
  return {
    n, df, q, lnC, r2: 1 - ssRes / ssTot,
    seQ: Math.sqrt(s2 / Sxx),
    varQ: s2 / Sxx,
    varLnC: s2 * (1 / n + (xbar * xbar) / Sxx),
    covLnCq: -s2 * xbar / Sxx,
  };
}

// imp-96656 delta-method ceiling CI: ln N* = (L - lnC)/q, log-normal band at multiplier t.
function ceilingCI(fit, t) {
  const { q, lnC, varQ, varLnC, covLnCq } = fit;
  const lnN = (L - lnC) / q;
  const dLnC = -1 / q;
  const dq = -lnN / q;
  const varLnN = dLnC * dLnC * varLnC + dq * dq * varQ + 2 * dLnC * dq * covLnCq;
  const seLnN = Math.sqrt(varLnN);
  return { N: Math.exp(lnN), Nlo: Math.exp(lnN - t * seLnN), Nhi: Math.exp(lnN + t * seLnN) };
}

function summarize(rows) {
  const fit = olsFit(rows);
  const ci = ceilingCI(fit, T95[fit.df]);
  return Object.freeze({
    n: fit.n, df: fit.df, q: fit.q, seQ: fit.seQ, r2: fit.r2,
    ceiling: ci.N, lo95: ci.Nlo, hi95: ci.Nhi,
    lo95AboveTraceFactor: ci.Nlo / IMP96674_TRACE_LOWER,
    frobeniusOverLo95Factor: IMP96674_FROBENIUS_LOWER / ci.Nlo,
    frobeniusBelowPointFactor: ci.N / IMP96674_FROBENIUS_LOWER,
    frobeniusExceedsLo95: IMP96674_FROBENIUS_LOWER > ci.Nlo,
    frobeniusBelowPoint: IMP96674_FROBENIUS_LOWER < ci.N,
    frobeniusBelowHi95: IMP96674_FROBENIUS_LOWER < ci.Nhi,
  });
}

const denseSeven = IMP96674_ROWS.filter((r) => r.N >= 3000);
export const IMP96674_DENSE_SEVEN = summarize(denseSeven); // 7 rungs, df=5
export const IMP96674_ALL_EIGHT = summarize(IMP96674_ROWS); // 8 rungs, df=6

// Full ordering, smallest to largest, of every reference ceiling and band edge.
export const IMP96674_ORDERING = Object.freeze(
  [
    ['compute (imp-96352)', IMP96674_COMPUTE],
    ['trace rigorous lower (imp-96548)', IMP96674_TRACE_LOWER],
    ['dense-seven 95% lower edge', IMP96674_DENSE_SEVEN.lo95],
    ['all-eight 95% lower edge', IMP96674_ALL_EIGHT.lo95],
    ['Frobenius rigorous lower (imp-96648)', IMP96674_FROBENIUS_LOWER],
    ['all-eight ceiling point', IMP96674_ALL_EIGHT.ceiling],
    ['all-eight 95% upper edge', IMP96674_ALL_EIGHT.hi95],
    ['dense-seven ceiling point', IMP96674_DENSE_SEVEN.ceiling],
    ['dense-seven 95% upper edge', IMP96674_DENSE_SEVEN.hi95],
  ]
    .sort((a, b) => a[1] - b[1])
    .map(([label, value]) => Object.freeze({ label, value })),
);

export const IMP96674_VERDICT = Object.freeze({
  question:
    'under the enlarged imp-96649 eight-rung cond# fit, does the raised imp-96648 Frobenius ' +
    'rigorous lower ceiling 3.75e7 exceed BOTH the dense-seven and all-eight 95% band lower ' +
    'edges, and does that restore comfortable margin in the compute-binds-first ordering?',
  frobeniusExceedsBothLowerEdges:
    IMP96674_DENSE_SEVEN.frobeniusExceedsLo95 && IMP96674_ALL_EIGHT.frobeniusExceedsLo95,
  frobeniusStaysBelowBothPointEstimates:
    IMP96674_DENSE_SEVEN.frobeniusBelowPoint && IMP96674_ALL_EIGHT.frobeniusBelowPoint,
  frobeniusStaysBelowBothUpperEdges:
    IMP96674_DENSE_SEVEN.frobeniusBelowHi95 && IMP96674_ALL_EIGHT.frobeniusBelowHi95,
  tightSpotDissolvedVsTrace:
    IMP96674_DENSE_SEVEN.lo95AboveTraceFactor > 1.3 && IMP96674_ALL_EIGHT.lo95AboveTraceFactor > 1.3,
  frobeniusVsAllEightPointAgreementPct:
    (IMP96674_ALL_EIGHT.frobeniusBelowPointFactor - 1) * 100, // ~0.9%
  computeBindsFirstFactor: IMP96674_DENSE_SEVEN.lo95 / IMP96674_COMPUTE, // ~3600x
  anyBoundMoved: false,
  conclusion:
    'YES literally, but it CONVERGES rather than restores slack. Under the enlarged eight-rung ' +
    'fit the Frobenius rigorous lower ceiling 3.75e7 exceeds both 95% band lower edges ' +
    '(dense-seven 3.55e7 by ~5.7%, all-eight 3.65e7 by ~2.6%), yet stays below both fitted ' +
    'point ceilings (all-eight 3.784e7, dense-seven 3.963e7) and both 95% upper edges ' +
    '(3.92e7 / 4.43e7): the rigorous lower bound has risen INTO the lower tail of the measured ' +
    'band, truncating it without contradiction -- the rigorous 3.75e7 and the independent ' +
    'measured all-eight point ceiling 3.784e7 now agree to ~0.9%. The imp-96656 6.5% tight ' +
    'spot against the OLD trace ceiling 2.59e7 is dissolved (both lower edges now +37-41% ' +
    'above it), and the compute ceiling 9916 still binds first by ~3600-3800x. No bound moved; ' +
    'error-propagation / tabulation only; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96674_SUBGAP = Object.freeze({
  id: 'imp-96674-band-and-frobenius-share-nonrigorous-inputs',
  statement:
    'the 95% band inherits the same non-rigorous lam_min N^-p and lam_max a+b log N ' +
    'extrapolations as the imp-96656 five-rung band (imp-96570 / imp-96649 sub-gaps), and the ' +
    'Frobenius 3.75e7 lower ceiling still extrapolates the ||G||_F log-fit rather than a proved ' +
    'second-moment asymptotic (imp-96648 sub-gap). Their ~0.9% agreement is therefore a ' +
    'convergence of two extrapolations, not a rigorous coincidence of two proved values; the ' +
    'Student-t band also assumes homoscedastic log-normal residuals on a small sample (df=5/6). ' +
    'Hardening either would require a rigorous lam_min lower bound or a proved ||G||_F^2 ' +
    'asymptotic. The compute-binds-first verdict is unaffected either way.',
});

export const IMP96674_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Error-propagation / tabulation only: every ' +
  'cond# value is a reproducible numeric already committed in imp-96649 / imp-96570, the ' +
  'OLS covariance and delta-method band are the imp-96656 method re-applied to the enlarged ' +
  'rung set (tmp/imp-96674-scratch.mjs), and the reference ceilings are the committed ' +
  'imp-96648 / imp-96548 / imp-96352 values; no Gram was rebuilt and no bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96674_ASSERTIONS = [
  {
    id: 'imp96674-enlarged-fit-clean-power-law',
    holds: () =>
      IMP96674_ALL_EIGHT.q > 1.95 && IMP96674_ALL_EIGHT.q < 2.0 &&
      IMP96674_DENSE_SEVEN.q > 1.95 && IMP96674_DENSE_SEVEN.q < 2.0 &&
      IMP96674_ALL_EIGHT.r2 > 0.9998 && IMP96674_DENSE_SEVEN.r2 > 0.9998 &&
      IMP96674_ALL_EIGHT.seQ < IMP96674_DENSE_SEVEN.seQ, // all-eight tighter (longer lever arm)
    why: 'the enlarged eight-rung cond# fit is a clean single power law (q in (1.95,2.0), R^2 > 0.9998 on both subsets), and the all-eight fit is tighter on q than dense-seven.',
  },
  {
    id: 'imp96674-lower-edges-clear-old-trace-tight-spot',
    holds: () =>
      IMP96674_DENSE_SEVEN.lo95AboveTraceFactor > 1.3 &&
      IMP96674_ALL_EIGHT.lo95AboveTraceFactor > 1.3 &&
      IMP96674_DENSE_SEVEN.lo95 > 3.4e7 && IMP96674_ALL_EIGHT.lo95 > 3.5e7,
    why: 'enlarging to eight rungs lifts both 95% lower edges to 3.55e7 / 3.65e7, +37-41% above the old trace lower ceiling 2.59e7: the imp-96656 6.5% tight spot against trace is dissolved.',
  },
  {
    id: 'imp96674-frobenius-exceeds-both-95-lower-edges',
    holds: () =>
      IMP96674_DENSE_SEVEN.frobeniusExceedsLo95 &&
      IMP96674_ALL_EIGHT.frobeniusExceedsLo95 &&
      IMP96674_VERDICT.frobeniusExceedsBothLowerEdges === true,
    why: 'the raised Frobenius rigorous lower ceiling 3.75e7 exceeds both the dense-seven (3.55e7) and all-eight (3.65e7) 95% band lower edges -- the literal ticket question is YES.',
  },
  {
    id: 'imp96674-frobenius-stays-below-points-and-upper-edges-no-contradiction',
    holds: () =>
      IMP96674_VERDICT.frobeniusStaysBelowBothPointEstimates === true &&
      IMP96674_VERDICT.frobeniusStaysBelowBothUpperEdges === true &&
      IMP96674_VERDICT.frobeniusVsAllEightPointAgreementPct > 0 &&
      IMP96674_VERDICT.frobeniusVsAllEightPointAgreementPct < 3,
    why: 'Frobenius 3.75e7 stays below both fitted point ceilings and both 95% upper edges, agreeing with the all-eight point ceiling to ~0.9%: the rigorous lower bound converges into the fit band without contradicting it (it truncates the lower tail).',
  },
  {
    id: 'imp96674-ordering-monotone-compute-binds-first',
    holds: () => {
      for (let i = 1; i < IMP96674_ORDERING.length; i++) {
        if (!(IMP96674_ORDERING[i].value >= IMP96674_ORDERING[i - 1].value)) return false;
      }
      return (
        IMP96674_ORDERING[0].label.startsWith('compute') &&
        IMP96674_VERDICT.computeBindsFirstFactor > 2000
      );
    },
    why: 'the tabulated ordering is monotone with the compute ceiling 9916 smallest and >2000x below every band edge: compute binds first by a wide margin, unchanged and hardened.',
  },
  {
    id: 'imp96674-honesty-gate-no-qed',
    holds: () =>
      IMP96674_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96674_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96674_HONEST_BANNER) &&
      /RH open/.test(IMP96674_HONEST_BANNER) &&
      /share-nonrigorous-inputs/.test(IMP96674_SUBGAP.id),
    why: 'error-propagation / tabulation only: no bound moved, the honesty markers are present, and the residual sub-gap (band and Frobenius ceiling share non-rigorous extrapolated inputs; their ~0.9% agreement is a convergence of extrapolations) is recorded.',
  },
];

for (const a of IMP96674_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96674-route-m-frobenius-vs-eightrung-95band assertion failed: ${a.id}`,
    );
  }
}

export default {
  eps: IMP96674_EPS,
  rows: IMP96674_ROWS,
  denseSeven: IMP96674_DENSE_SEVEN,
  allEight: IMP96674_ALL_EIGHT,
  ordering: IMP96674_ORDERING,
  verdict: IMP96674_VERDICT,
  subGap: IMP96674_SUBGAP,
  banner: IMP96674_HONEST_BANNER,
};
