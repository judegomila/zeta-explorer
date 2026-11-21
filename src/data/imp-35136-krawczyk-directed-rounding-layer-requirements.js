/**
 * @module imp-35136-krawczyk-directed-rounding-layer-requirements
 *
 * imp-35136 (accuracy, frontier): SCOPING ONLY. The glossary records imp-34687a and imp-34714a as
 * still-OPEN named sub-gaps -- the Krawczyk existence-uniqueness certificate (imp-34714) holds as EXACT
 * real analysis, but its exact-digit width is not machine-certified until an actual directed-rounding /
 * error-bounded arithmetic layer is supplied. The imp-34726/imp-34752/imp-34776 outward-ULP slack studies
 * MEASURE how much room such a layer would have; they are NOT that layer. This module enumerates the
 * concrete obligations that layer must discharge, so the open sub-gap is scoped explicitly rather than only
 * named. It discharges NONE of them.
 *
 * WHY THE DOUBLE-PRECISION CHECK IS NOT A CERTIFICATE
 * --------------------------------------------------
 * imp-34714 checked (H1) 0 not in [f_prime] and (H2) the Newton image N([T]) = m - f(m)/[f_prime] strictly
 * inside [T] using ordinary IEEE-754 doubles. A double has one rounding mode active (round-to-nearest) and
 * stock JS Math exposes no directed-rounding control, so the computed f(m) and [f_prime] are guaranteed only
 * to APPROXIMATE the true real values, not to CONTAIN them. A machine certificate needs every arithmetic
 * step to be an outward-rounded ENCLOSURE of the true value; that is the missing layer imp-34687a/imp-34714a
 * name.
 *
 * THE FIVE CONCRETE OBLIGATIONS (each OPEN)
 * ----------------------------------------
 * G1 rounding-mode control: a way to force round-toward-plus-infinity and round-toward-minus-infinity on the
 *    primitive +, -, *, / so each result can be widened outward. Stock JS Math.fround/Math arithmetic gives
 *    only round-to-nearest; the layer must emulate directed rounding (mpfi-style, or Dekker/TwoSum
 *    error-free-transform-style, or a next-after outward-nudge per operation).
 * G2 interval evaluation of the transcendental primitives: f(T) = (T/2pi)(log(T/2pi)-1) - N and the
 *    derivative range [f_prime] = [log(T_lo/2pi), log(T_hi/2pi)]/2pi both call log. The layer needs a
 *    correctly-outward-rounded log (and the 2pi constant enclosed), so [log] contains the true logarithm --
 *    JS Math.log is round-to-nearest with no containment guarantee.
 * G3 interval evaluation of the Krawczyk / Newton operator: build [f](m), [f_prime], the reciprocal
 *    1/[f_prime] and the image N([T]) = m - [f](m)/[f_prime] entirely in outward-rounded interval arithmetic,
 *    including the contraction factor rho = mag(1 - f_prime(m)^-1 [f_prime]).
 * G4 propagated-slack accounting: track the outward ULP added at every operation so the final enclosure width
 *    is a certified bound, not an estimate. This is what the imp-34726/34752/34776 slack budget k* would be
 *    spent against; those studies measure the budget under a surrogate widening model, they do not propagate
 *    real slack.
 * G5 certified verification of (H1)-(H2): decide 0 not in [f_prime] and N([T]) strictly inside [T] from the
 *    CERTIFIED enclosures of G1-G4, so the existence-uniqueness conclusion is machine-checked, not a
 *    double-precision artifact (F(m) = 0 in doubles is such an artifact).
 *
 * SCOPING ONLY: this module discharges NONE of G1-G5; it names them. imp-34687a and imp-34714a REMAIN OPEN.
 * Nothing here instantiates a directed-rounding layer, and the exact-digit width stays uncertified. The
 * inherited imp-3220/imp-3406 surrogate crossover map is NOT rigorous; C_C = 1/8 ansatz (imp-2642/imp-2643)
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see imp-34687-crossover-interval-arithmetic-scope (the enclosure-width surrogate; named sub-gap imp-34687a)
 * @see imp-34726/imp-34752/imp-34776 (the outward-ULP slack-budget studies: budget, NOT the layer)
 */

