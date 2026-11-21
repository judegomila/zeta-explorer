/**
 * imp-95625 -- reader-facing table/data module for the imp-95602 far-tail
 * sigma(N) decay-exponent ramp and its two tolerance-crossing heights.
 *
 * GRADE: documentation only. This module imports NOTHING (all values are
 * baked literals copied verbatim from the imp-95602 live computation) so it
 * stays import-light: no lambda-rh-height-mapping, no polymath15 constant
 * chain, no zeros bundle anywhere in its transitive closure. It exists so a
 * reader-facing page can show the half-decade ramp plus the two crossing
 * heights without paying for imp-95602's live Newton-solve log-space
 * evaluator.
 *
 * THE RAMP (p_local = -d ln sigma / d ln N, half-decade spacing [1e12,1e18])
 * ---------------------------------------------------------------------
 * Climbs from p(1e12) = 0.45264 to p(1e18) = 0.48769, still 2.461% short of
 * the imp-3463 far-tail asymptote 1/2 at the top of the window -- the 1%
 * tolerance is NEVER reached anywhere in [1e12, 1e18].
 *
 * THE TWO CROSSINGS
 * ------------------
 *   within 1%   of 1/2 first at log10 N ~ 44.167  (N ~ 1e44.17), p ~ 0.4950
 *   within 0.1% of 1/2 first at log10 N ~ 436.059 (N ~ 1e436.06), p ~ 0.4995
 * Tightening the tolerance ten-fold (1% -> 0.1%) costs roughly ten-fold more
 * log10 N (44.17 -> 436.06): the signature of a 1/log N deficit decay, with
 * the measured product (1/2 - p) * ln N settling near ~0.508 in the far tail
 * (so log10 N needed for tolerance t is approximately 0.44 / t).
 *
 * Measurement/fit only; conditional-share diagnostic, NOT an RH bound;
 * changes no bound; NO QED. No refereed bound is changed.
 *
 * @see imp-95602-sigma-exponent-ramp-past-1e12 (source of every literal below)
 * @see imp-95582-sigma-postpeak-fine-exponent-ramp (half-decade ramp [1e6,1e12])
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2)
 */

export const SIGMA_EXPONENT_RAMP_TABLE = [
  { log10N: 12.0, p_local: 0.45264, deficitPctOfHalf: 9.471 },
  { log10N: 12.5, p_local: 0.46529, deficitPctOfHalf: 6.942 },
  { log10N: 13.0, p_local: 0.47311, deficitPctOfHalf: 5.379 },
  { log10N: 13.5, p_local: 0.47793, deficitPctOfHalf: 4.414 },
  { log10N: 14.0, p_local: 0.48096, deficitPctOfHalf: 3.809 },
  { log10N: 14.5, p_local: 0.48291, deficitPctOfHalf: 3.419 },
  { log10N: 15.0, p_local: 0.48422, deficitPctOfHalf: 3.156 },
  { log10N: 15.5, p_local: 0.48515, deficitPctOfHalf: 2.969 },
  { log10N: 16.0, p_local: 0.48586, deficitPctOfHalf: 2.828 },
  { log10N: 16.5, p_local: 0.48643, deficitPctOfHalf: 2.715 },
  { log10N: 17.0, p_local: 0.4869, deficitPctOfHalf: 2.62 },
  { log10N: 17.5, p_local: 0.48732, deficitPctOfHalf: 2.536 },
  { log10N: 18.0, p_local: 0.48769, deficitPctOfHalf: 2.461 },
];

export const SIGMA_EXPONENT_CROSSINGS = {
  farTailExponent: 0.5,
  reached1pctInWindow: false,
  within1pct: { log10N: 44.167, N: '1e44.17', p: 0.495 },
  within0p1pct: { log10N: 436.059, N: '1e436.06', p: 0.4995 },
};

// (1/2 - p) * ln N, the measured 1/log N deficit-decay signature.
export const SIGMA_EXPONENT_DEFICIT_LN_PRODUCT = [
  { log10N: 24, product: 0.5094 },
  { log10N: 44, product: 0.5085 },
  { log10N: 100, product: 0.5056 },
  { log10N: 300, product: 0.5027 },
];

