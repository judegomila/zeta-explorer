// @module data/imp-1334-voronin-universality-quantitative
// imp-1334 — NOVEL (critical): Voronin 1975 universality of zeta on the
// super-critical strip 1/2 < sigma < 1, in its QUANTITATIVE / effective form,
// and what it does (and does NOT) say about the de Bruijn-Newman constant
// Lambda. Companion to the qualitative numerical witness
// src/data/voronin-universality-numerical.js (imp-1100).
//
// WHAT VORONIN UNIVERSALITY SAYS
// ------------------------------
// (Voronin 1975, Izv. Akad. Nauk SSSR Ser. Mat. 39.) Let K be a compact subset
// of the open strip 1/2 < Re(s) < 1 with connected complement, and let f be a
// continuous, NON-VANISHING function on K that is holomorphic in the interior.
// Then for every eps > 0,
//
//   liminf_{T->inf} (1/T) * meas{ tau in [0, T] : sup_{s in K} |zeta(s + i tau) - f(s)| < eps } > 0.
//
// In words: as you slide zeta up the strip by an imaginary shift tau, it comes
// uniformly within eps of EVERY admissible target f, on a set of shifts of
// positive lower density. zeta is maximally value-complicated on the
// super-critical strip.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'voronin-bagchi-equivalent-and-rigidity-obstruction-no-direct-lever'
//
//   (a) QUANTITATIVE STATE OF THE ART (honest):
//       * ORIGINAL is purely qualitative -- positive lower density d(eps) > 0,
//         with NO effective lower bound on d(eps) as eps -> 0. The decay of
//         d(eps) is conjectured to be of the form exp(-c eps^{-a}) but no such
//         explicit lower bound is proven.
//       * EFFECTIVE FIRST-SHIFT bounds exist but are astronomically weak:
//         Good 1981 / Garunkstis 2003 give an explicit tau achieving the eps-
//         approximation that is DOUBLY EXPONENTIAL in 1/eps (a tower of the
//         form exp(exp(c / eps^{13}))). Effective, but useless as a lever.
//       * The strip is EXACTLY the super-critical strip (1/2, 1): the theorem
//         is false on the line sigma = 1/2 and trivial for sigma > 1.
//
//   (b) NO DIRECT LAMBDA LEVER -- and a structural reason why. Universality is
//       a STATEMENT, not a bound: it provides no inequality on a height-decaying
//       error and hence no input to the imp-1261 E_trunc chain that yields
//       Lambda <= 3.06e-5. Worse for naive attacks, universality is an
//       OBSTRUCTION: any RH strategy that tries to constrain zeta by a LOCAL
//       rigidity on sigma > 1/2 is doomed, because zeta is universal there (it
//       locally looks like every non-vanishing holomorphic function). The
//       non-vanishing hypothesis on f is the precise place RH hides: zeta cannot
//       universally approximate targets WITH zeros in the strip, and the
//       location of zeta`s own zeros is a global, not local, fact.
//
//   (c) THE GENUINE PAYLOAD -- BAGCHI 1981 RH-EQUIVALENCE. Bagchi (1981, PhD
//       thesis, ISI Calcutta; see also Steuding 2007) proved that RH is
//       EQUIVALENT to the STRONG RECURRENCE of zeta: for every eps > 0 and every
//       compact K in (1/2, 1) with connected complement,
//
//         liminf_{T->inf} (1/T) meas{ tau in [0,T] : sup_{K} |zeta(s + i tau) - zeta(s)| < eps } > 0,
//
//       i.e. zeta universally approximates ITSELF. This is a real RH-equivalent
//       living on the super-critical strip and is the right bridge from this
//       ticket into the imp-1333 super-critical phase program: strong recurrence
//       is the value-distribution analogue of the phase (S(T)) recurrence.
//
// HONEST BOTTOM LINE
// ------------------
// Voronin universality is catalogued with its quantitative state pinned
// (qualitative positive density; doubly-exponential effective first shift;
// strict strip (1/2,1)). It gives NO direct Lambda bound and is in fact a
// rigidity OBSTRUCTION to local-value RH attacks. Its productive content is the
// Bagchi 1981 strong-recurrence RH-equivalence, which connects the
// super-critical value distribution to the imp-1333 phase track. Named sub-gap
// VU-EFFECTIVE-DENSITY: prove any explicit lower bound on the universality
// density d(eps) -- the recommended (very hard) follow-up.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash anywhere). Single-quoted strings
// only. No apostrophes inside single-quoted strings.

