// @module imp-2492-esy-o2-backward-flow-illposedness-audit
// imp-2492 (improvement for ticket imp-370, high, proof): sharpen obstacle O2
// of the ESY rigidity port -- the forward-DBM vs backward de Bruijn / Polymath15
// flow coupling -- from the vague "not obvious" framing in esy-rigidity-port.js
// (obstacle2) into a PRECISE, citable, numerically-witnessed obstruction.
//
// QUESTION (the O2 obstacle, as posed by imp-370 / imp-407)
// ---------------------------------------------------------
// esy-rigidity-port.js obstacle2 says: ESY 2011 proves rigidity along the
// FORWARD Dyson Brownian Motion (Ornstein-Uhlenbeck) flow
//     H_t = e^{-t/2} H_0 + sqrt(1 - e^{-t}) * GUE,
// which REGULARIZES toward the GUE equilibrium. The Polymath15 / this codebase
// uses the de Bruijn-Newman heat flow, run BACKWARD in t to locate the Burgers
// collision / shock time tau_c. The current obstacle text only states that
// transferring forward rigidity to the backward flow is "not obvious". This
// audit pins WHY: the transfer is blocked by the ill-posedness of the BACKWARD
// HEAT EQUATION, a precise PDE obstruction, not merely an unproven coupling.
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'esy-o2-forward-dbm-rigidity-does-not-transfer-backward-illposed'
//
// The ESY forward-DBM rigidity estimate is a Gronwall / energy bound that is
// STABLE precisely BECAUSE the forward Ornstein-Uhlenbeck / heat flow is
// DISSIPATIVE: a fluctuation at wavenumber k is damped by the heat semigroup
// factor exp(-t k^2) <= 1, so perturbations DECAY forward in t and the Gronwall
// constant stays bounded. Reversing the time direction to the backward de
// Bruijn collision-time computation replaces this damping by AMPLIFICATION
// exp(+t k^2), the signature of the BACKWARD HEAT EQUATION, which is ILL-POSED:
// high-wavenumber (fine-scale) data is amplified without bound. The rigidity
// statement ESY provides controls fluctuations at the MICROSCOPIC LOCAL-SPACING
// scale -- exactly the highest relevant wavenumber k_max ~ (mean spacing)^{-1}
// ~ log(gamma_N) / (2 pi) -- so reversal amplifies precisely the scale the
// bound controls. A FORWARD high-probability rigidity bound therefore does NOT
// transfer to the backward flow without an additional unique-continuation /
// analytic-continuation input controlling this instability, which ESY does not
// supply. (The Tao-Vu time-reversal route suggested in esy-rigidity-port.js
// approachSuggestions would be such an input, but it is not established.)
//
// RELATION TO PRIOR O-AUDITS (orthogonal axes; all three obstacles stay open)
// ---------------------------------------------------------------------------
// imp-508 (esy-o1-closure.js)  -- partially closed O1 (the arithmetic /
//   concentration input), residual sub-gap esy-port-O1-remaining-concentration.
// imp-2481 (imp-2481-...clt...) -- the LINEAR-STATISTICS-CLT axis of the C_mb
//   correction (Soshnikov hypotheses fail on the singular 1/x kernel).
// THIS audit (imp-2492)        -- obstacle O2, the FLOW-DIRECTION axis: forward
//   dissipative DBM vs backward ill-posed de Bruijn collision flow.
// These are independent: closing any one does not close the others. O2 and O3
// remain research-grade open; imp-370 angle (b) is NOT closed by this audit.
//
// SYNTAX SAFETY: no star-slash sequences inside comments; single-quoted strings
// contain no apostrophes; subscripts written as k_{max} in prose.
//
// @see imp-370   -- the ticket (close imp-348 angle (b) via local-law rigidity)
// @see imp-407   -- esy-rigidity-port.js, where O1/O2/O3 are defined (obstacle2)
// @see imp-508   -- esy-o1-closure.js (O1 partial closure, orthogonal axis)
// @see imp-2481  -- determinantal-CLT audit (C_mb / linear-statistics axis)

