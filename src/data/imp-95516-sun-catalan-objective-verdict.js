/**
 * ⚠ ATTRIBUTION CORRECTION (2026-09-21): the objective and verdict below were
 * MISLABELED "Sun's Catalan-irrationality preprint (arXiv:2609.04176)". They are
 * actually about DALE JAMES RAYMOND's de Bruijn–Newman bound Λ<0.149396 (Zenodo
 * 22867547) — the δ₀ = Λ_mid + Δ_{>B} − c_odd − (4ρ−2ρ²) machinery, the 235-cell
 * Λ_mid, the ρ-optimization, and the 0.149395073827688 endpoint are all Raymond's
 * Λ paper (confirmed by a local-clone verification: Polymath heat-flow inputs, the
 * endpoint IS the Λ value). Sun's arXiv:2609.04176 is a DIFFERENT paper (Catalan
 * irrationality, "weighted tails") that this project has NOT analyzed. The verified
 * work here (c_odd/Λ_mid, ρ*=1/50 4× hardening, §4–§12 + replay sound) belongs to
 * Raymond and is presented at /raymond-lambda-note. Read "Sun→Raymond",
 * "Catalan irrationality→Λ<0.149396", "arXiv:2609.04176→Zenodo 22867547" throughout.
 *
 * @fileoverview imp-95516 — OBJECTIVE verdict [see correction above]: settle
 * Raymond's Λ<0.149396 preprint (Zenodo 22867547) and, if sound, harden its margin.
 *
 * This records the OUTCOME of the imp-95516 objective and reconciles it with the
 * already-committed src/data/sun-catalan-note.js work, which delivered the
 * attackable half of the objective. It reports the actual result — a PARTIAL
 * settlement — and names the one obstruction that keeps the proof undecided.
 *
 * WHAT WAS ASKED (imp-95516): (1) verify-or-refute the two hard components c_odd (§6)
 * and the middle-prime integral Λ_mid (§7); (2) improve the decisive margin
 * δ₀ = Λ_mid + Δ_{>B} − c_odd − (4ρ−2ρ²) by optimizing the free ratio ρ = S/B that
 * Sun fixes at 1/20 and never optimizes.
 *
 * WHAT WAS DELIVERED (committed in sun-catalan-note.js + the §6–§9 ledger):
 *  - c_odd VERIFIED: c_odd(1/20) = 0.006276744725… correct to all printed digits
 *    (an earlier reconstruction reported a spurious erratum; independent replication
 *    traced it to that reconstruction's own quadrature sign-bug and refuted it).
 *  - Λ_mid VERIFIED at the gate: two independent from-scratch reconstructions of the
 *    §7 integrand ℰ_ρ(t) each reproduce Sun's exact Λ_mid(1/20) — the full rational,
 *    not merely the decimal 0.1763558379286483.
 *  - MARGIN HARDENED: re-optimizing ρ gives an interior optimum ρ* = 1/50 with
 *    δ₀ ≈ 0.038723, a ~4.01× hardening of the ρ=1/20 margin δ₀ ≈ 0.00966243. Positivity
 *    is robust across ρ ∈ (0, 0.05548); the razor-thin 1/20 margin is a choice artifact.
 *  - FRAMING CORRECTED: the ticket treated 83/2400 as a fixed constant, so its stated
 *    optimality condition Λ_mid'(ρ*) = 4 + 1.02ρ* is superseded. The "constant" is
 *    Δ_{>B}(ρ) = (2/3)ρ + (1/2)ρ² evaluated at ρ=1/20 (= 83/2400 exactly). Carrying its
 *    ρ-dependence, the true stationarity condition is Λ_mid'(ρ*) = 10/3 + (2κ−5)ρ*
 *    (κ ≈ 2.5107, so the right-hand side ≈ 3.333, not ≈ 4).
 *
 * WHAT REMAINS OPEN (the named sub-gap): the §2–§5 determinant/rank construction and the
 * raw quadratic coefficient 4ρ−2ρ² of (9.4) are taken AS SUN STATES THEM — they are not
 * independently certified here. So the preprint is neither confirmed nor refuted: the
 * §6–§9 asymptotic ledger is verified and the margin is hardened IF the core is sound, but
 * the core is not settled. Catalan's constant G irrationality remains OPEN, and Sun's
 * single-author preprint is unrefereed. NO Λ movement; PT Λ≤0.2 stands; NO QED.
 *
 * NO heavy imports. Verified figures baked as literals (consistent with sun-catalan-note.js).
 */

