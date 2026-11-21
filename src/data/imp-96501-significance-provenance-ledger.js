/**
 * imp-96501 -- PROVENANCE LEDGER: a single table tabulating what each of the five modules that cite
 * the "~1.9-sigma excursion confidence" actually contributes to that figure.
 *
 * MOTIVATION. Five modules (imp-96089, imp-96128, imp-96184, imp-96430, imp-96452) all reference the
 * same z = 1.9234 excursion-confidence figure at T = 1.5e5, but each plays a different role: one SETS
 * the number, two are correlation cross-checks that could have raised it but were deliberately not used,
 * one is an UNRELATED thread that only disclaims touching it, and one is the assessment that traces and
 * quantifies all four of the others. Nothing before this module lists the five side by side with their
 * role and whether they change the quoted figure.
 *
 * METHOD (import-light: consumes only the five light finding modules, nothing re-derived).
 * Read each module's exported constant and record: its ROLE relative to the z = 1.9234 figure, its KEY
 * METRIC, and whether it CHANGES the quoted number (true only for the module that sets it).
 *
 * FINDINGS.
 *  1. imp-96089 SETS the figure: z = relErr / sqrt(2 / n_w) = 0.159457 / sqrt(2/291) = 1.9234 at the
 *     single significant below-envelope dip T = 1.5e5, using the NAIVE (conservative) window count
 *     n_w = 291. This is the only module that DEFINES z = 1.9234; the other four cite it.
 *  2. imp-96128 measures the exact GUE adjacent-box correlation rho_exact = -0.46398 at T = 1.5e5, which
 *     via the AR-1 factor (1-rho)/(1+rho) = 2.7312 raises the effective count to n_eff ~ 794.8 -- a
 *     NAIVE z of ~3.18 if it were used. It is NOT used: the quoted 1.9234 stays pinned to the
 *     conservative n_w = 291, so imp-96128 shows the true significance is a LOWER bound, not the ceiling.
 *  3. imp-96184 confirms the SAME anti-correlated sign and magnitude (r1 in -0.5764..-0.4893) at five
 *     OTHER held-out heights, none of them T = 1.5e5 -- it extends confidence in the correlation model
 *     generally, but touches no input of the z = 1.9234 figure itself (different heights).
 *  4. imp-96430 is a DIFFERENT thread entirely (basis-C corroboration-reach crossover, L* in
 *     [1.3e12, 2.5e12]) that explicitly states in its own caveat that it "does not touch the ~1.9-sigma
 *     excursion confidence" -- it is listed here only because it is one of the five citing modules, and
 *     it contributes nothing to the number.
 *  5. imp-96452 is the PROVENANCE ASSESSMENT: it traces z = 1.9234 to its three driving inputs (dip depth
 *     relErr = 0.159457, window count n_w = 291, chi-square sampling model), quantifies the 2-sigma reach
 *     (n_w >= 315, +24 windows) and proves the OBSTRUCTION -- the dip's +/-30% window [1.05e5, 1.95e5] is
 *     already fully interior to the 10^6-ordinate set, so more verified-zero height adds nothing to it.
 *
 * VERDICT. Of the five modules citing the ~1.9-sigma figure, exactly ONE (imp-96089) sets it and ONE
 * (imp-96452) explains/quantifies it; the other three (imp-96128, imp-96184, imp-96430) are cross-checks
 * or unrelated threads that all either leave it untouched or would raise it if used (conservative
 * pinning). Ledger only; changes no bound; NO QED; no refereed bound is changed; the
 * zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96089-mean-anchor-window-count-significance-verdict (SETS z = 1.9234)
 * @see imp-96128-number-variance-two-interval-covariance-exact (exact rho_exact, unused-favourable)
 * @see imp-96184-number-variance-empirical-lag1-heldout-heights (uniformity elsewhere, no contact)
 * @see imp-96430-basis-c-corroboration-reach-crossover (unrelated thread, explicit disclaimer)
 * @see imp-96452-excursion-confidence-2sigma-reach (provenance + 2-sigma-reach assessment)
 *
 * Import-light: imports only the five light finding modules (none pulls the zeros bundle); every value
 * here is read from their exports -- nothing is re-derived.
 */

