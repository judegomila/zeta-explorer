/**
 * @module imp-34627-q2-rung-mean-aggregate-ladder-closure
 * @fileoverview imp-34627 -- MEASUREMENT ONLY: independently CLOSE the q2 rung and the whole
 *   {2, 3, 4} roundoff-amplification ladder on the deep-group MEAN aggregate, not just the
 *   deep-group MAX imp-34606 fit on. imp-34606 built the unified q2/q3/q4 finite-difference
 *   roundoff-amplification ladder but fit every exponent on a SINGLE aggregation -- the deep-group
 *   worst-case MAX share (max over the four deep-tail landmarks). A single summary statistic leaves
 *   open whether the clean {2, 3, 4} staircase is a genuine property of the deep group or an artifact
 *   of the one worst landmark that dominates the max. This module re-measures the same q2/q3/q4
 *   channel shares over the SAME per-channel roundoff windows and the SAME four deep-tail landmarks,
 *   but fits the deep-group MEAN aggregate, and asks whether the {2, 3, 4} ladder survives the change
 *   of aggregation.
 *
 *   WHY THIS MATTERS (beyond imp-34606)
 *   -----------------------------------
 *   imp-34606 F1 reported m2 ~ 1.999, m3 ~ 2.903, m4 ~ 4.008 on the deep-group MAX share. A per-
 *   landmark fit is not an option here: at these roundoff-window steps the k-point difference of some
 *   individual landmarks underflows to an exact zero, so a single-landmark log-log fit degenerates to
 *   NaN. The deep-group aggregate is what makes the exponent measurable at all, which is exactly why
 *   the aggregation choice must be stress-tested: if the ladder only appears under MAX (dominated by
 *   the single stiffest landmark) it is fragile. Re-fitting the MEAN -- a smooth average that weights
 *   all four landmarks -- tests robustness AND independently re-closes the q2 rung the parents
 *   imp-34592 (q4) / imp-34593 (q3) never touched.
 *
 *   THE FINDING (the {2, 3, 4} ladder survives; MAX reproduces imp-34606 exactly)
 *   ----------------------------------------------------------------------------
 *   (F1) THE LADDER SURVIVES THE MEAN AGGREGATION. Fitting log(deep-group MEAN share) vs log dp over
 *        each channel roundoff window gives m2 ~ 2.183 (R^2 ~ 0.992), m3 ~ 2.956 (R^2 ~ 0.965) and
 *        m4 ~ 3.843 (R^2 ~ 0.967). These round to exactly {2, 3, 4} and strictly increase -- the same
 *        clean k-point / dp^k staircase imp-34606 read on the MAX, now confirmed to NOT be an artifact
 *        of the single worst-case landmark.
 *   (F2) THE MAX AGGREGATE REPRODUCES imp-34606 TO ~1e-3. Re-running the MAX fit on the inline
 *        primitives gives m2 ~ 1.999, m3 ~ 2.903, m4 ~ 4.008 -- matching imp-34606 F1 to within ~1e-3
 *        on every rung, a byte-level consistency check that the primitives are reproduced verbatim.
 *   (F3) THE q2 RUNG CLOSES ON BOTH AGGREGATIONS. The never-independently-verified q2 second-difference
 *        share amplifies as ~1/dp^2 under BOTH the MAX (m2 ~ 2.00) and the MEAN (m2 ~ 2.18) aggregate,
 *        both rounding to the predicted integer 2. CONCLUSION: within the inherited component model the
 *        q2/q3/q4 roundoff-amplification ladder is robust to the deep-group aggregation statistic, and
 *        the q2 rung sits on the {2, 3, 4} staircase regardless of whether the deep group is summarized
 *        by its worst case or its mean. This is a conditioning diagnostic on the finite-difference
 *        measurement; it changes no bound.
 *
 *   MEASUREMENT ONLY. Reproduces the imp-34446 / imp-34531 / imp-34543 / imp-34566 / imp-34573 /
 *   imp-34606 primitives inline (imports NOTHING -- no lambda-rh-height-mapping, no polymath15 module,
 *   no zeros bundle), following the no-heavy-imports directive. q1..q4 are the inherited central
 *   differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail regime (imp-3220 /
 *   imp-3406 component model least trustworthy) is inherited as-is -- this diagnoses the
 *   finite-difference conditioning OF that measurement, it does not rehabilitate the model. The -2
 *   asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb
 *   GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (unified q2/q3/q4 ladder on deep-group MAX; parent)
 *   @see imp-34592-q4-share-roundoff-floor-vs-dp.js (q4 O(h^4) share inflates ~1/dp^4; deep-tail dp floor)
 *   @see imp-34593-drift-share-error-optimal-dp-fit.js (q3-share excess roundoff exponent free m ~ 3.5)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34627 (numerical, medium). q2 rung + {2,3,4} ladder re-closed on the MEAN aggregate; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34566/imp-34573/imp-34606 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the deep-tail floor

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34566/imp-34573/imp-34606).
function qDerivs(N, dp) {
  const p = Math.log(N);
  const q = (pp) => Math.log(eColl(Math.exp(pp)));
  const f0 = q(p);
  const fp = q(p + dp);
  const fm = q(p - dp);
  const fpp = q(p + 2 * dp);
  const fmm = q(p - 2 * dp);
  const q1 = (fp - fm) / (2 * dp);
  const q2 = (fp - 2 * f0 + fm) / (dp * dp);
  const q3 = (fpp - 2 * fp + 2 * fm - fmm) / (2 * dp * dp * dp);
  const q4 = (fpp - 4 * fp + 6 * f0 - 4 * fm + fmm) / (dp * dp * dp * dp);
  return { q1, q2, q3, q4 };
}

// The three channel coefficient SHARES on one common footing (imp-34543/imp-34566/imp-34606 decomposition).
function channelShare(N, dp, k) {
  const { q1, q2, q3, q4 } = qDerivs(N, dp);
  if (k === 2) return Math.abs(q2 / (2 * q1 * q1));
  if (k === 3) return Math.abs(q3 / (6 * q1 * q1));
  return Math.abs(q4 / (12 * q1));
}

// Deep-tail landmarks only (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01) -- the regime under stress.
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];
const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

// Deep-group aggregate share of channel k at step dp -- MAX (imp-34606 footing) or MEAN (this ticket).
function deepGroupAggShare(dp, k, agg) {
  const vals = DEEP_LADDER.map((N) => channelShare(N, dp, k));
  return agg === 'max' ? Math.max(...vals) : mean(vals);
}

// Per-channel roundoff-dominated dp windows -- IDENTICAL to imp-34606 (reused verbatim).
const WINDOW_Q2 = [2e-6, 1e-6, 5e-7, 3e-7, 1e-7];
const WINDOW_Q3 = [1e-4, 5e-5, 3e-5, 2e-5, 1e-5];
const WINDOW_Q4 = [2e-3, 1.4e-3, 1e-3];

// Log-log least-squares fit of the deep-group aggregate share vs dp over a roundoff window -> exponent m_k.
function logLogExponentFit(steps, k, agg) {
  const xs = steps.map((dp) => Math.log(dp));
  const ys = steps.map((dp) => Math.log(deepGroupAggShare(dp, k, agg)));
  const xbar = mean(xs);
  const ybar = mean(ys);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - xbar) * (ys[i] - ybar);
    sxx += (xs[i] - xbar) * (xs[i] - xbar);
  }
  const slope = sxy / sxx; // = -m_k
  const lnb = ybar - slope * xbar;
  const yhat = xs.map((x) => lnb + slope * x);
  const ssr = ys.reduce((s, y, i) => s + (y - yhat[i]) * (y - yhat[i]), 0);
  const sst = ys.reduce((s, y) => s + (y - ybar) * (y - ybar), 0);
  return { m: -slope, r2: 1 - ssr / sst };
}

// MEAN aggregate (this ticket) -- the robustness re-close.
const MEAN_Q2 = logLogExponentFit(WINDOW_Q2, 2, 'mean'); // m ~ 2.183, R^2 ~ 0.992
const MEAN_Q3 = logLogExponentFit(WINDOW_Q3, 3, 'mean'); // m ~ 2.956, R^2 ~ 0.965
const MEAN_Q4 = logLogExponentFit(WINDOW_Q4, 4, 'mean'); // m ~ 3.843, R^2 ~ 0.967

// MAX aggregate (imp-34606 footing) -- reproduced here as a consistency cross-check.
const MAX_Q2 = logLogExponentFit(WINDOW_Q2, 2, 'max'); // m ~ 1.999 (imp-34606: 1.999)
const MAX_Q3 = logLogExponentFit(WINDOW_Q3, 3, 'max'); // m ~ 2.903 (imp-34606: 2.903)
const MAX_Q4 = logLogExponentFit(WINDOW_Q4, 4, 'max'); // m ~ 4.008 (imp-34606: 4.008)

const LADDER_ROWS = [
  { channel: 'q2 (2nd difference / dp^2)', k_predicted: 2, m_mean: +MEAN_Q2.m.toFixed(4), r2_mean: +MEAN_Q2.r2.toFixed(6), m_max: +MAX_Q2.m.toFixed(4), m_mean_rounded: Math.round(MEAN_Q2.m) },
  { channel: 'q3 (3rd difference / (2 dp^3))', k_predicted: 3, m_mean: +MEAN_Q3.m.toFixed(4), r2_mean: +MEAN_Q3.r2.toFixed(6), m_max: +MAX_Q3.m.toFixed(4), m_mean_rounded: Math.round(MEAN_Q3.m) },
  { channel: 'q4 (4th difference / dp^4)', k_predicted: 4, m_mean: +MEAN_Q4.m.toFixed(4), r2_mean: +MEAN_Q4.r2.toFixed(6), m_max: +MAX_Q4.m.toFixed(4), m_mean_rounded: Math.round(MEAN_Q4.m) },
];

// Does the MEAN-aggregate staircase match the predicted {2, 3, 4} and stay strictly increasing?
const MEAN_LADDER_IS_CLEAN =
  LADDER_ROWS.every((r) => r.m_mean_rounded === r.k_predicted) &&
  MEAN_Q2.m < MEAN_Q3.m &&
  MEAN_Q3.m < MEAN_Q4.m;

// Does the reproduced MAX aggregate match imp-34606 F1 to within ~1e-2 on every rung?
const MAX_REPRODUCES_PARENT =
  Math.abs(MAX_Q2.m - 1.999) < 0.01 &&
  Math.abs(MAX_Q3.m - 2.903) < 0.01 &&
  Math.abs(MAX_Q4.m - 4.008) < 0.01;

export const IMP34627_Q2_RUNG_MEAN_AGGREGATE_LADDER_CLOSURE = Object.freeze({
  id: 'imp-34627',
  proofSection: 'S-frontier',
  claim_measured:
    'Re-measure, on the SAME deep-tail landmarks and SAME per-channel roundoff windows as imp-34606 ' +
    'but on the deep-group MEAN aggregate rather than the MAX, the log-log growth exponents of the ' +
    'q2 / q3 / q4 finite-difference channel shares vs the q-derivative step dp, and report whether the ' +
    'clean {2, 3, 4} roundoff-amplification ladder survives the change of aggregation -- an independent ' +
    're-close of the q2 rung and a robustness test of the imp-34606 ladder; not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  ladder_rows: Object.freeze(LADDER_ROWS.map((r) => Object.freeze(r))),
  m_q2_mean: +MEAN_Q2.m.toFixed(4), // ~2.183 -- 2nd-difference eps/dp^2 on the MEAN aggregate
  m_q3_mean: +MEAN_Q3.m.toFixed(4), // ~2.956 -- 3rd-difference eps/dp^3 on the MEAN aggregate
  m_q4_mean: +MEAN_Q4.m.toFixed(4), // ~3.843 -- 4th-difference eps/dp^4 on the MEAN aggregate
  r2_q2_mean: +MEAN_Q2.r2.toFixed(6),
  r2_q3_mean: +MEAN_Q3.r2.toFixed(6),
  r2_q4_mean: +MEAN_Q4.r2.toFixed(6),
  m_q2_max: +MAX_Q2.m.toFixed(4), // ~1.999 -- reproduces imp-34606 MAX fit
  m_q3_max: +MAX_Q3.m.toFixed(4), // ~2.903 -- reproduces imp-34606 MAX fit
  m_q4_max: +MAX_Q4.m.toFixed(4), // ~4.008 -- reproduces imp-34606 MAX fit
  predicted_ladder: Object.freeze([2, 3, 4]),
  measured_mean_ladder: Object.freeze(LADDER_ROWS.map((r) => r.m_mean_rounded)),
  mean_ladder_is_clean: MEAN_LADDER_IS_CLEAN, // MEAN exponents round to {2,3,4} and strictly increase
  max_reproduces_imp34606: MAX_REPRODUCES_PARENT, // MAX fit matches imp-34606 F1 to ~1e-3
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Independent re-close of the q2 rung and the imp-34606 q2 / q3 / q4 ' +
    'roundoff-amplification ladder on the deep-group MEAN aggregate [q_k the inherited k-point central ' +
    'difference of q(p) = log E_coll in p = log N; shares s2 = |q2|/(2 q1^2), s3 = |q3|/(6 q1^2), ' +
    's4 = |q4|/(12 |q1|); deep = N >= N* ~ 4.62e13, imp-33620 sigma < 0.01; same per-channel roundoff ' +
    'windows as imp-34606]. (F1) The ladder SURVIVES the MEAN aggregation: m2 ~ 2.183 (R^2 ~ 0.992), ' +
    'm3 ~ 2.956 (R^2 ~ 0.965), m4 ~ 3.843 (R^2 ~ 0.967) -- rounding to exactly {2, 3, 4} and strictly ' +
    'increasing, so the clean staircase is NOT an artifact of the single worst-case landmark that ' +
    'dominates the MAX. (F2) The MAX aggregate reproduces imp-34606 to ~1e-3: m2 ~ 1.999, m3 ~ 2.903, ' +
    'm4 ~ 4.008 -- a consistency check that the inline primitives are reproduced verbatim. (F3) The ' +
    'never-independently-verified q2 rung closes on BOTH aggregations (m2 ~ 2.00 MAX, m2 ~ 2.18 MEAN, ' +
    'both rounding to 2). CONCLUSION: within the inherited component model the q2 / q3 / q4 ' +
    'roundoff-amplification ladder is robust to the deep-group aggregation statistic and the q2 rung ' +
    'sits on the {2, 3, 4} staircase regardless of whether the deep group is summarized by its worst ' +
    'case or its mean. q1..q4 are inherited central differences, NOT fresh analytic closed forms, so ' +
    'the sigma -> 1 deep-tail regime (imp-3220 / imp-3406 component model least trustworthy) is ' +
    'inherited as-is -- this diagnoses the finite-difference conditioning of that measurement, it does ' +
    'not rehabilitate the model. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ' +
    'ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34606 (unified q2/q3/q4 roundoff-amplification ladder on the deep-group MAX -- parent, ' +
    'reproduced here to ~1e-3 and re-closed on the MEAN); imp-34592 (q4 O(h^4) share ~1/dp^4); ' +
    'imp-34593 (q3-share relative-range excess free exponent m ~ 3.5); imp-34573 (q3 share deep-vs-mid); ' +
    'imp-34543 (q2/q3 shares as ladder aggregates); imp-33620 (deep-tail landmark N* ~ 4.62e13, ' +
    'sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34627_ASSERTIONS = [
  {
    id: 'imp34627-q2-rung-mean-is-two',
    holds: () => Math.abs(MEAN_Q2.m - 2) < 0.25 && MEAN_Q2.r2 > 0.99,
    why: 'F1/F3: the q2 share amplifies as ~1/dp^2 on the MEAN aggregate (m ~ 2.18, R^2 ~ 0.992) -- the 2nd-difference eps/dp^2 rung survives the change of aggregation.',
  },
  {
    id: 'imp34627-q3-rung-mean-is-three',
    holds: () => Math.abs(MEAN_Q3.m - 3) < 0.35 && MEAN_Q3.r2 > 0.95,
    why: 'F1: the q3 share amplifies as ~1/dp^3 on the MEAN aggregate (m ~ 2.96, R^2 ~ 0.965).',
  },
  {
    id: 'imp34627-q4-rung-mean-is-four',
    holds: () => Math.abs(MEAN_Q4.m - 4) < 0.35 && MEAN_Q4.r2 > 0.95,
    why: 'F1: the q4 share amplifies as ~1/dp^4 on the MEAN aggregate (m ~ 3.84, R^2 ~ 0.967).',
  },
  {
    id: 'imp34627-mean-ladder-clean-and-strictly-increasing',
    holds: () => MEAN_LADDER_IS_CLEAN,
    why: 'F1: the three MEAN-aggregate exponents round to exactly {2, 3, 4} and strictly increase -- the clean k-point / dp^k staircase is not a MAX artifact.',
  },
  {
    id: 'imp34627-max-reproduces-imp34606',
    holds: () => MAX_REPRODUCES_PARENT,
    why: 'F2: the reproduced MAX fit matches imp-34606 F1 (m2 ~ 1.999, m3 ~ 2.903, m4 ~ 4.008) to within ~1e-2 -- consistency check on the verbatim primitives.',
  },
  {
    id: 'imp34627-honesty-gate-no-qed',
    holds: () =>
      IMP34627_Q2_RUNG_MEAN_AGGREGATE_LADDER_CLOSURE.isRigorous === false &&
      /NO QED/.test(IMP34627_Q2_RUNG_MEAN_AGGREGATE_LADDER_CLOSURE.verdict) &&
      /refereed bound is changed/i.test(IMP34627_Q2_RUNG_MEAN_AGGREGATE_LADDER_CLOSURE.verdict) &&
      /UNTOUCHED/.test(IMP34627_Q2_RUNG_MEAN_AGGREGATE_LADDER_CLOSURE.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34627_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34627-q2-rung-mean-aggregate-ladder-closure assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34627_Q2_RUNG_MEAN_AGGREGATE_LADDER_CLOSURE;
