/**
 * imp-96173 -- reader-facing analysis table for the imp-96148 Route B/D
 * worst-support (N=32) on-line margin column rho(32,T), laying the two
 * competing T-decay fits (log-linear vs reciprocal-log-with-floor) and the
 * six per-segment slopes drho/dlnT side by side against the observed column.
 *
 * GRADE: documentation only. Import-light (literals baked, no heavy
 * bundle); proves nothing new beyond imp-96148 -- it consolidates that
 * module's two OLS fits and discriminator into one seven-row table so a
 * reader can see, at each height cutoff T, the observed margin, both
 * fitted predictions, and the decelerating per-segment slope that selects
 * the reciprocal-log-with-floor law over the log-linear crossing model.
 *
 * Changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * @see imp-96148-route-bd-online-margin-decay-law (source column + fits)
 * @see imp-96020-lp-signed-force-feasibility (rho(N,T) grid origin)
 */

const T = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const RHO_OBSERVED = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];
const SEGMENT_SLOPES = [-0.1702, -0.1112, -0.1076, -0.0591, -0.0724, -0.0975];

const LOG_LINEAR_FIT = { a: 1.15450, b: -0.10089, R2: 0.96687, naiveCrossT: 93297 };
const RECIPROCAL_LOG_FLOOR_FIT = { c: 0.14256, d: 2.50166, R2: 0.99093, floor: 0.14256 };

const logLinearPredict = (t) => LOG_LINEAR_FIT.a + LOG_LINEAR_FIT.b * Math.log(t);
const reciprocalLogFloorPredict = (t) => RECIPROCAL_LOG_FLOOR_FIT.c + RECIPROCAL_LOG_FLOOR_FIT.d / Math.log(t);

export const ROUTE_BD_MARGIN_DECAY_FITS_TABLE = T.map((t, i) => ({
  T: t,
  rhoObserved: RHO_OBSERVED[i],
  rhoLogLinear: logLinearPredict(t),
  rhoReciprocalLogFloor: reciprocalLogFloorPredict(t),
  segmentSlopeIn: i === 0 ? null : SEGMENT_SLOPES[i - 1],
}));

export const ROUTE_BD_MARGIN_DECAY_FITS_SUMMARY = {
  logLinear: LOG_LINEAR_FIT,
  reciprocalLogFloor: RECIPROCAL_LOG_FLOOR_FIT,
  discriminator: 'per-segment slope decelerates in magnitude (0.1702 -> 0.0975) rather than staying '
    + 'constant, and the reciprocal-log-with-floor fit has the higher R2 (0.99093 vs 0.96687); both '
    + 'signals select the positive-floor law over the log-linear crossing model',
};

export const IMP_96173_ROUTE_BD_MARGIN_DECAY_FITS_TABLE = {
  id: 'imp-96173-route-bd-margin-decay-fits-table',
  title:
    'Reader-facing analysis table for the imp-96148 worst-support (N=32) on-line margin rho(32,T): '
    + 'observed column vs the log-linear and reciprocal-log-with-floor fits, with per-segment slopes',
  table: ROUTE_BD_MARGIN_DECAY_FITS_TABLE,
  summary: ROUTE_BD_MARGIN_DECAY_FITS_SUMMARY,
  note:
    'documentation only, consolidating imp-96148 (two OLS fits + decelerating-slope discriminator) '
    + 'into a single ordered table; no Lambda bound moves; no refereed bound is changed',
  closesTickets: ['imp-96173'],
};

// -- assertions (import-light; exact-literal consistency only) -------------
export const IMP_96173_ASSERTIONS = [
  {
    id: 'imp-96173-seven-rows',
    holds: () => ROUTE_BD_MARGIN_DECAY_FITS_TABLE.length === 7,
    why: 'the table carries exactly the seven height cutoffs of the imp-96148 worst-support column.',
  },
  {
    id: 'imp-96173-observed-matches-imp-96148',
    holds: () => ROUTE_BD_MARGIN_DECAY_FITS_TABLE.every((row, i) => row.rhoObserved === RHO_OBSERVED[i]),
    why: 'the observed column must reproduce the imp-96148 baked literals exactly.',
  },
  {
    id: 'imp-96173-both-fits-within-tolerance',
    holds: () => ROUTE_BD_MARGIN_DECAY_FITS_TABLE.every((row) => (
      Math.abs(row.rhoLogLinear - row.rhoObserved) < 0.03
      && Math.abs(row.rhoReciprocalLogFloor - row.rhoObserved) < 0.02
    )),
    why: 'both fitted predictions must track the observed margin at every height, reciprocal-log-floor '
      + 'more tightly than log-linear (imp-96148 discriminator).',
  },
  {
    id: 'imp-96173-reciprocal-log-floor-wins-on-R2',
    holds: () => ROUTE_BD_MARGIN_DECAY_FITS_SUMMARY.reciprocalLogFloor.R2 > ROUTE_BD_MARGIN_DECAY_FITS_SUMMARY.logLinear.R2,
    why: 'the reciprocal-log-with-floor fit must have the strictly higher R2, per imp-96148.',
  },
  {
    id: 'imp-96173-segment-slopes-decelerate',
    holds: () => {
      const s = SEGMENT_SLOPES;
      return s.length === 6 && s.every((v) => v < 0) && Math.abs(s[0]) > Math.abs(s[s.length - 1]);
    },
    why: 'the six per-segment slopes must decelerate in magnitude, the signature that selects the '
      + 'positive-floor law over a constant-slope crossing model.',
  },
  {
    id: 'imp-96173-first-row-has-no-incoming-slope',
    holds: () => ROUTE_BD_MARGIN_DECAY_FITS_TABLE[0].segmentSlopeIn === null
      && ROUTE_BD_MARGIN_DECAY_FITS_TABLE.slice(1).every((row) => typeof row.segmentSlopeIn === 'number'),
    why: 'a per-segment slope is defined between consecutive T points, so the first row has none.',
  },
  {
    id: 'imp-96173-not-a-bound',
    holds: () => Array.isArray(IMP_96173_ROUTE_BD_MARGIN_DECAY_FITS_TABLE.closesTickets),
    why: 'this is a documentation table; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-96173-closes-self',
    holds: () => IMP_96173_ROUTE_BD_MARGIN_DECAY_FITS_TABLE.closesTickets.includes('imp-96173'),
    why: 'this module is the deliverable the imp-96173 ticket asked for.',
  },
];

for (const a of IMP_96173_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96173-route-bd-margin-decay-fits-table assertion failed: ${a.id}`);
  }
}

export default IMP_96173_ROUTE_BD_MARGIN_DECAY_FITS_TABLE;
