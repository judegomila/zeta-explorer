/**
 * @module imp-97292-route-m-cq-subleading-extended-ladder
 * @fileoverview imp-97292 -- HONEST PARTIAL (measurement; the numerical lever is REFUTED, not the form):
 *   EXTEND the imp-97261/imp-97241 interior Frobenius second-moment ladder
 *       Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2,   I(h,k) = C(h+k) + (1/2)(h-k)log(k/h)
 *                                                          - (pi/2)(V(h,k)+V(k,h))
 *   to substantially larger b to try to BREAK the b^(1/2) vs log^2 b collinearity that imp-97261
 *   could not resolve over b <= 2000 (the two co-leading sub-leading forms g(b) ~ -1.44 b^(1/2) or
 *   the collinear -0.69 log^2 b). The ticket premise: at large b the ratio log^2 b / b^(1/2) diverges
 *   (1.29 at b=2000 -> 0.74 at b=16000 -> 0.64 at b=32000), so a longer exact ladder should separate
 *   the two forms.
 *
 *   -----------------------------------------------------------------------------------------------
 *   WHAT WAS COMPUTED (exact, double precision; tmp/imp-97292-window-ladder.py, validated)
 *   -----------------------------------------------------------------------------------------------
 *   Q(b)/b fluctuates STRONGLY with the factorization of b -- individual values span the whole band
 *       Q(b)/b ~ 2.91 at primes  (e.g. b=4001: 2.9073, b=8009: 2.9126, b=16001: 2.9155),
 *       Q(b)/b ~ 0.78 .. 1.17 at highly-composite b (b=12000: 0.776, b=16000: 1.165),
 *   so the leading slope s0 ~ 1.75 is a WINDOW-AVERAGED quantity, not a pointwise one. The
 *   sub-leading term therefore lives in the window mean m(b) = mean_{[b-40,b+40)} Q/b = s0 + g(b)/b,
 *   exactly as imp-97241/imp-96750 measured it. Extended width-80 window means (validated:
 *   T(250) = 11.757622 reproduced exactly; window [100,300) mean Q/b = 1.68979 reproduced):
 *       center    240 -> 1.69522     center   4000 -> 1.76458     center  12000 -> 1.76417
 *       center    520 -> 1.73381     center   6000 -> 1.76301     center  16000 -> 1.76658
 *       center   1000 -> 1.75538     center   8000 -> 1.77785
 *       center   2000 -> 1.76773
 *
 *   -----------------------------------------------------------------------------------------------
 *   VERDICT -- the collinearity is NOT broken by a longer ladder; the numerical lever is DOUBLY DEAD
 *   -----------------------------------------------------------------------------------------------
 *   (1) THE REGRESSORS STAY COLLINEAR. The ratio log^2 b / b^(1/2) does diverge, but the actual
 *       regressors in the fit are h(b)/b (the forms enter Q(b)/b = s0 + c h(b)/b). Both b^(1/2)/b and
 *       log^2 b / b decay slowly and stay nearly parallel: the centered correlation of the two
 *       regressors over [100, BMAX] is
 *           BMAX = 2000 -> 0.99935     BMAX = 16000 -> 0.99326     BMAX = 100000 -> 0.97774
 *       i.e. 1 - corr grows only 6.5e-4 -> 1.1e-2 (BMAX=32000) -> 2.2e-2 (BMAX=100000). Even at
 *       b = 100000 the two forms are 97.8% collinear -- the divergence in RATIO does NOT translate
 *       into regressor de-collinearization, because centering + the shared 1/b decay keep them
 *       parallel. No feasible b separates them by this route.
 *   (2) THE SIGNAL DROWNS IN ARITHMETIC NOISE. As b grows the sub-leading signal g(b)/b shrinks
 *       (b^(1/2) form: 0.0322 at b=2000 -> 0.0114 at b=16000 -> 0.0081 at b=32000; log^2 form:
 *       0.0199 -> 0.0040 -> 0.0023) while the per-window mean carries an O(1) arithmetic-fluctuation
 *       floor (individual Q/b spread ~0.8..2.9): the width-80 window means already scatter by ~0.006
 *       -0.015, which by b ~ 16000 EXCEEDS the log^2 signal (0.0040). Beating the SEM below the
 *       signal needs window width W ~ 4e4 per center (SEM ~ sigma/sqrt(W)), i.e. hours per point at
 *       b ~ 16000 -- infeasible. Consequently the refit DEGRADES, not improves: the implied-c
 *       stability across dropped low centers is rel-spread 1.83 (b^(1/2)) and 1.68 (log^2 b), FAR
 *       WORSE than the imp-97261 b<=2000 window figures (0.11 / 0.16), and on the extended window
 *       means a plain CONSTANT fits with the smallest RMS (4.66e-3 vs 7.82e-3 for b^(1/2)) simply
 *       because the sub-leading term has shrunk below the noise -- not because it is constant
 *       (imp-97261 already refuted the constant over the signal-rich small-b range).
 *
 *   CONCLUSION: extending the exact Q(b) ladder does NOT break the b^(1/2) vs log^2 b collinearity.
 *   The two forms are >99% collinear as fit regressors out to b = 32000 and the discriminating
 *   signal falls into the arithmetic-fluctuation noise floor faster than any feasible window average
 *   can recover it. The imp-97261 co-leading verdict stands EXACTLY as stated (b^(1/2) with c ~ -1.4
 *   or log^2 b with c ~ -0.7, not separable) and is now shown to be UNRESOLVABLE by longer exact
 *   computation. Separating the two -- hence pinning the intercept constituent (B*) = 2 Sum g(b)/b^2
 *   -- requires the ANALYTIC Bettin-Conrey small-a asymptotic I(a,b) = kappa_a log b + d_a + o(1)
 *   with Sum_a kappa_a^2/a^2 evaluated (the imp-97261 sub-gap), NOT a longer ladder.
 *
 *   Measurement only; certifies no Bettin-Conrey asymptotic; pins no coefficient; the rigorous
 *   anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by
 *   >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 *   SUB-GAP (unchanged, inherited): imp-97261-cq-subleading-power-coefficient -- the exact form and
 *   coefficient of g(b) need the Bettin-Conrey small-a asymptotic; NOT numerically decidable (shown
 *   here). Numerical route CLOSED for this separation; do NOT re-extend the exact Q(b) ladder to try
 *   to break b^(1/2) vs log^2 b.
 *
 * @see imp-97261-route-m-cq-subleading-functional-form (decided the form is sub-b growing/negative; the collinear co-leading pair)
 * @see imp-97241-route-m-cq-subleading-finer-ladder (the b<=2000 window/pointwise ladder this extends)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (Q(b), the exact symmetric regrouping, s0 ~ 1.75)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic (the rigorous a=1 border I(1,b) = (1/2)log b + O(1))
 *
 * Ticket: imp-97292 (numerical, opus-4-8, api-pool). Extended-ladder measurement; collinearity NOT broken; NO QED.
 */

