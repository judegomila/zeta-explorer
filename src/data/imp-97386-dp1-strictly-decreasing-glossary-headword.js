/**
 * @module imp-97386-dp1-strictly-decreasing-glossary-headword
 * @fileoverview imp-97386 -- import-light glossary/Concepts headword recording the imp-97352
 *   domination-injection ingredient: D_{p1}(e) = J(e-1) - J(p1 e - 1) (J = Binet function, p1 =
 *   smallest prime of b) is STRICTLY DECREASING in e. This single new analytic fact -- reducing
 *   to the elementary inequality 2 sinh(t/2) >= t -- is what lets imp-97352 extend the imp-97333
 *   Route M sign law T(b) < 0 from omega(b) <= 3 to omega(b) = 4 via a subset-level domination
 *   injection (each level-2 positive peel term paired against a smaller-argument level-1 negative
 *   term).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE OBJECT. D_{p1}(e) = J(e-1) - J(p1 e - 1) arises in the smallest-prime peel identity
 *   T(b) = -J(p1-1) + U(m), U(m) = Sum_{e | m, e > 1} mu(e) D_{p1}(e), where b = p1 m and p1 is
 *   the smallest prime factor of b. imp-97333 used only D_{p1}(e) > 0 and D_{p1}(e) < J(p1-1).
 *   (b) THE STRICT-MONOTONICITY UPGRADE. imp-97352 proves the stronger fact D_{p1}(a) < D_{p1}(c)
 *   for a > c: writing |Jp(m)| = -J-prime(m) = Int_0^inf w(t) e^{-m t} dt with the positive Binet
 *   density w(t) = 1/(e^t-1) - 1/t + 1/2, the sign reduces to dD_{p1}/de < 0 <==> |Jp(e-1)| > p1
 *   |Jp(p1 e - 1)|. Since w is INCREASING (w-prime(t) >= 0 <==> 2 sinh(t/2) >= t, true for all
 *   t >= 0), Laplace scaling gives |Jp(m)| >= p1 |Jp(p1 m)| pointwise, and p1 e - 1 > p1(e-1)
 *   with |Jp| decreasing finishes the chain.
 *   (c) THE ROLE. Strict monotonicity is exactly what signs each matched pair in the omega=4
 *   domination injection: for b = p1 p2 p3 p4, the three level-2 positive peel terms D(p2 p3),
 *   D(p2 p4), D(p3 p4) each strictly exceed a distinct level-1 negative term D(p3), D(p4), D(p2)
 *   respectively (a two-prime product argument is always larger than any single prime), so each
 *   difference D(larger) - D(smaller) < 0 by (b), giving U(m) < 0 and hence T(b) < 0.
 *   (d) SCOPE. The injection only counts, it does not weigh: it needs exactly as many level-1
 *   negatives as level-2 positives to match against, which fails from omega = 5 onward (Hall
 *   deficiency, imp-97352 CROSSOVER) -- the strict-monotonicity fact itself remains true for all
 *   e, but the counting argument built on top of it runs out of room.
 *   (e) STATUS: documentation only. No bound moved; the imp-97333 sign-tail sub-gap stays open
 *   for omega >= 5. NO QED.
 *
 * @see imp-97352-route-m-sign-law-omega4-proof.js (source: the D_{p1}-monotonicity ingredient,
 *   the omega=4 proof built on it, and the Hall-deficiency crossover at omega=5)
 * @see imp-97333-route-m-sign-law-proof-attempt.js (the smallest-prime peel identity and the
 *   original weaker D_{p1}(e) > 0, D_{p1}(e) < J(p1-1) facts this strengthens)
 * @see imp-97309-route-m-arith-tail-cancellation-assessment.js (the Binet positive-kernel
 *   representation of J underlying w(t))
 *
 * Ticket: imp-97386 (content, low, sonnet-4-6). Documentation only; establishes nothing beyond a
 * glossary headword; NO QED; no refereed bound is changed; RH open.
 */

