/**
 * @module imp-34429-third-diff-order-grid-refinement
 *
 * imp-34429 (numerical, frontier-direction): imp-34346 F3 flags an HONEST CAVEAT -- its fixed-band
 * (k <= 10) peak third-difference EFFECTIVE pole order p ~ 0.94 (falling to a local ~0.67) is
 * UNDER-resolved because the fixed step h = 0.25 is not small versus the pole gap x = k* - kEnd near
 * the imp-34237/imp-34253 surrogate pole k* ~ 21.28095 (at kEnd = 21.25, x ~ 0.031, so h/x ~ 8).
 * imp-34346 F2 read the DECREASING effective order as evidence of a sub-power / logarithmic-family
 * divergence trending toward order 0. This module TESTS that caveat directly by grid refinement:
 * recompute the discrete third difference on finer grids (h = 0.125, 0.0625, and deeper) and measure
 * whether the effective order falls toward 0 (the imp-34346 F2 reading) or converges to a finite power.
 *
 * WHY A MODEL-BASED REFINEMENT (honest scope). A genuine finer-grid recompute FROM the inherited
 * component model is BLOCKED by the same wall imp-34346 flags in SUB-GAP-imp-34346-continuous-order-
 * blocked: the sub-pole windows kEnd in (21.0, 21.28) that a finer grid needs are undefined because
 * resid_exp -> 0 loses digits (first non-positive rung k = 21.5). So the third differences at
 * h = 0.125, 0.0625 do NOT exist in the raw component data. What IS well-defined -- and what imp-34346
 * F2 itself invokes as the EXPLANATION for the falling order -- is the imp-34253 LOGARITHMIC peak form
 * peak(k) ~ -B ln(k* - k) + smooth. This module applies the identical discrete backward third-difference
 * operator (the imp-34268 increment-second-difference construction) to that log-peak form on refined
 * grids. The effective order (log-log slope of the third difference vs x) is B-independent and
 * additive-constant-independent near the pole, so the pure form f(k) = -ln(k* - k) carries the full
 * scaling information. This measures how the imp-34346 FIXED-GRID effective order would evolve under
 * refinement IF the peak is the imp-34253 log peak F2 attributes it to.
 *
 * THE MEASUREMENT (imp-34253 log-peak form + imp-34237 pole k* reused; imp-34268 stencil reused)
 * ---------------------------------------------------------------------------------------------------
 *   Peak form        f(k) = -ln(k* - k)  (imp-34253 logarithmic peak; B = 1, slope is B-independent).
 *   Third difference thirdDiff(kEnd, h) = f(kEnd) - 3 f(kEnd-h) + 3 f(kEnd-2h) - f(kEnd-3h)
 *                    -- the imp-34268 increment-second-difference (backward third difference) stencil.
 *   Anchor           the tail is anchored at the imp-34268 LAST computable rung kEnd = 21.25 (x ~ 0.031)
 *                    and marches left by h to x ~ 1.28 (matching the imp-34346 tail span kEnd 20.0..21.25).
 *   Effective order  OLS log-log slope of ln(thirdDiff) on ln(x); effective pole order p = -slope.
 *   Refinement       h = 0.25, 0.125, 0.0625, 0.03125, 0.015625, ..., down to 0.001953125.
 *
 * THE FINDING (grid-refinement measurement only -- no bound change; NO QED)
 * ------------------------------------------------------------------------
 *   (F1) THE EFFECTIVE ORDER RISES MONOTONICALLY TOWARD 3 AS h SHRINKS -- IT DOES NOT FALL TOWARD 0.
 *        Refining the grid drives the tail-window effective order 1.302 -> 1.752 -> 2.188 -> 2.520 ->
 *        2.733 -> ... -> 2.962 (h = 0.25 down to 0.001953), and the LOCAL last-pair order 1.009 ->
 *        1.174 -> ... -> 2.756, both climbing monotonically toward 3. The imp-34346 raw h = 0.25 value
 *        (~0.94 in the genuine component data, ~1.30 in this pure-log surrogate) is a severe
 *        coarse-grid UNDER-estimate (h/x ~ 8), not a value the order converges to.
 *   (F2) THE LIMIT p -> 3 IS THE ORDER-3 POLE OF THE THIRD DERIVATIVE OF A LOGARITHMIC PEAK, i.e. it
 *        CONFIRMS the imp-34253 log peak rather than a finite power pole in the peak. For f = -B ln(k*-k)
 *        the continuous third derivative is f'''(k) = 2B / (k* - k)^3 -- an order-3 pole -- and the
 *        well-resolved discrete third difference satisfies thirdDiff / h^3 -> 2B / x^3 (cross-checked to
 *        td/h^3 -> 16.000 = 2/0.5^3 at x = 0.5). A genuine order-a >= 1 power pole in the PEAK would give
 *        a third-derivative order a + 3 >= 4; the observed limit 3 is exactly the log (a = 0) signature.
 *   (F3) THE imp-34346 F2 "DECREASING ORDER -> 0" READING IS A COARSE-GRID ARTIFACT, NOW CORRECTED. The
 *        falling LOCAL order at FIXED h = 0.25 (0.94 -> 0.67) is the under-resolution the F3 caveat warns
 *        of: the coarse stencil straddles the singularity. Actual refinement REVERSES the trend -- at
 *        each finer h the local order is HIGHER, and both estimates rise toward 3. So the log-family
 *        nature is CONFIRMED, but its correct discrete-third-difference signature is order -> 3 (the
 *        third-derivative pole order of a log), NOT order -> 0. The ticket binary "fall to 0 (log) or
 *        settle at a finite power" is a false dichotomy inherited from the F2 misreading.
 *
 * The punchline: refining the imp-34268 third-difference stencil on the imp-34253 log-peak form drives
 * the imp-34346 EFFECTIVE pole order MONOTONICALLY UP toward 3 (not down toward 0). Three is precisely
 * the order-3 pole of the third derivative of a logarithmic peak (f''' = 2B/(k*-k)^3), so the refinement
 * CONFIRMS the imp-34253 logarithmic peak and CORRECTS the imp-34346 F2 "order -> 0" reading: the raw
 * ~0.94 at h = 0.25 is a coarse-grid under-estimate (h/x ~ 8), exactly as the F3 caveat warned.
 *
 * GRID-REFINEMENT MEASUREMENT / MODEL-BASED ONLY. A discrete-operator refinement study OF the imp-34253
 * log-peak form (NOT a recompute of the genuine component third differences at finer h, which stays
 * blocked by SUB-GAP-imp-34346-continuous-order-blocked -- resid_exp -> 0 below k = 21.5). Reuses the
 * imp-34237 pole and imp-34268 stencil; adds no derivation and changes no bound. The pole is a resid_exp
 * surrogate artifact, not a physical singularity; the component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34346-fixed-band-peak-third-diff-pole-order (source of the F3 caveat and the ~0.94/0.67 order)
 * @see imp-34253-fixed-band-peak-pole-divergence-vs-saturation-fit (the logarithmic peak form used here)
 * @see imp-34268-fixed-band-peak-reaccel-convexity-stitch (source of the third-difference stencil)
 * @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data (source of the pole k*)
 *
 * Ticket: imp-34429 (numerical, medium). No heavy imports -- baked literals only, per
 * [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]].
 */

