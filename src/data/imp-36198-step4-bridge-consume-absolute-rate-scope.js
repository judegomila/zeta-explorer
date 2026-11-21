/**
 * @module imp-36198-step4-bridge-consume-absolute-rate-scope
 *
 * imp-36198 (proof/scoping, S-frontier): enumerate -- WITHOUT claiming any is
 * discharged -- the BRIDGE-SIDE ingredients the Step-4 E(N) bridge (imp-345,
 * G6_polymath15_bridge) concretely needs in order to CONSUME any per-N rate
 * r(N) as an ABSOLUTE |t_c(N)| bound. imp-36164 stages the G5-perN-translation
 * arc and names a bridge-side blocker SEPARATE from the source-side anchor:
 * "the E(N) bridge's ability to consume any Route-B rate absolutely" is flagged
 * STILL OPEN, distinct in KIND from producing the rate FORM.
 *
 * TWO SIDES, ONE ARC (the distinction this module isolates)
 * -----------------------------------------------------------------------------
 * SOURCE side (already scoped, imp-36082 / imp-36164 Stage 3): Route B supplies
 *   the explicit per-N rate r(N) = C_prime sqrt(log gamma_N) N^{-1/4}, but it
 *   bounds the shock-time DEVIATION |t_c(m_N) - t_c(m_infinity)|, NOT |t_c(N)|
 *   absolutely. Converting deviation -> absolute needs a per-N-usable ANCHOR on
 *   t_c(m_infinity) that re-imports GUE/ESY rigidity. Status of that side:
 *   CONSUMABLE-MODULO-ANCHOR. THAT is the rate-PRODUCING obstruction.
 * BRIDGE side (THIS ticket): SUPPOSE an absolute per-N bound |t_c(N)| <= r(N)
 *   were in hand. What must the E(N) bridge itself provide to ACCEPT it and turn
 *   it into a Lambda statement? These are ORTHOGONAL to the anchor: they concern
 *   the bridge's consumption machinery, not the rate's source.
 *
 * WHERE |t_c(N)| ENTERS THE BRIDGE (imp-345, G6_polymath15_bridge)
 * -----------------------------------------------------------------------------
 * The bridge assembles the master inequality  |Lambda - (-t_c(N))| <= E(N)  with
 *   E(N) = E_trunc(N) + E_flow(N) + E_coll(N), and
 *   E_flow(N) <= C_F * log T_0(N)/T_0(N) * exp(C_G * |t_c(N)|).
 * So |t_c(N)| appears TWICE, absolutely, on the bridge's own side:
 *   (i)  in the IDENTIFICATION term -(t_c(N)) that Lambda is pinned against, and
 *   (ii) inside the E_flow EXPONENT exp(C_G * |t_c(N)|).
 * But the bridge currently consumes for t_c neither a per-N absolute bound: it
 * consumes (a) the imp-344 ASYMPTOTIC surfacing a = lim sup_{N->inf} |t_c(N)| = 0
 * (an asymptotic intercept, not a per-N value), and (b) a CONSTANT ILLUSTRATIVE
 * placeholder tcAssumedBound = 0.01 fed into the E_flow exponent. Neither is a
 * per-N rate r(N). The consumption SLOT for an absolute |t_c(N)| exists
 * structurally (the E_flow exponent), but it is wired to a constant, not to r(N).
 *
 * THE BRIDGE-SIDE INGREDIENTS A FULL "CONSUME r(N) ABSOLUTELY" WOULD REQUIRE
 * -----------------------------------------------------------------------------
 * B1 (per-N absolute-input slot): the bridge's `consumes` interface must accept a
 *    per-N absolute bound |t_c(N)| <= r(N). Today it ingests only the imp-344
 *    asymptotic lim-sup (a = 0) and the constant placeholder tcAssumedBound; there
 *    is NO per-N t_c(N) consumption point. OPEN -- interface/bookkeeping, RH-free.
 * B2 (E_flow monotone substitution): exp is monotone increasing, so a genuine
 *    absolute cap |t_c(N)| <= r(N) gives E_flow(N) <= C_F*(log T_0/T_0)*exp(C_G*r(N)),
 *    with the constant placeholder tcAssumedBound = 0.01 replaced by the vanishing
 *    rate. The bridge must state this substitution and re-verify the E(N) ladder
 *    stays finite/decreasing with |t_c(N)| = r(N) rather than 0.01. A DEVIATION
 *    bound does NOT cap this exponent (t_c(m_infinity) is unpinned at finite N),
 *    which is exactly why the SOURCE-side anchor is needed first. OPEN, RH-free.
 * B3 (two-sided identification): the master |Lambda - (-t_c(N))| <= E(N) needs a
 *    TWO-SIDED absolute cap |t_c(N)| <= r(N) (both signs), since Lambda is pinned
 *    against -(t_c(N)) from either side; a one-sided deviation rate is
 *    insufficient. OPEN -- the lim-sup gives only the asymptotic two-sided a = 0,
 *    not a per-N two-sided cap. RH-free (rides on the source anchor).
 * B4 (constant-gate orthogonality -- necessary NOT sufficient): even a fully
 *    consumed absolute r(N) yields only |Lambda| <= r(N) + E(N); it does NOT touch
 *    the E(N) -> 0 conclusion, which stays GATED on the N-uniform leading constant
 *    C_star, dominated by the RH-HARD C_H (imp-2640 NEGATIVE, imp-35147
 *    RH-equivalent). So bridge consumption of r(N) is NECESSARY but NOT SUFFICIENT
 *    for a Lambda conclusion; it bounds -(t_c(N)), never E(N). The RH-hard leg.
 *
 * WHY THIS IS DISTINCT FROM THE SOURCE-SIDE ANCHOR (imp-36082 / imp-36164)
 * -----------------------------------------------------------------------------
 * The source-side blocker is that r(N) bounds a DEVIATION and the ANCHOR on
 * t_c(m_infinity) that would absolutize it re-imports GUE/ESY. The bridge-side
 * ingredients here are a SEPARATE question: given an absolute r(N), can the
 * bridge machinery ingest it? B1-B3 are RH-free interface/monotonicity/two-
 * sidedness obligations on the bridge; only B4 is RH-hard, and B4 is precisely
 * the pre-existing C_H gate (imp-2640) that is ORTHOGONAL to the per-N rate --
 * consuming r(N) does not soften it, and closing it does not supply r(N).
 *
 * SCOPING / ASSESSMENT ONLY. Discharges no obligation; supplies no anchor; pins
 * no rate; consumes no r(N); verifies no inequality; establishes no positivity;
 * respects the imp-2519 no-overclaim guard; C_mb GUE-conditional (imp-486)
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see src/data/lambda-polymath15-bridge.js (imp-345 G6_polymath15_bridge: master |Lambda-(-t_c(N))| <= E(N), E_flow exp(C_G|t_c(N)|), tcAssumedBound=0.01 placeholder)
 * @see src/data/imp-36164-perN-translation-storyline-cross-reference.js (flags "the E(N) bridge's ability to consume any Route-B rate absolutely" STILL OPEN)
 * @see src/data/imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (source-side: r(N) bounds DEVIATION, CONSUMABLE-MODULO-ANCHOR)
 * @see imp-344 (asymptotic surfacing a = lim sup |t_c(N)| = 0, the bridge's current t_c input), imp-341 (Koksma-Hlawka lim-sup)
 * @see imp-2640 (C_H NEGATIVE), imp-35147 (G6a minimal-gap modulus effectively RH-EQUIVALENT) -- the B4 RH-hard gate
 * @see imp-36194 (companion Step-4 E_trunc/E_flow constant-discharge scope), imp-36195 (assembled-E(N)-ladder-verify scope)
 */

