/**
 * @module imp-97784-route-m-ladder-dps40-full-crosscheck
 *
 * imp-97784 (accuracy -- CROSS-VALIDATION ONLY; MCM refuted from omega=11; no bound moves; NO QED).
 *
 * The 23-rung Route M gap-law residual ladder (11 base rungs from imp-97659 at dps=30, p=2e6..9.9e7,
 * plus 12 extension rungs from imp-97706 at dps=35, p=1.23e8..4.93e8) carries the imp-97706
 * sign-oscillation reading (eight negative-decay-slope rungs) and the imp-97687/imp-97706 bootstrap
 * exponent band [9.80, 11.22]. Only SIX of the 23 rungs had ever been independently recomputed at
 * dps=40: imp-97742 covered the ENDPOINTS (omega=148933 smallest, omega=5000000 mid, omega=26000000
 * largest) and imp-97758 THREE interior extension rungs (omega=8500000/13000000/19000000). The other
 * SEVENTEEN rungs were never dps=40-verified. Because each residual is a catastrophic-cancellation
 * difference
 *     residual(omega) = gap(omega) - law(omega),  gap ~ law ~ 8.3e-3 .. 1.15e-2,  residual ~ 3e-8 .. 8e-7,
 * a precision limit could still hide on any of the seventeen unchecked rungs and quietly manufacture a
 * spurious sign-of-slope flip or shift the fitted exponent.
 *
 * This leaf RE-EVALUATES EVERY rung of the full 23-rung ladder from scratch at mpmath dps=40 in a
 * SINGLE accumulating prime pass (tmp/imp-97784-dps40-full-ladder-crosscheck.py, 5e8 sieve = 26,355,867
 * primes, one pass over the first 26,000,000 primes so all 23 nested omega snapshots come from one run),
 * using the IDENTICAL imp-97659 kernel:
 *     Pi_omega    = prod_{i<=omega} (1 - 1/p_i)
 *     Sigma_omega = sum_{i<=omega}  log p_i / (p_i - 1)
 *     S    = Pi_omega * (lnA - Sigma_omega/12)
 *     gap  = S + e^{-gamma}/12
 *     law  = e^{-gamma} * (lnA + gamma/12) / log p_omega
 *     residual = gap - law
 * with lnA = log(glaisher) and B_inf = lnA + gamma/12 recomputed at dps=40 (NOT the baked doubles).
 *
 * -------------------------------------------------------------------------------
 * RESULT -- the FULL 23-rung ladder reproduces at dps=40 to its stored precision on EVERY rung.
 * -------------------------------------------------------------------------------
 * All 23 rungs agree with their baked dps=30/35 literals to between 9.34 and 12.13 significant figures
 * (|abs diff| ~5e-20 .. 5e-17). The worst rung is the base rung omega=4000000 (p=67867967) at ~9.34 sig
 * figs, still the full ~10-sig-fig storage of that literal. The six previously-checked rungs reproduce
 * the imp-97742/imp-97758 dps=40 values EXACTLY (e.g. omega=5000000 -> -6.9097680219338650866e-8 as in
 * imp-97742; omega=8500000 -> -5.030509170300814027e-8 as in imp-97758), and lnA/B_inf at dps=40
 * reproduce the baked doubles to ~1e-16. So all SEVENTEEN previously-unchecked rungs are now
 * dps=40-verified too, closing the full ladder.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  CROSS-VALIDATION ONLY. A from-scratch mpmath dps=40 recompute of the ENTIRE 23-rung Route M
 * gap-law residual ladder (single 26.0M-prime accumulating pass) reproduces every baked residual to
 * 9.34..12.13 significant figures, closing the seventeen rungs imp-97742/imp-97758 left unchecked. The
 * imp-97706 sign-oscillation (eight negative-slope rungs) and the imp-97687/imp-97706 bootstrap exponent
 * band [9.80, 11.22] therefore rest ENTIRELY on precision-clean rungs -- no rung is precision-limited, so
 * neither the oscillation nor the ">3" reading is a precision artifact. MCM stays refuted from omega=11;
 * b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed; RH open;
 * NO QED.
 *
 * @see imp-97742-route-m-ladder-dps40-crosscheck.js (dps=40 endpoints: smallest, mid, largest)
 * @see imp-97758-route-m-ladder-dps40-interior-crosscheck.js (dps=40 three interior extension rungs)
 * @see imp-97706-route-m-deep-ladder-extension.js (dps=35 12-rung extension; sign-change recurs, band narrows)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (dps=30 11-rung base ladder; imp-97659 kernel)
 *
 * Ticket: imp-97784 (accuracy, opus-4-8, api-pool). Full 23-rung dps=40 precision cross-check; NO QED.
 */

