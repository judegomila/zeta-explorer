/**
 * imp-95149-bl-lat-residual-cross-link -- explicit residual-to-obligation
 * map for the imp-95226 COROLLARY BL-LAT lattice-skeleton delivery, so its
 * two named residuals (in-octave multiplicity, off-lattice rates) are never
 * double-counted against the still-open WEIGHT and MODULUS/PHASE legs of
 * the imp-95142 signed-certificate obligation ledger.
 *
 * GRADE: documentation only. This module imports no heavy bundle and
 * produces no new certificate; it cross-references verdicts already
 * recorded in imp-95226, imp-95133, imp-95249, and imp-95250.
 *
 * The point: BL-LAT is delivered ONLY on the geometric-lattice skeleton
 * (one rate per lattice site). Moving off that skeleton costs along FOUR
 * independent axes, and closing one axis says nothing about the others:
 *   (a) in-octave multiplicity  -- FENCED (not closed) by seam legs 24/25
 *   (b) off-lattice perturbation -- fully OPEN, untouched by seam legs 24/25
 *   (c) weight-discounted composition -- a separate OPEN leg (imp-95133)
 *   (d) per-window modulus/phase currency -- a separate OPEN leg, unscoped
 *
 * Source: imp-95226 (COROLLARY BL-LAT honest-scope paragraph), imp-95133
 * (WP-A/WP-B weight-leg scoping), imp-95249 (THEOREM SPLIT-2 seam leg 24),
 * imp-95250 (THEOREM SPLIT-LOO seam leg 25), imp-95142 (obligation ledger
 * roll-up this module cross-links against).
 */

export const BL_LAT_RESIDUAL_CROSS_LINK = [
  {
    residual: 'in-octave multiplicity',
    definedIn: 'imp-95226 COROLLARY BL-LAT (named residual)',
    axis: 'how many rates land on the same lattice site',
    status: 'FENCED (not closed)',
    addressedBy:
      'imp-95249 seam leg 24 (single tight pair, honest scope) and ' +
      'imp-95250 seam leg 25 (every-octave pair, m-and-r-uniform); both ' +
      'fence a collar above the exact pencil, neither is a block ' +
      'Riesz-basis closure and >= 3 rates per octave stays open',
    distinctFrom: ['off-lattice perturbation', 'WEIGHT', 'MODULUS/PHASE'],
  },
  {
    residual: 'off-lattice rates',
    definedIn: 'imp-95226 COROLLARY BL-LAT (named residual)',
    axis: 'how far a rate sits from its nearest lattice site',
    status: 'OPEN (untouched)',
    addressedBy:
      'no ticket in the imp-95221..95250 signed-certificate chain attempts ' +
      'this axis; seam legs 24/25 stay on-lattice and only add multiplicity',
    distinctFrom: ['in-octave multiplicity', 'WEIGHT', 'MODULUS/PHASE'],
  },
  {
    residual: 'WEIGHT (weight-discounted composition)',
    definedIn: 'imp-95142 obligation ledger leg, scoped by imp-95133',
    axis: 'per-octave discount factor at a fixed rate count, no multiplicity or off-lattice cost involved',
    status: 'OPEN',
    addressedBy:
      'imp-95133: WP-A (naive per-octave product) REFUTED, WP-B ' +
      '(coupling-aware H-inf product) valid but VACUOUS by ~1.85e8; ' +
      'unrelated to the BL-LAT residuals above even at one rate per site',
    distinctFrom: ['in-octave multiplicity', 'off-lattice perturbation', 'MODULUS/PHASE'],
  },
  {
    residual: 'MODULUS/PHASE (per-window currency)',
    definedIn: 'imp-95142 obligation ledger leg',
    axis: 'per-window modulus/phase accounting, orthogonal to count and weight',
    status: 'OPEN (unscoped)',
    addressedBy: 'no candidate certificate attempted yet',
    distinctFrom: ['in-octave multiplicity', 'off-lattice perturbation', 'WEIGHT'],
  },
];

export const IMP_95149_BL_LAT_RESIDUAL_CROSS_LINK = {
  id: 'imp-95149-bl-lat-residual-cross-link',
  title:
    'imp-95226 BL-LAT lattice-skeleton residuals cross-linked against the ' +
    'imp-95142 WEIGHT/MODULUS-PHASE legs: four independent axes ' +
    '(in-octave multiplicity FENCED, off-lattice OPEN, WEIGHT OPEN, ' +
    'MODULUS/PHASE OPEN), none subsumes another',
  rows: BL_LAT_RESIDUAL_CROSS_LINK,
  note:
    'closing seam legs 24/25 (in-octave multiplicity) leaves the ' +
    'off-lattice, WEIGHT, and MODULUS/PHASE axes exactly as open as ' +
    'before -- no double-counting. NO QED. No bound of the Lambda ' +
    'program changes here.',
};

// ── assertions (import-light; exact-literal consistency only) ───────────────
export const IMP_95149_ASSERTIONS = [
  {
    id: 'imp-95149-four-axes-exhaustive',
    holds: () => BL_LAT_RESIDUAL_CROSS_LINK.length === 4,
    why: 'the BL-LAT residual cross-link covers exactly four independent axes: in-octave multiplicity, off-lattice rates, WEIGHT, and MODULUS/PHASE.',
  },
  {
    id: 'imp-95149-no-axis-lists-itself',
    holds: () =>
      BL_LAT_RESIDUAL_CROSS_LINK.every(
        (row) => !row.distinctFrom.some((other) => row.residual.startsWith(other))
      ),
    why: 'each row must list the OTHER three axes as distinct, never itself, so the map cannot be misread as circular.',
  },
  {
    id: 'imp-95149-fenced-axis-unique',
    holds: () =>
      BL_LAT_RESIDUAL_CROSS_LINK.filter((row) => row.status.startsWith('FENCED')).length === 1,
    why: 'only the in-octave-multiplicity axis is FENCED by seam legs 24/25; the other three axes remain fully OPEN, per imp-95226/imp-95133.',
  },
  {
    id: 'imp-95149-open-axes-count',
    holds: () =>
      BL_LAT_RESIDUAL_CROSS_LINK.filter((row) => row.status.startsWith('OPEN')).length === 3,
    why: 'off-lattice rates, WEIGHT, and MODULUS/PHASE are the three axes left untouched by the seam-leg fences.',
  },
  {
    id: 'imp-95149-not-a-bound',
    holds: () => IMP_95149_BL_LAT_RESIDUAL_CROSS_LINK.note.includes('NO QED'),
    why: 'this module only cross-links named residuals against existing open legs; it asserts no bound and no QED.',
  },
];
