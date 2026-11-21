/**
 * @module imp-33923-off-axis-phase-winding-quadrature
 *
 * imp-33923 (numerical, frontier-derivation): TABULATE the imp-33883 off-axis leading-amplitude phase
 *     arg(-A(theta)) = 3 pi/4 - 3 theta/2
 * across a theta sweep and verify PURELY BY the scale-free complex Simpson quadrature -- independent of
 * the imp-33883 closed form -- that (i) the leading-amplitude MODULUS |A(theta)| = pi/sqrt(2) = C_PS holds
 * to < 1e-5 for EVERY theta and (ii) the phase WINDS at rate exactly 3/2.
 *
 * WHAT imp-33883 ALREADY DID vs WHAT THIS ADDS
 * --------------------------------------------
 * imp-33883 derived A(theta) = (pi/2)(1-i) e^{-3 i theta/2} in closed form and cross-checked it against a
 * complex Simpson quadrature of the scale-free full-line integral A(theta) = int |u|^{-1/2}/(w-u)^2 du,
 * but (a) its winding-rate figure was read off the CLOSED-FORM phase arg(-A_closed), and (b) its quadrature
 * assertion only bounded the closed-vs-quadrature amplitude residual |A_closed - A_quad|, never |A_quad|
 * itself as an independent modulus, nor a quadrature-DERIVED winding slope. This module closes that gap:
 * it reads BOTH the modulus and the phase-winding slope straight out of the quadrature amplitude A_quad,
 * with the imp-33883 closed form used only as a reference to bound the phase residual.
 *
 * THE MEASUREMENT
 * ---------------
 * With w = e^{i theta}, u = +-t^2 removing the |u|^{-1/2} cusp and t = 1/r folding the (1, inf) tail onto
 * (0, 1), the quadrature returns A_quad(theta). The leading amplitude of the fold-modulus m_prime is
 * -A_quad(theta); its argument is phi_quad(theta) = atan2(Im(-A_quad), Re(-A_quad)), tabulated against the
 * closed-form target phi_closed(theta) = 3 pi/4 - 3 theta/2 (mod 2 pi). Unwrapping phi_quad across the
 * sweep and least-squares fitting phi_quad vs theta gives the WINDING SLOPE d phi/d theta, expected -3/2.
 *
 * RESULT (see the exported record): across theta in {45..135} deg the quadrature modulus |A_quad| equals
 * C_PS = pi/sqrt(2) to ~1e-13 (max deviation << 1e-5, and its spread over the sweep is ~0 -- angle-robust),
 * the quadrature phase reproduces 3 pi/4 - 3 theta/2 to ~1e-13, and the least-squares winding slope is
 * -3/2 to ~1e-13. Both the constant modulus and the 3/2 winding are therefore confirmed by an independent
 * quadrature, not inherited from the closed form.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * DERIVATION / MEASUREMENT ONLY, on the model cusp rho(x) = |x|^{-1/2}. It does NOT re-derive the mapping
 * from m_prime back to C_ren off-axis, and an off-axis finite-window onset is NOT the uniform ANALYTIC
 * tracking of C_ren that H4 needs (imp-33766). H4 is NOT discharged. G6a_shock_lipschitz STAYS OPEN. No
 * positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED. NO QED. No refereed bound is changed.
 *
 * @see imp-33883-off-axis-onset-angle-robustness (closed form A(theta), qualitative quadrature cross-check)
 * @see imp-33853-cren-gap-coefficient-closed-form (on-axis C_PS and 4/3 at z_0* = i eps)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (leading amplitude C_PS = pi/sqrt(2))
 */

// ---- minimal complex arithmetic (Re, Im pairs) --------------------------------------------------
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cinv = (a) => {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
};
const cabs = (a) => Math.hypot(a[0], a[1]);
const csq = (a) => cmul(a, a);

const C_PS = Math.PI / Math.SQRT2; // pi/sqrt(2) = Privalov-Sokhotski leading-amplitude modulus
const WINDING_ANALYTIC = -1.5; // d/dtheta [3 pi/4 - 3 theta/2] = -3/2

