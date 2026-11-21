/**
 * @module imp-95980-section45-packet-phase-constant-inventory
 *
 * imp-95980 (proof / assessment): LOCATE the Section 4.5 packet
 * phase-dictionary normalization constants (the amplitude/phase of the
 * packet phase Phi_{p,k,h}) that would supply the imp-95961 turning-point
 * LOCATION ingredient (L) -- the own-side caustic depth c_h -- INDEPENDENTLY
 * of the imp-95961 self-consistent identification depth = seam offset
 * d = k-h/p, or record PRECISELY which stated Section 4.5 constants are
 * absent from the available text.
 *
 * SETUP (imp-95961 net). imp-95961 reduced leg (i) of the imp-95942 MAP-4
 * collar-past-caustic condition d >= a_1/mu to a single missing ingredient.
 * MAP-4 needs two per-alias ingredients: (S) the transition SCALE mu_h (Airy
 * layer width) and (L) the turning-point LOCATION c_h relative to the seam
 * (own-side caustic depth). The committed imp-95917 buildG relation
 *     mu_h = d^(1/3)/portC,   d = k - h/p,   portC = 1.7,
 * supplies (S) EXACTLY (via the sign-image MAGNITUDE fit portC = 1.7) and
 * (L) NOT AT ALL; the only committed closure for (L) is the SELF-CONSISTENT
 * identification depth = d = k-h/p, which imp-95961 flagged as itself being
 * leg (i), an assumption, not a theorem. To supply c_h independently one must
 * read it from the Section 4.5 packet phase dictionary of Phi_{p,k,h}. This
 * module INVENTORIES which Section 4.5 constants are actually committed in
 * the available repo text and which are absent.
 *
 * WHAT SECTION 4.5 CONSTANTS ARE ACTUALLY COMMITTED. The only committed
 * Section 4.5 phase-dictionary material is the imp-95336 envelopeFacts block,
 * and it holds exactly the UNIVERSAL LOCAL AIRY-MODEL asymptotic constants of
 * the profile Ai(mu(t - c)):
 *   (A+) post-caustic amplitude/phase:  Ai(s) ~ (1/(2 sqrt(pi))) s^(-1/4)
 *          e^(-(2/3) s^(3/2))   -- amplitude coefficient 1/(2 sqrt(pi)),
 *          real exponential phase (2/3) s^(3/2);
 *   (A-) pre-caustic amplitude/phase:   Ai(-s) ~ (1/sqrt(pi)) s^(-1/4)
 *          sin((2/3) s^(3/2) + pi/4)  -- amplitude coefficient 1/sqrt(pi),
 *          oscillatory phase (2/3) s^(3/2) + pi/4;
 *   (SC) the SCALE port mu_h = d^(1/3)/portC, portC = 1.7 (imp-95917 buildG,
 *          a sign-image MAGNITUDE fit, not a phase normalization).
 * These constants (1/(2 sqrt(pi)), 1/sqrt(pi), the (2/3) s^(3/2) phase, the
 * pi/4 Stokes offset, portC = 1.7) are the amplitude/phase normalization of
 * the UNIVERSAL Airy profile and of its SCALE map. They are LOCATION-BLIND
 * by construction: in Ai(mu(t - c)) the turning point c enters only as the
 * argument shift, and NONE of the committed constants fixes its value.
 *
 * WHICH STATED CONSTANT IS ABSENT (the precise record). The location c_h is
 * defined by the packet phase itself: c_h is the stationary / turning point
 * of Phi_{p,k,h}, i.e. the solution of Phi_{p,k,h}''(c) = 0 (a simple
 * turning point of the packet phase on its own side of the seam), with the
 * SCALE fixed locally by mu_h ~ |Phi_{p,k,h}'''(c)/2|^(1/3). Supplying c_h
 * INDEPENDENTLY of the identification therefore requires the actual packet
 * phase function Phi_{p,k,h}(t) -- equivalently its stationary-point map
 * (p,k,h) -> c_h. That function, and its normalization constants, are ABSENT
 * from every committed source: the repo carries the universal Airy-model
 * constants (A+),(A-) and the magnitude-fit scale port (SC), but carries
 * neither Phi_{p,k,h} nor its turning-point equation nor any tabulated c_h.
 * The scale port portC = 1.7 pins mu (the third derivative combination) but
 * says nothing about the second-derivative zero locus that FIXES c. So the
 * INDEPENDENT supply of c_h is not available: the constants that would give
 * it are the ones that are absent.
 *
 * WHY THE PRESENT CONSTANTS CANNOT SUBSTITUTE. One might hope the amplitude
 * coefficients (A+),(A-) encode the location. They do not: 1/(2 sqrt(pi))
 * and 1/sqrt(pi) are the UNIVERSAL Airy connection coefficients, identical
 * for every turning point regardless of where it sits; the pi/4 is the fixed
 * Stokes phase; the (2/3) s^(3/2) is the universal WKB action in the LOCAL
 * variable s = mu(t - c), already measured FROM c. All four are invariant
 * under translating c, hence carry zero information about c. Only the packet
 * phase Phi_{p,k,h} -- absent -- breaks that translation invariance and
 * pins c. This is exactly the imp-95961 (S)/(L) split seen at the source
 * level: the committed dictionary is the scale-and-shape dictionary, not the
 * location dictionary.
 *
 * NET (honest PARTIAL -- a PRECISE ABSENCE RECORD, no derivation of the
 * geometry, no bound, NO QED). The Section 4.5 packet phase-dictionary
 * constants that would supply the turning-point LOCATION c_h independently of
 * the imp-95961 identification are ABSENT from the available text. What IS
 * committed is only the universal LOCAL Airy-model normalization -- amplitude
 * coefficients 1/(2 sqrt(pi)) (post-caustic) and 1/sqrt(pi) (pre-caustic),
 * the (2/3) s^(3/2) WKB action, the pi/4 Stokes offset, and the magnitude-fit
 * scale port portC = 1.7 -- every one of which is TRANSLATION-INVARIANT in
 * the turning point c and so location-blind. The one stated constant needed,
 * the packet phase Phi_{p,k,h} (equivalently the stationary-point map
 * (p,k,h) -> c_h via Phi''(c) = 0), is not present anywhere in the committed
 * imp-95336 envelopeFacts / imp-95917 buildG data. This confirms the
 * imp-95961 ingredient (L) gap at the SOURCE level: c_h stays available only
 * through the self-consistent identification depth = seam offset, which is
 * leg (i) itself. The sub-gap stays OPEN; no bound moves; NO QED;
 * no refereed bound is changed.
 *
 * HONEST LIMITS. (a) ASSESSMENT / SOURCE-INVENTORY only. (b) The inventory
 * of present constants is read directly from the committed imp-95336
 * envelopeFacts and imp-95917 buildG text; the claim of absence is a claim
 * about the AVAILABLE repo text, not about the Sun arXiv:2609.04176 Section
 * 4.5 source itself (which is unrefereed and not reproduced here). (c) The
 * translation-invariance argument (present constants are location-blind) is a
 * structural fact about the universal Airy connection formulae, not a new
 * derivation of c_h. (d) Nothing here supplies c_h or closes the sub-gap.
 * Import-light (no zeros bundle, no sibling imports); self-executing
 * assertions THROW on violation.
 *
 * @see imp-95961-turning-point-depth-extraction-obstruction.js (leg (i): (S) extractable, (L) not)
 * @see imp-95336-fresnel-airy-envelope-port-assessment.js (envelopeFacts: the committed Airy constants)
 * @see imp-95917-vonmangoldt-weighted-sign-image.js (buildG: mu = d^(1/3)/1.7, the scale port)
 * @see imp-95942-fresnel-airy-envelope-sign-assessment.js (reduces the sign to d >= a_1/mu)
 *
 * Ticket: imp-95980 (proof, opus-4-8, api-pool, large). Source inventory;
 * precise absence record; no derivation of the geometry; no bound; NO QED.
 */

