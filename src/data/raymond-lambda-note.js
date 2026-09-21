/**
 * @fileoverview Public presentation of the note to Dale James Raymond on his
 * de Bruijn–Newman bound Λ < 0.149396 ("Correlated translated probes…",
 * Zenodo 22867547). Our contribution is a parameter optimization (ρ = S/B) that
 * hardens his decisive margin δ₀ ~4×, independently replicated within the §6–§9
 * ledger; plus an independent end-to-end soundness verification (§4–§12 + the
 * replay reproduced bit-for-bit). It does NOT constitute peer review, and it does
 * NOT lower the accepted bound: Platt–Trudgian Λ ≤ 0.2 remains the rigorous SOTA
 * and RH is untouched. Raymond's preprint is unrefereed.
 *
 * NOTE ON NAMING (2026-09-21 correction): this note was briefly mislabeled
 * "sun-catalan-note". It is NOT about Zhi-Wei Sun's Catalan-irrationality preprint
 * (arXiv:2609.04176) — that is a different author and a different problem. This is
 * Raymond's Λ-bound paper. The genuine χ₄ Catalan work lives at /catalan-signed-ladder.
 *
 * NO heavy imports. Source-of-truth prose: research-inputs/raymond-lambda-0149396-rho-optimization-note.md.
 */

export const RAYMOND_LAMBDA_NOTE = Object.freeze({
  id: 'raymond-lambda-note',
  title: 'A parameter optimization that strengthens Raymond’s Λ < 0.149396 margin',
  reviewHold:
    '⚠ HOLD — DO NOT SEND (2026-09-21). The δ₀ = Λ_mid + 83/2400 − c_odd − (4ρ−2ρ²) ledger this note '
    + 'optimizes shares the IDENTICAL c_odd (0.006277), 235-cell Λ_mid (0.176356), and ρ=1/20 with '
    + 'Zhi-Wei Sun’s Catalan-irrationality preprint (arXiv:2609.04176) — which an independent re-analysis '
    + 'found LIKELY-FLAWED (wrong-sign B² coefficient: the decisive quantity measures ≈+1.86B² where the '
    + 'proof needs ≤−0.0097B², independently replicated + matching the community Lean project). Two '
    + 'verification agents placed this same ledger in DIFFERENT papers (Raymond=sound vs Sun=flawed) — an '
    + 'unresolved contradiction. Until a decisive side-by-side cross-check settles whether the ρ-optimization '
    + 'rests on Raymond’s sound base or Sun’s flawed one, treat the "4× hardening" as UNDER REVIEW, not '
    + 'established, and do not send this note. PT Λ≤0.2 stands; RH open; NO QED.',
  status: '⚠ UNDER REVIEW / HOLD — δ₀ base overlaps a likely-flawed Sun ledger; CONTRIBUTION to an UNREFEREED preprint; does NOT lower the accepted bound; PT Λ≤0.2 stands',
  oneLine:
    'Dale James Raymond’s preprint (Zenodo 22867547) proves the de Bruijn–Newman '
    + 'bound Λ < 0.149396. Its decisive margin δ₀ can be hardened ~4× by re-optimizing '
    + 'one free ratio ρ = S/B that the paper never optimizes — from δ₀≈0.00966 at ρ=1/20 '
    + 'to ≈0.03872 at ρ*=1/50. (Numerically below this project’s own unreviewed candidates, '
    + 'and inside the independently-derived Route VII floor band [0.145, 0.150].)',

  scope:
    'We verify and optimize the asymptotic ledger of §6–§9, and independently confirm '
    + 'the analytic core: §4.1 (the −1≤σ≤2 Polymath15 remainder extension) checks out '
    + 'line-by-line vs Polymath15 §6, and §6–§12 + the certificate replay reproduce '
    + '(exact layers bit-for-bit; kernel Bernstein certificates and an independent-library '
    + 'ODE match). The remaining unverified surfaces are the full Arb-lane rerun (mechanical), '
    + 'the §3 physical-error constants, formalization, and external peer review. This is NOT '
    + 'peer review and does NOT lower the accepted bound; Platt–Trudgian Λ ≤ 0.2 stands.',

  gate:
    'Validation gate: two independent from-scratch reconstructions of the §7 integrand '
    + 'ℰ_ρ(t) each reproduce Raymond’s exact value of Λ_mid at ρ=1/20 — the full 235-cell '
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
    'Raymond’s c_odd(1/20) = 0.006276744728… is CORRECT to all 39 printed digits (an earlier reconstruction reported a spurious erratum; independent replication traced it to that reconstruction’s own quadrature sign-bug and refuted it).',
    'End-to-end soundness (independent): §4.1 σ-range extension verified vs Polymath15 §6; §6–§12 sound; the replay is a genuine positivity proof (not sampling) and its exact layers reproduce bit-for-bit, with independent-library agreement on the ODE endpoint 18674384228461/125000000000000.',
  ],

  verdict:
    'A free ~4× hardening of Raymond’s decisive margin, independently replicated within his '
    + '§6–§9 ledger, together with an independent end-to-end soundness check of the analytic '
    + 'core + certificate. This strengthens and de-risks the preprint; it is not peer review, '
    + 'does not lower the accepted bound, and Λ < 0.149396 remains an unrefereed preprint. '
    + 'Platt–Trudgian Λ ≤ 0.2 stands; RH open.',

  noteFile: 'research-inputs/raymond-lambda-0149396-rho-optimization-note.md',
  preprint: 'Zenodo 22867547 (DOI 10.5281/zenodo.22867547)',

  references: [
    'Dale James Raymond, "Correlated translated probes and the bound Λ < 0.149396 for the de Bruijn–Newman constant", Zenodo 22867547 (2026) — UNREFEREED preprint.',
    'Polymath15 (D. H. J. Polymath, incl. T. Tao), Effective approximation of heat flow evolution of the Riemann ξ function…, arXiv:1904.12438 (2019).',
    'D. J. Platt, T. S. Trudgian, The Riemann hypothesis is true up to 3·10¹², Bull. LMS 2021.',
  ],
});

