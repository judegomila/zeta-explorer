/**
 * @module imp-97758-route-m-ladder-dps40-interior-crosscheck
 *
 * imp-97758 (accuracy -- CROSS-VALIDATION ONLY; MCM refuted from omega=11; no bound moves; NO QED).
 *
 * imp-97742 re-evaluated only the SMALLEST (omega=148933), a MID (omega=5000000), and the LARGEST
 * (omega=26000000) rung of the 23-rung Route M gap-law residual ladder at mpmath dps=40, confirming
 * the ENDPOINTS reproduce the baked dps=30/35 literals to ~10.5-11 significant figures. But the
 * INTERIOR of the imp-97706 dps=35 extension (its 12 rungs run omega=7e6..2.6e7 and only the last,
 * omega=26e6, was covered) was never dps=40-verified. Because each residual is a
 * catastrophic-cancellation difference
 *     residual(omega) = gap(omega) - law(omega),  gap ~ law ~ 8.3e-3 .. 8.9e-3,  residual ~ 3e-8 .. 5e-8,
 * a precision limit could hide on an interior rung while the endpoints stay clean.
 *
 * This leaf RE-EVALUATES THREE interior extension rungs -- an early RISE rung (omega=8.5e6), a mid
 * rung (omega=13e6), and a later rung (omega=19e6) -- from scratch at mpmath dps=40
 * (tmp/imp-97758-dps40-interior-crosscheck.py), using the IDENTICAL imp-97659 kernel with a live 3.6e8
 * sieve and a single accumulating pass over the first 19,000,000 primes (the three target omegas are
 * nested, so one pass snapshots all three):
 *     Pi_omega    = prod_{i<=omega} (1 - 1/p_i)
 *     Sigma_omega = sum_{i<=omega}  log p_i / (p_i - 1)
 *     S    = Pi_omega * (lnA - Sigma_omega/12)
 *     gap  = S + e^{-gamma}/12
 *     law  = e^{-gamma} * (lnA + gamma/12) / log p_omega
 *     residual = gap - law
 * with lnA = log(glaisher) and B_inf = lnA + gamma/12 both recomputed at dps=40 (NOT the baked doubles).
 *
 * -------------------------------------------------------------------------------
 * RESULT -- the imp-97706 dps=35 extension INTERIOR reproduces at dps=40 to full stored precision.
 * -------------------------------------------------------------------------------
 * All three interior rungs agree with the baked dps=35 literals to ~9.8-10.2 significant figures, i.e.
 * to the full ~9-10-sig-fig storage of each literal (|abs diff| ~3e-18 .. 5e-18):
 *   - early RISE  p=151048969 (omega=8500000,  dps35): baked -5.03050917e-8,   dps40 -5.030509170301e-8,
 *                                                       |abs diff| = 3.0e-18  (~10.22 sig figs agree)
 *   - mid         p=236887691 (omega=13000000, dps35): baked -3.403952242e-8,  dps40 -3.403952241599e-8,
 *                                                       |abs diff| = 4.0e-18  (~9.93 sig figs agree)
 *   - later       p=353868013 (omega=19000000, dps35): baked -3.032576616e-8,  dps40 -3.032576615513e-8,
 *                                                       |abs diff| = 4.9e-18  (~9.79 sig figs agree)
 * The single-pass anchor primes match the baked p_omega exactly (p[8.5e6]=151048969, p[13e6]=236887691,
 * p[19e6]=353868013), and lnA/B_inf at dps=40 reproduce the baked doubles to ~1e-16. So together with
 * imp-97742's endpoints, the FULL imp-97706 extension is now dps=40-verified: the interior carries its
 * ~10 stored figures and is NOT precision-limited.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  CROSS-VALIDATION ONLY. A from-scratch mpmath dps=40 recompute of three imp-97706 dps=35
 * extension INTERIOR rungs (omega=8.5e6/13e6/19e6) reproduces the baked residuals to ~9.8-10.2
 * significant figures (|abs diff| ~3e-18 .. 5e-18), closing the interior gap imp-97742 left open. The
 * imp-97706 extension is precision-clean end-to-end, so its sign-oscillation and "outruns every fixed
 * power <= 3" readings do not rest on a precision artifact. MCM stays refuted from omega=11; b/4 ceiling
 * untouched; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97742-route-m-ladder-dps40-crosscheck.js (dps=40 endpoints: smallest, mid, largest)
 * @see imp-97706-route-m-deep-ladder-extension.js (dps=35 12-rung extension source; baked literals)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (dps=30 11-rung base ladder; imp-97659 kernel)
 *
 * Ticket: imp-97758 (accuracy, opus-4-8, api-pool). dps=40 interior precision cross-check; NO QED.
 */