// -- constants read from the committed sources --------------------------------
const PORT_C = 1.7; // imp-95917 buildG scale port (magnitude fit); pins mu not c
const AIRY_AMP_POST = 1 / (2 * Math.sqrt(Math.PI)); // Ai(s) leading amplitude
const AIRY_AMP_PRE = 1 / Math.sqrt(Math.PI); // Ai(-s) leading amplitude
const STOKES_PHASE = Math.PI / 4; // pi/4 offset in Ai(-s) ~ sin((2/3)s^(3/2)+pi/4)
const WKB_ACTION_COEFF = 2 / 3; // (2/3) s^(3/2) universal local WKB action

// -- committed Section 4.5 constants (present in the available text) ----------
const PRESENT_CONSTANTS = [
  {
    symbol: 'ampPost',
    value: AIRY_AMP_POST,
    source: 'imp-95336 envelopeFacts.postCausticDecay',
    role: 'universal Airy post-caustic amplitude 1/(2 sqrt(pi))',
    locationBlind: true, // identical for every turning point c
  },
  {
    symbol: 'ampPre',
    value: AIRY_AMP_PRE,
    source: 'imp-95336 envelopeFacts.preCausticEnvelope',
    role: 'universal Airy pre-caustic amplitude 1/sqrt(pi)',
    locationBlind: true,
  },
  {
    symbol: 'stokesPhase',
    value: STOKES_PHASE,
    source: 'imp-95336 envelopeFacts.preCausticEnvelope',
    role: 'fixed pi/4 Stokes phase offset',
    locationBlind: true,
  },
  {
    symbol: 'wkbAction',
    value: WKB_ACTION_COEFF,
    source: 'imp-95336 envelopeFacts (both sides)',
    role: 'universal (2/3) s^(3/2) local WKB action, measured FROM c',
    locationBlind: true, // s = mu(t - c) is already relative to c
  },
  {
    symbol: 'portC',
    value: PORT_C,
    source: 'imp-95917 buildG: mu = d^(1/3)/portC',
    role: 'scale port (sign-image magnitude fit); pins mu, not c',
    locationBlind: true, // a scale map d -> mu carries no caustic location
  },
];

