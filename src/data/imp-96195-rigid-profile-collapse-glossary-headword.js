/**
 * @module imp-96195-rigid-profile-collapse-glossary-headword
 * @fileoverview imp-96195 -- import-light glossary/Concepts headword for the imp-96164
 *   rigid-profile collapse: the p=3 OVER-DETERMINATION forces the mixed-{oo,2,3}
 *   no-modulus-1 residual's ladder-tail-interior modulus-1 candidate space down from an
 *   infinite-dimensional family of ln2-periodic (Zygmund) modulations to the single rigid
 *   profile g(v) = C/v, reducing (I) to one scalar boundary condition SG-96164-boundary.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96143 reduced the mixed-group {oo,2,3} strict-gap statement (I) to the top confined
 *   states, but left the strict inequality blocked by fractal Zygmund eigenfunctions. imp-96164
 *   showed the second Euler factor (p=3) is not redundant with the p=2 relation already ported:
 *   composing both lacunary functional equations, plus their local inverses, over the full
 *   Z^2 shift lattice on the tail interior collapses the candidate space to a single profile.
 *   A reader landing on imp-96164 cold has no quick-lookup definition of what "over-determination"
 *   buys here or why it is a reduction and not a proof. This headword bakes that collapse
 *   VERBATIM (no re-import of the imp-96164 module, to stay import-light) as a standalone entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   On the mixed {oo,2,3} ladder tail interior, a modulus-1 eigenvector must satisfy BOTH
 *   g(v) = 2 g(2v) and g(v) = 3 g(3v) (plus their local inverses). Composing over all (a,b)
 *   in Z^2 gives g(v) = 2^a 3^b g(2^a 3^b v), with multiplier exactly e^{a ln2 + b ln3}
 *   (verified to 5.9e-15 relative). Since ln2/ln3 = 0.6309297535714575 is irrational, the
 *   shift Z-module {a ln2 + b ln3} is dense in R (largest gap on [0,1] falls monotonically
 *   0.0657 -> 0.0521 -> 0.0250 -> 0.0115 as |a|,|b| <= 10,20,40,80), so continuity of the
 *   band-limited eigenfunction forces g(Uv) = g(v)/U for ALL U > 0 -- the unique continuous
 *   solution is the rigid power profile g(v) = C/v. This is a genuine collapse: the single
 *   p=2 relation alone would admit g(v) = (1/v) Phi(log_2 v) for ANY 1-periodic Phi (the
 *   infinite-dimensional Zygmund freedom that blocks diagonalization); the p=3 companion
 *   forces Phi to be periodic in two incommensurate periods (ln2 and ln3), which forces
 *   Phi constant (sampled range of cos(2*pi*t/ln2) at t = k*ln3 fills to 1.99999).
 *
 *   REDUCTION NOT PROOF: the rigid profile g(v) = C/v is itself square-integrable on the tail
 *   half-line (int_{1/2}^{oo} v^-2 dv = 2 < oo), so the scaling law alone does not force C = 0.
 *   What remains is the single scalar condition SG-96164-boundary: whether C/v can meet the
 *   archimedean-box eigen-equation boundary condition at v = 1/2 with |lambda| = 1. Numerically
 *   the p=2 top confined state sits at 0.9999731 < 1, but the exact enclosure of the boundary
 *   condition is still blocked by the Zygmund edge behaviour.
 *
 *   STATUS: a PARTIAL / reduction, not a QED. Shrinks (I) from a sup over an infinite-dimensional
 *   top box to one scalar boundary-matching condition. Nothing here diagonalizes A_S23, moves a
 *   Lambda bound, or a verified height. RH open; no refereed bound is changed; NO QED.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96164 rigid-profile-collapse derivation for quick
 *   reference. It establishes nothing, instantiates no interval, closes no sub-gap on its own
 *   (SG-96164-boundary remains open), moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96164-route-i-mixed-group-no-modulus1-overdetermination (source: the collapse this glosses)
 * @see imp-96143-route-i-mixed-ladder-23-prolate-spectrum-summability (the residual (I) this attacks)
 * @see rh-route-i-sonine-excess-semilocal-port-2026-09-23 (the single-prime p=2 relation g(v)=2g(2v))
 *
 * Ticket: imp-96195 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The rigid-profile-collapse headword, baked verbatim (no re-import).
const RIGID_PROFILE_COLLAPSE_HEADWORD = Object.freeze({
  key: 'rigid-profile-collapse-p3-overdetermination',
  term:
    'imp-96164 rigid-profile collapse: the p=3 over-determination forces the mixed-{oo,2,3} ' +
    'no-modulus-1 ladder-tail-interior candidate space down to the single rigid profile ' +
    'g(v) = C/v, reducing (I) to one scalar boundary condition SG-96164-boundary',
  definition:
    'On the mixed 2^a 3^b {oo,2,3} ladder tail interior, a modulus-1 eigenvector must satisfy ' +
    'BOTH g(v) = 2 g(2v) and g(v) = 3 g(3v) plus their local inverses. Composing over the full ' +
    'Z^2 shift lattice gives g(v) = 2^a 3^b g(2^a 3^b v) with multiplier exactly e^{a ln2 + b ln3} ' +
    '(verified to 5.9e-15 relative). Because ln2 / ln3 = 0.6309297535714575 is irrational, the ' +
    'shift Z-module { a ln2 + b ln3 } is dense in R (largest gap on [0,1] falls monotonically ' +
    '0.0657 -> 0.0521 -> 0.0250 -> 0.0115 as |a|,|b| <= 10, 20, 40, 80), so continuity of the ' +
    'band-limited eigenfunction forces g(Uv) = g(v) / U for all U > 0, whose unique continuous ' +
    'solution is the rigid power profile g(v) = C / v. The single-prime p=2 relation alone would ' +
    'admit the infinite-dimensional family g(v) = (1/v) Phi(log_2 v) for any 1-periodic Phi (the ' +
    'Zygmund freedom); the p=3 companion forces Phi to be periodic in two incommensurate periods ' +
    'ln2 and ln3, which forces Phi constant (sampled range of cos(2*pi*t/ln2) at t = k*ln3 fills ' +
    'to 1.99999). Residual: SG-96164-boundary, a single scalar boundary-matching condition for ' +
    'C/v at the archimedean edge v = 1/2.',
  mechanism:
    'Multiplicative independence of 2 and 3 (ln2/ln3 irrational) makes the composed shift set ' +
    '{ a ln2 + b ln3 : a,b in Z } dense in R by Kronecker/Weyl equidistribution. A continuous ' +
    'eigenfunction satisfying a dense set of exact scaling relations g(e^{shift} v) = e^{-shift} ' +
    'g(v) must satisfy the continuum limit g(Uv) = g(v)/U for every U > 0, which pins the function ' +
    'to the unique power law C/v. A second, incommensurate periodicity constraint on any residual ' +
    '1-periodic modulation forces that modulation to a constant, since a non-constant function ' +
    'cannot be periodic in two rationally-independent periods.',
  verificationStatus:
    'PARTIAL / reduction, not a QED: the rigid profile g(v) = C/v is square-integrable on the ' +
    'tail half-line (int_{1/2}^{oo} v^-2 dv = 2 < oo), so the scaling law alone does not force ' +
    'C = 0. The p=2 top confined state 0.9999731 < 1 numerically suggests the v = 1/2 boundary ' +
    'condition is not met at unit modulus, but the exact enclosure remains blocked by the ' +
    'Zygmund edge behaviour (sub-gap SG-96164-boundary open). Changes no bound; nothing ' +
    'diagonalizes A_S23; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96195_RIGID_PROFILE_COLLAPSE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96195',
  proofSection: 'Route I',
  glosses: 'imp-96164',
  question:
    'imp-96143 reduced the mixed {oo,2,3} strict-gap statement (I) to the top confined states, ' +
    'blocked by the fractal Zygmund eigenfunctions. Does the p=3 Euler factor (beyond the p=2 ' +
    'relation already ported) add genuine rigidity, for a reader landing on imp-96164 cold?',
  headword: RIGID_PROFILE_COLLAPSE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96164 rigid-profile ' +
    'collapse: composing the p=2 relation g(v)=2g(2v) and the p=3 relation g(v)=3g(3v) (plus ' +
    'local inverses) over the dense Z-module of shifts { a ln2 + b ln3 } forces any modulus-1 ' +
    'tail-interior eigenfunction to the single rigid profile g(v) = C/v, collapsing an ' +
    'infinite-dimensional Zygmund modulation family to one scalar boundary condition ' +
    'SG-96164-boundary. Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96164 (the rigid-profile-collapse derivation this glosses); imp-96143 (the residual (I) ' +
    'this attacks); rh-route-i-sonine-excess-semilocal-port-2026-09-23 (the single-prime p=2 ' +
    'relation g(v)=2g(2v)).',
});

export default IMP96195_RIGID_PROFILE_COLLAPSE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96195_RIGID_PROFILE_COLLAPSE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96195-headword-has-required-fields',
    why: 'The headword must name the dense shift module ratio, the rigid profile, and the ' +
      'sub-gap it reduces to -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96195_RIGID_PROFILE_COLLAPSE_GLOSSARY_HEADWORD.headword;
      return (
        /0\.6309297535714575/.test(h.definition) &&
        /g\(v\) = C \/ v/.test(h.definition) &&
        /SG-96164-boundary/.test(h.definition) &&
        /1\.99999/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96195-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96195_RIGID_PROFILE_COLLAPSE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96195_RIGID_PROFILE_COLLAPSE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96195_RIGID_PROFILE_COLLAPSE_GLOSSARY_HEADWORD.verdict) &&
      IMP96195_RIGID_PROFILE_COLLAPSE_GLOSSARY_HEADWORD.glosses === 'imp-96164',
  },
];

for (const assertion of IMP96195_RIGID_PROFILE_COLLAPSE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96195-rigid-profile-collapse-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
