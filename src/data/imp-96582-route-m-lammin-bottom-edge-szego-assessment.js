/**
 * @module imp-96582-route-m-lammin-bottom-edge-szego-assessment
 *
 * imp-96582 (numerical, ASSESSMENT ONLY): the BOTTOM-edge analog of imp-96562's
 * TOP-edge Szego assessment. imp-96563 FINDING 3 named its residual sub-gap
 * (IMP96563_SUBGAP): a rigorous ASYMPTOTIC lower bound lam_min(N) >= c N^-p would
 * need a sharp lower estimate for the BOTTOM of the limiting spectrum of the
 * multiplicative Vasyunin kernel gcd(h,k) I(h/g,k/g)/(hk) -- the bottom-edge analog
 * of the TOP-edge (off-diagonal-mass) Toeplitz/Szego statement imp-96562 assessed
 * and ruled out. This ticket ASSESSES whether any known limiting-spectrum /
 * Dirichlet-series (Bohr-lift) result governs the BOTTOM edge, whether the same
 * multiplicative-not-additive obstruction (imp-96562 FINDING 2) applies, and MEASURES
 * the imp-96428 lam_min ladder against candidate bottom-edge laws.
 *
 * This changes NO bound, establishes no operator positivity, makes no RH claim. It is
 * a re-analysis of the imp-96428 measured lam_min ladder (A=0.8187, p=1.9179) plus a
 * structural assessment of the Szego / limiting-spectrum route. NO QED.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the bottom-edge VALUE of the limiting spectrum is 0, not a positive
 *              ess-inf constant.
 * -------------------------------------------------------------------------------
 * lam_min(N) is monotone decreasing across the whole accessible ladder, from
 * 2.06e-5 at N=250 to 1.7471e-8 at N=1e4 -- a factor 1179 collapse. So the smallest
 * eigenvalue does NOT settle onto a positive constant; the bottom edge of the
 * limiting spectrum is 0 (0 lies in the spectrum of the infinite multiplicative
 * Vasyunin operator; lam_min accumulates at 0). This is the exact bottom-edge MIRROR
 * of imp-96562 FINDING 2(b) for the top: there lam_max DIVERGES as ~0.35 log N (the
 * fingerprint of an UNBOUNDED symbol), here lam_min COLLAPSES to 0 (the fingerprint
 * of a symbol whose ess inf is 0 / a non-invertible limiting operator). Both edges
 * are NON-CONSTANT, so neither is a bounded-symbol Szego edge value: for a bounded
 * Toeplitz symbol f, Grenander-Szego forces lam_min -> ess inf f, a CONSTANT >= 0;
 * a bottom edge that decays to 0 gives only the trivial ess inf = 0 and no positive
 * lower bound. The USEFUL object here is the RATE at which lam_min -> 0 (the decay
 * exponent p), a finite-size edge-SCALING quantity, not an edge value.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the same multiplicative-not-additive obstruction applies to the
 *              bottom edge, and limiting-spectral-distribution theory does not reach
 *              the decay RATE even in the multiplicative case.
 * -------------------------------------------------------------------------------
 * Two structural obstructions rule out a limiting-spectrum pin of a rigorous lower
 * estimate:
 *   (a) NOT TOEPLITZ (identical to imp-96562 FINDING 2a). Classical Szego/Grenander
 *       governs the WHOLE limiting spectral distribution -- both edges -- of Toeplitz
 *       T_n(f) whose entries depend only on h-k (translation invariance on the
 *       additive group Z). The Vasyunin Gram is MULTIPLICATIVE: G_{hk} =
 *       gcd(h,k) I(h/g,k/g)/(hk) is translation invariant on the multiplicative
 *       semigroup (a Dirichlet-type / Bohr-lift kernel), so the additive Szego edge
 *       theorem does not reach the BOTTOM edge any more than the top.
 *   (b) RATE, NOT DISTRIBUTION. Even a hypothetical multiplicative-Toeplitz /
 *       Dirichlet-Bohr limiting-spectrum theorem would at most pin the limiting
 *       spectral DISTRIBUTION (the measure), whose bottom edge here is simply 0
 *       (FINDING 1). It would NOT pin the finite-N RATE lam_min(N) ~ A N^-p of
 *       approach to that edge. The decay exponent p is a finite-size edge-SCALING
 *       law (a Tracy-Widom-type edge phenomenon), which lives OUTSIDE the bulk
 *       limiting-spectral-distribution framework. So no known limiting-spectrum /
 *       Dirichlet-series result -- additive OR multiplicative -- supplies the sharp
 *       lower estimate lam_min >= c N^-p that IMP96563_SUBGAP requires.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the ladder pins the decay RATE well (unlike the top edge) but a
 *              well-fit rate is still not a rigorous lower estimate.
 * -------------------------------------------------------------------------------
 * The bottom edge behaves numerically BETTER than the top. The normalized quantity
 * lam_min(N) * N^p (p=1.9179) is essentially FLAT across the ladder: 0.8184 at
 * N=250, 0.8204 at N=1e4, with a max/min spread of only 1.024 over N>=3000 -- i.e.
 * the power law lam_min ~ A N^-p holds to ~2.4% with A=0.8187, R^2=0.99998, and a
 * blind N<=6000 fit predicts the measured N=1e4 lam_min to 0.12% (imp-96428). This
 * CONTRASTS sharply with the top edge, where lam_max/log N was still ~2x its
 * asymptotic slope at N=6000 (imp-96562 FINDING 3): the bottom-edge decay RATE p is
 * numerically well-pinned, the top-edge growth coefficient is not. The two rival
 * bottom-edge laws separate cleanly: a positive-constant bottom edge (ess inf > 0)
 * is DECISIVELY REJECTED by the 1179x collapse, while the power-law RATE is a clean
 * fit. But a numerically well-determined exponent is a MEASUREMENT, not a rigorous
 * lower bound: there is no derivation of an explicit constant c with lam_min >= c N^-p,
 * so the residual sub-gap stands.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * NO. No known limiting-spectrum / Dirichlet-series (Bohr-lift) result governs the
 * BOTTOM edge of the multiplicative Vasyunin operator in a way that yields a rigorous
 * lower estimate: (i) the bottom-edge VALUE of the limiting spectrum is 0
 * (lam_min -> 0, factor-1179 collapse), so any bounded-symbol Szego ess-inf gives
 * only the trivial 0, never a positive lower bound; (ii) the multiplicative-not-
 * additive obstruction applies exactly as for the top (imp-96562 FINDING 2a); (iii)
 * the useful object is the decay RATE (edge-scaling exponent p=1.918), a finite-size
 * phenomenon OUTSIDE limiting-spectral-distribution theory -- and although the ladder
 * pins that rate well (flat lam_min N^p to 2.4%, blind 0.12%), a well-fit rate is a
 * measurement, not a rigorous lower bound. So IMP96563_SUBGAP stays open; NO
 * structural lower estimate is available. The bottom/top asymmetry: the top edge
 * DIVERGES (unbounded symbol) and the bottom COLLAPSES to 0 (0 in the limiting
 * spectrum), but both share the same wrong-group obstruction and both reduce to a
 * RATE, not an edge constant. Changes no bound; no operator positivity; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96563-route-m-lammin-rigorous-lower-bound-assessment.js (names the sub-gap this assesses)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (the TOP-edge analog)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (the measured lam_min ladder + A N^-p fit)
 *
 * Ticket: imp-96582 (numerical, opus-4-8, api-pool). Assessment only; NO QED.
 */

