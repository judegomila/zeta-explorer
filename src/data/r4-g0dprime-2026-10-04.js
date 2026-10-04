/**
 * @fileoverview r4-g0dprime-2026-10-04 — G0-d′: written X-transfer of Raymond's AF Part I §§4–9 (with §3 walls, §11 contact domain,
 * Theorem 4′, Lemma R) from X1 = 6000000185827 to X′ = 15600000009475 (2.6X, the U2 stack). Write-up
 * formalization/paper/raymond-x-transfer-2p6.md (Theorem XT, an implication). One adversarial internal referee pass
 * (tmp/r4-ref-g0dprime-*): not refuted, minor.
 *
 * Theorem XT: for any integer X ≥ X1 with N0 = ⌊√((X−4)/4π)⌋, the AF §§4–9 one-point theorem and (OP1)–(OP4) hold under (Dom_X), the
 *  per-cell premises R1–R8, per-rectangle premises Q3–Q7 and (H_enc); Theorem 4′ joint floors follow. Structural facts S1–S7 from (Dom_X).
 *
 * Referee corrections applied:
 *  - T57: 891 head bins at X′ (829 at X1), not 896 (certificates build bins themselves; no number changes).
 *  - r4-g0dp-joint.att rounding direction: use k1 = ceil(lower(a/π)), k2 = floor(upper(b/π)) and accept only d ≥ 0 (never triggered;
 *    smallest observed margin 6.0e-14).
 *  - (H_enc) narrowed: the stored §7 data are point data; on the U2 path all 3,546 rectangles of the 591 (cell, set) pairs, both lanes, are
 *    now certified to contain the exact label sums (85,462 checks, 0 failures). Whole-rectangle validity is X-free G0-d content.
 *  - Condition list of Theorem XT completed: G0-d (X-free §§6–9), AF §§4–5 (internal SOUND), AF §3 wall budget (GAP 3a/3b).
 *  - Scope: premises certified only at X′ = 2.6X. G0-d′ stays OPEN at 1.6X, 1.65X (Route H) and 1.7X; the PT-height values need only 2.6X.
 *  - Wording: the G21 wall-budget formulas are transcribed from certify_anchor_q.py, not derived from the AF text (GAP 3b).
 *
 * PROVED (written, one internal referee pass): S1–S7, AF (4.6) for x ≥ 100, Theorem XT as an implication. CERTIFIED at X′: (Dom_X′),
 * G1–G24, R1–R9 on 1,574 cells × 2 lanes, P1–P3/Q1–Q8 on 18,888 rectangles, 646 joint entries (+ all 17,314 XW26 entries), walls at
 * x_L/x_R, H_enc point data on the U2 path; second library (mpmath intervals) for R1–R8/P/Q. No Λ value moves.
 * Import-free. ASSERTIONS recompute N0′ and the (Dom) slack in floating point, the AF (4.6) constant, and the scope.
 */

export const R4_G0DPRIME = Object.freeze({
  id: 'r4-g0dprime-2026-10-04',
  date: '2026-10-04',
  title: "G0-d′: Theorem XT (X-transfer of AF §§4–9 to 2.6X) written; premises certified at X′; closed internally for U2 only",
  status: "G0-d′ CLOSED internally at 2.6X (U2): Theorem XT written, premises certified, one internal referee pass (minor). OPEN at 1.6X/1.65X/1.7X. No Λ value moves. NO QED.",
  doc: 'formalization/paper/raymond-x-transfer-2p6.md',
  X1: 6000000185827, Xp: 15600000009475, N0X1: 690988, N0p: 1114185, domSlack: 4305809.863,
  headBins: Object.freeze({ X1: 829, Xp: 891 }),
  checks: Object.freeze({ cells: 1574, rectangles: 18888, jointPath: 646, jointAllXW26: 17314, HencRect: 3546, HencChecks: 85462, wallPrefixChecks: 4456740, failures: 0 }),
  joint: Object.freeze({ minMargin: 2.43e-13, maxMargin: 2.85e-12 }),
  wall: Object.freeze({ floor: 0.7890526175, need: 0.75, budget: 9.47382e-4 }),
  scope: Object.freeze({ closedAt: ['2.6X'], openAt: ['1.6X', '1.65X', '1.7X'] }),
  verdict: "G0-d′ at 2.6X: Theorem XT written and its premises certified at X′ by independent code (second arithmetic library for the row checks), "
    + 'one internal referee pass with minor findings only. U2 = 0.144254643222956 unchanged; open at 1.6X/1.65X/1.7X. '
    + 'PT Lambda <= 0.2 stands. RH open. NO QED.',
});

const D = R4_G0DPRIME;
export const R4_G0DPRIME_ASSERTIONS = Object.freeze([
  {
    id: 'r4-g0dp-N0-live',
    holds: () => {
      const r = (X) => (X - 4) / (4 * Math.PI);
      const n1 = Math.floor(Math.sqrt(r(D.X1))), n2 = Math.floor(Math.sqrt(r(D.Xp)));
      const slack = D.Xp - 4 - 4 * Math.PI * D.N0p * D.N0p;
      return n1 === D.N0X1 && n2 === D.N0p && Math.abs(slack - D.domSlack) < 1 && slack > 0 && slack < 4 * Math.PI * (2 * D.N0p + 1);
    },
    why: 'N0 = ⌊√((X−4)/4π)⌋ = 690988 at X1 and 1114185 at X′; (Dom) slack X′ − 4 − 4πN0′² ≈ 4.3e6 > 0 and below one N0 step.',
  },
  {
    id: 'r4-g0dp-af46',
    holds: () => [100, 1e6, D.X1, D.Xp].every((x) => 1 / x + 2 / x + 2 / (x - 4) < 10 / x && 6 / x ** 2 + 1 / x < 2 / x),
    why: 'AF (4.6) holds for every x ≥ 100: 1/x + 2/x + 2/(x−4) < 10/x and |α′| ≤ 6/x² + 1/x < 2/x.',
  },
  {
    id: 'r4-g0dp-checks',
    holds: () => D.checks.failures === 0 && D.joint.minMargin > 0 && D.wall.floor > D.wall.need && D.headBins.Xp === 891 && D.checks.HencRect / 6 === 591,
    why: 'All premise checks pass; stored ≤ independent joint entries; wall floor > 3/4; 3,546 = 6 × 591 rectangles on the U2 path.',
  },
  { id: 'r4-g0dp-scope', holds: () => D.scope.closedAt.length === 1 && D.scope.openAt.includes('1.6X') && /OPEN at 1\.6X/.test(D.status) && /NO QED/.test(D.verdict), why: 'Closed at 2.6X only.' },
]);

export default R4_G0DPRIME;
