/**
 * @module imp-97726-gexp-tc-cf-implicit-diff-glossary-headword
 * @fileoverview imp-97726 -- import-light glossary/Concepts headword recording the imp-97700
 *   exact continuum identity E_GEXP = TC_A1_TRAP * E_CF, proven by implicit differentiation: the
 *   Gronwall-exponent crossing elasticity collapses onto the C_F axis at the fixed scalar weight
 *   TC_A1_TRAP, and the imp-97686 R2 deep-landmark (L3/L4) finite-difference floor was root
 *   quantization, not truncation.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97700 proved that the crossing elasticities of the Gronwall-exponent (gexp)
 *   and C_F probes obey E_GEXP = TC_A1_TRAP * E_CF EXACTLY in the continuum. Both probes enter the
 *   conditional-share model sigma = E_coll/E_N only through E_flow, with d(E_N)/d(gexp) = E_flow *
 *   TC_A1_TRAP and d(E_N)/d(cf) = E_flow at baseline; the shared implicit-function-theorem factor
 *   -(E_coll/E_N^2)/(d sigma/d ln N) cancels in the ratio, leaving E_GEXP/(TC_A1_TRAP*E_CF) =
 *   (E_flow*TC_A1_TRAP)/(TC_A1_TRAP*E_flow) = 1 identically.
 *   (b) WHY IT IS NEW. imp-97686 R2 had confirmed the identity only to a ~1e-6 (L3, sigma=0.5) /
 *   ~1e-4 (L4, sigma=0.1) relative floor at the deep landmarks, and attributed that floor to
 *   "bisection-quantization noise" without proof; the imp-97665 5-point O(eps^4) stencil did not
 *   improve it. imp-97700 shows a longer/tighter bisection (300 -> 2000 iterations) leaves the
 *   L3/L4 residual bit-for-bit unchanged, because the 300-iteration bisection already saturates
 *   double precision (the search interval falls below one double-ULP of ln N_L after ~55
 *   halvings). Computing the ratio instead by EXACT implicit differentiation -- which needs
 *   neither a finite difference nor a resolved-below-ULP root -- confirms the identity to ~1 ULP
 *   at every landmark, INCLUDING L3/L4.
 *   (c) WHY IT MATTERS. It reclassifies the imp-97686 R2 deep-landmark residual from an unexplained
 *   noise floor into a diagnosed finite-difference-of-quantized-root artifact (double-ULP root
 *   quantization amplified by the 1/eps of the central difference), and confirms the identity is
 *   truncation-limited (in fact exact) rather than approximately true.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. The Gronwall-exponent wrapper still collapses onto the C_F
 *   axis at the fixed scalar weight TC_A1_TRAP below the noise floor; the imp-97668 A2
 *   classification and the imp-97644 DIAG3 == 0 three-axis homogeneity are untouched. This is a
 *   measurement-method diagnosis and exact-identity confirmation, not a new inequality or a new
 *   leverage direction.
 *   (e) STATUS: documentation only. No bound moved; no coefficient re-pinned; the rigorous anchor
 *   stays the trace ceiling; compute binds first; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   result. Not a new derivation. NO QED.
 *
 * @see imp-97700-gexp-identity-analytic-crossing.js (source: the analytic-crossing measurement and
 *   implicit-differentiation proof this headword names)
 * @see imp-97686-wrapper-elasticity-5point-refine (R2: E_GEXP noise-limited at L3/L4 under the
 *   5-point stencil, the floor diagnosed here)
 * @see imp-97668-nonlinear-amplitude-audit (A2: the Gronwall exponent collapses to TC_A1_TRAP *
 *   E_CF, confirmed exact here)
 * @see imp-97644-three-axis-additivity-flow-prefactor (STRUCTURE (1): DIAG3 == 0 scaling symmetry,
 *   untouched)
 *
 * Ticket: imp-97726 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The gexp/TC/C_F collapse headword, baked verbatim (no re-import).
const GEXP_TC_CF_IMPLICIT_DIFF_HEADWORD = Object.freeze({
  key: 'gexp-tc-cf-implicit-diff-imp97700',
  term:
    'Gronwall-exponent / C_F collapse E_GEXP = TC_A1_TRAP * E_CF: the crossing elasticity of the ' +
    'Gronwall-exponent probe collapses onto the C_F axis at the fixed scalar weight TC_A1_TRAP, ' +
    'proven exact by implicit differentiation',
  definition:
    'In the sigma = E_coll/E_N conditional-share model, the crossing elasticities of the ' +
    'Gronwall-exponent (gexp) and C_F probes satisfy E_GEXP = TC_A1_TRAP * E_CF exactly, because ' +
    'both probes enter E_N only through E_flow (E_coll is independent of both), with ' +
    'd(E_N)/d(gexp) = E_flow * TC_A1_TRAP and d(E_N)/d(cf) = E_flow at baseline. The imp-97686 R2 ' +
    'deep-landmark residuals (~1e-6 at L3 sigma=0.5, ~1e-4 at L4 sigma=0.1) were a ' +
    'finite-difference-of-quantized-root artifact -- double-ULP root quantization amplified by the ' +
    '1/eps of the central difference -- not a real deviation from the identity.',
  mechanism:
    'The crossing sigma(N_L(p), p) = level defines N_L(p) implicitly, so by the implicit function ' +
    'theorem the crossing elasticity of a log-parameter d_k is E_k = d(ln N_L)/d(d_k) = ' +
    '-(d sigma/d d_k)/(d sigma/d ln N). Both gexp ' +
    'and cf act only through E_flow, so the shared factor -(E_coll/E_N^2)/(d sigma/d ln N) cancels ' +
    'in the ratio E_GEXP/(TC_A1_TRAP*E_CF), leaving (E_flow*TC_A1_TRAP)/(TC_A1_TRAP*E_flow) = 1 ' +
    'identically -- no finite difference and no sub-ULP root needed. Sweeping the landmark ' +
    'bisection budget 300 -> 2000 iterations left the L3/L4 finite-difference residual bit-for-bit ' +
    'frozen, ruling out the crossing tolerance as the floor; the 300-iteration bisection already ' +
    'saturates double precision after ~55 halvings.',
  verificationStatus:
    'Re-cited from the imp-97700 derivation module (src/data/imp-97700-gexp-identity-analytic-' +
    'crossing.js), with the baked per-landmark table showing the bisection-budget sweep frozen at ' +
    'L2/L3/L4 and the analytic implicit-differentiation ratio equal to 1 to ~1e-12 at every ' +
    'landmark. Naming / glossary headword only; supplies no new bound; the imp-97668 A2 ' +
    'classification and imp-97644 DIAG3 == 0 homogeneity are untouched; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP97726_GEXP_TC_CF_IMPLICIT_DIFF_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97726',
  proofSection: 'S-frontier',
  glosses: 'imp-97700',
  question:
    'imp-97700 proved the imp-97686 R2 exact continuum identity E_GEXP = TC_A1_TRAP * E_CF holds to ' +
    '~1 ULP at the deep landmarks L3/L4 via implicit differentiation, diagnosing the prior ' +
    'finite-difference floor as root quantization -- what is the headword for this result?',
  headword: GEXP_TC_CF_IMPLICIT_DIFF_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97700 exact identity ' +
    'E_GEXP = TC_A1_TRAP * E_CF (implicit-function-theorem cancellation through the shared E_flow ' +
    'channel), confirmed to ~1 ULP at L2/L3/L4 by analytic implicit differentiation after the ' +
    'imp-97686 R2 deep-landmark residual was shown to be finite-difference-of-quantized-root noise, ' +
    'not truncation. No bound moved; imp-97668 A2 and imp-97644 DIAG3 == 0 untouched; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97700 (the analytic-crossing derivation this glosses); imp-97686 (the deep-landmark ' +
    'residual diagnosed here); imp-97668 (the A2 nonlinear-amplitude classification, confirmed ' +
    'exact); imp-97644 (the DIAG3 == 0 three-axis homogeneity, unchanged).',
});

export default IMP97726_GEXP_TC_CF_IMPLICIT_DIFF_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97726_GEXP_TC_CF_IMPLICIT_DIFF_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97726-headword-names-identity-and-mechanism',
    why: 'The headword must name the exact identity E_GEXP = TC_A1_TRAP * E_CF and the implicit- ' +
      'differentiation cancellation mechanism -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97726_GEXP_TC_CF_IMPLICIT_DIFF_GLOSSARY_HEADWORD.headword;
      return (
        /E_GEXP = TC_A1_TRAP \* E_CF/.test(h.definition) &&
        /finite-difference-of-quantized-root artifact/.test(h.definition) &&
        /implicit function theorem/.test(h.mechanism) &&
        /bit-for-bit frozen/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97726-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97700.',
    holds: () =>
      IMP97726_GEXP_TC_CF_IMPLICIT_DIFF_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97726_GEXP_TC_CF_IMPLICIT_DIFF_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97726_GEXP_TC_CF_IMPLICIT_DIFF_GLOSSARY_HEADWORD.verdict) &&
      IMP97726_GEXP_TC_CF_IMPLICIT_DIFF_GLOSSARY_HEADWORD.glosses === 'imp-97700',
  },
];

for (const assertion of IMP97726_GEXP_TC_CF_IMPLICIT_DIFF_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97726-gexp-tc-cf-implicit-diff-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
