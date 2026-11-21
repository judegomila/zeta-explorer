/**
 * @fileoverview imp-97115 -- MEASUREMENT: tightness of the imp-97100 closed-form monotone sigma_2(t)
 * majorant vs the exact sigma_2 on the Krein Rayleigh tail, confirming the EASY factor sigma_2 is NOT the
 * tail-majorant obstruction (the obstruction is entirely the HARD factor |g(t)|^2 phase cancellation).
 *
 * CONTEXT. imp-97100 split the Rayleigh-tail integrand sigma_2(t) |g(t)|^2 (g = v0 . Phih) into an EASY
 * factor and a HARD factor. The EASY factor
 *   sigma_2(t) = (t^2 + 1/4)^2 w1(t),   w1(t) = 2 theta'(t) - sqrt(2) ln2 cos(t ln2),
 *   2 theta'(t) = Re psi(1/4 + i t/2) - ln pi,
 * was asserted to have a rigorous closed-form monotone majorant, via the digamma Stirling asymptotic
 * (Re psi(1/4 + i t/2) = ln|1/4 + i t/2| + R, |R| <= c/t^2, |1/4 + i t/2| <= (t + 1/2)/2) and the trivial
 * cosine bound cos >= -1:
 *   w1(t)      <= ln((t + 1/2)/2) - ln pi + sqrt(2) ln2 + c/T^2,
 *   sigma_2(t) <= (t^2 + 1/4)^2 [ ln((t+1/2)/2) - ln pi + sqrt(2) ln2 + c/T^2 ]   (t >= T),
 * and imp-97100 claimed sigma_2 has "NO delicate content", i.e. it is not the obstruction. That EASY/HARD
 * split claim was never numerically checked for tightness. THIS LEAF MEASURES the pointwise ratio of the
 * closed-form majorant to the exact sigma_2 across the tail t >= T for T in {4800, 6400, 9600}.
 *
 * THE RATIO IS PURELY THE w1 FACTOR. The common (t^2 + 1/4)^2 prefactor CANCELS in the ratio, so
 *   majorant(t) / exact(t) = majW1(t) / exactW1(t),   independent of the t^4 prefactor.
 * The exact w1 is evaluated from the digamma asymptotic (for t >= 4800, |1/4 + i t/2| >= 2400, so the
 * series psi(z) = ln z - 1/(2z) - 1/(12 z^2) + 1/(120 z^4) - ... is exact to ~1e-14 with a handful of terms;
 * only the real part enters). The tail [T, 4T] is sampled at dt = 0.05 to resolve the cos(t ln2) oscillation
 * (period 2 pi / ln2 ~ 9.06).
 *
 * MEASURED SLACK (this leaf). At every T the ratio oscillates with cos(t ln2):
 *   - MIN ~ 1.0000 (when cos = -1, exact w1 is maximal and the majorant nearly coincides -- the only residual
 *     slack is ln((t+1/2)/2) - ln|1/4 + i t/2|, a ~1/t correction, plus c/T^2 ~ 1e-9);
 *   - MAX ~ 1.35 -> 1.31 as T grows (when cos = +1, exact w1 minimal, the cosine bound loads its full
 *     2 sqrt(2) ln2 ~ 1.96 swing on a w1 baseline ~ ln(t/2) - ln pi that GROWS with T, so the RELATIVE slack
 *     shrinks with T);
 *   - MEAN ~ 1.14 -> 1.13.
 * The digamma-remainder term c/T^2 (c = 1/12 nominal) is ~1e-9, utterly negligible; the entire O(1) slack is
 * the trivial cosine bound cos >= -1. The worst multiplicative slack across all three rungs is ~1.35x, i.e.
 * log10 ~ 0.13 -- a fraction of ONE order of magnitude.
 *
 * VERDICT. The closed-form sigma_2 majorant is tight to a small O(1) multiplicative factor (<= ~1.35x, mean
 * ~1.14x, shrinking with T), dominated by the trivial cos >= -1 bound, with the digamma Stirling remainder
 * negligible (~1e-9). Against the ~15-ORDER (~10^15) looseness that the phase cancellation in |g(t)|^2 must
 * recover (imp-96888/imp-96973/imp-97100), a <0.13-order EASY-factor slack is negligible. This CONFIRMS
 * imp-97100: sigma_2 is NOT the tail-majorant obstruction; the obstruction is entirely the HARD factor
 * |g(t)|^2 inter-mode phase cancellation (SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL).
 *
 * MEASUREMENT ONLY. No solver run; exact w1 evaluated from the standard digamma asymptotic; no interval
 * majorant is produced or claimed; the Rayleigh floor stays an UPPER bound on lambda_min; establishes NO
 * operator positivity; changes NO bound; IMP96888_RAYLEIGH_TAIL_MAJORANT and IMP97100_PHASE_CANCELLATION_TRIAL
 * stay open; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (EASY/HARD split; sigma_2 majorant form)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (min-max Rayleigh bound + T-ladder)
 */

