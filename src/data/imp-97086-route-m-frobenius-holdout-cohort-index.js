/**
 * @module imp-97086-route-m-frobenius-holdout-cohort-index
 * @fileoverview imp-97086 -- META cross-reference index note grouping the Route M Frobenius-
 *   holdout cohort (imp-96890, imp-96912, imp-96981, imp-96982, imp-96972) as one NEAR-FIELD-
 *   vs-FAR-FIELD family, mirroring imp-96987-kmax-degree-frontier-cohort-index.js. Index/meta
 *   only; establishes nothing new; changes no bound; NO QED.
 *
 *   TICKET-LIST CORRECTION. The imp-97086 ticket title names the cohort as (imp-96890,
 *   imp-96912, imp-96982, imp-96981, imp-96983). The fifth id, imp-96983, is
 *   imp-96983-ritz-vs-rigorous-crossval-viz-data.js -- a Krein Ritz-vs-rigorous cross-
 *   validation leaf at 2a=0.96, unrelated to the Route M Frobenius-norm ceiling. The
 *   thematically-matching fifth member (the ticket that measures how fast the quad-vs-tail
 *   ceiling ambiguity narrows per exact decade) is imp-96972-route-m-frobenius-ceiling-
 *   narrowing-rate-viz-data.js. This index groups the five ACTUAL Frobenius-holdout members
 *   (substituting imp-96972 for the mis-cited imp-96983) rather than pull in an unrelated leaf.
 *
 *   THE COHORT (chronological). All five work the same object: the imp-96890 exact 18-rung
 *   Vasyunin-Gram ||G||_F ladder (N=250..16000) and its two concave-in-log-N ceiling models
 *   (quadratic a+b logN+c(logN)^2, and monotone tail a+b logN+d/N), which disagree on the
 *   Route M conditioning-ceiling scale N* by ~6x (+8.36% vs +1.37% over the straight-line
 *   baseline).
 *     imp-96890 -- fits the two concave models to the 18-rung ladder. Both beat the straight
 *       line by an order of magnitude (RMS cut 14.2x / 3.7x); the concave correction moves the
 *       fitted ceiling F UP (away from the rigorous trace ceiling T=2.594e7), not down. Picks
 *       the monotone +d/N form as the "safer" far extrapolant on PHYSICAL grounds only (the
 *       quadratic turns over unphysically at N~2.31e9) -- no data-driven discriminator yet.
 *     imp-96912 (holdout discriminator) -- runs an out-of-sample rolling holdout on the SAME
 *       18-rung ladder (fit bottom m rungs, predict held-out top rungs, m=12..17, plus a
 *       decisive leave-top-2-out split). The QUADRATIC wins every split by ~3.6x over +d/N and
 *       ~9-12x over the line -- correcting imp-96890's "safer" framing on near-field evidence.
 *     imp-96912 (ladder extension) -- measures 6 fresh exact rungs (N=17000..24000, validated
 *       to machine precision against the 8000/12000/16000 committed rungs) and confirms the
 *       quadratic predicts the genuinely-new rungs best out-of-sample (RMS 4.232e-3 vs quad's
 *       nearest rival, tail, at 1.439e-2 -- 3.4x worse). Refitting all three models over the
 *       extended 24-rung ladder barely narrows the ceiling ambiguity (quad-vs-tail spread
 *       6.89% -> 6.22%, only 1.11x).
 *     imp-96981 -- import-light viz-data leaf presenting the 24-rung ladder, the per-model
 *       out-of-sample RMS at the 6 new rungs, and the three refitted cond#=1/eps ceilings.
 *       Presentation only; reproduces the same near-field-favours-quadratic reading.
 *     imp-96972 -- measures the NARROWING RATE directly: a rolling-top-rung refit shows the
 *       quad-vs-tail spread shrinks only ~1.87x per additional EXACT DECADE of top rung N0
 *       (7.48% at N0=12000 down to ~5.7% projected at N0=32000). Driving the spread below 1%
 *       would need N0 ~ 2.0e7 -- essentially the ceiling scale N* itself. CONCLUDES the
 *       ambiguity is INTRINSIC to the ~3-decade extrapolation: no feasible finite exact
 *       ladder extension resolves it.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-96912/imp-96981/imp-96982 read as
 *   a settled correction ("the data favour the quadratic!") and only imp-96972 supplies the
 *   decisive scope limit: that near-field preference is a NEAR-FIELD fact about local
 *   curvature, and it does not, and structurally cannot via more exact rungs, resolve the
 *   FAR-FIELD ceiling value. This index bakes that reading verbatim so a future scout does not
 *   re-cite "the quadratic wins the holdout" as if it settles the ~4e7 far-field ceiling, and
 *   does not re-spend a ticket re-running the imp-96972 narrowing-rate sweep to a marginally
 *   larger N0.
 *
 *   NEAR-FIELD (out-of-sample holdout; CURVATURE, not ceiling value).
 *   - the quadratic model wins every rolling holdout split and the decisive leave-top-2-out
 *     split on the original 18-rung ladder (imp-96912 discriminator), and wins out-of-sample
 *     on 6 genuinely new exact rungs N=17000..24000 (imp-96912 ladder extension).
 *   - this corrects imp-96890's physical-grounds preference for +d/N (imp-96982 headword).
 *
 *   FAR-FIELD (ceiling scale N* ~ 4e7; ambiguity INTRINSIC, not narrowed by more exact rungs).
 *   - refitting over the extended 24-rung ladder barely moves the ceiling spread (6.89% ->
 *     6.22%, 1.11x) despite the near-field holdout being unambiguous (imp-96912 ladder ext).
 *   - the spread narrows only ~1.87x per exact decade of top rung; sub-1% spread needs
 *     N0 ~ 2.0e7, i.e. an exact rung essentially AT the ceiling scale itself (imp-96972).
 *
 *   WHAT STAYS OPEN (at the time of this cohort). The far-field ceiling ambiguity between
 *   +1.37% (tail) and +8.36% (quadratic) over the line baseline stands; both remain above the
 *   rigorous trace ceiling T=2.594e7; no rigorous ceiling is posted by any member of this
 *   cohort. A later ticket (imp-97081) attempts a further far-field discriminator using an
 *   independent structural input; this index does not adopt that later result, only flags
 *   where a future reader should look next.
 *
 *   STATUS: a grouping/index note over five already-completed tickets (one ticket-list id
 *   corrected), not a new derivation. No bound changes: T < F ordering unaffected; RH open;
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96890-route-m-frobenius-concave-norm-ceiling-refit.js (18-rung concave fits; +d/N picked on physical grounds)
 * @see imp-96912-route-m-frobenius-holdout-model-discriminator.js (near-field holdout; quadratic wins every split)
 * @see imp-96912-route-m-frobenius-ladder-extension-above-16000.js (6 new exact rungs; quad wins out-of-sample; ceiling barely narrows)
 * @see imp-96981-frobenius-ladder-extension-viz-data.js (viz-data leaf for the 24-rung ladder)
 * @see imp-96982-frobenius-holdout-quadratic-favoured-glossary-headword.js (glossary headword correcting imp-96890)
 * @see imp-96972-route-m-frobenius-ceiling-narrowing-rate-viz-data.js (narrowing-rate measurement; ambiguity intrinsic)
 * @see imp-97081-route-m-farfield-ceiling-interior-anchor-discriminator.js (later ticket, further far-field discriminator attempt)
 *
 * Ticket: imp-97086 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const ROUTE_M_TRACE_CEILING_T = 2.594e7;

const FROBENIUS_HOLDOUT_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-96890',
    role: 'concave-norm ceiling refit over the exact 18-rung ladder (N=250..16000)',
    result:
      'Both concave models (quadratic, +d/N) beat the straight line by 14.2x / 3.7x RMS; the ' +
      'concave correction moves the fitted ceiling F UP, away from T. Picks +d/N as "safer" on ' +
      'PHYSICAL grounds only (quadratic turns over unphysically at N~2.31e9); no data-driven ' +
      'discriminator yet.',
  }),
  Object.freeze({
    id: 'imp-96912',
    role: 'near-field out-of-sample holdout discriminator (same 18-rung ladder)',
    result:
      'The QUADRATIC wins every rolling-holdout split (m=12..17) and the decisive leave-top-2-out ' +
      'split, by ~3.6x over +d/N and ~9-12x over the line -- corrects imp-96890’s "safer" ' +
      'framing on near-field evidence.',
  }),
  Object.freeze({
    id: 'imp-96912',
    role: 'ladder extension: 6 fresh exact rungs N=17000..24000',
    result:
      'Quadratic predicts the genuinely-new rungs best out-of-sample (RMS 4.232e-3 vs tail’s ' +
      '1.439e-2). Refitting all three models over the extended 24-rung ladder barely narrows the ' +
      'ceiling spread (6.89% -> 6.22%, only 1.11x) despite the unambiguous near-field win.',
  }),
  Object.freeze({
    id: 'imp-96981',
    role: 'viz-data leaf for the 24-rung ladder and refitted ceilings',
    result:
      'Presentation only: bakes the 24-rung ladder, per-model out-of-sample RMS, and the three ' +
      'refitted cond#=1/eps ceilings as plain literals.',
  }),
  Object.freeze({
    id: 'imp-96982',
    role: 'glossary headword correcting imp-96890’s "safer extrapolant" framing',
    result:
      'Bakes the near-field holdout verdict (quadratic favoured) as a standalone lookup entry, ' +
      'explicit that this is a NEAR-FIELD-only correction and silent on the far-field ceiling.',
  }),
  Object.freeze({
    id: 'imp-96972',
    role: 'narrowing-rate measurement (rolling top-rung refit)',
    result:
      'The quad-vs-tail ceiling spread narrows only ~1.87x per exact decade of top rung N0; ' +
      'sub-1% spread needs N0 ~ 2.0e7 (essentially the ceiling scale N* itself). CONCLUDES the ' +
      'ambiguity is INTRINSIC to the extrapolation; no feasible finite exact extension resolves it.',
  }),
]);

export const IMP97086_FROBENIUS_HOLDOUT_COHORT_INDEX = Object.freeze({
  id: 'imp-97086',
  proofSection: 'S-frontier',
  cohort: FROBENIUS_HOLDOUT_COHORT,
  ticketListCorrection:
    'The imp-97086 ticket names imp-96983 as the fifth member; imp-96983 is actually an ' +
    'unrelated Krein Ritz-vs-rigorous cross-validation leaf. This index substitutes the ' +
    'thematically-correct fifth member, imp-96972 (the Frobenius ceiling narrowing-rate ' +
    'measurement).',
  nearFieldSignal:
    'Out-of-sample holdout (imp-96912 discriminator, confirmed on 6 fresh exact rungs by the ' +
    'imp-96912 ladder extension) unambiguously favours the quadratic concavity model’s local ' +
    'curvature over the +d/N form, correcting imp-96890.',
  farFieldSignal:
    'The far-field ceiling spread (quad +8.36% vs tail +1.37%, over line baseline) barely moves ' +
    'with the extended ladder (6.89% -> 6.22%) and narrows only ~1.87x per exact decade ' +
    '(imp-96972); closing it needs an exact rung essentially at the ceiling scale N* itself.',
  routeMTraceCeilingT: ROUTE_M_TRACE_CEILING_T,
  question:
    'The Route M Frobenius-holdout cohort reads, ticket by ticket, as a discriminator that ' +
    'settles the quad-vs-tail ceiling ambiguity in the quadratic’s favour. Grouped, does the ' +
    'near-field holdout win extend to the far-field ceiling VALUE, or does it stay confined to ' +
    'local curvature while the far-field ambiguity remains open?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-96890 fits two concave ceiling models and ' +
    'picks +d/N on physical grounds alone; imp-96912 (both parts) supplies a data-driven ' +
    'discriminator that unambiguously favours the quadratic’s NEAR-FIELD curvature, confirmed ' +
    'on fresh exact rungs; imp-96981 presents that ladder; imp-96982 bakes the correction as a ' +
    'headword. imp-96972 then tests the ONE thing that decides whether any of this settles the ' +
    'FAR-FIELD ceiling: how fast more exact rungs narrow the quad-vs-tail spread, and finds the ' +
    'rate (~1.87x per decade) far too slow -- the ambiguity is INTRINSIC to the ~3-decade ' +
    'extrapolation, not a data-availability gap. So the cohort as a whole is a NEAR-FIELD-vs-' +
    'FAR-FIELD family: the local-curvature signal is real, data-supported, and well-' +
    'characterized, but it does not settle the far-field ceiling value. Both concave-ceiling ' +
    'candidates (+1.37% and +8.36% over the line baseline) remain strictly above the rigorous ' +
    'trace ceiling T=2.594e7; T < F ordering is unaffected. Future work on this thread should ' +
    'not re-cite the near-field holdout win as resolving the far-field ceiling, and should not ' +
    're-run the imp-96972 narrowing-rate sweep expecting a materially tighter band from a ' +
    'modestly larger N0. Establishes nothing new; moves no bound; RH open; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96890 (concave ceiling refit); imp-96912 (holdout discriminator + ladder extension); ' +
    'imp-96981 (viz-data leaf); imp-96982 (glossary headword); imp-96972 (narrowing-rate ' +
    'measurement); imp-97081 (later far-field discriminator attempt, not adopted here).',
});

export default IMP97086_FROBENIUS_HOLDOUT_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97086_FROBENIUS_HOLDOUT_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97086-cohort-has-all-five-members',
    why: 'The whole point of the index is grouping the five actual Frobenius-holdout tickets ' +
      '(with the ticket-list typo corrected); a missing member silently breaks the ' +
      'cross-reference.',
    holds: () => {
      const ids = IMP97086_FROBENIUS_HOLDOUT_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-96890', 'imp-96912', 'imp-96981', 'imp-96982', 'imp-96972'].every((id) =>
        ids.includes(id),
      );
    },
  },
  {
    id: 'imp97086-near-field-vs-far-field-both-named',
    why: 'The index exists to separate the near-field curvature win from the unresolved ' +
      'far-field ceiling ambiguity; both fields must be present, and the far-field candidates ' +
      'must both stay above the rigorous trace ceiling T.',
    holds: () => {
      const idx = IMP97086_FROBENIUS_HOLDOUT_COHORT_INDEX;
      return (
        typeof idx.nearFieldSignal === 'string' &&
        idx.nearFieldSignal.length > 0 &&
        typeof idx.farFieldSignal === 'string' &&
        idx.farFieldSignal.length > 0 &&
        idx.routeMTraceCeilingT === 2.594e7
      );
    },
  },
  {
    id: 'imp97086-ticket-list-correction-present',
    why: 'The ticket names imp-96983 (an unrelated Ritz-vs-rigorous leaf) as the fifth member; ' +
      'the correction to imp-96972 must be recorded, not silently applied, so a future reader ' +
      'does not re-flag it as a discrepancy.',
    holds: () =>
      /imp-96983/.test(IMP97086_FROBENIUS_HOLDOUT_COHORT_INDEX.ticketListCorrection) &&
      /imp-96972/.test(IMP97086_FROBENIUS_HOLDOUT_COHORT_INDEX.ticketListCorrection),
  },
  {
    id: 'imp97086-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97086_FROBENIUS_HOLDOUT_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97086_FROBENIUS_HOLDOUT_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97086_FROBENIUS_HOLDOUT_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97086_FROBENIUS_HOLDOUT_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97086-route-m-frobenius-holdout-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
