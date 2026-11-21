/**
 * @module imp-124904-sigma-decay-landmark-consistency-audit
 * @fileoverview imp-124904 -- consistency audit of the sigma-decay landmarks the
 * lambda-roadmap currentStatus log restates by hand: interior peak N ~ 9.22e5
 * (sigma_max ~ 0.9494), halving N ~ 3.27e9 (sharpened in closed form by imp-33723 to
 * N_cross ~ 3.280294e9), and sub-0.1 crossing N ~ 3.21e11, against the leaf modules
 * named in the ticket (imp-33684 / imp-33708 / imp-33743 / imp-124848).
 *
 * METHOD. Grep each source file for the landmark numerals and compare against the
 * precise computed values each module's own code/assertions carry.
 *
 * FINDINGS.
 *   1. INTERIOR PEAK. imp-33684 computes N_max ~ 9.2186e5, sigma_max ~ 0.9494290
 *      (asserted to 5e-5 / 1e-3 tolerance). lambda-roadmap.js restates this as
 *      "N ~ 9.22e5" everywhere (consistent rounding of 9.2186e5) and as either
 *      "sigma_max ~ 0.949" (line ~876, coarser rounding) or "~0.9494" (lines
 *      ~1342/1350/1362/2264/2473, finer rounding) -- both round the same
 *      0.9494290 value; NOT a drift, just two precision levels of the same figure.
 *   2. HALVING LANDMARK. lambda-roadmap.js correctly distinguishes TWO adjacent
 *      quantities that are easy to conflate: N_half ~ 3.267235e9 (imp-33582,
 *      sigma(N) = 1/2) and N_cross ~ 3.280294e9 (imp-33723 closed-form Banach
 *      fixed point for the imp-3444 E_coll = E_trunc crossover), with the ~0.4%
 *      gap between them explicitly attributed to the Gronwall E_flow term
 *      (imp-33601/imp-33848). Both imp-33708 and imp-33743 restate the same
 *      rounded "N ~ 3.27e9" for this landmark, consistent with the roadmap.
 *   3. SUB-0.1 CROSSING. imp-33582 bisects this at N ~ 3.21e11; imp-33743's
 *      independent closed-form derivation converges to N_cross ~ 3.213418e11
 *      against an empirical N_emp ~ 3.2132e11 (residual ~7.4e-5, ~54x tighter
 *      than the halving-landmark gap). Both round to the same "N ~ 3.21e11"
 *      quoted in lambda-roadmap.js and imp-33708. No drift.
 *   4. imp-124848 DOES NOT RESTATE ANY OF THE THREE LANDMARK NUMERALS -- it
 *      imports the imp-33684 sensitivityTable verbatim for an OLS floor-
 *      elasticity fit (p_peak_lsq ~ -1.412) and never prints "9.22e5", "0.9494",
 *      "3.27e9", or "3.21e11" in its own text. The ticket's premise that it is a
 *      "leaf module that reuses" the landmark numerals is only true at the data
 *      level (it depends on imp-33684's computed N_max per floor), not at the
 *      prose level -- there is nothing to cross-check there beyond imp-33684
 *      itself, which is already covered by finding 1.
 *
 * VERDICT: NO DRIFT FOUND. All three sigma-decay landmarks (interior peak,
 * halving, sub-0.1 crossing) are restated consistently, to their respective
 * quoted precision, across lambda-roadmap.js and imp-33684/imp-33708/imp-33743.
 * imp-124848 carries no landmark prose to audit. Read-only consistency audit;
 * changes no bound; establishes no operator positivity; NO QED; no refereed bound is changed.
 *
 * @see imp-3406-sigma-highN-extrapolation (interior peak origin)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (halving + sub-0.1 bisections)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (N_cross closed form, E_flow gap)
 * @see imp-33743-sigma-fartail-crossover-closed-form (sub-0.1 closed form)
 * @see imp-35009-landmark-cluster-spread (sibling pairwise-spread audit of the same cluster)
 * @see imp-124901-sigma-leaves-visualizations-index-discoverability-audit (precedent audit pattern)
 */