// -----------------------------------------------------------------------------
// Pinned facts.
// -----------------------------------------------------------------------------

const STRIP_LO = 0.5;   // open strip lower edge (exclusive)
const STRIP_HI = 1.0;   // open strip upper edge (exclusive)
const VORONIN_DISK_CENTER = 0.75;      // canonical disk center s_0 = 3/4
const VORONIN_DISK_RADIUS_MAX = 0.25;  // disk |s - 3/4| < r requires r < 1/4 to stay in (1/2,1)

// Effective first-shift growth class (Good 1981 / Garunkstis 2003): the tau
// achieving an eps-approximation is bounded by a DOUBLE exponential in 1/eps.
// We do NOT pin a single closed constant (the literature constants differ by
// method); we record the growth CLASS as a string and a representative exponent.
const EFFECTIVE_FIRST_SHIFT_CLASS = 'double-exponential-in-1-over-eps';
const EFFECTIVE_FIRST_SHIFT_REPRESENTATIVE_EXPONENT = 13; // exp(exp(c / eps^13)) order

const T_PT = 3e12;            // production height (shared with imp-1261 chain)
const E_TRUNC_PT = 3.06e-5;   // the headline bound universality cannot tighten

// -----------------------------------------------------------------------------
// Sub-question (a): quantitative state of the art.
// -----------------------------------------------------------------------------

const QUANTITATIVE = Object.freeze({
  original: Object.freeze({
    cite: 'Voronin 1975, Izv. Akad. Nauk SSSR Ser. Mat. 39, 475-486.',
    statement: 'positive lower density d(eps) = liminf (1/T) meas{ tau <= T : sup_K |zeta(s + i tau) - f(s)| < eps } > 0.',
    effectiveDensityLowerBound: false,
    conjecturedDensityDecay: 'exp(-c eps^{-a}) (not proven).',
  }),
  effectiveFirstShift: Object.freeze({
    cite: 'Good 1981; Garunkstis 2003 (quantitative / effective universality).',
    growthClass: EFFECTIVE_FIRST_SHIFT_CLASS,
    representativeForm: 'tau <= exp(exp(c / eps^{13})).',
    representativeExponent: EFFECTIVE_FIRST_SHIFT_REPRESENTATIVE_EXPONENT,
    usableAsLever: false,
  }),
  domain: Object.freeze({
    strip: '1/2 < sigma < 1 (the super-critical strip).',
    failsOnLine: 'false at sigma = 1/2.',
    trivialAbove: 'no content for sigma > 1 (zeta is bounded and non-vanishing there).',
    canonicalDisk: 'disk |s - 3/4| < r with r < 1/4 to stay strictly inside the strip.',
  }),
});

// -----------------------------------------------------------------------------
// Sub-question (b): is there a direct Lambda lever? (No -- and an obstruction.)
// -----------------------------------------------------------------------------

const LAMBDA_LEVER = Object.freeze({
  question: 'Does Voronin universality give a new upper bound on the de Bruijn-Newman constant Lambda?',
  answer: 'no-direct-lever',
  reasonNoBound: 'Universality is a positivity-of-density STATEMENT with no height-decaying inequality; it provides no input to the imp-1261 E_trunc_pt ~ T_PT^{-0.4} chain.',
  obstruction: 'Universality OBSTRUCTS any RH strategy based on local value-rigidity on sigma > 1/2, because zeta locally approximates every non-vanishing holomorphic function there.',
  whereRHhides: 'The non-vanishing hypothesis on the target f is exactly where RH lives: zeta cannot universally approximate targets WITH zeros in the strip.',
  role: 'rigidity-obstruction-not-lambda-lever',
});

