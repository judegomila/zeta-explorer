/**
 * @module imp-33208-watson-majorant-numerical-verification
 * @fileoverview imp-33208 -- NUMERICALLY VERIFY the imp-3892 pinned Watson majorant
 *       |rho(tau)| &lt;= K0 e^{-4 tau},   K0 = 3.46,   K_lead = 2 phi-prime(0)/Phi(0),
 *   by measuring the REALISED bracket remainder ratio rho(tau) e^{4 tau} across a tau grid on
 *   [1.5, 6] against the imp-3850/imp-3873 reconciled -ln A(tau) ladder. imp-3892 derived the
 *   closed leading coefficient K_lead = -3.4120570431 and the two-term model
 *       rho(tau) e^{4 tau} = K_lead + K6 e^{-2 tau} + O(e^{-4 tau}),   K6 = +2.1066020628,
 *   and pinned the envelope K0 = 3.46, but that pin was CHECKED only against the three imp-3866
 *   window points {2.5, 3, 3.5}. This module extends the direct measurement to the full grid
 *   tau in {1.5, 2, 2.5, 3, 3.5, 4, 5, 6}.
 *
 *   WHAT IS MEASURED (self-computing at import, same graded-GL ladder as imp-3866/imp-3850)
 *   -------------------------------------------------------------------------------------
 *   With T = pi e^{4 tau}, the n=1 shifted-kernel tail gives
 *       A_n1(tau) = e^{-T} (Phi(0)/4) bracket(tau),
 *       bracket(tau) = exp( ln A_n1 + T - ln(Phi(0)/4) ) = 2 pi - 3 e^{-2 tau} + rho(tau),
 *   so rho(tau) = bracket(tau) - (2 pi - 3 e^{-2 tau}) and the tested quantity is
 *       rhoRatio(tau) = rho(tau) / e^{-4 tau}   (should sit at K_lead + K6 e^{-2 tau}, magnitude &lt; K0).
 *   -ln A_n1 is evaluated by the imp-3709/imp-3730 peak-adapted graded Gauss-Legendre log-integral
 *   (HI=14, PANELS=1600, GRADE=6) -- the same converged path imp-3850 reconciled against uniform
 *   log-Simpson to ~1e-11 relative on tau in [1.5, 3.0].
 *
 *   RESULT: A TWO-REGIME VERIFICATION
 *   --------------------------------
 *   (A) RELIABILITY WINDOW tau in {1.5, 2, 2.5, 3, 3.5}.  Here the direct reconstruction sits far
 *       ABOVE its own additive cancellation floor (see below), and the measured rhoRatio is a
 *       genuine signal. It CLIMBS toward the pinned limit K_lead, monotonically up to the per-tau
 *       floor:
 *           tau=1.5: -3.305370   tau=2.0: -3.373218   tau=2.5: -3.397827
 *           tau=3.0: -3.406866   tau=3.5: -3.406028
 *       (the tau=3.5 rung dips by ~8e-4 vs tau=3.0 -- below its own ~6e-3 cancellation floor, i.e.
 *       the floor onset, not a genuine reversal).
 *       Every point stays STRICTLY below the majorant K0 = 3.46 in magnitude, passes through the
 *       imp-3866 measured -3.406 near tau=3, and reproduces the closed two-term model
 *       K_lead + K6 e^{-2 tau} to within the per-tau floor at every rung. This is a direct
 *       numerical CONFIRMATION of the imp-3892 pin on the reachable window.
 *
 *   (B) FLOOR-SWAMPED WINDOW tau in {4, 5, 6}.  bracket = exp(ln A_n1 + T - ...) reconstructs an
 *       O(1) quantity from ln A_n1 ~ -T, whose float representation carries an absolute resolution
 *       ~ T * 2^{-52}. The resulting noise on rhoRatio is ~ 2 pi * T * eps / e^{-4 tau} =
 *       2 pi^2 e^{8 tau} eps, which crosses the ~3.41 signal between tau=4 (floor ~0.35, measured
 *       rhoRatio -3.531, off by ~0.12, i.e. floor-consistent) and tau=5,6 (floor 1e3, 3e6; measured
 *       -389 and -2.3e6 -- pure noise). The apparent |rhoRatio| &gt; K0 there is therefore the KNOWN
 *       imp-3730 additive cancellation floor, NOT a majorant violation: the same closed two-term
 *       model that governs (A) predicts rhoRatio -&gt; -3.412 monotonically through this window, and
 *       the direct route simply cannot see below its own floor past tau ~ 3.5.
 *
 *   VERDICT
 *   -------
 *   The imp-3892 majorant |rho(tau)| &lt;= K0 e^{-4 tau} is CONFIRMED directly on the reliability
 *   window tau in [1.5, 3.5] (all five rungs under K0, monotone approach to K_lead, two-term-model
 *   agreement within the per-tau floor). Beyond tau ~ 3.5 the DIRECT reconstruction falls below the
 *   imp-3730 cancellation floor and cannot certify the bound numerically; the tau in {4,5,6} region
 *   is governed by the imp-3892 closed two-term model instead. The residual is named
 *   sg-33208-high-tau-cancellation-floor. Measurement/verification only; certifies a bound literal,
 *   not RH; NPHI=10 truncation upstream; operator positivity (imp-3066 K_a &gt;= 0) UNTOUCHED; no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-3892-watson-majorant-constant.js (pinned K0, K_lead, K6; this verifies its pin)
 *   @see imp-3866-watson-tail-bound-assessment.js (measured rho/e^{-4 tau} ~ -3.406 on {2.5,3,3.5})
 *   @see imp-3850-a-weight-dual-path-tau25-30-reconciliation.js (reconciled -ln A ladder)
 *
 *   Ticket: imp-33208 (numerical, medium).
 */

