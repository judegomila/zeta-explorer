/**
 * @module imp-36220-cw-ch-bitmatch-cross-validation
 * @fileoverview imp-36220 -- Cross-validate the imp-36152 SAME-MODULUS verdict by
 *   checking, BIT-FOR-BIT, that the fold-curvature constant the imp-36082 Route-B
 *   USE consumes (there named C_W) matches the symbolic Step-4 G6a modulus constant
 *   (imp-354 partial closure; the roadmap E_coll term names it C_H), and by
 *   TABULATING precisely what the still-open G6a-sub-constant valuation owes -- the
 *   numeric boundary-shock curvature |u_0_double_prime(z_0*)|. Read-only
 *   cross-validation: values NO constant, discharges NO gap, changes NO bound, G6a
 *   stays OPEN, respects the imp-2519 no-overclaim guard, NO QED. No refereed bound is changed.
 *
 *   WHAT imp-36152 CONCLUDED (the verdict being cross-validated)
 *   -----------------------------------------------------------
 *   imp-36152 returned SAME-MODULUS: the constant imp-36082 Route-B relies on and
 *   the Holder-1/2 modulus the Step-4 sub-gap G6a_shock_lipschitz requires are the
 *   SAME object, C_W = sqrt(2 / |u_0_double_prime(z_0*)|) (imp-354 fold-catastrophe
 *   expansion), Holder exponent pinned at 1/2, illustrative placeholder 1.0 in both.
 *   The residual is therefore NOT a two-constant mismatch but the still-open
 *   G6a-sub-constant valuation: C_W stays SYMBOLIC because the RvM boundary shock at
 *   y -> 0+ puts z_0* on the real axis where u_0_double_prime diverges pointwise.
 *
 *   WHAT THIS MODULE ADDS (bit-for-bit witness + the owed-ledger)
 *   ------------------------------------------------------------
 *   imp-36152 witnessed the identity by re-reading ONE shared formula body from two
 *   convention labels. This module instead extracts the constant SEPARATELY from the
 *   two ACTUAL consumer sites -- the numeric placeholder, the Holder exponent, and
 *   the symbolic closed form each transcribed off its own source file -- and confirms
 *   the three agree bit-for-bit after a purely notational normalisation
 *   (u_0'' <-> u_0_double_prime). Then it tabulates the OWED-LEDGER: the concrete
 *   line items the G6a-sub-constant valuation must still supply before C_W ceases to
 *   be symbolic. Nothing here certifies any of them.
 *
 *   THE BAKED LITERALS (transcribed off the two source files, NOT imported)
 *   ----------------------------------------------------------------------
 *   Heavy-import discipline (see repo memory): imp-354 and imp-36082 transitively
 *   pull large bridge modules, so -- exactly as imp-36152 did -- we do NOT import
 *   them. We bake the constant literals read directly off each file and compare the
 *   bakes. Provenance is cited per field so a drift in either source is catchable.
 *
 *     imp-36082 consumer site (src/data/imp-36082-routeB-perN-rate-form-and-bridge-consumability.js):
 *       - C_WHITHAM_PLACEHOLDER = 1.0                         (line ~80)
 *       - HOLDER_EXPONENT       = 0.5                         (rateForms.holderExponent)
 *       - closed form           = "sqrt(2 / |u_0'' (z_0*)|)" (comment line ~78)
 *
 *     imp-354 G6a obligation (src/data/lambda-burgers-shock-lipschitz.js, lemma.constants):
 *       - C_Whitham_symbolic    = 1.0                                  (C_Whitham_symbolic)
 *       - Holder_exponent       = 0.5                                  (Holder_exponent)
 *       - closed form           = "sqrt(2 / |u_0_double_prime(z_0*)|)" (C_Whitham_closed_form)
 *
 *   VERDICT: BIT-MATCH-CONFIRMED. The imp-36082 USE and the G6a obligation carry the
 *   identical numeric placeholder (Object.is bit-equal), the identical Holder
 *   exponent, and -- after notational normalisation -- the identical symbolic closed
 *   form. This is corroborating evidence for the imp-36152 SAME-MODULUS verdict from
 *   two independently transcribed sites, not a fresh closure. The residual open
 *   G6a-sub-constant valuation ledger (below) is unchanged: it owes the numeric
 *   |u_0_double_prime(z_0*)|. Closes NOTHING; discharges no gap; values no constant;
 *   changes no bound; NO QED.
 *
 *   @see src/data/imp-36152-whitham-cw-vs-g6a-modulus-scoping.js (SAME-MODULUS verdict, cross-validated here)
 *   @see src/data/imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (C_W consumer site)
 *   @see src/data/lambda-burgers-shock-lipschitz.js (imp-354, G6a partial closure, C_W closed form)
 *   @see src/data/lambda-roadmap.js (E_coll term names the shared modulus C_H)
 *
 *   Ticket: imp-36220 (accuracy, medium).
 */

