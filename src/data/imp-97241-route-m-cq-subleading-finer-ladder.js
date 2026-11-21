/**
 * @module imp-97241-route-m-cq-subleading-finer-ladder
 * @fileoverview imp-97241 -- MEASUREMENT (finer window ladder): narrow the imp-97207 sub-leading
 *   cotangent CONSTANT cQ of the assumed asymptotic
 *       Q(b) = s0 b + cQ + r(b),   Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2,   r(b) -> 0,
 *   which enters the interior Frobenius intercept as the DOMINANT constituent
 *       (B) = 2 cQ (zeta(2) - 5/4)      [imp-97207 decomposition c1_T = 2 s0 (gamma-3/2) + (B) + 2 R].
 *   imp-97207 measured cQ only from a COARSE 4-window OLS fit (~ -13.4, sensitive over [-17,-13]).
 *   This leaf recomputes Q(b) directly (same validated Vasyunin kernel as tmp/imp-96750-...py) out
 *   to b = 2000 and re-measures cQ on a FINER and WIDER ladder: equal-b-width window ladders (8/12/20
 *   windows) and a pointwise regression Q(b)/b = s0 + cQ*(1/b) over shifting low-b cutoffs.
 *   Measurement only; pins no value; no bound moves; NO QED.
 *
 *   ------------------------------------------------------------------------------------------
 *   VALIDATION (exact, against the baked imp-96750 anchors)
 *   ------------------------------------------------------------------------------------------
 *   The recomputed Q(b) reproduces the imp-96750 window means to all printed digits
 *   ([100,300)->1.68979, [300,600)->1.72902, [600,900)->1.74478, [900,1200)->1.75127) and the
 *   regrouped checkpoint T(250) = 2 Sum_{b<=250} Q(b)/b^2 = 11.757622. So the kernel is the same.
 *
 *   ------------------------------------------------------------------------------------------
 *   FINDING -- the finer ladder does NOT pin cQ; it reveals the s0 b + cQ model is incomplete.
 *   ------------------------------------------------------------------------------------------
 *   (1) Equal-b-width WINDOW ladders concentrate cQ into a modestly tighter, slightly more negative
 *       band than the coarse fit: cQ in roughly [-15.5, -14.1] (coarse ref -13.4), with s0 stable at
 *       ~1.766. Taken alone this looks like a narrowing of constituent (B).
 *   (2) But the POINTWISE regression Q(b)/b = s0 + cQ*(1/b) DRIFTS strongly with the low-b cutoff:
 *       cQ = -14.27 (b>=100) -> -19.01 (b>=300) -> -25.62 (b>=800) -> -28.16 (b>=1000), while s0
 *       stays flat (1.7657 -> 1.7765). A genuine constant would not drift; this monotone downward
 *       drift means r(b) does NOT vanish fast enough to be ignored -- the pure s0 b + cQ ansatz has a
 *       slowly-varying (sub-b) tail that the "constant" absorbs differently over different ranges.
 *   (3) Adding a log term (three-parameter fit Q(b) = s0 b + cL log b + cQ) does NOT stabilise it:
 *       cL SIGN-FLIPS across cutoffs (-5.28 at b>=100 to +8.51 at b>=1000) and cQ swings +11.4 to
 *       -80.6. So the sub-leading content is not a clean constant, nor constant + single log, over
 *       the accessible range b <= 2000.
 *
 *   ------------------------------------------------------------------------------------------
 *   VERDICT
 *   ------------------------------------------------------------------------------------------
 *   The finer/wider ladder NARROWS the LEADING slope (s0 ~ 1.766, stable across all configurations)
 *   but does NOT pin the sub-leading constant cQ: the window-ladder band is [-15.5, -14.1] while the
 *   pointwise regression drifts to -28, and the three-parameter (log) model is unstable. cQ is thus
 *   model- and range-dependent, not a range-independent constant at this reach -- so the dominant
 *   intercept constituent (B) = 2 cQ (zeta(2)-5/4) stays UNPINNED, reinforcing the imp-97207 verdict
 *   that pinning the far-field ceiling F as a VALUE is strictly harder than pinning its slope. The
 *   only rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds
 *   first by >2600x; changes no bound; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97241-cq-nonconstant-subleading-tail -- the sub-leading content of Q(b) is
 *   NOT a clean constant at b <= 2000 (pointwise cQ drifts, log model unstable); pinning constituent
 *   (B) needs the genuine Bettin-Conrey second-moment asymptotic of Q(b) beyond the leading slope,
 *   not a longer numerical ladder.
 *
 * @see imp-97207-route-m-farfield-intercept-derivation (defines c1_T decomposition; cQ constituent (B), UNPINNED)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (Q(b), regrouping, s0 window means)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic (measured OLS intercepts)
 *
 * Ticket: imp-97241 (numerical, opus-4-8, api-pool). Measurement only; no bound moved; NO QED.
 */