import { IMP96089_MEAN_ANCHOR_WINDOW_COUNT_SIGNIFICANCE_VERDICT } from './imp-96089-mean-anchor-window-count-significance-verdict.js';
import { IMP96128_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_EXACT } from './imp-96128-number-variance-two-interval-covariance-exact.js';
import { IMP96184_NUMBER_VARIANCE_EMPIRICAL_LAG1_HELDOUT_HEIGHTS } from './imp-96184-number-variance-empirical-lag1-heldout-heights.js';
import { IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER } from './imp-96430-basis-c-corroboration-reach-crossover.js';
import { IMP96452_EXCURSION_CONFIDENCE_2SIGMA_REACH } from './imp-96452-excursion-confidence-2sigma-reach.js';

const DIP = IMP96089_MEAN_ANCHOR_WINDOW_COUNT_SIGNIFICANCE_VERDICT;
const COV = IMP96128_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_EXACT;
const HELDOUT = IMP96184_NUMBER_VARIANCE_EMPIRICAL_LAG1_HELDOUT_HEIGHTS;
const BASISC = IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER;
const ASSESS = IMP96452_EXCURSION_CONFIDENCE_2SIGMA_REACH;

const Z_QUOTED = ASSESS.drivingInputs.zCurrent; // 1.9234
const N_W_NAIVE = ASSESS.drivingInputs.windowCount_nW; // 291
const RHO_EXACT = ASSESS.conservativeQuotingContext.rhoExact; // -0.46398
const N_EFF = ASSESS.conservativeQuotingContext.nEff; // ~794.8
const Z_NAIVE_FAVOURABLE = ASSESS.conservativeQuotingContext.zEffNaive; // ~3.18

const ledger = [
  {
    ticket: 'imp-96089',
    role: 'SETS the figure',
    keyMetric: 'z = relErr / sqrt(2/n_w) = 1.9234 at T = 1.5e5, using naive n_w = 291',
    changesQuotedFigure: false,
    isSource: true,
    value: DIP.belowEnvelopeVerdict.find((r) => r.Tc === 1.5e5)?.zScore ?? null,
  },
  {
    ticket: 'imp-96128',
    role: 'correlation cross-check (unused-favourable)',
    keyMetric: 'exact rho_exact = -0.46398 => n_eff ~ 794.8, naive z ~ 3.18 if used (it is not)',
    changesQuotedFigure: false,
    isSource: false,
    value: COV.significantDip.rhoExact,
  },
  {
    ticket: 'imp-96184',
    role: 'uniformity cross-check, no contact with T = 1.5e5',
    keyMetric: `held-out r1 in [${HELDOUT.uniformity.r1Min.toFixed(4)}, ${HELDOUT.uniformity.r1Max.toFixed(4)}] at five OTHER heights, all anti-correlated`,
    changesQuotedFigure: false,
    isSource: false,
    value: HELDOUT.uniformity.r1Min,
  },
  {
    ticket: 'imp-96430',
    role: 'unrelated thread, explicit disclaimer',
    keyMetric: 'basis-C corroboration-reach crossover L* in [1.3e12, 2.5e12]; states it does not touch the ~1.9-sigma figure',
    changesQuotedFigure: false,
    isSource: false,
    value: BASISC.crossover.band,
  },
  {
    ticket: 'imp-96452',
    role: 'provenance + 2-sigma-reach assessment',
    keyMetric: 'traces z = 1.9234 to relErr = 0.159457 and n_w = 291; 2-sigma needs n_w >= 315 (+24), blocked (dip window fully interior)',
    changesQuotedFigure: false,
    isSource: false,
    value: ASSESS.twoSigmaReach.nWindowsNeeded,
  },
];

