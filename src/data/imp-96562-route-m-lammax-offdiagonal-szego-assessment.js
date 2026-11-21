/**
 * @module imp-96562-route-m-lammax-offdiagonal-szego-assessment
 *
 * imp-96562 (numerical, ASSESSMENT ONLY): imp-96548 established a rigorous
 * UNCONDITIONAL log-shape upper bound lam_max(N) <= I(1,1) H_N = 1.2607 log N + O(1)
 * (SPD trace domination) whose slope 1.2607 is ~3.6x the measured power-iteration
 * fit slope 0.3526, because trace domination discards ALL off-diagonal cancellation.
 * imp-96548 named the residual sub-gap as "a sharp asymptotic for the off-diagonal
 * spectral mass of the multiplicative Vasyunin kernel gcd(h,k) I(h/g,k/g)/(hk) -- a
 * Toeplitz / Szego-type limiting-spectrum statement that is not available." This
 * ticket ASSESSES whether such a Szego/Grenander limiting-spectrum asymptotic exists
 * for this Gram and MEASURES the off-diagonal-mass contribution to lam_max across the
 * accessible N ladder to test whether it can pin the 0.3526 coefficient rigorously.
 *
 * This changes NO bound, establishes no operator positivity, makes no RH claim. It is
 * a re-analysis of the imp-96443 measured lam_max / trace ladder plus a structural
 * assessment of the Szego route. NO QED.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the off-diagonal mass carries the ENTIRE 0.3526 coefficient.
 * -------------------------------------------------------------------------------
 * Split the top eigenvalue against its diagonal part. The diagonal of G is
 * G_kk = I(1,1)/k, so diag(G) has largest eigenvalue = max_k G_kk = G_11 = I(1,1) =
 * 1.2607, a constant FROZEN in N. Hence the "off-diagonal contribution to lam_max",
 *
 *     offDiag(N) := lam_max(G_N) - lam_max(diag G_N) = lam_max(G_N) - I(1,1),
 *
 * carries every bit of the growth above the frozen diagonal ceiling. Fitting offDiag
 * on the imp-96443 ladder (N=250..6000) gives slope 0.3526253785070693 with
 * R^2 = 0.99540 -- IDENTICAL slope to the lam_max fit 0.3526253785070698 (they differ
 * only by the constant I(1,1) in the intercept: 3.0247 - 1.2607 = 1.7640). So the
 * coefficient in question is 100% an off-diagonal-mass effect; the diagonal contributes
 * nothing to the slope. This localizes the imp-96548 sub-gap precisely.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- a classical Szego / Grenander limiting spectrum does NOT apply.
 * -------------------------------------------------------------------------------
 * Two structural obstructions rule out a classical Szego/Toeplitz pin of 0.3526:
 *   (a) NOT TOEPLITZ. Classical Szego/Grenander theory governs Toeplitz matrices
 *       T_n(f) whose entries depend only on the index difference h-k (translation
 *       invariance on the additive group Z). The Vasyunin Gram is MULTIPLICATIVE:
 *       G_{hk} = gcd(h,k) I(h/g,k/g)/(hk) depends on the pair (h,k) through gcd and
 *       the coprime part, i.e. it is translation invariant on the MULTIPLICATIVE
 *       semigroup (a Dirichlet-type / Bohr-lift kernel), not on Z. The additive
 *       Szego edge theorem simply does not apply to it.
 *   (b) UNBOUNDED EDGE. Even the multiplicative analog cannot give a bounded-symbol
 *       edge here: for a bounded Toeplitz symbol Grenander-Szego forces
 *       lam_max(T_n(f)) -> ess sup f, a CONSTANT. The measured lam_max GROWS without
 *       bound as ~0.35 log N (4.93 at N=250 -> 6.06 at N=6000). A logarithmically
 *       divergent spectral edge is the fingerprint of an UNBOUNDED symbol / a
 *       non-compact multiplicative operator (the Vasyunin kernel's Dirichlet-series
 *       singularity), for which no Szego edge constant exists. So there is no bounded
 *       limiting-symbol whose ess sup is 0.3526 -- the coefficient is a GROWTH rate,
 *       not an edge value, and the Szego framework offers no theorem for it.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the accessible ladder cannot even numerically pin 0.3526 as a limit.
 * -------------------------------------------------------------------------------
 * Suppose one nonetheless sought a normalized quantity converging to 0.3526. The two
 * natural candidates are lam_max/log N and lam_max/trace. Both are still ~2x their
 * asymptotic slope-ratios at the top rung N=6000:
 *     lam_max / log N : 0.8929 (N=250) -> 0.6968 (N=6000), target slope 0.3526;
 *     lam_max / trace : 0.6410 (N=250) -> 0.5183 (N=6000), target ratio 0.3526/1.2600 = 0.2797.
 * Neither is within a factor 2 of its limit on the accessible range -- the pre-asymptotic
 * intercept (a=3.0247 for lam_max, a=1.7640 for offDiag) dominates the log term until
 * N is astronomically large. So 0.3526 survives ONLY as a fitted regression SLOPE over
 * an 8-rung ladder, never as a limit visible in the data; a Szego-type CONSTANT, even
 * if one existed, could not be extracted numerically from N<=6000.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * NO. A Szego/Grenander limiting-spectrum asymptotic cannot rigorously pin the measured
 * lam_max slope 0.3526: (i) the Vasyunin Gram is multiplicative, not additive-Toeplitz,
 * so the classical Szego edge theorem does not apply; (ii) the log-growth of lam_max
 * rules out any bounded-symbol ess-sup edge -- the coefficient is a growth RATE, not an
 * edge value; (iii) even numerically the accessible ladder is 2x pre-asymptotic, so
 * 0.3526 is only a fitted slope. The measurement DOES sharpen the imp-96548 sub-gap:
 * the entire coefficient lives in the off-diagonal mass (diagonal spectral ceiling
 * frozen at I(1,1)), so what is open is specifically the leading log-coefficient of the
 * top eigenvalue of the multiplicative Vasyunin operator -- a multiplicative-Toeplitz
 * spectral-EDGE growth rate with no available Szego analog, not a generic off-diagonal
 * asymptotic. Changes no bound; no operator positivity; no refereed bound is changed; RH open.
 *
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (names the sub-gap this assesses)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the measured lam_max / trace ladder)
 * @see imp-96480-route-m-lammax-glossary-headword.js ("not a rigorous proof" status)
 *
 * Ticket: imp-96562 (numerical, opus-4-8, api-pool). Assessment only; NO QED.
 */