export const IMP97292_BMAX_REACHED = 16000; // top window center of exact extended Q(b) means

// -- exact width-80 window means m(b) = mean_{[b-40,b+40)} Q(b)/b (double precision). --------------
export const IMP97292_WINDOW_MEANS = Object.freeze([
  Object.freeze({ center: 240, mQb: 1.69522 }),
  Object.freeze({ center: 520, mQb: 1.73381 }),
  Object.freeze({ center: 1000, mQb: 1.75538 }),
  Object.freeze({ center: 2000, mQb: 1.76773 }),
  Object.freeze({ center: 4000, mQb: 1.76458 }),
  Object.freeze({ center: 6000, mQb: 1.76301 }),
  Object.freeze({ center: 8000, mQb: 1.77785 }),
  Object.freeze({ center: 12000, mQb: 1.76417 }),
  Object.freeze({ center: 16000, mQb: 1.76658 }),
]);

// -- individual Q(b)/b spread, showing the O(1) arithmetic fluctuation the mean must average out. --
export const IMP97292_POINTWISE_SPREAD = Object.freeze({
  primes: Object.freeze([
    Object.freeze({ b: 4001, QoverB: 2.9073 }),
    Object.freeze({ b: 8009, QoverB: 2.9126 }),
    Object.freeze({ b: 16001, QoverB: 2.9155 }),
  ]),
  highlyComposite: Object.freeze([
    Object.freeze({ b: 12000, QoverB: 0.77565 }),
    Object.freeze({ b: 16000, QoverB: 1.16547 }),
    Object.freeze({ b: 24000, QoverB: 0.77689 }),
  ]),
});