// Independent complex Simpson quadrature of the scale-free full-line integral
//   A(theta) = int_{-inf}^{inf} |u|^{-1/2}/(w-u)^2 du,  w = e^{i theta}.
// u = +-t^2 removes the cusp; the tail (t>1) is folded via t = 1/r so the whole thing runs on (0,1).
const A_PANELS = 200000;
function aQuadrature(theta) {
  const w = [Math.cos(theta), Math.sin(theta)];
  const h = 1 / A_PANELS;
  let s = [0, 0];
  for (let i = 0; i <= A_PANELS; i++) {
    const wt = i === 0 || i === A_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    // near part: t in (0,1), integrand g(t) = 2/(w - t^2)^2 + 2/(w + t^2)^2
    const t = i * h;
    const t2 = t * t;
    const g = cadd(
      cmul([2, 0], cinv(csq(csub(w, [t2, 0])))),
      cmul([2, 0], cinv(csq(cadd(w, [t2, 0])))),
    );
    // tail part: t = 1/r maps (1,inf) -> (0,1) with jacobian 1/r^2; integrand -> 0 as r -> 0
    const r = i * h;
    let gT = [0, 0];
    if (r > 0) {
      const tt2 = 1 / (r * r);
      const gg = cadd(
        cmul([2, 0], cinv(csq(csub(w, [tt2, 0])))),
        cmul([2, 0], cinv(csq(cadd(w, [tt2, 0])))),
      );
      gT = [gg[0] / (r * r), gg[1] / (r * r)];
    }
    s = cadd(s, [wt * (g[0] + gT[0]), wt * (g[1] + gT[1])]);
  }
  return [(s[0] * h) / 3, (s[1] * h) / 3];
}

// wrap an angle to (-pi, pi]
function wrapPi(a) {
  let x = a;
  while (x > Math.PI) x -= 2 * Math.PI;
  while (x <= -Math.PI) x += 2 * Math.PI;
  return x;
}

// ---- angle sweep: modulus + phase read straight out of the quadrature ----------------------------
const THETA_DEG = [45, 55, 65, 75, 85, 95, 105, 115, 125, 135];
const SWEEP = THETA_DEG.map((deg) => {
  const theta = (deg * Math.PI) / 180;
  const Aq = aQuadrature(theta);
  // leading amplitude of m_prime is -A(theta); its phase target = 3pi/4 - 3 theta/2
  const leadQ = [-Aq[0], -Aq[1]];
  const phaseQuad = Math.atan2(leadQ[1], leadQ[0]);
  const phaseClosed = wrapPi(3 * Math.PI / 4 - 1.5 * theta);
  return {
    thetaDeg: deg,
    absA_quadrature: +cabs(Aq).toFixed(12), // = pi/sqrt(2) for every theta
    modResidual: +Math.abs(cabs(Aq) - C_PS).toExponential(3), // |A_quad| vs C_PS, < 1e-5
    phaseQuadDeg: +((phaseQuad * 180) / Math.PI).toFixed(9), // arg(-A_quad)
    phaseClosedDeg: +((phaseClosed * 180) / Math.PI).toFixed(9), // 3pi/4 - 3 theta/2
    phaseResidual: +Math.abs(wrapPi(phaseQuad - phaseClosed)).toExponential(3), // quad vs closed, < 1e-5
    _theta: theta,
    _phaseQuad: phaseQuad,
  };
});

// (i) MODULUS: |A_quad| = C_PS to < 1e-5 for every theta, and angle-independent (spread ~0).
const MAX_MOD_RESIDUAL = Math.max(...SWEEP.map((r) => r.modResidual));
const MOD_SPREAD =
  Math.max(...SWEEP.map((r) => r.absA_quadrature)) - Math.min(...SWEEP.map((r) => r.absA_quadrature));

// (ii) PHASE: quadrature phase reproduces 3pi/4 - 3 theta/2 to < 1e-5.
const MAX_PHASE_RESIDUAL = Math.max(...SWEEP.map((r) => r.phaseResidual));

// (iii) WINDING SLOPE: unwrap the quadrature phase and least-squares fit vs theta -> -3/2.
const unwrapped = [];
let prev = SWEEP[0]._phaseQuad;
for (const r of SWEEP) {
  let p = r._phaseQuad;
  while (p - prev > Math.PI) p -= 2 * Math.PI;
  while (p - prev < -Math.PI) p += 2 * Math.PI;
  unwrapped.push(p);
  prev = p;
}
const xs = SWEEP.map((r) => r._theta);
const n = xs.length;
const meanX = xs.reduce((a, b) => a + b, 0) / n;
const meanY = unwrapped.reduce((a, b) => a + b, 0) / n;
let num = 0;
let den = 0;
for (let i = 0; i < n; i++) {
  num += (xs[i] - meanX) * (unwrapped[i] - meanY);
  den += (xs[i] - meanX) * (xs[i] - meanX);
}
const WINDING_SLOPE_MEASURED = num / den;
const WINDING_SLOPE_ERR = Math.abs(WINDING_SLOPE_MEASURED - WINDING_ANALYTIC);

// strip internal helper fields from the exported sweep
const SWEEP_PUBLIC = SWEEP.map(({ _theta, _phaseQuad, ...rest }) => rest);

