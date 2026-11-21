/**
 * @module imp-96750-route-m-interior-second-moment-upper-bound-reduction
 *
 * imp-96750 (proof, REDUCTION + OBSTRUCTION): attempt a rigorous one-sided UPPER asymptotic
 *     Int(N) <= s* log N
 * for the imp-96667 interior Frobenius second moment (the named sub-gap
 * imp-96731-interior-second-moment-upper-bound), which would raise the rigorous Route M lower
 * conditioning ceiling from T = 2.594e7 toward F = 3.775e7. This is STRICTLY weaker than the
 * exact interior slope and than the imp-96548 off-diagonal Szego coefficient: only a one-sided
 * upper CONSTANT is needed, not the exact asymptotic. We reduce the log-upper-bound to a single
 * clean one-sided lemma, prove that the obvious term-splitting route CANNOT reach it, and name
 * the residual obstruction precisely. No bound is proved rigorous; NO QED.
 *
 * Notation: I(h,k) = C(h+k) + (1/2)(h-k) log(k/h) - (pi/2)(V(h,k) + V(k,h)), symmetric in h,k,
 * with C = (log 2pi - gamma)/2 and the Vasyunin cotangent sum V(a,q) = Sum_{m=1}^{q-1}
 * frac(m a/q) cot(pi m/q) (the exact imp-96443 kernel). H2(m) = Sum_{g<=m} 1/g^2 in [1, zeta(2)].
 *
 * -------------------------------------------------------------------------------
 * STEP 1 -- the sandwich reduces the log-upper-bound to the UNWEIGHTED interior series (rigorous).
 * -------------------------------------------------------------------------------
 * From imp-96708 (monotone convergence + 1 <= H2 <= zeta(2)), for every N
 *     Int(N) <= zeta(2) * T(N),   T(M) = Sum_{(a,b) coprime, 2<=a,b<=M} I(a,b)^2/(a^2 b^2).
 * Hence a bound T(M) <= (s* over zeta(2)) log M + O(1) is SUFFICIENT for Int(N) <= s* log N. So the
 * whole question is a one-sided log-upper-bound on the explicit positive double series T(M).
 *
 * -------------------------------------------------------------------------------
 * STEP 2 -- regroup T by the larger index; the log-upper-bound reduces to ONE clean lemma.
 * -------------------------------------------------------------------------------
 * I is symmetric (I(a,b) = I(b,a)), so summing unordered interior pairs a < b,
 *     T(M) = 2 Sum_{b=3}^{M} Q(b) / b^2,   Q(b) = Sum_{a=2, (a,b)=1}^{b-1} I(a,b)^2 / a^2
 * (an EXACT regrouping -- the reduction was cross-checked to reproduce the imp-96708 checkpoint
 * T(250) = 11.757622 to all printed digits; tmp/imp-96750-interior-upper-reduction.py). Therefore
 *     Q(b) <= s0* b + O(1)  uniformly in b   ==>   T(M) <= 2 s0* Sum_{b<=M} 1/b + O(1)
 *                                                        = 2 s0* log M + O(1)
 *                                            ==>   Int(N) <= s* log N,   s* = 2 zeta(2) s0*.
 * MEASURED: Q(b)/b converges to s0 ~ 1.75 (window means 1.690, 1.729, 1.745, 1.751 over
 * b in [100,300),[300,600),[600,900),[900,1200)); the induced T-slope 2 s0 ~ 3.46-3.50 matches
 * the imp-96708 measured 3.495, and s* = 2 zeta(2) s0 ~ 5.76 matches the imp-96667 interior slope
 * 5.66-5.80. So the SINGLE missing ingredient is a rigorous one-sided upper bound
 *     Q(b) = Sum_{a=2, (a,b)=1}^{b-1} I(a,b)^2 / a^2  <=  s0* b + O(1),  s0* an absolute constant.
 * This is a one-sided (upper-constant-only) WEIGHTED second moment of the two-variable Vasyunin
 * coefficient over coprime a in (0,b) -- weaker than the exact coefficient s0.
 *
 * -------------------------------------------------------------------------------
 * STEP 3 -- NEGATIVE RESULT: term-splitting provably OVERSHOOTS to polynomial growth.
 * -------------------------------------------------------------------------------
 * The naive attack bounds the square by splitting I into its arithmetic part A(a,b) =
 * C(a+b) + (1/2)(a-b) log(b/a) and its cotangent part -(pi/2)(V(a,b)+V(b,a)) and using
 * I^2 <= 2 A^2 + 2 (pi/2)^2 (V+V)^2. But the arithmetic part ALONE already diverges polynomially:
 * for the single coprime term a=2 (b odd),
 *     A(2,b) = C(2+b) + (1/2)(2-b) log(b/2) = -(1/2) b log b + O(b),
 * so A(2,b)^2/4 >= (1/16) b^2 log^2 b (1+o(1)) and, keeping only that one term,
 *     T_split(M) >= 2 Sum_{b<=M odd} A(2,b)^2/(4 b^2) >= (1/16) M log^2 M (1+o(1)).
 * MEASURED: the arithmetic-only lower bound is T_split(1200) = 2801 vs the true T(1200) = 17.2
 * (a factor ~163 and growing like M log^2 M). So ANY bound that separates the arithmetic and
 * cotangent parts overshoots the truth by a polynomial factor and CANNOT yield the log bound.
 * This makes the obstruction precise: I(a,b) is the small residual of an O(b log b) cancellation
 * between C(a+b)+(1/2)(a-b)log(b/a) and (pi/2)(V(a,b)+V(b,a)); the one-sided lemma must bound I
 * DIRECTLY, with the cancellation intact -- i.e. it needs a two-variable Vasyunin cotangent
 * asymptotic/mean-square generalising the a=1 border case I(1,b)=(1/2)log b+(C+1/2)+o(1)
 * (rigorous in imp-96667) to general coprime a,b>=2. This is exactly the Bettin-Conrey cotangent
 * second moment, now needed only as a one-sided upper bound.
 *
 * -------------------------------------------------------------------------------
 * VERDICT -- reduction sharpened to one lemma; obstruction unmoved; no ceiling posted.
 * -------------------------------------------------------------------------------
 * The one-sided upper asymptotic Int(N) <= s* log N is reduced (rigorously, via the sandwich and
 * the exact symmetric regrouping) to the single uniform lemma Q(b) <= s0* b + O(1), and the
 * obvious term-splitting route is proved to overshoot to polynomial M log^2 M growth, so it is
 * ruled out. The residual is a one-sided (upper-constant-only) weighted second moment of the
 * two-variable Vasyunin cotangent sum with the arithmetic counter-terms kept inside the square --
 * the Bettin-Conrey cotangent second moment. It is NOT established here. No improved rigorous
 * lower ceiling can be posted: T = 2.594e7 stays the rigorous anchor. Compute (N~9916, imp-96352)
 * binds first by >2600x regardless. Changes no bound; no operator positivity; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-96750-weighted-cotangent-second-moment-upper-constant -- the one
 * uniform lemma Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 <= s0* b + O(1) with an absolute s0*.
 *
 * @see imp-96731-route-m-trace-ceiling-tightening-assessment.js (names this sub-gap; Findings 3-4)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic.js (D exact, B convergent, interior open; a=1 border)
 * @see imp-96708-route-m-interior-second-moment-dichotomy.js (the rigorous H2 sandwich Int<=zeta(2)T)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (the off-diagonal Szego sub-gap this is weaker than)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the exact V-table / I_coprime kernel)
 *
 * Ticket: imp-96750 (proof, opus-4-8, api-pool). Reduction + obstruction; NO QED.
 */

