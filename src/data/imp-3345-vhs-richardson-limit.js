/**
 * @module imp-3345-vhs-richardson-limit
 * @fileoverview imp-3345 -- Richardson extrapolation of the imp-3256 matched-h
 *   Volterra Hilbert-Schmidt norm sequence ||V||_HS(a=0.5, N) to its h->0 limit,
 *   with a decision on the resolution-stable headline (1.90e-4 vs the sharper
 *   ~1.9003e-4) and reconciliation against the imp-3267 lock band [1.895e-4, 1.905e-4].
 *
 *   THE SEQUENCE
 *   ------------
 *   imp-3256 tabulated the SAME lower-triangular Volterra HS norm
 *       k(x, y) = Phi(x) Phi(y) sinh(a(x - y)) * 1_{0 <= y <= x},
 *       ||V||_HS = ( int_0^U int_0^x |k|^2 dy dx )^{1/2},   a = 0.5, NPHI = 10,
 *   on a matched step size h = 5/N (the U=5 column, bit-identical to the U=6
 *   matched-h column because Phi^2 underflows to fp-zero past u ~ 2). The five
 *   frozen matched-h values, with h halving each row, are:
 *
 *     N      h         ||V||_HS (matched-h)
 *     500    1.000e-2  1.8929609149e-4
 *     1000   5.000e-3  1.8984785338e-4
 *     2000   2.500e-3  1.8998575072e-4
 *     4000   1.250e-3  1.9002022234e-4
 *     8000   6.250e-4  1.9002884032e-4
 *
 *   imp-3256 observed the value still "creeping up" toward ~1.9003e-4 under
 *   refinement and called the 3-sig-fig 1.90e-4 headline resolution-stable, but
 *   NEVER extrapolated the sequence to its continuum limit. This module does.
 *
 *   CONVERGENCE ORDER (measured, not assumed)
 *   -----------------------------------------
 *   Successive differences d_k = f(2N) - f(N) shrink by a ratio ~4.000 at every
 *   step (4.00125, 4.00032, 3.99997), i.e. the error halves-squared as h halves:
 *   clean O(h^2) midpoint-quadrature convergence, p = 2. So the leading Richardson
 *   step divides the gap by 2^2 - 1 = 3, the next by 2^4 - 1 = 15 (the midpoint
 *   error expansion runs in even powers h^2, h^4, ...).
 *
 *   RICHARDSON TABLEAU (recomputed in-module from the frozen sequence)
 *   -----------------------------------------------------------------
 *   Level 1 (p=2, divisor 3):  1.90031774010e-4, 1.90031716500e-4,
 *                              1.90031712880e-4, 1.90031712980e-4
 *   Level 2 (p=4, divisor 15): 1.90031712666e-4, 1.90031712639e-4, 1.90031712987e-4
 *
 *   The level-1 extrapolants collapse from a 5.7e-11 spread (first pair) to a
 *   1.0e-13 spread (last pair) -- five orders of magnitude tighter than the raw
 *   1.7e-6 spread of the input sequence. The h->0 limit is
 *
 *       ||V||_HS(a=0.5) = 1.9003171e-4   (extrapolation error ~5e-13 absolute,
 *                                          ~3e-9 relative; the true limiter is the
 *                                          10-sig-fig storage precision of the inputs,
 *                                          ~1e-14 absolute each).
 *
 *   HEADLINE DECISION (the ticket question)
 *   ---------------------------------------
 *   (1) The 3-sig-fig headline 1.90e-4 is RESOLUTION-STABLE and CORRECT: the h->0
 *       limit 1.9003171e-4 rounds to 1.90e-4. imp-3256 was right to call it stable.
 *   (2) The sharper resolution-converged value is 1.90032e-4 (6 s.f.) / 1.9003e-4
 *       (5 s.f.) -- exactly the "~1.9003e-4" imp-3256 saw the sequence creeping
 *       toward. The creep is CONVERGENT, not divergent: the raw N=8000 value
 *       1.9002884e-4 is itself still ~1.5e-5 relative (0.0015%) SHORT of the true
 *       limit, so quoting the finest grid point under-reports; the extrapolated
 *       1.90032e-4 is the honest continuum value.
 *   (3) MAGNITUDE OF THE CREEP, stated honestly: the h->0 limit sits +0.0968% above
 *       the frozen imp-1267 N=1000 anchor 1.8984785338e-4 and +0.0167% above the
 *       1.90e-4 headline. (The imp-3256 note "~0.02%" measures the limit against the
 *       headline, not against the N=1000 anchor; against the anchor the true creep
 *       is ~0.097%.)
 *
 *   RECONCILIATION WITH imp-3267 AND imp-3343
 *   -----------------------------------------
 *   The limit 1.9003171e-4 lands comfortably INSIDE the imp-3267 L2 lock band
 *   [1.895e-4, 1.905e-4] (0.28% above the floor, 0.25% below the ceiling), so the
 *   locked verdict is consistent with the extrapolated continuum value. imp-3343
 *   (imp-3350) proved ||V||_HS = ||Gshear||_op EXACTLY and reported a Richardson
 *   limit ~1.9014e-4 from a SHALLOWER, DIFFERENT-WINDOW ladder (U=6, N up to 2000,
 *   finest h = 3.0e-3). The two families agree to 3 significant figures (both round
 *   to 1.90e-4) but differ by ~0.06% at the 4th sig fig. The imp-3256 ladder used
 *   here is refined ~5x deeper (finest h = 6.25e-4) with a textbook 4.000 order
 *   ratio and a level-1 tableau stable to 1e-13, so 1.90032e-4 is the tighter
 *   estimate; the ~0.06% spread is a residual discretization-family dependence at
 *   the 4th significant figure.
 *
 *   VERDICT
 *   -------
 *   Resolution-stable HEADLINE = 1.90e-4 (3 s.f., robust across both extrapolation
 *   families). Sharper continuum value from the imp-3256 matched-h ladder =
 *   1.90032e-4 (~1.9003e-4), inside the imp-3267 band, +0.0968% above the imp-1267
 *   N=1000 anchor. Reporting 4 significant figures is NOT yet justified: the 4th
 *   figure is family-dependent (1.90032e-4 here vs 1.9014e-4 for the imp-3343 U=6
 *   ladder). Named open sub-gap below.
 *
 *   HONEST SCOPE (mandatory)
 *   ------------------------
 *   Deterministic Richardson extrapolation of an already-frozen numerical sequence,
 *   RH-EQUIVALENT; no new heavy compute, no operator positivity, no reduction, NO
 *   QED. The imp-3066 off-diagonal endpoint-Hankel K_a >= 0 step remains the lone
 *   obstruction and is untouched. No refereed bound is changed
 *   . NAMED SUB-GAP: the 4th significant figure of the continuum ||V||_HS is not
 *   pinned -- two refinement families (imp-3256 U=5 halving ladder -> 1.90032e-4,
 *   imp-3343 U=6 ladder -> 1.9014e-4) disagree at the ~0.06% level; nailing it would
 *   need a shared-grid, matched-U extrapolation deeper than either current ladder.
 *
 *   @see imp-3256-vhs-crossval.js (source matched-h sequence)
 *   @see imp-1267-volterra-hs-bound.js (frozen N=1000 anchor 1.8984785338e-4)
 *   @see imp-3267-section26-mupass-verdict-lock.js (L2 band [1.895e-4, 1.905e-4])
 *   @see imp-3343-shear-gram-opnorm-equals-volterra-hs-identity.js (op=HS identity)
 *
 *   Ticket: imp-3345 (numerical, medium).
 */