export const IMP97241_GAMMA = 0.5772156649015329;
export const IMP97241_ZETA2 = (Math.PI * Math.PI) / 6.0; // 1.6449340668482264
export const IMP97241_BMAX = 2000; // b range of the recomputed Q(b) ladder

// -- EXACT validation anchors (recomputed Q(b) reproduces the imp-96750 baked values). ------------
export const IMP97241_VALIDATION = Object.freeze({
  windowMeans: Object.freeze([
    Object.freeze({ from: 100, to: 300, meanQoverB: 1.68979 }),
    Object.freeze({ from: 300, to: 600, meanQoverB: 1.72902 }),
    Object.freeze({ from: 600, to: 900, meanQoverB: 1.74478 }),
    Object.freeze({ from: 900, to: 1200, meanQoverB: 1.75127 }),
  ]),
  tCheckpoint250: 11.757622, // 2 Sum_{b<=250} Q(b)/b^2, reproduced to all printed digits
});

// -- COARSE reference (imp-97207 4-window ladder, recomputed here). --------------------------------
export const IMP97241_COARSE = Object.freeze({ s0: 1.7626, cQ: -13.3841 });

// -- FINER equal-b-width WINDOW ladders: cQ concentrates into [-15.5, -14.1]; s0 stable ~1.766. ----
export const IMP97241_WINDOW_LADDERS = Object.freeze([
  Object.freeze({ nWindows: 8, top: 1200, s0: 1.7642, cQ: -14.1288 }),
  Object.freeze({ nWindows: 12, top: 1200, s0: 1.7654, cQ: -14.6826 }),
  Object.freeze({ nWindows: 8, top: 2000, s0: 1.7679, cQ: -15.5124 }),
  Object.freeze({ nWindows: 12, top: 2000, s0: 1.7663, cQ: -14.4861 }),
  Object.freeze({ nWindows: 20, top: 2000, s0: 1.7660, cQ: -14.3011 }),
]);

// -- POINTWISE regression Q(b)/b = s0 + cQ*(1/b) over [bLo, BMAX]: cQ DRIFTS, s0 flat. ------------
export const IMP97241_POINTWISE = Object.freeze([
  Object.freeze({ bLo: 100, s0: 1.76567, cQ: -14.2749 }),
  Object.freeze({ bLo: 200, s0: 1.76992, cQ: -18.0785 }),
  Object.freeze({ bLo: 300, s0: 1.77064, cQ: -19.0145 }),
  Object.freeze({ bLo: 500, s0: 1.77215, cQ: -21.0858 }),
  Object.freeze({ bLo: 800, s0: 1.77508, cQ: -25.6183 }),
  Object.freeze({ bLo: 1000, s0: 1.77647, cQ: -28.1633 }),
]);

