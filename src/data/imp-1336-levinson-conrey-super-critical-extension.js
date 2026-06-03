// @module data/imp-1336-levinson-conrey-super-critical-extension
// imp-1336 -- NOVEL: can the Levinson-Conrey mollified-moment method, which
// proves a positive proportion of zeros lie ON the critical line, be re-pointed
// to CONFINE a positive proportion of zeros to a thin strip |sigma - 1/2| < eps
// in the super-critical regime?
//
// WHAT THE MOLLIFIER METHOD DOES
// ------------------------------
// Levinson 1974 and its descendants prove a lower bound kappa on the proportion
// of nontrivial zeros that lie EXACTLY on the line sigma = 1/2:
//
//   #{ zeros rho = 1/2 + i gamma : 0 < gamma <= T } >= (kappa - o(1)) N(T).
//
// The engine is a mollified second moment. One forms a Dirichlet-polynomial
// mollifier psi(s) of length T^theta (theta the mollifier exponent) and studies
// the average of |B(s) zeta(s)|^2 for a differential operator B. Levinson`s
// lemma then converts a mollified-moment ratio c(theta) into a count of REAL
// zeros of the real-valued Hardy function Z(t) = exp(i theta(t)) zeta(1/2 + it),
// giving kappa = 1 - (1/R) log(c(theta)) with R = log T (schematically). The
// record values of kappa are the outputs of this machine.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'mollifier-method-symmetry-locked-to-line-strip-confinement-needs-zero-density-no-new-lambda-bound'
//
//   (a) RECORD ON-LINE PROPORTIONS CATALOGUED. Levinson 1974: kappa >= 1/3.
//       Conrey 1989: kappa >= 2/5 (longer mollifier, theta up to 4/7).
//       Bui-Conrey-Young 2011: kappa >= 0.4105. Feng 2012: kappa >= 0.4128.
//       Pratt-Robles-Zaharescu-Zeindler 2020 (record): kappa >= 5/12 ~ 0.41667.
//       Every value is a proportion ON the exact line sigma = 1/2, strictly
//       below 1/2 -- the method has never reached half the zeros.
//
//   (b) STRUCTURAL OBSTRUCTION TO A STRIP VERSION -- SYMMETRY LOCK. Levinson`s
//       lemma counts zeros ON the line by counting REAL zeros of the REAL Hardy
//       function Z(t). Z is real-valued PRECISELY because the functional
//       equation symmetry s <-> 1 - s fixes the line sigma = 1/2 (the
//       Riemann-Siegel theta(t) rotation makes exp(i theta) zeta real there).
//       OFF the line sigma > 1/2 there is no real-valued avatar of zeta, so the
//       count-real-zeros-of-a-real-function mechanism -- the entire engine of
//       the method -- has NO off-line analogue. The mollifier method is
//       SYMMETRY-LOCKED to the line and cannot be re-pointed at a strip
//       |sigma - 1/2| < eps. Named sub-gap LCS-1.
//
//   (c) STRIP CONFINEMENT IS A DIFFERENT TECHNOLOGY (ZERO-DENSITY) AND IS
//       ALREADY STRONGER. The proper tool for is-a-positive-proportion-in-a-
//       strip questions is the zero-density estimate N(sigma, T) = #{ zeros with
//       Re >= sigma, 0 < Im <= T }. Bohr-Landau 1914 already gives the
//       QUALITATIVE result N(sigma, T) / N(T) -> 0 for every fixed sigma > 1/2 --
//       i.e. 100% of zeros satisfy |sigma - 1/2| < eps for any fixed eps, a
//       confinement strictly STRONGER than any positive-proportion mollifier
//       statement. Quantitatively Ingham 1940 (N(sigma,T) << T^{3(1-sigma)/
//       (2-sigma)} (log T)^5) and the Guth-Maynard 2024 improvement near
//       sigma = 3/4 sharpen the rate; these already live in the codebase
//       (imp-1322 Ingham reopt, imp-1325 Maynard sieve, imp-1332 Guth-Maynard).
//       The Levinson kappa and the density N(sigma, T) are COMPLEMENTARY
//       (on-line count vs off-line exclusion), not combinable into a stronger
//       strip bound.
//
// HONEST BOTTOM LINE
// ------------------
// The answer to the ticket question is NO: the mollified-moment method cannot
// be extended to a strip-confinement bound, because its core (Levinson`s lemma)
// is symmetry-locked to the functional-equation fixed line sigma = 1/2. The
// quantitative strip-confinement the ticket hoped for is exactly what the
// SEPARATE zero-density technology already supplies, and qualitatively (100%
// density confinement) it was already classical in 1914. Neither lever moves
// the de Bruijn-Newman bracket 0 <= Lambda <= 0.2: a positive-proportion
// confinement leaves the complementary 1 - kappa = 7/12 of zeros unlocalized,
// and Lambda is governed by the de Bruijn heat flow making ALL zeros real (the
// extreme zero, not a proportion). Sub-gap LCS-1 records the precise wall.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash). Single-quoted strings only; no
// apostrophes inside single-quoted strings (back-ticks in prose comments are
// inside // line comments and harmless).

