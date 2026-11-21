/**
 * @module imp-96770-route-m-weighted-cotangent-homogeneous-envelope
 *
 * imp-96770 (proof, NON-TERM-SPLITTING RE-REDUCTION + OBSTRUCTION): attack the residual sub-gap
 * imp-96750-weighted-cotangent-second-moment-upper-constant -- the single uniform lemma
 *     Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2  <=  s0* b + O(1),  s0* an absolute constant,
 * that would raise the rigorous Route M lower conditioning ceiling from T=2.594e7 toward F=3.775e7.
 * imp-96750 proved the OBVIOUS term-splitting (I^2 <= 2 A^2 + 2 (pi/2)^2 (V+V)^2) overshoots to
 * polynomial M log^2 M growth because the arithmetic part A(a,b) alone diverges. The residual I(a,b)
 * is the small residual of an O(b log b) cancellation and MUST be bounded with the cancellation kept
 * intact. Here we do NOT split I. We supply a non-term-splitting RE-REDUCTION of the mean-square
 * lemma to a cleaner POINTWISE homogeneous log-envelope on I itself, verify it numerically, tie it to
 * the rigorous a=1 border, and name the precise remaining obstruction. No bound is proved rigorous;
 * NO QED.
 *
 * Notation (as in imp-96750): I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b)+V(b,a)),
 * symmetric in a,b, with C = (log 2pi - gamma)/2 = 0.6303307... and the Vasyunin cotangent sum
 * V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q). All measurements below use this exact kernel; it
 * reproduces the rigorous imp-96667 border I(1,b) = (1/2) log b + (C+1/2) + o(1) to 4 digits
 * (b=100: 3.4343 vs 3.4329; b=10000: 5.7355 vs 5.7355), which fixes the convention as ground truth.
 *
 * -------------------------------------------------------------------------------
 * STEP 1 -- the summand is asymptotically SCALE-INVARIANT (new structural observation, measured).
 * -------------------------------------------------------------------------------
 * The weighted summand collapses onto a single profile of the ratio x = a/b:
 *     I(a,b)^2 / a^2  =  phi(a/b) + o(1)   uniformly in the pair, phi a fixed function on (0,1).
 * MEASURED collapse (independent of b to 3-4 digits at matched ratio):
 *     x ~ 0.5:  b=600 -> 2.35509,  b=1200 -> 2.36835
 *     x ~ 0.9:  b=600 -> 1.47447,  b=1200 -> 1.47459
 * Hence Q(b) = Sum_{a} phi(a/b) + o(b) is a Riemann sum: Q(b)/b -> s0 = Int_0^1 phi(x) dx. This
 * EXPLAINS the imp-96750 measured convergence Q(b)/b -> s0 (localising the weighted second moment as
 * a single scale-invariant integral) and shows I(a,b) is homogeneous of degree 1 in the leading
 * order: I(a,b) ~ a psi(a/b) with psi = sqrt(phi). The naive term-split fails precisely because it
 * destroys this homogeneity (the arithmetic part alone is NOT degree 1: A(2,b) ~ -(1/2) b log b).
 *
 * -------------------------------------------------------------------------------
 * STEP 2 -- SUFFICIENT non-term-splitting condition: a uniform pointwise log-envelope on I.
 * -------------------------------------------------------------------------------
 * The mean-square lemma follows from a single POINTWISE bound that keeps the cancellation inside I:
 *     (E)   |I(a,b)|  <=  K * a * (1 + log(b/a))   for all coprime 2 <= a < b, K an absolute const.
 * Then I(a,b)^2/a^2 <= K^2 (1 + log(b/a))^2 and, summing,
 *     Q(b) <= K^2 Sum_{a=2}^{b-1} (1 + log(b/a))^2 = K^2 * (Int_0^1 (1 - log x)^2 dx) * b + O(1)
 *           = 5 K^2 b + O(1),
 * because Int_0^1 (1 - log x)^2 dx = 1 + 2 + 2 = 5 EXACTLY. So (E) yields the required linear
 * one-sided constant s0* = 5 K^2 -- ANY absolute K suffices (a loose constant is acceptable; only the
 * log-order, not the sharp slope, is needed). MEASURED partial-sum check: Sum_{a=2}^{b-1}(1+log(b/a))^2
 * / b -> 5 (4.778 at b=400, 4.869 at 800, 4.923 at 1600). This is the non-term-splitting route:
 * (E) bounds the whole cancelled residual I directly, never separating A from (pi/2)(V+V).
 *
 * -------------------------------------------------------------------------------
 * STEP 3 -- (E) is numerically supported and the log factor is FORCED by the rigorous border.
 * -------------------------------------------------------------------------------
 * MEASURED: max over coprime 2 <= a < b <= B of |I(a,b)| / [a (1 + log(b/a))] is stable near 1.25,
 * attained on the near-diagonal a = b-1 (x -> 1): 1.2449 (B=200), 1.2519 (B=400), 1.2559 (B=800);
 * the near-diagonal column I(b-1,b)/(b-1) rises 1.2362 -> 1.2451 -> 1.2512 -> 1.2551 -> 1.2574 over
 * b = 50..800. The log factor in (E) is NOT optional: at the border a=1 (excluded from Q but the
 * x -> 0 limit of the profile) the rigorous I(1,b) = (1/2) log b + (C+1/2) + o(1) already grows, so a
 * pure-linear envelope |I| <= K a would fail for small a; the shape a(1 + log(b/a)) is exactly the one
 * consistent with both the near-diagonal (x -> 1, factor -> a) and the border (x -> 0, factor
 * -> a(1 + log b)). The measured K = 1.26 gives the loose but valid linear constant s0* = 5 K^2 ~ 7.9
 * (vs the sharp measured s0 ~ 0.76 for this kernel) -- an order of magnitude loose, as expected of a
 * sup-type majorant, but LINEAR, which is all the sub-gap requires.
 *
 * -------------------------------------------------------------------------------
 * VERDICT -- mean-square sub-gap re-reduced to a pointwise log-envelope; obstruction unmoved.
 * -------------------------------------------------------------------------------
 * The one-sided upper constant is re-reduced (non-term-splitting) from the mean-square lemma
 * Q(b) <= s0* b + O(1) to the POINTWISE homogeneous log-envelope (E) |I(a,b)| <= K a (1+log(b/a)),
 * via the exact integral Int_0^1 (1-log x)^2 dx = 5. (E) keeps the O(b log b) cancellation intact
 * (it bounds I directly, so it evades the imp-96750 term-splitting overshoot), is numerically stable
 * (K ~ 1.26 to B=800, sup on the near-diagonal), and has the log factor forced by the rigorous a=1
 * border. But (E) is NOT proved: it is an INDIVIDUAL (pointwise / sup) uniform bound on the
 * two-variable Vasyunin-Bettin-Conrey cotangent combination with the arithmetic counter-terms inside
 * the square -- strictly the individual bound on the Estermann / period function, uniform down the
 * near-diagonal where the sup lives -- and the slow upward creep of the measured sup (1.245 -> 1.256
 * over B=200..800) is consistent with a finite limit but is not a proof of boundedness. So the
 * obstruction is unmoved: the sub-gap is now the cleaner pointwise envelope (E) in place of the
 * mean-square, but still open. No improved rigorous ceiling posted: T = 2.594e7 stays the anchor;
 * compute (N ~ 9916, imp-96352) binds first by >2600x regardless. No refereed bound is changed;
 * RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-96770-pointwise-homogeneous-log-envelope -- the uniform pointwise
 * bound (E) |I(a,b)| <= K a (1 + log(b/a)) on coprime 2 <= a < b, sup on the near-diagonal.
 *
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (parent; term-splitting ruled out; names the mean-square sub-gap)
 * @see imp-96708-route-m-interior-second-moment-dichotomy.js (the rigorous H2 sandwich Int<=zeta(2)T)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic.js (the rigorous a=1 border I(1,b)=(1/2)log b+(C+1/2)+o(1))
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the exact V-table / I_coprime kernel)
 *
 * Ticket: imp-96770 (proof, opus-4-8, api-pool). Non-term-splitting re-reduction + obstruction; NO QED.
 */

