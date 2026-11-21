/**
 * @module imp-95302-coal-n-majorant-concept-note
 * @fileoverview imp-95302 -- import-light concept note for the imp-95251
 *   THEOREM COAL-N N-fold coalescence law and its majorant-only status:
 *   what the closed form bounds, why it is coalescence-uniform, and what
 *   it does NOT establish (the imp-95227 N >= 3 dominance conjecture).
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95251 proves THEOREM COAL-N: a closed-form majorant on the tail
 *   mass fraction Lambda for ANY N rates in a bounded window, with no
 *   dependence on the pairwise separations of those rates. The frontier
 *   scout flagged that the imp-95264 concept note documents only the
 *   PAIR (N = 2) coalescence law coalLaw(x), leaving the N-fold
 *   generalization undocumented for readers. This note restates the
 *   COAL-N law and its honest scope; it re-derives nothing and
 *   establishes no new bound.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   For rates nu_0 < ... < nu_(N-1) in a window [nu, R nu] and depth
 *   x = nu d, let L_k(-y) = sum_(l<=k) C(k,l) y^l/l! be the Laguerre
 *   polynomials at negative argument and L1_n(-y) = sum_(k<=n) L_k(-y)
 *   the partial sum. THEOREM COAL-N states
 *     sqrt(Lambda) <= coalN(N, R, x)
 *                   := e^(-x) [ L_(N-1)(-2Rx) + 2 L1_(N-2)(-2Rx) ].
 *   The right side depends only on the COUNT N, the window ratio R, and
 *   the depth x -- never on how the individual rates are spaced -- so it
 *   is "coalescence-uniform": it stays finite and valid even as several
 *   rates merge into a confluent limit, unlike separation-priced bounds
 *   (e.g. the Lagrange-form PROP BL) that blow up there. The proof
 *   assembles a Blaschke-Newton interpolant (LEMMA BN, an "anti-trap"
 *   Newton scheme in the Blaschke basis that stays finite at
 *   coalescence), a contour-pivot divided-difference identity (LEMMA DD),
 *   and a Laguerre bound on each divided difference (LEMMA LAG), then
 *   sums by the triangle inequality.
 *
 *   WHY IT MATTERS (a majorant, reused as machinery)
 *   -----------------------------------------------
 *   Because coalN(N, R, x) requires no knowledge of intra-block rate
 *   separations, any certificate needing an N-rate tail bound can plug
 *   in coalN(N_k, R, x_k) in place of a pair-only law, without tracking
 *   the fine structure of each rate cluster. At N = 2, R -> 1 it recovers
 *   e^(-x)(3 + 2x), asymptotically tight against the sharp pair constant
 *   coalLaw(x) (imp-95227 THEOREM COAL-DOM) -- so the pair case is nearly
 *   sharp, and COAL-N is the honest N-fold successor to the imp-95264
 *   pair-only law.
 *
 *   WHAT IT DOES NOT DO (majorant-only status)
 *   -----------------------------------------------
 *   COAL-N is a MAJORANT, not the exact envelope value. When imp-95251
 *   was written, the imp-95227 conjecture that the fully confluent
 *   N-rate span attains the true supremum of Lambda over all N-rate
 *   configurations at fixed depth was OPEN for N >= 3, and COAL-N
 *   explicitly sidestepped that dominance question rather than deciding
 *   it. That conjecture has SINCE been decided: imp-95287 THEOREM MONO-N
 *   / COROLLARY DOM-N / COROLLARY WINDOW-EXACT proves the exact N-rate
 *   shift constant is strictly decreasing in every rate, so the window
 *   supremum equals Lambda_conf exactly (affirmative for fully distinct
 *   configurations, with <= by closure on partially confluent ones;
 *   strictness on partial-block strata is a separate named residual).
 *   That later result decides the ENVELOPE question but does not make
 *   COAL-N exact: coalN(N, R, x) remains a measurably loose closed-form
 *   majorant (2.0x-4.3x above the exact confluent pencil near onset for
 *   N = 3, 4 at R = 1, tightening at larger depth), useful as
 *   coalescence-uniform machinery precisely because it needs no rate
 *   fine structure, while imp-95287's exact value is the reference for
 *   how tight it is not. COAL-N also diverges as N -> infinity at fixed
 *   x (consistent with, not contradicting, the separate imp-95224
 *   count-uniform ceiling). This note documents the closed form and its
 *   coalescence-uniform, majorant-only scope; it establishes no new
 *   bound.
 *
 * @see imp-95251-nfold-coalescence-law.js (source: THEOREM COAL-N,
 *   LEMMA BN / LEMMA DD / LEMMA LAG, coalN closed form)
 * @see imp-95264-coalescence-law-concept-note.js (pair-only N = 2
 *   predecessor note; names the N-fold extension as its residual)
 * @see imp-95227-two-rate-coalescence-dominance-theorem.js (the N = 2
 *   dominance theorem; source of the N >= 3 conjecture)
 * @see imp-95287-nrate-monotonicity-dominance.js (decides the N >= 3
 *   dominance conjecture affirmative; COAL-N remains a loose majorant
 *   relative to this exact value)
 *
 * Ticket: imp-95302 (content, low). Documentation only; establishes no new
 * bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95251).
const COAL_N_HEADWORD = Object.freeze({
  key: 'coal-n-majorant',
  term:
    'THEOREM COAL-N: sqrt(Lambda) <= coalN(N, R, x) = e^(-x)[L_(N-1)(-2Rx) ' +
    '+ 2 L1_(N-2)(-2Rx)], the imp-95251 N-fold coalescence-uniform ' +
    'majorant',
  whatItBounds:
    'The tail mass fraction Lambda for any N rates nu_0 < ... < nu_(N-1) ' +
    'in a window [nu, R nu] at depth x = nu d, via a closed form built ' +
    'from negative-argument Laguerre polynomials L_k and their partial ' +
    'sums L1_n.',
  whyItIsCoalescenceUniform:
    'coalN(N, R, x) depends only on the count N, window ratio R, and ' +
    'depth x -- never on the pairwise separations of the rates -- so it ' +
    'stays valid and finite even as several rates merge to a confluent ' +
    'limit, unlike separation-priced bounds such as PROP BL.',
  whyItIsAMajorant:
    'It is assembled from a Blaschke-Newton interpolant (LEMMA BN), a ' +
    'contour-pivot divided-difference identity (LEMMA DD), and a ' +
    'Laguerre bound on each divided difference (LEMMA LAG), summed by ' +
    'the triangle inequality -- an upper bound construction, not an ' +
    'exact evaluation of the supremum.',
  whatItDoesNotDo:
    'COAL-N did not itself decide the imp-95227 N >= 3 dominance ' +
    'conjecture (whether the fully confluent span attains the true ' +
    'supremum) -- that was later decided affirmative by imp-95287 ' +
    'THEOREM MONO-N / WINDOW-EXACT. COAL-N remains a measurably loose ' +
    'majorant relative to that exact value (2.0x-4.3x near onset at ' +
    'R = 1 for N = 3, 4), not an exact envelope.',
});

export const IMP95302_COAL_N_MAJORANT_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95302',
  proofSection: 'S-frontier',
  glosses: 'imp-95251',
  scopes:
    'THEOREM COAL-N: sqrt(Lambda) <= e^(-x)[L_(N-1)(-2Rx) + ' +
    '2 L1_(N-2)(-2Rx)]',
  question:
    'What does the imp-95251 THEOREM COAL-N N-fold coalescence law ' +
    'bound, why is it coalescence-uniform, and in what sense is it only ' +
    'a majorant rather than the exact envelope decided by imp-95287?',
  headword: COAL_N_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the ' +
    'imp-95251 THEOREM COAL-N closed-form coalescence-uniform majorant ' +
    'on Lambda for N rates, why it needs no rate-separation information, ' +
    'and that it is a majorant only -- the imp-95227 N >= 3 dominance ' +
    'conjecture it originally sidestepped was later decided affirmative ' +
    'by imp-95287, against which coalN remains measurably loose. ' +
    'Establishes nothing new; fires no certificate; no refereed bound is changed' +
    '.',
  citation:
    'imp-95251-nfold-coalescence-law.js (THEOREM COAL-N); ' +
    'imp-95264-coalescence-law-concept-note.js (pair-only predecessor); ' +
    'imp-95227-two-rate-coalescence-dominance-theorem.js (N >= 3 ' +
    'dominance conjecture stated); ' +
    'imp-95287-nrate-monotonicity-dominance.js (decides it affirmative).',
});

export default IMP95302_COAL_N_MAJORANT_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95302_COAL_N_MAJORANT_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95302-headword-has-required-fields',
    why:
      'The concept note must state what coalN bounds, why it is ' +
      'coalescence-uniform, why it is a majorant, and the open N >= 3 ' +
      'dominance conjecture it does not decide -- the entire point of ' +
      'the note.',
    holds: () => {
      const h = IMP95302_COAL_N_MAJORANT_CONCEPT_NOTE.headword;
      return (
        /Laguerre/.test(h.whatItBounds) &&
        /count N, window ratio R, and/i.test(h.whyItIsCoalescenceUniform) &&
        /Blaschke-Newton/.test(h.whyItIsAMajorant) &&
        /imp-95227/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95302-coalN-matches-baked-closed-form',
    why:
      'The note quotes the coalN closed form; verify the N = 2, R = 1 ' +
      'specialization matches the imp-95251 baked value e^(-x)(3 + 2x).',
    holds: () => {
      // L_k(-y) = sum_(l<=k) C(k,l) y^l / l!
      function binom(n, k) {
        if (k < 0 || k > n) return 0;
        let r = 1;
        for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
        return r;
      }
      function laguerreNeg(k, y) {
        let s = 0;
        for (let l = 0; l <= k; l++) s += binom(k, l) * Math.pow(y, l) / factorial(l);
        return s;
      }
      function factorial(n) {
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
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
      const xs = [1, 3, 6, 12];
      return xs.every((x) => {
        const lhs = coalN(2, 1, x);
        const rhs = Math.exp(-x) * (3 + 2 * x);
        return Math.abs(lhs - rhs) / rhs < 1e-9;
      });
    },
  },
  {
    id: 'imp95302-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95302_COAL_N_MAJORANT_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(IMP95302_COAL_N_MAJORANT_CONCEPT_NOTE.verdict) &&
      IMP95302_COAL_N_MAJORANT_CONCEPT_NOTE.glosses === 'imp-95251' &&
      IMP95302_COAL_N_MAJORANT_CONCEPT_NOTE.scopes ===
        'THEOREM COAL-N: sqrt(Lambda) <= e^(-x)[L_(N-1)(-2Rx) + ' +
          '2 L1_(N-2)(-2Rx)]',
  },
];

for (const assertion of IMP95302_COAL_N_MAJORANT_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95302-coal-n-majorant-concept-note assertion failed: ${assertion.id}`
    );
  }
}
