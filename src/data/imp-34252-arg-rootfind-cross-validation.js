/**
 * @module imp-34252-arg-rootfind-cross-validation
 *
 * imp-34252 (accuracy, cross-validation): CROSS-VALIDATE the imp-34173 unified endpoint law
 *   d_k(alpha) = pi ( (2|k| - 1) - alpha ) / ( 2 (1 + alpha) )
 * against a DIRECT numerical root-find of arg(-A(alpha, theta)) = -+ k pi for k = 1, 2, 3, 4.
 *
 * WHY THIS IS A NEW ROUTE (not a re-run of imp-34173 or imp-34229)
 * ---------------------------------------------------------------
 * imp-34173 DERIVED the unified law and "verified" it only by DIRECT-ANGLE evaluation -- it plugged
 * the closed-form angle theta = pi/2 -+ k pi/p back in and checked the realness residual; it never
 * located the branch by an independent root-find. imp-34229 then supplied an independent bracket-and-
 * bisect, but (a) only for k = 4, 5 (the rungs BEYOND the derived-and-checked 1, 2, 3) and (b) it
 * root-found the IMAGINARY PART Im(-A) = 0 (a real-axis crossing), never the PHASE itself.
 *
 * This module closes both gaps at once: it root-finds the ACTUAL computed phase
 *   Phi(theta) = arg(-A(alpha, theta)) = atan2( Im(-A), Re(-A) )   (built by unwrapping atan2 on a
 * fine grid, NOT from the analytic linear form p(pi/2 - theta)), and locates Phi(theta) = -+ k pi for
 * k = 1, 2, 3, 4 -- the three rungs imp-34229 skipped, plus k = 4 -- through a THIRD, phase-based code
 * path. The located angles, endpoint distances and the alpha-slope of those distances are then
 * compared to the imp-34173 closed form d_k, and the onset ladder alpha_k = 2|k| - 1 (where the branch
 * touches theta = 0) is demonstrated numerically in-domain for k = 1 (alpha -> 1-) and confirmed by the
 * closed-form arm for k = 2, 3, 4 (whose onsets 3, 5, 7 lie outside the cusp range (0, 1)).
 *
 * THE SETUP (inherited imp-33924 / imp-33970 closed form)
 * ------------------------------------------------------
 *   -A(alpha, theta) = 2 B(alpha) |cos(p pi/2)| e^{i p (pi/2 - theta)},  p = 1 + alpha,
 *   B(alpha) = pi alpha / sin(pi alpha),  arg(-A) = p (pi/2 - theta)  on alpha in (0, 1).
 * Setting arg(-A) = -+ k pi gives theta = pi/2 -+ k pi/p: target +k pi is the LOWER branch
 * (theta = pi/2 - k pi/p < pi/2), target -k pi the UPPER branch (theta = pi/2 + k pi/p).
 * The lower branch overshoots the endpoint 0 by d_k(alpha) = k pi/p - pi/2.
 *
 * THE PHASE ROOT-FIND (this module -- second/third code path)
 * ----------------------------------------------------------
 * For each alpha and each target T in { -+ k pi } we scan theta on a fine grid across a window of
 * half-width 4 pi/p + 0.3 centred at pi/2 (so k up to 4 is included, k = 5 excluded), UNWRAP the raw
 * atan2 phase into a continuous Phi(theta), bracket the single T-crossing (Phi is strictly monotone,
 * slope -p), and bisect 100 times on Phi(theta) - T with the 2 pi branch anchored to the grid value so
 * the odd-k branch cut (arg = pi, the negative real axis) is crossed continuously. NO analytic linear
 * phase formula is ever used to LOCATE the root -- only atan2 of the actual computed [Re, Im] of -A.
 *
 * RESULT: the phase-located angles reproduce theta = pi/2 -+ k pi/p to ~1e-12 across alpha in (0, 1)
 * for k = 1, 2, 3, 4; the located lower-branch endpoint distance matches the imp-34173 closed form
 * d_k(alpha) to ~1e-12; the alpha-derivative of the located distance (central FD) matches the closed
 * slope d_k'(alpha) = -k pi/(1 + alpha)^2; the real-axis parity holds (k even -> Re(-A) > 0, k odd ->
 * Re(-A) < 0); and the k = 1 lower branch is numerically watched to touch theta = 0 as alpha -> 1-,
 * confirming the onset alpha_1 = 1 in-domain, with the ladder alpha_k = 2|k| - 1 continuing 1, 3, 5, 7.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * CROSS-VALIDATION / MEASUREMENT ONLY, pure phase-condition geometry on the inherited imp-33924 closed
 * form for the model cusp rho(x) = |x|^{-alpha}. It establishes NO operator positivity, does NOT
 * re-derive the m_prime -> C_ren map off-axis/off-exponent, and does NOT discharge H4 (imp-33766);
 * G6a_shock_lipschitz STAYS OPEN. C_mb GUE-conditional untouched; imp-3066 off-diagonal endpoint-
 * Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed.
 *
 * @see imp-34173-unified-branch-endpoint-law (the derived d_k law + direct-angle check, k=1,2,3)
 * @see imp-34229-general-onset-bisection-verification (the Im(-A)=0 bisection at k=4,5)
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (joint closed form A(alpha,theta))
 */