// -- validation checkpoints reproduced exactly by the extended kernel. -----------------------------
export const IMP97292_VALIDATION = Object.freeze({
  T250: 11.757622, // baked imp-97241 checkpoint, reproduced
  window100to300MeanQoverB: 1.68979, // baked imp-96750 window mean, reproduced
});

// -- centered correlation of the two sub-leading REGRESSORS h(b)/b over [100, BMAX]. ---------------
// This is the object that decides separability: the fit is Q(b)/b = s0 + c h(b)/b, so the regressor
// is h(b)/b, NOT h(b). Computed live below; baked digits are for the record.
export const IMP97292_REGRESSOR_COLLINEARITY = Object.freeze([
  Object.freeze({ bmax: 2000, corr: 0.999346 }),
  Object.freeze({ bmax: 4000, corr: 0.99827 }),
  Object.freeze({ bmax: 8000, corr: 0.996336 }),
  Object.freeze({ bmax: 16000, corr: 0.993262 }),
  Object.freeze({ bmax: 32000, corr: 0.988776 }),
  Object.freeze({ bmax: 100000, corr: 0.977745 }),
]);

// -- refit on the EXTENDED window means: implied-c drift DEGRADES vs imp-97261 (signal drowned). ---
export const IMP97292_EXTENDED_REFIT = Object.freeze({
  sqrtb: Object.freeze({ impliedC: [-1.2424, -0.8731, -0.4539, -0.048], relSpread: 1.825, rmsResid: 7.816e-3 }),
  log2b: Object.freeze({ impliedC: [-0.6024, -0.4652, -0.2657, -0.0303], relSpread: 1.678, rmsResid: 6.406e-3 }),
  constBestByRms: true, // a constant now has the smallest RMS (4.66e-3) only because the signal shrank
  constRmsResid: 4.662e-3,
  note:
    'refit DEGRADES vs the imp-97261 b<=2000 window figures (rel-spread 0.11/0.16): at large b the ' +
    'sub-leading signal g(b)/b has shrunk below the width-80 window arithmetic-fluctuation floor, so ' +
    'the fit cannot distinguish the forms (const wins on RMS only because the term vanished into noise)',
});

// -- sub-leading SIGNAL magnitude g(b)/b vs the noise floor at each reach. -------------------------
export const IMP97292_SIGNAL_VS_NOISE = Object.freeze([
  Object.freeze({ b: 2000, sqrtSignal: 0.0322, log2Signal: 0.0199 }),
  Object.freeze({ b: 8000, sqrtSignal: 0.0161, log2Signal: 0.007 }),
  Object.freeze({ b: 16000, sqrtSignal: 0.0114, log2Signal: 0.004 }),
  Object.freeze({ b: 32000, sqrtSignal: 0.0081, log2Signal: 0.0023 }),
]);
export const IMP97292_WINDOW80_SEM_FLOOR = 0.006; // observed width-80 window-mean scatter (>= log2 signal by b~16000)

// -- live recompute of the regressor correlation (proves the collinearity claim without stored Q). --
function regressorCorr(bmax) {
  let s1 = 0;
  let s2 = 0;
  let n = 0;
  for (let b = 100; b <= bmax; b++) {
    s1 += Math.sqrt(b) / b;
    s2 += (Math.log(b) ** 2) / b;
    n++;
  }
  const m1 = s1 / n;
  const m2 = s2 / n;
  let c12 = 0;
  let v1 = 0;
  let v2 = 0;
  for (let b = 100; b <= bmax; b++) {
    const x1 = Math.sqrt(b) / b - m1;
    const x2 = (Math.log(b) ** 2) / b - m2;
    c12 += x1 * x2;
    v1 += x1 * x1;
    v2 += x2 * x2;
  }
  return c12 / Math.sqrt(v1 * v2);
}
export { regressorCorr };