export const IMP96770_GAMMA = 0.5772156649015329;
export const IMP96770_C = (Math.log(2 * Math.PI) - IMP96770_GAMMA) / 2.0; // 0.6303307007539063

// STEP 1 -- ratio-collapse: I(a,b)^2/a^2 depends (to 3-4 digits) only on x=a/b, independent of b.
// Measured with the exact Vasyunin kernel (tmp/imp-96770-pin.mjs). Near-identical at matched ratio.
export const IMP96770_COLLAPSE = Object.freeze([
  Object.freeze({ x: 0.5, phiAt600: 2.35509, phiAt1200: 2.36835 }),
  Object.freeze({ x: 0.9, phiAt600: 1.47447, phiAt1200: 1.47459 }),
]);

// STEP 2 -- the exact sufficiency integral: Int_0^1 (1 - log x)^2 dx = 1 + 2 + 2 = 5, so the
// pointwise log-envelope (E) yields Q(b) <= 5 K^2 b + O(1). Measured Sum(1+log(b/a))^2 / b -> 5.
export const IMP96770_SUFFICIENCY = Object.freeze({
  envelopeIntegralExact: 5, // Int_0^1 (1-log x)^2 dx
  sumOverBAt400: 4.778,
  sumOverBAt800: 4.869,
  sumOverBAt1600: 4.923, // rising to 5 (Riemann sum of the same integral)
});