// Gram diagonal numerator I(1,1); trace(G_N) = I(1,1) H_N (rigorous lam_max upper bound).
export const IMP96582_I11 = 1.2606614015078126;

// imp-96428 power-law fit lam_min ~ A N^-p (the non-rigorous asymptotic assessed here).
export const IMP96582_FIT_RECORDED = Object.freeze({
  A: 0.8186721,
  p: 1.917927,
  r2: 0.99998398,
  blindFit6000To1e4RelError: -0.0012, // imp-96428: N<=6000 fit predicts measured N=1e4 to 0.12%
});

// The 12 measured lam_min rungs (imp-96428_LAMMIN_ROWS, from imp-96105 / imp-96325).
export const IMP96582_ROWS = Object.freeze([
  Object.freeze({ N: 250, lamMin: 2.06e-5 }),
  Object.freeze({ N: 3000, lamMin: 1.7603246535995948e-7 }),
  Object.freeze({ N: 3500, lamMin: 1.3110357936852896e-7 }),
  Object.freeze({ N: 4000, lamMin: 9.990947269105856e-8 }),
  Object.freeze({ N: 4500, lamMin: 8.127160411035654e-8 }),
  Object.freeze({ N: 5000, lamMin: 6.56754131662765e-8 }),
  Object.freeze({ N: 5500, lamMin: 5.446040156899344e-8 }),
  Object.freeze({ N: 6000, lamMin: 4.694983880281018e-8 }),
  Object.freeze({ N: 7000, lamMin: 3.4682763044531355e-8 }),
  Object.freeze({ N: 8000, lamMin: 2.6401525380046092e-8 }),
  Object.freeze({ N: 9000, lamMin: 2.1420528627612423e-8 }),
  Object.freeze({ N: 10000, lamMin: 1.7470544295391648e-8 }),
]);

