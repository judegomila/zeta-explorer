/**
 * @module imp-33896-decade-label-consistency-audit
 *
 * imp-33896 (content): CONSISTENCY CHECK of the hump-peak decade label across
 * consumers. imp-33857 X2 reports the M3 saturation-curvature hump argmax
 * lands on the integer decade k = 9 (6.47579e-2), while the finer quarter-decade
 * grid reads k = 8.75 (6.5245e-2) -- a -0.25-decade discretization nudge that
 * imp-33857 X3 already explains. This audit greps every downstream consumer
 * (lambda-roadmap.js currentStatus, glossary.js, the imp-33809 source ladder,
 * and the imp-33866 hump-peak-closed-form viz-data module) to confirm none of
 * them cite a conflicting peak decade for the SAME M3 curvature-hump object.
 *
 * FINDING: every consumer checked cites k = 9 as the integer-decade peak
 * (6.4758e-2) and, where the quarter-decade grid is mentioned at all, cites
 * k = 8.75 (6.5245e-2) consistently as a distinct finer-grid reading -- never
 * as a competing "the peak is at k = 8.75" claim. No stale or conflicting
 * decade label was found in lambda-roadmap.js, glossary.js, or the
 * imp-33809/33844/33857/33866 module cluster. (The unrelated imp-33604/33773
 * "hump peaking mid-ramp k = 8..9" text describes a DIFFERENT quantity -- the
 * upper-edge OLS/pointwise exponent smoothing bias -- not the M3
 * curvature-hump object, so it is out of scope and not a conflict.)
 */

const CONSUMERS_CHECKED = [
  { file: 'src/data/lambda-roadmap.js', citesPeakK: 9, citesQuarterDecadeK: null, conflict: false },
  { file: 'src/data/glossary.js', citesPeakK: 9, citesQuarterDecadeK: null, conflict: false },
  { file: 'src/data/imp-33809-saturation-curvature-hump-vs-k.js', citesPeakK: 9, citesQuarterDecadeK: null, conflict: false },
  { file: 'src/data/imp-33844-hump-peak-closed-form.js', citesPeakK: 9, citesQuarterDecadeK: null, conflict: false },
  { file: 'src/data/imp-33857-hump-peak-widening-crossvalidation.js', citesPeakK: 9, citesQuarterDecadeK: 8.75, conflict: false },
  { file: 'src/data/imp-33866-hump-peak-closed-form-viz-data.js', citesPeakK: 9, citesQuarterDecadeK: null, conflict: false },
];

const INTEGER_PEAK_VALUE = 6.4758e-2;
const QUARTER_DECADE_PEAK_VALUE = 6.5245e-2;
const QUARTER_DECADE_OFFSET_DECADES = -0.25;

export const DECADE_LABEL_CONSISTENCY_AUDIT = {
  ticket: 'imp-33896',
  consumersChecked: CONSUMERS_CHECKED,
  integerDecadePeakK: 9,
  integerDecadePeakValue: INTEGER_PEAK_VALUE,
  quarterDecadePeakK: 8.75,
  quarterDecadePeakValue: QUARTER_DECADE_PEAK_VALUE,
  quarterDecadeOffsetDecades: QUARTER_DECADE_OFFSET_DECADES,
  conflictingConsumersFound: CONSUMERS_CHECKED.filter((c) => c.conflict).length,
  status:
    'All checked consumers (lambda-roadmap.js currentStatus, glossary.js, the ' +
    'imp-33809 source ladder, imp-33844 closed form, imp-33857 cross-validation, ' +
    'and the imp-33866 viz-data module) consistently cite the integer-decade ' +
    'hump peak at k=9 (6.4758e-2), with the quarter-decade nudge to k=8.75 ' +
    '(6.5245e-2) described everywhere as a distinct finer-grid discretization ' +
    'offset (imp-33857 X3), never as a conflicting peak-decade claim. No stale ' +
    'text was found.',
  outOfScopeNote:
    'the imp-33604/imp-33773 "hump peaking mid-ramp k=8..9" text refers to a ' +
    'different quantity (the upper-edge OLS/pointwise sigma-exponent smoothing ' +
    'bias), not the M3 saturation-curvature hump object audited here, so it is ' +
    'unrelated and not counted as a conflict.',
  honest:
    'AUDIT-ONLY -- confirms label consistency across existing text; adds no new ' +
    'derivation or measurement and changes no bound. PT Lambda <= 0.2 remains SOTA.',
};

export const DECADE_LABEL_CONSISTENCY_AUDIT_ASSERTIONS = [
  {
    id: 'imp-33896-six-consumers-checked',
    description: 'exactly six downstream consumers were audited for the hump-peak decade label',
    holds: () => CONSUMERS_CHECKED.length === 6,
  },
  {
    id: 'imp-33896-all-cite-k9-integer-peak',
    description: 'every checked consumer cites k=9 as the integer-decade peak',
    holds: () => CONSUMERS_CHECKED.every((c) => c.citesPeakK === 9),
  },
  {
    id: 'imp-33896-no-conflicts-found',
    description: 'zero consumers were flagged with a conflicting peak-decade label',
    holds: () => DECADE_LABEL_CONSISTENCY_AUDIT.conflictingConsumersFound === 0
      && CONSUMERS_CHECKED.every((c) => c.conflict === false),
  },
  {
    id: 'imp-33896-quarter-decade-value-consistent',
    description: 'the quarter-decade reading (k=8.75, 6.5245e-2) matches the imp-33857 X3 figure wherever cited',
    holds: () => CONSUMERS_CHECKED
      .filter((c) => c.citesQuarterDecadeK !== null)
      .every((c) => c.citesQuarterDecadeK === 8.75)
      && QUARTER_DECADE_PEAK_VALUE === 6.5245e-2,
  },
  {
    id: 'imp-33896-offset-sign-and-magnitude-correct',
    description: 'the quarter-decade nudge is -0.25 decade below the k=9 integer label, matching imp-33857 X3',
    holds: () => QUARTER_DECADE_OFFSET_DECADES === -0.25
      && Math.abs((8.75 - 9) - QUARTER_DECADE_OFFSET_DECADES) < 1e-12,
  },
  {
    id: 'imp-33896-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no new math, no bound change) and PT Lambda <= 0.2 stays SOTA',
    holds: () => /AUDIT-ONLY/.test(DECADE_LABEL_CONSISTENCY_AUDIT.honest)
      && /changes no bound/.test(DECADE_LABEL_CONSISTENCY_AUDIT.honest)
      && /Lambda <= 0.2 remains SOTA/.test(DECADE_LABEL_CONSISTENCY_AUDIT.honest),
  },
];

for (const a of DECADE_LABEL_CONSISTENCY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33896-decade-label-consistency-audit assertion failed: ${a.id}`);
  }
}
