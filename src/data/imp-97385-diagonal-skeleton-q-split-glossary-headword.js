/**
 * @module imp-97385-diagonal-skeleton-q-split-glossary-headword
 * @fileoverview imp-97385 -- import-light glossary/Concepts headword recording the imp-97330
 *   uniform diagonal skeleton Ihat(a,b) = (a/2) log(b/a) + a(C + 1/2), C = (log 2pi - gamma)/2,
 *   and the imp-97349 three-term split of the interior second moment Q(b) = Sum I(a,b)^2/a^2 into
 *   an elementary skeleton piece Qhat (~99.6% of Q, a log-polynomial with NO b^(1/2) term) plus two
 *   arithmetic Vasyunin-residual pieces Qcross, Qrr (measured LINEAR in b, feeding the leading slope
 *   s0, not the sub-leading term).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE SKELETON. Ihat(a,b) = (a/2) log(b/a) + a(C + 1/2) is the imp-97330 fixed-a small-a
 *   asymptotic of the exact Vasyunin coefficient I(a,b), promoted by imp-97349 to a UNIFORM
 *   (a ~ b, diagonal-regime) elementary skeleton: I(a,b) = Ihat(a,b) + r(a,b), with r the arithmetic
 *   cotangent fluctuation about the smooth envelope.
 *   (b) THE Q SPLIT. Squaring and summing over coprime a gives Q(b) = Qhat(b) + Qcross(b) + Qrr(b),
 *   Qhat = Sum Ihat^2/a^2, Qcross = Sum 2 Ihat r/a^2, Qrr = Sum r^2/a^2. MEASURED (exact kernel):
 *   Qhat carries ~99.6% of Q(b) at every sampled b.
 *   (c) THE DECISION THIS ENABLES. Qhat is elementary and provably a log-polynomial (Euler-Maclaurin
 *   of A2(b) = Sum log^2(b/a) gives the exact log^2 b coefficient -1/2, verified to 6 digits, with NO
 *   b^(1/2) term possible); Qcross and Qrr are measured LINEAR in b (feed the leading slope s0, not a
 *   sub-leading b^(1/2) term). Together these settle the imp-97292 b^(1/2)-vs-log^2 b degeneracy: the
 *   sub-leading remainder profile of Q(b) is log^2 b, not b^(1/2).
 *   (d) STATUS: qualitative separation DECIDED; the exact log^2 b coefficient is UNPINNED (open
 *   sub-gap IMP97349_SUBGAP, needs a coprimality divisor weighting plus a rigorous bound on the
 *   Vasyunin/Bettin-Conrey cotangent residual second moment, inheriting imp-97116); no bound moves.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an exact decomposition plus
 *   its measured/derived structure. Not a proof, no coefficient value claimed, NO QED.
 *
 * @see imp-97330-route-m-smalla-intercept-closed-form.js (source: Ihat = (a/2) log(b/a) + a(C+1/2))
 * @see imp-97349-route-m-diagonal-remainder-profile-separation.js (the Q = Qhat + Qcross + Qrr split,
 *   the log^2 b vs b^(1/2) decision, and the IMP97349_SUBGAP open coefficient sub-gap)
 * @see imp-97292-route-m-cq-subleading-extended-ladder.js (the b^(1/2)-vs-log^2 b numerically
 *   degenerate ladder this decomposition resolves)
 *
 * Ticket: imp-97385 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The Ihat / Q-split headword, baked verbatim (no re-import).
const DIAGONAL_SKELETON_Q_SPLIT_HEADWORD = Object.freeze({
  key: 'diagonal-skeleton-ihat-q-split-imp97330-imp97349',
  term:
    'imp-97330/imp-97349 uniform diagonal skeleton Ihat(a,b) = (a/2) log(b/a) + a(C + 1/2) and the ' +
    'Q(b) = Qhat + Qcross + Qrr split of the interior second moment',
  definition:
    'Ihat(a,b) = (a/2) log(b/a) + a(C + 1/2), C = (log 2pi - gamma)/2, is the imp-97330 fixed-a ' +
    'asymptotic of the exact Vasyunin coefficient I(a,b), used uniformly (not just at small a) as an ' +
    'elementary skeleton: I(a,b) = Ihat(a,b) + r(a,b), r the arithmetic cotangent residual. Squaring ' +
    'and summing over coprime a decomposes the interior second moment Q(b) = Sum I(a,b)^2/a^2 into ' +
    'Qhat = Sum Ihat^2/a^2 (elementary, ~99.6% of Q), Qcross = Sum 2 Ihat r/a^2, and Qrr = Sum r^2/a^2 ' +
    '(arithmetic Vasyunin-residual pieces).',
  mechanism:
    'MEASURED (exact kernel, b = 200..5000): Qhat carries ~99.6% of Q(b); Qcross and Qrr are LINEAR ' +
    'in b with stable ratios (Qrr/b ~ 0.00031, Qcross/b ~ 0.0042 to 4 digits), so they feed the ' +
    'LEADING slope s0, not a sub-leading term. Qhat is elementary and DERIVED to be a log-polynomial: ' +
    'A2(b) = Sum log^2(b/a) = 2b - (1/2) log^2 b + c1 log b + c0 (the -1/2 coefficient derived by ' +
    'Stirling/Euler-Maclaurin and verified to 6 digits), reproducing A2 at independent b to < 1e-4 -- ' +
    'proof there is NO b^(1/2) term (Euler-Maclaurin of a smooth-times-log integrand cannot produce a ' +
    'fractional power). This settles the imp-97292 b^(1/2)-vs-log^2 b degeneracy (the two candidate ' +
    'forms are collinear on every feasible b <= ~10^4): the sub-leading remainder profile of Q(b) is ' +
    'log^2 b, not b^(1/2), with pre-coprimality Qhat coefficient (1/4)(-1/2) = -1/8.',
  verificationStatus:
    'Re-cited from the imp-97349 measurement module ' +
    '(src/data/imp-97349-route-m-diagonal-remainder-profile-separation.js), which cites the imp-97330 ' +
    'skeleton form. Naming / glossary headword only; the exact log^2 b coefficient stays UNPINNED ' +
    '(IMP97349_SUBGAP: needs coprimality divisor weighting + a rigorous bound on the Vasyunin ' +
    'cotangent residual second moment, imp-97116 input); no bound moved; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP97385_DIAGONAL_SKELETON_Q_SPLIT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97385',
  proofSection: 'Route-M',
  glosses: 'imp-97349',
  question:
    'imp-97349 split the interior second moment Q(b) using the imp-97330 uniform diagonal skeleton ' +
    'Ihat = (a/2) log(b/a) + a(C+1/2), isolating an elementary log-polynomial piece Qhat from the ' +
    'arithmetic residual pieces Qcross, Qrr. What is the headword for this skeleton and split, and ' +
    'does it move any bound?',
  headword: DIAGONAL_SKELETON_Q_SPLIT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97330 uniform diagonal ' +
    'skeleton Ihat = (a/2) log(b/a) + a(C+1/2) and the imp-97349 split Q = Qhat + Qcross + Qrr: Qhat ' +
    'elementary and log-polynomial (~99.6% of Q, no b^(1/2) term, exact log^2 b coefficient derived), ' +
    'Qcross/Qrr arithmetic and LINEAR in b (feed s0). No bound moved; the exact log^2 b coefficient ' +
    'stays unpinned (IMP97349_SUBGAP); NO QED. No refereed bound is changed.',
  citation:
    'imp-97349 (the Q = Qhat + Qcross + Qrr split and the log^2 b decision this glosses); imp-97330 ' +
    '(the skeleton Ihat source); imp-97292 (the b^(1/2)-vs-log^2 b degenerate ladder this resolves).',
});

export default IMP97385_DIAGONAL_SKELETON_Q_SPLIT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97385_DIAGONAL_SKELETON_Q_SPLIT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97385-headword-cites-skeleton-and-split',
    why: 'The headword must name the exact skeleton form Ihat and the three-term Q split -- the ' +
      'entire point of the glossary entry.',
    holds: () => {
      const h = IMP97385_DIAGONAL_SKELETON_Q_SPLIT_GLOSSARY_HEADWORD.headword;
      return (
        /Ihat\(a,b\) = \(a\/2\) log\(b\/a\) \+ a\(C \+ 1\/2\)/.test(h.definition) &&
        /Qhat = Sum Ihat\^2\/a\^2/.test(h.definition) &&
        /99\.6%/.test(h.mechanism) &&
        /log\^2 b, not b\^\(1\/2\)/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97385-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, sub-gap left open, no QED, no-refereed-bound-change line ' +
      'present.',
    holds: () =>
      IMP97385_DIAGONAL_SKELETON_Q_SPLIT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97385_DIAGONAL_SKELETON_Q_SPLIT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97385_DIAGONAL_SKELETON_Q_SPLIT_GLOSSARY_HEADWORD.verdict) &&
      IMP97385_DIAGONAL_SKELETON_Q_SPLIT_GLOSSARY_HEADWORD.glosses === 'imp-97349',
  },
];

for (const assertion of IMP97385_DIAGONAL_SKELETON_Q_SPLIT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97385-diagonal-skeleton-q-split-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
