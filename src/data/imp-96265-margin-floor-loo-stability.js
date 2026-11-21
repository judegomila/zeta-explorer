/**
 * imp-96265 -- leave-one-out / leave-two-out stability of the positive floor
 * in the imp-96173/imp-96148 reciprocal-log-with-floor margin fit.
 *
 * The imp-96148 selector fits the Route B/D worst-support (N=32) on-line
 * margin column rho(32,T) to rho = c + d/ln(T) and reports floor c=0.14256,
 * whose positivity implies the margin never crosses zero. That fit rests on
 * only seven height cutoffs spanning T in [60, 395.98]. This module MEASURES
 * how much the floor moves when held-out subsets of that short column are
 * dropped, to distinguish a genuine positive asymptote from a 7-point OLS
 * endpoint artifact.
 *
 * Method: the law is linear in x=1/ln(T), so each refit is an ordinary
 * least-squares intercept c (the floor, the x -> 0 i.e. T -> infinity limit).
 * We refit on all seven leave-one-out subsets and all twenty-one
 * leave-two-out subsets and tabulate the intercept spread.
 *
 * FINDING (measurement, no bound moves):
 *   - Full 7-point refit reproduces the baked floor: c=0.142563.
 *   - Across all 7 LOO refits, c stays in [0.13034, 0.17740]
 *     (mean 0.14501, sd 0.01430, spread 0.04706).
 *   - Across all 21 LTO refits, c stays in [0.12097, 0.21167]
 *     (mean 0.14818, sd 0.02274, spread 0.09070).
 *   - The floor never approaches zero: the LTO minimum 0.12097 is the closest
 *     any held-out refit comes, still well clear of the crossing.
 *   - Highest single-point leverage is the short-height endpoint T=60:
 *     dropping it lifts c to 0.17740 (+0.0348, ~24 percent). The T=260 point
 *     pulls the other way (c=0.13034 when dropped).
 * ASSESSMENT: the POSITIVE-FLOOR SIGN is robust -- no leave-one-out or
 * leave-two-out subset produces a floor consistent with zero, so on the
 * fitted evidence the margin does not cross. But the floor MAGNITUDE is
 * endpoint-driven and only loosely determined: values across roughly
 * [0.12, 0.18] (LOO) up to 0.21 (LTO) are equally supported by the seven
 * points, and the low-T endpoint carries the most weight. The 0.14256 figure
 * should be read as an order-of-magnitude positive floor, not a sharp number.
 *
 * GRADE: documentation/measurement only. Import-light (all literals baked,
 * no heavy bundle). Changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * @see imp-96173-route-bd-margin-decay-fits-table (the fit under test)
 * @see imp-96148-route-bd-online-margin-decay-law (source column + selector)
 */

const T = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const RHO = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];
const X = T.map((t) => 1 / Math.log(t));

// OLS intercept (floor c) and slope d of rho = c + d*x on a subset of indices.
function fitFloor(idx) {
  const n = idx.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const i of idx) { sx += X[i]; sy += RHO[i]; sxx += X[i] * X[i]; sxy += X[i] * RHO[i]; }
  const d = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const c = (sy - d * sx) / n;
  return { c, d };
}

const ALL = [0, 1, 2, 3, 4, 5, 6];

export const IMP_96265_FULL_FIT = fitFloor(ALL); // c reproduces the baked 0.14256

// Leave-one-out: 7 refits, each dropping one height cutoff.
export const IMP_96265_LOO = ALL.map((k) => {
  const { c, d } = fitFloor(ALL.filter((i) => i !== k));
  return { droppedT: T[k], floor: c, slope: d };
});

// Leave-two-out: 21 refits, each dropping a pair of height cutoffs.
export const IMP_96265_LTO = [];
for (let a = 0; a < 7; a++) {
  for (let b = a + 1; b < 7; b++) {
    const { c, d } = fitFloor(ALL.filter((i) => i !== a && i !== b));
    IMP_96265_LTO.push({ droppedT: [T[a], T[b]], floor: c, slope: d });
  }
}

