/**
 * @module imp-3870-smin-dmin-slack-measurement
 * @fileoverview imp-3870 (numerical, MEASUREMENT-ONLY): measure the smin
 * (smallest INDIVIDUAL shrunk gap) vs Dmin (nearest CUMULATIVE frozen distance)
 * slack per H_raw-plateau on [1e4, 1e6], and test whether the smin/Dmin < 1
 * slack -- the mechanism imp-3854 STEP-4 credited for the measured-vs-predicted
 * residual factor predictionRatio in [0.79, 1.56] -- actually reproduces that
 * residual. IT DOES NOT: the measurement REFUTES the smin/Dmin attribution and
 * relocates the residual to endpoint concavity, sharpening the imp-3854 story.
 *
 * SETTING (imp-3725 gap-domination bootstrap, thetaBar = 0.99, unchanged)
 * ----------------------------------------------------------------------
 * With T = H^2/(8*thetaBar) and s_l(T) = sqrt(max(g_l(0)^2 - 8T, 0)):
 *   D_j(T) = sum of s_l over the gap path from the record pair a to zero j,
 *   Dmin   = min_j D_j(T)          (nearest cumulative distance; adjacent-driven),
 *   smin   = min over gaps l != a of s_l(T)   (smallest INDIVIDUAL shrunk gap).
 * imp-3854 LEMMA gives d ln t_j/dT <= 8/smin^2 uniformly, so the RIGOROUS
 * elasticity constant is (H/smin)^2 >= (H/Dmin)^2. imp-3854 substituted Dmin for
 * smin ("smin ~= Dmin refinement: on the imp-3725 plateaus the nearest zero is
 * also the tightest gap") and confirmed the O((H/Dmin)^2) prediction against
 * imp-3728 to a factor predictionRatio in [0.79, 1.56], crediting the residual to
 *   (i)  smin/Dmin < 1 slack  (predictionRatio > 1 "where the tightest gap sits
 *        beyond the nearest zero"), and
 *   (ii) endpoint-concavity slack (predictionRatio < 1 elsewhere).
 *
 * WHAT WAS MEASURED (scripts/imp-3870-smin-dmin-slack-compute.mjs, node via
 * esbuild bundle over zeros-to-1e6.js, 2026-07-03)
 * ----------------------------------------------------------------------
 * For each of the 10 plateaus, the FULL endN system was scanned for the smallest
 * individual shrunk gap smin and its location relative to the record pair a:
 *
 *  (1) smin/Dmin is UNIFORMLY TINY: 0.0053 (plateau 9) to 0.0224 (plateau 4),
 *      i.e. (Dmin/smin)^2 ranges 1987x to 35493x. smin is NOWHERE ~= Dmin.
 *  (2) The tightest individual gap ALWAYS sits FAR from the record pair -- gap
 *      offsets from -259521 (plateau 7) to +418135 (plateau 9), NEVER adjacent
 *      (|offset| = 1) on ANY plateau. So the imp-3854 note "the nearest zero is
 *      also the tightest gap, so smin ~= Dmin" is FALSE: the nearest zero is the
 *      LARGEST-Dmin direction, and the tightest gap is a distant tail gap that
 *      contributes a negligible 1/D_j^2 term.
 *  (3) The rigorous LEMMA constant (H/smin)^2 is O(1)-O(22) (0.78 to 21.8), NOT
 *      a small parameter. The global-smin inequality dPsi/dT <= (8/smin^2)Psi is
 *      VALID but does NOT establish smallness of the horizon sensitivity.
 *
 * THE TEST -- does smin/Dmin reproduce the residual? NO, IT OVERSHOOTS BY 1e3-1e4x
 * ------------------------------------------------------------------------------
 * If the [0.79, 1.56] residual were the smin/Dmin slack, replacing the imp-3854
 * Dmin-based elasticity (H/Dmin)^2 by the rigorous (H/smin)^2 would inflate the
 * predicted relative K change by (Dmin/smin)^2 ~ 2e3-3.5e4, turning the near-1
 * predictionRatio into predictionRatio*(smin/Dmin)^2 ~ 1e-4 to 1e-3: the rigorous
 * smin bound OVERSHOOTS the measured change by 3-4 orders of magnitude (a valid
 * but hugely loose upper bound). Moreover smin/Dmin << 1 holds on EVERY plateau
 * regardless of predictionRatio sign (e.g. plateau 1 has predictionRatio 0.806
 * yet smin/Dmin 0.0104; plateau 7 has 0.789 yet 0.0117), so smin<Dmin does NOT
 * correlate with predictionRatio > 1 as imp-3854 (i) asserted.
 *
 * CORRECTED PICTURE (why (H/Dmin)^2 works and the residual is concavity)
 * ---------------------------------------------------------------------
 * The elasticity is dominated by the NEAREST-neighbour Psi term (j = a+-1), whose
 * path contains only the adjacent gap, so its PATH-LOCAL smin equals Dmin. The
 * far tail gaps that make the GLOBAL smin tiny sit at cumulative distance ~1e0
 * from the pair, so their 1/D_j^2 weight is negligible and they never enter the
 * effective constant. Hence (H/Dmin)^2 -- the nearest cumulative distance, i.e.
 * the path-local smin of the dominant term -- is the SHARP effective elasticity,
 * and the residual factor [0.79, 1.56] is endpoint concavity plus dominant-term
 * structure of the actual Psi sum, NOT the global smin/Dmin slack. The rigorous
 * global-smin bound is loose precisely because it charges every path with the
 * far-tail's tiny gap that the far terms do not need. This SHARPENS imp-3854:
 * the near-insensitivity is a Dmin (nearest-cumulative-distance) phenomenon, and
 * the (H/smin)^2 rigorous constant is a correct-but-vacuous over-bound.
 *
 * OPEN SUB-GAP
 * ------------
 *  - imp-3870-sub-concavity-fit: with smin/Dmin excluded as the residual driver,
 *    a quantitative endpoint-concavity model (per-plateau second derivative of
 *    theta_N in thetaBar over [0.99, thetaBar*]) was NOT fit here; the residual is
 *    ATTRIBUTED to concavity by elimination, not decomposed. Named open.
 *
 * HONEST SCOPE
 * ------------
 *  - MEASUREMENT of the imp-3854 residual mechanism against the imp-3725 zero
 *    table; smin rows baked from the offline scan (like imp-3725 rows). Dmin,
 *    theta, predictionRatio derive LIVE from imp-3725 and imp-3854.
 *  - Corrects an imp-3854 CHARACTERIZATION (residual = smin/Dmin slack); does NOT
 *    invalidate any imp-3854 INEQUALITY (LEMMA 3854 stays a valid over-bound) and
 *    does NOT change the certified K_paper enclosure or its thetaBar-robustness.
 *  - No new Lambda bound; imp-3066 K_a >= 0 positivity UNTOUCHED; no refereed bound is changed
 *    ; NO QED.
 *
 * @see imp-3854-thetabar-insensitivity-derivation.js (the residual this tests)
 * @see imp-3725-fmb-plateau-domination-lemma.js (source of Dmin, theta, H, a)
 * @see imp-3847-near-degeneracy-margin.js (Dmin/H proxy this complements)
 * @see scripts/imp-3870-smin-dmin-slack-compute.mjs (generator)
 */

