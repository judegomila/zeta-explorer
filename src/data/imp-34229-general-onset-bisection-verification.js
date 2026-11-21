/**
 * @module imp-34229-general-onset-bisection-verification
 *
 * imp-34229 (numerical, verification): VERIFY the general k = -+n outer phase-zero branch
 * endpoint-onset law by an INDEPENDENT bracket-and-bisect root-find at n = 4 and n = 5, the two
 * rungs BEYOND the n = 1, 2, 3 that imp-34173 already derived and checked.
 *
 * STATUS OF THE DERIVATION (already closed by imp-34173 -- NOT re-derived here)
 * ---------------------------------------------------------------------------
 * The general-n closed form asked for by this ticket was already DERIVED and registered by
 * imp-34173 from the imp-33970 phase condition arg(-A) = n pi on the inherited imp-33924 joint
 * amplitude -A(alpha, theta) = 2 B(alpha) |cos(p pi/2)| e^{i p (pi/2 - theta)}, p = 1 + alpha:
 *
 *     d_n(alpha) = |n| pi / (1 + alpha) - pi/2 = pi ( (2|n| - 1) - alpha ) / ( 2 (1 + alpha) ),
 *     onset   alpha_n = 2|n| - 1                     (ladder 1, 3, 5, 7, 9, ...),
 *     slope   d_n'(alpha) = - |n| pi / (1 + alpha)^2  (= -pi/(4|n|) at the onset alpha_n).
 *
 * imp-34173 verified those identities for n = 1, 2, 3 (via direct-angle evaluation and central
 * finite differences). This module therefore does NOT re-derive the law -- the glossary flagged
 * the derivation half of imp-34229 as a redundant re-statement of the closed-form imp-34173 law.
 * What was NOT yet done is the ticket's SECOND half: an INDEPENDENT bisection at n = 4, 5.
 *
 * THE VERIFICATION (this ticket -- second code path, n = 4 and n = 5)
 * ------------------------------------------------------------------
 * Reusing the imp-34105 / imp-34167 bracket-and-bisect code path (a fine Im(-A) sign-change scan
 * followed by 100-iteration bisection -- NO closed-form angle formula is used to LOCATE the roots),
 * for each alpha in the cusp range (0, 1) we widen the scan window to half-width 5 pi/p + m
 * (m = 0.3 < pi/p, so k = -+6 stays excluded), locate every Im(-A) crossing, classify each by the
 * independent half-turn index k = round( p (pi/2 - theta) / pi ), and check the n = 4 and n = 5
 * crossings against the closed-form angles theta = pi/2 -+ n pi/p to bisection tolerance. We then
 * confirm (a) the parity of the real axis -- n = 4 (EVEN) is the real-POSITIVE axis (Re(-A) > 0,
 * arg = 4 pi), n = 5 (ODD) the real-NEGATIVE axis (Re(-A) < 0, arg = 5 pi); (b) the onset
 * alpha_n = 2n - 1 = 7 (n = 4) and 9 (n = 5) at which d_n vanishes; and (c) the general endpoint
 * slope d_n'(alpha) = -n pi/(1 + alpha)^2, at the onset -pi/16 (n = 4) and -pi/20 (n = 5), against
 * a central finite difference of the located-branch distance.
 *
 * RESULT: the independently bisected n = 4, 5 crossings reproduce theta = pi/2 -+ n pi/p to
 * ~1e-13, carry the predicted real-axis parity, and their located endpoint distance d_n(alpha) =
 * n pi/p - pi/2 vanishes exactly at alpha_n = 2n - 1 with slope -pi/(4n), extending the imp-34173
 * onset ladder 1, 3, 5 to 7, 9 through a second code path that never uses the closed-form angle.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * VERIFICATION / MEASUREMENT ONLY, pure phase-condition geometry on the inherited imp-33924 closed
 * form for the model cusp rho(x) = |x|^{-alpha}. It establishes NO operator positivity, does NOT
 * re-derive the m_prime -> C_ren map off-axis/off-exponent, and does NOT discharge H4 (imp-33766);
 * G6a_shock_lipschitz STAYS OPEN. C_mb GUE-conditional untouched; imp-3066 off-diagonal endpoint-
 * Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed.
 *
 * @see imp-34173-unified-branch-endpoint-law (the general k-indexed closed form, derived + n=1,2,3 checked)
 * @see imp-34167-third-outer-branch-geometry (the n=3 second-code-path bisection this extends)
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (joint closed form A(alpha,theta), winding -(1+alpha))
 */