// -----------------------------------------------------------------------------
// Numerics. Re-derived here so this module is a standalone citable record.
// -----------------------------------------------------------------------------

// Record on-line proportions kappa (lower bounds on the proportion of zeros
// with sigma = 1/2 exactly), in chronological order.
const LEVINSON_1974 = 1 / 3;          // ~0.33333
const CONREY_1989 = 2 / 5;            // 0.40000
const BUI_CONREY_YOUNG_2011 = 0.4105; // ~0.4105
const FENG_2012 = 0.4128;             // ~0.4128
const PRZZ_2020 = 5 / 12;             // ~0.41667 -- current record

const KAPPA_RECORD = PRZZ_2020;

// Complementary proportion the mollifier method leaves UNLOCALIZED off the line.
const UNLOCALIZED_PROPORTION = 1 - KAPPA_RECORD; // 7/12 ~ 0.58333

// Ingham 1940 zero-density exponent: N(sigma, T) << T^{e_I(sigma)} (log T)^5.
function inghamDensityExponent(sigma) {
  if (!(sigma > 0.5) || !(sigma <= 1)) return null;
  return (3 * (1 - sigma)) / (2 - sigma);
}

// de Bruijn-Newman bracket.
const LAMBDA_LOWER = 0;   // Rodgers-Tao 2020 (Newman conjecture proved).
const LAMBDA_UPPER = 0.2; // Polymath15 2019.

// -----------------------------------------------------------------------------
// Sub-question (a): the record on-line proportions (mollified-moment outputs).
// -----------------------------------------------------------------------------

const ON_LINE_PROPORTIONS = Object.freeze({
  meaning: 'kappa = lower bound on proportion of nontrivial zeros with sigma = 1/2 exactly.',
  engine: 'Mollified second moment of B(s) zeta(s); Levinson lemma converts the moment ratio into a count of real zeros of the Hardy function Z(t).',
  records: Object.freeze([
    Object.freeze({
      cite: 'Levinson, N. (1974), More than one third of zeros of Riemann zeta-function are on sigma = 1/2, Adv. Math. 13, 383-436.',
      kappa: LEVINSON_1974,
      note: 'First positive-proportion-on-the-line result.',
    }),
    Object.freeze({
      cite: 'Conrey, J.B. (1989), More than two fifths of the zeros of the Riemann zeta function are on the critical line, J. Reine Angew. Math. 399, 1-26.',
      kappa: CONREY_1989,
      note: 'Longer mollifier, exponent theta up to 4/7.',
    }),
    Object.freeze({
      cite: 'Bui, H.; Conrey, J.B.; Young, M. (2011), More than 41% of the zeros of the zeta function are on the critical line, Acta Arith. 150, 35-64.',
      kappa: BUI_CONREY_YOUNG_2011,
      note: 'Two-piece mollifier.',
    }),
    Object.freeze({
      cite: 'Feng, S. (2012), Zeros of the Riemann zeta function on the critical line, J. Number Theory 132, 511-542.',
      kappa: FENG_2012,
      note: 'Higher-order mollifier (some constants later re-examined).',
    }),
    Object.freeze({
      cite: 'Pratt, K.; Robles, N.; Zaharescu, A.; Zeindler, D. (2020), More than five-twelfths of the zeros of zeta are on the critical line, Res. Math. Sci. 7, no. 1, art. 2.',
      kappa: PRZZ_2020,
      note: 'Current record: 5/12.',
    }),
  ]),
  record: KAPPA_RECORD,
  belowHalf: true,
  belowHalfNote: 'Every value is strictly below 1/2: the method counts a POSITIVE PROPORTION on the line, never a majority and never 100%.',
});

