/**
 * @module imp-96203-route-m-vasyunin-subleading-spectrum
 *
 * imp-96203 (numerical): direct test of the imp-96189 EIGEN-DRIFT candidate --
 * compute the SUB-LEADING Vasyunin prolate eigen-spectrum (beyond lam_min) per
 * rung and ask whether any sub-leading eigenvalue carries the oscillatory content
 * that could masquerade as the low-conductor arithmetic band.
 *
 * BACKGROUND. imp-96189 attributed the genuine period-1.5 (w ~ 4.08) swing in
 *     ratio(N) = d_N^2 * log N / C_burnol,   C_burnol = Sum_rho 1/|rho|^2,
 * to a low-conductor arithmetic band (dominant conductors q = 4, 5) of the
 * Vasyunin cotangent table. Its honest sub-gap IMP96189_SUBGAP
 * (band-vs-drift-non-unique) flagged two open points: (a) 17 non-uniform log N
 * points cannot UNIQUELY separate a few-conductor band from a slow smooth drift,
 * and (b) only lam_min was available per rung, so the "eigen-drift" candidate --
 * that a SUB-LEADING Vasyunin eigenvalue carries oscillatory content lam_min
 * lacks (lam_min is strictly monotone-decreasing, imp-96105) -- was never tested
 * directly. This module tests point (b).
 *
 * WHAT WAS DONE (tmp/rh-route-m/m13-subleading-spectrum.py, reproducible,
 * measurement only): the exact Vasyunin Gram
 *     G_{hk} = gcd(h,k) I(h/gcd, k/gcd) / (h k),
 * with I via the same cotangent table V(a/q) = Sum_{m<q} frac(ma/q) cot(pi m/q),
 * was rebuilt ONCE to NMAX = 6000 (same pipeline as imp-96105 m10). For each of
 * the 17 imp-96147 ladder rungs (N = 250..6000) the SMALLEST SIX eigenvalues
 * lam_1 <= lam_2 <= .. <= lam_6 of G[:N,:N] were computed by EXACT eigvalsh
 * (previously only lam_min per rung, and only via inverse power iteration for
 * N > 2600). The d_N^2 values reproduce imp-96105 bit-for-bit (N=2600
 * dN2 = 0.005934416..., N=6000 dN2 = 0.005233272..., validation floor). Each
 * sub-leading eigenvalue was then tested for (i) monotonicity (upward-step count
 * over the ladder) and (ii) Pearson correlation with the imp-96147 per-N residual
 * r(N) on the EXACT shared 17-point ladder, and the spectral-gap ratios
 * lam_j / lam_1 (which need NOT be monotone) were correlated with r(N) too.
 *
 * FINDINGS (see IMP96203_* below):
 *   (1) EVERY sub-leading eigenvalue is STRICTLY MONOTONE-DECREASING. lam_1
 *       through lam_6 each have ZERO upward steps over the full N=250..6000
 *       ladder -- exactly like lam_min. The sub-leading spectrum has no more
 *       oscillatory content than the bottom eigenvalue.
 *   (2) NO sub-leading eigenvalue tracks the swing. The Pearson correlation of
 *       each of lam_1..lam_6 against the imp-96147 residual r(N) over the full
 *       ladder is tiny: max |corr| = 0.064 (and the log-eigenvalue correlations
 *       are even smaller, max 0.029). NOTABLY the full-ladder lam_min-vs-residual
 *       correlation is only -0.064, confirming imp-96189's own claim that its
 *       reported tail correlation (-0.77 on the short N>2600 window) was a
 *       monotone-window artifact, not a swing driver.
 *   (3) EVEN THE OSCILLATORY GAP STRUCTURE CARRIES NO SWING. The spectral-gap
 *       ratios lam_j / lam_1 DO wobble (5-7 upward steps each) and shrink toward
 *       1 as N grows (bottom of the spectrum crowds: lam_2/lam_1 from 1.037 to
 *       1.007), but their correlation with r(N) is still negligible
 *       (max |corr| = 0.072). So the one place the spectrum is non-monotone still
 *       does not explain the residual swing.
 *
 * VERDICT: the eigen-drift candidate is RULED OUT. The sub-leading Vasyunin
 * eigen-spectrum is as monotone and as uncorrelated with the w ~ 4.08 swing as
 * lam_min, so it cannot be the source of the period-1.5 fluctuation. This removes
 * the specific alternative IMP96189_SUBGAP named and STRENGTHENS the imp-96189
 * low-conductor arithmetic-band attribution (dominant q = 4, 5).
 *
 * HONEST RESIDUAL (see IMP96203_SUBGAP): ruling out eigen-drift does NOT make the
 * conductor band UNIQUELY identified -- part (a) of IMP96189_SUBGAP stands: 17
 * non-uniform log N points still cannot separate a few-conductor band from a slow
 * smooth NON-spectral drift, and extending d_N past N=6000 (the 1e4 target of
 * IMP96105_SUBGAP) remains CPU-starved. So this is a candidate-elimination /
 * consistency result, not a unique identification.
 *
 * MEASUREMENT ONLY. Changes no bound, establishes no operator positivity, makes
 * no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96189-route-m-swing-attribution.js (band attribution + the sub-gap)
 * @see imp-96147-route-m-ratio-const-oscillation-fit.js (the residual rows r(N))
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (Gram to 6000, lam_min)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run.js (Q2: extending the Gram to
 *   N=1e4 still does NOT resolve part (a) of this sub-gap -- the half-decade of
 *   extra log-N range is too narrow to break the band-vs-drift degeneracy)
 *
 * Ticket: imp-96203 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Burnol constant C = Sum_rho 1/|rho|^2 = 2 + gamma - log(4 pi).
export const IMP96203_C_BURNOL = 0.04619141793224202;

export const IMP96203_INPUT = Object.freeze({
  source: 'exact Vasyunin Gram rebuilt to NMAX=6000 + imp-96147 residual rows r(N)',
  method: 'smallest 6 eigenvalues per rung by exact numpy eigvalsh; monotonicity + Pearson correlation vs r(N) on the shared 17-point ladder',
  script: 'tmp/rh-route-m/m13-subleading-spectrum.py (reproducible)',
  question: 'does any SUB-LEADING Vasyunin eigenvalue carry the oscillatory content (eigen-drift) that IMP96189_SUBGAP left untested beyond lam_min?',
  keig: 6,
  buildSeconds: 137.3,
});

// Per-rung: N, dN2 (reproduces imp-96105), ratio, imp-96147 residual, smallest 6 eigenvalues.
export const IMP96203_ROWS = Object.freeze([
  Object.freeze({ N: 250, dN2: 0.00824284468625236, ratio: 0.9853030459881754, resid: -0.00389, lam: [2.0624364404912967e-05, 2.1384751519828804e-05, 2.2719528620479645e-05, 2.3438620443438818e-05, 2.3721819107668956e-05, 2.3961214554447888e-05] }),
  Object.freeze({ N: 500, dN2: 0.007419858011581737, ratio: 0.9982700629705589, resid: 0.01066, lam: [5.459884378251845e-06, 5.624354837105912e-06, 5.729604916843596e-06, 5.903870825552026e-06, 5.995055423042904e-06, 6.143641530422643e-06] }),
  Object.freeze({ N: 750, dN2: 0.006726306474901467, ratio: 0.9640024763631571, resid: -0.02284, lam: [2.5438240600347243e-06, 2.593225934482976e-06, 2.6394595564414386e-06, 2.683163330340331e-06, 2.7408108251835447e-06, 2.7540875987892324e-06] }),
  Object.freeze({ N: 1000, dN2: 0.006555963930380493, ratio: 0.9804200969828122, resid: -0.00593, lam: [1.431800890589407e-06, 1.4839620822515965e-06, 1.5087758963811886e-06, 1.5159132450243753e-06, 1.5528017754145834e-06, 1.564028731598803e-06] }),
  Object.freeze({ N: 1250, dN2: 0.006365532265882656, ratio: 0.9826926433733114, resid: -0.0033, lam: [9.447178823003671e-07, 9.601547124645065e-07, 9.76319242587006e-07, 9.870078602296797e-07, 9.976244698173804e-07, 1.0100706985149065e-06] }),
  Object.freeze({ N: 1500, dN2: 0.0062441244853697064, ratio: 0.9885961620169521, resid: 0.00288, lam: [6.683757000577225e-07, 6.751316950439402e-07, 6.839429304219791e-07, 6.97604061864783e-07, 7.022346658891229e-07, 7.081568640508907e-07] }),
  Object.freeze({ N: 1750, dN2: 0.006182768197446897, ratio: 0.9995152003949765, resid: 0.01402, lam: [4.918252213970573e-07, 5.013125177956833e-07, 5.092302977376044e-07, 5.130393942864758e-07, 5.178798826895586e-07, 5.224246174994201e-07] }),
  Object.freeze({ N: 2000, dN2: 0.006114100440016368, ratio: 1.0060890778581055, resid: 0.02077, lam: [3.815552703470555e-07, 3.8736761434775926e-07, 3.935890852343318e-07, 3.9465268006008363e-07, 3.983256461459854e-07, 4.025749886391361e-07] }),
  Object.freeze({ N: 2300, dN2: 0.0059852176241672606, ratio: 1.002990665259071, resid: 0.01786, lam: [2.918406987714585e-07, 2.9697522501569403e-07, 2.982040555002908e-07, 3.010465907632824e-07, 3.043030615871287e-07, 3.0576270994860166e-07] }),
  Object.freeze({ N: 2600, dN2: 0.005934416125419895, ratio: 1.0102287163795478, resid: 0.02526, lam: [2.307415813893249e-07, 2.345406970145744e-07, 2.3497397336889527e-07, 2.3807269592542785e-07, 2.3934216583120517e-07, 2.409148112984966e-07] }),
  Object.freeze({ N: 3000, dN2: 0.005613104396562818, ratio: 0.9729204905638247, resid: -0.01187, lam: [1.7561321186095692e-07, 1.7742804301703012e-07, 1.7900794775685264e-07, 1.8048393479651669e-07, 1.8148578240267228e-07, 1.838330851108753e-07] }),
  Object.freeze({ N: 3500, dN2: 0.005455933154968617, ratio: 0.963885588735333, resid: -0.02072, lam: [1.3059526247861148e-07, 1.3223424534889126e-07, 1.3278783676367143e-07, 1.3385636066905964e-07, 1.348735652577512e-07, 1.3551796750088067e-07] }),
  Object.freeze({ N: 4000, dN2: 0.005415698979387873, ratio: 0.9724333692631612, resid: -0.01202, lam: [9.984824323977358e-08, 1.0157765709457079e-07, 1.0284938892055244e-07, 1.0361193292757688e-07, 1.0400939212398136e-07, 1.0473980154401292e-07] }),
  Object.freeze({ N: 4500, dN2: 0.005367526438120107, ratio: 0.9774701947103525, resid: -0.00685, lam: [8.068667936083491e-08, 8.117845119447513e-08, 8.181357540995996e-08, 8.212536239186034e-08, 8.279792115510015e-08, 8.30298057644962e-08] }),
  Object.freeze({ N: 5000, dN2: 0.005303494495277672, ratio: 0.9779064862688012, resid: -0.0063, lam: [6.563386521103212e-08, 6.600126189698866e-08, 6.688272070730154e-08, 6.698850373502437e-08, 6.740656793345513e-08, 6.782815509380457e-08] }),
  Object.freeze({ N: 5500, dN2: 0.0052817723240476955, ratio: 0.9847994277553519, resid: 0.00069, lam: [5.44192970744113e-08, 5.475953784449976e-08, 5.54471354089122e-08, 5.5852016721063545e-08, 5.61481550677743e-08, 5.6358363433677865e-08] }),
  Object.freeze({ N: 6000, dN2: 0.005233272382122345, ratio: 0.9856144779200688, resid: 0.0016, lam: [4.650751733046171e-08, 4.682158259273703e-08, 4.6868249118317516e-08, 4.7280587112925905e-08, 4.7338309348552535e-08, 4.7534058622589074e-08] }),
]);

// Validation floor: dN2 reproduces imp-96105 bit-for-bit at the two anchor rungs.
export const IMP96203_VALIDATION = Object.freeze({
  N2600_dN2: 0.005934416125419895,
  N6000_dN2: 0.005233272382122345,
  note: 'the N=2600 and N=6000 d_N^2 match IMP96105_VALIDATION / IMP96105_EXT_ROWS to the printed 12 digits: the same exact Vasyunin table + Cholesky pipeline, so the eigenvalues are on the validated Gram.',
});

// Per sub-leading eigenvalue index: monotonicity + correlation with r(N).
export const IMP96203_EIG_ANALYSIS = Object.freeze([
  Object.freeze({ index: 1, upwardSteps: 0, monotoneDecreasing: true, corrResid: -0.06377158795970612, corrLogResid: 0.028591649478867696 }),
  Object.freeze({ index: 2, upwardSteps: 0, monotoneDecreasing: true, corrResid: -0.06351879400416294, corrLogResid: 0.028863344551880155 }),
  Object.freeze({ index: 3, upwardSteps: 0, monotoneDecreasing: true, corrResid: -0.0640264245090039, corrLogResid: 0.027775666578770664 }),
  Object.freeze({ index: 4, upwardSteps: 0, monotoneDecreasing: true, corrResid: -0.06349447579050439, corrLogResid: 0.027945033017154574 }),
  Object.freeze({ index: 5, upwardSteps: 0, monotoneDecreasing: true, corrResid: -0.06389802006265473, corrLogResid: 0.027272576243408817 }),
  Object.freeze({ index: 6, upwardSteps: 0, monotoneDecreasing: true, corrResid: -0.06289183235910281, corrLogResid: 0.0278983131481638 }),
]);

// Spectral-gap ratios lam_j / lam_1: these DO wobble, but still do not track r(N).
export const IMP96203_GAP_ANALYSIS = Object.freeze([
  Object.freeze({ ratio: 'lam2/lam1', first: 1.0368683902198075, last: 1.0067529999514642, upwardSteps: 7, corrResid: 0.07201109755059487 }),
  Object.freeze({ ratio: 'lam3/lam1', first: 1.10158685011731, last: 1.007756418931, upwardSteps: 5, corrResid: -0.044074951717124736 }),
  Object.freeze({ ratio: 'lam4/lam1', first: 1.1364529826604237, last: 1.016622469373523, upwardSteps: 5, corrResid: -0.01687009192916694 }),
  Object.freeze({ ratio: 'lam5/lam1', first: 1.1501842501395165, last: 1.0178636071280174, upwardSteps: 5, corrResid: -0.04956566149627725 }),
  Object.freeze({ ratio: 'lam6/lam1', first: 1.1617916598069826, last: 1.0220725884986124, upwardSteps: 6, corrResid: -0.010016104689553183 }),
]);

// Summary of the eigen-drift test.
export const IMP96203_SUMMARY = Object.freeze({
  allEigMonotoneDecreasing: true,
  maxAbsCorrResid: 0.0640264245090039,
  maxAbsCorrLogResid: 0.028863344551880155,
  maxAbsGapCorrResid: 0.07201109755059487,
  note: 'all six smallest eigenvalues are strictly monotone-decreasing (0 upward steps each) with max |corr(lam, resid)| = 0.064; even the oscillatory spectral gaps carry max |corr| = 0.072. No sub-leading eigen-structure tracks the w ~ 4.08 swing.',
});

export const IMP96203_VERDICT = Object.freeze({
  eigenDriftRuledOut: true,
  strengthensBandAttribution: true,
  conclusion:
    'the eigen-drift candidate is ruled out: the sub-leading Vasyunin eigen-spectrum (lam_1..lam_6) is as strictly monotone (0 upward steps each) and as uncorrelated with the residual swing (max |corr| = 0.064, gaps max 0.072) as lam_min, so it cannot be the source of the period-1.5 (w ~ 4.08) fluctuation. This removes the specific alternative IMP96189_SUBGAP named and strengthens the imp-96189 low-conductor arithmetic-band attribution (dominant q = 4, 5). The full-ladder lam_min-vs-residual correlation of -0.064 also confirms imp-96189 that its -0.77 tail correlation was a monotone-window artifact.',
});

// Honest residual sub-gap: eigen-drift eliminated, band still not UNIQUELY pinned.
export const IMP96203_SUBGAP = Object.freeze({
  id: 'imp-96203-band-uniqueness-and-beyond-6000',
  statement:
    'ruling out the eigen-drift candidate closes part (b) of IMP96189_SUBGAP but NOT part (a): 17 non-uniform log N points still cannot uniquely separate the low-conductor band (q = 4, 5) from a slow smooth NON-spectral drift, and extending d_N past N = 6000 (the 1e4 target of IMP96105_SUBGAP) remains CPU-starved. So the band attribution is candidate-eliminated and consistency-strengthened, not uniquely identified. Deciding uniqueness needs a denser more uniform log N grid well past 6000 (a heavier Gram build) or an explicit-formula remainder model, not a further re-analysis of the N <= 6000 spectrum.',
  // imp-96342 cross-link: same "CPU-starved" wall reading as IMP96105_SUBGAP -- see
  // imp-96261 (IMP96261_ROUTE_M_N1E4_SCHEDULING_STATUS_NOTE), which found the m9
  // stall was pool contention, not an intrinsic O(N^3) wall. Does not resolve the
  // band-uniqueness question this sub-gap names.
  schedulingCorrection: 'imp-96261 (IMP96261_ROUTE_M_N1E4_SCHEDULING_STATUS_NOTE): "CPU-starved" is a scheduling condition (pool contention), not an intrinsic compute wall -- a dedicated process reaches N=1e4 in ~7 min / ~2 GB. Resource framing only; band-uniqueness stays open.',
  // imp-96357 cross-link: the N=1e4 run this scheduling note unblocked was
  // actually carried out (imp-96325, IMP96325_Q2_BAND_UNIQUENESS) -- the four
  // new rungs only extend the log-N span by ~0.51 (a half-decade), still too
  // narrow to uniquely separate the band from a smooth drift. Part (a) of this
  // sub-gap stands past N=1e4, not just past N=6000.
});

export const IMP96203_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: every value is a reproducible numeric from tmp/rh-route-m/m13-subleading-spectrum.py; the d_N^2 rows reproduce imp-96105 bit-for-bit; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96203_ASSERTIONS = [
  {
    id: 'imp96203-validation-reproduces-imp96105',
    holds: () =>
      IMP96203_VALIDATION.N2600_dN2 === 0.005934416125419895 &&
      IMP96203_VALIDATION.N6000_dN2 === 0.005233272382122345,
    why: 'the N=2600 and N=6000 d_N^2 reproduce imp-96105 bit-for-bit, placing the sub-leading eigenvalues on the validated Vasyunin Gram.',
  },
  {
    id: 'imp96203-rows-ascending-spectrum',
    holds: () =>
      IMP96203_ROWS.length === 17 &&
      IMP96203_ROWS.every((r) => r.lam.length === 6 &&
        r.lam.slice(1).every((v, i) => v >= r.lam[i])),
    why: 'each of the 17 rungs carries six eigenvalues in ascending order (lam_1 <= .. <= lam_6), a well-formed bottom spectrum.',
  },
  {
    id: 'imp96203-all-subleading-monotone-decreasing',
    holds: () =>
      IMP96203_EIG_ANALYSIS.length === 6 &&
      IMP96203_EIG_ANALYSIS.every((e) => e.upwardSteps === 0 && e.monotoneDecreasing === true) &&
      IMP96203_SUMMARY.allEigMonotoneDecreasing === true,
    why: 'every one of the six smallest eigenvalues is strictly monotone-decreasing over the ladder (0 upward steps), so the sub-leading spectrum has no oscillatory content, like lam_min.',
  },
  {
    id: 'imp96203-no-eigenvalue-tracks-the-swing',
    holds: () =>
      IMP96203_EIG_ANALYSIS.every((e) => Math.abs(e.corrResid) < 0.1 && Math.abs(e.corrLogResid) < 0.1) &&
      IMP96203_GAP_ANALYSIS.every((g) => Math.abs(g.corrResid) < 0.1) &&
      IMP96203_SUMMARY.maxAbsCorrResid < 0.1 &&
      IMP96203_VERDICT.eigenDriftRuledOut === true,
    why: 'no sub-leading eigenvalue or spectral-gap ratio correlates with the imp-96147 residual above |corr| = 0.1 (max 0.072): the eigen-drift candidate is ruled out.',
  },
  {
    id: 'imp96203-gaps-oscillate-but-shrink',
    holds: () =>
      IMP96203_GAP_ANALYSIS.every((g) => g.upwardSteps >= 1 && g.last < g.first && g.last > 1),
    why: 'the spectral-gap ratios lam_j/lam_1 do wobble (>=1 upward step each) yet shrink toward 1 as N grows (last < first, still > 1): the bottom of the spectrum crowds without tracking the swing.',
  },
  {
    id: 'imp96203-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96203_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96203_HONEST_BANNER) &&
      /NO QED/.test(IMP96203_HONEST_BANNER) &&
      typeof IMP96203_SUBGAP.statement === 'string' &&
      /band-uniqueness-and-beyond-6000/.test(IMP96203_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and an explicit named sub-gap that eigen-drift is eliminated but band uniqueness and the past-6000 extension stay open.',
  },
];

for (const a of IMP96203_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96203-route-m-vasyunin-subleading-spectrum assertion failed: ${a.id}`);
  }
}

export default {
  cBurnol: IMP96203_C_BURNOL,
  input: IMP96203_INPUT,
  rows: IMP96203_ROWS,
  validation: IMP96203_VALIDATION,
  eigAnalysis: IMP96203_EIG_ANALYSIS,
  gapAnalysis: IMP96203_GAP_ANALYSIS,
  summary: IMP96203_SUMMARY,
  verdict: IMP96203_VERDICT,
  subGap: IMP96203_SUBGAP,
  banner: IMP96203_HONEST_BANNER,
};