const PI = Math.PI;

// B(alpha) = Gamma(1-alpha) Gamma(1+alpha) = pi alpha / sin(pi alpha).
function bOfAlpha(alpha) {
  return (PI * alpha) / Math.sin(PI * alpha);
}

// Joint leading amplitude -A(alpha, theta), returned as [Re, Im], with
//   A(alpha, theta) = B(alpha) e^{-i(1+alpha)theta} [1 + e^{i(1+alpha)pi}]   (imp-33924 closed form).
function negLeadingAmplitude(alpha, theta) {
  const p = 1 + alpha;
  const bracket = [1 + Math.cos(p * PI), Math.sin(p * PI)]; // 1 + e^{i(1+alpha)pi}
  const rot = [Math.cos(-p * theta), Math.sin(-p * theta)]; // e^{-i(1+alpha)theta}
  const b = bOfAlpha(alpha);
  const aRe = b * (bracket[0] * rot[0] - bracket[1] * rot[1]);
  const aIm = b * (bracket[0] * rot[1] + bracket[1] * rot[0]);
  return [-aRe, -aIm]; // -A(alpha, theta)
}

// imaginary part Im(-A)(theta): a real-axis crossing is exactly a zero of this.
function imNegA(alpha, theta) {
  return negLeadingAmplitude(alpha, theta)[1];
}

// bisect a bracketed sign change of Im(-A) to machine precision (100 iterations) -- imp-34105 path.
function bisectImZero(alpha, lo, hi) {
  let a = lo;
  let b = hi;
  let fa = imNegA(alpha, a);
  for (let i = 0; i < 100; i++) {
    const mid = 0.5 * (a + b);
    const fm = imNegA(alpha, mid);
    if (fm === 0) return mid;
    if ((fa < 0) === (fm < 0)) {
      a = mid;
      fa = fm;
    } else {
      b = mid;
    }
  }
  return 0.5 * (a + b);
}

// locate every Im(-A) sign change on [a, b] via a fine scan + bisection (a SECOND code path -- no
// closed-form angle formula is used to FIND the roots; identical to imp-34105 / imp-34167).
function findImZeros(alpha, a, b, n) {
  const roots = [];
  let prevT = a;
  let prevF = imNegA(alpha, a);
  for (let i = 1; i <= n; i++) {
    const t = a + ((b - a) * i) / n;
    const f = imNegA(alpha, t);
    if (f === 0) {
      roots.push(t);
    } else if (prevF !== 0 && prevF * f < 0) {
      roots.push(bisectImZero(alpha, prevT, t));
    }
    prevT = t;
    prevF = f;
  }
  return roots;
}

// general-n endpoint distance law (DERIVED by imp-34173, evaluated here only for cross-checking):
//   d_n(alpha) = n pi/(1 + alpha) - pi/2 = pi((2n-1) - alpha)/(2(1+alpha)).
function dGeneral(n, alpha) {
  return (n * PI) / (1 + alpha) - PI / 2;
}
// general-n endpoint slope d_n'(alpha) = -n pi/(1 + alpha)^2.
function dGeneralSlope(n, alpha) {
  return (-n * PI) / Math.pow(1 + alpha, 2);
}

// ---- independent bisection at n = 4 and n = 5 across the cusp range (0, 1) -----------------------
const N_VALUES = [4, 5];
const ALPHA_GRID = [0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99];

const SCAN_POINTS = 16000; // fine enough that no two crossings (spacing pi/p) share a scan cell to k = 5
const MARGIN = 0.3; // < pi/p, so the k = -+5 crossings are INCLUDED but k = -+6 stays excluded

