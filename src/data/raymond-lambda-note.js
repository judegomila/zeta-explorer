/**
 * @fileoverview RETRACTED (2026-09-22). This module formerly presented a "note to
 * Dale James Raymond" claiming a ~4× hardening of his de Bruijn–Newman bound
 * Λ < 0.149396 via re-optimizing a ratio ρ = S/B in a δ₀ = Λ_mid + 83/2400 − c_odd
 * − (4ρ−2ρ²) ledger. That attribution was WRONG and the note's premise is VOID.
 *
 * PRIMARY-SOURCE FINDING (grep of both actual deposits, 2026-09-22): the entire
 * δ₀ ledger — the 235-cell Λ_mid = 0.1763558379…, c_odd = 0.006276744728…, 83/2400,
 * 39/200 = 4ρ−2ρ², ρ = S/B = 1/20, δ₀ > 0.00966242652, and the ρ-optimization — is
 * verbatim in ZHI-WEI SUN's arXiv:2609.04176 "Catalan's constant is irrational"
 * (Prop 6.3, Prop 7.4, Theorem 9.1 / eqs (9.3)–(9.5)), in both the LaTeX source and
 * the PDF. There "Λ_mid" is a middle-prime integral of Sun's integerizer, NOT the
 * de Bruijn–Newman constant (the shared letter Λ is a notation coincidence).
 *
 * Raymond's Zenodo 22867547 (correlated translated probes; endpoint
 * 18674384228461/125000000000000 = 0.149395073827688) contains NONE of these
 * fingerprints (grep exit 1 across all five deposited files); his argument has no
 * S/B ratio and no δ₀ ledger. So:
 *   1. the "4× hardening of Raymond's margin" is a category error — Raymond has no ρ
 *      to optimize; and
 *   2. it is moot even as a Catalan result, because Sun's §9 is FLAWED (wrong-sign
 *      B²: the decisive quantity measures ≈ +1.86 B² — +0.474 B² after removing the
 *      2-adic waste — where the proof needs ≤ −0.0097 B²; three distinct §9 errors,
 *      no construction-class variant reaches a negative coefficient; confirmed by
 *      direct re-derivation from Sun's own equations). Catalan G irrationality OPEN.
 *
 * The 2026-09-21 "reattribution fix" (commit 59a189f30) that moved Sun's ledger
 * under Raymond's name was itself the error; the ORIGINAL attribution (to Sun) was
 * correct. The /raymond-lambda-note route is blanked (no redirect); the page and the
 * author-facing draft were removed. Raymond's Λ<0.149396 remains a genuine, separate,
 * unrefereed preprint on the Λ ladder (/lambda-bounds, /frontier-dag) — this note
 * never concerned it, and nothing is to be sent to him.
 *
 * No refereed bound is changed; RH and Catalan-G both OPEN.
 * Kept as a retraction record; unregistered from run-assertions; no heavy imports.
 */

export const RAYMOND_LAMBDA_NOTE_RETRACTION = Object.freeze({
  id: 'raymond-lambda-note-retracted',
  status: 'RETRACTED 2026-09-22 — misattributed Sun ledger; premise void; route blanked',
  ledgerBelongsTo: "Zhi-Wei Sun, arXiv:2609.04176 (Catalan), §6–9 / Theorem 9.1",
  notRaymond: 'Zenodo 22867547 contains none of the δ₀/c_odd/Λ_mid/83/2400/ρ=S/B fingerprints (grep exit 1)',
  whyVoid: [
    'Raymond has no ρ = S/B ratio, so "hardening his margin 4×" is a category error.',
    "Sun's §9 is flawed (wrong-sign B²), so the ρ-optimization is moot as a Catalan result too.",
    'commit 59a189f30 (Sun→Raymond reattribution) was the error; original Sun attribution was correct.',
  ],
  supersededBy: 'primary-source grep of tmp/sun-catalan/ (hits) vs tmp/raymond-22867547/ (none), 2026-09-22',
});

export default RAYMOND_LAMBDA_NOTE_RETRACTION;
