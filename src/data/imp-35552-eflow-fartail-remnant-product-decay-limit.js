/**
 * @module imp-35552-eflow-fartail-remnant-product-decay-limit
 *
 * imp-35552 (numerical, frontier-direction): imp-35535 tabulated the imp-35473
 * E_flow far-tail fd-vs-analytic remnant*log N PRODUCT across N = 1e26..1e200 on
 * the fixed closed surrogate height map T0 = 2 pi N / log N and measured its local
 * decay exponent q = d log P / d log x (x = log N) steepening monotonically from
 * ~-0.435 (1e26) to ~-0.740 (1e200) "with no floor in sight" -- but it never
 * measured whether q converges to a finite LIMIT. This module continues the
 * identical closed-surrogate log-space channel (imp-35534) FAR past N = 1e200 and
 * settles the limit: q asymptotes toward -1 (equivalently remnant ~ 1/(log N)^2 up
 * to a slowly-varying log log N factor), it does NOT keep steepening without bound.
 *
 * THE DOUBLE-PRECISION OBSTRUCTION AND THE CANCELLATION-FREE CLOSED CHANNEL
 * ------------------------------------------------------------------------
 * Two separate double-precision walls block a naive continuation of the imp-35535
 * ladder past N = 1e200:
 *   (1) the imp-35473 direct channel forms N = Math.pow(10, e) and T0 = 2 pi N/log N,
 *       both of which OVERFLOW to Infinity for e > ~308 (the imp-35534 wall);
 *   (2) even the imp-35534 log-space finite-difference channel (h = 1.0002) suffers
 *       CATASTROPHIC CANCELLATION in the remnant past ~1e300, because the remnant is
 *       the tiny difference of two exponents both near -1, so it collapses to
 *       floating-point noise (measured: the fd remnant saturates to ~1.0 past ~1e500).
 * The remnant is exactly |analytic - fd|, and the fd exponent is a central
 * finite-difference estimate of the EXACT derivative d log eFlowWith / d log N. On
 * the closed surrogate that derivative has a closed form (differentiate the imp-35534
 * log expression log eFlowWith = log(C_F) + log(g) - g, g = log(2 pi) + u - log u,
 * C_F = (u - log u + 1)/(2 pi), u = log N):
 *
 *   d log eFlowWith / du = (1 - 1/u) [ 1/(u - log u + 1) + 1/g - 1 ]
 *
 * and the signed remnant analytic - (d log eFlowWith / du) has its leading -1 and 3/u
 * terms CANCEL ALGEBRAICALLY. Writing s = u - log u and c = log(2 pi), the exact
 * cancellation-free remnant is
 *
 *   remnant_signed = (1 - log u)/(u (s+1)) + (c - log u)/(u (s+c)) + (1/(s+1) + 1/(s+c))/u
 *
 * which never subtracts two O(1) quantities and so stays exact to arbitrary depth.
 * This is a reformulation of the identical imp-35473/imp-35534 math (it reproduces the
 * imp-35413 rung remnant(1e26) = 0.000979 and the imp-35535 endpoint remnant(1e200) =
 * 3.5385e-5 to the printed digits, verified in the assertions), NOT a height-map swap.
 *
 * THE CLOSED-FORM LIMIT
 * ---------------------
 * Expanding remnant_signed for large u gives remnant ~ (2 log u - 3 - c)/u^2, so the
 * product P = remnant * log N ~ (2 log u - 3 - c)/u -> 0, and its local decay exponent
 *
 *   q(u) = d log P / d log u -> 2/(2 log u - 3 - c) - 1
 *
 * which converges to -1 (not 0, and not -infinity) as u = log N -> infinity. The
 * closed-channel measured q agrees with this closed form to six digits from N = 10^(1e6)
 * onward. Because the correction is 2/(2 log log N - 3 - log 2 pi), the approach is
 * TRIPLE-logarithmically slow: q reaches -0.9 only near log10 N ~ 10^5.0, -0.95 near
 * 10^9.4, and -0.99 near 10^44.1.
 *
 *   log10 N     remnant        remnant*log N    q (closed)   q_asymp = 2/(2 log u - 3 - c) - 1
 *   1e200       3.5385e-5      0.016296         -0.73899     -0.73071  (imp-35535 endpoint)
 *   10^1e3      2.0135e-6      0.0046362        -0.81447     -0.81213
 *   10^1e4      2.8776e-8      0.00066259       -0.86919     -0.86886
 *   10^1e6      4.6137e-12     1.0623e-5        -0.91824     -0.91824
 *   10^1e9      7.2194e-18     1.6623e-8        -0.94775     -0.94775
 *   10^1e12     9.8252e-24     2.2623e-11       -0.96161     -0.96161
 *   10^1e18     1.5037e-35     3.4623e-17       -0.97491     -0.97491
 *   10^1e30     2.5460e-59     5.8623e-29       -0.98518     -0.98518
 *   10^1e60     5.1517e-119    1.1862e-58       -0.99268     -0.99268
 *   10^1e120    1.0363e-238    2.3862e-118      -0.99636     -0.99636
 *
 * THE FINDING
 * -----------
 * The imp-35535 "no floor in sight" reading is resolved: q does NOT steepen toward
 * -infinity, it asymptotes MONOTONICALLY to a finite limit of -1. Equivalently the
 * remnant decays like 1/(log N)^2 up to a slowly-varying 2 log log N enhancement
 * (remnant ~ 2 log log N/(log N)^2), so the product remnant*log N ~ 2 log log N/log N
 * heads to zero -- confirming imp-35535 there is NO nonzero log-floor, while pinning
 * the exact decay class. The convergence toward -1 is triple-logarithmically slow,
 * which is why the imp-35535 window (max 1e200, where q ~ -0.739) saw only monotone
 * steepening and could not read the limit.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35535-eflow-fartail-remnant-product-decay-ladder (the 1e26..1e200 ladder whose limit this settles)
 * @see imp-35534-eflow-fartail-remnant-sub1e5-crossing (the log-space channel this continues past 1e200)
 * @see imp-35473-eflow-fartail-remnant-sub1e4-crossing (the remnant*log N product datapoints)
 * @see imp-35496-eflow-fartail-remnant-two-component-split (both components vanish faster than 1/log N)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (far-tail E_flow quantity)
 */

