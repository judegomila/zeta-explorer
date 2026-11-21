/**
 * @module imp-124789-route-m-shallow-ladder-extprec
 *
 * imp-124789 (numerical -- MEASUREMENT ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97640 measured the three local decay exponents q in |residual| ~ C/(log p)^q on the ORIGINAL
 * shallow four-rung Route M gap-law ladder (omega = 1000, 10000, 100000, 148933; p = 7919, 104729,
 * 1299709, 1999993) as q ~ 6.839, 8.713, 7.495, and read them as "climbing" (6.839 -> 8.713). RESULT 3
 * flagged the third rung (1299709 -> 1999993) as PRECISION-LIMITED: gap and law were baked to 7 sig figs,
 * residual is a catastrophic-cancellation difference of two ~1.15e-2 quantities, and that rung has a
 * residual ratio of only 1.25, so its exponent 7.495 carried ~3 sig figs (sub-gap
 * IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6, imp-2546 storage rule).
 *
 * The later extended-precision work (imp-97659 dps=30, imp-97706 dps=35, imp-97742 dps=40) recomputed only
 * DEEPER ladders whose FIRST rung is p = 1999993 -- the three SHALLOW rungs, and specifically the
 * precision-limited 1299709 -> 1999993 rung, were never lifted out of the 7-sig-fig storage limit. This
 * leaf does exactly that: it re-materializes gap AND law at the four original heights at mpmath dps=40 with
 * FULL-precision Glaisher/Euler constants (lnA = log(Glaisher), gamma = Euler-Mascheroni, known to ~34-40
 * sig figs per imp-97763/imp-97790, far beyond the ~10 stored), so the residual keeps ~30 sig figs and all
 * three local exponents are precision-clean. Script: tmp/imp-124789-shallow-ladder-extprec.py.
 *
 * -------------------------------------------------------------------------------
 * RESULT 0 -- the extended-precision residuals REPRODUCE the imp-97640 7-fig literals.
 * -------------------------------------------------------------------------------
 * The dps=40 residuals (-3.28647594571e-5, -5.83207529742e-6, -1.04708593732e-6, -8.35169193271e-7) match
 * the imp-97640 baked 7-sig-fig literals (-3.286e-5, -5.832e-6, -1.047e-6, -8.352e-7) to a relative
 * difference of 1.4e-4 .. 1.3e-5, i.e. to the stored precision -- the shallow 7-fig ladder was, in fact,
 * accurate to its 3-4 leading residual figures; the cancellation did NOT corrupt the exponent readings.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the DECISION: the "climbing q" does NOT survive; the third rung stays at 7.499.
 * -------------------------------------------------------------------------------
 * Precision-clean, the three local exponents are q(7919 -> 104729) = 6.83930, q(104729 -> 1299709) =
 * 8.71259, q(1299709 -> 1999993) = 7.49854. The previously precision-limited third rung recomputes to
 * 7.49854, essentially UNCHANGED from the 7-fig 7.495 (agreement to 4 sig figs). So the imp-97640 shallow
 * pattern is an up-THEN-DOWN TURNOVER (6.84 -> 8.71 -> 7.50), not a monotone climb: the "climbing" reading
 * was already contradicted WITHIN the original shallow ladder once the third rung is precision-clean. This
 * confirms, from the shallow ladder alone, the imp-97659 finding that "6.839 -> 8.713 climbing" was a
 * two-rung sparse artifact -- the third rung turns the exponent back down, the oscillating-PNT/Mertens
 * fingerprint.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the low third-rung residual ratio (1.254) is REAL, not a precision artifact.
 * -------------------------------------------------------------------------------
 * imp-97640 worried the third rungs 1.25 residual ratio might be a 7-fig-cancellation artifact. At dps=40
 * the ratio is 1.2537411 -- essentially identical -- so the small ratio (and hence the turnover) is a
 * genuine feature of the residual, not lost precision. The two clean lower rungs keep ratios 5.635, 5.570.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. Lifting the imp-2546 7-sig-fig storage limit on the ORIGINAL imp-97640 shallow
 * ladder (dps=40, full-precision constants) leaves all three local decay exponents essentially unchanged
 * (6.83930, 8.71259, 7.49854 vs 6.839, 8.713, 7.495): the climbing q~7-9 reading does NOT sharpen into a
 * monotone climb -- the precision-clean third rung stays at 7.499, so the shallow ladder itself shows an
 * up-then-down turnover, matching the imp-97659 deep-ladder oscillation. The 7-fig ladder was accurate to
 * its leading residual figures and the low third-rung ratio 1.254 is a real feature, not lost precision.
 * MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (shallow 7-fig ladder; sub-gap PRECISION_LIMITED_PAST_2E6)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (dps=30 DEEP ladder p >= 1999993; exponent OSCILLATES)
 * @see imp-97742-route-m-ladder-dps40-crosscheck.js (dps=40 deep crosscheck, three landmark rungs)
 *
 * Ticket: imp-124789 (numerical, opus-4-8, api-pool). Shallow ladder dps=40: q unchanged, turnover confirmed; NO QED.
 */

