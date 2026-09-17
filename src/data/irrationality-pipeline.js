/**
 * @fileoverview The irrationality pipeline — a reusable 6-stage method for
 * attacking the irrationality of a special L-value, generalized from the
 * verified signed-ladder ↔ Catalan work ([[catalan-signed-ladder]]).
 *
 * The pipeline turns "is this constant irrational?" into a sequence of concrete,
 * checkable stages: encode the constant as a character-twisted ladder value,
 * PREDICT its period lattice from the functional equation alone, GENERATE the
 * linear forms, COMPUTE the exact period dimension, CANCEL what the symmetry
 * allows, and TEST the net exponent. Output per target: proven / one-of-a-block /
 * open with the exact gap β − α.
 *
 * This is a METHOD, not a theorem. It proves no constant irrational; it makes the
 * obstruction to each one explicit and comparable. NO heavy imports.
 */

export const IRRATIONALITY_PIPELINE = Object.freeze({
  id: 'irrationality-pipeline',
  title: 'The irrationality pipeline',
  status: 'METHOD — reusable attack template; proves nothing on its own',
  oneLine:
    'A 6-stage pipeline that encodes a target as a character-twisted twin ladder '
    + 'L(k,χ), predicts its period lattice from the functional equation alone, '
    + 'generates and exactly measures the linear forms, cancels what the symmetry '
    + 'allows, and reads off the verdict: proven, one-of-a-block, or open with the '
    + 'exact net-exponent gap.',

  stages: [
    {
      n: 1,
      name: 'Ladder encoder (input normalizer)',
      what:
        'Express the target constant as a special value L(k,χ) — a character-twisted '
        + 'Euler product, i.e. the twin ladder with rungs χ(p^m)·p^{−ms} evaluated at '
        + 's=k. This is where "signed flipping" enters generically: χ is the rung-sign '
        + 'pattern.',
      output: 'the conductor q, parity, weight k, root number ε',
      examples: 'ζ(3) → trivial χ; Catalan → χ₄; the χ₋₃ sibling; ζ(5); β(4) — all just different (χ, k)',
    },
    {
      n: 2,
      name: 'Period-predictor (the elegant core)',
      what:
        'From the functional-equation data ALONE — the completed Λ(s,χ) = '
        + '(q/π)^{(s+ε)/2}Γ(…)L(s,χ) and the Gauss sum τ(χ) — predict the ambient '
        + 'period lattice without integrating. The Tate twist ℚ(k) injects π^k; the '
        + 'Gauss sum injects π (and i for odd χ); the Γ-factor and endpoint evaluations '
        + 'inject log 2 and ζ-values. The twin-ladder mirror tells you the parasites '
        + 'from conductor + parity — geometry to our advantage.',
      output: 'the predicted dimension d of ⟨1, target, π, π², log 2, …⟩',
      examples: 'ζ(2) → 2; Catalan → 5 (π, π², log2 parasites)',
    },
    {
      n: 3,
      name: 'Linear-form generator',
      what:
        'Apply the shifted-Legendre / Beukers device to the ladder’s natural Mellin '
        + 'kernel (1/(1−xy) for ζ, 1/(1+x²y²) for χ₄, generally the kernel of the '
        + 'L-value). Produces the linear form.',
      output: 'a_n + b_n·(target) + Σ c_n·(parasites)',
      examples: '∫∫ P̃₁P̃₁/(1+x²y²) = G − π + 2ln2 + π²/12',
    },
    {
      n: 4,
      name: 'Period-dimension computer',
      what:
        'Exact hand-derivation of the resulting period space — NEVER low-precision '
        + 'PSLQ, which hallucinates (the 12·I₁ = −68+11π+4π²−9ln2 false relation was '
        + 'the demonstration). This confirms the stage-2 prediction.',
      output: 'the confirmed exact period dimension',
      examples: 'ζ(2) → dim 2; Catalan → dim 5, verified as G − π + 2ln2 + π²/12',
    },
    {
      n: 5,
      name: 'Symmetry canceller',
      what:
        'Apply the known column-killers and track the cost each charges: well-poised '
        + 'symmetry (cancels π-powers, but the wrong parity block for χ₄); Rhin–Viola '
        + 'birational group (denominator-only); conjugate-contour extraction (removes π '
        + 'but taxes the denominator); Beilinson regulator (π is the Tate twist — '
        + 'motivically mandatory).',
      output: 'the post-cancellation dimension and the denominator inflation',
      examples: 'χ₄: no cancellation reaches ⟨1,G⟩ without flipping α>β to β>α',
    },
    {
      n: 6,
      name: 'Net-exponent tester (the verdict)',
      what:
        'Compute the decay rate α (saddle-point of the integral) versus the '
        + 'denominator growth β (lcm + Gauss-sum valuations, or better, the CDT '
        + 'arithmetic-holonomy capacity-vs-denominator bound). Irrationality iff α > β '
        + 'after cancellation.',
      output: 'proven / one-of-a-block / open — with the exact gap β − α',
      examples: 'ζ(3): α=3.53 > β=3 → proven. G: β ≳ α after π-elimination → open.',
    },
  ],

  // Worked targets — what the pipeline outputs for each (grades honest).
  targets: [
    { target: 'ζ(3)', enc: 'trivial χ, k=3', predDim: 2, verdict: 'PROVEN (Apéry): α=3.53>β=3' },
    { target: 'ζ(2)', enc: 'trivial χ, k=2', predDim: 2, verdict: 'closed form (π²/6)' },
    { target: 'L(2,χ₋₃)', enc: 'χ₋₃, q=3, k=2', predDim: '≤3', verdict: 'PROVEN (CDT 2024): conductor-3 capacity clears' },
    { target: 'G = β(2)', enc: 'χ₄, q=4, k=2', predDim: 5, verdict: 'OPEN: π-column forced; β≳α after elimination' },
    { target: 'β(4), β(6)', enc: 'χ₄, k=4,6', predDim: '≥5', verdict: 'OPEN: one-of-block (RZ 2003)' },
    { target: 'ζ(5), ζ(7)', enc: 'trivial χ, k=5,7', predDim: '≥2', verdict: 'OPEN: odd block coupled' },
  ],

  // The pipeline in action on Sun's Catalan preprint (stage-6 sensitivity).
  sunCase: {
    heading: 'Stage 6 in action: Sun’s Catalan preprint',
    body:
      'Sun (arXiv:2609.04176, UNVERIFIED) claims α>β for G via a p-adic "weighted '
      + 'tails" construction with decisive margin δ₀ = Λ_mid + 83/2400 − c_odd − '
      + '(4ρ−2ρ²) ≈ 0.00966 at ρ=S/B=1/20. The pipeline’s stage-6 sensitivity view '
      + 'exposes that ρ is a free parameter Sun never optimized: δ₀(ρ) is un-maximized, '
      + 'and the §5 saturation permits ρ far below 1/20. Whether re-optimizing ρ '
      + 'hardens the margin is under independent replication; it does not certify the '
      + 'proof, whose §2–§5 determinant core is separate.',
    status: 'under independent replication — not asserted',
  },

  caveat:
    'The pipeline is a comparison instrument. It proves no constant irrational; it '
    + 'makes each obstruction explicit (the exact β−α gap) and comparable across '
    + 'targets. The period-dimension framing is standard practice (Kontsevich–Zagier '
    + 'periods + Nesterenko/Ball–Rivoal), made mechanical here — not a new theory.',

  references: [
    'M. Kontsevich, D. Zagier, Periods (2001).',
    'Yu. Nesterenko, linear-independence criterion (1985); K. Ball, T. Rivoal, Invent. Math. 146 (2001).',
    'F. Calegari, V. Dimitrov, Y. Tang, The linear independence of 1, ζ(2), L(2,χ₋₃) (2024).',
    'D. Rivoal, W. Zudilin, Diophantine properties of numbers related to Catalan’s constant, Math. Ann. 326 (2003).',
  ],
});

