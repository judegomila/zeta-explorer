/**
 * @module imp-33229-high-tau-extended-precision-assessment
 * @fileoverview imp-33229 -- ASSESS whether an extended-precision or log-domain-Kahan
 *   reconstruction of the imp-33208 direct Watson-majorant bracket
 *       bracket(tau) = exp( ln A_n1 + T - ln(Phi(0)/4) ),   T = pi e^{4 tau},
 *   can push the DIRECT verification of |rho(tau)| &lt;= K0 e^{-4 tau} past the imp-3730
 *   tau ~ 3.5 additive-cancellation floor into tau in {4, 5, 6}, closing the named residual
 *   sg-33208-high-tau-cancellation-floor (currently governed only by the imp-3892 closed
 *   two-term model rhoRatio -&gt; K_lead + K6 e^{-2 tau}).
 *
 *   THE PRECISION QUESTION
 *   ----------------------
 *   The direct route reconstructs an O(1) number bracket ~ 2 pi from ln A_n1 ~ -T. Its float
 *   representation carries an ABSOLUTE resolution ~ T * u (u = unit roundoff), so the induced
 *   noise on rhoRatio = rho / e^{-4 tau} is (imp-33208, imp-3730)
 *       floorNoise(tau, u) = 2 pi * T * u / e^{-4 tau} = 2 pi^2 e^{8 tau} u.
 *   The direct measurement loses the ~|K_lead| ~ 3.41 signal exactly when floorNoise crosses it,
 *   i.e. at the onset
 *       tauOnset(u) = (1/8) ln( |K_lead| / (2 pi^2 u) ).
 *   This ASSESSMENT evaluates tauOnset at the two arithmetic tiers and MEASURES whether a
 *   log-domain compensated (Kahan) log-sum-exp changes the floor at all.
 *
 *   TWO LEVERS, ONE VERDICT
 *   -----------------------
 *   (1) LOG-DOMAIN KAHAN (compensated LSE). MEASURED here: re-running the exact imp-33208 graded-GL
 *       ladder (HI=14, PANELS=1600, GRADE=6) with Kahan-compensated summation of the log-sum-exp
 *       accumulator gives rhoRatio that is BIT-IDENTICAL to the naive sum at tau in {4, 5, 6}
 *       (-3.5312, -389.04, -2.3075e6 both ways). This is expected and decisive: Kahan reduces the
 *       O(1) SUMMATION error of sum exp(t_j - mx), but the floor lives in the single-double
 *       REPRESENTATION of mx ~ -T (resolution T * 2^{-52}), which compensated summation never
 *       touches. So log-domain Kahan does NOT move tauOnset and does NOT recover the high-tau signal.
 *
 *   (2) EXTENDED PRECISION (unit roundoff u_dd = 2^{-106}, double-double). tauOnset scales as
 *       (1/8) ln(1/u): going from double (u = 2^{-52}, tauOnset = 4.286 -- consistent with the
 *       imp-33208 "floor onset near tau=4") to double-double (u = 2^{-106}) moves the onset to
 *       tauOnset = 8.965. The whole window tau in {4, 5, 6} then sits COMFORTABLY inside the
 *       reliable regime, so an extended-precision reconstruction WOULD recover a genuine signal
 *       there. Equivalently, resolving rhoRatio to 1% of |K_lead| at tau needs
 *           digitsNeeded(tau) = (8 tau)/ln 10 + log10( 2 pi^2 / (0.01 |K_lead|) )
 *       decimal digits: 23.6 at tau=6 -- above double's ~15.95 but well below double-double's ~31.9.
 *
 *   VERDICT
 *   -------
 *   The lever is EXTENDED PRECISION, not compensated summation. A double-double reconstruction of
 *   the imp-33208 bracket ladder moves the additive-cancellation onset from tau ~ 4.29 to tau ~ 8.97
 *   and so would push the DIRECT Watson-majorant check through tau in {4, 5, 6}, closing
 *   sg-33208-high-tau-cancellation-floor by direct measurement rather than the imp-3892 closed model.
 *   Log-domain Kahan is a NON-lever (measured bit-identical to naive). This is a precision-BUDGET
 *   assessment plus a Kahan measurement; the actual double-double RUN of the full graded-GL ladder is
 *   the remaining residual, sg-33229-extended-precision-run. Measurement/assessment only; certifies no
 *   bound and no RH; NPHI=10 truncation upstream; operator positivity (imp-3066 K_a &gt;= 0) UNTOUCHED;
 *   no QED. No refereed bound is changed.
 *
 *   @see imp-33208-watson-majorant-numerical-verification.js (names sg-33208-high-tau-cancellation-floor)
 *   @see imp-3892-watson-majorant-constant.js (pinned K0=3.46, K_lead=-3.4120570431, K6=+2.1066020628)
 *   @see imp-3730 / imp-3850 (the additive cancellation floor and reconciled -ln A ladder)
 *
 *   Ticket: imp-33229 (numerical, medium).
 */