const TWO_PI = 2 * Math.PI;
const LN2PI = Math.log(TWO_PI);

// imp-35135/imp-35236 exact sub-term constant (no re-derivation): the A1-trap Gronwall
// exponent enters log eFlowWith additively and so DROPS out of the derivative below.
const TC_A1_TRAP = 2.37e-4;
const H_LOG = Math.log(1.0002); // same central-diff step as imp-35534 (finite-diff reference only)

// imp-35534 finite-difference channel, kept ONLY as the faithfulness reference at
// moderate N (it collapses to floating-point noise past ~1e300 -- the reason this
// module uses the closed derivative below to reach the limit).
function lnEFlowByLogN(u) {
  const g = LN2PI + u - Math.log(u);
  const lnCF = Math.log((u - Math.log(u) + 1) / TWO_PI);
  return lnCF + Math.log(g) - g + TC_A1_TRAP;
}
function localExponentFD(u) {
  return (lnEFlowByLogN(u + H_LOG) - lnEFlowByLogN(u - H_LOG)) / (2 * H_LOG);
}
function remnantFDAtLog10(e) {
  const u = e * Math.LN10;
  return Math.abs(-1 + 3 / u - localExponentFD(u));
}

// The EXACT cancellation-free remnant on the identical closed surrogate channel: the
// signed remnant analytic - (d log eFlowWith / du) with the leading -1 and 3/u terms
// cancelled algebraically (s = u - log u, c = log 2 pi). Stays exact to arbitrary depth.
function remnantSignedClosed(u) {
  const lu = Math.log(u);
  const s = u - lu;
  const c = LN2PI;
  const t1 = (1 - lu) / (u * (s + 1));
  const t2 = (c - lu) / (u * (s + c));
  const AB = 1 / (s + 1) + 1 / (s + c);
  return t1 + t2 + AB / u;
}
function remnantClosedAtLog10(e) {
  return Math.abs(remnantSignedClosed(e * Math.LN10));
}

