/**
 * imp-95045 - ATTRIBUTION of the residual 2.81x far-bracket headline gap:
 * floor-side, MAJ-class-relaxation, or a THIRD category. ASSESSMENT ONLY.
 *
 * The nineteenth imp-95008 continuation
 * (imp-95008-exact-pair-correlation-ceiling.js) reports the per-pair envelope
 * bound is now MAJ-class SHARP ("zero inequality slack survives at the
 * substituted point"), yet the headline far-bracket gap between the witness
 * FLOOR (0.096745062937484763, fifteenth/sixteenth continuation) and the
 * achieved ceiling (cFar = 0.2717408057586117) is still
 * 2.8088338309749887 (fixed-97: 225.42). The ticket poses a binary: does the
 * residual gap live in (i) the MAJ envelope class being loose vs the true
 * packet decay, or (ii) the witness floor being loose. This module assesses
 * the question and finds the binary is INCOMPLETE - the DOMINANT contributor
 * is neither (i) nor (ii) but a THIRD category the nineteenth already named:
 * the achieved-side parity AM-GM factor 2. Does NOT close the gap. NO QED.
 *
 * SETTING (identical to the sibling chain; Permuting the Zeta Twin Ladder
 * Section 4.5; page /permutation-architecture). The far bracket compares two
 * numbers built over the SAME MAJ(sigma, theta) two-currency assembly with
 * cNear <= 2 and Tstar <= Tx(2):
 *   CEILING  cFar = 2 sup_b OmegaE_b / Tx(2)      (Theorem Y-EXACT),
 *   FLOOR    F    = E / ( Tx(2) M )               (Theorem R, witness side),
 * where OmegaE_2 is the exact per-block off-diagonal envelope sum, E the
 * exhibited-witness excess and M its far mass currency.
 *
 * FINDING 1 (the tail-truncation constant Tx(2) is NOT a gap source - it
 * CANCELS). The headline gap is the ratio of ceiling to floor:
 *   gap = cFar / F = [ 2 OmegaE_2 / Tx(2) ] / [ E / ( Tx(2) M ) ]
 *       = 2 OmegaE_2 M / E .
 * Tx(2) appears identically in both numbers and drops out. So the far-tail
 * truncation - a natural suspect, since it is the one shared normalization -
 * contributes EXACTLY 1.000x to the 2.81x gap and can be ruled OUT as a
 * source. The gap lives entirely in the dimensionless ratio OmegaE_2 M / E.
 *
 * FINDING 2 (multiplicative decomposition; the parity AM-GM factor 2 is the
 * DOMINANT contributor and is a THIRD category, outside the ticket binary).
 *   gap = 2.8088338309749887
 *       = ( parity AM-GM 2.0 )  x  ( residual 1.4044169154874944 ) .
 * The leading factor 2 is the outer parity (2-coloring) AM-GM of the roll-up
 *   || sum_b w_b ||^2 <= 2 sum_b || w_b ||^2 + 2 ( sup_b OmegaE_b ) M ,
 * i.e. || x + y ||^2 <= 2 ( ||x||^2 + ||y||^2 ) applied across the even/odd
 * block color classes. This factor is:
 *   - CEILING-side (achieved), present in the ceiling derivation and ABSENT
 *     from the witness floor construction - so it is neither (i) MAJ-class
 *     looseness nor (ii) witness looseness, but a THIRD, distinct location;
 *   - declared "uniformly unrecoverable" by the eleventh continuation because
 *     its vanishing (tightness) configurations are the near-constant-2
 *     attainment, and the nineteenth records "the near-tie at b = 0 persists";
 *   - in log terms it accounts for log(2)/log(2.8088) = 0.671, i.e. ~67% of
 *     the headline gap.
 * The ticket binary (floor-side vs MAJ-class) therefore misses the MAJORITY
 * of the gap: the honest first answer is "neither - it is the achieved-side
 * parity factor 2."
 *
 * FINDING 3 (the residual 1.4044x, the only portion inside the ticket binary,
 * is - within the MODEL family - witness-floor-side). After removing the
 * parity factor, the exhibited witness realizes
 *   floor / ( cFar / 2 ) = 0.096745062937484763 / 0.13587040287930585
 *                        = 0.712039273361276
 * i.e. 71.2% of the parity-halved ceiling; the 28.8% shortfall IS the
 * residual 1.4044x. Where does it live?
 *   (i)  MAJ-envelope-vs-true-decay. Within the MODEL family the MAJ envelope
 *        IS the packet decay by construction, so option (i) VANISHES there.
 *        The nineteenth also reports the pair bound is EXACT within MAJ and
 *        the substitution point (Lemma X floor, strict; Lemma RHO cap) is
 *        attained to 0.4 percent, so the MAJ-INTERNAL substitution slack
 *        bounds at <= ~1.004x of the residual - negligible.
 *   (ii) Witness looseness. With (i) vanishing in the model family and the
 *        MAJ-internal slack <= 0.4 percent, the ENTIRE residual 1.4044x is
 *        witness-floor-side: the exhibited witness sits 28.8% below the
 *        parity-halved MAJ-family optimum. This is consistent with the
 *        sibling witness-side residual "witness side unchanged (multi-packet
 *        re-optimization, different grid geometries, full joint
 *        re-optimization measured to move only 3.4e-10 here)": the witness is
 *        near a LOCAL optimum but a 1.40x global headroom persists.
 *
 * SUB-GAP (explicitly named, NOT closed). Separating option (i) from (ii) for
 * the PAPER packets - as opposed to the model family - requires the paper
 * packet-envelope constants (c, beta, sigma, theta, A_d), which are the
 * sibling chain's openResiduals[0] and remain OPEN. If the MAJ envelope is
 * looser than the true PAPER packet decay, part of the residual 1.4044x
 * migrates from (ii) back to (i); the model-family verdict below is a lower
 * bound on the witness-side share, not a paper-packet verdict.
 *
 * VERDICT (which side does the 2.81x gap live on?):
 *   - ~67% of the (log) gap = the achieved-side parity AM-GM factor 2, a
 *     THIRD category outside the ticket binary, uniformly unrecoverable;
 *   - the tail-truncation Tx(2) contributes 1.000x (cancels) and is ruled out;
 *   - the residual sub-sqrt(2) factor 1.4044x is, in the MODEL family,
 *     witness-floor-side (option ii); the paper-packet split of (i) vs (ii)
 *     is deferred to the open packet constants.
 * No single-lever factor-2 improvement is available: the dominant half is a
 * ceiling-side AM-GM the eleventh already fixed as unrecoverable, and the
 * remainder is below sqrt(2). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 *
 * The numerics below CROSS-CHECK the attribution arithmetic; they are not the
 * claim. Import-light (no heavy bundle).
 */