const LN2 = Math.log(2);
const LNPI = Math.log(Math.PI);
const S2L2 = Math.SQRT2 * LN2; // sqrt(2) ln2 ~ 0.9803 (cosine-bound amplitude)
const T_LADDER = [4800, 6400, 9600];
const C_STIRLING = 1 / 12; // nominal rigorous digamma Stirling-remainder constant; c/T^2 ~ 1e-9 (negligible)

// Re psi(1/4 + i t/2) from the digamma asymptotic; exact to ~1e-14 for t >= 4800 (|z| >= 2400).
// psi(z) = ln z - 1/(2z) - 1/(12 z^2) + 1/(120 z^4) - ...  with z = x + i y, x = 1/4, y = t/2.
function rePsi(t) {
  const x = 0.25;
  const y = t / 2;
  const r2 = x * x + y * y;
  const t0 = 0.5 * Math.log(r2); // Re ln z = ln|z|
  const t1 = -x / (2 * r2); // -Re(1/(2z))
  const t2 = -(x * x - y * y) / (12 * r2 * r2); // -Re(1/(12 z^2))
  const t4 = (x ** 4 - 6 * x * x * y * y + y ** 4) / (120 * r2 ** 4); // +Re(1/(120 z^4))
  return t0 + t1 + t2 + t4;
}
// exact w1(t) and the imp-97100 closed-form majorant on w1 (the (t^2+1/4)^2 prefactor cancels in the ratio)
function exactW1(t) {
  return rePsi(t) - LNPI - S2L2 * Math.cos(t * LN2);
}
function majW1(t, T) {
  return Math.log((t + 0.5) / 2) - LNPI + S2L2 + C_STIRLING / (T * T);
}

// per-rung ratio statistics across the sampled tail [T, 4T] at dt = 0.05
export const IMP97115_ROWS = Object.freeze(
  Object.fromEntries(
    T_LADDER.map((T) => {
      const tEnd = 4 * T;
      const dt = 0.05;
      let rmin = Infinity;
      let rmax = -Infinity;
      let sum = 0;
      let n = 0;
      for (let t = T; t <= tEnd; t += dt) {
        const r = majW1(t, T) / exactW1(t);
        if (r < rmin) rmin = r;
        if (r > rmax) rmax = r;
        sum += r;
        n += 1;
      }
      // analytic worst case: cos(t ln2) = +1 (exact w1 minimal) evaluated at t = T (smallest ln|z| baseline)
      const worstAtT = majW1(T, T) / (rePsi(T) - LNPI - S2L2);
      return [
        T,
        Object.freeze({
          ratioMin: rmin, // ~1.0000 (cos = -1: majorant nearly coincides with exact)
          ratioMax: rmax, // ~1.35 -> 1.31 (cos = +1: full cosine-bound swing, shrinks with T)
          ratioMean: sum / n, // ~1.14 -> 1.13
          worstCaseAtT: worstAtT, // analytic cos=+1 worst case at t=T
          cOverT2: C_STIRLING / (T * T), // Stirling-remainder contribution (~1e-9, negligible)
          samples: n,
        }),
      ];
    }),
  ),
);