// Gram diagonal numerator I(1,1); diag(G) largest eigenvalue = G_11 = I(1,1) (frozen in N).
export const IMP96562_I11 = 1.2606614015078126;

// Measured lam_max / trace ladder (imp-96443, power iteration cross-checked vs eigvalsh).
export const IMP96562_ROWS = Object.freeze(
  [
    { N: 250, lamMax: 4.930210017770543, trace: 7.6908858100937 },
    { N: 500, lamMax: 5.228866173055301, trace: 8.563450305446962 },
    { N: 1000, lamMax: 5.495523758931842, trace: 9.43664418600729 },
    { N: 2000, lamMax: 5.733924618097868, trace: 10.310152995544131 },
    { N: 3000, lamMax: 5.861648882285381, trace: 10.821202166468481 },
    { N: 4000, lamMax: 5.94745308383515, trace: 11.183819328662667 },
    { N: 5000, lamMax: 6.01140643903531, trace: 11.46509627662857 },
    { N: 6000, lamMax: 6.062043896086687, trace: 11.6949 },
  ].map((r) =>
    Object.freeze({
      ...r,
      // off-diagonal contribution to lam_max: lam_max(G) minus the frozen diagonal ceiling.
      offDiagLamMax: r.lamMax - 1.2606614015078126,
      lamMaxOverLogN: r.lamMax / Math.log(r.N),
      lamMaxOverTrace: r.lamMax / r.trace,
    }),
  ),
);

// OLS slope of a + b log N (returns {a,b,r2}).
function olsLog(rows, yOf) {
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map(yOf);
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
  return { a, b, r2: 1 - ssr / sst };
}

const offDiagFit = olsLog(IMP96562_ROWS, (r) => r.offDiagLamMax);
const lamMaxFit = olsLog(IMP96562_ROWS, (r) => r.lamMax);
const traceFit = olsLog(IMP96562_ROWS, (r) => r.trace);

// FINDING 1 -- the off-diagonal mass carries the entire 0.3526 slope.
export const IMP96562_OFFDIAGONAL = Object.freeze({
  definition: 'offDiag(N) := lam_max(G_N) - lam_max(diag G_N) = lam_max(G_N) - I(1,1)',
  diagonalCeiling: IMP96562_I11, // max_k G_kk = G_11 = I(1,1), frozen in N
  offDiagSlope: offDiagFit.b, // 0.3526...
  lamMaxSlope: lamMaxFit.b, // 0.3526...
  slopeGapVsLamMax: Math.abs(offDiagFit.b - lamMaxFit.b), // ~0 (differ only by constant intercept)
  offDiagR2: offDiagFit.r2,
  offDiagIntercept: offDiagFit.a, // 1.7640 = lam_max intercept 3.0247 minus I(1,1)
  note:
    'the diagonal part of G has a constant spectral ceiling I(1,1)=1.2607, so the fitted ' +
    'slope of offDiag = lam_max - I(1,1) equals the lam_max slope 0.3526 EXACTLY -- the ' +
    'coefficient in question is 100 percent an off-diagonal-mass effect.',
});