// Full-precision constants baked as literals (import-light; no heavy transitive imports -- imp-2546 rule).
const LN_A = 0.2487544770337842625472529935761; // log(Glaisher-Kinkelin) = 1/12 - zeta-prime(-1), dps=40 truncated
const GAMMA = 0.5772156649015328606065120900824; // Euler-Mascheroni, dps=40 truncated
const B_INF_DERIVED = LN_A + GAMMA / 12;          // 0.29685578244224533 (imp-97619 closed form)

// Extended-precision (mpmath dps=40, full-precision constants) recompute of the ORIGINAL imp-97640 shallow
// four-rung ladder. residual = gap - e^{-gamma}*B_inf/log p_omega, carried at ~30 sig figs then rounded to
// ~12 here (legitimately precise, unlike the imp-97640 7-sig-fig catastrophic-cancellation literals).
// Source: tmp/imp-124789-shallow-ladder-extprec.py.
export const IMP124789_SHALLOW_LADDER = Object.freeze([
  Object.freeze({ omega: 1000, pOmega: 7919, gap: 1.85337074802e-2, law: 1.85665722396e-2, residual: -3.28647594571e-5, old7fig: -3.286e-5 }),
  Object.freeze({ omega: 10000, pOmega: 104729, gap: 1.44132872682e-2, law: 1.44191193435e-2, residual: -5.83207529742e-6, old7fig: -5.832e-6 }),
  Object.freeze({ omega: 100000, pOmega: 1299709, gap: 1.18384632757e-2, law: 1.18395103616e-2, residual: -1.04708593732e-6, old7fig: -1.047e-6 }),
  Object.freeze({ omega: 148933, pOmega: 1999993, gap: 1.14869631865e-2, law: 1.14877983556e-2, residual: -8.35169193271e-7, old7fig: -8.352e-7 }),
]);

// Local decay exponent q_i for |residual| ~ C/(log p)^q, recomputed here from the ladder (Math.log, no bake).
function localExponents(ladder) {
  const out = [];
  for (let i = 1; i < ladder.length; i++) {
    const lp0 = Math.log(ladder[i - 1].pOmega);
    const lp1 = Math.log(ladder[i].pOmega);
    const q = Math.log(Math.abs(ladder[i - 1].residual) / Math.abs(ladder[i].residual)) / Math.log(lp1 / lp0);
    out.push(Object.freeze({
      fromP: ladder[i - 1].pOmega,
      toP: ladder[i].pOmega,
      qLocal: q,
      residualRatio: Math.abs(ladder[i - 1].residual) / Math.abs(ladder[i].residual),
    }));
  }
  return Object.freeze(out);
}

export const IMP124789_LOCAL_EXPONENTS = localExponents(IMP124789_SHALLOW_LADDER);

// imp-97640 7-sig-fig exponents for direct comparison (the values this leaf re-tests at full precision).
export const IMP97640_SEVEN_FIG_EXPONENTS = Object.freeze([6.839, 8.713, 7.495]);