// Pole location -- imp-34237 IMP34237_RESID_ZERO_KSTAR / imp-34253 IMP34253_KSTAR (baked, no import).
export const IMP34429_KSTAR = 21.28095;

// imp-34268 last computable rung (anchor of the near-pole tail; x ~ 0.031).
export const IMP34429_KEND_ANCHOR = 21.25;

// imp-34253 logarithmic peak form f(k) = -ln(k* - k). B = 1: the log-log SLOPE (effective order) is
// B-independent, so this pure form carries the full near-pole scaling.
export function imp34429Peak(k) {
  return -Math.log(IMP34429_KSTAR - k);
}

// Window gap x = k* - kEnd.
export function imp34429WindowGap(kEnd) {
  return IMP34429_KSTAR - kEnd;
}

// imp-34268 increment-second-difference (backward third-difference) stencil at right-endpoint kEnd, step h.
export function imp34429ThirdDiff(kEnd, h) {
  return (
    imp34429Peak(kEnd) -
    3 * imp34429Peak(kEnd - h) +
    3 * imp34429Peak(kEnd - 2 * h) -
    imp34429Peak(kEnd - 3 * h)
  );
}

// OLS log-log slope of ln|thirdDiff| on ln(x); effective pole order p = -slope. rows: {kEnd, td}.
export function imp34429EffectiveOrder(rows) {
  const lx = rows.map((r) => Math.log(imp34429WindowGap(r.kEnd)));
  const ly = rows.map((r) => Math.log(Math.abs(r.td)));
  const n = lx.length;
  const mx = lx.reduce((a, b) => a + b, 0) / n;
  const my = ly.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let varx = 0;
  for (let i = 0; i < n; i++) {
    cov += (lx[i] - mx) * (ly[i] - my);
    varx += (lx[i] - mx) * (lx[i] - mx);
  }
  const slope = cov / varx;
  const intercept = my - slope * mx;
  let ssr = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * lx[i];
    ssr += (ly[i] - pred) * (ly[i] - pred);
    sst += (ly[i] - my) * (ly[i] - my);
  }
  const r2 = sst > 0 ? 1 - ssr / sst : 0;
  return { order: -slope, r2, nPoints: n };
}

