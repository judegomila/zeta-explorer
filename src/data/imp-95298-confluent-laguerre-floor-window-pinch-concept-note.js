/**
 * @module imp-95298-confluent-laguerre-floor-window-pinch-concept-note
 * @fileoverview imp-95298 -- import-light concept note restating the imp-95286
 *   THEOREM CONF-LB closed-form confluent floor Lambda_conf and its COROLLARY
 *   WINDOW-PINCH bracket in plain terms, for readers landing on the imp-95251
 *   seam-chain COAL-N ledger without wanting to read the full Laguerre-identity
 *   proof.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95286 already proves LEMMA LT, THEOREM CONF-LB, COROLLARY CONF-EXACT
 *   and COROLLARY WINDOW-PINCH in full (generating-function + Laplace-transform
 *   + Parseval argument). This note bakes a plain-language restatement of what
 *   the confluent span is, why the floor plus the imp-95251 COAL-N ceiling
 *   pinch it, and that the imp-95227 dominance conjecture stays open -- no
 *   re-import of the source module, to stay import-light.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   Lambda_conf(N, x) is the "all-rates-coalesced" limit of the seam-chain
 *   span problem: the sup, over degree-<=(N-1) polynomials p, of the fraction
 *   of the L2 mass of g(t) = p(t) e^(-nu t) that sits beyond t = d, with
 *   x = nu*d. It is the depth-only envelope the imp-95227 conjecture proposes,
 *   and the object the imp-95251 majorant coalN(N, R, x) dominates from above.
 *
 *   THEOREM CONF-LB supplies an explicit LOWER bound (a floor), not just an
 *   upper one: plugging in the single explicit trial g*(t) = L_{N-1}(2 nu t)
 *   e^(-nu t) (a shifted Laguerre polynomial) gives, by Parseval in the
 *   orthonormal Laguerre basis, the EXACT Rayleigh value
 *     T(N, x) = e^(-2x) * sum_{k=0}^{N-1} DL_k(2x)^2,   DL_k := L_k - L_{k-1},
 *   and since any single trial lower-bounds a sup, Lambda_conf(N, x) >= T(N, x)
 *   unconditionally. Measured tightness: T sits only 1-2 percent below the
 *   EXACT confluent pencil eigenvalue at moderate depth (x = 4..12).
 *
 *   COROLLARY WINDOW-PINCH then sandwiches the true sup over at-most-N-rate
 *   configurations confined to a window [nu, R*nu]:
 *     sqrt(T(N, x))  <=  window sup  <=  coalN(N, R, x),
 *   (lower: the confluent limit sits in the closure of window configs; upper:
 *   the already-proven imp-95251 THEOREM COAL-N), with the bracket ratio
 *     rho(N, R, x) := coalN(N, R, x) / sqrt(T(N, x))  ->  R^(N-1)  as x -> inf.
 *   In plain terms: the floor and the ceiling converge to the SAME leading
 *   asymptotic shape, so any gap between them is bounded and shrinks in
 *   relative terms as R -> 1 or as N stays fixed and x grows. Concretely,
 *   rho caps the imp-95251 ceiling's over-pricing of the true window sup at
 *   the firing onsets: 3.460619 (N=3, R=1.3), 6.151212 (N=4, R=1.3),
 *   10.898085 (N=5, R=1.3), and 1.037419 (N=2, R=1, x=40, matching the
 *   imp-95251 recorded 1.0373 ratio against the sharp COAL-DOM value).
 *
 *   WHAT THIS DOES NOT DO
 *   ------------------------
 *   The floor and the bracket do not decide the imp-95227 N >= 3 confluent
 *   DOMINANCE conjecture -- any violation of it inside a ratio-R window is
 *   merely CAPPED by rho(N, R, x), which tends to R^(N-1); the conjecture
 *   itself stays OPEN. Nothing here fires a new certificate or changes any
 *   bound of the Lambda program.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A plain-language restatement of the imp-95286 module verdict scope for
 *   quick reference. It establishes nothing new, fires no certificate, and
 *   does not decide the imp-95227 dominance conjecture, which REMAINS OPEN;
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-95286-confluent-laguerre-floor.js (source: LEMMA LT, THEOREM
 *   CONF-LB, COROLLARY CONF-EXACT / WINDOW-PINCH, all proven there)
 * @see imp-95251 (THEOREM COAL-N ceiling that this note's floor is pinched
 *   against)
 * @see imp-95227 (N >= 3 confluent dominance conjecture; bracketed, not
 *   decided, by imp-95286)
 *
 * Ticket: imp-95298 (content, medium). Documentation only; establishes no
 * new bound; imp-95227 dominance conjecture stays OPEN; NO QED;
 * no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95286).
const CONFLUENT_LAGUERRE_FLOOR_HEADWORD = Object.freeze({
  key: 'confluent-laguerre-floor-window-pinch',
  term:
    'Confluent Laguerre floor Lambda_conf and the WINDOW-PINCH bracket ' +
    '(imp-95286, seam-chain leg 29)',
  whatIsTheConfluentSpan:
    'Lambda_conf(N, x) is the confluent (all-rates-coalesced) limit of the ' +
    'seam-chain span problem: the sup, over degree-<=(N-1) polynomials p, of the ' +
    'fraction of the L2 mass of g(t) = p(t) e^(-nu t) beyond t = d, with ' +
    'x = nu*d. It is the depth-only envelope the imp-95227 conjecture ' +
    'proposes, dominated from above by the imp-95251 majorant coalN(N,R,x).',
  theFloor:
    'THEOREM CONF-LB: the single explicit trial g*(t) = L_{N-1}(2 nu t) ' +
    'e^(-nu t) gives the EXACT Rayleigh value T(N,x) = e^(-2x) * ' +
    'sum_{k=0}^{N-1} (L_k(2x) - L_{k-1}(2x))^2 by Parseval in the ' +
    'orthonormal Laguerre basis, and any single trial lower-bounds a sup, ' +
    'so Lambda_conf(N,x) >= T(N,x) unconditionally. Measured 1-2 percent ' +
    'below the EXACT confluent pencil eigenvalue at moderate depth.',
  theBracket:
    'COROLLARY WINDOW-PINCH sandwiches the true sup over at-most-N-rate ' +
    'configurations in a window [nu, R*nu]: sqrt(T(N,x)) <= window sup <= ' +
    'coalN(N,R,x), with bracket ratio rho(N,R,x) = coalN/sqrt(T) -> ' +
    'R^(N-1) as x -> infinity -- floor and ceiling converge to the same ' +
    'leading asymptotic shape.',
  overpricingCap:
    'rho caps how much the imp-95251 ceiling over-prices the true window ' +
    'sup at the firing onsets: 3.460619 (N=3,R=1.3), 6.151212 (N=4,R=1.3), ' +
    '10.898085 (N=5,R=1.3), 1.037419 (N=2,R=1,x=40, matching the imp-95251 ' +
    'recorded 1.0373 ratio against sharp COAL-DOM).',
  whatItDoesNotDo:
    'The floor and bracket do NOT decide the imp-95227 N >= 3 confluent ' +
    'DOMINANCE conjecture -- any violation inside a ratio-R window is only ' +
    'CAPPED by rho(N,R,x) -> R^(N-1); the conjecture stays OPEN. Fires no ' +
    'new certificate, changes no bound.',
});

export const IMP95298_CONFLUENT_LAGUERRE_FLOOR_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95298',
  proofSection: 'S-frontier',
  glosses: 'imp-95286',
  scopes: 'Lambda_conf floor / WINDOW-PINCH bracket',
  question:
    'What is the imp-95286 closed-form confluent floor Lambda_conf, why do ' +
    'the floor and the imp-95251 COAL-N ceiling pinch the true window sup, ' +
    'and what does that leave open?',
  headword: CONFLUENT_LAGUERRE_FLOOR_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the imp-95286 ' +
    'THEOREM CONF-LB floor and COROLLARY WINDOW-PINCH bracket in plain ' +
    'terms and their measured over-pricing caps. Establishes nothing new; ' +
    'fires no certificate; the imp-95227 N >= 3 dominance conjecture ' +
    'REMAINS OPEN; NO QED. No refereed bound is changed.',
  citation:
    'imp-95286 (LEMMA LT, THEOREM CONF-LB, COROLLARY CONF-EXACT / ' +
    'WINDOW-PINCH, all proven there); imp-95251 (THEOREM COAL-N ceiling); ' +
    'imp-95227 (N >= 3 confluent dominance conjecture, bracketed not ' +
    'decided).',
});

export default IMP95298_CONFLUENT_LAGUERRE_FLOOR_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95298_CONFLUENT_LAGUERRE_FLOOR_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95298-headword-has-required-fields',
    why:
      'The concept note must define the confluent span, state the floor, ' +
      'state the bracket, and state what it does not decide -- the entire ' +
      'point of the note.',
    holds: () => {
      const h = IMP95298_CONFLUENT_LAGUERRE_FLOOR_CONCEPT_NOTE.headword;
      return (
        /confluent/.test(h.whatIsTheConfluentSpan) &&
        /CONF-LB/.test(h.theFloor) &&
        /WINDOW-PINCH/.test(h.theBracket) &&
        /DOMINANCE/.test(h.whatItDoesNotDo) &&
        /OPEN/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95298-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, imp-95227 ' +
      'stays OPEN, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95298_CONFLUENT_LAGUERRE_FLOOR_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /NO QED/.test(IMP95298_CONFLUENT_LAGUERRE_FLOOR_CONCEPT_NOTE.verdict) &&
      /refereed bound is changed/i.test(
        IMP95298_CONFLUENT_LAGUERRE_FLOOR_CONCEPT_NOTE.verdict
      ) &&
      /REMAINS OPEN/.test(
        IMP95298_CONFLUENT_LAGUERRE_FLOOR_CONCEPT_NOTE.verdict
      ) &&
      IMP95298_CONFLUENT_LAGUERRE_FLOOR_CONCEPT_NOTE.glosses === 'imp-95286' &&
      IMP95298_CONFLUENT_LAGUERRE_FLOOR_CONCEPT_NOTE.scopes ===
        'Lambda_conf floor / WINDOW-PINCH bracket',
  },
];

for (const assertion of IMP95298_CONFLUENT_LAGUERRE_FLOOR_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95298-confluent-laguerre-floor-window-pinch-concept-note assertion failed: ${assertion.id}`
    );
  }
}