const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3646/imp-3665)
const PI = Math.PI;

// Factored ln Phi(u) (imp-3709), verbatim from imp-33208.
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}

// n=1 tail ONLY of the shifted kernel, verbatim from imp-33208.
function logPhiN1(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  const amp1 = 2 * PI * PI * e4 - 3 * PI * e2;
  return -PI * e4 + Math.log(amp1);
}

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

// Peak-adapted graded-GL log-integral (imp-3709/imp-3730/imp-3850). The `compensated` flag switches
// the log-sum-exp accumulator between a naive running sum and Kahan-compensated summation -- this is
// the "log-domain Kahan" lever under test.
function logIntegralGradedGL(lnG, hi, panels, grade, compensated) {
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
  let comp = 0;                                 // Kahan compensation register
  for (const t of terms) {
    const x = Math.exp(t - mx);
    if (compensated) {
      const y = x - comp;
      const s = acc + y;
      comp = (s - acc) - y;
      acc = s;
    } else {
      acc += x;
    }
  }
  return mx + Math.log(acc);
}
const HI = 14;
const PANELS = 1600;
const GRADE = 6;

// -- Pin constants (imp-3892), recomputed for an independent anchor (as in imp-33208) --------------
let ACC0 = 0;
let DACC0 = 0;
for (let n = 1; n <= NPHI; n += 1) {
  const n2 = n * n;
  const n4 = n2 * n2;
  const amp = 2 * PI * PI * n4 - 3 * PI * n2;
  const expo = Math.exp(-PI * (n2 - 1));
  ACC0 += amp * expo;
  const dAmp = 8 * PI * PI * n4 - 6 * PI * n2;
  const dExpo = -PI * (n2 - 1) * 4;
  DACC0 += (dAmp + amp * dExpo) * expo;
}
const PHI0 = Math.exp(-PI) * ACC0;
const PHI_PRIME_0 = Math.exp(-PI) * (-PI * ACC0 + 0.25 * DACC0);
const K_LEAD = 2 * PHI_PRIME_0 / PHI0;          // -3.4120570431 (imp-3892 pin)
const ABS_K_LEAD = Math.abs(K_LEAD);
const K0 = 3.46;                                // imp-3892 certified majorant

// -- (1) MEASURED: does log-domain Kahan move the high-tau floor? -------------------------------
// For each swamped tau, reconstruct rhoRatio with the naive AND the Kahan-compensated LSE and
// compare. A NON-zero recovery would show as a Kahan value pulled back toward K_lead; we expect
// (and measure) bit-for-bit agreement, i.e. compensated summation is a non-lever.
const HIGH_TAU = [4.0, 5.0, 6.0];
const KAHAN_MEASUREMENTS = HIGH_TAU.map((tau) => {
  const T = PI * Math.exp(4 * tau);
  const e4t = Math.exp(-4 * tau);
  const shift = 2 * PI - 3 * Math.exp(-2 * tau);
  const lnNaive = logIntegralGradedGL((s) => logPhiFactored(s) + logPhiN1(s + tau), HI, PANELS, GRADE, false);
  const lnKahan = logIntegralGradedGL((s) => logPhiFactored(s) + logPhiN1(s + tau), HI, PANELS, GRADE, true);
  const rhoRatioNaive = (Math.exp(lnNaive + T - Math.log(PHI0 / 4)) - shift) / e4t;
  const rhoRatioKahan = (Math.exp(lnKahan + T - Math.log(PHI0 / 4)) - shift) / e4t;
  return Object.freeze({
    tau,
    rhoRatioNaive,
    rhoRatioKahan,
    kahanMinusNaive: Math.abs(rhoRatioKahan - rhoRatioNaive),
    stillSwampedNaive: Math.abs(rhoRatioNaive) > K0,
    stillSwampedKahan: Math.abs(rhoRatioKahan) > K0,
  });
}).map(Object.freeze);