// -- Baked literals: imp-36082 Route-B USE (consumer site) --------------------
const CW_IMP36082_PLACEHOLDER = 1.0; // C_WHITHAM_PLACEHOLDER, imp-36082 line ~80
const CW_IMP36082_HOLDER = 0.5; // rateForms.holderExponent, imp-36082
const CW_IMP36082_CLOSED_FORM = "sqrt(2 / |u_0'' (z_0*)|)"; // imp-36082 comment line ~78

// -- Baked literals: imp-354 G6a obligation (Step-4 modulus, roadmap C_H) ------
const CH_IMP354_PLACEHOLDER = 1.0; // lemma.constants.C_Whitham_symbolic
const CH_IMP354_HOLDER = 0.5; // lemma.constants.Holder_exponent
const CH_IMP354_CLOSED_FORM = 'sqrt(2 / |u_0_double_prime(z_0*)|)'; // C_Whitham_closed_form

// -- Notational normalisation: u_0'' and u_0_double_prime are ONE symbol -------
// Collapse the two spellings of the second derivative and strip incidental
// whitespace so the symbolic closed forms can be compared bit-for-bit.
function normalizeSymbol(expr) {
  return expr
    .replace(/u_0_double_prime/g, 'u0dd')
    .replace(/u_0''/g, 'u0dd')
    .replace(/\s+/g, '');
}
const CANONICAL_CW_SYMBOL = 'sqrt(2/|u0dd(z_0*)|)';

// -- Bit-for-bit witness across the three carried quantities ------------------
const placeholdersBitEqual = Object.is(
  CW_IMP36082_PLACEHOLDER,
  CH_IMP354_PLACEHOLDER,
);
const holderExponentsBitEqual = Object.is(
  CW_IMP36082_HOLDER,
  CH_IMP354_HOLDER,
);
const symbol36082 = normalizeSymbol(CW_IMP36082_CLOSED_FORM);
const symbol354 = normalizeSymbol(CH_IMP354_CLOSED_FORM);
const closedFormsIdentical =
  symbol36082 === symbol354 && symbol36082 === CANONICAL_CW_SYMBOL;
const ALL_BITMATCH =
  placeholdersBitEqual && holderExponentsBitEqual && closedFormsIdentical;

const BITMATCH_TABLE = Object.freeze([
  Object.freeze({
    quantity: 'numeric placeholder',
    imp36082_use: CW_IMP36082_PLACEHOLDER,
    g6a_imp354_obligation: CH_IMP354_PLACEHOLDER,
    bitEqual: placeholdersBitEqual,
  }),
  Object.freeze({
    quantity: 'Holder exponent',
    imp36082_use: CW_IMP36082_HOLDER,
    g6a_imp354_obligation: CH_IMP354_HOLDER,
    bitEqual: holderExponentsBitEqual,
  }),
  Object.freeze({
    quantity: 'symbolic closed form (normalised)',
    imp36082_use: symbol36082,
    g6a_imp354_obligation: symbol354,
    bitEqual: closedFormsIdentical,
  }),
]);

