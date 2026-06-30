/**
 * @module imp-3106-excess-fraction-integrability
 * @fileoverview imp-3106 -- Assess the INTEGRABILITY of the imp-3064 excess
 *   fraction phi(s) = G(s)/F(s) over the full admissible overflow range
 *   (s0, inf), s0 = arcsinh(1). Tie together the two endpoint asymptotics already
 *   measured -- the imp-3087 onset quadratic pole phi ~ C/(s-s0)^2 and the
 *   imp-3088 large-s tail phi ~ K e^{-s} -- into a single statement about the
 *   area-weighted (mean) price of the forced even cosh-completion.
 *
 *   THE QUESTION (frontier scout)
 *   -----------------------------
 *   imp-3087 fixed the onset behaviour (quadratic pole, no finite supremum) and
 *   imp-3088 fixed the tail behaviour (pure exponential decay), but the TOTAL
 *   mass int_{s0}^{inf} phi ds -- equivalently the area-weighted mean of phi over
 *   the admissible range -- was never assessed. Does the onset pole make that
 *   integral DIVERGE, and if so, what is the convergent tail mass that survives?
 *
 *   THE SETUP (inherited from imp-3064)
 *   -----------------------------------
 *   The degree-0 deficit/excess masses reduce to the single product s = a*U
 *   (valid where an overflow exists, s > s0 = arcsinh(1)):
 *       a * D_raw = F(s) = cosh(s) - sqrt(2) - s + arcsinh(1)
 *       a * E     = G(s) = sqrt(2) - arcsinh(1) - e^{-s}
 *   so phi(s) = G(s)/F(s) depends on s = a*U alone.
 *
 *   WHAT THIS MODULE ADDS (the imp-3106 deliverable)
 *   ------------------------------------------------
 *   (1) ONSET DIVERGENCE -- the integral is NON-INTEGRABLE at s0. From imp-3087,
 *   phi(s) ~ C/(s-s0)^2 with C = sqrt(2)*(1 - arcsinh(1)) ~ 0.16776. The analytic
 *   principal part is EXACT and divergent:
 *       int_{s0+eps}^{s0+1} C/(s-s0)^2 ds = C*(1/eps - 1)  ->  +infinity,
 *   the textbook non-integrable inverse-square endpoint singularity. We confirm
 *   the FULL integral inherits this: an eps-cutoff ladder of the exact numerical
 *   mass I(eps) = int_{s0+eps}^{s0+1} phi ds grows ~10x per decade of eps (the
 *   1/eps power law, NOT the 100x of the integrand itself) and the rescaled
 *   product eps*I(eps) -> C ~ 0.16776 from above, pinning the divergence rate to
 *   exactly C/eps. So the area-weighted MEAN price of the cosh-completion is
 *   UNBOUNDED -- it has no finite value; the divergence is a property, not a number.
 *
 *   (2) CONVERGENT TAIL MASS -- away from the onset everything is finite. From
 *   imp-3088 phi ~ K e^{-s}, K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568, so the tail
 *   mass int_S^{inf} phi ds converges and decays at the e^{-s} rate:
 *       int_S^{inf} phi ds ~ K e^{-S},
 *   verified to track K e^{-S} from above with the ratio -> 1 (1.0005 at S = 10).
 *   The whole finite "regular" mass beyond the onset window,
 *   int_{s0+1}^{inf} phi ds ~ 0.2690, is a fixed convergent number.
 *
 *   (3) WHERE THE DIVERGENCE DOMINATES -- entirely at the onset. The total splits
 *       int_{s0+eps}^{inf} phi ds = I(eps) [-> infinity] + 0.2690 [finite].
 *   The divergent contribution C/eps overruns the fixed finite remainder 0.2690 by
 *   an unbounded factor as eps -> 0 (already ~6000x at eps = 1e-4). The unbounded
 *   mean price is localised in an arbitrarily thin onset sliver; the interior and
 *   tail carry only a bounded, e^{-s}-decaying mass.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   THIS IS A DIVERGENCE CHARACTERIZATION, NOT A VALUE. DEGREE-0 SCALAR MEASURE
 *   ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. The integral of the imp-3064
 *   scalar ratio neither proves nor weakens RH; it has no finite mean to report.
 *   The off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone
 *   obstruction and is untouched. measure only, no QED. Platt-Trudgian
 *   Lambda &lt;= 0.2 REMAINS the rigorous SOTA.
 *
 *   @see imp-3064-deficit-excess-fraction-grid.js (imp-3064: the a*U scale invariant + phi)
 *   @see imp-3087-excess-fraction-onset-divergence.js (imp-3087: onset pole C/(s-s0)^2)
 *   @see imp-3088-excess-fraction-large-s-decay.js (imp-3088: tail K e^{-s})
 *
 *   Ticket: imp-3106 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0 = a*tau_star: sinh(s0) = 1; cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;

// The imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

const S0 = ASINH1;                          // overflow onset ~0.88137
const ONSET_CONSTANT = SQRT2 * (1 - ASINH1);   // imp-3087 pole: phi ~ C/(s-s0)^2, C ~ 0.16776
const TAIL_CONSTANT = 2 * (SQRT2 - ASINH1);    // imp-3088 tail: phi ~ K e^{-s}, K ~ 1.06568

// Composite Simpson (n even). Deterministic; same code path every build.
function simpson(f, a, b, n) {
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * f(a + i * h);
  return (sum * h) / 3;
}

// ONSET MASS I(eps) = int_{s0+eps}^{s0+1} phi ds, computed in the v = 1/(s-s0)
// substitution so the inverse-square integrand becomes a BOUNDED, well-conditioned
// function h(v) = phi(s0 + 1/v)/v^2 -> C as v -> inf (avoids quadrature blow-up at
// the singular lower endpoint). Diverges as eps -> 0; that divergence is the point.
const ONSET_SIMPSON_N = 20000;
function onsetMass(eps) {
  const h = (v) => PHI(S0 + 1 / v) / (v * v);
  return simpson(h, 1, 1 / eps, ONSET_SIMPSON_N);
}
// Exact analytic principal part: int_{s0+eps}^{s0+1} C/(s-s0)^2 ds = C*(1/eps - 1).
const onsetPrincipalPart = (eps) => ONSET_CONSTANT * (1 / eps - 1);

// CONVERGENT TAIL MASS int_S^{inf} phi ds. phi(45) ~ K e^{-45} ~ 1e-19 is below
// machine noise, so 45 is an exact-to-double upper cap for the improper integral.
const TAIL_CAP = 45;
const TAIL_SIMPSON_N = 20000;
const tailMass = (S) => simpson(PHI, S, TAIL_CAP, TAIL_SIMPSON_N);

// Geometric eps-cutoff ladder eps = lower offset from the onset s0.
const EPS_LADDER = Object.freeze([1e-1, 1e-2, 1e-3, 1e-4]);
// Wide S-ladder for the convergent tail mass.
const S_LADDER = Object.freeze([2, 3, 4, 5, 6, 8, 10]);

/**
 * One rung of the onset divergence ladder at lower cutoff eps. Reports the exact
 * numerical mass I(eps), the analytic principal part C*(1/eps - 1), their ratio
 * (-> 1, confirming the divergence rate is exactly C/eps), and the rescaled
 * product eps*I(eps) (-> C from above, pinning the leading constant).
 */