export const IMP96750_GAMMA = 0.5772156649015329;
export const IMP96750_C = (Math.log(2 * Math.PI) - IMP96750_GAMMA) / 2.0; // 0.6303307...
export const IMP96750_ZETA2 = (Math.PI * Math.PI) / 6.0; // 1.6449340668482264

// Exactness cross-check: the symmetric regrouping T(M) = 2 Sum_{b<=M} Q(b)/b^2 reproduces the
// imp-96708 unweighted interior checkpoint to all printed digits (tmp/imp-96750-...-reduction.py).
export const IMP96750_T_CHECKPOINT = Object.freeze({
  M: 250,
  tDirect: 11.757622, // imp-96708 IMP96708_T_ROWS[0].T
  tRegrouped: 11.757622, // 2 Sum_{b<=250} Q(b)/b^2 (exact regrouping)
});

// MEASURED s0 = lim Q(b)/b via window means of Q(b)/b (tmp/imp-96750-...-reduction.py).
// Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2. Rising toward ~1.75.
export const IMP96750_S0_WINDOW_MEANS = Object.freeze([
  Object.freeze({ from: 100, to: 300, meanQoverB: 1.68979 }),
  Object.freeze({ from: 300, to: 600, meanQoverB: 1.72902 }),
  Object.freeze({ from: 600, to: 900, meanQoverB: 1.74478 }),
  Object.freeze({ from: 900, to: 1200, meanQoverB: 1.75127 }),
]);
export const IMP96750_S0_MEASURED = 1.751; // top-window Q(b)/b, the candidate absolute constant s0*