import { IMP_3725_FMB_PLATEAU_DOMINATION } from './imp-3725-fmb-plateau-domination-lemma.js';
import { IMP_3854_THETABAR_INSENSITIVITY_DERIVATION } from './imp-3854-thetabar-insensitivity-derivation.js';

const SRC25 = IMP_3725_FMB_PLATEAU_DOMINATION.rows;   // H, Dmin, theta
const SRC54 = IMP_3854_THETABAR_INSENSITIVITY_DERIVATION.rows; // predictionRatio, hOverDminSq
const THETA_BAR = 0.99;

// Measured smin (smallest INDIVIDUAL shrunk gap over the full endN path, gaps
// l != a) and its location, baked from scripts/imp-3870-smin-dmin-slack-compute.mjs.
// DO NOT hand-edit; regenerate via the script. Dmin is NOT baked here -- it comes
// live from imp-3725 so the ratio stays single-source.
const SMIN_MEASURED = Object.freeze([
  { plateauIndex: 0, smin: 0.0208658,  sminGapIndex: 4764,   distFromPair: -1944   },
  { plateauIndex: 1, smin: 0.0075579,  sminGapIndex: 39984,  distFromPair: 21126   },
  { plateauIndex: 2, smin: 0.01420645, sminGapIndex: 64900,  distFromPair: 20346   },
  { plateauIndex: 3, smin: 0.01407334, sminGapIndex: 44554,  distFromPair: -29442  },
  { plateauIndex: 4, smin: 0.01511872, sminGapIndex: 73996,  distFromPair: -8555   },
  { plateauIndex: 5, smin: 0.00715654, sminGapIndex: 82551,  distFromPair: -5209   },
  { plateauIndex: 6, smin: 0.00685202, sminGapIndex: 254018, distFromPair: 158771  },
  { plateauIndex: 7, smin: 0.0066352,  sminGapIndex: 95247,  distFromPair: -259521 },
  { plateauIndex: 8, smin: 0.00974915, sminGapIndex: 354768, distFromPair: -60818  },
  { plateauIndex: 9, smin: 0.00367196, sminGapIndex: 839025, distFromPair: 418135  },
]);