// -- the stated Section 4.5 constant that is ABSENT ---------------------------
const ABSENT_CONSTANT = {
  symbol: 'Phi_{p,k,h} / c_h',
  role:
    'the packet phase Phi_{p,k,h}(t) itself, equivalently the stationary / ' +
    'turning-point map (p,k,h) -> c_h via d2Phi_{p,k,h}/dt2 (c) = 0 (own-side ' +
    'caustic location); the only constant that breaks translation ' +
    'invariance in c and pins the LOCATION ingredient (L)',
  presentInText: false,
  reason:
    'no committed source carries Phi_{p,k,h}, its turning-point equation, ' +
    'or any tabulated c_h; the present constants are all location-blind, so ' +
    'they cannot substitute',
};

// -- verdict object -----------------------------------------------------------
export const IMP95980_SECTION45_PACKET_PHASE_CONSTANT_INVENTORY = {
  ticket:
    'imp-95980 (proof / assessment): LOCATE the Section 4.5 packet ' +
    'phase-dictionary normalization constants (amplitude/phase of ' +
    'Phi_{p,k,h}) supplying the imp-95961 turning-point LOCATION ingredient ' +
    '(L) = own-side caustic depth c_h INDEPENDENTLY of the identification ' +
    'depth = seam offset d = k-h/p, or record precisely which stated ' +
    'Section 4.5 constants are absent. Result: the location constants are ' +
    'ABSENT; only the universal LOCAL Airy-model normalization (amplitudes ' +
    '1/(2 sqrt(pi)), 1/sqrt(pi); (2/3) s^(3/2) WKB action; pi/4 Stokes ' +
    'offset; magnitude-fit scale port portC = 1.7) is committed, and every ' +
    'one of those is translation-invariant in c hence location-blind. The ' +
    'one stated constant needed, the packet phase Phi_{p,k,h} (equivalently ' +
    'the map (p,k,h) -> c_h via d2Phi/dt2 (c) = 0), is absent from the ' +
    'committed imp-95336 envelopeFacts / imp-95917 buildG text. Precise ' +
    'absence record; sub-gap stays OPEN.',
  presentConstants: PRESENT_CONSTANTS,
  absentConstant: ABSENT_CONSTANT,
  locationBlindnessArgument:
    'The committed amplitude coefficients 1/(2 sqrt(pi)) and 1/sqrt(pi) are ' +
    'the UNIVERSAL Airy connection coefficients, identical for every turning ' +
    'point regardless of where it sits; the pi/4 is the fixed Stokes phase; ' +
    'the (2/3) s^(3/2) is the universal WKB action in the LOCAL variable ' +
    's = mu(t - c), already measured FROM c; the scale port portC = 1.7 pins ' +
    'mu ~ |d3Phi/dt3 (c)/2|^(1/3) (a third-derivative combination), not the ' +
    'second-derivative zero locus d2Phi/dt2 (c) = 0 that FIXES c. All are ' +
    'invariant under translating c, so they carry zero information about the ' +
    'location. Only the absent packet phase Phi_{p,k,h} breaks that ' +
    'translation invariance and pins c_h.',
  subGap:
    'imp-95212-subgap-fresnel-airy-envelope-SIGN / imp-95336 MAP-4 leg (i) ' +
    '-- STILL OPEN. The Section 4.5 location constants c_h are ABSENT from ' +
    'the committed text (only the location-blind universal Airy-model + ' +
    'scale-port constants are present), so c_h stays available only through ' +
    'the imp-95961 self-consistent identification depth = seam offset ' +
    'd = k-h/p, which is leg (i) itself. No independent supply of the ' +
    'LOCATION ingredient (L) exists in the committed data.',
  verdict:
    'ASSESSMENT / SOURCE-INVENTORY (honest PARTIAL -- a PRECISE ABSENCE ' +
    'RECORD, no derivation of the geometry, no bound, NO QED). The Section ' +
    '4.5 packet phase-dictionary constants that would supply the ' +
    'turning-point LOCATION c_h independently of the imp-95961 ' +
    'identification are ABSENT from the available text. What IS committed is ' +
    'only the universal LOCAL Airy-model normalization -- amplitudes ' +
    '1/(2 sqrt(pi)) (post-caustic) and 1/sqrt(pi) (pre-caustic), the ' +
    '(2/3) s^(3/2) WKB action, the pi/4 Stokes offset, and the ' +
    'magnitude-fit scale port portC = 1.7 -- every one of which is ' +
    'translation-invariant in the turning point c and so location-blind. ' +
    'The one stated constant needed, the packet phase Phi_{p,k,h} ' +
    '(equivalently the stationary-point map (p,k,h) -> c_h via ' +
    'd2Phi/dt2 (c) = 0), is not present anywhere in the committed imp-95336 ' +
    'envelopeFacts / imp-95917 buildG data. This confirms the imp-95961 ' +
    'ingredient (L) gap at the SOURCE level. The sub-gap stays OPEN; no ' +
    'bound moves; NO QED; no refereed bound is changed.',
  rigorScope:
    'The inventory of present constants is read directly from the committed ' +
    'imp-95336 envelopeFacts and imp-95917 buildG text; the absence claim is ' +
    'about the AVAILABLE repo text, not about the Sun arXiv:2609.04176 ' +
    'Section 4.5 source (unrefereed, not reproduced here). The ' +
    'translation-invariance (location-blindness) argument is a structural ' +
    'fact about the universal Airy connection formulae, not a new derivation ' +
    'of c_h. Nothing here supplies c_h or closes the sub-gap. Changes no ' +
    'bound; NO QED.',
  citation:
    'imp-95961-turning-point-depth-extraction-obstruction.js (leg (i): (S) ' +
    'extractable, (L) not); imp-95336-fresnel-airy-envelope-port-assessment.js ' +
    '(envelopeFacts); imp-95917-vonmangoldt-weighted-sign-image.js (buildG ' +
    'scale port); imp-95942-fresnel-airy-envelope-sign-assessment.js ' +
    '(d >= a_1/mu).',
};