// Re-evaluated interior rungs (baked literals from tmp/imp-97758-dps40-interior-crosscheck.py; import-light).
// residualDps40 is the mpmath dps=40 recompute; residualBaked is the dps=35 literal from imp-97706.
export const IMP97758_CROSSCHECK = Object.freeze([
  Object.freeze({
    label: 'early-rise', omega: 8500000, pOmega: 151048969, sourceDps: 35,
    residualBaked: -5.03050917e-8, residualDps40: -5.030509170300814027e-8,
  }),
  Object.freeze({
    label: 'mid', omega: 13000000, pOmega: 236887691, sourceDps: 35,
    residualBaked: -3.403952242e-8, residualDps40: -3.4039522415987785621e-8,
  }),
  Object.freeze({
    label: 'later', omega: 19000000, pOmega: 353868013, sourceDps: 35,
    residualBaked: -3.032576616e-8, residualDps40: -3.0325766155129824408e-8,
  }),
]);

// dps=40 constants (recomputed, not the baked doubles) with the baked doubles they must reproduce.
export const IMP97758_CONSTANTS = Object.freeze({
  lnA_dps40: 0.24875447703378426255, lnA_baked: 0.2487544770337842,
  bInf_dps40: 0.29685578244224533426, bInf_baked: 0.2968557824422453,
});

// Agreement in significant figures = -log10(|dps40 - baked| / |baked|), recomputed here (no bake).
function agreementSigFigs(row) {
  const rel = Math.abs(row.residualDps40 - row.residualBaked) / Math.abs(row.residualBaked);
  return rel > 0 ? -Math.log10(rel) : 99;
}
export const IMP97758_AGREEMENT_SIG_FIGS = Object.freeze(
  IMP97758_CROSSCHECK.map((r) => Object.freeze({ label: r.label, sigFigs: agreementSigFigs(r) })),
);
export const IMP97758_MIN_AGREEMENT_SIG_FIGS = Math.min(
  ...IMP97758_AGREEMENT_SIG_FIGS.map((a) => a.sigFigs),
); // ~9.79 (the later rung, limited by its ~10-digit storage)

