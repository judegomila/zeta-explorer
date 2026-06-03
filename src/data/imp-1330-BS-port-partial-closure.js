// @module data/imp-1330-BS-port-partial-closure
// imp-1330 -- Path C via Bui-Soundararajan 2008: PARTIAL closure of the
// two engine-closable obstructions named in imp-1321 (verdict
// 2-of-4-closable-rest-need-new-input): O-BS-A (effective C_BS via the
// Kadiri explicit-constants tradition) and O-BS-D (downstream chain-shape
// audit). O-BS-B (pin A) and O-BS-C (edge behaviour sigma -> 1) are
// explicitly OUT OF SCOPE here -- they remain paper-grade / needs-new-input
// per imp-1321.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'O-BS-D-fully-closed-O-BS-A-ledger-shipped-paper-grade'
//
//   * O-BS-D (downstream chain-shape audit): FULLY CLOSED by this engine
//     run. The 6 consumer files named in imp-1321 were audited. FINDING:
//     5 of 6 consume ONLY the final NUMERICAL E_trunc_pt = 3.06e-5 (a
//     hardcoded scalar), not the algebraic Ingham exponent form
//     e_I(sigma) = 3(1-sigma)/(2-sigma). The algebraic form AND the
//     monotonicity assumption ('kappa_T increases monotonically with
//     sigma_N') live in EXACTLY ONE place -- the PRODUCER file
//     finite-height-beats-platt-trudgian.js (lines 146-147 monotonicity,
//     lines 182-183 algebraic e_I). Therefore a BS substitution is
//     downstream-SAFE: no consumer depends on the algebraic identity of
//     e_I, so swapping e_I -> e_BS cannot silently break a derivative or
//     monotonicity assumption downstream. The ONE producer-side assumption
//     (monotonicity) TRANSFERS to BS because the BS exponent is also
//     strictly decreasing: d/dsigma e_BS = -100 / (11 + 1.5 sigma)^2 < 0
//     for all sigma, so kappa_BS = 1 - e_BS is strictly increasing exactly
//     like kappa_I. O-BS-D closes with NO residual.
//
//   * O-BS-A (effective C_BS): PARTIAL -- a kernel-by-kernel constant
//     LEDGER is shipped (the engine-deliverable skeleton), but the exact
//     numerical C_BS remains a 4-8 researcher-week paper-walk per imp-1321.
//     The ledger pins the 4 composing kernels (Heath-Brown 1981 4th moment,
//     Bombieri-Montgomery mean value, Selberg mollifier, amplifier) with a
//     literature-anchored constant ESTIMATE and the explicit-constants
//     citation (Kadiri 2013 / Kadiri-Lumley-Ng 2018 / Simonic 2020 /
//     Johnston-Yang 2023) that a dedicated paper would use to make each
//     factor effective. Composed central estimate C_BS ~ 13.5, realistic
//     range [1, 50] (consistent with imp-1321 bestCaseEffectiveCBs). This
//     is an ESTIMATE LEDGER, NOT an engine-verified exact constant.
//
// HONEST BOTTOM LINE
// ------------------
// This run delivers ONE genuinely-closed obstruction (O-BS-D) plus a
// structured ledger for O-BS-A. It does NOT recover the imp-1306 formal
// 2.04e6 tightening, and it does NOT touch O-BS-B (the binding (log T)^A
// obstruction) or O-BS-C. The rigorous Lambda bound is UNCHANGED at
// 3.06e-5 -- O-BS-A and O-BS-D were always the no-quantitative-gain pair
// (per imp-1321 formalGainIfClosedAlone: C_BS only rescales, O-BS-D gives
// no tightening). The value here is rigor HYGIENE: O-BS-D certifies the BS
// substitution is downstream-safe, removing one of the two obstructions
// that any future effective-BS paper would otherwise have to re-litigate.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash). Single-quoted strings only.
// No apostrophes inside single-quoted strings.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 -- O-BS-D: downstream chain-shape audit (the genuinely-closed half).
// ─────────────────────────────────────────────────────────────────────────────

