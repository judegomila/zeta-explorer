/**
 * @module imp-96969-coupled-nt-truncation-wall-cohort-index
 * @fileoverview imp-96969 -- META cross-reference index note grouping the Route C-direct
 *   bounded-resolvent / Krein t-truncation cohort (imp-96827, imp-96889, imp-96911, imp-96935,
 *   imp-96938) as a single closed-lever family, so future work does not re-attempt the levers
 *   this cohort already ruled out. Index/meta only; establishes nothing new; changes no bound;
 *   NO QED.
 *
 *   THE COHORT (chronological). All five scout the same object: whether the shift-invert
 *   resolvent R=(K+m)^{-1} reformulation of the Route C-direct Kato-Temple / Lehmann-Goerisch
 *   attack on lambda_1(T_a[sigma_2]) at the binding 2a=ln3 can be pushed to a certified positive
 *   floor, and what stops it.
 *     imp-96827 -- models the DIRECT (non-shift-invert) t-truncation residual of the 2a=ln3
 *       Krein floor at fixed N as a decaying-in-T sequence; the residual beyond T=4800 is
 *       BOUNDED (geometric-envelope <=1.30e-3 at the binding N=100 rung; exponential fit ~3e-4),
 *       giving the plateau an explicit tolerance 0.5805 +/- 8.1e-4, firmly positive.
 *     imp-96889 -- scouts the BOUNDED shift-invert resolvent Kato-Temple attack; the out-of-
 *       space residual eps that DIVERGED in imp-96875's direct (unbounded) form is now bounded
 *       (~1e-5, flat), but the KT correction is then negligible (~1e-12) so the "floor" collapses
 *       onto the Ritz value and re-expresses the SAME open (N,T) truncation rate rather than
 *       delivering an independent certified lower bound.
 *     imp-96911 -- fits the N-convergence rate of the imp-96889 top Ritz eta drift (0.622238 at
 *       Nbig=24 -> 0.660250 at Nbig=120, N=20 fixed) and finds it is NOT an N effect at all: eta
 *       is N-independent to 7 digits for N>=12 (the trial already saturates on ~12 Gegenbauer
 *       modes). The drift is a coupled (Nbig,T) effect -- eta rises with Nbig at fixed T but
 *       falls with T at fixed Nbig, pushing the Ritz floor by ~0.13 over the ladder with no
 *       algebraic convergence rate extractable (power-law fit pins at the search-floor exponent
 *       p=0.300, rms 5e-3).
 *     imp-96935 -- sweeps the shift m in {0.25,...,32} across the whole Nbig ladder: the
 *       recovered floor 1/eta-m is SHIFT-INVARIANT to 3-4 digits at every rung (eta~1/(m+mu)
 *       structurally cancels m out), and the (Nbig,T) drift itself is shift-invariant (relative
 *       spread only 2.06% over a 128x change in m, log-log slope ~-0.004). The shift is not a
 *       usable lever.
 *     imp-96938 -- calibrates the imp-96911 drift against the CERTIFIED-positive 2a=0.96
 *       endpoint: the same (Nbig up / T down) sign structure appears there too, so the drift
 *       pattern is a generic truncation-scheme artifact, not a diagnostic of the open-positivity
 *       case. At 2a=0.96 the floor never drops below 12.0089 across the whole sweep (vs order
 *       ~0.5 at 2a=ln3): what actually separates the two endpoints is the MARGIN, not the drift
 *       behaviour.
 *
 *   WHY GROUP THESE (not re-derive). Read individually each ticket looks like an open thread
 *   ("measure the drift", "sweep the shift", "calibrate against 0.96"). Read together they
 *   close three specific levers on the Route C-direct bounded-resolvent path and isolate exactly
 *   one thing that stays open. This index bakes that grouping verbatim so a future scout does
 *   not re-spend a ticket re-sweeping shift, re-checking N-convergence, or re-deriving an Nbig
 *   rate on this construction.
 *
 *   CLOSED LEVERS (measured, ruled out as independent fixes on this construction).
 *   (1) SHIFT m: shift-invariant (imp-96935) -- varying m does not stabilize or improve the
 *       floor; it merely rescales eta while 1/eta-m recovers the same mu.
 *   (2) BASIS SIZE N: saturates at N>=12 (imp-96911 Finding 1) -- the top Ritz eigenvector is
 *       fully captured by ~12 Gegenbauer modes; enlarging N does not move eta or the floor.
 *   (3) Nbig ALONE (fixed T): does not converge algebraically (imp-96911 Finding 2) and its
 *       apparent plateau is a T-truncation ceiling, not an Nbig limit (imp-96911 Finding 3) --
 *       raising Nbig alone, at any fixed T, cannot certify the floor.
 *
 *   WHAT STAYS OPEN.
 *   (a) THE JOINT (Nbig,T) LIMIT. Nbig and T push the floor in opposite directions (imp-96911/
 *       imp-96935/imp-96938 all reproduce this) and neither truncation alone converges; no
 *       member of this cohort sizes the joint limit or a rate for it. This is the same open
 *       resolvent-truncation envelope imp-96889 traced back to imp-96827/imp-96847/imp-96848.
 *   (b) THE ABSOLUTE MARGIN at 2a=ln3. imp-96938 shows the (Nbig,T) drift's sign structure is
 *       scheme-generic (identical at the certified-positive 2a=0.96 endpoint), so it cannot by
 *       itself decide whether lambda_1(T_a[sigma_2]) at 2a=ln3 is positive; only the margin
 *       (order ~0.5 there vs order >=12 at 0.96) discriminates, and the margin at ln3 is exactly
 *       what remains uncertified.
 *   NOTE ON imp-96827: it is the one member with a genuinely CLOSED-positive result, but on a
 *   DIFFERENT (non-shift-invert) construction -- the direct floor's T-residual at fixed N, not
 *   the shift-invert Ritz floor's coupled (Nbig,T) drift. It does not resolve (a)/(b) above; it
 *   bounds a different, already-well-behaved quantity.
 *
 *   STATUS: a grouping/index note over five already-completed measurement tickets, not a new
 *   derivation. No bound changes: the interval-rigorous certified reach stays 2a<=0.96; the
 *   Rayleigh/Ritz values throughout this cohort are UPPER bounds, not certified lower bounds; RH
 *   open; NO QED. No refereed bound is changed.
 *
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (direct T-residual envelope, closed-positive on its own construction)
 * @see imp-96889-krein-shiftinvert-katotemple-scout.js (bounded resolvent scout; SUB-GAP IMP96889_SHIFTINVERT_REEXPRESSES_NT_RATE)
 * @see imp-96911-krein-eta-nconvergence-scout.js (N saturates >=12; Nbig-alone does not converge)
 * @see imp-96935-krein-shift-drift-sensitivity.js (shift-invariance of the floor and its drift)
 * @see imp-96938-krein-drift-calibration-096.js (drift sign structure is scheme-generic; margin is the discriminant)
 *
 * Ticket: imp-96969 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const COUPLED_NT_TRUNCATION_WALL_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-96827',
    role: 'direct t-truncation residual envelope (fixed N, no shift-invert)',
    result:
      'CLOSED-POSITIVE on its own construction: residual beyond T=4800 bounded ' +
      '(geometric envelope <=1.30e-3 at N=100; exponential fit ~3e-4), plateau ' +
      '0.5805 +/- 8.1e-4, firmly positive.',
  }),
  Object.freeze({
    id: 'imp-96889',
    role: 'bounded shift-invert resolvent Kato-Temple scout',
    result:
      'Fixes the imp-96875 residual divergence (eps ~1e-5 bounded vs ~1e4 diverging), but the ' +
      'KT correction is then negligible so the floor collapses onto the Ritz value and ' +
      're-expresses the open (N,T) truncation rate. SUB-GAP IMP96889_SHIFTINVERT_REEXPRESSES_NT_RATE.',
  }),
  Object.freeze({
    id: 'imp-96911',
    role: 'N-convergence rate of the top Ritz eta drift',
    result:
      'CLOSES the basis (N) lever (N-independent for N>=12) and the Nbig-alone lever (no ' +
      'algebraic convergence at fixed T; apparent plateau is a T-truncation ceiling). Leaves ' +
      'the joint (Nbig,T) limit open.',
  }),
  Object.freeze({
    id: 'imp-96935',
    role: 'shift-m sensitivity across the whole Nbig ladder',
    result:
      'CLOSES the shift (m) lever: floor is shift-invariant to 3-4 digits (eta~1/(m+mu) ' +
      'structurally cancels m); the (Nbig,T) drift itself is shift-invariant (2.06% relative ' +
      'spread over a 128x change in m).',
  }),
  Object.freeze({
    id: 'imp-96938',
    role: 'calibration of the drift against the certified-positive 2a=0.96 endpoint',
    result:
      'Shows the (Nbig,T) drift sign structure is scheme-generic (identical at 2a=0.96, where ' +
      'the floor never drops below 12.0089): the drift alone cannot decide the sign of ' +
      'lambda_1 at ln3; the absolute margin is the discriminant, and it is what stays open.',
  }),
]);

const CLOSED_LEVERS = Object.freeze([
  'shift m (imp-96935: floor and its (Nbig,T) drift are both shift-invariant)',
  'basis size N (imp-96911 Finding 1: eta is N-independent for N>=12, trial saturates)',
  'Nbig alone at fixed T (imp-96911 Findings 2-3: no algebraic convergence; plateau is a ' +
    'T-truncation ceiling, not an Nbig limit)',
]);

const OPEN_LEVERS = Object.freeze([
  'the joint (Nbig,T) limit / rate (Nbig and T push the floor in opposite directions; no ' +
    'member of this cohort sizes the joint limit)',
  'the absolute positivity margin at 2a=ln3 (imp-96938: the drift sign structure is scheme-' +
    'generic, so only the margin -- order ~0.5 at ln3 vs order >=12 at 0.96 -- discriminates)',
]);

export const IMP96969_COUPLED_NT_TRUNCATION_WALL_COHORT_INDEX = Object.freeze({
  id: 'imp-96969',
  proofSection: 'S-frontier',
  cohort: COUPLED_NT_TRUNCATION_WALL_COHORT,
  closedLevers: CLOSED_LEVERS,
  openLevers: OPEN_LEVERS,
  question:
    'The Route C-direct bounded-resolvent / Krein t-truncation cohort (imp-96827/96889/96911/' +
    '96935/96938) reads as five separate open scout tickets. Grouped, which levers (shift, ' +
    'basis, Nbig) are closed, and which (the joint (N,T) limit, the absolute margin) remain?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). This cohort closes three levers on the Route ' +
    'C-direct bounded-resolvent construction at 2a=ln3: the SHIFT m (imp-96935, floor and its ' +
    'drift are shift-invariant), the BASIS size N (imp-96911, eta is N-independent for N>=12), ' +
    'and Nbig ALONE at fixed T (imp-96911, no algebraic convergence; the apparent plateau is a ' +
    'T-truncation ceiling). What remains open is the JOINT (Nbig,T) limit itself (the two ' +
    'truncations push the floor in opposite directions, imp-96889/96911/96935/96938 all ' +
    'reproduce this) and the ABSOLUTE MARGIN at ln3 (imp-96938: the drift sign structure is ' +
    'scheme-generic, identical at the certified-positive 2a=0.96 endpoint, so it cannot decide ' +
    'the sign at ln3 by itself). imp-96827 separately bounds the DIRECT (non-shift-invert) ' +
    't-truncation residual at fixed N to an explicit positive tolerance, but on a different ' +
    'construction that does not resolve either open item. Future work on this thread should not ' +
    're-sweep shift, re-check N-convergence, or re-derive an Nbig-alone rate; it should attack ' +
    'the joint (Nbig,T) limit or the ln3 margin directly. Establishes nothing new; moves no ' +
    'bound; interval-rigorous certified reach stays 2a<=0.96; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96827 (direct T-residual envelope); imp-96889 (shift-invert scout, SUB-GAP ' +
    'IMP96889_SHIFTINVERT_REEXPRESSES_NT_RATE); imp-96911 (N/Nbig convergence rate); imp-96935 ' +
    '(shift sensitivity); imp-96938 (calibration against the certified 2a=0.96 endpoint); ' +
    'imp-96904 (flags the bounded resolvent as the only live Route C-direct path).',
});

export default IMP96969_COUPLED_NT_TRUNCATION_WALL_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96969_COUPLED_NT_TRUNCATION_WALL_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp96969-cohort-has-all-five-members',
    why: 'The whole point of the index is grouping exactly these five tickets; a missing ' +
      'member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP96969_COUPLED_NT_TRUNCATION_WALL_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-96827', 'imp-96889', 'imp-96911', 'imp-96935', 'imp-96938'].every((id) =>
        ids.includes(id),
      );
    },
  },
  {
    id: 'imp96969-closed-vs-open-levers-named',
    why: 'The index note exists to say which levers are closed (do not re-attempt) vs open ' +
      '(the live residual); both lists must be non-empty and name their specific levers.',
    holds: () => {
      const idx = IMP96969_COUPLED_NT_TRUNCATION_WALL_COHORT_INDEX;
      return (
        idx.closedLevers.length === 3 &&
        idx.openLevers.length === 2 &&
        idx.closedLevers.some((l) => /shift/i.test(l)) &&
        idx.closedLevers.some((l) => /basis size N/i.test(l)) &&
        idx.openLevers.some((l) => /joint \(Nbig,T\)/i.test(l)) &&
        idx.openLevers.some((l) => /margin/i.test(l))
      );
    },
  },
  {
    id: 'imp96969-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96969_COUPLED_NT_TRUNCATION_WALL_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP96969_COUPLED_NT_TRUNCATION_WALL_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP96969_COUPLED_NT_TRUNCATION_WALL_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP96969_COUPLED_NT_TRUNCATION_WALL_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP96969_COUPLED_NT_TRUNCATION_WALL_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96969-coupled-nt-truncation-wall-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