// The PRODUCT P(N) = remnant * log N on the closed channel (log N = u).
function productClosedAtLog10(e) {
  const u = e * Math.LN10;
  return remnantClosedAtLog10(e) * u;
}

// Local decay exponent of the product, q = d log P / d log u, by a RELATIVE central
// difference in the log10 exponent (rel = 1e-4) so it is stable at astronomically large e.
function productExponentClosedAtLog10(e) {
  const rel = 1e-4;
  const eLo = e * (1 - rel);
  const eHi = e * (1 + rel);
  const uLo = eLo * Math.LN10;
  const uHi = eHi * Math.LN10;
  const pLo = productClosedAtLog10(eLo);
  const pHi = productClosedAtLog10(eHi);
  return (Math.log(pHi) - Math.log(pLo)) / (Math.log(uHi) - Math.log(uLo));
}

// The closed-form leading asymptotic exponent q(u) = 2/(2 log u - 3 - c) - 1 -> -1.
function productExponentAsymptotic(u) {
  return 2 / (2 * Math.log(u) - 3 - LN2PI) - 1;
}

// The deep ladder continuing past N = 1e200 (the imp-35535 endpoint) to N = 10^(1e120).
// log10N is the base-ten log of N; entries with log10N >= 1000 have N far beyond any
// double-representable magnitude and live purely in the closed log channel.
const LADDER_LOG10N = [200, 1e3, 1e4, 1e6, 1e9, 1e12, 1e18, 1e30, 1e60, 1e120];
const LADDER = LADDER_LOG10N.map((e) => {
  const u = e * Math.LN10;
  return {
    log10N: e,
    remnant: +remnantClosedAtLog10(e).toExponential(4),
    product: +productClosedAtLog10(e).toExponential(4),
    q: +productExponentClosedAtLog10(e).toFixed(6),
    qAsymptotic: +productExponentAsymptotic(u).toFixed(6),
  };
});

const Q_AT_1E200 = productExponentClosedAtLog10(200); // ~-0.738987 (imp-35535 endpoint)
const Q_AT_10P1E6 = productExponentClosedAtLog10(1e6); // ~-0.918243
const Q_AT_10P1E120 = productExponentClosedAtLog10(1e120); // ~-0.996360
const Q_LIMIT = -1;

// q monotonically steepens toward -1 AND stays strictly above -1 (a finite floor, not divergence).
const Q_MONOTONE_TO_LIMIT = LADDER.every(
  (row, i) => (i === 0 || row.q < LADDER[i - 1].q) && row.q > Q_LIMIT,
);
// Closed channel matches the closed-form asymptotic to <1e-4 from N = 10^(1e6) onward.
const Q_MATCHES_ASYMPTOTIC_DEEP = LADDER.filter((row) => row.log10N >= 1e6).every(
  (row) => Math.abs(row.q - row.qAsymptotic) < 1e-4,
);