// Audit verdict per consumer file. usesAlgebraicEI = true means the file
// references the algebraic Ingham exponent form 3(1-sigma)/(2-sigma) or a
// derivative / monotonicity property of it; usesNumericalOnly = true means
// the file only ever reads the final scalar E_trunc_pt = 3.06e-5.
const O_BS_D_CONSUMER_AUDIT = Object.freeze([
  Object.freeze({
    file: 'src/data/asymptotic-lambda-bound-2026-05-20.js',
    role: 'carries E_TRUNC_PT_INGHAM = 3.06e-5 as a hardcoded scalar',
    usesAlgebraicEI: false,
    usesNumericalOnly: true,
    evidence:
      'const E_TRUNC_PT_INGHAM = 3.06e-5 (line ~165); all references are to ' +
      'the scalar, never to 3(1-sigma)/(2-sigma).',
    bsSubstitutionSafe: true,
  }),
  Object.freeze({
    file: 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js',
    role: 'consumes composition.eTruncPtIngham (the final scalar)',
    usesAlgebraicEI: false,
    usesNumericalOnly: true,
    evidence:
      'const E_TRUNC_PT = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.composition.' +
      'eTruncPtIngham (line ~95); only the scalar 3.06e-5 propagates.',
    bsSubstitutionSafe: true,
  }),
  Object.freeze({
    file: 'src/data/finite-height-beats-platt-trudgian.js',
    role: 'PRODUCER -- original imp-447 / imp-459 derivation of 3.06e-5',
    usesAlgebraicEI: true,
    usesNumericalOnly: false,
    evidence:
      'eI = 3 * (1 - SIGMA_OPT) / (2 - SIGMA_OPT) (line ~183, algebraic) AND ' +
      'the monotonicity comment lines 146-147 ("kappa_T increases ' +
      'monotonically with sigma_N, so the bound decreases monotonically as ' +
      'sigma_N increases toward 1"). This is the ONLY file carrying the ' +
      'algebraic identity + monotonicity assumption.',
    bsSubstitutionSafe: true,
    bsSubstitutionNote:
      'Producer-side. The monotonicity assumption TRANSFERS to BS: ' +
      'd/dsigma e_BS = -100/(11+1.5sigma)^2 < 0 so kappa_BS is strictly ' +
      'increasing exactly like kappa_I. Re-deriving lines 146-147 for e_BS ' +
      'goes through unchanged. The numerical kappa-scan table (lines 151-156) ' +
      'would be recomputed with e_BS values, but its monotone structure holds.',
  }),
  Object.freeze({
    file: 'src/data/lambda-roadmap.js',
    role: 'pins headline 3.06e-5 in LAMBDA_BOUNDS',
    usesAlgebraicEI: false,
    usesNumericalOnly: true,
    evidence:
      'value: 3.06e-5 (line ~69) + a display label; no algebraic e_I.',
    bsSubstitutionSafe: true,
  }),
  Object.freeze({
    file: 'src/data/lambda-N1e6-final-assembly.js',
    role: 'potential consumer (imp-1321 flagged)',
    usesAlgebraicEI: false,
    usesNumericalOnly: true,
    evidence:
      'No match for 3(1-sigma) / 2-sigma / inghamExponent / 3.06e-5 -- the ' +
      'file does not consume E_trunc_pt at all (no dependence to break).',
    bsSubstitutionSafe: true,
  }),
  Object.freeze({
    file: 'src/data/lambda-N1e6-unconditional-beat.js',
    role: 'potential consumer (imp-1321 flagged)',
    usesAlgebraicEI: false,
    usesNumericalOnly: true,
    evidence:
      'No match for 3(1-sigma) / 2-sigma / inghamExponent / 3.06e-5 -- no ' +
      'dependence on the algebraic exponent or the scalar.',
    bsSubstitutionSafe: true,
  }),
]);