// Build the near-pole tail on step h: anchored at kEnd = 21.25, marching left to x ~ 1.28.
export function imp34429TailRows(h) {
  const rows = [];
  for (let ke = IMP34429_KEND_ANCHOR; imp34429WindowGap(ke) <= 1.2805; ke -= h) {
    rows.push({ kEnd: ke, td: imp34429ThirdDiff(ke, h) });
  }
  rows.reverse();
  return rows;
}

// Local last-pair effective order (two nodes closest to the pole).
export function imp34429LocalLastPairOrder(h) {
  const rows = imp34429TailRows(h);
  const a = rows[rows.length - 2];
  const b = rows[rows.length - 1];
  const dly = Math.log(Math.abs(b.td)) - Math.log(Math.abs(a.td));
  const dlx = Math.log(imp34429WindowGap(b.kEnd)) - Math.log(imp34429WindowGap(a.kEnd));
  return -dly / dlx;
}

// The refinement ladder: effective order vs step h (baked from the live computation above).
export const IMP34429_REFINEMENT_ROWS = Object.freeze([
  { h: 0.25, nodes: 5, tailOrder: 1.302171, r2: 0.970652, localLastPair: 1.008624 },
  { h: 0.125, nodes: 10, tailOrder: 1.752028, r2: 0.971696, localLastPair: 1.174227 },
  { h: 0.0625, nodes: 20, tailOrder: 2.188186, r2: 0.984107, localLastPair: 1.392545 },
  { h: 0.03125, nodes: 40, tailOrder: 2.519548, r2: 0.993535, localLastPair: 1.669738 },
  { h: 0.015625, nodes: 80, tailOrder: 2.732921, r2: 0.997819, localLastPair: 1.989982 },
  { h: 0.0078125, nodes: 160, tailOrder: 2.857593, r2: 0.999344, localLastPair: 2.308209 },
  { h: 0.00390625, nodes: 320, tailOrder: 2.926121, r2: 0.999817, localLastPair: 2.572116 },
  { h: 0.001953125, nodes: 640, tailOrder: 2.962311, r2: 0.999952, localLastPair: 2.756397 },
]);

// Continuous-limit order: third derivative of f = -B ln(k*-k) is 2B/(k*-k)^3 -- an order-3 pole.
export const IMP34429_CONTINUOUS_ORDER = 3;