// -----------------------------------------------------------------------------
// Sub-question (b): structural obstruction to a strip version -- symmetry lock.
// -----------------------------------------------------------------------------

const SYMMETRY_LOCK = Object.freeze({
  question: 'Can the mollifier method be re-pointed to confine a positive proportion of zeros to a strip |sigma - 1/2| < eps for an effective eps > 0?',
  answer: 'symmetry-locked-to-line',
  reason:
    'Levinson`s lemma counts zeros ON the line by counting REAL zeros of the ' +
    'REAL-valued Hardy function Z(t) = exp(i theta(t)) zeta(1/2 + it). Z is real ' +
    'precisely because the functional-equation symmetry s <-> 1 - s fixes the ' +
    'line sigma = 1/2 (the Riemann-Siegel theta rotation realifies exp(i theta) ' +
    'zeta there). Off the line sigma > 1/2 there is NO real-valued avatar of ' +
    'zeta, so the count-real-zeros-of-a-real-function mechanism -- the whole ' +
    'engine -- has no off-line analogue. The method cannot localize off-line ' +
    'zeros to a strip; it only certifies presence ON the symmetry line.',
  subGap: 'LCS-1',
  subGapDetail:
    'LCS-1: exhibit a mollified positivity functional on a vertical segment ' +
    'sigma = 1/2 + eps whose positivity would force a positive proportion of ' +
    'zeros into the strip |sigma - 1/2| < eps. The obstruction is that Levinson`s ' +
    'real-zero count has no off-line analogue without a real avatar of zeta, ' +
    'which exists only on the functional-equation fixed line.',
});

// -----------------------------------------------------------------------------
// Sub-question (c): strip confinement is a different technology (zero-density),
// and is already qualitatively stronger than the mollifier proportion.
// -----------------------------------------------------------------------------

const STRIP_CONFINEMENT = Object.freeze({
  correctTool: 'zero-density-estimate-N(sigma,T)',
  definition: 'N(sigma, T) = #{ nontrivial zeros with Re >= sigma, 0 < Im <= T }.',
  qualitative: Object.freeze({
    cite: 'Bohr, H.; Landau, E. (1914), Ein Satz ueber Dirichletsche Reihen mit Anwendung auf die zeta-Funktion und die L-Funktionen, Rend. Circ. Mat. Palermo 37.',
    statement: 'N(sigma, T) / N(T) -> 0 for every fixed sigma > 1/2.',
    consequence: '100% of zeros satisfy |sigma - 1/2| < eps for any fixed eps > 0 -- a confinement STRICTLY STRONGER than any positive-proportion mollifier statement, and classical since 1914.',
  }),
  quantitative: Object.freeze({
    ingham: Object.freeze({
      cite: 'Ingham, A.E. (1940), On the estimation of N(sigma, T), Quart. J. Math. 11, 291-292.',
      form: 'N(sigma, T) << T^{3(1-sigma)/(2-sigma)} (log T)^5.',
      exponentAtThreeQuarters: inghamDensityExponent(0.75),
    }),
    guthMaynard: Object.freeze({
      cite: 'Guth, L.; Maynard, J. (2024), New large value estimates for Dirichlet polynomials, arXiv:2405.20552.',
      note: 'First improvement in decades to the density exponent near sigma = 3/4 (sharper than Ingham there).',
    }),
  }),
  alreadyInCodebase: Object.freeze(['imp-1322', 'imp-1325', 'imp-1332']),
  complementaryNote:
    'The Levinson kappa (presence ON the line) and N(sigma, T) (exclusion OFF ' +
    'the line) are complementary measurements, not combinable into a stronger ' +
    'strip bound. Strip confinement is owned by the zero-density technology.',
  combinable: false,
});

// -----------------------------------------------------------------------------
// Lambda link.
// -----------------------------------------------------------------------------