const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3646/imp-3665)
const PI = Math.PI;

// Factored ln Phi(u) (imp-3709): ln Phi(u) = -pi e^{4u} + ln( sum_n amp_n e^{-pi(n^2-1)e^{4u}} ).
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;      // > 0 for u >= 0
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}

// n=1 tail ONLY of the shifted kernel (the amplitude the Watson derivation keeps).
function logPhiN1(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  const amp1 = 2 * PI * PI * e4 - 3 * PI * e2;                 // > 0 for u >= 0
  return -PI * e4 + Math.log(amp1);
}

// -- Peak-adapted graded Gauss-Legendre log-integral (imp-3709/imp-3730/imp-3850) --------------
const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845,
  0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806,
  0.0666713443086881,
];
function logIntegralGradedGL(lnG, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      terms.push(Math.log(GL_W[k] * half) + lnG(mid + half * GL_X[k]));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return mx + Math.log(acc);
}
const HI = 14;
const PANELS = 1600;
const GRADE = 6;

// -- Closed-form pin constants (imp-3892), recomputed here for an INDEPENDENT anchor ------------
let ACC0 = 0;
let DACC0 = 0;
for (let n = 1; n <= NPHI; n += 1) {
  const n2 = n * n;
  const n4 = n2 * n2;
  const amp = 2 * PI * PI * n4 - 3 * PI * n2;
  const expo = Math.exp(-PI * (n2 - 1));
  ACC0 += amp * expo;
  const dAmp = 8 * PI * PI * n4 - 6 * PI * n2;                 // d/ds of amp at s=0
  const dExpo = -PI * (n2 - 1) * 4;                           // d/ds of the exponent at s=0
  DACC0 += (dAmp + amp * dExpo) * expo;
}
const PHI0 = Math.exp(-PI) * ACC0;                             // Phi(0) = phi(0)
const PHI_PRIME_0 = Math.exp(-PI) * (-PI * ACC0 + 0.25 * DACC0);
const PSI_PRIME_0 = PHI_PRIME_0 - 0.5 * PHI0;
const K_LEAD = 2 * PHI_PRIME_0 / PHI0;                         // -3.4120570431 (imp-3892 pin)
const K6 = -(3 / PHI0) * (PSI_PRIME_0 / PI);                   // +2.1066020628 (next Watson coeff)
const K0 = 3.46;                                              // imp-3892 certified majorant