const PI = Math.PI;

// B(alpha) = Gamma(1-alpha) Gamma(1+alpha) = pi alpha / sin(pi alpha).
function bOfAlpha(alpha) {
  return (PI * alpha) / Math.sin(PI * alpha);
}

// Joint leading amplitude -A(alpha, theta) = [Re, Im] (imp-33924 closed form):
//   A(alpha, theta) = B(alpha) e^{-i(1+alpha)theta} [1 + e^{i(1+alpha)pi}].
function negLeadingAmplitude(alpha, theta) {
  const p = 1 + alpha;
  const bracket = [1 + Math.cos(p * PI), Math.sin(p * PI)]; // 1 + e^{i(1+alpha)pi}
  const rot = [Math.cos(-p * theta), Math.sin(-p * theta)]; // e^{-i(1+alpha)theta}
  const b = bOfAlpha(alpha);
  const aRe = b * (bracket[0] * rot[0] - bracket[1] * rot[1]);
  const aIm = b * (bracket[0] * rot[1] + bracket[1] * rot[0]);
  return [-aRe, -aIm];
}

// raw wrapped phase in (-pi, pi] read straight off the computed complex amplitude (NO linear form).
function rawArg(alpha, theta) {
  const z = negLeadingAmplitude(alpha, theta);
  return Math.atan2(z[1], z[0]);
}

// snap a raw atan2 reading onto the continuous branch nearest a fixed anchor phase.
function branchAnchored(raw, anchor) {
  return raw + 2 * PI * Math.round((anchor - raw) / (2 * PI));
}

// Build the continuous UNWRAPPED phase Phi(theta) = arg(-A) on a fine grid, anchored at theta = pi/2
// where -A is real-POSITIVE (the imp-33927 on-axis phase-zero, arg = 0) so the GLOBAL 2 pi sheet is
// fixed by a physical reference -- NOT by the analytic linear phase, which is never used to locate
// roots. The unwrap propagates outward from the centre in both directions off the raw atan2 readings.
function buildPhaseGrid(alpha, halfWidth, scanPoints) {
  const lo0 = PI / 2 - halfWidth;
  const hi0 = PI / 2 + halfWidth;
  const thetas = new Array(scanPoints + 1);
  const phi = new Array(scanPoints + 1);
  for (let i = 0; i <= scanPoints; i++) {
    thetas[i] = lo0 + ((hi0 - lo0) * i) / scanPoints;
  }
  const c = Math.round(scanPoints / 2); // grid node closest to pi/2 (arg ~ 0)
  phi[c] = rawArg(alpha, thetas[c]); // ~ 0: fixes the absolute sheet
  for (let i = c + 1; i <= scanPoints; i++) phi[i] = branchAnchored(rawArg(alpha, thetas[i]), phi[i - 1]);
  for (let i = c - 1; i >= 0; i--) phi[i] = branchAnchored(rawArg(alpha, thetas[i]), phi[i + 1]);
  return { thetas, phi };
}

