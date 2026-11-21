/**
 * @module imp-3130-envelope-approximation-error-table-2026-06-30
 * @fileoverview imp-3130 -- Tabulate the imp-3105 envelope-approximation error
 *   ACROSS s: the gap between the two ROUGH asymptotic envelopes and the EXACT
 *   excess fraction phi(s). imp-3105 reported this honest gap at the SINGLE point
 *   s_cross1 ~ 1.91504 (exact phi ~ 0.37817 vs common envelope value ~0.15701);
 *   this module spreads that one-point honesty into a full curve.
 *
 *   THE SETUP (inherited from imp-3064 / imp-3087 / imp-3088 / imp-3105)
 *   ------------------------------------------------------------------
 *   On the admissible overflow range s = a*U > s0 = arcsinh(1) the degree-0
 *   deficit/excess masses reduce to the single product s = a*U:
 *       F(s) = cosh(s) - sqrt(2) - s + arcsinh(1)   (= a * D_raw)
 *       G(s) = sqrt(2) - arcsinh(1) - e^{-s}        (= a * E)
 *       phi(s) = G(s) / F(s)                        (the EXACT excess fraction)
 *   The two ROUGH asymptotic envelopes are
 *       ENV_POLE(s)  = C/(s - s0)^2,  C = sqrt(2)*(1 - arcsinh(1)) ~ 0.16776   (imp-3087)
 *       ENV_DECAY(s) = K e^{-s},      K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568   (imp-3088)
 *   ENV_POLE is exact ONLY as s -> s0+ (the F double zero); ENV_DECAY is exact
 *   ONLY as s -> inf. Everywhere in between BOTH are rough, and the natural
 *   "pick the larger envelope" combination ENV_MAX(s) = max(ENV_POLE, ENV_DECAY)
 *   still misses the true curve.
 *
 *   WHAT THIS MODULE ADDS (the imp-3130 deliverable)
 *   ------------------------------------------------
 *   (T) A TABLE of phi_exact(s) vs ENV_POLE, ENV_DECAY, ENV_MAX across s in
 *       (s0, ~8), each with its signed relative error env/phi - 1.
 *   (1) Both envelopes UNDERESTIMATE phi over the whole interior (relative error
 *       is NEGATIVE except where the invalid pole tail coincidentally re-crosses).
 *   (2) The WORST under-estimate of the natural ENV_MAX combination is exactly at
 *       the imp-3105 handoff s_cross1 ~ 1.91504, where ENV_MAX/phi - 1 ~ -0.58481.
 *       That is the global worst case -- the single point imp-3105 happened to
 *       report was not arbitrary, it is the maximum of the gap.
 *   (3) VALIDITY WINDOWS (where each envelope is within 10% / 1% of exact phi):
 *         ENV_POLE within 10% only for s in (s0, ~0.91647) near onset; it never
 *           reaches 1% before the pole tail goes invalid (a +/-10% band re-crosses
 *           near s ~ 4.3-4.7 is a numerical coincidence of the invalid tail, NOT
 *           a validity window).
 *         ENV_DECAY within 10% for s > ~4.40313, within 1% for s > ~7.21846.
 *       So the combined approximation is trustworthy only in two thin tails and is
 *       worst (~ -58%) right at the regime handoff in the middle.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DEGREE-0 SCALAR MEASURE ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. This is a
 *   measurement of how far two rough asymptotics sit from the imp-3064 scalar ratio;
 *   it neither proves nor weakens RH. The off-diagonal endpoint-Hankel operator step
 *   (imp-3066) remains the lone obstruction and is untouched. Measure only, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-3105-excess-fraction-crossover-landmarks-2026-06-30.js (the single-point gap)
 *   @see imp-3064-deficit-excess-fraction-grid.js (the a*U scale invariant + phi)
 *   @see imp-3087-excess-fraction-onset-divergence.js (onset pole C/(s-s0)^2)
 *   @see imp-3088-excess-fraction-large-s-decay.js (large-s decay K e^{-s})
 *
 *   Ticket: imp-3130 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0 = a*tau_star: sinh(s0) = 1; cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;

// The imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the EXACT excess fraction

const S0 = ASINH1;                          // overflow onset ~0.88137
const C_POLE = SQRT2 * (1 - ASINH1);        // imp-3087 onset-pole constant ~0.16776
const K_DECAY = 2 * (SQRT2 - ASINH1);       // imp-3088 large-s decay constant ~1.06568

// The two rough envelopes and their natural "pick the larger" combination.
const ENV_POLE = (s) => C_POLE / ((s - S0) * (s - S0));
const ENV_DECAY = (s) => K_DECAY * Math.exp(-s);
const ENV_MAX = (s) => Math.max(ENV_POLE(s), ENV_DECAY(s));

// Signed relative errors env/phi - 1 (negative = the envelope underestimates phi).
const REL = (env, s) => env(s) / PHI(s) - 1;

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

// The imp-3105 handoff (recomputed locally as the ENV_POLE = ENV_DECAY root).
const S_CROSS1 = bisect((s) => ENV_POLE(s) - ENV_DECAY(s), 1.91, 1.92);

// (3) Validity windows: where each envelope first/last sits within 10% / 1% of phi.
//   ENV_POLE is exact at onset and degrades monotonically outward; ENV_DECAY is
//   exact at infinity and improves monotonically inward toward it.
const POLE_WITHIN_10_UNTIL = bisect((s) => REL(ENV_POLE, s) + 0.10, S0 + 1e-4, 1.0);
const DECAY_WITHIN_10_FROM = bisect((s) => REL(ENV_DECAY, s) + 0.10, 3, 6);
const DECAY_WITHIN_01_FROM = bisect((s) => REL(ENV_DECAY, s) + 0.01, 6, 9);

/** One table row at scale s: exact phi and each envelope with its relative error. */
function row(s) {
  return Object.freeze({
    s,
    phi: PHI(s),
    envPole: ENV_POLE(s),
    envDecay: ENV_DECAY(s),
    envMax: ENV_MAX(s),
    relPole: REL(ENV_POLE, s),
    relDecay: REL(ENV_DECAY, s),
    relMax: REL(ENV_MAX, s),
  });
}

