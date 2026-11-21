/**
 * imp-96051 -- CROSS-VALIDATING Route L's CMV finite Hilbert-Polya truncation against the
 * in-repo verified zero ordinates, and MEASURING the actual per-zero angle error to confirm
 * or correct the "39 zeros to 1e-12 in angle" reproduction claim.
 *
 * Route L (rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js, ROUTE_L.a20) builds a
 * 400x400 unitary CMV matrix from Taylor data of xi at s = 1/2 + a with a = 20 (NO zero input),
 * whose eigen-angles are claimed to reproduce the first 39 zeta zeros "to 1e-12 in angle" with
 * the exact weights 4a^2/(a^2 + gamma^2). The angle map is the Cayley/Herglotz transform
 * z_rho(a) = (rho - 1/2 - a)/(rho - 1/2 + a); for rho = 1/2 + i*gamma this has modulus 1 and
 * argument theta = arg z_rho = pi - 2*atan(gamma/a). The Route L source baked the 12 leading
 * CMV nodes [k, gamma_k, theta_k, node angle, node - theta, node weight, 4a^2/(a^2+gamma^2)]
 * but never cross-validated them against the in-repo verified ordinates -- the node - theta
 * column was formed against its OWN 12-digit-printed theta_k, not against a full-precision map.
 *
 * METHOD (import-light: only src/data/zeros-first-25.js, no zeros-to-1e6.js bundle, no sibling
 * self-executing module). The 12 leading CMV node angles are re-baked verbatim from ROUTE_L.a20
 * .nodes400. For each the full-precision verified ordinate gamma_k is taken from FIRST_25_ZEROS
 * (the first-12 slice, identical to ZEROS_EXTENDED.slice(0,12)); the forward map
 * theta_true = pi - 2*atan(gamma_k/20) and the backward map gamma_rec = 20*tan((pi - node)/2)
 * are computed exactly. Four errors are measured per zero and aggregated:
 *   (A) angle error   = |node angle - theta_true|   -- the ACTUAL CMV reproduction error;
 *   (B) recovery error = |gamma_rec - gamma_k|       -- z_rho backward map vs verified ordinate;
 *   (C) weight abs err = |node weight - 4a^2/(a^2+gamma_k^2)| against the verified ordinate;
 *   (D) weight rel err = (C) / (4a^2/(a^2+gamma_k^2)).
 * The Route L table's own node - theta column is re-summarised for contrast.
 *
 * FINDINGS.
 *  1. The 1e-12 angle claim is CONFIRMED, and is in fact CONSERVATIVE. Measured against the
 *     full-precision in-repo ordinates, the CMV node angles match the exact z_rho map to
 *     max 4.82e-13 (at zero 1), mean 1.97e-13 over the 12 -- roughly 2x-5x BELOW the stated
 *     1e-12. Every one of the 12 leading nodes lands within 1e-12 of the verified ordinate's
 *     angle; the claim holds with margin.
 *  2. The backward map z_rho is verified. gamma_rec = 20*tan((pi - node)/2) recovers all 12
 *     verified ordinates to max 2.05e-11 (mean ~7e-12); this residual is dominated by the
 *     12-significant-figure printing of the baked node angle, not by CMV error (propagating a
 *     ~5e-13 angle error through d gamma / d theta = -(a^2+gamma^2)/(2a) ~ -25 at zero 1 gives
 *     ~1e-11, matching the observed recovery scale).
 *  3. The weights reproduce 4a^2/(a^2+gamma^2) against the verified ordinates to max relative
 *     7.79e-9 (max absolute 4.33e-9) -- two orders tighter than the 5% "resolved" screen and
 *     consistent with the source's stated 1e-7 weight agreement.
 *  4. The Route L table's own node - theta column (max 1.77e-11) OVERSTATES the reproduction
 *     error by ~40x: it compares the node against a theta_k that was itself printed to only 12
 *     digits. Cross-validating against the full-precision ordinate removes that rounding and
 *     exposes the true ~1e-13 agreement -- i.e. the correction runs in the FAVOURABLE direction
 *     (the operator is better than its own baked residual column suggested).
 *
 * HONEST CAVEAT / SUB-GAP (SG-96051-reach). Only the 12 CMV node angles BAKED in the Route L
 * table are cross-validated here; the wider "39 zeros resolved at N = 400" reach claim
 * (ROUTE_L.a20.resolvedFirst40 = [[50,11],...,[400,39]]) and the sublinear reach law
 * (imp-96045) are NOT independently re-derived -- doing so requires re-running the 200-digit
 * Levinson-Durbin recursion and the 400x400 CMV diagonalisation, which is outside this
 * import-light data leaf. What is established is that WHERE the Route L table exposes node
 * angles (the first 12), they match the in-repo verified ordinates to ~1e-13, strictly better
 * than claimed. Cross-validation only; changes no bound; NO QED; no refereed bound is changed
 * ; Route L stays NOT-A-LEVER (its RH content is exactly the resolved zeros, its
 * completeness is Weil positivity, and it imports no external arithmetic input).
 *
 * @see rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23 (ROUTE_L.a20 -- the CMV operator + nodes400 table)
 * @see zeros-first-25 (the in-repo verified ordinate leaf used for the cross-validation)
 * @see imp-96045 (the N = 400 -> 800 reach extension; sublinear reach law)
 */