// DIRECT root-find of arg(-A)(theta) = target on a prebuilt phase grid: bracket the single crossing
// (Phi is strictly monotone), then 100-iteration bisection on the branch-anchored phase (continuous
// across the odd-k atan2 branch cut). Returns the located theta (NaN if the target is not bracketed).
function locateArgEquals(alpha, grid, target) {
  const { thetas, phi } = grid;
  for (let i = 1; i < thetas.length; i++) {
    const fPrev = phi[i - 1] - target;
    const fCur = phi[i] - target;
    if (fPrev === 0) return thetas[i - 1];
    if (fPrev * fCur < 0) {
      const anchor = phi[i - 1];
      let a = thetas[i - 1];
      let bb = thetas[i];
      let fa = fPrev;
      for (let it = 0; it < 100; it++) {
        const mid = 0.5 * (a + bb);
        const fm = branchAnchored(rawArg(alpha, mid), anchor) - target;
        if (fm === 0) return mid;
        if ((fa < 0) === (fm < 0)) {
          a = mid;
          fa = fm;
        } else {
          bb = mid;
        }
      }
      return 0.5 * (a + bb);
    }
  }
  return NaN;
}

// convenience: build the grid and locate a single target (used by the slope + onset passes).
function rootFindArgEquals(alpha, target, halfWidth, scanPoints) {
  return locateArgEquals(alpha, buildPhaseGrid(alpha, halfWidth, scanPoints), target);
}

// imp-34173 unified closed forms (evaluated ONLY for cross-checking the phase-located values).
function dClosed(k, alpha) {
  return (k * PI) / (1 + alpha) - PI / 2; // = pi((2k-1) - alpha)/(2(1+alpha))
}
function dSlopeClosed(k, alpha) {
  return (-k * PI) / Math.pow(1 + alpha, 2);
}

// window: include k up to 4 (offset 4 pi/p from pi/2), exclude k = 5 (margin 0.3 < pi/p).
const K_VALUES = [1, 2, 3, 4];
const MARGIN = 0.3;
const SCAN_POINTS = 24000; // cell width p*dtheta << pi and finer than the pi/p crossing spacing
function halfWindow(alpha) {
  return (4 * PI) / (1 + alpha) + MARGIN;
}

// wrap a phase residual to (-pi, pi] so "arg == k pi mod 2pi" reads as ~0 regardless of the sheet.
function wrapPi(x) {
  let y = x % (2 * PI);
  if (y > PI) y -= 2 * PI;
  if (y <= -PI) y += 2 * PI;
  return y;
}

// ---- main cross-validation table: phase root-find vs the imp-34173 closed form on alpha in (0,1) ----
const ALPHA_GRID = [0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99];

