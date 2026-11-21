/**
 * @module imp-97411-krein-csharp-two-routes-synthesis-chain-cohort-index
 * @fileoverview imp-97411 -- META cross-reference index note grouping the Krein c_sharp
 *   TWO-ROUTES-REDUCE-TO-ONE-PRIMITIVE synthesis chain (imp-97136, imp-97137, imp-97350, imp-97384)
 *   as a single four-step derivation: two independent-looking lower-bound routes for
 *   c_sharp = lambda_min(P_a M_{sigma_2} P_a) at the binding half-width 2a = ln3 are scoped one at a
 *   time, then shown to collapse into ONE missing analytic primitive, then gated so future frontier
 *   work does not re-fund them as separate levers. Index/meta only; establishes nothing new; changes
 *   no bound; NO QED.
 *
 *   THE CHAIN (chronological, each step consumes the previous verdict).
 *     imp-97136 -- FEASIBILITY: assesses route (A), a Temple / Kato-Temple / Lehmann-Maehly
 *       complementary lower-bound eigenvalue certificate. Finds it NOT feasible with committed
 *       objects: Temple needs an a-priori beta with mu < beta <= lambda_2 (a rigorous LOWER bound on
 *       the SECOND eigenvalue), but Rayleigh-Ritz only ever gives the WRONG-direction bound
 *       lambda_2 <= beta_Ritz. Route (A) does not remove the missing lower-bound object -- it
 *       RELOCATES it from lambda_min to lambda_2. Declared intrinsically DEAD; not re-attempted by
 *       any later step in this chain.
 *     imp-97137 -- SCOPING: scopes route (B), a direct analytic coercivity / de Branges-space
 *       realisation T_a[sigma_2] >= c*I, N-free by construction on PW_a = H(E_a). The polynomial
 *       prefactor (t^2+1/4)^2 = |S(t)|^2 is a genuine de Branges weight supplied for free
 *       (S(z)=z^2+1/4, zeros off the real axis), but the residual weight w_1 is NOT sign-definite
 *       (w_1(0) = -6.352, negative in bands, sigma_2 dips to a negative infimum), so the trivial
 *       infimum bound is vacuous. Coercivity is EXACTLY a band-limited concentration inequality whose
 *       sharp constant IS lambda_min itself -- route (B) reformulates but does not prove.
 *     imp-97350 -- SYNTHESIS: with route (A) dead and route (B) only a reformulation, asks whether the
 *       two remaining named routes (Lehmann-Maehly/spectral-gap and de Branges coercivity) are truly
 *       independent. Finds NO: the imp-97206 measured joint limit ~0.582 is an UPPER bracket on
 *       lambda_1 and cannot instantiate the Lehmann-Maehly a-priori rho <= lambda_2 (wrong eigenvalue,
 *       wrong direction); the reason no such rho exists is the confined negative sigma_2 well
 *       (global inf -4336.198 at t=9.3502, imp-97335) which can a priori inject uncontrolled low-lying
 *       eigenvalues; bounding that concentration is EXACTLY the de Branges coercivity constant.
 *       BOTH routes reduce to ONE missing primitive: a quantitative band-limited (PW_a) concentration
 *       inequality against the confined negative sigma_2 well.
 *     imp-97384 -- GATE: records the imp-97350 synthesis as an honest-status note and activates
 *       IMP97384_DO_NOT_TREAT_AS_INDEPENDENT = true, so future frontier tickets proposing to attack
 *       Lehmann-Maehly and de Branges coercivity as two separate, independently fundable levers are
 *       redirected to the single shared primitive instead.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, the four tickets look like a feasibility
 *   rejection, a scoping note, an unrelated synthesis, and a bookkeeping gate. Read together, they are
 *   one story with a strict dependency order: (A) is closed off (imp-97136), (B) is shown to be a
 *   reformulation with a precise missing input (imp-97137), the two SURVIVING named routes
 *   (Lehmann-Maehly and de Branges, Temple/route-A already excluded) are shown to be the SAME missing
 *   input (imp-97350), and that reading is locked in as a gate against future duplicate funding
 *   (imp-97384). This index bakes that reading so a future scout does not re-attempt Temple/
 *   Kato-Temple/Lehmann-Maehly expecting a-priori spectral separation to appear, does not treat the de
 *   Branges N-free reformulation as a proof, and does not propose Lehmann-Maehly and de Branges
 *   coercivity as two independently attackable projects.
 *
 *   MEASURED/DERIVED (all feasibility verdicts and a synthesis reading; no new numerics).
 *   - route (A) (Temple family) is infeasible: the a-priori beta with mu < beta <= lambda_2 is
 *     unobtainable from Rayleigh-Ritz, which gives only the wrong-direction lambda_2 <= beta_Ritz
 *     (imp-97136).
 *   - route (B) (de Branges coercivity) is a genuine N-free reformulation (polynomial prefactor
 *     supplied for free, isometry onto H(E_a.S)) but supplies no constant c>0: coercivity is exactly
 *     the band-limited concentration inequality whose sharp constant is lambda_min itself (imp-97137).
 *   - the two routes still standing after (A) is excluded -- Lehmann-Maehly/spectral-gap and de
 *     Branges coercivity -- are NOT independent: both reduce to one missing quantitative band-limited
 *     concentration inequality against the confined negative sigma_2 well (imp-97350).
 *   - that synthesis is recorded as an active do-not-treat-as-independent gate for future frontier
 *     routing (imp-97384).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - no rigorous positive lower bound on c_sharp = lambda_min(P_a M_{sigma_2} P_a) exists at 2a=ln3;
 *     no operator positivity is established by any step in this chain.
 *   - the shared missing primitive itself -- a quantitative band-limited (PW_a) concentration /
 *     uncertainty inequality against the confined negative sigma_2 well -- is unproved.
 *   - interval-rigorous certified reach stays EXACTLY 2a<=0.96, unchanged by this whole chain.
 *
 *   STATUS: a grouping/index note over four already-completed tickets, not a new derivation. No bound
 *   changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (route A, Temple family; declared dead)
 * @see imp-97137-krein-debranges-coercivity-scope.js (route B, de Branges coercivity; scoped, no constant)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (synthesis: routes not independent)
 * @see imp-97384-krein-csharp-routes-not-independent-gate.js (gate recording + locking the synthesis)
 * @see imp-97365-krein-csharp-measured-from-above-cohort-index.js (sibling cohort index: same c_sharp object, upper-bracket measurements)
 * @see imp-97429 (sibling meta index: the broader finite-negative-floor-only-so-far family)
 *
 * Ticket: imp-97411 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

const KREIN_CSHARP_TWO_ROUTES_SYNTHESIS_CHAIN = Object.freeze([
  Object.freeze({
    id: 'imp-97136',
    step: 'feasibility',
    role: 'assesses route (A): Temple / Kato-Temple / Lehmann-Maehly complementary lower-bound eigenvalue certificate',
    result:
      'NOT feasible with committed objects: needs an a-priori beta with mu < beta <= lambda_2, but ' +
      'Rayleigh-Ritz supplies only the wrong-direction lambda_2 <= beta_Ritz; route (A) relocates the ' +
      'missing lower-bound object from lambda_min to lambda_2. Declared intrinsically DEAD.',
  }),
  Object.freeze({
    id: 'imp-97137',
    step: 'scoping',
    role: 'scopes route (B): direct analytic coercivity / de Branges-space realisation T_a[sigma_2] >= c*I',
    result:
      'genuine N-free reformulation (polynomial prefactor (t^2+1/4)^2 supplied for free by the de ' +
      'Branges frame) but supplies NO constant c>0: coercivity is exactly the band-limited ' +
      'concentration inequality whose sharp constant is lambda_min itself.',
  }),
  Object.freeze({
    id: 'imp-97350',
    step: 'synthesis',
    role: 'asks whether the two remaining named routes (Lehmann-Maehly, de Branges) are independent',
    result:
      'NO: the imp-97206 measured plateau ~0.582 cannot instantiate the Lehmann-Maehly a-priori rho ' +
      '<= lambda_2 (wrong eigenvalue/direction); both routes reduce to ONE missing quantitative ' +
      'band-limited (PW_a) concentration inequality against the confined negative sigma_2 well.',
  }),
  Object.freeze({
    id: 'imp-97384',
    step: 'gate',
    role: 'records the imp-97350 synthesis and activates a do-not-treat-as-independent gate',
    result:
      'IMP97384_DO_NOT_TREAT_AS_INDEPENDENT = true: future tickets proposing Lehmann-Maehly and de ' +
      'Branges coercivity as two separate levers are redirected to the single shared primitive.',
  }),
]);

export const IMP97411_KREIN_CSHARP_TWO_ROUTES_SYNTHESIS_CHAIN_INDEX = Object.freeze({
  id: 'imp-97411',
  proofSection: 'S-frontier',
  chain: KREIN_CSHARP_TWO_ROUTES_SYNTHESIS_CHAIN,
  measuredSignal:
    'a strict four-step dependency chain: route (A) Temple/Lehmann-Maehly is closed off as infeasible ' +
    '(imp-97136), route (B) de Branges coercivity is shown to be an N-free reformulation with no ' +
    'constant (imp-97137), the two routes still standing after (A) is excluded are shown to reduce to ' +
    'ONE missing primitive (imp-97350), and that reading is locked in as an active routing gate ' +
    '(imp-97384).',
  namedResiduals: [
    'IMP97136_TEMPLE_NEEDS_APRIORI_SPECTRAL_GAP',
    'IMP97137_DEBRANGES_COERCIVITY_NEEDS_CONCENTRATION_CONSTANT',
    'IMP97350_LOWER_BOUND_ROUTES_SHARE_BAND_LIMITED_CONCENTRATION_PRIMITIVE',
  ],
  certifiedReach: 0.96,
  templeRouteDead: true,
  twoRoutesShareOneMissingPrimitive: true,
  doNotTreatAsIndependentGateActive: true,
  lowerBoundOnCSharpProved: false,
  question:
    'The Krein c_sharp two-routes cohort (imp-97136/97137/97350/97384) reads as a feasibility check, a ' +
    'scoping note, a synthesis, and a bookkeeping gate. Grouped as a chain, does it show that every ' +
    'named route to a positive lower bound on c_sharp collapses to a single missing primitive, and is ' +
    'that reading locked in against future duplicate funding?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The chain runs: route (A) (Temple/Kato-Temple/' +
    'Lehmann-Maehly) is infeasible and DEAD because the required a-priori spectral separation ' +
    'beta <= lambda_2 cannot be obtained from Rayleigh-Ritz, which only ever gives the wrong-direction ' +
    'bound (imp-97136); route (B) (de Branges coercivity) is a genuine N-free reformulation but its ' +
    'coercivity constant IS lambda_min itself, so it supplies no proof (imp-97137); the two routes the ' +
    'ticket originally names as alternatives (Lehmann-Maehly/spectral-gap and de Branges coercivity) ' +
    'are then shown NOT independent -- both reduce to the same missing quantitative band-limited ' +
    '(PW_a) concentration inequality against the confined negative sigma_2 well (imp-97350); and that ' +
    'synthesis is locked in as an active do-not-treat-as-independent gate for future frontier routing ' +
    '(imp-97384). No rigorous positive lower bound on c_sharp = lambda_min(P_a M_{sigma_2} P_a) exists ' +
    'at 2a=ln3; no operator positivity is established; interval-rigorous certified reach stays EXACTLY ' +
    '2a<=0.96, unchanged by this whole chain. Future work on this thread should treat Temple/' +
    'Kato-Temple/Lehmann-Maehly as closed, the de Branges realisation as a reformulation not a proof, ' +
    'and Lehmann-Maehly vs de Branges as ONE project, not two. Establishes nothing new; moves no bound; ' +
    'RH open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97136 (Temple/Kato-Temple/Lehmann-Maehly feasibility; declared dead); imp-97137 (de Branges ' +
    'coercivity scoping; N-free reformulation, no constant); imp-97350 (synthesis: two routes share one ' +
    'missing primitive); imp-97384 (gate recording + locking the synthesis).',
  ln3: LN3,
});

export default IMP97411_KREIN_CSHARP_TWO_ROUTES_SYNTHESIS_CHAIN_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97411_KREIN_CSHARP_TWO_ROUTES_SYNTHESIS_CHAIN_INDEX_ASSERTIONS = [
  {
    id: 'imp97411-chain-has-all-four-members-in-order',
    why: 'The whole point of the index is grouping exactly these four tickets in their dependency ' +
      'order; a missing or reordered member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97411_KREIN_CSHARP_TWO_ROUTES_SYNTHESIS_CHAIN_INDEX.chain.map((c) => c.id);
      return (
        ids.length === 4 &&
        ids[0] === 'imp-97136' &&
        ids[1] === 'imp-97137' &&
        ids[2] === 'imp-97350' &&
        ids[3] === 'imp-97384'
      );
    },
  },
  {
    id: 'imp97411-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them without ' +
      're-reading all four tickets.',
    holds: () => {
      const idx = IMP97411_KREIN_CSHARP_TWO_ROUTES_SYNTHESIS_CHAIN_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 3 &&
        idx.templeRouteDead === true &&
        idx.twoRoutesShareOneMissingPrimitive === true &&
        idx.doNotTreatAsIndependentGateActive === true &&
        idx.lowerBoundOnCSharpProved === false &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3
      );
    },
  },
  {
    id: 'imp97411-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97411_KREIN_CSHARP_TWO_ROUTES_SYNTHESIS_CHAIN_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97411_KREIN_CSHARP_TWO_ROUTES_SYNTHESIS_CHAIN_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97411_KREIN_CSHARP_TWO_ROUTES_SYNTHESIS_CHAIN_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97411_KREIN_CSHARP_TWO_ROUTES_SYNTHESIS_CHAIN_INDEX.verdict),
  },
];

for (const assertion of IMP97411_KREIN_CSHARP_TWO_ROUTES_SYNTHESIS_CHAIN_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97411-krein-csharp-two-routes-synthesis-chain-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