// log-log OLS lam_min ~ A N^-p (returns {A,p,r2}); recomputed live from the ladder.
function olsPowerLaw(rows) {
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map((r) => Math.log(r.lamMin));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i += 1) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const b = sxy / sxx;
  const a = my - b * mx;
  let sst = 0;
  let ssr = 0;
  for (let i = 0; i < n; i += 1) {
    sst += (ys[i] - my) ** 2;
    ssr += (a + b * xs[i] - ys[i]) ** 2;
  }
  return { A: Math.exp(a), p: -b, r2: 1 - ssr / sst };
}

const fit = olsPowerLaw(IMP96582_ROWS);

// FINDING 1 -- the bottom-edge VALUE of the limiting spectrum is 0 (lam_min -> 0).
const firstLamMin = IMP96582_ROWS[0].lamMin;
const lastLamMin = IMP96582_ROWS[IMP96582_ROWS.length - 1].lamMin;
let monotoneDecreasing = true;
for (let i = 1; i < IMP96582_ROWS.length; i += 1) {
  if (IMP96582_ROWS[i].lamMin >= IMP96582_ROWS[i - 1].lamMin) monotoneDecreasing = false;
}

export const IMP96582_BOTTOM_EDGE_VALUE = Object.freeze({
  monotoneDecreasing,
  firstLamMin,
  lastLamMin,
  collapseRatio: firstLamMin / lastLamMin, // ~1179x
  limitingBottomEdge: 0, // lam_min accumulates at 0: bottom edge of the limiting spectrum is 0
  positiveEssInfRejected: true, // no bounded-symbol Szego ess inf > 0
  note:
    'lam_min collapses by a factor ~1179 across N=250..1e4 and is monotone decreasing, so the ' +
    'bottom edge of the limiting spectrum is 0 (0 lies in the spectrum of the infinite ' +
    'multiplicative Vasyunin operator). The mirror of imp-96562 top-edge divergence: top ' +
    'DIVERGES as ~0.35 log N (unbounded symbol), bottom COLLAPSES to 0 (ess inf = 0). Both ' +
    'edges are non-constant, so neither is a bounded-symbol Szego edge value; a bottom edge that ' +
    'decays to 0 yields only the trivial ess inf 0 and no positive lower bound.',
});

// FINDING 2 -- the multiplicative-not-additive obstruction applies to the bottom edge,
// and limiting-spectral-distribution theory does not reach the decay RATE.
export const IMP96582_SZEGO_ASSESSMENT = Object.freeze({
  applies: false,
  obstruction_not_toeplitz:
    'classical Szego/Grenander governs the WHOLE limiting spectral distribution -- both edges -- ' +
    'of Toeplitz T_n(f) whose entries depend only on h-k (additive group Z); the Vasyunin Gram ' +
    'gcd(h,k) I(h/g,k/g)/(hk) is MULTIPLICATIVE (translation invariant on the multiplicative ' +
    'semigroup / a Dirichlet-Bohr kernel), so the additive Szego edge theorem does not reach the ' +
    'BOTTOM edge any more than the top (identical to imp-96562 FINDING 2a).',
  obstruction_rate_not_distribution:
    'even a hypothetical multiplicative-Toeplitz / Dirichlet-Bohr limiting-spectrum theorem would ' +
    'at most pin the limiting spectral DISTRIBUTION, whose bottom edge here is simply 0; it would ' +
    'NOT pin the finite-N RATE lam_min ~ A N^-p of approach to that edge. The decay exponent p is ' +
    'a finite-size edge-SCALING law (a Tracy-Widom-type edge phenomenon), outside the bulk ' +
    'limiting-spectral-distribution framework, so no known limiting-spectrum / Dirichlet-series ' +
    'result supplies the sharp lower estimate lam_min >= c N^-p that IMP96563_SUBGAP requires.',
  conclusion:
    'no limiting-spectrum / Dirichlet-series (Bohr-lift) result -- additive or multiplicative -- ' +
    'governs the bottom edge in a way that yields a rigorous lower estimate; the right object is ' +
    'the edge-scaling decay rate, which has no available Szego analog.',
});