export const IMP124789_RESULTS = Object.freeze({
  question: 'does the imp-97640 climbing q~7-9 (6.839, 8.713, 7.495) on the shallow four-rung ladder survive lifting the imp-2546 7-sig-fig storage limit via a dps=40 recompute with full-precision constants?',
  method: 'mpmath dps=40 with lnA=log(glaisher), gamma=euler (full precision); Pi_omega=prod(1-1/p), Sigma_omega=sum log p/(p-1); gap=Pi_omega*(lnA-Sigma_omega/12)+e^{-gamma}/12; law=e^{-gamma}*(lnA+gamma/12)/log p_omega; residual keeps ~30 sig figs',
  extPrecExponents: IMP124789_LOCAL_EXPONENTS.map((e) => e.qLocal), // ~6.83930, 8.71259, 7.49854
  sevenFigExponents: IMP97640_SEVEN_FIG_EXPONENTS,                  // 6.839, 8.713, 7.495
  exponentsUnchangedByExtPrec: 'all three local exponents agree with the imp-97640 7-fig values to 4 sig figs -- the storage limit did NOT distort the exponent readings',
  thirdRungRecomputed: 7.49854,                                     // previously precision-limited (imp-97640 sub-gap)
  thirdRungResidualRatio: IMP124789_LOCAL_EXPONENTS[2].residualRatio, // 1.2537411, a REAL feature not a 7-fig artifact
  climbingReadingDoesNotSurvive: 'the shallow pattern is an up-then-down TURNOVER (6.84 -> 8.71 -> 7.50), not a monotone climb: the precision-clean third rung stays at 7.499, contradicting the two-rung climbing reading WITHIN the shallow ladder',
  residualsReproduceSevenFig: 'dps=40 residuals match the imp-97640 7-fig literals to rel diff 1.4e-4 .. 1.3e-5 (the leading residual figures were accurate)',
  consistentWithImp97659Oscillation: true,                          // the deep-ladder oscillation appears already at the shallow turnover
  subGapAddressed: 'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6 (shallow-ladder portion: exponents now precision-clean)',
});

