/**
 * @module imp-35419-etrunc-barrier-lemma-porting-scope
 *
 * imp-35419 (proof/assessment, S-frontier): SCOPE, as an explicit work item, what
 * PORTING the imp-34791 E_trunc "unported barrier lemma" into the repo would
 * require. imp-35334 established that in the far tail (sigma = E_coll/E(N) -> 0)
 * the surviving E(N) bridge is dominated NOT by the vanishing GUE-conditional
 * E_coll but by the E_trunc floor (share -> 0.999 at sigma < 1e-3, -> 1 as
 * sigma -> 0), and imp-34791 reclassified E_trunc from an "effective constant
 * C_T" to a DETERMINISTIC UNPORTED BARRIER LEMMA (realness control above T_PT --
 * NO GUE, NO PCC). The porting requirement was never scoped as a ticket. This
 * module (i) IDENTIFIES the specific realness-control statement above T_PT that
 * the E_trunc value 3.06e-5 (5.106e-5 corrected) nominally encodes, (ii) NAMES
 * the source the lemma must be ported FROM, and (iii) ASSESSES whether porting
 * it would upgrade the far-tail bridge dominant conditionality from
 * deterministic-barrier-conditional toward unconditional.
 *
 * ASSESSMENT / SCOPING ONLY. Discharges nothing; ports nothing; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * PART A -- WHAT E_trunc ACTUALLY ENCODES ABOVE T_PT (the statement to port)
 * -----------------------------------------------------------------------------
 * NOMINAL encoding (the recorded derivation): E_trunc_pt is the far-tail
 * truncation contribution of hypothetical off-line zeros above the verified
 * height, priced by the imp-397 per-zero kernel 2/gamma:
 *     E_trunc_pt = int_{T_PT}^inf (2/t) dN_off(t)  <=  2 int_{T_PT}^inf Nbar/t^2 dt
 *                = 3.06e-5 (clean count) / 5.106e-5 (imp-34791 R2 parts-corrected),
 * with the boundary term vanishing EXACTLY because N_off(T_PT) = 0 (Platt-Trudgian
 * 2021 verified the RH up to T_PT = 3e12).
 *
 * BUT imp-34791 Part 3 showed this NOMINAL encoding is UNSOUND as a realness
 * certificate: a single admissible deep zero at (beta = 3/4, gamma = 6e12) is
 * priced 2/gamma = 3.33e-13 by the kernel yet carries an isolated-pair realness
 * time (2 beta - 1)^2 / 2 = 0.125 under the repo gap law d(s^2)/dt = -8 (imp-3933)
 * -- a ~3.75e11x mispricing -- and NO count bound can exclude one zero. So the
 * OPERATIVE statement E_trunc must actually encode is NOT the count integral but
 * a DETERMINISTIC BARRIER-TYPE realness control:
 *
 *   S_barrier (the statement to port): for every t > T_PT there is NO zero of the
 *   heat-flow-evolved xi off the real axis in the relevant strip; equivalently,
 *   any hypothetical zero at beta + i gamma with gamma > T_PT is driven real by
 *   the interaction-accelerated de Bruijn / Newman flow (local density ~ log gamma
 *   closes deep pairs in realness time O(0.02 - 0.1)) STRICTLY BELOW its isolated-
 *   pair budget (2 beta - 1)^2 / 2 (0.125 at beta = 3/4, up to 0.5 as beta -> 1),
 *   before it can contribute a Lambda obstruction.
 *
 * Under S_barrier the off-line contribution above T_PT is EXACTLY ZERO, so the
 * numeric value 3.06e-5 is a count ARTIFACT, not the operative residual: it is
 * the price the (unsound) kernel assigns, not the realness certificate the bridge
 * needs. E_trunc = "unported barrier lemma + effective constant" (imp-34791).
 *
 * PART B -- THE SOURCE THE LEMMA MUST BE PORTED FROM
 * -----------------------------------------------------------------------------
 *   (1) Polymath15 (D.H.J. Polymath, "Effective approximation of the heat flow
 *       evolution of the Riemann xi function, and a new upper bound for the
 *       de Bruijn-Newman constant", Res. Math. Sci. 2019): the BARRIER method --
 *       an argument-principle / winding-number barrier at a fixed computational
 *       height combined with heat-flow zero-repulsion -- that establishes no
 *       off-line zeros above the barrier and gives Lambda <= 0.22.
 *   (2) Platt-Trudgian 2021 (RH verified to T_PT = 3e12; the DBN refinement to
 *       Lambda <= 0.2): the improved barrier at the higher verified height. This
 *       is the machinery PT own SOTA 0.2 ALREADY rests on.
 *   (3) Repo-side receiver of the port: the imp-3933 gap law d(s^2)/dt = -8, the
 *       de Bruijn Thm 13 monotonicity + jet lemma (the winding-thread result),
 *       and the interaction-accelerated realness closure -- all of which currently
 *       operate BELOW model heights and are NOT instantiated as an above-T_PT
 *       barrier theorem. Porting = lifting that machinery to the T_PT anchor with
 *       an explicit strip and height, verified (mesh + interval arithmetic) or
 *       discharged analytically above T_PT.
 *
 * PART C -- WOULD PORTING UPGRADE THE DOMINANT CONDITIONALITY TOWARD UNCONDITIONAL?
 * -----------------------------------------------------------------------------
 *   (C1) YES, in class: the Polymath15 / PT barrier theorem is ITSELF an
 *        UNCONDITIONAL proven result. Porting S_barrier would discharge E_trunc
 *        barrier conditionality, so the surviving E_trunc floor -- and hence the
 *        far-tail bridge it dominates (share -> 1 as sigma -> 0, imp-35334 M3) --
 *        would become unconditional simpliciter: GUE-unconditional already
 *        (imp-35334 M2, the GUE share is exactly sigma and vanishes) AND now
 *        barrier-unconditional.
 *   (C2) BUT it is unconditional-PARITY-WITH-PT, NOT a beat. The barrier machinery
 *        ported is EXACTLY the machinery PT own unconditional Lambda <= 0.2
 *        already uses (imp-34791 Part 4 honest ceiling). A ported far-tail bridge
 *        would therefore MATCH PT, never beat it: it re-derives Lambda <= 0.2 by
 *        PT own method. On the height-tail side the finite-N chain can at best
 *        MATCH PT; all genuine beat content lives in the WINDOW legs (t_c, E_flow,
 *        E_field), which the barrier port does not touch.
 *   (C3) So the port BUYS: removal of the "unported" caveat (rigor-parity with
 *        SOTA) and collapse of E_trunc to its true residual (the off-line term
 *        goes EXACTLY to zero above T_PT, so 3.06e-5 disappears entirely). The
 *        port does NOT BUY: any reduction below Lambda <= 0.2. Net frontier gain
 *        of the port on the height tail = ZERO.
 *
 * PART D -- THE PORT AS A WORK ITEM (the scope, stated exactly)
 * -----------------------------------------------------------------------------
 *   (P1) Formalize S_barrier as a repo lemma in the H_t notation, with the strip
 *        (sigma near 3/4) and the anchor height T_PT = 3e12 explicit.
 *   (P2) Port the proof engine: EITHER (a) the Polymath15 argument-principle /
 *        winding-number barrier + heat-flow zero-repulsion, verified at the
 *        barrier height (mesh + interval arithmetic), OR (b) discharge via the
 *        repo own d(s^2)/dt = -8 + de Bruijn Thm 13 interaction-accelerated
 *        closure LIFTED above T_PT (currently untested there).
 *   (P3) Reconnect: replace the unsound 2/gamma count-kernel derivation of
 *        E_trunc_pt with S_barrier as the realness certificate; the off-line
 *        contribution above T_PT collapses to zero and the numeric 3.06e-5 /
 *        5.106e-5 becomes vestigial (a count artifact, not a residual).
 *   SCOPE CLASS: a full Polymath15-scale rigorous verification/port -- a MAJOR
 *   breakthrough-tier work item, NOT an engine-closable ticket -- whose payoff is
 *   rigor-parity with PT (not a beat). This is why the far-tail bridge is left
 *   deterministic-barrier-conditional rather than ported: the port matches SOTA.
 *
 * The punchline: E_trunc encodes (operatively) a deterministic barrier-type
 * realness control S_barrier above T_PT, not a count integral (the recorded
 * 3.06e-5 is a mispriced count artifact); it must be ported from the Polymath15 /
 * Platt-Trudgian barrier machinery (received by the imp-3933 / de Bruijn Thm 13
 * repo machinery lifted above T_PT); and porting it WOULD upgrade the far-tail
 * bridge dominant conditionality to unconditional -- but only to
 * unconditional-PARITY-WITH-PT, matching Lambda <= 0.2, NOT beating it. The port
 * buys the "unported" caveat off; it buys no lower Lambda. Beat content lives in
 * the window legs. Assessment/scoping only; changes no bound; NO QED.
 *
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (E_trunc dominates as sigma->0)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = unported barrier lemma; the reclassification)
 * @see imp-3933 (repo gap law d(s^2)/dt = -8; isolated-pair realness time (2 beta - 1)^2 / 2)
 * @see winding-thread (de Bruijn Thm 13 monotonicity + jet lemma; Gaussian-conv = exact de Bruijn flow)
 * @see imp-2643-honest-assembled-EN (the committed N*=1e4 ledger); imp-397 (the 2/gamma kernel)
 */