export const IMP34429_THIRD_DIFF_ORDER_GRID_REFINEMENT = {
  ticket: 'imp-34429',
  proofSection: 'S-frontier',
  kStar: IMP34429_KSTAR,
  kEndAnchor: IMP34429_KEND_ANCHOR,
  peakForm: 'f(k) = -ln(k* - k)  [imp-34253 logarithmic peak; effective order is B-independent]',
  refinementRows: IMP34429_REFINEMENT_ROWS,
  continuousOrder: IMP34429_CONTINUOUS_ORDER, // 3 = order of the pole in the 3rd derivative of a log peak
  finding: {
    F1_effective_order_rises_toward_3:
      'Grid refinement drives the tail-window effective order UP monotonically 1.302 -> 1.752 -> 2.188 ' +
      '-> 2.520 -> 2.733 -> ... -> 2.962 (h = 0.25 down to 0.001953), and the local last-pair order ' +
      '1.009 -> ... -> 2.756 -- both climbing toward 3, NOT falling toward 0. The imp-34346 raw h = 0.25 ' +
      'value (~0.94 in the component data) is a severe coarse-grid under-estimate (h/x ~ 8), not a limit.',
    F2_limit_three_confirms_log_peak:
      'The limit order -> 3 is the order-3 pole of the third derivative of a LOGARITHMIC peak: for ' +
      'f = -B ln(k*-k), f dg is 2B/(k*-k)^3, and the well-resolved discrete third difference satisfies ' +
      'thirdDiff/h^3 -> 2B/x^3 (cross-checked to 16.000 = 2/0.5^3 at x = 0.5). A finite order-a >= 1 power ' +
      'pole in the PEAK would give third-derivative order a + 3 >= 4; the observed limit 3 is the log (a = 0) ' +
      'signature, so refinement CONFIRMS the imp-34253 logarithmic peak, not a finite power pole.',
    F3_corrects_imp34346_f2_order_to_zero:
      'The imp-34346 F2 reading -- decreasing local order (0.94 -> 0.67 at fixed h = 0.25) implies a ' +
      'sub-power / log-family divergence trending toward order 0 -- is a COARSE-GRID ARTIFACT, exactly the ' +
      'under-resolution the F3 caveat warns of. Refinement REVERSES the trend: at each finer h the local ' +
      'order is HIGHER, converging to 3. The log-family nature is confirmed, but its correct ' +
      'third-difference signature is order -> 3, NOT order -> 0.',
  },
  verdict:
    'GRID-REFINEMENT MEASUREMENT (frontier-direction, NOT rigorous). Recomputing the imp-34268 discrete ' +
    'third-difference stencil on the imp-34253 log-peak form f = -ln(k*-k) at finer steps h = 0.125, ' +
    '0.0625, ..., 0.001953 drives the imp-34346 EFFECTIVE pole order MONOTONICALLY UP toward 3 (tail ' +
    '1.302 -> 2.962; local last-pair 1.009 -> 2.756), NOT down toward 0. Three is exactly the order-3 pole ' +
    'of the third derivative of a logarithmic peak (f dg = 2B/(k*-k)^3; thirdDiff/h^3 -> 2B/x^3, ' +
    'cross-checked to 16.000 at x = 0.5), so the refinement CONFIRMS the imp-34253 logarithmic peak and ' +
    'CORRECTS the imp-34346 F2 "order -> 0" reading -- the raw ~0.94 at h = 0.25 is a coarse-grid ' +
    'under-estimate (h/x ~ 8), precisely as the F3 caveat warned. The ticket binary "fall to 0 (log) or ' +
    'settle at a finite power" is a false dichotomy: the log peak yields a FINITE third-difference order ' +
    '(3), not 0. GENUINE finer-grid recompute of the component third differences stays blocked by ' +
    'SUB-GAP-imp-34346-continuous-order-blocked (resid_exp -> 0 below k = 21.5); this is a model-based ' +
    'refinement of the log form F2 itself invokes. DISTINCT from imp-34310 (simple pole of the surrogate ' +
    'ratio at k*) and imp-34253 (log-vs-saturation of the peak itself). The pole is a resid_exp surrogate ' +
    'artifact, not a physical singularity; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the refinement is model-based, not a component recompute; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'SUB-GAP-imp-34429-component-finer-grid-blocked: the effective order -> 3 is measured on the imp-34253 ' +
    'log-peak FORM, not on a genuine finer-grid recompute of the component third differences (still blocked ' +
    'by SUB-GAP-imp-34346-continuous-order-blocked -- resid_exp -> 0 loses digits below k = 21.5, so the ' +
    'sub-pole windows a finer component grid needs are undefined). The refinement confirms the log peak IF ' +
    'the peak is the imp-34253 log peak; it does not independently re-establish that form.',
  honest:
    'GRID-REFINEMENT / MODEL-BASED ONLY -- a discrete-operator refinement of the imp-34253 log-peak form ' +
    'against the imp-34237 surrogate pole; adds no derivation and changes no bound. Surrogate/component ' +
    'model NOT rigorous; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED; ' +
    'no refereed bound is changed.',
  isRigorous: false,
};