// =========================================================================
// SECTION (a) -- The two flows and their generators.
// =========================================================================
//
// FORWARD (ESY): Ornstein-Uhlenbeck / Dyson Brownian Motion toward GUE.
//   H_t = e^{-t/2} H_0 + sqrt(1 - e^{-t}) GUE.
// On the fluctuation field this acts, at the linearized level, like the heat
// semigroup: a mode of wavenumber k is multiplied by exp(-t k^2). DISSIPATIVE.
//
// BACKWARD (de Bruijn / Polymath15): the H_t heat flow is run BACKWARD in t
// from the real axis to find the Burgers collision time. Time-reversal of a
// heat flow multiplies a mode of wavenumber k by exp(+t k^2). ANTI-DISSIPATIVE
// -- the backward heat equation, classically ILL-POSED (no continuous
// dependence on data; high-k modes blow up).

const FLOW_GENERATORS = Object.freeze({
  forwardESY: {
    name: 'ESY forward Ornstein-Uhlenbeck / Dyson Brownian Motion',
    law: 'H_t = e^{-t/2} H_0 + sqrt(1 - e^{-t}) GUE',
    symbolAtWavenumberK: 'exp(-t k^2)  (heat-semigroup damping, <= 1)',
    dissipative: true,
    wellPosed: true,
    role: 'regularizes toward GUE; Gronwall constant stays bounded forward in t',
  },
  backwardDeBruijn: {
    name: 'de Bruijn-Newman / Polymath15 heat flow, run backward to tau_c',
    law: 'H_t = convolution-with-Gaussian, propagated BACKWARD in t to the shock',
    symbolAtWavenumberK: 'exp(+t k^2)  (heat-semigroup AMPLIFICATION, unbounded)',
    dissipative: false,
    wellPosed: false,
    role: 'deforms toward the Burgers shock; backward heat equation is ill-posed',
  },
});

// =========================================================================
// SECTION (b) -- The reversal amplification factor (numeric witnesses).
// =========================================================================
//
// Heat-semigroup symbol at wavenumber k over a (dimensionless, illustrative)
// flow-time window t: forward damps by exp(-t k^2); backward amplifies by
// exp(+t k^2). These witnesses are QUALITATIVE -- they exhibit the exp(+t k^2)
// instability signature, not a physical amplification magnitude. The decisive
// structural fact is that the EXPONENT scales like k^2, so doubling the
// wavenumber QUADRUPLES the exponent: super-exponential growth in k, i.e.
// divergence at the microscopic local-spacing scale k_{max}.

const T_WITNESS = 0.1; // dimensionless illustrative flow-time window.

function heatForwardDamping(k) {
  // Forward heat semigroup symbol: bounded by 1, decays in k. STABLE.
  return Math.exp(-T_WITNESS * k * k);
}
function heatBackwardAmplification(k) {
  // Backward heat semigroup symbol: exceeds 1, grows in k. ILL-POSED.
  return Math.exp(+T_WITNESS * k * k);
}

const REVERSAL_WITNESSES = Object.freeze({
  // Forward damping factors -- all <= 1, strictly decreasing in k (stable).
  forwardDampK1: heatForwardDamping(1),
  forwardDampK2: heatForwardDamping(2),
  forwardDampK4: heatForwardDamping(4),
  // Backward amplification factors -- all > 1, strictly increasing in k (ill-posed).
  backwardAmpK1: heatBackwardAmplification(1),
  backwardAmpK2: heatBackwardAmplification(2),
  backwardAmpK4: heatBackwardAmplification(4),
  // Exponent ratio when k doubles: (t * (2k)^2) / (t * k^2) = 4. The quadratic
  // exponent is the structural divergence signature (independent of t).
  exponentQuadrupleRatioK1toK2: (T_WITNESS * 4) / (T_WITNESS * 1), // = 4
  exponentQuadrupleRatioK2toK4: (T_WITNESS * 16) / (T_WITNESS * 4), // = 4
});