// -- Anchor + operative constants (import-light; matching imp-36194) -----------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scope
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 ordinate count anchor at T_PT

// The two places |t_c(N)| enters the bridge, and the placeholders currently fed.
const C_G_PLACEHOLDER = 1; // illustrative Gronwall rate in the bridge ansatz (imp-345)
const TC_ASSUMED_BOUND_PLACEHOLDER = 0.01; // the CONSTANT placeholder in the E_flow exponent (imp-345)
// exp is monotone increasing: an absolute cap |t_c(N)| <= r(N) with r(N) <= 0.01
// gives a SMALLER E_flow exponent than the constant placeholder -- the B2 substitution.
const EXP_AT_PLACEHOLDER = Math.exp(C_G_PLACEHOLDER * TC_ASSUMED_BOUND_PLACEHOLDER); // ~1.01005
const R_N_ILLUSTRATIVE = 1e-3; // a vanishing r(N) sample, strictly below the placeholder
const EXP_AT_RATE = Math.exp(C_G_PLACEHOLDER * R_N_ILLUSTRATIVE); // < EXP_AT_PLACEHOLDER

// The bridge-side ingredients (B1, B2, B3 RH-free; B4 the RH-hard orthogonal gate).
const RH_FREE_INGREDIENTS = ['B1', 'B2', 'B3'];
const RH_HARD_INGREDIENTS = ['B4'];