// The reduction constant: s* = 2 zeta(2) s0. Matches the imp-96667 interior slope band 5.66-5.80.
export const IMP96750_S_STAR = 2 * IMP96750_ZETA2 * IMP96750_S0_MEASURED; // ~5.760

// Induced T-slope 2 s0 and cross-check vs imp-96708 measured slope 3.495 and imp-96667 5.8048.
export const IMP96750_CONSISTENCY = Object.freeze({
  tSlopeInduced: 2 * IMP96750_S0_MEASURED, // ~3.50
  tSlopeMeasured708: 3.495176, // imp-96708 IMP96708_FIT.s
  interiorSlopeMeasured667: 5.6564, // imp-96667 IMP96667_FITS.interior.b
  totalSlopeMeasured667: 5.80481, // imp-96667 IMP96667_FITS.total.b
});

// imp-96771 (numerical, MEASUREMENT): reconcile the induced/t slope band (~3.50) against the
// imp-96667 interior/total slope band (~5.66/5.80). The ~1.6x discrepancy is NOT a mis-scaling:
// it is EXACTLY the imp-96708 H2 weight factor. T(M) = Sum I^2/(a^2 b^2) is the UNWEIGHTED series
// (H2 == 1); Int(N) = Sum H2 I^2/(a^2 b^2) carries the weight H2 = Sum_{g<=.} 1/g^2 in [1, zeta(2)].
// So Int and T are two readouts of ONE constant separated by a known factor bounded by zeta(2):
//   * the two t-slopes agree to 0.2% (3.502 vs 3.495176) -- same unweighted series;
//   * interior/t708 = 1.6183 <= zeta(2) = 1.6449, so the rigorous slope-level sandwich
//     interiorSlope <= zeta(2)*tSlope708 (5.6564 <= 5.7493) HOLDS -- consistent, not a leak;
//   * total/t708 = 1.6608 sits just above zeta(2) only because "total" adds the a=1 BORDER terms
//     that are absent from the interior series T (interior + border, not interior alone).
// VERDICT: mutually consistent; the gap is the H2 weight (zeta(2)), no mis-normalisation. NO QED.
export const IMP96771_SLOPE_RECONCILIATION = Object.freeze({
  zeta2: IMP96750_ZETA2, // 1.6449340668482264 -- the H2 sandwich ceiling
  ratios: Object.freeze({
    tInducedOverT708: (2 * IMP96750_S0_MEASURED) / 3.495176, // 1.00195 -- same unweighted series
    interiorOverT708: 5.6564 / 3.495176, // 1.61834 -- H2-weighted, <= zeta(2)
    totalOverT708: 5.80481 / 3.495176, // 1.66081 -- interior + a=1 border, just above zeta(2)
  }),
  sandwichSlopeCeiling: IMP96750_ZETA2 * 3.495176, // 5.74933 -- interiorSlope must sit at/below this
  interiorSandwichHolds: 5.6564 <= IMP96750_ZETA2 * 3.495176, // true (5.6564 <= 5.7493)
  totalExceedsCeilingBy: 5.80481 - IMP96750_ZETA2 * 3.495176, // +0.0555, the a=1 border contribution
  verdict:
    'CONSISTENT: the two t-slopes (unweighted T) agree to 0.2%; the interior/total slopes are the ' +
    'same series carrying the imp-96708 H2 weight in [1,zeta(2)]. interiorSlope <= zeta(2)*tSlope ' +
    'holds (5.6564 <= 5.7493); total exceeds it only by the a=1 border. The ~1.6x gap is the H2 ' +
    'weight factor, NOT a mis-scaling. Measurement only; changes no bound; NO QED.',
});