export const RAYMOND_LAMBDA_NOTE_ASSERTIONS = Object.freeze([
  {
    name: 'scope: not peer review, does not lower the accepted bound',
    check: () => /NOT peer review|does not lower the accepted bound|remains an unrefereed preprint/i.test(
      RAYMOND_LAMBDA_NOTE.scope + RAYMOND_LAMBDA_NOTE.verdict),
  },
  {
    name: 'PT Λ≤0.2 stated as the SOTA benchmark',
    check: () => /Platt–Trudgian Λ ≤ 0.2 (stands|remains)/i.test(RAYMOND_LAMBDA_NOTE.scope + RAYMOND_LAMBDA_NOTE.verdict),
  },
  {
    name: 'correctly attributed to Raymond / Zenodo 22867547 (not Sun/Catalan)',
    check: () => /Raymond/.test(RAYMOND_LAMBDA_NOTE.title)
      && RAYMOND_LAMBDA_NOTE.references.some((r) => /Raymond/.test(r) && /22867547/.test(r))
      && !/arXiv:2609\.04176/.test(RAYMOND_LAMBDA_NOTE.preprint),
  },
  {
    name: 'the false erratum is recorded as refuted, not asserted',
    check: () => RAYMOND_LAMBDA_NOTE.findings.some((f) => /CORRECT to all 39 printed digits/.test(f) && /refuted|spurious/i.test(f)),
  },
  {
    name: 'optimum δ₀ ratio ≈ 4× (0.03872 / 0.00966)',
    check: () => Math.abs(0.038723 / 0.00966243 - 4.0) < 0.05,
  },
]);

export default RAYMOND_LAMBDA_NOTE;
