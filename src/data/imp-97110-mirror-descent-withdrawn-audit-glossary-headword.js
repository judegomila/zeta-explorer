/**
 * @module imp-97110-mirror-descent-withdrawn-audit-glossary-headword
 * @fileoverview imp-97110 -- import-light glossary/Concepts headword recording the imp-97085
 *   closed audit: the withdrawn mirror-mean-pointwise Lambda ~ 0.1035/0.0809 reading (an
 *   inconsistent baseline against the correct Palm neutral-lattice baseline) and the corrected
 *   Palm-profile flow model (Lambda ~ 0.132 seam / 0.118 one-slot / 0.099 N1*).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-audit)
 *   -----------------------------------------------
 *   rh-bridge-mirror-descent-2026-09-25.js section C1 withdrew an early reading -- "Lambda 0.1035
 *   / 0.0809 if the mirror mean held pointwise" -- because it was inconsistent against the correct
 *   Palm (conditioned-on-a-zero) neutral-lattice baseline; H_desc-mirror demands a local SURPLUS
 *   of ~1.73x the neutral mirror count, not "no shortage". imp-97085 then swept src/data,
 *   src/pages, and src/components for any surviving uncorrected citation of the withdrawn value
 *   or its "no shortage" framing and found none: the only two files carrying the numbers already
 *   state the withdrawal inline. This headword bakes that closed audit and both models (withdrawn
 *   vs corrected) into the glossary so a reader encountering either number elsewhere recognises
 *   which one is current.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   WITHDRAWN: "mirror mean held pointwise" reading, Lambda ~ 0.1035 (seam) / 0.0809 (N1*) --
 *   inconsistent against the Palm neutral-lattice baseline, withdrawn at the point of citation.
 *   CORRECTED: Palm-profile flow model, Lambda ~ 0.1317 (seam, 2-slot) / 0.1178 (seam, 1-slot) /
 *   0.0990 (N1*, 2-slot) / 0.0900 (N1*, 1-slot) -- a model (heuristic), not a proved bound, built
 *   from the neutral Palm profile p(Y) rather than the inconsistent pointwise mean.
 *   AUDIT: imp-97085 swept src/data, src/pages, and src/components; zero surviving uncorrected
 *   citations; every other numeric coincidence of 0.1035/0.0809 is an unrelated decimal from a
 *   different measurement (e.g. imp-34268, viz-window1-landscape, imp-96333/imp-96270 ladders,
 *   zeros-to-1e6.js).
 *
 *   STATUS: documentation only, bakes an already-closed audit; no bound moved; NO QED.
 *   No refereed bound is changed; RH open.
 *
 * @see rh-bridge-mirror-descent-2026-09-25.js (source of both the withdrawal and the corrected
 *   Palm-profile model, section C1)
 * @see imp-97085-mirror-descent-withdrawn-citation-audit.js (source: the closed sweep this
 *   headword glosses)
 *
 * Ticket: imp-97110 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The withdrawn-vs-corrected headword, baked verbatim (no re-import).
const MIRROR_DESCENT_WITHDRAWN_AUDIT_HEADWORD = Object.freeze({
  key: 'mirror-descent-withdrawn-mean-pointwise-vs-corrected-palm-profile-model',
  term:
    'imp-97085 closed audit: the withdrawn mirror-mean-pointwise Lambda ~ 0.1035/0.0809 reading ' +
    'and the corrected Palm-profile flow model (Lambda ~ 0.132/0.118/0.099) that replaced it',
  definition:
    'The mirror-descent flow theorem (rh-bridge-mirror-descent-2026-09-25) originally reported ' +
    '"Lambda 0.1035 (seam) / 0.0809 (N1*) if the mirror mean held pointwise" -- but that pointwise ' +
    'reading is INCONSISTENT against the correct Palm (conditioned-on-a-zero) neutral-lattice ' +
    'baseline, because H_desc-mirror actually demands a local SURPLUS of ~1.73x the neutral ' +
    'mirror count, not merely "no shortage". The value was WITHDRAWN at the point of citation and ' +
    'replaced with a Palm-profile flow model: Lambda ~ 0.1317 (seam, 2-slot), 0.1178 (seam, ' +
    '1-slot), 0.0990 (N1*, 2-slot), 0.0900 (N1*, 1-slot) -- built from the neutral Palm profile ' +
    'p(Y) rather than the inconsistent pointwise mean. imp-97085 swept src/data, src/pages, and ' +
    'src/components for any surviving citation of the withdrawn value or its "no shortage" framing ' +
    'without the withdrawal note attached, and found none.',
  mechanism:
    'The corrected Palm-profile values are consistently LARGER than the withdrawn pointwise-mean ' +
    'values (0.1317 > 0.1035; 0.0990 > 0.0809) because the Palm baseline correctly conditions on ' +
    'the presence of a zero at the mirror point, which raises the neutral mirror-count floor the ' +
    'flow surplus is measured against. The corrected model remains a heuristic model, not a ' +
    'proved bound: both readings are pre-certificate estimates of the same flow-descent quantity, ' +
    'differing only in which neutral baseline they condition on.',
  verificationStatus:
    'Both values (withdrawn and corrected) are read verbatim from ' +
    'rh-bridge-mirror-descent-2026-09-25.js section C1 (withdrawnMeanPointwiseLambda: [0.1035, ' +
    '0.0809]; palmFlowLambdaModel: seam2slot 0.1317, seam1slot 0.1178, n1Star2slot 0.0990, ' +
    'n1Star1slot 0.0900). The imp-97085 sweep is a closed, zero-finding audit (no file needed ' +
    'patching). Documentation only; establishes no new numerical result; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97110_MIRROR_DESCENT_WITHDRAWN_AUDIT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97110',
  proofSection: 'S-frontier',
  glosses: 'imp-97085',
  question:
    'imp-97085 closed a sweep confirming no surviving uncorrected citation of the withdrawn ' +
    'mirror-mean-pointwise Lambda ~ 0.1035/0.0809 reading exists. Does the glossary record both ' +
    'the withdrawn reading and the corrected Palm-profile model that replaced it, so a future ' +
    'reader recognises which number is current wherever either appears?',
  headword: MIRROR_DESCENT_WITHDRAWN_AUDIT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97085 closed audit: the ' +
    'withdrawn "mirror mean held pointwise" reading (Lambda ~ 0.1035 seam / 0.0809 N1*) was an ' +
    'inconsistent baseline against the correct Palm neutral-lattice baseline, and was replaced by ' +
    'the Palm-profile flow model (Lambda ~ 0.1317 seam-2slot / 0.1178 seam-1slot / 0.0990 ' +
    'N1*-2slot / 0.0900 N1*-1slot). Zero surviving uncorrected citations found by the sweep. ' +
    'Establishes nothing new; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-97085-mirror-descent-withdrawn-citation-audit (the closed sweep this glosses); ' +
    'rh-bridge-mirror-descent-2026-09-25 (source of both the withdrawal and the corrected model, ' +
    'section C1).',
});

export default IMP97110_MIRROR_DESCENT_WITHDRAWN_AUDIT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97110_MIRROR_DESCENT_WITHDRAWN_AUDIT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97110-headword-names-both-models',
    why: 'The headword must name both the withdrawn reading and the corrected Palm-profile model ' +
      '-- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97110_MIRROR_DESCENT_WITHDRAWN_AUDIT_GLOSSARY_HEADWORD.headword;
      return (
        /0\.1035/.test(h.definition) &&
        /0\.0809/.test(h.definition) &&
        /0\.1317/.test(h.definition) &&
        /0\.0990/.test(h.definition) &&
        /WITHDRAWN/.test(h.definition)
      );
    },
  },
  {
    id: 'imp97110-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97110_MIRROR_DESCENT_WITHDRAWN_AUDIT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97110_MIRROR_DESCENT_WITHDRAWN_AUDIT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97110_MIRROR_DESCENT_WITHDRAWN_AUDIT_GLOSSARY_HEADWORD.verdict) &&
      IMP97110_MIRROR_DESCENT_WITHDRAWN_AUDIT_GLOSSARY_HEADWORD.glosses === 'imp-97085',
  },
];

for (const assertion of IMP97110_MIRROR_DESCENT_WITHDRAWN_AUDIT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97110-mirror-descent-withdrawn-audit-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