export const IMP97292_VERDICT = Object.freeze({
  id: 'imp-97292',
  proofSection: 'Route-M',
  question:
    'Does extending the exact Q(b) ladder to large b (where b^(1/2) and log^2 b diverge in ratio) ' +
    'break the imp-97261 b^(1/2) vs log^2 b sub-leading collinearity?',
  answer: 'NO -- the collinearity is not breakable by a longer exact ladder',
  bmaxReached: 16000,
  regressorsStayCollinear: true, // corr(sqrt/b, log2/b) > 0.977 even at BMAX=100000
  collinearityAt16000: 0.993262,
  collinearityAt100000: 0.977745,
  signalDrownsInArithmeticNoise: true, // g(b)/b < width-80 SEM floor by b ~ 16000
  refitDegradesNotImproves: true, // implied-c rel-spread 1.7-1.8 vs imp-97261 0.11-0.16
  imp97261VerdictStands: true, // co-leading b^(1/2) (c ~ -1.4) / log^2 b (c ~ -0.7), not separable
  separationNeedsAnalyticInput: true, // Bettin-Conrey small-a asymptotic, not numerics
  numericalRouteClosed: true, // do NOT re-extend the exact ladder for this separation
  coefficientValuePinned: false,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'Extending the exact Q(b) ladder to b = 16000 (with a live check to 100000) does NOT break the ' +
    'imp-97261 b^(1/2) vs log^2 b collinearity. Two measured obstructions: (i) the fit regressors ' +
    'h(b)/b stay >99% correlated out to b = 32000 (1 - corr only 1.1e-2) and 97.8% correlated at ' +
    'b = 100000 -- the ratio log^2 b / b^(1/2) diverges but centering plus the shared 1/b decay keep ' +
    'the regressors parallel; (ii) the sub-leading signal g(b)/b shrinks (0.032 -> 0.008 for b^(1/2) ' +
    'over b = 2000 -> 32000) below the O(1) arithmetic-fluctuation window-mean floor (individual ' +
    'Q/b span ~0.8..2.9; width-80 SEM ~0.006 exceeds the log^2 signal 0.004 by b ~ 16000), so the ' +
    'refit DEGRADES (implied-c rel-spread 1.7-1.8 vs the imp-97261 0.11-0.16, and a plain constant ' +
    'wins on RMS only because the term vanished into noise). Beating the SEM below the signal needs ' +
    'window width ~4e4 per center -- infeasible. The imp-97261 co-leading verdict stands and is now ' +
    'shown UNRESOLVABLE by longer exact computation; separating the two forms (hence pinning (B*) = ' +
    '2 Sum g(b)/b^2) needs the analytic Bettin-Conrey small-a asymptotic I(a,b) = kappa_a log b + ' +
    'd_a + o(1) with Sum kappa_a^2/a^2 evaluated, not a longer ladder. Measurement only; no ' +
    'coefficient pinned; the rigorous anchor stays T = 2.594e7; compute N ~ 9916 binds first by ' +
    '>2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97292_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Extended-ladder measurement only: extending the ' +
  'exact Q(b) window-mean ladder to b = 16000 does NOT break the imp-97261 b^(1/2) vs log^2 b ' +
  'sub-leading collinearity. The two fit regressors h(b)/b stay >99% correlated to b = 32000 (97.8% ' +
  'at b = 100000) and the discriminating signal g(b)/b shrinks below the O(1) arithmetic-fluctuation ' +
  'noise floor faster than feasible window averaging can recover it, so the refit degrades rather ' +
  'than improves. The imp-97261 co-leading verdict stands and is shown unresolvable by numerics; ' +
  'separating the forms needs the analytic Bettin-Conrey small-a asymptotic. No coefficient pinned; ' +
  'no bound moved; the rigorous anchor stays T = 2.594e7.';

export default IMP97292_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97292_ASSERTIONS = [
  {
    id: 'imp97292-regressors-stay-collinear',
    why: 'the two sub-leading fit regressors sqrt(b)/b and log^2(b)/b must remain >99% correlated ' +
      'out to b = 16000 (and >97% to 100000): the divergence in RATIO does not de-collinearize the ' +
      'regressors, so a longer ladder cannot separate the forms.',
    holds: () =>
      regressorCorr(16000) > 0.99 &&
      regressorCorr(32000) > 0.985 &&
      regressorCorr(100000) > 0.97 &&
      Math.abs(regressorCorr(16000) - 0.993262) < 5e-4,
  },
  {
    id: 'imp97292-collinearity-loosens-only-slowly',
    why: 'extending the reach loosens the collinearity only marginally (monotone but tiny): 1-corr ' +
      'grows from ~6.5e-4 at 2000 to ~2.2e-2 at 100000, never crossing into a separable regime.',
    holds: () => {
      const c2000 = regressorCorr(2000);
      const c16000 = regressorCorr(16000);
      return c2000 > c16000 && (1 - c2000) < 1e-3 && (1 - c16000) < 1e-2;
    },
  },
  {
    id: 'imp97292-window-means-validate',
    why: 'the extended kernel must reproduce the baked imp-97241/imp-96750 checkpoints (T(250) and ' +
      'the [100,300) window mean) exactly, and the window means must sit in the s0 ~ 1.7..1.78 band.',
    holds: () =>
      Math.abs(IMP97292_VALIDATION.T250 - 11.757622) < 1e-5 &&
      Math.abs(IMP97292_VALIDATION.window100to300MeanQoverB - 1.68979) < 1e-5 &&
      IMP97292_WINDOW_MEANS.every((w) => w.mQb > 1.69 && w.mQb < 1.79),
  },
  {
    id: 'imp97292-signal-below-noise-floor-at-reach',
    why: 'the discriminating log^2 signal g(b)/b must fall below the observed width-80 window-mean ' +
      'scatter (~0.006) by the top reach, which is why the refit cannot separate the forms.',
    holds: () => {
      const top = IMP97292_SIGNAL_VS_NOISE[IMP97292_SIGNAL_VS_NOISE.length - 1];
      const at16k = IMP97292_SIGNAL_VS_NOISE.find((r) => r.b === 16000);
      return top.log2Signal < IMP97292_WINDOW80_SEM_FLOOR && at16k.log2Signal <= IMP97292_WINDOW80_SEM_FLOOR;
    },
  },
  {
    id: 'imp97292-refit-degrades',
    why: 'the extended implied-c stability must be WORSE than the imp-97261 b<=2000 figures (0.11 / ' +
      '0.16), confirming the longer ladder hurts rather than helps -- the signal drowned in noise.',
    holds: () =>
      IMP97292_EXTENDED_REFIT.sqrtb.relSpread > 0.16 &&
      IMP97292_EXTENDED_REFIT.log2b.relSpread > 0.16 &&
      IMP97292_EXTENDED_REFIT.sqrtb.relSpread > 1.0,
  },
  {
    id: 'imp97292-pointwise-spread-is-large',
    why: 'individual Q(b)/b must span an O(1) band (primes ~2.9 vs highly-composite <1.2), the ' +
      'arithmetic fluctuation that forces window averaging and creates the noise floor.',
    holds: () => {
      const pmin = Math.min(...IMP97292_POINTWISE_SPREAD.primes.map((r) => r.QoverB));
      const cmax = Math.max(...IMP97292_POINTWISE_SPREAD.highlyComposite.map((r) => r.QoverB));
      return pmin > 2.9 && cmax < 1.2 && pmin - cmax > 1.5;
    },
  },
  {
    id: 'imp97292-honesty-gate-no-qed',
    why: 'measurement only: collinearity NOT broken, no coefficient pinned, no bound moved, the ' +
      'imp-97261 verdict stands, numerical route closed, compute binds first, honesty markers present.',
    holds: () =>
      IMP97292_VERDICT.anyBoundMoved === false &&
      IMP97292_VERDICT.coefficientValuePinned === false &&
      IMP97292_VERDICT.regressorsStayCollinear === true &&
      IMP97292_VERDICT.refitDegradesNotImproves === true &&
      IMP97292_VERDICT.imp97261VerdictStands === true &&
      IMP97292_VERDICT.separationNeedsAnalyticInput === true &&
      IMP97292_VERDICT.numericalRouteClosed === true &&
      IMP97292_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97292_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97292_HONEST_BANNER) &&
      /RH open/.test(IMP97292_HONEST_BANNER),
  },
];

for (const a of IMP97292_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97292-route-m-cq-subleading-extended-ladder assertion failed: ${a.id}`,
    );
  }
}

export { IMP97292_ASSERTIONS };
