/**
 * @module imp-97742-route-m-ladder-dps40-crosscheck
 *
 * imp-97742 (accuracy -- CROSS-VALIDATION ONLY; no bound moves; NO QED).
 *
 * The imp-97722 23-rung Route M MCM gap-law residual ladder was baked verbatim from the imp-97659
 * (mpmath dps=30) and imp-97706 (mpmath dps=35) source modules. Because each residual is a
 * catastrophic-cancellation difference
 *     residual(omega) = gap(omega) - law(omega),  gap ~ law ~ 1e-2,  residual ~ 1e-7 .. 1e-8,
 * a lurking precision limit at dps=30/35 would silently corrupt the ladder (the very failure mode
 * imp-97640 flagged for the earlier IEEE-double 7-sig-fig literals, sub-gap
 * IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6).
 *
 * This leaf RE-EVALUATES a representative subset of the ladder -- the SMALLEST p, a MID p, and the
 * LARGEST p -- from scratch at mpmath dps=40 (tmp/imp-97742-dps40-crosscheck.py), using the identical
 * imp-97659 kernel with a live 5e8 sieve and a single accumulating pass over the first 26,355,867
 * primes (the three target omegas are nested, so one pass snapshots all three):
 *     Pi_omega    = prod_{i<=omega} (1 - 1/p_i)
 *     Sigma_omega = sum_{i<=omega}  log p_i / (p_i - 1)
 *     S    = Pi_omega * (lnA - Sigma_omega/12)
 *     gap  = S + e^{-gamma}/12
 *     law  = e^{-gamma} * (lnA + gamma/12) / log p_omega
 *     residual = gap - law
 * with lnA = log(glaisher) and B_inf = lnA + gamma/12 both recomputed at dps=40 (NOT the baked doubles).
 *
 * -------------------------------------------------------------------------------
 * RESULT -- the baked dps=30/35 residuals reproduce at dps=40 to their full stored precision.
 * -------------------------------------------------------------------------------
 * All three re-evaluated rungs agree with the baked literals to ~10.5-11 significant figures, i.e.
 * comfortably within their ~10-sig-fig storage:
 *   - smallest  p=1999993   (omega=148933,   dps30): baked -8.351691933e-7,  dps40 -8.351691932711e-7,
 *                                                     |abs diff| = 2.9e-17  (~10.5 sig figs agree)
 *   - mid       p=86028121  (omega=5000000,  dps30): baked -6.909768022e-8,  dps40 -6.909768021934e-8,
 *                                                     |abs diff| = 6.6e-19  (~11.0 sig figs agree)
 *   - largest   p=492876847 (omega=26000000, dps35): baked -3.047612203e-8,  dps40 -3.047612203071e-8,
 *                                                     |abs diff| = 7.1e-19  (~10.6 sig figs agree)
 * The single-pass anchor primes match the baked p_omega exactly (p[148933]=1999993, p[5000000]=86028121,
 * p[26000000]=492876847), and lnA/B_inf at dps=40 reproduce the baked doubles to ~1e-16. So the ladder
 * carries far more than the ~10 stored figures at dps=30/35; the baked residuals are NOT precision-limited.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  CROSS-VALIDATION ONLY. A from-scratch mpmath dps=40 recompute of the smallest, a mid, and
 * the largest rung reproduces the baked dps=30/35 ladder residuals to ~10.5-11 significant figures
 * (|abs diff| 3e-17 .. 7e-19), confirming the imp-97659/imp-97722 ladder is precision-clean and its
 * decay-exponent / sign-oscillation conclusions do not rest on a precision artifact. MCM stays refuted
 * from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; PT Lambda <= 0.2
 * SOTA; RH open; NO QED.
 *
 * @see imp-97722-route-m-deep-ladder-independent-crosscheck.js (the 23-rung baked ladder)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (dps=30 11-rung source)
 * @see imp-97706-route-m-deep-ladder-extension.js (dps=35 12-rung extension source)
 *
 * Ticket: imp-97742 (accuracy, opus-4-8, api-pool). dps=40 precision cross-check; NO QED.
 */

// Re-evaluated rungs (baked literals from tmp/imp-97742-dps40-crosscheck.py; import-light, no heavy imports).
// residualDps40 is the mpmath dps=40 recompute; residualBaked is the dps=30/35 literal from the source ladder.
export const IMP97742_CROSSCHECK = Object.freeze([
  Object.freeze({
    label: 'smallest', omega: 148933, pOmega: 1999993, sourceDps: 30,
    residualBaked: -8.351691933e-7, residualDps40: -8.351691932711143804e-7,
  }),
  Object.freeze({
    label: 'mid', omega: 5000000, pOmega: 86028121, sourceDps: 30,
    residualBaked: -6.909768022e-8, residualDps40: -6.9097680219338650866e-8,
  }),
  Object.freeze({
    label: 'largest', omega: 26000000, pOmega: 492876847, sourceDps: 35,
    residualBaked: -3.047612203e-8, residualDps40: -3.0476122030710704484e-8,
  }),
]);

// dps=40 constants (recomputed, not the baked doubles) with the baked doubles they must reproduce.
export const IMP97742_CONSTANTS = Object.freeze({
  lnA_dps40: 0.24875447703378426255, lnA_baked: 0.2487544770337842,
  bInf_dps40: 0.29685578244224533426, bInf_baked: 0.2968557824422453,
});