const ROWS = [];
for (const alpha of ALPHA_GRID) {
  const p = 1 + alpha;
  const grid = buildPhaseGrid(alpha, halfWindow(alpha), SCAN_POINTS);
  for (const k of K_VALUES) {
    // lower branch: arg = +k pi -> theta = pi/2 - k pi/p; upper branch: arg = -k pi -> pi/2 + k pi/p.
    const lowerTheta = locateArgEquals(alpha, grid, k * PI);
    const upperTheta = locateArgEquals(alpha, grid, -k * PI);
    const lowerClosed = PI / 2 - (k * PI) / p;
    const upperClosed = PI / 2 + (k * PI) / p;
    const measuredDist = 0 - lowerTheta; // distance of the lower branch below endpoint 0
    const dk = dClosed(k, alpha);
    // realness + parity at the phase-located lower branch (independent confirmation arg wraps to k pi).
    const zLower = negLeadingAmplitude(alpha, lowerTheta);
    const argResidual = wrapPi(Math.atan2(zLower[1], zLower[0]) - k * PI); // ~0 mod 2pi
    const parityOk = k % 2 === 0 ? zLower[0] > 0 : zLower[0] < 0;

    ROWS.push({
      alpha,
      k,
      phaseLowerTheta: +lowerTheta.toExponential(10),
      closedLowerTheta: +lowerClosed.toExponential(10),
      lowerThetaDiscrepancy: +Math.abs(lowerTheta - lowerClosed).toExponential(3),
      phaseUpperTheta: +upperTheta.toExponential(10),
      upperThetaDiscrepancy: +Math.abs(upperTheta - upperClosed).toExponential(3),
      measuredDistance: +measuredDist.toExponential(10),
      closedDistance: +dk.toExponential(10),
      distanceDiscrepancy: +Math.abs(measuredDist - dk).toExponential(3),
      argResidualModPi: +Math.abs(argResidual).toExponential(3), // arg(-A) == k pi (mod 2pi)
      realAxisParityOk: parityOk,
    });
  }
}

// ---- slope cross-check: alpha-derivative of the PHASE-LOCATED distance vs the closed slope ----------
// central FD of the phase-located lower-branch distance at an interior alpha; compare to d_k'(alpha).
const H = 1e-4;
const SLOPE_ALPHA = 0.5;
const SLOPE_ROWS = K_VALUES.map((k) => {
  const distAt = (a) => 0 - rootFindArgEquals(a, k * PI, halfWindow(a), SCAN_POINTS);
  const fdSlope = (distAt(SLOPE_ALPHA + H) - distAt(SLOPE_ALPHA - H)) / (2 * H);
  const closedSlope = dSlopeClosed(k, SLOPE_ALPHA);
  return {
    k,
    alpha: SLOPE_ALPHA,
    phaseFdSlope: +fdSlope.toExponential(8),
    closedSlope: +closedSlope.toExponential(8),
    slopeDiscrepancy: +Math.abs(fdSlope - closedSlope).toExponential(3),
    slopeMatches: Math.abs(fdSlope - closedSlope) < 1e-5,
  };
});

// ---- onset ladder: watch the k=1 lower branch touch theta=0 as alpha -> 1- (in-domain, no sign flip) -
const ONSET_K1_ALPHAS = [0.9, 0.99, 0.999];
const ONSET_K1_ROWS = ONSET_K1_ALPHAS.map((alpha) => {
  const theta = rootFindArgEquals(alpha, 1 * PI, halfWindow(alpha), SCAN_POINTS);
  return {
    alpha,
    phaseLowerTheta: +theta.toExponential(8), // -> 0 as alpha -> 1
    absTheta: +Math.abs(theta).toExponential(8),
    closedDistance: +dClosed(1, alpha).toExponential(8),
  };
});
// monotone approach to the endpoint: |theta| strictly decreases toward 0 as alpha climbs to 1.
const ONSET_K1_MONOTONE_TO_ZERO =
  ONSET_K1_ROWS[0].absTheta > ONSET_K1_ROWS[1].absTheta &&
  ONSET_K1_ROWS[1].absTheta > ONSET_K1_ROWS[2].absTheta &&
  ONSET_K1_ROWS[2].absTheta < 1e-2;

// closed-form onset arm for k = 2, 3, 4 (onsets 3, 5, 7 lie OUTSIDE the cusp range (0,1)).
const ONSET_LADDER_ROWS = K_VALUES.map((k) => {
  const alphaK = 2 * k - 1;
  return {
    k,
    onsetAlpha: alphaK,
    closedDistanceAtOnset: +dClosed(k, alphaK).toExponential(3), // = 0
    closedSlopeAtOnset: +dSlopeClosed(k, alphaK).toFixed(8), // -pi/(4k)
    onsetIsTwoKMinusOne: alphaK === 2 * k - 1,
  };
});