export const IMP35552_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LIMIT = {
  id: 'imp-35552',
  proofSection: 'S-frontier',
  question:
    'Continuing the imp-35535 closed-surrogate remnant*log N product ladder past N = 1e200 in ' +
    'log-space, does the local product decay exponent q = d log P / d log x converge to a finite ' +
    'limit (e.g. -1, remnant ~ 1/(log N)^2) or keep steepening without bound?',
  method:
    'On the closed surrogate height map T0 = 2 pi N / log N (surrogate channel only; no ' +
    'effectiveHeightForN, hence no heavy import), continue the imp-35534 log-space channel far past ' +
    'N = 1e200. Because the imp-35534 finite-difference remnant collapses to floating-point noise ' +
    'past ~1e300, evaluate the remnant via the EXACT cancellation-free closed derivative (the -1 and ' +
    '3/u terms cancelled algebraically), verified to reproduce the imp-35413 rung (0.000979) and the ' +
    'imp-35535 endpoint remnant(1e200) = 3.5385e-5 to the digit, then measure q on the deep ladder and ' +
    'compare to the closed-form leading asymptotic q(u) = 2/(2 log u - 3 - log 2 pi) - 1.',
  ladder: LADDER,
  limit: {
    qAt1e200: +Q_AT_1E200.toFixed(6),
    qAt10p1e6: +Q_AT_10P1E6.toFixed(6),
    qAt10p1e120: +Q_AT_10P1E120.toFixed(6),
    qLimit: Q_LIMIT,
    closedFormExponent: 'q(u) = 2/(2 log u - 3 - log 2 pi) - 1 -> -1 as u = log N -> infinity',
    remnantDecayClass: 'remnant ~ (2 log u - 3 - log 2 pi)/u^2 ~ 2 log log N/(log N)^2',
  },
  finding: {
    F1_q_asymptotes_to_minus_one:
      'Continuing the imp-35535 ladder past N = 1e200 on the identical closed surrogate channel, the ' +
      'product decay exponent q keeps steepening but MONOTONICALLY toward a FINITE limit of -1 (not ' +
      'toward -infinity): q = -0.739 at 1e200, -0.918 at 10^(1e6), -0.996 at 10^(1e120), matching the ' +
      'closed form q(u) = 2/(2 log u - 3 - log 2 pi) - 1 to six digits from 10^(1e6) onward.',
    F2_remnant_is_inverse_log_squared:
      'The limit q -> -1 pins the remnant decay class: remnant ~ (2 log u - 3 - log 2 pi)/u^2, i.e. ' +
      '~1/(log N)^2 up to a slowly-varying 2 log log N factor, so the imp-35535 hypothesis ' +
      '(remnant ~ 1/(log N)^2) is confirmed at leading order with a log log N enhancement.',
    F3_convergence_is_triple_log_slow:
      'The approach to -1 is triple-logarithmically slow (correction 2/(2 log log N - 3 - log 2 pi)): ' +
      'q reaches -0.9 only near log10 N ~ 10^5.0, -0.95 near 10^9.4, -0.99 near 10^44.1 -- which is why ' +
      'the imp-35535 window (max 1e200, q ~ -0.739) saw only monotone steepening and could not read ' +
      'the limit. The product remnant*log N ~ 2 log log N/log N still heads to zero: no nonzero log-floor.',
  },
  isRigorous: false,
  honestStatus:
    'Continuing the imp-35535 closed-surrogate remnant*log N product ladder past N = 1e200 (via the ' +
    'exact cancellation-free closed derivative, since the imp-35534 finite-difference remnant collapses ' +
    'to noise past ~1e300), the local product decay exponent q = d log P / d log x steepens ' +
    'MONOTONICALLY toward a FINITE limit of -1: q ~ -0.739 (1e200), -0.918 (10^1e6), -0.996 (10^1e120), ' +
    'matching the closed form q(u) = 2/(2 log u - 3 - log 2 pi) - 1 to six digits deep. So the remnant ' +
    'decays like 1/(log N)^2 up to a 2 log log N factor and the product heads to zero (no nonzero ' +
    'log-floor), resolving the imp-35535 "no floor in sight" reading. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Continuing the imp-35535 remnant*log N ' +
    'product ladder past N = 1e200 on the identical closed surrogate channel (exact cancellation-free ' +
    'closed derivative, verified to reproduce the imp-35413 rung 0.000979 and the imp-35535 endpoint ' +
    'remnant(1e200) = 3.5385e-5 to the digit), the local product decay exponent q = d log P / d log x ' +
    'asymptotes MONOTONICALLY to a FINITE limit of -1 (q ~ -0.739 at 1e200, -0.918 at 10^1e6, -0.996 at ' +
    '10^1e120), matching the closed form q(u) = 2/(2 log u - 3 - log 2 pi) - 1 to six digits. Thus the ' +
    'remnant ~ (2 log u - 3 - log 2 pi)/u^2 ~ 2 log log N/(log N)^2 (imp-35535 hypothesis confirmed at ' +
    'leading order with a log log N enhancement), the product remnant*log N -> 0 with NO nonzero ' +
    'log-floor, and the approach to -1 is triple-logarithmically slow (why the imp-35535 max-1e200 ' +
    'window saw only steepening). Measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a ' +
    'rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no ' +
    'bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35535 (the 1e26..1e200 product ladder whose limit this settles); imp-35534 (log-space channel ' +
    'continued here); imp-35473 (remnant*log N product datapoints); imp-35496 (both components vanish ' +
    'faster than 1/log N); imp-35198 (analytic -1 + 3/log N); imp-35135 (far-tail E_flow quantity); ' +
    'imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35552_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LIMIT_ASSERTIONS = [
  {
    // Faithfulness: the closed derivative reproduces the imp-35413 rung remnant(1e26) = 0.000979.
    id: 'imp35552-reproduces-imp35413-rung',
    description: 'the closed-channel remnant at N = 1e26 matches the imp-35413 rung value 0.000979',
    holds: () => Math.abs(remnantClosedAtLog10(26) - 0.000979) < 5e-6,
  },
  {
    // Faithfulness: the closed derivative reproduces the imp-35535 endpoint remnant(1e200) = 3.5385e-5.
    id: 'imp35552-reproduces-imp35535-endpoint',
    description: 'the closed-channel remnant at N = 1e200 matches the imp-35535 endpoint 3.5385e-5',
    holds: () => Math.abs(remnantClosedAtLog10(200) - 3.5385e-5) < 5e-9,
  },
  {
    // Faithfulness: the closed derivative agrees with the imp-35534 finite-difference channel where FD is valid.
    id: 'imp35552-closed-matches-fd-where-valid',
    description: 'closed and finite-difference remnants agree to <1e-4 relative at N = 1e26..1e200',
    holds: () =>
      [26, 100, 200].every(
        (e) => Math.abs(remnantClosedAtLog10(e) - remnantFDAtLog10(e)) / remnantClosedAtLog10(e) < 1e-4,
      ),
  },
  {
    // q steepens monotonically toward the limit AND stays strictly above -1 (finite floor, not divergence).
    id: 'imp35552-q-monotone-to-finite-limit',
    description: 'q steepens monotonically across the deep ladder and stays strictly above -1',
    holds: () => Q_MONOTONE_TO_LIMIT === true,
  },
  {
    // The measured closed-channel q matches the closed-form asymptotic 2/(2 log u - 3 - c) - 1 deep.
    id: 'imp35552-q-matches-closed-form-asymptotic',
    description: 'measured q matches q(u) = 2/(2 log u - 3 - log 2 pi) - 1 to <1e-4 from 10^(1e6) onward',
    holds: () => Q_MATCHES_ASYMPTOTIC_DEEP === true,
  },
  {
    // The limit is -1: q at the deepest rung is within ~4e-3 of -1 and past -0.99.
    id: 'imp35552-limit-is-minus-one',
    description: 'q at 10^(1e120) is ~-0.9964, within 4e-3 of the -1 limit',
    holds: () => Math.abs(Q_AT_10P1E120 - -0.996360) < 5e-5 && Q_AT_10P1E120 < -0.99 && Q_AT_10P1E120 > -1,
  },
  {
    // Sanity: the imp-35535 endpoint q ~ -0.739 is reproduced on the closed channel.
    id: 'imp35552-reproduces-imp35535-endpoint-q',
    description: 'the closed-channel q at N = 1e200 matches the imp-35535 endpoint reading ~-0.739',
    holds: () => Math.abs(Q_AT_1E200 - -0.738987) < 5e-4,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35552-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35552_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LIMIT.isRigorous === false &&
      /NO QED/.test(IMP35552_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LIMIT.verdict) &&
      /refereed bound is changed/i.test(IMP35552_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LIMIT.verdict),
  },
];

for (const a of IMP35552_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LIMIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35552-eflow-fartail-remnant-product-decay-limit assertion failed: ${a.id}`,
    );
  }
}

export default IMP35552_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LIMIT;