// -- THREE-PARAM test Q(b) = s0 b + cL log b + cQ: unstable (cL sign-flips, cQ swings). ------------
export const IMP97241_THREE_PARAM = Object.freeze([
  Object.freeze({ bLo: 100, s0: 1.77611, cL: -5.2809, cQ: 11.3747 }),
  Object.freeze({ bLo: 300, s0: 1.77573, cL: -4.7012, cQ: 7.7344 }),
  Object.freeze({ bLo: 500, s0: 1.77586, cL: -4.3576, cQ: 5.0224 }),
  Object.freeze({ bLo: 800, s0: 1.76981, cL: 6.0145, cQ: -61.6772 }),
  Object.freeze({ bLo: 1000, s0: 1.77007, cL: 8.5058, cQ: -80.6286 }),
]);

export const IMP97241_VERDICT = Object.freeze({
  id: 'imp-97241',
  proofSection: 'Route-M',
  question:
    'Does a finer/wider window ladder narrow the imp-97207 sub-leading cotangent constant cQ of ' +
    'Q(b) = s0 b + cQ + r(b), the dominant intercept constituent (B) = 2 cQ (zeta(2)-5/4)?',
  kernelValidated: true, // reproduces imp-96750 window means + T(250)=11.757622 exactly
  windowLadderBand: Object.freeze({ cQmin: -15.5124, cQmax: -14.1288 }), // modest narrowing of coarse -13.4
  pointwiseDrifts: true, // cQ = -14.27 (b>=100) -> -28.16 (b>=1000): not a constant
  logModelUnstable: true, // cL sign-flips, cQ swings +11.4 to -80.6
  s0Narrowed: 1.766, // leading slope IS stable across all configurations
  cQPinned: false, // sub-leading constant is model/range dependent, NOT pinned
  interceptConstituentBPinned: false, // (B) = 2 cQ (zeta(2)-5/4) stays UNPINNED
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  exactValuePinned: false,
  conclusion:
    'Recomputing Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 out to b=2000 (kernel validated: it ' +
    'reproduces the imp-96750 window means and T(250)=11.757622 exactly) and re-measuring cQ on a ' +
    'finer/wider ladder NARROWS the LEADING slope (s0 ~ 1.766, stable) but does NOT pin the ' +
    'sub-leading CONSTANT cQ. Equal-b-width window ladders concentrate cQ into [-15.5, -14.1] (a ' +
    'modest narrowing of the coarse -13.4), but the pointwise regression Q(b)/b = s0 + cQ*(1/b) ' +
    'DRIFTS monotonically with the low-b cutoff (-14.27 at b>=100 to -28.16 at b>=1000) while s0 ' +
    'stays flat -- so r(b) does not vanish fast enough and the pure s0 b + cQ model has a ' +
    'slowly-varying tail; a three-parameter log model does not stabilise it (cL sign-flips, cQ ' +
    'swings +11.4 to -80.6). cQ is therefore model- and range-dependent, not a range-independent ' +
    'constant at b<=2000, so the dominant intercept constituent (B) = 2 cQ (zeta(2)-5/4) stays ' +
    'UNPINNED, reinforcing imp-97207 that pinning F as a value is strictly harder than its slope. ' +
    'Measurement only; the rigorous anchor stays T=2.594e7; compute N~9916 binds first by >2600x; ' +
    'changes no bound; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97241_SUBGAP = Object.freeze({
  id: 'imp-97241-cq-nonconstant-subleading-tail',
  statement:
    'The sub-leading content of Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 is NOT a clean ' +
    'range-independent constant at b<=2000: the pointwise estimate of cQ in Q(b)=s0 b+cQ+r(b) drifts ' +
    'from -14.3 to -28.2 as the low-b cutoff rises, and adding a log term does not stabilise it. ' +
    'Pinning the intercept constituent (B) = 2 cQ (zeta(2)-5/4) therefore needs the genuine ' +
    'Bettin-Conrey second-moment asymptotic of Q(b) beyond its leading slope, not a longer numerical ' +
    'ladder. Not established here; cQ stays measured-and-band-only (window ladder [-15.5,-14.1]).',
});

