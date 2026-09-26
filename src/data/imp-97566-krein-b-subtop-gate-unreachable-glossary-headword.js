/**
 * @module imp-97566-krein-b-subtop-gate-unreachable-glossary-headword
 * @fileoverview imp-97566 -- import-light glossary/Concepts headword recording the imp-97536
 *   verdict: the m=2 Lehmann-Maehly gate at 2a = ln3 (a certified lower bound on lambda_3(A)
 *   exceeding the Ritz upper bracket 83.090493 on lambda_2) is structurally UNREACHABLE by
 *   min-max-on-a-positive-subspace, Weyl/Lidskii interlacing, or truncated positive-definite
 *   compression; the productive residual is a certified sub-top (third-largest) spectral bound
 *   on B, not the index-blind Route-2 recursion.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97536 assessed every structurally distinct alternative to the index-blind
 *   Route-2 Lehmann recursion for certifying lambda_3(A) > 83.090493 at 2a = ln3 (A = P_a M_sigma2
 *   P_a, decomposed A = C - B with C, B >= 0). Min-max on a certified-positive test subspace and a
 *   truncated PD compression are both Rayleigh-Ritz constructions that yield UPPER brackets (wrong
 *   direction: the min-max LOWER form controls the well-reaching orthogonal complement instead).
 *   Weyl/Lidskii interlacing -- lambda_3(A) >= lambda_1(C) - lambda_third-largest(B) -- is the one
 *   genuinely distinct handle, since it subtracts B's THIRD-LARGEST eigenvalue rather than the
 *   operator norm ||B|| = 4336.198, and the confined well (width 6.893) under the ln3 band limit
 *   caps B at a time-bandwidth product ~2.41 (~2-3 well-carrying modes).
 *   (b) WHY IT STILL FAILS. That route defers to a CERTIFIED upper bound on lambda_third-largest(B)
 *   -- a rigorous band-limited (prolate-spectrum) concentration estimate for the confined well.
 *   The band-limited eigenfunctions are fractal/Zygmund, so dyadic-truncated grids are unusable and
 *   no spectral shoulder has been certified; absent it, lambda_third-largest(B) is bracketed only
 *   by ||B|| itself, which does not clear the gate.
 *   (c) WHY A SUCCESSFUL ROUTE WOULD BE CIRCULAR. Any route that DID certify lambda_3(A) > 83.09
 *   would itself constitute the missing operator-positivity certificate on the well (the imp-97415
 *   ROUTE 3 circularity), so the m=2 gate cannot be reached except by first closing that primitive.
 *   (d) STATUS: documentation only. No certified lower bound on lambda_3; no operator positivity;
 *   interval-rigorous reach stays 2a<=0.96; no bound moves; the productive residual named
 *   IMP97536_LAMBDA3_LOWER_REDUCES_TO_CERTIFIED_B_SUBTOP_SPECTRUM was itself assessed by imp-97556
 *   (only a crude trace-quotient bound lambda_third-largest(B) <= 1066.68 is certifiable, ~4x below
 *   ||B|| and far from the O(1)-mode plunge needed) and measured by imp-97557 (Galerkin/Ritz
 *   readings drift adversely with N, never reaching the gate) -- neither closes it.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   result. Not a new derivation. NO QED.
 *
 * @see imp-97536-krein-lambda3-lower-bound-alt-routes-assessment.js (source: the alt-routes
 *   assessment this headword names, verdict m2GateStructurallyUnreachableByAlternatives)
 * @see imp-97514-krein-m2-window-enclosure-assessment.js (m=2 window needs a certified lower bound
 *   on lambda_3; the sub-gap source)
 * @see imp-97415-krein-lambda2-certified-lower-bound-assessment.js (Route 1/2/3 for lambda_2; the
 *   concentration-wall circularity imp-97536 inherits)
 * @see imp-97556-krein-B-subtop-certified-upper-bound-assessment.js (follow-up: only a crude
 *   trace-quotient bound lambda_third-largest(B) <= 1066.68 is certifiable, does not close the gate)
 * @see imp-97557-krein-B-subtop-galerkin-weyl-bracket-measurement.js (follow-up: Galerkin/Ritz
 *   measurement of the Weyl bracket, drifts adversely with N, gate still unreached)
 *
 * Ticket: imp-97566 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The B-subtop-gate-unreachable headword, baked verbatim (no re-import).
const KREIN_B_SUBTOP_GATE_UNREACHABLE_HEADWORD = Object.freeze({
  key: 'krein-m2-gate-unreachable-b-subtop-residual-imp97536',
  term:
    'm=2 Krein gate structural unreachability: the certified lower bound on lambda_3(A) needed to ' +
    'clear the m=2 Lehmann-Maehly gate is unreachable by min-max, Weyl/Lidskii, or PD-compression ' +
    'alternatives to Route-2; the productive residual is a certified sub-top spectral bound on B',
  definition:
    'For A = P_a M_sigma2 P_a = C - B (C, B >= 0) at 2a = ln3, clearing the m=2 gate needs a ' +
    'certified lower bound on lambda_3(A) exceeding the Ritz upper bracket 83.090493 on lambda_2. ' +
    'Min-max on a certified-positive test subspace and a truncated positive-definite compression ' +
    'both yield Rayleigh-Ritz UPPER brackets (wrong direction). Weyl/Lidskii interlacing -- ' +
    'lambda_3(A) >= lambda_1(C) - lambda_third-largest(B) -- is the one structurally distinct ' +
    'handle, exploiting the confined well time-bandwidth product ~2.41, but it reduces to a ' +
    'certified upper bound on lambda_third-largest(B), which is not currently reachable.',
  mechanism:
    'Every lower bound on any eigenvalue of A = C - B must control the negative part B, whose ' +
    'spectrum carries the confined-well mass. Min-max (Route A) and truncated PD compression ' +
    '(Route C) are Ritz-type constructions that structurally produce upper brackets. Weyl/Lidskii ' +
    '(Route B) refines operator domination by index rather than by norm, but the certified upper ' +
    'bound it needs on B third-largest eigenvalue requires a rigorous band-limited (prolate-' +
    'spectrum) concentration estimate; the eigenfunctions are fractal/Zygmund so dyadic-truncated ' +
    'grids are unusable, and no spectral shoulder has been certified. imp-97556 confirms only a ' +
    'crude trace-quotient bound (<=1066.68) is certifiable this way -- far from the O(1)-mode ' +
    'plunge needed -- and imp-97557 confirms the Galerkin/Ritz Weyl-bracket reading drifts ' +
    'adversely with N rather than converging toward the gate.',
  verificationStatus:
    'Re-cited from the imp-97536 alt-routes-assessment module ' +
    '(src/data/imp-97536-krein-lambda3-lower-bound-alt-routes-assessment.js). The m=2 gate stays ' +
    'unreached by every assessed alternative to Route-2; the named sub-gap ' +
    'IMP97536_LAMBDA3_LOWER_REDUCES_TO_CERTIFIED_B_SUBTOP_SPECTRUM was itself pursued by imp-97556 ' +
    '(crude bound only) and imp-97557 (adverse drift), neither closing it. Naming / glossary ' +
    'headword only; supplies no new bound; interval-rigorous reach stays 2a<=0.96; RH open; ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
});

export const IMP97566_KREIN_B_SUBTOP_GATE_UNREACHABLE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97566',
  proofSection: 'S-frontier',
  glosses: 'imp-97536',
  question:
    'imp-97536 assessed whether a certified lower bound on lambda_3(A) exceeding the m=2 gate ' +
    '83.090493 is reachable by any route other than the index-blind Route-2 recursion, finding it ' +
    'is not, with the productive residual named as a certified sub-top spectral bound on B. What is ' +
    'the headword for this verdict?',
  headword: KREIN_B_SUBTOP_GATE_UNREACHABLE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97536 verdict: the m=2 ' +
    'Krein gate is structurally unreachable by min-max, Weyl/Lidskii, or truncated PD-compression ' +
    'alternatives to Route-2 -- min-max and PD-compression give Ritz upper brackets (wrong ' +
    'direction), and Weyl/Lidskii, the one distinct handle, reduces to a certified sub-top ' +
    '(third-largest) spectral bound on B that is not currently reachable. No bound moved; NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97536 (the alt-routes assessment this glosses); imp-97514 (the m=2 window sub-gap ' +
    'source); imp-97415 (the lambda_2 concentration-wall circularity); imp-97556 (crude sub-top ' +
    'trace-quotient bound, does not close the gate); imp-97557 (Galerkin/Ritz Weyl-bracket ' +
    'measurement, drifts adversely with N).',
});

export default IMP97566_KREIN_B_SUBTOP_GATE_UNREACHABLE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97566_KREIN_B_SUBTOP_GATE_UNREACHABLE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97566-headword-names-gate-and-residual',
    why: 'The headword must name the m=2 gate value, the three assessed routes, and the ' +
      'productive B sub-top residual -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97566_KREIN_B_SUBTOP_GATE_UNREACHABLE_GLOSSARY_HEADWORD.headword;
      return (
        /83\.090493/.test(h.definition) &&
        /lambda_third-largest\(B\)/.test(h.definition) &&
        /Weyl\/Lidskii/.test(h.mechanism) &&
        /1066\.68/.test(h.mechanism) &&
        /fractal\/Zygmund/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97566-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-97536.',
    holds: () =>
      IMP97566_KREIN_B_SUBTOP_GATE_UNREACHABLE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97566_KREIN_B_SUBTOP_GATE_UNREACHABLE_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP97566_KREIN_B_SUBTOP_GATE_UNREACHABLE_GLOSSARY_HEADWORD.verdict) &&
      IMP97566_KREIN_B_SUBTOP_GATE_UNREACHABLE_GLOSSARY_HEADWORD.glosses === 'imp-97536',
  },
];

for (const assertion of IMP97566_KREIN_B_SUBTOP_GATE_UNREACHABLE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97566-krein-b-subtop-gate-unreachable-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