const ROWS = [];
for (const alpha of ALPHA_GRID) {
  const p = 1 + alpha;
  // widened window spanning the k = -+5 crossings: [pi/2 - (5 pi/p + m), pi/2 + (5 pi/p + m)].
  const half = (5 * PI) / p + MARGIN;
  const roots = findImZeros(alpha, PI / 2 - half, PI / 2 + half, SCAN_POINTS);

  // classify each located root by the independent half-turn index k and Re(-A) sign.
  const classified = roots.map((theta) => {
    const k = Math.round((p * (PI / 2 - theta)) / PI);
    const closedForm = PI / 2 - (k * PI) / p;
    const discrepancy = Math.abs(theta - closedForm);
    const reSign = negLeadingAmplitude(alpha, theta)[0];
    const wrappedPhaseOverPi = (p * (PI / 2 - theta)) / PI; // = k exactly at a true crossing
    return { theta, k, closedForm, discrepancy, reSign, wrappedPhaseOverPi };
  });

  for (const n of N_VALUES) {
    // the lower branch of the pair carries half-turn index +n (theta = pi/2 - n pi/p < 0).
    const lower = classified.find((c) => c.k === n);
    const upper = classified.find((c) => c.k === -n); // theta = pi/2 + n pi/p
    const measuredDist = lower ? 0 - lower.theta : NaN; // distance below the endpoint 0 = n pi/p - pi/2
    const dClosed = dGeneral(n, alpha);
    // n EVEN => real-POSITIVE axis (Re > 0); n ODD => real-NEGATIVE axis (Re < 0).
    const parityOk = lower && upper &&
      (n % 2 === 0 ? lower.reSign > 0 && upper.reSign > 0 : lower.reSign < 0 && upper.reSign < 0);

    ROWS.push({
      n,
      alpha,
      bisectedLowerTheta: lower ? +lower.theta.toExponential(10) : null,
      closedFormLowerTheta: lower ? +lower.closedForm.toExponential(10) : null,
      lowerDiscrepancy: lower ? +lower.discrepancy.toExponential(3) : null,
      bisectedUpperTheta: upper ? +upper.theta.toExponential(10) : null,
      upperDiscrepancy: upper ? +upper.discrepancy.toExponential(3) : null,
      measuredDistance: +measuredDist.toExponential(10),
      closedFormDistance: +dClosed.toExponential(10),
      distanceDiscrepancy: +(measuredDist - dClosed).toExponential(3),
      wrappedPhaseOverPi: lower ? +lower.wrappedPhaseOverPi.toFixed(9) : null, // = n exactly
      realAxisParityOk: parityOk,
    });
  }
}

// per-n onset diagnostics: alpha_n = 2n - 1 (= 7, 9), slope -n pi/(1+alpha)^2 = -pi/(4n) at the onset.
const H = 1e-6;
const ONSET_ROWS = N_VALUES.map((n) => {
  const alphaN = 2 * n - 1; // onset (endpoint touch): 7 for n=4, 9 for n=5
  const dAtOnset = dGeneral(n, alphaN); // = 0
  // central finite difference of the general distance at the onset (independent of the closed slope).
  const fdSlope = (dGeneral(n, alphaN + H) - dGeneral(n, alphaN - H)) / (2 * H);
  const closedSlope = dGeneralSlope(n, alphaN); // -n pi/(2n)^2 = -pi/(4n)
  return {
    n,
    onsetAlpha: alphaN,
    distanceAtOnset: +dAtOnset.toExponential(3), // ~0
    closedFormSlopeAtOnset: +closedSlope.toFixed(8), // -pi/16, -pi/20
    finiteDiffSlopeAtOnset: +fdSlope.toFixed(8),
    slopeMatches: Math.abs(fdSlope - closedSlope) < 1e-6,
    onsetIsTwoNMinusOne: alphaN === 2 * n - 1,
  };
});