// The five obligations a real directed-rounding / error-bounded layer must discharge to certify the
// exact-digit width the current studies leave uncertified. closed:false on EVERY one -- this is a scope, not
// a discharge.
const OBLIGATIONS = [
  {
    key: 'G1-rounding-mode-control',
    need: 'force round-toward-plus-infinity / round-toward-minus-infinity on +, -, *, / so every result widens outward',
    machinery: 'directed-rounding emulation (mpfi-style, Dekker/TwoSum error-free transform, or per-op next-after outward nudge)',
    whyStockFails: 'stock JS arithmetic is round-to-nearest only; no directed-rounding mode is exposed',
    closed: false,
  },
  {
    key: 'G2-transcendental-enclosure',
    need: 'a correctly-outward-rounded log (and enclosed 2pi) so [log(T/2pi)] CONTAINS the true logarithm',
    machinery: 'certified interval log / correctly-rounded elementary-function library with an enclosed 2pi constant',
    whyStockFails: 'Math.log is round-to-nearest with no containment guarantee; the derivative range needs [log], not log',
    closed: false,
  },
  {
    key: 'G3-krawczyk-operator-interval-eval',
    need: 'evaluate [f](m), [f_prime], 1/[f_prime] and the Newton image N([T]) = m - [f](m)/[f_prime] in interval arithmetic',
    machinery: 'outward-rounded interval +, -, *, / built on G1, plus the mag() contraction factor rho = mag(1 - f_prime(m)^-1 [f_prime])',
    whyStockFails: 'the current check evaluates each of these as a single double, not as an enclosing interval',
    closed: false,
  },
  {
    key: 'G4-propagated-slack-accounting',
    need: 'track the outward ULP added at every operation so the final enclosure width is a CERTIFIED bound, not an estimate',
    machinery: 'per-operation slack propagation against a budget (the imp-34726/34752/34776 k* is that budget, measured under a surrogate widening model, not propagated real slack)',
    whyStockFails: 'the slack studies model the budget on a gamma(n)/k eps surrogate; they do not propagate slack through a real evaluation',
    closed: false,
  },
  {
    key: 'G5-certified-H1-H2-verification',
    need: 'decide (H1) 0 not in [f_prime] and (H2) N([T]) strictly inside [T] from the CERTIFIED enclosures of G1-G4',
    machinery: 'interval membership / strict-containment tests on the outward-rounded intervals from G1-G4',
    whyStockFails: 'the current (H1)-(H2) check runs on double-precision surrogate values; F(m) = 0 is a double-precision artifact',
    closed: false,
  },
];

const OBLIGATION_COUNT = OBLIGATIONS.length; // 5
const ALL_OPEN = OBLIGATIONS.every((o) => o.closed === false);
const NONE_CLOSED = OBLIGATIONS.filter((o) => o.closed === true).length === 0;

// The slack studies imp-34726/34752/34776 are the BUDGET a real layer would spend (G4), NOT the layer itself.
const SLACK_STUDIES_ARE_BUDGET_NOT_LAYER = true;

export const IMP35136_KRAWCZYK_DIRECTED_ROUNDING_LAYER_REQUIREMENTS = {
  id: 'imp-35136',
  proofSection: 'S-frontier',
  question:
    'The glossary records imp-34687a and imp-34714a as still-OPEN named sub-gaps: the Krawczyk ' +
    'existence-uniqueness certificate holds in principle but its exact-digit width is not certified until an ' +
    'actual directed-rounding / error-bounded arithmetic layer is supplied, and the imp-34726/34752/34776 ' +
    'outward-ULP slack studies are not that layer. Enumerate the concrete requirements such a layer would ' +
    'need. Scoping only; sub-gaps remain OPEN; changes no bound; NO QED.',
  obligations: OBLIGATIONS,
  constants: {
    obligation_count: OBLIGATION_COUNT, // 5
    all_open: ALL_OPEN, // true (this is a scope, not a discharge)
    slack_studies_are_budget_not_layer: SLACK_STUDIES_ARE_BUDGET_NOT_LAYER, // true (imp-34726/34752/34776 measure G4 budget)
  },
  finding:
    'A directed-rounding / error-bounded arithmetic layer that would certify the exact-digit width the ' +
    'current imp-34714 check leaves uncertified must discharge FIVE concrete obligations, all OPEN: ' +
    '(G1) rounding-mode control to widen every +, -, *, / outward, which stock round-to-nearest JS ' +
    'arithmetic cannot do; (G2) a correctly-outward-rounded log (and enclosed 2pi) so the derivative range ' +
    '[log(T/2pi)] contains the true logarithm; (G3) interval evaluation of the whole Krawczyk / Newton ' +
    'operator N([T]) = m - [f](m)/[f_prime] and the contraction factor rho; (G4) per-operation propagated ' +
    'slack so the final enclosure width is a certified bound -- the imp-34726/34752/34776 k* is the BUDGET ' +
    'a real layer would spend against, measured under a surrogate widening model, NOT propagated real slack; ' +
    'and (G5) a certified decision of (H1) 0 not in [f_prime] and (H2) N([T]) strictly inside [T] from those ' +
    'enclosures. SCOPING ONLY: this discharges none of G1-G5; F(m) = 0 remains a double-precision artifact.',
  subGap:
    'imp-34687a AND imp-34714a REMAIN OPEN. Enumerating the five obligations G1-G5 does NOT supply any of ' +
    'them: no directed-rounding layer is instantiated, no transcendental enclosure is built, and the ' +
    'exact-digit width of the Krawczyk certificate stays uncertified. The imp-34726/34752/34776 slack budget ' +
    'is the room a real G4 accounting would have, not the accounting itself. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'DIRECTED-ROUNDING LAYER REQUIREMENTS SCOPE (frontier, NOT an RH bound). The imp-34714 Krawczyk ' +
    'existence-uniqueness lemma is EXACT real analysis, but its (H1)-(H2) check ran in round-to-nearest ' +
    'double precision, so the exact-digit width is a surrogate, not a machine certificate -- the still-OPEN ' +
    'imp-34687a / imp-34714a sub-gap. This module enumerates the five concrete obligations a real ' +
    'directed-rounding / error-bounded arithmetic layer must discharge to close that gap: (G1) directed ' +
    'rounding-mode control, (G2) certified transcendental (log) enclosure, (G3) interval evaluation of the ' +
    'Krawczyk / Newton operator, (G4) propagated-slack accounting (the imp-34726/34752/34776 k* is the ' +
    'BUDGET, not the layer), and (G5) certified verification of (H1)-(H2) from the enclosures. SCOPING ONLY: ' +
    'it discharges NONE of them; imp-34687a and imp-34714a REMAIN OPEN and the exact-digit width stays ' +
    'uncertified. Measurement / scoping on the inherited imp-3220/imp-3406 surrogate crossover map; the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34714 (exact Krawczyk existence-uniqueness lemma; named sub-gap imp-34714a); imp-34687 (crossover ' +
    'interval-arithmetic enclosure-width surrogate; named sub-gap imp-34687a); imp-34726/34752/34776 ' +
    '(outward-ULP slack-budget k* studies: the budget a real G4 accounting spends against, NOT the layer); ' +
    'imp-2642/2643 (C_C 1/8 ansatz); imp-486 (C_mb GUE-conditional). Enumeration of a known open obligation: ' +
    'no new derivation.',
};

