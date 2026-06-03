// @module data/imp-1331-soundararajan-tao-2024-application
// imp-1331 -- Does the candidate named 'Soundararajan-Tao 2024' in imp-1321
// close O-BS-B, the binding (log T)^A obstruction in the Bui-Soundararajan
// 2008 rigor port?
//
// CONTEXT
// -------
// imp-1321 (verdict 2-of-4-closable-rest-need-new-input) listed three named
// candidate techniques that MIGHT push the BS-2008 zero-density log-power
// A_BS down to the crossover (A_BS <= 4) at which the formal 2.04e6
// tightening becomes rigorous: Heath-Brown 2008, 'Soundararajan-Tao 2024',
// and Conrey-Iwaniec 2002. This ticket isolates the single highest-impact
// named candidate -- Soundararajan-Tao 2024 -- and walks it to a verdict.
//
// The imp-1179 / imp-1182 structural decomposition placed A_BS in the window
// [4, 8] with central value 6. The imp-1321 crossover is A* ~ 4.32 at
// sigma = 0.75: at A_BS = 6 the (log T_PT)^6 ~ 5.6e8 multiplier OVERWHELMS
// the formal 2.04e6 gain (net LOOSENING by ~275x), so the rigorous gain
// survives ONLY if a candidate proves A_BS <= A*.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'o-bs-b-not-closed-candidate-wrong-object-A-lives-in-large-values'
//
//   (a) WHAT IS THE EXPLICIT RESULT? The named 'Soundararajan-Tao 2024'
//       candidate cannot be pinned to a verifiable joint Soundararajan-Tao
//       2024 publication that states an explicit sigma-uniform zero-density
//       or large-values estimate with A = 0. The honest closest referents
//       are (i) Soundararajan 2009 'Moments of the Riemann zeta function'
//       (Annals of Math. 170, 981-993), a conditional weak-LindelOf moment
//       upper bound ON the critical line, and (ii) the Tao expository /
//       large-values-of-Dirichlet-polynomials circle of ideas. NEITHER is a
//       published effective A = 0 large-values lemma off the line.
//
//   (b) DOES IT APPLY TO BS 2008 AT sigma = 0.75? NO -- object mismatch,
//       coherent with imp-1329 SUBGAP-1329-A. A_BS is produced by the
//       Halasz-Montgomery LARGE-VALUES method (count of well-spaced t where a
//       zero-detecting Dirichlet polynomial is large) plus the Selberg
//       mollifier. A moment / LindelOf input on the line sharpens the
//       fourth-moment kernel (the O-BS-A constant C_4), NOT the (log T)^A
//       power. So even granting the strongest verifiable Soundararajan moment
//       bound, it does not enter the lemma where A_BS lives.
//
//   (c) WHAT A_BS DOES IT GIVE? No reduction below the [4, 8] central-6
//       window is established. A_BS stays at the central 6 > crossover 4.32,
//       so the formal 2.04e6 tightening is NOT made rigorous; at A_BS = 6 the
//       net effect is a ~275x LOOSENING, not a gain.
//
// HONEST BOTTOM LINE
// ------------------
// The single highest-impact named candidate for O-BS-B closure does NOT
// close it. The imp-1306 headline 'formal 2.04e6 -> Lambda <= 1.51e-11' is
// NOT recovered. O-BS-B remains paper-grade and binding; the real residual
// is the same as imp-1329 SUBGAP-1329-A -- an explicit-constant, A = 0,
// sigma-uniform Halasz-Montgomery large-values estimate, which is unpublished.
// Two of the three imp-1321 candidates have now been walked to negative
// (BFI 1986 in imp-1329; Soundararajan-Tao 2024 here); Heath-Brown 2008 and
// Conrey-Iwaniec 2002 remain unaudited.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash). Single-quoted strings only.
// No apostrophes inside single-quoted strings.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 0 -- pinned numerics (all re-derivable; checked by tripwires).
// ─────────────────────────────────────────────────────────────────────────────

// Polymath15 truncation height enters only through L = log T_PT. imp-1321
// pins (log T_PT)^6 ~ 5.6e8, hence L = (5.6e8)^(1/6) ~ 28.71.
const LOG_T_PT = 28.71;

// BS-2008 formal gain over Ingham 1940 (imp-1306 / imp-1321).
const FORMAL_GAIN_BS_OVER_INGHAM = 2.04e6;

// imp-1179 / imp-1182 structural window for the BS log-power.
const A_BS_WINDOW = Object.freeze([4, 8]);
const A_BS_CENTRAL = 6;