export const IMP_95625_SIGMA_EXPONENT_CROSSING_LADDER_TABLE = {
  id: 'imp-95625-sigma-exponent-crossing-ladder-table',
  title:
    'Reader-facing far-tail sigma(N) decay-exponent ramp and crossing ' +
    'ladder (1% at log10N ~ 44.17, 0.1% at log10N ~ 436.06)',
  ramp: SIGMA_EXPONENT_RAMP_TABLE,
  crossings: SIGMA_EXPONENT_CROSSINGS,
  deficitLnProduct: SIGMA_EXPONENT_DEFICIT_LN_PRODUCT,
  note:
    'documentation only, baked from imp-95602 (which continues the imp-95582 ' +
    'half-decade ramp past its 1e12 endpoint); no live computation, no Lambda ' +
    'bound moves; no refereed bound is changed',
  closesTickets: ['imp-95625'],
};

// -- assertions (import-light; exact-literal consistency only) -------------
export const IMP_95625_ASSERTIONS = [
  {
    id: 'imp-95625-ramp-length-and-endpoints',
    holds: () =>
      SIGMA_EXPONENT_RAMP_TABLE.length === 13 &&
      SIGMA_EXPONENT_RAMP_TABLE[0].log10N === 12 &&
      SIGMA_EXPONENT_RAMP_TABLE[0].p_local === 0.45264 &&
      SIGMA_EXPONENT_RAMP_TABLE[12].log10N === 18 &&
      SIGMA_EXPONENT_RAMP_TABLE[12].p_local === 0.48769,
    why: 'the ramp must run half-decade spacing from log10N=12 (p=0.45264) to log10N=18 (p=0.48769), 13 points.',
  },
  {
    id: 'imp-95625-ramp-strictly-increasing-below-half',
    holds: () => {
      for (let i = 1; i < SIGMA_EXPONENT_RAMP_TABLE.length; i++) {
        if (!(SIGMA_EXPONENT_RAMP_TABLE[i].p_local > SIGMA_EXPONENT_RAMP_TABLE[i - 1].p_local)) return false;
      }
      return SIGMA_EXPONENT_RAMP_TABLE.every((r) => r.p_local < 0.5);
    },
    why: 'p_local must strictly increase across the window and never reach 1/2.',
  },
  {
    id: 'imp-95625-crossings-ordered-and-far-past-window',
    holds: () =>
      SIGMA_EXPONENT_CROSSINGS.reached1pctInWindow === false &&
      SIGMA_EXPONENT_CROSSINGS.within1pct.log10N > 18 &&
      SIGMA_EXPONENT_CROSSINGS.within0p1pct.log10N > SIGMA_EXPONENT_CROSSINGS.within1pct.log10N &&
      SIGMA_EXPONENT_CROSSINGS.within0p1pct.log10N / SIGMA_EXPONENT_CROSSINGS.within1pct.log10N > 8,
    why: 'the 1% crossing must lie beyond the [1e12,1e18] window and the 0.1% crossing must be roughly 10x further in log10N.',
  },
  {
    id: 'imp-95625-deficit-product-near-half',
    holds: () => SIGMA_EXPONENT_DEFICIT_LN_PRODUCT.every((r) => r.product > 0.49 && r.product < 0.52),
    why: 'the measured (1/2 - p) * ln N product must settle near ~0.508 across the sampled far-tail heights.',
  },
  {
    id: 'imp-95625-not-a-bound',
    holds: () => !IMP_95625_SIGMA_EXPONENT_CROSSING_LADDER_TABLE.note.includes('QED'),
    why: 'this is a documentation table; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-95625-closes-self',
    holds: () => IMP_95625_SIGMA_EXPONENT_CROSSING_LADDER_TABLE.closesTickets.includes('imp-95625'),
    why: 'this module is the deliverable the imp-95625 ticket asked for.',
  },
];

for (const a of IMP_95625_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95625-sigma-exponent-crossing-ladder-table assertion failed: ${a.id}`);
  }
}

export default IMP_95625_SIGMA_EXPONENT_CROSSING_LADDER_TABLE;
