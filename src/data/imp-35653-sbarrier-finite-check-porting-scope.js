/**
 * @module imp-35653-sbarrier-finite-check-porting-scope
 *
 * imp-35653 (proof/assessment, S-frontier): SCOPE whether the Polymath15
 * argument-principle / winding-number BARRIER certificate -- the imp-35419
 * S_barrier statement -- can be expressed as a FINITE verifiable check at the
 * repo already-verified height T_PT = 3e12, and quantify the concrete porting
 * work items that would turn the nominal E_trunc count integral into the
 * operative deterministic realness barrier above T_PT.
 *
 * imp-35419 Part B (P2 option-a) named "the Polymath15 argument-principle /
 * winding-number barrier + heat-flow zero-repulsion, mesh + interval-arithmetic
 * verified at the barrier height" as the port engine, but never assessed whether
 * that verification is actually a FINITE check -- and, if so, over WHAT domain.
 * This module resolves that open scope.
 *
 * ASSESSMENT / SCOPING ONLY. Discharges nothing; ports nothing; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * PART A -- THE WINDING BARRIER IS A FINITE CHECK, BUT ONLY ON A BOUNDED RECTANGLE
 * -----------------------------------------------------------------------------
 * The argument principle gives, for the heat-flow-evolved H_t and a bounded
 * rectangle R with boundary dR enclosing no zero on dR,
 *     (1 / 2 pi i) contourInt_{dR} (H_t prime / H_t) dz = (number of zeros in R),
 * i.e. the net winding number of H_t around dR counts the enclosed zeros. On a
 * FINITE mesh of M boundary sample points, with rigorous interval arithmetic on
 * the effective approximation H_t = A + B - C (Polymath15 explicit error bound)
 * and an a-priori cap on the per-segment argument increment (so no half-turn is
 * skipped), the winding number is certified EXACTLY. Combined with the functional
 * equation / real-axis reflection this certifies that every enclosed zero sits on
 * the critical line. THIS is a genuine finite, mechanically checkable certificate
 * -- and it is precisely what Polymath15 evaluated at their fixed barrier.
 *
 * CRUCIAL LIMIT: a winding computation covers only a BOUNDED region. It certifies
 * "no off-line zero in R", never "no off-line zero for EVERY t > T_PT". The
 * S_barrier statement quantifies over the SEMI-INFINITE tail t in (T_PT, inf);
 * no single finite winding check can span an unbounded height range.
 *
 * PART B -- S_barrier DECOMPOSES AS (FINITE WINDING) + (NON-FINITE TAIL LEMMA)
 * -----------------------------------------------------------------------------
 * The honest structure of a ported S_barrier at T_PT is TWO pieces:
 *   (B1) FINITE winding barrier on a bounded transition rectangle
 *        R = [T_PT, T_PT + Delta] x [-h, h] in the H_t plane: an interval-verified
 *        argument-principle count, mesh cost quantified in Part C. FINITE.
 *   (B2) ANALYTIC tail lemma for t >= T_PT + Delta: an explicit large-height
 *        zero-free estimate of Polymath15 type |A + B| > |C| (the mollified
 *        triangle-inequality bound), holding for ALL x above the transition. This
 *        is a closed-form inequality verified ONCE and valid for the whole tail --
 *        it is NOT a mesh check, NOT enumerable, NOT a finite computation.
 * So S_barrier as a whole is NOT expressible as a finite verifiable check. Only
 * its bounded-rectangle piece (B1) is finite; the semi-infinite coverage (B2) is
 * an analytic proof obligation. This is the exact reason imp-35419 classes the
 * port as breakthrough-tier rather than engine-closable.
 *
 * PART C -- QUANTIFYING THE FINITE PIECE (mesh cost at T_PT = 3e12)
 * -----------------------------------------------------------------------------
 * The winding mesh must resolve every enclosed zero (a few boundary samples per
 * enclosed zero, else a half-turn of arg H_t is missed). The local zero density
 * at height T_PT is (1 / 2 pi) log(T_PT / 2 pi) ~ 4.28 zeros per unit height, so
 * a transition rectangle of width Delta encloses ~ 4.28 * Delta zeros and needs
 * O(log T_PT) mesh points per unit height (an oversampling factor times the
 * density). The finite check therefore scales as O(Delta * log T_PT) boundary
 * evaluations -- large but BOUNDED and mechanically verifiable. The cost is set by
 * the LOG of the height, not the height itself: the finite piece is cheap in the
 * complexity sense; the expensive, non-mechanizable part is the tail lemma (B2).
 *
 * PART D -- DOES Platt-Trudgian N_off(T_PT) = 0 SUFFICE AS THE BARRIER BASE?
 * -----------------------------------------------------------------------------
 * NO. N_off(T_PT) = 0 (RH verified to T_PT = 3e12) supplies the INITIAL CONDITION
 * -- every zero up to T_PT is real, so the winding count at the base of the
 * transition rectangle matches the density-predicted real-zero count -- but it is
 * a NECESSARY, NOT SUFFICIENT base. It says nothing about t > T_PT. The barrier
 * still needs (B1) the winding computation INSIDE the transition rectangle to
 * certify no zero escapes the line just above T_PT, AND (B2) the analytic tail
 * lemma for the rest. PT verified-to-T_PT is the floor the barrier stands on, not
 * the barrier itself.
 *
 * PART E -- ITEMIZED PORTING WORK (turning the count integral into the barrier)
 * -----------------------------------------------------------------------------
 *   (W1) Instantiate the effective approximation H_t = A + B - C with an explicit
 *        interval error bound at heights near T_PT (Polymath15 machinery, re-
 *        anchored from their barrier height to T_PT = 3e12).
 *   (W2) FINITE winding barrier: interval-verify the argument-principle count on
 *        the boundary of R = [T_PT, T_PT + Delta] x [-h, h] with an O(Delta log
 *        T_PT) mesh and a per-segment argument-increment cap. Certifies (B1).
 *   (W3) ANALYTIC tail lemma: prove |A + B| > |C| for all x >= T_PT + Delta at the
 *        repo heat parameter, the Polymath15 large-x zero-free estimate re-anchored
 *        at the higher T_PT. Certifies (B2). NON-finite -- the breakthrough-tier
 *        obligation.
 *   (W4) Reconnect: RETIRE the unsound 2/t count-kernel derivation of E_trunc (the
 *        3.06e-5 / 5.106e-5 artifact) and read the off-line contribution above T_PT
 *        as EXACTLY ZERO from (B1)+(B2). The numeric E_trunc becomes vestigial.
 * W1, W2, W4 are finite/mechanical; W3 is analytic and is the true cost center.
 *
 * The punchline: the winding-number barrier certificate IS a finite, interval-
 * verifiable check -- but only over a BOUNDED rectangle (Part A), which is exactly
 * what Polymath15 evaluates. The full S_barrier statement over the semi-infinite
 * tail t > T_PT is NOT a finite check: it decomposes into a FINITE winding barrier
 * on a bounded transition rectangle (cost O(Delta log T_PT) ~ 4.28 zeros/unit at
 * T_PT, mechanically verifiable) PLUS a NON-finite analytic tail lemma |A+B| > |C|
 * for all large x (Parts B, C). Platt-Trudgian N_off(T_PT) = 0 is a necessary base
 * but does NOT suffice (Part D). Porting = W1..W4, of which only W3 is the
 * breakthrough-tier analytic obligation (Part E). Assessment/scoping only; changes
 * no bound; NO QED; no refereed bound is changed.
 *
 * @see imp-35419-etrunc-barrier-lemma-porting-scope (the S_barrier statement + P2 option-a this module scopes)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = unported barrier lemma; 2/gamma mispricing)
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (E_trunc dominates far tail)
 * @see imp-3933 (repo gap law; isolated-pair realness time); winding-thread (de Bruijn Thm 13)
 * @see imp-397 (the 2/gamma per-zero count kernel that W4 retires)
 */