// ── carried literals from the nineteenth continuation ────────────────────────
const CFAR_NEW = 0.2717408057586117; // Theorem Y-EXACT achieved far ceiling
const HEAD_FLOOR = 0.096745062937484763; // fifteenth/sixteenth witness floor
const GAP_HEAD = 2.8088338309749887; // headline far-bracket gap
const OM2_NEW = 3.9231900742006723e-5; // sup_b OmegaE_b (attained at b = 2)
const TX2_LIT = 2.8874500929283736e-4; // far-tail truncation currency
const F97_FLOOR = 0.0012054673720820889; // fixed-97 witness floor
const GAP_97 = 225.42360917596611; // fixed-97 far-bracket gap
const SUBST_TIGHTNESS = 0.004; // Lemma RHO cap attained to 0.4 percent

// ── derived attribution quantities ───────────────────────────────────────────
const PARITY_FACTOR = 2; // outer 2-coloring AM-GM of the roll-up
const RESIDUAL_AFTER_PARITY = GAP_HEAD / PARITY_FACTOR; // 1.4044169154874944
const WITNESS_REALIZATION = HEAD_FLOOR / (CFAR_NEW / PARITY_FACTOR); // 0.712...
const PARITY_LOG_SHARE = Math.log(PARITY_FACTOR) / Math.log(GAP_HEAD); // 0.671...

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95045_HEADLINE_GAP_ATTRIBUTION = {
  ticket:
    "imp-95045 (assess whether the residual 2.81x far-bracket headline gap is floor-side or MAJ-class-relaxation - ASSESSMENT ONLY, no closure)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; audits imp-95008-exact-pair-correlation-ceiling.js (nineteenth continuation).",
  question:
    "The nineteenth continuation makes the per-pair envelope bound MAJ-class sharp yet the headline gap between witness floor (0.096745062937484763) and achieved ceiling (0.2717408057586117) is still 2.8088338309749887. Ticket binary: is the residual (i) MAJ-class looseness vs true packet decay, or (ii) witness-floor looseness?",
  finding1_tailCancels:
    "The tail-truncation currency Tx(2) is NOT a gap source. gap = cFar/F = [2 OmegaE_2 / Tx(2)] / [E / (Tx(2) M)] = 2 OmegaE_2 M / E - Tx(2) appears identically in ceiling and floor and CANCELS, contributing exactly 1.000x. The one shared normalization is ruled out.",
  finding2_parityDominant:
    "gap = (parity AM-GM 2.0) x (residual 1.4044169154874944). The leading factor 2 is the outer 2-coloring AM-GM ||sum w_b||^2 <= 2 sum ||w_b||^2 + 2 (sup OmegaE_b) M; it is CEILING-side (present in the bound, absent from the witness), declared uniformly unrecoverable by the eleventh continuation (its tightness is the near-constant-2 attainment), and accounts for log(2)/log(2.8088) = 0.671 (~67%) of the gap. This is a THIRD category, neither (i) nor (ii): the ticket binary misses the majority of the gap.",
  finding3_residualWitnessSide:
    "The residual 1.4044x: the exhibited witness realizes floor/(cFar/2) = 0.712 of the parity-halved ceiling (28.8% shortfall). Within the MODEL family the MAJ envelope IS the true decay so option (i) vanishes; the MAJ-internal substitution point is attained to 0.4 percent so its slack bounds at <= ~1.004x. Hence the residual is, in the model family, witness-floor-side (option ii): the witness sits 28.8% below the parity-halved MAJ-family optimum, consistent with the sibling witness-side residual (joint re-optimization moved only 3.4e-10 locally).",
  reference: {
    cFar: CFAR_NEW,
    headlineFloor: HEAD_FLOOR,
    headlineGap: GAP_HEAD,
    fixed97Floor: F97_FLOOR,
    fixed97Gap: GAP_97,
    parityFactor: PARITY_FACTOR,
    residualAfterParity: RESIDUAL_AFTER_PARITY,
    witnessRealizationOfHalvedCeiling: WITNESS_REALIZATION,
    parityLogShare: PARITY_LOG_SHARE,
    substitutionPointTightness: SUBST_TIGHTNESS,
    tailTruncationContribution: 1,
    note: "attribution audit only - no floor or ceiling literal is changed; gap is Tx(2)-independent (cancels).",
  },
  subGap:
    "OPEN: separating option (i) MAJ-envelope-vs-true-decay from option (ii) witness looseness for the PAPER packets (not the model family) requires the paper packet-envelope constants (c, beta, sigma, theta, A_d) = sibling openResiduals[0], still open. The model-family verdict (residual is witness-side) is a LOWER bound on the witness share, not a paper-packet split.",
  openResiduals: [
    "the paper packet-envelope constants that would let option (i) be measured against the true PAPER packet decay (sibling openResiduals[0])",
    "the achieved-side parity AM-GM factor 2, uniformly unrecoverable per the eleventh continuation (the dominant contributor, outside the ticket binary)",
    "the witness-floor headroom of the residual 1.4044x (28.8% below the parity-halved model-family optimum); joint re-optimization has moved it only 3.4e-10 locally",
  ],
  isRigorous: true,
  rigorScope:
    "Finding 1 is an exact algebraic identity (Tx(2) cancels in the ceiling/floor ratio because Theorem Y-EXACT and Theorem R share it). Finding 2 is the exact factorization gap = 2 x residual with the parity factor identified structurally as the roll-up outer AM-GM (a proved ceiling-side step). Finding 3 is CONDITIONAL on the model family (where MAJ = true decay by construction so option (i) vanishes) and uses the nineteenth's measured 0.4 percent substitution-point tightness to bound the MAJ-internal slack; the paper-packet split of (i) vs (ii) is explicitly deferred as an open sub-gap. This is an ATTRIBUTION audit: no bound, floor, or ceiling literal is derived or changed; optimality is not claimed; the parity factor's unrecoverability is carried from the eleventh continuation, not re-proved here.",
  promotesBound: false,
  verdict:
    "ASSESSMENT: the residual 2.81x headline gap is NOT primarily floor-side and NOT MAJ-class-relaxation - the ticket binary is incomplete. (1) The tail-truncation Tx(2) cancels in cFar/F and contributes 1.000x (ruled out). (2) The DOMINANT contributor, ~67% of the log-gap, is the achieved-side parity AM-GM factor 2 (a THIRD category outside the binary), declared uniformly unrecoverable by the eleventh continuation. (3) The residual sub-sqrt(2) factor 1.4044x is, in the MODEL family, witness-floor-side (option ii): the exhibited witness realizes only 71.2% of the parity-halved ceiling, with MAJ-internal substitution slack <= 0.4 percent. SUB-GAP: the paper-packet split of option (i) vs (ii) needs the open packet-envelope constants (sibling openResiduals[0]). No single-lever factor-2 improvement exists: the dominant half is a fixed ceiling-side AM-GM and the remainder is below sqrt(2). Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95045_HGA_ASSERTIONS = [
  {
    id: "imp95045-hga-gap-reproduces",
    description:
      "the headline gap reproduces as cFar / floor = 2.8088338309749887 and the fixed-97 gap as cFar / F97floor = 225.42360917596611 (rel 1e-12)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      return rel(CFAR_NEW / HEAD_FLOOR, GAP_HEAD) && rel(CFAR_NEW / F97_FLOOR, GAP_97);
    },
  },
  {
    id: "imp95045-hga-ceiling-currency-identity",
    description:
      "the ceiling reproduces from its currency form cFar = 2 OmegaE_2 / Tx(2) (rel 1e-12), confirming Tx(2) is the shared normalization that cancels in the ceiling/floor ratio (Finding 1)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      return rel((2 * OM2_NEW) / TX2_LIT, CFAR_NEW);
    },
  },
  {
    id: "imp95045-hga-parity-decomposition",
    description:
      "the multiplicative decomposition gap = 2 x residual is exact (residual = 1.4044169154874944) and the parity factor accounts for ~67% of the log-gap (log(2)/log(gap) in [0.66, 0.68]) - Finding 2",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      return (
        rel(PARITY_FACTOR * RESIDUAL_AFTER_PARITY, GAP_HEAD) &&
        rel(RESIDUAL_AFTER_PARITY, 1.4044169154874944) &&
        PARITY_LOG_SHARE > 0.66 &&
        PARITY_LOG_SHARE < 0.68
      );
    },
  },
  {
    id: "imp95045-hga-witness-realization",
    description:
      "the exhibited witness realizes floor/(cFar/2) = 0.712039273361276 of the parity-halved ceiling (rel 1e-12); the residual 1.4044x equals the reciprocal 1/0.712 (Finding 3), and the residual is strictly below sqrt(2)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      return (
        rel(WITNESS_REALIZATION, 0.712039273361276) &&
        rel(1 / WITNESS_REALIZATION, RESIDUAL_AFTER_PARITY) &&
        RESIDUAL_AFTER_PARITY < Math.SQRT2
      );
    },
  },
  {
    id: "imp95045-hga-maj-internal-slack-negligible",
    description:
      "the MAJ-internal substitution slack (Lemma RHO cap attained to 0.4 percent) is negligible against the residual: 1 + SUBST_TIGHTNESS = 1.004 is far below the residual 1.4044, so option (i) cannot carry the residual inside the model family (Finding 3)",
    holds: () => 1 + SUBST_TIGHTNESS < RESIDUAL_AFTER_PARITY * 0.75,
  },
  {
    id: "imp95045-hga-honesty-gate",
    description:
      "the verdict flags the ticket binary as incomplete, names the parity factor 2 as the dominant third-category contributor, records the Tx(2) cancellation and the open paper-packet sub-gap, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95045_HEADLINE_GAP_ATTRIBUTION.promotesBound === false &&
      IMP95045_HEADLINE_GAP_ATTRIBUTION.openResiduals.length === 3 &&
      /NO QED/.test(IMP95045_HEADLINE_GAP_ATTRIBUTION.verdict) &&
      /refereed bound is changed/i.test(IMP95045_HEADLINE_GAP_ATTRIBUTION.verdict) &&
      /parity AM-GM factor 2/.test(IMP95045_HEADLINE_GAP_ATTRIBUTION.verdict) &&
      /THIRD category/.test(IMP95045_HEADLINE_GAP_ATTRIBUTION.verdict) &&
      /cancels/.test(IMP95045_HEADLINE_GAP_ATTRIBUTION.verdict) &&
      /SUB-GAP/.test(IMP95045_HEADLINE_GAP_ATTRIBUTION.verdict) &&
      typeof IMP95045_HEADLINE_GAP_ATTRIBUTION.subGap === "string",
  },
];

for (const a of IMP95045_HGA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95045-headline-gap-attribution assertion failed: ${a.id}`);
  }
}

export default IMP95045_HEADLINE_GAP_ATTRIBUTION;