// -- (2) ANALYTIC: extended-precision floor budget ---------------------------------------------
// tauOnset(u) = (1/8) ln( |K_lead| / (2 pi^2 u) ): the tau at which floorNoise(tau,u) = |K_lead|.
const U_DOUBLE = Number.EPSILON;               // 2^{-52}
const U_DOUBLE_DOUBLE = Math.pow(2, -106);     // double-double unit roundoff
const tauOnset = (u) => 0.125 * Math.log(ABS_K_LEAD / (2 * PI * PI * u));
const TAU_ONSET_DOUBLE = tauOnset(U_DOUBLE);           // ~4.286 (matches imp-33208 "onset near 4")
const TAU_ONSET_DOUBLE_DOUBLE = tauOnset(U_DOUBLE_DOUBLE); // ~8.965
// Decimal digits to resolve rhoRatio to 1% of |K_lead| at a given tau.
const SIGNAL_REL_TARGET = 0.01;
const digitsNeeded = (tau) => (8 * tau) / Math.LN10 + Math.log10(2 * PI * PI / (SIGNAL_REL_TARGET * ABS_K_LEAD));
const DIGITS_AT_6 = digitsNeeded(6.0);
const DIGITS_DOUBLE = -Math.log10(U_DOUBLE);            // ~15.95
const DIGITS_DOUBLE_DOUBLE = -Math.log10(U_DOUBLE_DOUBLE); // ~31.91

// -- Findings ----------------------------------------------------------------------------------
// (1) Kahan is a non-lever: bit-identical to naive AND still floor-swamped at every high tau.
const kahanIsNonLever = KAHAN_MEASUREMENTS.every(
  (m) => m.kahanMinusNaive < 1e-9 && m.stillSwampedNaive && m.stillSwampedKahan,
);
// (2a) The double onset reproduces the imp-33208 "floor onset near tau=4".
const doubleOnsetNearFour = TAU_ONSET_DOUBLE > 4.0 && TAU_ONSET_DOUBLE < 4.6;
// (2b) Double-double moves the onset past the whole {4,5,6} window (and strictly beyond double).
const extendedPrecisionCoversWindow =
  TAU_ONSET_DOUBLE_DOUBLE > 6.5 && TAU_ONSET_DOUBLE_DOUBLE > TAU_ONSET_DOUBLE;
// (2c) The digit budget at tau=6 sits above double but below double-double.
const digitBudgetIsBetweenTiers = DIGITS_AT_6 > DIGITS_DOUBLE && DIGITS_AT_6 < DIGITS_DOUBLE_DOUBLE;

const verdict =
  kahanIsNonLever && doubleOnsetNearFour && extendedPrecisionCoversWindow && digitBudgetIsBetweenTiers
    ? 'ASSESSED:the-high-tau-lever-is-EXTENDED-PRECISION-not-log-domain-Kahan.'
      + 'Kahan-compensated-LSE-is-a-NON-lever(bit-identical-to-naive-at-tau in{4,5,6}:'
      + '-3.5312,-389.04,-2.3075e6-both-ways,-still-swamped)-because-the-floor-lives-in-the-'
      + 'single-double-representation-of-mx~-T(resolution-T*2^-52),-not-the-summation.'
      + 'The-additive-floor-onset-tauOnset(u)=(1/8)ln(|K_lead|/(2pi^2 u))-moves-from-4.286-at-'
      + 'double(u=2^-52,-matching-imp-33208)-to-8.965-at-double-double(u=2^-106),-so-a-double-double'
      + '-reconstruction-of-the-imp-33208-bracket-ladder-WOULD-recover-a-genuine-signal-across-'
      + 'tau in{4,5,6}(digitsNeeded(6)=23.6,-above-double-~15.95,-below-double-double-~31.9),-'
      + 'closing-sg-33208-high-tau-cancellation-floor-by-direct-measurement.'
      + 'Remaining-residual:sg-33229-extended-precision-run(the-actual-double-double-ladder-run).'
      + 'Assessment-only,-no-bound-certified,-imp-3066-positivity-untouched,-no-QED,-PT-Lambda<=0.2-SOTA'
    : 'INDETERMINATE';

