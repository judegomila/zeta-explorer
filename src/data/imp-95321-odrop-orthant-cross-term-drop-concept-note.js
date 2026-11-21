/**
 * @module imp-95321-odrop-orthant-cross-term-drop-concept-note
 * @fileoverview imp-95321 -- import-light concept note for the imp-95254
 *   LEMMA ODROP (orthant cross-term drop): splitting a signed amplitude
 *   vector c into its nonnegative orthant parts c_plus, c_minus and
 *   discarding the cross term keeps the left-tail Gram cancellation cost
 *   at exactly zero, instead of paying for it as imp-95233 PHASE-CERT did.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95254 proves LEMMA ODROP as one small step feeding THEOREM
 *   PHASE-AM (the sharper phase-priced signed seam bound). The frontier
 *   scout flagged this step -- a two-line positivity argument with an
 *   outsized effect on the final constant -- as worth documenting on its
 *   own, separate from the surrounding theorem. This note restates the
 *   lemma and why it is strictly better than the alternative it replaced;
 *   it re-derives nothing and establishes no new bound.
 *
 *   THE LEMMA
 *   -----------------------------------------------
 *   Model (imp-95221/95222/95233/95254): packets f_n(s) = e^(-mu_n|s-u_n|),
 *   rates mu_n > 0, centers u_n > 0, real amplitudes c_n; the left-tail
 *   Gram entries L_mn = integral_(s<0) f_m f_n = e^(-(mu_m u_m + mu_n u_n))
 *   / (mu_m + mu_n) are ALL strictly positive (every center is positive,
 *   so both packets decay into s < 0). Split c = c_plus - c_minus into its
 *   entrywise-nonnegative, disjoint-support positive and negative parts.
 *   Then
 *     c^T L c = c_plus^T L c_plus + c_minus^T L c_minus - 2 c_plus^T L c_minus
 *             <= c_plus^T L c_plus + c_minus^T L c_minus,
 *   because c_plus^T L c_minus >= 0 (a nonnegative vector times an
 *   entrywise-positive matrix times a nonnegative vector), so the dropped
 *   cross term -2 c_plus^T L c_minus is <= 0. No Cauchy-Schwarz, no
 *   Gershgorin, no spectral step -- pure sign bookkeeping.
 *
 *   WHY IT MATTERS (cost zero vs. the PHASE-CERT alternative)
 *   -----------------------------------------------
 *   The prior route (imp-95233 PHASE-CERT) bounded W(f) = c^T L c by
 *   W(g), g = sum |c_n| f_n the positive-modulus envelope. Expanding W(g)
 *   entrywise gives EXACTLY
 *     W(g) = c_plus^T L c_plus + c_minus^T L c_minus + 2 c_plus^T L c_minus,
 *   i.e. the same two diagonal-orthant blocks as ODROP, but with the cross
 *   term RE-ADDED with a plus sign instead of dropped. Since the cross
 *   term is always >= 0, ODROP's bound never exceeds W(g), and is
 *   STRICTLY smaller whenever any positive and negative amplitude overlap
 *   in the Gram sense (c_plus^T L c_minus > 0). This is precisely the gap
 *   THEOREM PHASE-AM uses to strictly dominate PHASE-CERT by the exact
 *   factor (1 + theta)/2 <= 1.
 *
 *   WHAT IT DOES NOT DO
 *   -----------------------------------------------
 *   ODROP is a one-step inequality, not a sharp identity: the true value
 *   c^T L c is exactly c_plus^T L c_plus + c_minus^T L c_minus minus the
 *   (nonzero, in general) cross term, so ODROP still throws away real
 *   information whenever the cross term is strictly positive. It does not
 *   by itself produce a bound on R(f) = W(f)/T(f) -- that requires
 *   pairing it with LEMMA ENT (entrywise seam-mass domination) inside
 *   THEOREM PHASE-AM, which this note does not re-derive. It also does
 *   not depend on any positivity of the rates or the depth y_min beyond
 *   what makes L entrywise positive; the argument is model-generic.
 *
 * @see imp-95254-orthant-split-phase-certificate.js (source: LEMMA ODROP,
 *   LEMMA ENT, THEOREM PHASE-AM, the PHASE-CERT comparison)
 * @see imp-95233 (PHASE-CERT: the W(f) <= W(g) route that ODROP improves on)
 *
 * Ticket: imp-95321 (content, low). Documentation only; establishes no new
 * bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95254).
const ODROP_HEADWORD = Object.freeze({
  key: 'odrop-orthant-cross-term-drop',
  term:
    'LEMMA ODROP: c^T L c <= c_plus^T L c_plus + c_minus^T L c_minus for ' +
    'any entrywise-positive Gram matrix L and signed vector c = c_plus - ' +
    'c_minus, the imp-95254 orthant cross-term drop',
  whatItBounds:
    'The left-tail seam energy W(f) = c^T L c of any signed packet family ' +
    'f = sum c_n f_n, where L_mn = e^(-(mu_m u_m + mu_n u_n))/(mu_m + ' +
    'mu_n) > 0 is the exact left-tail Gram matrix of positively-centered ' +
    'exponential packets f_n(s) = e^(-mu_n|s-u_n|).',
  whatItYields:
    'Splitting c into its nonnegative-orthant parts c_plus, c_minus ' +
    '(disjoint supports) and discarding the cross term ' +
    '-2 c_plus^T L c_minus (which is <= 0 since L is entrywise positive ' +
    'and c_plus, c_minus >= 0) gives c^T L c <= c_plus^T L c_plus + ' +
    'c_minus^T L c_minus at cost zero -- no term is overestimated to pay ' +
    'for the drop.',
  whyItBeatsPhaseCert:
    'The prior route (imp-95233 PHASE-CERT, W(f) <= W(g) with g the ' +
    'positive-modulus envelope) expands to EXACTLY the same two ' +
    'orthant-block sum plus the cross term RE-ADDED with a plus sign: ' +
    'W(g) = c_plus^T L c_plus + c_minus^T L c_minus + 2 c_plus^T L c_minus. ' +
    'Since the cross term is always >= 0, ODROP is never looser than ' +
    'W(g) and is strictly tighter whenever positive and negative ' +
    'amplitudes overlap in the Gram sense -- exactly the gap THEOREM ' +
    'PHASE-AM turns into a strict (1 + theta)/2 dominance factor over ' +
    'PHASE-CERT.',
  whatItDoesNotDo:
    'ODROP alone yields no bound on R(f) = W(f)/T(f) -- it must be paired ' +
    'with LEMMA ENT inside THEOREM PHASE-AM, not re-derived here -- and it ' +
    'still discards the (generally nonzero) cross term rather than ' +
    'computing it exactly, so it is a one-step inequality, not an identity.',
});

export const IMP95321_ODROP_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95321',
  proofSection: 'S-frontier',
  glosses: 'imp-95254',
  scopes:
    'LEMMA ODROP: c^T L c <= c_plus^T L c_plus + c_minus^T L c_minus for ' +
    'entrywise-positive L',
  question:
    'What does the imp-95254 LEMMA ODROP orthant cross-term drop state, ' +
    'and why does dropping the cross term at cost zero make THEOREM ' +
    'PHASE-AM strictly sharper than the imp-95233 PHASE-CERT route that ' +
    're-added it with a plus sign?',
  headword: ODROP_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the ' +
    'imp-95254 LEMMA ODROP inequality c^T L c <= c_plus^T L c_plus + ' +
    'c_minus^T L c_minus, the one-line positivity argument behind it, and ' +
    'why it strictly dominates the imp-95233 PHASE-CERT envelope bound ' +
    'W(g) by exactly the nonnegative cross term 2 c_plus^T L c_minus. ' +
    'Establishes nothing new; fires no certificate; no refereed bound is changed' +
    '.',
  citation:
    'imp-95254-orthant-split-phase-certificate.js (LEMMA ODROP, LEMMA ' +
    'ENT, THEOREM PHASE-AM); imp-95233 (PHASE-CERT, the W(f) <= W(g) ' +
    'route ODROP improves on).',
});

export default IMP95321_ODROP_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95321_ODROP_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95321-headword-has-required-fields',
    why:
      'The concept note must state what ODROP bounds, what inequality it ' +
      'yields, why it strictly beats the PHASE-CERT alternative, and the ' +
      'one-step-not-an-identity caveat -- the entire point of the note.',
    holds: () => {
      const h = IMP95321_ODROP_CONCEPT_NOTE.headword;
      return (
        /L_mn/.test(h.whatItBounds) &&
        /c_plus\^T L c_plus/.test(h.whatItYields) &&
        /PHASE-CERT/.test(h.whyItBeatsPhaseCert) &&
        /LEMMA ENT/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95321-left-gram-entrywise-positive',
    why:
      'ODROP relies on L being entrywise positive -- verify directly from ' +
      'the exact left-tail Gram formula on a random grid of rates and ' +
      'positive centers.',
    holds: () => {
      function leftL(mu1, u1, mu2, u2) {
        return Math.exp(-(mu1 * u1 + mu2 * u2)) / (mu1 + mu2);
      }
      function mulberry(seed) {
        let s = seed >>> 0;
        return () => {
          s = (s + 0x6d2b79f5) >>> 0;
          let t = Math.imul(s ^ (s >>> 15), 1 | s);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      }
      const rand = mulberry(95321);
      for (let t = 0; t < 5000; t++) {
        const mu1 = 0.05 + 6 * rand();
        const mu2 = 0.05 + 6 * rand();
        const u1 = 0.05 + 5 * rand();
        const u2 = 0.05 + 5 * rand();
        if (!(leftL(mu1, u1, mu2, u2) > 0)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp95321-odrop-inequality-and-phase-cert-gap',
    why:
      'Verify the ODROP inequality c^T L c <= c_plus^T L c_plus + ' +
      'c_minus^T L c_minus on random signed families, and the exact ' +
      'identity W(g) = ODROP-block-sum + 2*cross confirming ODROP never ' +
      'exceeds and is generically strictly below the PHASE-CERT bound ' +
      'W(g).',
    holds: () => {
      function leftL(mu1, u1, mu2, u2) {
        return Math.exp(-(mu1 * u1 + mu2 * u2)) / (mu1 + mu2);
      }
      function mulberry(seed) {
        let s = seed >>> 0;
        return () => {
          s = (s + 0x6d2b79f5) >>> 0;
          let t = Math.imul(s ^ (s >>> 15), 1 | s);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      }
      const rand = mulberry(20260911);
      let sawStrictGap = false;
      for (let trial = 0; trial < 3000; trial++) {
        const n = 2 + Math.floor(rand() * 4);
        const mu = [];
        const u = [];
        const c = [];
        for (let k = 0; k < n; k++) {
          mu.push(0.2 + 4 * rand());
          u.push(0.1 + 3 * rand());
          c.push((rand() - 0.5) * 6);
        }
        let cTLc = 0;
        let orthantSum = 0;
        let cross = 0;
        let wg = 0;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            const L = leftL(mu[i], u[i], mu[j], u[j]);
            cTLc += c[i] * c[j] * L;
            const ip = Math.max(c[i], 0);
            const im = Math.max(-c[i], 0);
            const jp = Math.max(c[j], 0);
            const jm = Math.max(-c[j], 0);
            orthantSum += (ip * jp + im * jm) * L;
            cross += ip * jm * L;
            wg += Math.abs(c[i] * c[j]) * L;
          }
        }
        if (cross < -1e-12) return false; // cross term must be >= 0
        if (cTLc > orthantSum + 1e-9) return false; // ODROP inequality
        if (Math.abs(wg - (orthantSum + 2 * cross)) > 1e-9) return false; // exact identity
        if (orthantSum < wg - 1e-9) sawStrictGap = true; // ODROP strictly beats PHASE-CERT here
      }
      return sawStrictGap;
    },
  },
  {
    id: 'imp95321-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95321_ODROP_CONCEPT_NOTE.anyEnclosureEstablished === false &&
      /refereed bound is changed/i.test(IMP95321_ODROP_CONCEPT_NOTE.verdict) &&
      IMP95321_ODROP_CONCEPT_NOTE.glosses === 'imp-95254' &&
      IMP95321_ODROP_CONCEPT_NOTE.scopes ===
        'LEMMA ODROP: c^T L c <= c_plus^T L c_plus + c_minus^T L c_minus ' +
          'for entrywise-positive L',
  },
];

for (const assertion of IMP95321_ODROP_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95321-odrop-orthant-cross-term-drop-concept-note assertion failed: ${assertion.id}`
    );
  }
}