// The D_{p1}(e) strictly-decreasing headword, baked verbatim (no re-import).
const DP1_STRICTLY_DECREASING_HEADWORD = Object.freeze({
  key: 'dp1-strictly-decreasing-imp97352-omega4-domination-injection',
  term:
    'imp-97352 D_{p1}(e) strict-monotonicity ingredient: D_{p1}(e) = J(e-1) - J(p1 e - 1) is ' +
    'STRICTLY DECREASING in e, the new analytic fact powering the omega=4 Route M sign-law ' +
    'domination injection',
  definition:
    'D_{p1}(e) = J(e-1) - J(p1 e - 1), where J = rho_n is the Binet function and p1 is the ' +
    'smallest prime factor of b, is the per-divisor term of the smallest-prime peel remainder ' +
    'U(m) = Sum_{e|m,e>1} mu(e) D_{p1}(e). imp-97333 knew only D_{p1}(e) > 0 and D_{p1}(e) < ' +
    'J(p1-1); imp-97352 upgrades this to strict monotonicity, D_{p1}(a) < D_{p1}(c) for a > c.',
  mechanism:
    'dD_{p1}/de < 0 reduces to |Jp(e-1)| > p1 |Jp(p1 e - 1)|, where |Jp(m)| = Int_0^inf w(t) ' +
    'e^{-m t} dt and w(t) = 1/(e^t-1) - 1/t + 1/2 > 0. w is increasing because 2 sinh(t/2) >= t ' +
    'for all t >= 0, so Laplace scaling (t = p1 s) gives |Jp(m)| >= p1 |Jp(p1 m)| pointwise; ' +
    'combined with p1 e - 1 > p1(e-1) and |Jp| decreasing (J convex), dD_{p1}/de < 0 follows. The ' +
    'single new analytic input beyond imp-97333 is the elementary inequality 2 sinh(t/2) >= t.',
  roleInOmega4Injection:
    'For b = p1 p2 p3 p4 (m = p2 p3 p4), the peel remainder splits by omega(e) into level 1 ' +
    '{p2,p3,p4} (negative), level 2 {p2p3,p2p4,p3p4} (positive), level 3 {p2p3p4} (negative). ' +
    'Since a two-prime product always exceeds any single prime, each level-2 positive term is ' +
    'paired with a distinct, smaller-argument level-1 negative term (a complete 3x3 bipartite ' +
    'matching), and strict monotonicity signs every matched difference D(larger)-D(smaller) < 0, ' +
    'giving U(m) < 0 and hence T(b) = -J(p1-1) + U(m) < 0 -- the omega=4 sign law.',
  scopeLimit:
    'The strict-monotonicity fact itself holds for every e; what runs out is the COUNTING behind ' +
    'the injection, which needs at least as many level-1 negatives (omega-1) as level-2 ' +
    'positives (C(omega-1,2)) to match against. That fails first at omega = 5 (Hall deficiency ' +
    '6 > 4, imp-97352 CROSSOVER), leaving IMP97333_SIGN_TAIL_SUBGAP open for omega >= 5.',
  verificationStatus:
    'Re-cited from the imp-97352 measurement module ' +
    '(src/data/imp-97352-route-m-sign-law-omega4-proof.js), whose own self-executing assertions ' +
    'node-verify the strict-monotonicity claim numerically (D_{p1}(e+1) < D_{p1}(e) for p1 in ' +
    '{2,3,5,7}, e up to 120) and the Laplace-scaling inequality it reduces to. Naming / glossary ' +
    'headword only; supplies no bound beyond what imp-97352 already established; no bound moved; ' +
    'RH open; no refereed bound is changed; NO QED.',
});

export const IMP97386_DP1_STRICTLY_DECREASING_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97386',
  proofSection: 'Route-M',
  glosses: 'imp-97352',
  question:
    'imp-97352 proved the Route M sign law for omega(b) = 4 via a new rigorous fact that ' +
    'D_{p1}(e) = J(e-1) - J(p1 e - 1) is strictly decreasing in e. What is the headword for this ' +
    'ingredient, and what exactly does it buy (and not buy)?',
  headword: DP1_STRICTLY_DECREASING_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97352 D_{p1}(e) ' +
    'strict-monotonicity ingredient (from the elementary inequality 2 sinh(t/2) >= t) and its ' +
    'role signing every matched pair in the omega=4 domination injection, U(m) < 0 hence ' +
    'T(b) < 0. Monotonicity holds for all e; the injection itself is a COUNTING argument that ' +
    'fails from omega = 5 onward (Hall deficiency). No bound moved; IMP97333_SIGN_TAIL_SUBGAP ' +
    'stays open for omega >= 5; NO QED. No refereed bound is changed.',
  citation:
    'imp-97352 (the D_{p1} strict-monotonicity proof, the omega=4 domination injection this ' +
    'glosses, and the omega=5 Hall-deficiency crossover); imp-97333 (the smallest-prime peel ' +
    'identity and the original weaker D_{p1} facts being strengthened); imp-97309 (the Binet ' +
    'positive-kernel representation of J).',
});

export default IMP97386_DP1_STRICTLY_DECREASING_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97386_DP1_STRICTLY_DECREASING_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97386-headword-cites-mechanism-and-role',
    why: 'The headword must name the reduction to 2 sinh(t/2) >= t and the omega=4 domination ' +
      'role -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97386_DP1_STRICTLY_DECREASING_GLOSSARY_HEADWORD.headword;
      return (
        /2 sinh\(t\/2\) >= t/.test(h.mechanism) &&
        /w\(t\) = 1\/\(e\^t-1\) - 1\/t \+ 1\/2/.test(h.mechanism) &&
        /omega=4/.test(h.roleInOmega4Injection) &&
        /Hall deficiency/.test(h.scopeLimit)
      );
    },
  },
  {
    id: 'imp97386-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, sub-gap left open, no QED, no-refereed-bound-change line ' +
      'present.',
    holds: () =>
      IMP97386_DP1_STRICTLY_DECREASING_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97386_DP1_STRICTLY_DECREASING_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97386_DP1_STRICTLY_DECREASING_GLOSSARY_HEADWORD.verdict) &&
      IMP97386_DP1_STRICTLY_DECREASING_GLOSSARY_HEADWORD.glosses === 'imp-97352',
  },
];

for (const assertion of IMP97386_DP1_STRICTLY_DECREASING_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97386-dp1-strictly-decreasing-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