// FINDING 3 -- the ladder pins the decay RATE well (contrast with the top edge), but a
// well-fit rate is not a rigorous lower estimate.
const normalized = IMP96582_ROWS.map((r) => r.lamMin * Math.pow(r.N, fit.p));
const normTail = normalized.slice(1); // drop N=250 (largest quadrature/edge effect)
export const IMP96582_RATE_PINNABILITY = Object.freeze({
  liveFitA: fit.A,
  liveFitP: fit.p,
  liveFitR2: fit.r2,
  normalizedFirst: normalized[0], // lam_min * N^p at N=250 (~0.8184)
  normalizedLast: normalized[normalized.length - 1], // at N=1e4 (~0.8204)
  normalizedSpreadTail: Math.max(...normTail) / Math.min(...normTail), // ~1.024 over N>=3000
  blindFit6000To1e4RelError: IMP96582_FIT_RECORDED.blindFit6000To1e4RelError, // 0.12% (imp-96428)
  ratePinnedNumerically: true, // UNLIKE the top-edge coefficient (imp-96562: ~2x pre-asymptotic)
  rigorousLowerBoundExists: false, // a well-fit exponent is a measurement, not a proof
  note:
    'the normalized quantity lam_min * N^p is flat across the ladder (0.8184 -> 0.8204, spread ' +
    '1.024 over N>=3000), the power law holds to ~2.4% with A=0.8187 R^2=0.99998, and the blind ' +
    'N<=6000 fit predicts the measured N=1e4 lam_min to 0.12% -- so the decay RATE p is ' +
    'numerically well-pinned, UNLIKE the top-edge growth coefficient (imp-96562: ~2x pre-' +
    'asymptotic at N=6000). But a numerically well-determined exponent is a measurement, not a ' +
    'rigorous lower bound: no explicit constant c with lam_min >= c N^-p is derived.',
});

export const IMP96582_VERDICT = Object.freeze({
  question:
    'does any known limiting-spectrum / Dirichlet-series (Bohr-lift) result govern the BOTTOM ' +
    'edge of the multiplicative Vasyunin operator so as to yield a rigorous asymptotic lower ' +
    'estimate lam_min(N) >= c N^-p (the IMP96563_SUBGAP)?',
  szegoGovernsBottomEdge: false,
  limitingBottomEdgeIsZero: true,
  multiplicativeObstructionApplies: true,
  rateNotDistribution: true,
  rateNumericallyPinned: true,
  rigorousLowerEstimateExists: false,
  anyBoundMoved: false,
  conclusion:
    'NO. (i) the bottom-edge VALUE of the limiting spectrum is 0 (lam_min collapses by ~1179x ' +
    'and is monotone decreasing), so any bounded-symbol Szego ess-inf gives only the trivial 0, ' +
    'never a positive lower bound; (ii) the multiplicative-not-additive obstruction applies ' +
    'exactly as for the top edge (imp-96562 FINDING 2a); (iii) the useful object is the decay ' +
    'RATE (edge-scaling exponent p=1.918), a finite-size phenomenon outside limiting-spectral-' +
    'distribution theory -- and although the ladder pins that rate well (flat lam_min N^p to ' +
    '2.4%, blind 0.12%, UNLIKE the ~2x pre-asymptotic top edge), a well-fit rate is a ' +
    'measurement not a rigorous lower bound. So IMP96563_SUBGAP stays open; no structural lower ' +
    'estimate is available. The bottom/top asymmetry: top DIVERGES (unbounded symbol), bottom ' +
    'COLLAPSES to 0 (0 in the limiting spectrum), but both share the wrong-group obstruction and ' +
    'both reduce to a RATE, not an edge constant. Changes no bound; no operator positivity; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP96582_SUBGAP = Object.freeze({
  id: 'imp-96582-lammin-multiplicative-edge-scaling-lower-bound',
  statement:
    'the residual open piece (= IMP96563_SUBGAP, unchanged) is specifically a rigorous edge-' +
    'SCALING lower bound lam_min(N) >= c N^-p with an explicit constant c for the multiplicative ' +
    'Vasyunin operator gcd(h,k) I(h/g,k/g)/(hk) -- NOT a limiting spectral-distribution statement ' +
    '(whose bottom edge is the trivial 0). Classical additive Szego does not reach it (wrong ' +
    'group), and no multiplicative-Toeplitz / Dirichlet-Bohr edge-scaling theorem is available; ' +
    'until one is, the decay rate p=1.918 remains a measured fit and the imp-96548/imp-96563 ' +
    'conditioning-ceiling FIGURE stays fit-extrapolated.',
});