// -- Direct measurement of rho(tau) e^{4 tau} across the full grid -----------------------------
// A point is measurement-RELIABLE when its estimated additive cancellation floor on rhoRatio,
// floorNoise ~ 2 pi * T * eps / e^{-4 tau} = 2 pi^2 e^{8 tau} eps, is comfortably below the ~3.41
// signal (threshold 0.05: covers tau <= 3.5, excludes tau >= 4 where the floor swamps the signal).
const GRID = [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0, 6.0];
const RELIABILITY_FLOOR_THRESHOLD = 0.05;
const MEASUREMENTS = GRID.map((tau) => {
  const T = PI * Math.exp(4 * tau);
  const e4t = Math.exp(-4 * tau);
  const lnAn1 = logIntegralGradedGL((s) => logPhiFactored(s) + logPhiN1(s + tau), HI, PANELS, GRADE);
  const bracket = Math.exp(lnAn1 + T - Math.log(PHI0 / 4));
  const rho = bracket - (2 * PI - 3 * Math.exp(-2 * tau));
  const rhoRatio = rho / e4t;                                 // realised rho(tau) e^{4 tau}
  const modelRatio = K_LEAD + K6 * Math.exp(-2 * tau);        // imp-3892 two-term closed model
  const floorNoise = 2 * PI * T * Number.EPSILON / e4t;       // estimated additive cancellation floor
  const reliable = floorNoise < RELIABILITY_FLOOR_THRESHOLD;
  return Object.freeze({
    tau,
    T,
    rhoRatio,
    modelRatio,
    modelDiff: Math.abs(rhoRatio - modelRatio),
    absRhoRatio: Math.abs(rhoRatio),
    underMajorant: Math.abs(rhoRatio) <= K0,
    floorNoise,
    reliable,
  });
}).map(Object.freeze);

const RELIABLE = MEASUREMENTS.filter((m) => m.reliable);
const SWAMPED = MEASUREMENTS.filter((m) => !m.reliable);

// -- Findings ----------------------------------------------------------------------------------
// (A) On the reliability window every realised |rho e^{4 tau}| stays strictly below K0 = 3.46.
const reliableAllUnderMajorant = RELIABLE.every((m) => m.underMajorant);
// (A) ... climbs toward K_lead (magnitude grows toward |K_lead| = 3.412), monotonically up to the
// per-tau floor: the only non-increase is the tau=3.5 rung, whose ~8e-4 dip is below its own
// ~6e-3 cancellation floor (the floor onset, not a genuine reversal).
const reliableMonotone = RELIABLE.every(
  (m, i) => i === 0
    || m.absRhoRatio >= RELIABLE[i - 1].absRhoRatio - (Math.max(m.floorNoise, RELIABLE[i - 1].floorNoise) + 1e-9),
);
// (A) ... and the realised ratio reproduces the imp-3892 two-term model within each per-tau floor
// (with a small fixed cushion for the graded-GL quadrature residual).
const reliableMatchesModel = RELIABLE.every((m) => m.modelDiff < m.floorNoise + 5e-3);
// (A) ... passing through the imp-3866 measured -3.406 near tau=3.
const reproducesImp3866Near3 = MEASUREMENTS.some(
  (m) => m.tau === 3.0 && Math.abs(m.rhoRatio - (-3.406866)) < 1e-4,
);
// (B) The swamped window is genuinely below its own floor: floorNoise there exceeds the signal, and
// the measured deviation from the model is bounded by that floor (so it is noise, not a violation).
const swampedIsFloorArtifact = SWAMPED.length > 0
  && SWAMPED.every((m) => m.floorNoise >= RELIABILITY_FLOOR_THRESHOLD)
  && SWAMPED.every((m) => m.modelDiff <= m.floorNoise + 1e-6);
// The pinned model itself stays under K0 across the ENTIRE grid (the bound is real everywhere; only
// the DIRECT measurement loses resolution past tau ~ 3.5).
const modelUnderMajorantEverywhere = MEASUREMENTS.every((m) => Math.abs(m.modelRatio) <= K0);
const kLeadMatchesPin = Math.abs(K_LEAD - (-3.4120570431)) < 1e-6;
const k6MatchesPin = Math.abs(K6 - 2.1066020628) < 1e-6;

const verdict =
  reliableAllUnderMajorant && reliableMonotone && reliableMatchesModel && reproducesImp3866Near3
    && swampedIsFloorArtifact && modelUnderMajorantEverywhere && kLeadMatchesPin && k6MatchesPin
    ? 'CONFIRMED:imp-3892-majorant-|rho|<=K0 e^{-4tau}(K0=3.46)-verified-directly-on-the-reliability-'
      + 'window-tau in[1.5,3.5]:all-five-rungs-under-K0,-rhoRatio-climbs-toward-the-pin-monotonically-'
      + 'up-to-the-per-tau-floor(-3.305,-3.373,-3.398,-3.407,-3.406;tau=3.5-dips~8e-4-within-its-floor)-'
      + 'K_lead=-3.4120570431,-passes-through-'
      + 'the-imp-3866-measured--3.406-near-tau=3,-and-reproduces-the-two-term-model-K_lead+K6 e^{-2tau}'
      + '(K6=+2.1066020628)-within-each-per-tau-floor;-tau in{4,5,6}-fall-below-the-imp-3730-additive-'
      + 'cancellation-floor(floorNoise~2pi^2 e^{8tau}eps-crosses-the-3.41-signal-at-tau~4),-so-the-'
      + 'direct-route-cannot-certify-there-and-the-closed-model-governs(sg-33208-high-tau-cancellation-'
      + 'floor);-NPHI=10-truncation-upstream,-imp-3066-positivity-untouched,-measurement-only,-no-QED,-'
      + 'PT-Lambda<=0.2-SOTA'
    : 'INDETERMINATE';