// -- Anchor + operative constants (matching imp-35419; no heavy imports) -------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const TWO_PI = 2 * Math.PI;
// Local zero density at height T_PT: (1 / 2 pi) log(T_PT / 2 pi) zeros per unit height.
const LOCAL_DENSITY_AT_TPT = Math.log(T_PT / TWO_PI) / TWO_PI; // ~4.279 zeros/unit
const OVERSAMPLE = 3; // >= a few boundary samples per enclosed zero (no missed half-turn)
const MESH_PER_UNIT = OVERSAMPLE * LOCAL_DENSITY_AT_TPT; // ~12.8 mesh points/unit height
const E_TRUNC_CLEAN = 3.06e-5; // the count artifact W4 retires
const E_TRUNC_CORRECTED = 5.106e-5; // imp-34791 R2 parts-corrected count artifact
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping

export const IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE = {
  id: 'imp-35653',
  proofSection: 'S-frontier',
  question:
    'Can the Polymath15 argument-principle / winding-number BARRIER certificate (the imp-35419 ' +
    'S_barrier statement) be expressed as a FINITE verifiable check at T_PT = 3e12, does the ' +
    'Platt-Trudgian N_off(T_PT) = 0 input suffice as the barrier base, and what are the itemized ' +
    'porting work items? Assessment/scoping only; changes no bound; NO QED.',
  windingIsFiniteButBounded: {
    argumentPrinciple:
      '(1 / 2 pi i) contourInt_{dR} (H_t prime / H_t) dz = number of zeros in R: the net winding ' +
      'number of H_t around a bounded rectangle boundary counts enclosed zeros.',
    finiteWhenBounded:
      'On a finite mesh of M boundary points with interval arithmetic on H_t = A + B - C and a ' +
      'per-segment argument-increment cap (no skipped half-turn), the winding number is certified ' +
      'EXACTLY; with real-axis reflection this certifies all enclosed zeros are on the line. This IS ' +
      'a genuine finite mechanical certificate -- exactly what Polymath15 evaluated at their barrier.',
    crucialLimit:
      'A winding computation covers only a BOUNDED region; it can never certify "no off-line zero for ' +
      'EVERY t > T_PT". The semi-infinite quantifier defeats any single finite winding check.',
  },
  decomposition: {
    B1_finite:
      'FINITE winding barrier on a bounded transition rectangle R = [T_PT, T_PT + Delta] x [-h, h]: an ' +
      'interval-verified argument-principle count. Mesh cost quantified below. FINITE and mechanical.',
    B2_nonFinite:
      'ANALYTIC tail lemma for t >= T_PT + Delta: an explicit large-height zero-free estimate |A + B| ' +
      '> |C| (Polymath15 mollified triangle-inequality bound) holding for ALL x above the transition. ' +
      'Verified ONCE, valid for the whole tail -- NOT a mesh check, NOT enumerable, NOT finite.',
    sBarrierIsNotFinite:
      'S_barrier as a whole is NOT a finite verifiable check: only the bounded-rectangle piece B1 is ' +
      'finite; the semi-infinite coverage B2 is an analytic proof obligation. This is exactly why ' +
      'imp-35419 classes the port as breakthrough-tier, not engine-closable.',
  },
  finiteMeshCost: {
    localDensityAtTPT: +LOCAL_DENSITY_AT_TPT.toFixed(4), // ~4.2799 zeros/unit height
    meshPointsPerUnitHeight: +MESH_PER_UNIT.toFixed(4), // ~12.84 with 3x oversampling
    scaling:
      'The winding mesh resolves every enclosed zero (a few samples each), so cost ~ O(Delta * log ' +
      'T_PT) boundary evaluations -- set by the LOG of the height, not the height. The finite piece is ' +
      'cheap in complexity; the expensive non-mechanizable part is the tail lemma B2.',
  },
  ptBaseSufficiency: {
    verdict: 'NECESSARY BUT NOT SUFFICIENT',
    why:
      'N_off(T_PT) = 0 supplies the INITIAL CONDITION -- every zero up to T_PT is real, so the base ' +
      'winding count matches the density-predicted real-zero count -- but it says nothing about ' +
      't > T_PT. The barrier still needs B1 (winding inside the transition rectangle) AND B2 (the ' +
      'analytic tail lemma). PT verified-to-T_PT is the floor the barrier stands on, not the barrier.',
  },
  portWorkItems: {
    W1: 'Instantiate H_t = A + B - C with an explicit interval error bound at heights near T_PT (Polymath15 machinery re-anchored to T_PT = 3e12). FINITE.',
    W2: 'FINITE winding barrier: interval-verify the argument-principle count on dR = boundary of [T_PT, T_PT + Delta] x [-h, h] with an O(Delta log T_PT) mesh and a per-segment argument-increment cap. Certifies B1.',
    W3: 'ANALYTIC tail lemma: prove |A + B| > |C| for all x >= T_PT + Delta at the repo heat parameter (Polymath15 large-x zero-free estimate re-anchored higher). Certifies B2. NON-finite -- the true cost center.',
    W4: 'Reconnect: RETIRE the unsound 2/t count-kernel derivation of E_trunc (the 3.06e-5 / 5.106e-5 artifact) and read the off-line contribution above T_PT as EXACTLY ZERO from B1 + B2. E_trunc becomes vestigial.',
    finiteVsAnalytic: 'W1, W2, W4 are finite/mechanical; W3 is the analytic, breakthrough-tier obligation.',
  },
  eTruncArtifactRetired: {
    clean: E_TRUNC_CLEAN, // 3.06e-5
    corrected: E_TRUNC_CORRECTED, // 5.106e-5
    note: 'Both are count artifacts of the 2/t kernel; W4 replaces them with EXACTLY ZERO under a ported barrier. Not changed here (scoping only).',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). (Part A) The Polymath15 winding-number ' +
    'barrier certificate IS a finite, interval-verifiable check -- but only over a BOUNDED rectangle, ' +
    'exactly what Polymath15 evaluates; a winding computation cannot span the semi-infinite quantifier. ' +
    '(Parts B, C) The full S_barrier over t > T_PT is therefore NOT a single finite check: it ' +
    'decomposes into a FINITE winding barrier on a bounded transition rectangle (cost O(Delta log ' +
    'T_PT); local density ~4.28 zeros/unit at T_PT, mechanically verifiable) PLUS a NON-finite ' +
    'analytic tail lemma |A + B| > |C| for all large x. (Part D) Platt-Trudgian N_off(T_PT) = 0 is a ' +
    'NECESSARY base (initial condition) but does NOT suffice -- it says nothing above T_PT. (Part E) ' +
    'Porting = W1..W4, of which only W3 (the analytic tail lemma) is the breakthrough-tier obligation; ' +
    'W4 retires the 3.06e-5 / 5.106e-5 count artifact to EXACTLY ZERO. Discharges nothing; ports ' +
    'nothing; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35419 (the S_barrier statement + P2 option-a scoped here); imp-34791 (E_trunc = unported ' +
    'barrier lemma; 2/gamma mispricing); imp-35334 (E_trunc dominates the far tail); imp-3933 (gap ' +
    'law; isolated-pair realness time); winding-thread (de Bruijn Thm 13); imp-397 (2/gamma kernel); ' +
    'Polymath15 2019; Platt-Trudgian 2021.',
};