// -----------------------------------------------------------------------------
// Sub-question (c): the Bagchi 1981 RH-equivalence (the genuine payload).
// -----------------------------------------------------------------------------

const BAGCHI_EQUIVALENCE = Object.freeze({
  cite: 'Bagchi 1981 (PhD thesis, ISI Calcutta); exposition in Steuding 2007, "Value-Distribution of L-Functions", Springer LNM 1877.',
  statement: 'RH is EQUIVALENT to strong recurrence: for every eps > 0 and compact K in (1/2,1) with connected complement, liminf (1/T) meas{ tau <= T : sup_K |zeta(s + i tau) - zeta(s)| < eps } > 0.',
  meaning: 'zeta universally approximates ITSELF iff RH holds.',
  isGenuineRHEquivalent: true,
  bridgeTo: 'imp-1333 super-critical phase program -- strong recurrence is the value-distribution analogue of the S(T) phase recurrence.',
});

// -----------------------------------------------------------------------------
// Verdict + recommended follow-up.
// -----------------------------------------------------------------------------

const ALLOWED_VERDICTS = Object.freeze([
  'voronin-bagchi-equivalent-and-rigidity-obstruction-no-direct-lever',
  'voronin-universality-yields-new-lambda-bound',
  'voronin-universality-not-applicable',
]);

const VERDICT = 'voronin-bagchi-equivalent-and-rigidity-obstruction-no-direct-lever';

const VERDICT_DETAIL =
  'voronin-bagchi-equivalent-and-rigidity-obstruction-no-direct-lever: Voronin 1975 ' +
  'universality on the super-critical strip (1/2, 1) is catalogued in its quantitative ' +
  'form -- a qualitative positive lower density d(eps) > 0 with NO effective lower bound, ' +
  'and only doubly-exponential-in-1/eps effective first-shift bounds (Good 1981 / ' +
  'Garunkstis 2003). It gives NO direct upper bound on Lambda (no height-decaying ' +
  'inequality feeds the imp-1261 T_PT^{-0.4} chain) and is in fact a rigidity OBSTRUCTION ' +
  'to any local-value RH attack, since zeta locally approximates every non-vanishing ' +
  'holomorphic function on the strip. The genuine payload is the Bagchi 1981 ' +
  'RH-equivalence: RH iff zeta is strongly recurrent (universally self-approximating), ' +
  'a real super-critical-strip RH-equivalent that bridges into the imp-1333 phase ' +
  'program. Named sub-gap VU-EFFECTIVE-DENSITY.';

const RECOMMENDED_FOLLOWUP = Object.freeze({
  id: 'imp-1334-followup-vu-effective-density',
  title:
    'Prove any explicit lower bound on the Voronin universality density d(eps) as a ' +
    'function of eps (currently only d(eps) > 0 is known). Even a bound of the ' +
    'conjectured form exp(-c eps^{-a}) with explicit c, a would be the first effective ' +
    'density result and would let the Bagchi self-approximation be quantified.',
  subGapId: 'VU-EFFECTIVE-DENSITY',
  priority: 'medium',
});

// -----------------------------------------------------------------------------
// Frozen export record.
// -----------------------------------------------------------------------------

