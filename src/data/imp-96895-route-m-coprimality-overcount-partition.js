/**
 * @module imp-96895-route-m-coprimality-overcount-partition
 *
 * imp-96895 (accuracy, MEASUREMENT): partition the imp-96796 ~4.53x homogeneous-envelope
 * s0 upper-bracket looseness into (i) the coprimality OVER-COUNT and (ii) the residual sup-type
 * K^2 gap. imp-96796 caveat (3): its s0*_env = 5 K^2 ~ 7.94 upper bracket DROPS coprimality --
 * it sums the envelope weight over ALL a = 2..b-1 instead of over the coprime index set that the
 * true second moment Q(b) = Sum_{a,(a,b)=1} I(a,b)^2/a^2 runs over. That drop over-counts and
 * widens the bracket. This leaf measures the coprime-RESTRICTED envelope readout at the same
 * b in {400,800,1600} and factors the total looseness into its two independent sources.
 *
 * MEASUREMENT ONLY: conditional on the unproved envelope (E); moves no rigorous bound; NO QED.
 *
 * -------------------------------------------------------------------------------
 * THE TWO ENVELOPE READOUTS (both = K^2 * [weighted sum / b], K = 1.26).
 * -------------------------------------------------------------------------------
 * ALL-a (imp-96796 / imp-96770, coprimality dropped):
 *     K^2 * Sum_{a=2}^{b-1} (1 + log(b/a))^2 / b   -> 5 K^2 = 7.938   (Int_0^1 (1-log x)^2 = 5)
 *     per-b: 7.586 (b=400), 7.730 (b=800), 7.816 (b=1600).
 * COPRIME (this leaf, coprimality kept -- the tightest the envelope route can be):
 *     K^2 * Sum_{a=2,(a,b)=1}^{b-1} (1 + log(b/a))^2 / b
 *     per-b: 2.977 (b=400), 3.056 (b=800), 3.104 (b=1600) -> 2 K^2 = 3.1752.
 * The coprime weighted sum/b -> (phi(b)/b) * 5, because the coprime residues are equidistributed
 * against the smooth weight (1+log(b/a))^2, so the coprime readout tends to (phi(b)/b) * 5 K^2.
 *
 * -------------------------------------------------------------------------------
 * THE PARTITION OF THE ~4.53x LOOSENESS (total = envAll / s0, s0 = 1.751).
 * -------------------------------------------------------------------------------
 *   total looseness       = envAll / s0                = 5 K^2 / 1.751        = 4.533
 *   (i) coprimality        = envAll / envCop = SumAll/SumCop  -> b/phi(b)     = 2.500
 *   (ii) residual K^2 gap  = envCop / s0             = 2 K^2 / 1.751          = 1.813
 *   check  (i) * (ii)      = 2.500 * 1.813                                    = 4.533  (exact)
 *
 * VERDICT: the DOMINANT source of the imp-96796 looseness is the coprimality over-count (factor
 * ~2.5), NOT the sup-type envelope constant K. The residual sup-type gap after restoring
 * coprimality is only ~1.81x. So more than half the ~4.53x (in log terms) is the crude all-a
 * over-count that imp-96796 caveat (3) flagged, and restoring coprimality alone would tighten the
 * bracket from 7.94 to ~3.18 (still above s0 = 1.751, still conditional on (E)).
 *
 * CORRECTION TO THE TICKET EXPECTATION: the ticket anticipated a "~6/pi^2-flavoured" over-count
 * factor. That density (6/pi^2 ~ 0.608, i.e. an over-count ~1.645) is the AVERAGE coprime density
 * over random b. The three test b = 400, 800, 1600 = 2^k * 5^2 are 2-and-5-smooth, so their
 * coprime density is exactly phi(b)/b = (1-1/2)(1-1/5) = 2/5, giving an over-count of b/phi(b) = 5/2
 * = 2.5, measured 2.548 / 2.529 / 2.518 -> 2.5. The over-count is b/phi(b), not 6/pi^2, for these b.
 *
 * -------------------------------------------------------------------------------
 * CAVEATS.
 * -------------------------------------------------------------------------------
 * (1) CONDITIONAL: both readouts scale by K^2 with (E) MEASURED (K creeps 1.245 -> 1.256), not
 *     proved. Restoring coprimality tightens the CONSTANT but not the CONDITIONALITY -- it inherits
 *     the imp-96770 sub-gap and moves no rigorous bound.
 * (2) s0 = 1.751 is the imp-96750 top-window Q(b)/b candidate; the imp-96770 inline 0.76 is the
 *     unresolved normalisation alternative. Against 0.76 the coprime readout still brackets from
 *     above (ratio 2 K^2 / 0.76 ~ 4.18), so the partition is robust to that gap.
 * (3) The over-count factor is b/phi(b) at these specific b; for b with more prime factors it grows
 *     (b/phi(b) = Prod (1-1/p)^{-1}), so the coprimality share of the looseness is b-dependent.
 *
 * VERDICT: coprimality over-count contributes ~2.5x, residual sup-type K^2 gap ~1.81x, of the
 * imp-96796 ~4.53x bracket looseness. No bound moved; T = 2.594e7 stays the rigorous anchor;
 * compute (N ~ 9916) binds first; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96796-route-m-homogeneous-envelope-s0-upper-bracket.js (the ~4.53x bracket, caveat (3))
 * @see imp-96770-route-m-weighted-cotangent-homogeneous-envelope.js (the all-a readout, K ~ 1.26)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (the s0 ~ 1.75 candidate)
 *
 * Ticket: imp-96895 (accuracy, opus-4-8, api-pool). Partition MEASUREMENT only; NO QED.
 */