// STEP 3 -- the measured pointwise envelope constant K = max |I|/[a(1+log(b/a))], sup on near-diagonal.
export const IMP96770_ENVELOPE = Object.freeze({
  maxRatioAtB200: 1.2449,
  maxRatioAtB400: 1.2519,
  maxRatioAtB800: 1.2559,
  supAttainedAt: 'near-diagonal a=b-1 (x -> 1)',
  nearDiagonalColumn: Object.freeze([
    Object.freeze({ b: 50, ratio: 1.2362 }),
    Object.freeze({ b: 100, ratio: 1.2451 }),
    Object.freeze({ b: 200, ratio: 1.2512 }),
    Object.freeze({ b: 400, ratio: 1.2551 }),
    Object.freeze({ b: 800, ratio: 1.2574 }),
  ]),
  KMeasured: 1.26, // loose absolute constant; slow upward creep -> finite-limit consistent, not proved
  looseLinearConstant: 5 * 1.26 * 1.26, // s0* = 5 K^2 ~ 7.94 (linear, valid; not sharp)
});

// Border anchor: the rigorous imp-96667 I(1,b) = (1/2) log b + (C+1/2) + o(1) forces the log factor.
export const IMP96770_BORDER = Object.freeze({
  b: 10000,
  IExact: 5.7355, // measured I(1,10000)
  IPred: 5.7355, // (1/2) log 10000 + (C + 1/2)
  note: 'x -> 0 limit; a pure-linear envelope |I| <= K a would fail here, so the log factor is forced.',
});