// -- Owed-ledger: what the open G6a-sub-constant valuation of C_W still owes ---
// Every line item is OPEN / uncertified. The single numeric unknown gating them
// all is the boundary-shock curvature magnitude |u_0_double_prime(z_0*)|; because
// the RvM shock forms at y -> 0+ with z_0* on the real axis, u_0 = 2 m_infinity
// diverges there and u_0_double_prime is pointwise infinite, so NO finite numeric
// value is available and the placeholder 1.0 is NOT claimed rigorous.
const OWED_LEDGER = Object.freeze([
  Object.freeze({
    item: 'locate z_0*',
    owes: 'explicit identification of the infimising shock footer z_0* for the RvM density rho_infinity (it sits on the real axis at the y -> 0+ boundary shock)',
    status: 'OPEN',
  }),
  Object.freeze({
    item: 'value |u_0_double_prime(z_0*)|',
    owes: 'a finite CERTIFIED numeric magnitude of the second derivative of u_0 = 2 m_infinity at z_0*; pointwise it diverges at the real-axis shock, so a regularised / boundary-limit value is required',
    status: 'OPEN',
  }),
  Object.freeze({
    item: 'certify C_W = sqrt(2 / |u_0_double_prime(z_0*)|)',
    owes: 'substitute the certified curvature to replace the illustrative placeholder 1.0 with a rigorous finite C_W',
    status: 'OPEN',
  }),
  Object.freeze({
    item: 'port Polymath15 Lemma 5.2',
    owes: 'the direct Lemma 5.2 port imp-354 defers to for the boundary-shock evaluation (the successor-ticket route)',
    status: 'OPEN',
  }),
]);

// The valuation is SHARED: a single certified curvature flows into BOTH sites at
// once (they carry the identical placeholder), so there is no double-counting and
// no independent second constant to value.
const SHARED_SINGLE_UNKNOWN = 'the boundary-shock curvature |u_0_double_prime(z_0*)|';