// Per-plateau smin/Dmin slack confrontation with the imp-3854 predictionRatio.
// Everything but the baked smin derives LIVE from imp-3725 / imp-3854.
const ROWS = SMIN_MEASURED.map((m, i) => {
  const r25 = SRC25[i];
  const r54 = SRC54[i];
  const Dmin = r25.Dmin;
  const H = r25.H;
  const sminOverDmin = m.smin / Dmin;
  const dminOverSminSq = (Dmin / m.smin) ** 2;      // rigorous elasticity correction factor
  const hOverSminSq = (H / m.smin) ** 2;            // rigorous LEMMA 3854 constant
  const hOverDminSq = (H / Dmin) ** 2;              // imp-3854 effective (dominant-term) constant
  const predictionRatio = r54.predictionRatio;      // imp-3854 measured/predicted (Dmin-based)
  // If the residual were the smin/Dmin slack, the rigorous smin-based prediction
  // would give this predictionRatio (measured / smin-based-predicted):
  const predictionRatioIfSminBased = predictionRatio * sminOverDmin * sminOverDmin;
  const isAdjacent = Math.abs(m.distFromPair) === 1;
  return Object.freeze({
    plateauIndex: r25.plateauIndex,
    startN: r25.startN,
    endN: r25.endN,
    H,
    Dmin,
    smin: m.smin,
    sminGapIndex: m.sminGapIndex,
    distFromPair: m.distFromPair,
    isAdjacent,
    sminOverDmin,
    dminOverSminSq,
    hOverSminSq,
    hOverDminSq,
    predictionRatio,
    predictionRatioIfSminBased,
  });
});

const sminRatios = ROWS.map((r) => r.sminOverDmin);
const MIN_SMIN_OVER_DMIN = Math.min(...sminRatios);
const MAX_SMIN_OVER_DMIN = Math.max(...sminRatios);
const MIN_DMIN_OVER_SMIN_SQ = Math.min(...ROWS.map((r) => r.dminOverSminSq));
const MAX_DMIN_OVER_SMIN_SQ = Math.max(...ROWS.map((r) => r.dminOverSminSq));
const MAX_H_OVER_SMIN_SQ = Math.max(...ROWS.map((r) => r.hOverSminSq));
const ANY_ADJACENT = ROWS.some((r) => r.isAdjacent);