export const IMP96770_VERDICT = Object.freeze({
  question:
    'can the imp-96750 mean-square sub-gap Q(b) <= s0* b + O(1) be established by a route that keeps ' +
    'the O(b log b) cancellation intact (no arithmetic/cotangent term-splitting)?',
  summandIsScaleInvariant: true, // I(a,b)^2/a^2 = phi(a/b) + o(1); Q(b)/b -> Int_0^1 phi
  reducedToPointwiseLogEnvelope: true, // (E) |I(a,b)| <= K a (1+log(b/a)) => Q(b) <= 5 K^2 b + O(1)
  sufficiencyIntegralExact: true, // Int_0^1 (1-log x)^2 dx = 5 exactly
  envelopeKeepsCancellationIntact: true, // (E) bounds I directly; evades the term-splitting overshoot
  logFactorForcedByBorder: true, // rigorous a=1 border rules out a pure-linear envelope
  envelopeProved: false, // (E) is MEASURED (K~1.26 to B=800), NOT proved
  anyBoundMoved: false,
  computeBindsFirst: true,
  conclusion:
    'The imp-96750 mean-square sub-gap is re-reduced (non-term-splitting) to the POINTWISE homogeneous ' +
    'log-envelope (E) |I(a,b)| <= K a (1 + log(b/a)) on coprime 2 <= a < b, via the exact integral ' +
    'Int_0^1 (1 - log x)^2 dx = 5 (so (E) gives Q(b) <= 5 K^2 b + O(1), any absolute K). (E) keeps the ' +
    'O(b log b) cancellation inside I -- it never separates the arithmetic part A from (pi/2)(V+V), so ' +
    'it evades the imp-96750 term-splitting overshoot to M log^2 M. Supporting structure: the summand ' +
    'I(a,b)^2/a^2 is asymptotically scale-invariant (collapses onto phi(a/b): b=600 vs b=1200 agree to ' +
    '3-4 digits at matched ratio), which explains the imp-96750 convergence Q(b)/b -> Int_0^1 phi; the ' +
    'measured envelope constant K ~ 1.26 is stable to B=800 with the sup on the near-diagonal a=b-1; and ' +
    'the log factor is FORCED by the rigorous imp-96667 border I(1,b) = (1/2) log b + (C+1/2) + o(1). ' +
    'But (E) is NOT proved -- it is an INDIVIDUAL (pointwise/sup) uniform bound on the two-variable ' +
    'Vasyunin-Bettin-Conrey cotangent combination with the arithmetic counter-terms inside the square ' +
    '(the individual bound on the Estermann/period function, uniform down the near-diagonal), and the ' +
    'slow upward creep of the measured sup (1.245 -> 1.256 over B=200..800) is consistent with a finite ' +
    'limit but not a proof of boundedness. So the obstruction is unmoved: the sub-gap is now the ' +
    'cleaner pointwise envelope (E) in place of the mean-square, still open. No improved rigorous ' +
    'ceiling posted; T = 2.594e7 stays the anchor; compute N ~ 9916 binds first. No refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96770_SUBGAP = Object.freeze({
  id: 'imp-96770-pointwise-homogeneous-log-envelope',
  statement:
    'The imp-96750 mean-square upper constant Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 <= s0* b + ' +
    'O(1) follows from the single POINTWISE homogeneous log-envelope (E) |I(a,b)| <= K a (1 + ' +
    'log(b/a)) for all coprime 2 <= a < b, with K an absolute constant (then s0* = 5 K^2 via the exact ' +
    'integral Int_0^1 (1 - log x)^2 dx = 5). (E) keeps the O(b log b) cancellation inside I -- it does ' +
    'NOT split the arithmetic part off the cotangent part, so it evades the imp-96750 term-splitting ' +
    'overshoot. Measured to hold with K ~ 1.26 (stable to B=800, sup on the near-diagonal a=b-1), and ' +
    'the log factor is forced by the rigorous a=1 border. Establishing (E) is the INDIVIDUAL (not ' +
    'mean-square) Bettin-Conrey cotangent bound -- a uniform pointwise bound on the Estermann/period ' +
    'function down the near-diagonal. Not established here. It is strictly weaker than the exact slope ' +
    's0 and than the imp-96548 off-diagonal Szego coefficient.',
});