export const IMP35136_KRAWCZYK_DIRECTED_ROUNDING_LAYER_REQUIREMENTS_ASSERTIONS = [
  {
    // Exactly five concrete obligations are enumerated (G1-G5).
    id: 'imp35136-five-obligations-enumerated',
    description: 'the layer scope enumerates exactly five concrete obligations G1-G5',
    holds: () => OBLIGATION_COUNT === 5 && new Set(OBLIGATIONS.map((o) => o.key)).size === 5,
  },
  {
    // Every obligation carries a need, machinery, whyStockFails and closed:false field (a scope, not a discharge).
    id: 'imp35136-every-obligation-open-and-fully-specified',
    description: 'every obligation is fully specified (need/machinery/whyStockFails) and closed:false',
    holds: () =>
      ALL_OPEN &&
      NONE_CLOSED &&
      OBLIGATIONS.every(
        (o) =>
          typeof o.need === 'string' &&
          o.need.length > 0 &&
          typeof o.machinery === 'string' &&
          o.machinery.length > 0 &&
          typeof o.whyStockFails === 'string' &&
          o.whyStockFails.length > 0,
      ),
  },
  {
    // The slack studies are explicitly scoped as the G4 budget, not the layer itself.
    id: 'imp35136-slack-studies-are-budget-not-layer',
    description: 'imp-34726/34752/34776 are scoped as the G4 budget, not the directed-rounding layer',
    holds: () =>
      SLACK_STUDIES_ARE_BUDGET_NOT_LAYER === true &&
      /BUDGET/.test(IMP35136_KRAWCZYK_DIRECTED_ROUNDING_LAYER_REQUIREMENTS.finding) &&
      /NOT propagated real slack/.test(IMP35136_KRAWCZYK_DIRECTED_ROUNDING_LAYER_REQUIREMENTS.finding),
  },
  {
    // Honesty gate: scoping only, not rigorous, BOTH sub-gaps open, no QED, no refereed bound is changed.
    id: 'imp35136-honesty-gate-no-qed',
    description: 'scoping: isRigorous false, imp-34687a and imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35136_KRAWCZYK_DIRECTED_ROUNDING_LAYER_REQUIREMENTS.isRigorous === false &&
      /imp-34687a/.test(IMP35136_KRAWCZYK_DIRECTED_ROUNDING_LAYER_REQUIREMENTS.subGap) &&
      /imp-34714a/.test(IMP35136_KRAWCZYK_DIRECTED_ROUNDING_LAYER_REQUIREMENTS.subGap) &&
      /REMAIN OPEN/.test(IMP35136_KRAWCZYK_DIRECTED_ROUNDING_LAYER_REQUIREMENTS.subGap) &&
      /NO QED/.test(IMP35136_KRAWCZYK_DIRECTED_ROUNDING_LAYER_REQUIREMENTS.verdict) &&
      /refereed bound is changed/i.test(IMP35136_KRAWCZYK_DIRECTED_ROUNDING_LAYER_REQUIREMENTS.verdict),
  },
];

for (const a of IMP35136_KRAWCZYK_DIRECTED_ROUNDING_LAYER_REQUIREMENTS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35136-krawczyk-directed-rounding-layer-requirements assertion failed: ${a.id}`);
  }
}