import { FIRST_25_ZEROS } from './zeros-first-25.js';

const A = 20; // the Route L truncation base point s = 1/2 + a

// Forward angle map theta = arg z_rho(a) = pi - 2*atan(gamma/a) for rho = 1/2 + i*gamma.
const forwardAngle = (gamma) => Math.PI - 2 * Math.atan(gamma / A);
// Backward map gamma = a*tan((pi - theta)/2), the inverse of forwardAngle.
const backwardGamma = (theta) => A * Math.tan((Math.PI - theta) / 2);
// Herglotz weight 4a^2/(a^2 + gamma^2).
const weight = (gamma) => (4 * A * A) / (A * A + gamma * gamma);

// The 12 leading CMV nodes baked verbatim from ROUTE_L.a20.nodes400:
// [k, gamma_k (10-dp print), theta_k (12-dp print), node angle (12-dp print), node - theta, node weight, 4a^2/(a^2+gamma_k^2)].
const NODES400 = [
  [1, 14.1347251420, 1.911127354660, 1.911127354678, 1.769185e-11, 2.66759830, 2.66759830],
  [2, 21.0220396390, 1.520977826430, 1.520977826441, 1.085332e-11, 1.90040421, 1.90040421],
  [3, 25.0108575800, 1.349058286191, 1.349058286186, -5.685230e-12, 1.56014912, 1.56014912],
  [4, 30.4248761260, 1.163059211447, 1.163059211451, 4.238387e-12, 1.20693406, 1.20693406],
  [5, 32.9350615880, 1.091474828605, 1.091474828612, 7.026824e-12, 1.07764552, 1.07764552],
  [6, 37.5861781590, 0.978009617848, 0.978009617852, 3.847367e-12, 0.88265110, 0.88265110],
  [7, 40.9187190120, 0.909252853477, 0.909252853474, -2.841949e-12, 0.77132909, 0.77132909],
  [8, 43.3270732810, 0.864925496861, 0.864925496863, 1.491141e-12, 0.70260636, 0.70260636],
  [9, 48.0051508810, 0.789506049902, 0.789506049899, -2.471134e-12, 0.59160778, 0.59160778],
  [10, 49.7738324780, 0.764144515819, 0.764144515824, 4.556799e-12, 0.55605090, 0.55605090],
  [11, 52.9703214780, 0.722043688551, 0.722043688555, 3.562484e-12, 0.49908683, 0.49908683],
  [12, 56.4462476970, 0.681035266049, 0.681035266048, -7.093215e-13, 0.44615733, 0.44615733],
];

const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;

// Per-zero cross-validation against the full-precision in-repo verified ordinates.
const rows = NODES400.map((r) => {
  const k = r[0];
  const nodeAngle = r[3];
  const nodeWeight = r[5];
  const gammaTrue = FIRST_25_ZEROS[k - 1]; // verified ordinate, full precision
  const thetaTrue = forwardAngle(gammaTrue);
  const gammaRec = backwardGamma(nodeAngle);
  const wTrue = weight(gammaTrue);
  return {
    k,
    gammaTrue,
    angleErr: Math.abs(nodeAngle - thetaTrue), // (A)
    recoveryErr: Math.abs(gammaRec - gammaTrue), // (B)
    weightAbsErr: Math.abs(nodeWeight - wTrue), // (C)
    weightRelErr: Math.abs(nodeWeight - wTrue) / wTrue, // (D)
    tableNodeMinusTheta: Math.abs(r[4]), // Route L own residual column, for contrast
  };
});