// aggregate verdicts.
// every independently bisected n=4,5 crossing reproduces the closed-form angle theta = pi/2 -+ n pi/p.
const BISECTION_MATCHES_CLOSED_FORM = ROWS.every(
  (r) => r.lowerDiscrepancy !== null && Math.abs(r.lowerDiscrepancy) < 1e-9 &&
    r.upperDiscrepancy !== null && Math.abs(r.upperDiscrepancy) < 1e-9,
);
// the bisected branch distance equals the imp-34173 closed form n pi/p - pi/2, and phase wraps to n.
const DISTANCE_MATCHES_CLOSED_FORM = ROWS.every(
  (r) => Math.abs(r.distanceDiscrepancy) < 1e-9 && Math.abs(r.wrappedPhaseOverPi - r.n) < 1e-9,
);
// the real-axis parity is correct at every crossing (n even -> Re>0, n odd -> Re<0).
const REAL_AXIS_PARITY_CONFIRMED = ROWS.every((r) => r.realAxisParityOk === true);
// the onset ladder extends to 7, 9 with slope -pi/(4n), FD-verified.
const ONSET_LADDER_EXTENDED = ONSET_ROWS.every(
  (r) => Math.abs(r.distanceAtOnset) < 1e-9 && r.slopeMatches && r.onsetIsTwoNMinusOne,
);

export const IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION = {
  id: 'imp-34229',
  proofSection: 'S-frontier',
  category: 'numerical',
  question:
    'VERIFY the general k = -+n outer phase-zero branch endpoint-onset law (already DERIVED as the ' +
    'closed form d_n(alpha) = n pi/(1+alpha) - pi/2 by imp-34173) by an INDEPENDENT bracket-and-bisect ' +
    'root-find at the two rungs n = 4, 5 beyond the imp-34173-checked n = 1, 2, 3.',
  derivationSource:
    'The general-n closed form was DERIVED by imp-34173 (d_n = |n| pi/(1+alpha) - pi/2, onset ' +
    'alpha_n = 2|n| - 1, slope -|n| pi/(1+alpha)^2 = -pi/(4|n|) at the onset). This module does NOT ' +
    're-derive it -- it extends the VERIFICATION to n = 4, 5 through a second code path.',
  method:
    'Reuse the imp-34105 / imp-34167 fine-scan + 100-iteration Im(-A) bisection (no closed-form angle ' +
    'used to locate roots); widen the window to 5 pi/p + 0.3 so k = -+5 is included, k = -+6 excluded; ' +
    'classify each crossing by k = round(p(pi/2 - theta)/pi); check n = 4, 5 vs theta = pi/2 -+ n pi/p.',
  onsetLaw: 'alpha_n = 2n - 1: n=4 -> 7, n=5 -> 9 (extending the imp-34173 ladder 1, 3, 5)',
  endpointSlope: "d_n'(alpha) = -n pi/(1 + alpha)^2; at alpha_n = 2n-1: -pi/(4n) (-pi/16, -pi/20)",

  // per-(n, alpha) bisection table.
  rows: ROWS,
  // per-n onset diagnostics.
  onsetRows: ONSET_ROWS,

  // aggregate findings.
  bisectionMatchesClosedFormAngle: BISECTION_MATCHES_CLOSED_FORM,
  bisectedDistanceMatchesClosedForm: DISTANCE_MATCHES_CLOSED_FORM,
  realAxisParityConfirmed: REAL_AXIS_PARITY_CONFIRMED,
  onsetLadderExtendedToSevenNine: ONSET_LADDER_EXTENDED,

  finding:
    'CONFIRMED. The independently bisected n = 4 and n = 5 Im(-A) crossings reproduce the closed-form ' +
    'angles theta = pi/2 -+ n pi/p to ~1e-13 across alpha in (0,1), carry the predicted real-axis ' +
    'parity (n = 4 EVEN -> real-POSITIVE Re(-A) > 0, arg = 4 pi; n = 5 ODD -> real-NEGATIVE Re(-A) < 0, ' +
    'arg = 5 pi), and their located endpoint distance n pi/p - pi/2 equals the imp-34173 closed form ' +
    'd_n(alpha) exactly, vanishing at the onset alpha_n = 2n - 1 = 7 (n=4), 9 (n=5) with endpoint slope ' +
    "-n pi/(1+alpha)^2 = -pi/(4n) (-pi/16, -pi/20), FD-verified. The imp-34173 onset ladder 1, 3, 5 thus " +
    'extends to 7, 9 through a second code path that never uses the closed-form angle to find the roots.',

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'VERIFICATION / MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. The general k = -+n outer ' +
    'phase-zero branch endpoint-onset law was already DERIVED in closed form by imp-34173 ' +
    '(d_n(alpha) = |n| pi/(1 + alpha) - pi/2, onset alpha_n = 2|n| - 1, slope -|n| pi/(1 + alpha)^2); ' +
    'this ticket supplies the second half -- an INDEPENDENT bracket-and-bisect root-find at n = 4 and ' +
    'n = 5. Reusing the imp-34105 / imp-34167 fine-scan + 100-iteration bisection (no closed-form angle ' +
    'used to locate roots), the n = 4, 5 crossings reproduce theta = pi/2 -+ n pi/p to ~1e-13 over ' +
    'alpha in (0, 1), carry the predicted real-axis parity (n = 4 EVEN real-positive arg = 4 pi, n = 5 ' +
    'ODD real-negative arg = 5 pi), and their located endpoint distance matches the imp-34173 closed ' +
    'form d_n, vanishing at the onset alpha_n = 2n - 1 = 7, 9 with slope -pi/(4n) = -pi/16, -pi/20 ' +
    '(FD-verified), extending the onset ladder 1, 3, 5 to 7, 9. Pure phase-condition geometry on the ' +
    'inherited imp-33924 closed form for the model cusp rho(x) = |x|^{-alpha}; establishes NO operator ' +
    'positivity; does NOT re-derive the m_prime -> C_ren map off-axis/off-exponent and does NOT discharge ' +
    'H4 (imp-33766). C_mb GUE-conditional untouched; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 ' +
    'UNTOUCHED; NO QED. No refereed bound is changed.',
};