export default IMP95980_SECTION45_PACKET_PHASE_CONSTANT_INVENTORY;

// -- self-executing assertions (imp-3715 convention; THROW on violation) ------
export const IMP95980_ASSERTIONS = [
  {
    id: 'imp95980-present-constants-match-airy-normalization',
    description:
      'the committed present constants reproduce the universal Airy ' +
      'connection normalization: post-caustic amplitude 1/(2 sqrt(pi)), ' +
      'pre-caustic amplitude 1/sqrt(pi) = 2x the post value, Stokes phase ' +
      'pi/4, WKB action coefficient 2/3, scale port 1.7 -- to 1e-12',
    holds: () =>
      Math.abs(AIRY_AMP_POST - 1 / (2 * Math.sqrt(Math.PI))) < 1e-12 &&
      Math.abs(AIRY_AMP_PRE - 2 * AIRY_AMP_POST) < 1e-12 &&
      Math.abs(STOKES_PHASE - Math.PI / 4) < 1e-12 &&
      Math.abs(WKB_ACTION_COEFF - 2 / 3) < 1e-12 &&
      Math.abs(PORT_C - 1.7) < 1e-12,
  },
  {
    id: 'imp95980-every-present-constant-is-location-blind',
    description:
      'the precise obstruction: EVERY committed Section 4.5 constant is ' +
      'flagged locationBlind = true (translation-invariant in the turning ' +
      'point c), so none of them can supply the LOCATION ingredient (L)',
    holds: () => PRESENT_CONSTANTS.every((c) => c.locationBlind === true),
  },
  {
    id: 'imp95980-location-constant-is-absent',
    description:
      'the one stated constant needed for (L) -- the packet phase ' +
      'Phi_{p,k,h} / the map (p,k,h) -> c_h -- is recorded ABSENT ' +
      '(presentInText = false) from the committed text',
    holds: () => ABSENT_CONSTANT.presentInText === false,
  },
  {
    id: 'imp95980-verdict-honesty',
    description:
      'the verdict carries the honest scope: SOURCE-INVENTORY / PRECISE ' +
      'ABSENCE RECORD, constants ABSENT, present constants location-blind, ' +
      'sub-gap STILL OPEN, no bound, NO QED, no refereed bound is changed',
    holds: () =>
      /honest PARTIAL/.test(
        IMP95980_SECTION45_PACKET_PHASE_CONSTANT_INVENTORY.verdict,
      ) &&
      /ABSENT/.test(IMP95980_SECTION45_PACKET_PHASE_CONSTANT_INVENTORY.verdict) &&
      /location-blind/.test(
        IMP95980_SECTION45_PACKET_PHASE_CONSTANT_INVENTORY.verdict,
      ) &&
      /STILL OPEN/.test(
        IMP95980_SECTION45_PACKET_PHASE_CONSTANT_INVENTORY.subGap,
      ) &&
      /NO QED/.test(
        IMP95980_SECTION45_PACKET_PHASE_CONSTANT_INVENTORY.verdict,
      ) &&
      /refereed bound is changed/i.test(
        IMP95980_SECTION45_PACKET_PHASE_CONSTANT_INVENTORY.verdict,
      ),
  },
];

for (const a of IMP95980_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95980-section45-packet-phase-constant-inventory assertion failed: ${a.id}`,
    );
  }
}