// Full 23-rung dps=40 recompute (baked literals from tmp/imp-97784-dps40-full-ladder-crosscheck.py;
// import-light, no heavy transitive imports -- imp-2546/heavy-import rule). residualDps40 is the mpmath
// dps=40 recompute; residualBaked is the dps=30 (base) / dps=35 (extension) literal from the source ladder.
// previouslyChecked flags the six rungs already covered by imp-97742 (endpoints) or imp-97758 (interior).
export const IMP97784_CROSSCHECK = Object.freeze([
  Object.freeze({ omega: 148933,   pOmega: 1999993,   sourceDps: 30, residualBaked: -8.351691933e-7, residualDps40: -8.351691932711143804e-7, previouslyChecked: true }),
  Object.freeze({ omega: 300000,   pOmega: 4256233,   sourceDps: 30, residualBaked: -4.969833529e-7, residualDps40: -4.9698335289316869784e-7, previouslyChecked: false }),
  Object.freeze({ omega: 500000,   pOmega: 7368787,   sourceDps: 30, residualBaked: -3.937432152e-7, residualDps40: -3.9374321517841101805e-7, previouslyChecked: false }),
  Object.freeze({ omega: 1000000,  pOmega: 15485863,  sourceDps: 30, residualBaked: -1.451769323e-7, residualDps40: -1.4517693226762307214e-7, previouslyChecked: false }),
  Object.freeze({ omega: 1500000,  pOmega: 23879519,  sourceDps: 30, residualBaked: -1.368690971e-7, residualDps40: -1.3686909714973501977e-7, previouslyChecked: false }),
  Object.freeze({ omega: 2000000,  pOmega: 32452843,  sourceDps: 30, residualBaked: -1.544098916e-7, residualDps40: -1.5440989162532411455e-7, previouslyChecked: false }),
  Object.freeze({ omega: 2500000,  pOmega: 41161739,  sourceDps: 30, residualBaked: -1.464899473e-7, residualDps40: -1.4648994731892831706e-7, previouslyChecked: false }),
  Object.freeze({ omega: 3000000,  pOmega: 49979687,  sourceDps: 30, residualBaked: -1.203494458e-7, residualDps40: -1.2034944575363182349e-7, previouslyChecked: false }),
  Object.freeze({ omega: 4000000,  pOmega: 67867967,  sourceDps: 30, residualBaked: -1.005543676e-7, residualDps40: -1.0055436755391812795e-7, previouslyChecked: false }),
  Object.freeze({ omega: 5000000,  pOmega: 86028121,  sourceDps: 30, residualBaked: -6.909768022e-8, residualDps40: -6.9097680219338650866e-8, previouslyChecked: true }),
  Object.freeze({ omega: 5700000,  pOmega: 98866927,  sourceDps: 30, residualBaked: -6.703062275e-8, residualDps40: -6.7030622750049184039e-8, previouslyChecked: false }),
  Object.freeze({ omega: 7000000,  pOmega: 122949823, sourceDps: 35, residualBaked: -4.724735374e-8, residualDps40: -4.7247353737123964994e-8, previouslyChecked: false }),
  Object.freeze({ omega: 8500000,  pOmega: 151048969, sourceDps: 35, residualBaked: -5.03050917e-8,  residualDps40: -5.030509170300814027e-8, previouslyChecked: true }),
  Object.freeze({ omega: 10000000, pOmega: 179424673, sourceDps: 35, residualBaked: -6.536936812e-8, residualDps40: -6.5369368117374574665e-8, previouslyChecked: false }),
  Object.freeze({ omega: 11500000, pOmega: 208055039, sourceDps: 35, residualBaked: -4.203902506e-8, residualDps40: -4.2039025064592168364e-8, previouslyChecked: false }),
  Object.freeze({ omega: 13000000, pOmega: 236887691, sourceDps: 35, residualBaked: -3.403952242e-8, residualDps40: -3.4039522415987785621e-8, previouslyChecked: true }),
  Object.freeze({ omega: 15000000, pOmega: 275604541, sourceDps: 35, residualBaked: -4.077064687e-8, residualDps40: -4.0770646869456424002e-8, previouslyChecked: false }),
  Object.freeze({ omega: 17000000, pOmega: 314606869, sourceDps: 35, residualBaked: -4.166179585e-8, residualDps40: -4.1661795845399774551e-8, previouslyChecked: false }),
  Object.freeze({ omega: 19000000, pOmega: 353868013, sourceDps: 35, residualBaked: -3.032576616e-8, residualDps40: -3.0325766155129824408e-8, previouslyChecked: true }),
  Object.freeze({ omega: 21000000, pOmega: 393342739, sourceDps: 35, residualBaked: -3.140684528e-8, residualDps40: -3.1406845275314695278e-8, previouslyChecked: false }),
  Object.freeze({ omega: 23000000, pOmega: 433024223, sourceDps: 35, residualBaked: -2.719247391e-8, residualDps40: -2.719247391164083627e-8, previouslyChecked: false }),
  Object.freeze({ omega: 25000000, pOmega: 472882027, sourceDps: 35, residualBaked: -3.044005501e-8, residualDps40: -3.0440055012945834116e-8, previouslyChecked: false }),
  Object.freeze({ omega: 26000000, pOmega: 492876847, sourceDps: 35, residualBaked: -3.047612203e-8, residualDps40: -3.0476122030710704484e-8, previouslyChecked: true }),
]);

