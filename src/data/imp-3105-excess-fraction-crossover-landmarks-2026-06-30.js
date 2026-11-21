/**
 * @module imp-3105-excess-fraction-crossover-landmarks-2026-06-30
 * @fileoverview imp-3105 -- Locate the interior LANDMARK scales of the imp-3064
 *   excess fraction phi(s) = G(s)/F(s) between the two asymptotic extremes that
 *   imp-3087 (onset pole) and imp-3088 (large-s decay) pinned only at the ends.
 *
 *   THE SETUP (inherited from imp-3064 / imp-3087 / imp-3088)
 *   --------------------------------------------------------
 *   On the admissible overflow range s = a*U > s0 = arcsinh(1) the degree-0
 *   deficit/excess masses reduce to the single product s = a*U:
 *       F(s) = cosh(s) - sqrt(2) - s + arcsinh(1)   (= a * D_raw)
 *       G(s) = sqrt(2) - arcsinh(1) - e^{-s}        (= a * E)
 *       phi(s) = G(s) / F(s)                        (the excess fraction)
 *   imp-3087 pinned the s -> s0+ ONSET: phi ~ C/(s - s0)^2 with the quadratic-pole
 *   constant C = sqrt(2)*(1 - arcsinh(1)) ~ 0.16776 (F has a DOUBLE zero at s0).
 *   imp-3088 pinned the s -> inf DECAY: phi ~ K e^{-s} with K = 2*(sqrt(2) -
 *   arcsinh(1)) ~ 1.06568. Both describe the EXTREMES; the interior of (s0, inf)
 *   -- where phi falls monotonically from +infinity to 0 -- had no located scale.
 *
 *   WHAT THIS MODULE ADDS (the imp-3105 deliverable)
 *   ------------------------------------------------
 *   Three interior landmark measurements, each verified against the exact F, G.
 *
 *   (1) ENVELOPE CROSSOVER  C/(s - s0)^2 = K e^{-s}.
 *       The two asymptotic ENVELOPES (onset pole vs large-s decay) are equal where
 *       C/(s - s0)^2 = K e^{-s}. This is NOT a single point: the algebraic envelope
 *       C/(s - s0)^2 decays polynomially while K e^{-s} decays exponentially, so the
 *       difference H(s) = C/(s - s0)^2 - K e^{-s} crosses zero TWICE on (s0, inf):
 *         - the PHYSICAL regime handoff at s_cross1 ~ 1.91504 (the pole envelope,
 *           an overestimate near onset, drops below the decay envelope), and
 *         - an algebraic-vs-exponential RE-crossing at s_cross2 ~ 4.31751, where the
 *           (no-longer-valid) algebraic envelope tail rises back above the exponential.
 *       We report BOTH and flag s_cross1 as the meaningful onset->decay handoff. Note
 *       that at s_cross1 neither asymptotic is yet exact, so the true phi(s_cross1) ~
 *       0.37817 differs from the common envelope value 0.15701 -- an HONEST gap, since
 *       a crossing of two ROUGH envelopes is not a crossing of the exact curve.
 *
 *   (2) phi(s) = 1  (the cosh-completion price equals the kinked-cover mass).
 *       phi falls strictly monotonically from +infinity (onset) to 0 (infinity), so
 *       there is a UNIQUE s* with phi(s*) = 1, i.e. G(s*) = F(s*). A bracketed root
 *       find on the exact F, G gives s* ~ 1.48895, where F = G ~ 0.30723. No closed
 *       form: G = F reduces to cosh(s) + e^{-s} - 2 sqrt(2) - s + 2 arcsinh(1) = 0,
 *       a transcendental equation. s* is the scale at and below which the forced even
 *       cosh-completion costs at least as much as the entire minimal kinked cover.
 *
 *   (3) STEEPEST TRANSITION  max |d log phi / ds|.
 *       The exact log-slope is
 *           dlog_phi/ds = e^{-s}/G(s) - (sinh(s) - 1)/F(s).
 *       As s -> s0+ the second term ~ -2/(s - s0) (the imp-3087 double zero) drives
 *       dlog_phi/ds -> -infinity; as s -> inf, F ~ e^s/2 gives (sinh - 1)/F -> 1 and
 *       e^{-s}/G -> 0, so dlog_phi/ds -> -1. The slope rises MONOTONICALLY from
 *       -infinity to -1, so |dlog_phi/ds| is monotone DECREASING with NO finite
 *       interior maximizer: the steepest transition is the onset boundary itself
 *       (the imp-3087 pole), not an interior point. We report this honestly rather
 *       than fabricate an interior argmax, and tabulate the slope at the landmarks.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DEGREE-0 SCALAR MEASURE ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. These are
 *   interior landmark scales of the imp-3064 scalar ratio; they neither prove nor
 *   weaken RH. The off-diagonal endpoint-Hankel operator step (imp-3066) remains the
 *   lone obstruction and is untouched. Measure only, no QED. No refereed bound is changed.
 *
 *   @see imp-3064-deficit-excess-fraction-grid.js (the a*U scale invariant + phi)
 *   @see imp-3087-excess-fraction-onset-divergence.js (onset pole C/(s-s0)^2)
 *   @see imp-3088-excess-fraction-large-s-decay.js (large-s decay K e^{-s})
 *
 *   Ticket: imp-3105 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0 = a*tau_star: sinh(s0) = 1; cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;

// The imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

const S0 = ASINH1;                          // overflow onset ~0.88137
const C_POLE = SQRT2 * (1 - ASINH1);        // imp-3087 onset-pole constant ~0.16776
const K_DECAY = 2 * (SQRT2 - ASINH1);       // imp-3088 large-s decay constant ~1.06568

// Exact log-derivative dlog_phi/ds = G_prime/G - F_prime/F, with G_prime = e^{-s},
// F_prime = sinh(s) - 1. (No comment-close glyphs: written as G_prime, F_prime.)
const DLOG_PHI = (s) => Math.exp(-s) / G(s) - (Math.sinh(s) - 1) / F(s);

// Onset-pole envelope and large-s decay envelope (the two imp-3087/imp-3088 forms).
const ENV_POLE = (s) => C_POLE / ((s - S0) * (s - S0));
const ENV_DECAY = (s) => K_DECAY * Math.exp(-s);

/** Plain bisection root-find on a sign-changing f over [a, b] (a, b bracket a root). */
function bisect(f, a, b) {
  let fa = f(a);
  let lo = a;
  let hi = b;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    const fm = f(mid);
    if (Math.sign(fm) === Math.sign(fa)) { lo = mid; fa = fm; } else { hi = mid; }
  }
  return 0.5 * (lo + hi);
}