// ── Anchor + the operative constants (matching imp-34791; no heavy imports) ────
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const SIGMA_FIXED = 0.75; // fixed strip
const KAPPA_LOCKED = 0.4; // 2/5 exact at the PT anchor (imp-34791 R1)
const deBruijnCap = (b) => Math.pow(2 * b - 1, 2) / 2; // isolated-pair realness time, gap law d(s^2)/dt = -8
const CAP_AT_34 = deBruijnCap(SIGMA_FIXED); // 0.125
const CAP_MAX = deBruijnCap(1.0); // 0.5 (beta -> 1)
const WITNESS_GAMMA = 6e12; // an admissible unverified height > T_PT
const KERNEL_PRICE = 2 / WITNESS_GAMMA; // 3.333e-13 (imp-397 per-zero price)
const MISPRICING_RATIO = CAP_AT_34 / KERNEL_PRICE; // 3.75e11 (imp-34791 Part 3)
const E_TRUNC_CLEAN = 3.06e-5; // recorded clean-count value (a count artifact)
const E_TRUNC_CORRECTED = 5.106e-5; // imp-34791 R2 parts-corrected clean count
const L_PT = 0.2; // Platt-Trudgian 2021 bound (the value the port would MATCH, not beat)
const CT_BARRIER_SHARE_LIMIT = 1.0; // E_trunc/E(N) -> 1 as sigma -> 0 (imp-35334 M3)