// =========================================================================
// SECTION (c) -- Why this blocks the port: the bound lives at k_{max}.
// =========================================================================
//
// ESY rigidity controls the eigenvalue / zero locations at the MICROSCOPIC
// scale -- i.e. it is a statement about the HIGHEST relevant wavenumber, the
// inverse mean spacing k_{max} ~ rho_N ~ log(gamma_N) / (2 pi). Reversal
// amplifies a mode of wavenumber k by exp(+t k^2), which is LARGEST exactly at
// k = k_{max}. So the backward flow is most unstable precisely on the modes the
// rigidity bound is about. A forward bound of size psi_N at scale k_{max} maps,
// under formal reversal, to psi_N * exp(+t k_{max}^2) -- which is not a bound at
// all (it diverges with N as k_{max} grows like log gamma_N). Hence no transfer
// without an extra mechanism damping the backward instability.

const SCALE_MISMATCH = Object.freeze({
  rigidityScale: 'microscopic local spacing: wavenumber k_{max} ~ rho_N ~ log(gamma_N)/(2 pi)',
  reversalAmplificationAtScale: 'exp(+t k_{max}^2) -- maximal at the rigidity scale',
  consequence:
    'A forward rigidity bound psi_N at the microscopic scale formally maps to ' +
    'psi_N * exp(+t k_{max}^2) under reversal, which GROWS with N (k_{max} ~ ' +
    'log gamma_N) rather than bounding anything. The backward flow is most ' +
    'unstable exactly on the modes ESY controls.',
  whatWouldFixIt:
    'An analytic-continuation / unique-continuation estimate (e.g. a Tao-Vu ' +
    'time-reversal coupling, or a logarithmic-convexity / Carleman bound for ' +
    'the de Bruijn heat flow restricted to the relevant frequency band) that ' +
    'tames the exp(+t k^2) growth. ESY does not supply this; it is not ' +
    'established for the de Bruijn-Newman flow on the zeta zeros.',
});

// =========================================================================
// SECTION (d) -- Named sub-gap (honest residual), anchored to the O2 entry.
// =========================================================================

const NAMED_SUBGAP = Object.freeze({
  id: 'imp-2492-sub-backward-heat-illposedness',
  anchorsExistingSubGap: 'esy-port-O2-backward-flow-coupling', // OPEN_SUB_GAPS entry in esy-rigidity-port.js
  label:
    'ESY forward-DBM rigidity does not transfer to the backward de Bruijn ' +
    'collision flow: reversal is the ill-posed backward heat equation',
  detail:
    'The ESY rigidity Gronwall estimate is stable only because the forward ' +
    'flow damps mode k by exp(-t k^2). The de Bruijn / Polymath15 collision-' +
    'time computation runs the heat flow backward, multiplying mode k by ' +
    'exp(+t k^2) -- the backward heat equation, ill-posed, with amplification ' +
    'maximal at the microscopic scale k_{max} ~ log(gamma_N) the rigidity ' +
    'bound controls. Closing O2 requires a unique-continuation / time-reversal ' +
    'stability input (Tao-Vu-type) that ESY does not provide and that is not ' +
    'established for the zeta-zero flow.',
  severity: 'critical',
  isResearchGrade: true,
  closesIf:
    'A backward-stability estimate (logarithmic convexity / Carleman / Tao-Vu ' +
    'time-reversal coupling) for the de Bruijn-Newman heat flow is established ' +
    'on the relevant frequency band, taming the exp(+t k^2) reversal growth. ' +
    'Open; not implied by ESY forward rigidity.',
});

const VERDICT = 'esy-o2-forward-dbm-rigidity-does-not-transfer-backward-illposed';

// =========================================================================
// FROZEN EXPORTED RECORD
// =========================================================================