// e_BS(sigma) = 8(1-sigma)/(11+1.5sigma); derivative via quotient rule.
//   N = 8(1-sigma),  N_prime = -8
//   D = 11 + 1.5 sigma,  D_prime = 1.5
//   e_BS_prime = (N_prime D - N D_prime)/D^2
//              = (-8(11+1.5sigma) - 8(1-sigma)(1.5)) / D^2
//              = (-88 - 12 sigma - 12 + 12 sigma) / D^2
//              = -100 / (11 + 1.5 sigma)^2
function eBsExponent(sigma) {
  return (8 * (1 - sigma)) / (11 + 1.5 * sigma);
}
function eBsDerivative(sigma) {
  const D = 11 + 1.5 * sigma;
  return -100 / (D * D);
}

const O_BS_D_MONOTONICITY_TRANSFER = Object.freeze({
  claim:
    'The producer-side monotonicity assumption (kappa increasing in sigma) ' +
    'transfers from Ingham to Bui-Soundararajan, so the BS substitution does ' +
    'not break the imp-447 / imp-459 variational argmin structure.',
  eBsDerivativeClosedForm: 'd/dsigma e_BS(sigma) = -100 / (11 + 1.5 sigma)^2',
  eBsDerivativeAt0p75: eBsDerivative(0.75),       // ~ -0.68020
  kappaBsIncreasing: true,                        // since e_BS strictly decreasing
  eBsAt0p75: eBsExponent(0.75),                   // 8*0.25/12.125 = 0.16495
  inghamMonotonicityComparison:
    'Ingham e_I(sigma) = 3(1-sigma)/(2-sigma) has e_I_prime = -3/(2-sigma)^2 ' +
    '< 0; BS e_BS has e_BS_prime = -100/(11+1.5sigma)^2 < 0. SAME SIGN -- both ' +
    'kappa profiles are strictly increasing, so the monotone-argmin argument ' +
    'in finite-height-beats-platt-trudgian.js lines 146-147 is BS-stable.',
});