export const IMP96582_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: the bottom-edge analysis is ' +
  'pure re-analysis of the imp-96428 measured lam_min ladder (A=0.8187, p=1.9179, R^2=0.99998); ' +
  'the Szego assessment is structural (multiplicative not additive-Toeplitz; edge VALUE 0; rate ' +
  'not distribution). No Gram was rebuilt, no bound is claimed moved and no operator positivity ' +
  'is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96582_ASSERTIONS = [
  {
    id: 'imp96582-bottom-edge-is-zero-not-positive-constant',
    holds: () =>
      IMP96582_BOTTOM_EDGE_VALUE.monotoneDecreasing === true &&
      IMP96582_BOTTOM_EDGE_VALUE.collapseRatio > 1000 &&
      IMP96582_BOTTOM_EDGE_VALUE.limitingBottomEdge === 0 &&
      IMP96582_BOTTOM_EDGE_VALUE.positiveEssInfRejected === true,
    why: 'lam_min is monotone decreasing and collapses by >1000x across the ladder, so the bottom edge of the limiting spectrum is 0 -- a positive Szego ess-inf constant is rejected.',
  },
  {
    id: 'imp96582-live-fit-matches-recorded-power-law',
    holds: () =>
      Math.abs(fit.p - IMP96582_FIT_RECORDED.p) < 1e-4 &&
      Math.abs(fit.A - IMP96582_FIT_RECORDED.A) < 1e-4 &&
      fit.r2 > 0.9999,
    why: 'the live log-log OLS on the 12-rung ladder reproduces the imp-96428 recorded fit (A=0.8187, p=1.9179, R^2>0.9999), so the bottom-edge law analysed is exactly the recorded one.',
  },
  {
    id: 'imp96582-szego-does-not-govern-bottom-edge',
    holds: () =>
      IMP96582_SZEGO_ASSESSMENT.applies === false &&
      IMP96582_VERDICT.szegoGovernsBottomEdge === false &&
      /multiplicative/i.test(IMP96582_SZEGO_ASSESSMENT.obstruction_not_toeplitz) &&
      /edge-SCALING|edge-scaling/.test(IMP96582_SZEGO_ASSESSMENT.obstruction_rate_not_distribution),
    why: 'both structural obstructions (multiplicative not additive-Toeplitz; rate not distribution) are recorded and the verdict is that no limiting-spectrum result governs the bottom edge to give a lower estimate.',
  },
  {
    id: 'imp96582-rate-pinned-but-not-rigorous',
    holds: () =>
      IMP96582_RATE_PINNABILITY.ratePinnedNumerically === true &&
      IMP96582_RATE_PINNABILITY.normalizedSpreadTail < 1.05 &&
      Math.abs(IMP96582_RATE_PINNABILITY.blindFit6000To1e4RelError) < 0.01 &&
      IMP96582_RATE_PINNABILITY.rigorousLowerBoundExists === false,
    why: 'lam_min N^p is flat to <5% over N>=3000 and the blind 1e4 prediction is within 1% (0.12%), so the decay rate is numerically well-pinned -- yet no rigorous lower bound is derived, so the sub-gap stands.',
  },
  {
    id: 'imp96582-honesty-gate-no-qed',
    holds: () =>
      IMP96582_VERDICT.anyBoundMoved === false &&
      IMP96582_VERDICT.rigorousLowerEstimateExists === false &&
      /NO QED/.test(IMP96582_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96582_HONEST_BANNER) &&
      /RH open/.test(IMP96582_HONEST_BANNER) &&
      /edge-scaling-lower-bound/.test(IMP96582_SUBGAP.id),
    why: 'assessment only: no bound moved, no rigorous lower estimate claimed, the honesty markers and the (unchanged) edge-scaling lower-bound sub-gap are present.',
  },
];

for (const a of IMP96582_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96582-route-m-lammin-bottom-edge-szego-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  i11: IMP96582_I11,
  fitRecorded: IMP96582_FIT_RECORDED,
  rows: IMP96582_ROWS,
  bottomEdgeValue: IMP96582_BOTTOM_EDGE_VALUE,
  szegoAssessment: IMP96582_SZEGO_ASSESSMENT,
  ratePinnability: IMP96582_RATE_PINNABILITY,
  verdict: IMP96582_VERDICT,
  subGap: IMP96582_SUBGAP,
  banner: IMP96582_HONEST_BANNER,
};