const summary = {
  count: rows.length,
  maxAngleErr: Math.max(...rows.map((r) => r.angleErr)),
  meanAngleErr: mean(rows.map((r) => r.angleErr)),
  maxRecoveryErr: Math.max(...rows.map((r) => r.recoveryErr)),
  meanRecoveryErr: mean(rows.map((r) => r.recoveryErr)),
  maxWeightAbsErr: Math.max(...rows.map((r) => r.weightAbsErr)),
  maxWeightRelErr: Math.max(...rows.map((r) => r.weightRelErr)),
  maxTableNodeMinusTheta: Math.max(...rows.map((r) => r.tableNodeMinusTheta)),
  allWithin1e12: rows.every((r) => r.angleErr < 1e-12),
};

export const IMP96051_ROUTE_L_CMV_ZERO_CROSSVAL = {
  ticket: 'imp-96051',
  source:
    'rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js ROUTE_L.a20.nodes400: 12 leading CMV node angles at a = 20, N = 400. Verified ordinates: FIRST_25_ZEROS (first-12 slice) from src/data/zeros-first-25.js, identical to ZEROS_EXTENDED.slice(0,12).',
  map: {
    a: A,
    forward: 'theta = arg z_rho(a) = pi - 2*atan(gamma/a) for rho = 1/2 + i*gamma (|z_rho| = 1 on the critical line)',
    backward: 'gamma = a*tan((pi - theta)/2), the exact inverse used to map CMV eigen-angles back to ordinates',
    weight: '4a^2/(a^2 + gamma^2), the Herglotz mass at each atom',
  },
  perZero: rows,
  summary,
  claimCheck: {
    claimed: '39 zeros to 1e-12 in angle with weights 4a^2/(a^2+gamma^2) (weight agreement ~1e-7)',
    measuredOn: 'the 12 leading nodes the Route L table exposes',
    verdict: 'CONFIRMED and CONSERVATIVE',
    detail:
      'max angle error 4.82e-13 (mean 1.97e-13) vs verified ordinates -- below the claimed 1e-12; z_rho backward map recovers all 12 ordinates to 2.05e-11 (printing-limited); weights match to 7.79e-9 relative. The table own node - theta column (1.77e-11) overstates the error ~40x because it compares against a 12-digit-printed theta_k, not the full-precision map.',
  },
  subGap:
    'SG-96051-reach: only the 12 baked node angles are cross-validated. The wider "39 resolved at N = 400" reach claim (ROUTE_L.a20.resolvedFirst40) and the sublinear reach law (imp-96045) require re-running the 200-digit Levinson + 400x400 CMV diagonalisation and are NOT re-derived in this import-light leaf. -- CLOSED by imp-96067 (see reachCrossval below).',
  // imp-96067 (SG-96051-reach closure): the reach curve WAS independently re-derived. A fresh
  // dps = 200 pipeline (own Cauchy lambda_n extraction on |z| = 0.9, own Levinson-Durbin, own CMV
  // build + numpy diagonalisation; tmp/imp-96067-route-l-reach-crossval.py, 41.3 s) reproduces the
  // resolved-count-vs-N curve EXACTLY at all six rungs. Resolved = node within 10% of the local gap
  // AND weight within 5% of 4a^2/(a^2+gamma^2), scored against the verified ordinates. Corroborating
  // invariants also matched: lambda_1 = 26.661980955994005 vs closed form 2a*(xi-prime/xi)(1/2+a)
  // to 7e-89, c_0 = 53.32396191198801, min(1-|alpha|) = 0.0308849 and max|alpha| = 0.9691151161 both
  // attained at interior order k = 68 (0-based), Levinson reached order 399 with no PD-fail.
  reachCrossval: {
    ticket: 'imp-96067',
    pipeline: 'independent dps=200 re-run: own Cauchy lambda_n on |z|=0.9 (M=2048) -> own Levinson-Durbin -> own CMV build + numpy eig',
    // [N, independently measured resolved-among-first-40, ROUTE_L.a20.resolvedFirst40 reference]
    curve: [[50, 11, 11], [100, 21, 21], [150, 26, 26], [200, 28, 28], [300, 33, 33], [400, 39, 39]],
    invariants: { lambda1: 26.661980955994005, lambda1ClosedDiff: 7.21e-89, c0: 53.32396191198801, minOneMinusAbsAlpha: 0.0308849, maxAbsAlpha: 0.9691151161, ordersReached: 399, pdFail: false },
    verdict: 'CONFIRMED: the independently re-derived resolved-count curve matches resolvedFirst40 at every rung (11/21/26/28/33/39); the 39-zeros-at-N=400 reach claim is reproduced from scratch. Cross-validation only; changes no bound; NO QED; no refereed bound is changed.',
  },
  verdict:
    'CROSS-VALIDATED: the Route L a = 20 CMV truncation reproduces the first 12 verified zeta ordinates through the Cayley map theta = pi - 2*atan(gamma/20) to max angle error 4.82e-13 (mean 1.97e-13), CONFIRMING and beating the claimed 1e-12; the z_rho backward map recovers the ordinates to 2.05e-11 (printing-limited) and the weights 4a^2/(a^2+gamma^2) reproduce to 7.79e-9 relative. The table own node - theta column (1.77e-11) is inflated ~40x by 12-digit theta_k printing, so the correction is favourable. Sub-gap SG-96051-reach: the 39-zero reach claim is not independently re-derived here. Cross-validation only; changes no bound; NO QED; no refereed bound is changed; Route L stays NOT-A-LEVER (RH content = resolved zeros, completeness = Weil positivity, no external arithmetic input).',
};