// Frozen matched-h HS sequence from imp-3256 (a=0.5, h = 5/N, h halves each row).
const MATCHED_H_SEQUENCE = Object.freeze([
  Object.freeze({ N: 500,  h: 5 / 500,  hs: 1.8929609149e-4 }),
  Object.freeze({ N: 1000, h: 5 / 1000, hs: 1.8984785338e-4 }),
  Object.freeze({ N: 2000, h: 5 / 2000, hs: 1.8998575072e-4 }),
  Object.freeze({ N: 4000, h: 5 / 4000, hs: 1.9002022234e-4 }),
  Object.freeze({ N: 8000, h: 5 / 8000, hs: 1.9002884032e-4 }),
]);

// Build a Richardson tableau assuming a step-halving sequence with an even-power
// error expansion h^2, h^4, h^6, .... Each level l (1-indexed) removes the h^(2l)
// term via divisor 2^(2l) - 1: R_new[i] = fine + (fine - coarse) / (2^(2l) - 1).
function buildRichardsonTableau(values) {
  const levels = [values.slice()];
  let col = values.slice();
  let level = 1;
  while (col.length > 1) {
    const p = 2 * level;
    const divisor = Math.pow(2, p) - 1;
    const next = [];
    for (let i = 1; i < col.length; i++) {
      next.push(col[i] + (col[i] - col[i - 1]) / divisor);
    }
    levels.push(next);
    col = next;
    level += 1;
  }
  return levels;
}

