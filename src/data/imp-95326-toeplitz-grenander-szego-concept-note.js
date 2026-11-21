/**
 * @module imp-95326-toeplitz-grenander-szego-concept-note
 * @fileoverview imp-95326 -- import-light concept note for the imp-95252
 *   LEMMA TOEP (Grenander-Szegoe quadratic-form bound, block form) and the
 *   log-ratio Gram normalization <ehat_nu, ehat_mu> = sech(u/2) it builds
 *   on. This isolates the single mechanism that makes an m-uniform Riesz
 *   lower bound possible at all: recognizing the normalized Gram as
 *   (block) TOEPLITZ so a Fourier symbol, not a growing matrix, controls
 *   every finite section.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95252 assembles THEOREM RZ-LAT and THEOREM RZ-TWIN from LEMMA
 *   TOEP (the abstract Toeplitz quadratic-form sandwich) and LEMMA
 *   POISSON (the closed-form symbol via Poisson summation). This note
 *   isolates LEMMA TOEP and the sech(u/2) normalization feeding it --
 *   the reason the seam Gram becomes amenable to a symbol argument at
 *   all -- without restating the LEMMA POISSON closed form or the
 *   RZ-LAT / RZ-TWIN theorems that use it (imp-95326 does not re-derive
 *   those; see the sibling coverage below).
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   Start from the unnormalized seam Gram G_ij = 1/(nu_i + nu_j) on
 *   E_V = span{e^(-nu t)} in L2(0, inf). Rescaling each generator to
 *   unit norm, ehat_nu = sqrt(2 nu) e^(-nu t), gives
 *     <ehat_nu, ehat_mu> = 2 sqrt(nu mu)/(nu + mu) = sech(u/2),
 *     u = ln(nu/mu),
 *   a one-line computation (LEMMA NORM) that turns a two-parameter
 *   kernel 1/(nu+mu) into a one-parameter kernel s(u) = sech(u/2) of the
 *   LOG-RATIO u alone. On a geometric lattice nu_k = nu rho^k this log
 *   ratio between index k and index k' is a(k - k'), a = ln rho: the
 *   normalized Gram entry depends only on the index DIFFERENCE, i.e. the
 *   Gram is TOEPLITZ (block Toeplitz on the twin lattice, with 2x2 blocks
 *   B_d at octave separation d). LEMMA TOEP then reads any quadratic
 *   form in Toeplitz coordinates as a Fourier integral: for
 *   p(theta) = sum_k c_k e^(i k theta) and symbol
 *   F(theta) = sum_d B_d e^(-i d theta),
 *     c* Gtilde_m c = (1/2pi) int_0^2pi p(theta)* F(theta) p(theta) dtheta,
 *   because the integral extracts exactly the Fourier block B_(k'-k) for
 *   each (k, k') pair -- the Gram block itself. Since
 *   (1/2pi) int |p|^2 = sum |c_k|^2, this immediately gives
 *     lambda_min(Gtilde_m) >= inf_theta lambda_min(F(theta)),
 *   for EVERY m (no m appears on the right), and a matching Fejer-average
 *   argument (c_k = e^(-i k theta*) v/sqrt(m)) shows the bound is sharp
 *   as m -> infinity: no m-uniform constant can beat the symbol infimum.
 *
 *   WHY IT IS THE LOAD-BEARING STEP (contrasted with the prior collar)
 *   -----------------------------------------------
 *   Before imp-95252, the only m-uniform-adjacent bound was imp-95250's
 *   leave-one-out collar, a SUM over blocks, [sum_k (1 - sigma_k^2)^(-1)]
 *   ^(-1), that is finite for fixed m but SHRINKS as m grows (more
 *   off-diagonal leakage terms to subtract). LEMMA TOEP replaces a
 *   growing finite-section computation with a single number -- the
 *   symbol infimum -- that does not see m at all, because Toeplitz
 *   structure lets the m-dependence be absorbed into a Fourier average
 *   instead of a matrix size. The sech(u/2) normalization is what MAKES
 *   the Gram Toeplitz in the first place: without rescaling to unit
 *   generators, 1/(nu_i+nu_j) depends on nu_i and nu_j separately, not
 *   just their ratio, and no shift-invariant structure would appear.
 *
 *   WHAT IT DOES NOT DO (an abstract sandwich, not yet a number)
 *   -----------------------------------------------
 *   LEMMA TOEP alone is content-free about the actual value of
 *   inf_theta lambda_min(F(theta)) -- it only reduces the m-uniform
 *   Riesz question to evaluating a symbol infimum. Producing that
 *   number in closed form (f_a - |f_b| via Poisson summation, then the
 *   THEOREM RZ-LAT / RZ-TWIN convexity arguments) is LEMMA POISSON's and
 *   the two theorems' job, which this note does not restate.
 *
 * @see imp-95252-muniform-block-riesz-seam-pencil.js (source: LEMMA NORM,
 *   LEMMA TOEP, LEMMA POISSON, THEOREM RZ-LAT, THEOREM RZ-TWIN,
 *   COROLLARY RZ-BLOCK, COROLLARY SPLIT-RZ)
 * @see imp-95226-np-exact-signed-shift-constant.js (source: the Gram
 *   normalization G_ij = 1/(nu_i+nu_j) LEMMA NORM rescales)
 * @see imp-95250-* (the prior linear-in-m leave-one-out collar LEMMA TOEP
 *   replaces with an m-independent constant)
 *
 * Ticket: imp-95326 (content, low). Documentation only; establishes no new
 * bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95252).
const TOEPLITZ_GRENANDER_SZEGO_HEADWORD = Object.freeze({
  key: 'toeplitz-grenander-szego',
  term:
    'LEMMA TOEP (Grenander-Szegoe quadratic-form bound, block form): ' +
    'c* Gtilde_m c = (1/2pi) int p(theta)* F(theta) p(theta) dtheta ' +
    '=> lambda_min(Gtilde_m) >= inf_theta lambda_min(F(theta)), for ' +
    'every m',
  whatItBounds:
    'The smallest eigenvalue of any finite section Gtilde_m of a ' +
    '(block) Toeplitz seam Gram, uniformly in the section size m, in ' +
    'terms of a Fourier symbol F(theta) built from the Toeplitz blocks ' +
    'B_d, given the log-ratio normalization ' +
    '<ehat_nu, ehat_mu> = sech(u/2), u = ln(nu/mu), that makes the Gram ' +
    'depend only on index differences on a geometric rate lattice.',
  whyItIsLoadBearing:
    'The prior imp-95250 leave-one-out collar summed off-diagonal ' +
    'leakage terms across blocks, [sum_k (1 - sigma_k^2)^(-1)]^(-1), a ' +
    'constant that SHRINKS as the block count m grows. LEMMA TOEP ' +
    'replaces this with a single symbol infimum that does not depend ' +
    'on m at all: Toeplitz structure (itself a consequence of the ' +
    'sech(u/2) log-ratio normalization) lets the m-dependence be ' +
    'absorbed into a Fourier average of an absolutely summable series ' +
    'rather than a growing finite-section computation.',
  whyItIsSharp:
    'A matching Fejer-average construction (c_k = e^(-i k theta*) ' +
    'v/sqrt(m) for the minimizing unit eigenvector v of F(theta*)) ' +
    'shows lambda_min(Gtilde_m) -> inf_theta lambda_min(F(theta)) as ' +
    'm -> infinity, so no m-uniform constant can exceed the symbol ' +
    'infimum: the bound LEMMA TOEP supplies is the sharp currency, not ' +
    'merely a convenient one.',
  whatItDoesNotDo:
    'LEMMA TOEP is an abstract reduction: it says the m-uniform Riesz ' +
    'question equals a symbol-infimum computation, but supplies no ' +
    'value for inf_theta lambda_min(F(theta)) itself. Producing that ' +
    'closed form (f_a - |f_b| via Poisson summation) and the resulting ' +
    'THEOREM RZ-LAT / RZ-TWIN bounds is LEMMA POISSON and the two ' +
    'theorems built on it, not restated here.',
});

export const IMP95326_TOEPLITZ_GRENANDER_SZEGO_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95326',
  proofSection: 'S-frontier',
  glosses: 'imp-95252',
  scopes:
    'LEMMA TOEP: c* Gtilde_m c = (1/2pi) int p* F p dtheta => ' +
    'lambda_min(Gtilde_m) >= inf_theta lambda_min(F(theta)), every m',
  question:
    'What does the imp-95252 LEMMA TOEP Grenander-Szegoe quadratic-form ' +
    'bound establish, and why does recognizing the sech(u/2) log-ratio ' +
    'Gram as (block) Toeplitz make an m-uniform Riesz lower bound ' +
    'possible where the prior leave-one-out collar shrank with m?',
  headword: TOEPLITZ_GRENANDER_SZEGO_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the ' +
    'imp-95252 LEMMA TOEP Toeplitz quadratic-form sandwich and the ' +
    'sech(u/2) log-ratio Gram normalization that produces the Toeplitz ' +
    'structure, and why the resulting symbol-infimum bound is both ' +
    'm-uniform and sharp, while noting it supplies no closed-form value ' +
    'on its own (that is LEMMA POISSON and THEOREM RZ-LAT / RZ-TWIN). ' +
    'Establishes nothing new; fires no certificate; no refereed bound is changed' +
    '.',
  citation:
    'imp-95252-muniform-block-riesz-seam-pencil.js (LEMMA NORM, LEMMA ' +
    'TOEP, LEMMA POISSON, THEOREM RZ-LAT, THEOREM RZ-TWIN); imp-95226-' +
    'np-exact-signed-shift-constant.js (Gram normalization source).',
});

export default IMP95326_TOEPLITZ_GRENANDER_SZEGO_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95326_TOEPLITZ_GRENANDER_SZEGO_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95326-headword-has-required-fields',
    why:
      'The concept note must state what LEMMA TOEP bounds, why it is ' +
      'load-bearing relative to the prior leave-one-out collar, why it ' +
      'is sharp, and what it does not itself supply -- the entire point ' +
      'of the note.',
    holds: () => {
      const h = IMP95326_TOEPLITZ_GRENANDER_SZEGO_CONCEPT_NOTE.headword;
      return (
        /Toeplitz/.test(h.whatItBounds) &&
        /sech\(u\/2\)/.test(h.whatItBounds) &&
        /leave-one-out/.test(h.whyItIsLoadBearing) &&
        /SHRINKS/.test(h.whyItIsLoadBearing) &&
        /Fejer/.test(h.whyItIsSharp) &&
        /LEMMA POISSON/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95326-sech-normalization-identity-holds',
    why:
      'The note claims the normalized-generator inner product equals ' +
      '2 sqrt(nu mu)/(nu+mu) = sech(u/2) with u = ln(nu/mu); verify this ' +
      'algebraic identity directly, self-contained (no import of ' +
      'imp-95252).',
    holds: () => {
      const pairs = [
        [1, 2],
        [1, 5],
        [3, 7],
        [1, 1.0001],
      ];
      return pairs.every(([nu, mu]) => {
        const lhs = (2 * Math.sqrt(nu * mu)) / (nu + mu);
        const u = Math.log(nu / mu);
        const rhs = 1 / Math.cosh(u / 2);
        return Math.abs(lhs - rhs) < 1e-12;
      });
    },
  },
  {
    id: 'imp95326-toeplitz-quadratic-form-symbol-identity-holds',
    why:
      'The note claims c* Gtilde_m c = (1/2pi) int p(theta)* F(theta) ' +
      'p(theta) dtheta for a scalar Toeplitz Gram with symbol ' +
      'f(theta) = sum_d s(da) e^(-i d theta); verify by direct ' +
      'quadrature against the matrix quadratic form for a small m.',
    holds: () => {
      const a = Math.log(2);
      const s = (u) => 1 / Math.cosh(u / 2);
      const m = 4;
      // Toeplitz Gram entries depend only on |k - k'|.
      const Gram = Array.from({ length: m }, (_, k) =>
        Array.from({ length: m }, (_, kp) => s((k - kp) * a))
      );
      const c = [1, -0.5, 0.3, 0.2];
      let quad = 0;
      for (let k = 0; k < m; k++)
        for (let kp = 0; kp < m; kp++) quad += c[k] * Gram[k][kp] * c[kp];

      // Fourier-side evaluation via midpoint quadrature.
      const n = 20000;
      let integral = 0;
      for (let j = 0; j < n; j++) {
        const theta = ((j + 0.5) / n) * 2 * Math.PI;
        let pRe = 0;
        let pIm = 0;
        for (let k = 0; k < m; k++) {
          pRe += c[k] * Math.cos(k * theta);
          pIm += c[k] * Math.sin(k * theta);
        }
        // Symbol f(theta) truncated to |d| <= 40 (decays like e^-|d|a/2).
        let f = 0;
        for (let d = -40; d <= 40; d++) f += s(d * a) * Math.cos(d * theta);
        integral += f * (pRe * pRe + pIm * pIm);
      }
      integral = (integral / n) * ((2 * Math.PI) / (2 * Math.PI));
      return Math.abs(integral - quad) < 1e-3;
    },
  },
  {
    id: 'imp95326-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95326_TOEPLITZ_GRENANDER_SZEGO_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(
        IMP95326_TOEPLITZ_GRENANDER_SZEGO_CONCEPT_NOTE.verdict
      ) &&
      IMP95326_TOEPLITZ_GRENANDER_SZEGO_CONCEPT_NOTE.glosses === 'imp-95252' &&
      IMP95326_TOEPLITZ_GRENANDER_SZEGO_CONCEPT_NOTE.scopes ===
        'LEMMA TOEP: c* Gtilde_m c = (1/2pi) int p* F p dtheta => ' +
          'lambda_min(Gtilde_m) >= inf_theta lambda_min(F(theta)), every m',
  },
];

for (const assertion of IMP95326_TOEPLITZ_GRENANDER_SZEGO_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95326-toeplitz-grenander-szego-concept-note assertion failed: ${assertion.id}`
    );
  }
}