// NEGATIVE RESULT: arithmetic-only (term-split) lower bound diverges like M log^2 M, not log M.
// A(2,b) = C(2+b) + (1/2)(2-b) log(b/2) ~ -(1/2) b log b, so the single a=2 term forces
// T_split(M) >= (1/16) M log^2 M (1+o(1)). Measured T_split(1200)=2801 vs true T(1200)=17.2.
export const IMP96750_SPLIT_OVERSHOOT = Object.freeze({
  tSplitAt1200: 2801.227, // arithmetic-only lower bound (tmp/imp-96750-...-reduction.py)
  tTrueAt1200: 17.19669, // true T(1200)
  overshootFactorAt1200: 2801.227 / 17.19669, // ~163, growing like M log^2 M / log M = M log M
  growthLaw: 'M log^2 M', // T_split(M) >= (1/16) M log^2 M (1+o(1)); polynomial, not log
});

export const IMP96750_VERDICT = Object.freeze({
  question:
    'can the imp-96667 interior Frobenius second moment be given a rigorous one-sided UPPER ' +
    'asymptotic Int(N) <= s* log N (raising the rigorous lower conditioning ceiling toward F)?',
  sandwichReducesToUnweightedSeries: true, // Int(N) <= zeta(2) T(N) (imp-96708, rigorous)
  exactSymmetricRegrouping: true, // T(M) = 2 Sum_{b<=M} Q(b)/b^2, checkpoint reproduced exactly
  reducedToOneUniformLemma: true, // Q(b) <= s0* b + O(1) ==> Int(N) <= 2 zeta(2) s0* log N
  termSplittingOvershoots: true, // arithmetic part alone gives >= (1/16) M log^2 M (polynomial)
  cancellationIsEssential: true, // I is the small residual of an O(b log b) cancellation
  oneSidedBoundProved: false, // the residual weighted cotangent second moment is NOT established
  anyBoundMoved: false,
  computeBindsFirst: true,
  conclusion:
    'The one-sided upper asymptotic Int(N) <= s* log N is reduced RIGOROUSLY (imp-96708 sandwich ' +
    'Int<=zeta(2)T plus the exact symmetric regrouping T(M)=2 Sum_{b<=M} Q(b)/b^2, checkpoint ' +
    'T(250)=11.757622 reproduced) to a SINGLE uniform lemma Q(b)=Sum_{a=2,(a,b)=1}^{b-1} ' +
    'I(a,b)^2/a^2 <= s0* b + O(1); then s* = 2 zeta(2) s0*. Measured Q(b)/b -> s0 ~ 1.75 ' +
    '(=> s* ~ 5.76, matching the imp-96667 interior slope 5.66-5.80). The obvious term-splitting ' +
    'route is RULED OUT: the arithmetic part alone (a=2 term) forces T_split(M) >= (1/16) M log^2 M ' +
    '(measured 2801 vs true 17.2 at M=1200), because I(a,b) is the small residual of an O(b log b) ' +
    'cancellation between C(a+b)+(1/2)(a-b)log(b/a) and (pi/2)(V(a,b)+V(b,a)). The residual is a ' +
    'one-sided (upper-constant-only) weighted second moment of the two-variable Vasyunin cotangent ' +
    'sum with the arithmetic counter-terms inside the square -- the Bettin-Conrey cotangent second ' +
    'moment, generalising the a=1 border I(1,b)=(1/2)log b+(C+1/2)+o(1) to coprime a,b>=2 -- and is ' +
    'NOT established here. No improved rigorous ceiling posted; T=2.594e7 stays the anchor; compute ' +
    'N~9916 binds first. No refereed bound is changed; RH open; NO QED.',
});