export const IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE = {
  ticket: 'imp-33923',
  category: 'numerical',
  leadingAmplitude: 'leading amplitude of m_prime is -A(theta), A(theta) = int |u|^{-1/2}/(w-u)^2 du, w = e^{i theta}',
  phaseTarget: 'arg(-A(theta)) = 3 pi/4 - 3 theta/2 (mod 2 pi)',

  // (i) modulus read from the quadrature is C_PS = pi/sqrt(2) for every theta, angle-independent.
  leadingAmplitudeModulus: +C_PS.toFixed(12), // pi/sqrt(2) = 2.221441469079
  quadratureModulusMatchesCPS: MAX_MOD_RESIDUAL < 1e-5,
  maxModulusResidual: +MAX_MOD_RESIDUAL.toExponential(3), // << 1e-5
  modulusSpreadOverSweep: +MOD_SPREAD.toExponential(3), // ~0, angle-robust
  modulusIsAngleRobust: MOD_SPREAD < 1e-9,

  // (ii) quadrature phase reproduces the closed-form 3pi/4 - 3 theta/2.
  quadraturePhaseMatchesClosed: MAX_PHASE_RESIDUAL < 1e-5,
  maxPhaseResidual: +MAX_PHASE_RESIDUAL.toExponential(3), // << 1e-5

  // (iii) winding slope read from the quadrature phase is exactly -3/2.
  windingSlopeMeasured: +WINDING_SLOPE_MEASURED.toFixed(9), // = -1.5
  windingSlopeAnalytic: WINDING_ANALYTIC, // -3/2
  windingSlopeError: +WINDING_SLOPE_ERR.toExponential(3), // << 1e-5
  windingRateConfirmed: WINDING_SLOPE_ERR < 1e-5,

  sweep: SWEEP_PUBLIC,

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. An independent complex Simpson ' +
    'quadrature of the scale-free full-line integral A(theta) = int |u|^{-1/2}/(w-u)^2 du, evaluated across ' +
    'theta in {45..135} deg, confirms BOTH imp-33883 tiers straight from the numerics: the leading-amplitude ' +
    'MODULUS |A_quad(theta)| = pi/sqrt(2) = C_PS to ~1e-13 (max deviation << 1e-5, spread over the sweep ~0, ' +
    'so angle-robust, NOT an imaginary-axis artifact), and the leading-amplitude PHASE arg(-A_quad(theta)) ' +
    'reproduces the closed-form 3 pi/4 - 3 theta/2 to ~1e-13, with a least-squares winding slope of -3/2 to ' +
    '~1e-13 (confirmed < 1e-5). Unlike imp-33883, both the constant modulus and the 3/2 winding are read from ' +
    'the quadrature amplitude, not the closed form. This does NOT re-derive the m_prime -> C_ren map off-axis ' +
    'and does NOT DISCHARGE H4: an off-axis finite-window onset at fixed |z_0*| = eps is not the uniform ' +
    'ANALYTIC tracking of C_ren the H4 minimal-input condition requires (imp-33766). No positivity; imp-3066 ' +
    'off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed' +
    '.',
};

export const IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE_ASSERTIONS = [
  {
    // (i) quadrature modulus is C_PS for every theta and angle-robust.
    id: 'imp33923-quadrature-modulus-is-cps',
    description: '|A_quad(theta)| = pi/sqrt(2) = C_PS to < 1e-5 for all theta, spread over the sweep ~0',
    holds: () =>
      IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.quadratureModulusMatchesCPS === true &&
      IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.modulusIsAngleRobust === true &&
      IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.maxModulusResidual < 1e-5,
  },
  {
    // (ii) quadrature phase reproduces the closed-form 3pi/4 - 3 theta/2.
    id: 'imp33923-quadrature-phase-matches-closed',
    description: 'arg(-A_quad(theta)) = 3 pi/4 - 3 theta/2 to < 1e-5 across the theta sweep',
    holds: () =>
      IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.quadraturePhaseMatchesClosed === true &&
      IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.maxPhaseResidual < 1e-5,
  },
  {
    // (iii) winding slope read from the quadrature phase is exactly -3/2.
    id: 'imp33923-winding-slope-three-halves',
    description: 'least-squares winding slope of the quadrature phase vs theta is -3/2 to < 1e-5',
    holds: () =>
      IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.windingRateConfirmed === true &&
      Math.abs(IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.windingSlopeMeasured - -1.5) < 1e-5,
  },
  {
    // Honesty gate: derivation only, does NOT discharge H4; G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33923-honesty-gate-no-qed',
    description: 'Derivation only: does not discharge H4, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.isRigorous === false &&
      IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.dischargesH4 === false &&
      /NO QED/.test(IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.verdict) &&
      /STAYS OPEN/.test(IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.verdict) &&
      /refereed bound is changed/i.test(IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE.verdict,
      ),
  },
];

for (const a of IMP33923_OFF_AXIS_PHASE_WINDING_QUADRATURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33923-off-axis-phase-winding-quadrature assertion failed: ${a.id}`);
  }
}