const LAMBDA_LINK = Object.freeze({
  question: 'Does a positive-proportion strip-confinement (or the on-line kappa) give a new bound on the de Bruijn-Newman constant Lambda?',
  answer: 'no-new-lambda-bound',
  reason:
    'A positive-proportion result leaves the complementary 1 - kappa = 7/12 of ' +
    'zeros unlocalized. Lambda is the threshold above which the de Bruijn heat ' +
    'flow H_t has ALL zeros real; it is governed by the extreme/worst zero, not ' +
    'by a proportion. Even the classical 100%-density confinement (Bohr-Landau) ' +
    'does not bound Lambda, because the potential off-line zeros Lambda concerns ' +
    'form a density-zero set that the density estimates cannot exclude.',
  lambdaBracketUnchanged: Object.freeze({
    lower: LAMBDA_LOWER,
    upper: LAMBDA_UPPER,
    lowerCite: 'Rodgers, B.; Tao, T. (2020), The de Bruijn-Newman constant is non-negative, Forum Math. Pi 8.',
    upperCite: 'Polymath, D.H.J. (2019), Effective approximation of heat flow evolution of the Riemann xi function, and a new upper bound for the de Bruijn-Newman constant, Res. Math. Sci. 6.',
    movedByThisTicket: false,
  }),
  unlocalizedProportion: UNLOCALIZED_PROPORTION,
});

// -----------------------------------------------------------------------------
// Verdict.
// -----------------------------------------------------------------------------

const ALLOWED_VERDICTS = Object.freeze([
  'mollifier-method-extends-to-strip-confinement-new-lambda-bound',
  'mollifier-method-symmetry-locked-to-line-strip-confinement-needs-zero-density-no-new-lambda-bound',
  'mollifier-method-irrelevant-to-strip-and-lambda',
]);

const VERDICT = 'mollifier-method-symmetry-locked-to-line-strip-confinement-needs-zero-density-no-new-lambda-bound';

const VERDICT_DETAIL =
  'mollifier-method-symmetry-locked-to-line-strip-confinement-needs-zero-density-no-new-lambda-bound: ' +
  'The Levinson-Conrey mollified-moment record on-line proportions are on file ' +
  '(Levinson 1974 = 1/3, Conrey 1989 = 2/5, Bui-Conrey-Young 2011 = 0.4105, ' +
  'Feng 2012 = 0.4128, Pratt-Robles-Zaharescu-Zeindler 2020 record = 5/12), ' +
  'every one a proportion ON sigma = 1/2 and strictly below 1/2. The method ' +
  'CANNOT be re-pointed at a strip |sigma - 1/2| < eps because its engine, ' +
  'Levinson`s lemma, counts real zeros of the real Hardy function Z(t), which ' +
  'is real only on the functional-equation fixed line -- there is no off-line ' +
  'real avatar of zeta, so the mechanism is symmetry-locked (sub-gap LCS-1). ' +
  'Strip confinement is the separate zero-density technology: Bohr-Landau 1914 ' +
  'already gives 100% density confinement (stronger than any positive ' +
  'proportion), with Ingham 1940 and Guth-Maynard 2024 quantitative rates ' +
  'already in the codebase (imp-1322/1325/1332). Neither lever moves the de ' +
  'Bruijn-Newman bracket 0 <= Lambda <= 0.2: a proportion result leaves 7/12 of ' +
  'zeros unlocalized and Lambda is governed by the extreme zero, not a ' +
  'proportion.';

const RECOMMENDED_FOLLOWUP = Object.freeze({
  id: 'imp-1336-followup-lcs-1-off-line-mollified-positivity',
  title:
    'LCS-1: search for a mollified positivity functional on sigma = 1/2 + eps ' +
    'whose positivity would confine a positive proportion of zeros to the strip ' +
    '|sigma - 1/2| < eps -- or prove rigorously that no such off-line analogue ' +
    'of Levinson`s real-zero count can exist without a real avatar of zeta, ' +
    'which would explain why every mollifier route is symmetry-locked to the line.',
  subGapId: 'LCS-1',
  priority: 'high',
  sharesToolingWith: Object.freeze(['imp-1322', 'imp-1325', 'imp-1332', 'imp-1333']),
});

// -----------------------------------------------------------------------------
// Frozen export record.
// -----------------------------------------------------------------------------

