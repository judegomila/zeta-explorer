/**
 * @module imp-97092-polefree-to-weil-obstruction-cohort-index
 * @fileoverview imp-97092 -- META cross-reference index note grouping the pole-free-to-Weil
 *   obstruction cohort (imp-97036, imp-97049, the semilocal Sonine excess port, the flow-blindness
 *   no-go) as one axis-level obstruction family, mirroring the imp-96987 kmax-degree cohort index.
 *   Read individually, a scout may clear or re-attempt a single named blocker and mistake it for
 *   the whole gap between the certified pole-free T_a[sigma_2] >= 0 reach and full Weil positivity.
 *   Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (logical order, not chronological). All four assemble or bound the same gap: the
 *   interval-verified T_a[sigma_2] >= 0 pole-free certificate (2a <= 0.96) is NOT by itself full
 *   Weil / operator positivity.
 *     imp-97036 -- assembles the interpretive obstruction as ONE object for the first time: the
 *       pole-free <=> T_a[sigma_2]>=0 equivalence is exact and survives in full (not the gap); the
 *       Rayleigh/Courant-Fischer direction problem blocks reading the Galerkin lambda_min TABLE as a
 *       proof past 2a=0.96; and the only assembled pole-free -> full bridge (semilocal Sonine/excess
 *       D_S <= L_S) is obstructed at 2a=ln2 and not gap-free below ln3 either. Closes with SUB-GAP
 *       IMP97036_NO_INDEPENDENT_POLEFREE_TO_FULL_BRIDGE, explicitly NOT proving the named blockers
 *       are the only ones.
 *     imp-97049 -- resolves that completeness question: SORTS the obstructions into three
 *       ORTHOGONAL axes (REACH; POLE TERM; CRITERION COMPLETENESS) and proves the two blockers named
 *       in imp-97036/the ticket title (LP wall + Rayleigh direction) both live on Axis I (REACH)
 *       alone, so they cannot exhaust a gap that also spans Axis II and Axis III.
 *     rh-route-i-sonine-excess-semilocal-port-2026-09-23 -- the concrete instance living on Axis II
 *       (POLE TERM): the only assembled pole-free -> full-Weil bridge. The excess eps_S inherits
 *       EXACTLY HALF of the rho=2 log cusp, so the CC sufficient condition E_S o Q <= c|ghat(0)|^2
 *       is FALSE for every 2a > ln2 = 0.6931 -- strictly INSIDE the certified 0.96 reach -- with no
 *       finite-rank fix, and even below ln2 the identity is not gap-free (D_S is 96.7-99.71% of the
 *       trace on the minimiser).
 *     flow-blindness-no-go -- the concrete instance living on Axis III (CRITERION COMPLETENESS): an
 *       unconditional theorem (resting only on Rodgers-Tao Lambda>=0) that the backward de Bruijn
 *       flow Phi -> e^{-eps u^2}Phi stays inside every soft/flow-stable class yet still produces a
 *       non-real zero for every eps>0. So no soft, estimate-only, support-uniform strategy -- which
 *       is exactly what closing Axis III (per-support slice -> the full Weil cone) would require --
 *       can ever prove RH; arithmetic input is unavoidable.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-97036 and the Sonine/flow-blindness
 *   modules each look like isolated named blockers that a future scout might try to clear one at a
 *   time, mistaking any single clearance for closing the pole-free-to-Weil gap. Read together, the
 *   cohort is one assembly (97036), one completeness proof sorting the assembly into three
 *   orthogonal axes (97049), and the two hardest concrete instances within Axis II and Axis III
 *   (Sonine excess; flow-blindness) -- the latter carrying a PROVEN no-go, not merely an open task.
 *   This index bakes that reading verbatim so future work does not re-cite a single-axis clearance
 *   (e.g. a fully re-verified certificate reaching 2a=1.00, which only moves Axis I) as sufficient
 *   for full Weil positivity, and does not re-attempt the Sonine bridge past 2a=ln2 or a soft/
 *   estimate-only closure of Axis III, both already shown negative.
 *
 *   AXIS-LEVEL STRUCTURE (imp-97049's sort, restated).
 *   - AXIS I -- REACH (extend the certified support past 2a=0.96). Contains BOTH blockers named in
 *     imp-97036/the ticket title as two faces of ONE obstruction: the 0.96-1.00 LP double-precision
 *     conditioning wall, and the Rayleigh/Courant-Fischer direction problem (a finite Galerkin
 *     family bounds lambda_min only from the wrong-signed side).
 *   - AXIS II -- POLE TERM (pole-free -> FULL Weil form). Independent of Axis I: the semilocal
 *     Sonine/excess bridge D_S <= L_S is obstructed at 2a=ln2, strictly INSIDE the certified 0.96
 *     reach, so pushing Axis I does nothing for Axis II.
 *   - AXIS III -- CRITERION COMPLETENESS (per-support slice -> the full Weil cone over every
 *     support). Carries the flow-blindness no-go: a PROVEN obstruction, not an open task, ruling out
 *     any soft/estimate-only closure regardless of progress on Axes I-II.
 *
 *   WHAT STAYS OPEN. Axis I: whether a fully-converged / finer-grid interval certificate can push
 *   the rigorous reach past 0.96 (untested past the current LP wall). Axis II: whether ANY non-
 *   Sonine pole-free -> full bridge exists (none attempted). Axis III: closed to soft means by the
 *   no-go; only an arithmetic-input strategy remains conceivable, none assembled.
 *
 *   STATUS: a grouping/index note over four already-committed modules, not a new derivation. No
 *   bound changes: interval-rigorous certified reach stays 2a<=0.96; the operator floor is a
 *   Rayleigh UPPER bound (no operator positivity established past 0.96); RH open; NO QED.
 *   Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * @see imp-97036-taplsigma2-to-weil-interpretive-obstruction.js (the three-component assembly this indexes)
 * @see imp-97049-polefree-to-weil-obstruction-enumeration.js (the three-axis sort + exhaustiveness proof)
 * @see rh-route-i-sonine-excess-semilocal-port-2026-09-23.js (Axis II concrete instance; obstructed at 2a=ln2)
 * @see flow-blindness-no-go.js (Axis III concrete instance; proven soft-means no-go)
 * @see imp-96987-kmax-degree-frontier-cohort-index.js (the sibling cohort-index this mirrors)
 *
 * Ticket: imp-97092 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

const LN2 = Math.log(2); // 0.6931471805599453
const LN3 = Math.log(3); // 1.0986122886681098

const POLEFREE_TO_WEIL_OBSTRUCTION_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97036',
    role: 'assembles the interpretive pole-free -> full-Weil obstruction as one object',
    result:
      'The pole-free <=> T_a[sigma_2]>=0 equivalence is exact and survives in full (NOT the gap). ' +
      'The Rayleigh-upper-bound direction blocks reading the Galerkin lambda_min table as a proof ' +
      'past 2a=0.96. The only assembled pole-free -> full bridge (Sonine/excess D_S<=L_S) is ' +
      'obstructed at 2a=ln2 and not gap-free below ln3. Leaves open whether the named blockers are ' +
      'the ONLY ones (SUB-GAP IMP97036_NO_INDEPENDENT_POLEFREE_TO_FULL_BRIDGE).',
  }),
  Object.freeze({
    id: 'imp-97049',
    role: 'completeness test: do the two named blockers exhaust the gap?',
    result:
      'NO. Sorts the gap into THREE orthogonal axes -- REACH, POLE TERM, CRITERION COMPLETENESS. ' +
      'The two named blockers (LP wall; Rayleigh direction) are both faces of Axis I (REACH) alone. ' +
      'Axis II (pole-free -> full Weil form) and Axis III (per-support slice -> full cone) are ' +
      'independent and unresolved even where Axis I already holds. Axis-level enumeration is ' +
      'structurally complete; the specific blockers within each axis are not provably exhaustive.',
  }),
  Object.freeze({
    id: 'rh-route-i-sonine-excess-semilocal-port-2026-09-23',
    role: 'Axis II concrete instance: the only assembled pole-free -> full-Weil bridge',
    result:
      'The excess eps_S inherits EXACTLY HALF of the rho=2 log cusp (0.7071/0.3536/0.3536 per ' +
      'log_2). The CC sufficient condition E_S o Q <= c|ghat(0)|^2 is FALSE for every 2a > ln2 = ' +
      '0.6931 -- strictly inside the certified 0.96 reach -- with no finite-rank fix; not gap-free ' +
      'below ln2 either (remainder 96.7-99.71% of the trace on the minimiser).',
  }),
  Object.freeze({
    id: 'flow-blindness-no-go',
    role: 'Axis III concrete instance: proven no-go against any soft closure of the criterion',
    result:
      'THEOREM (unconditional, rests on Rodgers-Tao Lambda>=0): the backward de Bruijn flow ' +
      'Phi -> e^{-eps u^2}Phi stays inside every soft/flow-stable class yet produces a non-real ' +
      'zero for every eps>0. No soft, estimate-only, support-uniform strategy can prove RH; ' +
      'arithmetic (Euler-product) input is required.',
  }),
]);

export const IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX = Object.freeze({
  id: 'imp-97092',
  proofSection: 'S-frontier',
  cohort: POLEFREE_TO_WEIL_OBSTRUCTION_COHORT,
  axisI: 'REACH: LP double-precision conditioning wall (0.96-1.00) + Rayleigh/Courant-Fischer direction problem -- two faces of one obstruction.',
  axisII: 'POLE TERM: semilocal Sonine/excess bridge D_S<=L_S obstructed at 2a=ln2=0.6931, strictly inside the certified 0.96 reach.',
  axisIII: 'CRITERION COMPLETENESS: per-support slice vs the full Weil cone; carries the PROVEN flow-blindness no-go against any soft closure.',
  certifiedReach: 0.96,
  question:
    'The pole-free-to-Weil obstruction cohort (imp-97036, imp-97049, the semilocal Sonine excess ' +
    'port, flow-blindness no-go) reads as separate tickets naming separate blockers. Grouped, does ' +
    'clearing any single named blocker (e.g. extending the LP-certified reach) close the gap to ' +
    'full Weil positivity, or does the gap span independent axes that a single clearance cannot ' +
    'touch?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-97036 assembles the obstruction and names two ' +
    'blockers (LP wall; Rayleigh direction); imp-97049 proves those two blockers are both faces of ' +
    'a single axis (REACH) and that two further INDEPENDENT axes -- POLE TERM (Sonine bridge, ' +
    'obstructed at 2a=ln2, inside the certified 0.96 reach) and CRITERION COMPLETENESS (per-support ' +
    'slice vs the full cone, carrying the proven flow-blindness no-go) -- also separate the ' +
    'certificate from full Weil positivity. So the cohort as a whole is a single-axis-named-vs-' +
    'three-axes-real family: clearing Axis I alone (e.g. pushing the interval-certified reach past ' +
    '0.96) would not touch Axis II or Axis III, and Axis III is additionally closed to any soft/' +
    'estimate-only strategy by an unconditional theorem. Future work on this thread should not re-' +
    'cite a single-axis clearance as sufficient for full Weil positivity, should not re-attempt the ' +
    'Sonine bridge past 2a=ln2 (already shown false with no finite-rank fix), and should not attempt ' +
    'a soft/support-uniform closure of Axis III (ruled out by flow-blindness). Certified reach stays ' +
    'EXACTLY 2a<=0.96; establishes nothing new; moves no bound; RH open; NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97036 (interpretive obstruction assembly); imp-97049 (three-axis enumeration + ' +
    'exhaustiveness proof); rh-route-i-sonine-excess-semilocal-port-2026-09-23 (Axis II instance, ' +
    'obstructed at 2a=ln2); flow-blindness-no-go (Axis III instance, proven no-go); ' +
    'imp-96987-kmax-degree-frontier-cohort-index.js (sibling cohort-index this mirrors).',
  ln2: LN2,
  ln3: LN3,
});

export default IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97092-cohort-has-all-four-members',
    why: 'The whole point of the index is grouping exactly these four modules; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX.cohort.map((c) => c.id);
      return [
        'imp-97036',
        'imp-97049',
        'rh-route-i-sonine-excess-semilocal-port-2026-09-23',
        'flow-blindness-no-go',
      ].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97092-three-axes-named-and-ordered',
    why: 'The index exists to separate the single-axis named blockers from the three-axis real ' +
      'structure; all three axis fields must be present and the reach must sit strictly between ' +
      'ln2 (Axis II obstruction) and ln3 (ultimate target), matching the committed literals.',
    holds: () => {
      const idx = IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX;
      return (
        typeof idx.axisI === 'string' && /REACH/.test(idx.axisI) &&
        typeof idx.axisII === 'string' && /POLE TERM/.test(idx.axisII) &&
        typeof idx.axisIII === 'string' && /CRITERION COMPLETENESS/.test(idx.axisIII) &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach > idx.ln2 &&
        idx.certifiedReach < idx.ln3
      );
    },
  },
  {
    id: 'imp97092-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX.verdict) &&
      /remains SOTA/.test(IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97092-polefree-to-weil-obstruction-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