// (1) Envelope crossover H(s) = ENV_POLE(s) - ENV_DECAY(s) = 0. Two roots on (s0, inf):
// the physical handoff and the algebraic-vs-exponential re-crossing.
const H_ENV = (s) => ENV_POLE(s) - ENV_DECAY(s);
const S_CROSS1 = bisect(H_ENV, 1.91, 1.92);   // physical onset->decay handoff
const S_CROSS2 = bisect(H_ENV, 4.31, 4.32);   // algebraic-vs-exponential re-crossing

// (2) phi(s) = 1, i.e. G(s) - F(s) = 0. Unique on (s0, inf) (phi strictly decreasing).
const S_PHI1 = bisect((s) => G(s) - F(s), S0 + 1e-6, S0 + 5);

function landmark(label, s) {
  return Object.freeze({
    label,
    s,
    phi: PHI(s),
    F: F(s),
    G: G(s),
    dlogPhi: DLOG_PHI(s),       // exact log-slope at the landmark
    envPole: ENV_POLE(s),
    envDecay: ENV_DECAY(s),
  });
}

const LANDMARKS = Object.freeze([
  landmark('envelope-crossover-handoff', S_CROSS1),
  landmark('envelope-crossover-recross', S_CROSS2),
  landmark('phi-equals-one', S_PHI1),
]);