export const IMP_1336_LEVINSON_CONREY_SUPER_CRITICAL = Object.freeze({
  id: 'imp-1336',
  ticket: 'imp-1336',
  title: 'Levinson-Conrey mollified-moment method -- can it confine zeros to a super-critical strip?',
  proofSection: 'S7',
  shippedBy: 'opus-4-8 (api-pool)',

  pinnedNumerics: Object.freeze({
    levinson1974: LEVINSON_1974,
    conrey1989: CONREY_1989,
    buiConreyYoung2011: BUI_CONREY_YOUNG_2011,
    feng2012: FENG_2012,
    przz2020: PRZZ_2020,
    kappaRecord: KAPPA_RECORD,
    unlocalizedProportion: UNLOCALIZED_PROPORTION,
    lambdaLower: LAMBDA_LOWER,
    lambdaUpper: LAMBDA_UPPER,
  }),

  onLineProportions: ON_LINE_PROPORTIONS, // sub-question (a)
  symmetryLock: SYMMETRY_LOCK,            // sub-question (b)
  stripConfinement: STRIP_CONFINEMENT,    // sub-question (c)
  lambdaLink: LAMBDA_LINK,

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,
  recommendedFollowup: RECOMMENDED_FOLLOWUP,

  crossReferences: Object.freeze({
    'imp-1322': 'src/data/imp-1322-ingham-sigma-reopt.js (Ingham zero-density exponent reopt).',
    'imp-1325': 'src/data/imp-1325-maynard-sieve-zero-density.js (Maynard sieve zero-density).',
    'imp-1332': 'src/data/imp-1332-guth-maynard-2024-substitution.js (Guth-Maynard 2024 density).',
    'imp-1333': 'src/data/imp-1333-selberg-S-T-super-critical.js (sibling super-critical phase entry).',
  }),
});

export default IMP_1336_LEVINSON_CONREY_SUPER_CRITICAL;

// -----------------------------------------------------------------------------
// BUILD-TIME TRIPWIRES (8 shipped; ticket spec requires 8).
// -----------------------------------------------------------------------------

