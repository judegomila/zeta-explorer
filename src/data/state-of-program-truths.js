// Canonical, honest "state of the program" facts. Single source of truth for
// both StateOfProgramPage (full page) and DashboardPage (compact summary card),
// so the top-line status cannot drift between the two surfaces.
//
// Facts mirror the full route map (full-route-map workflow, 2026-06-19):
//   RIGOROUS SOTA = Platt-Trudgian Lambda <= 0.2 (NOT this program)
//   ESTIMATE      = finite-N* = 1e4 beat, gated on the undischargeable C_H
//   RH-EQUIVALENT = Volterra ||V|| <= 1 collapse (a rename, not a reduction)
//   REFUTED       = six caught overclaims, withdrawn
//   OPEN-HARD     = C_H / G6a is the #1 genuine wall
//
// Intentionally has NO imports so it stays light and never drags in the
// 16.7MB zeros bundle through a page import.

export const STATE_OF_PROGRAM_SUMMARY_DATE = '2026-06-19';

export const STATE_OF_PROGRAM_TRUTHS = [
  {
    badge: 'RIGOROUS SOTA',
    color: '#34d399',
    title: 'The rigorous floor is Platt-Trudgian Λ ≤ 0.2 — and the project did NOT produce it',
    body:
      'The best unconditional de Bruijn-Newman upper bound the field has is Platt-Trudgian (Λ ≤ 0.2), ' +
      'together with Rodgers-Tao (Λ ≥ 0) on the lower side. Both are cited results, not outputs of this program. ' +
      'Everything below is either an estimate, a faithful RH reformulation, or a wall.',
  },
  {
    badge: 'ESTIMATE',
    color: '#fbbf24',
    title: 'The finite-N*=1e4 beat is an ESTIMATE, gated on the undischargeable C_H',
    body:
      'The headline finite-N* = 1e4 "beat" is numerical, not a rigorous bound. It rests on a collision-energy ' +
      'constant C_H whose discharge is open: the obvious Gronwall attack is REFUTED (imp-2640, the integral ' +
      'diverges at the collision), and the projected t_c is OLS, not rigorous (imp-2632). Read it as ' +
      'rigorous-modulo-C_H, never as an unconditional finite-N beat.',
  },
  {
    badge: 'RH-EQUIVALENT',
    color: '#a78bfa',
    title: 'The Volterra ‖V‖ ≤ 1 collapse is RH-EQUIVALENT, not a reduction',
    body:
      'The §15-27 collapse to a single statement ‖V‖ ≤ 1 is a faithful reformulation of RH — it renames RH, it ' +
      'does not reduce it. The much-cited ~5000× empirical margin was a homogeneity artifact, not slack against a ' +
      'real bound. Proving it would be proving RH; the same is true of Beurling-Nyman, de Branges, Connes-Weil, ' +
      'and the normalized-R / Conj-26.3 target.',
  },
  {
    badge: 'REFUTED',
    color: '#f87171',
    title: 'Six overclaims were caught and withdrawn',
    body:
      'Honesty audit (route map, 2026-06-19) withdrew the caught overclaims, including: thin-strip E_trunc / κ_T ' +
      '(frozen-κ height-mismatch artifact, imp-2630), the Soundararajan-Tao 2024 PHANTOM citation (wrong object), ' +
      'the Goldston-Gonek fabricated citation, and reading the Volterra collapse as a reduction. The DAG node that ' +
      'still labels the finite-1e4 beat "rigorous unconditional" is the one stale view flagged for reconciliation.',
  },
  {
    badge: 'OPEN-HARD',
    color: '#22d3ee',
    title: 'C_H / G6a is the #1 genuine wall',
    body:
      'Every route that could deliver an actual Λ number short of RH funnels into ONE object: the C_H / G6a ' +
      'Hölder-½ shock modulus (Step-4 bridge / Polymath15). An N-uniform bound on it would make the finite beat ' +
      'rigorous AND compose Route B into Λ → 0. It is a concrete analytic estimate on a specific PDE shock — not a ' +
      'rename of RH — but it is RH-hard at the modulus, and the naive Gronwall discharge is refuted.',
  },
];