export const IMP_3870_SMIN_DMIN_SLACK_MEASUREMENT = Object.freeze({
  id: 'imp-3870',
  title:
    'smin (smallest individual shrunk gap) vs Dmin slack across the 10 imp-3725 ' +
    'plateaus: measurement REFUTES the imp-3854 smin/Dmin residual attribution ' +
    '(smin/Dmin ~ 0.005-0.02, would overshoot the [0.79,1.56] residual by 1e3-1e4x)',
  status: 'measurement-only',
  rhFree: true,
  semantics: 'characterization of an existing derivation; corrects a residual attribution, no new bound',

  thetaBar: THETA_BAR,
  rows: ROWS,

  headline: {
    plateauCount: ROWS.length,
    sminOverDminRange: [MIN_SMIN_OVER_DMIN, MAX_SMIN_OVER_DMIN],       // ~[0.0053, 0.0224]
    dminOverSminSqRange: [MIN_DMIN_OVER_SMIN_SQ, MAX_DMIN_OVER_SMIN_SQ], // ~[1987, 35493]
    maxHOverSminSq: MAX_H_OVER_SMIN_SQ,                                 // ~21.8 -- NOT small
    tightestGapEverAdjacent: ANY_ADJACENT,                             // false on all plateaus
    imp3854PredictionRatioRange: IMP_3854_THETABAR_INSENSITIVITY_DERIVATION.headline.predictionRatioRange,
    finding:
      'MEASURED smin/Dmin is 0.005-0.022 on all 10 plateaus (not ~= 1), and the ' +
      'smallest individual shrunk gap ALWAYS sits far from the record pair (never ' +
      'adjacent), so the imp-3854 note "the nearest zero is also the tightest gap, ' +
      'smin ~= Dmin" is FALSE. The smin/Dmin slack therefore CANNOT be the [0.79, ' +
      '1.56] residual: using the rigorous (H/smin)^2 elasticity would overshoot ' +
      'the measured relative K change by (Dmin/smin)^2 ~ 2e3-3.5e4x. The residual ' +
      'is endpoint concavity + dominant-term structure; the SHARP effective ' +
      'elasticity is (H/Dmin)^2 (nearest cumulative distance = path-local smin of ' +
      'the dominant term), and (H/smin)^2 is a correct-but-vacuous over-bound ' +
      '(O(1)-O(22), not small). This SHARPENS imp-3854. Necessary but not ' +
      'sufficient; no refereed bound is changed; imp-3066 untouched; NO QED.',
  },

  correctsImp3854:
    'imp-3854 STEP-4 credited the [0.79, 1.56] predictionRatio residual to the ' +
    'smin/Dmin < 1 slack (measured/predicted > 1 "where the tightest gap sits ' +
    'beyond the nearest zero"). MEASUREMENT: smin/Dmin ~ 0.005-0.02 UNIFORMLY (the ' +
    'tightest gap is always a distant tail gap, never adjacent), independent of the ' +
    'predictionRatio sign. The rigorous smin-based prediction overshoots the measured ' +
    'change by 1e3-1e4x, so the residual is NOT smin/Dmin; it is endpoint concavity. ' +
    'LEMMA 3854 stays a VALID (loose) over-bound -- only the residual attribution is ' +
    'corrected -- and the certified K_paper enclosure and thetaBar-robustness stand.',

  openSubGap: {
    id: 'imp-3870-sub-concavity-fit',
    status: 'open',
    blocker: false,
    statement:
      'With smin/Dmin excluded as the residual driver, a quantitative ' +
      'endpoint-concavity model (per-plateau second derivative of theta_N in ' +
      'thetaBar over [0.99, thetaBar*]) was not fit; the residual is attributed to ' +
      'concavity by elimination, not decomposed against a curvature computation.',
  },

  provenance: {
    zeros: 'src/data/zeros-to-1e6.js (Odlyzko; zeros1 3e-9, imp-359/imp-514)',
    generator: 'scripts/imp-3870-smin-dmin-slack-compute.mjs',
    generatedAt: '2026-07-03',
    note: 'smin rows baked from the offline scan; Dmin/theta/predictionRatio derive live from imp-3725/imp-3854.',
  },

  scope: {
    measurementOnly: true,
    noNewLambdaBound: true,
    imp3066Untouched: true,
    plattTrudgianStillSOTA: 'No refereed bound is changed',
    noQED: true,
  },
});