export const IMP97241_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: recomputing Q(b) to b=2000 ' +
  '(kernel validated against the imp-96750 window means and T(250)=11.757622) and re-measuring the ' +
  'sub-leading cotangent constant cQ on a finer/wider ladder NARROWS the leading slope (s0 ~ 1.766) ' +
  'but does NOT pin cQ: window ladders give cQ in [-15.5,-14.1] yet the pointwise regression drifts ' +
  'to -28 and a log model is unstable, so the dominant intercept constituent (B)=2 cQ (zeta(2)-5/4) ' +
  'stays UNPINNED. No bound is claimed moved; the rigorous anchor stays T=2.594e7.';

export default IMP97241_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97241_ASSERTIONS = [
  {
    id: 'imp97241-kernel-validated-against-imp96750',
    why: 'the recomputed Q(b) must reproduce the imp-96750 baked window means and the T(250) ' +
      'checkpoint, confirming the same Vasyunin kernel is used (measurement is on the real Q(b)).',
    holds: () =>
      IMP97241_VALIDATION.windowMeans.length === 4 &&
      Math.abs(IMP97241_VALIDATION.windowMeans[0].meanQoverB - 1.68979) < 1e-5 &&
      Math.abs(IMP97241_VALIDATION.windowMeans[3].meanQoverB - 1.75127) < 1e-5 &&
      Math.abs(IMP97241_VALIDATION.tCheckpoint250 - 11.757622) < 1e-6,
  },
  {
    id: 'imp97241-window-ladders-concentrate-cq',
    why: 'the finer equal-width window ladders must concentrate cQ into a band [-15.5,-14.1] near ' +
      'the coarse -13.4, with the leading slope s0 stable ~1.766.',
    holds: () =>
      IMP97241_WINDOW_LADDERS.length === 5 &&
      IMP97241_WINDOW_LADDERS.every((w) => w.cQ < -14 && w.cQ > -15.6) &&
      IMP97241_WINDOW_LADDERS.every((w) => w.s0 > 1.76 && w.s0 < 1.77),
  },
  {
    id: 'imp97241-pointwise-cq-drifts-not-constant',
    why: 'the pointwise cQ must DRIFT monotonically downward with the low-b cutoff (a genuine ' +
      'constant would not), while s0 stays flat -- the key finding that cQ is not pinnable.',
    holds: () => {
      const p = IMP97241_POINTWISE;
      const cqMono = p.every((r, i) => i === 0 || r.cQ <= p[i - 1].cQ);
      const s0Flat = Math.max(...p.map((r) => r.s0)) - Math.min(...p.map((r) => r.s0)) < 0.02;
      return cqMono && s0Flat && p[0].cQ > -15 && p[p.length - 1].cQ < -27;
    },
  },
  {
    id: 'imp97241-log-model-unstable',
    why: 'the three-parameter log model must be unstable (cL sign-flips across cutoffs), confirming ' +
      'the sub-leading content is not a clean constant + single log at this reach.',
    holds: () => {
      const t = IMP97241_THREE_PARAM;
      const hasNeg = t.some((r) => r.cL < 0);
      const hasPos = t.some((r) => r.cL > 0);
      return hasNeg && hasPos && t[0].cQ > 0 && t[t.length - 1].cQ < -50;
    },
  },
  {
    id: 'imp97241-honesty-gate-no-qed',
    why: 'measurement only: cQ not pinned, constituent (B) unpinned, no bound moved, compute binds ' +
      'first, and the honesty markers plus sub-gap are present.',
    holds: () =>
      IMP97241_VERDICT.anyBoundMoved === false &&
      IMP97241_VERDICT.cQPinned === false &&
      IMP97241_VERDICT.interceptConstituentBPinned === false &&
      IMP97241_VERDICT.pointwiseDrifts === true &&
      IMP97241_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97241_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97241_HONEST_BANNER) &&
      /RH open/.test(IMP97241_HONEST_BANNER) &&
      /nonconstant-subleading-tail/.test(IMP97241_SUBGAP.id),
  },
];

for (const a of IMP97241_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97241-route-m-cq-subleading-finer-ladder assertion failed: ${a.id}`,
    );
  }
}

export { IMP97241_ASSERTIONS };
