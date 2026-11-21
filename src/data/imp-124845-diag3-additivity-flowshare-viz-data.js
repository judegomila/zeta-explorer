/**
 * @module imp-124845-diag3-additivity-flowshare-viz-data
 *
 * imp-124845 (ux, viz-data leaf): a thin presentation surface for the imp-124812 DIAG3
 * three-axis additivity assessment. imp-124812 showed that the amplitude-partial sum
 * NUM = c*sigma_c + e*sigma_e + f*sigma_f stays machine-zero across a flow-share sweep
 * {0.1,1,5,20} for the real linear-in-amplitude model, while replacing the numerator by
 * a c^2 term (the B1 linearity-break diagnostic) makes the sum jump to sigma(1-sigma) != 0.
 * imp-124812 only evaluated the c^2 break at a single flow share (cf=1.0); this leaf
 * extends that SAME break across the full flow-share sweep so the linear-vs-broken
 * comparison can be charted side by side, visually isolating the degree-1 hinge (B1).
 * Reuses the imp-124812 linear-model sweep verbatim; the c^2-break row is a light
 * re-evaluation of the identical imp-124812 `parts(..., pow=2)` formula at each flow
 * share. Presentation/assessment only; NOT an RH bound; changes no bound; NO QED.
 *
 * @see imp-124812-diag3-additivity-exact-identity-assessment (source assessment + formulas)
 */

import {
  IMP124812_DIAG3_ADDITIVITY_EXACT_IDENTITY_ASSESSMENT as SRC,
} from './imp-124812-diag3-additivity-exact-identity-assessment.js';
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
const N_PROBE = SRC.probe_abscissa_N;

// Identical to imp-124812's `parts` with pow=2 fixed (the B1 linearity-break numerator).
function nonlinearBreakNUM(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI);
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = cc * cc * Math.sqrt(L / N); // c^2 numerator -- loses degree-0 homogeneity
  const E_N = et + E_flow + E_coll;
  const sigma = E_coll / E_N;
  const csc2 = 2 * sigma * (1 - sigma);
  const ese2 = -et * sigma / E_N;
  const fsf2 = -E_flow * sigma / E_N;
  return { NUM: csc2 + ese2 + fsf2, sigma };
}

// Flow-share sweep comparison: linear-model NUM (reused from imp-124812, ~0) vs the
// c^2-broken NUM (re-evaluated here at each flow share, matching sigma(1-sigma)).
export const IMP124845_FLOWSHARE_COMPARISON = SRC.flowShareSweep.map((row) => {
  const nb = nonlinearBreakNUM(N_PROBE, C_C_PINNED, E_TRUNC_PT, row.cf);
  const predicted = nb.sigma * (1 - nb.sigma);
  return {
    cf: row.cf,
    flow_share: row.flow_share,
    linear_NUM: row.partial_sum_NUM,
    nonlinear_NUM: +nb.NUM.toExponential(6),
    nonlinear_predicted: +predicted.toExponential(6),
  };
});

export const IMP124845_SUMMARY = {
  reading:
    'Across the same flow-share sweep {0.1,1,5,20} that materially moves E_flow/E_N, the ' +
    'linear model (reused imp-124812 values) keeps the amplitude-partial sum at IEEE round-off, ' +
    'while the c^2-broken numerator (B1 diagnostic) lifts it to sigma(1-sigma) at every flow ' +
    'share -- the additivity break tracks the linearity break, not the flow share.',
  max_linear_NUM: SRC.max_linear_partial_sum,
  min_nonlinear_NUM: +Math.min(...IMP124845_FLOWSHARE_COMPARISON.map((r) => Math.abs(r.nonlinear_NUM))).toExponential(3),
  verdict:
    'Presentation leaf on the imp-124812 assessment. The additivity E_CC+E_ET+E_CF=0 is exact ' +
    'algebra of the degree-0 homogeneous sigma=E_coll/E_N model, independent of the flow share; ' +
    'the SOLE load-bearing hypothesis (B1) is the linear-in-amplitude prefactor structure, ' +
    'verified numerically (imp-97668/imp-97720), not proven. No bound moves; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP124845_FLOWSHARE_COMPARISON_ASSERTIONS = [
  {
    id: 'imp124845-linear-row-matches-source',
    description: 'linear_NUM values are reused verbatim from imp-124812 flowShareSweep',
    holds: () =>
      IMP124845_FLOWSHARE_COMPARISON.every(
        (r, i) => r.linear_NUM === SRC.flowShareSweep[i].partial_sum_NUM
      ),
  },
  {
    id: 'imp124845-nonlinear-row-nonzero-at-every-flow-share',
    description: 'c^2-broken NUM matches sigma(1-sigma) at every flow share, not just cf=1.0',
    holds: () =>
      IMP124845_FLOWSHARE_COMPARISON.every(
        (r) => Math.abs(r.nonlinear_NUM) > 1e-6 && Math.abs(r.nonlinear_NUM / r.nonlinear_predicted - 1) < 1e-6
      ),
  },
];

for (const a of IMP124845_FLOWSHARE_COMPARISON_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124845-diag3-additivity-flowshare-viz-data assertion failed: ${a.id}`);
  }
}