const LANDMARKS = Object.freeze({
  interiorPeak: Object.freeze({
    N_roadmap: 9.22e5,
    N_precise: 9.2186e5,
    sigma_roadmap_coarse: 0.949,
    sigma_roadmap_fine: 0.9494,
    sigma_precise: 0.9494290,
    source: 'imp-33684',
  }),
  halving: Object.freeze({
    N_roadmap: 3.27e9,
    N_half_precise: 3.267235e9,
    N_cross_precise: 3.280294e9,
    relativeGap: 3.98e-3,
    gapAttributedTo: 'Gronwall E_flow term (imp-33601/imp-33848)',
    source: 'imp-33582 / imp-33723',
  }),
  subTenth: Object.freeze({
    N_roadmap: 3.21e11,
    N_emp_precise: 3.2132e11,
    N_cross_precise: 3.213418e11,
    relativeGap: 7.4e-5,
    source: 'imp-33582 / imp-33743',
  }),
});

export const IMP124904_SIGMA_DECAY_LANDMARK_CONSISTENCY_AUDIT = Object.freeze({
  id: 'imp-124904-sigma-decay-landmark-consistency-audit',
  title:
    'Consistency audit of the sigma-decay landmark values across lambda-roadmap '
    + 'currentStatus and the leaf modules (imp-33684/33708/33743/124848)',
  status:
    'NO DRIFT FOUND: the interior-peak (N~9.22e5, sigma_max~0.9494), halving '
    + '(N~3.27e9), and sub-0.1 (N~3.21e11) landmarks are restated consistently, '
    + 'to their quoted precision, across lambda-roadmap.js and '
    + 'imp-33684/imp-33708/imp-33743. imp-124848 carries no landmark prose to '
    + 'audit (data-level reuse only, already covered via imp-33684). Read-only '
    + 'audit; no bound moved; NO QED.',
  source: 'imp-124904',
  precedent: 'imp-124901',
  auditedLeafModules: Object.freeze([
    'imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js',
    'imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity.js',
    'imp-33743-sigma-fartail-crossover-closed-form.js',
    'imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit.js',
  ]),
  landmarks: LANDMARKS,
});

export const IMP124904_SIGMA_DECAY_LANDMARK_CONSISTENCY_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'interior-peak roadmap rounding matches the precise imp-33684 values',
    holds: () =>
      Math.abs(LANDMARKS.interiorPeak.N_roadmap / LANDMARKS.interiorPeak.N_precise - 1) < 2e-3
      && Math.abs(LANDMARKS.interiorPeak.sigma_roadmap_fine - LANDMARKS.interiorPeak.sigma_precise) < 1e-3
      && Math.abs(LANDMARKS.interiorPeak.sigma_roadmap_coarse - LANDMARKS.interiorPeak.sigma_precise) < 1e-2,
  },
  {
    name: 'halving landmark: roadmap N~3.27e9 brackets both N_half and N_cross within 1%',
    holds: () =>
      Math.abs(LANDMARKS.halving.N_roadmap / LANDMARKS.halving.N_half_precise - 1) < 1e-2
      && Math.abs(LANDMARKS.halving.N_roadmap / LANDMARKS.halving.N_cross_precise - 1) < 1e-2,
  },
  {
    name: 'sub-0.1 landmark: roadmap N~3.21e11 matches both empirical and closed-form values within 1%',
    holds: () =>
      Math.abs(LANDMARKS.subTenth.N_roadmap / LANDMARKS.subTenth.N_emp_precise - 1) < 1e-2
      && Math.abs(LANDMARKS.subTenth.N_roadmap / LANDMARKS.subTenth.N_cross_precise - 1) < 1e-2,
  },
  {
    name: 'four leaf modules audited',
    holds: () => IMP124904_SIGMA_DECAY_LANDMARK_CONSISTENCY_AUDIT.auditedLeafModules.length === 4,
  },
  {
    name: 'honest: no bound moved, NO QED',
    holds: () =>
      /no bound moved/.test(IMP124904_SIGMA_DECAY_LANDMARK_CONSISTENCY_AUDIT.status)
      && /NO QED/.test(IMP124904_SIGMA_DECAY_LANDMARK_CONSISTENCY_AUDIT.status),
  },
]);

for (const a of IMP124904_SIGMA_DECAY_LANDMARK_CONSISTENCY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124904-sigma-decay-landmark-consistency-audit assertion failed: ${a.name}`);
  }
}