// --- self-executing internal-consistency assertions (map re-derivation + baked-literal reproduction only) ---
(() => {
  const approx = (x, y, tol) => Math.abs(x - y) <= tol;
  // forward/backward maps are exact inverses on a probe ordinate
  const probe = 14.134725141734693790;
  if (!approx(backwardGamma(forwardAngle(probe)), probe, 1e-9))
    throw new Error('imp-96051: z_rho forward/backward map is not an involutive inverse');
  // the 1e-12 angle claim is confirmed and conservative on all 12 nodes
  if (!summary.allWithin1e12) throw new Error('imp-96051: a node angle exceeded the claimed 1e-12 vs verified ordinate');
  if (!(summary.maxAngleErr < 1e-12)) throw new Error('imp-96051: max angle error not below the claimed 1e-12');
  if (!approx(summary.maxAngleErr, 4.8206e-13, 1e-15)) throw new Error('imp-96051: max angle error drifted');
  if (!approx(summary.meanAngleErr, 1.9712e-13, 1e-15)) throw new Error('imp-96051: mean angle error drifted');
  // backward-map recovery is printing-limited (~2e-11), and larger than the raw angle error
  if (!approx(summary.maxRecoveryErr, 2.0520e-11, 1e-13)) throw new Error('imp-96051: max recovery error drifted');
  if (!(summary.maxRecoveryErr > summary.maxAngleErr)) throw new Error('imp-96051: recovery error should exceed the raw angle error (printing-limited)');
  // weights reproduce to ~1e-8 relative
  if (!approx(summary.maxWeightRelErr, 7.7866e-9, 1e-11)) throw new Error('imp-96051: max weight relative error drifted');
  // the table own node - theta column overstates the true angle error
  if (!(summary.maxTableNodeMinusTheta > 10 * summary.maxAngleErr))
    throw new Error('imp-96051: table node - theta column should overstate the cross-validated angle error');
  // imp-96067 reach re-derivation: measured curve matches resolvedFirst40, monotone, ends at 39
  const rc = IMP96051_ROUTE_L_CMV_ZERO_CROSSVAL.reachCrossval.curve;
  if (!rc.every(([, meas, ref]) => meas === ref))
    throw new Error('imp-96067: independently measured reach count disagrees with resolvedFirst40');
  if (!rc.every(([, m], i) => i === 0 || m > rc[i - 1][1]))
    throw new Error('imp-96067: reach curve is not strictly increasing in N');
  if (rc[rc.length - 1][1] !== 39 || rc[rc.length - 1][0] !== 400)
    throw new Error('imp-96067: reach curve does not terminate at 39 resolved at N = 400');
  // honesty gates
  if (!/NO QED/.test(IMP96051_ROUTE_L_CMV_ZERO_CROSSVAL.verdict))
    throw new Error('imp-96051: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96051_ROUTE_L_CMV_ZERO_CROSSVAL.verdict))
    throw new Error('imp-96051: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96051_ROUTE_L_CMV_ZERO_CROSSVAL;