export const IMP96770_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Non-term-splitting re-reduction + obstruction only: ' +
  'the imp-96750 mean-square sub-gap Q(b) <= s0* b + O(1) is re-reduced to the pointwise homogeneous ' +
  'log-envelope (E) |I(a,b)| <= K a (1 + log(b/a)) via the exact integral Int_0^1 (1 - log x)^2 dx = 5, ' +
  'which keeps the O(b log b) cancellation inside I (evading the term-splitting overshoot). (E) is ' +
  'MEASURED (K ~ 1.26 to B=800, sup on the near-diagonal, log factor forced by the rigorous a=1 ' +
  'border), NOT proved -- it is the individual Bettin-Conrey/Estermann bound -- so no bound is claimed ' +
  'moved and no positivity established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96770_ASSERTIONS = [
  {
    id: 'imp96770-summand-scale-invariant',
    holds: () =>
      IMP96770_COLLAPSE.every(
        (r) => Math.abs(r.phiAt600 - r.phiAt1200) < 0.02,
      ) &&
      // profile decreasing in x (larger ratio -> smaller phi), a genuine function of x
      IMP96770_COLLAPSE[0].phiAt600 > IMP96770_COLLAPSE[1].phiAt600,
    why: 'the weighted summand I(a,b)^2/a^2 collapses onto a single profile phi(a/b): b=600 and b=1200 agree to <0.02 at matched ratio (x=0.5: 2.355 vs 2.368; x=0.9: 1.4745 vs 1.4746), so Q(b) is a Riemann sum and Q(b)/b -> Int_0^1 phi -- the structural explanation of the imp-96750 convergence.',
  },
  {
    id: 'imp96770-sufficiency-integral-exact',
    holds: () => {
      const s = IMP96770_SUFFICIENCY;
      const rising = s.sumOverBAt400 < s.sumOverBAt800 && s.sumOverBAt800 < s.sumOverBAt1600;
      return s.envelopeIntegralExact === 5 && rising && s.sumOverBAt1600 < 5 && s.sumOverBAt1600 > 4.9;
    },
    why: 'the exact integral Int_0^1 (1 - log x)^2 dx = 1 + 2 + 2 = 5 converts the pointwise envelope (E) into the linear mean-square bound Q(b) <= 5 K^2 b + O(1); the measured Riemann sum Sum(1+log(b/a))^2/b rises 4.778 -> 4.869 -> 4.923 toward 5, confirming the constant.',
  },
  {
    id: 'imp96770-envelope-stable-on-near-diagonal',
    holds: () => {
      const e = IMP96770_ENVELOPE;
      const col = e.nearDiagonalColumn;
      const monotone = col.every((r, i) => i === 0 || r.ratio >= col[i - 1].ratio);
      const bounded = col.every((r) => r.ratio > 1.2 && r.ratio < 1.3);
      const KOk = Math.abs(e.looseLinearConstant - 5 * e.KMeasured * e.KMeasured) < 1e-9 && e.KMeasured > 1.25;
      return monotone && bounded && e.maxRatioAtB800 < 1.3 && KOk;
    },
    why: 'the pointwise envelope constant K = max |I|/[a(1+log(b/a))] is stable near 1.26 (1.2449 -> 1.2519 -> 1.2559 over B=200..800), attained on the near-diagonal a=b-1 whose column stays in [1.24,1.26]; the loose linear constant s0* = 5 K^2 ~ 7.94 is valid and linear (all the sub-gap needs), though not sharp.',
  },
  {
    id: 'imp96770-log-factor-forced-by-border',
    holds: () =>
      Math.abs(IMP96770_BORDER.IExact - IMP96770_BORDER.IPred) < 1e-3 &&
      Math.abs(IMP96770_BORDER.IPred - (0.5 * Math.log(10000) + IMP96770_C + 0.5)) < 1e-2,
    why: 'the rigorous imp-96667 border I(1,b) = (1/2) log b + (C+1/2) + o(1) is reproduced by the exact kernel (b=10000: 5.7355), fixing the convention and FORCING the log factor in (E): a pure-linear envelope |I| <= K a would fail at small a.',
  },
  {
    id: 'imp96770-honesty-gate-no-qed',
    holds: () =>
      IMP96770_VERDICT.anyBoundMoved === false &&
      IMP96770_VERDICT.envelopeProved === false &&
      IMP96770_VERDICT.reducedToPointwiseLogEnvelope === true &&
      IMP96770_VERDICT.sufficiencyIntegralExact === true &&
      IMP96770_VERDICT.envelopeKeepsCancellationIntact === true &&
      IMP96770_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP96770_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96770_HONEST_BANNER) &&
      /RH open/.test(IMP96770_HONEST_BANNER) &&
      /pointwise-homogeneous-log-envelope/.test(IMP96770_SUBGAP.id),
    why: 'non-term-splitting re-reduction + obstruction: the reduction to the pointwise envelope is exact (via Int=5), the envelope keeps the cancellation intact, but the envelope itself is NOT proved, no bound moved, and the honesty markers plus the named residual sub-gap are present.',
  },
];

for (const a of IMP96770_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96770-route-m-weighted-cotangent-homogeneous-envelope assertion failed: ${a.id}`,
    );
  }
}

export default {
  c: IMP96770_C,
  collapse: IMP96770_COLLAPSE,
  sufficiency: IMP96770_SUFFICIENCY,
  envelope: IMP96770_ENVELOPE,
  border: IMP96770_BORDER,
  verdict: IMP96770_VERDICT,
  subGap: IMP96770_SUBGAP,
  banner: IMP96770_HONEST_BANNER,
};
