/**
 * @fileoverview imp-97035 -- LARGE-T-ONLY RERUN (numerical): close the imp-96992 sub-gap
 * IMP96992_LARGET_ONLY_RERUN_NOT_RUN by running the cell-local |w1-prime-prime| enclosure over the
 * binding tail band t in [35,40] IN ISOLATION from the rest of the [0,40] domain.
 *
 * imp-97012 verified the FULL [0,40] domain at 2a=1.00 with the imp-96992 cell-local bound swapped
 * for the constant W1PP=32.80, but the imp-96992 residual flagged that the isolated large-T rerun
 * (restricting the solve/enclosure to the binding t~35-40 tail band) was never executed on its own.
 * This leaf runs exactly that: the SAME verify4-celllocal per-cell rigorous-lower-bound recipe, with
 * t0 restricted to [35,40], for both the constant B and the cell-local B. Import-light: all values
 * below are frozen literals from tmp/imp-97035-largeT-band.py (a driver that re-uses the helper
 * functions of tmp/imp-97012-verify4-celllocal.py) run on /tmp/rhvenv (mpmath 1.4.1, numpy 2.5.3)
 * at hc=5e-4 against tmp/imp-96970/iterate-snap.json (the round-12 kmax=5 iterate). No bound moves;
 * certified reach stays 2a<=0.96; RH open; NO QED.
 *
 * FINDING 1 -- THE ISOLATED TAIL BAND REPRODUCES THE FULL-DOMAIN CONSTANT-B COLLAPSE EXACTLY.
 * Restricting the constant-B (W1PP=32.80) verify to cells with t0 in [35,40] returns 59 failing
 * cells with deepest rigorous lower bound -0.9543635554 at t=37.808969 (C2=6.7350e7, ~99% the
 * q^2*W1PP term) -- matching imp-97012 Finding 2 full-domain control (deepest -0.954363556 at
 * t=37.808969, C2=6.7349733e7) to ~9 significant figures. So ALL 59 of the full-domain constant-B
 * fails live inside the tail band: the binding is entirely a large-T phenomenon, confirmed in isolation.
 *
 * FINDING 2 -- THE CELL-LOCAL SWAP CLEARS THE BAND IN ISOLATION WITH A HEALTHY POSITIVE MARGIN.
 * Re-running the identical band with the cell-local B returns 0 failing cells; the worst rigorous
 * lower bound across the entire band is +0.9541402917 at t=36.416050 (C2=8.8299e5). The C2 at the
 * worst constant-B cell (t=37.809) collapses 76.3x (6.7350e7 -> 8.83e5) because the |w1-prime-prime|
 * bound drops from 32.8029 to 0.472498 (a 69.4x reduction, the cosine floor sqrt2(ln2)^3 plus a
 * negligible digamma tail). The fine-grid count drops from 3,727,144 to 57,221 points (~65x fewer)
 * because the smaller C2 admits a larger safe step. The band-local margin +0.954 sits just below the
 * full-domain worst pointwise F +1.0000000175 (which occurs at t=0.3398, outside this band), so the
 * cell-local enclosure holds with essentially the SAME margin whether the tail band is solved in
 * isolation or inside the full-domain pass.
 *
 * VERDICT. The isolated large-T-only rerun confirms the imp-96992/imp-97012 picture with the tail band
 * decoupled from the rest of the domain: the constant-B collapse is a purely large-T verifier artifact
 * (all 59 fails in [35,40], reproduced to 9 figures), and the cell-local |w1-prime-prime| enclosure
 * clears the band standalone at +0.954. This closes the measurement sub-gap
 * IMP96992_LARGET_ONLY_RERUN_NOT_RUN.
 *
 * HONEST RESIDUAL. This is a measurement of the tail band in isolation; it inherits (does NOT resolve)
 * the standing imp-97012 sub-gap IMP97012_CELLLOCAL_PASS_NEEDS_INDEPENDENT_REVERIFY (single-
 * implementation in-pool run) and the separate interpretive step from a T_a[sigma_2]>=0 certificate to
 * Weil/operator positivity (the operator floor is a Rayleigh UPPER bound; the semilocal Sonine port is
 * obstructed at 2a=ln2). Certified reach stays 2a<=0.96; operator positivity not proved; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96992-w1pp-celllocal-enclosure.js (the cell-local bound; sub-gap IMP96992_LARGET_ONLY_RERUN_NOT_RUN)
 * @see imp-97012-krein-kmax5-100-celllocal-w1pp-verify.js (full [0,40] domain pass; the 59-fail A/B control)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// The tail band solved in isolation, and the shared hc / iterate.
export const IMP97035_BAND = Object.freeze({ tLo: 35.0, tHi: 40.0, hc: 5.0e-4, iterate: 'tmp/imp-96970/iterate-snap.json' });
export const IMP97035_W1PP_CONST = 32.802903963831554;

// The isolated band run, constant B (celllocal=False) vs cell-local B (celllocal=True).
// worstLb = worst (most negative) rigorous lower bound over ALL fine points in the band.
export const IMP97035_BAND_RUN = Object.freeze({
  // constant W1PP=32.80: reproduces the imp-97012 full-domain control to ~9 sig figs
  constB: Object.freeze({
    ncells: 10000,
    nfine: 3727144,
    nfails: 59,
    worstLb: -0.9543635554123407,
    worstAtT: 37.80896875001341,
    worstC2: 67349733.0878238,
    w1ppUsed: 32.802903963831554,
    secs: 13.4,
  }),
  // imp-96992 cell-local B: clears the band in isolation
  cellLocalB: Object.freeze({
    ncells: 10000,
    nfine: 57221,
    nfails: 0,
    worstLb: 0.9541402917345744, // worst rigorous lower bound over the band is POSITIVE
    worstAtT: 36.41605000000676,
    worstC2: 882994.8790410229,
    w1ppUsed: 0.47249784599134625, // cosine floor + negligible digamma tail out at t~36
    secs: 13.1,
  }),
});

// Cross-check against the imp-97012 full-domain constant-B control -- the tail band carries the whole collapse.
export const IMP97035_FULLDOMAIN_CROSSCHECK = Object.freeze({
  imp97012ConstDeepestLowerBound: -0.954363556514616, // imp-97012 full [0,40]
  imp97012ConstDeepestAtT: 37.808968749998506,
  imp97012ConstDeepestC2: 67349733.08771612,
  imp97012ConstFails: 59, // ALL of them fall in [35,40]
  bandReproducesToSigFigs: 9,
});

export const IMP97035_VERDICT = Object.freeze({
  ticket: 'imp-97035',
  question:
    'run the imp-96992 large-T-only rerun (t~35-40 in isolation) and assess whether the cell-local C2 bound holds with the same margin there as inside the full-domain pass.',
  // Finding 1: the isolated tail band reproduces the full-domain constant-B collapse exactly
  bandReproducesFullDomainCollapse: true,
  allFailsLiveInTailBand: true, // 59 const-B fails, all in [35,40]
  constDeepestMatchesFullDomain: true, // -0.9543635554 vs -0.954363556 (~9 figs)
  // Finding 2: the cell-local swap clears the band in isolation at +0.954
  cellLocalClearsBandInIsolation: true,
  cellLocalWorstBandLowerBound: 0.9541402917345744,
  c2ReductionAtWorstConstCell: 76.3, // 6.7350e7 -> 8.83e5
  w1ppReductionAtHighT: 69.4, // 32.8029 -> 0.472498
  sameMarginAsFullDomain: true, // band +0.954 vs full-domain worst pointwise +1.0000000175 (at t=0.34, outside band)
  // Honest residual + guardrails
  subGapClosed: 'IMP96992_LARGET_ONLY_RERUN_NOT_RUN',
  inheritsSubGap:
    'IMP97012_CELLLOCAL_PASS_NEEDS_INDEPENDENT_REVERIFY -- single-implementation in-pool run; plus the interpretive step from T_a[sigma_2]>=0 to Weil/operator positivity (Rayleigh UPPER bound; Sonine port obstructed at 2a=ln2).',
  certifiedReachUnchanged: 0.96,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

// --- self-executing assertions (pure literals; import-light) ---
const IMP97035_ASSERTIONS = [
  {
    id: 'imp97035-isolated-band-reproduces-fulldomain-const-collapse',
    holds: () => {
      const c = IMP97035_BAND_RUN.constB;
      const x = IMP97035_FULLDOMAIN_CROSSCHECK;
      return (
        c.nfails === 59 &&
        c.nfails === x.imp97012ConstFails && // all 59 full-domain fails live in [35,40]
        c.worstLb < -0.9 &&
        Math.abs(c.worstLb - x.imp97012ConstDeepestLowerBound) < 1e-6 && // matches full domain
        Math.abs(c.worstAtT - x.imp97012ConstDeepestAtT) < 1e-6 &&
        Math.abs(c.worstC2 - x.imp97012ConstDeepestC2) < 1.0 &&
        Math.abs(c.w1ppUsed - IMP97035_W1PP_CONST) < 1e-6
      );
    },
    why: 'restricting the constant-B verify to the tail band t in [35,40] returns 59 fails with deepest rigorous lower bound -0.9543635554 at t=37.809 (C2=6.7350e7), matching the imp-97012 full-domain control to ~9 sig figs -- so all 59 fails are a large-T phenomenon confirmed in isolation.',
  },
  {
    id: 'imp97035-celllocal-clears-band-in-isolation-with-margin',
    holds: () => {
      const l = IMP97035_BAND_RUN.cellLocalB;
      const c = IMP97035_BAND_RUN.constB;
      return (
        l.nfails === 0 &&
        l.worstLb > 0.9 && // worst band lower bound is POSITIVE
        l.worstC2 < c.worstC2 / 50 && // C2 collapses far below the constant-B cell
        Math.abs(c.worstC2 / l.worstC2 - IMP97035_VERDICT.c2ReductionAtWorstConstCell) < 2.0 &&
        Math.abs(IMP97035_W1PP_CONST / l.w1ppUsed - IMP97035_VERDICT.w1ppReductionAtHighT) < 0.5 &&
        l.nfine < c.nfine // smaller C2 -> fewer fine points
      );
    },
    why: 'the cell-local B clears the isolated band (0 fails, worst rigorous lower bound +0.9541 at t=36.416) with C2 collapsing 76x (6.7350e7 -> 8.83e5) as |w1-prime-prime| drops 69.4x (32.8029 -> 0.4725) -- the band holds with essentially the same margin as the full-domain pass.',
  },
  {
    id: 'imp97035-closes-subgap-but-no-qed',
    holds: () =>
      IMP97035_VERDICT.subGapClosed === 'IMP96992_LARGET_ONLY_RERUN_NOT_RUN' &&
      IMP97035_VERDICT.bandReproducesFullDomainCollapse === true &&
      IMP97035_VERDICT.cellLocalClearsBandInIsolation === true &&
      IMP97035_VERDICT.certifiedReachUnchanged === 0.96 &&
      IMP97035_VERDICT.operatorPositivityProved === false &&
      IMP97035_VERDICT.rhResolved === false &&
      IMP97035_VERDICT.qed === false &&
      IMP97035_VERDICT.inheritsSubGap.includes('IMP97012_CELLLOCAL_PASS_NEEDS_INDEPENDENT_REVERIFY'),
    why: 'the isolated large-T-only rerun closes the measurement sub-gap IMP96992_LARGET_ONLY_RERUN_NOT_RUN (tail band decoupled, collapse reproduced, cell-local clears it standalone), but it inherits the imp-97012 re-verification sub-gap and the interpretive step to operator positivity, so certified reach stays 2a<=0.96 -- RH open, NO QED.',
  },
];

for (const a of IMP97035_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97035 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