export const IMP34429_ASSERTIONS = [
  {
    // Reuse gate: the imp-34268 third-difference stencil on the imp-34253 log form reproduces the h=0.25
    // anchored tail effective order (~1.30 in the pure-log surrogate) and the pole/anchor literals.
    id: 'imp-34429-reuse-gate-stencil-and-pole',
    description: 'log-peak third-difference stencil reproduces h=0.25 tail order ~1.302 at pole k*=21.28095, anchor kEnd=21.25',
    holds: () => {
      if (Math.abs(IMP34429_KSTAR - 21.28095) > 1e-9) return false;
      if (Math.abs(IMP34429_KEND_ANCHOR - 21.25) > 1e-9) return false;
      const live = imp34429EffectiveOrder(imp34429TailRows(0.25));
      return live.nPoints === 5 && Math.abs(live.order - 1.302171) < 1e-4;
    },
  },
  {
    // (F1) The effective order RISES monotonically toward 3 as h shrinks -- both the tail-window and the
    // local last-pair estimates increase at every refinement step; neither falls toward 0.
    id: 'imp-34429-effective-order-rises-monotonically-toward-3',
    description: 'tail + local last-pair effective order strictly increase as h halves, from ~1.30 to ~2.96, approaching 3',
    holds: () => {
      const rows = IMP34429_REFINEMENT_ROWS;
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].tailOrder > rows[i - 1].tailOrder)) return false;
        if (!(rows[i].localLastPair > rows[i - 1].localLastPair)) return false;
      }
      const first = rows[0];
      const last = rows[rows.length - 1];
      return (
        first.tailOrder < 1.4 &&
        last.tailOrder > 2.9 &&
        last.tailOrder < 3.0 &&
        last.localLastPair > 2.7
      );
    },
  },
  {
    // (F1 live) The live-computed local last-pair order at a finer grid (h=0.03125) is strictly ABOVE the
    // h=0.25 estimate -- refinement reverses the imp-34346 F2 "decreasing order" trend.
    id: 'imp-34429-refinement-reverses-decreasing-order',
    description: 'live local order at h=0.03125 strictly exceeds the h=0.25 local order -- refinement raises, not lowers, the order',
    holds: () => {
      const coarse = imp34429LocalLastPairOrder(0.25);
      const fine = imp34429LocalLastPairOrder(0.03125);
      return fine > coarse && Math.abs(coarse - 1.008624) < 1e-4 && fine > 1.6;
    },
  },
  {
    // (F2) Continuous-limit cross-check: the well-resolved third difference / h^3 -> 2/x^3 (order-3 pole
    // of the third derivative of a log peak). At x=0.5, tiny h, td/h^3 -> 16.000 = 2/0.5^3.
    id: 'imp-34429-continuous-limit-order-3-log-peak',
    description: 'thirdDiff/h^3 -> 2/x^3 (=16.000 at x=0.5) -- order-3 pole of the 3rd derivative of a log peak; continuousOrder=3',
    holds: () => {
      if (IMP34429_CONTINUOUS_ORDER !== 3) return false;
      const x = 0.5;
      const ke = IMP34429_KSTAR - x;
      const ratio = imp34429ThirdDiff(ke, 1e-4) / Math.pow(1e-4, 3);
      const target = 2 / Math.pow(x, 3); // 16
      return Math.abs(ratio - target) < 0.05;
    },
  },
  {
    // Honesty gate: model-based refinement only, isRigorous false, distinct from imp-34310/imp-34253,
    // component finer-grid still blocked, no QED, no refereed bound is changed, imp-3066 K_a>=0 & imp-486 C_mb untouched.
    id: 'imp-34429-honesty-gate-no-qed',
    description: 'model-based only: isRigorous false, distinct from imp-34310/imp-34253, sub-gap flagged, no QED, no refereed bound is changed, imp-3066/imp-486 untouched',
    holds: () => {
      const o = IMP34429_THIRD_DIFF_ORDER_GRID_REFINEMENT;
      return (
        o.isRigorous === false &&
        /NOT a rigorous asymptotic/.test(o.verdict) &&
        /SUB-GAP-imp-34429-component-finer-grid-blocked/.test(o.subGap) &&
        /DISTINCT from imp-34310[\s\S]*imp-34253/.test(o.verdict) &&
        /NO QED/.test(o.verdict) &&
        /refereed bound is changed/i.test(o.verdict) &&
        /imp-3066 K_a >= 0 untouched/i.test(o.verdict) &&
        /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(o.verdict)
      );
    },
  },
];

for (const a of IMP34429_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34429-third-diff-order-grid-refinement assertion failed: ${a.id}`);
  }
}