export const IMP33208_WATSON_MAJORANT_NUMERICAL_VERIFICATION = Object.freeze({
  id: 'imp-33208-watson-majorant-numerical-verification',
  ticket: 'imp-33208',
  verifiesModule: 'imp-3892-watson-majorant-constant.js',
  newResidualSubGap: 'sg-33208-high-tau-cancellation-floor',

  summary:
    'NUMERICALLY VERIFIES the imp-3892 pinned Watson majorant |rho(tau)| <= K0 e^{-4 tau} '
    + '(K0 = 3.46) by measuring the realised bracket remainder ratio rho(tau) e^{4 tau} across the '
    + 'grid tau in {1.5, 2, 2.5, 3, 3.5, 4, 5, 6} on the imp-3850/imp-3873 reconciled graded-GL '
    + '-ln A ladder. On the reliability window tau in [1.5, 3.5] -- where the direct reconstruction '
    + 'bracket = exp(ln A_n1 + T - ln(Phi(0)/4)) sits far above its additive cancellation floor -- '
    + 'the realised ratio CLIMBS toward the pinned limit K_lead = -3.4120570431 monotonically up to '
    + 'the per-tau floor (-3.305, -3.373, -3.398, -3.407, -3.406; the tau=3.5 rung dips ~8e-4 below '
    + 'tau=3, within its own ~6e-3 floor), stays STRICTLY below K0 = 3.46 at every rung, passes '
    + 'through the imp-3866 measured -3.406 near tau=3, and reproduces the closed two-term model '
    + 'K_lead + K6 e^{-2 tau} (K6 = +2.1066020628) within each per-tau floor: a direct confirmation '
    + 'of the imp-3892 pin. At tau in {4, 5, 6} the direct route falls below the imp-3730 additive '
    + 'cancellation floor (floorNoise ~ 2 pi^2 e^{8 tau} eps crosses the ~3.41 signal at tau ~ 4), so '
    + 'the apparent |rho e^{4 tau}| > K0 there is a known floor artifact, not a majorant violation -- '
    + 'the closed model governs that region (residual sg-33208-high-tau-cancellation-floor). '
    + 'Measurement/verification only; certifies a bound literal, not RH; NPHI=10 truncation upstream; '
    + 'operator positivity (imp-3066) UNTOUCHED; no QED. No refereed bound is changed.',

  measured: Object.freeze({
    nphi: NPHI,
    hi: HI,
    panels: PANELS,
    grade: GRADE,
    phi0: PHI0,
    kLead: K_LEAD,                              // -3.4120570431 (imp-3892 pin, recomputed)
    k6: K6,                                     // +2.1066020628
    k0: K0,                                     // 3.46 majorant
    reliabilityFloorThreshold: RELIABILITY_FLOOR_THRESHOLD,
    grid: MEASUREMENTS,                          // per-tau {rhoRatio, modelRatio, modelDiff, underMajorant, floorNoise, reliable}
    reliableAllUnderMajorant,                    // (A)
    reliableMonotone,                            // (A)
    reliableMatchesModel,                        // (A)
    reproducesImp3866Near3,                      // (A)
    swampedIsFloorArtifact,                      // (B)
    modelUnderMajorantEverywhere,
    kLeadMatchesPin,
    k6MatchesPin,
    verdict,
  }),

  interpretation: Object.freeze({
    whatIsVerified:
      'The imp-3892 majorant |rho(tau)| <= 3.46 e^{-4 tau} is confirmed by DIRECT measurement on '
      + 'the five reachable rungs tau in [1.5, 3.5]: each realised |rho e^{4 tau}| is under K0, the '
      + 'sequence rises toward the pinned K_lead = -3.412 (monotonically up to the per-tau floor; the '
      + 'tau=3.5 rung dips within its own floor), hits the imp-3866 -3.406 near tau=3, and tracks the '
      + 'two-term closed model within the per-tau numerical floor.',
    whyHighTauCannotBeMeasuredDirectly:
      'bracket = exp(ln A_n1 + T - ...) recovers an O(1) number from ln A_n1 ~ -T, whose float '
      + 'resolution is ~ T * 2^{-52}; the induced noise on rho e^{4 tau} is ~ 2 pi^2 e^{8 tau} eps, '
      + 'which overtakes the ~3.41 signal near tau=4 (floor ~0.35) and swamps it entirely by tau=5,6 '
      + '(floor ~1e3, ~3e6). The measured -389 and -2.3e6 at tau=5,6 are pure cancellation noise; the '
      + 'bound is not violated -- it simply cannot be seen by this direct route past tau ~ 3.5.',
    residualCharacterization:
      'sg-33208-high-tau-cancellation-floor: a direct numerical certification of the majorant beyond '
      + 'tau ~ 3.5 would need a higher-precision (or cancellation-free) reconstruction of bracket(tau); '
      + 'the imp-3892 closed two-term model already covers that region analytically, and its ratio '
      + 'stays under K0 across the entire grid.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    verificationScope:
      'A direct numerical verification of the imp-3892 pinned majorant on the reachable window '
      + 'tau in [1.5, 3.5]; beyond that the direct reconstruction is below the imp-3730 additive '
      + 'cancellation floor and the closed two-term model is relied on instead. Establishes NO '
      + 'operator positivity and computes no new Lambda bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity '
      + '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    residualSubGap:
      'sg-33208-high-tau-cancellation-floor: the majorant is directly confirmed only on tau in '
      + '[1.5, 3.5]; a cancellation-free high-precision bracket reconstruction would extend the direct '
      + 'check to tau in {4, 5, 6}. NPHI=10 kernel truncation is an upstream modeling choice.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -----------------------------------------------------------------------
export const IMP33208_WATSON_MAJORANT_NUMERICAL_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp33208-reliability-window-under-majorant-and-monotone',
    why: 'On the reliability window tau in [1.5, 3.5] every realised |rho e^{4 tau}| is under K0 = 3.46 '
      + 'AND the ratio magnitude climbs monotonically toward the pin K_lead = -3.4120570431.',
    holds: () => reliableAllUnderMajorant && reliableMonotone,
  },
  {
    id: 'imp33208-reliability-window-matches-imp3892-two-term-model',
    why: 'The realised rho e^{4 tau} reproduces the imp-3892 closed model K_lead + K6 e^{-2 tau} '
      + 'within each per-tau cancellation floor, and passes through the imp-3866 measured -3.406 at tau=3.',
    holds: () => reliableMatchesModel && reproducesImp3866Near3,
  },
  {
    id: 'imp33208-high-tau-is-floor-artifact-not-violation',
    why: 'At tau in {4, 5, 6} the estimated additive cancellation floor exceeds the signal and bounds '
      + 'the measured deviation from the model, so the apparent |rho e^{4 tau}| > K0 is a known '
      + 'imp-3730 floor artifact; the pinned two-term model stays under K0 across the entire grid.',
    holds: () => swampedIsFloorArtifact && modelUnderMajorantEverywhere,
  },
  {
    id: 'imp33208-pin-constants-reproduced',
    why: 'The independently recomputed pin constants match imp-3892: K_lead = -3.4120570431 and '
      + 'K6 = +2.1066020628.',
    holds: () => kLeadMatchesPin && k6MatchesPin,
  },
  {
    id: 'imp33208-verdict-records-confirmed',
    why: 'The classified verdict must record that the imp-3892 majorant is CONFIRMED on the reliability '
      + 'window, not indeterminate.',
    holds: () => verdict.startsWith('CONFIRMED'),
  },
  {
    id: 'imp33208-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: verification only, mass-feasibility necessary-but-not-sufficient, '
      + 'operator positivity (imp-3066) untouched, a residual sub-gap named, no refereed bound is changed.',
    holds: () => {
      const c = IMP33208_WATSON_MAJORANT_NUMERICAL_VERIFICATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /sg-33208-high-tau-cancellation-floor/.test(c.residualSubGap) &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33208_WATSON_MAJORANT_NUMERICAL_VERIFICATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33208-watson-majorant-numerical-verification assertion failed: ${assertion.id}`);
  }
}

export default IMP33208_WATSON_MAJORANT_NUMERICAL_VERIFICATION;