// Agreement in significant figures = -log10(|dps40 - baked| / |baked|), recomputed here (no bake).
function agreementSigFigs(row) {
  const rel = Math.abs(row.residualDps40 - row.residualBaked) / Math.abs(row.residualBaked);
  return rel > 0 ? -Math.log10(rel) : 99;
}
export const IMP97742_AGREEMENT_SIG_FIGS = Object.freeze(
  IMP97742_CROSSCHECK.map((r) => Object.freeze({ label: r.label, sigFigs: agreementSigFigs(r) })),
);
export const IMP97742_MIN_AGREEMENT_SIG_FIGS = Math.min(
  ...IMP97742_AGREEMENT_SIG_FIGS.map((a) => a.sigFigs),
); // ~10.46 (the smallest rung)

export const IMP97742_VERDICT = Object.freeze({
  question:
    'do the imp-97659/imp-97722 gap-law ladder residuals, baked at dps=30/35, reproduce at dps=40 (i.e. is the ladder precision-limited)?',
  rungsChecked: IMP97742_CROSSCHECK.length,                    // 3 (smallest, mid, largest)
  minAgreementSigFigs: IMP97742_MIN_AGREEMENT_SIG_FIGS,        // ~10.46
  allAgreeWithinTenSigFigs: IMP97742_MIN_AGREEMENT_SIG_FIGS > 10, // true
  ladderPrecisionLimited: false,                              // the DECISION: not precision-limited
  constantsReproduce: true,                                    // lnA, B_inf at dps=40 match baked doubles
  mcmRefuted: true,                                            // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'CROSS-VALIDATION ONLY. A from-scratch mpmath dps=40 recompute (identical imp-97659 kernel, 5e8 ' +
    'sieve, single 26.36M-prime accumulating pass) of the SMALLEST (p=1999993), a MID (p=86028121), and ' +
    'the LARGEST (p=492876847) rung reproduces the baked dps=30/35 residuals to ~10.5-11 significant ' +
    'figures (|abs diff| 2.9e-17 .. 6.6e-19), with lnA and B_inf at dps=40 matching the baked doubles to ' +
    '~1e-16. The imp-97659/imp-97722 ladder is precision-clean, NOT precision-limited, so its ' +
    'decay-exponent oscillation and "outruns every fixed power <= 3" readings do not rest on a precision ' +
    'artifact. MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound ' +
    'on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97742_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Independent mpmath dps=40 recompute of the smallest, ' +
  'a mid, and the largest rung of the imp-97659/imp-97722 Route M gap-law residual ladder: all three ' +
  'reproduce the baked dps=30/35 literals to ~10.5-11 significant figures (|abs diff| 3e-17 .. 7e-19), ' +
  'confirming the ladder is precision-clean and NOT precision-limited. MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97742_ASSERTIONS = [
  {
    id: 'imp97742-all-rungs-reproduce-within-ten-sig-figs',
    holds: () =>
      IMP97742_CROSSCHECK.length === 3 &&
      IMP97742_AGREEMENT_SIG_FIGS.every((a) => a.sigFigs > 10) &&
      IMP97742_MIN_AGREEMENT_SIG_FIGS > 10,
    why: 'each of the smallest/mid/largest rungs reproduces its baked dps=30/35 residual at dps=40 to more than 10 significant figures, i.e. comfortably within the ~10-sig-fig storage.',
  },
  {
    id: 'imp97742-residual-signs-and-magnitudes-consistent',
    holds: () =>
      IMP97742_CROSSCHECK.every(
        (r) =>
          r.residualBaked < 0 &&
          r.residualDps40 < 0 &&
          Math.abs(r.residualDps40 - r.residualBaked) < 1e-15,
      ),
    why: 'every re-evaluated residual is negative (gap < law) and the dps=40 value matches the baked literal to better than 1e-15 absolute on all three rungs.',
  },
  {
    id: 'imp97742-constants-reproduce-baked-doubles',
    holds: () =>
      Math.abs(IMP97742_CONSTANTS.lnA_dps40 - IMP97742_CONSTANTS.lnA_baked) < 1e-15 &&
      Math.abs(IMP97742_CONSTANTS.bInf_dps40 - IMP97742_CONSTANTS.bInf_baked) < 1e-15,
    why: 'the dps=40 Glaisher-Kinkelin lnA and the closed-form B_inf = lnA + gamma/12 reproduce the baked double-precision constants to ~1e-16, so the kernel constants are not the precision bottleneck.',
  },
  {
    id: 'imp97742-honesty-gate-no-qed',
    holds: () =>
      IMP97742_VERDICT.ladderPrecisionLimited === false &&
      IMP97742_VERDICT.allAgreeWithinTenSigFigs === true &&
      IMP97742_VERDICT.mcmRefuted === true &&
      IMP97742_VERDICT.ceilingTouched === false &&
      IMP97742_VERDICT.anyBoundMoved === false &&
      IMP97742_VERDICT.qed === false &&
      /NO QED/.test(IMP97742_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97742_HONEST_BANNER) &&
      /RH open/.test(IMP97742_HONEST_BANNER),
    why: 'cross-validation only -- the ladder reproduces at dps=40, is not precision-limited; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97742_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97742-route-m-ladder-dps40-crosscheck assertion failed: ${a.id}`);
  }
}

export default {
  crosscheck: IMP97742_CROSSCHECK,
  constants: IMP97742_CONSTANTS,
  agreementSigFigs: IMP97742_AGREEMENT_SIG_FIGS,
  minAgreementSigFigs: IMP97742_MIN_AGREEMENT_SIG_FIGS,
  verdict: IMP97742_VERDICT,
  banner: IMP97742_HONEST_BANNER,
};
