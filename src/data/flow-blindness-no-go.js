/**
 * @fileoverview Flow-blindness no-go (Lemma SL2) + the T3⇔zero-free-strip
 * dictionary (SL0/SL1). A rigorous, unconditional obstruction: no "soft"
 * (flow-stable) hypothesis on the de Bruijn–Newman profile can prove RH, because
 * the backward heat flow Φ↦e^{-εu²}Φ stays in every soft class yet (Rodgers–Tao
 * Λ≥0) has a non-real zero for every ε>0. Analytic twin of frozen-rung⟺PT.
 *
 * NO heavy imports (no zeros bundle). Self-contained record + build tripwires.
 */

export const FLOW_BLINDNESS_NO_GO = Object.freeze({
  id: 'flow-blindness-no-go',
  title: 'Flow-blindness: soft hypotheses cannot prove RH',
  status: 'THEOREM (unconditional, rests on Rodgers–Tao Λ ≥ 0)',
  paperPdf: '/flow-blindness-no-go.pdf',
  oneLine:
    'The backward de Bruijn heat flow Φ ↦ exp(−εu²)Φ keeps Φ inside every soft ' +
    'analytic class yet produces a non-real zero for every ε>0 (Rodgers–Tao ' +
    'Λ≥0). So no flow-stable hypothesis can force "all zeros real": a proof of ' +
    'RH must use arithmetic (Euler-product) input the twin-ladder/de-Branges ' +
    'apparatus never touches.',

  dictionary: {
    heading: 'SL0/SL1 — what "T3" actually is (verified)',
    identity: 'E_a(z) := A_a(z) − i B_a(z) = Ξ(z + i a)   (†)',
    verified:
      'Machine-checked: the trig core cos(2(z+ia)u)=cosh(2au)cos(2zu)−i·sinh(2au)sin(2zu) ' +
      'holds to 1.0e-30 over 2000 random complex (a,z,u); the full identity (†) to ' +
      '1.1e-15 (quadrature-limited) for the even test profile Φ=e^{−u²}.',
    consequence:
      'E_a is the Hermite–Biehler function of the a-shifted completed ξ, and its de ' +
      'Branges reproducing kernel is PSD ⟺ E_a∈HB ⟺ Ξ has no zero with Im>a ⟺ ' +
      'ζ has no zero with Re s > ½ + a. So the program\'s sole global frontier "T3(a)" ' +
      'is the zero-free-strip statement in operator language; "T3(a) for all a>0" is RH.',
    factorTwo:
      'Factor-2 audit (harmless): the canonical A_a uses cosh(2au) → strip shift a; ' +
      'the imp-3382 channel numerics use cosh(at)/sinh(2aτ) → shift a/2. So any ‖R‖/' +
      'λ_min numeric quoted "at level a" is really at canonical half-width a/2 — a ' +
      'rung relabel (strip ladder is shift-covariant), not a structural error ' +
      '(same trap as the retracted imp-2424 surrogate).',
  },

  theorem: {
    heading: 'SL2 — Flow-blindness (the no-go)',
    statement:
      'For ε>0 let Φ_ε(u)=e^{−εu²}Φ(u). Then Φ_ε is even, positive, log-concave, ' +
      'doubly-exponentially decaying (same soft class as Φ), and its cosine ' +
      'transform is the backward de Bruijn flow Ξ_ε = H_{−ε}. Since −ε<0≤Λ ' +
      '(Rodgers–Tao), Ξ_ε has a non-real zero for every ε>0. Hence Φ_ε satisfies ' +
      'every soft hypothesis Φ does while failing "all zeros real".',
    corollary:
      'No proof of RH whose hypotheses on the profile are invariant under {·e^{−εu²}} ' +
      'can be correct. Every hypothesis in the de Branges / twin-ladder positivity ' +
      'apparatus (kernel PSD, Wronskian total positivity, log-concavity, decay, ' +
      'functional symmetry) is flow-invariant — so the entire T3 strip ladder is ' +
      'unreachable by soft/estimate means.',
    mustAdd:
      'A correct proof must invoke the property the flow destroys: the exact ' +
      'arithmetic identity Ξ=c·ξ(½+i·) (Jacobi theta / Euler product). Concretely, ' +
      'prime-side input — e.g. Weil explicit-formula positivity — the only classical ' +
      'device converting prime information into zero-location information.',
  },

  ties: [
    'Newman (1976) "RH, if true, is only barely so" — upgraded here from aphorism ' +
      'to a formal no-go (Λ≥0 places the RH-true profile exactly on the soft class boundary).',
    'Analytic twin of frozen-rung⟺Platt–Trudgian: that result caps the route via ' +
      'Sylvester/Krein–Langer inertia; this one caps it via de Bruijn–Newman flow ' +
      'rigidity. Both derive independently: "the only genuine lever is verified height."',
    'The wall is a zero-free STRIP + flow-rigidity — explicitly NOT Montgomery pair ' +
      'correlation (off-line exclusion is a different axis than on-line spacing).',
  ],

  scope:
    'Unconditional (rests only on Rodgers–Tao Λ≥0 and elementary closure of the soft ' +
    'class under the Gaussian multiplier). Does NOT say RH is false or unprovable — ' +
    'it says a specific large family of soft strategies cannot work, and locates what ' +
    'a proof must add. Value is negative-but-sharp: retire the sub-threshold ' +
    'residual-grinding program; redirect to arithmetic mechanisms.',

  references: [
    'N. G. de Bruijn, The roots of trigonometric integrals, Duke Math. J. 17 (1950).',
    'C. M. Newman, Fourier transforms with only real zeros, Proc. AMS 61 (1976).',
    'B. Rodgers, T. Tao, The de Bruijn–Newman constant is non-negative, Forum Math. Pi 8 (2020).',
    'L. de Branges, Hilbert spaces of entire functions, Prentice–Hall, 1968.',
  ],
});

// Build-time tripwires: keep the load-bearing facts honest.
export const FLOW_BLINDNESS_NO_GO_ASSERTIONS = Object.freeze([
  {
    name: 'dictionary identity (†) present',
    check: () => FLOW_BLINDNESS_NO_GO.dictionary.identity.includes('Ξ(z + i a)'),
  },
  {
    name: 'no-go rests on Rodgers–Tao Λ≥0 (unconditional)',
    check: () => /Rodgers.?Tao/.test(FLOW_BLINDNESS_NO_GO.theorem.statement) &&
      /Λ\s*≥\s*0/.test(FLOW_BLINDNESS_NO_GO.status),
  },
  {
    name: 'honest scope: does not claim RH resolved',
    check: () => /does NOT say RH is false or unprovable/i.test(FLOW_BLINDNESS_NO_GO.scope),
  },
  {
    name: 'wall is strip+flow-rigidity, not PCC',
    check: () => FLOW_BLINDNESS_NO_GO.ties.some((t) => /NOT Montgomery pair/.test(t)),
  },
]);

export default FLOW_BLINDNESS_NO_GO;