export const IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE = Object.freeze({
  id: 'imp-1334',
  ticket: 'imp-1334',
  title: 'NOVEL: Voronin 1975 universality of zeta on sigma > 1/2 -- quantitative version',
  proofSection: 'S7',
  shippedBy: 'opus-4-8 (api)',

  reference: Object.freeze({
    voronin: 'Voronin, S. M. -- "Theorem on the universality of the Riemann zeta function", Izv. Akad. Nauk SSSR Ser. Mat. 39 (1975) 475-486.',
    bagchi: 'Bagchi, B. -- "The statistical behaviour and universality properties of the Riemann zeta-function and other allied Dirichlet series", PhD thesis, ISI Calcutta (1981).',
    steuding: 'Steuding, J. -- "Value-Distribution of L-Functions", Springer Lecture Notes in Mathematics 1877 (2007).',
    effective: 'Good 1981; Garunkstis 2003 (effective / quantitative universality, doubly-exponential first-shift bounds).',
  }),

  pinnedNumerics: Object.freeze({
    strip_lo: STRIP_LO,
    strip_hi: STRIP_HI,
    disk_center: VORONIN_DISK_CENTER,
    disk_radius_max: VORONIN_DISK_RADIUS_MAX,
    effective_first_shift_class: EFFECTIVE_FIRST_SHIFT_CLASS,
    effective_first_shift_representative_exponent: EFFECTIVE_FIRST_SHIFT_REPRESENTATIVE_EXPONENT,
    T_PT,
    E_trunc_pt_unchanged: E_TRUNC_PT,
  }),

  quantitative: QUANTITATIVE,            // sub-question (a)
  lambdaLever: LAMBDA_LEVER,             // sub-question (b)
  bagchiEquivalence: BAGCHI_EQUIVALENCE, // sub-question (c)

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,
  recommendedFollowup: RECOMMENDED_FOLLOWUP,

  crossReferences: Object.freeze({
    'imp-1100': 'src/data/voronin-universality-numerical.js (qualitative numerical witness on a 5x5 grid).',
    'imp-1333': 'src/data/imp-1333-selberg-S-T-super-critical.js (super-critical phase program; strong recurrence is the value-distribution analogue).',
    'imp-1261': 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js (the Lambda <= 3.06e-5 chain universality cannot tighten).',
  }),
});

export default IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE;

// -----------------------------------------------------------------------------
// BUILD-TIME TRIPWIRES (10 shipped; ticket spec requires 10).
// -----------------------------------------------------------------------------