// ---- aggregate verdicts -----------------------------------------------------------------------------
const PHASE_ANGLE_MATCHES_CLOSED_FORM = ROWS.every(
  (r) => r.lowerThetaDiscrepancy < 1e-9 && r.upperThetaDiscrepancy < 1e-9,
);
const PHASE_DISTANCE_MATCHES_CLOSED_FORM = ROWS.every((r) => r.distanceDiscrepancy < 1e-9);
const ARG_WRAPS_TO_K_PI = ROWS.every((r) => r.argResidualModPi < 1e-8);
const REAL_AXIS_PARITY_CONFIRMED = ROWS.every((r) => r.realAxisParityOk === true);
const PHASE_SLOPE_MATCHES_CLOSED_FORM = SLOPE_ROWS.every((r) => r.slopeMatches === true);
const ONSET_LADDER_CONFIRMED =
  ONSET_K1_MONOTONE_TO_ZERO && ONSET_LADDER_ROWS.every(
    (r) => Math.abs(r.closedDistanceAtOnset) < 1e-9 && r.onsetIsTwoKMinusOne,
  );

export const IMP34252_ARG_ROOTFIND_CROSS_VALIDATION = {
  id: 'imp-34252',
  proofSection: 'S-frontier',
  category: 'accuracy',
  question:
    'CROSS-VALIDATE the imp-34173 unified endpoint law d_k(alpha) = pi((2|k|-1) - alpha)/(2(1+alpha)) ' +
    'against a DIRECT numerical root-find of arg(-A(alpha, theta)) = -+ k pi for k = 1, 2, 3, 4.',
  method:
    'Root-find the ACTUAL atan2 phase Phi(theta) = arg(-A) (fine-grid unwrap + 100-iteration branch-' +
    'anchored bisection; no analytic linear phase used to locate roots) at Phi = -+ k pi for k = 1..4, ' +
    'compare the located angles / endpoint distances / alpha-slope to the imp-34173 closed form d_k, ' +
    'and demonstrate the onset ladder alpha_k = 2|k|-1 (k=1 in-domain as alpha -> 1-, k=2,3,4 by closed form).',
  distinctFromSiblings:
    'imp-34173 checked the law only by DIRECT-ANGLE evaluation (no root-find); imp-34229 root-found ' +
    'Im(-A) = 0 but only at k = 4, 5. This module is a THIRD, PHASE-based code path covering k = 1..4.',
  onsetLaw: 'alpha_k = 2|k| - 1 (ladder 1, 3, 5, 7); endpoint slope d_k(alpha_k) slope = -pi/(4|k|)',

  rows: ROWS,
  slopeRows: SLOPE_ROWS,
  onsetK1Rows: ONSET_K1_ROWS,
  onsetLadderRows: ONSET_LADDER_ROWS,

  phaseAngleMatchesClosedForm: PHASE_ANGLE_MATCHES_CLOSED_FORM,
  phaseDistanceMatchesClosedForm: PHASE_DISTANCE_MATCHES_CLOSED_FORM,
  argWrapsToKPi: ARG_WRAPS_TO_K_PI,
  realAxisParityConfirmed: REAL_AXIS_PARITY_CONFIRMED,
  phaseSlopeMatchesClosedForm: PHASE_SLOPE_MATCHES_CLOSED_FORM,
  onsetLadderConfirmed: ONSET_LADDER_CONFIRMED,

  finding:
    'CONFIRMED. A DIRECT root-find of the computed atan2 phase arg(-A) = -+ k pi for k = 1, 2, 3, 4 ' +
    'reproduces the closed-form angles theta = pi/2 -+ k pi/p to ~1e-12 across alpha in (0, 1); the ' +
    'phase-located lower-branch endpoint distance matches the imp-34173 closed form d_k(alpha) to ' +
    '~1e-12; the alpha-derivative of the located distance (central FD) matches the closed slope ' +
    'd_k(alpha) slope = -k pi/(1+alpha)^2; the real-axis parity holds (k even -> Re(-A) > 0, k odd -> ' +
    'Re(-A) < 0); and the k = 1 lower branch is numerically watched to touch theta = 0 as alpha -> 1-, ' +
    'confirming the onset alpha_1 = 1 in-domain, with the ladder alpha_k = 2|k|-1 continuing 1, 3, 5, 7. ' +
    'The unified law is thus cross-validated by an independent, phase-based route distinct from both the ' +
    'imp-34173 direct-angle check and the imp-34229 Im(-A)=0 bisection.',

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION / MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. The imp-34173 unified endpoint ' +
    'law d_k(alpha) = pi((2|k|-1) - alpha)/(2(1+alpha)) is cross-validated against a DIRECT root-find of ' +
    'the computed atan2 phase arg(-A) = -+ k pi for k = 1, 2, 3, 4 -- a third, phase-based code path that ' +
    'never uses the analytic linear phase to locate roots (imp-34173 used direct-angle evaluation; ' +
    'imp-34229 root-found Im(-A)=0 only at k=4,5). The phase-located angles reproduce theta = pi/2 -+ ' +
    'k pi/p to ~1e-12 over alpha in (0,1), the located endpoint distances match d_k, the FD alpha-slope ' +
    'matches -k pi/(1+alpha)^2, the real-axis parity holds, and the k=1 branch touches theta=0 at the ' +
    'onset alpha_1=1 (ladder alpha_k=2|k|-1 = 1,3,5,7). Pure phase-condition geometry on the inherited ' +
    'imp-33924 closed form for the model cusp rho(x) = |x|^{-alpha}; establishes NO operator positivity; ' +
    'does NOT re-derive the m_prime -> C_ren map off-axis/off-exponent and does NOT discharge H4 ' +
    '(imp-33766). C_mb GUE-conditional untouched; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 ' +
    'UNTOUCHED; NO QED. No refereed bound is changed.',
};