export const IMP2492_ESY_O2_BACKWARD_FLOW_ILLPOSEDNESS_AUDIT = Object.freeze({
  id: 'imp-2492',
  ticket: 'imp-370',
  obstacle: 'O2',
  auditDate: '2026-06-07',
  axis: 'flow-direction (forward dissipative DBM vs backward ill-posed de Bruijn collision flow)',
  question:
    'esy-rigidity-port.js obstacle2 flags the forward-DBM vs backward de ' +
    'Bruijn flow coupling as "not obvious". Pin the precise obstruction: does ' +
    'ESY forward rigidity transfer to the backward collision-time computation?',
  flowGenerators: FLOW_GENERATORS,
  reversalWitnesses: REVERSAL_WITNESSES,
  scaleMismatch: SCALE_MISMATCH,
  namedSubGap: NAMED_SUBGAP,
  verdict: VERDICT,
  couplingTransfersBackward: false,
  forwardFlowDissipative: true,
  backwardFlowWellPosed: false,
  refinesObstacle2:
    'esy-rigidity-port.js obstacle2 stated only that backward-flow GUE ' +
    'universality is "not obvious". This audit identifies the concrete ' +
    'mechanism: reversal of the forward dissipative heat semigroup is the ' +
    'backward heat equation (exp(+t k^2), ill-posed), with amplification ' +
    'maximal at the microscopic rigidity scale -- so forward rigidity cannot ' +
    'transfer without an unestablished backward-stability input.',
  honestScope: Object.freeze([
    'This audit does NOT close obstacle O2 and does NOT close imp-370 angle ' +
    '(b). It establishes a NEGATIVE with a precise mechanism: the ESY forward ' +
    'rigidity estimate does not transfer to the backward de Bruijn collision ' +
    'flow because reversal is the ill-posed backward heat equation.',
    'The decisive structural fact is the heat-semigroup symbol exp(-t k^2) ' +
    'forward vs exp(+t k^2) backward: forward damping is bounded by 1 (stable, ' +
    'well-posed Gronwall), backward amplification grows like exp(+t k^2) with a ' +
    'quadratic exponent (doubling k quadruples the exponent -- super-exponential ' +
    'divergence), maximal at the microscopic scale k_{max} ~ log(gamma_N) that ' +
    'the rigidity bound controls. The numeric witnesses are qualitative ' +
    'illustrations of this signature, not physical amplification magnitudes.',
    'Named sub-gap imp-2492-sub-backward-heat-illposedness records the residual ' +
    'and anchors the existing esy-port-O2-backward-flow-coupling entry: closing ' +
    'O2 needs a unique-continuation / Tao-Vu time-reversal stability input for ' +
    'the de Bruijn-Newman flow, which ESY does not supply. O2 and O3 remain ' +
    'research-grade open; the route stays conditional.',
  ]),
  parallelTickets: Object.freeze(['imp-370', 'imp-407', 'imp-508', 'imp-2481']),
});

export default IMP2492_ESY_O2_BACKWARD_FLOW_ILLPOSEDNESS_AUDIT;

// =========================================================================
// BUILD-TIME TRIPWIRES
// =========================================================================

