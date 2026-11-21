/**
 * imp-95609 -- reader-facing analysis table for the imp-95457 five-rung
 * seam-Gram every-octave onset ladder.
 *
 * GRADE: documentation only. This module imports no heavy bundle and
 * proves nothing new; it consolidates the imp-95457 status note (which
 * itself restates imp-95335/imp-95419/imp-95475) into a single ordered
 * table with the two supersession factors and the SPLIT-OPT/SPLIT-RZ
 * block-vs-scalar attribution, so a reader gets all five rungs in one
 * place instead of the two-point comparisons in the earlier
 * imp-95305/imp-95319 viz pages.
 *
 * FIVE-RUNG LADDER (increasing onset):
 *   1. SPLIT-RZ     (lattice-pinned)          15.981584
 *   2. SPLIT-OPT    (off-lattice, m-uniform)  20.593144
 *   3. SPLIT-SEP    (off-lattice, superseded) 23.157604
 *   4. SPLIT-LOO    (lattice-only)            27.035582
 *   5. XSTAR_UNIF   (unbounded-count firing)  27.035582
 *
 * Rungs 4 and 5 coincide exactly (imp-95475 verified XSTAR_UNIF is
 * robust to the PhiUnif tightening and matches SPLIT-LOO within one
 * ulp), so the ladder has five NAMED rungs but four DISTINCT onset
 * values.
 *
 * ATTRIBUTION. imp-95419 THEOREM SEP-OPT collapsed the imp-95335
 * two-sided bracket [A_sep, A_lat] at its top, superseding A_sep by
 * 52.4666x (delta = ln 2) / 133.5447x (delta = ln 1.3). That closure
 * moves the off-lattice onset SPLIT-SEP -> SPLIT-OPT (23.157604 ->
 * 20.593144, a 2.564460 depth-unit drop). The residual gap
 * SPLIT-OPT - SPLIT-RZ = 4.611560 is attributed to BLOCK structure
 * (a scalar per-pair floor vs. the lattice's sharper twin-pair symbol),
 * not to scalar-floor slack -- that slack is gone after SEP-OPT.
 *
 * Changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * @see imp-95457-off-lattice-riesz-floor-status-note (source WHAT-REMAINS ledger)
 * @see imp-95335-ingham-offlattice-riesz-floor (original bracket [A_sep, A_lat])
 * @see imp-95419-separated-class-optimal-riesz-floor (THEOREM SEP-OPT)
 * @see imp-95475-xstar-unif-onset-robust-honest-status (XSTAR_UNIF robustness)
 */

export const SEAM_GRAM_ONSET_LADDER_TABLE = [
  {
    rank: 1,
    rung: 'SPLIT-RZ',
    kind: 'lattice-pinned',
    onset: 15.981584,
    note: 'sharpest rung; twin-pair Toeplitz symbol, not ported off-lattice',
  },
  {
    rank: 2,
    rung: 'SPLIT-OPT',
    kind: 'off-lattice, m-uniform',
    onset: 20.593144,
    note: 'imp-95419 THEOREM SEP-OPT class-optimal scalar floor A_opt(delta) = A_lat(delta)',
  },
  {
    rank: 3,
    rung: 'SPLIT-SEP',
    kind: 'off-lattice, superseded',
    onset: 23.157604,
    note: 'imp-95335 Ingham-type floor A_sep; superseded by SPLIT-OPT (52.4666x / 133.5447x)',
  },
  {
    rank: 4,
    rung: 'SPLIT-LOO',
    kind: 'lattice-only',
    onset: 27.035582,
    note: 'leave-one-out multiblock certificate, exact match to XSTAR_UNIF',
  },
  {
    rank: 5,
    rung: 'XSTAR_UNIF',
    kind: 'unbounded-count firing',
    onset: 27.035582,
    note: 'imp-95475: robust to PhiUnif tightening, matches SPLIT-LOO within one ulp',
  },
];