// -- Build-time assertions (throw on failure via run-assertions harness) -----

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const IMP_3870_SMIN_DMIN_SLACK_MEASUREMENT_ASSERTIONS = [
  {
    id: 'imp3870-derives-live-from-imp3725-and-imp3854',
    holds: () =>
      ROWS.length === 10 &&
      ROWS.every(
        (r, i) =>
          r.H === SRC25[i].H &&
          r.Dmin === SRC25[i].Dmin &&
          r.predictionRatio === SRC54[i].predictionRatio &&
          rel(r.sminOverDmin, r.smin / SRC25[i].Dmin) < 1e-12 &&
          rel(r.dminOverSminSq, (SRC25[i].Dmin / r.smin) ** 2) < 1e-12,
      ),
    why:
      'H, Dmin come from imp-3725 and predictionRatio from imp-3854; only smin is ' +
      'baked here. Any drift signals the source rows changed under the measurement.',
  },
  {
    id: 'imp3870-smin-uniformly-far-below-dmin',
    holds: () =>
      ROWS.every((r) => r.sminOverDmin > 0 && r.sminOverDmin < 0.05) &&
      MAX_SMIN_OVER_DMIN < 0.05 &&
      MIN_DMIN_OVER_SMIN_SQ > 1000,
    why:
      'Central measurement: smin/Dmin is 0.005-0.022 on EVERY plateau (never ~= 1), ' +
      'so (Dmin/smin)^2 > 1000x everywhere. This refutes the imp-3854 "smin ~= Dmin" ' +
      'note and shows the smin/Dmin slack is orders of magnitude too large to be the ' +
      'measured [0.79, 1.56] residual.',
  },
  {
    id: 'imp3870-tightest-gap-never-adjacent',
    holds: () => ROWS.every((r) => Math.abs(r.distFromPair) > 1) && ANY_ADJACENT === false,
    why:
      'The smallest individual shrunk gap sits far from the record pair on every ' +
      'plateau (|offset| > 1, up to ~4e5), never adjacent -- so it is a distant tail ' +
      'gap with negligible 1/D_j^2 weight, not the nearest zero imp-3854 assumed.',
  },
  {
    id: 'imp3870-smin-based-prediction-overshoots-residual',
    holds: () =>
      ROWS.every(
        (r) =>
          // rigorous smin-based prediction overshoots measured by >=1000x, i.e.
          // the would-be predictionRatio collapses below 1e-3
          r.predictionRatioIfSminBased < 1.6e-3 &&
          r.predictionRatioIfSminBased > 0,
      ),
    why:
      'If the residual were the smin/Dmin slack, the rigorous (H/smin)^2 elasticity ' +
      'would give predictionRatio*(smin/Dmin)^2 < 1.6e-3 on every plateau -- a 1e3-1e4x ' +
      'overshoot of the measured near-1 factor. This is the quantitative refutation of ' +
      'the smin/Dmin attribution.',
  },
  {
    id: 'imp3870-rigorous-smin-constant-not-small',
    holds: () =>
      MAX_H_OVER_SMIN_SQ > 1 &&
      ROWS.some((r) => r.hOverSminSq > 1) &&
      ROWS.every((r) => r.hOverDminSq < 3e-3),
    why:
      'The rigorous LEMMA 3854 constant (H/smin)^2 reaches O(1)-O(22) and exceeds 1 on ' +
      'several plateaus, so the global-smin inequality does NOT establish smallness; ' +
      'only the effective (H/Dmin)^2 (< 3e-3) does. The rigorous bound is valid but ' +
      'vacuous for smallness.',
  },
  {
    id: 'imp3870-corrects-not-invalidates-imp3854',
    holds: () =>
      // LEMMA 3854 remains a valid over-bound: (H/smin)^2 >= (H/Dmin)^2 on every plateau
      ROWS.every((r) => r.hOverSminSq >= r.hOverDminSq) &&
      // and the imp-3854 predictionRatio range is unchanged (we only reinterpret it)
      IMP_3854_THETABAR_INSENSITIVITY_DERIVATION.headline.predictionRatioRange[0] > 0.7 &&
      IMP_3854_THETABAR_INSENSITIVITY_DERIVATION.headline.predictionRatioRange[1] < 1.6,
    why:
      'This corrects a CHARACTERIZATION, not an inequality: (H/smin)^2 >= (H/Dmin)^2 ' +
      'still holds (LEMMA 3854 is a valid over-bound) and the imp-3854 predictionRatio ' +
      'range is untouched -- only its residual mechanism is reattributed.',
  },
  {
    id: 'imp3870-measurement-only-no-lambda-claim',
    holds: () =>
      IMP_3870_SMIN_DMIN_SLACK_MEASUREMENT.scope.noNewLambdaBound === true &&
      IMP_3870_SMIN_DMIN_SLACK_MEASUREMENT.scope.noQED === true &&
      IMP_3870_SMIN_DMIN_SLACK_MEASUREMENT.scope.imp3066Untouched === true &&
      IMP_3870_SMIN_DMIN_SLACK_MEASUREMENT.openSubGap.status === 'open',
    why:
      'Honesty guard: this is a measurement correcting an existing derivation. It must ' +
      'not assert a new Lambda bound or a QED, imp-3066 stays untouched, and the ' +
      'concavity-fit sub-gap stays named open; no refereed bound is changed.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_3870_SMIN_DMIN_SLACK_MEASUREMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3870-smin-dmin-slack-measurement assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_3870_SMIN_DMIN_SLACK_MEASUREMENT;