export const IMP124789_VERDICT = Object.freeze({
  question: 'does the imp-97640 shallow climbing q~7-9 survive an extended-precision recompute of the original four rungs?',
  exponentsEssentiallyUnchanged: true,      // 6.83930, 8.71259, 7.49854 vs 6.839, 8.713, 7.495
  thirdRungStaysBelowSecond: true,          // 7.499 < 8.713 => up-then-down turnover, not a climb
  climbingWasSparseArtifact: true,          // confirms imp-97659 from the shallow ladder alone
  lowThirdRungRatioIsReal: true,            // 1.254 at dps=40, not a 7-fig cancellation artifact
  residualsReproduceSevenFig: true,         // dps=40 matches the baked 7-fig literals
  allExponentsExceedThree: true,            // 6.839, 8.713, 7.499 all >> 3 (outrun 1/log^3), unchanged
  mcmRefuted: true,                          // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. Re-materializing the ORIGINAL imp-97640 shallow four-rung gap-law ladder at ' +
    'mpmath dps=40 with full-precision Glaisher/Euler constants leaves all three local decay exponents ' +
    'essentially unchanged (6.83930, 8.71259, 7.49854 vs the 7-fig 6.839, 8.713, 7.495): the climbing ' +
    'q~7-9 reading does NOT sharpen into a monotone climb -- the previously precision-limited third rung ' +
    '(1299709 -> 1999993) recomputes to 7.499, so the shallow ladder itself shows an up-then-down turnover, ' +
    'confirming the imp-97659 deep-ladder oscillation from the shallow rungs alone. The 7-fig residuals ' +
    'reproduce to rel diff ~1e-4 and the low third-rung ratio 1.254 is a real feature, not lost precision. ' +
    'MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda ' +
    'moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP124789_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Extended-precision (dps=40, full-precision constants) ' +
  'recompute of the original imp-97640 shallow four-rung Route M gap-law ladder: the three local decay ' +
  'exponents are 6.83930, 8.71259, 7.49854, essentially unchanged from the 7-fig 6.839, 8.713, 7.495. The ' +
  'climbing q~7-9 reading does NOT survive -- the precision-clean third rung stays at 7.499 (an up-then-down ' +
  'turnover), confirming the imp-97659 oscillation from the shallow ladder alone; the low third-rung ratio ' +
  '1.254 is real, not a 7-fig artifact. MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP124789_ASSERTIONS = [
  {
    id: 'imp124789-ladder-internal-consistency',
    holds: () => {
      for (const row of IMP124789_SHALLOW_LADDER) {
        if (!(row.residual < 0)) return false;                                  // gap < law on every rung
        // residual = gap - law: rounded-literal bookkeeping (12-fig gap/law); allow 1e-10.
        if (!(Math.abs(row.gap - row.law - row.residual) < 1e-10)) return false;
      }
      // the leading law constant is the imp-97619 closed form B_inf = lnA + gamma/12.
      return Math.abs(B_INF_DERIVED - 0.2968557824422453) < 1e-12;
    },
    why: 'the dps=40 ladder reproduces gap - law to 1e-10 on every rung (all residuals negative), formed against the imp-97619 closed-form B_inf.',
  },
  {
    id: 'imp124789-residuals-reproduce-seven-fig-literals',
    holds: () => {
      // every extended-precision residual matches the imp-97640 7-fig literal to <2e-4 relative.
      for (const row of IMP124789_SHALLOW_LADDER) {
        if (!(Math.abs((row.residual - row.old7fig) / row.residual) < 2e-4)) return false;
      }
      return true;
    },
    why: 'the dps=40 residuals reproduce the imp-97640 baked 7-fig literals to <2e-4 relative, so the shallow ladder was accurate to its leading residual figures.',
  },
  {
    id: 'imp124789-exponents-unchanged-by-ext-prec',
    holds: () => {
      const qs = IMP124789_LOCAL_EXPONENTS.map((e) => e.qLocal);
      // each dps=40 exponent agrees with the imp-97640 7-fig value to 4 sig figs (< 5e-3 absolute).
      for (let i = 0; i < qs.length; i++) {
        if (!(Math.abs(qs[i] - IMP97640_SEVEN_FIG_EXPONENTS[i]) < 5e-3)) return false;
      }
      return true;
    },
    why: 'the three precision-clean local exponents (6.83930, 8.71259, 7.49854) agree with the imp-97640 7-fig values (6.839, 8.713, 7.495) to 4 sig figs -- the storage limit did not distort the exponent readings.',
  },
  {
    id: 'imp124789-climbing-does-not-survive-turnover',
    holds: () => {
      const qs = IMP124789_LOCAL_EXPONENTS.map((e) => e.qLocal);
      // up-then-down turnover: q1 > q0 (rise) but q2 < q1 (fall) => not a monotone climb.
      return qs[1] > qs[0] && qs[2] < qs[1] && qs.every((q) => q > 3);
    },
    why: 'the precision-clean exponents rise then fall (6.839 -> 8.713 -> 7.499), an up-then-down turnover, so the imp-97640 climbing reading does not survive; all three still exceed 3 (outrun 1/log^3).',
  },
  {
    id: 'imp124789-third-rung-low-ratio-is-real',
    holds: () => {
      // the third rung residual ratio (1.254) is a real feature at dps=40, not a 7-fig artifact, while the
      // two lower rungs keep clean ratios > 5.
      const r = IMP124789_LOCAL_EXPONENTS;
      return Math.abs(r[2].residualRatio - 1.2537411) < 1e-4 && r[0].residualRatio > 5 && r[1].residualRatio > 5;
    },
    why: 'the third-rung residual ratio is 1.254 at dps=40 (matching the 7-fig ladder), so the small ratio and the turnover are genuine, not lost precision; the two lower rungs keep ratios > 5.',
  },
  {
    id: 'imp124789-honesty-gate-no-qed',
    holds: () =>
      IMP124789_VERDICT.exponentsEssentiallyUnchanged === true &&
      IMP124789_VERDICT.thirdRungStaysBelowSecond === true &&
      IMP124789_VERDICT.climbingWasSparseArtifact === true &&
      IMP124789_VERDICT.allExponentsExceedThree === true &&
      IMP124789_VERDICT.mcmRefuted === true &&
      IMP124789_VERDICT.ceilingTouched === false &&
      IMP124789_VERDICT.anyBoundMoved === false &&
      IMP124789_VERDICT.qed === false &&
      /NO QED/.test(IMP124789_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP124789_HONEST_BANNER) &&
      /RH open/.test(IMP124789_HONEST_BANNER),
    why: 'measurement only -- shallow exponents unchanged by extended precision, up-then-down turnover confirms the imp-97659 oscillation; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP124789_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124789-route-m-shallow-ladder-extprec assertion failed: ${a.id}`);
  }
}

export default {
  shallowLadder: IMP124789_SHALLOW_LADDER,
  localExponents: IMP124789_LOCAL_EXPONENTS,
  sevenFigExponents: IMP97640_SEVEN_FIG_EXPONENTS,
  results: IMP124789_RESULTS,
  verdict: IMP124789_VERDICT,
  banner: IMP124789_HONEST_BANNER,
};