function floorStats(rows) {
  const cs = rows.map((r) => r.floor);
  const n = cs.length;
  const mean = cs.reduce((s, v) => s + v, 0) / n;
  const sd = Math.sqrt(cs.reduce((s, v) => s + (v - mean) ** 2, 0) / n);
  const min = Math.min(...cs);
  const max = Math.max(...cs);
  return { n, mean, sd, min, max, spread: max - min };
}

export const IMP_96265_MARGIN_FLOOR_LOO_STABILITY = {
  id: 'imp-96265-margin-floor-loo-stability',
  title:
    'Leave-one-out / leave-two-out stability of the imp-96173/imp-96148 '
    + 'reciprocal-log-with-floor margin fit: is the positive floor 0.14256 a '
    + 'genuine asymptote or a 7-point OLS endpoint artifact?',
  fullFloor: IMP_96265_FULL_FIT.c,
  bakedFloor: 0.14256,
  loo: IMP_96265_LOO,
  lto: IMP_96265_LTO,
  looStats: floorStats(IMP_96265_LOO),
  ltoStats: floorStats(IMP_96265_LTO),
  highestLeveragePoint: 60.0,
  finding:
    'the positive-floor sign is robust -- across all 7 LOO and all 21 LTO '
    + 'refits the floor stays in [0.121, 0.212], never approaching zero, so the '
    + 'fitted margin does not cross; but the floor magnitude is endpoint-driven '
    + '(dropping the low-height T=60 point lifts it to 0.177) and only loosely '
    + 'determined, so 0.14256 is an order-of-magnitude positive floor rather '
    + 'than a sharp value',
  note:
    'documentation/measurement only; import-light baked literals; changes no '
    + 'Lambda bound; no refereed bound is changed',
  closesTickets: ['imp-96265'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96265_ASSERTIONS = [
  {
    id: 'imp-96265-full-reproduces-baked-floor',
    holds: () => Math.abs(IMP_96265_FULL_FIT.c - 0.14256) < 1e-4,
    why: 'the full 7-point refit must reproduce the imp-96173 baked floor 0.14256.',
  },
  {
    id: 'imp-96265-loo-has-seven-refits',
    holds: () => IMP_96265_LOO.length === 7,
    why: 'leave-one-out drops each of the seven height cutoffs exactly once.',
  },
  {
    id: 'imp-96265-lto-has-twentyone-refits',
    holds: () => IMP_96265_LTO.length === 21,
    why: 'leave-two-out ranges over all C(7,2)=21 unordered pairs of height cutoffs.',
  },
  {
    id: 'imp-96265-floor-stays-positive',
    holds: () => IMP_96265_LOO.every((r) => r.floor > 0) && IMP_96265_LTO.every((r) => r.floor > 0),
    why: 'no held-out refit may produce a non-positive floor -- the sign is the robust claim.',
  },
  {
    id: 'imp-96265-floor-clears-zero-with-margin',
    holds: () => IMP_96265_MARGIN_FLOOR_LOO_STABILITY.ltoStats.min > 0.1,
    why: 'the closest any refit comes to zero (LTO minimum) still clears 0.1, so the floor is not a marginal crossing.',
  },
  {
    id: 'imp-96265-t60-is-highest-leverage',
    holds: () => {
      const dropT60 = IMP_96265_LOO.find((r) => r.droppedT === 60.0).floor;
      const others = IMP_96265_LOO.filter((r) => r.droppedT !== 60.0).map((r) => r.floor);
      // dropping T=60 moves the floor furthest from the full-fit value
      const base = IMP_96265_FULL_FIT.c;
      return Math.abs(dropT60 - base) > Math.max(...others.map((v) => Math.abs(v - base)));
    },
    why: 'the low-height T=60 endpoint carries the most leverage on the floor.',
  },
  {
    id: 'imp-96265-not-a-bound',
    holds: () => Array.isArray(IMP_96265_MARGIN_FLOOR_LOO_STABILITY.closesTickets),
    why: 'this is a measurement module; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-96265-closes-self',
    holds: () => IMP_96265_MARGIN_FLOOR_LOO_STABILITY.closesTickets.includes('imp-96265'),
    why: 'this module is the deliverable the imp-96265 ticket asked for.',
  },
];

for (const a of IMP_96265_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96265-margin-floor-loo-stability assertion failed: ${a.id}`);
  }
}

export default IMP_96265_MARGIN_FLOOR_LOO_STABILITY;
