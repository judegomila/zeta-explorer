// Canonical, honest "state of the program" facts. Single source of truth for
// both StateOfProgramPage (full page) and DashboardPage (compact summary card),
// so the top-line status cannot drift between the two surfaces.
//
// Reconciled 2026-11-20 against src/data/program-status-current.js (which names
// the source file of each statement). The first three entries below were added
// then; the remaining entries date from the 2026-08-24 and 2026-09-30
// reconciliations and are kept, with superseded wording corrected:
//   CONDITIONAL   = Lambda <= 0.116091488672439, conditional on the 7/8 half-plane
//                   and Raymond's chain (both unrefereed), PT height, internal certificates
//   UNCONFIRMED   = route-P value 0.144997328111268 (0 of 36 floors re-certified)
//   THIRD-PARTY CLAIM = Lambda <= 0.107964910079 (D. J. Raymond), replayed and
//                   partially refereed here, not verified
// Earlier summary (2026-08-24):
//   PEER-REVIEWED = Platt-Trudgian Lambda <= 0.2 (NOT this program)
//   PUBLIC CLAIM  = Lambda <= 0.1875 certificate package, locally repaired,
//                   listed publicly but unrefereed
//   POSTED CANDIDATE = Lambda <= 0.1787854, a computer-assisted candidate for
//                       an unconditional proof; reviewed by Dan Romik and
//                       publicly posted; bound not established,
//                       not refereed, and not RH
//   SHARPER CANDIDATE = Lambda <= 0.1758354 (four Arb gates; y-transfer
//                       reduction and Lemma B3 Lean-checked), below 0.1787854; unrefereed, not established,
//                       does not displace PT, not RH
//   CONTRACT      = Lambda <= 0.14 completion contract (fail-closed; a contract,
//                   not a bound), reduced to one open family on /permutation-architecture
//   ESTIMATE      = finite-N* = 1e4 modeled figure, gated on the undischargeable C_H
//   CORRECTED     = bare Volterra equivalence refuted; exact signed positivity remains open
//   REFUTED       = the thin-strip sub-RH shortcut is a dead artifact (imp-2630)
//   OPEN-HARD     = C_H / G6a is the confirmed wall for Dyson/collision routes;
//                   the known discharge routes are closed, so it is not a live lever
//
// Intentionally has NO imports so it stays light and never drags in the
// 16.7MB zeros bundle through a page import.

export const STATE_OF_PROGRAM_SUMMARY_DATE = '2026-11-20';