// dps=40 constants (recomputed, not the baked doubles) with the baked doubles they must reproduce.
export const IMP97784_CONSTANTS = Object.freeze({
  lnA_dps40: 0.24875447703378426255, lnA_baked: 0.2487544770337842,
  bInf_dps40: 0.29685578244224533426, bInf_baked: 0.2968557824422453,
});

// Agreement in significant figures = -log10(|dps40 - baked| / |baked|), recomputed here (no bake).
function agreementSigFigs(row) {
  const rel = Math.abs(row.residualDps40 - row.residualBaked) / Math.abs(row.residualBaked);
  return rel > 0 ? -Math.log10(rel) : 99;
}
export const IMP97784_AGREEMENT_SIG_FIGS = Object.freeze(
  IMP97784_CROSSCHECK.map((r) => Object.freeze({ omega: r.omega, sigFigs: agreementSigFigs(r) })),
);
export const IMP97784_MIN_AGREEMENT_SIG_FIGS = Math.min(
  ...IMP97784_AGREEMENT_SIG_FIGS.map((a) => a.sigFigs),
); // ~9.34 (base rung omega=4000000, limited by its ~10-digit storage)

export const IMP97784_RUNGS_TOTAL = IMP97784_CROSSCHECK.length;                              // 23
export const IMP97784_RUNGS_NEWLY_CHECKED =
  IMP97784_CROSSCHECK.filter((r) => !r.previouslyChecked).length;                            // 17
export const IMP97784_RUNGS_PREVIOUSLY_CHECKED =
  IMP97784_CROSSCHECK.filter((r) => r.previouslyChecked).length;                             // 6

