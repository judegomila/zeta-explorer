/**
 * @module imp-97408-e1-explicit-constant-qlog-mertens-glossary-headword
 * @fileoverview imp-97408 -- import-light glossary/Concepts headword recording the imp-97288 explicit
 *   E1 constant CK(b) closed form and the single named Mertens-product estimate on Qlog(b) that remains
 *   to close it unconditionally.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE CLOSED FORM. imp-97288 derives an EXACT closed form (verified to machine precision to
 *   b=720720) for the polynomial/log part of the Route M weighted-first-moment remainder E1(b):
 *   CK(b) = (b/12) Qlog(b) - (b/4) Q0(b) + b logA (Q0(b) - mu(b)) + C_sum(b), with E1(b) = CK(b) +
 *   E1_tail(b) and |E1_tail(b)| <= (zeta(2)-1)/720 * b (imp-97224).
 *   (b) THREE PINNED CONSTITUENTS. Q0(b) = prod_{p|b}(1-p)/b satisfies |Q0| <= 1; |mu(b)| <= 1; and
 *   |C_sum(b)| <= K_C b with the explicit K_C = 1.13088, from the Moebius-moment decay |S_k(b)| <=
 *   zeta(k)-1 <= 3*2^{-k} (imp-97202).
 *   (c) THE FOURTH CONSTITUENT. Qlog(b) = -Q0(b) Sum_{p^a||b} log p [(a-1)p-a]/(1-p) (squarefree:
 *   -Q0(b) Sum_{p|b} (log p)/(p-1)) is the precise obstruction: a Mertens-product estimate
 *   prod_{p|b}(1-1/p) Sum_{p|b}(log p)/(p-1) <= C_Q, MEASURED sup 0.475 (at the 9-primorial
 *   223092870) climbing toward the Mertens limit e^{-gamma} = 0.56146 from below, but not certified
 *   by an explicit Mertens/Rosser-Schoenfeld bound.
 *   (d) WHAT IT PROVES. Conditional on |Qlog| <= e^{-gamma}: |E1(b)| <= 1.9261 b for all b >= 2
 *   (explicit, loose vs the sharp imp-97265/imp-97290 ceiling |E1(b)| <= b/4). Unconditionally
 *   (crude |Qlog| <= log b): |E1(b)| = O(b log b), with NO 2^omega(b) prefactor.
 *   (e) WHAT REMAINS OPEN. The single Mertens-product bound on Qlog -- the SAME O(1) log-cancellation
 *   obstruction class as the E0 Stirling-tail residual (imp-97289).
 *   (f) STATUS: documentation only. No rigorous unconditional uniform constant; no bound on Lambda
 *   moves; no refereed bound is changed; RH open; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   closed form and honest partial reduction. Not a new proof, not a new bound. NO QED.
 *
 * @see imp-97288-route-m-e1-explicit-uniform-constant.js (source: the exact closed form, the three
 *   pinned constituents, the Qlog Mertens obstruction)
 * @see imp-97224-route-m-arith-first-moment-uniform-E1.js (E1 = CK + E1_tail; tail constant; CK left unpinned)
 * @see imp-97289 (the E0 Stirling-tail O(1) residual -- same Mertens/log-cancellation obstruction class as Qlog)
 * @see imp-97265-route-m-arith-first-moment-quarter-ceiling-proof.js (the separate sharp 1/4 close-factor sub-gap)
 *
 * Ticket: imp-97408 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The E1 explicit-constant headword, baked verbatim (no re-import).
const E1_EXPLICIT_CONSTANT_HEADWORD = Object.freeze({
  key: 'e1-explicit-constant-qlog-mertens-imp97288',
  term:
    'E1 explicit-constant closed form: CK(b) = (b/12) Qlog(b) - (b/4) Q0(b) + b logA (Q0(b) - mu(b)) ' +
    '+ C_sum(b), with three of its four constituents explicitly pinned and the fourth (Qlog) reduced ' +
    'to a single named Mertens-product estimate',
  definition:
    'An exact closed form (verified to machine precision on a mixed ladder to b=720720) for the ' +
    'Route M weighted-first-moment remainder polynomial/log part CK(b), with E1(b) = CK(b) + ' +
    'E1_tail(b) and |E1_tail(b)| <= (zeta(2)-1)/720 * b. Three of the four constituents carry ' +
    'explicit uniform bounds: |Q0(b)| = prod_{p|b}(p-1)/b <= 1, |mu(b)| <= 1, and |C_sum(b)| <= ' +
    'K_C b with K_C = 1.13088 (from the imp-97202 Moebius-moment decay |S_k(b)| <= zeta(k)-1 <= ' +
    '3*2^{-k}). The fourth, Qlog(b) = -Q0(b) Sum_{p^a||b} log p [(a-1)p-a]/(1-p), reduces exactly to ' +
    'a Mertens-product estimate prod_{p|b}(1-1/p) Sum_{p|b}(log p)/(p-1) <= C_Q.',
  mechanism:
    'The Qlog obstruction is MEASURED (sup |Qlog| = 0.475 at the 9-primorial 223092870) climbing ' +
    'toward the Mertens limit e^{-gamma} = 0.56146 from below, but not certified by an explicit ' +
    'Mertens/Rosser-Schoenfeld bound -- the SAME O(1) log-cancellation residual class as the E0 ' +
    'Stirling-tail obstruction (imp-97289). Conditional on |Qlog| <= e^{-gamma}: |E1(b)| <= 1.9261 b ' +
    'for all b >= 2 (explicit, but loose against the sharp imp-97265/imp-97290 ceiling |E1(b)| <= ' +
    'b/4). Unconditionally, the crude bound |Qlog| <= |Q0| log b <= log b gives |E1(b)| = O(b log b), ' +
    'with NO 2^omega(b) prefactor -- converting the imp-97224 "measured O(b), constant unpinned" ' +
    'finding into "O(b) modulo one named Mertens bound; unconditionally O(b log b), 2^omega-free".',
  verificationStatus:
    'Re-cited from the imp-97288 source module ' +
    '(src/data/imp-97288-route-m-e1-explicit-uniform-constant.js). The closed form is an exact ' +
    'identity verified to machine precision to b=720720; the three pinned constituent bounds hold ' +
    'uniformly including at 2^omega(b)=64. The Qlog Mertens-product bound is NOT proved -- naming / ' +
    'glossary headword only; supplies no new bound; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP97408_E1_EXPLICIT_CONSTANT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97408',
  proofSection: 'S-frontier',
  glosses: 'imp-97288',
  question:
    'imp-97288 derived an exact closed form CK(b) = (b/12) Qlog(b) - (b/4) Q0(b) + b logA (Q0(b) - ' +
    'mu(b)) + C_sum(b) for the E1 remainder, pinned three of its four constituents explicitly, and ' +
    'reduced the fourth (Qlog) to a single named Mertens-product estimate. What is the headword for ' +
    'this closed form and its residual obstruction?',
  headword: E1_EXPLICIT_CONSTANT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97288 E1 explicit-constant ' +
    'closed form CK(b) = (b/12) Qlog(b) - (b/4) Q0(b) + b logA (Q0(b) - mu(b)) + C_sum(b): three of ' +
    'its four constituents explicitly bounded (K_C = 1.13088), the fourth (Qlog) reduced to a single ' +
    'Mertens-product estimate (measured sup 0.475 vs e^{-gamma} = 0.56146). No bound moved; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97288 (the exact closed form, the three pinned constituents, the Qlog Mertens obstruction); ' +
    'imp-97289 (the E0 Stirling-tail residual in the same obstruction class); imp-97224 (the E1 = ' +
    'CK + E1_tail split this closed form completes).',
});

export default IMP97408_E1_EXPLICIT_CONSTANT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97408_E1_EXPLICIT_CONSTANT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97408-headword-names-closed-form-and-residual',
    why: 'The headword must name the exact CK(b) closed form, the explicit K_C constant, and the ' +
      'Qlog Mertens residual -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97408_E1_EXPLICIT_CONSTANT_GLOSSARY_HEADWORD.headword;
      return (
        /CK\(b\) = \(b\/12\) Qlog\(b\)/.test(h.definition) &&
        /K_C = 1\.13088/.test(h.definition) &&
        /0\.56146/.test(h.mechanism) &&
        /0\.475/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97408-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97288.',
    holds: () =>
      IMP97408_E1_EXPLICIT_CONSTANT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97408_E1_EXPLICIT_CONSTANT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97408_E1_EXPLICIT_CONSTANT_GLOSSARY_HEADWORD.verdict) &&
      IMP97408_E1_EXPLICIT_CONSTANT_GLOSSARY_HEADWORD.glosses === 'imp-97288',
  },
];

for (const assertion of IMP97408_E1_EXPLICIT_CONSTANT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97408-e1-explicit-constant-qlog-mertens-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