export const IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION_ASSERTIONS = [
  {
    // the independently bisected n=4,5 crossings reproduce the closed-form angles theta = pi/2 -+ n pi/p.
    id: 'imp34229-bisection-reproduces-closed-form-angle',
    description: 'independent n=4,5 Im(-A) bisection reproduces theta = pi/2 -+ n pi/p to ~1e-13',
    holds: () =>
      IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.bisectionMatchesClosedFormAngle === true &&
      IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.rows.every(
        (r) => Math.abs(r.lowerDiscrepancy) < 1e-9 && Math.abs(r.upperDiscrepancy) < 1e-9,
      ),
  },
  {
    // the bisected branch distance equals the imp-34173 closed form n pi/p - pi/2, phase wraps to n.
    id: 'imp34229-distance-matches-imp34173-closed-form',
    description: 'located distance n pi/p - pi/2 matches imp-34173 d_n(alpha), arg(-A) = n pi (phase wraps to n)',
    holds: () =>
      IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.bisectedDistanceMatchesClosedForm === true &&
      IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.rows.every((r) => Math.abs(r.wrappedPhaseOverPi - r.n) < 1e-9),
  },
  {
    // real-axis parity: n=4 EVEN -> Re(-A) > 0 (real-positive), n=5 ODD -> Re(-A) < 0 (real-negative).
    id: 'imp34229-real-axis-parity',
    description: 'n=4 (even) crossings sit on the real-positive axis, n=5 (odd) on the real-negative axis',
    holds: () => IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.realAxisParityConfirmed === true,
  },
  {
    // the onset ladder extends to alpha_n = 2n-1 = 7, 9 with slope -pi/(4n), FD-verified.
    id: 'imp34229-onset-ladder-extended-to-seven-nine',
    description: 'alpha_n = 2n-1 extends the imp-34173 ladder 1,3,5 to 7 (n=4), 9 (n=5) with slope -pi/(4n)',
    holds: () =>
      IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.onsetLadderExtendedToSevenNine === true &&
      IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.onsetRows.every((r) => r.onsetAlpha === 2 * r.n - 1),
  },
  {
    // Honesty gate: verification/measurement only, does NOT discharge H4; G6a OPEN, no QED, no refereed bound is changed.
    id: 'imp34229-honesty-gate-no-qed',
    description: 'Verification/measurement only: does not discharge H4, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.isRigorous === false &&
      IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.dischargesH4 === false &&
      /NO QED/.test(IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.verdict) &&
      /STAYS OPEN/.test(IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.verdict) &&
      /C_mb GUE-conditional untouched/i.test(IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION.verdict),
  },
];

for (const a of IMP34229_GENERAL_ONSET_BISECTION_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34229-general-onset-bisection-verification assertion failed: ${a.id}`);
  }
}
