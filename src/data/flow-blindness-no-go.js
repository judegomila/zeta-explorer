/**
 * Flow-blindness, corrected 2026-09-30: the excluded hypothesis class must
 * contain the actual profile AND its negative-time deformations. Invariance
 * of arbitrary analytic subclasses, kernel PSD, or total positivity is not given.
 */
export const FLOW_BLINDNESS_NO_GO = Object.freeze({
  id: 'flow-blindness-no-go',
  title: 'Flow-blindness: the scope of the no-go',
  status: 'THEOREM for an explicitly flow-stable class containing Φ (Rodgers–Tao Λ ≥ 0)',
  paperPdf: '/flow-blindness-no-go.pdf',
  paperSource: 'https://github.com/judegomila/mathexplorer/blob/editorial-redesign/formalization/paper/flow-blindness-no-go.tex',
  oneLine:
    'A hypothesis class containing Φ and its backward heat deformations cannot force all zeros real. ' +
    'This does not exclude analytic proofs using additional properties that those deformations lack.',
  dictionary: {
    heading: 'SL0/SL1 — the shifted-transform identity',
    identity: 'E_a(z) := A_a(z) − i B_a(z) = Ξ(z + i a)   (†)',
    verified:
      'The identity follows algebraically from cos(2(z+ia)u)=cosh(2au)cos(2zu)−i sinh(2au)sin(2zu). ' +
      'The recorded numerical checks are checks of this identity, not proofs of kernel positivity.',
    consequence:
      'The full shifted de Branges positivity family is an RH target. The identity alone does not establish ' +
      'Hermite–Biehler membership; individual-shift formulations require their zero and nondegeneracy hypotheses.',
    factorTwo:
      'Keep the normalization explicit: cos(2zu) with cosh(2au) gives shift a; a convention using cos(zu) ' +
      'requires its own matching shift. Compare certificates only after converting conventions.',
  },
  theorem: {
    heading: 'SL2 — conditional-class flow-blindness',
    statement:
      'Let H be a class of admissible profiles containing Φ and e^{−εu²}Φ for every sufficiently small ε>0. ' +
      'With H_t(z)=∫ e^{tu²}Φ(u)cos(zu)du, the latter profiles have transforms H_{−ε}. ' +
      'Rodgers–Tao Λ≥0 implies H_{−ε} has a non-real zero. Therefore membership in H cannot imply all zeros real.',
    corollary:
      'Evenness, positivity and a decay upper bound are preserved by the multiplier; log-concavity is preserved ' +
      'when present. Invariance of a narrower class must be proved separately. Kernel PSD and Wronskian total ' +
      'positivity are not automatically flow-invariant.',
    mustAdd:
      'A successful hypothesis must exclude the negative-time counterexamples. Exact arithmetic information is ' +
      'one possible source of such a distinction; this theorem does not prove it is the only source or require ' +
      'a proof to use the Euler product explicitly.',
  },
  ties: [
    'Rodgers–Tao proves the real-zero threshold is nonnegative. If RH holds, that threshold is exactly zero.',
    'This conditional-class obstruction does not prove that verified zero height is the only useful lever.',
    'The argument uses negative-time zero failure, NOT Montgomery pair correlation; the two questions differ.',
  ],
  scope:
    'The theorem does NOT say RH is false or unprovable. It excludes universal implications from an explicitly ' +
    'flow-stable class containing Φ. It does not rule out all analytic, operator, or support-uniform arguments. ' +
    'The August PDF is historical and superseded by the corrected source and this statement.',
  references: [
    'B. Rodgers and T. Tao, The de Bruijn–Newman constant is non-negative, https://arxiv.org/abs/1801.05914.',
    'N. G. de Bruijn, The roots of trigonometric integrals, Duke Math. J. 17 (1950).',
    'C. M. Newman, Fourier transforms with only real zeros, Proc. AMS 61 (1976).',
    'L. de Branges, Hilbert spaces of entire functions (1968).',
  ],
});
export const FLOW_BLINDNESS_NO_GO_ASSERTIONS = Object.freeze([
  { name: 'shift identity retained', check: () => FLOW_BLINDNESS_NO_GO.dictionary.identity.includes('Ξ(z + i a)') },
  { name: 'profile membership is a hypothesis', check: () => FLOW_BLINDNESS_NO_GO.theorem.statement.includes('containing Φ') },
  { name: 'Rodgers–Tao input explicit', check: () => /Rodgers.?Tao/.test(FLOW_BLINDNESS_NO_GO.theorem.statement) },
  { name: 'scope excludes a universal analytic-method ban', check: () => FLOW_BLINDNESS_NO_GO.scope.includes('does not rule out all analytic') },
]);
export default FLOW_BLINDNESS_NO_GO;
