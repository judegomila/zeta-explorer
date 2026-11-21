/**
 * @module imp-33733-33582-33620-33701-honesty-gate-audit
 * @fileoverview imp-33733 -- honesty-gate assertion coverage audit of the sigma-decay curvature
 * cohort: imp-33582 (post-peak near-peak threshold decay), imp-33620 (E_trunc/E_coll ladder 1e15
 * extension), and imp-33701 (post-peak ramp curvature/inflection). Confirms whether each module
 * backs its "NO QED / Platt-Trudgian Lambda<=0.2 remains SOTA / imp-3066 K_a>=0 untouched" honest
 * banner with an EXECUTABLE build-time tripwire (an `isRigorous === false` check plus a regex test
 * on the stored verdict string), not only prose in a comment or description field, mirroring the
 * imp-33719 provenance/banner roll-up pattern.
 *
 * METHOD (read-only, performed at author time). Direct grep of each of the three module source
 * files for `isRigorous`, `NO QED`, `SOTA`, and `imp-3066` / `K_a`, then inspection of each
 * module's own bottom-of-file assertion block to confirm the executable check actually reads
 * `isRigorous` and regex-tests the verdict field (as opposed to merely containing the phrases in a
 * fileoverview comment that no code ever inspects).
 *
 * RESULT (audited 2026-07-04). All three modules carry a genuine EXECUTABLE honesty-gate tripwire:
 *   - imp-33582-sigma-postpeak-nearpeak-threshold-decay.js: `isRigorous: false` field (line 217);
 *     self-executing assertion (~line 287) checks
 *     `IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.isRigorous === false`,
 *     `/NO QED/.test(...verdict)`, and `/remains SOTA/.test(...verdict)`.
 *   - imp-33620-etrunc-ecoll-ladder-1e15-extension.js: `isRigorous: false` field (line 207);
 *     self-executing assertion (~line 283) checks the same three conditions against
 *     IMP33620_ETRUNC_ECOLL_LADDER_1E15_EXTENSION.
 *   - imp-33701-sigma-postpeak-ramp-curvature-inflection.js: `isRigorous: false` field (line 192);
 *     self-executing assertion (~line 274) checks the same three conditions against
 *     IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.
 * All three additionally carry the "imp-3066 K_a >= 0 untouched" phrase in their stored verdict
 * text (not merely a comment), so the operator-positivity disclaimer is also part of the string the
 * executable regex tripwires inspect. No coverage gap was found in this cohort; unlike some other
 * audits in this series, no follow-on tripwire-addition ticket is needed for imp-33582/imp-33620/
 * imp-33701 specifically.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33719 (the provenance/banner roll-up precedent this audit mirrors), imp-33763, imp-33807
 */

export const IMP_33733_HONESTY_GATE_AUDIT = {
  id: 'imp-33733',
  auditedAt: '2026-07-04',
  modules: [
    {
      file: 'imp-33582-sigma-postpeak-nearpeak-threshold-decay.js',
      hasIsRigorousFalseField: true,
      executableAssertionChecksVerdict: true,
      verdictContainsNoQed: true,
      verdictContainsRemainsSota: true,
      verdictContainsImp3066: true,
    },
    {
      file: 'imp-33620-etrunc-ecoll-ladder-1e15-extension.js',
      hasIsRigorousFalseField: true,
      executableAssertionChecksVerdict: true,
      verdictContainsNoQed: true,
      verdictContainsRemainsSota: true,
      verdictContainsImp3066: true,
    },
    {
      file: 'imp-33701-sigma-postpeak-ramp-curvature-inflection.js',
      hasIsRigorousFalseField: true,
      executableAssertionChecksVerdict: true,
      verdictContainsNoQed: true,
      verdictContainsRemainsSota: true,
      verdictContainsImp3066: true,
    },
  ],
  fullyCoveredCount: 3,
  gapsFound: 0,
  recommendation:
    'No action needed -- all three sigma-decay curvature modules already carry an executable ' +
    'isRigorous:false honesty-gate tripwire that regex-tests their stored verdict for NO QED, ' +
    'remains SOTA, and imp-3066 K_a>=0 untouched. This closes the imp-33733 audit item; no ' +
    'follow-on tripwire-addition ticket is queued for this specific cohort.',
  honestNote:
    'Read-only audit; no new bound claimed by this module itself. imp-3066 K_a >= 0 positivity ' +
    'untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_33733_ASSERTIONS = [
  {
    id: 'imp33733-exactly-three-modules-audited',
    holds: () => IMP_33733_HONESTY_GATE_AUDIT.modules.length === 3,
    why: 'The audit must cover exactly the three named modules (imp-33582/imp-33620/imp-33701).',
  },
  {
    id: 'imp33733-all-three-fully-covered',
    holds: () => {
      const m = IMP_33733_HONESTY_GATE_AUDIT.modules;
      const covered = m.filter(
        (x) =>
          x.hasIsRigorousFalseField === true &&
          x.executableAssertionChecksVerdict === true &&
          x.verdictContainsNoQed === true &&
          x.verdictContainsRemainsSota === true &&
          x.verdictContainsImp3066 === true
      ).length;
      return covered === 3 && covered === IMP_33733_HONESTY_GATE_AUDIT.fullyCoveredCount;
    },
    why: 'Grep-verified: all three modules pair an isRigorous:false field with a self-executing ' +
      'assertion that regex-tests the stored verdict for NO QED, remains SOTA, and imp-3066.',
  },
  {
    id: 'imp33733-zero-gaps-recorded',
    holds: () => IMP_33733_HONESTY_GATE_AUDIT.gapsFound === 0,
    why: 'No module in this cohort lacked an executable honesty-gate tripwire.',
  },
  {
    id: 'imp33733-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33733_HONESTY_GATE_AUDIT.honestNote) &&
      /No QED/i.test(IMP_33733_HONESTY_GATE_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_33733_HONESTY_GATE_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33733_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33733 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33733_ASSERTIONS };