export const STATE_OF_PROGRAM_TRUTHS = [
  {
    badge: 'CONDITIONAL',
    color: '#fb923c',
    title: 'Λ ≤ 0.116091488672439, conditional on three inputs that are not established',
    body:
      'The value 116091488672439/10¹⁵ holds if ζ(s) ≠ 0 for Re s > 7/8 (openai/math family 003; Lean proof rebuilt ' +
      'locally with standard axioms only; not peer reviewed) and D. J. Raymond’s decreasing-barrier chain (Zenodo ' +
      '10.5281/zenodo.22867547; unrefereed) both hold, together with the Platt-Trudgian verified height 3000175332800 ' +
      'and this project’s internal floor and kernel certificates, which are a third input that is not established: ' +
      'they are internal and partly uncertified (89 of 468 floor entries rest on a measured allowance of 0.0023). ' +
      'Without the internal certificates the same argument ' +
      'gives 0.118505710922701. It is the smallest value recorded in this project and it is not an established bound. ' +
      'Draft of 9 October 2026; not submitted, not peer reviewed.',
    route: '/lambda-0116091',
    routeLabel: 'The conditional value, its four inputs and the Lean status',
  },
  {
    badge: 'UNCONFIRMED',
    color: '#fbbf24',
    title: 'The route-P value 0.144997 is unconfirmed below 0.145',
    body:
      'Route P recorded 0.144997328111268, conditional on Raymond’s chain and the internal route-P ledger. It uses 369 ' +
      'floors, 36 of them on incomplete covers. An independent re-certification (2026-11-16/17) confirmed 0 of those ' +
      '36; with the 36 excluded the same computation returns 0.145135157752420. The re-certification record has no ' +
      'referee pass.',
  },
  {
    badge: 'THIRD-PARTY CLAIM',
    color: '#38bdf8',
    title: 'D. J. Raymond claims Λ ≤ 0.107964910079 — replayed and partially refereed here, not verified',
    body:
      'This is a third-party manuscript, not a result of this project, and it depends on the unrefereed half-plane ' +
      'Re s > 7/8. The author’s exact-rational checker was replayed in full (15 stages) and the stage that fixes the ' +
      'final fraction was re-implemented independently (221,010 arcs, 0 failures). Proposition 3.2 of the manuscript ' +
      'is not proved in the paper, and each analytic part had one internal reading only (report of 2026-11-17).',
  },
  {
    badge: 'DIRECT ATTEMPTS',
    color: '#f87171',
    title: 'Every direct attempt at RH recorded here failed; the failures are collected in one obstruction map',
    body:
      'Fifteen written attempts (three rounds, 2026-11-01) each failed under an internal referee. A push of ' +
      '2026-11-16/17 ran 196 lanes; none scores above 0 of 4 on the campaign’s requirements for a mechanism outside the ' +
      '7/8 method. The obstruction map lists, for each route, where it stops and which of seven control functions ' +
      '(Davenport-Heilbronn, backward heat family, two sign twists, ζ(s+a)ζ(s−a), the T-NR twin, Beurling zeta) ' +
      'defeats it. Common finding: positivity and support of the von Mangoldt function with the functional equation ' +
      'do not suffice; a proof must use multiplicativity in an essential step.',
  },
  {
    badge: 'RESEARCH PRIORITY', color: '#22d3ee',
    title: 'Direction audit of 2026-09-30: prioritize exact arithmetic positivity for direct RH work',
    body: 'The twin-ladder / Weil / Toeplitz–Krein direction has an exact criterion and independently replayable finite-support certificates. All-support pole-free positivity already suffices for RH; it needs neither a separate pole-inclusive bridge nor a uniform positive margin. Extending the exact arithmetic form to unbounded supports remains open. No new Λ bound follows.',
    route: '/what-we-know', routeLabel: 'September 30 direction audit and corrected claims',
  },
  {
    badge: 'PEER-REVIEWED BENCHMARK',
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
    badge: 'UNREVIEWED CANDIDATE',
    color: '#22d3ee',
    title: 'The standalone review repository presents Λ ≤ 0.1787854 as a computer-assisted candidate for an unconditional proof — reviewed by Dan Romik, unrefereed',
    body:
      'Standalone tag review-01787854-v3 at commit 2e9976c4becbf97e31c56fe75fce07cdff5dd4ea packages claimed certificates for a compact slab, a final-time zero-free half-strip, ' +
      'a fresh replay of all 3,149,013 finite rows, corrected 10.50 finite and tail error bounds, and an exact Polymath ' +
      'criterion weld. These ingredients form a computer-assisted candidate for an unconditional proof. It has been ' +
      'reviewed by Dan Romik and is publicly posted (judegomila.com/posts/riemann-lambda-0.1787854). The bound is not established and has not been peer ' +
      'reviewed — an individual review is not refereeing. It is not a proof of RH, which requires Λ ≤ 0.',
  },
  {
    badge: 'SHARPER CANDIDATE',
    color: '#22d3ee',
    title: 'A computer-assisted candidate for an unconditional bound reaches Λ ≤ 0.1758354, below the 0.1787854 candidate',
    body:
      'A revised mollifier and an extended finite lane certify four independent gates — each machine-checked in Arb interval ' +
      'arithmetic, with the y-transfer reduction and Lemma B3 Lean-checked — for a de Bruijn–Newman bound Λ ≤ 0.1758354, below the earlier ' +
      '0.1787854 candidate. Since 2026-10-09 a smaller value, 0.116091488672439, is recorded, conditional on three inputs that are not established (first entry). Neither the Arb gates nor the Lean-checked ' +
      'components are a referee: the pipeline has not been independently audited end to end, the bound is not established, and it ' +
      'does not displace Platt-Trudgian Λ ≤ 0.2. It is not a proof of RH, which requires Λ ≤ 0.',
  },
  {
    badge: 'CONTRACT',
    color: '#fb923c',
    title: 'Λ ≤ 0.14 is a fail-closed completion contract, not a bound',
    body:
      'The permutation-architecture route states t0 + y0²/2 = 7/50 = 0.14 as a completion contract: the value follows ' +
      'only if three zero-free statements hold, and the construction fails closed otherwise. Two statements are closed ' +
      'within scope (the Platt-Trudgian verified height supplies one; a rational intermediate box closes another). The ' +
      'route reduces to ONE open family — a uniform correlated lower-edge enclosure |C_E,17| < 0.2796881955526147 on ' +
      '690988 ≤ N ≤ 54799999 — with the [B_v,Π_p] noncommuting weld as the decisive object. No Λ ≤ 0.14 bound is ' +
      'claimed or promoted.',
    route: '/permutation-architecture',
    routeLabel: 'Permutation architecture: the contract and its one open family',
  },
  {
    badge: 'ESTIMATE',
    color: '#fbbf24',
    title: 'The finite-N*=1e4 beat is an ESTIMATE, gated on the undischargeable C_H',
    body:
      'The headline finite-N* = 1e4 "beat" is numerical, not a rigorous bound. It rests on a collision-energy ' +
      'constant C_H whose discharge is open: the obvious Gronwall approach is REFUTED (imp-2640, the integral ' +
      'diverges at the collision), and the projected t_c is OLS, not rigorous (imp-2632). Read it as ' +
      'rigorous-modulo-C_H, never as an unconditional finite-N beat.',
  },
  {
    badge: 'CORRECTED',
    color: '#a78bfa',
    title: 'The bare Volterra collapse is refuted; exact signed positivity remains open',
    body: 'A small bare Volterra norm is not an RH certificate. For a finite matrix K=P+S with P>0, the exact condition is I+P^(-1/2) S P^(-1/2)>=0. A norm bound of 1 is sufficient but not necessary for a general signed residual. The continuum diagonal has zero product measure, so a positive comparison kernel requires a separate derivation.',
  },
  {
    badge: 'REFUTED',
    color: '#f87171',
    title: 'No shortcut below RH — the thin-strip beat is a dead artifact',
    body:
      'The one route that once looked like a sub-RH shortcut — the thin-strip E_trunc / κ_T beat — is a frozen-κ ' +
      'height-mismatch artifact and is structurally dead (imp-2630): κ_T was frozen at T0=3000 but multiplied against ' +
      'T0=1e13; the height-consistent value grows with height and never drops below 0.2 within that calculation. This refutes the stated shortcut, not every possible route to RH.',
  },
  {
    badge: 'OPEN-HARD',
    color: '#22d3ee',
    title: 'C_H / G6a is the confirmed wall for the Dyson/collision route family — not a live lever',
    body:
      'The established Dyson/collision compositions funnel into the C_H / G6a Hölder-½ shock modulus ' +
      '(Step-4 bridge / Polymath15). The wall is RH-HARD-CONFIRMED and the known discharge routes are closed: the ' +
      'Gronwall approach diverges at the collision (imp-2640), C_H is equivalent to a uniform all-height minimal-gap ' +
      'lower bound (imp-35147), and re-architecting the metric relocates but does not remove the multi-body isolation ' +
      'term. An N-uniform C_H bound is therefore graded RH-hard — consistent with the no-shortcut finding above, it is ' +
      'not a pending upgrade path, and the finite-N* figure stays an estimate. ' +
      'The separate fixed-height 0.1787854 candidate package does not consume C_H and does not close this older route. ' +
      'The exact global Twin Ladder residual inequality remains equivalent to RH rather than a strict reduction.',
    route: '/what-we-know',
    routeLabel: 'What we know: the wall and no-go landscape',
  },
];

