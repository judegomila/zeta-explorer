/**
 * @fileoverview r5-l1l5-2026-10-05 — written proofs of the wol-pd lemmas L1–L5 and Theorem 6.1 (formalization/paper/wol-pd-lemmas.md) with
 * an Arb spot-check (formalization/paper/verify_wol_pd_lemmas.py). One adversarial internal referee pass (tmp/r5-ref-l1l5-*): not refuted, minor.
 *
 * Content: L1 formal identities in C[[z]] and Fourier form (needs c_1 zero-free on the closed S-polydisc); L2 log-positivity via a finite
 *  cluster expansion (b_n ≥ 0 and n^{tL/4} b_n nondecreasing for n ≤ N0; false for n > N0, b_{2p} < 0); L3 cosine majorant and grid lemmas;
 *  L4 extra part, |c_1| lower bounds, weak duality from the + probe for EVEN f_q, region ladder; L5 coefficient identities, tail bounds,
 *  weighted norms, head-subtracted far tail (log version needs X ≥ e^{1/δ}). Theorem 6.1: engine bounds (H1)–(H5) ⇒ sup Φ_E ≤ U ⇒ WOL-C
 *  with margin U − K0*, Lemma 1 admits the floor.
 *
 * Referee corrections applied:
 *  - Theorem 6.1 (H2) misstated: M_m^up needs a LOWER bound κ_m^lo (two-sided enclosures κ^lo ≤ κ ≤ κ^hi); the engine already uses
 *    Mup = −k_lo + Mlab, so the implication holds once (H2) is corrected. Xi_1 ≥ Σ_q max f_q comes from Lemma 3.3(a).
 *  - Lemma 4.4 needs f_q even (counterexample without it, S = {2}); the spot-check cannot detect a violation of this clause.
 *  - §7.3 comparison values belong to the second time sub-cell; corrected values K0 0.286772, labels 0.087883, extra 0.002788.
 *  - r4 and r2 label binning coincide for every label (P5 184,262 labels, P47 95,905 labels): Φ_E is the same function in both engines.
 *  - Mutation tests (5 of 6 detected) reproduced on the current script; check B wording (P47 h down to 0.6336; sign/monotonicity are h-free).
 *
 * PROVED (written, refereed internally, minor fixes): L1–L5; Theorem 6.1 with (H2) corrected. CERTIFIED: spot-check 645,185 checks, 0
 * failures (ball arithmetic at sample parameters, not part of a proof); referee independent re-checks 195,965, 0 failures; 24 random
 * certificates re-run at a different grid: all admissible, margins 0.00055–0.00164 lower. CONDITIONAL: correctness of the engine bounds
 * (H1)–(H5) (single implementation, now with a second implementation for 75 floors, see r5-core-audit). No Λ value moves by this task.
 * Import-free. ASSERTIONS check the lemma list, the counts and the grades.
 */

export const R5_L1L5 = Object.freeze({
  id: 'r5-l1l5-2026-10-05',
  date: '2026-10-05',
  title: 'wol-pd lemmas L1–L5 and Theorem 6.1 written (formalization/paper/wol-pd-lemmas.md); internal referee: proved, minor fixes',
  status: 'PROVED as written (project-internal), one internal adversarial referee pass (minor: Theorem 6.1 (H2) needs two-sided κ enclosures). No external reader. NO QED.',
  lemmas: Object.freeze(['L1 formal identities + Fourier form', 'L2 log-positivity (cluster expansion)', 'L3 cosine majorant + grid lemmas',
    'L4 extra part, |c_1| bounds, + probe duality (f_q even), region ladder', 'L5 tails, weighted norms, far tail', 'Theorem 6.1 (engine bounds ⇒ WOL-C)']),
  files: Object.freeze(['formalization/paper/wol-pd-lemmas.md', 'formalization/paper/verify_wol_pd_lemmas.py']),
  spotCheck: Object.freeze({ checks: 645185, failures: 0, seconds: 17, mb: 98 }),
  refereeChecks: Object.freeze({ independent: 195965, failures: 0, mutationsDetected: [5, 6], rerunEntries: 24, rerunAllAdmissible: true, rerunMarginLower: [0.00055, 0.00164] }),
  counterexampleAboveN0: Object.freeze({ p: 345511, b2p: -2.500882e-8 }),
  corrections: Object.freeze(['Theorem 6.1 (H2): two-sided κ enclosures; M^up uses κ^lo', 'Lemma 4.4 requires f_q even', '§7.3 values of the first sub-cell', '§8 provenance of the mutation tests']),
  verdict: 'The wol-pd lemmas L1-L5 have written proofs, internally refereed (minor fixes); Theorem 6.1 holds with (H2) corrected to two-sided '
    + 'kappa enclosures, reducing each wol-pd certificate to the correctness of the engine bounds (H1)-(H5), which are certified, not proved. '
    + 'No Lambda value moves. No refereed bound is changed. RH open. NO QED.',
});

const W = R5_L1L5;
export const R5_L1L5_ASSERTIONS = Object.freeze([
  {
    id: 'r5-l1l5-content',
    holds: () => W.lemmas.length === 6 && W.spotCheck.failures === 0 && W.refereeChecks.failures === 0 && W.refereeChecks.mutationsDetected[0] < W.refereeChecks.mutationsDetected[1]
      && W.counterexampleAboveN0.b2p < 0 && W.counterexampleAboveN0.p > 690988 / 2 && W.counterexampleAboveN0.p <= 690988,
    why: 'Five lemmas + Theorem 6.1; spot-check and referee checks with 0 failures; one mutation (non-even f_q) undetected; b_{2p} < 0 for N0/2 < p ≤ N0.',
  },
  {
    id: 'r5-l1l5-honest',
    holds: () => /project-internal/.test(W.status) && /\(H2\)/.test(W.status) && /certified, not proved/.test(W.verdict) && /NO QED/.test(W.verdict) && /refereed bound is changed/i.test(W.verdict),
    why: 'Proved as written internally; engine bounds certified only; no external reader; no QED.',
  },
]);

export default R5_L1L5;
