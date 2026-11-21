/**
 * @module imp-95906-transport-tier-decomposition-glossary-headword
 * @fileoverview imp-95906 -- import-light glossary/Concepts headword for the imp-95877
 *   three-tier transport-identity tractability decomposition (TIER 1 m-linear leading
 *   curvature / TIER 2 m-free const sector + offset / TIER 3 binding sub-leading
 *   coefficients s_J(m,cell), c_J(m,cell)).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95877 decomposed the imp-95861 TRANSPORT identity (does the reconstructed
 *   238-cell integrand equal Sun Prop-6.3 Q_0(m,v) identically in m?) into three
 *   coefficient tiers and pinned exactly which tier blocks it. A reader landing on
 *   that module cold has no quick-lookup definition of what the three tiers are,
 *   why two of them are already closed, or what the dQ/dm test actually rules out.
 *   This headword bakes those facts VERBATIM (no re-import of the imp-95877 module,
 *   to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The TRANSPORT identity Q_0^recon(m,v) = Sun Q_0(m,v) reduces, once the m-free
 *   const sector and +4 offset are quarantined (imp-95745), to matching a per-cell
 *   quadratic -(4m-1)/2 . v^2 + s_J(m,cell) . v + c_J(m,cell) against Prop 6.3
 *   symbolically in m. That coefficient law splits into THREE tiers:
 *     TIER 1 (leading curvature -(4m-1)/2): ALREADY SYMBOLIC in m -- m-LINEAR with
 *       constant slope dc/dm = -2, a pure combinatorial slope of the odd-prime
 *       ladder (imp-95720 reproduced it exactly).
 *     TIER 2 (const sector 3/2 + offset +4): PROVEN m-FREE (imp-95745), forced by
 *       the universal telescope INT_0^1 zeta(2,1+v) dv = 1.
 *     TIER 3 (sub-leading per-cell coefficients s_J(m,cell), c_J(m,cell)): NUMERIC
 *       ONLY, pinned solely at m=20 by the greedy lowest-mass K_v multiset
 *       selection, with no established closed form in m. THIS IS THE BINDING
 *       OBSTRUCTION.
 *
 *   THE dQ/dm TEST: if only TIER 1 carried m-dependence, the forward divided
 *   difference dQ/dm of the Q_0-sector value would be CONSTANT (curvature enters
 *   Q_0 linearly with constant slope, and the zeta(3,1+v) weight is m-free).
 *   Measured across m=20,22,30,41 (imp-95822 grid-converged values), dQ/dm is
 *   +3.79e-6, +2.15e-6, +1.55e-6 -- positive, monotone, and decaying by a factor
 *   ~2.44, NOT constant. This refutes the curvature-only shortcut and proves
 *   TIER 3 genuinely carries residual m-dependence.
 *
 *   A SECOND OBSTRUCTION: the raw 238-cell tableau is itself NOT m-free (the
 *   breakpoint set has O(m) points; 238 is only the m=20 value), so the identity
 *   must ultimately be stated per-locus rather than per-fixed-tableau.
 *
 *   STATUS: PARTIALLY TRACTABLE -- two of three coefficient tiers are already
 *   symbolic in m; the identity is not closable by the current symbolic inventory
 *   because TIER 3 has no established closed form.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95877 decomposition result for quick
 *   reference. It establishes nothing, instantiates no interval, closes no sub-gap,
 *   moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-95877-transport-identity-tractability-assessment (source: the tier decomposition this glosses)
 * @see imp-95861-... (the TRANSPORT identity route this decomposition assesses)
 * @see imp-95745-... (proved const sector 3/2 and offset +4 m-free, TIER 2)
 * @see imp-95720-... (exact-cell K_v reproducing the TIER 1 curvature -(4m-1)/2)
 *
 * Ticket: imp-95906 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The three-tier transport-identity headword, baked verbatim (no re-import).
const TRANSPORT_TIER_DECOMPOSITION_HEADWORD = Object.freeze({
  key: 'transport-identity-tier-decomposition',
  term:
    'Transport-identity tier decomposition ' +
    '(TIER 1 m-linear curvature / TIER 2 m-free const+offset / TIER 3 binding sub-leading coefficients)',
  definition:
    'A three-way split of the per-cell coefficient law that the imp-95861 ' +
    'TRANSPORT identity (reconstructed integrand equals Sun Prop-6.3 Q_0(m,v) ' +
    'identically in m) reduces to, classified by how far each coefficient is ' +
    'already known symbolically as a function of m: TIER 1 is the leading ' +
    'quadratic curvature -(4m-1)/2, TIER 2 is the constant sector (3/2) plus the ' +
    '+4 offset, and TIER 3 is the sub-leading per-cell coefficients s_J(m,cell), ' +
    'c_J(m,cell) produced by the greedy lowest-mass K_v multiset selection.',
  mechanism:
    'TIER 1 is m-LINEAR with constant slope dc/dm = -2, a pure combinatorial ' +
    'slope of the odd-prime ladder -- already symbolic in m. TIER 2 is PROVEN ' +
    'm-FREE, forced by the universal telescope identity INT_0^1 zeta(2,1+v) dv = ' +
    '1 -- also already symbolic (trivially, since it carries no m-dependence at ' +
    'all). TIER 3 is pinned only NUMERICALLY at m=20; the greedy "lowest 1+v ' +
    'units of mass" multiset selection depends combinatorially on both the cell ' +
    'and m via the breakpoint loci, and no closed form in m has been ' +
    'established, making it the sole open tier.',
  bindingTest:
    'A curvature-only transport model predicts the forward divided difference ' +
    'dQ/dm of the Q_0-sector value is CONSTANT across m, since TIER 1 enters ' +
    'linearly with constant slope and the zeta(3,1+v) weight carries no ' +
    'm-dependence. Measured at m=20,22,30,41 (imp-95822 grid-converged values), ' +
    'dQ/dm = +3.79e-6, +2.15e-6, +1.55e-6 -- positive, monotone, and decaying by ' +
    'a factor ~2.44, decisively non-constant. This REFUTES the shortcut that ' +
    'TIER 1 + TIER 2 alone close the identity and proves TIER 3 carries genuine ' +
    'residual m-dependence. A second, structural obstruction is that the raw ' +
    '238-cell tableau is itself not m-free (the breakpoint set has O(m) points), ' +
    'so a proof must ultimately be stated per-locus rather than per-fixed-tableau.',
  verificationStatus:
    'PARTIALLY TRACTABLE: TIER 1 (m-linear curvature) and TIER 2 (m-free const ' +
    'sector + offset) are already symbolic in m; TIER 3 (sub-leading per-cell ' +
    'coefficients) is the sole binding obstruction, confirmed by the ' +
    'non-constant dQ/dm signature (spread ratio ~2.44) and refined by the ' +
    'not-m-free cell-count correction to the imp-95861 framing. Establishes no ' +
    'closed form; changes no bound.',
});

export const IMP95906_TRANSPORT_TIER_DECOMPOSITION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95906',
  proofSection: 'S-frontier',
  glosses: 'imp-95877',
  question:
    'imp-95877 decomposed the imp-95861 TRANSPORT identity into three ' +
    'coefficient tiers and refuted the shortcut that the two already-symbolic ' +
    'tiers alone close it. What exactly are the three tiers, which two are ' +
    'already symbolic in m, and what does the dQ/dm test rule out, for a reader ' +
    'landing on that module cold?',
  headword: TRANSPORT_TIER_DECOMPOSITION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the ' +
    'imp-95877 decomposition: TIER 1 (leading curvature, m-linear) and TIER 2 ' +
    '(const sector + offset, m-free) are already symbolic in m; TIER 3 ' +
    '(sub-leading per-cell coefficients s_J(m,cell), c_J(m,cell)) is numeric ' +
    'only and is the sole binding obstruction, confirmed by a non-constant ' +
    'dQ/dm signature that refutes the curvature-only shortcut. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95877 (the tier decomposition and dQ/dm test this glosses); imp-95861 ' +
    '(the TRANSPORT identity route being decomposed); imp-95745 (proved TIER 2 ' +
    'm-free); imp-95720 (established the TIER 1 curvature form).',
});

export default IMP95906_TRANSPORT_TIER_DECOMPOSITION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95906_TRANSPORT_TIER_DECOMPOSITION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95906-headword-has-required-fields',
    why: 'The headword must name all three tiers, the dQ/dm binding test, and the confirmed spread ratio -- the entire point of the glossary entry.',
    holds: () => {
      const h = TRANSPORT_TIER_DECOMPOSITION_HEADWORD;
      return (
        /TIER 1/.test(h.definition) &&
        /TIER 2/.test(h.definition) &&
        /TIER 3/.test(h.definition) &&
        /dc\/dm = -2/.test(h.mechanism) &&
        /2\.44/.test(h.bindingTest)
      );
    },
  },
  {
    id: 'imp95906-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95906_TRANSPORT_TIER_DECOMPOSITION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95906_TRANSPORT_TIER_DECOMPOSITION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95906_TRANSPORT_TIER_DECOMPOSITION_GLOSSARY_HEADWORD.verdict) &&
      IMP95906_TRANSPORT_TIER_DECOMPOSITION_GLOSSARY_HEADWORD.glosses === 'imp-95877',
  },
];

for (const assertion of IMP95906_TRANSPORT_TIER_DECOMPOSITION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95906-transport-tier-decomposition-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