export const IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE_ASSERTIONS = [
  {
    // Part A/B: the winding barrier is finite only on a bounded rectangle; full S_barrier is not finite.
    id: 'imp35653-winding-finite-only-bounded',
    description: 'Winding barrier is a finite check over a bounded rectangle; full S_barrier (t > T_PT) is NOT finite',
    holds: () =>
      IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE.windingIsFiniteButBounded.crucialLimit.length > 0 &&
      /NOT a finite/.test(IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE.decomposition.sBarrierIsNotFinite) &&
      /NOT.*finite/.test(IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE.decomposition.B2_nonFinite),
  },
  {
    // Part C: the finite mesh cost is set by the LOG of the height; density value is faithful.
    id: 'imp35653-finite-mesh-log-cost',
    description: 'Finite piece costs O(Delta log T_PT); local density at T_PT ~ 4.28 zeros/unit height',
    holds: () =>
      Math.abs(LOCAL_DENSITY_AT_TPT - Math.log(3e12 / (2 * Math.PI)) / (2 * Math.PI)) < 1e-12 &&
      LOCAL_DENSITY_AT_TPT > 4.27 && LOCAL_DENSITY_AT_TPT < 4.29 &&
      MESH_PER_UNIT > LOCAL_DENSITY_AT_TPT, // oversampled beyond one point per zero
  },
  {
    // Part D: PT N_off(T_PT)=0 is necessary but not sufficient as the barrier base.
    id: 'imp35653-pt-base-necessary-not-sufficient',
    description: 'Platt-Trudgian N_off(T_PT) = 0 is a necessary base but does NOT suffice for the barrier',
    holds: () =>
      IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE.ptBaseSufficiency.verdict === 'NECESSARY BUT NOT SUFFICIENT' &&
      /says nothing about\s+t > T_PT/.test(IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE.ptBaseSufficiency.why),
  },
  {
    // Honesty gate: scoping only, no discharge, no QED, no refereed bound is changed; E_trunc artifacts unchanged.
    id: 'imp35653-honesty-gate-no-qed',
    description: 'Scoping only: discharges nothing, changes no bound, no QED, no refereed bound is changed',
    holds: () =>
      IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      E_TRUNC_CLEAN < E_TRUNC_CORRECTED &&
      /NO QED/.test(IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE.verdict),
  },
];

for (const a of IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35653-sbarrier-finite-check-porting-scope assertion failed: ${a.id}`);
  }
}
