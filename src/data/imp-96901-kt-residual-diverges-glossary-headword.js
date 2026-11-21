/**
 * @module imp-96901-kt-residual-diverges-glossary-headword
 * @fileoverview imp-96901 -- import-light glossary/Concepts headword for the imp-96875
 *   finding IMP96875_KT_RESIDUAL_DIVERGES: the DIRECT Kato-Temple estimate of
 *   lambda_1(T_a[sigma_2]) at 2a=ln3 cannot deliver a positive floor even when GRANTED a
 *   positive provisional Ritz seed for lambda_2, because the out-of-space residual
 *   ||T g - mu g|| diverges for the unbounded operator on m=3 pole-free trials -- so
 *   Route C-direct (Kato-Temple) and Route B share the same unbounded-operator wall, and
 *   a positive floor needs a BOUNDED (shift-invert / resolvent) reformulation.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96875 scouted whether the Route C Kato-Temple lower bound
 *   lambda_1 >= mu - ||T g - mu g||^2 / (beta - mu) could deliver a positive floor once
 *   the beta-seed obstruction of imp-96865 (certified lambda_2 unreachable, Loewner/Weyl
 *   force beta < 0) is set aside by GRANTING a provisional measured Ritz lambda_2 as beta.
 *   It found the seed is fine (beta ~ 1e2 >> mu ~ 0.6, KT2 comfortably cleared) but the
 *   residual leg diverges and is binding instead. This headword bakes that distinction
 *   verbatim (no re-import of the imp-96875 module, to stay import-light) so a reader
 *   does not conflate the two obstructions -- beta-seed CERTIFIABILITY (imp-96865) versus
 *   residual (operator-domain) DIVERGENCE (imp-96875) -- which are complementary but
 *   independent walls on the same Route C-direct attack.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE SEED IS NOT THE PROBLEM HERE. Granting the honest measured Ritz lambda_2 as
 *   the provisional seed beta (beta_N ~ 99..111, beta_big ~ 84..101 across N=20..44), KT2
 *   (mu < beta) is cleared with room to spare against mu ~ 0.58..0.63.
 *   (b) THE RESIDUAL DIVERGES. At fixed N=20, the out-of-space defect ||T g - mu g||
 *   climbs monotonically 1.65e3 -> 4.60e3 -> 9.59e3 -> 1.62e4 -> 1.99e4 -> 2.60e4 as the
 *   nested evaluation space grows Nbig = 24,30,40,60,80,120 -- the signature of an
 *   UNBOUNDED operator, not a converging discretisation artifact.
 *   (c) CAUSE: FORM DOMAIN, NOT OPERATOR DOMAIN. The m=3 pole-free trial g has
 *   ghat ~ t^{-4}, so int sigma_2 |ghat|^2 < inf (g is in the form domain) but
 *   int sigma_2^2 |ghat|^2 ~ int (t^4 ln t)^2 t^{-8} dt = int (ln t)^2 dt DIVERGES --
 *   T g is not even in L^2, so the true ||T g - mu g||^2 is effectively infinite.
 *   (d) RESULTING FLOOR IS MASSIVELY NEGATIVE AND WORSENS WITH N. The measured KT floor
 *   runs from -8.3e5 (N=20) to -4.0e7 (N=44) -- getting MORE negative as N grows, because
 *   the residual grows faster than the fixed O(1e2) gap can absorb.
 *   (e) THE SHARED WALL. A viable Kato-Temple / Lehmann-Goerisch attack needs a BOUNDED
 *   reformulation (shift-invert / resolvent (T+m)^{-1}), where the residual is
 *   controllable -- but that collapses onto the same open Route B resolvent-truncation
 *   (N,T) rate (imp-96827/96847/96848). So Route C-direct and Route B are not
 *   independent routes: they share one unbounded-operator wall.
 *
 *   STATUS: a numerical scout diagnosing why one specific attack (direct Kato-Temple)
 *   cannot in principle deliver a positive floor, and identifying the shared wall with
 *   Route B. Not a proof, not a new bound, not an operator-positivity result. NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-96875-krein-katotemple-residual-scout.js (source measurement: the
 *   IMP96875_KT_RESIDUAL_DIVERGES sub-gap this glosses)
 * @see imp-96865-krein-katotemple-lambda2-lowerbound-obstruction.js (complementary
 *   obstruction: the CERTIFIED beta seed is unreachable, Loewner/Weyl force beta < 0)
 * @see imp-96846-krein-uniform-N-lower-bound-routes-assessment.js (Route C assessment
 *   this scout feeds; SUB-GAP IMP96846_COMPLEMENTARY_NEEDS_LAMBDA2_LOWER_BOUND)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (the open Route B
 *   resolvent-truncation (N,T) rate the bounded reformulation reduces to)
 *
 * Ticket: imp-96901 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The residual-diverges headword, baked verbatim (no re-import).
const KT_RESIDUAL_DIVERGES_HEADWORD = Object.freeze({
  key: 'kato-temple-residual-diverges-unbounded-operator-shared-wall',
  term:
    'imp-96875 finding IMP96875_KT_RESIDUAL_DIVERGES: the direct Kato-Temple residual ' +
    '||T g - mu g|| diverges for the unbounded T_a[sigma_2] on m=3 pole-free trials ' +
    '(form-domain, not operator-domain), so Route C-direct (Kato-Temple) and Route B ' +
    'share the same unbounded-operator wall -- a positive lambda_1 floor needs a bounded ' +
    'resolvent (shift-invert) reformulation',
  definition:
    'Granting the honest measured Ritz lambda_2 as the provisional Kato-Temple seed beta ' +
    '(beta_N ~ 99..111, beta_big ~ 84..101 across N=20..44), KT2 (mu < beta) is cleared ' +
    'with room to spare against mu ~ 0.58..0.63 -- the beta-seed is NOT the obstruction ' +
    'once one uses the measured value rather than an exogenous certified bound (contrast ' +
    'imp-96865, which is about CERTIFIABILITY of beta, not its true value). But the ' +
    'out-of-space residual ||T g - mu g|| diverges: at fixed N=20 it climbs monotonically ' +
    '1.65e3 -> 4.60e3 -> 9.59e3 -> 1.62e4 -> 1.99e4 -> 2.60e4 as the nested evaluation ' +
    'space grows Nbig = 24,30,40,60,80,120, and the resulting KT floor runs from -8.3e5 ' +
    '(N=20) to -4.0e7 (N=44), MORE negative as N grows.',
  mechanism:
    'The m=3 pole-free trial g has ghat ~ t^{-4}, so int sigma_2 |ghat|^2 < inf (g lies in ' +
    'the form domain, not the operator domain) but int sigma_2^2 |ghat|^2 ~ ' +
    'int (t^4 ln t)^2 t^{-8} dt = int (ln t)^2 dt DIVERGES -- T g is not even in L^2 for ' +
    'the true (unbounded) operator, and ' +
    'so ||T g - mu g||^2 is effectively infinite and the measured divergence with Nbig is ' +
    'the discretised signature of that. A viable Kato-Temple / Lehmann-Goerisch attack ' +
    'therefore needs a BOUNDED reformulation (shift-invert / resolvent (T+m)^{-1}), where ' +
    'the residual is controllable -- but that reformulation collapses onto the same open ' +
    'Route B resolvent-truncation (N,T) rate (imp-96827/96847/96848). Route C-direct and ' +
    'Route B are thus not independent routes to a positive floor: they share one ' +
    'unbounded-operator wall.',
  verificationStatus:
    'Numerical scout reusing the imp-96768 pole-free Gegenbauer Galerkin build ' +
    '(tmp/imp-96875-katotemple-scout.py), measuring the Kato-Temple floor and its ' +
    'out-of-space residual at N=20..44 with nested 2N-dim evaluation spaces. Scouting / ' +
    'measurement only; the provisional beta is NOT a certified lower bound (Ritz gives ' +
    'UPPER bounds); interval-rigorous certificate reach stays 2a <= 0.96; establishes no ' +
    'operator positivity; RH open; no refereed bound is changed; NO QED.',
});

export const IMP96901_KT_RESIDUAL_DIVERGES_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96901',
  proofSection: 'S-frontier',
  glosses: 'imp-96875',
  question:
    'imp-96865 showed the CERTIFIED Kato-Temple beta seed is unreachable for ' +
    'lambda_1(T_a[sigma_2]) at 2a=ln3. If that seed obstruction is set aside by GRANTING ' +
    'a provisional measured Ritz lambda_2 instead, can the direct Kato-Temple estimate ' +
    'then deliver a positive floor?',
  headword: KT_RESIDUAL_DIVERGES_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96875 finding ' +
    'IMP96875_KT_RESIDUAL_DIVERGES: even with a positive provisional Ritz seed beta ~ 1e2 ' +
    'clearing KT2, the direct Kato-Temple floor is massively negative (-8.3e5 to -4.0e7 ' +
    'across N=20..44, worsening with N) because the out-of-space residual diverges -- the ' +
    'm=3 pole-free trial lies in the form domain but not the operator domain of the ' +
    'unbounded T_a[sigma_2]. A positive floor needs a BOUNDED (shift-invert / resolvent) ' +
    'reformulation, which reduces to the open Route B resolvent-truncation (N,T) rate: ' +
    'Route C-direct and Route B share one unbounded-operator wall. Establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96875 (the scout and IMP96875_KT_RESIDUAL_DIVERGES sub-gap this glosses); ' +
    'imp-96865 (the complementary certified-beta-seed obstruction); imp-96827/96847/96848 ' +
    '(the open Route B resolvent-truncation (N,T) rate the bounded reformulation reduces to).',
});

export default IMP96901_KT_RESIDUAL_DIVERGES_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96901_KT_RESIDUAL_DIVERGES_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96901-headword-has-required-fields',
    why: 'The headword must name both the residual-divergence signature and the ' +
      'shared-unbounded-operator-wall conclusion -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96901_KT_RESIDUAL_DIVERGES_GLOSSARY_HEADWORD.headword;
      return (
        /diverges/i.test(h.term) &&
        /shared|share/i.test(h.term) &&
        /form.domain/i.test(h.mechanism) &&
        /operator.domain/i.test(h.mechanism) &&
        /1\.65e3/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96901-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96901_KT_RESIDUAL_DIVERGES_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96901_KT_RESIDUAL_DIVERGES_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96901_KT_RESIDUAL_DIVERGES_GLOSSARY_HEADWORD.verdict) &&
      IMP96901_KT_RESIDUAL_DIVERGES_GLOSSARY_HEADWORD.glosses === 'imp-96875',
  },
];

for (const assertion of IMP96901_KT_RESIDUAL_DIVERGES_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96901-kt-residual-diverges-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