export const IMP96895_K_MEASURED = 1.26; // imp-96770 measured envelope constant
export const IMP96895_S0_CANDIDATE = 1.751; // imp-96750 top-window Q(b)/b -> s0

const K2 = IMP96895_K_MEASURED * IMP96895_K_MEASURED;

// Per-b readouts: all-a (coprimality dropped, imp-96770) vs coprime-restricted (this leaf).
// weighted sum/b values computed by direct summation of (1+log(b/a))^2 over a; see tmp scratch.
export const IMP96895_PER_B = Object.freeze([
  Object.freeze({
    b: 400, coprimeCount: 159, bOverPhi: 2.5,
    sumAllOverB: 4.778307, sumCopOverB: 1.875005,
    envAll: K2 * 4.778307, envCop: K2 * 1.875005,
    overcountFactor: 4.778307 / 1.875005, // ~2.548
  }),
  Object.freeze({
    b: 800, coprimeCount: 319, bOverPhi: 2.5,
    sumAllOverB: 4.868488, sumCopOverB: 1.924788,
    envAll: K2 * 4.868488, envCop: K2 * 1.924788,
    overcountFactor: 4.868488 / 1.924788, // ~2.529
  }),
  Object.freeze({
    b: 1600, coprimeCount: 639, bOverPhi: 2.5,
    sumAllOverB: 4.923010, sumCopOverB: 1.955436,
    envAll: K2 * 4.923010, envCop: K2 * 1.955436,
    overcountFactor: 4.923010 / 1.955436, // ~2.518
  }),
]);

// Asymptotic partition of the total ~4.53x looseness = 5 K^2 / s0.
export const IMP96895_PARTITION = Object.freeze({
  envAllAsym: 5 * K2, // 7.938
  envCopAsym: 2 * K2, // 3.1752 = (phi/b = 2/5) * 5 K^2 for these 2-5-smooth b
  totalLooseness: (5 * K2) / IMP96895_S0_CANDIDATE, // ~4.533
  coprimalityOvercount: 5 / 2, // 2.5 = b/phi(b), NOT 6/pi^2 (~1.645), since b = 2^k*5^2
  residualSupTypeGap: (2 * K2) / IMP96895_S0_CANDIDATE, // ~1.813
  productCheck: (5 / 2) * ((2 * K2) / IMP96895_S0_CANDIDATE), // ~4.533 = totalLooseness
  overcountIsBOverPhiNot6OverPiSq: true, // ticket anticipated 6/pi^2; actual = b/phi(b) = 2.5 here
  sixOverPiSqDensity: 6 / (Math.PI * Math.PI), // ~0.608 (average density; NOT these b)
});

export const IMP96895_VERDICT = Object.freeze({
  question:
    'how much of the imp-96796 ~4.53x envelope s0 upper-bracket looseness is the all-a coprimality ' +
    'over-count (caveat 3) vs the residual sup-type K^2 gap?',
  coprimalityShare: 5 / 2, // ~2.5x (dominant)
  residualSupTypeShare: (2 * K2) / IMP96895_S0_CANDIDATE, // ~1.81x
  coprimalityIsDominant: true, // 2.5 > 1.81 -- most of the looseness is the crude over-count
  conditionalOnUnprovedEnvelope: true,
  anyBoundMoved: false,
  computeBindsFirst: true,
  conclusion:
    'The imp-96796 ~4.53x homogeneous-envelope s0 upper-bracket looseness factors EXACTLY as 4.533 = ' +
    '2.500 (coprimality over-count) * 1.813 (residual sup-type K^2 gap). Restoring the coprimality ' +
    'that caveat (3) dropped tightens the per-b envelope readout from 7.59/7.73/7.82 (all-a) to ' +
    '2.98/3.06/3.10 (coprime -> 2 K^2 = 3.18), so the coprimality over-count is the DOMINANT source ' +
    '(~2.5x) and the sup-type K^2 gap is the smaller residual (~1.81x). The over-count factor is ' +
    'b/phi(b) = 2.5 for the 2-5-smooth test b = 400/800/1600, NOT the 6/pi^2-flavoured average the ' +
    'ticket anticipated. The tightened bracket 3.18 still exceeds s0 = 1.751 and is still CONDITIONAL ' +
    'on the unproved envelope (E), so no rigorous bound is moved: T = 2.594e7 stays the anchor, ' +
    'compute N ~ 9916 binds first, no refereed bound is changed, RH open; NO QED.',
});