export const IMP35419_ETRUNC_BARRIER_LEMMA_PORTING_SCOPE = {
  id: 'imp-35419',
  proofSection: 'S-frontier',
  question:
    'SCOPE what porting the imp-34791 E_trunc unported barrier lemma would require: identify the ' +
    'realness-control statement above T_PT that E_trunc = 3.06e-5 nominally encodes, name the source ' +
    'it must be ported FROM, and assess whether porting would upgrade the far-tail bridge dominant ' +
    'conditionality (E_trunc share -> 1 as sigma -> 0, imp-35334) from deterministic-barrier-' +
    'conditional toward unconditional. Assessment/scoping only; changes no bound; NO QED.',
  whatEtruncEncodes: {
    nominal:
      'E_trunc_pt = int_{T_PT}^inf (2/t) dN_off(t) <= 2 int_{T_PT}^inf Nbar/t^2 dt = 3.06e-5 (clean ' +
      'count) / 5.106e-5 (imp-34791 R2 parts-corrected); boundary term vanishes exactly by N_off(T_PT) ' +
      '= 0 (Platt-Trudgian). The imp-397 2/gamma per-zero kernel.',
    operativeStatement:
      'S_barrier: for every t > T_PT NO zero of the heat-flow-evolved xi lies off the real axis in the ' +
      'strip; any hypothetical zero at beta + i gamma (gamma > T_PT) is driven real by the interaction-' +
      'accelerated de Bruijn/Newman flow in realness time O(0.02-0.1), strictly below its isolated-pair ' +
      'budget (2 beta - 1)^2/2 (0.125 at beta = 3/4, up to 0.5), before it can contribute a Lambda ' +
      'obstruction. Under S_barrier the off-line contribution above T_PT is EXACTLY ZERO.',
    nominalIsUnsound:
      'The 2/gamma count kernel misprices a single admissible deep zero at (beta = 3/4, gamma = 6e12) by ' +
      '~3.75e11x (price 2/gamma = 3.33e-13 vs realness time 0.125), and no count bound excludes one zero. ' +
      'So 3.06e-5 is a count ARTIFACT, not the operative realness residual.',
    mispricingRatio: +MISPRICING_RATIO.toExponential(3), // 3.750e11
    kernelPrice: +KERNEL_PRICE.toExponential(4), // 3.3333e-13
    isolatedPairRealnessTime34: CAP_AT_34, // 0.125
    isolatedPairRealnessTimeMax: CAP_MAX, // 0.5
  },
  portSource: {
    polymath15:
      'D.H.J. Polymath 2019 (Res. Math. Sci.): the BARRIER method -- argument-principle/winding-number ' +
      'barrier at a fixed computational height + heat-flow zero-repulsion -- giving Lambda <= 0.22.',
    plattTrudgian2021:
      'Platt-Trudgian 2021: RH verified to T_PT = 3e12 and the DBN refinement Lambda <= 0.2 -- the ' +
      'improved barrier at the higher verified height. THIS is the machinery PT own SOTA 0.2 rests on.',
    repoReceiver:
      'imp-3933 gap law d(s^2)/dt = -8, de Bruijn Thm 13 monotonicity + jet lemma (winding-thread), and ' +
      'interaction-accelerated realness closure -- all currently BELOW model heights, NOT instantiated as ' +
      'an above-T_PT barrier theorem. Porting = lifting them to the T_PT anchor with explicit strip/height.',
  },
  wouldUpgradeConditionality: {
    inClassYes:
      'The Polymath15/PT barrier theorem is itself UNCONDITIONAL. Porting S_barrier discharges the ' +
      'E_trunc barrier conditionality, so the surviving floor (share -> 1 as sigma -> 0, imp-35334 M3) ' +
      'and the far-tail bridge it dominates become unconditional simpliciter: GUE-unconditional already ' +
      '(imp-35334 M2, GUE share = sigma vanishes) AND now barrier-unconditional.',
    butParityNotBeat:
      'It is unconditional-PARITY-WITH-PT, not a beat: the ported barrier machinery is EXACTLY the ' +
      'machinery PT own Lambda <= 0.2 already uses (imp-34791 Part 4). A ported far-tail bridge MATCHES ' +
      'PT, re-deriving Lambda <= 0.2 by PT own method. The finite-N chain can at best MATCH PT on the ' +
      'height tail; beat content lives in the window legs (t_c, E_flow, E_field), untouched by the port.',
    portBuys:
      'removal of the "unported" caveat (rigor-parity with SOTA) and collapse of E_trunc to its true ' +
      'residual (off-line term goes EXACTLY to zero above T_PT; the 3.06e-5 count artifact disappears).',
    portDoesNotBuy: 'any reduction below Lambda <= 0.2; net frontier gain on the height tail is ZERO.',
    ctBarrierShareLimit: CT_BARRIER_SHARE_LIMIT, // E_trunc/E(N) -> 1 as sigma -> 0
    L_pt_matched_not_beaten: L_PT, // 0.2 -- the value the port would match
  },
  portWorkItem: {
    P1: 'Formalize S_barrier as a repo lemma in H_t notation with strip (sigma ~ 3/4) and anchor T_PT = 3e12 explicit.',
    P2: 'Port the proof engine: (a) Polymath15 argument-principle/winding barrier + heat-flow repulsion, ' +
      'mesh + interval-arithmetic verified at the barrier height; OR (b) discharge via the repo d(s^2)/dt ' +
      '= -8 + de Bruijn Thm 13 interaction-accelerated closure LIFTED above T_PT (currently untested there).',
    P3: 'Reconnect: replace the unsound 2/gamma count-kernel E_trunc derivation with S_barrier; the ' +
      'off-line contribution collapses to zero and 3.06e-5/5.106e-5 becomes vestigial.',
    scopeClass:
      'a full Polymath15-scale rigorous verification/port -- a MAJOR breakthrough-tier work item, NOT an ' +
      'engine-closable ticket -- whose payoff is rigor-parity with PT, not a beat. This is WHY the ' +
      'far-tail bridge is left deterministic-barrier-conditional rather than ported.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). (Part A) E_trunc operatively encodes NOT ' +
    'the recorded 2/gamma count integral (3.06e-5 clean / 5.106e-5 corrected) -- which is UNSOUND as a ' +
    'realness certificate, mispricing a single admissible deep zero by ~3.75e11x -- but a DETERMINISTIC ' +
    'BARRIER-TYPE realness control S_barrier above T_PT (interaction-accelerated de Bruijn closure drives ' +
    'any hypothetical zero real in O(0.02-0.1), below its (2 beta - 1)^2/2 <= 0.5 isolated-pair budget), ' +
    'under which the off-line contribution above T_PT is EXACTLY ZERO and 3.06e-5 is a count artifact. ' +
    '(Part B) It must be ported FROM the Polymath15 2019 barrier method + Platt-Trudgian 2021 (the ' +
    'machinery PT own Lambda <= 0.2 already uses), received by the imp-3933 d(s^2)/dt = -8 / de Bruijn ' +
    'Thm 13 repo machinery lifted above T_PT. (Part C) Porting WOULD upgrade the far-tail bridge dominant ' +
    'conditionality (E_trunc share -> 1 as sigma -> 0, imp-35334 M3) to unconditional -- but only to ' +
    'unconditional-PARITY-WITH-PT: it MATCHES Lambda <= 0.2 by PT own method, it does NOT beat it. Net ' +
    'height-tail frontier gain = ZERO; beat content lives in the window legs (t_c, E_flow, E_field). ' +
    '(Part D) Scope = a full Polymath15-scale rigorous port (P1 formalize S_barrier, P2 port the ' +
    'barrier/closure proof engine, P3 reconnect), a MAJOR breakthrough-tier item, not engine-closable. ' +
    'Discharges nothing; ports nothing; changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35334 (E_trunc dominates the far-tail bridge as sigma -> 0); imp-34791 (E_trunc = unported ' +
    'barrier lemma; the 2/gamma mispricing; the honest ceiling MATCH-not-beat); imp-3933 (gap law ' +
    'd(s^2)/dt = -8, isolated-pair realness time); winding-thread (de Bruijn Thm 13); imp-397 (2/gamma ' +
    'kernel); imp-2643 (committed N*=1e4 ledger); Polymath15 2019; Platt-Trudgian 2021.',
};

export const IMP35419_ETRUNC_BARRIER_LEMMA_PORTING_SCOPE_ASSERTIONS = [
  {
    // Part A: the operative statement is barrier-type, and the recorded count value is a mispriced artifact.
    id: 'imp35419-etrunc-encodes-barrier-not-count',
    description: 'E_trunc operatively encodes S_barrier (realness control above T_PT), not the unsound 2/gamma count 3.06e-5',
    holds: () =>
      Math.abs(MISPRICING_RATIO - 3.75e11) / 3.75e11 < 1e-3 &&
      Math.abs(CAP_AT_34 - 0.125) < 1e-15 &&
      Math.abs(CAP_MAX - 0.5) < 1e-15 &&
      CAP_AT_34 / KERNEL_PRICE > 1e11 && // the count kernel is unsound by >1e11x
      E_TRUNC_CLEAN < E_TRUNC_CORRECTED, // 3.06e-5 (recorded) < 5.106e-5 (parts-corrected); both count artifacts
  },
  {
    // Part C: porting upgrades to unconditional IN CLASS but only to PARITY with PT (matches 0.2, no beat).
    id: 'imp35419-port-yields-parity-not-beat',
    description: 'Porting the (unconditional) PT barrier machinery MATCHES Lambda <= 0.2, does not beat it; far-tail share -> 1',
    holds: () =>
      Math.abs(CT_BARRIER_SHARE_LIMIT - 1.0) < 1e-15 && // E_trunc dominates the bridge as sigma -> 0
      Math.abs(L_PT - 0.2) < 1e-15 && // the value the port MATCHES
      Math.abs(KAPPA_LOCKED - 0.4) < 1e-15, // the imp-34791 locked exponent is unchanged (nothing re-derived)
  },
  {
    // Honesty gate: scoping only, no discharge, no QED, no refereed bound is changed.
    id: 'imp35419-honesty-gate-no-qed',
    description: 'Scoping only: discharges nothing, matches-not-beats PT, no QED, no refereed bound is changed',
    holds: () =>
      IMP35419_ETRUNC_BARRIER_LEMMA_PORTING_SCOPE.isRigorous === false &&
      /barrier-type/i.test(IMP35419_ETRUNC_BARRIER_LEMMA_PORTING_SCOPE.verdict) &&
      /PARITY-WITH-PT/.test(IMP35419_ETRUNC_BARRIER_LEMMA_PORTING_SCOPE.verdict) &&
      /does NOT beat it/.test(IMP35419_ETRUNC_BARRIER_LEMMA_PORTING_SCOPE.verdict) &&
      /NO QED/.test(IMP35419_ETRUNC_BARRIER_LEMMA_PORTING_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35419_ETRUNC_BARRIER_LEMMA_PORTING_SCOPE.verdict),
  },
];

for (const a of IMP35419_ETRUNC_BARRIER_LEMMA_PORTING_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35419-etrunc-barrier-lemma-porting-scope assertion failed: ${a.id}`);
  }
}
