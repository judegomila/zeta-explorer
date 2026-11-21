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
    { target: 'G = β(2)', enc: 'χ₄, q=4, k=2', predDim: 5, verdict: 'OPEN in refereed literature. Corrected 2026-11-21: the π-column is not forced (Zudilin 2003 gives forms in 1 and G alone) and the generator count 5 is not an obstruction; the known forms fail because decay 2.406 is below denominator growth of about 6.77. Claimed irrational in openai/math 005 (2026-10-06; Lean-formalized per the repository; not peer-reviewed)' },
    { target: 'β(4), β(6)', enc: 'χ₄, k=4,6', predDim: '≥5', verdict: 'OPEN: one-of-block (RZ 2003)' },
    { target: 'ζ(5), ζ(7)', enc: 'trivial χ, k=5,7', predDim: '≥2', verdict: 'OPEN: odd block coupled' },
  ],

  // Sun's Catalan-irrationality preprint (arXiv:2609.04176) — a live external claim.
  sunCase: {
    heading: 'External claim: Sun’s Catalan preprint',
    body:
      'Zhi-Wei Sun (arXiv:2609.04176, "Catalan’s constant is irrational") claims G '
      + 'irrational via a "weighted tails" construction u_m = T_m/(2m+1) (T_m the tail of '
      + 'the Catalan series). It is single-author and AI-checked ("passed ChatGPT '
      + 'verification"), and an independent community Lean effort declines to certify the '
      + 'main theorem. This project HAS analyzed its internals: the §6–9 asymptotic ledger '
      + '(δ₀ = Λ_mid + 83/2400 − c_odd − (4ρ−2ρ²), ρ=S/B) was reconstructed twice and a §9 '
      + 'sign re-analysis found it FLAWED — the decisive quantity measures ≈ +1.86 B² (or '
      + '+0.474 B² after removing a 2-adic waste factor) where the proof needs ≤ −0.0097 B² '
      + '(wrong-sign B²; three distinct §9 errors; no construction-class variant reaches a '
      + 'negative coefficient). So: treat it as REFUTED-as-a-proof; Catalan G still OPEN in the refereed literature (see the openai/math 005 claim below). '
      + 'Conditional on the flagged §9 sign error (ρ=S/B), a re-derived δ₀_corr(ρ) ledger '
      + 'flips Sun’s literal ρ=1/20 margin NEGATIVE (δ₀_corr≈−0.00034), destroying the '
      + 'fixed-ratio hardening framing, while a robust interior optimum survives near '
      + 'ρ*≈1/56 with δ₀_corr(ρ*)≈+0.0373 — so under this one interpretation of the sign '
      + 'error, the ρ-optimization is load-bearing, not cosmetic. '
      + 'CAVEAT (placement-dependence): ρ²=S²/B² appears in THREE ledger terms, and Sun’s '
      + 'note only flags a wrong-sign B² term without pinning which one. The "goes '
      + 'negative at ρ=1/20" / "optimum near ρ*≈1/56" pair is specific to placing the sign '
      + 'flip on the (9.4) quadratic; placing it on Δ_gtB instead keeps the ρ=1/20 margin '
      + 'POSITIVE (+0.007162, optimum ρ*≈1/51.5), and placing it on c_odd keeps it POSITIVE '
      + 'and larger (+0.022216, optimum ρ*≈1/42.2). What IS robust across all three '
      + 'placements: an interior positive-margin optimum exists in (0,1/20) with '
      + 'δ₀_corr(ρ*)>0.037 — only the sharp "negative" / "≈1/56" figures are '
      + 'placement-A-specific. '
      + '(Do not confuse it with Dale James Raymond’s de Bruijn–Newman bound Λ<0.149396, '
      + 'Zenodo 22867547 — a different author and problem; Raymond’s paper shares NONE of '
      + 'Sun’s δ₀ ledger, and Λ is zero-location, not value-irrationality.)',
    status: 'external, UNVERIFIED — §9 analyzed and found flawed (wrong-sign B²); Catalan G open; distinct from Raymond’s Λ<0.149396 paper',
  },

  // openai/math release (2026-10-06): families 005 (Catalan) and 017 (irrationality exponent of π).
  openaiCase: {
    heading: 'External claims: openai/math families 005 and 017',
    body:
      'The openai/math repository (github.com/openai/math, released 2026-10-06) contains manuscripts written by an '
      + 'internal OpenAI model; its README states that unformalized results may contain errors. Family 005 claims that '
      + 'Catalan’s constant G = β(2) is irrational, with the Lean comparator statement '
      + 'OAI.InternalCatalan.catalan_irrational and a solution tree of 981 files whose sources contain no sorry (text '
      + 'search). Its method uses determinants Δ_N of size 48N whose rows have high Taylor contact so that the ζ(2) '
      + 'column cancels in every entry, a mechanism outside the list covered by the /catalan-signed-ladder obstruction. '
      + 'Family 017 claims that the irrationality exponent of π equals 2 (comparator statement PiExponent). '
      + 'Both are Lean-formalized per the repository and not peer-reviewed; this project has not built or checked '
      + 'either Lean proof (the family 003 zero-free-strip proof was re-built locally; see '
      + 'src/data/openai-math-integration-2026-10-08.js). Next check: rebuild Δ_N for N = 1, 2 and confirm the '
      + 'ζ(2) cancellation numerically.',
    status: 'external, claimed by an internal OpenAI model; Lean-formalized per the repository; NOT peer-reviewed; not checked by this project',
  },

  // Fauzan's ζ(5)-irrationality preprint (Zenodo 22826419) — a live external claim.
  fauzanCase: {
    heading: 'External claim: Fauzan’s ζ(5) preprint',
    body:
      'Aabir Fauzan (Aalto University), "ζ(5) is irrational" (Zenodo 22826419, DOI '
      + '10.5281/zenodo.22826419, 17 Sep 2026), claims ζ(5) ∉ Q with irrationality '
      + 'exponent ≤ 260. ζ(5) irrationality is a famous open problem — only ζ(3) is '
      + 'known irrational (Apéry 1979). Method: Hankel determinants of a positive moment '
      + 'matrix, a per-prime p-adic Gauss-valuation ledger, and a logarithmic-energy '
      + 'bound; the theorem reduces to one K²-scale inequality A_M < −U (denominator '
      + 'growth below real decay), with A_200 = 1.3496 vs U = −1.3670, margin ~1.3%. This '
      + 'project mechanism-verified it and found NO FLAW: exact Hankel reconstructions at '
      + 'K=40..200 (Δ_K > 0 at ζ(5)), per-prime valuation bounds hold with zero violations '
      + '(outer range often exactly tight), all rational constants reproduce, and the '
      + 'real-side energy bound holds on a 224k-point grid with margin. What was NOT '
      + 'proof-checked: Lemmas 3.1–3.2 and Prop 4.1 in the p>200M regime (verified only '
      + 'through their consequences), and Appendix A’s rational-enclosure certificate. So: '
      + 'CREDIBLE but UNREFEREED — no wrong sign/constant/soft-hypothesis gap found, yet a '
      + 'proof of a famous open problem cannot be certified from computation. Higher '
      + 'standing than Sun’s Catalan claim (where a wrong-sign B² was found). Unrelated to '
      + 'RH/Λ (zero-location) and to Raymond/Sun; cites Brown–Zudilin as background.',
    status: 'external, CREDIBLE-UNREFEREED — mechanism-verified, no flaw found; core Lemmas 3.1–3.2 not proof-checked; NOT a certified theorem; ζ(5) still officially open',
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
    'openai/math, github.com/openai/math (released 2026-10-06), families 005 and 017 — claimed by an internal OpenAI model; Lean-formalized per the repository; not peer-reviewed.',
  ],
});