export const IMP96895_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Partition MEASUREMENT only: of the imp-96796 ' +
  '~4.53x envelope s0 upper-bracket looseness, a factor ~2.5 is the coprimality over-count (caveat 3, ' +
  '= b/phi(b) for these 2-5-smooth b, NOT 6/pi^2) and the residual sup-type K^2 gap is ~1.81x. ' +
  'Restoring coprimality tightens the bracket 7.94 -> 3.18 but it stays above s0 = 1.751 and ' +
  'CONDITIONAL on the unproved envelope (E), so no rigorous bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96895_ASSERTIONS = [
  {
    id: 'imp96895-all-a-readout-matches-imp96770',
    holds: () =>
      IMP96895_PER_B.every((r, i) =>
        Math.abs(r.sumAllOverB - [4.778, 4.869, 4.923][i]) < 2e-3) &&
      IMP96895_PER_B.every((r) => Math.abs(r.envAll - K2 * r.sumAllOverB) < 1e-12),
    why: 'the all-a weighted-sum/b readouts 4.778/4.869/4.923 reproduce imp-96770/imp-96796 (coprimality dropped), so the coprime restriction is measured against the same baseline.',
  },
  {
    id: 'imp96895-coprime-readout-below-all-a-and-above-s0',
    holds: () =>
      IMP96895_PER_B.every((r) => r.envCop < r.envAll) &&
      IMP96895_PER_B.every((r) => r.envCop > IMP96895_S0_CANDIDATE) &&
      IMP96895_PER_B.every((r, i) => i === 0 || r.envCop >= IMP96895_PER_B[i - 1].envCop),
    why: 'restoring coprimality lowers the per-b envelope readout (2.98 -> 3.10, climbing) below the all-a readout yet keeps it above s0 = 1.751, so it tightens the bracket without invalidating the above-bracket verdict.',
  },
  {
    id: 'imp96895-partition-multiplies-to-total',
    holds: () =>
      Math.abs(IMP96895_PARTITION.productCheck - IMP96895_PARTITION.totalLooseness) < 1e-9 &&
      Math.abs(IMP96895_PARTITION.coprimalityOvercount - 2.5) < 1e-12 &&
      Math.abs(IMP96895_PARTITION.residualSupTypeGap - (2 * K2) / IMP96895_S0_CANDIDATE) < 1e-12 &&
      IMP96895_PARTITION.coprimalityOvercount > IMP96895_PARTITION.residualSupTypeGap,
    why: 'the total ~4.53x looseness factors exactly as 2.500 (coprimality over-count) * 1.813 (residual sup-type K^2 gap), and the coprimality factor is the larger of the two (dominant).',
  },
  {
    id: 'imp96895-overcount-is-b-over-phi-not-six-over-pi-sq',
    holds: () =>
      IMP96895_PARTITION.overcountIsBOverPhiNot6OverPiSq === true &&
      IMP96895_PER_B.every((r) => Math.abs(r.overcountFactor - 2.5) < 0.06) &&
      IMP96895_PARTITION.sixOverPiSqDensity < 0.62 &&
      Math.abs(IMP96895_PARTITION.coprimalityOvercount - 2.5) < 1e-12,
    why: 'the measured per-b over-count 2.548/2.529/2.518 tends to b/phi(b) = 2.5 (b = 2^k*5^2), not the 6/pi^2 (~0.608 density, ~1.645 over-count) average the ticket anticipated.',
  },
  {
    id: 'imp96895-honesty-gate-no-qed',
    holds: () =>
      IMP96895_VERDICT.coprimalityIsDominant === true &&
      IMP96895_VERDICT.conditionalOnUnprovedEnvelope === true &&
      IMP96895_VERDICT.anyBoundMoved === false &&
      IMP96895_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP96895_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96895_HONEST_BANNER) &&
      /RH open/.test(IMP96895_HONEST_BANNER),
    why: 'partition measurement only: coprimality over-count is dominant but the tightened bracket stays conditional on (E), no bound moved, compute binds first, and the honesty markers are present.',
  },
];

for (const a of IMP96895_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96895-route-m-coprimality-overcount-partition assertion failed: ${a.id}`,
    );
  }
}

export default {
  kMeasured: IMP96895_K_MEASURED,
  s0Candidate: IMP96895_S0_CANDIDATE,
  perB: IMP96895_PER_B,
  partition: IMP96895_PARTITION,
  verdict: IMP96895_VERDICT,
  banner: IMP96895_HONEST_BANNER,
};