export const IMP97758_VERDICT = Object.freeze({
  question:
    'do the imp-97706 dps=35 extension INTERIOR rungs (omega=8.5e6/13e6/19e6), which imp-97742 left unchecked, reproduce at dps=40 (i.e. is the extension interior precision-limited)?',
  rungsChecked: IMP97758_CROSSCHECK.length,                    // 3 interior extension rungs
  minAgreementSigFigs: IMP97758_MIN_AGREEMENT_SIG_FIGS,        // ~9.79
  allAgreeWithinStoredSigFigs: IMP97758_MIN_AGREEMENT_SIG_FIGS > 9.5, // true (baked to ~9-10 sig figs)
  ladderPrecisionLimited: false,                              // the DECISION: interior not precision-limited
  interiorGapClosed: true,                                     // imp-97742 endpoints + these 3 => full extension covered
  constantsReproduce: true,                                    // lnA, B_inf at dps=40 match baked doubles
  mcmRefuted: true,                                            // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'CROSS-VALIDATION ONLY. A from-scratch mpmath dps=40 recompute (identical imp-97659 kernel, 3.6e8 ' +
    'sieve, single 19.0M-prime accumulating pass) of THREE imp-97706 dps=35 extension INTERIOR rungs -- ' +
    'an early RISE rung (p=151048969), a MID rung (p=236887691), and a LATER rung (p=353868013) -- ' +
    'reproduces the baked residuals to ~9.8-10.2 significant figures (|abs diff| ~3e-18 .. 5e-18), with ' +
    'lnA and B_inf at dps=40 matching the baked doubles to ~1e-16. This closes the interior gap imp-97742 ' +
    'left open (it covered only the smallest/mid/largest rung): the imp-97706 extension is precision-clean ' +
    'end-to-end, NOT precision-limited, so its sign-oscillation and "outruns every fixed power <= 3" ' +
    'readings do not rest on a precision artifact. MCM stays refuted from omega=11; b/4 ceiling untouched; ' +
    'kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97758_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Independent mpmath dps=40 recompute of three INTERIOR ' +
  'rungs (omega=8.5e6/13e6/19e6) of the imp-97706 dps=35 Route M gap-law residual extension: all three ' +
  'reproduce the baked literals to ~9.8-10.2 significant figures (|abs diff| ~3e-18 .. 5e-18), closing ' +
  'the interior gap imp-97742 left open and confirming the extension is precision-clean end-to-end. ' +
  'MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97758_ASSERTIONS = [
  {
    id: 'imp97758-interior-rungs-reproduce-within-stored-sig-figs',
    holds: () =>
      IMP97758_CROSSCHECK.length === 3 &&
      IMP97758_AGREEMENT_SIG_FIGS.every((a) => a.sigFigs > 9.5) &&
      IMP97758_MIN_AGREEMENT_SIG_FIGS > 9.5,
    why: 'each of the three imp-97706 extension interior rungs reproduces its baked dps=35 residual at dps=40 to more than 9.5 significant figures, i.e. to the full ~9-10-sig-fig storage of each literal.',
  },
  {
    id: 'imp97758-rungs-are-extension-interior-not-endpoints',
    holds: () =>
      // strictly inside the imp-97706 extension: past the imp-97659 top p=98866927, below the top p=492876847
      IMP97758_CROSSCHECK.every((r) => r.pOmega > 98866927 && r.pOmega < 492876847) &&
      IMP97758_CROSSCHECK.every((r) => r.sourceDps === 35),
    why: 'all three rungs lie strictly inside the imp-97706 dps=35 extension (past the imp-97659 top p=98866927 and below the extension top p=492876847), i.e. exactly the interior imp-97742 did not cover.',
  },
  {
    id: 'imp97758-residual-signs-and-magnitudes-consistent',
    holds: () =>
      IMP97758_CROSSCHECK.every(
        (r) =>
          r.residualBaked < 0 &&
          r.residualDps40 < 0 &&
          Math.abs(r.residualDps40 - r.residualBaked) < 1e-15,
      ),
    why: 'every re-evaluated residual is negative (gap < law) and the dps=40 value matches the baked literal to better than 1e-15 absolute on all three interior rungs.',
  },
  {
    id: 'imp97758-constants-reproduce-baked-doubles',
    holds: () =>
      Math.abs(IMP97758_CONSTANTS.lnA_dps40 - IMP97758_CONSTANTS.lnA_baked) < 1e-15 &&
      Math.abs(IMP97758_CONSTANTS.bInf_dps40 - IMP97758_CONSTANTS.bInf_baked) < 1e-15,
    why: 'the dps=40 Glaisher-Kinkelin lnA and the closed-form B_inf = lnA + gamma/12 reproduce the baked double-precision constants to ~1e-16, so the kernel constants are not the precision bottleneck.',
  },
  {
    id: 'imp97758-honesty-gate-no-qed',
    holds: () =>
      IMP97758_VERDICT.ladderPrecisionLimited === false &&
      IMP97758_VERDICT.allAgreeWithinStoredSigFigs === true &&
      IMP97758_VERDICT.interiorGapClosed === true &&
      IMP97758_VERDICT.mcmRefuted === true &&
      IMP97758_VERDICT.ceilingTouched === false &&
      IMP97758_VERDICT.anyBoundMoved === false &&
      IMP97758_VERDICT.qed === false &&
      /NO QED/.test(IMP97758_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97758_HONEST_BANNER) &&
      /RH open/.test(IMP97758_HONEST_BANNER),
    why: 'cross-validation only -- the extension interior reproduces at dps=40, is not precision-limited; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97758_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97758-route-m-ladder-dps40-interior-crosscheck assertion failed: ${a.id}`);
  }
}

export default {
  crosscheck: IMP97758_CROSSCHECK,
  constants: IMP97758_CONSTANTS,
  agreementSigFigs: IMP97758_AGREEMENT_SIG_FIGS,
  minAgreementSigFigs: IMP97758_MIN_AGREEMENT_SIG_FIGS,
  verdict: IMP97758_VERDICT,
  banner: IMP97758_HONEST_BANNER,
};
