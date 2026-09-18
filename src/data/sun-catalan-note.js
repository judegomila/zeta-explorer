/**
 * @fileoverview Public presentation of the note to Zhi-Wei Sun on his Catalan
 * irrationality preprint (arXiv:2609.04176). Our contribution is a parameter
 * optimization (ρ = S/B) that hardens his decisive margin ~4×, independently
 * replicated within the §6–§9 ledger. It does NOT certify his proof (the §2–§5
 * determinant core and the (9.4) baseline are taken as he states them) and does
 * NOT settle Catalan irrationality, which remains OPEN. His preprint is unrefereed.
 *
 * NO heavy imports. Source-of-truth prose: research-inputs/sun-catalan-rho-optimization-note.md.
 */

export const SUN_CATALAN_NOTE = Object.freeze({
  id: 'sun-catalan-note',
  title: 'A parameter optimization that strengthens Sun’s Catalan margin',
  status: 'CONTRIBUTION to an UNREFEREED preprint; does not certify the proof; G irrationality OPEN',
  oneLine:
    'Zhi-Wei Sun’s preprint (arXiv:2609.04176) claims Catalan’s constant G is '
    + 'irrational. Independently of whether that proof is correct, its decisive '
    + 'margin δ₀ can be hardened ~4× by re-optimizing one free ratio ρ = S/B that '
    + 'the paper never optimizes — from δ₀≈0.00966 at ρ=1/20 to ≈0.03872 at ρ*=1/50.',

  scope:
    'This verifies and optimizes the asymptotic ledger of §6–§9 only. It takes the '
    + 'determinant construction of §2–§5, and the raw quadratic coefficient 4ρ−2ρ² of '
    + '(9.4), as Sun states them — it does NOT re-derive that core, does NOT certify '
    + 'the main theorem, and does NOT settle the irrationality of G (which remains a '
    + 'famous open problem). Sun’s preprint is single-author and unrefereed.',

  gate:
    'Validation gate: two independent from-scratch reconstructions of the §7 integrand '
    + 'ℰ_ρ(t) each reproduce Sun’s exact value of Λ_mid at ρ=1/20 — the full 235-cell '
    + 'rational fraction (numerator 33042423784278900654572890582560690565493664595111), '
    + 'not merely its decimal 0.1763558379286483 — which is what makes the general-ρ '
    + 'evaluation trustworthy. Every ℰ_ρ and Q₀ value was cross-checked against direct '
    + 'finite-B combinatorics; all integrals are exact-rational, never floating-point '
    + 'relation-finding.',

  identity: 'δ₀(ρ) = Λ_mid(ρ) − (10/3)ρ + (5/2)ρ² − κρ²,  κ ≈ 2.5107',
  identityNote:
    'from δ₀ = Λ_mid + Δ_{>B} − c_odd − (4ρ−2ρ²) with the general-ρ forms '
    + 'Δ_{>B}(ρ) = (2/3)ρ + (1/2)ρ² and c_odd(ρ) = κρ² (the §6 integrand Q₀ is '
    + 'ρ-independent, so c_odd scales exactly as ρ²).',

  table: [
    { rho: '1/20 (as written)', d0: '0.00966243' },
    { rho: '1/30', d0: '0.034716' },
    { rho: '1/49', d0: '0.038716' },
    { rho: '1/50 (optimum)', d0: '0.038723' },
    { rho: '1/51', d0: '0.038715' },
    { rho: '1/100', d0: '0.01508' },
    { rho: '→ 0⁺', d0: '→ 0⁺' },
  ],

  findings: [
    'Optimum at ρ* = 1/50 (interior; dδ₀/dρ at 1/20 ≈ −1.67, a steep downslope). Simply replacing S=⌊B/20⌋ by S=⌊B/50⌋ hardens (9.3) by ~4.01×.',
    'Positivity of the decisive inequality is robust: δ₀(ρ) > 0 across the whole interval ρ ∈ (0, 0.05548). The razor-thin margin at 1/20 is an artifact of that suboptimal choice, not of the method.',
    'Admissibility at ρ=1/50 holds on every front: §2 rank (no ρ-dependence), §5 saturation (easier as ρ shrinks: margin B/4 − 7S/8 − 21/8 + 3S/K), §7 one-layer, §8 (needs ρ<1/3), §6 (u=S/Q≥1).',
    'Sun’s c_odd(1/20) = 0.006276744728… is CORRECT to all 39 printed digits (an earlier reconstruction reported a spurious erratum; independent replication traced it to that reconstruction’s own quadrature sign-bug and refuted it).',
  ],

  verdict:
    'A free ~4× hardening of Sun’s decisive margin, independently replicated within his '
    + '§6–§9 ledger, plus the observation that his positivity is robust in ρ (not '
    + 'razor-thin). This strengthens his argument IF it is sound; it does not decide '
    + 'whether it is. Catalan’s irrationality remains open.',

  noteFile: 'research-inputs/sun-catalan-rho-optimization-note.md',
  preprint: 'arXiv:2609.04176',

  references: [
    'Zhi-Wei Sun, Catalan’s constant is irrational, arXiv:2609.04176 (2026) — UNREFEREED preprint.',
    'F. Beukers, A note on the irrationality of ζ(2) and ζ(3), Bull. LMS 11 (1979).',
    'F. Calegari, V. Dimitrov, Y. Tang, The linear independence of 1, ζ(2), L(2,χ₋₃) (2024).',
  ],
});

export const SUN_CATALAN_NOTE_ASSERTIONS = Object.freeze([
  {
    name: 'scope: does not certify the proof or settle G',
    check: () => /does NOT certify|remains a famous open problem|remains open/i.test(
      SUN_CATALAN_NOTE.scope + SUN_CATALAN_NOTE.verdict),
  },
  {
    name: 'preprint flagged unrefereed',
    check: () => /unrefereed|UNREFEREED/.test(SUN_CATALAN_NOTE.scope)
      && SUN_CATALAN_NOTE.references.some((r) => /2609\.04176/.test(r) && /UNREFEREED/.test(r)),
  },
  {
    name: 'the false erratum is recorded as refuted, not asserted',
    check: () => SUN_CATALAN_NOTE.findings.some((f) => /CORRECT to all 39 printed digits/.test(f) && /refuted|spurious/i.test(f)),
  },
  {
    name: 'optimum δ₀ ratio ≈ 4× (0.03872 / 0.00966)',
    check: () => Math.abs(0.038723 / 0.00966243 - 4.0) < 0.05,
  },
]);

export default SUN_CATALAN_NOTE;