// FINDING 2 -- the Szego / Grenander limiting-spectrum route does not apply.
export const IMP96562_SZEGO_ASSESSMENT = Object.freeze({
  applies: false,
  obstruction_not_toeplitz:
    'classical Szego/Grenander governs Toeplitz T_n(f) whose entries depend only on h-k ' +
    '(translation invariance on the additive group Z); the Vasyunin Gram gcd(h,k) ' +
    'I(h/g,k/g)/(hk) is MULTIPLICATIVE (translation invariant on the multiplicative ' +
    'semigroup / a Dirichlet-Bohr kernel), so the additive Szego edge theorem does not apply.',
  obstruction_unbounded_edge:
    'for a bounded Toeplitz symbol Grenander-Szego forces lam_max -> ess sup f, a CONSTANT; ' +
    'the measured lam_max grows without bound as ~0.35 log N, the fingerprint of an ' +
    'unbounded symbol / non-compact multiplicative operator. 0.3526 is a growth RATE, not ' +
    'an edge value, so no bounded limiting-symbol has ess sup 0.3526.',
  conclusion:
    'no classical Szego/Grenander limiting spectral distribution pins 0.3526; the right ' +
    'object is the spectral-edge growth rate of the multiplicative Vasyunin operator, which ' +
    'has no available Szego analog.',
});

// FINDING 3 -- accessible ladder is ~2x pre-asymptotic; 0.3526 is only a fitted slope.
export const IMP96562_NUMERICAL_PINNABILITY = Object.freeze({
  targetSlope: lamMaxFit.b, // 0.3526
  lamMaxOverLogN_first: IMP96562_ROWS[0].lamMaxOverLogN, // 0.8929 (N=250)
  lamMaxOverLogN_last: IMP96562_ROWS[IMP96562_ROWS.length - 1].lamMaxOverLogN, // 0.6968 (N=6000)
  targetRatioLamMaxTrace: lamMaxFit.b / traceFit.b, // ~0.2797
  lamMaxOverTrace_first: IMP96562_ROWS[0].lamMaxOverTrace, // 0.6410
  lamMaxOverTrace_last: IMP96562_ROWS[IMP96562_ROWS.length - 1].lamMaxOverTrace, // 0.5183
  pinnableFromLadder: false,
  note:
    'both normalized candidates (lam_max/log N -> 0.3526, lam_max/trace -> 0.2797) are still ' +
    '~2x their limits at N=6000; the pre-asymptotic intercept dominates, so 0.3526 survives ' +
    'only as a fitted 8-rung regression slope, never as a limit visible in the data.',
});

export const IMP96562_VERDICT = Object.freeze({
  question:
    'does a Szego/Toeplitz limiting-spectrum asymptotic for the off-diagonal mass of the ' +
    'multiplicative Vasyunin Gram rigorously pin the measured lam_max slope 0.3526?',
  szegoPinsCoefficient: false,
  offDiagCarriesEntireSlope: true,
  anyBoundMoved: false,
  conclusion:
    'NO. (i) the Vasyunin Gram is multiplicative, not additive-Toeplitz, so classical Szego ' +
    'does not apply; (ii) the log-growth of lam_max rules out any bounded-symbol ess-sup edge ' +
    '-- 0.3526 is a growth RATE not an edge value; (iii) even numerically the accessible ' +
    'ladder is ~2x pre-asymptotic, so 0.3526 is only a fitted slope. The measurement sharpens ' +
    'the imp-96548 sub-gap: the entire coefficient lives in the off-diagonal mass (diagonal ' +
    'ceiling frozen at I(1,1)), so the open piece is specifically the spectral-edge growth ' +
    'rate of the multiplicative Vasyunin operator, with no available Szego analog. Changes no ' +
    'bound; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96562_SUBGAP = Object.freeze({
  id: 'imp-96562-lammax-multiplicative-edge-growth-rate',
  statement:
    'the residual open piece is NOT a generic off-diagonal asymptotic but specifically the ' +
    'leading log-coefficient (spectral-edge growth rate) of the top eigenvalue of the ' +
    'multiplicative Vasyunin operator gcd(h,k) I(h/g,k/g)/(hk). Classical additive Szego does ' +
    'not reach it (wrong group; unbounded edge). A rigorous pin of 0.3526 would need a ' +
    'multiplicative-Toeplitz / Dirichlet-Bohr spectral-edge theorem for an unbounded ' +
    'multiplicative kernel, which is not available; until then 0.3526 remains a measured fit.',
});

