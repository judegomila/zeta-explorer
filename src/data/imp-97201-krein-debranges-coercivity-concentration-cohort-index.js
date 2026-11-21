/**
 * @module imp-97201-krein-debranges-coercivity-concentration-cohort-index
 * @fileoverview imp-97201 -- META cross-reference index note grouping the Route I de Branges
 *   coercivity / concentration-constant cohort (imp-97121, imp-97137, imp-97161) as a single
 *   C_SHARP-ONLY-BOUNDED-FROM-ABOVE family: all three scope, reformulate, or assess the SAME missing
 *   object -- a proven positive lower bound on c_sharp = lambda_min(P_a M_{sigma_2} P_a) at the binding
 *   half-width 2a = ln3 -- and none supplies one. Index/meta only; establishes nothing new; changes no
 *   bound; NO QED.
 *
 *   THE COHORT (chronological). All three scope the same object: an N-INDEPENDENT positive lower bound
 *   on the Route I Krein floor c_sharp = lambda_min(T_a[sigma_2]) at 2a = ln3.
 *     imp-97121 -- scopes what a uniform-in-N Krein floor certificate would require beyond the fixed-N
 *       interval-rigorous reach (2a<=0.96); shows every committed floor (Legendre 0.577015 @ N=52 ->
 *       0.533852 @ N=100; shift-invert 0.607102 @ Nbig=24 -> 0.475606 @ Nbig=240, fixed T=800) is a
 *       Rayleigh-Ritz UPPER bound, still descending with no extractable rate, and names the two
 *       admissible routes to a lower-bound object: (A) Temple/Kato-Temple (needs an a-priori spectral
 *       gap) or (B) direct analytic coercivity / de Branges realisation. Names SUB-GAP
 *       IMP97121_UNIFORM_N_FLOOR_NEEDS_LOWER_BOUND_OBJECT.
 *     imp-97137 -- scopes route (B): reformulates coercivity T_a[sigma_2] >= c*I as an N-free
 *       concentration inequality on the Paley-Wiener/de Branges space PW_a = H(E_a). The polynomial
 *       prefactor (t^2+1/4)^2 is supplied for free (non-negative, structural isometry), but the residual
 *       weight w_1 is sign-indefinite (w_1(0)=-6.352, negative in recurring cos(t ln2) bands), so the
 *       trivial infimum bound is vacuous and the sharp constant c_sharp = lambda_min itself -- a
 *       reformulation, not a proof. Names SUB-GAP
 *       IMP97137_DEBRANGES_COERCIVITY_NEEDS_CONCENTRATION_CONSTANT.
 *     imp-97161 -- assesses whether Beurling-Selberg extremal functions or flat Slepian prolate
 *       eigenvalues supply the missing concentration constant named by imp-97137; both fail (minorant
 *       route is circular -- a type-2a minorant reproduces the identical truncated-Toeplitz positivity;
 *       flat-prolate hypotheses of a single bounded dip against a uniform far floor are violated by the
 *       recurring, unbounded-depth dip). Pins the exact extremal object: c_sharp = lambda_min of the
 *       truncated convolution kernel Ksig = (D^2+1/4)^2[Karch + Kprime] on |u|<=ln3, whose only in-band
 *       arithmetic datum is the single prime cosine at frequency ln2. Names SUB-GAP
 *       IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-97121 reads as a numerical-floor scoping
 *   note, imp-97137 as an operator-theoretic reformulation, and imp-97161 as a feasibility assessment of
 *   two named extremal tools. Read together, the cohort is one story: every route toward a proven
 *   N-independent positive floor for c_sharp funnels into the SAME unresolved object -- the bottom
 *   eigenvalue of the weighted concentration operator on PW_a -- and every attempt to supply it (the
 *   de Branges reformulation, Beurling-Selberg, flat Slepian) either restates the target or fails its
 *   hypotheses. This index bakes that reading so a future scout does not re-attempt Beurling-Selberg or
 *   flat-prolate arguments expecting them to close the gap, and does not mistake a still-descending
 *   Rayleigh-Ritz floor for a certified lower bound.
 *
 *   MEASURED/DERIVED (all upper-bound estimates or negative feasibility results; NOT a positive lower
 *   bound).
 *   - the finite-N Rayleigh-Ritz floors descend and have not stabilised: Legendre 0.577015 (N=52) ->
 *     0.533852 (N=100); shift-invert 0.607102 (Nbig=24) -> 0.475606 (Nbig=240), fixed T=800 (imp-97121).
 *   - the de Branges realisation supplies the polynomial prefactor (t^2+1/4)^2 for free but not the
 *     constant; the sharp c_sharp is exactly lambda_min itself, a reformulation not a proof (imp-97137).
 *   - neither Beurling-Selberg extremal functions nor flat Slepian prolate eigenvalues supply a provable
 *     c>0; the precise missing input is a Fejer-Riesz margin or a weighted-PSWF uncertainty inequality,
 *     neither proved (imp-97161).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - no N-independent, proven positive lower bound on c_sharp = lambda_min(P_a M_{sigma_2} P_a) exists at
 *     2a = ln3; all three named sub-gaps stay open.
 *   - route (A) (Temple/Kato-Temple) remains untried in this cohort; route (B) (de Branges coercivity) is
 *     reformulated (imp-97137) and assessed (imp-97161) but not closed.
 *   - operator positivity past the fixed-N interval-rigorous reach is NOT established; that reach stays
 *     2a<=0.96.
 *
 *   STATUS: a grouping/index note over three already-completed tickets, not a new derivation. No bound
 *   changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-97121-krein-uniform-n-floor-certificate-scope.js (scopes the missing uniform-N lower-bound object)
 * @see imp-97137-krein-debranges-coercivity-scope.js (reformulates route (B) as an N-free concentration inequality)
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (assesses -- and rejects -- Beurling-Selberg / flat Slepian)
 * @see imp-97154-krein-uniform-n-ritz-insufficiency-cohort-index.js (sibling cohort index sharing member imp-97121)
 *
 * Ticket: imp-97201 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

const KREIN_DEBRANGES_COERCIVITY_CONCENTRATION_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97121',
    role: 'scopes what a uniform-in-N Krein floor certificate at 2a=ln3 would require',
    result:
      'every committed Rayleigh-Ritz floor is an UPPER bound and still descends with no extractable ' +
      'rate (Legendre 0.577015@N=52 -> 0.533852@N=100; shift-invert 0.607102@Nbig=24 -> ' +
      '0.475606@Nbig=240); names two admissible lower-bound routes, (A) Temple/Kato-Temple and (B) ' +
      'de Branges coercivity. Names SUB-GAP IMP97121_UNIFORM_N_FLOOR_NEEDS_LOWER_BOUND_OBJECT.',
  }),
  Object.freeze({
    id: 'imp-97137',
    role: 'scopes route (B): direct analytic coercivity / de Branges-space realisation',
    result:
      'reformulates T_a[sigma_2] >= c*I as an N-free concentration inequality on PW_a; the polynomial ' +
      'prefactor (t^2+1/4)^2 is supplied for free but the residual weight w_1 is sign-indefinite, so the ' +
      'sharp constant c_sharp = lambda_min itself -- a reformulation, not a proof. Names SUB-GAP ' +
      'IMP97137_DEBRANGES_COERCIVITY_NEEDS_CONCENTRATION_CONSTANT.',
  }),
  Object.freeze({
    id: 'imp-97161',
    role: 'assesses whether Beurling-Selberg or flat Slepian prolate bounds supply the missing constant',
    result:
      'both fail: the minorant route is circular and flat-prolate hypotheses (single bounded dip, ' +
      'uniform far floor) are violated by the recurring unbounded-depth dip. Pins the extremal object ' +
      'and names SUB-GAP IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN.',
  }),
]);

export const IMP97201_KREIN_DEBRANGES_COERCIVITY_CONCENTRATION_COHORT_INDEX = Object.freeze({
  id: 'imp-97201',
  proofSection: 'S-frontier',
  cohort: KREIN_DEBRANGES_COERCIVITY_CONCENTRATION_COHORT,
  measuredSignal:
    'every route toward a proven N-independent positive floor for c_sharp = lambda_min(T_a[sigma_2]) ' +
    'funnels into the same unresolved object -- the bottom eigenvalue of the weighted concentration ' +
    'operator on PW_a -- and every attempt to supply it (de Branges reformulation imp-97137, ' +
    'Beurling-Selberg / flat Slepian imp-97161) either restates the target or fails its hypotheses, ' +
    'while the Rayleigh-Ritz floors imp-97121 measures keep descending from above.',
  namedResiduals: [
    'IMP97121_UNIFORM_N_FLOOR_NEEDS_LOWER_BOUND_OBJECT',
    'IMP97137_DEBRANGES_COERCIVITY_NEEDS_CONCENTRATION_CONSTANT',
    'IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN',
  ],
  certifiedReach: 0.96,
  lowerBoundOnCSharpProved: false,
  question:
    'The Route I de Branges coercivity / concentration-constant cohort (imp-97121/97137/97161) reads as ' +
    'three separate tickets. Grouped, does any of the two named routes (Temple/Kato-Temple or de Branges ' +
    'coercivity) supply a proven N-independent positive lower bound on c_sharp, or does the cohort as a ' +
    'whole show c_sharp is only ever bounded from above?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-97121 scopes the missing uniform-N lower-bound object ' +
    'and names two admissible routes; imp-97137 reformulates route (B) as an N-free concentration ' +
    'inequality on PW_a but supplies no constant (the sharp c_sharp = lambda_min itself, no free lunch); ' +
    'imp-97161 assesses -- and rejects -- the two standard tools (Beurling-Selberg extremal functions, ' +
    'flat Slepian prolate eigenvalues) that might have supplied that constant. So the cohort as a whole ' +
    'is a C_SHARP-ONLY-BOUNDED-FROM-ABOVE family: every quantity measured or reformulated across these ' +
    'three tickets bounds c_sharp = lambda_min(P_a M_{sigma_2} P_a) from above (Rayleigh-Ritz) or ' +
    'restates it (de Branges reformulation), none from below, and route (A) (Temple/Kato-Temple) ' +
    'remains untried in this cohort. No operator positivity is established past the fixed-N reach; ' +
    'interval-rigorous certified reach stays EXACTLY 2a<=0.96, unchanged by this whole cohort. Future ' +
    'work on this thread should not re-attempt Beurling-Selberg or flat-prolate arguments expecting them ' +
    'to close the gap, and should treat all three named sub-gaps as still open. Establishes nothing new; ' +
    'moves no bound; RH open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97121 (uniform-N floor certificate scoping); imp-97137 (de Branges coercivity scoping); ' +
    'imp-97161 (concentration lower-bound assessment).',
  ln3: LN3,
});

export default IMP97201_KREIN_DEBRANGES_COERCIVITY_CONCENTRATION_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97201_KREIN_DEBRANGES_COERCIVITY_CONCENTRATION_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97201-cohort-has-all-three-members',
    why: 'The whole point of the index is grouping exactly these three tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97201_KREIN_DEBRANGES_COERCIVITY_CONCENTRATION_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97121', 'imp-97137', 'imp-97161'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97201-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them without ' +
      're-reading all three tickets.',
    holds: () => {
      const idx = IMP97201_KREIN_DEBRANGES_COERCIVITY_CONCENTRATION_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.includes('IMP97121_UNIFORM_N_FLOOR_NEEDS_LOWER_BOUND_OBJECT') &&
        idx.namedResiduals.includes('IMP97137_DEBRANGES_COERCIVITY_NEEDS_CONCENTRATION_CONSTANT') &&
        idx.namedResiduals.includes(
          'IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN',
        ) &&
        idx.lowerBoundOnCSharpProved === false &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3
      );
    },
  },
  {
    id: 'imp97201-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97201_KREIN_DEBRANGES_COERCIVITY_CONCENTRATION_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97201_KREIN_DEBRANGES_COERCIVITY_CONCENTRATION_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97201_KREIN_DEBRANGES_COERCIVITY_CONCENTRATION_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97201_KREIN_DEBRANGES_COERCIVITY_CONCENTRATION_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97201_KREIN_DEBRANGES_COERCIVITY_CONCENTRATION_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97201-krein-debranges-coercivity-concentration-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