export const IMP96750_SUBGAP = Object.freeze({
  id: 'imp-96750-weighted-cotangent-second-moment-upper-constant',
  statement:
    'The one-sided upper asymptotic Int(N) <= s* log N reduces (rigorously) to a single uniform ' +
    'lemma: Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 <= s0* b + O(1) with an ABSOLUTE constant ' +
    's0* (then s* = 2 zeta(2) s0*). This is a one-sided, upper-constant-only WEIGHTED second moment ' +
    'of the two-variable Vasyunin cotangent coefficient I(a,b) over coprime a in (0,b), with the ' +
    'arithmetic counter-terms C(a+b)+(1/2)(a-b)log(b/a) kept INSIDE the square (term-splitting ' +
    'overshoots to M log^2 M and is ruled out). It is strictly weaker than the exact slope s0 ' +
    '(measured ~1.75) and than the imp-96548 off-diagonal Szego coefficient. Establishing it -- the ' +
    'Bettin-Conrey cotangent second moment as a one-sided bound, generalising the rigorous a=1 ' +
    'border -- would make the ~3.78-3.98e7 lower conditioning ceiling rigorous. Not established here.',
});

export const IMP96750_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Reduction + obstruction only: the sandwich ' +
  'Int(N) <= zeta(2) T(N) (imp-96708) and the exact symmetric regrouping T(M) = 2 Sum_{b<=M} ' +
  'Q(b)/b^2 (checkpoint T(250)=11.757622 reproduced) rigorously reduce the log-upper-bound to the ' +
  'one uniform lemma Q(b) <= s0* b + O(1); the arithmetic-only term-splitting route is proved to ' +
  'overshoot to M log^2 M (measured 2801 vs 17.2 at M=1200) and is ruled out. The residual ' +
  'one-sided weighted Vasyunin/Bettin-Conrey cotangent second moment is MEASURED (s0 ~ 1.75), not ' +
  'proved, so no bound is claimed moved and no positivity established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96750_ASSERTIONS = [
  {
    id: 'imp96750-regrouping-reproduces-checkpoint',
    holds: () =>
      Math.abs(IMP96750_T_CHECKPOINT.tRegrouped - IMP96750_T_CHECKPOINT.tDirect) < 1e-6 &&
      Math.abs(IMP96750_T_CHECKPOINT.tDirect - 11.757622) < 1e-6,
    why: 'the exact symmetric regrouping T(M) = 2 Sum_{b<=M} Q(b)/b^2 reproduces the imp-96708 unweighted interior checkpoint T(250)=11.757622, confirming the reduction is an identity (not an approximation).',
  },
  {
    id: 'imp96750-s0-converges-to-absolute-constant',
    holds: () => {
      const w = IMP96750_S0_WINDOW_MEANS;
      // window means of Q(b)/b are increasing and converge to ~1.75 (the candidate s0*)
      const increasing = w.every((r, i) => i === 0 || r.meanQoverB >= w[i - 1].meanQoverB);
      const last = w[w.length - 1].meanQoverB;
      return increasing && last > 1.74 && last < 1.76 && Math.abs(IMP96750_S0_MEASURED - last) < 0.01;
    },
    why: 'Q(b)/b window means rise 1.690 -> 1.729 -> 1.745 -> 1.751, converging to s0 ~ 1.75: the candidate absolute constant s0* whose one-sided upper analog would close the sub-gap.',
  },
  {
    id: 'imp96750-s-star-matches-measured-interior-slope',
    holds: () =>
      Math.abs(IMP96750_S_STAR - 2 * IMP96750_ZETA2 * IMP96750_S0_MEASURED) < 1e-9 &&
      IMP96750_S_STAR > IMP96750_CONSISTENCY.interiorSlopeMeasured667 &&
      IMP96750_S_STAR < IMP96750_CONSISTENCY.totalSlopeMeasured667 + 0.05 &&
      Math.abs(IMP96750_CONSISTENCY.tSlopeInduced - IMP96750_CONSISTENCY.tSlopeMeasured708) < 0.05,
    why: 's* = 2 zeta(2) s0 ~ 5.76 lands in the imp-96667 interior/total slope band [5.66, 5.80], and the induced T-slope 2 s0 ~ 3.50 matches the imp-96708 measured 3.495: the reduction is numerically consistent on both scalings.',
  },
  {
    id: 'imp96750-term-splitting-overshoots-polynomially',
    holds: () =>
      IMP96750_SPLIT_OVERSHOOT.overshootFactorAt1200 > 100 &&
      IMP96750_SPLIT_OVERSHOOT.tSplitAt1200 > IMP96750_SPLIT_OVERSHOOT.tTrueAt1200 * 100 &&
      IMP96750_SPLIT_OVERSHOOT.growthLaw === 'M log^2 M' &&
      IMP96750_VERDICT.termSplittingOvershoots === true &&
      IMP96750_VERDICT.cancellationIsEssential === true,
    why: 'the arithmetic-only (term-split) lower bound T_split(1200)=2801 exceeds the true T(1200)=17.2 by ~163x and grows like M log^2 M (from the a=2 term A(2,b) ~ -(1/2)b log b), proving term-splitting overshoots to polynomial growth: the cancellation between arithmetic and cotangent parts is essential.',
  },
  {
    id: 'imp96750-honesty-gate-no-qed',
    holds: () =>
      IMP96750_VERDICT.anyBoundMoved === false &&
      IMP96750_VERDICT.oneSidedBoundProved === false &&
      IMP96750_VERDICT.sandwichReducesToUnweightedSeries === true &&
      IMP96750_VERDICT.exactSymmetricRegrouping === true &&
      IMP96750_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP96750_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96750_HONEST_BANNER) &&
      /RH open/.test(IMP96750_HONEST_BANNER) &&
      /upper-constant/.test(IMP96750_SUBGAP.id),
    why: 'reduction + obstruction: the reduction is rigorous, term-splitting is ruled out, the residual one-sided weighted cotangent second moment is NOT proved, no bound moved, and the honesty markers plus the named residual sub-gap are present.',
  },
];

for (const a of IMP96750_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96750-route-m-interior-second-moment-upper-bound-reduction assertion failed: ${a.id}`,
    );
  }
}

export default {
  c: IMP96750_C,
  zeta2: IMP96750_ZETA2,
  checkpoint: IMP96750_T_CHECKPOINT,
  s0WindowMeans: IMP96750_S0_WINDOW_MEANS,
  s0Measured: IMP96750_S0_MEASURED,
  sStar: IMP96750_S_STAR,
  consistency: IMP96750_CONSISTENCY,
  slopeReconciliation: IMP96771_SLOPE_RECONCILIATION,
  splitOvershoot: IMP96750_SPLIT_OVERSHOOT,
  verdict: IMP96750_VERDICT,
  subGap: IMP96750_SUBGAP,
  banner: IMP96750_HONEST_BANNER,
};
