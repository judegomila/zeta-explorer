/**
 * @module imp-95320-lag-env-laguerre-envelope-concept-note
 * @fileoverview imp-95320 -- import-light concept note for the imp-95285
 *   LEMMA LAG-ENV negative-argument Laguerre envelope bound L_k(-z) <=
 *   e^(2 sqrt(kz)) and its role as the threshold Y0(N, R) that converts
 *   the imp-95251 THEOREM COAL-N majorant into a simple geometric-decay
 *   bound coalN(N, R, y) <= e^(-y/2) for y >= Y0(N, R).
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95285 proves LEMMA LAG-ENV as a small elementary step inside a
 *   longer chain (THEOREM EV-OCT-N / COROLLARY EV-OCT-N-UNIF). The
 *   frontier scout flagged that this step -- an easy binomial-coefficient
 *   bound with a specific and useful side effect (an explicit threshold
 *   Y0(N, R) past which the imp-95251 COAL-N majorant collapses to a
 *   plain exponential) -- was not documented on its own. This note
 *   restates the lemma, its proof idea, and its threshold role; it
 *   re-derives nothing and establishes no new bound.
 *
 *   THE LEMMA
 *   -----------------------------------------------
 *   For the negative-argument Laguerre polynomial L_k(-z) =
 *   sum_(l<=k) C(k,l) z^l / l! (z >= 0, integer k >= 0):
 *     L_k(-z) <= e^(2 sqrt(kz)).
 *   Proof: C(k,l) <= k^l / l!, so L_k(-z) <= sum_(l<=k) (kz)^l / (l!)^2
 *   <= [ sum_(l>=0) (kz)^(l/2) / l! ]^2 = e^(2 sqrt(kz)), the middle step
 *   because a sum of squares of nonnegative terms is at most the square
 *   of the sum. Elementary; no analytic continuation or contour work.
 *
 *   THE VACUITY THRESHOLD Y0(N, R)
 *   -----------------------------------------------
 *   Since L_k(-z) is nondecreasing in k, every one of the 2N - 1 bracket
 *   terms in the imp-95251 closed form coalN(N, R, y) = e^(-y)
 *   [L_(N-1)(-2Ry) + 2 sum_(k<=N-2) L_k(-2Ry)] is at most L_(N-1)(-2Ry),
 *   so LAG-ENV gives
 *     coalN(N, R, y) <= (2N - 1) exp( -y + 2 sqrt(2R(N-1) y) ).
 *   Solving y/2 = 2 sqrt(2R(N-1) y) + ln(2N - 1) for u = sqrt(y) gives
 *   the exact positive root
 *     Y0(N, R) = (b + sqrt(b^2 + 2c))^2, b = 2 sqrt(2R(N-1)),
 *                c = ln(2N - 1),
 *   and for y >= Y0(N, R) the chain collapses to coalN(N, R, y) <=
 *   e^(-y/2). BELOW Y0(N, R) the derivation gives no such guarantee --
 *   the bound is a threshold statement, not a claim that holds for every
 *   y >= 0, and treating it as unconditional there would be vacuous.
 *   Y0(3, 1.3) = 89.5220129, Y0(4, 1.3) = 132.4693027.
 *
 *   WHY IT MATTERS (turns an infinite per-octave sum into a geometric
 *   tail)
 *   -----------------------------------------------
 *   COROLLARY EV-OCT-N-UNIF needs to sum coalN(N, R, 2^k x) over
 *   unboundedly many octaves k >= 1. LAG-ENV is what makes that sum
 *   convergent in closed form: once 2^k x >= Y0(N, R) for every k >= 1
 *   (guaranteed by taking x >= Y0(N, R)/2, since 2^k >= k + 1 >= 2 for
 *   k >= 1), every summand is capped by e^(-2^k x/2) <= e^(-(k+1) x/2),
 *   whose geometric tail sums to <= 2 e^(-x). Without the threshold, the
 *   unbounded-octave-count corollary would have no closed form at all.
 *
 *   WHAT IT DOES NOT DO (count-priced, and non-binding at the certificate
 *   onsets)
 *   -----------------------------------------------
 *   Y0(N, R) grows with N (89.52 at N = 3 vs 132.47 at N = 4, R = 1.3),
 *   so LAG-ENV is count-priced, not count-uniform -- consistent with the
 *   imp-95224 DC-NOGO ceiling that no depth-currency argument gives an
 *   N-uniform bound. Separately, imp-95285's own bisected onsets show the
 *   threshold is not actually the bottleneck of the certificate it feeds:
 *   the m-uniform crossing points xStar = 61.309901 (N = 3) and
 *   107.261457 (N = 4) both already exceed Y0(N, R)/2 (44.76 and 66.23),
 *   so at the point where COROLLARY EV-OCT-N-UNIF's own certificate first
 *   fires, the LAG-ENV threshold has already been cleared -- the onset is
 *   set by the coarser COAL-N and LOO-fence slack, not by LAG-ENV itself.
 *   This note documents the lemma and its threshold role; it establishes
 *   no new bound.
 *
 * @see imp-95285-n-per-octave-split-instantiation.js (source: LEMMA
 *   LAG-ENV, the Y0(N, R) threshold, COROLLARY EV-OCT-N-UNIF)
 * @see imp-95302-coal-n-majorant-concept-note.js (documents the COAL-N
 *   majorant that LAG-ENV bounds a threshold for)
 * @see imp-95224 (DC-NOGO count-uniform ceiling; consistent with Y0
 *   growing in N)
 *
 * Ticket: imp-95320 (content, low). Documentation only; establishes no new
 * bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95285).
const LAG_ENV_HEADWORD = Object.freeze({
  key: 'lag-env-vacuity-threshold',
  term:
    'LEMMA LAG-ENV: L_k(-z) <= e^(2 sqrt(kz)), the imp-95285 negative-' +
    'argument Laguerre envelope and its Y0(N, R) vacuity threshold for ' +
    'coalN(N, R, y) <= e^(-y/2)',
  whatItBounds:
    'Every negative-argument Laguerre polynomial L_k(-z) = ' +
    'sum_(l<=k) C(k,l) z^l / l! (z >= 0, k >= 0), via C(k,l) <= k^l / l! ' +
    'and a sum-of-squares-vs-square-of-sum step.',
  whatItYields:
    'Because L_k(-z) is nondecreasing in k, every bracket term of the ' +
    'imp-95251 coalN(N, R, y) closed form is capped by L_(N-1)(-2Ry), ' +
    'giving coalN(N, R, y) <= (2N-1) exp(-y + 2 sqrt(2R(N-1) y)), which ' +
    'in turn implies coalN(N, R, y) <= e^(-y/2) once y crosses the exact ' +
    'threshold Y0(N, R) = (b + sqrt(b^2 + 2c))^2, b = 2 sqrt(2R(N-1)), ' +
    'c = ln(2N-1).',
  whyItIsAThresholdNotUnconditional:
    'The e^(-y/2) collapse is only established for y >= Y0(N, R); below ' +
    'that threshold the derivation gives no guarantee, so treating the ' +
    'collapsed bound as holding for all y >= 0 would be vacuous.',
  whatItDoesNotDo:
    'Y0(N, R) grows with N (89.5220129 at N=3 vs 132.4693027 at N=4, ' +
    'R=1.3) -- count-priced, not count-uniform, consistent with the ' +
    'imp-95224 DC-NOGO ceiling -- and imp-95285s own bisected onsets show ' +
    'the threshold is already cleared (xStar >= Y0/2) at the point where ' +
    'the fed certificate first fires, so LAG-ENV is not the binding ' +
    'looseness there.',
});

export const IMP95320_LAG_ENV_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95320',
  proofSection: 'S-frontier',
  glosses: 'imp-95285',
  scopes:
    'LEMMA LAG-ENV: L_k(-z) <= e^(2 sqrt(kz)); threshold Y0(N, R) for ' +
    'coalN(N, R, y) <= e^(-y/2)',
  question:
    'What does the imp-95285 LEMMA LAG-ENV Laguerre envelope bound state, ' +
    'and what role does its Y0(N, R) threshold play in collapsing the ' +
    'imp-95251 COAL-N majorant to a plain geometric tail -- and where does ' +
    'that threshold apply versus become vacuous?',
  headword: LAG_ENV_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the ' +
    'imp-95285 LEMMA LAG-ENV bound L_k(-z) <= e^(2 sqrt(kz)) and the ' +
    'exact threshold Y0(N, R) past which it collapses coalN(N, R, y) to ' +
    'e^(-y/2), why that collapse is conditional on y >= Y0 (vacuous ' +
    'below it), and why the threshold turns out not to be the binding ' +
    'slack at the fed certificates own crossing points. Establishes ' +
    'nothing new; fires no certificate; no refereed bound is changed' +
    '.',
  citation:
    'imp-95285-n-per-octave-split-instantiation.js (LEMMA LAG-ENV, ' +
    'Y0(N, R) threshold, COROLLARY EV-OCT-N-UNIF); ' +
    'imp-95302-coal-n-majorant-concept-note.js (COAL-N majorant that ' +
    'LAG-ENV thresholds); imp-95224 (DC-NOGO count-uniform ceiling).',
});

export default IMP95320_LAG_ENV_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95320_LAG_ENV_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95320-headword-has-required-fields',
    why:
      'The concept note must state what LAG-ENV bounds, what threshold it ' +
      'yields, why that threshold is conditional (not unconditional), and ' +
      'the count-priced / non-binding caveat -- the entire point of the ' +
      'note.',
    holds: () => {
      const h = IMP95320_LAG_ENV_CONCEPT_NOTE.headword;
      return (
        /L_k\(-z\)/.test(h.whatItBounds) &&
        /Y0\(N, R\)/.test(h.whatItYields) &&
        /vacuous/i.test(h.whyItIsAThresholdNotUnconditional) &&
        /imp-95224/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95320-lag-env-bound-holds-on-grid',
    why:
      'Verify L_k(-z) <= e^(2 sqrt(kz)) directly on a (k, z) grid -- the ' +
      'lemma the note documents.',
    holds: () => {
      function binom(n, k) {
        if (k < 0 || k > n) return 0;
        let r = 1;
        for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
        return r;
      }
      function factorial(n) {
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
      }
      function laguerreNeg(k, z) {
        let s = 0;
        for (let l = 0; l <= k; l++) s += (binom(k, l) * Math.pow(z, l)) / factorial(l);
        return s;
      }
      for (let k = 0; k <= 8; k++) {
        for (let z = 0; z <= 400; z += 8) {
          const lhs = laguerreNeg(k, z);
          const rhs = Math.exp(2 * Math.sqrt(k * z));
          if (lhs > rhs * (1 + 1e-9)) return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp95320-y0-threshold-literals-and-crossing',
    why:
      'Recompute the exact Y0(N, R) root and confirm the baked literals ' +
      '(89.5220129 at N=3, 132.4693027 at N=4, R=1.3) match, and that the ' +
      'e^(-y/2) collapse holds at y = Y0 (crossing point) but is not ' +
      'claimed below it.',
    holds: () => {
      function y0Thresh(N, R) {
        const b = 2 * Math.sqrt(2 * R * (N - 1));
        const c = Math.log(2 * N - 1);
        return Math.pow(b + Math.sqrt(b * b + 2 * c), 2);
      }
      function binom(n, k) {
        if (k < 0 || k > n) return 0;
        let r = 1;
        for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
        return r;
      }
      function factorial(n) {
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
      }
      function laguerreNeg(k, z) {
        let s = 0;
        for (let l = 0; l <= k; l++) s += (binom(k, l) * Math.pow(z, l)) / factorial(l);
        return s;
      }
      function partialSum(n, y) {
        let s = 0;
        for (let k = 0; k <= n; k++) s += laguerreNeg(k, y);
        return s;
      }
      function coalN(N, R, x) {
        const y = 2 * R * x;
        const l1 = N - 2 >= 0 ? partialSum(N - 2, y) : 0;
        return Math.exp(-x) * (laguerreNeg(N - 1, y) + 2 * l1);
      }
      const y0N3 = y0Thresh(3, 1.3);
      const y0N4 = y0Thresh(4, 1.3);
      if (Math.abs(y0N3 - 89.5220129) > 1e-6) return false;
      if (Math.abs(y0N4 - 132.4693027) > 1e-6) return false;
      for (const [N, R] of [
        [3, 1.3],
        [4, 1.3],
      ]) {
        const y0 = y0Thresh(N, R);
        for (const f of [1, 1.5, 4]) {
          const y = y0 * f;
          if (coalN(N, R, y) > Math.exp(-y / 2)) return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp95320-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95320_LAG_ENV_CONCEPT_NOTE.anyEnclosureEstablished === false &&
      /refereed bound is changed/i.test(IMP95320_LAG_ENV_CONCEPT_NOTE.verdict) &&
      IMP95320_LAG_ENV_CONCEPT_NOTE.glosses === 'imp-95285' &&
      IMP95320_LAG_ENV_CONCEPT_NOTE.scopes ===
        'LEMMA LAG-ENV: L_k(-z) <= e^(2 sqrt(kz)); threshold Y0(N, R) for ' +
          'coalN(N, R, y) <= e^(-y/2)',
  },
];

for (const assertion of IMP95320_LAG_ENV_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95320-lag-env-laguerre-envelope-concept-note assertion failed: ${assertion.id}`
    );
  }
}