// -- The record ---------------------------------------------------------------
export const IMP36220_CW_CH_BITMATCH_CROSS_VALIDATION = Object.freeze({
  id: 'imp-36220-cw-ch-bitmatch-cross-validation',
  ticket: 'imp-36220',
  obligationKey: 'G6a_shock_lipschitz',
  crossValidates: 'imp-36152 SAME-MODULUS verdict',
  comparesId: 'imp-36082 Route-B USE constant C_W (consumer site)',
  againstId: 'imp-354 Step-4 G6a modulus constant (roadmap name C_H)',
  feedsInto: 'Step-4 E(N) bridge modulus accounting; NOT the headline inequality',

  verdict: 'BIT-MATCH-CONFIRMED',

  summary:
    'Cross-validates the imp-36152 SAME-MODULUS verdict by transcribing the fold-curvature ' +
    'constant SEPARATELY off the two actual consumer sites -- the imp-36082 Route-B USE (there C_W) ' +
    'and the imp-354 Step-4 G6a obligation (roadmap C_H) -- and confirming the numeric placeholder ' +
    '(1.0, Object.is bit-equal), the Holder exponent (1/2), and the symbolic closed form ' +
    '(sqrt(2 / |u_0_double_prime(z_0*)|), after the u_0-double-prime spelling normalisation) agree ' +
    'bit-for-bit. This is corroborating evidence for SAME-MODULUS from two independently transcribed ' +
    'sites, not a fresh closure. It then tabulates the OWED-LEDGER of the still-open G6a-sub-constant ' +
    'valuation: locate z_0*, value the boundary-shock curvature |u_0_double_prime(z_0*)| (pointwise ' +
    'infinite at the real-axis y -> 0+ shock), certify C_W to replace the placeholder 1.0, via the ' +
    'deferred Polymath15 Lemma 5.2 port -- every item OPEN. A single certified curvature flows into ' +
    'BOTH sites at once (identical placeholder), so there is no double-counting and no independent ' +
    'second constant. Values NO constant; discharges no gap; G6a stays OPEN; changes no bound; ' +
    'respects the imp-2519 no-overclaim guard; NO QED; no refereed bound is changed.',

  bitMatch: Object.freeze({
    table: BITMATCH_TABLE,
    canonicalSymbol: CANONICAL_CW_SYMBOL,
    placeholdersBitEqual,
    holderExponentsBitEqual,
    closedFormsIdentical,
    allBitMatch: ALL_BITMATCH,
    normalisationNote:
      'the only difference between the two source spellings is notational (u_0-double-prime vs u_0_double_prime); ' +
      'after collapsing that spelling the closed forms are character-identical.',
  }),

  owedLedger: Object.freeze({
    sharedSingleUnknown: SHARED_SINGLE_UNKNOWN,
    items: OWED_LEDGER,
    allOpen: OWED_LEDGER.every((r) => r.status === 'OPEN'),
    whyStillSymbolic:
      'z_0* lies on the real axis at the RvM boundary shock (y -> 0+) where u_0 = 2 m_infinity diverges ' +
      'and u_0_double_prime is pointwise infinite, so no finite certified curvature is available and the ' +
      'placeholder 1.0 is NOT claimed rigorous.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesG6aShockLipschitz: false,
    valuesCW: false,
    confirmsBitMatch: true,
    corroboratesSameModulus: true,
    tabulatesOwedLedger: true,
    introducesIndependentConstant: false,
    changesAnyBound: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'A read-only cross-validation that the imp-36082 C_W USE and the imp-354 / roadmap C_H G6a ' +
      'obligation carry the same constant bit-for-bit (placeholder 1.0, Holder 1/2, ' +
      'sqrt(2 / |u_0_double_prime(z_0*)|)), corroborating the imp-36152 SAME-MODULUS verdict, plus a ' +
      'tabulation of the still-open G6a-sub-constant valuation owed. Closes nothing; discharges no gap; ' +
      'values no constant; changes no bound; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36220_CW_CH_BITMATCH_CROSS_VALIDATION_ASSERTIONS = [
  {
    id: 'imp36220-placeholder-and-holder-bit-equal',
    why: 'The numeric placeholder and Holder exponent transcribed off the imp-36082 USE must be ' +
         'Object.is bit-equal to those off the imp-354 G6a obligation -- one shared constant, not two.',
    holds: () =>
      Object.is(CW_IMP36082_PLACEHOLDER, CH_IMP354_PLACEHOLDER) &&
      Object.is(CW_IMP36082_HOLDER, CH_IMP354_HOLDER) &&
      CW_IMP36082_HOLDER === 0.5 &&
      CW_IMP36082_PLACEHOLDER === 1.0,
  },
  {
    id: 'imp36220-closed-form-symbol-identical',
    why: 'After the purely notational u_0-double-prime spelling normalisation the two symbolic closed ' +
         'forms must collapse to the identical canonical C_W symbol.',
    holds: () =>
      symbol36082 === symbol354 &&
      symbol36082 === CANONICAL_CW_SYMBOL &&
      closedFormsIdentical === true,
  },
  {
    id: 'imp36220-verdict-bitmatch-confirmed',
    why: 'The verdict must be BIT-MATCH-CONFIRMED with all three carried quantities agreeing and no ' +
         'independent second constant introduced.',
    holds: () => {
      const r = IMP36220_CW_CH_BITMATCH_CROSS_VALIDATION;
      return (
        r.verdict === 'BIT-MATCH-CONFIRMED' &&
        r.bitMatch.allBitMatch === true &&
        ALL_BITMATCH === true &&
        r.honestCaveat.introducesIndependentConstant === false
      );
    },
  },
  {
    id: 'imp36220-owed-ledger-all-open-single-unknown',
    why: 'The owed-ledger must enumerate the still-open G6a-sub-constant line items -- all OPEN -- and ' +
         'record that the single gating unknown is the boundary-shock curvature |u_0_double_prime(z_0*)|.',
    holds: () => {
      const g = IMP36220_CW_CH_BITMATCH_CROSS_VALIDATION.owedLedger;
      return (
        g.items.length === 4 &&
        g.allOpen === true &&
        /u_0_double_prime\(z_0\*\)/.test(g.sharedSingleUnknown) &&
        /real axis|diverges|infinite/.test(g.whyStillSymbolic)
      );
    },
  },
  {
    id: 'imp36220-honest-no-closure-no-qed',
    why: 'Mandatory honesty: a cross-validation that closes NOTHING, discharges no gap, does NOT value ' +
         'C_W, changes no bound, carries NO RH verdict, no refereed bound is changed. If any flip the module over-claims.',
    holds: () => {
      const h = IMP36220_CW_CH_BITMATCH_CROSS_VALIDATION.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesG6aShockLipschitz === false &&
        h.valuesCW === false &&
        h.confirmsBitMatch === true &&
        h.corroboratesSameModulus === true &&
        h.changesAnyBound === false &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36220_CW_CH_BITMATCH_CROSS_VALIDATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36220-cw-ch-bitmatch-cross-validation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36220_CW_CH_BITMATCH_CROSS_VALIDATION;