export const IRRATIONALITY_PIPELINE_ASSERTIONS = Object.freeze([
  {
    name: 'pipeline has exactly 6 stages, numbered 1..6',
    check: () => IRRATIONALITY_PIPELINE.stages.length === 6
      && IRRATIONALITY_PIPELINE.stages.every((s, i) => s.n === i + 1),
  },
  {
    name: 'stage 4 forbids low-precision PSLQ (hallucination discipline)',
    check: () => /NEVER low-precision PSLQ|hallucinat/i.test(IRRATIONALITY_PIPELINE.stages[3].what),
  },
  {
    name: 'stage 6 verdict is proven / one-of-a-block / open with gap',
    check: () => /proven/.test(IRRATIONALITY_PIPELINE.stages[5].output)
      && /β\s*−\s*α|gap/.test(IRRATIONALITY_PIPELINE.stages[5].output),
  },
  {
    name: 'honest: method proves nothing on its own',
    check: () => /proves no constant irrational|proves nothing/i.test(IRRATIONALITY_PIPELINE.caveat),
  },
  {
    name: 'Sun ρ-optimization marked under replication, not asserted',
    check: () => /under independent replication|not asserted/i.test(IRRATIONALITY_PIPELINE.sunCase.status),
  },
]);

export default IRRATIONALITY_PIPELINE;