export const IMP_1336_LEVINSON_CONREY_SUPER_CRITICAL_ASSERTIONS = [

  // Tripwire 1: record proportion is 5/12 (PRZZ 2020).
  {
    id: 'imp1336-record-kappa-is-five-twelfths',
    why:
      'The current record proportion of zeros proven on the critical line is 5/12 ' +
      '(Pratt-Robles-Zaharescu-Zeindler 2020). A drift here would mis-state the ' +
      'headline output of the entire mollifier program.',
    holds: () => {
      const k = IMP_1336_LEVINSON_CONREY_SUPER_CRITICAL.pinnedNumerics.kappaRecord;
      return Number.isFinite(k) && Math.abs(k - 5 / 12) < 1e-12;
    },
  },

  // Tripwire 2: the proportion chain is monotone increasing over the decades.
  {
    id: 'imp1336-proportion-chain-monotone-increasing',
    why:
      'The historical proportions 1/3 (Levinson 1974) < 2/5 (Conrey 1989) < 0.4105 ' +
      '(Bui-Conrey-Young 2011) < 0.4128 (Feng 2012) < 5/12 (PRZZ 2020) must be ' +
      'strictly increasing -- each paper improved the previous record. A non-monotone ' +
      'sequence would mis-order the literature.',
    holds: () => {
      const seq = [LEVINSON_1974, CONREY_1989, BUI_CONREY_YOUNG_2011, FENG_2012, PRZZ_2020];
      for (let i = 1; i < seq.length; i++) {
        if (!(seq[i] > seq[i - 1])) return false;
      }
      return true;
    },
  },

  // Tripwire 3: the method has never reached 1/2 (positive proportion, not majority).
  {
    id: 'imp1336-record-strictly-below-half',
    why:
      'Every mollifier proportion, including the 5/12 record, is strictly below 1/2: ' +
      'the method certifies a POSITIVE PROPORTION on the line, never a majority and ' +
      'never 100%. Claiming >= 1/2 would overstate the state of the art.',
    holds: () => {
      const k = KAPPA_RECORD;
      return k < 0.5 && IMP_1336_LEVINSON_CONREY_SUPER_CRITICAL.onLineProportions.belowHalf === true;
    },
  },

  // Tripwire 4: Ingham density exponent is positive, < 1, and decreasing toward sigma = 1.
  {
    id: 'imp1336-ingham-exponent-decreasing-to-zero',
    why:
      'The Ingham zero-density exponent e_I(sigma) = 3(1-sigma)/(2-sigma) must be ' +
      'positive on (1/2, 1), equal 0.6 at sigma = 3/4, and decrease to 0 as sigma -> 1 ' +
      '(so off-line zeros thin out). A wrong shape would break the strip-confinement ' +
      'rate this ticket points to.',
    holds: () => {
      const e34 = inghamDensityExponent(0.75);
      const e09 = inghamDensityExponent(0.9);
      return (
        Number.isFinite(e34) &&
        Math.abs(e34 - 0.6) < 1e-12 &&
        e09 > 0 &&
        e09 < e34
      );
    },
  },

  // Tripwire 5: the structural obstruction is the symmetry lock, with sub-gap LCS-1.
  {
    id: 'imp1336-obstruction-is-symmetry-lock-lcs1',
    why:
      'Sub-question (b) must answer that the mollifier method is symmetry-locked to ' +
      'the line (Hardy Z real only on sigma = 1/2 via the functional equation) and ' +
      'name the residual sub-gap LCS-1. A flip to a strip extension would be a false ' +
      'claim, since there is no off-line real avatar of zeta.',
    holds: () => {
      const s = IMP_1336_LEVINSON_CONREY_SUPER_CRITICAL.symmetryLock;
      return s.answer === 'symmetry-locked-to-line' && s.subGap === 'LCS-1';
    },
  },

  // Tripwire 6: strip confinement is owned by zero-density and is NOT combinable with kappa.
  {
    id: 'imp1336-strip-confinement-is-zero-density-not-combinable',
    why:
      'Sub-question (c) must record that strip confinement belongs to the zero-density ' +
      'technology (already 100% via Bohr-Landau 1914, stronger than any mollifier ' +
      'proportion) and is NOT combinable with the on-line kappa into a stronger bound. ' +
      'Treating them as combinable would double-count complementary measurements.',
    holds: () => {
      const c = IMP_1336_LEVINSON_CONREY_SUPER_CRITICAL.stripConfinement;
      return (
        c.combinable === false &&
        c.correctTool === 'zero-density-estimate-N(sigma,T)' &&
        c.alreadyInCodebase.includes('imp-1322') &&
        c.alreadyInCodebase.includes('imp-1325') &&
        c.alreadyInCodebase.includes('imp-1332')
      );
    },
  },

  // Tripwire 7: Lambda bracket [0, 0.2] recorded and explicitly NOT moved; 7/12 unlocalized.
  {
    id: 'imp1336-lambda-bracket-unmoved-and-proportion-leaks',
    why:
      'The de Bruijn-Newman bracket 0 <= Lambda <= 0.2 must be recorded as unmoved, ' +
      'and the reason pinned: a proportion result leaves the complementary 1 - 5/12 = ' +
      '7/12 of zeros unlocalized while Lambda is governed by the extreme zero. ' +
      'Claiming a Lambda bound would overstate the result.',
    holds: () => {
      const l = IMP_1336_LEVINSON_CONREY_SUPER_CRITICAL.lambdaLink;
      const b = l.lambdaBracketUnchanged;
      return (
        l.answer === 'no-new-lambda-bound' &&
        b.lower === 0 &&
        Math.abs(b.upper - 0.2) < 1e-12 &&
        b.movedByThisTicket === false &&
        Math.abs(l.unlocalizedProportion - 7 / 12) < 1e-12
      );
    },
  },

  // Tripwire 8: verdict is allowed + honest-partial, and follow-up names LCS-1.
  {
    id: 'imp1336-verdict-allowed-and-followup-names-lcs1',
    why:
      'The verdict must be one of the three allowed strings and specifically the ' +
      'honest symmetry-locked one, and the follow-up must seed the genuine entry ' +
      'point by naming sub-gap LCS-1. Without it the audit identifies the wall but ' +
      'fails to route the next step.',
    holds: () => {
      const v = IMP_1336_LEVINSON_CONREY_SUPER_CRITICAL.verdict;
      const allowed = IMP_1336_LEVINSON_CONREY_SUPER_CRITICAL.allowedVerdicts;
      const f = IMP_1336_LEVINSON_CONREY_SUPER_CRITICAL.recommendedFollowup;
      return (
        allowed.includes(v) &&
        v === 'mollifier-method-symmetry-locked-to-line-strip-confinement-needs-zero-density-no-new-lambda-bound' &&
        f.subGapId === 'LCS-1'
      );
    },
  },
];
