/**
 * @module imp-96083-route-vocabulary-glossary-headwords
 * @fileoverview imp-96083 -- import-light Concepts glossary headwords for four terms of
 *   route-vocabulary introduced by the 2026-09-23 novel-routes sweep, bundled into one lookup
 *   module so a reader landing on any of the Route I/L/M/J threads cold has a one-line
 *   definition without re-deriving it from the source module:
 *     (1) Vasyunin cotangent sum / Gram (Route M, Nyman-Beurling),
 *     (2) semilocal Sonine trace identity S = {oo, 2} (Route I),
 *     (3) CMV/Verblunsky truncation (Route L, finite Hilbert-Polya),
 *     (4) Fejer pure-scheme floor (Route J, zero-free-region ladder).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style set of lookup entries restating existing source-module conclusions
 *   verbatim (no re-derivation, no re-import of the source modules). Establishes nothing new,
 *   instantiates no interval, closes no sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000 (source: Vasyunin cotangent sum / Gram)
 * @see rh-route-i-semilocal-sonine-trace-identity-2026-09-23 (source: semilocal Sonine trace identity)
 * @see imp-96051-route-l-cmv-zero-crossval (source: CMV/Verblunsky truncation cross-validation)
 * @see rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23 (source: Route J Fejer scheme)
 * @see imp-96058-fejer-ceiling-floor-ladder-viz-data (source: Fejer pure-scheme floor ladder)
 *
 * Ticket: imp-96083 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

export const IMP96083_ROUTE_VOCABULARY_GLOSSARY_HEADWORDS = Object.freeze([
  Object.freeze({
    key: 'vasyunin-cotangent-sum-gram',
    term: 'Vasyunin cotangent sum / Gram (Route M, Nyman-Beurling)',
    definition:
      'The Vasyunin cotangent sum V(a/q) = Sum_{m<q} frac(m a/q) cot(pi m/q) is the classical ' +
      'closed form for the inner products I(h,k) used to build the exact Nyman-Beurling Gram ' +
      'matrix G_{hk} = gcd(h,k) I(h/gcd, k/gcd) / (h k) on the basis {h}(t) = frac(1/(h t)) ' +
      '(rescaled), h,k = 1..N. Solving c = G^{-1} b for b_k = (log k + 1 - gamma)/k gives the ' +
      'least-squares distance-squared d_N^2 = 1 - b.c to the Beurling-Nyman closure target. ' +
      'Route M rebuilds this Gram exactly to N = 6000 (imp-96105), reproducing the imp-96094 ' +
      'N <= 2600 values bit-for-bit and staying SPD throughout (lam_min descends 2.06e-5 to ' +
      '4.69e-8, N=250..6000).',
    citation: 'imp-96105-route-m-vasyunin-gram-extend-n6000; imp-96094-route-m-burnol-ratio-dense-ladder',
  }),
  Object.freeze({
    key: 'semilocal-sonine-trace-identity-s-inf-2',
    term: 'Semilocal Sonine trace identity, S = {oo, 2} (Route I)',
    definition:
      'An exact Connes-Consani-style semilocal trace identity on X_S = (R x Q_2)/(+-2^Z): ' +
      'L_S(f) := Tr(vartheta(f) P Phat_S P) = W_oo(f) + W_2(f) + D_S(f) for all f in C_c^oo(R_+^*), ' +
      'where Phat_S = F_S P_1 F_S is the semilocal band-limitation, F_S = I o (u_oo u_2)^g with ' +
      'u_2 = rho_2 exactly Tate’s local factor of Q_2 (unimodular on Re s = 1/2), W_oo/W_2 are ' +
      'the archimedean and p=2 Weil terms ("Arch"/"P_2" of Route H), and D_S is an explicit, ' +
      'unconditionally-computable remainder. The identity EXISTS and its trace side is ' +
      'unconditionally positive, but D_S is irreducible: Weil positivity on g-support < ln 3 is ' +
      'the INEQUALITY D_S <= L_S on pole-free test functions, not an identity, and D_S measures ' +
      '96.7% (a=0.5) / 99.71% (a=(ln3)/2) of L_S on the pole-free Weil minimizer.',
    citation:
      'rh-route-i-semilocal-sonine-trace-identity-2026-09-23; rh-route-i-sonine-excess-semilocal-port-2026-09-23',
  }),
  Object.freeze({
    key: 'cmv-verblunsky-truncation',
    term: 'CMV/Verblunsky truncation (Route L, finite Hilbert-Polya)',
    definition:
      'A concrete finite Hilbert-Polya truncation built with NO zero input: Taylor coefficients ' +
      'of xi(s) at s = 1/2 + a (a = 20) feed a Szego/Levinson-Durbin recursion producing ' +
      'Verblunsky (Schur) parameters alpha_k, |alpha_k| < 1 iff the underlying finite Toeplitz ' +
      'form is positive-definite; those alpha_k assemble the unitary CMV matrix whose eigenvalues ' +
      'e^{i theta_k} are mapped back to the critical line via the Cayley/Herglotz transform ' +
      'z_rho(a) = (rho - 1/2 - a)/(rho - 1/2 + a). Cross-validated against the in-repo verified ' +
      'ordinates: the N=400 CMV truncation reproduces the first 12 zeros to max 4.82e-13 in angle ' +
      '(imp-96051), confirming and tightening the original "1e-12" claim; the Verblunsky sequence ' +
      'recedes from the unit circle at large order (block-max |alpha| 0.969 -> 0.13 by k=1300), so ' +
      'PD/unitarity holds with no positivity obstruction -- the observed finite-N zero-resolution ' +
      'wall is resolution-limited (moment noise floor), not intrinsic.',
    citation: 'imp-96051-route-l-cmv-zero-crossval; rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23',
  }),
  Object.freeze({
    key: 'fejer-pure-scheme-floor',
    term: 'Fejer pure-scheme floor (Route J, zero-free-region ladder)',
    definition:
      'The limiting value R = 5.8284 (c = 0.171573) that the Fejer-kernel zero-free-region ' +
      'ladder R_floor(n) = 1/c_ceil(n) descends toward as the trig-polynomial degree n grows ' +
      'without bound, staying strictly within the "pure Fejer" nonnegativity scheme (as opposed ' +
      'to a differently-weighted scheme). The classical de la Vallee Poussin 3-4-1 point sits far ' +
      'above it (R ~ 34.82, degree 2), while the Mossinghoff-Trudgian (2015) Stechkin-weighted ' +
      'point (R = 5.573412) sits BELOW the pure-scheme floor precisely because it uses a ' +
      'different, non-Fejer weighting -- so "pure-scheme floor" names a floor for one specific ' +
      'admissible-kernel family, not a floor over all zero-free-region constructions.',
    citation: 'imp-96058-fejer-ceiling-floor-ladder-viz-data; rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23',
  }),
]);

export default IMP96083_ROUTE_VOCABULARY_GLOSSARY_HEADWORDS;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96083_ROUTE_VOCABULARY_GLOSSARY_HEADWORDS_ASSERTIONS = [
  {
    id: 'imp96083-four-headwords-present-with-required-keys',
    why: 'The ticket asks for four distinct headwords (Vasyunin cotangent sum/Gram, semilocal ' +
      'Sonine trace identity S={oo,2}, CMV/Verblunsky truncation, Fejer pure-scheme floor); each ' +
      'must carry a key/term/definition/citation so it is independently lookup-able.',
    holds: () =>
      IMP96083_ROUTE_VOCABULARY_GLOSSARY_HEADWORDS.length === 4 &&
      IMP96083_ROUTE_VOCABULARY_GLOSSARY_HEADWORDS.every(
        (h) => typeof h.key === 'string' && typeof h.term === 'string' &&
          typeof h.definition === 'string' && typeof h.citation === 'string',
      ),
  },
  {
    id: 'imp96083-headword-content-matches-source-facts',
    why: 'Each definition must state the specific numeric/structural fact from its source module ' +
      '(not a vague paraphrase): the cotangent sum formula, the D_S <= L_S inequality (not ' +
      'identity), the 4.82e-13 CMV angle error, and the R=5.8284 pure-scheme limit.',
    holds: () => {
      const [vasyunin, sonine, cmv, fejer] = IMP96083_ROUTE_VOCABULARY_GLOSSARY_HEADWORDS;
      return (
        /cot\(pi m\/q\)/.test(vasyunin.definition) &&
        /D_S <= L_S/.test(sonine.definition) &&
        /4\.82e-13/.test(cmv.definition) &&
        /5\.8284/.test(fejer.definition)
      );
    },
  },
  {
    id: 'imp96083-headwords-cite-their-source-modules',
    why: 'Each headword must cite the source module it glosses so a reader can trace the claim ' +
      'back to its derivation rather than treating this bundle as a standalone re-derivation.',
    holds: () => {
      const [vasyunin, sonine, cmv, fejer] = IMP96083_ROUTE_VOCABULARY_GLOSSARY_HEADWORDS;
      return (
        /imp-96105/.test(vasyunin.citation) &&
        /rh-route-i-semilocal-sonine-trace-identity/.test(sonine.citation) &&
        /imp-96051/.test(cmv.citation) &&
        /imp-96058/.test(fejer.citation)
      );
    },
  },
];

for (const assertion of IMP96083_ROUTE_VOCABULARY_GLOSSARY_HEADWORDS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96083-route-vocabulary-glossary-headwords assertion failed: ${assertion.id}`,
    );
  }
}