const sourceCount = ledger.filter((r) => r.isSource).length;
const anyChangesFigure = ledger.some((r) => r.changesQuotedFigure);

export const IMP96501_SIGNIFICANCE_PROVENANCE_LEDGER = {
  ticket: 'imp-96501',
  question:
    'Across the five modules citing the ~1.9-sigma excursion confidence (imp-96089, imp-96128, imp-96184, imp-96430, imp-96452), which one actually sets the number, which are cross-checks that could have changed it, and which are unrelated threads that merely disclaim touching it?',
  quotedFigure: {
    zQuoted: Z_QUOTED, // 1.9234
    nWindowsNaive: N_W_NAIVE, // 291
    height: 1.5e5,
    conservativePinning:
      'z = 1.9234 is pinned to the naive (conservative) window count n_w = 291 and the fixed dip depth relErr = 0.159457, NOT to the favourable exact correlation model (imp-96128), which would raise it to a naive z ~ 3.18 via n_eff ~ 794.8. Every other citing module either leaves the figure untouched (imp-96184, imp-96430) or would raise it if used (imp-96128).',
  },
  favourableUnused: {
    rhoExact: RHO_EXACT, // -0.46398
    nEff: N_EFF, // ~794.8
    zNaiveFavourable: Z_NAIVE_FAVOURABLE, // ~3.18
  },
  ledger,
  sourceCount, // 1: exactly one module sets the figure
  anyChangesFigure, // false: none of the five modules changes the quoted 1.9234
  verdict:
    'Of the five modules citing the ~1.9-sigma excursion confidence, exactly ONE (imp-96089) SETS z = 1.9234 (relErr = 0.159457 over naive n_w = 291 at T = 1.5e5); ONE (imp-96452) is the provenance assessment that traces and quantifies it (2-sigma needs n_w >= 315, obstructed because the dip window is already fully interior to the 10^6-ordinate set); and THREE (imp-96128, imp-96184, imp-96430) are cross-checks or unrelated threads that leave the quoted number untouched -- imp-96128 in particular shows the true significance is conservatively UNDER-stated (n_eff ~ 795 would give a naive z ~ 3.18). Ledger only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (comparison only; no re-derivation) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  if (ledger.length !== 5) throw new Error('imp-96501: expected exactly five ledger rows');
  if (sourceCount !== 1) throw new Error('imp-96501: expected exactly one source-setting module');
  if (anyChangesFigure) throw new Error('imp-96501: no cited module should change the quoted figure');
  if (!approx(Z_QUOTED, 1.9234, 1e-3)) throw new Error('imp-96501: quoted z drifted from 1.9234');
  if (N_W_NAIVE !== 291) throw new Error('imp-96501: naive window count drifted from 291');
  if (!approx(RHO_EXACT, -0.46398, 1e-4)) throw new Error('imp-96501: rho_exact drifted from -0.46398');
  if (!(N_EFF > 790 && N_EFF < 800)) throw new Error('imp-96501: n_eff drifted from ~794.8');
  if (!(Z_NAIVE_FAVOURABLE > Z_QUOTED)) throw new Error('imp-96501: favourable naive z should exceed the quoted conservative z');
  if (ledger.find((r) => r.ticket === 'imp-96089').isSource !== true)
    throw new Error('imp-96501: imp-96089 must be flagged as the figure-setting source');
  if (ledger.filter((r) => r.ticket !== 'imp-96089').some((r) => r.isSource))
    throw new Error('imp-96501: only imp-96089 should be flagged as the source');
  // honesty gates
  if (!/NO QED/.test(IMP96501_SIGNIFICANCE_PROVENANCE_LEDGER.verdict))
    throw new Error('imp-96501: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96501_SIGNIFICANCE_PROVENANCE_LEDGER.verdict))
    throw new Error('imp-96501: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96501_SIGNIFICANCE_PROVENANCE_LEDGER;