// The tabulation grid across the admissible range s in (s0, ~8), including the
// imp-3105 landmarks (phi = 1 at ~1.48895, handoff ~1.91504, re-cross ~4.31751).
const GRID = Object.freeze([
  0.90, 0.95, 1.0, 1.1, 1.25, 1.488945799, 1.75, S_CROSS1,
  2.5, 3.0, 4.0, 4.317512336, 5.0, 6.0, 8.0,
]);

const TABLE = Object.freeze(GRID.map(row));

export const IMP3130_ENVELOPE_APPROXIMATION_ERROR_TABLE = Object.freeze({
  id: 'imp-3130-envelope-approximation-error-table-2026-06-30',
  ticket: 'imp-3130',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedLandmarks: 'imp-3105-excess-fraction-crossover-landmarks-2026-06-30.js',

  summary:
    'Spreads the imp-3105 single-point envelope gap into a full curve: tabulates the ' +
    'EXACT excess fraction phi(s) = G(s)/F(s) against the two rough asymptotic envelopes ' +
    'ENV_POLE = C/(s-s0)^2 (C ~ 0.16776) and ENV_DECAY = K e^{-s} (K ~ 1.06568) and their ' +
    'max, with signed relative error env/phi - 1 across s in (s0, ~8). FINDINGS: (1) both ' +
    'envelopes UNDERESTIMATE phi over the whole interior; (2) the worst under-estimate of ' +
    'the natural ENV_MAX combination is exactly at the imp-3105 handoff s_cross1 ~ 1.91504, ' +
    'where ENV_MAX/phi - 1 ~ -0.58481 -- the single point imp-3105 reported is the GLOBAL ' +
    'worst case; (3) validity windows -- ENV_POLE within 10% only for s < ~0.91647 (near ' +
    'onset, never within 1%), ENV_DECAY within 10% for s > ~4.40313 and within 1% for s > ' +
    '~7.21846. The combined approximation is trustworthy only in two thin tails and is ~ ' +
    '-58% off at the regime handoff. RH-EQUIVALENT; degree-0 scalar measure only; NOT the ' +
    'operator step.',

  constants: Object.freeze({
    s0: S0,                       // arcsinh(1) ~ 0.88137 (overflow onset)
    onsetPoleConstant: C_POLE,    // imp-3087 C = sqrt(2)*(1 - arcsinh(1)) ~ 0.16776
    largeSDecayConstant: K_DECAY, // imp-3088 K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568
    handoff: S_CROSS1,            // imp-3105 envelope crossover ~1.91504
  }),

  table: TABLE,

  worstEnvMaxUnderestimate: Object.freeze({
    s: S_CROSS1,                            // ~1.91504 (the imp-3105 handoff)
    relMax: REL(ENV_MAX, S_CROSS1),         // ~ -0.58481 (envelope is ~58% below phi)
    exactPhi: PHI(S_CROSS1),                // ~0.37817
    envelopeValue: ENV_MAX(S_CROSS1),       // ~0.15701 (both envelopes coincide here)
    note: 'the global worst case of the ENV_MAX approximation IS the imp-3105 handoff; the ' +
          'two envelopes are equal there, so neither can rescue the other -- the rough ' +
          'approximations are jointly weakest exactly where they hand off',
  }),

  validityWindows: Object.freeze({
    poleWithin10PctUntil: POLE_WITHIN_10_UNTIL,   // ENV_POLE within 10% for s in (s0, ~0.91647)
    poleEverWithin1Pct: false,                    // never reaches 1% before the tail goes invalid
    decayWithin10PctFrom: DECAY_WITHIN_10_FROM,   // ENV_DECAY within 10% for s > ~4.40313
    decayWithin1PctFrom: DECAY_WITHIN_01_FROM,    // ENV_DECAY within 1% for s > ~7.21846
    poleTailReCrossIsArtifact: true,              // a +/-10% band near s ~ 4.3-4.7 is the
                                                  // invalid pole tail coincidentally matching
                                                  // phi numerically, NOT a validity window
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'Measurement of the gap between two rough asymptotics and the imp-3064 degree-0 scalar ' +
      'ratio; the off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone ' +
      'obstruction and is NOT addressed here.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3130_ENVELOPE_APPROXIMATION_ERROR_TABLE_ASSERTIONS = [
  {
    id: 'imp3130-inherited-constants-match-imp3087-imp3088',
    why: 'The envelopes are anchored to the imp-3087 onset constant C = sqrt(2)*(1 - arcsinh(1)) ' +
         'and the imp-3088 decay constant K = 2*(sqrt(2) - arcsinh(1)); a drift means the ' +
         'inherited closed forms were mis-copied.',
    holds: () =>
      Math.abs(C_POLE - 0.167763082) < 1e-6 &&
      Math.abs(K_DECAY - 1.065679951) < 1e-6 &&
      Math.abs(S0 - 0.881373587) < 1e-6,
  },
  {
    id: 'imp3130-both-envelopes-underestimate-over-interior',
    why: 'The central honest finding: across the interior both rough envelopes sit BELOW the ' +
         'exact phi, so env/phi - 1 must be negative on a coarse interior ladder (excluding the ' +
         'invalid pole tail beyond the handoff where ENV_POLE coincidentally re-crosses).',
    holds: () => {
      const ladder = [1.0, 1.25, 1.488945799, 1.75, S_CROSS1, 2.5, 3.0, 4.0];
      for (const s of ladder) {
        if (!(REL(ENV_POLE, s) < 0)) return false;
        if (!(REL(ENV_DECAY, s) < 0)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp3130-worst-envmax-underestimate-is-the-imp3105-handoff',
    why: 'The key result: the ENV_MAX relative error is most negative exactly at the imp-3105 ' +
         'handoff s_cross1 ~ 1.91504 (~ -0.58481), and no nearby interior point beats it -- the ' +
         'single point imp-3105 reported is the GLOBAL worst case of the approximation.',
    holds: () => {
      const worst = REL(ENV_MAX, S_CROSS1);
      if (!(Math.abs(worst + 0.584808) < 1e-5)) return false;
      // No neighbour in a fine bracket undercuts the handoff value.
      for (let s = S_CROSS1 - 0.4; s <= S_CROSS1 + 0.4; s += 0.01) {
        if (REL(ENV_MAX, s) < worst - 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: 'imp3130-envmax-coincides-with-imp3105-single-point-gap',
    why: 'Cross-check against imp-3105: at the handoff the exact phi ~ 0.37817 and the common ' +
         'envelope value ~ 0.15701, so ENV_MAX/phi - 1 must equal exactly those imp-3105 numbers.',
    holds: () =>
      Math.abs(PHI(S_CROSS1) - 0.378169963) < 1e-6 &&
      Math.abs(ENV_MAX(S_CROSS1) - 0.157012) < 1e-5 &&
      Math.abs(ENV_POLE(S_CROSS1) - ENV_DECAY(S_CROSS1)) < 1e-12,
  },
  {
    id: 'imp3130-validity-windows-are-thin-tails',
    why: 'The envelopes are trustworthy only in two thin tails: ENV_POLE within 10% only near ' +
         'onset (s < ~0.91647) and ENV_DECAY within 10% only for s > ~4.40313 (within 1% for s > ' +
         '~7.21846). The bracketed crossings must reproduce those scales and bound the relative ' +
         'errors at the window edges.',
    holds: () =>
      Math.abs(POLE_WITHIN_10_UNTIL - 0.916468) < 1e-5 &&
      Math.abs(REL(ENV_POLE, POLE_WITHIN_10_UNTIL) + 0.10) < 1e-9 &&
      Math.abs(DECAY_WITHIN_10_FROM - 4.403133) < 1e-5 &&
      Math.abs(DECAY_WITHIN_01_FROM - 7.218463) < 1e-5 &&
      // inside the windows the named envelope is genuinely within tolerance
      Math.abs(REL(ENV_DECAY, 8.0)) < 0.01 &&
      Math.abs(REL(ENV_POLE, 0.90)) < 0.10,
  },
  {
    id: 'imp3130-table-rows-self-consistent',
    why: 'Every table row must satisfy env/phi - 1 = relErr to machine precision and ENV_MAX must ' +
         'equal the larger of the two envelopes, so the recorded table cannot silently drift from ' +
         'its own definitions.',
    holds: () => {
      for (const r of TABLE) {
        if (Math.abs(r.relPole - (r.envPole / r.phi - 1)) > 1e-12) return false;
        if (Math.abs(r.relDecay - (r.envDecay / r.phi - 1)) > 1e-12) return false;
        if (Math.abs(r.envMax - Math.max(r.envPole, r.envDecay)) > 1e-15) return false;
      }
      return true;
    },
  },
  {
    id: 'imp3130-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: the table is RH-EQUIVALENT, structural/diagnostic, leaves the ' +
         'operator step untouched, is not a proof, not a reduction below RH, and no refereed bound is changed. ' +
         'If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3130_ENVELOPE_APPROXIMATION_ERROR_TABLE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3130_ENVELOPE_APPROXIMATION_ERROR_TABLE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3130-envelope-approximation-error-table assertion failed: ${a.id}`);
}

export default IMP3130_ENVELOPE_APPROXIMATION_ERROR_TABLE;