export const IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE_ASSERTIONS = [

  // Tripwire 1: the strip is the open super-critical strip (1/2, 1).
  {
    id: 'imp1334-strip-is-super-critical',
    why:
      'Voronin universality lives on the OPEN strip 1/2 < sigma < 1; it is false on ' +
      'the line and trivial above sigma = 1. Mis-stating the domain would void the ' +
      'whole super-critical framing.',
    holds: () => {
      const n = IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE.pinnedNumerics;
      return n.strip_lo === 0.5 && n.strip_hi === 1.0 && n.strip_lo < n.strip_hi;
    },
  },

  // Tripwire 2: canonical disk radius must keep the disk strictly inside the strip.
  {
    id: 'imp1334-disk-fits-inside-strip',
    why:
      'The canonical Voronin disk |s - 3/4| < r must have r < 1/4 so it stays strictly ' +
      'inside (1/2, 1). A radius >= 1/4 would touch the critical line and break the ' +
      'hypotheses.',
    holds: () => {
      const n = IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE.pinnedNumerics;
      return (
        n.disk_center === 0.75 &&
        n.disk_center - n.disk_radius_max >= 0.5 - 1e-12 &&
        n.disk_center + n.disk_radius_max <= 1.0 + 1e-12
      );
    },
  },

  // Tripwire 3: original universality has NO effective density lower bound.
  {
    id: 'imp1334-no-effective-density',
    why:
      'The honest quantitative state is that Voronin gives only d(eps) > 0 with NO ' +
      'effective lower bound on the density. Flipping effectiveDensityLowerBound to ' +
      'true would overstate the known results.',
    holds: () => IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE.quantitative.original.effectiveDensityLowerBound === false,
  },

  // Tripwire 4: the effective first-shift bound is the doubly-exponential class.
  {
    id: 'imp1334-effective-shift-double-exponential',
    why:
      'The only effective handle (Good 1981 / Garunkstis 2003) on universality is a ' +
      'DOUBLY-exponential-in-1/eps first-shift bound, and it is explicitly NOT usable ' +
      'as a lever. A regression to a polynomial/single-exponential class would falsely ' +
      'imply universality is quantitatively tractable.',
    holds: () => {
      const e = IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE.quantitative.effectiveFirstShift;
      return e.growthClass === 'double-exponential-in-1-over-eps' && e.usableAsLever === false;
    },
  },

  // Tripwire 5: sub-question (b) honestly answers no-direct-lever + obstruction role.
  {
    id: 'imp1334-no-direct-lambda-lever',
    why:
      'Sub-question (b) must record that universality gives NO direct Lambda bound and ' +
      'is a rigidity OBSTRUCTION. A flip to a claimed lever would be an unearned ' +
      'rigorous claim, the failure mode the engine guards against.',
    holds: () => {
      const l = IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE.lambdaLever;
      return l.answer === 'no-direct-lever' && l.role === 'rigidity-obstruction-not-lambda-lever';
    },
  },

  // Tripwire 6: the headline E_trunc_pt is recorded as UNCHANGED.
  {
    id: 'imp1334-headline-unchanged',
    why:
      'Because universality is no lever, the headline unconditional Lambda <= 3.06e-5 ' +
      'must be recorded as unchanged by this ticket. Any other value would imply a ' +
      'spurious tightening.',
    holds: () => Math.abs(IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE.pinnedNumerics.E_trunc_pt_unchanged - 3.06e-5) < 1e-9,
  },

  // Tripwire 7: Bagchi equivalence is recorded as a genuine RH-equivalent.
  {
    id: 'imp1334-bagchi-is-rh-equivalent',
    why:
      'The genuine payload is the Bagchi 1981 strong-recurrence RH-equivalence. It must ' +
      'be flagged as a genuine RH-equivalent and cite Bagchi; dropping it would lose the ' +
      'only productive content of the ticket.',
    holds: () => {
      const b = IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE.bagchiEquivalence;
      return b.isGenuineRHEquivalent === true && /Bagchi/.test(b.cite) && /strong recurrence/i.test(b.statement);
    },
  },

  // Tripwire 8: Bagchi statement uses self-approximation (zeta vs zeta), not a fixed f.
  {
    id: 'imp1334-bagchi-self-approximation',
    why:
      'Strong recurrence is SELF-approximation: zeta(s + i tau) approximates zeta(s), not ' +
      'a fixed target f. The statement must contain the self-difference form; a target-f ' +
      'form would be plain universality, not the RH-equivalence.',
    holds: () => /zeta\(s \+ i tau\) - zeta\(s\)/.test(IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE.bagchiEquivalence.statement),
  },

  // Tripwire 9: verdict is in the allowed set and is the honest combined one.
  {
    id: 'imp1334-verdict-allowed-honest',
    why:
      'The verdict must be one of the three allowed strings and specifically the ' +
      'Bagchi-equivalent / obstruction / no-lever one. A flip to ' +
      'voronin-universality-yields-new-lambda-bound would be a false claim.',
    holds: () => {
      const v = IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE.verdict;
      return (
        IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE.allowedVerdicts.includes(v) &&
        v === 'voronin-bagchi-equivalent-and-rigidity-obstruction-no-direct-lever'
      );
    },
  },

  // Tripwire 10: follow-up names the VU-EFFECTIVE-DENSITY sub-gap.
  {
    id: 'imp1334-followup-names-vu-effective-density',
    why:
      'The honest partial must seed the next step: a follow-up naming the ' +
      'VU-EFFECTIVE-DENSITY sub-gap (prove any explicit lower bound on the universality ' +
      'density d(eps)). Without it the ticket states the gap but fails to route it.',
    holds: () => IMP_1334_VORONIN_UNIVERSALITY_QUANTITATIVE.recommendedFollowup.subGapId === 'VU-EFFECTIVE-DENSITY',
  },
];