export const IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS = Object.freeze({
  id: 'imp-3105-excess-fraction-crossover-landmarks-2026-06-30',
  ticket: 'imp-3105',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedGrid: 'imp-3064-deficit-excess-fraction-grid.js',

  summary:
    'Locates the INTERIOR landmark scales of the imp-3064 excess fraction phi(s) = ' +
    'G(s)/F(s) between the imp-3087 onset pole (C/(s-s0)^2, C ~ 0.16776) and the ' +
    'imp-3088 large-s decay (K e^{-s}, K ~ 1.06568). (1) The two asymptotic ENVELOPES ' +
    'C/(s-s0)^2 and K e^{-s} cross TWICE: the physical onset->decay handoff at s ~ ' +
    '1.91504 and an algebraic-vs-exponential re-crossing at s ~ 4.31751 (at the handoff ' +
    'the exact phi ~ 0.37817 differs from the common envelope value 0.15701, since ' +
    'neither asymptotic is yet exact). (2) phi(s) = 1 -- the forced even cosh-completion ' +
    'price equals the kinked-cover mass -- at the UNIQUE s* ~ 1.48895 where F = G ~ ' +
    '0.30723 (transcendental, no closed form). (3) The steepest transition max ' +
    '|dlog_phi/ds| has NO finite interior maximizer: the slope rises monotonically from ' +
    '-infinity at the onset (the imp-3087 double zero, ~ -2/(s-s0)) to -1 at infinity, ' +
    'so |dlog_phi/ds| is monotone decreasing and the steepest point IS the onset boundary. ' +
    'RH-EQUIVALENT; degree-0 scalar measure only; NOT the operator step.',

  constants: Object.freeze({
    s0: S0,                       // arcsinh(1) ~ 0.88137 (overflow onset)
    onsetPoleConstant: C_POLE,    // imp-3087 C = sqrt(2)*(1 - arcsinh(1)) ~ 0.16776
    largeSDecayConstant: K_DECAY, // imp-3088 K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568
  }),

  envelopeCrossover: Object.freeze({
    equation: 'C/(s - s0)^2 = K e^{-s}',
    isUnique: false,
    rootCount: 2,
    handoff: Object.freeze({
      s: S_CROSS1,                          // ~1.91504 (physical onset->decay handoff)
      envelopeValue: ENV_POLE(S_CROSS1),    // common envelope value ~0.15701
      exactPhi: PHI(S_CROSS1),              // ~0.37817 (true curve, not on either envelope)
      note: 'the meaningful regime handoff; exact phi differs from the envelope value because neither asymptotic is exact here',
    }),
    recross: Object.freeze({
      s: S_CROSS2,                          // ~4.31751 (algebraic tail re-crosses exponential)
      envelopeValue: ENV_POLE(S_CROSS2),    // ~0.01421
      exactPhi: PHI(S_CROSS2),              // ~0.01591
      note: 'algebraic-vs-exponential re-crossing; the pole envelope is invalid here, so this is a comparison artifact not a regime boundary',
    }),
  }),

  phiEqualsOne: Object.freeze({
    s: S_PHI1,                              // ~1.48895
    phi: PHI(S_PHI1),                       // = 1 to machine precision
    Fvalue: F(S_PHI1),                      // = G = ~0.30723 at the crossing
    Gvalue: G(S_PHI1),
    isUnique: true,
    hasClosedForm: false,
    transcendentalForm: 'cosh(s) + e^{-s} - 2 sqrt(2) - s + 2 arcsinh(1) = 0',
    meaning: 'scale at/below which the forced even cosh-completion costs at least as much as the entire minimal kinked cover',
  }),

  steepestTransition: Object.freeze({
    quantity: 'max |dlog_phi/ds| over (s0, inf)',
    exactSlope: 'dlog_phi/ds = e^{-s}/G(s) - (sinh(s) - 1)/F(s)',
    slopeAtOnsetLimit: '-infinity (~ -2/(s - s0); the imp-3087 double zero)',
    slopeAtInfinityLimit: -1,
    slopeIsMonotoneIncreasing: true,        // rises from -inf to -1
    hasFiniteInteriorMaximizer: false,      // |dlog_phi/ds| monotone decreasing
    location: 'the steepest transition is the onset boundary s -> s0+, not an interior point',
    dlogAtPhiEqualsOne: DLOG_PHI(S_PHI1),   // ~ -2.857
    dlogAtHandoff: DLOG_PHI(S_CROSS1),      // ~ -1.894
  }),

  landmarks: LANDMARKS,

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'Interior landmark scales of the imp-3064 degree-0 scalar ratio; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction and is NOT ' +
      'addressed here.',
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS_ASSERTIONS = [
  {
    id: 'imp3105-inherited-constants-match-imp3087-imp3088',
    why: 'The landmarks are anchored to the imp-3087 onset constant C = sqrt(2)*(1 - arcsinh(1)) ' +
         'and the imp-3088 decay constant K = 2*(sqrt(2) - arcsinh(1)); a drift means the ' +
         'inherited closed forms were mis-copied.',
    holds: () =>
      Math.abs(C_POLE - 0.167763082) < 1e-6 &&
      Math.abs(K_DECAY - 1.065679951) < 1e-6 &&
      Math.abs(S0 - 0.881373587) < 1e-6,
  },
  {
    id: 'imp3105-envelope-handoff-is-a-true-root',
    why: 'At the handoff s_cross1 the two envelopes must be EQUAL: C/(s-s0)^2 = K e^{-s}. The ' +
         'root must sit in (s0, 3) and the envelope difference must vanish there.',
    holds: () =>
      S_CROSS1 > S0 && S_CROSS1 < 3 &&
      Math.abs(ENV_POLE(S_CROSS1) - ENV_DECAY(S_CROSS1)) < 1e-12 &&
      Math.abs(S_CROSS1 - 1.915040236) < 1e-6,
  },
  {
    id: 'imp3105-envelope-crossing-is-not-unique',
    why: 'The algebraic pole envelope decays polynomially and the decay envelope exponentially, ' +
         'so they cross TWICE on (s0, inf): the handoff ~1.915 AND a re-crossing ~4.318. The ' +
         'second root must also zero the envelope difference and lie beyond the first.',
    holds: () =>
      S_CROSS2 > S_CROSS1 &&
      Math.abs(ENV_POLE(S_CROSS2) - ENV_DECAY(S_CROSS2)) < 1e-12 &&
      Math.abs(S_CROSS2 - 4.317512336) < 1e-6 &&
      IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS.envelopeCrossover.isUnique === false,
  },
  {
    id: 'imp3105-handoff-exact-phi-differs-from-envelope',
    why: 'HONESTY: a crossing of two ROUGH envelopes is not a crossing of the exact curve. At the ' +
         'handoff the true phi ~ 0.378 must differ materially from the common envelope value ~0.157, ' +
         'so the module must not pretend the envelope value is phi there.',
    holds: () =>
      Math.abs(PHI(S_CROSS1) - 0.378169963) < 1e-6 &&
      PHI(S_CROSS1) > 2 * ENV_POLE(S_CROSS1),
  },
  {
    id: 'imp3105-phi-equals-one-root-FG-coincide',
    why: 'phi(s*) = 1 means G(s*) = F(s*) exactly; the bracketed root must give phi = 1 to machine ' +
         'precision with F and G coinciding at ~0.30723, located near s* ~ 1.48895.',
    holds: () =>
      Math.abs(PHI(S_PHI1) - 1) < 1e-12 &&
      Math.abs(F(S_PHI1) - G(S_PHI1)) < 1e-12 &&
      Math.abs(S_PHI1 - 1.488945799) < 1e-6 &&
      Math.abs(F(S_PHI1) - 0.307229606) < 1e-6,
  },
  {
    id: 'imp3105-phi-strictly-decreasing-so-phi1-root-unique',
    why: 'The uniqueness of the phi = 1 root rests on phi being strictly decreasing on (s0, inf); ' +
         'sample a coarse ladder and confirm phi drops monotonically and straddles 1 around s*.',
    holds: () => {
      const ladder = [1.0, 1.25, 1.488945799, 1.75, 2.5, 4.0];
      for (let i = 1; i < ladder.length; i++) {
        if (!(PHI(ladder[i]) < PHI(ladder[i - 1]))) return false;
      }
      return PHI(1.0) > 1 && PHI(2.5) < 1;
    },
  },
  {
    id: 'imp3105-steepest-transition-has-no-interior-maximizer',
    why: 'The log-slope dlog_phi/ds rises MONOTONICALLY from -infinity (onset double zero) to -1 ' +
         '(large s), so |dlog_phi/ds| is monotone decreasing with NO interior argmax: the steepest ' +
         'transition is the onset boundary. A coarse ladder must show the slope strictly increasing ' +
         'toward -1 and the recorded flags must say so.',
    holds: () => {
      const ladder = [0.95, 1.1, 1.5, 2, 3, 5, 8];
      for (let i = 1; i < ladder.length; i++) {
        if (!(DLOG_PHI(ladder[i]) > DLOG_PHI(ladder[i - 1]))) return false;   // rising toward -1
      }
      const st = IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS.steepestTransition;
      return DLOG_PHI(8) < 0 && DLOG_PHI(8) > -1.01 &&
        st.hasFiniteInteriorMaximizer === false &&
        st.slopeIsMonotoneIncreasing === true;
    },
  },
  {
    id: 'imp3105-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: the landmarks are RH-EQUIVALENT, structural/diagnostic, leave the ' +
         'operator step untouched, are not a proof, not a reduction below RH, and no refereed bound is changed. ' +
         'If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3105-excess-fraction-crossover-landmarks assertion failed: ${a.id}`);
}

export default IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS;