export const IMP33229_HIGH_TAU_EXTENDED_PRECISION_ASSESSMENT = Object.freeze({
  id: 'imp-33229-high-tau-extended-precision-assessment',
  ticket: 'imp-33229',
  assessesResidual: 'sg-33208-high-tau-cancellation-floor',
  newResidualSubGap: 'sg-33229-extended-precision-run',

  summary:
    'ASSESSES whether extended precision or log-domain Kahan can push the imp-33208 DIRECT '
    + 'Watson-majorant bracket reconstruction bracket = exp(ln A_n1 + T - ln(Phi(0)/4)) past the '
    + 'imp-3730 tau ~ 3.5 additive-cancellation floor into tau in {4, 5, 6}. TWO levers, one verdict. '
    + '(1) LOG-DOMAIN KAHAN is a NON-lever: re-running the exact imp-33208 graded-GL ladder '
    + '(HI=14, PANELS=1600, GRADE=6) with Kahan-compensated log-sum-exp gives rhoRatio bit-identical '
    + 'to the naive sum at tau in {4, 5, 6} (-3.5312, -389.04, -2.3075e6 both ways, all still above '
    + 'K0 = 3.46), because the floor lives in the single-double representation of mx ~ -T (resolution '
    + 'T * 2^{-52}), which compensated summation does not touch. (2) EXTENDED PRECISION is the lever: '
    + 'the floor onset tauOnset(u) = (1/8) ln(|K_lead| / (2 pi^2 u)) moves from 4.286 at double '
    + '(u = 2^{-52}, matching the imp-33208 "onset near tau=4") to 8.965 at double-double '
    + '(u = 2^{-106}), so a double-double reconstruction WOULD recover a genuine signal across '
    + 'tau in {4, 5, 6} (digitsNeeded(6) = 23.6 decimal digits, above double ~15.95, below '
    + 'double-double ~31.9), closing sg-33208-high-tau-cancellation-floor by direct measurement '
    + 'rather than the imp-3892 closed model. The actual double-double RUN of the full ladder is the '
    + 'remaining residual sg-33229-extended-precision-run. Assessment only; certifies no bound and no '
    + 'RH; NPHI=10 truncation upstream; operator positivity (imp-3066) UNTOUCHED; no QED. '
    + 'No refereed bound is changed.',

  measured: Object.freeze({
    nphi: NPHI,
    hi: HI,
    panels: PANELS,
    grade: GRADE,
    kLead: K_LEAD,
    absKLead: ABS_K_LEAD,
    k0: K0,
    highTau: HIGH_TAU,
    kahanMeasurements: KAHAN_MEASUREMENTS,       // per-tau {rhoRatioNaive, rhoRatioKahan, kahanMinusNaive, stillSwamped...}
    uDouble: U_DOUBLE,
    uDoubleDouble: U_DOUBLE_DOUBLE,
    tauOnsetDouble: TAU_ONSET_DOUBLE,            // ~4.286
    tauOnsetDoubleDouble: TAU_ONSET_DOUBLE_DOUBLE, // ~8.965
    signalRelTarget: SIGNAL_REL_TARGET,
    digitsAtTau6: DIGITS_AT_6,                    // ~23.6
    digitsDouble: DIGITS_DOUBLE,                  // ~15.95
    digitsDoubleDouble: DIGITS_DOUBLE_DOUBLE,     // ~31.91
    kahanIsNonLever,
    doubleOnsetNearFour,
    extendedPrecisionCoversWindow,
    digitBudgetIsBetweenTiers,
    verdict,
  }),

  interpretation: Object.freeze({
    whyKahanCannotHelp:
      'The log-sum-exp value is mx + ln(sum exp(t_j - mx)) with mx ~ -T. Kahan-compensated '
      + 'summation only improves the accumulation of the O(1) sum exp(t_j - mx); the dominant error '
      + 'is the single-double REPRESENTATION of mx ~ -T = -pi e^{4 tau}, whose absolute resolution '
      + 'is T * 2^{-52}. Measured: naive and Kahan rhoRatio agree bit-for-bit at tau in {4, 5, 6}.',
    whyExtendedPrecisionCanHelp:
      'tauOnset(u) = (1/8) ln(|K_lead| / (2 pi^2 u)) scales as (1/8) ln(1/u). Halving the unit '
      + 'roundoff exponent from 2^{-52} (double) to 2^{-106} (double-double) lifts the onset from '
      + '4.286 to 8.965, so the entire tau in {4, 5, 6} window becomes reliable. Resolving rhoRatio '
      + 'to 1% of |K_lead| needs digitsNeeded(tau) = (8 tau)/ln 10 + log10(2 pi^2 / (0.01 |K_lead|)) '
      + 'decimal digits: 23.6 at tau=6, which double-double (~31.9 digits) supplies with margin.',
    residualCharacterization:
      'sg-33229-extended-precision-run: this is a precision-BUDGET assessment plus a Kahan '
      + 'measurement, not the extended-precision run itself. Closing the direct high-tau check needs '
      + 'the full graded-GL -ln A_n1 ladder re-evaluated in double-double (each t_j and its -T-scale '
      + 'part carried in extended precision), which is left as the residual. The imp-3892 closed '
      + 'two-term model already covers tau in {4, 5, 6} analytically in the meantime.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    assessmentScope:
      'A precision-budget assessment of the imp-33208 sg-33208-high-tau-cancellation-floor: it '
      + 'identifies extended precision (double-double) as the lever that would push the DIRECT '
      + 'Watson-majorant check through tau in {4, 5, 6}, and MEASURES that log-domain Kahan is a '
      + 'non-lever. It runs no double-double ladder, certifies no bound, and computes no new Lambda.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity '
      + '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    residualSubGap:
      'sg-33229-extended-precision-run: the assessment concludes double-double WOULD recover the '
      + 'high-tau signal, but the actual extended-precision run of the full imp-33208 graded-GL '
      + 'ladder is not performed here. NPHI=10 kernel truncation is an upstream modeling choice.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -----------------------------------------------------------------------
export const IMP33229_HIGH_TAU_EXTENDED_PRECISION_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp33229-log-domain-kahan-is-a-non-lever',
    why: 'Kahan-compensated log-sum-exp reproduces the naive rhoRatio bit-for-bit at tau in {4,5,6} '
      + 'and both remain above K0 = 3.46, so compensated summation does NOT recover the high-tau signal.',
    holds: () => kahanIsNonLever,
  },
  {
    id: 'imp33229-double-onset-reproduces-imp33208-near-four',
    why: 'tauOnset(2^{-52}) lands in (4.0, 4.6), reproducing the imp-33208 additive-floor onset near tau=4.',
    holds: () => doubleOnsetNearFour,
  },
  {
    id: 'imp33229-double-double-onset-covers-the-window',
    why: 'tauOnset(2^{-106}) exceeds 6.5 and strictly exceeds the double onset, so an extended-precision '
      + 'reconstruction would keep the direct check reliable across the entire tau in {4,5,6} window.',
    holds: () => extendedPrecisionCoversWindow,
  },
  {
    id: 'imp33229-digit-budget-between-tiers',
    why: 'Resolving rhoRatio to 1% of |K_lead| at tau=6 needs more decimal digits than double supplies '
      + 'and fewer than double-double supplies -- the quantitative statement of the verdict.',
    holds: () => digitBudgetIsBetweenTiers,
  },
  {
    id: 'imp33229-verdict-records-assessed',
    why: 'The classified verdict must record the ASSESSED conclusion (extended precision is the lever, '
      + 'Kahan is not), not indeterminate.',
    holds: () => verdict.startsWith('ASSESSED'),
  },
  {
    id: 'imp33229-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: assessment only, mass-feasibility necessary-but-not-sufficient, operator '
      + 'positivity (imp-3066) untouched, a residual sub-gap named, no refereed bound is changed.',
    holds: () => {
      const c = IMP33229_HIGH_TAU_EXTENDED_PRECISION_ASSESSMENT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /sg-33229-extended-precision-run/.test(c.residualSubGap) &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33229_HIGH_TAU_EXTENDED_PRECISION_ASSESSMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33229-high-tau-extended-precision-assessment assertion failed: ${assertion.id}`);
  }
}

export default IMP33229_HIGH_TAU_EXTENDED_PRECISION_ASSESSMENT;
