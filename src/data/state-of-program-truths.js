// Canonical, honest "state of the program" facts. Single source of truth for
// both StateOfProgramPage (full page) and DashboardPage (compact summary card),
// so the top-line status cannot drift between the two surfaces.
//
// Facts mirror the full route map and the fixed-height candidate review package
// (status reconciliation, 2026-07-23):
//   PEER-REVIEWED = Platt-Trudgian Lambda <= 0.2 (NOT this program)
//   PUBLIC CLAIM  = Lambda <= 0.1875 certificate package, locally repaired,
//                   listed publicly but unrefereed
//   LOCAL CANDIDATE = Lambda <= 0.1787854, independent review open
//   ESTIMATE      = finite-N* = 1e4 modeled figure, gated on the undischargeable C_H
//   RH-EQUIVALENT = Volterra ||V|| <= 1 collapse (a rename, not a reduction)
//   REFUTED       = the thin-strip sub-RH shortcut is a dead artifact (imp-2630)
//   OPEN-HARD     = C_H / G6a remains the wall for Dyson/collision routes
//
// Intentionally has NO imports so it stays light and never drags in the
// 16.7MB zeros bundle through a page import.

export const STATE_OF_PROGRAM_SUMMARY_DATE = '2026-07-23';

export const STATE_OF_PROGRAM_TRUTHS = [
  {
    badge: 'RIGOROUS SOTA',
    color: '#34d399',
    title: 'The peer-reviewed upper-bound benchmark is Platt-Trudgian Λ ≤ 0.2 — and the project did NOT produce it',
    body:
      'Platt-Trudgian Λ ≤ 0.2 remains the peer-reviewed literature benchmark, together with Rodgers-Tao Λ ≥ 0 ' +
      'on the lower side. Both are cited results, not outputs of this program. Newer public and local certificate ' +
      'packages are graded separately below because they have not undergone peer review.',
  },
  {
    badge: 'PUBLIC PREPRINT',
    color: '#38bdf8',
    title: 'A public certificate package claims Λ ≤ 3/16 = 0.1875 — reproducible, listed, and unrefereed',
    body:
      'The July 2026 Zenodo package is now listed in the Optimization Problems ledger. A local forensic audit found ' +
      'one omitted finite sweep and reconstructed the needed 2,054,013-row tile. That makes 0.1875 the strongest ' +
      'located public, locally repaired preprint claim—not a peer-reviewed theorem or an endorsement by the ledger.',
  },
  {
    badge: 'LOCAL CANDIDATE',
    color: '#f59e0b',
    title: 'A fixed-height package proposes Λ ≤ 0.1787854 — independent review is open',
    body:
      'The finite sweep, direct-Dini monotonicity, normalizer/correction, effective-error, tail, and exact-assembly ' +
      'checks pass in the pinned local package. It is not yet rigorous or published: the native Triangle-to-|f_t| ' +
      'identification and inherited winding, site, effective-approximation, and criterion interfaces are load-bearing ' +
      'review obligations. Passing scripts do not promote it to a theorem or SOTA.',
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
    title: 'No shortcut below RH — the thin-strip beat is a dead artifact',
    body:
      'The one route that once looked like a sub-RH shortcut — the thin-strip E_trunc / κ_T beat — is a frozen-κ ' +
      'height-mismatch artifact and is structurally dead (imp-2630): κ_T was frozen at T0=3000 but multiplied against ' +
      'T0=1e13; the height-consistent value grows with height and never drops below 0.2 at scale. The §15-27 Volterra ' +
      '‖V‖ ≤ 1 collapse is a faithful reformulation of RH, not a reduction below it. Net: there is no shortcut below ' +
      'RH anywhere in the map.',
  },
  {
    badge: 'OPEN-HARD',
    color: '#22d3ee',
    title: 'C_H / G6a remains the main wall for the Dyson/collision route family',
    body:
      'The established Dyson/collision compositions funnel into the C_H / G6a Hölder-½ shock modulus ' +
      '(Step-4 bridge / Polymath15). An N-uniform bound would upgrade their finite estimate and asymptotic target. ' +
      'The separate fixed-height 0.1787854 candidate does not consume C_H, but it has its own unresolved native-binding, ' +
      'winding, interval-independence, tail, and criterion obligations. No route is presently an accepted project beat.',
  },
];
