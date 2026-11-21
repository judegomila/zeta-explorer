/**
 * @module imp-95325-blaschke-newton-antitrap-concept-note
 * @fileoverview imp-95325 -- import-light concept note for the imp-95251
 *   LEMMA BN (Blaschke-Newton interpolant) specifically: the coalescence
 *   anti-trap mechanism that replaces the classical Lagrange divided-
 *   difference form (PROP BL) as the first of the three lemmas assembling
 *   THEOREM COAL-N.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95251 proves THEOREM COAL-N from three lemmas: LEMMA BN, LEMMA DD,
 *   and LEMMA LAG. The imp-95302 concept note documents the assembled
 *   THEOREM COAL-N closed form and its majorant-only status, but only
 *   mentions LEMMA BN in passing as one ingredient among three. This note
 *   isolates LEMMA BN itself -- the specific mechanism by which a Newton
 *   interpolation scheme built in the Blaschke basis avoids the blow-up
 *   that traps the classical Lagrange form at coalescing rates. It
 *   re-derives nothing and establishes no new bound.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   Let b_j(s) = (s - nu_j)/(s + nu_j) and B_k = prod_(j<k) b_j (B_0 = 1).
 *   Starting from F_0(s) = e^(-d s), LEMMA BN defines the recursion
 *     c_k = F_k(nu_k),   F_(k+1)(s) = (F_k(s) - c_k) (s + nu_k)/(s - nu_k).
 *   Each F_(k+1) is analytic on the right half-plane C+: the apparent
 *   singularity at s = nu_k is removable because the numerator
 *   F_k(s) - c_k vanishes exactly where the denominator s - nu_k does.
 *   Unwinding the recursion gives the Newton expansion in the Blaschke
 *   basis, F_0 = sum_(k<N) c_k B_k + B_N F_N, and because B_k(nu_i) = 0
 *   for k > i, the truncated sum g = sum_(k<N) c_k B_k interpolates
 *   g(nu_i) = e^(-d nu_i) = w_i at every rate. Since |b_j| <= 1 on C+,
 *   ||g||_inf <= sum_(k<N) |c_k|, and imp-95226 THEOREM NP-CERT converts
 *   this interpolation bound directly into sqrt(Lambda) <= sum_(k<N) |c_k|.
 *
 *   WHY IT IS AN ANTI-TRAP (the mechanism, contrasted with PROP BL)
 *   -----------------------------------------------
 *   The classical alternative is the Lagrange divided-difference form,
 *   imp-95226 PROP BL: it prices the same interpolation problem through
 *   divided differences with separation denominators prod (nu_i - nu_j),
 *   which blow up as any two rates coalesce (nu_i -> nu_j). LEMMA BN
 *   replaces those separation denominators with Blaschke denominators
 *   s - nu_k that are cancelled AT THE SAME POINT by a numerator built to
 *   vanish there (c_k = F_k(nu_k) is subtracted off before dividing), so
 *   the coefficients c_k stay finite as rates coalesce -- confirmed
 *   independently on near-coalescent triples (separations 1e-2 to 1e-4)
 *   where the BN sum stays finite while the direct pencil eigensolve
 *   loses digits. This is what makes LEMMA BN reusable as coalescence-
 *   uniform machinery: the certificate needs no rate-separation
 *   information at all.
 *
 *   WHAT IT DOES NOT DO (a certificate, not yet a closed form)
 *   -----------------------------------------------
 *   LEMMA BN alone only gives sqrt(Lambda) <= sum_(k<N) |c_k| -- a
 *   certificate in terms of the recursion coefficients c_k, not a closed
 *   form in the count N, window ratio R, and depth x. Turning it into the
 *   THEOREM COAL-N closed form additionally requires LEMMA DD (the
 *   contour-pivot identity showing the partial sums I_k = sum_(l<=k) c_l
 *   equal classical divided differences [nu_0 .. nu_k] phi_k) and LEMMA
 *   LAG (a Laguerre-polynomial bound on each |I_k|). This note documents
 *   only the LEMMA BN interpolation mechanism and its anti-trap property;
 *   it does not restate the LEMMA DD / LEMMA LAG assembly or the coalN
 *   closed form, which imp-95302 already covers.
 *
 * @see imp-95251-nfold-coalescence-law.js (source: LEMMA BN, LEMMA DD,
 *   LEMMA LAG, THEOREM COAL-N)
 * @see imp-95226-np-exact-signed-shift-constant.js (source: THEOREM
 *   NP-CERT used to convert ||g||_inf into the Lambda bound; PROP BL, the
 *   separation-priced Lagrange form LEMMA BN replaces)
 * @see imp-95302-coal-n-majorant-concept-note.js (sibling note: the
 *   assembled THEOREM COAL-N closed form and its majorant-only status)
 *
 * Ticket: imp-95325 (content, low). Documentation only; establishes no new
 * bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95251/95226).
const BLASCHKE_NEWTON_ANTITRAP_HEADWORD = Object.freeze({
  key: 'blaschke-newton-antitrap',
  term:
    'LEMMA BN (Blaschke-Newton interpolant): F_0 = sum_(k<N) c_k B_k + ' +
    'B_N F_N in the Blaschke basis B_k = prod_(j<k) b_j, giving ' +
    'sqrt(Lambda) <= sum_(k<N) |c_k| via imp-95226 NP-CERT',
  whatItBounds:
    'The signed shift constant Lambda for any N rates nu_0 < ... < ' +
    'nu_(N-1), via a Newton interpolation recursion c_k = F_k(nu_k), ' +
    'F_(k+1)(s) = (F_k(s) - c_k)(s + nu_k)/(s - nu_k) starting from ' +
    'F_0(s) = e^(-d s), whose truncated Blaschke-basis sum g interpolates ' +
    'g(nu_i) = w_i = e^(-d nu_i) at every rate.',
  whyItIsAntiTrap:
    'The classical Lagrange divided-difference form PROP BL prices the ' +
    'same interpolation problem through separation denominators ' +
    'prod (nu_i - nu_j) that blow up as rates coalesce. LEMMA BN instead ' +
    'divides by s - nu_k at exactly the point where the numerator ' +
    'F_k(s) - c_k is built to vanish (a removable singularity), so the ' +
    'coefficients c_k stay finite as rates coalesce -- confirmed on ' +
    'near-coalescent triples (separations 1e-2 to 1e-4) where the BN sum ' +
    'stays finite while the direct pencil eigensolve loses digits.',
  whyItIsReused:
    'LEMMA BN supplies only the first of three ingredients THEOREM ' +
    'COAL-N assembles: LEMMA DD (contour-pivot identity relating the ' +
    'partial sums I_k = sum_(l<=k) c_l to classical divided differences) ' +
    'and LEMMA LAG (a Laguerre bound on each |I_k|) convert the raw ' +
    'sum_(k<N) |c_k| certificate into the closed-form coalN(N, R, x) ' +
    'majorant that imp-95302 documents.',
  whatItDoesNotDo:
    'LEMMA BN alone gives only sqrt(Lambda) <= sum_(k<N) |c_k|, a ' +
    'certificate in terms of recursion coefficients, not a closed form ' +
    'in N, R, x -- that requires LEMMA DD and LEMMA LAG on top, which ' +
    'this note does not restate.',
});

export const IMP95325_BLASCHKE_NEWTON_ANTITRAP_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95325',
  proofSection: 'S-frontier',
  glosses: 'imp-95251',
  scopes:
    'LEMMA BN: F_0 = sum_(k<N) c_k B_k + B_N F_N => sqrt(Lambda) <= ' +
    'sum_(k<N) |c_k|',
  question:
    'What does the imp-95251 LEMMA BN Blaschke-Newton interpolant bound, ' +
    'and why does its Newton-in-the-Blaschke-basis construction avoid the ' +
    'coalescence blow-up that traps the classical Lagrange form (PROP BL)?',
  headword: BLASCHKE_NEWTON_ANTITRAP_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the ' +
    'imp-95251 LEMMA BN Newton-in-the-Blaschke-basis interpolation ' +
    'recursion and why its removable-singularity construction keeps the ' +
    'coefficients c_k finite at coalescing rates where the Lagrange form ' +
    'PROP BL blows up, and notes it is only one of three lemmas ' +
    '(BN + DD + LAG) THEOREM COAL-N assembles. Establishes nothing new; ' +
    'fires no certificate; no refereed bound is changed.',
  citation:
    'imp-95251-nfold-coalescence-law.js (LEMMA BN, LEMMA DD, LEMMA LAG); ' +
    'imp-95226-np-exact-signed-shift-constant.js (THEOREM NP-CERT, PROP ' +
    'BL); imp-95302-coal-n-majorant-concept-note.js (sibling note on the ' +
    'assembled THEOREM COAL-N).',
});

export default IMP95325_BLASCHKE_NEWTON_ANTITRAP_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95325_BLASCHKE_NEWTON_ANTITRAP_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95325-headword-has-required-fields',
    why:
      'The concept note must state what LEMMA BN bounds, why it is an ' +
      'anti-trap relative to PROP BL, why it is reused as one of three ' +
      'ingredients, and what it does not itself supply -- the entire ' +
      'point of the note.',
    holds: () => {
      const h = IMP95325_BLASCHKE_NEWTON_ANTITRAP_CONCEPT_NOTE.headword;
      return (
        /Blaschke-basis/.test(h.whatItBounds) &&
        /PROP BL/.test(h.whyItIsAntiTrap) &&
        /removable singularity/.test(h.whyItIsAntiTrap) &&
        /LEMMA DD/.test(h.whyItIsReused) &&
        /LEMMA LAG/.test(h.whyItIsReused) &&
        /LEMMA DD/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95325-bn-interpolation-identity-holds',
    why:
      'The note claims the truncated Blaschke-Newton sum g interpolates ' +
      'g(nu_i) = e^(-d nu_i) at every rate; verify this numerically for a ' +
      'generic non-coalescent 3-rate configuration, self-contained (no ' +
      'import of imp-95251).',
    holds: () => {
      const d = 1;
      const nus = [1, 2, 5];
      const F0 = (s) => Math.exp(-d * s);
      const b = (s, nu) => (s - nu) / (s + nu);

      // Build the Newton recursion c_k = F_k(nu_k).
      let Fcur = F0;
      const c = [];
      for (let k = 0; k < nus.length; k++) {
        const nuk = nus[k];
        const Fprev = Fcur;
        const ck = Fprev(nuk);
        c.push(ck);
        Fcur = (s) => ((Fprev(s) - ck) * (s + nuk)) / (s - nuk);
      }

      // Truncated Blaschke-basis sum g = sum c_k B_k.
      const g = (s) => {
        let sum = 0;
        let Bk = 1;
        for (let k = 0; k < nus.length; k++) {
          sum += c[k] * Bk;
          Bk *= b(s, nus[k]);
        }
        return sum;
      };

      return nus.every((nu_i) => {
        const lhs = g(nu_i);
        const rhs = Math.exp(-d * nu_i);
        return Math.abs(lhs - rhs) < 1e-9;
      });
    },
  },
  {
    id: 'imp95325-anti-trap-stays-finite-near-coalescence',
    why:
      'The note claims the c_k stay finite as rates coalesce, unlike a ' +
      'separation-priced form; verify the recursion coefficients remain ' +
      'bounded as two rates approach each other to within 1e-6.',
    holds: () => {
      const d = 1;
      const nus = [1, 1 + 1e-6, 5];
      const F0 = (s) => Math.exp(-d * s);

      let Fcur = F0;
      const c = [];
      for (let k = 0; k < nus.length; k++) {
        const nuk = nus[k];
        const Fprev = Fcur;
        const ck = Fprev(nuk);
        c.push(ck);
        Fcur = (s) => ((Fprev(s) - ck) * (s + nuk)) / (s - nuk);
      }

      return c.every((ck) => Number.isFinite(ck) && Math.abs(ck) < 10);
    },
  },
  {
    id: 'imp95325-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95325_BLASCHKE_NEWTON_ANTITRAP_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(
        IMP95325_BLASCHKE_NEWTON_ANTITRAP_CONCEPT_NOTE.verdict
      ) &&
      IMP95325_BLASCHKE_NEWTON_ANTITRAP_CONCEPT_NOTE.glosses === 'imp-95251' &&
      IMP95325_BLASCHKE_NEWTON_ANTITRAP_CONCEPT_NOTE.scopes ===
        'LEMMA BN: F_0 = sum_(k<N) c_k B_k + B_N F_N => sqrt(Lambda) <= ' +
          'sum_(k<N) |c_k|',
  },
];

for (const assertion of IMP95325_BLASCHKE_NEWTON_ANTITRAP_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95325-blaschke-newton-antitrap-concept-note assertion failed: ${assertion.id}`
    );
  }
}