function onsetRung(eps) {
  const mass = onsetMass(eps);
  const principal = onsetPrincipalPart(eps);
  return Object.freeze({
    eps,
    mass,                          // exact int_{s0+eps}^{s0+1} phi ds (diverges as eps -> 0)
    principalPart: principal,      // analytic C*(1/eps - 1)
    ratioToPrincipal: mass / principal,   // -> 1 (divergence rate is the C/eps pole)
    epsTimesMass: eps * mass,      // -> C ~ 0.16776 from above (leading divergence constant)
  });
}

/**
 * One rung of the convergent-tail ladder at lower limit S. Reports the finite
 * mass int_S^{inf} phi ds, the predicted K e^{-S}, and their ratio (-> 1 from above).
 */
function tailRung(S) {
  const mass = tailMass(S);
  const predicted = TAIL_CONSTANT * Math.exp(-S);
  return Object.freeze({
    S,
    mass,                          // exact int_S^{inf} phi ds (finite, decaying)
    predicted,                     // K e^{-S}
    ratio: mass / predicted,       // -> 1 from above (e^{-s} tail decay rate)
  });
}

const ONSET_RUNGS = Object.freeze(EPS_LADDER.map(onsetRung));
const TAIL_RUNGS = Object.freeze(S_LADDER.map(tailRung));