export const IMP36198_STEP4_BRIDGE_CONSUME_ABSOLUTE_RATE_SCOPE = {
  id: 'imp-36198',
  proofSection: 'S-frontier',
  question:
    'Enumerate the BRIDGE-SIDE ingredients the Step-4 E(N) bridge (imp-345, G6_polymath15_bridge) needs ' +
    'to CONSUME any per-N rate r(N) as an ABSOLUTE |t_c(N)| bound -- distinct from the source-side anchor ' +
    'that would PRODUCE such an absolute rate (imp-36082 / imp-36164 Stage 3). Scoping only; consumes no ' +
    'rate; discharges no obligation; changes no bound; NO QED.',
  masterInequality: '|Lambda - (-t_c(N))| <= E(N),  E(N) = E_trunc(N) + E_flow(N) + E_coll(N)  (imp-345)',
  whereTcEnters: {
    identification:
      'the term -(t_c(N)) that Lambda is pinned against in |Lambda - (-t_c(N))| <= E(N) -- needs |t_c(N)| absolutely',
    eflowExponent:
      'E_flow(N) <= C_F * log T_0(N)/T_0(N) * exp(C_G * |t_c(N)|) -- |t_c(N)| sits in the exponent, absolutely',
    currentInputs:
      'the bridge consumes only the imp-344 ASYMPTOTIC surfacing a = lim sup |t_c(N)| = 0, plus a CONSTANT ' +
      'illustrative placeholder tcAssumedBound = ' + TC_ASSUMED_BOUND_PLACEHOLDER + ' in the E_flow exponent; ' +
      'there is NO per-N r(N) consumption point',
  },
  twoSides: {
    sourceSide:
      'imp-36082 / imp-36164 Stage 3: r(N) bounds the DEVIATION |t_c(m_N) - t_c(m_infinity)|, not |t_c(N)|; ' +
      'absolutizing it needs a per-N ANCHOR on t_c(m_infinity) that re-imports GUE/ESY. Rate-PRODUCING obstruction.',
    bridgeSide:
      'THIS ticket: given an absolute |t_c(N)| <= r(N), what must the bridge itself provide to ACCEPT it? ' +
      'Orthogonal to the anchor -- concerns the consumption machinery, not the rate source.',
  },
  ingredients: {
    B1_perNAbsoluteInputSlot:
      'OPEN: the bridge `consumes` interface must accept a per-N absolute bound |t_c(N)| <= r(N); today it ' +
      'ingests only the imp-344 asymptotic lim-sup (a = 0) and the constant tcAssumedBound placeholder -- no ' +
      'per-N t_c(N) slot. Interface/bookkeeping, RH-FREE.',
    B2_eflowMonotoneSubstitution:
      'OPEN: exp monotone increasing => |t_c(N)| <= r(N) gives E_flow(N) <= C_F*(log T_0/T_0)*exp(C_G*r(N)), ' +
      'replacing the constant tcAssumedBound = ' + TC_ASSUMED_BOUND_PLACEHOLDER + ' by the vanishing rate; ' +
      'must re-verify the E(N) ladder stays finite/decreasing. A DEVIATION bound does NOT cap the exponent ' +
      '(t_c(m_infinity) unpinned at finite N). RH-FREE (rides on the source anchor).',
    B3_twoSidedIdentification:
      'OPEN: the master |Lambda - (-t_c(N))| <= E(N) needs a TWO-SIDED absolute cap |t_c(N)| <= r(N); a ' +
      'one-sided deviation rate is insufficient. The lim-sup gives only the asymptotic two-sided a = 0. RH-FREE.',
    B4_constantGateOrthogonality:
      'OPEN (the RH-hard leg): even a fully consumed absolute r(N) yields only |Lambda| <= r(N) + E(N); it does ' +
      'NOT touch E(N) -> 0, which stays GATED on the N-uniform C_star dominated by the RH-HARD C_H (imp-2640 ' +
      'NEGATIVE, imp-35147 RH-equivalent). Consuming r(N) bounds -(t_c(N)), never E(N): NECESSARY not SUFFICIENT.',
  },
  distinctFromSourceAnchor: {
    sourceObstruction:
      'r(N) bounds a DEVIATION; the ANCHOR on t_c(m_infinity) that would absolutize it re-imports GUE/ESY rigidity',
    bridgeObstruction:
      'given an absolute r(N), the bridge needs B1 a per-N input slot, B2 the monotone E_flow substitution, ' +
      'B3 two-sidedness -- all RH-free -- and still faces B4, the orthogonal RH-hard C_H gate',
    orthogonality:
      'B1-B3 concern the bridge machinery, the anchor concerns the rate source; only B4 is RH-hard, and B4 is ' +
      'the pre-existing C_H gate (imp-2640) that consuming r(N) does not soften and that closing does not supply r(N)',
  },
  conclusion: {
    bridgeSideMostlyRHFree:
      'the bridge-side consumption of an absolute r(N) is THREE RH-free ingredients (B1 per-N input slot, B2 ' +
      'monotone E_flow substitution, B3 two-sided identification) plus ONE orthogonal RH-hard gate (B4 = C_H), ' +
      'categorically SEPARATE from the source-side GUE/ESY anchor obligation',
    noBoundMovesOnItsOwn:
      'even a fully consumable absolute r(N) moves NO Lambda bound on its own: it bounds -(t_c(N)) by r(N)+E(N), ' +
      'but E(N) -> 0 stays gated on the RH-hard C_H (imp-2640 NEGATIVE); the bridge remains BLOCKED at C_H',
  },
  isRigorous: false,
  verdict:
    'SCOPING / ASSESSMENT (frontier-direction, NOT rigorous). The Step-4 E(N) bridge (imp-345, ' +
    'G6_polymath15_bridge) carries |t_c(N)| absolutely in TWO places -- the identification term -(t_c(N)) in ' +
    '|Lambda - (-t_c(N))| <= E(N), and the E_flow exponent exp(C_G*|t_c(N)|) -- but currently consumes for t_c ' +
    'only the imp-344 ASYMPTOTIC surfacing a = lim sup |t_c(N)| = 0 plus a CONSTANT illustrative placeholder ' +
    'tcAssumedBound = 0.01, never a per-N rate r(N). Consuming any per-N r(N) ABSOLUTELY is a BRIDGE-SIDE ' +
    'obligation DISTINCT IN KIND from the source-side anchor (imp-36082 / imp-36164 Stage 3: r(N) bounds a ' +
    'DEVIATION and absolutizing it re-imports GUE/ESY). It needs FOUR ingredients: B1 a per-N absolute-input ' +
    'slot in the bridge `consumes` interface (today only the asymptotic lim-sup + the constant placeholder); ' +
    'B2 the monotone E_flow substitution E_flow <= C_F*(log T_0/T_0)*exp(C_G*r(N)) with the ladder re-verified ' +
    '(a deviation bound does NOT cap the exponent); B3 the two-sided absolute cap |t_c(N)| <= r(N) the ' +
    'identification needs (a one-sided deviation is insufficient); and B4, the orthogonal RH-HARD gate -- even ' +
    'a consumed absolute r(N) yields only |Lambda| <= r(N) + E(N), while E(N) -> 0 stays GATED on the N-uniform ' +
    'C_star dominated by C_H (imp-2640 NEGATIVE, imp-35147 RH-equivalent). B1, B2, B3 are RH-FREE ' +
    'interface/monotonicity/two-sidedness obligations on the bridge; only B4 is RH-hard, and B4 is the ' +
    'pre-existing C_H gate ORTHOGONAL to the per-N rate: consuming r(N) does not soften it, and closing it does ' +
    'not supply r(N). Consuming r(N) is NECESSARY but NOT SUFFICIENT -- it bounds -(t_c(N)), never E(N). ' +
    'Discharges no obligation; supplies no anchor; pins no rate; consumes no r(N); verifies no inequality; ' +
    'establishes no positivity; moves NO Lambda bound; imp-2519 no-overclaim guard preserved; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'lambda-polymath15-bridge.js (imp-345 G6_polymath15_bridge: master |Lambda-(-t_c(N))| <= E(N), E_flow ' +
    'exp(C_G|t_c(N)|), tcAssumedBound=0.01 placeholder, C_G illustrative); imp-36164 (flags "the E(N) bridge\'s ' +
    'ability to consume any Route-B rate absolutely" STILL OPEN); imp-36082 (source-side: r(N) bounds DEVIATION, ' +
    'CONSUMABLE-MODULO-ANCHOR); imp-344 (asymptotic surfacing a = lim sup |t_c(N)| = 0); imp-341 (Koksma-Hlawka ' +
    'lim-sup); imp-2640 (C_H NEGATIVE); imp-35147 (G6a minimal-gap modulus RH-EQUIVALENT); imp-36194 / imp-36195 ' +
    '(companion Step-4 constant-discharge / ladder-verify scopes).',
};

export const IMP36198_STEP4_BRIDGE_CONSUME_ABSOLUTE_RATE_SCOPE_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-36194.
    id: 'imp36198-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 ordinate count anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // The E_flow exponent is monotone: an absolute cap r(N) <= 0.01 gives a
    // SMALLER exponent than the constant placeholder tcAssumedBound -- the B2 point.
    id: 'imp36198-eflow-monotone-substitution',
    description: 'exp monotone: r(N)=1e-3 gives exp(C_G r(N)) < exp(C_G * tcAssumedBound=0.01) (B2)',
    holds: () =>
      TC_ASSUMED_BOUND_PLACEHOLDER === 0.01 &&
      C_G_PLACEHOLDER === 1 &&
      R_N_ILLUSTRATIVE < TC_ASSUMED_BOUND_PLACEHOLDER &&
      EXP_AT_RATE < EXP_AT_PLACEHOLDER &&
      Math.abs(EXP_AT_PLACEHOLDER - Math.exp(0.01)) < 1e-12,
  },
  {
    // Four named bridge-side ingredients; B1/B2/B3 RH-free, B4 the RH-hard gate.
    id: 'imp36198-four-ingredients-three-rh-free',
    description: 'Four ingredients B1/B2/B3/B4; B1-B3 RH-free, B4 the orthogonal RH-hard C_H gate',
    holds: () => {
      const ing = IMP36198_STEP4_BRIDGE_CONSUME_ABSOLUTE_RATE_SCOPE.ingredients;
      return (
        Object.keys(ing).length === 4 &&
        RH_FREE_INGREDIENTS.length === 3 &&
        RH_HARD_INGREDIENTS.length === 1 &&
        /RH-FREE/.test(ing.B1_perNAbsoluteInputSlot) &&
        /RH-FREE/.test(ing.B2_eflowMonotoneSubstitution) &&
        /RH-FREE/.test(ing.B3_twoSidedIdentification) &&
        /RH-hard|RH-HARD/.test(ing.B4_constantGateOrthogonality) &&
        /C_H/.test(ing.B4_constantGateOrthogonality)
      );
    },
  },
  {
    // The two |t_c(N)| entry points and the current non-per-N inputs are recorded,
    // and the bridge/source distinction is preserved.
    id: 'imp36198-two-entry-points-and-distinction',
    description: 'Records |t_c(N)| in identification + E_flow exponent; distinct from source-side anchor',
    holds: () => {
      const w = IMP36198_STEP4_BRIDGE_CONSUME_ABSOLUTE_RATE_SCOPE.whereTcEnters;
      const d = IMP36198_STEP4_BRIDGE_CONSUME_ABSOLUTE_RATE_SCOPE.distinctFromSourceAnchor;
      return (
        /Lambda/.test(w.identification) &&
        /exp\(C_G/.test(w.eflowExponent) &&
        /asymptotic|lim sup/.test(w.currentInputs) &&
        /tcAssumedBound/.test(w.currentInputs) &&
        /DEVIATION/.test(d.sourceObstruction) &&
        /GUE\/ESY/.test(d.sourceObstruction) &&
        /orthogonal/.test(d.bridgeObstruction)
      );
    },
  },
  {
    // Honesty gate: scoping only; necessary-not-sufficient; no bound moved; no QED; no refereed bound is changed.
    id: 'imp36198-honesty-gate',
    description: 'Scoping only; consuming r(N) necessary-not-sufficient; changes no bound; no QED; no refereed bound is changed',
    holds: () =>
      IMP36198_STEP4_BRIDGE_CONSUME_ABSOLUTE_RATE_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /NECESSARY not SUFFICIENT/.test(IMP36198_STEP4_BRIDGE_CONSUME_ABSOLUTE_RATE_SCOPE.ingredients.B4_constantGateOrthogonality) &&
      /moves NO Lambda bound/.test(IMP36198_STEP4_BRIDGE_CONSUME_ABSOLUTE_RATE_SCOPE.conclusion.noBoundMovesOnItsOwn) &&
      /NO QED/.test(IMP36198_STEP4_BRIDGE_CONSUME_ABSOLUTE_RATE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP36198_STEP4_BRIDGE_CONSUME_ABSOLUTE_RATE_SCOPE.verdict),
  },
];

for (const a of IMP36198_STEP4_BRIDGE_CONSUME_ABSOLUTE_RATE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36198-step4-bridge-consume-absolute-rate-scope assertion failed: ${a.id}`);
  }
}

export default IMP36198_STEP4_BRIDGE_CONSUME_ABSOLUTE_RATE_SCOPE;