const _raw = MATCHED_H_SEQUENCE.map((r) => r.hs);
const _tableau = buildRichardsonTableau(_raw);
const _level1 = _tableau[1];
const _extrapolatedLimit = _tableau[_tableau.length - 1][0];

// Measured convergence-order ratios d_k / d_{k+1} (expected ~4 for O(h^2)).
const _diffs = [];
for (let i = 1; i < _raw.length; i++) _diffs.push(_raw[i] - _raw[i - 1]);
const _orderRatios = [];
for (let i = 0; i < _diffs.length - 1; i++) _orderRatios.push(_diffs[i] / _diffs[i + 1]);

// Extrapolation error proxy: spread of the last two level-1 extrapolants.
const _level1LastSpread = Math.abs(_level1[_level1.length - 1] - _level1[_level1.length - 2]);

const IMP1267_N1000_ANCHOR = 1.8984785338e-4;
const VERDICT_HEADLINE = 1.90e-4;
const IMP3267_BAND = Object.freeze({ lo: 1.895e-4, hi: 1.905e-4 });
const IMP3343_U6_LADDER_LIMIT = 1.9014e-4; // shallower U=6 Richardson (imp-3343), 3-s.f. consistent

export const IMP3345_VHS_RICHARDSON_LIMIT = Object.freeze({
  id: 'imp-3345-vhs-richardson-limit',
  ticket: 'imp-3345',
  generatedAt: '2026-07-03T00:00:00Z',
  category: 'numerical',
  cell: Object.freeze({ NPHI: 10, a: 0.5, U: 5, matchedStep: 'h = 5/N' }),

  summary:
    'Richardson-extrapolates the imp-3256 matched-h ||V||_HS sequence (N=500..8000, h halving) ' +
    'to its h->0 limit. The measured order ratio is 4.000 (clean O(h^2) midpoint convergence), ' +
    'and the level-1 tableau collapses to 1.9003171e-4, stable to 1e-13. DECISION: the 3-sig-fig ' +
    'headline 1.90e-4 is resolution-stable (the limit rounds to it), while the sharper continuum ' +
    'value is 1.90032e-4 (~1.9003e-4) -- the raw N=8000 point 1.9002884e-4 is itself ~0.0015% ' +
    'short of the limit, so the creep is convergent. The limit sits +0.0968% above the imp-1267 ' +
    'N=1000 anchor 1.8984785338e-4 and lands inside the imp-3267 band [1.895e-4,1.905e-4]. The ' +
    '4th significant figure is NOT pinned: the imp-3343 U=6 ladder extrapolates to ~1.9014e-4 ' +
    '(agrees to 3 s.f., differs ~0.06% at the 4th).',

  sequence: MATCHED_H_SEQUENCE,
  convergenceOrderRatios: Object.freeze(_orderRatios),
  measuredOrderP: 2,
  richardsonTableau: Object.freeze(_tableau.map((c) => Object.freeze(c.slice()))),
  richardsonLevel1: Object.freeze(_level1.slice()),

  extrapolatedLimit: _extrapolatedLimit,
  extrapolationErrorProxyAbs: _level1LastSpread,
  extrapolationErrorBarAbs: 5e-13, // conservative; storage precision (1e-14/input) is the true limiter

  imp1267_N1000_anchor: IMP1267_N1000_ANCHOR,
  verdict_headline_3sf: VERDICT_HEADLINE,
  sharper_value_5sf: 1.9003e-4,
  imp3267_band: IMP3267_BAND,
  imp3343_U6_ladder_limit: IMP3343_U6_LADDER_LIMIT,

  creep: Object.freeze({
    limitVsN1000AnchorPct: (_extrapolatedLimit - IMP1267_N1000_ANCHOR) / IMP1267_N1000_ANCHOR * 100,
    limitVsHeadlinePct: (_extrapolatedLimit - VERDICT_HEADLINE) / VERDICT_HEADLINE * 100,
    finestPointShortOfLimitPct:
      (_extrapolatedLimit - _raw[_raw.length - 1]) / _extrapolatedLimit * 100,
  }),

  decision: Object.freeze({
    resolutionStableHeadline_3sf: 1.90e-4,
    resolutionStableHeadlineIsCorrect: true,
    sharperContinuumValue: 1.90032e-4,
    creepIsConvergentNotDivergent: true,
    fourthSigFigPinned: false,
    fourthSigFigFamilyDependent:
      'imp-3256 U=5 halving ladder -> 1.90032e-4; imp-3343 U=6 ladder -> 1.9014e-4; ' +
      'the two agree to 3 s.f. but differ ~0.06% at the 4th',
    landsInImp3267Band: true,
  }),

  honestScope: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    scope: 'deterministic Richardson extrapolation of a frozen sequence, RH-EQUIVALENT',
    residualOpen: 'operator-positivity K_a >= 0 (imp-3066 endpoint-Hankel, untouched)',
    sota: 'No refereed bound is changed',
    namedSubGap:
      'the 4th significant figure of the continuum ||V||_HS is not pinned -- the imp-3256 U=5 ' +
      'and imp-3343 U=6 refinement families extrapolate to values ~0.06% apart; a shared-grid, ' +
      'matched-U extrapolation deeper than either current ladder is needed to resolve it',
  }),
});