// (log T_PT)^A multiplier that the BS log-power costs.
function logPowerMultiplier(A) {
  return Math.pow(LOG_T_PT, A);
}

// Crossover A* solves (log T_PT)^{A*} = FORMAL_GAIN, i.e.
//   A* = ln(FORMAL_GAIN) / ln(log T_PT).
function crossoverAStar() {
  return Math.log(FORMAL_GAIN_BS_OVER_INGHAM) / Math.log(LOG_T_PT);
}

// Net rigorous multiplier at a given A_BS: FORMAL_GAIN / (log T_PT)^A.
// > 1 means a genuine tightening; < 1 means a net loosening.
function netRigorousGain(A) {
  return FORMAL_GAIN_BS_OVER_INGHAM / logPowerMultiplier(A);
}

const CROSSOVER_A_STAR = crossoverAStar();              // ~ 4.33
const MULT_AT_CENTRAL = logPowerMultiplier(A_BS_CENTRAL); // ~ 5.6e8
const NET_AT_CENTRAL = netRigorousGain(A_BS_CENTRAL);     // ~ 3.6e-3

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 -- (a) attribution audit of the named candidate.
// ─────────────────────────────────────────────────────────────────────────────

const ATTRIBUTION_AUDIT = Object.freeze({
  namedCandidate: 'Soundararajan-Tao 2024',
  namedIn: 'imp-1321 closureNote (O-BS-B candidate list)',
  verifiableJointPublicationFound: false,
  attributionStatus: 'unverifiable-as-a-joint-2024-zero-density-result',
  closestVerifiableReferents: Object.freeze([
    Object.freeze({
      referent: 'Soundararajan 2009, Moments of the Riemann zeta function',
      venue: 'Annals of Mathematics 170 (2009) 981-993',
      object: 'conditional (RH) weak-LindelOf upper bounds for moments of ' +
        'zeta(1/2 + it) ON the critical line, with a (log T)^{epsilon} loss',
      relevanceToABs: 'operates on moments on the line, not on the off-line ' +
        'large-values count where A_BS is generated',
    }),
    Object.freeze({
      referent: 'Tao, large values of Dirichlet polynomials (expository)',
      venue: 'expository / lecture circle, not a constant-bearing theorem',
      object: 'heuristics and bounds for how often a Dirichlet polynomial is ' +
        'large -- the right OBJECT, but no published explicit A = 0 constant',
      relevanceToABs: 'closest in object type; supplies no effective sigma-' +
        'uniform A = 0 large-values lemma usable in the BS composition',
    }),
  ]),
  honestNote: 'No joint Soundararajan-Tao 2024 paper giving an explicit, ' +
    'sigma-uniform zero-density / large-values estimate with A = 0 could be ' +
    'verified. The candidate was an optimistic name in imp-1321. This audit ' +
    'does NOT fabricate a citation; it records the attribution as ' +
    'unverifiable and walks the strongest verifiable referents instead.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 -- (b) object-mismatch analysis: where A_BS actually lives.
// ─────────────────────────────────────────────────────────────────────────────

const OBJECT_MISMATCH = Object.freeze({
  whereAbsLives: 'the Halasz-Montgomery large-values lemma (count of well-' +
    'spaced t where the zero-detecting Dirichlet polynomial D(sigma + it) is ' +
    'large) composed with the Selberg mollifier -- NOT in any moment / ' +
    'LindelOf bound on the critical line.',
  whatMomentInputSharpens: 'a moment / LindelOf input (the Soundararajan ' +
    'family) sharpens the fourth-moment kernel constant C_4, which is the ' +
    'SEPARATE O-BS-A obstruction (effective C_BS), giving at most a ' +
    'multiplicative rescale and NO change to the (log T)^A power.',
  coherentWith: 'imp-1329 SUBGAP-1329-A (A lives in Halasz-Montgomery large ' +
    'values, not in a sieve / dispersion / moment object) and imp-1325 ' +
    '(A is a large-values / explicit-Ingham problem).',
  appliesAtSigma0p75: false,
  reason: 'The candidate, even at its strongest verifiable form, enters the ' +
    'wrong kernel. A_BS is untouched.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 -- (c) the A_BS arithmetic: crossover vs central value.
// ─────────────────────────────────────────────────────────────────────────────

const A_BS_ARITHMETIC = Object.freeze({
  logTpt: LOG_T_PT,
  formalGain: FORMAL_GAIN_BS_OVER_INGHAM,
  crossoverAStar: CROSSOVER_A_STAR,                 // ~ 4.33 (imp-1321: 4.32)
  aBsWindow: A_BS_WINDOW,                           // [4, 8]
  aBsCentral: A_BS_CENTRAL,                         // 6
  multiplierAtCentral: MULT_AT_CENTRAL,             // ~ 5.6e8
  netRigorousGainAtCentral: NET_AT_CENTRAL,         // ~ 3.6e-3 (a LOOSENING)
  centralExceedsCrossover: A_BS_CENTRAL > CROSSOVER_A_STAR,
  formalGainRigorousIff: 'A_BS <= crossover A* ~ 4.33',
  candidateReducesAbsBelowCrossover: false,
  finding: 'At the central A_BS = 6 the (log T_PT)^6 ~ 5.6e8 cost overwhelms ' +
    'the formal 2.04e6 gain: the net rigorous multiplier is ~3.6e-3, i.e. a ' +
    '~275x LOOSENING. The Soundararajan-Tao 2024 candidate proves no A_BS <= ' +
    'crossover reduction, so the formal tightening stays non-rigorous.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 -- verdict.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_VERDICTS = Object.freeze([
  'o-bs-b-closed-A-BS-at-most-4-formal-gain-rigorous',
  'o-bs-b-partially-reduced-but-still-above-crossover',
  'o-bs-b-not-closed-candidate-wrong-object-A-lives-in-large-values',
  'candidate-unverifiable-no-assessment-possible',
]);

const VERDICT = 'o-bs-b-not-closed-candidate-wrong-object-A-lives-in-large-values';

const VERDICT_DETAIL =
  'o-bs-b-not-closed-candidate-wrong-object-A-lives-in-large-values: the ' +
  'single highest-impact named candidate for O-BS-B (the binding (log T)^A ' +
  'obstruction) does NOT close it. (a) No verifiable joint Soundararajan-Tao ' +
  '2024 zero-density / large-values result with A = 0 exists; the strongest ' +
  'verifiable referent is Soundararajan 2009 (Annals 170, 981-993), a ' +
  'conditional moment bound ON the critical line. (b) Object mismatch ' +
  '(coherent with imp-1329 SUBGAP-1329-A): A_BS is generated by the Halasz-' +
  'Montgomery large-values lemma + Selberg mollifier, not by any moment / ' +
  'LindelOf bound on the line; a moment input sharpens only the O-BS-A ' +
  'constant C_4, leaving the (log T)^A power untouched. (c) A_BS stays at the ' +
  'imp-1179 / imp-1182 central 6 > crossover A* ~ 4.33, so the formal 2.04e6 ' +
  'tightening is NOT made rigorous -- at A_BS = 6 the (log T_PT)^6 ~ 5.6e8 ' +
  'cost yields a net ~275x LOOSENING. The imp-1306 headline formal 2.04e6 -> ' +
  'Lambda <= 1.51e-11 is NOT recovered; O-BS-B remains paper-grade and the ' +
  'real residual is the unpublished explicit A = 0 sigma-uniform large-values ' +
  'estimate (imp-1329 R1).';

const CROSS_REFERENCES = Object.freeze({
  'imp-1321':
    'src/data/imp-1321-bui-soundararajan-rigor-port.js -- parent map; named ' +
    'Soundararajan-Tao 2024 as an O-BS-B candidate and pinned crossover ' +
    'A* ~ 4.32 + central A_BS = 6.',
  'imp-1329':
    'src/data/imp-1329-BFI-1986-mean-value-scoping.js -- the prior candidate ' +
    '(BFI 1986) walked to negative; defines SUBGAP-1329-A (A lives in Halasz-' +
    'Montgomery large values), reused here as the object-mismatch backbone.',
  'imp-1330':
    'src/data/imp-1330-BS-port-partial-closure.js -- closed O-BS-A + O-BS-D; ' +
    'this ticket addresses the binding O-BS-B left out of scope there.',
  'imp-1182':
    'src/data/imp-1182-bs-2008-paper-walk-A-bound.js -- the [4, 8] central-6 ' +
    'A_BS window this audit measures the candidate against.',
  'imp-1325':
    'A-is-a-large-values / explicit-Ingham problem -- coherent verdict family.',
});

const SOURCES = Object.freeze([
  'Soundararajan 2009, Moments of the Riemann zeta function, Annals of Math. 170, 981-993',
  'Bui-Soundararajan 2008, J. London Math. Soc. (2) 78, 597-606 (the ported bound)',
  'Montgomery 1971, Topics in Multiplicative Number Theory, LNM 227 (Halasz-Montgomery large values)',
  'Huxley 1972, On the difference between consecutive primes (log-power in zero-density)',
  'Heath-Brown 1981, fourth power moment of the Riemann zeta function',
  'Conrey-Iwaniec 2002, sharper mollifier (the third imp-1321 candidate, unaudited here)',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Frozen export record.
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1331_SOUNDARARAJAN_TAO_2024_APPLICATION = Object.freeze({
  id: 'imp-1331',
  ticket: 'imp-1331',
  title:
    'Soundararajan-Tao 2024 application: does it close O-BS-B (the (log T)^A ' +
    'obstruction) in the Bui-Soundararajan 2008 rigor port?',
  shippedAt: '2026-06-03T00:00:00Z',
  shippedBy: 'opus-4-8 (subscription)',

  attributionAudit: ATTRIBUTION_AUDIT,   // STEP 1 -- (a)
  objectMismatch: OBJECT_MISMATCH,        // STEP 2 -- (b)
  aBsArithmetic: A_BS_ARITHMETIC,         // STEP 3 -- (c)

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,

  crossReferences: CROSS_REFERENCES,
  sources: SOURCES,

  pinnedNumerics: Object.freeze({
    LOG_T_PT: LOG_T_PT,
    FORMAL_GAIN_BS_OVER_INGHAM: FORMAL_GAIN_BS_OVER_INGHAM,
    CROSSOVER_A_STAR: CROSSOVER_A_STAR,
    A_BS_CENTRAL: A_BS_CENTRAL,
    LOG_POWER_MULTIPLIER_AT_CENTRAL: MULT_AT_CENTRAL,
    NET_RIGOROUS_GAIN_AT_CENTRAL: NET_AT_CENTRAL,
  }),
});

export default IMP_1331_SOUNDARARAJAN_TAO_2024_APPLICATION;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (8 shipped; ticket spec requires 8).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1331_SOUNDARARAJAN_TAO_2024_APPLICATION_ASSERTIONS = [

  // Tripwire 1: verdict in the allowed set and equals the not-closed string.
  {
    id: 'imp1331-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed strings and must be the ' +
      'not-closed conclusion this audit reached. A verdict outside the set or ' +
      'an accidental flip to the closed string would misreport O-BS-B status.',
    holds: () => {
      const r = IMP_1331_SOUNDARARAJAN_TAO_2024_APPLICATION;
      return (
        typeof r.verdict === 'string' &&
        Array.isArray(r.allowedVerdicts) &&
        r.allowedVerdicts.includes(r.verdict) &&
        r.verdict ===
          'o-bs-b-not-closed-candidate-wrong-object-A-lives-in-large-values'
      );
    },
  },

  // Tripwire 2: crossover A* recomputed and matches the imp-1321 value 4.32.
  {
    id: 'imp1331-crossover-a-star-matches-imp1321',
    why:
      'The whole verdict hinges on the crossover A* below which the formal ' +
      'gain becomes rigorous. The recomputed A* = ln(2.04e6)/ln(log T_PT) ' +
      'must reproduce the imp-1321 pinned value 4.32 (to within 0.05); a drift ' +
      'would mean the log T_PT height or the formal gain decohered.',
    holds: () => {
      const a = IMP_1331_SOUNDARARAJAN_TAO_2024_APPLICATION.aBsArithmetic;
      const recomputed = Math.log(2.04e6) / Math.log(28.71);
      return (
        Math.abs(a.crossoverAStar - recomputed) < 1e-9 &&
        Math.abs(a.crossoverAStar - 4.32) < 0.05
      );
    },
  },

  // Tripwire 3: the (log T_PT)^6 multiplier reproduces the imp-1321 ~5.6e8.
  {
    id: 'imp1331-log-power-at-central-matches-5p6e8',
    why:
      'imp-1321 pins (log T_PT)^6 ~ 5.6e8 as the multiplier that destroys the ' +
      'formal 2.04e6 gain at the central A_BS = 6. The recomputed multiplier ' +
      'must land within 5 percent; otherwise the destroyer arithmetic drifted.',
    holds: () => {
      const a = IMP_1331_SOUNDARARAJAN_TAO_2024_APPLICATION.aBsArithmetic;
      const recomputed = Math.pow(28.71, 6);
      return (
        Math.abs(a.multiplierAtCentral - recomputed) < 1 &&
        Math.abs(a.multiplierAtCentral - 5.6e8) / 5.6e8 < 0.05
      );
    },
  },

  // Tripwire 4: A_BS window matches imp-1179 / imp-1182 ([4, 8] central 6).
  {
    id: 'imp1331-a-bs-window-matches-imp1179-imp1182',
    why:
      'The candidate is measured against the upstream structural window. If ' +
      'the window or central value drifts from imp-1179 / imp-1182 ([4, 8], ' +
      'central 6), the assessment is no longer comparable to the parent map.',
    holds: () => {
      const a = IMP_1331_SOUNDARARAJAN_TAO_2024_APPLICATION.aBsArithmetic;
      return (
        Array.isArray(a.aBsWindow) &&
        a.aBsWindow[0] === 4 &&
        a.aBsWindow[1] === 8 &&
        a.aBsCentral === 6
      );
    },
  },

  // Tripwire 5: central A_BS exceeds crossover -> net is a loosening, not gain.
  {
    id: 'imp1331-central-above-crossover-net-loosening',
    why:
      'The quantitative core of the not-closed verdict: central A_BS = 6 ' +
      'exceeds crossover A* ~ 4.33, so the net rigorous multiplier ' +
      'FORMAL_GAIN/(log T_PT)^6 must be < 1 (a loosening). A net > 1 would ' +
      'mean the candidate DID make the gain rigorous, contradicting the verdict.',
    holds: () => {
      const a = IMP_1331_SOUNDARARAJAN_TAO_2024_APPLICATION.aBsArithmetic;
      const net = 2.04e6 / Math.pow(28.71, 6);
      return (
        a.centralExceedsCrossover === true &&
        a.aBsCentral > a.crossoverAStar &&
        a.netRigorousGainAtCentral < 1 &&
        Math.abs(a.netRigorousGainAtCentral - net) < 1e-12 &&
        a.candidateReducesAbsBelowCrossover === false
      );
    },
  },

  // Tripwire 6: HONESTY -- attribution is flagged unverifiable, not fabricated.
  {
    id: 'imp1331-attribution-honestly-unverifiable',
    why:
      'HONESTY CHECK: the audit must NOT invent a Soundararajan-Tao 2024 ' +
      'citation. The attribution must be flagged unverifiable and the closest ' +
      'verifiable referents named instead. Claiming a verified joint paper ' +
      'would fabricate a source.',
    holds: () => {
      const at = IMP_1331_SOUNDARARAJAN_TAO_2024_APPLICATION.attributionAudit;
      return (
        at.verifiableJointPublicationFound === false &&
        /unverifiable/.test(at.attributionStatus) &&
        Array.isArray(at.closestVerifiableReferents) &&
        at.closestVerifiableReferents.length >= 2 &&
        /does NOT fabricate/.test(at.honestNote)
      );
    },
  },

  // Tripwire 7: object-mismatch coherence with imp-1329 SUBGAP-1329-A.
  {
    id: 'imp1331-object-mismatch-coherent-with-imp1329',
    why:
      'The (b) answer must reuse the imp-1329 finding that A lives in the ' +
      'Halasz-Montgomery large-values lemma, not in a moment / sieve object. ' +
      'A moment input sharpens only C_4 (O-BS-A). Drift from this backbone ' +
      'would make the negative verdict incoherent with the prior candidate walk.',
    holds: () => {
      const o = IMP_1331_SOUNDARARAJAN_TAO_2024_APPLICATION.objectMismatch;
      return (
        o.appliesAtSigma0p75 === false &&
        /Halasz-Montgomery large-values/.test(o.whereAbsLives) &&
        /C_4/.test(o.whatMomentInputSharpens) &&
        /imp-1329/.test(o.coherentWith)
      );
    },
  },

  // Tripwire 8: SEMANTIC -- verdict detail honest about formal-vs-rigorous.
  {
    id: 'imp1331-semantic-verdict-detail-honest-formal-not-recovered',
    why:
      'SEMANTIC CHECK: the verdict detail must stay honest -- it must name the ' +
      '2.04e6 formal gain as NOT recovered, cite the crossover, the central ' +
      'A_BS, and cross-reference the parent imp-1321 + the prior candidate ' +
      'walk imp-1329. Any drift that softens the negative result would overstate.',
    holds: () => {
      const r = IMP_1331_SOUNDARARAJAN_TAO_2024_APPLICATION;
      const d = r.verdictDetail;
      const hasFiveSources = Array.isArray(r.sources) && r.sources.length >= 5;
      return (
        typeof d === 'string' &&
        /2\.04e6/.test(d) &&
        /NOT (made rigorous|recovered)/.test(d) &&
        /crossover/.test(d) &&
        /central 6/.test(d) &&
        /imp-1329/.test(d) &&
        hasFiveSources
      );
    },
  },
];
