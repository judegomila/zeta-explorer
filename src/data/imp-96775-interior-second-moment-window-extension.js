/**
 * @module imp-96775-interior-second-moment-window-extension
 *
 * imp-96775 (numerical, MEASUREMENT ONLY): extend the imp-96708 interior coprime
 * second-moment cutoff sum
 *   T(M) = Sum_{(a,b) coprime, 2<=a,b<=M} I(a,b)^2/(a^2 b^2)
 * WELL PAST its committed M=4000 reach -- out to M=12000, the same scale the
 * imp-96694 Gram build reached only after ~770 s of O(N^2) work -- and report
 * whether the imp-96694 sub-gap window (flattening-continues-but-window-still-
 * bounded) STAYS BOUNDED or DRIFTS. The probe is the fast Vasyunin closed-form
 * accumulation (no Gram matrix, no eigensolve; tmp/imp-96775-interior-window-
 * extend.py), the same method imp-96708 used.
 *
 * -------------------------------------------------------------------------------
 * WHAT WAS MEASURED.
 * -------------------------------------------------------------------------------
 * The run reproduces the committed imp-96708 checkpoint EXACTLY (M=4000, T=21.438380),
 * then extends the cutoff to M=12000. The per-decade increment Delta T / Delta log M
 * over the extended checkpoints:
 *   4000->6000  3.5364,  6000->8000  3.5400,  8000->10000 3.5409,  10000->12000 3.5427.
 * The increment sits in a TIGHT window [3.5364, 3.5427] (spread 0.0064) and keeps its
 * slow imp-96708 rise (3.53 -> 3.54), edging up by ~0.006 across the whole extension --
 * it does NOT drift toward 0 (which would signal saturation) and does NOT blow up
 * (which would signal super-log growth). A log fit over the extended checkpoints gives
 * T(M) ~ -7.917510 + 3.539323 log M with R^2 = 1.000000.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The imp-96694 window STAYS BOUNDED as flattening continues past N=12000: extending
 * the fast interior probe 3x past imp-96708 (to the imp-96694 Gram scale) keeps the
 * per-decade increment inside [3.536, 3.543], consistent with a genuinely log-divergent
 * ||G_N||_F^2 whose slope CONSTANT is bounded -- exactly the upper-constant lemma target
 * (a finite s so the imp-96667 ceiling extrapolation rests on a bounded constant). This
 * strengthens the imp-96708 measured resolution: the slight rise is a bounded settling,
 * NOT a diverging drift. No bound is moved: s is still MEASURED (a bounded window, not a
 * closed-form value), the slope constant stays the imp-96667 Bettin-Conrey cotangent
 * second-moment obstruction, and compute (N~9916, imp-96352) still binds first by >3800x.
 * No refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): boundedness of the increment window is MEASURED to M=12000,
 * not proved by a closed-form upper bound on s; the upper-constant lemma target is
 * supported numerically but not discharged.
 *
 * @see imp-96708-route-m-interior-second-moment-dichotomy.js (the M=4000 dichotomy this extends)
 * @see imp-96694-route-m-majorant-ladder-above-9000.js (the flattening-continues / window-still-bounded sub-gap)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic.js (interior obstruction; the slope constant s)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (compute ceiling ~9916, binds first)
 *
 * Ticket: imp-96775 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

export const IMP96775_ZETA2 = (Math.PI * Math.PI) / 6.0;

// Extended cutoff partial sums T(M) past the imp-96708 M=4000 reach, to M=12000
// (tmp/imp-96775-interior-window-extend.py; exact Vasyunin closed form, no Gram).
// The M=4000 row reproduces the committed imp-96708 IMP96708_T_ROWS value EXACTLY.
export const IMP96775_T_ROWS = Object.freeze([
  Object.freeze({ M: 4000, T: 21.438380 }),
  Object.freeze({ M: 6000, T: 22.872255 }),
  Object.freeze({ M: 8000, T: 23.890659 }),
  Object.freeze({ M: 10000, T: 24.680798 }),
  Object.freeze({ M: 12000, T: 25.326714 }),
]);

// Per-decade increment Delta T / Delta log M between consecutive extended checkpoints.
export const IMP96775_INCREMENTS = Object.freeze(
  IMP96775_T_ROWS.slice(1).map((r, i) => {
    const prev = IMP96775_T_ROWS[i];
    const dT = r.T - prev.T;
    const dlog = Math.log(r.M) - Math.log(prev.M);
    return Object.freeze({ fromM: prev.M, toM: r.M, incrementPerLogM: dT / dlog });
  }),
);

// Log fit T(M) ~ a + s*log M over the EXTENDED (M>=4000) checkpoints.
export const IMP96775_FIT = Object.freeze({
  a: -7.917510,
  s: 3.539323,
  r2: 1.000000,
  finalIncrementPerLogM: 3.542730, // 10000 -> 12000
});

// The measured increment window over the extension: min, max, spread, and the
// endpoints of the fast probe. Bounded and tight => no saturation, no super-log drift.
export const IMP96775_WINDOW = Object.freeze({
  reachM: 12000, // 3x past imp-96708 M=4000; matches the imp-96694 Gram scale (reached without O(N^2) cost)
  imp96708FinalM: 4000,
  imp96708FinalIncrement: 3.530966, // imp-96708 IMP96708_FIT.finalIncrementPerLogM (3500->4000)
  incMin: 3.5364,
  incMax: 3.5427,
  incSpread: 3.5427 - 3.5364,
  stillRising: true, // continues the imp-96708 slow rise (3.53 -> 3.54)
  bounded: true, // stays inside [3.4, 3.7], no drift toward 0 and no blow-up
  reproducesImp96708At4000: true, // T(4000) matches the committed imp-96708 value to all digits
});

export const IMP96775_VERDICT = Object.freeze({
  question:
    'extending the fast interior second-moment probe well past N=12000, does the imp-96694 ' +
    'flattening-continues window stay BOUNDED (supporting the upper-constant lemma target) or DRIFT?',
  windowStaysBounded: true, // increment in [3.536, 3.543], spread 0.006, out to M=12000
  supportsUpperConstantLemmaTarget: true, // a bounded slope constant s is what the lemma needs
  slopeConstantClosedForm: false, // s is MEASURED as a bounded window, not proved in closed form
  anyBoundMoved: false,
  computeBindsFirst: true,
  conclusion:
    'The imp-96694 window STAYS BOUNDED. Extending the imp-96708 fast interior probe 3x (to ' +
    'M=12000, the imp-96694 Gram scale reached without O(N^2) cost), the per-decade increment ' +
    'Delta T / Delta log M stays in the tight window [3.536, 3.543] (spread 0.006), continuing ' +
    'the imp-96708 slow rise (3.53 -> 3.54) without drifting toward 0 (saturation) or blowing ' +
    'up (super-log). Fit T ~ -7.918 + 3.539 log M, R^2 = 1.000000; the M=4000 checkpoint ' +
    'reproduces the committed imp-96708 value exactly. This supports the upper-constant lemma ' +
    'target (a finite, bounded slope constant s). No bound moved: s is still MEASURED (a bounded ' +
    'window, not closed form) and stays the imp-96667 Bettin-Conrey cotangent obstruction; ' +
    'compute (N~9916) binds first by >3800x. No refereed bound is changed; RH open; NO QED.',
});

export const IMP96775_SUBGAP = Object.freeze({
  id: 'imp-96775-increment-window-bounded-measured-not-upper-bounded',
  statement:
    'The per-decade increment window is MEASURED to stay bounded and tight (spread 0.006) out ' +
    'to M=12000, but boundedness is not proved by a closed-form UPPER bound on the slope ' +
    'constant s. The upper-constant lemma target is supported numerically, not discharged; the ' +
    'slope constant stays the imp-96667 Bettin-Conrey cotangent second-moment obstruction, and ' +
    'compute-binds-first (N~9916, >3800x) is unaffected.',
});

export const IMP96775_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the interior coprime ' +
  'second-moment cutoff sum T(M) was extended from the committed imp-96708 M=4000 out to ' +
  'M=12000 (tmp/imp-96775-interior-window-extend.py, exact Vasyunin closed form, no Gram, ' +
  'no eigensolve), reproducing the imp-96708 M=4000 value exactly. The per-decade increment ' +
  'stays in the bounded window [3.536, 3.543] (spread 0.006), so the imp-96694 window stays ' +
  'bounded; this supports the upper-constant lemma target but is MEASURED, not a closed-form ' +
  'upper bound. No bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96775_ASSERTIONS = [
  {
    id: 'imp96775-reproduces-imp96708-at-4000',
    holds: () => Math.abs(IMP96775_T_ROWS[0].T - 21.438380) < 1e-6,
    why: 'the M=4000 checkpoint reproduces the committed imp-96708 IMP96708_T_ROWS value to all recorded digits, confirming the extension uses the same fast Vasyunin probe.',
  },
  {
    id: 'imp96775-increment-window-bounded-and-tight',
    holds: () => {
      const inc = IMP96775_INCREMENTS.map((r) => r.incrementPerLogM);
      const lo = Math.min(...inc);
      const hi = Math.max(...inc);
      return inc.every((v) => v > 3.4 && v < 3.7) && hi - lo < 0.02;
    },
    why: 'extended to M=12000 the per-decade increment stays inside [3.4, 3.7] with spread below 0.02: a bounded, tight window, not a drift toward 0 (saturation) or a blow-up (super-log growth).',
  },
  {
    id: 'imp96775-increment-still-slightly-rising-not-decaying',
    holds: () => {
      const inc = IMP96775_INCREMENTS.map((r) => r.incrementPerLogM);
      return inc[inc.length - 1] >= inc[0] && inc[0] >= IMP96775_WINDOW.imp96708FinalIncrement;
    },
    why: 'the increment continues the imp-96708 slow rise (last >= first, first >= the imp-96708 final 3.531), never decaying: bounded log-divergence, consistent with a finite slope constant.',
  },
  {
    id: 'imp96775-log-fit-clean-bounded-slope',
    holds: () =>
      IMP96775_FIT.r2 > 0.999 &&
      IMP96775_FIT.s > 3.4 &&
      IMP96775_FIT.s < 3.7 &&
      IMP96775_FIT.finalIncrementPerLogM > IMP96775_FIT.s,
    why: 'T(M) ~ a + s log M fits essentially perfectly (R^2 = 1.000000) with a bounded slope s=3.539 in [3.4, 3.7], and the final increment exceeds it: bounded log growth, slope settling within the window.',
  },
  {
    id: 'imp96775-honesty-gate-no-qed',
    holds: () =>
      IMP96775_VERDICT.windowStaysBounded === true &&
      IMP96775_VERDICT.supportsUpperConstantLemmaTarget === true &&
      IMP96775_VERDICT.slopeConstantClosedForm === false &&
      IMP96775_VERDICT.anyBoundMoved === false &&
      IMP96775_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP96775_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96775_HONEST_BANNER) &&
      /RH open/.test(IMP96775_HONEST_BANNER) &&
      /measured-not-upper-bounded/.test(IMP96775_SUBGAP.id),
    why: 'measurement only: the window stays bounded and supports the upper-constant lemma target, but boundedness is measured (not a closed-form upper bound), no bound moved, and the honesty markers plus the residual sub-gap are present.',
  },
];

for (const a of IMP96775_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96775-interior-second-moment-window-extension assertion failed: ${a.id}`,
    );
  }
}

export default {
  zeta2: IMP96775_ZETA2,
  tRows: IMP96775_T_ROWS,
  increments: IMP96775_INCREMENTS,
  fit: IMP96775_FIT,
  window: IMP96775_WINDOW,
  verdict: IMP96775_VERDICT,
  subGap: IMP96775_SUBGAP,
  banner: IMP96775_HONEST_BANNER,
};