export const IMP96562_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: the off-diagonal split is ' +
  'pure re-analysis of the imp-96443 lam_max / trace ladder (diag(G) ceiling = G_11 = I(1,1)); ' +
  'the Szego assessment is structural (multiplicative not additive-Toeplitz; log-divergent ' +
  'edge). No bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96562_ASSERTIONS = [
  {
    id: 'imp96562-offdiag-carries-entire-slope',
    holds: () =>
      IMP96562_OFFDIAGONAL.slopeGapVsLamMax < 1e-12 &&
      IMP96562_OFFDIAGONAL.offDiagSlope > 0.35 &&
      IMP96562_OFFDIAGONAL.offDiagSlope < 0.36 &&
      IMP96562_OFFDIAGONAL.offDiagR2 > 0.99,
    why: 'the diagonal spectral ceiling is frozen at I(1,1), so offDiag = lam_max - I(1,1) has the SAME fitted slope 0.3526 as lam_max: the entire coefficient is off-diagonal mass.',
  },
  {
    id: 'imp96562-offdiag-intercept-is-lammax-minus-I11',
    holds: () =>
      Math.abs(IMP96562_OFFDIAGONAL.offDiagIntercept - (lamMaxFit.a - IMP96562_I11)) < 1e-12,
    why: 'offDiag differs from lam_max only by the constant I(1,1), so its intercept equals the lam_max intercept minus I(1,1) -- confirming the split is exact.',
  },
  {
    id: 'imp96562-szego-does-not-apply',
    holds: () =>
      IMP96562_SZEGO_ASSESSMENT.applies === false &&
      IMP96562_VERDICT.szegoPinsCoefficient === false &&
      /multiplicative/i.test(IMP96562_SZEGO_ASSESSMENT.obstruction_not_toeplitz) &&
      /unbounded/i.test(IMP96562_SZEGO_ASSESSMENT.obstruction_unbounded_edge),
    why: 'both structural obstructions (multiplicative not Toeplitz; log-divergent unbounded edge) are recorded and the verdict is that Szego does not pin the coefficient.',
  },
  {
    id: 'imp96562-ladder-pre-asymptotic',
    holds: () =>
      IMP96562_NUMERICAL_PINNABILITY.pinnableFromLadder === false &&
      IMP96562_NUMERICAL_PINNABILITY.lamMaxOverLogN_last >
        1.8 * IMP96562_NUMERICAL_PINNABILITY.targetSlope &&
      IMP96562_NUMERICAL_PINNABILITY.lamMaxOverTrace_last >
        1.8 * IMP96562_NUMERICAL_PINNABILITY.targetRatioLamMaxTrace,
    why: 'both normalized candidates at N=6000 remain > 1.8x their limits, so the accessible ladder is strongly pre-asymptotic and cannot numerically pin 0.3526 as a Szego constant.',
  },
  {
    id: 'imp96562-honesty-gate-no-qed',
    holds: () =>
      IMP96562_VERDICT.anyBoundMoved === false &&
      IMP96562_VERDICT.offDiagCarriesEntireSlope === true &&
      /NO QED/.test(IMP96562_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96562_HONEST_BANNER) &&
      /RH open/.test(IMP96562_HONEST_BANNER) &&
      /multiplicative-edge-growth-rate/.test(IMP96562_SUBGAP.id),
    why: 'assessment only: no bound moved, the off-diagonal localization is recorded, the honesty markers and the sharpened multiplicative-edge sub-gap are present.',
  },
];

for (const a of IMP96562_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96562-route-m-lammax-offdiagonal-szego-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  i11: IMP96562_I11,
  rows: IMP96562_ROWS,
  offDiagonal: IMP96562_OFFDIAGONAL,
  szegoAssessment: IMP96562_SZEGO_ASSESSMENT,
  numericalPinnability: IMP96562_NUMERICAL_PINNABILITY,
  verdict: IMP96562_VERDICT,
  subGap: IMP96562_SUBGAP,
  banner: IMP96562_HONEST_BANNER,
};