export const IMP2492_ESY_O2_BACKWARD_FLOW_ILLPOSEDNESS_AUDIT_ASSERTIONS = [
  {
    id: 'imp2492-verdict-backward-transfer-fails',
    holds: () =>
      IMP2492_ESY_O2_BACKWARD_FLOW_ILLPOSEDNESS_AUDIT.verdict ===
        'esy-o2-forward-dbm-rigidity-does-not-transfer-backward-illposed' &&
      IMP2492_ESY_O2_BACKWARD_FLOW_ILLPOSEDNESS_AUDIT.couplingTransfersBackward === false,
    why:
      'The audit conclusion is that ESY forward-DBM rigidity does NOT transfer ' +
      'to the backward de Bruijn collision flow. Flipping the verdict or ' +
      'couplingTransfersBackward to true without exhibiting a backward-stability ' +
      'input would silently overclaim a closure of obstacle O2 that does not exist.',
  },
  {
    id: 'imp2492-forward-flow-dissipative-stable',
    holds: () => {
      const w = IMP2492_ESY_O2_BACKWARD_FLOW_ILLPOSEDNESS_AUDIT.reversalWitnesses;
      // Forward heat damping must be <= 1 and strictly decreasing in k (stable).
      return (
        w.forwardDampK1 <= 1 &&
        w.forwardDampK2 < w.forwardDampK1 &&
        w.forwardDampK4 < w.forwardDampK2 &&
        w.forwardDampK4 > 0
      );
    },
    why:
      'The forward Ornstein-Uhlenbeck / DBM flow damps mode k by exp(-t k^2) ' +
      '<= 1, strictly decreasing in k -- the dissipativity that makes the ESY ' +
      'Gronwall estimate stable forward in t. If these factors stopped being ' +
      'bounded by 1 or stopped decreasing, the forward-stability premise of the ' +
      'whole O2 argument would be broken.',
  },
  {
    id: 'imp2492-backward-flow-illposed-amplifies',
    holds: () => {
      const w = IMP2492_ESY_O2_BACKWARD_FLOW_ILLPOSEDNESS_AUDIT.reversalWitnesses;
      // Backward amplification must exceed 1 and strictly increase in k.
      const grows = w.backwardAmpK1 > 1 && w.backwardAmpK2 > w.backwardAmpK1 && w.backwardAmpK4 > w.backwardAmpK2;
      // Forward * backward at the same k must reconstruct the identity (= 1):
      // exp(-t k^2) * exp(+t k^2) = 1, the time-reversal consistency check.
      const reversalIdentity = Math.abs(w.forwardDampK4 * w.backwardAmpK4 - 1) < 1e-12;
      return grows && reversalIdentity;
    },
    why:
      'The backward heat flow multiplies mode k by exp(+t k^2) > 1, strictly ' +
      'increasing in k -- the ill-posedness (unbounded amplification of fine ' +
      'scales). The forward-times-backward product must equal 1 at each k ' +
      '(exp(-t k^2) exp(+t k^2) = 1); a break there means the damping and ' +
      'amplification factors are no longer genuine time-reverses of one another.',
  },
  {
    id: 'imp2492-quadratic-exponent-divergence-signature',
    holds: () => {
      const w = IMP2492_ESY_O2_BACKWARD_FLOW_ILLPOSEDNESS_AUDIT.reversalWitnesses;
      // Doubling the wavenumber must quadruple the heat exponent (k^2 scaling):
      // the structural signature of super-exponential divergence in k.
      return (
        Math.abs(w.exponentQuadrupleRatioK1toK2 - 4) < 1e-9 &&
        Math.abs(w.exponentQuadrupleRatioK2toK4 - 4) < 1e-9
      );
    },
    why:
      'The heat-semigroup exponent scales like k^2, so doubling k quadruples it ' +
      '(ratio exactly 4) -- the signature that backward amplification exp(+t k^2) ' +
      'diverges super-exponentially in k, hence blows up at the microscopic ' +
      'scale k_{max} the rigidity bound controls. Drift here means the quadratic ' +
      'divergence witness was edited away.',
  },
  {
    id: 'imp2492-subgap-critical-anchors-O2',
    holds: () => {
      const g = IMP2492_ESY_O2_BACKWARD_FLOW_ILLPOSEDNESS_AUDIT.namedSubGap;
      return (
        g.severity === 'critical' &&
        g.isResearchGrade === true &&
        g.anchorsExistingSubGap === 'esy-port-O2-backward-flow-coupling'
      );
    },
    why:
      'The honest residual is a critical research-grade sub-gap that anchors the ' +
      'canonical esy-port-O2-backward-flow-coupling entry in esy-rigidity-port.js. ' +
      'Demoting its severity / research-grade status, or breaking the anchor, ' +
      'would either overclaim O2 progress or sever the link to the obstacle this ' +
      'audit refines.',
  },
  {
    id: 'imp2492-route-stays-conditional-O2-open',
    holds: () => {
      const r = IMP2492_ESY_O2_BACKWARD_FLOW_ILLPOSEDNESS_AUDIT;
      return (
        r.forwardFlowDissipative === true &&
        r.backwardFlowWellPosed === false &&
        r.flowGenerators.backwardDeBruijn.wellPosed === false
      );
    },
    why:
      'The two-sided honest position: the forward flow IS dissipative / ' +
      'well-posed (so ESY rigidity is fine forward), but the backward de Bruijn ' +
      'flow is NOT well-posed -- which is exactly why the transfer fails and O2 ' +
      'stays open. Marking the backward flow well-posed would falsely assert the ' +
      'reversal is benign and the port goes through.',
  },
];