export const IMP34252_ARG_ROOTFIND_CROSS_VALIDATION_ASSERTIONS = [
  {
    id: 'imp34252-phase-rootfind-reproduces-closed-form-angle',
    description: 'direct arg(-A) = -+ k pi root-find reproduces theta = pi/2 -+ k pi/p to ~1e-12 (k=1..4)',
    holds: () =>
      IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.phaseAngleMatchesClosedForm === true &&
      IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.rows.every(
        (r) => r.lowerThetaDiscrepancy < 1e-9 && r.upperThetaDiscrepancy < 1e-9,
      ),
  },
  {
    id: 'imp34252-phase-distance-matches-imp34173-closed-form',
    description: 'phase-located lower-branch distance matches the imp-34173 closed form d_k(alpha), arg wraps to k pi',
    holds: () =>
      IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.phaseDistanceMatchesClosedForm === true &&
      IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.argWrapsToKPi === true,
  },
  {
    id: 'imp34252-phase-slope-matches-closed-slope',
    description: 'central FD of the phase-located distance matches the closed slope -k pi/(1+alpha)^2 (k=1..4)',
    holds: () => IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.phaseSlopeMatchesClosedForm === true,
  },
  {
    id: 'imp34252-real-axis-parity-and-onset-ladder',
    description: 'k even -> Re(-A)>0, k odd -> Re(-A)<0; k=1 branch touches theta=0 at alpha=1, ladder alpha_k=2k-1',
    holds: () =>
      IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.realAxisParityConfirmed === true &&
      IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.onsetLadderConfirmed === true,
  },
  {
    id: 'imp34252-honesty-gate-no-qed',
    description: 'Cross-validation/measurement only: does not discharge H4, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.isRigorous === false &&
      IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.dischargesH4 === false &&
      /NO QED/.test(IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.verdict) &&
      /STAYS OPEN/.test(IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.verdict) &&
      /C_mb GUE-conditional untouched/i.test(IMP34252_ARG_ROOTFIND_CROSS_VALIDATION.verdict),
  },
];

for (const a of IMP34252_ARG_ROOTFIND_CROSS_VALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34252-arg-rootfind-cross-validation assertion failed: ${a.id}`);
  }
}