export const IMP97115_VERDICT = Object.freeze({
  ticket: 'imp-97115',
  question:
    'measure the pointwise ratio of the imp-97100 closed-form monotone sigma_2 majorant to the exact sigma_2 across the Krein Rayleigh tail (T in {4800,6400,9600}) to quantify the EASY-bound slack and confirm sigma_2 is NOT the tail-majorant obstruction.',
  answer:
    'the (t^2+1/4)^2 prefactor cancels, so majorant/exact = majW1/exactW1. The ratio oscillates with cos(t ln2): MIN ~ 1.0000 (cos = -1, majorant nearly coincides), MAX ~ 1.35 at T=4800 falling to ~1.31 at T=9600 (cos = +1, full cosine-bound swing on a growing ln(t/2) baseline), MEAN ~ 1.14 -> 1.13. The digamma Stirling remainder c/T^2 ~ 1e-9 is negligible; the entire O(1) slack is the trivial cos >= -1 bound. The worst multiplicative slack is ~1.35x (log10 ~ 0.13), a fraction of ONE order -- negligible against the ~15-order looseness that |g(t)|^2 phase cancellation must recover. CONFIRMS sigma_2 is NOT the obstruction; the obstruction is the HARD factor |g(t)|^2 (SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL).',
  worstSlackFactor: Math.max(...T_LADDER.map((T) => IMP97115_ROWS[T].ratioMax)), // ~1.346
  worstSlackLog10: Math.log10(Math.max(...T_LADDER.map((T) => IMP97115_ROWS[T].ratioMax))), // ~0.129
  phaseCancellationGapOrders: 15, // the ~10^15 looseness the HARD factor recovers (imp-96888/imp-97100)
  slackShrinksWithT: true, // relative cosine-bound slack decreases as ln(t/2) baseline grows
  stirlingRemainderNegligible: true, // c/T^2 ~ 1e-9 across all rungs
  sigma2IsNotObstruction: true, // confirms imp-97100 EASY/HARD split claim
  intervalMajorantProduced: false, // MEASUREMENT ONLY
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  rayleighTailMajorantOpen: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays open
  phaseCancellationTrialOpen: true, // IMP97100_PHASE_CANCELLATION_TRIAL stays open
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97115_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97115_ASSERTIONS = [
  {
    id: 'imp97115-ratio-bounded-small-slack',
    holds: () =>
      T_LADDER.every((T) => {
        const r = IMP97115_ROWS[T];
        return r.ratioMin >= 1 && r.ratioMin < 1.001 && r.ratioMax > 1.2 && r.ratioMax < 1.4;
      }),
    why: 'majorant/exact is a pure w1 ratio (prefactor cancels): MIN ~ 1.0000 at cos = -1, MAX ~ 1.31-1.35 at cos = +1 -- a small O(1) multiplicative slack, tight enough that sigma_2 is not delicate.',
  },
  {
    id: 'imp97115-slack-shrinks-with-T',
    holds: () =>
      IMP97115_ROWS[4800].ratioMax > IMP97115_ROWS[6400].ratioMax &&
      IMP97115_ROWS[6400].ratioMax > IMP97115_ROWS[9600].ratioMax &&
      Math.abs(IMP97115_ROWS[4800].ratioMax - 1.3465) < 1e-2 &&
      Math.abs(IMP97115_ROWS[9600].ratioMax - 1.3086) < 1e-2,
    why: 'the cosine-bound swing 2 sqrt(2) ln2 is fixed but the w1 baseline ln(t/2) - ln pi grows with T, so the relative worst-case slack decreases monotonically (1.35x -> 1.31x).',
  },
  {
    id: 'imp97115-stirling-remainder-negligible',
    holds: () => T_LADDER.every((T) => IMP97115_ROWS[T].cOverT2 > 0 && IMP97115_ROWS[T].cOverT2 < 1e-8),
    why: 'the digamma Stirling remainder c/T^2 (c = 1/12) is ~1e-9 at every rung -- the O(1) slack is entirely the trivial cos >= -1 bound, not the asymptotic remainder.',
  },
  {
    id: 'imp97115-slack-negligible-vs-phase-gap',
    holds: () =>
      IMP97115_VERDICT.worstSlackLog10 < 0.15 &&
      IMP97115_VERDICT.phaseCancellationGapOrders >= 15 &&
      IMP97115_VERDICT.sigma2IsNotObstruction === true &&
      IMP97115_VERDICT.stirlingRemainderNegligible === true,
    why: 'the worst EASY-factor slack is log10 ~ 0.13 (a fraction of one order), negligible against the ~15-order looseness the HARD factor |g|^2 phase cancellation must recover -- confirming sigma_2 is not the obstruction.',
  },
  {
    id: 'imp97115-measurement-only-no-qed',
    holds: () =>
      IMP97115_VERDICT.intervalMajorantProduced === false &&
      IMP97115_VERDICT.operatorPositivityProved === false &&
      IMP97115_VERDICT.rayleighTailMajorantOpen === true &&
      IMP97115_VERDICT.phaseCancellationTrialOpen === true &&
      IMP97115_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97115_VERDICT.qed === false,
    why: 'measurement done (ratio quantified, slack negligible), but NO interval majorant produced, no operator positivity, Rayleigh/phase-cancellation gaps open, reach stays 2a<=0.96, no QED.',
  },
];

for (const a of IMP97115_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97115-krein-sigma2-majorant-tightness assertion failed: ${a.id}`);
  }
}