export const SEAM_GRAM_ONSET_LADDER_ATTRIBUTION = {
  supersessionLn2: 52.46661734874133,
  supersessionLn13: 133.54473330726987,
  onsetDropSplitSepToSplitOpt: 2.564460,
  residualGapSplitOptToSplitRz: 4.611560,
  residualGapAttribution: 'BLOCK structure (scalar per-pair floor vs. lattice twin-pair symbol), not scalar-floor slack',
  boundChange: false,
  qed: false,
};

export const IMP_95609_SEAM_GRAM_ONSET_LADDER_TABLE = {
  id: 'imp-95609-seam-gram-onset-ladder-table',
  title:
    'Reader-facing five-rung seam-Gram every-octave onset ladder table ' +
    '(SPLIT-RZ < SPLIT-OPT < SPLIT-SEP < SPLIT-LOO = XSTAR_UNIF)',
  table: SEAM_GRAM_ONSET_LADDER_TABLE,
  attribution: SEAM_GRAM_ONSET_LADDER_ATTRIBUTION,
  note:
    'documentation only, consolidating imp-95457 (status note), imp-95335 ' +
    '(A_sep bracket), imp-95419 (THEOREM SEP-OPT), and imp-95475 ' +
    '(XSTAR_UNIF robustness) into a single ordered table; no Lambda bound ' +
    'moves; no refereed bound is changed',
  closesTickets: ['imp-95609'],
};

// -- assertions (import-light; exact-literal consistency only) -------------
export const IMP_95609_ASSERTIONS = [
  {
    id: 'imp-95609-five-rungs',
    holds: () => SEAM_GRAM_ONSET_LADDER_TABLE.length === 5,
    why: 'the ladder names exactly five rungs: SPLIT-RZ, SPLIT-OPT, SPLIT-SEP, SPLIT-LOO, XSTAR_UNIF.',
  },
  {
    id: 'imp-95609-strict-then-tied-ordering',
    holds: () => {
      const onsets = SEAM_GRAM_ONSET_LADDER_TABLE.map((r) => r.onset);
      return (
        onsets[0] < onsets[1] &&
        onsets[1] < onsets[2] &&
        onsets[2] < onsets[3] &&
        onsets[3] === onsets[4]
      );
    },
    why: 'onsets must strictly increase SPLIT-RZ < SPLIT-OPT < SPLIT-SEP < SPLIT-LOO, with SPLIT-LOO exactly equal to XSTAR_UNIF.',
  },
  {
    id: 'imp-95609-supersession-matches-imp-95419',
    holds: () =>
      SEAM_GRAM_ONSET_LADDER_ATTRIBUTION.supersessionLn2 === 52.46661734874133 &&
      SEAM_GRAM_ONSET_LADDER_ATTRIBUTION.supersessionLn13 === 133.54473330726987,
    why: 'the supersession factors must match the imp-95419 baked literals exactly.',
  },
  {
    id: 'imp-95609-gap-arithmetic',
    holds: () => {
      const t = SEAM_GRAM_ONSET_LADDER_TABLE;
      const dropOk = Math.abs((t[2].onset - t[1].onset) - SEAM_GRAM_ONSET_LADDER_ATTRIBUTION.onsetDropSplitSepToSplitOpt) < 1e-6;
      const gapOk = Math.abs((t[1].onset - t[0].onset) - SEAM_GRAM_ONSET_LADDER_ATTRIBUTION.residualGapSplitOptToSplitRz) < 1e-6;
      return dropOk && gapOk;
    },
    why: 'the recorded drop and residual gap must reconcile with the table onsets to within 1e-6.',
  },
  {
    id: 'imp-95609-not-a-bound',
    holds: () => SEAM_GRAM_ONSET_LADDER_ATTRIBUTION.boundChange === false && SEAM_GRAM_ONSET_LADDER_ATTRIBUTION.qed === false,
    why: 'this is a documentation table; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-95609-closes-self',
    holds: () => IMP_95609_SEAM_GRAM_ONSET_LADDER_TABLE.closesTickets.includes('imp-95609'),
    why: 'this module is the deliverable the imp-95609 ticket asked for.',
  },
];

for (const a of IMP_95609_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95609-seam-gram-onset-ladder-table assertion failed: ${a.id}`);
  }
}

export default IMP_95609_SEAM_GRAM_ONSET_LADDER_TABLE;