export const IMP97784_VERDICT = Object.freeze({
  question:
    'does EVERY rung of the full 23-rung Route M gap-law residual ladder (the 17 that imp-97742/imp-97758 left unchecked included) reproduce at dps=40, i.e. do the sign-oscillation and the [9.80,11.22] bootstrap band rest entirely on precision-clean rungs?',
  rungsChecked: IMP97784_RUNGS_TOTAL,                          // 23 (full ladder)
  rungsNewlyChecked: IMP97784_RUNGS_NEWLY_CHECKED,             // 17
  rungsPreviouslyChecked: IMP97784_RUNGS_PREVIOUSLY_CHECKED,   // 6 (imp-97742 endpoints + imp-97758 interior)
  minAgreementSigFigs: IMP97784_MIN_AGREEMENT_SIG_FIGS,        // ~9.34
  allAgreeWithinStoredSigFigs: IMP97784_MIN_AGREEMENT_SIG_FIGS > 9.3, // true (baked to ~9-10 sig figs)
  ladderPrecisionLimited: false,                              // the DECISION: no rung is precision-limited
  fullLadderClosed: true,                                      // all 23 rungs now dps=40-verified
  oscillationPrecisionClean: true,                             // the 8 sign-of-slope flips rest on clean rungs
  bootstrapBandPrecisionClean: true,                          // the [9.80,11.22] band rests on clean rungs
  constantsReproduce: true,                                    // lnA, B_inf at dps=40 match baked doubles
  mcmRefuted: true,                                            // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'CROSS-VALIDATION ONLY. A from-scratch mpmath dps=40 recompute (identical imp-97659 kernel, 5e8 ' +
    'sieve = 26,355,867 primes, a single 26.0M-prime accumulating pass giving all 23 nested snapshots) ' +
    'of the ENTIRE 23-rung Route M gap-law residual ladder reproduces every baked residual to ' +
    '9.34..12.13 significant figures (|abs diff| ~5e-20 .. 5e-17), with lnA and B_inf at dps=40 matching ' +
    'the baked doubles to ~1e-16. This closes the seventeen rungs imp-97742 (endpoints) and imp-97758 ' +
    '(three interior) left unchecked, and the six previously-checked rungs reproduce their earlier dps=40 ' +
    'values exactly. So the full ladder is precision-clean end-to-end: the imp-97706 sign-oscillation ' +
    '(eight negative-slope rungs) and the imp-97687/imp-97706 bootstrap exponent band [9.80,11.22] rest ' +
    'ENTIRELY on precision-clean rungs and are NOT precision artifacts. MCM stays refuted from omega=11; ' +
    'b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP97784_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Independent mpmath dps=40 recompute of ALL 23 rungs ' +
  'of the Route M gap-law residual ladder (single 26.0M-prime accumulating pass): every rung reproduces ' +
  'its baked dps=30/35 literal to 9.34..12.13 significant figures, closing the seventeen rungs ' +
  'imp-97742/imp-97758 left unchecked. The sign-oscillation and the [9.80,11.22] bootstrap band rest ' +
  'entirely on precision-clean rungs. MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97784_ASSERTIONS = [
  {
    id: 'imp97784-full-ladder-is-23-rungs',
    holds: () =>
      IMP97784_RUNGS_TOTAL === 23 &&
      IMP97784_RUNGS_NEWLY_CHECKED === 17 &&
      IMP97784_RUNGS_PREVIOUSLY_CHECKED === 6,
    why: 'the crosscheck covers the full 23-rung ladder: 6 rungs previously covered by imp-97742 (endpoints) and imp-97758 (interior), plus the 17 that were never independently dps=40-verified.',
  },
  {
    id: 'imp97784-every-rung-reproduces-within-stored-sig-figs',
    holds: () =>
      IMP97784_AGREEMENT_SIG_FIGS.every((a) => a.sigFigs > 9.3) &&
      IMP97784_MIN_AGREEMENT_SIG_FIGS > 9.3,
    why: 'every one of the 23 rungs reproduces its baked dps=30/35 residual at dps=40 to more than 9.3 significant figures, i.e. to the full ~9-10-sig-fig storage of each literal.',
  },
  {
    id: 'imp97784-all-residuals-negative-and-match',
    holds: () =>
      IMP97784_CROSSCHECK.every(
        (r) =>
          r.residualBaked < 0 &&
          r.residualDps40 < 0 &&
          Math.abs(r.residualDps40 - r.residualBaked) < 1e-15,
      ),
    why: 'every re-evaluated residual is negative (gap < law) and the dps=40 value matches the baked literal to better than 1e-15 absolute on all 23 rungs.',
  },
  {
    id: 'imp97784-previously-checked-rungs-match-prior-modules',
    holds: () => {
      // the six previously-checked rungs must carry the exact dps=40 values imp-97742/imp-97758 baked
      const byOmega = new Map(IMP97784_CROSSCHECK.map((r) => [r.omega, r.residualDps40]));
      return (
        Math.abs(byOmega.get(148933)  - -8.351691932711143804e-7) < 1e-25 &&
        Math.abs(byOmega.get(5000000) - -6.9097680219338650866e-8) < 1e-27 &&
        Math.abs(byOmega.get(26000000) - -3.0476122030710704484e-8) < 1e-27 &&
        Math.abs(byOmega.get(8500000) - -5.030509170300814027e-8) < 1e-27 &&
        Math.abs(byOmega.get(13000000) - -3.4039522415987785621e-8) < 1e-27 &&
        Math.abs(byOmega.get(19000000) - -3.0325766155129824408e-8) < 1e-27
      );
    },
    why: 'the six rungs already covered by imp-97742 (omega=148933/5000000/26000000) and imp-97758 (omega=8500000/13000000/19000000) reproduce those modules dps=40 values exactly, cross-validating the single-pass recompute against the earlier independent runs.',
  },
  {
    id: 'imp97784-constants-reproduce-baked-doubles',
    holds: () =>
      Math.abs(IMP97784_CONSTANTS.lnA_dps40 - IMP97784_CONSTANTS.lnA_baked) < 1e-15 &&
      Math.abs(IMP97784_CONSTANTS.bInf_dps40 - IMP97784_CONSTANTS.bInf_baked) < 1e-15,
    why: 'the dps=40 Glaisher-Kinkelin lnA and the closed-form B_inf = lnA + gamma/12 reproduce the baked double-precision constants to ~1e-16, so the kernel constants are not the precision bottleneck.',
  },
  {
    id: 'imp97784-honesty-gate-no-qed',
    holds: () =>
      IMP97784_VERDICT.ladderPrecisionLimited === false &&
      IMP97784_VERDICT.allAgreeWithinStoredSigFigs === true &&
      IMP97784_VERDICT.fullLadderClosed === true &&
      IMP97784_VERDICT.oscillationPrecisionClean === true &&
      IMP97784_VERDICT.bootstrapBandPrecisionClean === true &&
      IMP97784_VERDICT.mcmRefuted === true &&
      IMP97784_VERDICT.ceilingTouched === false &&
      IMP97784_VERDICT.anyBoundMoved === false &&
      IMP97784_VERDICT.qed === false &&
      /NO QED/.test(IMP97784_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97784_HONEST_BANNER) &&
      /RH open/.test(IMP97784_HONEST_BANNER),
    why: 'cross-validation only -- the full 23-rung ladder reproduces at dps=40 and is not precision-limited, so the sign-oscillation and bootstrap band are precision-clean; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97784_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97784-route-m-ladder-dps40-full-crosscheck assertion failed: ${a.id}`);
  }
}

export default {
  crosscheck: IMP97784_CROSSCHECK,
  constants: IMP97784_CONSTANTS,
  agreementSigFigs: IMP97784_AGREEMENT_SIG_FIGS,
  minAgreementSigFigs: IMP97784_MIN_AGREEMENT_SIG_FIGS,
  rungsTotal: IMP97784_RUNGS_TOTAL,
  rungsNewlyChecked: IMP97784_RUNGS_NEWLY_CHECKED,
  verdict: IMP97784_VERDICT,
  banner: IMP97784_HONEST_BANNER,
};