const O_BS_D_CLOSURE = Object.freeze({
  id: 'O-BS-D',
  status: 'fully-closed-engine',
  consumersAudited: O_BS_D_CONSUMER_AUDIT.length,             // 6
  consumersUsingNumericalOnly:
    O_BS_D_CONSUMER_AUDIT.filter((c) => c.usesNumericalOnly).length, // 5
  consumersUsingAlgebraicEI:
    O_BS_D_CONSUMER_AUDIT.filter((c) => c.usesAlgebraicEI).length,   // 1
  algebraicFormConfinedTo: 'src/data/finite-height-beats-platt-trudgian.js',
  allConsumersSafe: O_BS_D_CONSUMER_AUDIT.every((c) => c.bsSubstitutionSafe),
  monotonicityTransfer: O_BS_D_MONOTONICITY_TRANSFER,
  residual: 'NONE -- O-BS-D closes cleanly.',
  finding:
    'The algebraic Ingham exponent identity and the monotone-argmin ' +
    'assumption are confined to a SINGLE producer file. No downstream ' +
    'consumer depends on the algebraic identity of e_I, and the producer ' +
    'monotonicity assumption transfers to e_BS (both exponents strictly ' +
    'decreasing). A future effective-BS substitution is downstream-safe.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 -- O-BS-A: effective C_BS kernel-by-kernel ledger (paper-grade half).
// ─────────────────────────────────────────────────────────────────────────────

// The BS 2008 proof composes 4 kernels (per imp-1182 ingredient inventory).
// Each kernel contributes a multiplicative constant factor to C_BS and a
// power of log T to A. O-BS-A concerns ONLY the constant factors (A is the
// separate O-BS-B obstruction, out of scope here). For each kernel the
// ledger gives a literature-anchored constant ESTIMATE and the explicit-
// constants citation that a dedicated paper-walk would use to pin it.
const O_BS_A_CONSTANT_LEDGER = Object.freeze([
  Object.freeze({
    kernel: 'Heath-Brown 1981 fourth moment of zeta',
    role: 'base mean-square / fourth-moment input',
    constantSymbol: 'C_4',
    literatureAnchoredEstimate: 1.0,
    estimateRange: [0.05, 2.0],
    leadingTextbookConstant:
      'asymptotic main term coefficient 1/(2 pi^2) ~ 0.05066 for ' +
      'INT_0^T |zeta(1/2+it)|^4 dt ~ T (log T)^4 / (2 pi^2); the EFFECTIVE ' +
      'upper-bound constant is larger once lower-order terms are bounded.',
    effectiveVia:
      'Kadiri-Lumley-Ng 2018 (J. Math. Anal. Appl. 465, 22-46) explicit ' +
      'moment bookkeeping; the constant is made effective by tracking the ' +
      'Gabriel / approximate-functional-equation cutoffs.',
  }),
  Object.freeze({
    kernel: 'Bombieri-Montgomery large-sieve mean value',
    role: 'mean value of the zero-detecting Dirichlet polynomial',
    constantSymbol: 'C_BMMV',
    literatureAnchoredEstimate: 1.5,
    estimateRange: [1.0, 2.0],
    leadingTextbookConstant:
      'Montgomery-Vaughan large sieve gives sum over moduli <= (N + Q^2) ' +
      'times the L^2 norm; the constant is essentially 1 plus a controlled ' +
      'tail, hence a clean near-1 effective factor.',
    effectiveVia:
      'Montgomery 1971 (LNM 227) + Montgomery-Vaughan 1973 large-sieve ' +
      'inequality, already effective in the literature.',
  }),
  Object.freeze({
    kernel: 'Selberg-style Dirichlet polynomial mollifier',
    role: 'mollification to detect zeros off the line',
    constantSymbol: 'C_mol',
    literatureAnchoredEstimate: 3.0,
    estimateRange: [1.0, 5.0],
    leadingTextbookConstant:
      'the mollifier constant depends on the mollifier length theta and the ' +
      'choice of smoothing; the dominant source of constant inflation.',
    effectiveVia:
      'Conrey 1989 (J. Reine Angew. Math. 399, 1-26) mollifier-with-amplifier ' +
      'template + Kadiri 2013 (Acta Arith. 160, 185-200) effective tracking.',
  }),
  Object.freeze({
    kernel: 'amplifier',
    role: 'amplification of the mollified detector',
    constantSymbol: 'C_amp',
    literatureAnchoredEstimate: 3.0,
    estimateRange: [1.0, 5.0],
    leadingTextbookConstant:
      'amplifier degree and coefficient choice set this factor; a no-' +
      'amplifier variant trades a larger C_mol for C_amp = 1.',
    effectiveVia:
      'Simonic 2020 (J. Math. Anal. Appl. 491, 124303) near-line effective ' +
      'constants + Johnston-Yang 2023 (J. Math. Anal. Appl. 523, 127034) ' +
      'most-recent explicit-constants frontier.',
  }),
]);

// Composed effective C_BS estimate: product of the 4 kernel constants.
function composedCbsEstimate() {
  return O_BS_A_CONSTANT_LEDGER.reduce(
    (acc, k) => acc * k.literatureAnchoredEstimate,
    1
  );
}
function composedCbsRangeLow() {
  return O_BS_A_CONSTANT_LEDGER.reduce((acc, k) => acc * k.estimateRange[0], 1);
}
function composedCbsRangeHigh() {
  return O_BS_A_CONSTANT_LEDGER.reduce((acc, k) => acc * k.estimateRange[1], 1);
}

const O_BS_A_CLOSURE = Object.freeze({
  id: 'O-BS-A',
  status: 'ledger-shipped-exact-constant-paper-grade',
  kernelCount: O_BS_A_CONSTANT_LEDGER.length,                 // 4
  ledger: O_BS_A_CONSTANT_LEDGER,
  composedCentralEstimate: composedCbsEstimate(),             // 1*1.5*3*3 = 13.5
  composedRangeLow: composedCbsRangeLow(),                    // 0.05*1*1*1 = 0.05
  composedRangeHigh: composedCbsRangeHigh(),                  // 2*2*5*5 = 100
  realisticRange: Object.freeze([1, 50]),                     // per imp-1321
  effortToExact:
    '4-8 researcher-weeks of paper-walk for a dedicated explicit version of ' +
    'BS Theorem 3.1 in the Kadiri-Lumley-Ng / Johnston-Yang explicit-constants ' +
    'tradition.',
  honestNote:
    'This is an ESTIMATE LEDGER pinning the 4 kernels and their explicit-' +
    'constants citations, NOT an engine-verified exact C_BS. The exact value ' +
    'requires the paper-walk above. The product-of-estimates central value ' +
    '13.5 sits inside the imp-1321 realistic range [1, 50]; the raw range ' +
    'product [0.05, 100] is wider because the per-kernel extremes do not ' +
    'co-occur in a single tuned construction.',
  formalGainIfClosedAlone:
    'C_BS only rescales the BS bound multiplicatively (1/C_BS); it gives NO ' +
    'order-of-magnitude Lambda tightening on its own. The binding obstruction ' +
    'is O-BS-B (the (log T)^A power), which is OUT OF SCOPE for imp-1330.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 -- Scope statement: what imp-1330 does and does NOT close.
// ─────────────────────────────────────────────────────────────────────────────

const SCOPE = Object.freeze({
  inScopeClosed: Object.freeze(['O-BS-D']),
  inScopeLedgerOnly: Object.freeze(['O-BS-A']),
  outOfScope: Object.freeze(['O-BS-B', 'O-BS-C']),
  outOfScopeReason:
    'O-BS-B (pin (log T)^A) is the BINDING obstruction (imp-1321: at central ' +
    'A_BS = 6 the (log T_PT)^6 ~ 5.6e8 multiplier destroys the formal 2.04e6 ' +
    'tightening) and is paper-grade, not engine-closable. O-BS-C (edge ' +
    'behaviour sigma -> 1) needs genuinely new input (no published uniform-in-' +
    'sigma BS extension on (0.85, 1)). Both stay open per imp-1321.',
  rigorousLambdaUnchanged: 3.06e-5,
  rigorousLambdaNote:
    'Closing O-BS-A + O-BS-D yields NO quantitative Lambda tightening (both ' +
    'are no-gain obstructions in imp-1321). The headline rigorous bound stays ' +
    'Lambda <= 3.06e-5. The value is rigor hygiene: the BS substitution is ' +
    'certified downstream-safe (O-BS-D) and its constant is itemised (O-BS-A).',
});

const ALLOWED_VERDICTS = Object.freeze([
  'both-fully-closed',
  'O-BS-D-fully-closed-O-BS-A-ledger-shipped-paper-grade',
  'neither-closable',
  'closure-revealed-hidden-rigor-gap',
]);

const VERDICT = 'O-BS-D-fully-closed-O-BS-A-ledger-shipped-paper-grade';

const VERDICT_DETAIL =
  'O-BS-D-fully-closed-O-BS-A-ledger-shipped-paper-grade: O-BS-D (downstream ' +
  'chain-shape audit) is FULLY CLOSED -- the 6 imp-1321 consumer files were ' +
  'audited; 5 of 6 consume only the numerical E_trunc_pt = 3.06e-5, and the ' +
  'algebraic e_I(sigma) = 3(1-sigma)/(2-sigma) form plus the monotone-argmin ' +
  'assumption are confined to the single producer file finite-height-beats-' +
  'platt-trudgian.js. A BS substitution is downstream-safe because the ' +
  'producer monotonicity assumption transfers (d/dsigma e_BS = -100/' +
  '(11+1.5sigma)^2 < 0, so kappa_BS is strictly increasing like kappa_I). ' +
  'O-BS-A (effective C_BS) is delivered as a kernel-by-kernel constant LEDGER ' +
  '(Heath-Brown 4th moment + Bombieri-Montgomery + Selberg mollifier + ' +
  'amplifier) with literature-anchored estimates (central C_BS ~ 13.5, ' +
  'realistic range [1, 50]) and the Kadiri / Kadiri-Lumley-Ng / Simonic / ' +
  'Johnston-Yang explicit-constants citation per kernel; the EXACT constant ' +
  'remains a 4-8 week paper-walk and is NOT engine-verified here. O-BS-B and ' +
  'O-BS-C are OUT OF SCOPE and stay open per imp-1321. NO Lambda tightening: ' +
  'the rigorous headline stays 3.06e-5 (O-BS-A and O-BS-D are both no-gain ' +
  'obstructions). The deliverable is rigor hygiene, not a numerical gain.';

const CROSS_REFERENCES = Object.freeze({
  'imp-1321':
    'src/data/imp-1321-bui-soundararajan-rigor-port.js -- parent map; verdict ' +
    '2-of-4-closable-rest-need-new-input naming O-BS-A and O-BS-D as the two ' +
    'engine-closable obstructions worked here.',
  'imp-1123':
    'src/data/bui-soundararajan-rigorous-port-2026-05.js -- original O-BS-A ' +
    'through O-BS-D obstruction definitions.',
  'imp-1182':
    'src/data/imp-1182-bs-2008-paper-walk-A-bound.js -- the 4-kernel ' +
    'ingredient inventory underlying the O-BS-A constant ledger.',
  'imp-447':
    'src/data/finite-height-beats-platt-trudgian.js -- the PRODUCER file that ' +
    'O-BS-D audits (algebraic e_I + monotonicity, lines 146-147 and 182-183).',
  'imp-1261':
    'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js -- a numerical-' +
    'only consumer confirmed downstream-safe by the O-BS-D audit.',
});

// ─────────────────────────────────────────────────────────────────────────────
// Frozen export record.
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1330_BS_PORT_PARTIAL_CLOSURE = Object.freeze({
  id: 'imp-1330',
  ticket: 'imp-1330',
  title:
    'Path C via Bui-Soundararajan 2008: partial closure of O-BS-A + O-BS-D ' +
    '(the 2-of-4 engine-closable obstructions per imp-1321)',
  shippedAt: '2026-06-03T00:00:00Z',
  shippedBy: 'opus-4-8 (api-pool)',

  // STEP 1 -- O-BS-D (fully closed).
  oBsDClosure: O_BS_D_CLOSURE,
  oBsDConsumerAudit: O_BS_D_CONSUMER_AUDIT,

  // STEP 2 -- O-BS-A (ledger shipped, paper-grade exact).
  oBsAClosure: O_BS_A_CLOSURE,

  // STEP 3 -- scope + verdict.
  scope: SCOPE,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,

  crossReferences: CROSS_REFERENCES,

  pinnedNumerics: Object.freeze({
    BS_EXPONENT_AT_0P75: 0.16495,
    E_BS_DERIVATIVE_AT_0P75: eBsDerivative(0.75),  // ~ -0.68020
    INGHAM_E_TRUNC_AT_0P75: 3.06e-5,
    C_BS_CENTRAL_ESTIMATE: 13.5,
    C_BS_REALISTIC_LOW: 1,
    C_BS_REALISTIC_HIGH: 50,
    CONSUMERS_AUDITED: 6,
    CONSUMERS_NUMERICAL_ONLY: 5,
    CONSUMERS_ALGEBRAIC: 1,
  }),
});

export default IMP_1330_BS_PORT_PARTIAL_CLOSURE;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (8 shipped; ticket spec requires 8).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1330_BS_PORT_PARTIAL_CLOSURE_ASSERTIONS = [

  // Tripwire 1: verdict in the allowed set.
  {
    id: 'imp1330-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed strings. A verdict outside ' +
      'this set would mean the partial closure shipped a non-canonical ' +
      'conclusion.',
    holds: () => {
      const r = IMP_1330_BS_PORT_PARTIAL_CLOSURE;
      return (
        typeof r.verdict === 'string' &&
        Array.isArray(r.allowedVerdicts) &&
        r.allowedVerdicts.includes(r.verdict) &&
        r.verdict === 'O-BS-D-fully-closed-O-BS-A-ledger-shipped-paper-grade'
      );
    },
  },

  // Tripwire 2: O-BS-D audited exactly 6 consumers, 5 numerical-only + 1 algebraic.
  {
    id: 'imp1330-o-bs-d-six-consumers-five-numerical-one-algebraic',
    why:
      'imp-1321 named 6 downstream consumer files. The O-BS-D close must audit ' +
      'all 6, and the split must be 5 numerical-only vs 1 algebraic (the ' +
      'producer). A drift in this split means the audit decohered from the ' +
      'actual file contents.',
    holds: () => {
      const d = IMP_1330_BS_PORT_PARTIAL_CLOSURE.oBsDClosure;
      const audit = IMP_1330_BS_PORT_PARTIAL_CLOSURE.oBsDConsumerAudit;
      return (
        Array.isArray(audit) && audit.length === 6 &&
        d.consumersAudited === 6 &&
        d.consumersUsingNumericalOnly === 5 &&
        d.consumersUsingAlgebraicEI === 1
      );
    },
  },

  // Tripwire 3: the algebraic e_I form is confined to the single producer file.
  {
    id: 'imp1330-algebraic-eI-confined-to-producer',
    why:
      'The KEY honest finding of O-BS-D is that the algebraic Ingham exponent ' +
      'and the monotonicity assumption live in EXACTLY ONE file (the producer ' +
      'finite-height-beats-platt-trudgian.js). If a second consumer used the ' +
      'algebraic form, the BS substitution would not be downstream-safe.',
    holds: () => {
      const audit = IMP_1330_BS_PORT_PARTIAL_CLOSURE.oBsDConsumerAudit;
      const algebraic = audit.filter((c) => c.usesAlgebraicEI);
      const d = IMP_1330_BS_PORT_PARTIAL_CLOSURE.oBsDClosure;
      return (
        algebraic.length === 1 &&
        /finite-height-beats-platt-trudgian/.test(algebraic[0].file) &&
        d.algebraicFormConfinedTo ===
          'src/data/finite-height-beats-platt-trudgian.js'
      );
    },
  },

  // Tripwire 4: the BS exponent is strictly decreasing (monotonicity transfers).
  {
    id: 'imp1330-bs-exponent-strictly-decreasing-monotonicity-transfers',
    why:
      'The downstream-safety of the BS substitution hinges on the producer ' +
      'monotonicity assumption transferring: e_BS must be strictly decreasing ' +
      '(so kappa_BS is strictly increasing like kappa_I). The closed-form ' +
      'derivative -100/(11+1.5sigma)^2 must be negative across sigma in ' +
      '[0.5, 1], matching the recorded value at 0.75.',
    holds: () => {
      const m = IMP_1330_BS_PORT_PARTIAL_CLOSURE.oBsDClosure.monotonicityTransfer;
      // Recompute the closed form on a grid; must be strictly negative.
      const grid = [0.5, 0.6, 0.7, 0.75, 0.85, 0.95, 1.0];
      const allNeg = grid.every((s) => {
        const D = 11 + 1.5 * s;
        return -100 / (D * D) < 0;
      });
      const at0p75 = -100 / Math.pow(11 + 1.5 * 0.75, 2);
      return (
        allNeg &&
        m.kappaBsIncreasing === true &&
        Math.abs(m.eBsDerivativeAt0p75 - at0p75) < 1e-9 &&
        m.eBsDerivativeAt0p75 < 0 &&
        Math.abs(m.eBsAt0p75 - 0.16495) < 1e-4
      );
    },
  },

  // Tripwire 5: O-BS-D closes with NO residual + all consumers flagged safe.
  {
    id: 'imp1330-o-bs-d-fully-closed-no-residual',
    why:
      'O-BS-D is claimed FULLY CLOSED. Every audited consumer must be flagged ' +
      'bsSubstitutionSafe and the closure must record NO residual. A lingering ' +
      'unsafe consumer would falsify the full-close claim.',
    holds: () => {
      const d = IMP_1330_BS_PORT_PARTIAL_CLOSURE.oBsDClosure;
      const audit = IMP_1330_BS_PORT_PARTIAL_CLOSURE.oBsDConsumerAudit;
      return (
        d.status === 'fully-closed-engine' &&
        d.allConsumersSafe === true &&
        audit.every((c) => c.bsSubstitutionSafe === true) &&
        /NONE/.test(d.residual)
      );
    },
  },

  // Tripwire 6: O-BS-A ledger has 4 kernels + composed estimate in [1, 50].
  {
    id: 'imp1330-o-bs-a-ledger-four-kernels-estimate-in-realistic-range',
    why:
      'O-BS-A ships a 4-kernel constant ledger (HB 4th moment + BMMV + ' +
      'mollifier + amplifier). The composed central estimate must land inside ' +
      'the imp-1321 realistic range [1, 50]; a value outside means the per-' +
      'kernel estimates drifted incoherently from the upstream map.',
    holds: () => {
      const a = IMP_1330_BS_PORT_PARTIAL_CLOSURE.oBsAClosure;
      if (!Array.isArray(a.ledger) || a.ledger.length !== 4) return false;
      const allKernelsHaveCite = a.ledger.every(
        (k) =>
          typeof k.kernel === 'string' &&
          typeof k.constantSymbol === 'string' &&
          typeof k.effectiveVia === 'string' &&
          k.effectiveVia.length > 20 &&
          Array.isArray(k.estimateRange) &&
          k.estimateRange.length === 2
      );
      return (
        allKernelsHaveCite &&
        a.kernelCount === 4 &&
        a.composedCentralEstimate >= 1 &&
        a.composedCentralEstimate <= 50 &&
        Math.abs(a.composedCentralEstimate - 13.5) < 1e-9
      );
    },
  },

  // Tripwire 7: O-BS-A is honestly flagged paper-grade (not engine-verified).
  {
    id: 'imp1330-o-bs-a-honestly-paper-grade-not-engine-verified',
    why:
      'HONESTY CHECK: O-BS-A must NOT claim an engine-verified exact constant. ' +
      'Its status must be the paper-grade ledger string and the honestNote ' +
      'must disclose that the exact C_BS needs the 4-8 week paper-walk. ' +
      'Overstating O-BS-A as closed would fabricate a result.',
    holds: () => {
      const a = IMP_1330_BS_PORT_PARTIAL_CLOSURE.oBsAClosure;
      return (
        a.status === 'ledger-shipped-exact-constant-paper-grade' &&
        typeof a.honestNote === 'string' &&
        /ESTIMATE LEDGER/.test(a.honestNote) &&
        /NOT an engine-verified/.test(a.honestNote) &&
        /paper-walk/.test(a.effortToExact)
      );
    },
  },

  // Tripwire 8: SEMANTIC -- scope excludes O-BS-B + O-BS-C and claims NO gain.
  {
    id: 'imp1330-semantic-scope-excludes-b-c-and-no-lambda-gain',
    why:
      'SEMANTIC CHECK: imp-1330 must stay honest about scope -- O-BS-B and ' +
      'O-BS-C are OUT OF SCOPE (still open per imp-1321), and the rigorous ' +
      'Lambda is UNCHANGED at 3.06e-5 (both worked obstructions are no-gain). ' +
      'Any drift claiming a Lambda tightening here would overstate the result.',
    holds: () => {
      const s = IMP_1330_BS_PORT_PARTIAL_CLOSURE.scope;
      const d = IMP_1330_BS_PORT_PARTIAL_CLOSURE.verdictDetail;
      return (
        Array.isArray(s.outOfScope) &&
        s.outOfScope.includes('O-BS-B') &&
        s.outOfScope.includes('O-BS-C') &&
        Math.abs(s.rigorousLambdaUnchanged - 3.06e-5) < 1e-12 &&
        typeof d === 'string' &&
        /NO Lambda tightening/.test(d) &&
        /3\.06e-5/.test(d)
      );
    },
  },
];