export const IRRATIONALITY_PIPELINE_ASSERTIONS = Object.freeze([
  {
    name: 'pipeline has exactly 6 stages, numbered 1..6',
    holds: () => IRRATIONALITY_PIPELINE.stages.length === 6
      && IRRATIONALITY_PIPELINE.stages.every((s, i) => s.n === i + 1),
  },
  {
    name: 'stage 4 forbids low-precision PSLQ (hallucination discipline)',
    holds: () => /NEVER low-precision PSLQ|hallucinat/i.test(IRRATIONALITY_PIPELINE.stages[3].what),
  },
  {
    name: 'stage 6 verdict is proven / one-of-a-block / open with gap',
    holds: () => /proven/.test(IRRATIONALITY_PIPELINE.stages[5].output)
      && /β\s*−\s*α|gap/.test(IRRATIONALITY_PIPELINE.stages[5].output),
  },
  {
    name: 'honest: method proves nothing on its own',
    holds: () => /proves no constant irrational|proves nothing/i.test(IRRATIONALITY_PIPELINE.caveat),
  },
  {
    name: 'Sun case: flagged UNVERIFIED + distinguished from Raymond’s Λ paper',
    holds: () => /UNVERIFIED/i.test(IRRATIONALITY_PIPELINE.sunCase.status + IRRATIONALITY_PIPELINE.sunCase.body)
      && /Raymond/.test(IRRATIONALITY_PIPELINE.sunCase.body),
  },
  {
    name: 'Sun case: sign-corrected ρ=1/20 margin flagged negative, interior optimum load-bearing',
    holds: () => /NEGATIVE/.test(IRRATIONALITY_PIPELINE.sunCase.body)
      && /load-bearing/.test(IRRATIONALITY_PIPELINE.sunCase.body),
  },
  {
    name: 'openai/math 005/017 claims: external, Lean-formalized per the repository, NOT peer-reviewed; G row keeps refereed status OPEN',
    holds: () => /NOT peer-reviewed/.test(IRRATIONALITY_PIPELINE.openaiCase.status)
      && /internal OpenAI model/.test(IRRATIONALITY_PIPELINE.openaiCase.body)
      && /not checked by this project/.test(IRRATIONALITY_PIPELINE.openaiCase.status)
      && /^OPEN in refereed literature/.test(IRRATIONALITY_PIPELINE.targets.find((t) => t.target === 'G = β(2)').verdict)
      && /not peer-reviewed/.test(IRRATIONALITY_PIPELINE.targets.find((t) => t.target === 'G = β(2)').verdict),
  },
  {
    name: 'Fauzan ζ(5) case: credible-unrefereed, NOT certified (no false QED)',
    holds: () => /CREDIBLE-UNREFEREED/i.test(IRRATIONALITY_PIPELINE.fauzanCase.status)
      && /NOT a certified theorem|cannot be certified/i.test(IRRATIONALITY_PIPELINE.fauzanCase.status + IRRATIONALITY_PIPELINE.fauzanCase.body),
  },
  {
    name: 'Sun case: negative-margin/1-56 claim flagged placement-A-specific, robust optimum stated',
    holds: () => /placement-A-specific/.test(IRRATIONALITY_PIPELINE.sunCase.body)
      && /POSITIVE/.test(IRRATIONALITY_PIPELINE.sunCase.body)
      && /0\.037/.test(IRRATIONALITY_PIPELINE.sunCase.body),
  },
]);

export default IRRATIONALITY_PIPELINE;