export const IMP3345_VHS_RICHARDSON_ASSERTIONS = [
  {
    id: 'imp3345-order-ratio-is-quadratic',
    why:
      'The successive differences of the matched-h sequence must shrink by a factor ~4 (= 2^2) ' +
      'as h halves, certifying O(h^2) midpoint convergence and justifying the divisor-3 leading ' +
      'Richardson step. If the ratio is not ~4 the extrapolation would use the wrong order.',
    holds: () =>
      IMP3345_VHS_RICHARDSON_LIMIT.convergenceOrderRatios.every(
        (r) => Math.abs(r - 4) < 0.05,
      ),
  },
  {
    id: 'imp3345-level1-tableau-collapses',
    why:
      'The level-1 Richardson extrapolants must converge dramatically: the spread of the last ' +
      'two must be < 1e-12 absolute, orders of magnitude tighter than the ~1.7e-6 raw sequence ' +
      'spread. A non-collapsing tableau would mean the extrapolation is not resolving a limit.',
    holds: () => IMP3345_VHS_RICHARDSON_LIMIT.extrapolationErrorProxyAbs < 1e-12,
  },
  {
    id: 'imp3345-limit-value-and-3sf-headline',
    why:
      'The extrapolated h->0 limit must land at ~1.9003171e-4 and round to the verdict headline ' +
      '1.90e-4 at 3 significant figures. This is the decision core: the 3-s.f. headline is ' +
      'resolution-stable iff the continuum limit rounds to it.',
    holds: () => {
      const v = IMP3345_VHS_RICHARDSON_LIMIT;
      return (
        Math.abs(v.extrapolatedLimit - 1.9003171e-4) / 1.9003171e-4 < 1e-6 &&
        Number(v.extrapolatedLimit.toPrecision(3)) === v.verdict_headline_3sf
      );
    },
  },
  {
    id: 'imp3345-sharper-value-is-1p9003e-4',
    why:
      'The sharper resolution-converged value must round to 1.9003e-4 at 5 significant figures ' +
      '(the "~1.9003e-4" imp-3256 saw the sequence creeping toward), and the raw finest N=8000 ' +
      'point must still sit strictly BELOW the limit (convergent-from-below creep).',
    holds: () => {
      const v = IMP3345_VHS_RICHARDSON_LIMIT;
      const finest = v.sequence[v.sequence.length - 1].hs;
      return (
        Number(v.extrapolatedLimit.toPrecision(5)) === v.sharper_value_5sf &&
        finest < v.extrapolatedLimit &&
        v.creep.finestPointShortOfLimitPct > 0
      );
    },
  },
  {
    id: 'imp3345-limit-in-imp3267-band',
    why:
      'The extrapolated continuum ||V||_HS must sit inside the imp-3267 L2 lock band ' +
      '[1.895e-4, 1.905e-4]; otherwise the h->0 limit would contradict the locked verdict.',
    holds: () => {
      const v = IMP3345_VHS_RICHARDSON_LIMIT;
      return (
        v.extrapolatedLimit >= v.imp3267_band.lo && v.extrapolatedLimit <= v.imp3267_band.hi
      );
    },
  },
  {
    id: 'imp3345-family-agreement-at-3sf-not-4sf',
    why:
      'HONEST-BOUNDARY CHECK: the imp-3256 U=5 ladder limit and the imp-3343 U=6 ladder limit ' +
      'must agree to 3 significant figures (both round to 1.90e-4) but differ at the 4th, ' +
      'confirming the 4th-sig-fig sub-gap is real and the 4-s.f. value is family-dependent.',
    holds: () => {
      const v = IMP3345_VHS_RICHARDSON_LIMIT;
      const a3 = Number(v.extrapolatedLimit.toPrecision(3));
      const b3 = Number(v.imp3343_U6_ladder_limit.toPrecision(3));
      const relGap = Math.abs(v.extrapolatedLimit - v.imp3343_U6_ladder_limit) /
        v.extrapolatedLimit;
      return (
        a3 === b3 && a3 === 1.90e-4 &&
        relGap > 1e-4 && relGap < 1e-2 &&
        v.decision.fourthSigFigPinned === false
      );
    },
  },
  {
    id: 'imp3345-honest-scope-not-proof',
    why:
      'MANDATORY HONESTY GATE: deterministic extrapolation of a frozen sequence only, ' +
      'RH-EQUIVALENT, not a proof or reduction; imp-3066 operator positivity stays open and ' +
      'no refereed bound is changed. If these flags flip the module over-claims.',
    holds: () => {
      const h = IMP3345_VHS_RICHARDSON_LIMIT.honestScope;
      return (
        h.isProof === false &&
        h.isReductionBelowRH === false &&
        h.scope.includes('RH-EQUIVALENT') &&
        h.sota.includes('efereed bound is changed') &&
        typeof h.namedSubGap === 'string' && h.namedSubGap.length > 0
      );
    },
  },
];

for (const assertion of IMP3345_VHS_RICHARDSON_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error('imp-3345-vhs-richardson-limit assertion failed: ' + assertion.id);
  }
}

export default IMP3345_VHS_RICHARDSON_LIMIT;