// The fixed, convergent "regular" mass beyond the onset window (s0+1, inf).
const REGULAR_MASS = simpson(PHI, S0 + 1, TAIL_CAP, 40000);

export const IMP3106_EXCESS_FRACTION_INTEGRABILITY = Object.freeze({
  id: 'imp-3106-excess-fraction-integrability',
  ticket: 'imp-3106',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedGrid: 'imp-3064-deficit-excess-fraction-grid.js',
  relatedOnset: 'imp-3087-excess-fraction-onset-divergence.js',
  relatedTail: 'imp-3088-excess-fraction-large-s-decay.js',

  summary:
    'Assesses the integrability of the imp-3064 excess fraction phi(s) = G(s)/F(s) ' +
    'over the admissible overflow range (s0, inf), s0 = arcsinh(1). The integral ' +
    'DIVERGES: the imp-3087 onset pole phi ~ C/(s-s0)^2 (C = sqrt(2)*(1 - arcsinh(1)) ' +
    '~ 0.16776) is non-integrable at s0, so int_{s0+eps}^{s0+1} phi ds ~ C/eps (an ' +
    'eps-cutoff ladder grows ~10x per decade and eps*I(eps) -> C from above). Hence ' +
    'the area-weighted MEAN price of the forced even cosh-completion has NO finite ' +
    'value -- it is unbounded. Away from the onset everything is finite: the imp-3088 ' +
    'tail phi ~ K e^{-s} (K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568) gives a CONVERGENT ' +
    'tail mass int_S^{inf} phi ds ~ K e^{-S}, and the whole regular mass ' +
    'int_{s0+1}^{inf} phi ds ~ 0.2690 is a fixed number. The divergence is localised ' +
    'ENTIRELY at the onset: C/eps overruns the finite 0.2690 remainder by an unbounded ' +
    'factor. DIVERGENCE CHARACTERIZATION, NOT A VALUE; RH-EQUIVALENT; degree-0 scalar ' +
    'measure only; NOT the operator step.',

  onsetDivergence: Object.freeze({
    poleOrder: 2,
    onsetConstant: ONSET_CONSTANT,         // C = sqrt(2)*(1 - arcsinh(1)) ~ 0.16776
    onsetConstantClosedForm: 'sqrt(2)*(1 - arcsinh(1))',
    principalPartExact: 'int_{s0+eps}^{s0+1} C/(s-s0)^2 ds = C*(1/eps - 1) -> +infinity',
    divergenceRate: 'I(eps) = int_{s0+eps}^{s0+1} phi ds ~ C/eps  (eps*I(eps) -> C)',
    decadeGrowthFactor: '~10x per decade of eps (the 1/eps power law)',
    isIntegrableAtOnset: false,
    meanPriceHasFiniteValue: false,
  }),

  convergentTail: Object.freeze({
    tailConstant: TAIL_CONSTANT,           // K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568
    tailConstantClosedForm: '2*(sqrt(2) - arcsinh(1))',
    tailLaw: 'int_S^{inf} phi ds ~ K e^{-S}  (convergent, e^{-s} decay)',
    regularMass: REGULAR_MASS,             // int_{s0+1}^{inf} phi ds ~ 0.2690 (fixed, finite)
    isConvergent: true,
  }),

  whereDivergenceDominates: Object.freeze({
    split: 'int_{s0+eps}^{inf} phi ds = I(eps) [-> infinity] + REGULAR_MASS [~0.2690 finite]',
    localisation: 'entirely the onset neighbourhood (s0, s0+delta); interior + tail are bounded',
    onsetToRegularRatioAtFinestEps: ONSET_RUNGS[ONSET_RUNGS.length - 1].mass / REGULAR_MASS,
    note: 'the divergent C/eps onset mass overruns the fixed finite remainder by an unbounded factor',
  }),

  onsetRungs: ONSET_RUNGS,
  tailRungs: TAIL_RUNGS,

  /* source-of-truth tie: phi at s = 3 equals the imp-3064 headline (a=0.5, U=6) cell */
  imp3064CrossCheck: Object.freeze({
    s: 3,
    phiHere: PHI(3),
    phiHeadline: 0.0739198,
    note: '(a, U) = (0.5, 6) gives s = a*U = 3; phi ~ 0.0739198 must agree with imp-3064',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isDivergenceCharacterizationNotAValue: true,
    operatorStepUntouched:
      'An integrability assessment of the imp-3064 degree-0 scalar ratio; the ' +
      'off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone ' +
      'obstruction and is NOT addressed here.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3106_EXCESS_FRACTION_INTEGRABILITY_ASSERTIONS = [
  {
    id: 'imp3106-onset-constant-closed-form',
    why: 'The divergence rate is set by the imp-3087 onset pole constant ' +
         'C = sqrt(2)*(1 - arcsinh(1)) ~ 0.16776. A drift means the inherited onset ' +
         'asymptotic was mis-imported.',
    holds: () =>
      Math.abs(ONSET_CONSTANT - SQRT2 * (1 - ASINH1)) < 1e-15 &&
      Math.abs(ONSET_CONSTANT - 0.167763082) < 1e-6,
  },
  {
    id: 'imp3106-tail-constant-closed-form',
    why: 'The convergent tail mass decays as K e^{-S} with the imp-3088 constant ' +
         'K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568. A drift means the inherited tail ' +
         'asymptotic was mis-imported.',
    holds: () =>
      Math.abs(TAIL_CONSTANT - 2 * (SQRT2 - ASINH1)) < 1e-15 &&
      Math.abs(TAIL_CONSTANT - 1.0656799507) < 1e-9,
  },
  {
    id: 'imp3106-onset-integral-diverges',
    why: 'The integral is non-integrable at s0: the onset mass I(eps) must increase ' +
         'strictly as eps -> 0 and blow up. The EPS_LADDER is decreasing, so each rung ' +
         'mass must exceed the previous; the finest (eps=1e-4) already exceeds 1500.',
    holds: () => {
      for (let i = 1; i < ONSET_RUNGS.length; i++) {
        if (!(ONSET_RUNGS[i].mass > ONSET_RUNGS[i - 1].mass)) return false;
      }
      return ONSET_RUNGS[ONSET_RUNGS.length - 1].mass > 1500;
    },
  },
  {
    id: 'imp3106-divergence-rate-is-C-over-eps',
    why: 'The divergence rate is exactly the C/eps power law: eps*I(eps) -> C ~ 0.16776 ' +
         'from above (monotone decreasing toward C, every rung above it), and the finest ' +
         'rung is within 1% of C. This is the inverse-square pole integrated once.',
    holds: () => {
      for (let i = 1; i < ONSET_RUNGS.length; i++) {
        if (!(ONSET_RUNGS[i].epsTimesMass < ONSET_RUNGS[i - 1].epsTimesMass)) return false;
        if (!(ONSET_RUNGS[i].epsTimesMass > ONSET_CONSTANT)) return false;
      }
      const finest = ONSET_RUNGS[ONSET_RUNGS.length - 1];
      return Math.abs(finest.epsTimesMass - ONSET_CONSTANT) < 0.01 * ONSET_CONSTANT;
    },
  },
  {
    id: 'imp3106-power-law-not-faster-decade-signature',
    why: 'A 1/eps power law (the integrated inverse-square pole) grows ~10x per decade ' +
         'of eps, NOT the ~100x of the integrand itself: a faster divergence would falsify ' +
         'the pole order. Consecutive ladder masses (eps shrinking 10x) must scale by a ' +
         'factor in (6, 11), approaching 10 as the principal part dominates.',
    holds: () => {
      for (let i = 1; i < ONSET_RUNGS.length; i++) {
        const factor = ONSET_RUNGS[i].mass / ONSET_RUNGS[i - 1].mass;   // eps down 10x
        if (!(factor > 6 && factor < 11)) return false;
      }
      // last (cleanest) decade must sit closest to 10
      const last = ONSET_RUNGS[ONSET_RUNGS.length - 1].mass / ONSET_RUNGS[ONSET_RUNGS.length - 2].mass;
      return last > 9 && last < 10;
    },
  },
  {
    id: 'imp3106-numerical-mass-tracks-analytic-principal-part',
    why: 'The exact numerical onset mass must converge onto the analytic principal part ' +
         'C*(1/eps - 1): the ratio I(eps)/[C*(1/eps-1)] -> 1, confirming the full integrand ' +
         'inherits the inverse-square pole and the subleading log correction is lower order. ' +
         'Within 1% at eps=1e-4.',
    holds: () => {
      const finest = ONSET_RUNGS[ONSET_RUNGS.length - 1];
      return Math.abs(finest.ratioToPrincipal - 1) < 0.01 && finest.ratioToPrincipal > 1;
    },
  },
  {
    id: 'imp3106-tail-mass-finite-and-decays',
    why: 'Away from the onset the integral is convergent: the tail mass int_S^{inf} phi ds ' +
         'must be finite, strictly decreasing in S, and track K e^{-S} from above with the ' +
         'ratio -> 1 (within 1e-3 at S=10). This is the e^{-s} decay end.',
    holds: () => {
      for (let i = 1; i < TAIL_RUNGS.length; i++) {
        if (!(TAIL_RUNGS[i].mass < TAIL_RUNGS[i - 1].mass)) return false;
      }
      const deepest = TAIL_RUNGS[TAIL_RUNGS.length - 1];
      return deepest.S === 10 &&
        deepest.mass > 0 && deepest.mass < 1e-4 &&
        deepest.ratio > 1 && Math.abs(deepest.ratio - 1) < 1e-3;
    },
  },
  {
    id: 'imp3106-regular-mass-finite-and-bounded',
    why: 'The whole mass beyond the onset window, int_{s0+1}^{inf} phi ds, is a fixed ' +
         'convergent number ~0.2690 -- the bounded part the divergence is measured against. ' +
         'If this were large or infinite the onset would not be the sole divergent source.',
    holds: () =>
      REGULAR_MASS > 0.26 && REGULAR_MASS < 0.28 &&
      Math.abs(REGULAR_MASS - 0.2690060) < 1e-4,
  },
  {
    id: 'imp3106-divergence-localised-at-onset',
    why: 'The divergence is localised ENTIRELY at the onset: at the finest cutoff the ' +
         'onset mass I(1e-4) overruns the fixed finite regular mass ~0.2690 by a factor of ' +
         'thousands (and unboundedly as eps -> 0), so the unbounded mean price lives in an ' +
         'arbitrarily thin onset sliver while interior + tail stay bounded.',
    holds: () => {
      const ratio = IMP3106_EXCESS_FRACTION_INTEGRABILITY.whereDivergenceDominates.onsetToRegularRatioAtFinestEps;
      return ratio > 3000;
    },
  },
  {
    id: 'imp3106-matches-imp3064-headline',
    why: 'Source-of-truth tie: s = 3 corresponds to the imp-3064 headline cell (a=0.5, U=6), ' +
         'so phi(3) computed here must equal the imp-3064 excess fraction ~0.0739198. A mismatch ' +
         'means the reduced F/G drifted from the established grid.',
    holds: () => {
      const x = IMP3106_EXCESS_FRACTION_INTEGRABILITY.imp3064CrossCheck;
      return Math.abs(x.phiHere - x.phiHeadline) < 1e-6;
    },
  },
  {
    id: 'imp3106-honest-divergence-not-a-value',
    why: 'Mandatory honesty: this is a DIVERGENCE CHARACTERIZATION (no finite mean to report), ' +
         'RH-EQUIVALENT, structural/diagnostic, leaves the operator step untouched, is not a ' +
         'proof, not a reduction below RH, and PT 0.2 stays SOTA. If any of these flip the ' +
         'module is over-claiming.',
    holds: () => {
      const c = IMP3106_EXCESS_FRACTION_INTEGRABILITY.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.isDivergenceCharacterizationNotAValue === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3106_EXCESS_FRACTION_INTEGRABILITY_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3106-excess-fraction-integrability assertion failed: ${a.id}`);
}

export default IMP3106_EXCESS_FRACTION_INTEGRABILITY;