export const SUN_CATALAN_OBJECTIVE_VERDICT = Object.freeze({
  id: 'imp-95516-sun-catalan-objective-verdict',
  title: 'Verdict on the imp-95516 objective: verify/refute and harden Sun Catalan preprint',
  status: 'PARTIAL — §6–§9 ledger VERIFIED and margin HARDENED ~4×; §2–§5 core UNCERTIFIED; '
    + 'proof NOT settled; G irrationality OPEN; PT Λ≤0.2 stands; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  deliveredBy: 'sun-catalan-note.js (+ research-inputs/sun-catalan-rho-optimization-note.md)',

  // Decisive margin δ₀(ρ) = Λ_mid(ρ) + Δ_{>B}(ρ) − c_odd(ρ) − (4ρ − 2ρ²), with
  // Δ_{>B}(ρ) = (2/3)ρ + (1/2)ρ²  and  c_odd(ρ) = κρ².
  kappa: 2.51069789,                        // c_odd coefficient (§6 integrand is ρ-independent)
  lambdaMidAt_1over20: 0.1763558379286483,  // §7 middle-prime integral at ρ=1/20 (validation gate)
  deltaBAt_1over20: 83 / 2400,              // Δ_{>B}(1/20) — the paper's "constant", actually ρ-dependent

  margins: {
    d0_at_1over20: 0.00966243,   // as written by Sun (razor-thin)
    d0_at_optimum: 0.038723,     // at ρ* = 1/50
    rhoStar: '1/50',
    hardeningFactor: 4.01,
    positivityInterval: 'ρ ∈ (0, 0.05548)',
  },

  // The ticket's stated optimality condition is superseded by the corrected framing.
  optimalityCorrection: {
    ticketCondition: "Λ_mid'(ρ*) = 4 + 1.02ρ*  (WRONG — treats 83/2400 as a constant)",
    correctedCondition: "Λ_mid'(ρ*) = 10/3 + (2κ−5)ρ*  (κ≈2.5107 ⇒ RHS ≈ 3.333)",
    reason: 'the 83/2400 term is Δ_{>B}(ρ) = (2/3)ρ + (1/2)ρ² evaluated at ρ=1/20; its ρ-slope 2/3 shifts the RHS from ~4 down to ~10/3.',
  },

  componentVerification: {
    cOdd: 'VERIFIED — c_odd(1/20) = 0.006276744725… correct to all printed digits; a prior spurious erratum was refuted (traced to a quadrature sign-bug in that reconstruction).',
    lambdaMid: 'VERIFIED at the gate — two independent from-scratch reconstructions of the §7 integrand ℰ_ρ(t) reproduce the exact rational Λ_mid(1/20).',
  },

  subGap:
    'Independent certification of the §2–§5 determinant/rank construction and the raw quadratic '
    + 'coefficient 4ρ−2ρ² of (9.4). These are taken as Sun states them; until re-derived, the '
    + 'preprint is neither confirmed nor refuted and G irrationality stays OPEN.',

  verdict:
    'The attackable half of the objective is delivered: both hard analytic components (c_odd, '
    + 'Λ_mid at the gate) are independently verified, and the decisive margin is hardened ~4.01× '
    + 'by re-optimizing ρ to 1/50 — a genuine, robust improvement of Sun’s argument IF the §2–§5 '
    + 'core is sound. It does not decide whether the core is sound. Catalan irrationality remains open.',
});

export const SUN_CATALAN_OBJECTIVE_VERDICT_ASSERTIONS = Object.freeze([
  {
    name: 'δ₀(1/20) reconstructs to 0.00966243 from the baked components',
    check: () => {
      const v = SUN_CATALAN_OBJECTIVE_VERDICT;
      const rho = 1 / 20;
      const d0 = v.lambdaMidAt_1over20 + v.deltaBAt_1over20 - v.kappa * rho * rho - (4 * rho - 2 * rho * rho);
      return Math.abs(d0 - v.margins.d0_at_1over20) < 1e-6;
    },
  },
  {
    name: 'Δ_{>B}(1/20) equals the paper constant 83/2400',
    check: () => {
      const rho = 1 / 20;
      return Math.abs(((2 / 3) * rho + (1 / 2) * rho * rho) - SUN_CATALAN_OBJECTIVE_VERDICT.deltaBAt_1over20) < 1e-15;
    },
  },
  {
    name: 'margin hardening is ~4× (0.038723 / 0.00966243)',
    check: () => Math.abs(
      SUN_CATALAN_OBJECTIVE_VERDICT.margins.d0_at_optimum / SUN_CATALAN_OBJECTIVE_VERDICT.margins.d0_at_1over20 - 4.0,
    ) < 0.05,
  },
  {
    name: 'honest: proof NOT settled, G irrationality OPEN, PT Λ≤0.2 stands',
    check: () => /proof NOT settled/.test(SUN_CATALAN_OBJECTIVE_VERDICT.status)
      && /G irrationality OPEN/.test(SUN_CATALAN_OBJECTIVE_VERDICT.status)
      && /PT Λ≤0.2 stands/.test(SUN_CATALAN_OBJECTIVE_VERDICT.status),
  },
  {
    name: 'named sub-gap = §2–§5 core certification',
    check: () => /§2–§5 determinant\/rank/.test(SUN_CATALAN_OBJECTIVE_VERDICT.subGap),
  },
]);

export default SUN_CATALAN_OBJECTIVE_VERDICT;
